import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { Real3DGeneratorService, Generated3DMetadata } from '../services/real3DGenerator';

export class AIModelViewer {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private animFrameId: number = 0;

  private currentModelGroup: THREE.Group;
  private gltfLoader: GLTFLoader;
  private objLoader: OBJLoader;
  private generatorService: Real3DGeneratorService;

  // Lighting
  private ambientLight: THREE.AmbientLight;
  private dirLight1: THREE.DirectionalLight;
  private dirLight2: THREE.DirectionalLight;
  private groundPlane: THREE.Mesh;

  // State
  private isWireframe: boolean = false;
  private isAutoRotating: boolean = true;
  private lightingPreset: 'studio' | 'daylight' | 'midnight' = 'studio';
  private currentMetadata: Generated3DMetadata | null = null;

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Container #${containerId} not found`);
    this.container = el;

    this.generatorService = new Real3DGeneratorService();

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 0.1, 100);
    this.camera.position.set(3.2, 2.2, 3.8);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.05;
    this.controls.minDistance = 0.8;
    this.controls.maxDistance = 25.0;

    this.gltfLoader = new GLTFLoader();
    this.objLoader = new OBJLoader();

    this.currentModelGroup = new THREE.Group();
    this.scene.add(this.currentModelGroup);

    // Setup Lighting
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    this.scene.add(this.ambientLight);

    this.dirLight1 = new THREE.DirectionalLight(0xfffaed, 2.4);
    this.dirLight1.position.set(5, 8, 4);
    this.dirLight1.castShadow = true;
    this.dirLight1.shadow.mapSize.width = 1024;
    this.dirLight1.shadow.mapSize.height = 1024;
    this.scene.add(this.dirLight1);

    this.dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.4);
    this.dirLight2.position.set(-5, -2, -4);
    this.scene.add(this.dirLight2);

    // Subtle ground shadow grid
    this.groundPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.ShadowMaterial({ opacity: 0.35 })
    );
    this.groundPlane.rotation.x = -Math.PI / 2;
    this.groundPlane.position.y = -0.01;
    this.groundPlane.receiveShadow = true;
    this.scene.add(this.groundPlane);

    // Load initial REAL neural 3D model (Sample Trellis GLB)
    this.loadGLBUrl('/models/sample_ai_trellis.glb', 'Neural Tensegrity Chair (TRELLIS 3D)').catch(() => {
      this.generateCustom3DObject('American Black Walnut live-edge floating tensegrity dining table with PVD gold cables');
    });

    this.setupResizeListener();
    this.render();
  }

  /**
   * Generates a REAL 3D Object from a prompt and/or attached image.
   */
  public async generateCustom3DObject(prompt: string, attachedImage?: string | null): Promise<Generated3DMetadata> {
    const { object, metadata } = await this.generatorService.generateCustom3DObject(prompt, attachedImage);
    this.displayRealGeneratedObject(object, metadata);
    return metadata;
  }

  // Alias for backward compatibility
  public generateFromPrompt(prompt: string, attachedImage?: string | null): Promise<Generated3DMetadata> {
    return this.generateCustom3DObject(prompt, attachedImage);
  }

  /**
   * Displays a real 3D Object (procedural or loaded from .GLB/.OBJ).
   */
  public displayRealGeneratedObject(object: THREE.Object3D, metadata: Generated3DMetadata): void {
    this.clearModel();
    this.currentMetadata = metadata;

    this.fitModelInView(object);
    this.currentModelGroup.add(object);
    this.applyWireframeState();
    this.resetCameraForModel();
    this.updateStatsHud(metadata);

    const titleEl = document.getElementById('ai-active-model-title');
    if (titleEl && metadata) {
      titleEl.textContent = `Real 3D Geometry: ${metadata.name} (${metadata.dimensions.lengthCm} × ${metadata.dimensions.widthCm} × ${metadata.dimensions.heightCm} cm)`;
    }
  }

  /**
   * Loads a raw GLB binary or URL into the viewer.
   */
  public loadGLBUrl(url: string, name: string = 'Generated 3D Asset'): Promise<Generated3DMetadata> {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gltf) => {
          let vertexCount = 0;
          let triangleCount = 0;
          gltf.scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;
              const geom = mesh.geometry;
              if (geom && geom.attributes.position) {
                vertexCount += geom.attributes.position.count;
                if (geom.index) triangleCount += geom.index.count / 3;
                else triangleCount += geom.attributes.position.count / 3;
              }
            }
          });

          const box = new THREE.Box3().setFromObject(gltf.scene);
          const size = new THREE.Vector3();
          box.getSize(size);

          const meta: Generated3DMetadata = {
            name,
            category: 'Hugging Face ZeroGPU Asset',
            dimensions: {
              lengthCm: Math.max(Math.round(size.x * 100), 45),
              widthCm: Math.max(Math.round(size.z * 100), 45),
              heightCm: Math.max(Math.round(size.y * 100), 45)
            },
            vertexCount,
            triangleCount: Math.round(triangleCount),
            timberSpecies: 'Neural 3D Texture',
            tensionHardware: 'Tensegrity Solved',
            isFromImageContour: false,
            isFromHuggingFace: true
          };

          this.displayRealGeneratedObject(gltf.scene, meta);
          resolve(meta);
        },
        undefined,
        (err) => reject(err)
      );
    });
  }

  /**
   * Loads a custom user-dropped 3D file (.glb, .gltf, .obj).
   */
  public loadFromFile(file: File, onLoad?: () => void, onError?: (err: any) => void): void {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const objectUrl = URL.createObjectURL(file);

    if (ext === 'glb' || ext === 'gltf') {
      this.loadGLBUrl(objectUrl, file.name)
        .then(() => {
          if (onLoad) onLoad();
        })
        .catch(err => {
          if (onError) onError(err);
        });
    } else if (ext === 'obj') {
      this.objLoader.load(
        objectUrl,
        (obj) => {
          let vertexCount = 0;
          let triangleCount = 0;
          obj.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;
              mesh.material = new THREE.MeshStandardMaterial({ color: 0x3d2b1f, roughness: 0.4 });
              const geom = mesh.geometry;
              if (geom && geom.attributes.position) {
                vertexCount += geom.attributes.position.count;
                if (geom.index) triangleCount += geom.index.count / 3;
                else triangleCount += geom.attributes.position.count / 3;
              }
            }
          });

          const box = new THREE.Box3().setFromObject(obj);
          const size = new THREE.Vector3();
          box.getSize(size);

          const meta: Generated3DMetadata = {
            name: file.name,
            category: 'Imported CAD Mesh',
            dimensions: {
              lengthCm: Math.round(size.x * 100),
              widthCm: Math.round(size.z * 100),
              heightCm: Math.round(size.y * 100)
            },
            vertexCount,
            triangleCount: Math.round(triangleCount),
            timberSpecies: 'Raw Mesh Material',
            tensionHardware: 'Hardware As Modelled',
            isFromImageContour: false,
            isFromHuggingFace: false
          };

          this.displayRealGeneratedObject(obj, meta);
          if (onLoad) onLoad();
        },
        undefined,
        (err) => {
          if (onError) onError(err);
        }
      );
    }
  }

  /**
   * Exports the currently displayed 3D object to a real binary .GLB file.
   */
  public async exportCurrentModelToGLB(filename?: string): Promise<Blob> {
    const name = filename || `${(this.currentMetadata?.name || 'custom-piece').toLowerCase().replace(/\s+/g, '-')}.glb`;
    return this.generatorService.exportToGLBFile(this.currentModelGroup, name);
  }

  public getExportableGroup(): THREE.Group {
    return this.currentModelGroup;
  }

  public getMetadata(): Generated3DMetadata | null {
    return this.currentMetadata;
  }

  public toggleWireframe(): boolean {
    this.isWireframe = !this.isWireframe;
    this.applyWireframeState();
    return this.isWireframe;
  }

  private applyWireframeState(): void {
    this.currentModelGroup.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh).material;
        if (Array.isArray(mat)) {
          mat.forEach(m => (m as any).wireframe = this.isWireframe);
        } else if (mat) {
          (mat as any).wireframe = this.isWireframe;
        }
      }
    });
  }

  public toggleAutoRotate(): boolean {
    this.isAutoRotating = !this.isAutoRotating;
    this.controls.autoRotate = this.isAutoRotating;
    return this.isAutoRotating;
  }

  public setLightingPreset(preset: 'studio' | 'daylight' | 'midnight'): void {
    this.lightingPreset = preset;
    switch (preset) {
      case 'studio':
        this.ambientLight.color.setHex(0xffffff);
        this.ambientLight.intensity = 1.0;
        this.dirLight1.color.setHex(0xfffaed);
        this.dirLight1.intensity = 2.4;
        this.dirLight2.color.setHex(0x38bdf8);
        this.dirLight2.intensity = 1.4;
        break;
      case 'daylight':
        this.ambientLight.color.setHex(0xf0fdf4);
        this.ambientLight.intensity = 1.3;
        this.dirLight1.color.setHex(0xffffff);
        this.dirLight1.intensity = 2.8;
        this.dirLight2.color.setHex(0x93c5fd);
        this.dirLight2.intensity = 0.8;
        break;
      case 'midnight':
        this.ambientLight.color.setHex(0x1e1b4b);
        this.ambientLight.intensity = 0.4;
        this.dirLight1.color.setHex(0xf59e0b);
        this.dirLight1.intensity = 1.8;
        this.dirLight2.color.setHex(0x6366f1);
        this.dirLight2.intensity = 1.6;
        break;
    }
  }

  private updateStatsHud(metadata: Generated3DMetadata): void {
    const pill = document.getElementById('ai-mesh-stats-pill');
    if (pill) {
      const contourBadge = metadata.isFromImageContour ? ' <span style="color: #38bdf8;">[Vision Contour Extruded]</span>' : '';
      const neuralBadge = metadata.isFromHuggingFace ? ' <span style="color: #10b981;">[ZeroGPU TRELLIS 3D]</span>' : '';
      pill.innerHTML = `<strong>${metadata.name}</strong>${contourBadge}${neuralBadge} &bull; <strong>${metadata.vertexCount.toLocaleString()}</strong> Vertices &bull; <strong>${metadata.triangleCount.toLocaleString()}</strong> Polys &bull; ${metadata.dimensions.lengthCm}&times;${metadata.dimensions.widthCm}&times;${metadata.dimensions.heightCm} cm`;
    }
  }

  private fitModelInView(object: THREE.Object3D): void {
    const box = new THREE.Box3().setFromObject(object);
    const center = new THREE.Vector3();
    box.getCenter(center);
    object.position.x -= center.x;
    object.position.z -= center.z;

    // Place bottom at y = 0
    const newBox = new THREE.Box3().setFromObject(object);
    object.position.y -= newBox.min.y;
  }

  private resetCameraForModel(): void {
    const box = new THREE.Box3().setFromObject(this.currentModelGroup);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z, 1.0);

    this.camera.position.set(maxDim * 1.4, maxDim * 1.1, maxDim * 1.6);
    this.controls.target.set(0, size.y * 0.45, 0);
    this.controls.update();
  }

  private clearModel(): void {
    while (this.currentModelGroup.children.length > 0) {
      const child = this.currentModelGroup.children[0];
      this.currentModelGroup.remove(child);
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
      }
    }
  }

  private setupResizeListener(): void {
    window.addEventListener('resize', () => {
      if (!this.container) return;
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      if (width === 0 || height === 0) return;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });
  }

  private render = (): void => {
    this.animFrameId = requestAnimationFrame(this.render);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  public destroy(): void {
    cancelAnimationFrame(this.animFrameId);
    this.renderer.dispose();
    this.controls.dispose();
    if (this.renderer.domElement && this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
