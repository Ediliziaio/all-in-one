import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { PageTransition, FadeIn } from "@/components/motion/MotionWrappers";
import {
  Settings, Users, Mail, Bell, Plus, Trash2, Edit2, ChevronUp, ChevronDown,
  Eye, Save, Copy, Check, X, Type, MousePointer, Minus, AlignLeft, AlignCenter,
  AlignRight, Crown, UserCheck, BookOpen, ToggleLeft, ToggleRight, Image,
  MoveVertical, Send, Calendar, FileText, Megaphone, Bold, Italic, Underline,
  Link2, Palette, Building2, ChevronDown as ChevronDownSmall, GripVertical,
} from "lucide-react";
import {
  mockAdminUtenti, ADMIN_UTENTI_KEY, defaultEmailTemplates, EMAIL_TEMPLATES_KEY,
  EMAIL_CAMPAIGNS_KEY, TEMPLATE_VARIABILI,
  type AdminUtente, type AdminRuolo, type EmailTemplate, type EmailCampaign,
  type TemplateBlock, type TemplateBlockTipo, type CampagnaStato, type CampagnaDestinatari,
} from "@/data/mockData";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { it } from "date-fns/locale";

// ─── constants ───────────────────────────────────────────────────────────────

const FONTS = [
  { label: "Plus Jakarta Sans", value: "'Plus Jakarta Sans', sans-serif" },
  { label: "Inter", value: "'Inter', sans-serif" },
  { label: "Lato", value: "'Lato', sans-serif" },
  { label: "Merriweather", value: "'Merriweather', serif" },
  { label: "Playfair Display", value: "'Playfair Display', serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Courier New", value: "'Courier New', monospace" },
];

const BLOCK_META: Record<TemplateBlockTipo, { label: string; icon: typeof Type; desc: string }> = {
  header:     { label: "Intestazione",   icon: Palette,       desc: "Logo, titolo, sfondo colorato" },
  testo:      { label: "Testo",          icon: Type,          desc: "Paragrafo con formattazione rich text" },
  immagine:   { label: "Immagine",       icon: Image,         desc: "Foto, banner, grafica" },
  bottone:    { label: "Pulsante CTA",   icon: MousePointer,  desc: "Bottone cliccabile con link" },
  separatore: { label: "Separatore",     icon: Minus,         desc: "Linea orizzontale divisoria" },
  spaziatore: { label: "Spaziatore",     icon: MoveVertical,  desc: "Spazio vuoto verticale" },
  footer:     { label: "Piè di pagina",  icon: AlignLeft,     desc: "Testo legale e contatti" },
};

const RUOLO_LABEL: Record<AdminRuolo, string> = { superadmin: "Super Admin", operatore: "Operatore", lettore: "Lettore" };
const RUOLO_COLOR: Record<AdminRuolo, string> = { superadmin: "bg-[#1e3a5f] text-white", operatore: "bg-blue-100 text-blue-800", lettore: "bg-slate-100 text-slate-700" };
const RUOLO_ICON: Record<AdminRuolo, typeof Crown> = { superadmin: Crown, operatore: UserCheck, lettore: BookOpen };
const CAMPAGNA_DEST_LABEL: Record<CampagnaDestinatari, string> = { tutti: "Tutti gli studenti", attivi: "Solo attivi", in_uscita: "In uscita", ex_studenti: "Ex studenti" };
const CAMPAGNA_STATO_COLOR: Record<CampagnaStato, string> = { bozza: "bg-slate-100 text-slate-600", programmata: "bg-amber-100 text-amber-700", inviata: "bg-emerald-100 text-emerald-700" };

function initials(nome: string) { return nome.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase(); }
function loadLS<T>(key: string, fallback: T): T { try { const s = localStorage.getItem(key); if (s) return JSON.parse(s); } catch {} return fallback; }
function saveLS(key: string, val: unknown) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }

// ─── Block renderer (canvas + preview) ───────────────────────────────────────

function renderBlockHTML(block: TemplateBlock): string {
  const fontStyle = (ff?: string, fs?: number, fc?: string) =>
    [ff ? `font-family:${ff}` : "", fs ? `font-size:${fs}px` : "", fc ? `color:${fc}` : ""].filter(Boolean).join(";");
  switch (block.tipo) {
    case "header": return `<div style="background:${block.header_bg||"#1e3a5f"};padding:28px 32px;text-align:center;${fontStyle(block.header_font_family)}">
      ${block.header_logo_src ? `<img src="${block.header_logo_src}" style="height:40px;margin:0 auto 12px;display:block;" alt="logo"/>` : block.header_mostra_logo ? `<div style="font-size:11px;font-weight:700;letter-spacing:3px;opacity:.7;color:${block.header_text_color||"#fff"};margin-bottom:8px">[ LOGO ]</div>` : ""}
      <h2 style="margin:0;font-size:22px;font-weight:700;color:${block.header_text_color||"#fff"}">${block.header_titolo||""}</h2>
      ${block.header_sottotitolo ? `<p style="margin:6px 0 0;font-size:14px;opacity:.8;color:${block.header_text_color||"#fff"}">${block.header_sottotitolo}</p>` : ""}
    </div>`;
    case "testo": { const align = block.testo_allineamento==="centro"?"center":block.testo_allineamento==="destra"?"right":"left";
      const html = (block.testo_corpo||"").replace(/\n/g,"<br>");
      return `<div style="padding:20px 32px;background:${block.testo_bg||"#fff"};text-align:${align};${fontStyle(block.testo_font_family,block.testo_font_size||15,block.testo_colore||"#374151")};line-height:1.7">${html}</div>`; }
    case "immagine": { const align = block.img_allineamento==="centro"?"center":block.img_allineamento==="destra"?"flex-end":"flex-start";
      return block.img_src ? `<div style="padding:12px 32px;background:${block.img_bg||"#fff"};display:flex;justify-content:${align}"><a href="${block.img_link||"#"}" style="display:inline-block"><img src="${block.img_src}" alt="${block.img_alt||""}" style="width:${block.img_width_pct||100}%;max-width:100%;border-radius:${block.img_border_radius||0}px;display:block"/></a></div>`
        : `<div style="padding:20px 32px;background:#f3f4f6;text-align:center;color:#9ca3af;font-size:13px">📷 Immagine (carica un'immagine o inserisci URL)</div>`; }
    case "bottone": { const fullW = block.btn_full_width ? "display:block;width:100%" : "display:inline-block";
      return `<div style="padding:16px 32px;text-align:center"><a href="${block.btn_url||"#"}" style="${fullW};padding:12px 28px;background:${block.btn_colore||"#1e3a5f"};color:${block.btn_text_color||"#fff"};text-decoration:none;border-radius:${block.btn_border_radius??6}px;font-size:14px;font-weight:600">${block.btn_label||"Clicca qui"}</a></div>`; }
    case "separatore": return `<div style="padding:8px 32px"><hr style="border:none;border-top:${block.sep_thickness||1}px ${block.sep_style||"solid"} ${block.sep_color||"#e5e7eb"};margin:0"/></div>`;
    case "spaziatore": return `<div style="height:${block.spacer_height||24}px;background:${block.spacer_bg||"#fff"}"></div>`;
    case "footer": return `<div style="padding:16px 32px;background:${block.footer_bg||"#f9fafb"};text-align:center;font-size:${block.footer_font_size||12}px;color:${block.footer_text_color||"#6b7280"};line-height:1.6">${(block.footer_testo||"").replace(/\n/g,"<br>")}</div>`;
    default: return "";
  }
}

