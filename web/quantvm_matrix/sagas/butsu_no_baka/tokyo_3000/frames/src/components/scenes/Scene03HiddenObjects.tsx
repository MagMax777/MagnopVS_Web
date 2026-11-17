import React, { useState } from 'react';
import { soundEngine } from '../../services/audio';

interface Scene03Props {
  onComplete: () => void;
  onDiscoverClue: (clueId: string, name?: string) => void;
  onRelationshipShift: (type: 'ATTACHMENT' | 'LIBERATION', amount: number, reason: string) => void;
}

export const Scene03HiddenObjects: React.FC<Scene03Props> = ({
  onComplete,
  onDiscoverClue,
  onRelationshipShift,
}) => {
  const [radarActive, setRadarActive] = useState(false);
  const [scannedHotspots, setScannedHotspots] = useState<string[]>([]);
  const [activeLore, setActiveLore] = useState<string | null>(
    'Explora las calles saturadas de neón de Tokyo 3000 para rastrear las señales del Matsuri Rave.'
  );
  const [moralChoiceMade, setMoralChoiceMade] = useState(false);

  const triggerRadar = () => {
    soundEngine.playSfx('sonar');
    setRadarActive(true);
    setTimeout(() => setRadarActive(false), 2600);
  };

  const handleInspect = (id: string, name: string, lore: string, isClue?: boolean) => {
    soundEngine.playSfx('discovery');
    if (!scannedHotspots.includes(id)) {
      setScannedHotspots(prev => [...prev, id]);
    }
    setActiveLore(lore);
    if (isClue && id === 'soma') {
      onDiscoverClue('clue_soma_vampire', 'Vial de Droga Vampírica «Soma-3000»');
    }
  };

  const handleMoralChoice = (type: 'attachment' | 'liberation') => {
    soundEngine.playSfx('dialogue');
    setMoralChoiceMade(true);
    if (type === 'attachment') {
      onRelationshipShift(
        'ATTACHMENT',
        10,
        'Yokoi sintió compasión por Yūrei, comprendiendo que el dolor de milenios la empujó a la locura vampírica (+10 Apego)'
      );
    } else {
      onRelationshipShift(
        'LIBERATION',
        10,
        'Yokoi juró no ceder ante la nostalgia: la esclavitud del culto Butsu no Baka debe terminar (+10 Liberación)'
      );
    }
  };

  const isReadyToAdvance = scannedHotspots.length >= 2;

  return (
    <div className="relative w-full min-h-[580px] bg-[#080809] border border-[#363638] overflow-hidden flex flex-col justify-between p-4 sm:p-6 manga-panel-clip select-none">
      {/* Cyberpunk City Skyline with Neon Billboards & Rain */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-45">
        {/* City Buildings Silhouette */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 600">
          <defs>
            <linearGradient id="neon-purple" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#d34daa" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#7957c8" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {/* Skyscrapers */}
          <rect x="20" y="80" width="120" height="520" fill="#0f1118" />
          <rect x="160" y="140" width="160" height="460" fill="#131520" />
          <rect x="340" y="60" width="220" height="540" fill="#0a0c12" />
          <rect x="580" y="110" width="150" height="490" fill="#11131c" />
          <rect x="750" y="70" width="230" height="530" fill="#0c0e16" />
          {/* Neon Wire Accents */}
          <line x1="0" y1="350" x2="1000" y2="390" stroke="#d34daa" strokeWidth="1" strokeDasharray="4 8" opacity="0.6" />
          <line x1="0" y1="420" x2="1000" y2="440" stroke="#62b8e8" strokeWidth="1" opacity="0.4" />
        </svg>

        {/* Floating Hologram Ads */}
        <div className="absolute top-10 left-12 p-3 border border-[#d34daa]/60 bg-[#151722]/80 text-[10px] font-cyber text-[#d34daa] shadow-[0_0_15px_#d34daa] animate-pulse">
          【BUTSU NO BAKA】<br />
          SOMA-3000 // EXTASIS ETERNO
        </div>
        <div className="absolute top-16 right-16 p-3 border border-[#75f0d3]/60 bg-[#151722]/80 text-[10px] font-cyber text-[#75f0d3] shadow-[0_0_15px_#75f0d3]">
          祭 RAVE NOCTURNO<br />
          ZONA PROHIBIDA · SHINJUKU 09
        </div>

        {/* Digital Rain Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_90%,#62b8e8_100%)] bg-[size:100%_20px] opacity-20"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex flex-wrap justify-between items-center pb-3 border-b border-[#363638]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#d34daa] inline-block animate-ping"></span>
          <span className="text-xs font-label-sm uppercase tracking-widest text-[#d34daa] font-bold">
            ESCENA 3 // CALLES DE TOKYO 3000 – NOCHE
          </span>
        </div>
        <div className="text-[11px] font-label-sm text-[#858585] flex items-center gap-2">
          <span>NEÓN · HOLOGRAMAS · MULTITUD EXTRAÑA</span>
          <span className="px-2 py-0.5 bg-[#19191d] border border-[#363638] text-white">2.5D EXPLORACIÓN</span>
        </div>
      </div>

      {/* Main Playable City Field */}
      <div className="relative z-10 my-4 flex-1 flex flex-col justify-center items-center">
        {/* Radar Scanner Overlay */}
        {radarActive && (
          <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-center items-center">
            <div className="w-80 h-80 rounded-full border-2 border-[#75f0d3] animate-ping opacity-35"></div>
            <div className="text-xs font-cyber text-[#75f0d3] bg-black/90 px-3 py-1 border border-[#75f0d3] mt-2 shadow-lg">
              // ESCANEO RADAR: DETECTANDO RASTROS BIO-VAMPÍRICOS Y TAJOS DE ENERGÍA
            </div>
          </div>
        )}

        <div className="w-full max-w-4xl bg-[#111114]/90 border border-[#363638] p-5 shadow-2xl relative min-h-[340px] flex flex-col justify-between">
          <div className="flex flex-wrap justify-between items-center mb-4">
            <div>
              <h3 className="text-base font-bold text-white font-headline-sm">
                Camino al Matsuri Rave Clandestino
              </h3>
              <p className="text-xs text-[#9c9c9f] mt-0.5">
                Yokoi avanza entre la multitud cibernética absorbiendo el ambiente caótico de Tokyo 3000.
              </p>
            </div>
            <button
              onClick={triggerRadar}
              disabled={radarActive}
              className={`px-3 py-1.5 text-xs font-bold font-cyber border transition-all flex items-center gap-1.5 ${
                radarActive
                  ? 'bg-[#75f0d3] text-black border-[#75f0d3]'
                  : 'bg-[#19191d] text-[#75f0d3] border-[#75f0d3]/50 hover:border-[#75f0d3]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">radar</span>
              <span>{radarActive ? 'ESCANEANDO...' : 'ACTIVAR RADAR'}</span>
            </button>
          </div>

          {/* Interactive Urban Investigation Hotspots */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-2">
            {/* Hotspot 1: Droga Soma-3000 */}
            <button
              onClick={() =>
                handleInspect(
                  'soma',
                  'Vial de Soma-3000',
                  'Un vial descartado de «Soma-3000». La droga vampírica brilla con bioluminiscencia roja. Contiene bio-plasma humano extraído de las víctimas del culto en Shinjuku.',
                  true
                )
              }
              className={`p-3.5 bg-[#080809] border text-left transition-all group flex flex-col justify-between ${
                scannedHotspots.includes('soma')
                  ? 'border-[#c8102e] shadow-[0_0_10px_rgba(200,16,46,0.3)]'
                  : 'border-[#363638] hover:border-[#c8102e]'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="material-symbols-outlined text-[#c8102e] text-xl group-hover:scale-110 transition-transform">
                  vaccines
                </span>
                <span className="text-[10px] text-[#858585] font-cyber">CALLEJÓN OSCURO</span>
              </div>
              <div className="text-xs font-bold text-white group-hover:text-[#c8102e]">
                Vial de Soma-3000
              </div>
              <div className="text-[10px] text-[#858585] mt-1">
                {scannedHotspots.includes('soma') ? '✓ Pista recolectada' : 'Examinar sustancia'}
              </div>
            </button>

            {/* Hotspot 2: Holograma Rave */}
            <button
              onClick={() =>
                handleInspect(
                  'holo_rave',
                  'Holograma Matsuri',
                  'Un cartel holográfico proyecta: «Esta noche en el Matsuri Rave: El Despertar de la Sacerdotisa Yūrei. Seppuku y renacimiento bajo la luna digital». Los símbolos ancestrales coinciden con los de Edo.'
                )
              }
              className={`p-3.5 bg-[#080809] border text-left transition-all group flex flex-col justify-between ${
                scannedHotspots.includes('holo_rave')
                  ? 'border-[#d34daa] shadow-[0_0_10px_rgba(211,77,170,0.3)]'
                  : 'border-[#363638] hover:border-[#d34daa]'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="material-symbols-outlined text-[#d34daa] text-xl group-hover:scale-110 transition-transform">
                  party_mode
                </span>
                <span className="text-[10px] text-[#858585] font-cyber">CARTEL HOLO</span>
              </div>
              <div className="text-xs font-bold text-white group-hover:text-[#d34daa]">
                Anuncio del Matsuri
              </div>
              <div className="text-[10px] text-[#858585] mt-1">
                {scannedHotspots.includes('holo_rave') ? '✓ Datos decodificados' : 'Inspeccionar transmisión'}
              </div>
            </button>

            {/* Hotspot 3: Dealer Androide */}
            <button
              onClick={() =>
                handleInspect(
                  'dealer',
                  'Dealer Androide',
                  'Un ciborg con ojos modificados te susurra: «¿Buscas la entrada al Matsuri, rōnin? Las sacerdotisas no toleran extraños a menos que poseas la frecuencia del pacto». Te entrega las coordenadas del Torii de Neón.'
                )
              }
              className={`p-3.5 bg-[#080809] border text-left transition-all group flex flex-col justify-between ${
                scannedHotspots.includes('dealer')
                  ? 'border-[#62b8e8] shadow-[0_0_10px_rgba(98,184,232,0.3)]'
                  : 'border-[#363638] hover:border-[#62b8e8]'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="material-symbols-outlined text-[#62b8e8] text-xl group-hover:scale-110 transition-transform">
                  smart_toy
                </span>
                <span className="text-[10px] text-[#858585] font-cyber">CONTACTO CALLEJERO</span>
              </div>
              <div className="text-xs font-bold text-white group-hover:text-[#62b8e8]">
                Dealer Androide
              </div>
              <div className="text-[10px] text-[#858585] mt-1">
                {scannedHotspots.includes('dealer') ? '✓ Frecuencia obtenida' : 'Interrogar figura'}
              </div>
            </button>

            {/* Hotspot 4: Víctima Drenada */}
            <button
              onClick={() =>
                handleInspect(
                  'victim',
                  'Víctima del Culto',
                  'Un ciudadano inconsciente apoyado contra los conductos de refrigeración. Dos marcas de quemadura láser en su cuello muestran la extracción de sangre sintética por las sacerdotisas de Butsu no Baka.'
                )
              }
              className={`p-3.5 bg-[#080809] border text-left transition-all group flex flex-col justify-between ${
                scannedHotspots.includes('victim')
                  ? 'border-[#75f0d3] shadow-[0_0_10px_rgba(117,240,211,0.3)]'
                  : 'border-[#363638] hover:border-[#75f0d3]'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="material-symbols-outlined text-[#75f0d3] text-xl group-hover:scale-110 transition-transform">
                  vital_signs
                </span>
                <span className="text-[10px] text-[#858585] font-cyber">VÍCTIMA DRENADA</span>
              </div>
              <div className="text-xs font-bold text-white group-hover:text-[#75f0d3]">
                Evidencia de Tráfico
              </div>
              <div className="text-[10px] text-[#858585] mt-1">
                {scannedHotspots.includes('victim') ? '✓ Evidencia registrada' : 'Examinar víctima'}
              </div>
            </button>
          </div>

          {/* Active Lore Display Box */}
          <div className="p-3 bg-[#080809] border border-[#363638] mt-3">
            <div className="text-[10px] font-cyber text-[#858585] uppercase mb-1">
              // REGISTRO SENSORIAL DE YOKOI
            </div>
            <p className="text-xs text-white leading-relaxed font-mono">
              {activeLore}
            </p>
          </div>

          {/* Moral Reflection Dilemma in the Streets */}
          {isReadyToAdvance && !moralChoiceMade && (
            <div className="mt-4 p-3 bg-[#19191d] border border-[#d34daa] flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
              <div className="text-xs text-white">
                <span className="font-bold text-[#d34daa]">Dilema de Tokio 3000:</span> Al presenciar la decadencia y el poder del culto de Yūrei...
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleMoralChoice('attachment')}
                  className="px-3 py-1.5 bg-[#111114] border border-[#d34daa] hover:bg-[#d34daa] hover:text-white text-[#d34daa] text-xs font-cyber transition-all"
                >
                  Compadecer su Dolor (+10 Apego)
                </button>
                <button
                  onClick={() => handleMoralChoice('liberation')}
                  className="px-3 py-1.5 bg-[#111114] border border-[#75f0d3] hover:bg-[#75f0d3] hover:text-black text-[#75f0d3] text-xs font-cyber transition-all"
                >
                  Destruir la Tiranía (+10 Liberación)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="relative z-10 pt-3 border-t border-[#363638] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="text-[11px] font-label-sm text-[#858585]">
          PISTAS RECOLECTADAS EN SHINJUKU: {scannedHotspots.length} / 4
        </div>
        {isReadyToAdvance && (
          <button
            onClick={() => {
              soundEngine.playSfx('dialogue');
              onComplete();
            }}
            className="px-5 py-2 bg-[#d34daa] hover:bg-[#e61937] text-white font-bold font-label-sm tracking-wider text-xs transition-colors shadow-lg chamfer-edge"
          >
            AVANZAR A LA ENTRADA DEL MATSURI RAVE →
          </button>
        )}
      </div>
    </div>
  );
};
