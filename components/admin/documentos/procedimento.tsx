"use client";

import { useEffect, useState } from "react";
import { Marca } from "@/components/marca";
import { CANAL } from "@/lib/config";
import {
  addDias,
  ANEXO_LABEL,
  ETAPA_LABEL,
  formatBytes,
  formatData,
  formatDataExtenso,
  formatDataHora,
  prazoFinal,
  STATUS_LABEL,
  TIPO_LABEL,
} from "@/lib/format";
import { useAura } from "@/lib/store";
import type { Denuncia, Empresa } from "@/lib/types";
import { BarraImpressao, Folha, NaoEncontrado } from "./folha";

// 5 anos (prazo prescricional trabalhista), contando os anos bissextos.
const DIAS_RETENCAO = 5 * 365 + 1;

function useCodigoVerificacao(denuncia: Denuncia): string {
  const [codigo, setCodigo] = useState("");
  useEffect(() => {
    const dados = new TextEncoder().encode(JSON.stringify(denuncia));
    void crypto.subtle.digest("SHA-256", dados).then((buf) => {
      const hex = Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
      setCodigo(hex.slice(0, 24).toUpperCase().replace(/(.{4})(?!$)/g, "$1-"));
    });
  }, [denuncia]);
  return codigo;
}

function Secao({ numero, titulo, children }: { numero: number; titulo: string; children: React.ReactNode }) {
  return (
    <section className="mt-7 break-inside-avoid-page">
      <h2 className="border-b border-tinta/20 pb-1.5 font-serif text-base font-semibold text-tinta">
        {numero}. {titulo}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Campo({ rotulo, valor }: { rotulo: string; valor?: string }) {
  return (
    <div>
      <dt className="text-[11px] tracking-wide text-suave uppercase">{rotulo}</dt>
      <dd className="font-medium text-tinta">{valor || "Não informado"}</dd>
    </div>
  );
}

type Props = { denuncia: Denuncia; empresa: Empresa; quebra?: boolean };

export function DocumentoProcedimento({ denuncia, empresa, quebra }: Props) {
  const codigo = useCodigoVerificacao(denuncia);
  const conclusao = denuncia.data_conclusao ?? new Date().toISOString();
  const retencao = addDias(conclusao, DIAS_RETENCAO);
  const dataOcorrencia = denuncia.data_ocorrencia_aprox ? formatData(`${denuncia.data_ocorrencia_aprox}T12:00:00`) : undefined;
  const historico = [...denuncia.historico].sort((a, b) => a.created_at.localeCompare(b.created_at));
  const prazo = `${formatData(prazoFinal(denuncia))}${denuncia.prazo_prorrogado ? " (prorrogado)" : ""}`;

  return (
    <Folha quebra={quebra}>
      <header className="flex items-start justify-between border-b-2 border-tinta pb-5">
        <Marca />
        <div className="text-right text-[11px] text-suave">
          <p>{CANAL.razaoSocial}</p>
          <p>CNPJ {CANAL.cnpj}</p>
          <p>{CANAL.cidade}</p>
        </div>
      </header>

      <div className="mt-8 text-center">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-ouro uppercase">Procedimento de apuração</p>
        <h1 className="mt-2 font-serif text-2xl font-semibold text-tinta">Protocolo {denuncia.protocolo}</h1>
        <p className="mt-1 text-suave">
          {TIPO_LABEL[denuncia.tipo]} · {STATUS_LABEL[denuncia.status_conclusao]}
        </p>
      </div>

      <Secao numero={1} titulo="Identificação">
        <dl className="grid grid-cols-2 gap-x-8 gap-y-3">
          <Campo rotulo="Empresa" valor={`${empresa.nome} (${empresa.nome_fantasia})`} />
          <Campo rotulo="CNPJ da empresa" valor={empresa.cnpj} />
          <Campo rotulo="Recebida em" valor={formatDataHora(denuncia.created_at)} />
          <Campo rotulo="Encerrada em" valor={denuncia.data_conclusao && formatDataHora(denuncia.data_conclusao)} />
          <Campo rotulo="Prazo legal" valor={prazo} />
          <Campo rotulo="Denunciante" valor="Anônimo — identidade não coletada" />
        </dl>
      </Secao>

      <Secao numero={2} titulo="Relato">
        <p className="whitespace-pre-line">{denuncia.relato}</p>
        <dl className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3">
          <Campo rotulo="Pessoa denunciada" valor={denuncia.denunciado_nome} />
          <Campo rotulo="Cargo" valor={denuncia.denunciado_cargo} />
          <Campo rotulo="Local" valor={denuncia.local_ocorrencia} />
          <Campo rotulo="Data aproximada" valor={dataOcorrencia} />
        </dl>
      </Secao>

      <Secao numero={3} titulo="Provas e documentos">
        {denuncia.anexos.length === 0 ? (
          <p className="text-suave">Nenhum arquivo juntado ao procedimento.</p>
        ) : (
          <ol className="list-decimal space-y-1 pl-5">
            {denuncia.anexos.map((a) => (
              <li key={a.id}>
                {a.nome} — {ANEXO_LABEL[a.tipo]}, {formatBytes(a.tamanho)}, juntado pelo{" "}
                {a.enviado_por === "admin" ? "apurador" : "denunciante"}
              </li>
            ))}
          </ol>
        )}
      </Secao>

      <Secao numero={4} titulo="Tramitação">
        <table className="w-full text-left">
          <thead className="text-[11px] tracking-wide text-suave uppercase">
            <tr>
              <th className="w-36 py-1 font-semibold">Data</th>
              <th className="w-32 py-1 font-semibold">Etapa</th>
              <th className="py-1 font-semibold">Registro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-linha">
            {historico.map((h) => (
              <tr key={h.id} className="align-top">
                <td className="py-1.5">{formatDataHora(h.created_at)}</td>
                <td className="py-1.5 font-medium">{ETAPA_LABEL[h.etapa]}</td>
                <td className="py-1.5">
                  {h.observacao_publica}
                  {h.observacao_interna && <span className="block text-suave italic">Nota interna: {h.observacao_interna}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Secao>

      <Secao numero={5} titulo="Parecer final">
        <p className="whitespace-pre-line">{denuncia.parecer_final || "Procedimento ainda não concluído."}</p>
        <p className="mt-3">
          <strong>Resultado:</strong> {STATUS_LABEL[denuncia.status_conclusao]}
        </p>
      </Secao>

      <div className="mt-14 flex items-end justify-between gap-8 break-inside-avoid-page">
        <div className="text-[11px] text-suave">
          <p>Divinópolis/MG, {formatDataExtenso(conclusao)}.</p>
          <p className="mt-2">Arquivar até {formatData(retencao)} (prazo prescricional de 5 anos).</p>
          <p className="mt-1 font-mono">Código de verificação: {codigo || "…"}</p>
        </div>
        <div className="w-64 text-center">
          <p className="font-serif text-xl text-tinta italic">Dr. Paulo</p>
          <div className="mt-1 border-t border-tinta pt-1.5 text-[11px] text-suave">{CANAL.responsavelTitulo}</div>
        </div>
      </div>
    </Folha>
  );
}

export function PaginaProcedimento({ id }: { id: string }) {
  const estado = useAura();
  if (!estado) return null;
  const denuncia = estado.denuncias.find((d) => d.id === id);
  const empresa = estado.empresas.find((e) => e.id === denuncia?.empresa_id);
  if (!denuncia || !empresa) return <NaoEncontrado texto="Procedimento não encontrado." />;
  return (
    <>
      <BarraImpressao titulo={`Procedimento ${denuncia.protocolo}`} />
      <DocumentoProcedimento denuncia={denuncia} empresa={empresa} />
    </>
  );
}
