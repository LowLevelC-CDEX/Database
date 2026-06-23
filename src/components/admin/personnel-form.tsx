"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Textarea, Label, Select } from "@/components/ui/input";
import { CLEARANCE_ORDER, CLEARANCES } from "@/lib/rbac";

type Data = {
  name: string;
  rank: string;
  clearance: string;
  departmentId: string;
  position: string;
  status: string;
  portrait: string;
  biography: string;
  notes: string;
  tags: string;
};

export function PersonnelForm({
  initial,
  departments,
}: {
  initial?: Partial<Data> & { id?: string };
  departments: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<Data>({
    name: initial?.name ?? "",
    rank: initial?.rank ?? "",
    clearance: initial?.clearance ?? "LEVEL_0",
    departmentId: initial?.departmentId ?? "",
    position: initial?.position ?? "",
    status: initial?.status ?? "Active",
    portrait: initial?.portrait ?? "",
    biography: initial?.biography ?? "",
    notes: initial?.notes ?? "",
    tags: initial?.tags ?? "",
  });

  const set = <K extends keyof Data>(k: K, v: Data[K]) => setData((d) => ({ ...d, [k]: v }));

  async function save() {
    setError(null);
    setSaving(true);
    const payload = { ...data, tags: data.tags.split(",").map((t) => t.trim()).filter(Boolean) };
    const url = initial?.id ? `/api/personnel/${initial.id}` : "/api/personnel";
    try {
      const res = await fetch(url, {
        method: initial?.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) return setError(json.error ?? "Failed to save.");
      router.push(`/personnel/${json.item.id}`);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!initial?.id || !confirm("Archive this personnel record?")) return;
    await fetch(`/api/personnel/${initial.id}`, { method: "DELETE" });
    router.push("/personnel");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Identity</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div><Label>Name *</Label><Input value={data.name} onChange={(e) => set("name", e.target.value)} /></div>
          <div><Label>Rank</Label><Input value={data.rank} onChange={(e) => set("rank", e.target.value)} /></div>
          <div><Label>Position</Label><Input value={data.position} onChange={(e) => set("position", e.target.value)} /></div>
          <div>
            <Label>Department</Label>
            <Select value={data.departmentId} onChange={(e) => set("departmentId", e.target.value)}>
              <option value="">— None —</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </Select>
          </div>
          <div>
            <Label>Clearance</Label>
            <Select value={data.clearance} onChange={(e) => set("clearance", e.target.value)}>
              {CLEARANCE_ORDER.map((c) => <option key={c} value={c}>{CLEARANCES[c].label}</option>)}
            </Select>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={data.status} onChange={(e) => set("status", e.target.value)}>
              <option>Active</option><option>On Assignment</option><option>On Leave</option>
              <option>Suspended</option><option>Deceased</option><option>Terminated</option>
            </Select>
          </div>
          <div className="sm:col-span-2"><Label>Portrait URL</Label><Input value={data.portrait} onChange={(e) => set("portrait", e.target.value)} placeholder="https://…" /></div>
          <div className="sm:col-span-2"><Label>Tags (comma-separated)</Label><Input value={data.tags} onChange={(e) => set("tags", e.target.value)} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Records</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Biography</Label><Textarea className="min-h-[120px]" value={data.biography} onChange={(e) => set("biography", e.target.value)} /></div>
          <div><Label>Notes</Label><Textarea value={data.notes} onChange={(e) => set("notes", e.target.value)} /></div>
        </CardContent>
      </Card>

      {error && <div role="alert" className="rounded-md border border-alert/40 bg-alert/5 px-4 py-3 text-sm text-alert">{error}</div>}

      <div className="flex items-center justify-between">
        {initial?.id ? <Button type="button" variant="danger" onClick={remove}><Trash2 className="size-4" /> Delete</Button> : <span />}
        <Button type="button" onClick={save} disabled={saving || !data.name}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {initial?.id ? "Save Changes" : "Create Record"}
        </Button>
      </div>
    </div>
  );
}
