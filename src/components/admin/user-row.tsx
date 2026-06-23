"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { Avatar } from "@/components/ui/misc";
import { ROLE_ORDER, ROLES, CLEARANCE_ORDER, CLEARANCES } from "@/lib/rbac";

const STATUSES = ["PENDING", "ACTIVE", "SUSPENDED", "LOCKED", "ARCHIVED"];

export function UserRow({
  user,
}: {
  user: { id: string; name: string | null; username: string; email: string; role: string; clearance: string; status: string; image: string | null };
}) {
  const router = useRouter();
  const [role, setRole] = useState(user.role);
  const [clearance, setClearance] = useState(user.clearance);
  const [status, setStatus] = useState(user.status);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const dirty = role !== user.role || clearance !== user.clearance || status !== user.status;

  async function save() {
    setSaving(true);
    setSaved(false);
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, clearance, status }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 1500);
    } else {
      const j = await res.json();
      alert(j.error ?? "Failed to update");
    }
  }

  async function remove() {
    if (!confirm(`Archive ${user.username}?`)) return;
    const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else alert("Failed to delete");
  }

  const statusColor =
    status === "ACTIVE" ? "text-success" : status === "PENDING" ? "text-caution" : "text-alert";

  return (
    <tr className="border-b border-hairline/30 align-middle">
      <td className="py-3 pr-3">
        <div className="flex items-center gap-3">
          <Avatar name={user.name ?? user.username} src={user.image} className="size-9" />
          <div className="min-w-0">
            <p className="truncate text-sm text-foreground">{user.name ?? user.username}</p>
            <p className="truncate text-xs text-muted">@{user.username}</p>
          </div>
        </div>
      </td>
      <td className="hidden px-3 text-xs text-muted md:table-cell">{user.email}</td>
      <td className="px-3">
        <Select value={role} onChange={(e) => setRole(e.target.value)} className="h-8 min-w-[150px] text-xs">
          {ROLE_ORDER.map((r) => <option key={r} value={r}>{ROLES[r].label}</option>)}
        </Select>
      </td>
      <td className="px-3">
        <Select value={clearance} onChange={(e) => setClearance(e.target.value)} className="h-8 min-w-[90px] text-xs">
          {CLEARANCE_ORDER.map((c) => <option key={c} value={c}>{CLEARANCES[c].short}</option>)}
        </Select>
      </td>
      <td className="px-3">
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className={`h-8 min-w-[120px] text-xs ${statusColor}`}>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
      </td>
      <td className="py-3 pl-3">
        <div className="flex items-center justify-end gap-1.5">
          <Button size="sm" variant={dirty ? "default" : "ghost"} onClick={save} disabled={!dirty || saving}>
            {saving ? <Loader2 className="size-3.5 animate-spin" /> : saved ? <Check className="size-3.5" /> : "Save"}
          </Button>
          <Button size="icon" variant="ghost" onClick={remove} aria-label="Archive user" className="size-8">
            <Trash2 className="size-3.5 text-alert" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
