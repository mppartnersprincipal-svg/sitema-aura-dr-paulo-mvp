import type { Metadata } from "next";
import { DenunciaWizard } from "@/components/denuncia/wizard";

export const metadata: Metadata = { title: "Fazer uma denúncia" };

export default async function DenunciaPage({ searchParams }: PageProps<"/denuncia">) {
  const { empresa } = await searchParams;
  return <DenunciaWizard empresaSlug={typeof empresa === "string" ? empresa : undefined} />;
}
