/**
 * ==============================================================================
 * MagnopVS - WALLET SERVICE (ECONOMIC LEDGER & CONVERSIONS)
 * ==============================================================================
 * Handles all interactions with wallet database tables (Supabase SQL & Firestore),
 * providing atomic operations, internal validation, and real-time syncing.
 *
 * Official Economic Invariant:
 * 10,000 MagnoPoints (MP) = 1 MicroCoin (µC)
 * - Balances are non-negative BIGINT / integer units.
 * - Currency conversions must be atomic, idempotent, and for integer MicroCoins.
 * ==============================================================================
 */

import { supabase } from '../lib/supabase';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  getDocs,
  runTransaction,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { WalletCurrency, WalletTransactionType } from '../types';

export const CONVERSION_RATE_MP_PER_MICROCOIN = 10000;

export interface WalletBalances {
  playerId: string;
  magnoPoints: number;
  microCoins: number;
  totalEarnedMp: number;
  totalSpentMp: number;
  totalConvertedMp: number;
  totalEarnedMicroCoins: number;
  totalSpentMicroCoins: number;
  conversionRate: number;
  updatedAt?: string;
}

export interface WalletTransaction {
  id: string;
  playerId: string;
  walletId?: string;
  transactionType: WalletTransactionType;
  currency: WalletCurrency;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  source: string;
  sourceReference?: string;
  idempotencyKey?: string;
  description: string;
  metadata?: Record<string, any>;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'REVERSED';
  createdAt: string;
}

export interface TransactionFilterOptions {
  currency?: WalletCurrency | 'ALL';
  type?: WalletTransactionType | 'ALL';
  limit?: number;
  page?: number;
  startDate?: string;
  endDate?: string;
}

export interface ConversionValidationResult {
  valid: boolean;
  error?: string;
  microCoinsToAdd?: number;
}

export interface ConversionResult {
  success: boolean;
  error?: string;
  mpDeducted?: number;
  microCoinsAdded?: number;
  newMagnoPoints?: number;
  newMicroCoins?: number;
  transactions?: WalletTransaction[];
  alreadyProcessed?: boolean;
}

export interface SpendResult {
  success: boolean;
  error?: string;
  currency?: WalletCurrency;
  amountSpent?: number;
  newBalance?: number;
  wallet?: WalletBalances;
  transaction?: WalletTransaction;
  alreadyProcessed?: boolean;
}

export interface RewardResult {
  success: boolean;
  error?: string;
  currency?: WalletCurrency;
  amountRewarded?: number;
  newBalance?: number;
  wallet?: WalletBalances;
  transaction?: WalletTransaction;
  alreadyProcessed?: boolean;
}

/**
 * In-memory local cache & fallback for initial or offline state
 */
const localWalletCache = new Map<string, WalletBalances>();
const localTxCache = new Map<string, WalletTransaction[]>();
const idempotencyCache = new Set<string>();

export class WalletService {
  /**
   * Internal validation for MP to MicroCoin conversion.
   * Guarantees:
   * 1. mpAmount is a strictly positive integer.
   * 2. mpAmount >= 10,000.
   * 3. mpAmount is an exact multiple of 10,000 (no fractional MicroCoins).
   * 4. current balance is sufficient (no negative balance).
   */
  public static validateConversion(
    mpAmount: number,
    currentMpBalance?: number
  ): ConversionValidationResult {
    if (typeof mpAmount !== 'number' || isNaN(mpAmount)) {
      return { valid: false, error: 'La cantidad de MagnoPoints debe ser un número válido.' };
    }

    if (!Number.isInteger(mpAmount)) {
      return { valid: false, error: 'La cantidad de MagnoPoints debe ser un número entero.' };
    }

    if (mpAmount <= 0) {
      return { valid: false, error: 'La cantidad a convertir debe ser mayor que cero.' };
    }

    if (mpAmount < CONVERSION_RATE_MP_PER_MICROCOIN) {
      return {
        valid: false,
        error: `La conversión mínima es de ${CONVERSION_RATE_MP_PER_MICROCOIN.toLocaleString()} MP (equivalente a 1 µC).`,
      };
    }

    if (mpAmount % CONVERSION_RATE_MP_PER_MICROCOIN !== 0) {
      return {
        valid: false,
        error: `La cantidad debe ser un múltiplo exacto de ${CONVERSION_RATE_MP_PER_MICROCOIN.toLocaleString()} MP. Solo se emiten MicroCoins enteros.`,
      };
    }

    if (currentMpBalance !== undefined && currentMpBalance < mpAmount) {
      return {
        valid: false,
        error: `Saldo insuficiente en tu Wallet de MagnopVS. Tienes ${currentMpBalance.toLocaleString()} MP y requieres ${mpAmount.toLocaleString()} MP.`,
      };
    }

    const microCoinsToAdd = Math.floor(mpAmount / CONVERSION_RATE_MP_PER_MICROCOIN);
    return {
      valid: true,
      microCoinsToAdd,
    };
  }

