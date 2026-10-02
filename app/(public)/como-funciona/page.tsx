import type { Metadata } from "next";
import Link from "next/link";
import { Building2, KeyRound, MessageSquareText, Search } from "lucide-react";
import { CabecalhoPagina } from "@/components/public/cabecalho-pagina";
import { ETAPA_DESCRICAO, ETAPA_LABEL, ETAPAS_FLUXO } from "@/lib/format";

export const metadata: Metadata = { title: "Como funciona" };

const PASSOS = [
  {
    icone: Building2,
    titulo: "Escolha a empresa",
    texto: "Toque no logo da empresa onde aconteceu. Não precisa digitar nada.",
  },
  {
    icone: MessageSquareText,
    titulo: "Conte o que aconteceu",
    texto: "Escolha o tipo e escreva com suas palavras. Se quiser, envie fotos, áudios ou documentos.",
  },
  {
    icone: KeyRound,
    titulo: "Guarde o protocolo e a senha",
    texto: "O sistema mostra um protocolo e uma senha uma única vez. Anote ou salve o comprovante.",
  },
  {
    icone: Search,
    titulo: "Acompanhe o andamento",
    texto: "Volte quando quiser, informe o protocolo e a senha e veja em que etapa está a apuração.",
  },
];

export default function ComoFunciona() {
  return (
    <>
      <CabecalhoPagina
        sobretitulo="Como funciona"
        titulo="Quatro passos. Nenhum dado seu."
        descricao="O canal foi pensado para qualquer pessoa conseguir usar — pelo celular, em poucos minutos, sem cadastro."
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {PASSOS.map(({ icone: Icone, titulo, texto }, i) => (
            <li key={titulo} className="cartao relative p-6">
              <span className="font-serif text-5xl text-tinta/10" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Icone className="mt-2 h-8 w-8 text-acao" aria-hidden="true" />
              <h2 className="mt-4 text-lg font-semibold text-tinta">{titulo}</h2>
              <p className="mt-2 text-sm leading-relaxed text-suave">{texto}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/denuncia" className="btn btn-acao">
            Fazer uma denúncia agora
          </Link>
          <Link href="/denuncia/acompanhar" className="btn btn-secundario">
            Já tenho protocolo
          </Link>
        </div>
      </section>

      <section className="border-t border-linha bg-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <p className="sobretitulo">Depois do envio</p>
            <h2 className="titulo mt-4 text-3xl">O que acontece com a sua denúncia</h2>
            <p className="mt-4 leading-relaxed text-suave">
              A apuração tem prazo de <strong className="text-tinta">30 dias</strong>, que pode ser prorrogado por
              mais 30 quando o caso exige mais provas. Cada mudança de etapa aparece para você no acompanhamento.
            </p>
          </div>
          <ol className="space-y-px overflow-hidden rounded-2xl border border-linha bg-linha">
            {ETAPAS_FLUXO.map((etapa, i) => (
              <li key={etapa} className="flex gap-5 bg-papel px-5 py-4">
                <span className="w-6 shrink-0 font-serif text-lg text-ouro">{i + 1}</span>
                <div>
                  <h3 className="font-semibold text-tinta">{ETAPA_LABEL[etapa]}</h3>
                  <p className="text-sm text-suave">{ETAPA_DESCRICAO[etapa]}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
