import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus, Save, Trash2, ArrowLeft, Search, Download, Eye, EyeOff,
  ChevronUp, ChevronDown, X, FileText, Globe, Star, BarChart2,
  CheckCircle2, AlertTriangle, AlertCircle, Info, RefreshCw,
  Heading2, Heading3, AlignLeft, List, ListOrdered, MessageSquare, Megaphone,
  Image as ImageIcon, Link as LinkIcon, Calendar, Clock, Tag,
  ExternalLink, Sparkles, Copy, Check
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PageTransition, FadeIn } from "@/components/motion/MotionWrappers";
import {
  type AdminArticle,
  type SeoCheck,
  loadArticles,
  saveArticles,
  createBlankArticle,
  generateSlug,
  computeSeoScore,
  exportBlogTs,
  CATEGORIES,
  BLOCK_LABELS,
} from "@/data/adminBlogStore";
import type { Block, BlockType } from "@/data/blog";

// ─── Block type meta ──────────────────────────────────────────────────────────

const BLOCK_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  h2: Heading2,
  h3: Heading3,
  p: AlignLeft,
  ul: List,
  ol: ListOrdered,
  callout: MessageSquare,
  highlight: Megaphone,
};

// ─── SEO Score Badge ──────────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? "bg-green-100 text-green-700 border-green-200"
    : score >= 50 ? "bg-yellow-100 text-yellow-700 border-yellow-200"
    : "bg-red-100 text-red-700 border-red-200";
  const label = score >= 80 ? "Ottimo" : score >= 50 ? "Migliorabile" : "Scarso";
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold", color)}>
      <BarChart2 className="h-3 w-3" />
      SEO {score}% · {label}
    </span>
  );
}

// ─── Check icon ───────────────────────────────────────────────────────────────

function CheckIcon({ pass }: { pass: SeoCheck["pass"] }) {
  if (pass === "ok") return <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />;
  if (pass === "warn") return <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0" />;
  if (pass === "error") return <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />;
  return <Info className="h-4 w-4 text-muted-foreground shrink-0" />;
}

// ─── Char counter ─────────────────────────────────────────────────────────────

function CharCounter({ value, min, max }: { value: string; min: number; max: number }) {
  const len = value.length;
  const ok = len >= min && len <= max;
  const warn = len > 0 && !ok;
  return (
    <span className={cn("text-[11px]", ok ? "text-green-600" : warn ? "text-yellow-600" : "text-muted-foreground")}>
      {len}/{max} {ok ? "✓" : len === 0 ? "" : warn ? `(ottimale ${min}–${max})` : ""}
    </span>
  );
}

// ─── SERP Preview ─────────────────────────────────────────────────────────────

function SerpPreview({ title, description, slug }: { title: string; description: string; slug: string }) {
  const displayTitle = title.slice(0, 60) + (title.length > 60 ? "..." : "");
  const displayDesc = description.slice(0, 160) + (description.length > 160 ? "..." : "");
  const displayUrl = `studentatonapoleone.com › blog › ${slug || "slug-articolo"}`;

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm space-y-1 font-sans">
      <p className="text-[13px] text-muted-foreground truncate">{displayUrl}</p>
      <p className={cn("text-lg font-medium leading-snug", title ? "text-[#1a0dab]" : "text-muted-foreground/40")}>
        {displayTitle || "Titolo SEO dell'articolo"}
      </p>
      <p className={cn("text-sm leading-snug", description ? "text-[#4d5156]" : "text-muted-foreground/40")}>
        {displayDesc || "Meta description dell'articolo — appare qui nei risultati di Google."}
      </p>
    </div>
  );
}

// ─── Block editor ─────────────────────────────────────────────────────────────

interface BlockEditorProps {
  block: Block;
  index: number;
  total: number;
  onChange: (index: number, block: Block) => void;
  onDelete: (index: number) => void;
  onMove: (index: number, dir: -1 | 1) => void;
  onAddAfter: (index: number, type: BlockType) => void;
  onDuplicate: (index: number) => void;
}

