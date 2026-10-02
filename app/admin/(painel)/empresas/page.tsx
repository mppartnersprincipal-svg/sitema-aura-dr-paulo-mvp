"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { TituloPagina } from "@/components/admin/titulo-pagina";
import { EmpresaAvatar } from "@/components/empresa-avatar";
import { estaEncerrada, formatData } from "@/lib/format";
import { useAura } from "@/lib/store";

export default function EmpresasPage() {
  const estado = useAura();
  const [busca, setBusca] = useState("");
  if (!estado) return null;

  const termo = busca.trim().toLowerCase();
  const empresas = estado.empresas.filter(
    (e) => !termo || `${e.nome} ${e.nome_fantasia} ${e.cnpj}`.toLowerCase().includes(termo),
  );

  return (
    <>
      <TituloPagina
        titulo="Empresas clientes"
        descricao={`${estado.empresas.filter((e) => e.ativa).length} com canal ativo`}
        acoes={
          <Link href="/admin/empresas/nova" className="btn btn-primario btn-sm">
            <Plus className="h-4 w-4" aria-hidden="true" /> Nova empresa
          </Link>
        }
      />

      <div className="relative mb-5 max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-suave" aria-hidden="true" />
        <input
          className="campo py-2.5 pl-10 text-sm"
          placeholder="Buscar por nome ou CNPJ"
          aria-label="Buscar empresa"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <ul className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {empresas.map((e) => {
          const denuncias = estado.denuncias.filter((d) => d.empresa_id === e.id);
          const abertas = denuncias.filter((d) => !estaEncerrada(d)).length;
          const selo = e.ativa ? "bg-acao-claro text-acao-escuro" : "bg-papel-escuro text-suave";
          return (
            <li key={e.id}>
              <Link href={`/admin/empresas/${e.id}`} className="cartao flex h-full flex-col p-5 transition-colors hover:border-tinta/30">
                <div className="flex items-start gap-4">
                  <EmpresaAvatar empresa={e} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-tinta">{e.nome_fantasia}</p>
                    <p className="truncate text-sm text-suave">{e.nome}</p>
                    <p className="mt-1 font-mono text-xs text-suave">{e.cnpj}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${selo}`}>{e.ativa ? "Ativa" : "Inativa"}</span>
                </div>
                <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-linha pt-4 text-center">
                  <div>
                    <dt className="text-xs text-suave">Denúncias</dt>
                    <dd className="font-serif text-xl text-tinta">{denuncias.length}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-suave">Em apuração</dt>
                    <dd className="font-serif text-xl text-tinta">{abertas}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-suave">Cliente desde</dt>
                    <dd className="pt-1 text-sm font-medium text-tinta">{formatData(e.data_contratacao)}</dd>
                  </div>
                </dl>
              </Link>
            </li>
          );
        })}
      </ul>
      {empresas.length === 0 && <p className="cartao px-6 py-12 text-center text-suave">Nenhuma empresa encontrada.</p>}
    </>
  );
}
