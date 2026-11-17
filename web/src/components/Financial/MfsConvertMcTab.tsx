import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { usePlayer } from '../../context/PlayerContext';
import {
  TrendingUp,
  ArrowRightLeft,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Info,
} from 'lucide-react';

export const MfsConvertMcTab: React.FC = () => {
  const {
    balances,
    activeQuote,
    requestConversionQuote,
    executeQuoteConversion,
    cancelActiveQuote,
    activeConversionRule,
  } = useFinancial();
  const { playSoundEffect } = usePlayer();

  const [inputMcAmount, setInputMcAmount] = useState<number>(1000);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleRequestQuote = () => {
    playSoundEffect('click');
    setFeedback(null);
    const result = requestConversionQuote(inputMcAmount);
    if (!result.success) {
      setFeedback({ text: result.error || 'Error al cotizar conversión.', type: 'error' });
    }
  };

  const handleConfirmConversion = async () => {
    setIsExecuting(true);
    setFeedback(null);
    playSoundEffect('click');

    const result = await executeQuoteConversion();
    setIsExecuting(false);

    if (result.success) {
      setFeedback({
        text: `¡Conversión completada con éxito! Se han acreditado +${result.mpCredited} MagnoPoints a tu saldo.`,
        type: 'success',
      });
    } else {
      setFeedback({ text: result.error || 'Error en la conversión.', type: 'error' });
    }
  };

  const isQuoteExpired = activeQuote && activeQuote.secondsRemaining <= 0;

  return (
    <div className="space-y-6 font-orbitron animate-fade-in text-[#f8f9fa]">
      
      {/* Banner */}
      <div className="p-4 bg-[#0a0d14] border border-[#1f2430] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-[#ffabf3] font-mono uppercase font-bold tracking-widest block">
            DYNAMIC CONVERSION ENGINE // REGLA 2 V1.1
          </span>
          <h3 className="text-lg font-bold font-audiowide text-white">
            Conversión Dinámica de MagnoCoins (MC → MP)
          </h3>
          <p className="text-xs text-[#a0a5b5] mt-0.5">
            Convierte tus recompensas de juego en MagnoPoints. La cotización se congela durante 60 segundos para garantizar tu tasa.
          </p>
        </div>

        <div className="text-right font-mono text-xs">
          <span className="text-[#a0a5b5] block text-[10px]">TASA DINÁMICA VIGENTE</span>
          <span className="text-[#00f0ff] font-bold">100 MC = {(100 * activeConversionRule.currentRateMpPerMc).toFixed(2)} MP</span>
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

      {/* Main Conversion Flow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Card: Input Amount & Rules */}
        <div className="p-5 bg-[#0a0d14] border border-[#1f2430] rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1f2430] pb-2">
            <span className="text-xs font-bold font-audiowide text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#ffabf3]" />
              <span>Paso 1: Cantidad de MagnoCoins</span>
            </span>

            <span className="text-xs font-mono text-[#a0a5b5]">
              Disponible: <strong className="text-white">{balances.magnoCoinsAvailable.toLocaleString()} MC</strong>
            </span>
          </div>

          {/* Quick preset buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[500, 1000, 2500, 5000].map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  playSoundEffect('click');
                  setInputMcAmount(preset);
                }}
                className={`py-2 px-3 text-xs font-mono font-bold rounded-xl border transition-all cursor-pointer ${
                  inputMcAmount === preset
                    ? 'bg-[#8a2be2]/30 text-[#ffabf3] border-[#8a2be2]'
                    : 'bg-[#05060a] text-[#a0a5b5] border-[#1f2430] hover:text-white'
                }`}
              >
                {preset.toLocaleString()} MC
              </button>
            ))}
          </div>

          {/* Custom Input */}
          <div className="relative">
            <input
              type="number"
              min={activeConversionRule.minConvertibleMc}
              max={activeConversionRule.maxDailyMc}
              value={inputMcAmount}
              onChange={(e) => setInputMcAmount(Number(e.target.value))}
              className="w-full bg-[#05060a] border border-[#1f2430] focus:border-[#8a2be2] py-3 px-4 text-base font-mono font-bold text-white rounded-xl focus:outline-none"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#ffabf3] font-mono font-bold">
              MC
            </span>
          </div>

          {/* Limits & Rules */}
          <div className="p-3 bg-[#05060a] border border-[#1f2430] rounded-xl space-y-1 text-[11px] font-mono text-[#a0a5b5]">
            <div className="flex justify-between">
              <span>Mínimo por conversión:</span>
              <span className="text-white font-bold">{activeConversionRule.minConvertibleMc.toLocaleString()} MC</span>
            </div>
            <div className="flex justify-between">
              <span>Límite máximo diario:</span>
              <span className="text-white font-bold">{activeConversionRule.maxDailyMc.toLocaleString()} MC</span>
            </div>
            <div className="flex justify-between">
              <span>Comisión de red:</span>
              <span className="text-[#ffd700] font-bold">{(activeConversionRule.feePercentage * 100).toFixed(0)}%</span>
            </div>
          </div>

          <button
            onClick={handleRequestQuote}
            disabled={inputMcAmount < activeConversionRule.minConvertibleMc || inputMcAmount > balances.magnoCoinsAvailable}
            className="w-full py-3 px-4 text-xs font-bold uppercase text-white bg-gradient-to-r from-[#8a2be2] to-[#ff007f] hover:opacity-90 rounded-xl transition-all cursor-pointer shadow-[0_0_20px_rgba(138,43,226,0.3)] flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generar Cotización Temporal (60s)</span>
          </button>
        </div>

        {/* Right Card: Live Quote & Confirmation */}
        <div className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between space-y-4 ${
          activeQuote
            ? isQuoteExpired
              ? 'bg-[#0a0d14] border-[#ff007f]/50'
              : 'bg-[#0a0d14] border-[#7fffd4] shadow-[0_0_30px_rgba(127,255,212,0.2)]'
            : 'bg-[#0a0d14]/60 border-[#1f2430]'
        }`}>
          {activeQuote ? (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#1f2430] pb-2">
                  <span className="text-xs font-bold font-audiowide text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#7fffd4]" />
                    <span>Paso 2: Cotización Congelada</span>
                  </span>

                  {/* Countdown Timer Badge */}
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 ${
                    isQuoteExpired
                      ? 'bg-[#ff007f]/20 text-[#ff007f] border border-[#ff007f]/40'
                      : 'bg-[#7fffd4]/20 text-[#7fffd4] border border-[#7fffd4]/40 animate-pulse'
                  }`}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{isQuoteExpired ? 'CADUCADA' : `${activeQuote.secondsRemaining}s vigentes`}</span>
                  </div>
                </div>

                {/* Quote Breakdown */}
                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between text-[#a0a5b5]">
                    <span>MagnoCoins a Debitar:</span>
                    <span className="text-white font-bold">{activeQuote.mcAmount.toLocaleString()} MC</span>
                  </div>
                  <div className="flex justify-between text-[#a0a5b5]">
                    <span>Tasa Garantizada:</span>
                    <span className="text-[#00f0ff] font-bold">
                      {activeQuote.rateAppliedMpPerMc} MP por MC
                    </span>
                  </div>
                  <div className="flex justify-between text-[#a0a5b5]">
                    <span>MagnoPoints Brutos:</span>
                    <span className="text-white">{activeQuote.grossMpAmount} MP</span>
                  </div>
                  <div className="flex justify-between text-[#a0a5b5]">
                    <span>Comisión del Sistema (2%):</span>
                    <span className="text-[#ffd700]">-{activeQuote.feeMp} MP</span>
                  </div>
                </div>

                {/* Net MP to Receive Box */}
                <div className="p-4 bg-[#7fffd4]/10 border border-[#7fffd4] rounded-xl text-center space-y-1">
                  <span className="text-[10px] text-[#7fffd4] uppercase font-bold tracking-wider block">
                    MAGNOPOINTS NETOS A ACREDITAR
                  </span>
                  <div className="text-3xl font-black font-audiowide text-white">
                    +{activeQuote.netMpAmount.toLocaleString()} <span className="text-sm text-[#7fffd4]">MP</span>
                  </div>
                  <span className="text-[10px] text-[#a0a5b5] font-mono block">
                    Valor de Referencia: ${activeQuote.fiatValueUsd.toFixed(2)} USD (1 MP = 1 USD)
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={cancelActiveQuote}
                  className="py-2.5 px-4 text-xs font-bold uppercase text-[#a0a5b5] hover:text-white bg-white/5 rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleConfirmConversion}
                  disabled={isExecuting || isQuoteExpired}
                  className="flex-1 py-3 px-4 text-xs font-bold uppercase text-[#05060a] bg-gradient-to-r from-[#7fffd4] to-[#00f0ff] hover:opacity-90 rounded-xl transition-all cursor-pointer shadow-[0_0_20px_rgba(127,255,212,0.4)] flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>{isExecuting ? 'Procesando en Ledger...' : isQuoteExpired ? 'Cotización Expirada' : 'Confirmar Conversión'}</span>
                </button>
              </div>
            </>
          ) : (
            <div className="p-12 text-center space-y-3 my-auto">
              <Clock className="w-10 h-10 text-[#a0a5b5] mx-auto opacity-40 animate-pulse" />
              <h4 className="text-sm font-bold font-audiowide text-white">Sin Cotización Activa</h4>
              <p className="text-xs text-[#a0a5b5] font-mono max-w-xs mx-auto">
                Introduce la cantidad de MagnoCoins en el panel izquierdo y pulsa en "Generar Cotización" para congelar tu tasa durante 60 segundos.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
