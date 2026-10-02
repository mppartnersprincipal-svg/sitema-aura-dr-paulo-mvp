"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { EmpresaForm } from "@/components/admin/empresa-form";
import { TituloPagina } from "@/components/admin/titulo-pagina";

export default function NovaEmpresaPage() {
  const router = useRouter();
  return (
    <div className="max-w-3xl">
      <Link href="/admin/empresas" className="mb-5 inline-flex items-center gap-1.5 text-sm text-suave hover:text-tinta">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Empresas
      </Link>
      <TituloPagina titulo="Nova empresa" descricao="Depois de salvar, o canal fica disponível para os funcionários." />
      <EmpresaForm onSalvo={(id) => router.push(`/admin/empresas/${id}`)} onCancelar={() => router.push("/admin/empresas")} />
    </div>
  );
}
