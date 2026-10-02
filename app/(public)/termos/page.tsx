import type { Metadata } from "next";
import { DocumentoLegal } from "@/components/public/documento-legal";

export const metadata: Metadata = { title: "Termos de uso" };

const SECOES = [
  {
    titulo: "Objeto",
    texto:
      "Estes termos regulam o uso do canal de denúncias AURA, serviço independente destinado ao recebimento e apuração de relatos de assédio, discriminação e irregularidades nas relações de trabalho das empresas contratantes.",
  },
  {
    titulo: "Uso de boa-fé",
    texto:
      "O canal deve ser utilizado de boa-fé. Relatos sabidamente falsos podem configurar ilícito. O anonimato do denunciante é preservado em qualquer hipótese.",
  },
  {
    titulo: "Protocolo e senha",
    texto:
      "O protocolo e a senha são gerados pelo sistema e exibidos uma única vez. Não há recuperação por e-mail ou telefone, pois nenhum dado de contato é coletado.",
  },
  {
    titulo: "Apuração",
    texto:
      "A apuração é conduzida por advogado independente, no prazo de 30 dias, prorrogável por igual período, com emissão de parecer ao final.",
  },
];

export default function Termos() {
  return <DocumentoLegal titulo="Termos de uso" secoes={SECOES} />;
}
