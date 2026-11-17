import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { usePlayer } from '../../context/PlayerContext';
import { FiatCurrencyCode, PaymentMethodType } from '../../types/financial';
import { FinancialSystemService } from '../../services/FinancialSystemService';
import {
  CreditCard,
  Building2,
  QrCode,
  Send,
  Globe,
  Landmark,
  Wallet,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';

export const MfsTopUpTab: React.FC = () => {
  const {
    activeCurrency,
    setActiveCurrency,
    supportedCurrencies,
    paymentProviders,
    executeTopUp,
  } = useFinancial();
  const { playSoundEffect } = usePlayer();

  const [selectedCurrency, setSelectedCurrency] = useState<FiatCurrencyCode>(activeCurrency);
  const [fiatAmount, setFiatAmount] = useState<number>(() => {
    return activeCurrency === 'COP' ? 100000 : activeCurrency === 'MXN' ? 500 : 50;
  });
  const [selectedProviderId, setSelectedProviderId] = useState<string>('stripe-card-global');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successReceipt, setSuccessReceipt] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentFiat = supportedCurrencies.find((c) => c.code === selectedCurrency) || supportedCurrencies[0];
  const selectedProvider = paymentProviders.find((p) => p.id === selectedProviderId) || paymentProviders[0];

  // Calculate live breakdown
  const calculation = FinancialSystemService.calculateMpFromFiat(
    fiatAmount,
    selectedCurrency,
    selectedProviderId
  );

  const handleSelectCurrency = (code: FiatCurrencyCode) => {
    playSoundEffect('click');
    setSelectedCurrency(code);
    setActiveCurrency(code);
    if (code === 'COP') setFiatAmount(100000);
    else if (code === 'MXN') setFiatAmount(500);
    else if (code === 'BRL') setFiatAmount(150);
    else if (code === 'EUR') setFiatAmount(50);
    else setFiatAmount(50);
  };

  const handleExecuteTopUp = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    playSoundEffect('click');

    const result = await executeTopUp({
      fiatCurrency: selectedCurrency,
      fiatAmount,
      providerId: selectedProviderId,
      paymentMethod: selectedProvider.type,
    });

    setIsProcessing(false);
    if (result.success && result.result) {
      setSuccessReceipt(result.result);
    } else {
      setErrorMessage(result.error || 'Error al procesar la recarga.');
    }
  };

  const getProviderIcon = (type: PaymentMethodType) => {
    switch (type) {
      case 'CREDIT_DEBIT_CARD': return <CreditCard className="w-5 h-5" />;
      case 'PSE_COLOMBIA': return <Building2 className="w-5 h-5" />;
      case 'PIX_BRAZIL': return <QrCode className="w-5 h-5" />;
      case 'SPEI_MEXICO': return <Send className="w-5 h-5" />;
      case 'SEPA_EUROPE': return <Globe className="w-5 h-5" />;
      case 'ACH_USA': return <Landmark className="w-5 h-5" />;
      case 'PAYPAL': return <Wallet className="w-5 h-5" />;
      default: return <CreditCard className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6 font-orbitron animate-fade-in text-[#f8f9fa]">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-[#0a0d14] border border-[#1f2430] rounded-2xl">
        <div>
          <span className="text-[10px] text-[#00f0ff] font-mono uppercase font-bold tracking-widest block">
            SISTEMA INTERNACIONAL DE RECARGAS // GLOBAL TOP-UP
          </span>
          <h3 className="text-lg font-bold font-audiowide text-white">
            Recargar MagnoPoints con Dinero Real
          </h3>
          <p className="text-xs text-[#a0a5b5] mt-0.5">
            1 MP = 1 USD garantizado. Paga en tu moneda local con comisiones y conversión transparentes.
          </p>
        </div>

        {/* Currency Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#a0a5b5] font-mono">Moneda:</span>
          <select
            value={selectedCurrency}
            onChange={(e) => handleSelectCurrency(e.target.value as FiatCurrencyCode)}
            className="bg-[#05060a] border border-[#00f0ff]/40 p-2 text-xs font-mono font-bold text-white rounded-xl focus:outline-none"
          >
            {supportedCurrencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code} ({c.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Inputs & Calculations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Amount & Payment Provider Selection */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Step 1: Amount Selection */}
          <div className="p-5 bg-[#0a0d14] border border-[#1f2430] rounded-2xl space-y-4">
            <span className="text-xs font-bold font-audiowide text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#00f0ff] text-[#05060a] text-[11px] flex items-center justify-center font-bold">1</span>
              <span>Importe a Recargar en {currentFiat.name} ({currentFiat.code})</span>
            </span>

            {/* Quick Preset Buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {(selectedCurrency === 'COP'
                ? [50000, 100000, 200000, 500000]
                : selectedCurrency === 'MXN'
                ? [250, 500, 1000, 2500]
                : [25, 50, 100, 250]
              ).map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    playSoundEffect('click');
                    setFiatAmount(preset);
                  }}
                  className={`py-2 px-3 text-xs font-mono font-bold rounded-xl border transition-all cursor-pointer ${
                    fiatAmount === preset
                      ? 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]'
                      : 'bg-[#05060a] text-[#a0a5b5] border-[#1f2430] hover:text-white'
                  }`}
                >
                  {currentFiat.symbol} {preset.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#a0a5b5] font-mono font-bold">
                {currentFiat.symbol}
              </span>
              <input
                type="number"
                min={1}
                value={fiatAmount}
                onChange={(e) => setFiatAmount(Math.max(1, Number(e.target.value)))}
                className="w-full bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] py-3 pl-8 pr-16 text-base font-mono font-bold text-white rounded-xl focus:outline-none"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#00f0ff] font-mono font-bold">
                {currentFiat.code}
              </span>
            </div>
          </div>

          {/* Step 2: Payment Provider Adapters */}
          <div className="p-5 bg-[#0a0d14] border border-[#1f2430] rounded-2xl space-y-4">
            <span className="text-xs font-bold font-audiowide text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#00f0ff] text-[#05060a] text-[11px] flex items-center justify-center font-bold">2</span>
              <span>Método de Pago Internacional</span>
            </span>

            <div className="space-y-2.5">
              {paymentProviders.map((prov) => {
                const isSelected = selectedProviderId === prov.id;

                return (
                  <div
                    key={prov.id}
                    onClick={() => {
                      playSoundEffect('click');
                      setSelectedProviderId(prov.id);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#00f0ff]/10 border-[#00f0ff] text-white shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                        : 'bg-[#05060a] border-[#1f2430] text-[#a0a5b5] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg border ${
                        isSelected ? 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]/50' : 'bg-white/5 text-[#a0a5b5] border-white/10'
                      }`}>
                        {getProviderIcon(prov.type)}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-xs font-bold text-white">{prov.name}</strong>
                          {prov.badge && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 bg-white/5 text-[#7fffd4] border border-[#7fffd4]/30 rounded">
                              {prov.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#a0a5b5] font-mono block">
                          Comisión: {(prov.feePercentage * 100).toFixed(1)}% + ${prov.fixedFeeUsd} USD • Tiempo: {prov.processingTime}
                        </span>
                      </div>
                    </div>

                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0">
                      {isSelected && <span className="w-2 h-2 rounded-full bg-[#00f0ff]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Transparent Financial Breakdown & Confirmation */}
        <div className="p-5 bg-[#0a0d14] border-2 border-[#00f0ff]/50 rounded-2xl flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-4">
            <span className="text-xs font-bold font-audiowide text-white flex items-center gap-2 border-b border-[#1f2430] pb-2">
              <ShieldCheck className="w-4 h-4 text-[#00f0ff]" />
              <span>Desglose de Operación MFS</span>
            </span>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between text-[#a0a5b5]">
                <span>Importe Solicitado:</span>
                <span className="text-white font-bold">{currentFiat.symbol} {fiatAmount.toLocaleString()} {currentFiat.code}</span>
              </div>

              <div className="flex justify-between text-[#a0a5b5]">
                <span>Tasa de Cambio Fiat:</span>
                <span className="text-white">1 USD = {calculation.exchangeRate.toLocaleString()} {currentFiat.code}</span>
              </div>

              <div className="flex justify-between text-[#a0a5b5]">
                <span>Equivalente Bruto USD:</span>
                <span className="text-white">${calculation.grossUsd} USD</span>
              </div>

              <div className="flex justify-between text-[#a0a5b5]">
                <span>Comisión de Pasarela:</span>
                <span className="text-[#ffd700]">-${calculation.feeUsd} USD ({currentFiat.symbol} {calculation.totalFiatFee})</span>
              </div>

              <div className="pt-2 border-t border-[#1f2430] flex justify-between text-sm">
                <span className="text-[#00f0ff] font-bold">Importe Neto USD:</span>
                <span className="text-[#00f0ff] font-bold">${calculation.netUsd} USD</span>
              </div>
            </div>

            {/* MagnoPoints to Receive Box */}
            <div className="p-4 bg-[#00f0ff]/10 border border-[#00f0ff] rounded-xl text-center space-y-1">
              <span className="text-[10px] text-[#00f0ff] uppercase font-bold tracking-wider block">
                MAGNOPOINTS A ACREDITAR
              </span>
              <div className="text-3xl font-black font-audiowide text-white">
                +{calculation.magnoPointsToCredit.toLocaleString()} <span className="text-sm text-[#00f0ff]">MP</span>
              </div>
              <span className="text-[10px] text-[#7fffd4] font-mono block">
                Exactamente $1 USD = 1 MP (Regla de Paridad V1.1)
              </span>
            </div>

            {errorMessage && (
              <div className="p-3 bg-[#ff007f]/15 border border-[#ff007f] text-xs text-[#ff007f] rounded-xl font-mono">
                {errorMessage}
              </div>
            )}
          </div>

          <button
            onClick={handleExecuteTopUp}
            disabled={isProcessing || calculation.magnoPointsToCredit <= 0}
            className="w-full py-3 px-4 text-xs font-bold uppercase text-[#05060a] bg-gradient-to-r from-[#00f0ff] to-[#7fffd4] hover:opacity-90 rounded-xl transition-all cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>{isProcessing ? 'Procesando en Pasarela Segura...' : `Pagar ${currentFiat.symbol} ${fiatAmount.toLocaleString()} ${currentFiat.code}`}</span>
          </button>
        </div>

      </div>

      {/* Success Receipt Modal */}
      {successReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-orbitron">
          <div className="relative w-full max-w-md bg-[#0a0d14] border-2 border-[#7fffd4] p-6 rounded-2xl shadow-[0_0_50px_rgba(127,255,212,0.3)] space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#7fffd4]/20 border border-[#7fffd4] flex items-center justify-center text-[#7fffd4] mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold font-audiowide text-white">
                ¡Recarga Acreditada Exitosamente!
              </h3>
              <p className="text-xs text-[#a0a5b5] mt-1 font-mono">
                Transacción registrada en el libro mayor de MagnopVS.
              </p>
            </div>

            <div className="p-3.5 bg-[#05060a] rounded-xl border border-[#1f2430] space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Referencia:</span>
                <span className="text-white font-bold">{successReceipt.providerReference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Importe Pagado:</span>
                <span className="text-white">{successReceipt.fiatAmount} {successReceipt.fiatCurrency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">MagnoPoints Acreditados:</span>
                <span className="text-[#7fffd4] font-bold">+{successReceipt.magnoPointsToCredit} MP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Estado:</span>
                <span className="text-[#7fffd4]">CONFIRMADO (COMPLETED)</span>
              </div>
            </div>

            <button
              onClick={() => setSuccessReceipt(null)}
              className="w-full py-2.5 px-4 text-xs font-bold uppercase text-[#05060a] bg-[#7fffd4] hover:bg-[#00f0ff] rounded-xl transition-all cursor-pointer"
            >
              Cerrar Comprobante
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
