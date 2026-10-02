"use client";

import { useState } from "react";
import { ArrowLeft, QrCode } from "lucide-react";
import { Carregando } from "@/components/carregando";
import { registrarDenuncia } from "@/lib/actions";
import { useAura } from "@/lib/store";
import { PassoConcluida } from "./passo-concluida";
import { PassoConfirmar } from "./passo-confirmar";
import { PassoEmpresa } from "./passo-empresa";
import { PassoLgpd } from "./passo-lgpd";
import { PassoProvas } from "./passo-provas";
import { PassoRelato } from "./passo-relato";
import { PassoTipo } from "./passo-tipo";
import { Progresso } from "./progresso";
import { RASCUNHO_VAZIO, type Passo, type Rascunho } from "./tipos";

const ANTERIOR: Record<Passo, Passo | null> = {
  lgpd: null,
  empresa: "lgpd",
  tipo: "empresa",
  relato: "tipo",
  provas: "relato",
  confirmar: "provas",
  concluida: null,
};

function opcional(valor: string): string | undefined {
  return valor.trim() || undefined;
}

export function DenunciaWizard({ empresaSlug }: { empresaSlug?: string }) {
  const estado = useAura();
  const [passo, setPasso] = useState<Passo>("lgpd");
  const [rascunho, setRascunho] = useState<Rascunho>(RASCUNHO_VAZIO);
  const [resultado, setResultado] = useState<{ protocolo: string; senha: string } | null>(null);

  if (!estado) return <Carregando />;

  const ativas = estado.empresas.filter((e) => e.ativa);
  const empresaQr = empresaSlug ? ativas.find((e) => e.slug === empresaSlug) : undefined;
  const empresa = estado.empresas.find((e) => e.id === rascunho.empresa_id);

  function irPara(proximo: Passo) {
    setPasso(proximo);
    window.scrollTo({ top: 0 });
  }

  function alterarRascunho(patch: Partial<Rascunho>) {
    setRascunho((r) => ({ ...r, ...patch }));
  }

  function handleIniciar() {
    if (empresaQr) {
      alterarRascunho({ empresa_id: empresaQr.id });
      irPara("tipo");
      return;
    }
    irPara("empresa");
  }

  async function handleEnviar(): Promise<string | null> {
    if (!rascunho.empresa_id || !rascunho.tipo) return "Escolha a empresa e o assunto antes de enviar.";
    const r = await registrarDenuncia({
      empresa_id: rascunho.empresa_id,
      tipo: rascunho.tipo,
      relato: rascunho.relato.trim(),
      denunciado_nome: opcional(rascunho.denunciado_nome),
      denunciado_cargo: opcional(rascunho.denunciado_cargo),
      local_ocorrencia: opcional(rascunho.local_ocorrencia),
      data_ocorrencia_aprox: opcional(rascunho.data_ocorrencia_aprox),
      anexos: rascunho.anexos,
    });
    if ("erro" in r) return r.erro;
    setResultado(r);
    setRascunho(RASCUNHO_VAZIO);
    irPara("concluida");
    return null;
  }

  const anterior = ANTERIOR[passo];
  const mostrarNavegacao = passo !== "lgpd" && passo !== "concluida";

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      {passo === "lgpd" && empresaQr && (
        <p className="mb-6 flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm text-tinta">
          <QrCode className="h-4 w-4 text-acao" aria-hidden="true" />
          Canal de denúncias de <strong>{empresaQr.nome_fantasia}</strong>
        </p>
      )}

      {mostrarNavegacao && (
        <>
          {anterior && (
            <button type="button" className="btn btn-fantasma btn-sm mb-4 -ml-3" onClick={() => irPara(anterior)}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Voltar
            </button>
          )}
          <Progresso atual={passo} />
        </>
      )}

      {passo === "lgpd" && <PassoLgpd onIniciar={handleIniciar} />}
      {passo === "empresa" && (
        <PassoEmpresa
          empresas={ativas}
          selecionada={rascunho.empresa_id}
          onEscolher={(id) => {
            alterarRascunho({ empresa_id: id });
            irPara("tipo");
          }}
        />
      )}
      {passo === "tipo" && (
        <PassoTipo
          selecionado={rascunho.tipo}
          onEscolher={(tipo) => {
            alterarRascunho({ tipo });
            irPara("relato");
          }}
        />
      )}
      {passo === "relato" && (
        <PassoRelato rascunho={rascunho} onChange={alterarRascunho} onContinuar={() => irPara("provas")} />
      )}
      {passo === "provas" && (
        <PassoProvas
          anexos={rascunho.anexos}
          onChange={(anexos) => alterarRascunho({ anexos })}
          onContinuar={() => irPara("confirmar")}
        />
      )}
      {passo === "confirmar" && <PassoConfirmar rascunho={rascunho} empresa={empresa} onEnviar={handleEnviar} />}
      {passo === "concluida" && resultado && <PassoConcluida protocolo={resultado.protocolo} senha={resultado.senha} />}
    </div>
  );
}
