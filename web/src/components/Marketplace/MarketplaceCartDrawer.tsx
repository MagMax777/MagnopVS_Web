import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { usePlayer } from '../../context/PlayerContext';
import {
  X,
  ShoppingBag,
  Trash2,
  Coins,
  Sparkles,
  ArrowRight,
  Tag,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const MarketplaceCartDrawer: React.FC = () => {
  const {
    cart,
    cartCount,
    cartTotalMp,
    cartTotalMicroCoins,
    cartTotalFiatUsd,
    appliedCoupon,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    setIsCheckoutModalOpen,
  } = useMarketplace();

  const { playSoundEffect } = usePlayer();
  const [couponInput, setCouponInput] = useState<string>('');
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    setCouponError(null);
    const result = applyCoupon(couponInput);
    if (!result.success) {
      setCouponError(result.error || 'Cupón inválido.');
    } else {
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    playSoundEffect('portal');
    setIsCartDrawerOpen(false);
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-orbitron animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#05060a]/98 border-l border-[#00f0ff]/40 shadow-[0_0_50px_rgba(0,240,255,0.25)] flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#1f2430] bg-[#0a0d14] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/40 text-[#00f0ff]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-audiowide font-bold text-white uppercase tracking-wider">
                  Carrito de Compras
                </h2>
                <span className="text-[11px] text-[#a0a5b5] font-mono">
                  {cartCount} artículo(s) seleccionados
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#a0a5b5] hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-[#00f0ff]/30">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-[#a0a5b5]">
                <div className="w-16 h-16 rounded-2xl bg-[#0a0d14] border border-[#1f2430] flex items-center justify-center text-[#a0a5b5]/40">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <strong className="text-white text-sm font-audiowide">Tu carrito está vacío</strong>
                <p className="text-xs max-w-xs font-mono">
                  Explora las 16 categorías comerciales, colecciones de sagas o activos digitales de MagnopVS.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-[#0a0d14] border border-[#1f2430] flex gap-3 relative group"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-[#1f2430] shrink-0"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-audiowide font-bold text-white truncate">
                        {item.product.name}
                      </h4>
                      {item.selectedVariant && (
                        <span className="text-[10px] text-[#7fffd4] font-mono block">
                          Variante: {item.selectedVariant.name}
                        </span>
                      )}
                      <span className="text-[10px] text-[#a0a5b5] font-mono block">
                        Por: {item.product.sellerName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {/* Price in MP */}
                      <div className="flex items-center gap-1 text-xs font-bold text-[#00f0ff]">
                        <Coins className="w-3 h-3" />
                        <span>{(item.product.priceMp * item.quantity).toLocaleString()} MP</span>
                      </div>

                      {/* Quantity buttons */}
                      <div className="flex items-center bg-[#05060a] border border-[#1f2430] rounded-lg overflow-hidden font-mono text-[10px]">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 hover:bg-white/10 text-white cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 hover:bg-white/10 text-white cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-2 right-2 text-[#a0a5b5]/50 hover:text-[#ff007f] cursor-pointer"
                    title="Eliminar del carrito"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#1f2430] bg-[#0a0d14] space-y-4">
              
              {/* Coupon Form */}
              <div className="space-y-1.5">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/40 text-xs font-mono text-[#00f0ff]">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Cupón <strong>{appliedCoupon.code}</strong> aplicado (-{appliedCoupon.discountPercent}%)</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-[#ff007f] hover:underline cursor-pointer text-[10px]"
                    >
                      Quitar
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Código de cupón (ej: MAGNOPVS10)"
                        className="flex-1 bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#a0a5b5] font-mono focus:outline-none uppercase"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono cursor-pointer transition-colors"
                      >
                        Aplicar
                      </button>
                    </div>
                    {couponError && (
                      <span className="text-[10px] text-[#ff007f] font-mono block mt-1">
                        {couponError}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Subtotal summary */}
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-[#a0a5b5]">
                  <span>Total en MagnoPoints:</span>
                  <strong className="text-lg font-audiowide text-[#00f0ff]">
                    {cartTotalMp.toLocaleString()} MP
                  </strong>
                </div>

                <div className="flex justify-between text-[#a0a5b5] text-[11px]">
                  <span>Equivalente en MicroCoins:</span>
                  <strong className="text-[#ff007f] font-bold">
                    {cartTotalMicroCoins} µC
                  </strong>
                </div>

                <div className="flex justify-between text-[#a0a5b5] text-[11px]">
                  <span>Equivalente en Moneda Fiduciaria:</span>
                  <strong className="text-white">${cartTotalFiatUsd.toFixed(2)} USD</strong>
                </div>
              </div>

              {/* Checkout Trigger Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#7fffd4] hover:opacity-95 text-black font-audiowide font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all cursor-pointer"
              >
                <span>Proceder al Pago Seguro</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
