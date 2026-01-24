import { Transaction } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Calendar, Receipt } from 'lucide-react';
import { startOfMonth, endOfMonth } from 'date-fns';
import { calculateTotalBalance } from '@/utils/transactions';

interface StatsCardsProps {
  transactions: Transaction[];
}

export function StatsCards({ transactions }: StatsCardsProps) {
  const totalExpenses = calculateTotalBalance(transactions);

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const thisMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date >= monthStart && date <= monthEnd;
  });

  const monthlyExpenses = thisMonthTransactions.reduce(
    (sum, t) => sum + parseFloat(t.amount.toString()),
    0
  );

  const avgExpense = transactions.length > 0
    ? totalExpenses / transactions.length
    : 0;

  const stats = [
    {
      title: 'Total Expenses',
      value: `$${totalExpenses.toFixed(2)}`,
      icon: DollarSign,
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50',
    },
    {
      title: 'This Month',
      value: `$${monthlyExpenses.toFixed(2)}`,
      icon: Calendar,
      gradient: 'from-cyan-500 to-blue-500',
      bgGradient: 'from-cyan-50 to-blue-50',
    },
    {
      title: 'Average Transaction',
      value: `$${avgExpense.toFixed(2)}`,
      icon: TrendingUp,
      gradient: 'from-violet-500 to-purple-500',
      bgGradient: 'from-violet-50 to-purple-50',
    },
    {
      title: 'Total Transactions',
      value: transactions.length.toString(),
      icon: Receipt,
      gradient: 'from-pink-500 to-rose-500',
      bgGradient: 'from-pink-50 to-rose-50',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className={`border-0 shadow-lg bg-gradient-to-br ${stat.bgGradient} overflow-hidden relative`}>
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <Icon className="w-full h-full" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
                <div className={`p-3 rounded-full bg-gradient-to-br ${stat.gradient}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
