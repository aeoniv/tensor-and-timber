// GERADO AUTOMATICAMENTE POR scripts/sync_pricing.py a partir de Lista de preços.xlsx
// Última sincronização: 2026-11-19 11:45
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

export type HardwareTierId = 'padrao' | 'slow' | 'luxo';
export type FrontStyleId = 'lisa' | 'cava45' | 'provencal' | 'vidro_reflecta';
export type HandleStyleId = 'perfil_18' | 'perfil_15' | 'fecho_toque';
export type ThicknessModeId = '15mm' | '18mm' | '25mm_engrossado';

export interface CabinetStyleOptions {
  frontStyle: FrontStyleId;
  handleStyle: HandleStyleId;
  thicknessMode: ThicknessModeId;
}

export interface HardwareKitOption {
  id: HardwareTierId;
  label: string;
  description: string;
  hingeCod: string;
  hingePrice: number;
  cornerHingeCod: string;
  cornerHingePrice: number;
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
  handleBar15Cod: string;
  handleBar15Price: number;
  rodCod: string;
  rodPrice: number;
}

export type ModuleArchetype =
  | 'balcao_pia'
  | 'balcao_gavetas'
  | 'balcao_cooktop'
  | 'balcao_canto_L'
  | 'balcao_lava_loucas'
  | 'ilha_gourmet'
  | 'aereo_portas'
  | 'aereo_basculante'
  | 'aereo_canto_L'
  | 'fechamento_teto'
  | 'torre_quente'
  | 'nicho_geladeira'
  | 'cristaleira_vidro'
  | 'guarda_roupa_correr'
  | 'guarda_roupa_abrir'
  | 'closet_cabideiro_aberto'
  | 'cama_bau_planejada'
  | 'criado_mudo'
  | 'painel_cabeceira'
  | 'cabeceira_estofada'
  | 'penteadeira_camarim'
  | 'sapateira_prateleiras'
  | 'bancada_estudo'
  | 'painel_tv_ripado'
  | 'painel_muxarabi'
  | 'rack_suspenso'
  | 'estante_nichos'
  | 'aparador_buffet'
  | 'bar_adega'
  | 'gabinete_banheiro'
  | 'espelheira_armario'
  | 'armario_vassoureiro'
  | 'bancada_tanque_maquina'
  | 'mesa_retratil'
  | 'estacao_trabalho_L'
  | 'arquivo_escritorio'
  | 'balcao_churrasqueira'
  | 'balcao_atendimento_comercial';

export interface ModuleTemplateMeta {
  type: ModuleArchetype;
  label: string;
  category: string;
  defaultWall: 'back' | 'left' | 'right' | 'center';
  defaultYCm: number;
  widthCm: number;
  heightCm: number;
  depthCm: number;
  doorsCount: number;
  drawersCount: number;
  hasLed: boolean;
}

export const MODULE_CATALOG_TEMPLATES: ModuleTemplateMeta[] = [
  { type: 'balcao_pia', label: 'Balcão de Pia', category: 'Cozinha / Gourmet', defaultWall: 'back', defaultYCm: 0, widthCm: 140, heightCm: 86, depthCm: 60, doorsCount: 3, drawersCount: 0, hasLed: false },
  { type: 'balcao_cooktop', label: 'Balcão Cooktop', category: 'Cozinha / Gourmet', defaultWall: 'back', defaultYCm: 0, widthCm: 90, heightCm: 86, depthCm: 60, doorsCount: 0, drawersCount: 3, hasLed: false },
  { type: 'balcao_gavetas', label: 'Balcão Gaveteiro', category: 'Cozinha / Geral', defaultWall: 'back', defaultYCm: 0, widthCm: 80, heightCm: 86, depthCm: 58, doorsCount: 0, drawersCount: 4, hasLed: false },
  { type: 'balcao_canto_L', label: 'Balcão de Canto em L (c/ Giratória)', category: 'Cozinha / Canto', defaultWall: 'back', defaultYCm: 0, widthCm: 105, heightCm: 86, depthCm: 95, doorsCount: 2, drawersCount: 0, hasLed: false },
  { type: 'balcao_lava_loucas', label: 'Balcão + Nicho Lava-Louças / Adega', category: 'Cozinha / Gourmet', defaultWall: 'back', defaultYCm: 0, widthCm: 110, heightCm: 86, depthCm: 62, doorsCount: 1, drawersCount: 2, hasLed: false },
  { type: 'ilha_gourmet', label: 'Ilha Gourmet Bancada Cascata', category: 'Cozinha / Gourmet', defaultWall: 'center', defaultYCm: 0, widthCm: 160, heightCm: 92, depthCm: 85, doorsCount: 3, drawersCount: 0, hasLed: false },
  { type: 'aereo_portas', label: 'Armário Aéreo c/ Portas', category: 'Aéreos & Complementos', defaultWall: 'back', defaultYCm: 150, widthCm: 120, heightCm: 68, depthCm: 35, doorsCount: 3, drawersCount: 0, hasLed: true },
  { type: 'aereo_basculante', label: 'Armário Aéreo Basculante LED', category: 'Aéreos & Complementos', defaultWall: 'back', defaultYCm: 150, widthCm: 120, heightCm: 68, depthCm: 35, doorsCount: 2, drawersCount: 0, hasLed: true },
  { type: 'aereo_canto_L', label: 'Aéreo de Canto em L', category: 'Aéreos & Complementos', defaultWall: 'back', defaultYCm: 150, widthCm: 95, heightCm: 68, depthCm: 80, doorsCount: 2, drawersCount: 0, hasLed: true },
  { type: 'fechamento_teto', label: 'Tamponamento / Vista até o Teto', category: 'Aéreos & Complementos', defaultWall: 'back', defaultYCm: 218, widthCm: 180, heightCm: 32, depthCm: 36, doorsCount: 0, drawersCount: 0, hasLed: false },
  { type: 'torre_quente', label: 'Torre Quente Forno + Micro', category: 'Cozinha / Gourmet', defaultWall: 'back', defaultYCm: 0, widthCm: 70, heightCm: 220, depthCm: 60, doorsCount: 2, drawersCount: 2, hasLed: false },
  { type: 'nicho_geladeira', label: 'Nicho Geladeira + Aéreo Superior', category: 'Cozinha / Gourmet', defaultWall: 'back', defaultYCm: 0, widthCm: 88, heightCm: 225, depthCm: 68, doorsCount: 2, drawersCount: 0, hasLed: false },
  { type: 'cristaleira_vidro', label: 'Cristaleira Vidro & Alumínio LED', category: 'Sala / Cozinha', defaultWall: 'back', defaultYCm: 0, widthCm: 75, heightCm: 220, depthCm: 42, doorsCount: 2, drawersCount: 0, hasLed: true },
  { type: 'guarda_roupa_correr', label: 'Guarda-Roupa Portas de Correr', category: 'Quarto / Closet', defaultWall: 'back', defaultYCm: 0, widthCm: 200, heightCm: 240, depthCm: 60, doorsCount: 3, drawersCount: 4, hasLed: false },
  { type: 'guarda_roupa_abrir', label: 'Guarda-Roupa Portas de Abrir', category: 'Quarto / Closet', defaultWall: 'back', defaultYCm: 0, widthCm: 160, heightCm: 240, depthCm: 58, doorsCount: 4, drawersCount: 3, hasLed: false },
  { type: 'closet_cabideiro_aberto', label: 'Closet Aberto c/ Cabideiro & Gavetas', category: 'Quarto / Closet', defaultWall: 'back', defaultYCm: 0, widthCm: 150, heightCm: 235, depthCm: 56, doorsCount: 0, drawersCount: 3, hasLed: true },
  { type: 'cama_bau_planejada', label: 'Cama Baú Casal c/ Gavetas', category: 'Quarto / Closet', defaultWall: 'left', defaultYCm: 0, widthCm: 145, heightCm: 60, depthCm: 195, doorsCount: 0, drawersCount: 2, hasLed: false },
  { type: 'criado_mudo', label: 'Mesa de Cabeceira Suspensa/Base', category: 'Quarto / Closet', defaultWall: 'back', defaultYCm: 0, widthCm: 50, heightCm: 55, depthCm: 42, doorsCount: 0, drawersCount: 2, hasLed: false },
  { type: 'painel_cabeceira', label: 'Painel Ripado Cabeceira LED', category: 'Quarto / Closet', defaultWall: 'back', defaultYCm: 0, widthCm: 220, heightCm: 150, depthCm: 6, doorsCount: 0, drawersCount: 0, hasLed: true },
  { type: 'cabeceira_estofada', label: 'Cabeceira Modulada Estofada LED', category: 'Quarto / Closet', defaultWall: 'back', defaultYCm: 0, widthCm: 210, heightCm: 135, depthCm: 9, doorsCount: 0, drawersCount: 0, hasLed: true },
  { type: 'penteadeira_camarim', label: 'Penteadeira Camarim c/ Espelho LED', category: 'Quarto / Closet', defaultWall: 'back', defaultYCm: 0, widthCm: 100, heightCm: 165, depthCm: 45, doorsCount: 0, drawersCount: 2, hasLed: true },
  { type: 'sapateira_prateleiras', label: 'Sapateira Vertical Prateleiras', category: 'Quarto / Closet', defaultWall: 'back', defaultYCm: 0, widthCm: 75, heightCm: 210, depthCm: 38, doorsCount: 0, drawersCount: 0, hasLed: false },
  { type: 'bancada_estudo', label: 'Bancada de Estudo / Escrivaninha', category: 'Quarto / Escritório', defaultWall: 'back', defaultYCm: 0, widthCm: 130, heightCm: 76, depthCm: 55, doorsCount: 0, drawersCount: 2, hasLed: false },
  { type: 'painel_tv_ripado', label: 'Painel Ripado TV c/ Fita LED', category: 'Sala / Escritório', defaultWall: 'back', defaultYCm: 0, widthCm: 220, heightCm: 235, depthCm: 8, doorsCount: 0, drawersCount: 0, hasLed: true },
  { type: 'painel_muxarabi', label: 'Painel Divisório Muxarabi Vazado', category: 'Sala / Comercial', defaultWall: 'back', defaultYCm: 0, widthCm: 110, heightCm: 240, depthCm: 12, doorsCount: 0, drawersCount: 0, hasLed: true },
  { type: 'rack_suspenso', label: 'Rack Suspenso Gavetões LED', category: 'Sala / Estar', defaultWall: 'back', defaultYCm: 28, widthCm: 200, heightCm: 38, depthCm: 42, doorsCount: 0, drawersCount: 4, hasLed: true },
  { type: 'estante_nichos', label: 'Estante / Torre de Nichos Aberta', category: 'Geral', defaultWall: 'back', defaultYCm: 0, widthCm: 70, heightCm: 215, depthCm: 36, doorsCount: 0, drawersCount: 0, hasLed: true },
  { type: 'aparador_buffet', label: 'Aparador / Buffet 4 Portas', category: 'Sala / Estar', defaultWall: 'back', defaultYCm: 0, widthCm: 150, heightCm: 82, depthCm: 44, doorsCount: 3, drawersCount: 0, hasLed: false },
  { type: 'bar_adega', label: 'Bar Adega Climatizada c/ Taças LED', category: 'Sala / Gourmet', defaultWall: 'back', defaultYCm: 0, widthCm: 100, heightCm: 220, depthCm: 45, doorsCount: 2, drawersCount: 0, hasLed: true },
  { type: 'gabinete_banheiro', label: 'Gabinete Banheiro Suspenso c/ Cuba', category: 'Banheiro / Lavabo', defaultWall: 'back', defaultYCm: 46, widthCm: 120, heightCm: 44, depthCm: 50, doorsCount: 0, drawersCount: 3, hasLed: true },
  { type: 'espelheira_armario', label: 'Espelheira Armário c/ LED', category: 'Banheiro / Lavabo', defaultWall: 'back', defaultYCm: 115, widthCm: 120, heightCm: 78, depthCm: 16, doorsCount: 3, drawersCount: 0, hasLed: true },
  { type: 'armario_vassoureiro', label: 'Armário Alto Vassoureiro / Despenseiro', category: 'Lavanderia / Banheiro', defaultWall: 'back', defaultYCm: 0, widthCm: 65, heightCm: 225, depthCm: 52, doorsCount: 2, drawersCount: 0, hasLed: false },
  { type: 'bancada_tanque_maquina', label: 'Bancada Tanque + Lava e Seca', category: 'Lavanderia', defaultWall: 'back', defaultYCm: 0, widthCm: 180, heightCm: 90, depthCm: 62, doorsCount: 2, drawersCount: 0, hasLed: false },
  { type: 'mesa_retratil', label: 'Mesa / Bancada Retrátil Dobrável', category: 'Compactos / Lavanderia', defaultWall: 'back', defaultYCm: 0, widthCm: 100, heightCm: 76, depthCm: 55, doorsCount: 1, drawersCount: 0, hasLed: false },
  { type: 'estacao_trabalho_L', label: 'Estação Home Office c/ Gaveteiro', category: 'Escritório', defaultWall: 'back', defaultYCm: 0, widthCm: 170, heightCm: 75, depthCm: 62, doorsCount: 0, drawersCount: 3, hasLed: false },
  { type: 'arquivo_escritorio', label: 'Armário Alto Arquivos & Pastas', category: 'Escritório', defaultWall: 'back', defaultYCm: 0, widthCm: 95, heightCm: 220, depthCm: 45, doorsCount: 2, drawersCount: 2, hasLed: false },
  { type: 'balcao_churrasqueira', label: 'Bancada Churrasqueira & Cervejeira', category: 'Área Gourmet', defaultWall: 'back', defaultYCm: 0, widthCm: 160, heightCm: 88, depthCm: 65, doorsCount: 3, drawersCount: 2, hasLed: false },
  { type: 'balcao_atendimento_comercial', label: 'Balcão Recepção / Loja Comercial', category: 'Comercial / Corporativo', defaultWall: 'center', defaultYCm: 0, widthCm: 180, heightCm: 112, depthCm: 68, doorsCount: 2, drawersCount: 3, hasLed: true },
];

export interface ProposedCabinetModule {
  id: string;
  type: ModuleArchetype;
  label: string;
  wall: 'back' | 'left' | 'right' | 'center';
  xCm: number;   // Ao longo da parede (esq->dir) ou deslocamento X se center
  yCm: number;   // Altura da base a partir do piso
  zCm?: number;  // Posição Z para ilhas/centro (em cm da parede de fundo)
  widthCm: number;
  heightCm: number;
  depthCm: number;
  doorsCount: number;
  drawersCount: number;
  shelvesCount?: number;
  hasLed?: boolean;
}

export interface CabinetryQuoteResult {
  area15CarcassM2: number;
  area15FrontM2: number;
  area15m2: number;
  area6m2: number;
  sheets15CarcassCount: number;
  sheets15FrontCount: number;
  sheets15Count: number;
  sheets6Count: number;
  hingesCount: number;
  cornerHingesCount: number;
  slidesCount: number;
  slidingKitCount: number;
  mdfSellSubtotal: number;
  hardwareSellSubtotal: number;
  machiningAndGlassSubtotal: number;
  assemblyAndLogistics: number;
  estimatedMinBrl: number;
  estimatedMaxBrl: number;
  formattedRange: string;
  carcassFinish: MdfFinishOption;
  frontFinish: MdfFinishOption;
  hardware: HardwareKitOption;
  styleOptions: CabinetStyleOptions;
}

