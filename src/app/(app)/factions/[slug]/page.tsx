import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Star, Crosshair, Package, ClipboardCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/shared/record";
import { Markdown } from "@/components/shared/markdown";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const f = await prisma.faction.findUnique({ where: { slug } });
  return { title: f?.name ?? "Faction" };
}

export default async function FactionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const f = await prisma.faction.findUnique({ where: { slug } });
  if (!f || f.deletedAt) notFound();

  const equipment = Array.isArray(f.equipment) ? (f.equipment as string[]) : [];

  return (
    <div className="space-y-6">
      <Link href="/factions" className="flex items-center gap-1 text-xs text-muted hover:text-foreground">
        <ChevronLeft className="size-4" /> Factions
      </Link>

      <Card glass>
        <div className="flex flex-wrap items-center gap-4 p-5">
          <div className="flex size-14 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent">
            {f.type === "Task Force" ? <Crosshair className="size-7" /> : <Star className="size-7" />}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{f.name}</h1>
            {f.motto && <p className="text-sm italic text-muted">&ldquo;{f.motto}&rdquo;</p>}
          </div>
          <Badge variant="accent">{f.type}</Badge>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        <Card>
          <CardContent className="space-y-6 py-6">
            <Section title="Overview"><Markdown content={f.overview ?? "_No overview._"} /></Section>
            <Section title="Requirements"><Markdown content={f.requirements ?? "_Not specified._"} /></Section>
          </CardContent>
        </Card>
        <aside className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Package className="size-4 text-accent" /> Equipment</CardTitle></CardHeader>
            <CardContent>
              {equipment.length ? (
                <ul className="space-y-1.5 text-sm text-foreground/90">{equipment.map((e, i) => <li key={i} className="flex gap-2"><span className="text-accent">›</span>{e}</li>)}</ul>
              ) : <p className="text-sm text-muted">No equipment listed.</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><ClipboardCheck className="size-4 text-accent" /> Documents</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted">No documents attached.</p></CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
