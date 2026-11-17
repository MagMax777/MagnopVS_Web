import React from 'react';
import { SceneId } from '../../types/game';
import { SCENE_METAS } from '../../data/narrative';
import { soundEngine } from '../../services/audio';

interface HUDProps {
  currentScene: SceneId;
  cluesCount: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenJournal: () => void;
  onOpenPause: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  currentScene,
  cluesCount,
  isMuted,
  onToggleMute,
  onOpenJournal,
  onOpenPause,
}) => {
  const meta = SCENE_METAS[currentScene];

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-3 select-none">
      {/* Top Perimeter Cluster */}
      <div className="flex items-center justify-between w-full">
        {/* Left: Scene Status Badge */}
        {meta && (
          <div className="pointer-events-auto bg-[#151722]/85 border border-[#62B8E8]/40 px-3 py-1.5 rounded-lg shadow-lg flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#75F0D3]" />
            <div className="flex flex-col">
              <span className="text-[10px] font-cyber text-[#62B8E8] tracking-widest uppercase">
                {meta.number} · {meta.title}
              </span>
              <span className="text-[9px] text-[#777B89] hidden sm:inline">
                {meta.renderMode}
              </span>
            </div>
          </div>
        )}

        {/* Right: Quick Action Buttons */}
        <div className="pointer-events-auto flex items-center space-x-2">
          {/* Quick Journal Button */}
          <button
            onClick={() => {
              soundEngine.playSfx('click');
              onOpenJournal();
            }}
            className="px-2.5 py-1.5 rounded-lg bg-[#151722]/85 hover:bg-[#1f2438] border border-[#75F0D3]/40 text-[#75F0D3] text-xs font-cyber flex items-center space-x-1.5 shadow-md transition-colors"
          >
            <span>📜</span>
            <span className="hidden sm:inline">Diario</span>
            <span className="bg-[#090A0F] px-1.5 py-0.2 rounded font-bold text-[10px] text-[#75F0D3] tabular-nums">
              {cluesCount}
            </span>
          </button>

          {/* Quick Audio Mute Toggle */}
          <button
            onClick={() => {
              soundEngine.playSfx('click');
              onToggleMute();
            }}
            className="p-1.5 rounded-lg bg-[#151722]/85 hover:bg-[#1f2438] border border-[#252a3d] text-[#F1EEE8] text-xs shadow-md transition-colors"
            title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>

          {/* Pause Menu Button */}
          <button
            onClick={() => {
              soundEngine.playSfx('click');
              onOpenPause();
            }}
            className="px-2.5 py-1.5 rounded-lg bg-[#151722]/85 hover:bg-[#1f2438] border border-[#62B8E8]/40 text-[#62B8E8] text-xs font-cyber font-bold shadow-md transition-colors"
          >
            ⏸ Menú
          </button>
        </div>
      </div>

      {/* Bottom Perimeter: Clean, zero-occlusion layout */}
      <div className="w-full flex justify-center pointer-events-none" />
    </div>
  );
};
