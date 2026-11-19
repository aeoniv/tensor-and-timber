import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import {
  CabinetStyleOptions,
  HardwareTierId,
  MdfFinishOption,
} from '../data/pricingCatalog';
import {
  CounterTone,
  buildCabinetModulesGroup,
  buildRoomShellGroup,
  exportObjectToOBJDownload,
} from '../services/parametricCabinetBuilder';
import { RoomAnalysisResult } from '../services/roomAnalyzerService';

export class RoomSceneViewer {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private animId: number = 0;

  private rootGroup: THREE.Group;
  private shellGroup: THREE.Group | null = null;
  private cabinetGroup: THREE.Group | null = null;
  private mogeGroup: THREE.Group | null = null;
  private gltfLoader: GLTFLoader;

  private isWireframe = false;
  private isAutoRotating = false;
  private showShell = true;
  private showMoGeOverlay = false;

  private currentAnalysis: RoomAnalysisResult | null = null;

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Container #${containerId} not found`);
    this.container = el;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf7f6f2);

    const w = this.container.clientWidth || 640;
    const h = this.container.clientHeight || 420;
    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.05, 60);
    this.camera.position.set(0.4, 1.85, 4.2);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.target.set(0, 1.1, 0.3);
    this.controls.maxPolarAngle = Math.PI / 2 - 0.02;

    const hemi = new THREE.HemisphereLight(0xffffff, 0xe7e2d8, 0.95);
    this.scene.add(hemi);

    const key = new THREE.DirectionalLight(0xfffaf0, 1.25);
    key.position.set(3.2, 5.5, 4.5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    this.scene.add(key);

    const fill = new THREE.DirectionalLight(0xe0f2fe, 0.45);
    fill.position.set(-3.5, 2.5, 3.0);
    this.scene.add(fill);

    this.rootGroup = new THREE.Group();
    this.scene.add(this.rootGroup);
    this.gltfLoader = new GLTFLoader();

    const initGrid = new THREE.GridHelper(5, 20, 0xcbd5e1, 0xe2e8f0);
    this.rootGroup.add(initGrid);

    window.addEventListener('resize', this.handleResize);
    this.animate();
  }

  private handleResize = () => {
    if (!this.container) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (w > 0 && h > 0) {
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    }
  };

  private animate = () => {
    this.animId = requestAnimationFrame(this.animate);
    this.controls.autoRotate = this.isAutoRotating;
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  public renderRoomProposal(
    analysis: RoomAnalysisResult,
    frontFinish: MdfFinishOption,
    hardwareId: HardwareTierId,
    carcassFinish?: MdfFinishOption,
    counterTone: CounterTone = 'claro',
    preserveCamera: boolean = false,
    styleOptions: Partial<CabinetStyleOptions> = {}
  ): void {
    this.currentAnalysis = analysis;
    this.clearRoot();

    const shell = buildRoomShellGroup(analysis.roomDimensionsCm, analysis.obstacles, analysis.modules);
    shell.visible = this.showShell;
    this.shellGroup = shell;
    this.rootGroup.add(shell);

    const cabinet = buildCabinetModulesGroup(
      analysis.modules,
      analysis.roomDimensionsCm.widthCm,
      frontFinish,
      hardwareId,
      carcassFinish,
      counterTone,
      styleOptions
    );
    this.cabinetGroup = cabinet;
    this.rootGroup.add(cabinet);

    if (analysis.roomGlbUrl && this.showMoGeOverlay) {
      this.loadMoGeOverlay(analysis.roomGlbUrl);
    }

    this.applyWireframe();

    if (!preserveCamera) {
      const wM = analysis.roomDimensionsCm.widthCm / 100;
      const hM = analysis.roomDimensionsCm.heightCm / 100;
      const hasCenterOrSide = analysis.modules.some(m => m.wall !== 'back');
      this.camera.position.set(
        wM * (hasCenterOrSide ? 0.25 : 0.16),
        hM * (hasCenterOrSide ? 0.84 : 0.62),
        Math.max(4.8, wM * (hasCenterOrSide ? 1.78 : 1.42))
      );
      this.controls.target.set(0, hM * 0.44, hasCenterOrSide ? 0.78 : 0.25);
      this.controls.update();
    }
  }

  public updateMaterialOrHardware(
    frontFinish: MdfFinishOption,
    hardwareId: HardwareTierId,
    carcassFinish?: MdfFinishOption,
    counterTone: CounterTone = 'claro',
    styleOptions: Partial<CabinetStyleOptions> = {}
  ): void {
    if (!this.currentAnalysis) return;
    if (this.cabinetGroup) {
      this.rootGroup.remove(this.cabinetGroup);
    }
    const cabinet = buildCabinetModulesGroup(
      this.currentAnalysis.modules,
      this.currentAnalysis.roomDimensionsCm.widthCm,
      frontFinish,
      hardwareId,
      carcassFinish,
      counterTone,
      styleOptions
    );
    this.cabinetGroup = cabinet;
    this.rootGroup.add(cabinet);
    this.applyWireframe();
  }

  private loadMoGeOverlay(url: string): void {
    if (this.mogeGroup) {
      this.rootGroup.remove(this.mogeGroup);
      this.mogeGroup = null;
    }
    this.gltfLoader.load(
      url,
      (gltf) => {
        const scene = gltf.scene;
        const box = new THREE.Box3().setFromObject(scene);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);

        if (this.currentAnalysis && size.x > 0.01) {
          const targetW = (this.currentAnalysis.roomDimensionsCm.widthCm / 100) * 1.25;
          const s = targetW / size.x;
          scene.scale.setScalar(s);
          scene.position.set(-center.x * s, -box.min.y * s, -box.min.z * s - 0.15);
        }
        scene.traverse((obj: any) => {
          if (obj.isMesh && obj.material) {
            obj.material.transparent = true;
            obj.material.opacity = 0.72;
          }
        });
        this.mogeGroup = scene;
        this.mogeGroup.visible = this.showMoGeOverlay;
        this.rootGroup.add(scene);
      },
      undefined,
      (err) => console.warn('[RoomSceneViewer] MoGe GLB overlay load skipped:', err)
    );
  }

  public toggleMoGeOverlay(): boolean {
    this.showMoGeOverlay = !this.showMoGeOverlay;
    if (this.showMoGeOverlay && this.currentAnalysis?.roomGlbUrl && !this.mogeGroup) {
      this.loadMoGeOverlay(this.currentAnalysis.roomGlbUrl);
    }
    if (this.mogeGroup) {
      this.mogeGroup.visible = this.showMoGeOverlay;
    }
    return this.showMoGeOverlay;
  }

  public toggleRoomShell(): boolean {
    this.showShell = !this.showShell;
    if (this.shellGroup) this.shellGroup.visible = this.showShell;
    return this.showShell;
  }

  public toggleAutoRotate(): boolean {
    this.isAutoRotating = !this.isAutoRotating;
    return this.isAutoRotating;
  }

  public toggleWireframe(): boolean {
    this.isWireframe = !this.isWireframe;
    this.applyWireframe();
    return this.isWireframe;
  }

  private applyWireframe(): void {
    this.rootGroup.traverse((obj: any) => {
      if (obj.isMesh && obj.material) {
        obj.material.wireframe = this.isWireframe;
      }
    });
  }

  private clearRoot(): void {
    while (this.rootGroup.children.length > 0) {
      this.rootGroup.remove(this.rootGroup.children[0]);
    }
    this.shellGroup = null;
    this.cabinetGroup = null;
    this.mogeGroup = null;
  }

  public exportProposalOBJ(): boolean {
    const target = this.cabinetGroup || this.rootGroup;
    if (!this.currentAnalysis) return false;
    exportObjectToOBJDownload(target, `83-ambientes-${this.currentAnalysis.roomType}-sketchup.obj`);
    return true;
  }

  public exportProposalGLB(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.currentAnalysis) {
        resolve(false);
        return;
      }
      const exporter = new GLTFExporter();
      const target = new THREE.Group();
      if (this.shellGroup) target.add(this.shellGroup.clone());
      if (this.cabinetGroup) target.add(this.cabinetGroup.clone());
      exporter.parse(
        target,
        (gltf) => {
          const blob = new Blob([gltf as ArrayBuffer], { type: 'model/gltf-binary' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `83-ambientes-${this.currentAnalysis!.roomType}.glb`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 2000);
          resolve(true);
        },
        () => resolve(false),
        { binary: true }
      );
    });
  }

  public dispose(): void {
    cancelAnimationFrame(this.animId);
    window.removeEventListener('resize', this.handleResize);
    this.renderer.dispose();
  }
}
