"use client";

import { useState } from "react";
import { FileAudio, FileImage, FileText, FileVideo, TriangleAlert, Upload, X } from "lucide-react";
import { MAX_ANEXO_BYTES, MAX_ANEXOS } from "@/lib/config";
import { formatBytes } from "@/lib/format";
import type { Anexo, TipoAnexo } from "@/lib/types";
import { ACEITOS, paraAnexo } from "./arquivos";

export const ICONES_ANEXO: Record<TipoAnexo, typeof FileText> = {
  foto: FileImage,
  video: FileVideo,
  audio: FileAudio,
  documento: FileText,
};

type Props = {
  anexos: Anexo[];
  onChange: (anexos: Anexo[]) => void;
  onContinuar: () => void;
};

export function PassoProvas({ anexos, onChange, onContinuar }: Props) {
  const [erro, setErro] = useState("");
  const [lendo, setLendo] = useState(false);
  const cheio = anexos.length >= MAX_ANEXOS;

  async function handleArquivos(lista: FileList | null) {
    if (!lista?.length) return;
    const arquivos = Array.from(lista);
    if (anexos.length + arquivos.length > MAX_ANEXOS) {
      setErro(`Você pode enviar no máximo ${MAX_ANEXOS} arquivos.`);
      return;
    }
    const grande = arquivos.find((a) => a.size > MAX_ANEXO_BYTES);
    if (grande) {
      setErro(`“${grande.name}” passa de ${formatBytes(MAX_ANEXO_BYTES)}.`);
      return;
    }
    setErro("");
    setLendo(true);
    try {
      const novos = await Promise.all(arquivos.map((a) => paraAnexo(a, "denunciante")));
      onChange([...anexos, ...novos]);
    } catch {
      setErro("Não foi possível ler um dos arquivos. Tente outro.");
    } finally {
      setLendo(false);
    }
  }

  return (
    <section aria-labelledby="titulo-provas">
      <h1 id="titulo-provas" className="titulo text-3xl">
        Tem alguma prova?
      </h1>
      <p className="mt-2 text-lg text-suave">Fotos, prints, áudios, vídeos ou documentos. Isso é opcional.</p>

      <label
        className={`mt-6 flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-linha bg-white px-6 py-10 text-center transition-colors hover:border-acao ${
          cheio ? "pointer-events-none opacity-50" : ""
        }`}
      >
        <Upload className="h-10 w-10 text-acao" aria-hidden="true" />
        <span className="text-lg font-semibold text-tinta">{lendo ? "Lendo arquivos…" : "Toque para escolher arquivos"}</span>
        <span className="text-sm text-suave">
          Até {MAX_ANEXOS} arquivos, {formatBytes(MAX_ANEXO_BYTES)} cada
        </span>
        <input
          type="file"
          multiple
          accept={ACEITOS}
          className="sr-only"
          disabled={lendo || cheio}
          onChange={(e) => {
            void handleArquivos(e.target.files);
            e.target.value = "";
          }}
        />
      </label>

      {erro && (
        <p role="alert" className="mt-3 text-sm font-medium text-perigo">
          {erro}
        </p>
      )}

      {anexos.length > 0 && (
        <ul className="mt-5 space-y-2">
          {anexos.map((a) => {
            const Icone = ICONES_ANEXO[a.tipo];
            return (
              <li key={a.id} className="flex items-center gap-3 rounded-xl border border-linha bg-white p-3">
                <Icone className="h-6 w-6 shrink-0 text-tinta-700" aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-tinta">{a.nome}</span>
                  <span className="text-xs text-suave">{formatBytes(a.tamanho)}</span>
                </span>
                <button
                  type="button"
                  className="btn btn-fantasma btn-sm"
                  aria-label={`Remover ${a.nome}`}
                  onClick={() => onChange(anexos.filter((x) => x.id !== a.id))}
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-6 flex gap-3 rounded-xl border border-alerta/30 bg-alerta-claro p-4 text-sm text-alerta">
        <TriangleAlert className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span>
          Fotos de celular podem guardar informações escondidas, como o local e o modelo do aparelho. Se puder, envie
          um <strong>print da foto</strong> em vez do arquivo original.
        </span>
      </div>

      <button type="button" className="btn btn-acao mt-8 w-full py-4 text-lg" disabled={lendo} onClick={onContinuar}>
        {anexos.length ? "Continuar" : "Continuar sem provas"}
      </button>
    </section>
  );
}
