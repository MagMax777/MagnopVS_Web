import React, { useState } from 'react';
import { PanelData, SceneData, StoryState, HiddenObjectItem } from '../../types/game';
import { soundEngine } from '../../services/audio';

interface PanelInspectorProps {
  panel?: PanelData;
  scene?: SceneData;
  storyState: StoryState;
  discoveredObjectIds: string[];
  onInspectObject?: (object: HiddenObjectItem) => void;
  onClose?: () => void;
}

export const PanelInspector: React.FC<PanelInspectorProps> = ({
  panel,
  scene,
  storyState,
  discoveredObjectIds,
  onInspectObject,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<
    'content' | 'composition' | 'characters' | 'dialogue' | 'objects' | 'choices' | 'rpg'
  >('content');

  const tabs: { id: typeof activeTab; label: string; icon: string }[] = [
    { id: 'content', label: 'Contenido', icon: 'article' },
    { id: 'composition', label: 'Composición', icon: 'crop' },
    { id: 'characters', label: 'Personajes', icon: 'group' },
    { id: 'dialogue', label: 'Diálogos', icon: 'chat' },
    { id: 'objects', label: 'Objetos', icon: 'search' },
    { id: 'choices', label: 'Decisiones', icon: 'alt_route' },
    { id: 'rpg', label: 'RPG Stats', icon: 'bar_chart' },
  ];

  if (!panel) {
    return (
      <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center bg-[#0B0B0D] text-[#858585] select-none">
        <span className="material-symbols-outlined text-4xl mb-2 text-[#19191D]">web_stories</span>
        <h4 className="text-sm font-bold text-white font-headline-sm">INSPECTOR DE VIÑETA</h4>
        <p className="text-xs text-[#858585] mt-1 max-w-xs">
          Selecciona cualquier viñeta en el lector vertical para examinar su estructura dramática, objetos ocultos y decisiones.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#0B0B0D] border-l-2 border-[#19191D] select-none overflow-hidden">
      {/* Header */}
      <div className="p-3 bg-[#050505] border-b border-[#19191D] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C8102E]" />
          <div>
            <span className="text-[10px] font-cyber text-[#C8102E] font-bold block">
              {panel.panel_id}
            </span>
            <span className="text-xs font-bold text-white font-headline-sm truncate block max-w-[200px]">
              {panel.title || `Viñeta #${panel.order}`}
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

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto bg-[#0B0B0D] border-b border-[#19191D] px-2 py-1 no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              soundEngine.playSfx('click');
              setActiveTab(tab.id);
            }}
            className={`px-2.5 py-1 text-[11px] font-cyber rounded flex items-center gap-1 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#19191D] text-white border border-[#C8102E] font-bold'
                : 'text-[#858585] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-xs">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs font-body-sm text-[#A0A0A5]">
        {/* TAB 1: Contenido */}
        {activeTab === 'content' && (
          <div className="space-y-3">
            <div className="p-2.5 bg-[#050505] border border-[#19191D]">
              <span className="text-[10px] font-cyber text-[#858585] block mb-1">TIPO DE VIÑETA</span>
              <span className="text-xs font-bold text-[#C8102E] font-headline-sm">
                {panel.panel_type}
              </span>
            </div>

            <div className="p-2.5 bg-[#050505] border border-[#19191D]">
              <span className="text-[10px] font-cyber text-[#858585] block mb-1">FUNCIÓN NARRATIVA</span>
              <p className="text-xs text-white leading-relaxed">{panel.narrative_function}</p>
            </div>

            <div className="p-2.5 bg-[#050505] border border-[#19191D]">
              <span className="text-[10px] font-cyber text-[#858585] block mb-1">DESCRIPCIÓN VISUAL</span>
              <p className="text-xs text-[#FFFFFF] leading-relaxed font-mono text-[11px]">
                {panel.visual_description}
              </p>
            </div>

            <div className="p-2.5 bg-[#050505] border border-[#19191D] flex justify-between items-center">
              <span className="text-[10px] font-cyber text-[#858585]">ESTADO PRODUCCIÓN</span>
              <span className="text-[10px] font-cyber px-2 py-0.5 bg-[#19191D] text-white border border-[#858585]/40 font-bold">
                {panel.production_status}
              </span>
            </div>
          </div>
        )}

        {/* TAB 2: Composición */}
        {activeTab === 'composition' && (
          <div className="space-y-3">
            <div className="p-2.5 bg-[#050505] border border-[#19191D]">
              <span className="text-[10px] font-cyber text-[#858585] block mb-1">ENCUADRE Y COMPOSICIÓN</span>
              <p className="text-xs text-white">{panel.composition || 'Plano dinámico manga'}</p>
            </div>

            <div className="p-2.5 bg-[#050505] border border-[#19191D]">
              <span className="text-[10px] font-cyber text-[#858585] block mb-1">CÁMARA / MOVIMIENTO</span>
              <p className="text-xs text-white">{panel.camera || 'Estática con contraste alto'}</p>
            </div>

            <div className="p-2.5 bg-[#050505] border border-[#19191D]">
              <span className="text-[10px] font-cyber text-[#858585] block mb-1">ILUMINACIÓN & CEL-SHADING</span>
              <p className="text-xs text-white">{panel.lighting || 'Luz de luna y neón carmesí'}</p>
            </div>

            <div className="p-2.5 bg-[#050505] border border-[#19191D]">
              <span className="text-[10px] font-cyber text-[#858585] block mb-1">ESCENARIO / AMBIENTE</span>
              <p className="text-xs text-white">{panel.environment}</p>
            </div>
          </div>
        )}

        {/* TAB 3: Personajes */}
        {activeTab === 'characters' && (
          <div className="space-y-3">
            <div className="p-2.5 bg-[#050505] border border-[#19191D]">
              <span className="text-[10px] font-cyber text-[#858585] block mb-2">PERSONAJES PRESENTES</span>
              {panel.characters.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {panel.characters.map((char, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-[#19191D] border border-[#858585] text-white text-[11px] font-bold"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-[#858585] italic">Sin personajes visibles en esta viñeta</span>
              )}
            </div>

            {scene && (
              <div className="p-2.5 bg-[#050505] border border-[#19191D]">
                <span className="text-[10px] font-cyber text-[#858585] block mb-1">ELENCO DE LA ESCENA</span>
                <span className="text-xs text-white">{scene.characters_present.join(', ')}</span>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Diálogos */}
        {activeTab === 'dialogue' && (
          <div className="space-y-3">
            {panel.dialogue && panel.dialogue.length > 0 ? (
              panel.dialogue.map((d, i) => (
                <div key={i} className="p-3 bg-[#050505] border-l-2 border-[#C8102E] border-y border-r border-[#19191D]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-[#C8102E] uppercase font-headline-sm">
                      {d.speaker}
                    </span>
                    {d.expression && (
                      <span className="text-[9px] font-cyber text-[#858585]">[{d.expression}]</span>
                    )}
                  </div>
                  <p className="text-xs font-manga text-white leading-relaxed">"{d.text}"</p>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-[#858585] text-xs italic">
                Esta viñeta no contiene diálogos directos; es puramente narrativa o de acción.
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Objetos Ocultos (Lost Lands) */}
        {activeTab === 'objects' && (
          <div className="space-y-3">
            {panel.hidden_objects && panel.hidden_objects.length > 0 ? (
              panel.hidden_objects.map(obj => {
                const isFound = discoveredObjectIds.includes(obj.object_id);
                return (
                  <div
                    key={obj.object_id}
                    className={`p-3 border transition-all ${
                      isFound
                        ? 'bg-[#050505] border-[#858585]/40'
                        : 'bg-[#19191D] border-[#C8102E] shadow-md'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-white font-headline-sm">
                        {obj.name}
                      </span>
                      <span
                        className={`text-[9px] font-cyber px-2 py-0.5 rounded ${
                          isFound
                            ? 'bg-[#19191D] text-[#858585]'
                            : 'bg-[#C8102E] text-white font-bold animate-pulse'
                        }`}
                      >
                        {isFound ? 'RECOGIDO' : 'POR RECOGER'}
                      </span>
                    </div>

                    <p className="text-xs text-[#A0A0A5] mb-2">{obj.description}</p>

                    <div className="text-[10px] text-[#C8102E] font-cyber mb-2">
                      Pista visual: {obj.visual_hint}
                    </div>

                    {onInspectObject && (
                      <button
                        onClick={() => {
                          soundEngine.playSfx('discovery');
                          onInspectObject(obj);
                        }}
                        className="w-full py-1.5 bg-[#050505] hover:bg-[#19191D] border border-[#858585] text-white text-[10px] font-cyber font-bold transition-colors"
                      >
                        {isFound ? 'CONSULTAR FICHA DE OBJETO' : 'RECOGER OBJETO OCULTO'}
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 text-[#858585] text-xs italic">
                No hay objetos ocultos en esta viñeta. Busca en las escenas marcadas con ★.
              </div>
            )}
          </div>
        )}

        {/* TAB 6: Decisiones (Lagerta) */}
        {activeTab === 'choices' && (
          <div className="space-y-3">
            {panel.branching_choices && panel.branching_choices.length > 0 ? (
              panel.branching_choices.map(choice => (
                <div key={choice.choice_id} className="p-3 bg-[#050505] border border-[#C8102E]">
                  <span className="text-[10px] font-cyber text-[#C8102E] font-bold block mb-1">
                    DILEMA NARRATIVO
                  </span>
                  <p className="text-xs font-bold text-white mb-2">{choice.prompt}</p>

                  <div className="space-y-2">
                    {choice.options.map(opt => (
                      <div key={opt.option_id} className="p-2 bg-[#19191D] border border-[#19191D] text-[11px]">
                        <span className="font-bold text-white block mb-0.5">{opt.text}</span>
                        {opt.relationship_changes.map((rc, i) => (
                          <span
                            key={i}
                            className={`text-[9px] font-cyber font-bold mr-2 ${
                              rc.type === 'ATTACHMENT' ? 'text-[#62B8E8]' : 'text-[#75F0D3]'
                            }`}
                          >
                            +{rc.amount} {rc.type}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-[#858585] text-xs italic">
                Esta viñeta no contiene bifurcación directa; avanza con la lectura para alcanzar la decisión de la escena.
              </div>
            )}
          </div>
        )}

        {/* TAB 7: RPG Stats & Relationship System */}
        {activeTab === 'rpg' && (
          <div className="space-y-4">
            <div className="p-3 bg-[#050505] border border-[#19191D]">
              <div className="flex justify-between items-center text-xs mb-1 font-cyber">
                <span className="text-[#62B8E8] font-bold">APEGO (YŪREI)</span>
                <span className="text-white font-bold">{storyState.attachment} / 100</span>
              </div>
              <div className="w-full h-2 bg-[#19191D] border border-[#19191D] overflow-hidden mb-2">
                <div
                  className="h-full bg-[#62B8E8] transition-all duration-300"
                  style={{ width: `${storyState.attachment}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-xs mb-1 font-cyber">
                <span className="text-[#75F0D3] font-bold">LIBERACIÓN (YOKOI)</span>
                <span className="text-white font-bold">{storyState.liberation} / 100</span>
              </div>
              <div className="w-full h-2 bg-[#19191D] border border-[#19191D] overflow-hidden">
                <div
                  className="h-full bg-[#75F0D3] transition-all duration-300"
                  style={{ width: `${storyState.liberation}%` }}
                />
              </div>
            </div>

            <div className="p-3 bg-[#050505] border border-[#19191D] text-xs">
              <span className="text-[10px] font-cyber text-[#858585] block mb-1">EQUIPAMIENTO DE YOKOI</span>
              <div className="space-y-1">
                <div className="text-white font-bold">Katana Sónica de Aleación Fría</div>
                <div className="text-[11px] text-[#A0A0A5]">Daga Ceremonial de Seppuku (Era Edo)</div>
                <div className="text-[11px] text-[#C8102E]">Implantes Neuronales Anti-Soma</div>
              </div>
            </div>

            <div className="p-3 bg-[#050505] border border-[#19191D] text-xs">
              <span className="text-[10px] font-cyber text-[#858585] block mb-1">PROGRESO DE PISTAS</span>
              <span className="text-white font-bold">{storyState.clues_found.length} / 5 Ecos recuperados</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
