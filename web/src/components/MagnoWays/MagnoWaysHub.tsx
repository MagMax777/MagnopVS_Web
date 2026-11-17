import React, { useState } from 'react';
import { useMagnoWays } from '../../context/MagnoWaysContext';
import { usePlayer } from '../../context/PlayerContext';
import { MagnoWaysRouteCard } from './MagnoWaysRouteCard';
import { MagnoWaysRouteDetailModal } from './MagnoWaysRouteDetailModal';
import { MAGNOWAYS_MODALITIES_CONFIG } from '../../data/magnowaysRoutesData';
import {
  MagnoWaysRoute,
  MagnoWaysModality,
  RouteDifficulty,
  ParticipantsMode,
  PlayerRouteProgress,
} from '../../types/magnoways';
import {
  Compass,
  Search,
  Filter,
  Sparkles,
  Play,
  RotateCcw,
  Sliders,
  Shield,
  BookOpen,
  Globe,
  Users,
  Award,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const MagnoWaysHub: React.FC = () => {
  const {
    filteredRoutes,
    routes,
    filters,
    setFilters,
    resetFilters,
    playerProgress,
    resumeRoute,
    setActiveTab,
  } = useMagnoWays();
  const { player, playSoundEffect } = usePlayer();

  const [inspectingRoute, setInspectingRoute] = useState<MagnoWaysRoute | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  // Find active in-progress route if any
  const progressList = Object.values(playerProgress) as PlayerRouteProgress[];
  const activeProgress = progressList.find((p) => p.status === 'in_progress');
  const activeRoute = activeProgress ? routes.find((r) => r.id === activeProgress.routeId) : null;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 font-orbitron animate-fade-in pb-20 px-4">
      
      {/* ========================================================================= */}
      {/* 1. HERO BANNER */}
      {/* ========================================================================= */}
      <div className="relative rounded-2xl overflow-hidden border border-[#00f0ff]/50 bg-[#0a0b10] shadow-[0_0_50px_rgba(0,240,255,0.2)]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1600&auto=format&fit=crop&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05060a] via-[#05060a]/90 to-transparent" />

        <div className="relative p-6 sm:p-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f0ff]/20 border border-[#00f0ff]/50 text-[#00f0ff] text-[10px] font-mono tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>SISTEMA DE RUTAS Y AVENTURAS INTERACTIVAS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-audiowide text-[#f8f9fa] tracking-wider leading-tight">
            Magno<span className="text-[#00f0ff]">Ways</span> Hub
          </h1>

          <p className="text-xs sm:text-sm text-[#a0a5b5] font-orbitron leading-relaxed">
            Conecta los espacios y misterios de <strong className="text-[#f8f9fa]">MagnopVS</strong> a través de caminos vivos. Explora recorridos narrativos, cadenas de misiones cuánticas, expediciones cooperativas e inteligencia geoespacial táctica.
          </p>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                playSoundEffect('click');
                setActiveTab('creator');
              }}
              className="py-2.5 px-5 text-xs font-bold uppercase text-[#05060a] bg-gradient-to-r from-[#00f0ff] to-[#7fffd4] hover:opacity-90 clip-corner transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center gap-2"
            >
              <span>Creator Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                playSoundEffect('click');
                setActiveTab('tactical_geo');
              }}
              className="py-2.5 px-5 text-xs font-bold uppercase text-[#00f0ff] bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 border border-[#00f0ff]/40 clip-corner transition-all cursor-pointer flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              <span>Visor Geoespacial (14 Capas)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ACTIVE RESUME CARD (IF PLAYER HAS AN IN-PROGRESS ROUTE) */}
      {/* ========================================================================= */}
      {activeRoute && activeProgress && (
        <div className="p-5 bg-gradient-to-r from-[#00f0ff]/15 via-[#8a2be2]/15 to-[#ff007f]/15 border border-[#00f0ff] clip-corner shadow-[0_0_30px_rgba(0,240,255,0.2)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-2xl bg-[#0a0b10] border-2 border-[#00f0ff] p-1 flex items-center justify-center shrink-0">
              <Compass className="w-7 h-7 text-[#00f0ff] animate-spin-slow" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#7fffd4] animate-ping" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#00f0ff] uppercase font-bold">
                  RECORRIDO EN CURSO ({activeProgress.percentage}%)
                </span>
                <span className="text-[9px] text-[#a0a5b5] font-mono">
                  {activeRoute.modality.toUpperCase()}
                </span>
              </div>
              <h3 className="text-base font-bold font-audiowide text-[#f8f9fa]">
                {activeRoute.title}
              </h3>
              <p className="text-xs text-[#a0a5b5]">
                Etapa actual: {activeRoute.nodes.find((n) => n.id === activeProgress.currentNodeId)?.name || 'Iniciando'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playSoundEffect('click');
              resumeRoute(activeRoute.id);
            }}
            className="py-2.5 px-6 text-xs font-bold uppercase text-[#05060a] bg-gradient-to-r from-[#7fffd4] to-[#00f0ff] hover:opacity-90 clip-corner transition-all cursor-pointer shadow-[0_0_20px_rgba(127,255,212,0.4)] flex items-center gap-2 shrink-0 self-end sm:self-center"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Reanudar Recorrido</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SEARCH & MODALITY SELECTOR BAR */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        {/* Search Input & Filter Toggle */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full flex items-center bg-[#0a0b10] border border-[#1f2430] focus-within:border-[#00f0ff] px-4 py-2.5 clip-corner transition-all">
            <Search className="w-4 h-4 text-[#a0a5b5] mr-2 shrink-0" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="Buscar por título, temática, saga, desafío o palabra clave..."
              className="w-full bg-transparent text-xs text-[#f8f9fa] placeholder-[#a0a5b5] focus:outline-none"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                className="text-[#a0a5b5] hover:text-[#ff007f] text-xs cursor-pointer ml-2"
              >
                Limpiar
              </button>
            )}
          </div>

          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`py-2.5 px-4 text-xs font-bold uppercase border clip-corner transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              showAdvancedFilters
                ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff]'
                : 'bg-[#0a0b10] border-[#1f2430] text-[#a0a5b5] hover:text-[#f8f9fa]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Filtros Avanzados</span>
          </button>
        </div>

        {/* Modality Horizontal Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => {
              playSoundEffect('click');
              setFilters((prev) => ({ ...prev, modality: 'ALL' }));
            }}
            className={`py-2 px-3.5 text-xs font-bold font-audiowide border clip-corner transition-all whitespace-nowrap cursor-pointer ${
              filters.modality === 'ALL'
                ? 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]'
                : 'bg-[#0a0b10] text-[#a0a5b5] border-[#1f2430] hover:text-[#f8f9fa]'
            }`}
          >
            TODAS LAS RUTAS ({routes.length})
          </button>

          {MAGNOWAYS_MODALITIES_CONFIG.map((mod) => (
            <button
              key={mod.id}
              onClick={() => {
                playSoundEffect('click');
                setFilters((prev) => ({ ...prev, modality: mod.id }));
              }}
              className={`py-2 px-3 text-xs font-bold font-audiowide border clip-corner transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                filters.modality === mod.id
                  ? 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]'
                  : 'bg-[#0a0b10] text-[#a0a5b5] border-[#1f2430] hover:text-[#f8f9fa]'
              }`}
            >
              <span>{mod.name}</span>
            </button>
          ))}
        </div>

        {/* Advanced Filter Drawer */}
        {showAdvancedFilters && (
          <div className="p-4 bg-[#0a0b10] border border-[#1f2430] clip-corner grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in text-xs">
            <div>
              <label className="text-[10px] text-[#a0a5b5] block mb-1">DIFICULTAD</label>
              <select
                value={filters.difficulty}
                onChange={(e) => setFilters((prev) => ({ ...prev, difficulty: e.target.value as RouteDifficulty | 'ALL' }))}
                className="w-full bg-[#05060a] border border-[#1f2430] p-2 text-[#f8f9fa] clip-corner focus:outline-none"
              >
                <option value="ALL">Todas las Dificultades</option>
                <option value="Iniciación">Iniciación</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
                <option value="Experto">Experto</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[#a0a5b5] block mb-1">MODALIDAD DE JUEGO</label>
              <select
                value={filters.participantsMode}
                onChange={(e) => setFilters((prev) => ({ ...prev, participantsMode: e.target.value as ParticipantsMode | 'ALL' }))}
                className="w-full bg-[#05060a] border border-[#1f2430] p-2 text-[#f8f9fa] clip-corner focus:outline-none"
              >
                <option value="ALL">Cualquier Modo</option>
                <option value="SOLO">Individual (Solo)</option>
                <option value="COOP">Cooperativo (Co-op)</option>
                <option value="COMPETITIVE">Competitivo</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[#a0a5b5] block mb-1">ORDENAR POR</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
                className="w-full bg-[#05060a] border border-[#1f2430] p-2 text-[#f8f9fa] clip-corner focus:outline-none"
              >
                <option value="popular">Más Populares</option>
                <option value="rating">Mejor Valoradas</option>
                <option value="newest">Más Recientes</option>
                <option value="rewards">Mayor Recompensa MP</option>
                <option value="duration">Menor Duración</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full py-2 px-3 text-xs font-bold uppercase text-[#a0a5b5] hover:text-[#00f0ff] bg-[#05060a] border border-[#1f2430] hover:border-[#00f0ff]/40 clip-corner transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer Filtros</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. MAIN ROUTES CATALOG GRID */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-audiowide text-[#f8f9fa] flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#00f0ff]" />
            <span>Explorador de Rutas ({filteredRoutes.length})</span>
          </h2>

          <span className="text-xs text-[#a0a5b5] font-mono">
            {filters.modality === 'ALL' ? 'Todas las Categorías' : `${filters.modality.toUpperCase()} WAYS`}
          </span>
        </div>

        {filteredRoutes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoutes.map((route) => (
              <MagnoWaysRouteCard
                key={route.id}
                route={route}
                onOpenDetails={(r) => setInspectingRoute(r)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-[#0a0b10] border border-[#1f2430] clip-corner space-y-3">
            <Compass className="w-10 h-10 text-[#a0a5b5] mx-auto opacity-40 animate-spin-slow" />
            <h4 className="text-base font-bold font-audiowide text-[#f8f9fa]">
              No se encontraron rutas con los criterios seleccionados
            </h4>
            <p className="text-xs text-[#a0a5b5]">
              Intenta cambiar los filtros de búsqueda o restablecer la configuración.
            </p>
            <button
              onClick={resetFilters}
              className="py-2 px-4 text-xs font-bold uppercase text-[#05060a] bg-[#00f0ff] hover:bg-[#7fffd4] clip-corner transition-all cursor-pointer"
            >
              Restablecer Filtros
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. MODAL DETAIL POPUP */}
      {/* ========================================================================= */}
      {inspectingRoute && (
        <MagnoWaysRouteDetailModal
          route={inspectingRoute}
          onClose={() => setInspectingRoute(null)}
        />
      )}

    </div>
  );
};
