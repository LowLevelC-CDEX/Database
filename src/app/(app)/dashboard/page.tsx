import Link from "next/link";
import {
  FlaskConical,
  Users,
  Building2,
  AlertTriangle,
  Megaphone,
  Clock,
  Activity,
  Pin,
  ArrowUpRight,
  Server,
  ShieldCheck,
  Crosshair,
  FileText,
  Scale,
  Radio,
  Star,
  CalendarClock,
} from "lucide-react";
import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { ClearanceBadge, RoleBadge } from "@/components/shared/clearance-badge";
import { formatDate, timeAgo } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

const QUICK_LINKS = [
  { label: "SCP Objects", href: "/scp", icon: FlaskConical },
  { label: "Personnel", href: "/personnel", icon: Users },
  { label: "Departments", href: "/departments", icon: Building2 },
  { label: "Operations", href: "/operations", icon: Crosshair },
  { label: "Documents", href: "/documents", icon: FileText },
  { label: "Rules", href: "/rules", icon: Scale },
];

const SYSTEMS = [
  { name: "Containment Grid", status: "Operational" },
  { name: "Personnel Registry", status: "Operational" },
  { name: "Secure Records", status: "Operational" },
  { name: "Surveillance Net", status: "Degraded" },
];

export default async function DashboardPage() {
  const user = await requireAuth();
  const onlineSince = new Date(Date.now() - 30 * 60_000); // active within 30 minutes

  const [
    scpCount,
    personnelCount,
    departmentCount,
    incidentCount,
    announcements,
    recentScps,
    activity,
    onlineCount,
    upcomingOps,
    favorites,
    siteSetting,
  ] = await Promise.all([
    prisma.scpObject.count({ where: { deletedAt: null } }),
    prisma.personnel.count({ where: { deletedAt: null } }),
    prisma.department.count({ where: { deletedAt: null } }),
    prisma.incident.count({ where: { deletedAt: null } }),
    prisma.announcement.findMany({ where: { deletedAt: null }, orderBy: [{ pinned: "desc" }, { createdAt: "desc" }], take: 4 }),
    prisma.scpObject.findMany({ where: { deletedAt: null }, orderBy: { updatedAt: "desc" }, take: 5 }),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.user.count({ where: { deletedAt: null, status: "ACTIVE", lastLoginAt: { gte: onlineSince } } }),
    prisma.operation.findMany({
      where: { deletedAt: null, scheduledFor: { gte: new Date() } },
      orderBy: { scheduledFor: "asc" },
      take: 4,
    }),
    prisma.favorite.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.setting.findUnique({ where: { key: "site" } }),
  ]);

  const securityLevel =
    (siteSetting?.value as { securityLevel?: string } | null)?.securityLevel ?? "GREEN";
  const securityTone = securityLevel === "RED" ? "alert" : securityLevel === "YELLOW" ? "caution" : "success";

  const levelTone = (level: string) =>
    level === "alert" ? "alert" : level === "caution" ? "caution" : "accent";

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Welcome banner */}
      <Card glass className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <p className="label-mono text-accent/80">Secure Terminal · Site-80 &quot;JACOBY&quot;</p>
            <h1 className="mt-1 text-2xl font-bold text-foreground">
              Welcome back, {user.name ?? user.username}
            </h1>
            <p className="mt-1 text-sm text-muted">
              All systems nominal. Review the latest intelligence below.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <RoleBadge role={user.role} />
            <ClearanceBadge clearance={user.clearance} />
            <Badge variant="success">
              <span className="size-1.5 rounded-full bg-success" /> Status: {securityLevel}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="SCP Objects" value={scpCount} icon={FlaskConical} href="/scp" hint="Catalogued anomalies" />
        <StatCard label="Personnel" value={personnelCount} icon={Users} href="/personnel" hint="Registered staff" tone="success" />
        <StatCard label="Departments" value={departmentCount} icon={Building2} href="/departments" hint="Active divisions" />
        <StatCard label="Open Incidents" value={incidentCount} icon={AlertTriangle} href="/incidents" hint="Requiring review" tone="caution" />
        <StatCard label="Personnel Online" value={onlineCount} icon={Radio} href="/personnel?staff=1" hint="Active in last 30 min" tone="accent" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Announcements */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="size-4 text-accent" /> Latest Announcements
              </CardTitle>
              <Link href="/announcements" className="text-[0.66rem] text-accent hover:underline">
                View all
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {announcements.length === 0 ? (
                <p className="text-sm text-muted">No announcements posted.</p>
              ) : (
                announcements.map((a) => (
                  <div key={a.id} className="flex items-start gap-3 rounded-md border border-hairline/40 bg-panel-2/40 p-3">
                    {a.pinned && <Pin className="mt-0.5 size-3.5 shrink-0 text-caution" />}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-foreground">{a.title}</p>
                        <Badge variant={levelTone(a.level)}>{a.level}</Badge>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-muted">{a.body}</p>
                      <p className="mt-1 text-[0.62rem] text-muted/70">
                        {a.authorName ?? "System"} · {timeAgo(a.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Upcoming operations */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarClock className="size-4 text-accent" /> Upcoming Operations
              </CardTitle>
              <Link href="/operations" className="text-[0.66rem] text-accent hover:underline">
                View all
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingOps.length === 0 ? (
                <p className="text-sm text-muted">No scheduled operations.</p>
              ) : (
                upcomingOps.map((op) => (
                  <Link
                    key={op.id}
                    href={`/operations/${op.slug}`}
                    className="flex items-center justify-between rounded-md border border-hairline/40 bg-panel-2/40 p-3 transition-colors hover:border-accent/40"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{op.codename}</p>
                      <p className="text-xs text-muted">{op.classification} · {op.status}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted">
                      {op.scheduledFor ? formatDate(op.scheduledFor) : "TBD"}
                    </span>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recently updated */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="size-4 text-accent" /> Recently Updated Files
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {recentScps.length === 0 ? (
                <p className="px-5 py-4 text-sm text-muted">No files yet.</p>
              ) : (
                <ul className="divide-y divide-hairline/40">
                  {recentScps.map((s) => (
                    <li key={s.id}>
                      <Link href={`/scp/${s.slug}`} className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-panel-2/50">
                        <div className="flex items-center gap-3">
                          <Badge variant="accent">{s.itemNumber}</Badge>
                          <span className="text-sm text-foreground">{s.objectClass ?? "Unclassified"}</span>
                        </div>
                        <span className="flex items-center gap-2 text-xs text-muted">
                          {timeAgo(s.updatedAt)} <ArrowUpRight className="size-3.5" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Quick links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-accent" /> Quick Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_LINKS.map((q) => (
                  <Link
                    key={q.href}
                    href={q.href}
                    className="flex flex-col items-center gap-1.5 rounded-md border border-hairline/50 bg-panel-2/40 p-3 text-center transition-colors hover:border-accent/40 hover:bg-panel-2"
                  >
                    <q.icon className="size-5 text-accent" />
                    <span className="text-[0.7rem] text-muted">{q.label}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Favorites / pinned */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="size-4 text-accent" /> Favorite Pages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {favorites.length === 0 ? (
                <p className="text-sm text-muted">Pin pages from record views to see them here.</p>
              ) : (
                favorites.map((f) => (
                  <Link
                    key={f.id}
                    href={f.href}
                    className="flex items-center justify-between rounded-md border border-hairline/40 bg-panel-2/40 px-3 py-2 text-sm transition-colors hover:border-accent/40"
                  >
                    <span className="truncate text-foreground">{f.label}</span>
                    <ArrowUpRight className="size-3.5 shrink-0 text-muted" />
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          {/* Site security level */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-accent" /> Security Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`flex items-center gap-3 rounded-md border p-4 ${
                securityTone === "alert"
                  ? "border-alert/40 bg-alert/5"
                  : securityTone === "caution"
                    ? "border-caution/40 bg-caution/5"
                    : "border-success/40 bg-success/5"
              }`}>
                <span className={`size-3 rounded-full ${
                  securityTone === "alert" ? "bg-alert animate-pulse-soft" : securityTone === "caution" ? "bg-caution" : "bg-success"
                }`} />
                <div>
                  <p className="font-mono text-lg font-bold text-foreground">{securityLevel}</p>
                  <p className="text-xs text-muted">Site-wide threat posture</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="size-4 text-accent" /> System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {SYSTEMS.map((s) => {
                const ok = s.status === "Operational";
                return (
                  <div key={s.name} className="flex items-center justify-between text-sm">
                    <span className="text-muted">{s.name}</span>
                    <span className={`flex items-center gap-1.5 text-xs ${ok ? "text-success" : "text-caution"}`}>
                      <span className={`size-1.5 rounded-full ${ok ? "bg-success" : "bg-caution animate-pulse-soft"}`} />
                      {s.status}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Recent activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="size-4 text-accent" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {activity.length === 0 ? (
                <p className="text-sm text-muted">No recorded activity.</p>
              ) : (
                activity.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 text-xs">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-accent/60" />
                    <div className="min-w-0">
                      <p className="truncate font-mono text-muted">{log.action}</p>
                      <p className="text-[0.62rem] text-muted/60">{formatDate(log.createdAt, true)}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
