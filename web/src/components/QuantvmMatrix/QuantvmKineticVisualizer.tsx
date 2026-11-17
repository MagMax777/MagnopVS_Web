import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  BookOpen,
  Clapperboard,
  Compass,
  GitBranch,
  Layers,
  Maximize2,
  Minimize2,
  Network,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Check,
} from 'lucide-react';
import { getAllSagas, SagaFullData } from '../../data/sagasData';
import {
  inferSagaGenre,
  QuantvmReelsWall,
  REEL_GENRE_OPTIONS,
  ReelGenreCategory,
} from './QuantvmReelsWall';

interface QuantvmKineticVisualizerProps {
  playSoundEffect: (type: 'click' | 'portal' | 'quest' | 'error' | 'levelUp' | 'coin' | 'level') => void;
  addXpAndMp: (xp: number, mp: number) => void;
  onOpenSaga: (sagaId: string) => void;
  compactMode?: boolean;
  onExpandFullWall?: () => void;
  defaultView?: 'reels' | 'graph';
}

interface ThemeDefinition {
  id: string;
  label: string;
  color: string;
  matcher: (saga: SagaFullData, genre: ReelGenreCategory) => boolean;
}

const THEMATIC_MOTIFS: ThemeDefinition[] = [
  {
    id: 'theme_quantum',
    label: 'Conciencia Cuántica',
    color: '#00f0ff',
    matcher: (saga) =>
      /cuántic|quantum|matrix|conciencia|pulso|frecuencia|singularidad|tiempo/i.test(
        `${saga.title} ${saga.subtitle} ${saga.synopsis} ${saga.affinityFaction}`
      ),
  },
  {
    id: 'theme_myth',
    label: 'Mitología & Ritos',
    color: '#ffd700',
    matcher: (saga) =>
      /mito|eleusis|sumer|templo|deidad|iniciad|rito|dorado|leyenda|sagrad/i.test(
        `${saga.title} ${saga.subtitle} ${saga.synopsis} ${saga.affinityFaction}`
      ),
  },
  {
    id: 'theme_cyber',
    label: 'Ciber-Distopía & Código',
    color: '#ff4dfa',
    matcher: (saga, genre) =>
      genre === 'Cyberpunk' ||
      /ciber|cyber|tokyo|shibuya|silicio|androide|sintétic|red|código|neón/i.test(
        `${saga.title} ${saga.subtitle} ${saga.synopsis}`
      ),
  },
  {
    id: 'theme_alchemy',
    label: 'Alquimia & Oráculo',
    color: '#15ffd1',
    matcher: (saga) =>
      /alquim|crisol|filósof|oráculo|hermét|sabidur|ilumin|hermandad/i.test(
        `${saga.title} ${saga.subtitle} ${saga.synopsis} ${saga.affinityFaction}`
      ),
  },
  {
    id: 'theme_shadow',
    label: 'Sombras & Rebelión',
    color: '#ff6b6b',
    matcher: (saga, genre) =>
      genre === 'Drama' ||
      saga.era === 'chaos' ||
      /caos|abismo|caída|terror|sombra|secreto|guerra|cisma|apocalips/i.test(
        `${saga.title} ${saga.subtitle} ${saga.synopsis}`
      ),
  },
  {
    id: 'theme_cosmos',
    label: 'Vacío & Multiverso',
    color: '#a78bfa',
    matcher: (saga, genre) =>
      genre === 'Ciencia Ficción' ||
      saga.era === 'void' ||
      /vacío|void|cosmos|estelar|paradoja|caosfera|universo|multiverso/i.test(
        `${saga.title} ${saga.subtitle} ${saga.synopsis}`
      ),
  },
];

interface GraphNode {
  id: string;
  kind: 'saga' | 'theme';
  label: string;
  sublabel: string;
  color: string;
  x: number;
  y: number;
  radius: number;
  image?: string;
  saga?: SagaFullData;
  genre?: ReelGenreCategory;
  degree: number;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  color: string;
  label: string;
}

const CANVAS_W = 920;
const CANVAS_H = 540;

