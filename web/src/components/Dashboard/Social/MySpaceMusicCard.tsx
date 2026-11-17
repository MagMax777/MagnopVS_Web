import React, { useState } from 'react';
import { usePlayer } from '../../../context/PlayerContext';
import { INITIAL_FRIENDS } from '../../../data/dashboardData';
import { 
  Disc, 
  Play, 
  Pause, 
  Volume2, 
  Users, 
  Sparkles, 
  Radio, 
  Heart, 
  Music, 
  Star 
} from 'lucide-react';

export const MySpaceMusicCard: React.FC = () => {
  const { player, playSoundEffect } = usePlayer();
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTrack, setCurrentTrack] = useState('MagnopVS - Sintonía Quantvm #07 (Versión Transmedia)');

  const topFriends = INITIAL_FRIENDS.slice(0, 4);

  return (
    <div className="bg-[#05060a]/95 border-2 border-[#ff007f]/40 p-5 rounded-3xl shadow-[0_0_30px_rgba(255,0,127,0.2)] space-y-5 font-orbitron font-mono">
      
      {/* Header Badge (MagnopVS Profile Audio Player) */}
      <div className="flex items-center justify-between border-b border-[#1f2430] pb-3">
        <div className="flex items-center gap-2">
          <Disc className="w-5 h-5 text-[#ff007f] animate-spin-slow" />
          <span className="text-xs font-audiowide text-white uppercase tracking-wider">
            Sintonizador de Perfil & Top Camaradas
          </span>
        </div>
        <span className="text-[9px] bg-[#ff007f]/20 text-[#ff007f] px-2 py-0.5 rounded border border-[#ff007f]/40">
          Audio Transmedia
        </span>
      </div>

      {/* Embedded Music Track Player */}
      <div className="bg-[#05060a] border border-[#ff007f]/30 p-3 rounded-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 truncate">
          <button
            onClick={() => { setIsPlaying(!isPlaying); playSoundEffect('click'); }}
            className="p-2.5 rounded-xl bg-[#ff007f] text-white hover:bg-[#ff007f]/80 transition-colors cursor-pointer shrink-0 shadow-[0_0_15px_rgba(255,0,127,0.4)]"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <div className="truncate">
            <div className="text-[10px] text-[#ff007f] font-bold uppercase flex items-center gap-1">
              <Music className="w-3 h-3" />
              <span>Canción del Perfil (Profile Anthem)</span>
            </div>
            <p className="text-xs font-bold text-white truncate">{currentTrack}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#ff007f] animate-ping" />
          <span className="text-[10px] text-[#7fffd4]">432Hz</span>
        </div>
      </div>

      {/* Top 8 Friends Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-white">
          <span className="font-bold uppercase text-[#00f0ff] flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>Top Camaradas de {player.name || 'Aetheris'}</span>
          </span>
          <span className="text-[10px] text-[#a0a5b5]">Gremio Quantvm</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {topFriends.map((f) => (
            <div
              key={f.id}
              className="bg-[#05060a] border border-[#1f2430] hover:border-[#ff007f] p-2 rounded-xl flex flex-col items-center text-center space-y-1 transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#ff007f]/50 group-hover:scale-105 transition-transform">
                <img src={f.avatarUrl} alt={f.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-[10px] font-bold text-white truncate w-full">{f.name}</span>
              <span className="text-[8px] text-[#00f0ff]">{f.faction}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
