import * as THREE from 'three';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter.js';
import { MdfFinishOption, ProposedCabinetModule } from '../data/pricingCatalog';
import { DetectedObstacle, RoomAnalysisResult } from './roomAnalyzerService';

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
      // Subtle vertical wood grain
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
      roughness: 0.58,
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

export function buildRoomShellGroup(
  dims: { widthCm: number; heightCm: number; depthCm: number },
  obstacles: DetectedObstacle[]
): THREE.Group {
  const shell = new THREE.Group();
  shell.name = 'Room_Architecture_Shell';

  const W = dims.widthCm / 100;
  const H = dims.heightCm / 100;
  const D = dims.depthCm / 100;

  const wallMat = new THREE.MeshStandardMaterial({ color: 0xf4f2ed, roughness: 0.88, metalness: 0.02 });
  const sideWallMat = new THREE.MeshStandardMaterial({ color: 0xece9e2, roughness: 0.9, metalness: 0.02, transparent: true, opacity: 0.6 });
  const floorMat = new THREE.MeshStandardMaterial({ color: 0xe6e1d6, roughness: 0.72, metalness: 0.03 });
  const baseboardMat = new THREE.MeshStandardMaterial({ color: 0xd6d1c6, roughness: 0.7 });

  // Piso e rodapé
  addBox(shell, W + 0.3, 0.03, D, 0, -0.015, D / 2, floorMat, 'Floor_Slab');
  const grid = new THREE.GridHelper(Math.max(W, D) + 0.5, 16, 0xcbd5e1, 0xe2e8f0);
  grid.position.set(0, 0.002, D / 2);
  shell.add(grid);

  // Parede principal (z = 0 -> face frontal em z = 0)
  addBox(shell, W + 0.24, H, 0.12, 0, H / 2, -0.06, wallMat, 'Back_Wall');
  addBox(shell, W + 0.24, 0.08, 0.018, 0, 0.04, 0.009, baseboardMat, 'Back_Wall_Baseboard');

  // Paredes laterais parciais para profundidade visual sem bloquear câmera
  const wingDepth = Math.min(D * 0.48, 1.4);
  addBox(shell, 0.08, H, wingDepth, -W / 2 - 0.04, H / 2, wingDepth / 2, sideWallMat, 'Left_Wall');
  addBox(shell, 0.08, H, wingDepth, W / 2 + 0.04, H / 2, wingDepth / 2, sideWallMat, 'Right_Wall');

  // Renderizar obstáculos arquitetônicos calibrados na parede principal
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
      // Marcação visual em parede lateral
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
  finish: MdfFinishOption,
  hardwareId: 'padrao' | 'slow'
): THREE.Group {
  const root = new THREE.Group();
  root.name = 'TensorTimber_Cabinetry_Proposal';

  const W = roomWidthCm / 100;
  const mdfMat = createMdfMaterial(finish);
  const interiorMat = new THREE.MeshStandardMaterial({ color: 0xf3f2ee, roughness: 0.65 });
  const plinthMat = new THREE.MeshStandardMaterial({ color: 0xd6d3cd, roughness: 0.7 });
  const alumMat = new THREE.MeshStandardMaterial({
    color: hardwareId === 'slow' ? 0x262626 : 0xb8bec6,
    roughness: 0.28,
    metalness: 0.82,
  });
  const stoneMat = new THREE.MeshStandardMaterial({
    color: finish.hex.toLowerCase().includes('454') ? 0xf3f4f6 : 0xd8d5ce,
    roughness: 0.25,
    metalness: 0.05,
  });
  const darkGlassMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.18, metalness: 0.4 });
  const steelMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.22, metalness: 0.9 });
  const ledMat = new THREE.MeshStandardMaterial({
    color: 0xfff3d1,
    emissive: 0xffd27d,
    emissiveIntensity: 1.4,
  });

  const panelT = 0.015; // Chapa 15mm real da planilha
  const gap = 0.003;

  for (const mod of modules) {
    const g = new THREE.Group();
    g.name = `Module_${mod.id}_${mod.type}`;

    const mw = mod.widthCm / 100;
    const mh = mod.heightCm / 100;
    const md = mod.depthCm / 100;
    const xCenter = -W / 2 + (mod.xCm / 100) + mw / 2;
    const yBase = mod.yCm / 100;

    // 1. PAINEL RIPADO / CABECEIRA
    if (mod.type === 'painel_tv_ripado' || mod.type === 'painel_cabeceira') {
      const backDepth = 0.025;
      addBox(g, mw, mh, backDepth, 0, mh / 2, backDepth / 2, mdfMat, 'Panel_Base');
      // Ripas verticais
      const slatW = 0.032;
      const step = 0.048;
      const count = Math.max(4, Math.floor(mw / step));
      for (let i = 0; i < count; i++) {
        const sx = -mw / 2 + step / 2 + i * step;
        if (sx + slatW / 2 <= mw / 2) {
          addBox(g, slatW, mh, 0.018, sx, mh / 2, backDepth + 0.009, mdfMat, `Slat_${i}`);
        }
      }
      if (mod.type === 'painel_tv_ripado') {
        // Quadro TV central limpo
        const tvW = Math.min(mw * 0.62, 1.45);
        const tvH = tvW * 0.5625;
        addBox(g, tvW, tvH, 0.022, 0, Math.max(mh * 0.55, 1.25 - yBase), backDepth + 0.028, darkGlassMat, 'TV_Screen_Reference');
      }
      if (mod.hasLed) {
        addBox(g, mw * 0.94, 0.012, 0.012, 0, mh - 0.03, backDepth + 0.022, ledMat, 'LED_Profile');
      }
    }
    // 2. NICHO GELADEIRA
    else if (mod.type === 'nicho_geladeira') {
      // Laterais do envoltório + armário aéreo superior
      const fridgeH = Math.min(mh - 0.35, 1.88);
      addBox(g, panelT, mh, md, -mw / 2 + panelT / 2, mh / 2, md / 2, mdfMat, 'Left_Enclosure');
      addBox(g, panelT, mh, md, mw / 2 - panelT / 2, mh / 2, md / 2, mdfMat, 'Right_Enclosure');
      const upperH = mh - fridgeH;
      if (upperH >= 0.28) {
        addBox(g, mw - panelT * 2, upperH, md, 0, fridgeH + upperH / 2, md / 2, mdfMat, 'Over_Fridge_Carcass');
        addBox(g, (mw - panelT * 2) / 2 - gap, upperH - gap * 2, 0.018, -(mw - panelT * 2) / 4, fridgeH + upperH / 2, md + 0.009, mdfMat, 'Door_L');
        addBox(g, (mw - panelT * 2) / 2 - gap, upperH - gap * 2, 0.018, (mw - panelT * 2) / 4, fridgeH + upperH / 2, md + 0.009, mdfMat, 'Door_R');
      }
    }
    // 3. GUARDA-ROUPA DE CORRER OU ABRIR
    else if (mod.type === 'guarda_roupa_correr' || mod.type === 'guarda_roupa_abrir') {
      const plinthH = 0.08;
      const bodyH = mh - plinthH;
      addBox(g, mw - 0.02, plinthH, md - 0.04, 0, plinthH / 2, (md - 0.04) / 2, plinthMat, 'Wardrobe_Plinth');
      // Caixaria
      addBox(g, panelT, bodyH, md, -mw / 2 + panelT / 2, plinthH + bodyH / 2, md / 2, mdfMat, 'Side_Left');
      addBox(g, panelT, bodyH, md, mw / 2 - panelT / 2, plinthH + bodyH / 2, md / 2, mdfMat, 'Side_Right');
      addBox(g, mw - panelT * 2, panelT, md, 0, plinthH + panelT / 2, md / 2, interiorMat, 'Bottom_Deck');
      addBox(g, mw - panelT * 2, panelT, md, 0, plinthH + bodyH - panelT / 2, md / 2, interiorMat, 'Top_Deck');
      addBox(g, mw - panelT * 2, bodyH - panelT * 2, 0.006, 0, plinthH + bodyH / 2, 0.015, interiorMat, 'Back_6mm');

      const doors = Math.max(2, mod.doorsCount || (mw > 1.8 ? 3 : 2));
      const innerW = mw - panelT * 2;
      const doorW = innerW / doors;

      if (mod.type === 'guarda_roupa_correr') {
        // Trilhos Rometal superior e inferior
        addBox(g, innerW, 0.028, 0.045, 0, plinthH + bodyH - 0.014, md - 0.022, alumMat, 'Rometal_Top_Track');
        addBox(g, innerW, 0.016, 0.045, 0, plinthH + 0.008, md - 0.022, alumMat, 'Rometal_Bottom_Track');
        for (let dIdx = 0; dIdx < doors; dIdx++) {
          const dx = -innerW / 2 + doorW / 2 + dIdx * doorW;
          const zOffset = dIdx % 2 === 0 ? md - 0.012 : md + 0.010;
          addBox(g, doorW + 0.012, bodyH - 0.04, 0.018, dx, plinthH + bodyH / 2, zOffset, mdfMat, `Sliding_Door_${dIdx + 1}`);
          addBox(g, 0.014, bodyH - 0.04, 0.022, dx - doorW / 2 + 0.008, plinthH + bodyH / 2, zOffset + 0.003, alumMat, `Profile_Handle_${dIdx + 1}`);
        }
      } else {
        for (let dIdx = 0; dIdx < doors; dIdx++) {
          const dx = -innerW / 2 + doorW / 2 + dIdx * doorW;
          addBox(g, doorW - gap * 2, bodyH - gap * 2, 0.018, dx, plinthH + bodyH / 2, md + 0.009, mdfMat, `Door_${dIdx + 1}`);
          const handleX = dx + (dIdx % 2 === 0 ? doorW / 2 - 0.035 : -doorW / 2 + 0.035);
          addBox(g, 0.012, 0.55, 0.015, handleX, plinthH + bodyH * 0.46, md + 0.024, alumMat, `Handle_${dIdx + 1}`);
        }
      }
    }
    // 4. TORRE QUENTE
    else if (mod.type === 'torre_quente') {
      const plinthH = 0.12;
      const bodyH = mh - plinthH;
      addBox(g, mw - 0.02, plinthH, md - 0.04, 0, plinthH / 2, (md - 0.04) / 2, plinthMat, 'Tower_Plinth');
      addBox(g, panelT, bodyH, md, -mw / 2 + panelT / 2, plinthH + bodyH / 2, md / 2, mdfMat, 'Side_Left');
      addBox(g, panelT, bodyH, md, mw / 2 - panelT / 2, plinthH + bodyH / 2, md / 2, mdfMat, 'Side_Right');
      addBox(g, mw - panelT * 2, bodyH, 0.006, 0, plinthH + bodyH / 2, 0.015, interiorMat, 'Back_6mm');

      const innerW = mw - panelT * 2;
      // Gavetas inferiores (0..65cm)
      const lowerH = 0.64;
      const dCount = Math.max(2, mod.drawersCount || 2);
      const dh = lowerH / dCount;
      for (let i = 0; i < dCount; i++) {
        addBox(g, innerW - gap * 2, dh - gap * 2, 0.018, 0, plinthH + dh / 2 + i * dh, md + 0.009, mdfMat, `Drawer_${i + 1}`);
      }
      // Nicho Forno + Micro-ondas (64..150cm)
      addBox(g, innerW - 0.04, 0.54, 0.02, 0, plinthH + lowerH + 0.29, md - 0.01, darkGlassMat, 'BuiltIn_Oven_Glass');
      addBox(g, innerW - 0.06, 0.012, 0.025, 0, plinthH + lowerH + 0.51, md + 0.01, alumMat, 'Oven_Handle');
      addBox(g, innerW - 0.04, 0.34, 0.02, 0, plinthH + lowerH + 0.78, md - 0.01, darkGlassMat, 'Microwave_Glass');
      // Armário superior acima dos fornos
      const upperStart = plinthH + lowerH + 0.98;
      const upperH = Math.max(0.32, mh - upperStart);
      if (mh > upperStart + 0.2) {
        addBox(g, innerW / 2 - gap, upperH - gap * 2, 0.018, -innerW / 4, upperStart + upperH / 2, md + 0.009, mdfMat, 'Top_Door_L');
        addBox(g, innerW / 2 - gap, upperH - gap * 2, 0.018, innerW / 4, upperStart + upperH / 2, md + 0.009, mdfMat, 'Top_Door_R');
      }
    }
    // 5. BALCÕES, AÉREOS, RACKS, CRIADOS, BANCADAS E ESTANTES
    else {
      const hasPlinth = mod.type === 'balcao_pia' || mod.type === 'balcao_gavetas' || mod.type === 'criado_mudo';
      const plinthH = mod.type === 'criado_mudo' ? 0.04 : (hasPlinth ? 0.12 : 0);
      const topSlabH = mod.type === 'balcao_pia' ? 0.032 : 0;
      const bodyH = Math.max(0.22, mh - plinthH - topSlabH);

      if (plinthH > 0) {
        addBox(g, mw - 0.02, plinthH, md - 0.05, 0, plinthH / 2, (md - 0.05) / 2, plinthMat, 'Base_Plinth');
      }

      // Caixaria padrão 15mm + fundo 6mm
      addBox(g, panelT, bodyH, md, -mw / 2 + panelT / 2, plinthH + bodyH / 2, md / 2, mdfMat, 'Side_Left');
      addBox(g, panelT, bodyH, md, mw / 2 - panelT / 2, plinthH + bodyH / 2, md / 2, mdfMat, 'Side_Right');
      addBox(g, mw - panelT * 2, panelT, md, 0, plinthH + panelT / 2, md / 2, mdfMat, 'Bottom_Panel');
      addBox(g, mw - panelT * 2, panelT, md, 0, plinthH + bodyH - panelT / 2, md / 2, mdfMat, 'Top_Panel');
      addBox(g, mw - panelT * 2, bodyH - panelT * 2, 0.006, 0, plinthH + bodyH / 2, 0.012, interiorMat, 'Back_6mm');

      const innerW = mw - panelT * 2;

      if (mod.type === 'estante_nichos') {
        const rows = 3;
        for (let r = 1; r < rows; r++) {
          addBox(g, innerW, panelT, md - 0.02, 0, plinthH + (bodyH / rows) * r, md / 2, mdfMat, `Shelf_${r}`);
        }
      } else if (mod.type === 'bancada_estudo') {
        // Tampos + gaveta rasa sob tampo
        addBox(g, mw, 0.03, md, 0, mh - 0.015, md / 2, mdfMat, 'Desk_Top');
      } else if (mod.type === 'aereo_basculante') {
        const rows = Math.max(1, Math.min(2, mod.doorsCount || 1));
        const fh = bodyH / rows;
        for (let i = 0; i < rows; i++) {
          addBox(g, innerW - gap * 2, fh - gap * 2, 0.018, 0, plinthH + fh / 2 + i * fh, md + 0.009, mdfMat, `Flip_Door_${i + 1}`);
          addBox(g, innerW * 0.4, 0.01, 0.014, 0, plinthH + fh * i + 0.025, md + 0.022, alumMat, `Flip_Handle_${i + 1}`);
        }
      } else if (mod.drawersCount > 0 && mod.doorsCount === 0) {
        const dCount = mod.drawersCount;
        const dh = bodyH / dCount;
        for (let i = 0; i < dCount; i++) {
          addBox(g, innerW - gap * 2, dh - gap * 2, 0.018, 0, plinthH + dh / 2 + i * dh, md + 0.009, mdfMat, `Drawer_Front_${i + 1}`);
          addBox(g, innerW * 0.55, 0.01, 0.014, 0, plinthH + dh * (i + 1) - 0.022, md + 0.022, alumMat, `Drawer_Pull_${i + 1}`);
        }
      } else {
        const doors = Math.max(1, mod.doorsCount || Math.round(mw / 0.45));
        const dw = innerW / doors;
        for (let i = 0; i < doors; i++) {
          const dx = -innerW / 2 + dw / 2 + i * dw;
          addBox(g, dw - gap * 2, bodyH - gap * 2, 0.018, dx, plinthH + bodyH / 2, md + 0.009, mdfMat, `Door_${i + 1}`);
          const hx = dx + (i % 2 === 0 ? dw / 2 - 0.03 : -dw / 2 + 0.03);
          addBox(g, 0.01, Math.min(0.22, bodyH * 0.4), 0.014, hx, plinthH + bodyH * 0.6, md + 0.022, alumMat, `Handle_${i + 1}`);
        }
      }

      if (mod.type === 'balcao_pia') {
        // Tampo de pedra + cuba inox + torneira
        addBox(g, mw + 0.02, topSlabH, md + 0.03, 0, plinthH + bodyH + topSlabH / 2, (md + 0.03) / 2, stoneMat, 'Granite_Countertop');
        const sinkW = Math.min(mw * 0.45, 0.55);
        addBox(g, sinkW, 0.014, 0.36, 0, plinthH + bodyH + topSlabH + 0.004, md * 0.52, steelMat, 'Sink_Basin');
        addBox(g, 0.022, 0.24, 0.022, 0, plinthH + bodyH + topSlabH + 0.12, md * 0.16, steelMat, 'Faucet_Neck');
      }

      if (mod.hasLed && (mod.type === 'aereo_portas' || mod.type === 'aereo_basculante' || mod.type === 'rack_suspenso')) {
        addBox(g, mw * 0.9, 0.008, 0.012, 0, 0.004, md * 0.72, ledMat, 'Under_Cabinet_LED');
      }
    }

    g.position.set(xCenter, yBase, 0.01);
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
  finishLabel: string,
  finishCod15: string,
  fitaCod: string,
  hardwareLabel: string,
  quoteRange: string,
  sheets15: number,
  sheets6: number
): string {
  const roomNames: Record<string, string> = {
    cozinha: 'Cozinha Planejada',
    quarto: 'Quarto / Guarda-Roupa Planejado',
    sala: 'Sala / Painel & Rack Planejado',
  };
  const modLines = analysis.modules
    .map(m => `• ${m.label} (${m.widthCm}×${m.heightCm}×${m.depthCm} cm)`)
    .join('\n');

  const obsLines = analysis.obstacles.length
    ? analysis.obstacles.map(o => `${o.label} (${o.xStartCm}–${o.xEndCm} cm)`).join(', ')
    : 'Parede livre sem obstruções críticas detectadas';

  return (
    `Olá! Acabei de gerar uma proposta 3D por foto do cômodo no site da 83 Ambientes Planejados:\n\n` +
    `*Ambiente:* ${roomNames[analysis.roomType] || analysis.roomType}\n` +
    `*Dimensões calibradas da parede:* ${analysis.roomDimensionsCm.widthCm} cm (L) × ${analysis.roomDimensionsCm.heightCm} cm (A)\n` +
    `*Obstáculos detectados:* ${obsLines}\n\n` +
    `*Módulos propostos:*\n${modLines}\n\n` +
    `*Acabamento:* ${finishLabel} (Cód. Chapa 15mm: ${finishCod15}${fitaCod ? ` | Fita: ${fitaCod}` : ''})\n` +
    `*Ferragens:* ${hardwareLabel}\n` +
    `*Consumo estimado:* ~${sheets15} chapa(s) 15mm + ~${sheets6} chapa(s) 6mm\n` +
    `*Estimativa preliminar:* ${quoteRange} (sujeito a medição técnica final no local)\n\n` +
    `Gostaria de agendar a visita/medição técnica para fechar o projeto no SketchUp!`
  );
}
