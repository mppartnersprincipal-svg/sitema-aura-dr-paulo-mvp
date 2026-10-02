// Na versão de produção o hash será argon2id no servidor (PRD §6.4).
// Nesta demonstração usamos SHA-256 do navegador, com o protocolo como "sal".
const PROTOCOLO_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const SENHA_ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789";

function aleatorio(alfabeto: string, tamanho: number): string {
  const bytes = new Uint8Array(tamanho);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alfabeto[b % alfabeto.length]).join("");
}

export function gerarId(): string {
  return crypto.randomUUID();
}

export function gerarProtocolo(): string {
  return `AURA-${new Date().getFullYear()}-${aleatorio(PROTOCOLO_ALPHABET, 6)}`;
}

export function gerarSenha(): string {
  return aleatorio(SENHA_ALPHABET, 10);
}

export async function hashSenha(protocolo: string, senha: string): Promise<string> {
  const dados = new TextEncoder().encode(`${protocolo}:${senha}`);
  const digest = await crypto.subtle.digest("SHA-256", dados);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

export function normalizarProtocolo(valor: string): string {
  return valor.trim().toUpperCase().replace(/\s+/g, "");
}
