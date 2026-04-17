import { useState, useMemo } from "react";
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
  Plus, Copy, Search, Download, Pencil, Tag, Gift,
  AlertCircle, Calendar, TrendingUp,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { mockBuoni, type Buono } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem, HoverCard } from "@/components/motion/MotionWrappers";
import { downloadCSV, daysUntil, todayStamp } from "@/lib/csv";

const CATEGORIES: Buono["categoria"][] = ["Cibo", "Sport", "Libri", "Divertimento", "Servizi"];

const CAT_COLOR: Record<Buono["categoria"], string> = {
  Cibo: "bg-orange-100 text-orange-700 border-orange-200",
  Sport: "bg-blue-100 text-blue-700 border-blue-200",
  Libri: "bg-purple-100 text-purple-700 border-purple-200",
  Divertimento: "bg-pink-100 text-pink-700 border-pink-200",
  Servizi: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

interface FormState {
  nome_esercizio: string;
  descrizione: string;
  codice: string;
  sconto: string;
  categoria: Buono["categoria"];
  scadenza: string;
  attivo: boolean;
  logo_url: string;
}

const emptyForm: FormState = {
  nome_esercizio: "", descrizione: "", codice: "", sconto: "",
  categoria: "Cibo", scadenza: "", attivo: true,
  logo_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop",
};

export default function AdminBuoni() {
  const { toast } = useToast();
  const [buoni, setBuoni] = useState<Buono[]>(mockBuoni);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<string>("tutti");
  const [stato, setStato] = useState<string>("tutti");
  const [sort, setSort] = useState<"recenti" | "scadenza" | "az">("recenti");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Buono | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const dialogOpen = createOpen || !!editing;
  const isEditing = !!editing;

  const kpi = useMemo(() => {
    const tot = buoni.length;
    const attivi = buoni.filter(b => b.attivo).length;
    const inScad = buoni.filter(b => {
      const d = daysUntil(b.scadenza);
      return d > 0 && d <= 30;
    }).length;
    const cats = new Set(buoni.map(b => b.categoria)).size;
    return { tot, attivi, inScad, cats };
  }, [buoni]);

  const filtered = useMemo(() => {
    let list = buoni.slice();
    if (cat !== "tutti") list = list.filter(b => b.categoria === cat);
    if (stato === "attivi") list = list.filter(b => b.attivo && daysUntil(b.scadenza) >= 0);
    if (stato === "disattivi") list = list.filter(b => !b.attivo);
    if (stato === "scaduti") list = list.filter(b => daysUntil(b.scadenza) < 0);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(b =>
        b.nome_esercizio.toLowerCase().includes(q) ||
        b.descrizione.toLowerCase().includes(q) ||
        b.codice.toLowerCase().includes(q),
      );
    }
    list.sort((a, b) => {
      if (sort === "az") return a.nome_esercizio.localeCompare(b.nome_esercizio);
      if (sort === "scadenza") return new Date(a.scadenza).getTime() - new Date(b.scadenza).getTime();
      return Number(b.id.replace(/\D/g, "")) - Number(a.id.replace(/\D/g, ""));
    });
    return list;
  }, [buoni, cat, stato, search, sort]);

  const openCreate = () => { setForm(emptyForm); setCreateOpen(true); };
  const openEdit = (b: Buono) => {
    setEditing(b);
    setForm({
      nome_esercizio: b.nome_esercizio, descrizione: b.descrizione,
      codice: b.codice, sconto: b.sconto, categoria: b.categoria,
      scadenza: b.scadenza, attivo: b.attivo, logo_url: b.logo_url,
    });
  };
  const closeAll = () => { setCreateOpen(false); setEditing(null); };

  const save = () => {
    if (!form.nome_esercizio || !form.codice || !form.sconto) {
      toast({ title: "Compila i campi obbligatori", variant: "destructive" });
      return;
    }
    if (isEditing && editing) {
      setBuoni(prev => prev.map(b => b.id === editing.id ? { ...b, ...form } : b));
      toast({ title: "Buono aggiornato!" });
    } else {
      setBuoni(prev => [{
        id: `b${Date.now()}`, ...form, nuovo: true,
      }, ...prev]);
      toast({ title: "Buono aggiunto!" });
    }
    closeAll();
  };

  const toggleAttivo = (id: string) => {
    setBuoni(prev => prev.map(b => b.id === id ? { ...b, attivo: !b.attivo } : b));
  };

  const handleExport = () => {
    downloadCSV(
      `buoni-${todayStamp()}.csv`,
      ["Esercizio", "Categoria", "Codice", "Sconto", "Scadenza", "Attivo"],
      filtered.map(b => [
        b.nome_esercizio, b.categoria, b.codice, b.sconto, b.scadenza, b.attivo ? "Sì" : "No",
      ]),
    );
    toast({ title: `Esportati ${filtered.length} buoni` });
  };

  // Mock counter — usi from hashing id
  const usiCount = (id: string) => (id.charCodeAt(id.length - 1) * 7) % 200 + 12;

  return (
    <PageTransition className="p-4 sm:p-6 space-y-6">
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold">Buoni Sconto</h1>
            <p className="text-sm text-muted-foreground">Gestisci i partner e le offerte per gli studenti</p>
          </div>
          <Dialog open={createOpen} onOpenChange={(o) => o ? openCreate() : setCreateOpen(false)}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={openCreate}>
                <Plus className="h-4 w-4 mr-2" />Aggiungi Buono
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </FadeIn>

      {/* KPIs */}
      <FadeIn delay={0.05}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card><CardContent className="p-4">
            <div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">Totale Buoni</p><Gift className="h-4 w-4 text-muted-foreground" /></div>
            <p className="text-2xl font-bold mt-1">{kpi.tot}</p>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">Attivi</p><TrendingUp className="h-4 w-4 text-success" /></div>
            <p className="text-2xl font-bold mt-1 text-success">{kpi.attivi}</p>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">In scadenza (&lt;30gg)</p><AlertCircle className="h-4 w-4 text-orange-700" /></div>
            <p className="text-2xl font-bold mt-1 text-orange-700">{kpi.inScad}</p>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">Categorie</p><Tag className="h-4 w-4 text-primary" /></div>
            <p className="text-2xl font-bold mt-1 text-primary">{kpi.cats}</p>
          </CardContent></Card>
        </div>
      </FadeIn>

      {/* Toolbar */}
      <FadeIn delay={0.1}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cerca esercizio, codice..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={stato} onValueChange={setStato}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tutti">Tutti gli stati</SelectItem>
              <SelectItem value="attivi">Attivi</SelectItem>
              <SelectItem value="disattivi">Disattivi</SelectItem>
              <SelectItem value="scaduti">Scaduti</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
            <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="recenti">Più recenti</SelectItem>
              <SelectItem value="scadenza">Scadenza</SelectItem>
              <SelectItem value="az">A → Z</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport}><Download className="h-4 w-4 mr-2" />Esporta CSV</Button>
        </div>
      </FadeIn>

      {/* Category tabs */}
      <FadeIn delay={0.15}>
        <Tabs value={cat} onValueChange={setCat}>
          <TabsList className="flex flex-wrap h-auto">
            <TabsTrigger value="tutti">Tutti ({buoni.length})</TabsTrigger>
            {CATEGORIES.map(c => (
              <TabsTrigger key={c} value={c}>
                {c} ({buoni.filter(b => b.categoria === c).length})
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </FadeIn>

      {/* Grid */}
      {filtered.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">
          <Gift className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p>Nessun buono trovato</p>
        </CardContent></Card>
      ) : (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b) => {
            const giorni = daysUntil(b.scadenza);
            const scaduto = giorni < 0;
            const inScad = giorni > 0 && giorni <= 30;
            return (
              <StaggerItem key={b.id}>
                <HoverCard>
                  <Card className={`overflow-hidden ${scaduto ? "opacity-60" : ""}`}>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <img src={b.logo_url} alt={b.nome_esercizio} className="h-12 w-12 rounded-lg object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-heading font-semibold truncate">{b.nome_esercizio}</p>
                          <Badge variant="outline" className={`${CAT_COLOR[b.categoria]} text-[10px]`}>{b.categoria}</Badge>
                        </div>
                        {b.nuovo && !scaduto && <Badge className="bg-accent text-accent-foreground text-[10px]">NUOVO</Badge>}
                        {scaduto && <Badge className="bg-destructive text-destructive-foreground text-[10px]">SCADUTO</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{b.descrizione}</p>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Badge className="bg-primary text-primary-foreground text-base px-3 shrink-0">{b.sconto}</Badge>
                          <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(b.codice); toast({ title: "Codice copiato!" }); }}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors min-w-0">
                            <Copy className="h-3 w-3 shrink-0" /><span className="truncate">{b.codice}</span>
                          </button>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(b)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Switch checked={b.attivo} onCheckedChange={() => toggleAttivo(b.id)} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {scaduto ? `Scaduto il ${b.scadenza}` :
                           inScad ? <span className="text-orange-700 font-medium">Scade in {giorni}gg</span> :
                           `Scade ${b.scadenza}`}
                        </span>
                        <span>Usato {usiCount(b.id)}×</span>
                      </div>
                    </CardContent>
                  </Card>
                </HoverCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(o) => !o && closeAll()}>
        <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? `Modifica · ${editing?.nome_esercizio}` : "Nuovo Buono Sconto"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {/* Form */}
            <div className="space-y-3">
              <div className="space-y-2"><Label>Nome esercizio *</Label>
                <Input value={form.nome_esercizio} onChange={(e) => setForm({ ...form, nome_esercizio: e.target.value })} placeholder="Pizzeria da Mario" /></div>
              <div className="space-y-2"><Label>Descrizione</Label>
                <Textarea rows={3} value={form.descrizione} onChange={(e) => setForm({ ...form, descrizione: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Codice *</Label>
                  <Input value={form.codice} onChange={(e) => setForm({ ...form, codice: e.target.value.toUpperCase() })} placeholder="STUD15" /></div>
                <div className="space-y-2"><Label>Sconto *</Label>
                  <Input value={form.sconto} onChange={(e) => setForm({ ...form, sconto: e.target.value })} placeholder="15%" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Categoria</Label>
                  <Select value={form.categoria} onValueChange={(v) => setForm({ ...form, categoria: v as Buono["categoria"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Scadenza</Label>
                  <Input type="date" value={form.scadenza} onChange={(e) => setForm({ ...form, scadenza: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><Label>URL Logo</Label>
                <Input value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} /></div>
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div><p className="text-sm font-medium">Buono attivo</p><p className="text-xs text-muted-foreground">Visibile agli studenti</p></div>
                <Switch checked={form.attivo} onCheckedChange={(v) => setForm({ ...form, attivo: v })} />
              </div>
            </div>
            {/* Preview */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Anteprima</Label>
              <Card className="overflow-hidden">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={form.logo_url} alt="" className="h-12 w-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-semibold truncate">{form.nome_esercizio || "Nome esercizio"}</p>
                      <Badge variant="outline" className={`${CAT_COLOR[form.categoria]} text-[10px]`}>{form.categoria}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{form.descrizione || "Descrizione del buono..."}</p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary text-primary-foreground text-base px-3">{form.sconto || "—"}</Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><Copy className="h-3 w-3" />{form.codice || "CODICE"}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground pt-2 border-t">Scade {form.scadenza || "—"}</p>
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
