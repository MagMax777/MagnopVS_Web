import React, { useState, useEffect } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { ChapterArchitectView } from './ChapterArchitectView';
import { EleusisPathSagaView } from './EleusisPathSagaView';
import { QuantvmTransmediaHub } from './QuantvmTransmediaHub';
import { CreateSagaStudioModal } from './CreateSagaStudioModal';
import { Quantvm3DGameView } from './Quantvm3DGameView';
import { Quantvm3DSceneExplorer } from './Quantvm3DSceneExplorer';
import { QuantvmAiMediaStudioModal } from './QuantvmAiMediaStudioModal';
import { QuantvmKineticVisualizer } from './QuantvmKineticVisualizer';
import eleusisSagaImg from '../../assets/images/regenerated_image_1793895567896.png';
import mlhSagaImg from '../../assets/images/regenerated_image_1793895585303.png';
import whiteBrotherhoodSagaImg from '../../assets/images/regenerated_image_1793895592903.jpg';
import lordsOfSumerSagaImg from '../../assets/images/regenerated_image_1793895595635.jpg';
import goldenAppleSagaImg from '../../assets/images/regenerated_image_1793895601444.jpg';
import tokyo3000Img from '../../assets/images/tokyo_3000_saga_1794263725069.jpg';
import { QUANTVM_SAGAS, getCreatorSagas, deleteCreatorSaga, SagaFullData } from '../../data/sagasData';
import {
  QuantvmMultiplayerPulseOverlay,
  useSagaMultiplayerActivity,
  getTierForIntensity,
} from './QuantvmMultiplayerPulseOverlay';
import { 
  Tv, 
  Gamepad2, 
  Sparkles, 
  Play, 
  Layers, 
  X, 
  Zap, 
  Check, 
  Globe, 
  Wand2, 
  Search, 
  Bell, 
  User, 
  Bot, 
  BookOpen, 
  ShoppingBag, 
  Calendar, 
  ChevronRight, 
  ChevronLeft,
  Lock, 
  AlertTriangle, 
  RotateCcw, 
  Key, 
  Egg, 
  Bookmark,
  MapPin,
  ExternalLink,
  Send,
  Terminal,
  Wifi,
  Shield,
  Carrot,
  Crosshair,
  Activity,
  Compass,
  Plus,
  RefreshCw,
  Database,
  Radio,
  Hourglass,
  CheckCircle,
  Cpu,
  Download,
  Settings,
  Film,
  FolderTree,
  Share2,
  Info,
  Eye,
  HelpCircle,
  Quote,
  Sliders,
  Type,
  Image,
  Video,
  Music,
  MousePointer,
  Rocket,
  Copy,
  Code,
  Target,
  Award,
  GripVertical,
  Trash2,
  Clapperboard
} from 'lucide-react';

interface MemoryShard {
  id: string;
  name: string;
  status: 'unlocked' | 'incubating' | 'forbidden';
  stability?: string;
  encryptionLevel?: number;
  syncPercent?: number;
  description?: string;
}

interface CodexDiscovery {
  id: string;
  type: 'ARTIFACT' | 'CHARACTER' | 'ANALYSIS';
  timeAgo: string;
  title: string;
  description: string;
  image?: string;
  era?: string;
  lorePurity?: string;
}

interface GameTerminalItem {
  id: string;
  title: string;
  genre: string;
  syncStability: string;
  playersOnline: string;
  image: string;
  description: string;
  borderType: 'magenta' | 'blue';
}

interface SagaItem {
  id: string;
  title: string;
  subtitle: string;
  era: 'chaos' | 'source' | 'void';
  status: 'active' | 'syncing' | 'locked' | 'completed' | 'unstable';
  image: string;
  description: string;
  magnoEggsReward: number;
  accessKeyLevel?: number;
  progressPercent?: number;
  recordsFound?: string;
  category: 'series' | 'game' | 'universe';
  tag?: string;
}

interface SagaModalData {
  id?: string;
  title: string;
  subtitle: string;
  type: string;
  banner: string;
  description: string;
  stats?: { label: string; value: string }[];
}

export const QuantvmMatrixView: React.FC = () => {
  const { player, addXpAndMp, playSoundEffect, setActiveTab, setCurrentSagaId } = usePlayer();
  
  // View mode: 'magzine' | 'matrix' | 'reels_wall' | 'soul_archive' | 'codex_vivo' | 'games' | 'transmedia' | 'resonance_hub' | 'uplink'
  const [viewMode, setViewMode] = useState<'magzine' | 'matrix' | 'reels_wall' | 'soul_archive' | 'codex_vivo' | 'games' | 'transmedia' | 'resonance_hub' | 'uplink'>('matrix');

  // Creator Sagas Studio state
  const [showCreateSagaModal, setShowCreateSagaModal] = useState(false);
  const [editingCreatorSaga, setEditingCreatorSaga] = useState<SagaFullData | null>(null);
  const [creatorSagas, setCreatorSagas] = useState<SagaFullData[]>(() => getCreatorSagas());
  const [creatorGenreFilter, setCreatorGenreFilter] = useState<string>('ALL');
  const [show3DGame, setShow3DGame] = useState(false);
  const [show3DScenes, setShow3DScenes] = useState(false);
  const [showAiMediaStudio, setShowAiMediaStudio] = useState(false);

  useEffect(() => {
    const syncSagas = () => setCreatorSagas(getCreatorSagas());
    window.addEventListener('magnopvs-sagas-updated', syncSagas);
    return () => window.removeEventListener('magnopvs-sagas-updated', syncSagas);
  }, []);

  // Real-Time Multiplayer Pulse Layer State
  const [isPulseLayerEnabled, setIsPulseLayerEnabled] = useState<boolean>(true);
  const [isLiveTelemetry, setIsLiveTelemetry] = useState<boolean>(true);
  const sagaActivityMap = useSagaMultiplayerActivity(isLiveTelemetry);
  
  // Uplink Center State
  const [uplinkFilter, setUplinkFilter] = useState<'ALL' | '3D_MODELS' | 'TEXTURES' | 'SHADERS' | 'LORE_DOCS'>('ALL');
  const [selectedUplinkAsset, setSelectedUplinkAsset] = useState<any | null>(null);
  const [uplinkAssets, setUplinkAssets] = useState([
    {
      id: 'goloka_tex',
      title: 'Goloka_Texture_Pack_v4',
      type: 'TEXTURES',
      typeBadge: 'TEXTURE',
      size: '1.2 GB',
      status: 'VERIFIED_OFFLINE',
      statusType: 'verified',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuA1Xm0bAoCckHvMsaKI7J9Ze9FvRvZK-vAQ4abIpDoHL4D5PcLxkYv2lccH2O0KRd1lFLmgx99F-4u2f_KRgEBjpc9Wo9oWCwTX2xpk9UqtUBlP4CDTdG59PKGCdVcJhMcxjKS3LWtZHJBYEqioyVAvBFqdiycUncG4JdSpZZiB7CjeS9RiLyUYsyQ0KzTa2Iy-uYYRjQWY5EgSHERjNoXDHMho4WSNHtdrLEpIIc69fMkOL-egznndBf0ZYVWP04YPCVZkA7Ii2s',
      description: 'High-fidelity procedural material textures crafted for the Goloka Realm in the MagnopVS multiverse.'
    },
    {
      id: 'caelum_model',
      title: 'Caelum_3D_Model_Asset',
      type: '3D_MODELS',
      typeBadge: '3D_MODEL',
      size: '450 MB',
      status: 'VERIFIED_OFFLINE',
      statusType: 'verified',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB47A5aZ3Hvh6WFgXuNB7s-oK6y3-7977K34cAJlkWM3ViLFb7gkZ86FfZV3leuy_nj43z7gvOqi3BGD9xDCNKrjzOnP5mhR9DY2yHyHvnY2WaNlzD6V8gUXeRBQThkPvtLK0amCU6VnGtQIdHquliCvkeIjQof5hdCfXALRMYjlHrc8vDnUbYvxYjQPJDto5qha-Y-uiZiPMxnMsqoyeY65CG8pv7r12ryFBqwHQi7xUSVoyFsazdvoW-2oUrQ1QAGLF-K_sRxHzRu',
      description: 'Precision CAD wireframe and orbital hull assembly component model for tactical Caelum starships.'
    },
    {
      id: 'void_shader',
      title: 'Void_Shader_Library_v2',
      type: 'SHADERS',
      typeBadge: 'SHADER',
      size: '2.8 GB',
      status: 'SYNCING_68%',
      statusType: 'syncing',
      image: '',
      description: 'Volumetric ray-marching shaders for deep space void breaches and black hole event horizons.'
    },
    {
      id: 'aether_lore',
      title: 'Aether_Origin_Exegesis',
      type: 'LORE_DOCS',
      typeBadge: 'LORE_DOC',
      size: '12.5 MB',
      status: 'VERIFIED_OFFLINE',
      statusType: 'verified',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAxvD6VvkqjorDaQaHJKELbzhRuhGyDCNZmweN_8189Xa3uk1lO5_XSNCtwt4sJEem_0wTWorHR7fz29wtI7CCyGrKcSWGIH1-JJsiKI2ETDrI5PEkSCPQ3G4azhEr2LQiZU9b7tLEo-auJ2k18_wetMlLSTKweH9Z0K62LT45zGzsQSL-vb3Lkhkw5ZQ7-1wJRx4X3fYMuQXeyZw17_9MCJVjRRiOzZ0441zTQIT0zvLg9llNuG__bHRvI2o4ZL4xM6Zdk__vr3ys',
      description: 'Encrypted manuscript containing primary chronicle records of the Aether Genesis epoch.'
    },
    {
      id: 'synth_carbon',
      title: 'Synth_Carbon_Mat_v1',
      type: 'TEXTURES',
      typeBadge: 'TEXTURE',
      size: '892 MB',
      status: 'VERIFIED_OFFLINE',
      statusType: 'verified',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9Tdp6Ze53i6wr4aaYttSER_Vw5Ea-8JlRptgHZVDZQYyt-icIMOahLJOwME_HhrfShYg_QlBmiABoXDqgJc4LHXiSbFf9Aakhw0GunmBsuOYUziKrC2qvpyKgL980btlYiTf75DgqsGXTiKLTzH-XCAmyyt3000gf9cMKlMOXrnvNqaXPD9RslJixiA0d4fxBA2IKnVv5OK0oQrkDODkhjxJPa6jENr1_KoZduKe2SsKHBCAxKD0fb6_N46OeFYluoJ1Myy8V54v0',
      description: 'Microscopic cybernetic carbon weave material shader with dynamic luminescence conduits.'
    }
  ]);
  
  // Resonance Hub State
  const [selectedBet, setSelectedBet] = useState<'YES' | 'NO' | null>(null);
  const [chatMessages, setChatMessages] = useState([
    { id: '1', sender: '@SYSTEM_VOICE', text: 'Anomalous frequency detected in Sector 4. Brace for temporal shift.', color: 'text-[#ff4dfa]' },
    { id: '2', sender: 'QUANTVM_DRAKE', text: 'Magnitude is reaching critical levels. Stake your claim now!', color: 'text-[#15ffd1]' },
    { id: '3', sender: 'ARCHON_01', text: 'Manifestation looking stable. Expecting a PKD surge in T-10.', color: 'text-[#8b919a]' }
  ]);
  const [newChatInput, setNewChatInput] = useState('');
  const [myStakesAmount, setMyStakesAmount] = useState(1245.00);
  
  // Games Terminal State
  const [selectedGameTerminal, setSelectedGameTerminal] = useState<GameTerminalItem | null>(null);
  const [terminalFilter, setTerminalFilter] = useState<string>('ALL');

  const gameTerminals: GameTerminalItem[] = [
    {
      id: 'tokyo_3000',
      title: 'Tokyo 3000',
      genre: 'CYBER-NOIR',
      syncStability: '98%',
      playersOnline: '12.4k',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKu1B4TUvhTsJc2U1drwQCqyGUlZq51P9rDIOEGUbwEqwlB6Q9mut_kax_h6uDuZjYOOKQxLoDThwjY346_ZtiFctvIOPIzYTJOtrq79g-Vk2lQM3gRvq91ajbB2-LFAWwQfeTpwwnc140SIRBdWd8-y-mxehre0fHW1oz62izgjDdccamgTVOYQxPIBRrW0vZZ66chSdV8g83V2iwmVYBc10gbeN86ZHK-vA92MF6N_gVd78rb-viYhADFInMCLsvW-U_BVOsp5Ho',
      description: 'A neo-noir cyberpunk city simulation in the MagnopVS multiverse.',
      borderType: 'magenta'
    },
    {
      id: 'solaris_drift',
      title: 'Solaris Drift',
      genre: 'SPACE OPERA',
      syncStability: '94%',
      playersOnline: '8.1k',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4LxbqoutzT_DPWmS9QHWi2_roIfPleAj3ib4dEbYOoR5LnJ27lxJAD2tA2-9FG80-HjP4xthjmw_k2JgXWFJprdCHOBKpjK0C6Y226N6W6APWk8qh4Du7QFU_RLSYbhCaUgyXVDz5yAyAj2BRhpuoseRgmPuKGS99vUcdoHV1sBzwsgb6V3tj32A_NZFcSIEVycmGrfWOGiPLQTumLQ-O_yc9PH5DrqKuRdonrbVke4z9Qo7V42Ms1c1pfu-lD05ZmLooqf7EvPzm',
      description: 'Cruise past glowing stars and navigate deep space anomalies in MagnopVS.',
      borderType: 'blue'
    },
    {
      id: 'void_walker',
      title: 'Void Walker',
      genre: 'SURVIVAL',
      syncStability: '99%',
      playersOnline: '5.6k',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhiww_XUDGueI2ItvP2Gc97eMp0-ed-dvEI3fXAfq6vLN1ERLo4c-RiQ_-qYYFNtksuTGYjk6ChO-eZjBDKHV8b644yJIH6AWIqFUnT_4DiVeT-cC8KJxxve9ejEvnT_50Bc5VVa_f6iFNQtSx5OUqR99GI8AcPyGVcL2cpvuop7TAGKgfK6fNs4u5zSNjXfs6ncbYSNGnGRuuMbSjxDb6mzT4L1-2dVR791diN_CRinTWxkDUMNJHLLIgt0jHa3e-bfk3S7ogKuXb',
      description: 'Cross desolate monochromatic lunar landscapes and obsidian monoliths in MagnopVS.',
      borderType: 'magenta'
    },
    {
      id: 'eleusis_path',
      title: 'Eleusis Path',
      genre: 'ARTHOUSE RPG',
      syncStability: '91%',
      playersOnline: '3.2k',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTd3JXvYti2yva48dRhaXK4ooklBwA8mmQhAlrIRz3eHEL3CVNvYrXA5TRPPnVo4cWOnOAo_u6tmpVY9hDC2A-wVC_n-tJoXoj7a8G_eX52sjdsBq-a03VB7rLHMwFsMTIultthRe8qKPlbVlkGxGCdo_yohY2X_nnkJonAzf7EZbC8W0oeKyDyGyerDcq1o7E4zrdLt4ndZfChBqCv8ynr4dVq8lWCNNmrI9UJ2Tq19y6a95P-qnS7NFfGy-nEpcCuUC5sBExVBe1',
      description: 'Ancient floating temple portals blending mythology and quantum physics in MagnopVS.',
      borderType: 'blue'
    }
  ];
  
  // Codex Vivo State
  const [codexQuery, setCodexQuery] = useState<string>('');
  const [isRuneDecrypting, setIsRuneDecrypting] = useState<boolean>(false);
  const [runePlaceholderText, setRunePlaceholderText] = useState<string>('QUERY MATRIX_...');
  const [selectedCodexNode, setSelectedCodexNode] = useState<{ id: string; title: string; subtitle: string; description: string; era: string } | null>(null);
  const [selectedDiscovery, setSelectedDiscovery] = useState<CodexDiscovery | null>(null);

  const discoveries: CodexDiscovery[] = [
    {
      id: 'disc_1',
      type: 'ARTIFACT',
      timeAgo: '2.4m AGO',
      title: 'Shattered Prism of Sol',
      description: 'A relic from the Source Era, capable of refracting pure consciousness into the void within the MagnopVS multiverse.',
      era: 'ERA OF SOURCE',
      lorePurity: '99.9%'
    },
    {
      id: 'disc_2',
      type: 'CHARACTER',
      timeAgo: '1.2h AGO',
      title: "Archon Xil'Vara",
      description: 'The first being to transcend the Chaos Barrier during the Second Dissolution in the lore of MagnopVS.',
      era: 'ERA OF CHAOS',
      lorePurity: '99.7%'
    },
    {
      id: 'disc_3',
      type: 'ANALYSIS',
      timeAgo: 'RECENT ANALYSIS',
      title: 'Terminal Entity: 01',
      description: 'A celestial being with glowing circuitry veins, wearing ornate ancient stone armor, set against a dark library background with floating data shards.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBU-hIbgCjChNhT1auSLlCFazCD52CD17Yp6R_5KOe5WQdjUwyT-KkyGtp4fkGznpqu0w37DGrzsNQOzIeAXohhzA29PXMkeOKfZ9oH52nMgxy8V07usAamvFVv0ByNflvyGQELdArw03PVTeoxOVZ-hxn6fs7KCVrYZcSewh9A1MTu9VwJ5o1e7UaIeIq3oraSDWxSZyGKXmpyLr1s-bQmw0SL_SYLIVC3RjVAzGduKWPOFpwbsGn06SpMuL9GU_EDtRZEBBnEgJUK',
      era: 'THE QUANTVM WEAVE',
      lorePurity: '100%'
    }
  ];
  
  // MagZine Explorer State
  const [selectedEra, setSelectedEra] = useState<'all' | 'chaos' | 'source' | 'void'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [mlhProgress, setMlhProgress] = useState<number>(88);
  const [mlhRecords, setMlhRecords] = useState<number>(142);
  const [selectedSagaModal, setSelectedSagaModal] = useState<SagaModalData | null>(null);

  // Soul Archive State
  const [shardFilter, setShardFilter] = useState<'all' | 'unlocked' | 'incubating' | 'forbidden'>('all');
  const [shards, setShards] = useState<MemoryShard[]>([
    { id: 'cyber_echo_01', name: 'CYBER_ECHO_01', status: 'unlocked', stability: '98.4%', description: 'Ecos cibernéticos recuperados del sector Tokyo 3000 en el multiverso MagnopVS.' },
    { id: 'neon_drift', name: 'NEON_DRIFT', status: 'unlocked', stability: '100%', description: 'Patrón de deriva de neón con sincronización cuántica perfecta.' },
    { id: 'void_reclamation', name: 'VOID_RECLAMATION', status: 'incubating', syncPercent: 65, description: 'Recuperación de datos del Vacío en progreso dentro de la Matrix MagnopVS.' },
    { id: 'omega_point', name: 'OMEGA_POINT', status: 'forbidden', encryptionLevel: 9, description: 'Fragmento cifrado de alto riesgo. Acceso restringido por la directiva MagnopVS.' },
    { id: 'chrono_logs_a', name: 'CHRONO_LOGS_A', status: 'unlocked', stability: '92.1%', description: 'Registros cronológicos primigenios del Multiverso MagnopVS.' },
    { id: 'aura_fragments', name: 'AURA_FRAGMENTS', status: 'unlocked', stability: '99.8%', description: 'Fragmentos de aura residual de la facción de los Arquitectos.' },
    { id: 'soul_bio_data', name: 'SOUL_BIO_DATA', status: 'unlocked', stability: '87.5%', description: 'Datos biométricos y genéticos registrados por la MCDS en MagnopVS.' }
  ]);
  const [selectedShard, setSelectedShard] = useState<MemoryShard | null>(null);
  const [showNewShardModal, setShowNewShardModal] = useState<boolean>(false);
  const [newShardName, setNewShardName] = useState<string>('');

  // Newsletter / Sync Form State
  const [syncEmail, setSyncEmail] = useState<string>('');
  const [isSyncEstablished, setIsSyncEstablished] = useState<boolean>(false);

  // AI Story Generator State in Matrix Mode
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [generatedStory, setGeneratedStory] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showUgcBuilder, setShowUgcBuilder] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'vr' | 'games' | 'ugc' | 'universes'>('all');

  // Bookmarks state
  const [bookmarkedSagas, setBookmarkedSagas] = useState<string[]>(['white_brotherhood']);

