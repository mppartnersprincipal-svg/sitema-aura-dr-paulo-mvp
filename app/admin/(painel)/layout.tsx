import { AdminShell } from "@/components/admin/shell";
import { GuardaAdmin } from "@/components/admin/guarda";

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return (
    <GuardaAdmin>
      <AdminShell>{children}</AdminShell>
    </GuardaAdmin>
  );
}
