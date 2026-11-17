import React from 'react';
import { MagnoWaysRoute } from '../../types/magnoways';
import { useMagnoWays } from '../../context/MagnoWaysContext';
import { usePlayer } from '../../context/PlayerContext';
import {
  X,
  Play,
  MapPin,
  Clock,
  Shield,
  Award,
  Users,
  Sparkles,
  BookOpen,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Globe,
  Share2,
} from 'lucide-react';

interface Props {
  route: MagnoWaysRoute;
  onClose: () => void;
}

export const MagnoWaysRouteDetailModal: React.FC<Props> = ({ route, onClose }) => {
  const { startRoute, resumeRoute, playerProgress, setActiveTab, setActivePresentationMode, createLobby } = useMagnoWays();
  const { player, playSoundEffect } = usePlayer();

  const progress = playerProgress[route.id];
  const isCompleted = progress?.status === 'completed';
  const isInProgress = progress?.status === 'in_progress';

  const handleStart = () => {
    playSoundEffect('portal');
    onClose();
    if (isInProgress) {
      resumeRoute(route.id);
    } else {
      startRoute(route.id);
    }
  };

  const handleCreateLobby = () => {
    playSoundEffect('click');
    onClose();
    createLobby(route.id, route.participantsMode === 'SOLO' ? 'COOP' : route.participantsMode, route.maxParticipants, false);
    setActiveTab('multiplayer');
  };

  const handleInspectMap = () => {
    playSoundEffect('click');
    onClose();
    startRoute(route.id);
    setActivePresentationMode('map');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05060a]/85 backdrop-blur-md animate-fade-in font-orbitron">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0a0b10] border border-[#00f0ff]/50 shadow-[0_0_50px_rgba(0,240,255,0.25)] clip-corner flex flex-col overflow-hidden">
        
        {/* Header Hero Image */}
        <div className="relative h-60 w-full shrink-0 overflow-hidden">
          <img
            src={route.bannerImage || route.coverImage}
            alt={route.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b10] via-[#0a0b10]/60 to-transparent" />

          {/* Close Button */}
          <button
            onClick={() => {
              playSoundEffect('click');
              onClose();
            }}
            className="absolute top-4 right-4 p-2.5 rounded-xl bg-[#05060a]/80 hover:bg-[#ff007f]/20 text-[#a0a5b5] hover:text-[#ff007f] border border-[#1f2430] hover:border-[#ff007f]/40 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Badges & Title */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50 clip-corner">
                {route.modality.toUpperCase()} WAY
              </span>
              {route.sagaTitle && (
                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#8a2be2]/20 text-[#ffabf3] border border-[#8a2be2]/50 clip-corner">
                  {route.sagaTitle}
                </span>
              )}
              {route.isOfficial && (
                <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-[#7fffd4]/20 text-[#7fffd4] border border-[#7fffd4]/50 rounded font-mono">
                  CANON OFICIAL
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-audiowide text-[#f8f9fa] drop-shadow-md">
              {route.title}
            </h2>
            <p className="text-xs text-[#7fffd4] font-medium mt-1">
              {route.subtitle}
            </p>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-[#f8f9fa]">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#05060a] p-3.5 border border-[#1f2430] clip-corner">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#00f0ff]" />
              <div>
                <span className="text-[10px] text-[#a0a5b5] block">DURACIÓN</span>
                <strong className="text-xs text-[#f8f9fa]">{route.estimatedDurationMin} minutos</strong>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-[#7fffd4]" />
              <div>
                <span className="text-[10px] text-[#a0a5b5] block">DIFICULTAD</span>
                <strong className="text-xs text-[#f8f9fa]">{route.difficulty} (Lvl {route.recommendedLevel}+)</strong>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-[#ff007f]" />
              <div>
                <span className="text-[10px] text-[#a0a5b5] block">MODALIDAD</span>
                <strong className="text-xs text-[#f8f9fa]">{route.participantsMode} (Máx {route.maxParticipants})</strong>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Award className="w-4 h-4 text-[#ffd700]" />
              <div>
                <span className="text-[10px] text-[#a0a5b5] block">RECOMPENSA</span>
                <strong className="text-xs text-[#ffd700] font-mono">+{route.rewardsSummary.mp} MP / {route.rewardsSummary.microCoins} µC</strong>
              </div>
            </div>
          </div>

          {/* Synopsis & Lore */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#00f0ff] font-audiowide flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Sinopsis & Contexto Transmedia</span>
            </h4>
            <p className="text-xs sm:text-sm text-[#a0a5b5] leading-relaxed">
              {route.synopsis || route.description}
            </p>
          </div>

          {/* Nodes Sequence Pathway */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#7fffd4] font-audiowide flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>Secuencia de Nodos ({route.nodes.length} Etapas)</span>
            </h4>

            <div className="space-y-2">
              {route.nodes.map((node, index) => {
                const isNodeDone = progress?.completedNodeIds.includes(node.id);
                const isNodeCurrent = progress?.currentNodeId === node.id;

                return (
                  <div
                    key={node.id}
                    className={`p-3 border clip-corner flex items-center justify-between transition-all ${
                      isNodeDone
                        ? 'bg-[#7fffd4]/10 border-[#7fffd4]/40 text-[#f8f9fa]'
                        : isNodeCurrent
                        ? 'bg-[#00f0ff]/15 border-[#00f0ff] text-[#00f0ff]'
                        : 'bg-[#05060a] border-[#1f2430] text-[#a0a5b5]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isNodeDone
                          ? 'bg-[#7fffd4] text-[#05060a]'
                          : isNodeCurrent
                          ? 'bg-[#00f0ff] text-[#05060a]'
                          : 'bg-[#1f2430] text-[#a0a5b5]'
                      }`}>
                        {index + 1}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-xs font-bold text-[#f8f9fa]">{node.name}</strong>
                          <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 bg-[#05060a] border border-[#1f2430] rounded">
                            {node.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#a0a5b5] line-clamp-1">{node.description}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono text-[#00f0ff] block">
                        +{node.rewards.magnoPoints} MP
                      </span>
                      {node.rewards.microCoins > 0 && (
                        <span className="text-[10px] font-mono text-[#ff007f] block">
                          +{node.rewards.microCoins} µC
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Author Card */}
          <div className="flex items-center justify-between p-3.5 bg-[#05060a] border border-[#1f2430] clip-corner">
            <div className="flex items-center gap-3">
              <img
                src={route.author.avatarUrl}
                alt={route.author.name}
                className="w-10 h-10 rounded-xl object-cover border border-[#00f0ff]/40"
              />
              <div>
                <span className="text-[10px] text-[#a0a5b5] block">AUTOR DE LA RUTA</span>
                <strong className="text-xs font-audiowide text-[#f8f9fa]">{route.author.name}</strong>
              </div>
            </div>

            {route.author.badge && (
              <span className="px-2.5 py-1 text-[9px] font-bold font-mono text-[#7fffd4] bg-[#7fffd4]/10 border border-[#7fffd4]/30 rounded">
                {route.author.badge}
              </span>
            )}
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-[#05060a] border-t border-[#1f2430] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleInspectMap}
              className="py-2.5 px-4 text-xs font-bold uppercase text-[#00f0ff] bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 border border-[#00f0ff]/40 transition-all clip-corner cursor-pointer flex items-center gap-1.5"
            >
              <Globe className="w-4 h-4" />
              <span>Ver Mapa de Nodos</span>
            </button>

            {route.participantsMode !== 'SOLO' && (
              <button
                onClick={handleCreateLobby}
                className="py-2.5 px-4 text-xs font-bold uppercase text-[#ffabf3] bg-[#ff007f]/10 hover:bg-[#ff007f]/20 border border-[#ff007f]/40 transition-all clip-corner cursor-pointer flex items-center gap-1.5"
              >
                <Users className="w-4 h-4" />
                <span>Crear Sala Multijugador</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="py-2.5 px-4 text-xs font-bold uppercase text-[#a0a5b5] hover:text-[#f8f9fa] transition-colors cursor-pointer"
            >
              Cerrar
            </button>

            <button
              onClick={handleStart}
              className="py-2.5 px-6 text-xs font-bold uppercase text-[#05060a] bg-gradient-to-r from-[#00f0ff] via-[#7fffd4] to-[#00f0ff] hover:opacity-90 transition-all clip-corner cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isCompleted ? 'Volver a Jugar' : isInProgress ? 'Reanudar Recorrido' : 'Iniciar Recorrido'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
