export interface SocialPostComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
}

export interface SocialPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorTitle: string;
  authorLevel: number;
  authorFaction: string;
  timestamp: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'card' | '3d' | 'achievement' | 'quest';
  resonances: number;
  isResonated?: boolean;
  commentsCount: number;
  comments: SocialPostComment[];
  tags: string[];
  postType: 'status' | 'art' | 'achievement' | 'trade' | 'announcement';
}

export interface PlayerTimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  category: 'milestone' | 'quest' | 'level' | 'event' | 'social' | 'saga';
  iconName: string;
  rarity: 'normal' | 'rare' | 'epic' | 'legendary';
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'Exploración' | 'Alquimia' | 'Social' | 'Lore' | 'MCDS' | 'Combate';
  rarity: 'Común' | 'Raro' | 'Épico' | 'Legendario' | 'Cósmico';
  isUnlocked: boolean;
  unlockDate?: string;
  progress: number;
  maxProgress: number;
  globalPercentage: number;
  xpReward: number;
  mpReward: number;
}

export interface FriendProfile {
  id: string;
  name: string;
  alias: string;
  avatarUrl: string;
  title: string;
  level: number;
  faction: string;
  status: string;
  isOnline: boolean;
  role: 'friend' | 'guildmate' | 'mentor' | 'apprentice';
  mutualFriends: number;
  reputation: number;
}

export interface VitrinaShowcase {
  featuredCard: {
    title: string;
    subtitle: string;
    imageUrl: string;
    rarity: string;
    stats: { atk: number; def: number; sync: number };
  };
  featuredPet: {
    name: string;
    species: string;
    imageUrl: string;
    level: number;
  };
  featuredTrophy: {
    title: string;
    description: string;
    icon: string;
  };
  customQuote: string;
  favoriteTrack: string;
}

export interface DashboardWidgetConfig {
  id: string;
  title: string;
  icon: string;
  isEnabled: boolean;
  category: 'core' | 'social' | 'media' | 'utility';
}

// Initial Data
export const INITIAL_WIDGETS: DashboardWidgetConfig[] = [
  { id: 'sofia_ai', title: 'SOF.IA Asistente Cuántica', icon: 'Bot', isEnabled: true, category: 'utility' },
  { id: 'world_almanac', title: 'Almanaque & Clima Cósmico', icon: 'Compass', isEnabled: true, category: 'core' },
  { id: 'active_quests', title: 'Misiones en Curso', icon: 'Target', isEnabled: true, category: 'core' },
  { id: 'inventory_preview', title: 'Reliquias e Inventario', icon: 'Package', isEnabled: true, category: 'core' },
  { id: 'social_feed', title: 'Feed Social de la Red Quantvm', icon: 'MessageSquare', isEnabled: true, category: 'social' },
  { id: 'friends_online', title: 'Camaradas y Gremio Online', icon: 'Users', isEnabled: true, category: 'social' },
  { id: 'music_synth', title: 'MagnopVS Radio & Synth FX', icon: 'Disc', isEnabled: true, category: 'media' },
  { id: 'recent_timeline', title: 'Hitos Recientes', icon: 'Clock', isEnabled: true, category: 'utility' },
  { id: 'marketplace_quick', title: 'Marketplace MagnoStore Live', icon: 'ShoppingBag', isEnabled: true, category: 'utility' },
  { id: 'rpg_stats', title: 'Atributos RPG del Avatar', icon: 'Activity', isEnabled: true, category: 'core' }
];

