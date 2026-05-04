"use client";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-72   flex-col bg-linear-to-b from-fritz-green-800 via-fritz-bright-800 to-fritz-bright-950 p-6 text-white shadow-xl">
      <div className="mb-10">
        <div className="rounded-xl border border-white/30 bg-white/10 px-5 py-4 shadow-md">
          <h1 className="text-3xl font-black italic tracking-tight">
            FRITZ
          </h1>
          <p className="text-xs font-semibold tracking-[0.25em] text-fritz-yellow-300">
            MATERIAIS ELÉTRICOS
          </p>
        </div>
      </div>

      <nav className="space-y-3">
        <Link
          href="/produtos"
          className={`block rounded-xl ${pathname === "/produtos" ? "bg-black/15" : ""} px-4 py-3 text-sm font-semibold text-white/80 shadow-sm transition hover:bg-white/15 hover:text-white`}
        >
          Produtos
        </Link>

        <Link
          href="/financeiro"
          className={`block rounded-xl ${pathname === "/financeiro" ? "bg-black/15" : ""} px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white`}
        >
          Financeiro
        </Link>

        <Link
          href="/login"
          className="block rounded-xl px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          Sair
        </Link>
      </nav>

      <div className="mt-auto rounded-xl border border-white/20 bg-white/10 p-4">
        <p className="text-sm font-semibold">Admin</p>
        <p className="text-xs text-white/70">admin@fritz.com.br</p>
      </div>
    </aside>
  );
}