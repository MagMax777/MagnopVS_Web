import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Lock, ChevronRight, BookOpen, Layers, Zap, ArrowRight,
  Volume2, VolumeX, Key, Terminal, Eye, Sparkles, FileText,
  Share2, Shield, CheckCircle2, Bookmark, Compass, Award, ExternalLink
} from 'lucide-react';
import { SagaMagZineContext, eleusisPathMagZineContext, MagZineChronicle } from './eleusisMagZineContext';

export interface StepProps {
  onNext: () => void;
  onClose?: () => void;
  onOpenMagZine?: () => void;
  sagaContext?: SagaMagZineContext;
}

export const SagaIntroView: React.FC<StepProps> = ({ onNext, onClose, onOpenMagZine }) => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Deep space bg */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 animate-[pulse-energy_8s_ease-in-out_infinite]"
        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDl1Bzkh4D_iZqk8kZbFjFOOvQdd7o0Xy-PjdC-JhO4JPaH_8ORj0qJq1TAq2Oa46war3R-8WDCXTBpp8SbAgFh4y2hlKcz7V-zCrQUcmOBS5aWqRWBNvIJ7UsdiM0eVFGjUW1E9vHY_HcB-epaWua_csQosP7zhh0TyiWD0IpGzcwThwio1nTrYTi3N6QXwIvt4xIdodA5bthNNV1GrCHUpsq0bhwjVePbzAnH8eXx3Y7EAgo0E4mU1VsfwYxYwsFyRg1UquUrGclv')" }}
      />
      
      <div className="relative z-10 text-center flex flex-col items-center p-6 max-w-4xl mx-auto">
        <div className="w-16 h-16 rounded-full border border-primary-container/30 flex items-center justify-center mb-8 bg-surface-container-low/50 backdrop-blur-md">
          <img alt="Cosmic White Rabbit Sigil" className="w-10 h-10 rounded-full opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBub4TidtN9ZnYJwVdRp5TfkpFi6WD5n0Bv2DiDKTc4POy2TcIyo6HtXDyyJkg8eQmR-OcBxINRJoaEB5pmYiVRclofItPnzOzmPvgXTwMrF_cCGr4CQEzFRAVEb9DoPJEzl8myHrPUFNJy7fUD-2Q8Zy1U8yz0axNnt4bUvQyerUbApsFA4eREjN8ScUKcp0095zzzYgMdSoMY2T_YYs_vA5VRyXbgpxC078sbON-lWCg2LyR-ATKN3g"/>
        </div>
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/20 border border-primary-container/40 text-primary-fixed mb-4">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span className="font-mono text-xs uppercase tracking-widest font-bold">TRANSMEDIA SAGA // PROTOCOLO ELEUSIS</span>
        </div>

        <h1 className="font-display-xl text-4xl md:text-6xl text-primary-fixed drop-shadow-[0_0_20px_rgba(0,204,255,0.4)] mb-4 uppercase tracking-[0.1em]">
          Eleusis Path
        </h1>
        <p className="font-label-caps text-label-caps text-secondary-fixed-dim tracking-[0.5em] mb-8">
          THE UNDERWORLD PARADOX
        </p>
        
        <p className="font-body-md text-on-surface-variant max-w-2xl text-lg mb-10 leading-relaxed">
          Has cruzado el umbral hacia el protocolo Eleusis de <span className="text-white font-bold">MagnopVS</span>. Aquí la línea entre la mitología antigua y la matriz cuántica se disuelve. Explora la edición especial de MagZine, calibra los 7 Vehículos y desafía la gravedad del vacío.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button 
            onClick={onOpenMagZine || onNext} 
            className="group relative overflow-hidden font-label-caps text-label-caps px-10 py-5 bg-[#00dbe9] text-[#002018] shadow-[0_0_30px_rgba(0,219,233,0.3)] transition-all hover:scale-105 active:scale-95 rounded-xl flex items-center gap-3 font-bold"
          >
            <BookOpen className="w-5 h-5" />
            <span>ABRIR MAGZINE DE SAGA (ISSUE #07)</span>
            <ChevronRight className="w-5 h-5" />
          </button>

          <button 
            onClick={onNext} 
            className="font-label-caps text-label-caps px-8 py-5 bg-surface-container-highest/60 border border-outline-variant text-white hover:bg-surface-container-high transition-all rounded-xl flex items-center gap-2"
          >
            <span>INICIAR FLUJO COMPLETO</span>
            <ArrowRight className="w-4 h-4 text-secondary-fixed-dim" />
          </button>
        </div>

        {onClose && (
           <button onClick={onClose} className="mt-8 font-label-caps text-[10px] text-outline-variant hover:text-error transition-colors uppercase tracking-[0.3em]">
             Abort Sequence // Volver a la Matrix
           </button>
        )}
      </div>
    </div>
  );
};

