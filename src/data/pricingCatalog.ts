// GERADO AUTOMATICAMENTE POR scripts/sync_pricing.py a partir de Lista de preços.xlsx
// Última sincronização: 2026-11-18 15:22
// Contém APENAS preços comerciais de venda ao cliente (custos internos da central omitidos).

export interface MdfFinishOption {
  id: string;
  label: string;
  tierLabel: string;
  hex: string;
  grain: boolean;
  gloss: boolean;
  note: string;
  cod15: string;
  name15: string;
  line: string;
  sellPrice15: number;
  fitaCod: string;
  fitaName: string;
  cod6: string;
  name6: string;
  sellPrice6: number;
}

export interface HardwareKitOption {
  id: 'padrao' | 'slow';
  label: string;
  description: string;
  hingeCod: string;
  hingePrice: number;
  slideCod: string;
  slidePrice: number;
  pistonCod: string;
  pistonPrice: number;
  sliding2Cod: string;
  sliding2Price: number;
  sliding3Cod: string;
  sliding3Price: number;
  handleBarCod: string;
  handleBarPrice: number;
}

export interface ProposedCabinetModule {
  id: string;
  type:
    | 'balcao_pia'
    | 'balcao_gavetas'
    | 'aereo_portas'
    | 'aereo_basculante'
    | 'torre_quente'
    | 'nicho_geladeira'
    | 'guarda_roupa_correr'
    | 'guarda_roupa_abrir'
    | 'criado_mudo'
    | 'painel_cabeceira'
    | 'bancada_estudo'
    | 'painel_tv_ripado'
    | 'rack_suspenso'
    | 'estante_nichos';
  label: string;
  wall: 'back' | 'left' | 'right';
  xCm: number;
  yCm: number;
  widthCm: number;
  heightCm: number;
  depthCm: number;
  doorsCount: number;
  drawersCount: number;
  shelvesCount?: number;
  hasLed?: boolean;
}

export interface CabinetryQuoteResult {
  area15m2: number;
  area6m2: number;
  sheets15Count: number;
  sheets6Count: number;
  hingesCount: number;
  slidesCount: number;
  slidingKitCount: number;
  mdfSellSubtotal: number;
  hardwareSellSubtotal: number;
  assemblyAndLogistics: number;
  estimatedMinBrl: number;
  estimatedMaxBrl: number;
  formattedRange: string;
  finish: MdfFinishOption;
  hardware: HardwareKitOption;
}

// Área padrão de chapa Duratex (2,75 m x 1,85 m = 5,0875 m²) com fator 1.22 de aproveitamento de corte
const SHEET_AREA_M2 = 5.0875;
const CUT_WASTE_FACTOR = 1.22;

