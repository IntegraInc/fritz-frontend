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
  // Função para deixar o número bonito no gráfico (Ex: 12.000)
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat("pt-BR").format(valor);
  };

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={charts}>
          <CartesianGrid stroke="#edf0e5" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          
          <YAxis 
            tickLine={false} 
            axisLine={false} 
            width={75} 
            tickFormatter={formatarValor}
            tick={{ fill: "#78716c", fontSize: 12 }}
          />
          
          {/* Tipagem ajustada (any) para satisfazer o TypeScript da biblioteca Recharts */}
          <Tooltip 
            formatter={(value: any, name: any) => [
              `R$ ${formatarValor(Number(value))}`, 
              name === "receita" ? "Receita" : "Despesa"
            ]}
            separator=": "
            cursor={{ fill: "#f5f5f4" }} 
          />
          
          <Bar dataKey="receita" fill="#51831b" radius={[8, 8, 0, 0]} />
          <Bar dataKey="despesa" fill="#dca923" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}