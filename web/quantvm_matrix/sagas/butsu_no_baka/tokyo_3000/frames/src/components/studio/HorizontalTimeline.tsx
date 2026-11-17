import React from 'react';
import { SceneData, SceneId } from '../../types/game';
import { soundEngine } from '../../services/audio';

interface HorizontalTimelineProps {
  scenes: SceneData[];
  currentSceneId: SceneId;
  onSelectScene: (sceneId: SceneId) => void;
  discoveredObjectsCount: number;
}

export const HorizontalTimeline: React.FC<HorizontalTimelineProps> = ({
  scenes,
  currentSceneId,
  onSelectScene,
  discoveredObjectsCount,
}) => {
  const currentIndex = scenes.findIndex(s => s.scene_id.includes(currentSceneId.replace('SCENE_', 'SC')));

  return (
    <div className="w-full bg-[#0B0B0D] border-b-2 border-[#19191D] px-3 sm:px-6 py-2.5 z-30 select-none">
      <div className="flex items-center justify-between mb-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[#C8102E] font-cyber font-bold tracking-widest text-[11px] uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#C8102E] inline-block animate-pulse" />
            EJE HORIZONTAL: PROGRESIÓN NARRATIVA
          </span>
          <span className="text-[#858585] text-[10px] hidden md:inline">
            // S01 · CAPÍTULO 1: EL INICIO DEL BUCLE
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-cyber text-[#858585]">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-xs text-[#C8102E]">search</span>
            <span>OBJETOS: {discoveredObjectsCount}</span>
          </span>
          <span className="hidden sm:inline">|</span>
          <span className="text-white font-bold">
            ESCENA {currentIndex >= 0 ? currentIndex + 1 : 1} / {scenes.length}
          </span>
        </div>
      </div>

      {/* Horizontal Scrollable Scenes Track */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
        {scenes.map((scene, idx) => {
          // Convert scene_id (e.g. S01C01SC01) to SceneId (SCENE_01)
          const targetId = `SCENE_0${idx + 1}` as SceneId;
          const isActive = currentSceneId === targetId;

          return (
            <button
              key={scene.scene_id}
              onClick={() => {
                soundEngine.playSfx('click');
                onSelectScene(targetId);
              }}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded transition-all text-left border ${
                isActive
                  ? 'bg-[#19191D] border-[#C8102E] text-white shadow-[0_0_12px_rgba(200,16,46,0.3)]'
                  : 'bg-[#050505] border-[#19191D] hover:border-[#858585] text-[#858585] hover:text-white'
              }`}
            >
              <span
                className={`text-[10px] font-cyber font-bold px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-[#C8102E] text-white' : 'bg-[#19191D] text-[#858585]'
                }`}
              >
                0{idx + 1}
              </span>

              <div className="flex flex-col">
                <span className="text-xs font-bold font-headline-sm truncate max-w-[150px] sm:max-w-[200px]">
                  {scene.scene_title.split(':')[1]?.trim() || scene.scene_title}
                </span>
                <div className="flex items-center gap-2 text-[9px] font-cyber text-[#858585]">
                  <span>{scene.panels.length} viñetas</span>
                  {scene.has_hidden_objects && (
                    <span className="text-[#C8102E] font-bold" title="Contiene objetos ocultos">
                      ★ Objetos
                    </span>
                  )}
                  {scene.has_choices && (
                    <span className="text-white font-bold" title="Contiene decisiones">
                      ⚖ Decisión
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
