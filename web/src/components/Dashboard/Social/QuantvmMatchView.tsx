import React, { useState } from 'react';
import { usePlayer } from '../../../context/PlayerContext';
import { DatingProfile, INITIAL_DATING_PROFILES } from '../../../data/socialExpandedData';
import { 
  Heart, 
  X, 
  Flame, 
  Sparkles, 
  MessageSquare, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Compass, 
  Radio, 
  Sliders, 
  Send, 
  Zap, 
  MapPin, 
  Smile, 
  ChevronRight, 
  ChevronLeft,
  Users,
  Award
} from 'lucide-react';

export const QuantvmMatchView: React.FC = () => {
  const { player, addXpAndMp, playSoundEffect } = usePlayer();
  const [viewMode, setViewMode] = useState<'swipe' | 'grid'>('swipe');
  const [profiles, setProfiles] = useState<DatingProfile[]>(INITIAL_DATING_PROFILES);
  const [currentSwipeIndex, setCurrentSwipeIndex] = useState(0);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  
  // Filter states
  const [maxDistance, setMaxDistance] = useState<number>(5);
  const [selectedIntention, setSelectedIntention] = useState<string>('all');
  const [onlyOnline, setOnlyOnline] = useState<boolean>(false);
  
  // Audio playback state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  
  // Match celebratory modal
  const [matchedProfile, setMatchedProfile] = useState<DatingProfile | null>(null);
  
  // Direct chat drawer
  const [activeChatProfile, setActiveChatProfile] = useState<DatingProfile | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: 'me' | 'them'; text: string; timestamp: string }>>([]);
  const [chatInput, setChatInput] = useState('');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const currentProfile = profiles[currentSwipeIndex];

  const handleSwipe = (direction: 'left' | 'right' | 'super') => {
    if (!currentProfile) return;

    if (direction === 'right' || direction === 'super') {
      playSoundEffect('quest');
      addXpAndMp(direction === 'super' ? 100 : 40, direction === 'super' ? 50 : 20);
      
      // 60% chance of instant match
      if (Math.random() > 0.35 || direction === 'super') {
        setMatchedProfile(currentProfile);
        playSoundEffect('level');
      } else {
        showToast(`¡Le enviaste una resonancia cuántica a ${currentProfile.name}!`);
      }
    } else {
      playSoundEffect('click');
    }

    if (currentSwipeIndex < profiles.length - 1) {
      setCurrentSwipeIndex(prev => prev + 1);
      setActiveGalleryIndex(0);
    } else {
      showToast('¡Has explorado todos los avatares cercanos en este cuadrante!');
      setCurrentSwipeIndex(0);
    }
  };

  const handleTap = (profile: DatingProfile, tapType: 'fire' | 'claw' | 'pulse' | 'heart') => {
    playSoundEffect('click');
    addXpAndMp(15, 10);
    
    setProfiles(prev =>
      prev.map(p => {
        if (p.id === profile.id) {
          return {
            ...p,
            tapsCount: {
              ...p.tapsCount,
              [tapType]: p.tapsCount[tapType] + 1
            }
          };
        }
        return p;
      })
    );

    const tapNames = {
      fire: '🔥 Fuego Cósmico',
      claw: '🐾 Garra de Gremio',
      pulse: '⚡ Pulso Cuántico',
      heart: '💖 Resonancia Afectiva'
    };

    showToast(`Enviaste un toque de ${tapNames[tapType]} a ${profile.name}`);
  };

  const toggleVoiceNote = (profileId: string) => {
    if (playingAudioId === profileId) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(profileId);
      playSoundEffect('portal');
      setTimeout(() => {
        setPlayingAudioId(null);
      }, 5000);
    }
  };

  const handleOpenChat = (profile: DatingProfile) => {
    setActiveChatProfile(profile);
    setChatMessages([
      {
        id: 'msg-1',
        sender: 'them',
        text: `¡Hola ${player.name}! Me alegra que nuestras coordenadas hayan coincidido en MagnopVS. ¿Listo para unas incursiones?`,
        timestamp: 'Hace 5m'
      }
    ]);
    playSoundEffect('click');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeChatProfile) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'me' as const,
      text: chatInput,
      timestamp: 'Ahora'
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    playSoundEffect('click');

    // Simulated reply after 1.5s
    setTimeout(() => {
      const replyOptions = [
        '¡Totalmente de acuerdo! Esa frecuencia resuena perfecto.',
        'Nos vemos en el sector de Shibuya 3000 frente al Templo de Cromo.',
        'Te envié 50 MP como muestra de camaradería cuántica.',
        'Excelente táctica. Vamos a raidear ese nodo juntos.'
      ];
      const randomReply = replyOptions[Math.floor(Math.random() * replyOptions.length)];
      setChatMessages(prev => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          sender: 'them',
          text: randomReply,
          timestamp: 'Ahora'
        }
      ]);
      playSoundEffect('quest');
    }, 1500);
  };

  // Filtered profiles for grid mode
  const filteredProfiles = profiles.filter(p => {
    if (onlyOnline && !p.isOnline) return false;
    if (p.distanceKm > maxDistance) return false;
    if (selectedIntention !== 'all' && p.intentions !== selectedIntention) return false;
    return true;
  });

  return (
    <div className="space-y-6 font-orbitron animate-fade-in relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-[#00f0ff] text-[#05060a] px-4 py-2.5 rounded-xl font-mono text-xs font-bold shadow-[0_0_20px_rgba(0,240,255,0.6)] flex items-center gap-2 animate-bounce">
          <Zap className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Sub-Mode Switcher */}
      <div className="bg-[#05060a]/90 border border-[#00f0ff]/30 p-4 sm:p-5 rounded-3xl shadow-[0_0_25px_rgba(0,240,255,0.1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-audiowide text-lg text-white uppercase flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#ff007f]" />
              Radar & Match Cuántico
            </span>
            <span className="text-[10px] font-mono bg-[#ff007f]/20 border border-[#ff007f]/40 text-[#ff007f] px-2 py-0.5 rounded-full uppercase">
              Radar de Proximidad & Sintonía Cósmica
            </span>
          </div>
          <p className="text-xs text-[#a0a5b5] font-mono mt-1">
            Detecta avatares en tu misma órbita de MagnopVS, haz swipe con resonancia y envía toques directos.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-[#121622] p-1.5 rounded-2xl border border-[#1f2430] font-mono text-xs w-full sm:w-auto">
          <button
            onClick={() => { setViewMode('swipe'); playSoundEffect('click'); }}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
              viewMode === 'swipe'
                ? 'bg-[#ff007f] text-white shadow-[0_0_15px_rgba(255,0,127,0.4)]'
                : 'text-[#a0a5b5] hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Swipe Deck</span>
          </button>

          <button
            onClick={() => { setViewMode('grid'); playSoundEffect('click'); }}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-[#00f0ff] text-[#05060a] shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                : 'text-[#a0a5b5] hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Grid Radar</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. SWIPE DECK MODE (SINTONÍA CUÁNTICA) */}
      {/* ========================================================= */}
      {viewMode === 'swipe' && currentProfile && (
        <div className="max-w-md mx-auto relative font-sans">
          
          {/* Card Container */}
          <div className="bg-[#0b0e14] border-2 border-[#ff007f]/40 rounded-3xl overflow-hidden shadow-[0_0_35px_rgba(255,0,127,0.25)] relative transition-all group">
            
            {/* Gallery Image & Dots */}
            <div className="relative h-[440px] sm:h-[480px] w-full overflow-hidden bg-black select-none">
              <img 
                src={currentProfile.galleryImages[activeGalleryIndex] || currentProfile.avatar} 
                alt={currentProfile.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
              />
              
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-transparent to-black/40" />

              {/* Gallery Image Step Indicators */}
              <div className="absolute top-3 inset-x-4 flex items-center gap-1.5 z-10">
                {currentProfile.galleryImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveGalleryIndex(idx)}
                    className={`h-1.5 flex-1 rounded-full transition-all cursor-pointer ${
                      activeGalleryIndex === idx ? 'bg-[#ff007f] shadow-[0_0_8px_#ff007f]' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>

              {/* Prev / Next photo click triggers */}
              <div 
                className="absolute inset-y-0 left-0 w-1/3 cursor-pointer z-10"
                onClick={() => setActiveGalleryIndex(prev => Math.max(0, prev - 1))}
              />
              <div 
                className="absolute inset-y-0 right-0 w-1/3 cursor-pointer z-10"
                onClick={() => setActiveGalleryIndex(prev => Math.min(currentProfile.galleryImages.length - 1, prev + 1))}
              />

              {/* Online & Distance Badges */}
              <div className="absolute top-8 left-4 flex flex-wrap items-center gap-2 z-10 font-mono text-[11px]">
                {currentProfile.isOnline ? (
                  <span className="bg-[#15ffd1]/20 backdrop-blur-md border border-[#15ffd1]/50 text-[#15ffd1] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(21,255,209,0.3)]">
                    <span className="w-2 h-2 rounded-full bg-[#15ffd1] animate-ping" />
                    En Línea
                  </span>
                ) : (
                  <span className="bg-[#1f2430]/80 backdrop-blur-md border border-white/10 text-[#a0a5b5] px-2.5 py-0.5 rounded-full">
                    Reciente
                  </span>
                )}

                <span className="bg-black/60 backdrop-blur-md border border-white/20 text-white px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#00f0ff]" />
                  {currentProfile.distanceKm < 1 ? `${Math.round(currentProfile.distanceKm * 1000)}m cuánticos` : `${currentProfile.distanceKm} km`}
                </span>
              </div>

              {/* Verified Badge */}
              {currentProfile.verified && (
                <div className="absolute top-8 right-4 z-10 bg-[#00f0ff]/20 backdrop-blur-md border border-[#00f0ff]/50 text-[#00f0ff] p-1.5 rounded-full shadow-[0_0_12px_rgba(0,240,255,0.4)]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}

              {/* Bottom Card Identity Info */}
              <div className="absolute bottom-4 inset-x-5 space-y-2 z-10 font-sans">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl sm:text-3xl font-audiowide text-white font-bold tracking-wide drop-shadow-[0_0_12px_rgba(0,0,0,0.8)]">
                    {currentProfile.name}
                  </h3>
                  <span className="text-lg text-[#ff007f] font-mono font-bold">
                    {currentProfile.age}
                  </span>
                  <span className="text-xs font-mono text-[#00f0ff] bg-[#00f0ff]/20 border border-[#00f0ff]/40 px-2 py-0.5 rounded-md font-bold">
                    LVL {currentProfile.level}
                  </span>
                </div>

                <div className="text-xs text-[#7fffd4] font-mono font-semibold flex items-center gap-2">
                  <span>{currentProfile.title}</span>
                  <span>·</span>
                  <span className="text-white/80">{currentProfile.faction}</span>
                </div>

                <p className="text-xs text-[#e0e5eb] leading-relaxed line-clamp-2">
                  {currentProfile.bio}
                </p>

                {/* Audio Voice Note Button */}
                <button
                  onClick={() => toggleVoiceNote(currentProfile.id)}
                  className={`w-full py-2 px-3 rounded-xl border flex items-center justify-between text-xs font-mono transition-all cursor-pointer ${
                    playingAudioId === currentProfile.id
                      ? 'bg-[#ff007f] text-white border-[#ff007f] shadow-[0_0_15px_rgba(255,0,127,0.5)]'
                      : 'bg-black/50 backdrop-blur-md border-white/20 text-[#00f0ff] hover:border-[#00f0ff]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {playingAudioId === currentProfile.id ? <VolumeX className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
                    <span>{playingAudioId === currentProfile.id ? 'Reproduciendo Frecuencia...' : 'Escuchar Nota de Voz (5s)'}</span>
                  </div>
                  <span className="text-[10px] font-bold text-white/70">
                    {currentProfile.audioDurationSec}s
                  </span>
                </button>
              </div>

            </div>

            {/* Profile Tags & Intentions Footer */}
            <div className="p-4 bg-[#0e121a] border-t border-[#1f2430] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#a0a5b5] uppercase">Buscando:</span>
                <span className="text-[11px] text-[#ff007f] font-bold">{currentProfile.intentions}</span>
              </div>

              {/* Tags Cloud */}
              <div className="flex flex-wrap gap-1.5">
                {currentProfile.tags.map((tag, i) => (
                  <span key={i} className="text-[10px] bg-[#1a2233] text-[#a0c0ff] px-2 py-0.5 rounded-md border border-[#2b3952]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Swipe Action Buttons */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 pt-5">
            
            {/* Pass / Dislike Button */}
            <button
              onClick={() => handleSwipe('left')}
              className="w-14 h-14 rounded-full bg-[#121622] border-2 border-[#ff3366] text-[#ff3366] hover:bg-[#ff3366] hover:text-white transition-all duration-300 flex items-center justify-center shadow-[0_0_20px_rgba(255,51,102,0.2)] hover:scale-110 active:scale-95 cursor-pointer"
              title="Descartar"
            >
              <X className="w-7 h-7" />
            </button>

            {/* Super Like / Resonancia Púrpura */}
            <button
              onClick={() => handleSwipe('super')}
              className="w-12 h-12 rounded-full bg-[#121622] border-2 border-[#b14fff] text-[#b14fff] hover:bg-[#b14fff] hover:text-white transition-all duration-300 flex items-center justify-center shadow-[0_0_20px_rgba(177,79,255,0.2)] hover:scale-110 active:scale-95 cursor-pointer"
              title="Super Resonancia (+100 XP)"
            >
              <Sparkles className="w-6 h-6" />
            </button>

            {/* Like / Match Button */}
            <button
              onClick={() => handleSwipe('right')}
              className="w-14 h-14 rounded-full bg-[#121622] border-2 border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-[#05060a] transition-all duration-300 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:scale-110 active:scale-95 cursor-pointer"
              title="Match Cósmico"
            >
              <Heart className="w-7 h-7 fill-current" />
            </button>

            {/* Direct Message Button */}
            <button
              onClick={() => handleOpenChat(currentProfile)}
              className="w-12 h-12 rounded-full bg-[#121622] border-2 border-[#15ffd1] text-[#15ffd1] hover:bg-[#15ffd1] hover:text-[#05060a] transition-all duration-300 flex items-center justify-center shadow-[0_0_20px_rgba(21,255,209,0.2)] hover:scale-110 active:scale-95 cursor-pointer"
              title="Chat Directo"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 2. GRID PROXIMITY RADAR (RADAR DE PROXIMIDAD CUÁNTICA) */}
      {/* ========================================================= */}
      {viewMode === 'grid' && (
        <div className="space-y-6">
          
          {/* Filter Bar */}
          <div className="bg-[#0b0e14] border border-[#1f2430] p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            
            {/* Distance Slider */}
            <div className="flex items-center gap-3">
              <span className="text-[#a0a5b5] uppercase">Radio Cuántico:</span>
              <input 
                type="range" 
                min={1} 
                max={10} 
                value={maxDistance} 
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="accent-[#00f0ff] cursor-pointer"
              />
              <span className="text-[#00f0ff] font-bold">{maxDistance} km</span>
            </div>

            {/* Intention Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[#a0a5b5] uppercase">Intención:</span>
              <select
                value={selectedIntention}
                onChange={(e) => setSelectedIntention(e.target.value)}
                className="bg-[#121622] border border-[#1f2430] text-white rounded-xl px-3 py-1.5 outline-none focus:border-[#00f0ff]"
              >
                <option value="all">Todas las intenciones</option>
                <option value="Aventuras en Mazmorras">Aventuras en Mazmorras</option>
                <option value="Dúo PvP">Dúo PvP</option>
                <option value="Citas de Silicio">Citas de Silicio</option>
                <option value="Compañero de Gremio">Compañero de Gremio</option>
                <option value="Rolplay Cuántico">Rolplay Cuántico</option>
              </select>
            </div>

            {/* Online only switch */}
            <button
              onClick={() => setOnlyOnline(!onlyOnline)}
              className={`px-3 py-1.5 rounded-xl border font-bold transition-all cursor-pointer ${
                onlyOnline 
                  ? 'bg-[#15ffd1] text-[#05060a] border-[#15ffd1]' 
                  : 'bg-[#121622] text-[#a0a5b5] border-[#1f2430]'
              }`}
            >
              {onlyOnline ? 'Solo En Línea (Activo)' : 'Todos los estados'}
            </button>

          </div>

          {/* Grid of Avatars */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredProfiles.map((profile) => (
              <div 
                key={profile.id}
                className="bg-[#0b0e14] border border-[#1f2430] hover:border-[#00f0ff] rounded-2xl overflow-hidden transition-all group flex flex-col justify-between shadow-lg"
              >
                {/* Photo & Status */}
                <div className="relative aspect-square overflow-hidden bg-black">
                  <img 
                    src={profile.avatar} 
                    alt={profile.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-transparent to-transparent opacity-80" />

                  {/* Online dot & Distance */}
                  <div className="absolute top-2 left-2 flex items-center gap-1 font-mono text-[9px] bg-black/60 px-2 py-0.5 rounded-full border border-white/20">
                    <span className={`w-2 h-2 rounded-full ${profile.isOnline ? 'bg-[#15ffd1] animate-pulse' : 'bg-gray-500'}`} />
                    <span>{profile.distanceKm < 1 ? `${Math.round(profile.distanceKm * 1000)}m` : `${profile.distanceKm}km`}</span>
                  </div>

                  {/* Level Badge */}
                  <div className="absolute top-2 right-2 text-[9px] font-mono font-bold bg-[#ff007f] text-white px-1.5 py-0.5 rounded">
                    LVL {profile.level}
                  </div>

                  {/* Bottom name and age */}
                  <div className="absolute bottom-2 left-2 right-2">
                    <h4 className="text-sm font-audiowide text-white truncate font-bold">
                      {profile.name}, {profile.age}
                    </h4>
                    <span className="text-[10px] font-mono text-[#00f0ff] block truncate">
                      {profile.title}
                    </span>
                  </div>
                </div>

                {/* Taps Bar (Pulsos y Señales Cuánticas) */}
                <div className="p-3 bg-[#0e121a] space-y-2 border-t border-[#1f2430]">
                  <span className="text-[9px] font-mono text-[#a0a5b5] block truncate">
                    {profile.intentions}
                  </span>

                  <div className="flex items-center justify-between gap-1 pt-1 border-t border-[#1f2430]/60">
                    <button
                      onClick={() => handleTap(profile, 'fire')}
                      className="p-1.5 rounded-lg bg-[#1a2233] hover:bg-[#ff3366] text-[#ff3366] hover:text-white transition-all text-xs cursor-pointer"
                      title="Enviar Fuego"
                    >
                      🔥
                    </button>
                    <button
                      onClick={() => handleTap(profile, 'claw')}
                      className="p-1.5 rounded-lg bg-[#1a2233] hover:bg-[#ffaa00] text-[#ffaa00] hover:text-white transition-all text-xs cursor-pointer"
                      title="Enviar Garra"
                    >
                      🐾
                    </button>
                    <button
                      onClick={() => handleTap(profile, 'pulse')}
                      className="p-1.5 rounded-lg bg-[#1a2233] hover:bg-[#00f0ff] text-[#00f0ff] hover:text-[#05060a] transition-all text-xs cursor-pointer"
                      title="Enviar Pulso Cuántico"
                    >
                      ⚡
                    </button>
                    <button
                      onClick={() => handleOpenChat(profile)}
                      className="p-1.5 rounded-lg bg-[#00f0ff] text-[#05060a] font-bold transition-all text-xs cursor-pointer hover:bg-[#7fffd4]"
                      title="Chat Privado"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 3. INSTANT MATCH CELEBRATION MODAL (RESONANCIA ESTABLECIDA) */}
      {/* ========================================================= */}
      {matchedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-fade-in font-orbitron">
          <div className="bg-[#0b0e14] border-2 border-[#ff007f] w-full max-w-lg rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-[0_0_60px_rgba(255,0,127,0.5)] relative">
            
            {/* Match Header */}
            <div className="space-y-2">
              <span className="font-mono text-xs font-bold text-[#ff007f] bg-[#ff007f]/20 border border-[#ff007f]/40 px-3 py-1 rounded-full uppercase tracking-widest inline-block animate-pulse">
                RESONANCIA TOTAL EN MagnopVS
              </span>
              <h2 className="text-3xl sm:text-4xl font-audiowide uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#ff007f] via-[#00f0ff] to-[#15ffd1]">
                ¡MATCH CUÁNTICO!
              </h2>
              <p className="text-xs text-[#bec7d4] font-mono">
                Tú y {matchedProfile.name} se han resonado mutuamente en el multiverso.
              </p>
            </div>

            {/* Overlapping Avatars */}
            <div className="flex items-center justify-center -space-x-6 py-4">
              <div className="w-24 h-24 rounded-full border-4 border-[#00f0ff] overflow-hidden shadow-[0_0_25px_rgba(0,240,255,0.4)] z-10">
                <img 
                  src={player.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80'} 
                  alt="Tú" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-24 h-24 rounded-full border-4 border-[#ff007f] overflow-hidden shadow-[0_0_25px_rgba(255,0,127,0.4)] z-20">
                <img 
                  src={matchedProfile.avatar} 
                  alt={matchedProfile.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Match Actions */}
            <div className="space-y-3 font-mono">
              <button
                onClick={() => {
                  const p = matchedProfile;
                  setMatchedProfile(null);
                  handleOpenChat(p);
                }}
                className="w-full py-3.5 bg-gradient-to-r from-[#ff007f] to-[#00f0ff] text-white font-bold text-xs uppercase rounded-xl transition-all shadow-[0_0_25px_rgba(255,0,127,0.4)] hover:brightness-110 cursor-pointer flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Enviar Mensaje Directo</span>
              </button>

              <button
                onClick={() => setMatchedProfile(null)}
                className="w-full py-3 bg-[#121622] hover:bg-[#1a2233] text-[#bec7d4] hover:text-white font-bold text-xs uppercase rounded-xl transition-all border border-[#1f2430] cursor-pointer"
              >
                Continuar Navegando
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. DIRECT 1-ON-1 CHAT DRAWER */}
      {/* ========================================================= */}
      {activeChatProfile && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#0b0e14] border-l-2 border-[#00f0ff]/50 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col justify-between font-sans animate-fade-in">
          
          {/* Chat Header */}
          <div className="p-4 bg-[#121622] border-b border-[#1f2430] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#00f0ff]">
                <img src={activeChatProfile.avatar} alt={activeChatProfile.name} className="w-full h-full object-cover" />
                {activeChatProfile.isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#15ffd1] rounded-full ring-2 ring-[#121622]" />
                )}
              </div>
              <div>
                <h4 className="font-audiowide text-sm text-white">{activeChatProfile.name}</h4>
                <span className="text-[10px] font-mono text-[#00f0ff]">{activeChatProfile.title}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveChatProfile(null)}
              className="p-2 rounded-full bg-black/40 hover:bg-[#ff3366] text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs">
            {chatMessages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
              >
                <div className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                  msg.sender === 'me'
                    ? 'bg-[#00f0ff] text-[#05060a] font-semibold rounded-br-none shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                    : 'bg-[#1a2233] text-white rounded-bl-none border border-[#2b3952]'
                }`}>
                  {msg.text}
                </div>
                <span className="text-[9px] text-[#a0a5b5] mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 bg-[#121622] border-t border-[#1f2430] flex items-center gap-2 font-mono">
            <input 
              type="text" 
              value={chatInput} 
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={`Escribe un mensaje a ${activeChatProfile.name}...`}
              className="flex-1 bg-[#0b0e14] border border-[#1f2430] focus:border-[#00f0ff] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#88919d] outline-none"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-[#00f0ff] hover:bg-[#7fffd4] text-[#05060a] font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.4)]"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
};
