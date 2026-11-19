import * as THREE from 'three';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter.js';
import {
  CabinetStyleOptions,
  CabinetryQuoteResult,
  HardwareTierId,
  MdfFinishOption,
  ProposedCabinetModule,
} from '../data/pricingCatalog';
import { DetectedObstacle, RoomAnalysisResult } from './roomAnalyzerService';

export type CounterTone = 'claro' | 'escuro' | 'madeira';

function createMdfMaterial(finish: MdfFinishOption): THREE.MeshStandardMaterial {
  const color = new THREE.Color(finish.hex);

  if (finish.grain) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = finish.hex;
      ctx.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 420; i++) {
        const x = Math.random() * 512;
        const w = 1 + Math.random() * 2.5;
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)';
        ctx.fillRect(x, 0, w, 512);
      }
      ctx.strokeStyle = 'rgba(40,20,8,0.08)';
      ctx.lineWidth = 1;
      for (let k = 0; k < 28; k++) {
        ctx.beginPath();
        const x0 = Math.random() * 512;
        ctx.moveTo(x0, 0);
        ctx.bezierCurveTo(x0 + (Math.random() - 0.5) * 20, 170, x0 + (Math.random() - 0.5) * 20, 340, x0, 512);
        ctx.stroke();
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.56,
      metalness: 0.04,
    });
  }

  return new THREE.MeshStandardMaterial({
    color,
    roughness: finish.gloss ? 0.14 : 0.54,
    metalness: finish.gloss ? 0.12 : 0.04,
  });
}

function addBox(
  parent: THREE.Group,
  w: number,
  h: number,
  d: number,
  x: number,
  y: number,
  z: number,
  mat: THREE.Material,
  name: string
): THREE.Mesh {
  const geo = new THREE.BoxGeometry(Math.max(0.005, w), Math.max(0.005, h), Math.max(0.005, d));
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.name = name;
  parent.add(mesh);
  return mesh;
}

function addCylinder(
  parent: THREE.Group,
  rTop: number,
  rBot: number,
  h: number,
  x: number,
  y: number,
  z: number,
  mat: THREE.Material,
  name: string,
  rotZ: number = 0,
  rotX: number = 0
): THREE.Mesh {
  const geo = new THREE.CylinderGeometry(rTop, rBot, h, 24);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  mesh.rotation.z = rotZ;
  mesh.rotation.x = rotX;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.name = name;
  parent.add(mesh);
  return mesh;
}

export function buildRoomShellGroup(
  dims: { widthCm: number; heightCm: number; depthCm: number },
  obstacles: DetectedObstacle[],
  modules: ProposedCabinetModule[] = []
): THREE.Group {
  const shell = new THREE.Group();
  shell.name = 'Room_Architecture_Shell';

  const W = dims.widthCm / 100;
  const H = dims.heightCm / 100;

  let maxSideReach = 1.65;
  for (const m of modules) {
    if (m.wall === 'left' || m.wall === 'right') {
      maxSideReach = Math.max(maxSideReach, (m.xCm + m.widthCm) / 100 + 0.35);
    } else if (m.wall === 'center') {
      maxSideReach = Math.max(maxSideReach, ((m.zCm ?? 150) + m.depthCm) / 100 + 0.9);
    }
  }
  const D = Math.max(dims.depthCm / 100, maxSideReach + 0.5);

  const wallMat = new THREE.MeshStandardMaterial({ color: 0xf4f2ed, roughness: 0.88, metalness: 0.02 });
  const sideWallMat = new THREE.MeshStandardMaterial({ color: 0xece9e2, roughness: 0.9, metalness: 0.02, transparent: true, opacity: 0.55 });
  const floorMat = new THREE.MeshStandardMaterial({ color: 0xe6e1d6, roughness: 0.72, metalness: 0.03 });
  const baseboardMat = new THREE.MeshStandardMaterial({ color: 0xd6d1c6, roughness: 0.7 });

  addBox(shell, W + 0.3, 0.03, D, 0, -0.015, D / 2, floorMat, 'Floor_Slab');
  const grid = new THREE.GridHelper(Math.max(W, D) + 0.6, 18, 0xcbd5e1, 0xe2e8f0);
  grid.position.set(0, 0.002, D / 2);
  shell.add(grid);

  addBox(shell, W + 0.24, H, 0.12, 0, H / 2, -0.06, wallMat, 'Back_Wall');
  addBox(shell, W + 0.24, 0.08, 0.018, 0, 0.04, 0.009, baseboardMat, 'Back_Wall_Baseboard');

  const wingDepth = Math.min(D * 0.82, maxSideReach + 0.35);
  addBox(shell, 0.08, H, wingDepth, -W / 2 - 0.04, H / 2, wingDepth / 2, sideWallMat, 'Left_Wall');
  addBox(shell, 0.08, H, wingDepth, W / 2 + 0.04, H / 2, wingDepth / 2, sideWallMat, 'Right_Wall');

  const windowFrameMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.35, metalness: 0.6 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0xbae6fd, roughness: 0.1, transparent: true, opacity: 0.45 });
  const doorWoodMat = new THREE.MeshStandardMaterial({ color: 0xd6bfa6, roughness: 0.65 });
  const outletMat = new THREE.MeshStandardMaterial({ color: 0xf5a623, emissive: 0x92400e, emissiveIntensity: 0.25, roughness: 0.4 });
  const plumbingMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, emissive: 0x075985, emissiveIntensity: 0.3, roughness: 0.4 });

  for (const obs of obstacles) {
    if (obs.wall === 'back') {
      const ow = Math.max(0.12, (obs.xEndCm - obs.xStartCm) / 100);
      const oh = Math.max(0.12, (obs.yTopCm - obs.yBottomCm) / 100);
      const ox = -W / 2 + ((obs.xStartCm + obs.xEndCm) / 2) / 100;
      const oy = ((obs.yBottomCm + obs.yTopCm) / 2) / 100;

      if (obs.type === 'window') {
        const g = new THREE.Group();
        g.name = `Obstacle_Window_${obs.id}`;
        addBox(g, ow, oh, 0.03, ox, oy, 0.012, glassMat, 'Window_Glass');
        addBox(g, ow + 0.06, 0.04, 0.045, ox, oy + oh / 2, 0.016, windowFrameMat, 'Window_Top_Frame');
        addBox(g, ow + 0.06, 0.04, 0.045, ox, oy - oh / 2, 0.016, windowFrameMat, 'Window_Sill');
        addBox(g, 0.04, oh, 0.045, ox - ow / 2, oy, 0.016, windowFrameMat, 'Window_Left_Frame');
        addBox(g, 0.04, oh, 0.045, ox + ow / 2, oy, 0.016, windowFrameMat, 'Window_Right_Frame');
        shell.add(g);
      } else if (obs.type === 'door') {
        const dh = Math.max(oh, 2.05);
        addBox(shell, ow, dh, 0.035, ox, dh / 2, 0.018, doorWoodMat, `Obstacle_Door_${obs.id}`);
        addBox(shell, ow + 0.08, 0.05, 0.05, ox, dh, 0.022, windowFrameMat, `Door_Frame_Top_${obs.id}`);
      } else if (obs.type === 'outlet') {
        addBox(shell, 0.09, 0.13, 0.022, ox, oy, 0.012, outletMat, `Obstacle_Outlet_${obs.id}`);
      } else if (obs.type === 'plumbing') {
        addBox(shell, 0.14, 0.14, 0.035, ox, oy, 0.018, plumbingMat, `Obstacle_Plumbing_${obs.id}`);
      }
    } else {
      const sideX = obs.wall === 'left' ? -W / 2 + 0.02 : W / 2 - 0.02;
      const oh = obs.type === 'door' ? 2.10 : 1.1;
      const oy = obs.type === 'door' ? 1.05 : 1.4;
      const mat = obs.type === 'door' ? doorWoodMat : glassMat;
      addBox(shell, 0.03, oh, 0.85, sideX, oy, 0.65, mat, `Side_Obstacle_${obs.type}_${obs.id}`);
    }
  }

  return shell;
}

