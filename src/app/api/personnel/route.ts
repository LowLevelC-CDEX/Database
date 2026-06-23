import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { personnelSchema } from "@/lib/validators";
import { requireApiPermission, withApi, clientIp } from "@/lib/api";
import { audit } from "@/lib/audit";
import type { Clearance } from "@prisma/client";

export const GET = withApi(async (req: NextRequest) => {
  await requireApiPermission("personnel.view");
  const q = req.nextUrl.searchParams.get("q")?.trim();
  const items = await prisma.personnel.findMany({
    where: {
      deletedAt: null,
      ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { position: { contains: q, mode: "insensitive" } }] } : {}),
    },
    include: { department: { select: { name: true, slug: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ items });
});

export const POST = withApi(async (req: NextRequest) => {
  const user = await requireApiPermission("personnel.manage");
  const body = await req.json();
  const parsed = personnelSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }
  const d = parsed.data;
  const created = await prisma.personnel.create({
    data: {
      name: d.name,
      rank: d.rank ?? null,
      clearance: (d.clearance as Clearance) ?? "LEVEL_0",
      departmentId: d.departmentId || null,
      position: d.position ?? null,
      status: d.status ?? "Active",
      biography: d.biography ?? null,
      notes: d.notes ?? null,
      portrait: d.portrait ?? null,
      tags: d.tags ?? [],
    },
  });
  await audit({ userId: user.id, action: "personnel.create", target: created.name, ip: clientIp(req) });
  return NextResponse.json({ item: created }, { status: 201 });
});
