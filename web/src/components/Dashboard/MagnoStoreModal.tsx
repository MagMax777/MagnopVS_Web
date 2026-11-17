import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { WalletCurrency } from '../../types';
import { 
  X, 
  Coins, 
  ShoppingBag, 
  Award, 
  ShieldAlert, 
  Zap, 
  FileText, 
  CheckCircle2, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const MagnoStoreModal: React.FC = () => {
  const { 
    player, 
    storeItems, 
    buyStoreItem, 
    isStoreModalOpen, 
    setIsStoreModalOpen, 
    playSoundEffect 
  } = usePlayer();

  const [paymentMode, setPaymentMode] = useState<WalletCurrency>('MP');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  if (!isStoreModalOpen) return null;

  const getItemIcon = (iconName: string) => {
    switch (iconName) {
      case 'Award':
        return <Award className="w-6 h-6 text-[#ff007f]" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-6 h-6 text-[#8a2be2]" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-[#00f0ff]" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-[#7fffd4]" />;
      default:
        return <FileText className="w-6 h-6 text-[#7fffd4]" />;
    }
  };

  const handlePurchase = async (itemId: string) => {
    setIsProcessing(itemId);
    setErrorMessage(null);
    const success = await buyStoreItem(itemId, paymentMode);
    if (!success) {
      setErrorMessage(`Saldo insuficiente de ${paymentMode === 'MP' ? 'MagnoPoints' : 'MicroCoins'} para completar la adquisición.`);
      setTimeout(() => setErrorMessage(null), 3500);
    }
    setIsProcessing(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05060a]/90 backdrop-blur-md animate-fade-in font-orbitron">
      <div className="relative w-full max-w-3xl hud-panel p-6 sm:p-8 overflow-hidden max-h-[90vh] flex flex-col clip-corner">
        
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00f0ff] via-[#8a2be2] to-[#ff007f]" />

        {/* Close Button */}
        <button
          onClick={() => {
            playSoundEffect('click');
            setIsStoreModalOpen(false);
          }}
          className="absolute top-5 right-5 p-2 bg-[#12141d] border border-[#1f2430] text-[#a0a5b5] hover:text-[#f8f9fa] rounded-lg transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title & Balances Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#05060a] border border-[#00f0ff]/50 text-[#00f0ff] rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-audiowide text-[#f8f9fa] uppercase tracking-wide">
                MagnoStore <span className="text-[#00f0ff]">MagnopVS</span>
              </h2>
              <p className="text-xs text-[#a0a5b5] font-orbitron">
                Cosméticos holográficos, títulos RPG, artefactos y documentos secretos.
              </p>
            </div>
          </div>

          {/* Current User Balances Pill */}
          <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#05060a] border border-[#00f0ff]/40 text-[#00f0ff] rounded-lg">
              <Coins className="w-3.5 h-3.5" />
              <span>{player.magnoPoints.toLocaleString()} MP</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#05060a] border border-[#ff007f]/40 text-[#ff007f] rounded-lg font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{(player.microCoins || 0).toLocaleString()} µC</span>
            </div>
          </div>
        </div>

        {/* Payment Currency Toggle */}
        <div className="flex items-center justify-between bg-[#0a0b12] p-2 rounded-xl border border-[#1f2430] mb-4">
          <span className="text-xs font-mono text-[#a0a5b5]">Modo de Pago Preferido:</span>
          <div className="flex items-center gap-1 bg-[#05060a] p-1 rounded-lg border border-[#1f2430]">
            <button
              onClick={() => {
                setPaymentMode('MP');
                playSoundEffect('click');
              }}
              className={`px-3 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                paymentMode === 'MP'
                  ? 'bg-[#00f0ff] text-[#05060a] font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                  : 'text-[#a0a5b5] hover:text-[#f8f9fa]'
              }`}
            >
              MagnoPoints (MP)
            </button>
            <button
              onClick={() => {
                setPaymentMode('MICROCOIN');
                playSoundEffect('click');
              }}
              className={`px-3 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                paymentMode === 'MICROCOIN'
                  ? 'bg-[#ff007f] text-[#f8f9fa] font-bold shadow-[0_0_10px_rgba(255,0,127,0.4)]'
                  : 'text-[#a0a5b5] hover:text-[#f8f9fa]'
              }`}
            >
              MicroCoins (µC)
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-[#ff007f]/15 border border-[#ff007f]/50 rounded-xl text-xs text-[#ff007f] font-mono flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Items List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto p-1 pr-2 custom-scrollbar">
          {storeItems.map((item) => {
            const priceInMc = item.priceMicroCoins || Math.max(1, Math.ceil(item.priceMp / 10000));
            const canAfford = paymentMode === 'MP'
              ? player.magnoPoints >= item.priceMp
              : (player.microCoins || 0) >= priceInMc;

            return (
              <div
                key={item.id}
                className={`p-5 bg-[#05060a] border flex flex-col justify-between transition-all rounded-xl ${
                  item.isPurchased
                    ? 'border-[#7fffd4]/30 opacity-75'
                    : 'border-[#1f2430] hover:border-[#00f0ff]/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-3 bg-[#12141d] border border-[#1f2430] rounded-lg">
                      {getItemIcon(item.icon)}
                    </div>
                    <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 rounded">
                      {item.rarity}
                    </span>
                  </div>

                  <h3 className="font-bold font-audiowide text-[#f8f9fa] text-sm mb-1 uppercase">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#a0a5b5] mb-4 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#1f2430]">
                  <div className="font-mono text-xs">
                    {paymentMode === 'MP' ? (
                      <span className="text-[#00f0ff] font-bold flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5" />
                        {item.priceMp.toLocaleString()} MP
                      </span>
                    ) : (
                      <span className="text-[#ff007f] font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        {priceInMc} µC
                      </span>
                    )}
                  </div>

                  {item.isPurchased ? (
                    <div className="flex items-center gap-1 text-xs font-mono text-[#7fffd4]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Adquirido</span>
                    </div>
                  ) : (
                    <button
                      disabled={!canAfford || isProcessing === item.id}
                      onClick={() => handlePurchase(item.id)}
                      className={`px-4 py-2 text-xs font-audiowide uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                        canAfford
                          ? paymentMode === 'MP'
                            ? 'bg-[#00f0ff] text-[#05060a] hover:bg-[#7fffd4] font-black shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                            : 'bg-[#ff007f] text-[#f8f9fa] hover:brightness-125 font-bold shadow-[0_0_12px_rgba(255,0,127,0.4)]'
                          : 'bg-[#12141d] text-[#a0a5b5] cursor-not-allowed border border-[#1f2430]'
                      }`}
                    >
                      {isProcessing === item.id 
                        ? 'Procesando...' 
                        : canAfford 
                        ? `Comprar (${paymentMode === 'MP' ? `${item.priceMp} MP` : `${priceInMc} µC`})` 
                        : `Sin ${paymentMode === 'MP' ? 'MP' : 'µC'}`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
