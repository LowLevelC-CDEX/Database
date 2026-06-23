"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Textarea, Label, Select } from "@/components/ui/input";
import { Markdown } from "@/components/shared/markdown";

type Data = {
  category: string;
  title: string;
  excerpt: string;
  body: string;
  order: number;
  status: string;
  tags: string;
};

const CATEGORIES = ["rules", "documents", "research", "training"];

export function ContentForm({ initial }: { initial?: Partial<Data> & { id?: string } }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [data, setData] = useState<Data>({
    category: initial?.category ?? "documents",
    title: initial?.title ?? "",
    excerpt: initial?.excerpt ?? "",
    body: initial?.body ?? "",
    order: initial?.order ?? 0,
    status: initial?.status ?? "PUBLISHED",
    tags: initial?.tags ?? "",
  });

  const set = <K extends keyof Data>(k: K, v: Data[K]) => setData((d) => ({ ...d, [k]: v }));

  async function save() {
    setError(null);
    setSaving(true);
    const payload = { ...data, order: Number(data.order) || 0, tags: data.tags.split(",").map((t) => t.trim()).filter(Boolean) };
    const url = initial?.id ? `/api/content/${initial.id}` : "/api/content";
    try {
      const res = await fetch(url, {
        method: initial?.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) return setError(json.error ?? "Failed to save.");
      router.push(`/${json.item.category}/${json.item.slug}`);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!initial?.id || !confirm("Delete this page?")) return;
    await fetch(`/api/content/${initial.id}`, { method: "DELETE" });
    router.push(`/${data.category}`);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Page Details</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div><Label>Title *</Label><Input value={data.title} onChange={(e) => set("title", e.target.value)} /></div>
          <div>
            <Label>Category</Label>
            <Select value={data.category} onChange={(e) => set("category", e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>
          <div><Label>Order</Label><Input type="number" value={data.order} onChange={(e) => set("order", Number(e.target.value))} /></div>
          <div>
            <Label>Status</Label>
            <Select value={data.status} onChange={(e) => set("status", e.target.value)}>
              <option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option><option value="ARCHIVED">Archived</option>
            </Select>
          </div>
          <div className="sm:col-span-2"><Label>Excerpt</Label><Input value={data.excerpt} onChange={(e) => set("excerpt", e.target.value)} /></div>
          <div className="sm:col-span-2"><Label>Tags (comma-separated)</Label><Input value={data.tags} onChange={(e) => set("tags", e.target.value)} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Content (Markdown)</CardTitle>
          <Button type="button" variant="ghost" size="sm" onClick={() => setPreview((p) => !p)}>
            <Eye className="size-3.5" /> {preview ? "Edit" : "Preview"}
          </Button>
        </CardHeader>
        <CardContent>
          {preview ? (
            <div className="min-h-[200px] rounded-md border border-hairline/40 bg-panel-2/30 p-4">
              <Markdown content={data.body || "_Nothing to preview._"} />
            </div>
          ) : (
            <Textarea className="min-h-[300px] font-mono text-xs" value={data.body} onChange={(e) => set("body", e.target.value)} placeholder="# Heading&#10;&#10;Write content using **Markdown**…" />
          )}
        </CardContent>
      </Card>

      {error && <div role="alert" className="rounded-md border border-alert/40 bg-alert/5 px-4 py-3 text-sm text-alert">{error}</div>}

      <div className="flex items-center justify-between">
        {initial?.id ? <Button type="button" variant="danger" onClick={remove}><Trash2 className="size-4" /> Delete</Button> : <span />}
        <Button type="button" onClick={save} disabled={saving || !data.title || !data.body}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {initial?.id ? "Save Changes" : "Create Page"}
        </Button>
      </div>
    </div>
  );
}
