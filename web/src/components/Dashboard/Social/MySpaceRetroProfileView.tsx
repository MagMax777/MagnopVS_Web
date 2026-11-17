import React, { useState, useRef, useEffect } from 'react';
import { usePlayer } from '../../../context/PlayerContext';
import { MySpaceProfileData, INITIAL_MYSPACE_DATA } from '../../../data/socialExpandedData';
import { 
  Disc, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Flame, 
  Heart, 
  Users, 
  Send, 
  Palette, 
  Radio, 
  MessageSquare,
  Award,
  Zap,
  Check
} from 'lucide-react';

export const MySpaceRetroProfileView: React.FC = () => {
  const { player, addXpAndMp, playSoundEffect } = usePlayer();
  const [profileData, setProfileData] = useState<MySpaceProfileData>(INITIAL_MYSPACE_DATA);
  const [selectedTheme, setSelectedTheme] = useState<'cyberpunk' | 'vaporwave' | 'matrix' | 'gold'>('cyberpunk');
  
  // Audio synthesizer state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Guestbook comment form state
  const [guestName, setGuestName] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [selectedSticker, setSelectedSticker] = useState('✨');

  // Play procedural chiptune synth ambient
  const toggleMusic = () => {
    if (isPlayingAudio) {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
      setIsPlayingAudio(false);
      playSoundEffect('click');
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(432, ctx.currentTime); // 432 Hz frequency
      
      // Periodic pitch modulation (synthwave vibrato)
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(432, now);
      osc.frequency.linearRampToValueAtTime(440, now + 1);
      osc.frequency.linearRampToValueAtTime(432, now + 2);
      osc.frequency.linearRampToValueAtTime(424, now + 3);
      osc.frequency.linearRampToValueAtTime(432, now + 4);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;
      setIsPlayingAudio(true);
      playSoundEffect('portal');
    } catch (e) {
      console.error(e);
      setIsPlayingAudio(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // Pulsos de afinidad handler
  const handleHi5Tap = (type: 'five' | 'sparkle' | 'fire' | 'respect') => {
    playSoundEffect('level');
    addXpAndMp(20, 10);
    
    setProfileData(prev => ({
      ...prev,
      hi5Counters: {
        ...prev.hi5Counters,
        [type]: prev.hi5Counters[type] + 1
      }
    }));
  };

  // Guestbook submission
  const handleGuestbookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestMessage.trim()) return;

    playSoundEffect('quest');
    addXpAndMp(50, 25);

    const newEntry = {
      id: `gb-${Date.now()}`,
      authorName: guestName.trim() || player.name || 'Viajero Anónimo',
      authorAvatar: player.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
      message: `${selectedSticker} ${guestMessage.trim()}`,
      timestamp: 'Ahora mismo'
    };

    setProfileData(prev => ({
      ...prev,
      guestbookEntries: [newEntry, ...prev.guestbookEntries]
    }));

    setGuestMessage('');
  };

  // Theme styling definitions
  const themeClasses = {
    cyberpunk: 'border-[#00f0ff] shadow-[0_0_35px_rgba(0,240,255,0.2)] bg-[#05060a]/95 text-white',
    vaporwave: 'border-[#ff007f] shadow-[0_0_35px_rgba(255,0,127,0.25)] bg-[#120826]/95 text-pink-100',
    matrix: 'border-[#15ffd1] shadow-[0_0_35px_rgba(21,255,209,0.2)] bg-[#00140d]/95 text-emerald-100',
    gold: 'border-[#ffd700] shadow-[0_0_35px_rgba(255,215,0,0.25)] bg-[#1c1503]/95 text-amber-100'
  };

  const accentColor = {
    cyberpunk: '#00f0ff',
    vaporwave: '#ff007f',
    matrix: '#15ffd1',
    gold: '#ffd700'
  }[selectedTheme];

  return (
    <div className="space-y-6 font-mono animate-fade-in">
      
      {/* Theme Switcher & Header Bar */}
      <div className="bg-[#0b0e14] border border-[#1f2430] p-4 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Disc className="w-5 h-5 text-[#ff007f] animate-spin" />
          <span className="font-audiowide text-white uppercase text-sm">
            Perfil Holo-Retro & Top Camaradas
          </span>
          <span className="text-[10px] bg-[#00f0ff]/20 text-[#00f0ff] px-2 py-0.5 rounded border border-[#00f0ff]/40">
            AÑO 3000 MagnopVS
          </span>
        </div>

        {/* Theme Pills */}
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#a0a5b5]" />
          <span className="text-[#a0a5b5] uppercase text-[10px]">Skin:</span>
          {(['cyberpunk', 'vaporwave', 'matrix', 'gold'] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setSelectedTheme(t); playSoundEffect('click'); }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                selectedTheme === t
                  ? 'bg-white text-black font-extrabold shadow-sm'
                  : 'bg-[#121622] text-[#a0a5b5] hover:text-white border border-[#1f2430]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Retro Profile Container */}
      <div className={`border-2 rounded-3xl p-6 sm:p-8 space-y-8 transition-colors duration-500 ${themeClasses[selectedTheme]}`}>
        
        {/* Top Profile Header (Holo-Retro Style) */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b pb-6 border-white/10">
          
          <div className="flex items-center gap-5">
            {/* Owner Avatar with glowing frame */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-white/40 shadow-xl shrink-0">
              <img 
                src={player.avatarUrl || profileData.ownerAvatar} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-[9px] font-bold text-[#15ffd1] rounded">
                ONLINE
              </span>
            </div>

            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-audiowide uppercase tracking-wide text-white">
                {player.name || profileData.ownerName}
              </h1>
              <p className="text-xs italic text-[#7fffd4]">
                {profileData.statusHeadline}
              </p>
              <div className="text-[11px] text-[#a0a5b5] flex flex-wrap gap-2 pt-1">
                <span>Nivel {player.level}</span>
                <span>·</span>
                <span>Facción: {player.faction}</span>
                <span>·</span>
                <span>MagnoPoints: {player.magnoPoints} MP</span>
              </div>
            </div>
          </div>

          {/* Cassette / Audio Synthesizer Player */}
          <div className="w-full md:w-80 bg-black/60 border border-white/20 p-4 rounded-2xl space-y-3 font-mono shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#00f0ff] uppercase font-bold flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5" />
                CANCIÓN DEL PERFIL (432Hz)
              </span>
              <span className="text-[9px] text-[#a0a5b5]">{profileData.profileSong.duration}</span>
            </div>

            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-white truncate">{profileData.profileSong.title}</h4>
              <p className="text-[10px] text-[#a0a5b5] truncate">{profileData.profileSong.artist}</p>
            </div>

            {/* Equalizer Wave Simulation */}
            <div className="flex items-center gap-1 h-6 py-1">
              {[40, 70, 20, 90, 60, 100, 30, 80, 50, 95, 65, 85].map((val, idx) => (
                <div
                  key={idx}
                  className="flex-1 rounded-sm transition-all duration-300"
                  style={{
                    height: isPlayingAudio ? `${Math.max(15, (val * (idx % 2 === 0 ? 1 : 0.7)))}%` : '20%',
                    backgroundColor: isPlayingAudio ? accentColor : '#334155'
                  }}
                />
              ))}
            </div>

            <button
              onClick={toggleMusic}
              className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isPlayingAudio ? (
                <>
                  <Pause className="w-4 h-4 fill-current text-[#ff007f]" />
                  <span>Pausar Música del Perfil</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current text-[#00f0ff]" />
                  <span>Reproducir Sintonía</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Pulsos de Afinidad & Insignias Bar */}
        <div className="bg-black/40 border border-white/10 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div>
            <h3 className="font-bold text-white uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#ffd700]" />
              Medallas & Pulsos Recibidos
            </h3>
            <p className="text-[10px] text-[#a0a5b5]">Haz clic para dejar tu toque en el perfil</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleHi5Tap('five')}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/20 text-white transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
            >
              <span>✋ Pulso:</span>
              <span className="font-bold text-[#00f0ff]">{profileData.hi5Counters.five}</span>
            </button>

            <button
              onClick={() => handleHi5Tap('sparkle')}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/20 text-white transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
            >
              <span>✨ Brillo:</span>
              <span className="font-bold text-[#ffd700]">{profileData.hi5Counters.sparkle}</span>
            </button>

            <button
              onClick={() => handleHi5Tap('fire')}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/20 text-white transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
            >
              <span>🔥 Fuego:</span>
              <span className="font-bold text-[#ff3366]">{profileData.hi5Counters.fire}</span>
            </button>

            <button
              onClick={() => handleHi5Tap('respect')}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/20 text-white transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
            >
              <span>🫡 Respeto:</span>
              <span className="font-bold text-[#15ffd1]">{profileData.hi5Counters.respect}</span>
            </button>
          </div>
        </div>

        {/* TOP 8 AMIGOS & HERMANOS DE ARMAS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2 border-white/10">
            <h2 className="text-lg font-audiowide uppercase text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#00f0ff]" />
              Top 8 Amigos & Hermanos de Armas
            </h2>
            <span className="text-[10px] text-[#a0a5b5] font-mono">Los 8 pilares del alma</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {profileData.top8.map((friend) => (
              <div 
                key={friend.id}
                className="bg-black/50 border border-white/15 hover:border-white/40 p-3 rounded-2xl flex flex-col items-center text-center space-y-2 transition-all hover:scale-103 group"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 group-hover:border-[#00f0ff] transition-all shadow-md">
                  <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white truncate max-w-[120px]">{friend.name}</h4>
                  <span className="text-[9px] text-[#7fffd4] block">{friend.role}</span>
                </div>
                <p className="text-[10px] text-[#bec7d4] italic line-clamp-2">
                  "{friend.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* GUESTBOOK / LIBRO DE FIRMAS */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-audiowide uppercase text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#ff007f]" />
              Libro de Firmas & Muro Retro
            </h2>
            <span className="text-[10px] text-[#a0a5b5] font-mono">
              {profileData.guestbookEntries.length} firmas grabadas
            </span>
          </div>

          {/* Add Signature Form */}
          <form onSubmit={handleGuestbookSubmit} className="bg-black/50 border border-white/15 p-4 rounded-2xl space-y-3">
            <div className="flex items-center gap-3">
              <input 
                type="text" 
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Tu nombre o alias cuántico..."
                className="flex-1 bg-black/60 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/40 outline-none"
              />
              <div className="flex items-center gap-1">
                {['✨', '🔥', '💖', '⚡', '🐉'].map((stk) => (
                  <button
                    key={stk}
                    type="button"
                    onClick={() => setSelectedSticker(stk)}
                    className={`p-1.5 rounded-lg text-sm transition-all cursor-pointer ${
                      selectedSticker === stk ? 'bg-white/20 scale-125' : 'hover:bg-white/10'
                    }`}
                  >
                    {stk}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input 
                type="text" 
                value={guestMessage}
                onChange={(e) => setGuestMessage(e.target.value)}
                placeholder="Escribe una dedicatoria o sticker retro en el muro..."
                className="flex-1 bg-black/60 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/40 outline-none"
                required
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#00f0ff] hover:bg-[#7fffd4] text-[#05060a] font-bold text-xs uppercase transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Firmar (+50 XP)</span>
              </button>
            </div>
          </form>

          {/* Existing Guestbook Signatures */}
          <div className="space-y-3">
            {profileData.guestbookEntries.map((entry) => (
              <div 
                key={entry.id}
                className="bg-black/30 border border-white/10 p-3.5 rounded-2xl flex items-start gap-3.5"
              >
                <img src={entry.authorAvatar} alt={entry.authorName} className="w-10 h-10 rounded-xl object-cover border border-white/20 shrink-0" />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-white">{entry.authorName}</h5>
                    <span className="text-[9px] text-[#a0a5b5]">{entry.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#e0e5eb] leading-relaxed">
                    {entry.message}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
