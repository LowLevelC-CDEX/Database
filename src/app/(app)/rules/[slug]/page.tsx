import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ContentDetailView } from "@/components/content/content-views";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await prisma.contentPage.findFirst({ where: { slug, category: "rules" } });
  return { title: p?.title ?? "Rules" };
}

export default async function RuleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const view = await ContentDetailView({ category: "rules", slug });
  if (!view) notFound();
  return view;
}
