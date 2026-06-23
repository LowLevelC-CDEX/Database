import Link from "next/link";
import { FileText, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { can } from "@/lib/rbac";
import { PageHeader, EmptyState } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Markdown } from "@/components/shared/markdown";
import { Plus, Pencil } from "lucide-react";

export async function ContentCategoryView({
  category,
  eyebrow,
  title,
  description,
}: {
  category: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  const user = await getCurrentUser();
  const manage = can(user?.role, "content.manage");
  const pages = await prisma.contentPage.findMany({
    where: { category, deletedAt: null, status: manage ? undefined : "PUBLISHED" },
    orderBy: [{ order: "asc" }, { title: "asc" }],
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={manage ? <Link href={`/admin/content/new?category=${category}`} className={buttonVariants({})}><Plus className="size-4" /> New Page</Link> : undefined}
      />
      {pages.length === 0 ? (
        <EmptyState icon={FileText} title="No pages yet" description={manage ? "Create a page to populate this section." : "Content coming soon."} />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {pages.map((p) => (
            <Link key={p.id} href={`/${category}/${p.slug}`}>
              <Card className="group transition-colors hover:border-accent/40">
                <CardContent className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-md border border-hairline/50 bg-panel-2 text-accent">
                    <FileText className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground group-hover:text-accent">{p.title}</p>
                    {p.excerpt && <p className="truncate text-xs text-muted">{p.excerpt}</p>}
                  </div>
                  {p.status !== "PUBLISHED" && <Badge variant="caution">{p.status}</Badge>}
                  <ChevronRight className="size-4 text-muted" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export async function ContentDetailView({ category, slug }: { category: string; slug: string }) {
  const user = await getCurrentUser();
  const manage = can(user?.role, "content.manage");
  const page = await prisma.contentPage.findFirst({ where: { category, slug, deletedAt: null } });
  if (!page) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Link href={`/${category}`} className="text-xs text-muted hover:text-foreground">‹ Back</Link>
        {manage && (
          <Link href={`/admin/content/${page.id}/edit`} className={buttonVariants({ variant: "secondary", size: "sm" })}>
            <Pencil className="size-3.5" /> Edit
          </Link>
        )}
      </div>
      <Card>
        <CardContent className="py-8">
          <Markdown content={page.body} />
        </CardContent>
      </Card>
    </div>
  );
}
