import { Client } from '@gradio/client';
import { ModuleArchetype, ProposedCabinetModule } from '../data/pricingCatalog';

export type RoomType =
  | 'cozinha'
  | 'quarto'
  | 'sala'
  | 'banheiro'
  | 'lavanderia'
  | 'escritorio'
  | 'varanda_gourmet';

export type ReferenceMeasureType = 'wall_width' | 'ceiling_height';

export interface DetectedObstacle {
  id: string;
  type: 'window' | 'door' | 'outlet' | 'plumbing' | string;
  label: string;
  wall: 'back' | 'left' | 'right';
  bbox: number[];
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
  hfToken?: string;
  engineMode?: 'auto' | 'router' | 'zerogpu';
}

export function getStoredHfToken(): string {
  try {
    return (typeof localStorage !== 'undefined' ? localStorage.getItem('tt_hf_token') || '' : '').trim();
  } catch {
    return '';
  }
}

export function setStoredHfToken(token: string): void {
  try {
    if (typeof localStorage === 'undefined') return;
    const trimmed = token.trim();
    if (trimmed) localStorage.setItem('tt_hf_token', trimmed);
    else localStorage.removeItem('tt_hf_token');
  } catch {
    // ignore storage errors
  }
}

const VALID_MODULE_TYPES = new Set<string>([
  'balcao_pia', 'balcao_gavetas', 'balcao_cooktop', 'balcao_canto_L', 'balcao_lava_loucas', 'ilha_gourmet',
  'aereo_portas', 'aereo_basculante', 'aereo_canto_L', 'fechamento_teto', 'torre_quente', 'nicho_geladeira', 'cristaleira_vidro',
  'guarda_roupa_correr', 'guarda_roupa_abrir', 'closet_cabideiro_aberto',
  'cama_bau_planejada', 'criado_mudo', 'painel_cabeceira', 'cabeceira_estofada', 'penteadeira_camarim',
  'sapateira_prateleiras', 'bancada_estudo', 'painel_tv_ripado', 'painel_muxarabi', 'rack_suspenso',
  'estante_nichos', 'aparador_buffet', 'bar_adega', 'gabinete_banheiro',
  'espelheira_armario', 'armario_vassoureiro', 'bancada_tanque_maquina', 'mesa_retratil',
  'estacao_trabalho_L', 'arquivo_escritorio', 'balcao_churrasqueira', 'balcao_atendimento_comercial',
]);

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

function bboxIoU(a: number[], b: number[]): number {
  const ix1 = Math.max(a[0], b[0]);
  const iy1 = Math.max(a[1], b[1]);
  const ix2 = Math.min(a[2], b[2]);
  const iy2 = Math.min(a[3], b[3]);
  const iw = Math.max(0, ix2 - ix1);
  const ih = Math.max(0, iy2 - iy1);
  const inter = iw * ih;
  if (inter <= 0) return 0;
  const areaA = Math.max(1, (a[2] - a[0]) * (a[3] - a[1]));
  const areaB = Math.max(1, (b[2] - b[0]) * (b[3] - b[1]));
  return inter / (areaA + areaB - inter);
}

function overlaps1D(a1: number, a2: number, b1: number, b2: number, pad: number = 3): boolean {
  return (a1 < b2 - pad) && (a2 > b1 + pad);
}

const ROUTER_VISION_MODELS = [
  'Qwen/Qwen3-VL-8B-Instruct',
  'Qwen/Qwen2.5-VL-72B-Instruct',
  'Qwen/Qwen3-VL-30B-A3B-Instruct',
];

async function callHFRouterVisionBrowser(
  imageDataUrl: string,
  promptText: string,
  hfToken: string
): Promise<{ text: string; model: string }> {
  let lastErr = '';
  for (const model of ROUTER_VISION_MODELS) {
    try {
      const res = await fetch('https://router.huggingface.co/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${hfToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'image_url', image_url: { url: imageDataUrl } },
                { type: 'text', text: promptText },
              ],
            },
          ],
          max_tokens: 1400,
          temperature: 0.15,
        }),
      });
      if (!res.ok) {
        const errTxt = await res.text().catch(() => '');
        if (res.status === 401 || res.status === 403) {
          throw new Error(
            `HF Router ${res.status}: token atual sem permissão "Make calls to Inference Providers" (${errTxt.slice(0, 160)})`
          );
        }
        lastErr = `${model} HTTP ${res.status}: ${errTxt.slice(0, 140)}`;
        continue;
      }
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (content) return { text: String(content), model };
    } catch (e: any) {
      if (String(e?.message || '').includes('Inference Providers') || String(e?.message || '').includes('401') || String(e?.message || '').includes('403')) {
        throw e;
      }
      lastErr = String(e?.message || e);
    }
  }
  throw new Error(lastErr || 'HF Router indisponível.');
}

