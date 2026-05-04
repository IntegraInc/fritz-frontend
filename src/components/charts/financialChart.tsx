"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartPoint = {
  label: string;
  receita: number;
  despesa: number;
};

type FinancialChartProps = {
  charts: ChartPoint[];
};

export default function FinancialChart({ charts }: FinancialChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={charts}>
          <CartesianGrid stroke="#edf0e5" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={42} />
          <Tooltip />
          <Bar dataKey="receita" fill="#51831b" radius={[8, 8, 0, 0]} />
          <Bar dataKey="despesa" fill="#dca923" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
