import { WoodSpecies, TensionSystem, JoineryType, DomeFrequencyOption, HuggingFaceSpace, InnovativeProjectShowcase } from '../types';

export const WOOD_SPECIES: WoodSpecies[] = [
  {
    id: 'cumaru',
    name: 'Cumaru Amazônico FSC®',
    scientificName: 'Dipteryx odorata',
    origin: 'Amazônia, Brasil',
    description: 'Extrema densidade, tom mel dourado acetinado e veios finos. Imune a pragas e intempéries.',
    colorHex: '#8b5a2b',
    threeColor: 0x8b5a2b,
    roughness: 0.32,
    jankaHardness: 3540,
    sustainabilityBadge: '100% FSC® Manejo Sustentável',
    pricePerBoardFoot: 24.0,
    carbonOffsetKg: 78
  },
  {
    id: 'freijo',
    name: 'Freijó Maciço da Amazônia',
    scientificName: 'Cordia goeldiana',
    origin: 'Pará e Acre, Brasil',
    description: 'O clássico nobre do modernismo brasileiro. Tom palha dourado e veios suaves elegantes.',
    colorHex: '#b8976b',
    threeColor: 0xb8976b,
    roughness: 0.40,
    jankaHardness: 1400,
    sustainabilityBadge: 'Manejo Florestal Sustentável',
    pricePerBoardFoot: 22.0,
    carbonOffsetKg: 50
  },
  {
    id: 'jacaranda',
    name: 'Jacarandá da Bahia (Demolição)',
    scientificName: 'Dalbergia nigra',
    origin: 'Sul da Bahia, Brasil (Demolição com DOF)',
    description: 'A madeira mais lendária do mobiliário brasileiro. Tom escuro nobre com veios violáceos profundos.',
    colorHex: '#3d2b1f',
    threeColor: 0x3d2b1f,
    roughness: 0.30,
    jankaHardness: 2750,
    sustainabilityBadge: 'Demolição Certificada & DOF',
    pricePerBoardFoot: 38.0,
    carbonOffsetKg: 85
  },
  {
    id: 'pequia',
    name: 'Pequiá Maciço Natural',
    scientificName: 'Caryocar villosum',
    origin: 'Brasil',
    description: 'Madeira pesada e escultural com bordas orgânicas naturais e alta resistência mecânica.',
    colorHex: '#dfbe8f',
    threeColor: 0xc99c62,
    roughness: 0.35,
    jankaHardness: 2100,
    sustainabilityBadge: 'Aproveitamento Florestal Legal',
    pricePerBoardFoot: 20.0,
    carbonOffsetKg: 60
  }
];

export const TENSION_SYSTEMS: TensionSystem[] = [
  {
    id: 'marine-stainless-316',
    name: 'Aeronautical 316 Marine Stainless Steel',
    material: '7x19 Braided Stainless Cable (4mm / 6mm)',
    breakingLoadKg: 1450,
    finish: 'Brushed Micro-Satin',
    colorHex: '#d8dee9',
    threeColor: 0xd8dee9,
    metalness: 0.95,
    pricePerMeter: 14.5
  },
  {
    id: 'pvd-gold-titanium',
    name: 'PVD Titanium Mirror Gold',
    material: 'Titanium-Nitride Vacuum Coated Aircraft Cable',
    breakingLoadKg: 1680,
    finish: 'Mirror Polished Royal Gold',
    colorHex: '#f1c40f',
    threeColor: 0xf1c40f,
    metalness: 0.98,
    pricePerMeter: 28.0
  },
  {
    id: 'carbon-stealth-black',
    name: 'Matte Carbon & Vectran Hybrid',
    material: 'Zero-Creep Liquid Crystal Polymer & Carbon Braid',
    breakingLoadKg: 2200,
    finish: 'Stealth Architectural Matte Black',
    colorHex: '#22252a',
    threeColor: 0x22252a,
    metalness: 0.2,
    pricePerMeter: 34.0
  }
];

