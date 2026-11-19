import * as THREE from 'three';
import {
  CabinetryQuoteResult,
  ProposedCabinetModule,
} from '../data/pricingCatalog';
import { RoomAnalysisResult } from './roomAnalyzerService';

export const SHEET_LENGTH_MM = 2750;
export const SHEET_WIDTH_MM = 1850;
export const SHEET_MARGIN_MM = 15;
export const SAW_KERF_MM = 8;

export interface ManufacturingPart {
  moduleCode: string;
  moduleLabel: string;
  wallPt: string;
  partName: string;
  qty: number;
  lengthMm: number;
  widthMm: number;
  thicknessMm: number;
  edgeC1: string;
  edgeC2: string;
  edgeL1: string;
  edgeL2: string;
  grainDirection: 'Comprimento (Veio)' | 'Livre';
  mdfLabel: string;
  mdfSku: string;
  edgeSku: string;
  machiningNote: string;
}

export interface HardwareBomRow {
  category: string;
  item: string;
  sku: string;
  qty: number;
  unit: string;
  spec: string;
}

export interface ManufacturingPlan {
  parts: ManufacturingPart[];
  hardwareBom: HardwareBomRow[];
  summary: {
    totalPieceCount: number;
    totalArea1518M2: number;
    totalArea6M2: number;
    totalEdgeBandingM: number;
    sheetDimensionsMm: string;
    sheets1518Count: number;
    sheets6Count: number;
  };
}

const WALL_LABELS_PT: Record<string, string> = {
  back: 'Fundo',
  left: 'Esquerda',
  right: 'Direita',
  center: 'Centro / Ilha',
};

const PLINTH_120_TYPES = new Set([
  'balcao_pia',
  'balcao_gavetas',
  'balcao_cooktop',
  'balcao_lava_loucas',
  'balcao_canto_L',
  'balcao_churrasqueira',
  'bancada_tanque_maquina',
  'torre_quente',
  'ilha_gourmet',
  'aparador_buffet',
]);

const PLINTH_80_TYPES = new Set([
  'cristaleira_vidro',
  'bar_adega',
  'guarda_roupa_abrir',
  'guarda_roupa_correr',
  'closet_cabideiro_aberto',
  'armario_vassoureiro',
]);

const STONE_TOP_TYPES = new Set([
  'balcao_pia',
  'balcao_cooktop',
  'balcao_lava_loucas',
  'gabinete_banheiro',
  'bancada_tanque_maquina',
  'balcao_churrasqueira',
  'ilha_gourmet',
]);

function getPlinthHeightMm(modType: string): number {
  if (PLINTH_120_TYPES.has(modType)) return 120;
  if (PLINTH_80_TYPES.has(modType)) return 80;
  if (modType === 'balcao_atendimento_comercial') return 60;
  if (modType === 'criado_mudo') return 40;
  return 0;
}

function getStoneDeductMm(modType: string): number {
  if (!STONE_TOP_TYPES.has(modType)) return 0;
  return modType === 'ilha_gourmet' ? 35 : 32;
}

function getCarcassSideThicknessMm(quote: CabinetryQuoteResult): number {
  return quote.styleOptions.thicknessMode === '18mm' ? 18 : 15;
}

function isVisibleFrontMaterialModule(modType: string): boolean {
  return (
    modType === 'estante_nichos' ||
    modType === 'closet_cabideiro_aberto' ||
    modType === 'sapateira_prateleiras' ||
    modType === 'bar_adega' ||
    modType === 'bancada_estudo' ||
    modType === 'estacao_trabalho_L' ||
    modType === 'penteadeira_camarim' ||
    modType === 'balcao_atendimento_comercial'
  );
}

function roundDimMm(val: number): number {
  return Math.max(40, Math.round(val));
}

function makePartFactory(
  moduleCode: string,
  mod: ProposedCabinetModule,
  quote: CabinetryQuoteResult
) {
  const wallPt = WALL_LABELS_PT[mod.wall] || 'Fundo';
  const useFrontMdfForBody = isVisibleFrontMaterialModule(mod.type);
  const bodyFinish = useFrontMdfForBody ? quote.frontFinish : quote.carcassFinish;
  const frontFinish = quote.frontFinish;
  const edgeBody = bodyFinish.fitaCod || 'FITA-22MM';
  const edgeFront = frontFinish.fitaCod || 'FITA-22MM';

  return {
    body(
      partName: string,
      qty: number,
      lengthMm: number,
      widthMm: number,
      thicknessMm: number,
      edges: [boolean, boolean, boolean, boolean],
      machiningNote: string = ''
    ): ManufacturingPart {
      const len = roundDimMm(lengthMm);
      const wid = roundDimMm(widthMm);
      return {
        moduleCode,
        moduleLabel: mod.label,
        wallPt,
        partName,
        qty,
        lengthMm: len,
        widthMm: wid,
        thicknessMm,
        edgeC1: edges[0] ? 'Sim' : 'Não',
        edgeC2: edges[1] ? 'Sim' : 'Não',
        edgeL1: edges[2] ? 'Sim' : 'Não',
        edgeL2: edges[3] ? 'Sim' : 'Não',
        grainDirection: bodyFinish.grain ? 'Comprimento (Veio)' : 'Livre',
        mdfLabel: bodyFinish.label,
        mdfSku: thicknessMm === 6 ? bodyFinish.cod6 : bodyFinish.cod15,
        edgeSku: thicknessMm === 6 ? '-' : edgeBody,
        machiningNote,
      };
    },
    front(
      partName: string,
      qty: number,
      lengthMm: number,
      widthMm: number,
      thicknessMm: number,
      edges: [boolean, boolean, boolean, boolean],
      machiningNote: string = ''
    ): ManufacturingPart {
      const len = roundDimMm(lengthMm);
      const wid = roundDimMm(widthMm);
      return {
        moduleCode,
        moduleLabel: mod.label,
        wallPt,
        partName,
        qty,
        lengthMm: len,
        widthMm: wid,
        thicknessMm,
        edgeC1: edges[0] ? 'Sim' : 'Não',
        edgeC2: edges[1] ? 'Sim' : 'Não',
        edgeL1: edges[2] ? 'Sim' : 'Não',
        edgeL2: edges[3] ? 'Sim' : 'Não',
        grainDirection: frontFinish.grain ? 'Comprimento (Veio)' : 'Livre',
        mdfLabel: frontFinish.label,
        mdfSku: thicknessMm === 6 ? quote.carcassFinish.cod6 : frontFinish.cod15,
        edgeSku: edgeFront,
        machiningNote,
      };
    },
  };
}

