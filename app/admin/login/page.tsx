"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FlaskConical } from "lucide-react";
import { Marca } from "@/components/marca";
import { entrarAdmin } from "@/lib/admin-session";
import { ADMIN_DEMO } from "@/lib/config";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!entrarAdmin(email, senha)) {
      setErro("E-mail ou senha incorretos.");
      return;
    }
    router.push("/admin");
  }

  function preencherDemo() {
    setEmail(ADMIN_DEMO.email);
    setSenha(ADMIN_DEMO.senha);
  }

  return (
    <main className="grid flex-1 lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-tinta p-12 text-white lg:flex">
        <Marca variante="clara" />
        <p className="font-serif text-4xl leading-tight">
          Painel do apurador.
          <span className="block text-white/60 italic">Cada caso com prazo, registro e parecer.</span>
        </p>
        <p className="text-xs text-white/50">Acesso restrito ao advogado responsável e sua equipe.</p>
      </section>

      <section className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="lg:hidden">
            <Marca />
          </div>
          <h1 className="titulo mt-8 text-3xl lg:mt-0">Entrar</h1>
          <p className="mt-2 text-suave">Use suas credenciais de administrador.</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="rotulo">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="username"
                className="campo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="senha" className="rotulo">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                required
                autoComplete="current-password"
                className="campo"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
            {erro && (
              <p role="alert" className="text-sm font-medium text-perigo">
                {erro}
              </p>
            )}
            <button type="submit" className="btn btn-primario w-full">
              Entrar no painel
            </button>
          </form>

          <aside className="mt-8 rounded-xl border border-dashed border-ouro/50 bg-white p-4 text-sm text-suave">
            <p className="flex items-center gap-2 font-semibold text-tinta">
              <FlaskConical className="h-4 w-4 text-ouro" aria-hidden="true" />
              Acesso de demonstração
            </p>
            <p className="mt-1 font-mono text-xs text-tinta">{ADMIN_DEMO.email}</p>
            <p className="font-mono text-xs text-tinta">{ADMIN_DEMO.senha}</p>
            <button type="button" className="mt-2 cursor-pointer text-xs font-semibold text-acao underline underline-offset-2" onClick={preencherDemo}>
              Preencher automaticamente
            </button>
          </aside>
          <Link href="/" className="mt-6 inline-block text-sm text-suave underline underline-offset-2">
            ← Voltar ao portal
          </Link>
        </div>
      </section>
    </main>
  );
}
