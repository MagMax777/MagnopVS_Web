import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { WalletView } from './WalletView';
import { X, Sparkles, Coins } from 'lucide-react';

export const WalletModal: React.FC = () => {
  const { isWalletModalOpen, setIsWalletModalOpen, playSoundEffect } = usePlayer();

  if (!isWalletModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl font-orbitron animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-[#05060a]/95 border-2 border-[#00f0ff]/50 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,240,255,0.25)] flex flex-col my-auto">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#1f2430] bg-[#0a0d14]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/40 text-[#00f0ff]">
              <Coins className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-audiowide font-bold text-white uppercase tracking-wider">
                  Wallet Multiversal MagnopVS
                </h2>
                <span className="text-[10px] bg-[#00f0ff]/20 text-[#00f0ff] px-2 py-0.5 rounded font-mono border border-[#00f0ff]/40">
                  OFFICIAL LEDGER
                </span>
              </div>
              <p className="text-[11px] text-[#a0a5b5] font-mono">
                Sistema económico de MagnoPoints (MP) & MicroCoins (µC) con persistencia cuántica
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playSoundEffect('click');
              setIsWalletModalOpen(false);
            }}
            className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white hover:text-[#00f0ff] border border-white/10 transition-colors cursor-pointer"
            title="Cerrar Wallet"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin scrollbar-thumb-[#00f0ff]/30">
          <WalletView />
        </div>

      </div>
    </div>
  );
};