function formatFriendlyHfError(err: any, routerNote: string = '', hadToken: boolean = false): Error {
  const raw = String(err?.message || err || '');
  const low = (raw + ' ' + routerNote).toLowerCase();
  const isQuota = low.includes('quota') || low.includes('zerogpu') || low.includes('exceeded') || low.includes('429');
  const isPerm = low.includes('inference providers') || low.includes('403') || low.includes('401') || low.includes('unauthorized');
  if (isQuota || isPerm) {
    const parts: string[] = [];
    if (isQuota) {
      parts.push('Cota ZeroGPU excedida (anônimo: 2 min/dia; Free: 5 min/dia; PRO: 40 min/dia + excedente pago pelos créditos gerais em Settings → Billing).');
    }
    if (!hadToken) {
      parts.push('Abra "⚙️ Token Hugging Face" abaixo e cole um token da aba "Read" (para autenticar sua cota PRO/créditos no ZeroGPU).');
    } else if (isPerm) {
      parts.push('Para usar ZeroGPU com segurança prefira um token clássico da aba "Read" em huggingface.co/settings/tokens; já para Inference Providers API marque no Fine-grained "Inference → Make calls to Inference Providers".');
    } else {
      parts.push('Verifique em huggingface.co/settings/tokens (aba Read para ZeroGPU ou Fine-grained com Inference Providers) e confira seu saldo Pay-as-you-go em huggingface.co/settings/billing.');
    }
    return new Error(parts.join(' '));
  }
  return new Error(raw || 'Não foi possível concluir a análise do cômodo no Hugging Face.');
}

