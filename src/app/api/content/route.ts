import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { contentPageSchema } from "@/lib/validators";
import { requireApiPermission, withApi, clientIp } from "@/lib/api";
import { audit } from "@/lib/audit";
import { slugify } from "@/lib/utils";
import type { Clearance, ContentStatus } from "@prisma/client";

export const POST = withApi(async (req: NextRequest) => {
  const user = await requireApiPermission("content.manage");
  const body = await req.json();
  const parsed = contentPageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }
  const d = parsed.data;
  let slug = slugify(d.title);
  // Ensure slug uniqueness within category.
  const exists = await prisma.contentPage.findUnique({ where: { slug } });
  if (exists) slug = `${slug}-${Date.now().toString(36)}`;

  const created = await prisma.contentPage.create({
    data: {
      slug,
      category: d.category,
      title: d.title,
      icon: d.icon ?? null,
      excerpt: d.excerpt ?? null,
      body: d.body,
      order: d.order ?? 0,
      status: (d.status as ContentStatus) ?? "PUBLISHED",
      clearanceRequired: (d.clearanceRequired as Clearance) ?? "LEVEL_0",
      tags: d.tags ?? [],
    },
  });
  await audit({ userId: user.id, action: "content.create", target: created.slug, ip: clientIp(req) });
  return NextResponse.json({ item: created }, { status: 201 });
});
