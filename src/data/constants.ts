import { WoodSpecies, TensionSystem, JoineryType, DomeFrequencyOption, HuggingFaceSpace, InnovativeProjectShowcase } from '../types';

export const WOOD_SPECIES: WoodSpecies[] = [
  {
    id: 'american-black-walnut',
    name: 'American Black Walnut',
    scientificName: 'Juglans nigra',
    origin: 'Appalachian Highlands, USA',
    description: 'Deep espresso hues with purple undertones and flowing cathedral grain. Exceptional dimensional stability and velvety tactile finish.',
    colorHex: '#3d2b1f',
    threeColor: 0x3d2b1f,
    roughness: 0.35,
    jankaHardness: 1010,
    sustainabilityBadge: 'FSC 100% Certified / Sustainably Harvested',
    pricePerBoardFoot: 18.5,
    carbonOffsetKg: 42
  },
  {
    id: 'european-white-oak',
    name: 'European White Oak',
    scientificName: 'Quercus alba',
    origin: 'Bavarian Forest, Germany',
    description: 'Quarter-sawn with prominent medullary rays. Superior natural tannin resistance, moisture stability, and luminous architectural blonde tone.',
    colorHex: '#b8976b',
    threeColor: 0xb8976b,
    roughness: 0.45,
    jankaHardness: 1360,
    sustainabilityBadge: 'PEFC Certified Old-Growth Replant',
    pricePerBoardFoot: 15.0,
    carbonOffsetKg: 50
  },
  {
    id: 'reclaimed-brazilian-teak',
    name: 'Reclaimed Brazilian Teak (Cumaru)',
    scientificName: 'Dipteryx odorata',
    origin: 'Amazon Basin Reclaimed Architectural Salvage',
    description: 'Extreme density and rich honey-bronze patina. Naturally impervious to rot, insects, and harsh coastal weather.',
    colorHex: '#8b5a2b',
    threeColor: 0x8b5a2b,
    roughness: 0.30,
    jankaHardness: 3540,
    sustainabilityBadge: '100% Reclaimed Timber Salvage',
    pricePerBoardFoot: 24.0,
    carbonOffsetKg: 78
  },
  {
    id: 'japanese-charred-cedar',
    name: 'Yakisugi Charred Cedar',
    scientificName: 'Cryptomeria japonica',
    origin: 'Yoshino, Nara Prefecture, Japan',
    description: 'Traditional Shou Sugi Ban fire-tempered surface. Creates a sculptural matte black alligator texture that naturally repels water and fire.',
    colorHex: '#18191c',
    threeColor: 0x18191c,
    roughness: 0.70,
    jankaHardness: 900,
    sustainabilityBadge: 'Zero-Chemical Thermal Preservation',
    pricePerBoardFoot: 21.0,
    carbonOffsetKg: 35
  },
  {
    id: 'figured-tiger-maple',
    name: 'Figured Tiger Maple',
    scientificName: 'Acer saccharum',
    origin: 'Vermont, USA',
    description: 'Exquisite 3D holographic curl grain (chatoyancy) that shimmers under directional lighting. Museum-grade centerpiece grade.',
    colorHex: '#dfbe8f',
    threeColor: 0xdfbe8f,
    roughness: 0.28,
    jankaHardness: 1450,
    sustainabilityBadge: 'SFI Certified Selective Felling',
    pricePerBoardFoot: 26.5,
    carbonOffsetKg: 46
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
    title: 'The Leviton Floating Dining Table',
    subtitle: '8-Seat Solid Black Walnut Suspended Table',
    dimensions: '260 cm (L) × 105 cm (W) × 76 cm (H)',
    materials: ['Appalachian Black Walnut', '316 Marine Stainless Steel (6mm)', 'Concealed Titanium Tension Anchors'],
    physicsPrinciple: 'Discontinuous compression struts balanced by continuous perimeter tensile cables.',
    maxLoadBearing: '380 kg (Tested zero deflection with 4 adults seated on tabletop)',
    craftingDuration: '140 Master Artisan Crafting Hours',
    description: 'A structural triumph that challenges human intuition. The massive 70mm solid walnut tabletop floats 40cm above its sculptural base, connected only by a central vertical tension spine and four perimeter stabilizer cables. Vibrations are naturally dampened by the cable network, yielding a rock-solid, serene dining experience.',
    keyFeatures: [
      'Book-matched American Black Walnut slab with natural live-edge profile',
      'Precision laser-tensioned turnbuckles calibrated to 12.4 kN of tensile preload',
      'Integrated underside soft-glow warm 2700K LED channel',
      'Hand-rubbed organic hardwax oil finish'
    ],
    imagePlaceholder: 'linear-gradient(135deg, #1f1d19 0%, #3d2b1f 100%)',
    defaultConfig: {
      category: 'tensegrity-dining-table',
      title: 'The Leviton Dining Table',
      woodSpeciesId: 'american-black-walnut',
      tensionSystemId: 'marine-stainless-316',
      joineryId: 'kanawa-tsugi',
      dimensions: { length: 260, width: 105, height: 76 }
    }
  },
  {
    id: 'aetherium-executive-desk',
    category: 'tensegrity',
    title: 'The Aetherium Cantilever Executive Desk',
    subtitle: 'Zero-Gravity Architectural Executive Workstation',
    dimensions: '220 cm (L) × 95 cm (W) × 75 cm (H)',
    materials: ['Quarter-Sawn European White Oak', 'PVD Titanium Mirror Gold Cables', 'Italian Full-Grain Saddle Leather'],
    physicsPrinciple: 'Bilateral tensegrity truss supporting a 1.2m floating cantilever.',
    maxLoadBearing: '240 kg uniformly distributed',
    craftingDuration: '165 Master Artisan Crafting Hours',
    description: 'Designed for visionary executives and architectural connoisseurs. The writing surface extends in a breathtaking cantilever suspended entirely by gold PVD titanium aircraft cables. Features invisible wireless charging coils milled directly into the underside of the oak surface and hidden cable conduits routed through the tension anchors.',
    keyFeatures: [
      'Recessed hand-stitched Italian leather blotter insert',
      'Twin concealed motorized drawers with soft-touch acoustic dampening',
      'PVD Titanium gold hardware with 100-year anti-tarnish guarantee',
      'Integrated high-speed wireless charging inlays'
    ],
    imagePlaceholder: 'linear-gradient(135deg, #2b261f 0%, #b8976b 100%)',
    defaultConfig: {
      category: 'tensegrity-executive-desk',
      title: 'The Aetherium Executive Desk',
      woodSpeciesId: 'european-white-oak',
      tensionSystemId: 'pvd-gold-titanium',
      joineryId: 'blind-floating-tenon',
      dimensions: { length: 220, width: 95, height: 75 }
    }
  },
  {
    id: 'snelson-coffee-table',
    category: 'tensegrity',
    title: 'The Snelson Minimalist Coffee Table',
    subtitle: 'Tribute to Kenneth Snelson & Buckminster Fuller',
    dimensions: '140 cm (L) × 80 cm (W) × 45 cm (H)',
    materials: ['Yakisugi Charred Japanese Cedar', 'Matte Carbon & Vectran Hybrid Cables'],
    physicsPrinciple: 'Tri-point hyperbolic tension equilibrium.',
    maxLoadBearing: '180 kg',
    craftingDuration: '95 Master Artisan Crafting Hours',
    description: 'Sculptural minimalism meeting structural defiance. Fire-hardened Shou Sugi Ban cedar beams appear to hover in empty space, suspended by ultra-lightweight matte black carbon fiber cordage. The open visual footprint allows light to flow freely through modern living rooms.',
    keyFeatures: [
      'Fire-charred Yakisugi cedar with tactile alligator surface',
      'Ultra-high molecular weight carbon fiber tension lines',
      'Tempered low-iron ultra-clear starphire glass top option',
      'Hand-numbered limited atelier edition (1 of 24)'
    ],
    imagePlaceholder: 'linear-gradient(135deg, #101216 0%, #22252a 100%)',
    defaultConfig: {
      category: 'tensegrity-coffee-table',
      title: 'The Snelson Coffee Table',
      woodSpeciesId: 'japanese-charred-cedar',
      tensionSystemId: 'carbon-stealth-black',
      joineryId: 'kanawa-tsugi',
      dimensions: { length: 140, width: 80, height: 45 }
    }
  },
  {
    id: 'solace-glamping-dome',
    category: 'geodesic',
    title: 'The Solace 6M Timber Glamping Dome',
    subtitle: 'Luxury 4-Season Eco-Resort Living Sanctuary',
    dimensions: '6.0 m Diameter × 3.6 m Peak Height (28.3 m² / 305 sq ft)',
    materials: ['Reclaimed Brazilian Teak & Douglas Fir', 'Anodized 6061-T6 Billet Aluminum Hubs', 'Insulated Multi-Layer Canvas & Tri-Glaze Bay'],
    physicsPrinciple: '3V Geodesic Icosahedron distributing stress spherically to withstand 150 km/h winds.',
    maxLoadBearing: 'Engineered for 220 kg/m² snow load',
    craftingDuration: '240 Atelier Production & Pre-assembly Hours',
    description: 'A benchmark in luxury glamping and eco-hospitality. Crafted from precision-milled timber struts joined by our proprietary aerospace billet aluminum hubs. Includes a 120-degree panoramic bay window for uninterrupted star-gazing, thermal insulation rated down to -25°C, and modular sub-floor framing ready for rapid off-grid installation.',
    keyFeatures: [
      'Modular pre-assembled timber triangles for 2-day on-site erection',
      'Panoramic curved tri-layer polycarbonate / glass panoramic crown',
      'Internal cedar acoustic baffle ceiling for concert-hall quietness',
      'Integrated stove chimney port and discreet ventilation louvers'
    ],
    imagePlaceholder: 'linear-gradient(135deg, #16242b 0%, #0284c7 100%)',
    defaultConfig: {
      category: 'geodesic-glamping-dome',
      title: 'The Solace 6M Glamping Dome',
      woodSpeciesId: 'reclaimed-brazilian-teak',
      tensionSystemId: 'marine-stainless-316',
      joineryId: 'cnc-billet-hubs',
      domeFrequency: 'v3',
      glazingCoverage: 'stargazing',
      dimensions: { diameter: 6.0, domeHeight: 3.6 }
    }
  },
  {
    id: 'biosphere-garden-studio',
    category: 'geodesic',
    title: 'The Biosphere 8M Detached Creative Studio',
    subtitle: 'Biophilic Timber Sanctuary & Architectural Pavilion',
    dimensions: '8.0 m Diameter × 4.8 m Peak Height (50.3 m² / 541 sq ft)',
    materials: ['Bavarian White Oak', 'Charred Yakisugi Trim', 'Double-Glazed Low-E Argon Glass Triangles'],
    physicsPrinciple: '3V Geodesic Self-Supporting Spherical Shell (Zero interior support columns).',
    maxLoadBearing: 'Commercial Building Code Compliant',
    craftingDuration: '320 Atelier Production Hours',
    description: 'The ultimate standalone backyard creative studio, music room, or wellness sanctuary. With over 50 square meters of column-free space, the interior feels boundless. The natural acoustic geometry disperses standing sound waves, while floor-to-ceiling timber joinery creates an atmosphere of deep grounding and focus.',
    keyFeatures: [
      'Fully glazed skylight dome eye (Oculus) with motorized rain sensor',
      'Architectural oak parquet flooring integrated with radiant heating channels',
      'Hidden wire raceways integrated into geodesic timber struts',
      'Certified for permanent residential and commercial occupancy'
    ],
    imagePlaceholder: 'linear-gradient(135deg, #1c2e1f 0%, #2e7d32 100%)',
    defaultConfig: {
      category: 'geodesic-studio-pod',
      title: 'The Biosphere 8M Creative Studio',
      woodSpeciesId: 'european-white-oak',
      tensionSystemId: 'marine-stainless-316',
      joineryId: 'cnc-billet-hubs',
      domeFrequency: 'v3',
      glazingCoverage: 'fully-glazed',
      dimensions: { diameter: 8.0, domeHeight: 4.8 }
    }
  }
];

