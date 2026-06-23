import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ContentDetailView } from "@/components/content/content-views";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await prisma.contentPage.findFirst({ where: { slug, category: "research" } });
  return { title: p?.title ?? "Research" };
}

export default async function ResearchDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  await requirePermission("research.view");
  const { slug } = await params;
  const view = await ContentDetailView({ category: "research", slug });
  if (!view) notFound();
  return view;
}
