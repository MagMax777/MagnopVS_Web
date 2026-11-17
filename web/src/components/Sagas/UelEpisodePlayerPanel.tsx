import React, { useState, useEffect } from 'react';
import { SagaFullData } from '../../data/sagasData';
import { usePlayer } from '../../context/PlayerContext';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Check,
  GitBranch,
  Lock,
  Unlock,
  Shield,
  Terminal,
  Download,
  History,
  Radio,
  Sparkles,
  Diamond,
  Activity,
  Maximize2,
  Eye,
} from 'lucide-react';

interface UelEpisodePlayerPanelProps {
  saga: SagaFullData;
}

interface ChronoLogItem {
  id: string;
  actor: string;
  timestamp: string;
  status: string;
  text: string;
  accent: 'cyan' | 'neutral' | 'magenta';
}

const UEL_PHASES = [
  { id: 1, label: 'Intro', code: 'PHASE 01' },
  { id: 2, label: 'Webcomic', code: 'PHASE 02' },
  { id: 3, label: 'Diálogo & RPG', code: 'PHASE 03' },
  { id: 4, label: 'Decrypt', code: 'PHASE 04' },
  { id: 5, label: 'Transición', code: 'PHASE 05' },
  { id: 6, label: 'Bifurcación', code: 'PHASE 06' },
  { id: 7, label: 'Clímax Loop', code: 'PHASE 07' },
];

const DEFAULT_ENDINGS = [
  { id: 'end-1', title: 'SOLAR AETHEL', desc: 'Resonancia armónica total en la convergencia.' },
  { id: 'end-2', title: 'COLAPSO DEL VACÍO', desc: 'Sacrificio del núcleo para sellar la brecha.' },
  { id: 'end-3', title: 'PHI TRASCENDENTAL', desc: 'Sincronía pura sin distorsión temporal.' },
  { id: 'end-4', title: 'ÓRBITA FRACTURADA', desc: 'Rama apócrifa de divergencia cuántica.' },
];

