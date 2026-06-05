"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

type EmpresaContextType = {
  contexto: SelecaoEmpresa | null;
  atualizarContexto: (novaSelecao: SelecaoEmpresa) => void;
  loadingContexto: boolean;
};

const EmpresaContext = createContext<EmpresaContextType | undefined>(undefined);

export function EmpresaProvider({ children }: { children: ReactNode }) {
  const [contexto, setContexto] = useState<SelecaoEmpresa | null>(null);
  const [loadingContexto, setLoadingContexto] = useState(true);

  useEffect(() => {
    const salvo = localStorage.getItem("contextoEmpresa");
    if (salvo) {
      try {
        setContexto(JSON.parse(salvo));
      } catch (e) {
        console.error("Erro ao ler contexto do localStorage", e);
      }
    }
    setLoadingContexto(false);
  }, []);

  const atualizarContexto = (novaSelecao: SelecaoEmpresa) => {
    localStorage.setItem("contextoEmpresa", JSON.stringify(novaSelecao));
    setContexto(novaSelecao);
  };

  return (
    <EmpresaContext.Provider value={{ contexto, atualizarContexto, loadingContexto }}>
      {children}
    </EmpresaContext.Provider>
  );
}

export function useEmpresa() {
  const context = useContext(EmpresaContext);
  if (!context) {
    throw new Error("useEmpresa deve ser usado dentro de um EmpresaProvider");
  }
  return context;
}