import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { personnelSchema } from "@/lib/validators";
import { requireApiPermission, withApi, clientIp } from "@/lib/api";
import { audit } from "@/lib/audit";
import type { Clearance } from "@prisma/client";

type Ctx = { params: Promise<{ id: string }> };

export const PATCH = withApi(async (req: NextRequest, { params }: Ctx) => {
  const user = await requireApiPermission("personnel.manage");
  const { id } = await params;
  const body = await req.json();
  const parsed = personnelSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }
  const d = parsed.data;
  const updated = await prisma.personnel.update({
    where: { id },
    data: {
      name: d.name ?? undefined,
      rank: d.rank,
      clearance: d.clearance as Clearance | undefined,
      departmentId: d.departmentId === undefined ? undefined : d.departmentId || null,
      position: d.position,
      status: d.status,
      biography: d.biography,
      notes: d.notes,
      portrait: d.portrait,
      tags: d.tags ?? undefined,
    },
  });
  await audit({ userId: user.id, action: "personnel.update", target: updated.name, ip: clientIp(req) });
  return NextResponse.json({ item: updated });
});

export const DELETE = withApi(async (req: NextRequest, { params }: Ctx) => {
  const user = await requireApiPermission("personnel.manage");
  const { id } = await params;
  await prisma.personnel.update({ where: { id }, data: { deletedAt: new Date() } });
  await audit({ userId: user.id, action: "personnel.delete.soft", target: id, ip: clientIp(req) });
  return NextResponse.json({ ok: true });
});
