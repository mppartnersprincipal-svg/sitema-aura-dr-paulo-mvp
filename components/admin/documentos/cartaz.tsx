"use client";

import { QRCodeSVG } from "qrcode.react";
import { EyeOff, Scale, Smartphone } from "lucide-react";
import { MarcaSimbolo } from "@/components/marca";
import { useAura } from "@/lib/store";
import { BarraImpressao, Folha, NaoEncontrado } from "./folha";

const PASSOS = [
  { icone: Smartphone, texto: "Aponte a câmera do celular para o código" },
  { icone: EyeOff, texto: "Conte o que aconteceu. Não precisa se identificar" },
  { icone: Scale, texto: "Um advogado independente vai apurar" },
];

export function PaginaCartaz({ id }: { id: string }) {
  const estado = useAura();
  if (!estado) return null;
  const empresa = estado.empresas.find((e) => e.id === id);
  if (!empresa) return <NaoEncontrado texto="Empresa não encontrada." />;
  const url = `${window.location.origin}/denuncia?empresa=${empresa.slug}`;

  return (
    <>
      <BarraImpressao titulo={`Cartaz · ${empresa.nome_fantasia}`} />
      <Folha>
        <div className="flex min-h-[250mm] flex-col items-center text-center">
          <div className="flex items-center gap-3 text-tinta">
            <MarcaSimbolo className="h-12 w-12" />
            <span className="font-serif text-3xl font-semibold tracking-[0.2em]">AURA</span>
          </div>
          <p className="mt-2 text-xs font-semibold tracking-[0.3em] text-ouro uppercase">Canal de Denúncias</p>

          <h1 className="mt-12 font-serif text-[44px] leading-[1.05] font-semibold text-tinta">
            Sofreu ou viu assédio
            <br />
            no trabalho?
          </h1>
          <p className="mt-5 max-w-md text-lg text-suave">
            Denuncie de forma <strong className="text-tinta">anônima e segura</strong>. A empresa não sabe quem denunciou.
          </p>

          <div className="mt-10 rounded-3xl border-4 border-tinta p-5">
            <QRCodeSVG value={url} size={240} fgColor="#0e2238" />
          </div>
          <p className="mt-4 font-mono text-xs break-all text-suave">{url}</p>

          <ol className="mt-12 grid w-full grid-cols-3 gap-6">
            {PASSOS.map(({ icone: Icone, texto }, i) => (
              <li key={texto} className="flex flex-col items-center gap-2">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-tinta text-white">
                  <Icone className="h-7 w-7" aria-hidden="true" />
                </span>
                <span className="font-serif text-lg text-ouro">{i + 1}</span>
                <span className="text-sm leading-snug text-tinta">{texto}</span>
              </li>
            ))}
          </ol>

          <p className="mt-auto pt-10 text-sm text-suave">
            Canal oficial de <strong className="text-tinta">{empresa.nome_fantasia}</strong> · Lei 14.457/2022 · NR-01
          </p>
        </div>
      </Folha>
    </>
  );
}
