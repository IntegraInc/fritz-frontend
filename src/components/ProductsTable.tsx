"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { Product } from "@/types/product";

type ProductsTableProps = {
  data: Product[];
};

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "id",
    header: "Código",
  },
  {
    accessorKey: "description",
    header: "Descrição",
  },
  {
    accessorKey: "price",
    header: "Preço",
    cell: ({ row }) => (
      <span className="rounded-full bg-fritz-bright-100 px-3 py-1 text-sm font-bold text-fritz-bright-800">
        R$ {row.original.price.toFixed(2)}
      </span>
    ),
  },
];

export function ProductsTable({ data }: ProductsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="rounded-2xl border border-fritz-stone-200 bg-white shadow-sm">
      <div className="flex gap-4 border-b border-fritz-stone-200 p-5">
        <input
          placeholder="Buscar por código ou descrição..."
          className="flex-1 rounded-xl border border-fritz-stone-200 px-4 py-3 text-sm outline-none transition placeholder:text-fritz-stone-400 focus:border-fritz-bright-600 focus:ring-2 focus:ring-fritz-bright-100"
        />

        <button className="rounded-xl border border-fritz-bright-700 px-5 py-3 text-sm font-semibold text-fritz-bright-800 transition hover:bg-fritz-bright-50">
          Exportar
        </button>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead className="bg-fritz-stone-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="cursor-pointer px-6 py-4 text-left font-bold text-fritz-stone-800"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}

                  {{
                    asc: " ↑",
                    desc: " ↓",
                  }[header.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-t border-fritz-stone-200 transition hover:bg-fritz-green-50"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4 text-fritz-stone-700">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t border-fritz-stone-200 px-6 py-4 text-sm text-fritz-stone-500">
        Mostrando {data.length} produtos
      </div>
    </div>
  );
}