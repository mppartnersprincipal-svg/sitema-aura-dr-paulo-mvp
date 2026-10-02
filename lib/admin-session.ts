"use client";

import { useSyncExternalStore } from "react";
import { ADMIN_DEMO } from "./config";

// Sessão fictícia do painel. Em produção: Supabase Auth com cookie httpOnly (PRD §5.1).
// Fica no localStorage para valer também nas abas abertas pelos documentos (PDF, certidão, cartaz).
const CHAVE = "aura-admin-sessao";
const listeners = new Set<() => void>();

function ler(): boolean {
  try {
    return localStorage.getItem(CHAVE) === "1";
  } catch {
    return false;
  }
}

function notificar() {
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  const aoMudarOutraAba = (e: StorageEvent) => {
    if (e.key === CHAVE) notificar();
  };
  window.addEventListener("storage", aoMudarOutraAba);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", aoMudarOutraAba);
  };
}

export function entrarAdmin(email: string, senha: string): boolean {
  const ok = email.trim().toLowerCase() === ADMIN_DEMO.email && senha === ADMIN_DEMO.senha;
  if (!ok) return false;
  try {
    localStorage.setItem(CHAVE, "1");
  } catch {
    return false;
  }
  notificar();
  return true;
}

export function sairAdmin() {
  try {
    localStorage.removeItem(CHAVE);
  } finally {
    notificar();
  }
}

/** true/false no navegador; null na renderização do servidor. */
export function useAdminLogado(): boolean | null {
  return useSyncExternalStore(subscribe, ler, () => null);
}
