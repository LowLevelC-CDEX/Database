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

export default async function OperationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  await requirePermission("operations.view");
  const { slug } = await params;
  const o = await prisma.operation.findUnique({ where: { slug } });
  if (!o || o.deletedAt) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/operations" className="flex items-center gap-1 text-xs text-muted hover:text-foreground">
        <ChevronLeft className="size-4" /> Operations
      </Link>
      <Card glass>
        <div className="p-5">
          <Badge variant="accent">{o.classification}</Badge>
          <h1 className="mt-2 text-2xl font-bold text-foreground">{o.codename}</h1>
        </div>
      </Card>
      <Card>
        <CardContent className="py-5">
          <FieldGrid>
            <Field label="Status" value={o.status} />
            <Field label="Scheduled For" value={formatDate(o.scheduledFor)} />
          </FieldGrid>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-6 py-6">
          <Section title="Objective"><Markdown content={o.objective ?? "_No objective set._"} /></Section>
          <Section title="Briefing"><Markdown content={o.body ?? "_No briefing._"} /></Section>
        </CardContent>
      </Card>
    </div>
  );
}
