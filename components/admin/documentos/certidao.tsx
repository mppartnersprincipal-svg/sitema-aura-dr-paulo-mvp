"use client";

import { QRCodeSVG } from "qrcode.react";
import { Marca } from "@/components/marca";
import { CANAL } from "@/lib/config";
import { formatDataExtenso } from "@/lib/format";
import { useAura } from "@/lib/store";
import { BarraImpressao, Folha, NaoEncontrado } from "./folha";

const GARANTIAS = [
  "recebimento de denúncias por canal acessível, com possibilidade de anonimato integral do denunciante;",
  "apuração conduzida por profissional independente, sem acesso da empresa ao conteúdo das denúncias;",
  "acompanhamento do procedimento pelo denunciante mediante protocolo e senha;",
  "prazo de apuração de 30 dias, prorrogável por igual período, com emissão de parecer;",
  "arquivamento dos procedimentos pelo prazo de 5 anos.",
];

export function PaginaCertidao({ id }: { id: string }) {
  const estado = useAura();
  if (!estado) return null;
  const certidao = estado.certidoes.find((c) => c.id === id);
  const empresa = estado.empresas.find((e) => e.id === certidao?.empresa_id);
  if (!certidao || !empresa) return <NaoEncontrado texto="Certidão não encontrada." />;
  const urlCanal = `${window.location.origin}/denuncia?empresa=${empresa.slug}`;

  return (
    <>
      <BarraImpressao titulo={`Certidão ${certidao.codigo}`} />
      <Folha>
        <div className="border-[3px] border-double border-ouro p-10">
          <div className="flex justify-center">
            <Marca />
          </div>
          <p className="mt-10 text-center text-[11px] font-semibold tracking-[0.3em] text-ouro uppercase">Certidão</p>
          <h1 className="mt-2 text-center font-serif text-[26px] leading-tight font-semibold text-tinta">
            Implementação de Canal de Denúncias
          </h1>
          <p className="mt-1 text-center font-mono text-xs text-suave">{certidao.codigo}</p>

          <p className="mt-10 text-justify text-[14px] leading-7">
            <strong>{CANAL.razaoSocial}</strong>, inscrita no CNPJ sob o nº {CANAL.cnpj}, <strong>CERTIFICA</strong>, para os
            devidos fins, que a empresa <strong>{empresa.nome}</strong>, nome fantasia {empresa.nome_fantasia}, inscrita no
            CNPJ sob o nº <strong>{empresa.cnpj}</strong>, com sede em {empresa.endereco}, {empresa.cidade}/{empresa.estado},
            mantém implementado, desde {formatDataExtenso(empresa.data_contratacao)}, canal de denúncias independente
            operado por esta certificadora, em atendimento à Lei nº 14.457/2022 e à Norma Regulamentadora nº 01, que
            assegura:
          </p>
          <ul className="mt-4 list-disc space-y-1.5 pl-6 text-[13.5px]">
            {GARANTIAS.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>

          <div className="mt-12 flex items-end justify-between gap-8">
            <div className="flex items-end gap-4">
              <QRCodeSVG value={urlCanal} size={84} fgColor="#0e2238" />
              <p className="max-w-40 text-[10px] leading-snug text-suave">Acesso ao canal de denúncias da empresa</p>
            </div>
            <div className="text-center">
              <p className="text-[12px] text-suave">Divinópolis/MG, {formatDataExtenso(certidao.data_emissao)}.</p>
              <p className="mt-8 font-serif text-xl text-tinta italic">Dr. Paulo</p>
              <div className="mt-1 w-64 border-t border-tinta pt-1.5 text-[11px] text-suave">{CANAL.responsavelTitulo}</div>
            </div>
          </div>
        </div>
      </Folha>
    </>
  );
}
