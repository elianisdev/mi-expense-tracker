import { Transaction } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Food & Dining': 'bg-orange-100 text-orange-700 border-orange-200',
      'Transportation': 'bg-blue-100 text-blue-700 border-blue-200',
      'Shopping': 'bg-pink-100 text-pink-700 border-pink-200',
      'Entertainment': 'bg-purple-100 text-purple-700 border-purple-200',
      'Bills & Utilities': 'bg-red-100 text-red-700 border-red-200',
      'Healthcare': 'bg-green-100 text-green-700 border-green-200',
      'Education': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'Travel': 'bg-cyan-100 text-cyan-700 border-cyan-200',
      'Groceries': 'bg-lime-100 text-lime-700 border-lime-200',
      'Other': 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[category] || colors['Other'];
  };

  if (transactions.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground text-lg">No transactions found</p>
        <p className="text-sm text-muted-foreground mt-2">Add your first transaction to get started</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="font-semibold text-right">Amount</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium">
                  {format(new Date(transaction.date), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(transaction.category)}`}>
                    {transaction.category}
                  </span>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {transaction.description || '-'}
                </TableCell>
                <TableCell className="text-right font-semibold text-lg">
                  ${parseFloat(transaction.amount.toString()).toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(transaction)}
                      className="hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(transaction.id)}
                      className="hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
