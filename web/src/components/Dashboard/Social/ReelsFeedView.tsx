import React, { useState } from 'react';
import { usePlayer } from '../../../context/PlayerContext';
import { INITIAL_REELS, ReelItem } from '../../../data/socialExpandedData';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Music, 
  ChevronUp, 
  ChevronDown, 
  Play, 
  Pause, 
  Sparkles, 
  Plus, 
  Send,
  Volume2
} from 'lucide-react';

export const ReelsFeedView: React.FC = () => {
  const { player, playSoundEffect } = usePlayer();
  const [reels, setReels] = useState<ReelItem[]>(INITIAL_REELS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New reel form states
  const [newTitle, setNewTitle] = useState('');
  const [newCoverUrl, setNewCoverUrl] = useState('');

  const currentReel = reels[activeIndex];

  const handleNextReel = () => {
    if (activeIndex < reels.length - 1) {
      setActiveIndex(activeIndex + 1);
      playSoundEffect('click');
    }
  };

  const handlePrevReel = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      playSoundEffect('click');
    }
  };

  const toggleLike = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          const isLiked = !r.isLiked;
          const likesCount = isLiked ? r.likesCount + 1 : r.likesCount - 1;
          return { ...r, isLiked, likesCount };
        }
        return r;
      })
    );
    playSoundEffect('click');
  };

  const handleCreateReel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newReel: ReelItem = {
      id: `reel-${Date.now()}`,
      title: newTitle,
      authorName: player.name || 'Aetheris (Tú)',
      authorAvatar: player.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
      authorLevel: player.level,
      authorFaction: player.faction,
      coverUrl: newCoverUrl || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
      soundTrack: `${player.name || 'Aetheris'} • Transmisión Quantvm Original`,
      likesCount: 1,
      isLiked: true,
      commentsCount: 0,
      sharesCount: 0,
      tags: ['MagnopVS', 'Reels']
    };

    setReels([newReel, ...reels]);
    setActiveIndex(0);
    setNewTitle('');
    setNewCoverUrl('');
    setShowCreateModal(false);
    playSoundEffect('quest');
  };

  if (!currentReel) return null;

  return (
    <div className="flex flex-col items-center justify-center font-orbitron max-w-lg mx-auto space-y-4">
      
      {/* Top Reel Navigation Bar */}
      <div className="w-full flex items-center justify-between bg-[#05060a]/90 border border-[#00f0ff]/30 p-3 rounded-2xl font-mono text-xs text-[#00f0ff]">
        <div className="flex items-center gap-2 font-audiowide text-white">
          <Sparkles className="w-4 h-4 text-[#00f0ff]" />
          <span>MagnopVS Reels & Clips</span>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3.5 py-1.5 bg-[#00f0ff] hover:bg-[#00f0ff]/80 text-[#05060a] font-bold rounded-xl text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.4)]"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Reel</span>
        </button>
      </div>

      {/* Main Fullscreen Vertical Reel Player Frame */}
      <div className="relative w-full h-[650px] bg-[#05060a] border-2 border-[#00f0ff]/40 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,240,255,0.2)] select-none group">
        
        {/* Cover / Video Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url('${currentReel.coverUrl}')` }}
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90" />

        {/* Center Play / Pause Indicator overlay */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="p-4 rounded-full bg-black/60 border border-[#00f0ff] text-[#00f0ff]">
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </div>
        </button>

        {/* Right Action Bar (Hearts, Comments, Shares, Up/Down Reels) */}
        <div className="absolute right-4 bottom-20 z-20 flex flex-col items-center gap-5 text-white font-mono">
          
          {/* Like Reel */}
          <button
            onClick={() => toggleLike(currentReel.id)}
            className="flex flex-col items-center gap-1 cursor-pointer group/like"
          >
            <div className={`p-3 rounded-full border transition-all ${
              currentReel.isLiked ? 'bg-[#ff007f] border-[#ff007f] shadow-[0_0_15px_rgba(255,0,127,0.5)]' : 'bg-black/60 border-white/20 group-hover/like:border-[#ff007f]'
            }`}>
              <Heart className={`w-6 h-6 ${currentReel.isLiked ? 'fill-white' : 'text-white'}`} />
            </div>
            <span className="text-xs font-bold">{currentReel.likesCount}</span>
          </button>

          {/* Comments */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex flex-col items-center gap-1 cursor-pointer"
          >
            <div className="p-3 rounded-full bg-black/60 border border-white/20 hover:border-[#00f0ff]">
              <MessageSquare className="w-6 h-6 text-[#00f0ff]" />
            </div>
            <span className="text-xs font-bold">{currentReel.commentsCount}</span>
          </button>

          {/* Share */}
          <button
            onClick={() => playSoundEffect('click')}
            className="flex flex-col items-center gap-1 cursor-pointer"
          >
            <div className="p-3 rounded-full bg-black/60 border border-white/20 hover:border-[#7fffd4]">
              <Share2 className="w-6 h-6 text-[#7fffd4]" />
            </div>
            <span className="text-xs font-bold">{currentReel.sharesCount}</span>
          </button>

          {/* Vertical Navigation (Up / Down) */}
          <div className="flex flex-col gap-2 pt-4 border-t border-white/20">
            <button
              onClick={handlePrevReel}
              disabled={activeIndex === 0}
              className="p-2 rounded-full bg-black/60 border border-white/20 hover:border-[#00f0ff] disabled:opacity-30 cursor-pointer"
            >
              <ChevronUp className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={handleNextReel}
              disabled={activeIndex === reels.length - 1}
              className="p-2 rounded-full bg-black/60 border border-white/20 hover:border-[#00f0ff] disabled:opacity-30 cursor-pointer"
            >
              <ChevronDown className="w-5 h-5 text-white" />
            </button>
          </div>

        </div>

        {/* Bottom Metadata & Author Overlay */}
        <div className="absolute left-4 right-20 bottom-6 z-20 space-y-3 font-mono">
          
          {/* Author Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#00f0ff] overflow-hidden">
              <img src={currentReel.authorAvatar} alt={currentReel.authorName} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-white drop-shadow">
                <span>{currentReel.authorName}</span>
                <span className="bg-[#00f0ff]/20 text-[#00f0ff] text-[9px] px-2 py-0.5 rounded border border-[#00f0ff]/40">
                  NVL {currentReel.authorLevel}
                </span>
              </div>
              <div className="text-[10px] text-[#7fffd4] drop-shadow">{currentReel.authorFaction}</div>
            </div>
          </div>

          {/* Reel Title */}
          <p className="text-xs text-white leading-snug drop-shadow font-sans">
            {currentReel.title}
          </p>

          {/* Hashtags */}
          <div className="flex items-center gap-2 text-[10px] text-[#00f0ff]">
            {currentReel.tags.map((t) => (
              <span key={t}>#{t}</span>
            ))}
          </div>

          {/* Sound Track marquee label */}
          <div className="flex items-center gap-2 bg-black/60 border border-white/10 px-3 py-1.5 rounded-full text-xs text-white max-w-xs overflow-hidden">
            <Music className="w-4 h-4 text-[#00f0ff] animate-spin-slow shrink-0" />
            <span className="truncate text-[10px]">{currentReel.soundTrack}</span>
          </div>

        </div>

        {/* Drawer for Comments */}
        {showComments && (
          <div className="absolute inset-x-0 bottom-0 z-30 bg-[#05060a]/95 border-t border-[#00f0ff] p-4 rounded-t-3xl font-mono space-y-3 animate-fade-in max-h-[300px] overflow-y-auto">
            <div className="flex items-center justify-between text-xs font-bold text-[#00f0ff]">
              <span>Comentarios del Reel</span>
              <button onClick={() => setShowComments(false)} className="text-white">✕</button>
            </div>
            <p className="text-[11px] text-[#a0a5b5]">Sé el primero en resonar con este Reel en la Red Quantvm.</p>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Escribe tu comentario..."
                className="flex-1 bg-black border border-[#1f2430] p-2 rounded-xl text-xs text-white focus:outline-none"
              />
              <button onClick={() => setCommentInput('')} className="px-3 py-2 bg-[#00f0ff] text-black font-bold rounded-xl text-xs uppercase">
                Enviar
              </button>
            </div>
          </div>
        )}

      </div>

      {/* CREATE REEL MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#05060a] border border-[#00f0ff] p-6 rounded-3xl max-w-md w-full space-y-4 font-mono">
            <div className="flex items-center justify-between text-sm font-audiowide text-white">
              <span>Crear Nuevo Reel Quantvm</span>
              <button onClick={() => setShowCreateModal(false)} className="text-white">✕</button>
            </div>

            <form onSubmit={handleCreateReel} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-[#a0a5b5]">Título / Descripción del Reel</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej. Demostración de Transmutación en Alquimia MLH"
                  required
                  className="w-full bg-black border border-[#1f2430] focus:border-[#00f0ff] p-3 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#a0a5b5]">URL de la Portada / Clip (https://...)</label>
                <input
                  type="text"
                  value={newCoverUrl}
                  onChange={(e) => setNewCoverUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-black border border-[#1f2430] focus:border-[#00f0ff] p-3 rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-[#1f2430] text-white rounded-xl text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00f0ff] text-black rounded-xl text-xs font-bold uppercase"
                >
                  Publicar Reel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