const SHEET_AREA_M2 = 5.0875;
const CUT_WASTE_FACTOR = 1.22;

export const MDF_FEATURED_FINISHES: MdfFinishOption[] = [
  {
    "id": "branco-artico",
    "label": "Branco Ártico Trama",
    "tierLabel": "Linha Essencial / Branco",
    "hex": "#f4f4f0",
    "grain": false,
    "gloss": false,
    "note": "Versátil para caixaria interna e frentes limpas.",
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
    "tierLabel": "Linha Ultra Áreas Molhadas",
    "hex": "#eeeeea",
    "grain": false,
    "gloss": false,
    "note": "Recomendado para cozinha, banheiro e lavanderia.",
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
    "note": "Cinza acetinado contemporâneo.",
    "cod15": "00118DUR15-11/26",
    "name15": "Mdf Platina 15 Mm Cinza Cristal Texturizado 2f Duratex ®",
    "line": "padrão",
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
    "note": "Madeirado claro equilibrado.",
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
    "note": "Tom fendi/greige elegante para quartos e salas.",
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
    "note": "Amadeirado profundo ideal para ripados e frentes.",
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
    "id": "verde-floresta",
    "label": "Verde Floresta Mate",
    "tierLabel": "Linha Velluto Mate",
    "hex": "#385746",
    "grain": false,
    "gloss": false,
    "note": "Verde fosco tendência para cozinhas e lavabos.",
    "cod15": "00110DUR15-11/26",
    "name15": "MDF 15 verde floresta mate 2F Duratex ®",
    "line": "velluto",
    "sellPrice15": 1251.0,
    "fitaCod": "00110REH04X22-11/26",
    "fitaName": "VERDE FLORESTA 0.4 x 22 mm REHAU ®/VERDE FLORESTA 1 x 22 mm REHAU ® (25M)",
    "cod6": "00110DUR6-11/26",
    "name6": "MDF 6 verde floresta mate 2F Duratex ®",
    "sellPrice6": 882.03
  },
  {
    "id": "azul-astral",
    "label": "Azul Astral Mate",
    "tierLabel": "Linha Velluto Mate",
    "hex": "#3a6b8c",
    "grain": false,
    "gloss": false,
    "note": "Azul arquitetônico para cozinhas, quartos e escritórios.",
    "cod15": "00112DUR15-11/26",
    "name15": "MDF 15 azul astral mate 2F Duratex ®",
    "line": "velluto",
    "sellPrice15": 1251.0,
    "fitaCod": "00112REH04X22-11/26",
    "fitaName": "AZUL ASTRAL 0.4 x 22 mm REHAU ®",
    "cod6": "00096DUR6-11/26",
    "name6": "MDF 6mm padrão compatível",
    "sellPrice6": 882.03
  },
  {
    "id": "grafite-trama",
    "label": "Grafite Trama",
    "tierLabel": "Linha Trama",
    "hex": "#45484c",
    "grain": false,
    "gloss": false,
    "note": "Cinza grafite marcante.",
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
    "id": "portoro-ultra",
    "label": "Portoro Mármore (Resist. Umidade)",
    "tierLabel": "Linha Ultra Pedra",
    "hex": "#252629",
    "grain": false,
    "gloss": true,
    "note": "Padrão pedra escura resistente à umidade.",
    "cod15": "00082DUR15-11/26",
    "name15": "MDF 15 portoro essencial ultra 2F Duratex ® Resist. Umidade",
    "line": "essencial",
    "sellPrice15": 1275.97,
    "fitaCod": "00082REH04X22-11/26",
    "fitaName": "PORTORO 0.4 x 22 mm REHAU ®",
    "cod6": "00096DUR6-11/26",
    "name6": "MDF 6mm padrão compatível",
    "sellPrice6": 827.21
  },
  {
    "id": "branco-cristallo",
    "label": "Branco Diamante Cristallo",
    "tierLabel": "Linha Cristallo Alto Brilho",
    "hex": "#fbfbfc",
    "grain": false,
    "gloss": true,
    "note": "Alto brilho espelhado Duratex Cristallo.",
    "cod15": "00022DUR15-11/26",
    "name15": "MDF 15 branco diamante cristallo 2F Duratex ®",
    "line": "cristallo",
    "sellPrice15": 1523.54,
    "fitaCod": "00022REH04X22-11/26",
    "fitaName": "BRANCO DIAMANTE 0.4 x 22 mm CRISTALLO REHAU ®",
    "cod6": "00022DUR6-11/26",
    "name6": "MDF 6 branco diamante cristallo 2F Duratex ®",
    "sellPrice6": 1076.42
  },
  {
    "id": "grafite-acetinatta",
    "label": "Grafite Acetinatta",
    "tierLabel": "Linha Acetinatta Premium",
    "hex": "#3b3e42",
    "grain": false,
    "gloss": false,
    "note": "Acabamento ultramate aveludado de alto padrão.",
    "cod15": "00034DUR15-11/26",
    "name15": "MDF 15 grafite acetinatta 2F Duratex ®",
    "line": "acetinatta",
    "sellPrice15": 2024.87,
    "fitaCod": "00034REH04X22-11/26",
    "fitaName": "GRAFITE 0.4 x 22 mm ACETINATTA REHAU ®",
    "cod6": "00096DUR6-11/26",
    "name6": "MDF 6mm padrão compatível",
    "sellPrice6": 690.0
  }
];

