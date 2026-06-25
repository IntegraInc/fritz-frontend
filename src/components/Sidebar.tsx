"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EmpresaModal, type Empresa, type SelecaoEmpresa } from "@/components/EmpresaModal";
import { useEmpresa } from "@/contexts/EmpresaContext";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { contexto, atualizarContexto } = useEmpresa();

  const [nomeUsuario, setNomeUsuario] = useState("Carregando...");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const [showEmpresaModal, setShowEmpresaModal] = useState(false);
  const [listaEmpresas, setListaEmpresas] = useState<Empresa[]>([]);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuario");
    if (usuarioSalvo) setNomeUsuario(usuarioSalvo);
  }, []);

  function handleLogout(e: React.MouseEvent) {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("contextoEmpresa");

    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    router.push("/login");
  }

  async function handleTrocarEmpresa() {
    const token = localStorage.getItem("token");
    if (!token) return handleLogout(new MouseEvent("click") as any);

    try {
      const compResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/senior/companies`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const compData = await compResponse.json();
      const empresasFormatadas: Empresa[] = compData.map((emp: any) => {
        const rawFiliais = emp.filiais;
        const filiaisArray = Array.isArray(rawFiliais) ? rawFiliais : [rawFiliais];
        return {
          id: emp.codigo,
          razao_social: emp.nome,
          filiais: filiaisArray.map((f: any) => ({ id: f.codigo, nome: f.nome })),
        };
      });
      setListaEmpresas(empresasFormatadas);
      setShowEmpresaModal(true);
    } catch (error) {
      console.error("Erro ao carregar empresas para troca");
    }
  }

  function handleConfirmarTroca(selecao: SelecaoEmpresa) {
    atualizarContexto(selecao);
    setShowEmpresaModal(false);
  }

  // ==========================================
  // NOVA ESTRUTURA DE NAVEGAÇÃO AGRUPADA
  // ==========================================
  const menuCategories = [
    {
      category: "Gestão de Preços",
      items: [
        {
          name: "Tabela Principal",
          href: "/produtos",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          ),
        },
        {
          name: "Gerar Promoções",
          href: "/promocoes",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <line x1="7" y1="7" x2="7.01" y2="7"></line>
            </svg>
          ),
        }
      ]
    },
    {
      category: "Administrativo",
      items: [
        {
          name: "Financeiro",
          href: "/financeiro",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          ),
        }
      ]
    }
  ];

  const empresaAtual = contexto ? `${contexto.empresa.id} - ${contexto.empresa.razao_social}` : "Carregando Empresa...";
  const filialAtual = contexto ? `${contexto.filial.id} - ${contexto.filial.nome}` : "";
  
  const tooltipEmpresa = contexto ? `CNPJ: 00.000.000/0001-00\n${empresaAtual}` : empresaAtual;

  return (
    <>
      <EmpresaModal 
        isOpen={showEmpresaModal} 
        empresas={listaEmpresas} 
        onConfirm={handleConfirmarTroca} 
        onCancel={() => setShowEmpresaModal(false)}
      />

      <button onClick={() => setIsMobileOpen(true)} className="fixed left-5 top-6 z-40 rounded-lg bg-fritz-stone-200 p-2 text-fritz-stone-900 shadow-sm transition-colors hover:bg-fritz-stone-300 md:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>

      {isMobileOpen && <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity md:hidden" onClick={() => setIsMobileOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-50 flex min-h-screen flex-col bg-linear-to-b from-fritz-green-800 via-fritz-bright-800 to-fritz-bright-950 text-white shadow-xl transition-all duration-300 ease-in-out md:relative md:translate-x-0 ${isCollapsed ? "w-20 px-3 py-6" : "w-72 p-6"} ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <button onClick={() => setIsMobileOpen(false)} className="absolute right-4 top-6 text-white md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <button onClick={() => setIsCollapsed(!isCollapsed)} className="absolute -right-3 top-8 hidden h-6 w-6 items-center justify-center rounded-full bg-fritz-yellow-500 text-fritz-green-900 shadow-md transition-colors hover:bg-fritz-yellow-300 md:flex z-10" title={isCollapsed ? "Expandir menu" : "Recolher menu"}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>

        <div className="mb-8 flex flex-col items-center mt-8 md:mt-0">
          <div className={`rounded-xl border border-white/30 bg-white/10 shadow-md transition-all flex items-center justify-center overflow-hidden ${isCollapsed ? "w-12 h-12 p-0" : "w-full px-5 py-4"}`}>
            {isCollapsed ? <span className="text-xl font-black italic">F</span> : <div className="text-center whitespace-nowrap"><h1 className="text-3xl font-black italic tracking-tight">FRITZ</h1><p className="text-[10px] font-semibold tracking-[0.25em] text-fritz-yellow-300">MATERIAIS ELÉTRICOS</p></div>}
          </div>
        </div>

        <nav className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {menuCategories.map((grupo, index) => (
            <div key={index} className="flex flex-col">
              {/* Título da Categoria - Oculto quando o menu está fechado */}
              {!isCollapsed && (
                <p className="px-4 mb-2 text-[11px] font-bold uppercase tracking-wider text-fritz-stone-300/80">
                  {grupo.category}
                </p>
              )}
              
              <div className="space-y-1">
                {grupo.items.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link 
                      key={link.href} 
                      href={link.href} 
                      onClick={() => setIsMobileOpen(false)} 
                      title={isCollapsed ? link.name : ""} 
                      className={`flex items-center rounded-xl px-4 py-3 text-sm transition hover:text-white ${isActive ? "bg-black/20 font-semibold text-white shadow-inner border border-white/5" : "font-medium text-white/80 hover:bg-white/10"} ${isCollapsed ? "justify-center px-0" : "gap-3"}`}
                    >
                      <div className={isActive ? "text-fritz-yellow-300" : ""}>
                        {link.icon}
                      </div>
                      {!isCollapsed && <span>{link.name}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
          
          <div className="pt-4 border-t border-white/10">
            <button onClick={handleLogout} title={isCollapsed ? "Sair" : ""} className={`flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white ${isCollapsed ? "justify-center px-0" : "gap-3"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              {!isCollapsed && <span>Sair do Sistema</span>}
            </button>
          </div>
        </nav>

        <div className={`mt-auto rounded-xl border border-white/20 bg-white/10 p-4 transition-all overflow-hidden ${isCollapsed ? "hidden" : "block"}`}>
          <div className="mb-4 border-b border-white/10 pb-4 flex flex-col items-start">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-fritz-stone-300">Ambiente</p>
            <p className="text-sm font-bold text-fritz-yellow-300 w-full truncate" title={tooltipEmpresa}>
              {empresaAtual}
            </p>
            {filialAtual && (
              <p className="text-xs font-medium text-white/90 w-full truncate" title={filialAtual}>
                {filialAtual}
              </p>
            )}
            <button id="tour-sidebar-troca" onClick={handleTrocarEmpresa} className="mt-2 text-xs text-white/60 hover:text-white transition-colors underline">Trocar</button>
          </div>
          
          <div className="flex flex-col items-start">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-fritz-stone-300">Usuário Conectado</p>
            <div className="flex w-full items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-fritz-yellow-500/20 text-fritz-yellow-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <p className="text-sm font-semibold text-white truncate" title={nomeUsuario}>{nomeUsuario}</p>
            </div>
          </div>
        </div>
      </aside>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(255,255,255,0.3); }
      `}} />
    </>
  );
}