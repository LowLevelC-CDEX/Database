import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { scpSchema } from "@/lib/validators";
import { requireApiPermission, withApi, clientIp } from "@/lib/api";
import { audit } from "@/lib/audit";
import type { Clearance, ContentStatus } from "@prisma/client";

type Ctx = { params: Promise<{ id: string }> };

export const PATCH = withApi(async (req: NextRequest, { params }: Ctx) => {
  const user = await requireApiPermission("scp.manage");
  const { id } = await params;
  const body = await req.json();
  const parsed = scpSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }
  const d = parsed.data;

  const existing = await prisma.scpObject.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Snapshot current state into revision history before updating.
  await prisma.revision.create({
    data: {
      entityType: "ScpObject",
      entityId: id,
      scpObjectId: id,
      authorId: user.id,
      summary: "Edited via admin panel",
      snapshot: JSON.parse(JSON.stringify(existing)),
    },
  });

  const updated = await prisma.scpObject.update({
    where: { id },
    data: {
      itemNumber: d.itemNumber ?? undefined,
      codename: d.codename,
      objectClass: d.objectClass,
      containmentClass: d.containmentClass,
      riskClass: d.riskClass,
      disruptionClass: d.disruptionClass,
      clearanceRequired: d.clearanceRequired as Clearance | undefined,
      assignedSite: d.assignedSite,
      assignedDepartment: d.assignedDepartment,
      leadResearcher: d.leadResearcher,
      containmentTeam: d.containmentTeam,
      status: d.status as ContentStatus | undefined,
      summary: d.summary,
      containmentProcedures: d.containmentProcedures,
      description: d.description,
      history: d.history,
      gallery: d.gallery ?? undefined,
      addendums: d.addendums ?? undefined,
      recoveryLogs: d.recoveryLogs ?? undefined,
      experimentLogs: d.experimentLogs ?? undefined,
      incidentLogs: d.incidentLogs ?? undefined,
      crossTesting: d.crossTesting ?? undefined,
      tags: d.tags ?? undefined,
    },
  });

  await audit({ userId: user.id, action: "scp.update", target: updated.itemNumber, ip: clientIp(req) });
  return NextResponse.json({ item: updated });
});

export const DELETE = withApi(async (req: NextRequest, { params }: Ctx) => {
  const user = await requireApiPermission("scp.manage");
  const { id } = await params;
  const hard = req.nextUrl.searchParams.get("hard") === "1";

  if (hard) {
    await prisma.scpObject.delete({ where: { id } });
  } else {
    await prisma.scpObject.update({ where: { id }, data: { deletedAt: new Date() } });
  }
  await audit({ userId: user.id, action: hard ? "scp.delete.hard" : "scp.delete.soft", target: id, ip: clientIp(req) });
  return NextResponse.json({ ok: true });
});