export const JOINERY_TYPES: JoineryType[] = [
  {
    id: 'kanawa-tsugi',
    name: 'Japanese Kanawa-tsugi (Keyed Mortise)',
    tradition: 'Edo-period Japanese Temple Architecture',
    description: 'Interlocking puzzle joint secured by a central hardwood wedge. Disassembles without hardware, yet tightens under vibrational load.',
    strengthRating: 'Exceptional (Tensile & Bending Resistant)',
    priceDelta: 750
  },
  {
    id: 'blind-floating-tenon',
    name: 'Precision Blind Floating Tenon & Hidden Titanium Pins',
    tradition: 'Modern Swiss Architectural Joinery',
    description: 'CNC cut mortises mated with dense hornbeam tenons and cross-pinned with aerospace titanium dowels.',
    strengthRating: 'Maximum Shear Capacity',
    priceDelta: 450
  },
  {
    id: 'cnc-billet-hubs',
    name: 'CNC 6061-T6 Billet Aluminum Anodized Hubs',
    tradition: 'Buckminster Fuller Geodesic Engineering',
    description: 'Precision milled aluminum star hubs with multi-axis strut pockets for geodesic dome load dispersion.',
    strengthRating: 'Engineered for 160 km/h Wind & Heavy Snow',
    priceDelta: 1200
  }
];

export const DOME_FREQUENCIES: DomeFrequencyOption[] = [
  {
    id: 'v2',
    name: '2V Frequency (40 Triangles / 65 Struts)',
    trianglesCount: 40,
    strutsCount: 65,
    hubsCount: 26,
    recommendedDiameter: '3.0m to 5.0m',
    complexity: 'Moderate / Fast Erection',
    description: 'Clean, bold geometric facets. Perfect for intimate garden reading retreats, meditation pods, and compact glamping spaces.'
  },
  {
    id: 'v3',
    name: '3V Frequency (90 Triangles / 120 Struts)',
    trianglesCount: 90,
    strutsCount: 120,
    hubsCount: 46,
    recommendedDiameter: '6.0m to 8.5m',
    complexity: 'High Architectural Harmony',
    description: 'The golden ratio of geodesic domes. Spherical elegance, optimal ceiling volume, ideal for luxury eco-resort glamping pods and garden studios.'
  },
  {
    id: 'v4',
    name: '4V Frequency (160 Triangles / 250 Struts)',
    trianglesCount: 160,
    strutsCount: 250,
    hubsCount: 92,
    recommendedDiameter: '9.0m to 16.0m',
    complexity: 'Masterwork Large Span',
    description: 'Monumental spherical symmetry. Engineered for yoga sanctuaries, boutique hotel wellness centers, and large-scale event pavilions.'
  }
];

