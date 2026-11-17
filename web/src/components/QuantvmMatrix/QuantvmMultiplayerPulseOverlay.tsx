import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  Gamepad2,
  Users,
  Zap,
  Sparkles,
  Radio,
  Eye,
  EyeOff,
  Compass,
  Pause,
  Play,
} from 'lucide-react';
import { QUANTVM_SAGAS, SagaFullData } from '../../data/sagasData';
import { usePlayer } from '../../context/PlayerContext';

export interface SagaLiveActivity {
  sagaId: string;
  activePlayers: number;
  activeRooms: number;
  inMatchCount: number;
  intensity: number; // 0 to 100
  tier: 'latente' | 'sincronizada' | 'activa' | 'sobrecarga' | 'singularidad';
}

export interface BrightnessTierInfo {
  id: SagaLiveActivity['tier'];
  label: string;
  range: string;
  color: string;
  glowRgba: string;
  brightness: number;
  pulseDurationMs: number;
}

export const BRIGHTNESS_SCALE: BrightnessTierInfo[] = [
  {
    id: 'latente',
    label: 'Latente',
    range: '0–20%',
    color: '#64748b',
    glowRgba: 'rgba(100, 116, 139, 0.25)',
    brightness: 0.9,
    pulseDurationMs: 4200,
  },
  {
    id: 'sincronizada',
    label: 'Sincronizada',
    range: '21–45%',
    color: '#00a3ff',
    glowRgba: 'rgba(0, 163, 255, 0.4)',
    brightness: 1.05,
    pulseDurationMs: 2800,
  },
  {
    id: 'activa',
    label: 'Activa',
    range: '46–70%',
    color: '#15ffd1',
    glowRgba: 'rgba(21, 255, 209, 0.55)',
    brightness: 1.2,
    pulseDurationMs: 1900,
  },
  {
    id: 'sobrecarga',
    label: 'Sobrecarga',
    range: '71–89%',
    color: '#ff4dfa',
    glowRgba: 'rgba(255, 77, 250, 0.7)',
    brightness: 1.35,
    pulseDurationMs: 1300,
  },
  {
    id: 'singularidad',
    label: 'Singularidad',
    range: '90–100%',
    color: '#ffd166',
    glowRgba: 'rgba(255, 209, 102, 0.88)',
    brightness: 1.5,
    pulseDurationMs: 850,
  },
];

export function getTierForIntensity(intensity: number): BrightnessTierInfo {
  if (intensity >= 90) return BRIGHTNESS_SCALE[4];
  if (intensity >= 71) return BRIGHTNESS_SCALE[3];
  if (intensity >= 46) return BRIGHTNESS_SCALE[2];
  if (intensity >= 21) return BRIGHTNESS_SCALE[1];
  return BRIGHTNESS_SCALE[0];
}

function readStoredSagaStats(sagaId: string): { players: number; rooms: number; inMatch: number } | null {
  try {
    const raw = localStorage.getItem(`magnopvs_saga_rooms_${sagaId}`);
    if (!raw) return null;
    const rooms = JSON.parse(raw) as Array<{ playersCount?: number; status?: string }>;
    if (!Array.isArray(rooms)) return null;
    const players = rooms.reduce((sum, r) => sum + (Number(r.playersCount) || 0), 0);
    const inMatch = rooms.filter((r) => r.status === 'En Partida').length;
    return { players, rooms: rooms.length, inMatch };
  } catch {
    return null;
  }
}

function getDeterministicSeed(str: string, index: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 1000;
  }
  return (hash + index * 37) % 100;
}

export function computeInitialActivityMap(): Record<string, SagaLiveActivity> {
  const map: Record<string, SagaLiveActivity> = {};
  QUANTVM_SAGAS.forEach((saga, idx) => {
    const stored = readStoredSagaStats(saga.id);
    const seed = getDeterministicSeed(saga.id, idx);
    const basePlayers = stored ? stored.players * 12 + 18 : 14 + (seed % 75);
    const activeRooms = stored ? stored.rooms : 2 + (seed % 6);
    const inMatchCount = stored ? stored.inMatch : seed % 3;
    const rawIntensity = stored
      ? Math.min(100, Math.max(15, stored.players * 5 + stored.inMatch * 18 + 20))
      : Math.min(98, Math.max(12, seed));
    const tier = getTierForIntensity(rawIntensity);
    map[saga.id] = {
      sagaId: saga.id,
      activePlayers: basePlayers,
      activeRooms,
      inMatchCount,
      intensity: rawIntensity,
      tier: tier.id,
    };
  });
  return map;
}

