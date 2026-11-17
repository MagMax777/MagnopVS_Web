import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { usePlayer } from './PlayerContext';
import {
  MagnoWaysRoute,
  MagnoWayNode,
  MagnoWaysModality,
  RoutePresentationMode,
  PlayerRouteProgress,
  MultiplayerLobby,
  MultiplayerRole,
  RouteValidationResult,
  MagnoWaysFilterOptions,
  MagnoWaysActiveTab,
  ParticipantsMode,
} from '../types/magnoways';
import {
  INITIAL_MAGNOWAYS_ROUTES,
  INITIAL_MULTIPLAYER_LOBBIES,
} from '../data/magnowaysRoutesData';

interface MagnoWaysContextType {
  // Navigation & Sub-views
  activeTab: MagnoWaysActiveTab;
  setActiveTab: (tab: MagnoWaysActiveTab) => void;
  selectedRoute: MagnoWaysRoute | null;
  setSelectedRoute: (route: MagnoWaysRoute | null) => void;
  activePresentationMode: RoutePresentationMode;
  setActivePresentationMode: (mode: RoutePresentationMode) => void;
  activeNode: MagnoWayNode | null;
  setActiveNode: (node: MagnoWayNode | null) => void;

  // Catalog & Filters
  routes: MagnoWaysRoute[];
  filters: MagnoWaysFilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<MagnoWaysFilterOptions>>;
  filteredRoutes: MagnoWaysRoute[];
  resetFilters: () => void;

  // Progress & Journey Engine
  playerProgress: Record<string, PlayerRouteProgress>;
  startRoute: (routeId: string) => void;
  pauseRoute: (routeId: string) => void;
  resumeRoute: (routeId: string) => void;
  abandonRoute: (routeId: string) => void;
  completeNode: (routeId: string, nodeId: string, choiceId?: string) => Promise<{ success: boolean; message: string }>;
  getNodeStatus: (route: MagnoWaysRoute, nodeId: string) => 'locked' | 'available' | 'in_progress' | 'completed';
  
  // Bookmarks
  savedRouteIds: string[];
  toggleSaveRoute: (routeId: string) => void;

  // Creator Studio
  validateRoute: (route: Partial<MagnoWaysRoute>) => RouteValidationResult;
  saveDraftRoute: (route: Partial<MagnoWaysRoute>) => void;
  publishRoute: (route: MagnoWaysRoute) => { success: boolean; message: string };
  deleteRoute: (routeId: string) => void;

  // Multiplayer
  lobbies: MultiplayerLobby[];
  createLobby: (routeId: string, mode: ParticipantsMode, maxPlayers: number, isPrivate: boolean) => MultiplayerLobby;
  joinLobby: (lobbyId: string, role: MultiplayerRole) => void;
  toggleLobbyReady: (lobbyId: string) => void;
  leaveLobby: (lobbyId: string) => void;
  activeLobby: MultiplayerLobby | null;
  setActiveLobby: (lobby: MultiplayerLobby | null) => void;
}

const DEFAULT_FILTERS: MagnoWaysFilterOptions = {
  searchQuery: '',
  modality: 'ALL',
  sagaId: 'ALL',
  difficulty: 'ALL',
  participantsMode: 'ALL',
  isOfficialOnly: false,
  isSeasonalOnly: false,
  minLevel: 1,
  sortBy: 'popular',
};

const MagnoWaysContext = createContext<MagnoWaysContextType | undefined>(undefined);

