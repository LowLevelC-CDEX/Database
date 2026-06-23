import { requirePermission } from "@/lib/session";
import { PageHeader } from "@/components/shared/page-header";
import { ScpForm } from "@/components/admin/scp-form";

export const metadata = { title: "New SCP" };

export default async function NewScpPage() {
  await requirePermission("scp.manage");
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin · SCP Registry" title="Create SCP Object" description="All fields are optional except Item Number. Use Markdown in narrative fields." />
      <ScpForm />
    </div>
  );
}
