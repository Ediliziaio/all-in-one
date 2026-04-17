import { useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bold, Italic, Heading2, List, ListOrdered, Link2, Code, Quote } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}

export function MarkdownEditor({ value, onChange, rows = 12, placeholder }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const wrap = useCallback((before: string, after = before, placeholder = "testo") => {
    const ta = ref.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const sel = value.slice(start, end) || placeholder;
    const next = value.slice(0, start) + before + sel + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + before.length;
      ta.setSelectionRange(pos, pos + sel.length);
    });
  }, [value, onChange]);

  const prefixLine = useCallback((prefix: string) => {
    const ta = ref.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const before = value.slice(0, start);
    const sel = value.slice(start, end);
    const after = value.slice(end);
    const lineStart = before.lastIndexOf("\n") + 1;
    const target = value.slice(lineStart, end);
    const replaced = target.split("\n").map(l => prefix + l).join("\n");
    const next = value.slice(0, lineStart) + replaced + after;
    onChange(next);
    requestAnimationFrame(() => ta.focus());
  }, [value, onChange]);

  const insertLink = useCallback(() => {
    const url = window.prompt("URL del link", "https://");
    if (!url) return;
    wrap("[", `](${url})`, "testo");
  }, [wrap]);

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    const k = e.key.toLowerCase();
    if (k === "b") { e.preventDefault(); wrap("**"); }
    else if (k === "i") { e.preventDefault(); wrap("*"); }
    else if (k === "k") { e.preventDefault(); insertLink(); }
  };

  // Re-bind ref after value updates so wrap() reads latest selection
  useEffect(() => {}, [value]);

  const Btn = ({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) => (
    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title={title} onClick={onClick}>
      {children}
    </Button>
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-0.5 p-1 rounded-md border bg-muted/30">
        <Btn title="Grassetto (Ctrl+B)" onClick={() => wrap("**")}><Bold className="h-3.5 w-3.5" /></Btn>
        <Btn title="Corsivo (Ctrl+I)" onClick={() => wrap("*")}><Italic className="h-3.5 w-3.5" /></Btn>
        <Btn title="Titolo H2" onClick={() => prefixLine("## ")}><Heading2 className="h-3.5 w-3.5" /></Btn>
        <div className="w-px h-5 bg-border mx-1" />
        <Btn title="Lista puntata" onClick={() => prefixLine("- ")}><List className="h-3.5 w-3.5" /></Btn>
        <Btn title="Lista numerata" onClick={() => prefixLine("1. ")}><ListOrdered className="h-3.5 w-3.5" /></Btn>
        <Btn title="Citazione" onClick={() => prefixLine("> ")}><Quote className="h-3.5 w-3.5" /></Btn>
        <div className="w-px h-5 bg-border mx-1" />
        <Btn title="Link (Ctrl+K)" onClick={insertLink}><Link2 className="h-3.5 w-3.5" /></Btn>
        <Btn title="Codice inline" onClick={() => wrap("`")}><Code className="h-3.5 w-3.5" /></Btn>
      </div>
      <Textarea
        ref={ref}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKey}
        placeholder={placeholder}
        className="font-mono text-sm"
      />
    </div>
  );
}
