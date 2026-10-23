import { WoodSpecies, TensionSystem, JoineryType, DomeFrequencyOption, HuggingFaceSpace, InnovativeProjectShowcase } from '../types';

export const WOOD_SPECIES: WoodSpecies[] = [
  {
    id: 'cumaru',
    name: 'Cumaru',
    scientificName: 'Dipteryx odorata',
    origin: 'Brasil',
    description: 'Madeira pesada e de alta densidade mecânica, com tonalidade castanho-amarelada.',
    colorHex: '#8b5a2b',
    threeColor: 0x8b5a2b,
    roughness: 0.32,
    jankaHardness: 3540,
    sustainabilityBadge: 'À escolha do cliente',
    pricePerBoardFoot: 24.0,
    carbonOffsetKg: 78
  },
  {
    id: 'freijo',
    name: 'Freijó',
    scientificName: 'Cordia goeldiana',
    origin: 'Brasil',
    description: 'Madeira de tom castanho-claro amarelado, com veios suaves e ótimo acabamento.',
    colorHex: '#b8976b',
    threeColor: 0xb8976b,
    roughness: 0.40,
    jankaHardness: 1400,
    sustainabilityBadge: 'À escolha do cliente',
    pricePerBoardFoot: 22.0,
    carbonOffsetKg: 50
  },
  {
    id: 'jacaranda',
    name: 'Jacarandá',
    scientificName: 'Dalbergia nigra',
    origin: 'Brasil',
    description: 'Madeira de tom escuro com desenhos marcantes nos veios, tradicional em marcenaria.',
    colorHex: '#3d2b1f',
    threeColor: 0x3d2b1f,
    roughness: 0.30,
    jankaHardness: 2750,
    sustainabilityBadge: 'À escolha do cliente',
    pricePerBoardFoot: 38.0,
    carbonOffsetKg: 85
  },
  {
    id: 'pequia',
    name: 'Pequiá',
    scientificName: 'Caryocar villosum',
    origin: 'Brasil',
    description: 'Madeira pesada e resistente com textura orgânica e tonalidade clara a amarelada.',
    colorHex: '#dfbe8f',
    threeColor: 0xc99c62,
    roughness: 0.35,
    jankaHardness: 2100,
    sustainabilityBadge: 'À escolha do cliente',
    pricePerBoardFoot: 20.0,
    carbonOffsetKg: 60
  }
];

export const TENSION_SYSTEMS: TensionSystem[] = [
  {
    id: 'inox',
    name: 'Aço Inox 316',
    material: 'Aço Inoxidável',
    breakingLoadKg: 1800,
    finish: 'Inox Escovado',
    colorHex: '#d8dee9',
    threeColor: 0xd8dee9,
    metalness: 0.90,
    pricePerMeter: 38.0
  },
  {
    id: 'ouro',
    name: 'Acabamento Dourado',
    material: 'Aço com Acabamento Dourado',
    breakingLoadKg: 2100,
    finish: 'Dourado Polido',
    colorHex: '#f1c40f',
    threeColor: 0xf1c40f,
    metalness: 0.95,
    pricePerMeter: 65.0
  },
  {
    id: 'preto',
    name: 'Preto Fosco',
    material: 'Aço com Pintura Eletrostática',
    breakingLoadKg: 2400,
    finish: 'Preto Fosco',
    colorHex: '#22252a',
    threeColor: 0x22252a,
    metalness: 0.80,
    pricePerMeter: 48.0
  }
];

