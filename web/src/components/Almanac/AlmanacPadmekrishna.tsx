import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { ALMANAC_CHAPTERS } from '../../data/mockData';
import { AlmanacChapter } from '../../types';
import { BookOpen, Search, Lock, Sparkles, Quote, ChevronRight } from 'lucide-react';

export const AlmanacPadmekrishna: React.FC = () => {
  const { player, playSoundEffect } = usePlayer();
  const [selectedChapter, setSelectedChapter] = useState<AlmanacChapter>(ALMANAC_CHAPTERS[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChapters = ALMANAC_CHAPTERS.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6 font-orbitron">
      
      {/* Header */}
      <div className="hud-panel-magenta p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 clip-corner">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ff007f]/15 border border-[#ff007f]/40 text-[#ff007f] text-xs font-orbitron font-bold uppercase mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Códice Sagrado</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-audiowide text-[#f8f9fa] uppercase tracking-wide">
            Almanaque Padmekrishna
          </h2>
          <p className="text-[#a0a5b5] text-xs sm:text-sm max-w-2xl leading-relaxed">
            La recopilación sagrada de escrituras, filosofías y registros históricos que rigen el equilibrio del ecosistema MagnopVS.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#a0a5b5] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar en el Almanaque..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#05060a] border border-[#1f2430] text-xs text-[#f8f9fa] placeholder-[#a0a5b5] focus:outline-none focus:border-[#ff007f] font-orbitron transition-all clip-corner"
          />
        </div>
      </div>

      {/* Reader Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chapters List Sidebar (Left 4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-orbitron text-[#a0a5b5] px-2 uppercase tracking-wider font-bold">
            Capítulos Registrados
          </div>

          {filteredChapters.map((ch) => {
            const isLocked = player.level < ch.unlockedAtLevel;
            const isSelected = selectedChapter.id === ch.id;

            return (
              <div
                key={ch.id}
                onClick={() => {
                  if (!isLocked) {
                    playSoundEffect('click');
                    setSelectedChapter(ch);
                  }
                }}
                className={`p-4 border transition-all cursor-pointer clip-corner ${
                  isSelected
                    ? 'bg-[#ff007f]/15 border-[#ff007f] shadow-[0_0_20px_rgba(255,0,127,0.25)]'
                    : isLocked
                    ? 'bg-[#05060a]/40 border-[#1f2430] opacity-50 cursor-not-allowed'
                    : 'bg-[#05060a] border-[#1f2430] hover:border-[#ff007f]/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[9px] font-orbitron font-bold uppercase px-2 py-0.5 bg-[#ff007f]/10 text-[#ff007f] border border-[#ff007f]/30 mb-1 inline-block">
                      {ch.category}
                    </span>
                    <h4 className="font-bold font-audiowide text-[#f8f9fa] text-xs leading-snug mb-1 uppercase">{ch.title}</h4>
                    <p className="text-xs text-[#a0a5b5] font-orbitron">{ch.subtitle}</p>
                  </div>

                  {isLocked ? (
                    <div className="flex items-center gap-1 text-[10px] font-orbitron text-[#a0a5b5] bg-[#12141d] px-2 py-1 border border-[#1f2430] shrink-0">
                      <Lock className="w-3 h-3 text-[#ff007f]" />
                      <span>LVL {ch.unlockedAtLevel}</span>
                    </div>
                  ) : (
                    <ChevronRight className={`w-4 h-4 shrink-0 mt-1 ${isSelected ? 'text-[#ff007f]' : 'text-[#a0a5b5]'}`} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Chapter Reader View (Right 8 Cols) */}
        <div className="lg:col-span-8 hud-panel-magenta p-6 sm:p-8 backdrop-blur-md min-h-[480px] flex flex-col justify-between clip-corner">
          <div>
            {/* Header Badge */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#1f2430]">
              <span className="text-xs font-orbitron font-bold uppercase text-[#ff007f] px-3 py-1 bg-[#ff007f]/10 border border-[#ff007f]/30">
                {selectedChapter.category}
              </span>
              <span className="text-xs font-orbitron text-[#a0a5b5]">
                Almanaque Padmekrishna • Archivo #0{selectedChapter.id.replace('ch-', '')}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-2xl sm:text-3xl font-black font-audiowide text-[#f8f9fa] mb-2 uppercase">
              {selectedChapter.title}
            </h3>
            <p className="text-xs font-orbitron font-bold text-[#7fffd4] mb-6">
              {selectedChapter.subtitle}
            </p>

            {/* Quote Box */}
            {selectedChapter.quote && (
              <div className="p-5 bg-[#05060a] border-l-4 border-[#ff007f] mb-6 shadow-inner clip-corner">
                <div className="flex items-start gap-3">
                  <Quote className="w-6 h-6 text-[#ff007f] shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-[#f8f9fa] italic leading-relaxed font-orbitron">
                    {selectedChapter.quote}
                  </p>
                </div>
              </div>
            )}

            {/* Content Text */}
            <div className="text-xs sm:text-sm text-[#a0a5b5] leading-relaxed space-y-4 whitespace-pre-line font-orbitron">
              {selectedChapter.textContent}
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="mt-8 pt-4 border-t border-[#1f2430] flex items-center justify-between text-xs font-orbitron text-[#a0a5b5]">
            <span>Registro verificado por los Arquitectos Quantvm</span>
            <span className="text-[#ff007f] flex items-center gap-1 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Sintonía Máxima
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
