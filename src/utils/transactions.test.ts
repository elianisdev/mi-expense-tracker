import { describe, expect, it } from 'vitest';
import { calculateTotalBalance, filterTransactionsByCategory, isValidAmount } from './transactions';
import type { Transaction } from '@/lib/supabase';

const baseTransaction = (overrides: Partial<Transaction> = {}): Transaction => ({
  id: 'tx-1',
  user_id: 'user-1',
  amount: 0,
  category: 'Food & Dining',
  date: '2024-01-01',
  description: '',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

describe('transactions utils', () => {
  it('calcula correctamente el balance total', () => {
    const transactions: Transaction[] = [
      baseTransaction({ id: 'tx-1', amount: 120.5 }),
      baseTransaction({ id: 'tx-2', amount: 79.25 }),
      baseTransaction({ id: 'tx-3', amount: 0.25 }),
    ];

    expect(calculateTotalBalance(transactions)).toBeCloseTo(200);
  });

  it('rechaza montos negativos o no numéricos', () => {
    expect(isValidAmount(-10)).toBe(false);
    expect(isValidAmount(0)).toBe(false);
    expect(isValidAmount(Number.NaN)).toBe(false);
    expect(isValidAmount(25.5)).toBe(true);
  });

  it('filtra por categoría respetando la opción "all"', () => {
    const transactions: Transaction[] = [
      baseTransaction({ id: 'tx-1', category: 'Food & Dining' }),
      baseTransaction({ id: 'tx-2', category: 'Travel' }),
      baseTransaction({ id: 'tx-3', category: 'Travel' }),
    ];

    const travel = filterTransactionsByCategory(transactions, 'Travel');
    const all = filterTransactionsByCategory(transactions, 'all');

    expect(travel).toHaveLength(2);
    expect(travel.every((t) => t.category === 'Travel')).toBe(true);
    expect(all).toHaveLength(3);
  });

  it('retorna 0 de balance para listas vacías', () => {
    expect(calculateTotalBalance([])).toBe(0);
  });

  it('mantiene todas las transacciones cuando la categoría es vacía', () => {
    const transactions: Transaction[] = [
      baseTransaction({ id: 'tx-1', category: 'Food & Dining' }),
      baseTransaction({ id: 'tx-2', category: 'Travel' }),
    ];

    const result = filterTransactionsByCategory(transactions, '');
    expect(result).toHaveLength(2);
  });

  it('rechaza infinito y acepta decimales positivos válidos', () => {
    expect(isValidAmount(Number.POSITIVE_INFINITY)).toBe(false);
    expect(isValidAmount(0.01)).toBe(true);
  });
});