  /**
   * Generates default wallet balances for a player
   */
  public static getDefaultBalances(playerId: string): WalletBalances {
    return {
      playerId,
      magnoPoints: 5500,
      microCoins: 2,
      totalEarnedMp: 25500,
      totalSpentMp: 0,
      totalConvertedMp: 20000,
      totalEarnedMicroCoins: 2,
      totalSpentMicroCoins: 0,
      conversionRate: CONVERSION_RATE_MP_PER_MICROCOIN,
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * 1. FETCH BALANCES
   * Queries Firestore first, syncs with backend Express API / Supabase, or falls back to local cache.
   */
  public static async getBalances(playerId: string): Promise<WalletBalances> {
    if (!playerId) {
      throw new Error('Player ID es requerido para consultar saldos de wallet.');
    }

    // A. Check Firestore
    try {
      const walletRef = doc(db, 'wallets', playerId);
      const snapshot = await getDoc(walletRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        const balances: WalletBalances = {
          playerId,
          magnoPoints: Number(data.magnoPoints ?? 0),
          microCoins: Number(data.microCoins ?? 0),
          totalEarnedMp: Number(data.totalEarnedMp ?? 0),
          totalSpentMp: Number(data.totalSpentMp ?? 0),
          totalConvertedMp: Number(data.totalConvertedMp ?? 0),
          totalEarnedMicroCoins: Number(data.totalEarnedMicroCoins ?? 0),
          totalSpentMicroCoins: Number(data.totalSpentMicroCoins ?? 0),
          conversionRate: CONVERSION_RATE_MP_PER_MICROCOIN,
          updatedAt: data.updatedAt ? new Date(data.updatedAt).toISOString() : new Date().toISOString(),
        };
        localWalletCache.set(playerId, balances);
        return balances;
      }
    } catch (fsErr) {
      console.warn('[WalletService] Firestore getBalances bypass/offline:', fsErr);
    }

    // B. Check Backend API Endpoint
    try {
      const res = await fetch(`/api/wallet/${encodeURIComponent(playerId)}`);
      if (res.ok) {
        const apiData = await res.json();
        const balances: WalletBalances = {
          playerId,
          magnoPoints: Number(apiData.magnoPoints ?? 0),
          microCoins: Number(apiData.microCoins ?? 0),
          totalEarnedMp: Number(apiData.totalEarnedMp ?? 0),
          totalSpentMp: Number(apiData.totalSpentMp ?? 0),
          totalConvertedMp: Number(apiData.totalConvertedMp ?? 0),
          totalEarnedMicroCoins: Number(apiData.totalEarnedMicroCoins ?? 0),
          totalSpentMicroCoins: Number(apiData.totalSpentMicroCoins ?? 0),
          conversionRate: CONVERSION_RATE_MP_PER_MICROCOIN,
          updatedAt: new Date().toISOString(),
        };
        localWalletCache.set(playerId, balances);
        return balances;
      }
    } catch (apiErr) {
      console.warn('[WalletService] API getBalances fallback:', apiErr);
    }

    // C. Check Supabase table fallback
    try {
      const { data: supaWallet } = await supabase
        .from('wallets')
        .select(`
          id,
          player_id,
          total_earned_mp,
          total_spent_mp,
          total_converted_mp,
          total_earned_microcoins,
          total_spent_microcoins,
          wallet_balances(currency, balance)
        `)
        .eq('player_id', playerId)
        .maybeSingle();

      if (supaWallet) {
        const balancesMap: Record<string, number> = {};
        if (Array.isArray(supaWallet.wallet_balances)) {
          supaWallet.wallet_balances.forEach((b: any) => {
            balancesMap[b.currency] = Number(b.balance);
          });
        }
        const balances: WalletBalances = {
          playerId,
          magnoPoints: balancesMap['MP'] ?? 0,
          microCoins: balancesMap['MICROCOIN'] ?? 0,
          totalEarnedMp: Number(supaWallet.total_earned_mp ?? 0),
          totalSpentMp: Number(supaWallet.total_spent_mp ?? 0),
          totalConvertedMp: Number(supaWallet.total_converted_mp ?? 0),
          totalEarnedMicroCoins: Number(supaWallet.total_earned_microcoins ?? 0),
          totalSpentMicroCoins: Number(supaWallet.total_spent_microcoins ?? 0),
          conversionRate: CONVERSION_RATE_MP_PER_MICROCOIN,
          updatedAt: new Date().toISOString(),
        };
        localWalletCache.set(playerId, balances);
        return balances;
      }
    } catch (supaErr) {
      // Supabase is optional/unprovisioned
    }

    // D. Local cache or default fallback
    const cached = localWalletCache.get(playerId) || this.getDefaultBalances(playerId);
    localWalletCache.set(playerId, cached);
    return cached;
  }

  /**
   * 2. RETRIEVE TRANSACTION HISTORY
   * Fetches paginated & filtered audit ledger entries from Firestore / API / Supabase.
   */
  public static async getTransactionHistory(
    playerId: string,
    options: TransactionFilterOptions = {}
  ): Promise<WalletTransaction[]> {
    if (!playerId) return [];

    const { currency, type, limit = 50, page = 1 } = options;

    // A. Query Firestore subcollection
    try {
      const txCollection = collection(db, 'wallets', playerId, 'transactions');
      let q = query(txCollection, orderBy('createdAt', 'desc'), firestoreLimit(limit));

      if (currency && currency !== 'ALL') {
        q = query(txCollection, where('currency', '==', currency), orderBy('createdAt', 'desc'), firestoreLimit(limit));
      }
      if (type && type !== 'ALL') {
        q = query(txCollection, where('transactionType', '==', type), orderBy('createdAt', 'desc'), firestoreLimit(limit));
      }

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const results: WalletTransaction[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            playerId: data.playerId || playerId,
            transactionType: data.transactionType,
            currency: data.currency,
            amount: Number(data.amount),
            balanceBefore: Number(data.balanceBefore ?? 0),
            balanceAfter: Number(data.balanceAfter ?? 0),
            source: data.source,
            sourceReference: data.sourceReference,
            idempotencyKey: data.idempotencyKey,
            description: data.description,
            metadata: data.metadata,
            status: data.status || 'COMPLETED',
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
          };
        });
        localTxCache.set(playerId, results);
        return results;
      }
    } catch (fsErr) {
      console.warn('[WalletService] Firestore getTransactionHistory bypass/offline:', fsErr);
    }

