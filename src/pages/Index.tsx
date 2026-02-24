import { useState, useCallback, useEffect } from 'react';
import type { DebtEntry, ExtraPayments, PayoffStrategy, PayoffResult } from '@/types/debt';
import { calculatePayoff } from '@/utils/debtCalculations';
import { exportToCSV } from '@/utils/csvExport';
import DebtInputTable from '@/components/calculator/DebtInputTable';
import ExtraPaymentsSection from '@/components/calculator/ExtraPaymentsSection';
import StrategyOptions from '@/components/calculator/StrategyOptions';
import ResultsSummary from '@/components/calculator/ResultsSummary';
import PayoffChart from '@/components/calculator/PayoffChart';
import AmortizationTable from '@/components/calculator/AmortizationTable';
import SEOContent from '@/components/calculator/SEOContent';
import { Calculator, RotateCcw, Download, Info } from 'lucide-react';

const defaultDebts: DebtEntry[] = [
  { id: '1', name: 'Auto loan', balance: 25000, minPayment: 519, interestRate: 4.9 },
  { id: '2', name: 'Home mortgage', balance: 250000, minPayment: 1800, interestRate: 4 },
  { id: '3', name: 'Credit card 1', balance: 6000, minPayment: 150, interestRate: 18.99 },
  { id: '4', name: 'Credit card 2', balance: 3000, minPayment: 60, interestRate: 16.99 },
  { id: '5', name: '', balance: 0, minPayment: 0, interestRate: 0 },
  { id: '6', name: '', balance: 0, minPayment: 0, interestRate: 0 },
];

const defaultExtra: ExtraPayments = { perMonth: 100, perYear: 0, oneTime: 0, oneTimeMonth: 5 };

function loadFromStorage(): { debts: DebtEntry[]; extra: ExtraPayments; fixed: boolean; strategy: PayoffStrategy } | null {
  try {
    const saved = localStorage.getItem('debtCalcState');
    return saved ? JSON.parse(saved) : null;
  } catch { return null; }
}

const Index = () => {
  const saved = loadFromStorage();
  const [debts, setDebts] = useState<DebtEntry[]>(saved?.debts || defaultDebts);
  const [extraPayments, setExtraPayments] = useState<ExtraPayments>(saved?.extra || defaultExtra);
  const [fixedTotal, setFixedTotal] = useState(saved?.fixed ?? true);
  const [strategy, setStrategy] = useState<PayoffStrategy>(saved?.strategy || 'avalanche');
  const [result, setResult] = useState<PayoffResult | null>(null);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('debtCalcState', JSON.stringify({ debts, extra: extraPayments, fixed: fixedTotal, strategy }));
    } catch {}
  }, [debts, extraPayments, fixedTotal, strategy]);

  const handleCalculate = useCallback(() => {
    const r = calculatePayoff(debts, extraPayments, fixedTotal, strategy);
    setResult(r);
    if (r) {
      setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [debts, extraPayments, fixedTotal, strategy]);

  const handleClear = () => {
    setDebts(defaultDebts);
    setExtraPayments(defaultExtra);
    setFixedTotal(true);
    setStrategy('avalanche');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="financial-header py-3">
        <div className="container max-w-4xl mx-auto px-4 flex items-center gap-2">
          <Calculator size={22} />
          <span className="font-bold text-lg tracking-tight">Debt Payoff Calculator Easy</span>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="container max-w-4xl mx-auto px-4 py-2 text-xs text-muted-foreground">
        <span className="financial-link">home</span> / <span className="financial-link">financial</span> / <span>debt payoff calculator</span>
      </div>

      <main className="container max-w-4xl mx-auto px-4 pb-16">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">Debt Payoff Calculator</h1>
        <p className="text-sm text-muted-foreground mb-4 max-w-2xl leading-relaxed">
          Estimate how long it will take to pay off your debts. Compare avalanche and snowball strategies,
          add extra payments, and see your complete payoff schedule.
        </p>

        {/* Info banner */}
        <div className="financial-banner rounded-md px-4 py-2.5 mb-6 flex items-center gap-2 text-sm">
          <Info size={16} className="shrink-0" />
          Modify the values and click the Calculate button to use
        </div>

        {/* Calculator form */}
        <div className="bg-card rounded-lg border border-border p-4 md:p-6 space-y-6 shadow-sm">
          <DebtInputTable debts={debts} onChange={setDebts} />
          <div className="border-t border-border pt-4">
            <ExtraPaymentsSection extraPayments={extraPayments} onChange={setExtraPayments} />
          </div>
          <div className="border-t border-border pt-4">
            <StrategyOptions
              fixedTotal={fixedTotal}
              onFixedTotalChange={setFixedTotal}
              strategy={strategy}
              onStrategyChange={setStrategy}
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button onClick={handleCalculate} className="financial-cta flex items-center gap-2">
              <Calculator size={16} /> Calculate
            </button>
            <button onClick={handleClear} className="financial-cta-secondary flex items-center gap-2">
              <RotateCcw size={14} /> Clear
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div id="results" className="mt-8 space-y-8">
            <ResultsSummary result={result} />
            <PayoffChart result={result} />
            <AmortizationTable result={result} />
            <div className="flex gap-3">
              <button onClick={() => exportToCSV(result)} className="financial-cta-secondary flex items-center gap-2 text-sm">
                <Download size={14} /> Export to CSV
              </button>
            </div>
          </div>
        )}

        {/* Related */}
        <div className="mt-10 pt-6 border-t border-border">
          <h3 className="font-serif font-bold text-foreground mb-3">Related</h3>
          <div className="flex gap-2 flex-wrap">
            <span className="financial-cta text-xs cursor-pointer">Debt Consolidation Calculator</span>
            <span className="financial-cta text-xs cursor-pointer">Payment Calculator</span>
            <span className="financial-cta text-xs cursor-pointer">Mortgage Calculator</span>
          </div>
        </div>

        <SEOContent />
      </main>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialProduct",
            "name": "Debt Payoff Calculator",
            "description": "Free debt payoff calculator to estimate how long it will take to pay off loans and credit cards. Compare avalanche and snowball methods.",
            "provider": {
              "@type": "Organization",
              "name": "Debt Payoff Calculator Easy"
            },
            "url": "https://debtfreecalculator.com/debt-payoff-calculator"
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Which debt payoff method saves the most money?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The Debt Avalanche method saves the most money because it targets high-interest debt first, minimizing the total interest paid over time."
                }
              },
              {
                "@type": "Question",
                "name": "Should I pay off debt or save money?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Financial experts recommend building a small emergency fund first, then aggressively paying off high-interest debt above 6-7%."
                }
              },
              {
                "@type": "Question",
                "name": "How much extra should I pay on my debt each month?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Any amount helps. Even $25-$50 extra per month can save significant interest over time."
                }
              }
            ]
          })
        }}
      />
    </div>
  );
};

export default Index;
