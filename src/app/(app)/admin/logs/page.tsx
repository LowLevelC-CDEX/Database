import { requirePermission } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Audit Logs" };

function tone(action: string): "alert" | "caution" | "accent" | "success" | "default" {
  if (action.includes("fail") || action.includes("lock") || action.includes("delete")) return "alert";
  if (action.includes("ratelimit") || action.includes("update")) return "caution";
  if (action.includes("success") || action.includes("create")) return "success";
  return "default";
}

export default async function AdminLogsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await requirePermission("admin.logs");
  const { page } = await searchParams;
  const current = Math.max(1, Number(page) || 1);
  const perPage = 50;

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: perPage,
      skip: (current - 1) * perPage,
      include: { user: { select: { username: true } } },
    }),
    prisma.auditLog.count(),
  ]);

  const pages = Math.ceil(total / perPage);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin · Security" title="Audit Logs" description={`${total} recorded events. Every authentication and mutation is logged.`} />
      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-hairline/50 text-left">
                <th className="px-4 py-3 text-[0.62rem] font-semibold uppercase tracking-wider text-muted">Timestamp</th>
                <th className="px-3 py-3 text-[0.62rem] font-semibold uppercase tracking-wider text-muted">Action</th>
                <th className="px-3 py-3 text-[0.62rem] font-semibold uppercase tracking-wider text-muted">Actor</th>
                <th className="px-3 py-3 text-[0.62rem] font-semibold uppercase tracking-wider text-muted">Target</th>
                <th className="px-3 py-3 text-[0.62rem] font-semibold uppercase tracking-wider text-muted">IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-b border-hairline/20">
                  <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-muted">{formatDate(l.createdAt, true)}</td>
                  <td className="px-3 py-2.5"><Badge variant={tone(l.action)}>{l.action}</Badge></td>
                  <td className="px-3 py-2.5 text-xs text-foreground">{l.user?.username ?? l.actorLabel ?? "—"}</td>
                  <td className="px-3 py-2.5 text-xs text-muted">{l.target ?? "—"}</td>
                  <td className="px-3 py-2.5 font-mono text-xs text-muted">{l.ip ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {logs.length === 0 && <p className="px-4 py-8 text-center text-sm text-muted">No log entries.</p>}
        </CardContent>
      </Card>
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 text-xs text-muted">
          Page {current} of {pages}
        </div>
      )}
    </div>
  );
}
