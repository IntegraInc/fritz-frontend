"use client";

import { useEffect, useState, FormEvent, useRef } from "react";
import { Button } from "@/components/tailgrids/core/button";
import { useEmpresa } from "@/contexts/EmpresaContext";
import { PageHeader } from "@/components/PageHeader";

// IMPORTAÇÕES DO DRIVER.JS PARA O TOUR
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

type Product = {
  code: string;
  description: string;
  average: number;
  icms: number | null;
  externalComission: number;
  internalComission: number;
  freight: number;
  ipi: number;
  profit: number;
  pis: number;
};

type SortConfig = {
  key: keyof Product | null;
  direction: "asc" | "desc";
};

type ThOrdenavelProps = {
  label: string;
  sortKey: keyof Product;
  larguraInicial?: string;
  sortConfig: SortConfig;
  align?: "left" | "right";
  onSort: (key: keyof Product) => void;
};

const ThOrdenavel = ({ label, sortKey, larguraInicial = "auto", sortConfig, align = "left", onSort }: ThOrdenavelProps) => {
  const isSorted = sortConfig.key === sortKey;
  const thRef = useRef<HTMLTableCellElement>(null);
  const storageKey = `fritz_coluna_produtos_${String(sortKey)}`;

  const [largura, setLargura] = useState(larguraInicial);

  useEffect(() => {
    const larguraSalva = localStorage.getItem(storageKey);
    if (larguraSalva) {
      setLargura(larguraSalva);
    }
  }, [storageKey]);
  //teste

  const iniciarRedimensionamento = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.pageX;
    const startWidth = thRef.current?.getBoundingClientRect().width || 0;
    let larguraFinal = largura;

    const aoMoverMouse = (moveEvent: MouseEvent) => {
      const novaLargura = Math.max(60, startWidth + (moveEvent.pageX - startX));
      larguraFinal = `${novaLargura}px`;
      setLargura(larguraFinal);
    };

    const aoSoltarMouse = () => {
      document.removeEventListener("mousemove", aoMoverMouse);
      document.removeEventListener("mouseup", aoSoltarMouse);
      document.body.style.userSelect = "auto";
      localStorage.setItem(storageKey, larguraFinal);
    };

    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", aoMoverMouse);
    document.addEventListener("mouseup", aoSoltarMouse);
  };

  return (
    <th 
      ref={thRef}
      style={{ width: largura, minWidth: largura, maxWidth: largura }}
      className="sticky top-0 z-20 bg-fritz-stone-100 shadow-[0_1px_0_0_#e5e7eb] group border-r border-transparent hover:border-fritz-stone-200 transition-colors p-0 align-middle"
    >
      <div 
        onClick={() => onSort(sortKey)}
        className={`flex items-center gap-2 px-6 py-4 cursor-pointer select-none hover:bg-fritz-stone-200/50 w-full h-full ${align === "right" ? "justify-end" : ""}`}
      >
        <span className="truncate">{label}</span>
        <div className="flex flex-col shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`${isSorted && sortConfig.direction === 'asc' ? 'text-fritz-bright-700' : 'text-fritz-stone-400 opacity-50'}`}>
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`-mt-[2px] ${isSorted && sortConfig.direction === 'desc' ? 'text-fritz-bright-700' : 'text-fritz-stone-400 opacity-50'}`}>
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      <div 
        onMouseDown={iniciarRedimensionamento}
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-0 h-full w-[6px] cursor-col-resize bg-transparent group-hover:bg-fritz-stone-300 hover:!bg-fritz-bright-600 z-10 transform translate-x-1/2 transition-colors"
        title="Arraste para redimensionar"
      />
    </th>
  );
};

