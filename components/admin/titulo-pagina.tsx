type Props = {
  titulo: string;
  descricao?: string;
  acoes?: React.ReactNode;
};

export function TituloPagina({ titulo, descricao, acoes }: Props) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="titulo text-3xl">{titulo}</h1>
        {descricao && <p className="mt-1 text-suave">{descricao}</p>}
      </div>
      {acoes && <div className="flex flex-wrap gap-2">{acoes}</div>}
    </div>
  );
}