export const JOINERY_TYPES: JoineryType[] = [
  {
    id: 'kanawa-tsugi',
    name: 'Encaixes Tradicionais de Madeira',
    tradition: 'Marcenaria clássica',
    description: 'Encaixes mecânicos em madeira que garantem estabilidade estrutural.',
    strengthRating: 'Alta resistência mecânica',
    priceDelta: 0
  },
  {
    id: 'blind-floating-tenon',
    name: 'Fixações Ocultas com Cavilhas Estruturais',
    tradition: 'Marcenaria de precisão',
    description: 'Encaixes internos que mantêm a superfície da madeira contínua.',
    strengthRating: 'Alta estabilidade',
    priceDelta: 450
  },
  {
    id: 'cnc-billet-hubs',
    name: 'Nós Estruturais de União Metálica',
    tradition: 'Estruturas geodésicas',
    description: 'Conectores metálicos usinados para distribuição de cargas em cúpulas.',
    strengthRating: 'Resistência estrutural dimensionada',
    priceDelta: 1200
  }
];

export const JOINERY_OPTIONS = JOINERY_TYPES;

export const DOME_FREQUENCIES: DomeFrequencyOption[] = [
  {
    id: 'v2',
    name: '2V Frequência (40 Triângulos / 65 Barras)',
    trianglesCount: 40,
    strutsCount: 65,
    hubsCount: 26,
    recommendedDiameter: '3.0m a 5.0m',
    complexity: 'Intermediária',
    description: 'Ideal para gazebos, estufas e pequenas coberturas residenciais.'
  },
  {
    id: 'v3',
    name: '3V Frequência (90 Triângulos / 120 Barras)',
    trianglesCount: 90,
    strutsCount: 120,
    hubsCount: 46,
    recommendedDiameter: '6.0m a 8.5m',
    complexity: 'Alta rigidez',
    description: 'Estrutura equilibrada com ótima resistência para áreas de convivência e lazer.'
  },
  {
    id: 'v4',
    name: '4V Frequência (160 Triângulos / 250 Barras)',
    trianglesCount: 160,
    strutsCount: 250,
    hubsCount: 92,
    recommendedDiameter: '9.0m a 16.0m',
    complexity: 'Estrutural Avançada',
    description: 'Projetada para grandes vãos, galpões de eventos e pavilhões comerciais.'
  }
];

