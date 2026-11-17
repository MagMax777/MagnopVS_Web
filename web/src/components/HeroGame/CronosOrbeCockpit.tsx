import React, { useState, useEffect, useRef } from 'react';
import {
  Hourglass,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Volume2,
  VolumeX,
  Check,
  Shield,
  Sliders,
  Layers,
  Award,
  Clock,
  Sparkles,
  Sun,
  Moon,
  Compass,
  Plus,
} from 'lucide-react';

export interface CronosBlockSummary {
  block: number;
  title: string;
  time: string;
  minutes: number;
  status: string;
}

interface CronosOrbeCockpitProps {
  cronosBlocks: CronosBlockSummary[];
  onToggleBlock: (idx: number) => void;
  onReward: (source: string, xp: number, lp: number, mp: number, mc?: number) => void;
  playSoundEffect: (type: 'click' | 'quest' | 'level' | 'buy' | 'portal' | 'flash') => void;
  onOpenFocusModal: () => void;
}

interface PhaseDef {
  id: number;
  label: string;
  subtitle: string;
  durationSec: number;
  isBreak: boolean;
  recommendedFreq: BinauralPreset;
}

type BinauralPreset = 'gamma40' | 'alpha10' | 'theta4' | 'solfeggio528';

const PHASES: PhaseDef[] = [
  { id: 1, label: 'RONDA 1 · ENTRAR', subtitle: 'Arranque sin fricción y enfoque inicial', durationSec: 25 * 60, isBreak: false, recommendedFreq: 'gamma40' },
  { id: 2, label: 'PAUSA 1', subtitle: 'Respiración, agua y descanso visual', durationSec: 5 * 60, isBreak: true, recommendedFreq: 'alpha10' },
  { id: 3, label: 'RONDA 2 · CONSTRUIR', subtitle: 'Producción profunda y avance nuclear', durationSec: 25 * 60, isBreak: false, recommendedFreq: 'gamma40' },
  { id: 4, label: 'PAUSA 2', subtitle: 'Estiramiento y descarga tensional', durationSec: 5 * 60, isBreak: true, recommendedFreq: 'alpha10' },
  { id: 5, label: 'RONDA 3 · RESOLVER', subtitle: 'Desbloqueo de cuellos de botella', durationSec: 25 * 60, isBreak: false, recommendedFreq: 'gamma40' },
  { id: 6, label: 'PAUSA 3', subtitle: 'Silencio breve y recalibración', durationSec: 5 * 60, isBreak: true, recommendedFreq: 'theta4' },
  { id: 7, label: 'RONDA 4 · TERMINAR', subtitle: 'Cierre de entregable y verificación DONE', durationSec: 25 * 60, isBreak: false, recommendedFreq: 'gamma40' },
  { id: 8, label: 'CIERRE DE BLOQUE', subtitle: 'Sello del bloque y próxima acción', durationSec: 5 * 60, isBreak: true, recommendedFreq: 'solfeggio528' },
];

const ORBE_STEPS = [
  { step: 1, name: 'Observar', desc: 'Leer estado vital y cargas pendientes' },
  { step: 2, name: 'Rutear', desc: 'Asignar Área de Vida correcta' },
  { step: 3, name: 'Baremar', desc: 'Calcular Matriz de Valor' },
  { step: 4, name: 'Encuadrar', desc: 'Definir Objetivo y Criterio DONE' },
  { step: 5, name: 'Descomponer', desc: 'Dividir en 4 rondas accionables' },
  { step: 6, name: 'Elegir Tipo', desc: 'Seleccionar naturaleza del bloque' },
  { step: 7, name: 'Ajustar Capacidad', desc: 'Calibrar exigencia según energía' },
  { step: 8, name: 'Asignar Rondas', desc: 'Ejecutar 4×25m + pausas de 5m' },
  { step: 9, name: 'Cerrar', desc: 'Sellar bloque y definir próxima acción' },
];

const LIFE_AREAS = [
  'Yo',
  'Pareja',
  'Casa y Familia',
  'Estudio',
  'Trabajo',
  'Relaciones Sociales',
  'Espiritualidad',
];

const BLOCK_TYPES = [
  'Producción',
  'Desarrollo',
  'Mantenimiento',
  'Resolución',
  'Vínculo',
  'Recuperación',
  'Planificación',
  'Integración',
];

const CAPACITY_LEVELS = ['Baja', 'Normal', 'Alta'] as const;

const BINAURAL_CONFIG: Record<BinauralPreset, { label: string; hz: string; baseFreq: number; beatFreq: number; color: string }> = {
  gamma40: { label: '40Hz Gamma', hz: '40 Hz', baseFreq: 200, beatFreq: 40, color: '#00f0ff' },
  alpha10: { label: '10Hz Alpha', hz: '10 Hz', baseFreq: 200, beatFreq: 10, color: '#47ddc1' },
  theta4: { label: '4Hz Theta', hz: '4 Hz', baseFreq: 180, beatFreq: 4, color: '#c084fc' },
  solfeggio528: { label: '528Hz Solfeggio', hz: '528 Hz', baseFreq: 528, beatFreq: 0, color: '#ffd700' },
};

interface SealedBlockRecord {
  id: string;
  hash: string;
  timestamp: string;
  area: string;
  blockType: string;
  baremo: number;
  objetivo: string;
}

