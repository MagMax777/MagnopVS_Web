import React, { useState, useMemo } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { usePlayer } from '../../context/PlayerContext';
import { MagnoCurrency, FinancialLedgerEntry } from '../../types/financial';
import {
  FileCheck2,
  Clock,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Coins,
  Sparkles,
  Lock,
  Copy,
  ExternalLink,
} from 'lucide-react';

export const MfsLedgerTab: React.FC = () => {
  const { ledgerEntries } = useFinancial();
  const { transactions, playSoundEffect } = usePlayer();

  const [selectedCurrency, setSelectedCurrency] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectingTx, setInspectingTx] = useState<any | null>(null);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (selectedCurrency !== 'ALL' && tx.currency !== selectedCurrency) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesDesc = tx.description.toLowerCase().includes(query);
        const matchesSource = tx.source.toLowerCase().includes(query);
        const matchesId = tx.id.toLowerCase().includes(query);
        const matchesIdemp = (tx.idempotencyKey || '').toLowerCase().includes(query);
        if (!matchesDesc && !matchesSource && !matchesId && !matchesIdemp) {
          return false;
        }
      }
      return true;
    });
  }, [transactions, selectedCurrency, searchQuery]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    playSoundEffect('click');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-6 font-orbitron animate-fade-in text-[#f8f9fa]">
      
      {/* Header Info */}
      <div className="p-4 bg-[#0a0d14] border border-[#1f2430] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-[#00f0ff] font-mono uppercase font-bold tracking-widest block">
            IMMUTABLE ACCOUNTING // DOBLE ENTRADA & AUDITORÍA
          </span>
          <h3 className="text-lg font-bold font-audiowide text-white">
            Libro Mayor Financiero & Trazabilidad
          </h3>
          <p className="text-xs text-[#a0a5b5] mt-0.5">
            Registro inmutable de movimientos con balance debit/credit, balance before/after y hashes de auditoría.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 text-xs font-mono font-bold">
            {transactions.length} Asientos Registrados
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full flex items-center bg-[#0a0d14] border border-[#1f2430] focus-within:border-[#00f0ff] px-4 py-2.5 rounded-xl transition-all">
          <Search className="w-4 h-4 text-[#a0a5b5] mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por descripción, fuente, ID o clave de idempotencia..."
            className="w-full bg-transparent text-xs text-white placeholder-[#a0a5b5] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'MP', 'MC', 'MICROCOIN'].map((curr) => (
            <button
              key={curr}
              onClick={() => {
                playSoundEffect('click');
                setSelectedCurrency(curr);
              }}
              className={`py-2 px-3 text-xs font-mono font-bold rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                selectedCurrency === curr
                  ? 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]'
                  : 'bg-[#0a0d14] text-[#a0a5b5] border-[#1f2430] hover:text-white'
              }`}
            >
              {curr === 'ALL' ? 'TODAS' : curr}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table / List */}
      <div className="p-4 bg-[#0a0d14] border border-[#1f2430] rounded-2xl space-y-3">
        {filteredTransactions.length > 0 ? (
          <div className="space-y-2">
            {filteredTransactions.map((tx) => {
              const isPositive = tx.amount > 0 && tx.transactionType !== 'PURCHASE';

              return (
                <div
                  key={tx.id}
                  onClick={() => {
                    playSoundEffect('click');
                    setInspectingTx(tx);
                  }}
                  className="p-3.5 bg-[#05060a] border border-[#1f2430] hover:border-[#00f0ff]/50 rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border ${
                      tx.currency === 'MP'
                        ? 'bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/30'
                        : tx.currency === 'MC'
                        ? 'bg-[#8a2be2]/10 text-[#ffabf3] border-[#8a2be2]/30'
                        : 'bg-[#ff007f]/10 text-[#ff007f] border-[#ff007f]/30'
                    }`}>
                      {tx.currency === 'MP' ? (
                        <Coins className="w-4 h-4" />
                      ) : tx.currency === 'MC' ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-white group-hover:text-[#00f0ff] transition-colors">
                          {tx.description}
                        </strong>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-[#a0a5b5]">
                          {tx.transactionType}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#a0a5b5] block mt-0.5">
                        {new Date(tx.createdAt).toLocaleString()} • Fuente: {tx.source} • ID: #{tx.id.substring(0, 10)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right self-end sm:self-center shrink-0">
                    <div className={`text-sm font-bold ${
                      isPositive ? 'text-[#7fffd4]' : 'text-[#ff007f]'
                    }`}>
                      {isPositive ? '+' : '-'}{Math.abs(tx.amount).toLocaleString()} {tx.currency}
                    </div>
                    <span className="text-[10px] text-[#a0a5b5]">
                      Saldo: {tx.balanceAfter?.toLocaleString() || tx.amount} {tx.currency}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-[#a0a5b5] font-mono">
            No se encontraron movimientos registrados con los filtros seleccionados.
          </div>
        )}
      </div>

      {/* Transaction Inspection Modal */}
      {inspectingTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-orbitron">
          <div className="relative w-full max-w-lg bg-[#0a0d14] border-2 border-[#00f0ff] p-6 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.25)] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f2430] pb-3">
              <div>
                <span className="text-[10px] text-[#00f0ff] font-mono uppercase font-bold">
                  COMPROBANTE DIGITAL INMUTABLE
                </span>
                <h3 className="text-base font-bold font-audiowide text-white">
                  Asiento #{inspectingTx.id.substring(0, 16)}
                </h3>
              </div>

              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[#7fffd4]/15 border border-[#7fffd4] text-[#7fffd4]">
                {inspectingTx.status || 'COMPLETED'}
              </span>
            </div>

            <div className="space-y-2.5 text-xs font-mono bg-[#05060a] p-4 rounded-xl border border-[#1f2430]">
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Tipo de Operación:</span>
                <span className="text-white font-bold">{inspectingTx.transactionType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Moneda:</span>
                <span className="text-[#00f0ff] font-bold">{inspectingTx.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Importe del Movimiento:</span>
                <span className="text-white font-bold">{inspectingTx.amount.toLocaleString()} {inspectingTx.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Saldo Anterior / Posterior:</span>
                <span className="text-white">{inspectingTx.balanceBefore || 0} → {inspectingTx.balanceAfter || inspectingTx.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Fecha y Hora:</span>
                <span className="text-white">{new Date(inspectingTx.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Fuente Emisora:</span>
                <span className="text-white">{inspectingTx.source}</span>
              </div>
              {inspectingTx.idempotencyKey && (
                <div className="pt-2 border-t border-[#1f2430] flex items-center justify-between">
                  <span className="text-[#a0a5b5] text-[10px]">Clave de Idempotencia:</span>
                  <button
                    onClick={() => handleCopy(inspectingTx.idempotencyKey)}
                    className="text-[10px] text-[#7fffd4] flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>{inspectingTx.idempotencyKey.substring(0, 18)}...</span>
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {copiedKey && (
              <div className="text-center text-[10px] text-[#7fffd4] font-mono">
                ¡Clave de idempotencia copiada al portapapeles!
              </div>
            )}

            <button
              onClick={() => setInspectingTx(null)}
              className="w-full py-2.5 px-4 text-xs font-bold uppercase text-[#05060a] bg-[#00f0ff] hover:bg-[#7fffd4] rounded-xl transition-all cursor-pointer"
            >
              Cerrar Asiento
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
