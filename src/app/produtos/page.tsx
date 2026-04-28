import { Sidebar } from "@/components/Sidebar";
import { ProductsTable } from "@/components/ProductsTable";
import { products } from "@/data/products";

export default function ProdutosPage() {
  return (
    <main className="flex min-h-screen bg-fritz-stone-50">
      <Sidebar />

      <section className="flex-1">
        <header className="flex items-center justify-between border-b border-fritz-stone-200 bg-white px-10 py-5 shadow-sm">
          <div>
            <p className="text-sm font-medium text-fritz-stone-500">
              Sistema integrado ao ERP
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm font-bold text-fritz-stone-800">
              (47) 3231-0800
            </p>
            <p className="text-xs text-fritz-stone-500">
              fritz@fritzdistribuidora.com.br
            </p>
          </div>
        </header>

        <div className="p-10">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-fritz-stone-950">
                Produtos
              </h2>

            </div>


          </div>

          <ProductsTable data={products} />
        </div>
      </section>
    </main>
  );
}