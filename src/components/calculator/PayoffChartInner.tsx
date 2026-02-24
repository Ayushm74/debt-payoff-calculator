import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart } from 'recharts';

interface Props {
  data: { month: number; remaining: number; interest: number }[];
}

export default function PayoffChartInner({ data }: Props) {
  const formatter = (value: number) => `$${value.toLocaleString()}`;

  return (
    <div className="financial-result">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <defs>
            <linearGradient id="remainingGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(210, 70%, 28%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(210, 70%, 28%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="interestGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 25%, 88%)" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} label={{ value: 'Month', position: 'insideBottom', offset: -2, fontSize: 12 }} />
          <YAxis tickFormatter={formatter} tick={{ fontSize: 11 }} width={80} />
          <Tooltip formatter={formatter} labelFormatter={l => `Month ${l}`} />
          <Area type="monotone" dataKey="remaining" stroke="hsl(210, 70%, 28%)" fill="url(#remainingGrad)" strokeWidth={2} name="Remaining Balance" />
          <Area type="monotone" dataKey="interest" stroke="hsl(0, 72%, 51%)" fill="url(#interestGrad)" strokeWidth={1.5} name="Cumulative Interest" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
