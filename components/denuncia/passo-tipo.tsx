"use client";

import { CircleHelp, ClipboardList, Hand, MessageSquareWarning, UsersRound, type LucideIcon } from "lucide-react";
import { TIPO_DESCRICAO, TIPO_LABEL } from "@/lib/format";
import type { TipoDenuncia } from "@/lib/types";

const OPCOES: { tipo: TipoDenuncia; icone: LucideIcon; cor: string }[] = [
  { tipo: "assedio_moral", icone: MessageSquareWarning, cor: "bg-[#f6e7e3] text-[#9c3b25]" },
  { tipo: "assedio_sexual", icone: Hand, cor: "bg-[#f3e4ee] text-[#8a2d64]" },
  { tipo: "discriminacao", icone: UsersRound, cor: "bg-[#e7e6f5] text-[#4b3a7a]" },
  { tipo: "reclamacao", icone: ClipboardList, cor: "bg-alerta-claro text-alerta" },
  { tipo: "outros", icone: CircleHelp, cor: "bg-tinta-100 text-tinta" },
];

type Props = {
  selecionado?: TipoDenuncia;
  onEscolher: (tipo: TipoDenuncia) => void;
};

export function PassoTipo({ selecionado, onEscolher }: Props) {
  return (
    <section aria-labelledby="titulo-tipo">
      <h1 id="titulo-tipo" className="titulo text-3xl">
        O que aconteceu?
      </h1>
      <p className="mt-2 text-lg text-suave">Escolha o que mais se parece. Se não souber, toque em “Outro assunto”.</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {OPCOES.map(({ tipo, icone: Icone, cor }) => {
          const ativo = tipo === selecionado;
          return (
            <li key={tipo} className={tipo === "outros" ? "sm:col-span-2" : ""}>
              <button
                type="button"
                aria-pressed={ativo}
                onClick={() => onEscolher(tipo)}
                className={`flex h-full w-full items-center gap-4 rounded-2xl border-2 bg-white p-5 text-left transition-colors hover:border-acao focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-tinta-700 ${
                  ativo ? "border-acao" : "border-linha"
                }`}
              >
                <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${cor}`}>
                  <Icone className="h-8 w-8" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-xl font-semibold text-tinta">{TIPO_LABEL[tipo]}</span>
                  <span className="text-sm leading-snug text-suave">{TIPO_DESCRICAO[tipo]}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
