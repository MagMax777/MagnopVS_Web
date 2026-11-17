import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { usePlayer } from '../../context/PlayerContext';
import { FiatCurrencyCode, PaymentMethodType, MfsActiveTab } from '../../types/financial';
import { FinancialSystemService } from '../../services/FinancialSystemService';
import {
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  Building2,
  Clock,
  CheckCircle2,
  Lock,
  Wallet,
  DollarSign,
  ChevronRight,
  Info,
} from 'lucide-react';

interface Props {
  onNavigateTab: (tab: MfsActiveTab) => void;
}

export const MfsWithdrawTab: React.FC<Props> = ({ onNavigateTab }) => {
  const {
    balances,
    activeCurrency,
    supportedCurrencies,
    kycProfile,
    requestPayout,
    payoutRequests,
  } = useFinancial();
  const { playSoundEffect } = usePlayer();

  const [withdrawMpAmount, setWithdrawMpAmount] = useState<number>(100);
  const [targetFiat, setTargetFiat] = useState<FiatCurrencyCode>(activeCurrency);
  const [payoutMethod, setPayoutMethod] = useState<PaymentMethodType>('BANK_TRANSFER');
  const [bankName, setBankName] = useState<string>('Bancolombia');
  const [accountNumber, setAccountNumber] = useState<string>('**** 9842');
  const [beneficiaryName, setBeneficiaryName] = useState<string>(kycProfile.fullName);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const isVerified = kycProfile.status === 'VERIFIED';
  const currentFiat = supportedCurrencies.find((c) => c.code === targetFiat) || supportedCurrencies[0];

  // Live Calculation
  const fiatCalc = FinancialSystemService.calculateFiatValueFromMp(withdrawMpAmount, targetFiat);
  const feeMp = Math.max(1, Math.ceil(withdrawMpAmount * 0.02)); // 2% withdrawal fee
  const netMp = Math.max(0, withdrawMpAmount - feeMp);
  const netFiatAmount = Number((netMp * fiatCalc.exchangeRate).toFixed(2));

  const handleExecuteWithdrawal = async () => {
    setIsSubmitting(true);
    setFeedback(null);
    playSoundEffect('click');

    const result = await requestPayout(
      withdrawMpAmount,
      targetFiat,
      payoutMethod,
      {
        bankName,
        accountNumberMasked: accountNumber,
        beneficiaryName,
      }
    );

    setIsSubmitting(false);
    if (result.success && result.payoutRequest) {
      setFeedback({
        text: `Solicitud de retiro registrada exitosamente (#${result.payoutRequest.id.substring(0, 12)}). Los fondos han sido bloqueados para revisión.`,
        type: 'success',
      });
    } else {
      setFeedback({ text: result.error || 'Error al procesar el retiro.', type: 'error' });
    }
  };

  return (
    <div className="space-y-6 font-orbitron animate-fade-in text-[#f8f9fa]">
      
      {/* Header Info */}
      <div className="p-4 bg-[#0a0d14] border border-[#1f2430] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-[#00f0ff] font-mono uppercase font-bold tracking-widest block">
            SISTEMA INTERNACIONAL DE RETIROS // GLOBAL WITHDRAWAL
          </span>
          <h3 className="text-lg font-bold font-audiowide text-white">
            Retirar MagnoPoints a Dinero Real
          </h3>
          <p className="text-xs text-[#a0a5b5] mt-0.5">
            1 MP = 1 USD de referencia. Convierte y recibe transferencias en tu cuenta bancaria o billetera verificada.
          </p>
        </div>

        <div className="text-right font-mono text-xs">
          <span className="text-[#a0a5b5] block text-[10px]">DISPONIBLE PARA RETIRO</span>
          <span className="text-[#7fffd4] font-bold">{balances.magnoPointsAvailable.toLocaleString()} MP (${balances.magnoPointsAvailable.toLocaleString()} USD)</span>
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-2xl border text-xs font-mono flex items-center gap-3 animate-fade-in ${
          feedback.type === 'success'
            ? 'bg-[#7fffd4]/15 border-[#7fffd4] text-[#7fffd4]'
            : 'bg-[#ff007f]/15 border-[#ff007f] text-[#ff007f]'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* KYC Identity Verification Gate (Rule 4) */}
      {!isVerified ? (
        <div className="p-6 bg-[#ff007f]/10 border-2 border-[#ff007f] rounded-2xl space-y-4 shadow-[0_0_30px_rgba(255,0,127,0.2)]">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#ff007f]/20 border border-[#ff007f] text-[#ff007f] shrink-0">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold font-audiowide text-white">
                Verificación de Identidad Requerida (Regla Económica 4)
              </h4>
              <p className="text-xs text-[#ffabf3] leading-relaxed font-mono">
                De acuerdo con el marco de cumplimiento normativo y seguridad financiera de MagnopVS, los retiros a dinero real exigen un perfil verificado (KYC en estado VERIFIED).
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-[#a0a5b5] font-mono">
              Estado actual: <strong className="text-[#ffd700]">{kycProfile.status}</strong>
            </span>

            <button
              onClick={() => {
                playSoundEffect('click');
                onNavigateTab('security_kyc');
              }}
              className="py-2.5 px-5 text-xs font-bold uppercase text-[#05060a] bg-[#ff007f] hover:bg-[#ffabf3] rounded-xl transition-all cursor-pointer shadow-[0_0_15px_rgba(255,0,127,0.4)] flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Completar Verificación KYC Ahora</span>
            </button>
          </div>
        </div>
      ) : (
        /* Verified User Withdrawal Form */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Form */}
          <div className="lg:col-span-2 p-5 bg-[#0a0d14] border border-[#1f2430] rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f2430] pb-2">
              <span className="text-xs font-bold font-audiowide text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#00f0ff]" />
                <span>Destino de Recepción de Fondos</span>
              </span>

              <span className="text-[10px] font-mono text-[#7fffd4] bg-[#7fffd4]/10 px-2 py-0.5 rounded border border-[#7fffd4]/30">
                IDENTIDAD VERIFICADA • Lvl {kycProfile.verificationLevel}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label className="text-[10px] text-[#a0a5b5] block mb-1">MONEDA LOCAL DE RECEPCIÓN</label>
                <select
                  value={targetFiat}
                  onChange={(e) => setTargetFiat(e.target.value as FiatCurrencyCode)}
                  className="w-full bg-[#05060a] border border-[#1f2430] p-2.5 text-white rounded-xl focus:outline-none focus:border-[#00f0ff]"
                >
                  {supportedCurrencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#a0a5b5] block mb-1">MÉTODO DE RETIRO</label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value as PaymentMethodType)}
                  className="w-full bg-[#05060a] border border-[#1f2430] p-2.5 text-white rounded-xl focus:outline-none focus:border-[#00f0ff]"
                >
                  <option value="BANK_TRANSFER">Transferencia Bancaria Nacional</option>
                  <option value="PAYPAL">PayPal e-Wallet</option>
                  <option value="SEPA_EUROPE">SEPA Instant (Europa)</option>
                  <option value="SPEI_MEXICO">SPEI (México)</option>
                  <option value="PIX_BRAZIL">PIX (Brasil)</option>
                  <option value="ACH_USA">ACH Wire (EE.UU.)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#a0a5b5] block mb-1">ENTIDAD BANCARIA / PROVEEDOR</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Ej: Bancolombia, Chase, BBVA"
                  className="w-full bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] p-2.5 text-white rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#a0a5b5] block mb-1">NÚMERO DE CUENTA / IBAN / EMAIL</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Número de cuenta enmascarado"
                  className="w-full bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] p-2.5 text-white rounded-xl focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] text-[#a0a5b5] block mb-1">TITULAR BENEFICIARIO (DEBE COINCIDIR CON KYC)</label>
                <input
                  type="text"
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                  className="w-full bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] p-2.5 text-white rounded-xl focus:outline-none"
                />
              </div>
            </div>

            {/* Amount Slider / Input */}
            <div className="pt-2 space-y-2">
              <label className="text-[10px] text-[#a0a5b5] block">CANTIDAD DE MAGNOPOINTS A RETIRAR (MÍNIMO: 10 MP)</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={10}
                  max={Math.min(5000, balances.magnoPointsAvailable || 10)}
                  value={withdrawMpAmount}
                  onChange={(e) => setWithdrawMpAmount(Number(e.target.value))}
                  className="flex-1 accent-[#00f0ff]"
                />
                <div className="relative">
                  <input
                    type="number"
                    min={10}
                    max={balances.magnoPointsAvailable}
                    value={withdrawMpAmount}
                    onChange={(e) => setWithdrawMpAmount(Number(e.target.value))}
                    className="w-28 bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] p-2 text-right text-xs font-mono font-bold text-white rounded-xl focus:outline-none pr-8"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#00f0ff]">MP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Transparent Breakdown & Submit */}
          <div className="p-5 bg-[#0a0d14] border-2 border-[#00f0ff]/50 rounded-2xl flex flex-col justify-between space-y-4 shadow-xl">
            <div className="space-y-3">
              <span className="text-xs font-bold font-audiowide text-white flex items-center gap-2 border-b border-[#1f2430] pb-2">
                <ShieldCheck className="w-4 h-4 text-[#7fffd4]" />
                <span>Liquidación de Retiro</span>
              </span>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-[#a0a5b5]">
                  <span>MagnoPoints a Debitar:</span>
                  <span className="text-white font-bold">{withdrawMpAmount} MP</span>
                </div>

                <div className="flex justify-between text-[#a0a5b5]">
                  <span>Paridad Base Contable:</span>
                  <span className="text-white">${withdrawMpAmount}.00 USD</span>
                </div>

                <div className="flex justify-between text-[#a0a5b5]">
                  <span>Comisión de Retiro (2%):</span>
                  <span className="text-[#ffd700]">-{feeMp} MP (${feeMp}.00 USD)</span>
                </div>

                <div className="flex justify-between text-[#a0a5b5]">
                  <span>Tasa de Cambio Fiat:</span>
                  <span className="text-white">1 USD = {currentFiat.exchangeRateToUsd.toLocaleString()} {currentFiat.code}</span>
                </div>

                <div className="flex justify-between text-[#a0a5b5]">
                  <span>Tiempo de Procesamiento:</span>
                  <span className="text-white">1 a 2 días hábiles</span>
                </div>
              </div>

              {/* Net Payout Box */}
              <div className="p-4 bg-[#7fffd4]/10 border border-[#7fffd4] rounded-xl text-center space-y-1">
                <span className="text-[10px] text-[#7fffd4] uppercase font-bold tracking-wider block">
                  IMPORTE NETO A RECIBIR
                </span>
                <div className="text-2xl font-black font-audiowide text-white">
                  {currentFiat.symbol} {netFiatAmount.toLocaleString()} <span className="text-xs text-[#7fffd4]">{currentFiat.code}</span>
                </div>
                <span className="text-[10px] text-[#a0a5b5] font-mono block">
                  Equivalente neto a ${netMp}.00 USD
                </span>
              </div>
            </div>

            <button
              onClick={handleExecuteWithdrawal}
              disabled={isSubmitting || withdrawMpAmount > balances.magnoPointsAvailable || withdrawMpAmount < 10}
              className="w-full py-3 px-4 text-xs font-bold uppercase text-[#05060a] bg-gradient-to-r from-[#00f0ff] to-[#7fffd4] hover:opacity-90 rounded-xl transition-all cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>{isSubmitting ? 'Verificando y Bloqueando Fondos...' : `Solicitar Retiro de ${withdrawMpAmount} MP`}</span>
            </button>
          </div>

        </div>
      )}

      {/* Payout History Table */}
      {payoutRequests.length > 0 && (
        <div className="p-5 bg-[#0a0d14] border border-[#1f2430] rounded-2xl space-y-3">
          <span className="text-xs font-bold font-audiowide text-white block">
            Solicitudes de Retiro Recientes ({payoutRequests.length})
          </span>

          <div className="space-y-2">
            {payoutRequests.map((req) => (
              <div
                key={req.id}
                className="p-3 bg-[#05060a] border border-[#1f2430] rounded-xl flex items-center justify-between text-xs font-mono"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-white">#{req.id.substring(0, 14)}</strong>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#ffd700]/15 text-[#ffd700] border border-[#ffd700]/40">
                      {req.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#a0a5b5] block mt-0.5">
                    {req.payoutMethod} • {req.fiatCurrency} • {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-white font-bold block">{req.estimatedNetFiatAmount} {req.fiatCurrency}</span>
                  <span className="text-[10px] text-[#a0a5b5]">-{req.magnoPointsAmount} MP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
