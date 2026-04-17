// Lightweight markdown parser for live preview (no deps).
// Supports: ## H2, ### H3, **bold**, *italic*, `code`, [link](url),
// - / 1. lists, > quote, paragraphs.

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function parseMarkdown(input: string): string {
  if (!input) return "";
  const src = escapeHtml(input);
  const lines = src.split(/\r?\n/);

  const out: string[] = [];
  let inUl = false;
  let inOl = false;
  const closeLists = () => {
    if (inUl) { out.push("</ul>"); inUl = false; }
    if (inOl) { out.push("</ol>"); inOl = false; }
  };

  const inline = (s: string) =>
    s
      .replace(/`([^`]+?)`/g, '<code class="px-1 py-0.5 rounded bg-muted text-[0.85em] font-mono">$1</code>')
      .replace(/\*\*([^*]+?)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*]+?)\*(?!\*)/g, "$1<em>$2</em>")
      .replace(/\[([^\]]+?)\]\(([^)]+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline underline-offset-2">$1</a>');

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) { closeLists(); continue; }

    let m: RegExpMatchArray | null;
    if ((m = line.match(/^###\s+(.*)$/))) {
      closeLists();
      out.push(`<h3 class="font-heading font-semibold text-base mt-3 mb-1">${inline(m[1])}</h3>`);
      continue;
    }
    if ((m = line.match(/^##\s+(.*)$/))) {
      closeLists();
      out.push(`<h2 class="font-heading font-bold text-lg mt-4 mb-2">${inline(m[1])}</h2>`);
      continue;
    }
    if ((m = line.match(/^&gt;\s+(.*)$/))) {
      closeLists();
      out.push(`<blockquote class="border-l-2 border-primary/40 pl-3 italic text-muted-foreground my-2">${inline(m[1])}</blockquote>`);
      continue;
    }
    if ((m = line.match(/^[-*]\s+(.*)$/))) {
      if (inOl) { out.push("</ol>"); inOl = false; }
      if (!inUl) { out.push('<ul class="list-disc pl-5 space-y-1 my-2">'); inUl = true; }
      out.push(`<li>${inline(m[1])}</li>`);
      continue;
    }
    if ((m = line.match(/^\d+\.\s+(.*)$/))) {
      if (inUl) { out.push("</ul>"); inUl = false; }
      if (!inOl) { out.push('<ol class="list-decimal pl-5 space-y-1 my-2">'); inOl = true; }
      out.push(`<li>${inline(m[1])}</li>`);
      continue;
    }
    closeLists();
    out.push(`<p class="my-2 leading-relaxed">${inline(line)}</p>`);
  }
  closeLists();
  return out.join("\n");
}
