import { MessageCircle } from "lucide-react";
import { CANAL } from "@/lib/config";

export function WhatsAppFlutuante() {
  const texto = encodeURIComponent("Olá! Tenho interesse no canal de denúncias AURA para minha empresa.");
  return (
    <a
      href={`https://wa.me/${CANAL.whatsappComercial}?text=${texto}`}
      target="_blank"
      rel="noopener noreferrer"
      className="no-print fixed right-5 bottom-5 z-40 flex items-center gap-2 rounded-full bg-[#1f8f52] py-3 pr-5 pl-4 text-sm font-semibold text-white shadow-lg shadow-tinta/20 transition-transform hover:-translate-y-0.5"
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      <span className="hidden sm:inline">Fale com a equipe comercial</span>
      <span className="sm:hidden">WhatsApp</span>
    </a>
  );
}
