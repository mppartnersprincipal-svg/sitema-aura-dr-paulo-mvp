import { DenunciaDetalhe } from "@/components/admin/denuncia/detalhe";

export default async function DenunciaPage({ params }: PageProps<"/admin/denuncias/[id]">) {
  const { id } = await params;
  return <DenunciaDetalhe id={id} />;
}
