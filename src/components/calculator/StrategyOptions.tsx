import type { PayoffStrategy } from '@/types/debt';

interface Props {
  fixedTotal: boolean;
  onFixedTotalChange: (v: boolean) => void;
  strategy: PayoffStrategy;
  onStrategyChange: (s: PayoffStrategy) => void;
}

export default function StrategyOptions({ fixedTotal, onFixedTotalChange, strategy, onStrategyChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-sm mb-1">Fixed total amount towards monthly payment?</h3>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1.5 text-sm cursor-pointer">
            <input type="radio" checked={fixedTotal} onChange={() => onFixedTotalChange(true)} className="accent-primary" />
            Yes
          </label>
          <label className="flex items-center gap-1.5 text-sm cursor-pointer">
            <input type="radio" checked={!fixedTotal} onChange={() => onFixedTotalChange(false)} className="accent-primary" />
            No
          </label>
        </div>
        <p className="text-xs text-muted-foreground mt-1 max-w-xl leading-relaxed">
          If &quot;Yes&quot; is chosen, after a debt has been paid off, the money that was being paid to that specific
          debt will be distributed towards paying off remaining debts (snowball/avalanche rollover). If &quot;No&quot; is chosen,
          the total amount allotted to monthly payments decreases as debts are paid off.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-1">Payoff strategy</h3>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1.5 text-sm cursor-pointer">
            <input type="radio" checked={strategy === 'avalanche'} onChange={() => onStrategyChange('avalanche')} className="accent-primary" />
            Avalanche <span className="text-muted-foreground">(highest interest first)</span>
          </label>
          <label className="flex items-center gap-1.5 text-sm cursor-pointer">
            <input type="radio" checked={strategy === 'snowball'} onChange={() => onStrategyChange('snowball')} className="accent-primary" />
            Snowball <span className="text-muted-foreground">(lowest balance first)</span>
          </label>
        </div>
      </div>
    </div>
  );
}
