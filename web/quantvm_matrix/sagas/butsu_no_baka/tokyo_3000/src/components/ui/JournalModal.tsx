import React, { useState } from 'react';
import { ALL_CLUES, CHARACTER_PROFILES } from '../../data/narrative';
import { StoryState } from '../../types/game';
import { soundEngine } from '../../services/audio';

interface JournalModalProps {
  storyState: StoryState;
  onClose: () => void;
}

export const JournalModal: React.FC<JournalModalProps> = ({ storyState, onClose }) => {
  const [activeTab, setActiveTab] = useState<'clues' | 'characters' | 'stats'>('clues');

  const discoveredClues = ALL_CLUES.filter(c => storyState.clues_found.includes(c.id));

  return (
    <div className="fixed inset-0 z-50 bg-[#090A0F]/85 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-2xl bg-[#151722] border-2 border-[#62B8E8]/60 rounded-xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#0f111a] border-b border-[#62B8E8]/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">📜</span>
            <h2 className="text-lg font-display text-[#F1EEE8]">
              DIARIO DEL BUCLE TEMPORAL
            </h2>
          </div>
          <button
            onClick={() => {
              soundEngine.playSfx('click');
              onClose();
            }}
            className="text-[#777B89] hover:text-[#e11d48] font-bold text-lg p-1"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#252a3d] bg-[#12141d] px-6 text-xs font-cyber">
          <button
            onClick={() => {
              soundEngine.playSfx('click');
              setActiveTab('clues');
            }}
            className={`py-3 px-4 font-bold border-b-2 transition-colors ${
              activeTab === 'clues'
                ? 'border-[#75F0D3] text-[#75F0D3]'
                : 'border-transparent text-[#777B89] hover:text-white'
            }`}
          >
            Pistas y Ecos ({discoveredClues.length}/{ALL_CLUES.length})
          </button>
          <button
            onClick={() => {
              soundEngine.playSfx('click');
              setActiveTab('characters');
            }}
            className={`py-3 px-4 font-bold border-b-2 transition-colors ${
              activeTab === 'characters'
                ? 'border-[#62B8E8] text-[#62B8E8]'
                : 'border-transparent text-[#777B89] hover:text-white'
            }`}
          >
            Registros de Personajes
          </button>
          <button
            onClick={() => {
              soundEngine.playSfx('click');
              setActiveTab('stats');
            }}
            className={`py-3 px-4 font-bold border-b-2 transition-colors ${
              activeTab === 'stats'
                ? 'border-[#D34DAA] text-[#D34DAA]'
                : 'border-transparent text-[#777B89] hover:text-white'
            }`}
          >
            Resonancia del Alma
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB 1: Pistas y Ecos */}
          {activeTab === 'clues' && (
            <div className="flex flex-col space-y-3">
              {discoveredClues.length === 0 ? (
                <div className="text-center py-12 text-[#777B89] text-sm font-manga">
                  Aún no has descubierto fragmentos en el bosque ni en el puente. Explora los escenarios para recolectar evidencias.
                </div>
              ) : (
                discoveredClues.map(clue => (
                  <div
                    key={clue.id}
                    className="p-3.5 rounded-lg bg-[#090A0F] border border-[#62B8E8]/30 flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-cyber font-bold text-xs text-[#75F0D3]">
                        {clue.name}
                      </span>
                      <span className="text-[10px] text-[#777B89] font-cyber">
                        Origen: {clue.sceneOrigin === 'SCENE_03' ? 'El Puente de Edo' : 'El Claro del Ritual'}
                      </span>
                    </div>
                    <p className="text-xs text-[#F1EEE8] mb-2">{clue.description}</p>
                    {clue.revealedMemory && (
                      <div className="p-2 bg-[#151722] rounded border-l-2 border-[#D34DAA] text-[11px] font-manga text-[#F1EEE8] italic">
                        {clue.revealedMemory}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: Registros de Personajes */}
          {activeTab === 'characters' && (
            <div className="flex flex-col space-y-4">
              {CHARACTER_PROFILES.map(char => (
                <div key={char.name} className="p-4 rounded-lg bg-[#090A0F] border border-[#252a3d]">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-display font-bold text-sm text-[#62B8E8]">
                      {char.name}
                    </h3>
                    <span className="font-manga text-base text-[#75F0D3]">{char.kanji}</span>
                  </div>
                  <div className="text-xs text-[#D34DAA] font-cyber mb-1">{char.role}</div>
                  <div className="text-xs text-[#777B89] mb-2">
                    <span className="text-[#F1EEE8] font-bold">Valores:</span> {char.values}
                  </div>
                  <p className="text-xs font-manga text-[#F1EEE8] leading-relaxed">
                    {char.conflict || char.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Resonancia del Alma */}
          {activeTab === 'stats' && (
            <div className="flex flex-col space-y-6">
              <div>
                <div className="flex justify-between text-xs font-cyber mb-1">
                  <span className="text-[#62B8E8] font-bold">Apego (Yūrei)</span>
                  <span className="text-[#62B8E8] tabular-nums font-bold">{storyState.attachment}%</span>
                </div>
                <div className="w-full h-3 bg-[#090A0F] rounded-full overflow-hidden border border-[#252a3d]">
                  <div
                    style={{ width: `${Math.min(100, storyState.attachment)}%` }}
                    className="h-full bg-gradient-to-r from-[#62B8E8] to-[#D34DAA] transition-all"
                  />
                </div>
                <p className="text-[11px] text-[#777B89] mt-1 font-manga">
                  Mide el deseo de preservar el amor inmutable más allá de los límites del tiempo.
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs font-cyber mb-1">
                  <span className="text-[#75F0D3] font-bold">Liberación (Yokoi)</span>
                  <span className="text-[#75F0D3] tabular-nums font-bold">{storyState.liberation}%</span>
                </div>
                <div className="w-full h-3 bg-[#090A0F] rounded-full overflow-hidden border border-[#252a3d]">
                  <div
                    style={{ width: `${Math.min(100, storyState.liberation)}%` }}
                    className="h-full bg-gradient-to-r from-[#75F0D3] to-[#62B8E8] transition-all"
                  />
                </div>
                <p className="text-[11px] text-[#777B89] mt-1 font-manga">
                  Mide la comprensión de que el amor no justifica la destrucción de la libertad del otro.
                </p>
              </div>

              <div className="p-3 bg-[#090A0F] rounded border border-[#252a3d] text-xs font-cyber">
                <span className="text-[#777B89]">Estabilidad del Ritual: </span>
                <span className="text-[#F1EEE8] font-bold">
                  {storyState.ritual_stability > 0
                    ? 'Completado (+1)'
                    : storyState.ritual_stability < 0
                    ? 'Desestabilizado (-1)'
                    : 'En suspenso (0)'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
