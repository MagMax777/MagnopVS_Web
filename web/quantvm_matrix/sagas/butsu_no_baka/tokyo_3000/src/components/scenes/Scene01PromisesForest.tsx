import React, { useState } from 'react';
import { CharacterPortrait } from '../manga/MangaArt';
import { soundEngine } from '../../services/audio';

interface Scene01Props {
  onComplete: () => void;
  onDiscoverClue: (clueId: string, name?: string) => void;
  onRelationshipShift: (type: 'ATTACHMENT' | 'LIBERATION', amount: number, reason: string) => void;
}

export const Scene01PromisesForest: React.FC<Scene01Props> = ({
  onComplete,
  onDiscoverClue,
  onRelationshipShift,
}) => {
  const [step, setStep] = useState<number>(0);
  const [daggerDrawn, setDaggerDrawn] = useState(false);
  const [seppukuCommitted, setSeppukuCommitted] = useState(false);
  const [pledgeChoice, setPledgeChoice] = useState<'attachment' | 'liberation' | null>(null);

  const dialogue = [
    {
      speaker: 'Narrador',
      text: 'Un bosque oscuro y silencioso bajo la luz de la luna. La niebla flota entre los árboles milenarios de la era Edo.',
      subtext: 'El viento nocturno apenas agita los pinos. El silencio previo a la tragedia envuelve a los dos amantes.',
    },
    {
      speaker: 'Narrador',
      text: 'Yokoi y Yūrei, vestidos con ropajes tradicionales, se miran con intensidad. En sus rostros, una mezcla desgarradora de amor y desesperación.',
      subtext: 'Perseguidos por sus propios clanes, no existe rincón en el Japón feudal donde su vínculo pueda florecer.',
    },
    {
      speaker: 'Yokoi',
      text: '«Si este amor está prohibido, que la muerte sea nuestro pacto.»',
      subtext: 'Su voz es firme, pero velada por una tristeza infinita mientras desenvaina la daga.',
    },
    {
      speaker: 'Yūrei',
      text: '«Te buscaré en todas las vidas. No importa cuánto tiempo pase.»',
      subtext: 'Con lágrimas brotando de sus ojos, tomando la empuñadura de la hoja afilada.',
    },
  ];

  const handlePledgeChoice = (type: 'attachment' | 'liberation') => {
    setPledgeChoice(type);
    if (type === 'attachment') {
      soundEngine.playSfx('dialogue');
      onRelationshipShift(
        'ATTACHMENT',
        10,
        'Yokoi juró buscar el alma de Yūrei sin importar los sacrificios (+10 Apego)'
      );
    } else {
      soundEngine.playSfx('dialogue');
      onRelationshipShift(
        'LIBERATION',
        10,
        'Yokoi aceptó la muerte con serenidad marcial, afirmando la dignidad de su espíritu (+10 Liberación)'
      );
    }
  };

  const handleExecuteSeppuku = () => {
    soundEngine.playSfx('slash');
    setSeppukuCommitted(true);
    onDiscoverClue('clue_dagger_edo', 'Daga Ceremonial de Seppuku');
    setTimeout(() => {
      soundEngine.playSfx('heavy_hit');
    }, 400);
    setTimeout(() => {
      onComplete();
    }, 2800);
  };

  return (
    <div className="relative w-full min-h-[560px] bg-[#080809] border border-[#363638] overflow-hidden flex flex-col justify-between p-4 sm:p-6 manga-panel-clip select-none">
      {/* Background Ambience: Edo Moonlit Forest with Mist */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Full Moon */}
        <div className="absolute top-6 right-8 sm:right-16 w-32 h-32 rounded-full bg-gradient-to-b from-[#f1eee8] to-[#9c9c9f] shadow-[0_0_60px_rgba(241,238,232,0.35)] opacity-85 flex items-center justify-center">
          <div className="w-28 h-28 rounded-full border border-black/20 opacity-30 bg-[#080809]/10"></div>
        </div>

        {/* Mist and Silhouette Trees */}
        <svg className="absolute inset-0 w-full h-full opacity-40" preserveAspectRatio="none" viewBox="0 0 800 600">
          <path d="M0 600 L0 380 Q200 420 400 370 Q600 320 800 390 L800 600 Z" fill="#111114" />
          <path d="M0 600 L0 440 Q250 470 500 430 Q700 400 800 450 L800 600 Z" fill="#19191d" />
          {/* Edo Pine Trees */}
          <path d="M90 600 L110 320 L95 280 L125 240 L110 180 L140 230 L160 330 L180 600 Z" fill="#0c0d12" />
          <path d="M680 600 L660 300 L685 250 L650 200 L690 150 L710 240 L700 340 L730 600 Z" fill="#0c0d12" />
        </svg>

        {/* Floating Mist Lines */}
        <div className="absolute bottom-12 left-0 w-full h-24 bg-gradient-to-t from-[#080809] via-transparent to-transparent"></div>
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#f1eee8]/20 to-transparent blur-sm animate-pulse"></div>
      </div>

      {/* Header Bar */}
      <div className="relative z-10 flex flex-wrap justify-between items-center pb-3 border-b border-[#363638]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#c8102e] inline-block animate-ping"></span>
          <span className="text-xs font-label-sm uppercase tracking-widest text-[#c8102e] font-bold">
            ESCENA 1 // BOSQUE, ERA EDO – NOCHE
          </span>
        </div>
        <div className="text-[11px] font-label-sm text-[#858585] flex items-center gap-2">
          <span>ROPAJES TRADICIONALES · PACTO DE AMOR</span>
          <span className="px-2 py-0.5 bg-[#19191d] border border-[#363638] text-white">2D MANGA NOIR</span>
        </div>
      </div>

      {/* Center Cinematic Stage: Lovers Facing Each Other */}
      <div className="relative z-10 my-4 flex-1 flex flex-col justify-center items-center">
        {!seppukuCommitted ? (
          <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Yokoi Panel */}
            <div
              className={`p-4 bg-[#111114]/90 border transition-all duration-300 relative ${
                step >= 2 ? 'border-white shadow-[0_0_20px_rgba(255,255,255,0.15)]' : 'border-[#363638]'
              }`}
            >
              <div className="absolute -top-3 left-3 bg-[#080809] px-2 py-0.5 text-[10px] font-label-sm text-white font-bold border border-[#363638]">
                YOKOI · SAMURÁI RŌNIN
              </div>
              <div className="flex items-center gap-4">
                <CharacterPortrait character="Yokoi" size="md" glow={step >= 2} />
                <div className="flex-1">
                  <div className="text-xs text-[#858585] font-label-sm mb-1">ROPAJE TRADICIONAL EDO</div>
                  <div className="text-sm font-bold text-white font-headline-sm">
                    «Si este amor está prohibido, que la muerte sea nuestro pacto.»
                  </div>
                  <div className="text-[11px] text-[#9c9c9f] mt-1 italic">
                    Voz firme, templada en acero, pero quebrada por la desesperación.
                  </div>
                </div>
              </div>
            </div>

            {/* Yūrei Panel */}
            <div
              className={`p-4 bg-[#111114]/90 border transition-all duration-300 relative ${
                step >= 3 ? 'border-[#c8102e] crimson-glow' : 'border-[#363638]'
              }`}
            >
              <div className="absolute -top-3 left-3 bg-[#080809] px-2 py-0.5 text-[10px] font-label-sm text-[#c8102e] font-bold border border-[#c8102e]">
                YŪREI · DAMA NOBLE
              </div>
              <div className="flex items-center gap-4">
                <CharacterPortrait character="Yūrei" size="md" glow={step >= 3} />
                <div className="flex-1">
                  <div className="text-xs text-[#858585] font-label-sm mb-1">KIMONO BLANCO DE LUTO</div>
                  <div className="text-sm font-bold text-[#f1eee8] font-headline-sm">
                    «Te buscaré en todas las vidas. No importa cuánto tiempo pase.»
                  </div>
                  <div className="text-[11px] text-[#c8102e] mt-1 italic">
                    Lágrimas en sus mejillas, tomando con resolución la daga ceremonial.
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Seppuku Simultaneous Execution Anime Cut */
          <div className="w-full max-w-2xl text-center py-10 animate-pulse flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-4 border-[#c8102e] flex items-center justify-center bg-[#c8102e]/20 mb-4 crimson-glow">
              <span className="material-symbols-outlined text-[#c8102e] text-4xl">swords</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-headline-xl text-white font-bold tracking-widest mb-2">
              SEPPUKU SIMULTÁNEO
            </h2>
            <p className="text-sm font-body-md text-[#9c9c9f] max-w-md mx-auto leading-relaxed">
              La cámara se acerca a sus rostros mientras cierran los ojos al unísono. La sangre sella el juramento eterno y el continuo espacio-temporal se fractura...
            </p>
            <div className="mt-4 text-xs font-label-sm text-[#c8102e] tracking-widest uppercase">
              // TELETRANSPORTE AL AÑO 3000 EN PROGRESO...
            </div>
          </div>
        )}

        {/* Narrative Voice Sub-box */}
        {!seppukuCommitted && (
          <div className="w-full max-w-3xl mt-4 bg-[#111114]/95 border border-[#363638] p-4 relative">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-[#c8102e] uppercase font-label-sm tracking-wider">
                {dialogue[Math.min(step, dialogue.length - 1)].speaker}
              </span>
              <span className="text-[10px] text-[#858585] font-label-sm">
                PARTE {Math.min(step + 1, 4)} DE 4
              </span>
            </div>
            <p className="text-sm sm:text-base text-white font-body-md leading-relaxed">
              {dialogue[Math.min(step, dialogue.length - 1)].text}
            </p>
            <p className="text-xs text-[#858585] mt-1 italic">
              {dialogue[Math.min(step, dialogue.length - 1)].subtext}
            </p>
          </div>
        )}

        {/* Interactive Vow Decision at Step 2 or 3 */}
        {step >= 2 && !seppukuCommitted && !pledgeChoice && (
          <div className="w-full max-w-3xl mt-3 p-3 bg-[#19191d] border border-[#c8102e] flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
            <div className="text-xs text-white">
              <span className="font-bold text-[#c8102e]">Juramento de Sangre:</span> ¿Cuál es la resonancia interna de Yokoi?
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePledgeChoice('attachment')}
                className="px-3 py-1.5 bg-[#111114] border border-[#c8102e] hover:bg-[#c8102e] text-white text-xs font-label-sm transition-all"
              >
                Prometer Devoción Eterna (+10 Apego)
              </button>
              <button
                onClick={() => handlePledgeChoice('liberation')}
                className="px-3 py-1.5 bg-[#111114] border border-white hover:bg-white hover:text-black text-white text-xs font-label-sm transition-all"
              >
                Aceptar la Muerte con Entereza (+10 Liberación)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="relative z-10 pt-3 border-t border-[#363638] flex flex-wrap items-center justify-between gap-3">
        <div className="text-[11px] font-label-sm text-[#858585]">
          RELACIÓN: APEGO & LIBERACIÓN SE INICIALIZAN EN 0
        </div>
        <div className="flex items-center gap-3">
          {step < dialogue.length - 1 ? (
            <button
              onClick={() => {
                soundEngine.playSfx('dialogue');
                setStep(prev => prev + 1);
              }}
              className="px-5 py-2 bg-[#19191d] hover:bg-[#2c2c2f] border border-[#5a5a5e] hover:border-white text-white text-xs font-label-sm font-bold tracking-wider transition-colors"
            >
              CONTINUAR DIÁLOGO →
            </button>
          ) : !seppukuCommitted ? (
            <button
              onClick={handleExecuteSeppuku}
              className="px-6 py-2.5 bg-[#c8102e] hover:bg-[#e61937] text-white text-xs font-label-sm font-bold tracking-widest transition-all crimson-glow flex items-center gap-2 chamfer-edge active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">colorize</span>
              <span>EJECUTAR SEPPUKU SIMULTÁNEO</span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
