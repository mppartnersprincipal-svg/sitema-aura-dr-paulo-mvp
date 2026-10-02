import type { Anexo, TipoDenuncia } from "@/lib/types";

export type Passo = "lgpd" | "empresa" | "tipo" | "relato" | "provas" | "confirmar" | "concluida";

export const PASSOS_VISIVEIS: { id: Passo; rotulo: string }[] = [
  { id: "empresa", rotulo: "Empresa" },
  { id: "tipo", rotulo: "Assunto" },
  { id: "relato", rotulo: "Relato" },
  { id: "provas", rotulo: "Provas" },
  { id: "confirmar", rotulo: "Enviar" },
];

export interface Rascunho {
  empresa_id?: string;
  tipo?: TipoDenuncia;
  relato: string;
  denunciado_nome: string;
  denunciado_cargo: string;
  local_ocorrencia: string;
  data_ocorrencia_aprox: string;
  anexos: Anexo[];
}

export const RASCUNHO_VAZIO: Rascunho = {
  relato: "",
  denunciado_nome: "",
  denunciado_cargo: "",
  local_ocorrencia: "",
  data_ocorrencia_aprox: "",
  anexos: [],
};
