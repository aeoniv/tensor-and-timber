import * as THREE from 'three';
import { WOOD_SPECIES, TENSION_SYSTEMS } from '../data/constants';

export class TensegrityViewer {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private animFrameId: number = 0;

  // Model parts
  private rootGroup: THREE.Group;
  private topTableGroup: THREE.Group;
  private baseTableGroup: THREE.Group;
  private cablesGroup: THREE.Group;
  private vectorsGroup: THREE.Group;
  private topMesh: THREE.Mesh | null = null;
  private baseMesh: THREE.Mesh | null = null;
  private mastTopMesh: THREE.Mesh | null = null;
  private mastBaseMesh: THREE.Mesh | null = null;

  // Materials
  private woodMaterial: THREE.MeshStandardMaterial;
  private cableMaterial: THREE.MeshStandardMaterial;
  private turnbuckleMaterial: THREE.MeshStandardMaterial;
  private vectorTensionMaterial: THREE.LineBasicMaterial;
  private vectorCompressionMaterial: THREE.LineBasicMaterial;

  // State
  private isAutoRotating: boolean = true;
  private isDragging: boolean = false;
  private prevMouseX: number = 0;
  private prevMouseY: number = 0;
  private rotationX: number = 0.35;
  private rotationY: number = -0.55;
  private targetRotationX: number = 0.35;
  private targetRotationY: number = -0.55;
  private cameraDistance: number = 3.6;
  private explodeFactor: number = 0;
  private showVectors: boolean = false;
  private activeWoodId: string = 'american-black-walnut';
  private activeTensionId: string = 'marine-stainless-316';

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Container #${containerId} not found`);
    this.container = el;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(42, this.container.clientWidth / this.container.clientHeight, 0.1, 100);
    this.updateCameraPosition();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // Initial Materials
    this.woodMaterial = new THREE.MeshStandardMaterial({
      color: 0x3d2b1f,
      roughness: 0.35,
      metalness: 0.05
    });

    this.cableMaterial = new THREE.MeshStandardMaterial({
      color: 0xd8dee9,
      roughness: 0.2,
      metalness: 0.95
    });