export const QuantvmKineticVisualizer: React.FC<QuantvmKineticVisualizerProps> = ({
  playSoundEffect,
  addXpAndMp,
  onOpenSaga,
  compactMode = false,
  onExpandFullWall,
  defaultView = 'reels',
}) => {
  const [visualMode, setVisualMode] = useState<'reels' | 'graph'>(defaultView);
  const [sagasList, setSagasList] = useState<SagaFullData[]>(() => getAllSagas());

  // Selected sagas for Graph View (multi-select) + sync bridge to Reels Wall
  const [selectedSagaIds, setSelectedSagaIds] = useState<string[]>(() =>
    getAllSagas()
      .slice(0, 8)
      .map((s) => s.id)
  );
  const [graphGenreFilter, setGraphGenreFilter] = useState<'ALL' | ReelGenreCategory>('ALL');
  const [reelsExternalSagaFilter, setReelsExternalSagaFilter] = useState<string>('ALL');

  // Graph interactive controls
  const [isKineticMotion, setIsKineticMotion] = useState<boolean>(true);
  const [motionTick, setMotionTick] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [draggedPositions, setDraggedPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const sync = () => {
      const updated = getAllSagas();
      setSagasList(updated);
    };
    window.addEventListener('magnopvs-sagas-updated', sync);
    return () => window.removeEventListener('magnopvs-sagas-updated', sync);
  }, []);

  // Gentle kinetic orbital drift animation
  useEffect(() => {
    if (visualMode !== 'graph' || !isKineticMotion || draggingNodeId) return;
    const interval = setInterval(() => {
      setMotionTick((t) => t + 0.045);
    }, 50);
    return () => clearInterval(interval);
  }, [visualMode, isKineticMotion, draggingNodeId]);

  const activeGraphSagas = useMemo(() => {
    return sagasList.filter((s) => {
      if (!selectedSagaIds.includes(s.id)) return false;
      if (graphGenreFilter !== 'ALL' && inferSagaGenre(s) !== graphGenreFilter) return false;
      return true;
    });
  }, [sagasList, selectedSagaIds, graphGenreFilter]);

  // Build nodes & thematic edges
  const { nodes, edges } = useMemo(() => {
    const cx = CANVAS_W / 2;
    const cy = CANVAS_H / 2;
    const builtNodes: GraphNode[] = [];
    const builtEdges: GraphEdge[] = [];
    const themeUsageCount: Record<string, number> = {};
    const sagaToThemes: Record<string, ThemeDefinition[]> = {};

    activeGraphSagas.forEach((saga) => {
      const genre = inferSagaGenre(saga);
      let matched = THEMATIC_MOTIFS.filter((t) => t.matcher(saga, genre));
      if (matched.length === 0) {
        matched = [THEMATIC_MOTIFS[0]];
      }
      sagaToThemes[saga.id] = matched;
      matched.forEach((t) => {
        themeUsageCount[t.id] = (themeUsageCount[t.id] || 0) + 1;
      });
    });

    const activeThemes = THEMATIC_MOTIFS.filter((t) => (themeUsageCount[t.id] || 0) > 0);

    // Place Thematic Hub Nodes in inner ring
    const innerRadiusX = activeThemes.length <= 1 ? 0 : 155;
    const innerRadiusY = activeThemes.length <= 1 ? 0 : 115;
    activeThemes.forEach((theme, idx) => {
      const angle = (idx / Math.max(1, activeThemes.length)) * Math.PI * 2 - Math.PI / 2;
      const driftX = isKineticMotion ? Math.cos(motionTick + idx * 1.4) * 5 : 0;
      const driftY = isKineticMotion ? Math.sin(motionTick * 0.8 + idx * 1.1) * 5 : 0;
      const override = draggedPositions[theme.id];

      builtNodes.push({
        id: theme.id,
        kind: 'theme',
        label: theme.label,
        sublabel: `${themeUsageCount[theme.id]} sagas conectadas`,
        color: theme.color,
        x: override ? override.x : cx + Math.cos(angle) * innerRadiusX + driftX,
        y: override ? override.y : cy + Math.sin(angle) * innerRadiusY + driftY,
        radius: 26 + Math.min(10, (themeUsageCount[theme.id] || 1) * 2),
        degree: themeUsageCount[theme.id] || 1,
      });
    });

    // Place Saga Nodes in outer orbital ring, clustered near their primary theme
    const outerRadiusX = 350;
    const outerRadiusY = 205;
    activeGraphSagas.forEach((saga, idx) => {
      const genre = inferSagaGenre(saga);
      const themes = sagaToThemes[saga.id] || [];
      const primaryColor =
        genre === 'Cyberpunk'
          ? '#ff4dfa'
          : genre === 'Ciencia Ficción'
          ? '#00f0ff'
          : genre === 'Fantasía'
          ? '#ffd700'
          : '#15ffd1';

      const angle = (idx / Math.max(1, activeGraphSagas.length)) * Math.PI * 2 - Math.PI / 4;
      const driftX = isKineticMotion ? Math.sin(motionTick * 0.9 + idx * 0.9) * 7 : 0;
      const driftY = isKineticMotion ? Math.cos(motionTick * 0.7 + idx * 1.3) * 6 : 0;
      const nodeId = `saga_${saga.id}`;
      const override = draggedPositions[nodeId];

      builtNodes.push({
        id: nodeId,
        kind: 'saga',
        label: saga.title,
        sublabel: `${genre} · ${saga.era.toUpperCase()}`,
        color: primaryColor,
        x: override ? override.x : cx + Math.cos(angle) * outerRadiusX + driftX,
        y: override ? override.y : cy + Math.sin(angle) * outerRadiusY + driftY,
        radius: 26,
        image: saga.image,
        saga,
        genre,
        degree: themes.length,
      });

      themes.forEach((theme) => {
        builtEdges.push({
          id: `${nodeId}__${theme.id}`,
          source: nodeId,
          target: theme.id,
          color: theme.color,
          label: theme.label,
        });
      });
    });

    return { nodes: builtNodes, edges: builtEdges };
  }, [activeGraphSagas, isKineticMotion, motionTick, draggedPositions]);

  // Automatically pick a selected node when switching into Graph View if none selected
  useEffect(() => {
    if (visualMode === 'graph' && !selectedNodeId && nodes.length > 0) {
      const firstSagaNode = nodes.find((n) => n.kind === 'saga') || nodes[0];
      setSelectedNodeId(firstSagaNode.id);
    }
  }, [visualMode, nodes, selectedNodeId]);

  const focusedNodeId = hoveredNodeId || selectedNodeId;
  const connectedNodeIds = useMemo(() => {
    const set = new Set<string>();
    if (!focusedNodeId) return set;
    set.add(focusedNodeId);
    edges.forEach((edge) => {
      if (edge.source === focusedNodeId) set.add(edge.target);
      if (edge.target === focusedNodeId) set.add(edge.source);
    });
    return set;
  }, [focusedNodeId, edges]);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) || nodes[0] || null,
    [nodes, selectedNodeId]
  );

  // Connected neighbors of selectedNode for the Inspector panel
  const selectedConnections = useMemo(() => {
    if (!selectedNode) return [];
    const relatedIds = new Set<string>();
    edges.forEach((e) => {
      if (e.source === selectedNode.id) relatedIds.add(e.target);
      if (e.target === selectedNode.id) relatedIds.add(e.source);
    });
    return nodes.filter((n) => relatedIds.has(n.id));
  }, [selectedNode, edges, nodes]);

  // Related sagas that share at least one theme with a selected Saga node
  const relatedSagasByTheme = useMemo(() => {
    if (!selectedNode || selectedNode.kind !== 'saga') return [];
    const myThemeIds = new Set(
      edges.filter((e) => e.source === selectedNode.id).map((e) => e.target)
    );
    const sharedMap: Record<string, { node: GraphNode; sharedThemes: string[] }> = {};
    edges.forEach((e) => {
      if (e.source !== selectedNode.id && myThemeIds.has(e.target)) {
        const targetSagaNode = nodes.find((n) => n.id === e.source);
        if (!targetSagaNode) return;
        if (!sharedMap[targetSagaNode.id]) {
          sharedMap[targetSagaNode.id] = { node: targetSagaNode, sharedThemes: [] };
        }
        sharedMap[targetSagaNode.id].sharedThemes.push(e.label);
      }
    });
    return Object.values(sharedMap);
  }, [selectedNode, edges, nodes]);

  const toggleSagaSelection = (sagaId: string) => {
    playSoundEffect('click');
    setSelectedSagaIds((prev) =>
      prev.includes(sagaId) ? prev.filter((id) => id !== sagaId) : [...prev, sagaId]
    );
  };

  const handleSvgPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingNodeId || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    const rawX = (e.clientX - rect.left) * scaleX;
    const rawY = (e.clientY - rect.top) * scaleY;
    // Account for zoom centered at (CANVAS_W/2, CANVAS_H/2)
    const x = Math.max(40, Math.min(CANVAS_W - 40, (rawX - CANVAS_W / 2) / zoom + CANVAS_W / 2));
    const y = Math.max(40, Math.min(CANVAS_H - 40, (rawY - CANVAS_H / 2) / zoom + CANVAS_H / 2));
    setDraggedPositions((prev) => ({
      ...prev,
      [draggingNodeId]: { x, y },
    }));
  };

  const handleSvgPointerUp = () => {
    setDraggingNodeId(null);
  };

  return (
    <div className={compactMode ? 'space-y-5' : 'max-w-7xl mx-auto px-4 sm:px-6 space-y-6 font-orbitron'}>
      {/* VISUALIZADOR CINÉTICO TOP SWITCHER BAR */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0e1426] via-[#17122b] to-[#0d1926] border border-[#00f0ff]/40 shadow-[0_0_25px_rgba(0,240,255,0.12)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#00f0ff]/15 border border-[#00f0ff]/40 text-[#00f0ff] text-[10px] font-mono uppercase tracking-widest">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Visualizador Cinético // Quantvm Matrix</span>
          </div>
          <h3 className="text-base sm:text-lg font-audiowide text-white uppercase">
            {visualMode === 'reels'
              ? 'Modo Muro de Reels & Adelantos Verticales'
              : 'Vista Red de Conexiones Temáticas (Graph View)'}
          </h3>
        </div>

        {/* Mode Toggle Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex p-1 rounded-xl bg-[#070a12] border border-[#252d40]">
            <button
              type="button"
              onClick={() => {
                playSoundEffect('click');
                setVisualMode('reels');
              }}
              className={`px-3.5 py-2 rounded-lg font-mono text-xs font-bold uppercase flex items-center gap-2 transition-all cursor-pointer ${
                visualMode === 'reels'
                  ? 'bg-gradient-to-r from-[#ff4dfa] to-[#00a3ff] text-white shadow-[0_0_15px_rgba(255,77,250,0.3)]'
                  : 'text-[#889299] hover:text-white'
              }`}
            >
              <Clapperboard className="w-3.5 h-3.5" />
              <span>Muro Reels</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playSoundEffect('portal');
                setVisualMode('graph');
              }}
              className={`px-3.5 py-2 rounded-lg font-mono text-xs font-bold uppercase flex items-center gap-2 transition-all cursor-pointer ${
                visualMode === 'graph'
                  ? 'bg-gradient-to-r from-[#00f0ff] to-[#15ffd1] text-[#05080f] shadow-[0_0_15px_rgba(21,255,209,0.35)]'
                  : 'text-[#889299] hover:text-[#00f0ff]'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Graph View · Conexiones</span>
            </button>
          </div>

          {compactMode && onExpandFullWall && (
            <button
              type="button"
              onClick={() => {
                playSoundEffect('portal');
                onExpandFullWall();
              }}
              className="px-3.5 py-2 rounded-xl bg-[#141a2b] hover:bg-[#1c253d] border border-[#00f0ff]/40 text-[#a2e0ff] font-mono text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Pantalla Completa</span>
            </button>
          )}
        </div>
      </div>

      {/* MODE A: REELS WALL */}
      {visualMode === 'reels' && (
        <QuantvmReelsWall
          compactMode={compactMode}
          playSoundEffect={playSoundEffect}
          addXpAndMp={addXpAndMp}
          onOpenSaga={onOpenSaga}
          onExpandFullWall={onExpandFullWall}
          externalSagaFilter={reelsExternalSagaFilter}
          onExternalSagaFilterChange={setReelsExternalSagaFilter}
        />
      )}

      {/* MODE B: KINETIC THEMATIC GRAPH VIEW */}
      {visualMode === 'graph' && (
        <div className="space-y-5 animate-fade-in">
          {/* Saga & Theme Selection Controls */}
          <div className="p-4 rounded-2xl bg-[#111524] border border-[#252d40] space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Genre Quick Filter */}
              <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
                <span className="text-[10px] uppercase tracking-wider text-[#00f0ff] font-bold mr-1">
                  Temática / Género:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    playSoundEffect('click');
                    setGraphGenreFilter('ALL');
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                    graphGenreFilter === 'ALL'
                      ? 'bg-[#00a3ff]/25 text-[#a2e0ff] border border-[#00a3ff]'
                      : 'bg-[#090c14] text-[#889299] border border-[#252d40]'
                  }`}
                >
                  Todos
                </button>
                {REEL_GENRE_OPTIONS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => {
                      playSoundEffect('click');
                      setGraphGenreFilter(g);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                      graphGenreFilter === g
                        ? 'bg-[#15ffd1]/20 text-[#15ffd1] border border-[#15ffd1]'
                        : 'bg-[#090c14] text-[#889299] border border-[#252d40]'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>

              {/* Select All / Clear / Kinetic Toggle */}
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => {
                    playSoundEffect('click');
                    setSelectedSagaIds(sagasList.map((s) => s.id));
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#090c14] hover:bg-[#1a2138] border border-[#252d40] text-[#a2e0ff] cursor-pointer"
                >
                  Todas ({sagasList.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playSoundEffect('click');
                    setSelectedSagaIds(sagasList.slice(0, 5).map((s) => s.id));
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#090c14] hover:bg-[#1a2138] border border-[#252d40] text-[#889299] hover:text-white cursor-pointer"
                >
                  Top 5
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playSoundEffect('click');
                    setIsKineticMotion((prev) => !prev);
                  }}
                  className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 cursor-pointer ${
                    isKineticMotion
                      ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff]'
                      : 'bg-[#090c14] border-[#252d40] text-[#889299]'
                  }`}
                >
                  {isKineticMotion ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isKineticMotion ? 'Cinética Activa' : 'Cinética Pausada'}</span>
                </button>
              </div>
            </div>

            {/* Multi-select Saga Pills */}
            <div className="pt-2 border-t border-[#252d40] flex items-center gap-2 overflow-x-auto pb-1 font-mono text-[11px]">
              <span className="text-[10px] uppercase text-[#889299] shrink-0">
                Sagas seleccionadas ({activeGraphSagas.length}):
              </span>
              {sagasList.map((s) => {
                const isSelected = selectedSagaIds.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleSagaSelection(s.id)}
                    className={`px-3 py-1 rounded-full shrink-0 font-bold cursor-pointer border flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-[#ff4dfa]/20 border-[#ff4dfa] text-[#ffabf3]'
                        : 'bg-[#090c14] border-[#252d40] text-[#889299] hover:text-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{s.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Graph Canvas + Inspector Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Interactive SVG Graph Canvas */}
            <div className="lg:col-span-8 relative rounded-2xl bg-[#060913] border border-[#00f0ff]/35 overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.1)]">
              {/* Top-left Graph Telemetry Overlay */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-2 pointer-events-none">
                <span className="px-2.5 py-1 rounded-md bg-black/75 border border-[#00f0ff]/40 text-[10px] font-mono text-[#00f0ff]">
                  NODOS: {nodes.length} · CONEXIONES: {edges.length}
                </span>
                <span className="hidden sm:inline-block px-2.5 py-1 rounded-md bg-black/75 border border-white/15 text-[10px] font-mono text-[#cfd7e6]">
                  Arrastra nodos o haz clic para inspeccionar afinidad temática
                </span>
              </div>

              {/* Zoom & Reset Controls */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(1.6, +(z + 0.15).toFixed(2)))}
                  title="Acercar"
                  className="p-2 rounded-lg bg-black/75 hover:bg-[#141a2b] border border-[#252d40] text-white cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.65, +(z - 0.15).toFixed(2)))}
                  title="Alejar"
                  className="p-2 rounded-lg bg-black/75 hover:bg-[#141a2b] border border-[#252d40] text-white cursor-pointer"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playSoundEffect('click');
                    setZoom(1);
                    setDraggedPositions({});
                  }}
                  title="Reiniciar diseño cinético"
                  className="p-2 rounded-lg bg-black/75 hover:bg-[#141a2b] border border-[#252d40] text-[#00f0ff] cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {activeGraphSagas.length === 0 ? (
                <div className="h-[460px] flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <Network className="w-10 h-10 text-[#00f0ff]/60" />
                  <p className="text-sm font-audiowide text-white">
                    Selecciona al menos una saga para proyectar la Red de Conexiones
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setGraphGenreFilter('ALL');
                      setSelectedSagaIds(sagasList.slice(0, 6).map((s) => s.id));
                    }}
                    className="px-4 py-2 rounded-xl bg-[#00f0ff] text-[#05080f] font-mono text-xs font-bold cursor-pointer"
                  >
                    Cargar Sagas en la Red
                  </button>
                </div>
              ) : (
                <svg
                  ref={svgRef}
                  viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
                  onPointerMove={handleSvgPointerMove}
                  onPointerUp={handleSvgPointerUp}
                  onPointerLeave={handleSvgPointerUp}
                  className="w-full h-[460px] sm:h-[520px] select-none touch-none"
                >
                  <defs>
                    <radialGradient id="matrixGraphBg" cx="50%" cy="50%" r="60%">
                      <stop offset="0%" stopColor="#121e38" stopOpacity="0.65" />
                      <stop offset="100%" stopColor="#050811" stopOpacity="0.95" />
                    </radialGradient>
                    {nodes
                      .filter((n) => n.kind === 'saga' && n.image)
                      .map((n) => (
                        <clipPath key={`clip_${n.id}`} id={`clip_${n.id}`}>
                          <circle cx={n.x} cy={n.y} r={n.radius - 3} />
                        </clipPath>
                      ))}
                  </defs>

                  <rect width={CANVAS_W} height={CANVAS_H} fill="url(#matrixGraphBg)" />

                  <g
                    transform={`translate(${CANVAS_W / 2}, ${CANVAS_H / 2}) scale(${zoom}) translate(${-CANVAS_W / 2}, ${-CANVAS_H / 2})`}
                  >
                    {/* Faint orbital rings */}
                    <ellipse
                      cx={CANVAS_W / 2}
                      cy={CANVAS_H / 2}
                      rx={155}
                      ry={115}
                      fill="none"
                      stroke="#1f2c4d"
                      strokeDasharray="4 6"
                      strokeWidth={1}
                    />
                    <ellipse
                      cx={CANVAS_W / 2}
                      cy={CANVAS_H / 2}
                      rx={350}
                      ry={205}
                      fill="none"
                      stroke="#18223d"
                      strokeDasharray="6 8"
                      strokeWidth={1}
                    />

                    {/* Edges + Kinetic Pulses */}
                    {edges.map((edge, idx) => {
                      const src = nodes.find((n) => n.id === edge.source);
                      const dst = nodes.find((n) => n.id === edge.target);
                      if (!src || !dst) return null;

                      const isHighlighted =
                        !focusedNodeId ||
                        edge.source === focusedNodeId ||
                        edge.target === focusedNodeId;

                      return (
                        <g key={edge.id}>
                          <line
                            x1={src.x}
                            y1={src.y}
                            x2={dst.x}
                            y2={dst.y}
                            stroke={edge.color}
                            strokeWidth={isHighlighted ? 2 : 0.8}
                            strokeOpacity={isHighlighted ? 0.72 : 0.16}
                          />
                          {isKineticMotion && isHighlighted && (
                            <circle r={2.8} fill={edge.color} opacity={0.9}>
                              <animateMotion
                                dur={`${2.4 + (idx % 4) * 0.5}s`}
                                repeatCount="indefinite"
                                path={`M ${src.x} ${src.y} L ${dst.x} ${dst.y}`}
                              />
                            </circle>
                          )}
                        </g>
                      );
                    })}

                    {/* Nodes */}
                    {nodes.map((node) => {
                      const isFocused = focusedNodeId === node.id;
                      const isNeighbor = !focusedNodeId || connectedNodeIds.has(node.id);

                      return (
                        <g
                          key={node.id}
                          style={{ cursor: draggingNodeId === node.id ? 'grabbing' : 'grab' }}
                          opacity={isNeighbor ? 1 : 0.3}
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            setDraggingNodeId(node.id);
                            setSelectedNodeId(node.id);
                            playSoundEffect('click');
                          }}
                          onMouseEnter={() => setHoveredNodeId(node.id)}
                          onMouseLeave={() => setHoveredNodeId(null)}
                        >
                          {/* Outer Kinetic Glow Ring */}
                          {isFocused && (
                            <circle
                              cx={node.x}
                              cy={node.y}
                              r={node.radius + 7}
                              fill="none"
                              stroke={node.color}
                              strokeWidth={2}
                              strokeDasharray="4 3"
                            />
                          )}

                          {node.kind === 'theme' ? (
                            <>
                              <circle
                                cx={node.x}
                                cy={node.y}
                                r={node.radius}
                                fill="#0a1022"
                                stroke={node.color}
                                strokeWidth={2.2}
                              />
                              <text
                                x={node.x}
                                y={node.y + 3}
                                textAnchor="middle"
                                fill={node.color}
                                fontSize="9"
                                fontFamily="monospace"
                                fontWeight="bold"
                              >
                                {node.label.split(' ')[0].toUpperCase()}
                              </text>
                              <text
                                x={node.x}
                                y={node.y + node.radius + 14}
                                textAnchor="middle"
                                fill="#e2e8f0"
                                fontSize="10"
                                fontFamily="monospace"
                                fontWeight="bold"
                              >
                                {node.label}
                              </text>
                            </>
                          ) : (
                            <>
                              <circle
                                cx={node.x}
                                cy={node.y}
                                r={node.radius}
                                fill="#090d1a"
                                stroke={node.color}
                                strokeWidth={isFocused ? 3 : 2}
                              />
                              {node.image && (
                                <image
                                  href={node.image}
                                  x={node.x - (node.radius - 3)}
                                  y={node.y - (node.radius - 3)}
                                  width={(node.radius - 3) * 2}
                                  height={(node.radius - 3) * 2}
                                  preserveAspectRatio="xMidYMid slice"
                                  clipPath={`url(#clip_${node.id})`}
                                />
                              )}
                              <rect
                                x={node.x - 54}
                                y={node.y + node.radius + 4}
                                width={108}
                                height={16}
                                rx={4}
                                fill="#050811"
                                fillOpacity={0.85}
                                stroke={node.color}
                                strokeOpacity={0.4}
                                strokeWidth={0.8}
                              />
                              <text
                                x={node.x}
                                y={node.y + node.radius + 15}
                                textAnchor="middle"
                                fill="#ffffff"
                                fontSize="9.5"
                                fontFamily="monospace"
                                fontWeight="bold"
                              >
                                {node.label.slice(0, 16)}
                              </text>
                            </>
                          )}
                        </g>
                      );
                    })}
                  </g>
                </svg>
              )}
            </div>

            {/* Right Inspector Panel */}
            <div className="lg:col-span-4 rounded-2xl bg-[#111524] border border-[#252d40] p-5 flex flex-col justify-between space-y-4">
              {selectedNode ? (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-3 border-b border-[#252d40]">
                      {selectedNode.kind === 'saga' && selectedNode.image ? (
                        <img
                          src={selectedNode.image}
                          alt={selectedNode.label}
                          className="w-12 h-12 rounded-xl object-cover border border-[#00f0ff]/60 shrink-0"
                        />
                      ) : (
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 bg-[#090c14]"
                          style={{ borderColor: selectedNode.color, color: selectedNode.color }}
                        >
                          <GitBranch className="w-5 h-5" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <span
                          className="text-[10px] font-mono uppercase font-bold block"
                          style={{ color: selectedNode.color }}
                        >
                          {selectedNode.kind === 'saga' ? 'Nodo de Saga' : 'Nodo Temático'}
                        </span>
                        <h4 className="text-base font-audiowide text-white truncate">
                          {selectedNode.label}
                        </h4>
                        <span className="text-[11px] font-mono text-[#889299]">
                          {selectedNode.sublabel}
                        </span>
                      </div>
                    </div>

                    {selectedNode.saga && (
                      <p className="text-xs font-mono text-[#cfd7e6] leading-relaxed line-clamp-4 bg-[#090c14] p-3 rounded-xl border border-[#252d40]">
                        {selectedNode.saga.synopsis}
                      </p>
                    )}

                    {/* Direct Connections */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono uppercase text-[#a2e0ff] font-bold block">
                        {selectedNode.kind === 'saga'
                          ? `Temáticas Conectadas (${selectedConnections.length})`
                          : `Sagas en esta Temática (${selectedConnections.length})`}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedConnections.map((conn) => (
                          <button
                            key={conn.id}
                            type="button"
                            onClick={() => {
                              playSoundEffect('click');
                              setSelectedNodeId(conn.id);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#090c14] hover:bg-[#1a2238] border text-[11px] font-mono text-white cursor-pointer transition-all"
                            style={{ borderColor: `${conn.color}88` }}
                          >
                            {conn.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Related Sagas sharing themes */}
                    {selectedNode.kind === 'saga' && relatedSagasByTheme.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono uppercase text-[#ffabf3] font-bold block">
                          Sagas Afines por Temática ({relatedSagasByTheme.length})
                        </span>
                        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                          {relatedSagasByTheme.map(({ node, sharedThemes }) => (
                            <button
                              key={node.id}
                              type="button"
                              onClick={() => {
                                playSoundEffect('click');
                                setSelectedNodeId(node.id);
                              }}
                              className="w-full p-2.5 rounded-xl bg-[#090c14] hover:bg-[#161c30] border border-[#252d40] text-left flex items-center justify-between gap-2 cursor-pointer"
                            >
                              <span className="text-xs font-bold text-white truncate">
                                {node.label}
                              </span>
                              <span className="text-[10px] font-mono text-[#15ffd1] shrink-0">
                                {sharedThemes.length} puente{sharedThemes.length > 1 ? 's' : ''}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Inspector Actions */}
                  <div className="pt-3 border-t border-[#252d40] space-y-2">
                    {selectedNode.saga && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            playSoundEffect('click');
                            setReelsExternalSagaFilter(selectedNode.saga!.id);
                            setVisualMode('reels');
                          }}
                          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#ff4dfa] to-[#00a3ff] text-white font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Clapperboard className="w-4 h-4" />
                          <span>Ver Reels de {selectedNode.label}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            playSoundEffect('portal');
                            onOpenSaga(selectedNode.saga!.id);
                          }}
                          className="w-full py-2.5 px-4 rounded-xl bg-[#00f0ff]/15 hover:bg-[#00f0ff]/25 border border-[#00f0ff] text-[#00f0ff] font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>Abrir Saga en MagnopVS</span>
                        </button>
                      </>
                    )}
                    {selectedNode.kind === 'theme' && (
                      <button
                        type="button"
                        onClick={() => {
                          playSoundEffect('click');
                          setReelsExternalSagaFilter('ALL');
                          setVisualMode('reels');
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#15ffd1]/20 hover:bg-[#15ffd1]/30 border border-[#15ffd1] text-[#15ffd1] font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Clapperboard className="w-4 h-4" />
                        <span>Explorar Reels en Muro Vertical</span>
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-xs font-mono text-[#889299]">
                  Haz clic en cualquier nodo del grafo para inspeccionar sus conexiones.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
