import Link from "next/link";
import { LogOut } from "lucide-react";
import { Marca } from "@/components/marca";

// Área do denunciante: sem rastreadores, sem botão de WhatsApp, com saída rápida.
export default function DenunciaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="no-print border-b border-linha bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" aria-label="AURA — página inicial">
            <Marca compacta />
          </Link>
          <a
            href="https://www.google.com.br"
            className="btn btn-fantasma btn-sm text-suave"
            title="Sai imediatamente para outro site"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Saída rápida
          </a>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="no-print border-t border-linha py-6 text-center text-xs text-suave">
        Canal independente · Nenhum dado de identificação é coletado ·{" "}
        <Link href="/privacidade" className="underline underline-offset-2">
          Privacidade
        </Link>
      </footer>
    </>
  );
}