// Lore Reader & Studio State
  const [magzineSubTab, setMagzineSubTab] = useState<'feed' | 'reader' | 'explorer' | 'studio'>('feed');
  const [isLoreReaderOpen, setIsLoreReaderOpen] = useState<boolean>(false);
  const [loreSpoilerLevel, setLoreSpoilerLevel] = useState<number>(2);
  const [activeLoreContext, setActiveLoreContext] = useState<string | null>('artifact-prism');
  const [loreReadingProgress, setLoreReadingProgress] = useState<number>(65);
  const [explorerQuery, setExplorerQuery] = useState<string>('');
  const [explorerFilter, setExplorerFilter] = useState<'ALL' | 'CYBERPUNK' | 'ETHEREAL' | 'VOID-BORN' | 'GALACTIC'>('ALL');
  const [selectedEntityNode, setSelectedEntityNode] = useState<string>('Neo-Prime');
  const [selectedTemporalEra, setSelectedTemporalEra] = useState<string>('source');

  // MagnoScroll Studio State
  const [studioFilter, setStudioFilter] = useState<string>('ALL');
  const [studioCopiedFrame, setStudioCopiedFrame] = useState<string | null>(null);
  const [studioActivePreview, setStudioActivePreview] = useState<string | null>(null);
  const [studioMode, setStudioMode] = useState<'architect' | 'archive'>('architect');
  const [studioJsonTab, setStudioJsonTab] = useState<'chapter_data.json' | 'metadata.json'>('chapter_data.json');
  const [studioActiveTab, setStudioActiveTab] = useState<'drafts' | 'assets' | 'deploy'>('drafts');
  const [architectSearchQuery, setArchitectSearchQuery] = useState<string>('');
  const [isAddFrameOpen, setIsAddFrameOpen] = useState<boolean>(false);
  const [chapterFrames, setChapterFrames] = useState<Array<{
    id: string;
    type: string;
    title: string;
    src?: string;
    content?: string;
    options?: string[];
    parallax?: boolean;
    difficulty?: string;
  }>>([
    {
      id: 'img_001',
      type: 'FrameImage',
      title: 'Frame 01: Image_Main',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGu3xmKOKahCzg7N3BkUIgOAJz4roZwfravEeXNYYWkGid6RRLXEou2Itzrge4FWVDi_O_Z_CyFDZc3DywIXxiZ1_pD0WBpFOf8-O-GoUIUDgMQQwLPu0uci03PslpcF4NtnUnk0IsKKOPbWuEmEtyKB5cFyxkmko8FrdHZX4Kc9NsZR4T5SVZb5f310r3cl5tsCFGHMLFNdA5a6J2apmb_RYQpz3zXp8q5tnCuPj4qeBJNs2ZyCfJMkbn2fwzcDC4GwsRueVt8YWv',
      parallax: true
    },
    {
      id: 'txt_narrative_01',
      type: 'FrameText',
      title: 'Frame 02: Narrative_Intro',
      content: '"The path to Eleusis is paved with binary stars and spectral echoes in MagnopVS. Do you dare to decrypt the celestial machine?"'
    },
    {
      id: 'qz_logic_01',
      type: 'FrameQuiz',
      title: 'Frame 03: Logic_Gate_Quiz',
      options: ['Option A: Decrypt Path', 'Option B: Divert Flow'],
      difficulty: 'initiation'
    }
  ]);

  // List of Sagas
  const sagas: SagaItem[] = [
    {
      id: 'eleusis',
      title: 'ELEUSIS PATH',
      subtitle: 'Path of the Initiates',
      era: 'source',
      status: 'active',
      image: eleusisSagaImg,
      description: 'Enter the path. Ascend the mystery. Wisdom is the gate, choice is the path, and destiny is the reward. Experience the transformation of the initiates in high-fidelity simulation in MagnopVS.',
      magnoEggsReward: 8,
      accessKeyLevel: 4,
      category: 'universe'
    },
    {
      id: 'mlh',
      title: 'MLH ARC',
      subtitle: 'Meta-Laboratory Hierarchy',
      era: 'chaos',
      status: 'syncing',
      image: mlhSagaImg,
      description: 'The Meta-Laboratory Hierarchy simulation explores the boundaries of magno-genetic engineering and the core origins of the Matrix.',
      magnoEggsReward: 12,
      progressPercent: mlhProgress,
      recordsFound: `${mlhRecords}/200`,
      category: 'universe'
    },
    {
      id: 'white_brotherhood',
      title: 'WHITE BROTHERHOOD',
      subtitle: 'Architects of the Great Peace',
      era: 'void',
      status: 'completed',
      image: whiteBrotherhoodSagaImg,
      description: 'Study the architects of the first Great Peace. A tactical social simulation focused on diplomacy and logic in the MagnopVS multiverse.',
      magnoEggsReward: 10,
      category: 'universe',
      tag: 'MAGZINE: LORE'
    },
    {
      id: 'lords_of_sumer',
      title: 'LORDS OF SUMER',
      subtitle: 'Origins of the Great Schism',
      era: 'chaos',
      status: 'unstable',
      image: lordsOfSumerSagaImg,
      description: 'The origins of the Great Schism. Engage in large-scale strategic conflict simulations across the desert plains.',
      magnoEggsReward: 20,
      category: 'series',
      tag: 'MAGZINE: EPIC'
    },
    {
      id: 'caosfera',
      title: 'CAOSFERA PARADOX',
      subtitle: 'The Void Core Anomaly',
      era: 'void',
      status: 'active',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVDr3wClKM_0wwn5R8Ee49rSGB0fPP2RdmYSJMyRpiyw5DZaBULK4bFQEq3_W9VVsuPWFN2R3RC00ZCiXhgsPeVUw3bIZQvP2G2iyJPHTtwkAH4u6IMdOD4nacM3AmUS7I8uX2Zvbe2uI07MJLljbdwCZyCRFnDA6eRJdmBCvzaqGLQSmCXpzfVGrI2UDz70NZ8qWvYF1f-ZeReB8FRXQDVeiSkSHRURawi1ntQwDhng5ogdsxtiJo8Cr_rkfhprR7l03DMx2VQIxa',
      description: 'A dark and mysterious cosmic entity appearing as a swirling vortex of energy and matter. Explore the core of red and green energy surrounded by derelict space nodes.',
      magnoEggsReward: 18,
      category: 'universe',
      tag: 'MAGZINE: VOID'
    },
    {
      id: 'golden_apple',
      title: 'GOLDEN APPLE',
      subtitle: 'The Cosmic Mystery',
      era: 'source',
      status: 'locked',
      image: goldenAppleSagaImg,
      description: 'A high-fidelity odyssey into the Source Era legends. Recover the fruits of knowledge before the system purge.',
      magnoEggsReward: 15,
      accessKeyLevel: 2,
      category: 'game'
    },
    ...QUANTVM_SAGAS.filter(
      (s) => !['eleusis', 'mlh', 'white_brotherhood', 'lords_of_sumer', 'caosfera', 'golden_apple'].includes(s.id)
    ).map((s) => ({
      id: s.id,
      title: s.title,
      subtitle: s.subtitle,
      era: s.era,
      status: s.status,
      image: s.image,
      description: s.synopsis,
      magnoEggsReward: s.magnoEggsReward,
      category: s.category,
      tag: s.tag
    })),
    ...creatorSagas.map((s) => ({
      id: s.id,
      title: s.title,
      subtitle: s.subtitle,
      era: s.era,
      status: s.status,
      image: s.image,
      description: s.synopsis,
      magnoEggsReward: s.magnoEggsReward,
      category: s.category,
      tag: s.tag || 'CREADOR'
    }))
  ];

  // Filtered Sagas
  const filteredSagas = sagas.filter(saga => {
    const matchesEra = selectedEra === 'all' || saga.era === selectedEra;
    const matchesSearch = !searchQuery.trim() || 
      saga.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      saga.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEra && matchesSearch;
  });

  const handleSyncMLH = () => {
    playSoundEffect('quest');
    if (mlhProgress < 100) {
      setMlhProgress(100);
      setMlhRecords(200);
      addXpAndMp(350, 150);
      alert('¡Sincronización de MLH Arc completada al 100%! +350 XP / +150 MP otorgados en MagnopVS.');
    } else {
      alert('MLH Arc ya está totalmente sincronizado con la red de MagnopVS.');
    }
  };

  const handleStabilizeSumer = () => {
    playSoundEffect('level');
    addXpAndMp(250, 100);
    alert('¡Pulso de estabilización enviado a Lords of Sumer! Reducida la anomalía cuántica (+250 XP).');
  };

  const handleLuckyJump = () => {
    playSoundEffect('quest');
    const randomIndex = Math.floor(Math.random() * sagas.length);
    const chosen = sagas[randomIndex];
    addXpAndMp(150, 50);
    handleOpenSagaDetails(chosen);
  };

  const handleOpenSagaDetails = (saga: SagaItem) => {
    playSoundEffect('click');
    if (saga?.id) {
      setCurrentSagaId(saga.id);
    }
    setSelectedSagaModal({
      id: saga.id,
      title: saga.title,
      subtitle: saga.subtitle,
      type: saga.category,
      banner: saga.image,
      description: saga.description,
      stats: [
        { label: 'Era Histórica', value: saga.era.toUpperCase() + ' ERA' },
        { label: 'Recompensa', value: `${saga.magnoEggsReward} MagnoEggs` },
        { label: 'Estatus', value: saga.status.toUpperCase() }
      ]
    });
  };

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playSoundEffect('click');
    setBookmarkedSagas(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleEstablishSync = (e: React.FormEvent) => {
    e.preventDefault();
    if (!syncEmail.trim()) return;

    playSoundEffect('quest');
    setIsSyncEstablished(true);
    addXpAndMp(200, 100);
  };

  const handleGenerateStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    playSoundEffect('quest');
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedStory(
        `[NODO NARRATIVO RECONSTRUIDO EN MagnopVS]: ${aiPrompt}

En las profundidades del sector Tokyo 3000, los procesadores de la Quantvm Matrix detectaron un pulso de luz cuántica. Los Arquitectos de ${player.faction} canalizaron el flujo estelar para forjar un nuevo capítulo transmedia.`
      );
      addXpAndMp(200, 75);
    }, 1200);
  };

  const filteredShards = shards.filter(s => {
    if (shardFilter === 'all') return true;
    return s.status === shardFilter;
  });

  const handleShardClick = (shard: MemoryShard) => {
    playSoundEffect('click');
    setSelectedShard(shard);
  };

  const handleInitializeNewFragment = () => {
    playSoundEffect('quest');
    setShowNewShardModal(true);
  };

  const handleCreateShardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShardName.trim()) return;

    playSoundEffect('level');
    const newShard: MemoryShard = {
      id: `shard_${Date.now()}`,
      name: newShardName.trim().toUpperCase().replace(/\s+/g, '_'),
      status: 'unlocked',
      stability: '99.9%',
      description: `Fragmento cuántico personalizado forjado en el Soul Archive de MagnopVS.`
    };

    setShards(prev => [newShard, ...prev]);
    addXpAndMp(150, 150);
    setNewShardName('');
    setShowNewShardModal(false);
  };

  return (
    <div className="min-h-screen bg-[#0f1417] text-[#dfe3e7] font-sans selection:bg-[#6bd3ff]/30 relative overflow-x-hidden">
      
      {/* Dynamic Background Grid Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-15 z-0" 
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(107, 211, 255, 0.08) 0%, transparent 70%), url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='%23ffffff' stroke-width='0.5' opacity='0.15'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover, 60px 60px'
        }}
      />

      {/* ========================================================= */}
      {/* TOP NAVIGATION BAR (MAGZINE HEADER) */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 w-full h-20 bg-[#0f1417]/85 backdrop-blur-xl border-b border-[#3e484e]/30 flex justify-between items-center px-4 sm:px-8 md:px-12 shadow-[0_0_20px_rgba(107,211,255,0.15)]">
        <div className="flex items-center gap-6 sm:gap-8">
          <div className="flex items-center gap-3">
            <span className="font-audiowide text-2xl sm:text-3xl text-[#a2e0ff] tracking-wider uppercase drop-shadow-[0_0_10px_rgba(162,224,255,0.6)]">
              MagZine
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#6bd3ff]/20 text-[#6bd3ff] border border-[#6bd3ff]/40 font-bold tracking-widest">
              MagnopVS
            </span>
          </div>

          <nav className="hidden md:flex gap-6 items-center font-audiowide text-sm">
            <button 
              onClick={() => { setViewMode('magzine'); playSoundEffect('click'); }}
              className={`pb-1 transition-all uppercase cursor-pointer ${
                viewMode === 'magzine'
                  ? 'text-[#a2e0ff] border-b-2 border-[#a2e0ff]'
                  : 'text-[#bdc8cf] hover:text-[#24ffcd]'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => { setViewMode('matrix'); playSoundEffect('click'); }}
              className={`pb-1 transition-all uppercase cursor-pointer ${
                viewMode === 'matrix'
                  ? 'text-[#a2e0ff] border-b-2 border-[#a2e0ff]'
                  : 'text-[#bdc8cf] hover:text-[#24ffcd]'
              }`}
            >
              Sagas & VR
            </button>
            <button 
              onClick={() => { setViewMode('reels_wall'); playSoundEffect('click'); }}
              className={`pb-1 transition-all uppercase cursor-pointer flex items-center gap-1 ${
                viewMode === 'reels_wall'
                  ? 'text-[#ffabf3] border-b-2 border-[#ff4dfa]'
                  : 'text-[#bdc8cf] hover:text-[#ffabf3]'
              }`}
            >
              <Clapperboard className="w-3.5 h-3.5" />
              <span>Visualizador Cinético</span>
            </button>
            <button 
              onClick={() => { setViewMode('soul_archive'); playSoundEffect('click'); }}
              className={`pb-1 transition-all uppercase cursor-pointer ${
                viewMode === 'soul_archive'
                  ? 'text-[#15ffd1] border-b-2 border-[#15ffd1]'
                  : 'text-[#bdc8cf] hover:text-[#15ffd1]'
              }`}
            >
              Soul Archive
            </button>
            <button 
              onClick={() => { setViewMode('codex_vivo'); playSoundEffect('click'); }}
              className={`pb-1 transition-all uppercase cursor-pointer ${
                viewMode === 'codex_vivo'
                  ? 'text-[#cee5ff] border-b-2 border-[#cee5ff]'
                  : 'text-[#bdc8cf] hover:text-[#cee5ff]'
              }`}
            >
              Codex Vivo
            </button>
            <button 
              onClick={() => { setViewMode('games'); playSoundEffect('click'); }}
              className={`pb-1 transition-all uppercase cursor-pointer ${
                viewMode === 'games'
                  ? 'text-[#ff4dfa] border-b-2 border-[#ff4dfa]'
                  : 'text-[#bdc8cf] hover:text-[#ff4dfa]'
              }`}
            >
              Games Terminal
            </button>
            <button 
              onClick={() => { setViewMode('transmedia'); playSoundEffect('click'); }}
              className={`pb-1 transition-all uppercase cursor-pointer flex items-center gap-1 ${
                viewMode === 'transmedia'
                  ? 'text-[#24ffcd] border-b-2 border-[#24ffcd]'
                  : 'text-[#bdc8cf] hover:text-[#24ffcd]'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Transmedia Hub</span>
            </button>
            <button 
              onClick={() => { setViewMode('resonance_hub'); playSoundEffect('click'); }}
              className={`pb-1 transition-all uppercase cursor-pointer ${
                viewMode === 'resonance_hub'
                  ? 'text-[#15ffd1] border-b-2 border-[#15ffd1]'
                  : 'text-[#bdc8cf] hover:text-[#15ffd1]'
              }`}
            >
              Resonance Hub
            </button>
            <button 
              onClick={() => { setViewMode('uplink'); playSoundEffect('click'); }}
              className={`pb-1 transition-all uppercase cursor-pointer ${
                viewMode === 'uplink'
                  ? 'text-[#98cbff] border-b-2 border-[#98cbff]'
                  : 'text-[#bdc8cf] hover:text-[#98cbff]'
              }`}
            >
              Uplink Center
            </button>
            <button 
              onClick={() => { setActiveTab('mcds'); playSoundEffect('click'); }}
              className="text-[#bdc8cf] hover:text-[#24ffcd] transition-colors uppercase cursor-pointer"
            >
              Codex MCDS
            </button>
            <button 
              onClick={() => { setActiveTab('almanac'); playSoundEffect('click'); }}
              className="text-[#bdc8cf] hover:text-[#24ffcd] transition-colors uppercase cursor-pointer"
            >
              Market
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          {/* Search bar */}
          <div className="relative hidden lg:block w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#889299]" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Scan Quantvm Matrix..."
              className="w-full bg-[#1b2023] border border-[#3e484e]/50 rounded-full pl-10 pr-4 py-1.5 text-xs font-sans text-white placeholder-[#889299] focus:outline-none focus:border-[#a2e0ff] focus:ring-1 focus:ring-[#a2e0ff] transition-all"
            />
          </div>

          {/* Quick Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                playSoundEffect('click');
                setShowCreateSagaModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#ff4dfa]/25 to-[#15ffd1]/25 hover:from-[#ff4dfa]/40 hover:to-[#15ffd1]/40 border border-[#ff4dfa]/60 text-[#ffabf3] font-mono text-[11px] font-bold uppercase transition-all cursor-pointer shadow-[0_0_12px_rgba(255,77,250,0.2)]"
              title="Crear Nueva Saga (Estudio de Creadores)"
            >
              <Plus className="w-3.5 h-3.5 text-[#15ffd1]" />
              <span>Crear Saga</span>
            </button>
            <button 
              onClick={() => { addXpAndMp(50, 20); playSoundEffect('click'); }}
              title="Notificaciones de Red" 
              className="p-2 text-[#a2e0ff] hover:text-[#24ffcd] transition-transform active:scale-95 cursor-pointer"
            >
              <Bell className="w-5 h-5" />
            </button>
            <button 
              onClick={() => { setIsAssistantOpen(!isAssistantOpen); playSoundEffect('click'); }}
              title={isAssistantOpen ? "Ocultar Asistente CBC" : "Mostrar Asistente CBC"} 
              className={`p-2 transition-all active:scale-95 cursor-pointer rounded-lg ${
                isAssistantOpen 
                  ? 'text-[#24ffcd] bg-[#24ffcd]/10 border border-[#24ffcd]/30 shadow-[0_0_10px_rgba(36,255,205,0.3)]' 
                  : 'text-[#a2e0ff] hover:text-[#24ffcd]'
              }`}
            >
              <Bot className="w-5 h-5" />
            </button>
            <button 
              onClick={() => { setActiveTab('character'); playSoundEffect('click'); }}
              title="Perfil de Usuario" 
              className="p-2 text-[#a2e0ff] hover:text-[#24ffcd] transition-transform active:scale-95 cursor-pointer"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Floating Toggle handle when sidebar is collapsed */}
      {!isAssistantOpen && (
        <button
          onClick={() => {
            setIsAssistantOpen(true);
            playSoundEffect('click');
          }}
          title="Abrir Asistente / Menú Lateral CBC"
          className="fixed right-0 top-28 z-40 bg-[#171c1f]/90 hover:bg-[#20272b] text-[#a2e0ff] hover:text-[#24ffcd] border-l border-y border-[#3e484e]/60 rounded-l-xl p-2.5 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center gap-2 font-mono text-xs transition-all cursor-pointer group hover:pl-3.5 backdrop-blur-md"
        >
          <ChevronLeft className="w-4 h-4 text-[#24ffcd] group-hover:-translate-x-0.5 transition-transform" />
          <Bot className="w-4 h-4 text-[#a2e0ff]" />
          <span className="hidden sm:inline font-bold uppercase text-[10px] tracking-wider text-[#bdc8cf] group-hover:text-[#a2e0ff]">Menú</span>
        </button>
      )}

      {/* ========================================================= */}
      {/* CBC ASSISTANT SIDEBAR PANEL (SUMMONABLE) */}
      {/* ========================================================= */}
      {isAssistantOpen && (
        <aside className="fixed right-0 top-20 h-[calc(100vh-80px)] w-72 bg-[#171c1f]/95 backdrop-blur-md border-l border-[#3e484e]/30 shadow-2xl flex flex-col py-6 gap-4 z-40 font-orbitron transition-all animate-fade-in">
          
          <div className="px-6 mb-2">
            <div className="flex items-center justify-between p-3 bg-[#1b2023]/80 border border-[#889299]/20 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#5bc8f5]/20 flex items-center justify-center border border-[#6bd3ff]/40 shrink-0">
                  <Bot className="w-5 h-5 text-[#a2e0ff]" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold text-[#a2e0ff] uppercase tracking-wider">
                    CBC Assistant
                  </h3>
                  <p className="text-[10px] text-[#24ffcd] tracking-widest uppercase font-mono flex items-center gap-1 opacity-80">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#24ffcd] animate-pulse" />
                    Quantum Link Active
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAssistantOpen(false);
                  playSoundEffect('click');
                }}
                title="Ocultar menú lateral"
                className="p-1.5 text-[#889299] hover:text-[#fec5ff] hover:bg-[#262b2e] rounded-lg transition-colors cursor-pointer border border-transparent hover:border-[#fec5ff]/30"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-grow space-y-1 font-mono text-xs">
            <button 
              onClick={() => { setViewMode('magzine'); playSoundEffect('click'); }}
              className={`w-full flex items-center gap-4 px-6 py-3 transition-all cursor-pointer ${
                viewMode === 'magzine'
                  ? 'bg-[#f69aff]/20 text-[#fec5ff] border-r-4 border-[#fec5ff] font-bold'
                  : 'text-[#bdc8cf] hover:bg-[#262b2e]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#fec5ff]" />
              <span>MagZine Home</span>
            </button>

            <button 
              onClick={() => { setViewMode('matrix'); playSoundEffect('click'); }}
              className={`w-full flex items-center gap-4 px-6 py-3 transition-all cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-[#a2e0ff]/20 text-[#a2e0ff] border-r-4 border-[#a2e0ff] font-bold'
                  : 'text-[#bdc8cf] hover:bg-[#262b2e]'
              }`}
            >
              <Tv className="w-4 h-4 text-[#a2e0ff]" />
              <span>VR Matrix Sagas</span>
            </button>

            <button 
              onClick={() => { setViewMode('reels_wall'); playSoundEffect('click'); }}
              className={`w-full flex items-center gap-4 px-6 py-3 transition-all cursor-pointer ${
                viewMode === 'reels_wall'
                  ? 'bg-[#ff4dfa]/20 text-[#ffabf3] border-r-4 border-[#ff4dfa] font-bold'
                  : 'text-[#bdc8cf] hover:bg-[#262b2e]'
              }`}
            >
              <Clapperboard className="w-4 h-4 text-[#ff4dfa]" />
              <span>Visualizador Cinético · Reels</span>
            </button>

            <button 
              onClick={() => { setViewMode('soul_archive'); playSoundEffect('click'); }}
              className={`w-full flex items-center gap-4 px-6 py-3 transition-all cursor-pointer ${
                viewMode === 'soul_archive'
                  ? 'bg-[#15ffd1]/20 text-[#15ffd1] border-r-4 border-[#15ffd1] font-bold'
                  : 'text-[#bdc8cf] hover:bg-[#262b2e]'
              }`}
            >
              <FolderTree className="w-4 h-4 text-[#15ffd1]" />
              <span>Soul Archive</span>
            </button>

            <button 
              onClick={() => { setViewMode('codex_vivo'); playSoundEffect('click'); }}
              className={`w-full flex items-center gap-4 px-6 py-3 transition-all cursor-pointer ${
                viewMode === 'codex_vivo'
                  ? 'bg-[#cee5ff]/20 text-[#cee5ff] border-r-4 border-[#cee5ff] font-bold'
                  : 'text-[#bdc8cf] hover:bg-[#262b2e]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#cee5ff]" />
              <span>Codex Vivo</span>
            </button>

            <button 
              onClick={() => { setViewMode('games'); playSoundEffect('click'); }}
              className={`w-full flex items-center gap-4 px-6 py-3 transition-all cursor-pointer ${
                viewMode === 'games'
                  ? 'bg-[#ff4dfa]/20 text-[#ff4dfa] border-r-4 border-[#ff4dfa] font-bold'
                  : 'text-[#bdc8cf] hover:bg-[#262b2e]'
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-[#ff4dfa]" />
              <span>Games Terminal</span>
            </button>

            <button 
              onClick={() => { setViewMode('transmedia'); playSoundEffect('click'); }}
              className={`w-full flex items-center gap-4 px-6 py-3 transition-all cursor-pointer ${
                viewMode === 'transmedia'
                  ? 'bg-[#24ffcd]/20 text-[#24ffcd] border-r-4 border-[#24ffcd] font-bold'
                  : 'text-[#bdc8cf] hover:bg-[#262b2e]'
              }`}
            >
              <Film className="w-4 h-4 text-[#24ffcd]" />
              <span>Transmedia Hub</span>
            </button>

            <button 
              onClick={() => { setViewMode('resonance_hub'); playSoundEffect('click'); }}
              className={`w-full flex items-center gap-4 px-6 py-3 transition-all cursor-pointer ${
                viewMode === 'resonance_hub'
                  ? 'bg-[#15ffd1]/20 text-[#15ffd1] border-r-4 border-[#15ffd1] font-bold'
                  : 'text-[#bdc8cf] hover:bg-[#262b2e]'
              }`}
            >
              <Radio className="w-4 h-4 text-[#15ffd1]" />
              <span>Resonance Hub</span>
            </button>

            <button 
              onClick={() => { setViewMode('uplink'); playSoundEffect('click'); }}
              className={`w-full flex items-center gap-4 px-6 py-3 transition-all cursor-pointer ${
                viewMode === 'uplink'
                  ? 'bg-[#98cbff]/20 text-[#98cbff] border-r-4 border-[#98cbff] font-bold'
                  : 'text-[#bdc8cf] hover:bg-[#262b2e]'
              }`}
            >
              <Download className="w-4 h-4 text-[#98cbff]" />
              <span>Uplink Center</span>
            </button>

            <button 
              onClick={() => { setActiveTab('mcds'); playSoundEffect('click'); }}
              className="w-full flex items-center gap-4 px-6 py-3 text-[#bdc8cf] hover:bg-[#262b2e] hover:translate-x-1 transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Codex MCDS</span>
            </button>

            <button 
              onClick={() => { setActiveTab('almanac'); playSoundEffect('click'); }}
              className="w-full flex items-center gap-4 px-6 py-3 text-[#bdc8cf] hover:bg-[#262b2e] hover:translate-x-1 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Marketplace</span>
            </button>

            <button 
              onClick={() => { setCurrentSagaId('mlh'); setActiveTab('herogame'); playSoundEffect('click'); }}
              className="w-full flex items-center gap-4 px-6 py-3 text-[#bdc8cf] hover:bg-[#262b2e] hover:translate-x-1 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Events & Hero Game</span>
            </button>

            <div className="px-6 pt-3 space-y-2">
              <button
                onClick={() => {
                  playSoundEffect('click');
                  setShowCreateSagaModal(true);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-[#15ffd1]/15 hover:bg-[#15ffd1]/25 border border-[#15ffd1]/50 text-[#15ffd1] font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Crear Nueva Saga</span>
              </button>
              <button
                onClick={() => {
                  playSoundEffect('portal');
                  setShow3DGame(true);
                }}
                className="w-full py-2 px-3 rounded-xl bg-[#00f0ff]/15 hover:bg-[#00f0ff]/25 border border-[#00f0ff]/40 text-[#00f0ff] font-mono text-[11px] font-bold uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>Juego 3D Sentinel</span>
              </button>
              <button
                onClick={() => {
                  playSoundEffect('click');
                  setShow3DScenes(true);
                }}
                className="w-full py-2 px-3 rounded-xl bg-[#ff4dfa]/15 hover:bg-[#ff4dfa]/25 border border-[#ff4dfa]/40 text-[#ffabf3] font-mono text-[11px] font-bold uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Escenas 3D (Three.js)</span>
              </button>
              <button
                onClick={() => {
                  playSoundEffect('click');
                  setShowAiMediaStudio(true);
                }}
                className="w-full py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 font-mono text-[11px] font-bold uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Estudio Música/Img/Video</span>
              </button>
            </div>
          </div>

          <div className="px-6 mt-auto">
            <button 
              onClick={() => { playSoundEffect('quest'); setActiveTab('sofia'); }}
              className="w-full py-3.5 bg-gradient-to-r from-[#5bc8f5] to-[#24ffcd] text-[#003546] font-audiowide text-xs uppercase font-bold rounded-lg shadow-lg hover:shadow-[0_0_20px_rgba(91,200,245,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Summon Assistant</span>
            </button>
          </div>

          {/* Global HUD Mini */}
          <div className="px-6 border-t border-[#3e484e]/30 pt-4 space-y-2 font-mono">
            <div className="flex justify-between items-center text-[10px] tracking-widest text-[#889299] uppercase">
              <span className="flex items-center gap-1">
                <Egg className="w-3 h-3 text-[#a2e0ff]" /> MagnoEggs
              </span>
              <span className="text-[#a2e0ff] font-bold">12/40</span>
            </div>
            <div className="w-full h-1 bg-[#303538] overflow-hidden rounded">
              <div className="h-full bg-[#a2e0ff]" style={{ width: '30%' }} />
            </div>

            <div className="flex justify-between items-center text-[10px] tracking-widest text-[#889299] uppercase">
              <span>Sync Status</span>
              <span className="text-[#24ffcd] font-bold">OPTIMAL</span>
            </div>
          </div>

        </aside>
      )}

      {/* ========================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================= */}
      <main className={`transition-all pt-2 pb-20 ${isAssistantOpen ? 'lg:mr-72' : 'mr-0'}`}>

        
{viewMode === 'magzine' && (
  <div className="space-y-12 font-orbitron animate-fade-in">

            {/* MAGZINE SUB-NAVIGATION BAR */}
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 p-3 bg-[#131314]/90 border border-[#00dbe9]/30 rounded-2xl backdrop-blur-xl shadow-[0_0_20px_rgba(0,219,233,0.15)]">
              <div className="flex items-center gap-3 px-2">
                <span className="font-audiowide text-xl text-[#00dbe9] tracking-tight">MagZine</span>
                <span className="text-[10px] font-mono text-[#ffabf3] bg-[#ffabf3]/10 border border-[#ffabf3]/30 px-2.5 py-1 rounded-full uppercase font-bold">
                  MagnopVS Matrix Node v4.2
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 p-1 bg-[#1c1b1c] rounded-xl border border-[#353436]">
                <button
                  onClick={() => { playSoundEffect('click'); setMagzineSubTab('feed'); }}
                  className={`px-5 py-2.5 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer uppercase ${
                    magzineSubTab === 'feed'
                      ? 'bg-[#00f0ff] text-[#00363a] shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                      : 'text-[#b9cacb] hover:text-white hover:bg-[#353436]/50'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>DISPATCH FEED</span>
                </button>

                <button
                  onClick={() => { playSoundEffect('click'); setMagzineSubTab('reader'); }}
                  className={`px-5 py-2.5 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer uppercase ${
                    magzineSubTab === 'reader'
                      ? 'bg-[#ffabf3] text-[#5b005b] shadow-[0_0_15px_rgba(255,171,243,0.4)]'
                      : 'text-[#b9cacb] hover:text-white hover:bg-[#353436]/50'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>LORE READER</span>
                </button>

                <button
                  onClick={() => { playSoundEffect('click'); setMagzineSubTab('explorer'); }}
                  className={`px-5 py-2.5 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer uppercase ${
                    magzineSubTab === 'explorer'
                      ? 'bg-[#00dbe9] text-[#00363a] shadow-[0_0_15px_rgba(0,219,233,0.4)]'
                      : 'text-[#b9cacb] hover:text-white hover:bg-[#353436]/50'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>EXPLORER TERMINAL</span>
                </button>

                <button
                  onClick={() => { playSoundEffect('click'); setMagzineSubTab('studio'); }}
                  className={`px-5 py-2.5 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer uppercase ${
                    magzineSubTab === 'studio'
                      ? 'bg-[#15ffd1] text-[#003829] shadow-[0_0_15px_rgba(21,255,209,0.4)]'
                      : 'text-[#b9cacb] hover:text-white hover:bg-[#353436]/50'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>MAGNOSCROLL STUDIO</span>
                </button>
              </div>

              <div className="hidden lg:flex items-center gap-3 font-mono text-xs text-[#849495] pr-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#15ffd1] animate-ping" />
                <span className="text-[#15ffd1] font-bold uppercase">MATRIX LINK: OPTIMAL</span>
              </div>
            </div>

            {/* SUB-VIEW 1: DISPATCH FEED */}
            {magzineSubTab === 'feed' && (
              <div className="space-y-16 animate-fade-in">
                {/* FEATURED CHRONICLES (SINGULARITY OF SECTOR 4 HERO) */}
            <section className="relative w-full aspect-[21/9] min-h-[360px] rounded-3xl overflow-hidden bg-[#131313] border border-[#98cbff]/30 shadow-[0_0_35px_rgba(152,203,255,0.15)] group max-w-7xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0e] via-[#0e0e0e]/50 to-transparent z-10" />
              <div 
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-1000 brightness-75"
                style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBEkfT6JvpHkdx6wDSM2gcbYdrzQVFzJq0r1TRnWgh_GqSMnEIS0-9SPCm9msXPCgT4o8KybLZj3v90zenaVhuv89WHQKS5DDoy4YR0l4n8BzD2fKQWhKSsOa-nIlPbgvzhRHOQObQN4QxCn4-scvMcnZlh8fnioNFhQboyWdKkg1A84f9G5uhAgPLrMVwn8qfkKAuZGxnUbGH-zuBkcgoejxBeEUBvYUeTdnFKBngQvyKOxPHd3A_u6cNH4y9ukwxXNNEpWM6FxDV1')` }}
              />
              <div className="relative z-20 h-full flex flex-col justify-end p-6 md:p-12 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#15ffd1] rounded-full animate-pulse" />
                  <span className="text-[#15ffd1] font-mono text-xs font-bold tracking-widest uppercase">Live Transmission // MagnopVS</span>
                </div>
                <h2 className="font-audiowide text-3xl sm:text-5xl text-[#cee5ff] max-w-2xl leading-none uppercase drop-shadow-[0_0_15px_rgba(206,229,255,0.4)]">
                  THE SINGULARITY OF SECTOR 4
                </h2>
                <p className="text-[#c1c7d0] max-w-xl font-sans text-xs sm:text-sm line-clamp-2 leading-relaxed">
                  Decrypting the recursive memory loops found in the abandoned data-spires of MagnopVS. An investigative odyssey into the digital afterlife.
                </p>
                <div className="flex flex-wrap gap-4 pt-2 font-mono text-xs">
                  <button 
                    onClick={() => {
                      playSoundEffect('level');
                      addXpAndMp(150, 75);
                      alert("Crónica 'SINGULARITY OF SECTOR 4' accedida en MagnopVS. Recompensa: +150 XP / +75 MP.");
                    }}
                    className="px-6 py-3 bg-[#cee5ff] text-[#003354] font-bold rounded-xl hover:bg-[#98cbff] hover:shadow-[0_0_20px_rgba(206,229,255,0.4)] transition-all cursor-pointer uppercase"
                  >
                    ACCESS CHRONICLE (+150 XP)
                  </button>
                  <button 
                    onClick={() => {
                      playSoundEffect('click');
                      alert("Telemetry Status MagnopVS: Freq 104.4 MHz | Stability 98.92% | Signal Optimal.");
                    }}
                    className="px-6 py-3 border border-[#f3fff9] text-[#f3fff9] font-bold rounded-xl hover:bg-[#f3fff9]/10 transition-all cursor-pointer uppercase"
                  >
                    VIEW TELEMETRY
                  </button>
                </div>
              </div>

              {/* Floating Data Widgets */}
              <div className="absolute top-8 right-8 z-20 hidden lg:flex flex-col gap-4 text-right font-mono">
                <div className="bg-[#131313]/80 p-4 rounded-2xl border-l-4 border-[#ff4dfa] border border-[#41474f]/50 backdrop-blur-xl">
                  <div className="text-[10px] text-[#ff4dfa] font-bold">RESONANCE_FREQ</div>
                  <div className="text-2xl font-audiowide text-white">104.4 MHz</div>
                </div>
                <div className="bg-[#131313]/80 p-4 rounded-2xl border-l-4 border-[#98cbff] border border-[#41474f]/50 backdrop-blur-xl">
                  <div className="text-[10px] text-[#98cbff] font-bold">UPLINK_STABILITY</div>
                  <div className="text-2xl font-audiowide text-white">98.92%</div>
                </div>
              </div>
            </section>

            {/* LORE PATCHES & MAGZINE CHRONICLES GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
              {/* Left Column: Lore Patches (Multiverse News Feed) */}
              <section className="lg:col-span-4 space-y-4">
                <div className="flex items-center justify-between border-b border-[#41474f]/50 pb-3">
                  <h3 className="font-audiowide text-lg text-[#cee5ff] flex items-center gap-2 uppercase tracking-tighter">
                    <Zap className="w-4 h-4 text-[#15ffd1]" />
                    <span>Lore Patches</span>
                  </h3>
                  <span className="text-xs font-mono text-[#8b919a]">v4.0.2 // MagnopVS</span>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1 font-mono">
                  {/* News Item 1 */}
                  <div 
                    onClick={() => {
                      playSoundEffect('quest');
                      addXpAndMp(60, 30);
                      alert("Alerta NEURAL_DRIFT_DETECTED analizada en MagnopVS. +60 XP.");
                    }}
                    className="bg-[#131313]/90 p-4 rounded-2xl border border-[#41474f]/50 hover:border-[#cee5ff] transition-all cursor-pointer group backdrop-blur-xl"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-2.5 py-0.5 bg-[#93000a] text-[#ffdad6] text-[10px] font-bold rounded-full">CRITICAL</span>
                      <span className="text-[10px] text-[#8b919a]">14:22:01</span>
                    </div>
                    <h4 className="text-sm font-bold text-[#cee5ff] group-hover:text-[#15ffd1] transition-colors">NEURAL_DRIFT_DETECTED</h4>
                    <p className="text-xs text-[#c1c7d0] mt-1.5 opacity-80 leading-relaxed font-sans">
                      Ghost packets identified in Sector 7's relay towers in MagnopVS. Quarantine measures active.
                    </p>
                  </div>

                  {/* News Item 2 */}
                  <div 
                    onClick={() => {
                      playSoundEffect('quest');
                      addXpAndMp(60, 30);
                      alert("Ruta HYPER-BRIDGE_INITIALIZED mapeada en MagnopVS. +60 XP.");
                    }}
                    className="bg-[#131313]/90 p-4 rounded-2xl border border-[#41474f]/50 hover:border-[#15ffd1] transition-all cursor-pointer group backdrop-blur-xl"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-2.5 py-0.5 bg-[#00705a] text-[#15ffd1] text-[10px] font-bold rounded-full">STABLE</span>
                      <span className="text-[10px] text-[#8b919a]">12:10:44</span>
                    </div>
                    <h4 className="text-sm font-bold text-[#cee5ff] group-hover:text-[#15ffd1] transition-colors">HYPER-BRIDGE_INITIALIZED</h4>
                    <p className="text-xs text-[#c1c7d0] mt-1.5 opacity-80 leading-relaxed font-sans">
                      New route to the Neo-Kyoto archives has been successfully mapped in MagnopVS.
                    </p>
                  </div>

                  {/* News Item 3 */}
                  <div 
                    onClick={() => {
                      playSoundEffect('quest');
                      addXpAndMp(60, 30);
                      alert("Manuscritos VOID_READ_RESTORED descifrados en MagnopVS. +60 XP.");
                    }}
                    className="bg-[#131313]/90 p-4 rounded-2xl border border-[#ff4dfa]/30 hover:border-[#ff4dfa] transition-all cursor-pointer group backdrop-blur-xl"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-2.5 py-0.5 bg-[#7d3878] text-[#ffabf3] text-[10px] font-bold rounded-full">ANOMALY</span>
                      <span className="text-[10px] text-[#8b919a]">09:15:30</span>
                    </div>
                    <h4 className="text-sm font-bold text-[#cee5ff] group-hover:text-[#ff4dfa] transition-colors">VOID_READ_RESTORED</h4>
                    <p className="text-xs text-[#c1c7d0] mt-1.5 opacity-80 leading-relaxed font-sans">
                      Ancient encrypted manuscripts from the Void Era are now semi-legible in MagnopVS.
                    </p>
                  </div>

                  {/* News Item 4 */}
                  <div 
                    onClick={() => {
                      playSoundEffect('quest');
                      addXpAndMp(60, 30);
                      alert("Registro BATCH_SYNC_COMPLETE verificado en MagnopVS. +60 XP.");
                    }}
                    className="bg-[#131313]/60 p-4 rounded-2xl border border-[#41474f]/30 hover:border-[#8b919a] transition-all cursor-pointer backdrop-blur-xl"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-2.5 py-0.5 bg-[#353534] text-[#c1c7d0] text-[10px] font-bold rounded-full">LOGGED</span>
                      <span className="text-[10px] text-[#8b919a]">04:00:12</span>
                    </div>
                    <h4 className="text-sm font-bold text-[#c1c7d0]">BATCH_SYNC_COMPLETE</h4>
                    <p className="text-xs text-[#8b919a] mt-1 font-sans">
                      Bio-data leak addressed in the southern quadrant. No data loss reported in MagnopVS.
                    </p>
                  </div>
                </div>
              </section>

              {/* Right Column: MagZine Chronicles (Interactive Grid) */}
              <section className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between border-b border-[#41474f]/50 pb-3">
                  <h3 className="font-audiowide text-lg text-[#cee5ff] uppercase tracking-tighter">
                    MagZine Chronicles
                  </h3>
                  <div className="flex gap-2 font-mono text-xs text-[#15ffd1]">
                    <span>STATUS: ACTIVE REPOSITORY</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Saga Cover 1 */}
                  <div 
                    onClick={() => {
                      playSoundEffect('quest');
                      addXpAndMp(120, 60);
                      alert("Sincronización de NEON_PULSE_PROTOCOL (88%) completada en MagnopVS. +120 XP.");
                    }}
                    className="bg-[#131313]/90 border border-[#41474f]/60 hover:border-[#cee5ff] rounded-2xl p-3 flex flex-col justify-between group cursor-pointer transition-all hover:scale-[1.02] shadow-xl backdrop-blur-xl"
                  >
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3">
                      <img 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAG197_JfmHmZ8MW5RUm4eADJshG9hno6pKXlcpnhiN596gWnYQpi4PgXO8rVEyWGlY1-tfAWAL_R3zc3dmfVx7AEhx4M3VMqwkiCmKmvN2ET1vHx3REicSXumq7ZbwJLZziuLdIBZrMk5Oi1SFV99WQMJcKyGY4HCn7bCvP53fTqd9TXZD41LCEUh7JojHjaehr8GIu-9QqjZQwrN8CZnIE7zSjU0rbtUQGGbOwtD3lUQAhwJbrquBQAkQqYXM3FEQ6_Gfs9eZSB_Q"
                        alt="Tokyo 3000"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-80"
                      />
                      <div className="absolute top-2.5 left-2.5 px-2 py-1 bg-[#cee5ff] text-[#003354] font-mono text-[9px] font-bold rounded uppercase">
                        TOKYO 3000
                      </div>
                    </div>
                    <div className="px-1 space-y-2 font-mono">
                      <h5 className="text-white font-bold text-sm truncate group-hover:text-[#cee5ff] transition-colors">
                        NEON_PULSE_PROTOCOL
                      </h5>
                      <div className="flex justify-between text-[10px] text-[#8b919a]">
                        <span>SYNC_PROGRESS</span>
                        <span className="text-[#cee5ff] font-bold">88%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#201f20] rounded-full overflow-hidden border border-[#41474f]/40">
                        <div className="h-full bg-[#cee5ff] shadow-[0_0_8px_#cee5ff]" style={{ width: '88%' }} />
                      </div>
                    </div>
                  </div>

                  {/* Saga Cover 2 */}
                  <div 
                    onClick={() => {
                      playSoundEffect('quest');
                      addXpAndMp(120, 60);
                      alert("Intento de re-sincronización de ARCHAIC_UPLOAD_ERROR (42%) en MagnopVS. +120 XP.");
                    }}
                    className="bg-[#131313]/90 border border-[#41474f]/60 hover:border-[#15ffd1] rounded-2xl p-3 flex flex-col justify-between group cursor-pointer transition-all hover:scale-[1.02] shadow-xl backdrop-blur-xl"
                  >
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3">
                      <img 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBr29zO0wvYuftsJGPFqUPqYnYT2Dz8BGOj5lrFCeMtuIsROZJEODmdfEUrIXGodMMLVfextkG9Q2wEfw4LNvqHhpQQ6p7kT4RpN5AeeynjH2y_cFN8hHY2k-COdwcH_0o7TguIG1xkQCRXryShjk5fv8q2EK9UkcP1trfih8kA8GaIWH1J0zKm4_UA1vcajdrM7tseGlVQr_fUQYDTXtTzvMxL5frHxJrJdRg_k1CJj6OAxrVBv-yteaMViXnvaiZTdtjQ6pifVUkI"
                        alt="Eleusis Path"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-80"
                      />
                      <div className="absolute top-2.5 left-2.5 px-2 py-1 bg-[#15ffd1] text-[#002018] font-mono text-[9px] font-bold rounded uppercase">
                        ELEUSIS PATH
                      </div>
                    </div>
                    <div className="px-1 space-y-2 font-mono">
                      <h5 className="text-white font-bold text-sm truncate group-hover:text-[#15ffd1] transition-colors">
                        ARCHAIC_UPLOAD_ERROR
                      </h5>
                      <div className="flex justify-between text-[10px] text-[#8b919a]">
                        <span>SYNC_PROGRESS</span>
                        <span className="text-[#15ffd1] font-bold">42%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#201f20] rounded-full overflow-hidden border border-[#41474f]/40">
                        <div className="h-full bg-[#15ffd1] shadow-[0_0_8px_#15ffd1]" style={{ width: '42%' }} />
                      </div>
                    </div>
                  </div>

                  {/* Saga Cover 3 */}
                  <div 
                    onClick={() => {
                      playSoundEffect('quest');
                      addXpAndMp(120, 60);
                      alert("Sincronización completa de EXTINCTION_CHORUS (100%) en MagnopVS. +120 XP.");
                    }}
                    className="bg-[#131313]/90 border border-[#ff4dfa]/40 hover:border-[#ff4dfa] rounded-2xl p-3 flex flex-col justify-between group cursor-pointer transition-all hover:scale-[1.02] shadow-xl backdrop-blur-xl"
                  >
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3">
                      <img 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZx_wshpD_MH0SVscwFJGzrz4MKzh8Y5GfXTptHSkuuKtH2JnKauQN1nb7Ew4T-EA6lWusa_b9EhmJUGbV73YFJh6D2QJKRms5s8YRwYJmCysFq8XuiqaqUbuSmbZ4wFhEkqKlDwyBzM_ekt3tOwM3qWLMS_OaN8XGuB7NBTLgHl6dGY1xFoNBfN6ae83zFAMscJ6cN1rhSo4r7sCMhg2xZWemK5vhNcnqrO0TyKs5vktKP3_jkp3_nu5lF8uqdWNt94Y6JhRZS__o"
                        alt="Solaris Drift"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-80"
                      />
                      <div className="absolute top-2.5 left-2.5 px-2 py-1 bg-[#ff4dfa] text-black font-mono text-[9px] font-bold rounded uppercase">
                        SOLARIS DRIFT
                      </div>
                    </div>
                    <div className="px-1 space-y-2 font-mono">
                      <h5 className="text-white font-bold text-sm truncate group-hover:text-[#ff4dfa] transition-colors">
                        EXTINCTION_CHORUS
                      </h5>
                      <div className="flex justify-between text-[10px] text-[#8b919a]">
                        <span>SYNC_PROGRESS</span>
                        <span className="text-[#ff4dfa] font-bold">100%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#201f20] rounded-full overflow-hidden border border-[#41474f]/40">
                        <div className="h-full bg-[#ff4dfa] shadow-[0_0_8px_#ff4dfa]" style={{ width: '100%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Editorial Telemetry Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono pt-4">
                  <div className="bg-[#131313]/90 p-5 rounded-2xl border border-[#cee5ff]/30 backdrop-blur-xl">
                    <div className="text-[10px] text-[#8b919a] mb-1.5 flex items-center justify-between uppercase">
                      LORE_INTEGRITY
                      <Check className="w-4 h-4 text-[#cee5ff]" />
                    </div>
                    <div className="text-3xl font-audiowide text-[#cee5ff]">0.992</div>
                    <div className="mt-3 flex items-center gap-1 text-[10px] text-[#15ffd1] font-bold">
                      <span>+0.004 INCREASE // MagnopVS</span>
                    </div>
                  </div>

                  <div className="bg-[#131313]/90 p-5 rounded-2xl border border-[#15ffd1]/30 backdrop-blur-xl">
                    <div className="text-[10px] text-[#8b919a] mb-1.5 flex items-center justify-between uppercase">
                      ACTIVE_READERS
                      <Globe className="w-4 h-4 text-[#15ffd1]" />
                    </div>
                    <div className="text-3xl font-audiowide text-[#15ffd1]">12.4k</div>
                    <div className="mt-3 text-[10px] text-[#8b919a] font-bold">
                      ONLINE NOW // MATRIX NODES
                    </div>
                  </div>

                  <div className="bg-[#131313]/90 p-5 rounded-2xl border border-[#ff4dfa]/30 backdrop-blur-xl">
                    <div className="text-[10px] text-[#8b919a] mb-1.5 flex items-center justify-between uppercase">
                      QUANTVM_RESONANCE
                      <Zap className="w-4 h-4 text-[#ff4dfa]" />
                    </div>
                    <div className="text-3xl font-audiowide text-[#ff4dfa]">High</div>
                    <div className="mt-3 h-2 w-full bg-[#201f20] rounded-full overflow-hidden border border-[#41474f]/40">
                      <div className="h-full bg-gradient-to-r from-[#8a2be2] to-[#ff4dfa] animate-pulse rounded-full" style={{ width: '75%' }} />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* CREATIVE TOOLS UPLINK DOCK */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 font-mono text-xs max-w-7xl mx-auto">
              <button 
                onClick={() => {
                  playSoundEffect('level');
                  addXpAndMp(150, 75);
                  alert("Terminal de Redacción Abridero en MagnopVS: 'WRITE CHRONICLE'. +150 XP otorgados.");
                }}
                className="px-6 py-3.5 bg-[#131313] border border-[#cee5ff] text-[#cee5ff] font-bold rounded-xl hover:bg-[#cee5ff]/20 hover:scale-105 transition-all cursor-pointer shadow-[0_0_20px_rgba(206,229,255,0.2)] flex items-center gap-2 uppercase"
              >
                <Terminal className="w-4 h-4" />
                <span>WRITE CHRONICLE (+150 XP)</span>
              </button>

              <button 
                onClick={() => {
                  playSoundEffect('level');
                  addXpAndMp(150, 75);
                  alert("Escaner de Artefactos de la Red MagnopVS Iniciado: 'SCAN ARTIFACT'. +150 XP otorgados.");
                }}
                className="px-6 py-3.5 bg-[#cee5ff] text-[#003354] font-bold rounded-xl hover:bg-[#98cbff] hover:scale-105 transition-all cursor-pointer shadow-[0_0_25px_rgba(206,229,255,0.4)] flex items-center gap-2 uppercase"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>SCAN ARTIFACT (+150 XP)</span>
              </button>
            </div>

            {/* HERO FEATURED STORY BANNER */}
            <section className="relative group rounded-3xl overflow-hidden aspect-[16/9] md:aspect-[21/9] max-w-7xl mx-auto border border-[#00f0ff]/30 shadow-[0_0_35px_rgba(0,240,255,0.15)]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0f] via-[#0e0e0f]/50 to-transparent z-10" />
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJOxVJXMF3HkoGzFwU0jl_He9VtQE_OaxpZrjE-xzr2iAb7Ujtyj0E9lHTFV4EucXGYZ5_Gpxpf9qHiBeFZUiQ8atNKh2GDtEj1qnoxcr_FlYUjgDghppCr16KQV1j5dI0QdqQQv4IOYJPipkkP9NqbjfYfPD7Fy0obPWRAkYVPlkwooQmwt_QbbKWy2FS5gEonu7u3aBuqlIpS2KPj-S0sg7qCMzOZuiflEB0kU0wNriMMKMKuuTaUQ_eaw9kZ0h48LHqd9aosQP0"
                  alt="The Awakening of the CBC" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[2000ms] brightness-75"
                />
              </div>
              
              <div className="absolute bottom-0 left-0 p-6 md:p-12 z-20 w-full md:w-3/4 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#00f0ff]/20 text-[#7df4ff] px-3 py-1 rounded text-[10px] font-mono font-bold tracking-widest border border-[#00f0ff]/40 uppercase">
                    FEATURED SAGA
                  </span>
                  <span className="text-[#b9cacb] text-[10px] font-mono tracking-widest uppercase">
                    • QUANTVM ZERO // MagnopVS
                  </span>
                </div>

                <h1 className="font-audiowide text-3xl sm:text-5xl md:text-6xl text-[#dbfcff] leading-tight tracking-tight drop-shadow-[0_0_20px_rgba(0,240,255,0.3)] uppercase">
                  The Awakening of the CBC
                </h1>

                <p className="font-sans text-sm md:text-base text-[#b9cacb] max-w-xl leading-relaxed">
                  A glitch in the matrix? Or the beginning of a cosmic recalibration. Discover the first fragments of the Cosmic White Rabbit's ascent in MagnopVS.
                </p>

                <div className="flex flex-wrap gap-4 pt-2 font-mono text-xs">
                  <button 
                    onClick={handleLuckyJump}
                    className="bg-[#00f0ff] text-[#00363a] px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#7df4ff] transition-all cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                  >
                    <span>ENTER THE VOID (+150 XP)</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => { setActiveTab('mcds'); playSoundEffect('click'); }}
                    className="bg-[#353436]/60 backdrop-blur-md text-white px-8 py-3.5 rounded-xl border border-[#3b494b] hover:bg-[#353436] transition-all cursor-pointer"
                  >
                    ARCHIVE DATA
                  </button>
                </div>
              </div>
            </section>

            {/* TRENDING MATRIX NODES */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
              <h3 className="font-mono text-xs text-[#b9cacb] mb-4 uppercase tracking-[0.3em]">
                Trending Matrix Nodes
              </h3>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: 'Tokyo-3000', highlight: true },
                  { label: '#SumerianCyber', highlight: false },
                  { label: '#VoidProtocol', highlight: false },
                  { label: '#ArtifactLeak', highlight: false },
                  { label: 'The Rabbit Hole', highlight: true }
                ].map((node, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      playSoundEffect('click');
                      alert(`Explorando nodo ${node.label} en MagnopVS...`);
                    }}
                    className={`px-5 py-2.5 rounded-full font-mono text-xs flex items-center gap-2 transition-all cursor-pointer border backdrop-blur-md ${
                      node.highlight
                        ? 'bg-[#201f20]/80 border-[#ffabf3]/50 text-[#ffabf3] shadow-[0_0_15px_rgba(255,171,243,0.2)] hover:border-[#ffabf3]'
                        : 'bg-[#201f20]/60 border-[#3b494b]/60 text-[#b9cacb] hover:text-[#dbfcff] hover:border-[#849495]'
                    }`}
                  >
                    {node.highlight && <span className="w-1.5 h-1.5 rounded-full bg-[#ffabf3] animate-pulse" />}
                    <span>{node.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* LORE DISPATCHES: BENTO GRID */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
              <div className="flex justify-between items-end border-b border-[#3b494b]/40 pb-4">
                <div>
                  <h2 className="font-audiowide text-2xl sm:text-3xl text-[#dbfcff] uppercase">
                    Lore Dispatches
                  </h2>
                  <p className="text-[#b9cacb] font-mono text-xs mt-1">
                    REAL-TIME DATA STREAM: ACTIVE // MagnopVS MATRIX
                  </p>
                </div>
                <button 
                  onClick={() => { playSoundEffect('click'); alert("Mostrando todos los registros de Lore Dispatches en MagnopVS."); }}
                  className="font-mono text-xs text-[#00dbe9] hover:text-[#ffabf3] flex items-center gap-1 cursor-pointer uppercase font-bold"
                >
                  <span>VIEW ALL LOGS</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Large Story Card */}
                <article className="lg:col-span-8 bg-[#201f20]/80 border border-[#3b494b]/50 rounded-2xl overflow-hidden flex flex-col hover:border-[#ffabf3]/50 transition-all duration-300 shadow-xl group">
                  <div className="relative h-80 sm:h-96 overflow-hidden">
                    <img 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwk5iBHomsOe4yLwmmt8tyaQM96Hlfgu1z7OKvbL9RcM9kfK5CuWypSXVxQtScA3WmpxukbP5Kly_5lO0bonuGxzx7G-ZxYiKO9pk_rnOwzWghgBClEXHoJtQmWeo3X7tz2CHMh7AHzaAa48PJH3w4k-2BRRzSPj2O0KrSns6u4KR_zVW41YMk6SuEUO1DliFGAP3nyZJZmsbN0cG6-b23Tn23w9Ol8JQRJ70FzEzZt4HRGonTp_fTADSa_v4-03fstNIqzwiykjNx"
                      alt="Tokyo 3000: The Silence of the Neon" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-80"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#131314]/90 backdrop-blur px-3 py-1 rounded-md text-[10px] font-mono font-bold text-[#00dbe9] border border-[#00dbe9]/30 uppercase">
                        SAGA // TOKYO 3000
                      </span>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow space-y-4">
                    <div className="flex items-center gap-3 text-[#b9cacb] font-mono text-xs">
                      <span>BY: ARCHIVIST_01</span>
                      <span>|</span>
                      <span>21.03.20XX</span>
                    </div>
                    <h3 className="font-audiowide text-2xl text-white group-hover:text-[#00dbe9] transition-colors cursor-pointer uppercase">
                      Tokyo 3000: The Silence of the Neon
                    </h3>
                    <p className="text-[#b9cacb] font-sans text-xs sm:text-sm leading-relaxed">
                      In the heart of the Megacity, the lights never go out, but the voices have started to disappear. Investigation into the neural-silencing phenomena across MagnopVS.
                    </p>
                    <div className="flex justify-between items-center pt-2 font-mono text-xs">
                      <div className="flex gap-2">
                        <span className="text-[#ffabf3] px-2.5 py-1 border border-[#ffabf3]/30 rounded text-[10px]">#CYBERPUNK</span>
                        <span className="text-[#ffabf3] px-2.5 py-1 border border-[#ffabf3]/30 rounded text-[10px]">#MYSTERY</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          playSoundEffect('quest');
                          addXpAndMp(100, 50);
                          alert('¡Fragmento guardado! +100 XP añadidos en tu perfil de MagnopVS.');
                        }}
                        className="p-2 text-[#00dbe9] hover:text-[#ffabf3] transition-colors cursor-pointer"
                      >
                        <Bookmark className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </article>

                {/* Side Stories Column */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  {/* Side Card 1 */}
                  <article className="bg-[#201f20]/80 border border-[#3b494b]/50 rounded-2xl p-6 flex flex-col justify-between flex-1 hover:border-[#00dbe9]/50 transition-all shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#2a2a2b] border border-[#3b494b] flex items-center justify-center text-[#ffabf3]">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-mono font-bold text-xs text-[#00dbe9] uppercase">Sumerian Artifact 009</h4>
                        <span className="text-[10px] text-[#b9cacb] font-mono">CLASSIFIED DATA // MagnopVS</span>
                      </div>
                    </div>
                    <h3 className="font-audiowide text-lg text-white mb-2 uppercase">Lords of Sumer: The Digital Rebirth</h3>
                    <p className="text-[#b9cacb] font-mono text-xs leading-relaxed mb-4">
                      Ancient deities found encoded in 256-bit encryption headers.
                    </p>
                    <button 
                      onClick={() => {
                        playSoundEffect('quest');
                        addXpAndMp(80, 40);
                        alert("Desbloqueado fragmento: Lords of Sumer. +80 XP / +40 MP.");
                      }}
                      className="text-[#00dbe9] font-mono text-xs font-bold flex items-center gap-2 group hover:text-[#ffabf3] cursor-pointer uppercase mt-auto"
                    >
                      <span>READ FRAGMENT (+80 XP)</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </article>

                  {/* Side Card 2 */}
                  <article className="bg-[#201f20]/80 border border-[#3b494b]/50 rounded-2xl overflow-hidden flex flex-col flex-1 hover:border-[#ffabf3]/50 transition-all shadow-lg group">
                    <div className="h-36 overflow-hidden relative">
                      <img 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDx6tn1mVtQSAjdu72OYtYqC51s6_o9gm5rSFn_yrZyzRQw-HzvLQoVrZ0yD0jA8MGTQBHQSrBkY5Ii9jPvp-u_1DEzZMlfIOP1NzKBP6g2dsfwle45SA297lONMDilaK7OZrXoZnqcHXV4EFWdxk0wffsGTRXGzyQFH7Ef6dAzkRnT6E-DHYPxpn-irz36S4R4BTjSGJRiJWWCar6R-mhRC1A0u_SVxQVbKaRbBgt2HgFxLyKLXK2skWY2q071dvpZkEW8GKJkZ7aX"
                        alt="Iris Protocol" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
                      />
                    </div>
                    <div className="p-5 flex flex-col justify-between flex-1">
                      <h3 className="font-audiowide text-base text-white group-hover:text-[#ffabf3] transition-colors uppercase">
                        Iris Protocol: Seeing the Unseen
                      </h3>
                      <span className="text-[10px] text-[#ffabf3] font-mono mt-2 font-bold uppercase">ENCRYPTED ENTRY // MagnopVS MATRIX</span>
                    </div>
                  </article>
                </div>
              </div>
            </section>

            {/* MULTIVERSAL SAGAS CAROUSEL / GRID */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px flex-grow bg-[#3b494b]/40" />
                <h2 className="font-mono text-xs font-bold text-[#ffabf3] tracking-widest uppercase">
                  MULTIVERSAL SAGAS // MagnopVS
                </h2>
                <div className="h-px flex-grow bg-[#3b494b]/40" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "Lord's of Sumer",
                    desc: "A clash of ancient myth and quantum future.",
                    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAC3I9yRKGUidDgYhQF3hTSGNdwI99B0C-aeM_4QSK3djAj0cm4V7N-cg8Pd67nRI_HbDJMVZe0koytPzve-71RpZHmpiTti5tfLpc-IQ21jthjbrxJ8iACCo57YtZpVmBb1lEte78pIpc1MQZFk41CYVZWYHkahqVaxxujET-lY1vlBCQ6dzm9i3NFtz67MmXSfsTcKeMVyG0MAnfcF3HGD-WhQeIG8S4fU0nJ0tUF-19tlJPilrH5rvZBQm-oFv1NCDAazvjQYgls"
                  },
                  {
                    title: "Tokyo 3000",
                    desc: "The world's last megacity is waking up.",
                    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2QJnMGZwNtUJZi0yFhFhF2osmA6h2vo62A_dP3Nzc_MxC4Kn79jLIWmtCxrbeqP7xjbhm2REZq4jipwLRIoJ42HdA5i2HWs1651kEPos9uPF3IZMeBRsPNIu4RkKzvLDJ3X_vXJSr5dNH8G2hXchMbJ7qBWU-swhwbxzR2Xpwvzv4j25yiS8LVuMntePbI-mq19xiM-Mf1NSOo5h75ub83eIpZC9fAhmwkz9Y-AaDQafCcD0wQ41M7EAVjJtLq1FBj4uLo1rRj0mP"
                  },
                  {
                    title: "The White Void",
                    desc: "Where data goes to become pure consciousness.",
                    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUa9tHjEUP1Op4bFqzo4VtjZ1xbh20wHYwQlfyaahigpVZ7S9BOU-premGZ7nO8n21TIa4nqn6OEKzLWCYFA9huZPbNdH9YHZ1IcrajxBtsEZP2PoXT7fmuA3XbqBlQEercU8UxyaYdJ0FXZYBE3n1H41sbD-j8O6YsGhbH1H2hAQIhgwa9Eli2lCqyAF0JhUXTtxUKb0jizEcKcJHwhjqUvFFtD0XR5AzIyzcCx1W-3CRHTpzQ-Ml9HVAHZYQV4W6PRxIYntv3ph1"
                  },
                  {
                    title: "Data Wilds",
                    desc: "Surviving the unmapped regions of the Quantvm Matrix.",
                    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVfDXzNzp5721NwHQ5Ji5bFZEr1eOvlqUyg3muYM_wZyJGV_gs9kNrcJ65OO8yubAsJgofca_gEGRNObcJ9iuC45mAtO9eUZyFtiyN2BEAmuky0jAZgMsg4comoIwjHvLFkC3TeBv2mbA3vKR-gq_iQwI6Y0ikS7cuZ2E5ZaiHn8yq7qXcQ1tz42uW5cXUhLHFxps4ZZPZAWFqyBtj_3M3Byuz1sF1oBUC19LOMnwjCyE87XymaUyQ1wKIS5FqyRw43zqAcB59PG1-"
                  }
                ].map((s, idx) => (
                  <div 
                    key={idx}
                    onClick={() => {
                      playSoundEffect('click');
                      const found = sagas.find(sg => sg.title.toLowerCase().includes(s.title.toLowerCase()));
                      if (found) handleOpenSagaDetails(found);
                      else alert(`Abriendo saga ${s.title} en MagnopVS...`);
                    }}
                    className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#201f20] border border-[#3b494b]/50 group hover:border-[#00dbe9] transition-all cursor-pointer shadow-xl"
                  >
                    <img 
                      src={s.image} 
                      alt={s.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-75 group-hover:brightness-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0f] via-transparent to-transparent opacity-90" />
                    <div className="absolute bottom-0 p-6 space-y-1">
                      <h4 className="font-audiowide text-lg text-[#00dbe9] uppercase">{s.title}</h4>
                      <p className="text-[#b9cacb] font-mono text-xs">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA SECTION: LOST IN THE MATRIX */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="bg-[#201f20]/90 border border-[#00dbe9]/40 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden backdrop-blur-xl shadow-2xl space-y-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#00f0ff15_0%,transparent_70%)] pointer-events-none" />
                <h2 className="font-audiowide text-3xl sm:text-5xl text-[#00dbe9] uppercase relative z-10">
                  Lost in the Matrix?
                </h2>
                <p className="font-sans text-sm sm:text-base text-[#b9cacb] max-w-xl mx-auto relative z-10 leading-relaxed">
                  Trust the rabbit. Let the algorithm guide your descent into the unknown in MagnopVS.
                </p>
                <div className="relative z-10 pt-2">
                  <button 
                    onClick={handleLuckyJump}
                    className="px-10 py-4 bg-[#ffabf3] text-[#5b005b] font-mono font-bold text-xs uppercase rounded-xl hover:bg-[#ffd7f5] transition-all cursor-pointer shadow-[0_0_25px_rgba(255,171,243,0.4)] inline-flex items-center gap-3"
                  >
                    <span>LUCKY JUMP (+150 XP)</span>
                    <Compass className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>
            </section>

            {/* SAGA EXPLORER GALLERY */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 pt-6 border-t border-[#3b494b]/40">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-l-4 border-[#00dbe9] pl-6 py-1">
                <div>
                  <h2 className="font-audiowide text-2xl sm:text-4xl text-[#00dbe9] uppercase tracking-wide">
                    SAGA EXPLORER
                  </h2>
                  <p className="text-xs sm:text-sm text-[#b9cacb] max-w-2xl font-sans mt-1 leading-relaxed">
                    Select any historical simulation node to experience high-fidelity transmedia narratives in MagnopVS.
                  </p>
                </div>

                {/* Era Filter Badges */}
                <div className="flex flex-wrap gap-2 font-mono text-xs">
                  {[
                    { id: 'all', label: 'All Eras' },
                    { id: 'chaos', label: 'Chaos Era' },
                    { id: 'source', label: 'Source Era' },
                    { id: 'void', label: 'Void Era' }
                  ].map((era) => (
                    <button
                      key={era.id}
                      onClick={() => { setSelectedEra(era.id as any); playSoundEffect('click'); }}
                      className={`px-4 py-2 border uppercase transition-all cursor-pointer font-bold rounded-xl text-xs ${
                        selectedEra === era.id
                          ? 'bg-[#00dbe9]/20 text-[#00dbe9] border-[#00dbe9] shadow-[0_0_10px_rgba(0,219,233,0.3)]'
                          : 'bg-[#201f20] text-[#b9cacb] border-[#3b494b] hover:border-[#00dbe9] hover:text-[#00dbe9]'
                      }`}
                    >
                      {era.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid Gallery */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredSagas.map((saga) => {
                  const liveStats = sagaActivityMap[saga.id];
                  const pulseTier = liveStats ? getTierForIntensity(liveStats.intensity) : null;
                  return (
                  <div 
                    key={saga.id}
                    className="group bg-[#201f20] border border-[#3b494b]/50 rounded-2xl overflow-hidden hover:border-[#00dbe9] transition-all shadow-xl flex flex-col justify-between h-[480px]"
                    style={
                      isPulseLayerEnabled && pulseTier && liveStats
                        ? {
                            borderColor: `${pulseTier.color}88`,
                            boxShadow: `0 0 ${14 + Math.round(liveStats.intensity / 4)}px ${pulseTier.glowRgba}`,
                            filter: `brightness(${pulseTier.brightness})`,
                          }
                        : undefined
                    }
                  >
                    <div className="h-3/5 overflow-hidden relative">
                      <img 
                        src={saga.image} 
                        alt={saga.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#201f20] via-transparent to-transparent" />
                      
                      <div className="absolute top-3 left-3 bg-[#0e0e0f]/80 backdrop-blur-md px-2.5 py-1 rounded text-[9px] font-mono font-bold text-[#15ffd1] uppercase border border-[#15ffd1]/30">
                        {saga.era.toUpperCase()} ERA
                      </div>

                      {isPulseLayerEnabled && pulseTier && liveStats && (
                        <div
                          className="absolute top-3 right-3 bg-[#0e0e0f]/85 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase border flex items-center gap-1.5"
                          style={{ borderColor: pulseTier.color, color: pulseTier.color }}
                        >
                          <span
                            className="w-2 h-2 rounded-full animate-ping"
                            style={{
                              backgroundColor: pulseTier.color,
                              animationDuration: `${pulseTier.pulseDurationMs}ms`,
                            }}
                          />
                          <span>{liveStats.activePlayers} ON • {liveStats.intensity}%</span>
                        </div>
                      )}

                      <div className="absolute bottom-3 left-4 font-audiowide text-xl text-white drop-shadow-md">
                        {saga.title}
                      </div>
                    </div>

                    <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                      <p className="font-sans text-xs text-[#b9cacb] leading-relaxed line-clamp-3">
                        {saga.description}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-[#3b494b]/40 font-mono text-xs">
                        <span className="text-[#00dbe9] font-bold flex items-center gap-1">
                          <Egg className="w-3.5 h-3.5" /> +{saga.magnoEggsReward} MagnoEggs
                        </span>

                        {saga.id === 'mlh' ? (
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                playSoundEffect('portal');
                                addXpAndMp(300, 100);
                                setCurrentSagaId('mlh');
                                setActiveTab('herogame');
                              }}
                              className="px-3 py-1.5 bg-[#00dbe9] hover:bg-[#24ffcd] text-[#00382c] font-mono text-xs font-bold transition-all rounded-xl cursor-pointer flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,219,233,0.4)]"
                              title="Sintonizar Nodo e ingresar a MLH"
                            >
                              <Zap className="w-3.5 h-3.5 fill-current" />
                              <span>Sintonizar Nodo</span>
                            </button>
                            <button 
                              onClick={() => handleOpenSagaDetails(saga)}
                              className="p-1.5 bg-[#00dbe9]/10 hover:bg-[#00dbe9]/20 text-[#00dbe9] rounded-xl transition-all"
                              title="Detalles"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleOpenSagaDetails(saga)}
                            className="px-4 py-2 bg-[#00dbe9]/10 hover:bg-[#00dbe9] text-[#00dbe9] hover:text-[#00363a] font-mono text-xs font-bold transition-all rounded-xl cursor-pointer flex items-center gap-1"
                          >
                            <span>Explore</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            </section>

            {/* STAY SYNCED / NEWSLETTER SECTION */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="bg-[#201f20]/90 border border-[#00dbe9]/30 p-8 sm:p-12 rounded-3xl relative overflow-hidden flex flex-col lg:flex-row items-center gap-8 shadow-2xl">
                <div className="flex-1 text-center lg:text-left space-y-2">
                  <h2 className="font-audiowide text-3xl sm:text-4xl text-[#00dbe9]">
                    STAY SYNCED
                  </h2>
                  <p className="font-sans text-sm text-[#b9cacb] max-w-lg">
                    Join 2.4k interface units and receive the latest matrix updates directly to your consciousness link in MagnopVS.
                  </p>
                </div>

                <div className="flex-1 w-full max-w-md">
                  {isSyncEstablished ? (
                    <div className="bg-[#15ffd1]/10 border border-[#15ffd1] p-4 rounded-2xl text-center space-y-1 font-mono animate-fade-in">
                      <div className="text-sm font-bold text-[#15ffd1] flex items-center justify-center gap-2">
                        <Check className="w-4 h-4" />
                        <span>QUANTVM LINK ESTABLISHED</span>
                      </div>
                      <p className="text-xs text-[#b9cacb]">
                        +200 XP & +100 MP creados en tu perfil de MagnopVS.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleEstablishSync} className="flex flex-col gap-3">
                      <div className="relative">
                        <input 
                          type="email" 
                          required
                          value={syncEmail}
                          onChange={(e) => setSyncEmail(e.target.value)}
                          placeholder="ENTER SYNC ADDRESS" 
                          className="w-full bg-[#131314] border border-[#3b494b] p-3.5 rounded-xl focus:outline-none focus:border-[#00dbe9] text-white font-mono text-xs uppercase placeholder-[#849495]"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b9cacb] font-mono text-[10px]">
                          0x-SYNC
                        </div>
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-3.5 bg-[#ffabf3] text-[#5b005b] font-audiowide text-xs uppercase font-bold rounded-xl hover:shadow-[0_0_20px_rgba(255,171,243,0.4)] transition-all cursor-pointer"
                      >
                        ESTABLISH LINK (+200 XP)
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </section>

              </div>
            )}

            {/* SUB-VIEW 2: LORE READER */}
            {magzineSubTab === 'reader' && (
              <div className="max-w-7xl mx-auto space-y-8 animate-fade-in relative pb-28">
                {/* SPOILER SLIDER & READER CONTROL TOOLBAR */}
                <div className="glass-panel p-4 rounded-2xl border border-[#00dbe9]/30 flex flex-wrap items-center justify-between gap-6 bg-[#131314]/90 backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00dbe9] font-mono text-[10px] font-bold rounded-full uppercase">
                      QUANTVM ARCHIVE
                    </span>
                    <span className="text-[#b9cacb] font-mono text-xs">SYNC_DATE: 2049.03.15</span>
                  </div>

                  {/* SPOILER CONTROL SLIDER */}
                  <div className="flex items-center gap-4 bg-[#1c1b1c] px-4 py-2 rounded-xl border border-[#353436]">
                    <div className="flex flex-col text-[9px] font-mono text-[#00dbe9] font-bold uppercase">
                      <span>SPOILER LEVEL</span>
                      <span className="text-white">LEVEL {loreSpoilerLevel} LOREMASTER</span>
                    </div>
                    <input 
                      type="range" 
                      min={1} 
                      max={5} 
                      value={loreSpoilerLevel}
                      onChange={(e) => setLoreSpoilerLevel(Number(e.target.value))}
                      className="w-32 accent-[#00dbe9] cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        playSoundEffect('click');
                        alert("Notificaciones de Lore activadas en MagnopVS.");
                      }}
                      className="p-2.5 rounded-xl bg-[#201f20] border border-[#353436] text-[#00dbe9] hover:bg-[#00dbe9]/20 transition-all cursor-pointer"
                    >
                      <Bell className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        playSoundEffect('click');
                        setActiveLoreContext('artifact-prism');
                      }}
                      className="p-2.5 rounded-xl bg-[#201f20] border border-[#353436] text-[#ffabf3] hover:bg-[#ffabf3]/20 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 3-COLUMN LORE READER LAYOUT */}
                <div className="grid grid-cols-12 gap-8">
                  {/* Left Column: CBC Rabbit Guide Margin Comments */}
                  <aside className="hidden xl:block col-span-3 space-y-6 sticky top-28 h-fit font-mono">
                    <div className="p-4 rounded-2xl bg-[#1c1b1c]/90 border-l-4 border-[#00dbe9] border border-[#353436] relative backdrop-blur-xl hover:translate-x-1 transition-transform">
                      <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#131314] rounded-full border border-[#00dbe9] flex items-center justify-center text-[#00dbe9] shadow-lg">
                        <Bot className="w-4 h-4" />
                      </div>
                      <p className="text-xs text-[#b9cacb] italic leading-relaxed pt-1">
                        "Observe the refraction on the Chromatic Prism. It isn't glass; it's frozen temporal data in MagnopVS. Don't touch the edges."
                      </p>
                      <div className="mt-3 text-right text-[9px] text-[#00dbe9] font-bold">
                        — CBC-Unit 041
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#1c1b1c]/90 border-l-4 border-[#ffabf3] border border-[#353436] relative backdrop-blur-xl hover:translate-x-1 transition-transform">
                      <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#131314] rounded-full border border-[#ffabf3] flex items-center justify-center text-[#ffabf3] shadow-lg">
                        <Eye className="w-4 h-4" />
                      </div>
                      <p className="text-xs text-[#b9cacb] italic leading-relaxed pt-1">
                        "The Archivist's signature is hidden within the hex-grid. Look closer at paragraph three."
                      </p>
                      <div className="mt-3 text-right text-[9px] text-[#ffabf3] font-bold">
                        — CBC-Unit 088
                      </div>
                    </div>

                    <div 
                      onClick={() => {
                        playSoundEffect('quest');
                        addXpAndMp(50, 25);
                        alert("Pista del CBC reclamada: '¡Sigue el rastro cuántico!'. +50 XP / +25 MP.");
                      }}
                      className="p-4 rounded-2xl bg-[#131314] border border-dashed border-[#15ffd1]/50 text-center cursor-pointer hover:bg-[#15ffd1]/10 transition-all"
                    >
                      <span className="text-xs text-[#15ffd1] font-bold block mb-1">
                        ✦ UNLOCK CBC HINT (+50 XP)
                      </span>
                      <span className="text-[10px] text-[#b9cacb]">Click to receive direct neural guidance</span>
                    </div>
                  </aside>

                  {/* Center Article Content */}
                  <article className="col-span-12 xl:col-span-6 space-y-8">
                    <header className="space-y-4">
                      <h1 className="font-audiowide text-3xl sm:text-5xl text-[#dbfcff] leading-tight tracking-tight uppercase hover:text-[#00f0ff] transition-colors cursor-default">
                        The Collapse of the Neon Web
                      </h1>
                      <p className="font-sans text-sm sm:text-base text-[#ffabf3] italic border-l-2 border-[#ffabf3] pl-4 leading-relaxed">
                        Exploring the metaphysical residue left behind by the Great Desynchronization of the Neo-Tokyo Grid in MagnopVS.
                      </p>
                    </header>

                    <div className="space-y-6 text-[#e5e2e3] font-sans text-sm sm:text-base leading-relaxed">
                      <h2 className="font-audiowide text-2xl text-[#00dbe9] pt-4 uppercase">
                        The First Anomaly
                      </h2>
                      <p>
                        It began not with a bang, but with a slight flicker in the{' '}
                        <button 
                          onClick={() => { playSoundEffect('click'); setActiveLoreContext('artifact-prism'); }}
                          className="text-[#ffabf3] hover:text-[#fe00fe] font-bold border-b border-dashed border-[#ffabf3] cursor-pointer"
                        >
                          Chromatic Prism ✦
                        </button>
                        . High-tier curators first noticed the drift in the 12th sector, where the logic of the{' '}
                        <button 
                          onClick={() => { playSoundEffect('click'); setActiveLoreContext('loc-neo-grid'); }}
                          className="text-[#ffabf3] hover:text-[#fe00fe] font-bold border-b border-dashed border-[#ffabf3] cursor-pointer"
                        >
                          Neo-Tokyo Grid ✦
                        </button>{' '}
                        usually held firm. For centuries, the matrix had been an unshakable pillar of our digital existence, maintained by the elusive{' '}
                        <button 
                          onClick={() => { playSoundEffect('click'); setActiveLoreContext('char-archivist'); }}
                          className="text-[#ffabf3] hover:text-[#fe00fe] font-bold border-b border-dashed border-[#ffabf3] cursor-pointer"
                        >
                          The Archivist ✦
                        </button>
                        .
                      </p>

                      {/* Data Fragment Graphic */}
                      <div className="relative overflow-hidden rounded-2xl aspect-video bg-[#1c1b1c] border border-[#3b494b]/50 group">
                        <img 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuADy0fQRgCGT0_Ubtuk8PkrPxHOyj55cJhjsWjxxWezIpIIzaz2KYf3Fy_OHI4_FGAg6jZ3Hhb7GTSJdxCCJ5PcFrUtQLQ5l11QsknZBltvfMcxystTMGSQ-QyvIy-W-1A4i5sbIngr291oVvgkB7yrqfjheM8D26z5rrMhOT5uyvCWsHxbUyvP_YNcKBtoMp5ueQdLhcqEMpDDeD1-EviD1IQBt486Z1-uztqXouumf6UQS_7NRQwJUscdTV7qv63B6TzKvFf-c2JB" 
                          alt="Grid Drift Analysis"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                          <div>
                            <span className="font-mono text-[10px] text-[#00dbe9] font-bold tracking-widest block mb-1">
                              DATA FRAGMENT 09-B // MagnopVS
                            </span>
                            <h3 className="font-audiowide text-xl text-white uppercase">Grid Drift Analysis</h3>
                          </div>
                        </div>
                      </div>

                      <p>
                        Witnesses describe the "Void Leak" as a shimmering curtain of absolute zero. It didn't just delete data; it rewrote the history of the objects it touched. An antique hover-bike might suddenly become a{' '}
                        <button 
                          onClick={() => { playSoundEffect('click'); setActiveLoreContext('artifact-steed'); }}
                          className="text-[#ffabf3] hover:text-[#fe00fe] font-bold border-b border-dashed border-[#ffabf3] cursor-pointer"
                        >
                          Mechanical Steed ✦
                        </button>{' '}
                        from a previous epoch. The chaos was infectious. As the desync spread, the very architecture of the sprawl began to fold into non-Euclidean shapes.
                      </p>

                      <blockquote className="my-8 p-6 bg-[#1c1b1c]/90 border-r-4 border-[#00dbe9] rounded-2xl relative overflow-hidden font-orbitron">
                        <Quote className="absolute top-2 right-2 w-16 h-16 text-[#00dbe9]/10 pointer-events-none" />
                        <p className="font-audiowide text-lg sm:text-xl text-[#7df4ff] mb-2">
                          "The Matrix is not a cage, it is a canvas that has forgotten its painter."
                        </p>
                        <cite className="font-mono text-xs text-[#ffabf3] block text-right">
                          — Anonymous Fragment // MagnopVS
                        </cite>
                      </blockquote>

                      <p>
                        The question remains: who triggered the sequence? Some point to the{' '}
                        <button 
                          onClick={() => { playSoundEffect('click'); setActiveLoreContext('cult-rabbit'); }}
                          className="text-[#ffabf3] hover:text-[#fe00fe] font-bold border-b border-dashed border-[#ffabf3] cursor-pointer"
                        >
                          Quantum Rabbit Cult ✦
                        </button>
                        , while others believe it was a natural evolution of a saturated network. Regardless of the cause, the Artifacts recovered from the site—like the{' '}
                        <button 
                          onClick={() => { playSoundEffect('click'); setActiveLoreContext('artifact-key'); }}
                          className="text-[#ffabf3] hover:text-[#fe00fe] font-bold border-b border-dashed border-[#ffabf3] cursor-pointer"
                        >
                          Obsidian Key ✦
                        </button>
                        —now possess properties that defy our current understanding of the Matrix.
                      </p>
                    </div>

                    {/* INTERACTION PROMPT: LOG DATA ENTRY */}
                    <div className="p-1 bg-gradient-to-r from-[#00dbe9]/40 to-[#ffabf3]/40 rounded-2xl">
                      <div className="bg-[#1c1b1c] p-8 rounded-xl text-center space-y-4">
                        <div className="w-12 h-12 rounded-full bg-[#00dbe9]/20 text-[#00dbe9] flex items-center justify-center mx-auto border border-[#00dbe9]/40">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <h4 className="font-audiowide text-2xl text-white uppercase">Sync Your Narrative</h4>
                        <p className="text-xs sm:text-sm text-[#b9cacb] max-w-md mx-auto">
                          Contribute your observations to the Lore Network in MagnopVS and earn Quantum Credits.
                        </p>
                        <button 
                          onClick={() => {
                            playSoundEffect('level');
                            addXpAndMp(150, 75);
                            alert("¡Registro enviado al Lore Network de MagnopVS! +150 XP / +75 MP otorgados.");
                          }}
                          className="px-8 py-3.5 bg-[#00dbe9] text-[#00363a] font-mono text-xs font-bold rounded-full hover:bg-[#7df4ff] hover:shadow-[0_0_20px_rgba(0,219,233,0.5)] transition-all cursor-pointer uppercase"
                        >
                          LOG DATA ENTRY (+150 XP)
                        </button>
                      </div>
                    </div>
                  </article>

                  {/* Right Side Context Panel */}
                  <aside className="col-span-12 xl:col-span-3 space-y-6">
                    {activeLoreContext === 'artifact-prism' && (
                      <div className="bg-[#1c1b1c] rounded-2xl overflow-hidden border border-[#00dbe9]/40 p-6 space-y-4 shadow-xl animate-fade-in font-mono">
                        <div className="relative h-44 rounded-xl overflow-hidden bg-[#2a2a2b]">
                          <img 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtPOvg4lk34rjhzO_37qaPlhq0-s_TOAGm4L4ZS23aqRM-nq3AXKmD91A_5yYXkZWs5wNvbfLCPVO_syyftWlgSVAGp5YnDXpodBE7F-JVaqs4tm5zhCxDnWNUId4sGKmD2U1WMf78qNWGY2gJcv90bOiIB9hPxTmZRpQgRlb8MeFMignfgoy6sX0OedLj7ZM-z0MGu8yYQ00z7A2QFayxAO41TdjOK9sJZoQA3I27m5p1gTJCMywawSiT5hWhYrexzYfNW8edf0mp" 
                            alt="Chromatic Prism"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 right-3 px-2 py-1 bg-black/70 backdrop-blur rounded text-[9px] font-bold text-[#00dbe9] border border-[#00dbe9]/40">
                            LVL 2 ARTIFACT
                          </div>
                        </div>
                        <div>
                          <h3 className="font-audiowide text-xl text-[#00dbe9] uppercase">Chromatic Prism</h3>
                          <span className="text-[10px] text-[#ffabf3] font-bold uppercase block mb-2">Type: Reality Anchor</span>
                          <p className="text-xs text-[#b9cacb] leading-relaxed font-sans">
                            A crystallized fragment of the 2049 Desynchronization Event. Curators use this to stabilize local logic loops within volatile sectors of the Neon Web in MagnopVS.
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="bg-[#131314] p-3 rounded-xl border border-[#3b494b]/40">
                            <span className="text-[9px] text-[#00dbe9] block font-bold uppercase">STABILITY</span>
                            <span className="text-sm font-bold text-white">94.2%</span>
                          </div>
                          <div className="bg-[#131314] p-3 rounded-xl border border-[#3b494b]/40">
                            <span className="text-[9px] text-[#00dbe9] block font-bold uppercase">RESONANCE</span>
                            <span className="text-sm font-bold text-[#15ffd1]">ACTIVE</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeLoreContext === 'loc-neo-grid' && (
                      <div className="bg-[#1c1b1c] rounded-2xl overflow-hidden border border-[#15ffd1]/40 p-6 space-y-4 shadow-xl animate-fade-in font-mono">
                        <h3 className="font-audiowide text-xl text-[#15ffd1] uppercase">Neo-Tokyo Grid</h3>
                        <span className="text-[10px] text-[#cee5ff] font-bold uppercase block">SECTOR 12 // MagnopVS</span>
                        <p className="text-xs text-[#b9cacb] leading-relaxed font-sans">
                          The primary megastructure nexus of MagnopVS. Houses millions of active memory shards and neural relay stations.
                        </p>
                      </div>
                    )}

                    {activeLoreContext === 'char-archivist' && (
                      <div className="bg-[#1c1b1c] rounded-2xl overflow-hidden border border-[#ffabf3]/40 p-6 space-y-4 shadow-xl animate-fade-in font-mono">
                        <h3 className="font-audiowide text-xl text-[#ffabf3] uppercase">The Archivist</h3>
                        <span className="text-[10px] text-[#cee5ff] font-bold uppercase block">PRIMARY CUSTODIAN</span>
                        <p className="text-xs text-[#b9cacb] leading-relaxed font-sans">
                          Eternal sentinel of the Quantvm Matrix archives in MagnopVS. Oversees the recording and synchronization of all multiverse sagas.
                        </p>
                      </div>
                    )}

                    {!activeLoreContext && (
                      <div className="bg-[#1c1b1c]/50 p-8 rounded-2xl border-2 border-dashed border-[#3b494b]/40 text-center font-mono space-y-2">
                        <Info className="w-8 h-8 text-[#00dbe9] mx-auto opacity-50" />
                        <p className="text-xs text-[#849495] uppercase">
                          Awaiting Data Selection...<br />Click highlighted lore links for insights.
                        </p>
                      </div>
                    )}

                    {/* Related Entities Card */}
                    <div className="bg-[#1c1b1c] p-6 rounded-2xl border border-[#353436] space-y-4 font-mono">
                      <h4 className="text-xs text-[#b9cacb] font-bold uppercase flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-[#00dbe9]" />
                        <span>Related Entities</span>
                      </h4>
                      <div className="space-y-3">
                        <div 
                          onClick={() => setActiveLoreContext('char-archivist')}
                          className="flex items-center gap-3 p-2 hover:bg-[#353436]/50 rounded-xl cursor-pointer transition-all"
                        >
                          <div className="w-8 h-8 rounded-full bg-[#00dbe9]/20 text-[#00dbe9] flex items-center justify-center border border-[#00dbe9]/30">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">The Archivist</p>
                            <span className="text-[10px] text-[#849495]">Primary Custodian</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </aside>
                </div>

                {/* BOTTOM STICKY READER DOCK */}
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4">
                  <div className="bg-[#1c1b1c]/95 backdrop-blur-2xl p-4 rounded-2xl border border-[#00dbe9]/40 shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
                    {/* Left: Reading Progress */}
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-[#00dbe9] font-bold uppercase">READING PROGRESS</span>
                        <div className="flex items-center gap-2">
                          <div className="w-28 h-2 bg-[#131314] rounded-full overflow-hidden border border-[#3b494b]">
                            <div className="h-full bg-[#00dbe9] shadow-[0_0_8px_#00dbe9]" style={{ width: `${loreReadingProgress}%` }} />
                          </div>
                          <span className="text-[#00dbe9] font-bold">{loreReadingProgress}%</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          playSoundEffect('quest');
                          addXpAndMp(100, 50);
                          alert("Fragmento de lectura guardado en tu perfil de MagnopVS. +100 XP / +50 MP.");
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 bg-[#201f20] border border-[#353436] rounded-xl text-[#ffabf3] hover:bg-[#ffabf3]/20 transition-all cursor-pointer font-bold uppercase text-[10px]"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>SAVE FRAGMENT</span>
                      </button>
                    </div>

                    {/* Center: Hidden Carrot Game Protocol */}
                    <button 
                      onClick={() => {
                        playSoundEffect('level');
                        addXpAndMp(100, 50);
                        alert("QUEST UPDATED: You've initiated the Carrot Search protocol in MagnopVS! +100 XP / +50 MP awarded!");
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-[#00dbe9]/10 border border-[#00dbe9]/40 rounded-xl text-[#00dbe9] hover:bg-[#00dbe9]/20 transition-all cursor-pointer group"
                    >
                      <Carrot className="w-4 h-4 text-[#00dbe9] animate-pulse group-hover:rotate-12 transition-transform" />
                      <span className="text-[10px] font-bold uppercase">HIDDEN CARROT DETECTED IN MARGINS</span>
                    </button>

                    {/* Right: Quick Navigation Tabs */}
                    <div className="flex items-center gap-3 text-[#b9cacb]">
                      <button onClick={() => setMagzineSubTab('feed')} className="hover:text-[#00dbe9] transition-colors cursor-pointer text-[10px] uppercase font-bold">
                        LIBRARY
                      </button>
                      <span>•</span>
                      <button onClick={() => setMagzineSubTab('explorer')} className="hover:text-[#00dbe9] transition-colors cursor-pointer text-[10px] uppercase font-bold">
                        EXPLORER
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-VIEW 3: EXPLORER TERMINAL */}
            {magzineSubTab === 'explorer' && (
              <div className="max-w-7xl mx-auto space-y-12 animate-fade-in font-mono">
                {/* HERO HEADER */}
                <section className="relative py-6 space-y-3 border-b border-[#3b494b]/40">
                  <div className="flex items-center gap-2 text-[#ffabf3] text-xs uppercase tracking-widest font-bold">
                    <Terminal className="w-4 h-4" />
                    <span>Quantvm Matrix Research Node // MagnopVS</span>
                  </div>
                  <h1 className="font-audiowide text-3xl sm:text-5xl text-[#00dbe9] uppercase tracking-tight">
                    Explorer Terminal
                  </h1>
                  <p className="text-xs sm:text-sm text-[#b9cacb] max-w-2xl font-sans leading-relaxed">
                    Access the definitive repository of multiversal knowledge. Query the matrix, navigate the eras, and reveal the hidden connections between realms in MagnopVS.
                  </p>
                </section>

                {/* COMMAND SEARCH BAR */}
                <section className="max-w-4xl mx-auto">
                  <div className="p-1 rounded-2xl bg-gradient-to-r from-[#00dbe9]/30 via-[#ffabf3]/30 to-[#00dbe9]/30 shadow-[0_0_20px_rgba(0,219,233,0.2)]">
                    <div className="bg-[#131314] rounded-xl p-4 flex items-center gap-4 border border-[#00dbe9]/20">
                      <span className="text-[#00dbe9] font-bold text-lg">~</span>
                      <span className="text-[#ffabf3] font-bold text-xs uppercase">matrix_query:</span>
                      <input 
                        type="text"
                        value={explorerQuery}
                        onChange={(e) => setExplorerQuery(e.target.value)}
                        placeholder="enter saga name, artifact ID, or character entity..."
                        className="bg-transparent border-none focus:outline-none text-[#00dbe9] text-xs font-mono w-full placeholder-[#849495]"
                      />
                      <div className="flex items-center gap-2 text-[10px] text-[#849495] shrink-0">
                        <span className="px-2 py-0.5 bg-[#201f20] border border-[#3b494b] rounded text-[#b9cacb] font-bold">CMD + K</span>
                        <span className="w-2 h-2 rounded-full bg-[#15ffd1] animate-ping" />
                        <span className="text-[#15ffd1] font-bold">SYNCED</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* MULTIVERSAL TIMELINE (TEMPORAL ERAS) */}
                <section className="space-y-6">
                  <div className="flex justify-between items-end border-b border-[#3b494b]/40 pb-3">
                    <div>
                      <h2 className="font-audiowide text-xl sm:text-2xl text-white flex items-center gap-3 uppercase">
                        <Hourglass className="w-5 h-5 text-[#00dbe9]" />
                        <span>Temporal Eras</span>
                      </h2>
                      <p className="text-xs text-[#b9cacb] mt-0.5">
                        Chronological navigation of the Quantvm continuity in MagnopVS
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Chaos Era */}
                    <div 
                      onClick={() => {
                        playSoundEffect('click');
                        setSelectedTemporalEra('chaos');
                        alert("Era Chaos seleccionada en MagnopVS. Moledores primordiales activos.");
                      }}
                      className={`p-6 rounded-2xl bg-[#1c1b1c] border transition-all cursor-pointer group relative overflow-hidden ${
                        selectedTemporalEra === 'chaos' ? 'border-[#00dbe9] shadow-[0_0_20px_rgba(0,219,233,0.25)]' : 'border-[#353436] hover:border-[#00dbe9]/50'
                      }`}
                    >
                      <span className="text-[10px] text-[#ffabf3] font-bold block mb-1">0000 - 1500 AE</span>
                      <h3 className="font-audiowide text-2xl text-white group-hover:text-[#00dbe9] transition-colors mb-2">Chaos</h3>
                      <p className="text-xs text-[#b9cacb] font-sans line-clamp-3 leading-relaxed mb-4">
                        The primordial surge. Before the matrix stabilized, energy was raw and narratives were fluid.
                      </p>
                      <div className="flex justify-between items-center text-[10px] pt-3 border-t border-[#353436] font-bold text-[#00dbe9]">
                        <span>12 SAGAS</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Source Era */}
                    <div 
                      onClick={() => {
                        playSoundEffect('click');
                        setSelectedTemporalEra('source');
                        alert("Era Source seleccionada en MagnopVS. Descubrimiento del nexo central.");
                      }}
                      className={`p-6 rounded-2xl bg-[#1c1b1c] border transition-all cursor-pointer group relative overflow-hidden ${
                        selectedTemporalEra === 'source' ? 'border-[#00dbe9] shadow-[0_0_20px_rgba(0,219,233,0.25)]' : 'border-[#353436] hover:border-[#00dbe9]/50'
                      }`}
                    >
                      <span className="text-[10px] text-[#ffabf3] font-bold block mb-1">1501 - 2800 AE</span>
                      <h3 className="font-audiowide text-2xl text-[#00dbe9] mb-2">Source</h3>
                      <p className="text-xs text-[#b9cacb] font-sans line-clamp-3 leading-relaxed mb-4">
                        The Great Anchor. Discovery of the central nexus and Cosmic White Rabbit records.
                      </p>
                      <div className="flex justify-between items-center text-[10px] pt-3 border-t border-[#353436] font-bold text-[#00dbe9]">
                        <span>48 SAGAS</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Synthesis Era */}
                    <div 
                      onClick={() => {
                        playSoundEffect('click');
                        setSelectedTemporalEra('synthesis');
                        alert("Era Synthesis seleccionada en MagnopVS. Fusión bio-digital completa.");
                      }}
                      className={`p-6 rounded-2xl bg-[#1c1b1c] border transition-all cursor-pointer group relative overflow-hidden ${
                        selectedTemporalEra === 'synthesis' ? 'border-[#00dbe9] shadow-[0_0_20px_rgba(0,219,233,0.25)]' : 'border-[#353436] hover:border-[#00dbe9]/50'
                      }`}
                    >
                      <span className="text-[10px] text-[#ffabf3] font-bold block mb-1">2801 - 3500 AE</span>
                      <h3 className="font-audiowide text-2xl text-white group-hover:text-[#00dbe9] transition-colors mb-2">Synthesis</h3>
                      <p className="text-xs text-[#b9cacb] font-sans line-clamp-3 leading-relaxed mb-4">
                        The merging of biological and digital narratives across overlapping lore networks.
                      </p>
                      <div className="flex justify-between items-center text-[10px] pt-3 border-t border-[#353436] font-bold text-[#00dbe9]">
                        <span>92 SAGAS</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Quantvm Era */}
                    <div 
                      onClick={() => {
                        playSoundEffect('click');
                        setSelectedTemporalEra('quantvm');
                        alert("Era Quantvm seleccionada en MagnopVS. Sincronización multiversal total.");
                      }}
                      className={`p-6 rounded-2xl bg-[#1c1b1c] border transition-all cursor-pointer group relative overflow-hidden ${
                        selectedTemporalEra === 'quantvm' ? 'border-[#00dbe9] shadow-[0_0_20px_rgba(0,219,233,0.25)]' : 'border-[#353436] hover:border-[#00dbe9]/50'
                      }`}
                    >
                      <span className="text-[10px] text-[#ffabf3] font-bold block mb-1">3501 - PRESENT</span>
                      <h3 className="font-audiowide text-2xl text-white group-hover:text-[#00dbe9] transition-colors mb-2">Quantvm</h3>
                      <p className="text-xs text-[#b9cacb] font-sans line-clamp-3 leading-relaxed mb-4">
                        Current temporal state. Total synchronization of all known realms in MagnopVS.
                      </p>
                      <div className="flex justify-between items-center text-[10px] pt-3 border-t border-[#353436] font-bold text-[#00dbe9]">
                        <span>156 SAGAS</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </section>

                {/* KNOWLEDGE GRAPH & WORLD MAP BENTO GRID */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Knowledge Graph (Entity Nexus) */}
                  <div className="lg:col-span-7 bg-[#131314] border border-[#3b494b]/50 rounded-2xl p-6 flex flex-col justify-between min-h-[420px] shadow-2xl relative overflow-hidden">
                    <div className="flex justify-between items-center border-b border-[#3b494b]/40 pb-4 z-10">
                      <div className="flex items-center gap-3">
                        <Share2 className="w-5 h-5 text-[#ffabf3]" />
                        <h3 className="font-audiowide text-xl text-white uppercase">Entity Nexus</h3>
                      </div>
                      <div className="flex gap-3 text-[10px] font-bold">
                        <span className="text-[#00dbe9] flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#00dbe9]" /> CHARACTERS
                        </span>
                        <span className="text-[#ffabf3] flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#ffabf3]" /> FACTIONS
                        </span>
                        <span className="text-[#b9cacb] flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#b9cacb]" /> EVENTS
                        </span>
                      </div>
                    </div>

                    {/* Interactive Node Canvas Area */}
                    <div className="relative h-72 bg-[#0e0e0f] rounded-xl border border-[#353436] my-4 flex items-center justify-center p-6 overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(#00dbe9_1px,transparent_1px)] opacity-10 [background-size:24px_24px]" />
                      
                      {/* Interactive Nodes */}
                      <div className="relative w-full h-full">
                        <div 
                          onClick={() => {
                            playSoundEffect('quest');
                            setSelectedEntityNode('Neo-Prime');
                            addXpAndMp(50, 25);
                          }}
                          className={`absolute top-1/4 left-1/4 p-3 bg-[#1c1b1c] rounded-xl border cursor-pointer transition-all hover:scale-110 ${
                            selectedEntityNode === 'Neo-Prime' ? 'border-[#00dbe9] shadow-[0_0_15px_rgba(0,219,233,0.5)]' : 'border-[#353436]'
                          }`}
                        >
                          <div className="flex items-center gap-2 text-xs font-bold text-[#00dbe9]">
                            <span className="w-2 h-2 bg-[#00dbe9] rounded-full animate-ping" />
                            <span>Neo-Prime</span>
                          </div>
                        </div>

                        <div 
                          onClick={() => {
                            playSoundEffect('quest');
                            setSelectedEntityNode('Vortex Order');
                            addXpAndMp(50, 25);
                          }}
                          className={`absolute bottom-1/3 right-1/4 p-3 bg-[#1c1b1c] rounded-xl border cursor-pointer transition-all hover:scale-110 ${
                            selectedEntityNode === 'Vortex Order' ? 'border-[#ffabf3] shadow-[0_0_15px_rgba(255,171,243,0.5)]' : 'border-[#353436]'
                          }`}
                        >
                          <div className="flex items-center gap-2 text-xs font-bold text-[#ffabf3]">
                            <span className="w-2 h-2 bg-[#ffabf3] rounded-full" />
                            <span>Vortex Order</span>
                          </div>
                        </div>

                        <div 
                          onClick={() => {
                            playSoundEffect('quest');
                            setSelectedEntityNode('The Rift Incident');
                            addXpAndMp(50, 25);
                          }}
                          className={`absolute top-1/2 right-1/3 p-3 bg-[#1c1b1c] rounded-xl border cursor-pointer transition-all hover:scale-110 ${
                            selectedEntityNode === 'The Rift Incident' ? 'border-[#b9cacb] shadow-[0_0_15px_rgba(185,202,203,0.5)]' : 'border-[#353436]'
                          }`}
                        >
                          <div className="flex items-center gap-2 text-xs font-bold text-[#b9cacb]">
                            <span className="w-2 h-2 bg-[#b9cacb] rounded-full" />
                            <span>The Rift Incident</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-[#b9cacb] z-10 pt-2 border-t border-[#3b494b]/40">
                      <span>SELECTED NODE: <strong className="text-[#00dbe9]">{selectedEntityNode}</strong> (+50 XP)</span>
                      <button 
                        onClick={() => alert("Mostrando conexiones completas del mapa neuro-conceptual de MagnopVS.")}
                        className="text-[#ffabf3] font-bold hover:underline cursor-pointer uppercase text-[10px]"
                      >
                        EXPAND GRAPH
                      </button>
                    </div>
                  </div>

                  {/* World Map & Sensors Sidebar */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-[#131314] border border-[#3b494b]/50 rounded-2xl p-6 space-y-4 shadow-2xl">
                      <div className="flex justify-between items-center">
                        <h3 className="font-audiowide text-lg text-white uppercase flex items-center gap-2">
                          <Globe className="w-5 h-5 text-[#00dbe9]" />
                          <span>Realm Tactical Map</span>
                        </h3>
                        <span className="text-[10px] text-[#15ffd1] font-bold bg-[#15ffd1]/10 px-2.5 py-1 rounded-full border border-[#15ffd1]/30">
                          REAL-TIME SCAN
                        </span>
                      </div>

                      <div className="relative h-44 rounded-xl overflow-hidden border border-[#353436]">
                        <img 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3uKx7lm_v7Chci88dmS0owHx3vJebzJMyLo_7iuU7gfS0-QMnuIfCR5945ci6OfGXU9eoRCpk4aQBn60RZuod6xR0BC8rSk2hPVFp0G7VIN0AR2yMd7fUVQtmN-h_iuhLzlQeTcMwqAYv0rVcBIuJA00AcVu_7aciWCMMgB8f17zUEeHxNiNI4ngXUnD6IK1VoJTneH-g1bAjA62QMN0FVn38UiM2RwnRumUNr7bLl3srrSig0BFdsWGaDoc5neMADx4GIdidnVsz" 
                          alt="Tactical Map" 
                          className="w-full h-full object-cover brightness-75"
                        />
                        <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur p-2 rounded-lg border border-[#00dbe9]/30 text-[10px]">
                          <p className="text-[#00dbe9] font-bold">COORD: 45.02 // 119.88</p>
                          <p className="text-[#b9cacb]">SECTOR: OMEGA-7 (THE VOID)</p>
                        </div>
                      </div>

                      <div className="bg-[#1c1b1c] p-3 rounded-xl border border-[#353436] flex items-center gap-3">
                        <Compass className="w-8 h-8 text-[#00dbe9] shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-white uppercase">Current Expedition: The Obsidian Gate</p>
                          <p className="text-[10px] text-[#b9cacb] font-sans">Investigating Synthesis Era anomalies in MagnopVS.</p>
                        </div>
                      </div>
                    </div>

                    {/* Sensor Stats */}
                    <div className="grid grid-cols-3 gap-3 bg-[#131314] p-4 rounded-2xl border border-[#353436] text-center font-mono">
                      <div>
                        <span className="text-[9px] text-[#849495] font-bold block uppercase">REALMS</span>
                        <span className="text-xl font-audiowide text-[#00dbe9]">12</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-[#849495] font-bold block uppercase">ENTITIES</span>
                        <span className="text-xl font-audiowide text-[#ffabf3]">1.4k</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-[#849495] font-bold block uppercase">SYNC</span>
                        <span className="text-xl font-audiowide text-[#15ffd1]">99%</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* SAGAS INDEX */}
                <section className="space-y-6 pt-6 border-t border-[#3b494b]/40">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h2 className="font-audiowide text-2xl text-white uppercase flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-[#ffabf3]" />
                        <span>Sagas Index</span>
                      </h2>
                      <p className="text-xs text-[#b9cacb]">
                        Categorized directory of all narrative universes in MagnopVS
                      </p>
                    </div>

                    {/* Filter Tag Buttons */}
                    <div className="flex flex-wrap gap-2 p-1 bg-[#1c1b1c] rounded-xl border border-[#353436]">
                      {(['ALL', 'CYBERPUNK', 'ETHEREAL', 'VOID-BORN', 'GALACTIC'] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => { playSoundEffect('click'); setExplorerFilter(filter); }}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer uppercase ${
                            explorerFilter === filter
                              ? 'bg-[#00dbe9] text-[#00363a]'
                              : 'text-[#b9cacb] hover:text-white'
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Saga Card 1 */}
                    <div className="bg-[#1c1b1c] border border-[#353436] rounded-2xl overflow-hidden hover:border-[#00dbe9] transition-all group flex flex-col justify-between shadow-xl">
                      <div className="relative h-44 overflow-hidden">
                        <img 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrJ-ZCVEYNmGIE43cmwbKUPim1rWLGsLFAuWQALclr10SwIgQ3d9Ss7WLo4j63ocH7BHUzXATuwCvo_FEwhtwsLvNIYU2fguCymbFx5AnheYE9bV-BJEMSkaavqNGAhLfiTS9OPcRAbAsJVes67BsdjRn4mS2iRg8AOZm8-b0I88Ro6PZszpvy4tyWMldx2jyQRmuGGM5LogkPH0HZIbavWC4d4mfROGrk2u1U3mpDLrjomb0nLRFT2zaqvr0IrS4Bm0SgAxQ722jO" 
                          alt="Chromium Spirits" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 px-2 py-0.5 bg-[#00dbe9]/20 backdrop-blur text-[#00dbe9] text-[9px] font-bold rounded border border-[#00dbe9]/40">
                          CANON
                        </div>
                      </div>
                      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-audiowide text-lg text-white group-hover:text-[#00dbe9] transition-colors uppercase">Chromium Spirits</h4>
                          <p className="text-xs text-[#b9cacb] font-sans leading-relaxed mt-1">
                            Where rogue AI fragments inhabit abandoned ceremonial vessels of the old world.
                          </p>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-[#353436] text-[10px] text-[#ffabf3] font-bold">
                          <span>REALM: NEXUS-12</span>
                          <button 
                            onClick={() => {
                              playSoundEffect('level');
                              addXpAndMp(120, 60);
                              setMagzineSubTab('reader');
                            }}
                            className="px-3 py-1.5 bg-[#00dbe9] text-[#00363a] rounded-lg font-bold hover:bg-[#7df4ff] cursor-pointer uppercase flex items-center gap-1"
                          >
                            <span>EXPLORE (+120 XP)</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Saga Card 2 */}
                    <div className="bg-[#1c1b1c] border border-[#353436] rounded-2xl overflow-hidden hover:border-[#ffabf3] transition-all group flex flex-col justify-between shadow-xl">
                      <div className="relative h-44 overflow-hidden">
                        <img 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeTKeBxG9sekMwcs70jpgWvsZRXy5YK0Lb9pH5blrCuYQ_lkws_CV6KVik2ogZyMm0pofhkQhjZv1BgCs_M5CVtHQt1kHGlV8nEEj8lFYKbgjEG96976sSr_nBRG3eoBbW8YacMe-Yb6_cWsauxHDD9bPg3tL_4F371__wYv948DJIjkSyzNki2ESbffaiFjxGZYYMbi_OdF6xNlcwy-PFYl2lWldQGZjT__aNdL35xdHBfdW3rK7FQ4Y2M2uTUj-CQZ49HTzdaEvU" 
                          alt="The Coral Spires" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 px-2 py-0.5 bg-[#ffabf3]/20 backdrop-blur text-[#ffabf3] text-[9px] font-bold rounded border border-[#ffabf3]/40">
                          LEGACY
                        </div>
                      </div>
                      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-audiowide text-lg text-white group-hover:text-[#ffabf3] transition-colors uppercase">The Coral Spires</h4>
                          <p className="text-xs text-[#b9cacb] font-sans leading-relaxed mt-1">
                            Ancient memory banks crystallized into vast underwater ecosystems in MagnopVS.
                          </p>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-[#353436] text-[10px] text-[#ffabf3] font-bold">
                          <span>REALM: ABYSS-9</span>
                          <button 
                            onClick={() => {
                              playSoundEffect('level');
                              addXpAndMp(120, 60);
                              setMagzineSubTab('reader');
                            }}
                            className="px-3 py-1.5 bg-[#ffabf3] text-[#5b005b] rounded-lg font-bold hover:bg-[#ffd7f5] cursor-pointer uppercase flex items-center gap-1"
                          >
                            <span>EXPLORE (+120 XP)</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Saga Card 3 */}
                    <div className="bg-[#1c1b1c] border border-[#353436] rounded-2xl overflow-hidden hover:border-[#15ffd1] transition-all group flex flex-col justify-between shadow-xl">
                      <div className="relative h-44 overflow-hidden">
                        <img 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuCaZ6nPhR6rW9s5opl9mKXC76j_2q57mnWpcdkN2N7J3HF7FgjF18p3YJY_NR9gbY4MRN6JJta8lVCHtOXlhvzxH8cmntvXtMHVsu49sazgAVp35EXPtox0YbIZgVjKWdXBKvFwSGXUjcuxrDAU_fuLRFjHR2Njrhrx0sYM8zLMBy2ZxkM59ProMt1hZgD-6tKUyH7aJCRWQU7CheOE-NR04hhf8w6CnazIrXxN7fRGKBS5tIuvk_MXxlqHdkU1tI9YGTTzvW60qA" 
                          alt="Iron Sun Protocols" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 px-2 py-0.5 bg-[#15ffd1]/20 backdrop-blur text-[#15ffd1] text-[9px] font-bold rounded border border-[#15ffd1]/40">
                          ARCHIVED
                        </div>
                      </div>
                      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-audiowide text-lg text-white group-hover:text-[#15ffd1] transition-colors uppercase">Iron Sun Protocols</h4>
                          <p className="text-xs text-[#b9cacb] font-sans leading-relaxed mt-1">
                            A dying solar system where nations war over thermal energy packets in MagnopVS.
                          </p>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-[#353436] text-[10px] text-[#15ffd1] font-bold">
                          <span>REALM: CORE-0</span>
                          <button 
                            onClick={() => {
                              playSoundEffect('level');
                              addXpAndMp(120, 60);
                              setMagzineSubTab('reader');
                            }}
                            className="px-3 py-1.5 bg-[#15ffd1] text-[#002018] rounded-lg font-bold hover:bg-[#86ffe7] cursor-pointer uppercase flex items-center gap-1"
                          >
                            <span>EXPLORE (+120 XP)</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* SUB-VIEW 4: MAGNOSCROLL STUDIO */}
            {magzineSubTab === 'studio' && (
              <div className="max-w-7xl mx-auto space-y-10 animate-fade-in font-mono pb-24">
                {/* STUDIO HERO BANNER */}
                <section className="relative p-8 rounded-3xl bg-[#131314] border border-[#15ffd1]/40 shadow-[0_0_35px_rgba(21,255,209,0.15)] overflow-hidden">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-[#15ffd1]/5 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                    <div className="space-y-4 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="px-3 py-1 bg-[#15ffd1]/10 border border-[#15ffd1]/30 text-[#15ffd1] text-[10px] font-bold rounded-full uppercase tracking-widest flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 animate-pulse" />
                          <span>ENGINE STATUS: OPERATIONAL v4.0</span>
                        </span>
                        <span className="text-xs text-[#849495]">MAGNOSCROLL SYSTEM // MagnopVS</span>
                      </div>

                      <h1 className="font-audiowide text-3xl sm:text-5xl text-[#15ffd1] uppercase tracking-tight">
                        MagZine Studio
                      </h1>

                      <p className="text-xs sm:text-sm text-[#b9cacb] font-sans leading-relaxed">
                        Browse the 10 core semantic layers of the MagnoScroll architecture in MagnopVS. Each Frame is a JSON-driven container designed for high-fidelity interactive storytelling.
                      </p>

                      <div className="flex flex-wrap items-center gap-4 pt-2">
                        <button
                          onClick={() => {
                            playSoundEffect('click');
                            setStudioMode('architect');
                          }}
                          className={`px-5 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-2 uppercase ${
                            studioMode === 'architect'
                              ? 'bg-[#15ffd1] text-[#003829] shadow-[0_0_20px_rgba(21,255,209,0.5)]'
                              : 'bg-[#1c1b1c] border border-[#353436] text-[#b9cacb] hover:text-white'
                          }`}
                        >
                          <Code className="w-4 h-4" />
                          <span>CHAPTER ARCHITECT</span>
                        </button>

                        <button
                          onClick={() => {
                            playSoundEffect('click');
                            setStudioMode('archive');
                          }}
                          className={`px-5 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-2 uppercase ${
                            studioMode === 'archive'
                              ? 'bg-[#15ffd1] text-[#003829] shadow-[0_0_20px_rgba(21,255,209,0.5)]'
                              : 'bg-[#1c1b1c] border border-[#353436] text-[#b9cacb] hover:text-white'
                          }`}
                        >
                          <Layers className="w-4 h-4" />
                          <span>FRAME ARCHIVE (10 LAYERS)</span>
                        </button>

                        <button
                          onClick={() => {
                            playSoundEffect('quest');
                            addXpAndMp(200, 100);
                            alert("¡JSON de MagnoScroll ejecutado con éxito en MagnopVS! +200 XP / +100 MP otorgados.");
                          }}
                          className="px-5 py-3 bg-[#1c1b1c] border border-[#15ffd1]/30 text-[#15ffd1] hover:bg-[#15ffd1]/10 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-2 uppercase"
                        >
                          <Rocket className="w-4 h-4" />
                          <span>EXECUTE JSON (+200 XP)</span>
                        </button>
                      </div>
                    </div>

                    {/* ENGINE GUIDE (THE RABBIT / CBC) */}
                    <div className="relative group p-6 bg-[#1c1b1c]/90 border border-[#15ffd1]/30 rounded-2xl flex items-center gap-4 max-w-sm shrink-0 backdrop-blur-xl">
                      <div className="relative w-20 h-20 shrink-0">
                        <img 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDC4Luv-9MEcCYmH3sVu7wcrdkFiemXhku0kanjmzOv-bssn49a2JbwSwcWVDFurSVAIwajqhjm6RBuqwfpgWub5wAuk_uMZc4bKwJaDSlUp0TZ7tJOi6NqhwcLPnb-OQIf4qTQAWMmRpQc4vPgGN6XwzXoZmIFSZIAYlWkwrNcvNSRT9lVgJBK5z093lcGm-cl2xGjs_JrOpooU3_00NA_j0E124ZtXqw8E3fAy7eDHfWtHhjmxXcO9-1oK9OPabR0lYi_IoVbr3Oa" 
                          alt="MagnoScroll Rabbit"
                          className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(21,255,209,0.4)] group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-[#15ffd1] font-bold block uppercase">ENGINE GUIDE</span>
                        <p className="text-xs text-white font-bold">"Ready to compile your first chapter in MagnopVS?"</p>
                        <div className="w-full bg-[#131314] h-1.5 rounded-full overflow-hidden border border-[#353436] mt-2">
                          <div className="bg-[#15ffd1] h-full w-3/4 shadow-[0_0_8px_#15ffd1]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* MODE 1: CHAPTER ARCHITECT WORKSPACE */}
                {studioMode === 'architect' && (
                  <ChapterArchitectView 
                    playSoundEffect={playSoundEffect}
                    addXpAndMp={addXpAndMp}
                    studioMode={studioMode}
                    setStudioMode={setStudioMode}
                  />
                )}

                {/* MODE 3: ELEUSIS PATH SAGA */}
                {studioMode === 'eleusis' && (
                  <EleusisPathSagaView
                    playSoundEffect={playSoundEffect}
                    addXpAndMp={addXpAndMp}
                    onClose={() => setStudioMode('architect')}
                  />
                )}

                {/* MODE 2: FRAME ARCHIVE (10 CORE LAYERS) */}
                {studioMode === 'archive' && (
                  <div className="space-y-8 animate-fade-in">
                    {/* FRAME CATEGORY FILTER TOOLBAR */}
                    <section className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#131314] border border-[#353436] rounded-2xl">
                      <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <Layers className="w-4 h-4 text-[#15ffd1]" />
                        <span>MAGNOSCROLL CORE LAYERS (10)</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {['ALL', 'RABBIT', 'TEXT', 'IMAGE', 'AUDIO', 'VIDEO', 'BUTTON', 'QUIZ', 'MISSION', 'REWARD', 'EGG'].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => {
                              playSoundEffect('click');
                              setStudioFilter(cat);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer uppercase ${
                              studioFilter === cat
                                ? 'bg-[#15ffd1] text-[#003829] shadow-[0_0_12px_rgba(21,255,209,0.4)]'
                                : 'bg-[#1c1b1c] text-[#b9cacb] hover:text-white border border-[#353436]'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </section>

                {/* 10 CORE FRAMES BENTO GRID */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {/* 1. FrameRabbit */}
                  {(studioFilter === 'ALL' || studioFilter === 'RABBIT') && (
                    <div className="bg-[#1c1b1c] border border-[#15ffd1]/40 rounded-2xl overflow-hidden hover:border-[#15ffd1] transition-all group flex flex-col justify-between shadow-2xl relative">
                      <div className="p-5 border-b border-[#353436] space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-audiowide text-lg text-[#15ffd1] uppercase">FrameRabbit</h3>
                          <span className="p-1.5 rounded-lg bg-[#15ffd1]/10 text-[#15ffd1] border border-[#15ffd1]/30">
                            <Bot className="w-4 h-4" />
                          </span>
                        </div>
                        <div className="h-36 rounded-xl bg-[#0e0e0f] border border-[#353436] flex items-center justify-center relative overflow-hidden">
                          <img 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7WSQRU71qcCH1ZyCnjtBQ-jxwJUQspgre9h-HQEPewj-llxzYRinMKWD4af4kZW9DBQX7qg9TDQ7tNZy1eG5NLZhoMDGJbDKlIh-r6P2ONgvPHZwsMarFvt-FqLGoIgUkAcuvlLCgcqt3sSQMtHnXneY6A1rPNfXdNfkR2DuAZz8hYs0ezHKNCZjzxNxfuFfcFqZJXOglbvd8sJTpQSpZozuecqTcyRfq6DsBc5cG2B7pGwHvbpH-j7RYzPqDx2I0qbi6oJtwfVAf" 
                            alt="FrameRabbit Guide"
                            className="w-24 h-24 object-contain animate-bounce filter drop-shadow-[0_0_12px_rgba(21,255,209,0.5)]"
                          />
                          <span className="absolute bottom-2 left-2 text-[9px] text-[#15ffd1] font-bold bg-[#131314]/80 px-2 py-0.5 rounded border border-[#15ffd1]/30">
                            NEURAL COMPANION
                          </span>
                        </div>
                      </div>

                      <div 
                        onClick={() => {
                          playSoundEffect('click');
                          setStudioCopiedFrame('FrameRabbit');
                          navigator.clipboard.writeText(`{\n  "type": "FrameRabbit",\n  "trigger": "onEnter",\n  "mood": "celestial"\n}`);
                          setTimeout(() => setStudioCopiedFrame(null), 2000);
                        }}
                        className="p-4 bg-[#0e0e0f] m-4 rounded-xl border border-[#353436] text-[11px] font-mono text-[#15ffd1] cursor-pointer hover:border-[#15ffd1]/50 transition-all relative"
                      >
                        <pre className="overflow-x-auto leading-relaxed">
                          {`{\n  "type": "FrameRabbit",\n  "trigger": "onEnter",\n  "mood": "celestial"\n}`}
                        </pre>
                        <span className="absolute top-2 right-2 text-[9px] text-[#849495] flex items-center gap-1 font-bold">
                          {studioCopiedFrame === 'FrameRabbit' ? <Check className="w-3 h-3 text-[#15ffd1]" /> : <Copy className="w-3 h-3" />}
                          {studioCopiedFrame === 'FrameRabbit' ? 'COPIED!' : 'CLICK TO COPY'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 2. FrameText */}
                  {(studioFilter === 'ALL' || studioFilter === 'TEXT') && (
                    <div className="bg-[#1c1b1c] border border-[#353436] rounded-2xl overflow-hidden hover:border-[#00dbe9] transition-all group flex flex-col justify-between shadow-xl">
                      <div className="p-5 border-b border-[#353436] space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-audiowide text-lg text-white group-hover:text-[#00dbe9] transition-colors uppercase">FrameText</h3>
                          <span className="p-1.5 rounded-lg bg-[#00dbe9]/10 text-[#00dbe9] border border-[#00dbe9]/30">
                            <Type className="w-4 h-4" />
                          </span>
                        </div>
                        <div className="h-36 rounded-xl bg-[#0e0e0f] border border-[#353436] p-4 flex flex-col justify-center space-y-2">
                          <div className="h-3 bg-[#00dbe9] rounded w-3/4 shadow-[0_0_8px_#00dbe9]" />
                          <div className="h-2 bg-[#b9cacb]/50 rounded w-full" />
                          <div className="h-2 bg-[#b9cacb]/30 rounded w-5/6" />
                        </div>
                      </div>

                      <div 
                        onClick={() => {
                          playSoundEffect('click');
                          setStudioCopiedFrame('FrameText');
                          navigator.clipboard.writeText(`{\n  "type": "FrameText",\n  "title": "Ancient Echoes",\n  "body": "The path begins in MagnopVS..."\n}`);
                          setTimeout(() => setStudioCopiedFrame(null), 2000);
                        }}
                        className="p-4 bg-[#0e0e0f] m-4 rounded-xl border border-[#353436] text-[11px] font-mono text-[#00dbe9] cursor-pointer hover:border-[#00dbe9]/50 transition-all relative"
                      >
                        <pre className="overflow-x-auto leading-relaxed">
                          {`{\n  "type": "FrameText",\n  "title": "Ancient Echoes",\n  "body": "The path begins..."\n}`}
                        </pre>
                        <span className="absolute top-2 right-2 text-[9px] text-[#849495] flex items-center gap-1 font-bold">
                          {studioCopiedFrame === 'FrameText' ? <Check className="w-3 h-3 text-[#00dbe9]" /> : <Copy className="w-3 h-3" />}
                          {studioCopiedFrame === 'FrameText' ? 'COPIED!' : 'CLICK TO COPY'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 3. FrameImage */}
                  {(studioFilter === 'ALL' || studioFilter === 'IMAGE') && (
                    <div className="bg-[#1c1b1c] border border-[#353436] rounded-2xl overflow-hidden hover:border-[#ffabf3] transition-all group flex flex-col justify-between shadow-xl">
                      <div className="p-5 border-b border-[#353436] space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-audiowide text-lg text-white group-hover:text-[#ffabf3] transition-colors uppercase">FrameImage</h3>
                          <span className="p-1.5 rounded-lg bg-[#ffabf3]/10 text-[#ffabf3] border border-[#ffabf3]/30">
                            <Image className="w-4 h-4" />
                          </span>
                        </div>
                        <div className="h-36 rounded-xl overflow-hidden border border-[#353436] relative">
                          <img 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEkfT6JvpHkdx6wDSM2gcbYdrzQVFzJq0r1TRnWgh_GqSMnEIS0-9SPCm9msXPCgT4o8KybLZj3v90zenaVhuv89WHQKS5DDoy4YR0l4n8BzD2fKQWhKSsOa-nIlPbgvzhRHOQObQN4QxCn4-scvMcnZlh8fnioNFhQboyWdKkg1A84f9G5uhAgPLrMVwn8qfkKAuZGxnUbGH-zuBkcgoejxBeEUBvYUeTdnFKBngQvyKOxPHd3A_u6cNH4y9ukwxXNNEpWM6FxDV1" 
                            alt="FrameImage Preview" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      </div>

                      <div 
                        onClick={() => {
                          playSoundEffect('click');
                          setStudioCopiedFrame('FrameImage');
                          navigator.clipboard.writeText(`{\n  "type": "FrameImage",\n  "src": "sector_04.png",\n  "parallax": 0.5\n}`);
                          setTimeout(() => setStudioCopiedFrame(null), 2000);
                        }}
                        className="p-4 bg-[#0e0e0f] m-4 rounded-xl border border-[#353436] text-[11px] font-mono text-[#ffabf3] cursor-pointer hover:border-[#ffabf3]/50 transition-all relative"
                      >
                        <pre className="overflow-x-auto leading-relaxed">
                          {`{\n  "type": "FrameImage",\n  "src": "sector_04.png",\n  "parallax": 0.5\n}`}
                        </pre>
                        <span className="absolute top-2 right-2 text-[9px] text-[#849495] flex items-center gap-1 font-bold">
                          {studioCopiedFrame === 'FrameImage' ? <Check className="w-3 h-3 text-[#ffabf3]" /> : <Copy className="w-3 h-3" />}
                          {studioCopiedFrame === 'FrameImage' ? 'COPIED!' : 'CLICK TO COPY'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 4. FrameAudio */}
                  {(studioFilter === 'ALL' || studioFilter === 'AUDIO') && (
                    <div className="bg-[#1c1b1c] border border-[#353436] rounded-2xl overflow-hidden hover:border-[#00dbe9] transition-all group flex flex-col justify-between shadow-xl">
                      <div className="p-5 border-b border-[#353436] space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-audiowide text-lg text-white group-hover:text-[#00dbe9] transition-colors uppercase">FrameAudio</h3>
                          <span className="p-1.5 rounded-lg bg-[#00dbe9]/10 text-[#00dbe9] border border-[#00dbe9]/30">
                            <Music className="w-4 h-4" />
                          </span>
                        </div>
                        <div className="h-36 rounded-xl bg-[#0e0e0f] border border-[#353436] flex items-center justify-center gap-1.5 p-4">
                          <div className="w-1.5 h-8 bg-[#00dbe9] rounded-full animate-pulse" />
                          <div className="w-1.5 h-16 bg-[#00dbe9] rounded-full animate-pulse delay-75" />
                          <div className="w-1.5 h-10 bg-[#00dbe9] rounded-full animate-pulse delay-150" />
                          <div className="w-1.5 h-20 bg-[#00dbe9] rounded-full animate-pulse delay-100" />
                          <div className="w-1.5 h-12 bg-[#00dbe9] rounded-full animate-pulse delay-200" />
                        </div>
                      </div>

                      <div 
                        onClick={() => {
                          playSoundEffect('click');
                          setStudioCopiedFrame('FrameAudio');
                          navigator.clipboard.writeText(`{\n  "type": "FrameAudio",\n  "track": "ambient_void.ogg",\n  "spatial": 0.8\n}`);
                          setTimeout(() => setStudioCopiedFrame(null), 2000);
                        }}
                        className="p-4 bg-[#0e0e0f] m-4 rounded-xl border border-[#353436] text-[11px] font-mono text-[#00dbe9] cursor-pointer hover:border-[#00dbe9]/50 transition-all relative"
                      >
                        <pre className="overflow-x-auto leading-relaxed">
                          {`{\n  "type": "FrameAudio",\n  "track": "ambient_void.ogg",\n  "spatial": 0.8\n}`}
                        </pre>
                        <span className="absolute top-2 right-2 text-[9px] text-[#849495] flex items-center gap-1 font-bold">
                          {studioCopiedFrame === 'FrameAudio' ? <Check className="w-3 h-3 text-[#00dbe9]" /> : <Copy className="w-3 h-3" />}
                          {studioCopiedFrame === 'FrameAudio' ? 'COPIED!' : 'CLICK TO COPY'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 5. FrameVideo */}
                  {(studioFilter === 'ALL' || studioFilter === 'VIDEO') && (
                    <div className="bg-[#1c1b1c] border border-[#353436] rounded-2xl overflow-hidden hover:border-[#ffabf3] transition-all group flex flex-col justify-between shadow-xl">
                      <div className="p-5 border-b border-[#353436] space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-audiowide text-lg text-white group-hover:text-[#ffabf3] transition-colors uppercase">FrameVideo</h3>
                          <span className="p-1.5 rounded-lg bg-[#ffabf3]/10 text-[#ffabf3] border border-[#ffabf3]/30">
                            <Video className="w-4 h-4" />
                          </span>
                        </div>
                        <div className="h-36 rounded-xl bg-black border border-[#353436] flex items-center justify-center relative overflow-hidden">
                          <Play className="w-12 h-12 text-[#ffabf3] opacity-80 group-hover:scale-110 transition-transform" />
                        </div>
                      </div>

                      <div 
                        onClick={() => {
                          playSoundEffect('click');
                          setStudioCopiedFrame('FrameVideo');
                          navigator.clipboard.writeText(`{\n  "type": "FrameVideo",\n  "src": "eleusis_01.mp4",\n  "loop": true\n}`);
                          setTimeout(() => setStudioCopiedFrame(null), 2000);
                        }}
                        className="p-4 bg-[#0e0e0f] m-4 rounded-xl border border-[#353436] text-[11px] font-mono text-[#ffabf3] cursor-pointer hover:border-[#ffabf3]/50 transition-all relative"
                      >
                        <pre className="overflow-x-auto leading-relaxed">
                          {`{\n  "type": "FrameVideo",\n  "src": "eleusis_01.mp4",\n  "loop": true\n}`}
                        </pre>
                        <span className="absolute top-2 right-2 text-[9px] text-[#849495] flex items-center gap-1 font-bold">
                          {studioCopiedFrame === 'FrameVideo' ? <Check className="w-3 h-3 text-[#ffabf3]" /> : <Copy className="w-3 h-3" />}
                          {studioCopiedFrame === 'FrameVideo' ? 'COPIED!' : 'CLICK TO COPY'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 6. FrameButton */}
                  {(studioFilter === 'ALL' || studioFilter === 'BUTTON') && (
                    <div className="bg-[#1c1b1c] border border-[#353436] rounded-2xl overflow-hidden hover:border-[#15ffd1] transition-all group flex flex-col justify-between shadow-xl">
                      <div className="p-5 border-b border-[#353436] space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-audiowide text-lg text-white group-hover:text-[#15ffd1] transition-colors uppercase">FrameButton</h3>
                          <span className="p-1.5 rounded-lg bg-[#15ffd1]/10 text-[#15ffd1] border border-[#15ffd1]/30">
                            <MousePointer className="w-4 h-4" />
                          </span>
                        </div>
                        <div className="h-36 rounded-xl bg-[#0e0e0f] border border-[#353436] p-4 flex items-center justify-center">
                          <button 
                            onClick={() => {
                              playSoundEffect('quest');
                              addXpAndMp(30, 15);
                            }}
                            className="px-6 py-2.5 bg-[#15ffd1] text-[#003829] font-bold rounded-xl text-xs uppercase shadow-[0_0_15px_rgba(21,255,209,0.4)] hover:scale-105 transition-transform cursor-pointer"
                          >
                            JUMP TO SECTOR
                          </button>
                        </div>
                      </div>

                      <div 
                        onClick={() => {
                          playSoundEffect('click');
                          setStudioCopiedFrame('FrameButton');
                          navigator.clipboard.writeText(`{\n  "type": "FrameButton",\n  "label": "Jump to Sector",\n  "target": "sector_12"\n}`);
                          setTimeout(() => setStudioCopiedFrame(null), 2000);
                        }}
                        className="p-4 bg-[#0e0e0f] m-4 rounded-xl border border-[#353436] text-[11px] font-mono text-[#15ffd1] cursor-pointer hover:border-[#15ffd1]/50 transition-all relative"
                      >
                        <pre className="overflow-x-auto leading-relaxed">
                          {`{\n  "type": "FrameButton",\n  "label": "Jump to Sector",\n  "target": "sector_12"\n}`}
                        </pre>
                        <span className="absolute top-2 right-2 text-[9px] text-[#849495] flex items-center gap-1 font-bold">
                          {studioCopiedFrame === 'FrameButton' ? <Check className="w-3 h-3 text-[#15ffd1]" /> : <Copy className="w-3 h-3" />}
                          {studioCopiedFrame === 'FrameButton' ? 'COPIED!' : 'CLICK TO COPY'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 7. FrameQuiz */}
                  {(studioFilter === 'ALL' || studioFilter === 'QUIZ') && (
                    <div className="bg-[#1c1b1c] border border-[#353436] rounded-2xl overflow-hidden hover:border-[#00dbe9] transition-all group flex flex-col justify-between shadow-xl">
                      <div className="p-5 border-b border-[#353436] space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-audiowide text-lg text-white group-hover:text-[#00dbe9] transition-colors uppercase">FrameQuiz</h3>
                          <span className="p-1.5 rounded-lg bg-[#00dbe9]/10 text-[#00dbe9] border border-[#00dbe9]/30">
                            <HelpCircle className="w-4 h-4" />
                          </span>
                        </div>
                        <div className="h-36 rounded-xl bg-[#0e0e0f] border border-[#353436] p-3 flex flex-col justify-center space-y-2 text-[10px]">
                          <span className="text-[#00dbe9] font-bold">Q: What fuels the matrix?</span>
                          <div className="p-1.5 bg-[#201f20] border border-[#00dbe9]/30 rounded text-white font-bold">A. Choice</div>
                          <div className="p-1.5 bg-[#201f20] border border-[#353436] rounded text-[#849495]">B. Luck</div>
                        </div>
                      </div>

                      <div 
                        onClick={() => {
                          playSoundEffect('click');
                          setStudioCopiedFrame('FrameQuiz');
                          navigator.clipboard.writeText(`{\n  "type": "FrameQuiz",\n  "question": "What fuels the path?",\n  "options": ["Choice", "Luck"]\n}`);
                          setTimeout(() => setStudioCopiedFrame(null), 2000);
                        }}
                        className="p-4 bg-[#0e0e0f] m-4 rounded-xl border border-[#353436] text-[11px] font-mono text-[#00dbe9] cursor-pointer hover:border-[#00dbe9]/50 transition-all relative"
                      >
                        <pre className="overflow-x-auto leading-relaxed">
                          {`{\n  "type": "FrameQuiz",\n  "question": "What fuels the path?",\n  "options": ["Choice", "Luck"]\n}`}
                        </pre>
                        <span className="absolute top-2 right-2 text-[9px] text-[#849495] flex items-center gap-1 font-bold">
                          {studioCopiedFrame === 'FrameQuiz' ? <Check className="w-3 h-3 text-[#00dbe9]" /> : <Copy className="w-3 h-3" />}
                          {studioCopiedFrame === 'FrameQuiz' ? 'COPIED!' : 'CLICK TO COPY'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 8. FrameMission */}
                  {(studioFilter === 'ALL' || studioFilter === 'MISSION') && (
                    <div className="bg-[#1c1b1c] border border-[#353436] rounded-2xl overflow-hidden hover:border-[#ffabf3] transition-all group flex flex-col justify-between shadow-xl">
                      <div className="p-5 border-b border-[#353436] space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-audiowide text-lg text-white group-hover:text-[#ffabf3] transition-colors uppercase">FrameMission</h3>
                          <span className="p-1.5 rounded-lg bg-[#ffabf3]/10 text-[#ffabf3] border border-[#ffabf3]/30">
                            <Target className="w-4 h-4" />
                          </span>
                        </div>
                        <div className="h-36 rounded-xl bg-[#0e0e0f] border border-[#353436] p-3 flex flex-col justify-center space-y-2 text-[10px]">
                          <div className="flex items-center gap-2 text-[#ffabf3]">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>1. Find the Gate</span>
                          </div>
                          <div className="flex items-center gap-2 text-[#849495]">
                            <span className="w-3.5 h-3.5 rounded-full border border-[#353436]" />
                            <span>2. Solve the Riddle</span>
                          </div>
                        </div>
                      </div>

                      <div 
                        onClick={() => {
                          playSoundEffect('click');
                          setStudioCopiedFrame('FrameMission');
                          navigator.clipboard.writeText(`{\n  "type": "FrameMission",\n  "goals": ["Find Gate", "Solve Riddle"],\n  "exp": 500\n}`);
                          setTimeout(() => setStudioCopiedFrame(null), 2000);
                        }}
                        className="p-4 bg-[#0e0e0f] m-4 rounded-xl border border-[#353436] text-[11px] font-mono text-[#ffabf3] cursor-pointer hover:border-[#ffabf3]/50 transition-all relative"
                      >
                        <pre className="overflow-x-auto leading-relaxed">
                          {`{\n  "type": "FrameMission",\n  "goals": ["Find Gate", "Solve Riddle"],\n  "exp": 500\n}`}
                        </pre>
                        <span className="absolute top-2 right-2 text-[9px] text-[#849495] flex items-center gap-1 font-bold">
                          {studioCopiedFrame === 'FrameMission' ? <Check className="w-3 h-3 text-[#ffabf3]" /> : <Copy className="w-3 h-3" />}
                          {studioCopiedFrame === 'FrameMission' ? 'COPIED!' : 'CLICK TO COPY'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 9. FrameReward */}
                  {(studioFilter === 'ALL' || studioFilter === 'REWARD') && (
                    <div className="bg-[#1c1b1c] border border-[#15ffd1]/40 rounded-2xl overflow-hidden hover:border-[#15ffd1] transition-all group flex flex-col justify-between shadow-xl">
                      <div className="p-5 border-b border-[#353436] space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-audiowide text-lg text-[#15ffd1] uppercase">FrameReward</h3>
                          <span className="p-1.5 rounded-lg bg-[#15ffd1]/10 text-[#15ffd1] border border-[#15ffd1]/30">
                            <Award className="w-4 h-4" />
                          </span>
                        </div>
                        <div className="h-36 rounded-xl bg-[#0e0e0f] border border-[#353436] flex items-center justify-center">
                          <Sparkles className="w-12 h-12 text-[#15ffd1] animate-pulse" />
                        </div>
                      </div>

                      <div 
                        onClick={() => {
                          playSoundEffect('click');
                          setStudioCopiedFrame('FrameReward');
                          navigator.clipboard.writeText(`{\n  "type": "FrameReward",\n  "item_id": "ascension_01",\n  "rarity": "Legendary"\n}`);
                          setTimeout(() => setStudioCopiedFrame(null), 2000);
                        }}
                        className="p-4 bg-[#0e0e0f] m-4 rounded-xl border border-[#353436] text-[11px] font-mono text-[#15ffd1] cursor-pointer hover:border-[#15ffd1]/50 transition-all relative"
                      >
                        <pre className="overflow-x-auto leading-relaxed">
                          {`{\n  "type": "FrameReward",\n  "item_id": "ascension_01",\n  "rarity": "Legendary"\n}`}
                        </pre>
                        <span className="absolute top-2 right-2 text-[9px] text-[#849495] flex items-center gap-1 font-bold">
                          {studioCopiedFrame === 'FrameReward' ? <Check className="w-3 h-3 text-[#15ffd1]" /> : <Copy className="w-3 h-3" />}
                          {studioCopiedFrame === 'FrameReward' ? 'COPIED!' : 'CLICK TO COPY'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 10. FrameEgg */}
                  {(studioFilter === 'ALL' || studioFilter === 'EGG') && (
                    <div className="bg-[#1c1b1c] border border-[#353436] rounded-2xl overflow-hidden hover:border-[#ffabf3] transition-all group flex flex-col justify-between shadow-xl">
                      <div className="p-5 border-b border-[#353436] space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-audiowide text-lg text-white group-hover:text-[#ffabf3] transition-colors uppercase">FrameEgg</h3>
                          <span className="p-1.5 rounded-lg bg-[#ffabf3]/10 text-[#ffabf3] border border-[#ffabf3]/30">
                            <Egg className="w-4 h-4" />
                          </span>
                        </div>
                        <div className="h-36 rounded-xl bg-[#0e0e0f] border border-[#353436] flex items-center justify-center">
                          <Egg className="w-12 h-12 text-[#ffabf3] animate-spin duration-3000" />
                        </div>
                      </div>

                      <div 
                        onClick={() => {
                          playSoundEffect('click');
                          setStudioCopiedFrame('FrameEgg');
                          navigator.clipboard.writeText(`{\n  "type": "FrameEgg",\n  "hatch_timer": 3600,\n  "mystery": true\n}`);
                          setTimeout(() => setStudioCopiedFrame(null), 2000);
                        }}
                        className="p-4 bg-[#0e0e0f] m-4 rounded-xl border border-[#353436] text-[11px] font-mono text-[#ffabf3] cursor-pointer hover:border-[#ffabf3]/50 transition-all relative"
                      >
                        <pre className="overflow-x-auto leading-relaxed">
                          {`{\n  "type": "FrameEgg",\n  "hatch_timer": 3600,\n  "mystery": true\n}`}
                        </pre>
                        <span className="absolute top-2 right-2 text-[9px] text-[#849495] flex items-center gap-1 font-bold">
                          {studioCopiedFrame === 'FrameEgg' ? <Check className="w-3 h-3 text-[#ffabf3]" /> : <Copy className="w-3 h-3" />}
                          {studioCopiedFrame === 'FrameEgg' ? 'COPIED!' : 'CLICK TO COPY'}
                        </span>
                      </div>
                    </div>
                  )}
                </section>
                  </div>
                )}

                {/* BOTTOM FLOATING ACTION BAR */}
                <div className="fixed bottom-6 right-6 z-50">
                  <button
                    onClick={() => {
                      playSoundEffect('level');
                      addXpAndMp(200, 100);
                      alert("¡Capítulo de MagnoScroll compilado y desplegado con éxito en MagnopVS! +200 XP / +100 MP.");
                    }}
                    className="flex items-center gap-3 px-8 py-4 bg-[#15ffd1] text-[#003829] font-mono text-xs font-bold rounded-full shadow-[0_0_30px_rgba(21,255,209,0.5)] hover:shadow-[0_0_50px_rgba(21,255,209,0.8)] hover:scale-105 active:scale-95 transition-all cursor-pointer uppercase tracking-wider"
                  >
                    <Rocket className="w-5 h-5 animate-bounce" />
                    <span>COMPILE CHAPTER (+200 XP)</span>
                  </button>
                </div>
              </div>
            )}

            {/* FLOATING COSMIC WHITE RABBIT (CBC) WIDGET */}
            <div 
              onClick={() => {
                playSoundEffect('level');
                addXpAndMp(50, 25);
                alert("¡El Conejo Blanco Cósmico (CBC) te ha bendecido! +50 XP / +25 MP concedidos en MagnopVS.");
              }}
              className="fixed bottom-8 right-8 z-40 flex flex-col items-end group cursor-pointer"
            >
              <div className="mb-2 bg-[#00dbe9] text-[#00363a] px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                Found a carrot? (+50 XP)
              </div>
              <div className="w-14 h-14 rounded-full bg-[#00dbe9] text-[#00363a] flex items-center justify-center shadow-[0_0_25px_rgba(0,219,233,0.6)] hover:scale-110 transition-transform animate-bounce">
                <Compass className="w-7 h-7 fill-current" />
              </div>
            </div>

          </div>
)}
{viewMode === 'matrix' && (
          /* ========================================================= */
          /* QUANTVM MATRIX VR HUB MODE */
          /* ========================================================= */
          <div className="space-y-10 max-w-7xl mx-auto px-6 font-orbitron">

            {/* Standalone Creator Studio Bar (Independent of any Saga card) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#131722]/90 border border-[#15ffd1]/35 shadow-[0_0_25px_rgba(21,255,209,0.1)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#15ffd1] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Estudio de Creadores // Quantvm Matrix</span>
                  </span>
                  <p className="text-xs font-mono text-[#bdc8cf] mt-0.5">
                    Publica una nueva saga subiendo tu propio material o generándola con ayuda de Gemini IA.
                  </p>
                </div>
                <button
                  onClick={() => {
                    playSoundEffect('click');
                    setEditingCreatorSaga(null);
                    setShowCreateSagaModal(true);
                  }}
                  className="shrink-0 bg-gradient-to-r from-[#15ffd1] to-[#00a3ff] hover:from-[#24ffcd] hover:to-[#6bd3ff] text-[#05080f] font-mono font-black text-xs px-5 py-3 rounded-xl transition-all uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(21,255,209,0.3)]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Crear Nueva Saga</span>
                </button>
              </div>

              {creatorSagas.length > 0 && (
                <div className="pt-3 border-t border-[#252d40] space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#a2e0ff]">
                      Mis Sagas Publicadas ({creatorSagas.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                      {['ALL', ...Array.from(new Set(creatorSagas.map((s) => s.genre || 'Sin Categoría')))].map((g) => (
                        <button
                          key={g}
                          onClick={() => {
                            playSoundEffect('click');
                            setCreatorGenreFilter(g);
                          }}
                          className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                            creatorGenreFilter === g
                              ? 'bg-[#15ffd1]/20 border-[#15ffd1] text-[#15ffd1] font-bold'
                              : 'bg-[#090c14] border-[#252d40] text-[#889299] hover:text-white'
                          }`}
                        >
                          {g === 'ALL' ? 'Todas' : g}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {creatorSagas
                      .filter((cs) => creatorGenreFilter === 'ALL' || (cs.genre || 'Sin Categoría') === creatorGenreFilter)
                      .map((cs) => (
                      <div
                        key={cs.id}
                        className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#090c14] border border-[#252d40]"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={cs.image}
                            alt={cs.title}
                            className="w-12 h-12 rounded-lg object-cover border border-[#15ffd1]/40 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-audiowide text-white truncate">{cs.title}</h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {cs.genre && (
                                <span className="px-1.5 py-0.5 rounded bg-[#15ffd1]/15 text-[#15ffd1] border border-[#15ffd1]/30 text-[9px] font-mono">
                                  {cs.genre}
                                </span>
                              )}
                              <p className="text-[10px] font-mono text-[#889299] truncate">
                                {cs.chapters?.length || 1} cap. · {cs.era.toUpperCase()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 font-mono text-[10px]">
                          <button
                            onClick={() => {
                              playSoundEffect('portal');
                              setCurrentSagaId(cs.id);
                              setActiveTab('sagas');
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-[#00a3ff]/20 hover:bg-[#00a3ff]/30 text-[#a2e0ff] border border-[#00a3ff]/40 cursor-pointer"
                          >
                            Abrir
                          </button>
                          <button
                            onClick={() => {
                              playSoundEffect('click');
                              setEditingCreatorSaga(cs);
                              setShowCreateSagaModal(true);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-[#ff4dfa]/15 hover:bg-[#ff4dfa]/25 text-[#ffabf3] border border-[#ff4dfa]/40 cursor-pointer"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => {
                              playSoundEffect('click');
                              setCreatorSagas(deleteCreatorSaga(cs.id));
                            }}
                            title="Eliminar Saga"
                            className="p-1.5 rounded-lg bg-[#1a1d28] hover:bg-red-500/20 text-[#889299] hover:text-red-400 border border-[#252d40] cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Tokyo 3000 Hero Banner */}
            <section className="relative h-[65vh] min-h-[420px] w-full rounded-3xl overflow-hidden border border-[#00a3ff]/30 shadow-[0_0_35px_rgba(0,163,255,0.15)] group">
              <img 
                src={tokyo3000Img} 
                alt="Tokyo 3000 Backdrop" 
                className="absolute inset-0 w-full h-full object-cover brightness-60 group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/40 to-transparent" />
              
              <div className="absolute inset-0 p-6 sm:p-12 flex flex-col justify-end max-w-3xl">
                <div className="space-y-4">
                  <span className="font-mono text-xs font-bold text-[#15ffd1] bg-[#15ffd1]/10 px-3 py-1 rounded border border-[#15ffd1]/30 tracking-widest uppercase inline-block">
                    VISUAL NOVEL // FEATURED SAGA
                  </span>
                  
                  <h2 className="text-4xl sm:text-6xl font-audiowide uppercase text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    TOKYO 3000
                  </h2>

                  <p className="text-sm sm:text-base font-mono text-[#e5e2e1] italic border-l-2 border-[#00a3ff] pl-4 py-1 max-w-xl bg-black/40 backdrop-blur-sm rounded-r-lg">
                    "LAS ESPECIES ANTIGUAS GOBIERNAN EL FUTURO DE TOKIO EN MagnopVS."
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <button 
                      onClick={() => handleOpenSagaDetails({
                        id: 'tokyo3000',
                        title: 'TOKYO 3000',
                        subtitle: 'Saga Principal // Ciber-Fantasía Transmedia',
                        era: 'chaos',
                        status: 'active',
                        image: tokyo3000Img,
                        description: 'En el año 3000, la metrópolis de Tokio ha evolucionado hacia un nexo cibernético donde clanes ancestrales y androides autoconscientes libran una guerra silenciosa por el control del Código Madre de MagnopVS.',
                        magnoEggsReward: 20,
                        category: 'series'
                      })}
                      className="bg-[#00a3ff]/20 hover:bg-[#00a3ff] text-[#00a3ff] hover:text-[#0e0e0e] font-mono font-bold px-8 py-3.5 border border-[#00a3ff] rounded-xl transition-all uppercase tracking-widest cursor-pointer shadow-[0_0_20px_rgba(0,163,255,0.3)] flex items-center gap-2"
                    >
                      <Play className="w-5 h-5 fill-current" />
                      <span>ENTER SAGA</span>
                    </button>

                    <button 
                      onClick={() => setShowUgcBuilder(true)}
                      className="bg-[#ff4dfa]/20 hover:bg-[#ff4dfa] text-[#ff4dfa] hover:text-[#0e0e0e] font-mono font-bold px-6 py-3.5 border border-[#ff4dfa] rounded-xl transition-all uppercase tracking-widest cursor-pointer flex items-center gap-2"
                    >
                      <Wand2 className="w-5 h-5" />
                      <span>CREAR CON IA</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* UGC AI Story Builder Panel */}
            {showUgcBuilder && (
              <div className="bg-[#1c1b1b] border-2 border-[#ff4dfa] p-6 rounded-2xl space-y-4 animate-fade-in shadow-[0_0_30px_rgba(255,77,250,0.2)] font-mono">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#ff4dfa]/20 border border-[#ff4dfa]/40 rounded-xl text-[#ff4dfa]">
                    <Wand2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-audiowide text-white uppercase">
                      GENERADOR DE NODOS NARRATIVOS QUANTVM
                    </h4>
                    <p className="text-xs text-[#bec7d4]">
                      Ingresa una idea, concepto o fragmento de lore para que Sof.IA forje un nuevo capítulo en el multiverso MagnopVS.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleGenerateStory} className="space-y-3">
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Ejemplo: Un androide de la facción Arquitectos Quantvm descubre un antiguo pergamino alquímico en Tokyo 3000..."
                    rows={3}
                    className="w-full bg-[#0e0e0e] border border-[#3f4852] focus:border-[#ff4dfa] rounded-xl p-3.5 text-xs text-white placeholder-[#88919d] outline-none transition-all resize-none"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#15ffd1]">
                      +200 XP & +75 MP por publicación de nodo
                    </span>
                    <button
                      type="submit"
                      disabled={isGenerating || !aiPrompt.trim()}
                      className="px-6 py-2.5 bg-[#ff4dfa] hover:bg-[#ff4dfa]/80 text-[#3d0026] font-bold text-xs uppercase rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <Zap className="w-4 h-4 animate-spin" />
                          <span>FORJANDO EN LA MATRIX...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>PUBLICAR NODO NARRATIVO</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {generatedStory && (
                  <div className="bg-[#0e0e0e] border border-[#15ffd1]/50 p-4 rounded-xl space-y-2 mt-4 animate-fade-in text-xs text-[#15ffd1]">
                    <div className="font-bold uppercase flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#15ffd1]" />
                      <span>Nodo Generado Exitosamente:</span>
                    </div>
                    <p className="whitespace-pre-line text-[#e5e2e1] leading-relaxed">
                      {generatedStory}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Interactive Real-Time Multiplayer Pulse Visualization Layer */}
            <QuantvmMultiplayerPulseOverlay
              activityMap={sagaActivityMap}
              isEnabled={isPulseLayerEnabled}
              onToggleEnabled={() => setIsPulseLayerEnabled((prev) => !prev)}
              isLiveTelemetry={isLiveTelemetry}
              onToggleLiveTelemetry={() => setIsLiveTelemetry((prev) => !prev)}
              onSelectSagaDetails={(saga) =>
                handleOpenSagaDetails({
                  id: saga.id,
                  title: saga.title,
                  subtitle: saga.subtitle,
                  era: saga.era,
                  status: saga.status,
                  image: saga.image,
                  description: saga.synopsis,
                  magnoEggsReward: saga.magnoEggsReward,
                  category: saga.category,
                  tag: saga.tag,
                })
              }
            />

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#3f4852]/30 scrollbar-none font-mono">
              {[
                { id: 'all', label: 'TODOS LOS CONTENIDOS', icon: Layers },
                { id: 'vr', label: 'SERIES VR', icon: Tv },
                { id: 'games', label: 'VIDEOJUEGOS', icon: Gamepad2 },
                { id: 'ugc', label: 'CREADORES UGC', icon: Sparkles },
                { id: 'universes', label: 'UNIVERSOS NARRATIVOS', icon: Globe },
              ].map((cat) => {
                const IconComponent = cat.icon;
                const isActive = activeCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => { setActiveCategory(cat.id as any); playSoundEffect('click'); }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#00a3ff] text-[#001d33] shadow-[0_0_15px_rgba(0,163,255,0.4)]'
                        : 'bg-[#1c1b1b] text-[#bec7d4] border border-[#3f4852]/40 hover:border-[#00a3ff] hover:text-white'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* VR Series Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sagas.map((saga) => {
                const liveStats = sagaActivityMap[saga.id];
                const pulseTier = liveStats ? getTierForIntensity(liveStats.intensity) : null;
                return (
                <div 
                  key={saga.id}
                  onClick={() => handleOpenSagaDetails(saga)}
                  className="bg-[#1c1b1b]/80 border border-[#3f4852]/40 hover:border-[#00a3ff] rounded-2xl overflow-hidden group cursor-pointer transition-all hover:shadow-[0_0_25px_rgba(0,163,255,0.2)] flex flex-col justify-between"
                  style={
                    isPulseLayerEnabled && pulseTier && liveStats
                      ? {
                          borderColor: `${pulseTier.color}99`,
                          boxShadow: `0 0 ${12 + Math.round(liveStats.intensity / 4)}px ${pulseTier.glowRgba}`,
                          filter: `brightness(${pulseTier.brightness})`,
                        }
                      : undefined
                  }
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={saga.image} 
                      alt={saga.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100" 
                    />
                    {isPulseLayerEnabled && pulseTier && liveStats && (
                      <div
                        className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border flex items-center gap-1.5"
                        style={{ borderColor: pulseTier.color, color: pulseTier.color }}
                      >
                        <span
                          className="w-2 h-2 rounded-full animate-ping"
                          style={{
                            backgroundColor: pulseTier.color,
                            animationDuration: `${pulseTier.pulseDurationMs}ms`,
                          }}
                        />
                        <span>{liveStats.activePlayers} • {pulseTier.label}</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-[#00a3ff] text-[#001d33] text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                      {saga.era.toUpperCase()} ERA
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div>
                      <h4 className="text-base font-audiowide text-white group-hover:text-[#00a3ff] transition-colors">
                        {saga.title}
                      </h4>
                      <p className="text-xs font-mono text-[#bec7d4]">
                        {saga.subtitle}
                      </p>
                    </div>
                    {saga.id === 'mlh' && (
                      <div className="pt-2 border-t border-[#3f4852]/30 flex justify-between items-center">
                        <span className="text-[10px] font-mono text-[#47ddc1]">Nodo MLH Online</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playSoundEffect('portal');
                            addXpAndMp(300, 100);
                            setCurrentSagaId('mlh');
                            setActiveTab('herogame');
                          }}
                          className="px-3 py-1 bg-[#00a3ff] hover:bg-[#24ffcd] text-[#001d33] font-mono text-[10px] font-bold rounded-lg transition-all flex items-center gap-1 shadow-[0_0_10px_rgba(0,163,255,0.4)]"
                        >
                          <Zap className="w-3 h-3 fill-current" />
                          <span>Sintonizar Nodo</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                );
              })}
            </div>

            {/* Visualizador Cinético: Muro Reels + Red de Conexiones Temáticas (Embedded Preview in Matrix) */}
            <div className="pt-4">
              <QuantvmKineticVisualizer
                compactMode
                playSoundEffect={playSoundEffect}
                addXpAndMp={addXpAndMp}
                onExpandFullWall={() => setViewMode('reels_wall')}
                onOpenSaga={(sagaId) => {
                  setCurrentSagaId(sagaId);
                  setActiveTab(sagaId === 'mlh' ? 'herogame' : 'saga');
                }}
              />
            </div>

          </div>
        )}

        {viewMode === 'reels_wall' && (
          <QuantvmKineticVisualizer
            playSoundEffect={playSoundEffect}
            addXpAndMp={addXpAndMp}
            onOpenSaga={(sagaId) => {
              setCurrentSagaId(sagaId);
              setActiveTab(sagaId === 'mlh' ? 'herogame' : 'saga');
            }}
          />
        )}

        {/* ========================================================= */}
        {/* SOUL ARCHIVE MODE */}
        {/* ========================================================= */}
        {viewMode === 'soul_archive' && (
          <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-orbitron animate-fade-in">
            {/* Subheader Banner */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-[#131313]/80 backdrop-blur-xl border border-[#41474f]/50 shadow-[0_0_20px_rgba(152,203,255,0.1)]">
              <div>
                <h1 className="font-audiowide text-2xl sm:text-3xl text-[#cee5ff] tracking-widest uppercase">
                  QUANTVM MATRIX - SOUL ARCHIVE
                </h1>
                <p className="text-xs text-[#c1c7d0] tracking-wider mt-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#15ffd1] animate-ping" />
                  TELEMETRY ACTIVE // MagnopVS SOUL REPOSITORY
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    playSoundEffect('quest');
                    addXpAndMp(100, 50);
                    alert("Resonancia cuántica sincronizada con éxito en MagnopVS (+100 XP / +50 MP).");
                  }}
                  className="px-4 py-2.5 bg-[#15ffd1]/10 hover:bg-[#15ffd1]/20 text-[#15ffd1] border border-[#15ffd1]/40 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(21,255,209,0.2)]"
                >
                  <RefreshCw className="w-4 h-4 animate-spin-slow" />
                  <span>Sincronizar Telémetro</span>
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Central Grid (Memory Shards) */}
              <div className="flex-1 flex flex-col gap-6">
                {/* Filters Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-[#131313]/80 border border-[#41474f]/50 p-4 sm:p-6 rounded-2xl backdrop-blur-xl">
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    <button
                      onClick={() => { setShardFilter('all'); playSoundEffect('click'); }}
                      className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        shardFilter === 'all' ? 'text-[#cee5ff] underline underline-offset-8 decoration-[#cee5ff] decoration-2' : 'text-[#8b919a] hover:text-white'
                      }`}
                    >
                      TODOS ({shards.length})
                    </button>

                    <button
                      onClick={() => { setShardFilter('unlocked'); playSoundEffect('click'); }}
                      className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        shardFilter === 'unlocked' ? 'text-[#15ffd1] underline underline-offset-8 decoration-[#15ffd1] decoration-2' : 'text-[#8b919a] hover:text-[#15ffd1]'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-[#15ffd1] animate-pulse" />
                      <span>UNLOCKED ({shards.filter(s => s.status === 'unlocked').length})</span>
                    </button>

                    <button
                      onClick={() => { setShardFilter('incubating'); playSoundEffect('click'); }}
                      className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        shardFilter === 'incubating' ? 'text-[#98cbff] underline underline-offset-8 decoration-[#98cbff] decoration-2' : 'text-[#8b919a] hover:text-[#98cbff]'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-[#98cbff]" />
                      <span>INCUBATING ({shards.filter(s => s.status === 'incubating').length})</span>
                    </button>

                    <button
                      onClick={() => { setShardFilter('forbidden'); playSoundEffect('click'); }}
                      className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        shardFilter === 'forbidden' ? 'text-[#ff4dfa] underline underline-offset-8 decoration-[#ff4dfa] decoration-2' : 'text-[#8b919a] hover:text-[#ff4dfa]'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-[#ff4dfa]" />
                      <span>FORBIDDEN ({shards.filter(s => s.status === 'forbidden').length})</span>
                    </button>
                  </div>

                  <div className="text-xs text-[#8b919a] font-mono tracking-wider">
                    GRID_RENDER_V4.0.2 // MagnopVS
                  </div>
                </div>

                {/* 3D Grid Canvas */}
                <div className="relative bg-[#131313]/70 border border-[#41474f]/50 p-6 sm:p-8 rounded-2xl backdrop-blur-xl overflow-hidden min-h-[400px]">
                  {/* Scanline effect */}
                  <div className="absolute inset-x-0 h-0.5 bg-[#98cbff]/20 animate-scanline pointer-events-none" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    {filteredShards.map((shard) => (
                      <div
                        key={shard.id}
                        onClick={() => handleShardClick(shard)}
                        className={`relative group h-48 flex flex-col justify-between p-4 border rounded-xl transition-all cursor-pointer overflow-hidden backdrop-blur-md ${
                          shard.status === 'forbidden'
                            ? 'border-[#ffb4ab]/40 bg-[#93000a]/10 hover:border-[#ffb4ab] hover:bg-[#93000a]/20 shadow-[0_0_15px_rgba(255,180,171,0.1)]'
                            : shard.status === 'incubating'
                            ? 'border-[#98cbff]/40 bg-[#98cbff]/5 hover:border-[#98cbff] hover:bg-[#98cbff]/15 shadow-[0_0_15px_rgba(152,203,255,0.1)]'
                            : 'border-[#41474f]/40 bg-[#1c1b1b]/60 hover:border-[#15ffd1]/60 hover:bg-[#15ffd1]/10 shadow-[0_0_15px_rgba(21,255,209,0.1)]'
                        }`}
                      >
                        {/* Corner Brackets */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#98cbff]" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#98cbff]" />

                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-mono text-[#8b919a] uppercase">
                            #{shard.id.substring(0, 8)}
                          </span>
                          {shard.status === 'unlocked' && (
                            <div className="flex gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#15ffd1]" />
                              <div className="w-1.5 h-1.5 rounded-full bg-[#15ffd1]" />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-center justify-center my-2">
                          {shard.status === 'forbidden' ? (
                            <Lock className="w-10 h-10 text-[#ffb4ab] group-hover:scale-110 transition-transform" />
                          ) : shard.status === 'incubating' ? (
                            <Hourglass className="w-10 h-10 text-[#98cbff] animate-pulse group-hover:scale-110 transition-transform" />
                          ) : (
                            <Sparkles className="w-10 h-10 text-[#15ffd1] group-hover:scale-110 transition-transform" />
                          )}
                        </div>

                        <div>
                          <h3 className="text-xs font-bold font-audiowide text-[#cee5ff] tracking-wider mb-1 truncate">
                            {shard.name}
                          </h3>
                          {shard.status === 'incubating' ? (
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] text-[#98cbff]">
                                <span>SYNCING</span>
                                <span>{shard.syncPercent}%</span>
                              </div>
                              <div className="h-1 bg-[#41474f] rounded-full overflow-hidden">
                                <div className="h-full bg-[#98cbff]" style={{ width: `${shard.syncPercent}%` }} />
                              </div>
                            </div>
                          ) : shard.status === 'forbidden' ? (
                            <p className="text-[10px] text-[#ffb4ab]">
                              ENCRYPTION: LVL {shard.encryptionLevel || 9}
                            </p>
                          ) : (
                            <p className="text-[10px] text-[#8b919a]">
                              STABILITY: {shard.stability}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Add New Fragment Button */}
                    <div
                      onClick={handleInitializeNewFragment}
                      className="relative group h-48 flex flex-col justify-center items-center p-4 border-2 border-dashed border-[#41474f] hover:border-[#15ffd1] bg-[#0e0e0e]/50 hover:bg-[#15ffd1]/5 rounded-xl transition-all cursor-pointer"
                    >
                      <Plus className="w-8 h-8 text-[#8b919a] group-hover:text-[#15ffd1] transition-colors" />
                      <span className="text-[10px] font-mono text-[#8b919a] group-hover:text-[#15ffd1] mt-2 tracking-widest uppercase font-bold text-center">
                        INITIALIZE_FRAGMENT
                      </span>
                      <span className="text-[9px] text-[#15ffd1]/80 mt-1">+150 XP & MP</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Tactical Info Sidebar */}
              <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
                {/* Archive Sync Status */}
                <div className="bg-[#131313]/80 border border-[#41474f]/50 p-6 rounded-2xl backdrop-blur-xl shadow-[0_0_15px_rgba(152,203,255,0.1)]">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-bold font-audiowide text-[#cee5ff] tracking-widest">
                      ARCHIVE_SYNC
                    </h2>
                    <Radio className="w-4 h-4 text-[#15ffd1] animate-pulse" />
                  </div>

                  <div className="space-y-4 text-xs font-mono">
                    <div>
                      <div className="flex justify-between text-[10px] mb-1 text-[#c1c7d0]">
                        <span>COGNITIVE_RESONANCE</span>
                        <span className="text-[#cee5ff] font-bold">82%</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#2a2a2a] rounded-full overflow-hidden">
                        <div className="h-full bg-[#cee5ff]" style={{ width: '82%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] mb-1 text-[#c1c7d0]">
                        <span>TEMPORAL_ALIGNMENT</span>
                        <span className="text-[#15ffd1] font-bold">45%</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#2a2a2a] rounded-full overflow-hidden">
                        <div className="h-full bg-[#15ffd1]" style={{ width: '45%' }} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#41474f]/50 space-y-2 text-[10px] font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-[#8b919a]">UPLINK_SPEED</span>
                      <span className="text-[#cee5ff] font-bold">1.2 GB/s</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8b919a]">LAST_SNAPSHOT</span>
                      <span className="text-[#15ffd1] font-bold">02:44:12 GMT</span>
                    </div>
                  </div>
                </div>

                {/* Fragment Count & Stats */}
                <div className="bg-[#131313]/80 border border-[#41474f]/50 p-6 rounded-2xl backdrop-blur-xl">
                  <h2 className="text-xs font-bold font-audiowide text-[#cee5ff] tracking-widest mb-4">
                    FRAGMENT_STATS
                  </h2>

                  <div className="grid grid-cols-2 gap-3 font-mono">
                    <div className="p-3 border border-[#41474f]/40 bg-[#1c1b1b] rounded-xl">
                      <p className="text-[10px] text-[#8b919a] mb-1">TOTAL_SHARDS</p>
                      <p className="text-xl font-bold font-audiowide text-[#cee5ff]">1,248</p>
                    </div>
                    <div className="p-3 border border-[#41474f]/40 bg-[#1c1b1b] rounded-xl">
                      <p className="text-[10px] text-[#8b919a] mb-1">UNLOCKED</p>
                      <p className="text-xl font-bold font-audiowide text-[#15ffd1]">812</p>
                    </div>
                    <div className="p-3 border border-[#41474f]/40 bg-[#1c1b1b] rounded-xl">
                      <p className="text-[10px] text-[#8b919a] mb-1">FORBIDDEN</p>
                      <p className="text-xl font-bold font-audiowide text-[#ffb4ab]">12</p>
                    </div>
                    <div className="p-3 border border-[#41474f]/40 bg-[#1c1b1b] rounded-xl">
                      <p className="text-[10px] text-[#8b919a] mb-1">INCUBATING</p>
                      <p className="text-xl font-bold font-audiowide text-[#98cbff]">24</p>
                    </div>
                  </div>
                </div>

                {/* Active Fragments Echo Feed */}
                <div className="bg-[#131313]/80 border border-[#41474f]/50 rounded-2xl backdrop-blur-xl overflow-hidden flex flex-col max-h-64">
                  <div className="p-4 border-b border-[#41474f]/50 bg-[#201f1f]">
                    <h2 className="text-xs font-bold font-audiowide tracking-widest text-[#cee5ff]">
                      REALTIME_ECHO_FEED
                    </h2>
                  </div>
                  <div className="p-4 space-y-3 overflow-y-auto text-[10px] font-mono">
                    <div className="p-2 border-l-2 border-[#15ffd1] bg-[#15ffd1]/5 rounded-r">
                      <span className="text-[#15ffd1] font-bold">[INFO]</span> Fragment #842 resonance stabilized. Memory cluster ready for review in MagnopVS.
                    </div>
                    <div className="p-2 border-l-2 border-[#cee5ff] bg-[#cee5ff]/5 rounded-r">
                      <span className="text-[#cee5ff] font-bold">[SYNC]</span> Soul Archive uplink successfully encrypted.
                    </div>
                    <div className="p-2 border-l-2 border-[#ffb4ab] bg-[#ffb4ab]/5 rounded-r">
                      <span className="text-[#ffb4ab] font-bold">[WARN]</span> Forbidden shard #001 showing temporal leakage. Monitoring active.
                    </div>
                    <div className="p-2 border-l-2 border-[#8b919a] bg-[#8b919a]/5 rounded-r">
                      <span className="text-[#8b919a] font-bold">[SYS]</span> Daily snapshot initiated by matrix supervisor.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* SHARD DETAIL MODAL */}
      {selectedShard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in font-orbitron">
          <div className="bg-[#131313] border-2 border-[#15ffd1] w-full max-w-lg rounded-3xl p-6 shadow-[0_0_50px_rgba(21,255,209,0.3)] relative space-y-6">
            <div className="flex justify-between items-center border-b border-[#41474f]/50 pb-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-[#15ffd1]" />
                <div>
                  <h3 className="text-lg font-audiowide text-white uppercase">{selectedShard.name}</h3>
                  <p className="text-[10px] font-mono text-[#15ffd1]">STATUS: {selectedShard.status.toUpperCase()}</p>
                </div>
              </div>
              <button onClick={() => setSelectedShard(null)} className="p-2 text-[#8b919a] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono text-[#c1c7d0]">
              <p>{selectedShard.description}</p>
              <div className="bg-[#1c1b1b] p-4 rounded-xl border border-[#41474f]/40 space-y-2">
                <div className="flex justify-between"><span className="text-[#8b919a]">ESTABILIDAD:</span><span className="text-[#15ffd1]">{selectedShard.stability || '99%'}</span></div>
                <div className="flex justify-between"><span className="text-[#8b919a]">ID FRAGMENTO:</span><span className="text-[#cee5ff]">{selectedShard.id}</span></div>
                <div className="flex justify-between"><span className="text-[#8b919a]">RESONANCIA MagnopVS:</span><span className="text-[#15ffd1]">100% Sincronizado</span></div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#41474f]/50">
              <button
                onClick={() => setSelectedShard(null)}
                className="px-4 py-2 border border-[#41474f] text-[#8b919a] rounded-xl text-xs uppercase cursor-pointer"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  playSoundEffect('level');
                  addXpAndMp(100, 50);
                  alert(`¡Fragmento ${selectedShard.name} sintonizado en MagnopVS! Recompensa: +100 XP / +50 MP`);
                  setSelectedShard(null);
                }}
                className="px-5 py-2 bg-[#15ffd1] text-[#00382c] font-bold rounded-xl text-xs uppercase cursor-pointer shadow-[0_0_15px_rgba(21,255,209,0.3)] flex items-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Sintonizar (+100 XP)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW SHARD CREATION MODAL */}
      {showNewShardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in font-orbitron">
          <div className="bg-[#131313] border-2 border-[#cee5ff] w-full max-w-md rounded-3xl p-6 shadow-[0_0_50px_rgba(152,203,255,0.3)] relative space-y-6">
            <div className="flex justify-between items-center border-b border-[#41474f]/50 pb-4">
              <div className="flex items-center gap-3">
                <Plus className="w-6 h-6 text-[#cee5ff]" />
                <h3 className="text-lg font-audiowide text-white uppercase">Inicializar Fragmento</h3>
              </div>
              <button onClick={() => setShowNewShardModal(false)} className="p-2 text-[#8b919a] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateShardSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#cee5ff] mb-2 uppercase">Nombre del Fragmento</label>
                <input
                  type="text"
                  required
                  value={newShardName}
                  onChange={(e) => setNewShardName(e.target.value)}
                  placeholder="Ej: KINETIC_RESONANCE_01"
                  className="w-full bg-[#0e0e0e] border border-[#41474f] focus:border-[#cee5ff] rounded-xl p-3 text-xs text-white outline-none font-mono uppercase"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#41474f]/50">
                <button
                  type="button"
                  onClick={() => setShowNewShardModal(false)}
                  className="px-4 py-2 border border-[#41474f] text-[#8b919a] rounded-xl text-xs uppercase cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#cee5ff] text-[#001d33] font-bold rounded-xl text-xs uppercase cursor-pointer shadow-[0_0_15px_rgba(152,203,255,0.3)] flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Crear Nódulo (+150 XP)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
        {/* CODEX VIVO MODE */}
        {/* ========================================================= */}
        {viewMode === 'codex_vivo' && (
          <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-orbitron animate-fade-in">
            {/* Top Bar / Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-[#131313]/90 backdrop-blur-xl border border-[#41474f]/50 shadow-[0_0_25px_rgba(21,255,209,0.15)]">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <h1 className="font-audiowide text-2xl sm:text-3xl text-[#cee5ff] tracking-widest uppercase">
                  CODEX VIVO
                </h1>
                <span className="text-xs text-[#15ffd1] font-mono tracking-widest px-3 py-1 bg-[#15ffd1]/10 rounded-full border border-[#15ffd1]/30">
                  CHRONICLING THE INFINITE // MagnopVS
                </span>
              </div>

              {/* Decryption Query Input */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#15ffd1]" />
                <input
                  type="text"
                  value={codexQuery}
                  onChange={(e) => setCodexQuery(e.target.value)}
                  onFocus={() => setIsRuneDecrypting(true)}
                  onBlur={() => setIsRuneDecrypting(false)}
                  placeholder={isRuneDecrypting ? "᚛᚜ᚬᚮᚱᚦᚠᚢᚲᚷ DECRYPTING..." : "QUERY MATRIX_..."}
                  className="w-full bg-[#0e0e0e] border border-[#41474f] focus:border-[#15ffd1] focus:ring-1 focus:ring-[#15ffd1] rounded-xl py-2 pl-10 pr-4 font-mono text-xs text-[#cee5ff] placeholder-[#8b919a] outline-none transition-all shadow-[0_0_10px_rgba(21,255,209,0.2)]"
                />
                {isRuneDecrypting && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-mono text-[#15ffd1] animate-pulse">
                    DECRYPTING...
                  </span>
                )}
              </div>

              {/* Lore Purity Index */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] font-mono text-[#8b919a]">LORE_PURITY_INDEX</div>
                  <div className="text-lg font-audiowide text-[#15ffd1]">99.84%</div>
                </div>
              </div>
            </div>

            {/* Main Codex Layout */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Center Panel: Tree of Life Interactive Navigation */}
              <div className="flex-1 bg-[#131313]/80 border border-[#41474f]/50 p-6 sm:p-10 rounded-2xl backdrop-blur-xl relative overflow-hidden flex flex-col items-center justify-center min-h-[550px] shadow-[0_0_30px_rgba(152,203,255,0.05)]">
                <div className="text-center mb-8">
                  <h2 className="font-audiowide text-2xl sm:text-3xl text-[#cee5ff]">THE TREE OF LIFE</h2>
                  <p className="font-mono text-xs text-[#8b919a] tracking-[0.3em] mt-1">INTERACTIVE LORE CHRONICLE // MagnopVS</p>
                </div>

                {/* Tree Diagram Container */}
                <div className="relative w-full max-w-3xl h-[420px] flex items-center justify-center">
                  {/* Root: Era of Source */}
                  <div
                    onClick={() => {
                      playSoundEffect('click');
                      setSelectedCodexNode({
                        id: 'source',
                        title: 'ERA OF SOURCE',
                        subtitle: 'ROOT_ORIGIN',
                        description: 'The Genesis singularity and primordial origin of all consciousness in the MagnopVS Multiverse.',
                        era: 'Source Era'
                      });
                    }}
                    className="absolute z-20 top-4 bg-[#131313]/90 border-2 border-[#cee5ff] hover:border-[#15ffd1] p-5 rounded-2xl cursor-pointer hover:scale-105 transition-all shadow-[0_0_25px_rgba(152,203,255,0.3)] group text-center w-56"
                  >
                    <div className="text-[9px] font-mono text-[#cee5ff] tracking-widest uppercase mb-1">ROOT_ORIGIN</div>
                    <h3 className="font-audiowide text-base text-[#cee5ff] group-hover:text-[#15ffd1] transition-colors">ERA OF SOURCE</h3>
                    <p className="font-mono text-[10px] text-[#8b919a] mt-1">The Genesis singularity.</p>
                  </div>

                  {/* Connectors */}
                  <div className="absolute top-[90px] left-[25%] w-32 h-24 border-t-2 border-l-2 border-[#15ffd1]/40 pointer-events-none" />
                  <div className="absolute top-[90px] right-[25%] w-32 h-24 border-t-2 border-r-2 border-[#15ffd1]/40 pointer-events-none" />
                  <div className="absolute top-[180px] h-28 border-l-2 border-[#15ffd1]/40 pointer-events-none" />

                  {/* Era of Chaos (Left) */}
                  <div
                    onClick={() => {
                      playSoundEffect('click');
                      setSelectedCodexNode({
                        id: 'chaos',
                        title: 'ERA OF CHAOS',
                        subtitle: 'DISSOLUTION',
                        description: 'Dissolution of the initial form. Turbulence and emergence of early cosmic entities in MagnopVS.',
                        era: 'Chaos Era'
                      });
                    }}
                    className="absolute top-36 left-4 sm:left-8 bg-[#131313]/90 border border-[#ffabf3] hover:border-[#ff4dfa] p-4 rounded-xl cursor-pointer hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,171,243,0.2)] group text-center w-48"
                  >
                    <h3 className="font-audiowide text-sm text-[#ffabf3] group-hover:text-[#ff4dfa]">ERA OF CHAOS</h3>
                    <p className="font-mono text-[10px] text-[#8b919a] mt-1">Dissolution of form.</p>
                  </div>

                  {/* Era of Form (Right) */}
                  <div
                    onClick={() => {
                      playSoundEffect('click');
                      setSelectedCodexNode({
                        id: 'form',
                        title: 'ERA OF FORM',
                        subtitle: 'HARDENING_REALITY',
                        description: 'The hardening of reality and physical structure across dimensions in the lore of MagnopVS.',
                        era: 'Form Era'
                      });
                    }}
                    className="absolute top-36 right-4 sm:right-8 bg-[#131313]/90 border border-[#98cbff] hover:border-[#cee5ff] p-4 rounded-xl cursor-pointer hover:scale-105 transition-all shadow-[0_0_20px_rgba(152,203,255,0.2)] group text-center w-48"
                  >
                    <h3 className="font-audiowide text-sm text-[#98cbff] group-hover:text-[#cee5ff]">ERA OF FORM</h3>
                    <p className="font-mono text-[10px] text-[#8b919a] mt-1">Hardening of reality.</p>
                  </div>

                  {/* Current Era: The Quantum Weave */}
                  <div
                    onClick={() => {
                      playSoundEffect('click');
                      setSelectedCodexNode({
                        id: 'weave',
                        title: 'THE QUANTVM WEAVE',
                        subtitle: 'ACTIVE_CHRONICLE',
                        description: 'Present intersection of all timelines, sagas, and digital consciousness in MagnopVS.',
                        era: 'Present Era'
                      });
                    }}
                    className="absolute bottom-6 bg-[#131313]/90 border-2 border-[#15ffd1] hover:border-white p-5 rounded-2xl cursor-pointer hover:scale-105 transition-all shadow-[0_0_30px_rgba(21,255,209,0.3)] group text-center w-64"
                  >
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-[#15ffd1] animate-ping" />
                      <span className="font-mono text-[9px] text-[#15ffd1] tracking-widest uppercase">ACTIVE_CHRONICLE</span>
                    </div>
                    <h3 className="font-audiowide text-base text-white group-hover:text-[#15ffd1]">THE QUANTVM WEAVE</h3>
                    <p className="font-mono text-[10px] text-[#8b919a] mt-1">Present intersection of all timelines.</p>
                  </div>
                </div>
              </div>

              {/* Right Panel: Discoveries & Data Readouts */}
              <div className="w-full lg:w-96 flex flex-col gap-6 shrink-0">
                {/* Lore Integrity Monitor */}
                <div className="bg-[#131313]/80 border border-[#41474f]/50 p-6 rounded-2xl backdrop-blur-xl relative shadow-[0_0_20px_rgba(21,255,209,0.1)]">
                  <div className="flex justify-between items-end mb-3 font-mono">
                    <span className="text-xs text-[#8b919a]">LORE INTEGRITY</span>
                    <span className="text-xl font-bold font-audiowide text-[#15ffd1]">99.8%</span>
                  </div>
                  <div className="h-2 w-full bg-[#201f1f] rounded-full overflow-hidden relative">
                    <div className="h-full bg-[#15ffd1] shadow-[0_0_10px_#17ffd1]" style={{ width: '99.8%' }} />
                  </div>
                  <p className="mt-4 font-mono text-[10px] text-[#c1c7d0] leading-relaxed uppercase">
                    Quantum fluctuations detected in 'Era of Chaos' fragments. Auto-stabilization active in MagnopVS...
                  </p>
                </div>

                {/* Discoveries Feed */}
                <div className="bg-[#131313]/80 border border-[#41474f]/50 p-6 rounded-2xl backdrop-blur-xl space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-[#cee5ff]" />
                    <h4 className="font-audiowide text-xs text-[#cee5ff] uppercase tracking-widest">New Discoveries</h4>
                  </div>

                  <div className="space-y-3 font-mono">
                    {discoveries.map((disc) => (
                      <div
                        key={disc.id}
                        onClick={() => {
                          playSoundEffect('click');
                          setSelectedDiscovery(disc);
                        }}
                        className="p-4 border border-[#41474f]/50 hover:border-[#15ffd1] bg-[#1c1b1b]/80 hover:bg-[#15ffd1]/5 rounded-xl cursor-pointer transition-all group"
                      >
                        <div className="flex justify-between items-start mb-1 text-[9px]">
                          <span className={`px-1.5 py-0.5 rounded border uppercase ${
                            disc.type === 'ARTIFACT' ? 'text-[#ffabf3] border-[#ffabf3]/40 bg-[#ffabf3]/10' :
                            disc.type === 'CHARACTER' ? 'text-[#15ffd1] border-[#15ffd1]/40 bg-[#15ffd1]/10' :
                            'text-[#cee5ff] border-[#cee5ff]/40 bg-[#cee5ff]/10'
                          }`}>
                            {disc.type}
                          </span>
                          <span className="text-[#8b919a]">{disc.timeAgo}</span>
                        </div>

                        <h5 className="font-audiowide text-sm text-white group-hover:text-[#15ffd1] transition-colors mb-1">
                          {disc.title}
                        </h5>
                        <p className="text-[10px] text-[#8b919a] line-clamp-2 leading-normal">
                          {disc.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Expand Archive Focus Button */}
                  <button
                    onClick={() => {
                      playSoundEffect('quest');
                      addXpAndMp(150, 50);
                      alert("¡Enfoque del Codex Vivo expandido en MagnopVS! Has obtenido +150 XP y +50 MP.");
                    }}
                    className="w-full mt-4 bg-[#cee5ff] hover:bg-[#15ffd1] text-[#001d33] font-bold py-3 rounded-xl font-mono text-xs tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(152,203,255,0.3)] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Expand Archive Focus (+150 XP)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* GAMES TERMINAL MODE */}
        {/* ========================================================= */}
        {viewMode === 'games' && (
          <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-orbitron animate-fade-in">
            {/* Header / Subheader */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-[#131313]/90 backdrop-blur-xl border border-[#ff4dfa]/40 shadow-[0_0_30px_rgba(255,77,250,0.15)]">
              <div>
                <h1 className="font-audiowide text-2xl sm:text-3xl text-white tracking-widest uppercase">
                  MagnopVS QUANTVM MATRIX — GAMES TERMINAL
                </h1>
                <p className="text-xs text-[#98cbff] font-mono tracking-wider mt-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#15ffd1] animate-ping" />
                  SECURE_NODE: G-772 // ENCRYPTION: QUANTUM_2048 // MagnopVS MULTIVERSE
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    playSoundEffect('quest');
                    addXpAndMp(150, 50);
                    alert("¡Enlace Neuronal lanzado con éxito en la Matrix de MagnopVS! (+150 XP / +50 MP)");
                  }}
                  className="px-5 py-2.5 bg-[#15ffd1] text-[#00382c] font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(21,255,209,0.4)] hover:brightness-110 flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Launch Neural Link (+150 XP)</span>
                </button>
              </div>
            </div>

            {/* Featured Banner */}
            <div className="relative h-[360px] rounded-3xl overflow-hidden border border-[#41474f]/60 bg-[#131313] group shadow-[0_0_30px_rgba(152,203,255,0.1)]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjsRuALJbXC0ZQ_5nMU7w2QYIlqRklHJvyuUK_7YzUKCubDp9Ttmixcqbs_zADGlpGy-XS3YbofYOd7xylzvq_nv6b_BOFE6Dq3o5l1nMbeVjy5QRTGnmQ2Rt_SCJ6rH7qFSSzs5k-JE9cv9SUaLHkgeMUgkgo0Yz9gNxv5rCEwhXoZHG8qy_NkVZeR-efHskoeRAvIFTqiYyYV1nGq-oEPTCpA_sknoYQyZujtVnQfcqiYwRbdGzzyp9MYcZa3dyGHX1nk91jRgwF"
                alt="Quantvm Multiverse Scope"
                className="w-full h-full object-cover opacity-60 group-hover:opacity-75 transition-opacity duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/40 to-transparent" />

              {/* Corner brackets */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#15ffd1]" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#15ffd1]" />

              <div className="absolute bottom-8 left-8 right-8 space-y-3">
                <div className="flex items-center gap-2 text-[#15ffd1] text-xs font-mono font-bold tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-[#15ffd1] animate-pulse" />
                  LIVE MULTIVERSE SYNC ACTIVE // MagnopVS
                </div>
                <h2 className="font-audiowide text-2xl sm:text-4xl text-white">Quantvm Multiverse Scope</h2>
                <p className="font-mono text-xs text-[#c1c7d0] max-w-2xl leading-relaxed">
                  Access the terminal to bridge through localized digital realities. Synchronize your neural interface with thousands of concurrent gaming planes across the MagnopVS multiverse. High-fidelity data transfer currently optimal.
                </p>
              </div>
            </div>

            {/* Terminals Grid Section */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#41474f]/40 pb-4">
                <div>
                  <h2 className="font-audiowide text-xl text-[#cee5ff] uppercase tracking-wider">Available Terminals</h2>
                  <p className="text-[10px] font-mono text-[#8b919a] mt-0.5">SECURE_NODE: G-772 // ENCRYPTION: QUANTUM_2048</p>
                </div>

                {/* Filter buttons */}
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  {['ALL', 'CYBER-NOIR', 'SPACE OPERA', 'SURVIVAL', 'ARTHOUSE RPG'].map((f) => (
                    <button
                      key={f}
                      onClick={() => { setTerminalFilter(f); playSoundEffect('click'); }}
                      className={`px-3 py-1.5 rounded-xl border text-[11px] uppercase transition-all cursor-pointer ${
                        terminalFilter === f
                          ? 'bg-[#15ffd1]/20 border-[#15ffd1] text-[#15ffd1] font-bold shadow-[0_0_10px_rgba(21,255,209,0.2)]'
                          : 'border-[#41474f]/50 text-[#8b919a] hover:text-white hover:border-[#8b919a]'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {gameTerminals
                  .filter((g) => terminalFilter === 'ALL' || g.genre === terminalFilter)
                  .map((game) => (
                    <div
                      key={game.id}
                      className={`relative group bg-[#131313]/90 border rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 backdrop-blur-xl ${
                        game.borderType === 'magenta'
                          ? 'border-[#ff4dfa]/40 hover:border-[#ff4dfa] hover:shadow-[0_0_20px_rgba(255,77,250,0.25)]'
                          : 'border-[#98cbff]/40 hover:border-[#98cbff] hover:shadow-[0_0_20px_rgba(152,203,255,0.25)]'
                      }`}
                    >
                      {/* Image Header */}
                      <div className="relative h-48 overflow-hidden bg-[#1c1b1b]">
                        <img
                          src={game.image}
                          alt={game.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase bg-black/70 text-white border border-white/20">
                          {game.genre}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-audiowide text-lg text-white group-hover:text-[#15ffd1] transition-colors mb-2">
                            {game.title}
                          </h3>
                          <div className="space-y-1.5 font-mono text-[11px] text-[#8b919a]">
                            <div className="flex justify-between">
                              <span>SYNC_STABILITY</span>
                              <span className="text-[#15ffd1] font-bold">{game.syncStability}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>PLAYERS_ONLINE</span>
                              <span className="text-[#cee5ff] font-bold">{game.playersOnline}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            playSoundEffect('click');
                            setSelectedGameTerminal(game);
                          }}
                          className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-2 border ${
                            game.borderType === 'magenta'
                              ? 'border-[#ff4dfa] text-[#ff4dfa] hover:bg-[#ff4dfa] hover:text-black shadow-[0_0_10px_rgba(255,77,250,0.2)]'
                              : 'border-[#cee5ff] text-[#cee5ff] hover:bg-[#cee5ff] hover:text-black shadow-[0_0_10px_rgba(152,203,255,0.2)]'
                          }`}
                        >
                          <Terminal className="w-4 h-4" />
                          <span>INITIALIZE LINK</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Footer HUD */}
            <div className="pt-6 border-t border-[#41474f]/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-[#8b919a]">
              <div className="text-[#ff4dfa] animate-pulse uppercase">
                © 2124 MagnopVS Quantvm Matrix System. Unauthorized access is a cortical violation.
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <span>Network Status: <strong className="text-[#15ffd1]">Stable</strong></span>
                <span>Latency: <strong className="text-[#cee5ff]">4ms</strong></span>
                <span>Core Temp: <strong className="text-[#15ffd1]">32K</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* GAME TERMINAL MODAL */}
        {selectedGameTerminal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in font-orbitron">
            <div className="bg-[#131313] border-2 border-[#15ffd1] w-full max-w-xl rounded-3xl p-6 shadow-[0_0_50px_rgba(21,255,209,0.3)] relative space-y-6">
              <div className="flex justify-between items-center border-b border-[#41474f]/50 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#15ffd1] uppercase tracking-widest">
                    TERMINAL LINK // {selectedGameTerminal.genre}
                  </span>
                  <h3 className="text-2xl font-audiowide text-white uppercase mt-0.5">{selectedGameTerminal.title}</h3>
                </div>
                <button onClick={() => setSelectedGameTerminal(null)} className="p-2 text-[#8b919a] hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative h-48 rounded-xl overflow-hidden border border-[#41474f]/50">
                <img src={selectedGameTerminal.image} alt={selectedGameTerminal.title} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-4 text-xs font-mono text-[#c1c7d0]">
                <p className="leading-relaxed">{selectedGameTerminal.description}</p>
                <div className="bg-[#1c1b1b] p-4 rounded-xl border border-[#41474f]/40 space-y-2">
                  <div className="flex justify-between"><span className="text-[#8b919a]">SYNC STABILITY:</span><span className="text-[#15ffd1]">{selectedGameTerminal.syncStability}</span></div>
                  <div className="flex justify-between"><span className="text-[#8b919a]">PLAYERS ONLINE:</span><span className="text-[#cee5ff]">{selectedGameTerminal.playersOnline}</span></div>
                  <div className="flex justify-between"><span className="text-[#8b919a]">QUANTUM CHANNEL:</span><span className="text-[#15ffd1]">MagnopVS-G772-{selectedGameTerminal.id.toUpperCase()}</span></div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#41474f]/50">
                <button onClick={() => setSelectedGameTerminal(null)} className="px-4 py-2 border border-[#41474f] text-[#8b919a] rounded-xl text-xs uppercase cursor-pointer">
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    playSoundEffect('level');
                    addXpAndMp(200, 100);
                    if (selectedGameTerminal.id === 'eleusis_path') {
                      setStudioMode('eleusis');
                    } else {
                      alert(`¡Enlace Neuronal establecido con ${selectedGameTerminal.title} en MagnopVS! Recompensa: +200 XP y +100 MP.`);
                    }
                    setSelectedGameTerminal(null);
                  }}
                  className="px-5 py-2 bg-[#15ffd1] text-[#00382c] font-bold rounded-xl text-xs uppercase cursor-pointer shadow-[0_0_15px_rgba(21,255,209,0.3)] flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Establecer Enlace Neuronal (+200 XP)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* RESONANCE HUB MODE */}
        {/* ========================================================= */}
        {viewMode === 'resonance_hub' && (
          <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-orbitron animate-fade-in">
            {/* Header / Subheader */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-[#131313]/90 backdrop-blur-xl border border-[#15ffd1]/40 shadow-[0_0_30px_rgba(21,255,209,0.15)]">
              <div>
                <h1 className="font-audiowide text-2xl sm:text-3xl text-white tracking-widest uppercase">
                  MagnopVS QUANTVM MATRIX — RESONANCE HUB
                </h1>
                <p className="text-xs text-[#98cbff] font-mono tracking-wider mt-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#15ffd1] animate-ping" />
                  TELEMETRY ACTIVE // 428,912 VIEWER SYNC // MagnopVS MULTIVERSE
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    playSoundEffect('level');
                    addXpAndMp(200, 100);
                    alert("¡Resonancia Neuronal sincronizada en el Resonance Hub de MagnopVS! (+200 XP / +100 MP)");
                  }}
                  className="px-5 py-2.5 bg-[#15ffd1] text-[#00382c] font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(21,255,209,0.4)] hover:brightness-110 flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Sync Frequency (+200 XP)</span>
                </button>
              </div>
            </div>

            {/* Dynamic Resonance Layout (Main Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left & Center Canvas (2 Columns) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Main Visual Asset / Live Viewport */}
                <div className="relative h-[420px] rounded-3xl overflow-hidden border border-[#41474f]/60 bg-[#0e0e0e] group shadow-[0_0_30px_rgba(21,255,209,0.1)] flex flex-col justify-between">
                  <img
                    src="https://lh3.googleusercontent.com/aida/AP1WRLsk0LchHI4bhM-foIUhbGLjTijLQXQClnIoH92h9ejdyErChMdhaPXa0jfSZtGQ-LzN3RfxIgB3m0LVKyty57CRoUnPW0Zq5A7S0SjakyOzkkd6F7Shkdif4v9vLxm30_BOuZfoJIEf57f9vejcheMUEPTkBTP-LWSbXQPQBfGPNAa7rheUP3jXFZgJ2LYnhRqiwK1XTxZDy42mDhQl7YsCT0XiLMwCgWQjCHWCbEae1Uy4P5-3lbFd96k"
                    alt="Resonance Hub Live Manifestation"
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/30 to-transparent" />

                  {/* Top Bar Badges */}
                  <div className="relative z-10 p-6 flex justify-between items-start">
                    <div className="px-4 py-2 rounded-xl bg-[#131313]/80 backdrop-blur-md border-l-4 border-[#15ffd1] border-y border-r border-[#41474f]/50">
                      <span className="text-[10px] font-mono text-[#15ffd1] tracking-widest uppercase block">Live Manifestation</span>
                      <span className="font-audiowide text-lg sm:text-xl text-white">PKD BATTLE: NEON SECTOR</span>
                    </div>

                    <div className="px-3 py-1.5 rounded-xl bg-[#131313]/80 backdrop-blur-md border border-[#41474f]/50 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#15ffd1] animate-pulse" />
                      <span className="font-mono text-xs text-white font-bold">428,912 VIEWER SYNC</span>
                    </div>
                  </div>

                  {/* HUD Overlay Bottom */}
                  <div className="relative z-10 p-6 border-t border-[#15ffd1]/20 bg-[#0e0e0e]/80 backdrop-blur-md flex justify-between items-end">
                    <div className="space-y-1.5">
                      <div className="font-mono text-[10px] text-[#98cbff] tracking-wider uppercase">PARTICIPANT SIGILS</div>
                      <div className="flex gap-2">
                        <div className="w-10 h-10 rounded-xl border border-[#98cbff]/40 bg-[#98cbff]/10 flex items-center justify-center text-[#98cbff]">
                          <Zap className="w-5 h-5" />
                        </div>
                        <div className="w-10 h-10 rounded-xl border border-[#15ffd1]/40 bg-[#15ffd1]/10 flex items-center justify-center text-[#15ffd1]">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div className="w-10 h-10 rounded-xl border border-[#ff4dfa]/40 bg-[#ff4dfa]/10 flex items-center justify-center text-[#ff4dfa]">
                          <Shield className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono text-[10px] text-[#98cbff] tracking-wider uppercase">RESISTANCE VALUE</div>
                      <div className="font-audiowide text-2xl sm:text-3xl text-[#15ffd1]">88.42%</div>
                    </div>
                  </div>
                </div>

                {/* Timeline of Fate */}
                <div className="bg-[#131313]/90 rounded-2xl p-6 border border-[#41474f]/50 backdrop-blur-xl space-y-4">
                  <div className="flex flex-wrap justify-between items-center border-b border-[#41474f]/40 pb-3">
                    <span className="font-mono text-xs text-[#8b919a] tracking-widest uppercase font-bold">TIMELINE OF FATE</span>
                    <div className="flex gap-4 font-mono text-[11px]">
                      <span className="text-[#15ffd1]">PAST ECHOES</span>
                      <span className="text-[#98cbff] underline underline-offset-4 font-bold">ACTIVE PRESENT</span>
                      <span className="text-[#8b919a]">FUTURE PROJECTIONS</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
                    {[
                      { time: 'T-MINUS 04:00', title: 'Void Breach', status: 'past' },
                      { time: 'T-MINUS 02:00', title: 'Solar Collapse', status: 'past' },
                      { time: 'NOW IN SYNC', title: 'Neon Sector Battle', status: 'active' },
                      { time: 'T-PLUS 01:30', title: 'Etheric Surge', status: 'future' },
                      { time: 'T-PLUS 03:00', title: 'Magno Inversion', status: 'future' },
                      { time: 'T-PLUS 05:00', title: 'Final Manifest', status: 'future' },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          playSoundEffect('click');
                          alert(`Timeline node selected: ${item.title} (${item.time})`);
                        }}
                        className={`p-3 rounded-xl border flex flex-col justify-between transition-all cursor-pointer ${
                          item.status === 'active'
                            ? 'bg-[#15ffd1]/10 border-[#15ffd1] shadow-[0_0_15px_rgba(21,255,209,0.2)]'
                            : 'bg-[#1c1b1b] border-[#41474f]/50 hover:border-[#98cbff]'
                        }`}
                      >
                        <span className={`text-[9px] font-mono ${item.status === 'active' ? 'text-[#15ffd1] font-bold' : 'text-[#8b919a]'}`}>
                          {item.time}
                        </span>
                        <span className="text-xs font-mono font-bold text-white truncate mt-1">{item.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Sidebar: Spectator Presence & MagnoStakes */}
              <div className="space-y-6">
                {/* Spectator Presence */}
                <div className="bg-[#131313]/90 rounded-2xl p-5 border border-[#41474f]/50 backdrop-blur-xl space-y-4">
                  <div className="flex justify-between items-center border-b border-[#41474f]/40 pb-3">
                    <h3 className="font-mono text-xs text-[#98cbff] tracking-widest font-bold uppercase">SPECTATOR PRESENCE</h3>
                    <Globe className="w-4 h-4 text-[#8b919a]" />
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div className="relative group cursor-pointer">
                      <div className="w-12 h-12 rounded-xl bg-[#2a2a2a] border border-[#15ffd1] overflow-hidden shadow-[0_0_10px_rgba(21,255,209,0.3)]">
                        <img
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAxzfcXq9vFg2PtJHzbOutdwnEPACLo-mxMYYKzlmDpuIqv_2jR_VEbIjWAKv4V3lO5yJ2BWzTAB90pOTd3qqmRfHnoPINU7nbtvUr-YBlbVV_mMreeNnLrIxTdFwRKb6gN0W_1dIQbzecl6UPcdb0ezWB3jV16SEsZTGeZVIm7PGKUcs_EaROdkd5mFAZOAjNVX-U4SivHu34owNJbZZyGCYGgbVXqwVHkLJbce-ZoGXCIGDUVWqeFypiK3i7rVQ_mIUaBEya3ZZN"
                          alt="Cyan Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#15ffd1] rounded-full border-2 border-[#131313]" />
                    </div>

                    <div className="relative group cursor-pointer">
                      <div className="w-12 h-12 rounded-xl bg-[#2a2a2a] border border-[#ff4dfa] overflow-hidden shadow-[0_0_10px_rgba(255,77,250,0.3)]">
                        <img
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEgjYJUAMWBYjP21RuKsuY4QkTNTe28g6r7Ct2K5NCKkR0L231l0y_ocG3rOqru5xeGU5mdoBa8U5biPvBHBhUc2WiS-ksSBISmCbUnLG7K7FGa8mou-iKm234roPCygGN7uAGFXgaOfB3gVYfUBsCa3m36dGbLwFaYXypAoSnQ4CR_7zBXsihZCE2lwMXkLAVhXKOKub0e-aAX4Z6EM7xi1G73QUG9snbIlllf1hp_Dj9S-24MRfAJDcLpNY7dHyFmbYA_hwmanSu"
                          alt="Violet Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#15ffd1] rounded-full border-2 border-[#131313]" />
                    </div>

                    <div className="relative group cursor-pointer">
                      <div className="w-12 h-12 rounded-xl bg-[#2a2a2a] border border-[#15ffd1] overflow-hidden shadow-[0_0_10px_rgba(21,255,209,0.3)]">
                        <img
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvKOsVdnI6HH1Q1lC-aCoUlcy_FuJEIICohJ_xEyprwN6SZOSvGsZhOAenMbIO23rcKAtzq1itkYVdyyl9kax9XdMj6QkIsWhyqaK-p3KXXZWW7Zorysz4JuN-tEXXHKMz48tvrDPDJ6nNqOdtU_fe22-QxP6xP1XBpV8oBBwbRwHFp1n2oCSgOhvzD0oUxsHY5ru9hD9si1VrX4aHwtjW_x_-fv6CfRDblGhKTRrxGQ28UuduF3LkG7S79tmAo5GJmYuC_HAGflNM"
                          alt="Emerald Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#ff4dfa] rounded-full border-2 border-[#131313]" />
                    </div>

                    <div className="w-12 h-12 rounded-xl border border-dashed border-[#8b919a] flex items-center justify-center text-[#8b919a] text-xs font-mono font-bold">
                      +42k
                    </div>
                  </div>
                </div>

                {/* Active Chat Signals & Live Betting */}
                <div className="bg-[#131313]/90 rounded-2xl p-5 border border-[#41474f]/50 backdrop-blur-xl space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-mono text-xs text-[#98cbff] tracking-widest font-bold uppercase border-b border-[#41474f]/40 pb-3 mb-3">
                      ACTIVE CHAT SIGNALS
                    </h3>

                    {/* Chat Messages Log */}
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                      {chatMessages.map((msg) => (
                        <div key={msg.id} className="space-y-0.5 bg-[#1c1b1b] p-2.5 rounded-xl border border-[#41474f]/30">
                          <span className={`font-mono text-[10px] font-bold ${msg.color}`}>{msg.sender}</span>
                          <p className="text-xs font-mono text-[#c1c7d0] leading-snug">{msg.text}</p>
                        </div>
                      ))}
                    </div>

                    {/* Chat Input */}
                    <div className="flex gap-2 mt-3">
                      <input
                        type="text"
                        value={newChatInput}
                        onChange={(e) => setNewChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newChatInput.trim()) {
                            playSoundEffect('click');
                            setChatMessages(prev => [
                              ...prev,
                              { id: Date.now().toString(), sender: player.name || 'PILOT_USER', text: newChatInput.trim(), color: 'text-[#cee5ff]' }
                            ]);
                            setNewChatInput('');
                          }
                        }}
                        placeholder="Emit signal to Matrix..."
                        className="flex-1 bg-[#1c1b1b] border border-[#41474f] rounded-xl px-3 py-1.5 text-xs font-mono text-white placeholder-[#8b919a] focus:outline-none focus:border-[#15ffd1]"
                      />
                      <button
                        onClick={() => {
                          if (newChatInput.trim()) {
                            playSoundEffect('click');
                            setChatMessages(prev => [
                              ...prev,
                              { id: Date.now().toString(), sender: player.name || 'PILOT_USER', text: newChatInput.trim(), color: 'text-[#cee5ff]' }
                            ]);
                            setNewChatInput('');
                          }
                        }}
                        className="px-3 py-1.5 bg-[#15ffd1] text-[#00382c] rounded-xl font-bold text-xs cursor-pointer hover:brightness-110"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Betting Event */}
                  <div className="bg-[#1c1b1b] p-4 rounded-xl border border-[#15ffd1]/30 space-y-3 mt-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#15ffd1]" />
                      <span className="font-mono text-[10px] font-bold text-[#15ffd1] uppercase tracking-wider">LIVE BETTING EVENT</span>
                    </div>
                    <p className="text-xs font-mono font-bold text-white">WILL THE NEON SECTOR COLLAPSE?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedBet('YES');
                          playSoundEffect('click');
                        }}
                        className={`flex-1 py-2 rounded-xl border font-mono text-xs font-bold transition-all cursor-pointer ${
                          selectedBet === 'YES'
                            ? 'bg-[#15ffd1] text-[#00382c] border-[#15ffd1] shadow-[0_0_10px_rgba(21,255,209,0.3)]'
                            : 'bg-[#15ffd1]/10 border-[#15ffd1] text-[#15ffd1] hover:bg-[#15ffd1]/20'
                        }`}
                      >
                        YES [2.4x]
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBet('NO');
                          playSoundEffect('click');
                        }}
                        className={`flex-1 py-2 rounded-xl border font-mono text-xs font-bold transition-all cursor-pointer ${
                          selectedBet === 'NO'
                            ? 'bg-[#ff4dfa] text-black border-[#ff4dfa] shadow-[0_0_10px_rgba(255,77,250,0.3)]'
                            : 'bg-[#ff4dfa]/10 border-[#ff4dfa] text-[#ff4dfa] hover:bg-[#ff4dfa]/20'
                        }`}
                      >
                        NO [1.8x]
                      </button>
                    </div>
                  </div>
                </div>

                {/* MagnoStakes Dashboard */}
                <div className="bg-[#131313]/90 rounded-2xl p-5 border border-[#41474f]/50 backdrop-blur-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#98cbff] font-bold tracking-wider">MY MAGNOSTAKES</span>
                    <span className="font-mono text-xs text-[#15ffd1] font-bold">{myStakesAmount.toFixed(2)} Δ</span>
                  </div>

                  <button
                    onClick={() => {
                      playSoundEffect('quest');
                      addXpAndMp(200, 100);
                      setMyStakesAmount(prev => prev + 50);
                      alert("¡MagnoStake ejecutado con éxito en la Matrix! (+200 XP, +100 MP, +50 Δ)");
                    }}
                    className="w-full py-3 bg-[#98cbff] text-[#003354] font-mono text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer hover:shadow-[0_0_20px_rgba(152,203,255,0.4)] hover:brightness-110 active:scale-95"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>EXECUTE MAGNOSTAKE</span>
                  </button>

                  <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-[#41474f]/40 font-mono">
                    <div>
                      <div className="text-[9px] text-[#8b919a]">WIN RATE</div>
                      <div className="text-xs font-bold text-white">68%</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-[#8b919a]">TOTAL YIELD</div>
                      <div className="text-xs font-bold text-[#15ffd1]">+42.1k</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-[#8b919a]">RANK</div>
                      <div className="text-xs font-bold text-[#ff4dfa]">TITAN</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer HUD */}
            <div className="pt-6 border-t border-[#41474f]/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-[#8b919a]">
              <div className="text-[#ff4dfa] animate-pulse uppercase">
                © 2124 MagnopVS Quantvm Matrix System. Unauthorized access is a cortical violation.
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <span>Network Status: <strong className="text-[#15ffd1]">Stable</strong></span>
                <span>Latency: <strong className="text-[#cee5ff]">12ms</strong></span>
                <span>Core Temp: <strong className="text-[#15ffd1]">32K</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* UPLINK CENTER MODE (DOWNLOAD VAULT) */}
        {/* ========================================================= */}
        {viewMode === 'uplink' && (
          <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-orbitron animate-fade-in">
            {/* Header / Subheader */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 p-6 rounded-2xl bg-[#131313]/90 backdrop-blur-xl border border-[#98cbff]/40 shadow-[0_0_30px_rgba(152,203,255,0.15)]">
              <div>
                <h1 className="font-audiowide text-2xl sm:text-4xl text-[#98cbff] uppercase tracking-tighter mb-2">
                  DOWNLOAD_VAULT // MagnopVS UPLINK
                </h1>
                <div className="flex items-center gap-4 text-xs font-mono text-[#98cbff]/80">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-[#15ffd1] rounded-full animate-pulse" />
                    UPLINK_ESTABLISHED
                  </span>
                  <span className="w-[1px] h-4 bg-[#41474f]" />
                  <span className="uppercase text-[#c1c7d0]">Active Repository: Core_Alpha</span>
                </div>
              </div>

              {/* Asset Category Filters */}
              <div className="flex flex-wrap gap-2 font-mono text-xs">
                {['ALL', '3D_MODELS', 'TEXTURES', 'SHADERS', 'LORE_DOCS'].map((f) => (
                  <button
                    key={f}
                    onClick={() => { setUplinkFilter(f as any); playSoundEffect('click'); }}
                    className={`px-4 py-2 rounded-xl border text-xs uppercase transition-all cursor-pointer ${
                      uplinkFilter === f
                        ? 'bg-[#98cbff]/20 border-[#98cbff] text-[#98cbff] font-bold shadow-[0_0_15px_rgba(152,203,255,0.25)]'
                        : 'border-[#41474f]/50 text-[#8b919a] hover:text-white hover:border-[#8b919a]'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Asset Grid (2 Columns) */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {uplinkAssets
                  .filter((asset) => uplinkFilter === 'ALL' || asset.type === uplinkFilter)
                  .map((asset) => (
                    <div
                      key={asset.id}
                      className={`relative group bg-[#131313]/90 border rounded-2xl p-5 overflow-hidden flex flex-col justify-between transition-all duration-300 backdrop-blur-xl ${
                        asset.typeBadge === 'LORE_DOC'
                          ? 'border-[#ff4dfa]/40 hover:border-[#ff4dfa] hover:shadow-[0_0_20px_rgba(255,77,250,0.25)]'
                          : 'border-[#41474f]/60 hover:border-[#98cbff] hover:shadow-[0_0_20px_rgba(152,203,255,0.25)]'
                      }`}
                    >
                      {/* Image Preview / Icon Box */}
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#0e0e0e] border border-[#41474f]/40 flex items-center justify-center mb-4">
                        {asset.image ? (
                          <img
                            src={asset.image}
                            alt={asset.title}
                            className="absolute inset-0 w-full h-full object-cover opacity-65 group-hover:opacity-85 transition-opacity duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-[#98cbff]/5">
                            <RefreshCw className="w-10 h-10 text-[#98cbff]/40 animate-spin" />
                          </div>
                        )}
                        <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded text-[9px] font-mono font-bold tracking-wider uppercase bg-[#0e0e0e]/80 text-[#98cbff] border border-[#41474f]/50">
                          {asset.typeBadge}
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-mono font-bold text-base text-white group-hover:text-[#98cbff] transition-colors truncate">
                            {asset.title}
                          </h3>
                          <div className="flex justify-between items-center font-mono text-xs text-[#8b919a] mt-1.5">
                            <span>{asset.size}</span>
                            <span className={`flex items-center gap-1 font-bold ${asset.statusType === 'verified' ? 'text-[#15ffd1]' : 'text-[#98cbff] animate-pulse'}`}>
                              <CheckCircle className="w-3.5 h-3.5" />
                              {asset.status}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#41474f]/40 font-mono text-[10px]">
                          <button
                            onClick={() => {
                              playSoundEffect('click');
                              alert(`Sincronizando ${asset.title} con los servidores de MagnopVS...`);
                            }}
                            className="py-2 border border-[#41474f] hover:bg-[#2a2a2a] text-[#c1c7d0] rounded-xl uppercase transition-all cursor-pointer text-center"
                          >
                            RE-SYNC
                          </button>
                          <button
                            onClick={() => {
                              playSoundEffect('click');
                              setUplinkAssets(prev => prev.filter(a => a.id !== asset.id));
                            }}
                            className="py-2 border border-[#41474f] hover:bg-[#93000a]/30 hover:text-[#ffdad6] text-[#8b919a] rounded-xl uppercase transition-all cursor-pointer text-center"
                          >
                            DELETE
                          </button>
                          <button
                            onClick={() => {
                              playSoundEffect('quest');
                              setSelectedUplinkAsset(asset);
                            }}
                            className={`py-2 rounded-xl uppercase font-bold transition-all cursor-pointer text-center ${
                              asset.typeBadge === 'LORE_DOC'
                                ? 'bg-[#ff4dfa] text-black hover:brightness-110 shadow-[0_0_10px_rgba(255,77,250,0.3)]'
                                : 'bg-[#98cbff] text-[#003354] hover:brightness-110 shadow-[0_0_10px_rgba(152,203,255,0.3)]'
                            }`}
                          >
                            {asset.typeBadge === 'LORE_DOC' ? 'DECRYPT' : 'OPEN'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                {/* Request New Uplink Card */}
                <button
                  onClick={() => {
                    playSoundEffect('level');
                    addXpAndMp(150, 75);
                    alert("¡Solicitud de nuevo Uplink enviada a la Red MagnopVS! Recompensa: +150 XP / +75 MP.");
                  }}
                  className="bg-[#131313]/90 border border-dashed border-[#98cbff]/40 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:bg-[#98cbff]/5 hover:border-[#98cbff] transition-all group min-h-[260px] cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full border border-[#98cbff]/30 flex items-center justify-center group-hover:scale-110 group-hover:border-[#98cbff] transition-all">
                    <Plus className="w-8 h-8 text-[#98cbff]" />
                  </div>
                  <span className="font-mono text-xs font-bold text-[#98cbff] tracking-widest uppercase">
                    REQUEST_NEW_UPLINK (+150 XP)
                  </span>
                </button>
              </div>

              {/* Side Telemetry Panel */}
              <div className="space-y-6">
                {/* Storage Monitor */}
                <div className="bg-[#131313]/90 rounded-2xl p-6 border border-[#41474f]/50 backdrop-blur-xl space-y-4">
                  <h4 className="font-mono font-bold text-xs text-[#98cbff] uppercase tracking-wider border-b border-[#41474f]/40 pb-3">
                    Storage_Monitor
                  </h4>
                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#8b919a]">Used: 42.8 GB</span>
                      <span className="text-[#98cbff] font-bold">Total: 128 GB</span>
                    </div>
                    <div className="h-2 w-full bg-[#0e0e0e] rounded-full overflow-hidden border border-[#41474f]/30">
                      <div className="h-full bg-[#98cbff] shadow-[0_0_10px_#98cbff]" style={{ width: '33%' }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center font-mono">
                    <div className="p-3 bg-[#1c1b1b] rounded-xl border border-[#41474f]/40">
                      <div className="text-sm font-bold text-[#98cbff]">142</div>
                      <div className="text-[10px] text-[#8b919a] uppercase mt-0.5">Local_Files</div>
                    </div>
                    <div className="p-3 bg-[#1c1b1b] rounded-xl border border-[#41474f]/40">
                      <div className="text-sm font-bold text-[#ff4dfa]">3.1 GB</div>
                      <div className="text-[10px] text-[#8b919a] uppercase mt-0.5">Cache_Usage</div>
                    </div>
                  </div>
                </div>

                {/* Network Telemetry */}
                <div className="bg-[#131313]/90 rounded-2xl p-6 border border-[#41474f]/50 backdrop-blur-xl space-y-4">
                  <h4 className="font-mono font-bold text-xs text-[#98cbff] uppercase tracking-wider border-b border-[#41474f]/40 pb-3">
                    Network_Signal
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 flex items-center justify-center font-mono">
                      <svg className="w-full h-full -rotate-90">
                        <circle className="text-[#41474f]" cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" strokeWidth="4" />
                        <circle className="text-[#15ffd1]" cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" strokeDasharray="125.6" strokeDashoffset="25.12" strokeWidth="4" />
                      </svg>
                      <span className="absolute text-[10px] font-bold text-[#15ffd1]">80%</span>
                    </div>
                    <div className="font-mono text-xs space-y-0.5">
                      <div className="text-white font-bold">STRENGTH: OPTIMAL</div>
                      <div className="text-[10px] text-[#8b919a]">NODE: US-WEST-01 // MagnopVS</div>
                    </div>
                  </div>
                  <div className="space-y-1.5 font-mono text-[11px] text-[#8b919a] uppercase pt-2 border-t border-[#41474f]/30">
                    <div className="flex justify-between">
                      <span>Latency:</span>
                      <span className="text-[#15ffd1] font-bold">12ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>DL_Rate:</span>
                      <span className="text-[#98cbff] font-bold">124 Mbps</span>
                    </div>
                  </div>
                </div>

                {/* Active Syncs */}
                <div className="bg-[#131313]/90 rounded-2xl p-6 border border-[#41474f]/50 backdrop-blur-xl space-y-4">
                  <h4 className="font-mono font-bold text-xs text-[#98cbff] uppercase tracking-wider border-b border-[#41474f]/40 pb-3">
                    Active_Background_Syncs
                  </h4>
                  <div className="space-y-3 font-mono">
                    <div className="flex items-center gap-3 bg-[#1c1b1b] p-3 rounded-xl border border-[#41474f]/40">
                      <div className="w-1.5 h-8 bg-[#98cbff] rounded-full" />
                      <div>
                        <div className="text-xs font-bold text-[#98cbff] uppercase">Void_Shader_Library_v2</div>
                        <div className="text-[10px] text-[#8b919a]">DL: 8.2 MB/s (68%)</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-[#1c1b1b]/50 p-3 rounded-xl border border-[#41474f]/30 opacity-60">
                      <div className="w-1.5 h-8 bg-[#8b919a] rounded-full" />
                      <div>
                        <div className="text-xs font-bold text-[#8b919a] uppercase">System_Patch_04.12</div>
                        <div className="text-[10px] text-[#8b919a] italic">QUEUED_IN_LINE</div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      playSoundEffect('click');
                      alert("Mostrando todo el tráfico de datos en la Red Quantvm de MagnopVS.");
                    }}
                    className="w-full py-2.5 bg-[#1c1b1b] hover:bg-[#2a2a2a] border border-[#41474f] text-[#c1c7d0] font-mono text-xs uppercase rounded-xl transition-all cursor-pointer"
                  >
                    VIEW_ALL_TRAFFIC
                  </button>
                </div>
              </div>
            </div>

            {/* Footer HUD */}
            <div className="pt-6 border-t border-[#41474f]/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-[#8b919a]">
              <div className="text-[#ff4dfa] animate-pulse uppercase">
                © 2124 MagnopVS Quantvm Matrix System. Unauthorized access is a cortical violation.
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <span>Network Status: <strong className="text-[#15ffd1]">Stable</strong></span>
                <span>Latency: <strong className="text-[#cee5ff]">12ms</strong></span>
                <span>Core Temp: <strong className="text-[#15ffd1]">32K</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TRANSMEDIA HUB MODE (PELICULAS, DOCS, CURSOS, LIVES, TV, DRAMAS, LIBROS, JUEGOS) */}
        {/* ========================================================= */}
        {viewMode === 'transmedia' && <QuantvmTransmediaHub />}

        {/* UPLINK ASSET DETAIL MODAL */}
        {selectedUplinkAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in font-orbitron">
            <div className="bg-[#131313] border-2 border-[#98cbff] w-full max-w-lg rounded-3xl p-6 shadow-[0_0_50px_rgba(152,203,255,0.3)] relative space-y-6">
              <div className="flex justify-between items-center border-b border-[#41474f]/50 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#98cbff] uppercase tracking-widest">
                    UPLINK ASSET // {selectedUplinkAsset.typeBadge}
                  </span>
                  <h3 className="text-xl font-audiowide text-white uppercase mt-0.5">{selectedUplinkAsset.title}</h3>
                </div>
                <button onClick={() => setSelectedUplinkAsset(null)} className="p-2 text-[#8b919a] hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedUplinkAsset.image && (
                <div className="relative h-48 rounded-xl overflow-hidden border border-[#41474f]/50">
                  <img src={selectedUplinkAsset.image} alt={selectedUplinkAsset.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="space-y-4 text-xs font-mono text-[#c1c7d0]">
                <p className="leading-relaxed">{selectedUplinkAsset.description}</p>
                <div className="bg-[#1c1b1b] p-4 rounded-xl border border-[#41474f]/40 space-y-2">
                  <div className="flex justify-between"><span className="text-[#8b919a]">ASSET SIZE:</span><span className="text-[#15ffd1]">{selectedUplinkAsset.size}</span></div>
                  <div className="flex justify-between"><span className="text-[#8b919a]">STATUS:</span><span className="text-[#cee5ff]">{selectedUplinkAsset.status}</span></div>
                  <div className="flex justify-between"><span className="text-[#8b919a]">SECURITY ENCRYPTION:</span><span className="text-[#15ffd1]">MagnopVS QUANTUM-SHA256</span></div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#41474f]/50">
                <button onClick={() => setSelectedUplinkAsset(null)} className="px-4 py-2 border border-[#41474f] text-[#8b919a] rounded-xl text-xs uppercase cursor-pointer">
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    playSoundEffect('level');
                    addXpAndMp(200, 100);
                    alert(`¡Asset ${selectedUplinkAsset.title} extraído y sincronizado en MagnopVS! Recompensa: +200 XP y +100 MP.`);
                    setSelectedUplinkAsset(null);
                  }}
                  className="px-5 py-2 bg-[#98cbff] text-[#003354] font-bold rounded-xl text-xs uppercase cursor-pointer shadow-[0_0_15px_rgba(152,203,255,0.3)] flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Extraer Asset (+200 XP)</span>
                </button>
              </div>
            </div>
          </div>
        )}
        {selectedCodexNode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in font-orbitron">
            <div className="bg-[#131313] border-2 border-[#15ffd1] w-full max-w-lg rounded-3xl p-6 shadow-[0_0_50px_rgba(21,255,209,0.3)] relative space-y-6">
              <div className="flex justify-between items-center border-b border-[#41474f]/50 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#15ffd1] uppercase tracking-widest">{selectedCodexNode.subtitle}</span>
                  <h3 className="text-xl font-audiowide text-white uppercase mt-0.5">{selectedCodexNode.title}</h3>
                </div>
                <button onClick={() => setSelectedCodexNode(null)} className="p-2 text-[#8b919a] hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs font-mono text-[#c1c7d0]">
                <p className="leading-relaxed">{selectedCodexNode.description}</p>
                <div className="bg-[#1c1b1b] p-4 rounded-xl border border-[#41474f]/40 space-y-2">
                  <div className="flex justify-between"><span className="text-[#8b919a]">ERA:</span><span className="text-[#15ffd1]">{selectedCodexNode.era}</span></div>
                  <div className="flex justify-between"><span className="text-[#8b919a]">LORE PURITY:</span><span className="text-[#cee5ff]">99.84%</span></div>
                  <div className="flex justify-between"><span className="text-[#8b919a]">MULTIVERSE PROTOCOL:</span><span className="text-[#15ffd1]">MagnopVS v7.2</span></div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#41474f]/50">
                <button onClick={() => setSelectedCodexNode(null)} className="px-4 py-2 border border-[#41474f] text-[#8b919a] rounded-xl text-xs uppercase cursor-pointer">
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    playSoundEffect('level');
                    addXpAndMp(200, 100);
                    alert(`¡Nodo ${selectedCodexNode.title} explorado en MagnopVS! Recompensa: +200 XP y +100 MP.`);
                    setSelectedCodexNode(null);
                  }}
                  className="px-5 py-2 bg-[#15ffd1] text-[#00382c] font-bold rounded-xl text-xs uppercase cursor-pointer shadow-[0_0_15px_rgba(21,255,209,0.3)] flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Sincronizar Nodo (+200 XP)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CODEX DISCOVERY DETAIL MODAL */}
        {selectedDiscovery && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in font-orbitron">
            <div className="bg-[#131313] border-2 border-[#cee5ff] w-full max-w-lg rounded-3xl p-6 shadow-[0_0_50px_rgba(152,203,255,0.3)] relative space-y-6">
              <div className="flex justify-between items-center border-b border-[#41474f]/50 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#cee5ff] uppercase tracking-widest">{selectedDiscovery.type} // {selectedDiscovery.timeAgo}</span>
                  <h3 className="text-xl font-audiowide text-white uppercase mt-0.5">{selectedDiscovery.title}</h3>
                </div>
                <button onClick={() => setSelectedDiscovery(null)} className="p-2 text-[#8b919a] hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedDiscovery.image && (
                <div className="relative h-48 rounded-xl overflow-hidden border border-[#41474f]/50">
                  <img src={selectedDiscovery.image} alt={selectedDiscovery.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="space-y-4 text-xs font-mono text-[#c1c7d0]">
                <p className="leading-relaxed">{selectedDiscovery.description}</p>
                <div className="bg-[#1c1b1b] p-4 rounded-xl border border-[#41474f]/40 space-y-2">
                  <div className="flex justify-between"><span className="text-[#8b919a]">ORIGIN ERA:</span><span className="text-[#15ffd1]">{selectedDiscovery.era}</span></div>
                  <div className="flex justify-between"><span className="text-[#8b919a]">PURITY INDEX:</span><span className="text-[#cee5ff]">{selectedDiscovery.lorePurity}</span></div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#41474f]/50">
                <button onClick={() => setSelectedDiscovery(null)} className="px-4 py-2 border border-[#41474f] text-[#8b919a] rounded-xl text-xs uppercase cursor-pointer">
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    playSoundEffect('level');
                    addXpAndMp(150, 75);
                    alert(`¡Descubrimiento ${selectedDiscovery.title} analizado en MagnopVS! +150 XP / +75 MP.`);
                    setSelectedDiscovery(null);
                  }}
                  className="px-5 py-2 bg-[#cee5ff] text-[#001d33] font-bold rounded-xl text-xs uppercase cursor-pointer shadow-[0_0_15px_rgba(152,203,255,0.3)] flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Analizar (+150 XP)</span>
                </button>
              </div>
            </div>
          </div>
        )}

      {/* ========================================================= */}
      {/* SAGA DETAIL MODAL */}
      {/* ========================================================= */}
      {selectedSagaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="bg-[#131313] border-2 border-[#00a3ff] w-full max-w-3xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,163,255,0.4)] relative space-y-6 max-h-[90vh] overflow-y-auto font-sans">
            
            <div className="relative h-64 overflow-hidden">
              <img src={selectedSagaModal.banner} alt={selectedSagaModal.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/50 to-transparent" />
              
              <button 
                onClick={() => setSelectedSagaModal(null)}
                className="absolute top-4 right-4 p-2 bg-[#0e0e0e]/80 border border-[#3f4852] text-white hover:text-[#00a3ff] rounded-full transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <span className="text-[10px] font-mono text-[#15ffd1] uppercase tracking-widest bg-[#15ffd1]/10 px-2.5 py-1 rounded border border-[#15ffd1]/30">
                  {selectedSagaModal.subtitle}
                </span>
                <h2 className="text-3xl font-audiowide text-white uppercase mt-1">
                  {selectedSagaModal.title}
                </h2>
              </div>
            </div>

            <div className="px-6 pb-6 space-y-6">
              <p className="text-sm font-sans text-[#e5e2e1] leading-relaxed">
                {selectedSagaModal.description}
              </p>

              {selectedSagaModal.stats && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#1c1b1b] p-4 rounded-2xl border border-[#3f4852]/40 font-mono text-xs">
                  {selectedSagaModal.stats.map((stat, i) => (
                    <div key={i}>
                      <div className="text-[10px] text-[#88919d] uppercase">{stat.label}</div>
                      <div className="text-sm font-bold text-[#00a3ff]">{stat.value}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#3f4852]/40 font-mono">
                <button
                  onClick={() => setSelectedSagaModal(null)}
                  className="px-5 py-2.5 rounded-xl border border-[#3f4852] text-[#bec7d4] hover:text-white text-xs uppercase cursor-pointer"
                >
                  Close
                </button>

                {selectedSagaModal.id === 'eleusis' && (
                  <button
                    onClick={() => {
                      playSoundEffect('click');
                      addXpAndMp(150, 50);
                      setCurrentSagaId('eleusis');
                      setActiveTab('saga');
                      setSelectedSagaModal(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#15ffd1]/20 hover:bg-[#15ffd1]/30 border border-[#15ffd1] text-[#15ffd1] font-bold text-xs uppercase transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(21,255,209,0.3)]"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>MagZine Eleusis (#07)</span>
                  </button>
                )}

                {selectedSagaModal.id === 'mlh' && (
                  <button
                    onClick={() => {
                      playSoundEffect('portal');
                      addXpAndMp(300, 100);
                      setCurrentSagaId('mlh');
                      setActiveTab('herogame');
                      setSelectedSagaModal(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#00f0ff]/20 hover:bg-[#00f0ff]/30 border border-[#00f0ff] text-[#00f0ff] font-bold text-xs uppercase transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Entrar a MLH (Life Hero)</span>
                  </button>
                )}

                {selectedSagaModal.id && selectedSagaModal.id !== 'eleusis' && selectedSagaModal.id !== 'mlh' && (
                  <button
                    onClick={() => {
                      playSoundEffect('click');
                      setCurrentSagaId(selectedSagaModal.id);
                      setActiveTab('saga');
                      setSelectedSagaModal(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#00f0ff]/20 hover:bg-[#00f0ff]/30 border border-[#00f0ff] text-[#00f0ff] font-bold text-xs uppercase transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Explorar Capítulos & Lore</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    playSoundEffect('portal');
                    addXpAndMp(300, 100);
                    if (selectedSagaModal.id) {
                      setCurrentSagaId(selectedSagaModal.id);
                    }
                    if (selectedSagaModal.id === 'mlh') {
                      setActiveTab('herogame');
                    } else {
                      setActiveTab('saga');
                    }
                    setSelectedSagaModal(null);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#00a3ff] hover:bg-[#24ffcd] text-[#001d33] font-bold text-xs uppercase transition-all shadow-[0_0_20px_rgba(0,163,255,0.4)] flex items-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>
                    {selectedSagaModal.id === 'mlh' ? 'Sintonizar Nodo // Ingresar a MLH (+300 XP)' : 'Sintonizar Nodo // Abrir Saga (+300 XP)'}
                  </span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* FOOTER */}
      {/* ========================================================= */}
      <footer className="w-full bg-[#0a0f11] border-t border-[#a2e0ff]/20 px-6 sm:px-12 py-3 flex flex-wrap justify-between items-center font-mono text-xs text-[#24ffcd] z-20 gap-4">
        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-[#24ffcd] font-bold">© 2142 QUANTVM MATRIX INTERFACE</span>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-[11px]">
          <span className="font-bold text-[#24ffcd]">Sync Status: OPTIMAL</span>
          <span className="text-[#889299]">Latency: 0.04ms</span>
          <span className="text-[#889299] flex items-center gap-1">
            <Egg className="w-3 h-3 text-[#a2e0ff]" /> MagnoEggs: 12/40
          </span>
          <span className="text-[#889299] flex items-center gap-1">
            <Carrot className="w-3 h-3 text-[#ffb4ab]" /> Carrots: 5
          </span>
          <span className="text-[#889299] flex items-center gap-1">
            <Key className="w-3 h-3 text-[#24ffcd]" /> Keys: 2
          </span>
        </div>

        <div className="flex items-center gap-4 text-[#889299]">
          <Terminal className="w-4 h-4 hover:text-[#a2e0ff] cursor-pointer transition-colors" />
          <Wifi className="w-4 h-4 hover:text-[#a2e0ff] cursor-pointer transition-colors" />
          <Shield className="w-4 h-4 hover:text-[#a2e0ff] cursor-pointer transition-colors" />
        </div>
      </footer>

      {showCreateSagaModal && (
        <CreateSagaStudioModal
          initialSaga={editingCreatorSaga}
          onClose={() => {
            setShowCreateSagaModal(false);
            setEditingCreatorSaga(null);
          }}
          onSagaCreated={(newSaga, isEdit) => {
            setCreatorSagas(getCreatorSagas());
            if (!isEdit) {
              addXpAndMp(500, 200);
            }
            playSoundEffect('level');
            setShowCreateSagaModal(false);
            setEditingCreatorSaga(null);
            setCurrentSagaId(newSaga.id);
            setActiveTab('sagas');
          }}
        />
      )}

      {show3DGame && (
        <Quantvm3DGameView
          onExit={() => setShow3DGame(false)}
          onRewardXp={(xp, mp) => addXpAndMp(xp, mp)}
        />
      )}

      {show3DScenes && (
        <Quantvm3DSceneExplorer onExit={() => setShow3DScenes(false)} />
      )}

      {showAiMediaStudio && (
        <QuantvmAiMediaStudioModal onClose={() => setShowAiMediaStudio(false)} />
      )}

    </div>
  );

};
