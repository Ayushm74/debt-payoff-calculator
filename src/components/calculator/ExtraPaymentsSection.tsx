import type { ExtraPayments } from '@/types/debt';

interface Props {
  extraPayments: ExtraPayments;
  onChange: (ep: ExtraPayments) => void;
}

export default function ExtraPaymentsSection({ extraPayments, onChange }: Props) {
  const update = (field: keyof ExtraPayments, value: number) => {
    onChange({ ...extraPayments, [field]: value });
  };

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm">Extra payments:</h3>
      <div className="space-y-2 pl-1">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground text-sm">$</span>
            <input
              type="number"
              value={extraPayments.perMonth || ''}
              onChange={e => update('perMonth', parseFloat(e.target.value) || 0)}
              className="financial-input w-24 text-right"
              min="0"
            />
          </div>
          <span className="text-sm">per month</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground text-sm">$</span>
            <input
              type="number"
              value={extraPayments.perYear || ''}
              onChange={e => update('perYear', parseFloat(e.target.value) || 0)}
              className="financial-input w-24 text-right"
              min="0"
            />
          </div>
          <span className="text-sm">per year</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground text-sm">$</span>
            <input
              type="number"
              value={extraPayments.oneTime || ''}
              onChange={e => update('oneTime', parseFloat(e.target.value) || 0)}
              className="financial-input w-24 text-right"
              min="0"
            />
          </div>
          <span className="text-sm">of one-time payment made during the</span>
          <input
            type="number"
            value={extraPayments.oneTimeMonth || ''}
            onChange={e => update('oneTimeMonth', parseInt(e.target.value) || 0)}
            className="financial-input w-16 text-right"
            min="1"
          />
          <span className="text-sm">
            <sup>{getSuffix(extraPayments.oneTimeMonth)}</sup> month
          </span>
        </div>
      </div>
    </div>
  );
}

function getSuffix(n: number): string {
  if (n % 100 >= 11 && n % 100 <= 13) return 'th';
  switch (n % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}