export const CronosOrbeCockpit: React.FC<CronosOrbeCockpitProps> = ({
  cronosBlocks,
  onToggleBlock,
  onReward,
  playSoundEffect,
  onOpenFocusModal,
}) => {
  const [subMode, setSubMode] = useState<'bloque120' | 'maestra1440'>('bloque120');

  // --- MODO 1: ORBE & 120m STATE ---
  const [checkedOrbeSteps, setCheckedOrbeSteps] = useState<number[]>([1, 2, 3]);
  const [importancia, setImportancia] = useState(4);
  const [urgencia, setUrgencia] = useState(3);
  const [impacto, setImpacto] = useState(5);
  const [dependencia, setDependencia] = useState(1);
  const [coste, setCoste] = useState(2);

  const baremoScore = 2 * importancia + urgencia + impacto + dependencia - coste;
  const baremoTier =
    baremoScore >= 16
      ? { label: 'CRÍTICO · PRIORIDAD S', color: '#ff6b6b' }
      : baremoScore >= 12
        ? { label: 'ALTA · PRIORIDAD A', color: '#ffd700' }
        : baremoScore >= 8
          ? { label: 'MEDIA · PRIORIDAD B', color: '#00f0ff' }
          : { label: 'BAJA · DELEGAR / POSPONER', color: '#849495' };

  const [selectedArea, setSelectedArea] = useState(LIFE_AREAS[4]);
  const [selectedType, setSelectedType] = useState(BLOCK_TYPES[0]);
  const [selectedCapacity, setSelectedCapacity] = useState<(typeof CAPACITY_LEVELS)[number]>('Normal');

  // Block Card
  const [objetivo, setObjetivo] = useState('Completar arquitectura nuclear del módulo activo en MagnopVS');
  const [actividad, setActividad] = useState('Implementación de componentes y validación de estado');
  const [resultado, setResultado] = useState('Módulo operativo, compilado y verificado');
  const [criterioDone, setCriterioDone] = useState('0 errores de compilación y flujo probado end-to-end');
  const [proximaAccion, setProximaAccion] = useState('Revisar telemetría y preparar siguiente bloque');

  const [sealedBlocks, setSealedBlocks] = useState<SealedBlockRecord[]>(() => {
    try {
      const saved = localStorage.getItem('mlh_cronos_sealed_blocks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [sealBanner, setSealBanner] = useState<string | null>(null);

  // 120m Timer
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(PHASES[0].durationSec);
  const [isRunning, setIsRunning] = useState(false);

  // Binaural Synth
  const [binauralActive, setBinauralActive] = useState(false);
  const [binauralPreset, setBinauralPreset] = useState<BinauralPreset>('gamma40');
  const [autoModulate, setAutoModulate] = useState(true);
  const [binauralVolume, setBinauralVolume] = useState(0.18);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscLeftRef = useRef<OscillatorNode | null>(null);
  const oscRightRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const playTransitionBell = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch {
      // Ignore audio errors
    }
  };

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          playTransitionBell();
          if (phaseIdx < PHASES.length - 1) {
            const nextIdx = phaseIdx + 1;
            setPhaseIdx(nextIdx);
            if (autoModulate) {
              setBinauralPreset(PHASES[nextIdx].recommendedFreq);
            }
            return PHASES[nextIdx].durationSec;
          } else {
            setIsRunning(false);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, phaseIdx, autoModulate]);

  // Manage Binaural Web Audio
  useEffect(() => {
    const stopNodes = () => {
      try {
        oscLeftRef.current?.stop();
        oscRightRef.current?.stop();
      } catch {
        // ignore
      }
      oscLeftRef.current = null;
      oscRightRef.current = null;
      gainRef.current = null;
    };

    if (!binauralActive) {
      stopNodes();
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      stopNodes();
      const cfg = BINAURAL_CONFIG[binauralPreset];
      const masterGain = ctx.createGain();
      masterGain.gain.value = binauralVolume;
      masterGain.connect(ctx.destination);
      gainRef.current = masterGain;

      const oscL = ctx.createOscillator();
      const oscR = ctx.createOscillator();
      oscL.type = 'sine';
      oscR.type = 'sine';
      oscL.frequency.value = cfg.baseFreq;
      oscR.frequency.value = cfg.baseFreq + cfg.beatFreq;

      if (ctx.createStereoPanner) {
        const panL = ctx.createStereoPanner();
        const panR = ctx.createStereoPanner();
        panL.pan.value = -0.8;
        panR.pan.value = 0.8;
        oscL.connect(panL);
        oscR.connect(panR);
        panL.connect(masterGain);
        panR.connect(masterGain);
      } else {
        oscL.connect(masterGain);
        oscR.connect(masterGain);
      }

      oscL.start();
      oscR.start();
      oscLeftRef.current = oscL;
      oscRightRef.current = oscR;
    } catch {
      // ignore audio init error
    }

    return () => {
      stopNodes();
    };
  }, [binauralActive, binauralPreset]);

  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = binauralVolume;
    }
  }, [binauralVolume]);

  const handleAdvancePhase = () => {
    playTransitionBell();
    const nextIdx = phaseIdx < PHASES.length - 1 ? phaseIdx + 1 : 0;
    setPhaseIdx(nextIdx);
    setSecondsLeft(PHASES[nextIdx].durationSec);
    if (autoModulate) {
      setBinauralPreset(PHASES[nextIdx].recommendedFreq);
    }
    playSoundEffect('click');
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setPhaseIdx(0);
    setSecondsLeft(PHASES[0].durationSec);
    if (autoModulate) {
      setBinauralPreset(PHASES[0].recommendedFreq);
    }
    playSoundEffect('click');
  };

  const handleSealCurrentBlock = () => {
    if (!objetivo.trim()) return;
    const hash = `MV-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const record: SealedBlockRecord = {
      id: `blk-${Date.now()}`,
      hash,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      area: selectedArea,
      blockType: selectedType,
      baremo: baremoScore,
      objetivo: objetivo.trim(),
    };
    const next = [record, ...sealedBlocks.slice(0, 9)];
    setSealedBlocks(next);
    try {
      localStorage.setItem('mlh_cronos_sealed_blocks', JSON.stringify(next));
    } catch {
      // ignore
    }
    onReward(`Sello Bloque ORBE (${selectedArea})`, 250, 30, 30, 80);
    playSoundEffect('level');
    setSealBanner(`Bloque sellado [${hash}]: +250 XP, +80 MC, +30 MP acreditados.`);
    setTimeout(() => setSealBanner(null), 4500);
  };

  // Elapsed calculation for 120m concentric dial
  const elapsedBeforeCurrent = PHASES.slice(0, phaseIdx).reduce((acc, p) => acc + p.durationSec, 0);
  const currentPhaseElapsed = PHASES[phaseIdx].durationSec - secondsLeft;
  const totalElapsedSec = elapsedBeforeCurrent + currentPhaseElapsed;
  const totalBlockSec = 120 * 60;
  const progressPct = Math.min(100, (totalElapsedSec / totalBlockSec) * 100);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formattedClock = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  // --- MODO 2: 1440m MASTER SHEET STATE ---
  const [dayMissionMain, setDayMissionMain] = useState('Consolidar el Bloque de Producción Alfa y mantener coherencia vital');
  const [dayMissionSec1, setDayMissionSec1] = useState('Completar 30 min de movimiento físico consciente');
  const [dayMissionSec2, setDayMissionSec2] = useState('Cerrar bandeja de pendientes antes de las 20:00');
  const [capMorning, setCapMorning] = useState<'Baja' | 'Normal' | 'Alta'>('Alta');
  const [capNoon, setCapNoon] = useState<'Baja' | 'Normal' | 'Alta'>('Normal');
  const [capNight, setCapNight] = useState<'Baja' | 'Normal' | 'Alta'>('Baja');

  const [budgetMinutes, setBudgetMinutes] = useState<Record<string, number>>({
    Sueño: 450,
    Autocuidado: 60,
    Alimentación: 90,
    Trabajo: 240,
    Estudio: 90,
    Vínculo: 90,
    Recuperación: 60,
    Transición: 60,
    'Vida Libre': 120,
    'Cronos (4×120m)': 180,
  });

  const totalBudget: number = (Object.values(budgetMinutes) as number[]).reduce((a, b) => a + b, 0);
  const remaining1440 = 1440 - totalBudget;

  const [recoveryChecks, setRecoveryChecks] = useState<boolean[]>([true, true, false, false, false]);
  const RECOVERY_ITEMS = [
    'Sueño reparador ≥ 7 horas',
    'Hidratación y alimentación limpia',
    'Pausas de 5m respetadas en bloques',
    'Desconexión de pantallas 45m antes de dormir',
    'Movimiento o estiramiento corporal',
  ];

  const [closureHighlight, setClosureHighlight] = useState('');
  const [closureFriction, setClosureFriction] = useState('');
  const [closureTomorrow, setClosureTomorrow] = useState('');
  const [daySealBanner, setDaySealBanner] = useState<string | null>(null);

  const handleSealDay = () => {
    const hash = `DAY-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`;
    try {
      localStorage.setItem(
        'mlh_cronos_1440_last_seal',
        JSON.stringify({
          hash,
          dayMissionMain,
          totalBudget,
          recoveryCount: recoveryChecks.filter(Boolean).length,
          closureHighlight,
          sealedAt: new Date().toISOString(),
        })
      );
    } catch {
      // ignore
    }
    onReward('Sello Maestro CRONOS 1440m', 450, 50, 50, 120);
    playSoundEffect('level');
    setDaySealBanner(`Jornada 1440m sellada [${hash}]: +450 XP, +120 MC, +50 MP acreditados.`);
    setTimeout(() => setDaySealBanner(null), 5000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Mode Switcher */}
      <div className="bg-[#1a1b21]/85 border border-amber-500/30 rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-[#3b494b]/30 pb-4">
          <div>
            <h2 className="font-['Audiowide',sans-serif] text-xl text-amber-300 flex items-center gap-2">
              <Hourglass className="w-5 h-5 text-amber-400" />
              CRONOS 1440m // MÉTODO ORBE & BLOQUES DE 120m
            </h2>
            <p className="text-sm text-[#b9cacb] mt-1">
              Cada jornada posee 1440 minutos sagrados. Opera en bloques exactos de 120 minutos con baremación de valor y síntesis binaural.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setSubMode('bloque120');
                playSoundEffect('click');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-['JetBrains_Mono',monospace] font-bold border transition-all cursor-pointer ${
                subMode === 'bloque120'
                  ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                  : 'bg-[#0d0e13]/70 border-[#3b494b]/40 text-[#b9cacb] hover:border-[#00f0ff]/40'
              }`}
            >
              BLOQUE OPERATIVO (120m · ORBE)
            </button>
            <button
              onClick={() => {
                setSubMode('maestra1440');
                playSoundEffect('click');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-['JetBrains_Mono',monospace] font-bold border transition-all cursor-pointer ${
                subMode === 'maestra1440'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'bg-[#0d0e13]/70 border-[#3b494b]/40 text-[#b9cacb] hover:border-amber-400/40'
              }`}
            >
              FICHA MAESTRA 24H (1440m)
            </button>
          </div>
        </div>

        {/* 4 Daily Cronos Blocks Quick Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
          {cronosBlocks.map((b, i) => {
            const statusColor = b.status === 'Completado' ? '#47ddc1' : b.status === 'En Curso' ? '#00f0ff' : '#849495';
            return (
              <div key={b.block} className="p-3.5 rounded-xl bg-[#0d0e13]/80 border border-[#3b494b]/30 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex justify-between items-center text-[11px] font-['JetBrains_Mono',monospace] text-[#849495] mb-1">
                    <span>BLOQUE 0{b.block}</span>
                    <span style={{ color: statusColor }} className="font-bold">
                      {b.status}
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs text-[#e3e1e9]">{b.title}</h4>
                  <p className="text-[11px] text-[#849495] mt-0.5">
                    {b.time} · {b.minutes}m
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onOpenFocusModal();
                      playSoundEffect('click');
                    }}
                    className="flex-1 py-1.5 bg-[#1e1f25] hover:bg-[#292a2f] border border-[#3b494b]/40 rounded text-[10px] font-['JetBrains_Mono',monospace] text-[#dbfcff] cursor-pointer"
                  >
                    HIPERENFOQUE
                  </button>
                  {b.status !== 'Completado' && (
                    <button
                      onClick={() => onToggleBlock(i)}
                      className="flex-1 py-1.5 bg-[#47ddc1]/15 hover:bg-[#47ddc1]/25 border border-[#47ddc1]/40 rounded text-[10px] font-['JetBrains_Mono',monospace] font-bold text-[#47ddc1] cursor-pointer"
                    >
                      SELLAR (+50 XP)
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================================================================= */}
      {/* MODO 1: BLOQUE OPERATIVO 120m + MÉTODO ORBE + BINAURAL            */}
      {/* ================================================================= */}
      {subMode === 'bloque120' && (
        <div className="space-y-6">
          {/* 9-Step Método ORBE */}
          <div className="bg-[#1a1b21]/85 border border-[#00f0ff]/30 rounded-2xl p-5 backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <h3 className="font-['Orbitron',sans-serif] text-sm font-bold text-[#00f0ff] flex items-center gap-2">
                <Compass className="w-4 h-4" />
                MÉTODO ORBE · PROTOCOLO DE 9 PASOS
              </h3>
              <span className="font-['JetBrains_Mono',monospace] text-xs text-[#47ddc1]">
                {checkedOrbeSteps.length} / 9 COMPLETADOS
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
              {ORBE_STEPS.map(s => {
                const done = checkedOrbeSteps.includes(s.step);
                return (
                  <button
                    key={s.step}
                    onClick={() => {
                      setCheckedOrbeSteps(prev => (prev.includes(s.step) ? prev.filter(x => x !== s.step) : [...prev, s.step]));
                      playSoundEffect('click');
                    }}
                    title={s.desc}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      done
                        ? 'bg-[#47ddc1]/15 border-[#47ddc1]/60 text-[#dbfcff]'
                        : 'bg-[#0d0e13]/70 border-[#3b494b]/40 text-[#849495] hover:border-[#00f0ff]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span>0{s.step}</span>
                      {done && <Check className="w-3 h-3 text-[#47ddc1]" />}
                    </div>
                    <div className="text-[11px] font-bold truncate">{s.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* LEFT COLUMN: 120m Concentric Dial + Binaural Synth */}
            <div className="xl:col-span-5 bg-[#1a1b21]/85 border border-[#00f0ff]/30 rounded-2xl p-6 backdrop-blur-xl flex flex-col justify-between gap-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-['Orbitron',sans-serif] text-xs font-bold text-[#00f0ff] tracking-wider">
                    DIAL CONCÉNTRICO · 120 MIN
                  </span>
                  <span className="font-['JetBrains_Mono',monospace] text-xs px-2.5 py-0.5 rounded-full bg-[#0d0e13] border border-[#3b494b]/50 text-[#47ddc1]">
                    {Math.round(progressPct)}% COMPLETADO
                  </span>
                </div>

                {/* SVG Concentric 120-Minute Dial */}
                <div className="relative w-56 h-56 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                    {/* Background Track */}
                    <circle cx="100" cy="100" r="84" fill="none" stroke="#1e1f25" strokeWidth="12" />
                    {/* 120m Progress Arc */}
                    <circle
                      cx="100"
                      cy="100"
                      r="84"
                      fill="none"
                      stroke={PHASES[phaseIdx].isBreak ? '#47ddc1' : '#00f0ff'}
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 84}
                      strokeDashoffset={2 * Math.PI * 84 * (1 - progressPct / 100)}
                      className="transition-all duration-500"
                    />
                    {/* Inner Phase Ring */}
                    <circle cx="100" cy="100" r="64" fill="none" stroke="#292a2f" strokeWidth="6" />
                    <circle
                      cx="100"
                      cy="100"
                      r="64"
                      fill="none"
                      stroke="#ffd700"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 64}
                      strokeDashoffset={2 * Math.PI * 64 * (secondsLeft / PHASES[phaseIdx].durationSec)}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <span className="text-[10px] font-['JetBrains_Mono',monospace] text-[#ffd700] font-bold">
                      {PHASES[phaseIdx].label}
                    </span>
                    <span className="font-['JetBrains_Mono',monospace] text-4xl font-bold text-[#e3e1e9] tracking-tight my-1">
                      {formattedClock}
                    </span>
                    <span className="text-[10px] text-[#b9cacb] leading-tight max-w-[140px]">
                      {PHASES[phaseIdx].subtitle}
                    </span>
                  </div>
                </div>

                {/* Timer Controls */}
                <div className="flex items-center justify-center gap-3 mt-5">
                  <button
                    onClick={() => {
                      setIsRunning(prev => !prev);
                      playSoundEffect('click');
                    }}
                    className={`px-5 py-2.5 rounded-xl font-['Orbitron',sans-serif] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      isRunning
                        ? 'bg-amber-500/20 border border-amber-400 text-amber-300'
                        : 'bg-[#00f0ff] text-[#0d0e13] hover:bg-[#47ddc1]'
                    }`}
                  >
                    {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isRunning ? 'PAUSAR' : 'INICIAR RONDA'}
                  </button>
                  <button
                    onClick={handleAdvancePhase}
                    title="Siguiente fase"
                    className="p-2.5 rounded-xl bg-[#0d0e13] border border-[#3b494b]/50 text-[#dbfcff] hover:border-[#00f0ff] cursor-pointer"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleResetTimer}
                    title="Reiniciar bloque 120m"
                    className="p-2.5 rounded-xl bg-[#0d0e13] border border-[#3b494b]/50 text-[#849495] hover:text-[#e3e1e9] cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* 8-Phase Pills */}
                <div className="grid grid-cols-4 gap-1.5 mt-4">
                  {PHASES.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setPhaseIdx(idx);
                        setSecondsLeft(p.durationSec);
                        if (autoModulate) setBinauralPreset(p.recommendedFreq);
                        playSoundEffect('click');
                      }}
                      className={`py-1.5 px-1 rounded text-[10px] font-mono border text-center cursor-pointer transition-all ${
                        idx === phaseIdx
                          ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff] font-bold'
                          : idx < phaseIdx
                            ? 'bg-[#47ddc1]/10 border-[#47ddc1]/40 text-[#47ddc1]'
                            : 'bg-[#0d0e13]/60 border-[#3b494b]/30 text-[#849495]'
                      }`}
                    >
                      {p.isBreak ? `P${Math.ceil((idx + 1) / 2)} · 5m` : `R${Math.ceil((idx + 1) / 2)} · 25m`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sintetizador Binaural */}
              <div className="p-4 rounded-xl bg-[#0d0e13]/90 border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-['Orbitron',sans-serif] text-xs font-bold text-purple-300 flex items-center gap-2">
                    {binauralActive ? <Volume2 className="w-4 h-4 text-[#00f0ff]" /> : <VolumeX className="w-4 h-4 text-[#849495]" />}
                    SINTETIZADOR BINAURAL
                  </span>
                  <button
                    onClick={() => {
                      setBinauralActive(prev => !prev);
                      playSoundEffect('click');
                    }}
                    className={`px-3 py-1 rounded-lg text-[11px] font-mono font-bold border cursor-pointer transition-all ${
                      binauralActive
                        ? 'bg-[#47ddc1]/20 border-[#47ddc1] text-[#47ddc1]'
                        : 'bg-[#1e1f25] border-[#3b494b]/50 text-[#b9cacb]'
                    }`}
                  >
                    {binauralActive ? 'ACTIVO' : 'ACTIVAR AUDIO'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(BINAURAL_CONFIG) as BinauralPreset[]).map(key => {
                    const cfg = BINAURAL_CONFIG[key];
                    const active = binauralPreset === key;
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setBinauralPreset(key);
                          playSoundEffect('click');
                        }}
                        className={`p-2 rounded-lg border text-left text-[11px] font-mono cursor-pointer transition-all ${
                          active
                            ? 'bg-white/10 border-[#00f0ff] text-[#e3e1e9]'
                            : 'bg-[#1a1b21] border-[#3b494b]/30 text-[#849495] hover:text-[#e3e1e9]'
                        }`}
                      >
                        <div className="font-bold" style={{ color: cfg.color }}>
                          {cfg.label}
                        </div>
                        <div className="text-[10px] opacity-80">{cfg.hz}</div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <label className="flex items-center gap-1.5 text-[11px] text-[#b9cacb] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoModulate}
                      onChange={e => setAutoModulate(e.target.checked)}
                      className="accent-[#00f0ff]"
                    />
                    Auto-modular por fase
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#849495]">VOL</span>
                    <input
                      type="range"
                      min={0.02}
                      max={0.5}
                      step={0.02}
                      value={binauralVolume}
                      onChange={e => setBinauralVolume(Number(e.target.value))}
                      className="w-20 accent-[#00f0ff]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Matriz de Valor + Selectors + Tarjeta de Bloque */}
            <div className="xl:col-span-7 space-y-5">
              {/* Matriz de Valor (Baremo) */}
              <div className="bg-[#1a1b21]/85 border border-[#3b494b]/40 rounded-2xl p-5 backdrop-blur-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-['Orbitron',sans-serif] text-sm font-bold text-[#dbfcff] flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#00f0ff]" />
                      MATRIZ DE VALOR (BAREMO ORBE)
                    </h3>
                    <p className="text-[11px] font-mono text-[#849495] mt-0.5">
                      Valor = (2 × Importancia) + Urgencia + Impacto + Dependencia − Coste
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-['JetBrains_Mono',monospace] text-xl font-bold text-[#00f0ff]">
                      {baremoScore} pts
                    </span>
                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border"
                      style={{
                        color: baremoTier.color,
                        borderColor: `${baremoTier.color}66`,
                        backgroundColor: `${baremoTier.color}18`,
                      }}
                    >
                      {baremoTier.label}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {[
                    { label: 'Importancia (×2)', val: importancia, set: setImportancia, min: 1, max: 5 },
                    { label: 'Urgencia', val: urgencia, set: setUrgencia, min: 1, max: 5 },
                    { label: 'Impacto', val: impacto, set: setImpacto, min: 1, max: 5 },
                    { label: 'Dependencia', val: dependencia, set: setDependencia, min: 0, max: 3 },
                    { label: 'Coste (−)', val: coste, set: setCoste, min: 1, max: 5 },
                  ].map(slider => (
                    <div key={slider.label} className="p-2.5 rounded-xl bg-[#0d0e13]/80 border border-[#3b494b]/30">
                      <div className="flex justify-between text-[11px] font-mono mb-1.5">
                        <span className="text-[#b9cacb]">{slider.label}</span>
                        <span className="text-[#00f0ff] font-bold">{slider.val}</span>
                      </div>
                      <input
                        type="range"
                        min={slider.min}
                        max={slider.max}
                        value={slider.val}
                        onChange={e => slider.set(Number(e.target.value))}
                        className="w-full accent-[#00f0ff]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Áreas de Vida, Tipos de Bloque & Capacidad */}
              <div className="bg-[#1a1b21]/85 border border-[#3b494b]/40 rounded-2xl p-5 backdrop-blur-xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-[#00f0ff] mb-1.5">7 ÁREAS DE VIDA</label>
                    <select
                      value={selectedArea}
                      onChange={e => setSelectedArea(e.target.value)}
                      className="w-full bg-[#0d0e13] border border-[#3b494b]/50 rounded-lg px-3 py-2 text-xs text-[#e3e1e9] focus:outline-none focus:border-[#00f0ff]"
                    >
                      {LIFE_AREAS.map(a => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#47ddc1] mb-1.5">8 TIPOS DE BLOQUE</label>
                    <select
                      value={selectedType}
                      onChange={e => setSelectedType(e.target.value)}
                      className="w-full bg-[#0d0e13] border border-[#3b494b]/50 rounded-lg px-3 py-2 text-xs text-[#e3e1e9] focus:outline-none focus:border-[#47ddc1]"
                    >
                      {BLOCK_TYPES.map(t => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-amber-300 mb-1.5">CAPACIDAD VITAL</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {CAPACITY_LEVELS.map(cap => (
                        <button
                          key={cap}
                          onClick={() => setSelectedCapacity(cap)}
                          className={`py-2 rounded-lg text-xs font-mono border cursor-pointer transition-all ${
                            selectedCapacity === cap
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                              : 'bg-[#0d0e13] border-[#3b494b]/40 text-[#849495]'
                          }`}
                        >
                          {cap}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tarjeta de Bloque & Sello */}
              <div className="bg-[#1a1b21]/85 border border-[#47ddc1]/30 rounded-2xl p-5 backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-['Orbitron',sans-serif] text-sm font-bold text-[#47ddc1] flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    TARJETA DE BLOQUE & SELLO CRIPTOGRÁFICO
                  </h3>
                  <span className="text-[11px] font-mono text-[#849495]">
                    {selectedArea} · {selectedType} · Cap. {selectedCapacity}
                  </span>
                </div>

                {sealBanner && (
                  <div className="p-3 rounded-xl bg-[#47ddc1]/15 border border-[#47ddc1]/50 text-[#47ddc1] text-xs font-mono">
                    ✦ {sealBanner}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-[#849495] mb-1">OBJETIVO DEL BLOQUE</label>
                    <input
                      type="text"
                      value={objetivo}
                      onChange={e => setObjetivo(e.target.value)}
                      className="w-full bg-[#0d0e13] border border-[#3b494b]/40 rounded-lg px-3 py-2 text-xs text-[#e3e1e9] focus:outline-none focus:border-[#00f0ff]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#849495] mb-1">ACTIVIDAD PRINCIPAL</label>
                    <input
                      type="text"
                      value={actividad}
                      onChange={e => setActividad(e.target.value)}
                      className="w-full bg-[#0d0e13] border border-[#3b494b]/40 rounded-lg px-3 py-2 text-xs text-[#e3e1e9] focus:outline-none focus:border-[#00f0ff]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#849495] mb-1">RESULTADO ESPERADO</label>
                    <input
                      type="text"
                      value={resultado}
                      onChange={e => setResultado(e.target.value)}
                      className="w-full bg-[#0d0e13] border border-[#3b494b]/40 rounded-lg px-3 py-2 text-xs text-[#e3e1e9] focus:outline-none focus:border-[#00f0ff]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#849495] mb-1">CRITERIO DONE</label>
                    <input
                      type="text"
                      value={criterioDone}
                      onChange={e => setCriterioDone(e.target.value)}
                      className="w-full bg-[#0d0e13] border border-[#3b494b]/40 rounded-lg px-3 py-2 text-xs text-[#e3e1e9] focus:outline-none focus:border-[#00f0ff]"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
                  <div className="flex-1">
                    <label className="block text-[10px] font-mono text-[#849495] mb-1">PRÓXIMA ACCIÓN AL CERRAR</label>
                    <input
                      type="text"
                      value={proximaAccion}
                      onChange={e => setProximaAccion(e.target.value)}
                      className="w-full bg-[#0d0e13] border border-[#3b494b]/40 rounded-lg px-3 py-2 text-xs text-[#e3e1e9] focus:outline-none focus:border-[#00f0ff]"
                    />
                  </div>
                  <button
                    onClick={handleSealCurrentBlock}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#47ddc1] text-[#0d0e13] font-['Orbitron',sans-serif] text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 cursor-pointer"
                  >
                    <Shield className="w-4 h-4" />
                    SELLAR BLOQUE (+250 XP / +80 MC)
                  </button>
                </div>

                {sealedBlocks.length > 0 && (
                  <div className="pt-3 border-t border-[#3b494b]/30 space-y-1.5">
                    <div className="text-[10px] font-mono text-[#849495]">SELLOS RECIENTES EN EL CODEX</div>
                    <div className="flex flex-wrap gap-2">
                      {sealedBlocks.slice(0, 4).map(sb => (
                        <span
                          key={sb.id}
                          className="px-2.5 py-1 rounded-lg bg-[#0d0e13] border border-[#47ddc1]/30 text-[10px] font-mono text-[#dbfcff]"
                        >
                          {sb.hash} · {sb.area} ({sb.baremo}pts) · {sb.timestamp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODO 2: FICHA MAESTRA DEL DÍA (1440 MINUTOS / 24 HORAS)           */}
      {/* ================================================================= */}
      {subMode === 'maestra1440' && (
        <div className="space-y-6">
          {/* Intención del Día + Escáner Vital */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-[#1a1b21]/85 border border-amber-500/30 rounded-2xl p-5 backdrop-blur-xl space-y-4">
              <h3 className="font-['Orbitron',sans-serif] text-sm font-bold text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                INTENCIÓN DEL DÍA · 1440 MINUTOS
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-mono text-[#849495] mb-1">MISIÓN PRINCIPAL DEL DÍA</label>
                  <input
                    type="text"
                    value={dayMissionMain}
                    onChange={e => setDayMissionMain(e.target.value)}
                    className="w-full bg-[#0d0e13] border border-[#3b494b]/40 rounded-lg px-3 py-2 text-xs text-[#e3e1e9] focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-[#849495] mb-1">MISIÓN SECUNDARIA 1</label>
                    <input
                      type="text"
                      value={dayMissionSec1}
                      onChange={e => setDayMissionSec1(e.target.value)}
                      className="w-full bg-[#0d0e13] border border-[#3b494b]/40 rounded-lg px-3 py-2 text-xs text-[#e3e1e9] focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#849495] mb-1">MISIÓN SECUNDARIA 2</label>
                    <input
                      type="text"
                      value={dayMissionSec2}
                      onChange={e => setDayMissionSec2(e.target.value)}
                      className="w-full bg-[#0d0e13] border border-[#3b494b]/40 rounded-lg px-3 py-2 text-xs text-[#e3e1e9] focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#1a1b21]/85 border border-[#00f0ff]/30 rounded-2xl p-5 backdrop-blur-xl space-y-4">
              <h3 className="font-['Orbitron',sans-serif] text-sm font-bold text-[#00f0ff] flex items-center gap-2">
                <Sun className="w-4 h-4" />
                ESCÁNER DE CAPACIDAD VITAL
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Mañana (06:00–12:00)', val: capMorning, set: setCapMorning },
                  { label: 'Mediodía (12:00–18:00)', val: capNoon, set: setCapNoon },
                  { label: 'Tarde-Noche (18:00–24:00)', val: capNight, set: setCapNight },
                ].map(slot => (
                  <div key={slot.label} className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#0d0e13]/80 border border-[#3b494b]/30">
                    <span className="text-xs text-[#e3e1e9]">{slot.label}</span>
                    <div className="flex gap-1">
                      {CAPACITY_LEVELS.map(lvl => (
                        <button
                          key={lvl}
                          onClick={() => slot.set(lvl)}
                          className={`px-2.5 py-1 rounded text-[10px] font-mono cursor-pointer border ${
                            slot.val === lvl
                              ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff] font-bold'
                              : 'bg-[#1a1b21] border-[#3b494b]/40 text-[#849495]'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Presupuesto de 1440 Minutos */}
          <div className="bg-[#1a1b21]/85 border border-[#3b494b]/40 rounded-2xl p-5 backdrop-blur-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-['Orbitron',sans-serif] text-sm font-bold text-[#dbfcff] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#47ddc1]" />
                  CLASIFICACIÓN DEL TIEMPO · PRESUPUESTO DE 1440 MINUTOS
                </h3>
                <p className="text-xs text-[#849495] mt-0.5">
                  Distribuye las 24 horas exactas entre descanso, producción, vínculo y recuperación.
                </p>
              </div>
              <div className="font-['JetBrains_Mono',monospace] text-xs px-3 py-1.5 rounded-xl bg-[#0d0e13] border border-[#3b494b]/50">
                ASIGNADOS: <strong className={totalBudget === 1440 ? 'text-[#47ddc1]' : 'text-amber-300'}>{totalBudget}m</strong> / 1440m
                {remaining1440 !== 0 && (
                  <span className="ml-2 text-[#849495]">
                    ({remaining1440 > 0 ? `+${remaining1440}m libres` : `${Math.abs(remaining1440)}m exceso`})
                  </span>
                )}
              </div>
            </div>

            <div className="w-full h-3 rounded-full bg-[#0d0e13] overflow-hidden border border-[#3b494b]/40">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (totalBudget / 1440) * 100)}%`,
                  background: totalBudget > 1440 ? '#ff6b6b' : 'linear-gradient(90deg, #00f0ff, #47ddc1, #ffd700)',
                }}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {Object.entries(budgetMinutes).map(([cat, minsVal]) => (
                <div key={cat} className="p-3 rounded-xl bg-[#0d0e13]/80 border border-[#3b494b]/30">
                  <div className="flex justify-between items-center text-[11px] font-mono mb-1.5">
                    <span className="text-[#b9cacb] truncate">{cat}</span>
                    <span className="text-[#00f0ff] font-bold">{minsVal}m</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={600}
                    step={15}
                    value={minsVal}
                    onChange={e =>
                      setBudgetMinutes(prev => ({
                        ...prev,
                        [cat]: Number(e.target.value),
                      }))
                    }
                    className="w-full accent-[#47ddc1]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Control de Recuperación + Cierre del Día + Sello */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-[#1a1b21]/85 border border-[#47ddc1]/30 rounded-2xl p-5 backdrop-blur-xl space-y-3">
              <h3 className="font-['Orbitron',sans-serif] text-sm font-bold text-[#47ddc1] flex items-center gap-2">
                <Moon className="w-4 h-4" />
                CONTROL DE RECUPERACIÓN VITAL
              </h3>
              <div className="space-y-2">
                {RECOVERY_ITEMS.map((item, idx) => (
                  <label
                    key={item}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#0d0e13]/80 border border-[#3b494b]/30 text-xs text-[#e3e1e9] cursor-pointer hover:border-[#47ddc1]/40"
                  >
                    <input
                      type="checkbox"
                      checked={recoveryChecks[idx]}
                      onChange={() =>
                        setRecoveryChecks(prev => prev.map((v, i) => (i === idx ? !v : v)))
                      }
                      className="accent-[#47ddc1]"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#1a1b21]/85 border border-amber-500/30 rounded-2xl p-5 backdrop-blur-xl space-y-4">
              <h3 className="font-['Orbitron',sans-serif] text-sm font-bold text-amber-300 flex items-center gap-2">
                <Award className="w-4 h-4" />
                CIERRE DEL DÍA & SELLO MAESTRO 1440m
              </h3>

              {daySealBanner && (
                <div className="p-3 rounded-xl bg-[#47ddc1]/15 border border-[#47ddc1]/50 text-[#47ddc1] text-xs font-mono">
                  ✦ {daySealBanner}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-[#849495] mb-1">MAYOR LOGRO DE HOY</label>
                  <textarea
                    value={closureHighlight}
                    onChange={e => setClosureHighlight(e.target.value)}
                    placeholder="¿Qué avanzaste hoy?"
                    className="w-full h-20 bg-[#0d0e13] border border-[#3b494b]/40 rounded-lg p-2.5 text-xs text-[#e3e1e9] resize-none focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[#849495] mb-1">FRICCIÓN TRANSMUTADA</label>
                  <textarea
                    value={closureFriction}
                    onChange={e => setClosureFriction(e.target.value)}
                    placeholder="¿Qué obstáculo superaste?"
                    className="w-full h-20 bg-[#0d0e13] border border-[#3b494b]/40 rounded-lg p-2.5 text-xs text-[#e3e1e9] resize-none focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[#849495] mb-1">PRIORIDAD #1 DE MAÑANA</label>
                  <textarea
                    value={closureTomorrow}
                    onChange={e => setClosureTomorrow(e.target.value)}
                    placeholder="Primer bloque al despertar..."
                    className="w-full h-20 bg-[#0d0e13] border border-[#3b494b]/40 rounded-lg p-2.5 text-xs text-[#e3e1e9] resize-none focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                onClick={handleSealDay}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-[#00f0ff] text-[#0d0e13] font-['Orbitron',sans-serif] text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                SELLAR HORARIO DEL DÍA 1440m (+450 XP / +120 MC)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
