"use client";

import { useEffect, useState, FormEvent, useRef } from "react";
import { Button } from "@/components/tailgrids/core/button";
import { PageHeader } from "@/components/PageHeader";
import { useEmpresa } from "@/contexts/EmpresaContext";

// ==========================================
// TIPAGENS
// ==========================================
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
  basePricePromo?: number;
};

type SortConfig = {
  key: keyof Product | null;
  direction: "asc" | "desc";
};

type ThOrdenavelProps = {
  id?: string;
  label: string;
  sortKey?: keyof Product;
  larguraInicial?: string;
  orderBy?: string[];
  ordenationType?: "asc" | "desc";
  align?: "left" | "right" | "center";
  highlightClass?: string;
  onSort?: (key: keyof Product, e: React.MouseEvent) => void;
  children?: React.ReactNode;
};

type DraftParameter = {
  tablePrice: string;
  dueDates: { initialDate: string; finalDate: string }[];
};

// ==========================================
// FUNÇÕES ÚTEIS
// ==========================================
const mascaraData = (valor: string) => {
  return valor
    .replace(/\D/g, "") 
    .replace(/(\d{2})(\d)/, "$1/$2") 
    .replace(/(\d{2})(\d)/, "$1/$2") 
    .slice(0, 10); 
};

// ==========================================
// COMPONENTES AUXILIARES
// ==========================================
const StepperVisual = ({ passoAtual }: { passoAtual: number }) => (
  <div className="flex items-center justify-center">
    <div className="flex items-center">
      <div className={`flex items-center justify-center w-7 h-7 text-xs rounded-full font-bold shadow-sm transition-colors duration-300 ${passoAtual >= 1 ? 'bg-fritz-bright-700 text-white ring-4 ring-fritz-bright-100' : 'bg-white border-2 border-fritz-stone-200 text-fritz-stone-400'}`}>1</div>
      <div className={`h-1 w-12 transition-colors duration-300 ${passoAtual >= 2 ? 'bg-fritz-bright-700' : 'bg-fritz-stone-200'}`}></div>
      <div className={`flex items-center justify-center w-7 h-7 text-xs rounded-full font-bold shadow-sm transition-colors duration-300 ${passoAtual >= 2 ? 'bg-fritz-bright-700 text-white ring-4 ring-fritz-bright-100' : 'bg-white border-2 border-fritz-stone-200 text-fritz-stone-400'}`}>2</div>
      <div className={`h-1 w-12 transition-colors duration-300 ${passoAtual >= 3 ? 'bg-fritz-bright-700' : 'bg-fritz-stone-200'}`}></div>
      <div className={`flex items-center justify-center w-7 h-7 text-xs rounded-full font-bold shadow-sm transition-colors duration-300 ${passoAtual >= 3 ? 'bg-fritz-bright-700 text-white ring-4 ring-fritz-bright-100' : 'bg-white border-2 border-fritz-stone-200 text-fritz-stone-400'}`}>3</div>
    </div>
  </div>
);