function getFrontMachiningLabel(quote: CabinetryQuoteResult, modType: string): string {
  const style = quote.styleOptions.frontStyle;
  if (modType === 'cristaleira_vidro' || (style === 'vidro_reflecta' && (modType.includes('aereo') || modType.includes('guarda_roupa')))) {
    return 'Quadro Perfil Aluminio + Vidro Reflecta';
  }
  if (modType === 'espelheira_armario') return 'Porta MDF + Espelho Prata 4mm Colado';
  if (modType === 'guarda_roupa_correr') return 'Porta de Correr - Usinar Roldana / Trilho';
  if (style === 'cava45') return 'Usinagem Cava 45 graus na Borda';
  if (style === 'provencal') return 'Fresado CNC Moldura Provencal';
  if (quote.styleOptions.handleStyle === 'fecho_toque') return 'Sem Puxador - Usar Fecho Toque';
  return 'Furo Caneco 35mm Padrao';
}

function appendDrawerParts(
  parts: ManufacturingPart[],
  factory: ReturnType<typeof makePartFactory>,
  drawersCount: number,
  openWidthMm: number,
  zoneHeightMm: number,
  depthMm: number,
  tMm: number
): void {
  if (drawersCount <= 0) return;
  const frontH = Math.max(120, Math.round(zoneHeightMm / drawersCount) - 4);
  const frontW = Math.max(180, openWidthMm - 6);
  const boxH = Math.max(90, Math.min(200, frontH - 45));
  const boxDepth = Math.max(250, depthMm - 70);
  const innerClearW = Math.max(120, openWidthMm - tMm * 2 - 26);

  parts.push(
    factory.front('Frente Gaveta', drawersCount, frontW, frontH, tMm, [true, true, true, true], 'Fixacao Minifix / Parafuso Frontal')
  );
  parts.push(
    factory.body('Lateral Gaveta', drawersCount * 2, boxDepth, boxH, tMm, [true, false, false, false], 'Rebaixo 6mm para Fundo')
  );
  parts.push(
    factory.body('Traseira / Contra-Frente Gaveta', drawersCount * 2, innerClearW, boxH, tMm, [true, false, false, false], 'Corredica Lateral / Oculta')
  );
  parts.push(
    factory.body('Fundo Gaveta 6mm', drawersCount, Math.max(120, innerClearW - 12), Math.max(240, boxDepth - 12), 6, [false, false, false, false], 'Encaixe Canal 6mm')
  );
}

function addThickeningOverlayIfNeeded(
  parts: ManufacturingPart[],
  factory: ReturnType<typeof makePartFactory>,
  wMm: number,
  bodyHMm: number,
  dMm: number,
  quote: CabinetryQuoteResult
): void {
  if (quote.styleOptions.thicknessMode !== '25mm_engrossado') return;
  parts.push(
    factory.front('Tamponamento Lateral Engrossado', 2, bodyHMm, dMm + 20, 25, [true, true, true, true], 'Engrossado 25mm Estrutural')
  );
  parts.push(
    factory.front('Tamponamento Topo Engrossado', 1, wMm + 50, dMm + 20, 25, [true, true, true, true], 'Tamponamento Superior 25mm')
  );
}

