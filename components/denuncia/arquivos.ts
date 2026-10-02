import { MAX_PREVIEW_BYTES } from "@/lib/config";
import { gerarId } from "@/lib/crypto";
import type { Anexo, TipoAnexo } from "@/lib/types";

export const ACEITOS = "image/*,video/*,audio/*,application/pdf";

export function tipoDoArquivo(mime: string): TipoAnexo {
  if (mime.startsWith("image/")) return "foto";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  return "documento";
}

function lerComoDataUrl(arquivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => resolve(String(leitor.result));
    leitor.onerror = () => reject(leitor.error ?? new Error("Falha ao ler o arquivo"));
    leitor.readAsDataURL(arquivo);
  });
}

/** Converte um File em Anexo. Só imagens pequenas guardam conteúdo (limite do localStorage na demo). */
export async function paraAnexo(arquivo: File, enviadoPor: Anexo["enviado_por"]): Promise<Anexo> {
  const tipo = tipoDoArquivo(arquivo.type);
  const comPreview = tipo === "foto" && arquivo.size <= MAX_PREVIEW_BYTES;
  return {
    id: gerarId(),
    nome: arquivo.name,
    tipo,
    tamanho: arquivo.size,
    mime: arquivo.type || "application/octet-stream",
    data_url: comPreview ? await lerComoDataUrl(arquivo) : undefined,
    enviado_por: enviadoPor,
  };
}
