import Link from "next/link";
import { requirePermission } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { UserRow } from "@/components/admin/user-row";

export const metadata = { title: "Manage Users" };

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requirePermission("admin.users");
  const { status } = await searchParams;

  const users = await prisma.user.findMany({
    where: { deletedAt: null, ...(status ? { status: status as never } : {}) },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    select: { id: true, name: true, username: true, email: true, role: true, clearance: true, status: true, image: true },
  });

  const filters = ["all", "PENDING", "ACTIVE", "SUSPENDED", "LOCKED"];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin · Access Control" title="Manage Users" description="Approve accounts and assign roles, clearance, and status." />

      <div className="flex flex-wrap gap-1.5">
        {filters.map((f) => {
          const active = (f === "all" && !status) || status === f;
          return (
            <Link key={f} href={f === "all" ? "/admin/users" : `/admin/users?status=${f}`} className={`rounded-md border px-3 py-1.5 text-xs ${active ? "border-accent/50 bg-accent/10 text-accent" : "border-hairline/60 text-muted hover:text-foreground"}`}>
              {f}
            </Link>
          );
        })}
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b border-hairline/50 text-left">
                <th className="px-4 py-3 text-[0.62rem] font-semibold uppercase tracking-wider text-muted">User</th>
                <th className="hidden px-3 py-3 text-[0.62rem] font-semibold uppercase tracking-wider text-muted md:table-cell">Email</th>
                <th className="px-3 py-3 text-[0.62rem] font-semibold uppercase tracking-wider text-muted">Role</th>
                <th className="px-3 py-3 text-[0.62rem] font-semibold uppercase tracking-wider text-muted">Clearance</th>
                <th className="px-3 py-3 text-[0.62rem] font-semibold uppercase tracking-wider text-muted">Status</th>
                <th className="px-4 py-3 text-right text-[0.62rem] font-semibold uppercase tracking-wider text-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="px-2">
              {users.map((u) => <UserRow key={u.id} user={u} />)}
            </tbody>
          </table>
          {users.length === 0 && <p className="px-4 py-8 text-center text-sm text-muted">No users found.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
