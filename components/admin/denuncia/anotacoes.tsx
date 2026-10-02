"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { salvarAnotacoes } from "@/lib/actions";

export function AnotacoesInternas({ denunciaId, texto }: { denunciaId: string; texto: string }) {
  const [valor, setValor] = useState(texto);
  const [salvo, setSalvo] = useState(false);
  const alterado = valor !== texto;

  function handleSalvar() {
    if (salvarAnotacoes(denunciaId, valor)) setSalvo(true);
  }

  return (
    <section className="cartao p-5">
      <h2 className="flex items-center gap-2 font-semibold text-tinta">
        <Lock className="h-4 w-4 text-alerta" aria-hidden="true" />
        Anotações internas
      </h2>
      <textarea
        rows={5}
        className="campo mt-3 text-sm"
        placeholder="Visível somente para o apurador."
        aria-label="Anotações internas"
        value={valor}
        onChange={(e) => {
          setValor(e.target.value);
          setSalvo(false);
        }}
      />
      <div className="mt-3 flex items-center gap-3">
        <button type="button" className="btn btn-secundario btn-sm" disabled={!alterado} onClick={handleSalvar}>
          Salvar anotações
        </button>
        {salvo && !alterado && <span className="text-xs text-acao">✓ Salvo</span>}
      </div>
    </section>
  );
}
