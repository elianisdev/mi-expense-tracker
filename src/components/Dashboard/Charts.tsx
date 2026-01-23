import { Transaction } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

interface ChartsProps {
  transactions: Transaction[];
}

const COLORS = [
  '#10b981', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b',
  '#ef4444', '#3b82f6', '#14b8a6', '#f97316', '#6366f1'
];

export function Charts({ transactions }: ChartsProps) {
  const categoryData = transactions.reduce((acc, transaction) => {
    const category = transaction.category;
    const amount = parseFloat(transaction.amount.toString());
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  }));

  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);
  const days = eachDayOfInterval({ start, end });

  const dailyData = days.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayTransactions = transactions.filter(t => t.date === dayStr);
    const total = dayTransactions.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
    return {
      date: format(day, 'MMM dd'),
      amount: parseFloat(total.toFixed(2)),
    };
  });

  const monthlyByCategory = Object.entries(categoryData).map(([category, amount]) => ({
    category,
    amount: parseFloat(amount.toFixed(2)),
  })).sort((a, b) => b.amount - a.amount).slice(0, 5);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-emerald-50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value}`} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-cyan-50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Daily Spending (This Month)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `$${value}`} />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ fill: '#06b6d4', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-violet-50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Top 5 Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="category" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `$${value}`} />
              <Bar dataKey="amount" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
