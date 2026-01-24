import { Transaction } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Filters } from './Filters';
import { TransactionList } from './TransactionList';
import { Plus, Download } from 'lucide-react';

interface TransactionsSectionProps {
  transactions: Transaction[];
  startDate: string;
  endDate: string;
  category: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onResetFilters: () => void;
  onExport: () => void;
  onAddTransaction: () => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionsSection({
  transactions,
  startDate,
  endDate,
  category,
  onStartDateChange,
  onEndDateChange,
  onCategoryChange,
  onResetFilters,
  onExport,
  onAddTransaction,
  onEdit,
  onDelete,
}: TransactionsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            onClick={onExport}
            variant="outline"
            className="flex-1 sm:flex-none bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border-blue-200"
            disabled={transactions.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button
            onClick={onAddTransaction}
            className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      <Filters
        startDate={startDate}
        endDate={endDate}
        category={category}
        onStartDateChange={onStartDateChange}
        onEndDateChange={onEndDateChange}
        onCategoryChange={onCategoryChange}
        onReset={onResetFilters}
      />

      <TransactionList transactions={transactions} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}
