import React, { useState } from 'react';
import { soundEngine } from '../../services/audio';

interface Scene02Props {
  onComplete: () => void;
  onDiscoverClue: (clueId: string, name?: string) => void;
  onRelationshipShift: (type: 'ATTACHMENT' | 'LIBERATION', amount: number, reason: string) => void;
}

export const Scene02BridgeManga: React.FC<Scene02Props> = ({
  onComplete,
  onDiscoverClue,
  onRelationshipShift,
}) => {
  const [podStage, setPodStage] = useState<'sleeping' | 'awakened' | 'briefing' | 'depressurized'>('sleeping');
  const [steamCleared, setSteamCleared] = useState(false);
  const [dnaAnalyzed, setDnaAnalyzed] = useState(false);
  const [missionAccepted, setMissionAccepted] = useState(false);

  const handleWakeUp = () => {
    soundEngine.playSfx('sonar');
    setPodStage('awakened');
  };

  const handleClearSteam = () => {
    soundEngine.playSfx('discovery');
    setSteamCleared(true);
  };

  const handleInspectBioConsole = () => {
    soundEngine.playSfx('discovery');
    setDnaAnalyzed(true);
    onDiscoverClue('clue_clone_dossier', 'Dossier de Bioclonación #09');
  };

  const handleDialogueDecision = (choice: 'duty' | 'memory') => {
    soundEngine.playSfx('dialogue');
    setMissionAccepted(true);
    if (choice === 'duty') {
      onRelationshipShift(
        'LIBERATION',
        10,
        'Yokoi priorizó el deber de proteger a los inocentes y aniquilar al culto vampírico (+10 Liberación)'
      );
    } else {
      onRelationshipShift(
        'ATTACHMENT',
        10,
        'Yokoi admitió que la memoria de Yūrei es lo único que mantiene su mente intacta (+10 Apego)'
      );
    }
    setPodStage('briefing');
  };

  const handleExitPod = () => {
    soundEngine.playSfx('slash');
    setPodStage('depressurized');
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  return (
    <div className="relative w-full min-h-[560px] bg-[#080809] border border-[#363638] overflow-hidden flex flex-col justify-between p-4 sm:p-6 manga-panel-clip select-none">
      {/* Sci-Fi Lab Background with Cold Neon & Pulsing Machines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#62b8e8]/20 via-[#090a0f] to-[#080809]"></div>
        {/* Pulse Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#363638_1px,transparent_1px),linear-gradient(to_bottom,#363638_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        {/* Cold Blue Accent Lamps */}
        <div className="absolute top-4 left-1/4 w-48 h-2 bg-[#62b8e8] shadow-[0_0_20px_#62b8e8] opacity-80 animate-pulse"></div>
        <div className="absolute top-4 right-1/4 w-48 h-2 bg-[#75f0d3] shadow-[0_0_20px_#75f0d3] opacity-80 animate-pulse"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex flex-wrap justify-between items-center pb-3 border-b border-[#363638]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#62b8e8] inline-block animate-ping"></span>
          <span className="text-xs font-label-sm uppercase tracking-widest text-[#62b8e8] font-bold">
            ESCENA 2 // LABORATORIO DE CLONACIÓN – TOKYO 3000 – DÍA
          </span>
        </div>
        <div className="text-[11px] font-label-sm text-[#858585] flex items-center gap-2">
          <span>INSTALACIÓN SUBTERRÁNEA SHINJUKU · PROYECTO RŌNIN</span>
          <span className="px-2 py-0.5 bg-[#19191d] border border-[#363638] text-[#62b8e8]">CYBER-GENÓMICA</span>
        </div>
      </div>

      {/* Main Interactive Stage: Cloning Pod Viewport & Bio-Terminal */}
      <div className="relative z-10 my-4 flex-1 flex flex-col justify-center items-center">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Cloning Capsule Viewport (7 Cols) */}
          <div className="lg:col-span-7 bg-[#111114] border-2 border-[#363638] relative p-5 flex flex-col justify-between overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-label-sm text-[#858585] tracking-widest">
                CÁPSULA CRIOGÉNICA #09 · ESTADO: {podStage === 'sleeping' ? 'ESTASIS' : 'DESPIERTO'}
              </span>
              <span className="text-[10px] font-label-sm text-[#75f0d3] border border-[#75f0d3]/40 px-2 py-0.5">
                BIO-FLUIDO: AMNIÓTICO SINTÉTICO
              </span>
            </div>

            {/* Pod Glass Window Simulation */}
            <div className="relative w-full h-64 sm:h-72 bg-[#090b10] border border-[#363638] rounded flex flex-col items-center justify-center overflow-hidden">
              {/* Cold liquid bubbles & scanline */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#62b8e8]/10 via-transparent to-[#111114]/90 pointer-events-none"></div>

              {podStage === 'sleeping' ? (
                <div className="text-center z-10 p-4">
                  <div className="w-16 h-16 mx-auto mb-3 border border-[#62b8e8] rounded-full flex items-center justify-center bg-[#151722] text-[#62b8e8] animate-pulse">
                    <span className="material-symbols-outlined text-3xl">power</span>
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 font-headline-sm">
                    Sincronización Neural Detectada
                  </h4>
                  <p className="text-xs text-[#9c9c9f] mb-4 max-w-xs mx-auto">
                    La conciencia de Yokoi emerge de 1000 años de letargo genético. Pulsa para reactivar funciones vitales.
                  </p>
                  <button
                    onClick={handleWakeUp}
                    className="px-5 py-2 bg-[#62b8e8] hover:bg-[#75f0d3] text-black text-xs font-bold font-label-sm tracking-wider transition-colors shadow-lg"
                  >
                    DESPERTAR EN LA CÁPSULA
                  </button>
                </div>
              ) : (
                <div className="relative z-10 w-full h-full flex flex-col justify-between p-4">
                  {/* Glass Reflection & Scientist Silhouette */}
                  <div className="flex justify-between items-start">
                    <div className="bg-[#151722]/80 border border-[#363638] p-2 text-[10px] font-label-sm text-[#62b8e8]">
                      PULSO NEURONAL: 78 BPM<br />
                      OXIGENACIÓN: 99.4%
                    </div>
                    {/* Steam Condensation Overlay */}
                    {!steamCleared && (
                      <button
                        onClick={handleClearSteam}
                        className="bg-[#c8102e]/80 hover:bg-[#c8102e] border border-[#c8102e] text-white text-[11px] font-bold px-3 py-1 animate-pulse"
                      >
                        [ Limpiar vaho del cristal ]
                      </button>
                    )}
                  </div>

                  {/* Reflection in the Glass */}
                  <div className="text-center my-auto">
                    {steamCleared ? (
                      <div className="animate-in fade-in duration-500">
                        <div className="w-20 h-20 mx-auto rounded-full border-2 border-white/60 bg-[#151722] flex items-center justify-center text-white mb-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                          <span className="material-symbols-outlined text-4xl">swords</span>
                        </div>
                        <span className="text-xs font-bold text-white tracking-widest block font-headline-sm">
                          REFLEJO EN EL CRISTAL: YOKOI
                        </span>
                        <span className="text-[11px] text-[#9c9c9f] italic">
                          Ojos confundidos por el milenio transcurrido, pero con la determinación intacta.
                        </span>
                      </div>
                    ) : (
                      <div className="text-xs text-[#858585] italic">
                        El cristal está empañado por el bio-fluido criogénico. Limpia el vaho para enfocar la mirada exterior.
                      </div>
                    )}
                  </div>

                  <div className="text-[10px] text-[#858585] flex justify-between border-t border-[#363638]/60 pt-1">
                    <span>CÓDIGO DE RECUPERACIÓN: EDO-7729-CLONE</span>
                    <span className="text-[#75f0d3]">ESTABLE</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chief Scientist Dialogue Box */}
            <div className="mt-4 p-4 bg-[#19191d] border border-[#363638]">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 bg-[#75f0d3] inline-block"></span>
                <span className="text-xs font-bold text-[#75f0d3] tracking-wider uppercase font-label-sm">
                  CIENTÍFICO EN JEFE
                </span>
                <span className="text-[10px] text-[#858585]">(Acercándose al cristal de la cápsula)</span>
              </div>
              <p className="text-sm text-white font-body-md leading-relaxed font-bold">
                «Yokoi, fuiste elegido para detener a Butsu no Baka, un culto vampírico que trafica con drogas y personas. Tu objetivo es destruirlos.»
              </p>

              {podStage === 'awakened' && !missionAccepted && (
                <div className="mt-3 pt-3 border-t border-[#363638] flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleDialogueDecision('duty')}
                    className="flex-1 p-2 bg-[#111114] border border-[#75f0d3] hover:bg-[#75f0d3]/20 text-white text-xs font-label-sm text-left transition-colors"
                  >
                    <span className="font-bold text-[#75f0d3] block mb-0.5">1. Asumir la Misión</span>
                    «Entendido. Si ese culto devora a inocentes, mi katana responderá. (+10 Liberación)»
                  </button>
                  <button
                    onClick={() => handleDialogueDecision('memory')}
                    className="flex-1 p-2 bg-[#111114] border border-[#c8102e] hover:bg-[#c8102e]/20 text-white text-xs font-label-sm text-left transition-colors"
                  >
                    <span className="font-bold text-[#c8102e] block mb-0.5">2. Preguntar por Yūrei</span>
                    «¿Yūrei...? Antes de morir en Edo le hice una promesa. ¿Sigue viva en este 3000? (+10 Apego)»
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bio-Genomic Science Console (5 Cols) */}
          <div className="lg:col-span-5 bg-[#111114] border border-[#363638] p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[#363638] mb-3">
                <h4 className="text-xs font-bold text-white uppercase font-headline-sm tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#62b8e8] text-base">science</span>
                  DIAGNÓSTICO BIOGENÓMICO
                </h4>
                <span className="text-[10px] text-[#858585]">SCIENCE_CORE_V3</span>
              </div>

              <div className="space-y-3 text-xs">
                {/* DNA Sequence Analysis */}
                <div className="p-2.5 bg-[#080809] border border-[#363638]">
                  <div className="flex justify-between text-[#858585] text-[10px] mb-1">
                    <span>SECUENCIA GENÉTICA CLONADA</span>
                    <span className="text-[#75f0d3] font-bold">100% HOMOLOGÍA</span>
                  </div>
                  <div className="font-mono text-[11px] text-[#62b8e8] tracking-wider truncate">
                    ATG-CGA-TTA-GCT-TAC-CGG-AAT-TTA-GCC
                  </div>
                  <div className="text-[10px] text-[#9c9c9f] mt-1">
                    Reconstrucción cromosómica a partir de médula fosilizada del samurái Yokoi.
                  </div>
                </div>

                {/* Butsu no Baka Threat Report */}
                <div className="p-2.5 bg-[#080809] border border-[#c8102e]/40">
                  <div className="text-[10px] text-[#c8102e] font-bold uppercase mb-1">
                    AMENAZA: CULTO BUTSU NO BAKA
                  </div>
                  <p className="text-[11px] text-[#e5e2e1] leading-relaxed">
                    Organización vampírica de alta tecnología. Trafican con la droga sintética <span className="text-[#c8102e] font-bold">«Soma-3000»</span> y drenan bio-plasma humano en el clandestino <span className="text-white font-bold">Matsuri Rave</span>.
                  </p>
                </div>

                {/* Katana Equipment Readiness */}
                <div className="p-2.5 bg-[#080809] border border-[#363638]">
                  <div className="flex justify-between text-[10px] text-[#858585] mb-1">
                    <span>ARMAMENTO RECONSTRUIDO</span>
                    <span className="text-white font-bold">KATANA SÓNICA CALIBRADA</span>
                  </div>
                  <div className="text-[11px] text-[#f1eee8]">
                    Filo de aleación criogénica adaptado con frecuencias electromagnéticas anti-vampiro.
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons in Console */}
            <div className="mt-4 pt-3 border-t border-[#363638] space-y-2">
              {!dnaAnalyzed ? (
                <button
                  onClick={handleInspectBioConsole}
                  className="w-full py-2 bg-[#19191d] hover:bg-[#2c2c2f] border border-[#62b8e8] text-[#62b8e8] text-xs font-bold font-label-sm tracking-wider transition-all flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">folder_open</span>
                  DESCARGAR DOSSIER CLÓNICO #09
                </button>
              ) : (
                <div className="text-center text-[10px] text-[#75f0d3] font-bold py-1">
                  ✓ Dossier guardado en tu bitácora de evidencias
                </div>
              )}

              {missionAccepted && podStage !== 'depressurized' && (
                <button
                  onClick={handleExitPod}
                  className="w-full py-2.5 bg-[#c8102e] hover:bg-[#e61937] text-white text-xs font-bold font-label-sm tracking-widest transition-all crimson-glow chamfer-edge active:scale-95 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">logout</span>
                  DESPRESURIZAR CÁPSULA Y SALIR
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="relative z-10 pt-3 border-t border-[#363638] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="text-[11px] font-label-sm text-[#858585]">
          OBJETIVO: INFILTRARTE EN EL MATSURI RAVE Y DETENER AL CULTO
        </div>
        {podStage === 'depressurized' && (
          <button
            onClick={onComplete}
            className="px-5 py-2 bg-[#62b8e8] text-black font-bold font-label-sm tracking-wider text-xs hover:bg-[#75f0d3] transition-colors"
          >
            AVANZAR A LAS CALLES DE TOKYO 3000 →
          </button>
        )}
      </div>
    </div>
  );
};
