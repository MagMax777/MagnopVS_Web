import React from 'react';
import { MagnoWaysRoute, MagnoWayNode } from '../../types/magnoways';
import { useMagnoWays } from '../../context/MagnoWaysContext';
import { usePlayer } from '../../context/PlayerContext';
import {
  CheckCircle,
  Lock,
  Play,
  Clock,
  Award,
  Sparkles,
  ArrowRight,
  Shield,
  BookOpen,
  Cpu,
  Flame,
  Swords,
  Trophy,
} from 'lucide-react';

interface Props {
  route: MagnoWaysRoute;
  onSelectNode: (node: MagnoWayNode) => void;
}

export const MagnoWaysTimelineView: React.FC<Props> = ({ route, onSelectNode }) => {
  const { playerProgress, getNodeStatus } = useMagnoWays();
  const { playSoundEffect } = usePlayer();

  const progress = playerProgress[route.id];

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'START': return <Flame className="w-4 h-4 text-[#00f0ff]" />;
      case 'STORY': return <BookOpen className="w-4 h-4 text-[#ff007f]" />;
      case 'GAME': return <Cpu className="w-4 h-4 text-[#8a2be2]" />;
      case 'BOSS': return <Swords className="w-4 h-4 text-[#ff007f]" />;
      case 'FINAL': return <Trophy className="w-4 h-4 text-[#ffd700]" />;
      default: return <Sparkles className="w-4 h-4 text-[#7fffd4]" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 font-orbitron animate-fade-in pb-12">
      
      {/* Timeline Header */}
      <div className="p-4 bg-[#0a0b10] border border-[#1f2430] clip-corner flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold font-audiowide text-[#f8f9fa]">
            Cronología de la Ruta: {route.title}
          </h3>
          <p className="text-xs text-[#a0a5b5] mt-0.5">
            Secuencia ordenada de actividades, decisiones y recompensas progresivas.
          </p>
        </div>

        <div className="text-right font-mono text-xs text-[#00f0ff]">
          <span>{progress?.completedNodeIds.length || 0} / {route.nodes.length} ETAPAS</span>
        </div>
      </div>

      {/* Timeline Vertical Stack */}
      <div className="relative pl-6 sm:pl-10 space-y-6 before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-[#00f0ff] via-[#8a2be2] to-[#7fffd4]">
        {route.nodes.map((node, index) => {
          const status = getNodeStatus(route, node.id);
          const isDone = status === 'completed';
          const isCurrent = status === 'in_progress';
          const isLocked = status === 'locked';

          return (
            <div key={node.id} className="relative group">
              {/* Bullet Node Icon */}
              <div
                className={`absolute -left-6 sm:-left-10 top-3 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  isDone
                    ? 'bg-[#0a0b10] border-[#7fffd4] text-[#7fffd4] shadow-[0_0_15px_rgba(127,255,212,0.5)]'
                    : isCurrent
                    ? 'bg-[#0a0b10] border-[#00f0ff] text-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.7)] scale-110'
                    : isLocked
                    ? 'bg-[#0a0b10] border-[#1f2430] text-[#a0a5b5]'
                    : 'bg-[#0a0b10] border-[#00f0ff]/40 text-[#f8f9fa]'
                }`}
              >
                {isLocked ? (
                  <Lock className="w-3.5 h-3.5" />
                ) : isDone ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  getNodeIcon(node.type)
                )}
              </div>

              {/* Node Card */}
              <div
                onClick={() => {
                  if (!isLocked) {
                    playSoundEffect('click');
                    onSelectNode(node);
                  }
                }}
                className={`p-5 bg-[#0a0b10] border transition-all clip-corner cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isDone
                    ? 'border-[#7fffd4]/30 hover:border-[#7fffd4]'
                    : isCurrent
                    ? 'border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                    : isLocked
                    ? 'border-[#1f2430] opacity-60 cursor-not-allowed'
                    : 'border-[#1f2430] hover:border-[#00f0ff]/50'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#05060a] border border-[#1f2430] rounded text-[#00f0ff]">
                      PASO {index + 1} • {node.type}
                    </span>
                    <span className="text-[10px] text-[#a0a5b5] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {node.estimatedMinutes} min
                    </span>
                    {node.requirements.minLevel && (
                      <span className="text-[10px] text-[#7fffd4] font-mono">
                        Lvl {node.requirements.minLevel}+
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold font-audiowide text-[#f8f9fa]">
                    {node.name}
                  </h4>
                  <p className="text-xs text-[#a0a5b5] leading-relaxed max-w-2xl">
                    {node.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                  <div className="text-right font-mono text-xs">
                    <span className="text-[#00f0ff] font-bold block">+{node.rewards.magnoPoints} MP</span>
                    {node.rewards.microCoins > 0 && (
                      <span className="text-[#ff007f] font-bold block">+{node.rewards.microCoins} µC</span>
                    )}
                  </div>

                  <button
                    disabled={isLocked}
                    className={`p-2.5 rounded-lg border transition-all ${
                      isDone
                        ? 'bg-[#7fffd4]/10 text-[#7fffd4] border-[#7fffd4]/40 hover:bg-[#7fffd4]/20'
                        : isCurrent
                        ? 'bg-[#00f0ff] text-[#05060a] border-[#00f0ff] font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                        : isLocked
                        ? 'bg-[#05060a] text-[#a0a5b5] border-[#1f2430]'
                        : 'bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/40 hover:bg-[#00f0ff]/20'
                    }`}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
