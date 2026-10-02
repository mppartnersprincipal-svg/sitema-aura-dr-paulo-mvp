"use client";

import { Lightbulb } from "lucide-react";
import { MIN_RELATO } from "@/lib/config";
import type { Rascunho } from "./tipos";

type Props = {
  rascunho: Rascunho;
  onChange: (patch: Partial<Rascunho>) => void;
  onContinuar: () => void;
};

type CampoOpcional = "denunciado_nome" | "denunciado_cargo" | "local_ocorrencia" | "data_ocorrencia_aprox";

const MAX_RELATO = 10000;

const OPCIONAIS: { campo: CampoOpcional; rotulo: string; dica: string; tipo?: string }[] = [
  { campo: "denunciado_nome", rotulo: "Nome ou apelido de quem fez", dica: "Ex.: “Seu Zé do almoxarifado”" },
  { campo: "denunciado_cargo", rotulo: "Cargo dessa pessoa", dica: "Ex.: supervisor, gerente, colega" },
  { campo: "local_ocorrencia", rotulo: "Onde aconteceu", dica: "Ex.: sala do financeiro, refeitório" },
  { campo: "data_ocorrencia_aprox", rotulo: "Quando aconteceu (aproximado)", dica: "", tipo: "date" },
];

export function PassoRelato({ rascunho, onChange, onContinuar }: Props) {
  const faltam = Math.max(0, MIN_RELATO - rascunho.relato.trim().length);
  const hoje = new Date().toISOString().slice(0, 10);

  return (
    <section aria-labelledby="titulo-relato">
      <h1 id="titulo-relato" className="titulo text-3xl">
        Conte o que aconteceu
      </h1>
      <p className="mt-2 text-lg text-suave">Escreva do seu jeito. Não precisa ser bonito, precisa ser verdade.</p>

      <div className="mt-6 flex gap-3 rounded-xl bg-tinta-100/60 p-4 text-sm text-tinta">
        <Lightbulb className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span>
          Ajuda se você contar: <strong>o que</strong> aconteceu, <strong>quando</strong>, <strong>onde</strong> e{" "}
          <strong>se alguém viu</strong>. Não escreva o seu próprio nome.
        </span>
      </div>

      <label htmlFor="relato" className="rotulo mt-6">
        Relato
      </label>
      <textarea
        id="relato"
        rows={8}
        maxLength={MAX_RELATO}
        className="campo text-lg leading-relaxed"
        value={rascunho.relato}
        onChange={(e) => onChange({ relato: e.target.value })}
        aria-describedby="contador-relato"
      />
      <p id="contador-relato" className={`mt-1.5 text-sm ${faltam > 0 ? "text-suave" : "text-acao"}`}>
        {faltam > 0 ? `Escreva mais ${faltam} letras para continuar.` : "✓ Relato suficiente."}
      </p>

      <fieldset className="mt-8">
        <legend className="text-sm font-semibold tracking-[0.1em] text-suave uppercase">Informações opcionais</legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {OPCIONAIS.map((o) => (
            <div key={o.campo}>
              <label htmlFor={o.campo} className="rotulo">
                {o.rotulo} <span className="font-normal text-suave">(opcional)</span>
              </label>
              <input
                id={o.campo}
                type={o.tipo ?? "text"}
                max={o.tipo === "date" ? hoje : undefined}
                maxLength={200}
                placeholder={o.dica}
                className="campo"
                value={rascunho[o.campo]}
                onChange={(e) => onChange({ [o.campo]: e.target.value })}
              />
            </div>
          ))}
        </div>
      </fieldset>

      <button type="button" className="btn btn-acao mt-8 w-full py-4 text-lg" disabled={faltam > 0} onClick={onContinuar}>
        Continuar
      </button>
    </section>
  );
}
