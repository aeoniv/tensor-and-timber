import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

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

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Container #${containerId} not found`);
    this.container = el;

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

    this.loadPresetModel('trellis-tensegrity');
    this.setupResizeListener();
    this.render();
  }

  public loadPresetModel(key: string): void {
    this.activeModelKey = key;
    this.clearModel();

    switch (key) {
      case 'trellis-tensegrity':
        this.buildTrellisTensegrityModel();
        break;
      case 'triposr-geodesic':
        this.buildTripoSRGeodesicModel();
        break;
      case 'interior-loft':
        this.buildInteriorLoftScene();
        break;
      case 'instant4d-splat':
        this.buildGaussianSplatScanSimulation();
        break;
      default:
        this.buildTrellisTensegrityModel();
    }

    this.applyWireframeState();
    this.resetCameraForModel();
  }

  private clearModel(): void {
    while (this.currentModelGroup.children.length > 0) {
      const child = this.currentModelGroup.children[0];
      this.currentModelGroup.remove(child);
    }
  }

  /* Preset 1: TRELLIS.2 Synthesized Organic Tensegrity Table */
  private buildTrellisTensegrityModel(): void {
    const group = new THREE.Group();

    // Sculpted organic walnut tabletop
    const topGeom = new THREE.CylinderGeometry(1.2, 1.15, 0.08, 36);
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x3d2b1f,
      roughness: 0.28,
      metalness: 0.08
    });
    const topMesh = new THREE.Mesh(topGeom, woodMat);
    topMesh.position.y = 0.85;
    topMesh.castShadow = true;
    group.add(topMesh);

    // Beveled live edge rim
    const rimGeom = new THREE.TorusGeometry(1.18, 0.04, 16, 48);
    const rimMesh = new THREE.Mesh(rimGeom, woodMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = 0.85;
    group.add(rimMesh);

    // Cantilever Spine reaching down from top
    const spineTopGeom = new THREE.BoxGeometry(0.12, 0.65, 0.12);
    const spineTop = new THREE.Mesh(spineTopGeom, woodMat);
    spineTop.position.set(0.1, 0.52, 0);
    spineTop.castShadow = true;
    group.add(spineTop);

    // Bottom Arm reaching under
    const hookTopGeom = new THREE.BoxGeometry(0.42, 0.1, 0.12);
    const hookTop = new THREE.Mesh(hookTopGeom, woodMat);
    hookTop.position.set(0.25, 0.22, 0);
    hookTop.castShadow = true;
    group.add(hookTop);

    // Sculpted Base
    const baseGeom = new THREE.CylinderGeometry(1.0, 1.05, 0.08, 36);
    const baseMesh = new THREE.Mesh(baseGeom, woodMat);
    baseMesh.position.y = 0.04;
    baseMesh.receiveShadow = true;
    baseMesh.castShadow = true;
    group.add(baseMesh);

    // Base Spine reaching up
    const spineBaseGeom = new THREE.BoxGeometry(0.12, 0.65, 0.12);
    const spineBase = new THREE.Mesh(spineBaseGeom, woodMat);
    spineBase.position.set(-0.1, 0.38, 0);
    spineBase.castShadow = true;
    group.add(spineBase);

    // Base Hook reaching over top hook
    const hookBaseGeom = new THREE.BoxGeometry(0.42, 0.1, 0.12);
    const hookBase = new THREE.Mesh(hookBaseGeom, woodMat);
    hookBase.position.set(-0.25, 0.68, 0);
    hookBase.castShadow = true;
    group.add(hookBase);

    // Rigging: PVD Gold Cables + Stainless Turnbuckles
    const cableMat = new THREE.MeshStandardMaterial({
      color: 0xf1c40f, // PVD Gold
      metalness: 0.95,
      roughness: 0.15
    });

    // Center suspension cable (holding the weight!)
    this.addRiggingCable(group, new THREE.Vector3(0.4, 0.22, 0), new THREE.Vector3(-0.4, 0.68, 0), 0.012, cableMat);

    // 4 Perimeter stabilizer cables
    const radius = 1.05;
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2 + Math.PI / 4;
      const topX = Math.cos(angle) * radius;
      const topZ = Math.sin(angle) * radius;
      const baseX = Math.cos(angle) * (radius * 0.85);
      const baseZ = Math.sin(angle) * (radius * 0.85);

      this.addRiggingCable(group, new THREE.Vector3(topX, 0.82, topZ), new THREE.Vector3(baseX, 0.08, baseZ), 0.006, cableMat);
    }

    this.currentModelGroup.add(group);
  }

  /* Preset 2: TripoSR Instant 3D Geodesic Pavilion */
  private buildTripoSRGeodesicModel(): void {
    const group = new THREE.Group();

    // Timber frame geodesic hemisphere
    const radius = 1.8;
    const geom = new THREE.IcosahedronGeometry(radius, 2);
    const pos = geom.getAttribute('position');

    const timberMat = new THREE.MeshStandardMaterial({
      color: 0xc8894d,
      roughness: 0.45,
      metalness: 0.05
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.4,
      roughness: 0.1,
      transmission: 0.8,
      side: THREE.DoubleSide
    });

    const hubMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.9,
      roughness: 0.2
    });

    const vertices: THREE.Vector3[] = [];
    const edgeSet = new Set<string>();

    for (let i = 0; i < pos.count; i += 3) {
      const v1 = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
      const v2 = new THREE.Vector3(pos.getX(i + 1), pos.getY(i + 1), pos.getZ(i + 1));
      const v3 = new THREE.Vector3(pos.getX(i + 2), pos.getY(i + 2), pos.getZ(i + 2));

      if (v1.y >= -0.1 && v2.y >= -0.1 && v3.y >= -0.1) {
        vertices.push(v1, v2, v3);

        const addEdge = (a: THREE.Vector3, b: THREE.Vector3) => {
          const k1 = `${a.x.toFixed(2)},${a.y.toFixed(2)},${a.z.toFixed(2)}`;
          const k2 = `${b.x.toFixed(2)},${b.y.toFixed(2)},${b.z.toFixed(2)}`;
          const key = k1 < k2 ? `${k1}|${k2}` : `${k2}|${k1}`;
          if (!edgeSet.has(key)) {
            edgeSet.add(key);
            const dir = new THREE.Vector3().subVectors(b, a);
            const len = dir.length();
            const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, len, 8), timberMat);
            cylinder.position.copy(a).addScaledVector(dir, 0.5);
            cylinder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
            cylinder.castShadow = true;
            group.add(cylinder);
          }
        };

        addEdge(v1, v2);
        addEdge(v2, v3);
        addEdge(v3, v1);

        // Glass facet on top crown
        const avgY = (v1.y + v2.y + v3.y) / 3;
        if (avgY > radius * 0.4) {
          const triGeom = new THREE.BufferGeometry();
          triGeom.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
            v1.x, v1.y, v1.z,
            v2.x, v2.y, v2.z,
            v3.x, v3.y, v3.z
          ]), 3));
          triGeom.computeVertexNormals();
          group.add(new THREE.Mesh(triGeom, glassMat));
        }
      }
    }

    // Hubs
    const hubGeom = new THREE.SphereGeometry(0.06, 12, 12);
    vertices.forEach(v => {
      const hub = new THREE.Mesh(hubGeom, hubMat);
      hub.position.copy(v);
      group.add(hub);
    });

    // Sub-floor deck
    const deck = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 1.1, radius * 1.1, 0.1, 32),
      new THREE.MeshStandardMaterial({ color: 0x181a20, roughness: 0.8 })
    );
    deck.position.y = -0.05;
    deck.receiveShadow = true;
    group.add(deck);

    this.currentModelGroup.add(group);
  }

  /* Preset 3: InteriorGen3D Staged Penthouse Loft Scene */
  private buildInteriorLoftScene(): void {
    const group = new THREE.Group();

    // Floor Parquet
    const floorGeom = new THREE.PlaneGeometry(6, 6);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x4a3424,
      roughness: 0.35,
      metalness: 0.05
    });
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    group.add(floor);

    // Back architectural concrete wall
    const wallGeom = new THREE.PlaneGeometry(6, 3.5);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x1a1d24, roughness: 0.9 });
    const wall = new THREE.Mesh(wallGeom, wallMat);
    wall.position.set(0, 1.75, -3);
    group.add(wall);

    // Left wall with panoramic window opening
    const sideWallGeom = new THREE.PlaneGeometry(6, 3.5);
    const sideWall = new THREE.Mesh(sideWallGeom, wallMat);
    sideWall.position.set(-3, 1.75, 0);
    sideWall.rotation.y = Math.PI / 2;
    group.add(sideWall);

    // Window glass pane with skyline light
    const windowGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(3.5, 2.4),
      new THREE.MeshPhysicalMaterial({ color: 0xa5f3fc, transmission: 0.9, opacity: 0.5, transparent: true })
    );
    windowGlass.position.set(-2.95, 1.8, 0);
    windowGlass.rotation.y = Math.PI / 2;
    group.add(windowGlass);

    // Centerpiece: Staged Tensegrity Dining Table
    const tableGroup = new THREE.Group();
    const tableTop = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.09, 1.1),
      new THREE.MeshStandardMaterial({ color: 0x3d2b1f, roughness: 0.3 })
    );
    tableTop.position.y = 0.78;
    tableTop.castShadow = true;
    tableGroup.add(tableTop);

    const tableBase = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.08, 0.9),
      new THREE.MeshStandardMaterial({ color: 0x3d2b1f, roughness: 0.4 })
    );
    tableBase.position.y = 0.04;
    tableBase.receiveShadow = true;
    tableGroup.add(tableBase);

    // Cantilever masts
    const mast1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.55, 0.1), new THREE.MeshStandardMaterial({ color: 0x3d2b1f }));
    mast1.position.set(0, 0.45, 0);
    tableGroup.add(mast1);

    // Brass cable lines
    const cMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95 });
    const c1 = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.75), cMat);
    c1.position.set(0.9, 0.4, 0.4);
    tableGroup.add(c1);
    const c2 = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.75), cMat);
    c2.position.set(-0.9, 0.4, 0.4);
    tableGroup.add(c2);
    const c3 = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.75), cMat);
    c3.position.set(0.9, 0.4, -0.4);
    tableGroup.add(c3);
    const c4 = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.75), cMat);
    c4.position.set(-0.9, 0.4, -0.4);
    tableGroup.add(c4);

    group.add(tableGroup);
    this.currentModelGroup.add(group);
  }

  /* Preset 4: Instant4D / Holograma Gaussian Splat Particle Cloud */
  private buildGaussianSplatScanSimulation(): void {
    const group = new THREE.Group();

    // Generate 4,500 particles mimicking a 3D Gaussian Splatting room reconstruction
    const particleCount = 4500;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(0xd4af37); // Gold
    const c2 = new THREE.Color(0x38bdf8); // Cyan
    const c3 = new THREE.Color(0xc8894d); // Walnut amber
    const c4 = new THREE.Color(0xf8fafc); // Bright specular

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 1.6;

      const sinPhi = Math.sin(phi);
      const x = r * sinPhi * Math.cos(theta);
      const y = Math.abs(r * Math.cos(phi)) + 0.1;
      const z = r * sinPhi * Math.sin(theta);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color distribution
      let chosenColor = c1;
      const rand = Math.random();
      if (rand < 0.35) chosenColor = c2;
      else if (rand < 0.7) chosenColor = c3;
      else if (rand < 0.9) chosenColor = c4;

      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const pointCloud = new THREE.Points(geom, pMat);
    group.add(pointCloud);

    // Central solid model representing the registered CAD object
    const coreMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.08, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x3d2b1f, roughness: 0.3 })
    );
    coreMesh.position.y = 0.75;
    group.add(coreMesh);

    this.currentModelGroup.add(group);
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
          const model = gltf.scene;
          this.fitModelInView(model);
          this.currentModelGroup.add(model);
          URL.revokeObjectURL(url);
          this.applyWireframeState();
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
          this.fitModelInView(obj);
          this.currentModelGroup.add(obj);
          URL.revokeObjectURL(url);
          this.applyWireframeState();
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

    this.resetCameraForModel();
  }

  private addRiggingCable(group: THREE.Group, p1: THREE.Vector3, p2: THREE.Vector3, radius: number, mat: THREE.Material): void {
    const dir = new THREE.Vector3().subVectors(p2, p1);
    const len = dir.length();
    const geom = new THREE.CylinderGeometry(radius, radius, len, 12);
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.copy(p1).addScaledVector(dir, 0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    mesh.castShadow = true;
    group.add(mesh);
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
    if (this.activeModelKey === 'interior-loft') {
      this.camera.position.set(0, 2.2, 4.2);
      this.controls.target.set(0, 1.0, 0);
    } else if (this.activeModelKey === 'triposr-geodesic') {
      this.camera.position.set(3.5, 2.4, 3.8);
      this.controls.target.set(0, 0.8, 0);
    } else {
      this.camera.position.set(2.8, 1.8, 2.8);
      this.controls.target.set(0, 0.45, 0);
    }
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
    this.controls.autoRotateSpeed = 1.5;
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
