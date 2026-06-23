import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/session";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Field, FieldGrid, Section } from "@/components/shared/record";
import { Markdown } from "@/components/shared/markdown";
import { formatDate } from "@/lib/utils";

export default async function IncidentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  await requirePermission("incidents.view");
  const { slug } = await params;
  const i = await prisma.incident.findUnique({ where: { slug } });
  if (!i || i.deletedAt) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/incidents" className="flex items-center gap-1 text-xs text-muted hover:text-foreground">
        <ChevronLeft className="size-4" /> Incidents
      </Link>
      <Card glass>
        <div className="p-5">
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="alert">{i.refNumber}</Badge>
            <Badge variant={i.severity === "Critical" ? "alert" : "caution"}>{i.severity}</Badge>
          </div>
          <h1 className="text-2xl font-bold text-foreground">{i.title}</h1>
        </div>
      </Card>
      <Card>
        <CardContent className="py-5">
          <FieldGrid>
            <Field label="Location" value={i.location} />
            <Field label="Date" value={formatDate(i.date)} />
          </FieldGrid>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-6 py-6">
          <Section title="Summary"><Markdown content={i.summary ?? "_No summary._"} /></Section>
          <Section title="Report"><Markdown content={i.body ?? "_No report body._"} /></Section>
        </CardContent>
      </Card>
    </div>
  );
}
