import type { PayoffResult } from '@/types/debt';
import { Calendar, DollarSign, Clock, ListOrdered } from 'lucide-react';

interface Props {
  result: PayoffResult;
}

export default function ResultsSummary({ result }: Props) {
  const years = Math.floor(result.totalMonths / 12);
  const months = result.totalMonths % 12;
  const timeStr = years > 0 ? `${years} year${years > 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}` : `${months} month${months !== 1 ? 's' : ''}`;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-serif font-bold text-foreground">Results</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="financial-result flex items-start gap-3">
          <Clock className="text-accent mt-0.5 shrink-0" size={20} />
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Total Payoff Time</p>
            <p className="text-lg font-bold text-foreground">{result.totalMonths} months</p>
            <p className="text-xs text-muted-foreground">{timeStr}</p>
          </div>
        </div>

        <div className="financial-result flex items-start gap-3">
          <DollarSign className="text-accent mt-0.5 shrink-0" size={20} />
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Total Interest Paid</p>
            <p className="text-lg font-bold text-foreground">${result.totalInterestPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="financial-result flex items-start gap-3">
          <Calendar className="text-accent mt-0.5 shrink-0" size={20} />
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Payoff Date</p>
            <p className="text-lg font-bold text-foreground">{result.payoffDate}</p>
          </div>
        </div>

        <div className="financial-result flex items-start gap-3">
          <ListOrdered className="text-accent mt-0.5 shrink-0" size={20} />
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Payoff Order</p>
            <ol className="text-sm space-y-0.5 mt-1">
              {result.payoffOrder.map((p, i) => (
                <li key={i} className="text-foreground">
                  <span className="font-semibold">{i + 1}.</span> {p.name} <span className="text-muted-foreground text-xs">({p.date})</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
