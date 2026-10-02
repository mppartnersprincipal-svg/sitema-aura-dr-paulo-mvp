import { GuardaAdmin } from "@/components/admin/guarda";

export default function ImprimirLayout({ children }: { children: React.ReactNode }) {
  return (
    <GuardaAdmin>
      <div className="flex-1 bg-papel-escuro print:bg-white">{children}</div>
    </GuardaAdmin>
  );
}
