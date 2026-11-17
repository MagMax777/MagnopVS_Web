/**
 * ==============================================================================
 * MagnopVS - MAGNOWAYS TACTICAL GEOSPATIAL INTELLIGENCE TYPES
 * ==============================================================================
 * Planetary & Orbital situational matrix adapted from Osiris AI (osirisai.live)
 * to the MagnopVS multiversal lore, existential vehicles, and GE-13 nodal systems.
 * ==============================================================================
 */

export type MagnoWaysLayerId =
  | 'maritime'
  | 'satellites'
  | 'cctv'
  | 'cctv_previews'
  | 'live_news'
  | 'earthquakes'
  | 'global_incidents'
  | 'day_night'
  | 'cables'
  | 'sdk_sea'
  | 'sdk_air'
  | 'sdk_naval'
  | 'wind_controls'
  | 'rain_controls';

export type ExistentialVehicle =
  | 'Físico'
  | 'Vital'
  | 'Emocional'
  | 'Mental'
  | 'Causal'
  | 'Espiritual'
  | 'Cósmico';

export type LayerCategory =
  | 'space'
  | 'maritime'
  | 'aviation'
  | 'surveillance'
  | 'terrestrial'
  | 'weather'
  | 'intelligence';

export interface MagnoWaysLayerConfig {
  id: MagnoWaysLayerId;
  name: string;
  category: LayerCategory;
  iconName: string;
  description: string;
  active: boolean;
  existentialVehicle: ExistentialVehicle;
  count?: number;
  badge?: string;
}

export interface SatelliteTrack {
  id: string;
  name: string;
  noradId: number;
  type: 'LEO' | 'GEO' | 'STARLINK' | 'GPS' | 'ISS' | 'QUANTVM';
  lat: number;
  lng: number;
  altKm: number;
  velocityKmS: number;
  inclinationDeg: number;
  periodMin: number;
  trajectory: [number, number][]; // [lat, lng] path
  country: string;
  launchYear: number;
  status: 'ACTIVE' | 'CALIBRATING' | 'DECAYING';
  magnoWayResonance: string;
}

export interface MaritimeVessel {
  id: string;
  name: string;
  mmsi: number;
  type: 'CARGO' | 'TANKER' | 'PASSENGER' | 'FISHING' | 'TUG';
  flag: string;
  lat: number;
  lng: number;
  speedKnots: number;
  heading: number;
  destination: string;
  eta: string;
  deadweightTons: number;
  lengthM: number;
  chokePoint?: string; // e.g., 'Estrecho de Malaca', 'Canal de Panamá'
  magnoWayCurrent: string;
}

export interface NavalAsset {
  id: string;
  name: string;
  hullNumber: string;
  fleet: string;
  type: 'CARRIER' | 'DESTROYER' | 'SUBMARINE' | 'FRIGATE' | 'PATROL';
  flag: string;
  lat: number;
  lng: number;
  speedKnots: number;
  heading: number;
  strikeGroup?: string;
  readinessStatus: 'DEPLOYED' | 'TRANSIT' | 'STANDBY' | 'EXERCISE';
  perimeterRadiusKm: number;
}

export interface AircraftFlight {
  id: string;
  callsign: string;
  icao24: string;
  operator: string;
  type: 'COMMERCIAL' | 'CARGO' | 'MILITARY' | 'DRONE';
  lat: number;
  lng: number;
  altitudeFt: number;
  speedKnots: number;
  heading: number;
  origin: string;
  destination: string;
  squawk: string;
  flightLevel: string;
}

export type OpticalFilter = 'normal' | 'night_vision' | 'thermal' | 'quantvm';

export interface CCTVNode {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  status: 'LIVE' | 'STANDBY';
  cameraType: 'TRAFFIC' | 'HARBOR' | 'SKYLINE' | 'PERIMETER';
  streamUrl?: string;
  previewPoster: string;
  fps: number;
  resolution: string;
  opticalFilter: OpticalFilter;
  viewAngleDeg: number;
  lastUpdated: string;
}

export interface EarthquakeEvent {
  id: string;
  place: string;
  magnitude: number;
  depthKm: number;
  lat: number;
  lng: number;
  time: string;
  tsunamiAlert: boolean;
  significance: number;
  plateBoundary: string;
  teluricResonance: string;
}

export interface GlobalIncident {
  id: string;
  title: string;
  category: 'CONFLICT' | 'CYBER_ANOMALY' | 'GPS_SPOOFING' | 'NAVAL_ALERT' | 'VOLCANIC' | 'PROTEST';
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  lat: number;
  lng: number;
  timestamp: string;
  summary: string;
  verified: boolean;
  affectedRegion: string;
  threatScore: number; // 0-100
}

export interface LiveNewsItem {
  id: string;
  headline: string;
  source: 'REUTERS' | 'AP' | 'OSINT_FEED' | 'AL_JAZEERA' | 'QUANTVM_DISPATCH';
  category: string;
  lat: number;
  lng: number;
  timestamp: string;
  urgency: 'FLASH' | 'BREAKING' | 'REGULAR';
  summary: string;
  region: string;
}

