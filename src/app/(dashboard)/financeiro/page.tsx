import FinancialChart from "@/components/charts/financialChart";

const cards = [
  { title: "Receita Total", value: "R$ 128.450,00", variation: "+12,5%" },
  { title: "Despesas", value: "R$ 47.820,00", variation: "-4,2%" },
  { title: "Lucro Líquido", value: "R$ 80.630,00", variation: "+18,1%" },
  { title: "Contas a Receber", value: "R$ 32.900,00", variation: "+6,8%" },
];

const transactions = [
  {
    id: "001",
    descricao: "Venda de materiais elétricos",
    categoria: "Receita",
    data: "10/04/2026",
    valor: "R$ 12.500,00",
    status: "Recebido",
  },
  {
    id: "002",
    descricao: "Pagamento fornecedor",
    categoria: "Despesa",
    data: "12/04/2026",
    valor: "R$ 4.200,00",
    status: "Pago",
  },
  {
    id: "003",
    descricao: "Venda para cliente PJ",
    categoria: "Receita",
    data: "15/04/2026",
    valor: "R$ 18.750,00",
    status: "Pendente",
  },
];

const charts = [
  { label: "Jan", receita: 7000, despesa: 4200 },
  { label: "Fev", receita: 8400, despesa: 5100 },
  { label: "Mar", receita: 7600, despesa: 4700 },
  { label: "Abr", receita: 9200, despesa: 5600 },
  { label: "Mai", receita: 8800, despesa: 4900 },
  { label: "Jun", receita: 10300, despesa: 6200 },
];

export default function FinanceiroPage() {
  return (
    <main className="min-h-screen bg-fritz-stone-50 text-fritz-stone-900">
      <section className="border-b border-fritz-stone-200 bg-white px-8 py-6">
        <h1 className="text-3xl font-bold text-fritz-stone-950">
          Dashboard Financeira
        </h1>
        <p className="mt-1 text-sm text-fritz-stone-500">
          Visão geral dos indicadores financeiros da empresa.
        </p>
      </section>

      <section className="space-y-8 p-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-fritz-stone-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-fritz-stone-500">
                {card.title}
              </p>

              <div className="mt-4 flex items-end justify-between">
                <h2 className="text-2xl font-bold text-fritz-stone-950">
                  {card.value}
                </h2>

                <span className="rounded-full bg-fritz-green-50 px-3 py-1 text-xs font-bold text-fritz-bright-800">
                  {card.variation}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="rounded-2xl border border-fritz-stone-200 bg-white p-6 shadow-sm xl:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-fritz-stone-950">
                  Fluxo financeiro
                </h2>
                <p className="text-sm text-fritz-stone-500">
                  Receita x despesas dos últimos meses.
                </p>
              </div>

              <button className="rounded-xl bg-fritz-bright-700 px-4 py-2 text-sm font-semibold text-white hover:bg-fritz-bright-800">
                Exportar
              </button>
            </div>

            <FinancialChart charts={charts} />
          </div>

          <div className="rounded-2xl border border-fritz-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-fritz-stone-950">
              Resumo
            </h2>

            <div className="mt-6 space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-fritz-stone-500">Meta mensal</span>
                  <strong>78%</strong>
                </div>
                <div className="h-3 rounded-full bg-fritz-stone-100">
                  <div className="h-3 w-[78%] rounded-full bg-fritz-bright-700" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-fritz-stone-500">Recebimentos</span>
                  <strong>64%</strong>
                </div>
                <div className="h-3 rounded-full bg-fritz-stone-100">
                  <div className="h-3 w-[64%] rounded-full bg-fritz-green-600" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-fritz-stone-500">Despesas</span>
                  <strong>42%</strong>
                </div>
                <div className="h-3 rounded-full bg-fritz-stone-100">
                  <div className="h-3 w-[42%] rounded-full bg-fritz-yellow-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-fritz-stone-200 bg-white shadow-sm">
          <div className="border-b border-fritz-stone-200 p-6">
            <h2 className="text-xl font-bold text-fritz-stone-950">
              Últimas movimentações
            </h2>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-fritz-stone-100 text-left">
              <tr>
                <th className="px-6 py-4">Código</th>
                <th className="px-6 py-4">Descrição</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Valor</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-fritz-stone-200 hover:bg-fritz-green-50"
                >
                  <td className="px-6 py-4 font-semibold">{item.id}</td>
                  <td className="px-6 py-4">{item.descricao}</td>
                  <td className="px-6 py-4">{item.categoria}</td>
                  <td className="px-6 py-4">{item.data}</td>
                  <td className="px-6 py-4 font-bold">{item.valor}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-fritz-green-50 px-3 py-1 text-xs font-bold text-fritz-bright-800">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
