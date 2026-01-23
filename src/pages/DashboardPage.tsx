import { useState, useEffect } from 'react';
import { supabase, Transaction } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { TransactionForm } from '@/components/Dashboard/TransactionForm';
import { TransactionList } from '@/components/Dashboard/TransactionList';
import { Charts } from '@/components/Dashboard/Charts';
import { Filters } from '@/components/Dashboard/Filters';
import { StatsCards } from '@/components/Dashboard/StatsCards';
import { exportToCSV } from '@/utils/exportCSV';
import { toast } from 'sonner';
import { Plus, Download, LogOut, Wallet } from 'lucide-react';

export function DashboardPage() {
  const { user, signOut } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('all');

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  useEffect(() => {
    let filtered = [...transactions];

    if (startDate) {
      filtered = filtered.filter(t => t.date >= startDate);
    }

    if (endDate) {
      filtered = filtered.filter(t => t.date <= endDate);
    }

    if (category && category !== 'all') {
      filtered = filtered.filter(t => t.category === category);
    }

    setFilteredTransactions(filtered);
  }, [transactions, startDate, endDate, category]);

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!transactionToDelete) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionToDelete);

      if (error) throw error;
      toast.success('Transaction deleted successfully');
      fetchTransactions();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete transaction');
    } finally {
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
    }
  };

  const handleFormSuccess = () => {
    fetchTransactions();
    setSelectedTransaction(null);
  };

  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
    setCategory('all');
  };

  const handleExport = () => {
    exportToCSV(filteredTransactions);
    toast.success('Exported successfully');
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-cyan-50 to-violet-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-violet-50">
      <div className="border-b bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                  Expense Tracker
                </h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        <StatsCards transactions={filteredTransactions} />

        {transactions.length > 0 && <Charts transactions={filteredTransactions} />}

        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <h2 className="text-2xl font-bold">Transactions</h2>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              onClick={handleExport}
              variant="outline"
              className="flex-1 sm:flex-none bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border-blue-200"
              disabled={filteredTransactions.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={() => {
                setSelectedTransaction(null);
                setFormOpen(true);
              }}
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
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onCategoryChange={setCategory}
          onReset={handleResetFilters}
        />

        <TransactionList
          transactions={filteredTransactions}
          onEdit={handleEdit}
          onDelete={(id) => {
            setTransactionToDelete(id);
            setDeleteDialogOpen(true);
          }}
        />
      </div>

      <TransactionForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setSelectedTransaction(null);
        }}
        onSuccess={handleFormSuccess}
        transaction={selectedTransaction}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
