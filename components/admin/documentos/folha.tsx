"use client";

import { Printer, X } from "lucide-react";

export function BarraImpressao({ titulo }: { titulo: string }) {
  return (
    <div className="no-print sticky top-0 z-10 border-b border-linha bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[210mm] items-center justify-between gap-4 px-4 py-3">
        <p className="text-sm font-medium text-tinta">{titulo}</p>
        <div className="flex gap-2">
          <button type="button" className="btn btn-fantasma btn-sm" onClick={() => window.close()}>
            <X className="h-4 w-4" aria-hidden="true" /> Fechar
          </button>
          <button type="button" className="btn btn-primario btn-sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4" aria-hidden="true" /> Imprimir / Salvar PDF
          </button>
        </div>
      </div>
    </div>
  );
}

/** Folha A4 na tela; na impressão vira a página real. */
export function Folha({ children, quebra = false }: { children: React.ReactNode; quebra?: boolean }) {
  return (
    <article
      className={`mx-auto my-8 max-w-[210mm] bg-white px-[16mm] py-[18mm] text-[13px] leading-relaxed text-texto shadow-lg shadow-tinta/10 print:my-0 print:max-w-none print:p-0 print:shadow-none ${
        quebra ? "break-before-page" : ""
      }`}
    >
      {children}
    </article>
  );
}

export function NaoEncontrado({ texto }: { texto: string }) {
  return <p className="py-24 text-center text-suave">{texto}</p>;
}
