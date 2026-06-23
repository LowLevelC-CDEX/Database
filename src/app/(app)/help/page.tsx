import Link from "next/link";
import { LifeBuoy, BookOpen, Keyboard, ShieldQuestion } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Help" };

const TOPICS = [
  { icon: BookOpen, title: "Getting Started", body: "Learn how to navigate the database, use search, and find records." },
  { icon: Keyboard, title: "Keyboard Shortcuts", body: "Press ⌘K (or Ctrl+K) anywhere to open global search." },
  { icon: ShieldQuestion, title: "Clearance & Access", body: "Your visible sections depend on your assigned role and clearance level." },
];

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Support" title="Help Center" description="Guidance for using the Site-80 secure database." />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {TOPICS.map((t) => (
          <Card key={t.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><t.icon className="size-4 text-accent" /> {t.title}</CardTitle>
            </CardHeader>
            <CardContent><p className="text-sm text-muted">{t.body}</p></CardContent>
          </Card>
        ))}
      </div>
      <Card glass>
        <CardContent className="flex items-center gap-4 py-6">
          <LifeBuoy className="size-8 text-accent" />
          <div>
            <p className="text-sm font-medium text-foreground">Need more help?</p>
            <p className="text-xs text-muted">Contact your Department Director or an administrator. View the <Link href="/rules" className="text-accent hover:underline">Rules</Link> section for policies.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
