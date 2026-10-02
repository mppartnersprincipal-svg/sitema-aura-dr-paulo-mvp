// Demonstração do rate limit (PRD §1.3: 5 tentativas por hora).
// Em produção isso fica no servidor, por hash de IP com expiração.
const CHAVE = "aura-tentativas-acompanhamento";
export const MAX_TENTATIVAS = 5;
const JANELA_MS = 60 * 60 * 1000;

function ler(): number[] {
  try {
    const bruto = sessionStorage.getItem(CHAVE);
    const lista = bruto ? (JSON.parse(bruto) as number[]) : [];
    return lista.filter((t) => Date.now() - t < JANELA_MS);
  } catch {
    return [];
  }
}

export function tentativasRestantes(): number {
  return Math.max(0, MAX_TENTATIVAS - ler().length);
}

export function registrarFalha(): number {
  const lista = [...ler(), Date.now()];
  try {
    sessionStorage.setItem(CHAVE, JSON.stringify(lista));
  } catch {
    // sem sessionStorage o limite simplesmente não é aplicado nesta demo
  }
  return Math.max(0, MAX_TENTATIVAS - lista.length);
}