export const HUGGING_FACE_SPACES: HuggingFaceSpace[] = [
  {
    id: 'trellis-2-microsoft',
    name: 'TRELLIS.2 (Microsoft)',
    author: 'microsoft',
    spaceUrl: 'https://huggingface.co/spaces/microsoft/TRELLIS.2',
    directEmbedUrl: 'https://microsoft-trellis-2.hf.space',
    description: 'Geração 3D a partir de esboços ou imagens de móveis sob medida.',
    primaryUse: 'Visualização de rascunhos e modelos 3D.',
    recommendedInput: 'Foto isolada ou imagem de conceito.',
    hardwareTier: 'ZeroGPU',
    modelArchitecture: 'Rectified Flow Transformer',
    tags: ['3D Generation', 'PBR Materials', 'GLB Export'],
    samplePrompt: 'Mesa de jantar flutuante sob medida com cabos de aço'
  },
  {
    id: 'triposr-stability',
    name: 'TripoSR (Stability AI & Tripo)',
    author: 'stabilityai',
    spaceUrl: 'https://huggingface.co/spaces/stabilityai/TripoSR',
    directEmbedUrl: 'https://stabilityai-triposr.hf.space',
    description: 'Reconstrução rápida de geometria 3D a partir de foto única.',
    primaryUse: 'Geração de rascunhos tridimensionais.',
    recommendedInput: 'Foto de móvel em ângulo de 45 graus.',
    hardwareTier: 'ZeroGPU (~3s)',
    modelArchitecture: 'Feed-forward Large Reconstruction Model',
    tags: ['Fast 3D', 'Instant Mesh', 'GLB'],
    samplePrompt: 'Cúpula geodésica em madeira sob medida'
  },
  {
    id: 'interior-gen3d',
    name: 'InteriorGen3D (Staging Espacial)',
    author: 'stevee00',
    spaceUrl: 'https://huggingface.co/spaces/stevee00/InteriorGen3D',
    directEmbedUrl: 'https://stevee00-interiorgen3d.hf.space',
    description: 'Visualização de móveis integrados à planta e ambiente do cliente.',
    primaryUse: 'Visualizar como a mesa ou estrutura se encaixa no ambiente.',
    recommendedInput: 'Foto do ambiente tirada da altura dos olhos.',
    hardwareTier: 'ZeroGPU',
    modelArchitecture: 'Depth-Guided Transformer',
    tags: ['Room Understanding', 'Interior Staging'],
    samplePrompt: 'Sala com mesa de jantar flutuante para 8 lugares'
  },
  {
    id: 'room-redesign-tavan',
    name: 'Room Redesign (ControlNet)',
    author: 'TavanIT',
    spaceUrl: 'https://huggingface.co/spaces/TavanIT/Room-Redesign',
    directEmbedUrl: 'https://tavanit-room-redesign.hf.space',
    description: 'Visualização do ambiente com novos móveis mantendo a geometria da sala.',
    primaryUse: 'Apoio a clientes e arquitetos no planejamento de interiores.',
    recommendedInput: 'Foto do ambiente atual.',
    hardwareTier: 'ZeroGPU',
    modelArchitecture: 'ControlNet Depth',
    tags: ['Virtual Staging', 'Room Redesign'],
    samplePrompt: 'Sala de estar moderna com móveis sob medida em madeira'
  },
  {
    id: 'instant4d-splatv',
    name: 'Instant4D / Splatv (Pipeline 3D)',
    author: 'ix64 / holograma',
    spaceUrl: 'https://huggingface.co/spaces/anysplat-zerogpu-demo',
    directEmbedUrl: 'https://anysplat-zerogpu-demo.hf.space',
    description: 'Visualização espacial imersiva para encaixe dimensional de mobiliário.',
    primaryUse: 'Conferência de dimensões do ambiente.',
    recommendedInput: 'Vídeo do espaço ou ambiente.',
    hardwareTier: 'ZeroGPU',
    modelArchitecture: 'Gaussian Splatting',
    tags: ['3D Scan', 'Video', 'Splatv'],
    samplePrompt: 'Ambiente pronto para instalação de mobiliário sob medida'
  }
];

