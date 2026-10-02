"use client";

import { Marca } from "@/components/marca";
import { estaEncerrada, formatData, formatDataExtenso, STATUS_LABEL, TIPO_LABEL } from "@/lib/format";
import { useAura } from "@/lib/store";
import { BarraImpressao, Folha, NaoEncontrado } from "./folha";
import { DocumentoProcedimento } from "./procedimento";

/** Todos os procedimentos encerrados de uma empresa, prontos para entregar em caso de requisição judicial. */
export function PaginaDossie({ id }: { id: string }) {
  const estado = useAura();
  if (!estado) return null;
  const empresa = estado.empresas.find((e) => e.id === id);
  if (!empresa) return <NaoEncontrado texto="Empresa não encontrada." />;
  const encerradas = estado.denuncias
    .filter((d) => d.empresa_id === id && estaEncerrada(d))
    .sort((a, b) => a.created_at.localeCompare(b.created_at));

  return (
    <>
      <BarraImpressao titulo={`Procedimentos · ${empresa.nome_fantasia} (${encerradas.length})`} />
      <Folha>
        <Marca />
        <p className="mt-16 text-[11px] font-semibold tracking-[0.2em] text-ouro uppercase">Dossiê de procedimentos</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-tinta">{empresa.nome}</h1>
        <p className="mt-1 text-suave">
          CNPJ {empresa.cnpj} · gerado em {formatDataExtenso(new Date().toISOString())}
        </p>
        <h2 className="mt-12 border-b border-tinta/20 pb-1.5 font-serif text-base font-semibold text-tinta">Índice</h2>
        {encerradas.length === 0 ? (
          <p className="mt-3 text-suave">Nenhum procedimento encerrado para esta empresa.</p>
        ) : (
          <table className="mt-3 w-full text-left">
            <thead className="text-[11px] tracking-wide text-suave uppercase">
              <tr>
                <th className="py-1 font-semibold">Protocolo</th>
                <th className="py-1 font-semibold">Tipo</th>
                <th className="py-1 font-semibold">Recebida</th>
                <th className="py-1 font-semibold">Resultado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-linha">
              {encerradas.map((d) => (
                <tr key={d.id}>
                  <td className="py-1.5 font-mono">{d.protocolo}</td>
                  <td className="py-1.5">{TIPO_LABEL[d.tipo]}</td>
                  <td className="py-1.5">{formatData(d.created_at)}</td>
                  <td className="py-1.5">{STATUS_LABEL[d.status_conclusao]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Folha>
      {encerradas.map((d) => (
        <DocumentoProcedimento key={d.id} denuncia={d} empresa={empresa} quebra />
      ))}
    </>
  );
}
