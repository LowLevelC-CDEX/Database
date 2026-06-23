import { cn } from "@/lib/utils";
import { Markdown } from "@/components/shared/markdown";

export function Field({ label, value, mono }: { label: string; value?: React.ReactNode; mono?: boolean }) {
  return (
    <div className="border-b border-hairline/30 py-2 last:border-0">
      <p className="label-mono">{label}</p>
      <p className={cn("mt-0.5 text-sm text-foreground", mono && "font-mono")}>
        {value || <span className="text-muted">—</span>}
      </p>
    </div>
  );
}

export function FieldGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("grid grid-cols-2 gap-x-6", className)}>{children}</div>;
}

export function Section({
  id,
  title,
  children,
  classified,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
  classified?: boolean;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="mb-3 flex items-center gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">{title}</h2>
        <div className="h-px flex-1 bg-hairline/40" />
        {classified && (
          <span className="font-mono text-[0.6rem] uppercase tracking-widest text-caution">Classified</span>
        )}
      </div>
      <div className="text-sm leading-relaxed text-foreground/90">{children}</div>
    </section>
  );
}

type LogItem = { title?: string; date?: string; body: string };

export function LogList({ items, emptyLabel = "No entries recorded." }: { items?: unknown; emptyLabel?: string }) {
  const list = Array.isArray(items) ? (items as LogItem[]) : [];
  if (list.length === 0) return <p className="text-sm text-muted">{emptyLabel}</p>;
  return (
    <div className="space-y-3">
      {list.map((item, i) => (
        <div key={i} className="rounded-md border border-hairline/40 bg-panel-2/40 p-4">
          {(item.title || item.date) && (
            <div className="mb-1.5 flex items-center justify-between">
              {item.title && <p className="text-sm font-semibold text-foreground">{item.title}</p>}
              {item.date && <p className="font-mono text-[0.62rem] text-muted">{item.date}</p>}
            </div>
          )}
          <Markdown content={item.body} />
        </div>
      ))}
    </div>
  );
}
