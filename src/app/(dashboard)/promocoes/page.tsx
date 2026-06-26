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
  lastInboundPrice?: number;
  lastInboundDate?: string;
  lastUpdateDate?: string;
  lastUpdateTime?: string;
  lastUpdateUser?: string;
  basePricePromo?: number; // Preço customizado digitado pelo usuário
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
  sortConfig?: SortConfig;
  align?: "left" | "right" | "center";
  onSort?: (key: keyof Product) => void;
  children?: React.ReactNode;
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
  <div className="flex items-center justify-center mb-5 mt-1">
    <div className="flex items-center">
      <div className={`flex items-center justify-center w-8 h-8 text-sm rounded-full font-bold shadow-sm transition-colors duration-300 ${passoAtual >= 1 ? 'bg-fritz-bright-700 text-white ring-4 ring-fritz-bright-100' : 'bg-white border-2 border-fritz-stone-200 text-fritz-stone-400'}`}>1</div>
      <div className={`h-1 w-16 transition-colors duration-300 ${passoAtual >= 2 ? 'bg-fritz-bright-700' : 'bg-fritz-stone-200'}`}></div>
      <div className={`flex items-center justify-center w-8 h-8 text-sm rounded-full font-bold shadow-sm transition-colors duration-300 ${passoAtual >= 2 ? 'bg-fritz-bright-700 text-white ring-4 ring-fritz-bright-100' : 'bg-white border-2 border-fritz-stone-200 text-fritz-stone-400'}`}>2</div>
      <div className={`h-1 w-16 transition-colors duration-300 ${passoAtual >= 3 ? 'bg-fritz-bright-700' : 'bg-fritz-stone-200'}`}></div>
      <div className={`flex items-center justify-center w-8 h-8 text-sm rounded-full font-bold shadow-sm transition-colors duration-300 ${passoAtual >= 3 ? 'bg-fritz-bright-700 text-white ring-4 ring-fritz-bright-100' : 'bg-white border-2 border-fritz-stone-200 text-fritz-stone-400'}`}>3</div>
    </div>
  </div>
);