export const SAMPLE_INITIAL_LEADS = [
  {
    id: 'TT-2026-9041',
    createdAt: '2026-10-18T14:32:00Z',
    clientName: 'Julian Vance & Associates',
    clientEmail: 'julian@vance-architecture.com',
    clientPhone: '+1 (415) 890-4122',
    clientLocation: 'Big Sur, California',
    clientType: 'architect',
    budgetBracket: '$35k - $75k',
    targetTimeline: 'standard-60-90days',
    consultationType: 'virtual-3d-walkthrough',
    projectSummary: 'Custom 10-seater Leviton dining table in Black Walnut with PVD Gold hardware for a cliffside ocean residence.',
    status: 'reviewed',
    notes: 'Architect shared CAD floorplan. Client wants live-edge walnut with integrated LED underglow.'
  },
  {
    id: 'TT-2026-9042',
    createdAt: '2026-10-19T09:15:00Z',
    clientName: 'Aura Eco-Resorts Group',
    clientEmail: 'developments@auraretreats.ch',
    clientPhone: '+41 22 790 1104',
    clientLocation: 'Zermatt, Switzerland',
    clientType: 'resort-glamping',
    budgetBracket: '$75k+',
    targetTimeline: 'flexible-6months',
    consultationType: 'in-person-atelier',
    projectSummary: 'Three Solace 6M Glamping Domes with Teak framing and extreme alpine snow package.',
    status: 'consultation-scheduled',
    notes: 'VIP Consultation booked. Looking for delivery in May 2027.'
  }
];