export interface SubmarineCable {
  id: string;
  name: string;
  lengthKm: number;
  capacityTbps: number;
  owners: string[];
  points: [number, number][]; // [lat, lng] coordinates line
  landingStations: {
    name: string;
    city: string;
    country: string;
    lat: number;
    lng: number;
  }[];
  rfsYear: number;
  operationalStatus: 'ACTIVE' | 'MAINTENANCE' | 'PLANNED';
}

export interface SeaTelemetry {
  id: string;
  buoyId: string;
  region: string;
  lat: number;
  lng: number;
  surfaceTempC: number;
  waveHeightM: number;
  salinityPsu: number;
  currentSpeedKnots: number;
  currentDirDeg: number;
  tidePhase: 'HIGH' | 'EBB' | 'LOW' | 'FLOW';
}

export interface WindControlsState {
  enabled: boolean;
  speedMultiplier: number; // 0.5x to 3.0x
  particleDensity: number; // 500 to 3000
  pressureLevel: 'surface' | '850hpa' | '500hpa' | '250hpa';
  colorMode: 'velocity' | 'cyan' | 'temp';
}

export interface RainControlsState {
  enabled: boolean;
  opacity: number; // 0.0 to 1.0
  sweepSpeed: number; // 0.5 to 2.0
  minIntensity: 'all' | 'moderate' | 'severe';
  palette: 'radar' | 'cyber' | 'thermal';
}

export type ViewProjectionMode = '3d_globe' | '2d_planar';

export type MapStyleMode = 'cyber_quantvm' | 'night_lights' | 'tactical_topo' | 'infrared';

export interface MagnoWaysState {
  projection: ViewProjectionMode;
  mapStyle: MapStyleMode;
  layers: Record<MagnoWaysLayerId, boolean>;
  windControls: WindControlsState;
  rainControls: RainControlsState;
  timeMultiplier: number;
  isPaused: boolean;
  selectedEntity: {
    type: 'satellite' | 'vessel' | 'naval' | 'flight' | 'cctv' | 'earthquake' | 'incident' | 'cable' | 'sea_buoy';
    data: any;
  } | null;
  activeCctvPreview: CCTVNode | null;
  searchFilter: string;
  categoryFilter: LayerCategory | 'ALL';
}

/**
 * ==============================================================================
 * MAGNOWAYS INTERACTIVE JOURNEYS, ROUTES & ADVENTURES SYSTEM (MagnopVS)
 * ==============================================================================
 */

export type MagnoWaysModality =
  | 'story'        // Recorridos narrativos
  | 'quest'        // Cadenas de misiones
  | 'exploration'  // Rutas de exploración y secretos
  | 'game'         // Recorridos de minijuegos y desafíos
  | 'learning'     // Rutas de aprendizaje y sabiduría
  | 'social'       // Recorridos colaborativos / cooperativos
  | 'saga'         // Rutas canónicas de las 13 sagas
  | 'real'         // Experiencias físicas / inteligencia geoespacial táctica
  | 'creator'      // Rutas de la comunidad y creadores
  | 'crossway';    // Conexiones transmedia entre módulos de la Quantvm Matrix

export type MagnoWayNodeType =
  | 'START'
  | 'DESTINATION'
  | 'MISSION'
  | 'STORY'
  | 'GAME'
  | 'BATTLE'
  | 'LEARNING'
  | 'EVENT'
  | 'COLLECTION'
  | 'PORTAL'
  | 'CHECKPOINT'
  | 'CHOICE'
  | 'BOSS'
  | 'FINAL'
  | 'REWARD';

export type MagnoWayNodeStatus =
  | 'locked'
  | 'available'
  | 'in_progress'
  | 'completed'
  | 'skipped';

export type RoutePresentationMode =
  | 'map'        // Mapa visual de nodos con caminos luminosos y zoom/pan
  | 'timeline'   // Secuencia cronológica paso a paso
  | 'journey'    // Visor inmersivo guiado de la etapa activa
  | 'network'    // Gráfica de red y conexiones omniversales
  | 'geographic'; // Mapa geoespacial (capas tácticas Osiris AI)

export type RouteDifficulty =
  | 'Iniciación'
  | 'Intermedio'
  | 'Avanzado'
  | 'Experto'
  | 'Cosmológico';

export type ParticipantsMode = 'SOLO' | 'COOP' | 'COMPETITIVE' | 'COMMUNITY';

export interface MagnoWayChoiceOption {
  id: string;
  label: string;
  outcomeText: string;
  nextNodeId?: string;
  rewardMp?: number;
  rewardXp?: number;
  statCheck?: {
    stat: 'quantvmEnergy' | 'cosmicTuning' | 'intellectSofia' | 'factionReputation';
    minScore: number;
  };
}

