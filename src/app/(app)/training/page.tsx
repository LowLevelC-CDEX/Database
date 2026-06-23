import { ContentCategoryView } from "@/components/content/content-views";

export const metadata = { title: "Training" };

export default function TrainingPage() {
  return (
    <ContentCategoryView
      category="training"
      eyebrow="Personnel Development"
      title="Training Portal"
      description="Onboarding guides, certifications, and training modules."
    />
  );
}
