"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Carregando } from "@/components/carregando";
import { useAdminLogado } from "@/lib/admin-session";

/** Protege as telas do painel. Em produção: middleware + Supabase Auth no servidor. */
export function GuardaAdmin({ children }: { children: React.ReactNode }) {
  const logado = useAdminLogado();
  const router = useRouter();

  useEffect(() => {
    if (logado === false) router.replace("/admin/login");
  }, [logado, router]);

  if (!logado) return <Carregando texto="Verificando acesso…" />;
  return <>{children}</>;
}
