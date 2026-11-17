import React, { useState, useEffect } from 'react';
import { StoryItem } from '../../../data/socialExpandedData';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Send, 
  Volume2, 
  VolumeX, 
  Eye, 
  Sparkles, 
  Music, 
  Flame 
} from 'lucide-react';

interface StoryViewerModalProps {
  stories: StoryItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectStory: (index: number) => void;
  onAddStory: () => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  currentIndex,
  isOpen,
  onClose,
  onSelectStory,
  onAddStory
}) => {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [replyText, setReplyText] = useState('');

  const currentStory = stories[currentIndex];

  useEffect(() => {
    if (!isOpen || !currentStory || isPaused) return;

    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 2));
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, currentIndex, isPaused, currentStory]);

  useEffect(() => {
    if (!isOpen || !currentStory) return;

    if (progress >= 100) {
      if (currentIndex < stories.length - 1) {
        onSelectStory(currentIndex + 1);
        setProgress(0);
      } else {
        onClose();
      }
    }
  }, [progress, isOpen, currentStory, currentIndex, stories.length, onSelectStory, onClose]);

  if (!isOpen || !currentStory) return null;

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      onSelectStory(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectStory(currentIndex - 1);
      setProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl font-orbitron animate-fade-in">
      
      {/* Main Story Container */}
      <div className="relative w-full max-w-sm h-[80vh] bg-[#05060a] border border-[#00f0ff]/50 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.3)] flex flex-col justify-between select-none">
        
        {/* Story Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{ backgroundImage: `url('${currentStory.mediaUrl}')` }}
        />
        
        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90" />

        {/* Top Progress Bars */}
        <div className="relative z-10 p-4 space-y-3">
          <div className="flex items-center gap-1.5">
            {stories.map((s, idx) => (
              <div key={s.id} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#00f0ff] transition-all duration-100 ease-linear"
                  style={{
                    width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Story Author Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-[#00f0ff] shadow-md">
                <img src={currentStory.authorAvatar} alt={currentStory.authorName} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-white drop-shadow">
                  <span>{currentStory.authorName}</span>
                  <span className="bg-[#00f0ff]/20 text-[#00f0ff] text-[9px] px-1.5 py-0.2 rounded font-mono border border-[#00f0ff]/40">
                    NVL {currentStory.authorLevel}
                  </span>
                </div>
                <div className="text-[10px] text-[#7fffd4] font-mono drop-shadow">
                  {currentStory.timestamp}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-white">
              <button 
                onClick={() => setIsMuted(!isMuted)} 
                className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 transition-colors cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-[#ff007f]" /> : <Volume2 className="w-4 h-4 text-[#00f0ff]" />}
              </button>
              <button 
                onClick={onClose} 
                className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Optional Audio Track Tag */}
          {currentStory.audioTrack && (
            <div className="inline-flex items-center gap-1.5 bg-black/50 border border-[#00f0ff]/30 px-2.5 py-1 rounded-full text-[10px] text-[#00f0ff] font-mono">
              <Music className="w-3 h-3 animate-pulse text-[#00f0ff]" />
              <span>{currentStory.audioTrack}</span>
            </div>
          )}
        </div>

        {/* Left / Right Click Touch Zones */}
        <div className="absolute inset-y-20 left-0 w-1/3 z-20 cursor-pointer" onClick={handlePrev} />
        <div className="absolute inset-y-20 right-0 w-1/3 z-20 cursor-pointer" onClick={handleNext} />

        {/* Bottom Story Content & Interactions */}
        <div className="relative z-10 p-5 space-y-3 font-mono">
          
          {/* Caption */}
          <div className="bg-black/60 backdrop-blur-md border border-white/10 p-3 rounded-2xl">
            <p className="text-xs text-white leading-relaxed font-sans">
              {currentStory.caption}
            </p>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10 text-[10px] text-[#a0a5b5]">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-[#00f0ff]" />
                {currentStory.viewsCount} visualizaciones
              </span>
              {currentStory.filterEffect && (
                <span className="text-[#ff007f] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {currentStory.filterEffect}
                </span>
              )}
            </div>
          </div>

          {/* Reply & Like Bar */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Responder historia..."
              className="flex-1 bg-black/70 border border-white/20 focus:border-[#00f0ff] px-3 py-2 rounded-xl text-xs text-white focus:outline-none placeholder-white/50"
            />
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isLiked 
                  ? 'bg-[#ff007f]/20 border-[#ff007f] text-[#ff007f]' 
                  : 'bg-black/70 border-white/20 text-white hover:text-[#ff007f]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#ff007f]' : ''}`} />
            </button>
            <button
              onClick={() => { setReplyText(''); setProgress(100); }}
              className="p-2.5 rounded-xl bg-[#00f0ff] text-[#05060a] font-bold cursor-pointer hover:bg-[#00f0ff]/80 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
