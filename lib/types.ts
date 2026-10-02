export type TipoDenuncia =
  | "assedio_moral"
  | "assedio_sexual"
  | "discriminacao"
  | "reclamacao"
  | "outros";

export type Etapa =
  | "recebida"
  | "triagem"
  | "em_analise"
  | "investigacao"
  | "coleta_provas"
  | "concluida"
  | "arquivada";

export type StatusConclusao =
  | "procedente"
  | "improcedente"
  | "parcialmente_procedente"
  | "arquivada_insuficiencia"
  | "pendente";

export type TipoAnexo = "foto" | "video" | "audio" | "documento";

export interface Empresa {
  id: string;
  nome: string;
  nome_fantasia: string;
  cnpj: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  contato_nome: string;
  contato_telefone: string;
  contato_email: string;
  responsavel_juridico: string;
  logo_url?: string;
  cor: string;
  slug: string;
  ativa: boolean;
  data_contratacao: string;
  observacoes: string;
  created_at: string;
}

export interface Anexo {
  id: string;
  nome: string;
  tipo: TipoAnexo;
  tamanho: number;
  mime: string;
  data_url?: string;
  enviado_por: "denunciante" | "admin";
}

export interface HistoricoEtapa {
  id: string;
  etapa: Etapa;
  observacao_publica?: string;
  observacao_interna?: string;
  created_at: string;
}

export interface Denuncia {
  id: string;
  protocolo: string;
  senha_hash: string;
  empresa_id: string;
  tipo: TipoDenuncia;
  relato: string;
  denunciado_nome?: string;
  denunciado_cargo?: string;
  local_ocorrencia?: string;
  data_ocorrencia_aprox?: string;
  etapa_atual: Etapa;
  status_conclusao: StatusConclusao;
  prazo_inicial: string;
  prazo_prorrogado?: string;
  data_conclusao?: string;
  parecer_final?: string;
  anotacoes_internas: string;
  anexos: Anexo[];
  historico: HistoricoEtapa[];
  created_at: string;
}

export interface Certidao {
  id: string;
  empresa_id: string;
  codigo: string;
  data_emissao: string;
}

export interface Lead {
  id: string;
  razao_social: string;
  cnpj: string;
  responsavel_nome: string;
  responsavel_cargo: string;
  email: string;
  telefone: string;
  qtd_funcionarios_faixa: string;
  mensagem: string;
  created_at: string;
}

export interface Notificacao {
  id: string;
  canal: "whatsapp";
  conteudo: string;
  link?: string;
  lida: boolean;
  created_at: string;
}

export interface AuraState {
  versao: number;
  empresas: Empresa[];
  denuncias: Denuncia[];
  certidoes: Certidao[];
  leads: Lead[];
  notificacoes: Notificacao[];
}
