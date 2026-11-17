/**
 * ==============================================================================
 * MagnopVS FINANCIAL SYSTEM (MFS) V1.1 - DOMAIN MODELS & FINANCIAL TYPES
 * ==============================================================================
 * Official economic invariants:
 * 1. 1 MagnoPoint (MP) = 1 USD (Accounting Reference Parity).
 * 2. MagnoCoins (MC) convert dynamically to MagnoPoints (MC -> MP) via quote engine.
 * 3. MicroCoins (µC) are internal non-convertible participation units.
 *    STRICTLY PROHIBITED: µC -> MP, µC -> MC, µC -> Real Money / Withdrawals.
 * 4. Withdrawals require VERIFIED KYC identity status.
 * 5. Double-entry accounting ledger & full idempotency.
 * ==============================================================================
 */

export const MAGNOPOINTS_USD_PARITY = 1.0; // 1 MP = 1 USD reference parity

export type MagnoCurrency = 'MP' | 'MC' | 'MICROCOIN' | 'FIAT_USD';

export type FiatCurrencyCode =
  | 'USD'
  | 'EUR'
  | 'COP'
  | 'MXN'
  | 'BRL'
  | 'GBP'
  | 'ARS'
  | 'CLP'
  | 'PEN'
  | 'CAD'
  | 'AUD'
  | 'JPY';

export interface FiatCurrency {
  code: FiatCurrencyCode;
  name: string;
  symbol: string;
  exchangeRateToUsd: number; // e.g. COP = 4150, EUR = 0.92
  flag: string;
  isPopular?: boolean;
}

export interface MfsBalances {
  // MagnoPoints (MP - 1 MP = 1 USD)
  magnoPointsAvailable: number;
  magnoPointsPending: number;
  magnoPointsLocked: number;
  magnoPointsWithdrawing: number;
  magnoPointsTotal: number;

  // MagnoCoins (MC - Engagement coin, convertible to MP)
  magnoCoinsAvailable: number;
  magnoCoinsTotalEarned: number;
  magnoCoinsTotalConverted: number;

  // MicroCoins (µC - Non-convertible participation tokens)
  microCoinsAvailable: number;
  microCoinsTotalEarned: number;
  microCoinsTotalSpent: number;

  // Historical Fiat totals
  totalFiatDepositedUsd: number;
  totalFiatWithdrawnUsd: number;
}

export type KycStatus =
  | 'NOT_STARTED'
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'REJECTED'
  | 'EXPIRED';

export interface KycProfile {
  id: string;
  playerId: string;
  fullName: string;
  documentType: 'PASSPORT' | 'NATIONAL_ID' | 'DRIVERS_LICENSE' | 'TAX_ID';
  documentNumber: string;
  country: string;
  dateOfBirth?: string;
  status: KycStatus;
  verificationLevel: number; // 0: None, 1: Basic, 2: Standard, 3: Enhanced
  dailyWithdrawalLimitUsd: number;
  monthlyWithdrawalLimitUsd: number;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface ConversionRule {
  id: string;
  fromCurrency: 'MC';
  toCurrency: 'MP';
  currentRateMpPerMc: number; // e.g., 0.01 (meaning 100 MC = 1 MP)
  minConvertibleMc: number;
  maxDailyMc: number;
  feePercentage: number; // e.g., 0.02 (2%)
  quoteValiditySeconds: number; // e.g., 60s
  isActive: boolean;
  version: number;
  updatedAt: string;
}

export interface ConversionQuote {
  quoteId: string;
  playerId: string;
  mcAmount: number;
  rateAppliedMpPerMc: number;
  grossMpAmount: number;
  feeMp: number;
  netMpAmount: number;
  fiatValueUsd: number; // Since 1 MP = 1 USD, netMpAmount * 1.0
  expiresAt: string; // ISO string
  secondsRemaining: number;
  status: 'PENDING' | 'EXECUTED' | 'EXPIRED' | 'CANCELLED';
}

export type PaymentMethodType =
  | 'CREDIT_DEBIT_CARD'
  | 'BANK_TRANSFER'
  | 'PSE_COLOMBIA'
  | 'PIX_BRAZIL'
  | 'SPEI_MEXICO'
  | 'SEPA_EUROPE'
  | 'ACH_USA'
  | 'PAYPAL'
  | 'MERCADO_PAGO';

export interface PaymentProviderInfo {
  id: string;
  name: string;
  type: PaymentMethodType;
  supportedCountries: string[];
  supportedCurrencies: FiatCurrencyCode[];
  feePercentage: number;
  fixedFeeUsd: number;
  minAmountUsd: number;
  maxAmountUsd: number;
  processingTime: string;
  badge?: string;
  iconName: string;
}

export interface TopUpIntentRequest {
  fiatCurrency: FiatCurrencyCode;
  fiatAmount: number;
  providerId: string;
  paymentMethod: PaymentMethodType;
}

export interface TopUpIntentResult {
  intentId: string;
  fiatCurrency: FiatCurrencyCode;
  fiatAmount: number;
  fiatFee: number;
  totalFiatToPay: number;
  magnoPointsToCredit: number; // 1 MP = 1 USD equivalent of net USD
  exchangeRateUsed: number;
  status: 'PENDING' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED';
  providerReference: string;
  idempotencyKey: string;
  createdAt: string;
}

export type PayoutStatus =
  | 'DRAFT'
  | 'PENDING_VERIFICATION'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'FAILED'
  | 'REFUNDED';

export interface PayoutRequest {
  id: string;
  playerId: string;
  magnoPointsAmount: number;
  feeMp: number;
  netMpDeducted: number;
  fiatCurrency: FiatCurrencyCode;
  exchangeRateUsed: number;
  estimatedGrossFiatAmount: number;
  estimatedNetFiatAmount: number;
  payoutMethod: PaymentMethodType;
  destinationAccount: {
    bankName?: string;
    accountNumberMasked?: string;
    accountType?: string;
    beneficiaryName?: string;
    emailOrPhone?: string;
  };
  kycLevelAtRequest: number;
  status: PayoutStatus;
  rejectionReason?: string;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
}

export type LedgerAccountType =
  | 'ASSET_FIAT_CUSTODY'
  | 'LIABILITY_MP_CIRCULATION'
  | 'PLAYER_MP_AVAILABLE'
  | 'PLAYER_MP_LOCKED'
  | 'PLAYER_MC_AVAILABLE'
  | 'PLAYER_MICROCOIN_AVAILABLE'
  | 'REVENUE_PLATFORM_FEES'
  | 'EXPENSE_REWARDS_EMISSION';

export interface FinancialLedgerEntry {
  id: string;
  transactionId: string;
  accountType: LedgerAccountType;
  debitAmount: number;
  creditAmount: number;
  currency: MagnoCurrency;
  balanceAfter: number;
  idempotencyKey?: string;
  auditHash: string;
  createdAt: string;
}

export interface AutomatedTestResult {
  testNumber: number;
  name: string;
  description: string;
  passed: boolean;
  actualResult: string;
  expectedResult: string;
  executionTimeMs: number;
  timestamp: string;
}

export type MfsActiveTab =
  | 'overview'
  | 'top_up'
  | 'buy_mp'
  | 'convert_mc'
  | 'withdraw'
  | 'ledger'
  | 'security_kyc'
  | 'admin_control'
  | 'automated_tests';
