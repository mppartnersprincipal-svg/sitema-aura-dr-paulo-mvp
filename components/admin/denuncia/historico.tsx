import { Eye, Lock } from "lucide-react";
import { EtapaBadge } from "@/components/badges";
import { formatDataHora } from "@/lib/format";
import type { HistoricoEtapa } from "@/lib/types";

export function HistoricoAdmin({ historico }: { historico: HistoricoEtapa[] }) {
  const ordenado = [...historico].sort((a, b) => b.created_at.localeCompare(a.created_at));
  return (
    <section className="cartao p-6">
      <h2 className="text-lg font-semibold text-tinta">Linha do tempo</h2>
      <ol className="mt-5 space-y-5 border-l-2 border-linha pl-5">
        {ordenado.map((h) => (
          <li key={h.id} className="relative">
            <span className="absolute top-1.5 -left-[27px] h-3 w-3 rounded-full border-2 border-white bg-tinta-700" aria-hidden="true" />
            <div className="flex flex-wrap items-center gap-2">
              <EtapaBadge etapa={h.etapa} />
              <span className="text-xs text-suave">{formatDataHora(h.created_at)}</span>
            </div>
            {h.observacao_publica && (
              <p className="mt-2 flex gap-2 text-sm text-texto">
                <Eye className="mt-0.5 h-4 w-4 shrink-0 text-acao" aria-label="Visível ao denunciante" />
                {h.observacao_publica}
              </p>
            )}
            {h.observacao_interna && (
              <p className="mt-2 flex gap-2 rounded-lg bg-alerta-claro px-3 py-2 text-sm text-alerta">
                <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-label="Interna" />
                {h.observacao_interna}
              </p>
            )}
          </li>
        ))}
      </ol>
      <p className="mt-5 flex flex-wrap gap-4 text-xs text-suave">
        <span className="flex items-center gap-1.5">
          <Eye className="h-3.5 w-3.5 text-acao" aria-hidden="true" /> visível ao denunciante
        </span>
        <span className="flex items-center gap-1.5">
          <Lock className="h-3.5 w-3.5 text-alerta" aria-hidden="true" /> somente o apurador
        </span>
      </p>
    </section>
  );
}
