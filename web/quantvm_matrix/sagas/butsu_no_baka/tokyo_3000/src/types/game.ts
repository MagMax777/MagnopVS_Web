export type SceneId =
  | 'TITLE'
  | 'SCENE_01' // S01C01SC01: Bosque, Era Edo (El Pacto de Seppuku)
  | 'SCENE_02' // S01C01SC02: Laboratorio de Clonación, Tokyo 3000
  | 'SCENE_03' // S01C01SC03: Calles de Tokyo 3000 (Exploración & Ecos)
  | 'SCENE_04' // S01C01SC04: Entrada al Matsuri Rave (Puertas de Neón)
  | 'SCENE_05' // S01C01SC05: Escena del Ritual (Espectáculo Geishas / Modo 3D)
  | 'SCENE_06' // S01C01SC06: Encuentro Yokoi y Yūrei (El Beso y la Daga)
  | 'SCENE_07' // S01C01SC07: Ritual de Resurrección & Combate Táctico
  | 'SCENE_08'; // S01C01SC08: Manipulación del Tiempo (El Bucle Temporal)

export type PanelType =
  | 'ESTABLISHING_SHOT'
  | 'NARRATIVE'
  | 'CLOSE_UP'
  | 'EMOTIONAL'
  | 'DIALOGUE'
  | 'ACTION'
  | 'PANORAMIC'
  | 'HIDDEN_OBJECT'
  | 'CLUE_REVEAL'
  | 'CHOICE'
  | 'FLASHBACK'
  | 'SUSPENSE'
  | 'CLIFFHANGER'
  | 'TRANSITION';

export type ProductionStatus =
  | 'PLACEHOLDER'
  | 'DRAFT'
  | 'IN DEVELOPMENT'
  | 'READY FOR REVIEW'
  | 'APPROVED'
  | 'PUBLISHED';

export interface HiddenObjectItem {
  object_id: string;
  name: string;
  hotspot: { x: number; y: number; width?: number; height?: number };
  visual_hint?: string;
  description: string;
  discovery_result: string;
  collection_category: string;
  required?: boolean;
  found?: boolean;
}

export interface BranchingChoiceOption {
  option_id: string;
  text: string;
  consequences?: string[];
  relationship_changes: { type: 'ATTACHMENT' | 'LIBERATION'; amount: number; reason?: string }[];
  next_panel_id?: string;
  availability_condition?: string | null;
}

export interface BranchingChoice {
  choice_id: string;
  prompt: string;
  options: BranchingChoiceOption[];
}

export interface PanelDialogue {
  speaker: string;
  text: string;
  expression?: string;
  avatar?: string;
}

export interface PanelData {
  panel_id: string;
  scene_id: string;
  order: number;
  panel_type: PanelType;
  title?: string;
  narrative_function: string;
  visual_description: string;
  composition?: string;
  camera?: string;
  lighting?: string;
  characters: string[];
  environment: string;
  dialogue?: PanelDialogue[];
  captions?: string;
  sound_design?: {
    onomatopoeia?: string;
    ambient?: string;
    sfxTrigger?: string;
  };
  transitions?: string;
  interactions?: string[];
  unlock_conditions?: string[];
  production_status: ProductionStatus;
  // Optional / Interactive
  hidden_objects?: HiddenObjectItem[];
  clues?: string[];
  collectibles?: string[];
  branching_choices?: BranchingChoice[];
  relationship_effects?: { type: 'ATTACHMENT' | 'LIBERATION'; amount: number; reason: string }[];
  character_expression?: string;
  animation?: string;
  illustration_type?:
    | 'forest_moon'
    | 'seppuku_cut'
    | 'clone_pod'
    | 'bio_terminal'
    | 'shinjuku_neon'
    | 'soma_alley'
    | 'torii_neon'
    | 'eye_zoom'
    | 'rave_stage'
    | 'kabuki_geisha'
    | 'yurei_altar'
    | 'kiss_dagger'
    | 'cult_ambush'
    | 'resurrection_circle'
    | 'combat_arena'
    | 'chrono_vortex'
    | 'ending_art';
}

export interface SceneData {
  scene_id: string;
  scene_title: string;
  sequence_id: string;
  sequence_title: string;
  location: string;
  time_context: string;
  characters_present: string[];
  narrative_objective: string;
  emotional_tone: string;
  estimated_reading_time: string;
  panel_count: number;
  discovery_count: number;
  scene_status: ProductionStatus;
  has_choices: boolean;
  has_hidden_objects: boolean;
  panels: PanelData[];
}

export interface GameSettings {
  soundEnabled: boolean;
  soundVolume: number;
  textSize: 'normal' | 'large';
  reducedMotion: boolean;
  highContrast: boolean;
  viewMode: 'PLAYER' | 'EDITOR';
  readingStyle: 'WEBTOON_VERTICAL' | 'PANEL_BY_PANEL';
}

export interface ClueItem {
  id: string;
  name: string;
  description: string;
  sceneOrigin: string;
  revealedMemory?: string;
  iconType: 'hairpin' | 'letter' | 'lantern' | 'charm' | 'paper' | 'scroll' | 'vial' | 'blade' | 'note';
}

export interface CollectibleCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  mangaQuote: string;
  unlocked: boolean;
}

export interface RelationshipEvent {
  id: string;
  timestamp: string;
  type: 'ATTACHMENT' | 'LIBERATION';
  amount: number;
  reason: string;
  triggerScene: string;
}

export interface StoryState {
  attachment: number; // 0 to 100
  liberation: number; // 0 to 100
  ritual_stability: number; // e.g. -1, 0, 1
  clues_found: string[]; // clue IDs
  story_flags: string[];
  currentScene: SceneId;
  currentPanelId?: string;
  checkpointScene: SceneId;
  completedEndings: string[];
  unlockedCards: string[];
  hiddenObjectsFoundCount: number;
  discoveredObjectIds: string[];
  chosenOptions: Record<string, string>;
  relationshipEvents?: RelationshipEvent[];
}

export interface DialogueNode {
  speaker: 'Yūrei' | 'Yokoi' | 'Narrador' | 'Sistema Tokio 3000' | 'Científico';
  text: string;
  expression?: 'gentle' | 'sad' | 'resolute' | 'haunting' | 'shocked';
  annotation?: string;
}

export type EnemyIntentType = 'QUICK_STRIKE' | 'HEAVY_STRIKE' | 'ENERGY_WAVE' | 'RITUAL_SURGE';

export interface CombatStats {
  playerHp: number;
  playerMaxHp: number;
  playerEnergy: number;
  playerMaxEnergy: number;
  enemyHp: number;
  enemyMaxHp: number;
  enemyIntent: EnemyIntentType;
  turn: number;
  combatLog: string[];
  isGuarding: boolean;
  isDodging: boolean;
}
