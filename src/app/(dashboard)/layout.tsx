import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar fixa à esquerda */}
      <aside className="shrink-0">
        <Sidebar />
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 overflow-y-auto p-3 ml-16 transition-all duration-300 ease-in-out ">
        {children}
      </main>
    </div>
  );
}
