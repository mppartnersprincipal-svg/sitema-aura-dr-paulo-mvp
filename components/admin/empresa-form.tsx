"use client";

import { useState } from "react";
import { ImageUp } from "lucide-react";
import { EmpresaAvatar } from "@/components/empresa-avatar";
import { salvarEmpresa, slugEmUso, type DadosEmpresa } from "@/lib/actions";
import { MAX_LOGO_BYTES } from "@/lib/config";
import { formatBytes, mascaraCep, mascaraCnpj, mascaraTelefone, slugify } from "@/lib/format";
import type { Empresa } from "@/lib/types";

const CORES = ["#1e3a5f", "#2f6b4f", "#7a3b5c", "#8a5a1f", "#4b3a7a", "#3d5a6b"];
const UFS = "AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" ");
const CNPJ_COMPLETO = 18;

const NOVA_EMPRESA: DadosEmpresa = {
  nome: "",
  nome_fantasia: "",
  cnpj: "",
  endereco: "",
  cidade: "Divinópolis",
  estado: "MG",
  cep: "",
  contato_nome: "",
  contato_telefone: "",
  contato_email: "",
  responsavel_juridico: "",
  cor: CORES[0],
  slug: "",
  ativa: true,
  data_contratacao: "",
  observacoes: "",
};

function dadosIniciais(empresa?: Empresa): DadosEmpresa {
  if (!empresa) return { ...NOVA_EMPRESA, data_contratacao: new Date().toISOString() };
  const dados: DadosEmpresa & Partial<Pick<Empresa, "id" | "created_at">> = { ...empresa };
  delete dados.id;
  delete dados.created_at;
  return dados;
}

function validar(d: DadosEmpresa, id?: string): string {
  if (!d.nome.trim()) return "Informe a razão social.";
  if (!d.nome_fantasia.trim()) return "Informe o nome fantasia (é o que aparece para o denunciante).";
  if (d.cnpj.length !== CNPJ_COMPLETO) return "Informe o CNPJ completo.";
  if (!d.slug) return "Informe o identificador do link.";
  if (slugEmUso(d.slug, id)) return "Este identificador de link já está em uso por outra empresa.";
  return "";
}

type Props = {
  empresa?: Empresa;
  onSalvo: (id: string) => void;
  onCancelar?: () => void;
};

type CampoTexto =
  | "nome"
  | "cnpj"
  | "endereco"
  | "cidade"
  | "cep"
  | "contato_nome"
  | "contato_telefone"
  | "contato_email"
  | "responsavel_juridico";

type OpcoesCampo = { mascara?: (v: string) => string; tipo?: string; largo?: boolean };