function BlockEditor({ block, index, total, onChange, onDelete, onMove, onAddAfter, onDuplicate }: BlockEditorProps) {
  const Icon = BLOCK_ICONS[block.type] || AlignLeft;
  const isListBlock = block.type === "ul" || block.type === "ol";
  const itemsText = (block.items ?? []).join("\n");

  return (
    <div className="group relative rounded-xl border bg-card p-4 space-y-3">
      {/* Block header */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="h-3.5 w-3.5 text-primary" />
          </div>
          <Select value={block.type} onValueChange={(v) => onChange(index, { ...block, type: v as BlockType, content: block.content ?? "", items: block.items })}>
            <SelectTrigger className="h-7 text-xs border-0 bg-transparent px-1 w-auto min-w-[120px] focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(BLOCK_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k} className="text-xs">
                  <span className="flex items-center gap-2">
                    {k in BLOCK_ICONS && (() => { const I = BLOCK_ICONS[k]; return <I className="h-3.5 w-3.5" />; })()}
                    {v}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Controls */}
        <div className="flex items-center gap-0.5 shrink-0">
          <Button size="icon" variant="ghost" className="h-7 w-7" disabled={index === 0} onClick={() => onMove(index, -1)} title="Sposta su">
            <ChevronUp className="h-3.5 w-3.5" />
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7" disabled={index === total - 1} onClick={() => onMove(index, 1)} title="Sposta giù">
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => onDuplicate(index)} title="Duplica blocco">
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onDelete(index)} title="Elimina blocco">
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Block content */}
      {block.type === "callout" && (
        <div className="flex gap-2">
          <Input
            value={block.emoji ?? ""}
            onChange={(e) => onChange(index, { ...block, emoji: e.target.value })}
            placeholder="🔔"
            className="w-16 text-center text-xl h-10"
            maxLength={2}
          />
          <Textarea
            value={block.content ?? ""}
            onChange={(e) => onChange(index, { ...block, content: e.target.value })}
            placeholder="Testo del box informativo..."
            rows={2}
            className="flex-1 text-sm resize-none"
          />
        </div>
      )}

      {block.type === "highlight" && (
        <Textarea
          value={block.content ?? ""}
          onChange={(e) => onChange(index, { ...block, content: e.target.value })}
          placeholder="Testo del box CTA — link automatico a /contatti..."
          rows={2}
          className="text-sm resize-none bg-accent/5 border-accent/20"
        />
      )}

      {(block.type === "h2" || block.type === "h3") && (
        <Input
          value={block.content ?? ""}
          onChange={(e) => onChange(index, { ...block, content: e.target.value })}
          placeholder={block.type === "h2" ? "Titolo principale della sezione..." : "Sottotitolo della sezione..."}
          className={cn("font-semibold", block.type === "h2" ? "text-lg" : "text-base")}
        />
      )}

      {block.type === "p" && (
        <Textarea
          value={block.content ?? ""}
          onChange={(e) => onChange(index, { ...block, content: e.target.value })}
          placeholder="Scrivi il tuo paragrafo qui..."
          rows={3}
          className="text-sm resize-none"
        />
      )}

      {isListBlock && (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Una voce per riga</p>
          <Textarea
            value={itemsText}
            onChange={(e) => onChange(index, { ...block, items: e.target.value.split("\n") })}
            placeholder={"Primo elemento\nSecondo elemento\nTerzo elemento"}
            rows={Math.max(3, (block.items?.length ?? 0) + 1)}
            className="text-sm resize-none font-mono"
          />
        </div>
      )}

      {/* Add block below */}
      <div className="flex gap-1.5 flex-wrap pt-1 border-t">
        <span className="text-[11px] text-muted-foreground self-center mr-1">Aggiungi dopo:</span>
        {(["p", "h2", "h3", "ul", "ol", "callout", "highlight"] as BlockType[]).map((t) => {
          const I = BLOCK_ICONS[t] || AlignLeft;
          return (
            <button
              key={t}
              onClick={() => onAddAfter(index, t)}
              className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] hover:bg-muted transition-colors"
            >
              <I className="h-3 w-3" /> {BLOCK_LABELS[t]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Article list row ─────────────────────────────────────────────────────────

function ArticleRow({
  article, selected, onSelect,
}: { article: AdminArticle; selected: boolean; onSelect: () => void }) {
  const { score } = computeSeoScore(article);
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left rounded-xl border p-3 transition-all hover:shadow-sm",
        selected ? "border-primary bg-primary/5" : "bg-card hover:border-primary/30"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className={cn("text-sm font-medium truncate", !article.title && "text-muted-foreground italic")}>
            {article.title || "Articolo senza titolo"}
          </p>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <Badge variant="outline" className={cn("text-[10px] py-0", article.status === "published" ? "bg-green-50 text-green-700 border-green-200" : "bg-yellow-50 text-yellow-700 border-yellow-200")}>
              {article.status === "published" ? "Pubblicato" : "Bozza"}
            </Badge>
            <span className="text-[10px] text-muted-foreground">{article.category}</span>
            <span className="text-[10px] text-muted-foreground">{article.date}</span>
            <ScoreBadge score={score} />
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminBlog() {
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminArticle | null>(null);
  const [activeTab, setActiveTab] = useState("content");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [dirty, setDirty] = useState(false);
  const [slugManual, setSlugManual] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // ── Load ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    setArticles(loadArticles());
  }, []);

  // ── Derived ─────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return articles
      .filter((a) => {
        if (filterStatus === "published") return a.status === "published";
        if (filterStatus === "draft") return a.status === "draft";
        return true;
      })
      .filter((a) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [articles, search, filterStatus]);

  const seoAnalysis = useMemo(() => editing ? computeSeoScore(editing) : null, [editing]);

  const stats = useMemo(() => ({
    total: articles.length,
    published: articles.filter((a) => a.status === "published").length,
    draft: articles.filter((a) => a.status === "draft").length,
    avgScore: articles.length
      ? Math.round(articles.reduce((sum, a) => sum + computeSeoScore(a).score, 0) / articles.length)
      : 0,
  }), [articles]);

  // ── Persist ─────────────────────────────────────────────────────────────────
  const persistArticles = useCallback((updated: AdminArticle[]) => {
    setArticles(updated);
    saveArticles(updated);
  }, []);

  // ── Select article ───────────────────────────────────────────────────────────
  const handleSelect = useCallback((id: string) => {
    if (dirty) {
      if (!confirm("Hai modifiche non salvate. Continuare senza salvare?")) return;
    }
    const found = articles.find((a) => a.id === id);
    if (found) {
      setEditing(structuredClone(found));
      setSelectedId(id);
      setDirty(false);
      setSlugManual(true); // existing article: don't auto-generate slug
      setActiveTab("content");
    }
  }, [articles, dirty]);

  // ── New article ──────────────────────────────────────────────────────────────
  const handleNew = useCallback(() => {
    if (dirty && !confirm("Hai modifiche non salvate. Continuare senza salvare?")) return;
    const blank = createBlankArticle();
    setEditing(blank);
    setSelectedId(null);
    setDirty(false);
    setSlugManual(false);
    setActiveTab("content");
  }, [dirty]);

  // ── Edit field ───────────────────────────────────────────────────────────────
  const update = useCallback((patch: Partial<AdminArticle>) => {
    setEditing((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...patch, updatedAt: new Date().toISOString() };
      // Auto-sync OG fields if not manually changed
      if (patch.seoTitle !== undefined && updated.ogTitle === prev.seoTitle) {
        updated.ogTitle = patch.seoTitle;
      }
      if (patch.seoDescription !== undefined && updated.ogDescription === prev.seoDescription) {
        updated.ogDescription = patch.seoDescription;
      }
      if (patch.image !== undefined && updated.ogImage === prev.image) {
        updated.ogImage = patch.image;
      }
      return updated;
    });
    setDirty(true);
  }, []);

  const updateTitle = useCallback((title: string) => {
    update({ title });
    if (!slugManual) {
      update({ slug: generateSlug(title) });
    }
  }, [update, slugManual]);

  // ── Blocks ───────────────────────────────────────────────────────────────────
  const updateBlock = useCallback((i: number, block: Block) => {
    setEditing((prev) => {
      if (!prev) return prev;
      const blocks = [...prev.blocks];
      blocks[i] = block;
      return { ...prev, blocks, updatedAt: new Date().toISOString() };
    });
    setDirty(true);
  }, []);

  const deleteBlock = useCallback((i: number) => {
    setEditing((prev) => {
      if (!prev) return prev;
      const blocks = prev.blocks.filter((_, idx) => idx !== i);
      return { ...prev, blocks, updatedAt: new Date().toISOString() };
    });
    setDirty(true);
  }, []);

  const moveBlock = useCallback((i: number, dir: -1 | 1) => {
    setEditing((prev) => {
      if (!prev) return prev;
      const blocks = [...prev.blocks];
      const target = i + dir;
      if (target < 0 || target >= blocks.length) return prev;
      [blocks[i], blocks[target]] = [blocks[target], blocks[i]];
      return { ...prev, blocks, updatedAt: new Date().toISOString() };
    });
    setDirty(true);
  }, []);

  const addBlockAfter = useCallback((i: number, type: BlockType) => {
    setEditing((prev) => {
      if (!prev) return prev;
      const newBlock: Block = type === "ul" || type === "ol"
        ? { type, items: [""] }
        : type === "callout"
        ? { type, emoji: "💡", content: "" }
        : { type, content: "" };
      const blocks = [...prev.blocks];
      blocks.splice(i + 1, 0, newBlock);
      return { ...prev, blocks, updatedAt: new Date().toISOString() };
    });
    setDirty(true);
  }, []);

  const addBlockAtEnd = useCallback((type: BlockType) => {
    setEditing((prev) => {
      if (!prev) return prev;
      const newBlock: Block = type === "ul" || type === "ol"
        ? { type, items: [""] }
        : type === "callout"
        ? { type, emoji: "💡", content: "" }
        : { type, content: "" };
      return { ...prev, blocks: [...prev.blocks, newBlock], updatedAt: new Date().toISOString() };
    });
    setDirty(true);
  }, []);

  const duplicateBlock = useCallback((i: number) => {
    setEditing((prev) => {
      if (!prev) return prev;
      const blocks = [...prev.blocks];
      const dupe = structuredClone(blocks[i]);
      blocks.splice(i + 1, 0, dupe);
      return { ...prev, blocks, updatedAt: new Date().toISOString() };
    });
    setDirty(true);
  }, []);

  // ── Save ─────────────────────────────────────────────────────────────────────
  const handleSave = useCallback((status?: AdminArticle["status"]) => {
    if (!editing) return;
    if (!editing.title.trim()) {
      toast({ title: "Titolo obbligatorio", variant: "destructive" });
      return;
    }
    if (!editing.slug.trim()) {
      toast({ title: "Slug URL obbligatorio", variant: "destructive" });
      return;
    }
    const finalStatus = status ?? editing.status;
    const toSave: AdminArticle = {
      ...editing,
      status: finalStatus,
      ogTitle: editing.ogTitle || editing.seoTitle || editing.title,
      ogDescription: editing.ogDescription || editing.seoDescription,
      ogImage: editing.ogImage || editing.image,
      canonicalUrl: editing.canonicalUrl || `https://studentatonapoleone.com/blog/${editing.slug}`,
      updatedAt: new Date().toISOString(),
    };

    const updated = selectedId
      ? articles.map((a) => (a.id === selectedId ? toSave : a))
      : [...articles, toSave];

    persistArticles(updated);
    setEditing(toSave);
    setSelectedId(toSave.id);
    setDirty(false);
    toast({
      title: finalStatus === "published" ? "Articolo pubblicato! ✓" : "Bozza salvata ✓",
      description: finalStatus === "published"
        ? "Esporta blog.ts per aggiornare il sito pubblico."
        : "Continua a modificare quando vuoi.",
    });
  }, [editing, selectedId, articles, persistArticles, toast]);

  // ── Delete ───────────────────────────────────────────────────────────────────
  const handleDelete = useCallback(() => {
    if (!selectedId) return;
    if (!confirm("Eliminare questo articolo definitivamente?")) return;
    const updated = articles.filter((a) => a.id !== selectedId);
    persistArticles(updated);
    setEditing(null);
    setSelectedId(null);
    setDirty(false);
    toast({ title: "Articolo eliminato" });
  }, [selectedId, articles, persistArticles, toast]);

  // ── Export ───────────────────────────────────────────────────────────────────
  const handleExport = useCallback(() => {
    const ts = exportBlogTs(articles);
    const blob = new Blob([ts], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "blog.ts";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 100);
    toast({ title: "blog.ts scaricato!", description: "Sostituisci src/data/blog.ts e ridistribuisci il sito." });
  }, [articles, toast]);

  const handleCopySlug = useCallback(() => {
    if (!editing?.slug) return;
    navigator.clipboard.writeText(editing.slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [editing?.slug]);

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <PageTransition className="h-full flex flex-col">
      {/* Top bar */}
      <FadeIn className="flex items-center justify-between gap-3 p-4 md:p-6 pb-0 flex-wrap">
        <div>
          <h1 className="font-heading text-xl md:text-2xl font-bold">Gestione Blog & SEO</h1>
          <p className="text-sm text-muted-foreground">
            {stats.published} pubblicati · {stats.draft} bozze · Score medio SEO: {stats.avgScore}%
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
            <Download className="h-4 w-4" /> Esporta blog.ts
          </Button>
          <Button size="sm" onClick={handleNew} className="bg-accent text-accent-foreground hover:bg-accent/90 gap-1.5">
            <Plus className="h-4 w-4" /> Nuovo articolo
          </Button>
        </div>
      </FadeIn>

      {/* Body */}
      <div className="flex flex-1 gap-0 overflow-hidden mt-4">
        {/* ── Left panel: article list ─────────────────────────────────────── */}
        <div className={cn(
          "flex flex-col border-r bg-muted/20 transition-all duration-200",
          editing ? "hidden lg:flex lg:w-72 xl:w-80 shrink-0" : "flex-1"
        )}>
          {/* Search + filter */}
          <div className="p-3 space-y-2 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca articoli..."
                className="pl-9 h-8 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-1">
              {(["all", "published", "draft"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={cn(
                    "flex-1 text-xs py-1 rounded-md transition-colors",
                    filterStatus === s ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
                  )}
                >
                  {s === "all" ? "Tutti" : s === "published" ? "Pubblicati" : "Bozze"}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
                Nessun articolo trovato
              </div>
            ) : (
              filtered.map((a) => (
                <ArticleRow
                  key={a.id}
                  article={a}
                  selected={a.id === selectedId}
                  onSelect={() => handleSelect(a.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* ── Right panel: editor ──────────────────────────────────────────── */}
        {editing ? (
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            {/* Editor toolbar */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b bg-card flex-wrap shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 lg:hidden"
                onClick={() => { setEditing(null); setSelectedId(null); setDirty(false); }}
              >
                <ArrowLeft className="h-4 w-4" /> Lista
              </Button>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium truncate block">
                  {editing.title || "Nuovo articolo"}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                {seoAnalysis && <ScoreBadge score={seoAnalysis.score} />}
                <Badge variant="outline" className={cn("text-xs", editing.status === "published" ? "bg-green-50 text-green-700 border-green-200" : "bg-yellow-50 text-yellow-700 border-yellow-200")}>
                  {editing.status === "published" ? "Pubblicato" : "Bozza"}
                </Badge>
                {dirty && <span className="text-xs text-yellow-600 font-medium">● non salvato</span>}
                <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => handleSave("draft")} disabled={!dirty && !!selectedId}>
                  <Save className="h-3.5 w-3.5" /> Bozza
                </Button>
                <Button size="sm" className="h-8 gap-1.5 bg-green-600 hover:bg-green-700 text-white" onClick={() => handleSave("published")}>
                  <Globe className="h-3.5 w-3.5" /> Pubblica
                </Button>
                {selectedId && (
                  <Button size="sm" variant="ghost" className="h-8 text-destructive hover:text-destructive" onClick={handleDelete}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>

            {/* Editor tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="grid grid-cols-3 mx-4 mt-3 shrink-0 h-9">
                <TabsTrigger value="content" className="text-xs gap-1.5">
                  <FileText className="h-3.5 w-3.5" /> Contenuto
                </TabsTrigger>
                <TabsTrigger value="seo" className="text-xs gap-1.5">
                  <BarChart2 className="h-3.5 w-3.5" /> SEO & Meta
                  {seoAnalysis && (
                    <span className={cn("ml-1 text-[10px] font-bold", seoAnalysis.score >= 80 ? "text-green-600" : seoAnalysis.score >= 50 ? "text-yellow-600" : "text-red-600")}>
                      {seoAnalysis.score}%
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="preview" className="text-xs gap-1.5">
                  <Eye className="h-3.5 w-3.5" /> Anteprima
                </TabsTrigger>
              </TabsList>

              {/* ── CONTENT TAB ───────────────────────────────────────────── */}
              <TabsContent value="content" className="flex-1 overflow-y-auto px-4 pb-8 mt-4 space-y-5">
                {/* Core fields */}
                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-sm">Informazioni principali</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {/* Title */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Titolo articolo *</Label>
                      <Input
                        value={editing.title}
                        onChange={(e) => updateTitle(e.target.value)}
                        placeholder="Es: Come trovare una stanza a Padova — guida completa 2026"
                        className="font-semibold"
                      />
                    </div>

                    {/* Slug */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold">Slug URL *</Label>
                        <Button size="sm" variant="ghost" className="h-6 text-xs gap-1" onClick={() => { update({ slug: generateSlug(editing.title) }); setSlugManual(true); }}>
                          <RefreshCw className="h-3 w-3" /> Rigenera
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <div className="text-xs text-muted-foreground self-center shrink-0">/blog/</div>
                        <Input
                          value={editing.slug}
                          onChange={(e) => { update({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") }); setSlugManual(true); }}
                          placeholder="nome-articolo-seo"
                          className="font-mono text-sm flex-1"
                        />
                        <Button size="icon" variant="ghost" className="h-9 w-9 shrink-0" onClick={handleCopySlug}>
                          {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                        </Button>
                      </div>
                      <CharCounter value={editing.slug} min={20} max={60} />
                    </div>

                    {/* Category + Read time + Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold flex items-center gap-1"><Tag className="h-3 w-3" /> Categoria</Label>
                        <Select value={editing.category} onValueChange={(v) => update({ category: v })}>
                          <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold flex items-center gap-1"><Clock className="h-3 w-3" /> Tempo lettura (min)</Label>
                        <Input
                          type="number"
                          min={1}
                          max={60}
                          value={editing.readTime}
                          onChange={(e) => update({ readTime: parseInt(e.target.value) || 5 })}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold flex items-center gap-1"><Calendar className="h-3 w-3" /> Data pubblicazione</Label>
                        <Input
                          type="date"
                          value={editing.date}
                          onChange={(e) => update({ date: e.target.value })}
                          className="h-9"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Image */}
                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-1.5"><ImageIcon className="h-4 w-4" /> Immagine in evidenza</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">URL immagine</Label>
                      <Input
                        value={editing.image}
                        onChange={(e) => update({ image: e.target.value })}
                        placeholder="https://images.unsplash.com/photo-xxx?w=1200&h=630&fit=crop"
                      />
                    </div>
                    {editing.image && (
                      <div className="rounded-lg overflow-hidden border aspect-[2/1]">
                        <img src={editing.image} alt={editing.imageAlt} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Alt text immagine *</Label>
                      <Input
                        value={editing.imageAlt}
                        onChange={(e) => update({ imageAlt: e.target.value })}
                        placeholder="Descrizione accessibile dell'immagine (obbligatoria per SEO)"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Excerpt */}
                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-sm">Excerpt / Anteprima</CardTitle></CardHeader>
                  <CardContent className="space-y-1.5">
                    <p className="text-xs text-muted-foreground">Usato nelle card del blog e come fallback nella meta description.</p>
                    <Textarea
                      value={editing.excerpt}
                      onChange={(e) => update({ excerpt: e.target.value })}
                      placeholder="Breve riassunto che appare nelle card blog — 150–200 caratteri ideali."
                      rows={3}
                      className="resize-none"
                    />
                    <CharCounter value={editing.excerpt} min={100} max={200} />
                  </CardContent>
                </Card>

                {/* Block editor */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Contenuto articolo ({editing.blocks.length} blocchi)</CardTitle>
                      <div className="flex gap-1">
                        {(["h2", "p", "ul"] as BlockType[]).map((t) => {
                          const I = BLOCK_ICONS[t] || AlignLeft;
                          return (
                            <Button key={t} size="sm" variant="outline" className="h-7 px-2 text-xs gap-1" onClick={() => addBlockAtEnd(t)}>
                              <I className="h-3 w-3" />
                            </Button>
                          );
                        })}
                        <Select onValueChange={(v) => addBlockAtEnd(v as BlockType)}>
                          <SelectTrigger className="h-7 w-20 text-xs px-2">
                            <Plus className="h-3 w-3 mr-1" />
                            <span>Altro</span>
                          </SelectTrigger>
                          <SelectContent>
                            {(["h3", "ol", "callout", "highlight"] as BlockType[]).map((t) => (
                              <SelectItem key={t} value={t} className="text-xs">{BLOCK_LABELS[t]}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {editing.blocks.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-xl">
                        Nessun blocco. Aggiungi il primo blocco usando i pulsanti sopra.
                      </div>
                    )}
                    {editing.blocks.map((block, i) => (
                      <BlockEditor
                        key={i}
                        block={block}
                        index={i}
                        total={editing.blocks.length}
                        onChange={updateBlock}
                        onDelete={deleteBlock}
                        onMove={moveBlock}
                        onAddAfter={addBlockAfter}
                        onDuplicate={duplicateBlock}
                      />
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ── SEO TAB ────────────────────────────────────────────────── */}
              <TabsContent value="seo" className="flex-1 overflow-y-auto px-4 pb-8 mt-4 space-y-5">
                {/* SERP Preview */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-1.5">
                      <Globe className="h-4 w-4 text-primary" /> Anteprima risultato Google
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SerpPreview
                      title={editing.seoTitle || editing.title}
                      description={editing.seoDescription}
                      slug={editing.slug}
                    />
                  </CardContent>
                </Card>

                {/* SEO Score panel */}
                {seoAnalysis && (
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center gap-1.5">
                          <Sparkles className="h-4 w-4 text-accent" /> Analisi SEO
                        </CardTitle>
                        <ScoreBadge score={seoAnalysis.score} />
                      </div>
                      {/* Score bar */}
                      <div className="mt-2 h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all duration-500", seoAnalysis.score >= 80 ? "bg-green-500" : seoAnalysis.score >= 50 ? "bg-yellow-500" : "bg-red-500")}
                          style={{ width: `${seoAnalysis.score}%` }}
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {seoAnalysis.checks.map((c, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <CheckIcon pass={c.pass} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{c.label}</p>
                              <p className="text-xs text-muted-foreground">{c.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Focus keyword */}
                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-1.5"><Star className="h-4 w-4 text-yellow-500" /> Keyword Focus</CardTitle></CardHeader>
                  <CardContent className="space-y-1.5">
                    <p className="text-xs text-muted-foreground">La keyword principale per cui vuoi posizionare questo articolo.</p>
                    <Input
                      value={editing.focusKeyword}
                      onChange={(e) => update({ focusKeyword: e.target.value })}
                      placeholder="Es: stanza a Padova studenti"
                    />
                  </CardContent>
                </Card>

                {/* Title & Description */}
                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-sm">Title tag & Meta description</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold">SEO Title *</Label>
                        <CharCounter value={editing.seoTitle || editing.title} min={50} max={60} />
                      </div>
                      <Input
                        value={editing.seoTitle}
                        onChange={(e) => update({ seoTitle: e.target.value })}
                        placeholder="Titolo ottimizzato per Google (50–60 caratteri)"
                      />
                      <p className="text-[11px] text-muted-foreground">Lascia vuoto per usare il titolo principale.</p>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold">Meta Description *</Label>
                        <CharCounter value={editing.seoDescription} min={150} max={160} />
                      </div>
                      <Textarea
                        value={editing.seoDescription}
                        onChange={(e) => update({ seoDescription: e.target.value })}
                        placeholder="Descrizione che appare nei risultati di Google (150–160 caratteri ideali). Includi la keyword focus e una call-to-action."
                        rows={3}
                        className="resize-none text-sm"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Open Graph */}
                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-1.5"><ExternalLink className="h-4 w-4" /> Open Graph (Facebook, LinkedIn, WhatsApp)</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold">OG Title</Label>
                        <CharCounter value={editing.ogTitle} min={40} max={60} />
                      </div>
                      <Input
                        value={editing.ogTitle}
                        onChange={(e) => update({ ogTitle: e.target.value })}
                        placeholder="Titolo per condivisione social (auto-sync da SEO Title)"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold">OG Description</Label>
                        <CharCounter value={editing.ogDescription} min={60} max={200} />
                      </div>
                      <Textarea
                        value={editing.ogDescription}
                        onChange={(e) => update({ ogDescription: e.target.value })}
                        placeholder="Descrizione per condivisione social (auto-sync da meta description)"
                        rows={2}
                        className="resize-none text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">OG Image URL</Label>
                      <Input
                        value={editing.ogImage}
                        onChange={(e) => update({ ogImage: e.target.value })}
                        placeholder="https://... (ideale: 1200×630px — auto-sync dall'immagine principale)"
                      />
                      <p className="text-[11px] text-muted-foreground">Dimensione ottimale: 1200×630 px. Viene usata su Facebook, Twitter, WhatsApp.</p>
                    </div>
                    {editing.ogImage && (
                      <div className="rounded-lg overflow-hidden border aspect-[2/1] max-w-sm">
                        <img src={editing.ogImage} alt="OG preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Advanced */}
                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-1.5"><LinkIcon className="h-4 w-4" /> Impostazioni avanzate</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">URL Canonico</Label>
                      <Input
                        value={editing.canonicalUrl}
                        onChange={(e) => update({ canonicalUrl: e.target.value })}
                        placeholder={`https://studentatonapoleone.com/blog/${editing.slug || "slug"}`}
                      />
                      <p className="text-[11px] text-muted-foreground">Evita contenuto duplicato. Auto-compilato alla pubblicazione se vuoto.</p>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <div>
                        <Label className="text-sm font-medium">noIndex</Label>
                        <p className="text-xs text-muted-foreground">Nasconde l'articolo ai motori di ricerca (solo bozze di test)</p>
                      </div>
                      <Switch
                        checked={editing.noIndex}
                        onCheckedChange={(v) => update({ noIndex: v })}
                      />
                    </div>
                    <Separator />
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Schema JSON-LD personalizzato</Label>
                      <p className="text-[11px] text-muted-foreground">Aggiungi dati strutturati extra (Article, FAQ, HowTo, etc.). Incolla JSON puro senza tag &lt;script&gt;.</p>
                      <Textarea
                        value={editing.customSchema}
                        onChange={(e) => update({ customSchema: e.target.value })}
                        placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  ...\n}'}
                        rows={6}
                        className="resize-none font-mono text-xs"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ── PREVIEW TAB ────────────────────────────────────────────── */}
              <TabsContent value="preview" className="flex-1 overflow-y-auto px-4 pb-8 mt-4">
                <div className="max-w-3xl mx-auto">
                  <Card>
                    <CardContent className="p-6 md:p-8">
                      {/* Header */}
                      <div className="mb-6">
                        <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                          {editing.category}
                        </span>
                        <h1 className="font-heading text-2xl md:text-3xl font-bold mt-3 leading-tight">
                          {editing.title || "Titolo articolo"}
                        </h1>
                        <p className="text-muted-foreground mt-2">{editing.excerpt}</p>
                        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                          <span>{editing.date}</span>
                          <span>·</span>
                          <span>{editing.readTime} min di lettura</span>
                        </div>
                      </div>

                      {editing.image && (
                        <div className="rounded-xl overflow-hidden aspect-[2/1] mb-8">
                          <img src={editing.image} alt={editing.imageAlt} className="w-full h-full object-cover" />
                        </div>
                      )}

                      {/* Blocks */}
                      <div className="prose prose-sm max-w-none space-y-4">
                        {editing.blocks.map((block, i) => {
                          switch (block.type) {
                            case "h2":
                              return <h2 key={i} className="font-heading text-xl font-bold mt-8 mb-3">{block.content}</h2>;
                            case "h3":
                              return <h3 key={i} className="font-heading text-base font-semibold mt-5 mb-2">{block.content}</h3>;
                            case "p":
                              return <p key={i} className="text-foreground/90 leading-relaxed">{block.content}</p>;
                            case "ul":
                              return (
                                <ul key={i} className="space-y-1.5">
                                  {(block.items ?? []).filter(Boolean).map((item, j) => (
                                    <li key={j} className="flex gap-2 text-foreground/90">
                                      <span className="text-primary font-bold shrink-0">•</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              );
                            case "ol":
                              return (
                                <ol key={i} className="space-y-1.5">
                                  {(block.items ?? []).filter(Boolean).map((item, j) => (
                                    <li key={j} className="flex gap-2 text-foreground/90">
                                      <span className="text-primary font-bold shrink-0 w-5">{j + 1}.</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ol>
                              );
                            case "callout":
                              return (
                                <div key={i} className="flex gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                                  {block.emoji && <span className="text-xl shrink-0">{block.emoji}</span>}
                                  <p className="text-sm text-foreground/90">{block.content}</p>
                                </div>
                              );
                            case "highlight":
                              return (
                                <div key={i} className="p-5 rounded-xl bg-accent/10 border border-accent/20">
                                  <p className="font-medium text-foreground">{block.content}</p>
                                  <Button size="sm" className="mt-3 bg-accent hover:bg-accent/90 text-accent-foreground">
                                    Richiedi informazioni →
                                  </Button>
                                </div>
                              );
                            default:
                              return null;
                          }
                        })}
                      </div>

                      {editing.blocks.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
                          Nessun blocco di contenuto. Aggiungi blocchi nella tab "Contenuto".
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* SEO summary */}
                  {seoAnalysis && (
                    <Card className="mt-4">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center justify-between">
                          <span>Riepilogo SEO</span>
                          <ScoreBadge score={seoAnalysis.score} />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <SerpPreview
                          title={editing.seoTitle || editing.title}
                          description={editing.seoDescription}
                          slug={editing.slug}
                        />
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          /* ── Empty state ───────────────────────────────────────────────── */
          <div className="flex-1 hidden lg:flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="font-medium">Seleziona un articolo</p>
              <p className="text-sm">oppure</p>
              <Button size="sm" className="mt-2 bg-accent text-accent-foreground hover:bg-accent/90 gap-1.5" onClick={handleNew}>
                <Plus className="h-4 w-4" /> Crea nuovo articolo
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="px-4 py-2 border-t bg-muted/30 text-xs text-muted-foreground flex items-center gap-2 shrink-0">
        <Info className="h-3.5 w-3.5 shrink-0" />
        Dopo aver pubblicato, clicca <strong>"Esporta blog.ts"</strong> e sostituisci il file in <code>src/data/blog.ts</code> per aggiornare il sito pubblico.
      </div>
    </PageTransition>
  );
}
