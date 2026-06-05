"use client";

import { useState } from "react";

export type Transaction = {
  id: string;
  descricao: string;
  categoria: string;
  data: string;
  valor: string;
  status: string;
};

type SortConfig = {
  key: keyof Transaction | null;
  direction: "asc" | "desc";
};

type TransactionsTableProps = {
  data: Transaction[];
};

export function TransactionsTable({ data }: TransactionsTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: "asc" });

  function handleSort(key: keyof Transaction) {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  }

  const transactionsOrdenadas = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let aValue: any = a[sortConfig.key];
    let bValue: any = b[sortConfig.key];

    if (sortConfig.key === 'valor') {
      aValue = parseFloat(aValue.replace('R$ ', '').replace('.', '').replace(',', '.'));
      bValue = parseFloat(bValue.replace('R$ ', '').replace('.', '').replace(',', '.'));
    }

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const ThOrdenavel = ({ label, sortKey }: { label: string, sortKey: keyof Transaction }) => {
    const isSorted = sortConfig.key === sortKey;
    return (
      <th 
        onClick={() => handleSort(sortKey)}
        className="px-6 py-4 cursor-pointer select-none whitespace-nowrap hover:bg-fritz-stone-200/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span>{label}</span>
          <div className="flex flex-col shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`${isSorted && sortConfig.direction === 'asc' ? 'text-fritz-bright-700' : 'text-fritz-stone-400 opacity-50'}`}>
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`-mt-[2px] ${isSorted && sortConfig.direction === 'desc' ? 'text-fritz-bright-700' : 'text-fritz-stone-400 opacity-50'}`}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      </th>
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-sm text-fritz-stone-700">
        <thead className="bg-fritz-stone-100/50 text-xs font-semibold uppercase tracking-wider text-fritz-stone-500">
          <tr className="border-b border-fritz-stone-200">
            <ThOrdenavel label="Código" sortKey="id" />
            <ThOrdenavel label="Descrição" sortKey="descricao" />
            <ThOrdenavel label="Categoria" sortKey="categoria" />
            <ThOrdenavel label="Data" sortKey="data" />
            <ThOrdenavel label="Valor" sortKey="valor" />
            <th className="px-6 py-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-fritz-stone-100">
          {transactionsOrdenadas.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-fritz-green-800/5 transition-colors cursor-default">
              <td className="px-6 py-4 font-semibold text-fritz-stone-900 whitespace-nowrap">{transaction.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{transaction.descricao}</td>
              <td className="px-6 py-4 whitespace-nowrap">{transaction.categoria}</td>
              <td className="px-6 py-4 whitespace-nowrap">{transaction.data}</td>
              <td className="px-6 py-4 font-bold whitespace-nowrap text-fritz-stone-900">{transaction.valor}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="rounded-full bg-fritz-green-50 border border-fritz-bright-100 px-3 py-1 text-xs font-bold text-fritz-bright-700">
                  {transaction.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="border-t border-fritz-stone-100 px-6 py-4 text-sm text-fritz-stone-500 bg-white">
        Mostrando <span className="font-semibold text-fritz-stone-900">{data.length}</span> movimentações
      </div>
    </div>
  );
}