import type { PayoffResult } from '@/types/debt';

export function exportToCSV(result: PayoffResult): void {
  const headers = ['Month', 'Date', 'Total Payment', 'Total Remaining', 'Total Interest'];
  const rows = result.schedule.map(s => [
    s.month,
    s.date,
    s.totalPayment.toFixed(2),
    s.totalRemaining.toFixed(2),
    s.totalInterest.toFixed(2),
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'debt-payoff-schedule.csv';
  a.click();
  URL.revokeObjectURL(url);
}
