import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePlayer } from './PlayerContext';
import {
  MfsBalances,
  FiatCurrencyCode,
  FiatCurrency,
  ConversionQuote,
  ConversionRule,
  PaymentProviderInfo,
  TopUpIntentRequest,
  TopUpIntentResult,
  PayoutRequest,
  PaymentMethodType,
  KycProfile,
  KycStatus,
  AutomatedTestResult,
  FinancialLedgerEntry,
  MAGNOPOINTS_USD_PARITY,
} from '../types/financial';
import {
  SUPPORTED_FIAT_CURRENCIES,
  INITIAL_CONVERSION_RULE,
  INITIAL_PAYMENT_PROVIDERS,
} from '../data/financialData';
import { FinancialSystemService } from '../services/FinancialSystemService';

interface FinancialContextType {
  // Currencies & Preferences
  activeCurrency: FiatCurrencyCode;
  setActiveCurrency: (code: FiatCurrencyCode) => void;
  supportedCurrencies: FiatCurrency[];
  
  // Balances Breakdown
  balances: MfsBalances;
  refreshBalances: () => void;
  
  // Dynamic Conversion (MC -> MP)
  activeQuote: ConversionQuote | null;
  requestConversionQuote: (mcAmount: number) => { success: boolean; error?: string; quote?: ConversionQuote };
  executeQuoteConversion: () => Promise<{ success: boolean; error?: string; mpCredited?: number }>;
  cancelActiveQuote: () => void;
  activeConversionRule: ConversionRule;
  
  // Top-Up & Buy MP (Fiat -> MP)
  paymentProviders: PaymentProviderInfo[];
  executeTopUp: (request: TopUpIntentRequest) => Promise<{ success: boolean; error?: string; result?: TopUpIntentResult }>;
  
  // Withdrawal (MP -> Fiat)
  payoutRequests: PayoutRequest[];
  requestPayout: (
    mpAmount: number,
    fiatCurrency: FiatCurrencyCode,
    payoutMethod: PaymentMethodType,
    destination: any
  ) => Promise<{ success: boolean; error?: string; payoutRequest?: PayoutRequest }>;
  
  // KYC & Identity
  kycProfile: KycProfile;
  submitKycApplication: (data: Partial<KycProfile>) => void;
  
  // Admin & Auditing
  ledgerEntries: FinancialLedgerEntry[];
  updateAdminRule: (patch: Partial<ConversionRule>) => void;
  updatePayoutRequestStatus: (payoutId: string, status: PayoutRequest['status'], reason?: string) => void;
  
  // Automated Test Suite (Rule 8)
  runAutomatedTests: () => AutomatedTestResult[];
  testResults: AutomatedTestResult[];
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { player, addXpAndMp, spendCurrency, awardReward, playSoundEffect } = usePlayer();

  // 1. Regional & Fiat Currency State
  const [activeCurrency, setActiveCurrencyState] = useState<FiatCurrencyCode>(() => {
    try {
      const saved = localStorage.getItem('magnopvs_preferred_fiat');
      return (saved as FiatCurrencyCode) || 'USD';
    } catch {
      return 'USD';
    }
  });

  const setActiveCurrency = (code: FiatCurrencyCode) => {
    playSoundEffect('click');
    setActiveCurrencyState(code);
    localStorage.setItem('magnopvs_preferred_fiat', code);
  };

  // 2. Balances Breakdown
  const [balances, setBalances] = useState<MfsBalances>(() => {
    return {
      magnoPointsAvailable: player.magnoPoints || 5500,
      magnoPointsPending: player.magnoPointsPending || 0,
      magnoPointsLocked: player.magnoPointsLocked || 0,
      magnoPointsWithdrawing: player.magnoPointsWithdrawing || 0,
      magnoPointsTotal: player.magnoPoints || 5500,
      magnoCoinsAvailable: player.magnoCoins || 2500,
      magnoCoinsTotalEarned: player.totalEarnedMc || 4500,
      magnoCoinsTotalConverted: player.totalConvertedMc || 2000,
      microCoinsAvailable: player.microCoins || 2,
      microCoinsTotalEarned: player.totalEarnedMicroCoins || 2,
      microCoinsTotalSpent: player.totalSpentMicroCoins || 0,
      totalFiatDepositedUsd: 55.0,
      totalFiatWithdrawnUsd: 0.0,
    };
  });

  // Keep balances synchronized when player profile changes
  useEffect(() => {
    setBalances((prev) => ({
      ...prev,
      magnoPointsAvailable: player.magnoPoints,
      magnoPointsTotal: player.magnoPoints + (player.magnoPointsPending || 0) + (player.magnoPointsLocked || 0),
      magnoCoinsAvailable: player.magnoCoins ?? prev.magnoCoinsAvailable,
      microCoinsAvailable: player.microCoins ?? prev.microCoinsAvailable,
    }));
  }, [player.magnoPoints, player.magnoCoins, player.microCoins, player.magnoPointsPending, player.magnoPointsLocked]);

