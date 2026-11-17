import React, { useState } from 'react';
import { usePlayer } from '../../../context/PlayerContext';
import { INITIAL_DISCORD_CHANNELS, DiscordChannel } from '../../../data/socialExpandedData';
import { 
  Hash, 
  Volume2, 
  Send, 
  Paperclip, 
  Smile, 
  Users, 
  Pin, 
  Mic, 
  MicOff, 
  Radio, 
  Check, 
  Sparkles 
} from 'lucide-react';

export const DiscordChannelView: React.FC = () => {
  const { player, playSoundEffect } = usePlayer();
  const [channels, setChannels] = useState<DiscordChannel[]>(INITIAL_DISCORD_CHANNELS);
  const [activeChannelId, setActiveChannelId] = useState('ch-general');
  const [messageInput, setMessageInput] = useState('');
  const [isVoiceConnected, setIsVoiceConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMessage = {
      id: `m-${Date.now()}`,
      authorName: player.name || 'Aetheris (Tú)',
      authorAvatar: player.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
      authorRole: player.title || 'Viajero Cuántico',
      content: messageInput,
      timestamp: 'Ahora mismo',
      reactions: []
    };

    setChannels((prev) =>
      prev.map((ch) => {
        if (ch.id === activeChannelId) {
          return { ...ch, messages: [...ch.messages, newMessage] };
        }
        return ch;
      })
    );

    setMessageInput('');
    playSoundEffect('click');
  };

  const handleToggleReaction = (msgId: string, emoji: string) => {
    setChannels((prev) =>
      prev.map((ch) => {
        if (ch.id === activeChannelId) {
          const updatedMsgs = ch.messages.map((m) => {
            if (m.id === msgId) {
              const existingReact = m.reactions.find((r) => r.emoji === emoji);
              if (existingReact) {
                existingReact.count += 1;
              } else {
                m.reactions.push({ emoji, count: 1, users: [player.name || 'Tú'] });
              }
            }
            return m;
          });
          return { ...ch, messages: updatedMsgs };
        }
        return ch;
      })
    );
    playSoundEffect('click');
  };

  return (
    <div className="bg-[#05060a]/95 border border-[#00f0ff]/30 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,240,255,0.15)] flex flex-col md:flex-row h-[600px] font-orbitron font-mono">
      
      {/* LEFT SIDEBAR: CHANNEL SELECTOR */}
      <div className="w-full md:w-64 bg-[#05060a] border-b md:border-b-0 md:border-r border-[#1f2430] p-4 space-y-4 shrink-0">
        <div className="flex items-center justify-between border-b border-[#1f2430] pb-3 text-xs font-audiowide text-white">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#00f0ff] animate-pulse" />
            <span>Nexo Frecuencias Hub</span>
          </div>
          <span className="text-[9px] bg-[#00f0ff]/20 text-[#00f0ff] px-1.5 py-0.5 rounded border border-[#00f0ff]/40">
            Frecuencia Quantvm
          </span>
        </div>

        {/* Channels List */}
        <div className="space-y-1">
          <span className="text-[10px] text-[#a0a5b5] uppercase tracking-wider font-bold">Canales de Texto</span>
          {channels.filter((c) => c.type === 'text').map((c) => (
            <button
              key={c.id}
              onClick={() => { setActiveChannelId(c.id); playSoundEffect('click'); }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                activeChannelId === c.id
                  ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 font-bold'
                  : 'text-[#a0a5b5] hover:bg-[#1f2430]/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Hash className="w-4 h-4 text-[#00f0ff]" />
                <span className="truncate">{c.name}</span>
              </div>
              {c.unreadCount ? (
                <span className="bg-[#ff007f] text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                  {c.unreadCount}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* Voice Channels Section */}
        <div className="space-y-1 pt-3 border-t border-[#1f2430]">
          <span className="text-[10px] text-[#7fffd4] uppercase tracking-wider font-bold">Canales de Voz</span>
          {channels.filter((c) => c.type === 'voice').map((c) => (
            <div key={c.id} className="space-y-1">
              <button
                onClick={() => {
                  setActiveChannelId(c.id);
                  setIsVoiceConnected(true);
                  playSoundEffect('quest');
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                  activeChannelId === c.id && isVoiceConnected
                    ? 'bg-[#7fffd4]/20 text-[#7fffd4] border border-[#7fffd4]/40 font-bold'
                    : 'text-[#a0a5b5] hover:bg-[#1f2430]/50 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Volume2 className="w-4 h-4 text-[#7fffd4]" />
                  <span className="truncate">{c.name}</span>
                </div>
                <span className="text-[10px] text-[#7fffd4]">
                  {c.activeVoiceUsers?.length || 0} online
                </span>
              </button>

              {/* Connected Users avatars */}
              {c.activeVoiceUsers && c.activeVoiceUsers.length > 0 && (
                <div className="pl-6 space-y-1">
                  {c.activeVoiceUsers.map((u, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[10px] text-white/80">
                      <div className="w-4 h-4 rounded-full overflow-hidden border border-[#7fffd4]">
                        <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="truncate">{u.name}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7fffd4] animate-ping" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Voice Control Widget */}
        {isVoiceConnected && (
          <div className="bg-[#7fffd4]/10 border border-[#7fffd4]/40 p-3 rounded-2xl space-y-2 mt-4 text-xs font-mono text-[#7fffd4]">
            <div className="flex items-center justify-between font-bold">
              <span>Voz Conectada</span>
              <button onClick={() => setIsVoiceConnected(false)} className="text-[#ff007f] hover:underline">
                Desconectar
              </button>
            </div>
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 bg-black rounded-xl text-white flex items-center gap-1.5 cursor-pointer"
              >
                {isMuted ? <MicOff className="w-3.5 h-3.5 text-[#ff007f]" /> : <Mic className="w-3.5 h-3.5 text-[#7fffd4]" />}
                <span className="text-[10px]">{isMuted ? 'Muteado' : 'Micro Activo'}</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* RIGHT CHAT THREAD AREA */}
      <div className="flex-1 flex flex-col justify-between p-4 bg-[#05060a]/80">
        
        {/* Channel Header */}
        <div className="flex items-center justify-between border-b border-[#1f2430] pb-3">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-[#00f0ff]" />
            <div>
              <h4 className="text-sm font-bold text-white">{activeChannel.name}</h4>
              <p className="text-[10px] text-[#a0a5b5] line-clamp-1">{activeChannel.topic}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#a0a5b5]">
            <Pin className="w-4 h-4 text-[#00f0ff]" />
            <span className="hidden sm:inline">Mensajes Fijados</span>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto space-y-4 my-3 pr-2 scrollbar-thin scrollbar-thumb-[#00f0ff]/30">
          {activeChannel.messages.map((m) => (
            <div key={m.id} className="bg-[#05060a] border border-[#1f2430] hover:border-[#00f0ff]/30 p-3 rounded-2xl space-y-2 transition-all">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src={m.authorAvatar} alt={m.authorName} className="w-7 h-7 rounded-full object-cover shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#00f0ff]">{m.authorName}</span>
                      <span className="bg-[#00f0ff]/10 text-[#00f0ff] text-[8px] px-1.5 py-0.2 rounded border border-[#00f0ff]/30">
                        {m.authorRole}
                      </span>
                    </div>
                    <span className="text-[9px] text-[#a0a5b5]">{m.timestamp}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-white leading-relaxed">{m.content}</p>

              {/* Attachments */}
              {m.attachments && m.attachments.length > 0 && (
                <div className="rounded-xl overflow-hidden border border-[#1f2430] max-h-48">
                  <img src={m.attachments[0]} alt="Attachment" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Emoji Reactions Bar */}
              <div className="flex items-center gap-2 pt-1">
                {m.reactions.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => handleToggleReaction(m.id, r.emoji)}
                    className="bg-black border border-[#1f2430] hover:border-[#00f0ff] px-2 py-0.5 rounded-lg text-[10px] text-white flex items-center gap-1 cursor-pointer"
                  >
                    <span>{r.emoji}</span>
                    <span className="font-bold text-[#00f0ff]">{r.count}</span>
                  </button>
                ))}

                <button
                  onClick={() => handleToggleReaction(m.id, '❤️')}
                  className="text-[10px] text-[#a0a5b5] hover:text-[#ff007f] cursor-pointer"
                >
                  + Reaccionar
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Send Message Form */}
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-3 border-t border-[#1f2430]">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder={`Enviar mensaje a #${activeChannel.name}...`}
            className="flex-1 bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] px-3 py-2.5 rounded-xl text-xs text-white focus:outline-none"
          />

          <button
            type="submit"
            className="px-4 py-2.5 bg-[#00f0ff] hover:bg-[#00f0ff]/80 text-[#05060a] font-bold rounded-xl text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </form>

      </div>

    </div>
  );
};
