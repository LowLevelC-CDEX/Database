import * as React from "react";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-panel-2/80",
        "after:absolute after:inset-0 after:-translate-x-full after:animate-shimmer after:bg-gradient-to-r after:from-transparent after:via-white/5 after:to-transparent",
        className,
      )}
      {...props}
    />
  );
}

export function Separator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("h-px w-full bg-hairline/50", className)} role="separator" {...props} />;
}

export function Avatar({
  src,
  name,
  className,
}: {
  src?: string | null;
  name?: string | null;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden rounded-md border border-hairline/60 bg-gunmetal text-xs font-semibold text-accent",
        className,
      )}
      aria-hidden={!name}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src ? <img src={src} alt={name ?? ""} className="h-full w-full object-cover" /> : initials(name)}
    </div>
  );
}
