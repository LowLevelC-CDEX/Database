"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";

export type LogEntry = { title?: string; date?: string; body: string };

export function LogEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: LogEntry[];
  onChange: (v: LogEntry[]) => void;
}) {
  const add = () => onChange([...value, { title: "", date: "", body: "" }]);
  const update = (i: number, patch: Partial<LogEntry>) =>
    onChange(value.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <Label className="mb-0">{label}</Label>
        <Button type="button" variant="ghost" size="sm" onClick={add}>
          <Plus className="size-3.5" /> Add entry
        </Button>
      </div>
      <div className="space-y-3">
        {value.length === 0 && <p className="text-xs text-muted">No entries. Click &quot;Add entry&quot; to create one.</p>}
        {value.map((item, i) => (
          <div key={i} className="rounded-md border border-hairline/50 bg-panel-2/40 p-3">
            <div className="mb-2 flex gap-2">
              <Input placeholder="Title" value={item.title ?? ""} onChange={(e) => update(i, { title: e.target.value })} />
              <Input placeholder="Date" value={item.date ?? ""} onChange={(e) => update(i, { date: e.target.value })} className="max-w-[160px]" />
              <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)} aria-label="Remove entry">
                <Trash2 className="size-4 text-alert" />
              </Button>
            </div>
            <Textarea placeholder="Body (Markdown supported)" value={item.body} onChange={(e) => update(i, { body: e.target.value })} />
          </div>
        ))}
      </div>
    </div>
  );
}

export type GalleryEntry = { url: string; caption?: string };

export function GalleryEditor({
  value,
  onChange,
}: {
  value: GalleryEntry[];
  onChange: (v: GalleryEntry[]) => void;
}) {
  const add = () => onChange([...value, { url: "", caption: "" }]);
  const update = (i: number, patch: Partial<GalleryEntry>) =>
    onChange(value.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <Label className="mb-0">Image Gallery</Label>
        <Button type="button" variant="ghost" size="sm" onClick={add}>
          <Plus className="size-3.5" /> Add image
        </Button>
      </div>
      <div className="space-y-2">
        {value.length === 0 && <p className="text-xs text-muted">No images.</p>}
        {value.map((item, i) => (
          <div key={i} className="flex gap-2">
            <Input placeholder="Image URL" value={item.url} onChange={(e) => update(i, { url: e.target.value })} />
            <Input placeholder="Caption" value={item.caption ?? ""} onChange={(e) => update(i, { caption: e.target.value })} />
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)} aria-label="Remove image">
              <Trash2 className="size-4 text-alert" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