export const INNOVATIVE_PROJECTS: InnovativeProjectShowcase[] = [
  {
    id: 'leviton-dining-table',
    category: 'tensegrity',
    title: 'Mesa de Jantar Flutuante',
    subtitle: 'Mesa com tampo suspenso por cabos tensores',
    dimensions: '260 cm (C) × 105 cm (L) × 76 cm (A)',
    materials: ['Madeira à escolha do cliente', 'Cabos em Aço Inox 316'],
    physicsPrinciple: 'Equilíbrio tensil entre cabos de tração e escoras centrais.',
    maxLoadBearing: '480 kg distribuídos',
    craftingDuration: '4 a 6 semanas de produção sob medida',
    description: 'Mesa de jantar onde o tampo flutua no ar sustentado por cabos tensores. As medidas e a madeira são personalizadas para cada projeto.',
    keyFeatures: [
      'Madeira e acabamento conforme especificação do cliente',
      'Esticadores e tirantes em aço inox',
      'Perfil com bordas chanfradas ou orgânicas',
      'Estrutura projetada para estabilidade no uso diário'
    ],
    imagePlaceholder: 'linear-gradient(135deg, rgba(8, 28, 18, 0.95) 0%, rgba(14, 48, 30, 0.9) 100%)',
    defaultConfig: {
      category: 'tensegrity-dining-table',
      title: 'Mesa de Jantar Flutuante',
      woodSpeciesId: 'cumaru',
      tensionSystemId: 'inox',
      joineryId: 'kanawa-tsugi',
      dimensions: { length: 260, width: 105, height: 76 }
    }
  },
  {
    id: 'aetherium-executive-desk',
    category: 'tensegrity',
    title: 'Bancada Executiva em Balanço',
    subtitle: 'Estação de trabalho com suporte tensil',
    dimensions: '220 cm (C) × 95 cm (L) × 75 cm (A)',
    materials: ['Madeira à escolha do cliente', 'Tirantes de Aço'],
    physicsPrinciple: 'Treliça de tensegridade suportando balanço livre.',
    maxLoadBearing: '280 kg distribuídos',
    craftingDuration: '4 a 6 semanas de produção',
    description: 'Projetada para escritórios e salas de reunião. A superfície de trabalho estende-se em balanço livre sustentada por tirantes de aço com gaveteiro flutuante opcional.',
    keyFeatures: [
      'Bancada com encaixes estruturais',
      'Tirantes em aço com acabamento escovado ou dourado',
      'Opção de gaveteiro flutuante',
      'Medidas adaptadas para o ambiente corporativo'
    ],
    imagePlaceholder: 'linear-gradient(135deg, rgba(16, 32, 22, 0.95) 0%, rgba(24, 56, 38, 0.9) 100%)',
    defaultConfig: {
      category: 'tensegrity-executive-desk',
      title: 'Bancada Executiva em Balanço',
      woodSpeciesId: 'freijo',
      tensionSystemId: 'ouro',
      joineryId: 'blind-floating-tenon',
      dimensions: { length: 220, width: 95, height: 75 }
    }
  },
  {
    id: 'snelson-coffee-table',
    category: 'tensegrity',
    title: 'Mesa de Centro Tensegrity',
    subtitle: 'Mesa com apoio tensil em três pontos',
    dimensions: '140 cm (C) × 80 cm (L) × 45 cm (A)',
    materials: ['Madeira à escolha do cliente', 'Cabos em Aço Inox'],
    physicsPrinciple: 'Equilíbrio tensil em três pontos focais.',
    maxLoadBearing: '200 kg distribuídos',
    craftingDuration: '3 a 4 semanas de produção',
    description: 'Mesa de centro com apoio em estrutura tensil e tampo em vidro ou madeira, permitindo a passagem de luz e criando leveza visual no living.',
    keyFeatures: [
      'Madeira e acabamento à escolha do cliente',
      'Tirantes em aço inoxidável',
      'Opção de tampo em vidro temperado ou madeira maciça',
      'Produção sob encomenda'
    ],
    imagePlaceholder: 'linear-gradient(135deg, rgba(8, 24, 16, 0.95) 0%, rgba(12, 40, 26, 0.9) 100%)',
    defaultConfig: {
      category: 'tensegrity-coffee-table',
      title: 'Mesa de Centro Tensegrity',
      woodSpeciesId: 'jacaranda',
      tensionSystemId: 'inox',
      joineryId: 'kanawa-tsugi',
      dimensions: { length: 140, width: 80, height: 45 }
    }
  },
  {
    id: 'solace-glamping-dome',
    category: 'geodesic',
    title: 'Cúpula Geodésica 6M',
    subtitle: 'Estrutura autoportante para gazebos, estufas e coberturas',
    dimensions: '6.0 m (Diâmetro) × 3.6 m (Altura)',
    materials: ['Madeira tratada estrutural', 'Nós de união em aço ou alumínio'],
    physicsPrinciple: 'Icosaedro geodésico frequência 3V com dispersão omnidirecional de cargas.',
    maxLoadBearing: 'Resistência a ventos e sobrecargas normativas',
    craftingDuration: '4 a 6 semanas de usinagem e pré-montagem',
    description: 'Estrutura autoportante em madeira com 120 barras calibradas e nós de conexão metálicos. Adequada para áreas de convivência, lazer e estufas.',
    keyFeatures: [
      'Nós de união metálicos de montagem prática',
      'Madeira com tratamento protetor',
      'Possibilidade de cobertura em lona arquitetônica ou vidro',
      'Montagem modular no local'
    ],
    imagePlaceholder: 'linear-gradient(135deg, rgba(6, 30, 20, 0.95) 0%, rgba(10, 52, 34, 0.9) 100%)',
    defaultConfig: {
      category: 'geodesic-glamping-dome',
      title: 'Cúpula Geodésica 6M',
      woodSpeciesId: 'cumaru',
      tensionSystemId: 'inox',
      joineryId: 'cnc-billet-hubs',
      dimensions: { diameter: 6.0, domeHeight: 3.6 },
      domeFrequency: 'v3'
    }
  }
];

