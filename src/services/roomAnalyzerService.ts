import { Client } from '@gradio/client';
import { ProposedCabinetModule } from '../data/pricingCatalog';

export type RoomType = 'cozinha' | 'quarto' | 'sala';
export type ReferenceMeasureType = 'wall_width' | 'ceiling_height';

export interface DetectedObstacle {
  id: string;
  type: 'window' | 'door' | 'outlet' | 'plumbing' | string;
  label: string;
  wall: 'back' | 'left' | 'right';
  bbox: number[]; // [xmin, ymin, xmax, ymax] in 0..1000
  xStartCm: number;
  xEndCm: number;
  yBottomCm: number;
  yTopCm: number;
}

export interface RoomAnalysisResult {
  success: boolean;
  elapsedSec: number;
  roomType: RoomType;
  roomGlbUrl: string | null;
  depthMapUrl: string | null;
  fov?: { horizontalDeg?: number | null; verticalDeg?: number | null };
  roomDimensionsCm: {
    widthCm: number;
    heightCm: number;
    depthCm: number;
  };
  backWallNormBox: number[];
  obstacles: DetectedObstacle[];
  modules: ProposedCabinetModule[];
  architectNotesPtBr: string;
  aiEngines: {
    geometry3d: string;
    perception: string;
    architect: string;
  };
}

export interface AnalyzeRoomRequest {
  imageDataUrl: string;
  roomType: RoomType;
  referenceType: ReferenceMeasureType;
  referenceValueCm: number;
  requirements: string;
}

function getBackendEndpoints(): string[] {
  const envUrl = (import.meta as any).env?.VITE_AI_BACKEND_URL;
  const list: string[] = [];
  if (envUrl) {
    list.push(`${String(envUrl).replace(/\/$/, '')}/api/analyze-room`);
  }
  const host = typeof window !== 'undefined' ? window.location.hostname : '';
  if (host === 'localhost' || host === '127.0.0.1') {
    list.push('/api/analyze-room', 'http://localhost:5175/api/analyze-room');
  }
  return list;
}

function resolveModelUrl(url: string | null | undefined, usedEndpoint: string): string | null {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
    return url;
  }
  if (usedEndpoint.startsWith('http://localhost:5175')) {
    return `http://localhost:5175${url}`;
  }
  if (usedEndpoint.startsWith('http')) {
    try {
      const origin = new URL(usedEndpoint).origin;
      return `${origin}${url}`;
    } catch {
      return url;
    }
  }
  return url;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function extractJsonPayload(raw: unknown): any {
  if (!raw) return null;
  const text = (Array.isArray(raw) ? raw.join('\n') : String(raw))
    .trim()
    .replace(/^```(?:json)?\s*/gim, '')
    .replace(/```\s*$/gm, '')
    .trim();
  try {
    return JSON.parse(text);
  } catch {
    const objMatch = text.match(/(\{[\s\S]*\})/);
    if (objMatch) {
      try {
        return JSON.parse(objMatch[1]);
      } catch {
        // ignore
      }
    }
    const arrMatch = text.match(/(\[[\s\S]*\])/);
    if (arrMatch) {
      try {
        return JSON.parse(arrMatch[1]);
      } catch {
        // ignore
      }
    }
  }
  return null;
}

function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  return fetch(dataUrl).then(r => r.blob());
}

function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth || 800, height: img.naturalHeight || 600 });
    img.onerror = () => resolve({ width: 800, height: 600 });
    img.src = dataUrl;
  });
}

function normalizeObstacleType(label: string): string {
  const low = label.toLowerCase();
  if (low.includes('window') || low.includes('janela')) return 'window';
  if (low.includes('door') || low.includes('porta')) return 'door';
  if (low.includes('plumb') || low.includes('pipe') || low.includes('water') || low.includes('drain') || low.includes('hidr')) return 'plumbing';
  if (low.includes('outlet') || low.includes('socket') || low.includes('tomada') || low.includes('switch')) return 'outlet';
  if (low.includes('wall') || low.includes('parede')) return 'back_wall';
  return 'other';
}

function overlaps1D(a1: number, a2: number, b1: number, b2: number, pad: number = 3): boolean {
  return (a1 < b2 - pad) && (a2 > b1 + pad);
}

/**
 * Fallback direto via @gradio/client no navegador caso a página esteja hospedada no Firebase
 * sem servidor Python local ou URL de backend configurada.
 */
