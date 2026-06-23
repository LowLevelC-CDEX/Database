import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[0.68rem] font-medium tracking-wide font-mono uppercase",
  {
    variants: {
      variant: {
        default: "border-hairline/60 bg-panel-2 text-muted",
        accent: "border-accent/40 bg-accent/10 text-accent",
        caution: "border-caution/40 bg-caution/10 text-caution",
        alert: "border-alert/50 bg-alert/10 text-alert",
        success: "border-success/40 bg-success/10 text-success",
        outline: "border-hairline/60 text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
