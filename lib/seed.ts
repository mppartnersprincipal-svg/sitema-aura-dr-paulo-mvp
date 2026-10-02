import { PRAZO_DIAS, PRORROGACAO_DIAS } from "./config";
import { addDias } from "./format";
import type { AuraState, Denuncia, Empresa, Etapa, HistoricoEtapa } from "./types";

// Dados fictícios. Todas as denúncias de exemplo usam a senha SENHA_DEMO_SEED;
// os hashes abaixo são SHA-256 de "<protocolo>:aurademo26".
export const VERSAO_SEED = 1;

function diasAtras(dias: number, horas = 0): string {
  return new Date(Date.now() - dias * 864e5 - horas * 36e5).toISOString();
}

const EMPRESAS: Empresa[] = [
  {
    id: "emp-metalurgica",
    nome: "Metalúrgica Vale do Itapecerica Ltda.",
    nome_fantasia: "Metalúrgica Itapecerica",
    cnpj: "12.345.678/0001-90",
    endereco: "Av. Industrial, 1500 — Distrito Industrial",
    cidade: "Divinópolis",
    estado: "MG",
    cep: "35500-000",
    contato_nome: "Renata Souza",
    contato_telefone: "(37) 3221-0000",
    contato_email: "rh@metalurgicaitapecerica.com.br",
    responsavel_juridico: "Carlos Mendes (sócio-administrador)",
    cor: "#1e3a5f",
    slug: "metalurgica-itapecerica",
    ativa: true,
    data_contratacao: diasAtras(120),
    observacoes: "Cliente piloto. 180 funcionários em 2 turnos.",
    created_at: diasAtras(120),
  },
  {
    id: "emp-supermercado",
    nome: "Comercial Bom Preço Supermercados Ltda.",
    nome_fantasia: "Supermercados Bom Preço",
    cnpj: "23.456.789/0001-01",
    endereco: "Rua Goiás, 820 — Centro",
    cidade: "Divinópolis",
    estado: "MG",
    cep: "35500-001",
    contato_nome: "Marcelo Pires",
    contato_telefone: "(37) 3222-1111",
    contato_email: "gerencia@bompreco.com.br",
    responsavel_juridico: "Marcelo Pires (diretor)",
    cor: "#2f6b4f",
    slug: "supermercados-bom-preco",
    ativa: true,
    data_contratacao: diasAtras(75),
    observacoes: "3 lojas. Cartazes instalados nos refeitórios.",
    created_at: diasAtras(75),
  },
  {
    id: "emp-confeccoes",
    nome: "Divinas Confecções e Moda Ltda.",
    nome_fantasia: "Confecções Divinas",
    cnpj: "34.567.890/0001-12",
    endereco: "Rua Pernambuco, 455 — Polo da Moda",
    cidade: "Divinópolis",
    estado: "MG",
    cep: "35500-002",
    contato_nome: "Ana Lúcia Ferreira",
    contato_telefone: "(37) 3223-2222",
    contato_email: "administrativo@divinas.com.br",
    responsavel_juridico: "Ana Lúcia Ferreira (sócia)",
    cor: "#7a3b5c",
    slug: "confeccoes-divinas",
    ativa: true,
    data_contratacao: diasAtras(60),
    observacoes: "",
    created_at: diasAtras(60),
  },
  {
    id: "emp-transportadora",
    nome: "Transportes Oeste Mineiro S.A.",
    nome_fantasia: "Transportadora Oeste Mineiro",
    cnpj: "45.678.901/0001-23",
    endereco: "Rod. MG-050, km 120",
    cidade: "Divinópolis",
    estado: "MG",
    cep: "35500-003",
    contato_nome: "Jorge Almeida",
    contato_telefone: "(37) 3224-3333",
    contato_email: "jorge@oestemineiro.com.br",
    responsavel_juridico: "Jorge Almeida (gerente administrativo)",
    cor: "#8a5a1f",
    slug: "transportadora-oeste-mineiro",
    ativa: true,
    data_contratacao: diasAtras(45),
    observacoes: "Motoristas acessam o canal pelo celular (QR no crachá).",
    created_at: diasAtras(45),
  },
];

interface DenunciaSeed {
  protocolo: string;
  hash: string;
  empresa: string;
  tipo: Denuncia["tipo"];
  diasAtras: number;
  etapas: Etapa[];
  relato: string;
  denunciado_nome?: string;
  denunciado_cargo?: string;
  local_ocorrencia?: string;
  prorrogado?: boolean;
  conclusao?: { status: Denuncia["status_conclusao"]; parecer: string };
  anotacoes?: string;
}

