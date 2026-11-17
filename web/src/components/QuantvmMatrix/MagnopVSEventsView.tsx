import React, { useEffect, useState } from 'react';
import { Shield, Sparkles, Flame, Zap, RefreshCw, Award, Lock } from 'lucide-react';

interface Props {
  onClose?: () => void;
}

export const MagnopVSEventsView: React.FC<Props> = ({ onClose }) => {
  const [latency, setLatency] = useState('0.04');

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency((0.03 + Math.random() * 0.02).toFixed(2));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#131313] text-[#e5e2e1] selection:bg-[#a7c8ff] selection:text-[#003061] overflow-x-hidden min-h-screen relative font-orbitron">
      {/* Background SVG Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9l11-6.35 11 6.35v12.7l-11 6.35L3 30.6V17.9z' fill='%23a7c8ff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-[64px] h-16 bg-[#131313]/80 backdrop-blur-xl border-b border-[#a7c8ff]/30 shadow-[0_0_15px_rgba(167,200,255,0.2)]">
        <div className="flex items-center gap-8">
          <h1 className="font-audiowide text-[32px] leading-[1.2] text-[#a7c8ff] tracking-tighter cursor-pointer" onClick={onClose}>MagnopVS</h1>
          <nav className="hidden md:flex gap-6">
            <a className="text-[12px] font-black tracking-[0.2em] text-[#a7c8ff] border-b-2 border-[#a7c8ff] pb-1 hover:text-[#ffffff] hover:drop-shadow-[0_0_8px_rgba(21,255,209,0.5)] transition-all duration-300 uppercase cursor-pointer">Eras</a>
            <a className="text-[12px] font-black tracking-[0.2em] text-[#c0c6d5] hover:text-[#ffffff] hover:drop-shadow-[0_0_8px_rgba(21,255,209,0.5)] transition-all duration-300 uppercase cursor-pointer">Research</a>
            <a className="text-[12px] font-black tracking-[0.2em] text-[#c0c6d5] hover:text-[#ffffff] hover:drop-shadow-[0_0_8px_rgba(21,255,209,0.5)] transition-all duration-300 uppercase cursor-pointer">Archives</a>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black tracking-[0.2em] text-[#a7c8ff]/60 uppercase">MAGNOPOINTS</span>
            <span className="text-[18px] font-bold tracking-[0.1em] text-[#a7c8ff] drop-shadow-[0_0_5px_rgba(167,200,255,0.5)]">12.5k</span>
          </div>
          <div className="flex flex-col items-end border-l border-[#a7c8ff]/20 pl-6">
            <span className="text-[10px] font-black tracking-[0.2em] text-[#ffabf3]/60 uppercase">RESONANCE</span>
            <span className="text-[18px] font-bold tracking-[0.1em] text-[#ffabf3] drop-shadow-[0_0_5px_rgba(255,171,243,0.5)]">88%</span>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-[#a7c8ff] overflow-hidden ml-4">
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCe595tgkiwfD3NePhNmQH0qWoGaJeLD81X772DBJxUqFDUgtAG8d-kkb1GLfjo3min8Tst_1MF5QDNF5j7D18N9junYULumDyXGGBlLigJ2wjXkH7YmbkNvBFL1gMifV_x43hry5gNFQMNxHiowB4DkwbiwuYNlvJ0NHTIsL1RidNZDK0ipmw6BFQWDGm17fgqDgKvkZnjgtsEGfU-2NdlI4qCAEPlnVURR590nPQBm-_jx-WWvD9btxO-aFZYpOLVtAZ4BTxUugwe" alt="Commander Avatar"/>
          </div>
        </div>
      </header>
      
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] z-40 flex flex-col bg-[#1c1b1b]/60 backdrop-blur-2xl border-r border-[#a7c8ff]/20 w-16 md:w-64 transition-all duration-300">
        <div className="p-6 border-b border-[#a7c8ff]/10 hidden md:block">
          <h2 className="font-audiowide text-[24px] text-[#ffffff]">Tactical Paths</h2>
          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[#c0c6d5] mt-1">Event Filtering</p>
        </div>
        <nav className="flex-1 py-4">
          <a className="group flex items-center px-4 py-4 gap-4 bg-[#a7c8ff]/10 text-[#a7c8ff] border-r-4 border-[#a7c8ff] transition-all duration-200 cursor-pointer">
            <Shield className="w-6 h-6" />
            <span className="hidden md:block text-[12px] font-black tracking-[0.2em] uppercase">Logos</span>
          </a>
          <a className="group flex items-center px-4 py-4 gap-4 text-[#c0c6d5] hover:bg-[#393939]/20 hover:text-[#e5e2e1] transition-all duration-200 cursor-pointer">
            <Sparkles className="w-6 h-6" />
            <span className="hidden md:block text-[12px] font-black tracking-[0.2em] uppercase">Mythos</span>
          </a>
          <a className="group flex items-center px-4 py-4 gap-4 text-[#c0c6d5] hover:bg-[#393939]/20 hover:text-[#e5e2e1] transition-all duration-200 cursor-pointer">
            <Flame className="w-6 h-6" />
            <span className="hidden md:block text-[12px] font-black tracking-[0.2em] uppercase">Chaos</span>
          </a>
          <a className="group flex items-center px-4 py-4 gap-4 text-[#c0c6d5] hover:bg-[#393939]/20 hover:text-[#e5e2e1] transition-all duration-200 cursor-pointer">
            <Zap className="w-6 h-6" />
            <span className="hidden md:block text-[12px] font-black tracking-[0.2em] uppercase">Synthesis</span>
          </a>
        </nav>
        <div className="p-4 mt-auto">
          <button className="w-full py-3 bg-[#a7c8ff] text-[#003061] text-[12px] font-black tracking-[0.2em] uppercase hover:brightness-125 transition-all active:scale-95 hidden md:block">
            Synchronize
          </button>
          <button className="w-full py-3 text-[#a7c8ff] flex justify-center md:hidden">
            <RefreshCw className="w-6 h-6" />
          </button>
        </div>
      </aside>
      
      {/* Main Content Canvas */}
      <main className="ml-16 md:ml-64 pt-16 min-h-screen pb-20 px-4 md:px-8 relative z-10">
        
        {/* Hero Section */}
        <section className="mt-8 relative w-full h-[614px] rounded-xl overflow-hidden border border-[#a7c8ff]/30 shadow-[0_0_8px_rgba(167,200,255,0.2)] group">
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
            style={{backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBEzpbj8Er1coNLDgSMylHcT3GLa-t6MxbqX6tgSeFrhKf6RRhyAIAHcuOQYs6yUhUtnT5Bwhh7m9n5KQdwjKH6dsw4OScnpyxhqaL9OJ_wvYk_sZatlbN73tuo1mqXQPCR7G3yi2vyYJ_wtyd-z6IixQIi8Z19WQBjJI7HLpuQad-GprSxq9Y2R0kBis36e4q_xVDK5Zww-RM1YoYL7AQ_ObtrkQOzm-cUSXEtStGlLvbasC-v_L1VZEIFuiK1hZn-e0ma6nnnNKNI')`}}>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent opacity-90"></div>
          <div className="absolute bottom-12 left-12 right-12 z-10 flex flex-col items-start gap-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#ffabf3]/20 border border-[#ffabf3] text-[#ffabf3] text-[10px] font-black uppercase tracking-[0.2em] animate-pulse-glow">Pre-Sale Active</span>
              <span className="text-[12px] font-black uppercase tracking-[0.2em] text-[#e5e2e1]/60">AUGUST 2026</span>
            </div>
            <h2 className="font-audiowide text-[64px] text-[#ffffff] leading-[1.1] uppercase max-w-2xl">
              Eleusis Path:<br/><span className="text-[#a7c8ff]">Season 1</span>
            </h2>
            <div className="flex gap-4 mt-4">
              <button className="px-8 py-4 bg-[#a7c8ff] text-[#003061] text-[12px] font-black uppercase tracking-[0.2em] hover:shadow-[0_0_20px_rgba(167,200,255,0.6)] transition-all cursor-pointer">ENTER GATEWAY</button>
              <button className="px-8 py-4 bg-[#131313]/70 backdrop-blur-xl border border-white/20 text-white text-[12px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all cursor-pointer">MANIFESTO</button>
            </div>
          </div>
          <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[#ffabf3] to-transparent opacity-30 animate-[scan_4s_linear_infinite]" style={{top: 0}}></div>
        </section>
        
        {/* Event Grid */}
        <section className="mt-12 mb-12">
          <div className="flex items-baseline justify-between mb-8 border-l-4 border-[#ffabf3] pl-4">
            <h3 className="font-audiowide text-[24px] text-[#ffffff] uppercase tracking-tight">Active Events</h3>
            <a className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ffabf3] hover:underline cursor-pointer">View Global Schedule</a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: MagnoBall Finals */}
            <div className="relative group h-[400px] rounded-lg overflow-hidden border border-[#a7c8ff]/30 shadow-[0_0_8px_rgba(167,200,255,0.2)] flex flex-col bg-[#201f1f]">
              <div className="h-1/2 relative">
                <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuJjyVD_lcPJy6PwqPDAvxMvLjfsvo0RPVpIj9mMKR82GtQNYaxEh-RasG8_qJOS_hK7EPK-dTgJ5DQa5qOfetf5_rQ4giJ4yhpBqS4gg7FNC_BTg720aQzVRQRavEcOx3P9ZqSJbMBjFLUEN3GV3izobqQaDeBhhPf-N1IyJj5xESAT_2cdtac4OeoWm-4HstvsoTayrU5jQa_N2DYuz2nBRjgcdyICL0uZJW8rohbu9b6hJ7sbEAywvrih512qENO2bbffbQxpiY" 
                  alt="MagnoBall Finals" />
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#ffb4ab]/80 backdrop-blur px-2 py-1 rounded">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#690005]">LIVE STREAMING</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-audiowide text-[24px] text-[#ffffff]">MagnoBall Finals</h4>
                  <p className="text-[14px] text-[#c0c6d5] mt-2">The ultimate gravity-defying championship begins.</p>
                </div>
                <button className="w-full py-4 bg-transparent border border-[#a7c8ff]/50 text-[#a7c8ff] text-[12px] font-black uppercase tracking-[0.2em] relative overflow-hidden group/btn hover:text-[#003061] transition-colors cursor-pointer">
                  <div className="absolute inset-0 bg-[#a7c8ff] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 -z-10"></div>
                  BUY TICKET
                </button>
              </div>
            </div>
            
            {/* Card 2: Dungeon Alpha */}
            <div className="relative group h-[400px] rounded-lg overflow-hidden border border-[#ffabf3]/30 shadow-[0_0_8px_rgba(255,171,243,0.2)] flex flex-col bg-[#201f1f]">
              <div className="h-1/2 relative">
                <img className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjllEumpq1_PNgVVHQQwrv_kpUlUicf1aD_b7R1fLYefto2A3hgMkcGgVy09bZi-A5d6Ec5qGFfaiNQs6LYchEVZB53G4_9qchYFFCTeHd5jVrdKdmJuAC9vVYQjZyRiOERQk0vIxS6RCP32dSj6EZAHhLC0xg699bOGB4qLOtDFrr3900ermH6r3bU7BAB0-kzv3hfPrhlqfktm3XoT0zPnvdzHPitAIZTsoYu6ehqQYnJSQgqdCcP-4OycN34BuMFe6kXMCCy1JH" 
                  alt="Dungeon Alpha" />
                <div className="absolute top-4 left-4 bg-[#ffabf3]/80 backdrop-blur px-2 py-1 rounded">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5b005b]">TOURNAMENT OPEN</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-audiowide text-[24px] text-[#ffffff] leading-[1.2]">Dungeon Alpha:<br/>Breach</h4>
                    <Award className="w-6 h-6 text-[#ffabf3]" />
                  </div>
                  <div className="mt-4 flex items-center gap-2 bg-[#2a2a2a] p-3 rounded">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#c0c6d5]">REWARDS:</span>
                    <span className="text-[14px] font-bold tracking-[0.1em] text-[#ffabf3]">1,500 MGC</span>
                  </div>
                </div>
                <div>
                  <div className="h-1 w-full bg-[#353534] rounded overflow-hidden">
                    <div className="h-full bg-[#ffabf3] w-3/4"></div>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#c0c6d5] text-right mt-2">352 Squads Synced</p>
                </div>
              </div>
            </div>
            
            {/* Card 3: Era of Chaos */}
            <div className="relative group h-[400px] rounded-lg overflow-hidden border border-white/5 flex flex-col bg-[#0e0e0e] grayscale opacity-80 cursor-not-allowed">
              <div className="h-1/2 relative bg-black flex items-center justify-center">
                <Lock className="w-16 h-16 text-white/10" />
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)', backgroundSize: '100% 3px'}}></div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="relative">
                  <h4 className="font-audiowide text-[24px] text-[#c0c6d5]/40 italic">Era of Chaos: Awakening</h4>
                  <div className="mt-2 text-[10px] font-bold tracking-[0.1em] text-[#ffb4ab]/50 flex flex-col gap-1">
                    <span>ERR: [RESOURCE_LOCKED]</span>
                    <span>SIGNAL_STRENGTH: 0.04%</span>
                  </div>
                  <div className="absolute -inset-2 border-2 border-[#ffb4ab]/10 pointer-events-none opacity-40"></div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-black uppercase tracking-[0.2em] text-[#c0c6d5]/40">STATUS: MYSTERY EVENT</span>
                </div>
              </div>
            </div>
            
          </div>
        </section>
        
        {/* Technical Data Overlay (Floating) */}
        <div className="fixed bottom-24 right-10 z-30 flex flex-col gap-2">
          <div className="bg-[#131313]/70 backdrop-blur-xl p-4 border border-[#a7c8ff]/30 shadow-[0_0_8px_rgba(167,200,255,0.2)] rounded-lg flex flex-col gap-2 min-w-[200px]">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#a7c8ff]">SYNC STABILITY</span>
              <span className="text-[12px] font-bold tracking-[0.1em] text-[#ffffff]">OPTIMAL</span>
            </div>
            <div className="h-1 w-full bg-[#353534] rounded-full overflow-hidden relative">
              <div className="absolute top-0 left-0 h-full bg-[#a7c8ff] w-[94%]">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
            <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.2em] text-[#c0c6d5]">
              <span>94.2%</span>
              <span>2.4 TB/S</span>
            </div>
          </div>
        </div>
        
      </main>
      
      {/* Footer Telemetry */}
      <footer className="fixed bottom-0 left-0 w-full py-4 px-6 md:px-[64px] flex flex-col md:flex-row justify-between items-center bg-black/40 backdrop-blur-md border-t border-[#ffabf3]/20 z-50">
        <div className="flex items-center gap-6">
          <span className="text-[12px] font-black uppercase tracking-[0.2em] text-[#ffabf3] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#15ffd1] shadow-[0_0_8px_#15ffd1]"></span>
            SYNC: 100%
          </span>
          <span className="hidden md:block text-[12px] font-black uppercase tracking-[0.2em] text-[#c0c6d5]/60">LATENCY: {latency}MS</span>
          <span className="hidden md:block text-[12px] font-black uppercase tracking-[0.2em] text-[#c0c6d5]/60">NODE: ALPHA-7</span>
        </div>
        <div className="flex items-center gap-8 mt-2 md:mt-0">
          <a className="text-[12px] font-black uppercase tracking-[0.2em] text-[#c0c6d5] hover:text-[#ffabf3] transition-all cursor-pointer">System Telemetry</a>
          <a className="text-[12px] font-black uppercase tracking-[0.2em] text-[#c0c6d5] hover:text-[#ffabf3] transition-all cursor-pointer">Privacy Protocol</a>
          <span className="text-[12px] font-black uppercase tracking-[0.2em] text-[#ffabf3]/40">© 2026 MAGNOEVENTS PORTAL</span>
        </div>
      </footer>
    </div>
  );
};
