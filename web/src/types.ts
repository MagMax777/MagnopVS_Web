export type TutorialPhase = 
  | 'egg_discovery'
  | 'egg_hatching'
  | 'intro'
  | 'home'
  | 'quantvm_matrix'
  | 'sagas'
  | 'atlas'
  | 'profile'
  | 'mlh'
  | 'marketplace'
  | 'alchemy'
  | 'magfam'
  | 'social'
  | 'codex'
  | 'magnoways'
  | 'evolution'
  | 'reward';

export type FactionType = 
  | 'Arquitectos Quantvm' 
  | 'Nómadas Cósmicos' 
  | 'Tejedores Estelares';

export type TabType =
  | 'events' 
  | 'landing' 
  | 'dashboard' 
  | 'profile'
  | 'herogame' 
  | 'magfam' 
  | 'alchemy' 
  | 'atlas' 
  | 'magnoways'
  | 'marketplace'
  | 'sofia' 
  | 'almanac' 
  | 'mcds' 
  | 'quantvmmatrix' 
  | 'saga' 
  | 'codex' 
  | 'social';

export * from './types/magnoways';
export * from './types/marketplace';
export * from './types/financial';
export * from './types/magfam';

export interface PlayerStats {
  quantvmEnergy: number;  // 0-100
  cosmicTuning: number;   // 0-100
  intellectSofia: number; // 0-100
  factionReputation: number; // 0-100
}

export interface PlayerProfile {
  id: string;
  name: string;
  title: string;
  avatarUrl: string;
  bannerUrl?: string;
  backgroundUrl?: string;
  bio?: string;
  statusMessage?: string;
  guildName?: string;
  level: number;
  currentXp: number;
  maxXp: number;
  magnoPoints: number; // 1 MP = 1 USD reference parity
  magnoCoins: number;  // MC (Convertible to MP via dynamic rate engine)
  microCoins: number;  // µC (Internal non-convertible participation units)
  magnoPointsPending?: number;
  magnoPointsLocked?: number;
  magnoPointsWithdrawing?: number;
  totalEarnedMp?: number;
  totalSpentMp?: number;
  totalConvertedMp?: number;
  totalEarnedMicroCoins?: number;
  totalSpentMicroCoins?: number;
  totalEarnedMc?: number;
  totalConvertedMc?: number;
  kycStatus?: 'NOT_STARTED' | 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
  preferredFiatCurrency?: string;
  faction: FactionType;
  stats: PlayerStats;
  equippedTitleId?: string;
  equippedFrameId?: string;
  isLoggedIn: boolean;
  eggUnlocked?: boolean;
}

export type WalletTransactionType = 
  | 'REWARD' 
  | 'CONVERSION' 
  | 'PURCHASE' 
  | 'ADJUSTMENT' 
  | 'TIP' 
  | 'REFUND';

export type WalletCurrency = 'MP' | 'MICROCOIN';

export interface WalletTransaction {
  id: string;
  walletId?: string;
  transactionType: WalletTransactionType;
  currency: WalletCurrency;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  source: string;
  sourceReference?: string;
  idempotencyKey?: string;
  description: string;
  metadata?: Record<string, any>;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  createdAt: string;
}

export interface WalletSummary {
  playerId: string;
  magnoPoints: number;
  microCoins: number;
  totalEarnedMp: number;
  totalSpentMp: number;
  totalConvertedMp: number;
  totalEarnedMicroCoins: number;
  totalSpentMicroCoins: number;
  conversionRate: number; // Always 10000 (10,000 MP = 1 µC)
}

export interface LiveChatRoom {
  id: string;
  name: string;
  slug: string;
  type: 'public' | 'live' | 'private';
  description?: string;
  activeStreamer?: string;
  streamTitle?: string;
  viewerCount: number;
  isLive: boolean;
  bannerUrl?: string;
  category?: string;
}

