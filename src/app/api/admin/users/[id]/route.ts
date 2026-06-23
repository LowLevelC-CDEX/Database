import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { userAdminSchema } from "@/lib/validators";
import { requireApiPermission, withApi, clientIp } from "@/lib/api";
import { audit } from "@/lib/audit";
import { ROLE_ORDER, CLEARANCE_ORDER } from "@/lib/rbac";
import type { Role, Clearance, AccountStatus } from "@prisma/client";

type Ctx = { params: Promise<{ id: string }> };

export const PATCH = withApi(async (req: NextRequest, { params }: Ctx) => {
  const admin = await requireApiPermission("admin.users");
  const { id } = await params;
  const body = await req.json();
  const parsed = userAdminSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 422 });
  }
  const { role, clearance, status } = parsed.data;
  if (!ROLE_ORDER.includes(role as Role) || !CLEARANCE_ORDER.includes(clearance as Clearance)) {
    return NextResponse.json({ error: "Invalid role or clearance" }, { status: 422 });
  }

  // Prevent an admin from locking themselves out via self-demotion.
  if (id === admin.id && role !== "WEBSITE_ADMINISTRATOR" && admin.role === "WEBSITE_ADMINISTRATOR") {
    return NextResponse.json({ error: "You cannot demote your own administrator account." }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      role: role as Role,
      clearance: clearance as Clearance,
      status: status as AccountStatus,
      ...(status === "ACTIVE" ? { failedLoginCount: 0, lockedUntil: null } : {}),
    },
  });

  await audit({
    userId: admin.id,
    action: "admin.user.update",
    target: updated.username,
    meta: { role, clearance, status },
    ip: clientIp(req),
  });

  return NextResponse.json({ ok: true });
});

export const DELETE = withApi(async (req: NextRequest, { params }: Ctx) => {
  const admin = await requireApiPermission("admin.users");
  const { id } = await params;
  if (id === admin.id) return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
  await prisma.user.update({ where: { id }, data: { deletedAt: new Date(), status: "ARCHIVED" } });
  await audit({ userId: admin.id, action: "admin.user.delete", target: id, ip: clientIp(req) });
  return NextResponse.json({ ok: true });
});