export const ALL_MDF_FINISHES: MdfFinishOption[] = [
  {
    "id": "branco-artico",
    "label": "Branco Ártico Trama",
    "tierLabel": "Linha Essencial / Branco",
    "hex": "#f4f4f0",
    "grain": false,
    "gloss": false,
    "note": "Versátil para caixaria interna e frentes limpas.",
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
    "tierLabel": "Linha Ultra Áreas Molhadas",
    "hex": "#eeeeea",
    "grain": false,
    "gloss": false,
    "note": "Recomendado para cozinha, banheiro e lavanderia.",
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
    "note": "Cinza acetinado contemporâneo.",
    "cod15": "00118DUR15-11/26",
    "name15": "Mdf Platina 15 Mm Cinza Cristal Texturizado 2f Duratex ®",
    "line": "padrão",
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
    "note": "Madeirado claro equilibrado.",
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
    "note": "Tom fendi/greige elegante para quartos e salas.",
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
    "note": "Amadeirado profundo ideal para ripados e frentes.",
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
    "id": "verde-floresta",
    "label": "Verde Floresta Mate",
    "tierLabel": "Linha Velluto Mate",
    "hex": "#385746",
    "grain": false,
    "gloss": false,
    "note": "Verde fosco tendência para cozinhas e lavabos.",
    "cod15": "00110DUR15-11/26",
    "name15": "MDF 15 verde floresta mate 2F Duratex ®",
    "line": "velluto",
    "sellPrice15": 1251.0,
    "fitaCod": "00110REH04X22-11/26",
    "fitaName": "VERDE FLORESTA 0.4 x 22 mm REHAU ®/VERDE FLORESTA 1 x 22 mm REHAU ® (25M)",
    "cod6": "00110DUR6-11/26",
    "name6": "MDF 6 verde floresta mate 2F Duratex ®",
    "sellPrice6": 882.03
  },
  {
    "id": "azul-astral",
    "label": "Azul Astral Mate",
    "tierLabel": "Linha Velluto Mate",
    "hex": "#3a6b8c",
    "grain": false,
    "gloss": false,
    "note": "Azul arquitetônico para cozinhas, quartos e escritórios.",
    "cod15": "00112DUR15-11/26",
    "name15": "MDF 15 azul astral mate 2F Duratex ®",
    "line": "velluto",
    "sellPrice15": 1251.0,
    "fitaCod": "00112REH04X22-11/26",
    "fitaName": "AZUL ASTRAL 0.4 x 22 mm REHAU ®",
    "cod6": "00096DUR6-11/26",
    "name6": "MDF 6mm padrão compatível",
    "sellPrice6": 882.03
  },
  {
    "id": "grafite-trama",
    "label": "Grafite Trama",
    "tierLabel": "Linha Trama",
    "hex": "#45484c",
    "grain": false,
    "gloss": false,
    "note": "Cinza grafite marcante.",
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
    "id": "portoro-ultra",
    "label": "Portoro Mármore (Resist. Umidade)",
    "tierLabel": "Linha Ultra Pedra",
    "hex": "#252629",
    "grain": false,
    "gloss": true,
    "note": "Padrão pedra escura resistente à umidade.",
    "cod15": "00082DUR15-11/26",
    "name15": "MDF 15 portoro essencial ultra 2F Duratex ® Resist. Umidade",
    "line": "essencial",
    "sellPrice15": 1275.97,
    "fitaCod": "00082REH04X22-11/26",
    "fitaName": "PORTORO 0.4 x 22 mm REHAU ®",
    "cod6": "00096DUR6-11/26",
    "name6": "MDF 6mm padrão compatível",
    "sellPrice6": 827.21
  },
  {
    "id": "branco-cristallo",
    "label": "Branco Diamante Cristallo",
    "tierLabel": "Linha Cristallo Alto Brilho",
    "hex": "#fbfbfc",
    "grain": false,
    "gloss": true,
    "note": "Alto brilho espelhado Duratex Cristallo.",
    "cod15": "00022DUR15-11/26",
    "name15": "MDF 15 branco diamante cristallo 2F Duratex ®",
    "line": "cristallo",
    "sellPrice15": 1523.54,
    "fitaCod": "00022REH04X22-11/26",
    "fitaName": "BRANCO DIAMANTE 0.4 x 22 mm CRISTALLO REHAU ®",
    "cod6": "00022DUR6-11/26",
    "name6": "MDF 6 branco diamante cristallo 2F Duratex ®",
    "sellPrice6": 1076.42
  },
  {
    "id": "grafite-acetinatta",
    "label": "Grafite Acetinatta",
    "tierLabel": "Linha Acetinatta Premium",
    "hex": "#3b3e42",
    "grain": false,
    "gloss": false,
    "note": "Acabamento ultramate aveludado de alto padrão.",
    "cod15": "00034DUR15-11/26",
    "name15": "MDF 15 grafite acetinatta 2F Duratex ®",
    "line": "acetinatta",
    "sellPrice15": 2024.87,
    "fitaCod": "00034REH04X22-11/26",
    "fitaName": "GRAFITE 0.4 x 22 mm ACETINATTA REHAU ®",
    "cod6": "00096DUR6-11/26",
    "name6": "MDF 6mm padrão compatível",
    "sellPrice6": 690.0
  },
  {
    "id": "00001dur15-11-26",
    "label": "Canion Rustico Prisma",
    "tierLabel": "Linha Prisma",
    "hex": "#b9ab99",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 canion rustico prisma 2F Duratex ®",
    "cod15": "00001DUR15-11/26",
    "name15": "MDF 15 canion rustico prisma 2F Duratex ®",
    "line": "prisma",
    "sellPrice15": 1050.15,
    "fitaCod": "",
    "fitaName": "",
    "cod6": "00001DUR6-11/26",
    "name6": "MDF 6 canion rustico prisma 2F Duratex ®",
    "sellPrice6": 709.2
  },
  {
    "id": "00003dur15-11-26",
    "label": "Carvalho Evora Prisma",
    "tierLabel": "Linha Prisma",
    "hex": "#c4a47c",
    "grain": true,
    "gloss": false,
    "note": "MDF 15 carvalho evora prisma 2F Duratex ®",
    "cod15": "00003DUR15-11/26",
    "name15": "MDF 15 carvalho evora prisma 2F Duratex ®",
    "line": "prisma",
    "sellPrice15": 1151.38,
    "fitaCod": "00003REH04X19-11/26",
    "fitaName": "CARVALHO EVORA 0.4 x 19 mm REHAU ®",
    "cod6": "00003DUR6-11/26",
    "name6": "MDF 6 carvalho evora prisma 2F Duratex ®",
    "sellPrice6": 709.2
  },
  {
    "id": "00004dur15-11-26",
    "label": "Ciliegio Grigio Prisma",
    "tierLabel": "Linha Prisma",
    "hex": "#b9ab99",
    "grain": true,
    "gloss": false,
    "note": "MDF 15 ciliegio grigio prisma 2F Duratex ®",
    "cod15": "00004DUR15-11/26",
    "name15": "MDF 15 ciliegio grigio prisma 2F Duratex ®",
    "line": "prisma",
    "sellPrice15": 809.31,
    "fitaCod": "00004REH04X19-11/26",
    "fitaName": "CILIEGIO GRIGIO 0.4 x 19 mm REHAU ®",
    "cod6": "00004DUR6-11/26",
    "name6": "MDF 6 ciliegio grigio prisma 2F Duratex ®",
    "sellPrice6": 567.82
  },
  {
    "id": "00005dur15-11-26",
    "label": "Ebano Grigio Prisma",
    "tierLabel": "Linha Prisma",
    "hex": "#6f4e37",
    "grain": true,
    "gloss": false,
    "note": "MDF 15 ebano grigio prisma 2F Duratex ®",
    "cod15": "00005DUR15-11/26",
    "name15": "MDF 15 ebano grigio prisma 2F Duratex ®",
    "line": "prisma",
    "sellPrice15": 1050.15,
    "fitaCod": "00005REH04X19-11/26",
    "fitaName": "EBANO GRIGIO 0.4 x 19 mm CRISTALLO REHAU ®",
    "cod6": "00005DUR6-11/26",
    "name6": "MDF 6 ebano grigio prisma 2F Duratex ®",
    "sellPrice6": 648.32
  },
  {
    "id": "00006dur15-11-26",
    "label": "Ebano Marone Prisma",
    "tierLabel": "Linha Prisma",
    "hex": "#6f4e37",
    "grain": true,
    "gloss": false,
    "note": "MDF 15 ebano marone prisma 2F Duratex ®",
    "cod15": "00006DUR15-11/26",
    "name15": "MDF 15 ebano marone prisma 2F Duratex ®",
    "line": "prisma",
    "sellPrice15": 855.32,
    "fitaCod": "00006REH04X19-11/26",
    "fitaName": "EBANO MARONE 0.4 x 19 mm CRISTALLO REHAU ®",
    "cod6": "00006DUR6-11/26",
    "name6": "MDF 6 ebano marone prisma 2F Duratex ®",
    "sellPrice6": 599.62
  },
  {
    "id": "00007dur15-11-26",
    "label": "Gris Montano Prisma",
    "tierLabel": "Linha Prisma",
    "hex": "#b9ab99",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 gris montano prisma 2F Duratex ®",
    "cod15": "00007DUR15-11/26",
    "name15": "MDF 15 gris montano prisma 2F Duratex ®",
    "line": "prisma",
    "sellPrice15": 855.32,
    "fitaCod": "00007REA04X19-11/26",
    "fitaName": "GRIS MONTANO 0.4 x 19 mm LUME REHAU ®",
    "cod6": "00007DUR6-11/26",
    "name6": "MDF 6 gris montano prisma 2F Duratex ®",
    "sellPrice6": 599.62
  },
  {
    "id": "00008dur15-11-26",
    "label": "Riviera Prisma",
    "tierLabel": "Linha Prisma",
    "hex": "#b9ab99",
    "grain": true,
    "gloss": false,
    "note": "MDF 15 riviera prisma 2F Duratex ®",
    "cod15": "00008DUR15-11/26",
    "name15": "MDF 15 riviera prisma 2F Duratex ®",
    "line": "prisma",
    "sellPrice15": 989.15,
    "fitaCod": "00008REH04X19-11/26 (00008PRO1X45-11/26)",
    "fitaName": "RIVIERA 0.4 x 19 mm REHAU ®/RIVIERA 1 x 45 mm PROADEC ®",
    "cod6": "00008DUR6-11/26",
    "name6": "MDF 6 riviera prisma 2F Duratex ®",
    "sellPrice6": 709.91
  },
  {
    "id": "00009dur15-11-26",
    "label": "Lineo Textil Prisma",
    "tierLabel": "Linha Prisma",
    "hex": "#b9ab99",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 lineo textil prisma 2F Duratex ®",
    "cod15": "00009DUR15-11/26",
    "name15": "MDF 15 lineo textil prisma 2F Duratex ®",
    "line": "prisma",
    "sellPrice15": 1151.38,
    "fitaCod": "00009REH04X100-11/26",
    "fitaName": "LINEO TEXTIL 0.4 x 100 mm JATEADO REHAU ®",
    "cod6": "00009DUR6-11/26",
    "name6": "MDF 6 lineo textil prisma 2F Duratex ®",
    "sellPrice6": 789.17
  },
  {
    "id": "00010dur15-11-26",
    "label": "Riviera Cross",
    "tierLabel": "Linha Prisma",
    "hex": "#b9ab99",
    "grain": true,
    "gloss": false,
    "note": "MDF 15 riviera cross 2F Duratex ®",
    "cod15": "00010DUR15-11/26",
    "name15": "MDF 15 riviera cross 2F Duratex ®",
    "line": "prisma",
    "sellPrice15": 908.81,
    "fitaCod": "00010REH",
    "fitaName": "",
    "cod6": "00010DUR6-11/26",
    "name6": "MDF 6 riviera cross 2F Duratex ®",
    "sellPrice6": 851.14
  },
  {
    "id": "00011dur15-11-26",
    "label": "Nogueira Cadiz Prisma",
    "tierLabel": "Linha Prisma",
    "hex": "#6f4e37",
    "grain": true,
    "gloss": false,
    "note": "MDF 15 nogueira cadiz prisma 2F Duratex ®",
    "cod15": "00011DUR15-11/26",
    "name15": "MDF 15 nogueira cadiz prisma 2F Duratex ®",
    "line": "prisma",
    "sellPrice15": 989.15,
    "fitaCod": "00011REH04X19-11/26",
    "fitaName": "NOGUEIRA CADIZ 0.4 x 19 mm REHAU ®",
    "cod6": "00011DUR6-11/26",
    "name6": "MDF 6 nogueira cadiz prisma 2F Duratex ®",
    "sellPrice6": 709.91
  },
  {
    "id": "00012dur15-11-26",
    "label": "Amendola Rustica Duna",
    "tierLabel": "Linha Prisma",
    "hex": "#9e6b3f",
    "grain": true,
    "gloss": false,
    "note": "MDF 15 amendola rustica duna 2F Duratex ®",
    "cod15": "00012DUR15-11/26",
    "name15": "MDF 15 amendola rustica duna 2F Duratex ®",
    "line": "prisma",
    "sellPrice15": 989.15,
    "fitaCod": "00012REH",
    "fitaName": "",
    "cod6": "00012DUR6-11/26",
    "name6": "MDF 6 amendola rustica duna 2F Duratex ®",
    "sellPrice6": 709.91
  },
  {
    "id": "00013dur15-11-26",
    "label": "Carvalho Dian Prisma",
    "tierLabel": "Linha Prisma",
    "hex": "#c4a47c",
    "grain": true,
    "gloss": false,
    "note": "MDF 15 carvalho dian prisma 2F Duratex ®",
    "cod15": "00013DUR15-11/26",
    "name15": "MDF 15 carvalho dian prisma 2F Duratex ®",
    "line": "prisma",
    "sellPrice15": 950.25,
    "fitaCod": "00013REH04X22-11/26",
    "fitaName": "CARVALHO DIAN REHAU ®",
    "cod6": "00013DUR6-11/26",
    "name6": "MDF 6 Carvalho Dian 2F Duratex ®",
    "sellPrice6": 699.25
  },
  {
    "id": "00014dur15-11-26",
    "label": "Nogueira Alva Prisma",
    "tierLabel": "Linha Prisma",
    "hex": "#6f4e37",
    "grain": true,
    "gloss": false,
    "note": "MDF 15 nogueira alva prisma 2F Duratex ®",
    "cod15": "00014DUR15-11/26",
    "name15": "MDF 15 nogueira alva prisma 2F Duratex ®",
    "line": "prisma",
    "sellPrice15": 1050.15,
    "fitaCod": "00014REH04X19-11/26",
    "fitaName": "NOGUEIRA ALVA 0.4 x 19 mm REHAU ®",
    "cod6": "00014DUR6-11/26",
    "name6": "MDF 6  Nogueira Alva Prisma 1F Duratex ®",
    "sellPrice6": 628.85
  },
  {
    "id": "00015dur15-11-26",
    "label": "Larnaca Prisma",
    "tierLabel": "Linha Prisma",
    "hex": "#c4a47c",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 larnaca prisma 2F Duratex ®",
    "cod15": "00015DUR15-11/26",
    "name15": "MDF 15 larnaca prisma 2F Duratex ®",
    "line": "prisma",
    "sellPrice15": 989.15,
    "fitaCod": "00015REH04X22-11/26",
    "fitaName": "LARNACA 0.4 x 22 mm REHAU",
    "cod6": "00015DUR6-11/26",
    "name6": "MDF 6 larnaca prisma 2F Duratex ®",
    "sellPrice6": 709.91
  },
  {
    "id": "00016dur15-11-26",
    "label": "Ovo Original",
    "tierLabel": "Linha Original",
    "hex": "#f2f1ec",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 ovo original 2F Duratex ®",
    "cod15": "00016DUR15-11/26",
    "name15": "MDF 15 ovo original 2F Duratex ®",
    "line": "original",
    "sellPrice15": 974.02,
    "fitaCod": "00016REH04X19-11/26",
    "fitaName": "OVO 0.4 x 19 mm REHAU ®",
    "cod6": "00016DUR6-11/26",
    "name6": "MDF 6 ovo original 2F Duratex ®",
    "sellPrice6": 586.18
  },
  {
    "id": "00017dur15-11-26",
    "label": "Borgonha Cristallo",
    "tierLabel": "Linha Cristallo",
    "hex": "#6e2632",
    "grain": false,
    "gloss": true,
    "note": "MDF 15 borgonha cristallo 2F Duratex ®",
    "cod15": "00017DUR15-11/26",
    "name15": "MDF 15 borgonha cristallo 2F Duratex ®",
    "line": "cristallo",
    "sellPrice15": 1293.67,
    "fitaCod": "00017REH04X19-11/26",
    "fitaName": "BORGONHA 0.4 x 19 mm CRISTALLO REHAU ®",
    "cod6": "00017DUR6-11/26",
    "name6": "MDF 6 borgonha cristallo 2F Duratex ®",
    "sellPrice6": 928.37
  },
  {
    "id": "00018dur15-11-26",
    "label": "Citrino Cristallo",
    "tierLabel": "Linha Cristallo",
    "hex": "#c68b3e",
    "grain": false,
    "gloss": true,
    "note": "MDF 15 citrino cristallo 2F Duratex ®",
    "cod15": "00018DUR15-11/26",
    "name15": "MDF 15 citrino cristallo 2F Duratex ®",
    "line": "cristallo",
    "sellPrice15": 1293.67,
    "fitaCod": "00018REH",
    "fitaName": "",
    "cod6": "00018DUR6-11/26",
    "name6": "MDF 6 citrino cristallo 2F Duratex ®",
    "sellPrice6": 928.37
  },
  {
    "id": "00019dur15-11-26",
    "label": "Opala Cristallo",
    "tierLabel": "Linha Cristallo",
    "hex": "#fbfbfc",
    "grain": false,
    "gloss": true,
    "note": "MDF 15 opala cristallo 2F Duratex ®",
    "cod15": "00019DUR15-11/26",
    "name15": "MDF 15 opala cristallo 2F Duratex ®",
    "line": "cristallo",
    "sellPrice15": 1523.54,
    "fitaCod": "00019REH04X2211/26",
    "fitaName": "OPALA 0.4 x 22 mm CRISTALLO REHAU ®",
    "cod6": "00019DUR6-11/26",
    "name6": "MDF 6 opala cristallo 2F Duratex ®",
    "sellPrice6": 1076.42
  },
  {
    "id": "00020dur15-11-26",
    "label": "Gianduia Cristallo",
    "tierLabel": "Linha Cristallo",
    "hex": "#a89888",
    "grain": false,
    "gloss": true,
    "note": "MDF 15 gianduia cristallo 2F Duratex ®",
    "cod15": "00020DUR15-11/26",
    "name15": "MDF 15 gianduia cristallo 2F Duratex ®",
    "line": "cristallo",
    "sellPrice15": 1523.54,
    "fitaCod": "00020REH04X22-11/26",
    "fitaName": "GIANDUIA 0.4 x 22 mm CRISTALLO REHAU ®",
    "cod6": "00020DUR6-11/26",
    "name6": "MDF 6 gianduia cristallo 2F Duratex ®",
    "sellPrice6": 1076.42
  },
  {
    "id": "00021dur15-11-26",
    "label": "Larnaca Cristallo 2F Duratex C/V (15 X 2700 X 1800)",
    "tierLabel": "Linha Cristallo",
    "hex": "#c4a47c",
    "grain": false,
    "gloss": true,
    "note": "MDF cristallo LARNACA CRISTALLO 2F DURATEX ® C/V (15 x 2700 x 1800)",
    "cod15": "00021DUR15-11/26",
    "name15": "MDF cristallo LARNACA CRISTALLO 2F DURATEX ® C/V (15 x 2700 x 1800)",
    "line": "cristallo",
    "sellPrice15": 1177.31,
    "fitaCod": "00021REH",
    "fitaName": "",
    "cod6": "00021DUR6-11/26",
    "name6": "MDF 6 Larnaca Cristallo 2F Duratex ®",
    "sellPrice6": 878.32
  },
  {
    "id": "00023dur15-11-26",
    "label": "Pau Ferro Natural Cristallo",
    "tierLabel": "Linha Cristallo",
    "hex": "#6f4e37",
    "grain": true,
    "gloss": true,
    "note": "MDF 15 pau ferro natural cristallo 2F Duratex ®",
    "cod15": "00023DUR15-11/26",
    "name15": "MDF 15 pau ferro natural cristallo 2F Duratex ®",
    "line": "cristallo",
    "sellPrice15": 1523.54,
    "fitaCod": "00023REH1X63-11/26",
    "fitaName": "PAU FERRO 1 x 63 mm REHAU ® 18M/PAU FERRO 1 x 22 mm REHAU ® 18M/PAU FERRO NATURAL 0.4 x 22 mm CRISTALLO REHAU ®",
    "cod6": "00023DUR6-11/26",
    "name6": "MDF 6 pau ferro natural cristallo 2F Duratex ®",
    "sellPrice6": 1151.38
  },
  {
    "id": "00024dur15-11-26",
    "label": "Alamo Cristallo",
    "tierLabel": "Linha Cristallo",
    "hex": "#b9ab99",
    "grain": true,
    "gloss": true,
    "note": "MDF 15 alamo cristallo 2F Duratex ®",
    "cod15": "00024DUR15-11/26",
    "name15": "MDF 15 alamo cristallo 2F Duratex ®",
    "line": "cristallo",
    "sellPrice15": 1293.67,
    "fitaCod": "00024REH04X19-11/26",
    "fitaName": "ALAMO 0.4 x 19 mm REHAU ®",
    "cod6": "00024DUR6-11/26",
    "name6": "MDF 6 alamo cristallo 2F Duratex ®",
    "sellPrice6": 1037.98
  },
  {
    "id": "00025dur15-11-26",
    "label": "Preto Cristallo",
    "tierLabel": "Linha Cristallo",
    "hex": "#232528",
    "grain": false,
    "gloss": true,
    "note": "MDF 15 preto cristallo 2F Duratex ®",
    "cod15": "00025DUR15-11/26",
    "name15": "MDF 15 preto cristallo 2F Duratex ®",
    "line": "cristallo",
    "sellPrice15": 1523.54,
    "fitaCod": "00025REH04X19-11/26",
    "fitaName": "PRETO 0.4 x 19 mm CRISTALLO REHAU ®",
    "cod6": "00025DUR6-11/26",
    "name6": "MDF 6  Preto Cristalo 1F Duratex ®",
    "sellPrice6": 977.45
  },
  {
    "id": "00026dur15-11-26",
    "label": "Titanio Cristallo",
    "tierLabel": "Linha Cristallo",
    "hex": "#c8cac6",
    "grain": false,
    "gloss": true,
    "note": "MDF 15 titanio cristallo 2F Duratex ®",
    "cod15": "00026DUR15-11/26",
    "name15": "MDF 15 titanio cristallo 2F Duratex ®",
    "line": "cristallo",
    "sellPrice15": 1523.54,
    "fitaCod": "00026REH",
    "fitaName": "",
    "cod6": "00026DUR6-11/26",
    "name6": "MDF 6 titanio cristallo 2F Duratex ®",
    "sellPrice6": 1122.35
  },
  {
    "id": "00027dur15-11-26",
    "label": "Cinza Sagrado Cristallo",
    "tierLabel": "Linha Cristallo",
    "hex": "#a7acb2",
    "grain": false,
    "gloss": true,
    "note": "MDF 15 cinza sagrado cristallo 2F Duratex ®",
    "cod15": "00027DUR15-11/26",
    "name15": "MDF 15 cinza sagrado cristallo 2F Duratex ®",
    "line": "cristallo",
    "sellPrice15": 1523.54,
    "fitaCod": "00027REA04X19-11/26",
    "fitaName": "CINZA SAGRADO 0.4 x 19 mm CRISTALLO PROADEC ®/CINZA SAGRADO 0.4 x 35 mm REHAU ®/CINZA SAGRADO 1 x 63 mm REHAU ®(25M)",
    "cod6": "00027DUR6-11/26",
    "name6": "MDF 6 cinza sagrado cristallo 2F Duratex ®",
    "sellPrice6": 1076.42
  },
  {
    "id": "00028dur15-11-26",
    "label": "Ultramarino Cristallo",
    "tierLabel": "Linha Cristallo",
    "hex": "#3a6b8c",
    "grain": false,
    "gloss": true,
    "note": "MDF 15 ultramarino cristallo 2F Duratex ®",
    "cod15": "00028DUR15-11/26",
    "name15": "MDF 15 ultramarino cristallo 2F Duratex ®",
    "line": "cristallo",
    "sellPrice15": 1526.05,
    "fitaCod": "00028REH04X22-11/26",
    "fitaName": "ULTRAMARINO 0.4 x 22 mm CRISTALLO REHAU ®",
    "cod6": "00028DUR6-11/26",
    "name6": "MDF 6 ultramarino cristallo 2F Duratex ®",
    "sellPrice6": 1076.42
  },
  {
    "id": "00029dur15-11-26",
    "label": "Noturno Cristallo",
    "tierLabel": "Linha Cristallo",
    "hex": "#1e3a5f",
    "grain": false,
    "gloss": true,
    "note": "MDF 15 noturno cristallo 2F Duratex ®",
    "cod15": "00029DUR15-11/26",
    "name15": "MDF 15 noturno cristallo 2F Duratex ®",
    "line": "cristallo",
    "sellPrice15": 1526.05,
    "fitaCod": "00029REH04X22-11/26",
    "fitaName": "NOTURNO 0.4 x 22 mm CRISTALLO REHAU ®",
    "cod6": "00029DUR6-11/26",
    "name6": "MDF 6 noturno cristallo 2F Duratex ®",
    "sellPrice6": 1076.42
  },
  {
    "id": "00030dur15-11-26",
    "label": "Croma Cristallo",
    "tierLabel": "Linha Cristallo",
    "hex": "#c8cac6",
    "grain": false,
    "gloss": true,
    "note": "MDF 15 croma cristallo 2F Duratex ®",
    "cod15": "00030DUR15-11/26",
    "name15": "MDF 15 croma cristallo 2F Duratex ®",
    "line": "cristallo",
    "sellPrice15": 1526.05,
    "fitaCod": "00030REH04X22-11/26",
    "fitaName": "CROMA 0.4 x 22 mm CRISTALLO REHAU ®",
    "cod6": "00096DUR6-11/26",
    "name6": "MDF 6mm padrão compatível",
    "sellPrice6": 1026.06
  },
  {
    "id": "00031dur15-11-26",
    "label": "Cinza Fossil Cristallo",
    "tierLabel": "Linha Cristallo",
    "hex": "#a7acb2",
    "grain": false,
    "gloss": true,
    "note": "MDF 15 cinza fossil cristallo 2F Duratex ®",
    "cod15": "00031DUR15-11/26",
    "name15": "MDF 15 cinza fossil cristallo 2F Duratex ®",
    "line": "cristallo",
    "sellPrice15": 1434.34,
    "fitaCod": "00031REH4X22-11/26",
    "fitaName": "CINZA FOSSIL 0.4 x 22 mm REHAU ®",
    "cod6": "00031DUR6-11/26",
    "name6": "MDF 6 Cinza Fossil Mate 2F Duratex ®",
    "sellPrice6": 882.03
  },
  {
    "id": "00032dur15-11-26",
    "label": "Preto Acetinatta",
    "tierLabel": "Linha Acetinatta",
    "hex": "#232528",
    "grain": false,
    "gloss": false,
    "note": "MDF Acetinatta 15 preto acetinatta 2F Duratex ®",
    "cod15": "00032DUR15-11/26",
    "name15": "MDF Acetinatta 15 preto acetinatta 2F Duratex ®",
    "line": "acetinatta",
    "sellPrice15": 2024.87,
    "fitaCod": "00032REH",
    "fitaName": "",
    "cod6": "00096DUR6-11/26",
    "name6": "MDF 6mm padrão compatível",
    "sellPrice6": 690.0
  },
  {
    "id": "00033dur15-11-26",
    "label": "Branco Diamante Acetinatta",
    "tierLabel": "Linha Acetinatta",
    "hex": "#f2f1ec",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 branco diamante acetinatta 2F Duratex ®",
    "cod15": "00033DUR15-11/26",
    "name15": "MDF 15 branco diamante acetinatta 2F Duratex ®",
    "line": "acetinatta",
    "sellPrice15": 2024.87,
    "fitaCod": "00033REH",
    "fitaName": "",
    "cod6": "00096DUR6-11/26",
    "name6": "MDF 6mm padrão compatível",
    "sellPrice6": 690.0
  },
  {
    "id": "00035dur15-11-26",
    "label": "Tartufo Acetinatta",
    "tierLabel": "Linha Acetinatta",
    "hex": "#4a4d52",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 tartufo acetinatta 2F Duratex ®",
    "cod15": "00035DUR15-11/26",
    "name15": "MDF 15 tartufo acetinatta 2F Duratex ®",
    "line": "acetinatta",
    "sellPrice15": 2024.87,
    "fitaCod": "00035REH04X22-11/26",
    "fitaName": "TARTUFO 0.4 x 22 mm ACETINATTA REHAU ®",
    "cod6": "00096DUR6-11/26",
    "name6": "MDF 6mm padrão compatível",
    "sellPrice6": 690.0
  },
  {
    "id": "00036dur15-11-26",
    "label": "Maranta",
    "tierLabel": "Linha Conceito",
    "hex": "#b9ab99",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 maranta 2F Duratex ®",
    "cod15": "00036DUR15-11/26",
    "name15": "MDF 15 maranta 2F Duratex ®",
    "line": "conceito",
    "sellPrice15": 1151.38,
    "fitaCod": "00035REH04X22-11/26",
    "fitaName": "MARANTA 0.4 x 22 mm REHAU ®",
    "cod6": "00096DUR6-11/26",
    "name6": "MDF 6mm padrão compatível",
    "sellPrice6": 780.17
  },
  {
    "id": "00037dur15-11-26",
    "label": "Carvalho Avela Design",
    "tierLabel": "Linha Design",
    "hex": "#c4a47c",
    "grain": true,
    "gloss": false,
    "note": "MDF 15 carvalho avela design 2F Duratex ®",
    "cod15": "00037DUR15-11/26",
    "name15": "MDF 15 carvalho avela design 2F Duratex ®",
    "line": "design",
    "sellPrice15": 1251.0,
    "fitaCod": "00037REH04X19-11/26",
    "fitaName": "CARVALHO AVELA REHAU ®",
    "cod6": "00037DUR6-11/26",
    "name6": "MDF 6 carvalho avela design 2F Duratex ®",
    "sellPrice6": 882.03
  },
  {
    "id": "00038dur15-11-26",
    "label": "Carvalho Berlin Design",
    "tierLabel": "Linha Design",
    "hex": "#c4a47c",
    "grain": true,
    "gloss": false,
    "note": "MDF 15 carvalho berlin design 2F Duratex ®",
    "cod15": "00038DUR15-11/26",
    "name15": "MDF 15 carvalho berlin design 2F Duratex ®",
    "line": "design",
    "sellPrice15": 1251.0,
    "fitaCod": "00038REH04X19-11/26",
    "fitaName": "CARVALHO BERLIN REHAU ®",
    "cod6": "00038DUR6-11/26",
    "name6": "MDF 6 carvalho berlin design 2F Duratex ®",
    "sellPrice6": 882.03
  },
  {
    "id": "00039dur15-11-26",
    "label": "Carvalho Hanover Design",
    "tierLabel": "Linha Design",
    "hex": "#c4a47c",
    "grain": true,
    "gloss": false,
    "note": "MDF 15 carvalho hanover design 2F Duratex ®",
    "cod15": "00039DUR15-11/26",
    "name15": "MDF 15 carvalho hanover design 2F Duratex ®",
    "line": "design",
    "sellPrice15": 1251.0,
    "fitaCod": "00039REH04X19-11/26",
    "fitaName": "CARVALHO HANOVER REHAU ®",
    "cod6": "00039DUR6-11/26",
    "name6": "MDF 6 carvalho hanover design 2F Duratex ®",
    "sellPrice6": 882.03
  },
  {
    "id": "00040dur15-11-26",
    "label": "Carvalho Malva Design",
    "tierLabel": "Linha Design",
    "hex": "#c4a47c",
    "grain": true,
    "gloss": false,
    "note": "MDF 15 carvalho malva design 2F Duratex ®",
    "cod15": "00040DUR15-11/26",
    "name15": "MDF 15 carvalho malva design 2F Duratex ®",
    "line": "design",
    "sellPrice15": 1251.0,
    "fitaCod": "00040REH04X22-11/26",
    "fitaName": "CARVALHO MALVA 0.4 x 22 mm REHAU ®",
    "cod6": "00040DUR6-11/26",
    "name6": "MDF 6 carvalho malva design 2F Duratex ®",
    "sellPrice6": 882.03
  },
  {
    "id": "00041dur15-11-26",
    "label": "Carvalho Munique Design",
    "tierLabel": "Linha Design",
    "hex": "#c4a47c",
    "grain": true,
    "gloss": false,
    "note": "MDF 15 carvalho munique design 2F Duratex ®",
    "cod15": "00041DUR15-11/26",
    "name15": "MDF 15 carvalho munique design 2F Duratex ®",
    "line": "design",
    "sellPrice15": 1151.38,
    "fitaCod": "00041REH04X22-11/26",
    "fitaName": "CARVALHO MUNIQUE 0.4 x 22 mm REHAU ®",
    "cod6": "00041DUR6-11/26",
    "name6": "MDF 6 carvalho munique design 2F Duratex ®",
    "sellPrice6": 789.17
  },
  {
    "id": "00042dur15-11-26",
    "label": "Ibiza Design",
    "tierLabel": "Linha Design",
    "hex": "#b9ab99",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 ibiza design 2F Duratex ®",
    "cod15": "00042DUR15-11/26",
    "name15": "MDF 15 ibiza design 2F Duratex ®",
    "line": "design",
    "sellPrice15": 1151.38,
    "fitaCod": "00042REH04X22-11/26",
    "fitaName": "IBIZA 0.4 x 22 mm REHAU ®/CARVALHO IBIZA 0.4 x 19 mm REHAU ®",
    "cod6": "00042DUR6-11/26",
    "name6": "MDF 6 ibiza design 2F Duratex ®",
    "sellPrice6": 789.17
  },
  {
    "id": "00043dur15-11-26",
    "label": "Trancoso Design",
    "tierLabel": "Linha Design",
    "hex": "#b9ab99",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 trancoso design 2F Duratex ®",
    "cod15": "00043DUR15-11/26",
    "name15": "MDF 15 trancoso design 2F Duratex ®",
    "line": "design",
    "sellPrice15": 1151.38,
    "fitaCod": "00043REH04X19-11/26",
    "fitaName": "TRANCOSO 0.4 x 19 mm REHAU ®",
    "cod6": "00043DUR6-11/26",
    "name6": "MDF 6 trancoso design 2F Duratex ®",
    "sellPrice6": 789.17
  },
  {
    "id": "00044dur15-11-26",
    "label": "Nogueira Caiena",
    "tierLabel": "Linha Design",
    "hex": "#6f4e37",
    "grain": true,
    "gloss": false,
    "note": "MDF 15 nogueira caiena 2F Duratex ®",
    "cod15": "00044DUR15-11/26",
    "name15": "MDF 15 nogueira caiena 2F Duratex ®",
    "line": "design",
    "sellPrice15": 1251.0,
    "fitaCod": "00044REH04X22-11/26",
    "fitaName": "NOGUEIRA CAIENA 0.4 x 22 mm REHAU ®",
    "cod6": "00044DUR6-11/26",
    "name6": "MDF 6 nogueira caiena 2F Duratex ®",
    "sellPrice6": 882.03
  },
  {
    "id": "00045dur15-11-26",
    "label": "Carvalho Malva Design Ultra Resist. Umidade",
    "tierLabel": "Linha Design",
    "hex": "#c4a47c",
    "grain": true,
    "gloss": false,
    "note": "MDF 15 carvalho malva design ultra 2F Duratex ® Resist. Umidade",
    "cod15": "00045DUR15-11/26",
    "name15": "MDF 15 carvalho malva design ultra 2F Duratex ® Resist. Umidade",
    "line": "design",
    "sellPrice15": 1251.0,
    "fitaCod": "00045REH",
    "fitaName": "",
    "cod6": "00045DUR6-11/26",
    "name6": "MDF 6 carvalho malva design ultra 2F Duratex ® Resist. Umidade",
    "sellPrice6": 882.03
  },
  {
    "id": "00046dur15-11-26",
    "label": "Moss Absoluto Design",
    "tierLabel": "Linha Design",
    "hex": "#385746",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 moss absoluto design 2F Duratex ®",
    "cod15": "00046DUR15-11/26",
    "name15": "MDF 15 moss absoluto design 2F Duratex ®",
    "line": "design",
    "sellPrice15": 1251.0,
    "fitaCod": "00046REH04X22-11/26",
    "fitaName": "MOSS 0.4 x 22 mm REHAU ®/MOSS 0.4 x 64 mm REHAU ®",
    "cod6": "00096DUR6-11/26",
    "name6": "MDF 6mm padrão compatível",
    "sellPrice6": 858.22
  },
  {
    "id": "00047dur15-11-26",
    "label": "Preto Absoluto Design",
    "tierLabel": "Linha Design",
    "hex": "#232528",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 preto absoluto design 2F Duratex ®",
    "cod15": "00047DUR15-11/26",
    "name15": "MDF 15 preto absoluto design 2F Duratex ®",
    "line": "design",
    "sellPrice15": 1251.0,
    "fitaCod": "00047REH",
    "fitaName": "",
    "cod6": "00047DUR6-11/26",
    "name6": "MDF 6 preto absoluto2F Duratex ®",
    "sellPrice6": 882.03
  },
  {
    "id": "00048dur15-11-26",
    "label": "Brise",
    "tierLabel": "Linha Design",
    "hex": "#b9ab99",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 brise 2F Duratex ®",
    "cod15": "00048DUR15-11/26",
    "name15": "MDF 15 brise 2F Duratex ®",
    "line": "design",
    "sellPrice15": 1251.0,
    "fitaCod": "00048REH",
    "fitaName": "",
    "cod6": "00048DUR6-11/26",
    "name6": "MDF 6 brise 2F Duratex ®",
    "sellPrice6": 851.14
  },
  {
    "id": "00049dur15-11-26",
    "label": "Nogueira Flórida Design",
    "tierLabel": "Linha Design",
    "hex": "#6f4e37",
    "grain": true,
    "gloss": false,
    "note": "MDF 15 Nogueira  Flórida design 2F Duratex ®",
    "cod15": "00049DUR15-11/26",
    "name15": "MDF 15 Nogueira  Flórida design 2F Duratex ®",
    "line": "design",
    "sellPrice15": 1251.0,
    "fitaCod": "00049REH04X22-11/26",
    "fitaName": "NOGUEIRA FLORIDA 0.4 x 22 mm REHAU ®",
    "cod6": "00049DUR6-11/26",
    "name6": "MDF 6 Nogueira  Flórida 2F Duratex ®",
    "sellPrice6": 882.03
  },
  {
    "id": "00050dur15-11-26",
    "label": "Nogueira Thar",
    "tierLabel": "Linha Design",
    "hex": "#6f4e37",
    "grain": true,
    "gloss": false,
    "note": "MDF 15 nogueira thar 2F Duratex ®",
    "cod15": "00050DUR15-11/26",
    "name15": "MDF 15 nogueira thar 2F Duratex ®",
    "line": "design",
    "sellPrice15": 1251.0,
    "fitaCod": "00050REH04X22-11/26",
    "fitaName": "NOGUEIRA THAR 0.4 x 22 mm DESIGN REHAU ®",
    "cod6": "00050DUR6-11/26",
    "name6": "MDF 6 nogueira thar 2F Duratex ®",
    "sellPrice6": 882.03
  },
  {
    "id": "00051dur15-11-26",
    "label": "Perola Absoluto Design",
    "tierLabel": "Linha Design",
    "hex": "#f2f1ec",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 perola absoluto design 2F Duratex ®",
    "cod15": "00051DUR15-11/26",
    "name15": "MDF 15 perola absoluto design 2F Duratex ®",
    "line": "design",
    "sellPrice15": 1251.0,
    "fitaCod": "00051REH",
    "fitaName": "",
    "cod6": "00096DUR6-11/26",
    "name6": "MDF 6mm padrão compatível",
    "sellPrice6": 858.22
  },
  {
    "id": "00052dur15-11-26",
    "label": "Carvalho Batur Essencial Wood",
    "tierLabel": "Linha Essencial",
    "hex": "#c4a47c",
    "grain": true,
    "gloss": false,
    "note": "MDF 15 carvalho batur essencial wood  2F Duratex ®",
    "cod15": "00052DUR15-11/26",
    "name15": "MDF 15 carvalho batur essencial wood  2F Duratex ®",
    "line": "essencial",
    "sellPrice15": 1176.05,
    "fitaCod": "00052REH04X22-11/26",
    "fitaName": "CARVALHO BATUR 0.4 x 22 mm ESSENCIAL WOOD REHAU ®",
    "cod6": "00052DUR6-11/26",
    "name6": "MDF 6 carvalho batur 2F Duratex ®",
    "sellPrice6": 851.14
  },
  {
    "id": "00053dur15-11-26",
    "label": "Jequitiba Rosa Essencial Wood",
    "tierLabel": "Linha Essencial",
    "hex": "#d8a7a7",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 jequitiba rosa essencial wood 2F Duratex ®",
    "cod15": "00053DUR15-11/26",
    "name15": "MDF 15 jequitiba rosa essencial wood 2F Duratex ®",
    "line": "essencial",
    "sellPrice15": 1176.05,
    "fitaCod": "00053REH04X22-11/26",
    "fitaName": "Fita 0.4 X 22 Mm Jequitiba Rosa Rehau/JEQUITIBA ROSA 0.4 x 35 mm REHAU ®",
    "cod6": "00053DUR6-11/26",
    "name6": "MDF 6 jequitiba rosa 2F Duratex ®",
    "sellPrice6": 851.14
  },
  {
    "id": "00054dur15-11-26",
    "label": "Hibisco Essencial",
    "tierLabel": "Linha Essencial",
    "hex": "#b9ab99",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 hibisco essencial 2F Duratex ®",
    "cod15": "00054DUR15-11/26",
    "name15": "MDF 15 hibisco essencial 2F Duratex ®",
    "line": "essencial",
    "sellPrice15": 1173.86,
    "fitaCod": "00054REH045X22-11/26",
    "fitaName": "HIBISCO 0.45 x 22 mm ESSENCIAL REHAU ®",
    "cod6": "00054DUR6-11/26",
    "name6": "MDF 6 hibisco essencial 2F Duratex ®",
    "sellPrice6": 851.14
  },
  {
    "id": "00055dur15-11-26",
    "label": "Itapua Essencial Wood",
    "tierLabel": "Linha Essencial",
    "hex": "#b9ab99",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 itapua essencial wood 2F Duratex ®",
    "cod15": "00055DUR15-11/26",
    "name15": "MDF 15 itapua essencial wood 2F Duratex ®",
    "line": "essencial",
    "sellPrice15": 1176.05,
    "fitaCod": "00055REH04X22-11/26",
    "fitaName": "ITAPUA 0.4 x 22 mm REHAU ®/ITAPUA 0.4 x 35 mm REHAU ®/ITAPUA 1 x 22 mm REHAU ® (25M)/ITAPUA 1 x 35 mm REHAU ® (25M)",
    "cod6": "00055DUR6-11/26",
    "name6": "MDF 6 itapua essencial wood 2F Duratex ®",
    "sellPrice6": 851.14
  },
  {
    "id": "00056dur15-11-26",
    "label": "Alamo Essencial Wood",
    "tierLabel": "Linha Essencial",
    "hex": "#b9ab99",
    "grain": true,
    "gloss": false,
    "note": "MDF 15 alamo essencial wood 2F Duratex ®",
    "cod15": "00056DUR15-11/26",
    "name15": "MDF 15 alamo essencial wood 2F Duratex ®",
    "line": "essencial",
    "sellPrice15": 1151.38,
    "fitaCod": "00056REH04X22-11/26",
    "fitaName": "ALAMO 0.4 x 19 mm REHAU ®",
    "cod6": "00056DUR6-11/26",
    "name6": "MDF 6 alamo essencial wood 2F Duratex ®",
    "sellPrice6": 851.14
  },
  {
    "id": "00057dur15-11-26",
    "label": "Rovere Marsala Essencial Wood",
    "tierLabel": "Linha Essencial",
    "hex": "#c4a47c",
    "grain": true,
    "gloss": false,
    "note": "MDF 15 rovere marsala essencial wood 2F Duratex ®",
    "cod15": "00057DUR15-11/26",
    "name15": "MDF 15 rovere marsala essencial wood 2F Duratex ®",
    "line": "essencial",
    "sellPrice15": 1151.38,
    "fitaCod": "00057REH04X19-11/26",
    "fitaName": "ROVERE CANOVA 0.4 x 19 mm REHAU ®",
    "cod6": "00057DUR6-11/26",
    "name6": "MDF 6 rovere marsala essencial wood 1F Duratex ®",
    "sellPrice6": 789.17
  },
  {
    "id": "00058dur15-11-26",
    "label": "Freijo Puro Essencial Wood",
    "tierLabel": "Linha Essencial",
    "hex": "#9e6b3f",
    "grain": true,
    "gloss": false,
    "note": "MDF 15 freijo puro essencial wood 2F Duratex ®",
    "cod15": "00058DUR15-11/26",
    "name15": "MDF 15 freijo puro essencial wood 2F Duratex ®",
    "line": "essencial",
    "sellPrice15": 1151.33,
    "fitaCod": "00058REH04X35-11/26",
    "fitaName": "FREIJO PURO 0.4 x 35 mm REHAU ®",
    "cod6": "00058DUR6-11/26",
    "name6": "MDF 6 freijo puro essencial wood 2F Duratex ®",
    "sellPrice6": 851.14
  },
  {
    "id": "00059dur15-11-26",
    "label": "Cumaru Raiz Essencial Wood",
    "tierLabel": "Linha Essencial",
    "hex": "#b9ab99",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 cumaru raiz essencial wood 2F Duratex ®",
    "cod15": "00059DUR15-11/26",
    "name15": "MDF 15 cumaru raiz essencial wood 2F Duratex ®",
    "line": "essencial",
    "sellPrice15": 1176.05,
    "fitaCod": "00059REH04X22-11/26",
    "fitaName": "CUMARU RAIZ 0.4 x 22 mm REHAU ®",
    "cod6": "00059DUR6-11/26",
    "name6": "MDF 6 cumaru raiz essencial wood 2F Duratex ®",
    "sellPrice6": 851.14
  },
  {
    "id": "00060dur15-11-26",
    "label": "Freijo Puro Essencial Wood Ultra Resist. Umidade",
    "tierLabel": "Linha Essencial",
    "hex": "#9e6b3f",
    "grain": true,
    "gloss": false,
    "note": "MDF 15 freijo puro essencial wood ultra 2F Duratex ® Resist. Umidade",
    "cod15": "00060DUR15-11/26",
    "name15": "MDF 15 freijo puro essencial wood ultra 2F Duratex ® Resist. Umidade",
    "line": "essencial",
    "sellPrice15": 1275.97,
    "fitaCod": "00060REH",
    "fitaName": "",
    "cod6": "00060DUR6-11/26",
    "name6": "MDF 6 freijo puro essencial wood ultra 2F Duratex ® Resist. Umidade",
    "sellPrice6": 882.03
  },
  {
    "id": "00061dur15-11-26",
    "label": "Nogueira Asti Essencial Wood",
    "tierLabel": "Linha Essencial",
    "hex": "#6f4e37",
    "grain": true,
    "gloss": false,
    "note": "MDF 15 nogueira asti essencial wood 2F Duratex ®",
    "cod15": "00061DUR15-11/26",
    "name15": "MDF 15 nogueira asti essencial wood 2F Duratex ®",
    "line": "essencial",
    "sellPrice15": 1176.05,
    "fitaCod": "00061REH04X22-11/26",
    "fitaName": "NOGUEIRA ASTI 0.4 x 22 mm REHAU ®/NOGUEIRA ASTI 0.4 x 35 mm REHAU ®",
    "cod6": "00061DUR6-11/26",
    "name6": "MDF 6 nogueira asti essencial wood 2F Duratex ®",
    "sellPrice6": 851.14
  },
  {
    "id": "00062dur15-11-26",
    "label": "Pau Ferro Natural Essencial Wood",
    "tierLabel": "Linha Essencial",
    "hex": "#6f4e37",
    "grain": true,
    "gloss": false,
    "note": "MDF 15 pau ferro natural essencial wood 2F Duratex ®",
    "cod15": "00062DUR15-11/26",
    "name15": "MDF 15 pau ferro natural essencial wood 2F Duratex ®",
    "line": "essencial",
    "sellPrice15": 1176.05,
    "fitaCod": "00062REH04X22-11/26",
    "fitaName": "PAU FERRO NATURAL 0.4 x 22 mm ESSENCIAL REHAU",
    "cod6": "00096DUR6-11/26",
    "name6": "MDF 6mm padrão compatível",
    "sellPrice6": 827.21
  },
  {
    "id": "00063dur15-11-26",
    "label": "Noce California Essencial",
    "tierLabel": "Linha Essencial",
    "hex": "#b9ab99",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 noce california essencial 2F Duratex ®",
    "cod15": "00063DUR15-11/26",
    "name15": "MDF 15 noce california essencial 2F Duratex ®",
    "line": "essencial",
    "sellPrice15": 950.52,
    "fitaCod": "00063REH04X19-11/26",
    "fitaName": "NOCE CALIFORNIA 0.4 x 19 mm CRISTALLO REHAU ®",
    "cod6": "00063DUR6-11/26",
    "name6": "MDF 6 noce california essencial 2F Duratex ®",
    "sellPrice6": 709.91
  },
  {
    "id": "00064dur15-11-26",
    "label": "Noce Amendoa Essencial",
    "tierLabel": "Linha Essencial",
    "hex": "#b9ab99",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 noce amendoa essencial 2F Duratex ®",
    "cod15": "00064DUR15-11/26",
    "name15": "MDF 15 noce amendoa essencial 2F Duratex ®",
    "line": "essencial",
    "sellPrice15": 989.15,
    "fitaCod": "00064REH04X35-11/26",
    "fitaName": "NOCE AMENDOA 0.4 x 22 mm REHAU ®/NOCE AMENDOA 0.4 x 35 mm REHAU ®",
    "cod6": "00064DUR6-11/26",
    "name6": "MDF 6 noce amendoa essencial 2F Duratex ®",
    "sellPrice6": 709.91
  },
  {
    "id": "00065dur15-11-26",
    "label": "Rosa Infinito Essencial",
    "tierLabel": "Linha Essencial",
    "hex": "#d8a7a7",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 rosa infinito essencial 2F Duratex ®",
    "cod15": "00065DUR15-11/26",
    "name15": "MDF 15 rosa infinito essencial 2F Duratex ®",
    "line": "essencial",
    "sellPrice15": 1173.86,
    "fitaCod": "00065REH04X22-11/26",
    "fitaName": "ROSA INFINITO 0.4 x 22 mm REHAU ®",
    "cod6": "00065DUR6-11/26",
    "name6": "MDF 6 rosa infinito 2F Duratex ®",
    "sellPrice6": 851.14
  },
  {
    "id": "00066dur15-11-26",
    "label": "Perola Urbana Essencial",
    "tierLabel": "Linha Essencial",
    "hex": "#f2f1ec",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 perola urbana essencial 2F Duratex ®",
    "cod15": "00066DUR15-11/26",
    "name15": "MDF 15 perola urbana essencial 2F Duratex ®",
    "line": "essencial",
    "sellPrice15": 1173.86,
    "fitaCod": "00066REH",
    "fitaName": "",
    "cod6": "00066DUR6-11/26",
    "name6": "MDF 6 perola urbana essencial 2F Duratex ®",
    "sellPrice6": 851.14
  },
  {
    "id": "00067dur15-11-26",
    "label": "Marrom Retro Essencial",
    "tierLabel": "Linha Essencial",
    "hex": "#b9ab99",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 marrom retro essencial 2F Duratex ®",
    "cod15": "00067DUR15-11/26",
    "name15": "MDF 15 marrom retro essencial 2F Duratex ®",
    "line": "essencial",
    "sellPrice15": 1173.86,
    "fitaCod": "00067REH04X22-11/26",
    "fitaName": "MARROM RETRO 0.45 x 22 mm ESSENCIAL REHAU ®",
    "cod6": "00067DUR6-11/26",
    "name6": "MDF 6 marrom retro essencial 2F Duratex ®",
    "sellPrice6": 851.14
  },
  {
    "id": "00068dur15-11-26",
    "label": "Blush Essencial",
    "tierLabel": "Linha Essencial",
    "hex": "#d8a7a7",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 blush essencial 2F Duratex ®",
    "cod15": "00068DUR15-11/26",
    "name15": "MDF 15 blush essencial 2F Duratex ®",
    "line": "essencial",
    "sellPrice15": 1173.86,
    "fitaCod": "00068REH04X22-11/26",
    "fitaName": "BLUSH 0.4 x 22 mm ESSENCIAL REHAU ®",
    "cod6": "00068DUR6-11/26",
    "name6": "MDF 6 blush essencial 2F Duratex ®",
    "sellPrice6": 851.14
  },
  {
    "id": "00069dur15-11-26",
    "label": "Bege Papiro Essencial",
    "tierLabel": "Linha Essencial",
    "hex": "#b9ab99",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 bege papiro essencial 2F Duratex ®",
    "cod15": "00069DUR15-11/26",
    "name15": "MDF 15 bege papiro essencial 2F Duratex ®",
    "line": "essencial",
    "sellPrice15": 1173.86,
    "fitaCod": "00069REH045X22-11/26",
    "fitaName": "BEGE PAPIRO 0.45 x 22 mm ESSENCIAL REHAU ®",
    "cod6": "00069DUR6-11/26",
    "name6": "MDF 6 bege papiro essencial 2F Duratex ®",
    "sellPrice6": 851.14
  },
  {
    "id": "00070dur15-11-26",
    "label": "Pinole Essencial",
    "tierLabel": "Linha Essencial",
    "hex": "#b9ab99",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 pinole essencial  2F Duratex ®",
    "cod15": "00070DUR15-11/26",
    "name15": "MDF 15 pinole essencial  2F Duratex ®",
    "line": "essencial",
    "sellPrice15": 1173.86,
    "fitaCod": "00070REH04X22-11/26",
    "fitaName": "PINOLE 0.4 x 22 mm REHAU ®",
    "cod6": "00070DUR6-11/26",
    "name6": "MDF 6 pinole 2F Duratex ®",
    "sellPrice6": 851.14
  },
  {
    "id": "00071dur15-11-26",
    "label": "Noce Mare Essencial",
    "tierLabel": "Linha Essencial",
    "hex": "#b9ab99",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 noce mare essencial 2F Duratex ®",
    "cod15": "00071DUR15-11/26",
    "name15": "MDF 15 noce mare essencial 2F Duratex ®",
    "line": "essencial",
    "sellPrice15": 989.15,
    "fitaCod": "0071REH04X19-11/26",
    "fitaName": "NOCE MARE 0.4 x 19 mm REHAU ®/NOCE MARE 1 x 63 mm REHAU ® (25 M)",
    "cod6": "00071DUR6-11/26",
    "name6": "MDF 6 noce mare essencial 2F Duratex ®",
    "sellPrice6": 709.91
  },
  {
    "id": "00072dur15-11-26",
    "label": "Branco Diamante Essencial",
    "tierLabel": "Linha Essencial",
    "hex": "#f2f1ec",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 branco diamante essencial 2F Duratex ®",
    "cod15": "00072DUR15-11/26",
    "name15": "MDF 15 branco diamante essencial 2F Duratex ®",
    "line": "essencial",
    "sellPrice15": 873.95,
    "fitaCod": "0072REH04X19-11/26",
    "fitaName": "BRANCO DIAMANTE 0.4 x 19 mm ESSENCIAL REHAU ®",
    "cod6": "00072DUR6-11/26",
    "name6": "MDF 6 branco diamante essencial 1F Duratex ®",
    "sellPrice6": 666.95
  },
  {
    "id": "00073dur15-11-26",
    "label": "Branco Texturizado",
    "tierLabel": "Linha Padrão",
    "hex": "#f2f1ec",
    "grain": false,
    "gloss": false,
    "note": "Mdf 15 Mm Branco Texturizado 2f Duratex ®",
    "cod15": "00073DUR15-11/26",
    "name15": "Mdf 15 Mm Branco Texturizado 2f Duratex ®",
    "line": "padrão",
    "sellPrice15": 701.5,
    "fitaCod": "00073PRO04X22-11/26",
    "fitaName": "BRANCO 0.4 x 22 mm TEXTURIZADO PROADEC ®",
    "cod6": "00073DUR6-11/26",
    "name6": "Mdf 6 Mm Branco Texturizado 2f Duratex ®",
    "sellPrice6": 564.36
  },
  {
    "id": "00074dur15-11-26",
    "label": "Cinza Sagrado Essencial",
    "tierLabel": "Linha Essencial",
    "hex": "#a7acb2",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 cinza sagrado essencial 2F Duratex ®",
    "cod15": "00074DUR15-11/26",
    "name15": "MDF 15 cinza sagrado essencial 2F Duratex ®",
    "line": "essencial",
    "sellPrice15": 1173.86,
    "fitaCod": "00074REH1X22-11/26",
    "fitaName": "CINZA SAGRADO 1 x 22 mm ESSENCIAL REHAU ® (25M)",
    "cod6": "00074DUR6-11/26",
    "name6": "MDF 6 cinza sagrado essencial 2F Duratex ®",
    "sellPrice6": 851.14
  },
  {
    "id": "00075dur15-11-26",
    "label": "Moss Essencial",
    "tierLabel": "Linha Essencial",
    "hex": "#385746",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 moss essencial 2F Duratex ®",
    "cod15": "00075DUR15-11/26",
    "name15": "MDF 15 moss essencial 2F Duratex ®",
    "line": "essencial",
    "sellPrice15": 1173.86,
    "fitaCod": "00075REH",
    "fitaName": "",
    "cod6": "00096DUR6-11/26",
    "name6": "MDF 6mm padrão compatível",
    "sellPrice6": 827.21
  },
  {
    "id": "00076dur15-11-26",
    "label": "Moss Mate",
    "tierLabel": "Linha Essencial",
    "hex": "#385746",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 moss mate 2F Duratex ®",
    "cod15": "00076DUR15-11/26",
    "name15": "MDF 15 moss mate 2F Duratex ®",
    "line": "essencial",
    "sellPrice15": 1176.07,
    "fitaCod": "00076REH",
    "fitaName": "",
    "cod6": "00076DUR6-11/26",
    "name6": "MDF 6 moss mate 2F Duratex ®",
    "sellPrice6": 851.14
  },
  {
    "id": "00077dur15-11-26",
    "label": "Mint Essencial",
    "tierLabel": "Linha Essencial",
    "hex": "#b9ab99",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 mint essencial 2F Duratex ®",
    "cod15": "00077DUR15-11/26",
    "name15": "MDF 15 mint essencial 2F Duratex ®",
    "line": "essencial",
    "sellPrice15": 1173.86,
    "fitaCod": "00077REH04X22-11/26",
    "fitaName": "MINT 0.4 x 22 mm REHAU ®",
    "cod6": "00077DUR6-11/26",
    "name6": "MDF 6 mint essencial 2F Duratex ®",
    "sellPrice6": 851.14
  },
  {
    "id": "00078dur15-11-26",
    "label": "Azul Profundo Essencial",
    "tierLabel": "Linha Essencial",
    "hex": "#1e3a5f",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 azul profundo essencial 2F Duratex ®",
    "cod15": "00078DUR15-11/26",
    "name15": "MDF 15 azul profundo essencial 2F Duratex ®",
    "line": "essencial",
    "sellPrice15": 1173.86,
    "fitaCod": "00078REH04X22-11/26",
    "fitaName": "AZUL PROFUNDO 0.4 x 22 mm REHAU ®/AZUL PROFUNDO 0.4 x 35 mm REHAU ®",
    "cod6": "00078DUR6-11/26",
    "name6": "MDF 6 azul profundo 2F Duratex ®",
    "sellPrice6": 851.14
  },
  {
    "id": "00080dur15-11-26",
    "label": "Azul Secreto Essencial",
    "tierLabel": "Linha Essencial",
    "hex": "#3a6b8c",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 azul secreto essencial 2F Duratex ®",
    "cod15": "00080DUR15-11/26",
    "name15": "MDF 15 azul secreto essencial 2F Duratex ®",
    "line": "essencial",
    "sellPrice15": 1173.86,
    "fitaCod": "00080REH",
    "fitaName": "",
    "cod6": "00080DUR6-11/26",
    "name6": "MDF 6 azul secreto essencial 2F Duratex ®",
    "sellPrice6": 851.14
  },
  {
    "id": "00081dur15-11-26",
    "label": "Prata Essencial",
    "tierLabel": "Linha Essencial",
    "hex": "#c8cac6",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 prata essencial 2F Duratex ®",
    "cod15": "00081DUR15-11/26",
    "name15": "MDF 15 prata essencial 2F Duratex ®",
    "line": "essencial",
    "sellPrice15": 1173.86,
    "fitaCod": "00081REH04X22-11/26",
    "fitaName": "PRATA 0.4 x 22 mm REHAU ®",
    "cod6": "00081DUR6-11/26",
    "name6": "MDF 6 prata essencial 2F Duratex ®",
    "sellPrice6": 851.14
  },
  {
    "id": "00083dur15-11-26",
    "label": "Cinza Sagrado Essencial Ultra Resist. Umidade",
    "tierLabel": "Linha Essencial",
    "hex": "#a7acb2",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 cinza sagrado essencial ultra 2F Duratex ® Resist. Umidade",
    "cod15": "00083DUR15-11/26",
    "name15": "MDF 15 cinza sagrado essencial ultra 2F Duratex ® Resist. Umidade",
    "line": "essencial",
    "sellPrice15": 1275.97,
    "fitaCod": "00082REH",
    "fitaName": "",
    "cod6": "00083DUR6-11/26",
    "name6": "MDF 6 cinza sagrado essencial ultra 2F Duratex ® Resist. Umidade",
    "sellPrice6": 882.03
  },
  {
    "id": "00085dur15-11-26",
    "label": "Linho Belga Sense",
    "tierLabel": "Linha Sense",
    "hex": "#a89888",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 linho belga sense 2F Duratex ®",
    "cod15": "00085DUR15-11/26",
    "name15": "MDF 15 linho belga sense 2F Duratex ®",
    "line": "sense",
    "sellPrice15": 950.25,
    "fitaCod": "00085REH04X22-11/26",
    "fitaName": "LINHO BELGA 0.4 x 22 mm SENSE REHAU ®",
    "cod6": "00085DUR6-11/26",
    "name6": "MDF 6 linho belga sense 2F Duratex ®",
    "sellPrice6": 662.26
  },
  {
    "id": "00086dur15-11-26",
    "label": "Off White Suave",
    "tierLabel": "Linha Sense",
    "hex": "#f2f1ec",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 off white suave 2F Duratex ®",
    "cod15": "00086DUR15-11/26",
    "name15": "MDF 15 off white suave 2F Duratex ®",
    "line": "sense",
    "sellPrice15": 950.25,
    "fitaCod": "00086REH04X22-11/26",
    "fitaName": "OFF WHITE 0.4 x 22 mm REHAU ®",
    "cod6": "00086DUR6-11/26",
    "name6": "MDF 6 off white suave 2F Duratex ®",
    "sellPrice6": 662.26
  },
  {
    "id": "00087dur15-11-26",
    "label": "Zinco Sense",
    "tierLabel": "Linha Sense",
    "hex": "#4a4d52",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 zinco sense 2F Duratex ®",
    "cod15": "00087DUR15-11/26",
    "name15": "MDF 15 zinco sense 2F Duratex ®",
    "line": "sense",
    "sellPrice15": 1176.05,
    "fitaCod": "00087REH04X22-11/26",
    "fitaName": "ZINCO 0.4 x 22 mm REHAU ®",
    "cod6": "00096DUR6-11/26",
    "name6": "MDF 6mm padrão compatível",
    "sellPrice6": 737.81
  },
  {
    "id": "00089dur15-11-26",
    "label": "Arenito",
    "tierLabel": "Linha Sense",
    "hex": "#a89888",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 arenito 2F Duratex ®",
    "cod15": "00089DUR15-11/26",
    "name15": "MDF 15 arenito 2F Duratex ®",
    "line": "sense",
    "sellPrice15": 1176.05,
    "fitaCod": "00089REH04X22-11/26",
    "fitaName": "ARENITO 0.4 x 22 mm REHAU ®/ARENITO 1 x 22 mm REHAU ®",
    "cod6": "00089DUR6-11/26",
    "name6": "MDF 6 arenito 2F Duratex ®",
    "sellPrice6": 851.14
  },
  {
    "id": "00090dur15-11-26",
    "label": "Fusion Sense",
    "tierLabel": "Linha Sense",
    "hex": "#b9ab99",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 fusion sense 2F Duratex ®",
    "cod15": "00090DUR15-11/26",
    "name15": "MDF 15 fusion sense 2F Duratex ®",
    "line": "sense",
    "sellPrice15": 1150.09,
    "fitaCod": "00090REH04X22-11/26",
    "fitaName": "FUSION 0.4 x 22 mm REHAU ®",
    "cod6": "00090DUR6-11/26",
    "name6": "MDF 6 fusion sense 2F Duratex ®",
    "sellPrice6": 851.14
  },
  {
    "id": "00091dur15-11-26",
    "label": "Nogueira Bourbon Thera",
    "tierLabel": "Linha Thera",
    "hex": "#6f4e37",
    "grain": true,
    "gloss": false,
    "note": "MDF 15 nogueira bourbon thera 2F Duratex ®",
    "cod15": "00091DUR15-11/26",
    "name15": "MDF 15 nogueira bourbon thera 2F Duratex ®",
    "line": "thera",
    "sellPrice15": 1251.0,
    "fitaCod": "00091REH04X22-11/26",
    "fitaName": "NOGUEIRA ASTI 0.4 x 22 mm REHAU",
    "cod6": "00091DUR6-11/26",
    "name6": "MDF 6 nogueira bourbon thera 2F Duratex ®",
    "sellPrice6": 882.03
  },
  {
    "id": "00093dur15-11-26",
    "label": "Carvalho Brun Thera",
    "tierLabel": "Linha Thera",
    "hex": "#c4a47c",
    "grain": true,
    "gloss": false,
    "note": "MDF 15 carvalho brun thera 2F Duratex ®",
    "cod15": "00093DUR15-11/26",
    "name15": "MDF 15 carvalho brun thera 2F Duratex ®",
    "line": "thera",
    "sellPrice15": 1251.0,
    "fitaCod": "00093REH04X22-11/26",
    "fitaName": "CARVALHO BRUN THERA 0.4 x 22 mm FOSCO REHAU ®",
    "cod6": "00093DUR6-11/26",
    "name6": "MDF 6 carvalho brun thera 2F Duratex ®",
    "sellPrice6": 882.03
  },
  {
    "id": "00094dur15-11-26",
    "label": "Timborana Silvestre Thera",
    "tierLabel": "Linha Thera",
    "hex": "#b9ab99",
    "grain": true,
    "gloss": false,
    "note": "MDF 15 timborana silvestre thera 2F Duratex ®",
    "cod15": "00094DUR15-11/26",
    "name15": "MDF 15 timborana silvestre thera 2F Duratex ®",
    "line": "thera",
    "sellPrice15": 1251.0,
    "fitaCod": "00094REH045X22-11/26",
    "fitaName": "TIMBORANA SILVESTRE THERA 0.4 x 22 mm FOSCO REHAU ®/TIMBORANA SILVESTRE 0.45 x 22 mm THERA REHAU ®",
    "cod6": "00094DUR6-11/26",
    "name6": "MDF 6 timborana silvestre thera 2F Duratex ®",
    "sellPrice6": 882.03
  },
  {
    "id": "00095dur15-11-26",
    "label": "Betula Thera",
    "tierLabel": "Linha Thera",
    "hex": "#c4a47c",
    "grain": true,
    "gloss": false,
    "note": "MDF 15 betula thera 2F Duratex ®",
    "cod15": "00095DUR15-11/26",
    "name15": "MDF 15 betula thera 2F Duratex ®",
    "line": "thera",
    "sellPrice15": 1251.0,
    "fitaCod": "00095REH04X22-11/26",
    "fitaName": "BETULA 0.4 x 22 mm REHAU ®",
    "cod6": "00095DUR6-11/26",
    "name6": "MDF 6 betula thera 2F Duratex ®",
    "sellPrice6": 882.03
  },
  {
    "id": "00097dur15-11-26",
    "label": "Branco Diamante Trama",
    "tierLabel": "Linha Trama",
    "hex": "#f2f1ec",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 branco diamante trama 2F Duratex ®",
    "cod15": "00097DUR15-11/26",
    "name15": "MDF 15 branco diamante trama 2F Duratex ®",
    "line": "trama",
    "sellPrice15": 1173.86,
    "fitaCod": "00097REH04X22-11/26",
    "fitaName": "BRANCO DIAMANTE TRAMA0.4 x 22 mm REHAU",
    "cod6": "00097DUR6-11/26",
    "name6": "MDF 6 branco diamante trama 2F Duratex ®",
    "sellPrice6": 782.96
  },
  {
    "id": "00098dur15-11-26",
    "label": "Carbono Trama",
    "tierLabel": "Linha Trama",
    "hex": "#232528",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 carbono trama 2F Duratex ®",
    "cod15": "00098DUR15-11/26",
    "name15": "MDF 15 carbono trama 2F Duratex ®",
    "line": "trama",
    "sellPrice15": 1151.38,
    "fitaCod": "00098REH04X19-11/26",
    "fitaName": "CARBONO 0.4 x 19 mm REHAU ®",
    "cod6": "00098DUR6-11/26",
    "name6": "MDF 6 carbono trama 2F Duratex ®",
    "sellPrice6": 789.17
  },
  {
    "id": "00099dur15-11-26",
    "label": "Gianduia Trama",
    "tierLabel": "Linha Trama",
    "hex": "#a89888",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 gianduia trama 2F Duratex ®",
    "cod15": "00099DUR15-11/26",
    "name15": "MDF 15 gianduia trama 2F Duratex ®",
    "line": "trama",
    "sellPrice15": 950.25,
    "fitaCod": "00099REH04X22-11/26",
    "fitaName": "GIANDUIA 0.4 x 22 mm TRAMA REHAU ®/GIANDUIA 1 x 22 mm TRAMA REHAU ® (25M)/GIANDUIA 0.4 x 35 mm TRAMA REHAU ®",
    "cod6": "00099DUR6-11/26",
    "name6": "MDF 6 gianduia trama 2F Duratex ®",
    "sellPrice6": 662.26
  },
  {
    "id": "00100dur15-11-26",
    "label": "Positano Trama",
    "tierLabel": "Linha Trama",
    "hex": "#b9ab99",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 positano trama 2F Duratex ®",
    "cod15": "00100DUR15-11/26",
    "name15": "MDF 15 positano trama 2F Duratex ®",
    "line": "trama",
    "sellPrice15": 904.03,
    "fitaCod": "00100REH",
    "fitaName": "",
    "cod6": "00100DUR6-11/26",
    "name6": "MDF 6 positano trama 2F Duratex ®",
    "sellPrice6": 628.85
  },
  {
    "id": "00101dur15-11-26",
    "label": "Preto Trama",
    "tierLabel": "Linha Trama",
    "hex": "#232528",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 preto trama 2F Duratex ®",
    "cod15": "00101DUR15-11/26",
    "name15": "MDF 15 preto trama 2F Duratex ®",
    "line": "trama",
    "sellPrice15": 1173.86,
    "fitaCod": "00101REH04X22-11/26",
    "fitaName": "PRETO 0.4 x 22 mm TRAMA REHAU ®",
    "cod6": "00101DUR6-11/26",
    "name6": "MDF 6 preto trama 2F Duratex ®",
    "sellPrice6": 851.14
  },
  {
    "id": "00102dur15-11-26",
    "label": "Sirena Trama",
    "tierLabel": "Linha Trama",
    "hex": "#b9ab99",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 sirena trama 2F Duratex ®",
    "cod15": "00102DUR15-11/26",
    "name15": "MDF 15 sirena trama 2F Duratex ®",
    "line": "trama",
    "sellPrice15": 856.63,
    "fitaCod": "00102REH",
    "fitaName": "",
    "cod6": "00102DUR6-11/26",
    "name6": "MDF 6 sirena trama 2F Duratex ®",
    "sellPrice6": 789.17
  },
  {
    "id": "00104dur15-11-26",
    "label": "Aurora Trama",
    "tierLabel": "Linha Trama",
    "hex": "#b9ab99",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 aurora trama 2F Duratex ®",
    "cod15": "00104DUR15-11/26",
    "name15": "MDF 15 aurora trama 2F Duratex ®",
    "line": "trama",
    "sellPrice15": 950.25,
    "fitaCod": "00104REH04X22-11/26",
    "fitaName": "AURORA 0.4 x 22 mm TRAMA REHAU ®/AURORA 0.4 x 35 mm TRAMA REHAU ®/AURORA 1 x 22 mm TRAMA REHAU ® (25M)/AURORA 1 x 63 mm REHAU ®",
    "cod6": "00104DUR6-11/26",
    "name6": "MDF 6 aurora trama 2F Duratex ®",
    "sellPrice6": 662.26
  },
  {
    "id": "00105dur15-11-26",
    "label": "Titanio Trama",
    "tierLabel": "Linha Trama",
    "hex": "#c8cac6",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 titanio trama 2F Duratex ®",
    "cod15": "00105DUR15-11/26",
    "name15": "MDF 15 titanio trama 2F Duratex ®",
    "line": "trama",
    "sellPrice15": 950.25,
    "fitaCod": "00105REH04X22-11/26",
    "fitaName": "TITANIO 0.4 x 22 mm TRAMA REHAU ®/ TITANIO 1 x 22 mm TRAMA REHAU ® 25(M)/TITANIO 1 x 63 mm TRAMA REHAU ® 25(M)",
    "cod6": "00105DUR6-11/26",
    "name6": "MDF 6 titanio trama 2F Duratex ®",
    "sellPrice6": 662.26
  },
  {
    "id": "00106dur15-11-26",
    "label": "Palha Trama",
    "tierLabel": "Linha Trama",
    "hex": "#a89888",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 palha trama 2F Duratex ®",
    "cod15": "00106DUR15-11/26",
    "name15": "MDF 15 palha trama 2F Duratex ®",
    "line": "trama",
    "sellPrice15": 950.25,
    "fitaCod": "00106REH04X22-11/26",
    "fitaName": "PALHA 0.4 x 22 mm TRAMA REHAU ®/PALHA 0.4 x 35 mm TRAMA REHAU ®/PALHA 1 x 22 mm TRAMA REHAU ®(25M)/PALHA 1 x 35 mm TRAMA REHAU ® (25M)",
    "cod6": "00106DUR6-11/26",
    "name6": "MDF 6 palha trama 2F Duratex ®",
    "sellPrice6": 662.26
  },
  {
    "id": "00107dur15-11-26",
    "label": "Preto Original",
    "tierLabel": "Linha Original",
    "hex": "#232528",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 preto original 2F Duratex ®",
    "cod15": "00107DUR15-11/26",
    "name15": "MDF 15 preto original 2F Duratex ®",
    "line": "original",
    "sellPrice15": 873.95,
    "fitaCod": "00107REH",
    "fitaName": "",
    "cod6": "00107DUR6-11/26",
    "name6": "MDF 6 preto original 2F Duratex ®",
    "sellPrice6": 716.39
  },
  {
    "id": "00108dur15-11-26",
    "label": "Preto Original Ultra Resist. Umidade",
    "tierLabel": "Linha Original",
    "hex": "#232528",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 preto original ultra 2F Duratex ® Resist. Umidade",
    "cod15": "00108DUR15-11/26",
    "name15": "MDF 15 preto original ultra 2F Duratex ® Resist. Umidade",
    "line": "original",
    "sellPrice15": 963.13,
    "fitaCod": "00108REH",
    "fitaName": "",
    "cod6": "00096DUR6-11/26",
    "name6": "MDF 6mm padrão compatível",
    "sellPrice6": 651.28
  },
  {
    "id": "00109dur15-11-26",
    "label": "Cinza Fossil Mate",
    "tierLabel": "Linha Velluto",
    "hex": "#a7acb2",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 cinza fossil mate 2F Duratex ®",
    "cod15": "00109DUR15-11/26",
    "name15": "MDF 15 cinza fossil mate 2F Duratex ®",
    "line": "velluto",
    "sellPrice15": 1251.0,
    "fitaCod": "00109REH",
    "fitaName": "",
    "cod6": "00109DUR6-11/26",
    "name6": "MDF 6 cinza fossil mate 2F Duratex ®",
    "sellPrice6": 882.03
  },
  {
    "id": "00111dur15-11-26",
    "label": "Ocre Solar Mate",
    "tierLabel": "Linha Velluto",
    "hex": "#c68b3e",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 ocre solar mate 2F Duratex ®",
    "cod15": "00111DUR15-11/26",
    "name15": "MDF 15 ocre solar mate 2F Duratex ®",
    "line": "velluto",
    "sellPrice15": 1251.0,
    "fitaCod": "00111REH04X22-11/26",
    "fitaName": "OCRE SOLAR 0.4 x 22 mm REHAU ®",
    "cod6": "00096DUR6-11/26",
    "name6": "MDF 6mm padrão compatível",
    "sellPrice6": 882.03
  },
  {
    "id": "00113dur15-11-26",
    "label": "Nazca Mate",
    "tierLabel": "Linha Velluto",
    "hex": "#b9ab99",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 nazca mate 2F Duratex ®",
    "cod15": "00113DUR15-11/26",
    "name15": "MDF 15 nazca mate 2F Duratex ®",
    "line": "velluto",
    "sellPrice15": 1251.0,
    "fitaCod": "00113REH04X22-11/26",
    "fitaName": "NAZCA 0.4 x 22 mm REHAU ®",
    "cod6": "00113DUR6-11/26",
    "name6": "MDF 6 nazca mate 2F Duratex ®",
    "sellPrice6": 882.03
  },
  {
    "id": "00115dur15-11-26",
    "label": "Gianduia Natural",
    "tierLabel": "Linha Velluto",
    "hex": "#a89888",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 gianduia natural 2F Duratex ®",
    "cod15": "00115DUR15-11/26",
    "name15": "MDF 15 gianduia natural 2F Duratex ®",
    "line": "velluto",
    "sellPrice15": 1251.0,
    "fitaCod": "00115REH04X22-11/26",
    "fitaName": "GIANDUIA NATURAL 0.4 x 22 mm REHAU ®/GIANDUIA NATURAL 0.4 x 35 mm REHAU ®",
    "cod6": "00115DUR6-11/26",
    "name6": "MDF 6 gianduia natural 2F Duratex ®",
    "sellPrice6": 882.03
  },
  {
    "id": "00116dur15-11-26",
    "label": "Arenito Conceito",
    "tierLabel": "Linha Conceito",
    "hex": "#a89888",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 arenito conceito 2F Duratex ®",
    "cod15": "00116DUR15-11/26",
    "name15": "MDF 15 arenito conceito 2F Duratex ®",
    "line": "conceito",
    "sellPrice15": 1176.05,
    "fitaCod": "00116REH",
    "fitaName": "",
    "cod6": "00116DUR6-11/26",
    "name6": "MDF 6 arenito conceito 2F Duratex ®",
    "sellPrice6": 851.14
  },
  {
    "id": "00117dur15-11-26",
    "label": "Bolonha Conceito",
    "tierLabel": "Linha Conceito",
    "hex": "#b9ab99",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 bolonha conceito 2F Duratex ®",
    "cod15": "00117DUR15-11/26",
    "name15": "MDF 15 bolonha conceito 2F Duratex ®",
    "line": "conceito",
    "sellPrice15": 1149.31,
    "fitaCod": "00117REH04X22-11/26",
    "fitaName": "BOLONHA 0.4 x 22 mm REHAU ®",
    "cod6": "00117DUR6-11/26",
    "name6": "MDF 6 bolonha conceito 2F Duratex ®",
    "sellPrice6": 709.2
  },
  {
    "id": "00120ara15-11-26",
    "label": "Cinza Cristal Chess",
    "tierLabel": "Linha Padrão",
    "hex": "#c8cac6",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 cinza cristal chess 2F Arauco ®",
    "cod15": "00120ARA15-11/26",
    "name15": "MDF 15 cinza cristal chess 2F Arauco ®",
    "line": "padrão",
    "sellPrice15": 1108.26,
    "fitaCod": "00120PRO04X35-11/26",
    "fitaName": "Fita 0.4 X 35 Mm Cinza Cristal Chess Proadec ® (rolo 20 Metros)",
    "cod6": "00120ARA6-11/26",
    "name6": "MDF 6 cinza cristal chess 2F Arauco ®",
    "sellPrice6": 769.69
  },
  {
    "id": "00129dur15-11-26",
    "label": "Inhotim Essencial Wood",
    "tierLabel": "Linha Essencial",
    "hex": "#b9ab99",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 inhotim essencial wood 2F Duratex ®",
    "cod15": "00129DUR15-11/26",
    "name15": "MDF 15 inhotim essencial wood 2F Duratex ®",
    "line": "essencial",
    "sellPrice15": 1151.38,
    "fitaCod": "",
    "fitaName": "",
    "cod6": "00129DUR6-11/26",
    "name6": "MDF 6 inhotim essencial wood 2F Duratex ®",
    "sellPrice6": 789.17
  },
  {
    "id": "00135dur15-11-26",
    "label": "Rovere Braga Thera",
    "tierLabel": "Linha Thera",
    "hex": "#c4a47c",
    "grain": true,
    "gloss": false,
    "note": "MDF 15 rovere braga thera 2F Duratex ®",
    "cod15": "00135DUR15-11/26",
    "name15": "MDF 15 rovere braga thera 2F Duratex ®",
    "line": "thera",
    "sellPrice15": 1176.07,
    "fitaCod": "",
    "fitaName": "",
    "cod6": "00096DUR6-11/26",
    "name6": "MDF 6mm padrão compatível",
    "sellPrice6": 882.03
  },
  {
    "id": "00136dur15-11-26",
    "label": "Teka Soho Thera",
    "tierLabel": "Linha Thera",
    "hex": "#9e6b3f",
    "grain": true,
    "gloss": false,
    "note": "MDF 15 teka soho thera 2F Duratex ®",
    "cod15": "00136DUR15-11/26",
    "name15": "MDF 15 teka soho thera 2F Duratex ®",
    "line": "thera",
    "sellPrice15": 1251.0,
    "fitaCod": "",
    "fitaName": "",
    "cod6": "00136DUR6-11/26",
    "name6": "MDF 6 teka soho thera 2F Duratex ®",
    "sellPrice6": 882.03
  },
  {
    "id": "016dur15-11-26",
    "label": "Branco Texturizado",
    "tierLabel": "Linha Texturizado",
    "hex": "#f2f1ec",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 branco texturizado 1F Duratex ®",
    "cod15": "016DUR15-11/26",
    "name15": "MDF 15 branco texturizado 1F Duratex ®",
    "line": "texturizado",
    "sellPrice15": 604.85,
    "fitaCod": "",
    "fitaName": "",
    "cod6": "00096DUR6-11/26",
    "name6": "MDF 6mm padrão compatível",
    "sellPrice6": 613.57
  },
  {
    "id": "032dur15-11-26",
    "label": "Cinza Cristal Texturizado Platina",
    "tierLabel": "Linha Texturizado",
    "hex": "#c8cac6",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 cinza cristal texturizado Platina 2F Duratex ®",
    "cod15": "032DUR15-11/26",
    "name15": "MDF 15 cinza cristal texturizado Platina 2F Duratex ®",
    "line": "texturizado",
    "sellPrice15": 825.39,
    "fitaCod": "",
    "fitaName": "",
    "cod6": "00096DUR6-11/26",
    "name6": "MDF 6mm padrão compatível",
    "sellPrice6": 613.57
  },
  {
    "id": "007dur15-11-26",
    "label": "Amendola Rustica Duna",
    "tierLabel": "Linha Duna",
    "hex": "#9e6b3f",
    "grain": true,
    "gloss": false,
    "note": "MDF 15 amendola rustica duna 2F Duratex ®",
    "cod15": "007DUR15-11/26",
    "name15": "MDF 15 amendola rustica duna 2F Duratex ®",
    "line": "duna",
    "sellPrice15": 989.15,
    "fitaCod": "",
    "fitaName": "",
    "cod6": "00096DUR6-11/26",
    "name6": "MDF 6mm padrão compatível",
    "sellPrice6": 690.0
  },
  {
    "id": "008dur15-11-26",
    "label": "Arizona Cross",
    "tierLabel": "Linha Arizona",
    "hex": "#b9ab99",
    "grain": false,
    "gloss": false,
    "note": "MDF 15 arizona cross 2F Duratex ®",
    "cod15": "008DUR15-11/26",
    "name15": "MDF 15 arizona cross 2F Duratex ®",
    "line": "arizona",
    "sellPrice15": 1050.15,
    "fitaCod": "",
    "fitaName": "",
    "cod6": "00096DUR6-11/26",
    "name6": "MDF 6mm padrão compatível",
    "sellPrice6": 690.0
  }
];

