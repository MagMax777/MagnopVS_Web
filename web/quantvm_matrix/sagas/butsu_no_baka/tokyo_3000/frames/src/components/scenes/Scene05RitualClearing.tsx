import React, { useState } from 'react';
import { Forest3DView } from './Forest3DView';
import { CharacterPortrait } from '../manga/MangaArt';
import { soundEngine } from '../../services/audio';

interface Scene05Props {
  onComplete: () => void;
  onDiscoverClue: (clueId: string, name?: string) => void;
  onRelationshipShift: (type: 'ATTACHMENT' | 'LIBERATION', amount: number, reason: string) => void;
  foundClueIds: string[];
}

export const Scene05RitualClearing: React.FC<Scene05Props> = ({
  onComplete,
  onDiscoverClue,
  onRelationshipShift,
  foundClueIds,
}) => {
  const [viewMode, setViewMode] = useState<'2.5D' | '3D'>('2.5D');
  const [activeFragment, setActiveFragment] = useState<number>(0);
  const [exploredFragments, setExploredFragments] = useState<number[]>([]);
  const [yureiLocked, setYureiLocked] = useState(false);

  const fragments = [
    {
      id: 0,
      title: 'Mano que Lanza Símbolos',
      subtitle: 'Danza Nihonga Odori 3000',
      description: 'Una mano enguantada en seda blanca y filamentos de fibra óptica lanza símbolos kanji holográficos que estallan en chispas de luz.',
      icon: 'flare',
      color: '#62b8e8',
    },
    {
      id: 1,
      title: 'Giro Acrobático & Pole Dance',
      subtitle: 'Acrobacias Aéreas de Plasma',
      description: 'Sacerdotisas suspendidas en arneses de plasma giran en espiral sobre las barras de luz, combinando devoción ancestral y sensualidad cibernética.',
      icon: 'airline_stops',
      color: '#75f0d3',
    },
    {
      id: 2,
      title: 'Grito Teatral Kabuki',
      subtitle: 'Máscara Kumadori Cibernética',
      description: 'Una de las sacerdotisas adopta una pose dramática mie (見得) con una máscara de laca carmesí, emitiendo un grito teatral que retumba en todo el coliseo.',
      icon: 'theater_comedy',
      color: '#d34daa',
    },
    {
      id: 3,
      title: 'La Mirada de Yūrei',
      subtitle: 'Aura Misteriosa en el Centro del Altar',
      description: 'Entre las sacerdotisas, Yūrei brilla con un aura sobrenatural inigualable. Sus ojos se clavan fijamente en Yokoi a través de la multitud.',
      icon: 'visibility',
      color: '#c8102e',
    },
  ];

  const handleSelectFragment = (idx: number) => {
    soundEngine.playSfx('dialogue');
    setActiveFragment(idx);
    if (!exploredFragments.includes(idx)) {
      setExploredFragments(prev => [...prev, idx]);
    }
    if (idx === 3) {
      soundEngine.playSfx('discovery');
      setYureiLocked(true);
    }
  };

  const handleApproachStage = () => {
    soundEngine.playSfx('slash');
    onRelationshipShift(
      'LIBERATION',
      10,
      'Yokoi fijó la vista en Yūrei y avanzó decidido hacia el centro del altar (+10 Liberación)'
    );
    onComplete();
  };

  return (
    <div className="relative w-full min-h-[580px] bg-[#080809] border border-[#363638] overflow-hidden flex flex-col justify-between p-4 sm:p-6 manga-panel-clip select-none">
      {/* Header Bar */}
      <div className="relative z-10 flex flex-wrap justify-between items-center pb-3 border-b border-[#363638]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#d34daa] inline-block animate-ping"></span>
          <span className="text-xs font-label-sm uppercase tracking-widest text-[#d34daa] font-bold">
            ESCENA 5 // ESCENA DEL RITUAL – MATSURI RAVE – NOCHE
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* 2.5D / 3D Three.js Toggle */}
          <div className="flex bg-[#111114] border border-[#363638] p-0.5 text-xs font-cyber">
            <button
              onClick={() => {
                soundEngine.playSfx('click');
                setViewMode('2.5D');
              }}
              className={`px-3 py-1 font-bold transition-colors ${
                viewMode === '2.5D' ? 'bg-[#c8102e] text-white' : 'text-[#858585] hover:text-white'
              }`}
            >
              VISTA 2.5D MANGA
            </button>
            <button
              onClick={() => {
                soundEngine.playSfx('click');
                setViewMode('3D');
              }}
              className={`px-3 py-1 font-bold transition-colors ${
                viewMode === '3D' ? 'bg-[#62b8e8] text-black' : 'text-[#858585] hover:text-white'
              }`}
            >
              MODO 3D THREE.JS
            </button>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="relative z-10 my-4 flex-1 flex flex-col justify-center items-center">
        {viewMode === '3D' ? (
          <div className="w-full h-[420px] relative border border-[#363638] overflow-hidden">
            <Forest3DView
              onDiscoverClue={onDiscoverClue}
              foundClueIds={foundClueIds}
              onExit3D={() => setViewMode('2.5D')}
            />
          </div>
        ) : (
          /* 2.5D Manga Visual Stage of the Ritual */
          <div className="w-full max-w-4xl bg-[#111114]/90 border border-[#363638] p-5 shadow-2xl flex flex-col justify-between">
            <div className="flex flex-wrap justify-between items-center mb-3">
              <div>
                <h3 className="text-lg font-bold text-white font-headline-sm">
                  Espectáculo Híbrido: Ritual Ancestral y Futurismo
                </h3>
                <p className="text-xs text-[#9c9c9f]">
                  Geishas sacerdotisas ejecutan danza Nihonga Odori, teatro Kabuki, acrobacias y pole dance bajo luces estroboscópicas.
                </p>
              </div>
              <span className="text-[10px] font-cyber text-[#d34daa] px-2 py-0.5 bg-[#080809] border border-[#d34daa]/50">
                AURA DE YŪREI ACTIVA
              </span>
            </div>

            {/* Accelerated Cuts Selector (Manga Panels) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {fragments.map((frag, idx) => {
                const isSelected = activeFragment === idx;
                const isSeen = exploredFragments.includes(idx);
                return (
                  <button
                    key={frag.id}
                    onClick={() => handleSelectFragment(idx)}
                    className={`p-3 text-left border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#19191d] border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                        : 'bg-[#080809] border-[#363638] hover:border-[#5a5a5e]'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="material-symbols-outlined text-lg" style={{ color: frag.color }}>
                        {frag.icon}
                      </span>
                      <span className="text-[9px] font-cyber text-[#858585]">0{idx + 1}</span>
                    </div>
                    <div className="text-xs font-bold text-white truncate">{frag.title}</div>
                    <div className="text-[9px] text-[#858585] mt-0.5">
                      {isSeen ? '✓ Observado' : '[ Examinar ]'}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Fragment Cinematic Box */}
            <div className="p-4 bg-[#080809] border-2 border-[#363638] relative flex flex-col md:flex-row items-center gap-4">
              {activeFragment === 3 ? (
                <CharacterPortrait character="Yūrei" size="md" glow={true} />
              ) : (
                <div className="w-24 h-24 rounded-lg bg-[#151722] border border-[#363638] flex items-center justify-center shrink-0">
                  <span
                    className="material-symbols-outlined text-4xl"
                    style={{ color: fragments[activeFragment].color }}
                  >
                    {fragments[activeFragment].icon}
                  </span>
                </div>
              )}

              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs font-bold font-cyber tracking-wider uppercase"
                    style={{ color: fragments[activeFragment].color }}
                  >
                    {fragments[activeFragment].subtitle}
                  </span>
                  <span className="text-[10px] text-[#858585]">FRAGMENTO ACELERADO</span>
                </div>
                <h4 className="text-base font-bold text-white font-headline-sm mb-1.5">
                  {fragments[activeFragment].title}
                </h4>
                <p className="text-xs sm:text-sm text-[#e5e2e1] leading-relaxed">
                  {fragments[activeFragment].description}
                </p>
                {activeFragment === 3 && (
                  <div className="mt-2 text-xs font-bold text-[#c8102e] flex items-center gap-1.5 animate-pulse">
                    <span className="material-symbols-outlined text-sm">emergency</span>
                    <span>¡Yūrei ha hecho contacto visual con Yokoi! El ritual entra en su fase cumbre.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Approach Button */}
            {yureiLocked && (
              <div className="mt-4 pt-3 border-t border-[#363638] flex justify-end">
                <button
                  onClick={handleApproachStage}
                  className="px-6 py-2.5 bg-[#c8102e] hover:bg-[#e61937] text-white text-xs font-bold font-label-sm tracking-widest transition-all crimson-glow chamfer-edge active:scale-95 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">swords</span>
                  <span>CONFRONTAR A YŪREI EN EL ESCENARIO CENTRAL →</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="relative z-10 pt-3 border-t border-[#363638] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="text-[11px] font-label-sm text-[#858585]">
          OBSERVA LA MIRADA DE YŪREI PARA ACCEDER AL CLÍMAX
        </div>
        {yureiLocked && (
          <button
            onClick={onComplete}
            className="px-4 py-1.5 bg-[#c8102e] text-white font-bold font-label-sm tracking-wider text-xs hover:bg-[#e61937] transition-colors"
          >
            AVANZAR AL ENCUENTRO →
          </button>
        )}
      </div>
    </div>
  );
};