export function useSagaMultiplayerActivity(isLive: boolean = true): Record<string, SagaLiveActivity> {
  const [activityMap, setActivityMap] = useState<Record<string, SagaLiveActivity>>(() =>
    computeInitialActivityMap()
  );

  useEffect(() => {
    const handleStorage = () => {
      setActivityMap(computeInitialActivityMap());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setActivityMap((prev) => {
        const next: Record<string, SagaLiveActivity> = {};
        QUANTVM_SAGAS.forEach((saga) => {
          const current = prev[saga.id] || computeInitialActivityMap()[saga.id];
          const stored = readStoredSagaStats(saga.id);
          const delta = Math.floor(Math.random() * 13) - 6; // -6 to +6
          const baseMin = stored ? Math.min(90, stored.players * 4 + stored.inMatch * 12 + 15) : 10;
          const nextIntensity = Math.min(100, Math.max(baseMin, current.intensity + delta));
          const playerDelta = Math.floor(Math.random() * 7) - 3;
          const nextPlayers = Math.max(4, current.activePlayers + playerDelta);
          const tier = getTierForIntensity(nextIntensity);
          next[saga.id] = {
            ...current,
            activePlayers: nextPlayers,
            intensity: nextIntensity,
            tier: tier.id,
          };
        });
        return next;
      });
    }, 2400);

    return () => clearInterval(interval);
  }, [isLive]);

  return activityMap;
}

interface QuantvmMultiplayerPulseOverlayProps {
  activityMap: Record<string, SagaLiveActivity>;
  isEnabled: boolean;
  onToggleEnabled: () => void;
  isLiveTelemetry: boolean;
  onToggleLiveTelemetry: () => void;
  onSelectSagaDetails: (saga: SagaFullData) => void;
}

