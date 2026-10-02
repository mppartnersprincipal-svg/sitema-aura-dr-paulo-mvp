import Link from "next/link";
import { Marca } from "@/components/marca";
import { CANAL } from "@/lib/config";

const COLUNAS = [
  {
    titulo: "Denunciante",
    links: [
      { href: "/denuncia", label: "Fazer uma denúncia" },
      { href: "/denuncia/acompanhar", label: "Acompanhar denúncia" },
      { href: "/como-funciona", label: "Como funciona" },
      { href: "/educativo", label: "O que é assédio?" },
    ],
  },
  {
    titulo: "Empresas",
    links: [
      { href: "/para-empresas", label: "Contratar o canal" },
      { href: "/perguntas-frequentes", label: "Perguntas frequentes" },
      { href: "/admin/login", label: "Acesso do apurador" },
    ],
  },
  {
    titulo: "Legal",
    links: [
      { href: "/termos", label: "Termos de uso" },
      { href: "/privacidade", label: "Política de privacidade" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-tinta text-white/75">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Marca variante="clara" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed">
            Canal de denúncias independente. As denúncias são recebidas e apuradas por advogado externo à empresa,
            com anonimato garantido ao denunciante.
          </p>
        </div>
        {COLUNAS.map((c) => (
          <div key={c.titulo}>
            <h2 className="text-xs font-semibold tracking-[0.16em] text-white uppercase">{c.titulo}</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs sm:flex-row sm:justify-between sm:px-6">
          <span>
            {CANAL.razaoSocial} · CNPJ {CANAL.cnpj} · {CANAL.cidade}
          </span>
          <span>Em conformidade com a Lei 14.457/2022, NR-01 e LGPD</span>
        </div>
      </div>
    </footer>
  );
}
