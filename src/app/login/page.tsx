"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Input } from "@/components/tailgrids/core/input";
import { Button } from "@/components/tailgrids/core/button";
import { EmpresaModal, type Empresa, type SelecaoEmpresa } from "@/components/EmpresaModal";
import { ErrorModal } from "@/components/ErrorModal";

export default function LoginPage() {
  const router = useRouter();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [showEmpresaModal, setShowEmpresaModal] = useState(false);
  const [listaEmpresas, setListaEmpresas] = useState<Empresa[]>([]);
  
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!usuario || !senha) {
      setErrorMessage("Por favor, preencha os campos de usuário e senha para continuar.");
      setShowErrorModal(true);
      return;
    }

    setLoading(true);

    try {
      const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usuario, password: senha }),
      });

      // Se as credenciais estiverem erradas, tratamos direto aqui sem estourar um erro no console
      if (!loginResponse.ok) {
        setErrorMessage("Não foi possível acessar o sistema. Verifique suas credenciais e tente novamente.");
        setShowErrorModal(true);
        setLoading(false);
        return; // Interrompe a função de forma limpa
      }

      const loginData = await loginResponse.json();
      const token = loginData.access_token;
      
      localStorage.setItem("token", token);
      localStorage.setItem("usuario", loginData.user.username);
      document.cookie = `token=${token}; path=/; max-age=86400`;

      const compResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/senior/companies`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!compResponse.ok) {
        setErrorMessage("Erro ao buscar a lista de empresas vinculadas.");
        setShowErrorModal(true);
        setLoading(false);
        return;
      }

      const compData = await compResponse.json();

      const empresasFormatadas: Empresa[] = compData.map((emp: any) => {
        const rawFiliais = emp.filiais;
        const filiaisArray = Array.isArray(rawFiliais) ? rawFiliais : [rawFiliais];

        return {
          id: emp.codigo,
          razao_social: emp.nome,
          filiais: filiaisArray.map((f: any) => ({
            id: f.codigo,
            nome: f.nome,
          })),
        };
      });

      setListaEmpresas(empresasFormatadas);
      setShowEmpresaModal(true);
      
    } catch (error) {
      console.error("Erro de conexão no fluxo de autenticação:", error);
      setErrorMessage("Servidor indisponível no momento. Tente novamente em alguns instantes.");
      setShowErrorModal(true);
      setLoading(false);
    }
  }

  function handleConfirmarEmpresa(selecao: SelecaoEmpresa) {
    localStorage.setItem("contextoEmpresa", JSON.stringify(selecao));
    router.push("/produtos");
  }

  return (
    <main className="flex min-h-screen text-fritz-stone-900 relative">
      <ErrorModal isOpen={showErrorModal} message={errorMessage} onClose={() => setShowErrorModal(false)} />
      
      <EmpresaModal 
        isOpen={showEmpresaModal} 
        empresas={listaEmpresas} 
        onConfirm={handleConfirmarEmpresa}
        onCancel={() => {
          setShowEmpresaModal(false); // Fecha o modal
          setLoading(false);          // Libera o botão de login novamente
        }} 
      />

      <section className="hidden flex-1 items-center justify-center bg-linear-to-br from-fritz-green-900 via-fritz-bright-800 to-fritz-bright-950 lg:flex">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-3xl border border-white/20 bg-white/10 px-12 py-10 shadow-2xl backdrop-blur-md transition-transform hover:scale-105">
            <h1 className="text-6xl font-black italic tracking-tight text-white drop-shadow-lg">FRITZ</h1>
            <p className="mt-3 text-[14px] font-bold tracking-[0.35em] text-fritz-yellow-300 drop-shadow-md">MATERIAIS ELÉTRICOS</p>
          </div>
        </div>
      </section>

      <section className="flex min-h-screen w-full items-center justify-center bg-fritz-stone-50 px-6 py-10 lg:w-[480px] xl:w-[520px]">
        <form onSubmit={handleLogin} className="w-full max-w-md rounded-3xl border border-fritz-stone-200 bg-white p-10 shadow-xl">
          <div className="mb-8 lg:hidden">
            <div className="w-fit rounded-2xl border border-fritz-green-700 bg-fritz-green-800 px-6 py-4 text-white shadow-md">
              <h1 className="text-3xl font-black italic tracking-tight">FRITZ</h1>
              <p className="text-[10px] font-bold tracking-[0.28em] text-fritz-yellow-300">MATERIAIS ELÉTRICOS</p>
            </div>
          </div>

          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-fritz-bright-700">Acesso restrito</p>
            <p className="mt-2 text-sm text-fritz-stone-500">Informe seu usuário e senha para acessar o painel.</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-fritz-stone-700">Usuário</label>
              <Input value={usuario} onChange={(e) => setUsuario(e.target.value)} type="text" placeholder="Digite seu usuário" className="w-full" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-fritz-stone-700">Senha</label>
              <Input value={senha} onChange={(e) => setSenha(e.target.value)} type="password" placeholder="Digite sua senha" className="w-full" />
            </div>
            <Button type="submit" disabled={loading} className="w-full border-transparent bg-fritz-bright-700 py-3 text-white shadow-md transition-colors hover:bg-fritz-bright-800">
              {loading ? "Autenticando..." : "Entrar"}
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}