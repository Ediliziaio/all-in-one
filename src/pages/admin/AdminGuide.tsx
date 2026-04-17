import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus, GripVertical, Search, Download, Pencil, Trash2,
  BookOpen, Eye, LayoutGrid, List, Tag, AlertCircle,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { mockGuide, type Guida } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/MotionWrappers";
import { downloadCSV, todayStamp } from "@/lib/csv";

const CATEGORIES: Guida["categoria"][] = ["Burocrazia", "Università", "Vita in Città", "Risparmio", "Trasporti"];

const CAT_COLOR: Record<Guida["categoria"], string> = {
  "Burocrazia": "bg-blue-100 text-blue-700 border-blue-200",
  "Università": "bg-purple-100 text-purple-700 border-purple-200",
  "Vita in Città": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Risparmio": "bg-orange-100 text-orange-700 border-orange-200",
  "Trasporti": "bg-pink-100 text-pink-700 border-pink-200",
};

const TITLE_MAX = 100;
const CONTENT_MAX = 2000;

interface FormState {
  titolo: string;
  contenuto: string;
  categoria: Guida["categoria"];
  attiva: boolean;
}

const emptyForm: FormState = { titolo: "", contenuto: "", categoria: "Burocrazia", attiva: true };

export default function AdminGuide() {
  const { toast } = useToast();
  const [guide, setGuide] = useState<Guida[]>(mockGuide);
  const [view, setView] = useState<"list" | "grid">("list");
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("tutti");
  const [sort, setSort] = useState<"recenti" | "az" | "categoria">("recenti");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Guida | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const dialogOpen = createOpen || !!editing;
  const isEditing = !!editing;

  const kpi = useMemo(() => ({
    tot: guide.length,
    attive: guide.filter(g => g.attiva).length,
    disattive: guide.filter(g => !g.attiva).length,
    cats: new Set(guide.map(g => g.categoria)).size,
  }), [guide]);

  const filtered = useMemo(() => {
    let list = guide.slice();
    if (cat !== "tutti") list = list.filter(g => g.categoria === cat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(g =>
        g.titolo.toLowerCase().includes(q) ||
        g.contenuto.toLowerCase().includes(q),
      );
    }
    list.sort((a, b) => {
      if (sort === "az") return a.titolo.localeCompare(b.titolo);
      if (sort === "categoria") return a.categoria.localeCompare(b.categoria);
      return Number(b.id.replace(/\D/g, "")) - Number(a.id.replace(/\D/g, ""));
    });
    return list;
  }, [guide, cat, search, sort]);

  const openCreate = () => { setForm(emptyForm); setCreateOpen(true); };
  const openEdit = (g: Guida) => {
    setEditing(g);
    setForm({ titolo: g.titolo, contenuto: g.contenuto, categoria: g.categoria, attiva: g.attiva });
  };
  const closeAll = () => { setCreateOpen(false); setEditing(null); };

  const save = () => {
    if (!form.titolo || !form.contenuto) {
      toast({ title: "Titolo e contenuto sono obbligatori", variant: "destructive" });
      return;
    }
    if (isEditing && editing) {
      setGuide(prev => prev.map(g => g.id === editing.id ? { ...g, ...form, icona: g.icona } : g));
      toast({ title: "Guida aggiornata!" });
    } else {
      setGuide(prev => [{ id: `g${Date.now()}`, ...form, icona: "FileText" }, ...prev]);
      toast({ title: "Guida creata!" });
    }
    closeAll();
  };

  const remove = (id: string) => {
    setGuide(prev => prev.filter(g => g.id !== id));
    toast({ title: "Guida eliminata" });
  };

  const toggle = (id: string) => {
    setGuide(prev => prev.map(g => g.id === id ? { ...g, attiva: !g.attiva } : g));
  };

  const handleExport = () => {
    downloadCSV(
      `guide-${todayStamp()}.csv`,
      ["Titolo", "Categoria", "Attiva", "Contenuto"],
      filtered.map(g => [g.titolo, g.categoria, g.attiva ? "Sì" : "No", g.contenuto]),
    );
    toast({ title: `Esportate ${filtered.length} guide` });
  };

  const letture = (id: string) => (id.charCodeAt(id.length - 1) * 13) % 500 + 45;

  return (
    <PageTransition className="p-4 sm:p-6 space-y-6">
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold">Guide</h1>
            <p className="text-sm text-muted-foreground">CMS per le guide pratiche degli studenti</p>
          </div>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />Nuova Guida
          </Button>
        </div>
      </FadeIn>

      {/* KPIs */}
      <FadeIn delay={0.05}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card><CardContent className="p-4">
            <div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">Totale</p><BookOpen className="h-4 w-4 text-muted-foreground" /></div>
            <p className="text-2xl font-bold mt-1">{kpi.tot}</p>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">Attive</p><Eye className="h-4 w-4 text-success" /></div>
            <p className="text-2xl font-bold mt-1 text-success">{kpi.attive}</p>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">Disattive</p><AlertCircle className="h-4 w-4 text-muted-foreground" /></div>
            <p className="text-2xl font-bold mt-1">{kpi.disattive}</p>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">Categorie coperte</p><Tag className="h-4 w-4 text-primary" /></div>
            <p className="text-2xl font-bold mt-1 text-primary">{kpi.cats}/5</p>
          </CardContent></Card>
        </div>
      </FadeIn>

      {/* Toolbar */}
      <FadeIn delay={0.1}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cerca titolo o contenuto..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
            <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="recenti">Più recenti</SelectItem>
              <SelectItem value="az">A → Z</SelectItem>
              <SelectItem value="categoria">Per categoria</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex border rounded-md">
            <button onClick={() => setView("list")} className={`p-2 px-3 ${view === "list" ? "bg-muted" : ""}`}><List className="h-4 w-4" /></button>
            <button onClick={() => setView("grid")} className={`p-2 px-3 ${view === "grid" ? "bg-muted" : ""}`}><LayoutGrid className="h-4 w-4" /></button>
          </div>
          <Button variant="outline" onClick={handleExport}><Download className="h-4 w-4 mr-2" />Esporta CSV</Button>
        </div>
      </FadeIn>

      {/* Category tabs */}
      <FadeIn delay={0.15}>
        <Tabs value={cat} onValueChange={setCat}>
          <TabsList className="flex flex-wrap h-auto">
            <TabsTrigger value="tutti">Tutti ({guide.length})</TabsTrigger>
            {CATEGORIES.map(c => (
              <TabsTrigger key={c} value={c}>{c} ({guide.filter(g => g.categoria === c).length})</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </FadeIn>

      {/* List / Grid */}
      {filtered.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">
          <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p>Nessuna guida trovata</p>
        </CardContent></Card>
      ) : view === "list" ? (
        <StaggerContainer className="space-y-3">
          {filtered.map((g) => (
            <StaggerItem key={g.id}>
              <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className={!g.attiva ? "opacity-60" : ""}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{g.titolo}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{g.contenuto}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Letta {letture(g.id)}× questo mese</p>
                    </div>
                    <Badge variant="outline" className={`${CAT_COLOR[g.categoria]} hidden sm:inline-flex`}>{g.categoria}</Badge>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(g)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => remove(g.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      <Switch checked={g.attiva} onCheckedChange={() => toggle(g.id)} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      ) : (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((g) => (
            <StaggerItem key={g.id}>
              <Card className={`h-full ${!g.attiva ? "opacity-60" : ""}`}>
                <CardContent className="p-4 space-y-3 h-full flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="outline" className={CAT_COLOR[g.categoria]}>{g.categoria}</Badge>
                    <Switch checked={g.attiva} onCheckedChange={() => toggle(g.id)} />
                  </div>
                  <p className="font-heading font-semibold line-clamp-2">{g.titolo}</p>
                  <p className="text-sm text-muted-foreground line-clamp-3 flex-1">{g.contenuto}</p>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t">
                    <span>Letta {letture(g.id)}× questo mese</span>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(g)}><Pencil className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => remove(g.id)}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {/* Create / Edit dialog with split preview */}
      <Dialog open={dialogOpen} onOpenChange={(o) => !o && closeAll()}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Modifica Guida" : "Nuova Guida"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {/* Editor */}
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Titolo *</Label>
                  <span className={`text-xs ${form.titolo.length > TITLE_MAX ? "text-destructive" : "text-muted-foreground"}`}>
                    {form.titolo.length}/{TITLE_MAX}
                  </span>
                </div>
                <Input value={form.titolo} maxLength={TITLE_MAX + 20}
                  onChange={(e) => setForm({ ...form, titolo: e.target.value })}
                  placeholder="Come fare..." />
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={form.categoria} onValueChange={(v) => setForm({ ...form, categoria: v as Guida["categoria"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Contenuto *</Label>
                  <span className={`text-xs ${form.contenuto.length > CONTENT_MAX ? "text-destructive" : "text-muted-foreground"}`}>
                    {form.contenuto.length}/{CONTENT_MAX}
                  </span>
                </div>
                <Textarea rows={10} value={form.contenuto}
                  onChange={(e) => setForm({ ...form, contenuto: e.target.value })}
                  placeholder="Scrivi la guida..." />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div><p className="text-sm font-medium">Pubblicata</p><p className="text-xs text-muted-foreground">Visibile agli studenti</p></div>
                <Switch checked={form.attiva} onCheckedChange={(v) => setForm({ ...form, attiva: v })} />
              </div>
            </div>
            {/* Preview */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Anteprima</Label>
              <Card className="h-full">
                <CardContent className="p-4 space-y-3">
                  <Badge variant="outline" className={CAT_COLOR[form.categoria]}>{form.categoria}</Badge>
                  <h3 className="font-heading font-bold text-lg leading-tight">{form.titolo || "Titolo della guida"}</h3>
                  <div className="text-sm whitespace-pre-wrap text-foreground/80 leading-relaxed">
                    {form.contenuto || "Il contenuto della guida apparirà qui..."}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <DialogFooter className="gap-2 mt-2">
            <Button variant="outline" onClick={closeAll}>Annulla</Button>
            <Button onClick={save} className="bg-accent text-accent-foreground hover:bg-accent/90">
              {isEditing ? "Salva modifiche" : "Pubblica"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
