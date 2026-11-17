import React, { useState, useEffect } from 'react';
import { LiveNewsItem } from '../../types/magnoways';
import { Newspaper, AlertCircle, Radio, ExternalLink, ChevronRight, Sparkles } from 'lucide-react';

interface MagnoWaysNewsTickerProps {
  news: LiveNewsItem[];
  onSelectNews: (item: LiveNewsItem) => void;
}

export const MagnoWaysNewsTicker: React.FC<MagnoWaysNewsTickerProps> = ({
  news,
  onSelectNews,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (news.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [news.length]);

  if (news.length === 0) return null;

  const current = news[currentIndex];

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'REUTERS':
        return 'bg-[#ff007f]/20 text-[#ff007f] border-[#ff007f]/40';
      case 'AP':
        return 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]/40';
      case 'QUANTVM_DISPATCH':
        return 'bg-[#7fffd4]/20 text-[#7fffd4] border-[#7fffd4]/40';
      default:
        return 'bg-[#8a2be2]/20 text-[#8a2be2] border-[#8a2be2]/40';
    }
  };

  return (
    <div className="w-full bg-[#05060a]/95 border-y border-[#1f2430] px-3 sm:px-4 py-2 flex items-center justify-between gap-3 text-xs font-orbitron backdrop-blur-md z-20">
      
      {/* Label Badge */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff007f] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff007f]"></span>
        </span>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#ff007f]/15 border border-[#ff007f]/40 text-[#ff007f] font-mono text-[10px] font-bold tracking-wider uppercase">
          <Radio className="w-3 h-3 animate-pulse" />
          <span>MAGNOWAYS OSINT</span>
        </div>
      </div>

      {/* News Content */}
      <div 
        onClick={() => onSelectNews(current)}
        className="flex-1 overflow-hidden cursor-pointer group flex items-center gap-2 hover:text-[#00f0ff] transition-colors"
      >
        <span className={`px-1.5 py-0.5 rounded border text-[10px] font-mono shrink-0 ${getSourceBadgeColor(current.source)}`}>
          {current.source}
        </span>
        <span className="text-[10px] text-[#7fffd4] shrink-0 font-mono hidden md:inline">
          [{current.timestamp}]
        </span>
        <span className="truncate text-[11px] text-[#f8f9fa] group-hover:text-[#00f0ff]">
          {current.headline}
        </span>
        <span className="text-[10px] text-[#a0a5b5] shrink-0 font-mono hidden lg:inline">
          • {current.region}
        </span>
      </div>

      {/* Action / Counter */}
      <div className="flex items-center gap-2 shrink-0 font-mono text-[10px] text-[#a0a5b5]">
        <span>{currentIndex + 1}/{news.length}</span>
        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % news.length)}
          className="p-1 rounded bg-[#0a0d14] hover:bg-white/10 text-white hover:text-[#00f0ff] border border-[#1f2430] transition-colors cursor-pointer"
          title="Siguiente noticia"
        >
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

    </div>
  );
};
