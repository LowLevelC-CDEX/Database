import Link from "next/link";
import { FlaskConical, Plus, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { can } from "@/lib/rbac";
import { PageHeader, EmptyState } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { ClearanceBadge } from "@/components/shared/clearance-badge";
import { timeAgo } from "@/lib/utils";

export const metadata = { title: "SCP Objects" };

function classTone(c?: string | null): "accent" | "caution" | "alert" | "default" {
  const v = (c ?? "").toLowerCase();
  if (v.includes("keter") || v.includes("apollyon")) return "alert";
  if (v.includes("euclid")) return "caution";
  if (v.includes("safe") || v.includes("thaumiel")) return "accent";
  return "default";
}

export default async function ScpListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; class?: string }>;
}) {
  const { q, class: objectClass } = await searchParams;
  const user = await getCurrentUser();
  const manage = can(user?.role, "scp.manage");

  const items = await prisma.scpObject.findMany({
    where: {
      deletedAt: null,
      status: manage ? undefined : "PUBLISHED",
      ...(objectClass ? { objectClass } : {}),
      ...(q ? { OR: [{ itemNumber: { contains: q, mode: "insensitive" } }, { summary: { contains: q, mode: "insensitive" } }, { codename: { contains: q, mode: "insensitive" } }] } : {}),
    },
    orderBy: { itemNumber: "asc" },
  });

  const classes = await prisma.scpObject.findMany({
    where: { deletedAt: null, objectClass: { not: null } },
    distinct: ["objectClass"],
    select: { objectClass: true },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Anomalous Object Registry"
        title="SCP Objects"
        description="Catalogued anomalies contained at Site-80. Content is fully editable — populate with your own lore."
        actions={
          manage ? (
            <Link href="/admin/scp/new" className={buttonVariants({})}>
              <Plus className="size-4" /> New SCP
            </Link>
          ) : undefined
        }
      />

      {/* Filters */}
      <form className="flex flex-wrap gap-3" action="/scp">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <Input name="q" defaultValue={q} placeholder="Search item number, codename, summary…" className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Link href="/scp" className={`rounded-md border px-3 py-2 text-xs ${!objectClass ? "border-accent/50 bg-accent/10 text-accent" : "border-hairline/60 text-muted hover:text-foreground"}`}>
            All
          </Link>
          {classes.map((c) => (
            <Link
              key={c.objectClass}
              href={`/scp?class=${encodeURIComponent(c.objectClass!)}`}
              className={`rounded-md border px-3 py-2 text-xs ${objectClass === c.objectClass ? "border-accent/50 bg-accent/10 text-accent" : "border-hairline/60 text-muted hover:text-foreground"}`}
            >
              {c.objectClass}
            </Link>
          ))}
        </div>
      </form>

      {items.length === 0 ? (
        <EmptyState
          icon={FlaskConical}
          title="No SCP objects found"
          description={manage ? "Create your first anomaly to begin building the registry." : "No anomalies match your query."}
          action={manage ? <Link href="/admin/scp/new" className={buttonVariants({ variant: "secondary" })}><Plus className="size-4" /> Create SCP</Link> : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((s) => (
            <Link key={s.id} href={`/scp/${s.slug}`}>
              <Card className="group h-full transition-colors hover:border-accent/40">
                <CardContent className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex size-10 items-center justify-center rounded-md border border-hairline/50 bg-panel-2 text-accent">
                      <FlaskConical className="size-5" />
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      {s.objectClass && <Badge variant={classTone(s.objectClass)}>{s.objectClass}</Badge>}
                      <ClearanceBadge clearance={s.clearanceRequired} />
                    </div>
                  </div>
                  <div>
                    <p className="font-mono text-lg font-bold text-foreground group-hover:text-accent">{s.itemNumber}</p>
                    <p className="text-xs text-muted">{s.codename ?? "[CLASSIFIED]"}</p>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted">{s.summary ?? "No summary available."}</p>
                  <div className="flex items-center justify-between border-t border-hairline/40 pt-2 text-[0.62rem] text-muted/70">
                    <span>{s.status}</span>
                    <span>Updated {timeAgo(s.updatedAt)}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