export const QuantvmMultiplayerPulseOverlay: React.FC<QuantvmMultiplayerPulseOverlayProps> = ({
  activityMap,
  isEnabled,
  onToggleEnabled,
  isLiveTelemetry,
  onToggleLiveTelemetry,
  onSelectSagaDetails,
}) => {
  const { openSagaSession, setCurrentSagaId, setActiveTab, playSoundEffect } = usePlayer();
  const [selectedNodeId, setSelectedNodeId] = useState<string>(QUANTVM_SAGAS[0]?.id || 'tokyo3000');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [minIntensityFilter, setMinIntensityFilter] = useState<number>(0);

  const totals = useMemo(() => {
    const values = Object.values(activityMap) as SagaLiveActivity[];
    const totalPlayers = values.reduce((acc, v) => acc + v.activePlayers, 0);
    const totalRooms = values.reduce((acc, v) => acc + v.activeRooms, 0);
    const peakSaga = values.reduce(
      (best, v) => (v.intensity > best.intensity ? v : best),
      values[0] || { sagaId: 'tokyo3000', intensity: 0, activePlayers: 0, activeRooms: 0, inMatchCount: 0, tier: 'latente' as const }
    );
    return { totalPlayers, totalRooms, peakSaga };
  }, [activityMap]);

  const activeNodeId = hoveredNodeId || selectedNodeId;
  const activeSaga = QUANTVM_SAGAS.find((s) => s.id === activeNodeId) || QUANTVM_SAGAS[0];
  const activeStats = activityMap[activeSaga.id] || {
    sagaId: activeSaga.id,
    activePlayers: 24,
    activeRooms: 3,
    inMatchCount: 1,
    intensity: 50,
    tier: 'activa' as const,
  };
  const activeTier = getTierForIntensity(activeStats.intensity);

  // Compute deterministic constellation coordinates (x: 6..94%, y: 14..86%) grouped gently by Era
  const nodePositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    const eraBuckets: Record<'chaos' | 'source' | 'void', SagaFullData[]> = {
      chaos: [],
      source: [],
      void: [],
    };
    QUANTVM_SAGAS.forEach((s) => eraBuckets[s.era].push(s));

    const placeBucket = (list: SagaFullData[], xMin: number, xMax: number) => {
      list.forEach((saga, i) => {
        const cols = 2;
        const col = i % cols;
        const row = Math.floor(i / cols);
        const rowsTotal = Math.max(1, Math.ceil(list.length / cols));
        const jitterX = ((getDeterministicSeed(saga.id, i) % 9) - 4) * 0.9;
        const jitterY = ((getDeterministicSeed(saga.id, i + 5) % 9) - 4) * 0.9;
        const x = xMin + ((col + 0.5) / cols) * (xMax - xMin) + jitterX;
        const y = 16 + ((row + 0.5) / rowsTotal) * 70 + jitterY;
        positions[saga.id] = {
          x: Math.max(6, Math.min(94, x)),
          y: Math.max(14, Math.min(86, y)),
        };
      });
    };

    placeBucket(eraBuckets.chaos, 6, 33);
    placeBucket(eraBuckets.source, 36, 64);
    placeBucket(eraBuckets.void, 67, 94);
    return positions;
  }, []);

  return (
    <section className="rounded-3xl border border-[#00a3ff]/35 bg-[#0a0d14]/95 backdrop-blur-xl p-5 sm:p-6 shadow-[0_0_40px_rgba(0,163,255,0.12)] space-y-5 font-orbitron">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1f2430] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="p-2 rounded-xl bg-[#00a3ff]/15 border border-[#00a3ff]/40 text-[#00a3ff]">
              <Activity className="w-5 h-5 animate-pulse" />
            </span>
            <h3 className="text-base sm:text-lg font-audiowide font-bold text-white uppercase tracking-wider">
              Mapa de Pulso Multijugador en Tiempo Real
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-[#15ffd1]/15 border border-[#15ffd1]/40 text-[#15ffd1] text-[10px] font-mono font-bold flex items-center gap-1.5">
              <Radio className="w-3 h-3 animate-ping" />
              <span>{totals.totalPlayers} JUGADORES EN {totals.totalRooms} SALAS</span>
            </span>
          </div>
          <p className="text-xs font-mono text-[#a0a5b5]">
            Cada nodo pulsa con distinta frecuencia y escala de brillo dinámica según su actividad multijugador cross-play.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
          <button
            onClick={() => {
              playSoundEffect('click');
              onToggleLiveTelemetry();
            }}
            className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
              isLiveTelemetry
                ? 'bg-[#15ffd1]/15 border-[#15ffd1]/50 text-[#15ffd1]'
                : 'bg-[#12151e] border-[#2a3142] text-[#a0a5b5] hover:text-white'
            }`}
          >
            {isLiveTelemetry ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isLiveTelemetry ? 'Telemetría Viva' : 'Pausado'}</span>
          </button>

          <button
            onClick={() => {
              playSoundEffect('click');
              onToggleEnabled();
            }}
            className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
              isEnabled
                ? 'bg-[#00a3ff]/20 border-[#00a3ff] text-[#00a3ff] shadow-[0_0_12px_rgba(0,163,255,0.3)]'
                : 'bg-[#12151e] border-[#2a3142] text-[#a0a5b5] hover:text-white'
            }`}
          >
            {isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{isEnabled ? 'Capa de Brillo Activa' : 'Mostrar Capa'}</span>
          </button>
        </div>
      </div>

      {/* Dynamic Brightness Scale Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#05060a]/80 border border-[#1f2430] rounded-2xl px-4 py-3 font-mono text-[11px]">
        <div className="flex items-center gap-2 text-[#a0a5b5]">
          <Sparkles className="w-3.5 h-3.5 text-[#ffd166]" />
          <span className="uppercase font-bold text-white">Escala de Brillo Dinámica:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setMinIntensityFilter(0)}
            className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
              minIntensityFilter === 0
                ? 'bg-white/15 border-white/40 text-white font-bold'
                : 'border-transparent text-[#a0a5b5] hover:text-white'
            }`}
          >
            Todos
          </button>
          {BRIGHTNESS_SCALE.map((tier, idx) => {
            const threshold = idx === 0 ? 0 : idx === 1 ? 21 : idx === 2 ? 46 : idx === 3 ? 71 : 90;
            const isActiveFilter = minIntensityFilter === threshold && threshold > 0;
            return (
              <button
                key={tier.id}
                onClick={() => {
                  playSoundEffect('click');
                  setMinIntensityFilter(isActiveFilter ? 0 : threshold);
                }}
                className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActiveFilter
                    ? 'bg-white/10 text-white font-bold'
                    : 'bg-black/40 border-[#1f2430] text-[#cbd5e1] hover:border-white/30'
                }`}
                style={{
                  borderColor: isActiveFilter ? tier.color : undefined,
                  boxShadow: isActiveFilter ? `0 0 12px ${tier.glowRgba}` : undefined,
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{
                    backgroundColor: tier.color,
                    boxShadow: `0 0 8px ${tier.color}`,
                  }}
                />
                <span>{tier.label}</span>
                <span className="text-[10px] text-[#94a3b8]">({tier.range})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Constellation + Inspector */}
      {isEnabled && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
          {/* Interactive Constellation Canvas */}
          <div className="lg:col-span-2 relative min-h-[360px] rounded-2xl border border-[#1f2430] bg-[#05060a] overflow-hidden select-none">
            {/* Subtle Radial Background & Era Columns */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 50%, rgba(255,77,250,0.14), transparent 40%), radial-gradient(circle at 50% 50%, rgba(0,163,255,0.14), transparent 40%), radial-gradient(circle at 82% 50%, rgba(138,43,226,0.16), transparent 40%)',
              }}
            />

            {/* Era Sector Labels */}
            <div className="absolute top-3 inset-x-4 grid grid-cols-3 text-center text-[10px] font-mono uppercase tracking-widest pointer-events-none z-10">
              <span className="text-[#ff4dfa]/80">Chaos Era</span>
              <span className="text-[#00a3ff]/80">Source Era</span>
              <span className="text-[#a855f7]/80">Void Era</span>
            </div>

            {/* Quantum Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {QUANTVM_SAGAS.slice(0, -1).map((saga, idx) => {
                const next = QUANTVM_SAGAS[idx + 1];
                const p1 = nodePositions[saga.id];
                const p2 = nodePositions[next.id];
                if (!p1 || !p2) return null;
                const s1 = activityMap[saga.id]?.intensity || 0;
                const s2 = activityMap[next.id]?.intensity || 0;
                const avg = (s1 + s2) / 2;
                return (
                  <line
                    key={`${saga.id}-${next.id}`}
                    x1={`${p1.x}%`}
                    y1={`${p1.y}%`}
                    x2={`${p2.x}%`}
                    y2={`${p2.y}%`}
                    stroke={avg > 65 ? '#15ffd1' : '#00a3ff'}
                    strokeOpacity={Math.max(0.08, (avg / 100) * 0.35)}
                    strokeWidth={avg > 70 ? 1.5 : 1}
                    strokeDasharray={avg > 70 ? undefined : '4 4'}
                  />
                );
              })}
            </svg>

            {/* Saga Nodes */}
            {QUANTVM_SAGAS.map((saga) => {
              const pos = nodePositions[saga.id];
              const stats = activityMap[saga.id] || {
                sagaId: saga.id,
                activePlayers: 20,
                activeRooms: 2,
                inMatchCount: 0,
                intensity: 30,
                tier: 'sincronizada' as const,
              };
              const tier = getTierForIntensity(stats.intensity);
              const isDimmed = stats.intensity < minIntensityFilter;
              const isSelected = activeNodeId === saga.id;
              const nodeSizePx = 14 + Math.round((stats.intensity / 100) * 14); // 14px to 28px

              return (
                <button
                  key={saga.id}
                  type="button"
                  onMouseEnter={() => setHoveredNodeId(saga.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={() => {
                    playSoundEffect('click');
                    setSelectedNodeId(saga.id);
                  }}
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    opacity: isDimmed ? 0.2 : 1,
                    filter: `brightness(${isSelected ? Math.min(1.7, tier.brightness + 0.2) : tier.brightness})`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none z-20 transition-opacity duration-300"
                  aria-label={`Nodo ${saga.title} - Actividad ${stats.intensity}%`}
                >
                  {/* Dynamic Pulse Halo */}
                  <span
                    className="absolute inset-0 rounded-full pointer-events-none animate-ping"
                    style={{
                      backgroundColor: tier.glowRgba,
                      animationDuration: `${tier.pulseDurationMs}ms`,
                      transform: `scale(${1 + (stats.intensity / 100) * 0.9})`,
                    }}
                  />

                  {/* Core Node Orb */}
                  <span
                    className="relative flex items-center justify-center rounded-full border-2 transition-transform duration-300 group-hover:scale-125"
                    style={{
                      width: `${nodeSizePx}px`,
                      height: `${nodeSizePx}px`,
                      backgroundColor: tier.color,
                      borderColor: isSelected ? '#ffffff' : 'rgba(255,255,255,0.65)',
                      boxShadow: `0 0 ${10 + Math.round(stats.intensity / 4)}px ${tier.color}, 0 0 ${22 + Math.round(stats.intensity / 2)}px ${tier.glowRgba}`,
                    }}
                  >
                    {stats.intensity >= 85 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </span>

                  {/* Compact Node Label */}
                  <span
                    className={`absolute left-1/2 -translate-x-1/2 top-full mt-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono whitespace-nowrap pointer-events-none transition-all ${
                      isSelected
                        ? 'bg-black/90 text-white border border-white/40 font-bold z-30'
                        : 'bg-black/70 text-[#cbd5e1] opacity-80 group-hover:opacity-100'
                    }`}
                  >
                    {saga.title.length > 16 ? `${saga.title.slice(0, 15)}…` : saga.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected / Hovered Node Live Telemetry Inspector */}
          <div
            className="rounded-2xl border p-5 bg-[#05060a]/90 flex flex-col justify-between space-y-4 transition-all"
            style={{
              borderColor: `${activeTier.color}88`,
              boxShadow: `0 0 28px ${activeTier.glowRgba}`,
            }}
          >
            <div className="space-y-3">
              <div className="relative h-32 rounded-xl overflow-hidden border border-white/10">
                <img
                  src={activeSaga.banner}
                  alt={activeSaga.title}
                  className="w-full h-full object-cover"
                  style={{ filter: `brightness(${activeTier.brightness})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05060a] via-transparent to-transparent" />
                <span
                  className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase text-black"
                  style={{ backgroundColor: activeTier.color }}
                >
                  {activeTier.label} • {activeStats.intensity}%
                </span>
                <div className="absolute bottom-2.5 left-3 right-3">
                  <div className="text-[10px] font-mono text-[#7fffd4] uppercase">
                    {activeSaga.era} Era • {activeSaga.sectorCoordinates}
                  </div>
                  <h4 className="text-base font-audiowide font-bold text-white truncate">
                    {activeSaga.title}
                  </h4>
                </div>
              </div>

              {/* Dynamic Brightness Meter */}
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#a0a5b5]">Intensidad de Pulso & Brillo</span>
                  <span className="font-bold" style={{ color: activeTier.color }}>
                    {activeStats.intensity}% ({activeTier.pulseDurationMs}ms)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#12151e] overflow-hidden border border-[#1f2430]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${activeStats.intensity}%`,
                      backgroundColor: activeTier.color,
                      boxShadow: `0 0 12px ${activeTier.color}`,
                    }}
                  />
                </div>
              </div>

              {/* Live Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 font-mono text-center">
                <div className="bg-[#0d111a] border border-[#1f2430] rounded-xl p-2.5">
                  <div className="text-[10px] text-[#94a3b8] flex items-center justify-center gap-1">
                    <Users className="w-3 h-3 text-[#00a3ff]" />
                    <span>Activos</span>
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {activeStats.activePlayers}
                  </div>
                </div>
                <div className="bg-[#0d111a] border border-[#1f2430] rounded-xl p-2.5">
                  <div className="text-[10px] text-[#94a3b8] flex items-center justify-center gap-1">
                    <Gamepad2 className="w-3 h-3 text-[#15ffd1]" />
                    <span>Salas</span>
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {activeStats.activeRooms}
                  </div>
                </div>
                <div className="bg-[#0d111a] border border-[#1f2430] rounded-xl p-2.5">
                  <div className="text-[10px] text-[#94a3b8] flex items-center justify-center gap-1">
                    <Zap className="w-3 h-3 text-[#ff4dfa]" />
                    <span>En Curso</span>
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {activeStats.inMatchCount}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 pt-2 border-t border-[#1f2430] font-mono text-xs">
              <button
                onClick={() => {
                  playSoundEffect('portal');
                  openSagaSession(activeSaga.id, 'multiplayer');
                }}
                className="w-full py-2.5 px-4 rounded-xl font-bold uppercase flex items-center justify-center gap-2 cursor-pointer transition-all text-black"
                style={{
                  backgroundColor: activeTier.color,
                  boxShadow: `0 0 18px ${activeTier.glowRgba}`,
                }}
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Entrar a Salas Multijugador</span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    playSoundEffect('click');
                    setCurrentSagaId(activeSaga.id);
                    setActiveTab('saga');
                  }}
                  className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-white flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <Compass className="w-3.5 h-3.5 text-[#00a3ff]" />
                  <span>Ir a Saga</span>
                </button>
                <button
                  onClick={() => {
                    playSoundEffect('click');
                    onSelectSagaDetails(activeSaga as unknown as SagaFullData);
                  }}
                  className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-white flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#15ffd1]" />
                  <span>Detalles</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