export const SAMPLE_INITIAL_LEADS = [
  {
    id: 'BR-TT-2026-9041',
    createdAt: '2026-10-18T14:32:00Z',
    clientName: 'Julian Vance Arquitetura',
    clientEmail: 'julian@vance-arq.com.br',
    clientPhone: '(11) 98765-4122',
    clientLocation: 'São Paulo - SP',
    clientType: 'architect',
    budgetBracket: 'R$ 35.000 – R$ 75.000',
    targetTimeline: 'standard-60-90days',
    consultationType: 'virtual-3d-walkthrough',
    projectSummary: 'Mesa de Jantar Flutuante sob medida para 10 lugares.',
    status: 'reviewed',
    notes: 'Arquiteto enviou planta do living. Definindo madeira de preferência com o cliente.'
  },
  {
    id: 'BR-TT-2026-9042',
    createdAt: '2026-10-19T09:15:00Z',
    clientName: 'Resort Botanique Paraty',
    clientEmail: 'diretoria@botaniqueparaty.com.br',
    clientPhone: '(24) 99820-1104',
    clientLocation: 'Paraty - RJ',
    clientType: 'resort-glamping',
    budgetBracket: 'Acima de R$ 100.000',
    targetTimeline: 'flexible-6months',
    consultationType: 'in-person-atelier',
    projectSummary: 'Duas Cúpulas Geodésicas 6M em madeira.',
    status: 'consultation-scheduled',
    notes: 'Visita técnica agendada. Instalação prevista para início de 2027.'
  }
];

// ============================================================================
// DADOS LEGAIS DA EMPRESA (RECEITA FEDERAL DO BRASIL - CNPJ OFICIAL)
// ============================================================================
export const COMPANY_LEGAL_INFO = {
  razaoSocial: '83 EMPREENDIMENTOS LTDA',
  nomeFantasia: '83 AMBIENTES PLANEJADOS',
  marcaAutoral: 'TENSOR & TIMBER',
  cnpj: '59.492.848/0001-28',
  cnpjNumeros: '59492848000128',
  dataAbertura: '16/02/2025',
  situacaoCadastral: 'ATIVA',
  naturezaJuridica: '206-2 - Sociedade Empresária Limitada',
  porte: 'ME',
  cnaePrincipal: {
    codigo: '33.29-5-01',
    descricao: 'Serviços de montagem de móveis de qualquer material'
  },
  cnaesSecundarios: [
    '62.04-0-00 - Consultoria em tecnologia da informação',
    '62.09-1-00 - Suporte técnico, manutenção e outros serviços em tecnologia da informação',
    '70.20-4-00 - Atividades de consultoria em gestão empresarial',
    '85.50-3-02 - Atividades de apoio à educação',
    '95.11-8-00 - Reparação e manutenção de computadores e equipamentos periféricos'
  ],
  endereco: {
    logradouro: 'Av. Bahia',
    numero: '703',
    complemento: 'CXPST 042',
    bairro: 'Estados',
    cidade: 'João Pessoa',
    uf: 'PB',
    cep: '58030-130',
    cepFormatado: '58.030-130',
    formatado: 'Av. Bahia, 703, CXPST 042 — Bairro dos Estados, João Pessoa - PB, CEP 58.030-130'
  },
  contato: {
    email: 'gerenciadamarcenaria@gmail.com',
    telefone: '(83) 9822-9900',
    whatsappRaw: '558398229900',
    whatsappUrl: 'https://wa.me/558398229900'
  }
};
