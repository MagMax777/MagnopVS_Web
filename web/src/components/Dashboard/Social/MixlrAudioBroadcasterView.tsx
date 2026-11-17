import React, { useState } from 'react';
import { usePlayer } from '../../../context/PlayerContext';
import { INITIAL_RADIO_STATIONS, RadioAudioStation } from '../../../data/socialExpandedData';
import { 
  Radio, 
  Mic, 
  MicOff, 
  Volume2, 
  Users, 
  Send, 
  Sparkles, 
  Disc, 
  Share2, 
  Play, 
  Pause, 
  Rss, 
  Activity 
} from 'lucide-react';

export const MixlrAudioBroadcasterView: React.FC = () => {
  const { player, playSoundEffect } = usePlayer();
  const [stations, setStations] = useState<RadioAudioStation[]>(INITIAL_RADIO_STATIONS);
  const [activeStationId, setActiveStationId] = useState('rad-1');
  const [isPlaying, setIsPlaying] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [isSelfBroadcasting, setIsSelfBroadcasting] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);

  const activeStation = stations.find((s) => s.id === activeStationId) || stations[0];

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      id: `c-${Date.now()}`,
      sender: player.name || 'Aetheris (Tú)',
      text: chatInput,
      time: 'Ahora'
    };

    setStations((prev) =>
      prev.map((st) => {
        if (st.id === activeStationId) {
          return { ...st, liveChat: [...st.liveChat, newMsg] };
        }
        return st;
      })
    );

    setChatInput('');
    playSoundEffect('click');
  };

  const handleToggleSelfBroadcast = () => {
    setIsSelfBroadcasting(!isSelfBroadcasting);
    playSoundEffect('quest');
  };

  return (
    <div className="space-y-6 font-orbitron font-mono">
      
      {/* Top Banner - Audio Studio Quantvm Concept */}
      <div className="bg-[#05060a]/90 border border-[#00f0ff]/30 p-5 rounded-3xl shadow-[0_0_25px_rgba(0,240,255,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#00f0ff] animate-pulse" />
            <h3 className="text-sm font-bold font-audiowide text-white uppercase tracking-wider">
              Radio Quantvm & Studio de Audio Directo
            </h3>
          </div>
          <p className="text-[10px] text-[#a0a5b5] max-w-xl">
            Emite tu podcast, sesiones musicales o voz en tiempo real y comparte la señal con oyentes de todo el multiverso MagnopVS.
          </p>
        </div>

        <button
          onClick={handleToggleSelfBroadcast}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs uppercase transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-lg ${
            isSelfBroadcasting
              ? 'bg-[#ff007f] text-white animate-pulse shadow-[0_0_20px_rgba(255,0,127,0.4)]'
              : 'bg-[#00f0ff] text-[#05060a] hover:bg-[#00f0ff]/80 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
          }`}
        >
          {isSelfBroadcasting ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          <span>{isSelfBroadcasting ? 'Detener Emisión' : 'Iniciar Emisión Live Audio'}</span>
        </button>
      </div>

      {/* Broadcast Studio Panel when Self Broadcasting */}
      {isSelfBroadcasting && (
        <div className="bg-[#ff007f]/10 border-2 border-[#ff007f] p-5 rounded-3xl space-y-4 shadow-[0_0_30px_rgba(255,0,127,0.25)] animate-fade-in">
          <div className="flex items-center justify-between border-b border-[#ff007f]/30 pb-3">
            <div className="flex items-center gap-2 text-white">
              <span className="w-3 h-3 rounded-full bg-[#ff007f] animate-ping" />
              <span className="text-xs font-bold font-audiowide text-[#ff007f] uppercase">
                🔴 EN AIRE: {player.name || 'Aetheris'} Studio Live Audio
              </span>
            </div>
            <span className="text-[10px] bg-[#ff007f]/30 text-white px-2 py-0.5 rounded border border-[#ff007f]/50">
              108.9 FM Quantvm Simulcast
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-black/60 p-3 rounded-2xl border border-[#1f2430] flex items-center justify-between">
              <span className="text-[#a0a5b5]">Oyentes en directo:</span>
              <span className="font-bold text-[#00f0ff]">312 Conectados</span>
            </div>

            <div className="bg-black/60 p-3 rounded-2xl border border-[#1f2430] flex items-center justify-between">
              <span className="text-[#a0a5b5]">Micrófono:</span>
              <button
                onClick={() => setIsMicMuted(!isMicMuted)}
                className={`px-3 py-1 rounded-xl text-[10px] font-bold ${isMicMuted ? 'bg-[#ff007f] text-white' : 'bg-[#7fffd4] text-black'}`}
              >
                {isMicMuted ? 'Muteado' : 'Capturando Voz'}
              </button>
            </div>

            <div className="bg-black/60 p-3 rounded-2xl border border-[#1f2430] flex items-center justify-between">
              <span className="text-[#a0a5b5]">Ecualizador 432Hz:</span>
              <span className="text-[#7fffd4] font-bold">Activo</span>
            </div>
          </div>

          {/* Equalizer Visualizer Bars */}
          <div className="flex items-end justify-center gap-1.5 h-12 pt-2">
            {[40, 70, 25, 90, 55, 100, 30, 80, 60, 45, 95, 20, 75, 50].map((h, i) => (
              <div
                key={i}
                className="w-2 rounded-t bg-gradient-to-t from-[#ff007f] to-[#00f0ff] animate-pulse"
                style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Radio Stations Selector & Player Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Radio Stations List */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-[#00f0ff] uppercase tracking-wider flex items-center gap-1.5">
            <Rss className="w-4 h-4 text-[#00f0ff]" />
            Emisoras Activas en Vivo
          </span>

          {stations.map((st) => (
            <div
              key={st.id}
              onClick={() => { setActiveStationId(st.id); playSoundEffect('click'); }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                activeStationId === st.id
                  ? 'bg-[#00f0ff]/15 border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                  : 'bg-[#05060a] border-[#1f2430] hover:border-[#00f0ff]/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#00f0ff]/40 shrink-0 relative">
                  <img src={st.coverArt} alt={st.stationName} className="w-full h-full object-cover" />
                  {st.isLive && (
                    <span className="absolute top-1 left-1 w-2 h-2 rounded-full bg-[#ff007f] animate-ping" />
                  )}
                </div>

                <div className="truncate flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] bg-[#00f0ff]/20 text-[#00f0ff] px-1.5 py-0.2 rounded font-bold">
                      {st.audioFrequency}
                    </span>
                    <span className="text-[9px] text-[#7fffd4] flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {st.listenersCount}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate mt-1">{st.stationName}</h4>
                  <p className="text-[10px] text-[#a0a5b5] truncate">{st.genre}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Center & Right Column: Active Radio Player & Live Listener Chat */}
        <div className="lg:col-span-2 bg-[#05060a]/90 border border-[#1f2430] p-6 rounded-3xl space-y-5 flex flex-col justify-between">
          
          {/* Station Player Banner */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f2430] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-[#00f0ff] overflow-hidden">
                  <img src={activeStation.hostAvatar} alt={activeStation.hostName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{activeStation.stationName}</h3>
                  <p className="text-[10px] text-[#00f0ff]">Conducido por {activeStation.hostName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#7fffd4] bg-[#7fffd4]/10 border border-[#7fffd4]/30 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-bold">
                  <Activity className="w-3 h-3 animate-pulse text-[#7fffd4]" />
                  {activeStation.listenersCount} Oyentes
                </span>
              </div>
            </div>

            {/* Audio Track Visual Player */}
            <div className="bg-[#05060a] border border-[#00f0ff]/30 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border border-[#00f0ff]/50 shrink-0 relative group">
                <img src={activeStation.coverArt} alt="Cover" className="w-full h-full object-cover" />
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center text-[#00f0ff] group-hover:scale-110 transition-transform cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </button>
              </div>

              <div className="flex-1 space-y-1.5 text-center sm:text-left">
                <span className="text-[9px] text-[#ff007f] font-bold uppercase tracking-wider">
                  🔊 Pista Sonora Transmitiéndose
                </span>
                <p className="text-xs font-bold text-white line-clamp-1">{activeStation.currentTrack}</p>
                <div className="text-[10px] text-[#a0a5b5]">{activeStation.broadcastSchedule}</div>

                {/* Animated Audio Equalizer Wave */}
                <div className="flex items-center justify-center sm:justify-start gap-1 pt-1 h-5">
                  {[30, 80, 45, 90, 60, 20, 100, 50, 75, 35].map((h, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded bg-[#00f0ff] ${isPlaying ? 'animate-pulse' : 'opacity-40'}`}
                      style={{ height: isPlaying ? `${h}%` : '20%', animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Live Chat Listener Feed */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-[#f8f9fa] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#00f0ff]" />
              <span>Chat de Oyentes en Vivo</span>
            </span>

            <div className="bg-[#05060a] border border-[#1f2430] p-3 rounded-2xl h-40 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-[#00f0ff]/30 text-xs">
              {activeStation.liveChat.map((msg) => (
                <div key={msg.id} className="flex items-center justify-between text-[11px] bg-black/40 p-2 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#00f0ff]">{msg.sender}:</span>
                    <span className="text-white/90">{msg.text}</span>
                  </div>
                  <span className="text-[9px] text-[#a0a5b5]">{msg.time}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChatMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Escribe un mensaje al aire..."
                className="flex-1 bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] px-3 py-2 rounded-xl text-xs text-white focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#00f0ff] text-[#05060a] font-bold text-xs uppercase rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar</span>
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};
