import { EmpresaDetalhe } from "@/components/admin/empresa-detalhe";

export default async function EmpresaPage({ params }: PageProps<"/admin/empresas/[id]">) {
  const { id } = await params;
  return <EmpresaDetalhe id={id} />;
}
