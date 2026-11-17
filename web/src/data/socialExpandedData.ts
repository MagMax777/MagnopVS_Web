export interface StoryItem {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorLevel: number;
  mediaUrl: string;
  caption: string;
  timestamp: string;
  isSeen: boolean;
  audioTrack?: string;
  filterEffect?: string;
  viewsCount: number;
}

export interface ReelItem {
  id: string;
  title: string;
  authorName: string;
  authorAvatar: string;
  authorLevel: number;
  authorFaction: string;
  videoUrl?: string;
  coverUrl: string;
  soundTrack: string;
  likesCount: number;
  isLiked: boolean;
  commentsCount: number;
  sharesCount: number;
  tags: string[];
}

export interface LiveGift {
  id: string;
  name: string;
  icon: string;
  costMp: number;
  animationColor: string;
}

export interface LiveStreamComment {
  id: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  giftName?: string;
  giftIcon?: string;
  timestamp: string;
}

export interface LiveStreamRoom {
  id: string;
  hostName: string;
  hostAvatar: string;
  hostTitle: string;
  hostLevel: number;
  title: string;
  streamCoverUrl: string;
  category: 'Gaming' | 'Alquimia' | 'Arte MCDS' | 'Música' | 'Charla' | 'PK Battle';
  viewersCount: number;
  likesCount: number;
  isLive: boolean;
  isPkMode?: boolean;
  pkOpponent?: {
    name: string;
    avatar: string;
    score: number;
  };
  pkHostScore?: number;
  comments: LiveStreamComment[];
}

export interface PinItem {
  id: string;
  title: string;
  authorName: string;
  authorAvatar: string;
  imageUrl: string;
  category: string;
  savesCount: number;
  isSaved: boolean;
  tags: string[];
  aspectRatio: 'square' | 'tall' | 'wide';
}

export interface ChannelMessage {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  content: string;
  timestamp: string;
  attachments?: string[];
  reactions: { emoji: string; count: number; users: string[] }[];
}

export interface NexoChannel {
  id: string;
  name: string;
  topic: string;
  type: 'text' | 'voice';
  unreadCount?: number;
  activeVoiceUsers?: { name: string; avatar: string }[];
  messages: ChannelMessage[];
}

// Alias for backwards compatibility if needed
export type DiscordChannel = NexoChannel;

// AVAILABLE GIFTS FOR LIVE STREAMS QUANTVM
export const VIRTUAL_GIFTS: LiveGift[] = [
  { id: 'g-1', name: 'Rosa de Plasma', icon: '🌹', costMp: 10, animationColor: '#ff007f' },
  { id: 'g-2', name: 'Gema Quantvm', icon: '💎', costMp: 50, animationColor: '#00f0ff' },
  { id: 'g-3', name: 'Loto Cósmico', icon: '🪷', costMp: 150, animationColor: '#7fffd4' },
  { id: 'g-4', name: 'Corona Aether', icon: '👑', costMp: 300, animationColor: '#ffd700' },
  { id: 'g-5', name: 'Dragón de Fuego', icon: '🐉', costMp: 500, animationColor: '#ff4500' }
];

// INITIAL MOCK STORIES (MagnopVS Transmedia Stories)
export const INITIAL_STORIES: StoryItem[] = [
  {
    id: 's-1',
    authorName: 'Aetheris (Tú)',
    authorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    authorLevel: 12,
    mediaUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
    caption: 'Explorando el sector Goloka con el nuevo fondo de perfil MagnopVS 🌌✨',
    timestamp: 'Hace 10m',
    isSeen: false,
    audioTrack: 'Sintonía Quantvm #01',
    filterEffect: 'Neon Cyber',
    viewsCount: 142
  },
  {
    id: 's-2',
    authorName: 'SOF.IA Asistente',
    authorAvatar: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=400&q=80',
    authorLevel: 99,
    mediaUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    caption: '¡Almanaque Cósmico sincronizado al 100%! Clima favorable hoy.',
    timestamp: 'Hace 35m',
    isSeen: false,
    audioTrack: 'Matriz Cósmica Ambient',
    filterEffect: 'Holographic',
    viewsCount: 890
  },
  {
    id: 's-3',
    authorName: 'Eclipsa_V',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    authorLevel: 28,
    mediaUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80',
    caption: 'Evolución completada del Dragón Plasmático Aether 🐉🔥',
    timestamp: 'Hace 1h',
    isSeen: false,
    audioTrack: 'Epic Synth Pulse',
    filterEffect: 'Gold Glow',
    viewsCount: 520
  },
  {
    id: 's-4',
    authorName: 'Kaelen_Star',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    authorLevel: 35,
    mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    caption: 'Forjando nuevo asset 3D en la librería MCDS de MagnopVS 🎨',
    timestamp: 'Hace 3h',
    isSeen: true,
    viewsCount: 1100
  }
];