export function EmpresaForm({ empresa, onSalvo, onCancelar }: Props) {
  const [dados, setDados] = useState<DadosEmpresa>(() => dadosIniciais(empresa));
  const [slugManual, setSlugManual] = useState(Boolean(empresa));
  const [erro, setErro] = useState("");

  function alterar(patch: Partial<DadosEmpresa>) {
    setDados((d) => ({ ...d, ...patch }));
  }

  function campo(nome: CampoTexto, rotulo: string, opcoes: OpcoesCampo = {}) {
    return (
      <div className={opcoes.largo ? "sm:col-span-2" : ""}>
        <label htmlFor={`emp-${nome}`} className="rotulo">
          {rotulo}
        </label>
        <input
          id={`emp-${nome}`}
          type={opcoes.tipo ?? "text"}
          className="campo"
          value={dados[nome]}
          onChange={(e) => alterar({ [nome]: opcoes.mascara ? opcoes.mascara(e.target.value) : e.target.value })}
        />
      </div>
    );
  }

  function handleNomeFantasia(valor: string) {
    alterar(slugManual ? { nome_fantasia: valor } : { nome_fantasia: valor, slug: slugify(valor) });
  }

  function handleLogo(arquivo: File | undefined) {
    if (!arquivo) return;
    if (arquivo.size > MAX_LOGO_BYTES) {
      setErro(`A logo deve ter até ${formatBytes(MAX_LOGO_BYTES)} nesta demonstração.`);
      return;
    }
    const leitor = new FileReader();
    leitor.onload = () => alterar({ logo_url: String(leitor.result) });
    leitor.onerror = () => setErro("Não foi possível ler a imagem.");
    leitor.readAsDataURL(arquivo);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const problema = validar(dados, empresa?.id);
    if (problema) {
      setErro(problema);
      return;
    }
    const id = salvarEmpresa({ ...dados, nome: dados.nome.trim(), nome_fantasia: dados.nome_fantasia.trim() }, empresa?.id);
    if (!id) {
      setErro("Não foi possível salvar (espaço do navegador cheio). Tente uma logo menor.");
      return;
    }
    onSalvo(id);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      <fieldset className="cartao grid gap-5 p-6 sm:grid-cols-2">
        <legend className="sr-only">Identificação</legend>
        <div className="flex items-center gap-4 sm:col-span-2">
          <EmpresaAvatar empresa={{ ...dados, nome_fantasia: dados.nome_fantasia || "Nova Empresa" }} tamanho="lg" />
          <div className="space-y-2">
            <label className="btn btn-secundario btn-sm cursor-pointer">
              <ImageUp className="h-4 w-4" aria-hidden="true" />
              {dados.logo_url ? "Trocar logo" : "Enviar logo"}
              <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleLogo(e.target.files?.[0])} />
            </label>
            {dados.logo_url ? (
              <button type="button" className="block text-xs text-suave underline" onClick={() => alterar({ logo_url: undefined })}>
                Remover logo
              </button>
            ) : (
              <div className="flex gap-1.5" role="radiogroup" aria-label="Cor do avatar">
                {CORES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    role="radio"
                    aria-checked={dados.cor === c}
                    aria-label={`Cor ${c}`}
                    onClick={() => alterar({ cor: c })}
                    className={`h-6 w-6 cursor-pointer rounded-full ${dados.cor === c ? "ring-2 ring-tinta ring-offset-2" : ""}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        {campo("nome", "Razão social *", { largo: true })}
        <div>
          <label htmlFor="emp-fantasia" className="rotulo">
            Nome fantasia *
          </label>
          <input id="emp-fantasia" className="campo" value={dados.nome_fantasia} onChange={(e) => handleNomeFantasia(e.target.value)} />
        </div>
        {campo("cnpj", "CNPJ *", { mascara: mascaraCnpj })}
        <div className="sm:col-span-2">
          <label htmlFor="emp-slug" className="rotulo">
            Link do canal
          </label>
          <div className="flex items-center overflow-hidden rounded-lg border border-linha bg-papel">
            <span className="px-3 text-sm whitespace-nowrap text-suave">/denuncia?empresa=</span>
            <input
              id="emp-slug"
              className="w-full bg-white px-3 py-3 font-mono text-sm outline-none"
              value={dados.slug}
              onChange={(e) => {
                setSlugManual(true);
                alterar({ slug: slugify(e.target.value) });
              }}
            />
          </div>
        </div>
        <label className="flex cursor-pointer items-center gap-3 sm:col-span-2">
          <input type="checkbox" checked={dados.ativa} onChange={(e) => alterar({ ativa: e.target.checked })} className="h-5 w-5 accent-acao" />
          <span className="text-sm text-texto">
            <strong className="text-tinta">Canal ativo</strong> — a empresa aparece na lista para o denunciante
          </span>
        </label>
      </fieldset>

      <fieldset className="cartao grid gap-5 p-6 sm:grid-cols-2">
        <legend className="px-1 text-sm font-semibold text-tinta">Endereço</legend>
        {campo("endereco", "Endereço", { largo: true })}
        {campo("cidade", "Cidade")}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="emp-uf" className="rotulo">
              UF
            </label>
            <select id="emp-uf" className="campo" value={dados.estado} onChange={(e) => alterar({ estado: e.target.value })}>
              {UFS.map((uf) => (
                <option key={uf}>{uf}</option>
              ))}
            </select>
          </div>
          {campo("cep", "CEP", { mascara: mascaraCep })}
        </div>
      </fieldset>

      <fieldset className="cartao grid gap-5 p-6 sm:grid-cols-2">
        <legend className="px-1 text-sm font-semibold text-tinta">Contato comercial</legend>
        {campo("contato_nome", "Nome do contato")}
        {campo("contato_telefone", "Telefone", { mascara: mascaraTelefone })}
        {campo("contato_email", "E-mail", { tipo: "email" })}
        {campo("responsavel_juridico", "Responsável legal")}
        <div className="sm:col-span-2">
          <label htmlFor="emp-obs" className="rotulo">
            Observações internas
          </label>
          <textarea id="emp-obs" rows={3} className="campo" value={dados.observacoes} onChange={(e) => alterar({ observacoes: e.target.value })} />
        </div>
      </fieldset>

      {erro && (
        <p role="alert" className="text-sm font-medium text-perigo">
          {erro}
        </p>
      )}
      <div className="flex gap-3">
        <button type="submit" className="btn btn-primario">
          {empresa ? "Salvar alterações" : "Cadastrar empresa"}
        </button>
        {onCancelar && (
          <button type="button" className="btn btn-fantasma" onClick={onCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
