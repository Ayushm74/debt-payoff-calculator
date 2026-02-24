import type { DebtEntry, ExtraPayments, PayoffStrategy, PayoffResult, MonthlySnapshot } from '@/types/debt';

function formatDate(monthsFromNow: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + monthsFromNow);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function calculatePayoff(
  debts: DebtEntry[],
  extraPayments: ExtraPayments,
  fixedTotal: boolean,
  strategy: PayoffStrategy
): PayoffResult | null {
  const activeDebts = debts.filter(d => d.balance > 0 && d.minPayment > 0);
  if (activeDebts.length === 0) return null;

  // Clone balances
  const balances = new Map<string, number>();
  activeDebts.forEach(d => balances.set(d.id, d.balance));

  const rates = new Map<string, number>();
  activeDebts.forEach(d => rates.set(d.id, d.interestRate / 100 / 12));

  const minPayments = new Map<string, number>();
  activeDebts.forEach(d => minPayments.set(d.id, d.minPayment));

  const totalMinPayment = activeDebts.reduce((s, d) => s + d.minPayment, 0);
  const totalFixedPayment = totalMinPayment + extraPayments.perMonth;

  const schedule: MonthlySnapshot[] = [];
  const payoffOrder: PayoffResult['payoffOrder'] = [];
  const chartData: PayoffResult['chartData'] = [];
  let totalInterestPaid = 0;
  let month = 0;
  const maxMonths = 1200; // 100 years cap

  // Sort order for extra payment allocation
  const getSortedIds = (): string[] => {
    const ids = activeDebts.map(d => d.id).filter(id => (balances.get(id) || 0) > 0);
    if (strategy === 'avalanche') {
      ids.sort((a, b) => (rates.get(b) || 0) - (rates.get(a) || 0));
    } else {
      ids.sort((a, b) => (balances.get(a) || 0) - (balances.get(b) || 0));
    }
    return ids;
  };

  while (month < maxMonths) {
    const remaining = Array.from(balances.values()).reduce((s, b) => s + b, 0);
    if (remaining <= 0.01) break;

    month++;
    const monthDebts: MonthlySnapshot['debts'] = [];
    let monthTotalPayment = 0;
    let monthTotalInterest = 0;

    // Calculate interest first
    const interestCharges = new Map<string, number>();
    for (const debt of activeDebts) {
      const bal = balances.get(debt.id) || 0;
      if (bal <= 0) continue;
      const interest = bal * (rates.get(debt.id) || 0);
      interestCharges.set(debt.id, interest);
    }

    // Determine available extra payment
    let extraThisMonth = extraPayments.perMonth;
    if (month === extraPayments.oneTimeMonth) {
      extraThisMonth += extraPayments.oneTime;
    }
    if (extraPayments.perYear > 0 && month % 12 === 0) {
      extraThisMonth += extraPayments.perYear;
    }

    // If fixedTotal, extra comes from freed-up payments of paid-off debts
    let availableExtra = extraThisMonth;
    if (fixedTotal) {
      // Add freed payments from paid-off debts
      for (const debt of activeDebts) {
        const bal = balances.get(debt.id) || 0;
        if (bal <= 0) {
          availableExtra += minPayments.get(debt.id) || 0;
        }
      }
      // Remove the base extra (already included in totalFixedPayment logic)
    }

    // Pay minimums first
    const paidDebts = new Map<string, { payment: number; interest: number; principal: number }>();

    for (const debt of activeDebts) {
      const bal = balances.get(debt.id) || 0;
      if (bal <= 0) {
        paidDebts.set(debt.id, { payment: 0, interest: 0, principal: 0 });
        continue;
      }
      const interest = interestCharges.get(debt.id) || 0;
      const minPay = Math.min(minPayments.get(debt.id) || 0, bal + interest);
      const principal = Math.max(0, minPay - interest);
      paidDebts.set(debt.id, { payment: minPay, interest, principal });
    }

    // Distribute extra payments based on strategy
    const sortedIds = getSortedIds();
    let remainingExtra = availableExtra;

    for (const id of sortedIds) {
      if (remainingExtra <= 0) break;
      const bal = balances.get(id) || 0;
      if (bal <= 0) continue;
      const paid = paidDebts.get(id)!;
      const owedAfterMin = bal + paid.interest - paid.payment;
      if (owedAfterMin <= 0) continue;
      const extraPay = Math.min(remainingExtra, owedAfterMin);
      paid.payment += extraPay;
      paid.principal += extraPay;
      remainingExtra -= extraPay;
      paidDebts.set(id, paid);
    }

    // Apply payments
    for (const debt of activeDebts) {
      const bal = balances.get(debt.id) || 0;
      const paid = paidDebts.get(debt.id)!;
      const interest = interestCharges.get(debt.id) || 0;

      const newBal = Math.max(0, bal + interest - paid.payment);
      balances.set(debt.id, newBal);

      monthTotalPayment += paid.payment;
      monthTotalInterest += interest;
      totalInterestPaid += interest;

      monthDebts.push({
        name: debt.name,
        payment: paid.payment,
        principal: paid.principal,
        interest: interest,
        remainingBalance: newBal,
      });

      // Check if just paid off
      if (bal > 0 && newBal <= 0.01) {
        payoffOrder.push({ name: debt.name, month, date: formatDate(month) });
      }
    }

    const totalRemaining = Array.from(balances.values()).reduce((s, b) => s + b, 0);

    schedule.push({
      month,
      date: formatDate(month),
      debts: monthDebts,
      totalPayment: monthTotalPayment,
      totalRemaining,
      totalInterest: monthTotalInterest,
    });

    chartData.push({
      month,
      remaining: Math.round(totalRemaining * 100) / 100,
      interest: Math.round(totalInterestPaid * 100) / 100,
    });
  }

  return {
    totalMonths: month,
    totalInterestPaid: Math.round(totalInterestPaid * 100) / 100,
    payoffDate: formatDate(month),
    payoffOrder,
    schedule,
    chartData,
  };
}
