"use client";

import { useState } from "react";
import { EyeOff, FileLock2, KeyRound, Scale } from "lucide-react";

const PONTOS = [
  { icone: EyeOff, texto: "Não vamos pedir seu nome, e-mail, telefone ou documento." },
  { icone: Scale, texto: "Quem lê é um advogado independente. A empresa não tem acesso ao que você escrever." },
  { icone: KeyRound, texto: "No final você recebe um protocolo e uma senha para acompanhar o caso." },
  { icone: FileLock2, texto: "Guardamos só o que você escrever ou enviar, pelo tempo exigido em lei (LGPD)." },
];

export function PassoLgpd({ onIniciar }: { onIniciar: () => void }) {
  const [aceito, setAceito] = useState(false);
  return (
    <section aria-labelledby="titulo-lgpd">
      <p className="sobretitulo">Antes de começar</p>
      <h1 id="titulo-lgpd" className="titulo mt-3 text-4xl">
        Sua denúncia é anônima.
      </h1>
      <ul className="mt-8 space-y-4">
        {PONTOS.map(({ icone: Icone, texto }) => (
          <li key={texto} className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-acao-claro text-acao">
              <Icone className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="pt-2.5 text-lg leading-snug text-texto">{texto}</span>
          </li>
        ))}
      </ul>

      <label className="mt-10 flex cursor-pointer items-start gap-3 rounded-xl border border-linha bg-white p-4">
        <input
          type="checkbox"
          checked={aceito}
          onChange={(e) => setAceito(e.target.checked)}
          className="mt-1 h-5 w-5 shrink-0 accent-acao"
        />
        <span className="text-sm leading-relaxed text-texto">
          Li e concordo com o tratamento das informações que eu fornecer, conforme a{" "}
          <a href="/privacidade" target="_blank" className="font-semibold underline underline-offset-2">
            Política de Privacidade
          </a>
          .
        </span>
      </label>

      <button type="button" className="btn btn-acao mt-6 w-full py-4 text-lg" disabled={!aceito} onClick={onIniciar}>
        Iniciar denúncia
      </button>
    </section>
  );
}
