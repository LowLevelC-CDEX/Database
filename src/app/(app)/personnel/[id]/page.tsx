import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Pencil, Award, GraduationCap, ShieldAlert, FileText, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { can } from "@/lib/rbac";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Avatar } from "@/components/ui/misc";
import { Badge } from "@/components/ui/badge";
import { ClearanceBadge } from "@/components/shared/clearance-badge";
import { Field } from "@/components/shared/record";
import { Markdown } from "@/components/shared/markdown";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await prisma.personnel.findUnique({ where: { id } });
  return { title: p?.name ?? "Personnel" };
}

function strList(v: unknown): string[] {
  return Array.isArray(v) ? (v as string[]) : [];
}

export default async function PersonnelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await prisma.personnel.findUnique({
    where: { id },
    include: { department: true, supervisor: true, user: { select: { lastLoginAt: true, role: true } } },
  });
  if (!p || p.deletedAt) notFound();

  const user = await getCurrentUser();
  const manage = can(user?.role, "personnel.manage");
  const training = strList(p.training);
  const awards = strList(p.awards);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/personnel" className="flex items-center gap-1 text-xs text-muted hover:text-foreground">
          <ChevronLeft className="size-4" /> Personnel
        </Link>
        {manage && (
          <Link href={`/admin/personnel/${p.id}/edit`} className={buttonVariants({ variant: "secondary", size: "sm" })}>
            <Pencil className="size-3.5" /> Edit
          </Link>
        )}
      </div>

      <Card glass>
        <div className="flex flex-wrap items-center gap-5 p-5">
          <Avatar name={p.name} src={p.portrait} className="size-20 text-xl" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{p.name}</h1>
            <p className="text-sm text-muted">{p.position ?? p.rank ?? "Personnel"}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <ClearanceBadge clearance={p.clearance} />
              {p.department && <Badge variant="accent">{p.department.name}</Badge>}
              <Badge variant={p.status === "Active" ? "success" : "caution"}>{p.status}</Badge>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Service Record</CardTitle></CardHeader>
            <CardContent className="py-2">
              <Field label="Rank" value={p.rank} />
              <Field label="Department" value={p.department?.name} />
              <Field label="Position" value={p.position} />
              <Field label="Supervisor" value={p.supervisor?.name} />
              <Field label="Status" value={p.status} />
              <Field label="Last Login" value={p.user?.lastLoginAt ? formatDate(p.user.lastLoginAt, true) : "—"} />
            </CardContent>
          </Card>
        </aside>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="size-4 text-accent" /> Biography</CardTitle></CardHeader>
            <CardContent>
              <Markdown content={p.biography ?? "_No biography on file._"} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><GraduationCap className="size-4 text-accent" /> Training</CardTitle></CardHeader>
              <CardContent>
                {training.length ? (
                  <ul className="space-y-1.5 text-sm text-foreground/90">{training.map((t, i) => <li key={i} className="flex gap-2"><span className="text-accent">›</span>{t}</li>)}</ul>
                ) : <p className="text-sm text-muted">No training records.</p>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Award className="size-4 text-accent" /> Awards</CardTitle></CardHeader>
              <CardContent>
                {awards.length ? (
                  <ul className="space-y-1.5 text-sm text-foreground/90">{awards.map((t, i) => <li key={i} className="flex gap-2"><span className="text-caution">★</span>{t}</li>)}</ul>
                ) : <p className="text-sm text-muted">No awards on file.</p>}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><ShieldAlert className="size-4 text-caution" /> Disciplinary Actions</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted">No disciplinary actions on record.</p>
            </CardContent>
          </Card>

          {p.notes && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="size-4 text-accent" /> Notes</CardTitle></CardHeader>
              <CardContent><Markdown content={p.notes} /></CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