function buildModuleManufacturingParts(
  idx: number,
  mod: ProposedCabinetModule,
  quote: CabinetryQuoteResult
): ManufacturingPart[] {
  const code = `M${String(idx + 1).padStart(2, '0')}`;
  const wMm = mod.widthCm * 10;
  const hMm = mod.heightCm * 10;
  const dMm = mod.depthCm * 10;
  const tMm = getCarcassSideThicknessMm(quote);
  const f = makePartFactory(code, mod, quote);
  const parts: ManufacturingPart[] = [];

  if (mod.type === 'painel_tv_ripado' || mod.type === 'painel_cabeceira') {
    parts.push(f.body('Chapa Base Painel', 1, hMm, wMm, tMm, [true, true, true, true], 'Base Estrutural Ripado'));
    const slatCount = Math.max(4, Math.floor(wMm / 48));
    parts.push(f.front('Ripa Vertical 32mm', slatCount, hMm, 32, 18, [true, true, true, false], 'Colagem + Pinagem / Ripa 32mm'));
    return parts;
  }

  if (mod.type === 'painel_muxarabi') {
    parts.push(f.front('Quadro Perimetral Muxarabi', 2, hMm, 60, 18, [true, true, true, true], 'Montante Lateral'));
    parts.push(f.front('Travessa Horizontal Muxarabi', 2, wMm - 120, 60, 18, [true, true, true, true], 'Travessa Quadro'));
    parts.push(f.front('Tela Muxarabi CNC', 1, hMm - 80, wMm - 80, 15, [false, false, false, false], 'Usinagem CNC Vazada Reticulada'));
    return parts;
  }

  if (mod.type === 'cabeceira_estofada' || mod.type === 'fechamento_teto') {
    parts.push(f.front(mod.label, 1, hMm, wMm, tMm, [true, true, true, true], mod.type === 'cabeceira_estofada' ? 'Base Estofamento Espuma/Linho' : 'Sanca / Fechamento em L ate Teto'));
    return parts;
  }

  if (mod.type === 'cama_bau_planejada') {
    const baseH = 360;
    parts.push(f.body('Lateral Base Cama Bau', 2, dMm, baseH, tMm, [true, true, false, false], 'Reforco Estrutural Interno'));
    parts.push(f.body('Cabeca / Peseira Base Bau', 2, wMm - 2 * tMm, baseH, tMm, [true, true, false, false], ''));
    parts.push(f.body('Tampo Estrado Articulado', 1, dMm - 40, wMm - 40, 18, [true, true, true, true], 'Usinar Amortecedor Bau'));
    parts.push(f.front('Frente Gaveta / Sapateira Bau', 2, Math.round(wMm * 0.44), baseH - 50, tMm, [true, true, true, true], ''));
    return parts;
  }

  if (mod.type === 'balcao_canto_L' || mod.type === 'aereo_canto_L') {
    const plinthH = getPlinthHeightMm(mod.type);
    const bodyH = Math.max(300, hMm - plinthH - getStoneDeductMm(mod.type));
    const arm1 = Math.max(450, wMm);
    const arm2 = Math.max(450, Math.round(wMm * 0.72));
    parts.push(f.body('Lateral Externa Canto L', 2, bodyH, dMm, tMm, [true, false, false, false], ''));
    parts.push(f.body('Base / Topo Braco Principal L', 2, arm1 - 2 * tMm, dMm, tMm, [true, false, false, false], 'Corte 90 graus Canto'));
    parts.push(f.body('Base / Topo Retorno L', 2, Math.max(300, arm2 - dMm - tMm), dMm, tMm, [true, false, false, false], 'Retorno em L'));
    parts.push(f.body('Prateleira Interna L', mod.shelvesCount ?? 1, arm1 - 2 * tMm - 4, dMm - 35, tMm, [true, false, false, false], ''));
    parts.push(f.body('Fundo Canto L 6mm', 2, bodyH - 10, Math.max(400, Math.round(arm1 * 0.7)), 6, [false, false, false, false], ''));
    parts.push(f.front('Porta Articulada Canto L', 2, bodyH - 4, Math.max(300, Math.round((arm1 - dMm) * 0.92)), tMm, [true, true, true, true], 'Dobradica Canto 165 graus + 135 graus'));
    addThickeningOverlayIfNeeded(parts, f, arm1, bodyH, dMm, quote);
    return parts;
  }

  if (mod.type === 'nicho_geladeira') {
    const fridgeH = Math.min(hMm - 360, 1880);
    const upperH = Math.max(300, hMm - fridgeH);
    parts.push(f.front('Lateral Torres Geladeira', 2, hMm, dMm, tMm, [true, false, true, false], 'Tamponamento Lateral Total'));
    parts.push(f.body('Base / Topo Armario Superior', 2, wMm - 2 * tMm, dMm, tMm, [true, false, false, false], ''));
    parts.push(f.body('Fundo Superior 6mm', 1, upperH - 10, wMm - 10, 6, [false, false, false, false], ''));
    parts.push(f.front('Porta Aerea Sobre Geladeira', 2, upperH - 4, Math.round((wMm - 2 * tMm) / 2) - 4, tMm, [true, true, true, true], getFrontMachiningLabel(quote, mod.type)));
    return parts;
  }

  // Padrão universal de caixaria (cozinha, banheiro, dormitório, escritório, lavanderia, área gourmet)
  const plinthH = getPlinthHeightMm(mod.type);
  const stoneDeduct = getStoneDeductMm(mod.type);
  const boxD = mod.type === 'ilha_gourmet' ? Math.round(dMm * 0.66) : dMm;
  const bodyH = Math.max(220, hMm - plinthH - stoneDeduct);
  const innerW = Math.max(120, wMm - 2 * tMm);

  if (plinthH > 0) {
    parts.push(f.body('Rodape Frontal / Fundo Recuado', 2, wMm - 20, plinthH, tMm, [true, false, false, false], 'Rodape Estrutural / Alvenaria'));
  }

  parts.push(f.body('Lateral Direita / Esquerda', 2, bodyH, boxD, tMm, [true, false, false, false], 'Rasgo Fundo 6mm a 18mm'));
  parts.push(f.body('Base / Topo Caixaria', 2, innerW, boxD, tMm, [true, false, false, false], 'Rasgo Fundo 6mm'));

  const shelves = mod.shelvesCount ?? (mod.heightCm > 150 ? 4 : mod.heightCm > 90 ? 2 : 1);
  if (shelves > 0) {
    parts.push(f.body('Prateleira Interna', shelves, innerW - 2, Math.max(160, boxD - 30), tMm, [true, false, false, false], 'Recuo 30mm Dobradica/Porta'));
  }

  parts.push(f.body('Fundo 6mm', 1, bodyH - 10, wMm - 10, 6, [false, false, false, false], 'Encaixe Canal 6mm'));

  if (mod.doorsCount > 0) {
    const doorW = Math.max(180, Math.round((wMm - 4 * mod.doorsCount) / mod.doorsCount));
    const doorH = mod.type === 'torre_quente' ? Math.max(300, bodyH - 1560) : bodyH - 4;
    if (mod.type === 'aereo_basculante') {
      const flipH = Math.max(220, Math.round(bodyH / mod.doorsCount) - 4);
      parts.push(f.front('Porta Basculante', mod.doorsCount, innerW - 4, flipH, tMm, [true, true, true, true], 'Usinar Pistao Gas Horizontal'));
    } else {
      parts.push(f.front('Porta Frontal', mod.doorsCount, doorH, doorW, tMm, [true, true, true, true], getFrontMachiningLabel(quote, mod.type)));
    }
  }

  if (mod.drawersCount > 0) {
    const drawerZone = mod.type === 'torre_quente' ? 640 : mod.type === 'penteadeira_camarim' ? 160 : bodyH;
    appendDrawerParts(parts, f, mod.drawersCount, wMm, drawerZone, boxD, tMm);
  }

  addThickeningOverlayIfNeeded(parts, f, wMm, bodyH, boxD, quote);
  return parts;
}

