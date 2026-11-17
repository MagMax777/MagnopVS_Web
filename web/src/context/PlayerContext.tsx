import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { 
  PlayerProfile, 
  Quest, 
  InventoryItem, 
  StoreItem, 
  FactionType, 
  TabType, 
  MagFamCreature, 
  TutorialPhase,
  WalletTransaction,
  WalletCurrency
} from '../types';
import { WalletService } from '../services/WalletService';
import { INITIAL_PLAYER, INITIAL_QUESTS, INITIAL_INVENTORY, STORE_ITEMS, INITIAL_MAGFAM_CREATURES } from '../data/mockData';

export interface NavigationHistoryEntry {
  tab: TabType;
  label: string;
  sagaId?: string;
  timestamp: number;
}

export type SagaSessionSection = 'marketplace' | 'magnoways' | 'social' | 'multiplayer';

export interface SagaSessionContextData {
  sagaId: string;
  section: SagaSessionSection;
  timestamp: number;
}

const TAB_LABELS: Record<TabType, string> = {
  landing: 'Inicio',
  dashboard: 'Dashboard RPG',
  social: 'Red Social Quantvm',
  profile: 'Perfil Público',
  codex: 'Códice de Lore',
  herogame: 'Hero Game (MLH)',
  magfam: 'Vivero MagFam',
  alchemy: 'Laboratorio de Alquimia',
  atlas: 'Atlas Cósmico',
  magnoways: 'MagnoWays',
  marketplace: 'Marketplace',
  sofia: 'Sof.IA Asistente',
  almanac: 'Almanaque Cósmico',
  mcds: 'MCDS Design System',
  quantvmmatrix: 'Quantvm Matrix Hub',
  events: 'Eventos MagnopVS',
  saga: 'Saga Activa',
};

interface PlayerContextType {
  player: PlayerProfile;
  quests: Quest[];
  inventory: InventoryItem[];
  storeItems: StoreItem[];
  creatures: MagFamCreature[];
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isStoreModalOpen: boolean;
  setIsStoreModalOpen: (open: boolean) => void;
  isWalletModalOpen: boolean;
  setIsWalletModalOpen: (open: boolean) => void;
  isTutorialModalOpen: boolean;
  setIsTutorialModalOpen: (open: boolean) => void;
  isDailyCheckInOpen: boolean;
  setIsDailyCheckInOpen: (open: boolean) => void;
  tutorialPhase: TutorialPhase;
  setTutorialPhase: (phase: TutorialPhase) => void;
  nextTutorialPhase: () => void;
  advanceTutorial: () => void;
  resetTutorial: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  carrotsCollected: number;
  addCarrot: () => void;
  checkEvolution: () => void;
  hasEnteredQuantvm: boolean;
  enterQuantvm: () => void;
  openInitialBanner: () => void;
  
  currentSagaId: string;
  setCurrentSagaId: (sagaId: string) => void;
  navigationHistory: NavigationHistoryEntry[];
  sagaSessionContext: SagaSessionContextData | null;
  openSagaSession: (sagaId: string, section: SagaSessionSection) => void;
  clearSagaSessionContext: () => void;
  
  // Wallet & Economy
  transactions: WalletTransaction[];
  fetchWalletTransactions: (currency?: string, type?: string) => Promise<void>;
  convertMpToMicroCoins: (mpAmount: number) => Promise<{ success: boolean; error?: string; microCoinsAdded?: number }>;
  spendCurrency: (currency: WalletCurrency, amount: number, source: string, description: string, reference?: string) => Promise<{ success: boolean; error?: string }>;
  awardReward: (currency: WalletCurrency, amount: number, source: string, description: string, idempotencyKey: string) => Promise<{ success: boolean; error?: string }>;
  
