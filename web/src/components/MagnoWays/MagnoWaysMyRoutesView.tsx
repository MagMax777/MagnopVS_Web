import React, { useState } from 'react';
import { useMagnoWays } from '../../context/MagnoWaysContext';
import { usePlayer } from '../../context/PlayerContext';
import { MagnoWaysRouteCard } from './MagnoWaysRouteCard';
import { MagnoWaysRouteDetailModal } from './MagnoWaysRouteDetailModal';
import { MagnoWaysRoute, PlayerRouteProgress } from '../../types/magnoways';
import {
  Sparkles,
  Trophy,
  Clock,
  Bookmark,
  CheckCircle,
  Play,
  Award,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const MagnoWaysMyRoutesView: React.FC = () => {
  const { routes, playerProgress, savedRouteIds, setActiveTab } = useMagnoWays();
  const { player, playSoundEffect } = usePlayer();

  const [activeSubTab, setActiveSubTab] = useState<'in_progress' | 'completed' | 'saved'>('in_progress');
  const [inspectingRoute, setInspectingRoute] = useState<MagnoWaysRoute | null>(null);

  // Compute stats
  const progressEntries = Object.values(playerProgress) as PlayerRouteProgress[];
  const completedCount = progressEntries.filter((p) => p.status === 'completed').length;
  const inProgressCount = progressEntries.filter((p) => p.status === 'in_progress').length;
  const totalMpEarned = progressEntries.reduce((acc, p) => acc + (p.earnedRewards?.mp || 0), 0);
  const totalMcEarned = progressEntries.reduce((acc, p) => acc + (p.earnedRewards?.microCoins || 0), 0);

  // Filter routes according to active sub-tab
  const inProgressRoutes = routes.filter((r) => playerProgress[r.id]?.status === 'in_progress');
  const completedRoutes = routes.filter((r) => playerProgress[r.id]?.status === 'completed');
  const savedRoutes = routes.filter((r) => savedRouteIds.includes(r.id));

  const currentDisplayList =
    activeSubTab === 'in_progress'
      ? inProgressRoutes
      : activeSubTab === 'completed'
      ? completedRoutes
      : savedRoutes;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 font-orbitron animate-fade-in pb-16 px-4">
      
      {/* Header Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0a0b10] border border-[#1f2430] clip-corner space-y-1">
          <span className="text-[10px] text-[#a0a5b5] font-mono uppercase block">RUTAS COMPLETADAS</span>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#7fffd4]" />
            <span className="text-xl font-black font-audiowide text-[#f8f9fa]">{completedCount}</span>
          </div>
        </div>

        <div className="p-4 bg-[#0a0b10] border border-[#1f2430] clip-corner space-y-1">
          <span className="text-[10px] text-[#a0a5b5] font-mono uppercase block">RUTAS EN CURSO</span>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#00f0ff]" />
            <span className="text-xl font-black font-audiowide text-[#f8f9fa]">{inProgressCount}</span>
          </div>
        </div>

        <div className="p-4 bg-[#0a0b10] border border-[#1f2430] clip-corner space-y-1">
          <span className="text-[10px] text-[#a0a5b5] font-mono uppercase block">MAGNOPOINTS GANADOS</span>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00f0ff]" />
            <span className="text-xl font-black font-audiowide text-[#00f0ff] font-mono">+{totalMpEarned} MP</span>
          </div>
        </div>

        <div className="p-4 bg-[#0a0b10] border border-[#1f2430] clip-corner space-y-1">
          <span className="text-[10px] text-[#a0a5b5] font-mono uppercase block">MICROCOINS OBTENIDOS</span>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#ff007f]" />
            <span className="text-xl font-black font-audiowide text-[#ff007f] font-mono">+{totalMcEarned} µC</span>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-3 border-b border-[#1f2430] pb-2">
        <button
          onClick={() => {
            playSoundEffect('click');
            setActiveSubTab('in_progress');
          }}
          className={`py-2 px-4 text-xs font-bold font-audiowide clip-corner transition-all cursor-pointer ${
            activeSubTab === 'in_progress'
              ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50'
              : 'text-[#a0a5b5] hover:text-[#f8f9fa]'
          }`}
        >
          En Curso ({inProgressRoutes.length})
        </button>

        <button
          onClick={() => {
            playSoundEffect('click');
            setActiveSubTab('completed');
          }}
          className={`py-2 px-4 text-xs font-bold font-audiowide clip-corner transition-all cursor-pointer ${
            activeSubTab === 'completed'
              ? 'bg-[#7fffd4]/20 text-[#7fffd4] border border-[#7fffd4]/50'
              : 'text-[#a0a5b5] hover:text-[#f8f9fa]'
          }`}
        >
          Completadas ({completedRoutes.length})
        </button>

        <button
          onClick={() => {
            playSoundEffect('click');
            setActiveSubTab('saved');
          }}
          className={`py-2 px-4 text-xs font-bold font-audiowide clip-corner transition-all cursor-pointer ${
            activeSubTab === 'saved'
              ? 'bg-[#ff007f]/20 text-[#ff007f] border border-[#ff007f]/50'
              : 'text-[#a0a5b5] hover:text-[#f8f9fa]'
          }`}
        >
          Guardadas ({savedRoutes.length})
        </button>
      </div>

      {/* Routes Grid or Empty State */}
      {currentDisplayList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentDisplayList.map((route) => (
            <MagnoWaysRouteCard
              key={route.id}
              route={route}
              onOpenDetails={(r) => setInspectingRoute(r)}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-[#0a0b10] border border-[#1f2430] clip-corner space-y-4">
          <Trophy className="w-12 h-12 text-[#a0a5b5] mx-auto opacity-50" />
          <h4 className="text-base font-bold font-audiowide text-[#f8f9fa]">
            No hay rutas en esta categoría todavía
          </h4>
          <p className="text-xs text-[#a0a5b5] max-w-md mx-auto">
            Explora el catálogo del MagnoWays Hub para iniciar nuevas aventuras, o crea tus propios recorridos en el Creator Studio.
          </p>
          <button
            onClick={() => setActiveTab('hub')}
            className="py-2.5 px-6 text-xs font-bold uppercase text-[#05060a] bg-gradient-to-r from-[#00f0ff] to-[#7fffd4] hover:opacity-90 clip-corner transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Ir al Catálogo de Rutas</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {inspectingRoute && (
        <MagnoWaysRouteDetailModal
          route={inspectingRoute}
          onClose={() => setInspectingRoute(null)}
        />
      )}

    </div>
  );
};
