import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { PersonnelForm } from "@/components/admin/personnel-form";

export const metadata = { title: "Edit Personnel" };

export default async function EditPersonnelPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("personnel.manage");
  const { id } = await params;
  const [p, departments] = await Promise.all([
    prisma.personnel.findUnique({ where: { id } }),
    prisma.department.findMany({ where: { deletedAt: null }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  if (!p) notFound();

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin · Personnel" title={`Edit ${p.name}`} />
      <PersonnelForm
        departments={departments}
        initial={{
          id: p.id,
          name: p.name,
          rank: p.rank ?? "",
          clearance: p.clearance,
          departmentId: p.departmentId ?? "",
          position: p.position ?? "",
          status: p.status,
          portrait: p.portrait ?? "",
          biography: p.biography ?? "",
          notes: p.notes ?? "",
          tags: p.tags.join(", "),
        }}
      />
    </div>
  );
}
