import { useState } from 'react';
import type { DebtEntry } from '@/types/debt';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  debts: DebtEntry[];
  onChange: (debts: DebtEntry[]) => void;
}

let nextId = 7;

export default function DebtInputTable({ debts, onChange }: Props) {
  const [showMore, setShowMore] = useState(false);

  const updateDebt = (id: string, field: keyof DebtEntry, value: string | number) => {
    onChange(debts.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const addRow = () => {
    onChange([...debts, { id: String(nextId++), name: '', balance: 0, minPayment: 0, interestRate: 0 }]);
  };

  const removeRow = (id: string) => {
    if (debts.length <= 1) return;
    onChange(debts.filter(d => d.id !== id));
  };

  const visibleDebts = showMore ? debts : debts.slice(0, 4);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="financial-table-header">
              <th className="text-left py-2 px-2 font-semibold w-8">#</th>
              <th className="text-left py-2 px-2 font-semibold">Debt name</th>
              <th className="text-center py-2 px-2 font-semibold">Remaining<br/>balance</th>
              <th className="text-center py-2 px-2 font-semibold">Monthly or min.<br/>payment</th>
              <th className="text-center py-2 px-2 font-semibold">Interest rate</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {visibleDebts.map((debt, i) => (
              <tr key={debt.id} className={i % 2 === 1 ? 'financial-table-alt' : ''}>
                <td className="py-1.5 px-2 text-muted-foreground">{i + 1}.</td>
                <td className="py-1.5 px-1">
                  <input
                    type="text"
                    value={debt.name}
                    onChange={e => updateDebt(debt.id, 'name', e.target.value)}
                    className="financial-input w-full"
                    placeholder="Debt name"
                  />
                </td>
                <td className="py-1.5 px-1">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">$</span>
                    <input
                      type="number"
                      value={debt.balance || ''}
                      onChange={e => updateDebt(debt.id, 'balance', parseFloat(e.target.value) || 0)}
                      className="financial-input w-full text-right"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </td>
                <td className="py-1.5 px-1">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">$</span>
                    <input
                      type="number"
                      value={debt.minPayment || ''}
                      onChange={e => updateDebt(debt.id, 'minPayment', parseFloat(e.target.value) || 0)}
                      className="financial-input w-full text-right"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </td>
                <td className="py-1.5 px-1">
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={debt.interestRate || ''}
                      onChange={e => updateDebt(debt.id, 'interestRate', parseFloat(e.target.value) || 0)}
                      className="financial-input w-full text-right"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                    <span className="text-muted-foreground">%</span>
                  </div>
                </td>
                <td className="py-1.5 px-1">
                  {debts.length > 1 && (
                    <button onClick={() => removeRow(debt.id)} className="text-muted-foreground hover:text-destructive p-1" aria-label="Remove debt">
                      <Trash2 size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 mt-2">
        {debts.length > 4 && (
          <button onClick={() => setShowMore(!showMore)} className="financial-link text-sm">
            {showMore ? 'Show fewer rows' : `Show more input fields (${debts.length - 4} hidden)`}
          </button>
        )}
        <button onClick={addRow} className="financial-link text-sm flex items-center gap-1">
          <Plus size={14} /> Add row
        </button>
      </div>
    </div>
  );
}
