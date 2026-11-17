import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { INITIAL_ACHIEVEMENTS, AchievementItem } from '../../data/dashboardData';
import { 
  Activity, 
  Award, 
  Flame, 
  Sparkles, 
  Zap, 
  Shield, 
  CheckCircle, 
  Lock,
  Heart,
  Brain,
  Smile,
  Compass,
  Star
} from 'lucide-react';

export const RpgStatsAndAchievementsView: React.FC = () => {
  const { player, addXpAndMp, playSoundEffect } = usePlayer();
  const [achievements, setAchievements] = useState<AchievementItem[]>(INITIAL_ACHIEVEMENTS);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const unlockAchievement = (id: string) => {
    setAchievements(prev =>
      prev.map(a => {
        if (a.id === id && !a.isUnlocked) {
          addXpAndMp(a.xpReward, a.mpReward);
          playSoundEffect('level');
          return { ...a, isUnlocked: true, unlockDate: new Date().toISOString().split('T')[0], progress: a.maxProgress };
        }
        return a;
      })
    );
  };

  const categories = ['Exploración', 'Alquimia', 'MCDS', 'Social', 'Lore'];
  const filteredAchievements = selectedCategory
    ? achievements.filter(a => a.category === selectedCategory)
    : achievements;

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;

  return (
    <div className="space-y-8 font-orbitron max-w-5xl mx-auto">
      
      {/* RPG Core Stats Grid */}
      <div className="bg-[#05060a]/90 border border-[#00f0ff]/30 p-6 rounded-2xl shadow-[0_0_20px_rgba(0,240,255,0.15)] space-y-6">
        <div className="flex items-center justify-between border-b border-[#1f2430] pb-3 font-mono">
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-[#00f0ff]" />
            <h3 className="text-base font-audiowide text-[#f8f9fa] uppercase tracking-wide">
              Matriz de Atributos RPG del Avatar
            </h3>
          </div>
          <span className="text-xs text-[#00f0ff] font-bold">Alineamiento Armónico</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 font-mono text-xs">
          
          <div className="bg-[#05060a] border border-[#1f2430] p-3.5 rounded-xl space-y-1">
            <div className="text-[10px] text-[#a0a5b5] flex items-center justify-between">
              <span>Energía Quantvm</span>
              <Zap className="w-3.5 h-3.5 text-[#00f0ff]" />
            </div>
            <div className="text-lg font-bold text-[#00f0ff]">{player.stats.quantvmEnergy} / 100</div>
            <div className="w-full bg-[#1f2430] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#00f0ff] h-full" style={{ width: `${player.stats.quantvmEnergy}%` }} />
            </div>
          </div>

          <div className="bg-[#05060a] border border-[#1f2430] p-3.5 rounded-xl space-y-1">
            <div className="text-[10px] text-[#a0a5b5] flex items-center justify-between">
              <span>Sintonía Cósmica</span>
              <Sparkles className="w-3.5 h-3.5 text-[#ff007f]" />
            </div>
            <div className="text-lg font-bold text-[#ff007f]">{player.stats.cosmicTuning} / 100</div>
            <div className="w-full bg-[#1f2430] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#ff007f] h-full" style={{ width: `${player.stats.cosmicTuning}%` }} />
            </div>
          </div>

          <div className="bg-[#05060a] border border-[#1f2430] p-3.5 rounded-xl space-y-1">
            <div className="text-[10px] text-[#a0a5b5] flex items-center justify-between">
              <span>Intelecto SOF.IA</span>
              <Brain className="w-3.5 h-3.5 text-[#7fffd4]" />
            </div>
            <div className="text-lg font-bold text-[#7fffd4]">{player.stats.intellectSofia} / 100</div>
            <div className="w-full bg-[#1f2430] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#7fffd4] h-full" style={{ width: `${player.stats.intellectSofia}%` }} />
            </div>
          </div>

          <div className="bg-[#05060a] border border-[#1f2430] p-3.5 rounded-xl space-y-1">
            <div className="text-[10px] text-[#a0a5b5] flex items-center justify-between">
              <span>Reputación de Gremio</span>
              <Shield className="w-3.5 h-3.5 text-[#ffaa00]" />
            </div>
            <div className="text-lg font-bold text-[#ffaa00]">{player.stats.factionReputation} / 100</div>
            <div className="w-full bg-[#1f2430] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#ffaa00] h-full" style={{ width: `${player.stats.factionReputation}%` }} />
            </div>
          </div>

        </div>
      </div>

      {/* Achievement Matrix Header */}
      <div className="bg-[#05060a]/90 border border-[#ff007f]/30 p-6 rounded-2xl shadow-[0_0_20px_rgba(255,0,127,0.15)] space-y-6">
        <div className="flex items-center justify-between border-b border-[#1f2430] pb-3 font-mono flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-[#ff007f]" />
            <h3 className="text-base font-audiowide text-[#f8f9fa] uppercase tracking-wide">
              Matriz de Logros y Trofeos
            </h3>
          </div>
          <span className="text-xs text-[#7fffd4] font-bold">
            {unlockedCount} de {achievements.length} Desbloqueados ({Math.round((unlockedCount / achievements.length) * 100)}%)
          </span>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none font-mono text-xs">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-xl border cursor-pointer ${
              selectedCategory === null ? 'bg-[#ff007f]/20 text-[#ff007f] border-[#ff007f]' : 'bg-[#05060a] text-[#a0a5b5] border-[#1f2430]'
            }`}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl border cursor-pointer ${
                selectedCategory === cat ? 'bg-[#ff007f]/20 text-[#ff007f] border-[#ff007f]' : 'bg-[#05060a] text-[#a0a5b5] border-[#1f2430]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
          {filteredAchievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition-all space-y-3 ${
                ach.isUnlocked
                  ? 'bg-[#05060a] border-[#00f0ff]/40 shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                  : 'bg-[#05060a]/50 border-[#1f2430] opacity-75'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                    ach.isUnlocked ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff]' : 'bg-[#1f2430] border-[#1f2430] text-[#a0a5b5]'
                  }`}>
                    {ach.isUnlocked ? <Award className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#f8f9fa]">{ach.title}</h4>
                    <span className="text-[10px] text-[#ff007f] uppercase font-bold">{ach.rarity} • {ach.category}</span>
                  </div>
                </div>

                <span className="text-[10px] text-[#7fffd4] bg-[#7fffd4]/10 border border-[#7fffd4]/30 px-2 py-0.5 rounded">
                  {ach.globalPercentage}% Jugadores
                </span>
              </div>

              <p className="text-xs text-[#a0a5b5] leading-relaxed">
                {ach.description}
              </p>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-[#a0a5b5]">
                  <span>Progreso</span>
                  <span>{ach.progress} / {ach.maxProgress}</span>
                </div>
                <div className="w-full bg-[#1f2430] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#00f0ff] h-full transition-all duration-500" style={{ width: `${(ach.progress / ach.maxProgress) * 100}%` }} />
                </div>
              </div>

              {!ach.isUnlocked && ach.progress >= ach.maxProgress && (
                <button
                  onClick={() => unlockAchievement(ach.id)}
                  className="w-full py-2 bg-[#00f0ff] text-[#05060a] font-bold text-xs uppercase rounded-xl cursor-pointer"
                >
                  Reclamar Recompensa ({ach.xpReward} XP / {ach.mpReward} MP)
                </button>
              )}
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
