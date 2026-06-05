import { useState, useEffect } from "react";
import { Button } from "@/components/tailgrids/core/button";

export type Filial = {
  id: string;
  nome: string;
};

export type Empresa = {
  id: string;
  razao_social: string;
  filiais: Filial[];
};

export type SelecaoEmpresa = {
  empresa: Empresa;
  filial: Filial;
};

type EmpresaModalProps = {
  isOpen: boolean;
  empresas: Empresa[];
  onConfirm: (selecao: SelecaoEmpresa) => void;
  onCancel?: () => void;
};

export function EmpresaModal({ isOpen, empresas, onConfirm, onCancel }: EmpresaModalProps) {
  const [empresaSelecionadaId, setEmpresaSelecionadaId] = useState("");
  const [filialSelecionadaId, setFilialSelecionadaId] = useState("");
  
  const [menuEmpresaAberto, setMenuEmpresaAberto] = useState(false);
  const [menuFilialAberto, setMenuFilialAberto] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && onCancel) {
        onCancel();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  useEffect(() => {
    if (isOpen && empresas.length > 0) {
      const primeiraEmpresa = empresas[0];
      setEmpresaSelecionadaId(primeiraEmpresa.id);
      
      if (primeiraEmpresa.filiais && primeiraEmpresa.filiais.length > 0) {
        setFilialSelecionadaId(primeiraEmpresa.filiais[0].id);
      } else {
        setFilialSelecionadaId("");
      }
    } else if (isOpen && empresas.length === 0) {
      setEmpresaSelecionadaId("");
      setFilialSelecionadaId("");
    }
  }, [isOpen, empresas]);

  if (!isOpen) return null;

  const empresaSelecionada = empresas.find(e => e.id === empresaSelecionadaId);
  const filiaisDisponiveis = empresaSelecionada?.filiais || [];
  const filialSelecionada = filiaisDisponiveis.find(f => f.id === filialSelecionadaId);

  function handleConfirm() {
    if (!empresaSelecionada || !filialSelecionada) return;
    onConfirm({
      empresa: empresaSelecionada,
      filial: filialSelecionada
    });
  }

  function handleBackdropClick() {
    if (onCancel) {
      onCancel();
    }
  }

  return (
    <div 
      onClick={handleBackdropClick}
      // A MÁGICA AQUI: Mudamos de z-50 para z-[60] para sobrepor a Sidebar!
      className="fixed inset-0 z-[60] flex items-center justify-center bg-fritz-stone-950/60 p-4 backdrop-blur-sm"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg animate-in fade-in zoom-in duration-200 rounded-3xl bg-white p-8 shadow-2xl"
      >
        <h2 className="mb-2 text-2xl font-bold text-fritz-stone-950">Ambiente de Trabalho</h2>
        <p className="mb-6 text-sm text-fritz-stone-500">
          Selecione a empresa e a filial para acessar o sistema.
        </p>

        <div className="mb-8 space-y-5">
          
          <div>
            <label className="mb-2 block text-sm font-semibold text-fritz-stone-700">
              Empresa
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setMenuEmpresaAberto(!menuEmpresaAberto);
                  setMenuFilialAberto(false);
                }}
                className="flex w-full items-center justify-between rounded-xl border border-fritz-stone-200 bg-white px-4 py-3 text-sm text-fritz-stone-900 shadow-sm transition hover:border-fritz-bright-600 focus:border-fritz-bright-600 focus:outline-none focus:ring-2 focus:ring-fritz-bright-100"
              >
                <span className="truncate pr-4">
                  {empresaSelecionada ? `${empresaSelecionada.id} - ${empresaSelecionada.razao_social}` : "Selecione uma empresa..."}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 shrink-0 text-fritz-stone-500 transition-transform ${menuEmpresaAberto ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {menuEmpresaAberto && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuEmpresaAberto(false)}></div>
                  <div className="absolute left-0 top-full z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-fritz-stone-100 bg-white py-1 shadow-lg">
                    {empresas.map(emp => (
                      <button
                        key={emp.id}
                        type="button"
                        onClick={() => {
                          setEmpresaSelecionadaId(emp.id);
                          setFilialSelecionadaId("");
                          setMenuEmpresaAberto(false);
                        }}
                        className={`flex w-full items-center px-4 py-2 text-left text-sm transition-colors hover:bg-fritz-stone-50 ${empresaSelecionadaId === emp.id ? "bg-fritz-bright-50 font-semibold text-fritz-bright-700" : "text-fritz-stone-700"}`}
                      >
                        {emp.id} - {emp.razao_social}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-fritz-stone-700">
              Filial
            </label>
            <div className="relative">
              <button
                type="button"
                disabled={!empresaSelecionadaId || filiaisDisponiveis.length === 0}
                onClick={() => {
                  setMenuFilialAberto(!menuFilialAberto);
                  setMenuEmpresaAberto(false);
                }}
                className="flex w-full items-center justify-between rounded-xl border border-fritz-stone-200 bg-white px-4 py-3 text-sm text-fritz-stone-900 shadow-sm transition hover:border-fritz-bright-600 focus:border-fritz-bright-600 focus:outline-none focus:ring-2 focus:ring-fritz-bright-100 disabled:bg-fritz-stone-50 disabled:text-fritz-stone-400"
              >
                <span className="truncate pr-4">
                  {filialSelecionada ? `${filialSelecionada.id} - ${filialSelecionada.nome}` : "Selecione a filial..."}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 shrink-0 text-fritz-stone-500 transition-transform ${menuFilialAberto ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {menuFilialAberto && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuFilialAberto(false)}></div>
                  <div className="absolute left-0 top-full z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-fritz-stone-100 bg-white py-1 shadow-lg">
                    {filiaisDisponiveis.map(filial => (
                      <button
                        key={filial.id}
                        type="button"
                        onClick={() => {
                          setFilialSelecionadaId(filial.id);
                          setMenuFilialAberto(false);
                        }}
                        className={`flex w-full items-center px-4 py-2 text-left text-sm transition-colors hover:bg-fritz-stone-50 ${filialSelecionadaId === filial.id ? "bg-fritz-bright-50 font-semibold text-fritz-bright-700" : "text-fritz-stone-700"}`}
                      >
                        {filial.id} - {filial.nome}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

        </div>

        <Button
          onClick={handleConfirm}
          disabled={!empresaSelecionadaId || !filialSelecionadaId}
          className="w-full border-transparent bg-fritz-bright-700 py-3 text-white shadow-md transition-colors hover:bg-fritz-bright-800 disabled:opacity-50"
        >
          Acessar Sistema
        </Button>
      </div>
    </div>
  );
}