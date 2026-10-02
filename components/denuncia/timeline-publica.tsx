import { Check } from "lucide-react";
import { ETAPA_DESCRICAO, ETAPA_LABEL, ETAPAS_FLUXO, formatData } from "@/lib/format";
import type { Denuncia, Etapa } from "@/lib/types";

/** Linha do tempo para o denunciante: só títulos e observações públicas, nunca anotações internas. */
export function TimelinePublica({ denuncia }: { denuncia: Denuncia }) {
  const fluxo: Etapa[] =
    denuncia.etapa_atual === "arquivada" ? [...ETAPAS_FLUXO.slice(0, -1), "arquivada"] : ETAPAS_FLUXO;
  const indiceAtual = fluxo.indexOf(denuncia.etapa_atual);
  const encerrada = denuncia.etapa_atual === "concluida" || denuncia.etapa_atual === "arquivada";

  return (
    <ol>
      {fluxo.map((etapa, i) => {
        const observacoes = denuncia.historico.filter((h) => h.etapa === etapa && h.observacao_publica);
        const feito = i < indiceAtual || (encerrada && i === indiceAtual);
        const atual = i === indiceAtual && !encerrada;
        const futuro = i > indiceAtual;
        const bolinha = feito
          ? "border-acao bg-acao text-white"
          : atual
            ? "border-acao bg-white ring-4 ring-acao/15"
            : "border-linha bg-white";
        return (
          <li key={etapa} className="relative flex gap-4 pb-7 last:pb-0">
            {i < fluxo.length - 1 && (
              <span className={`absolute top-7 left-[13px] h-full w-0.5 ${feito ? "bg-acao" : "bg-linha"}`} aria-hidden="true" />
            )}
            <span className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${bolinha}`}>
              {feito && <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />}
              {atual && <span className="h-2.5 w-2.5 rounded-full bg-acao" aria-hidden="true" />}
            </span>
            <div className={futuro ? "opacity-50" : ""}>
              <p className="font-semibold text-tinta">
                {ETAPA_LABEL[etapa]}
                {atual && <span className="ml-2 text-xs font-medium text-acao">etapa atual</span>}
              </p>
              {!futuro && <p className="text-sm text-suave">{ETAPA_DESCRICAO[etapa]}</p>}
              {observacoes.map((r) => (
                <p key={r.id} className="mt-2 rounded-lg bg-papel px-3 py-2 text-sm text-texto">
                  <span className="mr-2 text-xs text-suave">{formatData(r.created_at)}</span>
                  {r.observacao_publica}
                </p>
              ))}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
