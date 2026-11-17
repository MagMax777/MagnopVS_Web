import React from 'react';
import {
  MagnoWaysRoute,
  MagnoWaysModality,
} from '../../types/magnoways';
import { useMagnoWays } from '../../context/MagnoWaysContext';
import { usePlayer } from '../../context/PlayerContext';
import {
  Sparkles,
  Clock,
  Award,
  Users,
  Bookmark,
  BookmarkCheck,
  Play,
  ArrowRight,
  Shield,
  Star,
  CheckCircle,
} from 'lucide-react';

interface Props {
  route: MagnoWaysRoute;
  onOpenDetails: (route: MagnoWaysRoute) => void;
}

export const MagnoWaysRouteCard: React.FC<Props> = ({ route, onOpenDetails }) => {
  const { startRoute, resumeRoute, playerProgress, savedRouteIds, toggleSaveRoute } = useMagnoWays();
  const { playSoundEffect } = usePlayer();

  const progress = playerProgress[route.id];
  const isSaved = savedRouteIds.includes(route.id);
  const isCompleted = progress?.status === 'completed';
  const isInProgress = progress?.status === 'in_progress';

  const getModalityColor = (modality: MagnoWaysModality) => {
    switch (modality) {
      case 'story': return 'from-[#ff007f] to-[#8a2be2] text-[#ff007f] border-[#ff007f]/40';
      case 'quest': return 'from-[#00f0ff] to-[#0072ff] text-[#00f0ff] border-[#00f0ff]/40';
      case 'exploration': return 'from-[#7fffd4] to-[#00f0ff] text-[#7fffd4] border-[#7fffd4]/40';
      case 'game': return 'from-[#8a2be2] to-[#ff007f] text-[#ffabf3] border-[#8a2be2]/40';
      case 'learning': return 'from-[#0072ff] to-[#7fffd4] text-[#0072ff] border-[#0072ff]/40';
      case 'social': return 'from-[#ffabf3] to-[#ff007f] text-[#ffabf3] border-[#ffabf3]/40';
      case 'saga': return 'from-[#ffd700] to-[#ff007f] text-[#ffd700] border-[#ffd700]/40';
      case 'real': return 'from-[#00f0ff] to-[#7fffd4] text-[#00f0ff] border-[#00f0ff]/40';
      case 'creator': return 'from-[#a0a5b5] to-[#7fffd4] text-[#a0a5b5] border-[#a0a5b5]/40';
      case 'crossway': return 'from-[#00ffff] to-[#8a2be2] text-[#00ffff] border-[#00ffff]/40';
      default: return 'from-[#00f0ff] to-[#7fffd4] text-[#00f0ff] border-[#00f0ff]/40';
    }
  };

  return (
    <div className="group relative flex flex-col justify-between bg-[#0a0b10] border border-[#1f2430] hover:border-[#00f0ff]/60 transition-all duration-300 clip-corner shadow-lg hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] overflow-hidden font-orbitron">
      
      {/* Top Banner & Badges */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={route.coverImage}
          alt={route.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b10] via-[#0a0b10]/40 to-transparent" />

        {/* Modality Tag */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`px-2.5 py-1 text-[9px] font-bold tracking-wider uppercase bg-[#05060a]/90 backdrop-blur-md border ${getModalityColor(route.modality)} clip-corner`}>
            {route.modality.toUpperCase()} WAY
          </span>
          {route.isOfficial && (
            <span className="px-2 py-0.5 text-[8px] font-bold tracking-wider uppercase bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50 rounded font-mono">
              OFICIAL
            </span>
          )}
        </div>

        {/* Bookmark Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveRoute(route.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-lg bg-[#05060a]/80 hover:bg-[#00f0ff]/20 text-[#a0a5b5] hover:text-[#00f0ff] border border-[#1f2430] hover:border-[#00f0ff]/40 transition-all cursor-pointer"
          title={isSaved ? 'Quitar de guardadas' : 'Guardar ruta'}
        >
          {isSaved ? <BookmarkCheck className="w-4 h-4 text-[#00f0ff]" /> : <Bookmark className="w-4 h-4" />}
        </button>

        {/* Saga Pill if present */}
        {route.sagaTitle && (
          <div className="absolute bottom-2 left-3">
            <span className="text-[10px] text-[#7fffd4] font-semibold tracking-wide drop-shadow-md">
              {route.sagaTitle}
            </span>
          </div>
        )}
      </div>

      {/* Body Information */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#a0a5b5] mb-1">
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-[#ffd700] fill-[#ffd700]" />
              <span className="font-bold text-[#f8f9fa]">{route.rating.toFixed(1)}</span>
              <span className="text-[9px]">({route.reviewsCount})</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#00f0ff]" />
              <span>{route.estimatedDurationMin} min</span>
            </div>
          </div>

          <h3
            onClick={() => onOpenDetails(route)}
            className="text-base font-bold font-audiowide text-[#f8f9fa] group-hover:text-[#00f0ff] transition-colors cursor-pointer line-clamp-1"
          >
            {route.title}
          </h3>

          <p className="text-xs text-[#a0a5b5] line-clamp-2 mt-1 font-orbitron leading-relaxed">
            {route.description}
          </p>
        </div>

        {/* Progress Bar if active */}
        {progress && (
          <div className="space-y-1 bg-[#05060a] p-2 border border-[#1f2430] clip-corner">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-[#a0a5b5] flex items-center gap-1">
                {isCompleted ? (
                  <CheckCircle className="w-3 h-3 text-[#7fffd4]" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping" />
                )}
                {isCompleted ? 'Completada' : 'Progreso'}
              </span>
              <span className="font-mono text-[#00f0ff] font-bold">{progress.percentage}%</span>
            </div>
            <div className="w-full h-1 bg-[#1f2430] rounded-full overflow-hidden">
              <div
                className={`h-full ${isCompleted ? 'bg-[#7fffd4]' : 'bg-gradient-to-r from-[#00f0ff] to-[#ff007f]'}`}
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Meta Stats & Rewards Chips */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1f2430] text-[10px]">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#05060a] text-[#7fffd4] border border-[#7fffd4]/30 rounded">
              Lvl {route.recommendedLevel}+
            </span>
            <span className="px-2 py-0.5 bg-[#05060a] text-[#a0a5b5] border border-[#1f2430] rounded">
              {route.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <span className="text-[#00f0ff] font-bold">+{route.rewardsSummary.mp} MP</span>
            {route.rewardsSummary.microCoins > 0 && (
              <span className="text-[#ff007f] font-bold">+{route.rewardsSummary.microCoins} µC</span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-3 bg-[#05060a] border-t border-[#1f2430] flex items-center gap-2">
        <button
          onClick={() => onOpenDetails(route)}
          className="flex-1 py-2 px-3 text-xs font-bold uppercase text-[#a0a5b5] hover:text-[#00f0ff] hover:bg-[#00f0ff]/10 border border-[#1f2430] hover:border-[#00f0ff]/40 transition-all clip-corner cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>Detalles</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => {
            playSoundEffect('click');
            if (isInProgress) {
              resumeRoute(route.id);
            } else {
              startRoute(route.id);
            }
          }}
          className="py-2 px-4 text-xs font-bold uppercase text-[#05060a] bg-gradient-to-r from-[#00f0ff] to-[#7fffd4] hover:from-[#7fffd4] hover:to-[#00f0ff] transition-all clip-corner cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isCompleted ? 'Repetir' : isInProgress ? 'Continuar' : 'Iniciar'}</span>
        </button>
      </div>

    </div>
  );
};
