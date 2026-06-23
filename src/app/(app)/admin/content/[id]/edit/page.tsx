import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { ContentForm } from "@/components/admin/content-form";

export const metadata = { title: "Edit Page" };

export default async function EditContentPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("content.manage");
  const { id } = await params;
  const page = await prisma.contentPage.findUnique({ where: { id } });
  if (!page) notFound();

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin · Content" title={`Edit: ${page.title}`} />
      <ContentForm
        initial={{
          id: page.id,
          category: page.category,
          title: page.title,
          excerpt: page.excerpt ?? "",
          body: page.body,
          order: page.order,
          status: page.status,
          tags: page.tags.join(", "),
        }}
      />
    </div>
  );
}
