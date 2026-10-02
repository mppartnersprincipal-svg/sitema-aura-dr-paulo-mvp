import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { DemoBanner } from "@/components/demo-banner";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const serif = Source_Serif_4({ variable: "--font-serif-titulo", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "AURA · Canal de Denúncias Trabalhistas",
    template: "%s · AURA",
  },
  description:
    "Canal de denúncias independente, anônimo e em conformidade com a Lei 14.457/22 e a NR-01. Apuração imparcial conduzida por advogado.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${serif.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <DemoBanner />
        {children}
      </body>
    </html>
  );
}
