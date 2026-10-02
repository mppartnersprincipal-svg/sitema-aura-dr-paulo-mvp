"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Building2, ExternalLink, Handshake, Inbox, LayoutDashboard, LogOut, Menu, RotateCcw, X } from "lucide-react";
import { Carregando } from "@/components/carregando";
import { Marca } from "@/components/marca";
import { sairAdmin } from "@/lib/admin-session";
import { estaEncerrada } from "@/lib/format";
import { resetarDemo, useAura } from "@/lib/store";
import { Notificacoes } from "./notificacoes";

const NAV = [
  { href: "/admin", label: "Painel", icone: LayoutDashboard },
  { href: "/admin/denuncias", label: "Denúncias", icone: Inbox },
  { href: "/admin/empresas", label: "Empresas", icone: Building2 },
  { href: "/admin/leads", label: "Leads comerciais", icone: Handshake },
];

const ITEM_RODAPE = "flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/65 hover:text-white";

function estaAtivo(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const estado = useAura();
  const pathname = usePathname();
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);

  if (!estado) return <Carregando />;
  const abertas = estado.denuncias.filter((d) => !estaEncerrada(d)).length;

  function handleSair() {
    sairAdmin();
    router.replace("/admin/login");
  }

  function handleResetar() {
    if (window.confirm("Restaurar os dados de demonstração? Tudo que foi criado neste navegador será apagado.")) {
      resetarDemo();
      router.push("/admin");
    }
  }

  const navegacao = (
    <nav aria-label="Painel administrativo" className="flex flex-1 flex-col gap-1">
      {NAV.map(({ href, label, icone: Icone }) => (
        <Link
          key={href}
          href={href}
          onClick={() => setMenuAberto(false)}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            estaAtivo(pathname, href) ? "bg-white/10 text-white" : "text-white/65 hover:bg-white/5 hover:text-white"
          }`}
        >
          <Icone className="h-4.5 w-4.5" aria-hidden="true" />
          <span className="flex-1">{label}</span>
          {href === "/admin/denuncias" && abertas > 0 && (
            <span className="rounded-full bg-acao px-2 py-0.5 text-xs font-semibold text-white">{abertas}</span>
          )}
        </Link>
      ))}
      <div className="mt-auto space-y-1 border-t border-white/10 pt-4">
        <Link href="/" target="_blank" className={ITEM_RODAPE}>
          <ExternalLink className="h-4 w-4" aria-hidden="true" /> Ver portal público
        </Link>
        <button type="button" onClick={handleResetar} className={ITEM_RODAPE}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Restaurar demonstração
        </button>
        <button type="button" onClick={handleSair} className={ITEM_RODAPE}>
          <LogOut className="h-4 w-4" aria-hidden="true" /> Sair
        </button>
      </div>
    </nav>
  );

  return (
    <div className="flex flex-1">
      <aside className="no-print sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-8 bg-tinta px-4 py-6 lg:flex">
        <div className="px-2">
          <Marca variante="clara" />
        </div>
        {navegacao}
      </aside>

      {menuAberto && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <aside className="flex w-72 flex-col gap-8 bg-tinta px-4 py-6">
            <div className="flex items-center justify-between px-2">
              <Marca variante="clara" />
              <button type="button" className="text-white" onClick={() => setMenuAberto(false)} aria-label="Fechar menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            {navegacao}
          </aside>
          <button type="button" className="flex-1 bg-tinta/40" aria-label="Fechar menu" onClick={() => setMenuAberto(false)} />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="no-print sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-linha bg-papel/90 px-4 py-3 backdrop-blur sm:px-8">
          <button type="button" className="btn btn-fantasma btn-sm lg:hidden" onClick={() => setMenuAberto(true)} aria-label="Abrir menu">
            <Menu className="h-5 w-5" />
          </button>
          <span className="hidden text-sm text-suave lg:block">Apurador independente · Canal AURA</span>
          <div className="flex items-center gap-3">
            <Notificacoes itens={estado.notificacoes} />
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-tinta font-serif text-sm font-semibold text-white">
              DP
            </span>
          </div>
        </header>
        <main className="flex-1 px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
