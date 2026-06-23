import { requireAuth } from "@/lib/session";
import { AppShell } from "@/components/layout/app-shell";

// All authenticated routes require a live database session.
export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth();
  return <AppShell user={user}>{children}</AppShell>;
}
