"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, CircleCheckBig, Copy, Download, TriangleAlert } from "lucide-react";
import { Marca } from "@/components/marca";
import { formatDataHora } from "@/lib/format";

type Props = {
  protocolo: string;
  senha: string;
};

type AlvoCopia = "protocolo" | "senha" | "ambos";

async function copiar(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    return false;
  }
}

type CampoProps = { rotulo: string; valor: string; copiado: boolean; onCopiar: () => void };

function CampoSecreto({ rotulo, valor, copiado, onCopiar }: CampoProps) {
  return (
    <div className="rounded-2xl border-2 border-tinta/15 bg-white p-5">
      <p className="text-xs font-semibold tracking-[0.16em] text-suave uppercase">{rotulo}</p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="font-mono text-2xl font-bold tracking-wider break-all text-tinta select-all sm:text-3xl">{valor}</span>
        <button type="button" className="btn btn-secundario btn-sm shrink-0" onClick={onCopiar}>
          {copiado ? <Check className="h-4 w-4 text-acao" /> : <Copy className="h-4 w-4" />}
          {copiado ? "Copiado" : "Copiar"}
        </button>
      </div>
    </div>
  );
}

export function PassoConcluida({ protocolo, senha }: Props) {
  const [copiado, setCopiado] = useState<AlvoCopia | null>(null);
  const [guardou, setGuardou] = useState(false);
  const [emitidoEm] = useState(() => new Date().toISOString());

  async function handleCopiar(alvo: AlvoCopia) {
    const textos: Record<AlvoCopia, string> = {
      protocolo,
      senha,
      ambos: `Protocolo: ${protocolo}\nSenha: ${senha}`,
    };
    if (await copiar(textos[alvo])) setCopiado(alvo);
  }

  const bloqueado = guardou ? "" : "pointer-events-none opacity-50";

  return (
    <>
      <section aria-labelledby="titulo-concluida" className="print:hidden">
        <div className="flex flex-col items-center text-center">
          <CircleCheckBig className="h-14 w-14 text-acao" aria-hidden="true" />
          <h1 id="titulo-concluida" className="titulo mt-4 text-3xl">
            Denúncia enviada
          </h1>
          <p className="mt-2 text-lg text-suave">Guarde os dados abaixo. Eles são a única forma de acompanhar o caso.</p>
        </div>

        <div className="mt-8 space-y-3">
          <CampoSecreto rotulo="Protocolo" valor={protocolo} copiado={copiado === "protocolo"} onCopiar={() => handleCopiar("protocolo")} />
          <CampoSecreto rotulo="Senha" valor={senha} copiado={copiado === "senha"} onCopiar={() => handleCopiar("senha")} />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <button type="button" className="btn btn-primario" onClick={() => handleCopiar("ambos")}>
            {copiado === "ambos" ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            {copiado === "ambos" ? "Copiados!" : "Copiar os dois"}
          </button>
          <button type="button" className="btn btn-secundario" onClick={() => window.print()}>
            <Download className="h-5 w-5" aria-hidden="true" />
            Baixar comprovante (PDF)
          </button>
        </div>

        <div className="mt-6 flex gap-3 rounded-xl border-2 border-perigo/30 bg-perigo-claro p-5 text-perigo">
          <TriangleAlert className="h-6 w-6 shrink-0" aria-hidden="true" />
          <p className="text-sm leading-relaxed">
            <strong>Esses dados não serão enviados por e-mail ou qualquer outro meio.</strong> Guarde agora: anote,
            tire um print ou baixe o comprovante. Sem eles, você não poderá acompanhar o processo.
          </p>
        </div>

        <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-xl bg-white p-4">
          <input type="checkbox" checked={guardou} onChange={(e) => setGuardou(e.target.checked)} className="h-5 w-5 accent-acao" />
          <span className="font-medium text-tinta">Já guardei meu protocolo e minha senha</span>
        </label>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link href="/denuncia/acompanhar" aria-disabled={!guardou} className={`btn btn-acao ${bloqueado}`}>
            Acompanhar minha denúncia
          </Link>
          <Link href="/" aria-disabled={!guardou} className={`btn btn-fantasma ${bloqueado}`}>
            Finalizar
          </Link>
        </div>
      </section>

      <section aria-hidden="true" className="hidden print:block">
        <Marca />
        <h1 className="mt-10 font-serif text-3xl">Comprovante de denúncia</h1>
        <p className="mt-2 text-sm">Emitido em {formatDataHora(emitidoEm)}</p>
        <div className="mt-8 rounded-xl border-2 border-black p-6">
          <p className="text-xs tracking-widest uppercase">Protocolo</p>
          <p className="font-mono text-3xl font-bold">{protocolo}</p>
          <p className="mt-6 text-xs tracking-widest uppercase">Senha</p>
          <p className="font-mono text-3xl font-bold">{senha}</p>
        </div>
        <p className="mt-8 text-sm leading-relaxed">
          Guarde este comprovante em local seguro. Para acompanhar a apuração, acesse o canal AURA, escolha
          “Acompanhar denúncia” e informe o protocolo e a senha acima. Este documento não contém nenhum dado de
          identificação do denunciante.
        </p>
      </section>
    </>
  );
}