export function buildManufacturingPlan(
  analysis: RoomAnalysisResult,
  quote: CabinetryQuoteResult
): ManufacturingPlan {
  const parts: ManufacturingPart[] = [];
  let pistonsCount = 0;
  let touchLatchCount = 0;
  let handleMeters = 0;
  let rodsCount = 0;
  let sliding2Count = 0;
  let sliding3Count = 0;
  let stoneCountertopsCount = 0;

  analysis.modules.forEach((mod, idx) => {
    parts.push(...buildModuleManufacturingParts(idx, mod, quote));
    const hMeters = mod.heightCm / 100;
    if (STONE_TOP_TYPES.has(mod.type)) stoneCountertopsCount += 1;
    if (mod.type === 'aereo_basculante' || mod.type === 'aereo_canto_L') {
      pistonsCount += Math.max(2, mod.doorsCount * 2);
    }
    if (mod.type === 'guarda_roupa_correr') {
      if (mod.doorsCount >= 3) sliding3Count += 1;
      else sliding2Count += 1;
      handleMeters += mod.doorsCount * hMeters;
    } else if (quote.styleOptions.handleStyle === 'fecho_toque') {
      touchLatchCount += mod.doorsCount + mod.drawersCount;
    } else {
      handleMeters += (mod.doorsCount + mod.drawersCount) * 0.42;
    }
    if (mod.type === 'closet_cabideiro_aberto' || mod.type === 'guarda_roupa_correr' || mod.type === 'guarda_roupa_abrir') {
      rodsCount += Math.max(1, Math.round(mod.widthCm / 95));
    }
  });

  let totalPieceCount = 0;
  let area1518M2 = 0;
  let area6M2 = 0;
  let edgeBySku: Record<string, { label: string; meters: number }> = {};

  for (const p of parts) {
    totalPieceCount += p.qty;
    const areaM2 = ((p.lengthMm * p.widthMm) / 1_000_000) * p.qty;
    if (p.thicknessMm === 6) area6M2 += areaM2;
    else area1518M2 += areaM2;

    if (p.edgeSku && p.edgeSku !== '-') {
      let linearMm = 0;
      if (p.edgeC1 === 'Sim') linearMm += p.lengthMm;
      if (p.edgeC2 === 'Sim') linearMm += p.lengthMm;
      if (p.edgeL1 === 'Sim') linearMm += p.widthMm;
      if (p.edgeL2 === 'Sim') linearMm += p.widthMm;
      if (linearMm > 0) {
        if (!edgeBySku[p.edgeSku]) {
          edgeBySku[p.edgeSku] = { label: p.mdfLabel, meters: 0 };
        }
        edgeBySku[p.edgeSku].meters += (linearMm / 1000) * p.qty;
      }
    }
  }

  const totalEdgeBandingM = Number(
    (Object.values(edgeBySku).reduce((acc, row) => acc + row.meters, 0) * 1.1).toFixed(1)
  );

  const hw = quote.hardware;
  const hardwareBom: HardwareBomRow[] = [];
  if (quote.sheets15CarcassCount > 0) {
    hardwareBom.push({ category: 'Chapa MDF', item: quote.carcassFinish.name15, sku: quote.carcassFinish.cod15, qty: quote.sheets15CarcassCount, unit: 'Chapa 2750x1850', spec: `Caixaria ${getCarcassSideThicknessMm(quote)}mm` });
  }
  if (quote.sheets15FrontCount > 0) {
    hardwareBom.push({ category: 'Chapa MDF', item: quote.frontFinish.name15, sku: quote.frontFinish.cod15, qty: quote.sheets15FrontCount, unit: 'Chapa 2750x1850', spec: `Frentes ${quote.styleOptions.thicknessMode}` });
  }
  if (quote.sheets6Count > 0) {
    hardwareBom.push({ category: 'Chapa Fundo', item: quote.carcassFinish.name6, sku: quote.carcassFinish.cod6, qty: quote.sheets6Count, unit: 'Chapa 2750x1850', spec: 'Fundos 6mm' });
  }
  for (const [sku, info] of Object.entries(edgeBySku)) {
    hardwareBom.push({ category: 'Fita de Borda', item: `Fita 22x0.45mm ${info.label}`, sku, qty: Math.ceil(info.meters * 1.1), unit: 'm (c/ 10% quebra)', spec: 'Coladeira CNC' });
  }
  if (quote.hingesCount > 0) hardwareBom.push({ category: 'Ferragem', item: 'Dobradica Caneco 35mm', sku: hw.hingeCod, qty: quote.hingesCount, unit: 'un', spec: hw.label });
  if (quote.cornerHingesCount > 0) hardwareBom.push({ category: 'Ferragem', item: 'Dobradica Canto L 165 graus', sku: hw.cornerHingeCod, qty: quote.cornerHingesCount, unit: 'un', spec: hw.label });
  if (quote.slidesCount > 0) hardwareBom.push({ category: 'Ferragem', item: 'Par Corredica Gaveta', sku: hw.slideCod, qty: quote.slidesCount, unit: 'par', spec: hw.label });
  if (pistonsCount > 0) hardwareBom.push({ category: 'Ferragem', item: 'Pistao a Gas Basculante', sku: hw.pistonCod, qty: pistonsCount, unit: 'un', spec: 'Forca 80N/100N' });
  if (sliding2Count > 0) hardwareBom.push({ category: 'Ferragem', item: 'Kit Porta de Correr 2 Portas', sku: hw.sliding2Cod, qty: sliding2Count, unit: 'kit', spec: 'Trilho + Roldana' });
  if (sliding3Count > 0) hardwareBom.push({ category: 'Ferragem', item: 'Kit Porta de Correr 3 Portas', sku: hw.sliding3Cod, qty: sliding3Count, unit: 'kit', spec: 'Trilho + Roldana' });
  const handleBars = quote.styleOptions.handleStyle === 'fecho_toque' ? 0 : Math.ceil(handleMeters / 3);
  if (handleBars > 0) {
    const barSku = quote.styleOptions.handleStyle === 'perfil_15' ? hw.handleBar15Cod : hw.handleBarCod;
    hardwareBom.push({ category: 'Perfil Puxador', item: `Barra Puxador 3m (${quote.styleOptions.handleStyle})`, sku: barSku, qty: handleBars, unit: 'barra 3m', spec: 'Aluminio Anodizado' });
  }
  if (touchLatchCount > 0) hardwareBom.push({ category: 'Ferragem', item: 'Fecho Toque Magnetico (Tip-On)', sku: 'FECHO-TOQUE-STD', qty: touchLatchCount, unit: 'un', spec: 'Sem Puxador' });
  if (rodsCount > 0) hardwareBom.push({ category: 'Ferragem', item: 'Tubo Cabideiro + Suportes', sku: hw.rodCod, qty: rodsCount, unit: 'kit', spec: 'Guarda-Roupa / Closet' });
  if (stoneCountertopsCount > 0) hardwareBom.push({ category: 'Marmoraria', item: 'Tampo Pedra / Quartzo / Pia', sku: 'TERCEIRO-PEDRA', qty: stoneCountertopsCount, unit: 'bancada', spec: 'Nao incluído na marcenaria' });

  return {
    parts,
    hardwareBom,
    summary: {
      totalPieceCount,
      totalArea1518M2: Number(area1518M2.toFixed(2)),
      totalArea6M2: Number(area6M2.toFixed(2)),
      totalEdgeBandingM,
      sheetDimensionsMm: `${SHEET_LENGTH_MM}x${SHEET_WIDTH_MM}`,
      sheets1518Count: quote.sheets15Count,
      sheets6Count: quote.sheets6Count,
    },
  };
}