export const INITIAL_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'post-1',
    authorName: 'Aetheris (Tú)',
    authorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    authorTitle: 'Viajero Cuántico',
    authorLevel: 12,
    authorFaction: 'Arquitectos Quantvm',
    timestamp: 'Hace 15 minutos',
    content: '¡Acabo de forjar una nueva Piedra Filosofal Quantvm en el laboratorio alquímico MLH! El sistema MCDS sigue expandiéndose con MetaAssets increíblemente detallados. 🚀✨ #MagnopVS #Quantvm #MCDS',
    mediaUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1000&q=80',
    mediaType: 'image',
    resonances: 24,
    isResonated: true,
    commentsCount: 3,
    comments: [
      { id: 'c1', authorName: 'Kaelen_Star', authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', text: '¡Increíble resplandor cromático! ¿Qué fórmula usaste?', timestamp: 'Hace 10 min' },
      { id: 'c2', authorName: 'Sofia_AI', authorAvatar: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=200&q=80', text: 'Resonancia armónica detectada al 98.4%. Excelente forja.', timestamp: 'Hace 8 min' },
      { id: 'c3', authorName: 'Lyra_Cosmos', authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', text: 'Te reto a un duelo de MagnoCards esta tarde en el sector Goloka.', timestamp: 'Hace 2 min' }
    ],
    tags: ['MagnopVS', 'Quantvm', 'MCDS'],
    postType: 'art'
  },
  {
    id: 'post-2',
    authorName: 'Eclipsa_V',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    authorTitle: 'Guardiana Estelar',
    authorLevel: 28,
    authorFaction: 'Tejedores Estelares',
    timestamp: 'Hace 1 hora',
    content: '¡El Dragón Plasmático Aether de nuestro gremio ha alcanzado la etapa de Evolución Suprema! Miren estas estadísticas de sincronización cósmica.',
    mediaUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1000&q=80',
    mediaType: 'card',
    resonances: 56,
    isResonated: false,
    commentsCount: 7,
    comments: [
      { id: 'c4', authorName: 'Aetheris (Tú)', authorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80', text: '¡Qué evolución tan impresionante!', timestamp: 'Hace 45 min' }
    ],
    tags: ['MagFam', 'DragónPlasmático', 'Gremio'],
    postType: 'achievement'
  },
  {
    id: 'post-3',
    authorName: 'Orion_Void',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    authorTitle: 'Mercader de Sombras',
    authorLevel: 19,
    authorFaction: 'Nómadas Cósmicos',
    timestamp: 'Hace 3 horas',
    content: 'Pongo en intercambio una MagnoCard "Orbe de Plasma Primigenio" por 500 MagnoPoints o un artefacto de la Casa de los Arquitectos. Mensajes directos abiertos.',
    resonances: 18,
    isResonated: false,
    commentsCount: 2,
    comments: [],
    tags: ['Intercambio', 'MagnoCard', 'Marketplace'],
    postType: 'trade'
  }
];

export const INITIAL_TIMELINE: PlayerTimelineEvent[] = [
  {
    id: 't-1',
    date: '30 de Julio, 2026',
    title: 'Inauguración del MCDS Design System',
    description: 'Acceso concedido al repositorio transmedia central de MetaAssets en MagnopVS.',
    category: 'saga',
    iconName: 'Layers',
    rarity: 'legendary'
  },
  {
    id: 't-2',
    date: '28 de Julio, 2026',
    title: 'Desbloqueo de Nivel 12',
    description: 'Llegaste al rango de Viajero Cuántico. Nuevas habilidades y cosméticos habilitados.',
    category: 'level',
    iconName: 'Zap',
    rarity: 'epic'
  },
  {
    id: 't-3',
    date: '25 de Julio, 2026',
    title: 'Eclosión del MagnoEgg Cósmico',
    description: 'Nacimiento de tu primera criatura MagFam: Dragón Plasmático Aether.',
    category: 'event',
    iconName: 'Sparkles',
    rarity: 'legendary'
  },
  {
    id: 't-4',
    date: '20 de Julio, 2026',
    title: 'Completada la Misión: "El Despertar del CBC"',
    description: 'Descifraste la clave cromática en el Hero Game Tutorial.',
    category: 'quest',
    iconName: 'CheckCircle',
    rarity: 'rare'
  },
  {
    id: 't-5',
    date: '15 de Julio, 2026',
    title: 'Nacimiento del Avatar en MagnopVS',
    description: 'Tu identidad digital fue registrada en la matriz de la red Quantvm.',
    category: 'milestone',
    iconName: 'User',
    rarity: 'normal'
  }
];

export const INITIAL_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'ach-1',
    title: 'Despertar Cuántico',
    description: 'Completa la iniciación del Hero Game y cruza el portal hacia el Antesala del Universo.',
    icon: 'Sparkles',
    category: 'Exploración',
    rarity: 'Común',
    isUnlocked: true,
    unlockDate: '2026-07-15',
    progress: 1,
    maxProgress: 1,
    globalPercentage: 94.2,
    xpReward: 100,
    mpReward: 200
  },
  {
    id: 'ach-2',
    title: 'Alquimista de Plasma',
    description: 'Transmuta 5 elementos en el Laboratorio Alquímico MLH.',
    icon: 'Flame',
    category: 'Alquimia',
    rarity: 'Raro',
    isUnlocked: true,
    unlockDate: '2026-07-28',
    progress: 5,
    maxProgress: 5,
    globalPercentage: 42.1,
    xpReward: 250,
    mpReward: 500
  },
  {
    id: 'ach-3',
    title: 'Arquitecto del Metaverso MCDS',
    description: 'Explora todos los MetaAssets de cómic y librerías transmedia en MagnopVS.',
    icon: 'Layers',
    category: 'MCDS',
    rarity: 'Épico',
    isUnlocked: false,
    progress: 4,
    maxProgress: 6,
    globalPercentage: 18.5,
    xpReward: 500,
    mpReward: 1000
  },
  {
    id: 'ach-4',
    title: 'Señor de los MagFam',
    description: 'Evoluciona a tu criatura hasta la etapa Cósmica de Nivel 20.',
    icon: 'Shield',
    category: 'Exploración',
    rarity: 'Legendario',
    isUnlocked: false,
    progress: 8,
    maxProgress: 20,
    globalPercentage: 5.3,
    xpReward: 1000,
    mpReward: 2500
  },
  {
    id: 'ach-5',
    title: 'Resonancia Social Plena',
    description: 'Alcanza 100 interacciones y resonancias en publicaciones de la red social.',
    icon: 'Heart',
    category: 'Social',
    rarity: 'Épico',
    isUnlocked: true,
    unlockDate: '2026-07-29',
    progress: 100,
    maxProgress: 100,
    globalPercentage: 22.8,
    xpReward: 400,
    mpReward: 800
  },
  {
    id: 'ach-6',
    title: 'Sabio del Almanaque Cósmico',
    description: 'Consulta los 30 ciclos astrológicos completos del año.',
    icon: 'Compass',
    category: 'Lore',
    rarity: 'Cósmico',
    isUnlocked: false,
    progress: 14,
    maxProgress: 30,
    globalPercentage: 1.2,
    xpReward: 2000,
    mpReward: 5000
  }
];

