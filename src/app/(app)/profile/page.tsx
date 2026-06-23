import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/misc";
import { RoleBadge, ClearanceBadge } from "@/components/shared/clearance-badge";
import { Field } from "@/components/shared/record";
import { formatDate } from "@/lib/utils";
import { ROLES } from "@/lib/rbac";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const sessionUser = await requireAuth();
  const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Your Account" title="Profile" description="Your Foundation credentials and access record." />
      <Card glass>
        <div className="flex flex-wrap items-center gap-5 p-5">
          <Avatar name={user?.name ?? sessionUser.username} src={user?.image} className="size-20 text-xl" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{user?.name ?? sessionUser.username}</h1>
            <p className="text-sm text-muted">@{sessionUser.username} · {user?.email}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <RoleBadge role={sessionUser.role} />
              <ClearanceBadge clearance={sessionUser.clearance} />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Account Details</CardTitle></CardHeader>
          <CardContent className="py-2">
            <Field label="Username" value={sessionUser.username} mono />
            <Field label="Email" value={user?.email} />
            <Field label="Role" value={ROLES[sessionUser.role].label} />
            <Field label="Account Status" value={user?.status} />
            <Field label="Member Since" value={formatDate(user?.createdAt)} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Security</CardTitle></CardHeader>
          <CardContent className="py-2">
            <Field label="Two-Factor Auth" value={user?.twoFactorEnabled ? "Enabled" : "Disabled"} />
            <Field label="Email Verified" value={user?.emailVerified ? formatDate(user.emailVerified) : "Not verified"} />
            <Field label="Last Login" value={user?.lastLoginAt ? formatDate(user.lastLoginAt, true) : "—"} />
            <Field label="Last Login IP" value={user?.lastLoginIp} mono />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
