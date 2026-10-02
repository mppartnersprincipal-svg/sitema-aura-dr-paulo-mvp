"use client";

import { PRORROGACAO_DIAS, PRAZO_DIAS } from "./config";
import { gerarId, gerarProtocolo, gerarSenha, hashSenha, normalizarProtocolo } from "./crypto";
import { addDias, ETAPA_LABEL } from "./format";
import { atualizar, lerEstado } from "./store";
import type { Anexo, Denuncia, Empresa, Etapa, Lead, Notificacao, StatusConclusao, TipoDenuncia } from "./types";

function agora() {
  return new Date().toISOString();
}

function alterarDenuncia(id: string, fn: (d: Denuncia) => Denuncia): boolean {
  return atualizar((s) => ({
    ...s,
    denuncias: s.denuncias.map((d) => (d.id === id ? fn(d) : d)),
  }));
}

function novaNotificacao(conteudo: string, link?: string): Notificacao {
  return { id: gerarId(), canal: "whatsapp", conteudo, link, lida: false, created_at: agora() };
}

// ---------- Denunciante ----------

export interface NovaDenuncia {
  empresa_id: string;
  tipo: TipoDenuncia;
  relato: string;
  denunciado_nome?: string;
  denunciado_cargo?: string;
  local_ocorrencia?: string;
  data_ocorrencia_aprox?: string;
  anexos: Anexo[];
}

export type ResultadoRegistro = { protocolo: string; senha: string } | { erro: string };

export async function registrarDenuncia(dados: NovaDenuncia): Promise<ResultadoRegistro> {
  const protocolo = gerarProtocolo();
  const senha = gerarSenha();
  const senha_hash = await hashSenha(protocolo, senha);
  const criadoEm = agora();
  const id = gerarId();

  const denuncia: Denuncia = {
    ...dados,
    id,
    protocolo,
    senha_hash,
    etapa_atual: "recebida",
    status_conclusao: "pendente",
    prazo_inicial: addDias(criadoEm, PRAZO_DIAS),
    anotacoes_internas: "",
    historico: [
      { id: gerarId(), etapa: "recebida", observacao_publica: "Denúncia registrada no canal.", created_at: criadoEm },
    ],
    created_at: criadoEm,
  };

  const ok = atualizar((s) => ({
    ...s,
    denuncias: [denuncia, ...s.denuncias],
    notificacoes: [
      novaNotificacao(`Nova denúncia recebida — Protocolo ${protocolo}`, `/admin/denuncias/${id}`),
      ...s.notificacoes,
    ],
  }));
  if (!ok) {
    return { erro: "Não foi possível salvar. Os anexos podem ser grandes demais para esta demonstração." };
  }
  return { protocolo, senha };
}

export async function consultarDenuncia(protocoloDigitado: string, senha: string): Promise<Denuncia | null> {
  const protocolo = normalizarProtocolo(protocoloDigitado);
  const denuncia = lerEstado().denuncias.find((d) => d.protocolo === protocolo);
  if (!denuncia) return null;
  const hash = await hashSenha(protocolo, senha.trim().toLowerCase());
  return hash === denuncia.senha_hash ? denuncia : null;
}

// ---------- Admin: denúncias ----------

export function avancarEtapa(id: string, etapa: Etapa, obsPublica: string, obsInterna: string) {
  return alterarDenuncia(id, (d) => ({
    ...d,
    etapa_atual: etapa,
    historico: [
      ...d.historico,
      {
        id: gerarId(),
        etapa,
        observacao_publica: obsPublica.trim() || undefined,
        observacao_interna: obsInterna.trim() || undefined,
        created_at: agora(),
      },
    ],
  }));
}

export function prorrogarPrazo(id: string) {
  return alterarDenuncia(id, (d) =>
    d.prazo_prorrogado
      ? d
      : {
          ...d,
          prazo_prorrogado: addDias(d.prazo_inicial, PRORROGACAO_DIAS),
          historico: [
            ...d.historico,
            {
              id: gerarId(),
              etapa: d.etapa_atual,
              observacao_publica: `Prazo de apuração prorrogado por mais ${PRORROGACAO_DIAS} dias.`,
              created_at: agora(),
            },
          ],
        },
  );
}

export function salvarAnotacoes(id: string, texto: string) {
  return alterarDenuncia(id, (d) => ({ ...d, anotacoes_internas: texto }));
}

export function adicionarAnexoAdmin(id: string, anexo: Anexo) {
  return alterarDenuncia(id, (d) => ({ ...d, anexos: [...d.anexos, anexo] }));
}

export function concluirDenuncia(id: string, status: StatusConclusao, parecer: string) {
  const etapa: Etapa = status === "arquivada_insuficiencia" ? "arquivada" : "concluida";
  const quando = agora();
  return alterarDenuncia(id, (d) => ({
    ...d,
    etapa_atual: etapa,
    status_conclusao: status,
    parecer_final: parecer.trim(),
    data_conclusao: quando,
    historico: [
      ...d.historico,
      {
        id: gerarId(),
        etapa,
        observacao_publica: `Procedimento encerrado (${ETAPA_LABEL[etapa]}). Parecer final emitido.`,
        created_at: quando,
      },
    ],
  }));
}

// ---------- Admin: empresas e certidões ----------

export type DadosEmpresa = Omit<Empresa, "id" | "created_at">;

export function salvarEmpresa(dados: DadosEmpresa, id?: string): string | null {
  const novoId = id ?? gerarId();
  const ok = atualizar((s) => ({
    ...s,
    empresas: id
      ? s.empresas.map((e) => (e.id === id ? { ...e, ...dados } : e))
      : [...s.empresas, { ...dados, id: novoId, created_at: agora() }],
  }));
  return ok ? novoId : null;
}

export function slugEmUso(slug: string, ignorarId?: string): boolean {
  return lerEstado().empresas.some((e) => e.slug === slug && e.id !== ignorarId);
}

export function emitirCertidao(empresaId: string): string | null {
  const numero = String(lerEstado().certidoes.length + 1).padStart(4, "0");
  const id = gerarId();
  const ok = atualizar((s) => ({
    ...s,
    certidoes: [
      ...s.certidoes,
      { id, empresa_id: empresaId, codigo: `CERT-AURA-${new Date().getFullYear()}-${numero}`, data_emissao: agora() },
    ],
  }));
  return ok ? id : null;
}

// ---------- Comercial ----------

export function registrarLead(dados: Omit<Lead, "id" | "created_at">) {
  return atualizar((s) => ({
    ...s,
    leads: [{ ...dados, id: gerarId(), created_at: agora() }, ...s.leads],
    notificacoes: [
      novaNotificacao(`Novo lead comercial — ${dados.razao_social || dados.responsavel_nome}`, "/admin/leads"),
      ...s.notificacoes,
    ],
  }));
}

export function marcarNotificacoesLidas() {
  return atualizar((s) => ({
    ...s,
    notificacoes: s.notificacoes.map((n) => (n.lida ? n : { ...n, lida: true })),
  }));
}