function csvRow(cells: Array<string | number>): string {
  return cells.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';');
}

export function generateManufacturingCSV(
  analysis: RoomAnalysisResult,
  quote: CabinetryQuoteResult
): string {
  const plan = buildManufacturingPlan(analysis, quote);
  const lines: string[] = [];

  lines.push(csvRow(['PLANO DE CORTE CNC / CORTECLOUD (MEDIDAS EM MILIMETROS)', `Ambiente: ${analysis.roomType.toUpperCase()}`, `Chapa Padrao: ${plan.summary.sheetDimensionsMm}mm`]));
  lines.push(csvRow([
    'Cod_Mod', 'Modulo', 'Parede', 'Peca', 'Qtd',
    'Comp_mm', 'Larg_mm', 'Esp_mm',
    'Fita_C1', 'Fita_C2', 'Fita_L1', 'Fita_L2',
    'Veio', 'Material_MDF', 'Cod_SKU_MDF', 'Cod_Fita', 'Usinagem_Observacao',
  ]));

  for (const p of plan.parts) {
    lines.push(csvRow([
      p.moduleCode, p.moduleLabel, p.wallPt, p.partName, p.qty,
      p.lengthMm, p.widthMm, p.thicknessMm,
      p.edgeC1, p.edgeC2, p.edgeL1, p.edgeL2,
      p.grainDirection, p.mdfLabel, p.mdfSku, p.edgeSku, p.machiningNote,
    ]));
  }

  lines.push('');
  lines.push(csvRow(['LISTA DE MATERIAIS, CHAPAS, FITAS E FERRAGENS (BOM)']));
  lines.push(csvRow(['Categoria', 'Item', 'SKU', 'Quantidade', 'Unidade', 'Especificacao']));
  for (const b of plan.hardwareBom) {
    lines.push(csvRow([b.category, b.item, b.sku, b.qty, b.unit, b.spec]));
  }

  lines.push('');
  lines.push(csvRow(['RESUMO', `Total Pecas: ${plan.summary.totalPieceCount}`, `Area 15/18mm: ${plan.summary.totalArea1518M2} m2`, `Area 6mm: ${plan.summary.totalArea6M2} m2`, `Fita Total (+10%): ${plan.summary.totalEdgeBandingM} m`]));

  return '\uFEFF' + lines.join('\r\n');
}

