import { Transaction } from '@/lib/supabase';
import { Charts } from './Charts';

interface ChartsSectionProps {
  transactions: Transaction[];
}

export function ChartsSection({ transactions }: ChartsSectionProps) {
  if (transactions.length === 0) return null;

  return <Charts transactions={transactions} />;
}