  // Actions
  claimQuestReward: (questId: string) => void;
  buyStoreItem: (itemId: string, useCurrency?: WalletCurrency) => Promise<boolean>;
  updatePlayerProfile: (
    name?: string,
    faction?: FactionType,
    avatarUrl?: string,
    title?: string,
    bannerUrl?: string,
    backgroundUrl?: string,
    bio?: string,
    statusMessage?: string,
    guildName?: string
  ) => void;
  addXpAndMp: (xp: number, mp: number) => void;
  creditMagnoCoins: (mcAmount: number, reason?: string) => void;
  useInventoryItem: (itemId: string) => void;
  playSoundEffect: (type: 'click' | 'quest' | 'level' | 'buy' | 'portal' | 'hatch' | 'flash') => void;
  loginUser: (name: string, faction: FactionType) => void;
  logoutUser: () => void;
  unlockEgg: () => void;
  feedCreature: (creatureId: string) => void;
  hatchEgg: (creatureId: string) => void;
  transmuteItems: (item1Id: string, item2Id: string) => InventoryItem | null;
  addInventoryItem: (item: InventoryItem) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [player, setPlayer] = useState<PlayerProfile>(() => {
    try {
      const saved = localStorage.getItem('magnopvs_player');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved player profile:', e);
    }
    return INITIAL_PLAYER;
  });

  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem('magnopvs_quests');
    return saved ? JSON.parse(saved) : INITIAL_QUESTS;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('magnopvs_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [storeItems, setStoreItems] = useState<StoreItem[]>(() => {
    const saved = localStorage.getItem('magnopvs_store');
    return saved ? JSON.parse(saved) : STORE_ITEMS;
  });

  const [creatures, setCreatures] = useState<MagFamCreature[]>(() => {
    const saved = localStorage.getItem('magnopvs_creatures');
    return saved ? JSON.parse(saved) : INITIAL_MAGFAM_CREATURES;
  });

  // If user is already authenticated with saved data, go straight to dashboard
  const [activeTab, setActiveTabState] = useState<TabType>(() => {
    try {
      const saved = localStorage.getItem('magnopvs_player');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.isLoggedIn) {
          return 'dashboard';
        }
      }
    } catch (e) {
      console.error(e);
    }
    return 'landing';
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);
  const [isDailyCheckInOpen, setIsDailyCheckInOpen] = useState(false);
  const [tutorialPhase, setTutorialPhase] = useState<TutorialPhase>('egg_discovery');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [carrotsCollected, setCarrotsCollected] = useState(0);

  const [currentSagaId, setCurrentSagaIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('magnopvs_last_saga');
      if (saved) return saved;
    } catch (e) {
      console.warn(e);
    }
    return 'eleusis';
  });

  const setCurrentSagaId = (sagaId: string) => {
    if (!sagaId) return;
    setCurrentSagaIdState(sagaId);
    try {
      localStorage.setItem('magnopvs_last_saga', sagaId);
    } catch (e) {
      console.warn(e);
    }
    if (activeTab === 'saga') {
      pushHistoryEntry('saga', sagaId);
    }
  };

  const [sagaSessionContext, setSagaSessionContext] = useState<SagaSessionContextData | null>(null);

  const openSagaSession = (sagaId: string, section: SagaSessionSection) => {
    if (!sagaId) return;
    playSoundEffect('portal');
    setCurrentSagaIdState(sagaId);
    try {
      localStorage.setItem('magnopvs_last_saga', sagaId);
    } catch (e) {
      console.warn(e);
    }
    setSagaSessionContext({ sagaId, section, timestamp: Date.now() });
    if (section === 'marketplace') {
      setActiveTab('marketplace');
    } else if (section === 'magnoways') {
      setActiveTab('magnoways');
    } else if (section === 'social') {
      setActiveTab('social');
    } else if (section === 'multiplayer') {
      setActiveTab('saga');
      pushHistoryEntry('saga', sagaId);
    }
  };

  const clearSagaSessionContext = () => {
    setSagaSessionContext(null);
  };

  const [navigationHistory, setNavigationHistory] = useState<NavigationHistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem('magnopvs_nav_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.slice(0, 3);
      }
    } catch (e) {
      console.warn(e);
    }
    return [];
  });

  const pushHistoryEntry = (tab: TabType, sagaId?: string) => {
    const entry: NavigationHistoryEntry = {
      tab,
      label: TAB_LABELS[tab] || tab,
      ...(sagaId ? { sagaId } : {}),
      timestamp: Date.now(),
    };
    setNavigationHistory((prev) => {
      const filtered = prev.filter((item) =>
        tab === 'saga' && sagaId
          ? !(item.tab === 'saga' && item.sagaId === sagaId)
          : item.tab !== tab
      );
      const next = [entry, ...filtered].slice(0, 3);
      try {
        localStorage.setItem('magnopvs_nav_history', JSON.stringify(next));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
  };

  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('magnopvs_wallet_transactions');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'tx-init-reward',
        transactionType: 'REWARD',
        currency: 'MP',
        amount: 25500,
        balanceBefore: 0,
        balanceAfter: 25500,
        source: 'INITIAL_SYNDICATION',
        description: 'Recompensa de bienvenida en el multiverso MagnopVS',
        status: 'COMPLETED',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'tx-init-conv-mp',
        transactionType: 'CONVERSION',
        currency: 'MP',
        amount: -20000,
        balanceBefore: 25500,
        balanceAfter: 5500,
        source: 'WALLET_CONVERTER',
        description: 'Conversión de 20.000 MP a 2 MicroCoins',
        status: 'COMPLETED',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'tx-init-conv-mc',
        transactionType: 'CONVERSION',
        currency: 'MICROCOIN',
        amount: 2,
        balanceBefore: 0,
        balanceAfter: 2,
        source: 'WALLET_CONVERTER',
        sourceReference: 'tx-init-conv-mp',
        description: 'Acreditación de 2 MicroCoins por conversión atómica (10.000 MP = 1 µC)',
        status: 'COMPLETED',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      }
    ];
  });

  const fetchWalletTransactions = async (currency?: string, type?: string) => {
    try {
      const txs = await WalletService.getTransactionHistory(player.id, {
        currency: currency as any,
        type: type as any,
      });
      if (Array.isArray(txs) && txs.length > 0) {
        setTransactions(txs);
      }
    } catch (e) {
      console.warn('Could not sync transactions from WalletService, using local:', e);
    }
  };

  // Sync wallet balance and attach real-time listener
  useEffect(() => {
    let isMounted = true;

    const syncWallet = async () => {
      try {
        const balances = await WalletService.getBalances(player.id);
        if (isMounted) {
          setPlayer((prev) => ({
            ...prev,
            magnoPoints: balances.magnoPoints ?? prev.magnoPoints,
            microCoins: balances.microCoins ?? (prev.microCoins || 0),
            totalEarnedMp: balances.totalEarnedMp ?? prev.totalEarnedMp,
            totalSpentMp: balances.totalSpentMp ?? prev.totalSpentMp,
            totalConvertedMp: balances.totalConvertedMp ?? prev.totalConvertedMp,
            totalEarnedMicroCoins: balances.totalEarnedMicroCoins ?? prev.totalEarnedMicroCoins,
            totalSpentMicroCoins: balances.totalSpentMicroCoins ?? prev.totalSpentMicroCoins,
          }));
        }
      } catch (e) {
        console.warn('Using offline wallet fallback:', e);
      }
    };

    syncWallet();
    fetchWalletTransactions();

    // Attach real-time snapshot listener from Firestore
    const unsubscribeSnapshot = WalletService.listenToWalletBalances(player.id, (balances) => {
      if (isMounted) {
        setPlayer((prev) => ({
          ...prev,
          magnoPoints: balances.magnoPoints ?? prev.magnoPoints,
          microCoins: balances.microCoins ?? prev.microCoins,
          totalEarnedMp: balances.totalEarnedMp ?? prev.totalEarnedMp,
          totalSpentMp: balances.totalSpentMp ?? prev.totalSpentMp,
          totalConvertedMp: balances.totalConvertedMp ?? prev.totalConvertedMp,
          totalEarnedMicroCoins: balances.totalEarnedMicroCoins ?? prev.totalEarnedMicroCoins,
          totalSpentMicroCoins: balances.totalSpentMicroCoins ?? prev.totalSpentMicroCoins,
        }));
      }
    });

    return () => {
      isMounted = false;
      unsubscribeSnapshot();
    };
  }, [player.id]);

  // Sync Firebase Authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : null;
          setPlayer((prev) => ({
            ...prev,
            id: fbUser.uid,
            name: userData?.name || fbUser.displayName || prev.name,
            avatarUrl: userData?.avatarUrl || fbUser.photoURL || prev.avatarUrl,
            faction: (userData?.faction as FactionType) || prev.faction,
            level: userData?.level || prev.level,
            karma: userData?.karma || prev.karma,
            title: userData?.title || prev.title,
            isLoggedIn: true,
          }));
        } catch (e) {
          console.warn('Firebase user profile retrieval warning:', e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('magnopvs_wallet_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addCarrot = () => {
    setCarrotsCollected(prev => {
      const newCarrots = prev + 1;
      return Math.min(newCarrots, 12);
    });
  };

  const checkEvolution = () => {
    if (carrotsCollected >= 12) {
      setTutorialPhase('evolution');
      // Additional evolution logic like unlockEgg can be done here or in the component
    }
  };

  const nextTutorialPhase = () => {
    const sequence: TutorialPhase[] = [
      'egg_discovery',
      'egg_hatching',
      'intro',
      'home',
      'quantvm_matrix',
      'sagas',
      'atlas',
      'profile',
      'mlh',
      'marketplace',
      'alchemy',
      'magfam',
      'social',
      'codex',
      'magnoways',
      'evolution',
      'reward'
    ];
    const currentIndex = sequence.indexOf(tutorialPhase);
    if (currentIndex < sequence.length - 1) {
      setTutorialPhase(sequence[currentIndex + 1]);
    }
  };

  const advanceTutorial = nextTutorialPhase;

  const resetTutorial = () => {
    setTutorialPhase('egg_discovery');
    setCarrotsCollected(0);
  };

  const [hasEnteredQuantvm, setHasEnteredQuantvm] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('magnopvs_player');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.isLoggedIn) {
          return true;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  });

  const setActiveTab = (tab: TabType) => {
    if (!player.isLoggedIn && (tab === 'dashboard' || tab === 'magfam' || tab === 'alchemy')) {
      playSoundEffect('click');
      setIsAuthModalOpen(true);
      return;
    }
    setHasEnteredQuantvm(true);
    setActiveTabState(tab);
    pushHistoryEntry(tab, tab === 'saga' ? currentSagaId : undefined);
  };

  const enterQuantvm = () => {
    playSoundEffect('portal');
    setHasEnteredQuantvm(true);
    if (!player.isLoggedIn) {
      setIsAuthModalOpen(true);
    } else {
      setActiveTabState('dashboard');
      pushHistoryEntry('dashboard');
      setIsDailyCheckInOpen(true);
    }
  };

  const openInitialBanner = () => {
    playSoundEffect('click');
    setHasEnteredQuantvm(false);
  };

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('magnopvs_player', JSON.stringify(player));
  }, [player]);

  useEffect(() => {
    localStorage.setItem('magnopvs_quests', JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem('magnopvs_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('magnopvs_store', JSON.stringify(storeItems));
  }, [storeItems]);

  useEffect(() => {
    localStorage.setItem('magnopvs_creatures', JSON.stringify(creatures));
  }, [creatures]);

  // Audio Synthesizer for futuristic UI SFX
  const playSoundEffect = (type: 'click' | 'quest' | 'level' | 'buy' | 'portal' | 'hatch' | 'flash') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'quest') {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start();
        osc2.start(ctx.currentTime + 0.1);
        osc1.stop(ctx.currentTime + 0.3);
        osc2.stop(ctx.currentTime + 0.3);
      } else if (type === 'level') {
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
          gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (idx + 1) * 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.08);
          osc.stop(ctx.currentTime + (idx + 1) * 0.12);
        });
      } else if (type === 'buy') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'portal') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'hatch') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.3);
        
        const bufferSize = ctx.sampleRate * 0.3; // 300ms
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 1000;
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.3, ctx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        noise.start();
        osc.stop(ctx.currentTime + 0.3);
        noise.stop(ctx.currentTime + 0.3);
      } else if (type === 'flash') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2000, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.6);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      }
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  };

  const addXpAndMp = (xp: number, mp: number) => {
    setPlayer((prev) => {
      let newXp = prev.currentXp + xp;
      let newLevel = prev.level;
      let newMaxXp = prev.maxXp;

      while (newXp >= newMaxXp) {
        newXp -= newMaxXp;
        newLevel += 1;
        newMaxXp = Math.floor(newMaxXp * 1.3);
        playSoundEffect('level');
      }

      return {
        ...prev,
        currentXp: newXp,
        level: newLevel,
        maxXp: newMaxXp,
        magnoPoints: prev.magnoPoints + mp,
        stats: {
          ...prev.stats,
          quantvmEnergy: Math.min(100, prev.stats.quantvmEnergy + Math.floor(xp / 10)),
          cosmicTuning: Math.min(100, prev.stats.cosmicTuning + Math.floor(mp / 20)),
        },
      };
    });
  };

  const creditMagnoCoins = (mcAmount: number, reason = 'Recompensa MLH') => {
    if (!mcAmount || mcAmount <= 0) return;
    const nextMc = (player.magnoCoins ?? 0) + mcAmount;
    setPlayer((prev) => ({
      ...prev,
      magnoCoins: (prev.magnoCoins ?? 0) + mcAmount,
      totalEarnedMc: (prev.totalEarnedMc || 0) + mcAmount,
    }));
    setTransactions((txs) => [
      {
        id: `tx-mc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        userId: player.id,
        type: 'REWARD',
        currency: 'MC',
        amount: mcAmount,
        balanceAfter: nextMc,
        source: 'MLH',
        description: reason,
        status: 'COMPLETED',
        createdAt: new Date().toISOString(),
      },
      ...txs.slice(0, 49),
    ]);
  };

  // Wallet Operations: Atomic Conversion (10,000 MP = 1 µC)
  const convertMpToMicroCoins = async (mpAmount: number): Promise<{ success: boolean; error?: string; microCoinsAdded?: number }> => {
    const idempotencyKey = `conv-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const result = await WalletService.convertMpToMicroCoins(player.id, mpAmount, idempotencyKey);

    if (result.success) {
      if (result.newMagnoPoints !== undefined) {
        setPlayer((prev) => ({
          ...prev,
          magnoPoints: result.newMagnoPoints!,
          microCoins: result.newMicroCoins ?? ((prev.microCoins || 0) + (result.microCoinsAdded || 0)),
          totalConvertedMp: (prev.totalConvertedMp || 0) + mpAmount,
          totalEarnedMicroCoins: (prev.totalEarnedMicroCoins || 0) + (result.microCoinsAdded || 0),
        }));
      }
      if (Array.isArray(result.transactions) && result.transactions.length > 0) {
        setTransactions((prev) => [...result.transactions!, ...prev]);
      }
      playSoundEffect('portal');
      return { success: true, microCoinsAdded: result.microCoinsAdded };
    }

    return { success: false, error: result.error || 'Error al procesar la conversión atómica.' };
  };

  // Wallet Operations: Spend
  const spendCurrency = async (
    currency: WalletCurrency,
    amount: number,
    source: string,
    description: string,
    reference?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const idempotencyKey = `spend-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const result = await WalletService.spendCurrency(player.id, currency, amount, source, description, {
      sourceReference: reference,
      idempotencyKey,
    });

    if (result.success) {
      if (result.newBalance !== undefined) {
        setPlayer((prev) => ({
          ...prev,
          magnoPoints: currency === 'MP' ? result.newBalance! : prev.magnoPoints,
          microCoins: currency === 'MICROCOIN' ? result.newBalance! : prev.microCoins,
          totalSpentMp: currency === 'MP' ? (prev.totalSpentMp || 0) + amount : prev.totalSpentMp,
          totalSpentMicroCoins: currency === 'MICROCOIN' ? (prev.totalSpentMicroCoins || 0) + amount : prev.totalSpentMicroCoins,
        }));
      }
      if (result.transaction) {
        setTransactions((prev) => [result.transaction!, ...prev]);
      }
      return { success: true };
    }

    return { success: false, error: result.error || 'Saldo insuficiente o error al procesar el débito.' };
  };

  // Wallet Operations: Reward
  const awardReward = async (
    currency: WalletCurrency,
    amount: number,
    source: string,
    description: string,
    idempotencyKey: string
  ): Promise<{ success: boolean; error?: string }> => {
    const result = await WalletService.rewardCurrency(player.id, currency, amount, source, description, {
      idempotencyKey,
    });

    if (result.success) {
      if (result.newBalance !== undefined) {
        setPlayer((prev) => ({
          ...prev,
          magnoPoints: currency === 'MP' ? result.newBalance! : prev.magnoPoints,
          microCoins: currency === 'MICROCOIN' ? result.newBalance! : prev.microCoins,
          totalEarnedMp: currency === 'MP' ? (prev.totalEarnedMp || 0) + amount : prev.totalEarnedMp,
          totalEarnedMicroCoins: currency === 'MICROCOIN' ? (prev.totalEarnedMicroCoins || 0) + amount : prev.totalEarnedMicroCoins,
        }));
      }
      if (result.transaction) {
        setTransactions((prev) => [result.transaction!, ...prev]);
      }
      return { success: true };
    }

    return { success: false, error: result.error || 'Error al emitir la recompensa.' };
  };

  const claimQuestReward = (questId: string) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest || quest.isClaimed || !quest.isCompleted) return;

    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, isClaimed: true } : q))
    );

    addXpAndMp(quest.xpReward, quest.mpReward);
    awardReward('MP', quest.mpReward, 'QUEST_SYSTEM', `Recompensa de misión: ${quest.title}`, `quest-${questId}`);
    playSoundEffect('quest');
  };

  const buyStoreItem = async (itemId: string, useCurrency: WalletCurrency = 'MP'): Promise<boolean> => {
    const item = storeItems.find((i) => i.id === itemId);
    if (!item || item.isPurchased) return false;

    const amount = useCurrency === 'MICROCOIN' 
      ? (item.priceMicroCoins || Math.ceil(item.priceMp / 10000) || 1)
      : item.priceMp;

    const result = await spendCurrency(
      useCurrency,
      amount,
      'MAGNO_STORE',
      `Compra en Tienda: ${item.name}`,
      item.id
    );

    if (!result.success) {
      return false;
    }

    setPlayer((prev) => ({
      ...prev,
      equippedFrameId: item.category === 'frame' ? item.id : prev.equippedFrameId,
      equippedTitleId: item.category === 'title' ? item.id : prev.equippedTitleId,
      title: item.category === 'title' ? item.name.replace('Título: ', '') : prev.title,
    }));

    setStoreItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, isPurchased: true } : i))
    );

    playSoundEffect('buy');
    return true;
  };

  const updatePlayerProfile = (
    name?: string,
    faction?: FactionType,
    avatarUrl?: string,
    title?: string,
    bannerUrl?: string,
    backgroundUrl?: string,
    bio?: string,
    statusMessage?: string,
    guildName?: string
  ) => {
    setPlayer((prev) => ({
      ...prev,
      ...(name ? { name } : {}),
      ...(faction ? { faction } : {}),
      ...(avatarUrl ? { avatarUrl } : {}),
      ...(title ? { title } : {}),
      ...(bannerUrl ? { bannerUrl } : {}),
      ...(backgroundUrl ? { backgroundUrl } : {}),
      ...(bio !== undefined ? { bio } : {}),
      ...(statusMessage ? { statusMessage } : {}),
      ...(guildName ? { guildName } : {}),
    }));
    playSoundEffect('click');
  };

  const useInventoryItem = (itemId: string) => {
    const item = inventory.find((i) => i.id === itemId);
    if (!item || item.quantity <= 0) return;

    setInventory((prev) =>
      prev
        .map((i) => (i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );

    // Give power boost
    addXpAndMp(item.powerValue * 2, item.powerValue * 5);
    playSoundEffect('buy');
  };

  const loginUser = (name: string, faction: FactionType) => {
    setPlayer((prev) => ({
      ...prev,
      name,
      faction,
      isLoggedIn: true,
    }));
    setHasEnteredQuantvm(true);
    setActiveTabState('dashboard');
    setIsAuthModalOpen(false);
    playSoundEffect('portal');
  };

  const logoutUser = () => {
    setPlayer((prev) => ({
      ...prev,
      isLoggedIn: false,
    }));
    setHasEnteredQuantvm(false);
    setActiveTabState('landing');
    playSoundEffect('click');
  };

  const unlockEgg = () => {
    if (player.eggUnlocked) return;

    setPlayer((prev) => ({
      ...prev,
      eggUnlocked: true,
    }));

    addXpAndMp(250, 500);

    // Add a new item to inventory
    const newEggItem: InventoryItem = {
      id: `egg-${Date.now()}`,
      name: 'MagnoEgg Cósmico',
      category: 'artefacto',
      rarity: 'legendario',
      description: 'El primer huevo cósmico descubierto en la Antesala del Universo MagnopVS.',
      icon: 'Sparkles',
      powerValue: 100,
      loreSnippet: 'Desbloqueado al descifrar el primer secreto en el Hero Game.',
      quantity: 1,
    };

    setInventory((prev) => [newEggItem, ...prev]);
    playSoundEffect('level');
  };

  const feedCreature = (creatureId: string) => {
    const creature = creatures.find((c) => c.id === creatureId);
    if (!creature) return;

    // Check if player has feeding capsule in inventory
    const capsule = inventory.find((i) => i.name.includes('Cápsula') || i.category === 'artefacto');
    if (capsule && capsule.quantity > 0) {
      useInventoryItem(capsule.id);
    } else {
      addXpAndMp(10, 20);
    }

    setCreatures((prev) =>
      prev.map((c) => {
        if (c.id === creatureId) {
          const newHunger = Math.min(100, c.hunger + 25);
          const newAffinity = Math.min(100, c.affinity + 10);
          const newLevel = c.hunger >= 90 ? c.level + 1 : c.level;
          return {
            ...c,
            hunger: newHunger,
            affinity: newAffinity,
            level: newLevel,
          };
        }
        return c;
      })
    );

    playSoundEffect('quest');
  };

  const hatchEgg = (creatureId: string) => {
    setCreatures((prev) =>
      prev.map((c) => {
        if (c.id === creatureId) {
          return {
            ...c,
            isEgg: false,
            name: 'Dragón Plasmático Aether',
            species: 'Plasma Dragon',
            level: 1,
            description: 'Nacido del MagnoEgg Primigenio. Emite pulsos de energía cuántica pura.',
          };
        }
        return c;
      })
    );

    addXpAndMp(300, 600);
    playSoundEffect('portal');
  };

  const transmuteItems = (item1Id: string, item2Id: string): InventoryItem | null => {
    const item1 = inventory.find((i) => i.id === item1Id);
    const item2 = inventory.find((i) => i.id === item2Id);

    if (!item1 || !item2) return null;

    // Remove one of each
    useInventoryItem(item1Id);
    useInventoryItem(item2Id);

    const transmutedItem: InventoryItem = {
      id: `transmut-${Date.now()}`,
      name: 'Piedra Filosofal Quantvm',
      category: 'reliquia',
      rarity: 'legendario',
      description: 'Artefacto alquímico sintetizado mediante transmutación elemental en el laboratorio MLH.',
      icon: 'Sparkles',
      powerValue: 150,
      loreSnippet: 'Transmutación exitosa realizada en el laboratorio Magno Legends Handbook.',
      quantity: 1,
    };

    setInventory((prev) => [transmutedItem, ...prev]);
    addXpAndMp(200, 400);
    playSoundEffect('level');

    return transmutedItem;
  };

  const addInventoryItem = (item: InventoryItem) => {
    setInventory((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
        );
      }
      return [item, ...prev];
    });
    playSoundEffect('level');
  };

  return (
    <PlayerContext.Provider
      value={{
        player,
        quests,
        inventory,
        storeItems,
        creatures,
        activeTab,
        setActiveTab,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isStoreModalOpen,
        setIsStoreModalOpen,
        isWalletModalOpen,
        setIsWalletModalOpen,
        isTutorialModalOpen,
        setIsTutorialModalOpen,
        isDailyCheckInOpen,
        setIsDailyCheckInOpen,
        tutorialPhase,
        setTutorialPhase,
        nextTutorialPhase,
        advanceTutorial,
        resetTutorial,
        soundEnabled,
        setSoundEnabled,
        carrotsCollected,
        addCarrot,
        checkEvolution,
        hasEnteredQuantvm,
        enterQuantvm,
        openInitialBanner,
        currentSagaId,
        setCurrentSagaId,
        navigationHistory,
        sagaSessionContext,
        openSagaSession,
        clearSagaSessionContext,
        transactions,
        fetchWalletTransactions,
        convertMpToMicroCoins,
        spendCurrency,
        awardReward,
        claimQuestReward,
        buyStoreItem,
        updatePlayerProfile,
        addXpAndMp,
        creditMagnoCoins,
        useInventoryItem,
        playSoundEffect,
        loginUser,
        logoutUser,
        unlockEgg,
        feedCreature,
        hatchEgg,
        transmuteItems,
        addInventoryItem,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
