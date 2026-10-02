"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { registrarLead } from "@/lib/actions";
import { mascaraCnpj, mascaraTelefone } from "@/lib/format";

const FAIXAS = ["Até 20", "21 a 50", "51 a 200", "201 a 500", "Mais de 500"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VAZIO = {
  razao_social: "",
  cnpj: "",
  responsavel_nome: "",
  responsavel_cargo: "",
  email: "",
  telefone: "",
  qtd_funcionarios_faixa: "",
  mensagem: "",
};

type CampoLead = keyof typeof VAZIO;

function validar(dados: typeof VAZIO): string {
  if (!dados.responsavel_nome.trim()) return "Informe o nome do responsável.";
  if (!EMAIL_RE.test(dados.email.trim())) return "Informe um e-mail válido.";
  return "";
}

export function LeadForm() {
  const [dados, setDados] = useState(VAZIO);
  const [erro, setErro] = useState("");
  const [enviado, setEnviado] = useState(false);

  function campo(nome: CampoLead, valor: string) {
    setDados((d) => ({ ...d, [nome]: valor }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const problema = validar(dados);
    if (problema) {
      setErro(problema);
      return;
    }
    if (!registrarLead({ ...dados, email: dados.email.trim() })) {
      setErro("Não foi possível enviar agora. Tente novamente.");
      return;
    }
    setErro("");
    setEnviado(true);
  }

  function handleNovo() {
    setDados(VAZIO);
    setEnviado(false);
  }

  if (enviado) {
    return (
      <div className="cartao flex flex-col items-start gap-4 p-8">
        <CheckCircle2 className="h-10 w-10 text-acao" aria-hidden="true" />
        <h3 className="titulo text-2xl">Recebemos o seu contato.</h3>
        <p className="text-suave">
          Nossa equipe vai retornar em até 1 dia útil com uma proposta para {dados.razao_social || "a sua empresa"}.
        </p>
        <button type="button" className="btn btn-secundario btn-sm" onClick={handleNovo}>
          Enviar outro contato
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="cartao grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
      <div className="sm:col-span-2">
        <label htmlFor="razao" className="rotulo">
          Razão social da empresa
        </label>
        <input id="razao" className="campo" value={dados.razao_social} onChange={(e) => campo("razao_social", e.target.value)} />
      </div>
      <div>
        <label htmlFor="cnpj" className="rotulo">
          CNPJ
        </label>
        <input
          id="cnpj"
          inputMode="numeric"
          className="campo"
          placeholder="00.000.000/0000-00"
          value={dados.cnpj}
          onChange={(e) => campo("cnpj", mascaraCnpj(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="faixa" className="rotulo">
          Nº de funcionários
        </label>
        <select
          id="faixa"
          className="campo"
          value={dados.qtd_funcionarios_faixa}
          onChange={(e) => campo("qtd_funcionarios_faixa", e.target.value)}
        >
          <option value="">Selecione</option>
          {FAIXAS.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="nome" className="rotulo">
          Seu nome *
        </label>
        <input
          id="nome"
          required
          className="campo"
          value={dados.responsavel_nome}
          onChange={(e) => campo("responsavel_nome", e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="cargo" className="rotulo">
          Cargo
        </label>
        <input id="cargo" className="campo" value={dados.responsavel_cargo} onChange={(e) => campo("responsavel_cargo", e.target.value)} />
      </div>
      <div>
        <label htmlFor="email" className="rotulo">
          E-mail *
        </label>
        <input id="email" type="email" required className="campo" value={dados.email} onChange={(e) => campo("email", e.target.value)} />
      </div>
      <div>
        <label htmlFor="tel" className="rotulo">
          WhatsApp
        </label>
        <input
          id="tel"
          inputMode="tel"
          className="campo"
          placeholder="(37) 99999-9999"
          value={dados.telefone}
          onChange={(e) => campo("telefone", mascaraTelefone(e.target.value))}
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="msg" className="rotulo">
          Mensagem
        </label>
        <textarea id="msg" rows={3} className="campo" value={dados.mensagem} onChange={(e) => campo("mensagem", e.target.value)} />
      </div>
      {erro && (
        <p role="alert" className="text-sm font-medium text-perigo sm:col-span-2">
          {erro}
        </p>
      )}
      <div className="sm:col-span-2">
        <button type="submit" className="btn btn-primario w-full sm:w-auto">
          Solicitar proposta
        </button>
      </div>
    </form>
  );
}
