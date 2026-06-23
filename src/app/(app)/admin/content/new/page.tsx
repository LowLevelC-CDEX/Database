import { requirePermission } from "@/lib/session";
import { PageHeader } from "@/components/shared/page-header";
import { ContentForm } from "@/components/admin/content-form";

export const metadata = { title: "New Page" };

export default async function NewContentPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  await requirePermission("content.manage");
  const { category } = await searchParams;
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin · Content" title="Create Page" description="Pages support Markdown and power the Rules, Documents, Research, and Training sections." />
      <ContentForm initial={{ category: category ?? "documents" }} />
    </div>
  );
}