export const HUGGING_FACE_SPACES: HuggingFaceSpace[] = [
  {
    id: 'trellis-2-microsoft',
    name: 'TRELLIS.2 (Microsoft)',
    author: 'microsoft',
    spaceUrl: 'https://huggingface.co/spaces/microsoft/TRELLIS.2',
    directEmbedUrl: 'https://microsoft-trellis-2.hf.space',
    description: 'State-of-the-art sparse voxel (O-Voxel) flow-matching 3D generator. Transforms single 2D furniture sketches or room photos into high-fidelity 3D meshes with complete PBR textures and open-surface topology.',
    primaryUse: 'Convert customer sketches & custom carpentry CAD renders into interactive 3D GLB models.',
    recommendedInput: 'Isolated photo or transparent PNG of furniture design concept.',
    hardwareTier: 'ZeroGPU / A100 High VRAM',
    modelArchitecture: 'Rectified Flow Transformer + Gaussian & Mesh Radiance Decoders',
    tags: ['3D Generation', 'PBR Materials', 'GLB Export', 'ZeroGPU'],
    samplePrompt: 'Solid black walnut floating tensegrity coffee table, aeronautical stainless steel cables, clean architectural lines, minimalist white background, 8k resolution'
  },
  {
    id: 'triposr-stability',
    name: 'TripoSR (Stability AI & Tripo)',
    author: 'stabilityai',
    spaceUrl: 'https://huggingface.co/spaces/stabilityai/TripoSR',
    directEmbedUrl: 'https://stabilityai-triposr.hf.space',
    description: 'Ultra-fast feed-forward 3D mesh generation. Reconstructs full 3D geometry in under 3.5 seconds from a single perspective photo.',
    primaryUse: 'Instant real-time 3D draft generation for clients experimenting with unique table silhouettes.',
    recommendedInput: 'Side-profile or 45-degree angle photo of custom woodwork.',
    hardwareTier: 'ZeroGPU (Instant ~3s inference)',
    modelArchitecture: 'Feed-forward Large Reconstruction Model (LRM)',
    tags: ['Fast 3D', 'Instant Mesh', 'OBJ/GLB', 'Lightweight'],
    samplePrompt: 'Geodesic timber dome gazebo with solid oak struts and glass skylight facet panels'
  },
  {
    id: 'interior-gen3d',
    name: 'InteriorGen3D (Spatial Room Staging)',
    author: 'stevee00',
    spaceUrl: 'https://huggingface.co/spaces/stevee00/InteriorGen3D',
    directEmbedUrl: 'https://stevee00-interiorgen3d.hf.space',
    description: 'Specialized 3D room understanding pipeline integrating Depth Anything and multi-object generation to generate and place bespoke 3D furniture into architectural room layouts.',
    primaryUse: 'Client space visualization: see how a tensegrity dining table or geodesic dome gazebo sits in your exact living room or backyard.',
    recommendedInput: 'Room photograph taken from eye-level corner.',
    hardwareTier: 'ZeroGPU',
    modelArchitecture: 'Depth-Guided Transformer + Layout Diffusion',
    tags: ['Room Understanding', 'Interior Staging', 'Depth Anything', 'Spatial AI'],
    samplePrompt: 'High-ceiling minimalist architectural loft featuring an 8-seater solid walnut tensegrity dining table with brass turnbuckles'
  },
  {
    id: 'room-redesign-tavan',
    name: 'Room Redesign & Staging (ControlNet)',
    author: 'TavanIT',
    spaceUrl: 'https://huggingface.co/spaces/TavanIT/Room-Redesign',
    directEmbedUrl: 'https://tavanit-room-redesign.hf.space',
    description: 'Photorealistic AI virtual staging that preserves room geometry while redesigning furnishings, woodwork, and ambient illumination.',
    primaryUse: 'Clients upload their existing living room photo and visualize it transformed with luxury timber and tensegrity statement pieces.',
    recommendedInput: 'Photo of client living room, patio, or vacant space.',
    hardwareTier: 'ZeroGPU',
    modelArchitecture: 'ControlNet Depth + SD-XL Architectural Inpainting',
    tags: ['Virtual Staging', 'Room Redesign', 'Photorealistic', 'ControlNet'],
    samplePrompt: 'Luxurious Japandi living room with floating tensegrity coffee table, warm recessed lighting, and timber slat feature walls'
  },
  {
    id: 'instant4d-splatv',
    name: 'Instant4D / Splatv (Holograma 4D Pipeline)',
    author: 'ix64 / holograma',
    spaceUrl: 'https://huggingface.co/spaces/anysplat-zerogpu-demo',
    directEmbedUrl: 'https://anysplat-zerogpu-demo.hf.space',
    description: 'Video-to-Gaussian-Splatting 4D reconstruction pipeline inspired by Holograma. Allows clients to walk around their prospective room with their phone, upload the MP4, and generate a photorealistic 3D Gaussian Splat scene for precision spatial fitting.',
    primaryUse: 'High-end clients submitting a video scan of their residence for millimetric custom furniture integration.',
    recommendedInput: '360 degree video scan of room or outdoor patio.',
    hardwareTier: 'T4 / A10 Job Queue or ZeroGPU',
    modelArchitecture: '4D Spacetime Gaussian Splatting + .splatv web viewer',
    tags: ['Gaussian Splatting', '4D Video', 'Holograma Pipeline', 'Splatv'],
    samplePrompt: '360 degree video scan of modern penthouse terrace ready for timber geodesic dome placement'
  }
];

