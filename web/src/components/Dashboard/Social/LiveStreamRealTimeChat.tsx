import React, { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../../../context/PlayerContext';
import { LiveChatMessage, LiveChatRoom, DirectMessage, WalletCurrency } from '../../../types';
import { 
  Radio, 
  Send, 
  Heart, 
  Sparkles, 
  Coins, 
  Flame, 
  MessageSquare, 
  Lock, 
  Globe, 
  Users, 
  Shield, 
  Crown, 
  Zap, 
  Gift, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  X,
  Volume2,
  Tv,
  Swords
} from 'lucide-react';

export const LiveStreamRealTimeChat: React.FC = () => {
  const { player, playSoundEffect, spendCurrency } = usePlayer();

  // Tab mode: 'stream_chat' or 'whispers'
  const [activeChatMode, setActiveChatMode] = useState<'stream_chat' | 'whispers'>('stream_chat');

  // Stream Rooms
  const [rooms, setRooms] = useState<LiveChatRoom[]>([
    {
      id: 'room-global-live',
      name: 'Transmisión Central Quantvm',
      slug: 'global-live',
      type: 'live',
      description: 'Transmisión transmedia estelar del Nexo Central con Sof.IA y exploradores cósmicos.',
      activeStreamer: 'Sof.IA & CBC',
      streamTitle: 'Noche de Sintonía Cósmica y Revelaciones del Atlas',
      viewerCount: 1420,
      isLive: true,
      bannerUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
      category: 'Transmisión Oficial',
    },
    {
      id: 'room-quantvm-arena',
      name: 'Quantvm Arena: Batalla PK',
      slug: 'quantvm-arena',
      type: 'live',
      description: 'Duelos en vivo de Arquitectos vs Nómadas. Apoya con propinas de MP o µC a tu facción.',
      activeStreamer: 'Kaelen Voidwalker',
      streamTitle: 'Desafío de Resonancia: Tejedores vs Nómadas',
      viewerCount: 890,
      isLive: true,
      bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
      category: 'PK Streamers',
    },
    {
      id: 'room-cyber-shibuya',
      name: 'Cyber-Shibuya Lo-Fi Lounge',
      slug: 'cyber-shibuya',
      type: 'public',
      description: 'Música sintetizada, tertulia transmedia y descanso de viajeros del multiverso.',
      activeStreamer: 'DJ Lyra Plasmit',
      streamTitle: 'Sintetizadores Cuánticos para Sintonizar el Alma',
      viewerCount: 540,
      isLive: true,
      bannerUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
      category: 'Música & Relax',
    },
    {
      id: 'room-streamers-pk',
      name: 'Sala de Creadores MagnopVS',
      slug: 'streamers-pk',
      type: 'live',
      description: 'Demostraciones de MCDS MetaAssets, cómics transmedia y diseño en vivo.',
      activeStreamer: 'Aurelia Astra',
      streamTitle: 'Modelando Viñetas Holográficas en Vivo',
      viewerCount: 320,
      isLive: true,
      bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
      category: 'Arte & MCDS',
    },
  ]);

  const [selectedRoomId, setSelectedRoomId] = useState<string>('room-global-live');
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  
  // Floating reactions physics
  const [floatingReactions, setFloatingReactions] = useState<Array<{ id: number; emoji: string; left: number }>>([]);
  const [reactionCombo, setReactionCombo] = useState<number>(0);
  const comboTimerRef = useRef<any>(null);

  // Tip Modal State
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  const [tipAlert, setTipAlert] = useState<{ sender: string; amount: number; currency: WalletCurrency; text: string } | null>(null);

  // Whispers / Direct Messages State
  const [dms, setDms] = useState<DirectMessage[]>([]);
  const [selectedDmContact, setSelectedDmContact] = useState<{ id: string; name: string; avatar: string }>({
    id: 'usr-valkyrie',
    name: 'Valkyrie_Nova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  });
  const [inputDmMessage, setInputDmMessage] = useState<string>('');

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const dmContainerRef = useRef<HTMLDivElement>(null);

  const currentRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];

  // Fetch Rooms & Messages from backend
  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/chat/rooms/${selectedRoomId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (e) {
      console.warn('Using offline chat messages:', e);
    }
  };

  const fetchDms = async () => {
    try {
      const res = await fetch(`/api/chat/dms/${player.id}`);
      if (res.ok) {
        const data = await res.json();
        setDms(data);
      }
    } catch (e) {
      console.warn('Using offline direct messages:', e);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedRoomId]);

  useEffect(() => {
    fetchDms();
    const interval = setInterval(fetchDms, 4000);
    return () => clearInterval(interval);
  }, [player.id]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (dmContainerRef.current) {
      dmContainerRef.current.scrollTop = dmContainerRef.current.scrollHeight;
    }
  }, [dms]);

  // Trigger floating reaction
  const handleSpawnReaction = (emoji: string) => {
    playSoundEffect('click');
    const newReaction = {
      id: Date.now() + Math.random(),
      emoji,
      left: Math.floor(Math.random() * 60) + 20, // 20% to 80%
    };
    setFloatingReactions((prev) => [...prev, newReaction]);
    setReactionCombo((prev) => prev + 1);

    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => {
      setReactionCombo(0);
    }, 1500);

    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
    }, 2000);
  };

  // Send Public Message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const content = inputMessage.trim();
    setInputMessage('');
    playSoundEffect('click');

    const optimisticMsg: LiveChatMessage = {
      id: `msg-${Date.now()}`,
      roomId: selectedRoomId,
      senderId: player.id,
      senderName: player.name || 'Neo_Aether',
      senderAvatar: player.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
      senderRole: 'player',
      senderLevel: player.level,
      senderFaction: player.faction,
      content,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      await fetch(`/api/chat/rooms/${selectedRoomId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: player.id,
          senderName: player.name,
          senderAvatar: player.avatarUrl,
          senderRole: 'player',
          senderLevel: player.level,
          senderFaction: player.faction,
          content,
        }),
      });
    } catch (e) {
      console.warn('Offline chat submit:', e);
    }
  };

  // Send Tip / Super Chat
  const handleSendTip = async (amount: number, currency: WalletCurrency) => {
    setIsTipModalOpen(false);

    // Verify balance
    if (currency === 'MP' && player.magnoPoints < amount) {
      alert(`No tienes suficientes MagnoPoints (${player.magnoPoints.toLocaleString()} MP disponibles).`);
      return;
    }
    if (currency === 'MICROCOIN' && (player.microCoins || 0) < amount) {
      alert(`No tienes suficientes MicroCoins (${player.microCoins || 0} µC disponibles).`);
      return;
    }

    playSoundEffect('level');

    // Deduct via wallet spend
    await spendCurrency(
      currency,
      amount,
      'LIVE_TIP',
      `Super Propina en vivo de ${amount} ${currency === 'MP' ? 'MP' : 'MicroCoins'} para ${currentRoom.activeStreamer}`,
      selectedRoomId
    );

    // Show celebration alert
    setTipAlert({
      sender: player.name || 'Neo_Aether',
      amount,
      currency,
      text: currency === 'MICROCOIN' 
        ? `¡Envió una donación cósmica de ${amount} MicroCoins (µC)! 💎✨`
        : `¡Envió una propina de ${amount.toLocaleString()} MagnoPoints (MP)! ⚡`
    });

    setTimeout(() => {
      setTipAlert(null);
    }, 4500);

    // Post to live chat
    try {
      await fetch(`/api/chat/rooms/${selectedRoomId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: player.id,
          senderName: player.name,
          senderAvatar: player.avatarUrl,
          senderRole: 'vip',
          senderLevel: player.level,
          senderFaction: player.faction,
          content: currency === 'MICROCOIN'
            ? `💎 ¡SUPER DONACIÓN de ${amount} MicroCoins (µC) para ${currentRoom.activeStreamer}! ¡Gloria a ${player.faction}! 🚀`
            : `⚡ ¡Propina de ${amount.toLocaleString()} MP enviada para encender la sintonía estelar!`,
          tipAmount: amount,
          tipCurrency: currency,
        }),
      });
      fetchMessages();
    } catch (e) {
      console.warn(e);
    }
  };

  // Send Direct Message (Whisper)
  const handleSendDm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputDmMessage.trim()) return;

    const content = inputDmMessage.trim();
    setInputDmMessage('');
    playSoundEffect('click');

    const newDm: DirectMessage = {
      id: `dm-${Date.now()}`,
      senderId: player.id,
      recipientId: selectedDmContact.id,
      senderName: player.name || 'Neo_Aether',
      senderAvatar: player.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
      recipientName: selectedDmContact.name,
      recipientAvatar: selectedDmContact.avatar,
      content,
      isRead: true,
      createdAt: new Date().toISOString(),
    };

    setDms((prev) => [...prev, newDm]);

    try {
      await fetch('/api/chat/dms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDm),
      });
    } catch (e) {
      console.warn('Offline DM sent:', e);
    }
  };

  return (
    <div className="rounded-2xl bg-[#05060a] border border-[#00f0ff]/30 shadow-[0_0_35px_rgba(0,240,255,0.15)] overflow-hidden font-orbitron flex flex-col h-[750px] relative">
      
      {/* 1. Top Mode Switcher Bar */}
      <div className="bg-[#0a0b12] border-b border-[#1f2430] p-3 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveChatMode('stream_chat');
              playSoundEffect('click');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-audiowide uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeChatMode === 'stream_chat'
                ? 'bg-[#00f0ff] text-[#05060a] font-black shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                : 'text-[#a0a5b5] hover:text-[#f8f9fa] hover:bg-[#1f2430]'
            }`}
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Chat En Vivo del Stream</span>
          </button>

          <button
            onClick={() => {
              setActiveChatMode('whispers');
              playSoundEffect('click');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-audiowide uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeChatMode === 'whispers'
                ? 'bg-[#ff007f] text-[#f8f9fa] font-black shadow-[0_0_15px_rgba(255,0,127,0.4)]'
                : 'text-[#a0a5b5] hover:text-[#f8f9fa] hover:bg-[#1f2430]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Susurros / Mensajes Privados</span>
            {dms.filter(d => !d.isRead && d.senderId !== player.id).length > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
            )}
          </button>
        </div>

        {/* Room selector in live mode */}
        {activeChatMode === 'stream_chat' && (
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {rooms.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setSelectedRoomId(r.id);
                  playSoundEffect('click');
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  selectedRoomId === r.id
                    ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]'
                    : 'bg-[#121624] text-[#a0a5b5] border border-[#1f2430] hover:border-[#00f0ff]/40'
                }`}
              >
                #{r.slug}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Main Content Area */}
      {activeChatMode === 'stream_chat' ? (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left: Stream Viewport & Stage */}
          <div className="md:w-5/12 bg-[#090b14] border-r border-[#1f2430] flex flex-col justify-between p-4 sm:p-5 relative overflow-hidden shrink-0">
            {/* Stream Backdrop Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none"
              style={{ backgroundImage: `url('${currentRoom.bannerUrl}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090b14] via-[#090b14]/80 to-transparent pointer-events-none" />

            {/* Top Stream Info */}
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#ff007f] text-white font-black text-[9px] font-mono tracking-widest uppercase flex items-center gap-1 shadow-[0_0_12px_rgba(255,0,127,0.5)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    LIVE
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#05060a]/80 text-[#7fffd4] font-mono text-[10px] border border-[#7fffd4]/30 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {currentRoom.viewerCount.toLocaleString()} espectadores
                  </span>
                </div>

                <span className="text-[10px] text-[#00f0ff] font-mono font-bold uppercase">
                  {currentRoom.category}
                </span>
              </div>

              {/* Host Profile */}
              <div className="flex items-center gap-3 bg-[#05060a]/80 backdrop-blur-md p-3 rounded-xl border border-[#00f0ff]/30">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#00f0ff] shrink-0">
                  <img src={currentRoom.bannerUrl} alt="Host" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#7fffd4] border-2 border-[#05060a]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs text-[#00f0ff] font-bold font-audiowide uppercase">
                    <Crown className="w-3.5 h-3.5 text-[#ffaa00]" />
                    <span className="truncate">{currentRoom.activeStreamer}</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#f8f9fa] truncate font-sans">
                    {currentRoom.streamTitle}
                  </h4>
                </div>
              </div>
            </div>

            {/* Center Animated Stage / Sound Visualizer */}
            <div className="relative z-10 my-4 text-center space-y-3">
              <div className="flex items-center justify-center gap-1 h-12">
                {[40, 75, 20, 90, 60, 100, 45, 80, 30, 95, 65, 35].map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-gradient-to-t from-[#00f0ff] to-[#ff007f] rounded-full animate-pulse"
                    style={{
                      height: `${h}%`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '0.8s',
                    }}
                  />
                ))}
              </div>

              {/* PK Battle Resonator Bar */}
              <div className="bg-[#05060a]/80 p-3 rounded-xl border border-[#1f2430]">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold mb-1.5">
                  <span className="text-[#00f0ff] flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Arquitectos (68%)
                  </span>
                  <span className="text-[#ff007f] flex items-center gap-1">
                    Nómadas (32%) <Swords className="w-3 h-3" />
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#121624] overflow-hidden flex">
                  <div className="h-full bg-gradient-to-r from-[#00f0ff] to-[#0072ff] w-[68%]" />
                  <div className="h-full bg-gradient-to-r from-[#ff007f] to-[#ffaa00] w-[32%]" />
                </div>
              </div>
            </div>

            {/* Bottom Stream Actions */}
            <div className="relative z-10 flex items-center gap-2">
              <button
                onClick={() => {
                  playSoundEffect('click');
                  setIsTipModalOpen(true);
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#ff007f] to-[#8a2be2] hover:brightness-110 text-white font-audiowide text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,0,127,0.4)] cursor-pointer transition-all"
              >
                <Gift className="w-4 h-4" />
                <span>Super Donación / Tip</span>
              </button>
            </div>

          </div>

          {/* Right: Waterfall Live Chat Feed */}
          <div className="md:w-7/12 flex-1 flex flex-col bg-[#05060a] relative overflow-hidden">
            
            {/* Top Stream Celebration Banner */}
            {tipAlert && (
              <div className="absolute top-2 left-4 right-4 z-30 p-3 bg-gradient-to-r from-[#ff007f] via-[#8a2be2] to-[#00f0ff] text-white font-audiowide text-xs rounded-xl shadow-[0_0_30px_rgba(255,0,127,0.6)] animate-bounce flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-white" />
                  <div>
                    <strong className="block uppercase text-[11px] tracking-wider">{tipAlert.sender}</strong>
                    <span className="font-sans text-[11px] font-normal">{tipAlert.text}</span>
                  </div>
                </div>
                <span className="px-2 py-1 bg-black/40 rounded-lg text-xs font-mono font-bold">
                  +{tipAlert.amount} {tipAlert.currency}
                </span>
              </div>
            )}

            {/* Chat Messages List */}
            <div 
              ref={chatContainerRef}
              className="flex-1 p-4 overflow-y-auto space-y-2.5 custom-scrollbar text-xs font-mono"
            >
              {messages.map((m) => {
                const isStreamer = m.senderRole === 'streamer' || m.senderRole === 'cosmic';
                const isVip = m.senderRole === 'vip';
                const hasTip = m.tipAmount && m.tipAmount > 0;

                return (
                  <div
                    key={m.id}
                    className={`p-2.5 rounded-xl transition-all ${
                      hasTip
                        ? 'bg-gradient-to-r from-[#ff007f]/20 via-[#8a2be2]/20 to-transparent border border-[#ff007f]/50 shadow-[0_0_15px_rgba(255,0,127,0.2)]'
                        : 'bg-[#0a0b12]/80 hover:bg-[#121624] border border-[#1f2430]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {/* Sender Avatar */}
                      <img 
                        src={m.senderAvatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80'} 
                        alt={m.senderName} 
                        className="w-5 h-5 rounded-full object-cover border border-[#00f0ff]/40 shrink-0" 
                      />

                      {/* Level Badge */}
                      <span className="text-[9px] px-1.5 py-0.2 bg-[#00f0ff]/15 text-[#00f0ff] rounded font-bold">
                        LVL {m.senderLevel || 1}
                      </span>

                      {/* VIP or Streamer Badge */}
                      {isStreamer && (
                        <span className="text-[9px] px-1.5 py-0.2 bg-[#ff007f] text-white rounded font-bold uppercase">
                          STREAMER
                        </span>
                      )}
                      {isVip && (
                        <span className="text-[9px] px-1.5 py-0.2 bg-[#ffaa00] text-black rounded font-bold uppercase flex items-center gap-0.5">
                          <Crown className="w-2.5 h-2.5" /> VIP
                        </span>
                      )}

                      {/* Name */}
                      <span className={`font-bold font-audiowide text-[11px] ${
                        isStreamer ? 'text-[#ff007f]' : isVip ? 'text-[#ffaa00]' : 'text-[#7fffd4]'
                      }`}>
                        {m.senderName}
                      </span>

                      {/* Tip Badge */}
                      {hasTip && (
                        <span className="ml-auto px-2 py-0.5 rounded-full bg-[#ff007f] text-white text-[9px] font-bold shadow-md">
                          ⚡ DONÓ {m.tipAmount} {m.tipCurrency}
                        </span>
                      )}
                    </div>

                    <p className={`text-xs pl-7 leading-relaxed font-sans ${
                      hasTip ? 'text-white font-bold' : 'text-[#e2e8f0]'
                    }`}>
                      {m.content}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Floating Emojis Reaction Canvas */}
            <div className="absolute right-4 bottom-20 w-24 h-64 pointer-events-none overflow-hidden z-20">
              {floatingReactions.map((r) => (
                <div
                  key={r.id}
                  className="absolute bottom-0 text-2xl animate-fade-in-up transition-all"
                  style={{
                    left: `${r.left}%`,
                    animation: 'floatUp 1.8s ease-out forwards',
                  }}
                >
                  {r.emoji}
                </div>
              ))}
            </div>

            {/* Quick Reactions Bar */}
            <div className="px-4 py-1.5 bg-[#0a0b12] border-t border-[#1f2430] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#a0a5b5] uppercase">Reaccionar:</span>
                {['💙', '🔥', '💎', '🚀', '✨'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleSpawnReaction(emoji)}
                    className="p-1.5 hover:scale-125 transition-transform cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {reactionCombo > 0 && (
                <span className="text-[10px] font-black font-audiowide text-[#ff007f] animate-pulse">
                  x{reactionCombo} COMBO!
                </span>
              )}
            </div>

            {/* Message Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-[#0a0b12] border-t border-[#1f2430] flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Enviar un mensaje al stream cósmico..."
                className="flex-1 bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] px-4 py-2.5 rounded-xl text-xs text-[#f8f9fa] placeholder-[#a0a5b5] font-mono focus:outline-none transition-all"
              />

              <button
                type="button"
                onClick={() => setIsTipModalOpen(true)}
                className="p-2.5 bg-[#ff007f]/20 hover:bg-[#ff007f]/30 border border-[#ff007f]/50 text-[#ff007f] rounded-xl cursor-pointer"
                title="Super Chat / Propina"
              >
                <Gift className="w-4 h-4" />
              </button>

              <button
                type="submit"
                className="px-4 py-2.5 bg-[#00f0ff] hover:bg-[#7fffd4] text-[#05060a] font-black rounded-xl text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.4)]"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

        </div>
      ) : (
        /* 1-on-1 Whispers / Direct Messages */
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Contacts Sidebar */}
          <div className="md:w-4/12 bg-[#090b14] border-r border-[#1f2430] flex flex-col p-4 shrink-0">
            <span className="text-[10px] text-[#00f0ff] font-mono uppercase font-bold tracking-wider mb-3">
              Canales Privados de Transmisión
            </span>

            <div className="space-y-1.5 overflow-y-auto custom-scrollbar flex-1">
              {[
                { id: 'usr-valkyrie', name: 'Valkyrie_Nova', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', status: 'En Vivo en Quantvm Arena' },
                { id: 'sys-sofia', name: 'SOF.IA Conscious Engine', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80', status: 'Conexión Neuronal Activa' },
                { id: 'usr-zenith', name: 'Zenith_Coder', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80', status: 'Explorando Eleusis Path' }
              ].map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => {
                    setSelectedDmContact(contact);
                    playSoundEffect('click');
                  }}
                  className={`p-3 rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
                    selectedDmContact.id === contact.id
                      ? 'bg-[#00f0ff]/20 border border-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                      : 'bg-[#05060a] border border-[#1f2430] hover:border-[#00f0ff]/30'
                  }`}
                >
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#00f0ff] shrink-0">
                    <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#7fffd4] border border-[#05060a]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#f8f9fa] truncate font-audiowide">
                      {contact.name}
                    </h4>
                    <p className="text-[10px] text-[#a0a5b5] font-mono truncate">
                      {contact.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Whispers Chat Thread */}
          <div className="md:w-8/12 flex-1 flex flex-col bg-[#05060a]">
            {/* Header */}
            <div className="p-3 bg-[#0a0b12] border-b border-[#1f2430] flex items-center gap-3">
              <img src={selectedDmContact.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-[#00f0ff]" />
              <div>
                <h4 className="text-xs font-bold text-[#f8f9fa] font-audiowide">
                  Canal Encriptado con {selectedDmContact.name}
                </h4>
                <span className="text-[9px] text-[#7fffd4] font-mono">Resonancia Cuántica P2P</span>
              </div>
            </div>

            {/* Messages Thread */}
            <div 
              ref={dmContainerRef}
              className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar text-xs font-mono"
            >
              {dms
                .filter(d => (d.senderId === selectedDmContact.id && d.recipientId === player.id) || (d.senderId === player.id && d.recipientId === selectedDmContact.id) || selectedDmContact.id === 'usr-valkyrie')
                .map((dm) => {
                  const isMine = dm.senderId === player.id;
                  return (
                    <div
                      key={dm.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`p-3 rounded-2xl max-w-[80%] font-sans ${
                        isMine
                          ? 'bg-[#00f0ff] text-[#05060a] font-bold rounded-tr-none shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                          : 'bg-[#121624] text-white border border-[#1f2430] rounded-tl-none'
                      }`}>
                        <p>{dm.content}</p>
                      </div>
                      <span className="text-[9px] text-[#a0a5b5] mt-1 font-mono">
                        {new Date(dm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
            </div>

            {/* Direct Message Input */}
            <form onSubmit={handleSendDm} className="p-3 bg-[#0a0b12] border-t border-[#1f2430] flex items-center gap-2">
              <input
                type="text"
                value={inputDmMessage}
                onChange={(e) => setInputDmMessage(e.target.value)}
                placeholder={`Susurrar a ${selectedDmContact.name}...`}
                className="flex-1 bg-[#05060a] border border-[#1f2430] focus:border-[#ff007f] px-4 py-2.5 rounded-xl text-xs text-[#f8f9fa] placeholder-[#a0a5b5] font-mono focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#ff007f] hover:bg-[#ff007f]/80 text-white font-bold rounded-xl text-xs uppercase cursor-pointer shadow-[0_0_12px_rgba(255,0,127,0.4)]"
              >
                Enviar
              </button>
            </form>
          </div>

        </div>
      )}

      {/* 3. Tipping & Super Donation Modal */}
      {isTipModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05060a]/90 backdrop-blur-md animate-fade-in font-orbitron">
          <div className="relative w-full max-w-md bg-[#0a0b12] border-2 border-[#ff007f] p-6 sm:p-7 rounded-2xl shadow-[0_0_40px_rgba(255,0,127,0.35)] flex flex-col clip-corner">
            
            <button
              onClick={() => setIsTipModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#a0a5b5] hover:text-[#f8f9fa] rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[#ff007f]/20 text-[#ff007f] border border-[#ff007f] rounded-xl shadow-[0_0_15px_rgba(255,0,127,0.4)]">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black font-audiowide text-[#f8f9fa] uppercase">
                  Enviar Super Propina
                </h3>
                <p className="text-xs text-[#a0a5b5] font-mono">
                  Destaca tu mensaje en pantalla y apoya a tu streamer favorito en MagnopVS.
                </p>
              </div>
            </div>

            {/* Current Player Balances */}
            <div className="grid grid-cols-2 gap-2 p-3 bg-[#05060a] border border-[#1f2430] rounded-xl mb-4 font-mono text-xs">
              <div>
                <span className="text-[#a0a5b5] block">Tus MagnoPoints:</span>
                <span className="text-[#00f0ff] font-bold">{player.magnoPoints.toLocaleString()} MP</span>
              </div>
              <div className="text-right">
                <span className="text-[#a0a5b5] block">Tus MicroCoins:</span>
                <span className="text-[#ff007f] font-bold">{(player.microCoins || 0).toLocaleString()} µC</span>
              </div>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#a0a5b5] block">
                Selecciona una recompensa virtual:
              </span>

              {/* MagnoPoints tips */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSendTip(100, 'MP')}
                  className="p-3 bg-[#05060a] hover:bg-[#00f0ff]/10 border border-[#00f0ff]/40 rounded-xl text-left transition-all cursor-pointer"
                >
                  <div className="text-xs font-bold text-[#00f0ff] font-mono">100 MP</div>
                  <div className="text-[10px] text-[#a0a5b5]">Propina Básica</div>
                </button>

                <button
                  onClick={() => handleSendTip(500, 'MP')}
                  className="p-3 bg-[#05060a] hover:bg-[#00f0ff]/10 border border-[#00f0ff]/40 rounded-xl text-left transition-all cursor-pointer"
                >
                  <div className="text-xs font-bold text-[#00f0ff] font-mono">500 MP</div>
                  <div className="text-[10px] text-[#a0a5b5]">Resonancia Media</div>
                </button>
              </div>

              {/* MicroCoins tips */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <button
                  onClick={() => handleSendTip(1, 'MICROCOIN')}
                  className="p-3 bg-[#120a17] hover:bg-[#ff007f]/20 border border-[#ff007f]/50 rounded-xl text-left transition-all cursor-pointer"
                >
                  <div className="text-xs font-black text-[#ff007f] font-mono">1 µC</div>
                  <div className="text-[9px] text-[#a0a5b5]">Alerta Destacada</div>
                </button>

                <button
                  onClick={() => handleSendTip(2, 'MICROCOIN')}
                  className="p-3 bg-[#120a17] hover:bg-[#ff007f]/20 border border-[#ff007f]/50 rounded-xl text-left transition-all cursor-pointer"
                >
                  <div className="text-xs font-black text-[#ff007f] font-mono">2 µC</div>
                  <div className="text-[9px] text-[#a0a5b5]">Super Donación</div>
                </button>

                <button
                  onClick={() => handleSendTip(5, 'MICROCOIN')}
                  className="p-3 bg-[#120a17] hover:bg-[#ff007f]/20 border border-[#ff007f]/50 rounded-xl text-left transition-all cursor-pointer"
                >
                  <div className="text-xs font-black text-[#ff007f] font-mono">5 µC</div>
                  <div className="text-[9px] text-[#a0a5b5]">Efecto Cósmico</div>
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsTipModalOpen(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-[#05060a] text-[#a0a5b5] hover:text-[#f8f9fa] border border-[#1f2430] text-xs font-mono"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
