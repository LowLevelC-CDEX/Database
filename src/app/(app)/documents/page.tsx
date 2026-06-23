import { ContentCategoryView } from "@/components/content/content-views";

export const metadata = { title: "Documents" };

export default function DocumentsPage() {
  return (
    <ContentCategoryView
      category="documents"
      eyebrow="Document Repository"
      title="Documents"
      description="Official Foundation documents, memos, and reference materials."
    />
  );
}
