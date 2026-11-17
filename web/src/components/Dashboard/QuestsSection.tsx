import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { 
  CheckCircle2, 
  Coins, 
  Zap, 
  Bot, 
  Globe, 
  BookOpen, 
  Sparkles,
  Award
} from 'lucide-react';

export const QuestsSection: React.FC = () => {
  const { quests, claimQuestReward, playSoundEffect } = usePlayer();
  const [filter, setFilter] = useState<'todas' | 'diaria' | 'lore' | 'sistema'>('todas');

  const filteredQuests = quests.filter((q) => {
    if (filter === 'todas') return true;
    return q.type === filter;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bot':
        return <Bot className="w-5 h-5 text-[#8a2be2]" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-[#0072ff]" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-[#ff007f]" />;
      default:
        return <Zap className="w-5 h-5 text-[#7fffd4]" />;
    }
  };

  return (
    <div className="hud-panel p-6 sm:p-8 font-orbitron clip-corner">
      
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-black font-audiowide text-[#f8f9fa] flex items-center gap-2 uppercase tracking-wide">
            <Award className="w-5 h-5 text-[#7fffd4]" />
            <span>Misiones del Universo</span>
          </h3>
          <p className="text-xs text-[#a0a5b5] font-orbitron">
            Completa desafíos diarios y misiones del lore para acumular XP y MagnoPoints.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#05060a] p-1 border border-[#1f2430] self-start sm:self-auto clip-corner">
          {(['todas', 'diaria', 'lore', 'sistema'] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                playSoundEffect('click');
                setFilter(t);
              }}
              className={`px-3 py-1.5 text-xs font-orbitron font-bold uppercase tracking-wider transition-all ${
                filter === t
                  ? 'bg-[#0072ff]/20 text-[#7fffd4] border border-[#7fffd4]/40'
                  : 'text-[#a0a5b5] hover:text-[#f8f9fa]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Quests List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredQuests.map((quest) => {
          const isDone = quest.isCompleted;
          const isClaimed = quest.isClaimed;
          const progressPercent = Math.min(100, Math.floor((quest.current / quest.target) * 100));

          return (
            <div
              key={quest.id}
              className={`p-5 border transition-all duration-300 clip-corner ${
                isClaimed
                  ? 'bg-[#05060a]/50 border-[#1f2430] opacity-60'
                  : isDone
                  ? 'bg-[#7fffd4]/10 border-[#7fffd4] shadow-[0_0_20px_rgba(127,255,212,0.2)]'
                  : 'bg-[#05060a] border-[#1f2430] hover:border-[#0072ff]/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Left: Quest Details */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#12141d] border border-[#1f2430] shrink-0">
                    {getIcon(quest.iconName)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-orbitron font-bold text-[#7fffd4] uppercase px-2 py-0.5 bg-[#7fffd4]/10 border border-[#7fffd4]/30">
                        {quest.type}
                      </span>
                      <h4 className="font-bold font-audiowide text-[#f8f9fa] text-sm uppercase">{quest.title}</h4>
                    </div>

                    <p className="text-xs text-[#a0a5b5] mb-3 max-w-xl leading-relaxed">{quest.description}</p>

                    {/* Progress Bar */}
                    <div className="w-full sm:w-64">
                      <div className="flex justify-between text-[10px] font-orbitron text-[#a0a5b5] mb-1">
                        <span>Progreso</span>
                        <span>{quest.current} / {quest.target}</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#12141d]">
                        <div 
                          className="h-full bg-gradient-to-r from-[#0072ff] to-[#7fffd4]" 
                          style={{ width: `${progressPercent}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Rewards & Claim Button */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 border-t sm:border-t-0 border-[#1f2430] pt-3 sm:pt-0 shrink-0">
                  
                  {/* Rewards Pills */}
                  <div className="flex items-center gap-2 font-orbitron text-xs">
                    <span className="px-2.5 py-1 bg-[#0072ff]/20 text-[#7fffd4] border border-[#0072ff]/40 font-bold">
                      +{quest.xpReward} XP
                    </span>
                    <span className="px-2.5 py-1 bg-[#ff007f]/20 text-[#ff007f] border border-[#ff007f]/40 flex items-center gap-1 font-bold">
                      <Coins className="w-3 h-3 text-[#ff007f]" />
                      +{quest.mpReward} MP
                    </span>
                  </div>

                  {/* Claim Button */}
                  {isClaimed ? (
                    <div className="flex items-center gap-1 text-xs font-orbitron text-[#7fffd4]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Reclamada</span>
                    </div>
                  ) : isDone ? (
                    <button
                      onClick={() => claimQuestReward(quest.id)}
                      className="px-4 py-2 bg-gradient-to-r from-[#7fffd4] to-[#00f0ff] text-[#05060a] font-black font-audiowide text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(127,255,212,0.4)] hover:brightness-125 flex items-center gap-1.5 transition-all cursor-pointer clip-button"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Reclamar Recompensa</span>
                    </button>
                  ) : (
                    <span className="text-xs font-orbitron text-[#a0a5b5]">En progreso...</span>
                  )}

                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