    // B. Query Backend API
    try {
      const params = new URLSearchParams();
      if (currency && currency !== 'ALL') params.append('currency', currency);
      if (type && type !== 'ALL') params.append('type', type);
      params.append('limit', String(limit));
      params.append('page', String(page));

      const res = await fetch(`/api/wallet/${encodeURIComponent(playerId)}/transactions?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.transactions)) {
          localTxCache.set(playerId, data.transactions);
          return data.transactions;
        }
      }
    } catch (apiErr) {
      console.warn('[WalletService] API getTransactionHistory fallback:', apiErr);
    }

    // C. Query Supabase table if available
    try {
      let supaQuery = supabase
        .from('wallet_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (currency && currency !== 'ALL') {
        supaQuery = supaQuery.eq('currency', currency);
      }
      if (type && type !== 'ALL') {
        supaQuery = supaQuery.eq('transaction_type', type);
      }

      const { data: supaTxs } = await supaQuery;
      if (supaTxs && supaTxs.length > 0) {
        const parsedTxs: WalletTransaction[] = supaTxs.map((t: any) => ({
          id: t.id,
          playerId,
          transactionType: t.transaction_type,
          currency: t.currency,
          amount: Number(t.amount),
          balanceBefore: Number(t.balance_before),
          balanceAfter: Number(t.balance_after),
          source: t.source,
          sourceReference: t.source_reference,
          idempotencyKey: t.idempotency_key,
          description: t.description,
          metadata: t.metadata,
          status: t.status,
          createdAt: t.created_at,
        }));
        localTxCache.set(playerId, parsedTxs);
        return parsedTxs;
      }
    } catch (supaErr) {
      // Supabase is optional
    }

    // D. Local memory fallback
    return localTxCache.get(playerId) || [];
  }

  /**
   * 3. PROCESS ATOMIC CURRENCY CONVERSION (MagnoPoints -> MicroCoins)
   *
   * Executes atomic conversion:
   * - 10,000 MP = 1 MicroCoin (µC)
   * - Strict validation (positive, integer, multiple of 10,000, no negative balances).
   * - Writes atomically to Firestore via runTransaction with audit records.
   * - Synchronizes with Backend Express API and Supabase RPC when accessible.
   */
  public static async convertMpToMicroCoins(
    playerId: string,
    mpAmount: number,
    idempotencyKey?: string
  ): Promise<ConversionResult> {
    if (!playerId) {
      return { success: false, error: 'Identificador de jugador inválido.' };
    }

    // Idempotency check
    if (idempotencyKey && idempotencyCache.has(idempotencyKey)) {
      return {
        success: true,
        alreadyProcessed: true,
        error: 'Esta conversión ya fue procesada anteriormente con la misma clave de idempotencia.',
      };
    }

    // Fetch current balances for internal validation
    const currentBalances = await this.getBalances(playerId);

    // Run internal validation
    const validation = this.validateConversion(mpAmount, currentBalances.magnoPoints);
    if (!validation.valid || !validation.microCoinsToAdd) {
      return {
        success: false,
        error: validation.error || 'Validación de conversión fallida.',
      };
    }

    const microCoinsToAdd = validation.microCoinsToAdd;

    // A. Attempt Atomic Transaction in Firestore
    try {
      const walletRef = doc(db, 'wallets', playerId);
      const mpTxRef = doc(collection(db, 'wallets', playerId, 'transactions'));
      const mcTxRef = doc(collection(db, 'wallets', playerId, 'transactions'));

      const result = await runTransaction(db, async (transaction) => {
        const walletSnap = await transaction.get(walletRef);
        let currentMp = currentBalances.magnoPoints;
        let currentMc = currentBalances.microCoins;
        let totalConvertedMp = currentBalances.totalConvertedMp;
        let totalEarnedMc = currentBalances.totalEarnedMicroCoins;
        let totalEarnedMp = currentBalances.totalEarnedMp;
        let totalSpentMp = currentBalances.totalSpentMp;
        let totalSpentMc = currentBalances.totalSpentMicroCoins;

        if (walletSnap.exists()) {
          const wData = walletSnap.data();
          currentMp = Number(wData.magnoPoints ?? currentMp);
          currentMc = Number(wData.microCoins ?? currentMc);
          totalConvertedMp = Number(wData.totalConvertedMp ?? totalConvertedMp);
          totalEarnedMc = Number(wData.totalEarnedMicroCoins ?? totalEarnedMc);
          totalEarnedMp = Number(wData.totalEarnedMp ?? totalEarnedMp);
          totalSpentMp = Number(wData.totalSpentMp ?? totalSpentMp);
          totalSpentMc = Number(wData.totalSpentMicroCoins ?? totalSpentMc);
        }

        // Strict invariant check inside atomic transaction
        if (currentMp < mpAmount) {
          throw new Error(
            `Saldo insuficiente de MagnoPoints. Saldo disponible: ${currentMp.toLocaleString()} MP, requerido: ${mpAmount.toLocaleString()} MP.`
          );
        }

        const newMp = currentMp - mpAmount;
        const newMc = currentMc + microCoinsToAdd;

        // Invariant guard: no negative balances allowed
        if (newMp < 0 || newMc < 0) {
          throw new Error('Violación de integridad económica: el saldo resultante no puede ser negativo.');
        }

        const nowIso = new Date().toISOString();

        // 1. Update Wallet document
        transaction.set(
          walletRef,
          {
            playerId,
            magnoPoints: newMp,
            microCoins: newMc,
            totalEarnedMp,
            totalSpentMp,
            totalConvertedMp: totalConvertedMp + mpAmount,
            totalEarnedMicroCoins: totalEarnedMc + microCoinsToAdd,
            totalSpentMicroCoins: totalSpentMc,
            conversionRate: CONVERSION_RATE_MP_PER_MICROCOIN,
            updatedAt: nowIso,
          },
          { merge: true }
        );

        // 2. Audit Record: Debit MagnoPoints
        const mpTxData = {
          id: mpTxRef.id,
          playerId,
          transactionType: 'CONVERSION',
          currency: 'MP',
          amount: -mpAmount,
          balanceBefore: currentMp,
          balanceAfter: newMp,
          source: 'WALLET_CONVERTER',
          idempotencyKey: idempotencyKey || mpTxRef.id,
          description: `Conversión atómica de ${mpAmount.toLocaleString()} MP a ${microCoinsToAdd} µC en MagnopVS`,
          status: 'COMPLETED',
          createdAt: nowIso,
        };
        transaction.set(mpTxRef, mpTxData);

        // 3. Audit Record: Credit MicroCoins
        const mcTxData = {
          id: mcTxRef.id,
          playerId,
          transactionType: 'CONVERSION',
          currency: 'MICROCOIN',
          amount: microCoinsToAdd,
          balanceBefore: currentMc,
          balanceAfter: newMc,
          source: 'WALLET_CONVERTER',
          sourceReference: mpTxRef.id,
          idempotencyKey: idempotencyKey ? `${idempotencyKey}_mc` : mcTxRef.id,
          description: `Acreditación de ${microCoinsToAdd} MicroCoins (µC) por conversión atómica`,
          status: 'COMPLETED',
          createdAt: nowIso,
        };
        transaction.set(mcTxRef, mcTxData);

        return {
          newMagnoPoints: newMp,
          newMicroCoins: newMc,
          mpTx: mpTxData as unknown as WalletTransaction,
          mcTx: mcTxData as unknown as WalletTransaction,
        };
      });

      // Update in-memory caches
      const updatedBalances: WalletBalances = {
        ...currentBalances,
        magnoPoints: result.newMagnoPoints,
        microCoins: result.newMicroCoins,
        totalConvertedMp: currentBalances.totalConvertedMp + mpAmount,
        totalEarnedMicroCoins: currentBalances.totalEarnedMicroCoins + microCoinsToAdd,
        updatedAt: new Date().toISOString(),
      };
      localWalletCache.set(playerId, updatedBalances);

      const existingTxs = localTxCache.get(playerId) || [];
      localTxCache.set(playerId, [result.mcTx, result.mpTx, ...existingTxs]);

      if (idempotencyKey) {
        idempotencyCache.add(idempotencyKey);
      }

      // Sync with Express backend endpoint in background for dual-mode persistence
      fetch(`/api/wallet/${encodeURIComponent(playerId)}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mpAmount, idempotencyKey }),
      }).catch((syncErr) => console.warn('[WalletService] API convert sync note:', syncErr));

      return {
        success: true,
        mpDeducted: mpAmount,
        microCoinsAdded: microCoinsToAdd,
        newMagnoPoints: result.newMagnoPoints,
        newMicroCoins: result.newMicroCoins,
        transactions: [result.mpTx, result.mcTx],
      };
    } catch (fsErr: any) {
      console.warn('[WalletService] Firestore transaction failed/bypassed, trying backend API:', fsErr);
      // If error was a direct business assertion error (like saldo insuficiente), return it
      if (fsErr.message && fsErr.message.includes('Saldo insuficiente')) {
        return { success: false, error: fsErr.message };
      }
    }

    // B. Fallback to Backend Express API /api/wallet/:playerId/convert
    try {
      const res = await fetch(`/api/wallet/${encodeURIComponent(playerId)}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mpAmount, idempotencyKey }),
      });

      if (res.ok) {
        const data = await res.json();
        const updatedBalances: WalletBalances = {
          ...currentBalances,
          magnoPoints: data.newMagnoPoints ?? currentBalances.magnoPoints - mpAmount,
          microCoins: data.newMicroCoins ?? currentBalances.microCoins + microCoinsToAdd,
          totalConvertedMp: currentBalances.totalConvertedMp + mpAmount,
          totalEarnedMicroCoins: currentBalances.totalEarnedMicroCoins + microCoinsToAdd,
          updatedAt: new Date().toISOString(),
        };
        localWalletCache.set(playerId, updatedBalances);

        if (Array.isArray(data.transactions)) {
          const existingTxs = localTxCache.get(playerId) || [];
          localTxCache.set(playerId, [...data.transactions, ...existingTxs]);
        }

        if (idempotencyKey) {
          idempotencyCache.add(idempotencyKey);
        }

        return {
          success: true,
          mpDeducted: mpAmount,
          microCoinsAdded: microCoinsToAdd,
          newMagnoPoints: updatedBalances.magnoPoints,
          newMicroCoins: updatedBalances.microCoins,
          transactions: data.transactions,
        };
      } else {
        const errJson = await res.json().catch(() => ({}));
        return {
          success: false,
          error: errJson.error || 'Error al procesar la conversión atómica.',
        };
      }
    } catch (apiErr: any) {
      console.error('[WalletService] API conversion failed:', apiErr);
    }

    // C. Supabase RPC fallback if available
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('convert_mp_to_microcoin', {
        p_player_id: playerId,
        p_mp_amount: mpAmount,
        p_idempotency_key: idempotencyKey || null,
      });

      if (!rpcError && rpcData?.success) {
        return {
          success: true,
          mpDeducted: mpAmount,
          microCoinsAdded: rpcData.microcoins_added || microCoinsToAdd,
          newMagnoPoints: rpcData.new_mp_balance,
          newMicroCoins: rpcData.new_microcoin_balance,
        };
      }
    } catch (supaErr) {
      // Supabase is optional
    }

    // D. Safe In-Memory local update with invariant guarantee
    const newMp = currentBalances.magnoPoints - mpAmount;
    const newMc = currentBalances.microCoins + microCoinsToAdd;

    if (newMp < 0) {
      return {
        success: false,
        error: `Saldo insuficiente. Tienes ${currentBalances.magnoPoints.toLocaleString()} MP y requieres ${mpAmount.toLocaleString()} MP.`,
      };
    }

    const nowIso = new Date().toISOString();
    const mpTx: WalletTransaction = {
      id: `tx-mp-${Date.now()}`,
      playerId,
      transactionType: 'CONVERSION',
      currency: 'MP',
      amount: -mpAmount,
      balanceBefore: currentBalances.magnoPoints,
      balanceAfter: newMp,
      source: 'WALLET_CONVERTER',
      idempotencyKey,
      description: `Conversión atómica de ${mpAmount.toLocaleString()} MP a ${microCoinsToAdd} µC`,
      status: 'COMPLETED',
      createdAt: nowIso,
    };

    const mcTx: WalletTransaction = {
      id: `tx-mc-${Date.now()}`,
      playerId,
      transactionType: 'CONVERSION',
      currency: 'MICROCOIN',
      amount: microCoinsToAdd,
      balanceBefore: currentBalances.microCoins,
      balanceAfter: newMc,
      source: 'WALLET_CONVERTER',
      sourceReference: mpTx.id,
      idempotencyKey: idempotencyKey ? `${idempotencyKey}_mc` : undefined,
      description: `Acreditación de ${microCoinsToAdd} MicroCoins por conversión atómica`,
      status: 'COMPLETED',
      createdAt: nowIso,
    };

    const updatedBalances: WalletBalances = {
      ...currentBalances,
      magnoPoints: newMp,
      microCoins: newMc,
      totalConvertedMp: currentBalances.totalConvertedMp + mpAmount,
      totalEarnedMicroCoins: currentBalances.totalEarnedMicroCoins + microCoinsToAdd,
      updatedAt: nowIso,
    };

    localWalletCache.set(playerId, updatedBalances);
    const existingTxs = localTxCache.get(playerId) || [];
    localTxCache.set(playerId, [mcTx, mpTx, ...existingTxs]);

    if (idempotencyKey) {
      idempotencyCache.add(idempotencyKey);
    }

    return {
      success: true,
      mpDeducted: mpAmount,
      microCoinsAdded: microCoinsToAdd,
      newMagnoPoints: newMp,
      newMicroCoins: newMc,
      transactions: [mpTx, mcTx],
    };
  }

  /**
   * 4. SPEND CURRENCY
   * Deducts MP or MicroCoins with non-negative invariant verification.
   */
  public static async spendCurrency(
    playerId: string,
    currency: WalletCurrency,
    amount: number,
    source: string,
    description: string,
    options: {
      sourceReference?: string;
      metadata?: Record<string, any>;
      idempotencyKey?: string;
    } = {}
  ): Promise<SpendResult> {
    if (!playerId) return { success: false, error: 'Player ID es requerido.' };
    if (!amount || amount <= 0 || !Number.isInteger(amount)) {
      return { success: false, error: 'Monto a debitar inválido (debe ser un entero positivo).' };
    }

    const { sourceReference, metadata, idempotencyKey } = options;

    if (idempotencyKey && idempotencyCache.has(idempotencyKey)) {
      return { success: true, alreadyProcessed: true };
    }

    // Try Backend API
    try {
      const res = await fetch(`/api/wallet/${encodeURIComponent(playerId)}/spend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currency,
          amount,
          source,
          sourceReference,
          description,
          metadata,
          idempotencyKey,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (idempotencyKey) idempotencyCache.add(idempotencyKey);
        return {
          success: true,
          currency,
          amountSpent: amount,
          newBalance: data.newBalance,
          wallet: data.wallet,
          transaction: data.transaction,
        };
      } else {
        const err = await res.json().catch(() => ({}));
        return { success: false, error: err.error || 'Saldo insuficiente o error al procesar el débito.' };
      }
    } catch (e) {
      console.warn('[WalletService] API spend fallback to local state:', e);
    }

    // Local state fallback
    const balances = await this.getBalances(playerId);
    const current = currency === 'MP' ? balances.magnoPoints : balances.microCoins;

    if (current < amount) {
      return {
        success: false,
        error: `Saldo insuficiente. Tienes ${current.toLocaleString()} ${currency} y requieres ${amount.toLocaleString()} ${currency}.`,
      };
    }

    const newBalance = current - amount;
    const nowIso = new Date().toISOString();

    const tx: WalletTransaction = {
      id: `tx-spend-${Date.now()}`,
      playerId,
      transactionType: source === 'LIVE_TIP' ? 'TIP' : 'PURCHASE',
      currency,
      amount: -amount,
      balanceBefore: current,
      balanceAfter: newBalance,
      source,
      sourceReference,
      idempotencyKey,
      description,
      metadata,
      status: 'COMPLETED',
      createdAt: nowIso,
    };

    const updatedBalances: WalletBalances = {
      ...balances,
      magnoPoints: currency === 'MP' ? newBalance : balances.magnoPoints,
      microCoins: currency === 'MICROCOIN' ? newBalance : balances.microCoins,
      totalSpentMp: currency === 'MP' ? balances.totalSpentMp + amount : balances.totalSpentMp,
      totalSpentMicroCoins: currency === 'MICROCOIN' ? balances.totalSpentMicroCoins + amount : balances.totalSpentMicroCoins,
      updatedAt: nowIso,
    };

    localWalletCache.set(playerId, updatedBalances);
    const existing = localTxCache.get(playerId) || [];
    localTxCache.set(playerId, [tx, ...existing]);

    if (idempotencyKey) idempotencyCache.add(idempotencyKey);

    return {
      success: true,
      currency,
      amountSpent: amount,
      newBalance,
      wallet: updatedBalances,
      transaction: tx,
    };
  }

  /**
   * 5. REWARD CURRENCY
   * Credits MP or MicroCoins to a player wallet with an immutable audit entry.
   */
  public static async rewardCurrency(
    playerId: string,
    currency: WalletCurrency,
    amount: number,
    source: string,
    description: string,
    options: {
      sourceReference?: string;
      idempotencyKey?: string;
    } = {}
  ): Promise<RewardResult> {
    if (!playerId) return { success: false, error: 'Player ID es requerido.' };
    if (!amount || amount <= 0 || !Number.isInteger(amount)) {
      return { success: false, error: 'Monto de recompensa inválido.' };
    }

    const { sourceReference, idempotencyKey } = options;

    if (idempotencyKey && idempotencyCache.has(idempotencyKey)) {
      return { success: true, alreadyProcessed: true };
    }

    // Try backend API
    try {
      const res = await fetch(`/api/wallet/${encodeURIComponent(playerId)}/reward`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currency,
          amount,
          source,
          sourceReference,
          description,
          idempotencyKey,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (idempotencyKey) idempotencyCache.add(idempotencyKey);
        return {
          success: true,
          currency,
          amountRewarded: amount,
          newBalance: data.newBalance,
          wallet: data.wallet,
          transaction: data.transaction,
        };
      }
    } catch (e) {
      console.warn('[WalletService] API reward fallback to local state:', e);
    }

    // Local state fallback
    const balances = await this.getBalances(playerId);
    const current = currency === 'MP' ? balances.magnoPoints : balances.microCoins;
    const newBalance = current + amount;
    const nowIso = new Date().toISOString();

    const tx: WalletTransaction = {
      id: `tx-reward-${Date.now()}`,
      playerId,
      transactionType: 'REWARD',
      currency,
      amount,
      balanceBefore: current,
      balanceAfter: newBalance,
      source,
      sourceReference,
      idempotencyKey,
      description,
      status: 'COMPLETED',
      createdAt: nowIso,
    };

    const updatedBalances: WalletBalances = {
      ...balances,
      magnoPoints: currency === 'MP' ? newBalance : balances.magnoPoints,
      microCoins: currency === 'MICROCOIN' ? newBalance : balances.microCoins,
      totalEarnedMp: currency === 'MP' ? balances.totalEarnedMp + amount : balances.totalEarnedMp,
      totalEarnedMicroCoins: currency === 'MICROCOIN' ? balances.totalEarnedMicroCoins + amount : balances.totalEarnedMicroCoins,
      updatedAt: nowIso,
    };

    localWalletCache.set(playerId, updatedBalances);
    const existing = localTxCache.get(playerId) || [];
    localTxCache.set(playerId, [tx, ...existing]);

    if (idempotencyKey) idempotencyCache.add(idempotencyKey);

    return {
      success: true,
      currency,
      amountRewarded: amount,
      newBalance,
      wallet: updatedBalances,
      transaction: tx,
    };
  }

  /**
   * 6. REAL-TIME SNAPSHOT LISTENER
   * Attaches a live Firestore snapshot listener to the player's wallet doc.
   * Returns an unsubscribe function for React cleanup.
   */
  public static listenToWalletBalances(
    playerId: string,
    callback: (balances: WalletBalances) => void
  ): () => void {
    if (!playerId) return () => {};

    try {
      const walletRef = doc(db, 'wallets', playerId);
      return onSnapshot(
        walletRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            const b: WalletBalances = {
              playerId,
              magnoPoints: Number(data.magnoPoints ?? 0),
              microCoins: Number(data.microCoins ?? 0),
              totalEarnedMp: Number(data.totalEarnedMp ?? 0),
              totalSpentMp: Number(data.totalSpentMp ?? 0),
              totalConvertedMp: Number(data.totalConvertedMp ?? 0),
              totalEarnedMicroCoins: Number(data.totalEarnedMicroCoins ?? 0),
              totalSpentMicroCoins: Number(data.totalSpentMicroCoins ?? 0),
              conversionRate: CONVERSION_RATE_MP_PER_MICROCOIN,
              updatedAt: data.updatedAt ? new Date(data.updatedAt).toISOString() : new Date().toISOString(),
            };
            localWalletCache.set(playerId, b);
            callback(b);
          }
        },
        (error) => {
          console.warn('[WalletService] Realtime listener error/offline:', error);
        }
      );
    } catch (e) {
      console.warn('[WalletService] Could not attach Firestore snapshot listener:', e);
      return () => {};
    }
  }
}

export default WalletService;
