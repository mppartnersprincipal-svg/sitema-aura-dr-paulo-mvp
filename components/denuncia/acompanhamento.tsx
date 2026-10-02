"use client";

import Link from "next/link";
import { useState } from "react";
import { FlaskConical, LockKeyhole, LogOut } from "lucide-react";
import { StatusBadge } from "@/components/badges";
import { EmpresaAvatar } from "@/components/empresa-avatar";
import { consultarDenuncia } from "@/lib/actions";
import { SENHA_DEMO_SEED } from "@/lib/config";
import { estaEncerrada, ETAPA_LABEL, formatData, prazoFinal, STATUS_PUBLICO, TIPO_LABEL } from "@/lib/format";
import { useAura } from "@/lib/store";
import { registrarFalha, tentativasRestantes } from "./limite-tentativas";
import { TimelinePublica } from "./timeline-publica";

const PROTOCOLO_DEMO = "AURA-2026-H4R7KM";
const MSG_BLOQUEIO = "Muitas tentativas. Por segurança, aguarde 1 hora para tentar novamente.";

function FormularioAcesso({ onEntrar }: { onEntrar: (id: string) => void }) {
  const [protocolo, setProtocolo] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [verificando, setVerificando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (tentativasRestantes() === 0) {
      setErro(MSG_BLOQUEIO);
      return;
    }
    setVerificando(true);
    const denuncia = await consultarDenuncia(protocolo, senha);
    setVerificando(false);
    if (denuncia) {
      onEntrar(denuncia.id);
      return;
    }
    const restantes = registrarFalha();
    setErro(
      restantes > 0 ? `Protocolo ou senha incorretos. Você ainda tem ${restantes} tentativa(s) nesta hora.` : MSG_BLOQUEIO,
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:py-16">
      <LockKeyhole className="h-10 w-10 text-acao" aria-hidden="true" />
      <h1 className="titulo mt-4 text-3xl">Acompanhar denúncia</h1>
      <p className="mt-2 text-suave">Digite o protocolo e a senha que você recebeu ao enviar a denúncia.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="protocolo" className="rotulo">
            Protocolo
          </label>
          <input
            id="protocolo"
            required
            autoComplete="off"
            autoCapitalize="characters"
            placeholder="AURA-2026-XXXXXX"
            className="campo font-mono text-lg tracking-wider uppercase"
            value={protocolo}
            onChange={(e) => setProtocolo(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="senha" className="rotulo">
            Senha
          </label>
          <input
            id="senha"
            type="password"
            required
            autoComplete="off"
            className="campo font-mono text-lg tracking-wider"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>
        {erro && (
          <p role="alert" className="text-sm font-medium text-perigo">
            {erro}
          </p>
        )}
        <button type="submit" className="btn btn-acao w-full py-4 text-lg" disabled={verificando}>
          {verificando ? "Verificando…" : "Ver andamento"}
        </button>
      </form>

      <aside className="mt-10 rounded-xl border border-dashed border-ouro/50 bg-white p-4 text-sm text-suave">
        <p className="flex items-center gap-2 font-semibold text-tinta">
          <FlaskConical className="h-4 w-4 text-ouro" aria-hidden="true" />
          Para testar a demonstração
        </p>
        <p className="mt-1">
          Protocolo <code className="font-mono text-tinta">{PROTOCOLO_DEMO}</code> · senha{" "}
          <code className="font-mono text-tinta">{SENHA_DEMO_SEED}</code>
        </p>
      </aside>
    </div>
  );
}

function PainelDenuncia({ id, onSair }: { id: string; onSair: () => void }) {
  const estado = useAura();
  const denuncia = estado?.denuncias.find((d) => d.id === id);
  const empresa = estado?.empresas.find((e) => e.id === denuncia?.empresa_id);
  if (!denuncia || !empresa) return null;
  const encerrada = estaEncerrada(denuncia);
  const situacao = encerrada
    ? `Encerrada em ${formatData(denuncia.data_conclusao)}`
    : `Prazo para conclusão: ${formatData(prazoFinal(denuncia))}`;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-suave uppercase">Protocolo</p>
          <p className="font-mono text-2xl font-bold tracking-wider text-tinta">{denuncia.protocolo}</p>
        </div>
        <button type="button" className="btn btn-fantasma btn-sm" onClick={onSair}>
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sair
        </button>
      </div>

      <div className="mt-6 rounded-2xl bg-tinta p-6 text-white">
        <p className="text-xs font-semibold tracking-[0.16em] text-white/60 uppercase">Situação atual</p>
        <p className="mt-1 font-serif text-3xl">{ETAPA_LABEL[denuncia.etapa_atual]}</p>
        <p className="mt-2 text-sm text-white/70">{situacao}</p>
      </div>

      {encerrada && (
        <div className="cartao mt-4 p-5">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-tinta">Resultado da apuração</span>
            <StatusBadge status={denuncia.status_conclusao} />
          </div>
          <p className="mt-2 text-sm leading-relaxed text-suave">{STATUS_PUBLICO[denuncia.status_conclusao]}</p>
        </div>
      )}

      <dl className="cartao mt-4 grid gap-4 p-5 sm:grid-cols-3">
        <div className="flex items-center gap-3 sm:col-span-3">
          <EmpresaAvatar empresa={empresa} tamanho="sm" />
          <div>
            <dt className="text-xs text-suave">Empresa</dt>
            <dd className="font-semibold text-tinta">{empresa.nome_fantasia}</dd>
          </div>
        </div>
        <div>
          <dt className="text-xs text-suave">Assunto</dt>
          <dd className="font-medium text-tinta">{TIPO_LABEL[denuncia.tipo]}</dd>
        </div>
        <div>
          <dt className="text-xs text-suave">Enviada em</dt>
          <dd className="font-medium text-tinta">{formatData(denuncia.created_at)}</dd>
        </div>
        <div>
          <dt className="text-xs text-suave">Provas enviadas</dt>
          <dd className="font-medium text-tinta">{denuncia.anexos.filter((a) => a.enviado_por === "denunciante").length}</dd>
        </div>
      </dl>

      <section className="cartao mt-4 p-6">
        <h2 className="titulo mb-6 text-xl">Andamento</h2>
        <TimelinePublica denuncia={denuncia} />
      </section>

      <p className="mt-6 text-center text-sm text-suave">
        Precisa acrescentar algo?{" "}
        <Link href="/denuncia" className="font-semibold text-tinta underline">
          Faça uma nova denúncia
        </Link>{" "}
        e mencione este protocolo.
      </p>
    </div>
  );
}

export function Acompanhamento() {
  const [denunciaId, setDenunciaId] = useState<string | null>(null);
  if (denunciaId) return <PainelDenuncia id={denunciaId} onSair={() => setDenunciaId(null)} />;
  return <FormularioAcesso onEntrar={setDenunciaId} />;
}
