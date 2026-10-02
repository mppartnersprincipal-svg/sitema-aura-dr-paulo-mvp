import { PaginaCertidao } from "@/components/admin/documentos/certidao";

export default async function Page({ params }: PageProps<"/admin/imprimir/certidao/[id]">) {
  const { id } = await params;
  return <PaginaCertidao id={id} />;
}