export const MagZineView: React.FC<StepProps> = ({ onNext, onClose, sagaContext = eleusisPathMagZineContext }) => {
  const [activeTab, setActiveTab] = useState<'cover' | 'chronicles' | 'terminal' | 'pillars'>('cover');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedChronicle, setSelectedChronicle] = useState<MagZineChronicle | null>(null);
  const [readArticles, setReadArticles] = useState<string[]>([]);
  const [mythosBalance, setMythosBalance] = useState<number>(350);
  
  // Terminal state
  const [terminalInput, setTerminalInput] = useState('');
  const [unlockedCodes, setUnlockedCodes] = useState<string[]>(['TELESTERION-432']);
  const [terminalFeedback, setTerminalFeedback] = useState<string | null>(null);
  
  // Audio state (Procedural Web Audio)
  const [audioActive, setAudioActive] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Play procedural frequency
  const toggleProceduralAudio = () => {
    if (audioActive) {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
      setAudioActive(false);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.connect(ctx.destination);
      gainRef.current = gain;

      // 432 Hz Eleusis Fundamental
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(432, ctx.currentTime);
      osc1.connect(gain);
      osc1.start();
      osc1Ref.current = osc1;

      // 216 Hz Sub-harmonic
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(216, ctx.currentTime);
      osc2.connect(gain);
      osc2.start();
      osc2Ref.current = osc2;

      setAudioActive(true);
    } catch (e) {
      console.warn("Web Audio not permitted automatically:", e);
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const handleReadChronicle = (chronicle: MagZineChronicle) => {
    setSelectedChronicle(chronicle);
    if (!readArticles.includes(chronicle.id)) {
      setReadArticles(prev => [...prev, chronicle.id]);
      setMythosBalance(prev => prev + chronicle.resonanceBonus);
    }
  };

  const handleUnlockCode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = terminalInput.trim().toUpperCase();
    if (!clean) return;

    const match = sagaContext.secretCodes.find(c => c.code.toUpperCase() === clean);
    if (match) {
      if (unlockedCodes.includes(match.code)) {
        setTerminalFeedback(`[AVISO] El código ${match.code} ya fue desencriptado previamente.`);
      } else {
        setUnlockedCodes(prev => [...prev, match.code]);
        setMythosBalance(prev => prev + match.rewardMythos);
        setTerminalFeedback(`[ÉXITO] ${match.unlockedTitle} DESBLOQUEADO (+${match.rewardMythos} Mythos).`);
      }
    } else {
      setTerminalFeedback(`[ERROR] Clave de acceso inválida o señal corrupta en el Nodo GE-13.`);
    }
    setTerminalInput('');
  };

  const categories = ['Todos', 'Misterios Cuánticos', 'Vehículos Existenciales', 'Eidolones & Deidades', 'Archivos Prohibidos'];
  const filteredChronicles = selectedCategory === 'Todos'
    ? sagaContext.chronicles
    : sagaContext.chronicles.filter(c => c.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#07090b] text-[#cee5ff] font-sans relative overflow-x-hidden p-4 md:p-8 flex flex-col justify-between">
      {/* Background Ambience */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-[#15ffd1]/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-[#ffabf3]/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Top Header */}
      <header className="max-w-7xl w-full mx-auto mb-8 bg-[#101418]/90 backdrop-blur-xl border border-[#00dbe9]/30 rounded-2xl p-4 md:p-6 shadow-[0_0_40px_rgba(0,219,233,0.1)] flex flex-wrap items-center justify-between gap-4 relative z-20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00dbe9]/30 to-[#ffabf3]/30 border border-[#00dbe9]/50 flex items-center justify-center text-[#00dbe9]">
            <BookOpen className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-[#00dbe9] bg-[#00dbe9]/10 px-2 py-0.5 rounded border border-[#00dbe9]/30 font-bold uppercase tracking-widest">
                {sagaContext.editionNumber}
              </span>
              <span className="font-mono text-[10px] text-[#ffabf3] bg-[#ffabf3]/10 px-2 py-0.5 rounded border border-[#ffabf3]/30 font-bold uppercase tracking-widest">
                {sagaContext.classification}
              </span>
            </div>
            <h1 className="font-audiowide text-xl md:text-2xl text-white tracking-wider mt-1">
              {sagaContext.sagaTitle}
            </h1>
            <p className="font-mono text-xs text-[#8ca0aa]">
              {sagaContext.sagaSubtitle}
            </p>
          </div>
        </div>

        {/* HUD Controls */}
        <div className="flex items-center gap-3">
          {/* Audio Synthesizer Toggle */}
          <button
            onClick={toggleProceduralAudio}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-mono transition-all ${
              audioActive 
                ? 'bg-[#15ffd1]/20 border-[#15ffd1] text-[#15ffd1] shadow-[0_0_15px_rgba(21,255,209,0.3)] animate-pulse' 
                : 'bg-[#192026] border-[#41474f] text-[#8b919a] hover:text-white'
            }`}
            title="Sintonizador de Resonancia 432Hz"
          >
            {audioActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{audioActive ? '432Hz ACTIVO' : 'SINTONIZAR AUDIO'}</span>
          </button>

          {/* Mythos Counter */}
          <div className="bg-[#172026] border border-[#ffabf3]/40 px-3 py-2 rounded-xl flex items-center gap-2 font-mono text-xs">
            <Sparkles className="w-4 h-4 text-[#ffabf3]" />
            <span className="text-[#8ca0aa]">Mythos:</span>
            <span className="text-[#ffabf3] font-bold">{mythosBalance} MP</span>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#41474f] hover:border-red-500/50 hover:bg-red-500/10 text-xs font-mono text-[#8ca0aa] hover:text-red-400 rounded-xl transition-colors"
            >
              Salir
            </button>
          )}
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl w-full mx-auto mb-6 flex flex-wrap gap-2 border-b border-[#28323a] pb-4 relative z-20">
        <button
          onClick={() => setActiveTab('cover')}
          className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 ${
            activeTab === 'cover'
              ? 'bg-[#00dbe9] text-[#002018] shadow-[0_0_20px_rgba(0,219,233,0.4)]'
              : 'bg-[#131920] border border-[#2d3842] text-[#8ca0aa] hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" /> Portada & Manifiesto
        </button>

        <button
          onClick={() => setActiveTab('chronicles')}
          className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 ${
            activeTab === 'chronicles'
              ? 'bg-[#00dbe9] text-[#002018] shadow-[0_0_20px_rgba(0,219,233,0.4)]'
              : 'bg-[#131920] border border-[#2d3842] text-[#8ca0aa] hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" /> Crónicas de Saga ({sagaContext.chronicles.length + 1})
        </button>

        <button
          onClick={() => setActiveTab('terminal')}
          className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 ${
            activeTab === 'terminal'
              ? 'bg-[#00dbe9] text-[#002018] shadow-[0_0_20px_rgba(0,219,233,0.4)]'
              : 'bg-[#131920] border border-[#2d3842] text-[#8ca0aa] hover:text-white'
          }`}
        >
          <Terminal className="w-4 h-4" /> Terminal Cripto ({unlockedCodes.length}/{sagaContext.secretCodes.length})
        </button>

        <button
          onClick={() => setActiveTab('pillars')}
          className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 ${
            activeTab === 'pillars'
              ? 'bg-[#00dbe9] text-[#002018] shadow-[0_0_20px_rgba(0,219,233,0.4)]'
              : 'bg-[#131920] border border-[#2d3842] text-[#8ca0aa] hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" /> Pilares Filosóficos
        </button>
      </div>

      {/* Main Tab Content */}
      <main className="max-w-7xl w-full mx-auto flex-1 relative z-10 mb-8">
        {/* TAB 1: COVER & MANIFESTO */}
        {activeTab === 'cover' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Cover Artwork */}
            <div className="lg:col-span-5 bg-[#12161b] rounded-2xl border border-[#00dbe9]/30 overflow-hidden relative shadow-[0_0_40px_rgba(0,219,233,0.15)] flex flex-col justify-end p-8 min-h-[500px]">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                style={{ backgroundImage: `url('${sagaContext.coverImage}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07090b] via-[#07090b]/50 to-transparent"></div>
              
              <div className="relative z-10">
                <span className="font-mono text-xs text-[#15ffd1] font-bold tracking-widest bg-black/60 px-3 py-1 rounded backdrop-blur-md border border-[#15ffd1]/40 uppercase mb-3 inline-block">
                  {sagaContext.volume}
                </span>
                <h2 className="font-audiowide text-4xl text-white drop-shadow-md mb-2">
                  MAGZINE
                </h2>
                <h3 className="font-audiowide text-2xl text-[#00dbe9] drop-shadow-md mb-4">
                  ELEUSIS EDITION
                </h3>
                <p className="font-mono text-xs text-[#b0c4cf] mb-6">
                  {sagaContext.tagline}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleReadChronicle(sagaContext.featuredArticle)}
                    className="flex-1 py-3 bg-[#00dbe9] hover:bg-[#15ffd1] text-[#002018] font-mono text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,219,233,0.4)] transition-all"
                  >
                    <BookOpen className="w-4 h-4" /> Leer Artículo Principal
                  </button>
                  <button
                    onClick={() => setActiveTab('chronicles')}
                    className="px-4 py-3 bg-black/60 border border-[#41474f] text-[#8ca0aa] hover:text-white font-mono text-xs font-bold uppercase rounded-xl transition-colors"
                  >
                    Índice
                  </button>
                </div>
              </div>
            </div>

            {/* Right Editorial Manifesto & Stats */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-6">
              {/* Featured Card */}
              <div className="bg-[#12161b]/90 backdrop-blur-xl border border-[#2d3842] hover:border-[#00dbe9]/50 rounded-2xl p-6 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-mono text-[10px] text-[#ffabf3] bg-[#ffabf3]/10 px-2.5 py-1 rounded border border-[#ffabf3]/30 font-bold uppercase tracking-wider">
                    {sagaContext.featuredArticle.kicker}
                  </span>
                  <span className="font-mono text-xs text-[#8ca0aa]">
                    {sagaContext.featuredArticle.readTime}
                  </span>
                </div>

                <h3 className="font-audiowide text-2xl text-white mb-3 hover:text-[#00dbe9] cursor-pointer transition-colors" onClick={() => handleReadChronicle(sagaContext.featuredArticle)}>
                  {sagaContext.featuredArticle.title}
                </h3>

                <p className="font-mono text-sm text-[#8ca0aa] mb-4 leading-relaxed">
                  {sagaContext.featuredArticle.excerpt}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {sagaContext.featuredArticle.tags.map(t => (
                    <span key={t} className="text-[10px] font-mono bg-[#1c242c] text-[#8ca0aa] px-2.5 py-0.5 rounded border border-[#2d3842]">
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-[#232c35] pt-4">
                  <span className="font-mono text-xs text-[#15ffd1] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> +{sagaContext.featuredArticle.resonanceBonus} MP por lectura
                  </span>
                  <button
                    onClick={() => handleReadChronicle(sagaContext.featuredArticle)}
                    className="font-mono text-xs text-[#00dbe9] hover:text-white flex items-center gap-1 font-bold group"
                  >
                    Desplegar Archivo Completo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Stats & Curatorship Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#12161b] border border-[#232c35] p-4 rounded-xl text-center">
                  <span className="font-mono text-[10px] text-[#8ca0aa] uppercase block mb-1">Crónicas</span>
                  <span className="font-audiowide text-2xl text-[#00dbe9]">{sagaContext.stats.articlesCount}</span>
                </div>
                <div className="bg-[#12161b] border border-[#232c35] p-4 rounded-xl text-center">
                  <span className="font-mono text-[10px] text-[#8ca0aa] uppercase block mb-1">Pistas Clave</span>
                  <span className="font-audiowide text-2xl text-[#ffabf3]">{sagaContext.stats.encryptedClues}</span>
                </div>
                <div className="bg-[#12161b] border border-[#232c35] p-4 rounded-xl text-center">
                  <span className="font-mono text-[10px] text-[#8ca0aa] uppercase block mb-1">Mythos Posibles</span>
                  <span className="font-audiowide text-2xl text-[#15ffd1]">+{sagaContext.stats.mythosYield}</span>
                </div>
                <div className="bg-[#12161b] border border-[#232c35] p-4 rounded-xl text-center">
                  <span className="font-mono text-[10px] text-[#8ca0aa] uppercase block mb-1">Resonancia</span>
                  <span className="font-mono text-xs text-white font-bold">{sagaContext.resonanceFrequency.split(' ')[0]}</span>
                </div>
              </div>

              {/* Editorial Note */}
              <div className="bg-[#12161b]/60 border border-[#232c35] p-5 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1c242c] border border-[#41474f] flex items-center justify-center shrink-0">
                  <span className="font-audiowide text-sm text-[#00dbe9]">P</span>
                </div>
                <div>
                  <h4 className="font-mono text-xs text-white font-bold">Nota de la Curaduría: {sagaContext.curator}</h4>
                  <p className="font-mono text-xs text-[#8ca0aa] mt-0.5">
                    "Eleusis no es sólo una saga: es el mapa cartográfico de cómo el alma humana navega a través de los códigos de la realidad simulada."
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CHRONICLES CATALOG */}
        {activeTab === 'chronicles' && (
          <div>
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#00dbe9] text-[#002018] shadow-[0_0_15px_rgba(0,219,233,0.3)]'
                      : 'bg-[#12161b] border border-[#2d3842] text-[#8ca0aa] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Chronicles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChronicles.map(chronicle => {
                const isRead = readArticles.includes(chronicle.id);
                return (
                  <div
                    key={chronicle.id}
                    onClick={() => handleReadChronicle(chronicle)}
                    className="bg-[#12161b]/90 backdrop-blur-md border border-[#2d3842] hover:border-[#00dbe9]/60 rounded-2xl overflow-hidden flex flex-col justify-between group cursor-pointer transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,219,233,0.1)] relative"
                  >
                    {isRead && (
                      <div className="absolute top-3 right-3 z-10 bg-[#15ffd1]/20 border border-[#15ffd1] text-[#15ffd1] px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Sintonizado
                      </div>
                    )}

                    <div className="h-44 relative overflow-hidden bg-[#182028]">
                      <div 
                        className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-80"
                        style={{ backgroundImage: `url('${chronicle.image}')` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#12161b] via-[#12161b]/30 to-transparent"></div>
                      <div className="absolute bottom-3 left-4">
                        <span className="font-mono text-[10px] text-[#00dbe9] bg-black/60 px-2 py-0.5 rounded border border-[#00dbe9]/30 uppercase font-bold">
                          {chronicle.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="font-mono text-[9px] text-[#ffabf3] block mb-1 uppercase tracking-widest font-bold">
                          {chronicle.kicker}
                        </span>
                        <h4 className="font-audiowide text-lg text-white mb-2 group-hover:text-[#00dbe9] transition-colors leading-snug">
                          {chronicle.title}
                        </h4>
                        <p className="font-mono text-xs text-[#8ca0aa] line-clamp-3 mb-4 leading-relaxed">
                          {chronicle.excerpt}
                        </p>
                      </div>

                      <div className="border-t border-[#232c35] pt-4 flex items-center justify-between font-mono text-xs">
                        <span className="text-[#8ca0aa] text-[10px]">{chronicle.readTime}</span>
                        <span className="text-[#15ffd1] font-bold text-[11px] flex items-center gap-1">
                          +{chronicle.resonanceBonus} MP <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: CRYPTO TERMINAL */}
        {activeTab === 'terminal' && (
          <div className="bg-[#12161b] border border-[#00dbe9]/40 rounded-2xl p-6 md:p-8 max-w-4xl mx-auto shadow-[0_0_40px_rgba(0,219,233,0.1)] font-mono">
            <div className="flex items-center gap-3 border-b border-[#232c35] pb-4 mb-6">
              <Terminal className="w-6 h-6 text-[#00dbe9]" />
              <div>
                <h3 className="font-audiowide text-lg text-white">Terminal Cripto-Mística // Eleusis Node GE-13</h3>
                <p className="text-xs text-[#8ca0aa]">Introduce los códigos encriptados hallados en las crónicas para desbloquear archivos clasificados.</p>
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleUnlockCode} className="flex gap-3 mb-6">
              <input
                type="text"
                value={terminalInput}
                onChange={e => setTerminalInput(e.target.value)}
                placeholder="EJEMPLO: TELESTERION-432, HADES-ROOT, PERSEPHONE-VOID..."
                className="flex-1 bg-[#090d10] border border-[#2d3842] focus:border-[#00dbe9] px-4 py-3 rounded-xl text-sm text-[#15ffd1] uppercase tracking-widest outline-none transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#00dbe9] text-[#002018] font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#15ffd1] transition-all flex items-center gap-2"
              >
                <Key className="w-4 h-4" /> Desencriptar
              </button>
            </form>

            {terminalFeedback && (
              <div className="p-4 rounded-xl bg-[#18222b] border border-[#00dbe9]/30 text-xs text-[#15ffd1] mb-6 animate-fade-in font-mono">
                {terminalFeedback}
              </div>
            )}

            {/* Unlocked Codices */}
            <h4 className="text-xs uppercase tracking-widest text-[#8ca0aa] font-bold mb-3">
              Archivos Desencriptados ({unlockedCodes.length} de {sagaContext.secretCodes.length}):
            </h4>
            <div className="space-y-3">
              {sagaContext.secretCodes.map(codeEntry => {
                const isUnlocked = unlockedCodes.includes(codeEntry.code);
                return (
                  <div
                    key={codeEntry.code}
                    className={`p-4 rounded-xl border transition-all ${
                      isUnlocked
                        ? 'bg-[#18222a] border-[#15ffd1]/40 text-white'
                        : 'bg-[#0e1215] border-[#232c35] text-[#55636d] opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono text-xs font-bold text-[#00dbe9]">
                        [{isUnlocked ? codeEntry.code : '••••••••••••'}] - {isUnlocked ? codeEntry.unlockedTitle : 'Cifrado de Alto Nivel'}
                      </span>
                      <span className="text-[10px] text-[#ffabf3] font-bold">
                        {isUnlocked ? `+${codeEntry.rewardMythos} MP Canjeados` : `Valor: +${codeEntry.rewardMythos} MP`}
                      </span>
                    </div>
                    <p className="text-xs text-[#8ca0aa] mt-1">
                      {isUnlocked ? codeEntry.loreReveal : 'Explora los artículos del MagZine para descubrir las palabras clave ocultas en los fragmentos.'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: PHILOSOPHICAL PILLARS */}
        {activeTab === 'pillars' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sagaContext.philosophicalPillars.map((pillar, i) => (
              <div
                key={pillar.name}
                className="bg-[#12161b] border border-[#2d3842] hover:border-[#15ffd1]/50 p-6 rounded-2xl transition-all shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#1c242c] border border-[#41474f] flex items-center justify-center text-[#15ffd1] font-audiowide text-lg mb-4">
                    0{i + 1}
                  </div>
                  <h3 className="font-audiowide text-xl text-white mb-2">
                    {pillar.name}
                  </h3>
                  <span className="font-mono text-[10px] text-[#ffabf3] uppercase font-bold tracking-widest block mb-4">
                    {pillar.deity}
                  </span>
                  <p className="font-mono text-xs text-[#8ca0aa] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
                <div className="border-t border-[#232c35] pt-4 mt-6 flex items-center text-[11px] font-mono text-[#00dbe9]">
                  <Shield className="w-4 h-4 mr-1.5" /> Pilar Ontológico de Eleusis
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ARTICLE READER MODAL */}
      {selectedChronicle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-fade-in">
          <div className="max-w-4xl w-full max-h-[90vh] bg-[#0c1014] border border-[#00dbe9]/50 rounded-2xl overflow-hidden flex flex-col shadow-[0_0_60px_rgba(0,219,233,0.2)]">
            {/* Modal Header */}
            <div className="p-6 bg-[#12171e] border-b border-[#232c35] flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] text-[#ffabf3] bg-[#ffabf3]/10 px-2.5 py-0.5 rounded border border-[#ffabf3]/30 uppercase font-bold tracking-wider">
                  {selectedChronicle.category} // {selectedChronicle.kicker}
                </span>
                <h2 className="font-audiowide text-xl md:text-2xl text-white mt-1.5">
                  {selectedChronicle.title}
                </h2>
                <p className="font-mono text-xs text-[#8ca0aa]">
                  Por {selectedChronicle.author} • {selectedChronicle.readTime}
                </p>
              </div>
              <button
                onClick={() => setSelectedChronicle(null)}
                className="w-10 h-10 rounded-xl bg-[#19222b] hover:bg-red-500/20 text-[#8ca0aa] hover:text-red-400 border border-[#2d3842] flex items-center justify-center transition-colors font-mono text-sm"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-10 overflow-y-auto space-y-6 font-mono text-sm leading-relaxed text-[#b4c8d4]">
              {selectedChronicle.image && (
                <div className="h-64 rounded-xl overflow-hidden border border-[#2d3842] relative mb-6">
                  <div 
                    className="absolute inset-0 bg-cover bg-center" 
                    style={{ backgroundImage: `url('${selectedChronicle.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1014] to-transparent"></div>
                </div>
              )}

              {selectedChronicle.fullText.map((p, i) => (
                <p key={i} className="text-[#cee5ff] leading-relaxed">
                  {p}
                </p>
              ))}

              {selectedChronicle.secretCodex && (
                <div className="p-5 rounded-xl bg-[#15ffd1]/10 border border-[#15ffd1]/30 my-6">
                  <div className="flex items-center gap-2 text-[#15ffd1] font-bold text-xs uppercase mb-1">
                    <Key className="w-4 h-4" /> Fragmento Criptográfico Encontrado
                  </div>
                  <p className="text-xs text-[#cee5ff]">
                    Clave detectada en el manuscrito: <span className="font-bold text-white bg-black/50 px-2 py-0.5 rounded border border-[#15ffd1]/40">{selectedChronicle.secretCodex}</span>. 
                    Introdúcelo en la <span className="text-[#15ffd1] underline cursor-pointer" onClick={() => { setSelectedChronicle(null); setActiveTab('terminal'); }}>Terminal Cripto</span> para desbloquear la memoria de nodo.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#12171e] border-t border-[#232c35] flex justify-between items-center">
              <span className="font-mono text-xs text-[#15ffd1] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Lectura Sincronizada con tu Conciencia (+{selectedChronicle.resonanceBonus} MP)
              </span>
              <button
                onClick={() => setSelectedChronicle(null)}
                className="px-6 py-2.5 bg-[#00dbe9] hover:bg-[#15ffd1] text-[#002018] font-mono text-xs font-bold uppercase rounded-xl transition-all"
              >
                Cerrar Lectura
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action Footer */}
      <footer className="max-w-7xl w-full mx-auto mt-auto pt-6 border-t border-[#232c35] flex flex-col sm:flex-row items-center justify-between gap-4 relative z-20">
        <div className="flex items-center gap-3">
          <span className="font-audiowide text-sm text-white">MagnopVS</span>
          <span className="text-xs text-[#8ca0aa] font-mono">// Archivo Editorial Transmedia Eleusis Path</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onNext}
            className="px-8 py-3.5 bg-gradient-to-r from-[#00dbe9] to-[#15ffd1] text-[#002018] font-mono text-xs font-bold uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(0,219,233,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            Continuar a Temporadas <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export const TemporadasView: React.FC<StepProps> = ({ onNext, onClose }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background p-6 md:p-16 relative overflow-x-hidden">
      {/* Background Mesh */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#9de2ff 1px, transparent 1px), linear-gradient(90deg, #9de2ff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <header className="flex justify-between items-center mb-16 relative z-10">
        <div>
           <h1 className="font-display-xl text-3xl md:text-5xl text-white tracking-widest uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Temporadas</h1>
           <p className="font-label-caps text-label-caps text-primary-fixed-dim mt-2 tracking-[0.3em]">CHRONICLE SELECTION</p>
        </div>
        {onClose && (
           <button onClick={onClose} className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors">
              <Lock className="w-4 h-4 text-on-surface-variant" />
           </button>
        )}
      </header>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl relative z-10">
          
          {/* Season 1: Active */}
          <div 
            onClick={onNext} 
            className="group glass-panel rounded-xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,204,255,0.15)] border border-primary-container/30 bg-surface-container-low/60 backdrop-blur-xl relative"
          >
            <div className="absolute top-0 right-0 p-4">
              <span className="bg-primary-container text-on-primary-container text-[9px] font-label-caps px-2 py-1 rounded-sm uppercase">Active</span>
            </div>
            
            <div className="h-48 bg-surface-container-highest relative overflow-hidden border-b border-primary-container/20">
               <div className="absolute inset-0 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuBJ9I56G3oW9pftCZomPBbjx4gMo-FaGNKQeR9-54rpTTE_QKyLelI29q3ci1Q3EhBFkQxM2vwXcGxQ7Jw15IRTUTl5rJ-HoB8eZatLVeZUYvJBM5tV1c6ksyYvEecjnAJlOW3ISCtOjUU17ylDCYlolGIY7c0h-LyjixxSJX-NcbrRE4rMa6WHA0hSRHo39AtfpsHAg90b1vVR98DRhkicHhmNET9AA3q45rM1wGGyfTvkvkYXqjG-ElvWaV0QrdaZWG36n10berZw')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700"></div>
               <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
            </div>
            
            <div className="p-8 relative">
               <span className="font-label-caps text-label-caps text-primary-fixed-dim block mb-2 tracking-[0.2em]">SEASON 01</span>
               <h3 className="font-headline-lg text-2xl text-white mb-4 group-hover:text-primary transition-colors">Génesis del Aether</h3>
               <p className="font-body-md text-sm text-on-surface-variant mb-6 line-clamp-2">
                 El descubrimiento del protocolo. Las facciones despiertan en el umbral mientras el tejido del universo simulado se fractura.
               </p>
               
               <div className="flex items-center text-primary-fixed-dim font-label-caps text-[10px] tracking-widest gap-2">
                  EXPLORAR CAPÍTULOS <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </div>
            </div>
          </div>
          
          {/* Season 2: Locked */}
          <div className="glass-panel rounded-xl overflow-hidden border border-outline-variant/30 bg-surface-container-low/40 backdrop-blur-xl opacity-60 grayscale relative">
            <div className="absolute top-0 right-0 p-4">
              <Lock className="w-4 h-4 text-on-surface-variant" />
            </div>
            
            <div className="h-48 bg-surface-container-highest relative overflow-hidden border-b border-outline-variant/20 flex items-center justify-center">
               <Layers className="w-16 h-16 text-outline-variant opacity-30" />
            </div>
            
            <div className="p-8">
               <span className="font-label-caps text-label-caps text-on-surface-variant block mb-2 tracking-[0.2em]">SEASON 02</span>
               <h3 className="font-headline-lg text-2xl text-on-surface-variant mb-4">La Caída de los Arcontes</h3>
               <p className="font-body-md text-sm text-on-surface-variant/70 mb-6">
                 [ARCHIVO RESTRINGIDO] Requiere completar Season 01 para desencriptar el núcleo narrativo.
               </p>
               
               <div className="flex items-center text-outline-variant font-label-caps text-[10px] tracking-widest gap-2">
                  LOCKED
               </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export const TrailerView: React.FC<StepProps> = ({ onNext, onClose }) => {
  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Top Bar Overlay */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between z-20 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <span className="font-label-caps text-label-caps text-primary-fixed-dim tracking-[0.3em] pointer-events-auto">CINEMATIC ARCHIVE</span>
        {onClose && (
           <button onClick={onClose} className="pointer-events-auto font-label-caps text-[10px] text-on-surface-variant hover:text-white transition-colors uppercase tracking-[0.2em]">
             SKIP
           </button>
        )}
      </div>

      {/* Main Video Container */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10 mt-12">
        <div className="w-full max-w-6xl aspect-video bg-surface-container border border-outline-variant/30 relative flex flex-col items-center justify-center group shadow-[0_0_60px_rgba(0,204,255,0.15)] rounded-sm overflow-hidden">
           
           {/* Thumbnail Background */}
           <div className="absolute inset-0 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuBJ9I56G3oW9pftCZomPBbjx4gMo-FaGNKQeR9-54rpTTE_QKyLelI29q3ci1Q3EhBFkQxM2vwXcGxQ7Jw15IRTUTl5rJ-HoB8eZatLVeZUYvJBM5tV1c6ksyYvEecjnAJlOW3ISCtOjUU17ylDCYlolGIY7c0h-LyjixxSJX-NcbrRE4rMa6WHA0hSRHo39AtfpsHAg90b1vVR98DRhkicHhmNET9AA3q45rM1wGGyfTvkvkYXqjG-ElvWaV0QrdaZWG36n10berZw')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
           <div className="absolute inset-0 bg-black/30"></div>
           
           {/* Play Button */}
           <button className="w-24 h-24 bg-primary-container/20 backdrop-blur-md rounded-full flex items-center justify-center border border-primary-container text-primary-container z-10 hover:scale-110 hover:bg-primary-container/30 transition-all shadow-[0_0_30px_rgba(0,204,255,0.3)]">
              <Play className="w-10 h-10 ml-2 fill-current" />
           </button>
           
           <p className="relative z-10 mt-6 font-label-caps text-label-caps text-white tracking-[0.4em] uppercase">
             Ver Tráiler del Capítulo
           </p>

           {/* Progress Bar (Mock) */}
           <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
             <div className="h-full bg-primary-container w-[0%]"></div>
           </div>
        </div>
      </div>
      
      {/* Action Area */}
      <div className="p-8 pb-12 flex justify-center z-10 relative">
        <button 
          onClick={onNext} 
          className="bg-gradient-to-r from-primary-fixed-dim to-primary hover:from-primary hover:to-primary-fixed text-on-primary-fixed px-16 py-5 font-display-xl tracking-[0.2em] text-xl rounded-sm transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(94,212,255,0.4)] flex items-center gap-4"
        >
          JUGAR AHORA
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