// INITIAL MICRO-CRÓNICAS (Video Feed)
export const INITIAL_REELS: ReelItem[] = [
  {
    id: 'r-1',
    title: 'Demostración de Transmutación en Alquimia MLH ⚡',
    authorName: 'Kaelen_Star',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    authorLevel: 35,
    authorFaction: 'Arquitectos Quantvm',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    soundTrack: 'Kaelen_Star • Sintonía Quantvm #08 (Pista Original)',
    likesCount: 1840,
    isLiked: true,
    commentsCount: 142,
    sharesCount: 89,
    tags: ['Alquimia', 'MagnopVS', 'Plasma', 'Tutorial']
  },
  {
    id: 'r-2',
    title: 'Recorrido en 3D por el Atlas Cósmico y Portal Shader ✨',
    authorName: 'SOF.IA Asistente',
    authorAvatar: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=400&q=80',
    authorLevel: 99,
    authorFaction: 'Nexo Central',
    coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    soundTrack: 'Frecuencia Cósmica 432Hz',
    likesCount: 3290,
    isLiked: false,
    commentsCount: 280,
    sharesCount: 310,
    tags: ['Atlas', '3DPortal', 'Shader', 'Lore']
  },
  {
    id: 'r-3',
    title: 'Batalla de MagnoCards: Invocación del Orbe Primigenio 🎴',
    authorName: 'Eclipsa_V',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    authorLevel: 28,
    authorFaction: 'Tejedores Estelares',
    coverUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80',
    soundTrack: 'Eclipsa_V • Synthwave Combat Theme',
    likesCount: 950,
    isLiked: false,
    commentsCount: 64,
    sharesCount: 41,
    tags: ['MagnoCards', 'MCDS', 'PVP']
  }
];

