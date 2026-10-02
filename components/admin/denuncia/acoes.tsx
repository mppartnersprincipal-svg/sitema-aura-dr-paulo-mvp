"use client";

import { useState } from "react";
import { CalendarPlus, ChevronRight, Gavel } from "lucide-react";
import { avancarEtapa, concluirDenuncia, prorrogarPrazo } from "@/lib/actions";
import { ALERTA_PRAZO_DIAS, PRORROGACAO_DIAS } from "@/lib/config";
import { diasRestantes, ETAPA_LABEL, formatData, proximaEtapa, STATUS_LABEL } from "@/lib/format";
import type { Denuncia, StatusConclusao } from "@/lib/types";

const MIN_PARECER = 30;
const STATUS_FINAIS: StatusConclusao[] = ["procedente", "parcialmente_procedente", "improcedente", "arquivada_insuficiencia"];

function corDias(dias: number): string {
  if (dias < 0) return "text-perigo";
  if (dias <= ALERTA_PRAZO_DIAS) return "text-alerta";
  return "text-acao";
}

export function CartaoPrazo({ denuncia }: { denuncia: Denuncia }) {
  const dias = diasRestantes(denuncia);
  const resumo = dias >= 0 ? `${dias} dia(s) restantes` : `Vencido há ${Math.abs(dias)} dia(s)`;

  function handleProrrogar() {
    if (window.confirm(`Prorrogar o prazo de apuração por mais ${PRORROGACAO_DIAS} dias? O denunciante verá esta alteração.`)) {
      prorrogarPrazo(denuncia.id);
    }
  }

  return (
    <section className="cartao p-5">
      <h2 className="font-semibold text-tinta">Prazo de apuração</h2>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between">
          <dt className="text-suave">Prazo inicial (30 dias)</dt>
          <dd className={denuncia.prazo_prorrogado ? "text-suave line-through" : "font-medium text-tinta"}>
            {formatData(denuncia.prazo_inicial)}
          </dd>
        </div>
        {denuncia.prazo_prorrogado && (
          <div className="flex justify-between">
            <dt className="text-suave">Prorrogado (+{PRORROGACAO_DIAS})</dt>
            <dd className="font-medium text-tinta">{formatData(denuncia.prazo_prorrogado)}</dd>
          </div>
        )}
      </dl>
      <p className={`mt-3 text-sm font-semibold ${corDias(dias)}`}>{resumo}</p>
      {!denuncia.prazo_prorrogado && (
        <button type="button" className="btn btn-secundario btn-sm mt-4 w-full" onClick={handleProrrogar}>
          <CalendarPlus className="h-4 w-4" aria-hidden="true" />
          Prorrogar prazo +{PRORROGACAO_DIAS} dias
        </button>
      )}
    </section>
  );
}

export function AvancarEtapa({ denuncia }: { denuncia: Denuncia }) {
  const [publica, setPublica] = useState("");
  const [interna, setInterna] = useState("");
  const proxima = proximaEtapa(denuncia.etapa_atual);
  if (!proxima) return null;
  const destino = proxima;

  function handleAvancar() {
    avancarEtapa(denuncia.id, destino, publica, interna);
  }

  return (
    <section className="cartao p-5">
      <h2 className="font-semibold text-tinta">Próxima etapa</h2>
      <p className="mt-1 text-sm text-suave">
        {ETAPA_LABEL[denuncia.etapa_atual]} → <strong className="text-tinta">{ETAPA_LABEL[destino]}</strong>
      </p>
      <label htmlFor="obs-publica" className="rotulo mt-4 text-xs">
        Observação para o denunciante <span className="font-normal text-suave">(opcional)</span>
      </label>
      <textarea id="obs-publica" rows={2} className="campo text-sm" value={publica} onChange={(e) => setPublica(e.target.value)} />
      <label htmlFor="obs-interna" className="rotulo mt-3 text-xs">
        Observação interna <span className="font-normal text-suave">(opcional)</span>
      </label>
      <textarea id="obs-interna" rows={2} className="campo text-sm" value={interna} onChange={(e) => setInterna(e.target.value)} />
      <button type="button" className="btn btn-primario btn-sm mt-4 w-full" onClick={handleAvancar}>
        Avançar para {ETAPA_LABEL[destino]}
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </section>
  );
}

export function ConcluirProcedimento({ denuncia }: { denuncia: Denuncia }) {
  const [aberto, setAberto] = useState(false);
  const [status, setStatus] = useState<StatusConclusao>("procedente");
  const [parecer, setParecer] = useState("");
  const faltam = Math.max(0, MIN_PARECER - parecer.trim().length);

  function handleConcluir() {
    if (window.confirm("Concluir o procedimento? Esta ação encerra a apuração e gera o documento final.")) {
      concluirDenuncia(denuncia.id, status, parecer);
    }
  }

  if (!aberto) {
    return (
      <button type="button" className="btn btn-acao w-full" onClick={() => setAberto(true)}>
        <Gavel className="h-4.5 w-4.5" aria-hidden="true" />
        Concluir procedimento
      </button>
    );
  }

  return (
    <section className="cartao border-acao/40 p-5">
      <h2 className="flex items-center gap-2 font-semibold text-tinta">
        <Gavel className="h-4.5 w-4.5 text-acao" aria-hidden="true" />
        Concluir procedimento
      </h2>
      <label htmlFor="status" className="rotulo mt-4 text-xs">
        Resultado
      </label>
      <select id="status" className="campo text-sm" value={status} onChange={(e) => setStatus(e.target.value as StatusConclusao)}>
        {STATUS_FINAIS.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABEL[s]}
          </option>
        ))}
      </select>
      <label htmlFor="parecer" className="rotulo mt-3 text-xs">
        Parecer final
      </label>
      <textarea
        id="parecer"
        rows={7}
        className="campo text-sm leading-relaxed"
        placeholder="Fundamentação, provas consideradas e recomendações à empresa."
        value={parecer}
        onChange={(e) => setParecer(e.target.value)}
      />
      {faltam > 0 && <p className="mt-1 text-xs text-suave">Mínimo de {MIN_PARECER} caracteres ({faltam} restantes).</p>}
      <div className="mt-4 flex gap-2">
        <button type="button" className="btn btn-fantasma btn-sm flex-1" onClick={() => setAberto(false)}>
          Cancelar
        </button>
        <button type="button" className="btn btn-acao btn-sm flex-1" disabled={faltam > 0} onClick={handleConcluir}>
          Concluir e gerar PDF
        </button>
      </div>
    </section>
  );
}