export const MDF_FINISH_OPTIONS: MdfFinishOption[] = [
  {
    "id": "branco-artico",
    "label": "Branco Ártico Trama",
    "tierLabel": "Linha Essencial / Branco",
    "hex": "#f4f4f0",
    "grain": false,
    "gloss": false,
    "note": "Acabamento limpo e versátil para cozinhas, closets e escritórios.",
    "cod15": "00096DUR15-11/26",
    "name15": "MDF 15 branco artico trama 2F Duratex ®",
    "line": "trama",
    "sellPrice15": 770.45,
    "fitaCod": "00096REH",
    "fitaName": "",
    "cod6": "00096DUR6-11/26",
    "name6": "MDF 6 branco artico trama 2F Duratex ®",
    "sellPrice6": 554.39
  },
  {
    "id": "branco-ultra",
    "label": "Branco Ultra (Resist. Umidade)",
    "tierLabel": "Linha Ultra Cozinha/Banheiro",
    "hex": "#eeeeea",
    "grain": false,
    "gloss": false,
    "note": "Recomendado para áreas de pia, lavanderia e áreas úmidas.",
    "cod15": "017DUR15-11/26",
    "name15": "MDF 15 branco texturizado ultra 2F Duratex ® Resist. Umidade",
    "line": "texturizado",
    "sellPrice15": 926.3,
    "fitaCod": "",
    "fitaName": "",
    "cod6": "017DUR6-11/26",
    "name6": "MDF 15 branco texturizado ultra 2F Duratex ® Resist. Umidade",
    "sellPrice6": 613.57
  },
  {
    "id": "cinza-platina",
    "label": "Cinza Cristal Platina",
    "tierLabel": "Linha Texturizada",
    "hex": "#c7c8c4",
    "grain": false,
    "gloss": false,
    "note": "Cinza arquitetônico acetinado para cozinhas e salas modernas.",
    "cod15": "00118DUR15-11/26",
    "name15": "Mdf Platina 15 Mm Cinza Cristal Texturizado 2f Duratex ®",
    "line": "",
    "sellPrice15": 825.39,
    "fitaCod": "",
    "fitaName": "",
    "cod6": "00118DUR6-11/26",
    "name6": "Mdf Platina 6 Mm Cinza Cristal Texturizado 2f Duratex ®",
    "sellPrice6": 586.18
  },
  {
    "id": "carvalho-lir",
    "label": "Carvalho Lir (Madeirado Claro)",
    "tierLabel": "Linha Prisma",
    "hex": "#c5a47e",
    "grain": true,
    "gloss": false,
    "note": "Madeirado claro contemporâneo, ótimo equilíbrio custo-estética.",
    "cod15": "00002DUR15-11/26",
    "name15": "MDF 15 carvalho lir 2F Duratex ®",
    "line": "prisma",
    "sellPrice15": 950.25,
    "fitaCod": "00002REH04X22-11/26",
    "fitaName": "CARVALHO LIR 0.4 x 22 mm REHAU ®",
    "cod6": "00002DUR6-11/26",
    "name6": "MDF 6 carvalho lir 2F Duratex ®",
    "sellPrice6": 699.25
  },
  {
    "id": "gianduia-sense",
    "label": "Gianduia Puro Sense",
    "tierLabel": "Linha Sense",
    "hex": "#a69688",
    "grain": false,
    "gloss": false,
    "note": "Tom fendi/greige sofisticado para quartos, closets e painéis.",
    "cod15": "00084DUR15-11/26",
    "name15": "MDF 15 gianduia puro sense 2F Duratex ®",
    "line": "sense",
    "sellPrice15": 950.25,
    "fitaCod": "00084REH04X22-11/26",
    "fitaName": "GIANDUIA PURO 0.4 x 22 mm REHAU ®/GIANDUIA PURO 0.4 x 35 mm REHAU ®",
    "cod6": "00084DUR6-11/26",
    "name6": "MDF 6 gianduia puro sense 2F Duratex ®",
    "sellPrice6": 662.26
  },
  {
    "id": "freijo-imperial",
    "label": "Freijó Imperial Thera",
    "tierLabel": "Linha Thera Nobre",
    "hex": "#9f6c3f",
    "grain": true,
    "gloss": false,
    "note": "Textura amadeirada profunda ideal para painéis ripados e salas.",
    "cod15": "00092DUR15-11/26",
    "name15": "MDF 15 freijo imperial thera 2F Duratex ®",
    "line": "thera",
    "sellPrice15": 1251.0,
    "fitaCod": "00092REH04X22-11/26",
    "fitaName": "FREIJO IMPERIAL 0.4 x 22 mm REHAU ®",
    "cod6": "00092DUR6-11/26",
    "name6": "MDF 6 freijo imperial thera 2F Duratex ®",
    "sellPrice6": 882.03
  },
  {
    "id": "grafite-trama",
    "label": "Grafite Trama",
    "tierLabel": "Linha Trama Contemporânea",
    "hex": "#45484c",
    "grain": false,
    "gloss": false,
    "note": "Cinza grafite marcante para cozinhas gourmet e closets.",
    "cod15": "00103DUR15-11/26",
    "name15": "MDF 15 grafite trama 2F Duratex ®",
    "line": "trama",
    "sellPrice15": 1173.86,
    "fitaCod": "00103REH1X22-11/26",
    "fitaName": "GRAFITE 1 x 22 mm TRAMA REHAU ® (25M)/GRAFITE 0.4 x 35 mm REHAU ®/GRAFITE 0.4 x 19 mm REHAU ®",
    "cod6": "00103DUR6-11/26",
    "name6": "MDF 6 grafite trama 2F Duratex ®",
    "sellPrice6": 851.14
  },
  {
    "id": "branco-cristallo",
    "label": "Branco Diamante Cristallo (Alto Brilho)",
    "tierLabel": "Linha Cristallo Alto Padrão",
    "hex": "#fbfbfc",
    "grain": false,
    "gloss": true,
    "note": "Laca alto brilho espelhada Duratex Cristallo com máxima durabilidade.",
    "cod15": "00022DUR15-11/26",
    "name15": "MDF 15 branco diamante cristallo 2F Duratex ®",
    "line": "cristallo",
    "sellPrice15": 1523.54,
    "fitaCod": "00022REH04X22-11/26",
    "fitaName": "BRANCO DIAMANTE 0.4 x 22 mm CRISTALLO REHAU ®",
    "cod6": "00022DUR6-11/26",
    "name6": "MDF 6 branco diamante cristallo 2F Duratex ®",
    "sellPrice6": 1076.42
  }
];

