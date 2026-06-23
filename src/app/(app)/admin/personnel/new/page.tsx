import { requirePermission } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { PersonnelForm } from "@/components/admin/personnel-form";

export const metadata = { title: "New Personnel" };

export default async function NewPersonnelPage() {
  await requirePermission("personnel.manage");
  const departments = await prisma.department.findMany({ where: { deletedAt: null }, select: { id: true, name: true }, orderBy: { name: "asc" } });
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin · Personnel" title="Create Personnel Record" />
      <PersonnelForm departments={departments} />
    </div>
  );
}
