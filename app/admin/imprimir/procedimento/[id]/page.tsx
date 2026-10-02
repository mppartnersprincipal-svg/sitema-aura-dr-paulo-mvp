import { PaginaProcedimento } from "@/components/admin/documentos/procedimento";

export default async function Page({ params }: PageProps<"/admin/imprimir/procedimento/[id]">) {
  const { id } = await params;
  return <PaginaProcedimento id={id} />;
}