const OBS_PUBLICA: Partial<Record<Etapa, string>> = {
  triagem: "Denúncia recebida pelo apurador independente.",
  em_analise: "Relato considerado suficiente para abertura de apuração.",
  investigacao: "Início da oitiva de testemunhas.",
  coleta_provas: "Reunião de documentos junto à empresa.",
  concluida: "Procedimento encerrado. Parecer emitido.",
};

const DENUNCIAS: DenunciaSeed[] = [
  {
    protocolo: "AURA-2026-H4R7KM",
    hash: "e87a4c094201152da0ba8c2441c841056e6fe2a8166e647b57bb74628e980ad8",
    empresa: "emp-metalurgica",
    tipo: "assedio_moral",
    diasAtras: 12,
    etapas: ["recebida", "triagem", "em_analise", "investigacao"],
    relato:
      "O encarregado do setor de solda grita com a equipe quase todos os dias, chama as pessoas de incompetentes na frente de todo mundo e ameaça mandar embora quem reclama das horas extras. Na última semana um colega saiu chorando do galpão.",
    denunciado_nome: "Encarregado do turno da manhã",
    denunciado_cargo: "Encarregado de produção",
    local_ocorrencia: "Galpão de solda",
    anotacoes: "Ouvir 3 colegas do turno da manhã. Solicitar à empresa a escala de horas extras de agosto e setembro.",
  },
  {
    protocolo: "AURA-2026-T9W2PL",
    hash: "7b0710aeb58fe3995d426f847e00c856c7b181f6613c277f1afb8bdf725b2c5e",
    empresa: "emp-supermercado",
    tipo: "assedio_sexual",
    diasAtras: 2,
    etapas: ["recebida", "triagem"],
    relato:
      "Um dos gerentes faz comentários sobre o corpo das operadoras de caixa e já tentou encostar em mim no estoque. Outras meninas também passaram por isso mas têm medo de falar.",
    denunciado_cargo: "Gerente de loja",
    local_ocorrencia: "Estoque da loja do Centro",
  },
  {
    protocolo: "AURA-2026-B6N8QZ",
    hash: "64c496c73f8bfd4e9e3b8c65ddb54358b957088d977a7274fa72843083b80900",
    empresa: "emp-metalurgica",
    tipo: "discriminacao",
    diasAtras: 26,
    etapas: ["recebida", "triagem", "em_analise", "investigacao", "coleta_provas"],
    relato:
      "Funcionários mais velhos estão sendo deixados de fora dos treinamentos novos e o supervisor falou numa reunião que 'gente dessa idade não aprende mais'. Dois colegas com mais de 50 anos foram trocados de função sem explicação.",
    denunciado_cargo: "Supervisor de manutenção",
    local_ocorrencia: "Setor de manutenção",
    anotacoes: "Prazo próximo. Avaliar prorrogação se a empresa não enviar a lista de treinamentos até sexta.",
  },
  {
    protocolo: "AURA-2026-M3X5VD",
    hash: "cda6df3503041cc4b9b2023be921869d2be04c411189aa9e4cbbb648a5f37b98",
    empresa: "emp-confeccoes",
    tipo: "reclamacao",
    diasAtras: 40,
    etapas: ["recebida", "triagem", "em_analise", "investigacao", "coleta_provas", "concluida"],
    relato:
      "As costureiras do segundo andar estão trabalhando sem ventilação e sem pausa para descanso. A empresa cortou o intervalo da tarde e quem reclama é ameaçada de perder o bônus de produção.",
    local_ocorrencia: "Ateliê do segundo andar",
    conclusao: {
      status: "procedente",
      parecer:
        "Após oitiva de 6 colaboradoras e vistoria no local, restou comprovada a supressão do intervalo vespertino e a inadequação da ventilação do ateliê. Recomenda-se à empresa o restabelecimento imediato das pausas, a instalação de exaustores e a inclusão do risco no inventário do PGR, nos termos da NR-01.",
    },
  },
  {
    protocolo: "AURA-2026-R2J9FS",
    hash: "b0fe96f5367435d81af807aef494a426f98a185db800da3651a5e1c13cf69d68",
    empresa: "emp-transportadora",
    tipo: "assedio_moral",
    diasAtras: 35,
    etapas: ["recebida", "triagem", "em_analise"],
    relato:
      "O coordenador de frota exige que os motoristas respondam mensagens de madrugada e no dia de folga. Quem não responde fica sem as melhores rotas e é chamado de preguiçoso no grupo de WhatsApp da equipe.",
    denunciado_cargo: "Coordenador de frota",
    local_ocorrencia: "Grupo de WhatsApp da equipe",
    prorrogado: true,
    anotacoes: "Prazo prorrogado: aguardando prints do grupo fornecidos por testemunha.",
  },
  {
    protocolo: "AURA-2026-Q8L4CY",
    hash: "851626bd737feed7d2f6d4d5e9f2fe09480f3e92ac34a61affced6fc9c4d838c",
    empresa: "emp-supermercado",
    tipo: "outros",
    diasAtras: 0,
    etapas: ["recebida"],
    relato:
      "O banco de horas não está sendo pago e ninguém do escritório explica como funciona. Já são três meses que as horas só acumulam e quando pedimos folga dizem que não pode por causa do movimento.",
  },
  {
    protocolo: "AURA-2026-W5E7NA",
    hash: "204fa13df3ae8c80539052860dd32b5c083d4375f2bacbe0982ac9961bf43d6b",
    empresa: "emp-confeccoes",
    tipo: "assedio_moral",
    diasAtras: 33,
    etapas: ["recebida", "triagem", "em_analise", "investigacao"],
    relato:
      "A líder de produção controla o tempo que cada uma vai ao banheiro e anota num caderno na frente de todas. Quem demora mais de 5 minutos é chamada atenção em voz alta e fica com fama de 'enrolona'.",
    denunciado_cargo: "Líder de produção",
    local_ocorrencia: "Linha de costura 1",
  },
];

