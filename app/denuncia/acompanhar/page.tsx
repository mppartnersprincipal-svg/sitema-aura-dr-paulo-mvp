import type { Metadata } from "next";
import { Acompanhamento } from "@/components/denuncia/acompanhamento";

export const metadata: Metadata = { title: "Acompanhar denúncia" };

export default function AcompanharPage() {
  return <Acompanhamento />;
}
