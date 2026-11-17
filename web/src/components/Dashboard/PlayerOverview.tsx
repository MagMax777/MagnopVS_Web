import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { 
  Zap, 
  Radio, 
  Bot, 
  Shield, 
  Coins, 
  Award, 
  Edit3, 
  ShoppingBag
} from 'lucide-react';

export const PlayerOverview: React.FC = () => {
  const { player, setIsAuthModalOpen, setIsStoreModalOpen, playSoundEffect } = usePlayer();

  const xpPercentage = Math.min(100, Math.floor((player.currentXp / player.maxXp) * 100));

  return (
    <div className="hud-panel p-6 sm:p-8 font-orbitron relative overflow-hidden clip-corner">
      
      {/* Background Cyber Accent Lines */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#0072ff]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left: Avatar & Main Level Info */}
        <div className="lg:col-span-5 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          
          {/* Avatar Container with Equipped Frame Glow */}
          <div className="relative group">
            <div className={`relative w-28 h-28 sm:w-32 sm:h-32 p-1 border ${
              player.equippedFrameId === 'frame-gold' 
                ? 'border-[#ff007f] shadow-[0_0_25px_rgba(255,0,127,0.5)]' 
                : 'border-[#7fffd4] shadow-[0_0_20px_rgba(127,255,212,0.4)]'
            } clip-corner`}>
              <div className="w-full h-full overflow-hidden bg-[#05060a]">
                <img 
                  src={player.avatarUrl} 
                  alt={player.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
            </div>

            {/* Level Badge Overlay */}
            <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-[#7fffd4] text-[#05060a] font-black font-audiowide text-xs shadow-lg flex items-center gap-1 clip-button">
              <span>LVL</span>
              <span className="text-sm">{player.level}</span>
            </div>
          </div>

          {/* Name & Title */}
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-[#8a2be2]/15 border border-[#8a2be2]/40 text-[#8a2be2] text-[10px] font-orbitron font-bold uppercase mb-1">
              <Shield className="w-3 h-3 text-[#8a2be2]" />
              <span>{player.faction}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-audiowide text-[#f8f9fa] tracking-wider mb-1 flex items-center justify-center sm:justify-start gap-2">
              <span>{player.name}</span>
              <button 
                onClick={() => {
                  playSoundEffect('click');
                  setIsAuthModalOpen(true);
                }}
                className="p-1 hover:bg-[#1f2430] text-[#a0a5b5] hover:text-[#7fffd4] transition-colors"
                title="Editar Perfil"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </h2>

            <div className="text-xs text-[#ff007f] font-orbitron font-bold mb-3 flex items-center justify-center sm:justify-start gap-1">
              <Award className="w-4 h-4 text-[#ff007f]" />
              <span>{player.title}</span>
            </div>

            {/* XP Bar */}
            <div className="w-full">
              <div className="flex justify-between text-xs font-orbitron text-[#a0a5b5] mb-1">
                <span>Experiencia RPG</span>
                <span className="text-[#7fffd4] font-bold">{player.currentXp} / {player.maxXp} XP ({xpPercentage}%)</span>
              </div>
              <div className="w-full h-2.5 bg-[#05060a] border border-[#1f2430]">
                <div 
                  className="h-full bg-gradient-to-r from-[#0072ff] via-[#7fffd4] to-[#00f0ff] transition-all duration-500 shadow-[0_0_10px_rgba(127,255,212,0.5)]"
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right: RPG Stat Gauges */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          {/* Stat 1: Quantvm Energy */}
          <div className="p-3.5 bg-[#05060a] border border-[#00f0ff]/30 clip-corner">
            <div className="flex items-center justify-between text-xs text-[#a0a5b5] mb-2 font-orbitron">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#00f0ff]" />
                Energía
              </span>
              <span className="text-[#00f0ff] font-bold">{player.stats.quantvmEnergy}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#12141d]">
              <div 
                className="h-full bg-[#00f0ff]" 
                style={{ width: `${player.stats.quantvmEnergy}%` }} 
              />
            </div>
          </div>

          {/* Stat 2: Cosmic Tuning */}
          <div className="p-3.5 bg-[#05060a] border border-[#ff007f]/30 clip-corner">
            <div className="flex items-center justify-between text-xs text-[#a0a5b5] mb-2 font-orbitron">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#ff007f]" />
                Sintonía
              </span>
              <span className="text-[#ff007f] font-bold">{player.stats.cosmicTuning}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#12141d]">
              <div 
                className="h-full bg-[#ff007f]" 
                style={{ width: `${player.stats.cosmicTuning}%` }} 
              />
            </div>
          </div>

          {/* Stat 3: Sof.IA Intellect */}
          <div className="p-3.5 bg-[#05060a] border border-[#7fffd4]/30 clip-corner">
            <div className="flex items-center justify-between text-xs text-[#a0a5b5] mb-2 font-orbitron">
              <span className="flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-[#7fffd4]" />
                Intelecto
              </span>
              <span className="text-[#7fffd4] font-bold">{player.stats.intellectSofia}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#12141d]">
              <div 
                className="h-full bg-[#7fffd4]" 
                style={{ width: `${player.stats.intellectSofia}%` }} 
              />
            </div>
          </div>

          {/* Stat 4: Faction Rep */}
          <div className="p-3.5 bg-[#05060a] border border-[#8a2be2]/30 clip-corner">
            <div className="flex items-center justify-between text-xs text-[#a0a5b5] mb-2 font-orbitron">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#8a2be2]" />
                Reputación
              </span>
              <span className="text-[#8a2be2] font-bold">{player.stats.factionReputation}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#12141d]">
              <div 
                className="h-full bg-[#8a2be2]" 
                style={{ width: `${player.stats.factionReputation}%` }} 
              />
            </div>
          </div>

        </div>

      </div>

      {/* Quick Action Footer inside Overview */}
      <div className="mt-6 pt-4 border-t border-[#1f2430] flex flex-wrap items-center justify-between gap-4 font-orbitron">
        <div className="flex items-center gap-2 text-xs text-[#a0a5b5]">
          <Coins className="w-4 h-4 text-[#ff007f]" />
          <span>Saldo Actual: <strong className="text-[#f8f9fa] font-bold">{player.magnoPoints.toLocaleString()} MagnoPoints</strong></span>
        </div>

        <button
          onClick={() => {
            playSoundEffect('click');
            setIsStoreModalOpen(true);
          }}
          className="px-4 py-2 bg-[#ff007f]/15 border border-[#ff007f]/40 text-[#ff007f] hover:bg-[#ff007f]/25 text-xs font-audiowide uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer clip-button"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Tienda MagnoPoints</span>
        </button>
      </div>

    </div>
  );
};