function montarHistorico(seed: DenunciaSeed, criadoEm: string): HistoricoEtapa[] {
  const total = seed.etapas.length;
  const inicio = new Date(criadoEm).getTime();
  const idadeMs = Date.now() - inicio;
  return seed.etapas.map((etapa, i) => ({
    id: `${seed.protocolo}-h${i}`,
    etapa,
    observacao_publica: OBS_PUBLICA[etapa],
    created_at: new Date(inicio + (idadeMs * i) / Math.max(total, 1)).toISOString(),
  }));
}

function montarDenuncia(seed: DenunciaSeed): Denuncia {
  const created_at = diasAtras(seed.diasAtras, 3);
  const historico = montarHistorico(seed, created_at);
  const prazo_inicial = addDias(created_at, PRAZO_DIAS);
  return {
    id: `den-${seed.protocolo.slice(-6).toLowerCase()}`,
    protocolo: seed.protocolo,
    senha_hash: seed.hash,
    empresa_id: seed.empresa,
    tipo: seed.tipo,
    relato: seed.relato,
    denunciado_nome: seed.denunciado_nome,
    denunciado_cargo: seed.denunciado_cargo,
    local_ocorrencia: seed.local_ocorrencia,
    etapa_atual: seed.etapas[seed.etapas.length - 1],
    status_conclusao: seed.conclusao?.status ?? "pendente",
    prazo_inicial,
    prazo_prorrogado: seed.prorrogado ? addDias(prazo_inicial, PRORROGACAO_DIAS) : undefined,
    data_conclusao: seed.conclusao ? historico[historico.length - 1].created_at : undefined,
    parecer_final: seed.conclusao?.parecer,
    anotacoes_internas: seed.anotacoes ?? "",
    anexos: [],
    historico,
    created_at,
  };
}

export function criarSeed(): AuraState {
  const denuncias = DENUNCIAS.map(montarDenuncia);
  return {
    versao: VERSAO_SEED,
    empresas: EMPRESAS,
    denuncias,
    certidoes: [
      { id: "cert-1", empresa_id: "emp-metalurgica", codigo: "CERT-AURA-2026-0001", data_emissao: diasAtras(118) },
      { id: "cert-2", empresa_id: "emp-supermercado", codigo: "CERT-AURA-2026-0002", data_emissao: diasAtras(74) },
    ],
    leads: [
      {
        id: "lead-1",
        razao_social: "Cerâmica São Judas Ltda.",
        cnpj: "56.789.012/0001-34",
        responsavel_nome: "Patrícia Gomes",
        responsavel_cargo: "Gerente de RH",
        email: "patricia@ceramicasaojudas.com.br",
        telefone: "(37) 99888-7777",
        qtd_funcionarios_faixa: "51 a 200",
        mensagem: "Recebemos notificação sobre a NR-01 e precisamos regularizar o canal.",
        created_at: diasAtras(1, 5),
      },
    ],
    notificacoes: denuncias
      .filter((d) => Date.now() - new Date(d.created_at).getTime() < 3 * 864e5)
      .map((d) => ({
        id: `not-${d.id}`,
        canal: "whatsapp" as const,
        conteudo: `Nova denúncia recebida — Protocolo ${d.protocolo}`,
        link: `/admin/denuncias/${d.id}`,
        lida: false,
        created_at: d.created_at,
      })),
  };
}
