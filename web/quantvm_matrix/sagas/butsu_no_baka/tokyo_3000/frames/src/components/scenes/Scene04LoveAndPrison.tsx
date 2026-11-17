import React, { useState } from 'react';
import { soundEngine } from '../../services/audio';

interface Scene04Props {
  onComplete: () => void;
  onDiscoverClue: (clueId: string, name?: string) => void;
  onRelationshipShift: (type: 'ATTACHMENT' | 'LIBERATION', amount: number, reason: string) => void;
}

export const Scene04LoveAndPrison: React.FC<Scene04Props> = ({
  onComplete,
  onDiscoverClue,
  onRelationshipShift,
}) => {
  const [glyphsActive, setGlyphsActive] = useState<number[]>([]);
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [zoomEyeActive, setZoomEyeActive] = useState(false);
  const [musicPumping, setMusicPumping] = useState(false);

  const glyphs = [
    { id: 1, kanji: '幽', name: 'YŪ (Espectro)', color: '#62b8e8' },
    { id: 2, kanji: '霊', name: 'REI (Alma)', color: '#75f0d3' },
    { id: 3, kanji: '絆', name: 'KIZUNA (Vínculo)', color: '#d34daa' },
    { id: 4, kanji: '滅', name: 'METSU (Exterminio)', color: '#c8102e' },
  ];

  const handleToggleGlyph = (id: number) => {
    soundEngine.playSfx('ritual');
    if (!glyphsActive.includes(id)) {
      const updated = [...glyphsActive, id];
      setGlyphsActive(updated);
      if (updated.length === 4) {
        soundEngine.playSfx('discovery');
        setGateUnlocked(true);
        onDiscoverClue('clue_rave_pass', 'Sello de Neón del Matsuri Rave');
      }
    }
  };

  const handleForceEntry = () => {
    soundEngine.playSfx('slash');
    setGateUnlocked(true);
    onRelationshipShift(
      'LIBERATION',
      10,
      'Yokoi forzó la entrada al Matsuri Rave quebrando los sellos de seguridad (+10 Liberación)'
    );
  };

  const handleEnterRave = () => {
    soundEngine.playSfx('heavy_hit');
    setMusicPumping(true);
    setZoomEyeActive(true);
    setTimeout(() => {
      onComplete();
    }, 2800);
  };

  return (
    <div className="relative w-full min-h-[580px] bg-[#080809] border border-[#363638] overflow-hidden flex flex-col justify-between p-4 sm:p-6 manga-panel-clip select-none">
      {/* Background Ambience: Giant Neon Torii Gate with Pulsing Bass */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
        {/* Massive Neon Torii Gate Vectors */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 700">
          <defs>
            <linearGradient id="neon-torii-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c8102e" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#d34daa" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          {/* Top Crossbeams */}
          <path d="M120 120 Q500 80 880 120 L860 160 Q500 125 140 160 Z" fill="url(#neon-torii-grad)" filter="drop-shadow(0 0 15px #c8102e)" />
          <rect x="180" y="180" width="640" height="30" fill="#090a0f" stroke="#c8102e" strokeWidth="2" />
          {/* Pillars */}
          <rect x="220" y="160" width="60" height="540" fill="#11131a" stroke="#d34daa" strokeWidth="2" />
          <rect x="720" y="160" width="60" height="540" fill="#11131a" stroke="#d34daa" strokeWidth="2" />
          {/* Energy Beams Shooting In Between */}
          <line x1="280" y1="350" x2="720" y2="350" stroke="#75f0d3" strokeWidth="2" strokeDasharray="6 6" opacity="0.7" />
          <line x1="280" y1="450" x2="720" y2="450" stroke="#62b8e8" strokeWidth="1.5" opacity="0.6" />
        </svg>

        {/* Ambient Rave Strobe Pulse */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${musicPumping ? 'bg-[#c8102e]/20 animate-pulse' : 'bg-transparent'}`}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex flex-wrap justify-between items-center pb-3 border-b border-[#363638]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#c8102e] inline-block animate-ping"></span>
          <span className="text-xs font-label-sm uppercase tracking-widest text-[#c8102e] font-bold">
            ESCENA 4 // ENTRADA AL MATSURI RAVE – NOCHE
          </span>
        </div>
        <div className="text-[11px] font-label-sm text-[#858585] flex items-center gap-2">
          <span>PUERTAS ENORMES DE NEÓN · SÍMBOLOS ANCESTRALES DIGITALES</span>
          <span className="px-2 py-0.5 bg-[#19191d] border border-[#363638] text-white">INFILTRACIÓN</span>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="relative z-10 my-4 flex-1 flex flex-col justify-center items-center">
        {!zoomEyeActive ? (
          <div className="w-full max-w-3xl bg-[#111114]/90 border border-[#363638] p-5 shadow-2xl flex flex-col items-center text-center">
            <span className="text-[10px] font-cyber text-[#c8102e] tracking-widest uppercase font-bold mb-1">
              // ACCESO PRINCIPAL AL MATSURI RAVE
            </span>
            <h3 className="text-xl sm:text-2xl font-headline-lg text-white font-bold tracking-tight mb-2">
              El Portal Torii del Samsara
            </h3>
            <p className="text-xs sm:text-sm text-[#9c9c9f] max-w-xl mx-auto leading-relaxed mb-5">
              Puertas colosales de titanio y neón vibran con graves estruendosos de música electrónica ceremonial. Cuatro glifos ancestrales codifican la entrada.
            </p>

            {/* 4 Digital Ancestral Kanji Glyphs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl mb-5">
              {glyphs.map(glyph => {
                const isActive = glyphsActive.includes(glyph.id);
                return (
                  <button
                    key={glyph.id}
                    onClick={() => handleToggleGlyph(glyph.id)}
                    className={`p-4 border transition-all flex flex-col items-center justify-center group ${
                      isActive
                        ? 'bg-[#151722] border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                        : 'bg-[#080809] border-[#363638] hover:border-white'
                    }`}
                  >
                    <span
                      className="text-3xl sm:text-4xl font-manga mb-1 transition-transform group-hover:scale-110"
                      style={{ color: isActive ? glyph.color : '#858585' }}
                    >
                      {glyph.kanji}
                    </span>
                    <span className="text-[10px] font-cyber tracking-wider text-white">
                      {glyph.name}
                    </span>
                    <span className="text-[9px] text-[#858585] mt-1">
                      {isActive ? '✓ SINCRONIZADO' : '[ TOCAR ]'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Door Status & Actions */}
            <div className="w-full max-w-xl pt-3 border-t border-[#363638] flex flex-wrap justify-between items-center gap-3">
              <div className="text-left text-xs text-[#858585]">
                ESTADO DEL PORTAL:{' '}
                <span className={gateUnlocked ? 'text-[#75f0d3] font-bold' : 'text-[#c8102e] font-bold'}>
                  {gateUnlocked ? 'DESBLOQUEADO' : `BLOQUEADO (${glyphsActive.length}/4 GLIFOS)`}
                </span>
              </div>

              {!gateUnlocked ? (
                <button
                  onClick={handleForceEntry}
                  className="px-3 py-1.5 bg-[#19191d] border border-[#5a5a5e] hover:border-[#c8102e] text-xs font-label-sm text-white transition-colors"
                >
                  Forzar con Katana Sónica
                </button>
              ) : (
                <button
                  onClick={handleEnterRave}
                  className="px-6 py-2.5 bg-[#c8102e] hover:bg-[#e61937] text-white text-xs font-bold font-label-sm tracking-widest transition-all crimson-glow chamfer-edge active:scale-95 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">login</span>
                  <span>CRUZAR EL PORTAL AL RAVE</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Zoom Eye Cinematic Animation */
          <div className="w-full max-w-2xl text-center py-6 flex flex-col items-center animate-in zoom-in duration-700">
            {/* Manga Eye Graphic reflecting Neons */}
            <div className="relative w-72 h-36 border-2 border-white/80 bg-[#090a0f] overflow-hidden rounded-full shadow-[0_0_30px_#c8102e] flex items-center justify-center">
              {/* Pupil with neon reflections */}
              <div className="w-24 h-24 rounded-full bg-[#111114] border-4 border-[#c8102e] flex items-center justify-center overflow-hidden">
                <div className="w-10 h-10 rounded-full bg-white shadow-[0_0_15px_#ffffff] animate-ping"></div>
                {/* Reflected neon lines */}
                <div className="absolute inset-0 bg-[linear-gradient(45deg,#d34daa_25%,transparent_25%,transparent_50%,#75f0d3_50%,#75f0d3_75%,transparent_75%)] opacity-35 bg-[size:10px_10px]"></div>
              </div>
            </div>

            <h3 className="text-2xl font-headline-xl text-white font-bold tracking-widest mt-5 mb-2">
              ENTRANDO AL MATSURI RAVE
            </h3>
            <p className="text-sm font-body-md text-[#e5e2e1] max-w-md mx-auto leading-relaxed">
              Yokoi cruza las puertas enormes. La música sube estruendosamente de volumen. La cámara se acerca a sus ojos, que reflejan las luces y el movimiento frenético del ritual...
            </p>
            <div className="mt-3 text-xs font-cyber text-[#75f0d3] animate-pulse">
              // SINCRONIZANDO AUDIO: CYBER-MATSURI TAIKO 142 BPM
            </div>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="relative z-10 pt-3 border-t border-[#363638] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="text-[11px] font-label-sm text-[#858585]">
          PASAJE AL INTERIOR DEL SANTUARIO ELECTRÓNICO
        </div>
        {gateUnlocked && !zoomEyeActive && (
          <button
            onClick={handleEnterRave}
            className="px-5 py-2 bg-[#c8102e] text-white font-bold font-label-sm tracking-wider text-xs hover:bg-[#e61937] transition-colors"
          >
            ENTRAR AL RAVE →
          </button>
        )}
      </div>
    </div>
  );
};
