import React, { useEffect, useState } from 'react';
import { 
  Play, Lock, Settings, HelpCircle, 
  Landmark, Eye, Award, Tornado, Sparkles as SparklesIcon,
  BookOpen, ChevronRight, ArrowLeft, Layers, Compass
} from 'lucide-react';
import { 
  EleusisMysteries, 
  EleusisInitiation, 
  EleusisTransformation, 
  EleusisAscension, 
  EleusisLore, 
  EleusisArtifacts, 
  EleusisNetwork 
} from './EleusisSubFrames';
import { SagaIntroView, MagZineView, TemporadasView, TrailerView } from './EleusisFlowSteps';
import { EleusisDeckBuilder } from './EleusisDeckBuilder';
import { EleusisDashboard } from './EleusisDashboard';
import { EleusisLanding } from './EleusisLanding';
import { eleusisPathMagZineContext } from './eleusisMagZineContext';

export type EleusisViewState = 
  | 'saga' 
  | 'magzine' 
  | 'temporadas' 
  | 'capitulo' 
  | 'trailer' 
  | 'dashboard' 
  | 'deck-builder' 
  | 'mysteries' 
  | 'initiation' 
  | 'transformation' 
  | 'ascension' 
  | 'lore' 
  | 'artifacts' 
  | 'network';

interface EleusisPathSagaViewProps {
  onClose?: () => void;
  initialView?: EleusisViewState;
  playSoundEffect?: (effect: string) => void;
  addXpAndMp?: (xp: number, mp: number) => void;
}

