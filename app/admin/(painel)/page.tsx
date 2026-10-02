"use client";

import Link from "next/link";
import { AlarmClock, ArrowRight, Building2, FolderOpen, Inbox, MessageCircle, type LucideIcon } from "lucide-react";
import { PrazoBadge } from "@/components/badges";
import { TabelaDenuncias } from "@/components/admin/tabela-denuncias";
import { CANAL } from "@/lib/config";
import { diasRestantes, estaEncerrada, formatDataExtenso, formatDataHora, situacaoPrazo, TIPO_LABEL } from "@/lib/format";
import { useAura } from "@/lib/store";
import type { TipoDenuncia } from "@/lib/types";

const RECENTES = 10;
const ALERTAS_VISIVEIS = 4;

function saudacao(): string {
  const hora = new Date().getHours();
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

type IndicadorProps = { rotulo: string; valor: number; icone: LucideIcon; alerta?: boolean; detalhe?: string };

function Indicador({ rotulo, valor, icone: Icone, alerta = false, detalhe }: IndicadorProps) {
  const cor = alerta && valor > 0 ? "border-alerta/40 bg-alerta-claro" : "border-linha bg-white";
  return (
    <div className={`rounded-2xl border p-5 ${cor}`}>
      <div className="flex items-center justify-between text-suave">
        <span className="text-sm font-medium">{rotulo}</span>
        <Icone className="h-4.5 w-4.5" aria-hidden="true" />
      </div>
      <p className="mt-3 font-serif text-4xl text-tinta tabular-nums">{valor}</p>
      {detalhe && <p className="mt-1 text-xs text-suave">{detalhe}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const estado = useAura();
  if (!estado) return null;
  const { denuncias, empresas, notificacoes } = estado;
  const nomeEmpresa = (id: string) => empresas.find((e) => e.id === id)?.nome_fantasia;

  const abertas = denuncias.filter((d) => !estaEncerrada(d));
  const urgentes = abertas
    .filter((d) => ["atencao", "vencido"].includes(situacaoPrazo(d)))
    .sort((a, b) => diasRestantes(a) - diasRestantes(b));
  const vencidas = urgentes.filter((d) => situacaoPrazo(d) === "vencido").length;
  const recentes = [...denuncias].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, RECENTES);

  const porTipo = (Object.keys(TIPO_LABEL) as TipoDenuncia[])
    .map((tipo) => ({ tipo, total: denuncias.filter((d) => d.tipo === tipo).length }))
    .sort((a, b) => b.total - a.total);
  const maiorTipo = Math.max(1, ...porTipo.map((t) => t.total));

  return (
    <>
      <div className="mb-8">
        <p className="text-sm text-suave">{formatDataExtenso(new Date().toISOString())}</p>
        <h1 className="titulo mt-1 text-3xl">{saudacao()}, Dr. Paulo.</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Indicador rotulo="Denúncias recebidas" valor={denuncias.length} icone={Inbox} />
        <Indicador rotulo="Em apuração" valor={abertas.length} icone={FolderOpen} />
        <Indicador
          rotulo="Prazos críticos"
          valor={urgentes.length}
          icone={AlarmClock}
          alerta
          detalhe={vencidas ? `${vencidas} vencida(s)` : "vencem em até 7 dias"}
        />
        <Indicador rotulo="Empresas ativas" valor={empresas.filter((e) => e.ativa).length} icone={Building2} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-[1.3fr_1fr_1fr]">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-tinta">Exigem atenção</h2>
          {urgentes.length === 0 ? (
            <p className="cartao px-6 py-8 text-center text-sm text-suave">Nenhum prazo crítico. Tudo em dia.</p>
          ) : (
            <ul className="cartao divide-y divide-linha">
              {urgentes.map((d) => (
                <li key={d.id}>
                  <Link href={`/admin/denuncias/${d.id}`} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-tinta-100/40">
                    <div>
                      <p className="font-mono text-sm font-semibold text-tinta">{d.protocolo}</p>
                      <p className="text-sm text-suave">
                        {TIPO_LABEL[d.tipo]} · {nomeEmpresa(d.empresa_id)}
                      </p>
                    </div>
                    <PrazoBadge denuncia={d} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="cartao p-5">
          <h2 className="text-lg font-semibold text-tinta">Denúncias por tipo</h2>
          <ul className="mt-4 space-y-3">
            {porTipo.map(({ tipo, total }) => (
              <li key={tipo}>
                <div className="flex justify-between text-sm">
                  <span className="text-texto">{TIPO_LABEL[tipo]}</span>
                  <span className="font-semibold text-tinta tabular-nums">{total}</span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-papel-escuro">
                  <div className="h-2 rounded-full bg-tinta-700" style={{ width: `${(total / maiorTipo) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="self-start overflow-hidden rounded-2xl border border-linha bg-[#ece5dd]">
          <div className="flex items-center gap-3 bg-[#1f6e4a] px-5 py-3 text-white">
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold">Alertas no WhatsApp</p>
              <p className="text-xs text-white/70">{CANAL.whatsappAdmin}</p>
            </div>
          </div>
          <ul className="space-y-2 p-4">
            {notificacoes.slice(0, ALERTAS_VISIVEIS).map((n) => (
              <li key={n.id} className="ml-auto max-w-[90%] rounded-xl rounded-tr-sm bg-[#dcf8c6] px-3 py-2 text-sm text-texto shadow-sm">
                <p>🔔 {n.conteudo}</p>
                <p className="mt-1 text-right text-[10px] text-suave">{formatDataHora(n.created_at)}</p>
              </li>
            ))}
            {notificacoes.length === 0 && <li className="text-center text-sm text-suave">Nenhum alerta ainda.</li>}
          </ul>
        </section>
      </div>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-tinta">Recebidas recentemente</h2>
          <Link href="/admin/denuncias" className="flex items-center gap-1 text-sm font-semibold text-tinta">
            Ver todas <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <TabelaDenuncias denuncias={recentes} empresas={empresas} />
      </section>
    </>
  );
}
