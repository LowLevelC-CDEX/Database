import { Check, Minus } from "lucide-react";
import { requirePermission } from "@/lib/session";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ROLE_ORDER, ROLES, ROLE_PERMISSIONS, type Permission } from "@/lib/rbac";

export const metadata = { title: "Roles & Permissions" };

const ALL_PERMISSIONS: Permission[] = [
  "dashboard.view", "scp.view", "scp.manage", "personnel.view", "personnel.manage",
  "departments.view", "factions.view", "operations.view", "incidents.view",
  "research.view", "security.view", "medical.view", "engineering.view", "containment.view",
  "documents.view", "rules.view", "content.manage", "admin.view", "admin.users", "admin.logs",
];

export default async function RolesPage() {
  await requirePermission("admin.users");

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin · Access Control" title="Roles & Permissions" description="The role-based permission matrix enforced across every page and API route." />
      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[900px] text-xs">
            <thead>
              <tr className="border-b border-hairline/50">
                <th className="sticky left-0 bg-panel px-4 py-3 text-left font-semibold uppercase tracking-wider text-muted">Permission</th>
                {ROLE_ORDER.map((r) => (
                  <th key={r} className="px-2 py-3 text-center font-medium text-muted">
                    <span className="inline-block max-w-[64px] truncate" title={ROLES[r].label}>{ROLES[r].label}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALL_PERMISSIONS.map((perm) => (
                <tr key={perm} className="border-b border-hairline/20">
                  <td className="sticky left-0 bg-panel px-4 py-2 font-mono text-muted">{perm}</td>
                  {ROLE_ORDER.map((r) => {
                    const has = ROLE_PERMISSIONS[r].includes(perm);
                    return (
                      <td key={r} className="px-2 py-2 text-center">
                        {has ? <Check className="mx-auto size-3.5 text-success" /> : <Minus className="mx-auto size-3.5 text-muted/40" />}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
