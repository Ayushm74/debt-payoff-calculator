import { useState } from 'react';
import type { PayoffResult } from '@/types/debt';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  result: PayoffResult;
}

export default function AmortizationTable({ result }: Props) {
  const [expanded, setExpanded] = useState(false);
  const rows = expanded ? result.schedule : result.schedule.slice(0, 12);

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-serif font-bold text-foreground">Amortization Schedule</h2>
      <div className="overflow-x-auto financial-result p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="financial-table-header">
              <th className="text-left py-2 px-3 font-semibold">Month</th>
              <th className="text-left py-2 px-3 font-semibold">Date</th>
              <th className="text-right py-2 px-3 font-semibold">Payment</th>
              <th className="text-right py-2 px-3 font-semibold">Interest</th>
              <th className="text-right py-2 px-3 font-semibold">Remaining</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s, i) => (
              <tr key={s.month} className={i % 2 === 1 ? 'financial-table-alt' : ''}>
                <td className="py-1.5 px-3">{s.month}</td>
                <td className="py-1.5 px-3">{s.date}</td>
                <td className="py-1.5 px-3 text-right">${s.totalPayment.toFixed(2)}</td>
                <td className="py-1.5 px-3 text-right">${s.totalInterest.toFixed(2)}</td>
                <td className="py-1.5 px-3 text-right font-medium">${s.totalRemaining.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {result.schedule.length > 12 && (
        <button onClick={() => setExpanded(!expanded)} className="financial-link text-sm flex items-center gap-1">
          {expanded ? <><ChevronUp size={14} /> Show less</> : <><ChevronDown size={14} /> Show all {result.schedule.length} months</>}
        </button>
      )}
    </div>
  );
}
