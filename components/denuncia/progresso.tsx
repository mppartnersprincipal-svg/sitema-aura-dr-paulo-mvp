import { Check } from "lucide-react";
import { PASSOS_VISIVEIS, type Passo } from "./tipos";

export function Progresso({ atual }: { atual: Passo }) {
  const indiceAtual = PASSOS_VISIVEIS.findIndex((p) => p.id === atual);
  return (
    <nav aria-label="Etapas da denúncia" className="mb-8">
      <ol className="flex items-center gap-1.5">
        {PASSOS_VISIVEIS.map((p, i) => {
          const feito = i < indiceAtual;
          const ativo = i === indiceAtual;
          const corTexto = ativo ? "text-tinta" : feito ? "text-acao" : "text-suave";
          return (
            <li key={p.id} className="flex flex-1 flex-col gap-2" aria-current={ativo ? "step" : undefined}>
              <span className={`h-1.5 rounded-full ${feito || ativo ? "bg-acao" : "bg-linha"}`} />
              <span className={`hidden items-center gap-1 text-xs font-medium sm:flex ${corTexto}`}>
                {feito && <Check className="h-3 w-3" aria-hidden="true" />}
                {p.rotulo}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="mt-2 text-xs text-suave sm:hidden">
        Passo {indiceAtual + 1} de {PASSOS_VISIVEIS.length} · {PASSOS_VISIVEIS[indiceAtual]?.rotulo}
      </p>
    </nav>
  );
}
