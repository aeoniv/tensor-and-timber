import * as THREE from 'three';

export class GeodesicViewer {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private animFrameId: number = 0;

  private domeGroup: THREE.Group;
  private strutsGroup: THREE.Group;
  private hubsGroup: THREE.Group;
  private panelsGroup: THREE.Group;

  // Materials
  private timberMaterial: THREE.MeshStandardMaterial;
  private hubMaterial: THREE.MeshStandardMaterial;
  private glassMaterial: THREE.MeshPhysicalMaterial;

  // State
  private frequency: 'v2' | 'v3' | 'v4' = 'v3';
  private diameterMeters: number = 6.0;
  private glazingMode: 'open' | 'stargazing' | 'fully-glazed' = 'stargazing';
  private isAutoRotating: boolean = true;
  private isDragging: boolean = false;
  private prevMouseX: number = 0;
  private prevMouseY: number = 0;
  private rotationX: number = 0.4;
  private rotationY: number = 0.6;
  private targetRotationX: number = 0.4;
  private targetRotationY: number = 0.6;
  private cameraDistance: number = 8.5;

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Container #${containerId} not found`);
    this.container = el;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 0.1, 100);
    this.updateCameraPosition();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);

    // Materials
    this.timberMaterial = new THREE.MeshStandardMaterial({
      color: 0xc8894d, // Warm Douglas fir / oak
      roughness: 0.5,
      metalness: 0.05
    });

    this.hubMaterial = new THREE.MeshStandardMaterial({
      color: 0x38bdf8, // Anodized aluminum hubs
      roughness: 0.25,
      metalness: 0.85
    });

    this.glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.7,
      ior: 1.5,
      side: THREE.DoubleSide
    });

    this.domeGroup = new THREE.Group();
    this.strutsGroup = new THREE.Group();
    this.hubsGroup = new THREE.Group();
    this.panelsGroup = new THREE.Group();

    this.domeGroup.add(this.strutsGroup);
    this.domeGroup.add(this.hubsGroup);
    this.domeGroup.add(this.panelsGroup);
    this.scene.add(this.domeGroup);

    this.setupLighting();
    this.generateGeodesicDome();
    this.setupEventListeners();
    this.render();
  }

  private setupLighting(): void {
    const ambient = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xfff3db, 2.0);
    sun.position.set(6, 12, 8);
    sun.castShadow = true;
    this.scene.add(sun);

    const cyanRim = new THREE.DirectionalLight(0x38bdf8, 1.4);
    cyanRim.position.set(-6, 2, -6);
    this.scene.add(cyanRim);

    // Floor deck
    const deck = new THREE.Mesh(
      new THREE.CylinderGeometry(5.2, 5.2, 0.15, 48),
      new THREE.MeshStandardMaterial({ color: 0x1f242d, roughness: 0.8 })
    );
    deck.position.y = -0.075;
    deck.receiveShadow = true;
    this.scene.add(deck);
  }

  public setFrequency(freq: 'v2' | 'v3' | 'v4'): void {
    this.frequency = freq;
    this.generateGeodesicDome();
  }

  public setDiameter(d: number): void {
    this.diameterMeters = d;
    const scale = d / 6.0;
    this.domeGroup.scale.set(scale, scale, scale);
    this.cameraDistance = 8.5 * (d / 6.0);
    this.updateCameraPosition();
  }

  public setGlazingMode(mode: 'open' | 'stargazing' | 'fully-glazed'): void {
    this.glazingMode = mode;
    this.generateGeodesicDome();
  }

  public setTimberColor(colorHex: number): void {
    this.timberMaterial.color.setHex(colorHex);
    this.timberMaterial.needsUpdate = true;
  }

  private generateGeodesicDome(): void {
    // Clear previous
    while (this.strutsGroup.children.length > 0) this.strutsGroup.remove(this.strutsGroup.children[0]);
    while (this.hubsGroup.children.length > 0) this.hubsGroup.remove(this.hubsGroup.children[0]);
    while (this.panelsGroup.children.length > 0) this.panelsGroup.remove(this.panelsGroup.children[0]);

    // Icosahedron Base
    const radius = 3.0; // standard 6m diameter base
    const subdivisions = this.frequency === 'v2' ? 2 : this.frequency === 'v3' ? 3 : 4;

    // Use Three.js IcosahedronGeometry to obtain subdivided upper hemisphere
    const baseGeom = new THREE.IcosahedronGeometry(radius, subdivisions);
    const pos = baseGeom.getAttribute('position');

    // Collect vertices and edges for upper hemisphere (y >= -0.05)
    const vertices: THREE.Vector3[] = [];
    const vertexMap = new Map<string, number>();

    const getVertexIndex = (v: THREE.Vector3): number => {
      // Round to 3 decimals to weld vertices
      const key = `${v.x.toFixed(3)},${v.y.toFixed(3)},${v.z.toFixed(3)}`;
      if (vertexMap.has(key)) return vertexMap.get(key)!;
      const idx = vertices.length;
      vertices.push(v);
      vertexMap.set(key, idx);
      return idx;
    };

    const edgeSet = new Set<string>();
    const triangles: [number, number, number][] = [];

    for (let i = 0; i < pos.count; i += 3) {
      const v1 = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
      const v2 = new THREE.Vector3(pos.getX(i + 1), pos.getY(i + 1), pos.getZ(i + 1));
      const v3 = new THREE.Vector3(pos.getX(i + 2), pos.getY(i + 2), pos.getZ(i + 2));

      // Only take upper hemisphere
      if (v1.y >= -0.15 && v2.y >= -0.15 && v3.y >= -0.15) {
        const i1 = getVertexIndex(v1);
        const i2 = getVertexIndex(v2);
        const i3 = getVertexIndex(v3);

        triangles.push([i1, i2, i3]);

        const addEdge = (a: number, b: number) => {
          const edgeKey = a < b ? `${a}-${b}` : `${b}-${a}`;
          edgeSet.add(edgeKey);
        };
        addEdge(i1, i2);
        addEdge(i2, i3);
        addEdge(i3, i1);
      }
    }

    // 1. Render Timber Struts
    const strutRadius = this.frequency === 'v4' ? 0.022 : 0.035;
    edgeSet.forEach(edgeKey => {
      const [aStr, bStr] = edgeKey.split('-');
      const pA = vertices[parseInt(aStr)];
      const pB = vertices[parseInt(bStr)];

      const dir = new THREE.Vector3().subVectors(pB, pA);
      const len = dir.length();
      const strutGeom = new THREE.CylinderGeometry(strutRadius, strutRadius, len, 8);
      const strutMesh = new THREE.Mesh(strutGeom, this.timberMaterial);

      strutMesh.position.copy(pA).addScaledVector(dir, 0.5);
      strutMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
      strutMesh.castShadow = true;
      this.strutsGroup.add(strutMesh);
    });

    // 2. Render Connector Hubs
    const hubGeom = new THREE.SphereGeometry(strutRadius * 1.7, 12, 12);
    vertices.forEach(v => {
      const hubMesh = new THREE.Mesh(hubGeom, this.hubMaterial);
      hubMesh.position.copy(v);
      hubMesh.castShadow = true;
      this.hubsGroup.add(hubMesh);
    });

    // 3. Render Glazing Panels
    if (this.glazingMode !== 'open') {
      triangles.forEach(([i1, i2, i3]) => {
        const v1 = vertices[i1];
        const v2 = vertices[i2];
        const v3 = vertices[i3];

        const avgY = (v1.y + v2.y + v3.y) / 3;

        // If stargazing, only render top 45% crown
        if (this.glazingMode === 'stargazing' && avgY < radius * 0.45) {
          return;
        }

        const panelGeom = new THREE.BufferGeometry();
        const pts = new Float32Array([
          v1.x, v1.y, v1.z,
          v2.x, v2.y, v2.z,
          v3.x, v3.y, v3.z
        ]);
        panelGeom.setAttribute('position', new THREE.BufferAttribute(pts, 3));
        panelGeom.computeVertexNormals();

        const panelMesh = new THREE.Mesh(panelGeom, this.glassMaterial);
        this.panelsGroup.add(panelMesh);
      });
    }
  }

  public toggleAutoRotate(): boolean {
    this.isAutoRotating = !this.isAutoRotating;
    return this.isAutoRotating;
  }

  private updateCameraPosition(): void {
    const x = this.cameraDistance * Math.sin(this.rotationY) * Math.cos(this.rotationX);
    const y = Math.max(0.5, this.cameraDistance * Math.sin(this.rotationX));
    const z = this.cameraDistance * Math.cos(this.rotationY) * Math.cos(this.rotationX);
    this.camera.position.set(x, y, z);
    this.camera.lookAt(0, 1.2, 0);
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
      this.targetRotationX = Math.max(0.05, Math.min(Math.PI / 2.1, this.targetRotationX + dy * 0.008));

      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;
      this.isAutoRotating = false;
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    dom.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.cameraDistance = Math.max(4.0, Math.min(16.0, this.cameraDistance + e.deltaY * 0.008));
    }, { passive: false });

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
      this.targetRotationY += 0.003;
    }

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
