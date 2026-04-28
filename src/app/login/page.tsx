"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);

    setTimeout(() => {
      localStorage.setItem("token", "jwt-token-mockado");
      localStorage.setItem("usuario", usuario);

      router.push("/produtos");
    }, 700);
  }

  return (
    <main className="flex min-h-screen bg-fritz-stone-50 text-fritz-stone-900">
      <section className="hidden min-h-screen flex-1 items-center justify-center bg-gradient-to-br from-fritz-green-900 via-fritz-bright-800 to-fritz-bright-950 lg:flex">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-2xl border border-white/20 bg-white/10 px-8 py-6 shadow-lg backdrop-blur-md">
            <h1 className="text-4xl font-black italic tracking-tight text-white">
              FRITZ
            </h1>

            <p className="mt-1 text-[11px] font-semibold tracking-[0.3em] text-fritz-yellow-300">
              MATERIAIS ELÉTRICOS
            </p>
          </div>


        </div>
      </section>

      <section className="flex min-h-screen w-full items-center justify-center px-6 py-10 lg:w-[520px]">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md rounded-3xl border border-fritz-stone-200 bg-white p-8 shadow-xl"
        >
          <div className="mb-8 lg:hidden">
            <div className="w-fit rounded-2xl border border-fritz-green-700 bg-fritz-green-800 px-6 py-4 text-white shadow-md">
              <h1 className="text-3xl font-black italic tracking-tight">
                FRITZ
              </h1>
              <p className="text-[10px] font-bold tracking-[0.28em] text-fritz-yellow-300">
                MATERIAIS ELÉTRICOS
              </p>
            </div>
          </div>

          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-fritz-bright-700">
              Acesso restrito
            </p>


            <p className="mt-2 text-sm text-fritz-stone-500">
              Informe seu usuário e senha para acessar o painel.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-fritz-stone-700">
                Usuário
              </label>

              <input
                value={usuario}
                onChange={(event) => setUsuario(event.target.value)}
                type="text"
                placeholder="Digite seu usuário"
                className="w-full rounded-xl border border-fritz-stone-200 bg-white px-4 py-3 text-sm text-fritz-stone-900 outline-none transition placeholder:text-fritz-stone-400 focus:border-fritz-bright-600 focus:ring-2 focus:ring-fritz-bright-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-fritz-stone-700">
                Senha
              </label>

              <input
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                type="password"
                placeholder="Digite sua senha"
                className="w-full rounded-xl border border-fritz-stone-200 bg-white px-4 py-3 text-sm text-fritz-stone-900 outline-none transition placeholder:text-fritz-stone-400 focus:border-fritz-bright-600 focus:ring-2 focus:ring-fritz-bright-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-fritz-bright-700 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:bg-fritz-bright-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>

          {/* <div className="mt-8 rounded-2xl bg-fritz-green-50 p-4">
            <p className="text-sm font-semibold text-fritz-green-900">
              Ambiente de demonstração
            </p>
            <p className="mt-1 text-xs leading-5 text-fritz-stone-600">
              Por enquanto o login está mockado. Depois, este formulário vai
              chamar o backend, validar o usuário no ERP e armazenar o JWT.
            </p>
          </div> */}
        </form>
      </section>
    </main>
  );
}