export const MagnoWaysProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { player, addXpAndMp, awardReward, playSoundEffect } = usePlayer();

  // 1. Navigation State
  const [activeTab, setActiveTab] = useState<MagnoWaysActiveTab>('hub');
  const [selectedRoute, setSelectedRoute] = useState<MagnoWaysRoute | null>(INITIAL_MAGNOWAYS_ROUTES[0]);
  const [activePresentationMode, setActivePresentationMode] = useState<RoutePresentationMode>('map');
  const [activeNode, setActiveNode] = useState<MagnoWayNode | null>(INITIAL_MAGNOWAYS_ROUTES[0].nodes[0] || null);

  // 2. Routes State (Persisted Custom & Canonical)
  const [routes, setRoutes] = useState<MagnoWaysRoute[]>(() => {
    try {
      const savedCustom = localStorage.getItem('magnopvs_custom_routes');
      if (savedCustom) {
        const parsed: MagnoWaysRoute[] = JSON.parse(savedCustom);
        return [...INITIAL_MAGNOWAYS_ROUTES, ...parsed];
      }
    } catch (e) {
      console.error('Error loading custom MagnoWays routes:', e);
    }
    return INITIAL_MAGNOWAYS_ROUTES;
  });

  // 3. Filters State
  const [filters, setFilters] = useState<MagnoWaysFilterOptions>(DEFAULT_FILTERS);

  // 4. Saved / Bookmarked Routes
  const [savedRouteIds, setSavedRouteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('magnopvs_saved_routes');
      return saved ? JSON.parse(saved) : ['mw-tokyo-3000-echoes', 'mw-real-orbital-surveillance'];
    } catch {
      return [];
    }
  });

  // 5. Player Journey Progression State
  const [playerProgress, setPlayerProgress] = useState<Record<string, PlayerRouteProgress>>(() => {
    try {
      const saved = localStorage.getItem('magnopvs_magnoways_progress');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading MagnoWays progress:', e);
    }
    // Default starter progress in Tokyo 3000
    return {
      'mw-tokyo-3000-echoes': {
        routeId: 'mw-tokyo-3000-echoes',
        startedAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        status: 'in_progress',
        currentNodeId: 'node-tyo-1',
        completedNodeIds: [],
        decisionsMade: {},
        earnedRewards: { mp: 0, microCoins: 0, xp: 0, badges: [] },
        percentage: 0,
      },
    };
  });

  // 6. Multiplayer Lobbies State
  const [lobbies, setLobbies] = useState<MultiplayerLobby[]>(() => {
    try {
      const saved = localStorage.getItem('magnopvs_magnoways_lobbies');
      return saved ? JSON.parse(saved) : INITIAL_MULTIPLAYER_LOBBIES;
    } catch {
      return INITIAL_MULTIPLAYER_LOBBIES;
    }
  });
  const [activeLobby, setActiveLobby] = useState<MultiplayerLobby | null>(null);

  // Sync progress to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('magnopvs_magnoways_progress', JSON.stringify(playerProgress));
    } catch (e) {
      console.error('Failed to sync MagnoWays progress:', e);
    }
  }, [playerProgress]);

  // Sync saved routes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('magnopvs_saved_routes', JSON.stringify(savedRouteIds));
    } catch (e) {
      console.error('Failed to sync saved routes:', e);
    }
  }, [savedRouteIds]);

  // Sync lobbies to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('magnopvs_magnoways_lobbies', JSON.stringify(lobbies));
    } catch (e) {
      console.error('Failed to sync lobbies:', e);
    }
  }, [lobbies]);

  // ============================================================================
  // PROGRESSION & JOURNEY ENGINE LOGIC
  // ============================================================================

  const getNodeStatus = (route: MagnoWaysRoute, nodeId: string): 'locked' | 'available' | 'in_progress' | 'completed' => {
    const progress = playerProgress[route.id];
    if (!progress) {
      // First node is available by default if route hasn't been started
      const firstNode = route.nodes[0];
      return firstNode && firstNode.id === nodeId ? 'available' : 'locked';
    }

    if (progress.completedNodeIds.includes(nodeId)) {
      return 'completed';
    }

    if (progress.currentNodeId === nodeId) {
      return 'in_progress';
    }

    // Check prerequisites
    const node = route.nodes.find((n) => n.id === nodeId);
    if (!node) return 'locked';

    if (node.requirements.minLevel && player.level < node.requirements.minLevel) {
      return 'locked';
    }

    if (node.requirements.previousNodeIds && node.requirements.previousNodeIds.length > 0) {
      const allPrevCompleted = node.requirements.previousNodeIds.every((prevId) =>
        progress.completedNodeIds.includes(prevId)
      );
      if (!allPrevCompleted) return 'locked';
    }

    return 'available';
  };

  const startRoute = (routeId: string) => {
    const route = routes.find((r) => r.id === routeId);
    if (!route) return;

    setSelectedRoute(route);
    const firstNode = route.nodes[0];
    if (firstNode) {
      setActiveNode(firstNode);
    }

    setPlayerProgress((prev) => {
      const existing = prev[routeId];
      if (existing && existing.status === 'in_progress') {
        return prev;
      }
      return {
        ...prev,
        [routeId]: {
          routeId,
          startedAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
          status: 'in_progress',
          currentNodeId: firstNode?.id || '',
          completedNodeIds: existing?.completedNodeIds || [],
          decisionsMade: existing?.decisionsMade || {},
          earnedRewards: existing?.earnedRewards || { mp: 0, microCoins: 0, xp: 0, badges: [] },
          percentage: existing?.percentage || 0,
        },
      };
    });

    playSoundEffect('portal');
    setActiveTab('viewer');
    setActivePresentationMode('map');
  };

  const pauseRoute = (routeId: string) => {
    playSoundEffect('click');
    setPlayerProgress((prev) => {
      const existing = prev[routeId];
      if (!existing) return prev;
      return {
        ...prev,
        [routeId]: {
          ...existing,
          lastActiveAt: new Date().toISOString(),
        },
      };
    });
    setActiveTab('hub');
  };

  const resumeRoute = (routeId: string) => {
    const route = routes.find((r) => r.id === routeId);
    if (!route) return;
    const progress = playerProgress[routeId];
    setSelectedRoute(route);
    if (progress && progress.currentNodeId) {
      const node = route.nodes.find((n) => n.id === progress.currentNodeId);
      if (node) setActiveNode(node);
    } else {
      setActiveNode(route.nodes[0] || null);
    }
    playSoundEffect('click');
    setActiveTab('viewer');
  };

  const abandonRoute = (routeId: string) => {
    playSoundEffect('click');
    setPlayerProgress((prev) => {
      const existing = prev[routeId];
      if (!existing) return prev;
      return {
        ...prev,
        [routeId]: {
          ...existing,
          status: 'abandoned',
          lastActiveAt: new Date().toISOString(),
        },
      };
    });
  };

  const completeNode = async (
    routeId: string,
    nodeId: string,
    choiceId?: string
  ): Promise<{ success: boolean; message: string }> => {
    const route = routes.find((r) => r.id === routeId);
    if (!route) return { success: false, message: 'Ruta no encontrada' };

    const node = route.nodes.find((n) => n.id === nodeId);
    if (!node) return { success: false, message: 'Nodo no encontrado' };

    // 1. Process Rewards
    const mpReward = node.rewards.magnoPoints || 0;
    const mcReward = node.rewards.microCoins || 0;
    const xpReward = node.rewards.xp || 0;
    const badgeReward = node.rewards.badge;

    // Securely update Player Profile & Wallet
    if (mpReward > 0 || xpReward > 0) {
      addXpAndMp(xpReward, mpReward);
    }
    if (mcReward > 0) {
      await awardReward(
        'MICROCOIN',
        mcReward,
        `MAGNOWAYS_NODE_${node.id}`,
        `Recompensa por completar etapa ${node.name} en ${route.title}`,
        `mw_mc_${node.id}_${Date.now()}`
      );
    }

    // 2. Calculate next node in pathway
    const connectionsFrom = route.connections.filter((c) => c.fromNodeId === nodeId);
    let nextNodeId: string | undefined = undefined;

    if (choiceId && node.actionData?.choiceBranches) {
      const choice = node.actionData.choiceBranches.find((c) => c.id === choiceId);
      if (choice?.nextNodeId) {
        nextNodeId = choice.nextNodeId;
      }
    }

    if (!nextNodeId && connectionsFrom.length > 0) {
      nextNodeId = connectionsFrom[0].toNodeId;
    }

    // 3. Update Progress
    setPlayerProgress((prev) => {
      const current = prev[routeId] || {
        routeId,
        startedAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        status: 'in_progress',
        currentNodeId: nodeId,
        completedNodeIds: [],
        decisionsMade: {},
        earnedRewards: { mp: 0, microCoins: 0, xp: 0, badges: [] },
        percentage: 0,
      };

      const newCompleted = Array.from(new Set([...current.completedNodeIds, nodeId]));
      const newDecisions = choiceId
        ? { ...current.decisionsMade, [nodeId]: choiceId }
        : current.decisionsMade;
      const newBadges = badgeReward
        ? Array.from(new Set([...current.earnedRewards.badges, badgeReward]))
        : current.earnedRewards.badges;

      const percentage = Math.round((newCompleted.length / route.nodes.length) * 100);
      const isRouteComplete = node.type === 'FINAL' || newCompleted.length === route.nodes.length;

      return {
        ...prev,
        [routeId]: {
          ...current,
          lastActiveAt: new Date().toISOString(),
          status: isRouteComplete ? 'completed' : 'in_progress',
          currentNodeId: nextNodeId || (isRouteComplete ? nodeId : current.currentNodeId),
          completedNodeIds: newCompleted,
          decisionsMade: newDecisions,
          earnedRewards: {
            mp: current.earnedRewards.mp + mpReward,
            microCoins: current.earnedRewards.microCoins + mcReward,
            xp: current.earnedRewards.xp + xpReward,
            badges: newBadges,
          },
          percentage,
        },
      };
    });

    // Check if next node exists to set it active
    if (nextNodeId) {
      const nextNode = route.nodes.find((n) => n.id === nextNodeId);
      if (nextNode) {
        setActiveNode(nextNode);
      }
    }

    playSoundEffect('quest');
    return {
      success: true,
      message: `¡Etapa ${node.name} completada con éxito! +${mpReward} MP, +${mcReward} µC, +${xpReward} XP.`,
    };
  };

  // ============================================================================
  // BOOKMARK TOGGLE
  // ============================================================================

  const toggleSaveRoute = (routeId: string) => {
    playSoundEffect('click');
    setSavedRouteIds((prev) =>
      prev.includes(routeId) ? prev.filter((id) => id !== routeId) : [...prev, routeId]
    );
  };

  // ============================================================================
  // CREATOR STUDIO LOGIC
  // ============================================================================

  const validateRoute = (route: Partial<MagnoWaysRoute>): RouteValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!route.title || route.title.trim().length < 5) {
      errors.push('El título de la ruta debe tener al menos 5 caracteres.');
    }
    if (!route.description || route.description.trim().length < 20) {
      errors.push('La descripción debe tener al menos 20 caracteres.');
    }
    if (!route.nodes || route.nodes.length < 2) {
      errors.push('La ruta debe tener al menos 2 nodos (Inicio y Destino/Final).');
    }

    const nodes = route.nodes || [];
    const connections = route.connections || [];

    const startNodes = nodes.filter((n) => n.type === 'START');
    const finalNodes = nodes.filter((n) => n.type === 'FINAL');

    if (startNodes.length === 0) {
      errors.push('La ruta debe tener exactamente un nodo de tipo START.');
    } else if (startNodes.length > 1) {
      warnings.push('Se detectaron múltiples nodos de inicio; solo el primero será considerado punto de entrada.');
    }

    if (finalNodes.length === 0) {
      errors.push('La ruta debe tener al menos un nodo de tipo FINAL para concluir el recorrido.');
    }

    // Check for orphan nodes (nodes with 0 incoming and 0 outgoing connections, excluding single start)
    const connectedNodeIds = new Set<string>();
    connections.forEach((c) => {
      connectedNodeIds.add(c.fromNodeId);
      connectedNodeIds.add(c.toNodeId);
    });

    const orphanNodes = nodes.filter((n) => !connectedNodeIds.has(n.id) && nodes.length > 1);
    if (orphanNodes.length > 0) {
      warnings.push(`Se detectaron ${orphanNodes.length} nodo(s) desconectados sin caminos vinculados.`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      stats: {
        nodeCount: nodes.length,
        connectionCount: connections.length,
        startNodes: startNodes.length,
        finalNodes: finalNodes.length,
        orphanNodes: orphanNodes.length,
        unreachableNodes: 0,
      },
    };
  };

  const saveDraftRoute = (route: Partial<MagnoWaysRoute>) => {
    playSoundEffect('click');
    const id = route.id || `mw-custom-${Date.now()}`;
    const draftRoute: MagnoWaysRoute = {
      id,
      slug: route.slug || `custom-route-${Date.now()}`,
      title: route.title || 'Nueva Ruta sin Título',
      subtitle: route.subtitle || 'Ruta Personalizada en MagnopVS',
      description: route.description || 'Descripción en borrador.',
      synopsis: route.synopsis || 'Sinopsis de la ruta.',
      modality: route.modality || 'creator',
      coverImage: route.coverImage || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      bannerImage: route.bannerImage || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&auto=format&fit=crop&q=80',
      difficulty: route.difficulty || 'Intermedio',
      estimatedDurationMin: route.estimatedDurationMin || 30,
      recommendedLevel: route.recommendedLevel || 1,
      participantsMode: route.participantsMode || 'SOLO',
      maxParticipants: route.maxParticipants || 1,
      author: {
        id: player.id || 'creator-player',
        name: player.name || 'Creador Anónimo',
        avatarUrl: player.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        isOfficial: false,
        badge: 'CREATOR',
      },
      tags: route.tags || ['Personalizada', 'Comunidad'],
      isOfficial: false,
      isSeasonal: false,
      rating: 5.0,
      reviewsCount: 0,
      completionRate: 0,
      totalPlays: 0,
      nodes: route.nodes || [],
      connections: route.connections || [],
      rewardsSummary: route.rewardsSummary || { mp: 500, microCoins: 5, xp: 300 },
      status: 'draft',
      version: '0.1.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRoutes((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      const updated = [...filtered, draftRoute];
      const customOnly = updated.filter((r) => !INITIAL_MAGNOWAYS_ROUTES.some((init) => init.id === r.id));
      localStorage.setItem('magnopvs_custom_routes', JSON.stringify(customOnly));
      return updated;
    });
  };

  const publishRoute = (route: MagnoWaysRoute): { success: boolean; message: string } => {
    const validation = validateRoute(route);
    if (!validation.isValid) {
      return { success: false, message: validation.errors[0] || 'Error de validación en la ruta.' };
    }

    const publishedRoute: MagnoWaysRoute = {
      ...route,
      status: 'published',
      updatedAt: new Date().toISOString(),
    };

    setRoutes((prev) => {
      const filtered = prev.filter((r) => r.id !== route.id);
      const updated = [publishedRoute, ...filtered];
      const customOnly = updated.filter((r) => !INITIAL_MAGNOWAYS_ROUTES.some((init) => init.id === r.id));
      localStorage.setItem('magnopvs_custom_routes', JSON.stringify(customOnly));
      return updated;
    });

    playSoundEffect('level');
    return { success: true, message: '¡Ruta publicada con éxito en el catálogo de MagnoWays!' };
  };

  const deleteRoute = (routeId: string) => {
    playSoundEffect('click');
    setRoutes((prev) => {
      const updated = prev.filter((r) => r.id !== routeId);
      const customOnly = updated.filter((r) => !INITIAL_MAGNOWAYS_ROUTES.some((init) => init.id === r.id));
      localStorage.setItem('magnopvs_custom_routes', JSON.stringify(customOnly));
      return updated;
    });
  };

  // ============================================================================
  // MULTIPLAYER LOBBIES LOGIC
  // ============================================================================

  const createLobby = (
    routeId: string,
    mode: ParticipantsMode,
    maxPlayers: number,
    isPrivate: boolean
  ): MultiplayerLobby => {
    const route = routes.find((r) => r.id === routeId);
    const roomCode = `MAGNO-${Math.floor(1000 + Math.random() * 9000)}`;
    const newLobby: MultiplayerLobby = {
      id: `lobby-${Date.now()}`,
      routeId,
      routeTitle: route?.title || 'Ruta Desconocida',
      mode,
      hostId: player.id || 'player-1',
      hostName: player.name || 'Héroe Despertando',
      maxPlayers,
      isPrivate,
      roomCode,
      status: 'waiting',
      participants: [
        {
          userId: player.id || 'player-1',
          userName: player.name || 'Héroe Despertando',
          avatarUrl: player.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          role: 'Navegante',
          isReady: true,
          score: 0,
          currentNodeId: route?.nodes[0]?.id,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    setLobbies((prev) => [newLobby, ...prev]);
    setActiveLobby(newLobby);
    playSoundEffect('portal');
    return newLobby;
  };

  const joinLobby = (lobbyId: string, role: MultiplayerRole) => {
    setLobbies((prev) =>
      prev.map((l) => {
        if (l.id !== lobbyId) return l;
        if (l.participants.some((p) => p.userId === player.id)) return l;
        if (l.participants.length >= l.maxPlayers) return l;

        const updatedParticipants = [
          ...l.participants,
          {
            userId: player.id || `guest-${Date.now()}`,
            userName: player.name || 'Invitado Quantvm',
            avatarUrl: player.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            role,
            isReady: false,
            score: 0,
          },
        ];

        const updated = { ...l, participants: updatedParticipants };
        setActiveLobby(updated);
        return updated;
      })
    );
    playSoundEffect('click');
  };

  const toggleLobbyReady = (lobbyId: string) => {
    setLobbies((prev) =>
      prev.map((l) => {
        if (l.id !== lobbyId) return l;
        const updatedParticipants = l.participants.map((p) =>
          p.userId === player.id ? { ...p, isReady: !p.isReady } : p
        );
        const updated = { ...l, participants: updatedParticipants };
        if (activeLobby?.id === lobbyId) setActiveLobby(updated);
        return updated;
      })
    );
    playSoundEffect('click');
  };

  const leaveLobby = (lobbyId: string) => {
    setLobbies((prev) =>
      prev.map((l) => {
        if (l.id !== lobbyId) return l;
        const updatedParticipants = l.participants.filter((p) => p.userId !== player.id);
        const updated = { ...l, participants: updatedParticipants };
        return updated;
      })
    );
    setActiveLobby(null);
    playSoundEffect('click');
  };

  // ============================================================================
  // FILTERING COMPUTED VALUE
  // ============================================================================

  const filteredRoutes = useMemo(() => {
    return routes.filter((route) => {
      // 1. Status Check
      if (route.status !== 'published') return false;

      // 2. Modality
      if (filters.modality !== 'ALL' && route.modality !== filters.modality) {
        return false;
      }

      // 3. Saga
      if (filters.sagaId !== 'ALL' && route.sagaId !== filters.sagaId) {
        return false;
      }

      // 4. Difficulty
      if (filters.difficulty !== 'ALL' && route.difficulty !== filters.difficulty) {
        return false;
      }

      // 5. Participants Mode
      if (filters.participantsMode !== 'ALL' && route.participantsMode !== filters.participantsMode) {
        return false;
      }

      // 6. Flags
      if (filters.isOfficialOnly && !route.isOfficial) return false;
      if (filters.isSeasonalOnly && !route.isSeasonal) return false;

      // 7. Min Level
      if (filters.minLevel > 1 && route.recommendedLevel < filters.minLevel) {
        return false;
      }

      // 8. Text Search
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = route.title.toLowerCase().includes(query);
        const matchesDesc = route.description.toLowerCase().includes(query);
        const matchesTags = route.tags.some((t) => t.toLowerCase().includes(query));
        const matchesSaga = (route.sagaTitle || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesTags && !matchesSaga) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'popular') return b.totalPlays - a.totalPlays;
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (filters.sortBy === 'rewards') return b.rewardsSummary.mp - a.rewardsSummary.mp;
      if (filters.sortBy === 'duration') return a.estimatedDurationMin - b.estimatedDurationMin;
      return 0;
    });
  }, [routes, filters]);

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    playSoundEffect('click');
  };

  return (
    <MagnoWaysContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedRoute,
        setSelectedRoute,
        activePresentationMode,
        setActivePresentationMode,
        activeNode,
        setActiveNode,
        routes,
        filters,
        setFilters,
        filteredRoutes,
        resetFilters,
        playerProgress,
        startRoute,
        pauseRoute,
        resumeRoute,
        abandonRoute,
        completeNode,
        getNodeStatus,
        savedRouteIds,
        toggleSaveRoute,
        validateRoute,
        saveDraftRoute,
        publishRoute,
        deleteRoute,
        lobbies,
        createLobby,
        joinLobby,
        toggleLobbyReady,
        leaveLobby,
        activeLobby,
        setActiveLobby,
      }}
    >
      {children}
    </MagnoWaysContext.Provider>
  );
};

export const useMagnoWays = () => {
  const context = useContext(MagnoWaysContext);
  if (!context) {
    throw new Error('useMagnoWays must be used within a MagnoWaysProvider');
  }
  return context;
};