async function analyzeViaDirectHuggingFace(
  req: AnalyzeRoomRequest,
  onProgress?: (msg: string, pct: number) => void
): Promise<RoomAnalysisResult> {
  const t0 = performance.now();
  const imageBlob = await dataUrlToBlob(req.imageDataUrl);
  const imgSize = await getImageDimensions(req.imageDataUrl);

  if (onProgress) onProgress('1/3 Conectando ao Hugging Face ZeroGPU (MoGe-2 + Qwen2-VL)...', 18);

  const [detConn, planConn, mogeConn] = await Promise.all([
    Client.connect('maxiw/Qwen2-VL-Detection'),
    Client.connect('GanymedeNil/Qwen2-VL-7B'),
    Client.connect('Ruicheng/MoGe-2').catch(() => null),
  ]);

  if (onProgress) onProgress('2/3 Detectando paredes, portas, janelas e reconstruindo 3D...', 45);

  const detPromise = detConn.predict('/run_example', [
    imageBlob,
    'Identify the window, plumbing water pipe/drain, electrical outlets, doors, and back wall in this empty room.',
    'You are a helpfull assistant to detect objects in images. When asked to detect elements based on a description you return bounding boxes for all elements in the form of [xmin, ymin, xmax, ymax] whith the values beeing scaled to 1000 by 1000 pixels. When there are more than one result, answer with a list of bounding boxes in the form of [[xmin, ymin, xmax, ymax], [xmin, ymin, xmax, ymax], ...].',
    'Qwen/Qwen2-VL-7B-Instruct',
  ]);

  const mogePromise = mogeConn
    ? mogeConn.predict('/run', [imageBlob, 512, 'Medium', true, true]).catch(() => null)
    : Promise.resolve(null);

  const detRes: any = await detPromise;
  let detPayload: any = detRes?.data?.[0];
  if (typeof detPayload === 'string' && detPayload.trim().startsWith('[')) {
    try {
      const unwrapped = JSON.parse(detPayload);
      if (Array.isArray(unwrapped)) detPayload = unwrapped;
    } catch {
      // keep raw
    }
  }
  const rawDetText = (Array.isArray(detPayload) ? detPayload.join('\n') : String(detPayload || '')).replace(/\\n/g, '\n');
  const detParsed = extractJsonPayload(rawDetText);
  const detItems: Array<{ label: string; type: string; bbox: number[] }> = [];
  if (Array.isArray(detParsed)) {
    for (const item of detParsed) {
      if (item && Array.isArray(item.bbox) && item.bbox.length === 4) {
        detItems.push({
          label: String(item.label || 'element'),
          type: normalizeObstacleType(String(item.label || '')),
          bbox: item.bbox.map(Number),
        });
      }
    }
  }
  if (!detItems.length && rawDetText) {
    let currentLabel = 'element';
    for (const line of rawDetText.split('\n')) {
      const clean = line.replace(/\*/g, '').trim();
      if (!clean) continue;
      const headMatch = clean.match(/^(?:\d+\.|[-•])?\s*([A-Za-zÀ-ÿ0-9 /_-]+?)\s*:/);
      if (headMatch && !headMatch[1].toLowerCase().includes('bounding box')) {
        currentLabel = headMatch[1].trim();
      }
      const rx = /\[(\d{1,4})\s*,\s*(\d{1,4})\s*,\s*(\d{1,4})\s*,\s*(\d{1,4})\]/g;
      let m: RegExpExecArray | null;
      while ((m = rx.exec(clean)) !== null) {
        detItems.push({
          label: currentLabel,
          type: normalizeObstacleType(currentLabel),
          bbox: [Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4])],
        });
      }
    }
  }

  const wallBoxes = detItems.filter(i => i.type === 'back_wall').map(i => i.bbox);
  const [wx1, wy1, wx2, wy2] = wallBoxes.length
    ? wallBoxes.reduce((a, b) => ((b[2] - b[0]) * (b[3] - b[1]) > (a[2] - a[0]) * (a[3] - a[1]) ? b : a))
    : [140, 150, 860, 820];

  const pxW = Math.max(80, ((wx2 - wx1) / 1000) * imgSize.width);
  const pxH = Math.max(80, ((wy2 - wy1) / 1000) * imgSize.height);
  const aspectHW = pxH / pxW;

  const widthCm = req.referenceType === 'ceiling_height'
    ? Math.round(clamp(req.referenceValueCm / aspectHW, 180, 680))
    : Math.round(clamp(req.referenceValueCm, 150, 750));
  const heightCm = req.referenceType === 'ceiling_height'
    ? Math.round(clamp(req.referenceValueCm, 210, 380))
    : Math.round(clamp(widthCm * aspectHW, 245, 290));
  const depthCm = Math.round(clamp(widthCm * 1.05, 250, 560));

  const obstacles: DetectedObstacle[] = detItems
    .filter(i => !['back_wall', 'floor', 'other'].includes(i.type))
    .map((it, idx) => {
      const [bx1, by1, bx2, by2] = it.bbox;
      const cx = (bx1 + bx2) / 2;
      const wall: 'back' | 'left' | 'right' = cx < wx1 - 25 ? 'left' : cx > wx2 + 25 ? 'right' : 'back';
      const xStartCm = Math.round(clamp(((bx1 - wx1) / Math.max(1, wx2 - wx1)) * widthCm, 0, widthCm));
      const xEndCm = Math.round(clamp(((bx2 - wx1) / Math.max(1, wx2 - wx1)) * widthCm, xStartCm + 10, widthCm));
      const yBottomCm = Math.round(clamp(((wy2 - by2) / Math.max(1, wy2 - wy1)) * heightCm, 0, heightCm - 10));
      const yTopCm = Math.round(clamp(((wy2 - by1) / Math.max(1, wy2 - wy1)) * heightCm, yBottomCm + 10, heightCm));
      return {
        id: `obs_${idx}`,
        type: it.type,
        label: it.label,
        wall,
        bbox: it.bbox,
        xStartCm,
        xEndCm,
        yBottomCm,
        yTopCm,
      };
    });

  if (onProgress) onProgress('3/3 Gerando layout paramétrico de móveis sob medida...', 72);

  const allowedTypes: Record<RoomType, string> = {
    cozinha: 'balcao_pia, balcao_gavetas, aereo_portas, aereo_basculante, torre_quente, nicho_geladeira',
    quarto: 'guarda_roupa_correr, guarda_roupa_abrir, criado_mudo, painel_cabeceira, bancada_estudo',
    sala: 'painel_tv_ripado, rack_suspenso, estante_nichos',
  };

  const obsSummary = obstacles.length
    ? obstacles.map(o => `- ${o.type} on ${o.wall} wall: x=${o.xStartCm}..${o.xEndCm}cm, y=${o.yBottomCm}..${o.yTopCm}cm`).join('\n')
    : '- None detected on back wall';

  const exampleByRoom: Record<RoomType, string> = {
    cozinha:
      '    {"type": "balcao_gavetas", "label": "Balcão Gaveteiro", "wall": "back", "xCm": 5, "yCm": 0, "widthCm": 80, "heightCm": 86, "depthCm": 60, "doorsCount": 0, "drawersCount": 3, "hasLed": false},\n' +
      '    {"type": "balcao_pia", "label": "Balcão de Pia", "wall": "back", "xCm": 85, "yCm": 0, "widthCm": 150, "heightCm": 86, "depthCm": 60, "doorsCount": 3, "drawersCount": 0, "hasLed": false},\n' +
      '    {"type": "torre_quente", "label": "Torre Quente Forno/Micro", "wall": "back", "xCm": 235, "yCm": 0, "widthCm": 70, "heightCm": 220, "depthCm": 60, "doorsCount": 2, "drawersCount": 2, "hasLed": false},\n' +
      '    {"type": "aereo_basculante", "label": "Armário Aéreo Basculante", "wall": "back", "xCm": 5, "yCm": 150, "widthCm": 100, "heightCm": 68, "depthCm": 35, "doorsCount": 2, "drawersCount": 0, "hasLed": true}',
    quarto:
      '    {"type": "guarda_roupa_correr", "label": "Guarda-Roupa 3 Portas de Correr", "wall": "back", "xCm": 10, "yCm": 0, "widthCm": 210, "heightCm": 240, "depthCm": 60, "doorsCount": 3, "drawersCount": 4, "hasLed": false},\n' +
      '    {"type": "bancada_estudo", "label": "Escrivaninha Planejada", "wall": "back", "xCm": 225, "yCm": 0, "widthCm": 105, "heightCm": 76, "depthCm": 55, "doorsCount": 0, "drawersCount": 2, "hasLed": false}',
    sala:
      '    {"type": "painel_tv_ripado", "label": "Painel Ripado TV c/ Fita LED", "wall": "back", "xCm": 20, "yCm": 0, "widthCm": 240, "heightCm": 235, "depthCm": 8, "doorsCount": 0, "drawersCount": 0, "hasLed": true},\n' +
      '    {"type": "rack_suspenso", "label": "Rack Suspenso", "wall": "back", "xCm": 20, "yCm": 28, "widthCm": 240, "heightCm": 38, "depthCm": 42, "doorsCount": 0, "drawersCount": 4, "hasLed": true}',
  };

  const planPrompt =
    `You are a senior Brazilian custom cabinetry architect (móveis projetados).\n` +
    `Room type: ${req.roomType}. Calibrated back wall size: width=${widthCm}cm, height=${heightCm}cm.\n` +
    `Detected obstacles:\n${obsSummary}\n` +
    `Client requirements: ${req.requirements || `Projeto funcional de ${req.roomType}`}\n` +
    `Allowed module types: ${allowedTypes[req.roomType]}.\n` +
    `Design 3 to 5 coordinated cabinetry modules on wall="back" from xCm=0 up to ${widthCm}cm avoiding doors/windows/plumbing.\n` +
    `Return ONLY valid JSON matching:\n{\n  "detectedRoomType":"${req.roomType}",\n  "summaryPtBr":"Explicação objetiva em Português do Brasil",\n  "modules":[\n${exampleByRoom[req.roomType]}\n  ]\n}`;

  const planRes: any = await planConn.predict('/run_example', [
    imageBlob,
    planPrompt,
    'Qwen/Qwen2-VL-7B-Instruct',
  ]);

  const planJson = extractJsonPayload(planRes?.data?.[0]);
  if (!planJson || !Array.isArray(planJson.modules)) {
    throw new Error('O modelo Qwen2-VL não retornou módulos válidos para a imagem.');
  }

  const backDoors = obstacles.filter(o => o.wall === 'back' && o.type === 'door');
  const backWindows = obstacles.filter(o => o.wall === 'back' && o.type === 'window');

  const isLayeredOk = (t1: string, t2: string) =>
    (t1 === 'painel_tv_ripado' && t2 === 'rack_suspenso') ||
    (t2 === 'painel_tv_ripado' && t1 === 'rack_suspenso') ||
    (t1 === 'painel_cabeceira' && t2 === 'criado_mudo') ||
    (t2 === 'painel_cabeceira' && t1 === 'criado_mudo');

  const lowCounterTypes = new Set(['balcao_pia', 'balcao_gavetas', 'rack_suspenso', 'bancada_estudo', 'criado_mudo']);
  const modules: ProposedCabinetModule[] = [];
  for (const raw of planJson.modules) {
    if (!raw || !raw.type) continue;
    let xCm = Math.round(clamp(Number(raw.xCm ?? 0), 0, Math.max(0, widthCm - 35)));
    let wCm = Math.round(clamp(Number(raw.widthCm ?? 90), 35, widthCm - xCm));
    const yCm = Math.round(clamp(Number(raw.yCm ?? 0), 0, Math.max(0, heightCm - 35)));
    let hCm = Math.round(clamp(Number(raw.heightCm ?? 86), 30, Math.max(30, heightCm - yCm)));
    const dCm = Math.round(clamp(Number(raw.depthCm ?? 58), 6, 75));

    if (backDoors.some(d => overlaps1D(xCm, xCm + wCm, d.xStartCm, d.xEndCm, 4))) continue;
    for (const w of backWindows) {
      if (overlaps1D(xCm, xCm + wCm, w.xStartCm, w.xEndCm, 4) && overlaps1D(yCm, yCm + hCm, w.yBottomCm, w.yTopCm, 4)) {
        if (lowCounterTypes.has(raw.type) && yCm < 50 && w.yBottomCm >= 72) {
          hCm = Math.min(hCm, w.yBottomCm - 4);
        } else {
          const overlapRight = w.xEndCm - xCm;
          const overlapLeft = xCm + wCm - w.xStartCm;
          if (overlapRight <= 30 && w.xEndCm + 3 + 45 <= widthCm) {
            xCm = w.xEndCm + 3;
            wCm = Math.min(wCm, widthCm - xCm);
          } else if (overlapLeft <= 30 && w.xStartCm - 3 - xCm >= 40) {
            wCm = w.xStartCm - 3 - xCm;
          } else {
            wCm = 0;
          }
        }
      }
    }
    if (wCm < 35) continue;

    const collides = modules.some(
      m => !isLayeredOk(raw.type, m.type) &&
      overlaps1D(xCm, xCm + wCm, m.xCm, m.xCm + m.widthCm, 2) &&
      overlaps1D(yCm, yCm + hCm, m.yCm, m.yCm + m.heightCm, 2)
    );
    if (collides) continue;

    modules.push({
      id: `mod_${modules.length + 1}`,
      type: raw.type,
      label: String(raw.label || raw.type),
      wall: 'back',
      xCm,
      yCm,
      widthCm: wCm,
      heightCm: hCm,
      depthCm: dCm,
      doorsCount: Math.round(clamp(Number(raw.doorsCount ?? 2), 0, 6)),
      drawersCount: Math.round(clamp(Number(raw.drawersCount ?? 0), 0, 8)),
      hasLed: Boolean(raw.hasLed),
    });
  }

  if (!modules.length) {
    throw new Error('Nenhum módulo livre de colisões pôde ser posicionado na parede detectada.');
  }

  const mogeRes: any = await mogePromise;
  let roomGlbUrl: string | null = null;
  let depthMapUrl: string | null = null;
  if (mogeRes?.data) {
    const depthItem = mogeRes.data[0];
    const files = mogeRes.data[3] || [];
    const meshItem = Array.isArray(files)
      ? (files.find((f: any) => String(f?.url || f?.path || f).includes('mesh.glb')) || mogeRes.data[2])
      : mogeRes.data[2];
    roomGlbUrl = meshItem?.url || (typeof meshItem === 'string' ? meshItem : null);
    depthMapUrl = depthItem?.url || (typeof depthItem === 'string' ? depthItem : null);
  }

  if (onProgress) onProgress('Proposta 3D e leitura métrica concluídas!', 100);

  return {
    success: true,
    elapsedSec: Number(((performance.now() - t0) / 1000).toFixed(1)),
    roomType: (planJson.detectedRoomType as RoomType) || req.roomType,
    roomGlbUrl,
    depthMapUrl,
    roomDimensionsCm: { widthCm, heightCm, depthCm },
    backWallNormBox: [wx1, wy1, wx2, wy2],
    obstacles,
    modules,
    architectNotesPtBr: String(planJson.summaryPtBr || 'Proposta gerada via Hugging Face Qwen2-VL + MoGe-2.'),
    aiEngines: {
      geometry3d: roomGlbUrl ? 'Ruicheng/MoGe-2' : 'Perspective Calibration',
      perception: 'maxiw/Qwen2-VL-Detection',
      architect: 'GanymedeNil/Qwen2-VL-7B',
    },
  };
}