export function buildCabinetModulesGroup(
  modules: ProposedCabinetModule[],
  roomWidthCm: number,
  frontFinish: MdfFinishOption,
  hardwareId: HardwareTierId,
  carcassFinish?: MdfFinishOption,
  counterTone: CounterTone = 'claro',
  styleOptions: Partial<CabinetStyleOptions> = {}
): THREE.Group {
  const root = new THREE.Group();
  root.name = 'TensorTimber_Cabinetry_Proposal';

  const frontStyle = styleOptions.frontStyle || 'lisa';
  const handleStyle = styleOptions.handleStyle || 'perfil_18';
  const thicknessMode = styleOptions.thicknessMode || '15mm';

  const W = roomWidthCm / 100;
  const frontMat = createMdfMaterial(frontFinish);
  const carcassMat = carcassFinish && carcassFinish.cod15 !== frontFinish.cod15
    ? createMdfMaterial(carcassFinish)
    : frontMat;

  const interiorMat = new THREE.MeshStandardMaterial({ color: 0xf4f3ef, roughness: 0.65 });
  const plinthMat = new THREE.MeshStandardMaterial({ color: 0xd6d3cd, roughness: 0.7 });
  const alumMat = new THREE.MeshStandardMaterial({
    color: hardwareId === 'padrao' ? 0xb8bec6 : 0x262626,
    roughness: 0.28,
    metalness: 0.82,
  });
  const cavaGrooveMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.55, metalness: 0.1 });
  const stoneColor = counterTone === 'escuro' ? 0x26282b : counterTone === 'madeira' ? 0x9f6c3f : 0xe4e0d8;
  const stoneMat = new THREE.MeshStandardMaterial({
    color: stoneColor,
    roughness: counterTone === 'madeira' ? 0.5 : 0.22,
    metalness: 0.06,
  });
  const ceramicMat = new THREE.MeshStandardMaterial({ color: 0xfefefe, roughness: 0.15, metalness: 0.05 });
  const darkGlassMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.16, metalness: 0.45 });
  const reflectaGlassMat = new THREE.MeshStandardMaterial({ color: 0x3b2f2a, roughness: 0.08, metalness: 0.35, transparent: true, opacity: 0.44 });
  const tintedGlassMat = reflectaGlassMat;
  const mirrorMat = new THREE.MeshStandardMaterial({ color: 0xdbeafe, roughness: 0.06, metalness: 0.88 });
  const steelMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.22, metalness: 0.9 });
  const fabricMat = new THREE.MeshStandardMaterial({ color: 0xebe6de, roughness: 0.88 });
  const linenHeadMat = new THREE.MeshStandardMaterial({ color: 0xd8d0c3, roughness: 0.92 });
  const ledMat = new THREE.MeshStandardMaterial({ color: 0xfff3d1, emissive: 0xffd27d, emissiveIntensity: 1.4 });

  const panelT = thicknessMode === '25mm_engrossado' ? 0.024 : thicknessMode === '18mm' ? 0.018 : 0.015;
  const gap = 0.003;

  const addStyledDoor = (
    g: THREE.Group,
    w: number,
    h: number,
    x: number,
    y: number,
    zFront: number,
    name: string,
    allowGlass: boolean,
    isLeftLeaf: boolean
  ) => {
    const useGlass = allowGlass && frontStyle === 'vidro_reflecta';
    if (useGlass) {
      addBox(g, Math.max(0.04, w - 0.044), Math.max(0.04, h - 0.044), 0.008, x, y, zFront, reflectaGlassMat, `${name}_Glass`);
      addBox(g, w, 0.022, 0.018, x, y + h / 2 - 0.011, zFront, alumMat, `${name}_AlumTop`);
      addBox(g, w, 0.022, 0.018, x, y - h / 2 + 0.011, zFront, alumMat, `${name}_AlumBot`);
      addBox(g, 0.022, h, 0.018, x - w / 2 + 0.011, y, zFront, alumMat, `${name}_AlumL`);
      addBox(g, 0.022, h, 0.018, x + w / 2 - 0.011, y, zFront, alumMat, `${name}_AlumR`);
      return;
    }

    if (frontStyle === 'provencal' && w > 0.16 && h > 0.18) {
      const frameW = Math.min(0.042, w * 0.18);
      addBox(g, w - frameW * 1.4, h - frameW * 1.4, 0.010, x, y, zFront - 0.004, frontMat, `${name}_Core`);
      addBox(g, w, frameW, 0.018, x, y + h / 2 - frameW / 2, zFront, frontMat, `${name}_RailTop`);
      addBox(g, w, frameW, 0.018, x, y - h / 2 + frameW / 2, zFront, frontMat, `${name}_RailBot`);
      addBox(g, frameW, h - frameW * 2, 0.018, x - w / 2 + frameW / 2, y, zFront, frontMat, `${name}_StileL`);
      addBox(g, frameW, h - frameW * 2, 0.018, x + w / 2 - frameW / 2, y, zFront, frontMat, `${name}_StileR`);
    } else {
      addBox(g, w, h, 0.018, x, y, zFront, frontMat, name);
      if (frontStyle === 'cava45') {
        addBox(g, w - 0.004, 0.012, 0.006, x, y + h / 2 - 0.006, zFront + 0.008, cavaGrooveMat, `${name}_Cava`);
      }
    }

    if (handleStyle !== 'fecho_toque' && frontStyle !== 'cava45') {
      const isLong = handleStyle === 'perfil_15';
      const hx = x + (isLeftLeaf ? w / 2 - 0.028 : -w / 2 + 0.028);
      const hh = isLong ? Math.max(0.14, h * 0.88) : Math.min(0.24, h * 0.42);
      addBox(g, 0.011, hh, 0.014, hx, y + (isLong ? 0 : h * 0.12), zFront + 0.014, alumMat, `${name}_Handle`);
    }
  };

  const addStyledDrawer = (
    g: THREE.Group,
    w: number,
    h: number,
    x: number,
    y: number,
    zFront: number,
    name: string
  ) => {
    if (frontStyle === 'provencal' && w > 0.18 && h > 0.12) {
      const fw = Math.min(0.032, h * 0.22);
      addBox(g, w - fw, h - fw, 0.010, x, y, zFront - 0.003, frontMat, `${name}_Core`);
      addBox(g, w, fw, 0.018, x, y + h / 2 - fw / 2, zFront, frontMat, `${name}_Top`);
      addBox(g, w, fw, 0.018, x, y - h / 2 + fw / 2, zFront, frontMat, `${name}_Bot`);
    } else {
      addBox(g, w, h, 0.018, x, y, zFront, frontMat, name);
      if (frontStyle === 'cava45') {
        addBox(g, w - 0.004, 0.012, 0.006, x, y + h / 2 - 0.006, zFront + 0.008, cavaGrooveMat, `${name}_Cava`);
      }
    }
    if (handleStyle !== 'fecho_toque' && frontStyle !== 'cava45') {
      const barW = handleStyle === 'perfil_15' ? w * 0.92 : Math.min(w * 0.55, 0.36);
      addBox(g, barW, 0.01, 0.014, x, y + h / 2 - 0.02, zFront + 0.014, alumMat, `${name}_Pull`);
    }
  };

  const buildStandardCarcass = (g: THREE.Group, mw: number, bodyH: number, md: number, plinthH: number) => {
    if (plinthH > 0) {
      addBox(g, mw - 0.02, plinthH, md - 0.05, 0, plinthH / 2, (md - 0.05) / 2, plinthMat, 'Base_Plinth');
    }
    addBox(g, panelT, bodyH, md, -mw / 2 + panelT / 2, plinthH + bodyH / 2, md / 2, carcassMat, 'Side_Left');
    addBox(g, panelT, bodyH, md, mw / 2 - panelT / 2, plinthH + bodyH / 2, md / 2, carcassMat, 'Side_Right');
    addBox(g, mw - panelT * 2, panelT, md, 0, plinthH + panelT / 2, md / 2, carcassMat, 'Bottom_Panel');
    addBox(g, mw - panelT * 2, panelT, md, 0, plinthH + bodyH - panelT / 2, md / 2, carcassMat, 'Top_Panel');
    addBox(g, mw - panelT * 2, bodyH - panelT * 2, 0.006, 0, plinthH + bodyH / 2, 0.012, interiorMat, 'Back_6mm');
  };

  for (const mod of modules) {
    const g = new THREE.Group();
    g.name = `Module_${mod.id}_${mod.type}`;

    const mw = mod.widthCm / 100;
    const mh = mod.heightCm / 100;
    const md = mod.depthCm / 100;
    const yBase = mod.yCm / 100;

    // 1. PAINEL RIPADO TV / CABECEIRA
    if (mod.type === 'painel_tv_ripado' || mod.type === 'painel_cabeceira') {
      const backDepth = 0.022;
      addBox(g, mw, mh, backDepth, 0, mh / 2, backDepth / 2, carcassMat, 'Panel_Base');
      const slatW = 0.032;
      const step = 0.048;
      const count = Math.max(4, Math.floor(mw / step));
      for (let i = 0; i < count; i++) {
        const sx = -mw / 2 + step / 2 + i * step;
        if (sx + slatW / 2 <= mw / 2) {
          addBox(g, slatW, mh, 0.018, sx, mh / 2, backDepth + 0.009, frontMat, `Slat_${i}`);
        }
      }
      if (mod.type === 'painel_tv_ripado') {
        const tvW = Math.min(mw * 0.58, 1.45);
        const tvH = tvW * 0.5625;
        addBox(g, tvW, tvH, 0.024, 0, Math.max(mh * 0.56, 1.25 - yBase), backDepth + 0.030, darkGlassMat, 'TV_Screen');
      }
      if (mod.hasLed) {
        addBox(g, mw * 0.94, 0.012, 0.012, 0, mh - 0.03, backDepth + 0.022, ledMat, 'LED_Profile');
      }
    }
    // 2. CAMA BAÚ PLANEJADA
    else if (mod.type === 'cama_bau_planejada') {
      const baseH = 0.36;
      addBox(g, mw, baseH, md, 0, baseH / 2, md / 2, carcassMat, 'Bed_Storage_Base');
      // Frentes das gavetas laterais e frontal
      addBox(g, mw * 0.44, baseH - 0.05, 0.018, -mw * 0.24, baseH / 2, md + 0.009, frontMat, 'Bed_Front_Drawer_L');
      addBox(g, mw * 0.44, baseH - 0.05, 0.018, mw * 0.24, baseH / 2, md + 0.009, frontMat, 'Bed_Front_Drawer_R');
      // Colchão + travesseiros
      addBox(g, mw - 0.08, 0.24, md - 0.08, 0, baseH + 0.12, md / 2, fabricMat, 'Mattress');
      addBox(g, mw * 0.36, 0.11, 0.36, -mw * 0.22, baseH + 0.29, 0.24, ceramicMat, 'Pillow_L');
      addBox(g, mw * 0.36, 0.11, 0.36, mw * 0.22, baseH + 0.29, 0.24, ceramicMat, 'Pillow_R');
    }
    // 3. NICHO GELADEIRA
    else if (mod.type === 'nicho_geladeira') {
      const fridgeH = Math.min(mh - 0.36, 1.88);
      addBox(g, panelT, mh, md, -mw / 2 + panelT / 2, mh / 2, md / 2, frontMat, 'Side_Left');
      addBox(g, panelT, mh, md, mw / 2 - panelT / 2, mh / 2, md / 2, frontMat, 'Side_Right');
      // Geladeira inox ilustrativa recuada
      addBox(g, mw - 0.10, fridgeH - 0.06, md - 0.06, 0, (fridgeH - 0.06) / 2, (md - 0.06) / 2, steelMat, 'Fridge_Silhouette');
      const upperH = mh - fridgeH;
      if (upperH >= 0.28) {
        addBox(g, mw - panelT * 2, upperH, md, 0, fridgeH + upperH / 2, md / 2, carcassMat, 'Over_Fridge_Carcass');
        addBox(g, (mw - panelT * 2) / 2 - gap, upperH - gap * 2, 0.018, -(mw - panelT * 2) / 4, fridgeH + upperH / 2, md + 0.009, frontMat, 'Door_L');
        addBox(g, (mw - panelT * 2) / 2 - gap, upperH - gap * 2, 0.018, (mw - panelT * 2) / 4, fridgeH + upperH / 2, md + 0.009, frontMat, 'Door_R');
      }
    }
    // 4. CRISTALEIRA EM VIDRO E ALUMÍNIO + LED
    else if (mod.type === 'cristaleira_vidro') {
      const plinthH = 0.08;
      const bodyH = mh - plinthH;
      buildStandardCarcass(g, mw, bodyH, md, plinthH);
      const innerW = mw - panelT * 2;
      const shelves = mod.shelvesCount ?? 4;
      for (let s = 1; s <= shelves; s++) {
        addBox(g, innerW - 0.02, 0.008, md - 0.04, 0, plinthH + (bodyH / (shelves + 1)) * s, md / 2, tintedGlassMat, `Glass_Shelf_${s}`);
      }
      if (mod.hasLed !== false) {
        addBox(g, 0.012, bodyH - 0.06, 0.012, -innerW / 2 + 0.015, plinthH + bodyH / 2, md - 0.04, ledMat, 'LED_Strip_L');
        addBox(g, 0.012, bodyH - 0.06, 0.012, innerW / 2 - 0.015, plinthH + bodyH / 2, md - 0.04, ledMat, 'LED_Strip_R');
      }
      const doors = Math.max(1, mod.doorsCount || 2);
      const dw = innerW / doors;
      for (let i = 0; i < doors; i++) {
        const dx = -innerW / 2 + dw / 2 + i * dw;
        addBox(g, dw - 0.04, bodyH - 0.05, 0.008, dx, plinthH + bodyH / 2, md + 0.01, tintedGlassMat, `Glass_Door_${i + 1}`);
        // Moldura aluminio
        addBox(g, dw - gap * 2, 0.024, 0.018, dx, plinthH + bodyH - 0.015, md + 0.009, alumMat, `Alum_Top_${i}`);
        addBox(g, dw - gap * 2, 0.024, 0.018, dx, plinthH + 0.015, md + 0.009, alumMat, `Alum_Bot_${i}`);
        addBox(g, 0.024, bodyH - gap * 2, 0.018, dx - dw / 2 + 0.014, plinthH + bodyH / 2, md + 0.009, alumMat, `Alum_L_${i}`);
        addBox(g, 0.024, bodyH - gap * 2, 0.018, dx + dw / 2 - 0.014, plinthH + bodyH / 2, md + 0.009, alumMat, `Alum_R_${i}`);
      }
    }
    // 5. CLOSET ABERTO (CABIDEIRO + PRATELEIRAS + GAVETEIRO)
    else if (mod.type === 'closet_cabideiro_aberto') {
      const plinthH = 0.08;
      const bodyH = mh - plinthH;
      buildStandardCarcass(g, mw, bodyH, md, plinthH);
      const innerW = mw - panelT * 2;
      // Maleiro superior
      addBox(g, innerW, panelT, md - 0.02, 0, plinthH + bodyH - 0.36, md / 2, frontMat, 'Luggage_Shelf');
      // Divisoria central
      addBox(g, panelT, bodyH - 0.38, md - 0.02, 0, plinthH + (bodyH - 0.38) / 2, md / 2, frontMat, 'Center_Divider');
      // Tubo Cabideiro Cromado Oval na esquerda
      addCylinder(g, 0.014, 0.014, innerW / 2 - 0.03, -innerW / 4, plinthH + bodyH - 0.48, md * 0.52, steelMat, 'Hanging_Rod', Math.PI / 2);
      // Nichos/prateleiras à direita + gavetas na base
      const dH = 0.56;
      for (let k = 0; k < 3; k++) {
        const gh = dH / 3;
        addBox(g, innerW / 2 - 0.02, gh - gap * 2, 0.018, innerW / 4, plinthH + gh / 2 + k * gh, md + 0.006, frontMat, `Closet_Drawer_${k}`);
      }
      for (let s = 1; s <= 3; s++) {
        addBox(g, innerW / 2 - 0.01, panelT, md - 0.03, innerW / 4, plinthH + dH + 0.32 * s, md / 2, frontMat, `Closet_Shelf_${s}`);
      }
    }
    // 6. GUARDA-ROUPA DE CORRER / ABRIR / ARMÁRIO VASSOUREIRO
    else if (mod.type === 'guarda_roupa_correr' || mod.type === 'guarda_roupa_abrir' || mod.type === 'armario_vassoureiro' || mod.type === 'arquivo_escritorio') {
      const plinthH = 0.08;
      const bodyH = mh - plinthH;
      buildStandardCarcass(g, mw, bodyH, md, plinthH);
      const innerW = mw - panelT * 2;
      const doors = Math.max(1, mod.doorsCount || (mw > 1.8 ? 3 : 2));
      const doorW = innerW / doors;

      if (mod.type === 'guarda_roupa_correr') {
        addBox(g, innerW, 0.028, 0.045, 0, plinthH + bodyH - 0.014, md - 0.022, alumMat, 'Rometal_Top_Track');
        addBox(g, innerW, 0.016, 0.045, 0, plinthH + 0.008, md - 0.022, alumMat, 'Rometal_Bottom_Track');
        for (let dIdx = 0; dIdx < doors; dIdx++) {
          const dx = -innerW / 2 + doorW / 2 + dIdx * doorW;
          const zOffset = dIdx % 2 === 0 ? md - 0.012 : md + 0.010;
          addStyledDoor(g, doorW + 0.012, bodyH - 0.04, dx, plinthH + bodyH / 2, zOffset, `Sliding_Door_${dIdx + 1}`, true, dIdx % 2 === 0);
        }
      } else {
        for (let dIdx = 0; dIdx < doors; dIdx++) {
          const dx = -innerW / 2 + doorW / 2 + dIdx * doorW;
          addStyledDoor(g, doorW - gap * 2, bodyH - gap * 2, dx, plinthH + bodyH / 2, md + 0.009, `Door_${dIdx + 1}`, false, dIdx % 2 === 0);
        }
      }
    }
    // 6B. PAINEL MUXARABI VAZADO
    else if (mod.type === 'painel_muxarabi') {
      addBox(g, mw, 0.032, md, 0, 0.016, md / 2, frontMat, 'Muxarabi_Frame_Bot');
      addBox(g, mw, 0.032, md, 0, mh - 0.016, md / 2, frontMat, 'Muxarabi_Frame_Top');
      const cols = Math.max(4, Math.floor(mw / 0.14));
      const rows = Math.max(6, Math.floor(mh / 0.18));
      for (let c = 0; c <= cols; c++) {
        const vx = -mw / 2 + 0.02 + ((mw - 0.04) / cols) * c;
        addBox(g, 0.022, mh - 0.04, md * 0.72, vx, mh / 2, md / 2, frontMat, `Muxarabi_V_${c}`);
      }
      for (let r = 1; r < rows; r++) {
        const hy = (mh / rows) * r;
        addBox(g, mw - 0.03, 0.022, md * 0.45, 0, hy, md / 2, carcassMat, `Muxarabi_H_${r}`);
      }
      if (mod.hasLed) {
        addBox(g, 0.014, mh * 0.92, 0.012, mw / 2 - 0.01, mh / 2, 0.01, ledMat, 'Muxarabi_LED');
      }
    }
    // 6C. CABECEIRA ESTOFADA MODULADA LED
    else if (mod.type === 'cabeceira_estofada') {
      addBox(g, mw, mh, 0.022, 0, mh / 2, 0.011, carcassMat, 'Upholstered_Base');
      const panels = Math.max(4, Math.round(mw / 0.36));
      const pw = (mw - 0.03) / panels;
      for (let p = 0; p < panels; p++) {
        const px = -(mw - 0.03) / 2 + pw / 2 + p * pw;
        addBox(g, pw - 0.008, mh - 0.04, 0.058, px, mh / 2, 0.048, linenHeadMat, `Headboard_Pad_${p + 1}`);
      }
      if (mod.hasLed !== false) {
        addBox(g, mw * 0.96, 0.012, 0.014, 0, mh - 0.012, 0.02, ledMat, 'Headboard_Top_LED');
      }
    }
    // 6D. FECHAMENTO SUPERIOR / TAMPONAMENTO TETO
    else if (mod.type === 'fechamento_teto') {
      addBox(g, mw, mh, 0.024, 0, mh / 2, md - 0.012, frontMat, 'Soffit_Fascia');
      addBox(g, mw - 0.02, 0.018, md, 0, 0.009, md / 2, carcassMat, 'Soffit_Return');
    }
    // 6E. MESA / BANCADA RETRÁTIL COMPACTA
    else if (mod.type === 'mesa_retratil') {
      addBox(g, mw, 0.22, 0.06, 0, mh - 0.11, 0.03, carcassMat, 'Wall_Mount_Cleat');
      addBox(g, mw, 0.030, md, 0, mh - 0.015, md / 2, frontMat, 'Folding_Top');
      addBox(g, 0.045, mh - 0.03, 0.045, -mw * 0.42, (mh - 0.03) / 2, md - 0.06, alumMat, 'Fold_Leg_L');
      addBox(g, 0.045, mh - 0.03, 0.045, mw * 0.42, (mh - 0.03) / 2, md - 0.06, alumMat, 'Fold_Leg_R');
    }
    // 6F. BALCÃO DE CANTO L / AÉREO CANTO L
    else if (mod.type === 'balcao_canto_L' || mod.type === 'aereo_canto_L') {
      const isBase = mod.type === 'balcao_canto_L';
      const plinthH = isBase ? 0.12 : 0;
      const topH = isBase ? 0.032 : 0;
      const bodyH = mh - plinthH - topH;
      const armD = Math.min(0.60, md * 0.62);
      // Braço principal + retorno em L frontal esquerdo
      addBox(g, mw, bodyH, armD, 0, plinthH + bodyH / 2, armD / 2, carcassMat, 'Corner_Arm_Main');
      addBox(g, armD, bodyH, Math.max(0.30, md - armD), -mw / 2 + armD / 2, plinthH + bodyH / 2, armD + (md - armD) / 2, carcassMat, 'Corner_Arm_Return');
      if (isBase) {
        addBox(g, mw - 0.02, plinthH, armD - 0.04, 0, plinthH / 2, armD / 2, plinthMat, 'Corner_Plinth_Main');
        addBox(g, mw + 0.02, topH, armD + 0.02, 0, plinthH + bodyH + topH / 2, (armD + 0.02) / 2, stoneMat, 'Corner_Stone_Main');
        addBox(g, armD + 0.02, topH, Math.max(0.32, md - armD), -mw / 2 + armD / 2, plinthH + bodyH + topH / 2, armD + (md - armD) / 2, stoneMat, 'Corner_Stone_Return');
      }
      addStyledDoor(g, (mw - armD) * 0.85, bodyH - gap * 2, armD / 2, plinthH + bodyH / 2, armD + 0.009, 'Corner_Front_Door', !isBase, true);
      addBox(g, 0.018, bodyH - gap * 2, Math.max(0.28, md - armD) * 0.88, -mw / 2 + armD + 0.009, plinthH + bodyH / 2, armD + (md - armD) / 2, frontMat, 'Corner_Return_Door');
    }
    // 6G. BALCÃO LAVA-LOUÇAS / ADEGA EMBUTIDA
    else if (mod.type === 'balcao_lava_loucas') {
      const plinthH = 0.12;
      const topH = 0.032;
      const bodyH = mh - plinthH - topH;
      buildStandardCarcass(g, mw, bodyH, md, plinthH);
      addBox(g, mw * 0.52 - 0.02, bodyH - 0.02, 0.02, -mw * 0.22, plinthH + bodyH / 2, md + 0.008, steelMat, 'Dishwasher_Fascia');
      addBox(g, mw * 0.44, 0.014, 0.022, -mw * 0.22, plinthH + bodyH - 0.05, md + 0.022, darkGlassMat, 'Dishwasher_Handle');
      addStyledDoor(g, mw * 0.44 - gap * 2, bodyH - gap * 2, mw * 0.26, plinthH + bodyH / 2, md + 0.009, 'Side_Cab_Door', false, false);
      addBox(g, mw + 0.02, topH, md + 0.03, 0, plinthH + bodyH + topH / 2, (md + 0.03) / 2, stoneMat, 'Dishwasher_Countertop');
    }
    // 6H. BALCÃO RECEPÇÃO / ATENDIMENTO COMERCIAL
    else if (mod.type === 'balcao_atendimento_comercial') {
      const baseH = Math.min(0.78, mh * 0.72);
      const topLedgeH = mh - baseH;
      buildStandardCarcass(g, mw, baseH, md, 0.06);
      addBox(g, mw + 0.02, 0.028, md + 0.02, 0, baseH + 0.014, md / 2, stoneMat, 'Work_Surface');
      addBox(g, mw + 0.02, topLedgeH, 0.024, 0, baseH + topLedgeH / 2, md + 0.012, frontMat, 'Front_Privacy_Fascia');
      addBox(g, mw + 0.04, 0.030, 0.28, 0, mh - 0.015, md - 0.04, stoneMat, 'Customer_Ledge');
      if (mod.hasLed !== false) {
        addBox(g, mw * 0.94, 0.012, 0.012, 0, baseH + 0.04, md + 0.028, ledMat, 'Reception_LED');
      }
    }
    // 7. TORRE QUENTE
    else if (mod.type === 'torre_quente') {
      const plinthH = 0.12;
      const bodyH = mh - plinthH;
      buildStandardCarcass(g, mw, bodyH, md, plinthH);
      const innerW = mw - panelT * 2;
      const lowerH = 0.64;
      const dCount = Math.max(2, mod.drawersCount || 2);
      const dh = lowerH / dCount;
      for (let i = 0; i < dCount; i++) {
        addBox(g, innerW - gap * 2, dh - gap * 2, 0.018, 0, plinthH + dh / 2 + i * dh, md + 0.009, frontMat, `Drawer_${i + 1}`);
      }
      addBox(g, innerW - 0.04, 0.54, 0.02, 0, plinthH + lowerH + 0.29, md - 0.01, darkGlassMat, 'BuiltIn_Oven');
      addBox(g, innerW - 0.06, 0.012, 0.025, 0, plinthH + lowerH + 0.51, md + 0.01, alumMat, 'Oven_Handle');
      addBox(g, innerW - 0.04, 0.34, 0.02, 0, plinthH + lowerH + 0.78, md - 0.01, darkGlassMat, 'Microwave');
      const upperStart = plinthH + lowerH + 0.98;
      const upperH = Math.max(0.32, mh - upperStart);
      if (mh > upperStart + 0.2) {
        addBox(g, innerW / 2 - gap, upperH - gap * 2, 0.018, -innerW / 4, upperStart + upperH / 2, md + 0.009, frontMat, 'Top_Door_L');
        addBox(g, innerW / 2 - gap, upperH - gap * 2, 0.018, innerW / 4, upperStart + upperH / 2, md + 0.009, frontMat, 'Top_Door_R');
      }
    }
    // 8. ESPELHEIRA DE BANHEIRO COM LED OU PENTEADEIRA CAMARIM
    else if (mod.type === 'espelheira_armario') {
      const bodyH = mh;
      buildStandardCarcass(g, mw, bodyH, md, 0);
      const innerW = mw - panelT * 2;
      const doors = Math.max(2, mod.doorsCount || 2);
      const dw = innerW / doors;
      for (let i = 0; i < doors; i++) {
        const dx = -innerW / 2 + dw / 2 + i * dw;
        addBox(g, dw - gap * 2, bodyH - gap * 2, 0.016, dx, bodyH / 2, md + 0.008, mirrorMat, `Mirror_Door_${i}`);
      }
      if (mod.hasLed !== false) {
        addBox(g, mw + 0.02, 0.01, 0.012, 0, 0.004, 0.01, ledMat, 'Mirror_LED_Glow');
      }
    }
    else if (mod.type === 'penteadeira_camarim') {
      // Tampo + gaveta rasa + espelho circular/arco com LED
      const deskH = 0.76;
      const boxH = 0.16;
      addBox(g, panelT, deskH - boxH, md * 0.85, -mw / 2 + panelT / 2, (deskH - boxH) / 2, md / 2, frontMat, 'Leg_L');
      addBox(g, panelT, deskH - boxH, md * 0.85, mw / 2 - panelT / 2, (deskH - boxH) / 2, md / 2, frontMat, 'Leg_R');
      addBox(g, mw, boxH, md, 0, deskH - boxH / 2, md / 2, carcassMat, 'Vanity_Top_Box');
      addBox(g, mw / 2 - gap * 2, boxH - 0.02, 0.018, -mw / 4, deskH - boxH / 2, md + 0.009, frontMat, 'Drawer_L');
      addBox(g, mw / 2 - gap * 2, boxH - 0.02, 0.018, mw / 4, deskH - boxH / 2, md + 0.009, frontMat, 'Drawer_R');
      // Espelho iluminado acima
      const mirrorR = Math.min(mw * 0.32, 0.42);
      addCylinder(g, mirrorR, mirrorR, 0.025, 0, deskH + mirrorR + 0.12, 0.02, mirrorMat, 'Camarim_Mirror', 0, Math.PI / 2);
      addCylinder(g, mirrorR + 0.018, mirrorR + 0.018, 0.014, 0, deskH + mirrorR + 0.12, 0.01, ledMat, 'Camarim_LED_Halo', 0, Math.PI / 2);
    }
    // 9. BAR / ADEGA
    else if (mod.type === 'bar_adega') {
      const plinthH = 0.08;
      const bodyH = mh - plinthH;
      buildStandardCarcass(g, mw, bodyH, md, plinthH);
      const innerW = mw - panelT * 2;
      const lowerH = 0.78;
      // Balcão inferior + porta adega vidro
      addBox(g, innerW / 2 - gap, lowerH - 0.02, 0.016, -innerW / 4, plinthH + lowerH / 2, md + 0.008, darkGlassMat, 'Wine_Cooler_Glass');
      addBox(g, innerW / 2 - gap, lowerH - 0.02, 0.018, innerW / 4, plinthH + lowerH / 2, md + 0.008, frontMat, 'Bar_Door');
      // Nichos superiores de garrafas
      const gridStart = plinthH + lowerH + 0.35;
      if (mh > gridStart + 0.3) {
        const cols = 4;
        for (let c = 1; c < cols; c++) {
          addBox(g, panelT, mh - gridStart - 0.04, md - 0.04, -innerW / 2 + (innerW / cols) * c, (mh + gridStart) / 2, md / 2, frontMat, `Wine_V_${c}`);
        }
        for (let r = 0; r < 3; r++) {
          addBox(g, innerW, panelT, md - 0.04, 0, gridStart + r * 0.24, md / 2, frontMat, `Wine_H_${r}`);
        }
      }
      addBox(g, innerW, 0.01, 0.015, 0, plinthH + lowerH + 0.04, md * 0.65, ledMat, 'Bar_LED');
    }
    // 10. ESTAÇÃO DE TRABALHO HOME OFFICE / BANCADA ESTUDO
    else if (mod.type === 'bancada_estudo' || mod.type === 'estacao_trabalho_L') {
      addBox(g, mw, 0.032, md, 0, mh - 0.016, md / 2, frontMat, 'Desk_Top');
      addBox(g, panelT, mh - 0.032, md - 0.04, -mw / 2 + panelT / 2, (mh - 0.032) / 2, md / 2, frontMat, 'Desk_Side_L');
      // Gaveteiro fixo direito
      const pedW = Math.min(0.45, mw * 0.34);
      addBox(g, pedW, mh - 0.032, md - 0.04, mw / 2 - pedW / 2, (mh - 0.032) / 2, md / 2, carcassMat, 'Pedestal_Box');
      for (let d = 0; d < 3; d++) {
        const dh = (mh - 0.10) / 3;
        addBox(g, pedW - 0.02, dh - gap * 2, 0.018, mw / 2 - pedW / 2, 0.06 + dh / 2 + d * dh, md - 0.01, frontMat, `Ped_Drawer_${d}`);
      }
    }
    // 11. ILHA GOURMET
    else if (mod.type === 'ilha_gourmet') {
      const plinthH = 0.12;
      const topH = 0.035;
      const bodyH = mh - plinthH - topH;
      const boxD = md * 0.66;
      buildStandardCarcass(g, mw, bodyH, boxD, plinthH);
      const innerW = mw - panelT * 2;
      const doors = Math.max(2, mod.doorsCount || 3);
      const dw = innerW / doors;
      for (let i = 0; i < doors; i++) {
        addBox(g, dw - gap * 2, bodyH - gap * 2, 0.018, -innerW / 2 + dw / 2 + i * dw, plinthH + bodyH / 2, boxD + 0.009, frontMat, `Island_Door_${i}`);
      }
      // Tampo pedra em cascata lateral com balanço para banquetas no lado inverso
      addBox(g, mw + 0.06, topH, md, 0, plinthH + bodyH + topH / 2, md / 2, stoneMat, 'Island_Countertop');
      addBox(g, topH, mh, md, -mw / 2 - 0.015, mh / 2, md / 2, stoneMat, 'Waterfall_L');
      addBox(g, topH, mh, md, mw / 2 + 0.015, mh / 2, md / 2, stoneMat, 'Waterfall_R');
    }
    // 12. BALCÕES, COOKTOP, BANHEIRO, LAVANDERIA, CHURRASQUEIRA, RACK, AÉREOS E ESTANTES
    else {
      const hasPlinth = ['balcao_pia', 'balcao_gavetas', 'balcao_cooktop', 'balcao_churrasqueira', 'bancada_tanque_maquina', 'criado_mudo', 'aparador_buffet'].includes(mod.type);
      const plinthH = mod.type === 'criado_mudo' ? 0.04 : (hasPlinth ? 0.12 : 0);
      const hasStoneTop = ['balcao_pia', 'balcao_cooktop', 'gabinete_banheiro', 'bancada_tanque_maquina', 'balcao_churrasqueira'].includes(mod.type);
      const topSlabH = hasStoneTop ? 0.032 : 0;
      const bodyH = Math.max(0.22, mh - plinthH - topSlabH);

      buildStandardCarcass(g, mw, bodyH, md, plinthH);
      const innerW = mw - panelT * 2;

      if (mod.type === 'estante_nichos' || mod.type === 'sapateira_prateleiras') {
        const rows = mod.type === 'sapateira_prateleiras' ? 5 : 3;
        for (let r = 1; r < rows; r++) {
          addBox(g, innerW, panelT, md - 0.02, 0, plinthH + (bodyH / rows) * r, md / 2, frontMat, `Shelf_${r}`);
        }
      } else if (mod.type === 'bancada_tanque_maquina') {
        // Metade esquerda espaço máquina de lavar + metade direita balcão tanque
        addBox(g, mw * 0.45, bodyH - 0.02, md - 0.04, -mw * 0.24, plinthH + (bodyH - 0.02) / 2, md / 2, ceramicMat, 'Washer_Body');
        addCylinder(g, 0.18, 0.18, 0.025, -mw * 0.24, plinthH + bodyH * 0.48, md - 0.01, darkGlassMat, 'Washer_Door', 0, Math.PI / 2);
        addBox(g, mw * 0.46, bodyH - gap * 2, 0.018, mw * 0.24, plinthH + bodyH / 2, md + 0.009, frontMat, 'Laundry_Cabinet_Doors');
        addBox(g, mw + 0.02, topSlabH, md + 0.02, 0, plinthH + bodyH + topSlabH / 2, md / 2, stoneMat, 'Laundry_Stone');
        addBox(g, 0.42, 0.014, 0.36, mw * 0.24, plinthH + bodyH + topSlabH + 0.004, md * 0.52, steelMat, 'Laundry_Tub');
      } else if (mod.type === 'aereo_basculante') {
        const rows = Math.max(1, Math.min(2, mod.doorsCount || 1));
        const fh = bodyH / rows;
        for (let i = 0; i < rows; i++) {
          addStyledDoor(g, innerW - gap * 2, fh - gap * 2, 0, plinthH + fh / 2 + i * fh, md + 0.009, `Flip_Door_${i + 1}`, true, true);
        }
      } else if (mod.drawersCount > 0 && mod.doorsCount === 0) {
        const dCount = mod.drawersCount;
        const dh = bodyH / dCount;
        for (let i = 0; i < dCount; i++) {
          addStyledDrawer(g, innerW - gap * 2, dh - gap * 2, 0, plinthH + dh / 2 + i * dh, md + 0.009, `Drawer_Front_${i + 1}`);
        }
      } else {
        const doors = Math.max(1, mod.doorsCount || Math.round(mw / 0.45));
        const dw = innerW / doors;
        const allowGlassDoor = mod.type === 'aereo_portas';
        for (let i = 0; i < doors; i++) {
          const dx = -innerW / 2 + dw / 2 + i * dw;
          addStyledDoor(g, dw - gap * 2, bodyH - gap * 2, dx, plinthH + bodyH / 2, md + 0.009, `Door_${i + 1}`, allowGlassDoor, i % 2 === 0);
        }
      }

      if (hasStoneTop && mod.type !== 'bancada_tanque_maquina') {
        addBox(g, mw + 0.02, topSlabH, md + 0.03, 0, plinthH + bodyH + topSlabH / 2, (md + 0.03) / 2, stoneMat, 'Stone_Countertop');
        if (mod.type === 'balcao_pia') {
          const sinkW = Math.min(mw * 0.45, 0.55);
          addBox(g, sinkW, 0.014, 0.36, 0, plinthH + bodyH + topSlabH + 0.004, md * 0.52, steelMat, 'Sink_Basin');
          addBox(g, 0.022, 0.24, 0.022, 0, plinthH + bodyH + topSlabH + 0.12, md * 0.16, steelMat, 'Faucet_Neck');
        } else if (mod.type === 'gabinete_banheiro') {
          addCylinder(g, 0.19, 0.17, 0.11, 0, plinthH + bodyH + topSlabH + 0.055, md * 0.54, ceramicMat, 'Vessel_Sink');
          addBox(g, 0.02, 0.20, 0.02, 0, plinthH + bodyH + topSlabH + 0.10, md * 0.18, steelMat, 'Bath_Faucet');
        } else if (mod.type === 'balcao_cooktop') {
          const ctW = Math.min(mw * 0.72, 0.68);
          addBox(g, ctW, 0.012, 0.45, 0, plinthH + bodyH + topSlabH + 0.006, md * 0.52, darkGlassMat, 'Cooktop_Glass');
          addCylinder(g, 0.065, 0.065, 0.008, -ctW * 0.24, plinthH + bodyH + topSlabH + 0.015, md * 0.42, steelMat, 'Burner_1');
          addCylinder(g, 0.065, 0.065, 0.008, ctW * 0.24, plinthH + bodyH + topSlabH + 0.015, md * 0.62, steelMat, 'Burner_2');
        } else if (mod.type === 'balcao_churrasqueira') {
          addBox(g, mw * 0.42, 0.02, 0.42, -mw * 0.2, plinthH + bodyH + topSlabH + 0.01, md * 0.5, steelMat, 'Grill_Insert');
        }
      }

      if (mod.hasLed && (mod.type === 'aereo_portas' || mod.type === 'aereo_basculante' || mod.type === 'rack_suspenso' || mod.type === 'gabinete_banheiro')) {
        addBox(g, mw * 0.9, 0.008, 0.012, 0, 0.004, md * 0.72, ledMat, 'Under_Cabinet_LED');
      }
    }

    // Posicionamento multi-parede (back, left, right, center)
    if (mod.wall === 'left') {
      g.rotation.y = Math.PI / 2;
      g.position.set(-W / 2 + 0.01, yBase, (mod.xCm / 100) + mw / 2);
    } else if (mod.wall === 'right') {
      g.rotation.y = -Math.PI / 2;
      g.position.set(W / 2 - 0.01, yBase, (mod.xCm / 100) + mw / 2);
    } else if (mod.wall === 'center') {
      g.rotation.y = 0;
      g.position.set(-W / 2 + (mod.xCm / 100) + mw / 2, yBase, (mod.zCm ?? 150) / 100);
    } else {
      g.rotation.y = 0;
      g.position.set(-W / 2 + (mod.xCm / 100) + mw / 2, yBase, 0.01);
    }

    root.add(g);
  }

  return root;
}