const ThOrdenavel = ({ id, label, sortKey, larguraInicial = "auto", orderBy = [], ordenationType = "asc", align = "left", highlightClass, onSort, children }: ThOrdenavelProps) => {
  const isSorted = sortKey && orderBy.includes(sortKey);
  const sortIndex = sortKey ? orderBy.indexOf(sortKey) : -1;
  const thRef = useRef<HTMLTableCellElement>(null);
  const storageKey = `fritz_coluna_promo_${String(sortKey || label)}`;
  
  const [largura, setLargura] = useState(larguraInicial);

  useEffect(() => {
    const larguraSalva = localStorage.getItem(storageKey);
    if (larguraSalva) setLargura(larguraSalva);
  }, [storageKey]);

  const iniciarRedimensionamento = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
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
    <th id={id} ref={thRef} style={{ width: largura, minWidth: largura, maxWidth: largura }} className={`sticky top-0 z-20 shadow-[0_1px_0_0_#e5e7eb] group transition-colors p-0 align-middle ${highlightClass || 'bg-fritz-stone-100 border-r border-transparent hover:border-fritz-stone-200'}`}>
      <div onClick={(e) => sortKey && onSort && onSort(sortKey, e)} className={`flex items-center gap-2 px-4 py-3 ${sortKey ? 'cursor-pointer hover:bg-black/5' : ''} select-none w-full h-full ${align === "right" ? "justify-end" : align === "center" ? "justify-center" : ""}`} title={sortKey ? "Clique para ordenar. Shift+Clique para ordenação múltipla." : undefined}>
        {children || <span className="truncate">{label}</span>}
        
        {isSorted && orderBy.length > 1 && (
          <span className="flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full bg-fritz-bright-700 text-[9px] font-bold text-white shadow-sm ml-1" title={`Prioridade de ordenação: ${sortIndex + 1}`}>
            {sortIndex + 1}
          </span>
        )}

        {sortKey && (
          <div className="flex flex-col shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`${isSorted && ordenationType === 'asc' ? 'text-current' : 'text-current opacity-30'}`}><polyline points="18 15 12 9 6 15"></polyline></svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`-mt-[2px] ${isSorted && ordenationType === 'desc' ? 'text-current' : 'text-current opacity-30'}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        )}
      </div>
      <div onMouseDown={iniciarRedimensionamento} onClick={(e) => e.stopPropagation()} className="absolute right-0 top-0 h-full w-[6px] cursor-col-resize bg-transparent group-hover:bg-black/20 hover:!bg-black/40 z-10 transform translate-x-1/2 transition-colors" title="Arraste para redimensionar" />
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
    if (tipo === "moeda" || tipo === "porcentagem" || tipo === "number") novoValor = novoValor === "" ? 0 : parseFloat(novoValor);
    onChange(novoValor);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Evita o comportamento padrão do Enter
      const input = e.currentTarget;
      const currentTd = input.closest('td');
      
      input.blur(); // Salva o valor da célula atual

      // Lógica para pular para a célula de baixo na mesma coluna
      if (currentTd) {
        const currentTr = currentTd.parentElement as HTMLTableRowElement;
        const tdIndex = Array.from(currentTr.children).indexOf(currentTd);
        const nextTr = currentTr.nextElementSibling as HTMLTableRowElement;

        if (nextTr) {
          const nextTd = nextTr.children[tdIndex] as HTMLTableCellElement;
          if (nextTd) {
            // Pequeno delay para dar tempo do React renderizar a célula novamente
            setTimeout(() => {
              const nextEditDiv = nextTd.querySelector('[tabindex="0"]') as HTMLElement;
              if (nextEditDiv) {
                nextEditDiv.focus();
                nextEditDiv.click(); // Dispara a edição da próxima célula
              }
            }, 50);
          }
        }
      }
    }
  };

  let exibicao = valor === null ? "-" : valor;
  if (tipo === "moeda") exibicao = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(valor) || 0);
  else if (tipo === "porcentagem") exibicao = `${Number(valor || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;

  if (editando) {
    return (
      <div className={`flex items-center h-[32px] gap-1 bg-white ring-2 ring-fritz-bright-600 rounded shadow-sm px-2 py-1 -mx-2`}>
        {prefixo && tipo !== 'moeda' && <span className="text-fritz-stone-400 text-xs font-semibold">{prefixo}</span>}
        <input type={tipo === "text" ? "text" : "number"} step="any" autoFocus onFocus={(e) => e.target.select()} value={valorInput} onChange={(e) => setValorInput(e.target.value)} onBlur={handleBlur} onKeyDown={handleKeyDown} className={`bg-transparent outline-none !border-0 !ring-0 !shadow-none text-fritz-stone-900 ${align === "right" ? "text-right" : "text-left"} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none font-medium w-full p-0 m-0`} />
        {sufixo && tipo !== 'porcentagem' && <span className="text-fritz-stone-400 text-xs font-semibold">{sufixo}</span>}
      </div>
    );
  }

  return (
    <div 
      tabIndex={0}
      onFocus={() => setEditando(true)}
      onClick={() => setEditando(true)} 
      className={`cursor-text border border-transparent hover:border-black/10 hover:bg-white focus:bg-white focus:ring-2 focus:ring-fritz-bright-600 focus:outline-none rounded px-2 py-1 -mx-2 text-sm text-current transition-colors ${tipo !== 'text' ? 'font-medium' : ''} ${align === "right" ? "text-right" : "text-left"}`}
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
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const familiasFiltradas = familias.filter((f: any) => f.nome.toLowerCase().includes(buscaInt.toLowerCase()) || f.codigo.toString().includes(buscaInt));
  const familiaAtual = familias.find((f: any) => f.codigo.toString() === valorSelecionado);

  return (
    <div ref={wrapperRef} className="relative w-full h-full">
      <div onClick={() => setIsOpen(!isOpen)} className="w-full h-full flex items-center justify-between rounded-xl border border-fritz-stone-200 bg-fritz-stone-50 px-4 py-2 text-sm text-fritz-stone-900 outline-none transition hover:bg-white hover:border-fritz-stone-300 cursor-pointer">
        <span className="truncate pr-4">{familiaAtual ? `${familiaAtual.codigo} - ${familiaAtual.nome}` : "Todas as Famílias"}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-fritz-stone-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
      </div>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full min-w-[280px] rounded-xl border border-fritz-stone-200 bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 border-b border-fritz-stone-100 bg-fritz-stone-50/50">
            <input type="text" autoFocus placeholder="Buscar código ou descrição..." value={buscaInt} onChange={(e) => setBuscaInt(e.target.value)} className="w-full rounded-lg border border-fritz-stone-200 bg-white px-3 py-2 text-sm text-fritz-stone-900 outline-none focus:border-fritz-bright-500 focus:ring-1 focus:ring-fritz-bright-500" />
          </div>
          <ul className="max-h-60 overflow-auto py-1">
            <li onClick={() => { onChange(""); setIsOpen(false); setBuscaInt(""); }} className={`px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-fritz-stone-100 ${valorSelecionado === "" ? "bg-fritz-bright-50 text-fritz-bright-700 font-semibold" : "text-fritz-stone-700"}`}>Todas as Famílias</li>
            {familiasFiltradas.length === 0 ? (
              <li className="px-4 py-3 text-sm text-fritz-stone-500 text-center">Nenhuma família encontrada</li>
            ) : (
              familiasFiltradas.map((f: any) => (
                <li key={f.codigo} onClick={() => { onChange(f.codigo.toString()); setIsOpen(false); setBuscaInt(""); }} className={`px-4 py-2 text-sm cursor-pointer transition-colors hover:bg-fritz-stone-100 flex items-center gap-2 truncate ${valorSelecionado === f.codigo.toString() ? "bg-fritz-bright-50 text-fritz-bright-700 font-semibold" : "text-fritz-stone-700"}`} title={`${f.codigo} - ${f.nome}`}>
                  <span className="shrink-0 w-12 text-fritz-stone-400 text-xs font-mono">{f.codigo}</span> <span className="truncate">{f.nome}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

// ==========================================
// COMPONENTE PRINCIPAL (PAGE)
// ==========================================
export default function PromocoesPage() {
  const { contexto, loadingContexto } = useEmpresa();

  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({ show: false, message: '', type: 'info' });
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const [autorizado, setAutorizado] = useState<boolean | null>(null);

  const [modoTela, setModoTela] = useState<'NOVA' | 'RASCUNHOS'>('NOVA');
  const [passoAtual, setPassoAtual] = useState(1);
  const [modalValidadeAberto, setModalValidadeAberto] = useState(false);
  const [modalSucessoAberto, setModalSucessoAberto] = useState(false);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [tabelaSelecionada, setTabelaSelecionada] = useState("");
  const [validadeSelecionada, setValidadeSelecionada] = useState("");
  
  const [dataInicioNova, setDataInicioNova] = useState("");
  const [dataFimNova, setDataFimNova] = useState("");
  const [gravandoNovaValidade, setGravandoNovaValidade] = useState(false);

  const [produtos, setProdutos] = useState<Product[]>([]);
  const [familiasDropdown, setFamiliasDropdown] = useState<{codigo: string, nome: string}[]>([]);
  const [tabelasSenior, setTabelasSenior] = useState<{codtpr: string, datini: string, datfim: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const [tabelaBuscaRascunho, setTabelaBuscaRascunho] = useState("");
  const [validadeBuscaRascunho, setValidadeBuscaRascunho] = useState("");
  const [parametrosRascunho, setParametrosRascunho] = useState<DraftParameter[]>([]);
  const [loadingRascunho, setLoadingRascunho] = useState(false);
  
  const [salvandoRascunho, setSalvandoRascunho] = useState(false);
  const [efetivandoPromocao, setEfetivandoPromocao] = useState(false);
  const [excluindoRascunho, setExcluindoRascunho] = useState(false);

  const [busca, setBusca] = useState(""); 
  const [buscaFamilia, setBuscaFamilia] = useState("");
  const [pagina, setPagina] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(50);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalRegistros, setTotalRegistros] = useState(0);
  
  // ESTADOS DE ORDENAÇÃO MÚLTIPLA E GLOBAL (TPV Pattern)
  const [orderBy, setOrderBy] = useState<string[]>(["description"]);
  const [ordenationType, setOrdenationType] = useState<"asc" | "desc">("asc");

  const [produtosSelecionados, setProdutosSelecionados] = useState<Map<string, Product>>(new Map());

  const [rascunhosPromo, setRascunhosPromo] = useState<Record<string, Product>>({});
  const [selecionadosOficina, setSelecionadosOficina] = useState<Set<string>>(new Set());
  
  // MODAIS E ESTADOS DA BARRA FLUTUANTE
  const [isBulkPromoOpen, setIsBulkPromoOpen] = useState(false);
  const [bulkPromoField, setBulkPromoField] = useState<keyof Product>("profit");
  const [bulkPromoValue, setBulkPromoValue] = useState<string>("");

  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [discountType, setDiscountType] = useState<"desconto" | "acrescimo">("desconto");
  const [discountValue, setDiscountValue] = useState<string>("");

  const scrollInternoRef = useRef<HTMLDivElement>(null);
  const inputBuscaRef = useRef<HTMLInputElement>(null);

  const formatarMoeda = (valor: number | undefined | null) => {
    if (valor === undefined || valor === null) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
  };

  useEffect(() => {
    const usuario = localStorage.getItem("usuario")?.toLowerCase() || "";
    if (usuario === "suporte" || usuario === "jair") setAutorizado(true);
    else setAutorizado(false);
  }, []);

  const carregarDadosIniciais = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !contexto?.empresa?.id) return;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/senior/companies`, { headers: { "Authorization": `Bearer ${token}` } });
      if (res.ok) {
        const text = await res.text();
        const data = text ? JSON.parse(text) : null;
        if (!data) return;
        
        const empresaAtual = data.find((e: any) => e.codigo === contexto.empresa.id);
        if (empresaAtual) {
          if (empresaAtual.familias) setFamiliasDropdown(empresaAtual.familias);
          if (empresaAtual.tabelasPreco) setTabelasSenior(empresaAtual.tabelasPreco);
        }
      }
    } catch (e) { console.error("Erro ao carregar dados iniciais", e); }
  };

  const carregarParametrosRascunho = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !contexto?.empresa?.id) return;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/findPromotionParameters?company=${contexto.empresa.id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setParametrosRascunho(data.response || []);
      }
    } catch (e) {
      console.error("Erro ao carregar parâmetros de rascunho", e);
    }
  };

  useEffect(() => {
    if (autorizado) {
      carregarDadosIniciais();
      carregarParametrosRascunho();
    }
  }, [contexto, autorizado]);

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
      const finalOrderBy = currentOrderBy.length > 0 
        ? currentOrderBy.map(field => ({ field })) 
        : [{ field: "description" }];

      const payload: Record<string, any> = { 
        company: String(contexto.empresa.id), 
        page: novaPagina, 
        searchParameters: termoAtual, 
        recordsPerPage: novaQtd,
        ordenationType: novaDirecaoOrd || ordenationType,
        orderBy: finalOrderBy
      };
      
      if (familiaAtual.trim() !== "") payload.family = familiaAtual.trim();

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/search`, {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erro ao buscar produtos");
      const data = await response.json();
      setProdutos(data.products || []);
      setTotalPaginas(data.totalPages || 0);
      setTotalRegistros(data.totalRecords || 0);
      setPagina(novaPagina);
    } catch (error) {
      showToast("Falha ao buscar produtos no ERP.", "error");
    } finally {
      setTimeout(() => setLoading(false), 100);
    }
  }

  async function carregarRascunhoSalvo(e: FormEvent) {
    e.preventDefault();
    if (!tabelaBuscaRascunho || !validadeBuscaRascunho || !contexto) return;

    setLoadingRascunho(true);
    const token = localStorage.getItem("token");

    try {
      const dataInicialSplit = (validadeBuscaRascunho.split(" - ")[0] || "").trim();

      const params = new URLSearchParams({
        company: String(contexto.empresa.id),
        tablePrice: tabelaBuscaRascunho,
        initialDate: dataInicialSplit,
        page: "1",
        recordsPerPage: "1000"
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/findPromotions?${params.toString()}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Erro na API de Busca");

      const data = await response.json();
      const itensEncontrados = data.products || data.response || (Array.isArray(data) ? data : []);

      if (!Array.isArray(itensEncontrados) || itensEncontrados.length === 0) {
        showToast("Nenhum produto pendente para esta tabela e validade.", "info");
        setLoadingRascunho(false);
        return;
      }

      const novoMapa = new Map<string, Product>();
      const novosRascunhos: Record<string, Product> = {};

      itensEncontrados.forEach((p: Product) => {
        novoMapa.set(p.code, p);
        novosRascunhos[p.code] = {
          ...p,
          basePricePromo: p.basePrice 
        };
      });
      
      setProdutosSelecionados(novoMapa);
      setRascunhosPromo(novosRascunhos);
      
      setTabelaSelecionada(tabelaBuscaRascunho);
      setValidadeSelecionada(validadeBuscaRascunho);
      setSelecionadosOficina(new Set());
      setPassoAtual(3);
      
      showToast("Rascunho carregado com sucesso!", "success");

    } catch (error) {
      showToast("Falha ao carregar o rascunho. Tente novamente.", "error");
    } finally {
      setLoadingRascunho(false);
    }
  }

  function mudarPagina(novaPagina: number) {
    if (novaPagina < 1 || novaPagina > totalPaginas) return;
    buscarProdutos(novaPagina, busca, buscaFamilia);
    if (scrollInternoRef.current) scrollInternoRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleSelecionarTodosCarrinho(e: React.ChangeEvent<HTMLInputElement>) {
    setProdutosSelecionados(prev => {
      const novoMap = new Map(prev);
      if (e.target.checked) produtos.forEach(p => novoMap.set(p.code, p)); 
      else produtos.forEach(p => novoMap.delete(p.code)); 
      return novoMap;
    });
  }

  function toggleSelecionarCarrinho(produto: Product) {
    setProdutosSelecionados(prev => {
      const novoMap = new Map(prev);
      if (novoMap.has(produto.code)) novoMap.delete(produto.code);
      else novoMap.set(produto.code, produto);
      return novoMap;
    });
  }

  useEffect(() => {
    if (!autorizado || !contexto || loadingContexto || modoTela === 'RASCUNHOS') return;
    const temporizadorDebounce = setTimeout(() => { buscarProdutos(1, busca, buscaFamilia); setPagina(1); }, 500); 
    return () => clearTimeout(temporizadorDebounce);
  }, [busca, buscaFamilia, contexto, loadingContexto, autorizado, modoTela]);

  function calcularPrecoSimulado(p: Product) {
    // Forçando a utilização do Valor Última Entrada do Produto (E075PRO.USU_VlrUep / inboundInvoicePrice)
    let precoMedio = p.inboundInvoicePrice || p.average || 0;
    
    const pctIcmEnt = p.inboundIcms || 0;
    const pctPccEnt = p.inboundCofinsAndPis || 0;
    const pctIpiEnt = p.inboundIpi || 0;
    const pctFreEnt = p.inboundFreight || 0;

    const valorIcmsEnt = precoMedio * (pctIcmEnt / 100);
    const basePccEnt = precoMedio - valorIcmsEnt;
    const valorPccEnt = basePccEnt * (pctPccEnt / 100);
    const valorIpiEnt = precoMedio * (pctIpiEnt / 100);
    const valorFreEnt = precoMedio * (pctFreEnt / 100);

    precoMedio = precoMedio - valorIcmsEnt - valorPccEnt + valorIpiEnt + valorFreEnt;

    const pctCusFix = p.fixedCoast || 0;
    const pctLucro = p.profit || 0;
    const pctIcmsVenda = p.icms || 0;
    const pctFrete = p.freight || 0;
    const pctIpi = p.ipi || 0;
    const pctCofins = p.cofins || 0;
    const pctPis = p.pis || 0;
    const pctComInt = p.internalComission || 0;
    const pctComExt = p.externalComission || 0;

    const somaPercentuais = pctCusFix + pctLucro + pctIcmsVenda + pctFrete + pctIpi + pctCofins + pctPis + pctComInt + pctComExt;

    if (somaPercentuais >= 100) return 0;
    return precoMedio / (1 - (somaPercentuais / 100));
  }

  function handleEditPromo(produtoBase: Product, campo: keyof Product, valor: any) {
    setRascunhosPromo(prev => {
      const produtoAtual = prev[produtoBase.code] || { ...produtoBase };
      
      // Regra dupla: Atualiza MedPon (average) e VlrUep (inboundInvoicePrice) simultaneamente
      if (campo === "average" || campo === "inboundInvoicePrice") {
        return { 
          ...prev, 
          [produtoBase.code]: { ...produtoAtual, average: valor, inboundInvoicePrice: valor } 
        };
      }

      return { ...prev, [produtoBase.code]: { ...produtoAtual, [campo]: valor } };
    });
  }

  function toggleSelecionarTodosOficina(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      const novos = new Set(selecionadosOficina);
      produtosNoCarrinhoOrdenados.forEach(p => novos.add(p.code));
      setSelecionadosOficina(novos);
    } else {
      setSelecionadosOficina(new Set());
    }
  }

  function toggleSelecionarOficina(codigo: string) {
    const novos = new Set(selecionadosOficina);
    novos.has(codigo) ? novos.delete(codigo) : novos.add(codigo);
    setSelecionadosOficina(novos);
  }

 function aplicarEdicaoEmMassaPromo(e: FormEvent) {
    e.preventDefault();
    const novoValor = parseFloat(bulkPromoValue);
    
    setRascunhosPromo(prev => {
      const novosRascunhos = { ...prev };
      selecionadosOficina.forEach(codigo => {
        const produtoOriginal = produtosSelecionados.get(codigo);
        if (produtoOriginal) {
          const base = novosRascunhos[codigo] || produtoOriginal;
          
          if (bulkPromoField === "average" || bulkPromoField === "inboundInvoicePrice") {
            novosRascunhos[codigo] = { ...base, average: novoValor, inboundInvoicePrice: novoValor };
          } else {
            novosRascunhos[codigo] = { ...base, [bulkPromoField]: novoValor };
          }
        }
      });
      return novosRascunhos;
    });
    
    setIsBulkPromoOpen(false);
    setBulkPromoValue("");
    // A seleção não é mais limpa aqui, permitindo aplicar novos campos em lote nos mesmos itens
    showToast(`Campo aplicado a ${selecionadosOficina.size} itens! A seleção foi mantida.`, "success");
  }

  function aplicarDescontoEmMassa(e: FormEvent) {
    e.preventDefault();
    const valorPerc = parseFloat(discountValue);
    if (isNaN(valorPerc) || valorPerc <= 0) return;

    setRascunhosPromo(prev => {
      const novosRascunhos = { ...prev };
      selecionadosOficina.forEach(codigo => {
        const produtoOriginal = produtosSelecionados.get(codigo);
        if (produtoOriginal) {
          const rascunhoAtual = novosRascunhos[codigo] || produtoOriginal;
          const precoBaseCalculado = calcularPrecoSimulado(rascunhoAtual);
          
          let novoPrecoFinal = precoBaseCalculado;
          if (discountType === "desconto") {
            novoPrecoFinal = precoBaseCalculado * (1 - valorPerc / 100);
          } else {
            novoPrecoFinal = precoBaseCalculado * (1 + valorPerc / 100);
          }
          
          novosRascunhos[codigo] = { ...rascunhoAtual, basePricePromo: novoPrecoFinal };
        }
      });
      return novosRascunhos;
    });
    
    setIsDiscountModalOpen(false);
    setDiscountValue("");
    setSelecionadosOficina(new Set());
    showToast(`Remarcação em massa aplicada a ${selecionadosOficina.size} itens!`, "success");
  }

  function sincronizarPrecosSimulados() {
    setRascunhosPromo(prev => {
      const novosRascunhos = { ...prev };
      selecionadosOficina.forEach(codigo => {
        const produtoOriginal = produtosSelecionados.get(codigo);
        if (produtoOriginal) {
          const rascunhoAtual = novosRascunhos[codigo] || produtoOriginal;
          const precoSimulado = calcularPrecoSimulado(rascunhoAtual);
          novosRascunhos[codigo] = { ...rascunhoAtual, basePricePromo: precoSimulado };
        }
      });
      return novosRascunhos;
    });
    showToast(`Preços sincronizados em ${selecionadosOficina.size} produtos!`, "success");
  }

  const abrirModalSetup = () => {
    setTabelaSelecionada("");
    setValidadeSelecionada("");
    setDataInicioNova("");
    setDataFimNova("");
    setModalValidadeAberto(true);
  };
  
  async function processarAvancoSimulacao(e: FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (validadeSelecionada === "NOVA") {
      setGravandoNovaValidade(true);
      try {
        const payloadWS1 = {
          company: contexto?.empresa.id,
          tablePrice: tabelaSelecionada,
          initialDate: dataInicioNova,
          finalDate: dataFimNova
        };
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/table-price/create-table-price-validate`, {
          method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, body: JSON.stringify(payloadWS1)
        });
        
        if (!response.ok) throw new Error("Falha ao criar validade.");
        
        await carregarDadosIniciais();
        
        setValidadeSelecionada(`${dataInicioNova} - ${dataFimNova}`);
        showToast("Nova validade criada no Senior com sucesso!", "success");
      } catch (err) { 
        showToast("Erro ao criar nova validade no Senior.", "error");
        setGravandoNovaValidade(false);
        return; 
      }
      setGravandoNovaValidade(false);
    }

    setRascunhosPromo({});
    setSelecionadosOficina(new Set());
    setModalValidadeAberto(false);
    setPassoAtual(3);
  }

  const voltarParaSelecao = () => { setPassoAtual(1); setModalValidadeAberto(false); };

  function montarPayloadCampanha() {
    const dataInicialSplit = (validadeSelecionada.split(" - ")[0] || "").trim();
    
    return {
      company: String(contexto?.empresa.id || ""), 
      tablePrice: tabelaSelecionada,
      initialDate: dataInicialSplit,
      products: produtosNoCarrinhoOrdenados
        .filter(p => selecionadosOficina.has(p.code))
        .map(p => {
          const r = rascunhosPromo[p.code] || p;
          const precoFinal = r.basePricePromo !== undefined ? r.basePricePromo : p.basePrice;
          
          return {
            code: String(r.code),
            average: Number(r.average) || 0,
            icms: Number(r.icms) || 0,
            externalComission: Number(r.externalComission) || 0,
            internalComission: Number(r.internalComission) || 0,
            freight: Number(r.freight) || 0,
            ipi: Number(r.ipi) || 0,
            profit: Number(r.profit) || 0,
            pis: Number(r.pis) || 0,
            cofins: Number(r.cofins) || 0,
            inboundIcms: Number(r.inboundIcms) || 0,
            inboundCofinsAndPis: Number(r.inboundCofinsAndPis) || 0,
            inboundIpi: Number(r.inboundIpi) || 0,
            inboundFreight: Number(r.inboundFreight) || 0,
            fixedCoast: Number(r.fixedCoast) || 0,
            inboundInvoicePrice: Number(r.inboundInvoicePrice) || 0,
            basePrice: Number(precoFinal) ? parseFloat(Number(precoFinal).toFixed(2)) : 0
          };
      })
    };
  }

  async function salvarRascunhoSenior() {
    if (selecionadosOficina.size === 0) {
      showToast("Por favor, marque as caixas dos produtos que deseja salvar.", "info");
      return;
    }

    setSalvandoRascunho(true);
    const token = localStorage.getItem("token");
    try {
      const payload = montarPayloadCampanha();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/promotion`, {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Erro na API");
      
      showToast("Rascunho de simulação salvo com sucesso! Você pode retomar mais tarde.", "success");
      await carregarParametrosRascunho();
    } catch (e) { 
      showToast("Erro ao salvar simulação.", "error"); 
    } finally { 
      setSalvandoRascunho(false); 
    }
  }

  async function executarExclusaoRascunho(silencioso = false) {
    const token = localStorage.getItem("token");
    if (!silencioso) setExcluindoRascunho(true);
    try {
      const dataInicialSplit = (validadeSelecionada.split(" - ")[0] || "").trim();
      
      const itensParaDeletar = Array.from(selecionadosOficina).map(code => ({ code: String(code) }));

      if (itensParaDeletar.length === 0) {
        if (!silencioso) {
          showToast("Selecione pelo menos um produto para excluir.", "info");
          setModalExcluirAberto(false);
          setExcluindoRascunho(false);
        }
        return;
      }
      
      const payloadDelete = {
        company: String(contexto?.empresa.id || ""),
        tablePrice: tabelaSelecionada,
        initialDate: dataInicialSplit,
        products: itensParaDeletar
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/promotion`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payloadDelete)
      });
      
      if (!response.ok && !silencioso) throw new Error("Falha na exclusão");

      if (!silencioso) {
        showToast(`${itensParaDeletar.length} rascunho(s) excluído(s) com sucesso.`, "success");
        
        setProdutosSelecionados(prev => {
          const novoMapa = new Map(prev);
          itensParaDeletar.forEach(item => novoMapa.delete(item.code));
          return novoMapa;
        });
        
        setSelecionadosOficina(new Set());
        setModalExcluirAberto(false);

        await carregarParametrosRascunho();

        if (produtosSelecionados.size - itensParaDeletar.length === 0) {
          setPassoAtual(1);
          setModoTela("RASCUNHOS");
        }
      }
    } catch (e) {
      if (!silencioso) showToast("Erro ao tentar excluir o(s) rascunho(s).", "error");
    } finally {
      if (!silencioso) setExcluindoRascunho(false);
    }
  }

  async function efetivarCampanhaSenior() {
    if (selecionadosOficina.size === 0) {
      showToast("Por favor, marque as caixas dos produtos que deseja efetivar.", "info");
      return;
    }

    setEfetivandoPromocao(true);
    const token = localStorage.getItem("token");
    try {
      const payload = montarPayloadCampanha();
      
      const responseSimulacao = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/promotion`, {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, body: JSON.stringify(payload)
      });
      if (!responseSimulacao.ok) throw new Error("Erro na API de Simulação");

      const responseEfetivar = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/assignment`, {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, body: JSON.stringify(payload)
      });
      if (!responseEfetivar.ok) throw new Error("Erro na API de Efetivação");
      
      await executarExclusaoRascunho(true);
      await carregarParametrosRascunho();

      setModalSucessoAberto(true);
      setProdutosSelecionados(new Map());
      setRascunhosPromo({});
      setSelecionadosOficina(new Set());
    } catch (e) { 
      showToast("O servidor recusou a efetivação. O rascunho deve ser salvo antes.", "error");
    } finally { 
      setEfetivandoPromocao(false); 
    }
  }

  function fecharSucesso() {
    setModalSucessoAberto(false);
    setPassoAtual(1);
    setModoTela("NOVA");
  }

  // --- FUNÇÃO DE ORDENAÇÃO MÚLTIPLA TPV ---
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
    
    if (passoAtual === 1) {
      buscarProdutos(1, busca, buscaFamilia, newOrderBy, newDirection, registrosPorPagina);
    }
  }

  function limparOrdenacao() {
    const defaultOrderBy = ["description"];
    setOrderBy(defaultOrderBy);
    setOrdenationType("asc");
    if (passoAtual === 1) {
      buscarProdutos(1, busca, buscaFamilia, defaultOrderBy, "asc", registrosPorPagina);
    }
  }

  const produtosNoCarrinho = Array.from(produtosSelecionados.values());
  const produtosNoCarrinhoOrdenados = produtosNoCarrinho.sort((a, b) => {
    if (orderBy.length === 0) return 0;
    for (const key of orderBy) {
      const valA = rascunhosPromo[a.code]?.[key as keyof Product] ?? a[key as keyof Product];
      const valB = rascunhosPromo[b.code]?.[key as keyof Product] ?? b[key as keyof Product];
      
      if (valA === valB) continue;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;
      
      if (valA < valB) return ordenationType === "asc" ? -1 : 1;
      if (valA > valB) return ordenationType === "asc" ? 1 : -1;
    }
    return 0;
  });

  const todosDoCarrinhoSelecionados = produtos.length > 0 && produtos.every(p => produtosSelecionados.has(p.code));
  const todosDaOficinaSelecionados = produtosNoCarrinhoOrdenados.length > 0 && produtosNoCarrinhoOrdenados.every(p => selecionadosOficina.has(p.code));
  const quantidadeCarrinho = produtosSelecionados.size;

  const tabelasUnicas = Array.from(new Set(tabelasSenior.map(t => t.codtpr)));
  const validadesDisponiveisSetup = tabelasSenior.filter(t => t.codtpr === tabelaSelecionada);
  
  const validadesRascunhoSelecionado = parametrosRascunho.find(p => p.tablePrice === tabelaBuscaRascunho)?.dueDates || [];

  const formatarDataErp = (dataStr: string) => {
    if (!dataStr) return "";
    if (dataStr.includes("/")) return dataStr.split("T")[0];
    const partes = dataStr.split("T")[0].split("-");
    if (partes.length === 3) return `${partes[2]}/${partes[1]}/${partes[0]}`;
    return dataStr;
  };

  if (autorizado === false) {
    return (
      <div className="flex min-h-screen bg-fritz-stone-50 w-full items-center justify-center">
        <div className="text-center p-8 max-w-lg bg-white rounded-3xl shadow-sm border border-fritz-stone-200">
           <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-fritz-stone-100 text-fritz-stone-400 mb-6">
             <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
           </div>
           <h2 className="text-2xl font-black text-fritz-stone-900 mb-2">Módulo em Desenvolvimento</h2>
           <p className="text-fritz-stone-500 mb-8">O Gerador de Promoções está em fase final de testes internos e em breve estará disponível para sua conta.</p>
           <div className="flex w-full justify-center">
             <Button onClick={() => window.location.href = '/produtos'} className="bg-fritz-stone-800 hover:bg-fritz-stone-900 text-white py-3 px-8 rounded-xl font-bold">
               Voltar para a Tabela Principal
             </Button>
           </div>
        </div>
      </div>
    );
  }

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
          title="Gerador de Tabelas Promocionais" 
          description="Construa campanhas de preços massivas e valide os lucros em tempo real."
          badgeText="Integrado ao ERP Senior"
        />
      </div>

      {/* Corpo com Flex Dynamic Fill */}
      <main className="flex-1 flex flex-col w-full min-h-0 px-8 pb-4 pt-2">
        
        {passoAtual === 1 && (
          <div className="flex items-center justify-between shrink-0 mb-3 mt-1">
            <div className="flex bg-fritz-stone-100/80 p-1 rounded-xl w-fit border border-fritz-stone-200 shadow-inner">
              <button 
                onClick={() => { setModoTela('NOVA'); setProdutosSelecionados(new Map()); }} 
                className={`px-8 py-2 font-bold text-sm transition-all duration-200 rounded-lg flex items-center gap-2 ${modoTela === 'NOVA' ? 'bg-white text-fritz-bright-700 shadow-sm ring-1 ring-fritz-stone-200/50' : 'text-fritz-stone-500 hover:text-fritz-stone-700 hover:bg-fritz-stone-200/50'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                Criar Nova Campanha
              </button>
              <button 
                onClick={() => { setModoTela('RASCUNHOS'); setProdutosSelecionados(new Map()); }} 
                className={`px-8 py-2 font-bold text-sm transition-all duration-200 rounded-lg flex items-center gap-2 ${modoTela === 'RASCUNHOS' ? 'bg-white text-fritz-bright-700 shadow-sm ring-1 ring-fritz-stone-200/50' : 'text-fritz-stone-500 hover:text-fritz-stone-700 hover:bg-fritz-stone-200/50'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                Meus Rascunhos Salvos
              </button>
            </div>
            <StepperVisual passoAtual={passoAtual} />
          </div>
        )}

        {passoAtual !== 1 && (
          <div className="flex justify-center mb-6 mt-2 shrink-0">
             <StepperVisual passoAtual={passoAtual} />
          </div>
        )}

        {passoAtual === 1 && modoTela === 'NOVA' && (
          <div className="flex flex-col flex-1 min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            {orderBy.length > 1 && (
              <div className="mb-3 flex items-center gap-3 bg-fritz-bright-50/80 border border-fritz-bright-200 text-fritz-bright-800 px-5 py-3 rounded-xl text-sm animate-in fade-in slide-in-from-top-2 shadow-sm shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-fritz-bright-600"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>
                <span><strong>Ordenação Múltipla Ativa:</strong> A tabela está cruzando e ordenando dados de {orderBy.length} colunas simultaneamente.</span>
                <button onClick={limparOrdenacao} className="ml-auto text-xs font-bold text-fritz-bright-700 hover:text-fritz-bright-900 underline transition-colors px-2 py-1">
                  Restaurar Padrão
                </button>
              </div>
            )}

            <div className="mb-3 rounded-2xl bg-white p-3 shadow-sm border border-fritz-stone-200 shrink-0">
              <form onSubmit={(e) => { e.preventDefault(); buscarProdutos(1, busca, buscaFamilia); }} className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="relative md:col-span-3 z-30">
                  <ComboboxFamilia familias={familiasDropdown} valorSelecionado={buscaFamilia} onChange={setBuscaFamilia} />
                </div>
                <div className="relative md:col-span-7">
                  <input ref={inputBuscaRef} type="text" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Pesquisar por código, descrição ou palavra-chave..." className="w-full rounded-xl border border-fritz-stone-200 bg-fritz-stone-50 pl-4 pr-12 py-2 text-sm text-fritz-stone-900 outline-none transition focus:border-fritz-bright-600 focus:bg-white focus:ring-2 focus:ring-fritz-bright-100" />
                  {(busca || buscaFamilia) && !loading && (
                    <button type="button" onClick={() => { setBusca(""); setBuscaFamilia(""); buscarProdutos(1, "", ""); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-fritz-stone-400 hover:text-fritz-stone-700 p-1">
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
                  <Button type="submit" disabled={loading} className="w-full bg-fritz-stone-800 hover:bg-fritz-stone-900 text-white py-2 rounded-xl font-semibold text-sm h-full flex justify-center items-center">
                    Filtrar Itens
                  </Button>
                </div>
              </form>
            </div>

            <div className="rounded-2xl border border-fritz-stone-200 bg-white shadow-sm overflow-hidden flex-1 flex flex-col min-h-0 mb-4 z-10">
              <div ref={scrollInternoRef} className="overflow-auto flex-1 relative">
                <table className="w-full text-left text-sm text-fritz-stone-700 table-fixed min-w-max">
                  <thead className="bg-fritz-stone-100/50 text-xs font-semibold uppercase tracking-wider text-fritz-stone-500">
                    <tr>
                      <ThOrdenavel label="Check" larguraInicial="60px" align="center">
                        <div className="flex items-center justify-center w-full">
                          <input type="checkbox" checked={todosDoCarrinhoSelecionados} onChange={toggleSelecionarTodosCarrinho} className="h-4 w-4 rounded border-fritz-stone-300 text-fritz-bright-600 focus:ring-fritz-bright-600 cursor-pointer" />
                        </div>
                      </ThOrdenavel>
                      <ThOrdenavel label="Família" sortKey="familyDescription" larguraInicial="200px" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                      <ThOrdenavel label="Código" sortKey="code" larguraInicial="140px" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                      <ThOrdenavel label="Descrição do Produto" sortKey="description" larguraInicial="400px" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                      
                      <ThOrdenavel label="Custo Base (VlrUep)" sortKey="inboundInvoicePrice" larguraInicial="160px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                      <ThOrdenavel label="Preço Base Atual" sortKey="basePrice" larguraInicial="180px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-fritz-stone-100 bg-white relative z-0">
                    {loadingContexto || (loading && produtos.length === 0) ? (
                      Array.from({ length: 8 }).map((_, index) => (
                        <tr key={`sk-${index}`}>
                          <td className="px-4 py-3 text-center"><div className="h-4 w-4 rounded bg-gray-200 animate-pulse inline-block" /></td>
                          <td className="px-4 py-3"><div className="h-4 w-24 rounded bg-gray-200 animate-pulse" /></td>
                          <td className="px-4 py-3"><div className="h-4 w-16 rounded bg-gray-200 animate-pulse" /></td>
                          <td className="px-4 py-3"><div className="h-4 w-64 rounded bg-gray-200 animate-pulse" /></td>
                          <td className="px-4 py-3"><div className="h-4 w-16 rounded bg-gray-200 animate-pulse ml-auto" /></td>
                          <td className="px-4 py-3"><div className="h-4 w-16 rounded bg-gray-200 animate-pulse ml-auto" /></td>
                        </tr>
                      ))
                    ) : produtos.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-20 text-center">
                          <div className="mx-auto flex max-w-sm flex-col items-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-fritz-stone-50 text-fritz-stone-400">
                              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </div>
                            <h3 className="mb-1 text-lg font-bold text-fritz-stone-900">Nenhum produto encontrado</h3>
                            <p className="text-sm text-fritz-stone-500 mt-1">Tente ajustar os filtros ou os termos da busca para encontrar o que precisa.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      produtos.map((produto) => {
                        const isSelecionado = produtosSelecionados.has(produto.code);
                        return (
                          <tr key={produto.code} className={`transition-colors cursor-pointer ${isSelecionado ? "bg-fritz-bright-50/70" : "hover:bg-fritz-stone-50"}`} onClick={() => toggleSelecionarCarrinho(produto)}>
                            <td className="px-4 py-3 text-center align-middle" onClick={(e) => e.stopPropagation()}>
                              <input type="checkbox" checked={isSelecionado} onChange={() => toggleSelecionarCarrinho(produto)} className="h-4 w-4 rounded border-fritz-stone-300 text-fritz-bright-600 focus:ring-fritz-bright-600 cursor-pointer" />
                            </td>
                            <td className="px-4 py-3 truncate text-fritz-stone-600 align-middle">
                              {produto.familyCode && <span className="inline-flex items-center justify-center rounded bg-fritz-stone-100 px-1.5 py-0.5 text-[10px] font-bold text-fritz-stone-500 mr-2 border border-fritz-stone-200">{produto.familyCode}</span>}
                              {produto.familyDescription}
                            </td>
                            <td className="px-4 py-3 truncate align-middle font-medium">{produto.code}</td>
                            <td className="px-4 py-3 align-middle truncate">{produto.description}</td>
                            <td className="px-4 py-3 align-middle font-medium text-fritz-stone-600 text-right">{formatarMoeda(produto.inboundInvoicePrice)}</td>
                            <td className="px-4 py-3 align-middle font-bold text-fritz-stone-800 text-right">{formatarMoeda(produto.basePrice)}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* RODAPÉ FIXO NA GRID DO PASSO 1 */}
              {produtos.length > 0 && (
                <div className="flex items-center justify-between border-t border-fritz-stone-100 bg-white px-6 py-3 shrink-0 gap-4 flex-wrap md:flex-nowrap">
                  
                  {/* BLOCO 1: ESQUERDA (Info + Select + Limpar) */}
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-fritz-stone-500 hidden md:block whitespace-nowrap">
                      Mostrando <span className="font-semibold text-fritz-stone-900">{produtos.length}</span> de <span className="font-semibold text-fritz-stone-900">{totalRegistros}</span> resultados
                    </div>
                    
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
                          className="appearance-none rounded-lg border border-fritz-stone-200 bg-fritz-stone-50 pl-3 pr-8 py-1.5 text-xs font-bold text-fritz-stone-700 outline-none transition-colors hover:bg-white focus:border-fritz-bright-600 focus:bg-white focus:ring-2 focus:ring-fritz-bright-100 cursor-pointer w-full"
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

                    {quantidadeCarrinho > 0 && (
                      <button type="button" onClick={() => setProdutosSelecionados(new Map())} className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline transition-colors px-2 py-1 whitespace-nowrap ml-2">
                        Limpar Seleção ({quantidadeCarrinho})
                      </button>
                    )}
                  </div>

                  {/* BLOCO 2: DIREITA (Paginação + Botão Principal) */}
                  <div className="flex items-center gap-6">
                    
                    {/* Paginação */}
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => mudarPagina(1)} disabled={pagina === 1} className="flex h-9 w-9 items-center justify-center rounded-lg border border-fritz-stone-200 text-fritz-stone-600 hover:bg-fritz-stone-50 disabled:opacity-50 transition-colors" title="Primeira Página">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg>
                      </button>
                      <button onClick={() => mudarPagina(pagina - 1)} disabled={pagina === 1} className="flex h-9 w-9 items-center justify-center rounded-lg border border-fritz-stone-200 text-fritz-stone-600 hover:bg-fritz-stone-50 disabled:opacity-50 transition-colors" title="Página Anterior">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                      </button>
                      <span className="text-sm font-medium text-fritz-stone-700 px-3 whitespace-nowrap">Página {pagina} de {totalPaginas || 1}</span>
                      <button onClick={() => mudarPagina(pagina + 1)} disabled={pagina >= totalPaginas} className="flex h-9 w-9 items-center justify-center rounded-lg border border-fritz-stone-200 text-fritz-stone-600 hover:bg-fritz-stone-50 disabled:opacity-50 transition-colors" title="Próxima Página">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      </button>
                      <button onClick={() => mudarPagina(totalPaginas)} disabled={pagina >= totalPaginas || totalPaginas === 0} className="flex h-9 w-9 items-center justify-center rounded-lg border border-fritz-stone-200 text-fritz-stone-600 hover:bg-fritz-stone-50 disabled:opacity-50 transition-colors" title="Última Página">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>
                      </button>
                    </div>

                    {/* Divisória visual sutil entre a paginação e o botão */}
                    <div className="h-6 w-px bg-fritz-stone-200 hidden md:block"></div>

                    {/* Botão de Ação */}
                    <Button onClick={abrirModalSetup} disabled={quantidadeCarrinho === 0} className="bg-fritz-bright-700 hover:bg-fritz-bright-800 disabled:bg-fritz-stone-300 disabled:text-fritz-stone-500 text-white px-8 py-2 rounded-xl font-semibold shadow-sm transition-all whitespace-nowrap">
                      Configurar Campanha ({quantidadeCarrinho})
                    </Button>
                  </div>

                </div>
              )}
            </div>
          </div>
        )}

        {passoAtual === 1 && modoTela === 'RASCUNHOS' && (
          <div className="flex flex-col items-center justify-center flex-1 animate-in fade-in slide-in-from-top-2 duration-300 min-h-0">
            <div className="bg-white rounded-3xl shadow-sm border border-fritz-stone-200 w-full max-w-xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-fritz-bright-700"></div>
              <div className="p-10 text-center">
                
                {parametrosRascunho.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 animate-in zoom-in-95 duration-300">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-fritz-stone-50 text-fritz-stone-300 mb-6 border-2 border-dashed border-fritz-stone-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </div>
                    <h3 className="text-2xl font-black text-fritz-stone-900 mb-2 tracking-tight">Tudo limpo por aqui!</h3>
                    <p className="text-sm text-fritz-stone-500 mb-8 max-w-[300px] mx-auto">Você não possui nenhum rascunho pendente de precificação no ERP Senior neste momento.</p>
                    <Button onClick={() => setModoTela('NOVA')} className="bg-fritz-stone-900 hover:bg-fritz-stone-800 text-white py-3 px-8 rounded-xl font-bold shadow-md transition-transform active:scale-[0.98]">
                      Criar Nova Campanha
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-fritz-stone-100 text-fritz-stone-600 mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                    </div>
                    <h3 className="text-2xl font-black text-fritz-stone-900 mb-2 tracking-tight">Recuperar Rascunho do Senior</h3>
                    <p className="text-sm text-fritz-stone-500 mb-8">Selecione a Tabela e a Validade para retomar os cálculos e edições de onde você parou.</p>
                    
                    <form onSubmit={carregarRascunhoSalvo} className="space-y-5 text-left">
                      <div>
                        <label className="block text-sm font-semibold text-fritz-stone-700 mb-1.5">Tabela de Destino</label>
                        <select 
                          required 
                          value={tabelaBuscaRascunho} 
                          onChange={(e) => { setTabelaBuscaRascunho(e.target.value); setValidadeBuscaRascunho(""); }} 
                          className="w-full rounded-xl border border-fritz-stone-200 bg-fritz-stone-50 px-4 py-3 text-sm text-fritz-stone-900 outline-none focus:border-fritz-bright-600 focus:bg-white focus:ring-2 focus:ring-fritz-bright-100"
                        >
                          <option value="">Selecione uma tabela...</option>
                          {parametrosRascunho.map(p => (
                            <option key={p.tablePrice} value={p.tablePrice}>Tabela {p.tablePrice}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-fritz-stone-700 mb-1.5">Validade da Campanha</label>
                        <select 
                          required 
                          value={validadeBuscaRascunho} 
                          onChange={(e) => setValidadeBuscaRascunho(e.target.value)} 
                          disabled={!tabelaBuscaRascunho}
                          className="w-full rounded-xl border border-fritz-stone-200 bg-fritz-stone-50 px-4 py-3 text-sm text-fritz-stone-900 outline-none focus:border-fritz-bright-600 focus:bg-white focus:ring-2 focus:ring-fritz-bright-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">Selecione o período do rascunho...</option>
                          {validadesRascunhoSelecionado.map((val, idx) => (
                            <option key={idx} value={`${val.initialDate} - ${val.finalDate}`}>
                              {val.initialDate} a {val.finalDate}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="pt-6">
                        <Button type="submit" disabled={loadingRascunho} className="w-full bg-fritz-stone-800 hover:bg-fritz-stone-900 text-white py-4 rounded-xl font-bold shadow-md flex justify-center items-center gap-2 transition-transform active:scale-[0.98]">
                          {loadingRascunho ? (
                            <>
                              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                              Buscando no ERP...
                            </>
                          ) : (
                            "Carregar Rascunho Completo"
                          )}
                        </Button>
                      </div>
                    </form>
                  </>
                )}

              </div>
            </div>
          </div>
        )}

        {modalValidadeAberto && (
          <div className="fixed inset-0 bg-fritz-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-xl w-[500px] overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-fritz-bright-100 text-fritz-bright-700 font-bold">2</div>
                  <h3 className="text-xl font-black text-fritz-stone-900">Configurar Campanha</h3>
                </div>
                <p className="text-sm text-fritz-stone-500 mb-6">Preencha os dados do Senior para os {quantidadeCarrinho} itens selecionados.</p>
                
                <form onSubmit={processarAvancoSimulacao} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-fritz-stone-700 mb-1.5">Tabela de Destino</label>
                    <select 
                      required 
                      value={tabelaSelecionada} 
                      onChange={(e) => { setTabelaSelecionada(e.target.value); setValidadeSelecionada(""); }} 
                      className="w-full rounded-xl border border-fritz-stone-200 bg-fritz-stone-50 px-4 py-3 text-sm text-fritz-stone-900 outline-none focus:border-fritz-bright-600 focus:bg-white focus:ring-2 focus:ring-fritz-bright-100"
                    >
                      <option value="">Selecione uma tabela...</option>
                      {tabelasUnicas.map(cod => (
                        <option key={cod} value={cod}>Tabela {cod}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-fritz-stone-700 mb-1.5">Validade da Campanha</label>
                    <select 
                      required 
                      value={validadeSelecionada} 
                      onChange={(e) => setValidadeSelecionada(e.target.value)} 
                      disabled={!tabelaSelecionada}
                      className="w-full rounded-xl border border-fritz-stone-200 bg-fritz-stone-50 px-4 py-3 text-sm text-fritz-stone-900 outline-none focus:border-fritz-bright-600 focus:bg-white focus:ring-2 focus:ring-fritz-bright-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Selecione um período...</option>
                      {validadesDisponiveisSetup.map((val, idx) => {
                         const dtIni = formatarDataErp(val.datini);
                         const dtFim = formatarDataErp(val.datfim);
                         return (
                           <option key={idx} value={`${dtIni} - ${dtFim}`}>{dtIni} a {dtFim}</option>
                         );
                      })}
                      <option value="NOVA" className="font-bold text-fritz-bright-700">+ Criar nova validade no Senior</option>
                    </select>
                  </div>

                  {validadeSelecionada === "NOVA" && (
                    <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-200/60 grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                      <div className="col-span-2 text-xs font-bold text-amber-800 uppercase tracking-wider">Nova Validade do Senior</div>
                      <div>
                        <label className="block text-xs font-semibold text-fritz-stone-600 mb-1.5">Data Início</label>
                        <input type="text" placeholder="DD/MM/AAAA" required maxLength={10} value={dataInicioNova} onChange={(e) => setDataInicioNova(mascaraData(e.target.value))} className="w-full rounded-lg border border-fritz-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-fritz-bright-600 focus:ring-2 focus:ring-fritz-bright-100" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-fritz-stone-600 mb-1.5">Data Fim</label>
                        <input type="text" placeholder="DD/MM/AAAA" required maxLength={10} value={dataFimNova} onChange={(e) => setDataFimNova(mascaraData(e.target.value))} className="w-full rounded-lg border border-fritz-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-fritz-bright-600 focus:ring-2 focus:ring-fritz-bright-100" />
                      </div>
                    </div>
                  )}

                  <div className="pt-6 flex gap-3">
                    <Button type="button" onClick={() => { setModalValidadeAberto(false); setPassoAtual(1); }} className="flex-1 bg-white border border-fritz-stone-200 text-fritz-stone-700 hover:bg-fritz-stone-50 py-3 rounded-xl font-semibold">Voltar</Button>
                    <Button type="submit" disabled={gravandoNovaValidade} className="flex-1 bg-fritz-bright-700 hover:bg-fritz-bright-800 text-white py-3 rounded-xl font-semibold flex justify-center items-center">
                      {gravandoNovaValidade ? "Validando no ERP..." : "Simular preços"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {passoAtual === 3 && (
          <div className="bg-white rounded-2xl border border-fritz-stone-200 shadow-sm p-6 flex flex-col flex-1 animate-in fade-in slide-in-from-right-8 duration-300 relative min-h-0">
            
            {orderBy.length > 1 && (
              <div className="mb-3 flex items-center gap-3 bg-fritz-bright-50/80 border border-fritz-bright-200 text-fritz-bright-800 px-5 py-3 rounded-xl text-sm animate-in fade-in slide-in-from-top-2 shadow-sm shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-fritz-bright-600"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>
                <span><strong>Ordenação Múltipla Ativa:</strong> A tabela está cruzando e ordenando dados de {orderBy.length} colunas simultaneamente.</span>
                <button onClick={limparOrdenacao} className="ml-auto text-xs font-bold text-fritz-bright-700 hover:text-fritz-bright-900 underline transition-colors px-2 py-1">
                  Restaurar Padrão
                </button>
              </div>
            )}

            {/* BARRA FLUTUANTE DE AÇÕES */}
            {selecionadosOficina.size > 0 && (
              <div className="absolute top-2 left-0 right-0 z-50 flex justify-center w-full pointer-events-none">
                <div className="bg-fritz-stone-900 text-white rounded-full px-6 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-center gap-4 animate-in slide-in-from-top-4 fade-in duration-300 border border-fritz-stone-700 pointer-events-auto">
                  <span className="text-sm font-semibold">{selecionadosOficina.size} na fila de edição</span>
                  <div className="w-px h-4 bg-fritz-stone-700"></div>
                  
                  <button onClick={() => setIsBulkPromoOpen(true)} className="text-sm font-bold text-fritz-bright-400 hover:text-fritz-bright-300 transition-colors flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                    Aplicar em lote
                  </button>
                  
                  <div className="w-px h-4 bg-fritz-stone-700"></div>
                  
                  <button onClick={() => setIsDiscountModalOpen(true)} className="text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    Remarcação (%)
                  </button>

                  <div className="w-px h-4 bg-fritz-stone-700"></div>

                  <button onClick={sincronizarPrecosSimulados} className="text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-2" title="Igualar o preço final ao preço simulado em todos os itens marcados">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"></path><path d="m14 7 3 3"></path><path d="M5 6v4"></path><path d="M19 14v4"></path><path d="M10 2v2"></path><path d="M7 8H3"></path><path d="M21 16h-4"></path><path d="M11 3H9"></path></svg>
                    Sincronizar Simulado
                  </button>

                  <button onClick={() => setSelecionadosOficina(new Set())} className="ml-2 text-fritz-stone-400 hover:text-white transition-colors" title="Limpar seleção">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
              </div>
            )}

            {/* MODAL: CALCULADORA DE DESCONTO / ACRÉSCIMO */}
            {isDiscountModalOpen && (
              <div className="fixed inset-0 bg-fritz-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
                <div className="bg-white rounded-3xl shadow-2xl w-[400px] overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
                      </div>
                      <h3 className="text-xl font-black text-fritz-stone-900">Remarcação Rápida</h3>
                    </div>
                    
                    <p className="text-sm text-fritz-stone-500 mb-6">Aplique um percentual sobre o preço simulado dos {selecionadosOficina.size} produtos selecionados.</p>
                    
                    <form onSubmit={aplicarDescontoEmMassa} className="space-y-5">
                      <div className="flex bg-fritz-stone-100 p-1 rounded-xl">
                        <button type="button" onClick={() => setDiscountType("desconto")} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${discountType === "desconto" ? "bg-white shadow-sm text-red-600" : "text-fritz-stone-500 hover:text-fritz-stone-700"}`}>
                          Desconto (-)
                        </button>
                        <button type="button" onClick={() => setDiscountType("acrescimo")} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${discountType === "acrescimo" ? "bg-white shadow-sm text-emerald-600" : "text-fritz-stone-500 hover:text-fritz-stone-700"}`}>
                          Acréscimo (+)
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-fritz-stone-700 mb-1.5">Percentual (%)</label>
                        <div className="relative">
                          <input type="number" step="any" required value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} placeholder="Ex: 5" className="w-full rounded-xl border border-fritz-stone-200 bg-fritz-stone-50 pl-4 pr-10 py-3 text-lg font-bold text-fritz-stone-900 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100" autoFocus />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-fritz-stone-400 font-bold">%</span>
                        </div>
                      </div>

                      <div className="pt-4 flex gap-3">
                        <Button type="button" onClick={() => setIsDiscountModalOpen(false)} className="flex-1 bg-white border border-fritz-stone-200 text-fritz-stone-700 hover:bg-fritz-stone-50 py-3 rounded-xl font-semibold">Cancelar</Button>
                        <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold">Aplicar a todos</Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* MODAL: APLICAR EM LOTE (PARÂMETROS) */}
            {isBulkPromoOpen && (
              <div className="fixed inset-0 bg-fritz-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-xl w-[400px] overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-fritz-stone-900 mb-1">Atualização em Lote</h3>
                    <p className="text-sm text-fritz-stone-500 mb-6">Aplica valores simultaneamente nos {selecionadosOficina.size} itens marcados.</p>
                    
                    <form onSubmit={aplicarEdicaoEmMassaPromo} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-fritz-stone-700 mb-1.5">Campo a alterar</label>
                        <select value={bulkPromoField} onChange={(e) => setBulkPromoField(e.target.value as keyof Product)} className="w-full rounded-xl border border-fritz-stone-200 bg-fritz-stone-50 px-4 py-3 text-sm text-fritz-stone-900 outline-none focus:border-fritz-bright-600 focus:bg-white focus:ring-2 focus:ring-fritz-bright-100">
                          <option value="profit">Margem de Lucro (%)</option>
                          <option value="externalComission">Comissão Externa (%)</option>
                          <option value="internalComission">Comissão Interna (%)</option>
                          <option value="fixedCoast">Custo Fixo (%)</option>
                          <option value="basePricePromo">Forçar Preço Final (R$)</option>
                          <option value="inboundInvoicePrice">Custo Base (VlrUep) (R$)</option>
                          <option value="average">Custo Médio (R$)</option>
                          <option value="inboundIcms">ICMS - Entrada (%)</option>
                          <option value="inboundCofinsAndPis">PIS/COFINS - Entrada (%)</option>
                          <option value="icms">ICMS - Saída (%)</option>
                          <option value="ipi">IPI - Saída (%)</option>
                          <option value="pis">PIS - Saída (%)</option>
                          <option value="cofins">COFINS - Saída (%)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-fritz-stone-700 mb-1.5">Novo valor</label>
                        <input type="number" step="any" required value={bulkPromoValue} onChange={(e) => setBulkPromoValue(e.target.value)} placeholder="Digite o número..." className="w-full rounded-xl border border-fritz-stone-200 bg-fritz-stone-50 px-4 py-3 text-sm text-fritz-stone-900 outline-none focus:border-fritz-bright-600 focus:bg-white focus:ring-2 focus:ring-fritz-bright-100" />
                      </div>
                      <div className="pt-4 flex gap-3">
                        <Button type="button" onClick={() => setIsBulkPromoOpen(false)} className="flex-1 bg-white border border-fritz-stone-200 text-fritz-stone-700 hover:bg-fritz-stone-50 py-3 rounded-xl">Cancelar</Button>
                        <Button type="submit" className="flex-1 bg-fritz-bright-700 hover:bg-fritz-bright-800 text-white py-3 rounded-xl">Aplicar Valores</Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-start mb-4 shrink-0">
              <div>
                <h2 className="text-2xl font-black text-fritz-stone-900 tracking-tight">Simulador Estratégico de Margens</h2>
                <p className="text-sm text-fritz-stone-500 mt-1">Campanha vinculada à tabela <strong className="text-fritz-bright-700 font-bold">{tabelaSelecionada}</strong> ({validadeSelecionada})</p>
              </div>
              <Button onClick={voltarParaSelecao} className="bg-white border border-fritz-stone-200 text-fritz-stone-700 hover:bg-fritz-stone-50 hover:text-fritz-stone-900 px-4 py-2 rounded-lg font-bold text-sm shadow-sm transition-all flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                Voltar para listagem
              </Button>
            </div>

            <div className="rounded-xl border border-fritz-stone-200 overflow-hidden flex-1 flex flex-col min-h-0 mb-4">
              <div className="overflow-auto flex-1 relative">
                <table className="w-full text-left text-sm text-fritz-stone-700 table-fixed min-w-max">
                  <thead className="bg-fritz-stone-100/50 text-xs font-semibold uppercase tracking-wider text-fritz-stone-500">
                    <tr>
                      <ThOrdenavel label="Check" larguraInicial="60px" align="center">
                        <div className="flex items-center justify-center w-full">
                          <input type="checkbox" checked={todosDaOficinaSelecionados} onChange={toggleSelecionarTodosOficina} className="h-4 w-4 rounded border-fritz-stone-300 text-fritz-stone-600 focus:ring-fritz-stone-600 cursor-pointer" />
                        </div>
                      </ThOrdenavel>
                      <ThOrdenavel label="Família" sortKey="familyDescription" larguraInicial="200px" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                      <ThOrdenavel label="Código" sortKey="code" larguraInicial="110px" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                      <ThOrdenavel label="Descrição" sortKey="description" larguraInicial="300px" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                      
                      {/* BLOCO DE PREÇOS REFINADO */}
                      <ThOrdenavel 
                        label="PREÇO SIMULADO" 
                        larguraInicial="160px" 
                        align="right" 
                        highlightClass="bg-fritz-bright-50/50"
                      >
                        <span className="text-fritz-bright-800 font-extrabold tracking-tight">PREÇO SIMULADO</span>
                      </ThOrdenavel>
                      <ThOrdenavel 
                        label="PREÇO FINAL PROMO" 
                        larguraInicial="180px" 
                        align="right" 
                        highlightClass="bg-fritz-green-50/50"
                      >
                        <span className="text-fritz-green-800 font-extrabold tracking-tight">PREÇO FINAL PROMO</span>
                      </ThOrdenavel>

                      <ThOrdenavel label="Custo Base (VlrUep)" sortKey="inboundInvoicePrice" larguraInicial="150px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                      <ThOrdenavel label="Custo Médio" sortKey="average" larguraInicial="130px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                      
                      <ThOrdenavel label="ICMS-(E)" sortKey="inboundIcms" larguraInicial="100px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                      <ThOrdenavel label="PIS/COF-(E)" sortKey="inboundCofinsAndPis" larguraInicial="110px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                      <ThOrdenavel label="IPI-(E)" sortKey="inboundIpi" larguraInicial="100px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                      <ThOrdenavel label="Frete-(E)" sortKey="inboundFreight" larguraInicial="100px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />

                      <ThOrdenavel label="ICMS-(S)" sortKey="icms" larguraInicial="100px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                      <ThOrdenavel label="IPI-(S)" sortKey="ipi" larguraInicial="100px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                      <ThOrdenavel label="PIS-(S)" sortKey="pis" larguraInicial="100px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                      <ThOrdenavel label="COFINS-(S)" sortKey="cofins" larguraInicial="110px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                      <ThOrdenavel label="Frete-(S)" sortKey="freight" larguraInicial="100px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />

                      <ThOrdenavel label="Custo Fixo" sortKey="fixedCoast" larguraInicial="100px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                      <ThOrdenavel label="Comissão Int." sortKey="internalComission" larguraInicial="120px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                      <ThOrdenavel label="Comissão Ext." sortKey="externalComission" larguraInicial="120px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                      <ThOrdenavel label="Lucro Promo" sortKey="profit" larguraInicial="120px" align="right" orderBy={orderBy} ordenationType={ordenationType} onSort={handleSort} />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-fritz-stone-100 bg-white">
                  {produtosNoCarrinhoOrdenados.length === 0 ? (
                      <tr>
                        <td colSpan={20} className="px-6 py-20 text-center">
                          <div className="mx-auto flex max-w-sm flex-col items-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-fritz-stone-50 text-fritz-stone-400">
                              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </div>
                            <h3 className="mb-1 text-lg font-bold text-fritz-stone-900">Nenhum produto no rascunho</h3>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      produtosNoCarrinhoOrdenados.map((produtoBase, index) => {
                        const rascunho = rascunhosPromo[produtoBase.code] || { ...produtoBase };
                        const isSelecionadoOficina = selecionadosOficina.has(rascunho.code);
                        
                        // LÓGICA DO PREÇO SIMULADO (ANTES vs DEPOIS)
                        const precoSimuladoOriginal = calcularPrecoSimulado(produtoBase);
                        const precoSimuladoRealtime = calcularPrecoSimulado(rascunho);
                        
                        const isPrecoSimuladoDiferente = Math.abs(precoSimuladoRealtime - precoSimuladoOriginal) > 0.001;
                        const precoFinalPromo = rascunho.basePricePromo !== undefined ? rascunho.basePricePromo : produtoBase.basePrice;

                        // POSICIONAMENTO INTELIGENTE DO TOOLTIP
                        const isPrimeiro = index === 0;
                        const isUltimo = index === produtosNoCarrinhoOrdenados.length - 1 && produtosNoCarrinhoOrdenados.length > 1;

                        let tooltipPosition = "top-1/2 -translate-y-1/2";
                        let arrowPosition = "top-1/2 -translate-y-1/2";

                        if (isPrimeiro) {
                          tooltipPosition = "-top-2";
                          arrowPosition = "top-3";
                        } else if (isUltimo) {
                          tooltipPosition = "-bottom-2";
                          arrowPosition = "bottom-3";
                        }

                        return (
                          <tr key={rascunho.code} className={`transition-colors relative hover:z-40 ${isSelecionadoOficina ? "bg-fritz-stone-50" : "hover:bg-fritz-stone-50/60"}`}>
                            <td className="px-4 py-2 text-center align-middle" onClick={(e) => e.stopPropagation()}>
                              <input type="checkbox" checked={isSelecionadoOficina} onChange={() => toggleSelecionarOficina(rascunho.code)} className="h-4 w-4 rounded border-fritz-stone-300 text-fritz-stone-600 focus:ring-fritz-stone-600 cursor-pointer" />
                            </td>
                            <td className="px-4 py-2 truncate text-fritz-stone-600 align-middle text-xs" title={`${rascunho.familyCode || ''} - ${rascunho.familyDescription || 'Sem Família'}`}>
                              {rascunho.familyCode && (
                                <span className="inline-flex items-center justify-center rounded bg-fritz-stone-100 px-1.5 py-0.5 text-[10px] font-bold text-fritz-stone-500 mr-2 border border-fritz-stone-200">
                                  {rascunho.familyCode}
                                </span>
                              )}
                              {rascunho.familyDescription || "-"}
                            </td>
                            <td className="px-4 py-2 font-mono font-medium text-fritz-stone-800 align-middle">{rascunho.code}</td>
                            <td className="px-4 py-2 truncate font-medium text-fritz-stone-900 align-middle">{rascunho.description}</td>
                            
                            {/* BLOCO DE PREÇOS REFINADO */}
                            <td className="px-4 py-1.5 text-right font-extrabold text-fritz-bright-800 bg-fritz-bright-50/30 select-none align-middle group relative">
                              
                              <button
                                onClick={() => handleEditPromo(produtoBase, "basePricePromo", precoSimuladoRealtime)}
                                className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all bg-white p-1.5 rounded shadow-md border border-fritz-bright-200 text-fritz-bright-700 hover:bg-fritz-bright-700 hover:text-white z-0 scale-90 hover:scale-100"
                                title="Copiar para Preço Final"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                              </button>

                              <div className="relative z-10 flex flex-col items-end justify-center w-full transition-transform group-hover:translate-x-2">
                                {isPrecoSimuladoDiferente && (
                                  <div className={`relative group/tooltip flex items-center gap-1.5 mb-1 pr-1.5 pl-2 py-0.5 rounded-md shadow-sm border text-[10px] font-bold mr-1 cursor-help z-20 hover:z-[60] ${precoSimuladoRealtime > precoSimuladoOriginal ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                                    <span className="line-through opacity-75">{formatarMoeda(precoSimuladoOriginal)}</span>
                                    {precoSimuladoRealtime > precoSimuladoOriginal ? (
                                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                                    ) : (
                                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    )}

                                    <div className={`absolute right-[calc(100%+8px)] ${tooltipPosition} w-max max-w-[220px] opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 bg-fritz-stone-900 text-white text-xs rounded-xl p-3.5 shadow-2xl border border-fritz-stone-700 text-left pointer-events-none cursor-default`}>
                                      <div className="font-black text-fritz-stone-300 mb-2 border-b border-fritz-stone-700 pb-1.5 uppercase tracking-wider text-[9px]">Análise da Simulação</div>
                                      <div className="flex justify-between gap-6 mt-1.5">
                                        <span className="text-fritz-stone-400">Base Original:</span>
                                        <span className="font-medium text-fritz-stone-100">{formatarMoeda(precoSimuladoOriginal)}</span>
                                      </div>
                                      <div className="flex justify-between gap-6 mt-1">
                                        <span className="text-fritz-stone-400">Novo Simulado:</span>
                                        <span className={`font-bold ${precoSimuladoRealtime > precoSimuladoOriginal ? 'text-green-400' : 'text-red-400'}`}>{formatarMoeda(precoSimuladoRealtime)}</span>
                                      </div>
                                      <div className="flex justify-between gap-6 mt-2 pt-2 border-t border-fritz-stone-700/80">
                                        <span className="text-fritz-stone-400">Impacto final:</span>
                                        <span className={`font-black ${precoSimuladoRealtime > precoSimuladoOriginal ? 'text-green-400' : 'text-red-400'}`}>
                                          {precoSimuladoRealtime > precoSimuladoOriginal ? '+' : ''}{formatarMoeda(precoSimuladoRealtime - precoSimuladoOriginal)}
                                        </span>
                                      </div>
                                      <div className={`absolute left-full -ml-[1px] border-[6px] border-transparent border-l-fritz-stone-900 ${arrowPosition}`}></div>
                                    </div>
                                  </div>
                                )}
                                <div className="w-full pr-1 text-[13px]">
                                  {formatarMoeda(precoSimuladoRealtime)}
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-1.5 font-black text-fritz-green-800 bg-fritz-green-50/30 align-middle">
                              <CelulaInteligente tipo="moeda" align="right" valor={precoFinalPromo} onChange={(v: number) => handleEditPromo(produtoBase, "basePricePromo", v)} />
                            </td>

                            <td className="px-4 py-2 font-medium text-right text-fritz-stone-600 align-middle">
                              <CelulaInteligente tipo="moeda" align="right" valor={rascunho.inboundInvoicePrice} onChange={(v: number) => handleEditPromo(produtoBase, "inboundInvoicePrice", v)} />
                            </td>
                            
                            <td className="px-4 py-2 font-medium text-right text-fritz-stone-600 align-middle">
                              <CelulaInteligente tipo="moeda" align="right" valor={rascunho.average} onChange={(v: number) => handleEditPromo(produtoBase, "average", v)} />
                            </td>

                            <td className="px-4 py-2 align-middle"><CelulaInteligente tipo="porcentagem" align="right" valor={rascunho.inboundIcms} onChange={(v: number) => handleEditPromo(produtoBase, "inboundIcms", v)} /></td>
                            <td className="px-4 py-2 align-middle"><CelulaInteligente tipo="porcentagem" align="right" valor={rascunho.inboundCofinsAndPis} onChange={(v: number) => handleEditPromo(produtoBase, "inboundCofinsAndPis", v)} /></td>
                            <td className="px-4 py-2 align-middle"><CelulaInteligente tipo="porcentagem" align="right" valor={rascunho.inboundIpi} onChange={(v: number) => handleEditPromo(produtoBase, "inboundIpi", v)} /></td>
                            <td className="px-4 py-2 align-middle"><CelulaInteligente tipo="porcentagem" align="right" valor={rascunho.inboundFreight} onChange={(v: number) => handleEditPromo(produtoBase, "inboundFreight", v)} /></td>

                            <td className="px-4 py-2 align-middle"><CelulaInteligente tipo="porcentagem" align="right" valor={rascunho.icms} onChange={(v: number) => handleEditPromo(produtoBase, "icms", v)} /></td>
                            <td className="px-4 py-2 align-middle"><CelulaInteligente tipo="porcentagem" align="right" valor={rascunho.ipi} onChange={(v: number) => handleEditPromo(produtoBase, "ipi", v)} /></td>
                            <td className="px-4 py-2 align-middle"><CelulaInteligente tipo="porcentagem" align="right" valor={rascunho.pis} onChange={(v: number) => handleEditPromo(produtoBase, "pis", v)} /></td>
                            <td className="px-4 py-2 align-middle"><CelulaInteligente tipo="porcentagem" align="right" valor={rascunho.cofins} onChange={(v: number) => handleEditPromo(produtoBase, "cofins", v)} /></td>
                            <td className="px-4 py-2 align-middle"><CelulaInteligente tipo="porcentagem" align="right" valor={rascunho.freight} onChange={(v: number) => handleEditPromo(produtoBase, "freight", v)} /></td>

                            <td className="px-4 py-2 align-middle"><CelulaInteligente tipo="porcentagem" align="right" valor={rascunho.fixedCoast} onChange={(v: number) => handleEditPromo(produtoBase, "fixedCoast", v)} /></td>
                            <td className="px-4 py-2 align-middle"><CelulaInteligente tipo="porcentagem" align="right" valor={rascunho.internalComission} onChange={(v: number) => handleEditPromo(produtoBase, "internalComission", v)} /></td>
                            <td className="px-4 py-2 align-middle"><CelulaInteligente tipo="porcentagem" align="right" valor={rascunho.externalComission} onChange={(v: number) => handleEditPromo(produtoBase, "externalComission", v)} /></td>
                            
                            <td className="px-4 py-1.5 align-middle font-semibold text-fritz-stone-800">
                              <CelulaInteligente tipo="porcentagem" align="right" valor={rascunho.profit} onChange={(v: number) => handleEditPromo(produtoBase, "profit", v)} />
                            </td>

                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 gap-4 shrink-0">
              <div>
                <Button 
                  onClick={() => {
                    if (selecionadosOficina.size === 0) {
                      showToast("Marque as caixas dos produtos que deseja excluir.", "error");
                      return;
                    }
                    setModalExcluirAberto(true);
                  }} 
                  className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                  Excluir Rascunho {selecionadosOficina.size > 0 ? `(${selecionadosOficina.size})` : ''}
                </Button>
              </div>
              <div className="flex gap-4">
                <Button onClick={salvarRascunhoSenior} disabled={salvandoRascunho || efetivandoPromocao} className="bg-white border-2 border-fritz-stone-200 text-fritz-stone-700 hover:bg-fritz-stone-50 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
                  {salvandoRascunho ? "Guardando..." : "Salvar Rascunho"}
                </Button>
                <Button onClick={efetivarCampanhaSenior} disabled={salvandoRascunho || efetivandoPromocao || excluindoRascunho} className="bg-fritz-bright-700 hover:bg-fritz-bright-800 text-white px-10 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-transform active:scale-[0.98]">
                  {efetivandoPromocao ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Inserindo no Senior...
                    </>
                  ) : (
                    <>Efetivar Campanha Oficial</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {modalExcluirAberto && (
          <div className="fixed inset-0 bg-fritz-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] shadow-2xl w-[420px] overflow-hidden animate-in zoom-in-95 duration-300 text-center p-8">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 mb-5 shadow-inner border-4 border-white ring-4 ring-red-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </div>
              <h3 className="text-2xl font-black text-fritz-stone-900 mb-2 tracking-tight">Excluir {selecionadosOficina.size} produto(s)?</h3>
              <p className="text-sm text-fritz-stone-500 mb-8 px-2">Essa ação irá remover definitivamente os <strong>{selecionadosOficina.size}</strong> itens selecionados do rascunho da tabela <strong>{tabelaSelecionada}</strong>. Isso não afeta os preços já aprovados.</p>
              
              <div className="flex w-full gap-3">
                <Button onClick={() => setModalExcluirAberto(false)} className="flex-1 bg-white border border-fritz-stone-200 text-fritz-stone-700 hover:bg-fritz-stone-50 py-3 rounded-xl font-semibold">
                  Cancelar
                </Button>
                <Button onClick={() => executarExclusaoRascunho(false)} disabled={excluindoRascunho} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold shadow-md flex items-center justify-center gap-2">
                  {excluindoRascunho ? "Excluindo..." : "Sim, excluir"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {modalSucessoAberto && (
          <div className="fixed inset-0 bg-fritz-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] shadow-2xl w-[460px] overflow-hidden animate-in zoom-in-95 duration-300 text-center p-10 relative">
              
              <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-green-400 to-green-600"></div>

              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-green-50 to-green-100 text-green-600 mb-6 shadow-inner border-[6px] border-white ring-[1px] ring-green-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-sm"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h3 className="text-3xl font-black text-fritz-stone-900 mb-3 tracking-tight">Promoção Oficializada!</h3>
              <p className="text-base text-fritz-stone-500 mb-10 px-4 leading-relaxed">
                Os preços e impostos foram consolidados no Senior Sistemas na tabela <strong className="text-fritz-stone-800 font-bold px-1 py-0.5 bg-fritz-stone-100 rounded">{tabelaSelecionada}</strong> com sucesso absoluto.
              </p>
              
              <div className="flex w-full justify-center">
                <Button onClick={fecharSucesso} className="w-full bg-fritz-stone-900 hover:bg-fritz-stone-800 text-white py-4 rounded-xl font-bold text-base shadow-xl hover:shadow-2xl transition-all">
                  Iniciar Nova Campanha
                </Button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}