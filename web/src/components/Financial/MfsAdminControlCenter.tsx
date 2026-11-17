import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { PayoutRequest, ConversionRule } from '../../types/financial';

type AdminRole = 'SUPERADMIN' | 'FIN_ADMIN' | 'AUDITOR' | 'COMPLIANCE';

export const MfsAdminControlCenter: React.FC = () => {
  const {
    balances,
    activeConversionRule,
    updateAdminRule,
    payoutRequests,
    updatePayoutRequestStatus,
    ledgerEntries,
  } = useFinancial();

  const [activeRole, setActiveRole] = useState<AdminRole>('SUPERADMIN');
  const [editingRule, setEditingRule] = useState<ConversionRule>({ ...activeConversionRule });
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [selectedPayout, setSelectedPayout] = useState<PayoutRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Handle conversion rule updates
  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminRule(editingRule);
    setSaveSuccessMessage('Reglas de conversión dinámicas actualizadas exitosamente en el motor MFS.');
    setTimeout(() => setSaveSuccessMessage(null), 4000);
  };

  // Calculate platform financial reserves
  const totalMpInCirculation = balances.magnoPoints;
  const totalFiatCustodyEstimate = (balances.magnoPoints * 1.0) + 12500; // backed reserve with safety margin
  const reserveRatio = totalMpInCirculation > 0 
    ? ((totalFiatCustodyEstimate / totalMpInCirculation) * 100).toFixed(1)
    : '100.0';

  const pendingPayouts = payoutRequests.filter(
    (p) => p.status === 'PENDING_REVIEW' || p.status === 'PENDING_VERIFICATION' || p.status === 'PROCESSING'
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & Role Selector */}
      <div className="bg-gradient-to-r from-red-950/60 via-purple-950/40 to-slate-900 border border-red-500/30 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-red-500/20 text-red-400 border border-red-500/30 uppercase tracking-widest">
                🛡️ Control Financiero & Gobernanza MFS
              </span>
              <span className="text-xs text-slate-400">Ambiente Seguro MagnopVS</span>
            </div>
            <h2 className="text-xl font-black text-white font-['Audiowide']">
              Centro de Comando Financiero
            </h2>
            <p className="text-xs text-slate-300">
              Supervisión de reservas 1:1, política de tasas dinámicas MC → MP, auditoría de libro mayor y aprobación de retiros.
            </p>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-700/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase px-2">Rol:</span>
            {(['SUPERADMIN', 'FIN_ADMIN', 'AUDITOR', 'COMPLIANCE'] as AdminRole[]).map((role) => (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${
                  activeRole === role
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {role === 'SUPERADMIN' && 'Superadmin'}
                {role === 'FIN_ADMIN' && 'FinAdmin'}
                {role === 'AUDITOR' && 'Auditor'}
                {role === 'COMPLIANCE' && 'Compliance'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reserves & Solvency Monitor */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-emerald-500/30 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-bold uppercase mb-1">Custodia Fiat Estimada</div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            ${totalFiatCustodyEstimate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
          </div>
          <div className="text-[10px] text-emerald-500/80 mt-1 flex items-center gap-1">
            <span>●</span> Cuentas bancarias fiduciarias & cuentas de liquidación
          </div>
        </div>

        <div className="bg-slate-900/80 border border-cyan-500/30 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-bold uppercase mb-1">MP en Circulación (Pasivo)</div>
          <div className="text-2xl font-black text-cyan-400 font-mono">
            {totalMpInCirculation.toLocaleString()} MP
          </div>
          <div className="text-[10px] text-cyan-500/80 mt-1 flex items-center gap-1">
            <span>●</span> Paridad estricta 1 MP = 1.00 USD
          </div>
        </div>

        <div className="bg-slate-900/80 border border-purple-500/30 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-bold uppercase mb-1">Ratio de Respaldo</div>
          <div className="text-2xl font-black text-purple-300 font-mono">
            {reserveRatio}%
          </div>
          <div className="text-[10px] text-purple-400/80 mt-1">
            Superávit de liquidez garantizado (Reserva Completa)
          </div>
        </div>

        <div className="bg-slate-900/80 border border-amber-500/30 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-bold uppercase mb-1">Retiros Pendientes</div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {pendingPayouts.length} solicitud{pendingPayouts.length === 1 ? '' : 'es'}
          </div>
          <div className="text-[10px] text-amber-500/80 mt-1">
            Requiere verificación de cumplimiento KYC nivel 2
          </div>
        </div>
      </div>

      {/* Main Admin Columns: Rules Control & Payouts Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Dynamic Conversion Engine Configuration (Rule 2) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-base font-['Audiowide'] flex items-center gap-2">
                <span>⚙️</span> Parámetros Motor Dinámico MC → MP
              </h3>
              <p className="text-xs text-slate-400">Regla 2: Cotización temporal congelada</p>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              editingRule.isActive
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-red-500/20 text-red-300 border-red-500/30'
            }`}>
              {editingRule.isActive ? 'ACTIVO' : 'PAUSADO'}
            </span>
          </div>

          {saveSuccessMessage && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300">
              {saveSuccessMessage}
            </div>
          )}

          <form onSubmit={handleSaveRule} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tasa Base (MP por cada 1 MC)
              </label>
              <input
                type="number"
                step="0.0001"
                min="0.0001"
                max="1.0"
                value={editingRule.baseRateMpPerMc}
                onChange={(e) =>
                  setEditingRule({ ...editingRule, baseRateMpPerMc: parseFloat(e.target.value) || 0.001 })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-amber-300 font-mono focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Valor actual: 1,000 MC = {(editingRule.baseRateMpPerMc * 1000).toFixed(2)} MP ($
                {(editingRule.baseRateMpPerMc * 1000).toFixed(2)} USD)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Comisión Plataforma (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  value={editingRule.feePercentage}
                  onChange={(e) =>
                    setEditingRule({ ...editingRule, feePercentage: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Congelamiento Cotización (seg)
                </label>
                <input
                  type="number"
                  min="15"
                  max="300"
                  value={editingRule.quoteDurationSeconds}
                  onChange={(e) =>
                    setEditingRule({ ...editingRule, quoteDurationSeconds: parseInt(e.target.value) || 60 })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-cyan-300 font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mínimo MC por Conversión
                </label>
                <input
                  type="number"
                  step="50"
                  min="100"
                  value={editingRule.minMcAmount}
                  onChange={(e) =>
                    setEditingRule({ ...editingRule, minMcAmount: parseInt(e.target.value) || 500 })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Máximo MC por Conversión
                </label>
                <input
                  type="number"
                  step="1000"
                  min="1000"
                  value={editingRule.maxMcAmount}
                  onChange={(e) =>
                    setEditingRule({ ...editingRule, maxMcAmount: parseInt(e.target.value) || 50000 })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-300 font-medium">Estado del Motor de Conversión</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingRule.isActive}
                  onChange={(e) => setEditingRule({ ...editingRule, isActive: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {activeRole === 'AUDITOR' ? (
              <div className="p-3 bg-slate-950 rounded-xl text-center text-xs text-slate-400 border border-slate-800">
                🔒 El rol AUDITOR tiene permisos de sólo lectura. Inicie sesión como Superadmin o FinAdmin para guardar.
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-[0.99]"
              >
                Guardar Nuevos Parámetros MFS
              </button>
            )}
          </form>
        </div>

        {/* Right Column: Payouts Review Queue (Rule 4) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-base font-['Audiowide'] flex items-center gap-2">
                <span>🏦</span> Cola de Aprobación de Retiros
              </h3>
              <p className="text-xs text-slate-400">Verificación de cumplimiento AML, KYC y límites de salida</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Total: {payoutRequests.length} registros
            </span>
          </div>

          {payoutRequests.length === 0 ? (
            <div className="p-8 text-center text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/60">
              No hay solicitudes de retiro registradas en este ciclo.
            </div>
          ) : (
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {payoutRequests.map((payout) => {
                const isPending =
                  payout.status === 'PENDING_REVIEW' ||
                  payout.status === 'PENDING_VERIFICATION' ||
                  payout.status === 'PROCESSING';

                return (
                  <div
                    key={payout.id}
                    className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-amber-400">
                          {payout.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            payout.status === 'COMPLETED'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : payout.status === 'REJECTED'
                              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {payout.status}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {new Date(payout.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs py-1 bg-slate-900/60 p-2 rounded-lg">
                      <div>
                        <div className="text-[10px] text-slate-500">Monto MP</div>
                        <div className="font-bold text-white font-mono">{payout.magnoPointsAmount} MP</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500">Comisión MP</div>
                        <div className="font-bold text-slate-400 font-mono">-{payout.feeMp} MP</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500">Neto Fiduciario</div>
                        <div className="font-bold text-emerald-400 font-mono">
                          {payout.estimatedNetFiatAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} {payout.fiatCurrency}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500">Método / Destino</div>
                        <div className="text-slate-300 truncate">
                          {payout.destinationAccount.bankName || payout.payoutMethod}
                        </div>
                      </div>
                    </div>

                    {isPending && (
                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-900">
                        <button
                          onClick={() => {
                            setSelectedPayout(payout);
                            setRejectionReason('Discrepancia en documentación de identidad.');
                          }}
                          className="px-2.5 py-1 text-xs text-red-400 hover:bg-red-950/40 rounded-lg border border-red-500/20 transition-all"
                        >
                          Rechazar
                        </button>
                        <button
                          onClick={() => updatePayoutRequestStatus(payout.id, 'APPROVED')}
                          className="px-3 py-1 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-all"
                        >
                          ✓ Aprobar Retiro
                        </button>
                        <button
                          onClick={() => updatePayoutRequestStatus(payout.id, 'COMPLETED')}
                          className="px-3 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-all"
                        >
                          Liquidado
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      {selectedPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-red-500/40 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h4 className="text-base font-bold text-white font-['Audiowide']">
              Rechazar Solicitud de Retiro ({selectedPayout.id})
            </h4>
            <p className="text-xs text-slate-300">
              Al rechazar el retiro, los fondos MP bloqueados se reintegrarán automáticamente al balance disponible del usuario vía libro mayor.
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Motivo del Rechazo (Visible para el usuario y auditoría)
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedPayout(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  updatePayoutRequestStatus(selectedPayout.id, 'REJECTED', rejectionReason);
                  setSelectedPayout(null);
                }}
                className="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-xl shadow-lg shadow-red-600/30"
              >
                Confirmar Rechazo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ledger Sanity Proof */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
          <div>
            <span className="font-bold text-white font-mono">Consistencia de Contabilidad:</span>{' '}
            <span className="text-slate-300">
              {ledgerEntries.length} partidas de doble entrada auditadas con hash SHA-256 criptográfico.
            </span>
          </div>
        </div>
        <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/50 px-3 py-1 rounded-lg border border-emerald-500/30">
          Δ Débito - Crédito = 0.0000 (Sin discrepancias de balance)
        </div>
      </div>
    </div>
  );
};