export interface MagnoWayQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MagnoWayNodeActionData {
  storyPassage?: string;
  audioFrequency?: string;
  quizQuestions?: MagnoWayQuizQuestion[];
  interactiveMiniGameType?: 'quantum_cipher' | 'resonator_puzzle' | 'matrix_hack' | 'energy_balancer';
  choiceBranches?: MagnoWayChoiceOption[];
  bossEncounter?: {
    name: string;
    title: string;
    hp: number;
    avatar: string;
    dialogue: string;
    specialMove: string;
  };
  collectibleLore?: {
    title: string;
    codexKey: string;
    content: string;
    relicName?: string;
  };
}

export interface MagnoWayNode {
  id: string;
  routeId: string;
  name: string;
  description: string;
  type: MagnoWayNodeType;
  iconName: string;
  imageUrl?: string;
  position: { x: number; y: number }; // Percentage 0-100 on visual canvas
  orderIndex: number;
  estimatedMinutes: number;
  difficulty: RouteDifficulty;
  requirements: {
    minLevel?: number;
    requiredInventoryItemId?: string;
    requiredInventoryItemName?: string;
    previousNodeIds?: string[];
    requiredFaction?: string;
  };
  rewards: {
    magnoPoints: number;
    microCoins: number;
    xp: number;
    badge?: string;
    itemId?: string;
    itemName?: string;
  };
  associatedDestination?: {
    type: 'quantvm_chapter' | 'quantvm_vignette' | 'minigame' | 'battle' | 'learning_quiz' | 'geospatial_coord' | 'external_link';
    targetId: string;
    title?: string;
  };
  actionData?: MagnoWayNodeActionData;
}

export interface MagnoWayConnection {
  id: string;
  routeId: string;
  fromNodeId: string;
  toNodeId: string;
  label?: string;
  isBranching?: boolean;
  conditionText?: string;
  isLockedByDefault?: boolean;
}

export interface MagnoWaysRoute {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  synopsis: string;
  modality: MagnoWaysModality;
  sagaId?: string;
  sagaTitle?: string;
  coverImage: string;
  bannerImage: string;
  difficulty: RouteDifficulty;
  estimatedDurationMin: number;
  recommendedLevel: number;
  participantsMode: ParticipantsMode;
  maxParticipants: number;
  author: {
    id: string;
    name: string;
    avatarUrl: string;
    isOfficial: boolean;
    badge?: string;
  };
  tags: string[];
  isOfficial: boolean;
  isSeasonal: boolean;
  seasonId?: string;
  rating: number;
  reviewsCount: number;
  completionRate: number;
  totalPlays: number;
  nodes: MagnoWayNode[];
  connections: MagnoWayConnection[];
  rewardsSummary: {
    mp: number;
    microCoins: number;
    xp: number;
    badge?: string;
    itemReward?: string;
  };
  status: 'published' | 'draft' | 'archived';
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerRouteProgress {
  routeId: string;
  startedAt: string;
  lastActiveAt: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  currentNodeId: string;
  completedNodeIds: string[];
  decisionsMade: Record<string, string>; // nodeId -> choiceId
  earnedRewards: {
    mp: number;
    microCoins: number;
    xp: number;
    badges: string[];
  };
  percentage: number;
}

export type MultiplayerRole = 'Navegante' | 'Estratega' | 'Custodio' | 'Descifrador';

export interface MultiplayerParticipant {
  userId: string;
  userName: string;
  avatarUrl: string;
  role: MultiplayerRole;
  isReady: boolean;
  score: number;
  currentNodeId?: string;
}

export interface MultiplayerLobby {
  id: string;
  routeId: string;
  routeTitle: string;
  mode: ParticipantsMode;
  hostId: string;
  hostName: string;
  maxPlayers: number;
  isPrivate: boolean;
  roomCode: string;
  status: 'waiting' | 'in_progress' | 'completed';
  participants: MultiplayerParticipant[];
  createdAt: string;
}

export interface RouteValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    nodeCount: number;
    connectionCount: number;
    startNodes: number;
    finalNodes: number;
    orphanNodes: number;
    unreachableNodes: number;
  };
}

export interface MagnoWaysFilterOptions {
  searchQuery: string;
  modality: MagnoWaysModality | 'ALL';
  sagaId: string | 'ALL';
  difficulty: RouteDifficulty | 'ALL';
  participantsMode: ParticipantsMode | 'ALL';
  isOfficialOnly: boolean;
  isSeasonalOnly: boolean;
  minLevel: number;
  sortBy: 'popular' | 'rating' | 'newest' | 'rewards' | 'duration';
}

export type MagnoWaysActiveTab =
  | 'hub'           // Portada y catálogo principal
  | 'viewer'        // Visualizador de ruta activa (Map, Timeline, Journey, Network, Geo)
  | 'my_routes'     // Progreso personal, rutas activas y guardadas
  | 'creator'       // Creator Studio para diseñar y probar rutas
  | 'multiplayer'   // Lobbies multijugador y expediciones
  | 'sofia_guide'   // Orientación cuántica contextual con SOF.IA
  | 'tactical_geo'; // Visor planetario y orbital táctico (Osiris AI 14 capas)

