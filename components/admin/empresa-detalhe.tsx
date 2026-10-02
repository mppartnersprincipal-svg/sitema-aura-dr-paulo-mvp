"use client";

import Link from "next/link";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Award, Check, Copy, FolderArchive, Pencil, Printer } from "lucide-react";
import { EmpresaAvatar } from "@/components/empresa-avatar";
import { emitirCertidao } from "@/lib/actions";
import { estaEncerrada, formatData } from "@/lib/format";
import { useAura } from "@/lib/store";
import type { Empresa } from "@/lib/types";
import { EmpresaForm } from "./empresa-form";
import { TabelaDenuncias } from "./tabela-denuncias";

function LinkCanal({ empresa }: { empresa: Empresa }) {
  const [copiado, setCopiado] = useState(false);
  const url = `${window.location.origin}/denuncia?empresa=${empresa.slug}`;

  async function handleCopiar() {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
    } catch {
      setCopiado(false);
    }
  }

  return (
    <section className="cartao flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
      <div className="shrink-0 self-start rounded-xl border border-linha bg-white p-2">
        <QRCodeSVG value={url} size={104} fgColor="#0e2238" />
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="font-semibold text-tinta">Link exclusivo do canal</h2>
        <p className="mt-1 text-sm text-suave">Abre o canal já com esta empresa selecionada.</p>
        <p className="mt-3 truncate rounded-lg bg-papel px-3 py-2 font-mono text-xs text-tinta">{url}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className="btn btn-secundario btn-sm" onClick={handleCopiar}>
            {copiado ? <Check className="h-4 w-4 text-acao" /> : <Copy className="h-4 w-4" />}
            {copiado ? "Copiado" : "Copiar link"}
          </button>
          <Link href={`/admin/imprimir/cartaz/${empresa.id}`} target="_blank" className="btn btn-secundario btn-sm">
            <Printer className="h-4 w-4" aria-hidden="true" /> Cartaz com QR Code
          </Link>
        </div>
      </div>
    </section>
  );
}

function Contato({ empresa }: { empresa: Empresa }) {
  return (
    <section className="cartao p-5 text-sm">
      <h2 className="font-semibold text-tinta">Contato</h2>
      <dl className="mt-3 space-y-2">
        <div>
          <dt className="text-xs text-suave">Responsável legal</dt>
          <dd className="text-tinta">{empresa.responsavel_juridico || "—"}</dd>
        </div>
        <div>
          <dt className="text-xs text-suave">Contato</dt>
          <dd className="text-tinta">
            {empresa.contato_nome || "—"}
            <br />
            {empresa.contato_telefone} {empresa.contato_email && `· ${empresa.contato_email}`}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-suave">Endereço</dt>
          <dd className="text-tinta">
            {empresa.endereco} {empresa.cep && `· ${empresa.cep}`}
          </dd>
        </div>
        {empresa.observacoes && (
          <div>
            <dt className="text-xs text-suave">Observações</dt>
            <dd className="text-tinta">{empresa.observacoes}</dd>
          </div>
        )}
      </dl>
    </section>
  );
}

export function EmpresaDetalhe({ id }: { id: string }) {
  const estado = useAura();
  const [editando, setEditando] = useState(false);
  const [erro, setErro] = useState("");
  if (!estado) return null;

  const empresa = estado.empresas.find((e) => e.id === id);
  if (!empresa) {
    return (
      <div className="py-20 text-center">
        <p className="text-suave">Empresa não encontrada.</p>
        <Link href="/admin/empresas" className="btn btn-secundario mt-4">
          Voltar
        </Link>
      </div>
    );
  }

  const denuncias = estado.denuncias
    .filter((d) => d.empresa_id === id)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
  const encerradas = denuncias.filter(estaEncerrada).length;
  const certidoes = estado.certidoes
    .filter((c) => c.empresa_id === id)
    .sort((a, b) => b.data_emissao.localeCompare(a.data_emissao));

  function handleEmitir() {
    const certidaoId = emitirCertidao(id);
    if (!certidaoId) {
      setErro("Não foi possível emitir a certidão.");
      return;
    }
    window.open(`/admin/imprimir/certidao/${certidaoId}`, "_blank");
  }

  if (editando) {
    return (
      <div className="max-w-3xl">
        <h1 className="titulo mb-6 text-3xl">Editar {empresa.nome_fantasia}</h1>
        <EmpresaForm empresa={empresa} onSalvo={() => setEditando(false)} onCancelar={() => setEditando(false)} />
      </div>
    );
  }

  return (
    <>
      <Link href="/admin/empresas" className="mb-5 inline-flex items-center gap-1.5 text-sm text-suave hover:text-tinta">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Empresas
      </Link>

      <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <EmpresaAvatar empresa={empresa} tamanho="lg" />
          <div>
            <h1 className="titulo text-3xl">{empresa.nome_fantasia}</h1>
            <p className="text-suave">
              {empresa.nome} · <span className="font-mono text-sm">{empresa.cnpj}</span>
            </p>
            <p className="mt-1 text-sm text-suave">
              {empresa.cidade}/{empresa.estado} · cliente desde {formatData(empresa.data_contratacao)} ·{" "}
              <span className={empresa.ativa ? "font-semibold text-acao" : "font-semibold text-suave"}>
                {empresa.ativa ? "canal ativo" : "canal inativo"}
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-secundario btn-sm" onClick={() => setEditando(true)}>
            <Pencil className="h-4 w-4" aria-hidden="true" /> Editar dados
          </button>
          <Link href={`/admin/imprimir/dossie/${empresa.id}`} target="_blank" className="btn btn-secundario btn-sm">
            <FolderArchive className="h-4 w-4" aria-hidden="true" /> Exportar procedimentos
          </Link>
          <button type="button" className="btn btn-primario btn-sm" onClick={handleEmitir}>
            <Award className="h-4 w-4" aria-hidden="true" /> Emitir certidão
          </button>
        </div>
      </header>
      {erro && (
        <p role="alert" className="mb-4 text-sm text-perigo">
          {erro}
        </p>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_24rem]">
        <div className="space-y-6">
          <LinkCanal empresa={empresa} />
          <section>
            <h2 className="mb-3 text-lg font-semibold text-tinta">
              Denúncias <span className="font-normal text-suave">· {denuncias.length} recebidas, {encerradas} encerradas</span>
            </h2>
            <TabelaDenuncias denuncias={denuncias} empresas={estado.empresas} ocultarEmpresa />
          </section>
        </div>

        <aside className="space-y-6">
          <section className="cartao p-5">
            <h2 className="font-semibold text-tinta">Certidões emitidas</h2>
            {certidoes.length === 0 ? (
              <p className="mt-2 text-sm text-suave">Nenhuma certidão emitida.</p>
            ) : (
              <ul className="mt-3 divide-y divide-linha">
                {certidoes.map((c) => (
                  <li key={c.id} className="flex items-center justify-between py-2.5">
                    <div>
                      <p className="font-mono text-sm font-semibold text-tinta">{c.codigo}</p>
                      <p className="text-xs text-suave">{formatData(c.data_emissao)}</p>
                    </div>
                    <Link href={`/admin/imprimir/certidao/${c.id}`} target="_blank" className="btn btn-fantasma btn-sm" aria-label="Imprimir certidão">
                      <Printer className="h-4 w-4" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <Contato empresa={empresa} />
        </aside>
      </div>
    </>
  );
}
