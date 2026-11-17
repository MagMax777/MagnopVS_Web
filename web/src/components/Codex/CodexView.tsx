import React, { useState, useEffect, useMemo } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { 
  CODEX_ENTRIES, 
  CODEX_CATEGORIES, 
  CodexEntry, 
  CodexCategory 
} from '../../data/codexData';
import { 
  BookOpen, 
  Search, 
  Lock, 
  Unlock, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  X, 
  Compass, 
  Globe, 
  Shield, 
  Zap, 
  Bot, 
  Layers, 
  ExternalLink, 
  CheckCircle2, 
  Flame, 
  Award,
  ChevronRight,
  Radio,
  FileText
} from 'lucide-react';

export const CodexView: React.FC = () => {
  const { player, addXpAndMp, playSoundEffect, setActiveTab } = usePlayer();

  const [selectedCategory, setSelectedCategory] = useState<CodexCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [activeModalEntry, setActiveModalEntry] = useState<CodexEntry | null>(null);

  // Claimed rewards tracking in localStorage
  const [claimedEntryIds, setClaimedEntryIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('magnopvs_codex_claimed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Audio resonance synthesizer state
  const [isPlayingHarmonic, setIsPlayingHarmonic] = useState(false);
  const [harmonicFreq, setHarmonicFreq] = useState<number>(432);
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const oscRef = React.useRef<OscillatorNode | null>(null);
  const gainRef = React.useRef<GainNode | null>(null);

  // Stop sound on unmount
  useEffect(() => {
    return () => {
      stopHarmonic();
    };
  }, []);

  const stopHarmonic = () => {
    try {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
        oscRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    } catch (e) {
      console.error(e);
    }
    setIsPlayingHarmonic(false);
  };

  const startHarmonic = (freq: number = 432) => {
    stopHarmonic();
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Ethereal subtle volume
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;

      setHarmonicFreq(freq);
      setIsPlayingHarmonic(true);
    } catch (e) {
      console.error('AudioCtx error:', e);
    }
  };

  const toggleHarmonic = (freq: number = 432) => {
    if (isPlayingHarmonic) {
      stopHarmonic();
    } else {
      startHarmonic(freq);
    }
  };

  // Helper to test if an entry is unlocked based on player state
  const isEntryUnlocked = (entry: CodexEntry): boolean => {
    // 1. Level Requirement
    if (player.level < entry.minLevel) return false;

    // 2. MagnoPoints (MP) Requirement
    if (entry.requiredMp && player.magnoPoints < entry.requiredMp) return false;

    // 3. Faction Requirement (or high general reputation >= 40 allows decoding cross-faction archives)
    if (entry.requiredFaction) {
      const isSameFaction = player.faction === entry.requiredFaction;
      const hasHighReputation = (player.stats?.factionReputation || 0) >= 40;
      if (!isSameFaction && !hasHighReputation) return false;
    }

    return true;
  };

  // Entries with computed unlock status
  const evaluatedEntries = useMemo(() => {
    return CODEX_ENTRIES.map((entry) => ({
      ...entry,
      isUnlocked: isEntryUnlocked(entry),
      isClaimed: claimedEntryIds.includes(entry.id)
    }));
  }, [player.level, player.magnoPoints, player.faction, player.stats?.factionReputation, claimedEntryIds]);

  // Overall statistics
  const totalEntries = evaluatedEntries.length;
  const unlockedCount = evaluatedEntries.filter(e => e.isUnlocked).length;
  const unlockedPercentage = Math.round((unlockedCount / totalEntries) * 100);
  const claimedCount = claimedEntryIds.length;

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return evaluatedEntries.filter((entry) => {
      // Category filter
      if (selectedCategory !== 'all' && entry.category !== selectedCategory) {
        return false;
      }
      // Status filter
      if (filterStatus === 'unlocked' && !entry.isUnlocked) return false;
      if (filterStatus === 'locked' && entry.isUnlocked) return false;
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = entry.title.toLowerCase().includes(query);
        const matchesSub = entry.subtitle.toLowerCase().includes(query);
        const matchesCode = entry.code.toLowerCase().includes(query);
        const matchesTags = entry.tags.some(t => t.toLowerCase().includes(query));
        const matchesAuthor = entry.author.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSub && !matchesCode && !matchesTags && !matchesAuthor) {
          return false;
        }
      }
      return true;
    });
  }, [evaluatedEntries, selectedCategory, filterStatus, searchQuery]);

  // Claim resonance reward
  const handleClaimResonance = (entry: CodexEntry) => {
    if (claimedEntryIds.includes(entry.id)) return;
    playSoundEffect('quest');
    addXpAndMp(entry.resonanceReward.xp, entry.resonanceReward.mp);

    const updated = [...claimedEntryIds, entry.id];
    setClaimedEntryIds(updated);
    try {
      localStorage.setItem('magnopvs_codex_claimed', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe': return <Globe className="w-4 h-4" />;
      case 'Compass': return <Compass className="w-4 h-4" />;
      case 'Shield': return <Shield className="w-4 h-4" />;
      case 'Zap': return <Zap className="w-4 h-4" />;
      case 'Bot': return <Bot className="w-4 h-4" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4" />;
      default: return <Layers className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in font-orbitron space-y-8">
      
      {/* ========================================================= */}
      {/* CODEX HEADER WITH GLASSMORPHISM AND PROGRESS METRICS */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0e1a]/70 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)]">
        {/* Ambient background glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#00f0ff]/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#8a2be2]/20 rounded-full blur-[110px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] text-xs font-bold tracking-widest uppercase">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Códice Transmedia MagnopVS</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black font-audiowide text-white uppercase tracking-wider flex items-center gap-3">
              Códice de Lore
              <span className="text-xs font-normal font-mono px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-[#7fffd4]">
                v4.8 • Quantvm Sync
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-[#a0a5b5] leading-relaxed">
              Registros ancestrales, misterios de Eleusis, filosofías de facciones y secretos alquímicos revelados progresivamente conforme asciendes de nivel y acumulas <span className="text-[#ffd700] font-semibold">MagnoPoints (MP)</span> en tu viaje por <strong className="text-white">MagnopVS</strong>.
            </p>
          </div>

          {/* Quick HUD Metrics & Frequency Tuner */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-[#050811]/60 border border-white/10 rounded-xl p-4 backdrop-blur-md">
            
            {/* Progress Counter */}
            <div className="flex items-center gap-3 pr-4 sm:border-r border-white/10">
              <div className="relative w-12 h-12 rounded-lg bg-black/40 border border-[#00f0ff]/40 flex items-center justify-center">
                <span className="text-sm font-black font-audiowide text-[#00f0ff]">
                  {unlockedPercentage}%
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#a0a5b5] block uppercase font-mono tracking-wider">
                  Desbloqueado
                </span>
                <span className="text-xs font-bold text-white">
                  {unlockedCount} / {totalEntries} Fragmentos
                </span>
              </div>
            </div>

            {/* Resonance claimed counter */}
            <div className="flex items-center gap-3 pr-4 sm:border-r border-white/10">
              <div className="w-10 h-10 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/30 flex items-center justify-center text-[#ffd700]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-[#a0a5b5] block uppercase font-mono tracking-wider">
                  Sintonizados
                </span>
                <span className="text-xs font-bold text-[#ffd700]">
                  {claimedCount} Recompensas
                </span>
              </div>
            </div>

            {/* 432Hz Ambient Resonance Synth Toggle */}
            <button
              onClick={() => toggleHarmonic(432)}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                isPlayingHarmonic 
                  ? 'bg-[#7fffd4]/20 border-[#7fffd4] text-[#7fffd4] shadow-[0_0_15px_rgba(127,255,212,0.3)]' 
                  : 'bg-black/30 border-white/10 text-[#a0a5b5] hover:text-white hover:border-white/20'
              }`}
              title="Activar frecuencia armónica 432 Hz de lectura cósmica"
            >
              {isPlayingHarmonic ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">Armónico 432Hz</span>
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 space-y-2">
          <div className="flex justify-between items-center text-[11px] font-mono">
            <span className="text-[#a0a5b5] flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-[#00f0ff]" />
              Sincronización del Archivo Cuántico
            </span>
            <span className="text-[#00f0ff] font-bold">
              {unlockedCount} de {totalEntries} Códices Sintonizados
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-black/50 overflow-hidden border border-white/10 p-[1px]">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#00f0ff] via-[#7fffd4] to-[#8a2be2] transition-all duration-700 shadow-[0_0_12px_rgba(0,240,255,0.6)]"
              style={{ width: `${Math.max(5, unlockedPercentage)}%` }}
            />
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FILTER CONTROLS & SEARCH BAR */}
      {/* ========================================================= */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search input with glass styling */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#a0a5b5] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título, código (CDX-...), o etiqueta..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0a0e1a]/60 border border-white/10 text-xs text-white placeholder-[#a0a5b5] focus:outline-none focus:border-[#00f0ff]/60 backdrop-blur-xl transition-all font-orbitron"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0a5b5] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2 bg-[#0a0e1a]/60 border border-white/10 p-1 rounded-xl backdrop-blur-xl shrink-0">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 font-bold'
                : 'text-[#a0a5b5] hover:text-white'
            }`}
          >
            Todos ({totalEntries})
          </button>
          <button
            onClick={() => setFilterStatus('unlocked')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
              filterStatus === 'unlocked'
                ? 'bg-[#7fffd4]/20 text-[#7fffd4] border border-[#7fffd4]/40 font-bold'
                : 'text-[#a0a5b5] hover:text-white'
            }`}
          >
            <Unlock className="w-3 h-3" />
            Desbloqueados ({unlockedCount})
          </button>
          <button
            onClick={() => setFilterStatus('locked')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
              filterStatus === 'locked'
                ? 'bg-[#ff007f]/20 text-[#ff007f] border border-[#ff007f]/40 font-bold'
                : 'text-[#a0a5b5] hover:text-white'
            }`}
          >
            <Lock className="w-3 h-3" />
            Bloqueados ({totalEntries - unlockedCount})
          </button>
        </div>
      </section>

      {/* Category Pills Navigation */}
      <nav className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CODEX_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                playSoundEffect('click');
                setSelectedCategory(cat.id);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-audiowide uppercase tracking-wider shrink-0 transition-all cursor-pointer backdrop-blur-md border ${
                isActive
                  ? 'bg-gradient-to-r from-[#00f0ff]/25 to-[#0072ff]/25 border-[#00f0ff] text-white shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                  : 'bg-[#0a0e1a]/40 border-white/10 text-[#a0a5b5] hover:text-white hover:border-white/25 hover:bg-[#0a0e1a]/70'
              }`}
            >
              {getCategoryIcon(cat.icon)}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ========================================================= */}
      {/* CODEX CARDS GRID */}
      {/* ========================================================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEntries.length === 0 ? (
          <div className="col-span-full py-16 text-center rounded-2xl bg-[#0a0e1a]/40 border border-white/10 backdrop-blur-md p-8">
            <BookOpen className="w-12 h-12 text-[#a0a5b5] mx-auto mb-4 opacity-50" />
            <h3 className="text-base font-bold font-audiowide text-white mb-1">
              No se encontraron códices
            </h3>
            <p className="text-xs text-[#a0a5b5]">
              Intenta cambiar los filtros de categoría o el término de búsqueda.
            </p>
          </div>
        ) : (
          filteredEntries.map((entry) => {
            const isUnlocked = entry.isUnlocked;
            const isClaimed = entry.isClaimed;

            return (
              <article
                key={entry.id}
                onClick={() => {
                  playSoundEffect('click');
                  setActiveModalEntry(entry);
                  if (entry.audioFrequency && !isPlayingHarmonic) {
                    // gentle preview chime or set freq
                  }
                }}
                className={`group relative flex flex-col justify-between rounded-2xl p-6 transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-xl border ${
                  isUnlocked
                    ? 'bg-[#0a0e1a]/70 border-white/10 hover:border-[#00f0ff]/50 hover:shadow-[0_10px_30px_rgba(0,240,255,0.15)] hover:-translate-y-1'
                    : 'bg-[#05070f]/80 border-white/5 opacity-80 hover:opacity-100 hover:border-white/15'
                }`}
              >
                {/* Top Glowing Edge when unlocked */}
                {isUnlocked && (
                  <div 
                    className="absolute top-0 left-0 right-0 h-1 opacity-70 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: entry.accentColor }}
                  />
                )}

                <div>
                  {/* Card Header: Code & Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-[#00f0ff] px-2 py-0.5 rounded bg-[#00f0ff]/10 border border-[#00f0ff]/20">
                        {entry.code}
                      </span>
                      <span className="text-[10px] font-mono text-[#a0a5b5] uppercase">
                        {entry.categoryLabel}
                      </span>
                    </div>

                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#7fffd4] bg-[#7fffd4]/10 border border-[#7fffd4]/30 px-2 py-0.5 rounded-full">
                        <Unlock className="w-3 h-3" />
                        Desbloqueado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#ff007f] bg-[#ff007f]/10 border border-[#ff007f]/30 px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" />
                        Encriptado
                      </span>
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className={`text-lg font-audiowide font-bold mb-1 transition-colors ${
                    isUnlocked ? 'text-white group-hover:text-[#00f0ff]' : 'text-[#a0a5b5]'
                  }`}>
                    {entry.title}
                  </h3>

                  <p className="text-xs text-[#7fffd4]/90 mb-4 line-clamp-1 font-orbitron">
                    {entry.subtitle}
                  </p>

                  {/* Excerpt / Locked Hint */}
                  <div className="mb-4">
                    {isUnlocked ? (
                      <p className="text-xs text-[#a0a5b5] leading-relaxed line-clamp-3">
                        {entry.excerpt}
                      </p>
                    ) : (
                      <div className="p-3 rounded-xl bg-black/40 border border-dashed border-[#ff007f]/30 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#ff007f] font-mono font-bold">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Requisito de Desbloqueo:</span>
                        </div>
                        <p className="text-[11px] text-[#f8f9fa] font-orbitron">
                          {entry.prerequisiteHint}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {entry.tags.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#a0a5b5]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Resonance Points & Action */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#a0a5b5]">
                      Resonancia:
                    </span>
                    <span className="text-xs font-bold font-mono text-[#ffd700]">
                      +{entry.resonanceReward.xp} XP • +{entry.resonanceReward.mp} MP
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-audiowide text-[#00f0ff] group-hover:translate-x-1 transition-transform">
                    <span>{isUnlocked ? 'Leer Códice' : 'Inspeccionar'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>

      {/* ========================================================= */}
      {/* DETAILED READER MODAL */}
      {/* ========================================================= */}
      {activeModalEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          {/* Backdrop */}
          <div 
            onClick={() => setActiveModalEntry(null)}
            className="fixed inset-0 bg-[#05070e]/85 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0a0e1c]/95 border border-white/15 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-10 font-orbitron space-y-6">
            
            {/* Ambient inner glow */}
            <div 
              className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl"
              style={{ backgroundColor: activeModalEntry.accentColor }}
            />

            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#00f0ff] px-2 py-0.5 rounded bg-[#00f0ff]/10 border border-[#00f0ff]/30">
                    {activeModalEntry.code}
                  </span>
                  <span className="text-xs font-mono text-[#a0a5b5] uppercase">
                    {activeModalEntry.categoryLabel}
                  </span>
                  <span className="text-xs font-mono text-[#7fffd4] px-2 py-0.5 rounded bg-white/5 border border-white/10">
                    {activeModalEntry.era}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black font-audiowide text-white uppercase tracking-wide">
                  {activeModalEntry.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#7fffd4]">
                  {activeModalEntry.subtitle}
                </p>
              </div>

              <button
                onClick={() => setActiveModalEntry(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#a0a5b5] hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lock Status Banner */}
            {!isEntryUnlocked(activeModalEntry) ? (
              <div className="p-4 rounded-xl bg-[#ff007f]/10 border border-[#ff007f]/40 flex items-start gap-3">
                <Lock className="w-5 h-5 text-[#ff007f] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="text-xs font-audiowide text-[#ff007f] uppercase block">
                    Archivo Encriptado por la Matriz
                  </strong>
                  <p className="text-xs text-[#f8f9fa]">
                    {activeModalEntry.prerequisiteHint}
                  </p>
                  <p className="text-[11px] text-[#a0a5b5] pt-1">
                    Tu estado actual: Nivel {player.level} • {player.magnoPoints} MP • Facción: {player.faction}. Continúa explorando misiones y el sendero transmedia para descifrar este registro.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#7fffd4]/10 border border-[#7fffd4]/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#7fffd4] shrink-0" />
                  <div>
                    <strong className="text-xs font-audiowide text-[#7fffd4] uppercase block">
                      Frecuencia Armónica Descifrada
                    </strong>
                    <span className="text-[11px] text-[#a0a5b5]">
                      Sintonía cuántica activa en {activeModalEntry.audioFrequency || 432} Hz
                    </span>
                  </div>
                </div>

                {claimedEntryIds.includes(activeModalEntry.id) ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-[#ffd700]">
                    <CheckCircle2 className="w-4 h-4 text-[#ffd700]" />
                    <span>Resonancia Reclamada</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleClaimResonance(activeModalEntry)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ffd700]/30 to-[#ff007f]/30 border border-[#ffd700] hover:scale-105 text-[#ffd700] text-xs font-audiowide uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Reclamar +{activeModalEntry.resonanceReward.xp} XP / +{activeModalEntry.resonanceReward.mp} MP</span>
                  </button>
                )}
              </div>
            )}

            {/* Author Quote Box */}
            <div className="p-4 rounded-xl bg-white/[0.03] border-l-4 border-l-[#00f0ff] border-y border-r border-white/5 space-y-1 italic text-xs sm:text-sm text-[#f8f9fa] leading-relaxed">
              <p>{activeModalEntry.quote}</p>
              <cite className="block text-[11px] text-[#a0a5b5] font-mono not-italic mt-2 text-right">
                — {activeModalEntry.author}
              </cite>
            </div>

            {/* Full Lore Narrative */}
            <div className="space-y-4 text-xs sm:text-sm text-[#d1d5db] leading-relaxed font-sans">
              {activeModalEntry.fullLore.map((paragraph, index) => (
                <p key={index} className="text-justify font-normal">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Technical MetaAsset Note */}
            {activeModalEntry.technicalNote && (
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-[#00f0ff] uppercase tracking-wider block flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  Nota Transmedia MagnopVS:
                </span>
                <p className="text-xs text-[#a0a5b5] font-orbitron">
                  {activeModalEntry.technicalNote}
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleHarmonic(activeModalEntry.audioFrequency || 432)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#a0a5b5] hover:text-white transition-all cursor-pointer font-mono"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#7fffd4]" />
                  <span>Sintonizar {activeModalEntry.audioFrequency || 432}Hz</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                {activeModalEntry.category === 'eleusis' && (
                  <button
                    onClick={() => {
                      setActiveModalEntry(null);
                      setActiveTab('saga');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00f0ff]/15 border border-[#00f0ff]/40 text-[#00f0ff] text-xs font-audiowide uppercase hover:bg-[#00f0ff]/25 transition-all cursor-pointer"
                  >
                    <span>Ir a Eleusis Path</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => setActiveModalEntry(null)}
                  className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-audiowide uppercase text-white transition-all cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