export interface LiveChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  senderRole?: 'player' | 'vip' | 'mod' | 'streamer' | 'cosmic';
  senderLevel?: number;
  senderFaction?: string;
  content: string;
  tipAmount?: number;
  tipCurrency?: WalletCurrency;
  reactions?: { emoji: string; count: number }[];
  createdAt: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  recipientId: string;
  senderName: string;
  senderAvatar?: string;
  recipientName: string;
  recipientAvatar?: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface MagFamCreature {
  id: string;
  name: string;
  species: string;
  rarity: 'común' | 'raro' | 'épico' | 'legendario';
  element: 'Plasma' | 'Tech' | 'Void' | 'Aether';
  level: number;
  hunger: number; // 0-100
  affinity: number; // 0-100
  imageUrl: string;
  description: string;
  isEgg?: boolean;
  hatchProgress?: number; // 0-100
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'diaria' | 'lore' | 'sistema';
  xpReward: number;
  mpReward: number;
  target: number;
  current: number;
  isCompleted: boolean;
  isClaimed: boolean;
  iconName: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'nucleo' | 'reliquia' | 'artefacto' | 'matriz';
  rarity: 'común' | 'raro' | 'épico' | 'legendario';
  description: string;
  icon: string;
  powerValue: number;
  loreSnippet: string;
  quantity: number;
}

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  priceMp: number;
  priceMicroCoins?: number;
  category: 'frame' | 'title' | 'catalyst' | 'lore';
  icon: string;
  rarity: 'raro' | 'épico' | 'legendario';
  isPurchased?: boolean;
}

export interface AtlasNode {
  id: string;
  name: string;
  subtitle: string;
  type: 'reino' | 'nodo' | 'santuario' | 'portal';
  x: number; // Percentage on canvas 0 - 100
  y: number; // Percentage on canvas 0 - 100
  description: string;
  detailedLore: string;
  status: 'activo' | 'sintonizando' | 'bloqueado';
  energyLevel: number;
  accentColor: string;
}

export interface AlmanacChapter {
  id: string;
  title: string;
  subtitle: string;
  category: 'Cosmogonia' | 'Cósmico' | 'Cósmica' | 'Facciones' | 'Quantvm';
  textContent: string;
  unlockedAtLevel: number;
  quote?: string;
}

export interface SofiaMessage {
  id: string;
  role: 'user' | 'sofia';
  content: string;
  timestamp: string;
}

// =========================================================
// MagnopVS COMIC DESIGN SYSTEM (MCDS) METAASSET ARCHITECTURE
// =========================================================

export type MCDSCategoryType = 
  | 'UI' | 'Speech' | 'Panels' | 'Frames' | 'FX' | 'Backgrounds' 
  | 'Characters' | 'Expressions' | 'Hands' | 'Eyes' | 'Hair' | 'Clothes' 
  | 'Weapons' | 'Items' | 'Buildings' | 'Nature' | 'Vehicles' | 'Creatures' 
  | 'Magic' | 'Particles' | 'Typography' | 'Icons' | 'Logos' 
  | 'Audio' | 'Music' | 'Voices' | 'Animations' | 'Videos' | '3D' | 'AR' | 'MR' 
  | 'Templates' | 'Print' | 'Web' | 'Lore' | 'Documents';

export type MetaAssetStatus = 'borrador' | 'revision' | 'aprobado' | 'obsoleto';

export type MetaFileFormat = 
  | 'SVG' | 'PNG' | 'JPG' | 'WebP' | 'GIF' | 'PDF' 
  | 'PSD' | 'CLIP' | 'KRITA' | 'AFFINITY' | 'BLEND' 
  | 'GLB' | 'FBX' | 'OBJ' | 'MP3' | 'WAV' | 'MP4' 
  | 'LOTTIE' | 'USDZ' | 'JSON' | 'HTML' | 'CSS' | 'JS' | 'SHADER';

