import React, { useEffect } from 'react';
import { Settings, HelpCircle, Landmark, Eye, Award, Tornado, Sparkles as SparklesIcon, BookOpen } from 'lucide-react';

interface EleusisGenericFrameProps {
  onClose?: () => void;
  onNavigate?: (view: string) => void;
  activeView: string;
  title: string;
  children: React.ReactNode;
}

export const EleusisGenericFrame: React.FC<EleusisGenericFrameProps> = ({ 
  onClose, 
  onNavigate, 
  activeView, 
  title, 
  children 
}) => {
  return (
    <div className="bg-background text-on-surface font-body-md overflow-x-hidden min-h-screen">
      {/* Top Navigation Anchor */}
      <header className="flex justify-between items-center px-margin-desktop py-4 w-full z-[100] fixed top-0 bg-background/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_0_20px_rgba(0,219,233,0.1)]">
        <div className="flex items-center gap-6">
          <span className="font-display-xl text-headline-md tracking-widest text-primary-fixed-dim cursor-pointer" onClick={() => onNavigate && onNavigate('dashboard')}>
            MagnopVS
          </span>
          <nav className="hidden md:flex items-center gap-8 ml-8">
            <a onClick={() => onNavigate && onNavigate('dashboard')} className={`font-label-caps text-label-caps cursor-pointer transition-colors ${['dashboard', 'deck-builder', 'mysteries', 'initiation', 'transformation', 'ascension'].includes(activeView) ? 'text-primary-fixed-dim border-b-2 border-primary-fixed-dim pb-1' : 'text-on-surface-variant hover:text-primary-fixed'}`}>Saga</a>
            <a onClick={() => onNavigate && onNavigate('magzine')} className={`font-label-caps text-label-caps cursor-pointer transition-colors flex items-center gap-1.5 ${activeView === 'magzine' ? 'text-primary-fixed-dim border-b-2 border-primary-fixed-dim pb-1' : 'text-[#15ffd1] hover:text-white'}`}>
              <BookOpen className="w-3.5 h-3.5" /> MagZine
            </a>
            <a onClick={() => onNavigate && onNavigate('lore')} className={`font-label-caps text-label-caps cursor-pointer transition-colors ${activeView === 'lore' ? 'text-primary-fixed-dim border-b-2 border-primary-fixed-dim pb-1' : 'text-on-surface-variant hover:text-primary-fixed'}`}>Lore</a>
            <a onClick={() => onNavigate && onNavigate('artifacts')} className={`font-label-caps text-label-caps cursor-pointer transition-colors ${activeView === 'artifacts' ? 'text-primary-fixed-dim border-b-2 border-primary-fixed-dim pb-1' : 'text-on-surface-variant hover:text-primary-fixed'}`}>Artifacts</a>
            <a onClick={() => onNavigate && onNavigate('network')} className={`font-label-caps text-label-caps cursor-pointer transition-colors ${activeView === 'network' ? 'text-primary-fixed-dim border-b-2 border-primary-fixed-dim pb-1' : 'text-on-surface-variant hover:text-primary-fixed'}`}>Network</a>
          </nav>
        </div>
        <div className="flex gap-4">
          <button className="bg-surface-container-highest/50 border border-outline px-6 py-2 rounded-sm font-label-caps text-label-caps hover:bg-surface-container-high transition-all text-on-surface scale-95 active:scale-90 hidden sm:block">
            Connect Identity
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
               <span className="text-secondary font-audiowide text-lg leading-none mt-1">P</span>
            </div>
            <div>
              <div className="relative group cursor-pointer" onClick={() => onNavigate && onNavigate('dashboard')}>
                <img alt="Eleusis Path Logo" className="h-6 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,171,243,0.6)] transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(255,171,243,0.8)]" src="https://lh3.googleusercontent.com/aida/AP1WRLtNINpOcI0W_K2L7pShOg7_2rqG2vpZZNzJlXk177xton8KtdneGONfuxfIGE0ByD3IW2ngQivgJ2_jChclN-sBGUJxZUMT_ETvwLdBCxohCjDJAGCYZuERgCMOyS8kXsJXEXY5x7EwPNKY5pl411Niu4lCQQeqqbjP1KgL3NvoX6-3ZbZxXOQijyfSceFZ3LKn96qUvC4OibZkZQHFt9Z3_grN0GanYrQgWW93hnS0LCiXa-ZTU8D3Mst0"/>
              </div>
              <p className="font-technical-sm text-on-surface-variant text-[9px] mt-1">Quantum Initiation Protocol</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 flex flex-col">
          <a onClick={() => onNavigate && onNavigate('dashboard')} className={`flex items-center px-6 py-4 group cursor-pointer transition-all ${activeView === 'dashboard' ? 'bg-primary-container/10 text-primary-fixed-dim border-r-4 border-primary-fixed-dim' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-tertiary-container'}`}>
            <Landmark className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform duration-200" />
            <span className="font-label-caps text-label-caps">The Temple</span>
          </a>
          <a onClick={() => onNavigate && onNavigate('magzine')} className={`flex items-center px-6 py-4 group cursor-pointer transition-all ${activeView === 'magzine' ? 'bg-primary-container/10 text-primary-fixed-dim border-r-4 border-primary-fixed-dim' : 'text-[#15ffd1] hover:bg-surface-container-high border-l-2 border-[#15ffd1]/40'}`}>
            <BookOpen className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform duration-200" />
            <span className="font-label-caps text-label-caps">MagZine #07</span>
          </a>
          <a onClick={() => onNavigate && onNavigate('mysteries')} className={`flex items-center px-6 py-4 group cursor-pointer transition-all ${activeView === 'mysteries' ? 'bg-primary-container/10 text-primary-fixed-dim border-r-4 border-primary-fixed-dim' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-tertiary-container'}`}>
            <Eye className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform duration-200" />
            <span className="font-label-caps text-label-caps">Mysteries</span>
          </a>
          <a onClick={() => onNavigate && onNavigate('initiation')} className={`flex items-center px-6 py-4 group cursor-pointer transition-all ${activeView === 'initiation' ? 'bg-primary-container/10 text-primary-fixed-dim border-r-4 border-primary-fixed-dim' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-tertiary-container'}`}>
            <Award className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform duration-200" />
            <span className="font-label-caps text-label-caps">Initiation</span>
          </a>
          <a onClick={() => onNavigate && onNavigate('transformation')} className={`flex items-center px-6 py-4 group cursor-pointer transition-all ${activeView === 'transformation' ? 'bg-primary-container/10 text-primary-fixed-dim border-r-4 border-primary-fixed-dim' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-tertiary-container'}`}>
            <Tornado className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform duration-200" />
            <span className="font-label-caps text-label-caps">Transformation</span>
          </a>
          <a onClick={() => onNavigate && onNavigate('ascension')} className={`flex items-center px-6 py-4 group cursor-pointer transition-all ${activeView === 'ascension' ? 'bg-primary-container/10 text-primary-fixed-dim border-r-4 border-primary-fixed-dim' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-tertiary-container'}`}>
            <SparklesIcon className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform duration-200" />
            <span className="font-label-caps text-label-caps">Ascension</span>
          </a>
        </nav>
        
        <div className="px-6 pt-6 border-t border-outline-variant/20">
          <button onClick={() => onNavigate && onNavigate('lore')} className="w-full bg-secondary-fixed-dim/20 border border-secondary-fixed-dim text-secondary-fixed-dim py-3 rounded-sm font-label-caps text-label-caps uppercase hover:bg-secondary-fixed-dim/30 transition-all mb-6 shadow-[0_0_10px_rgba(255,171,243,0.2)]">
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

      {/* Main Content Area */}
      <main className="ml-0 md:ml-64 min-h-screen relative pt-24 pb-16 overflow-x-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0 opacity-40">
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-container/10 via-background to-background"></div>
        </div>
        
        <div className="relative z-10 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto h-full">
          <div className="mb-8">
            <h1 className="font-headline-lg text-3xl md:text-4xl text-primary-fixed-dim uppercase tracking-widest">{title}</h1>
            <div className="h-1 w-24 bg-gradient-to-r from-primary-fixed-dim to-transparent mt-2"></div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
};
