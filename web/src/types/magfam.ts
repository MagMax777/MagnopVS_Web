// MagnopVS - MagFam 2.0 Domain Types
// Comprehensive biotechnology companion system with combat stats, vital care,
// custom habitats, hygiene, fashion, breeding, and minigames.

export type MagFamStage = 'egg' | 'baby' | 'child' | 'teen' | 'adult' | 'ascended';

export type MagFamElement = 'Plasma' | 'Tech' | 'Void' | 'Aether' | 'Cosmic';

export type MagFamRarity = 'común' | 'raro' | 'épico' | 'legendario' | 'ancestral';

export type MagFamStatus = 'happy' | 'normal' | 'hungry' | 'sick' | 'sleeping' | 'dirty' | 'ghost' | 'on_expedition';

export type DofusFoodType = 'plasma_fruit' | 'aether_fish' | 'biotech_kibble' | 'quantum_seed' | 'soul_essence' | 'solar_nectar';

export interface DofusCombatStats {
  vitality: number;      // Adds HP to player
  power: number;         // Adds generic damage/power %
  wisdom: number;        // XP multiplier boost
  agility: number;       // Dodge/Critical rate boost
  intellect: number;     // Sofia intellect & magic boost
  prospecting: number;   // Item drop rate & relic boost
  maxStatCap: number;    // Cap reachable through regular diet
}

export interface MagFamDietHistory {
  lastFedTimestamp: string;
  mealsCount: number;
  isOverfed: boolean;
  statusEffect: 'healthy' | 'corpulent' | 'emaciated' | 'starving';
  favoriteFood: DofusFoodType;
}

export interface MagFamVitalNeeds {
  hunger: number;     // 0 (starving) - 100 (full)
  happiness: number;  // 0 (sad/depressed) - 100 (ecstatic)
  hygiene: number;    // 0 (filthy/flies) - 100 (sparkling clean)
  energy: number;     // 0 (exhausted) - 100 (fully rested)
  health: number;     // 0 (ghost/dead) - 100 (perfect health)
  discipline: number; // 0 (wild/disobedient) - 100 (tuned/disciplined)
}

export interface MagFamAccessory {
  id: string;
  name: string;
  slot: 'hat' | 'glasses' | 'collar' | 'wings' | 'aura' | 'held';
  imageUrl: string;
  rarity: MagFamRarity;
  statsBonus?: Partial<DofusCombatStats>;
  priceMp: number;
}

export interface MagFamFurnitureItem {
  id: string;
  name: string;
  category: 'bed' | 'wallpaper' | 'flooring' | 'table' | 'chair' | 'toy' | 'plant' | 'deco';
  imageUrl: string;
  previewColor: string;
  priceMp: number;
  rarity: MagFamRarity;
  comfortBonus: number;
}

export interface PlacedFurniture {
  instanceId: string;
  furnitureId: string;
  x: number; // 0 - 100%
  y: number; // 0 - 100%
  zIndex: number;
}

export interface MagFamRoomState {
  wallpaper: string;
  flooring: string;
  ambientLightColor: string;
  cleanliness: number; // 0 - 100
  placedItems: PlacedFurniture[];
}

export interface MagFamExpedition {
  id: string;
  creatureId: string;
  nodeName: string;
  destinationIcon: string;
  durationMinutes: number;
  startTime: string;
  endTime: string;
  rewardClaimed: boolean;
  possibleRewards: {
    mp: number;
    mc: number;
    xp: number;
    relicName?: string;
  };
}

export interface MagFamEnhancedCreature {
  id: string;
  name: string;
  nickname?: string;
  species: string;
  rarity: MagFamRarity;
  element: MagFamElement;
  stage: MagFamStage;
  level: number;
  experience: number;
  maxExperience: number;
  isEgg: boolean;
  hatchProgress: number; // 0 - 100
  hatchRequirement: string;
  bornTimestamp: string;
  status: MagFamStatus;
  
  // Vital Needs (0-100)
  needs: MagFamVitalNeeds;
  
  // Combat stats and mechanics
  hp: number; // 0 - 10 (when 0, becomes ghost)
  maxHp: number;
  combatStats: DofusCombatStats;
  diet: MagFamDietHistory;
  soulsDevoured?: {
    monsterType: string;
    count: number;
    requiredForBonus: number;
  }[];

  // Visuals & Customization
  imageUrl: string;
  spriteState?: 'idle' | 'eating' | 'bathing' | 'sleeping' | 'happy' | 'sick';
  description: string;
  equippedAccessories: {
    hat?: string;
    glasses?: string;
    collar?: string;
    wings?: string;
    aura?: string;
  };

  // Habitat
  room: MagFamRoomState;

  // Active expedition
  activeExpedition?: MagFamExpedition | null;
}

export interface FoodItemInfo {
  id: DofusFoodType;
  name: string;
  description: string;
  nutritionGain: number;
  happinessGain: number;
  statsBonusTarget?: keyof DofusCombatStats;
  priceMp: number;
  icon: string;
}

export type MagFamActiveSubTab =
  | 'habitat'
  | 'dofus_stats'
  | 'tamagotchi_care'
  | 'wardrobe'
  | 'room_decor'
  | 'minigames'
  | 'breeding_lab'
  | 'expeditions';

export interface TactileInteractionResult {
  success: boolean;
  microCoinsEarned: number;
  comboCount: number;
  isComboBurst: boolean;
  message: string;
  xpEarned: number;
  happinessEarned: number;
}

export interface TactileFloatingParticle {
  id: number;
  x: number;
  y: number;
  text: string;
  type: 'coin' | 'heart' | 'sparkle' | 'combo';
}

