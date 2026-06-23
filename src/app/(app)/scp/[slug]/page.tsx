import Link from "next/link";
import { notFound } from "next/navigation";
import { FlaskConical, Pencil, ChevronLeft, ImageOff } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { can } from "@/lib/rbac";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ClearanceBadge } from "@/components/shared/clearance-badge";
import { Field, FieldGrid, Section, LogList } from "@/components/shared/record";
import { Markdown } from "@/components/shared/markdown";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const scp = await prisma.scpObject.findUnique({ where: { slug } });
  return { title: scp?.itemNumber ?? "SCP Object" };
}

const TOC = [
  ["summary", "Summary"],
  ["containment", "Special Containment Procedures"],
  ["description", "Description"],
  ["addendums", "Addendums"],
  ["recovery", "Recovery Logs"],
  ["experiment", "Experiment Logs"],
  ["incident", "Incident Logs"],
  ["crosstest", "Cross Testing"],
  ["history", "History"],
];

export default async function ScpDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const scp = await prisma.scpObject.findUnique({ where: { slug } });
  if (!scp || scp.deletedAt) notFound();

  const user = await getCurrentUser();
  const manage = can(user?.role, "scp.manage");
  const gallery = Array.isArray(scp.gallery) ? (scp.gallery as { url: string; caption?: string }[]) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/scp" className="flex items-center gap-1 text-xs text-muted hover:text-foreground">
          <ChevronLeft className="size-4" /> SCP Objects
        </Link>
        {manage && (
          <Link href={`/admin/scp/${scp.id}/edit`} className={buttonVariants({ variant: "secondary", size: "sm" })}>
            <Pencil className="size-3.5" /> Edit
          </Link>
        )}
      </div>

      {/* Header */}
      <Card glass>
        <div className="flex flex-wrap items-start justify-between gap-4 p-5">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent">
              <FlaskConical className="size-7" />
            </div>
            <div>
              <h1 className="font-mono text-3xl font-bold text-foreground">{scp.itemNumber}</h1>
              <p className="text-sm text-muted">Codename: {scp.codename ?? "[CLASSIFIED]"}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {scp.objectClass && <Badge variant="caution">{scp.objectClass}</Badge>}
            <ClearanceBadge clearance={scp.clearanceRequired} />
            <Badge>{scp.status}</Badge>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar: metadata + TOC + gallery */}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Classification</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <Field label="Object Class" value={scp.objectClass} />
              <Field label="Containment Class" value={scp.containmentClass} />
              <Field label="Risk Class" value={scp.riskClass} />
              <Field label="Disruption Class" value={scp.disruptionClass} />
              <Field label="Clearance" value={<ClearanceBadge clearance={scp.clearanceRequired} />} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assignment</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <Field label="Assigned Site" value={scp.assignedSite} />
              <Field label="Department" value={scp.assignedDepartment} />
              <Field label="Lead Researcher" value={scp.leadResearcher} />
              <Field label="Containment Team" value={scp.containmentTeam} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contents</CardTitle>
            </CardHeader>
            <CardContent className="py-3">
              <nav className="space-y-1">
                {TOC.map(([id, label]) => (
                  <a key={id} href={`#${id}`} className="block rounded px-2 py-1 text-xs text-muted hover:bg-panel-2 hover:text-accent">
                    {label}
                  </a>
                ))}
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Main content */}
        <div className="space-y-8">
          {/* Gallery */}
          <Card>
            <CardHeader>
              <CardTitle>Image Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              {gallery.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-hairline/50 py-10 text-muted">
                  <ImageOff className="size-7" />
                  <p className="text-xs">No images attached. Add visuals via the editor.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {gallery.map((g, i) => (
                    <figure key={i} className="overflow-hidden rounded-md border border-hairline/50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={g.url} alt={g.caption ?? ""} className="aspect-video w-full object-cover" />
                      {g.caption && <figcaption className="px-2 py-1 text-[0.62rem] text-muted">{g.caption}</figcaption>}
                    </figure>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-8 py-6">
              <Section id="summary" title="Summary">
                <Markdown content={scp.summary ?? "_No summary provided._"} />
              </Section>
              <Section id="containment" title="Special Containment Procedures" classified>
                <Markdown content={scp.containmentProcedures ?? "_Containment procedures pending._"} />
              </Section>
              <Section id="description" title="Description">
                <Markdown content={scp.description ?? "_Description pending._"} />
              </Section>
              <Section id="addendums" title="Addendums">
                <LogList items={scp.addendums} />
              </Section>
              <Section id="recovery" title="Recovery Logs">
                <LogList items={scp.recoveryLogs} />
              </Section>
              <Section id="experiment" title="Experiment Logs">
                <LogList items={scp.experimentLogs} />
              </Section>
              <Section id="incident" title="Incident Logs">
                <LogList items={scp.incidentLogs} />
              </Section>
              <Section id="crosstest" title="Cross Testing">
                <LogList items={scp.crossTesting} />
              </Section>
              <Section id="history" title="History">
                <Markdown content={scp.history ?? "_No recorded history._"} />
              </Section>
            </CardContent>
          </Card>

          {scp.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="label-mono">Tags</span>
              {scp.tags.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
