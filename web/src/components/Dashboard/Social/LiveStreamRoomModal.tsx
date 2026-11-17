import React, { useState } from 'react';
import { usePlayer } from '../../../context/PlayerContext';
import { LiveStreamRoom, VIRTUAL_GIFTS, LiveGift } from '../../../data/socialExpandedData';
import { 
  X, 
  Users, 
  Heart, 
  Send, 
  Gift, 
  Swords, 
  Flame, 
  Sparkles, 
  ShieldAlert, 
  Radio, 
  MessageSquare,
  Trophy
} from 'lucide-react';

interface LiveStreamRoomModalProps {
  room: LiveStreamRoom | null;
  isOpen: boolean;
  onClose: () => void;
  onSendGift: (gift: LiveGift, roomId: string) => void;
}

export const LiveStreamRoomModal: React.FC<LiveStreamRoomModalProps> = ({
  room,
  isOpen,
  onClose,
  onSendGift
}) => {
  const { player, addXpAndMp, playSoundEffect } = usePlayer();
  const [commentText, setCommentText] = useState('');
  const [activeComments, setActiveComments] = useState(room?.comments || []);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; left: number }[]>([]);
  const [hostScore, setHostScore] = useState(room?.pkHostScore || 21900);
  const [activeGiftBanner, setActiveGiftBanner] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSeatedOnStage, setIsSeatedOnStage] = useState(false);
  const [guestSeats, setGuestSeats] = useState<Array<{ id: number; name: string; avatar: string; isOccupied: boolean; isMuted: boolean }>>([
    { id: 1, name: 'Kaelen', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', isOccupied: true, isMuted: false },
    { id: 2, name: 'Thorsten', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80', isOccupied: true, isMuted: true },
    { id: 3, name: 'Asiento Libre', avatar: '', isOccupied: false, isMuted: true },
    { id: 4, name: 'Asiento Libre', avatar: '', isOccupied: false, isMuted: true }
  ]);

  if (!isOpen || !room) return null;

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: `lc-${Date.now()}`,
      senderName: player.name || 'Aetheris (Tú)',
      senderAvatar: player.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
      text: commentText,
      timestamp: 'Ahora mismo'
    };

    setActiveComments((prev) => [...prev, newComment]);
    setCommentText('');
    playSoundEffect('click');
  };

  const handleHeartClick = () => {
    const newHeart = { id: Date.now(), left: Math.random() * 60 + 20 };
    setFloatingHearts((prev) => [...prev, newHeart]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1500);
    playSoundEffect('click');
  };

  const handleGiveGift = (gift: LiveGift) => {
    if (player.magnoPoints < gift.costMp) {
      setErrorMessage(`No tienes suficientes MagnoPoints (${player.magnoPoints}/${gift.costMp} MP). ¡Gana más realizando misiones en MagnopVS!`);
      setTimeout(() => setErrorMessage(null), 3500);
      return;
    }

    // Spend MP and gain XP
    addXpAndMp(30, -gift.costMp);

    // Show floating broadcast banner
    setActiveGiftBanner(`¡${player.name || 'Aetheris'} envió un ${gift.name} ${gift.icon} (+${gift.costMp * 10} pts)!`);
    setTimeout(() => setActiveGiftBanner(null), 3000);

    // Add gift comment
    const giftComment = {
      id: `gift-${Date.now()}`,
      senderName: player.name || 'Aetheris (Tú)',
      senderAvatar: player.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
      text: `¡Envió un regalo virtual de alto calibre: ${gift.name} ${gift.icon}!`,
      giftName: gift.name,
      giftIcon: gift.icon,
      timestamp: 'Ahora mismo'
    };

    setActiveComments((prev) => [...prev, giftComment]);
    setHostScore((prev) => prev + gift.costMp * 10);
    onSendGift(gift, room.id);
    playSoundEffect('level');
  };

  const toggleTakeSeat = () => {
    playSoundEffect('quest');
    if (isSeatedOnStage) {
      setIsSeatedOnStage(false);
      setGuestSeats(prev => prev.map((s, idx) => idx === 2 ? { ...s, name: 'Asiento Libre', avatar: '', isOccupied: false } : s));
    } else {
      setIsSeatedOnStage(true);
      setGuestSeats(prev => prev.map((s, idx) => idx === 2 ? {
        ...s,
        name: player.name || 'Tú',
        avatar: player.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
        isOccupied: true,
        isMuted: false
      } : s));
      addXpAndMp(50, 20);
    }
  };

  const pkOpponentScore = room.pkOpponent?.score || 18400;
  const totalPkPoints = hostScore + pkOpponentScore;
  const hostPercentage = totalPkPoints > 0 ? Math.round((hostScore / totalPkPoints) * 100) : 50;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl font-orbitron animate-fade-in">
      
      {/* Stream Window Frame */}
      <div className="relative w-full max-w-4xl h-[88vh] bg-[#05060a] border border-[#00f0ff]/50 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,240,255,0.3)] flex flex-col md:flex-row">
        
        {/* LEFT COLUMN: LIVE VIDEO STREAM CANVAS, PK BATTLE & MULTI-GUEST SEATS */}
        <div className="relative flex-1 bg-black flex flex-col justify-between overflow-hidden group select-none">
          
          {/* Stream Background Video / Cover */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${room.streamCoverUrl}')` }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/70" />

          {/* FLOATING GIFT BROADCAST BANNER (MagnopVS Transmedia Style) */}
          {activeGiftBanner && (
            <div className="absolute top-20 inset-x-6 z-40 bg-gradient-to-r from-[#ff007f]/90 via-[#ffd700]/90 to-[#00f0ff]/90 p-3 rounded-2xl text-center shadow-[0_0_30px_rgba(255,215,0,0.6)] animate-bounce font-mono text-xs font-bold text-black flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-white animate-spin" />
              <span>{activeGiftBanner}</span>
            </div>
          )}

          {/* ERROR NOTIFICATION BANNER */}
          {errorMessage && (
            <div className="absolute top-20 inset-x-6 z-40 bg-[#ff3366] text-white p-3 rounded-2xl text-center shadow-[0_0_20px_rgba(255,51,102,0.5)] font-mono text-xs font-bold">
              {errorMessage}
            </div>
          )}

          {/* TOP STREAM HEADER */}
          <div className="relative z-10 p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full border-2 border-[#00f0ff] p-0.5 relative shrink-0">
                <img src={room.hostAvatar} alt={room.hostName} className="w-full h-full object-cover rounded-full" />
                <span className="absolute -bottom-1 -right-1 bg-[#ff007f] text-white text-[8px] font-bold px-1 rounded-full animate-pulse">
                  LIVE
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white drop-shadow">{room.hostName}</span>
                  <span className="bg-[#00f0ff]/20 text-[#00f0ff] text-[9px] px-1.5 py-0.5 rounded font-mono border border-[#00f0ff]/40">
                    NVL {room.hostLevel}
                  </span>
                </div>
                <div className="text-[10px] text-[#7fffd4] font-mono drop-shadow">
                  {room.hostTitle} • {room.category}
                </div>
              </div>
            </div>

            {/* Viewers & Live Indicator */}
            <div className="flex items-center gap-2">
              <div className="bg-black/60 border border-[#00f0ff]/40 px-3 py-1 rounded-full flex items-center gap-1.5 text-xs text-[#00f0ff] font-mono">
                <Users className="w-3.5 h-3.5" />
                <span>{room.viewersCount.toLocaleString()}</span>
              </div>

              <button onClick={onClose} className="p-2 rounded-full bg-black/60 hover:bg-black text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* PK BATTLE METER (MagnopVS Live PK Mode) */}
          {room.isPkMode && (
            <div className="relative z-10 mx-4 bg-black/80 border border-[#ff007f]/50 p-3 rounded-2xl space-y-2 backdrop-blur-md">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <div className="flex items-center gap-2 text-[#00f0ff]">
                  <Trophy className="w-4 h-4" />
                  <span>{room.hostName}: {hostScore.toLocaleString()} pts</span>
                </div>
                <div className="text-[#ff007f] font-audiowide flex items-center gap-1">
                  <Swords className="w-4 h-4 animate-bounce" />
                  <span>PK BATTLE EN VIVO</span>
                </div>
                <div className="flex items-center gap-2 text-[#ff007f]">
                  <span>{room.pkOpponent?.name}: {pkOpponentScore.toLocaleString()} pts</span>
                </div>
              </div>

              {/* Progress meter bar */}
              <div className="h-3 bg-white/10 rounded-full overflow-hidden flex border border-white/20">
                <div 
                  className="h-full bg-gradient-to-r from-[#00f0ff] to-[#7fffd4] transition-all duration-500" 
                  style={{ width: `${hostPercentage}%` }} 
                />
                <div 
                  className="h-full bg-gradient-to-r from-[#ff007f] to-[#ff4500] transition-all duration-500" 
                  style={{ width: `${100 - hostPercentage}%` }} 
                />
              </div>
            </div>
          )}

          {/* MULTI-GUEST SEATS BOX (Escenario Multicanal 4-Box) */}
          <div className="relative z-10 mx-4 bg-black/60 backdrop-blur-md border border-white/10 p-2.5 rounded-2xl">
            <div className="flex items-center justify-between pb-1.5 border-b border-white/10 text-[10px] font-mono">
              <span className="text-[#00f0ff] font-bold flex items-center gap-1">
                <Users className="w-3 h-3" />
                Asientos de Invitados en Vivo (Caja 4)
              </span>
              <button
                onClick={toggleTakeSeat}
                className="text-[9px] bg-[#00f0ff]/20 hover:bg-[#00f0ff] text-[#00f0ff] hover:text-[#05060a] border border-[#00f0ff]/50 px-2 py-0.5 rounded transition-all cursor-pointer font-bold uppercase"
              >
                {isSeatedOnStage ? 'Bajar del Escenario' : 'Pedir Micrófono / Asiento'}
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-2">
              {guestSeats.map((seat) => (
                <div key={seat.id} className="flex flex-col items-center gap-1 text-center font-mono">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 transition-all ${
                    seat.isOccupied ? 'border-[#00f0ff] bg-black shadow-[0_0_8px_#00f0ff]' : 'border-dashed border-white/20 bg-white/5'
                  }`}>
                    {seat.isOccupied ? (
                      <img src={seat.avatar} alt={seat.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[9px] text-white/40">+{seat.id}</span>
                    )}
                  </div>
                  <span className="text-[9px] text-white/80 truncate max-w-[65px]">{seat.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FLOATING HEARTS ANIMATION OVERLAY */}
          {floatingHearts.map((h) => (
            <div
              key={h.id}
              className="absolute bottom-24 z-30 pointer-events-none text-[#ff007f] text-2xl animate-bounce duration-1000"
              style={{ left: `${h.left}%` }}
            >
              ❤️
            </div>
          ))}

          {/* BOTTOM STREAM ACTION CONTROLS */}
          <div className="relative z-10 p-4 flex items-center justify-between gap-3">
            <button
              onClick={handleHeartClick}
              className="p-3 bg-[#ff007f] hover:bg-[#ff007f]/80 text-white rounded-2xl flex items-center gap-2 font-mono text-xs font-bold cursor-pointer shadow-[0_0_20px_rgba(255,0,127,0.5)] transition-all hover:scale-105"
            >
              <Heart className="w-5 h-5 fill-white" />
              <span>Enviar Corazón</span>
            </button>

            <div className="text-xs font-mono text-white/80 bg-black/60 px-3 py-1.5 rounded-xl border border-white/10">
              Tus MP: <span className="text-[#00f0ff] font-bold">{player.magnoPoints} MP</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: LIVE STREAM CHAT & VIRTUAL GIFTS STORE */}
        <div className="w-full md:w-80 bg-[#05060a] border-t md:border-t-0 md:border-l border-[#1f2430] flex flex-col justify-between p-4 font-mono">
          
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-[#1f2430] pb-3 text-xs font-audiowide text-white">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#00f0ff]" />
              <span>Chat en Vivo</span>
            </div>
            <span className="text-[10px] text-[#7fffd4]">MagnopVS Live</span>
          </div>

          {/* Live Chat Message Feed */}
          <div className="flex-1 overflow-y-auto space-y-2.5 my-3 pr-1 scrollbar-thin scrollbar-thumb-[#00f0ff]/30 max-h-[300px] md:max-h-none">
            {activeComments.map((c) => (
              <div 
                key={c.id} 
                className={`p-2 rounded-xl text-xs flex items-start gap-2 ${
                  c.giftName 
                    ? 'bg-[#ff007f]/10 border border-[#ff007f]/40 text-[#ff007f]' 
                    : 'bg-[#05060a] border border-[#1f2430] text-white'
                }`}
              >
                <img src={c.senderAvatar} alt={c.senderName} className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-bold text-[#00f0ff]">{c.senderName}</div>
                  <p className="text-xs leading-tight">{c.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Virtual Gifts Selection Bar (Regalos Cósmicos) */}
          <div className="border-t border-[#1f2430] pt-3 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-[#00f0ff] font-bold uppercase">
              <span className="flex items-center gap-1">
                <Gift className="w-3.5 h-3.5 text-[#ff007f]" />
                Regalos Cósmicos
              </span>
              <span className="text-[10px] text-[#a0a5b5]">Cuestan MP</span>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {VIRTUAL_GIFTS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => handleGiveGift(g)}
                  className="bg-[#05060a] border border-[#1f2430] hover:border-[#00f0ff] p-1.5 rounded-xl flex flex-col items-center justify-center transition-all hover:scale-105 cursor-pointer group"
                  title={`${g.name} - ${g.costMp} MP`}
                >
                  <span className="text-xl group-hover:scale-125 transition-transform">{g.icon}</span>
                  <span className="text-[9px] font-bold text-[#00f0ff] mt-0.5">{g.costMp}MP</span>
                </button>
              ))}
            </div>
          </div>

          {/* Send Chat Message Form */}
          <form onSubmit={handleSendComment} className="flex gap-2 pt-3 border-t border-[#1f2430]">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] px-3 py-2 rounded-xl text-xs text-white focus:outline-none"
            />
            <button type="submit" className="px-3 py-2 bg-[#00f0ff] text-[#05060a] font-bold rounded-xl cursor-pointer">
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