export const INITIAL_FRIENDS: FriendProfile[] = [
  {
    id: 'f-1',
    name: 'Eclipsa_V',
    alias: 'La Tejedora',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    title: 'Guardiana Estelar',
    level: 28,
    faction: 'Tejedores Estelares',
    status: 'Explorando Goloka (Misión de Gremio)',
    isOnline: true,
    role: 'guildmate',
    mutualFriends: 14,
    reputation: 980
  },
  {
    id: 'f-2',
    name: 'Orion_Void',
    alias: 'Sombra Cero',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    title: 'Mercader de Sombras',
    level: 19,
    faction: 'Nómadas Cósmicos',
    status: 'Meditando en el Almanaque Cósmico',
    isOnline: true,
    role: 'friend',
    mutualFriends: 8,
    reputation: 640
  },
  {
    id: 'f-3',
    name: 'Kaelen_Star',
    alias: 'Sintetizador',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    title: 'Alquimista Mayor',
    level: 35,
    faction: 'Arquitectos Quantvm',
    status: 'Diseñando en MCDS MetaAssets',
    isOnline: true,
    role: 'mentor',
    mutualFriends: 22,
    reputation: 1420
  },
  {
    id: 'f-4',
    name: 'Valkyria_88',
    alias: 'Cazadora de Plasmas',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    title: 'Recluta de la Casa',
    level: 6,
    faction: 'Arquitectos Quantvm',
    status: 'Offline (Última vez hace 2h)',
    isOnline: false,
    role: 'apprentice',
    mutualFriends: 3,
    reputation: 180
  }
];

export const DEFAULT_VITRINA: VitrinaShowcase = {
  featuredCard: {
    title: 'MagnoCard: Dragón Plasmático Aether',
    subtitle: 'Carta Holográfica de Edición Limitada #001',
    imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=600&q=80',
    rarity: 'Legendaria',
    stats: { atk: 950, def: 880, sync: 99 }
  },
  featuredPet: {
    name: 'Aetherion',
    species: 'Dragón Plasmático Aether',
    imageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=400&q=80',
    level: 12
  },
  featuredTrophy: {
    title: 'Huevo Cósmico Primigenio',
    description: 'Otorgado por descifrar la frecuencia cero en la Antesala de MagnopVS',
    icon: 'Award'
  },
  customQuote: '"La geometría de la realidad es solo el lienzo sobre el cual dibujamos nuestro destino transmedia."',
  favoriteTrack: 'Sintonía Quantvm #07 - Viaje a Goloka'
};