export const HARDWARE_KIT_OPTIONS: HardwareKitOption[] = [
  {
    "id": "padrao",
    "label": "Linha Padrão (Telescópica + Slide-On)",
    "description": "Dobradiças 35mm slide-on, corrediças telescópicas 400mm, pistão 80N e sistema correr SS150+.",
    "hingeCod": "0004MUL35D-11/26",
    "hingePrice": 4.4,
    "slideCod": "0002MUL400T-11/26",
    "slidePrice": 24.4,
    "pistonCod": "0001MUL80P-11/26",
    "pistonPrice": 13.57,
    "sliding2Cod": "0005ROMSS2-11/26",
    "sliding2Price": 418.61,
    "sliding3Cod": "0006ROMSS3-11/26",
    "sliding3Price": 519.38,
    "handleBarCod": "0004MULT18AL3-11/26",
    "handleBarPrice": 31.98
  },
  {
    "id": "slow",
    "label": "Linha Slow / Oculta (Amortecimento Suave)",
    "description": "Dobradiças slow-motion, corrediças ocultas slow 450mm, puxador perfil alumínio e sistema correr Rometal Dominus.",
    "hingeCod": "0003MUL35D-11/26",
    "hingePrice": 6.17,
    "slideCod": "0002MULT450COS-11/26",
    "slidePrice": 71.98,
    "pistonCod": "0001MUL80P-11/26",
    "pistonPrice": 13.57,
    "sliding2Cod": "0003ROMD2-11/26",
    "sliding2Price": 775.64,
    "sliding3Cod": "0004MULD3-11/26",
    "sliding3Price": 955.32,
    "handleBarCod": "0003MULT15AL3-11/26",
    "handleBarPrice": 92.46
  }
];

