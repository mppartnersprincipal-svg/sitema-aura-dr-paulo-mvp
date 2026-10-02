"use client";

import { Mail, MessageCircle } from "lucide-react";
import { TituloPagina } from "@/components/admin/titulo-pagina";
import { formatDataHora } from "@/lib/format";
import { useAura } from "@/lib/store";

export default function LeadsPage() {
  const estado = useAura();
  if (!estado) return null;
  const { leads } = estado;

  return (
    <>
      <TituloPagina titulo="Leads comerciais" descricao="Empresas que pediram proposta pela página “Para empresas”." />
      {leads.length === 0 ? (
        <p className="cartao px-6 py-12 text-center text-suave">Nenhum lead ainda.</p>
      ) : (
        <ul className="grid gap-4 lg:grid-cols-2">
          {leads.map((l) => {
            const whatsapp = l.telefone.replace(/\D/g, "");
            return (
              <li key={l.id} className="cartao p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-tinta">{l.razao_social || "Empresa não informada"}</p>
                    <p className="text-sm text-suave">
                      {l.responsavel_nome}
                      {l.responsavel_cargo && ` · ${l.responsavel_cargo}`}
                    </p>
                  </div>
                  <span className="text-xs whitespace-nowrap text-suave">{formatDataHora(l.created_at)}</span>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-suave">CNPJ</dt>
                    <dd className="font-mono text-tinta">{l.cnpj || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-suave">Funcionários</dt>
                    <dd className="text-tinta">{l.qtd_funcionarios_faixa || "—"}</dd>
                  </div>
                </dl>
                {l.mensagem && <p className="mt-3 rounded-lg bg-papel px-3 py-2 text-sm text-texto">“{l.mensagem}”</p>}
                <div className="mt-4 flex flex-wrap gap-2">
                  <a href={`mailto:${l.email}`} className="btn btn-secundario btn-sm">
                    <Mail className="h-4 w-4" aria-hidden="true" /> {l.email}
                  </a>
                  {whatsapp && (
                    <a href={`https://wa.me/55${whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn btn-secundario btn-sm">
                      <MessageCircle className="h-4 w-4" aria-hidden="true" /> {l.telefone}
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
