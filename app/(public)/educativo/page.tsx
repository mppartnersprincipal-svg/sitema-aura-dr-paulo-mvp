import type { Metadata } from "next";
import Link from "next/link";
import { CabecalhoPagina } from "@/components/public/cabecalho-pagina";

export const metadata: Metadata = { title: "O que é assédio" };

const TEMAS = [
  {
    id: "assedio-moral",
    titulo: "Assédio moral",
    definicao:
      "Conduta abusiva e repetida — palavras, gestos ou atitudes — que humilha, constrange ou desestabiliza a pessoa no ambiente de trabalho.",
    exemplos: [
      "Gritar, xingar ou ridicularizar em público",
      "Dar tarefas impossíveis ou tirar todas as tarefas para isolar",
      "Ameaçar com demissão de forma constante",
      "Espalhar boatos ou excluir a pessoa do grupo",
    ],
  },
  {
    id: "assedio-sexual",
    titulo: "Assédio sexual",
    definicao:
      "Qualquer conduta de natureza sexual não desejada — verbal, física ou por mensagem — que constrange a pessoa no trabalho. Pode acontecer uma única vez.",
    exemplos: [
      "Comentários sobre o corpo ou a aparência",
      "Toques, abraços ou aproximações sem consentimento",
      "Convites insistentes ou mensagens de cunho sexual",
      "Promessa de vantagem em troca de favores",
    ],
  },
  {
    id: "discriminacao",
    titulo: "Discriminação",
    definicao:
      "Tratar alguém de forma diferente e prejudicial por causa de cor, raça, sexo, idade, religião, deficiência, orientação sexual, origem ou outra característica pessoal.",
    exemplos: [
      "Negar promoção ou treinamento por causa da idade",
      "Piadas sobre cor, religião ou orientação sexual",
      "Salário diferente para a mesma função",
      "Recusar adaptação para pessoa com deficiência",
    ],
  },
];

export default function Educativo() {
  return (
    <>
      <CabecalhoPagina
        sobretitulo="Educativo"
        titulo="Saber reconhecer é o primeiro passo."
        descricao="Nem sempre é fácil identificar quando uma situação passou do limite. Veja o que caracteriza cada tipo de conduta."
      >
        <nav aria-label="Temas" className="mt-8 flex flex-wrap gap-2">
          {TEMAS.map((t) => (
            <a key={t.id} href={`#${t.id}`} className="btn btn-secundario btn-sm">
              {t.titulo}
            </a>
          ))}
        </nav>
      </CabecalhoPagina>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        {TEMAS.map((t, i) => (
          <article key={t.id} id={t.id} className={`scroll-mt-24 ${i > 0 ? "mt-16 border-t border-linha pt-16" : ""}`}>
            <h2 className="titulo text-3xl">{t.titulo}</h2>
            <p className="mt-4 text-lg leading-relaxed text-texto">{t.definicao}</p>
            <h3 className="mt-8 text-sm font-semibold tracking-[0.12em] text-suave uppercase">Exemplos</h3>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {t.exemplos.map((e) => (
                <li key={e} className="cartao px-4 py-3 text-sm text-texto">
                  {e}
                </li>
              ))}
            </ul>
          </article>
        ))}

        <aside className="mt-16 rounded-2xl bg-tinta p-8 text-white">
          <h2 className="font-serif text-2xl">Passou por isso ou viu acontecer?</h2>
          <p className="mt-2 text-white/75">
            Você pode denunciar sem se identificar. Testemunhas também podem — e devem — usar o canal.
          </p>
          <Link href="/denuncia" className="btn btn-acao mt-6">
            Fazer uma denúncia anônima
          </Link>
        </aside>
        <p className="mt-6 text-xs text-suave">Conteúdo a ser revisado e complementado pelo Dr. Paulo.</p>
      </div>
    </>
  );
}
