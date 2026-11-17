import React, { useEffect } from 'react';
import { Star, ChevronsRight, BookOpen, ChevronsDown, Globe, Share2 } from 'lucide-react';

interface EleusisLandingProps {
  onEnter: () => void;
  onClose?: () => void;
}

export const EleusisLanding: React.FC<EleusisLandingProps> = ({ onEnter, onClose }) => {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX / window.innerWidth - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;
      
      const hudElements = document.querySelectorAll('.glass-panel-hud') as NodeListOf<HTMLElement>;
      hudElements.forEach((el, index) => {
        const depth = (index + 1) * 10;
        el.style.transform = `translate(${mouseX * depth}px, ${mouseY * depth}px)`;
      });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col overflow-x-hidden">
      {/* TOP APP BAR (Shared Component) */}
      <header className="flex justify-between items-center px-margin-desktop py-4 w-full z-[100] top-0 bg-background/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_0_20px_rgba(0,219,233,0.1)] sticky">
        <div className="font-display-xl text-headline-md tracking-widest text-primary-fixed-dim">
          MagnopVS
        </div>
        <nav className="hidden md:flex gap-8 items-center">
          <a className="font-label-caps text-label-caps text-primary-fixed-dim border-b-2 border-primary-fixed-dim pb-1 cursor-pointer">Saga</a>
          <a className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary-fixed transition-colors cursor-pointer">Lore</a>
          <a className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary-fixed transition-colors cursor-pointer">Artifacts</a>
          <a className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary-fixed transition-colors cursor-pointer">Network</a>
        </nav>
        <div className="flex gap-4">
          <button className="font-label-caps text-label-caps px-6 py-2 border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-highest/50 transition-all scale-95 active:scale-90 hidden sm:block">
            Connect Identity
          </button>
          <button onClick={onEnter} className="font-label-caps text-label-caps px-6 py-2 bg-primary-container text-on-primary-container shadow-[0_0_15px_rgba(0,204,255,0.4)] hover:brightness-110 transition-all scale-95 active:scale-90 hidden sm:block">
            Enter Saga
          </button>
          {onClose && (
            <button onClick={onClose} className="font-label-caps text-label-caps px-4 py-2 border border-error/50 text-error hover:bg-error/10 transition-all scale-95 active:scale-90">
              Exit
            </button>
          )}
        </div>
      </header>

      {/* MAIN CANVAS (Hero & Content) */}
      <main className="flex-grow relative flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        {/* Background Hero Asset */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center scale-110 transition-transform duration-[10s] ease-out hover:scale-100" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBJ9I56G3oW9pftCZomPBbjx4gMo-FaGNKQeR9-54rpTTE_QKyLelI29q3ci1Q3EhBFkQxM2vwXcGxQ7Jw15IRTUTl5rJ-HoB8eZatLVeZUYvJBM5tV1c6ksyYvEecjnAJlOW3ISCtOjUU17ylDCYlolGIY7c0h-LyjixxSJX-NcbrRE4rMa6WHA0hSRHo39AtfpsHAg90b1vVR98DRhkicHhmNET9AA3q45rM1wGGyfTvkvkYXqjG-ElvWaV0QrdaZWG36n10berZw')" }}>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/40"></div>
          {/* Energy Overlay Effects */}
          <div className="absolute inset-0 pointer-events-none energy-pulse bg-gradient-to-br from-secondary-container/10 via-transparent to-primary-container/10"></div>
        </div>

        {/* HUD OVERLAY (Tactical Telemetry) */}
        <div className="absolute inset-0 pointer-events-none z-10 p-10 flex flex-col justify-between hidden md:flex">
          {/* Top Left Telemetry */}
          <div className="glass-panel-hud bg-white/5 backdrop-blur-xl border border-white/10 p-4 w-64 rounded-lg border-l-4 border-l-primary-container transition-transform duration-100 ease-out">
            <p className="font-label-caps text-label-caps text-primary-container mb-2">SYSTEM STATUS</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-technical-sm font-technical-sm text-on-surface-variant">Sync Rate:</span>
                <span className="text-technical-sm font-technical-sm text-primary">99.8%</span>
              </div>
              <div className="w-full bg-surface-container-high h-1 overflow-hidden">
                <div className="bg-primary h-full w-[99.8%]"></div>
              </div>
            </div>
          </div>

          {/* Top Right HUD */}
          <div className="absolute top-10 right-10 flex flex-col items-end">
            <div className="text-right glass-panel-hud bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-lg border-r-4 border-r-secondary transition-transform duration-100 ease-out">
              <p className="font-label-caps text-label-caps text-secondary mb-1">CURRENT RESONANCE</p>
              <p className="font-headline-lg text-headline-lg text-secondary shadow-secondary-container/50 drop-shadow-md">78%</p>
            </div>
          </div>

          {/* Bottom Left HUD */}
          <div className="glass-panel-hud bg-white/5 backdrop-blur-xl border border-white/10 p-4 w-72 rounded-lg border-l-4 border-l-tertiary-container transition-transform duration-100 ease-out">
            <p className="font-label-caps text-label-caps text-tertiary-container mb-3">MISSION OBJECTIVE</p>
            <div className="flex items-start gap-3">
              <Star className="text-tertiary-fixed-dim w-6 h-6 shrink-0 fill-current" />
              <div>
                <p className="text-technical-sm font-technical-sm text-on-surface">Encontrar la Manzana Dorada</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">EST. DURATION: 45 MIN</p>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER CONTENT (Hero Call to Action) */}
        <div className="relative z-20 container mx-auto px-margin-mobile md:px-margin-desktop flex flex-col items-center text-center">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-xl max-w-4xl">
            <div className="mb-4">
              <span className="font-label-caps text-label-caps text-secondary-fixed-dim tracking-[0.5em] px-4 py-1 border border-secondary-fixed-dim/30 rounded-full">TEMPORADA 1</span>
            </div>
            <div className="mb-8 flex justify-center energy-pulse">
              <img alt="MagnopVS Logo" className="h-24 w-auto object-contain drop-shadow-[0_0_20px_rgba(0,204,255,0.6)] filter brightness-110" src="https://lh3.googleusercontent.com/aida/AP1WRLtNINpOcI0W_K2L7pShOg7_2rqG2vpZZNzJlXk177xton8KtdneGONfuxfIGE0ByD3IW2ngQivgJ2_jChclN-sBGUJxZUMT_ETvwLdBCxohCjDJAGCYZuERgCMOyS8kXsJXEXY5x7EwPNKY5pl411Niu4lCQQeqqbjP1KgL3NvoX6-3ZbZxXOQijyfSceFZ3LKn96qUvC4OibZkZQHFt9Z3_grN0GanYrQgWW93hnS0LCiXa-ZTU8D3Mst0"/>
            </div>
            <h1 className="font-headline-lg text-headline-lg md:font-display-xl md:text-display-xl text-on-surface mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              Capítulo 1: El Rapto de Perséfone
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
              En el umbral del Inframundo, una decisión cambiará el destino de la Matrix. <br className="hidden md:block"/>
              <span className="text-primary-fixed-dim">¿Estás listo para descifrar el mito?</span>
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <button onClick={onEnter} className="group relative overflow-hidden font-label-caps text-label-caps px-12 py-5 bg-secondary-container text-on-secondary shadow-[0_0_30px_rgba(254,0,254,0.4)] transition-all hover:scale-105 active:scale-95 rounded-sm">
                <div className="scan-line-gold opacity-50 group-hover:opacity-100"></div>
                <span className="relative z-10 flex items-center gap-2">
                  ENTRAR AL CAPÍTULO
                  <ChevronsRight className="w-5 h-5" />
                </span>
              </button>
              <button className="font-label-caps text-label-caps px-10 py-5 border border-primary-container/40 text-primary-container hover:bg-primary-container/10 transition-all hover:scale-105 active:scale-95 rounded-sm flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                REVISAR ARCHIVO DE LORE
              </button>
            </div>
          </div>

          {/* Small HUD readout for Mobile */}
          <div className="mt-8 flex md:hidden gap-4 text-center">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-2 px-4 rounded">
              <p className="text-[8px] font-label-caps text-secondary">RESONANCE</p>
              <p className="font-technical-sm text-on-surface">78%</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-2 px-4 rounded">
              <p className="text-[8px] font-label-caps text-tertiary">MISSION</p>
              <p className="font-technical-sm text-on-surface">45min</p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-40">
          <span className="text-[8px] font-label-caps">DESCEND</span>
          <ChevronsDown className="w-6 h-6" />
        </div>
      </main>

      {/* FOOTER (Shared Component) */}
      <footer className="w-full py-8 px-margin-desktop flex flex-col md:flex-row justify-between items-center border-t border-outline-variant/20 bg-surface-container-lowest z-30">
        <div className="flex flex-col items-center md:items-start gap-2 mb-6 md:mb-0">
          <span className="font-headline-md text-on-surface font-display-xl text-lg tracking-widest">MagnopVS</span>
          <p className="font-label-caps text-label-caps text-on-surface-variant opacity-80">
            © 2024 MagnopVS. Transmedia Saga Protocol enabled.
          </p>
        </div>
        <div className="flex gap-8 items-center flex-wrap justify-center">
          <a className="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary-fixed-dim transition-colors cursor-pointer">Privacy Matrix</a>
          <a className="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary-fixed-dim transition-colors cursor-pointer">Terms of Path</a>
          <a className="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary-fixed-dim transition-colors cursor-pointer">Contact Curator</a>
        </div>
        
        <div className="flex gap-4 mt-6 md:mt-0">
          <button className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-primary transition-all">
            <Globe className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-primary transition-all">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
};
