import React, { useState, useEffect } from 'react';
import { CharacterPortrait } from '../manga/MangaArt';
import { StoryState } from '../../types/game';
import { soundEngine } from '../../services/audio';

interface Scene08Props {
  storyState: StoryState;
  onRestartLoop: () => void;
  onDiscoverClue: (clueId: string, name?: string) => void;
  onUnlockCard: (cardId: string) => void;
}

export const Scene08FirstLoop: React.FC<Scene08Props> = ({
  storyState,
  onRestartLoop,
  onDiscoverClue,
  onUnlockCard,
}) => {
  const { attachment, liberation } = storyState;
  const [stage, setStage] = useState<'distortion' | 'revelation' | 'ending'>('distortion');

  // Determine which ending is triggered
  let endingType: 'ATTACHMENT' | 'LIBERATION' | 'FRACTURE' = 'FRACTURE';
  if (attachment > liberation + 5) {
    endingType = 'ATTACHMENT';
  } else if (liberation > attachment + 5) {
    endingType = 'LIBERATION';
  }

  useEffect(() => {
    onDiscoverClue('clue_ouroboros_seal', 'Amuleto del Bucle Cronocuántico');
    onUnlockCard('card_bucle');
    onUnlockCard('card_beso_daga');
  }, [onDiscoverClue, onUnlockCard]);

  const endingsData = {
    ATTACHMENT: {
      title: 'FINAL I: EL VÍNCULO PERPETUO',
      subtitle: 'La Eternidad en el Culto Vampírico (Alto Apego)',
      color: '#62b8e8',
      quote: '«Si este amor está prohibido... reinemos juntos en la oscuridad del Samsara.»',
      narrative:
        'Yokoi no pudo cortar el hilo rojo del destino. Arrodillado ante Yūrei en el coliseo del Matsuri Rave, acepta beber el Soma-3000. Sus memorias se funden y juntos ascienden al trono de Butsu no Baka, condenados a revivir el beso y la muerte por los próximos mil años.',
    },
    LIBERATION: {
      title: 'FINAL II: LA ESPADA DE LA LIBERACIÓN',
      subtitle: 'Ruptura del Samsara y Paz Espiritual (Alta Liberación)',
      color: '#75f0d3',
      quote: '«Un amor que encadena no es honor; la verdadera compasión es dejarte libre.»',
      narrative:
        'Con una estocada certera, Yokoi destruye el Sello Cronocuántico de Yūrei. El vórtice temporal se desintegra en una lluvia de cerezos de luz. Las víctimas del culto despiertan de su letargo, y el alma de Yūrei sonríe con serenidad antes de ascender al descanso final.',
    },
    FRACTURE: {
      title: 'FINAL III: LA FRACTURA DEL SAMSARA',
      subtitle: 'Equilibrio Kármico & Paradoja Cuántica (Tensión en Resonancia)',
      color: '#d34daa',
      quote: '«El tiempo se ha roto... y en esa grieta hallaremos nuestro propio camino.»',
      narrative:
        'La perfecta tensión entre el amor ardiente y el deseo de libertad colapsa la máquina cronocuántica de Tokyo 3000. El bosque de la era Edo y los rascacielos cibernéticos se fusionan en una nueva realidad alternativa, preparando el escenario para la Temporada 2.',
    },
  };

  const currentEnding = endingsData[endingType];

  return (
    <div className="relative w-full min-h-[600px] bg-[#080809] border border-[#363638] overflow-hidden flex flex-col justify-between p-4 sm:p-6 manga-panel-clip select-none">
      {/* Background: Quantum Time Vortex and Distortion Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-45">
        <div className="absolute inset-0 bg-radial from-[#d34daa]/20 via-[#090a0f] to-[#080809]"></div>
        {/* Hyperspace Time Tunnel Lines */}
        <div className="absolute inset-0 bg-[repeating-radial-gradient(circle_at_center,_transparent_0,_transparent_30px,_#c8102e_31px,_transparent_32px)] opacity-30 animate-spin"></div>
        {/* Floating Digital Clocks Running in Reverse */}
        <div className="absolute top-10 left-10 text-[10px] font-cyber text-[#62b8e8] opacity-70">
          // REWIND: 2999 → 2500 → 1800 → 1603 (EDO)
        </div>
        <div className="absolute top-10 right-10 text-[10px] font-cyber text-[#75f0d3] opacity-70">
          CHRONO_FLUX: ANOMALÍA DETECTADA
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex flex-wrap justify-between items-center pb-3 border-b border-[#363638]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#d34daa] inline-block animate-ping"></span>
          <span className="text-xs font-label-sm uppercase tracking-widest text-[#d34daa] font-bold">
            ESCENA 8 // MANIPULACIÓN DEL TIEMPO – BUCLE TEMPORAL
          </span>
        </div>
        <div className="text-[11px] font-label-sm text-[#858585] flex items-center gap-2">
          <span>DISTORSIÓN CRONOCUÁNTICA · RESOLUCIÓN KÁRMICA</span>
          <span className="px-2 py-0.5 bg-[#19191d] border border-[#363638] text-white">EPÍLOGO</span>
        </div>
      </div>

      {/* Stage Flow */}
      <div className="relative z-10 my-4 flex-1 flex flex-col justify-center items-center">
        {stage === 'distortion' && (
          <div className="w-full max-w-2xl bg-[#111114]/90 border border-[#363638] p-6 shadow-2xl text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-2 border-[#d34daa] flex items-center justify-center bg-[#151722] text-[#d34daa] mb-3 animate-spin">
              <span className="material-symbols-outlined text-4xl">hourglass_empty</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-headline-xl text-white font-bold tracking-tight mb-2">
              El Tiempo se Distorsiona...
            </h3>
            <p className="text-sm font-body-md text-[#9c9c9f] max-w-md mx-auto leading-relaxed mb-6">
              Los relojes de Tokyo 3000 giran en reversa vertiginosa. Las luces del Matsuri Rave se estiran en filamentos cuánticos mientras la niebla del bosque de Edo reaparece a tus pies.
            </p>
            <button
              onClick={() => {
                soundEngine.playSfx('dialogue');
                setStage('revelation');
              }}
              className="px-6 py-2.5 bg-[#d34daa] hover:bg-[#e61937] text-white text-xs font-bold font-label-sm tracking-widest transition-all shadow-lg chamfer-edge active:scale-95"
            >
              ESCUCHAR LA REVELACIÓN DE YŪREI →
            </button>
          </div>
        )}

        {stage === 'revelation' && (
          <div className="w-full max-w-3xl bg-[#111114]/90 border border-[#363638] p-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center gap-5 mb-5">
              <CharacterPortrait character="Yūrei" size="lg" glow={true} />
              <div className="flex-1 text-left">
                <span className="text-[10px] font-cyber text-[#c8102e] tracking-widest uppercase block mb-1">
                  // LA VERDAD DEL SAMSARA
                </span>
                <h4 className="text-lg font-bold text-white font-headline-sm mb-2">
                  «Te lo prometí bajo la luna de Edo, Yokoi.»
                </h4>
                <p className="text-xs sm:text-sm text-[#e5e2e1] leading-relaxed mb-2 font-mono">
                  «Nuestro seppuku no fue el final, sino el inicio del algoritmo. Cada vez que me atraviesas con la daga, el bucle se reinicia para que volvamos a encontrarnos. Jamás te dejaré ir.»
                </p>
                <div className="text-[11px] text-[#75f0d3] font-cyber">
                  RECUENTO FINAL · APEGO: {attachment} | LIBERACIÓN: {liberation}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#363638] flex justify-end">
              <button
                onClick={() => {
                  soundEngine.playSfx('victory');
                  setStage('ending');
                }}
                className="px-6 py-2.5 bg-[#c8102e] hover:bg-[#e61937] text-white text-xs font-bold font-label-sm tracking-widest transition-all crimson-glow chamfer-edge active:scale-95"
              >
                DESCUBRIR EL DESENLACE DEL BUCLE →
              </button>
            </div>
          </div>
        )}

        {stage === 'ending' && (
          <div
            className="w-full max-w-3xl bg-[#111114] border-2 p-6 shadow-2xl flex flex-col items-center text-center animate-in zoom-in duration-500"
            style={{ borderColor: currentEnding.color }}
          >
            <span
              className="text-xs font-cyber tracking-widest uppercase font-bold px-3 py-1 mb-2"
              style={{ backgroundColor: `${currentEnding.color}20`, color: currentEnding.color }}
            >
              {currentEnding.subtitle}
            </span>

            <h3 className="text-2xl sm:text-4xl font-headline-xl text-white font-bold tracking-tight mb-3">
              {currentEnding.title}
            </h3>

            <p className="text-xs sm:text-sm font-manga text-[#e5e2e1] italic mb-4 max-w-lg">
              {currentEnding.quote}
            </p>

            <div className="p-4 bg-[#080809] border border-[#363638] text-xs sm:text-sm text-[#9c9c9f] leading-relaxed mb-6 text-left font-mono">
              {currentEnding.narrative}
            </div>

            {/* Ending Summary Stats */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-md p-3 bg-[#19191d] border border-[#363638] mb-6 text-xs">
              <div>
                <span className="text-[#858585] block text-[10px] font-cyber">APEGO ACUMULADO</span>
                <span className="text-base font-bold text-[#62b8e8]">{attachment} pts</span>
              </div>
              <div>
                <span className="text-[#858585] block text-[10px] font-cyber">LIBERACIÓN ACUMULADA</span>
                <span className="text-base font-bold text-[#75f0d3]">{liberation} pts</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={onRestartLoop}
                className="px-6 py-2.5 bg-[#c8102e] hover:bg-[#e61937] text-white text-xs font-bold font-label-sm tracking-widest transition-all crimson-glow chamfer-edge active:scale-95 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">replay</span>
                <span>REINICIAR BUCLE TEMPORAL (NUEVA ITERACIÓN)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="relative z-10 pt-3 border-t border-[#363638] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="text-[11px] font-label-sm text-[#858585]">
          FIN DEL CAPÍTULO 1 DE LA TEMPORADA 1: EL BUCLE DE YŪREI
        </div>
      </div>
    </div>
  );
};
