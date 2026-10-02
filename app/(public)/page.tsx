import Link from "next/link";
import { ArrowRight, Check, EyeOff, FileCheck2, Scale, ShieldCheck, X } from "lucide-react";
import { MarcaSimbolo } from "@/components/marca";

const GARANTIAS = [
  {
    icone: EyeOff,
    titulo: "Anonimato de verdade",
    texto:
      "Não pedimos nome, e-mail nem telefone. Você recebe um protocolo e uma senha — só você sabe que a denúncia é sua.",
  },
  {
    icone: Scale,
    titulo: "Apuração imparcial",
    texto:
      "Quem recebe e investiga é um advogado independente, de fora da empresa. O RH e a diretoria não leem o seu relato.",
  },
  {
    icone: FileCheck2,
    titulo: "Registro auditável",
    texto:
      "Cada procedimento gera um documento arquivado por 5 anos, pronto para ser apresentado à Justiça do Trabalho.",
  },
];

const COMPARACAO = [
  ["Formulário que cai no e-mail do RH", "Terceiro imparcial recebe e apura"],
  ["Pede nome, e-mail ou telefone", "Anonimato total: só protocolo e senha"],
  ["Ninguém sabe o andamento", "Denunciante acompanha cada etapa"],
  ["Sem registro formal", "Procedimento em PDF arquivado por 5 anos"],
  ["Frágil numa ação trabalhista", "Procedimento estruturado e documentado"],
];

const ETAPAS_EXEMPLO = [
  { nome: "Recebida", estado: "feito" },
  { nome: "Triagem", estado: "feito" },
  { nome: "Em análise", estado: "feito" },
  { nome: "Investigação", estado: "atual" },
  { nome: "Concluída", estado: "futuro" },
] as const;

function CartaoProtocolo() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-tinta/5" aria-hidden="true" />
      <div className="absolute -top-4 -right-4 hidden rotate-3 rounded-xl border border-linha bg-white px-4 py-3 text-xs shadow-sm md:block">
        <span className="text-suave">Prazo legal</span>
        <p className="font-serif text-lg text-tinta">30 + 30 dias</p>
      </div>
      <div className="cartao p-6 shadow-xl shadow-tinta/10 sm:p-7">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-[0.16em] text-suave uppercase">Protocolo</span>
          <span className="rounded-full bg-acao-claro px-2.5 py-1 text-xs font-semibold text-acao-escuro">Anônima</span>
        </div>
        <p className="mt-2 font-mono text-2xl font-semibold tracking-wider text-tinta">AURA-2026-H4R7KM</p>
        <ol className="mt-6">
          {ETAPAS_EXEMPLO.map((e, i) => {
            const feito = e.estado === "feito";
            const atual = e.estado === "atual";
            const bolinha = feito
              ? "border-acao bg-acao text-white"
              : atual
                ? "border-acao bg-white"
                : "border-linha bg-white";
            const texto = atual ? "font-semibold text-tinta" : feito ? "text-texto" : "text-suave";
            return (
              <li key={e.nome} className="relative flex gap-4 pb-5 last:pb-0">
                {i < ETAPAS_EXEMPLO.length - 1 && (
                  <span
                    className={`absolute top-6 left-[11px] h-full w-0.5 ${feito ? "bg-acao" : "bg-linha"}`}
                    aria-hidden="true"
                  />
                )}
                <span className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${bolinha}`}>
                  {feito && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                  {atual && <span className="h-2 w-2 rounded-full bg-acao" />}
                </span>
                <span className={`text-sm ${texto}`}>
                  {e.nome}
                  {atual && <span className="ml-2 text-xs font-normal text-acao">em andamento</span>}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <MarcaSimbolo className="pointer-events-none absolute -top-24 -right-40 h-[34rem] w-[34rem] text-tinta/[0.035]" />
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <p className="sobretitulo">Canal independente · Lei 14.457/22 · NR-01</p>
            <h1 className="titulo mt-5 text-[2.6rem] leading-[1.05] sm:text-6xl">
              Um lugar seguro para falar.
              <span className="block text-tinta-700 italic">Uma apuração séria para resolver.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-suave">
              O AURA recebe denúncias de assédio, discriminação e irregularidades no trabalho de forma anônima — e
              entrega a apuração a um advogado independente, nunca ao RH da empresa.
            </p>
            <div className="mt-9 flex flex-col flex-wrap gap-3 sm:flex-row [&>a]:whitespace-nowrap">
              <Link href="/denuncia" className="btn btn-acao px-7 py-4 text-lg">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                Fazer uma denúncia
              </Link>
              <Link href="/para-empresas" className="btn btn-secundario px-7 py-4">
                Minha empresa precisa de um canal
              </Link>
            </div>
            <p className="mt-5 text-sm text-suave">
              Já denunciou?{" "}
              <Link href="/denuncia/acompanhar" className="font-semibold text-tinta underline underline-offset-4">
                Acompanhe pelo protocolo
              </Link>
            </p>
          </div>
          <CartaoProtocolo />
        </div>
      </section>

      <section className="border-y border-linha bg-white">
        <div className="mx-auto grid max-w-6xl px-4 sm:px-6 md:grid-cols-3">
          {GARANTIAS.map(({ icone: Icone, titulo, texto }, i) => (
            <div key={titulo} className={`py-10 md:px-8 ${i > 0 ? "md:border-l md:border-linha" : "md:pl-0"}`}>
              <Icone className="h-7 w-7 text-acao" aria-hidden="true" />
              <h2 className="titulo mt-4 text-2xl">{titulo}</h2>
              <p className="mt-2 leading-relaxed text-suave">{texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="sobretitulo">Por que um canal independente</p>
            <h2 className="titulo mt-4 text-4xl leading-tight">Canal caseiro não protege a empresa — nem o trabalhador.</h2>
            <p className="mt-5 leading-relaxed text-suave">
              Um formulário que manda e-mail para o RH coloca a denúncia nas mãos de quem é parte interessada. Sem
              imparcialidade, o procedimento perde valor justamente quando mais importa: diante de um juiz.
            </p>
            <Link href="/para-empresas" className="mt-7 inline-flex items-center gap-2 font-semibold text-tinta">
              Entenda a obrigação legal <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="cartao overflow-hidden">
            <div className="grid grid-cols-2 bg-papel-escuro text-xs font-semibold tracking-[0.12em] uppercase">
              <span className="px-5 py-3 text-suave">Canal caseiro</span>
              <span className="bg-tinta px-5 py-3 text-white">AURA</span>
            </div>
            {COMPARACAO.map(([ruim, bom]) => (
              <div key={bom} className="grid grid-cols-2 border-t border-linha text-sm">
                <span className="flex gap-2.5 px-5 py-4 text-suave">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-perigo" aria-hidden="true" />
                  {ruim}
                </span>
                <span className="flex gap-2.5 bg-tinta-100/40 px-5 py-4 font-medium text-tinta">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-acao" aria-hidden="true" />
                  {bom}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-tinta text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-4 py-16 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl">Sua empresa já está obrigada a ter um canal.</h2>
            <p className="mt-3 max-w-2xl text-white/70">
              Implantação em poucos dias, cartaz com QR Code para os funcionários e Certidão de Implementação para
              comprovar a conformidade.
            </p>
          </div>
          <Link href="/para-empresas#contato" className="btn btn-acao shrink-0 px-7 py-4">
            Solicitar proposta
          </Link>
        </div>
      </section>
    </>
  );
}
