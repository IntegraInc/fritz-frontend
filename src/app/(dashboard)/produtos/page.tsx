"use client";

import { useEffect, useState, FormEvent, useRef } from "react";
import { Button } from "@/components/tailgrids/core/button";
import { useEmpresa } from "@/contexts/EmpresaContext";
import { PageHeader } from "@/components/PageHeader";

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
  cofins: number;
  familyCode: number | null;
  familyDescription: string;
  inboundIcms?: number;
  inboundCofinsAndPis?: number;
  inboundIpi?: number;
  inboundFreight?: number;
  fixedCoast?: number;
  basePrice?: number;
  inboundInvoicePrice?: number;
  lastInboundPrice?: number;
  lastInboundDate?: string;
  lastUpdateDate?: string;
  lastUpdateTime?: string;
  lastUpdateUser?: string;
};

type ThOrdenavelProps = {
  id?: string;
  label: string;
  sortKey?: keyof Product;
  larguraInicial?: string;
  orderBy?: string[];
  ordenationType?: "asc" | "desc";
  align?: "left" | "right" | "center";
  onSort?: (key: keyof Product, e: React.MouseEvent) => void;
  children?: React.ReactNode;
};

const ThOrdenavel = ({ id, label, sortKey, larguraInicial = "auto", orderBy = [], ordenationType = "asc", align = "left", onSort, children }: ThOrdenavelProps) => {
  const isSorted = sortKey && orderBy.includes(sortKey);
  const sortIndex = sortKey ? orderBy.indexOf(sortKey) : -1;
  const thRef = useRef<HTMLTableCellElement>(null);
  const storageKey = `fritz_coluna_produtos_${String(sortKey || label)}`;

  const [largura, setLargura] = useState(larguraInicial);

  useEffect(() => {
    const larguraSalva = localStorage.getItem(storageKey);
    if (larguraSalva) {
      setLargura(larguraSalva);
    }
  }, [storageKey]);

  const iniciarRedimensionamento = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.pageX;
    const startWidth = thRef.current?.getBoundingClientRect().width || 0;
    let larguraFinal = largura;

    const aoMoverMouse = (moveEvent: MouseEvent) => {
      const novaLargura = Math.max(40, startWidth + (moveEvent.pageX - startX));
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
      id={id}
      ref={thRef}
      style={{ width: largura, minWidth: largura, maxWidth: largura }}
      className="sticky top-0 z-20 bg-fritz-stone-100 shadow-[0_1px_0_0_#e5e7eb] group border-r border-transparent hover:border-fritz-stone-200 transition-colors p-0 align-middle"
    >
      <div 
        onClick={(e) => sortKey && onSort && onSort(sortKey, e)}
        className={`flex items-center gap-2 px-4 py-4 ${sortKey ? 'cursor-pointer hover:bg-fritz-stone-200/50' : ''} select-none w-full h-full ${align === "right" ? "justify-end" : align === "center" ? "justify-center" : ""}`}
        title={sortKey ? "Clique para ordenar. Shift+Clique para ordenação múltipla." : undefined}
      >
        {children || <span className="truncate">{label}</span>}
        
        {isSorted && orderBy.length > 1 && (
          <span className="flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full bg-fritz-bright-700 text-[9px] font-bold text-white shadow-sm ml-1" title={`Prioridade de ordenação: ${sortIndex + 1}`}>
            {sortIndex + 1}
          </span>
        )}

        {sortKey && (
          <div className="flex flex-col shrink-0 ml-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`${isSorted && ordenationType === 'asc' ? 'text-fritz-bright-700' : 'text-fritz-stone-400 opacity-50'}`}>
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`-mt-[2px] ${isSorted && ordenationType === 'desc' ? 'text-fritz-bright-700' : 'text-fritz-stone-400 opacity-50'}`}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        )}
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

const CelulaInteligente = ({ valor, tipo = "text", prefixo, sufixo, onChange, align = "left" }: any) => {
  const [editando, setEditando] = useState(false);
  const [valorInput, setValorInput] = useState(valor === null ? "" : valor.toString());

  useEffect(() => {
    if (!editando) setValorInput(valor === null ? "" : valor.toString());
  }, [valor, editando]);

  const handleBlur = () => {
    setEditando(false);
    let novoValor: any = valorInput;
    if (tipo === "moeda" || tipo === "porcentagem" || tipo === "number") {
      novoValor = novoValor === "" ? 0 : parseFloat(novoValor);
    }
    onChange(novoValor);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') e.currentTarget.blur();
  };

  let exibicao = valor === null ? "-" : valor;
  if (tipo === "moeda") {
    exibicao = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(valor) || 0);
  } else if (tipo === "porcentagem") {
    exibicao = `${Number(valor || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
  }

  if (editando) {
    return (
      <div className={`flex items-center gap-1 bg-white ring-2 ring-fritz-bright-600 rounded shadow-sm px-2 py-1 -mx-2`}>
        {prefixo && tipo !== 'moeda' && <span className="text-fritz-stone-400 text-xs font-semibold">{prefixo}</span>}
        <input
          type={tipo === "text" ? "text" : "number"}
          step="any"
          autoFocus
          onFocus={(e) => e.target.select()}
          value={valorInput}
          onChange={(e) => setValorInput(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`bg-transparent outline-none !border-0 !ring-0 !shadow-none text-fritz-stone-900 ${align === "right" ? "text-right" : "text-left"} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none font-medium w-full p-0 m-0`}
        />
        {sufixo && tipo !== 'porcentagem' && <span className="text-fritz-stone-400 text-xs font-semibold">{sufixo}</span>}
      </div>
    );
  }

  return (
    <div 
      tabIndex={0}
      onFocus={() => setEditando(true)}
      onClick={() => setEditando(true)} 
      className={`cursor-text border border-transparent hover:border-fritz-stone-200 hover:bg-white focus:bg-white focus:ring-2 focus:ring-fritz-bright-600 focus:outline-none rounded px-2 py-1 -mx-2 text-sm text-fritz-stone-700 transition-colors ${tipo !== 'text' ? 'font-medium' : ''} ${align === "right" ? "text-right" : "text-left"}`}
    >
      {exibicao}
    </div>
  );
};

const ComboboxFamilia = ({ familias = [], valorSelecionado, onChange }: { familias: any[], valorSelecionado: string, onChange: (val: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [buscaInt, setBuscaInt] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const familiasFiltradas = familias.filter((f: any) => 
    f.nome.toLowerCase().includes(buscaInt.toLowerCase()) || 
    f.codigo.toString().includes(buscaInt)
  );

  const familiaAtual = familias.find((f: any) => f.codigo.toString() === valorSelecionado);

  return (
    <div ref={wrapperRef} className="relative w-full h-full">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-full flex items-center justify-between rounded-xl border border-fritz-stone-200 bg-fritz-stone-50 px-4 py-3 text-sm text-fritz-stone-900 outline-none transition hover:bg-white hover:border-fritz-stone-300 cursor-pointer"
      >
        <span className="truncate pr-4">{familiaAtual ? `${familiaAtual.codigo} - ${familiaAtual.nome}` : "Todas as Famílias"}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-fritz-stone-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full min-w-[280px] rounded-xl border border-fritz-stone-200 bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 border-b border-fritz-stone-100 bg-fritz-stone-50/50">
            <input
              type="text"
              autoFocus
              placeholder="Buscar código ou descrição..."
              value={buscaInt}
              onChange={(e) => setBuscaInt(e.target.value)}
              className="w-full rounded-lg border border-fritz-stone-200 bg-white px-3 py-2 text-sm text-fritz-stone-900 outline-none focus:border-fritz-bright-500 focus:ring-1 focus:ring-fritz-bright-500"
            />
          </div>
          <ul className="max-h-60 overflow-auto py-1">
            <li 
              onClick={() => { onChange(""); setIsOpen(false); setBuscaInt(""); }}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-fritz-stone-100 ${valorSelecionado === "" ? "bg-fritz-bright-50 text-fritz-bright-700 font-semibold" : "text-fritz-stone-700"}`}
            >
              Todas as Famílias
            </li>
            {familiasFiltradas.length === 0 ? (
              <li className="px-4 py-3 text-sm text-fritz-stone-500 text-center">Nenhuma família encontrada</li>
            ) : (
              familiasFiltradas.map((f: any) => (
                <li 
                  key={f.codigo}
                  onClick={() => { onChange(f.codigo.toString()); setIsOpen(false); setBuscaInt(""); }}
                  className={`px-4 py-2 text-sm cursor-pointer transition-colors hover:bg-fritz-stone-100 flex items-center gap-2 truncate ${valorSelecionado === f.codigo.toString() ? "bg-fritz-bright-50 text-fritz-bright-700 font-semibold" : "text-fritz-stone-700"}`}
                  title={`${f.codigo} - ${f.nome}`}
                >
                  <span className="shrink-0 w-12 text-fritz-stone-400 text-xs font-mono">{f.codigo}</span> 
                  <span className="truncate">{f.nome}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default function ProdutosPage() {
  const { contexto, loadingContexto } = useEmpresa();

  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({ show: false, message: '', type: 'info' });
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const [produtos, setProdutos] = useState<Product[]>([]);
  const [familiasDropdown, setFamiliasDropdown] = useState<{codigo: string, nome: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);
  
  const [busca, setBusca] = useState(""); 
  const [buscaFamilia, setBuscaFamilia] = useState("");

  const [pagina, setPagina] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(50);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalRegistros, setTotalRegistros] = useState(0);
  
  const [copiado, setCopiado] = useState<string | null>(null);

  // ESTADOS DE ORDENAÇÃO MÚLTIPLA E GLOBAL
  const [orderBy, setOrderBy] = useState<string[]>(["description"]);
  const [ordenationType, setOrdenationType] = useState<"asc" | "desc">("asc");

  const [rascunhos, setRascunhos] = useState<Record<string, Product>>({});
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [bulkField, setBulkField] = useState<keyof Product>("profit");
  const [bulkValue, setBulkValue] = useState<string>("");

  const secaoTabelaRef = useRef<HTMLDivElement>(null);
  const scrollInternoRef = useRef<HTMLDivElement>(null);
  const inputBuscaRef = useRef<HTMLInputElement>(null); 

  const formatarMoeda = (valor: number | undefined | null) => {
    if (valor === undefined || valor === null) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
  };

  useEffect(() => {
    async function carregarFamilias() {
      try {
        const token = localStorage.getItem("token");
        if (!token || !contexto?.empresa?.id) return;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/senior/companies`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const text = await res.text();
          const data = text ? JSON.parse(text) : null;
          if (!data) return;

          const empresaAtual = data.find((e: any) => e.codigo === contexto.empresa.id);
          if (empresaAtual && empresaAtual.familias) {
            setFamiliasDropdown(empresaAtual.familias);
          }
        }
      } catch (e) { console.error("Erro ao carregar famílias", e); }
    }
    carregarFamilias();
  }, [contexto]);

  async function buscarProdutos(
    novaPagina = 1, 
    termoAtual = busca, 
    familiaAtual = buscaFamilia, 
    novosCamposOrd?: string[], 
    novaDirecaoOrd?: "asc" | "desc",
    novaQtd = registrosPorPagina
  ) {
    if (!contexto) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      const currentOrderBy = novosCamposOrd || orderBy;
      // AQUI: Sem "De-Para"! Enviamos o nome limpo (ex: "description", "average") direto pro Júlio
      const finalOrderBy = currentOrderBy.length > 0 
        ? currentOrderBy.map(field => ({ field })) 
        : [{ field: "description" }];

      const payload: Record<string, any> = {
        company: String(contexto.empresa.id), // Forçando como String igual ao CURL do Júlio
        page: novaPagina,
        searchParameters: termoAtual,
        recordsPerPage: novaQtd,
        ordenationType: novaDirecaoOrd || ordenationType,
        orderBy: finalOrderBy
      };
      
      if (familiaAtual.trim() !== "") payload.family = familiaAtual.trim();

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Se der erro de novo, isso vai mostrar no F12 exatamente o que o Júlio reclamou
        const errorText = await response.text();
        console.error("Detalhe do erro da API:", errorText);
        throw new Error("Erro ao buscar produtos");
      }
      
      const data = await response.json();
      setProdutos(data.products || []);
      setTotalPaginas(data.totalPages || 0);
      setTotalRegistros(data.totalRecords || 0);
      setPagina(novaPagina);
    } catch (error) {
      console.error("Falha na requisição:", error);
      showToast("Falha ao buscar produtos no ERP.", "error");
    } finally {
      setLoading(false);
    }
  }

  function mudarPagina(novaPagina: number) {
    if (novaPagina < 1 || novaPagina > totalPaginas) return;
    buscarProdutos(novaPagina, busca, buscaFamilia);
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

  async function salvarRascunhos() {
    if (!contexto) return;
    setSalvando(true);
    try {
      const token = localStorage.getItem("token");
      
      const payload = {
        company: contexto.empresa.id,
        products: Object.values(rascunhos).map((r) => ({
          code: r.code,
          description: r.description,
          average: r.average,
          icms: r.icms,
          externalComission: r.externalComission,
          internalComission: r.internalComission,
          freight: r.freight,
          ipi: r.ipi,
          profit: r.profit,
          pis: r.pis,
          cofins: r.cofins,
          inboundIcms: r.inboundIcms,
          inboundCofinsAndPis: r.inboundCofinsAndPis,
          inboundIpi: r.inboundIpi,
          inboundFreight: r.inboundFreight,
          fixedCoast: r.fixedCoast,
          basePrice: r.basePrice,
          inboundInvoicePrice: r.inboundInvoicePrice,
          lastInboundPrice: r.lastInboundPrice // <-- Envia o novo campo atualizado
        }))
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Falha ao salvar no ERP");
      
      setRascunhos({});
      setSelecionados(new Set());
      buscarProdutos(pagina, busca, buscaFamilia);
      showToast("Alterações salvas com sucesso no Senior!", "success");
      
    } catch (error) {
      showToast("Ocorreu um erro ao salvar as alterações. Verifique a conexão.", "error");
      console.error(error);
    } finally {
      setSalvando(false);
    }
  }

  function handleEdit(produtoBase: Product, campo: keyof Product, valor: any) {
    setRascunhos(prev => {
      const produtoAtual = prev[produtoBase.code] || { ...produtoBase };
      return { ...prev, [produtoBase.code]: { ...produtoAtual, [campo]: valor } };
    });
  }

  function toggleSelecionarTodos(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      const novosSelecionados = new Set(selecionados);
      produtos.forEach(p => novosSelecionados.add(p.code));
      setSelecionados(novosSelecionados);
    } else {
      const novosSelecionados = new Set(selecionados);
      produtos.forEach(p => novosSelecionados.delete(p.code));
      setSelecionados(novosSelecionados);
    }
  }

  function toggleSelecionar(codigo: string) {
    const novosSelecionados = new Set(selecionados);
    if (novosSelecionados.has(codigo)) novosSelecionados.delete(codigo);
    else novosSelecionados.add(codigo);
    setSelecionados(novosSelecionados);
  }

  function aplicarEdicaoEmMassa(e: FormEvent) {
    e.preventDefault();
    const novoValor = parseFloat(bulkValue);
    
    setRascunhos(prev => {
      const novosRascunhos = { ...prev };
      selecionados.forEach(codigo => {
        const produtoOriginal = produtos.find(p => p.code === codigo) || novosRascunhos[codigo];
        if (produtoOriginal) {
          novosRascunhos[codigo] = { ...produtoOriginal, [bulkField]: novoValor };
        }
      });
      return novosRascunhos;
    });
    
    setIsBulkOpen(false);
    setBulkValue("");
    setSelecionados(new Set());
  }

  useEffect(() => {
    if (!contexto || loadingContexto) return;
    const temporizadorDebounce = setTimeout(() => {
      buscarProdutos(1, busca, buscaFamilia);
      setPagina(1); 
    }, 500); 
    return () => clearTimeout(temporizadorDebounce);
  }, [busca, buscaFamilia, contexto, loadingContexto]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "SELECT") {
        e.preventDefault(); 
        window.scrollTo({ top: 0, behavior: "smooth" }); 
        if (inputBuscaRef.current) {
          inputBuscaRef.current.value = "";
          inputBuscaRef.current.focus();
        }
        setBusca(""); 
        setBuscaFamilia("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []); 

  function handleSort(key: keyof Product, e: React.MouseEvent) {
    let newOrderBy = [...orderBy];
    let newDirection = ordenationType;

    if (e.shiftKey) {
      if (newOrderBy.includes(key)) {
        newOrderBy = newOrderBy.filter((k) => k !== key); 
      } else {
        newOrderBy.push(key); 
      }
    } else {
      if (newOrderBy.length === 1 && newOrderBy[0] === key) {
        newDirection = ordenationType === "asc" ? "desc" : "asc";
      } else {
        newOrderBy = [key];
        newDirection = "asc";
      }
    }

    setOrderBy(newOrderBy);
    setOrdenationType(newDirection);
    buscarProdutos(1, busca, buscaFamilia, newOrderBy, newDirection);
  }

  function limparOrdenacao() {
    const defaultOrderBy = ["description"];
    setOrderBy(defaultOrderBy);
    setOrdenationType("asc");
    buscarProdutos(1, busca, buscaFamilia, defaultOrderBy, "asc");
  }

  const produtosOrdenados = [...produtos].sort((a, b) => {
    if (orderBy.length === 0) return 0;
    for (const key of orderBy) {
      const valA = rascunhos[a.code]?.[key as keyof Product] ?? a[key as keyof Product];
      const valB = rascunhos[b.code]?.[key as keyof Product] ?? b[key as keyof Product];
      
      if (valA === valB) continue;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;
      
      if (valA < valB) return ordenationType === "asc" ? -1 : 1;
      if (valA > valB) return ordenationType === "asc" ? 1 : -1;
    }
    return 0;
  });

  const todosDaPaginaSelecionados = produtos.length > 0 && produtos.every(p => selecionados.has(p.code));
  const totalRascunhos = Object.keys(rascunhos).length;

  return (
    <div className="flex flex-col h-screen bg-fritz-stone-50 w-full relative overflow-hidden">
      
      {toast.show && (
        <div className="fixed top-6 right-6 z-[9999] animate-in slide-in-from-right-8 fade-in duration-300">
          <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl shadow-xl border ${
            toast.type === 'success' ? 'bg-white border-green-200' : 
            toast.type === 'error' ? 'bg-white border-red-200' : 
            'bg-white border-fritz-stone-200'
          }`}>
             <div className={`flex items-center justify-center h-10 w-10 rounded-full ${
               toast.type === 'success' ? 'bg-green-100 text-green-600' : 
               toast.type === 'error' ? 'bg-red-100 text-red-600' : 
               'bg-fritz-stone-100 text-fritz-stone-600'
             }`}>
                {toast.type === 'success' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                {toast.type === 'error' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>}
                {toast.type === 'info' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>}
             </div>
             <div>
               <p className={`text-sm font-bold ${toast.type === 'error' ? 'text-red-800' : 'text-fritz-stone-900'}`}>{toast.message}</p>
             </div>
             <button onClick={() => setToast(prev => ({ ...prev, show: false }))} className="ml-2 text-fritz-stone-400 hover:text-fritz-stone-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
             </button>
          </div>
        </div>
      )}

      {/* Cabeçalho Fixo */}
      <div className="px-8 pt-4 pb-0 shrink-0">
        <PageHeader 
          title="Consulta e Precificação de Produtos" 
          description="Gerencie custos, comissões e impostos do catálogo com atualização em tempo real."
          badgeText="Integrado ao ERP Senior"
        />
      </div>

      <main className="flex-1 flex flex-col w-full min-h-0 px-8 pb-4 pt-2">
        
        {selecionados.size > 0 && (
          <div className="sticky top-0 z-50 flex justify-center w-full h-0 pointer-events-none">
            <div className="bg-fritz-stone-900 text-white rounded-full px-6 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-center gap-4 animate-in slide-in-from-top-4 fade-in duration-300 border border-fritz-stone-700 pointer-events-auto">
              <span className="text-sm font-semibold">{selecionados.size} produto{selecionados.size > 1 ? 's' : ''} selecionado{selecionados.size > 1 ? 's' : ''}</span>
              <div className="w-px h-4 bg-fritz-stone-700"></div>
              <button 
                onClick={() => setIsBulkOpen(true)}
                className="text-sm font-bold text-fritz-bright-400 hover:text-fritz-bright-300 transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                Aplicar em lote
              </button>
              <button onClick={() => setSelecionados(new Set())} className="ml-2 text-fritz-stone-400 hover:text-white transition-colors" title="Limpar seleção">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </div>
        )}

        {isBulkOpen && (
          <div className="fixed inset-0 bg-fritz-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-[400px] overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6">
                <h3 className="text-lg font-bold text-fritz-stone-900 mb-1">Atualização em Lote</h3>
                <p className="text-sm text-fritz-stone-500 mb-6">A alteração será aplicada na memória para os {selecionados.size} produtos selecionados.</p>
                
                <form onSubmit={aplicarEdicaoEmMassa} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-fritz-stone-700 mb-1.5">Campo a ser alterado</label>
                    <select 
                      value={bulkField} 
                      onChange={(e) => setBulkField(e.target.value as keyof Product)}
                      className="w-full rounded-xl border border-fritz-stone-200 bg-fritz-stone-50 px-4 py-3 text-sm text-fritz-stone-900 outline-none focus:border-fritz-bright-600 focus:bg-white focus:ring-2 focus:ring-fritz-bright-100"
                    >
                      <option value="lastInboundPrice">Custo Migrado (R$)</option>
                      <option value="fixedCoast">Custo Fixo (%)</option>
                      <option value="inboundIcms">ICMS - Entrada (%)</option>
                      <option value="inboundCofinsAndPis">PIS/COFINS - Entrada (%)</option>
                      <option value="inboundIpi">IPI - Entrada (%)</option>
                      <option value="inboundFreight">Frete - Entrada (%)</option>
                      <option value="profit">Margem de Lucro (%)</option>
                      <option value="externalComission">Comissão Externa (%)</option>
                      <option value="internalComission">Comissão Interna (%)</option>
                      <option value="freight">Frete - Saída (%)</option>
                      <option value="icms">ICMS - Saída (%)</option>
                      <option value="ipi">IPI - Saída (%)</option>
                      <option value="pis">PIS - Saída (%)</option>
                      <option value="cofins">COFINS - Saída (%)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-fritz-stone-700 mb-1.5">Novo valor</label>
                    <input 
                      type="number"
                      step="any"
                      required
                      value={bulkValue}
                      onChange={(e) => setBulkValue(e.target.value)}
                      placeholder="Digite o novo valor..."
                      className="w-full rounded-xl border border-fritz-stone-200 bg-fritz-stone-50 px-4 py-3 text-sm text-fritz-stone-900 outline-none focus:border-fritz-bright-600 focus:bg-white focus:ring-2 focus:ring-fritz-bright-100"
                    />
                  </div>
                  <div className="pt-4 flex gap-3">
                    <Button type="button" onClick={() => setIsBulkOpen(false)} className="flex-1 bg-white border border-fritz-stone-200 text-fritz-stone-700 hover:bg-fritz-stone-50 py-3 rounded-xl">Cancelar</Button>
                    <Button type="submit" className="flex-1 bg-fritz-bright-700 hover:bg-fritz-bright-800 text-white py-3 rounded-xl">Aplicar Valores</Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {orderBy.length > 1 && (
          <div className="mb-4 flex items-center gap-3 bg-fritz-bright-50/80 border border-fritz-bright-200 text-fritz-bright-800 px-5 py-3 rounded-xl text-sm animate-in fade-in slide-in-from-top-2 shadow-sm shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-fritz-bright-600"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>
            <span><strong>Ordenação Múltipla Ativa:</strong> A tabela está cruzando e ordenando dados de {orderBy.length} colunas simultaneamente.</span>
            <button onClick={limparOrdenacao} className="ml-auto text-xs font-bold text-fritz-bright-700 hover:text-fritz-bright-900 underline transition-colors px-2 py-1">
              Restaurar Padrão
            </button>
          </div>
        )}

        <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm border border-fritz-stone-200 shrink-0">
          <form onSubmit={(e) => { e.preventDefault(); buscarProdutos(1, busca, buscaFamilia); }} className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            <div className="relative md:col-span-3 z-30">
              <ComboboxFamilia 
                familias={familiasDropdown} 
                valorSelecionado={buscaFamilia} 
                onChange={setBuscaFamilia} 
              />
            </div>

            <div className="relative md:col-span-7">
              <input
                ref={inputBuscaRef} 
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Pesquisar por código, descrição ou palavra-chave..."
                className="w-full rounded-xl border border-fritz-stone-200 bg-fritz-stone-50 pl-4 pr-12 py-3 text-sm text-fritz-stone-900 outline-none transition focus:border-fritz-bright-600 focus:bg-white focus:ring-2 focus:ring-fritz-bright-100"
              />
              
              {(busca || buscaFamilia) && !loading && (
                <button
                  type="button"
                  onClick={() => { setBusca(""); setBuscaFamilia(""); buscarProdutos(1, "", ""); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-fritz-stone-400 hover:text-fritz-stone-700 p-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              )}
              {loading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <svg className="animate-spin h-4 w-4 text-fritz-stone-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <Button type="submit" disabled={loading} className="w-full bg-fritz-bright-700 hover:bg-fritz-bright-800 text-white py-3 rounded-xl font-semibold text-sm h-full flex justify-center items-center">
                Buscar
              </Button>
            </div>
          </form>
        </div>

        {/* CONTAINER FLEXÍVEL DA TABELA PARA ROLAGEM E RODAPÉ FIXO */}
        <div ref={secaoTabelaRef} className="rounded-2xl border border-fritz-stone-200 bg-white shadow-sm overflow-hidden flex-1 flex flex-col min-h-0 z-10 mb-4">
          <div ref={scrollInternoRef} className="overflow-auto flex-1 relative">
            <table className="w-full text-left text-sm text-fritz-stone-700 table-fixed min-w-max">
              <thead className="bg-fritz-stone-100/50 text-xs font-semibold uppercase tracking-wider text-fritz-stone-500">
                <tr>
                  <ThOrdenavel label="Check" larguraInicial="60px" align="center">
                    <div className="flex items-center justify-center w-full">
                      <input 
                        type="checkbox" 
                        checked={todosDaPaginaSelecionados}
                        onChange={toggleSelecionarTodos}
                        className="h-4 w-4 rounded border-fritz-stone-300 text-fritz-bright-600 focus:ring-fritz-bright-600 cursor-pointer"
                      />
                    </div>
                  </ThOrdenavel>
                  <ThOrdenavel label="Família" sortKey="familyDescription" larguraInicial="200px" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                  <ThOrdenavel label="Código" sortKey="code" larguraInicial="140px" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                  <ThOrdenavel label="Descrição" sortKey="description" larguraInicial="350px" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                  
                  <ThOrdenavel label="Data Últ. Entrada" sortKey="lastInboundDate" larguraInicial="140px" align="center" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                  <ThOrdenavel label="Última Entrada" sortKey="lastInboundPrice" larguraInicial="140px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                  <ThOrdenavel label="Preço Estoque" sortKey="inboundInvoicePrice" larguraInicial="140px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                  
                  <ThOrdenavel label="Custo migrado" sortKey="average" larguraInicial="140px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                  
                  <ThOrdenavel label="Preço Venda" sortKey="basePrice" larguraInicial="160px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                  
                  <ThOrdenavel label="ICMS-(E)" sortKey="inboundIcms" larguraInicial="110px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                  <ThOrdenavel label="PIS/COF-(E)" sortKey="inboundCofinsAndPis" larguraInicial="110px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                  <ThOrdenavel label="IPI-(E)" sortKey="inboundIpi" larguraInicial="110px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                  <ThOrdenavel label="Frete-(E)" sortKey="inboundFreight" larguraInicial="110px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                  
                  <ThOrdenavel label="ICMS-(S)" sortKey="icms" larguraInicial="110px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                  <ThOrdenavel label="IPI-(S)" sortKey="ipi" larguraInicial="110px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                  <ThOrdenavel label="PIS-(S)" sortKey="pis" larguraInicial="110px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                  <ThOrdenavel label="COFINS-(S)" sortKey="cofins" larguraInicial="110px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                  <ThOrdenavel label="Frete-(S)" sortKey="freight" larguraInicial="110px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                  
                  <ThOrdenavel label="Custo Fixo" sortKey="fixedCoast" larguraInicial="110px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                  <ThOrdenavel label="Comissão Interna" sortKey="internalComission" larguraInicial="150px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                  <ThOrdenavel label="Comissão Externa" sortKey="externalComission" larguraInicial="150px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                  <ThOrdenavel label="Lucro" sortKey="profit" larguraInicial="140px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                  
                  <ThOrdenavel label="Última Alteração" sortKey="lastUpdateDate" larguraInicial="220px" align="left" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                </tr>
              </thead>
              <tbody className="divide-y divide-fritz-stone-100 bg-white relative z-0">
                
                {loadingContexto || (loading && produtos.length === 0) ? (
                  Array.from({ length: 10 }).map((_, index) => (
                    <tr key={`skeleton-${index}`}>
                      <td className="px-4 py-4 text-center"><div className="h-4 w-4 rounded bg-gray-200 animate-pulse inline-block"></div></td>
                      <td className="px-4 py-4"><div className="h-4 w-24 rounded bg-gray-200 animate-pulse"></div></td>
                      <td className="px-4 py-4"><div className="h-4 w-16 rounded bg-gray-200 animate-pulse"></div></td>
                      <td className="px-4 py-4"><div className={`h-4 rounded bg-gray-200 animate-pulse ${index % 2 === 0 ? 'w-64' : 'w-48'}`}></div></td>
                      <td className="px-4 py-4"><div className="h-4 w-16 rounded bg-gray-200 animate-pulse mx-auto"></div></td>
                      <td className="px-4 py-4"><div className="h-4 w-16 rounded bg-gray-200 animate-pulse ml-auto"></div></td>
                      <td className="px-4 py-4"><div className="h-4 w-16 rounded bg-gray-200 animate-pulse ml-auto"></div></td>
                      <td className="px-4 py-4"><div className="h-4 w-16 rounded bg-gray-200 animate-pulse ml-auto"></div></td>
                      <td className="px-4 py-4"><div className="h-4 w-16 rounded bg-gray-200 animate-pulse ml-auto"></div></td>
                      <td className="px-4 py-4"><div className="h-4 w-12 rounded bg-gray-200 animate-pulse ml-auto"></div></td>
                      <td className="px-4 py-4"><div className="h-4 w-12 rounded bg-gray-200 animate-pulse ml-auto"></div></td>
                      <td className="px-4 py-4"><div className="h-4 w-12 rounded bg-gray-200 animate-pulse ml-auto"></div></td>
                      <td className="px-4 py-4"><div className="h-4 w-12 rounded bg-gray-200 animate-pulse ml-auto"></div></td>
                      <td className="px-4 py-4"><div className="h-4 w-12 rounded bg-gray-200 animate-pulse ml-auto"></div></td>
                      <td className="px-4 py-4"><div className="h-4 w-12 rounded bg-gray-200 animate-pulse ml-auto"></div></td>
                      <td className="px-4 py-4"><div className="h-4 w-12 rounded bg-gray-200 animate-pulse ml-auto"></div></td>
                      <td className="px-4 py-4"><div className="h-4 w-12 rounded bg-gray-200 animate-pulse ml-auto"></div></td>
                      <td className="px-4 py-4"><div className="h-4 w-12 rounded bg-gray-200 animate-pulse ml-auto"></div></td>
                      <td className="px-4 py-4"><div className="h-4 w-12 rounded bg-gray-200 animate-pulse ml-auto"></div></td>
                      <td className="px-4 py-4"><div className="h-4 w-12 rounded bg-gray-200 animate-pulse ml-auto"></div></td>
                      <td className="px-4 py-4"><div className="h-4 w-12 rounded bg-gray-200 animate-pulse ml-auto"></div></td>
                      <td className="px-4 py-4"><div className="h-4 w-12 rounded bg-gray-200 animate-pulse ml-auto"></div></td>
                      <td className="px-4 py-4"><div className="h-4 w-32 rounded bg-gray-200 animate-pulse"></div></td>
                    </tr>
                  ))
                ) : produtosOrdenados.length === 0 ? (
                  <tr>
                    <td colSpan={23} className="px-6 py-20 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-fritz-stone-50 text-fritz-stone-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </div>
                        <h3 className="mb-1 text-lg font-bold text-fritz-stone-900">Nenhum produto encontrado</h3>
                      </div>
                    </td>
                  </tr>
                ) : (
                  produtosOrdenados.map((produtoBase) => {
                    const isEditado = !!rascunhos[produtoBase.code];
                    const produto = isEditado ? rascunhos[produtoBase.code] : produtoBase;
                    const isSelecionado = selecionados.has(produto.code);
                    
                    // Exibição híbrida para o Custo Migrado:
                    // Se foi editado e tem lastInboundPrice no rascunho, mostra o novo lastInboundPrice.
                    // Caso contrário, mostra o average original.
                    const valorExibicaoCustoMigrado = (isEditado && rascunhos[produtoBase.code].lastInboundPrice !== undefined)
                      ? rascunhos[produtoBase.code].lastInboundPrice 
                      : produtoBase.average;

                    return (
                      <tr 
                        key={produto.code} 
                        className={`transition-colors ${isEditado ? "bg-amber-50/50" : isSelecionado ? "bg-fritz-bright-50" : "hover:bg-fritz-stone-50"}`}
                      >
                        <td className="px-4 py-4 text-center align-middle">
                          <input 
                            type="checkbox" 
                            checked={isSelecionado}
                            onChange={() => toggleSelecionar(produto.code)}
                            className="h-4 w-4 rounded border-fritz-stone-300 text-fritz-bright-600 focus:ring-fritz-bright-600 cursor-pointer"
                          />
                        </td>

                        <td className="px-4 py-4 truncate text-fritz-stone-600 align-middle select-none" title={`${produto.familyCode || ''} - ${produto.familyDescription || 'Sem Família'}`}>
                          {produto.familyCode && (
                            <span className="inline-flex items-center justify-center rounded bg-fritz-stone-100 px-1.5 py-0.5 text-[10px] font-bold text-fritz-stone-500 mr-2 border border-fritz-stone-200">
                              {produto.familyCode}
                            </span>
                          )}
                          {produto.familyDescription || "-"}
                        </td>
                        
                        <td className="px-4 py-4 truncate align-middle">
                          <button
                            onClick={(e) => copiarCodigo(produto.code, e)}
                            className="group flex w-full items-center gap-2 text-fritz-stone-700 hover:text-fritz-bright-700 transition-colors focus:outline-none"
                            title="Clique para copiar"
                          >
                            <span className="text-sm font-medium">{produto.code}</span>
                            {copiado === produto.code ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-in zoom-in"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            )}
                          </button>
                        </td>
                        
                        <td className="px-4 py-4 align-middle">
                          <CelulaInteligente tipo="text" valor={produto.description} onChange={(val: string) => handleEdit(produtoBase, "description", val)} />
                        </td>

                        <td className="px-4 py-4 align-middle text-fritz-stone-700 text-center select-none text-sm font-medium">
                          {produto.lastInboundDate || "-"}
                        </td>
                        <td className="px-4 py-4 align-middle font-medium text-fritz-stone-600 text-right select-none">
                          {formatarMoeda(produto.lastInboundPrice)}
                        </td>
                        <td className="px-4 py-4 align-middle font-medium text-fritz-stone-600 text-right select-none">
                          {formatarMoeda(produto.inboundInvoicePrice)}
                        </td>
                        
                        <td className="px-4 py-4 align-middle font-medium text-fritz-bright-700">
                          {/* Modificação Custo Migrado */}
                          <CelulaInteligente 
                            tipo="moeda" 
                            align="right" 
                            valor={valorExibicaoCustoMigrado} 
                            onChange={(val: number) => handleEdit(produtoBase, "lastInboundPrice", val)} 
                          />
                        </td>
                        
                        <td className="px-4 py-4 align-middle font-bold text-fritz-green-700 text-right select-none">
                          {formatarMoeda(produto.basePrice)}
                        </td>

                        <td className="px-4 py-4 align-middle"><CelulaInteligente tipo="porcentagem" align="right" valor={produto.inboundIcms} onChange={(val: number) => handleEdit(produtoBase, "inboundIcms", val)} /></td>
                        <td className="px-4 py-4 align-middle"><CelulaInteligente tipo="porcentagem" align="right" valor={produto.inboundCofinsAndPis} onChange={(val: number) => handleEdit(produtoBase, "inboundCofinsAndPis", val)} /></td>
                        <td className="px-4 py-4 align-middle"><CelulaInteligente tipo="porcentagem" align="right" valor={produto.inboundIpi} onChange={(val: number) => handleEdit(produtoBase, "inboundIpi", val)} /></td>
                        <td className="px-4 py-4 align-middle"><CelulaInteligente tipo="porcentagem" align="right" valor={produto.inboundFreight} onChange={(val: number) => handleEdit(produtoBase, "inboundFreight", val)} /></td>

                        <td className="px-4 py-4 align-middle"><CelulaInteligente tipo="porcentagem" align="right" valor={produto.icms} onChange={(val: number) => handleEdit(produtoBase, "icms", val)} /></td>
                        <td className="px-4 py-4 align-middle"><CelulaInteligente tipo="porcentagem" align="right" valor={produto.ipi} onChange={(val: number) => handleEdit(produtoBase, "ipi", val)} /></td>
                        <td className="px-4 py-4 align-middle"><CelulaInteligente tipo="porcentagem" align="right" valor={produto.pis} onChange={(val: number) => handleEdit(produtoBase, "pis", val)} /></td>
                        <td className="px-4 py-4 align-middle"><CelulaInteligente tipo="porcentagem" align="right" valor={produto.cofins} onChange={(val: number) => handleEdit(produtoBase, "cofins", val)} /></td>
                        <td className="px-4 py-4 align-middle"><CelulaInteligente tipo="porcentagem" align="right" valor={produto.freight} onChange={(val: number) => handleEdit(produtoBase, "freight", val)} /></td>

                        <td className="px-4 py-4 align-middle"><CelulaInteligente tipo="porcentagem" align="right" valor={produto.fixedCoast} onChange={(val: number) => handleEdit(produtoBase, "fixedCoast", val)} /></td>
                        <td className="px-4 py-4 align-middle"><CelulaInteligente tipo="porcentagem" align="right" valor={produto.internalComission} onChange={(val: number) => handleEdit(produtoBase, "internalComission", val)} /></td>
                        <td className="px-4 py-4 align-middle"><CelulaInteligente tipo="porcentagem" align="right" valor={produto.externalComission} onChange={(val: number) => handleEdit(produtoBase, "externalComission", val)} /></td>
                        <td className="px-4 py-4 align-middle font-semibold text-fritz-stone-800">
                          <CelulaInteligente tipo="porcentagem" align="right" valor={produto.profit} onChange={(val: number) => handleEdit(produtoBase, "profit", val)} />
                        </td>

                        <td className="px-4 py-4 align-middle text-sm text-fritz-stone-500 select-none truncate" title={`Modificado por: ${produto.lastUpdateUser || 'Não informado'}`}>
                          {produto.lastUpdateDate ? (
                            <div className="flex flex-col gap-0.5">
                              <span className="font-medium text-fritz-stone-700">{produto.lastUpdateDate} às {produto.lastUpdateTime || "00:00"}</span>
                              <span className="text-xs uppercase text-fritz-stone-500 font-mono tracking-wide truncate max-w-[180px]">{produto.lastUpdateUser}</span>
                            </div>
                          ) : (
                            <span className="text-fritz-stone-300">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* RODAPÉ FIXO DE PAGINAÇÃO COM BOTÕES DUPLOS (PRIMEIRA/ÚLTIMA PÁGINA) */}
          {produtos.length > 0 && (
            <div className="flex items-center justify-between border-t border-fritz-stone-100 bg-white px-6 py-3 shrink-0">
              <div className="flex items-center gap-4">
                <span className="text-sm text-fritz-stone-500 hidden md:block">
                  Mostrando <span className="font-semibold text-fritz-stone-900">{produtos.length}</span> de <span className="font-semibold text-fritz-stone-900">{totalRegistros}</span> resultados
                </span>
                
                <div className="h-4 w-px bg-fritz-stone-200 mx-1 hidden md:block"></div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-fritz-stone-500 font-medium whitespace-nowrap">Por página:</span>
                  <div className="relative">
                    <select 
                      value={registrosPorPagina} 
                      onChange={(e) => {
                        const qtd = Number(e.target.value);
                        setRegistrosPorPagina(qtd);
                        buscarProdutos(1, busca, buscaFamilia, orderBy, ordenationType, qtd);
                      }}
                      className="appearance-none rounded-lg border border-fritz-stone-200 bg-fritz-stone-50 pl-3 pr-8 py-1.5 text-xs font-bold text-fritz-stone-700 outline-none transition-colors hover:bg-white focus:border-fritz-bright-600 focus:bg-white focus:ring-2 focus:ring-fritz-bright-100 cursor-pointer"
                    >
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                      <option value={200}>200</option>
                      <option value={300}>300</option>
                      <option value={500}>500</option>
                      <option value={1000}>1000</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-fritz-stone-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => mudarPagina(1)} 
                  disabled={pagina === 1} 
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-fritz-stone-200 text-fritz-stone-600 hover:bg-fritz-stone-50 disabled:opacity-50 transition-colors"
                  title="Primeira Página"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg>
                </button>
                <button 
                  onClick={() => mudarPagina(pagina - 1)} 
                  disabled={pagina === 1} 
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-fritz-stone-200 text-fritz-stone-600 hover:bg-fritz-stone-50 disabled:opacity-50 transition-colors"
                  title="Página Anterior"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <span className="text-sm font-medium text-fritz-stone-700 px-3">Página {pagina} de {totalPaginas}</span>
                <button 
                  onClick={() => mudarPagina(pagina + 1)} 
                  disabled={pagina >= totalPaginas} 
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-fritz-stone-200 text-fritz-stone-600 hover:bg-fritz-stone-50 disabled:opacity-50 transition-colors"
                  title="Próxima Página"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
                <button 
                  onClick={() => mudarPagina(totalPaginas)} 
                  disabled={pagina >= totalPaginas || totalPaginas === 0} 
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-fritz-stone-200 text-fritz-stone-600 hover:bg-fritz-stone-50 disabled:opacity-50 transition-colors"
                  title="Última Página"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {totalRascunhos > 0 && (
          <div className="sticky bottom-0 w-full bg-white border-t border-fritz-stone-200 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-40 p-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 animate-in slide-in-from-bottom-2 duration-300 mt-auto shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-fritz-stone-900">Modo Edição Ativo</p>
                <p className="text-xs text-fritz-stone-500">Você possui <strong className="text-amber-600">{totalRascunhos} produto{totalRascunhos > 1 ? 's' : ''}</strong> com alterações não salvas.</p>
              </div>
            </div>
            
            <div className="flex w-full md:w-auto gap-3">
              <Button 
                onClick={() => { setRascunhos({}); setSelecionados(new Set()); }} 
                disabled={salvando}
                className="flex-1 md:flex-none bg-white border border-fritz-stone-200 text-fritz-stone-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 px-6 py-2.5 rounded-xl transition-colors font-semibold text-sm"
              >
                Descartar
              </Button>
              <Button 
                onClick={salvarRascunhos} 
                disabled={salvando}
                className="flex-1 md:flex-none bg-fritz-bright-700 hover:bg-fritz-bright-800 text-white px-8 py-2.5 rounded-xl transition-colors font-semibold text-sm flex items-center justify-center gap-2"
              >
                {salvando ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Gravando no ERP...
                  </>
                ) : (
                  <>Salvar no Senior</>
                )}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}