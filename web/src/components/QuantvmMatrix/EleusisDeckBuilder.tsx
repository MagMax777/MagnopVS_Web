import React, { useState } from 'react';
import { Star, Shield, Eye, Settings, HelpCircle, Landmark, Award, Tornado, Sparkles as SparklesIcon, X, Wrench } from 'lucide-react';

interface EleusisDeckBuilderProps {
  onClose?: () => void;
  onNavigate?: (view: string) => void;
}

export const EleusisDeckBuilder: React.FC<EleusisDeckBuilderProps> = ({ onClose, onNavigate }) => {
  const [activeFaction, setActiveFaction] = useState('all');

  return (
    <div className="bg-background text-on-surface font-body-md overflow-x-hidden min-h-screen flex flex-col">
      {/* TopAppBar */}
      <header className="bg-background/80 backdrop-blur-xl font-headline-md text-headline-md font-label-caps text-label-caps docked full-width top-0 border-b border-outline-variant/30 shadow-[0_0_20px_rgba(0,219,233,0.1)] flex justify-between items-center px-margin-desktop py-4 w-full z-[100] fixed">
        <div className="flex items-center gap-gutter">
          <span className="font-display-xl text-headline-md tracking-widest text-primary-fixed-dim">MagnopVS</span>
          <nav className="hidden md:flex gap-8 ml-8">
            <a className="text-on-surface-variant hover:text-primary-fixed transition-colors font-label-caps text-label-caps cursor-pointer">Saga</a>
            <a className="text-primary-fixed-dim border-b-2 border-primary-fixed-dim pb-1 font-label-caps text-label-caps cursor-pointer">Lore</a>
            <a className="text-on-surface-variant hover:text-primary-fixed transition-colors font-label-caps text-label-caps cursor-pointer">Artifacts</a>
            <a className="text-on-surface-variant hover:text-primary-fixed transition-colors font-label-caps text-label-caps cursor-pointer">Network</a>
          </nav>
        </div>
        <div className="flex items-center gap-4 hidden md:flex">
          <button className="font-label-caps text-label-caps text-on-surface-variant border border-outline-variant/50 px-4 py-2 rounded-sm uppercase hover:bg-surface-container-highest/50 transition-all duration-300 scale-95 active:scale-90">Connect Identity</button>
          <button className="font-label-caps text-label-caps bg-primary-container text-on-primary-container px-6 py-2 rounded-sm uppercase hover:bg-surface-container-highest/50 transition-all duration-300 scale-95 active:scale-90 shadow-[0_0_15px_rgba(0,204,255,0.4)]">Enter Saga</button>
          {onClose && (
            <button onClick={onClose} className="px-4 py-2 border border-error/50 text-error hover:bg-error/10 transition-all scale-95 active:scale-90 rounded-sm font-label-caps text-label-caps">
              Exit
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 flex pt-[72px]">
        {/* SideNavBar (Hidden on Mobile) */}
        <aside className="hidden md:flex flex-col bg-surface-container-lowest/90 backdrop-blur-2xl text-secondary-fixed-dim font-label-caps text-label-caps font-data-mono text-data-mono h-[calc(100vh-72px)] w-64 border-r border-primary-container/20 shadow-[5px_0_15px_rgba(0,0,0,0.5)] fixed left-0 top-[72px] pt-8 pb-8 z-40">
          <div className="px-6 mb-12">
            <div className="w-12 h-12 rounded-full border border-primary-container/50 flex items-center justify-center mb-4 bg-surface-container-low">
              <img alt="Cosmic White Rabbit Sigil" className="w-8 h-8 rounded-full opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBub4TidtN9ZnYJwVdRp5TfkpFi6WD5n0Bv2DiDKTc4POy2TcIyo6HtXDyyJkg8eQmR-OcBxINRJoaEB5pmYiVRclofItPnzOzmPvgXTwMrF_cCGr4CQEzFRAVEb9DoPJEzl8myHrPUFNJy7fUD-2Q8Zy1U8yz0axNnt4bUvQyerUbApsFA4eREjN8ScUKcp0095zzzYgMdSoMY2T_YYs_vA5VRyXbgpxC078sbON-lWCg2LyR-ATKN3g"/>
            </div>
            <h2 className="font-headline-md text-secondary-fixed-dim text-headline-lg-mobile tracking-widest mb-1">ELEUSIS PATH</h2>
            <p className="text-on-surface-variant text-label-caps opacity-70">Quantum Initiation Protocol</p>
          </div>
          <nav className="flex-1 flex flex-col gap-2">
            <a onClick={() => onNavigate && onNavigate('dashboard')} className="flex items-center gap-4 px-6 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-tertiary-container transition-all group-hover:translate-x-1 duration-200 cursor-pointer">
              <Landmark className="w-5 h-5 text-[20px]" />
              <span>The Temple</span>
            </a>
            <a className="flex items-center gap-4 px-6 py-3 bg-primary-container/10 text-primary-fixed-dim border-r-4 border-primary-fixed-dim hover:text-tertiary-container transition-all group-hover:translate-x-1 duration-200 cursor-pointer">
              <Eye className="w-5 h-5 text-[20px]" />
              <span>Mysteries</span>
            </a>
            <a className="flex items-center gap-4 px-6 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-tertiary-container transition-all group-hover:translate-x-1 duration-200 cursor-pointer">
              <Award className="w-5 h-5 text-[20px]" />
              <span>Initiation</span>
            </a>
            <a className="flex items-center gap-4 px-6 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-tertiary-container transition-all group-hover:translate-x-1 duration-200 cursor-pointer">
              <Tornado className="w-5 h-5 text-[20px]" />
              <span>Transformation</span>
            </a>
            <a className="flex items-center gap-4 px-6 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-tertiary-container transition-all group-hover:translate-x-1 duration-200 cursor-pointer">
              <SparklesIcon className="w-5 h-5 text-[20px]" />
              <span>Ascension</span>
            </a>
          </nav>
          <div className="px-6 mt-auto">
            <button className="w-full py-3 border border-secondary-fixed-dim/50 text-secondary-fixed-dim rounded-sm font-label-caps text-label-caps uppercase hover:bg-secondary-fixed-dim/10 transition-colors mb-6 shadow-[0_0_10px_rgba(255,171,243,0.2)]">View Lore</button>
            <div className="flex flex-col gap-2 border-t border-outline-variant/20 pt-4">
              <a className="flex items-center gap-4 py-2 text-on-surface-variant hover:text-tertiary-container transition-all text-technical-sm cursor-pointer">
                <Settings className="w-4 h-4 text-[16px]" />
                <span>Settings</span>
              </a>
              <a className="flex items-center gap-4 py-2 text-on-surface-variant hover:text-tertiary-container transition-all text-technical-sm cursor-pointer">
                <HelpCircle className="w-4 h-4 text-[16px]" />
                <span>Support</span>
              </a>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 p-margin-mobile md:p-margin-desktop min-h-[calc(100vh-72px)] flex flex-col md:flex-row gap-gutter">
          {/* Left: Card Canvas & Filters */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Filters Bar */}
            <div className="glass-panel p-4 rounded-lg flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="font-label-caps text-label-caps text-on-surface-variant">FACTION:</span>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-sm border border-primary-fixed-dim text-primary-fixed-dim bg-primary-fixed-dim/10 font-label-caps text-label-caps uppercase flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5" /> Demetrios
                  </button>
                  <button className="px-3 py-1.5 rounded-sm border border-outline-variant text-on-surface-variant hover:border-secondary-fixed-dim hover:text-secondary-fixed-dim transition-colors font-label-caps text-label-caps uppercase flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5" /> Prognostics
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-label-caps text-label-caps text-on-surface-variant">RARITY:</span>
                <div className="flex gap-2 items-center">
                  <div className="w-6 h-6 opacity-50 hover:opacity-100 cursor-pointer transition-opacity bg-outline-variant rounded-full flex items-center justify-center text-[10px]">C</div>
                  <div className="w-6 h-6 opacity-100 cursor-pointer drop-shadow-[0_0_5px_rgba(94,212,255,0.8)] bg-primary-fixed-dim rounded-full flex items-center justify-center text-[10px] text-on-primary-fixed">R</div>
                  <div className="w-6 h-6 opacity-50 hover:opacity-100 cursor-pointer transition-opacity bg-secondary-fixed-dim rounded-full flex items-center justify-center text-[10px] text-on-secondary-fixed">E</div>
                  <div className="w-6 h-6 opacity-50 hover:opacity-100 cursor-pointer transition-opacity bg-tertiary-fixed-dim rounded-full flex items-center justify-center text-[10px] text-on-tertiary-fixed">L</div>
                </div>
              </div>
            </div>

            {/* Card Grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 overflow-y-auto custom-scrollbar pr-2 pb-8 pt-4">
              
              {/* Card 1 (Demetrios) */}
              <div className="card-container">
                <div className="holographic-card relative rounded-xl border border-primary-fixed-dim/30 bg-surface-container-low overflow-hidden aspect-[2.5/3.5] flex flex-col justify-between p-1">
                  <div className="absolute inset-0 z-0">
                    <img alt="The Great Mother Card" className="w-full h-full object-cover opacity-90" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCs9umBl8Rnro_CCwBlm9AtokrUx4HiokcPmZvhf1TF_-WgLcMkU6phkcQrXEoVRDHZJTXpfWPFHYGV5yKiPGAfcw9GDsb-pAOH-nh68yaUtqmrpQkC9C-MS33RJcrKVyQ4CSpac2PHEejQIzvnr51f9iJ6irnxODkxxY0KZ3rRPKNxLeyt6n-ZmXmbMs6cYkVatzy0297TMjbbIz5y48JHr8gEaaMNjj5fJ7RmPddGoPvV0kpdGtuP0Q"/>
                  </div>
                  <div className="relative z-10 flex justify-between items-start p-2">
                    <div className="bg-surface-container-highest/80 backdrop-blur-md border border-primary-fixed-dim/50 px-2 py-1 rounded-sm font-technical-sm text-technical-sm text-primary-fixed-dim uppercase">Cost: 4</div>
                    <Star className="w-4 h-4 text-tertiary-fixed drop-shadow-[0_0_5px_rgba(121,249,206,1)] fill-current" />
                  </div>
                  <div className="relative z-10 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/90 to-transparent p-4 pt-12">
                    <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-primary-fixed uppercase tracking-wider mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">The Great Mother</h3>
                    <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">UNIT • DEMETRIOS</p>
                    <p className="font-body-md text-technical-sm text-on-surface leading-snug">Harvest: +2 Resonance per turn. If Field of Grain is active, gain Shield.</p>
                  </div>
                </div>
              </div>

              {/* Card 2 (Prognostics) */}
              <div className="card-container">
                <div className="holographic-card relative rounded-xl border border-secondary-fixed-dim/30 bg-surface-container-low overflow-hidden aspect-[2.5/3.5] flex flex-col justify-between p-1 shadow-[0_0_15px_rgba(255,171,243,0.15)]">
                  <div className="absolute inset-0 z-0">
                    <img alt="The Lord of Shadows Card" className="w-full h-full object-cover opacity-90" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnoV6YiFBBZ1ahbFX_q3iaDHlHXVv_HuWRROSiPPwc2_1KcmHhs8TjcU3kmaMjOvkfVhR1OGWyWa3XHhlKBiPE-6JGWotBvcaoyDrsF9LIY8fX2QWYSsBrywpFADpRo6Rjyw8DrjXaC6HBh2Gj7J8S5AAQd0Y0FHw2hG_ye_eR2ssl6XtulLi_QnAhs6y1qzczcU05xcU_vNNiOSTYR6kHD0MvCHemMDOvrmuZZn23U3Q8UVJV0I8aCQ"/>
                  </div>
                  <div className="relative z-10 flex justify-between items-start p-2">
                    <div className="bg-surface-container-highest/80 backdrop-blur-md border border-secondary-fixed-dim/50 px-2 py-1 rounded-sm font-technical-sm text-technical-sm text-secondary-fixed-dim uppercase">Cost: 6</div>
                    <div className="flex">
                      <Star className="w-4 h-4 text-secondary-fixed drop-shadow-[0_0_5px_rgba(255,215,245,1)] fill-current" />
                      <Star className="w-4 h-4 text-secondary-fixed drop-shadow-[0_0_5px_rgba(255,215,245,1)] fill-current" />
                    </div>
                  </div>
                  <div className="relative z-10 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/90 to-transparent p-4 pt-12 border-t border-secondary-fixed-dim/20">
                    <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-secondary-fixed-dim uppercase tracking-wider mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Lord of Shadows</h3>
                    <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">HERO • PROGNOSTICS</p>
                    <p className="font-body-md text-technical-sm text-on-surface leading-snug">Eclipse: Target enemy unit loses all abilities until end of turn. Synergy: Void Prophecy.</p>
                  </div>
                </div>
              </div>

              {/* Card 3 (Demetrios Structure) */}
              <div className="card-container">
                <div className="holographic-card relative rounded-xl border border-tertiary-fixed-dim/30 bg-surface-container-low overflow-hidden aspect-[2.5/3.5] flex flex-col justify-between p-1">
                  <div className="absolute inset-0 z-0 bg-surface">
                    <img alt="Shield of Eleusis Card" className="w-full h-full object-cover opacity-60 mix-blend-screen scale-150 object-right" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCs9umBl8Rnro_CCwBlm9AtokrUx4HiokcPmZvhf1TF_-WgLcMkU6phkcQrXEoVRDHZJTXpfWPFHYGV5yKiPGAfcw9GDsb-pAOH-nh68yaUtqmrpQkC9C-MS33RJcrKVyQ4CSpac2PHEejQIzvnr51f9iJ6irnxODkxxY0KZ3rRPKNxLeyt6n-ZmXmbMs6cYkVatzy0297TMjbbIz5y48JHr8gEaaMNjj5fJ7RmPddGoPvV0kpdGtuP0Q"/>
                  </div>
                  <div className="relative z-10 flex justify-between items-start p-2">
                    <div className="bg-surface-container-highest/80 backdrop-blur-md border border-tertiary-fixed-dim/50 px-2 py-1 rounded-sm font-technical-sm text-technical-sm text-tertiary-fixed-dim uppercase">Cost: 3</div>
                  </div>
                  <div className="relative z-10 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/90 to-transparent p-4 pt-12">
                    <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-tertiary-fixed-dim uppercase tracking-wider mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Shield of Eleusis</h3>
                    <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">STRUCTURE • NEUTRAL</p>
                    <p className="font-body-md text-technical-sm text-on-surface leading-snug">Absorb next 5 incoming damage. Projects a barrier across adjacent slots.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right: Deck Configuration Panel */}
          <aside className="w-full md:w-80 flex flex-col gap-4">
            <div className="glass-panel p-6 rounded-xl flex-1 flex flex-col glow-border">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary-fixed-dim uppercase tracking-widest">Active Deck</h2>
                <span className="font-technical-sm text-technical-sm text-on-surface-variant border border-outline-variant rounded-full px-2 py-0.5">24/30</span>
              </div>
              
              {/* Tactical Slots */}
              <div className="flex-1 flex flex-col gap-3 custom-scrollbar overflow-y-auto pr-2 pb-4">
                
                <div className="bg-surface-container p-3 rounded-sm border border-outline-variant/30 flex items-center justify-between hover:border-primary-fixed-dim/50 transition-colors group cursor-pointer">
                  <div>
                    <h4 className="font-label-caps text-label-caps text-on-surface group-hover:text-primary-fixed transition-colors">The Great Mother</h4>
                    <span className="font-technical-sm text-[10px] text-on-surface-variant">Unit • Cost: 4</span>
                  </div>
                  <X className="w-4 h-4 text-outline-variant group-hover:text-error transition-colors" />
                </div>
                
                <div className="bg-surface-container p-3 rounded-sm border border-secondary-fixed-dim/30 flex items-center justify-between hover:border-secondary-fixed-dim transition-colors group cursor-pointer shadow-[inset_0_0_10px_rgba(255,171,243,0.05)]">
                  <div>
                    <h4 className="font-label-caps text-label-caps text-secondary-fixed-dim">Void Prophecy</h4>
                    <span className="font-technical-sm text-[10px] text-on-surface-variant">Spell • Cost: 2</span>
                  </div>
                  <X className="w-4 h-4 text-outline-variant group-hover:text-error transition-colors" />
                </div>
                
                <div className="bg-surface-container p-3 rounded-sm border border-outline-variant/30 flex items-center justify-between hover:border-primary-fixed-dim/50 transition-colors group cursor-pointer">
                  <div>
                    <h4 className="font-label-caps text-label-caps text-on-surface group-hover:text-primary-fixed transition-colors">Cereal Phoenix</h4>
                    <span className="font-technical-sm text-[10px] text-on-surface-variant">Creature • Cost: 5</span>
                  </div>
                  <X className="w-4 h-4 text-outline-variant group-hover:text-error transition-colors" />
                </div>
                
                {/* Empty Slots */}
                <div className="bg-surface-container-lowest/50 border border-dashed border-outline-variant/50 p-3 rounded-sm flex items-center justify-center opacity-50">
                  <span className="font-technical-sm text-technical-sm text-outline uppercase tracking-widest">+ Add Card</span>
                </div>
                <div className="bg-surface-container-lowest/50 border border-dashed border-outline-variant/50 p-3 rounded-sm flex items-center justify-center opacity-50">
                  <span className="font-technical-sm text-technical-sm text-outline uppercase tracking-widest">+ Add Card</span>
                </div>
              </div>
              
              {/* Synergy Meter */}
              <div className="mt-4 pt-4 border-t border-outline-variant/30 mb-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-label-caps text-label-caps text-on-surface-variant">Resonance Synergy</span>
                  <span className="font-technical-sm text-technical-sm text-tertiary-fixed">85%</span>
                </div>
                <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary-fixed-dim to-tertiary-fixed w-[85%] shadow-[0_0_10px_rgba(121,249,206,0.8)]"></div>
                </div>
              </div>
              
              {/* Action Button */}
              <button className="w-full bg-gradient-to-r from-primary-fixed-dim to-primary hover:from-primary hover:to-primary-fixed text-on-primary-fixed py-4 rounded-sm font-display-xl text-headline-lg-mobile uppercase tracking-widest shadow-[0_0_20px_rgba(94,212,255,0.4)] transition-all transform active:scale-95 flex items-center justify-center gap-3">
                <Wrench className="w-6 h-6 fill-current" />
                FORGE DECK
              </button>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
};
