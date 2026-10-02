import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import { CabecalhoPagina } from "@/components/public/cabecalho-pagina";

export const metadata: Metadata = { title: "Perguntas frequentes" };

const GRUPOS = [
  {
    titulo: "Para quem vai denunciar",
    perguntas: [
      [
        "A empresa vai saber que fui eu?",
        "Não. O canal não pede nome, e-mail, telefone ou qualquer dado seu. A empresa não tem acesso ao sistema e não lê o relato — quem recebe é um advogado independente.",
      ],
      [
        "Preciso saber escrever bem?",
        "Não. Escreva do seu jeito. O importante é contar o que aconteceu, onde e, se souber, quem estava envolvido.",
      ],
      [
        "E se eu perder o protocolo ou a senha?",
        "Por segurança, eles não podem ser recuperados — é isso que garante o seu anonimato. Se perder, você pode fazer uma nova denúncia informando que já denunciou antes.",
      ],
      [
        "Posso denunciar algo que vi acontecer com outra pessoa?",
        "Sim. Testemunhas, ex-funcionários e prestadores de serviço também podem usar o canal.",
      ],
      [
        "Quanto tempo demora?",
        "A apuração tem prazo de 30 dias, prorrogável por mais 30. Você acompanha cada etapa pelo protocolo.",
      ],
    ],
  },
  {
    titulo: "Para empresas",
    perguntas: [
      [
        "A empresa tem acesso às denúncias?",
        "Não ao conteúdo. A empresa recebe as recomendações resultantes da apuração e a Certidão de Implementação do canal, preservando a imparcialidade exigida.",
      ],
      [
        "Quanto tempo leva a implantação?",
        "Até 5 dias úteis: cadastro da empresa, entrega dos cartazes com QR Code e emissão da certidão.",
      ],
      [
        "O procedimento serve como prova em processo?",
        "Cada caso encerrado gera um procedimento documentado em PDF, arquivado por 5 anos, que pode ser apresentado à Justiça do Trabalho.",
      ],
    ],
  },
];

export default function PerguntasFrequentes() {
  return (
    <>
      <CabecalhoPagina sobretitulo="Dúvidas" titulo="Perguntas frequentes" />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        {GRUPOS.map((g) => (
          <section key={g.titulo} className="mb-14 last:mb-0">
            <h2 className="titulo mb-5 text-2xl">{g.titulo}</h2>
            <div className="cartao divide-y divide-linha">
              {g.perguntas.map(([pergunta, resposta]) => (
                <details key={pergunta} className="group px-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-semibold text-tinta">
                    {pergunta}
                    <ChevronDown className="h-5 w-5 shrink-0 text-suave transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="pb-5 leading-relaxed text-suave">{resposta}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