    this.turnbuckleMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.25,
      metalness: 0.9
    });

    this.vectorTensionMaterial = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 });
    this.vectorCompressionMaterial = new THREE.LineBasicMaterial({ color: 0x10b981, linewidth: 3 });

    // Groups
    this.rootGroup = new THREE.Group();
    this.topTableGroup = new THREE.Group();
    this.baseTableGroup = new THREE.Group();
    this.cablesGroup = new THREE.Group();
    this.vectorsGroup = new THREE.Group();

    this.rootGroup.add(this.baseTableGroup);
    this.rootGroup.add(this.topTableGroup);
    this.rootGroup.add(this.cablesGroup);
    this.rootGroup.add(this.vectorsGroup);
    this.scene.add(this.rootGroup);

    this.setupLighting();
    this.buildGeometry();
    this.setupEventListeners();
    this.render();
  }

  private setupLighting(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xfff5e6, 2.2);
    dirLight1.position.set(4, 6, 3);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 1024;
    dirLight1.shadow.mapSize.height = 1024;
    dirLight1.shadow.bias = -0.001;
    this.scene.add(dirLight1);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    rimLight.position.set(-4, -2, -3);
    this.scene.add(rimLight);

    // Subtle ground shadow grid
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 12),
      new THREE.ShadowMaterial({ opacity: 0.35 })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.7;
    shadowPlane.receiveShadow = true;
    this.scene.add(shadowPlane);
  }

  private buildGeometry(): void {
    // Clear existing
    while (this.topTableGroup.children.length > 0) this.topTableGroup.remove(this.topTableGroup.children[0]);
    while (this.baseTableGroup.children.length > 0) this.baseTableGroup.remove(this.baseTableGroup.children[0]);
    while (this.cablesGroup.children.length > 0) this.cablesGroup.remove(this.cablesGroup.children[0]);
    while (this.vectorsGroup.children.length > 0) this.vectorsGroup.remove(this.vectorsGroup.children[0]);

    // 1. Tabletop (Floating Top)
    // Rounded rectangular slab
    const topGeom = new THREE.BoxGeometry(2.0, 0.08, 1.0);
    this.topMesh = new THREE.Mesh(topGeom, this.woodMaterial);
    this.topMesh.castShadow = true;
    this.topMesh.receiveShadow = true;
    this.topTableGroup.position.set(0, 0.45, 0);
    this.topTableGroup.add(this.topMesh);

    // Bevel edges highlight
    const topEdgeGeom = new THREE.EdgesGeometry(topGeom);
    const topEdgeLine = new THREE.LineSegments(topEdgeGeom, new THREE.LineBasicMaterial({ color: 0x5a4231, transparent: true, opacity: 0.4 }));
    this.topTableGroup.add(topEdgeLine);

    // Top Cantilever Spine (hanging downwards toward center)
    const mastTopGeom = new THREE.BoxGeometry(0.1, 0.52, 0.1);
    this.mastTopMesh = new THREE.Mesh(mastTopGeom, this.woodMaterial);
    this.mastTopMesh.position.set(0, -0.22, 0);
    this.mastTopMesh.castShadow = true;
    this.topTableGroup.add(this.mastTopMesh);

    // Top Hook / Arm curving under
    const hookGeom = new THREE.BoxGeometry(0.35, 0.08, 0.1);
    const hookMesh = new THREE.Mesh(hookGeom, this.woodMaterial);
    hookMesh.position.set(0.12, -0.44, 0);
    hookMesh.castShadow = true;
    this.topTableGroup.add(hookMesh);

    // 2. Base Pedestal
    const baseGeom = new THREE.BoxGeometry(1.6, 0.08, 0.9);
    this.baseMesh = new THREE.Mesh(baseGeom, this.woodMaterial);
    this.baseMesh.position.set(0, -0.55, 0);
    this.baseMesh.castShadow = true;
    this.baseMesh.receiveShadow = true;
    this.baseTableGroup.add(this.baseMesh);

    // Base Rising Spine (reaching upwards toward center)
    const mastBaseGeom = new THREE.BoxGeometry(0.1, 0.52, 0.1);
    this.mastBaseMesh = new THREE.Mesh(mastBaseGeom, this.woodMaterial);
    this.mastBaseMesh.position.set(0, -0.32, 0);
    this.mastBaseMesh.castShadow = true;
    this.baseTableGroup.add(this.mastBaseMesh);

    // Base Hook / Arm curving up above the top arm's hook
    const baseHookGeom = new THREE.BoxGeometry(0.35, 0.08, 0.1);
    const baseHookMesh = new THREE.Mesh(baseHookGeom, this.woodMaterial);
    baseHookMesh.position.set(-0.12, -0.1, 0);
    baseHookMesh.castShadow = true;
    this.baseTableGroup.add(baseHookMesh);

    // 3. Central Tension Cable (The core suspension load-bearing line)
    // Connects from top hook (x: 0.25, y: -0.44) down to base hook (x: -0.25, y: -0.1)
    this.addCable(new THREE.Vector3(0.24, 0.45 - 0.44, 0), new THREE.Vector3(-0.24, -0.1, 0), 0.012, true);

    // 4. Perimeter Stabilizer Cables (4 Corners)
    const corners = [
      { top: new THREE.Vector3(0.9, 0.45 - 0.04, 0.42), base: new THREE.Vector3(0.72, -0.55 + 0.04, 0.38) },
      { top: new THREE.Vector3(-0.9, 0.45 - 0.04, 0.42), base: new THREE.Vector3(-0.72, -0.55 + 0.04, 0.38) },
      { top: new THREE.Vector3(0.9, 0.45 - 0.04, -0.42), base: new THREE.Vector3(0.72, -0.55 + 0.04, -0.38) },
      { top: new THREE.Vector3(-0.9, 0.45 - 0.04, -0.42), base: new THREE.Vector3(-0.72, -0.55 + 0.04, -0.38) },
    ];

    corners.forEach(c => this.addCable(c.top, c.base, 0.006, false));

    // 5. Physics vectors (if enabled)
    this.updateVectors();
  }

  private addCable(start: THREE.Vector3, end: THREE.Vector3, radius: number, isCenter: boolean): void {
    const dir = new THREE.Vector3().subVectors(end, start);
    const len = dir.length();
    const geom = new THREE.CylinderGeometry(radius, radius, len, 16);
    const mesh = new THREE.Mesh(geom, isCenter ? this.turnbuckleMaterial : this.cableMaterial);

    mesh.position.copy(start).addScaledVector(dir, 0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    mesh.castShadow = true;
    this.cablesGroup.add(mesh);

    // Add brass turnbuckles at ends
    const tbGeom = new THREE.CylinderGeometry(radius * 2.2, radius * 2.2, 0.04, 12);
    const tb1 = new THREE.Mesh(tbGeom, this.turnbuckleMaterial);
    tb1.position.copy(start).addScaledVector(dir, 0.04);
    tb1.quaternion.copy(mesh.quaternion);
    this.cablesGroup.add(tb1);

    const tb2 = new THREE.Mesh(tbGeom, this.turnbuckleMaterial);
    tb2.position.copy(end).addScaledVector(dir, -0.04);
    tb2.quaternion.copy(mesh.quaternion);
    this.cablesGroup.add(tb2);
  }

  private updateVectors(): void {
    while (this.vectorsGroup.children.length > 0) this.vectorsGroup.remove(this.vectorsGroup.children[0]);
    if (!this.showVectors) return;

    // Green arrows for compression masts
    const compArrow1 = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 0.45, 0), 0.4, 0x10b981, 0.08, 0.04);
    const compArrow2 = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -0.55, 0), 0.4, 0x10b981, 0.08, 0.04);
    this.vectorsGroup.add(compArrow1);
    this.vectorsGroup.add(compArrow2);

    // Cyan arrows for tension cables
    const tensionArrowCenter = new THREE.ArrowHelper(
      new THREE.Vector3(-0.48, -0.1, 0).normalize(),
      new THREE.Vector3(0.24, 0.01, 0),
      0.35,
      0x38bdf8,
      0.08,
      0.04
    );
    this.vectorsGroup.add(tensionArrowCenter);
  }

  public setWoodSpecies(woodId: string): void {
    this.activeWoodId = woodId;
    const wood = WOOD_SPECIES.find(w => w.id === woodId);
    if (!wood) return;

    this.woodMaterial.color.setHex(wood.threeColor);
    this.woodMaterial.roughness = wood.roughness;
    this.woodMaterial.needsUpdate = true;
  }

  public setTensionSystem(tensionId: string): void {
    this.activeTensionId = tensionId;
    const tension = TENSION_SYSTEMS.find(t => t.id === tensionId);
    if (!tension) return;

    this.cableMaterial.color.setHex(tension.threeColor);
    this.cableMaterial.metalness = tension.metalness;
    this.cableMaterial.needsUpdate = true;
  }

  public setExplode(factor: number): void {
    this.explodeFactor = factor; // 0 to 1
    // Move top slab up and base slab down
    this.topTableGroup.position.y = 0.45 + factor * 0.4;
    this.baseTableGroup.position.y = factor * -0.3;

    // Rebuild cables with updated positions
    while (this.cablesGroup.children.length > 0) this.cablesGroup.remove(this.cablesGroup.children[0]);
    const topY = this.topTableGroup.position.y;
    const baseY = this.baseTableGroup.position.y - 0.55;

    this.addCable(
      new THREE.Vector3(0.24, topY - 0.44, 0),
      new THREE.Vector3(-0.24, this.baseTableGroup.position.y - 0.1, 0),
      0.012,
      true
    );

    const corners = [
      { top: new THREE.Vector3(0.9, topY - 0.04, 0.42), base: new THREE.Vector3(0.72, baseY + 0.04, 0.38) },
      { top: new THREE.Vector3(-0.9, topY - 0.04, 0.42), base: new THREE.Vector3(-0.72, baseY + 0.04, 0.38) },
      { top: new THREE.Vector3(0.9, topY - 0.04, -0.42), base: new THREE.Vector3(0.72, baseY + 0.04, -0.38) },
      { top: new THREE.Vector3(-0.9, topY - 0.04, -0.42), base: new THREE.Vector3(-0.72, baseY + 0.04, -0.38) },
    ];
    corners.forEach(c => this.addCable(c.top, c.base, 0.006, false));
  }

  public toggleAutoRotate(): boolean {
    this.isAutoRotating = !this.isAutoRotating;
    return this.isAutoRotating;
  }

  public toggleVectors(): boolean {
    this.showVectors = !this.showVectors;
    this.updateVectors();
    return this.showVectors;
  }

  public setCameraPreset(preset: 'perspective' | 'top' | 'side' | 'isometric'): void {
    switch (preset) {
      case 'perspective':
        this.targetRotationX = 0.35;
        this.targetRotationY = -0.55;
        this.cameraDistance = 3.6;
        break;
      case 'top':
        this.targetRotationX = Math.PI / 2 - 0.05;
        this.targetRotationY = 0;
        this.cameraDistance = 3.2;
        break;
      case 'side':
        this.targetRotationX = 0.05;
        this.targetRotationY = -Math.PI / 2;
        this.cameraDistance = 3.4;
        break;
      case 'isometric':
        this.targetRotationX = 0.61;
        this.targetRotationY = -0.78;
        this.cameraDistance = 3.5;
        break;
    }
  }

  private updateCameraPosition(): void {
    const x = this.cameraDistance * Math.sin(this.rotationY) * Math.cos(this.rotationX);
    const y = this.cameraDistance * Math.sin(this.rotationX);
    const z = this.cameraDistance * Math.cos(this.rotationY) * Math.cos(this.rotationX);
    this.camera.position.set(x, y, z);
    this.camera.lookAt(0, -0.05, 0);
  }

  private setupEventListeners(): void {
    const dom = this.renderer.domElement;

    dom.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.prevMouseX;
      const dy = e.clientY - this.prevMouseY;

      this.targetRotationY += dx * 0.008;
      this.targetRotationX = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.targetRotationX + dy * 0.008));

      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;
      this.isAutoRotating = false;
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    dom.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.cameraDistance = Math.max(2.0, Math.min(6.5, this.cameraDistance + e.deltaY * 0.003));
    }, { passive: false });

    // Touch support
    dom.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.prevMouseX = e.touches[0].clientX;
        this.prevMouseY = e.touches[0].clientY;
      }
    });

    window.addEventListener('touchmove', (e) => {
      if (!this.isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - this.prevMouseX;
      const dy = e.touches[0].clientY - this.prevMouseY;

      this.targetRotationY += dx * 0.01;
      this.targetRotationX = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.targetRotationX + dy * 0.01));

      this.prevMouseX = e.touches[0].clientX;
      this.prevMouseY = e.touches[0].clientY;
      this.isAutoRotating = false;
    });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    // Window resize
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

    if (this.isAutoRotating) {
      this.targetRotationY += 0.004;
    }

    // Smooth camera damping
    this.rotationX += (this.targetRotationX - this.rotationX) * 0.1;
    this.rotationY += (this.targetRotationY - this.rotationY) * 0.1;
    this.updateCameraPosition();

    this.renderer.render(this.scene, this.camera);
  };

  public destroy(): void {
    cancelAnimationFrame(this.animFrameId);
    this.renderer.dispose();
    if (this.container && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