// INITIAL LIVE STREAMS (Transmisiones en Directo)
export const INITIAL_LIVE_STREAMS: LiveStreamRoom[] = [
  {
    id: 'live-1',
    hostName: 'Eclipsa_V',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    hostTitle: 'Guardiana Estelar',
    hostLevel: 28,
    title: '🔴 [LIVE PK BATTLE] Duelo de Transmutación & Círculo de invocación',
    streamCoverUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1000&q=80',
    category: 'PK Battle',
    viewersCount: 2450,
    likesCount: 15400,
    isLive: true,
    isPkMode: true,
    pkOpponent: {
      name: 'Orion_Void',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      score: 18400
    },
    pkHostScore: 21900,
    comments: [
      { id: 'lc-1', senderName: 'Kaelen_Star', senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', text: '¡Eclipsa activó la Runa de Plasma!', timestamp: 'Hace 5s' },
      { id: 'lc-2', senderName: 'Aetheris (Tú)', senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80', text: '¡Enviando un Loto Cósmico! 🪷', giftName: 'Loto Cósmico', giftIcon: '🪷', timestamp: 'Hace 2s' },
      { id: 'lc-3', senderName: 'Valkyria_88', senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', text: '¡VAMOS ECLIPSA EN ESTE PK!', timestamp: 'Ahora mismo' }
    ]
  },
  {
    id: 'live-2',
    hostName: 'Kaelen_Star',
    hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    hostTitle: 'Alquimista Mayor',
    hostLevel: 35,
    title: '🔴 Taller en Vivo: Diseñando MetaAssets 3D para el sistema MCDS',
    streamCoverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
    category: 'Arte MCDS',
    viewersCount: 980,
    likesCount: 8200,
    isLive: true,
    isPkMode: false,
    comments: [
      { id: 'lc-4', senderName: 'SOF.IA', senderAvatar: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=200&q=80', text: 'Resolución de texturas optimizada al 100%.', timestamp: 'Hace 1m' }
    ]
  }
];

// INITIAL TABLEROS & PINS MCDS
export const INITIAL_PINS: PinItem[] = [
  {
    id: 'p-1',
    title: 'Santuario de Cristales Cuánticos Cósmicos',
    authorName: 'Eclipsa_V',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    category: 'Arquitectura MagnopVS',
    savesCount: 342,
    isSaved: false,
    tags: ['Cósmico', 'Santuario', 'Cristales', 'Quantvm'],
    aspectRatio: 'tall'
  },
  {
    id: 'p-2',
    title: 'Concept Art: El Despertar del Dragón Aether',
    authorName: 'Kaelen_Star',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80',
    category: 'Ilustración MCDS',
    savesCount: 512,
    isSaved: true,
    tags: ['Dragón', 'MagFam', 'ConceptArt'],
    aspectRatio: 'square'
  },
  {
    id: 'p-3',
    title: 'Interfaz Holográfica MCDS MetaAsset Template',
    authorName: 'SOF.IA Asistente',
    authorAvatar: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=400&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
    category: 'UI/UX Design',
    savesCount: 890,
    isSaved: true,
    tags: ['MCDS', 'CyberUI', 'Hologram'],
    aspectRatio: 'wide'
  },
  {
    id: 'p-4',
    title: 'Paisaje Estelar del Portal a la Antesala',
    authorName: 'Orion_Void',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    category: 'Fotografía Cósmica',
    savesCount: 230,
    isSaved: false,
    tags: ['Nebulosa', 'Antesala', 'Universo'],
    aspectRatio: 'tall'
  }
];

// INITIAL NEXO & FREQUENCY CHANNELS
export const INITIAL_NEXO_CHANNELS: NexoChannel[] = [
  {
    id: 'ch-general',
    name: 'general-MagnopVS',
    topic: 'Canal oficial de frecuencia y voz transmedia del Universo MagnopVS',
    type: 'text',
    unreadCount: 3,
    messages: [
      {
        id: 'm-1',
        authorName: 'SOF.IA [AI Admin]',
        authorAvatar: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=200&q=80',
        authorRole: 'Inteligencia Central',
        content: '📢 Bienvenido a la Red de Canales y Frecuencias Quantvm en MagnopVS. Todos los sistemas y conectores de retransmisión están activos.',
        timestamp: 'Hoy a las 10:00 AM',
        reactions: [
          { emoji: '🚀', count: 12, users: ['Kaelen', 'Eclipsa'] },
          { emoji: '💎', count: 8, users: ['Orion'] }
        ]
      },
      {
        id: 'm-2',
        authorName: 'Eclipsa_V',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        authorRole: 'Líder Tejedores',
        content: '¿Quién se une a la transmisión en vivo de PK Battle esta tarde? ¡Estaremos regalando trofeos y MagnoPoints!',
        timestamp: 'Hoy a las 11:30 AM',
        reactions: [
          { emoji: '🔥', count: 15, users: ['Aetheris', 'Valkyria'] }
        ]
      }
    ]
  },
  {
    id: 'ch-mcds',
    name: 'mcds-diseño-y-artes',
    topic: 'Showcase de MetaAssets, plantillas e ilustraciones vectoriales',
    type: 'text',
    messages: [
      {
        id: 'm-3',
        authorName: 'Kaelen_Star',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        authorRole: 'Arquitecto Master',
        content: 'Subí nuevas plantillas a la sección MCDS. ¡Pueden exportarlas directamente en SVG o JSON!',
        timestamp: 'Ayer a las 8:20 PM',
        attachments: ['https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80'],
        reactions: [
          { emoji: '🎨', count: 20, users: ['Aetheris', 'SOF.IA'] }
        ]
      }
    ]
  },
  {
    id: 'ch-voice-1',
    name: '🔊 Sala-de-Estrategia-Nexo',
    topic: 'Canal de voz en vivo para misiones de gremio',
    type: 'voice',
    activeVoiceUsers: [
      { name: 'Eclipsa_V', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
      { name: 'Kaelen_Star', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' }
    ],
    messages: []
  }
];

export const INITIAL_DISCORD_CHANNELS = INITIAL_NEXO_CHANNELS;

// RADIO QUANTVM DIRECTO / LIVE AUDIO BROADCAST
export interface RadioAudioStation {
  id: string;
  stationName: string;
  hostName: string;
  hostAvatar: string;
  genre: string;
  isLive: boolean;
  listenersCount: number;
  currentTrack: string;
  audioFrequency: string;
  coverArt: string;
  broadcastSchedule: string;
  liveChat: { id: string; sender: string; text: string; time: string }[];
}

export const INITIAL_RADIO_STATIONS: RadioAudioStation[] = [
  {
    id: 'rad-1',
    stationName: 'Radio Quantvm FM #108',
    hostName: 'DJ Aetheris',
    hostAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    genre: 'Synthwave & 432Hz Solfeggio',
    isLive: true,
    listenersCount: 1240,
    currentTrack: 'MagnopVS Anthem - Armonía Matriz Cósmica',
    audioFrequency: '108.9 FM Quantvm',
    coverArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    broadcastSchedule: 'Diario 20:00 - 02:00 UTC',
    liveChat: [
      { id: 'c1', sender: 'Valkyria', text: '¡Esta frecuencia de 432Hz relaja increíble!', time: '20:12' },
      { id: 'c2', sender: 'Kaelen', text: 'Manda un saludo para el Gremio de Arquitectos', time: '20:14' }
    ]
  },
  {
    id: 'rad-2',
    stationName: 'Podcast MCDS & Creadores',
    hostName: 'SOF.IA Admin & Orion',
    hostAvatar: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=200&q=80',
    genre: 'Entrevistas & Tech Transmedia',
    isLive: true,
    listenersCount: 890,
    currentTrack: 'Ep. 24: Cómo crear MetaAssets vectoriales exportables',
    audioFrequency: 'Podcast Directo',
    coverArt: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80',
    broadcastSchedule: 'Lunes y Miércoles 18:00 UTC',
    liveChat: [
      { id: 'c3', sender: 'Eclipsa', text: 'Excelente episodio sobre SVG responsivos', time: '18:30' }
    ]
  }
];

// PROGRAMACIÓN LINEAL 24/7 CONTINUA (CLOUD BROADCASTING)
export interface TvShowScheduleItem {
  id: string;
  timeSlot: string;
  title: string;
  durationMinutes: number;
  thumbnailUrl: string;
  category: string;
  description: string;
  isCurrent?: boolean;
}

export interface LinearTvChannel {
  id: string;
  channelName: string;
  channelNumber: string;
  badge: string;
  category: '24/7 Transmedia' | 'Lore & Anime' | 'MCDS Design' | 'Música & Ambient' | 'Deportes Quantvm';
  videoPreviewUrl: string;
  currentProgram: TvShowScheduleItem;
  schedule: TvShowScheduleItem[];
  viewersCount: number;
  isBroadcasting: boolean;
}

export const INITIAL_LINEAR_TV_CHANNELS: LinearTvChannel[] = [
  {
    id: 'tv-1',
    channelName: 'MagnopVS TV 24/7',
    channelNumber: '001',
    badge: 'OFICIAL LINEAL',
    category: '24/7 Transmedia',
    videoPreviewUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    viewersCount: 3420,
    isBroadcasting: true,
    currentProgram: {
      id: 'show-1',
      timeSlot: '14:00 - 15:30',
      title: 'El Cronovisor Cósmico: Documental Transmedia',
      durationMinutes: 90,
      thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
      category: 'Documental',
      description: 'Un recorrido inmersivo por las dimensiones y los secretos de la Antesala en MagnopVS.',
      isCurrent: true
    },
    schedule: [
      {
        id: 'show-1',
        timeSlot: '14:00 - 15:30',
        title: 'El Cronovisor Cósmico: Documental Transmedia',
        durationMinutes: 90,
        thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
        category: 'Documental',
        description: 'Un recorrido inmersivo por las dimensiones y los secretos de la Antesala en MagnopVS.',
        isCurrent: true
      },
      {
        id: 'show-2',
        timeSlot: '15:30 - 17:00',
        title: 'Torneo E-Sports Quantvm: Semifinales en Directo',
        durationMinutes: 90,
        thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
        category: 'E-Sports',
        description: 'Batallas de cartas y combos mágicos entre los mejores gremios del servidor.'
      },
      {
        id: 'show-3',
        timeSlot: '17:00 - 19:00',
        title: 'Cine de Animación: Leyendas del Multiverso',
        durationMinutes: 120,
        thumbnailUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
        category: 'Anime & Arte',
        description: 'Película animada original de la franquicia transmedia MagnopVS.'
      }
    ]
  },
  {
    id: 'tv-2',
    channelName: 'MCDS Design TV',
    channelNumber: '002',
    badge: 'CREATIVE HUB',
    category: 'MCDS Design',
    videoPreviewUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    viewersCount: 1280,
    isBroadcasting: true,
    currentProgram: {
      id: 'show-201',
      timeSlot: '14:30 - 16:00',
      title: 'Maratón de Diseño UI/UX Vectorial MCDS',
      durationMinutes: 90,
      thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      category: 'Tutorial Continuo',
      description: 'Programación en bucle con técnicas avanzadas de animación e ilustración en tiempo real.',
      isCurrent: true
    },
    schedule: [
      {
        id: 'show-201',
        timeSlot: '14:30 - 16:00',
        title: 'Maratón de Diseño UI/UX Vectorial MCDS',
        durationMinutes: 90,
        thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
        category: 'Tutorial Continuo',
        description: 'Programación en bucle con técnicas avanzadas de animación e ilustración en tiempo real.',
        isCurrent: true
      },
      {
        id: 'show-202',
        timeSlot: '16:00 - 18:00',
        title: 'Showcase de MetaAssets Creados por la Comunidad',
        durationMinutes: 120,
        thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        category: 'Exposición',
        description: 'Presentación lineal de las mejores creaciones MCDS del mes con enlaces de descarga.'
      }
    ]
  }
];

// CASTLE / STRUCKD / ROBLOX INSPIRED INTERACTIVE WORLDS
export interface InteractiveWorldItem {
  id: string;
  title: string;
  creatorName: string;
  creatorAvatar: string;
  thumbnailUrl: string;
  worldType: 'mini-game' | 'social-space' | 'art-gallery' | 'simulation';
  plays: number;
  likes: number;
  rating: number;
  ratingCount: number;
  tags: string[];
  description: string;
}

export const INITIAL_INTERACTIVE_WORLDS: InteractiveWorldItem[] = [
  {
    id: 'world-1',
    title: 'Laberinto Quantvm 3D',
    creatorName: 'Orion_Builder',
    creatorAvatar: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    worldType: 'mini-game',
    plays: 15420,
    likes: 3200,
    rating: 4.8,
    ratingCount: 1450,
    tags: ['puzzle', 'action', 'neon'],
    description: 'Un laberinto inmersivo diseñado con bloques lógicos MCDS. Escapa antes de que el tiempo cuántico se agote.'
  },
  {
    id: 'world-2',
    title: 'Lounge Transmedia Eclipsa',
    creatorName: 'Eclipsa_Art',
    creatorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    worldType: 'social-space',
    plays: 8900,
    likes: 4100,
    rating: 4.9,
    ratingCount: 3100,
    tags: ['hangout', 'chill', 'music'],
    description: 'Espacio de reunión relajante. Chatea, escucha radio 432Hz y comparte emotes con otros avatares.'
  },
  {
    id: 'world-3',
    title: 'Simulador de Alquimia Fractal',
    creatorName: 'Kaelen_Magus',
    creatorAvatar: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    worldType: 'simulation',
    plays: 24500,
    likes: 8500,
    rating: 4.7,
    ratingCount: 5200,
    tags: ['sandbox', 'magic', 'crafting'],
    description: 'Crea nuevas pociones y materiales combinando elementos básicos. Simulador de físicas y reacciones en tiempo real.'
  },
  {
    id: 'world-4',
    title: 'Galería MCDS Void',
    creatorName: 'Valkyria',
    creatorAvatar: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    worldType: 'art-gallery',
    plays: 5600,
    likes: 1200,
    rating: 5.0,
    ratingCount: 890,
    tags: ['art', 'exhibition', '3d'],
    description: 'Recorre la galería de arte vectorial interactivo creada por Valkyria. Toca las obras para ver sus propiedades.'
  }
];

// =========================================================
// 1. RADAR DE SINTONÍA & PROXIMIDAD CUÁNTICA
// =========================================================
export interface DatingProfile {
  id: string;
  name: string;
  age: number;
  level: number;
  distanceKm: number; // Distancia cuántica en km o metros
  faction: string;
  title: string;
  avatar: string;
  galleryImages: string[];
  bio: string;
  intentions: 'Aventuras en Mazmorras' | 'Dúo PvP' | 'Citas de Silicio' | 'Compañero de Gremio' | 'Rolplay Cuántico';
  tags: string[];
  audioNote: string;
  audioDurationSec: number;
  isOnline: boolean;
  verified: boolean;
  lookingFor: string;
  tapsCount: {
    fire: number;
    claw: number;
    pulse: number;
    heart: number;
  };
}

export const INITIAL_DATING_PROFILES: DatingProfile[] = [
  {
    id: 'date-1',
    name: 'Kaelen Shibuya',
    age: 26,
    level: 48,
    distanceKm: 0.3,
    faction: 'Arquitectos Quantvm',
    title: 'Heredero del Canto de Silicio',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'
    ],
    bio: 'Navegando entre los neones de Neo-Tokio 3000. Busco copiloto para incursiones en mazmorras cuánticas de alto riesgo y charlas nocturnas con té matcha a 528Hz.',
    intentions: 'Aventuras en Mazmorras',
    tags: ['#Cyberpunk', '#KatanaPlasma', '#Arquitecto', '#Shibuya'],
    audioNote: 'Hola... si estás escuchando esto, nuestras frecuencias de red ya se cruzaron. ¿Aceptas el duelo o el café?',
    audioDurationSec: 6,
    isOnline: true,
    verified: true,
    lookingFor: 'Dúo para raidear jefes de mundo y compartir MagnoPoints en MagnopVS.',
    tapsCount: { fire: 142, claw: 89, pulse: 210, heart: 320 }
  },
  {
    id: 'date-2',
    name: 'Valkyria Éter',
    age: 24,
    level: 52,
    distanceKm: 1.2,
    faction: 'Nómadas Cósmicos',
    title: 'Piloto Rompe-Vacío',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80'
    ],
    bio: 'No creo en destinos predeterminados; creo en la curvatura del hiperespacio. Piloto de naves caza ligeras y coleccionista de reliquias raras de la era sumeria.',
    intentions: 'Dúo PvP',
    tags: ['#Nómadas', '#Piloto', '#PvP', '#VoidAesthetic'],
    audioNote: 'Acelera a velocidad luz o quédate atrás en la estela cósmica.',
    audioDurationSec: 4,
    isOnline: true,
    verified: true,
    lookingFor: 'Compañero con reflejos rápidos y cero miedo al Vacío.',
    tapsCount: { fire: 310, claw: 240, pulse: 180, heart: 490 }
  },
  {
    id: 'date-3',
    name: 'Thorsten Macho',
    age: 31,
    level: 60,
    distanceKm: 2.8,
    faction: 'Tejedores Estelares',
    title: 'Herrero de Titanes',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
    ],
    bio: 'Forjo armaduras de obsidiana en los hornos de Core-0. Rutina diaria: 2 horas de levantamiento de hierro estelar y 4 horas de transmutación de elementos.',
    intentions: 'Citas de Silicio',
    tags: ['#FitnessCuántico', '#Titan', '#MachoBB', '#Fuerza'],
    audioNote: 'Si buscas protección inquebrantable, mi escudo siempre está listo.',
    audioDurationSec: 5,
    isOnline: false,
    verified: true,
    lookingFor: 'Gente disciplinada que aprecie la lealtad y el esfuerzo físico/mental.',
    tapsCount: { fire: 520, claw: 410, pulse: 95, heart: 280 }
  },
  {
    id: 'date-4',
    name: 'Nyx-09 Oráculo',
    age: 22,
    level: 45,
    distanceKm: 0.8,
    faction: 'Arquitectos Quantvm',
    title: 'Voz de la Red Subterránea',
    avatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'
    ],
    bio: 'Androide de tercera generación con chip de poesía sintética activado. Sueño con ovejas eléctricas de silicio y me gusta decodificar frecuencias perdidas.',
    intentions: 'Rolplay Cuántico',
    tags: ['#Androide', '#Poesía', '#Cyberpunk', '#GlitchArt'],
    audioNote: 'El pulso de Tokio 3000 late en 528Hz. ¿Sientes mi resonancia?',
    audioDurationSec: 5,
    isOnline: true,
    verified: false,
    lookingFor: 'Conversaciones profundas que desafíen las reglas lógicas.',
    tapsCount: { fire: 215, claw: 65, pulse: 340, heart: 410 }
  },
  {
    id: 'date-5',
    name: 'Morgana Sumeria',
    age: 28,
    level: 55,
    distanceKm: 4.5,
    faction: 'Tejedores Estelares',
    title: 'Sacerdotisa del Apsu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
    ],
    bio: 'Traductora de tablas cuneiformes prohibidas. Conocedora de los secretos del dios Enki y las fórmulas de transmutación dorada.',
    intentions: 'Compañero de Gremio',
    tags: ['#Arqueología', '#Sumer', '#Magia', '#Alquimia'],
    audioNote: 'Los secretos de las estrellas no se entregan al primer peregrino.',
    audioDurationSec: 6,
    isOnline: false,
    verified: true,
    lookingFor: 'Aliados sabios para descifrar zigurats en MagnopVS.',
    tapsCount: { fire: 180, claw: 110, pulse: 290, heart: 350 }
  }
];

// =========================================================
// 2. DEVOCIÓN ESTELAR & PACTOS DE DISCIPLINA
// =========================================================
export interface PactItem {
  id: string;
  title: string;
  masterName: string;
  masterAvatar: string;
  devotionType: 'Sumisión Cuántica' | 'Disciplina de Gremio' | 'Tributo de MagnoPoints' | 'Voto de Silencio' | 'Entrenamiento Físico';
  description: string;
  requirements: string[];
  durationDays: number;
  rewardXp: number;
  rewardMp: number;
  status: 'active' | 'completed' | 'available';
  progressPercent: number;
  streakDays: number;
}

export const INITIAL_PACTS: PactItem[] = [
  {
    id: 'pact-1',
    title: 'Pacto de la Presencia Cuántica Diaria',
    masterName: 'Consejo de los Arquitectos',
    masterAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    devotionType: 'Disciplina de Gremio',
    description: 'Compromiso solemne de mantener encendido el nodo de sincronización todos los días a la misma hora sin interrupciones.',
    requirements: [
      'Hacer Check-In diario en la Matrix',
      'Meditar 5 minutos en el Santuario a 432Hz',
      'Enviar 3 saludos cuánticos a iniciados'
    ],
    durationDays: 7,
    rewardXp: 500,
    rewardMp: 250,
    status: 'active',
    progressPercent: 71,
    streakDays: 5
  },
  {
    id: 'pact-2',
    title: 'Voto de Silencio y Absorción MCDS',
    masterName: 'Valkyria Éter',
    masterAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    devotionType: 'Sumisión Cuántica',
    description: 'Aceptar las instrucciones de diseño del maestro sin cuestionar, completando 2 horas continuas de creación vectorial pura.',
    requirements: [
      'No escribir en canales públicos durante 2 horas',
      'Publicar un MetaAsset en el tablero MCDS',
      'Aceptar la calificación del maestro con reverencia'
    ],
    durationDays: 3,
    rewardXp: 420,
    rewardMp: 180,
    status: 'available',
    progressPercent: 0,
    streakDays: 0
  },
  {
    id: 'pact-3',
    title: 'Tributo de Devoción al Fondo Comunal',
    masterName: 'Gran Maestre Alcyone',
    masterAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    devotionType: 'Tributo de MagnoPoints',
    description: 'Ofrendar 50 MP al pozo sagrado de Shambala para financiar las misiones de rescate de avatares novatos en MagnopVS.',
    requirements: [
      'Aportar 50 MP al tesoro comunal',
      'Bendecir a un camarada en el chat con una gema'
    ],
    durationDays: 1,
    rewardXp: 300,
    rewardMp: 100,
    status: 'completed',
    progressPercent: 100,
    streakDays: 1
  }
];

// =========================================================
// 3. PERFILES HOLO-RETRO & TOP 8 CAMARADAS
// =========================================================
export interface MySpaceProfileData {
  ownerName: string;
  ownerAvatar: string;
  statusHeadline: string;
  skinTheme: 'cyberpunk' | 'vaporwave' | 'matrix' | 'gold';
  top8: Array<{
    id: string;
    name: string;
    avatar: string;
    role: string;
    quote: string;
  }>;
  profileSong: {
    title: string;
    artist: string;
    duration: string;
    frequency: string;
    genre: string;
  };
  hi5Counters: {
    five: number;
    sparkle: number;
    fire: number;
    respect: number;
  };
  guestbookEntries: Array<{
    id: string;
    authorName: string;
    authorAvatar: string;
    message: string;
    stickerUrl?: string;
    timestamp: string;
  }>;
}

export const INITIAL_MYSPACE_DATA: MySpaceProfileData = {
  ownerName: 'Aetheris // Cyber-Pionero',
  ownerAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
  statusHeadline: '"En un mundo de unos y ceros, yo elijo ser el glitch que crea universos en MagnopVS."',
  skinTheme: 'cyberpunk',
  top8: [
    { id: 't1', name: 'Kaelen Shibuya', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', role: 'Hermano de Armas', quote: 'El acero y el código jamás se oxidan.' },
    { id: 't2', name: 'Nyx-09', avatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=200&q=80', role: 'Guía Espiritual', quote: 'Frecuencia 528Hz siempre encendida.' },
    { id: 't3', name: 'Valkyria', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80', role: 'Compañera de Vuelo', quote: 'Nunca mires el velocímetro en el Vacío.' },
    { id: 't4', name: 'Thorsten', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80', role: 'Forjador Titán', quote: 'Fuerza bruta y corazón noble.' },
    { id: 't5', name: 'Sof.IA', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80', role: 'IA Guía', quote: 'Calculando infinitas victorias para ti.' },
    { id: 't6', name: 'Alcyone', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', role: 'Sabio de Shambala', quote: 'Paz en la mente, luz en el corazón.' },
    { id: 't7', name: 'Morgana', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', role: 'Arqueóloga Sumeria', quote: 'El barro guarda la memoria de los dioses.' },
    { id: 't8', name: 'Orion Builder', avatar: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=200&q=80', role: 'Arquitecto 3D', quote: 'Construyendo el futuro voxel a voxel.' }
  ],
  profileSong: {
    title: 'Neon Odyssey 3000 (Synthesized 432Hz)',
    artist: 'MagnopVS Cyber-Band',
    duration: '3:45',
    frequency: '432 Hz',
    genre: 'Chiptune / Cyber-Synth'
  },
  hi5Counters: {
    five: 489,
    sparkle: 312,
    fire: 670,
    respect: 520
  },
  guestbookEntries: [
    {
      id: 'gb-1',
      authorName: 'Kaelen Shibuya',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      message: '¡Gracias por agregarme al Top 8! Nos vemos esta noche en las ruinas de Roppongi para raidear al jefe.',
      timestamp: 'Ayer a las 21:30'
    },
    {
      id: 'gb-2',
      authorName: 'Nyx-09',
      authorAvatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=200&q=80',
      message: '✨ ¡Dejando un pulso brillante por tu perfil! Tu canción de fondo me reinicia los circuitos con amor.',
      timestamp: 'Hace 3 horas'
    }
  ]
};

// =========================================================
// 4. BITÁCORA VISUAL & MANIFIESTOS (ESTÉTICA, EXIF FOTOGRAFÍA & RE-SINTONÍAS)
// =========================================================
export interface TumblrFlickrPost {
  id: string;
  type: 'photo' | 'quote' | 'aesthetic' | 'text';
  authorName: string;
  authorAvatar: string;
  authorHandle: string;
  content: string;
  quoteSource?: string;
  imageUrl?: string;
  exifData?: {
    camera: string;
    lens: string;
    iso: string;
    shutter: string;
    resolution: string;
  };
  tags: string[];
  notesCount: number;
  isLiked: boolean;
  isReblogged: boolean;
  timestamp: string;
}

export const INITIAL_TUMBLR_FLICKR_POSTS: TumblrFlickrPost[] = [
  {
    id: 'tf-1',
    type: 'photo',
    authorName: 'Astral_Lens',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    authorHandle: '@astral_lens',
    content: 'Captura de alta exposición del cruce cuántico de Shibuya 3000 durante la lluvia ácida de helio líquido.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    exifData: {
      camera: 'Nikon Quantvm Z9 Pro',
      lens: 'NIKKOR Taquiónico 50mm f/1.2',
      iso: 'ISO 6400 Estelar',
      shutter: '1/8000s Cuántica',
      resolution: '8192 x 5464 // 8K HDR'
    },
    tags: ['#shibuya3000', '#cyberpunk_aesthetic', '#flickr_pro', '#MagnopVS', '#neon_noir'],
    notesCount: 3840,
    isLiked: false,
    isReblogged: false,
    timestamp: 'Hace 2 horas'
  },
  {
    id: 'tf-2',
    type: 'quote',
    authorName: 'Filósofo del Vacío',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    authorHandle: '@void_thinker',
    content: '“La verdadera libertad no es escapar de la Matrix, sino aprender a programar tus propios milagros dentro de ella.”',
    quoteSource: '— Fragmento de los Registros Prohibidos de Eleusis en MagnopVS',
    tags: ['#eleusis_path', '#citas_cuánticas', '#tumblr_vibes', '#matrix_wisdom'],
    notesCount: 5120,
    isLiked: true,
    isReblogged: false,
    timestamp: 'Hace 5 horas'
  },
  {
    id: 'tf-3',
    type: 'photo',
    authorName: 'Kaelen_Visuals',
    authorAvatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=200&q=80',
    authorHandle: '@kaelen_yokoi',
    content: 'Retrato de la espada de plasma descansando sobre el tatami del Templo de Silicio.',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
    exifData: {
      camera: 'Sony Alpha Quantvm VII',
      lens: 'Master G 85mm f/1.4',
      iso: 'ISO 800',
      shutter: '1/2000s',
      resolution: '9504 x 6336'
    },
    tags: ['#katana', '#silicio', '#flickr_archive', '#yokoi_clan'],
    notesCount: 2210,
    isLiked: false,
    isReblogged: false,
    timestamp: 'Ayer'
  }
];