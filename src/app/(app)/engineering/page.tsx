import { requirePermission } from "@/lib/session";
import { DivisionLanding } from "@/components/content/division-landing";

export const metadata = { title: "Engineering" };

export default async function EngineeringPage() {
  await requirePermission("engineering.view");
  return <DivisionLanding departmentSlug="engineering" eyebrow="Infrastructure" title="Engineering Division" description="Facility systems, fabrication, and technical support." />;
}