// Compatibilidade com código existente
export const MDF_FINISH_OPTIONS: MdfFinishOption[] = MDF_FEATURED_FINISHES;

export const HARDWARE_KIT_OPTIONS: HardwareKitOption[] = [
  {
    "id": "padrao",
    "label": "Padrão (Telescópica + Slide-On)",
    "description": "Dobradiças 35mm slide-on, corrediças telescópicas 400mm, pistão 80N e sistema correr SS150+.",
    "hingeCod": "0004MUL35D-11/26",
    "hingePrice": 4.4,
    "cornerHingeCod": "0005MUL35D-11/26",
    "cornerHingePrice": 25.87,
    "slideCod": "0002MUL400T-11/26",
    "slidePrice": 24.4,
    "pistonCod": "0001MUL80P-11/26",
    "pistonPrice": 13.57,
    "sliding2Cod": "0005ROMSS2-11/26",
    "sliding2Price": 418.61,
    "sliding3Cod": "0006ROMSS3-11/26",
    "sliding3Price": 519.38,
    "handleBarCod": "0004MULT18AL3-11/26",
    "handleBarPrice": 31.98,
    "handleBar15Cod": "0003MULT15AL3-11/26",
    "handleBar15Price": 92.46,
    "rodCod": "0002MULTCO-11/26",
    "rodPrice": 47.01
  },
  {
    "id": "slow",
    "label": "Slow / Oculta (Amortecimento)",
    "description": "Dobradiças slow-motion, corrediças ocultas slow 450mm e sistema correr Rometal Dominus.",
    "hingeCod": "0003MUL35D-11/26",
    "hingePrice": 6.17,
    "cornerHingeCod": "0005MUL35D-11/26",
    "cornerHingePrice": 25.87,
    "slideCod": "0002MULT450COS-11/26",
    "slidePrice": 71.98,
    "pistonCod": "0001MUL80P-11/26",
    "pistonPrice": 13.57,
    "sliding2Cod": "0003ROMD2-11/26",
    "sliding2Price": 775.64,
    "sliding3Cod": "0004MULD3-11/26",
    "sliding3Price": 955.32,
    "handleBarCod": "0004MULT18AL3-11/26",
    "handleBarPrice": 31.98,
    "handleBar15Cod": "0003MULT15AL3-11/26",
    "handleBar15Price": 92.46,
    "rodCod": "0002MULTCO-11/26",
    "rodPrice": 47.01
  },
  {
    "id": "luxo",
    "label": "Luxo (SS 200 Top + Avantbox FGV)",
    "description": "Kit gavetas Avantbox FGV Prata, sistema correr Rometal SS 200 Top 50kg e dobradiças slow.",
    "hingeCod": "0003MUL35D-11/26",
    "hingePrice": 6.17,
    "cornerHingeCod": "0005MUL35D-11/26",
    "cornerHingePrice": 25.87,
    "slideCod": "0006FGVTN450GA-11/26",
    "slidePrice": 168.28,
    "pistonCod": "0001MUL80P-11/26",
    "pistonPrice": 13.57,
    "sliding2Cod": "0001ROM200T2-11/26",
    "sliding2Price": 986.91,
    "sliding3Cod": "0002ROM200T3-11/26",
    "sliding3Price": 942.43,
    "handleBarCod": "0003MULT15AL3-11/26",
    "handleBarPrice": 92.46,
    "handleBar15Cod": "0003MULT15AL3-11/26",
    "handleBar15Price": 92.46,
    "rodCod": "0002MULTCO-11/26",
    "rodPrice": 47.01
  }
];

