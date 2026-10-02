"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, MessageCircle } from "lucide-react";
import { marcarNotificacoesLidas } from "@/lib/actions";
import { CANAL } from "@/lib/config";
import { formatDataHora } from "@/lib/format";
import type { Notificacao } from "@/lib/types";

const MAX_LISTA = 8;

export function Notificacoes({ itens }: { itens: Notificacao[] }) {
  const [aberto, setAberto] = useState(false);
  const naoLidas = itens.filter((n) => !n.lida).length;

  function alternar() {
    if (!aberto && naoLidas) marcarNotificacoesLidas();
    setAberto((v) => !v);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={alternar}
        aria-expanded={aberto}
        className="btn btn-fantasma btn-sm relative"
        aria-label={`Notificações${naoLidas ? `, ${naoLidas} novas` : ""}`}
      >
        <Bell className="h-5 w-5" />
        {naoLidas > 0 && (
          <span className="absolute top-0.5 right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-perigo px-1 text-[10px] font-bold text-white">
            {naoLidas}
          </span>
        )}
      </button>
      {aberto && (
        <div className="absolute right-0 z-40 mt-2 w-80 overflow-hidden rounded-2xl border border-linha bg-white shadow-xl shadow-tinta/10">
          <div className="flex items-center gap-2 border-b border-linha bg-[#e9f6ee] px-4 py-3 text-sm">
            <MessageCircle className="h-4 w-4 text-[#1f8f52]" aria-hidden="true" />
            <span className="font-semibold text-tinta">WhatsApp · {CANAL.whatsappAdmin}</span>
          </div>
          <ul className="max-h-96 divide-y divide-linha overflow-y-auto">
            {itens.slice(0, MAX_LISTA).map((n) => (
              <li key={n.id} className="px-4 py-3">
                <Link href={n.link ?? "#"} onClick={() => setAberto(false)} className="block text-sm text-texto hover:text-tinta">
                  {n.conteudo}
                </Link>
                <span className="text-xs text-suave">{formatDataHora(n.created_at)}</span>
              </li>
            ))}
            {itens.length === 0 && <li className="px-4 py-6 text-center text-sm text-suave">Nenhuma notificação.</li>}
          </ul>
          <p className="border-t border-linha bg-papel px-4 py-2 text-[11px] text-suave">
            Simulação: em produção cada aviso chega no WhatsApp do apurador.
          </p>
        </div>
      )}
    </div>
  );
}
