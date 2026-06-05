import { Sidebar } from "@/components/Sidebar";
import { EmpresaProvider } from "@/contexts/EmpresaContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EmpresaProvider>
      <div className="flex h-screen bg-fritz-stone-50 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto transition-all duration-300 ease-in-out">
          {children}
        </main>
      </div>
    </EmpresaProvider>
  );
}