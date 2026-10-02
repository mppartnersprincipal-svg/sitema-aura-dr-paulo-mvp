"use client";

import { useState } from "react";
import { Download, Paperclip } from "lucide-react";
import { ICONES_ANEXO } from "@/components/denuncia/passo-provas";
import { ACEITOS, paraAnexo } from "@/components/denuncia/arquivos";
import { adicionarAnexoAdmin } from "@/lib/actions";
import { MAX_ANEXO_BYTES } from "@/lib/config";
import { ANEXO_LABEL, formatBytes } from "@/lib/format";
import type { Anexo } from "@/lib/types";

function ItemAnexo({ anexo }: { anexo: Anexo }) {
  const Icone = ICONES_ANEXO[anexo.tipo];
  const autor = anexo.enviado_por === "admin" ? "apurador" : "denunciante";
  return (
    <li className="overflow-hidden rounded-xl border border-linha bg-white">
      {anexo.data_url ? (
        // eslint-disable-next-line @next/next/no-img-element -- pré-visualização local em data URL
        <img src={anexo.data_url} alt={anexo.nome} className="h-36 w-full bg-papel object-cover" />
      ) : (
        <div className="flex h-36 items-center justify-center bg-papel">
          <Icone className="h-10 w-10 text-suave" aria-hidden="true" />
        </div>
      )}
      <div className="flex items-center gap-2 p-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-tinta">{anexo.nome}</p>
          <p className="text-xs text-suave">
            {ANEXO_LABEL[anexo.tipo]} · {formatBytes(anexo.tamanho)} · {autor}
          </p>
        </div>
        {anexo.data_url && (
          <a href={anexo.data_url} download={anexo.nome} className="btn btn-fantasma btn-sm" aria-label={`Baixar ${anexo.nome}`}>
            <Download className="h-4 w-4" />
          </a>
        )}
      </div>
    </li>
  );
}

export function AnexosDenuncia({ denunciaId, anexos }: { denunciaId: string; anexos: Anexo[] }) {
  const [erro, setErro] = useState("");

  async function handleArquivo(arquivo: File | undefined) {
    if (!arquivo) return;
    if (arquivo.size > MAX_ANEXO_BYTES) {
      setErro(`O arquivo passa de ${formatBytes(MAX_ANEXO_BYTES)}.`);
      return;
    }
    try {
      const anexo = await paraAnexo(arquivo, "admin");
      setErro(adicionarAnexoAdmin(denunciaId, anexo) ? "" : "Sem espaço no navegador para este arquivo na demonstração.");
    } catch {
      setErro("Não foi possível ler o arquivo.");
    }
  }

  return (
    <section className="cartao p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-tinta">Provas e documentos</h2>
        <label className="btn btn-secundario btn-sm cursor-pointer">
          <Paperclip className="h-4 w-4" aria-hidden="true" />
          Anexar documento
          <input
            type="file"
            accept={ACEITOS}
            className="sr-only"
            onChange={(e) => {
              void handleArquivo(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      {erro && (
        <p role="alert" className="mt-3 text-sm text-perigo">
          {erro}
        </p>
      )}
      {anexos.length === 0 ? (
        <p className="mt-4 text-sm text-suave">Nenhum arquivo enviado.</p>
      ) : (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {anexos.map((a) => (
            <ItemAnexo key={a.id} anexo={a} />
          ))}
        </ul>
      )}
    </section>
  );
}