async function analyzeViaDirectHuggingFace(
  req: AnalyzeRoomRequest,
  onProgress?: (msg: string, pct: number) => void
): Promise<RoomAnalysisResult> {
  const t0 = performance.now();
  const imageBlob = await dataUrlToBlob(req.imageDataUrl);
  const imgSize = await getImageDimensions(req.imageDataUrl);
  const activeToken = (req.hfToken || getStoredHfToken() || '').trim();
  const engineMode = req.engineMode || 'auto';
  const clientOpts = activeToken
    ? ({
        token: activeToken as `hf_${string}`,
        headers: { 'x-hf-authorization': `Bearer ${activeToken}` },
      })
    : undefined;

  if (onProgress) {
    onProgress(
      engineMode === 'router'
        ? '1/3 Conectando ao HF Inference Providers (Router)...'
        : activeToken
        ? '1/3 Conectando ao ZeroGPU autenticado (PRO / Créditos)...'
        : '1/3 Conectando ao Hugging Face ZeroGPU...',
      18
    );
  }

  let routerNote = '';
  let rawDetText = '';
  let perceptionEngine = 'maxiw/Qwen2-VL-Detection';
  let architectEngine = 'GanymedeNil/Qwen2-VL-7B';
  const forceRouter = engineMode === 'router';
  const allowRouterFallback = Boolean(activeToken) && (engineMode === 'auto' || engineMode === 'router');

  let detConn: any = null;
  let planConn: any = null;
  let mogePromise: Promise<any> = Promise.resolve(null);

  if (!forceRouter) {
    mogePromise = Client.connect('Ruicheng/MoGe-2', clientOpts)
      .then((c) => c.predict('/run', [imageBlob, 512, 'Medium', true, true]).catch(() => null))
      .catch(() => null);
  }

  const runRouterDet = async () => {
    const detPrompt =
      'Detect architectural elements in this empty room interior photo.\n' +
      'Return ONLY a JSON array of objects [{"label": "...", "bbox": [xmin, ymin, xmax, ymax]}] normalized to 0..1000.\n' +
      'Only include visible elements: "back wall" (main front-facing wall), "window", "door", "electrical outlet", "plumbing pipe". If door or window is not visible, omit it.';
    const rDet = await callHFRouterVisionBrowser(req.imageDataUrl, detPrompt, activeToken);
    rawDetText = rDet.text;
    perceptionEngine = `HF Router (${rDet.model})`;
  };

  if (forceRouter) {
    if (!activeToken) throw formatFriendlyHfError(new Error('Token obrigatório no modo Router'), '', false);
    if (onProgress) onProgress('2/3 Detectando paredes e aberturas (HF Router)...', 40);
    try {
      await runRouterDet();
    } catch (e: any) {
      throw formatFriendlyHfError(e, String(e?.message || e), true);
    }
  } else {
    try {
      if (onProgress) onProgress('2/3 Detectando paredes e obstáculos no ZeroGPU (Qwen2-VL-Detection)...', 42);
      detConn = await Client.connect('maxiw/Qwen2-VL-Detection', clientOpts);
      const detRes: any = await detConn.predict('/run_example', [
        imageBlob,
        'Identify the window, plumbing water pipe/drain, electrical outlets, doors, and back wall in this empty room.',
        'You are a helpfull assistant to detect objects in images. When asked to detect elements based on a description you return bounding boxes for all elements in the form of [xmin, ymin, xmax, ymax] whith the values beeing scaled to 1000 by 1000 pixels. When there are more than one result, answer with a list of bounding boxes in the form of [[xmin, ymin, xmax, ymax], [xmin, ymin, xmax, ymax], ...].',
        'Qwen/Qwen2-VL-7B-Instruct',
      ]);
      let detPayload: any = detRes?.data?.[0];
      if (typeof detPayload === 'string' && detPayload.trim().startsWith('[')) {
        try {
          const unwrapped = JSON.parse(detPayload);
          if (Array.isArray(unwrapped)) detPayload = unwrapped;
        } catch {
          // keep raw
        }
      }
      rawDetText = (Array.isArray(detPayload) ? detPayload.join('\n') : String(detPayload || '')).replace(/\\n/g, '\n');
      perceptionEngine = activeToken ? 'maxiw/Qwen2-VL-Detection (ZeroGPU PRO)' : 'maxiw/Qwen2-VL-Detection';
    } catch (zErr: any) {
      if (allowRouterFallback) {
        try {
          if (onProgress) onProgress('2/3 ZeroGPU indisponível, tentando fallback HF Router...', 45);
          await runRouterDet();
        } catch (rErr: any) {
          routerNote = String(rErr?.message || rErr);
          throw formatFriendlyHfError(zErr, routerNote, Boolean(activeToken));
        }
      } else {
        throw formatFriendlyHfError(zErr, '', Boolean(activeToken));
      }
    }
  }
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
    const skipPhrases = ['not visible', 'not explicitly visible', 'not present', 'not detected', 'no door', 'no window', 'assuming'];
    for (const line of rawDetText.split('\n')) {
      const clean = line.replace(/\*/g, '').trim();
      if (!clean) continue;
      const headMatch = clean.match(/^(?:\d+\.|[-•])?\s*([A-Za-zÀ-ÿ0-9 /_-]+?)\s*:/);
      if (headMatch && !headMatch[1].toLowerCase().includes('bounding box')) {
        currentLabel = headMatch[1].trim();
      }
      const lowClean = clean.toLowerCase();
      if (skipPhrases.some(p => lowClean.includes(p))) continue;
      const rx = /\[(\d{1,4})\s*,\s*(\d{1,4})\s*,\s*(\d{1,4})\s*,\s*(\d{1,4})\]/g;
      let m: RegExpExecArray | null;
      while ((m = rx.exec(clean)) !== null) {
        const coords = [Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4])];
        if (coords[2] > coords[0] && coords[3] > coords[1]) {
          detItems.push({
            label: currentLabel,
            type: normalizeObstacleType(currentLabel),
            bbox: coords,
          });
        }
      }
    }
  }

  const openingBoxes = detItems.filter(i => i.type === 'window' || i.type === 'door').map(i => i.bbox);
  const validWallBoxes = detItems
    .filter(i => i.type === 'back_wall')
    .map(i => i.bbox)
    .filter(b => {
      const bw = b[2] - b[0];
      const bh = b[3] - b[1];
      if (bw < 280 || bh < 280) return false;
      if ((bw >= 880 && bh >= 880) || (b[0] <= 20 && b[2] >= 980)) return false;
      if (openingBoxes.some(ob => bboxIoU(b, ob) > 0.72)) return false;
      return true;
    });

  const [wx1, wy1, wx2, wy2] = validWallBoxes.length
    ? validWallBoxes.reduce((a, b) => ((b[2] - b[0]) * (b[3] - b[1]) > (a[2] - a[0]) * (a[3] - a[1]) ? b : a))
    : [160, 140, 840, 800];

  const pxW = Math.max(80, ((wx2 - wx1) / 1000) * imgSize.width);
  const pxH = Math.max(80, ((wy2 - wy1) / 1000) * imgSize.height);
  const aspectHW = pxH / pxW;

  const widthCm = req.referenceType === 'ceiling_height'
    ? Math.round(clamp(req.referenceValueCm / aspectHW, 150, 680))
    : Math.round(clamp(req.referenceValueCm, 120, 750));
  const heightCm = req.referenceType === 'ceiling_height'
    ? Math.round(clamp(req.referenceValueCm, 210, 380))
    : Math.round(clamp(widthCm * aspectHW, 245, 290));
  const depthCm = Math.round(clamp(widthCm * 1.08, 220, 580));

  const windowBoxes = detItems.filter(i => i.type === 'window').map(i => i.bbox);
  const obstacles: DetectedObstacle[] = [];
  detItems
    .filter(i => !['back_wall', 'floor', 'other'].includes(i.type))
    .forEach((it, idx) => {
      const [bx1, by1, bx2, by2] = it.bbox;
      if (bx2 <= bx1 || by2 <= by1) return;
      if (it.type === 'door' && windowBoxes.some(wb => bboxIoU(it.bbox, wb) > 0.70)) return;
      if (it.type === 'window' || it.type === 'door') {
        if ((bx2 - bx1) > (wx2 - wx1) * 0.85 && (by2 - by1) > (wy2 - wy1) * 0.85) return;
      }

      const cx = (bx1 + bx2) / 2;
      const wall: 'back' | 'left' | 'right' = cx < wx1 + 10 ? 'left' : cx > wx2 - 10 ? 'right' : 'back';
      const xStartCm = Math.round(clamp(((bx1 - wx1) / Math.max(1, wx2 - wx1)) * widthCm, 0, widthCm));
      const xEndCm = Math.round(clamp(((bx2 - wx1) / Math.max(1, wx2 - wx1)) * widthCm, xStartCm + 10, widthCm));
      const yBottomCm = Math.round(clamp(((wy2 - by2) / Math.max(1, wy2 - wy1)) * heightCm, 0, heightCm - 10));
      const yTopCm = Math.round(clamp(((wy2 - by1) / Math.max(1, wy2 - wy1)) * heightCm, yBottomCm + 10, heightCm));

      const obsW = xEndCm - xStartCm;
      const obsH = yTopCm - yBottomCm;
      if (it.type === 'door' && wall === 'back' && (obsW < 40 || yTopCm < 150 || obsH < 130)) return;
      if (it.type === 'window' && wall === 'back' && (obsW < 25 || obsH < 30)) return;

      obstacles.push({
        id: `obs_${idx}`,
        type: it.type,
        label: it.label,
        wall,
        bbox: it.bbox,
        xStartCm,
        xEndCm,
        yBottomCm,
        yTopCm,
      });
    });

  if (onProgress) onProgress('3/3 Gerando layout paramétrico de móveis sob medida...', 72);

  const allowedTypes: Record<RoomType, string> = {
    cozinha: 'balcao_pia, balcao_gavetas, balcao_cooktop, balcao_canto_L, balcao_lava_loucas, ilha_gourmet, aereo_portas, aereo_basculante, aereo_canto_L, fechamento_teto, torre_quente, nicho_geladeira, cristaleira_vidro, mesa_retratil',
    quarto: 'guarda_roupa_correr, guarda_roupa_abrir, closet_cabideiro_aberto, cama_bau_planejada, criado_mudo, painel_cabeceira, cabeceira_estofada, penteadeira_camarim, sapateira_prateleiras, bancada_estudo, fechamento_teto',
    sala: 'painel_tv_ripado, painel_muxarabi, rack_suspenso, estante_nichos, aparador_buffet, bar_adega, cristaleira_vidro, fechamento_teto',
    banheiro: 'gabinete_banheiro, espelheira_armario, armario_vassoureiro, estante_nichos',
    lavanderia: 'bancada_tanque_maquina, armario_vassoureiro, aereo_portas, balcao_gavetas, balcao_canto_L, mesa_retratil, fechamento_teto',
    escritorio: 'estacao_trabalho_L, arquivo_escritorio, estante_nichos, balcao_gavetas, painel_tv_ripado, painel_muxarabi, mesa_retratil, balcao_atendimento_comercial',
    varanda_gourmet: 'balcao_churrasqueira, balcao_pia, balcao_canto_L, balcao_lava_loucas, bar_adega, ilha_gourmet, aereo_portas, cristaleira_vidro, painel_muxarabi',
  };

  const obsSummary = obstacles.length
    ? obstacles.map(o => `- ${o.type} on ${o.wall} wall: x=${o.xStartCm}..${o.xEndCm}cm, y=${o.yBottomCm}..${o.yTopCm}cm`).join('\n')
    : '- None detected on back wall';

  const exampleByRoom: Record<RoomType, string> = {
    cozinha:
      '    {"type": "balcao_pia", "label": "Balcão de Pia", "wall": "back", "xCm": 10, "yCm": 0, "widthCm": 140, "heightCm": 86, "depthCm": 60, "doorsCount": 3, "drawersCount": 0, "hasLed": false},\n' +
      '    {"type": "balcao_cooktop", "label": "Balcão Cooktop", "wall": "back", "xCm": 150, "yCm": 0, "widthCm": 90, "heightCm": 86, "depthCm": 60, "doorsCount": 0, "drawersCount": 3, "hasLed": false},\n' +
      '    {"type": "torre_quente", "label": "Torre Quente", "wall": "back", "xCm": 240, "yCm": 0, "widthCm": 70, "heightCm": 220, "depthCm": 60, "doorsCount": 2, "drawersCount": 2, "hasLed": false}',
    quarto:
      '    {"type": "guarda_roupa_correr", "label": "Guarda-Roupa 3 Portas de Correr", "wall": "back", "xCm": 10, "yCm": 0, "widthCm": 200, "heightCm": 240, "depthCm": 60, "doorsCount": 3, "drawersCount": 4, "hasLed": false},\n' +
      '    {"type": "penteadeira_camarim", "label": "Penteadeira Camarim c/ LED", "wall": "back", "xCm": 215, "yCm": 0, "widthCm": 100, "heightCm": 165, "depthCm": 45, "doorsCount": 0, "drawersCount": 2, "hasLed": true}',
    sala:
      '    {"type": "painel_tv_ripado", "label": "Painel Ripado TV c/ LED", "wall": "back", "xCm": 15, "yCm": 0, "widthCm": 220, "heightCm": 235, "depthCm": 8, "doorsCount": 0, "drawersCount": 0, "hasLed": true},\n' +
      '    {"type": "rack_suspenso", "label": "Rack Suspenso", "wall": "back", "xCm": 15, "yCm": 28, "widthCm": 220, "heightCm": 38, "depthCm": 42, "doorsCount": 0, "drawersCount": 4, "hasLed": true},\n' +
      '    {"type": "cristaleira_vidro", "label": "Cristaleira Vidro c/ LED", "wall": "back", "xCm": 240, "yCm": 0, "widthCm": 75, "heightCm": 235, "depthCm": 42, "doorsCount": 2, "drawersCount": 0, "hasLed": true}',
    banheiro:
      '    {"type": "gabinete_banheiro", "label": "Gabinete Suspenso c/ Cuba", "wall": "back", "xCm": 20, "yCm": 46, "widthCm": 130, "heightCm": 44, "depthCm": 50, "doorsCount": 0, "drawersCount": 3, "hasLed": true},\n' +
      '    {"type": "espelheira_armario", "label": "Espelheira Armário c/ LED", "wall": "back", "xCm": 20, "yCm": 115, "widthCm": 130, "heightCm": 78, "depthCm": 16, "doorsCount": 3, "drawersCount": 0, "hasLed": true}',
    lavanderia:
      '    {"type": "bancada_tanque_maquina", "label": "Bancada Tanque + Máquina", "wall": "back", "xCm": 10, "yCm": 0, "widthCm": 180, "heightCm": 90, "depthCm": 62, "doorsCount": 2, "drawersCount": 0, "hasLed": false},\n' +
      '    {"type": "armario_vassoureiro", "label": "Armário Vassoureiro", "wall": "back", "xCm": 195, "yCm": 0, "widthCm": 70, "heightCm": 225, "depthCm": 55, "doorsCount": 2, "drawersCount": 0, "hasLed": false}',
    escritorio:
      '    {"type": "estacao_trabalho_L", "label": "Estação Home Office c/ Gaveteiro", "wall": "back", "xCm": 10, "yCm": 0, "widthCm": 180, "heightCm": 75, "depthCm": 62, "doorsCount": 0, "drawersCount": 3, "hasLed": false},\n' +
      '    {"type": "arquivo_escritorio", "label": "Armário Arquivos Alto", "wall": "back", "xCm": 195, "yCm": 0, "widthCm": 95, "heightCm": 220, "depthCm": 45, "doorsCount": 2, "drawersCount": 2, "hasLed": false}',
    varanda_gourmet:
      '    {"type": "balcao_churrasqueira", "label": "Bancada Churrasqueira", "wall": "back", "xCm": 10, "yCm": 0, "widthCm": 160, "heightCm": 88, "depthCm": 65, "doorsCount": 3, "drawersCount": 2, "hasLed": false},\n' +
      '    {"type": "bar_adega", "label": "Bar Adega c/ LED", "wall": "back", "xCm": 175, "yCm": 0, "widthCm": 100, "heightCm": 220, "depthCm": 45, "doorsCount": 2, "drawersCount": 0, "hasLed": true}',
  };

  const planPrompt =
    `You are a senior Brazilian custom cabinetry architect (móveis projetados).\n` +
    `Room type: ${req.roomType}. Calibrated back wall size: width=${widthCm}cm, height=${heightCm}cm, room depth=${depthCm}cm.\n` +
    `Detected obstacles:\n${obsSummary}\n` +
    `Client requirements: ${req.requirements || `Projeto funcional de ${req.roomType}`}\n` +
    `Allowed module types: ${allowedTypes[req.roomType]}.\n` +
    `Allowed walls: "back", "left", "right" (if L-layout fits cleanly past 65cm from corner), or "center" (for ilha_gourmet).\n` +
    `Design 3 to 5 tailored cabinetry modules avoiding doors/windows/plumbing.\n` +
    `Return ONLY valid JSON matching:\n{\n  "detectedRoomType":"${req.roomType}",\n  "summaryPtBr":"Explicação objetiva em Português do Brasil",\n  "modules":[\n${exampleByRoom[req.roomType]}\n  ]\n}`;

  let rawPlanText: any = null;
  if (forceRouter) {
    try {
      const rPlan = await callHFRouterVisionBrowser(req.imageDataUrl, planPrompt, activeToken);
      rawPlanText = rPlan.text;
      architectEngine = `HF Router (${rPlan.model})`;
    } catch (pe: any) {
      throw formatFriendlyHfError(pe, String(pe?.message || pe), true);
    }
  } else {
    try {
      planConn = await Client.connect('GanymedeNil/Qwen2-VL-7B', clientOpts);
      const planRes: any = await planConn.predict('/run_example', [
        imageBlob,
        planPrompt,
        'Qwen/Qwen2-VL-7B-Instruct',
      ]);
      rawPlanText = planRes?.data?.[0];
      architectEngine = activeToken ? 'GanymedeNil/Qwen2-VL-7B (ZeroGPU PRO)' : 'GanymedeNil/Qwen2-VL-7B';
    } catch (zErr: any) {
      if (allowRouterFallback) {
        try {
          const rPlan = await callHFRouterVisionBrowser(req.imageDataUrl, planPrompt, activeToken);
          rawPlanText = rPlan.text;
          architectEngine = `HF Router (${rPlan.model})`;
        } catch (rErr: any) {
          throw formatFriendlyHfError(zErr, String(rErr?.message || rErr), Boolean(activeToken));
        }
      } else {
        throw formatFriendlyHfError(zErr, '', Boolean(activeToken));
      }
    }
  }

  const planJson = extractJsonPayload(rawPlanText);
  if (!planJson || !Array.isArray(planJson.modules)) {
    throw new Error('O modelo Qwen-VL não retornou módulos válidos para a imagem.');
  }

  const isLayeredOk = (t1: string, t2: string) => {
    if (t1 === 'fechamento_teto' || t2 === 'fechamento_teto') return true;
    const a = [t1, t2].sort().join('+');
    return (
      a === 'painel_tv_ripado+rack_suspenso' ||
      a === 'criado_mudo+painel_cabeceira' ||
      a === 'cama_bau_planejada+painel_cabeceira' ||
      a === 'cabeceira_estofada+criado_mudo' ||
      a === 'cabeceira_estofada+cama_bau_planejada' ||
      a === 'espelheira_armario+gabinete_banheiro'
    );
  };

  const lowCounterTypes = new Set([
    'balcao_pia', 'balcao_gavetas', 'balcao_cooktop', 'balcao_canto_L', 'balcao_lava_loucas', 'rack_suspenso',
    'bancada_estudo', 'estacao_trabalho_L', 'criado_mudo', 'gabinete_banheiro',
    'bancada_tanque_maquina', 'balcao_churrasqueira', 'mesa_retratil', 'balcao_atendimento_comercial',
  ]);

  const modules: ProposedCabinetModule[] = [];
  for (const raw of planJson.modules) {
    if (!raw || !raw.type || !VALID_MODULE_TYPES.has(String(raw.type).trim())) continue;
    const mtype = String(raw.type).trim() as ModuleArchetype;
    let wall = String(raw.wall || 'back').trim().toLowerCase() as 'back' | 'left' | 'right' | 'center';
    if (!['back', 'left', 'right', 'center'].includes(wall)) wall = 'back';

    const maxSpan = wall === 'back' || wall === 'center' ? widthCm : Math.min(280, depthCm);
    let xCm = Math.round(clamp(Number(raw.xCm ?? 0), 0, Math.max(0, maxSpan - 35)));
    let wCm = Math.round(clamp(Number(raw.widthCm ?? 90), 35, maxSpan - xCm));
    const yCm = Math.round(clamp(Number(raw.yCm ?? 0), 0, Math.max(0, heightCm - 35)));
    let hCm = Math.round(clamp(Number(raw.heightCm ?? 86), 25, Math.max(25, heightCm - yCm)));
    const dCm = Math.round(clamp(Number(raw.depthCm ?? 58), 6, 205));
    const zCm = wall === 'center' ? Math.round(clamp(Number(raw.zCm ?? 155), 120, Math.max(130, depthCm - 80))) : undefined;

    if (wall === 'left' && modules.some(m => m.wall === 'back' && m.xCm < 62) && xCm < 64) {
      xCm = 64;
      wCm = Math.min(wCm, Math.max(35, maxSpan - xCm));
    } else if (wall === 'right' && modules.some(m => m.wall === 'back' && (m.xCm + m.widthCm) > widthCm - 62) && xCm < 64) {
      xCm = 64;
      wCm = Math.min(wCm, Math.max(35, maxSpan - xCm));
    }

    const wallDoors = obstacles.filter(o => o.wall === wall && o.type === 'door');
    const wallWindows = obstacles.filter(o => o.wall === wall && o.type === 'window');

    if (wall === 'back' && wallDoors.some(d => overlaps1D(xCm, xCm + wCm, d.xStartCm, d.xEndCm, 4))) continue;
    if ((wall === 'left' || wall === 'right') && wallDoors.length > 0 && xCm < 120) {
      xCm = 125;
      wCm = Math.min(wCm, maxSpan - xCm);
      if (wCm < 40) continue;
    }

    if (wall === 'back') {
      for (const w of wallWindows) {
        if (overlaps1D(xCm, xCm + wCm, w.xStartCm, w.xEndCm, 4) && overlaps1D(yCm, yCm + hCm, w.yBottomCm, w.yTopCm, 4)) {
          if (lowCounterTypes.has(mtype) && yCm < 50 && w.yBottomCm >= 72) {
            hCm = Math.min(hCm, w.yBottomCm - 4);
          } else {
            const rightAvail = widthCm - (w.xEndCm + 3);
            const leftAvail = w.xStartCm - 3;
            if (rightAvail >= 55 && rightAvail >= leftAvail) {
              xCm = w.xEndCm + 3;
              wCm = Math.min(wCm, rightAvail);
            } else if (leftAvail >= 55) {
              wCm = Math.min(wCm, leftAvail);
              xCm = Math.max(0, leftAvail - wCm);
            } else {
              wCm = 0;
            }
          }
        }
      }
    }
    if (wCm < 35) continue;

    const hasCollision = (candX: number, candW: number) =>
      modules.some(
        m => m.wall === wall &&
        !isLayeredOk(mtype, m.type) &&
        overlaps1D(candX, candX + candW, m.xCm, m.xCm + m.widthCm, 2) &&
        overlaps1D(yCm, yCm + hCm, m.yCm, m.yCm + m.heightCm, 2)
      );

    if (hasCollision(xCm, wCm)) {
      if (wall === 'back' || wall === 'left' || wall === 'right') {
        let placed = false;
        for (let stepX = 0; stepX <= Math.max(0, maxSpan - 45); stepX += 10) {
          const candW = Math.min(wCm, maxSpan - stepX);
          if (candW < 45) break;
          const hitsDoor = wall === 'back' && wallDoors.some(d => overlaps1D(stepX, stepX + candW, d.xStartCm, d.xEndCm, 4));
          const hitsWin = wall === 'back' && wallWindows.some(
            w => overlaps1D(stepX, stepX + candW, w.xStartCm, w.xEndCm, 4) && overlaps1D(yCm, yCm + hCm, w.yBottomCm, w.yTopCm, 4)
          );
          if (!hitsDoor && !hitsWin && !hasCollision(stepX, candW)) {
            xCm = stepX;
            wCm = candW;
            placed = true;
            break;
          }
        }
        if (!placed) continue;
      } else {
        continue;
      }
    }

    const mod: ProposedCabinetModule = {
      id: `mod_${modules.length + 1}`,
      type: mtype,
      label: String(raw.label || mtype),
      wall,
      xCm,
      yCm,
      widthCm: wCm,
      heightCm: hCm,
      depthCm: dCm,
      doorsCount: Math.round(clamp(Number(raw.doorsCount ?? 2), 0, 6)),
      drawersCount: Math.round(clamp(Number(raw.drawersCount ?? 0), 0, 8)),
      hasLed: Boolean(raw.hasLed),
    };
    if (zCm !== undefined) mod.zCm = zCm;
    modules.push(mod);
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
      perception: perceptionEngine,
      architect: architectEngine,
    },
  };
}

