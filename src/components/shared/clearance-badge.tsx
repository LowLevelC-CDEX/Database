import type { Role, Clearance } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { ROLES, CLEARANCES } from "@/lib/rbac";
import { ShieldCheck } from "lucide-react";

function variantFor(color: string): "accent" | "caution" | "alert" | "default" {
  if (color === "accent") return "accent";
  if (color === "caution") return "caution";
  if (color === "alert") return "alert";
  return "default";
}

export function RoleBadge({ role }: { role: Role }) {
  const meta = ROLES[role];
  return <Badge variant={variantFor(meta.color)}>{meta.label}</Badge>;
}

export function ClearanceBadge({ clearance }: { clearance: Clearance }) {
  const meta = CLEARANCES[clearance];
  const variant = meta.level >= 4 ? "alert" : meta.level >= 3 ? "caution" : "accent";
  return (
    <Badge variant={variant}>
      <ShieldCheck className="size-3" />
      {meta.short}
    </Badge>
  );
}
