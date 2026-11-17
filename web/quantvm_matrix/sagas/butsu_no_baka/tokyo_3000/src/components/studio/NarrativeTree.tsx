import React, { useState } from 'react';
import { SceneData, SceneId, PanelData } from '../../types/game';
import { soundEngine } from '../../services/audio';

interface NarrativeTreeProps {
  scenes: SceneData[];
  currentSceneId: SceneId;
  selectedPanelId?: string;
  onSelectScene: (sceneId: SceneId) => void;
  onSelectPanel: (panel: PanelData) => void;
  onClose?: () => void;
}

export const NarrativeTree: React.FC<NarrativeTreeProps> = ({
  scenes,
  currentSceneId,
  selectedPanelId,
  onSelectScene,
  onSelectPanel,
  onClose,
}) => {
  const [expandedScenes, setExpandedScenes] = useState<Record<string, boolean>>({
    S01C01SC01: true,
  });

  const toggleSceneExpand = (sceneId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playSfx('click');
    setExpandedScenes(prev => ({ ...prev, [sceneId]: !prev[sceneId] }));
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0B0B0D] border-r-2 border-[#19191D] select-none overflow-hidden">
      {/* Top Header */}
      <div className="p-3 bg-[#050505] border-b border-[#19191D] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#C8102E] text-base">account_tree</span>
          <div>
            <h3 className="text-xs font-bold text-white font-headline-sm uppercase tracking-wider">
              ÁRBOL NARRATIVO
            </h3>
            <span className="text-[9px] font-cyber text-[#858585]">
              JERARQUÍA DEL CAPÍTULO 1
            </span>
          </div>
        </div>

        {onClose && (
          <button
            onClick={() => {
              soundEngine.playSfx('click');
              onClose();
            }}
            className="text-[#858585] hover:text-white p-1"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        )}
      </div>

      {/* Narrative Hierarchy Root */}
      <div className="p-3 flex-1 overflow-y-auto space-y-2 text-xs">
        {/* Season & Chapter Root */}
        <div className="p-2 bg-[#050505] border border-[#19191D]">
          <div className="flex items-center justify-between text-[10px] font-cyber text-[#C8102E] font-bold mb-0.5">
            <span>TEMPORADA 1: EL BUCLE DE YŪREI</span>
            <span>S01</span>
          </div>
          <div className="text-xs font-bold text-white font-headline-sm">
            Capítulo 1: El Inicio del Bucle
          </div>
          <div className="text-[10px] text-[#858585] mt-0.5">
            8 Escenas · 38 Viñetas Interconectadas
          </div>
        </div>

        {/* List of Scenes and Panels */}
        <div className="space-y-1">
          {scenes.map((sc, scIdx) => {
            const targetSceneId = `SCENE_0${scIdx + 1}` as SceneId;
            const isSceneActive = currentSceneId === targetSceneId;
            const isExpanded = !!expandedScenes[sc.scene_id];

            return (
              <div key={sc.scene_id} className="border border-[#19191D] bg-[#050505] rounded overflow-hidden">
                {/* Scene Header Row */}
                <div
                  onClick={() => {
                    soundEngine.playSfx('click');
                    onSelectScene(targetSceneId);
                  }}
                  className={`p-2 flex items-center justify-between cursor-pointer transition-colors ${
                    isSceneActive
                      ? 'bg-[#19191D] border-l-2 border-[#C8102E] text-white'
                      : 'hover:bg-[#111114] text-[#858585] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5 flex-1 truncate pr-2">
                    <span
                      onClick={e => toggleSceneExpand(sc.scene_id, e)}
                      className="material-symbols-outlined text-xs hover:text-[#C8102E] p-0.5"
                    >
                      {isExpanded ? 'expand_more' : 'chevron_right'}
                    </span>
                    <span className="text-[11px] font-bold font-headline-sm truncate">
                      {sc.scene_title.split(':')[0]}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 text-[9px] font-cyber">
                    {sc.has_hidden_objects && (
                      <span className="text-[#C8102E] font-bold">★</span>
                    )}
                    {sc.has_choices && (
                      <span className="text-white font-bold">⚖</span>
                    )}
                    <span className="text-[#858585]">{sc.panels.length}v</span>
                  </div>
                </div>

                {/* Panels Sub-tree */}
                {isExpanded && (
                  <div className="bg-[#0B0B0D] border-t border-[#19191D] pl-4 pr-1 py-1 space-y-0.5">
                    {sc.panels.map(p => {
                      const isPanelSelected = selectedPanelId === p.panel_id;

                      return (
                        <button
                          key={p.panel_id}
                          onClick={() => {
                            if (!isSceneActive) onSelectScene(targetSceneId);
                            onSelectPanel(p);
                          }}
                          className={`w-full p-1.5 flex items-center justify-between text-left text-[11px] rounded transition-all ${
                            isPanelSelected
                              ? 'bg-[#C8102E]/20 text-white font-bold border-l-2 border-[#C8102E]'
                              : 'text-[#858585] hover:text-white hover:bg-[#19191D]'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="text-[9px] font-cyber text-[#858585]">
                              P{p.order}
                            </span>
                            <span className="truncate max-w-[150px]">
                              {p.title || p.panel_type}
                            </span>
                          </div>

                          <span className="text-[9px] font-cyber text-[#858585] uppercase">
                            {p.panel_type.split('_')[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
