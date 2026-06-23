import { Megaphone, Pin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Markdown } from "@/components/shared/markdown";
import { timeAgo } from "@/lib/utils";

export const metadata = { title: "Announcements" };

export default async function AnnouncementsPage() {
  const items = await prisma.announcement.findMany({
    where: { deletedAt: null },
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
  });

  const tone = (l: string) => (l === "alert" ? "alert" : l === "caution" ? "caution" : "accent");

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Site Bulletins" title="Announcements" description="Site-wide notices and bulletins." />
      {items.length === 0 ? (
        <EmptyState icon={Megaphone} title="No announcements" />
      ) : (
        <div className="space-y-4">
          {items.map((a) => (
            <Card key={a.id} className={a.pinned ? "border-caution/30" : undefined}>
              <CardContent className="py-5">
                <div className="mb-2 flex items-center gap-2">
                  {a.pinned && <Pin className="size-4 text-caution" />}
                  <h2 className="text-base font-semibold text-foreground">{a.title}</h2>
                  <Badge variant={tone(a.level)}>{a.level}</Badge>
                  <span className="ml-auto text-xs text-muted">{a.authorName ?? "System"} · {timeAgo(a.createdAt)}</span>
                </div>
                <Markdown content={a.body} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
