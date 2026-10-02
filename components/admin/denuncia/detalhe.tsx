"use client";

import Link from "next/link";
import { ArrowLeft, FileDown, Scale } from "lucide-react";
import { EtapaBadge, PrazoBadge, StatusBadge } from "@/components/badges";
import { EmpresaAvatar } from "@/components/empresa-avatar";
import { estaEncerrada, formatData, formatDataHora, TIPO_LABEL } from "@/lib/format";
import { useAura } from "@/lib/store";
import { AnexosDenuncia } from "./anexos";
import { AnotacoesInternas } from "./anotacoes";
import { AvancarEtapa, CartaoPrazo, ConcluirProcedimento } from "./acoes";
import { HistoricoAdmin } from "./historico";

function Dado({ rotulo, valor }: { rotulo: string; valor?: string }) {
  return (
    <div>
      <dt className="text-xs text-suave">{rotulo}</dt>
      <dd className={`text-sm ${valor ? "font-medium text-tinta" : "text-suave/70"}`}>{valor || "Não informado"}</dd>
    </div>
  );
}

function NaoEncontrada() {
  return (
    <div className="py-20 text-center">
      <p className="text-suave">Denúncia não encontrada.</p>
      <Link href="/admin/denuncias" className="btn btn-secundario mt-4">
        Voltar para a lista
      </Link>
    </div>
  );
}

export function DenunciaDetalhe({ id }: { id: string }) {
  const estado = useAura();
  if (!estado) return null;
  const denuncia = estado.denuncias.find((d) => d.id === id);
  if (!denuncia) return <NaoEncontrada />;

  const empresa = estado.empresas.find((e) => e.id === denuncia.empresa_id);
  const encerrada = estaEncerrada(denuncia);
  const dataOcorrencia = denuncia.data_ocorrencia_aprox
    ? formatData(`${denuncia.data_ocorrencia_aprox}T12:00:00`)
    : undefined;

  return (
    <>
      <Link href="/admin/denuncias" className="mb-5 inline-flex items-center gap-1.5 text-sm text-suave hover:text-tinta">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Denúncias
      </Link>

      <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-suave uppercase">{TIPO_LABEL[denuncia.tipo]}</p>
          <h1 className="mt-1 font-mono text-3xl font-bold tracking-wider text-tinta">{denuncia.protocolo}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <EtapaBadge etapa={denuncia.etapa_atual} />
            <PrazoBadge denuncia={denuncia} />
            {encerrada && <StatusBadge status={denuncia.status_conclusao} />}
          </div>
        </div>
        {empresa && (
          <Link href={`/admin/empresas/${empresa.id}`} className="cartao flex items-center gap-3 px-4 py-3 hover:border-tinta/30">
            <EmpresaAvatar empresa={empresa} tamanho="sm" />
            <div>
              <p className="text-sm font-semibold text-tinta">{empresa.nome_fantasia}</p>
              <p className="text-xs text-suave">Recebida em {formatDataHora(denuncia.created_at)}</p>
            </div>
          </Link>
        )}
      </header>

      <div className="grid items-start gap-6 xl:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <section className="cartao p-6">
            <h2 className="text-lg font-semibold text-tinta">Relato do denunciante</h2>
            <p className="mt-4 text-[15px] leading-relaxed whitespace-pre-line text-texto">{denuncia.relato}</p>
            <dl className="mt-6 grid gap-4 border-t border-linha pt-5 sm:grid-cols-2 lg:grid-cols-4">
              <Dado rotulo="Pessoa denunciada" valor={denuncia.denunciado_nome} />
              <Dado rotulo="Cargo" valor={denuncia.denunciado_cargo} />
              <Dado rotulo="Local" valor={denuncia.local_ocorrencia} />
              <Dado rotulo="Data aproximada" valor={dataOcorrencia} />
            </dl>
          </section>

          {encerrada && denuncia.parecer_final && (
            <section className="cartao border-acao/30 p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-tinta">
                <Scale className="h-5 w-5 text-acao" aria-hidden="true" /> Parecer final
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed whitespace-pre-line text-texto">{denuncia.parecer_final}</p>
              <p className="mt-3 text-xs text-suave">Emitido em {formatDataHora(denuncia.data_conclusao)}</p>
            </section>
          )}

          <AnexosDenuncia denunciaId={denuncia.id} anexos={denuncia.anexos} />
          <HistoricoAdmin historico={denuncia.historico} />
        </div>

        <aside className="space-y-4 xl:sticky xl:top-20">
          {encerrada ? (
            <section className="cartao p-5">
              <h2 className="font-semibold text-tinta">Procedimento encerrado</h2>
              <p className="mt-1 text-sm text-suave">Documento arquivado por 5 anos no cadastro da empresa.</p>
              <Link href={`/admin/imprimir/procedimento/${denuncia.id}`} target="_blank" className="btn btn-primario mt-4 w-full">
                <FileDown className="h-4.5 w-4.5" aria-hidden="true" />
                Baixar PDF do procedimento
              </Link>
            </section>
          ) : (
            <>
              <CartaoPrazo denuncia={denuncia} />
              <AvancarEtapa key={denuncia.etapa_atual} denuncia={denuncia} />
              <ConcluirProcedimento denuncia={denuncia} />
            </>
          )}
          <AnotacoesInternas key={denuncia.id} denunciaId={denuncia.id} texto={denuncia.anotacoes_internas} />
        </aside>
      </div>
    </>
  );
}
