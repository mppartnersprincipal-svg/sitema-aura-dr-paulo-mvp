// Dados institucionais do canal. Valores provisórios até o Dr. Paulo confirmar (PRD §10).
export const CANAL = {
  nome: "AURA",
  nomeCompleto: "AURA · Canal de Denúncias Trabalhistas",
  razaoSocial: "AURA Canal de Denúncias Ltda.",
  cnpj: "00.000.000/0001-00",
  cidade: "Divinópolis/MG",
  responsavel: "Dr. Paulo",
  responsavelTitulo: "Advogado responsável pela apuração · OAB/MG 000.000",
  whatsappComercial: "5537999999999",
  whatsappAdmin: "+55 (37) 99999-9999",
  emailComercial: "contato@auracanal.com.br",
};

export const ADMIN_DEMO = {
  email: "paulo@auracanal.com.br",
  senha: "aura2026",
};

export const SENHA_DEMO_SEED = "aurademo26";

export const PRAZO_DIAS = 30;
export const PRORROGACAO_DIAS = 30;
export const ALERTA_PRAZO_DIAS = 7;

export const MAX_ANEXOS = 5;
export const MAX_ANEXO_BYTES = 25 * 1024 * 1024;
// Só imagens pequenas ficam com pré-visualização: o localStorage do navegador tem ~5 MB.
export const MAX_PREVIEW_BYTES = 600 * 1024;
export const MAX_LOGO_BYTES = 300 * 1024;
export const MIN_RELATO = 50;