// ─── Rich Text Editor ─────────────────────────────────────────────────────────

function RichTextEditor({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const lastHtml = useRef(value);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== (value || "")) {
      ref.current.innerHTML = value || "";
      lastHtml.current = value || "";
    }
  }, []); // mount only — avoid cursor reset on every keystroke

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    if (ref.current) onChange(ref.current.innerHTML);
    ref.current?.focus();
  };

  const handleInput = () => {
    if (ref.current) {
      lastHtml.current = ref.current.innerHTML;
      onChange(ref.current.innerHTML);
    }
  };

  return (
    <div className="border rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 bg-muted/50 border-b">
        <button onMouseDown={e => { e.preventDefault(); exec("bold"); }} className="h-7 w-7 rounded flex items-center justify-center hover:bg-muted text-foreground font-bold text-sm">B</button>
        <button onMouseDown={e => { e.preventDefault(); exec("italic"); }} className="h-7 w-7 rounded flex items-center justify-center hover:bg-muted text-foreground italic text-sm">I</button>
        <button onMouseDown={e => { e.preventDefault(); exec("underline"); }} className="h-7 w-7 rounded flex items-center justify-center hover:bg-muted text-foreground underline text-sm">U</button>
        <div className="w-px h-5 bg-border mx-1" />
        <button onMouseDown={e => { e.preventDefault(); exec("justifyLeft"); }} className="h-7 w-7 rounded flex items-center justify-center hover:bg-muted"><AlignLeft className="h-3.5 w-3.5"/></button>
        <button onMouseDown={e => { e.preventDefault(); exec("justifyCenter"); }} className="h-7 w-7 rounded flex items-center justify-center hover:bg-muted"><AlignCenter className="h-3.5 w-3.5"/></button>
        <button onMouseDown={e => { e.preventDefault(); exec("justifyRight"); }} className="h-7 w-7 rounded flex items-center justify-center hover:bg-muted"><AlignRight className="h-3.5 w-3.5"/></button>
        <div className="w-px h-5 bg-border mx-1" />
        <button
          onMouseDown={e => { e.preventDefault(); const url = prompt("URL:"); if (url) exec("createLink", url); }}
          className="h-7 w-7 rounded flex items-center justify-center hover:bg-muted"
        ><Link2 className="h-3.5 w-3.5"/></button>
        <button onMouseDown={e => { e.preventDefault(); exec("removeFormat"); }} className="h-7 w-7 rounded flex items-center justify-center hover:bg-muted text-xs text-muted-foreground">✗</button>
      </div>
      {/* Editable area */}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
        className={cn(
          "min-h-[120px] p-3 text-sm focus:outline-none leading-relaxed",
          "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:pointer-events-none",
        )}
      />
    </div>
  );
}

// ─── Image Upload Helper ──────────────────────────────────────────────────────

