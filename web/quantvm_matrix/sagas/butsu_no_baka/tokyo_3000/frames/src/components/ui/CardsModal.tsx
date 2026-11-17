import React from 'react';
import { COLLECTIBLE_CARDS } from '../../data/narrative';
import { soundEngine } from '../../services/audio';

interface CardsModalProps {
  unlockedCardIds: string[];
  onClose: () => void;
}

export const CardsModal: React.FC<CardsModalProps> = ({ unlockedCardIds, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#090A0F]/85 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-3xl bg-[#151722] border-2 border-[#75F0D3]/60 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#0f111a] border-b border-[#75F0D3]/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🎴</span>
            <h2 className="text-lg font-display text-[#F1EEE8]">
              REGISTROS Y CARTAS COLECCIONABLES
            </h2>
          </div>
          <button
            onClick={() => {
              soundEngine.playSfx('click');
              onClose();
            }}
            className="text-[#777B89] hover:text-[#e11d48] font-bold text-lg p-1"
          >
            ✕
          </button>
        </div>

        {/* Card Gallery Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLLECTIBLE_CARDS.map(card => {
            const isUnlocked = unlockedCardIds.includes(card.id);

            return (
              <div
                key={card.id}
                className={`relative rounded-xl border p-5 flex flex-col justify-between transition-all ${
                  isUnlocked
                    ? 'bg-[#090A0F] border-[#75F0D3]/60 shadow-[0_0_20px_rgba(117,240,211,0.2)]'
                    : 'bg-[#090A0F]/40 border-[#1f2334] opacity-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-cyber text-[#777B89] uppercase tracking-wider">
                      {card.subtitle}
                    </span>
                    <span
                      className={`text-[10px] font-cyber px-2 py-0.5 rounded ${
                        isUnlocked
                          ? 'bg-[#75F0D3]/20 text-[#75F0D3] border border-[#75F0D3]/50'
                          : 'bg-[#151722] text-[#777B89]'
                      }`}
                    >
                      {isUnlocked ? 'DESBLOQUEADA' : 'BLOQUEADA'}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-[#F1EEE8] mb-2">
                    {card.title}
                  </h3>

                  {isUnlocked ? (
                    <>
                      <p className="text-xs text-[#777B89] mb-4 font-manga leading-relaxed">
                        {card.description}
                      </p>
                      <div className="p-3 bg-[#151722] rounded-lg border-l-2 border-[#62B8E8] text-xs font-manga text-[#F1EEE8] italic">
                        {card.mangaQuote}
                      </div>
                    </>
                  ) : (
                    <div className="py-8 text-center text-[#777B89] text-xs font-manga">
                      🔒 Avanza en la historia para desbloquear este registro coleccionable.
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#1f2334] text-[10px] font-cyber text-[#777B89] flex justify-between">
                  <span>TOKYO 3000 ARCHIVE</span>
                  <span>EP. 01</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
