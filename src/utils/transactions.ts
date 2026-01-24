import { Transaction } from '@/lib/supabase';

export function calculateTotalBalance(transactions: Transaction[]): number {
  return transactions.reduce((sum, transaction) => sum + Number(transaction.amount), 0);
}

export function isValidAmount(amount: number): boolean {
  return Number.isFinite(amount) && amount > 0;
}

export function filterTransactionsByCategory(
  transactions: Transaction[],
  category: string
): Transaction[] {
  if (!category || category === 'all') return transactions;
  return transactions.filter((transaction) => transaction.category === category);
}
