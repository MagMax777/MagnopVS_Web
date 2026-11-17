import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Gift, Award, CheckCircle2 } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

const GIFT_CLOSED = 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Gift_Box_Closed.png';
const GIFT_OPEN = 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Gift_Box_Open.png';
const TREASURE_CLOSED = 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Treasure_Box_%20Closed_1.png';
const TREASURE_OPEN = 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Treasure_Box_Open_1.png';

export const DailyCheckInModal: React.FC = () => {
  const { isDailyCheckInOpen, setIsDailyCheckInOpen, playSoundEffect, addXpAndMp, setActiveTab, enterQuantvm, player, setIsAuthModalOpen } = usePlayer();
  const [isClaiming, setIsClaiming] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [rewardType] = useState<'gift' | 'treasure'>(() => Math.random() > 0.5 ? 'gift' : 'treasure');

  const closedImg = rewardType === 'gift' ? GIFT_CLOSED : TREASURE_CLOSED;
  const openImg = rewardType === 'gift' ? GIFT_OPEN : TREASURE_OPEN;

  const handleClaim = () => {
    if (isClaiming || isOpened) return;
    
    setIsClaiming(true);
    playSoundEffect('click');
    
    // Trigger shake animation and reward
    setTimeout(() => {
      setIsOpened(true);
      setShowSparkles(true);
      playSoundEffect('portal');
      addXpAndMp(50, 10);
      setIsClaiming(false);
    }, 1000);
  };

  const handleClose = () => {
    playSoundEffect('click');
    setIsDailyCheckInOpen(false);
    setActiveTab('dashboard');
    setTimeout(() => {
      setIsOpened(false);
      setShowSparkles(false);
      setIsClaiming(false);
    }, 500);
  };

  return (
    <AnimatePresence>
      {isDailyCheckInOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-[#05060a]/92 backdrop-blur-xl overflow-y-auto"
        >
          {/* Subtle Grid overlay */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(#00f0ff 1px, transparent 1px),
                linear-gradient(90deg, #00f0ff 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px',
            }}
          />

          <motion.div
            initial={{ scale: 0.88, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.88, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-sm sm:max-w-md bg-gradient-to-b from-[#0a0b12] via-[#121622] to-[#1a1f2c] border-2 border-[#00f0ff]/60 rounded-2xl shadow-[0_0_60px_rgba(0,240,255,0.3)] overflow-hidden my-auto flex flex-col clip-corner font-orbitron"
          >
            {/* Top Glow Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#00f0ff] via-[#7fffd4] to-[#ff007f]" />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 p-2 text-[#a0a5b5] hover:text-[#ff007f] hover:bg-[#ff007f]/10 rounded-full transition-all cursor-pointer"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8 flex flex-col items-center text-center overflow-y-auto custom-scrollbar">
              
              {/* Badge Header */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#00f0ff]/10 border border-[#00f0ff]/40 rounded-full text-[#00f0ff] text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                <Sparkles className="w-3.5 h-3.5 text-[#7fffd4]" />
                <span>DAYSYNC · RECOMPENSA DIARIA</span>
              </div>

              <h2 className="font-audiowide text-2xl sm:text-3xl text-[#f8f9fa] tracking-wider uppercase mb-2">
                Check-In <span className="text-[#00f0ff]">Diario</span>
              </h2>
              <p className="text-xs text-[#a0a5b5] font-sans max-w-xs mb-6">
                Sincroniza tu presencia en el cosmos MagnopVS y reclama tus suministros de experiencia y MagnoPoints.
              </p>

              {/* Box Image / Animation Container */}
              <div 
                className="relative w-36 h-36 sm:w-44 sm:h-44 my-2 flex items-center justify-center cursor-pointer group" 
                onClick={handleClaim}
              >
                {showSparkles && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
                  >
                    <div className="absolute w-56 h-56 bg-radial-gradient from-[#00f0ff]/40 via-[#7fffd4]/20 to-transparent rounded-full animate-pulse blur-xl" />
                    <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-[#00f0ff] animate-ping" />
                    <Sparkles className="absolute top-1/2 -left-8 w-6 h-6 text-[#7fffd4] animate-pulse" />
                    <Sparkles className="absolute -bottom-4 right-4 w-10 h-10 text-[#ff007f] animate-ping" />
                  </motion.div>
                )}
                
                <motion.img
                  src={isOpened ? openImg : closedImg}
                  alt="Daily Reward"
                  className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                  animate={
                    isClaiming
                      ? {
                          rotate: [0, -15, 15, -15, 15, -10, 10, -5, 5, 0],
                          scale: [1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1],
                        }
                      : isOpened
                      ? { scale: [1, 1.25, 1] }
                      : { y: [0, -8, 0] }
                  }
                  transition={
                    isClaiming
                      ? { duration: 0.8, ease: "easeInOut" }
                      : isOpened
                      ? { duration: 0.5, ease: "easeInOut" }
                      : { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }
                />
              </div>

              {!isOpened ? (
                <div className="w-full mt-4">
                  <h3 className="font-orbitron text-sm sm:text-base text-[#00f0ff] font-bold tracking-wider mb-4">
                    TOCA PARA ABRIR TU REGALO
                  </h3>
                  <button
                    onClick={handleClaim}
                    disabled={isClaiming}
                    className="w-full py-3.5 px-6 bg-gradient-to-r from-[#00f0ff]/20 via-[#7fffd4]/20 to-[#00f0ff]/20 hover:from-[#00f0ff]/40 hover:to-[#00f0ff]/40 border-2 border-[#00f0ff] rounded-xl font-orbitron font-bold text-[#f8f9fa] transition-all uppercase tracking-widest clip-corner shadow-[0_0_25px_rgba(0,240,255,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Gift className="w-5 h-5 text-[#7fffd4]" />
                    <span>{isClaiming ? 'Abriendo Cofre...' : 'RECLAMAR AHORA'}</span>
                  </button>
                </div>
              ) : (
                <div className="w-full mt-3">
                  <div className="flex items-center justify-center gap-2 text-[#7fffd4] font-orbitron font-bold text-lg mb-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>¡RECOMPENSA OBTENIDA!</span>
                  </div>
                  <div className="bg-[#050810]/80 border border-[#00f0ff]/30 rounded-xl p-3.5 mb-5 flex items-center justify-around text-center">
                    <div>
                      <span className="block text-[10px] text-[#a0a5b5] uppercase tracking-wider">Experiencia</span>
                      <strong className="text-base font-bold text-[#00f0ff]">+50 XP</strong>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div>
                      <span className="block text-[10px] text-[#a0a5b5] uppercase tracking-wider">MagnoPoints</span>
                      <strong className="text-base font-bold text-[#ff007f]">+10 MP</strong>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-full py-3.5 px-6 bg-gradient-to-r from-[#ff007f]/20 to-[#8a2be2]/20 hover:from-[#ff007f]/40 hover:to-[#8a2be2]/40 border border-[#ff007f] rounded-xl font-orbitron font-bold text-[#f8f9fa] transition-all uppercase tracking-widest clip-corner cursor-pointer"
                  >
                    CONTINUAR AL DASHBOARD
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

