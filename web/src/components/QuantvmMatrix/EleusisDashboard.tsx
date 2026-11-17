import React, { useEffect } from 'react';
import { Settings, HelpCircle, Landmark, Eye, Award, Tornado, Sparkles as SparklesIcon, Lock, BookOpen, Layers } from 'lucide-react';

interface EleusisDashboardProps {
  onNavigate?: (view: string) => void;
  onClose?: () => void;
}

export const EleusisDashboard: React.FC<EleusisDashboardProps> = ({ onClose, onNavigate }) => {
  useEffect(() => {
    // Atmospheric floating particles
    const main = document.getElementById('eleusis-dashboard-main');
    if (!main) return;
    
    const dots: HTMLDivElement[] = [];
    for (let i = 0; i < 20; i++) {
      const dot = document.createElement('div');
      dot.className = 'absolute bg-primary/20 rounded-full pointer-events-none floating';
      const size = Math.random() * 4 + 2;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.left = `${Math.random() * 100}%`;
      dot.style.top = `${Math.random() * 100}%`;
      dot.style.animationDelay = `${Math.random() * 5}s`;
      dot.style.animationDuration = `${Math.random() * 4 + 4}s`;
      main.appendChild(dot);
      dots.push(dot);
    }

    // Mouse trail interaction (Lightweight)
    const handleMouseMove = (e: MouseEvent) => {
      const glow = document.createElement('div');
      glow.className = 'fixed w-32 h-32 rounded-full pointer-events-none opacity-20 blur-3xl z-[9999]';
      glow.style.background = 'radial-gradient(circle, #00ccff 0%, transparent 70%)';
      glow.style.left = `${e.clientX - 64}px`;
      glow.style.top = `${e.clientY - 64}px`;
      document.body.appendChild(glow);
      setTimeout(() => {
        if(glow.parentNode) {
            glow.parentNode.removeChild(glow);
        }
      }, 500);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      dots.forEach(dot => {
        if (dot.parentNode) {
            dot.parentNode.removeChild(dot);
        }
      });
    };
  }, []);

  return (
    <div className="bg-background text-on-surface font-body-md overflow-x-hidden min-h-screen">
      {/* Top Navigation Anchor */}
      <header className="flex justify-between items-center px-margin-desktop py-4 w-full z-[100] fixed top-0 bg-background/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_0_20px_rgba(0,219,233,0.1)]">
        <div className="font-display-xl text-headline-md tracking-widest text-primary-fixed-dim">
          MagnopVS
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a onClick={() => onNavigate && onNavigate('dashboard')} className="font-label-caps text-label-caps text-primary-fixed-dim border-b-2 border-primary-fixed-dim pb-1 cursor-pointer">Saga</a>
          <a onClick={() => onNavigate && onNavigate('magzine')} className="font-label-caps text-label-caps text-[#15ffd1] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 font-bold">
            <BookOpen className="w-3.5 h-3.5" /> MagZine #07
          </a>
          <a onClick={() => onNavigate && onNavigate('lore')} className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary-fixed transition-colors cursor-pointer">Lore</a>
          <a onClick={() => onNavigate && onNavigate('artifacts')} className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary-fixed transition-colors cursor-pointer">Artifacts</a>
          <a onClick={() => onNavigate && onNavigate('network')} className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary-fixed transition-colors cursor-pointer">Network</a>
        </nav>
        <div className="flex gap-4">
          <button className="bg-surface-container-highest/50 border border-outline px-6 py-2 rounded-sm font-label-caps text-label-caps hover:bg-surface-container-high transition-all text-on-surface scale-95 active:scale-90">
            Connect Identity
          </button>
          <button onClick={() => onNavigate && onNavigate('magzine')} className="bg-primary-container text-on-primary-container px-6 py-2 rounded-sm font-label-caps text-label-caps energy-pulse scale-95 active:scale-90 transition-transform flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> MagZine
          </button>
          {onClose && (
            <button onClick={onClose} className="px-4 py-2 border border-error/50 text-error hover:bg-error/10 transition-all scale-95 active:scale-90 rounded-sm font-label-caps text-label-caps">
              Exit
            </button>
          )}
        </div>
      </header>

      {/* Side Navigation Shell */}
      <aside className="fixed left-0 top-0 h-full flex flex-col pt-24 pb-8 w-64 bg-surface-container-lowest/90 backdrop-blur-2xl border-r border-primary-container/20 shadow-[5px_0_15px_rgba(0,0,0,0.5)] z-50">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-secondary bg-surface-container-high flex items-center justify-center overflow-hidden shrink-0">
               {/* Simplified profile icon via initials or simple svg as Material Symbols aren't perfectly aligned here */}
               <span className="text-secondary font-audiowide text-lg leading-none mt-1">P</span>
            </div>
            <div>
              <div className="relative group">
                <img alt="Eleusis Path Logo" className="h-6 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,171,243,0.6)] transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(255,171,243,0.8)]" src="https://lh3.googleusercontent.com/aida/AP1WRLtNINpOcI0W_K2L7pShOg7_2rqG2vpZZNzJlXk177xton8KtdneGONfuxfIGE0ByD3IW2ngQivgJ2_jChclN-sBGUJxZUMT_ETvwLdBCxohCjDJAGCYZuERgCMOyS8kXsJXEXY5x7EwPNKY5pl411Niu4lCQQeqqbjP1KgL3NvoX6-3ZbZxXOQijyfSceFZ3LKn96qUvC4OibZkZQHFt9Z3_grN0GanYrQgWW93hnS0LCiXa-ZTU8D3Mst0"/>
              </div>
              <p className="font-technical-sm text-on-surface-variant text-[9px] mt-1">Quantum Initiation Protocol</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 flex flex-col">
          <a onClick={() => onNavigate && onNavigate('dashboard')} className="flex items-center px-6 py-4 bg-primary-container/10 text-primary-fixed-dim border-r-4 border-primary-fixed-dim group cursor-pointer">
            <Landmark className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform duration-200" />
            <span className="font-label-caps text-label-caps">The Temple</span>
          </a>
          <a onClick={() => onNavigate && onNavigate('magzine')} className="flex items-center px-6 py-4 text-[#15ffd1] hover:bg-surface-container-high transition-all group cursor-pointer border-l-2 border-[#15ffd1]/40">
            <BookOpen className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform duration-200" />
            <span className="font-label-caps text-label-caps">MagZine #07</span>
          </a>
          <a onClick={() => onNavigate && onNavigate('deck-builder')} className="flex items-center px-6 py-4 text-on-surface-variant hover:bg-surface-container-high hover:text-tertiary-container transition-all group cursor-pointer">
            <Layers className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform duration-200" />
            <span className="font-label-caps text-label-caps">Baraja Táctica</span>
          </a>
          <a onClick={() => onNavigate && onNavigate('mysteries')} className="flex items-center px-6 py-4 text-on-surface-variant hover:bg-surface-container-high hover:text-tertiary-container transition-all group cursor-pointer">
            <Eye className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform duration-200" />
            <span className="font-label-caps text-label-caps">Mysteries</span>
          </a>
          <a onClick={() => onNavigate && onNavigate('initiation')} className="flex items-center px-6 py-4 text-on-surface-variant hover:bg-surface-container-high hover:text-tertiary-container transition-all group cursor-pointer">
            <Award className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform duration-200" />
            <span className="font-label-caps text-label-caps">Initiation</span>
          </a>
          <a onClick={() => onNavigate && onNavigate('transformation')} className="flex items-center px-6 py-4 text-on-surface-variant hover:bg-surface-container-high hover:text-tertiary-container transition-all group cursor-pointer">
            <Tornado className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform duration-200" />
            <span className="font-label-caps text-label-caps">Transformation</span>
          </a>
          <a onClick={() => onNavigate && onNavigate('ascension')} className="flex items-center px-6 py-4 text-on-surface-variant hover:bg-surface-container-high hover:text-tertiary-container transition-all group cursor-pointer">
            <SparklesIcon className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform duration-200" />
            <span className="font-label-caps text-label-caps">Ascension</span>
          </a>
        </nav>
        
        <div className="px-6 pt-6 border-t border-outline-variant/20">
          <button className="w-full bg-secondary-fixed-dim/20 border border-secondary-fixed-dim text-secondary-fixed-dim py-3 rounded-sm font-label-caps text-label-caps hover:bg-secondary-fixed-dim/30 transition-all">
            View Lore
          </button>
          <div className="mt-4 flex flex-col gap-2">
            <a className="flex items-center text-on-surface-variant text-[10px] uppercase font-bold hover:text-primary transition-colors cursor-pointer">
              <Settings className="w-4 h-4 mr-2" /> Settings
            </a>
            <a className="flex items-center text-on-surface-variant text-[10px] uppercase font-bold hover:text-primary transition-colors cursor-pointer">
              <HelpCircle className="w-4 h-4 mr-2" /> Support
            </a>
          </div>
        </div>
      </aside>

      {/* Main Canvas */}
      <main id="eleusis-dashboard-main" className="ml-0 md:ml-64 min-h-screen relative pt-24 pb-16 overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0 z-0">
          <img alt="Background" className="w-full h-full object-cover opacity-60 mix-blend-screen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDl1Bzkh4D_iZqk8kZbFjFOOvQdd7o0Xy-PjdC-JhO4JPaH_8ORj0qJq1TAq2Oa46war3R-8WDCXTBpp8SbAgFh4y2hlKcz7V-zCrQUcmOBS5aWqRWBNvIJ7UsdiM0eVFGjUW1E9vHY_HcB-epaWua_csQosP7zhh0TyiWD0IpGzcwThwio1nTrYTi3N6QXwIvt4xIdodA5bthNNV1GrCHUpsq0bhwjVePbzAnH8eXx3Y7EAgo0E4mU1VsfwYxYwsFyRg1UquUrGclv"/>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto h-full grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* Hero Content */}
          <section className="col-span-1 md:col-span-12 lg:col-span-7 flex flex-col justify-center py-10 md:py-20">
            <div className="mb-4 inline-flex items-center bg-primary-container/10 border border-primary-container/30 px-3 py-1 rounded-full w-fit">
              <span className="text-primary font-technical-sm text-technical-sm">PRECISION PROTOCOL // 001</span>
            </div>
            <h2 className="font-label-caps text-label-caps tracking-[0.5em] text-secondary-fixed-dim mb-2">ENTER THE PATH. ASCEND THE MYSTERY.</h2>
            <div className="mb-6 relative">
              <img alt="Eleusis Path" className="h-24 md:h-32 w-auto object-contain drop-shadow-[0_0_15px_rgba(0,204,255,0.8)] animate-pulse" src="https://lh3.googleusercontent.com/aida/AP1WRLtNINpOcI0W_K2L7pShOg7_2rqG2vpZZNzJlXk177xton8KtdneGONfuxfIGE0ByD3IW2ngQivgJ2_jChclN-sBGUJxZUMT_ETvwLdBCxohCjDJAGCYZuERgCMOyS8kXsJXEXY5x7EwPNKY5pl411Niu4lCQQeqqbjP1KgL3NvoX6-3ZbZxXOQijyfSceFZ3LKn96qUvC4OibZkZQHFt9Z3_grN0GanYrQgWW93hnS0LCiXa-ZTU8D3Mst0"/>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mb-10 leading-relaxed">
              Welcome to the initiation protocol of the Golden Apple. Explore the convergence of ancient Greek mythology and quantum reality. Hades awaits in the abyss, while Persephone blooms in the void.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => onNavigate && onNavigate('magzine')} className="bg-[#00dbe9] text-[#002018] font-label-caps text-label-caps px-8 py-5 rounded-sm energy-pulse hover:scale-105 transition-transform duration-300 font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> LEER MAGZINE ELEUSIS (#07)
              </button>
              <button onClick={() => onNavigate && onNavigate('deck-builder')} className="border border-outline font-label-caps text-label-caps px-8 py-5 rounded-sm hover:bg-white/5 transition-colors backdrop-blur-md">
                BARAJA TÁCTICA
              </button>
              <button onClick={() => onNavigate && onNavigate('mysteries')} className="border border-[#ffabf3]/40 text-[#ffabf3] font-label-caps text-label-caps px-8 py-5 rounded-sm hover:bg-[#ffabf3]/10 transition-colors backdrop-blur-md">
                MISTERIOS
              </button>
            </div>
          </section>
          
          {/* Tactical Widgets Column */}
          <section className="col-span-1 md:col-span-12 lg:col-span-5 flex flex-col gap-6 py-10 md:py-20">
            {/* Saga Status Widget */}
            <div className="glass-panel p-6 rounded-lg relative overflow-hidden bg-[rgba(14,14,14,0.6)] backdrop-blur-[20px] border border-white/5 border-t-white/15">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                 {/* Decorative icon */}
                 <svg className="w-[60px] h-[60px] text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0 1 9-9"/></svg>
              </div>
              <h3 className="font-label-caps text-label-caps text-primary-fixed mb-6 flex items-center">
                <svg className="w-[14px] h-[14px] mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> Saga Status
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-on-surface-variant font-technical-sm text-technical-sm mb-1 uppercase">Season</div>
                  <div className="text-2xl font-headline-lg text-white">01</div>
                </div>
                <div className="text-center border-x border-outline-variant/30">
                  <div className="text-on-surface-variant font-technical-sm text-technical-sm mb-1 uppercase">Chapter</div>
                  <div className="text-2xl font-headline-lg text-white">01</div>
                </div>
                <div className="text-center">
                  <div className="text-on-surface-variant font-technical-sm text-technical-sm mb-1 uppercase">Resonance</div>
                  <div className="text-2xl font-headline-lg text-primary-fixed-dim">78%</div>
                </div>
              </div>
              <div className="mt-6 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary-container to-secondary-container w-[78%]"></div>
              </div>
            </div>
            
            {/* Mystery Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-panel bg-[rgba(14,14,14,0.6)] backdrop-blur-[20px] border border-white/5 border-t-white/15 p-4 rounded-lg flex flex-col items-center justify-center text-center hover:bg-primary-container/5 cursor-pointer transition-all border-b-2 hover:border-primary-container">
                <Award className="w-6 h-6 text-primary-fixed-dim mb-2" />
                <span className="font-label-caps text-[9px] text-on-surface-variant">Initiation</span>
              </div>
              <div className="glass-panel bg-[rgba(14,14,14,0.6)] backdrop-blur-[20px] border border-white/5 border-t-white/15 p-4 rounded-lg flex flex-col items-center justify-center text-center hover:bg-secondary-container/5 cursor-pointer transition-all border-b-2 hover:border-secondary-container">
                <Tornado className="w-6 h-6 text-secondary mb-2" />
                <span className="font-label-caps text-[9px] text-on-surface-variant">Transformation</span>
              </div>
              <div className="glass-panel bg-[rgba(14,14,14,0.6)] backdrop-blur-[20px] border border-white/5 border-t-white/15 p-4 rounded-lg flex flex-col items-center justify-center text-center hover:bg-tertiary-container/5 cursor-pointer transition-all border-b-2 hover:border-tertiary-container">
                <SparklesIcon className="w-6 h-6 text-tertiary mb-2" />
                <span className="font-label-caps text-[9px] text-on-surface-variant">Ascension</span>
              </div>
            </div>
            
            {/* Active Nodes Panel */}
            <div className="glass-panel bg-[rgba(14,14,14,0.6)] backdrop-blur-[20px] border border-white/5 border-t-white/15 p-6 rounded-lg flex-1">
              <h3 className="font-label-caps text-label-caps text-secondary-fixed-dim mb-4 flex items-center justify-between">
                <div className="flex items-center">
                   <svg className="w-[14px] h-[14px] mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19 12h3M2 12h3M12 2v3M12 19v3"/></svg> Active Nodes
                </div>
                <span className="text-[8px] animate-pulse text-error">LIVE SIGNAL</span>
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center justify-between p-3 bg-surface-container-highest/30 rounded border-l-2 border-primary-container">
                  <div className="flex flex-col">
                    <span className="font-technical-sm text-technical-sm text-white">Underworld Gateway</span>
                    <span className="text-[9px] text-on-surface-variant uppercase">Sector A-9</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-primary-container shadow-[0_0_8px_#00ccff]"></div>
                </li>
                <li className="flex items-center justify-between p-3 bg-surface-container-highest/30 rounded border-l-2 border-secondary">
                  <div className="flex flex-col">
                    <span className="font-technical-sm text-technical-sm text-white">Persephone's Garden</span>
                    <span className="text-[9px] text-on-surface-variant uppercase">Bio-Loom</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#fe00fe]"></div>
                </li>
                <li className="flex items-center justify-between p-3 bg-surface-container-highest/30 rounded border-l-2 border-outline opacity-50">
                  <div className="flex flex-col">
                    <span className="font-technical-sm text-technical-sm text-white">The Void Throne</span>
                    <span className="text-[9px] text-on-surface-variant uppercase">Locked</span>
                  </div>
                  <Lock className="w-4 h-4 text-on-surface-variant" />
                </li>
              </ul>
            </div>
          </section>
        </div>
        
        {/* Atmospheric HUD Elements */}
        <div className="fixed bottom-10 right-10 z-50 pointer-events-none hidden md:block">
          <div className="relative w-48 h-48 border border-primary/20 rounded-full flex items-center justify-center">
            <div className="absolute inset-0 border-t-2 border-primary/40 rounded-full animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute inset-4 border-b border-secondary/30 rounded-full animate-[spin_7s_linear_infinite_reverse]"></div>
            <div className="text-center opacity-40">
              <div className="font-label-caps text-[8px]">QUANTUM LATENCY</div>
              <div className="font-technical-sm text-technical-sm text-primary">0.024ms</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="ml-0 md:ml-64 w-full py-8 px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center border-t border-outline-variant/20 bg-surface-container-lowest font-label-caps text-label-caps text-on-surface-variant gap-4 relative z-50">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="font-headline-md text-on-surface text-[14px]">MagnopVS</div>
          <div className="hidden md:block w-px h-4 bg-outline-variant/40"></div>
          <span className="opacity-60">© 2024 MagnopVS. Transmedia Saga Protocol enabled.</span>
        </div>
        <div className="flex gap-4 md:gap-8 flex-wrap justify-center">
          <a className="hover:text-secondary-fixed-dim transition-colors transition-all opacity-80 hover:opacity-100 cursor-pointer">Privacy Matrix</a>
          <a className="hover:text-secondary-fixed-dim transition-colors transition-all opacity-80 hover:opacity-100 cursor-pointer">Terms of Path</a>
          <a className="hover:text-secondary-fixed-dim transition-colors transition-all opacity-80 hover:opacity-100 cursor-pointer">Contact Curator</a>
        </div>
      </footer>
    </div>
  );
};
