"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { EmpresaAvatar } from "@/components/empresa-avatar";
import type { Empresa } from "@/lib/types";

type Props = {
  empresas: Empresa[];
  selecionada?: string;
  onEscolher: (id: string) => void;
};

function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function PassoEmpresa({ empresas, selecionada, onEscolher }: Props) {
  const [busca, setBusca] = useState("");
  const termo = normalizar(busca.trim());
  const filtradas = empresas.filter((e) => !termo || normalizar(`${e.nome_fantasia} ${e.nome}`).includes(termo));

  return (
    <section aria-labelledby="titulo-empresa">
      <h1 id="titulo-empresa" className="titulo text-3xl">
        Onde aconteceu?
      </h1>
      <p className="mt-2 text-lg text-suave">Toque na empresa.</p>

      {empresas.length > 6 && (
        <div className="relative mt-6">
          <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-suave" aria-hidden="true" />
          <input
            type="search"
            className="campo pl-12"
            placeholder="Procurar pelo nome"
            aria-label="Procurar empresa pelo nome"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      )}

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {filtradas.map((e) => {
          const ativa = e.id === selecionada;
          return (
            <li key={e.id}>
              <button
                type="button"
                onClick={() => onEscolher(e.id)}
                aria-pressed={ativa}
                className={`flex w-full items-center gap-4 rounded-2xl border-2 bg-white p-4 text-left transition-colors hover:border-acao focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-tinta-700 ${
                  ativa ? "border-acao" : "border-linha"
                }`}
              >
                <EmpresaAvatar empresa={e} tamanho="lg" />
                <span>
                  <span className="block text-lg font-semibold text-tinta">{e.nome_fantasia}</span>
                  <span className="text-sm text-suave">
                    {e.cidade}/{e.estado}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {filtradas.length === 0 && (
        <p className="mt-6 rounded-xl bg-white p-5 text-suave">
          Nenhuma empresa encontrada. Confira o nome ou peça o link/QR Code do canal no seu local de trabalho.
        </p>
      )}
    </section>
  );
}
