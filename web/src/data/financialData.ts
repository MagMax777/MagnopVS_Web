/**
 * ==============================================================================
 * MagnopVS FINANCIAL SYSTEM (MFS) V1.1 - MASTER FINANCIAL DATA & PROVIDERS
 * ==============================================================================
 * Official reference data for international fiat currencies, payment adapters,
 * dynamic conversion engine rules, and pre-configured value packs.
 * Strict Brand Rule: Capitalization strictly as MagnopVS.
 * ==============================================================================
 */

import {
  FiatCurrency,
  PaymentProviderInfo,
  ConversionRule,
} from '../types/financial';

export const SUPPORTED_FIAT_CURRENCIES: FiatCurrency[] = [
  {
    code: 'USD',
    name: 'Dólar Estadounidense (Paridad Base)',
    symbol: '$',
    exchangeRateToUsd: 1.000000,
    flag: '🇺🇸',
    isPopular: true,
  },
  {
    code: 'COP',
    name: 'Peso Colombiano',
    symbol: '$',
    exchangeRateToUsd: 4150.000000,
    flag: '🇨🇴',
    isPopular: true,
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    exchangeRateToUsd: 0.920000,
    flag: '🇪🇺',
    isPopular: true,
  },
  {
    code: 'MXN',
    name: 'Peso Mexicano',
    symbol: '$',
    exchangeRateToUsd: 18.500000,
    flag: '🇲🇽',
    isPopular: true,
  },
  {
    code: 'BRL',
    name: 'Real Brasileño',
    symbol: 'R$',
    exchangeRateToUsd: 5.450000,
    flag: '🇧🇷',
    isPopular: true,
  },
  {
    code: 'GBP',
    name: 'Libra Esterlina',
    symbol: '£',
    exchangeRateToUsd: 0.790000,
    flag: '🇬🇧',
    isPopular: false,
  },
  {
    code: 'ARS',
    name: 'Peso Argentino',
    symbol: '$',
    exchangeRateToUsd: 980.000000,
    flag: '🇦🇷',
    isPopular: false,
  },
  {
    code: 'CLP',
    name: 'Peso Chileno',
    symbol: '$',
    exchangeRateToUsd: 940.000000,
    flag: '🇨🇱',
    isPopular: false,
  },
  {
    code: 'PEN',
    name: 'Sol Peruano',
    symbol: 'S/',
    exchangeRateToUsd: 3.750000,
    flag: '🇵🇪',
    isPopular: false,
  },
  {
    code: 'CAD',
    name: 'Dólar Canadiense',
    symbol: 'CA$',
    exchangeRateToUsd: 1.370000,
    flag: '🇨🇦',
    isPopular: false,
  },
  {
    code: 'AUD',
    name: 'Dólar Australiano',
    symbol: 'A$',
    exchangeRateToUsd: 1.520000,
    flag: '🇦🇺',
    isPopular: false,
  },
  {
    code: 'JPY',
    name: 'Yen Japonés',
    symbol: '¥',
    exchangeRateToUsd: 152.000000,
    flag: '🇯🇵',
    isPopular: false,
  },
];

