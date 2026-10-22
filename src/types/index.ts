export type ProjectCategory =
  | 'tensegrity-dining-table'
  | 'tensegrity-coffee-table'
  | 'tensegrity-executive-desk'
  | 'tensegrity-cantilever-chair'
  | 'geodesic-glamping-dome'
  | 'geodesic-studio-pod'
  | 'geodesic-event-pavilion'
  | 'bespoke-architectural';

export interface WoodSpecies {
  id: string;
  name: string;
  scientificName: string;
  origin: string;
  description: string;
  colorHex: string;
  threeColor: number;
  roughness: number;
  jankaHardness: number;
  sustainabilityBadge: string;
  pricePerBoardFoot: number;
  carbonOffsetKg: number;
}

export interface TensionSystem {
  id: string;
  name: string;
  material: string;
  breakingLoadKg: number;
  finish: string;
  colorHex: string;
  threeColor: number;
  metalness: number;
  pricePerMeter: number;
}

export interface JoineryType {
  id: string;
  name: string;
  tradition: string;
  description: string;
  strengthRating: string;
  priceDelta: number;
}

export interface DomeFrequencyOption {
  id: 'v2' | 'v3' | 'v4';
  name: string;
  trianglesCount: number;
  strutsCount: number;
  hubsCount: number;
  recommendedDiameter: string;
  complexity: string;
  description: string;
}

export interface ProjectConfiguration {
  category: ProjectCategory;
  title: string;
  dimensions: {
    length?: number; // cm
    width?: number;  // cm
    height?: number; // cm
    diameter?: number; // meters for domes
    domeHeight?: number; // meters for domes
  };
  woodSpeciesId: string;
  tensionSystemId: string;
  joineryId: string;
  domeFrequency: 'v2' | 'v3' | 'v4';
  glazingCoverage: 'open' | 'stargazing' | 'fully-glazed';
  finishType: 'organic-matte-oil' | 'polyurethane-architectural' | 'shou-sugi-charred';
  addons: {
    integratedLedLighting: boolean;
    hiddenWirelessCharging: boolean;
    marineWeatherproofing: boolean;
    insulatedCanvasEnvelope: boolean;
    titaniumTurnbuckles: boolean;
    whiteGloveInstallation: boolean;
  };
  customNotes?: string;
}

export interface BillOfMaterialsItem {
  category: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface EstimateResult {
  lumberBoardFeet: number;
  cableLengthMeters: number;
  hubConnectorsCount: number;
  artisanHours: number;
  estimatedWeeks: number;
  materialsCost: number;
  craftsmanshipCost: number;
  hardwareCost: number;
  addonsCost: number;
  subtotal: number;
  estimatedTax: number;
  totalEstimate: number;
  bom: BillOfMaterialsItem[];
  loadCapacityKg: number;
}

export interface LeadSubmission {
  id: string;
  createdAt?: string;
  submittedAt?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientLocation?: string;
  projectLocation?: string;
  clientType: 'private-homeowner' | 'architect' | 'resort-glamping' | 'commercial-corporate' | string;
  budgetBracket: '$5k - $15k' | '$15k - $35k' | '$35k - $75k' | '$75k+' | string;
  targetTimeline?: 'urgent-30days' | 'standard-60-90days' | 'flexible-6months' | string;
  timeline?: string;
  consultationType?: 'virtual-3d-walkthrough' | 'in-person-atelier' | 'on-site-architectural' | string;
  configuration: ProjectConfiguration;
  estimate: EstimateResult;
  projectSummary?: string;
  notes?: string;
  attachmentName?: string;
  status: 'new' | 'reviewed' | 'consultation-scheduled' | 'deposit-received' | 'in-production';
}

export interface HuggingFaceSpace {
  id: string;
  name: string;
  author: string;
  spaceUrl: string;
  directEmbedUrl: string;
  description: string;
  primaryUse: string;
  recommendedInput: string;
  hardwareTier: string;
  modelArchitecture: string;
  tags: string[];
  samplePrompt: string;
}

export interface InnovativeProjectShowcase {
  id: string;
  category: 'tensegrity' | 'geodesic';
  title: string;
  subtitle: string;
  dimensions: string;
  materials: string[];
  physicsPrinciple: string;
  maxLoadBearing: string;
  craftingDuration: string;
  description: string;
  keyFeatures: string[];
  imagePlaceholder: string;
  defaultConfig: Partial<ProjectConfiguration>;
}
