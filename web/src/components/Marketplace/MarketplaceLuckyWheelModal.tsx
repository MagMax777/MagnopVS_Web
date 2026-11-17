import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { usePlayer } from '../../context/PlayerContext';
import { Sparkles, Gift, X, Trophy, Coins } from 'lucide-react';

interface WheelSegment {
  id: number;
  label: string;
  type: 'coupon' | 'coins';
  couponCode?: string;
  discountPercent?: number;
  coinsAmount?: number;
  color: string;
}

const WHEEL_SEGMENTS: WheelSegment[] = [
  { id: 0, label: '15% OFF', type: 'coupon', couponCode: 'LUCKY15', discountPercent: 15, color: '#ff007f' },
  { id: 1, label: '+5 µC', type: 'coins', coinsAmount: 5, color: '#ffd700' },
  { id: 2, label: '20% OFF', type: 'coupon', couponCode: 'CYBER20', discountPercent: 20, color: '#00f0ff' },
  { id: 3, label: 'Envío Gratis', type: 'coupon', couponCode: 'FREESHIP', discountPercent: 10, color: '#7fffd4' },
  { id: 4, label: '30% MEGA', type: 'coupon', couponCode: 'MEGA30', discountPercent: 30, color: '#bd00ff' },
  { id: 5, label: '+10 µC', type: 'coins', coinsAmount: 10, color: '#ffaa00' },
  { id: 6, label: '25% OFF', type: 'coupon', couponCode: 'SAGA25', discountPercent: 25, color: '#ff3366' },
  { id: 7, label: '+2 µC', type: 'coins', coinsAmount: 2, color: '#00ff66' },
];

export const MarketplaceLuckyWheelModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { applyCoupon } = useMarketplace();
  const { awardReward, playSoundEffect } = usePlayer();

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [winningSegment, setWinningSegment] = useState<WheelSegment | null>(null);
  const [hasSpunToday, setHasSpunToday] = useState(false);

  if (!isOpen) return null;

  const handleSpin = async () => {
    if (isSpinning || hasSpunToday) return;

    playSoundEffect('portal');
    setIsSpinning(true);
    setWinningSegment(null);

    // Pick random segment
    const segmentIndex = Math.floor(Math.random() * WHEEL_SEGMENTS.length);
    const chosen = WHEEL_SEGMENTS[segmentIndex];

    // Compute rotation (at least 5 full spins = 1800 deg + segment offset)
    const segmentAngle = 360 / WHEEL_SEGMENTS.length;
    const targetAngle = 1800 + (WHEEL_SEGMENTS.length - 1 - segmentIndex) * segmentAngle + segmentAngle / 2;

    setRotationDegrees((prev) => prev + targetAngle);

    setTimeout(async () => {
      setIsSpinning(false);
      setWinningSegment(chosen);
      setHasSpunToday(true);
      playSoundEffect('quest');

      if (chosen.type === 'coupon' && chosen.couponCode) {
        applyCoupon(chosen.couponCode);
      } else if (chosen.type === 'coins' && chosen.coinsAmount) {
        await awardReward(
          'MICROCOIN',
          chosen.coinsAmount,
          'LUCKY_WHEEL_MARKETPLACE',
          `Ruleta de la Suerte: +${chosen.coinsAmount} MicroCoins`,
          `wheel-${Date.now()}`
        );
      }
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in font-orbitron">
      <div className="relative w-full max-w-md bg-[#0a0d14] border-2 border-[#ff007f]/50 rounded-3xl overflow-hidden p-6 sm:p-8 text-center shadow-[0_0_60px_rgba(255,0,127,0.3)]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff007f]/20 border border-[#ff007f]/40 text-[#ff007f] text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
          <span>RULETA GAMIFICADA DE DESCUENTOS</span>
        </div>

        <h3 className="text-xl font-black font-audiowide text-white uppercase mb-1">
          Giro de la Fortuna MagnopVS
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          ¡Gira gratis la ruleta cuántica para desbloquear cupones directos o MicroCoins para tus compras!
        </p>

        {/* Wheel Graphic Container */}
        <div className="relative w-64 h-64 mx-auto mb-6 flex items-center justify-center">
          {/* Wheel Pointer Arrow */}
          <div className="absolute -top-3 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-[#00f0ff] filter drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />

          {/* Rotating Wheel Canvas */}
          <div
            className="w-full h-full rounded-full border-4 border-[#00f0ff] relative overflow-hidden shadow-[0_0_35px_rgba(0,240,255,0.4)] transition-transform duration-[4500ms] cubic-bezier(0.15, 0.9, 0.25, 1)"
            style={{ transform: `rotate(${rotationDegrees}deg)` }}
          >
            {WHEEL_SEGMENTS.map((seg, idx) => {
              const rotate = idx * (360 / WHEEL_SEGMENTS.length);
              return (
                <div
                  key={seg.id}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full origin-bottom flex items-start justify-center pt-3 text-[10px] font-black font-audiowide uppercase tracking-tighter"
                  style={{
                    transform: `rotate(${rotate}deg)`,
                    color: seg.color,
                  }}
                >
                  <span className="bg-black/60 px-1 py-0.5 rounded border border-white/10 shadow">
                    {seg.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Center Hub Button */}
          <button
            onClick={handleSpin}
            disabled={isSpinning || hasSpunToday}
            className={`absolute z-10 w-16 h-16 rounded-full border-2 border-white flex flex-col items-center justify-center font-audiowide text-[10px] font-black uppercase tracking-wider shadow-2xl transition-all cursor-pointer ${
              isSpinning || hasSpunToday
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-br from-[#ff007f] to-[#bd00ff] text-white hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,0,127,0.6)]'
            }`}
          >
            {isSpinning ? '...' : hasSpunToday ? 'LISTO' : 'GIRAR'}
          </button>
        </div>

        {/* Result Message */}
        {winningSegment && (
          <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 space-y-1 mb-4 animate-fade-in">
            <div className="font-bold font-audiowide text-sm flex items-center justify-center gap-1.5">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span>¡Felicidades! Has ganado {winningSegment.label}</span>
            </div>
            {winningSegment.type === 'coupon' ? (
              <p className="text-[11px] text-slate-300">
                El cupón <strong className="text-white font-mono">{winningSegment.couponCode}</strong> se ha aplicado automáticamente a tu carrito.
              </p>
            ) : (
              <p className="text-[11px] text-slate-300">
                Se han acreditado +{winningSegment.coinsAmount} MicroCoins directamente a tu Wallet.
              </p>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs transition-all cursor-pointer"
        >
          {winningSegment ? 'Continuar Comprando' : 'Cerrar Ruleta'}
        </button>

      </div>
    </div>
  );
};
