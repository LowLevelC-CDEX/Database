import { Construction } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ModulePlaceholder({
  eyebrow,
  title,
  description,
  features,
}: {
  eyebrow: string;
  title: string;
  description: string;
  features: string[];
}) {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <Card glass>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="stripes flex size-16 items-center justify-center rounded-xl border border-caution/30">
            <Construction className="size-8 text-caution" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Module Scaffolded — Ready for Expansion</p>
            <p className="mx-auto mt-1 max-w-md text-xs text-muted">
              This module is architected and routed. Planned capabilities are listed below; wire up data and UI when ready.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {features.map((f) => (
              <Badge key={f} variant="accent">{f}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
