import { iniciais } from "@/lib/format";
import type { Empresa } from "@/lib/types";

type Props = {
  empresa: Pick<Empresa, "nome_fantasia" | "logo_url" | "cor">;
  tamanho?: "sm" | "md" | "lg";
};

const TAMANHOS = {
  sm: "h-9 w-9 text-xs rounded-lg",
  md: "h-14 w-14 text-base rounded-xl",
  lg: "h-20 w-20 text-2xl rounded-2xl",
};

export function EmpresaAvatar({ empresa, tamanho = "md" }: Props) {
  const classe = `${TAMANHOS[tamanho]} shrink-0 overflow-hidden`;
  if (empresa.logo_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- logo em data URL vinda do cadastro
      <img src={empresa.logo_url} alt={`Logo ${empresa.nome_fantasia}`} className={`${classe} bg-white object-contain`} />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`${classe} flex items-center justify-center font-serif font-semibold text-white`}
      style={{ backgroundColor: empresa.cor }}
    >
      {iniciais(empresa.nome_fantasia)}
    </span>
  );
}