  const refreshBalances = () => {
    playSoundEffect('click');
    // sync with storage / backend
  };

  // 3. Dynamic Conversion Engine State
  const [activeQuote, setActiveQuote] = useState<ConversionQuote | null>(null);
  const [activeConversionRule, setActiveConversionRule] = useState<ConversionRule>(() => {
    return FinancialSystemService.getActiveConversionRule();
  });

  // Quote countdown timer
  useEffect(() => {
    if (!activeQuote) return;

    const timer = setInterval(() => {
      setActiveQuote((prev) => {
        if (!prev) return null;
        const remaining = prev.secondsRemaining - 1;
        if (remaining <= 0) {
          clearInterval(timer);
          return { ...prev, secondsRemaining: 0, status: 'EXPIRED' };
        }
        return { ...prev, secondsRemaining: remaining };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeQuote?.quoteId]);

  const requestConversionQuote = (mcAmount: number) => {
    playSoundEffect('click');
    const result = FinancialSystemService.generateConversionQuote(player.id, mcAmount);
    if (result.success && result.quote) {
      setActiveQuote(result.quote);
      return { success: true, quote: result.quote };
    }
    return { success: false, error: result.error };
  };

  const cancelActiveQuote = () => {
    playSoundEffect('click');
    setActiveQuote(null);
  };

  const executeQuoteConversion = async (): Promise<{ success: boolean; error?: string; mpCredited?: number }> => {
    if (!activeQuote) {
      return { success: false, error: 'No hay ninguna cotización activa para ejecutar.' };
    }

    const idempotencyKey = `idemp_conv_${activeQuote.quoteId}_${Date.now()}`;
    const result = FinancialSystemService.executeDynamicConversion(
      player.id,
      activeQuote.quoteId,
      balances.magnoCoinsAvailable,
      idempotencyKey
    );

    if (result.success && result.mpCredited && result.mcDeducted) {
      playSoundEffect('portal');
      
      // Update PlayerContext balances
      await awardReward(
        'MP',
        result.mpCredited,
        'DYNAMIC_CONVERSION_ENGINE',
        `Conversión de ${result.mcDeducted.toLocaleString()} MC a ${result.mpCredited} MP`,
        idempotencyKey
      );

      setBalances((prev) => ({
        ...prev,
        magnoCoinsAvailable: Math.max(0, prev.magnoCoinsAvailable - result.mcDeducted!),
        magnoCoinsTotalConverted: prev.magnoCoinsTotalConverted + result.mcDeducted!,
        magnoPointsAvailable: prev.magnoPointsAvailable + result.mpCredited!,
        magnoPointsTotal: prev.magnoPointsTotal + result.mpCredited!,
      }));

      setActiveQuote(null);
      return { success: true, mpCredited: result.mpCredited };
    }

    return { success: false, error: result.error || 'Error en la conversión dinámica.' };
  };

  // 4. Global Top-Up Engine
  const executeTopUp = async (request: TopUpIntentRequest): Promise<{ success: boolean; error?: string; result?: TopUpIntentResult }> => {
    playSoundEffect('click');
    const mpCalc = FinancialSystemService.calculateMpFromFiat(
      request.fiatAmount,
      request.fiatCurrency,
      request.providerId
    );

    if (mpCalc.magnoPointsToCredit <= 0) {
      return { success: false, error: 'El importe a recargar debe generar al menos 1 MagnoPoint neto.' };
    }

    const idempotencyKey = `topup_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const intentResult: TopUpIntentResult = {
      intentId: `intent_${Date.now()}`,
      fiatCurrency: request.fiatCurrency,
      fiatAmount: request.fiatAmount,
      fiatFee: mpCalc.totalFiatFee,
      totalFiatToPay: request.fiatAmount,
      magnoPointsToCredit: mpCalc.magnoPointsToCredit,
      exchangeRateUsed: mpCalc.exchangeRate,
      status: 'SUCCEEDED',
      providerReference: `PROV-REF-${Math.floor(100000 + Math.random() * 900000)}`,
      idempotencyKey,
      createdAt: new Date().toISOString(),
    };

    // Credit MagnoPoints (1 MP = 1 USD net)
    await awardReward(
      'MP',
      mpCalc.magnoPointsToCredit,
      'GLOBAL_TOP_UP',
      `Recarga internacional de ${request.fiatAmount} ${request.fiatCurrency} (+${mpCalc.magnoPointsToCredit} MP)`,
      idempotencyKey
    );

    setBalances((prev) => ({
      ...prev,
      magnoPointsAvailable: prev.magnoPointsAvailable + mpCalc.magnoPointsToCredit,
      magnoPointsTotal: prev.magnoPointsTotal + mpCalc.magnoPointsToCredit,
      totalFiatDepositedUsd: prev.totalFiatDepositedUsd + mpCalc.netUsd,
    }));

    playSoundEffect('buy');
    return { success: true, result: intentResult };
  };

  // 5. Global Withdrawal Engine
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>(() => {
    try {
      const saved = localStorage.getItem('magnopvs_payout_requests');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const requestPayout = async (
    mpAmount: number,
    fiatCurrency: FiatCurrencyCode,
    payoutMethod: PaymentMethodType,
    destination: any
  ): Promise<{ success: boolean; error?: string; payoutRequest?: PayoutRequest }> => {
    playSoundEffect('click');
    const idempotencyKey = `payout_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const result = FinancialSystemService.requestWithdrawal(
      player.id,
      mpAmount,
      fiatCurrency,
      payoutMethod,
      destination,
      balances.magnoPointsAvailable,
      kycProfile.status,
      idempotencyKey
    );

    if (result.success && result.payoutRequest) {
      playSoundEffect('quest');
      // Lock balance for withdrawal
      const spendResult = await spendCurrency(
        'MP',
        mpAmount,
        'GLOBAL_WITHDRAWAL',
        `Solicitud de retiro de ${mpAmount} MP a ${fiatCurrency}`,
        result.payoutRequest.id
      );

      if (!spendResult.success) {
        return { success: false, error: spendResult.error };
      }

      setBalances((prev) => ({
        ...prev,
        magnoPointsAvailable: Math.max(0, prev.magnoPointsAvailable - mpAmount),
        magnoPointsWithdrawing: prev.magnoPointsWithdrawing + mpAmount,
      }));

      setPayoutRequests((prev) => {
        const next = [result.payoutRequest!, ...prev];
        localStorage.setItem('magnopvs_payout_requests', JSON.stringify(next));
        return next;
      });

      return { success: true, payoutRequest: result.payoutRequest };
    }

    return { success: false, error: result.error };
  };

  // 6. KYC & Identity Verification
  const [kycProfile, setKycProfile] = useState<KycProfile>(() => {
    try {
      const saved = localStorage.getItem('magnopvs_kyc_profile');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      id: `kyc_${player.id}`,
      playerId: player.id,
      fullName: player.name || 'Heroe Quantvm',
      documentType: 'NATIONAL_ID',
      documentNumber: 'CC-1098452310',
      country: 'COL',
      status: player.kycStatus || 'VERIFIED',
      verificationLevel: 2,
      dailyWithdrawalLimitUsd: 5000,
      monthlyWithdrawalLimitUsd: 50000,
      verifiedAt: new Date().toISOString(),
    };
  });

  const submitKycApplication = (data: Partial<KycProfile>) => {
    playSoundEffect('click');
    const updated: KycProfile = {
      ...kycProfile,
      ...data,
      status: 'VERIFIED', // Verified in sandbox/dev mode
      verificationLevel: 2,
      verifiedAt: new Date().toISOString(),
    };
    setKycProfile(updated);
    localStorage.setItem('magnopvs_kyc_profile', JSON.stringify(updated));
  };

  // 7. Ledger & Admin
  const [ledgerEntries, setLedgerEntries] = useState<FinancialLedgerEntry[]>(() => {
    return FinancialSystemService.getLedgerEntries();
  });

  const updateAdminRule = (patch: Partial<ConversionRule>) => {
    playSoundEffect('click');
    const updated = FinancialSystemService.updateConversionRule(patch);
    setActiveConversionRule(updated);
  };

  const updatePayoutRequestStatus = (payoutId: string, status: PayoutRequest['status'], reason?: string) => {
    playSoundEffect('click');
    FinancialSystemService.updatePayoutStatus(payoutId, status, reason);
    setPayoutRequests((prev) =>
      prev.map((p) => (p.id === payoutId ? { ...p, status, rejectionReason: reason } : p))
    );
  };

  // 8. Automated Test Suite (Rule 8)
  const [testResults, setTestResults] = useState<AutomatedTestResult[]>(() => {
    return FinancialSystemService.runAutomatedTestSuite();
  });

  const runAutomatedTests = (): AutomatedTestResult[] => {
    playSoundEffect('quest');
    const res = FinancialSystemService.runAutomatedTestSuite();
    setTestResults(res);
    return res;
  };

  return (
    <FinancialContext.Provider
      value={{
        activeCurrency,
        setActiveCurrency,
        supportedCurrencies: SUPPORTED_FIAT_CURRENCIES,
        balances,
        refreshBalances,
        activeQuote,
        requestConversionQuote,
        executeQuoteConversion,
        cancelActiveQuote,
        activeConversionRule,
        paymentProviders: INITIAL_PAYMENT_PROVIDERS,
        executeTopUp,
        payoutRequests,
        requestPayout,
        kycProfile,
        submitKycApplication,
        ledgerEntries,
        updateAdminRule,
        updatePayoutRequestStatus,
        runAutomatedTests,
        testResults,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};
