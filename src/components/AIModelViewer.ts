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
  private activeModelKey: string = 'trellis-tensegrity';
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
    this.controls.minDistance = 1.0;
    this.controls.maxDistance = 25.0;

    this.gltfLoader = new GLTFLoader();
    this.objLoader = new OBJLoader();

    this.currentModelGroup = new THREE.Group();
    this.scene.add(this.currentModelGroup);

    // Setup Lighting
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(this.ambientLight);

    this.dirLight1 = new THREE.DirectionalLight(0xfffaed, 2.2);
    this.dirLight1.position.set(5, 8, 4);
    this.dirLight1.castShadow = true;
    this.dirLight1.shadow.mapSize.width = 1024;
    this.dirLight1.shadow.mapSize.height = 1024;
    this.scene.add(this.dirLight1);

    this.dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.2);
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

    // Load initial real parametric model
    this.generateFromPrompt('American Black Walnut live-edge floating tensegrity dining table with PVD gold cables');

    this.setupResizeListener();
    this.render();
  }

  /**
   * Generates a REAL 3D Object from a custom prompt string using custom parametric Three.js geometry.
   */
  public generateFromPrompt(prompt: string, attachedImage?: string | null): Generated3DMetadata {
    const { object, metadata } = this.generatorService.generateParametric3DObject(prompt, attachedImage);
    this.displayRealGeneratedObject(object, metadata);
    return metadata;
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
  }

  /**
   * Loads a raw GLB binary or URL into the viewer.
   */
  public loadGLBUrl(url: string, name: string = 'Hugging Face Generated 3D Asset'): Promise<Generated3DMetadata> {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gltf) => {
          let vertexCount = 0;
          let triangleCount = 0;
          gltf.scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const geom = (child as THREE.Mesh).geometry;
              if (geom.attributes.position) vertexCount += geom.attributes.position.count;
              if (geom.index) triangleCount += geom.index.count / 3;
            }
          });

          const box = new THREE.Box3().setFromObject(gltf.scene);
          const size = box.getSize(new THREE.Vector3());

          const metadata: Generated3DMetadata = {
            name,
            category: 'AI ZeroGPU Generated 3D Asset',
            dimensions: {
              lengthCm: Math.round(size.x * 100),
              widthCm: Math.round(size.z * 100),
              heightCm: Math.round(size.y * 100)
            },
            vertexCount,
            triangleCount: Math.round(triangleCount),
            timberSpecies: 'AI Generated Texture',
            tensionHardware: 'Engineered Topology',
            isFromHuggingFace: true
          };

          this.displayRealGeneratedObject(gltf.scene, metadata);
          resolve(metadata);
        },
        undefined,
        (err) => {
          console.error('Failed to load GLB:', err);
          reject(err);
        }
      );
    });
  }

  /**
   * Exports the currently displayed real 3D model to a downloadable .GLB file.
   */
  public exportCurrentModelToGLB(filename?: string): Promise<Blob> {
    const name = filename || `${this.currentMetadata?.name.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'custom-furniture'}.glb`;
    return this.generatorService.exportToGLBFile(this.currentModelGroup, name);
  }

  private updateStatsHud(metadata: Generated3DMetadata): void {
    const statsPill = document.getElementById('ai-mesh-stats-pill');
    if (statsPill) {
      statsPill.innerHTML = `
        <strong>Real 3D Mesh</strong> &bull;
        ${metadata.vertexCount.toLocaleString()} Vertices &bull;
        ${metadata.triangleCount.toLocaleString()} Polygons &bull;
        ${metadata.dimensions.lengthCm} &times; ${metadata.dimensions.widthCm} &times; ${metadata.dimensions.heightCm} cm
      `;
    }
  }

  public loadPresetModel(key: string): void {
    this.activeModelKey = key;
    switch (key) {
      case 'trellis-tensegrity':
        this.generateFromPrompt('Solid American Black Walnut floating tensegrity dining table with PVD gold titanium cables and live-edge contour');
        break;
      case 'triposr-geodesic':
        this.generateFromPrompt('6m diameter timber geodesic dome pavilion with Douglas Fir struts and triangular glass facets');
        break;
      case 'interior-loft':
        this.generateFromPrompt('Architectural loft floating tensegrity table in quarter-sawn European White Oak 240cm');
        break;
      case 'instant4d-splat':
        this.generateFromPrompt('Sculptural Yakisugi charred cedar tensegrity coffee table with matte carbon cables');
        break;
      default:
        this.generateFromPrompt(key);
    }
  }

  private clearModel(): void {
    while (this.currentModelGroup.children.length > 0) {
      const child = this.currentModelGroup.children[0];
      this.currentModelGroup.remove(child);
    }
  }

  /* Load Custom File (.glb / .gltf / .obj) */
  public loadFromFile(file: File, onSuccess?: () => void, onError?: (err: any) => void): void {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const url = URL.createObjectURL(file);

    this.clearModel();

    if (extension === 'glb' || extension === 'gltf') {
      this.gltfLoader.load(
        url,
        (gltf) => {
          let vertexCount = 0;
          let triangleCount = 0;
          gltf.scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const geom = (child as THREE.Mesh).geometry;
              if (geom.attributes.position) vertexCount += geom.attributes.position.count;
              if (geom.index) triangleCount += geom.index.count / 3;
            }
          });
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const size = box.getSize(new THREE.Vector3());

          const metadata: Generated3DMetadata = {
            name: file.name,
            category: 'Uploaded 3D Mesh',
            dimensions: {
              lengthCm: Math.round(size.x * 100),
              widthCm: Math.round(size.z * 100),
              heightCm: Math.round(size.y * 100)
            },
            vertexCount,
            triangleCount: Math.round(triangleCount),
            timberSpecies: 'Imported Materials',
            tensionHardware: 'Imported Geometry',
            isFromHuggingFace: false
          };

          this.displayRealGeneratedObject(gltf.scene, metadata);
          URL.revokeObjectURL(url);
          if (onSuccess) onSuccess();
        },
        undefined,
        (err) => {
          console.error('Error loading GLTF/GLB:', err);
          URL.revokeObjectURL(url);
          if (onError) onError(err);
        }
      );
    } else if (extension === 'obj') {
      this.objLoader.load(
        url,
        (obj) => {
          let vertexCount = 0;
          obj.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const geom = (child as THREE.Mesh).geometry;
              if (geom.attributes.position) vertexCount += geom.attributes.position.count;
            }
          });
          const box = new THREE.Box3().setFromObject(obj);
          const size = box.getSize(new THREE.Vector3());

          const metadata: Generated3DMetadata = {
            name: file.name,
            category: 'Uploaded OBJ Mesh',
            dimensions: {
              lengthCm: Math.round(size.x * 100),
              widthCm: Math.round(size.z * 100),
              heightCm: Math.round(size.y * 100)
            },
            vertexCount,
            triangleCount: Math.round(vertexCount / 3),
            timberSpecies: 'Imported OBJ Geometry',
            tensionHardware: 'Imported Geometry',
            isFromHuggingFace: false
          };

          this.displayRealGeneratedObject(obj, metadata);
          URL.revokeObjectURL(url);
          if (onSuccess) onSuccess();
        },
        undefined,
        (err) => {
          console.error('Error loading OBJ:', err);
          URL.revokeObjectURL(url);
          if (onError) onError(err);
        }
      );
    }
  }

  private fitModelInView(object: THREE.Object3D): void {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2.4 / (maxDim || 1);
    object.scale.set(scale, scale, scale);

    // Re-center
    box.setFromObject(object);
    box.getCenter(center);
    object.position.sub(center);
    object.position.y += (size.y * scale) / 2;

    object.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  public toggleWireframe(): boolean {
    this.isWireframe = !this.isWireframe;
    this.applyWireframeState();
    return this.isWireframe;
  }

  private applyWireframeState(): void {
    this.currentModelGroup.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => (m as any).wireframe = this.isWireframe);
        } else if (mesh.material) {
          (mesh.material as any).wireframe = this.isWireframe;
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
        this.ambientLight.intensity = 0.9;
        this.dirLight1.intensity = 2.2;
        this.dirLight1.color.setHex(0xfffaed);
        this.dirLight2.intensity = 1.2;
        this.dirLight2.color.setHex(0x38bdf8);
        break;
      case 'daylight':
        this.ambientLight.intensity = 1.3;
        this.dirLight1.intensity = 2.8;
        this.dirLight1.color.setHex(0xffffff);
        this.dirLight2.intensity = 0.8;
        this.dirLight2.color.setHex(0x93c5fd);
        break;
      case 'midnight':
        this.ambientLight.intensity = 0.35;
        this.dirLight1.intensity = 1.5;
        this.dirLight1.color.setHex(0xd4af37);
        this.dirLight2.intensity = 1.8;
        this.dirLight2.color.setHex(0x0284c7);
        break;
    }
  }

  public resetCameraForModel(): void {
    this.camera.position.set(2.8, 1.8, 2.8);
    this.controls.target.set(0, 0.5, 0);
    this.controls.update();
  }

  private setupResizeListener(): void {
    window.addEventListener('resize', () => {
      if (!this.container) return;
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });
  }

  private render = (): void => {
    this.animFrameId = requestAnimationFrame(this.render);
    this.controls.autoRotate = this.isAutoRotating;
    this.controls.autoRotateSpeed = 1.2;
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  public destroy(): void {
    cancelAnimationFrame(this.animFrameId);
    this.controls.dispose();
    this.renderer.dispose();
    if (this.container && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
