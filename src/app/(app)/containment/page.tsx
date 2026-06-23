import { requirePermission } from "@/lib/session";
import { DivisionLanding } from "@/components/content/division-landing";

export const metadata = { title: "Containment" };

export default async function ContainmentPage() {
  await requirePermission("containment.view");
  return <DivisionLanding departmentSlug="containment" eyebrow="Anomaly Control" title="Containment Division" description="Containment integrity, breach protocols, and specialist teams." />;
}
