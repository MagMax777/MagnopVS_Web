import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { usePlayer } from '../../context/PlayerContext';
import { INITIAL_TOP_UP_PACKS } from '../../data/financialData';
import {
  Coins,
  DollarSign,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Zap,
} from 'lucide-react';

export const MfsBuyMpTab: React.FC = () => {
  const { executeTopUp, activeCurrency, supportedCurrencies } = useFinancial();
  const { playSoundEffect } = usePlayer();

  const [selectedPackId, setSelectedPackId] = useState<string>('pack-quantvm-50');
  const [customUsdAmount, setCustomUsdAmount] = useState<number>(75);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const currentFiat = supportedCurrencies.find((c) => c.code === activeCurrency) || supportedCurrencies[0];

  const handleBuyPack = async (usdAmount: number) => {
    setIsProcessing(true);
    setSuccessMessage(null);
    playSoundEffect('click');

    const result = await executeTopUp({
      fiatCurrency: 'USD',
      fiatAmount: usdAmount,
      providerId: 'stripe-card-global',
      paymentMethod: 'CREDIT_DEBIT_CARD',
    });

    setIsProcessing(false);
    if (result.success && result.result) {
      playSoundEffect('buy');
      setSuccessMessage(`¡Compra exitosa! Se han acreditado +${result.result.magnoPointsToCredit} MP a tu cuenta con paridad oficial $1 USD = 1 MP.`);
    }
  };

  return (
    <div className="space-y-6 font-orbitron animate-fade-in text-[#f8f9fa]">
      
      {/* Banner */}
      <div className="p-4 bg-[#0a0d14] border border-[#1f2430] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-[#00f0ff] font-mono uppercase font-bold tracking-widest block">
            MAGNOPOINTS DIRECT STORE
          </span>
          <h3 className="text-lg font-bold font-audiowide text-white">
            Packs Oficiales de MagnoPoints
          </h3>
          <p className="text-xs text-[#a0a5b5] mt-0.5">
            Paridad 1:1 Inviolable. Cada 1 USD depositado equivale exactamente a 1 MagnoPoint (1 MP).
          </p>
        </div>

        <div className="px-3 py-1.5 bg-[#00f0ff]/10 border border-[#00f0ff]/40 rounded-xl text-xs font-mono text-[#00f0ff] font-bold">
          1 MP = $1.00 USD
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-[#7fffd4]/15 border border-[#7fffd4] rounded-2xl text-xs font-mono text-[#7fffd4] flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Packs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {INITIAL_TOP_UP_PACKS.map((pack) => {
          const isSelected = !isCustom && selectedPackId === pack.id;
          const localFiatValue = (pack.usdAmount * currentFiat.exchangeRateToUsd).toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          });

          return (
            <div
              key={pack.id}
              onClick={() => {
                playSoundEffect('click');
                setIsCustom(false);
                setSelectedPackId(pack.id);
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden ${
                isSelected
                  ? 'bg-[#00f0ff]/10 border-[#00f0ff] shadow-[0_0_30px_rgba(0,240,255,0.25)]'
                  : 'bg-[#0a0d14] border-[#1f2430] hover:border-white/30'
              }`}
            >
              {pack.popular && (
                <span className="absolute top-3 right-3 text-[9px] font-mono font-bold px-2 py-0.5 bg-[#00f0ff] text-[#05060a] rounded-md uppercase">
                  MÁS POPULAR
                </span>
              )}

              <div>
                <span className="text-[10px] text-[#00f0ff] font-mono uppercase font-bold block mb-1">
                  {pack.bonusLabel}
                </span>
                <h4 className="text-base font-bold font-audiowide text-white">{pack.title}</h4>
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black font-audiowide text-white">
                    +{pack.magnoPoints.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-[#00f0ff] font-mono">MP</span>
                </div>
                <div className="text-xs text-[#a0a5b5] font-mono">
                  ${pack.usdAmount} USD ({currentFiat.symbol} {localFiatValue} {currentFiat.code})
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleBuyPack(pack.usdAmount);
                }}
                disabled={isProcessing}
                className="w-full py-2.5 px-4 text-xs font-bold uppercase text-[#05060a] bg-gradient-to-r from-[#00f0ff] to-[#7fffd4] hover:opacity-90 rounded-xl transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center justify-center gap-1.5"
              >
                <span>Adquirir por ${pack.usdAmount} USD</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Custom Amount Card */}
      <div className="p-5 bg-[#0a0d14] border border-[#1f2430] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold font-audiowide text-white">¿Deseas una cantidad personalizada?</h4>
          <span className="text-xs text-[#a0a5b5] font-mono">Introduce el monto en USD para obtener la cantidad exacta de MP.</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#a0a5b5]">$</span>
            <input
              type="number"
              min={10}
              max={10000}
              value={customUsdAmount}
              onChange={(e) => setCustomUsdAmount(Number(e.target.value))}
              className="bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] py-2 pl-6 pr-12 text-xs font-mono font-bold text-white rounded-xl focus:outline-none w-32"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#00f0ff]">USD</span>
          </div>

          <button
            onClick={() => handleBuyPack(customUsdAmount)}
            disabled={isProcessing || customUsdAmount < 10}
            className="py-2 px-4 text-xs font-bold uppercase text-[#05060a] bg-[#00f0ff] hover:bg-[#7fffd4] rounded-xl transition-all cursor-pointer whitespace-nowrap"
          >
            Comprar +{customUsdAmount} MP
          </button>
        </div>
      </div>

    </div>
  );
};
