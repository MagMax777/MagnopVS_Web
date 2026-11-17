import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { usePlayer } from '../../context/PlayerContext';
import { MarketplaceOrder } from '../../types/marketplace';
import {
  X,
  ShieldCheck,
  Coins,
  Sparkles,
  CreditCard,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Download,
  GraduationCap,
  Truck,
  RotateCcw,
  Lock,
  RefreshCw
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    cartCount,
    cartTotalMp,
    cartTotalMicroCoins,
    cartTotalFiatUsd,
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    processCheckout,
    appliedCoupon,
    setActiveTab,
  } = useMarketplace();

  const { player } = usePlayer();

  const [step, setStep] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<'MP' | 'MICROCOIN' | 'FIAT'>('MP');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<MarketplaceOrder | null>(null);

  // Form for physical delivery
  const [shippingAddress, setShippingAddress] = useState({
    fullName: player.name || 'Viajero Cósmico',
    street: 'Av. Quantvm Matrix 777',
    city: 'Neo Sector Alpha',
    state: 'Goloka',
    country: 'Multiverso MagnopVS',
    postalCode: '99001',
  });

  if (!isCheckoutModalOpen) return null;

  const hasPhysicalItems = cart.some((i) => i.product.format === 'PHYSICAL');

  const handleExecutePayment = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    const result = await processCheckout({
      paymentMethod,
      shippingAddress: hasPhysicalItems ? shippingAddress : undefined,
    });

    setIsProcessing(false);

    if (result.success && result.order) {
      setCompletedOrder(result.order);
      setStep(5); // Receipt
    } else {
      setErrorMessage(result.error || 'Error en la transacción contable.');
    }
  };

  const handleClose = () => {
    setIsCheckoutModalOpen(false);
    setStep(1);
    setCompletedOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-xl animate-fade-in font-orbitron overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#05060a]/98 border-2 border-[#00f0ff]/50 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,240,255,0.3)] flex flex-col my-auto">
        
        {/* Glow Header Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#00f0ff] via-[#8a2be2] to-[#ff007f]" />

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#1f2430] bg-[#0a0d14] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/40 text-[#00f0ff]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-audiowide font-bold text-white uppercase tracking-wider">
                Pasarela Segura MagnopVS
              </h2>
              <span className="text-[10px] text-[#7fffd4] font-mono">
                Paso {step} de 5 • Liquidación con Wallet Auditada
              </span>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#a0a5b5] hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="grid grid-cols-5 border-b border-[#1f2430] text-[10px] font-mono text-center">
          {['Identidad', 'Entrega', 'Pago', 'Revisión', 'Recibo'].map((label, idx) => (
            <div
              key={label}
              className={`py-2 border-r border-[#1f2430] last:border-r-0 ${
                step === idx + 1
                  ? 'bg-[#00f0ff]/15 text-[#00f0ff] font-bold'
                  : step > idx + 1
                  ? 'text-[#7fffd4] bg-white/5'
                  : 'text-[#a0a5b5]/50'
              }`}
            >
              {idx + 1}. {label}
            </div>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-6">
          
          {/* STEP 1: IDENTITY */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#0a0d14] border border-[#1f2430] flex items-center gap-3">
                <img
                  src={player.avatarUrl}
                  alt={player.name}
                  className="w-12 h-12 rounded-xl object-cover border border-[#00f0ff]/40"
                />
                <div>
                  <h3 className="text-sm font-audiowide text-white">{player.name}</h3>
                  <span className="text-xs text-[#7fffd4] font-mono">Nivel {player.level} • {player.faction}</span>
                  <span className="text-[10px] text-[#a0a5b5] block font-mono">
                    ID Cuenta: {player.id} • Sesión Criptográfica Activa
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#00f0ff]/5 border border-[#00f0ff]/30 text-xs font-mono text-[#a0a5b5] space-y-1">
                <strong className="text-[#00f0ff] block">Resumen del Carrito:</strong>
                <p>Estás a punto de adquirir {cartCount} producto(s) por un valor de {cartTotalMp.toLocaleString()} MP.</p>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3 rounded-xl bg-[#00f0ff] hover:bg-[#7fffd4] text-black font-audiowide font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Continuar a Entrega</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: DELIVERY / DIGITAL ACCESS */}
          {step === 2 && (
            <div className="space-y-4">
              {hasPhysicalItems ? (
                <div className="space-y-3 font-mono text-xs">
                  <span className="text-white font-bold block text-sm">Dirección de Envío Físico:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-[#a0a5b5] block mb-1">Nombre Completo:</label>
                      <input
                        type="text"
                        value={shippingAddress.fullName}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                        className="w-full bg-[#0a0d14] border border-[#1f2430] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00f0ff]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#a0a5b5] block mb-1">Calle y Número:</label>
                      <input
                        type="text"
                        value={shippingAddress.street}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                        className="w-full bg-[#0a0d14] border border-[#1f2430] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00f0ff]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#a0a5b5] block mb-1">Ciudad / Sector:</label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        className="w-full bg-[#0a0d14] border border-[#1f2430] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00f0ff]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#a0a5b5] block mb-1">Código Postal:</label>
                      <input
                        type="text"
                        value={shippingAddress.postalCode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                        className="w-full bg-[#0a0d14] border border-[#1f2430] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00f0ff]"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-[#0a0d14] border border-[#1f2430] text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] flex items-center justify-center mx-auto">
                    <Download className="w-6 h-6" />
                  </div>
                  <strong className="text-white text-sm font-audiowide block">Entrega 100% Digital e Instantánea</strong>
                  <p className="text-xs text-[#a0a5b5] font-mono max-w-sm mx-auto">
                    Tus activos digitales, licencias o cursos se habilitarán inmediatamente en tu perfil al confirmar el pago.
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-mono cursor-pointer"
                >
                  Atrás
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-2.5 rounded-xl bg-[#00f0ff] hover:bg-[#7fffd4] text-black font-audiowide font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continuar a Método de Pago</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD */}
          {step === 3 && (
            <div className="space-y-4">
              <span className="text-xs font-mono text-[#a0a5b5] block">
                Selecciona la forma de pago para esta orden:
              </span>

              <div className="grid grid-cols-1 gap-2.5">
                
                {/* 1. MagnoPoints */}
                <div
                  onClick={() => setPaymentMethod('MP')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'MP'
                      ? 'bg-[#00f0ff]/15 border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                      : 'bg-[#0a0d14] border-[#1f2430] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#00f0ff]/10 text-[#00f0ff]">
                      <Coins className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-white text-sm font-audiowide block">MagnoPoints (MP)</strong>
                      <span className="text-xs text-[#a0a5b5] font-mono">
                        Tu saldo disponible: <strong className="text-[#00f0ff]">{player.magnoPoints.toLocaleString()} MP</strong>
                      </span>
                    </div>
                  </div>
                  <strong className="text-sm font-audiowide text-[#00f0ff]">
                    {cartTotalMp.toLocaleString()} MP
                  </strong>
                </div>

                {/* 2. MicroCoins */}
                <div
                  onClick={() => setPaymentMethod('MICROCOIN')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'MICROCOIN'
                      ? 'bg-[#ff007f]/15 border-[#ff007f] shadow-[0_0_20px_rgba(255,0,127,0.2)]'
                      : 'bg-[#0a0d14] border-[#1f2430] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#ff007f]/10 text-[#ff007f]">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-white text-sm font-audiowide block">MicroCoins (µC)</strong>
                      <span className="text-xs text-[#a0a5b5] font-mono">
                        Tu saldo disponible: <strong className="text-[#ff007f]">{player.microCoins || 0} µC</strong>
                      </span>
                    </div>
                  </div>
                  <strong className="text-sm font-audiowide text-[#ff007f]">
                    {cartTotalMicroCoins} µC
                  </strong>
                </div>

                {/* 3. External Simulated Gateway */}
                <div
                  onClick={() => setPaymentMethod('FIAT')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'FIAT'
                      ? 'bg-[#7fffd4]/15 border-[#7fffd4] shadow-[0_0_20px_rgba(127,255,212,0.2)]'
                      : 'bg-[#0a0d14] border-[#1f2430] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#7fffd4]/10 text-[#7fffd4]">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-white text-sm font-audiowide block">Pasarela Externa (Stripe / Tarjeta)</strong>
                      <span className="text-xs text-[#a0a5b5] font-mono">
                        Adaptador preparado para pasarela fiduciaria
                      </span>
                    </div>
                  </div>
                  <strong className="text-sm font-audiowide text-white">
                    ${cartTotalFiatUsd.toFixed(2)} USD
                  </strong>
                </div>

              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-mono cursor-pointer"
                >
                  Atrás
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 py-2.5 rounded-xl bg-[#00f0ff] hover:bg-[#7fffd4] text-black font-audiowide font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Revisar Pedido</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & CONFIRM */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#0a0d14] border border-[#1f2430] space-y-3 font-mono text-xs">
                <div className="flex justify-between pb-2 border-b border-[#1f2430]">
                  <span className="text-[#a0a5b5]">Total Artículos:</span>
                  <span className="text-white font-bold">{cartCount}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#1f2430]">
                  <span className="text-[#a0a5b5]">Método de Pago Seleccionado:</span>
                  <span className="text-[#00f0ff] font-bold">
                    {paymentMethod === 'MP' ? 'MagnoPoints' : paymentMethod === 'MICROCOIN' ? 'MicroCoins' : 'Pasarela Externa'}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between pb-2 border-b border-[#1f2430] text-[#7fffd4]">
                    <span>Descuento por Cupón ({appliedCoupon.code}):</span>
                    <span>-{appliedCoupon.discountPercent}%</span>
                  </div>
                )}
                <div className="flex justify-between pt-1 text-sm font-audiowide text-white">
                  <span>Monto Total a Debitar:</span>
                  <span className="text-[#00f0ff]">
                    {paymentMethod === 'MP'
                      ? `${cartTotalMp.toLocaleString()} MP`
                      : paymentMethod === 'MICROCOIN'
                      ? `${cartTotalMicroCoins} µC`
                      : `$${cartTotalFiatUsd.toFixed(2)} USD`}
                  </span>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-[#ff007f]/15 border border-[#ff007f]/50 text-xs text-[#ff007f] font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  disabled={isProcessing}
                  onClick={() => setStep(3)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-mono cursor-pointer"
                >
                  Atrás
                </button>

                <button
                  disabled={isProcessing}
                  onClick={handleExecutePayment}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#7fffd4] hover:opacity-95 text-black font-audiowide font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.4)] cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Liquidando transacción en la Wallet...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Confirmar y Pagar Ahora</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: AUDITED RECEIPT & COMPLETED */}
          {step === 5 && completedOrder && (
            <div className="space-y-5 text-center font-mono">
              <div className="w-16 h-16 rounded-full bg-[#7fffd4]/15 border-2 border-[#7fffd4] text-[#7fffd4] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(127,255,212,0.4)] animate-pulse">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-black font-audiowide text-white uppercase">
                  ¡Transacción Exitosa!
                </h3>
                <p className="text-xs text-[#a0a5b5] mt-1">
                  Tu orden ha sido liquidada y registrada de forma inmutable en el ledger de MagnopVS.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="p-4 rounded-2xl bg-[#0a0d14] border border-[#1f2430] text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#a0a5b5]">N° de Orden:</span>
                  <span className="text-white font-bold">{completedOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a0a5b5]">ID de Auditoría Wallet:</span>
                  <span className="text-[#00f0ff] font-bold">{completedOrder.transactionAuditId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a0a5b5]">Total Pagado:</span>
                  <span className="text-[#7fffd4] font-bold">
                    {completedOrder.currencyUsed === 'MP'
                      ? `${completedOrder.totalMp.toLocaleString()} MP`
                      : completedOrder.currencyUsed === 'MICROCOIN'
                      ? `${completedOrder.totalMicroCoins} µC`
                      : `$${completedOrder.totalFiatUsd.toFixed(2)} USD`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a0a5b5]">Recompensa Obtenida:</span>
                  <span className="text-[#ffaa00] font-bold">+150 MP & +200 XP</span>
                </div>
              </div>

              {/* Destination Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    handleClose();
                    setActiveTab('downloads');
                  }}
                  className="py-2.5 px-3 rounded-xl bg-[#00f0ff]/15 hover:bg-[#00f0ff]/30 text-[#00f0ff] border border-[#00f0ff]/40 text-xs font-audiowide flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Mis Descargas Digitales</span>
                </button>

                <button
                  onClick={() => {
                    handleClose();
                    setActiveTab('orders');
                  }}
                  className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-audiowide flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <span>Ver Historial de Pedidos</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
