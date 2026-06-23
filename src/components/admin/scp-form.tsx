"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Textarea, Label, Select } from "@/components/ui/input";
import { LogEditor, GalleryEditor, type LogEntry, type GalleryEntry } from "@/components/admin/repeatable";
import { CLEARANCE_ORDER, CLEARANCES } from "@/lib/rbac";

type ScpData = {
  id?: string;
  itemNumber: string;
  codename: string;
  objectClass: string;
  containmentClass: string;
  riskClass: string;
  disruptionClass: string;
  clearanceRequired: string;
  assignedSite: string;
  assignedDepartment: string;
  leadResearcher: string;
  containmentTeam: string;
  status: string;
  summary: string;
  containmentProcedures: string;
  description: string;
  history: string;
  tags: string;
  gallery: GalleryEntry[];
  addendums: LogEntry[];
  recoveryLogs: LogEntry[];
  experimentLogs: LogEntry[];
  incidentLogs: LogEntry[];
  crossTesting: LogEntry[];
};

export function ScpForm({ initial }: { initial?: Partial<ScpData> & { id?: string } }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [data, setData] = useState<ScpData>({
    itemNumber: initial?.itemNumber ?? "",
    codename: initial?.codename ?? "",
    objectClass: initial?.objectClass ?? "",
    containmentClass: initial?.containmentClass ?? "",
    riskClass: initial?.riskClass ?? "",
    disruptionClass: initial?.disruptionClass ?? "",
    clearanceRequired: initial?.clearanceRequired ?? "LEVEL_0",
    assignedSite: initial?.assignedSite ?? "",
    assignedDepartment: initial?.assignedDepartment ?? "",
    leadResearcher: initial?.leadResearcher ?? "",
    containmentTeam: initial?.containmentTeam ?? "",
    status: initial?.status ?? "DRAFT",
    summary: initial?.summary ?? "",
    containmentProcedures: initial?.containmentProcedures ?? "",
    description: initial?.description ?? "",
    history: initial?.history ?? "",
    tags: initial?.tags ?? "",
    gallery: initial?.gallery ?? [],
    addendums: initial?.addendums ?? [],
    recoveryLogs: initial?.recoveryLogs ?? [],
    experimentLogs: initial?.experimentLogs ?? [],
    incidentLogs: initial?.incidentLogs ?? [],
    crossTesting: initial?.crossTesting ?? [],
  });

  const set = <K extends keyof ScpData>(key: K, value: ScpData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  async function save() {
    setError(null);
    setSaving(true);
    const payload = {
      ...data,
      tags: data.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    const url = initial?.id ? `/api/scp/${initial.id}` : "/api/scp";
    const method = initial?.id ? "PATCH" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Failed to save.");
        return;
      }
      router.push(`/scp/${json.item.slug}`);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!initial?.id || !confirm("Move this SCP to trash?")) return;
    await fetch(`/api/scp/${initial.id}`, { method: "DELETE" });
    router.push("/scp");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Core Identification</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="itemNumber">Item Number *</Label>
            <Input id="itemNumber" value={data.itemNumber} onChange={(e) => set("itemNumber", e.target.value)} placeholder="SCP-080-A" />
          </div>
          <div>
            <Label htmlFor="codename">Codename</Label>
            <Input id="codename" value={data.codename} onChange={(e) => set("codename", e.target.value)} placeholder="[CLASSIFIED]" />
          </div>
          <div>
            <Label>Object Class</Label>
            <Input value={data.objectClass} onChange={(e) => set("objectClass", e.target.value)} placeholder="Safe / Euclid / Keter" />
          </div>
          <div>
            <Label>Containment Class</Label>
            <Input value={data.containmentClass} onChange={(e) => set("containmentClass", e.target.value)} />
          </div>
          <div>
            <Label>Risk Class</Label>
            <Input value={data.riskClass} onChange={(e) => set("riskClass", e.target.value)} />
          </div>
          <div>
            <Label>Disruption Class</Label>
            <Input value={data.disruptionClass} onChange={(e) => set("disruptionClass", e.target.value)} />
          </div>
          <div>
            <Label>Clearance Required</Label>
            <Select value={data.clearanceRequired} onChange={(e) => set("clearanceRequired", e.target.value)}>
              {CLEARANCE_ORDER.map((c) => (
                <option key={c} value={c}>{CLEARANCES[c].label}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={data.status} onChange={(e) => set("status", e.target.value)}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assignment</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Assigned Site</Label>
            <Input value={data.assignedSite} onChange={(e) => set("assignedSite", e.target.value)} />
          </div>
          <div>
            <Label>Assigned Department</Label>
            <Input value={data.assignedDepartment} onChange={(e) => set("assignedDepartment", e.target.value)} />
          </div>
          <div>
            <Label>Lead Researcher</Label>
            <Input value={data.leadResearcher} onChange={(e) => set("leadResearcher", e.target.value)} />
          </div>
          <div>
            <Label>Containment Team</Label>
            <Input value={data.containmentTeam} onChange={(e) => set("containmentTeam", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label>Tags (comma-separated)</Label>
            <Input value={data.tags} onChange={(e) => set("tags", e.target.value)} placeholder="humanoid, sapient, alive" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Narrative</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Summary</Label>
            <Textarea value={data.summary} onChange={(e) => set("summary", e.target.value)} />
          </div>
          <div>
            <Label>Special Containment Procedures</Label>
            <Textarea className="min-h-[140px]" value={data.containmentProcedures} onChange={(e) => set("containmentProcedures", e.target.value)} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea className="min-h-[140px]" value={data.description} onChange={(e) => set("description", e.target.value)} />
          </div>
          <div>
            <Label>History</Label>
            <Textarea value={data.history} onChange={(e) => set("history", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Media & Logs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <GalleryEditor value={data.gallery} onChange={(v) => set("gallery", v)} />
          <LogEditor label="Addendums" value={data.addendums} onChange={(v) => set("addendums", v)} />
          <LogEditor label="Recovery Logs" value={data.recoveryLogs} onChange={(v) => set("recoveryLogs", v)} />
          <LogEditor label="Experiment Logs" value={data.experimentLogs} onChange={(v) => set("experimentLogs", v)} />
          <LogEditor label="Incident Logs" value={data.incidentLogs} onChange={(v) => set("incidentLogs", v)} />
          <LogEditor label="Cross Testing" value={data.crossTesting} onChange={(v) => set("crossTesting", v)} />
        </CardContent>
      </Card>

      {error && (
        <div role="alert" className="rounded-md border border-alert/40 bg-alert/5 px-4 py-3 text-sm text-alert">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        {initial?.id ? (
          <Button type="button" variant="danger" onClick={remove}>
            <Trash2 className="size-4" /> Delete
          </Button>
        ) : (
          <span />
        )}
        <Button type="button" onClick={save} disabled={saving || !data.itemNumber}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {initial?.id ? "Save Changes" : "Create SCP"}
        </Button>
      </div>
    </div>
  );
}