const ParticleBackground: React.FC = () => {
  useEffect(() => {
    const canvas = document.getElementById('eleusis-particles') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];
    
    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < 40; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speed: Math.random() * 0.4 + 0.1,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
    };

    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.y -= p.speed;
        if (p.y < 0) p.y = canvas.height;
        ctx.fillStyle = `rgba(0, 204, 255, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => init();
    window.addEventListener('resize', handleResize);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas id="eleusis-particles" className="fixed inset-0 pointer-events-none z-[5] opacity-30" />
  );
};

export const EleusisPathSagaView: React.FC<EleusisPathSagaViewProps> = ({ 
  onClose, 
  initialView = 'saga' 
}) => {
  const [viewState, setViewState] = useState<EleusisViewState>(initialView);

  const handleNavigate = (view: string) => {
    setViewState(view as EleusisViewState);
  };

  return (
    <div className="w-full min-h-screen relative bg-[#07090b] text-[#cee5ff] overflow-x-hidden">
      <ParticleBackground />

      {/* Persistent Saga Navigation Bar (Contextual Access Dock) */}
      <div className="sticky top-0 left-0 right-0 z-40 bg-[#0c1015]/95 backdrop-blur-md border-b border-[#00dbe9]/20 px-4 py-2.5 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewState('saga')}
            className="flex items-center gap-2 group text-left cursor-pointer"
            title="Inicio de Saga Eleusis"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00dbe9]/30 to-[#ffabf3]/30 border border-[#00dbe9]/50 flex items-center justify-center text-[#00dbe9] group-hover:scale-105 transition-transform">
              <span className="font-audiowide text-xs font-bold">E</span>
            </div>
            <div>
              <span className="font-audiowide text-xs text-white group-hover:text-[#00dbe9] transition-colors flex items-center gap-1.5">
                Eleusis Path <span className="font-mono text-[9px] text-[#ffabf3] bg-[#ffabf3]/10 px-1.5 rounded">SAGA</span>
              </span>
              <p className="font-mono text-[8px] text-[#8ca0aa] leading-tight hidden sm:block">Protocolo Transmedia MagnopVS</p>
            </div>
          </button>
        </div>

        {/* Central Hub Navigation Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1">
          {/* Main Saga Intro */}
          <button
            onClick={() => setViewState('saga')}
            className={`px-2.5 py-1.5 rounded-lg font-mono text-[11px] font-bold uppercase transition-all whitespace-nowrap ${
              viewState === 'saga'
                ? 'bg-[#00dbe9]/20 text-[#00dbe9] border border-[#00dbe9]/40 shadow-[0_0_10px_rgba(0,219,233,0.2)]'
                : 'text-[#8ca0aa] hover:text-white hover:bg-white/5'
            }`}
          >
            Saga Core
          </button>

          {/* SPECIFIC SAGA MAGZINE SECTION BUTTON */}
          <button
            onClick={() => setViewState('magzine')}
            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold uppercase transition-all flex items-center gap-1.5 whitespace-nowrap ${
              viewState === 'magzine'
                ? 'bg-gradient-to-r from-[#00dbe9] to-[#15ffd1] text-[#002018] shadow-[0_0_15px_rgba(0,219,233,0.5)] scale-105'
                : 'bg-[#15ffd1]/10 border border-[#15ffd1]/40 text-[#15ffd1] hover:bg-[#15ffd1]/20 hover:scale-105'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>MagZine Eleusis</span>
            <span className="text-[9px] px-1 py-0.2 bg-black/40 rounded border border-current text-[8px] font-mono">
              #07
            </span>
          </button>

          {/* Temporadas */}
          <button
            onClick={() => setViewState('temporadas')}
            className={`px-2.5 py-1.5 rounded-lg font-mono text-[11px] font-bold uppercase transition-all whitespace-nowrap ${
              viewState === 'temporadas'
                ? 'bg-[#00dbe9]/20 text-[#00dbe9] border border-[#00dbe9]/40'
                : 'text-[#8ca0aa] hover:text-white hover:bg-white/5'
            }`}
          >
            Temporadas
          </button>

          {/* Simulador */}
          <button
            onClick={() => setViewState('capitulo')}
            className={`px-2.5 py-1.5 rounded-lg font-mono text-[11px] font-bold uppercase transition-all whitespace-nowrap hidden md:inline-flex items-center gap-1 ${
              viewState === 'capitulo'
                ? 'bg-[#00dbe9]/20 text-[#00dbe9] border border-[#00dbe9]/40'
                : 'text-[#8ca0aa] hover:text-white hover:bg-white/5'
            }`}
          >
            Desembarco
          </button>

          {/* Trailer */}
          <button
            onClick={() => setViewState('trailer')}
            className={`px-2.5 py-1.5 rounded-lg font-mono text-[11px] font-bold uppercase transition-all whitespace-nowrap hidden sm:inline-flex items-center gap-1 ${
              viewState === 'trailer'
                ? 'bg-[#00dbe9]/20 text-[#00dbe9] border border-[#00dbe9]/40'
                : 'text-[#8ca0aa] hover:text-white hover:bg-white/5'
            }`}
          >
            <Play className="w-3 h-3" /> Trailer
          </button>

          {/* Dashboard */}
          <button
            onClick={() => setViewState('dashboard')}
            className={`px-2.5 py-1.5 rounded-lg font-mono text-[11px] font-bold uppercase transition-all whitespace-nowrap ${
              viewState === 'dashboard'
                ? 'bg-[#00dbe9]/20 text-[#00dbe9] border border-[#00dbe9]/40'
                : 'text-[#8ca0aa] hover:text-white hover:bg-white/5'
            }`}
          >
            Dashboard
          </button>

          {/* Deck Builder */}
          <button
            onClick={() => setViewState('deck-builder')}
            className={`px-2.5 py-1.5 rounded-lg font-mono text-[11px] font-bold uppercase transition-all whitespace-nowrap hidden lg:inline-flex items-center gap-1 ${
              viewState === 'deck-builder'
                ? 'bg-[#00dbe9]/20 text-[#00dbe9] border border-[#00dbe9]/40'
                : 'text-[#8ca0aa] hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3 h-3" /> Baraja
          </button>

          {/* Mysteries */}
          <button
            onClick={() => setViewState('mysteries')}
            className={`px-2.5 py-1.5 rounded-lg font-mono text-[11px] font-bold uppercase transition-all whitespace-nowrap hidden lg:inline-flex items-center gap-1 ${
              ['mysteries', 'initiation', 'transformation', 'ascension'].includes(viewState)
                ? 'bg-[#00dbe9]/20 text-[#00dbe9] border border-[#00dbe9]/40'
                : 'text-[#8ca0aa] hover:text-white hover:bg-white/5'
            }`}
          >
            <Eye className="w-3 h-3" /> Misterios
          </button>
        </div>

        {/* Exit / Return */}
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-1 text-[11px] font-mono uppercase font-bold text-[#8ca0aa] hover:text-red-400 px-3 py-1.5 rounded-lg border border-[#2d3842] hover:border-red-500/40 hover:bg-red-500/10 transition-colors"
              title="Volver al Quantvm Matrix Hub"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Matrix Hub</span>
            </button>
          )}
        </div>
      </div>

      {/* Dynamic View Router */}
      <div className="w-full">
        {viewState === 'saga' && (
          <SagaIntroView 
            onNext={() => setViewState('magzine')} 
            onClose={onClose} 
            onOpenMagZine={() => setViewState('magzine')} 
          />
        )}

        {/* SPECIFIC MAGZINE VIEW WITH CONTEXTUAL ELEUSIS PATH PROPS */}
        {viewState === 'magzine' && (
          <MagZineView 
            onNext={() => setViewState('temporadas')} 
            onClose={onClose}
            sagaContext={eleusisPathMagZineContext}
          />
        )}

        {viewState === 'temporadas' && (
          <TemporadasView 
            onNext={() => setViewState('capitulo')} 
            onClose={onClose} 
          />
        )}

        {viewState === 'capitulo' && (
          <EleusisLanding 
            onEnter={() => setViewState('trailer')} 
            onClose={onClose} 
          />
        )}

        {viewState === 'trailer' && (
          <TrailerView 
            onNext={() => setViewState('dashboard')} 
            onClose={onClose} 
          />
        )}

        {viewState === 'dashboard' && (
          <EleusisDashboard 
            onClose={onClose} 
            onNavigate={handleNavigate} 
          />
        )}

        {viewState === 'deck-builder' && (
          <EleusisDeckBuilder 
            onClose={onClose} 
            onNavigate={handleNavigate} 
          />
        )}

        {viewState === 'mysteries' && (
          <EleusisMysteries 
            onClose={onClose} 
            onNavigate={handleNavigate} 
          />
        )}

        {viewState === 'initiation' && (
          <EleusisInitiation 
            onClose={onClose} 
            onNavigate={handleNavigate} 
          />
        )}

        {viewState === 'transformation' && (
          <EleusisTransformation 
            onClose={onClose} 
            onNavigate={handleNavigate} 
          />
        )}

        {viewState === 'ascension' && (
          <EleusisAscension 
            onClose={onClose} 
            onNavigate={handleNavigate} 
          />
        )}

        {viewState === 'lore' && (
          <EleusisLore 
            onClose={onClose} 
            onNavigate={handleNavigate} 
          />
        )}

        {viewState === 'artifacts' && (
          <EleusisArtifacts 
            onClose={onClose} 
            onNavigate={handleNavigate} 
          />
        )}

        {viewState === 'network' && (
          <EleusisNetwork 
            onClose={onClose} 
            onNavigate={handleNavigate} 
          />
        )}
      </div>
    </div>
  );
};