export function calculateCabinetryQuote(
  modules: ProposedCabinetModule[],
  finishId: string,
  hardwareId: 'padrao' | 'slow'
): CabinetryQuoteResult {
  const finish = MDF_FINISH_OPTIONS.find(f => f.id === finishId) || MDF_FINISH_OPTIONS[0];
  const hardware = HARDWARE_KIT_OPTIONS.find(h => h.id === hardwareId) || HARDWARE_KIT_OPTIONS[0];

  let rawArea15m2 = 0;
  let rawArea6m2 = 0;
  let hingesCount = 0;
  let slidesCount = 0;
  let pistonsCount = 0;
  let sliding2Count = 0;
  let sliding3Count = 0;
  let handleMeters = 0;

  for (const m of modules) {
    const w = m.widthCm / 100;
    const h = m.heightCm / 100;
    const d = m.depthCm / 100;

    if (m.type === 'painel_tv_ripado' || m.type === 'painel_cabeceira') {
      rawArea15m2 += (w * h) * 1.45;
    } else if (m.type !== 'nicho_geladeira') {
      const shelves = m.shelvesCount ?? (m.heightCm > 150 ? 4 : m.heightCm > 90 ? 2 : 1);
      const carcassArea = (2 * h * d) + (2 * w * d) + (shelves * w * d * 0.85);
      const frontArea = (m.doorsCount > 0 || m.drawersCount > 0 || m.type.includes('balcao') || m.type.includes('guarda_roupa'))
        ? (w * h)
        : 0;
      const drawersBoxArea = m.drawersCount * (w * 0.55 * 0.45 * 2);

      rawArea15m2 += carcassArea + frontArea + drawersBoxArea;
      rawArea6m2 += (w * h) + (m.drawersCount * w * d * 0.65);
    }

    if (m.type === 'guarda_roupa_correr') {
      if (m.doorsCount >= 3) sliding3Count += 1;
      else sliding2Count += 1;
      handleMeters += (m.doorsCount * h);
    } else {
      const hingesPerDoor = m.heightCm >= 180 ? 4 : m.heightCm >= 110 ? 3 : 2;
      hingesCount += m.doorsCount * hingesPerDoor;
      if (m.type === 'aereo_basculante') pistonsCount += Math.max(2, m.doorsCount * 2);
      handleMeters += (m.doorsCount * 0.4) + (m.drawersCount * 0.4);
    }

    slidesCount += m.drawersCount;
  }

  const area15m2 = Number((rawArea15m2 * CUT_WASTE_FACTOR).toFixed(2));
  const area6m2 = Number((rawArea6m2 * CUT_WASTE_FACTOR).toFixed(2));

  const sheets15Count = modules.length > 0 ? Math.max(1, Math.ceil((area15m2 / SHEET_AREA_M2) * 2) / 2) : 0;
  const sheets6Count = area6m2 > 0.2 ? Math.max(0.5, Math.ceil((area6m2 / SHEET_AREA_M2) * 2) / 2) : 0;

  const mdfSellSubtotal = (sheets15Count * finish.sellPrice15) + (sheets6Count * finish.sellPrice6);

  const consumablesPerModule = modules.length * 24;
  const handleBars = Math.ceil(handleMeters / 3);
  const hardwareCostRaw =
    (hingesCount * hardware.hingePrice) +
    (slidesCount * hardware.slidePrice) +
    (pistonsCount * hardware.pistonPrice) +
    (sliding2Count * hardware.sliding2Price) +
    (sliding3Count * hardware.sliding3Price) +
    (handleBars * hardware.handleBarPrice) +
    consumablesPerModule;

  const hardwareSellSubtotal = hardwareCostRaw * 1.65;
  const assemblyAndLogistics = modules.length > 0
    ? Math.max(480, Math.round((mdfSellSubtotal + hardwareSellSubtotal) * 0.22))
    : 0;

  const baseTotal = mdfSellSubtotal + hardwareSellSubtotal + assemblyAndLogistics;
  const estimatedMinBrl = Math.round((baseTotal * 0.92) / 50) * 50;
  const estimatedMaxBrl = Math.round((baseTotal * 1.10) / 50) * 50;

  const fmt = (n: number) => 'R$ ' + n.toLocaleString('pt-BR');

  return {
    area15m2,
    area6m2,
    sheets15Count,
    sheets6Count,
    hingesCount,
    slidesCount,
    slidingKitCount: sliding2Count + sliding3Count,
    mdfSellSubtotal: Math.round(mdfSellSubtotal),
    hardwareSellSubtotal: Math.round(hardwareSellSubtotal),
    assemblyAndLogistics,
    estimatedMinBrl,
    estimatedMaxBrl,
    formattedRange: `${fmt(estimatedMinBrl)} – ${fmt(estimatedMaxBrl)}`,
    finish,
    hardware,
  };
}
