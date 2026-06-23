import { ContentCategoryView } from "@/components/content/content-views";

export const metadata = { title: "Rules" };

export default function RulesPage() {
  return (
    <ContentCategoryView
      category="rules"
      eyebrow="Policy & Conduct"
      title="Rules & Regulations"
      description="Site-wide rules, policies, and codes of conduct. Each section is fully editable."
    />
  );
}
