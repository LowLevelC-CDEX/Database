import Link from "next/link";
import {
  Users, ShieldCheck, FlaskConical, Building2, FileText, ScrollText,
  Database, BarChart3, HardDrive, Image as ImageIcon, History, Activity,
  Megaphone, PanelsTopLeft, Palette, Settings2, Star,
} from "lucide-react";
import { requirePermission } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { can } from "@/lib/rbac";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";

export const metadata = { title: "Administration" };

const SECTIONS: { label: string; href: string; icon: React.ComponentType<{ className?: string }>; desc: string; live?: boolean }[] = [
  { label: "Manage Users", href: "/admin/users", icon: Users, desc: "Approve accounts, assign roles & clearance.", live: true },
  { label: "Audit Logs", href: "/admin/logs", icon: ScrollText, desc: "Full security & activity audit trail.", live: true },
  { label: "Create SCP", href: "/admin/scp/new", icon: FlaskConical, desc: "Add a new anomalous object.", live: true },
  { label: "Create Personnel", href: "/admin/personnel/new", icon: Users, desc: "Add a personnel record.", live: true },
  { label: "Create Page", href: "/admin/content/new", icon: FileText, desc: "Author rules, docs, research & training.", live: true },
  { label: "Departments", href: "/departments", icon: Building2, desc: "Manage organizational divisions." },
  { label: "Factions", href: "/factions", icon: Star, desc: "Manage task forces & elite groups." },
  { label: "Announcements", href: "/announcements", icon: Megaphone, desc: "Post site-wide notices." },
  { label: "Roles & Permissions", href: "/admin/roles", icon: ShieldCheck, desc: "Review the permission matrix.", live: true },
  { label: "Analytics", href: "/admin", icon: BarChart3, desc: "Usage & database analytics." },
  { label: "Backups", href: "/admin", icon: Database, desc: "Database backup & restore." },
  { label: "Storage Manager", href: "/admin", icon: HardDrive, desc: "Manage uploaded files." },
  { label: "Media Library", href: "/admin", icon: ImageIcon, desc: "Browse & manage media." },
  { label: "Revision History", href: "/admin", icon: History, desc: "Version control across records." },
  { label: "System Health", href: "/admin", icon: Activity, desc: "Service status & diagnostics." },
  { label: "Navigation Editor", href: "/admin", icon: PanelsTopLeft, desc: "Customize the sidebar." },
  { label: "Theme Editor", href: "/admin", icon: Palette, desc: "Adjust colors & branding." },
  { label: "Site Settings", href: "/admin", icon: Settings2, desc: "Global configuration." },
];

export default async function AdminPage() {
  const user = await requirePermission("admin.view");

  const [users, pending, scps, departments, pages, logs] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.user.count({ where: { status: "PENDING", deletedAt: null } }),
    prisma.scpObject.count({ where: { deletedAt: null } }),
    prisma.department.count({ where: { deletedAt: null } }),
    prisma.contentPage.count({ where: { deletedAt: null } }),
    prisma.auditLog.count(),
  ]);

  const visible = SECTIONS.filter((s) => {
    if (s.href === "/admin/users" || s.href === "/admin/roles") return can(user.role, "admin.users");
    if (s.href === "/admin/logs") return can(user.role, "admin.logs");
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Control Panel" title="Administration" description="Manage users, content, and site configuration." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Users" value={users} icon={Users} href="/admin/users" />
        <StatCard label="Pending Approval" value={pending} icon={ShieldCheck} href="/admin/users?status=PENDING" tone={pending > 0 ? "caution" : "success"} hint={pending > 0 ? "Action required" : "All clear"} />
        <StatCard label="Content Pages" value={pages} icon={FileText} />
        <StatCard label="Audit Entries" value={logs} icon={ScrollText} href="/admin/logs" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="group h-full transition-colors hover:border-accent/40">
              <CardContent className="flex items-start gap-4">
                <div className="flex size-10 items-center justify-center rounded-md border border-hairline/50 bg-panel-2 text-accent">
                  <s.icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground group-hover:text-accent">{s.label}</p>
                    {!s.live && <span className="rounded bg-panel-2 px-1.5 py-0.5 font-mono text-[0.55rem] uppercase tracking-wide text-muted">Soon</span>}
                  </div>
                  <p className="mt-0.5 text-xs text-muted">{s.desc}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