export async function analyzeEmptyRoomPhoto(
  req: AnalyzeRoomRequest,
  onProgress?: (msg: string, pct: number) => void
): Promise<RoomAnalysisResult> {
  const endpoints = getBackendEndpoints();
  const activeToken = (req.hfToken || getStoredHfToken() || '').trim();
  const engineMode = req.engineMode || 'auto';

  for (const ep of endpoints) {
    try {
      if (onProgress) onProgress('Conectando ao backend local / Hugging Face AI...', 20);
      const res = await fetch(ep, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: req.imageDataUrl,
          roomType: req.roomType,
          referenceType: req.referenceType,
          referenceValueCm: req.referenceValueCm,
          requirements: req.requirements,
          hfToken: activeToken || undefined,
          engineMode,
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
      } else if (res.status === 502 || res.status === 400) {
        const errBody = await res.json().catch(() => ({}));
        if (errBody?.error) {
          throw new Error(errBody.error);
        }
      }
    } catch (e: any) {
      if (e instanceof Error && !String(e.message).includes('fetch') && !String(e.message).includes('NetworkError') && !String(e.message).includes('Failed to')) {
        throw e;
      }
      console.warn(`[RoomAnalyzer] Backend ${ep} unreachable, trying next...`, e);
    }
  }

  return analyzeViaDirectHuggingFace(
    { ...req, hfToken: activeToken, engineMode },
    onProgress
  );
}
