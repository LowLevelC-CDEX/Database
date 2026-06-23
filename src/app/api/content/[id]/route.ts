import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { contentPageSchema } from "@/lib/validators";
import { requireApiPermission, withApi, clientIp } from "@/lib/api";
import { audit } from "@/lib/audit";
import type { Clearance, ContentStatus } from "@prisma/client";

type Ctx = { params: Promise<{ id: string }> };

export const PATCH = withApi(async (req: NextRequest, { params }: Ctx) => {
  const user = await requireApiPermission("content.manage");
  const { id } = await params;
  const body = await req.json();
  const parsed = contentPageSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }
  const d = parsed.data;

  const existing = await prisma.contentPage.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.revision.create({
    data: {
      entityType: "ContentPage",
      entityId: id,
      contentPageId: id,
      authorId: user.id,
      summary: "Edited via admin panel",
      snapshot: JSON.parse(JSON.stringify(existing)),
    },
  });

  const updated = await prisma.contentPage.update({
    where: { id },
    data: {
      category: d.category ?? undefined,
      title: d.title ?? undefined,
      icon: d.icon,
      excerpt: d.excerpt,
      body: d.body ?? undefined,
      order: d.order ?? undefined,
      status: d.status as ContentStatus | undefined,
      clearanceRequired: d.clearanceRequired as Clearance | undefined,
      tags: d.tags ?? undefined,
    },
  });
  await audit({ userId: user.id, action: "content.update", target: updated.slug, ip: clientIp(req) });
  return NextResponse.json({ item: updated });
});

export const DELETE = withApi(async (req: NextRequest, { params }: Ctx) => {
  const user = await requireApiPermission("content.manage");
  const { id } = await params;
  await prisma.contentPage.update({ where: { id }, data: { deletedAt: new Date() } });
  await audit({ userId: user.id, action: "content.delete.soft", target: id, ip: clientIp(req) });
  return NextResponse.json({ ok: true });
});
