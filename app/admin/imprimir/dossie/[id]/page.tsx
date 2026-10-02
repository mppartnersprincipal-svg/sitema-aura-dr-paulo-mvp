import { PaginaDossie } from "@/components/admin/documentos/dossie";

export default async function Page({ params }: PageProps<"/admin/imprimir/dossie/[id]">) {
  const { id } = await params;
  return <PaginaDossie id={id} />;
}
