import React, { useEffect } from 'react';
import { soundEngine } from '../../services/audio';

interface TitleScreenProps {
  hasSave: boolean;
  onNewGame: () => void;
  onContinueGame: () => void;
  onOpenCards: () => void;
  onOpenSettings: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  hasSave,
  onNewGame,
  onContinueGame,
  onOpenCards,
  onOpenSettings,
}) => {
  // Support Space or Enter to quickly start
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        soundEngine.playSfx('click');
        if (hasSave) {
          onContinueGame();
        } else {
          onNewGame();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasSave, onContinueGame, onNewGame]);

  return (
    <div className="relative w-full h-full flex flex-col justify-between items-center bg-[#090A0F] text-[#F1EEE8] select-none overflow-hidden p-6">
      {/* Background Moonlit Manga Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#191e30] via-[#090A0F] to-[#090A0F] pointer-events-none" />
      <div className="absolute inset-0 bg-screentone opacity-50 pointer-events-none" />

      {/* Floating Moonlight Aura */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-72 md:w-96 h-72 md:h-96 rounded-full bg-[#62B8E8]/10 blur-3xl pointer-events-none" />

      {/* Bespoke Inline SVG Title Lockup */}
      <div className="relative z-10 pt-8 md:pt-12 text-center max-w-2xl flex flex-col items-center">
        {/* Kanji Seal */}
        <div className="flex items-center space-x-3 text-xs md:text-sm font-manga text-[#75F0D3] tracking-[0.4em] mb-3 opacity-90">
          <span>仏 の 馬 鹿</span>
          <span className="text-[#62B8E8]">·</span>
          <span>東 京 三 千</span>
        </div>

        {/* Main Logo Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black tracking-wider text-[#F1EEE8] drop-shadow-[0_4px_25px_rgba(98,184,232,0.4)]">
          BUTSU NO BAKA
        </h1>
        <div className="text-xl sm:text-2xl md:text-3xl font-cyber font-black tracking-[0.25em] text-[#62B8E8] mt-1">
          TOKYO 3000
        </div>

        {/* Subtitle Badge */}
        <div className="mt-4 px-4 py-1.5 rounded-full bg-[#151722]/80 border border-[#75F0D3]/40 text-xs md:text-sm font-cyber text-[#75F0D3] flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#75F0D3] animate-ping" />
          <span>TEMPORADA 1 · EPISODIO 1: EL BUCLE DE YŪREI</span>
        </div>
      </div>

      {/* Centerpiece Manga Silhouette Artwork */}
      <div className="relative z-10 my-auto flex flex-col items-center">
        <svg viewBox="0 0 240 100" className="w-48 sm:w-64 h-auto opacity-70">
          {/* Moon */}
          <circle cx="120" cy="40" r="28" fill="#F1EEE8" opacity="0.3" />
          {/* Bridge outline with lovers */}
          <path d="M20 70 Q120 45 220 70" stroke="#62B8E8" strokeWidth="1.5" fill="none" />
          {/* Torii */}
          <path d="M105 52 L105 32 M135 52 L135 32 M95 34 L145 34" stroke="#75F0D3" strokeWidth="1" />
        </svg>
      </div>

      {/* Action Buttons Menu */}
      <div className="relative z-10 w-full max-w-sm flex flex-col space-y-2.5 pb-4">
        {hasSave && (
          <button
            onClick={() => {
              soundEngine.playSfx('click');
              onContinueGame();
            }}
            className="w-full py-3.5 px-6 rounded-lg bg-[#75F0D3] hover:bg-[#62B8E8] text-[#090A0F] font-cyber font-extrabold text-sm tracking-wider shadow-[0_0_20px_rgba(117,240,211,0.5)] transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>CONTINUAR PARTIDA ➔</span>
          </button>
        )}

        <button
          onClick={() => {
            soundEngine.playSfx('click');
            onNewGame();
          }}
          className={`w-full py-3.5 px-6 rounded-lg font-cyber font-extrabold text-sm tracking-wider transition-all flex items-center justify-center space-x-2 cursor-pointer ${
            hasSave
              ? 'bg-[#151722] hover:bg-[#1e2335] text-[#F1EEE8] border border-[#62B8E8]/40'
              : 'bg-[#62B8E8] hover:bg-[#75F0D3] text-[#090A0F] shadow-[0_0_20px_rgba(98,184,232,0.5)]'
          }`}
        >
          <span>NUEVA PARTIDA</span>
        </button>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => {
              soundEngine.playSfx('click');
              onOpenCards();
            }}
            className="py-2.5 px-3 rounded-lg bg-[#151722] hover:bg-[#1d2233] text-[#75F0D3] border border-[#75F0D3]/30 text-xs font-cyber transition-all flex items-center justify-center space-x-1"
          >
            <span>🎴 Colección</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playSfx('click');
              onOpenSettings();
            }}
            className="py-2.5 px-3 rounded-lg bg-[#151722] hover:bg-[#1d2233] text-[#F1EEE8] border border-[#2a2f44] text-xs font-cyber transition-all flex items-center justify-center space-x-1"
          >
            <span>⚙ Ajustes</span>
          </button>
        </div>

        {/* Flat control-hint line */}
        <div className="pt-2 text-center text-[11px] font-cyber text-[#777B89]">
          Espacio / Enter Iniciar · Clic / Toque Interactuar · Esc Pausa
        </div>
      </div>
    </div>
  );
};
