import { prisma } from "@/lib/prisma";

export interface AuditEntry {
  userId?: string | null;
  actorLabel?: string | null;
  action: string;
  target?: string | null;
  meta?: Record<string, unknown>;
  ip?: string | null;
  userAgent?: string | null;
}

// Fire-and-forget audit logging. Never throws into the request path.
export async function audit(entry: AuditEntry): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: entry.userId ?? null,
        actorLabel: entry.actorLabel ?? null,
        action: entry.action,
        target: entry.target ?? null,
        meta: (entry.meta as object) ?? undefined,
        ip: entry.ip ?? null,
        userAgent: entry.userAgent ?? null,
      },
    });
  } catch (err) {
    console.error("[audit] failed to record entry", err);
  }
}
