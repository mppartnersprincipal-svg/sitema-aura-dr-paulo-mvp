type Props = {
  sobretitulo: string;
  titulo: string;
  descricao?: string;
  children?: React.ReactNode;
};

export function CabecalhoPagina({ sobretitulo, titulo, descricao, children }: Props) {
  return (
    <section className="border-b border-linha bg-papel-escuro/60">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
        <p className="sobretitulo">{sobretitulo}</p>
        <h1 className="titulo mt-4 max-w-3xl text-4xl leading-[1.1] md:text-5xl">{titulo}</h1>
        {descricao && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-suave">{descricao}</p>}
        {children}
      </div>
    </section>
  );
}
