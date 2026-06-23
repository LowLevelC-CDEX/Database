import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { scpSchema } from "@/lib/validators";
import { requireApiPermission, withApi, clientIp } from "@/lib/api";
import { audit } from "@/lib/audit";
import { slugify } from "@/lib/utils";
import type { Clearance, ContentStatus } from "@prisma/client";

export const GET = withApi(async (req: NextRequest) => {
  await requireApiPermission("scp.view");
  const q = req.nextUrl.searchParams.get("q")?.trim();
  const objectClass = req.nextUrl.searchParams.get("class");
  const items = await prisma.scpObject.findMany({
    where: {
      deletedAt: null,
      ...(objectClass ? { objectClass } : {}),
      ...(q
        ? { OR: [{ itemNumber: { contains: q, mode: "insensitive" } }, { summary: { contains: q, mode: "insensitive" } }] }
        : {}),
    },
    orderBy: { itemNumber: "asc" },
  });
  return NextResponse.json({ items });
});

export const POST = withApi(async (req: NextRequest) => {
  const user = await requireApiPermission("scp.manage");
  const body = await req.json();
  const parsed = scpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }
  const data = parsed.data;
  const slug = slugify(data.itemNumber);

  const created = await prisma.scpObject.create({
    data: {
      slug,
      itemNumber: data.itemNumber,
      codename: data.codename ?? null,
      objectClass: data.objectClass ?? null,
      containmentClass: data.containmentClass ?? null,
      riskClass: data.riskClass ?? null,
      disruptionClass: data.disruptionClass ?? null,
      clearanceRequired: (data.clearanceRequired as Clearance) ?? "LEVEL_0",
      assignedSite: data.assignedSite ?? null,
      assignedDepartment: data.assignedDepartment ?? null,
      leadResearcher: data.leadResearcher ?? null,
      containmentTeam: data.containmentTeam ?? null,
      status: (data.status as ContentStatus) ?? "DRAFT",
      summary: data.summary ?? null,
      containmentProcedures: data.containmentProcedures ?? null,
      description: data.description ?? null,
      history: data.history ?? null,
      gallery: data.gallery ?? undefined,
      addendums: data.addendums ?? undefined,
      recoveryLogs: data.recoveryLogs ?? undefined,
      experimentLogs: data.experimentLogs ?? undefined,
      incidentLogs: data.incidentLogs ?? undefined,
      crossTesting: data.crossTesting ?? undefined,
      tags: data.tags ?? [],
    },
  });

  await audit({ userId: user.id, action: "scp.create", target: created.itemNumber, ip: clientIp(req) });
  return NextResponse.json({ item: created }, { status: 201 });
});
