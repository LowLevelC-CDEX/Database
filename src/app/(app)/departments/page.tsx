import Link from "next/link";
import * as Icons from "lucide-react";
import { Building2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Departments" };

type IconMap = Record<string, React.ComponentType<{ className?: string }>>;

export default async function DepartmentsPage() {
  const departments = await prisma.department.findMany({
    where: { deletedAt: null },
    orderBy: { name: "asc" },
    include: { _count: { select: { members: true } } },
  });

  const lib = Icons as unknown as IconMap;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Organizational Structure" title="Departments" description={'Operational divisions of Site-80 "JACOBY".'} />

      {departments.length === 0 ? (
        <EmptyState icon={Building2} title="No departments" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((d) => {
            const Icon = (d.icon && lib[d.icon]) || Building2;
            return (
              <Link key={d.id} href={`/departments/${d.slug}`}>
                <Card className="group h-full transition-colors hover:border-accent/40">
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex size-11 items-center justify-center rounded-md border border-accent/30 bg-accent/10 text-accent">
                        <Icon className="size-5" />
                      </div>
                      <span className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">{d.shortName}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground group-hover:text-accent">{d.name}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-muted">{d.overview ?? "No overview available."}</p>
                    </div>
                    <p className="border-t border-hairline/40 pt-2 text-[0.62rem] text-muted/70">{d._count.members} member(s)</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
