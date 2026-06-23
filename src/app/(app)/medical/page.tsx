import { requirePermission } from "@/lib/session";
import { DivisionLanding } from "@/components/content/division-landing";

export const metadata = { title: "Medical" };

export default async function MedicalPage() {
  await requirePermission("medical.view");
  return <DivisionLanding departmentSlug="medical" eyebrow="Health Services" title="Medical Division" description="Personnel health, triage, and psychological evaluation." />;
}
