import Link from "next/link";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  href,
  tone = "accent",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  href?: string;
  tone?: "accent" | "caution" | "alert" | "success";
}) {
  const toneMap = {
    accent: "text-accent border-accent/30 bg-accent/10",
    caution: "text-caution border-caution/30 bg-caution/10",
    alert: "text-alert border-alert/30 bg-alert/10",
    success: "text-success border-success/30 bg-success/10",
  };

  const inner = (
    <div className="panel group relative overflow-hidden rounded-lg p-4 transition-colors hover:border-accent/40">
      <div className="flex items-start justify-between">
        <div>
          <p className="label-mono">{label}</p>
          <p className="mt-2 font-mono text-2xl font-bold text-foreground">{value}</p>
          {hint && <p className="mt-1 text-[0.66rem] text-muted">{hint}</p>}
        </div>
        <div className={cn("flex size-9 items-center justify-center rounded-md border", toneMap[tone])}>
          <Icon className="size-[18px]" />
        </div>
      </div>
    </div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}
