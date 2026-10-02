import type { Metadata } from "next";
import { DocumentoLegal } from "@/components/public/documento-legal";

export const metadata: Metadata = { title: "Política de privacidade" };

const SECOES = [
  {
    titulo: "Dados coletados",
    texto:
      "O canal não solicita nome, e-mail, telefone, CPF ou qualquer dado de identificação do denunciante. São tratados apenas o relato, as informações opcionais sobre o fato e os arquivos que o próprio denunciante decidir enviar.",
  },
  {
    titulo: "Registros técnicos",
    texto:
      "Provedores de infraestrutura podem registrar dados técnicos de conexão (como endereço IP) por curto período, para segurança do serviço. Esses registros não são associados à denúncia.",
  },
  {
    titulo: "Arquivos enviados",
    texto:
      "Fotos e documentos podem conter informações ocultas (metadados), como localização e modelo do aparelho. Recomendamos removê-las antes do envio.",
  },
  {
    titulo: "Retenção",
    texto:
      "Os procedimentos encerrados são mantidos por 5 anos, prazo prescricional trabalhista, e depois anonimizados ou eliminados.",
  },
  {
    titulo: "Base legal",
    texto:
      "O tratamento observa a Lei 13.709/2018 (LGPD), com fundamento no cumprimento de obrigação legal pela empresa contratante (Lei 14.457/2022).",
  },
];

export default function Privacidade() {
  return <DocumentoLegal titulo="Política de privacidade" secoes={SECOES} />;
}
