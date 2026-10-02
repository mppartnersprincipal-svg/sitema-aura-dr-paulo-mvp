"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { TabelaDenuncias } from "@/components/admin/tabela-denuncias";
import { TituloPagina } from "@/components/admin/titulo-pagina";
import { ETAPA_LABEL, situacaoPrazo, TIPO_LABEL, type SituacaoPrazo } from "@/lib/format";
import { useAura } from "@/lib/store";
import type { Denuncia, Etapa, TipoDenuncia } from "@/lib/types";

type FiltroPrazo = "todas" | "abertas" | SituacaoPrazo;

const PRAZO_OPCOES: { valor: FiltroPrazo; rotulo: string }[] = [
  { valor: "todas", rotulo: "Todos os prazos" },
  { valor: "abertas", rotulo: "Em apuração" },
  { valor: "ok", rotulo: "No prazo" },
  { valor: "atencao", rotulo: "Vencendo (≤ 7 dias)" },
  { valor: "vencido", rotulo: "Vencidas" },
  { valor: "encerrado", rotulo: "Encerradas" },
];

interface Filtros {
  busca: string;
  empresa: string;
  tipo: "" | TipoDenuncia;
  etapa: "" | Etapa;
  prazo: FiltroPrazo;
}

const FILTROS_INICIAIS: Filtros = { busca: "", empresa: "", tipo: "", etapa: "", prazo: "todas" };
const SELECT = "campo py-2.5 text-sm";

function passaPrazo(d: Denuncia, prazo: FiltroPrazo): boolean {
  if (prazo === "todas") return true;
  const s = situacaoPrazo(d);
  return prazo === "abertas" ? s !== "encerrado" : s === prazo;
}

function aplicar(denuncias: Denuncia[], f: Filtros): Denuncia[] {
  const termo = f.busca.trim().toUpperCase();
  return denuncias
    .filter((d) => !termo || d.protocolo.includes(termo))
    .filter((d) => !f.empresa || d.empresa_id === f.empresa)
    .filter((d) => !f.tipo || d.tipo === f.tipo)
    .filter((d) => !f.etapa || d.etapa_atual === f.etapa)
    .filter((d) => passaPrazo(d, f.prazo))
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export default function DenunciasPage() {
  const estado = useAura();
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_INICIAIS);
  if (!estado) return null;

  const lista = aplicar(estado.denuncias, filtros);
  const alterar = (patch: Partial<Filtros>) => setFiltros((f) => ({ ...f, ...patch }));

  return (
    <>
      <TituloPagina titulo="Denúncias" descricao={`${lista.length} de ${estado.denuncias.length} registro(s)`} />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <div className="relative sm:col-span-2 xl:col-span-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-suave" aria-hidden="true" />
          <input
            className={`${SELECT} pl-10`}
            placeholder="Buscar protocolo"
            aria-label="Buscar por protocolo"
            value={filtros.busca}
            onChange={(e) => alterar({ busca: e.target.value })}
          />
        </div>
        <select className={SELECT} aria-label="Empresa" value={filtros.empresa} onChange={(e) => alterar({ empresa: e.target.value })}>
          <option value="">Todas as empresas</option>
          {estado.empresas.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nome_fantasia}
            </option>
          ))}
        </select>
        <select
          className={SELECT}
          aria-label="Tipo"
          value={filtros.tipo}
          onChange={(e) => alterar({ tipo: e.target.value as Filtros["tipo"] })}
        >
          <option value="">Todos os tipos</option>
          {Object.entries(TIPO_LABEL).map(([valor, rotulo]) => (
            <option key={valor} value={valor}>
              {rotulo}
            </option>
          ))}
        </select>
        <select
          className={SELECT}
          aria-label="Etapa"
          value={filtros.etapa}
          onChange={(e) => alterar({ etapa: e.target.value as Filtros["etapa"] })}
        >
          <option value="">Todas as etapas</option>
          {Object.entries(ETAPA_LABEL).map(([valor, rotulo]) => (
            <option key={valor} value={valor}>
              {rotulo}
            </option>
          ))}
        </select>
        <select
          className={SELECT}
          aria-label="Prazo"
          value={filtros.prazo}
          onChange={(e) => alterar({ prazo: e.target.value as FiltroPrazo })}
        >
          {PRAZO_OPCOES.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.rotulo}
            </option>
          ))}
        </select>
      </div>

      <TabelaDenuncias denuncias={lista} empresas={estado.empresas} />
    </>
  );
}
