import React from "react";

// Minimal, XSS-safe Markdown renderer.
// Renders to React elements (no dangerouslySetInnerHTML) so user content
// is always escaped. Supports headings, bold/italic/code, lists, quotes, hr.

function renderInline(text: string, keyBase: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Split on **bold**, *italic*, `code`
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  const parts = text.split(regex);
  parts.forEach((part, i) => {
    if (!part) return;
    const key = `${keyBase}-${i}`;
    if (part.startsWith("**") && part.endsWith("**")) {
      nodes.push(<strong key={key} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>);
    } else if (part.startsWith("`") && part.endsWith("`")) {
      nodes.push(
        <code key={key} className="rounded bg-ink/70 px-1.5 py-0.5 font-mono text-[0.85em] text-accent">
          {part.slice(1, -1)}
        </code>,
      );
    } else if (part.startsWith("*") && part.endsWith("*")) {
      nodes.push(<em key={key} className="italic">{part.slice(1, -1)}</em>);
    } else {
      nodes.push(<React.Fragment key={key}>{part}</React.Fragment>);
    }
  });
  return nodes;
}

export function Markdown({ content, className }: { content: string; className?: string }) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = (key: string) => {
    if (listBuffer.length) {
      blocks.push(
        <ul key={key} className="my-3 list-disc space-y-1 pl-5 text-sm text-foreground/90">
          {listBuffer.map((item, i) => (
            <li key={i}>{renderInline(item, `${key}-${i}`)}</li>
          ))}
        </ul>,
      );
      listBuffer = [];
    }
  };

  lines.forEach((raw, idx) => {
    const line = raw.trimEnd();
    const key = `b-${idx}`;
    if (/^\s*[-*]\s+/.test(line)) {
      listBuffer.push(line.replace(/^\s*[-*]\s+/, ""));
      return;
    }
    flushList(`l-${idx}`);
    if (!line.trim()) return;
    if (line.startsWith("### ")) {
      blocks.push(<h3 key={key} className="mt-5 mb-2 text-sm font-semibold tracking-wide text-accent">{renderInline(line.slice(4), key)}</h3>);
    } else if (line.startsWith("## ")) {
      blocks.push(<h2 key={key} className="mt-6 mb-2 text-base font-semibold text-foreground">{renderInline(line.slice(3), key)}</h2>);
    } else if (line.startsWith("# ")) {
      blocks.push(<h1 key={key} className="mt-2 mb-3 text-lg font-bold text-foreground">{renderInline(line.slice(2), key)}</h1>);
    } else if (line.startsWith("> ")) {
      blocks.push(
        <blockquote key={key} className="my-3 border-l-2 border-accent/50 bg-panel-2/50 px-4 py-2 text-sm italic text-muted">
          {renderInline(line.slice(2), key)}
        </blockquote>,
      );
    } else if (/^---+$/.test(line)) {
      blocks.push(<hr key={key} className="my-4 border-hairline/50" />);
    } else {
      blocks.push(<p key={key} className="my-2 text-sm leading-relaxed text-foreground/90">{renderInline(line, key)}</p>);
    }
  });
  flushList("l-final");

  return <div className={className}>{blocks}</div>;
}
