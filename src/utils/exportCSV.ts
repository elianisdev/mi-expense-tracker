import { Transaction } from '@/lib/supabase';

export function exportToCSV(transactions: Transaction[], filename = 'expenses.csv') {
  const headers = ['Date', 'Category', 'Amount', 'Description'];

  const csvContent = [
    headers.join(','),
    ...transactions.map(t => [
      t.date,
      `"${t.category}"`,
      t.amount,
      `"${t.description.replace(/"/g, '""')}"`,
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
