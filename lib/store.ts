"use client";

import { useSyncExternalStore } from "react";
import { criarSeed, VERSAO_SEED } from "./seed";
import type { AuraState } from "./types";

// Armazenamento da demonstração: tudo fica no localStorage deste navegador.
// Abas diferentes ficam sincronizadas pelo evento "storage" — dá para fazer
// a denúncia numa aba e ver chegar no painel admin em outra.
const STORAGE_KEY = "aura-demo-v1";

let cache: AuraState | null = null;
const listeners = new Set<() => void>();

function persistir(estado: AuraState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
    return true;
  } catch {
    return false;
  }
}

function carregar(): AuraState {
  if (cache) return cache;
  try {
    const bruto = localStorage.getItem(STORAGE_KEY);
    const salvo = bruto ? (JSON.parse(bruto) as AuraState) : null;
    cache = salvo && salvo.versao === VERSAO_SEED ? salvo : criarSeed();
    if (cache !== salvo) persistir(cache);
  } catch {
    cache = criarSeed();
  }
  return cache;
}

function notificar() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const aoMudarOutraAba = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    cache = null;
    notificar();
  };
  window.addEventListener("storage", aoMudarOutraAba);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", aoMudarOutraAba);
  };
}

/** Aplica uma alteração imutável. Retorna false se o navegador recusou salvar (cota cheia). */
export function atualizar(fn: (estado: AuraState) => AuraState): boolean {
  const proximo = fn(carregar());
  const ok = persistir(proximo);
  if (ok) {
    cache = proximo;
    notificar();
  }
  return ok;
}

export function lerEstado(): AuraState {
  return carregar();
}

export function resetarDemo() {
  cache = criarSeed();
  persistir(cache);
  notificar();
}

/** Estado atual, ou null durante a renderização no servidor. */
export function useAura(): AuraState | null {
  return useSyncExternalStore(subscribe, carregar, () => null);
}