export function exportManufacturingCSVDownload(
  analysis: RoomAnalysisResult,
  quote: CabinetryQuoteResult
): void {
  const csv = generateManufacturingCSV(analysis, quote);
  downloadBlob(csv, 'text/csv;charset=utf-8', `83-ambientes-corte-cnc-${analysis.roomType}.csv`);
}

interface PlacedRect {
  sheetIdx: number;
  x: number;
  y: number;
  w: number;
  h: number;
  part: ManufacturingPart;
  unitNum: number;
}

function packPartsOnSheets(parts: ManufacturingPart[]): { placed: PlacedRect[]; sheetCount: number } {
  const usableW = SHEET_LENGTH_MM - SHEET_MARGIN_MM * 2;
  const usableH = SHEET_WIDTH_MM - SHEET_MARGIN_MM * 2;

  const flat: Array<{ part: ManufacturingPart; unitNum: number; w: number; h: number }> = [];
  for (const part of parts) {
    const pw = Math.min(usableW, Math.max(part.lengthMm, part.widthMm));
    const ph = Math.min(usableH, Math.min(part.lengthMm, part.widthMm));
    for (let q = 1; q <= part.qty; q++) {
      flat.push({ part, unitNum: q, w: pw, h: ph });
    }
  }
  flat.sort((a, b) => b.h - a.h || b.w - a.w);

  const placed: PlacedRect[] = [];
  let sheetIdx = 0;
  let curX = SHEET_MARGIN_MM;
  let curY = SHEET_MARGIN_MM;
  let shelfH = 0;

  for (const item of flat) {
    if (curX + item.w > SHEET_LENGTH_MM - SHEET_MARGIN_MM) {
      curX = SHEET_MARGIN_MM;
      curY += shelfH + SAW_KERF_MM;
      shelfH = 0;
    }
    if (curY + item.h > SHEET_WIDTH_MM - SHEET_MARGIN_MM) {
      sheetIdx += 1;
      curX = SHEET_MARGIN_MM;
      curY = SHEET_MARGIN_MM;
      shelfH = 0;
    }
    placed.push({ sheetIdx, x: curX, y: curY, w: item.w, h: item.h, part: item.part, unitNum: item.unitNum });
    curX += item.w + SAW_KERF_MM;
    shelfH = Math.max(shelfH, item.h);
  }

  return { placed, sheetCount: flat.length > 0 ? sheetIdx + 1 : 0 };
}

function dxfRectPolyline(layer: string, x: number, y: number, w: number, h: number): string {
  const pts: Array<[number, number]> = [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ];
  const verts = pts
    .map(([px, py]) => ['0', 'VERTEX', '8', layer, '10', px.toFixed(1), '20', py.toFixed(1), '30', '0.0'].join('\r\n'))
    .join('\r\n');
  return [
    '0', 'POLYLINE', '8', layer, '66', '1', '70', '1', '10', '0.0', '20', '0.0', '30', '0.0',
    verts,
    '0', 'SEQEND', '8', layer,
  ].join('\r\n');
}

function asciiDxf(raw: string): string {
  return raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\x20-\x7E]/g, ' ');
}

function dxfText(layer: string, x: number, y: number, height: number, text: string): string {
  return [
    '0', 'TEXT', '8', layer,
    '10', x.toFixed(1), '20', y.toFixed(1), '30', '0.0',
    '40', height.toFixed(1),
    '1', asciiDxf(text),
  ].join('\r\n');
}

export function generateManufacturingDXF(
  analysis: RoomAnalysisResult,
  quote: CabinetryQuoteResult
): string {
  const plan = buildManufacturingPlan(analysis, quote);
  const thickParts = plan.parts.filter((p) => p.thicknessMm !== 6);
  const backParts = plan.parts.filter((p) => p.thicknessMm === 6);

  const thickPack = packPartsOnSheets(thickParts);
  const backPack = packPartsOnSheets(backParts);

  const entities: string[] = [];
  const appendPackedGroup = (
    pack: { placed: PlacedRect[]; sheetCount: number },
    layer: string,
    titlePrefix: string,
    baseYOffset: number
  ) => {
    for (let s = 0; s < pack.sheetCount; s++) {
      const sx = s * (SHEET_LENGTH_MM + 250);
      const sy = baseYOffset;
      entities.push(dxfRectPolyline('CHAPAS_2750x1850', sx, sy, SHEET_LENGTH_MM, SHEET_WIDTH_MM));
      entities.push(dxfText('COTAS_TEXTO', sx, sy + SHEET_WIDTH_MM + 35, 36, `${titlePrefix} - Chapa ${s + 1} (2750x1850mm)`));
    }
    for (const r of pack.placed) {
      const ox = r.sheetIdx * (SHEET_LENGTH_MM + 250) + r.x;
      const oy = baseYOffset + r.y;
      entities.push(dxfRectPolyline(layer, ox, oy, r.w, r.h));
      const label = `${r.part.moduleCode} ${r.part.partName} (${r.w}x${r.h}x${r.part.thicknessMm}mm)`;
      const textH = Math.max(10, Math.min(22, r.h * 0.16));
      entities.push(dxfText('COTAS_TEXTO', ox + 8, oy + Math.max(8, r.h * 0.45), textH, label.slice(0, 42)));
    }
  };

  appendPackedGroup(thickPack, 'PECAS_CORTE_15_18', 'MDF 15/18mm', 0);
  if (backPack.sheetCount > 0) {
    appendPackedGroup(backPack, 'PECAS_CORTE_6MM', 'MDF 6mm (Fundos)', -(SHEET_WIDTH_MM + 450));
  }

  const layersTable = [
    ['CHAPAS_2750x1850', '8'],
    ['PECAS_CORTE_15_18', '3'],
    ['PECAS_CORTE_6MM', '5'],
    ['COTAS_TEXTO', '7'],
  ]
    .map(([name, color]) => ['0', 'LAYER', '2', name, '70', '0', '62', color, '6', 'CONTINUOUS'].join('\r\n'))
    .join('\r\n');

  return [
    '0', 'SECTION', '2', 'HEADER',
    '9', '$ACADVER', '1', 'AC1009',
    '0', 'ENDSEC',
    '0', 'SECTION', '2', 'TABLES',
    '0', 'TABLE', '2', 'LAYER', '70', '4',
    layersTable,
    '0', 'ENDTAB',
    '0', 'ENDSEC',
    '0', 'SECTION', '2', 'ENTITIES',
    ...entities,
    '0', 'ENDSEC',
    '0', 'EOF',
  ].join('\r\n');
}

