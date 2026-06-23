import Link from "next/link";
import { Star, Crosshair } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Factions" };

export default async function FactionsPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const isTaskForce = type === "task-force";
  const factions = await prisma.faction.findMany({
    where: { deletedAt: null, ...(type ? { type: isTaskForce ? "Task Force" : undefined } : {}) },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Specialized Units"
        title={isTaskForce ? "Task Forces" : "Elite Factions"}
        description="Specialized operational groups. Expandable and fully customizable."
      />
      {factions.length === 0 ? (
        <EmptyState icon={Star} title="No factions yet" description="Create custom factions in the admin panel." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {factions.map((f) => (
            <Link key={f.id} href={`/factions/${f.slug}`}>
              <Card className="group h-full transition-colors hover:border-accent/40">
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex size-11 items-center justify-center rounded-md border border-accent/30 bg-accent/10 text-accent">
                      {f.type === "Task Force" ? <Crosshair className="size-5" /> : <Star className="size-5" />}
                    </div>
                    <Badge variant="accent">{f.type}</Badge>
                  </div>
                  <div>
                    <p className="font-medium text-foreground group-hover:text-accent">{f.name}</p>
                    {f.motto && <p className="text-xs italic text-muted">&ldquo;{f.motto}&rdquo;</p>}
                  </div>
                  <p className="line-clamp-2 text-sm text-muted">{f.overview ?? "No description."}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