export default function ProdutosPage() {
  const { contexto, loadingContexto } = useEmpresa();

  const [produtos, setProdutos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState(""); 
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalRegistros, setTotalRegistros] = useState(0);
  
  const [copiado, setCopiado] = useState<string | null>(null);
  const [linhaDestacada, setLinhaDestacada] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: "asc" });

  const secaoTabelaRef = useRef<HTMLDivElement>(null);
  const scrollInternoRef = useRef<HTMLDivElement>(null);
  const inputBuscaRef = useRef<HTMLInputElement>(null); 

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
  };

  const formatarPorcentagem = (valor: number | null) => {
    if (valor === null || valor === undefined) return "0%";
    return `${valor}%`;
  };

  async function buscarProdutos(novaPagina = 1, termoAtual = busca) {
    if (!contexto) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const codigoEmpresa = contexto.empresa.id;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          company: codigoEmpresa,
          page: novaPagina,
          searchParameters: termoAtual,
          recordsPerPage: 50
        }),
      });

      if (!response.ok) throw new Error("Erro ao buscar produtos");

      const data = await response.json();
      
      setProdutos(data.products || []);
      setTotalPaginas(data.totalPages || 0);
      setTotalRegistros(data.totalRecords || 0);
      setPagina(novaPagina);
      
    } catch (error) {
      console.error("Falha na requisição:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!contexto || loadingContexto) return;

    const temporizadorDebounce = setTimeout(() => {
      buscarProdutos(1, busca);
      setPagina(1); 
    }, 500); 

    return () => clearTimeout(temporizadorDebounce);
  }, [busca, contexto, loadingContexto]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault(); 
        window.scrollTo({ top: 0, behavior: "smooth" }); 
        
        if (inputBuscaRef.current) {
          inputBuscaRef.current.value = "";
          inputBuscaRef.current.focus();
        }
        setBusca(""); 
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []); 

  // MÁGICA REAL DO TOUR: Ouve a tabela carregar para disparar!
  useEffect(() => {
    // Só inicia se não estiver carregando E já tiver produtos na tela
    if (loading || loadingContexto || produtos.length === 0) return;

    const tourConcluido = localStorage.getItem("fritz_tour_produtos_final");
    if (tourConcluido) return;

    const driverObj = driver({
      showProgress: true,
      animate: true,
      nextBtnText: 'Próximo &rarr;',
      prevBtnText: '&larr; Anterior',
      doneBtnText: 'Começar a usar!',
      steps: [
        { 
          popover: { 
            title: 'Boas-vindas ao Portal Fritz! 🚀', 
            description: 'Construímos um arsenal de ferramentas de alta performance para acelerar sua rotina. Que tal um tour de 30 segundos pelos seus novos superpoderes?' 
          } 
        },
        { 
          element: '#tour-sidebar-troca', 
          popover: { 
            title: 'Múltiplos Ambientes num Clique 🏢', 
            description: 'Chega de fazer login várias vezes. Clique em "Trocar" a qualquer momento no menu lateral para navegar entre Empresas e Filiais.' 
          } 
        },
        { 
          element: '#tour-badge-erp', 
          popover: { 
            title: 'Sincronia Perfeita com o Senior ⚡', 
            description: 'Seus dados estão vivos! Tudo o que você opera aqui reflete a realidade do seu ERP Senior em tempo real.' 
          } 
        },
        { 
          element: '#tour-caixa-busca', 
          popover: { 
            title: 'Busca Automática (Live Search) 🔍', 
            description: 'Digite o que precisa e o sistema busca sozinho.<br><br>🔥 <b>Dica Ninja:</b> Aperte a tecla <b>[ / ]</b> de qualquer lugar para focar na busca instantaneamente!' 
          } 
        },
        { 
          element: '#tour-cabecalho-tabela', 
          popover: { 
            title: 'Tabela Flexível e Inteligente ↕️', 
            description: 'Clique no título de qualquer coluna para <b>ordenar de A-Z</b>. A descrição ficou curta? Clique na bordinha direita da coluna e <b>arraste para redimensionar!</b>' 
          } 
        },
        { 
          // MÁGICA: Seleciona exatamente a PRIMEIRA linha gerada pelo React
          element: '#tour-tabela-produtos tbody tr:nth-child(1)', 
          popover: { 
            title: 'Foco e Produtividade Máxima 🎯', 
            description: '<b>Clique em qualquer linha</b> para destacá-la com um marcador amarelo e não se perder na leitura.<br><br>🪄 <b>Mágica:</b> Clique em qualquer <b>Código de Produto</b> para copiá-lo direto para sua área de transferência!' 
          },
          // Quando chegar nesse passo, força o estado do React a "pintar" a primeira linha
          onHighlightStarted: () => {
            if (produtos[0]) setLinhaDestacada(produtos[0].code);
          },
          // Quando sair do passo, limpa a pintura
          onDeselected: () => {
            setLinhaDestacada(null);
          }
        },
        { 
          element: '#tour-paginacao', 
          popover: { 
            title: 'Navegação sem Engasgos 📄', 
            description: 'Navegue por catálogos gigantescos sem travar sua máquina. Ao avançar de página, o sistema rola a tela de volta para o topo automaticamente para você.' 
          } 
        }
      ],
      onDestroyStarted: () => {
        localStorage.setItem("fritz_tour_produtos_final", "true");
        driverObj.destroy();
      }
    });

    // Dá 500ms só pro navegador respirar e desenhar a tabela na tela
    setTimeout(() => {
      driverObj.drive();
    }, 500);

  }, [loading, loadingContexto, produtos]); // O segredo está aqui: o useEffect escuta os dados!

  // Função manual para o botão "Ver Tour" (caso a pessoa queira rever)
  function forcarTour() {
    localStorage.removeItem("fritz_tour_produtos_final");
    // Força um pequeno refresh no estado para o useEffect rodar novamente
    buscarProdutos(1, busca);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    buscarProdutos(1, busca);
  }

  function limparBusca() {
    if (inputBuscaRef.current) {
      inputBuscaRef.current.value = "";
      inputBuscaRef.current.focus();
    }
    setBusca("");
    buscarProdutos(1, "");
  }

  function mudarPagina(novaPagina: number) {
    buscarProdutos(novaPagina, busca);
    
    if (secaoTabelaRef.current) {
      secaoTabelaRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (scrollInternoRef.current) {
      scrollInternoRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function copiarCodigo(codigo: string, e: React.MouseEvent) {
    e.stopPropagation(); 
    navigator.clipboard.writeText(codigo);
    setCopiado(codigo);
    setTimeout(() => setCopiado(null), 2000); 
  }

  function handleSort(key: keyof Product) {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  }

  const produtosOrdenados = [...produtos].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue === null) return 1;
    if (bValue === null) return -1;
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="flex min-h-screen bg-fritz-stone-50 w-full">
      <main className="flex-1 p-8 overflow-y-auto w-full">
        <div className="mx-auto w-full">
          
          <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div id="tour-badge-erp" className="flex-1">
              <PageHeader 
                title="Consulta de Produtos" 
                description="Gerencie custos, comissões e impostos do catálogo da empresa."
                badgeText="Integrado ao ERP Senior"
              />
            </div>
            
            <button 
              onClick={forcarTour}
              className="flex items-center gap-2 rounded-xl bg-white border border-fritz-stone-200 px-4 py-2 text-sm font-semibold text-fritz-stone-600 shadow-sm transition-colors hover:bg-fritz-stone-50 hover:text-fritz-bright-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              Ver Tour
            </button>
          </div>

          <div id="tour-caixa-busca" className="mb-6 rounded-2xl bg-white p-6 shadow-sm border border-fritz-stone-200">
            <form onSubmit={handleSubmit} className="flex gap-4">
              <div className="relative flex-1">
                <input
                  ref={inputBuscaRef} 
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  autoFocus
                  placeholder="Pesquisar por código, descrição ou família..."
                  className="w-full rounded-xl border border-fritz-stone-200 bg-fritz-stone-50 pl-4 pr-20 py-3 text-sm text-fritz-stone-900 outline-none transition focus:border-fritz-bright-600 focus:bg-white focus:ring-2 focus:ring-fritz-bright-100"
                />
                
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {busca && !loading && (
                    <button
                      type="button"
                      onClick={limparBusca}
                      className="text-fritz-stone-400 hover:text-fritz-stone-700 focus:outline-none p-1 transition-colors animate-in zoom-in"
                      title="Limpar busca"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  )}
                  

                  {loading && (
                    <svg className="animate-spin h-4 w-4 text-fritz-stone-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}

                  {!busca && !loading && (
                    <kbd className="hidden md:inline-flex items-center justify-center rounded border border-fritz-stone-200 bg-white px-2 py-0.5 text-[10px] font-bold text-fritz-stone-400 shadow-[0_2px_0_0_#e5e7eb]">
                      /
                    </kbd>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="bg-fritz-bright-700 hover:bg-fritz-bright-800 text-white px-8 py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                Buscar
              </Button>
            </form>
          </div>

          <div id="tour-tabela-produtos" ref={secaoTabelaRef} className="rounded-2xl border border-fritz-stone-200 bg-white shadow-sm overflow-hidden scroll-mt-6">
            <div ref={scrollInternoRef} className="overflow-auto max-h-[calc(100vh-320px)] relative">
              <table className="w-full text-left text-sm text-fritz-stone-700 table-fixed min-w-max">
                <thead id="tour-cabecalho-tabela" className="bg-fritz-stone-100/50 text-xs font-semibold uppercase tracking-wider text-fritz-stone-500">
                  <tr>
                    <ThOrdenavel label="Código" sortKey="code" larguraInicial="140px" sortConfig={sortConfig} onSort={handleSort} />
                    <ThOrdenavel label="Descrição" sortKey="description" larguraInicial="350px" sortConfig={sortConfig} onSort={handleSort} />
                    <ThOrdenavel label="Custo Médio" sortKey="average" larguraInicial="160px" align="right" sortConfig={sortConfig} onSort={handleSort} />
                    <ThOrdenavel label="Frete" sortKey="freight" larguraInicial="120px" align="right" sortConfig={sortConfig} onSort={handleSort} />
                    <ThOrdenavel label="ICMS" sortKey="icms" larguraInicial="120px" align="right" sortConfig={sortConfig} onSort={handleSort} />
                    <ThOrdenavel label="IPI" sortKey="ipi" larguraInicial="120px" align="right" sortConfig={sortConfig} onSort={handleSort} />
                    <ThOrdenavel label="PIS" sortKey="pis" larguraInicial="120px" align="right" sortConfig={sortConfig} onSort={handleSort} />
                    <ThOrdenavel label="Comissão Ext." sortKey="externalComission" larguraInicial="170px" align="right" sortConfig={sortConfig} onSort={handleSort} />
                    <ThOrdenavel label="Comissão Int." sortKey="internalComission" larguraInicial="170px" align="right" sortConfig={sortConfig} onSort={handleSort} />
                    <ThOrdenavel label="Lucro" sortKey="profit" larguraInicial="140px" align="right" sortConfig={sortConfig} onSort={handleSort} />
                  </tr>
                </thead>
                <tbody className="divide-y divide-fritz-stone-100 bg-white relative z-0">
                  
                  {(loadingContexto || (loading && produtos.length === 0)) ? (
                    Array.from({ length: 10 }).map((_, index) => (
                      <tr key={`skeleton-${index}`}>
                        <td className="px-6 py-4"><div className="h-4 w-16 rounded bg-gray-200 animate-pulse"></div></td>
                        <td className="px-6 py-4"><div className={`h-4 rounded bg-gray-200 animate-pulse ${index % 2 === 0 ? 'w-64' : 'w-48'}`}></div></td>
                        <td className="px-6 py-4"><div className="h-4 w-20 rounded bg-gray-200 animate-pulse ml-auto"></div></td>
                        <td className="px-6 py-4"><div className="h-4 w-12 rounded bg-gray-200 animate-pulse ml-auto"></div></td>
                        <td className="px-6 py-4"><div className="h-4 w-12 rounded bg-gray-200 animate-pulse ml-auto"></div></td>
                        <td className="px-6 py-4"><div className="h-4 w-12 rounded bg-gray-200 animate-pulse ml-auto"></div></td>
                        <td className="px-6 py-4"><div className="h-4 w-12 rounded bg-gray-200 animate-pulse ml-auto"></div></td>
                        <td className="px-6 py-4"><div className="h-4 w-12 rounded bg-gray-200 animate-pulse ml-auto"></div></td>
                        <td className="px-6 py-4"><div className="h-4 w-12 rounded bg-gray-200 animate-pulse ml-auto"></div></td>
                        <td className="px-6 py-4"><div className="h-4 w-12 rounded bg-gray-200 animate-pulse ml-auto"></div></td>
                      </tr>
                    ))
                  ) : produtosOrdenados.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-20 text-center">
                        <div className="mx-auto flex max-w-sm flex-col items-center">
                          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-fritz-stone-50 text-fritz-stone-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                          </div>
                          <h3 className="mb-1 text-lg font-bold text-fritz-stone-900">Nenhum produto encontrado</h3>
                          <p className="mb-6 text-sm text-fritz-stone-500">
                            Não encontramos nenhum resultado para "{busca}" nesta empresa/filial.
                          </p>
                          {busca && (
                            <Button 
                              onClick={limparBusca}
                              className="bg-white border border-fritz-stone-200 text-fritz-stone-700 hover:bg-fritz-stone-50 px-6"
                            >
                              Limpar filtro de busca
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    produtosOrdenados.map((produto) => (
                      <tr 
                        key={produto.code} 
                        onClick={() => setLinhaDestacada(linhaDestacada === produto.code ? null : produto.code)}
                        className={`transition-colors cursor-pointer select-none ${linhaDestacada === produto.code ? "!bg-fritz-bright-50 shadow-inner" : "hover:bg-fritz-green-800/5"}`}
                      >
                        <td className="px-6 py-4 font-semibold text-fritz-stone-900 truncate">
                          <button
                            onClick={(e) => copiarCodigo(produto.code, e)}
                            className="group flex w-full items-center gap-2 hover:text-fritz-bright-700 transition-colors focus:outline-none"
                            title="Clique para copiar"
                          >
                            <span>{produto.code}</span>
                            {copiado === produto.code ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-in zoom-in"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 truncate" title={produto.description}>{produto.description}</td>
                        <td className="px-6 py-4 font-medium text-fritz-bright-700 text-right truncate">{formatarMoeda(produto.average)}</td>
                        <td className="px-6 py-4 text-right truncate">{formatarPorcentagem(produto.freight)}</td>
                        <td className="px-6 py-4 text-right truncate">{formatarPorcentagem(produto.icms)}</td>
                        <td className="px-6 py-4 text-right truncate">{formatarPorcentagem(produto.ipi)}</td>
                        <td className="px-6 py-4 text-right truncate">{formatarPorcentagem(produto.pis)}</td>
                        <td className="px-6 py-4 font-medium text-fritz-green-700 text-right truncate">{formatarPorcentagem(produto.externalComission)}</td>
                        <td className="px-6 py-4 text-fritz-stone-600 text-right truncate">{formatarPorcentagem(produto.internalComission)}</td>
                        <td className="px-6 py-4 font-bold text-fritz-stone-900 text-right truncate">{formatarPorcentagem(produto.profit)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {produtos.length > 0 && (
              <div id="tour-paginacao" className="flex items-center justify-between border-t border-fritz-stone-100 bg-white px-6 py-4">
                <div className="text-sm text-fritz-stone-500 flex items-center gap-3">
                  <span>Mostrando <span className="font-semibold text-fritz-stone-900">{produtos.length}</span> de <span className="font-semibold text-fritz-stone-900">{totalRegistros}</span> resultados</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => mudarPagina(pagina - 1)}
                    disabled={pagina === 1}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-fritz-stone-200 text-fritz-stone-600 transition hover:bg-fritz-stone-50 disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  </button>
                  <span className="text-sm font-medium text-fritz-stone-700 px-2">
                    Página {pagina} de {totalPaginas}
                  </span>
                  <button
                    onClick={() => mudarPagina(pagina + 1)}
                    disabled={pagina >= totalPaginas}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-fritz-stone-200 text-fritz-stone-600 transition hover:bg-fritz-stone-50 disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}