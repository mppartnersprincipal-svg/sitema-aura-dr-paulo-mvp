"use client";

import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { EmpresaAvatar } from "@/components/empresa-avatar";
import { formatData, TIPO_LABEL } from "@/lib/format";
import type { Empresa } from "@/lib/types";
import type { Rascunho } from "./tipos";

type Props = {
  rascunho: Rascunho;
  empresa?: Empresa;
  onEnviar: () => Promise<string | null>;
};

// Simula o Cloudflare Turnstile (invisível) que entra na versão de produção.
const ATRASO_VERIFICACAO_MS = 1200;

function Linha({ rotulo, valor }: { rotulo: string; valor?: string }) {
  if (!valor) return null;
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr]">
      <dt className="text-sm text-suave">{rotulo}</dt>
      <dd className="text-sm font-medium text-tinta">{valor}</dd>
    </div>
  );
}

export function PassoConfirmar({ rascunho, empresa, onEnviar }: Props) {
  const [verificado, setVerificado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setVerificado(true), ATRASO_VERIFICACAO_MS);
    return () => clearTimeout(t);
  }, []);

  async function handleEnviar() {
    setEnviando(true);
    setErro("");
    const problema = await onEnviar();
    if (problema) {
      setErro(problema);
      setEnviando(false);
    }
  }

  const quando = rascunho.data_ocorrencia_aprox
    ? formatData(`${rascunho.data_ocorrencia_aprox}T12:00:00`)
    : undefined;

  return (
    <section aria-labelledby="titulo-confirmar">
      <h1 id="titulo-confirmar" className="titulo text-3xl">
        Confira e envie
      </h1>
      <p className="mt-2 text-lg text-suave">Depois de enviada, a denúncia não pode ser alterada.</p>

      <div className="cartao mt-6 p-5 sm:p-6">
        {empresa && (
          <div className="flex items-center gap-3 border-b border-linha pb-4">
            <EmpresaAvatar empresa={empresa} tamanho="sm" />
            <span className="font-semibold text-tinta">{empresa.nome_fantasia}</span>
          </div>
        )}
        <dl className="divide-y divide-linha">
          <Linha rotulo="Assunto" valor={rascunho.tipo && TIPO_LABEL[rascunho.tipo]} />
          <Linha rotulo="Quem fez" valor={rascunho.denunciado_nome} />
          <Linha rotulo="Cargo" valor={rascunho.denunciado_cargo} />
          <Linha rotulo="Onde" valor={rascunho.local_ocorrencia} />
          <Linha rotulo="Quando" valor={quando} />
          <Linha rotulo="Provas" valor={rascunho.anexos.length ? `${rascunho.anexos.length} arquivo(s)` : "Nenhuma"} />
        </dl>
        <div className="mt-2 rounded-xl bg-papel p-4">
          <p className="text-xs font-semibold tracking-[0.1em] text-suave uppercase">Relato</p>
          <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-texto">{rascunho.relato}</p>
        </div>
      </div>

      <div
        className="mt-6 flex items-center gap-3 rounded-xl border border-linha bg-white px-4 py-3 text-sm"
        role="status"
        aria-live="polite"
      >
        {verificado ? (
          <ShieldCheck className="h-5 w-5 text-acao" aria-hidden="true" />
        ) : (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-linha border-t-acao" aria-hidden="true" />
        )}
        <span className={verificado ? "text-acao" : "text-suave"}>
          {verificado ? "Verificação de segurança concluída" : "Verificando que você não é um robô…"}
        </span>
      </div>

      {erro && (
        <p role="alert" className="mt-4 text-sm font-medium text-perigo">
          {erro}
        </p>
      )}

      <button
        type="button"
        className="btn btn-acao mt-6 w-full py-4 text-lg"
        disabled={!verificado || enviando}
        onClick={handleEnviar}
      >
        {enviando ? "Enviando com segurança…" : "Enviar denúncia"}
      </button>
    </section>
  );
}
