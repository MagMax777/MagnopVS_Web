import React, { useState } from 'react';
import { CharacterPortrait } from '../manga/MangaArt';
import { soundEngine } from '../../services/audio';
import { DuelEngine } from '../rpg/DuelEngine';

interface Scene06Props {
  onComplete: () => void;
  onDiscoverClue: (clueId: string, name?: string) => void;
  onRelationshipShift: (type: 'ATTACHMENT' | 'LIBERATION', amount: number, reason: string) => void;
  attachmentScore: number;
  liberationScore: number;
}

export const Scene06RitualCircle: React.FC<Scene06Props> = ({
  onComplete,
  onDiscoverClue,
  onRelationshipShift,
  attachmentScore,
  liberationScore,
}) => {
  const [phase, setPhase] = useState<'confrontation' | 'kiss_and_dagger' | 'cult_ambush'>('confrontation');
  const [kissExecuted, setKissExecuted] = useState(false);

  const handleConfrontChoice = (type: 'attachment' | 'liberation') => {
    soundEngine.playSfx('dialogue');
    if (type === 'attachment') {
      onRelationshipShift(
        'ATTACHMENT',
        15,
        'Yokoi dudó al ver la mirada indefensa de Yūrei, dejando que el amor milenario temblara en su mano (+15 Apego)'
      );
    } else {
      onRelationshipShift(
        'LIBERATION',
        15,
        'Yokoi reafirmó con firmeza que el fin del culto es innegociable (+15 Liberación)'
      );
    }
    setPhase('kiss_and_dagger');
  };

  const handleExecuteKissAndDagger = () => {
    soundEngine.playSfx('slash');
    setKissExecuted(true);
    setTimeout(() => {
      soundEngine.playSfx('heavy_hit');
    }, 600);
    setTimeout(() => {
      soundEngine.playSfx('heavy_hit');
      setPhase('cult_ambush');
    }, 2400);
  };

  const handleEnterCombat = () => {
    soundEngine.playSfx('slash');
    onComplete();
  };

  return (
    <div className="relative w-full min-h-[580px] bg-[#080809] border border-[#363638] overflow-hidden flex flex-col justify-between p-4 sm:p-6 manga-panel-clip select-none">
      {/* Background: Dimly Lit Central Ritual Zone, Heavy Ambient Mist */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute inset-0 bg-radial from-[#c8102e]/25 via-[#090a0f] to-[#080809]"></div>
        {/* Arcane Altar Circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-[#c8102e]/40 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-[#d34daa]/30"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex flex-wrap justify-between items-center pb-3 border-b border-[#363638]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#c8102e] inline-block animate-ping"></span>
          <span className="text-xs font-label-sm uppercase tracking-widest text-[#c8102e] font-bold">
            ESCENA 6 // ENCUENTRO ENTRE YOKOI Y YŪREI – MATSURI RAVE
          </span>
        </div>
        <div className="text-[11px] font-label-sm text-[#858585] flex items-center gap-2">
          <span>ZONA CENTRAL DEL RITUAL · LUCES BAJAS · AMBIENTE CARGADO</span>
          <span className="px-2 py-0.5 bg-[#19191d] border border-[#363638] text-white">CLÍMAX MANGA</span>
        </div>
      </div>

      {/* Stage Flow */}
      <div className="relative z-10 my-4 flex-1 flex flex-col justify-center items-center">
        {phase === 'confrontation' && (
          <div className="w-full max-w-3xl bg-[#111114]/90 border border-[#363638] p-5 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center mb-5">
              {/* Yokoi Confrontation Panel */}
              <div className="p-4 bg-[#080809] border border-white flex items-center gap-4">
                <CharacterPortrait character="Yokoi" size="md" glow={true} />
                <div>
                  <span className="text-[10px] font-label-sm text-white font-bold block mb-1">
                    YOKOI (CON DETERMINACIÓN)
                  </span>
                  <div className="text-base sm:text-lg font-bold text-white font-headline-sm">
                    «Tu reinado termina hoy.»
                  </div>
                  <div className="text-[11px] text-[#9c9c9f] mt-1 italic">
                    Acercándose con paso firme en la penumbra del santuario.
                  </div>
                </div>
              </div>

              {/* Yūrei Soft Reply Panel */}
              <div className="p-4 bg-[#080809] border border-[#c8102e] flex items-center gap-4 crimson-glow">
                <CharacterPortrait character="Yūrei" size="md" glow={true} />
                <div>
                  <span className="text-[10px] font-label-sm text-[#c8102e] font-bold block mb-1">
                    YŪREI (SUSURRANDO, SONRISA TRISTE)
                  </span>
                  <div className="text-base sm:text-lg font-bold text-[#f1eee8] font-headline-sm">
                    «Aún te amo, Yokoi.»
                  </div>
                  <div className="text-[11px] text-[#c8102e] mt-1 italic">
                    Sin hostilidad en sus ojos, aceptando el destino con entrega.
                  </div>
                </div>
              </div>
            </div>

            {/* Dilemma Choice Options depending on Relationship State */}
            <div className="p-4 bg-[#19191d] border border-[#363638]">
              <span className="text-[10px] font-cyber text-[#75f0d3] uppercase tracking-wider block mb-2 font-bold">
                // RESONANCIA ESPIRITUAL (APEGO: {attachmentScore} | LIBERACIÓN: {liberationScore})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => handleConfrontChoice('attachment')}
                  className="p-3 bg-[#111114] border border-[#c8102e] hover:bg-[#c8102e]/20 text-left transition-all text-xs"
                >
                  <span className="font-bold text-[#c8102e] block mb-1">
                    1. Susurrar el dolor del pacto (+15 Apego)
                  </span>
                  <p className="text-[#e5e2e1] text-[11px] leading-relaxed">
                    «Y yo a ti... pero este culto destruye vidas. Que este beso sea nuestro único perdón.»
                  </p>
                </button>

                <button
                  onClick={() => handleConfrontChoice('liberation')}
                  className="p-3 bg-[#111114] border border-white hover:bg-white/10 text-left transition-all text-xs"
                >
                  <span className="font-bold text-white block mb-1">
                    2. Sentenciar con entereza marcial (+15 Liberación)
                  </span>
                  <p className="text-[#e5e2e1] text-[11px] leading-relaxed">
                    «No seré rehén de la nostalgia. El ciclo de seppuku y clonaciones debe romperse aquí.»
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}

        {phase === 'kiss_and_dagger' && (
          <div className="w-full max-w-2xl bg-[#111114] border-2 border-[#c8102e] p-6 shadow-2xl text-center flex flex-col items-center">
            {!kissExecuted ? (
              <>
                <div className="w-20 h-20 rounded-full border-2 border-[#c8102e] flex items-center justify-center bg-[#151722] text-[#c8102e] mb-3 animate-pulse">
                  <span className="material-symbols-outlined text-4xl">favorite</span>
                </div>
                <h3 className="text-xl sm:text-3xl font-headline-xl text-white font-bold tracking-tight mb-2">
                  El Beso y la Daga
                </h3>
                <p className="text-sm font-body-md text-[#9c9c9f] max-w-md mx-auto leading-relaxed mb-6">
                  Yokoi atrae a Yūrei hacia sus brazos. Sus labios se encuentran en la penumbra. Con la otra mano, sostiene la daga tradicional oculta en la manga.
                </p>
                <button
                  onClick={handleExecuteKissAndDagger}
                  className="px-8 py-3 bg-[#c8102e] hover:bg-[#e61937] text-white text-xs font-bold font-label-sm tracking-widest transition-all crimson-glow chamfer-edge active:scale-95 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">colorize</span>
                  <span>ATRAVESAR CON LA DAGA MIENTRAS LA BESA</span>
                </button>
              </>
            ) : (
              <div className="py-4 animate-in fade-in duration-500">
                <div className="text-4xl text-[#c8102e] mb-3 animate-bounce">⚔</div>
                <h3 className="text-2xl sm:text-3xl font-headline-xl text-white font-bold tracking-wider mb-2">
                  «AÚN TE AMO... YOKOI»
                </h3>
                <p className="text-sm text-[#e5e2e1] max-w-lg mx-auto leading-relaxed">
                  Mientras la besa, la atraviesa con la daga ceremonial. Yūrei no se defiende; cierra los ojos y se deja morir con una sonrisa de esperanza en sus labios.
                </p>
                <div className="mt-4 text-xs font-cyber text-[#c8102e] animate-ping">
                  // ALERTA DE SEGURIDAD DEL CULTO: INVASOR DETECTADO
                </div>
              </div>
            )}
          </div>
        )}

        {phase === 'cult_ambush' && (
          <div className="w-full max-w-3xl animate-in zoom-in duration-300">
            <DuelEngine
              attachment={attachmentScore}
              liberation={liberationScore}
              onVictory={onComplete}
              onRelationshipShift={onRelationshipShift}
            />
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="relative z-10 pt-3 border-t border-[#363638] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="text-[11px] font-label-sm text-[#858585]">
          GUIÓN: YOKOI ATRAVIESA A YŪREI MIENTRAS LA BESA; GUARDIAS ATACAN
        </div>
      </div>
    </div>
  );
};
