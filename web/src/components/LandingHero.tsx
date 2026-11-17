import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { 
  Sparkles, 
  Gamepad2, 
  BookOpen, 
  Bot, 
  Shield, 
  ChevronRight, 
  ArrowRight,
  Atom,
  Zap,
  Compass,
  Coins,
  Award,
  Youtube,
  Layers,
  KeyRound,
  FlaskConical,
  Activity
} from 'lucide-react';

export const LandingHero: React.FC = () => {
  const { 
    setActiveTab, 
    playSoundEffect, 
    setIsAuthModalOpen, 
    setIsStoreModalOpen,
    setIsTutorialModalOpen,
    player,
    openInitialBanner
  } = usePlayer();

  const handleEnterCosmos = () => {
    playSoundEffect('portal');
    if (!player.isLoggedIn) {
      setIsAuthModalOpen(true);
    } else {
      setActiveTab('dashboard');
    }
  };

  const JOURNEY_STEPS = [
    {
      stepNumber: '01',
      title: 'Tutorial Gamificado',
      subtitle: 'El Despertar del Huevo Cósmico',
      tab: 'herogame' as const,
      onClickOverride: () => setIsTutorialModalOpen(true),
      icon: Sparkles,
      color: '#00f0ff',
      borderColor: 'border-[#00f0ff]/40',
      glowColor: 'shadow-[0_0_20px_rgba(0,240,255,0.25)]',
      panelStyle: 'hud-panel',
      description: 'Interactúa con el Huevo Cósmico, alimenta al Conejo Blanco (CBC) y descubre los 5 pilares fundamentales de la Matrix.',
      statusBadge: player.eggUnlocked ? 'Completado' : 'Pendiente',
      statusColor: player.eggUnlocked ? 'text-[#7fffd4] bg-[#7fffd4]/10 border-[#7fffd4]/40' : 'text-[#ff007f] bg-[#ff007f]/10 border-[#ff007f]/40'
    },
    {
      stepNumber: '02',
      title: 'Centro RPG & Misiones',
      subtitle: 'Nivel, EXP & MagnoPoints',
      tab: 'dashboard' as const,
      icon: Shield,
      color: '#ff007f',
      borderColor: 'border-[#ff007f]/40',
      glowColor: 'shadow-[0_0_20px_rgba(255,0,127,0.25)]',
      panelStyle: 'hud-panel-magenta',
      description: 'Gestión completa de operador: subida de nivel, equipamiento de títulos, misiones diarias y reclamo de recompensas.',
      statusBadge: `Lvl ${player.level} • ${player.xp} XP`,
      statusColor: 'text-[#00f0ff] bg-[#00f0ff]/10 border-[#00f0ff]/40'
    },
    {
      stepNumber: '03',
      title: 'Vivero MagFam',
      subtitle: 'Criaturas Cósmicas & Evolución',
      tab: 'magfam' as const,
      icon: Bot,
      color: '#7fffd4',
      borderColor: 'border-[#7fffd4]/40',
      glowColor: 'shadow-[0_0_20px_rgba(127,255,212,0.25)]',
      panelStyle: 'hud-panel',
      description: 'Eclosiona huevos místico-tecnológicos, cuida a tus mascotas con elixires de energía y activa sus habilidades pasivas.',
      statusBadge: 'Vivero Activo',
      statusColor: 'text-[#7fffd4] bg-[#7fffd4]/10 border-[#7fffd4]/40'
    },
    {
      stepNumber: '04',
      title: 'Laboratorio de Alquimia',
      subtitle: 'Síntesis & Transmutación',
      tab: 'alchemy' as const,
      icon: FlaskConical,
      color: '#8a2be2',
      borderColor: 'border-[#8a2be2]/40',
      glowColor: 'shadow-[0_0_20px_rgba(138,43,226,0.25)]',
      panelStyle: 'hud-panel-violet',
      description: 'Combina elementos de tu inventario en la Matriz Transmutadora para forjar elixires legendarios y la Piedra Filosofal.',
      statusBadge: 'Forja Lista',
      statusColor: 'text-[#8a2be2] bg-[#8a2be2]/10 border-[#8a2be2]/40'
    },
    {
      stepNumber: '05',
      title: 'Atlas Cósmico',
      subtitle: 'Mapa Interactivo del Multiverso',
      tab: 'atlas' as const,
      icon: Compass,
      color: '#0072ff',
      borderColor: 'border-[#0072ff]/40',
      glowColor: 'shadow-[0_0_20px_rgba(0,114,255,0.25)]',
      panelStyle: 'hud-panel',
      description: 'Navega por las regiones, santuarios y nodos de energía del multiverso con renderizado interactivo en tiempo real.',
      statusBadge: 'Cuadrante Alpha',
      statusColor: 'text-[#00f0ff] bg-[#00f0ff]/10 border-[#00f0ff]/40'
    },
    {
      stepNumber: '06',
      title: 'Sof.IA Asistente',
      subtitle: 'Inteligencia Artificial Guía',
      tab: 'sofia' as const,
      icon: Bot,
      color: '#00f0ff',
      borderColor: 'border-[#00f0ff]/40',
      glowColor: 'shadow-[0_0_20px_rgba(0,240,255,0.25)]',
      panelStyle: 'hud-panel',
      description: 'Haz preguntas sobre la mitología del universo MagnopVS, estrategias tácticas y consejos directamente con Sof.IA.',
      statusBadge: 'IA En Línea',
      statusColor: 'text-[#7fffd4] bg-[#7fffd4]/10 border-[#7fffd4]/40'
    },
    {
      stepNumber: '07',
      title: 'Almanaque Cósmico',
      subtitle: 'Códice & Historias Transmedia',
      tab: 'almanac' as const,
      icon: BookOpen,
      color: '#ff007f',
      borderColor: 'border-[#ff007f]/40',
      glowColor: 'shadow-[0_0_20px_rgba(255,0,127,0.25)]',
      panelStyle: 'hud-panel-magenta',
      description: 'Explora novelas, sagas narrativas, cómics interactivos y registros profundos de la mitología del Omniverso.',
      statusBadge: '7 Archivos',
      statusColor: 'text-[#ff007f] bg-[#ff007f]/10 border-[#ff007f]/40'
    }
  ];

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col justify-between px-4 sm:px-6 lg:px-8 py-8 font-orbitron space-y-10 animate-fade-in">
      
      {/* AAA Top Command Header & Player Status Strip */}
      <div className="hud-panel p-6 sm:p-8 clip-corner relative overflow-hidden border border-[#00f0ff]/30 shadow-[0_0_40px_rgba(0,240,255,0.15)]">
        
        {/* Background Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-[#00f0ff]/20 via-[#8a2be2]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          
          {/* Main Title & Ecosystem Intro */}
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1 bg-[#00f0ff]/10 border border-[#00f0ff]/40 text-[#00f0ff] text-xs font-bold uppercase tracking-[0.2em] clip-corner shadow-[0_0_15px_rgba(0,240,255,0.25)]">
              <Sparkles className="w-4 h-4 text-[#7fffd4] animate-pulse" />
              <span>Centro de Mando • Quantvm Command Hub</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-audiowide uppercase tracking-tight text-[#f8f9fa] leading-tight">
              Universo <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00f0ff] via-[#7fffd4] to-[#ff007f] text-glow-aqua">MagnopVS</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#a0a5b5] leading-relaxed">
              Bienvenido al epicentro del ecosistema transmedia. Selecciona cualquiera de las estaciones tácticas a continuación para iniciar tu inmersión en la Matrix.
            </p>

            {/* Hero Game / Gamified Tutorial Hero CTA */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  playSoundEffect('click');
                  setIsTutorialModalOpen(true);
                }}
                className="px-6 py-3 bg-gradient-to-r from-[#00f0ff] via-[#8a2be2] to-[#ff007f] text-white font-black font-audiowide text-xs uppercase tracking-wider hover:brightness-125 shadow-[0_0_25px_rgba(0,240,255,0.5)] transition-all clip-button flex items-center gap-2.5 cursor-pointer animate-pulse"
              >
                <Sparkles className="w-4 h-4 text-[#7fffd4]" />
                <span>Iniciar Aventura con CBC</span>
              </button>
            </div>
          </div>

          {/* Real-time Operator Quick Stats Widget */}
          <div className="bg-[#05060a]/90 border border-[#1f2430] p-4 sm:p-5 clip-corner space-y-4 min-w-[280px] lg:min-w-[320px] shadow-inner">
            <div className="flex items-center justify-between border-b border-[#1f2430] pb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#7fffd4] animate-pulse" />
                <span className="font-audiowide text-xs text-[#f8f9fa] uppercase">Estado de Operador</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 border uppercase ${player.isLoggedIn ? 'text-[#7fffd4] bg-[#7fffd4]/10 border-[#7fffd4]/30' : 'text-[#ff007f] bg-[#ff007f]/10 border-[#ff007f]/30'}`}>
                {player.isLoggedIn ? player.faction : 'Sin Registro'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-[#a0a5b5] block mb-0.5">Operador</span>
                <span className="font-bold font-audiowide text-[#f8f9fa]">{player.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#a0a5b5] block mb-0.5">Estado Sesión</span>
                <span className={`font-bold font-audiowide ${player.isLoggedIn ? 'text-[#7fffd4]' : 'text-[#ff007f]'}`}>
                  {player.isLoggedIn ? 'Conectado' : 'Pendiente'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#a0a5b5] block mb-0.5">MagnoPoints</span>
                <span className="font-bold text-[#ff007f]">{player.magnoPoints.toLocaleString()} MP</span>
              </div>
              <div>
                <span className="text-[10px] text-[#a0a5b5] block mb-0.5">Huevo Cósmico</span>
                <span className={`font-bold ${player.eggUnlocked ? 'text-[#7fffd4]' : 'text-[#a0a5b5]'}`}>
                  {player.eggUnlocked ? 'Desbloqueado' : 'Bloqueado'}
                </span>
              </div>
            </div>

            {/* Quick Actions / Login prompt */}
            {!player.isLoggedIn ? (
              <button
                onClick={() => {
                  playSoundEffect('click');
                  setIsAuthModalOpen(true);
                }}
                className="w-full py-2.5 bg-gradient-to-r from-[#00f0ff] via-[#8a2be2] to-[#ff007f] text-white font-audiowide font-bold text-[11px] uppercase tracking-wider hover:brightness-125 shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all clip-button flex items-center justify-center gap-2 cursor-pointer animate-pulse"
              >
                <KeyRound className="w-4 h-4 text-[#7fffd4]" />
                <span>Registro / Iniciar Sesión</span>
              </button>
            ) : (
              <div className="pt-1 flex gap-2">
                <button
                  onClick={() => {
                    playSoundEffect('click');
                    setIsStoreModalOpen(true);
                  }}
                  className="flex-1 py-2 bg-[#ff007f]/15 border border-[#ff007f]/50 hover:bg-[#ff007f]/30 text-[#ff007f] font-bold font-audiowide text-[10px] uppercase tracking-wider transition-all clip-button flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>Tienda MP</span>
                </button>

                <button
                  onClick={openInitialBanner}
                  className="py-2 px-3 bg-[#00f0ff]/15 border border-[#00f0ff]/50 hover:bg-[#00f0ff]/30 text-[#00f0ff] font-bold font-audiowide text-[10px] uppercase tracking-wider transition-all clip-button flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Ver Tráiler / Transmisión Inicial"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tráiler</span>
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Guided Recorrido / Multiverse Stations Roadmap */}
      <div className="space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1f2430] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#00f0ff]" />
              <h2 className="font-audiowide text-lg sm:text-xl text-[#f8f9fa] uppercase tracking-wide">
                Recorrido Guiado del Omniverso
              </h2>
            </div>
            <p className="text-xs text-[#a0a5b5]">
              Explora en secuencia ordenada los 7 módulos funcionales sin duplicaciones ni procesos redundantes.
            </p>
          </div>

          <button
            onClick={handleEnterCosmos}
            className="self-start sm:self-auto px-5 py-2.5 bg-gradient-to-r from-[#00f0ff] via-[#0072ff] to-[#8a2be2] text-[#05060a] font-black font-audiowide text-xs uppercase tracking-wider hover:brightness-125 transition-all flex items-center gap-2 cursor-pointer clip-button shadow-[0_0_20px_rgba(0,240,255,0.4)]"
          >
            <span>Iniciar Exploración</span>
            <ArrowRight className="w-4 h-4 text-[#05060a]" />
          </button>
        </div>

        {/* AAA Grid of 7 Module Stations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {JOURNEY_STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.stepNumber}
                onClick={() => {
                  playSoundEffect('click');
                  if (step.onClickOverride) {
                    step.onClickOverride();
                  } else {
                    setActiveTab(step.tab);
                  }
                }}
                className={`${step.panelStyle} p-6 border ${step.borderColor} hover:scale-[1.02] hover:${step.glowColor} transition-all duration-300 cursor-pointer clip-corner flex flex-col justify-between gap-5 group relative overflow-hidden`}
              >
                {/* Step Number Backdrop Watermark */}
                <span className="absolute -bottom-4 -right-2 text-7xl font-black font-audiowide text-white/[0.03] group-hover:text-white/[0.08] transition-colors pointer-events-none select-none">
                  {step.stepNumber}
                </span>

                <div className="space-y-4 relative z-10">
                  
                  {/* Card Top Header */}
                  <div className="flex items-center justify-between">
                    <div 
                      className="w-12 h-12 rounded-xl bg-[#05060a] border flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner"
                      style={{ borderColor: step.color, color: step.color }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 border clip-corner uppercase tracking-wider ${step.statusColor}`}>
                      {step.statusBadge}
                    </span>
                  </div>

                  {/* Titles */}
                  <div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-[#a0a5b5] block mb-1">
                      Paso {step.stepNumber} • {step.subtitle}
                    </span>
                    <h3 className="font-audiowide text-base sm:text-lg text-[#f8f9fa] group-hover:text-[#00f0ff] transition-colors uppercase flex items-center justify-between">
                      <span>{step.title}</span>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#00f0ff]" />
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#a0a5b5] leading-relaxed">
                    {step.description}
                  </p>

                </div>

                {/* Bottom Action Footer */}
                <div className="pt-3 border-t border-[#1f2430] flex items-center justify-between text-[11px] font-bold uppercase relative z-10">
                  <span style={{ color: step.color }} className="group-hover:underline">
                    Abrir Estación →
                  </span>
                  <span className="text-[#a0a5b5]">Sintonía Activa</span>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Community & Transmedia Links Footer */}
      <div className="hud-panel p-6 clip-corner flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#1f2430]">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-audiowide text-sm text-[#f8f9fa] uppercase flex items-center justify-center sm:justify-start gap-2">
            <Sparkles className="w-4 h-4 text-[#7fffd4]" />
            <span>Comunidad Transmedia MagnopVS</span>
          </h4>
          <p className="text-xs text-[#a0a5b5]">
            Sigue las publicaciones oficial en YouTube, cómics digitales y parches de actualización del multiverso.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <a
            href="https://youtu.be/5qU0TeH5V70"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playSoundEffect('click')}
            className="flex-1 sm:flex-none px-6 py-3 bg-[#ff007f]/15 border border-[#ff007f]/50 hover:bg-[#ff007f]/30 text-[#f8f9fa] font-audiowide font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer clip-button"
          >
            <Youtube className="w-4 h-4 text-[#ff007f]" />
            <span>YouTube Oficial</span>
          </a>

          <button
            onClick={() => {
              playSoundEffect('click');
              setActiveTab('sofia');
            }}
            className="flex-1 sm:flex-none px-6 py-3 bg-[#00f0ff]/15 border border-[#00f0ff]/50 hover:bg-[#00f0ff]/30 text-[#00f0ff] font-audiowide font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer clip-button"
          >
            <Bot className="w-4 h-4 text-[#00f0ff]" />
            <span>Consulta Sof.IA</span>
          </button>
        </div>
      </div>

      {/* System Status Footer */}
      <footer className="w-full pt-4 border-t border-[#1f2430] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#a0a5b5]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#7fffd4] animate-ping" />
          <span className="text-[#f8f9fa]">MagnopVS Core Matrix: Nodos 100% Operativos</span>
        </div>
        <div>
          <span>© 2026 Nenca Lab Studio • Ecosistema Transmedia AAA</span>
        </div>
      </footer>

    </div>
  );
};

