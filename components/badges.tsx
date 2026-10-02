import { diasRestantes, ETAPA_LABEL, situacaoPrazo, STATUS_LABEL } from "@/lib/format";
import type { Denuncia, Etapa, StatusConclusao } from "@/lib/types";

const BASE = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap";

const COR_ETAPA: Record<Etapa, string> = {
  recebida: "bg-tinta-100 text-tinta",
  triagem: "bg-tinta-100 text-tinta",
  em_analise: "bg-[#e9e4f5] text-[#4b3a7a]",
  investigacao: "bg-[#e9e4f5] text-[#4b3a7a]",
  coleta_provas: "bg-alerta-claro text-alerta",
  concluida: "bg-acao-claro text-acao-escuro",
  arquivada: "bg-papel-escuro text-suave",
};

export function EtapaBadge({ etapa }: { etapa: Etapa }) {
  return <span className={`${BASE} ${COR_ETAPA[etapa]}`}>{ETAPA_LABEL[etapa]}</span>;
}

function corStatus(status: StatusConclusao): string {
  if (status === "procedente" || status === "parcialmente_procedente") return "bg-perigo-claro text-perigo";
  if (status === "pendente") return "bg-papel-escuro text-suave";
  return "bg-acao-claro text-acao-escuro";
}

export function StatusBadge({ status }: { status: StatusConclusao }) {
  return <span className={`${BASE} ${corStatus(status)}`}>{STATUS_LABEL[status]}</span>;
}

export function PrazoBadge({ denuncia }: { denuncia: Denuncia }) {
  const situacao = situacaoPrazo(denuncia);
  if (situacao === "encerrado") return <span className={`${BASE} bg-papel-escuro text-suave`}>Encerrado</span>;
  const dias = diasRestantes(denuncia);
  const estilos = {
    ok: { cor: "bg-acao-claro text-acao-escuro", ponto: "bg-acao", texto: `${dias} dias` },
    atencao: { cor: "bg-alerta-claro text-alerta", ponto: "bg-alerta", texto: dias === 0 ? "vence hoje" : `${dias} dias` },
    vencido: { cor: "bg-perigo-claro text-perigo", ponto: "bg-perigo", texto: `vencido há ${Math.abs(dias)}d` },
  }[situacao];
  return (
    <span className={`${BASE} ${estilos.cor}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${estilos.ponto}`} aria-hidden="true" />
      {estilos.texto}
      {denuncia.prazo_prorrogado && <span className="font-normal opacity-75">· prorrogado</span>}
    </span>
  );
}
