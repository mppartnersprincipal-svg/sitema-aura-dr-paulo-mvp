import { CabecalhoPagina } from "./cabecalho-pagina";

type Props = {
  titulo: string;
  secoes: { titulo: string; texto: string }[];
};

export function DocumentoLegal({ titulo, secoes }: Props) {
  return (
    <>
      <CabecalhoPagina sobretitulo="Documento legal" titulo={titulo} />
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <p className="rounded-xl border border-alerta/30 bg-alerta-claro px-5 py-4 text-sm text-alerta">
          Modelo provisório. O texto definitivo será redigido e revisado pelo Dr. Paulo antes da publicação.
        </p>
        {secoes.map((s, i) => (
          <section key={s.titulo} className="mt-10">
            <h2 className="titulo text-xl">
              {i + 1}. {s.titulo}
            </h2>
            <p className="mt-3 leading-relaxed text-texto">{s.texto}</p>
          </section>
        ))}
      </div>
    </>
  );
}
