"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { EtapaBadge, PrazoBadge } from "@/components/badges";
import { formatData, TIPO_LABEL } from "@/lib/format";
import type { Denuncia, Empresa } from "@/lib/types";

type Props = {
  denuncias: Denuncia[];
  empresas: Empresa[];
  ocultarEmpresa?: boolean;
};

const TH = "px-5 py-3 font-semibold";
const TD = "px-5 py-3.5";

export function TabelaDenuncias({ denuncias, empresas, ocultarEmpresa = false }: Props) {
  const router = useRouter();
  const nomeEmpresa = (id: string) => empresas.find((e) => e.id === id)?.nome_fantasia ?? "—";

  if (denuncias.length === 0) {
    return <p className="cartao px-6 py-12 text-center text-suave">Nenhuma denúncia encontrada.</p>;
  }

  return (
    <div className="cartao overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-linha bg-papel/60 text-xs tracking-[0.08em] text-suave uppercase">
          <tr>
            <th scope="col" className={TH}>Protocolo</th>
            {!ocultarEmpresa && <th scope="col" className={TH}>Empresa</th>}
            <th scope="col" className={TH}>Tipo</th>
            <th scope="col" className={TH}>Etapa</th>
            <th scope="col" className={TH}>Prazo</th>
            <th scope="col" className={TH}>Recebida</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-linha">
          {denuncias.map((d) => (
            <tr
              key={d.id}
              onClick={() => router.push(`/admin/denuncias/${d.id}`)}
              className="cursor-pointer transition-colors hover:bg-tinta-100/40"
            >
              <td className={TD}>
                <Link href={`/admin/denuncias/${d.id}`} className="font-mono font-semibold whitespace-nowrap text-tinta" onClick={(e) => e.stopPropagation()}>
                  {d.protocolo}
                </Link>
              </td>
              {!ocultarEmpresa && <td className={`${TD} text-texto`}>{nomeEmpresa(d.empresa_id)}</td>}
              <td className={`${TD} text-texto`}>{TIPO_LABEL[d.tipo]}</td>
              <td className={TD}>
                <EtapaBadge etapa={d.etapa_atual} />
              </td>
              <td className={TD}>
                <PrazoBadge denuncia={d} />
              </td>
              <td className={`${TD} text-suave`}>{formatData(d.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