export interface MetaAssetResource {
  id: string;
  format: MetaFileFormat;
  label: string;
  url: string;
  sizeBytes: number;
  resolution?: string;
  dpi?: number;
  lastUpdated: string;
  isPreviewSupported: boolean;
}

export interface MetaAssetVariant {
  id: string;
  name: string;
  state: 'Default' | 'Hover' | 'Active' | 'High Energy' | 'Disabled' | 'Print CMYK' | 'Dark Mode' | 'Light Mode';
  platform: 'Web' | 'Print' | 'Mobile' | 'Tablet' | 'Desktop' | 'AR' | 'MR' | 'Cinematics';
  previewUrl: string;
}

export interface MetaAssetVersion {
  versionNumber: string; // v1, v2, v3
  releaseDate: string;
  author: string;
  changelog: string;
  fileSizeBytes: number;
  status: MetaAssetStatus;
}

export interface MetaAssetRelation {
  id: string;
  targetType: 'Personaje' | 'Escenario' | 'Capítulo' | 'MagZine' | 'Misión' | 'Evento' | 'Película' | 'Serie' | 'Libro' | 'Carta' | 'Modelo 3D' | 'Audio' | 'Video';
  targetName: string;
  relationType: 'pertenece_a' | 'aparece_en' | 'derivado_de' | 'requerido_por' | 'vinculado_a';
}

export interface MetaAsset {
  id: string;
  uuid: string;
  nombre: string;
  slug: string;
  descripcion: string;
  categoria: MCDSCategoryType;
  subcategoria: string;
  tipo: string;
  estado: MetaAssetStatus;
  autor: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  version: string;
  licencia: 'Propietario MagnopVS' | 'Creative Commons Transmedia' | 'Uso Exclusivo MagZine';
  palabras_clave: string[];
  saga: string;
  temporada: string;
  capitulo: string;
  magzine: string;
  personajes: string[];
  objetos: string[];
  lugares: string[];
  color_principal: string;
  color_secundario: string;
  tipografia: string;
  dimensiones: string; // e.g. "1920x1080", "210x297mm"
  dpi: number;
  formato_impresion: string;
  formato_web: string;
  peso: string; // e.g. "1.2 MB", "24.5 MB"
  idiomas: string[];
  compatibilidad: ('Web' | 'Print' | 'AR' | 'MR' | 'Unity' | 'Unreal' | 'ClipStudio' | 'Figma' | 'Blender' | 'Cinematics' | 'Mobile')[];
  dependencias: string[];
  thumbnailUrl: string;
  recursos: MetaAssetResource[];
  variants: MetaAssetVariant[];
  versionHistory: MetaAssetVersion[];
  relations: MetaAssetRelation[];
  documentationMarkdown?: string;
  notes?: string;
}

export interface MCDSCollection {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  coverUrl: string;
  assetCount: number;
  tags: string[];
  updatedAt: string;
  author: string;
  category: MCDSCategoryType;
  assetIds: string[];
}

export interface MCDSTemplate {
  id: string;
  nombre: string;
  tipo: 'página' | 'viñeta' | 'portada' | 'globo' | 'HUD' | 'interfaz' | 'capítulo' | 'MagZine' | 'carta' | 'póster';
  descripcion: string;
  thumbnailUrl: string;
  dimensiones: string;
  dpi: number;
  compatibleFormats: MetaFileFormat[];
  tags: string[];
  presetConfigJson: string;
}

export interface MCDSExporterPreset {
  id: string;
  name: string;
  targetPlatform: 'MagZine Web' | 'MagZine Impreso' | 'Cinemática 4K' | 'Game Engine GLTF' | 'AR/MR Spatial' | 'Figma Component' | 'Clip Studio Layer Package';
  formats: MetaFileFormat[];
  dpi: number;
  colorSpace: 'sRGB' | 'CMYK Coated FOGRA39' | 'Rec.709' | 'P3';
  embedMetadata: boolean;
}