export function exportObjectToOBJDownload(object: THREE.Object3D, filename: string = 'proposta-sketchup.obj'): void {
  const exporter = new OBJExporter();
  const objText = exporter.parse(object);
  const blob = new Blob([objText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function exportCutlistToCSVDownload(
  analysis: RoomAnalysisResult,
  quote: CabinetryQuoteResult
): void {
  const thick = quote.styleOptions?.thicknessMode === '25mm_engrossado'
    ? '15mm + 25mm'
    : quote.styleOptions?.thicknessMode === '18mm'
    ? '18mm'
    : '15mm';
  const rows: string[][] = [
    ['Ambiente', 'Modulo', 'Parede', 'Peca / Funcao', 'Qtd', 'Largura_cm', 'Altura_ou_Prof_cm', 'Espessura', 'Padrao_MDF', 'Cod_SKU'],
  ];

  const wallPt: Record<string, string> = { back: 'Fundo', left: 'Esquerda', right: 'Direita', center: 'Centro' };
  for (const m of analysis.modules) {
    const w = m.widthCm;
    const h = m.heightCm;
    const d = m.depthCm;
    const wn = wallPt[m.wall] || 'Fundo';
    // Laterais + Base/Topo (Caixaria)
    rows.push([analysis.roomType, m.label, wn, 'Lateral Esquerda/Direita', '2', `${d}`, `${h}`, thick, quote.carcassFinish.label, quote.carcassFinish.cod15]);
    rows.push([analysis.roomType, m.label, wn, 'Base / Topo / Prateleiras', `${2 + (m.shelvesCount || 1)}`, `${Math.max(20, w - 3)}`, `${d}`, thick, quote.carcassFinish.label, quote.carcassFinish.cod15]);
    rows.push([analysis.roomType, m.label, wn, 'Fundo 6mm', '1', `${w}`, `${h}`, '6mm', quote.carcassFinish.name6, quote.carcassFinish.cod6]);
    if (m.doorsCount > 0) {
      const dw = (w / m.doorsCount).toFixed(1);
      const frontSpec = quote.styleOptions?.frontStyle === 'vidro_reflecta' ? `${quote.frontFinish.label} / Vidro` : quote.frontFinish.label;
      rows.push([analysis.roomType, m.label, wn, `Porta (${quote.styleOptions?.frontStyle || 'lisa'})`, `${m.doorsCount}`, `${dw}`, `${h}`, thick, frontSpec, quote.frontFinish.cod15]);
    }
    if (m.drawersCount > 0) {
      const dh = Math.max(14, Math.round(h / Math.max(2, m.drawersCount)));
      rows.push([analysis.roomType, m.label, wn, 'Frente Gaveta', `${m.drawersCount}`, `${Math.max(20, w - 4)}`, `${dh}`, thick, quote.frontFinish.label, quote.frontFinish.cod15]);
    }
  }

  const csv = '\uFEFF' + rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(';')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `83-ambientes-plano-corte-${analysis.roomType}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function buildRoomProposalSummaryMessage(
  analysis: RoomAnalysisResult,
  quote: CabinetryQuoteResult
): string {
  const roomNames: Record<string, string> = {
    cozinha: 'Cozinha Planejada',
    quarto: 'Quarto / Closet Planejado',
    sala: 'Sala / Painel & Estar',
    banheiro: 'Banheiro / Lavabo Planejado',
    lavanderia: 'Lavanderia / Área de Serviço',
    escritorio: 'Escritório / Home Office',
    varanda_gourmet: 'Área Gourmet / Churrasqueira',
  };
  const wallPt: Record<string, string> = {
    back: 'Fundo',
    left: 'Esq.',
    right: 'Dir.',
    center: 'Centro',
  };
  const frontLabels: Record<string, string> = {
    lisa: 'Porta Lisa Contemporânea',
    cava45: 'Usinada Cava 45°',
    provencal: 'Estilo Provençal Moldurado',
    vidro_reflecta: 'Perfil Alumínio + Vidro Reflecta',
  };
  const handleLabels: Record<string, string> = {
    perfil_18: 'Puxador Perfil 18mm',
    perfil_15: 'Puxador Perfil Slim 15mm',
    fecho_toque: 'Fecho Toque (Sem Puxador)',
  };
  const thickLabels: Record<string, string> = {
    '15mm': 'Estrutura 15mm',
    '18mm': 'Reforçado 18mm',
    '25mm_engrossado': 'Tamponamento Engrossado 25/30mm',
  };

  const modLines = analysis.modules
    .map((m) => `• ${m.label} [${wallPt[m.wall] || 'Fundo'}] (${m.widthCm}×${m.heightCm}×${m.depthCm} cm)`)
    .join('\n');

  const obsLines = analysis.obstacles.length
    ? analysis.obstacles.map((o) => `${o.label} (${o.xStartCm}–${o.xEndCm} cm)`).join(', ')
    : 'Parede principal livre';

  const sameFinish = quote.carcassFinish.cod15 === quote.frontFinish.cod15;
  const finishDesc = sameFinish
    ? `${quote.frontFinish.label} (Cód. 15mm: ${quote.frontFinish.cod15}${quote.frontFinish.fitaCod ? ` | Fita: ${quote.frontFinish.fitaCod}` : ''})`
    : `Frentes: ${quote.frontFinish.label} (${quote.frontFinish.cod15}) | Caixaria: ${quote.carcassFinish.label} (${quote.carcassFinish.cod15})`;

  const styleTxt = `${frontLabels[quote.styleOptions?.frontStyle || 'lisa']} • ${handleLabels[quote.styleOptions?.handleStyle || 'perfil_18']} • ${thickLabels[quote.styleOptions?.thicknessMode || '15mm']}`;

  return (
    `Olá! Acabei de gerar uma proposta 3D na 83 Ambientes Planejados:\n\n` +
    `*Ambiente:* ${roomNames[analysis.roomType] || analysis.roomType}\n` +
    `*Parede calibrada:* ${analysis.roomDimensionsCm.widthCm} cm (L) × ${analysis.roomDimensionsCm.heightCm} cm (A)\n` +
    `*Obstáculos:* ${obsLines}\n\n` +
    `*Módulos do projeto:*\n${modLines}\n\n` +
    `*Acabamento:* ${finishDesc}\n` +
    `*Detalhamento:* ${styleTxt}\n` +
    `*Ferragens:* ${quote.hardware.label}\n` +
    `*Consumo estimado:* ~${quote.sheets15Count} chapa(s) 15mm + ~${quote.sheets6Count} chapa(s) 6mm\n` +
    `*Estimativa preliminar:* ${quote.formattedRange} (sujeito a medição final no local)\n\n` +
    `Gostaria de agendar a conferência das medidas para fechar no SketchUp!`
  );
}
