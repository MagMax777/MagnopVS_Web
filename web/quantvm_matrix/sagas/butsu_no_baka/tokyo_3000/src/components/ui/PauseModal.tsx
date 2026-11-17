import React, { useState } from 'react';
import { GameSettings, SceneId } from '../../types/game';
import { soundEngine } from '../../services/audio';

interface PauseModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onResume: () => void;
  onOpenJournal: () => void;
  onOpenCards: () => void;
  onReturnToTitle: () => void;
  onJumpToScene: (sceneId: SceneId) => void;
  onResetSave: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  settings,
  onUpdateSettings,
  onResume,
  onOpenJournal,
  onOpenCards,
  onReturnToTitle,
  onJumpToScene,
  onResetSave,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showChapterSelect, setShowChapterSelect] = useState(false);

  const chapters: { id: SceneId; title: string; mode: string }[] = [
    { id: 'SCENE_01', title: '01. Bosque, Era Edo – Noche (El Pacto de Seppuku)', mode: '2D Manga Cinematográfico' },
    { id: 'SCENE_02', title: '02. Laboratorio de Clonación – Tokyo 3000 – Día', mode: 'Sci-Fi Biogenómica' },
    { id: 'SCENE_03', title: '03. Calles de Tokyo 3000 – Noche', mode: 'Exploración Urbana & Radar' },
    { id: 'SCENE_04', title: '04. Entrada al Matsuri Rave – Noche', mode: 'Infiltración & Pulso Rave' },
    { id: 'SCENE_05', title: '05. Escena del Ritual – Matsuri Rave', mode: 'Espectáculo 2.5D & 3D' },
    { id: 'SCENE_06', title: '06. Encuentro Yokoi y Yūrei (El Beso y la Daga)', mode: 'Clímax Trágico' },
    { id: 'SCENE_07', title: '07. Ritual de Resurrección & Combate Táctico', mode: 'Combate AAA' },
    { id: 'SCENE_08', title: '08. Manipulación del Tiempo (El Bucle Temporal)', mode: 'Distorsión & 3 Finales' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#090A0F]/90 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-lg bg-[#151722] border-2 border-[#62B8E8]/60 rounded-xl shadow-2xl p-6 flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#252a3d] mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl">⏸</span>
            <h2 className="text-lg font-display text-[#F1EEE8]">
              MENÚ DE PAUSA Y AJUSTES
            </h2>
          </div>
          <button
            onClick={() => {
              soundEngine.playSfx('click');
              onResume();
            }}
            className="text-[#777B89] hover:text-[#62B8E8] font-bold text-lg p-1"
          >
            ✕
          </button>
        </div>

        {/* Main Action Buttons */}
        <div className="flex flex-col space-y-2 mb-6">
          <button
            onClick={() => {
              soundEngine.playSfx('click');
              onResume();
            }}
            className="w-full py-3 bg-[#62B8E8] hover:bg-[#75F0D3] text-[#090A0F] font-cyber font-extrabold text-sm rounded-lg shadow-md transition-all"
          >
            Reanudar Partida ▶
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                soundEngine.playSfx('click');
                onOpenJournal();
              }}
              className="py-2.5 px-3 bg-[#090A0F] hover:bg-[#1f2438] border border-[#75F0D3]/40 text-[#75F0D3] font-cyber text-xs rounded-lg transition-colors flex items-center justify-center space-x-1"
            >
              <span>📜 Abrir Diario</span>
            </button>
            <button
              onClick={() => {
                soundEngine.playSfx('click');
                onOpenCards();
              }}
              className="py-2.5 px-3 bg-[#090A0F] hover:bg-[#1f2438] border border-[#D34DAA]/40 text-[#D34DAA] font-cyber text-xs rounded-lg transition-colors flex items-center justify-center space-x-1"
            >
              <span>🎴 Ver Cartas</span>
            </button>
          </div>

          <button
            onClick={() => {
              soundEngine.playSfx('click');
              setShowChapterSelect(!showChapterSelect);
            }}
            className="w-full py-2 bg-[#090A0F] hover:bg-[#1f2438] border border-[#62B8E8]/40 text-[#62B8E8] font-cyber text-xs rounded-lg transition-colors"
          >
            {showChapterSelect ? '▲ Ocultar Selección de Escenas' : '▼ Salto de Escenas (Rejugabilidad)'}
          </button>
        </div>

        {/* Chapter Selection Accordion */}
        {showChapterSelect && (
          <div className="mb-6 p-3 bg-[#090A0F] rounded-lg border border-[#252a3d] flex flex-col space-y-1.5 max-h-48 overflow-y-auto">
            {chapters.map(ch => (
              <button
                key={ch.id}
                onClick={() => {
                  soundEngine.playSfx('click');
                  onJumpToScene(ch.id);
                  onResume();
                }}
                className="w-full py-2 px-3 rounded bg-[#151722] hover:bg-[#62B8E8] hover:text-[#090A0F] text-left text-xs font-cyber flex items-center justify-between transition-colors"
              >
                <span>{ch.title}</span>
                <span className="text-[10px] text-[#777B89]">{ch.mode}</span>
              </button>
            ))}
          </div>
        )}

        {/* Settings Controls */}
        <div className="border-t border-[#252a3d] pt-4 mb-6 flex flex-col space-y-4">
          <h3 className="text-xs font-cyber text-[#75F0D3] font-bold tracking-wider uppercase">
            Configuración y Accesibilidad
          </h3>

          {/* Sound Mute Toggle */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#F1EEE8]">Sonido ambiental y efectos</span>
            <button
              onClick={() => {
                const next = !settings.soundEnabled;
                soundEngine.setMute(!next);
                onUpdateSettings({ ...settings, soundEnabled: next });
              }}
              className={`px-3 py-1 rounded text-xs font-cyber font-bold ${
                settings.soundEnabled
                  ? 'bg-[#75F0D3] text-[#090A0F]'
                  : 'bg-[#090A0F] text-[#777B89] border border-[#252a3d]'
              }`}
            >
              {settings.soundEnabled ? 'ACTIVADO' : 'MUTED'}
            </button>
          </div>

          {/* Sound Volume Slider */}
          {settings.soundEnabled && (
            <div className="flex flex-col space-y-1">
              <div className="flex justify-between text-xs text-[#777B89]">
                <span>Volumen: {Math.round(settings.soundVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.soundVolume}
                onChange={e => {
                  const val = parseFloat(e.target.value);
                  soundEngine.setVolume(val);
                  onUpdateSettings({ ...settings, soundVolume: val });
                }}
                className="w-full accent-[#62B8E8] cursor-pointer"
              />
            </div>
          )}

          {/* Text Size */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#F1EEE8]">Tamaño de texto de lectura</span>
            <div className="flex space-x-1">
              <button
                onClick={() => onUpdateSettings({ ...settings, textSize: 'normal' })}
                className={`px-2.5 py-1 rounded font-cyber text-xs ${
                  settings.textSize === 'normal'
                    ? 'bg-[#62B8E8] text-[#090A0F] font-bold'
                    : 'bg-[#090A0F] text-[#777B89]'
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => onUpdateSettings({ ...settings, textSize: 'large' })}
                className={`px-2.5 py-1 rounded font-cyber text-xs ${
                  settings.textSize === 'large'
                    ? 'bg-[#62B8E8] text-[#090A0F] font-bold'
                    : 'bg-[#090A0F] text-[#777B89]'
                }`}
              >
                Grande
              </button>
            </div>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#F1EEE8]">Reducir animaciones intensas</span>
            <button
              onClick={() =>
                onUpdateSettings({ ...settings, reducedMotion: !settings.reducedMotion })
              }
              className={`px-3 py-1 rounded text-xs font-cyber font-bold ${
                settings.reducedMotion
                  ? 'bg-[#75F0D3] text-[#090A0F]'
                  : 'bg-[#090A0F] text-[#777B89] border border-[#252a3d]'
              }`}
            >
              {settings.reducedMotion ? 'SÍ' : 'NO'}
            </button>
          </div>
        </div>

        {/* Footer & Danger Zone */}
        <div className="border-t border-[#252a3d] pt-4 flex flex-col space-y-2">
          <button
            onClick={() => {
              soundEngine.playSfx('click');
              onReturnToTitle();
            }}
            className="w-full py-2.5 bg-[#090A0F] hover:bg-[#1f2438] text-[#F1EEE8] border border-[#252a3d] rounded-lg text-xs font-cyber transition-colors"
          >
            Guardar y Volver a la Portada ⌂
          </button>

          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full py-1 text-[11px] text-[#777B89] hover:text-[#e11d48] transition-colors"
            >
              Borrar partida guardada...
            </button>
          ) : (
            <div className="p-3 bg-[#e11d48]/10 border border-[#e11d48] rounded-lg flex flex-col space-y-2">
              <span className="text-xs text-[#e11d48] font-bold text-center">
                ¿Confirmas que deseas reiniciar todo el progreso del episodio?
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    soundEngine.playSfx('click');
                    onResetSave();
                    setShowResetConfirm(false);
                    onReturnToTitle();
                  }}
                  className="py-1.5 bg-[#e11d48] text-white font-bold rounded text-xs"
                >
                  Sí, reiniciar
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="py-1.5 bg-[#151722] text-[#F1EEE8] border border-[#252a3d] rounded text-xs"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
