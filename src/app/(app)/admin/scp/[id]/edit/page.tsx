import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { ScpForm } from "@/components/admin/scp-form";
import type { LogEntry, GalleryEntry } from "@/components/admin/repeatable";

export const metadata = { title: "Edit SCP" };

function asLogs(v: unknown): LogEntry[] {
  return Array.isArray(v) ? (v as LogEntry[]) : [];
}

export default async function EditScpPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("scp.manage");
  const { id } = await params;
  const scp = await prisma.scpObject.findUnique({ where: { id } });
  if (!scp) notFound();

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin · SCP Registry" title={`Edit ${scp.itemNumber}`} description="Changes are versioned — previous states are saved to revision history." />
      <ScpForm
        initial={{
          id: scp.id,
          itemNumber: scp.itemNumber,
          codename: scp.codename ?? "",
          objectClass: scp.objectClass ?? "",
          containmentClass: scp.containmentClass ?? "",
          riskClass: scp.riskClass ?? "",
          disruptionClass: scp.disruptionClass ?? "",
          clearanceRequired: scp.clearanceRequired,
          assignedSite: scp.assignedSite ?? "",
          assignedDepartment: scp.assignedDepartment ?? "",
          leadResearcher: scp.leadResearcher ?? "",
          containmentTeam: scp.containmentTeam ?? "",
          status: scp.status,
          summary: scp.summary ?? "",
          containmentProcedures: scp.containmentProcedures ?? "",
          description: scp.description ?? "",
          history: scp.history ?? "",
          tags: scp.tags.join(", "),
          gallery: (scp.gallery as GalleryEntry[]) ?? [],
          addendums: asLogs(scp.addendums),
          recoveryLogs: asLogs(scp.recoveryLogs),
          experimentLogs: asLogs(scp.experimentLogs),
          incidentLogs: asLogs(scp.incidentLogs),
          crossTesting: asLogs(scp.crossTesting),
        }}
      />
    </div>
  );
}
