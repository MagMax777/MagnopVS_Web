import React from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { usePlayer } from '../../context/PlayerContext';
import { MfsActiveTab } from '../../types/financial';
import {
  Coins,
  Sparkles,
  ArrowRightLeft,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  Clock,
  TrendingUp,
  Lock,
  DollarSign,
  ChevronRight,
  ExternalLink,
  Shield,
  Award,
} from 'lucide-react';

interface Props {
  onNavigateTab: (tab: MfsActiveTab) => void;
}

export const MfsOverviewTab: React.FC<Props> = ({ onNavigateTab }) => {
  const { balances, activeCurrency, supportedCurrencies, kycProfile, activeConversionRule } = useFinancial();
  const { playSoundEffect } = usePlayer();

  const currentFiat = supportedCurrencies.find((c) => c.code === activeCurrency) || supportedCurrencies[0];
  const mpFiatValue = (balances.magnoPointsAvailable * currentFiat.exchangeRateToUsd).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const mcEstimatedMp = Math.floor(balances.magnoCoinsAvailable * activeConversionRule.currentRateMpPerMc);
  const mcEstimatedFiat = (mcEstimatedMp * currentFiat.exchangeRateToUsd).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const isKycVerified = kycProfile.status === 'VERIFIED';

  return (
    <div className="space-y-6 font-orbitron animate-fade-in text-[#f8f9fa]">
      
      {/* Parity & Invariant Official Banner */}
      <div className="p-4 bg-gradient-to-r from-[#00f0ff]/15 via-[#8a2be2]/15 to-[#ff007f]/15 border border-[#00f0ff]/50 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_0_30px_rgba(0,240,255,0.15)]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#00f0ff]/20 border border-[#00f0ff] text-[#00f0ff] shrink-0">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-audiowide font-bold text-white uppercase tracking-wider">
                MAGNOPVS FINANCIAL SYSTEM // V1.1
              </span>
              <span className="text-[9px] bg-[#00f0ff]/20 text-[#00f0ff] px-2 py-0.5 rounded font-mono border border-[#00f0ff]/40">
                PARIDAD OFICIAL 1 MP = 1 USD
              </span>
            </div>
            <p className="text-[11px] text-[#a0a5b5] font-mono mt-0.5">
              Unidad contable vinculada al Dólar estadounidense. Moneda local activa: {currentFiat.name} ({currentFiat.symbol} {currentFiat.code}).
            </p>
          </div>
        </div>

        {/* KYC Status Pill */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <div className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border flex items-center gap-1.5 ${
            isKycVerified
              ? 'bg-[#7fffd4]/15 border-[#7fffd4] text-[#7fffd4]'
              : 'bg-[#ffd700]/15 border-[#ffd700] text-[#ffd700]'
          }`}>
            {isKycVerified ? <ShieldCheck className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
            <span>KYC {kycProfile.status}</span>
          </div>

          <button
            onClick={() => {
              playSoundEffect('click');
              onNavigateTab('security_kyc');
            }}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#a0a5b5] hover:text-white transition-colors cursor-pointer"
            title="Verificar Identidad"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* The 3 Currencies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. MAGNOPOINTS (MP) CARD */}
        <div className="relative p-5 bg-[#0a0d14] border-2 border-[#00f0ff]/50 rounded-2xl shadow-[0_0_25px_rgba(0,240,255,0.15)] flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#00f0ff]/20 border border-[#00f0ff] flex items-center justify-center text-[#00f0ff]">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-[#00f0ff] font-mono uppercase font-bold tracking-wider block">
                  MONEDA ECONÓMICA
                </span>
                <h3 className="text-base font-bold font-audiowide text-white">MagnoPoints (MP)</h3>
              </div>
            </div>

            <span className="text-[9px] font-mono text-[#7fffd4] px-2 py-0.5 bg-[#7fffd4]/10 border border-[#7fffd4]/30 rounded">
              1 MP = $1.00 USD
            </span>
          </div>

          {/* Balance Amount & Local Fiat Equivalent */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-audiowide text-white">
                {balances.magnoPointsAvailable.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-[#00f0ff] font-mono">MP</span>
            </div>

            <div className="text-xs text-[#7fffd4] font-mono">
              ≈ {currentFiat.symbol} {mpFiatValue} {currentFiat.code} (Valor de Retiro)
            </div>
          </div>

          {/* Sub-balances breakdown */}
          <div className="pt-3 border-t border-[#1f2430] space-y-1.5 text-[11px] font-mono">
            <div className="flex justify-between text-[#a0a5b5]">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#ffd700]" /> Saldo Pendiente:
              </span>
              <span className="text-white font-bold">{balances.magnoPointsPending} MP</span>
            </div>
            <div className="flex justify-between text-[#a0a5b5]">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#ff007f]" /> Saldo en Retiro:
              </span>
              <span className="text-white font-bold">{balances.magnoPointsWithdrawing} MP</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => {
                playSoundEffect('click');
                onNavigateTab('top_up');
              }}
              className="py-2 px-3 text-xs font-bold uppercase text-[#05060a] bg-[#00f0ff] hover:bg-[#7fffd4] rounded-xl transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center justify-center gap-1.5"
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>Recargar</span>
            </button>

            <button
              onClick={() => {
                playSoundEffect('click');
                onNavigateTab('withdraw');
              }}
              className="py-2 px-3 text-xs font-bold uppercase text-white hover:text-[#00f0ff] bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00f0ff]/40 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Retirar</span>
            </button>
          </div>
        </div>

        {/* 2. MAGNOCOINS (MC) CARD */}
        <div className="relative p-5 bg-[#0a0d14] border-2 border-[#8a2be2]/50 rounded-2xl shadow-[0_0_25px_rgba(138,43,226,0.15)] flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#8a2be2]/20 border border-[#8a2be2] flex items-center justify-center text-[#ffabf3]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-[#ffabf3] font-mono uppercase font-bold tracking-wider block">
                  MONEDA DE JUEGO & PARTICIPACIÓN
                </span>
                <h3 className="text-base font-bold font-audiowide text-white">MagnoCoins (MC)</h3>
              </div>
            </div>

            <span className="text-[9px] font-mono text-[#ffabf3] px-2 py-0.5 bg-[#8a2be2]/20 border border-[#8a2be2]/40 rounded">
              CONVERTIBLE A MP
            </span>
          </div>

          {/* Balance Amount & Dynamic Rate */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-audiowide text-white">
                {balances.magnoCoinsAvailable.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-[#ffabf3] font-mono">MC</span>
            </div>

            <div className="text-xs text-[#a0a5b5] font-mono">
              ≈ {mcEstimatedMp.toLocaleString()} MP ({currentFiat.symbol} {mcEstimatedFiat} {currentFiat.code})
            </div>
          </div>

          {/* Dynamic Rate Info */}
          <div className="pt-3 border-t border-[#1f2430] space-y-1.5 text-[11px] font-mono">
            <div className="flex justify-between text-[#a0a5b5]">
              <span>Tasa Dinámica Vigente:</span>
              <span className="text-[#00f0ff] font-bold">
                100 MC = {(100 * activeConversionRule.currentRateMpPerMc).toFixed(2)} MP
              </span>
            </div>
            <div className="flex justify-between text-[#a0a5b5]">
              <span>Total Histórico Convertido:</span>
              <span className="text-white font-bold">{balances.magnoCoinsTotalConverted.toLocaleString()} MC</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => {
              playSoundEffect('click');
              onNavigateTab('convert_mc');
            }}
            className="w-full py-2.5 px-4 text-xs font-bold uppercase text-white bg-gradient-to-r from-[#8a2be2] to-[#ff007f] hover:opacity-90 rounded-xl transition-all cursor-pointer shadow-[0_0_15px_rgba(138,43,226,0.3)] flex items-center justify-center gap-2"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Convertir MC → MP</span>
          </button>
        </div>

        {/* 3. MICROCOINS (µC) CARD */}
        <div className="relative p-5 bg-[#0a0d14] border-2 border-[#ff007f]/40 rounded-2xl shadow-[0_0_25px_rgba(255,0,127,0.15)] flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#ff007f]/20 border border-[#ff007f] flex items-center justify-center text-[#ff007f]">
                <Sparkles className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <span className="text-[10px] text-[#ff007f] font-mono uppercase font-bold tracking-wider block">
                  PROGRESIÓN INTERNA
                </span>
                <h3 className="text-base font-bold font-audiowide text-white">MicroCoins (µC)</h3>
              </div>
            </div>

            <span className="text-[9px] font-mono text-[#ff007f] px-2 py-0.5 bg-[#ff007f]/20 border border-[#ff007f]/40 rounded">
              NO CONVERTIBLE
            </span>
          </div>

          {/* Balance Amount */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-audiowide text-white">
                {balances.microCoinsAvailable.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-[#ff007f] font-mono">µC</span>
            </div>

            <div className="text-[11px] text-[#a0a5b5] font-mono">
              Unidades de actividad y mérito comunitario en MagnopVS
            </div>
          </div>

          {/* Rule 3 Strict Invariant Notice */}
          <div className="p-2.5 bg-[#ff007f]/10 border border-[#ff007f]/30 rounded-xl text-[10px] text-[#ffabf3] font-mono leading-relaxed">
            <div className="flex items-center gap-1 font-bold mb-0.5 text-[#ff007f]">
              <Lock className="w-3 h-3" />
              <span>REGLA ECONÓMICA 3:</span>
            </div>
            Los MicroCoins no tienen valor monetario, no se compran con dinero real y no son convertibles a MP, MC ni dinero fiat.
          </div>

          {/* Internal Usage Button */}
          <button
            onClick={() => {
              playSoundEffect('click');
              onNavigateTab('ledger');
            }}
            className="w-full py-2.5 px-4 text-xs font-bold uppercase text-[#a0a5b5] hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Ver Movimientos de Actividad</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Quick Navigation Action Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => {
            playSoundEffect('click');
            onNavigateTab('buy_mp');
          }}
          className="p-4 bg-[#0a0d14] border border-[#1f2430] hover:border-[#00f0ff]/50 rounded-2xl transition-all cursor-pointer text-left group"
        >
          <DollarSign className="w-5 h-5 text-[#00f0ff] mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="text-xs font-bold font-audiowide text-white">Comprar MP</h4>
          <span className="text-[10px] text-[#a0a5b5] block mt-0.5">Packs de valor con paridad 1:1</span>
        </button>

        <button
          onClick={() => {
            playSoundEffect('click');
            onNavigateTab('ledger');
          }}
          className="p-4 bg-[#0a0d14] border border-[#1f2430] hover:border-[#00f0ff]/50 rounded-2xl transition-all cursor-pointer text-left group"
        >
          <Clock className="w-5 h-5 text-[#7fffd4] mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="text-xs font-bold font-audiowide text-white">Libro Mayor</h4>
          <span className="text-[10px] text-[#a0a5b5] block mt-0.5">Historial y auditoría de doble entrada</span>
        </button>

        <button
          onClick={() => {
            playSoundEffect('click');
            onNavigateTab('security_kyc');
          }}
          className="p-4 bg-[#0a0d14] border border-[#1f2430] hover:border-[#00f0ff]/50 rounded-2xl transition-all cursor-pointer text-left group"
        >
          <Shield className="w-5 h-5 text-[#ffd700] mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="text-xs font-bold font-audiowide text-white">Seguridad & KYC</h4>
          <span className="text-[10px] text-[#a0a5b5] block mt-0.5">Verificación obligatoria para retiros</span>
        </button>

        <button
          onClick={() => {
            playSoundEffect('click');
            onNavigateTab('automated_tests');
          }}
          className="p-4 bg-[#0a0d14] border border-[#1f2430] hover:border-[#00f0ff]/50 rounded-2xl transition-all cursor-pointer text-left group"
        >
          <Award className="w-5 h-5 text-[#ffabf3] mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="text-xs font-bold font-audiowide text-white">Pruebas Regla 8</h4>
          <span className="text-[10px] text-[#a0a5b5] block mt-0.5">Verificación de 10 reglas obligatorias</span>
        </button>
      </div>

    </div>
  );
};
