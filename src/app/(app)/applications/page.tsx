import { ModulePlaceholder } from "@/components/content/module-placeholder";

export const metadata = { title: "Applications" };

export default function ApplicationsPage() {
  return (
    <ModulePlaceholder
      eyebrow="Recruitment & Requests"
      title="Applications"
      description="Department transfers, role applications, and access requests."
      features={["Department Applications", "Role Requests", "Access Requests", "Research Submission System", "Review Workflow"]}
    />
  );
}
