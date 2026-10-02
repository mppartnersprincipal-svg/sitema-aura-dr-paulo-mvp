import { PaginaCartaz } from "@/components/admin/documentos/cartaz";

export default async function Page({ params }: PageProps<"/admin/imprimir/cartaz/[id]">) {
  const { id } = await params;
  return <PaginaCartaz id={id} />;
}