export function findMdfFinishById(id: string): MdfFinishOption {
  return (
    MDF_FEATURED_FINISHES.find(f => f.id === id) ||
    ALL_MDF_FINISHES.find(f => f.id === id) ||
    MDF_FEATURED_FINISHES[0]
  );
}

export function calculateCabinetryQuote(
  modules: ProposedCabinetModule[],
  frontFinishId: string,
  hardwareId: HardwareTierId,
  carcassFinishId?: string,
  styleOptions: Partial<CabinetStyleOptions> = {}
): CabinetryQuoteResult {
  const resolvedStyle: CabinetStyleOptions = {
    frontStyle: styleOptions.frontStyle || 'lisa',
    handleStyle: styleOptions.handleStyle || 'perfil_18',
    thicknessMode: styleOptions.thicknessMode || '15mm',
  };
  const frontFinish = findMdfFinishById(frontFinishId);
  const carcassFinish = findMdfFinishById(carcassFinishId || frontFinishId);
  const hardware = HARDWARE_KIT_OPTIONS.find(h => h.id === hardwareId) || HARDWARE_KIT_OPTIONS[0];

  const thicknessFactor =
    resolvedStyle.thicknessMode === '25mm_engrossado'
      ? 1.26
      : resolvedStyle.thicknessMode === '18mm'
      ? 1.15
      : 1.0;

  let rawCarcass15 = 0;
  let rawFront15 = 0;
  let rawArea6 = 0;
  let hingesCount = 0;
  let cornerHingesCount = 0;
  let slidesCount = 0;
  let pistonsCount = 0;
  let sliding2Count = 0;
  let sliding3Count = 0;
  let handleMeters = 0;
  let rodsCount = 0;
  let touchLatchCount = 0;
  let glassDoorsAreaM2 = 0;
  let machinedFrontsAreaM2 = 0;

  for (const m of modules) {
    const w = m.widthCm / 100;
    const h = m.heightCm / 100;
    const d = m.depthCm / 100;

    if (m.type === 'painel_tv_ripado' || m.type === 'painel_cabeceira' || m.type === 'painel_muxarabi') {
      rawFront15 += (w * h) * (m.type === 'painel_muxarabi' ? 1.55 : 1.45) * thicknessFactor;
    } else if (m.type === 'cabeceira_estofada') {
      rawFront15 += (w * h) * 0.72;
      machinedFrontsAreaM2 += w * h; // revestimento + estofamento
    } else if (m.type === 'fechamento_teto') {
      rawFront15 += (w * h) * 1.15 + (w * d * 0.45);
    } else if (m.type === 'cama_bau_planejada') {
      rawCarcass15 += ((2 * w * 0.35) + (2 * d * 0.35) + (w * d * 0.9)) * thicknessFactor;
      rawFront15 += (w * 0.36) + (d * 0.36);
    } else if (m.type === 'nicho_geladeira') {
      rawFront15 += ((2 * h * d) * 0.45 + (w * 0.45 * d)) * thicknessFactor;
      rawCarcass15 += (w * 0.45 * 2 * d);
      rawArea6 += w * 0.45;
    } else if (m.type === 'balcao_canto_L' || m.type === 'aereo_canto_L') {
      const lArea = (2 * w * d * 0.75) + (2 * h * d * 0.85) + (w * d * 1.6);
      rawCarcass15 += lArea * thicknessFactor;
      rawFront15 += (w * h * 0.65);
      rawArea6 += (w * h) * 1.3;
      cornerHingesCount += 4;
    } else if (m.type === 'mesa_retratil') {
      rawFront15 += (w * d * 2.1 * thicknessFactor) + (w * h * 0.6);
      rawCarcass15 += (w * 0.25 * 2);
      hingesCount += 2;
    } else {
      const shelves = m.shelvesCount ?? (m.heightCm > 150 ? 4 : m.heightCm > 90 ? 2 : 1);
      const carcassArea = ((2 * h * d) + (2 * w * d) + (shelves * w * d * 0.85)) * thicknessFactor;
      const hasFrontPanels = m.doorsCount > 0 || m.drawersCount > 0 || m.type.includes('balcao') || m.type.includes('guarda_roupa') || m.type === 'gabinete_banheiro' || m.type === 'rack_suspenso' || m.type === 'aparador_buffet';
      const isReflecta = resolvedStyle.frontStyle === 'vidro_reflecta' && (m.type.includes('aereo') || m.type.includes('guarda_roupa') || m.type === 'cristaleira_vidro' || m.type === 'bar_adega');
      const frontRatio = m.type === 'cristaleira_vidro' || isReflecta ? 0.35 : 1.0;
      const frontArea = hasFrontPanels ? (w * h * frontRatio) : (h * d * 0.4);
      if (isReflecta || m.type === 'cristaleira_vidro') {
        glassDoorsAreaM2 += w * h * 0.88;
      } else if (hasFrontPanels && (resolvedStyle.frontStyle === 'cava45' || resolvedStyle.frontStyle === 'provencal')) {
        machinedFrontsAreaM2 += w * h;
      }
      const drawersBoxArea = m.drawersCount * (w * 0.55 * 0.45 * 2);

      const visibleBody =
        m.type === 'estante_nichos' ||
        m.type === 'closet_cabideiro_aberto' ||
        m.type === 'sapateira_prateleiras' ||
        m.type === 'bar_adega' ||
        m.type === 'bancada_estudo' ||
        m.type === 'estacao_trabalho_L' ||
        m.type === 'penteadeira_camarim' ||
        m.type === 'balcao_atendimento_comercial';

      if (visibleBody) {
        rawFront15 += carcassArea + frontArea;
        rawCarcass15 += drawersBoxArea;
      } else {
        rawCarcass15 += carcassArea + drawersBoxArea;
        rawFront15 += frontArea;
      }
      rawArea6 += (w * h) + (m.drawersCount * w * d * 0.65);
    }

    if (m.type === 'closet_cabideiro_aberto' || m.type === 'guarda_roupa_correr' || m.type === 'guarda_roupa_abrir') {
      rodsCount += Math.max(1, Math.round(m.widthCm / 95));
    }

    if (m.type === 'guarda_roupa_correr') {
      if (m.doorsCount >= 3) sliding3Count += 1;
      else sliding2Count += 1;
      handleMeters += (m.doorsCount * h);
    } else {
      const hingesPerDoor = m.heightCm >= 180 ? 4 : m.heightCm >= 110 ? 3 : 2;
      hingesCount += m.doorsCount * hingesPerDoor;
      if (m.type === 'aereo_basculante' || m.type === 'aereo_canto_L') pistonsCount += Math.max(2, m.doorsCount * 2);
      if (resolvedStyle.handleStyle === 'fecho_toque') {
        touchLatchCount += m.doorsCount + m.drawersCount;
      } else {
        handleMeters += (m.doorsCount * 0.42) + (m.drawersCount * 0.42);
      }
    }

    slidesCount += m.drawersCount;
  }

  const area15CarcassM2 = Number((rawCarcass15 * CUT_WASTE_FACTOR).toFixed(2));
  const area15FrontM2 = Number((rawFront15 * CUT_WASTE_FACTOR).toFixed(2));
  const area15m2 = Number((area15CarcassM2 + area15FrontM2).toFixed(2));
  const area6m2 = Number((rawArea6 * CUT_WASTE_FACTOR).toFixed(2));

  let sheets15CarcassCount = 0;
  let sheets15FrontCount = 0;
  let mdfSellSubtotal = 0;

  if (carcassFinish.cod15 === frontFinish.cod15) {
    const totalSheets = modules.length > 0 ? Math.max(1, Math.ceil((area15m2 / SHEET_AREA_M2) * 2) / 2) : 0;
    sheets15FrontCount = totalSheets;
    mdfSellSubtotal += totalSheets * frontFinish.sellPrice15;
  } else {
    sheets15CarcassCount = area15CarcassM2 > 0.2 ? Math.max(0.5, Math.ceil((area15CarcassM2 / SHEET_AREA_M2) * 2) / 2) : 0;
    sheets15FrontCount = area15FrontM2 > 0.2 ? Math.max(0.5, Math.ceil((area15FrontM2 / SHEET_AREA_M2) * 2) / 2) : 0;
    mdfSellSubtotal += (sheets15CarcassCount * carcassFinish.sellPrice15) + (sheets15FrontCount * frontFinish.sellPrice15);
  }

  const sheets15Count = sheets15CarcassCount + sheets15FrontCount;
  const sheets6Count = area6m2 > 0.2 ? Math.max(0.5, Math.ceil((area6m2 / SHEET_AREA_M2) * 2) / 2) : 0;
  mdfSellSubtotal += sheets6Count * carcassFinish.sellPrice6;

  const activeHandleBarPrice =
    resolvedStyle.handleStyle === 'fecho_toque'
      ? 0
      : resolvedStyle.handleStyle === 'perfil_15'
      ? hardware.handleBar15Price
      : hardware.handleBarPrice;

  const consumablesPerModule = modules.length * 24;
  const handleBars = resolvedStyle.handleStyle === 'fecho_toque' ? 0 : Math.ceil(handleMeters / 3);
  const hardwareCostRaw =
    (hingesCount * hardware.hingePrice) +
    (cornerHingesCount * hardware.cornerHingePrice) +
    (slidesCount * hardware.slidePrice) +
    (pistonsCount * hardware.pistonPrice) +
    (sliding2Count * hardware.sliding2Price) +
    (sliding3Count * hardware.sliding3Price) +
    (handleBars * activeHandleBarPrice) +
    (rodsCount * hardware.rodPrice) +
    (touchLatchCount * 14.5) +
    consumablesPerModule;

  const machiningPerM2 =
    resolvedStyle.frontStyle === 'provencal' ? 290 : resolvedStyle.frontStyle === 'cava45' ? 145 : 220;
  const machiningAndGlassSubtotal = Math.round(
    (glassDoorsAreaM2 * 440) + (machinedFrontsAreaM2 * machiningPerM2)
  );

  const hardwareSellSubtotal = hardwareCostRaw * 1.65;
  const assemblyAndLogistics = modules.length > 0
    ? Math.max(480, Math.round((mdfSellSubtotal + hardwareSellSubtotal + machiningAndGlassSubtotal) * 0.22))
    : 0;

  const baseTotal = mdfSellSubtotal + hardwareSellSubtotal + machiningAndGlassSubtotal + assemblyAndLogistics;
  const estimatedMinBrl = Math.round((baseTotal * 0.92) / 50) * 50;
  const estimatedMaxBrl = Math.round((baseTotal * 1.10) / 50) * 50;

  const fmt = (n: number) => 'R$ ' + n.toLocaleString('pt-BR');

  return {
    area15CarcassM2,
    area15FrontM2,
    area15m2,
    area6m2,
    sheets15CarcassCount,
    sheets15FrontCount,
    sheets15Count,
    sheets6Count,
    hingesCount,
    cornerHingesCount,
    slidesCount,
    slidingKitCount: sliding2Count + sliding3Count,
    mdfSellSubtotal: Math.round(mdfSellSubtotal),
    hardwareSellSubtotal: Math.round(hardwareSellSubtotal),
    machiningAndGlassSubtotal,
    assemblyAndLogistics,
    estimatedMinBrl,
    estimatedMaxBrl,
    formattedRange: `${fmt(estimatedMinBrl)} – ${fmt(estimatedMaxBrl)}`,
    carcassFinish,
    frontFinish,
    hardware,
    styleOptions: resolvedStyle,
  };
}
