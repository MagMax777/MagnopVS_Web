import React, { useRef, useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Play, Sparkles, Youtube, ArrowRight, X, ChevronRight, Volume2 } from 'lucide-react';
import { ThreeJsPortalCanvas } from './ThreeJsPortalCanvas';
import { ShaderPortalCanvas } from './ShaderPortalCanvas';

interface HeroBannerProps {
  onEnterQuantvm?: () => void;
  isInitialGate?: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onEnterQuantvm, isInitialGate = false }) => {
  const { setActiveTab, playSoundEffect, player, setIsAuthModalOpen, setIsDailyCheckInOpen } = usePlayer();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  // Trailer Video State
  const [showOverlay, setShowOverlay] = useState(true);
  const [bootStep, setBootStep] = useState('TRANSMISIÓN ESTABLECIDA');
  
  // Cinematic Sequence States (Sphere + Boot + Dialogue)
  const [isCinematicActive, setIsCinematicActive] = useState(isInitialGate);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootStatus, setBootStatus] = useState('Inicializando...');
  const [showBootCard, setShowBootCard] = useState(true);
  const [lineIndex, setLineIndex] = useState(0); // 0 = none, 1 = line1, 2 = line2, 3 = line3, 4 = line4 (Recordar)

  // Initialize Boot & Dialogue Sequence
  useEffect(() => {
    if (!isInitialGate) {
      setIsCinematicActive(false);
      return;
    }

    setIsCinematicActive(true);
    setShowBootCard(true);
    setLineIndex(0);

    // Boot bar progress sequence
    const steps = [
      { text: 'Inicializando...', width: 24 },
      { text: 'Buscando el umbral...', width: 58 },
      { text: 'Umbral encontrado.', width: 84 },
      { text: 'Bienvenido, viajero.', width: 100 }
    ];

    let stepIdx = 0;
    const bootInterval = setInterval(() => {
      if (stepIdx < steps.length) {
        setBootStatus(steps[stepIdx].text);
        setBootProgress(steps[stepIdx].width);
        stepIdx++;
      } else {
        clearInterval(bootInterval);
        setTimeout(() => {
          setShowBootCard(false);
          // Start dialogue lines sequence after boot card disappears
          setLineIndex(1);
        }, 600);
      }
    }, 450);

    // Dialogue Lines Timing Schedule
    const t1 = setTimeout(() => setLineIndex(2), 3500);
    const t2 = setTimeout(() => setLineIndex(3), 6000);
    const t3 = setTimeout(() => setLineIndex(4), 8500);

    // Auto-transition to Trailer & Main view after dialogue completes
    const tFinish = setTimeout(() => {
      handleCompleteCinematic();
    }, 12500);

    return () => {
      clearInterval(bootInterval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tFinish);
    };
  }, [isInitialGate]);

  // Status ticker in the trailer header
  useEffect(() => {
    const statusSteps = [
      'ANALIZANDO SINTONÍA NEURONAL...',
      'CONECTANDO NODO QUANTVM MATRIX 01...',
      'SINCRO BIFURCADA ESTABLECIDA',
      '● TRANSMISIÓN ESTABLECIDA'
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < statusSteps.length) {
        setBootStep(statusSteps[idx]);
      } else {
        clearInterval(interval);
      }
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const handleCompleteCinematic = () => {
    playSoundEffect('portal');
    setIsCinematicActive(false);
  };

  const handlePlayTrailer = async () => {
    playSoundEffect('click');
    if (!videoRef.current) return;

    setShowOverlay(false);
    videoRef.current.controls = true;
    videoRef.current.muted = false;
    videoRef.current.volume = 1;

    try {
      await videoRef.current.play();
    } catch (err) {
      console.error(err);
      videoRef.current.controls = true;
    }
  };

  const handleVideoEnded = () => {
    setShowOverlay(true);
    if (videoRef.current) {
      videoRef.current.controls = false;
      videoRef.current.currentTime = 0;
      videoRef.current.muted = true;
    }
  };

  const handleEnterUmbral = () => {
    playSoundEffect('portal');
    if (onEnterQuantvm) {
      onEnterQuantvm();
    } else {
      if (!player.isLoggedIn) {
        setIsAuthModalOpen(true);
      } else {
        setActiveTab('dashboard');
        setIsDailyCheckInOpen(true);
      }
    }
  };

  return (
    <div className={`relative w-full overflow-hidden font-orbitron transition-all duration-700 ${isInitialGate ? 'min-h-screen bg-[#02040a]' : ''}`}>
      
      {/* =========================================================================
          CINEMATIC INTRO OVERLAY (SPHERE + BOOT CARD + DIALOGUE LINES)
         ========================================================================= */}
      {isCinematicActive && (
        <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#000000] overflow-hidden select-none">
          
          {/* WebGL Shader Portal Background */}
          <ShaderPortalCanvas />

          {/* Particle drift effect layer */}
          <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00f0ff]/15 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ff007f]/15 rounded-full blur-[120px] animate-pulse" />
          </div>

          {/* 3D Wireframe Icosahedron Sphere Animation */}
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <ThreeJsPortalCanvas />
          </div>

          {/* Glowing Hypercube Rings around the Sphere */}
          <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-white/20 shadow-[0_0_80px_rgba(0,240,255,0.25)] pointer-events-none animate-spin-slow z-10" />
          <div className="absolute w-48 h-48 sm:w-60 sm:h-60 rounded-full border border-[#00f0ff]/40 shadow-[inset_0_0_50px_rgba(0,240,255,0.2)] pointer-events-none z-10" />

          {/* Boot Sequence Card Overlay */}
          {showBootCard ? (
            <div className="relative z-30 w-full max-w-xs sm:max-w-sm p-6 sm:p-8 rounded-2xl border border-[#00f0ff]/50 bg-[#050810]/92 shadow-[0_0_60px_rgba(0,240,255,0.3)] text-center backdrop-blur-2xl clip-corner animate-scale-up">
              <div className="text-2xl font-black font-audiowide text-[#00f0ff] tracking-[0.45em] uppercase mb-4 drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]">
                MagnopVS
              </div>
              
              <div className="h-2 rounded-full overflow-hidden bg-white/10 mb-3 border border-[#00f0ff]/30">
                <div 
                  className="h-full bg-gradient-to-r from-[#7fffd4] via-[#00f0ff] to-[#ff007f] transition-all duration-300 shadow-[0_0_20px_rgba(0,240,255,0.6)]"
                  style={{ width: `${bootProgress}%` }}
                />
              </div>

              <div className="text-xs text-[#a0a5b5] font-bold tracking-widest uppercase animate-pulse">
                {bootStatus}
              </div>

              <button 
                onClick={handleCompleteCinematic}
                className="mt-6 text-[10px] text-[#7fffd4] hover:text-white uppercase tracking-[0.2em] font-bold transition-all cursor-pointer underline hover:no-underline"
              >
                [ VER TRÁILER DIRECTAMENTE ]
              </button>
            </div>
          ) : (
            /* Dialogue Lines Sequence Overlay */
            <div className="relative z-30 w-full max-w-2xl px-6 text-center flex flex-col items-center justify-center space-y-6 pointer-events-none">
              
              {lineIndex >= 1 && (
                <p className="text-sm sm:text-lg text-[#7fffd4] tracking-[0.22em] uppercase font-bold drop-shadow-[0_0_15px_rgba(127,255,212,0.6)] animate-fade-in">
                  Antes de que naciera la primera llama
                </p>
              )}

              {lineIndex >= 2 && (
                <p className="text-base sm:text-xl text-[#f8f9fa] tracking-[0.2em] uppercase font-medium drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] animate-fade-in">
                  El vacío ya llevaba tu nombre en su silencio.
                </p>
              )}

              {lineIndex >= 3 && (
                <p className="text-base sm:text-xl text-[#d6dff3] tracking-[0.2em] uppercase font-medium drop-shadow-[0_0_20px_rgba(0,240,255,0.3)] animate-fade-in">
                  Y tu sombra, aún sin cuerpo, ya era un faro.
                </p>
              )}

              {lineIndex >= 4 && (
                <p className="text-2xl sm:text-4xl text-[#00f0ff] font-audiowide font-black tracking-[0.35em] uppercase pt-4 drop-shadow-[0_0_30px_rgba(0,240,255,0.9)] animate-bounce">
                  RECORDAR
                </p>
              )}

            </div>
          )}

          {/* Bottom Button to Skip/Enter Trailer */}
          {!showBootCard && (
            <div className="absolute bottom-10 z-40">
              <button
                onClick={handleCompleteCinematic}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#00f0ff]/20 via-[#7fffd4]/20 to-[#00f0ff]/20 border border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-[#051018] font-audiowide font-bold text-xs sm:text-sm tracking-widest transition-all shadow-[0_0_25px_rgba(0,240,255,0.4)] uppercase flex items-center gap-2 cursor-pointer clip-button"
              >
                <span>VER TRÁILER DE MagnopVS</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          MAIN TRAILER VIEW (HEXAGONAL SCI-FI GRID + WALLPAPER BACKGROUND)
         ========================================================================= */}
      
      {/* Platform Wallpaper Background */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 bg-center bg-cover bg-no-repeat bg-fixed opacity-60"
        style={{
          backgroundImage: `
            linear-gradient(180deg, rgba(2, 4, 10, 0.65) 0%, rgba(2, 4, 10, 0.88) 60%, rgba(2, 4, 10, 0.98) 100%),
            url('https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/Biblioteca/Imagenes/Wallpapers/Web/Web1_Wallpaper.jpeg')
          `
        }}
      />

      {/* Hexagonal Sci-Fi Grid Overlay Layer */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1] opacity-40 mix-blend-screen"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 30%, rgba(0, 240, 255, 0.28), transparent 65%),
            radial-gradient(circle at 80% 70%, rgba(255, 0, 127, 0.20), transparent 55%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='98' viewBox='0 0 56 98'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%2300f0ff' stroke-width='1.2' stroke-opacity='0.5'%3E%3Cpath d='M28 2L54 17V47L28 62L2 47V17L28 2Z'/%3E%3Cpath d='M28 51L54 66V96L28 111L2 96V66L28 51Z'/%3E%3Cpath d='M56 26.5L82 41.5V71.5L56 86.5L30 71.5V41.5L56 26.5Z'/%3E%3Cpath d='M0 26.5L26 41.5V71.5L0 86.5L-26 71.5V41.5L0 26.5Z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
          `,
          backgroundSize: '100% 100%, 100% 100%, 56px 98px'
        }}
      />

      {/* Ambient Shader Canvas in lower opacity */}
      <div className="opacity-30">
        <ShaderPortalCanvas />
      </div>

      {/* Main Banner Content */}
      <section id="hero-banner" className="relative z-10 w-full min-h-[85vh] flex justify-center items-center py-12 px-4 sm:px-6">
        <div className="w-full max-w-5xl flex flex-col gap-8">
          
          {/* Header */}
          <header className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#00f0ff]/10 border border-[#00f0ff]/40 text-[#00f0ff] text-xs font-orbitron tracking-[3px] font-bold clip-corner shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
              <span>{bootStep}</span>
            </div>

            <h1 className="font-audiowide text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight drop-shadow-[0_0_25px_rgba(118,232,255,0.7)]">
              MagnopVS
            </h1>

            <h2 className="text-lg sm:text-2xl text-[#ff71ff] font-orbitron font-medium tracking-wide drop-shadow-[0_0_10px_rgba(255,113,255,0.4)]">
              Todos tenemos un deseo secreto
            </h2>
          </header>

          {/* Video Container */}
          <div className="relative w-full rounded-2xl overflow-hidden border border-[#76e8ff]/30 bg-black shadow-[0_0_60px_rgba(118,232,255,0.25)] group">
            <video
              ref={videoRef}
              className="block w-full h-auto bg-black max-h-[500px] object-cover"
              preload="metadata"
              playsInline
              loop={false}
              onEnded={handleVideoEnded}
            >
              <source
                src="https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/frames/home/index/banner/MagnopVS_Intro_Banner.mp4"
                type="video/mp4"
              />
            </video>

            {/* Video Overlay with Play Trailer Button */}
            {showOverlay && (
              <div className="absolute inset-0 flex justify-center items-center bg-gradient-to-b from-black/60 via-black/40 to-black/75 transition-opacity duration-500">
                <button
                  onClick={handlePlayTrailer}
                  className="group/btn flex items-center gap-4 px-8 py-4 sm:px-10 sm:py-5 rounded-full bg-black/80 hover:bg-[#0f192d]/95 text-white font-orbitron text-sm sm:text-lg tracking-widest border border-[#76e8ff]/40 backdrop-blur-md transition-all duration-300 transform hover:scale-105 shadow-[0_0_35px_rgba(118,232,255,0.5)] cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-[#76e8ff]/20 border border-[#76e8ff] flex items-center justify-center text-[#76e8ff] group-hover/btn:bg-[#76e8ff] group-hover/btn:text-[#05070d] transition-colors">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                  <span className="whitespace-nowrap font-bold font-audiowide">REPRODUCIR TRÁILER</span>
                </button>
              </div>
            )}
          </div>

          {/* Narrative Overview */}
          <section className="max-w-3xl mx-auto text-center space-y-3">
            <p className="text-sm sm:text-lg leading-relaxed text-[#d6dff3] font-orbitron">
              Explora un universo donde videojuegos, cómics, novelas, música, inteligencia artificial, geolocalización y realidad convergen en una única plataforma viva.
            </p>
            <p className="text-xs text-[#7fffd4] tracking-widest font-bold">
              Toda leyenda comienza al borde del umbral. No estás entrando a un lugar. Estás recordando uno.
            </p>
          </section>

          {/* Mission Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-2">
            <div 
              onClick={() => { playSoundEffect('click'); setActiveTab('dashboard'); }} 
              className="p-4 rounded-xl border border-[#00f0ff]/30 bg-[#05060a]/80 backdrop-blur-md space-y-2 hover:border-[#00f0ff] transition-all clip-corner cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-[#00f0ff]/10 text-[#00f0ff] flex items-center justify-center font-bold group-hover:scale-110 transition-transform">✦</div>
              <h3 className="font-audiowide text-xs text-[#f8f9fa] uppercase tracking-wider group-hover:text-[#00f0ff]">Despierta</h3>
              <p className="text-[11px] text-[#a0a5b5]">Reconoce la memoria que aún arde bajo la piel.</p>
            </div>

            <div 
              onClick={() => { playSoundEffect('click'); setActiveTab('atlas'); }} 
              className="p-4 rounded-xl border border-[#7fffd4]/30 bg-[#05060a]/80 backdrop-blur-md space-y-2 hover:border-[#7fffd4] transition-all clip-corner cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-[#7fffd4]/10 text-[#7fffd4] flex items-center justify-center font-bold group-hover:scale-110 transition-transform">⟡</div>
              <h3 className="font-audiowide text-xs text-[#f8f9fa] uppercase tracking-wider group-hover:text-[#7fffd4]">Explora</h3>
              <p className="text-[11px] text-[#a0a5b5]">Camina entre los nodos del Atlas Cósmico que esperan ser nombrados.</p>
            </div>

            <div 
              onClick={() => { playSoundEffect('click'); setActiveTab('herogame'); }} 
              className="p-4 rounded-xl border border-[#ff007f]/30 bg-[#05060a]/80 backdrop-blur-md space-y-2 hover:border-[#ff007f] transition-all clip-corner cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-[#ff007f]/10 text-[#ff007f] flex items-center justify-center font-bold group-hover:scale-110 transition-transform">◌</div>
              <h3 className="font-audiowide text-xs text-[#f8f9fa] uppercase tracking-wider group-hover:text-[#ff007f]">Evoluciona</h3>
              <p className="text-[11px] text-[#a0a5b5]">Aprende a sostener fuerzas que no pertenecen a este tiempo.</p>
            </div>

            <div 
              onClick={() => { playSoundEffect('click'); setActiveTab('alchemy'); }} 
              className="p-4 rounded-xl border border-[#8a2be2]/30 bg-[#05060a]/80 backdrop-blur-md space-y-2 hover:border-[#8a2be2] transition-all clip-corner cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-[#8a2be2]/10 text-[#8a2be2] flex items-center justify-center font-bold group-hover:scale-110 transition-transform">⧉</div>
              <h3 className="font-audiowide text-xs text-[#f8f9fa] uppercase tracking-wider group-hover:text-[#8a2be2]">Crea</h3>
              <p className="text-[11px] text-[#a0a5b5]">Convierte el silencio en forma, y la forma en leyenda.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <footer className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-5 pt-2">
            <button
              onClick={handleEnterUmbral}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#00f0ff] via-[#7fffd4] to-[#0072ff] text-[#051018] font-audiowide font-black text-sm sm:text-base tracking-widest hover:brightness-110 hover:-translate-y-0.5 shadow-[0_0_35px_rgba(118,232,255,0.7)] transition-all uppercase flex items-center justify-center gap-3 cursor-pointer clip-button"
            >
              <Sparkles className="w-5 h-5 text-[#051018] animate-bounce" />
              <span>Cruzar el Umbral</span>
              <ArrowRight className="w-5 h-5 text-[#051018]" />
            </button>

            <a
              href="https://youtu.be/5qU0TeH5V70"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playSoundEffect('click')}
              className="w-full sm:w-auto text-center px-6 py-4 rounded-full border border-[#ff71ff] text-[#ff71ff] bg-white/[0.03] hover:bg-[#ff71ff]/15 hover:shadow-[0_0_25px_rgba(255,113,255,0.35)] font-orbitron text-sm tracking-widest transition-all uppercase flex items-center justify-center gap-2"
            >
              <Youtube className="w-5 h-5 text-[#ff71ff]" />
              <span>Ver en YouTube</span>
            </a>
          </footer>

        </div>
      </section>

    </div>
  );
};
