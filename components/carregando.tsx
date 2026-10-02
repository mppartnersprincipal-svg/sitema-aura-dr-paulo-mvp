export function Carregando({ texto = "Carregando…" }: { texto?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-24 text-suave">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-linha border-t-tinta" aria-hidden="true" />
      {texto}
    </div>
  );
}
