import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/session";
import { PageHeader, EmptyState } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Operations" };

export default async function OperationsPage() {
  await requirePermission("operations.view");
  const ops = await prisma.operation.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Mission Planning" title="Operations" description="Planned and active operations across Site-80." />
      {ops.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No operations scheduled" description="Operations will appear here once planned." />
      ) : (
        <div className="space-y-3">
          {ops.map((o) => (
            <Link key={o.id} href={`/operations/${o.slug}`}>
              <Card className="group transition-colors hover:border-accent/40">
                <CardContent className="flex items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground group-hover:text-accent">{o.codename}</p>
                    <p className="truncate text-xs text-muted">{o.classification}</p>
                  </div>
                  <Badge variant={o.status === "Active" ? "success" : "default"}>{o.status}</Badge>
                  {o.scheduledFor && <span className="hidden text-xs text-muted sm:block">{formatDate(o.scheduledFor)}</span>}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