export async function analyzeEmptyRoomPhoto(
  req: AnalyzeRoomRequest,
  onProgress?: (msg: string, pct: number) => void
): Promise<RoomAnalysisResult> {
  const endpoints = getBackendEndpoints();

  for (const ep of endpoints) {
    try {
      if (onProgress) onProgress('Conectando ao servidor Hugging Face ZeroGPU (MoGe-2 + Qwen2-VL)...', 20);
      const res = await fetch(ep, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: req.imageDataUrl,
          roomType: req.roomType,
          referenceType: req.referenceType,
          referenceValueCm: req.referenceValueCm,
          requirements: req.requirements,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as RoomAnalysisResult;
        if (data && data.success) {
          data.roomGlbUrl = resolveModelUrl(data.roomGlbUrl, ep);
          data.depthMapUrl = resolveModelUrl(data.depthMapUrl, ep);
          if (onProgress) onProgress('Ambiente analisado e módulos 3D calibrados!', 100);
          return data;
        }
      } else {
        const errBody = await res.json().catch(() => ({}));
        console.warn(`[RoomAnalyzer] Backend ${ep} returned ${res.status}:`, errBody);
      }
    } catch (e) {
      console.warn(`[RoomAnalyzer] Backend ${ep} unreachable, trying next...`, e);
    }
  }

  return analyzeViaDirectHuggingFace(req, onProgress);
}
