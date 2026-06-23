import Link from "next/link";
import { notFound } from "next/navigation";
import * as Icons from "lucide-react";
import { Building2, ChevronLeft, Users, ClipboardList, Boxes, Megaphone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/misc";
import { ClearanceBadge } from "@/components/shared/clearance-badge";
import { Section } from "@/components/shared/record";
import { Markdown } from "@/components/shared/markdown";

type IconMap = Record<string, React.ComponentType<{ className?: string }>>;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = await prisma.department.findUnique({ where: { slug } });
  return { title: d?.name ?? "Department" };
}

export default async function DepartmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dept = await prisma.department.findUnique({
    where: { slug },
    include: { members: { where: { deletedAt: null }, orderBy: { name: "asc" } } },
  });
  if (!dept || dept.deletedAt) notFound();

  const lib = Icons as unknown as IconMap;
  const Icon = (dept.icon && lib[dept.icon]) || Building2;
  const leadership = Array.isArray(dept.leadership) ? (dept.leadership as { name: string; role: string }[]) : [];
  const sops = Array.isArray(dept.sops) ? (dept.sops as { title: string; body: string }[]) : [];

  return (
    <div className="space-y-6">
      <Link href="/departments" className="flex items-center gap-1 text-xs text-muted hover:text-foreground">
        <ChevronLeft className="size-4" /> Departments
      </Link>

      <Card glass>
        <div className="flex flex-wrap items-center gap-4 p-5">
          <div className="flex size-14 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent">
            <Icon className="size-7" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">{dept.name}</h1>
              <Badge variant="accent">{dept.shortName}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted">{dept.members.length} registered member(s)</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-6 py-6">
              <Section title="Overview"><Markdown content={dept.overview ?? "_No overview provided._"} /></Section>
              <Section title="Responsibilities"><Markdown content={dept.responsibilities ?? "_Not defined._"} /></Section>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><ClipboardList className="size-4 text-accent" /> Standard Operating Procedures</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {sops.length ? sops.map((s, i) => (
                <div key={i} className="rounded-md border border-hairline/40 bg-panel-2/40 p-4">
                  <p className="mb-1 text-sm font-semibold text-foreground">{s.title}</p>
                  <Markdown content={s.body} />
                </div>
              )) : <p className="text-sm text-muted">No SOPs documented.</p>}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Users className="size-4 text-accent" /> Leadership</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {leadership.length ? leadership.map((l, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{l.name}</span>
                  <span className="text-xs text-muted">{l.role}</span>
                </div>
              )) : <p className="text-sm text-muted">No leadership assigned.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Boxes className="size-4 text-accent" /> Roster</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {dept.members.length ? dept.members.map((m) => (
                <Link key={m.id} href={`/personnel/${m.id}`} className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-panel-2">
                  <Avatar name={m.name} src={m.portrait} className="size-9" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-foreground">{m.name}</p>
                    <p className="truncate text-xs text-muted">{m.position ?? m.rank}</p>
                  </div>
                  <ClearanceBadge clearance={m.clearance} />
                </Link>
              )) : <p className="text-sm text-muted">No members assigned.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Megaphone className="size-4 text-accent" /> Announcements</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted">No department announcements.</p></CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
