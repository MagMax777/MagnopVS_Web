import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { useFinancial } from '../../context/FinancialContext';
import { MfsActiveTab } from '../../types/financial';
import { MfsOverviewTab } from '../Financial/MfsOverviewTab';
import { MfsTopUpTab } from '../Financial/MfsTopUpTab';
import { MfsBuyMpTab } from '../Financial/MfsBuyMpTab';
import { MfsConvertMcTab } from '../Financial/MfsConvertMcTab';
import { MfsWithdrawTab } from '../Financial/MfsWithdrawTab';
import { MfsLedgerTab } from '../Financial/MfsLedgerTab';
import { MfsSecurityKycTab } from '../Financial/MfsSecurityKycTab';
import { MfsAdminControlCenter } from '../Financial/MfsAdminControlCenter';
import { MfsAutomatedTestsTab } from '../Financial/MfsAutomatedTestsTab';
import {
  Wallet,
  Coins,
  ArrowRightLeft,
  ArrowDownToLine,
  ArrowUpFromLine,
  BookOpen,
  ShieldCheck,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Globe,
  Sparkles,
} from 'lucide-react';

export const WalletView: React.FC = () => {
  const { playSoundEffect } = usePlayer();
  const {
    activeCurrency,
    setActiveCurrency,
    supportedCurrencies,
    refreshBalances,
    balances,
    kycProfile,
  } = useFinancial();

  const [activeTab, setActiveTab] = useState<MfsActiveTab>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleTabChange = (tab: MfsActiveTab) => {
    playSoundEffect('click');
    setActiveTab(tab);
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    playSoundEffect('click');
    refreshBalances();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const currentCurrency =
    supportedCurrencies.find((c) => c.code === activeCurrency) || supportedCurrencies[0];

  return (
    <div className="space-y-6">
      {/* Top Multi-Currency Bar & Master Navigation */}
      <div className="bg-[#0b0e17]/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-md">
        {/* System & Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-amber-500/20 border border-cyan-500/40 text-cyan-400">
            <Wallet className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white font-['Audiowide']">
                MagnopVS FINANCIAL SYSTEM
              </span>
              <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                MFS v1.1
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Paridad 1 MP = 1.00 USD • Motor Dinámico MC • MicroCoins Intransferibles
            </p>
          </div>
        </div>

        {/* Global Controls: Fiat Selector & Refresh */}
        <div className="flex items-center gap-3">
          {/* Active Fiat Currency Picker */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-slate-800">
            <Globe className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">Moneda Local:</span>
            <select
              value={activeCurrency}
              onChange={(e) => setActiveCurrency(e.target.value as any)}
              className="bg-transparent text-xs font-bold text-cyan-400 font-mono focus:outline-none cursor-pointer"
            >
              {supportedCurrencies.map((c) => (
                <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                  {c.flag} {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* KYC Status Badge */}
          <button
            onClick={() => handleTabChange('security_kyc')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
              kycProfile.status === 'VERIFIED'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                : kycProfile.status === 'PENDING'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>KYC {kycProfile.status}</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={handleManualRefresh}
            className={`p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all ${
              isRefreshing ? 'animate-spin text-cyan-400' : ''
            }`}
            title="Sincronizar Libro Mayor"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Submenu Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
        {[
          { id: 'overview', label: 'Visión General', icon: Wallet },
          { id: 'top_up', label: 'Recargar Cuenta', icon: ArrowDownToLine },
          { id: 'buy_mp', label: 'Comprar MP', icon: Coins },
          { id: 'convert_mc', label: 'Convertir MC → MP', icon: ArrowRightLeft },
          { id: 'withdraw', label: 'Retiros', icon: ArrowUpFromLine },
          { id: 'ledger', label: 'Libro Mayor', icon: BookOpen },
          { id: 'security_kyc', label: 'Seguridad & KYC', icon: ShieldCheck },
          { id: 'admin_control', label: 'Control Center', icon: Sliders },
          { id: 'automated_tests', label: 'Pruebas Regla 8', icon: CheckCircle2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as MfsActiveTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Tab Render */}
      <div className="animate-fade-in">
        {activeTab === 'overview' && (
          <MfsOverviewTab
            onNavigateTab={(tab) => {
              playSoundEffect('click');
              setActiveTab(tab);
            }}
          />
        )}
        {activeTab === 'top_up' && <MfsTopUpTab />}
        {activeTab === 'buy_mp' && <MfsBuyMpTab />}
        {activeTab === 'convert_mc' && <MfsConvertMcTab />}
        {activeTab === 'withdraw' && <MfsWithdrawTab />}
        {activeTab === 'ledger' && <MfsLedgerTab />}
        {activeTab === 'security_kyc' && <MfsSecurityKycTab />}
        {activeTab === 'admin_control' && <MfsAdminControlCenter />}
        {activeTab === 'automated_tests' && <MfsAutomatedTestsTab />}
      </div>
    </div>
  );
};