export const INNOVATIVE_PROJECTS: InnovativeProjectShowcase[] = [
  {
    id: 'leviton-dining-table',
    category: 'tensegrity',
    title: 'Mesa de Jantar Flutuante Leviton',
    subtitle: 'Mesa suspensa para 8 a 10 lugares em Cumaru maciço',
    dimensions: '260 cm (C) × 105 cm (L) × 76 cm (A)',
    materials: ['Cumaru Amazônico Maciço FSC®', 'Aço Inox Naval 316 (6mm)', 'Conectores Ocultos em Titânio'],
    physicsPrinciple: 'Elementos de compressão descontínuos equilibrados por cabos de tração contínua.',
    maxLoadBearing: '450 kg (Deflexão milimétrica zero testada)',
    craftingDuration: '140 horas de marcenaria autoral',
    description: 'Um triunfo da física estrutural que desafia a intuição. O tampo maciço em prancha única de Cumaru flutua 40 cm acima de sua base escultural, estabilizado por cabos de aço naval tensionados com precisão milimétrica.',
    keyFeatures: [
      'Prancha maciça selecionada com acabamento em óleo orgânico fosco',
      'Esticadores náuticos micro-ajustados para 12,4 kN de pré-tensão',
      'Perfil fino com borda chanfrada de alta precisão',
      'Estrutura projetada para durar gerações'
    ],
    imagePlaceholder: 'linear-gradient(135deg, rgba(8, 28, 18, 0.95) 0%, rgba(14, 48, 30, 0.9) 100%)',
    defaultConfig: {
      category: 'tensegrity-dining-table',
      title: 'Mesa Leviton Cumaru',
      woodSpeciesId: 'reclaimed-brazilian-teak',
      tensionSystemId: 'marine-stainless-316',
      joineryId: 'kanawa-tsugi',
      dimensions: { length: 260, width: 105, height: 76 }
    }
  },
  {
    id: 'aetherium-executive-desk',
    category: 'tensegrity',
    title: 'Bancada Executiva Cantilever Aetherium',
    subtitle: 'Estação de trabalho com balanço em gravidade zero',
    dimensions: '220 cm (C) × 95 cm (L) × 75 cm (A)',
    materials: ['Freijó Maciço Curvado', 'Cabos em Titânio Dourado PVD', 'Couro Legítimo Pespontado'],
    physicsPrinciple: 'Treliça bilateral de tensegridade suportando balanço em balcão de 1,2m.',
    maxLoadBearing: '280 kg distribuídos',
    craftingDuration: '165 horas de marcenaria autoral',
    description: 'Projetada para escritórios de arquitetura e residências visionárias. A superfície de trabalho estende-se em balanço livre sustentada por cabos de titânio dourado PVD com dutos invisíveis de fiação.',
    keyFeatures: [
      'Bancada em Freijó nobre com encaixes artesanais',
      'Tirantes em titânio dourado com acabamento espelhado',
      'Gaveteiro flutuante com amortecimento acústico',
      'Carregamento por indução integrado à madeira'
    ],
    imagePlaceholder: 'linear-gradient(135deg, rgba(16, 32, 22, 0.95) 0%, rgba(24, 56, 38, 0.9) 100%)',
    defaultConfig: {
      category: 'tensegrity-executive-desk',
      title: 'Bancada Aetherium Freijó',
      woodSpeciesId: 'european-white-oak',
      tensionSystemId: 'pvd-gold-titanium',
      joineryId: 'blind-floating-tenon',
      dimensions: { length: 220, width: 95, height: 75 }
    }
  },
  {
    id: 'snelson-coffee-table',
    category: 'tensegrity',
    title: 'Mesa de Centro Hiperbólica Snelson',
    subtitle: 'Homenagem ao escultor Kenneth Snelson',
    dimensions: '140 cm (C) × 80 cm (L) × 45 cm (A)',
    materials: ['Jacarandá da Bahia de Demolição', 'Cabos de Fibra de Carbono & Inox'],
    physicsPrinciple: 'Equilíbrio tensil hiperbólico em três pontos focais.',
    maxLoadBearing: '200 kg',
    craftingDuration: '95 horas de marcenaria autoral',
    description: 'Minimalismo escultural e desafio à gravidade. Peças de madeira nobre parecem flutuar no espaço vazio, conectadas por cordas de fibra de carbono que permitem a passagem plena de luz no living.',
    keyFeatures: [
      'Madeira nobre tratada com cera de abelha natural',
      'Tirantes em aço inoxidável e fibra de carbono',
      'Opção de tampo em vidro temperado ultra-clear',
      'Edição numerada de ateliê (1 de 24)'
    ],
    imagePlaceholder: 'linear-gradient(135deg, rgba(8, 24, 16, 0.95) 0%, rgba(12, 40, 26, 0.9) 100%)',
    defaultConfig: {
      category: 'tensegrity-coffee-table',
      title: 'Mesa de Centro Snelson',
      woodSpeciesId: 'japanese-charred-cedar',
      tensionSystemId: 'carbon-stealth-black',
      joineryId: 'kanawa-tsugi',
      dimensions: { length: 140, width: 80, height: 45 }
    }
  },
  {
    id: 'solace-glamping-dome',
    category: 'geodesic',
    title: 'Cúpula Geodésica Biosfera Solace 6M',
    subtitle: 'Santuário arquitetônico de 6 metros para eco-resorts e spas',
    dimensions: '6.0 m (Diâmetro) × 3.6 m (Altura)',
    materials: ['Eucalipto Tratado Estrutural', 'Nós CNC em Alumínio 6061-T6 Naval', 'Membrana Arquitetônica Translúcida'],
    physicsPrinciple: 'Icosaedro geodésico frequência 3V com dispersão omnidirecional de cargas.',
    maxLoadBearing: 'Resistência a ventos de 160 km/h e sobrecargas estruturais',
    craftingDuration: '220 horas de usinagem e marcenaria',
    description: 'A referência máxima em hospitalidade de luxo sustentável. Estrutura autoportante em madeira com 120 escoras calibradas e nós centrais usinados em alumínio naval para lounge ou refúgio de meditação.',
    keyFeatures: [
      'Nós estelares em alumínio anodizado dourado',
      'Madeira estrutural tratada contra umidade e pragas',
      'Claraboia panorâmica zenital para observação de estrelas',
      'Montagem modular em apenas 48 horas'
    ],
    imagePlaceholder: 'linear-gradient(135deg, rgba(6, 30, 20, 0.95) 0%, rgba(10, 52, 34, 0.9) 100%)',
    defaultConfig: {
      category: 'geodesic-glamping-dome',
      title: 'Cúpula Solace 6M',
      woodSpeciesId: 'european-white-oak',
      tensionSystemId: 'marine-stainless-316',
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
    projectSummary: 'Mesa de Jantar Flutuante Ipanema para 10 lugares em Cumaru Maciço.',
    status: 'reviewed',
    notes: 'Arquiteto enviou planta do living. Cliente deseja prancha única com acabamento fosco.'
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
    projectSummary: 'Duas Cúpulas Geodésicas Biosfera 6M para lounge de spa.',
    status: 'consultation-scheduled',
    notes: 'Visita técnica agendada no ateliê. Instalação prevista para início de 2027.'
  }
];