export const INITIAL_PAYMENT_PROVIDERS: PaymentProviderInfo[] = [
  {
    id: 'stripe-card-global',
    name: 'Tarjeta de Crédito / Débito Internacional (Visa, Mastercard, Amex)',
    type: 'CREDIT_DEBIT_CARD',
    supportedCountries: ['GLOBAL', 'USA', 'COL', 'MEX', 'BRA', 'ESP', 'ARG', 'CHL', 'PER'],
    supportedCurrencies: ['USD', 'EUR', 'COP', 'MXN', 'BRL', 'GBP', 'CAD', 'AUD', 'JPY'],
    feePercentage: 0.029, // 2.9%
    fixedFeeUsd: 0.30,
    minAmountUsd: 5,
    maxAmountUsd: 10000,
    processingTime: 'Instantáneo',
    badge: 'INTERNACIONAL',
    iconName: 'CreditCard',
  },
  {
    id: 'pse-colombia',
    name: 'PSE - Pagos Seguros en Línea (Colombia)',
    type: 'PSE_COLOMBIA',
    supportedCountries: ['COL'],
    supportedCurrencies: ['COP', 'USD'],
    feePercentage: 0.015, // 1.5%
    fixedFeeUsd: 0.20,
    minAmountUsd: 5,
    maxAmountUsd: 5000,
    processingTime: 'Instantáneo (Débito a cuenta bancaria)',
    badge: 'COLOMBIA',
    iconName: 'Building2',
  },
  {
    id: 'pix-brazil',
    name: 'PIX Instantáneo (Brasil)',
    type: 'PIX_BRAZIL',
    supportedCountries: ['BRA'],
    supportedCurrencies: ['BRL', 'USD'],
    feePercentage: 0.009, // 0.9%
    fixedFeeUsd: 0.10,
    minAmountUsd: 5,
    maxAmountUsd: 8000,
    processingTime: 'Instantáneo (QR Code / Copia e Cola)',
    badge: 'BRASIL',
    iconName: 'QrCode',
  },
  {
    id: 'spei-mexico',
    name: 'SPEI - Transferencia Interbancaria (México)',
    type: 'SPEI_MEXICO',
    supportedCountries: ['MEX'],
    supportedCurrencies: ['MXN', 'USD'],
    feePercentage: 0.012, // 1.2%
    fixedFeeUsd: 0.15,
    minAmountUsd: 5,
    maxAmountUsd: 8000,
    processingTime: '1 a 5 minutos',
    badge: 'MÉXICO',
    iconName: 'Send',
  },
  {
    id: 'sepa-europe',
    name: 'SEPA Instant Credit Transfer (Unión Europea)',
    type: 'SEPA_EUROPE',
    supportedCountries: ['ESP', 'DEU', 'FRA', 'ITA', 'PRT', 'NLD'],
    supportedCurrencies: ['EUR'],
    feePercentage: 0.008, // 0.8%
    fixedFeeUsd: 0.25,
    minAmountUsd: 10,
    maxAmountUsd: 15000,
    processingTime: 'Instantáneo SEPA',
    badge: 'ZONA EURO',
    iconName: 'Globe',
  },
  {
    id: 'ach-usa',
    name: 'ACH Direct Deposit / Wire (Estados Unidos)',
    type: 'ACH_USA',
    supportedCountries: ['USA'],
    supportedCurrencies: ['USD'],
    feePercentage: 0.005, // 0.5%
    fixedFeeUsd: 0.50,
    minAmountUsd: 20,
    maxAmountUsd: 25000,
    processingTime: '1 día hábil',
    badge: 'ESTADOS UNIDOS',
    iconName: 'Landmark',
  },
  {
    id: 'paypal-global',
    name: 'PayPal Digital Wallet',
    type: 'PAYPAL',
    supportedCountries: ['GLOBAL'],
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'MXN', 'BRL'],
    feePercentage: 0.035, // 3.5%
    fixedFeeUsd: 0.49,
    minAmountUsd: 10,
    maxAmountUsd: 5000,
    processingTime: 'Instantáneo',
    badge: 'E-WALLET',
    iconName: 'Wallet',
  },
];

export const INITIAL_CONVERSION_RULE: ConversionRule = {
  id: 'MC_TO_MP_ACTIVE',
  fromCurrency: 'MC',
  toCurrency: 'MP',
  currentRateMpPerMc: 0.01000000, // 100 MC = 1 MP
  minConvertibleMc: 100,
  maxDailyMc: 50000,
  feePercentage: 0.0200, // 2%
  quoteValiditySeconds: 60,
  isActive: true,
  version: 1,
  updatedAt: '2026-11-04T10:00:00Z',
};

export const INITIAL_TOP_UP_PACKS = [
  {
    id: 'pack-starter-10',
    usdAmount: 10,
    magnoPoints: 10, // 1 MP = 1 USD
    title: 'Pack Iniciado',
    popular: false,
    bonusLabel: 'Sin Recargo',
  },
  {
    id: 'pack-explorer-25',
    usdAmount: 25,
    magnoPoints: 25,
    title: 'Pack Explorador',
    popular: false,
    bonusLabel: 'Acceso Temprano',
  },
  {
    id: 'pack-quantvm-50',
    usdAmount: 50,
    magnoPoints: 50,
    title: 'Pack Arquitecto Quantvm',
    popular: true,
    bonusLabel: 'Más Elegido',
  },
  {
    id: 'pack-master-100',
    usdAmount: 100,
    magnoPoints: 100,
    title: 'Pack Maestro Transmedia',
    popular: false,
    bonusLabel: 'Insignia Exclusiva',
  },
  {
    id: 'pack-cosmic-250',
    usdAmount: 250,
    magnoPoints: 250,
    title: 'Pack Alquimia Cósmica',
    popular: false,
    bonusLabel: 'Prioridad de Retiro',
  },
  {
    id: 'pack-syndicate-500',
    usdAmount: 500,
    magnoPoints: 500,
    title: 'Pack Soberano Omniversal',
    popular: false,
    bonusLabel: 'VIP Concierge',
  },
];
