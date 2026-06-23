import { requirePermission } from "@/lib/session";
import { ContentCategoryView } from "@/components/content/content-views";

export const metadata = { title: "Research" };

export default async function ResearchPage() {
  await requirePermission("research.view");
  return (
    <ContentCategoryView
      category="research"
      eyebrow="Research Division"
      title="Research"
      description="Research papers, study logs, and project documentation."
    />
  );
}