export const UelEpisodePlayerPanel: React.FC<UelEpisodePlayerPanelProps> = ({ saga }) => {
  const { addXpAndMp, playSoundEffect, player } = usePlayer();
  const storageKey = `magnopvs_uel_state_${saga.id}`;

  const [savedState] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [activePhase, setActivePhase] = useState<number>(savedState?.activePhase || 6);
  const [cameraFeed, setCameraFeed] = useState<'CAM-01' | 'CAM-02' | 'CAM-03'>('CAM-01');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progressPct, setProgressPct] = useState<number>(savedState?.progressPct ?? 46.2);
  const [selectedBranch, setSelectedBranch] = useState<'A' | 'B'>(savedState?.selectedBranch || 'A');
  const [lockedBranch, setLockedBranch] = useState<'A' | 'B' | null>(savedState?.lockedBranch || null);
  const [unlockedEndings, setUnlockedEndings] = useState<string[]>(savedState?.unlockedEndings || ['end-1']);
  const [decisionTimer, setDecisionTimer] = useState<number>(108);
  const [shieldPct, setShieldPct] = useState<number>(savedState?.shieldPct ?? 92);
  const [hullPct, setHullPct] = useState<number>(savedState?.hullPct ?? 88);
  const [voidArcana, setVoidArcana] = useState<number>(savedState?.voidArcana ?? 640);
  const [chronoLogs, setChronoLogs] = useState<ChronoLogItem[]>(
    savedState?.chronoLogs || [
      {
        id: 'log-1',
        actor: saga.factions?.[0]?.name?.toUpperCase() || 'OPERADOR',
        timestamp: '08:15',
        status: 'CHRONO-OK',
        text: `Telemetría confirma resonancia en ${saga.sectorCoordinates} con frecuencia ${saga.audioFrequency}.`,
        accent: 'neutral',
      },
      {
        id: 'log-2',
        actor: 'SCRIBE SERAPH-09',
        timestamp: '08:31',
        status: 'DECRYPTED',
        text: `Protocolo UEL v1.1 enlazado a ${saga.title}. Esperando resolución de bifurcación.`,
        accent: 'cyan',
      },
      {
        id: 'log-3',
        actor: 'QUANTVM RUNTIME',
        timestamp: '08:42',
        status: 'BIFURCACIÓN',
        text: 'Punto de divergencia cuántica activo. Selecciona Rama A o Rama B para sellar el bucle.',
        accent: 'magenta',
      },
    ]
  );

  // Persist UEL state per saga
  useEffect(() => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          activePhase,
          progressPct,
          selectedBranch,
          lockedBranch,
          unlockedEndings,
          shieldPct,
          hullPct,
          voidArcana,
          chronoLogs: chronoLogs.slice(0, 15),
        })
      );
    } catch {
      // ignore storage errors
    }
  }, [storageKey, activePhase, progressPct, selectedBranch, lockedBranch, unlockedEndings, shieldPct, hullPct, voidArcana, chronoLogs]);

  // Playback scrubber progression
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgressPct((prev) => (prev >= 100 ? 0 : Number((prev + 0.8).toFixed(1))));
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Decision lockout countdown
  useEffect(() => {
    if (lockedBranch || decisionTimer <= 0) return;
    const timer = setInterval(() => {
      setDecisionTimer((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [lockedBranch, decisionTimer]);

  const activeChapter = saga.chapters?.[0];
  const branchA = activeChapter?.decision?.options?.[0] || {
    id: 'branch-a',
    label: 'Alinear Brújula Astral',
    desc: `Canaliza el pulso de ${saga.title} para estabilizar los armónicos orbitales y revelar rutas ocultas.`,
    xpReward: 180,
    mpReward: 450,
    outcome: 'Resonancia armónica estabilizada.',
  };
  const branchB = activeChapter?.decision?.options?.[1] || {
    id: 'branch-b',
    label: 'Desplegar Égida Solar',
    desc: 'Ejecuta un bloqueo cinético planetario que protege el casco a costa de retroalimentación hiper-armónica.',
    xpReward: 160,
    mpReward: 400,
    outcome: 'Defensa cinética sellada en el bucle.',
  };

  const handleLockDecision = () => {
    if (lockedBranch) return;
    const chosen = selectedBranch === 'A' ? branchA : branchB;
    setLockedBranch(selectedBranch);
    setActivePhase(7);
    setProgressPct(86.5);
    playSoundEffect('level');
    addXpAndMp(chosen.xpReward || 180, chosen.mpReward || 450);

    if (selectedBranch === 'A') {
      setVoidArcana((v) => Math.min(800, v + 90));
      setShieldPct((s) => Math.min(100, s + 4));
      if (!unlockedEndings.includes('end-3')) {
        setUnlockedEndings((prev) => [...prev, 'end-3']);
      }
    } else {
      setShieldPct(100);
      setHullPct((h) => Math.max(60, h - 6));
      if (!unlockedEndings.includes('end-2')) {
        setUnlockedEndings((prev) => [...prev, 'end-2']);
      }
    }

    const nowTime = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    setChronoLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        actor: `OP. ${player?.name?.toUpperCase() || 'COMANDANTE'}`,
        timestamp: nowTime,
        status: `RAMA ${selectedBranch} SELLADA`,
        text: `${chosen.label} — ${chosen.outcome} (+${chosen.xpReward || 180} XP / +${chosen.mpReward || 450} MP)`,
        accent: 'cyan',
      },
      ...prev,
    ]);
  };

  const handleRewindLoop = () => {
    setLockedBranch(null);
    setActivePhase(6);
    setProgressPct(46.2);
    setDecisionTimer(108);
    playSoundEffect('portal');
  };

  const handleExportLog = () => {
    try {
      const payload = {
        platform: 'MagnopVS',
        saga: saga.title,
        uelVersion: 'v1.1',
        phase: activePhase,
        unlockedEndings,
        chronoLogs,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `magnopvs-uel-${saga.id}-log.json`;
      a.click();
      URL.revokeObjectURL(url);
      playSoundEffect('click');
    } catch {
      // ignore export errors
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const totalSec = 18 * 60 + 42;
  const currentSec = Math.round((progressPct / 100) * totalSec);
  const currentTimeStr = `${Math.floor(currentSec / 60).toString().padStart(2, '0')}:${(currentSec % 60).toString().padStart(2, '0')}`;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* UEL v1.1 7-Phase Loop Stepper */}
      <div className="bg-[#0b0e15]/90 border border-[#3b494c]/50 p-4 rounded-xl overflow-x-auto">
        <div className="flex items-center justify-between min-w-[720px] gap-2">
          {UEL_PHASES.map((phase, idx) => {
            const isCompleted = phase.id < activePhase;
            const isCurrent = phase.id === activePhase;
            return (
              <React.Fragment key={phase.id}>
                <button
                  onClick={() => {
                    setActivePhase(phase.id);
                    playSoundEffect('click');
                  }}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-[#00e5ff]/15 border border-[#00e5ff] shadow-[0_0_14px_rgba(0,229,255,0.3)]'
                      : isCompleted
                      ? 'opacity-90 hover:opacity-100'
                      : 'opacity-45 hover:opacity-80'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded flex items-center justify-center text-xs font-mono font-bold ${
                      isCurrent
                        ? 'bg-[#00e5ff] text-[#05060a]'
                        : isCompleted
                        ? 'border border-[#00e5ff] bg-[#00e5ff]/20 text-[#00e5ff]'
                        : 'border border-[#3b494c] text-[#849396]'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : phase.id === 6 ? <GitBranch className="w-3.5 h-3.5" /> : `0${phase.id}`}
                  </div>
                  <div className="text-left">
                    <div className={`text-[9px] font-mono ${isCurrent ? 'text-[#00e5ff] font-bold' : 'text-[#849396]'}`}>
                      {isCurrent ? 'ACTIVO' : phase.code}
                    </div>
                    <div className={`text-xs font-mono font-semibold ${isCurrent ? 'text-white' : 'text-[#bac9cc]'}`}>
                      {phase.label}
                    </div>
                  </div>
                </button>
                {idx < UEL_PHASES.length - 1 && (
                  <div
                    className={`h-px flex-1 ${
                      isCompleted ? 'bg-[#00e5ff]/80' : 'bg-[#3b494c]/40'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Cockpit Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT/CENTER: Cinematic Stage + Bifurcation + 8-Ending Matrix */}
        <div className="lg:col-span-8 space-y-6">
          {/* Holographic Viewport Stage */}
          <div className="relative bg-[#0b0e15] border border-[#00e5ff]/40 overflow-hidden clip-chamfer-corner shadow-[0_0_24px_rgba(0,176,255,0.2)]">
            {/* Top Camera Feed Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#0b0e15]/90 border-b border-[#3b494c]/40">
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#00e5ff]">
                <span className="w-2 h-2 rounded-full bg-[#ff4d6d] animate-ping" />
                <span className="tracking-widest font-bold">LIVE HUD // {cameraFeed} · {saga.title.toUpperCase()}</span>
                <span className="hidden sm:inline text-[#849396]">[{saga.sectorCoordinates}]</span>
              </div>
              <div className="flex items-center gap-1">
                {(['CAM-01', 'CAM-02', 'CAM-03'] as const).map((cam) => (
                  <button
                    key={cam}
                    onClick={() => {
                      setCameraFeed(cam);
                      playSoundEffect('click');
                    }}
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold transition-all cursor-pointer clip-chamfer-sm ${
                      cameraFeed === cam
                        ? 'bg-[#00e5ff] text-[#05060a]'
                        : 'bg-[#191b23] text-[#bac9cc] border border-[#3b494c]/50 hover:text-white'
                    }`}
                  >
                    {cam}
                  </button>
                ))}
              </div>
            </div>

            {/* Stage Canvas */}
            <div className="relative w-full aspect-[16/9] min-h-[300px] overflow-hidden bg-[#07090e]">
              <img
                src={saga.image}
                alt={saga.title}
                className={`w-full h-full object-cover transition-all duration-700 ${
                  cameraFeed === 'CAM-02'
                    ? 'scale-110 brightness-90 hue-rotate-15'
                    : cameraFeed === 'CAM-03'
                    ? 'scale-105 contrast-125 saturate-125'
                    : 'scale-100'
                }`}
              />
              <div className="absolute inset-0 scanline-grid pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e15] via-[#0b0e15]/25 to-transparent pointer-events-none" />

              {/* Peripheral Reticle Brackets */}
              <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-[#00e5ff]/70 pointer-events-none" />
              <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-[#00e5ff]/70 pointer-events-none" />
              <div className="absolute bottom-20 left-4 w-10 h-10 border-b-2 border-l-2 border-[#00e5ff]/70 pointer-events-none" />
              <div className="absolute bottom-20 right-4 w-10 h-10 border-b-2 border-r-2 border-[#00e5ff]/70 pointer-events-none" />

              {/* In-Scene Narrative Cue */}
              <div className="absolute bottom-4 inset-x-4 sm:inset-x-6 bg-[#0b0e15]/90 backdrop-blur-md border-l-4 border-[#00e5ff] border-y border-r border-[#3b494c]/50 p-3.5 clip-chamfer-sm max-w-2xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-[#00e5ff] font-bold tracking-wider">
                    {activeChapter?.title?.toUpperCase() || saga.title.toUpperCase()} [FREQ {saga.audioFrequency}]
                  </span>
                  <span className="text-[9px] font-mono text-[#8dcdff] bg-[#00affe]/20 px-1.5 py-0.5 rounded">
                    UEL v1.1 · FASE 0{activePhase}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#e1e2ec] leading-relaxed">
                  {activeChapter?.narrative || saga.synopsis}
                </p>
              </div>
            </div>

            {/* Scrubber & Playback Controls */}
            <div className="px-5 py-3 bg-[#191b23] border-t border-[#3b494c]/40 space-y-2">
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                  setProgressPct(Number(pct.toFixed(1)));
                }}
                className="relative w-full h-2 bg-[#32353d] cursor-pointer rounded-full overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-[#00affe] to-[#00e5ff] shadow-[0_0_10px_#00e5ff] transition-all"
                  style={{ width: `${progressPct}%` }}
                />
                <div
                  className="absolute top-0 bottom-0 left-[46.2%] w-2.5 h-2.5 -mt-[1px] rounded-full bg-[#ff007f] shadow-[0_0_8px_#ff007f] -translate-x-1/2"
                  title="Punto de Bifurcación (46.2%)"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setIsPlaying((p) => !p);
                      playSoundEffect('click');
                    }}
                    className="text-[#00e5ff] hover:text-white cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setProgressPct((p) => Math.max(0, Number((p - 10).toFixed(1))))}
                    className="text-[#bac9cc] hover:text-white cursor-pointer"
                    title="-10%"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setProgressPct((p) => Math.min(100, Number((p + 10).toFixed(1))))}
                    className="text-[#bac9cc] hover:text-white cursor-pointer"
                    title="+10%"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                  <span className="text-[#e1e2ec]">
                    <strong className="text-[#00e5ff]">{currentTimeStr}</strong> <span className="text-[#849396]">/ 18:42</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-[#00e5ff] bg-[#32353d]/60 px-2.5 py-1 rounded border border-[#3b494c]/50">
                  <Activity className="w-3.5 h-3.5" />
                  <span>SOLFEGGIO {saga.audioFrequency} ATMOS</span>
                  <Maximize2 className="w-3 h-3 ml-1 text-[#849396]" />
                </div>
              </div>
            </div>
          </div>

          {/* PHASE 06: BIFURCACIÓN ARCHIVAL MATRIX */}
          <div className="bg-[#191b23]/95 border border-[#00e5ff]/50 p-5 clip-chamfer-corner shadow-[0_0_20px_rgba(0,229,255,0.15)] space-y-4">
            <div className="flex flex-wrap items-center justify-between border-b border-[#3b494c]/40 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#00e5ff] rounded-sm animate-pulse" />
                <h3 className="font-audiowide text-sm sm:text-base text-[#c3f5ff] uppercase">
                  UEL FASE 06: MATRIZ DE BIFURCACIÓN
                </h3>
              </div>
              <div className="text-[11px] font-mono bg-[#1d1f27] px-3 py-1 rounded border border-[#3b494c]/60">
                <span className="text-[#849396] mr-2">BLOQUEO DE DECISIÓN:</span>
                <span className="text-[#00e5ff] font-bold">{lockedBranch ? 'SELLADO' : formatTimer(decisionTimer)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Branch A */}
              <button
                type="button"
                disabled={Boolean(lockedBranch)}
                onClick={() => {
                  setSelectedBranch('A');
                  playSoundEffect('click');
                }}
                className={`text-left p-4 rounded-lg border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  selectedBranch === 'A'
                    ? 'bg-[#1d1f27] border-[#00e5ff] shadow-[0_0_16px_rgba(0,229,255,0.25)]'
                    : 'bg-[#1d1f27]/60 border-[#3b494c]/60 hover:border-[#8dcdff]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#00e5ff] mb-1.5">
                    <span>RAMA A // TRANSMISIÓN</span>
                    <span className="px-1.5 py-0.5 bg-[#00e5ff]/20 text-[#00e5ff] rounded">RECOMENDADA</span>
                  </div>
                  <h4 className="font-orbitron font-bold text-sm text-white mb-1.5">{branchA.label}</h4>
                  <p className="text-xs text-[#bac9cc] leading-relaxed mb-3">{branchA.desc}</p>
                </div>
                <div className="pt-2 border-t border-[#3b494c]/40 flex items-center justify-between text-[11px] font-mono text-[#c3f5ff]">
                  <span className="flex items-center gap-1">
                    <Diamond className="w-3.5 h-3.5 text-[#00e5ff]" /> +{branchA.mpReward || 450} MP / +{branchA.xpReward || 180} XP
                  </span>
                  <span className="text-[#8dcdff]">CONFIANZA +24%</span>
                </div>
              </button>

              {/* Branch B */}
              <button
                type="button"
                disabled={Boolean(lockedBranch)}
                onClick={() => {
                  setSelectedBranch('B');
                  playSoundEffect('click');
                }}
                className={`text-left p-4 rounded-lg border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  selectedBranch === 'B'
                    ? 'bg-[#1d1f27] border-[#8dcdff] shadow-[0_0_16px_rgba(141,205,255,0.25)]'
                    : 'bg-[#1d1f27]/60 border-[#3b494c]/60 hover:border-[#8dcdff]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#8dcdff] mb-1.5">
                    <span>RAMA B // FORTALEZA</span>
                    <span className="px-1.5 py-0.5 bg-[#32353d] text-[#bac9cc] rounded">DEFENSIVA</span>
                  </div>
                  <h4 className="font-orbitron font-bold text-sm text-white mb-1.5">{branchB.label}</h4>
                  <p className="text-xs text-[#bac9cc] leading-relaxed mb-3">{branchB.desc}</p>
                </div>
                <div className="pt-2 border-t border-[#3b494c]/40 flex items-center justify-between text-[11px] font-mono text-[#bac9cc]">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-[#8dcdff]" /> +{branchB.mpReward || 400} MP / +{branchB.xpReward || 160} XP
                  </span>
                  <span className="text-[#849396]">KARMA TÁCTICO</span>
                </div>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <span className="text-[11px] font-mono text-[#849396]">
                {lockedBranch
                  ? `Rama ${lockedBranch} sellada en la línea temporal de ${saga.title}.`
                  : 'La decisión recalibra los escudos del operador y desbloquea finales canónicos.'}
              </span>
              {!lockedBranch ? (
                <button
                  onClick={handleLockDecision}
                  className="px-5 py-2.5 bg-[#00e5ff] hover:bg-[#c3f5ff] text-[#05060a] font-orbitron font-bold text-xs tracking-wider uppercase clip-chamfer-sm shadow-[0_0_18px_rgba(0,229,255,0.5)] flex items-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>SELLAR DECISIÓN (RAMA {selectedBranch})</span>
                </button>
              ) : (
                <button
                  onClick={handleRewindLoop}
                  className="px-4 py-2 bg-[#1d1f27] hover:bg-[#272a32] text-[#00e5ff] border border-[#00e5ff]/50 font-mono font-bold text-xs uppercase clip-chamfer-sm flex items-center gap-2 cursor-pointer"
                >
                  <History className="w-4 h-4" />
                  <span>REINICIAR BUCLE</span>
                </button>
              )}
            </div>
          </div>

          {/* 8-ENDING ARCHIVE MATRIX (Design 3) */}
          <div className="bg-[#191b23]/90 border border-[#3b494c]/50 p-5 clip-chamfer-corner space-y-4">
            <div className="flex items-center justify-between border-b border-[#3b494c]/30 pb-3">
              <div>
                <h3 className="font-audiowide text-sm text-[#c3f5ff] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00e5ff]" />
                  <span>MATRIZ DE FINALES CANÓNICOS</span>
                </h3>
                <p className="text-[11px] font-mono text-[#849396]">Líneas temporales desbloqueadas en {saga.title}</p>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-1 bg-[#1d1f27] text-[#8dcdff] border border-[#8dcdff]/30 rounded">
                {unlockedEndings.length} / {DEFAULT_ENDINGS.length} DESCUBIERTOS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {DEFAULT_ENDINGS.map((end, idx) => {
                const isOpen = unlockedEndings.includes(end.id);
                return (
                  <div
                    key={end.id}
                    className={`p-3 rounded-lg border transition-all ${
                      isOpen
                        ? 'bg-[#1d1f27] border-[#00e5ff]/60'
                        : 'bg-[#0b0e15]/60 border-[#3b494c]/30 opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                      <span className={isOpen ? 'text-[#00e5ff] font-bold' : 'text-[#849396]'}>
                        FINAL 0{idx + 1}
                      </span>
                      {isOpen ? (
                        <Unlock className="w-3.5 h-3.5 text-[#00e5ff]" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-[#849396]" />
                      )}
                    </div>
                    <div className="font-orbitron text-xs font-bold text-white mb-1">{end.title}</div>
                    <p className="text-[11px] text-[#bac9cc]">{end.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: Bento Tactical HUD Sidebar (4 Cols) */}
        <aside className="lg:col-span-4 space-y-5">
          {/* Operator Shield & Vitals */}
          <div className="bg-[#191b23]/90 border border-[#3b494c]/50 p-4 clip-chamfer-corner space-y-3">
            <div className="flex items-center justify-between border-b border-[#3b494c]/30 pb-2">
              <span className="text-[11px] font-mono font-bold text-[#c3f5ff] flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#00e5ff]" /> ESCUDO Y VITALES DEL OPERADOR
              </span>
              <span className="text-[10px] font-mono text-[#849396]">GRID-74</span>
            </div>

            <div className="space-y-2.5 text-[11px] font-mono">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#bac9cc]">ESCUDO CELESTIAL</span>
                  <span className="text-[#00e5ff] font-bold">{shieldPct}%</span>
                </div>
                <div className="w-full h-2 bg-[#0b0e15] rounded overflow-hidden">
                  <div className="h-full bg-[#00e5ff] shadow-[0_0_8px_#00e5ff] transition-all" style={{ width: `${shieldPct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#bac9cc]">INTEGRIDAD DEL CASCO</span>
                  <span className="text-[#ff8fa3] font-bold">{hullPct}%</span>
                </div>
                <div className="w-full h-2 bg-[#0b0e15] rounded overflow-hidden">
                  <div className="h-full bg-[#ff007f] shadow-[0_0_8px_#ff007f] transition-all" style={{ width: `${hullPct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#bac9cc]">CAPACIDAD VOID ARCANA</span>
                  <span className="text-[#8dcdff] font-bold">{voidArcana} / 800 VA</span>
                </div>
                <div className="w-full h-2 bg-[#0b0e15] rounded overflow-hidden">
                  <div className="h-full bg-[#8dcdff] transition-all" style={{ width: `${Math.round((voidArcana / 800) * 100)}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Hermetic Astrolabe Array */}
          <div className="bg-[#191b23]/90 border border-[#3b494c]/50 p-4 clip-chamfer-corner space-y-3">
            <div className="flex items-center justify-between border-b border-[#3b494c]/30 pb-2">
              <span className="text-[11px] font-mono font-bold text-[#8dcdff] flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-[#00e5ff]" /> ASTROLABIO HERMÉTICO
              </span>
              <span className="text-[10px] font-mono text-[#00e5ff]">{saga.audioFrequency}</span>
            </div>

            <div className="relative aspect-[4/3] bg-[#0b0e15] border border-[#3b494c]/40 rounded flex items-center justify-center overflow-hidden">
              <div className="w-32 h-32 border border-[#00e5ff]/40 rounded-full flex items-center justify-center animate-spin-slow">
                <div className="w-24 h-24 border border-[#8dcdff]/50 rotate-45 flex items-center justify-center">
                  <div className="w-16 h-16 border border-[#00e5ff]/70 rounded-full" />
                </div>
              </div>
              <div className="absolute flex flex-col items-center text-center">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00e5ff] animate-ping mb-1" />
                <span className="text-[10px] font-mono font-bold text-[#00e5ff]">SELLO ALINEADO</span>
                <span className="text-[9px] font-mono text-[#849396]">PHI 1.618 · RESONANCIA +1.28 dB</span>
              </div>
            </div>
          </div>

          {/* Archival Chrono-Log */}
          <div className="bg-[#191b23]/90 border border-[#3b494c]/50 p-4 clip-chamfer-corner space-y-3">
            <div className="flex items-center justify-between border-b border-[#3b494c]/30 pb-2">
              <span className="text-[11px] font-mono font-bold text-white flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-[#849396]" /> ARCHIVAL CHRONO-LOG
              </span>
              <span className="text-[10px] font-mono text-[#00e5ff] flex items-center gap-1">
                <Eye className="w-3 h-3" /> EN VIVO
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 text-xs">
              {chronoLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-2.5 rounded bg-[#0b0e15]/80 border-l-2 ${
                    log.accent === 'cyan'
                      ? 'border-[#00e5ff]'
                      : log.accent === 'magenta'
                      ? 'border-[#ff007f]'
                      : 'border-[#3b494c]'
                  }`}
                >
                  <div className="flex justify-between text-[10px] font-mono mb-0.5">
                    <span className={log.accent === 'cyan' ? 'text-[#00e5ff] font-bold' : 'text-[#849396]'}>
                      {log.actor} [{log.timestamp}]
                    </span>
                    <span className={log.accent === 'magenta' ? 'text-[#ff8fa3] font-bold' : 'text-[#8dcdff]'}>
                      {log.status}
                    </span>
                  </div>
                  <p className="text-[#bac9cc] leading-snug">{log.text}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#3b494c]/30 flex items-center justify-between text-[11px] font-mono">
              <button
                onClick={handleRewindLoop}
                className="text-[#00e5ff] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <History className="w-3.5 h-3.5" /> REBOBINAR BUCLE
              </button>
              <button
                onClick={handleExportLog}
                className="text-[#bac9cc] hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> EXPORTAR LOG
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
