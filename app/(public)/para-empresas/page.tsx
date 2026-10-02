import type { Metadata } from "next";
import { Award, FileText, GraduationCap, QrCode, Scale, ShieldCheck } from "lucide-react";
import { CabecalhoPagina } from "@/components/public/cabecalho-pagina";
import { LeadForm } from "@/components/public/lead-form";

export const metadata: Metadata = { title: "Para empresas" };

const INCLUSO = [
  { icone: ShieldCheck, titulo: "Canal anônimo 24h", texto: "Acesso por celular ou computador, sem cadastro do funcionário." },
  { icone: QrCode, titulo: "Cartaz com QR Code", texto: "Material pronto para afixar no refeitório, vestiário e recepção." },
  { icone: Scale, titulo: "Apuração por advogado", texto: "Triagem, investigação e parecer conduzidos por terceiro imparcial." },
  { icone: FileText, titulo: "Procedimento em PDF", texto: "Cada caso encerrado fica arquivado por 5 anos, pronto para auditoria." },
  { icone: Award, titulo: "Certidão de Implementação", texto: "Documento que comprova a existência do canal em fiscalizações." },
  { icone: GraduationCap, titulo: "Material educativo", texto: "Cartilha sobre assédio e discriminação para os colaboradores." },
];

const FUNDAMENTOS = [
  {
    norma: "Lei 14.457/2022",
    texto:
      "Empresas com CIPA devem adotar procedimentos para recebimento e acompanhamento de denúncias de assédio sexual e outras formas de violência, com apuração dos fatos e aplicação de sanções.",
  },
  {
    norma: "NR-01",
    texto:
      "O Gerenciamento de Riscos Ocupacionais passa a incluir os fatores de risco psicossociais — assédio e pressão abusiva entre eles.",
  },
  {
    norma: "LGPD",
    texto:
      "O tratamento de dados no canal segue o princípio da necessidade: nada é coletado sobre o denunciante além do relato.",
  },
];

export default function ParaEmpresas() {
  return (
    <>
      <CabecalhoPagina
        sobretitulo="Para empresas"
        titulo="Conformidade legal sem colocar o RH no meio do conflito."
        descricao="O AURA é um canal de denúncias terceirizado: sua empresa cumpre a obrigação legal e as denúncias são apuradas por quem não tem interesse no resultado."
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="sobretitulo">A obrigação</p>
            <h2 className="titulo mt-4 text-3xl">O que a lei exige da sua empresa</h2>
            <p className="mt-4 leading-relaxed text-suave">
              A exigência voltou a vigorar em setembro de 2026. Um canal que encaminha denúncias para o próprio RH não
              garante imparcialidade e fragiliza a defesa da empresa em eventual ação trabalhista.
            </p>
          </div>
          <dl className="grid gap-4">
            {FUNDAMENTOS.map((f) => (
              <div key={f.norma} className="cartao grid gap-1 p-5 sm:grid-cols-[9rem_1fr] sm:gap-5">
                <dt className="font-serif text-lg font-semibold text-tinta">{f.norma}</dt>
                <dd className="text-sm leading-relaxed text-suave">{f.texto}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-y border-linha bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="sobretitulo">O que está incluído</p>
          <h2 className="titulo mt-4 text-3xl">Um serviço completo, não só um formulário</h2>
          <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {INCLUSO.map(({ icone: Icone, titulo, texto }) => (
              <li key={titulo} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-tinta-100 text-tinta">
                  <Icone className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-semibold text-tinta">{titulo}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-suave">{texto}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="contato" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <p className="sobretitulo">Planos</p>
            <h2 className="titulo mt-4 text-3xl">Mensalidade fixa por empresa, conforme o porte.</h2>
            <p className="mt-4 leading-relaxed text-suave">
              Implantação, cartazes, apuração dos casos e certidão estão incluídos. Envie seus dados e receba uma
              proposta personalizada.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-texto">
              <li>✓ Sem fidelidade mínima</li>
              <li>✓ Implantação em até 5 dias úteis</li>
              <li>✓ Atendimento em Divinópolis e região</li>
            </ul>
          </div>
          <LeadForm />
        </div>
      </section>
    </>
  );
}
