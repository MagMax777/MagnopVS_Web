import React, { useRef, useState } from 'react';
import { SceneData, PanelData, HiddenObjectItem, BranchingChoice } from '../../types/game';
import { PanelArtRenderer } from '../manga/PanelArtRenderer';
import { CharacterPortrait } from '../manga/MangaArt';
import { soundEngine } from '../../services/audio';
import { DuelEngine } from '../rpg/DuelEngine';

interface WebtoonReaderProps {
  scene: SceneData;
  selectedPanelId?: string;
  onSelectPanel: (panel: PanelData) => void;
  discoveredObjectIds: string[];
  onDiscoverObject: (object: HiddenObjectItem) => void;
  onChooseOption: (choiceId: string, optionId: string, changes: { type: 'ATTACHMENT' | 'LIBERATION'; amount: number; reason?: string }[]) => void;
  chosenOptions: Record<string, string>;
  onNextScene: () => void;
  onPrevScene: () => void;
  hasNextScene: boolean;
  hasPrevScene: boolean;
  attachment?: number;
  liberation?: number;
  onRelationshipShift?: (type: 'ATTACHMENT' | 'LIBERATION', amount: number, reason: string) => void;
}

export const WebtoonReader: React.FC<WebtoonReaderProps> = ({
  scene,
  selectedPanelId,
  onSelectPanel,
  discoveredObjectIds,
  onDiscoverObject,
  onChooseOption,
  chosenOptions,
  onNextScene,
  onPrevScene,
  hasNextScene,
  hasPrevScene,
  attachment = 0,
  liberation = 0,
  onRelationshipShift,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeDuelPanelId, setActiveDuelPanelId] = useState<string | null>(null);

  const handlePanelClick = (panel: PanelData) => {
    soundEngine.playSfx('dialogue');
    onSelectPanel(panel);
  };

  return (
    <div
      ref={containerRef}
      className="w-full flex flex-col items-center py-4 space-y-8 max-w-2xl mx-auto px-2 sm:px-4"
    >
      {/* Scene Header Card (Webtoon Prologue Banner) */}
      <div className="w-full bg-[#0B0B0D] border-2 border-[#19191D] p-5 shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-2 pb-2 border-b border-[#19191D]">
          <span className="text-[10px] font-cyber tracking-widest text-[#C8102E] uppercase font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#C8102E] inline-block animate-ping" />
            {scene.sequence_title}
          </span>
          <span className="text-[10px] font-cyber text-[#858585]">
            LECTURA VERTICAL · {scene.estimated_reading_time}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-headline-lg text-white font-bold tracking-tight mb-2">
          {scene.scene_title}
        </h2>

        <div className="grid grid-cols-2 gap-2 text-xs text-[#858585] mb-3">
          <div>
            <span className="text-[#A0A0A5] font-bold">Ubicación:</span> {scene.location}
          </div>
          <div>
            <span className="text-[#A0A0A5] font-bold">Tiempo:</span> {scene.time_context}
          </div>
          <div>
            <span className="text-[#A0A0A5] font-bold">Tono:</span> {scene.emotional_tone}
          </div>
          <div>
            <span className="text-[#A0A0A5] font-bold">Viñetas:</span> {scene.panels.length}
          </div>
        </div>

        <p className="text-xs text-[#A0A0A5] leading-relaxed border-t border-[#19191D] pt-2 italic">
          Objetivo: {scene.narrative_objective}
        </p>
      </div>

      {/* Vertical Stack of Interconnected Panels */}
      {scene.panels.map((panel, idx) => {
        const isSelected = selectedPanelId === panel.panel_id;

        return (
          <article
            key={panel.panel_id}
            id={panel.panel_id}
            onClick={() => handlePanelClick(panel)}
            className={`w-full flex flex-col transition-all cursor-pointer ${
              isSelected
                ? 'ring-2 ring-[#C8102E] shadow-[0_0_25px_rgba(200,16,46,0.3)] bg-[#0B0B0D]'
                : 'hover:border-[#858585] bg-[#050505]'
            }`}
          >
            {/* Visual Illustration Canvas */}
            <PanelArtRenderer
              panel={panel}
              onHotspotClick={obj => {
                soundEngine.playSfx('discovery');
                onDiscoverObject(obj);
              }}
              discoveredObjectIds={discoveredObjectIds}
            />

            {/* Panel Narrative Content & Captions */}
            {panel.captions && (
              <div className="p-4 bg-[#0B0B0D] border-x-2 border-b-2 border-[#19191D]">
                <p className="text-sm font-body-md text-[#FFFFFF] leading-relaxed">
                  {panel.captions}
                </p>
              </div>
            )}

            {/* Visual Novel Dialogue Balloons (Lagerta Style) */}
            {panel.dialogue && panel.dialogue.length > 0 && (
              <div className="p-4 bg-[#111114] border-x-2 border-b-2 border-[#19191D] space-y-3">
                {panel.dialogue.map((d, dIdx) => (
                  <div key={dIdx} className="flex items-start gap-3">
                    <div className="shrink-0">
                      <CharacterPortrait
                        character={d.speaker.includes('Yūrei') ? 'Yūrei' : d.speaker.includes('Yokoi') ? 'Yokoi' : 'Eco'}
                        size="sm"
                        glow={d.speaker.includes('Yūrei')}
                      />
                    </div>
                    <div className="flex-1 bg-[#19191D] border-l-2 border-[#C8102E] p-3 shadow-md">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#C8102E] uppercase font-headline-sm tracking-wider">
                          {d.speaker}
                        </span>
                        {d.expression && (
                          <span className="text-[9px] font-cyber text-[#858585] uppercase">
                            [{d.expression}]
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-manga text-[#FFFFFF] leading-relaxed">
                        {d.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Branching Decisions (Lagerta / RPG Style) */}
            {panel.branching_choices && panel.branching_choices.length > 0 && (
              <div className="p-4 bg-[#0B0B0D] border-x-2 border-b-2 border-[#C8102E] shadow-lg">
                {panel.branching_choices.map((choice: BranchingChoice) => (
                  <div key={choice.choice_id} className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-white font-headline-sm">
                      <span className="material-symbols-outlined text-[#C8102E] text-base">alt_route</span>
                      <span>{choice.prompt}</span>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {choice.options.map(opt => {
                        const isChosen = chosenOptions[choice.choice_id] === opt.option_id;

                        return (
                          <button
                            key={opt.option_id}
                            onClick={e => {
                              e.stopPropagation();
                              soundEngine.playSfx('dialogue');
                              onChooseOption(choice.choice_id, opt.option_id, opt.relationship_changes);
                            }}
                            className={`p-3 text-left border transition-all text-xs flex flex-col justify-between ${
                              isChosen
                                ? 'bg-[#C8102E]/20 border-[#C8102E] text-white shadow-[0_0_15px_#C8102E]'
                                : 'bg-[#19191D] border-[#19191D] hover:border-[#858585] text-[#A0A0A5] hover:text-white'
                            }`}
                          >
                            <div className="flex items-center justify-between font-bold mb-1">
                              <span className={isChosen ? 'text-[#C8102E]' : 'text-white'}>
                                {opt.text}
                              </span>
                              {isChosen && (
                                <span className="text-[10px] font-cyber text-[#C8102E] uppercase font-bold">
                                  ✓ SELECCIONADO
                                </span>
                              )}
                            </div>
                            {opt.consequences && (
                              <span className="text-[10px] text-[#858585] italic">
                                {opt.consequences.join(' · ')}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* DuelEngine Tactical Combat Integration (Scene 6 Guard Ambush or Scene 7 Combat Arena) */}
            {(panel.illustration_type === 'combat_arena' ||
              panel.illustration_type === 'cult_ambush' ||
              panel.panel_id === 'S01C01SC06P005' ||
              panel.panel_id === 'S01C01SC07P003') && (
              <div className="p-4 bg-[#0B0B0D] border-x-2 border-b-2 border-[#C8102E]/60">
                {activeDuelPanelId === panel.panel_id ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-[#19191D]">
                      <span className="text-xs font-cyber text-[#C8102E] font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#C8102E] animate-ping" />
                        DUEL ENGINE ACTIVADO // COMBATE EN TIEMPO REAL
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDuelPanelId(null);
                        }}
                        className="text-[10px] font-cyber text-[#858585] hover:text-white px-2 py-0.5 border border-[#19191D]"
                      >
                        MINIMIZAR COMBATE ✕
                      </button>
                    </div>
                    <DuelEngine
                      attachment={attachment}
                      liberation={liberation}
                      onVictory={() => {
                        soundEngine.playSfx('victory');
                      }}
                      onRelationshipShift={onRelationshipShift}
                      embedded={true}
                    />
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundEngine.playSfx('slash');
                      setActiveDuelPanelId(panel.panel_id);
                    }}
                    className="w-full py-3 px-4 bg-gradient-to-r from-[#C8102E] to-[#800A1D] hover:from-[#E61937] hover:to-[#A30D25] text-white font-cyber text-xs font-bold tracking-wider shadow-lg flex items-center justify-center gap-2 border border-[#C8102E]/60 transition-all hover:scale-[1.01]"
                  >
                    <span className="text-sm">⚔</span>
                    <span>BATALLA TÁCTICA: ENFRENTAR A LOS GUARDIAS DEL CULTO CON DUEL ENGINE</span>
                    <span className="text-[10px] opacity-80">(APEGO: +{Math.round(attachment * 0.5)} DMG | LIBERACIÓN: +{Math.round(liberation * 0.45)} DMG)</span>
                  </button>
                )}
              </div>
            )}

            {/* Gutter / Negative Space Between Panels for Webtoon Suspense */}
            {idx < scene.panels.length - 1 && (
              <div className="w-full h-8 flex items-center justify-center my-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#19191D]" />
              </div>
            )}
          </article>
        );
      })}

      {/* Scene Footer Navigation Controls */}
      <div className="w-full p-4 bg-[#0B0B0D] border-2 border-[#19191D] flex items-center justify-between mt-4">
        <button
          onClick={onPrevScene}
          disabled={!hasPrevScene}
          className="px-4 py-2 bg-[#19191D] border border-[#19191D] hover:border-white text-xs font-cyber text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          ← ESCENA ANTERIOR
        </button>

        <span className="text-xs font-cyber text-[#858585]">
          FIN DE LA ESCENA // {scene.panels.length} VIÑETAS
        </span>

        <button
          onClick={onNextScene}
          disabled={!hasNextScene}
          className="px-5 py-2 bg-[#C8102E] hover:bg-[#E61937] text-xs font-cyber font-bold text-white disabled:opacity-30 disabled:pointer-events-none transition-colors shadow-lg"
        >
          SIGUIENTE ESCENA →
        </button>
      </div>
    </div>
  );
};
