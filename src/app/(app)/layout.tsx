import { requireAuth } from "@/lib/session";
import { AppShell } from "@/components/layout/app-shell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth();
  return <AppShell user={user}>{children}</AppShell>;
}
