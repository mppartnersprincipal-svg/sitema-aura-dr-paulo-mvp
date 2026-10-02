import { ALERTA_PRAZO_DIAS } from "./config";
import type { Denuncia, Etapa, StatusConclusao, TipoAnexo, TipoDenuncia } from "./types";

export const TIPO_LABEL: Record<TipoDenuncia, string> = {
  assedio_moral: "Assédio Moral",
  assedio_sexual: "Assédio Sexual",
  discriminacao: "Discriminação",
  reclamacao: "Reclamação",
  outros: "Outro assunto",
};

export const TIPO_DESCRICAO: Record<TipoDenuncia, string> = {
  assedio_moral: "Humilhação, ameaça, xingamento, perseguição",
  assedio_sexual: "Toque, convite ou comentário de cunho sexual",
  discriminacao: "Tratamento diferente por cor, sexo, idade, religião...",
  reclamacao: "Problemas de segurança, jornada ou condições de trabalho",
  outros: "Qualquer outra situação errada no trabalho",
};

export const ETAPAS_FLUXO: Etapa[] = [
  "recebida",
  "triagem",
  "em_analise",
  "investigacao",
  "coleta_provas",
  "concluida",
];

export const ETAPA_LABEL: Record<Etapa, string> = {
  recebida: "Recebida",
  triagem: "Triagem",
  em_analise: "Em análise",
  investigacao: "Investigação",
  coleta_provas: "Coleta de provas",
  concluida: "Concluída",
  arquivada: "Arquivada",
};

export const ETAPA_DESCRICAO: Record<Etapa, string> = {
  recebida: "Sua denúncia chegou ao canal e foi registrada com segurança.",
  triagem: "O apurador independente está verificando as informações iniciais.",
  em_analise: "O caso está sendo analisado juridicamente.",
  investigacao: "Estão sendo ouvidas pessoas e verificados os fatos.",
  coleta_provas: "Documentos e depoimentos estão sendo reunidos.",
  concluida: "A apuração terminou e o parecer final foi emitido.",
  arquivada: "O procedimento foi arquivado.",
};

export const STATUS_LABEL: Record<StatusConclusao, string> = {
  procedente: "Procedente",
  improcedente: "Improcedente",
  parcialmente_procedente: "Parcialmente procedente",
  arquivada_insuficiencia: "Arquivada por insuficiência de provas",
  pendente: "Em andamento",
};

export const STATUS_PUBLICO: Record<StatusConclusao, string> = {
  procedente: "Os fatos denunciados foram confirmados e medidas foram recomendadas à empresa.",
  improcedente: "A apuração não confirmou os fatos denunciados.",
  parcialmente_procedente: "Parte dos fatos denunciados foi confirmada e medidas foram recomendadas.",
  arquivada_insuficiencia: "Não foi possível reunir provas suficientes para concluir a apuração.",
  pendente: "A apuração ainda está em andamento.",
};

export const ANEXO_LABEL: Record<TipoAnexo, string> = {
  foto: "Foto",
  video: "Vídeo",
  audio: "Áudio",
  documento: "Documento",
};

const DIA_MS = 24 * 60 * 60 * 1000;

export function addDias(iso: string, dias: number): string {
  return new Date(new Date(iso).getTime() + dias * DIA_MS).toISOString();
}

export function formatData(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

export function formatDataHora(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDataExtenso(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function prazoFinal(d: Denuncia): string {
  return d.prazo_prorrogado ?? d.prazo_inicial;
}

export function diasRestantes(d: Denuncia, agora = Date.now()): number {
  return Math.ceil((new Date(prazoFinal(d)).getTime() - agora) / DIA_MS);
}

export type SituacaoPrazo = "encerrado" | "ok" | "atencao" | "vencido";

export function situacaoPrazo(d: Denuncia): SituacaoPrazo {
  if (estaEncerrada(d)) return "encerrado";
  const dias = diasRestantes(d);
  if (dias < 0) return "vencido";
  if (dias <= ALERTA_PRAZO_DIAS) return "atencao";
  return "ok";
}

export function estaEncerrada(d: Denuncia): boolean {
  return d.etapa_atual === "concluida" || d.etapa_atual === "arquivada";
}

export function proximaEtapa(etapa: Etapa): Etapa | null {
  const i = ETAPAS_FLUXO.indexOf(etapa);
  // "concluida" só é alcançada pelo formulário de conclusão (exige parecer).
  if (i < 0 || i >= ETAPAS_FLUXO.length - 2) return null;
  return ETAPAS_FLUXO[i + 1];
}

export function mascaraCnpj(valor: string): string {
  const d = valor.replace(/\D/g, "").slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

export function mascaraTelefone(valor: string): string {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10) return d.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3").replace(/-$/, "");
  return d.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
}

export function mascaraCep(valor: string): string {
  return valor.replace(/\D/g, "").slice(0, 8).replace(/^(\d{5})(\d)/, "$1-$2");
}

export function slugify(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function iniciais(nome: string): string {
  return nome
    .split(/\s+/)
    .filter((p) => p.length > 2)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}
