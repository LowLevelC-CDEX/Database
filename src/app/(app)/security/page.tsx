import { requirePermission } from "@/lib/session";
import { DivisionLanding } from "@/components/content/division-landing";

export const metadata = { title: "Security" };

export default async function SecurityPage() {
  await requirePermission("security.view");
  return <DivisionLanding departmentSlug="security" eyebrow="Site Defense" title="Security Division" description="Site security operations, patrols, and threat response." />;
}
