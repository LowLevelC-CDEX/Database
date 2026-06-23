"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, CornerDownLeft, FileSearch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SearchResult } from "@/app/api/search/route";

const FILTERS = ["all", "scp", "personnel", "department", "document", "incident", "operation", "faction"];

export function GlobalSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // ⌘K / Ctrl+K opens; handled at window level.
  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${filter}`, {
          signal: ctrl.signal,
        });
        const data = await res.json();
        setResults(data.results ?? []);
        setActive(0);
      } catch {
        /* aborted */
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query, filter, open]);

  const go = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [onClose, router],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    }
    if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active].href);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-ink/70 p-4 pt-[12vh] backdrop-blur-sm" onClick={onClose}>
      <div
        className="glass w-full max-w-2xl overflow-hidden rounded-xl shadow-glass"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Global search"
      >
        <div className="flex items-center gap-3 border-b border-hairline/50 px-4">
          <Search className="size-5 text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search personnel, SCPs, departments, documents…"
            className="h-14 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted/60"
          />
          {loading && <Loader2 className="size-4 animate-spin text-muted" />}
        </div>

        <div className="flex flex-wrap gap-1.5 border-b border-hairline/40 px-4 py-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-wide transition-colors ${
                filter === f ? "bg-accent/20 text-accent" : "text-muted hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center text-muted">
              <FileSearch className="size-7" />
              <p className="text-sm">{query.length < 2 ? "Type at least 2 characters" : "No results found"}</p>
            </div>
          ) : (
            <ul>
              {results.map((r, i) => (
                <li key={`${r.href}-${i}`}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r.href)}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors ${
                      i === active ? "bg-accent/10" : "hover:bg-panel-2"
                    }`}
                  >
                    <Badge variant="accent">{r.type}</Badge>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-foreground">{r.label}</p>
                      {r.sublabel && <p className="truncate text-xs text-muted">{r.sublabel}</p>}
                    </div>
                    {i === active && <CornerDownLeft className="size-4 text-muted" />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
