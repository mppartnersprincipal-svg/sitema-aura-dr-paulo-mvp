"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Marca } from "@/components/marca";

const LINKS = [
  { href: "/como-funciona", label: "Como funciona" },
  { href: "/para-empresas", label: "Para empresas" },
  { href: "/educativo", label: "Educativo" },
  { href: "/perguntas-frequentes", label: "Dúvidas" },
];

export function SiteHeader() {
  const [aberto, setAberto] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-linha/80 bg-papel/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3.5 sm:px-6">
        <Link href="/" aria-label="AURA — página inicial" onClick={() => setAberto(false)}>
          <Marca />
        </Link>

        <nav aria-label="Navegação principal" className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-tinta ${
                pathname === l.href ? "text-tinta" : "text-suave"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/denuncia/acompanhar" className="btn btn-fantasma btn-sm">
            Acompanhar denúncia
          </Link>
          <Link href="/denuncia" className="btn btn-acao btn-sm">
            Fazer denúncia
          </Link>
        </div>

        <button
          type="button"
          className="btn btn-fantasma btn-sm lg:hidden"
          aria-expanded={aberto}
          aria-controls="menu-movel"
          onClick={() => setAberto((v) => !v)}
        >
          {aberto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Menu</span>
        </button>
      </div>

      {aberto && (
        <nav id="menu-movel" aria-label="Navegação móvel" className="border-t border-linha bg-papel px-4 pb-5 lg:hidden">
          <ul className="flex flex-col py-2">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setAberto(false)}
                  className="block rounded-md px-2 py-3 text-base font-medium text-tinta"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="grid gap-2">
            <Link href="/denuncia" className="btn btn-acao" onClick={() => setAberto(false)}>
              Fazer denúncia
            </Link>
            <Link href="/denuncia/acompanhar" className="btn btn-secundario" onClick={() => setAberto(false)}>
              Acompanhar denúncia
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
