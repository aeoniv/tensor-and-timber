import * as THREE from 'three';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter.js';
import {
  CabinetryQuoteResult,
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
  hardwareId: 'padrao' | 'slow',
  carcassFinish?: MdfFinishOption,
  counterTone: CounterTone = 'claro'
): THREE.Group {
  const root = new THREE.Group();
  root.name = 'TensorTimber_Cabinetry_Proposal';

  const W = roomWidthCm / 100;
  const frontMat = createMdfMaterial(frontFinish);
  const carcassMat = carcassFinish && carcassFinish.cod15 !== frontFinish.cod15
    ? createMdfMaterial(carcassFinish)
    : frontMat;

  const interiorMat = new THREE.MeshStandardMaterial({ color: 0xf4f3ef, roughness: 0.65 });
  const plinthMat = new THREE.MeshStandardMaterial({ color: 0xd6d3cd, roughness: 0.7 });
  const alumMat = new THREE.MeshStandardMaterial({
    color: hardwareId === 'slow' ? 0x262626 : 0xb8bec6,
    roughness: 0.28,
    metalness: 0.82,
  });
  const stoneColor = counterTone === 'escuro' ? 0x26282b : counterTone === 'madeira' ? 0x9f6c3f : 0xe4e0d8;
  const stoneMat = new THREE.MeshStandardMaterial({
    color: stoneColor,
    roughness: counterTone === 'madeira' ? 0.5 : 0.22,
    metalness: 0.06,
  });
  const ceramicMat = new THREE.MeshStandardMaterial({ color: 0xfefefe, roughness: 0.15, metalness: 0.05 });
  const darkGlassMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.16, metalness: 0.45 });
  const tintedGlassMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.12, metalness: 0.2, transparent: true, opacity: 0.34 });
  const mirrorMat = new THREE.MeshStandardMaterial({ color: 0xdbeafe, roughness: 0.06, metalness: 0.88 });
  const steelMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.22, metalness: 0.9 });
  const fabricMat = new THREE.MeshStandardMaterial({ color: 0xebe6de, roughness: 0.88 });
  const ledMat = new THREE.MeshStandardMaterial({ color: 0xfff3d1, emissive: 0xffd27d, emissiveIntensity: 1.4 });

  const panelT = 0.015;
  const gap = 0.003;

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
          addBox(g, doorW + 0.012, bodyH - 0.04, 0.018, dx, plinthH + bodyH / 2, zOffset, frontMat, `Sliding_Door_${dIdx + 1}`);
          addBox(g, 0.014, bodyH - 0.04, 0.022, dx - doorW / 2 + 0.008, plinthH + bodyH / 2, zOffset + 0.003, alumMat, `Profile_Handle_${dIdx + 1}`);
        }
      } else {
        for (let dIdx = 0; dIdx < doors; dIdx++) {
          const dx = -innerW / 2 + doorW / 2 + dIdx * doorW;
          addBox(g, doorW - gap * 2, bodyH - gap * 2, 0.018, dx, plinthH + bodyH / 2, md + 0.009, frontMat, `Door_${dIdx + 1}`);
          const handleX = dx + (dIdx % 2 === 0 ? doorW / 2 - 0.035 : -doorW / 2 + 0.035);
          addBox(g, 0.012, Math.min(0.55, bodyH * 0.4), 0.015, handleX, plinthH + bodyH * 0.46, md + 0.024, alumMat, `Handle_${dIdx + 1}`);
        }
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
          addBox(g, innerW - gap * 2, fh - gap * 2, 0.018, 0, plinthH + fh / 2 + i * fh, md + 0.009, frontMat, `Flip_Door_${i + 1}`);
          addBox(g, innerW * 0.4, 0.01, 0.014, 0, plinthH + fh * i + 0.025, md + 0.022, alumMat, `Flip_Handle_${i + 1}`);
        }
      } else if (mod.drawersCount > 0 && mod.doorsCount === 0) {
        const dCount = mod.drawersCount;
        const dh = bodyH / dCount;
        for (let i = 0; i < dCount; i++) {
          addBox(g, innerW - gap * 2, dh - gap * 2, 0.018, 0, plinthH + dh / 2 + i * dh, md + 0.009, frontMat, `Drawer_Front_${i + 1}`);
          addBox(g, innerW * 0.55, 0.01, 0.014, 0, plinthH + dh * (i + 1) - 0.022, md + 0.022, alumMat, `Drawer_Pull_${i + 1}`);
        }
      } else {
        const doors = Math.max(1, mod.doorsCount || Math.round(mw / 0.45));
        const dw = innerW / doors;
        for (let i = 0; i < doors; i++) {
          const dx = -innerW / 2 + dw / 2 + i * dw;
          addBox(g, dw - gap * 2, bodyH - gap * 2, 0.018, dx, plinthH + bodyH / 2, md + 0.009, frontMat, `Door_${i + 1}`);
          const hx = dx + (i % 2 === 0 ? dw / 2 - 0.03 : -dw / 2 + 0.03);
          addBox(g, 0.01, Math.min(0.22, bodyH * 0.4), 0.014, hx, plinthH + bodyH * 0.6, md + 0.022, alumMat, `Handle_${i + 1}`);
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

  return (
    `Olá! Acabei de gerar uma proposta 3D por foto na 83 Ambientes Planejados:\n\n` +
    `*Ambiente:* ${roomNames[analysis.roomType] || analysis.roomType}\n` +
    `*Parede principal calibrada:* ${analysis.roomDimensionsCm.widthCm} cm (L) × ${analysis.roomDimensionsCm.heightCm} cm (A)\n` +
    `*Obstáculos detectados:* ${obsLines}\n\n` +
    `*Módulos propostos:*\n${modLines}\n\n` +
    `*Acabamento:* ${finishDesc}\n` +
    `*Ferragens:* ${quote.hardware.label}\n` +
    `*Consumo estimado:* ~${quote.sheets15Count} chapa(s) 15mm + ~${quote.sheets6Count} chapa(s) 6mm\n` +
    `*Estimativa preliminar:* ${quote.formattedRange} (sujeito a medição final no local)\n\n` +
    `Gostaria de agendar a conferência das medidas para fechar no SketchUp!`
  );
}
