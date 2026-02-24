import { lazy, Suspense } from 'react';
import type { PayoffResult } from '@/types/debt';

const LazyChart = lazy(() => import('./PayoffChartInner'));

interface Props {
  result: PayoffResult;
}

export default function PayoffChart({ result }: Props) {
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-serif font-bold text-foreground">Remaining Debt Over Time</h2>
      <Suspense fallback={<div className="h-64 financial-result animate-pulse rounded-md" />}>
        <LazyChart data={result.chartData} />
      </Suspense>
    </div>
  );
}