function ImageUpload({ src, onSrc }: { src?: string; onSrc: (s: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [urlMode, setUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState(src?.startsWith("http") ? src : "");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { if (ev.target?.result) onSrc(String(ev.target.result)); };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      {src && <img src={src} alt="" className="w-full max-h-32 object-contain rounded border bg-muted/30" />}
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" className="gap-1.5 flex-1" onClick={() => fileRef.current?.click()}>
          <Image className="h-3.5 w-3.5" /> Carica immagine
        </Button>
        <Button type="button" variant="outline" size="sm" className="gap-1.5 flex-1" onClick={() => setUrlMode(!urlMode)}>
          <Link2 className="h-3.5 w-3.5" /> URL
        </Button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      {urlMode && (
        <div className="flex gap-1.5">
          <Input className="h-8 text-xs" placeholder="https://..." value={urlInput} onChange={e => setUrlInput(e.target.value)} />
          <Button type="button" size="sm" className="h-8 px-3" onClick={() => { onSrc(urlInput); setUrlMode(false); }}>OK</Button>
        </div>
      )}
    </div>
  );
}

// ─── Block Properties Panel ──────────────────────────────────────────────────

function BlockPropertiesPanel({
  block, onChange, variabili,
}: {
  block: TemplateBlock;
  onChange: (b: TemplateBlock) => void;
  variabili: { var: string; desc: string }[];
}) {
  const [copiedVar, setCopiedVar] = useState<string | null>(null);
  const up = useCallback((key: keyof TemplateBlock, val: unknown) => onChange({ ...block, [key]: val }), [block, onChange]);

  const copyVar = (v: string) => {
    navigator.clipboard.writeText(v).then(() => { setCopiedVar(v); setTimeout(() => setCopiedVar(null), 1500); });
  };

  return (
    <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-260px)] pr-1">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {BLOCK_META[block.tipo].label}
      </div>

      {/* ── HEADER ── */}
      {block.tipo === "header" && <>
        <Field label="Titolo"><Input className="h-8 text-xs" value={block.header_titolo||""} onChange={e=>up("header_titolo",e.target.value)} /></Field>
        <Field label="Sottotitolo"><Input className="h-8 text-xs" value={block.header_sottotitolo||""} onChange={e=>up("header_sottotitolo",e.target.value)} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Sfondo"><ColorInput value={block.header_bg||"#1e3a5f"} onChange={v=>up("header_bg",v)} /></Field>
          <Field label="Testo"><ColorInput value={block.header_text_color||"#ffffff"} onChange={v=>up("header_text_color",v)} /></Field>
        </div>
        <Field label="Font">
          <Select value={block.header_font_family||""} onValueChange={v=>up("header_font_family",v)}>
            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Default"/></SelectTrigger>
            <SelectContent>{FONTS.map(f=><SelectItem key={f.value} value={f.value} style={{fontFamily:f.value}}>{f.label}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="Logo">
          <div className="flex items-center gap-2 mb-2">
            <Switch checked={!!block.header_mostra_logo} onCheckedChange={v=>up("header_mostra_logo",v)} id="logo-sw" />
            <label htmlFor="logo-sw" className="text-xs cursor-pointer">Mostra logo</label>
          </div>
          {block.header_mostra_logo && <ImageUpload src={block.header_logo_src} onSrc={v=>up("header_logo_src",v)} />}
        </Field>
      </>}

      {/* ── TESTO ── */}
      {block.tipo === "testo" && <>
        <Field label="Testo (formattazione rich text)">
          <RichTextEditor value={block.testo_corpo||""} onChange={v=>up("testo_corpo",v)} placeholder="Scrivi il tuo testo qui..." />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Font">
            <Select value={block.testo_font_family||""} onValueChange={v=>up("testo_font_family",v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Default"/></SelectTrigger>
              <SelectContent>{FONTS.map(f=><SelectItem key={f.value} value={f.value} style={{fontFamily:f.value}}>{f.label}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Dimensione">
            <Input type="number" className="h-8 text-xs" min={11} max={28} value={block.testo_font_size||15} onChange={e=>up("testo_font_size",Number(e.target.value))} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Colore testo"><ColorInput value={block.testo_colore||"#374151"} onChange={v=>up("testo_colore",v)} /></Field>
          <Field label="Sfondo"><ColorInput value={block.testo_bg||"#ffffff"} onChange={v=>up("testo_bg",v)} /></Field>
        </div>
        <Field label="Allineamento">
          <div className="flex gap-1">
            {(["sinistra","centro","destra"] as const).map(a => {
              const Icon = a==="sinistra"?AlignLeft:a==="centro"?AlignCenter:AlignRight;
              return <button key={a} onClick={()=>up("testo_allineamento",a)} className={cn("h-7 w-8 rounded flex items-center justify-center border text-xs", block.testo_allineamento===a?"bg-primary text-primary-foreground border-primary":"hover:bg-muted")}><Icon className="h-3.5 w-3.5"/></button>;
            })}
          </div>
        </Field>
      </>}

      {/* ── IMMAGINE ── */}
      {block.tipo === "immagine" && <>
        <Field label="Immagine"><ImageUpload src={block.img_src} onSrc={v=>up("img_src",v)} /></Field>
        <Field label="Testo alternativo (SEO)"><Input className="h-8 text-xs" placeholder="Descrizione immagine" value={block.img_alt||""} onChange={e=>up("img_alt",e.target.value)} /></Field>
        <Field label="Link (opzionale)"><Input className="h-8 text-xs font-mono" placeholder="https://..." value={block.img_link||""} onChange={e=>up("img_link",e.target.value)} /></Field>
        <Field label={`Larghezza: ${block.img_width_pct||100}%`}>
          <Slider min={20} max={100} step={5} value={[block.img_width_pct||100]} onValueChange={([v])=>up("img_width_pct",v)} className="mt-1" />
        </Field>
        <Field label={`Bordo arrotondato: ${block.img_border_radius||0}px`}>
          <Slider min={0} max={32} step={2} value={[block.img_border_radius||0]} onValueChange={([v])=>up("img_border_radius",v)} className="mt-1" />
        </Field>
        <Field label="Allineamento">
          <div className="flex gap-1">
            {(["sinistra","centro","destra"] as const).map(a => {
              const Icon = a==="sinistra"?AlignLeft:a==="centro"?AlignCenter:AlignRight;
              return <button key={a} onClick={()=>up("img_allineamento",a)} className={cn("h-7 w-8 rounded flex items-center justify-center border", block.img_allineamento===a?"bg-primary text-primary-foreground border-primary":"hover:bg-muted")}><Icon className="h-3.5 w-3.5"/></button>;
            })}
          </div>
        </Field>
        <Field label="Sfondo blocco"><ColorInput value={block.img_bg||"#ffffff"} onChange={v=>up("img_bg",v)} /></Field>
      </>}

      {/* ── BOTTONE ── */}
      {block.tipo === "bottone" && <>
        <Field label="Testo pulsante"><Input className="h-8 text-xs" value={block.btn_label||""} onChange={e=>up("btn_label",e.target.value)} placeholder="Clicca qui" /></Field>
        <Field label="Link (URL o variabile)"><Input className="h-8 text-xs font-mono" value={block.btn_url||""} onChange={e=>up("btn_url",e.target.value)} placeholder="https://... o {{link_fattura}}" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Sfondo"><ColorInput value={block.btn_colore||"#1e3a5f"} onChange={v=>up("btn_colore",v)} /></Field>
          <Field label="Testo"><ColorInput value={block.btn_text_color||"#ffffff"} onChange={v=>up("btn_text_color",v)} /></Field>
        </div>
        <Field label={`Bordo arrotondato: ${block.btn_border_radius??6}px`}>
          <Slider min={0} max={32} step={2} value={[block.btn_border_radius??6]} onValueChange={([v])=>up("btn_border_radius",v)} className="mt-1" />
        </Field>
        <div className="flex items-center gap-2">
          <Switch checked={!!block.btn_full_width} onCheckedChange={v=>up("btn_full_width",v)} id="btn-fw" />
          <label htmlFor="btn-fw" className="text-xs cursor-pointer">Pulsante a larghezza piena</label>
        </div>
      </>}

      {/* ── SEPARATORE ── */}
      {block.tipo === "separatore" && <>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Colore"><ColorInput value={block.sep_color||"#e5e7eb"} onChange={v=>up("sep_color",v)} /></Field>
          <Field label="Spessore">
            <Select value={String(block.sep_thickness||1)} onValueChange={v=>up("sep_thickness",Number(v))}>
              <SelectTrigger className="h-8 text-xs"><SelectValue/></SelectTrigger>
              <SelectContent><SelectItem value="1">1px</SelectItem><SelectItem value="2">2px</SelectItem><SelectItem value="3">3px</SelectItem></SelectContent>
            </Select>
          </Field>
        </div>
        <Field label="Stile">
          <Select value={block.sep_style||"solid"} onValueChange={v=>up("sep_style",v as "solid"|"dashed"|"dotted")}>
            <SelectTrigger className="h-8 text-xs"><SelectValue/></SelectTrigger>
            <SelectContent><SelectItem value="solid">— Continuo</SelectItem><SelectItem value="dashed">- - Tratteggiato</SelectItem><SelectItem value="dotted">· · Puntinato</SelectItem></SelectContent>
          </Select>
        </Field>
      </>}

      {/* ── SPAZIATORE ── */}
      {block.tipo === "spaziatore" && <>
        <Field label={`Altezza: ${block.spacer_height||24}px`}>
          <Slider min={8} max={100} step={4} value={[block.spacer_height||24]} onValueChange={([v])=>up("spacer_height",v)} className="mt-1" />
        </Field>
        <Field label="Colore sfondo"><ColorInput value={block.spacer_bg||"#ffffff"} onChange={v=>up("spacer_bg",v)} /></Field>
      </>}

      {/* ── FOOTER ── */}
      {block.tipo === "footer" && <>
        <Field label="Testo">
          <Textarea className="text-xs min-h-[80px]" value={block.footer_testo||""} onChange={e=>up("footer_testo",e.target.value)} placeholder="Indirizzo, contatti, note legali..." />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Sfondo"><ColorInput value={block.footer_bg||"#f9fafb"} onChange={v=>up("footer_bg",v)} /></Field>
          <Field label="Testo"><ColorInput value={block.footer_text_color||"#6b7280"} onChange={v=>up("footer_text_color",v)} /></Field>
        </div>
        <Field label={`Dimensione font: ${block.footer_font_size||12}px`}>
          <Slider min={10} max={16} step={1} value={[block.footer_font_size||12]} onValueChange={([v])=>up("footer_font_size",v)} className="mt-1" />
        </Field>
      </>}

      {/* Variables */}
      <div className="pt-3 border-t">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-2">Variabili disponibili — clicca per copiare</p>
        <div className="flex flex-wrap gap-1">
          {variabili.map(v => (
            <button key={v.var} title={v.desc} onClick={() => copyVar(v.var)} className={cn(
              "text-[10px] font-mono px-1.5 py-0.5 rounded border transition-colors flex items-center gap-1",
              copiedVar === v.var ? "bg-emerald-50 border-emerald-300 text-emerald-700" : "bg-muted/50 border-border hover:bg-muted",
            )}>
              {copiedVar === v.var ? <Check className="h-2.5 w-2.5"/> : <Copy className="h-2.5 w-2.5"/>}
              {v.var}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">{label}</Label>{children}</div>;
}
function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <input type="color" value={value} onChange={e => onChange(e.target.value)} className="h-8 w-10 rounded border cursor-pointer flex-shrink-0" />
      <Input className="h-8 text-xs font-mono flex-1" value={value} onChange={e => onChange(e.target.value)} maxLength={9} />
    </div>
  );
}

// ─── Email Page Builder ───────────────────────────────────────────────────────

function EmailPageBuilder({
  subject, onSubjectChange,
  blocks, onBlocksChange,
  previewText, onPreviewTextChange,
}: {
  subject: string; onSubjectChange: (v: string) => void;
  blocks: TemplateBlock[]; onBlocksChange: (b: TemplateBlock[]) => void;
  previewText?: string; onPreviewTextChange?: (v: string) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const selectedBlock = blocks.find(b => b.id === selectedId) ?? null;

  const updateBlock = (updated: TemplateBlock) => {
    onBlocksChange(blocks.map(b => b.id === updated.id ? updated : b));
  };
  const moveBlock = (id: string, dir: -1 | 1) => {
    const idx = blocks.findIndex(b => b.id === id);
    if (idx + dir < 0 || idx + dir >= blocks.length) return;
    const arr = [...blocks];
    [arr[idx], arr[idx+dir]] = [arr[idx+dir], arr[idx]];
    onBlocksChange(arr);
  };
  const deleteBlock = (id: string) => {
    onBlocksChange(blocks.filter(b => b.id !== id));
    if (selectedId === id) setSelectedId(null);
  };
  const addBlock = (tipo: TemplateBlockTipo) => {
    const defaults: Partial<TemplateBlock> = {
      header: { header_titolo: "Studentato Napoleone", header_bg: "#1e3a5f", header_mostra_logo: true, header_text_color: "#ffffff" },
      testo: { testo_corpo: "Scrivi il tuo testo qui...", testo_font_size: 15, testo_colore: "#374151" },
      immagine: { img_width_pct: 100, img_allineamento: "centro" },
      bottone: { btn_label: "Clicca qui", btn_colore: "#1e3a5f", btn_text_color: "#ffffff", btn_border_radius: 6 },
      separatore: { sep_color: "#e5e7eb", sep_thickness: 1, sep_style: "solid" },
      spaziatore: { spacer_height: 24, spacer_bg: "#ffffff" },
      footer: { footer_testo: "Studentato Napoleone Padova  ·  studentatonapoleone@gmail.com", footer_bg: "#f9fafb", footer_text_color: "#6b7280", footer_font_size: 12 },
    }[tipo] || {};
    const nb: TemplateBlock = { id: `b-${Date.now()}`, tipo, ...defaults };
    const newBlocks = [...blocks, nb];
    onBlocksChange(newBlocks);
    setSelectedId(nb.id);
  };

  const fullEmailHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body style="margin:0;padding:16px;background:#f3f4f6;font-family:sans-serif"><div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden">${blocks.map(renderBlockHTML).join("")}</div></body></html>`;

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Meta bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <Label className="text-xs text-muted-foreground">Oggetto email *</Label>
          <Input className="mt-1 font-mono text-sm" value={subject} onChange={e=>onSubjectChange(e.target.value)} placeholder="Oggetto dell'email..." />
        </div>
        {onPreviewTextChange && (
          <div>
            <Label className="text-xs text-muted-foreground">Preview text (visibile nella inbox)</Label>
            <Input className="mt-1 text-sm" value={previewText||""} onChange={e=>onPreviewTextChange(e.target.value)} placeholder="Breve anteprima..." />
          </div>
        )}
      </div>

      {/* 3-panel builder */}
      <div className="grid grid-cols-[180px_1fr_280px] gap-3 min-h-[600px]">

        {/* Left: Block palette */}
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground px-1 py-1">Aggiungi blocco</p>
          {(Object.keys(BLOCK_META) as TemplateBlockTipo[]).map(tipo => {
            const { label, icon: Icon, desc } = BLOCK_META[tipo];
            return (
              <button key={tipo} onClick={() => addBlock(tipo)} title={desc} className="w-full text-left px-2.5 py-2 rounded-md border hover:bg-muted/60 hover:border-primary/40 transition-colors flex items-center gap-2 text-xs">
                <Icon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <span className="font-medium truncate">{label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t mt-2">
            <button onClick={() => setPreviewOpen(true)} className="w-full text-left px-2.5 py-2 rounded-md border hover:bg-muted/60 transition-colors flex items-center gap-2 text-xs text-primary font-medium">
              <Eye className="h-3.5 w-3.5" /> Anteprima email
            </button>
          </div>
        </div>

        {/* Center: Canvas */}
        <div className="bg-[#f3f4f6] rounded-lg p-4 overflow-y-auto">
          <div className="max-w-[600px] mx-auto bg-white rounded-lg overflow-hidden shadow-sm border">
            {blocks.length === 0 && (
              <div className="py-16 text-center text-muted-foreground text-sm">
                <Type className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p>Canvas vuoto — aggiungi blocchi dal pannello a sinistra</p>
              </div>
            )}
            {blocks.map((block, idx) => (
              <div
                key={block.id}
                className={cn("relative cursor-pointer transition-all", selectedId === block.id ? "ring-2 ring-primary ring-offset-0 z-10" : hoveredId === block.id ? "ring-1 ring-primary/40" : "")}
                onClick={() => setSelectedId(block.id === selectedId ? null : block.id)}
                onMouseEnter={() => setHoveredId(block.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Block controls (show on hover/selected) */}
                {(selectedId === block.id || hoveredId === block.id) && (
                  <div className="absolute top-1 right-1 z-20 flex items-center gap-0.5 bg-white/95 border rounded shadow-sm px-1 py-0.5" onClick={e => e.stopPropagation()}>
                    <button onClick={() => moveBlock(block.id, -1)} disabled={idx === 0} className="h-5 w-5 rounded hover:bg-muted flex items-center justify-center disabled:opacity-30"><ChevronUp className="h-3 w-3"/></button>
                    <button onClick={() => moveBlock(block.id, 1)} disabled={idx === blocks.length-1} className="h-5 w-5 rounded hover:bg-muted flex items-center justify-center disabled:opacity-30"><ChevronDown className="h-3 w-3"/></button>
                    <button onClick={() => deleteBlock(block.id)} className="h-5 w-5 rounded hover:bg-rose-50 text-rose-500 flex items-center justify-center"><X className="h-3 w-3"/></button>
                  </div>
                )}
                {/* Block type label on hover */}
                {(selectedId === block.id || hoveredId === block.id) && (
                  <div className="absolute top-1 left-1 z-20 text-[9px] font-semibold bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                    {BLOCK_META[block.tipo].label}
                  </div>
                )}
                {/* Rendered block */}
                <div
                  dangerouslySetInnerHTML={{ __html: renderBlockHTML(block) }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Properties */}
        <div>
          {selectedBlock ? (
            <Card className="h-full">
              <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-sm flex items-center gap-2">
                  {(() => { const Icon = BLOCK_META[selectedBlock.tipo].icon; return <Icon className="h-4 w-4 text-muted-foreground"/>; })()}
                  Proprietà — {BLOCK_META[selectedBlock.tipo].label}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <BlockPropertiesPanel
                  block={selectedBlock}
                  onChange={updateBlock}
                  variabili={TEMPLATE_VARIABILI}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="h-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground text-sm gap-2 text-center p-6">
              <Settings className="h-8 w-8 opacity-30" />
              <p className="font-medium">Nessun blocco selezionato</p>
              <p className="text-xs">Clicca su un blocco nel canvas per modificarne le proprietà</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Anteprima email</DialogTitle>
            <DialogDescription className="font-mono text-xs truncate">{subject}</DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[70vh]">
            <div className="bg-[#f3f4f6] p-4 rounded">
              <div className="max-w-[600px] mx-auto bg-white rounded-lg overflow-hidden shadow border"
                dangerouslySetInnerHTML={{ __html: blocks.map(renderBlockHTML).join("") }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(fullEmailHtml); toast.success("HTML copiato!"); }}>
              <Copy className="h-3.5 w-3.5 mr-1.5"/> Copia HTML
            </Button>
            <Button size="sm" onClick={() => setPreviewOpen(false)}>Chiudi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Campaign Manager ────────────────────────────────────────────────────────

function CampaignManager() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>(() => loadLS(EMAIL_CAMPAIGNS_KEY, []));
  const [editing, setEditing] = useState<EmailCampaign | null>(null);
  const [newDialog, setNewDialog] = useState(false);
  const [newNome, setNewNome] = useState("");
  const [newDest, setNewDest] = useState<CampagnaDestinatari>("attivi");

  const save = (c: EmailCampaign[]) => { setCampaigns(c); saveLS(EMAIL_CAMPAIGNS_KEY, c); };

  const createCampaign = () => {
    if (!newNome.trim()) { toast.error("Inserisci il nome della campagna"); return; }
    const c: EmailCampaign = {
      id: `cmp-${Date.now()}`,
      nome: newNome.trim(),
      oggetto: "",
      blocks: [
        { id: `b-${Date.now()}`, tipo: "header", header_titolo: "Studentato Napoleone", header_bg: "#1e3a5f", header_mostra_logo: true, header_text_color: "#ffffff" },
        { id: `b-${Date.now()+1}`, tipo: "testo", testo_corpo: "Scrivi qui il contenuto della campagna...", testo_font_size: 15, testo_colore: "#374151" },
        { id: `b-${Date.now()+2}`, tipo: "footer", footer_testo: "Studentato Napoleone Padova  ·  studentatonapoleone@gmail.com  ·  +39 392 3634188", footer_bg: "#f9fafb", footer_text_color: "#6b7280", footer_font_size: 12 },
      ],
      destinatari: newDest,
      stato: "bozza",
      created_at: new Date().toISOString(),
    };
    save([...campaigns, c]);
    setNewNome(""); setNewDialog(false);
    setEditing(c);
    toast.success("Campagna creata!");
  };

  const updateCampaign = (c: EmailCampaign) => { save(campaigns.map(x => x.id === c.id ? c : x)); };
  const deleteCampaign = (id: string) => { save(campaigns.filter(c => c.id !== id)); if (editing?.id === id) setEditing(null); };

  const simulateSend = (id: string) => {
    const c = campaigns.find(x => x.id === id);
    if (!c) return;
    if (!c.oggetto.trim()) { toast.error("L'oggetto è obbligatorio prima di inviare"); return; }
    const counts: Record<CampagnaDestinatari, number> = { tutti: 6, attivi: 4, in_uscita: 1, ex_studenti: 2 };
    const updated: EmailCampaign = { ...c, stato: "inviata", sent_at: new Date().toISOString(), inviati_count: counts[c.destinatari] };
    save(campaigns.map(x => x.id === id ? updated : x));
    toast.success(`✅ Campagna inviata a ${counts[c.destinatari]} destinatari!`);
    if (editing?.id === id) setEditing(updated);
  };

  if (editing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setEditing(null)} className="gap-1.5">
            <ChevronUp className="h-4 w-4 rotate-[-90deg]" /> Torna alle campagne
          </Button>
          <div className="flex-1">
            <h3 className="font-semibold">{editing.nome}</h3>
            <Badge className={cn("text-xs", CAMPAGNA_STATO_COLOR[editing.stato])}>{editing.stato}</Badge>
          </div>
          <Select value={editing.destinatari} onValueChange={v => { const u = { ...editing, destinatari: v as CampagnaDestinatari }; setEditing(u); updateCampaign(u); }}>
            <SelectTrigger className="w-[180px] h-8 text-xs"><SelectValue/></SelectTrigger>
            <SelectContent>{(Object.keys(CAMPAGNA_DEST_LABEL) as CampagnaDestinatari[]).map(k=><SelectItem key={k} value={k}>{CAMPAGNA_DEST_LABEL[k]}</SelectItem>)}</SelectContent>
          </Select>
          {editing.stato !== "inviata" && (
            <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => simulateSend(editing.id)}>
              <Send className="h-3.5 w-3.5" /> Invia campagna
            </Button>
          )}
        </div>
        <EmailPageBuilder
          subject={editing.oggetto}
          onSubjectChange={v => { const u = { ...editing, oggetto: v }; setEditing(u); updateCampaign(u); }}
          blocks={editing.blocks}
          onBlocksChange={v => { const u = { ...editing, blocks: v }; setEditing(u); updateCampaign(u); }}
          previewText={editing.preview_text}
          onPreviewTextChange={v => { const u = { ...editing, preview_text: v }; setEditing(u); updateCampaign(u); }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Campagne Email</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Crea e invia newsletter e comunicazioni ai tuoi studenti</p>
        </div>
        <Button onClick={() => setNewDialog(true)} className="gap-1.5"><Plus className="h-4 w-4"/> Nuova campagna</Button>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
          <Megaphone className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Nessuna campagna ancora</p>
          <p className="text-xs mt-1">Crea la tua prima campagna email per comunicare con gli studenti</p>
        </div>
      ) : (
        <div className="space-y-2">
          {campaigns.map(c => (
            <Card key={c.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Megaphone className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{c.nome}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge className={cn("text-[10px] py-0", CAMPAGNA_STATO_COLOR[c.stato])}>{c.stato}</Badge>
                    <span className="text-xs text-muted-foreground">{CAMPAGNA_DEST_LABEL[c.destinatari]}</span>
                    {c.inviati_count && <span className="text-xs text-muted-foreground">· {c.inviati_count} inviati</span>}
                    {c.sent_at && <span className="text-xs text-muted-foreground">· {format(new Date(c.sent_at), "d MMM yyyy", { locale: it })}</span>}
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {c.stato !== "inviata" && (
                    <Button variant="outline" size="sm" onClick={() => setEditing(c)} className="gap-1.5"><Edit2 className="h-3.5 w-3.5"/>Modifica</Button>
                  )}
                  {c.stato !== "inviata" && (
                    <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => simulateSend(c.id)}>
                      <Send className="h-3.5 w-3.5"/> Invia
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:text-rose-600" onClick={() => deleteCampaign(c.id)}>
                    <Trash2 className="h-3.5 w-3.5"/>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* New campaign dialog */}
      <Dialog open={newDialog} onOpenChange={setNewDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Nuova campagna</DialogTitle>
            <DialogDescription>Scegli un nome e i destinatari — poi potrai costruire il contenuto con il page builder.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Field label="Nome campagna *"><Input value={newNome} onChange={e=>setNewNome(e.target.value)} placeholder="Es. Newsletter Maggio 2026" /></Field>
            <Field label="Destinatari">
              <Select value={newDest} onValueChange={v=>setNewDest(v as CampagnaDestinatari)}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>{(Object.keys(CAMPAGNA_DEST_LABEL) as CampagnaDestinatari[]).map(k=><SelectItem key={k} value={k}>{CAMPAGNA_DEST_LABEL[k]}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setNewDialog(false)}>Annulla</Button>
            <Button onClick={createCampaign}>Crea e apri editor →</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Main AdminImpostazioni ───────────────────────────────────────────────────

export default function AdminImpostazioni() {
  const [tab, setTab] = useState("struttura");
  const [emailSubTab, setEmailSubTab] = useState("template");

  const [struttura, setStruttura] = useState({
    nomeStruttura: "Studentato Napoleone Padova",
    email: "studentatonapoleone@gmail.com",
    telefono: "+39 392 3634188",
    indirizzo: "Padova centro storico, 35122 Padova PD",
    orarioApertura: "09:00",
    orarioChiusura: "17:00",
    notificheEmail: true,
    notificheSMS: false,
    manutenzioneAutomatica: true,
  });

  // ── Team ──
  const [utenti, setUtenti] = useState<AdminUtente[]>(() => loadLS(ADMIN_UTENTI_KEY, mockAdminUtenti));
  const [utenteDialog, setUtenteDialog] = useState(false);
  const [editingUtente, setEditingUtente] = useState<AdminUtente | null>(null);
  const [nuovoNome, setNuovoNome] = useState("");
  const [nuovaEmail, setNuovaEmail] = useState("");
  const [nuovoRuolo, setNuovoRuolo] = useState<AdminRuolo>("operatore");
  const [nuovoColore, setNuovoColore] = useState("#1e3a5f");

  // ── Email Templates ──
  const [templates, setTemplates] = useState<EmailTemplate[]>(() => loadLS(EMAIL_TEMPLATES_KEY, defaultEmailTemplates));
  const [selectedTplId, setSelectedTplId] = useState<string>(defaultEmailTemplates[0].id);

  const selectedTpl = templates.find(t => t.id === selectedTplId) ?? templates[0];

  const saveUtenti = (u: AdminUtente[]) => { setUtenti(u); saveLS(ADMIN_UTENTI_KEY, u); };
  const saveTemplates = (t: EmailTemplate[]) => { setTemplates(t); saveLS(EMAIL_TEMPLATES_KEY, t); };

  const openNewUtente = () => { setEditingUtente(null); setNuovoNome(""); setNuovaEmail(""); setNuovoRuolo("operatore"); setNuovoColore("#1e3a5f"); setUtenteDialog(true); };
  const openEditUtente = (u: AdminUtente) => { setEditingUtente(u); setNuovoNome(u.nome); setNuovaEmail(u.email); setNuovoRuolo(u.ruolo); setNuovoColore(u.colore); setUtenteDialog(true); };
  const handleSaveUtente = () => {
    if (!nuovoNome.trim() || !nuovaEmail.trim()) { toast.error("Nome ed email obbligatori"); return; }
    if (editingUtente) {
      saveUtenti(utenti.map(u => u.id === editingUtente.id ? { ...u, nome: nuovoNome.trim(), email: nuovaEmail.trim(), ruolo: nuovoRuolo, colore: nuovoColore } : u));
      toast.success("Utente aggiornato");
    } else {
      saveUtenti([...utenti, { id: `au-${Date.now()}`, nome: nuovoNome.trim(), email: nuovaEmail.trim(), ruolo: nuovoRuolo, attivo: true, colore: nuovoColore, createdAt: new Date().toISOString() }]);
      toast.success("Utente aggiunto");
    }
    setUtenteDialog(false);
  };

  return (
    <PageTransition className="p-4 md:p-6 space-y-4 md:space-y-6">
      <FadeIn>
        <h1 className="font-heading text-2xl md:text-3xl font-bold">Impostazioni</h1>
        <p className="text-sm text-muted-foreground">Gestisci struttura, accessi, template email e campagne</p>
      </FadeIn>

      <Tabs value={tab} onValueChange={setTab}>
        <FadeIn delay={0.05}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4 md:mb-6 h-auto gap-1">
            <TabsTrigger value="struttura" className="gap-1.5"><Building2 className="h-3.5 w-3.5 hidden sm:block"/>Struttura</TabsTrigger>
            <TabsTrigger value="team" className="gap-1.5"><Users className="h-3.5 w-3.5 hidden sm:block"/>Team</TabsTrigger>
            <TabsTrigger value="email" className="gap-1.5"><Mail className="h-3.5 w-3.5 hidden sm:block"/>Email</TabsTrigger>
            <TabsTrigger value="notifiche" className="gap-1.5"><Bell className="h-3.5 w-3.5 hidden sm:block"/>Notifiche</TabsTrigger>
          </TabsList>
        </FadeIn>

        {/* ── STRUTTURA ── */}
        <TabsContent value="struttura">
          <FadeIn delay={0.1}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="text-base">Informazioni Struttura</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {[["Nome struttura","nomeStruttura","text"],["Email","email","email"],["Telefono","telefono","text"],["Indirizzo","indirizzo","text"]].map(([label,key,type]) => (
                    <div key={key} className="space-y-1.5">
                      <Label className="text-xs">{label}</Label>
                      <Input type={type} value={(struttura as Record<string,string>)[key]} onChange={e=>setStruttura({...struttura,[key]:e.target.value})} />
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5"><Label className="text-xs">Apertura</Label><Input type="time" value={struttura.orarioApertura} onChange={e=>setStruttura({...struttura,orarioApertura:e.target.value})}/></div>
                    <div className="space-y-1.5"><Label className="text-xs">Chiusura</Label><Input type="time" value={struttura.orarioChiusura} onChange={e=>setStruttura({...struttura,orarioChiusura:e.target.value})}/></div>
                  </div>
                  <Button className="w-full" onClick={()=>toast.success("Impostazioni struttura salvate!")}><Save className="h-4 w-4 mr-2"/>Salva modifiche</Button>
                </CardContent>
              </Card>
            </div>
          </FadeIn>
        </TabsContent>

        {/* ── TEAM ── */}
        <TabsContent value="team">
          <FadeIn delay={0.1}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-base">Team & Accessi Admin</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Gli operatori qui sono assegnabili ai lead nel CRM</p>
                </div>
                <Button onClick={openNewUtente} className="gap-1.5"><Plus className="h-4 w-4"/>Aggiungi utente</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {utenti.map(u => {
                  const RuoloIcon = RUOLO_ICON[u.ruolo];
                  return (
                    <Card key={u.id} className={cn("relative", !u.attivo && "opacity-60")}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-11 w-11 flex-shrink-0"><AvatarFallback style={{background:u.colore}} className="text-white font-bold text-sm">{initials(u.nome)}</AvatarFallback></Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{u.nome}</p>
                            <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                            <div className="flex items-center gap-1.5 mt-2">
                              <Badge className={cn("text-[10px] gap-1 py-0",RUOLO_COLOR[u.ruolo])}><RuoloIcon className="h-2.5 w-2.5"/>{RUOLO_LABEL[u.ruolo]}</Badge>
                              {!u.attivo && <Badge variant="outline" className="text-[10px] text-muted-foreground">Disattivo</Badge>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t">
                          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground" onClick={() => saveUtenti(utenti.map(x => x.id===u.id?{...x,attivo:!x.attivo}:x))}>
                            {u.attivo ? <ToggleRight className="h-4 w-4 text-emerald-600"/> : <ToggleLeft className="h-4 w-4"/>}
                            {u.attivo ? "Attivo" : "Disattivo"}
                          </button>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={()=>openEditUtente(u)}><Edit2 className="h-3.5 w-3.5"/></Button>
                            {u.ruolo !== "superadmin" && <Button variant="ghost" size="icon" className="h-7 w-7 text-rose-500" onClick={()=>saveUtenti(utenti.filter(x=>x.id!==u.id))}><Trash2 className="h-3.5 w-3.5"/></Button>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              <Card className="bg-muted/30"><CardContent className="p-4">
                <h4 className="text-xs font-semibold mb-2">Livelli di accesso</h4>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <p><strong className="text-foreground">Super Admin</strong> — accesso completo, gestione impostazioni, tutti i dati</p>
                  <p><strong className="text-foreground">Operatore</strong> — gestione lead, studenti, fatture; assegnabile nel CRM</p>
                  <p><strong className="text-foreground">Lettore</strong> — solo visualizzazione, nessuna modifica</p>
                </div>
              </CardContent></Card>
            </div>
          </FadeIn>
        </TabsContent>

        {/* ── EMAIL ── */}
        <TabsContent value="email">
          <FadeIn delay={0.1}>
            <Tabs value={emailSubTab} onValueChange={setEmailSubTab}>
              <div className="flex items-center gap-4 mb-5">
                <TabsList>
                  <TabsTrigger value="template" className="gap-1.5"><FileText className="h-3.5 w-3.5"/>Template di sistema</TabsTrigger>
                  <TabsTrigger value="campagne" className="gap-1.5"><Megaphone className="h-3.5 w-3.5"/>Campagne</TabsTrigger>
                </TabsList>
                <p className="text-xs text-muted-foreground">{emailSubTab === "template" ? "Modifica i template automatici (fatture, solleciti, account)" : "Crea e invia comunicazioni agli studenti"}</p>
              </div>

              {/* System templates */}
              <TabsContent value="template">
                <div className="grid grid-cols-1 xl:grid-cols-[220px_1fr] gap-4">
                  {/* Template list */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground px-1 mb-2">Template</p>
                    {templates.map(t => (
                      <button key={t.id} onClick={()=>setSelectedTplId(t.id)} className={cn("w-full text-left rounded-lg px-3 py-2.5 text-sm transition-colors border", selectedTplId===t.id?"bg-primary text-primary-foreground border-primary":"hover:bg-muted/60 border-transparent")}>
                        <span className="font-medium">{t.nome}</span>
                      </button>
                    ))}
                    <div className="pt-2">
                      <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground gap-1"
                        onClick={() => { const orig = defaultEmailTemplates.find(d=>d.id===selectedTpl.id); if(orig) { saveTemplates(templates.map(t=>t.id===selectedTpl.id?{...orig}:t)); toast.success("Ripristinato"); } }}>
                        <X className="h-3 w-3"/>Ripristina originale
                      </Button>
                    </div>
                  </div>
                  {/* Builder */}
                  {selectedTpl && (
                    <EmailPageBuilder
                      subject={selectedTpl.oggetto}
                      onSubjectChange={v=>saveTemplates(templates.map(t=>t.id===selectedTpl.id?{...t,oggetto:v}:t))}
                      blocks={selectedTpl.blocks}
                      onBlocksChange={v=>saveTemplates(templates.map(t=>t.id===selectedTpl.id?{...t,blocks:v}:t))}
                    />
                  )}
                </div>
              </TabsContent>

              {/* Campaigns */}
              <TabsContent value="campagne">
                <CampaignManager />
              </TabsContent>
            </Tabs>
          </FadeIn>
        </TabsContent>

        {/* ── NOTIFICHE ── */}
        <TabsContent value="notifiche">
          <FadeIn delay={0.1}>
            <Card className="max-w-lg">
              <CardHeader><CardTitle className="text-base">Preferenze notifiche</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                {[
                  {key:"notificheEmail",label:"Notifiche Email",desc:"Ricevi avvisi via email per nuove richieste e ticket"},
                  {key:"notificheSMS",label:"Notifiche SMS",desc:"Ricevi SMS per comunicazioni urgenti"},
                  {key:"manutenzioneAutomatica",label:"Manutenzione automatica",desc:"Crea ticket di manutenzione programmata automaticamente"},
                ].map(({key,label,desc})=>(
                  <div key={key}>
                    <div className="flex items-center justify-between">
                      <div><p className="font-medium text-sm">{label}</p><p className="text-xs text-muted-foreground">{desc}</p></div>
                      <Switch checked={(struttura as Record<string,boolean>)[key]} onCheckedChange={v=>setStruttura({...struttura,[key]:v})}/>
                    </div>
                    <Separator className="mt-4"/>
                  </div>
                ))}
                <Button onClick={()=>toast.success("Preferenze salvate!")}><Save className="h-4 w-4 mr-2"/>Salva</Button>
              </CardContent>
            </Card>
          </FadeIn>
        </TabsContent>
      </Tabs>

      {/* Utente dialog */}
      <Dialog open={utenteDialog} onOpenChange={setUtenteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUtente ? "Modifica utente" : "Nuovo utente"}</DialogTitle>
            <DialogDescription>{editingUtente ? "Aggiorna le informazioni." : "Aggiungi un nuovo membro del team admin."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Field label="Nome completo *"><Input value={nuovoNome} onChange={e=>setNuovoNome(e.target.value)} placeholder="Mario Rossi"/></Field>
            <Field label="Email *"><Input type="email" value={nuovaEmail} onChange={e=>setNuovaEmail(e.target.value)} placeholder="mario@example.com"/></Field>
            <Field label="Ruolo">
              <Select value={nuovoRuolo} onValueChange={v=>setNuovoRuolo(v as AdminRuolo)}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="superadmin">👑 Super Admin</SelectItem>
                  <SelectItem value="operatore">✅ Operatore</SelectItem>
                  <SelectItem value="lettore">📖 Lettore</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Colore avatar">
              <div className="flex items-center gap-3">
                <input type="color" value={nuovoColore} onChange={e=>setNuovoColore(e.target.value)} className="h-9 w-14 rounded border cursor-pointer"/>
                <Avatar className="h-9 w-9"><AvatarFallback style={{background:nuovoColore}} className="text-white font-bold text-sm">{nuovoNome?initials(nuovoNome):"?"}</AvatarFallback></Avatar>
                <span className="text-xs text-muted-foreground">{nuovoNome||"Anteprima"}</span>
              </div>
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setUtenteDialog(false)}>Annulla</Button>
            <Button onClick={handleSaveUtente}>{editingUtente?"Aggiorna":"Aggiungi"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