export function exportManufacturingDXFDownload(
  analysis: RoomAnalysisResult,
  quote: CabinetryQuoteResult
): void {
  const dxf = generateManufacturingDXF(analysis, quote);
  downloadBlob(dxf, 'application/dxf', `83-ambientes-corte-chapas-${analysis.roomType}.dxf`);
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function sanitizeId(raw: string, fallback: string): string {
  const clean = raw.replace(/[^A-Za-z0-9_.-]/g, '_');
  return clean && /^[A-Za-z_]/.test(clean) ? clean : `${fallback}_${clean}`;
}

export function generateColladaDAE(rootObject: THREE.Object3D, sceneName: string = '83_Ambientes'): string {
  rootObject.updateMatrixWorld(true);

  const materialsXml: string[] = [];
  const effectsXml: string[] = [];
  const geometriesXml: string[] = [];
  const matIdMap = new Map<THREE.Material, string>();
  const geoIdMap = new Map<THREE.BufferGeometry, string>();

  const getMaterialId = (mat: THREE.Material): string => {
    const existing = matIdMap.get(mat);
    if (existing) return existing;
    const idx = matIdMap.size + 1;
    const matId = `mat_${idx}`;
    const fxId = `fx_${idx}`;
    const std = mat as THREE.MeshStandardMaterial;
    const hexOverride = mat.userData?.exportColorHex;
    const c = hexOverride
      ? new THREE.Color(hexOverride)
      : std.color
      ? std.color
      : new THREE.Color(0xd9d4cb);
    const opacity = typeof std.opacity === 'number' ? std.opacity : 1.0;
    const label = escapeXml(sanitizeId(mat.name || `MDF_Material_${idx}`, 'Mat'));

    effectsXml.push(
      `    <effect id="${fxId}">\n` +
      `      <profile_COMMON>\n` +
      `        <technique sid="common">\n` +
      `          <phong>\n` +
      `            <diffuse><color>${c.r.toFixed(4)} ${c.g.toFixed(4)} ${c.b.toFixed(4)} ${opacity.toFixed(3)}</color></diffuse>\n` +
      `            <specular><color>0.15 0.15 0.15 1.0</color></specular>\n` +
      `            <shininess><float>24.0</float></shininess>\n` +
      `          </phong>\n` +
      `        </technique>\n` +
      `      </profile_COMMON>\n` +
      `    </effect>`
    );
    materialsXml.push(
      `    <material id="${matId}" name="${label}">\n` +
      `      <instance_effect url="#${fxId}"/>\n` +
      `    </material>`
    );
    matIdMap.set(mat, matId);
    return matId;
  };

  const getGeometryId = (geo: THREE.BufferGeometry, nameHint: string): string => {
    const existing = geoIdMap.get(geo);
    if (existing) return existing;
    const idx = geoIdMap.size + 1;
    const geoId = `geo_${idx}`;

    const posAttr = geo.getAttribute('position');
    const nrmAttr = geo.getAttribute('normal');
    const posArr: number[] = [];
    const nrmArr: number[] = [];

    for (let i = 0; i < posAttr.count; i++) {
      posArr.push(
        Number(posAttr.getX(i).toFixed(5)),
        Number(posAttr.getY(i).toFixed(5)),
        Number(posAttr.getZ(i).toFixed(5))
      );
      if (nrmAttr && i < nrmAttr.count) {
        nrmArr.push(
          Number(nrmAttr.getX(i).toFixed(5)),
          Number(nrmAttr.getY(i).toFixed(5)),
          Number(nrmAttr.getZ(i).toFixed(5))
        );
      } else {
        nrmArr.push(0, 1, 0);
      }
    }

    const triIndices: number[] = [];
    if (geo.index) {
      for (let i = 0; i < geo.index.count; i++) {
        triIndices.push(geo.index.getX(i));
      }
    } else {
      for (let i = 0; i < posAttr.count; i++) {
        triIndices.push(i);
      }
    }

    const triCount = Math.floor(triIndices.length / 3);
    const label = escapeXml(sanitizeId(nameHint || geoId, 'Mesh'));

    geometriesXml.push(
      `    <geometry id="${geoId}" name="${label}">\n` +
      `      <mesh>\n` +
      `        <source id="${geoId}_pos">\n` +
      `          <float_array id="${geoId}_pos_arr" count="${posArr.length}">${posArr.join(' ')}</float_array>\n` +
      `          <technique_common>\n` +
      `            <accessor source="#${geoId}_pos_arr" count="${posAttr.count}" stride="3">\n` +
      `              <param name="X" type="float"/><param name="Y" type="float"/><param name="Z" type="float"/>\n` +
      `            </accessor>\n` +
      `          </technique_common>\n` +
      `        </source>\n` +
      `        <source id="${geoId}_nrm">\n` +
      `          <float_array id="${geoId}_nrm_arr" count="${nrmArr.length}">${nrmArr.join(' ')}</float_array>\n` +
      `          <technique_common>\n` +
      `            <accessor source="#${geoId}_nrm_arr" count="${posAttr.count}" stride="3">\n` +
      `              <param name="X" type="float"/><param name="Y" type="float"/><param name="Z" type="float"/>\n` +
      `            </accessor>\n` +
      `          </technique_common>\n` +
      `        </source>\n` +
      `        <vertices id="${geoId}_vtx">\n` +
      `          <input semantic="POSITION" source="#${geoId}_pos"/>\n` +
      `        </vertices>\n` +
      `        <triangles count="${triCount}" material="mat_sym">\n` +
      `          <input semantic="VERTEX" source="#${geoId}_vtx" offset="0"/>\n` +
      `          <input semantic="NORMAL" source="#${geoId}_nrm" offset="0"/>\n` +
      `          <p>${triIndices.slice(0, triCount * 3).join(' ')}</p>\n` +
      `        </triangles>\n` +
      `      </mesh>\n` +
      `    </geometry>`
    );

    geoIdMap.set(geo, geoId);
    return geoId;
  };

  let nodeSeq = 0;
  const serializeNode = (obj: THREE.Object3D, indent: string): string => {
    nodeSeq += 1;
    const nodeId = `node_${nodeSeq}_${sanitizeId(obj.name || 'part', 'n')}`;
    const nodeName = escapeXml(obj.name || `Part_${nodeSeq}`);
    obj.updateMatrix();
    const e = obj.matrix.elements;
    const rowMajor = [
      e[0], e[4], e[8], e[12],
      e[1], e[5], e[9], e[13],
      e[2], e[6], e[10], e[14],
      e[3], e[7], e[11], e[15],
    ]
      .map((n) => Number(n.toFixed(6)))
      .join(' ');

    const inner: string[] = [];
    inner.push(`${indent}  <matrix sid="transform">${rowMajor}</matrix>`);

    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh;
      if (mesh.geometry && mesh.geometry.getAttribute('position')) {
        const geoId = getGeometryId(mesh.geometry, mesh.name);
        const primaryMat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
        const matId = getMaterialId(primaryMat);
        inner.push(
          `${indent}  <instance_geometry url="#${geoId}">\n` +
          `${indent}    <bind_material>\n` +
          `${indent}      <technique_common>\n` +
          `${indent}        <instance_material symbol="mat_sym" target="#${matId}"/>\n` +
          `${indent}      </technique_common>\n` +
          `${indent}    </bind_material>\n` +
          `${indent}  </instance_geometry>`
        );
      }
    }

    for (const child of obj.children) {
      inner.push(serializeNode(child, indent + '  '));
    }

    return `${indent}<node id="${escapeXml(nodeId)}" name="${nodeName}" type="NODE">\n${inner.join('\n')}\n${indent}</node>`;
  };

  const sceneNodesXml = rootObject.children.map((ch) => serializeNode(ch, '      ')).join('\n');

  return (
    `<?xml version="1.0" encoding="utf-8"?>\n` +
    `<COLLADA xmlns="http://www.collada.org/2005/11/COLLADASchema" version="1.4.1">\n` +
    `  <asset>\n` +
    `    <contributor><authoring_tool>83 Ambientes Planejados — Tensor &amp; Timber</authoring_tool></contributor>\n` +
    `    <unit name="meter" meter="1.0"/>\n` +
    `    <up_axis>Y_UP</up_axis>\n` +
    `  </asset>\n` +
    `  <library_effects>\n${effectsXml.join('\n')}\n  </library_effects>\n` +
    `  <library_materials>\n${materialsXml.join('\n')}\n  </library_materials>\n` +
    `  <library_geometries>\n${geometriesXml.join('\n')}\n  </library_geometries>\n` +
    `  <library_visual_scenes>\n` +
    `    <visual_scene id="Scene_Root" name="${escapeXml(sceneName)}">\n` +
    `${sceneNodesXml}\n` +
    `    </visual_scene>\n` +
    `  </library_visual_scenes>\n` +
    `  <scene><instance_visual_scene url="#Scene_Root"/></scene>\n` +
    `</COLLADA>\n`
  );
}

export function exportObjectToDAEDownload(
  object: THREE.Object3D,
  filename: string = 'proposta-sketchup.dae',
  sceneName: string = '83_Ambientes'
): void {
  const daeXml = generateColladaDAE(object, sceneName);
  downloadBlob(daeXml, 'model/vnd.collada+xml;charset=utf-8', filename);
}

function downloadBlob(content: string, mimeType: string, filename: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
