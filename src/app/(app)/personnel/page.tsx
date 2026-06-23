import Link from "next/link";
import { Users, Plus, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { can } from "@/lib/rbac";
import { PageHeader, EmptyState } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { Avatar } from "@/components/ui/misc";
import { ClearanceBadge } from "@/components/shared/clearance-badge";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Personnel Database" };

export default async function PersonnelPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const user = await getCurrentUser();
  const manage = can(user?.role, "personnel.manage");

  const people = await prisma.personnel.findMany({
    where: {
      deletedAt: null,
      ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { position: { contains: q, mode: "insensitive" } }, { rank: { contains: q, mode: "insensitive" } }] } : {}),
    },
    include: { department: { select: { name: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Foundation Staff Registry"
        title="Personnel Database"
        description="Profiles for all registered Site-80 personnel."
        actions={manage ? <Link href="/admin/personnel/new" className={buttonVariants({})}><Plus className="size-4" /> Add Personnel</Link> : undefined}
      />

      <form className="relative max-w-md" action="/personnel">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <Input name="q" defaultValue={q} placeholder="Search by name, rank, position…" className="pl-9" />
      </form>

      {people.length === 0 ? (
        <EmptyState icon={Users} title="No personnel records" description={manage ? "Add personnel to populate the registry." : "No personnel match your query."} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {people.map((p) => (
            <Link key={p.id} href={`/personnel/${p.id}`}>
              <Card className="group h-full transition-colors hover:border-accent/40">
                <CardContent className="flex items-center gap-4">
                  <Avatar name={p.name} src={p.portrait} className="size-14 text-base" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground group-hover:text-accent">{p.name}</p>
                    <p className="truncate text-xs text-muted">{p.position ?? p.rank ?? "Personnel"}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <ClearanceBadge clearance={p.clearance} />
                      {p.department && <Badge>{p.department.name}</Badge>}
                    </div>
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