const ThOrdenavel = ({ id, label, sortKey, larguraInicial = "auto", sortConfig, align = "left", onSort, children }: ThOrdenavelProps) => {
  const isSorted = sortKey && sortConfig?.key === sortKey;
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
    
    const aoMoverMouse = (moveEvent: MouseEvent) => {
      const novaLargura = Math.max(40, startWidth + (moveEvent.pageX - startX));
      setLargura(`${novaLargura}px`);
    };

    const aoSoltarMouse = () => {
      document.removeEventListener("mousemove", aoMoverMouse);
      document.removeEventListener("mouseup", aoSoltarMouse);
      document.body.style.userSelect = "auto";
      localStorage.setItem(storageKey, `${thRef.current?.offsetWidth}px`);
    };

    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", aoMoverMouse);
    document.addEventListener("mouseup", aoSoltarMouse);
  };

  return (
    <th id={id} ref={thRef} style={{ width: largura, minWidth: largura, maxWidth: largura }} className="sticky top-0 z-20 bg-fritz-stone-100 shadow-[0_1px_0_0_#e5e7eb] group border-r border-transparent hover:border-fritz-stone-200 transition-colors p-0 align-middle">
      <div onClick={() => sortKey && onSort && onSort(sortKey)} className={`flex items-center gap-2 px-4 py-4 ${sortKey ? 'cursor-pointer hover:bg-fritz-stone-200/50' : ''} select-none w-full h-full ${align === "right" ? "justify-end" : align === "center" ? "justify-center" : ""}`}>
        {children || <span className="truncate">{label}</span>}
        {sortKey && (
          <div className="flex flex-col shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`${isSorted && sortConfig.direction === 'asc' ? 'text-fritz-bright-700' : 'text-fritz-stone-400 opacity-50'}`}><polyline points="18 15 12 9 6 15"></polyline></svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`-mt-[2px] ${isSorted && sortConfig.direction === 'desc' ? 'text-fritz-bright-700' : 'text-fritz-stone-400 opacity-50'}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        )}
      </div>
      <div onMouseDown={iniciarRedimensionamento} onClick={(e) => e.stopPropagation()} className="absolute right-0 top-0 h-full w-[6px] cursor-col-resize bg-transparent group-hover:bg-fritz-stone-300 hover:!bg-fritz-bright-600 z-10 transform translate-x-1/2 transition-colors" title="Arraste para redimensionar" />
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
    if (e.key === 'Enter') e.currentTarget.blur();
  };

  let exibicao = valor === null ? "-" : valor;
  if (tipo === "moeda") exibicao = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(valor) || 0);
  else if (tipo === "porcentagem") exibicao = `${Number(valor || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;

  if (editando) {
    return (
      <div className={`flex items-center gap-1 bg-white ring-2 ring-fritz-bright-600 rounded shadow-sm px-2 py-1 -mx-2`}>
        {prefixo && tipo !== 'moeda' && <span className="text-fritz-stone-400 text-xs font-semibold">{prefixo}</span>}
        <input type={tipo === "text" ? "text" : "number"} step="any" autoFocus onFocus={(e) => e.target.select()} value={valorInput} onChange={(e) => setValorInput(e.target.value)} onBlur={handleBlur} onKeyDown={handleKeyDown} className={`bg-transparent outline-none !border-0 !ring-0 !shadow-none text-fritz-stone-900 ${align === "right" ? "text-right" : "text-left"} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none font-medium w-full p-0 m-0`} />
        {sufixo && tipo !== 'porcentagem' && <span className="text-fritz-stone-400 text-xs font-semibold">{sufixo}</span>}
      </div>
    );
  }

  return (
    <div onClick={() => setEditando(true)} className={`cursor-text border border-transparent hover:border-fritz-stone-200 hover:bg-white rounded px-2 py-1 -mx-2 text-sm text-fritz-stone-700 transition-colors ${tipo !== 'text' ? 'font-medium' : ''} ${align === "right" ? "text-right" : "text-left"}`}>
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
      <div onClick={() => setIsOpen(!isOpen)} className="w-full h-full flex items-center justify-between rounded-xl border border-fritz-stone-200 bg-fritz-stone-50 px-4 py-3 text-sm text-fritz-stone-900 outline-none transition hover:bg-white hover:border-fritz-stone-300 cursor-pointer">
        <span className="truncate pr-4">{familiaAtual ? `${familiaAtual.codigo} - ${familiaAtual.nome}` : "Todas as Famílias"}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-fritz-stone-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
      </div>
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full min-w-[280px] rounded-xl border border-fritz-stone-200 bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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

  // Proteção de Rota (Feature Toggle)
  const [autorizado, setAutorizado] = useState<boolean | null>(null);

  // Estados de Controle do Wizard e Modal
  const [passoAtual, setPassoAtual] = useState(1);
  const [modalValidadeAberto, setModalValidadeAberto] = useState(false);
  const [modalSucessoAberto, setModalSucessoAberto] = useState(false);
  const [tabelaSelecionada, setTabelaSelecionada] = useState("");
  const [validadeSelecionada, setValidadeSelecionada] = useState("");
  
  // Sub-estados para criação de nova validade
  const [dataInicioNova, setDataInicioNova] = useState("");
  const [dataFimNova, setDataFimNova] = useState("");
  const [gravandoNovaValidade, setGravandoNovaValidade] = useState(false);

  // Estados da Lista Geral de Produtos (Passo 1)
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [familiasDropdown, setFamiliasDropdown] = useState<{codigo: string, nome: string}[]>([]);
  const [tabelasSenior, setTabelasSenior] = useState<{codtpr: string, datini: string, datfim: string}[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Estados de Loading do Passo 3
  const [salvandoRascunho, setSalvandoRascunho] = useState(false);
  const [efetivandoPromocao, setEfetivandoPromocao] = useState(false);

  // Paginação e Busca (Passo 1)
  const [busca, setBusca] = useState(""); 
  const [buscaFamilia, setBuscaFamilia] = useState("");
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: "asc" });

  // O CARRINHO SEGURO (Passo 1)
  const [produtosSelecionados, setProdutosSelecionados] = useState<Map<string, Product>>(new Map());

  // OFICINA DE PREÇOS (Passo 3): Edição e Bulk Edit
  const [rascunhosPromo, setRascunhosPromo] = useState<Record<string, Product>>({});
  const [selecionadosOficina, setSelecionadosOficina] = useState<Set<string>>(new Set());
  const [isBulkPromoOpen, setIsBulkPromoOpen] = useState(false);
  const [bulkPromoField, setBulkPromoField] = useState<keyof Product>("profit");
  const [bulkPromoValue, setBulkPromoValue] = useState<string>("");

  const scrollInternoRef = useRef<HTMLDivElement>(null);
  const inputBuscaRef = useRef<HTMLInputElement>(null);

  const formatarMoeda = (valor: number | undefined | null) => {
    if (valor === undefined || valor === null) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
  };

  // Trava de segurança (Apenas Suporte)
  useEffect(() => {
    const usuario = localStorage.getItem("usuario")?.toLowerCase() || "";
    if (usuario === "suporte" || usuario === "jair") setAutorizado(true);
    else setAutorizado(false);
  }, []);

  // Carrega Famílias e Tabelas
  useEffect(() => {
    if (!autorizado) return;
    async function carregarDadosIniciais() {
      try {
        const token = localStorage.getItem("token");
        if (!token || !contexto?.empresa?.id) return;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/senior/companies`, { headers: { "Authorization": `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          const empresaAtual = data.find((e: any) => e.codigo === contexto.empresa.id);
          
          // ATUALIZADO: Agora salva as famílias E as tabelas na memória
          if (empresaAtual) {
            if (empresaAtual.familias) setFamiliasDropdown(empresaAtual.familias);
            if (empresaAtual.tabelasPreco) setTabelasSenior(empresaAtual.tabelasPreco);
          }
        }
      } catch (e) { console.error("Erro ao carregar dados iniciais", e); }
    }
    carregarDadosIniciais();
  }, [contexto, autorizado]);

  // Busca Geral do Catálogo (Passo 1)
  async function buscarProdutos(novaPagina = 1, termoAtual = busca, familiaAtual = buscaFamilia) {
    if (!contexto) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload: Record<string, any> = { company: contexto.empresa.id, page: novaPagina, searchParameters: termoAtual, recordsPerPage: 50 };
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
      console.error("Falha na requisição:", error);
    } finally {
      setLoading(false);
    }
  }

  function mudarPagina(novaPagina: number) {
    buscarProdutos(novaPagina, busca, buscaFamilia);
    if (scrollInternoRef.current) scrollInternoRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Controle do Carrinho (Passo 1)
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
    if (!autorizado || !contexto || loadingContexto) return;
    const temporizadorDebounce = setTimeout(() => { buscarProdutos(1, busca, buscaFamilia); setPagina(1); }, 500); 
    return () => clearTimeout(temporizadorDebounce);
  }, [busca, buscaFamilia, contexto, loadingContexto, autorizado]);

  // ==========================================
  // MATEMÁTICA DA SIMULAÇÃO (MARKUP REAL-TIME)
  // Espelhando a regra do Senior: InserirIntegracao()
  // ==========================================
  function calcularPrecoSimulado(p: Product) {
    let precoMedio = p.average || 0;
    
    // 1. Apura o custo final da entrada considerando as deduções (PCC tem base reduzida pelo ICMS)
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

    // 2. Calcula o Markup da Saída (Por dentro)
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

  // Edição Unitária no Simulador
  function handleEditPromo(produtoBase: Product, campo: keyof Product, valor: any) {
    setRascunhosPromo(prev => {
      const produtoAtual = prev[produtoBase.code] || { ...produtoBase };
      return { ...prev, [produtoBase.code]: { ...produtoAtual, [campo]: valor } };
    });
  }

  // ==========================================
  // BULK EDIT NO SIMULADOR (PASSO 3)
  // ==========================================
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
          novosRascunhos[codigo] = { ...base, [bulkPromoField]: novoValor };
        }
      });
      return novosRascunhos;
    });
    
    setIsBulkPromoOpen(false);
    setBulkPromoValue("");
    setSelecionadosOficina(new Set());
  }

  // ==========================================
  // TRANSIÇÕES DO WIZARD E APIS DO JULIO
  // ==========================================
  const abrirModalSetup = () => setModalValidadeAberto(true);
  
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
        setValidadeSelecionada(`${dataInicioNova} - ${dataFimNova}`);
      } catch (err) { 
        alert("Erro ao criar nova validade no Senior.");
        setGravandoNovaValidade(false);
        return; 
      }
      setGravandoNovaValidade(false);
    }

    // Ao avançar, limpa possíveis rascunhos velhos para carregar fresco do passo 1
    setRascunhosPromo({});
    setSelecionadosOficina(new Set());
    setModalValidadeAberto(false);
    setPassoAtual(3);
  }

  const voltarParaSelecao = () => { setPassoAtual(1); setModalValidadeAberto(false); };

  // Helper para montar o Payload Final comum às Rotas de Rascunho/Efetivar
  // Helper para montar o Payload Final comum às Rotas de Rascunho/Efetivar
  function montarPayloadCampanha() {
    const dataInicialSplit = (validadeSelecionada.split("-")[0] || "").trim();
    
    return {
      company: String(contexto?.empresa.id || ""), // Garante que vá como String
      tablePrice: tabelaSelecionada,
      initialDate: dataInicialSplit,
      products: produtosNoCarrinhoOrdenados.map(p => {
        const r = rascunhosPromo[p.code] || p;
        const precoSimulado = r.basePricePromo !== undefined ? r.basePricePromo : calcularPrecoSimulado(r);
        
        // Garante que TODOS os numéricos vão como Number (se nulo/vazio, envia 0)
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
          basePrice: Number(precoSimulado) ? parseFloat(Number(precoSimulado).toFixed(2)) : 0
        };
      })
    };
  }

  async function salvarRascunhoSenior() {
    setSalvandoRascunho(true);
    const token = localStorage.getItem("token");
    try {
      const payload = montarPayloadCampanha();
      
      console.log("=== PAYLOAD ENVIADO (SALVAR RASCUNHO) ===");
      console.log(JSON.stringify(payload, null, 2));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/promotion`, {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const erroBackend = await response.json();
        console.error("⛔ ERRO DO BACKEND:", erroBackend);
        alert(`O servidor recusou os dados. Olhe o console (F12) para ver o motivo: ${JSON.stringify(erroBackend)}`);
        throw new Error("Erro na API");
      }
      
      alert("Rascunho de simulação guardado com sucesso na tabela USU_TSIMPRO.");
    } catch (e) { console.error("Falha:", e); } 
    finally { setSalvandoRascunho(false); }
  }

  async function efetivarCampanhaSenior() {
    setEfetivandoPromocao(true);
    const token = localStorage.getItem("token");
    try {
      const payload = montarPayloadCampanha();
      
      // PASSO 1 OBRIGATÓRIO (Exigência do ERP): Salva na tabela de simulação silenciosamente
      console.log("=== 1. GRAVANDO BASE DE SIMULAÇÃO (RASCUNHO) ===");
      const responseSimulacao = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/promotion`, {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, body: JSON.stringify(payload)
      });
      
      if (!responseSimulacao.ok) {
        const erroBackend = await responseSimulacao.json();
        console.error("⛔ ERRO NA SIMULAÇÃO:", erroBackend);
        alert(`O ERP recusou a criação da base: ${JSON.stringify(erroBackend)}`);
        throw new Error("Erro na API de Simulação");
      }

      // PASSO 2: Agora sim, com a simulação criada, nós Efetivamos de fato
      console.log("=== 2. EFETIVANDO CAMPANHA OFICIAL ===");
      const responseEfetivar = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/assignment`, {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, body: JSON.stringify(payload)
      });
      
      if (!responseEfetivar.ok) {
        const erroBackend = await responseEfetivar.json();
        console.error("⛔ ERRO NA EFETIVAÇÃO:", erroBackend);
        alert(`O servidor recusou a efetivação. Motivo: ${JSON.stringify(erroBackend)}`);
        throw new Error("Erro na API de Efetivação");
      }
      
      // Sucesso total nas duas etapas! Mostra o modal.
      setModalSucessoAberto(true);
      setProdutosSelecionados(new Map());
      setRascunhosPromo({});
      setSelecionadosOficina(new Set());
      
    } catch (e) { 
      console.error("Falha no fluxo de efetivação:", e); 
    } finally { 
      setEfetivandoPromocao(false); 
    }
  }

  function fecharSucesso() {
    setModalSucessoAberto(false);
    setPassoAtual(1);
  }

  function handleSort(key: keyof Product) {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  }

  const produtosNoCarrinho = Array.from(produtosSelecionados.values());
  const produtosNoCarrinhoOrdenados = produtosNoCarrinho.sort((a, b) => {
    const key = sortConfig.key; if (!key) return 0;
    const valA = rascunhosPromo[a.code]?.[key] ?? a[key];
    const valB = rascunhosPromo[b.code]?.[key] ?? b[key];
    if (valA === null || valA === undefined) return 1;
    if (valB === null || valB === undefined) return -1;
    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    return sortConfig.direction === "asc" ? 1 : -1;
  });

  const todosDoCarrinhoSelecionados = produtos.length > 0 && produtos.every(p => produtosSelecionados.has(p.code));
  const todosDaOficinaSelecionados = produtosNoCarrinhoOrdenados.length > 0 && produtosNoCarrinhoOrdenados.every(p => selecionadosOficina.has(p.code));
  const quantidadeCarrinho = produtosSelecionados.size;

  // --- LÓGICA DO MODAL DE TABELAS ---
  // Extrai apenas os códigos de tabela únicos para o primeiro select
  const tabelasUnicas = Array.from(new Set(tabelasSenior.map(t => t.codtpr)));
  // Filtra as validades disponíveis apenas para a tabela selecionada
  const validadesDisponiveis = tabelasSenior.filter(t => t.codtpr === tabelaSelecionada);

  // Garante que a data do Senior fique no formato BR (DD/MM/AAAA)
  const formatarDataErp = (dataStr: string) => {
    if (!dataStr) return "";
    if (dataStr.includes("/")) return dataStr.split("T")[0];
    const partes = dataStr.split("T")[0].split("-");
    if (partes.length === 3) return `${partes[2]}/${partes[1]}/${partes[0]}`;
    return dataStr;
  };

  // Renderização de Bloqueio (Feature Toggle)
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
    <div className="flex min-h-screen bg-fritz-stone-50 w-full relative">
      <main className="flex-1 flex flex-col w-full min-w-0 p-8">
        
        <div className="mb-2">
          <PageHeader 
            title="Gerador de Tabelas Promocionais" 
            description="Construa campanhas de preços massivas e valide os lucros em tempo real."
            badgeText="Integrado ao ERP Senior"
          />
        </div>

        <StepperVisual passoAtual={passoAtual} />

        {/* ========================================================= */}
        {/* PASSO 1: GRID DE SELEÇÃO DE PRODUTOS ("CARRINHO")        */}
        {/* ========================================================= */}
        {passoAtual === 1 && (
          <div className="flex flex-col flex-1 animate-in fade-in zoom-in-95 duration-300">
            <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm border border-fritz-stone-200">
              <form onSubmit={(e) => { e.preventDefault(); buscarProdutos(1, busca, buscaFamilia); }} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="relative md:col-span-3 z-30">
                  <ComboboxFamilia familias={familiasDropdown} valorSelecionado={buscaFamilia} onChange={setBuscaFamilia} />
                </div>
                <div className="relative md:col-span-7">
                  <input ref={inputBuscaRef} type="text" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Pesquisar por código, descrição ou palavra-chave..." className="w-full rounded-xl border border-fritz-stone-200 bg-fritz-stone-50 pl-4 pr-12 py-3 text-sm text-fritz-stone-900 outline-none transition focus:border-fritz-bright-600 focus:bg-white focus:ring-2 focus:ring-fritz-bright-100" />
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
                  <Button type="submit" disabled={loading} className="w-full bg-fritz-stone-800 hover:bg-fritz-stone-900 text-white py-3 rounded-xl font-semibold text-sm h-full flex justify-center items-center">
                    Filtrar Itens
                  </Button>
                </div>
              </form>
            </div>

            <div className="rounded-2xl border border-fritz-stone-200 bg-white shadow-sm overflow-hidden flex-1 flex flex-col">
              <div ref={scrollInternoRef} className="overflow-auto max-h-[calc(100vh-400px)] relative">
                <table className="w-full text-left text-sm text-fritz-stone-700 table-fixed min-w-max">
                  <thead className="bg-fritz-stone-100/50 text-xs font-semibold uppercase tracking-wider text-fritz-stone-500">
                    <tr>
                      <ThOrdenavel label="Check" larguraInicial="60px" align="center">
                        <div className="flex items-center justify-center w-full">
                          <input type="checkbox" checked={todosDoCarrinhoSelecionados} onChange={toggleSelecionarTodosCarrinho} className="h-4 w-4 rounded border-fritz-stone-300 text-fritz-bright-600 focus:ring-fritz-bright-600 cursor-pointer" />
                        </div>
                      </ThOrdenavel>
                      <ThOrdenavel label="Família" larguraInicial="200px" />
                      <ThOrdenavel label="Código" larguraInicial="140px" />
                      <ThOrdenavel label="Descrição do Produto" larguraInicial="400px" />
                      <ThOrdenavel label="Custo Médio" larguraInicial="140px" align="right" />
                      <ThOrdenavel label="Preço Base Atual" larguraInicial="180px" align="right" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-fritz-stone-100 bg-white relative z-0">
                    {loadingContexto || (loading && produtos.length === 0) ? (
                      Array.from({ length: 8 }).map((_, index) => (
                        <tr key={`sk-${index}`}>
                          <td className="px-4 py-4 text-center"><div className="h-4 w-4 rounded bg-gray-200 animate-pulse inline-block" /></td>
                          <td className="px-4 py-4"><div className="h-4 w-24 rounded bg-gray-200 animate-pulse" /></td>
                          <td className="px-4 py-4"><div className="h-4 w-16 rounded bg-gray-200 animate-pulse" /></td>
                          <td className="px-4 py-4"><div className="h-4 w-64 rounded bg-gray-200 animate-pulse" /></td>
                          <td className="px-4 py-4"><div className="h-4 w-16 rounded bg-gray-200 animate-pulse ml-auto" /></td>
                          <td className="px-4 py-4"><div className="h-4 w-16 rounded bg-gray-200 animate-pulse ml-auto" /></td>
                        </tr>
                      ))
                    ) : produtos.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-20 text-center text-fritz-stone-400">Nenhum item localizado na busca.</td>
                      </tr>
                    ) : (
                      produtos.map((produto) => {
                        const isSelecionado = produtosSelecionados.has(produto.code);
                        return (
                          <tr key={produto.code} className={`transition-colors cursor-pointer ${isSelecionado ? "bg-fritz-bright-50/70" : "hover:bg-fritz-stone-50"}`} onClick={() => toggleSelecionarCarrinho(produto)}>
                            <td className="px-4 py-4 text-center align-middle" onClick={(e) => e.stopPropagation()}>
                              <input type="checkbox" checked={isSelecionado} onChange={() => toggleSelecionarCarrinho(produto)} className="h-4 w-4 rounded border-fritz-stone-300 text-fritz-bright-600 focus:ring-fritz-bright-600 cursor-pointer" />
                            </td>
                            <td className="px-4 py-4 truncate text-fritz-stone-600 align-middle">
                              {produto.familyCode && <span className="inline-flex items-center justify-center rounded bg-fritz-stone-100 px-1.5 py-0.5 text-[10px] font-bold text-fritz-stone-500 mr-2 border border-fritz-stone-200">{produto.familyCode}</span>}
                              {produto.familyDescription}
                            </td>
                            <td className="px-4 py-4 truncate align-middle font-medium">{produto.code}</td>
                            <td className="px-4 py-4 align-middle truncate">{produto.description}</td>
                            <td className="px-4 py-4 align-middle font-medium text-fritz-stone-600 text-right">{formatarMoeda(produto.average)}</td>
                            <td className="px-4 py-4 align-middle font-bold text-fritz-stone-800 text-right">{formatarMoeda(produto.basePrice)}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between border-t border-fritz-stone-100 bg-white px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <button onClick={() => mudarPagina(pagina - 1)} disabled={pagina === 1} className="flex h-9 w-9 items-center justify-center rounded-lg border border-fritz-stone-200 text-fritz-stone-600 hover:bg-fritz-stone-50 disabled:opacity-50">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    <span className="text-sm font-medium text-fritz-stone-700 px-2">Página {pagina} de {totalPaginas || 1}</span>
                    <button onClick={() => mudarPagina(pagina + 1)} disabled={pagina >= totalPaginas} className="flex h-9 w-9 items-center justify-center rounded-lg border border-fritz-stone-200 text-fritz-stone-600 hover:bg-fritz-stone-50 disabled:opacity-50">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                  </div>
                  
                  {quantidadeCarrinho > 0 && (
                    <button type="button" onClick={() => setProdutosSelecionados(new Map())} className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline transition-colors px-2 py-1">
                      Limpar Seleção ({quantidadeCarrinho})
                    </button>
                  )}
                </div>

                <Button onClick={abrirModalSetup} disabled={quantidadeCarrinho === 0} className="bg-fritz-bright-700 hover:bg-fritz-bright-800 disabled:bg-fritz-stone-300 disabled:text-fritz-stone-500 text-white px-8 py-2.5 rounded-xl font-semibold shadow-sm transition-all">
                  Configurar Campanha ({quantidadeCarrinho})
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PASSO 2: MODAL DE CONFIGURAÇÃO (TABELA E VALIDADE)        */}
        {/* ========================================================= */}
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
                      // Ao trocar a tabela, limpamos a validade anterior para não dar erro
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
                      disabled={!tabelaSelecionada} // Fica bloqueado até escolher a tabela
                      className="w-full rounded-xl border border-fritz-stone-200 bg-fritz-stone-50 px-4 py-3 text-sm text-fritz-stone-900 outline-none focus:border-fritz-bright-600 focus:bg-white focus:ring-2 focus:ring-fritz-bright-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Selecione um período...</option>
                      {validadesDisponiveis.map((val, idx) => {
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
                    <Button type="button" onClick={() => setModalValidadeAberto(false)} className="flex-1 bg-white border border-fritz-stone-200 text-fritz-stone-700 hover:bg-fritz-stone-50 py-3 rounded-xl font-semibold">Voltar</Button>
                    <Button type="submit" disabled={gravandoNovaValidade} className="flex-1 bg-fritz-bright-700 hover:bg-fritz-bright-800 text-white py-3 rounded-xl font-semibold flex justify-center items-center">
                      {gravandoNovaValidade ? "Validando no ERP..." : "Simular preços"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PASSO 3: SPREADSHEET DE SIMULAÇÃO (OFICINA DE PREÇOS)     */}
        {/* ========================================================= */}
        {passoAtual === 3 && (
          <div className="bg-white rounded-2xl border border-fritz-stone-200 shadow-sm p-6 flex flex-col flex-1 animate-in fade-in slide-in-from-right-8 duration-300 relative">
            
            {/* FLOATING BAR DE EDIÇÃO EM LOTE DA OFICINA */}
            {selecionadosOficina.size > 0 && (
              <div className="absolute top-2 left-0 right-0 z-50 flex justify-center w-full pointer-events-none">
                <div className="bg-fritz-stone-900 text-white rounded-full px-6 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-center gap-4 animate-in slide-in-from-top-4 fade-in duration-300 border border-fritz-stone-700 pointer-events-auto">
                  <span className="text-sm font-semibold">{selecionadosOficina.size} na fila de edição</span>
                  <div className="w-px h-4 bg-fritz-stone-700"></div>
                  <button onClick={() => setIsBulkPromoOpen(true)} className="text-sm font-bold text-fritz-bright-400 hover:text-fritz-bright-300 transition-colors flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                    Aplicar em lote
                  </button>
                  <button onClick={() => setSelecionadosOficina(new Set())} className="ml-2 text-fritz-stone-400 hover:text-white transition-colors" title="Limpar seleção">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
              </div>
            )}

            {/* MODAL DE EDIÇÃO EM LOTE */}
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

            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-black text-fritz-stone-900 tracking-tight">Simulador Estratégico de Margens</h2>
                <p className="text-sm text-fritz-stone-500 mt-1">Campanha vinculada à tabela <strong className="text-fritz-bright-700 font-bold">{tabelaSelecionada}</strong> ({validadeSelecionada})</p>
              </div>
              <Button onClick={voltarParaSelecao} className="text-sm font-semibold text-fritz-stone-500 hover:text-fritz-stone-900 underline bg-transparent shadow-none border-none p-0 h-auto">
                ← Adicionar/remover produtos
              </Button>
            </div>

            <div className="rounded-xl border border-fritz-stone-200 overflow-hidden flex-1 mb-6">
              <div className="overflow-auto max-h-[calc(100vh-380px)] relative">
                <table className="w-full text-left text-sm text-fritz-stone-700 table-fixed min-w-max">
                  <thead className="bg-fritz-stone-100/50 text-xs font-semibold uppercase tracking-wider text-fritz-stone-500">
                    <tr>
                      <ThOrdenavel label="Check" larguraInicial="60px" align="center">
                        <div className="flex items-center justify-center w-full">
                          <input type="checkbox" checked={todosDaOficinaSelecionados} onChange={toggleSelecionarTodosOficina} className="h-4 w-4 rounded border-fritz-stone-300 text-fritz-stone-600 focus:ring-fritz-stone-600 cursor-pointer" />
                        </div>
                      </ThOrdenavel>
                      <ThOrdenavel label="Família" sortKey="familyDescription" larguraInicial="200px" sortConfig={sortConfig} onSort={handleSort} />
                      <ThOrdenavel label="Código" sortKey="code" larguraInicial="110px" sortConfig={sortConfig} onSort={handleSort} />
                      <ThOrdenavel label="Descrição" sortKey="description" larguraInicial="300px" sortConfig={sortConfig} onSort={handleSort} />
                      
                      <ThOrdenavel label="Custo Médio" sortKey="average" larguraInicial="130px" align="right" />
                      
                      <ThOrdenavel label="PREÇO SIMULADO" larguraInicial="160px" align="right">
                        <span className="text-fritz-bright-700 font-extrabold tracking-tight">PREÇO SIMULADO</span>
                      </ThOrdenavel>
                      <ThOrdenavel label="PREÇO FINAL PROMO" larguraInicial="180px" align="right">
                        <span className="text-fritz-green-700 font-extrabold tracking-tight">PREÇO FINAL PROMO</span>
                      </ThOrdenavel>

                      <ThOrdenavel label="ICMS-(E)" sortKey="inboundIcms" larguraInicial="100px" align="right" />
                      <ThOrdenavel label="PIS/COF-(E)" sortKey="inboundCofinsAndPis" larguraInicial="110px" align="right" />
                      <ThOrdenavel label="IPI-(E)" sortKey="inboundIpi" larguraInicial="100px" align="right" />
                      <ThOrdenavel label="Frete-(E)" sortKey="inboundFreight" larguraInicial="100px" align="right" />

                      <ThOrdenavel label="ICMS-(S)" sortKey="icms" larguraInicial="100px" align="right" />
                      <ThOrdenavel label="IPI-(S)" sortKey="ipi" larguraInicial="100px" align="right" />
                      <ThOrdenavel label="PIS-(S)" sortKey="pis" larguraInicial="100px" align="right" />
                      <ThOrdenavel label="COFINS-(S)" sortKey="cofins" larguraInicial="110px" align="right" />
                      <ThOrdenavel label="Frete-(S)" sortKey="freight" larguraInicial="100px" align="right" />

                      <ThOrdenavel label="Custo Fixo" sortKey="fixedCoast" larguraInicial="100px" align="right" />
                      <ThOrdenavel label="Comissão Int." sortKey="internalComission" larguraInicial="120px" align="right" />
                      <ThOrdenavel label="Comissão Ext." sortKey="externalComission" larguraInicial="120px" align="right" />
                      <ThOrdenavel label="Lucro Promo" sortKey="profit" larguraInicial="120px" align="right" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-fritz-stone-100 bg-white">
                    {produtosNoCarrinhoOrdenados.map((produtoBase) => {
                      const rascunho = rascunhosPromo[produtoBase.code] || { ...produtoBase };
                      const isSelecionadoOficina = selecionadosOficina.has(rascunho.code);
                      
                      // Executa a conta de markup real-time espelhando a base (PCC Deduzido)
                      const precoSimuladoRealtime = calcularPrecoSimulado(rascunho);
                      const precoFinalPromo = rascunho.basePricePromo !== undefined ? rascunho.basePricePromo : precoSimuladoRealtime;

                      return (
                        <tr key={rascunho.code} className={`transition-colors ${isSelecionadoOficina ? "bg-fritz-stone-50" : "hover:bg-fritz-stone-50/60"}`}>
                          <td className="px-4 py-4 text-center align-middle" onClick={(e) => e.stopPropagation()}>
                            <input type="checkbox" checked={isSelecionadoOficina} onChange={() => toggleSelecionarOficina(rascunho.code)} className="h-4 w-4 rounded border-fritz-stone-300 text-fritz-stone-600 focus:ring-fritz-stone-600 cursor-pointer" />
                          </td>
                          <td className="px-4 py-4 truncate text-fritz-stone-600 align-middle text-xs" title={`${rascunho.familyCode || ''} - ${rascunho.familyDescription || 'Sem Família'}`}>
                            {rascunho.familyCode && (
                              <span className="inline-flex items-center justify-center rounded bg-fritz-stone-100 px-1.5 py-0.5 text-[10px] font-bold text-fritz-stone-500 mr-2 border border-fritz-stone-200">
                                {rascunho.familyCode}
                              </span>
                            )}
                            {rascunho.familyDescription || "-"}
                          </td>
                          <td className="px-4 py-4 font-mono font-medium text-fritz-stone-800">{rascunho.code}</td>
                          <td className="px-4 py-4 truncate font-medium text-fritz-stone-900">{rascunho.description}</td>
                          
                          <td className="px-4 py-4 font-medium text-right text-fritz-stone-600">
                            <CelulaInteligente tipo="moeda" align="right" valor={rascunho.average} onChange={(v: number) => handleEditPromo(produtoBase, "average", v)} />
                          </td>

                          <td className="px-4 py-4 text-right font-extrabold text-fritz-bright-700 bg-fritz-bright-50/30 select-none">
                            {formatarMoeda(precoSimuladoRealtime)}
                          </td>

                          <td className="px-4 py-4 font-black text-fritz-green-700 bg-fritz-green-50/20">
                            <CelulaInteligente tipo="moeda" align="right" valor={precoFinalPromo} onChange={(v: number) => handleEditPromo(produtoBase, "basePricePromo", v)} />
                          </td>

                          <td className="px-4 py-4"><CelulaInteligente tipo="porcentagem" align="right" valor={rascunho.inboundIcms} onChange={(v: number) => handleEditPromo(produtoBase, "inboundIcms", v)} /></td>
                          <td className="px-4 py-4"><CelulaInteligente tipo="porcentagem" align="right" valor={rascunho.inboundCofinsAndPis} onChange={(v: number) => handleEditPromo(produtoBase, "inboundCofinsAndPis", v)} /></td>
                          <td className="px-4 py-4"><CelulaInteligente tipo="porcentagem" align="right" valor={rascunho.inboundIpi} onChange={(v: number) => handleEditPromo(produtoBase, "inboundIpi", v)} /></td>
                          <td className="px-4 py-4"><CelulaInteligente tipo="porcentagem" align="right" valor={rascunho.inboundFreight} onChange={(v: number) => handleEditPromo(produtoBase, "inboundFreight", v)} /></td>

                          <td className="px-4 py-4"><CelulaInteligente tipo="porcentagem" align="right" valor={rascunho.icms} onChange={(v: number) => handleEditPromo(produtoBase, "icms", v)} /></td>
                          <td className="px-4 py-4"><CelulaInteligente tipo="porcentagem" align="right" valor={rascunho.ipi} onChange={(v: number) => handleEditPromo(produtoBase, "ipi", v)} /></td>
                          <td className="px-4 py-4"><CelulaInteligente tipo="porcentagem" align="right" valor={rascunho.pis} onChange={(v: number) => handleEditPromo(produtoBase, "pis", v)} /></td>
                          <td className="px-4 py-4"><CelulaInteligente tipo="porcentagem" align="right" valor={rascunho.cofins} onChange={(v: number) => handleEditPromo(produtoBase, "cofins", v)} /></td>
                          <td className="px-4 py-4"><CelulaInteligente tipo="porcentagem" align="right" valor={rascunho.freight} onChange={(v: number) => handleEditPromo(produtoBase, "freight", v)} /></td>

                          <td className="px-4 py-4"><CelulaInteligente tipo="porcentagem" align="right" valor={rascunho.fixedCoast} onChange={(v: number) => handleEditPromo(produtoBase, "fixedCoast", v)} /></td>
                          <td className="px-4 py-4"><CelulaInteligente tipo="porcentagem" align="right" valor={rascunho.internalComission} onChange={(v: number) => handleEditPromo(produtoBase, "internalComission", v)} /></td>
                          <td className="px-4 py-4"><CelulaInteligente tipo="porcentagem" align="right" valor={rascunho.externalComission} onChange={(v: number) => handleEditPromo(produtoBase, "externalComission", v)} /></td>
                          <td className="px-4 py-4"><CelulaInteligente tipo="porcentagem" align="right" valor={rascunho.profit} onChange={(v: number) => handleEditPromo(produtoBase, "profit", v)} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-fritz-stone-100 gap-4">
              <Button onClick={salvarRascunhoSenior} disabled={salvandoRascunho || efetivandoPromocao} className="bg-white border-2 border-fritz-stone-200 text-fritz-stone-700 hover:bg-fritz-stone-50 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                {salvandoRascunho ? "Guardando..." : "Salvar Rascunho"}
              </Button>
              <Button onClick={efetivarCampanhaSenior} disabled={salvandoRascunho || efetivandoPromocao} className="bg-fritz-bright-700 hover:bg-fritz-bright-800 text-white px-10 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md">
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
        )}

        {/* ========================================================= */}
        {/* MODAL DE SUCESSO (FINALIZAÇÃO)                            */}
        {/* ========================================================= */}
        {modalSucessoAberto && (
          <div className="fixed inset-0 bg-fritz-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] shadow-2xl w-[420px] overflow-hidden animate-in zoom-in-95 duration-300 text-center p-8">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6 shadow-inner border-4 border-white ring-4 ring-green-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h3 className="text-2xl font-black text-fritz-stone-900 mb-2 tracking-tight">Promoção Integrada!</h3>
              <p className="text-sm text-fritz-stone-500 mb-8 px-4">Os preços simulados foram enviados ao Senior Sistemas para a tabela <strong className="text-fritz-stone-700">{tabelaSelecionada}</strong> com sucesso.</p>
              
              <div className="flex w-full justify-center">
                <Button onClick={fecharSucesso} className="w-full bg-fritz-bright-700 hover:bg-fritz-bright-800 text-white py-4 rounded-xl font-bold text-base shadow-md">
                  Criar Nova Campanha
                </Button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}