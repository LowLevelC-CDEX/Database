import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/session";
import { PageHeader, EmptyState } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Incident Reports" };

export default async function IncidentsPage() {
  await requirePermission("incidents.view");
  const incidents = await prisma.incident.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Event Log" title="Incident Reports" description="Recorded containment breaches, anomalies, and site events." />
      {incidents.length === 0 ? (
        <EmptyState icon={AlertTriangle} title="No incidents reported" description="Incident reports will appear here once filed." />
      ) : (
        <div className="space-y-3">
          {incidents.map((i) => (
            <Link key={i.id} href={`/incidents/${i.slug}`}>
              <Card className="group transition-colors hover:border-accent/40">
                <CardContent className="flex items-center gap-4">
                  <Badge variant="alert">{i.refNumber}</Badge>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground group-hover:text-accent">{i.title}</p>
                    <p className="truncate text-xs text-muted">{i.location ?? "Location unknown"}</p>
                  </div>
                  <Badge variant={i.severity === "Critical" ? "alert" : i.severity === "Major" ? "caution" : "default"}>{i.severity}</Badge>
                  <span className="hidden text-xs text-muted sm:block">{formatDate(i.date ?? i.createdAt)}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
