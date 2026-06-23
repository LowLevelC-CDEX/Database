import Link from "next/link";
import * as Icons from "lucide-react";
import { Building2, ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/misc";
import { ClearanceBadge } from "@/components/shared/clearance-badge";

type IconMap = Record<string, React.ComponentType<{ className?: string }>>;

export async function DivisionLanding({
  departmentSlug,
  eyebrow,
  title,
  description,
}: {
  departmentSlug: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  const dept = await prisma.department.findUnique({
    where: { slug: departmentSlug },
    include: { members: { where: { deletedAt: null }, take: 8, orderBy: { name: "asc" } } },
  });

  const lib = Icons as unknown as IconMap;
  const Icon = (dept?.icon && lib[dept.icon]) || Building2;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Icon className="size-4 text-accent" /> Division Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-foreground/90">
              {dept?.overview ?? "[PLACEHOLDER] This division landing page aggregates personnel, procedures, and resources. Edit the linked department to populate content."}
            </p>
            {dept && (
              <Link href={`/departments/${dept.slug}`} className="mt-4 inline-flex items-center gap-1 text-xs text-accent hover:underline">
                View full department <ArrowUpRight className="size-3.5" />
              </Link>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Personnel</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {dept?.members.length ? dept.members.map((m) => (
              <Link key={m.id} href={`/personnel/${m.id}`} className="flex items-center gap-3 rounded-md p-2 hover:bg-panel-2">
                <Avatar name={m.name} src={m.portrait} className="size-8" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground">{m.name}</p>
                  <p className="truncate text-xs text-muted">{m.position ?? m.rank}</p>
                </div>
                <ClearanceBadge clearance={m.clearance} />
              </Link>
            )) : <p className="text-sm text-muted">No personnel assigned.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
