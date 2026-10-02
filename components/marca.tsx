type Props = {
  variante?: "escura" | "clara";
  compacta?: boolean;
};

export function MarcaSimbolo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <circle cx="20" cy="20" r="12.5" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7" />
      <path d="M20 11.5 L27 15 V21 C27 25.2 24 28 20 29.5 C16 28 13 25.2 13 21 V15 Z" fill="currentColor" />
      <path
        d="M17 20.5 L19.3 22.8 L23.5 18"
        fill="none"
        stroke="var(--color-papel)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Marca({ variante = "escura", compacta = false }: Props) {
  const cor = variante === "escura" ? "text-tinta" : "text-white";
  return (
    <span className={`inline-flex items-center gap-2.5 ${cor}`}>
      <MarcaSimbolo />
      <span className="flex flex-col leading-none">
        <span className="font-serif text-xl font-semibold tracking-[0.2em]">AURA</span>
        {!compacta && (
          <span className="mt-1 text-[10px] font-medium tracking-[0.16em] uppercase opacity-70">
            Canal de Denúncias
          </span>
        )}
      </span>
    </span>
  );
}
