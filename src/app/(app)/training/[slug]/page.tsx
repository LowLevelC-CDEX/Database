import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ContentDetailView } from "@/components/content/content-views";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await prisma.contentPage.findFirst({ where: { slug, category: "training" } });
  return { title: p?.title ?? "Training" };
}

export default async function TrainingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const view = await ContentDetailView({ category: "training", slug });
  if (!view) notFound();
  return view;
}
