import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Phone, Mail, MessageCircle, Search, Filter, Plus, LayoutGrid, List as ListIcon,
  TrendingUp, Users, Euro, CalendarDays, MapPin, GraduationCap, User as UserIcon,
  StickyNote, PhoneCall, Send, CalendarCheck2, ArrowRight, X, Globe, Instagram,
  MessageSquare, Building2, CalendarIcon, Flame
} from "lucide-react";
import { mockRichieste, mockOperatori, type RichiestaAffitto, type LeadStato, type LeadFonte, type LeadPriorita, type Activity } from "@/data/mockData";
import { toast } from "sonner";
import { PageTransition, FadeIn } from "@/components/motion/MotionWrappers";
import { format, formatDistanceToNow, differenceInDays } from "date-fns";
import { it } from "date-fns/locale";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "crm_richieste_v1";

const STAGES: { id: LeadStato; label: string; color: string }[] = [
  { id: "nuovo", label: "Nuovo", color: "bg-slate-500" },
  { id: "contattato", label: "Contattato", color: "bg-blue-500" },
  { id: "visita_programmata", label: "Visita Programmata", color: "bg-violet-500" },
  { id: "proposta_inviata", label: "Proposta Inviata", color: "bg-amber-500" },
  { id: "contratto_firmato", label: "Contratto Firmato", color: "bg-emerald-500" },
  { id: "perso", label: "Perso", color: "bg-rose-500" },
];

const PRIORITA_COLOR: Record<LeadPriorita, string> = {
  bassa: "bg-slate-300",
  media: "bg-amber-400",
  alta: "bg-rose-500",
};

const PRIORITA_BADGE: Record<LeadPriorita, string> = {
  bassa: "bg-slate-100 text-slate-700",
  media: "bg-amber-100 text-amber-800",
  alta: "bg-rose-100 text-rose-700",
};

const FONTE_ICON: Record<LeadFonte, typeof Globe> = {
  sito: Globe,
  instagram: Instagram,
  passaparola: Users,
  google: Search,
  fiera: Building2,
  altro: MessageSquare,
};

const ACTIVITY_ICON: Record<Activity["tipo"], typeof StickyNote> = {
  nota: StickyNote,
  chiamata: PhoneCall,
  email: Mail,
  visita: CalendarCheck2,
  cambio_stato: ArrowRight,
};

const initials = (name: string) => name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();

export default function AdminPrenotazioni() {
  const [leads, setLeads] = useState<RichiestaAffitto[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return mockRichieste;
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(leads)); } catch {}
  }, [leads]);

  const [view, setView] = useState<"pipeline" | "list">("pipeline");
  const [search, setSearch] = useState("");
  const [filterFonte, setFilterFonte] = useState<string>("all");
  const [filterOperatore, setFilterOperatore] = useState<string>("all");
  const [filterPriorita, setFilterPriorita] = useState<string>("all");
  const [selected, setSelected] = useState<RichiestaAffitto | null>(null);
  const [activityType, setActivityType] = useState<Activity["tipo"]>("nota");
  const [activityText, setActivityText] = useState("");
  const [activityFilter, setActivityFilter] = useState<string>("all");
  const [lostDialogOpen, setLostDialogOpen] = useState(false);
  const [lostReason, setLostReason] = useState("");
  const [newLeadOpen, setNewLeadOpen] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return leads.filter(l => {
      if (search) {
        const s = search.toLowerCase();
        if (!l.student_nome.toLowerCase().includes(s) &&
            !l.email.toLowerCase().includes(s) &&
            !l.telefono.includes(s)) return false;
      }
      if (filterFonte !== "all" && l.fonte !== filterFonte) return false;
      if (filterOperatore !== "all" && l.operatore_assegnato !== filterOperatore) return false;
      if (filterPriorita !== "all" && l.priorita !== filterPriorita) return false;
      return true;
    });
  }, [leads, search, filterFonte, filterOperatore, filterPriorita]);

  // KPIs
  const kpis = useMemo(() => {
    const total = leads.length;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const newThisWeek = leads.filter(l => new Date(l.created_at) >= weekAgo).length;
    const won = leads.filter(l => l.pipeline_stato === "contratto_firmato").length;
    const closed = leads.filter(l => l.pipeline_stato === "contratto_firmato" || l.pipeline_stato === "perso").length;
    const conversion = closed > 0 ? Math.round((won / closed) * 100) : 0;
    const pipelineValue = leads
      .filter(l => l.pipeline_stato !== "perso" && l.pipeline_stato !== "contratto_firmato")
      .reduce((sum, l) => sum + (l.budget_max || 0) * 11, 0); // valore annuale stimato
    return { total, newThisWeek, conversion, pipelineValue };
  }, [leads]);

  const updateLead = (id: string, patch: Partial<RichiestaAffitto>) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, ...patch } : prev);
  };

  const moveStato = (id: string, newStato: LeadStato) => {
    const lead = leads.find(l => l.id === id);
    if (!lead || lead.pipeline_stato === newStato) return;
    const stageLabel = STAGES.find(s => s.id === newStato)?.label;
    const activity: Activity = {
      id: `act-${Date.now()}`,
      tipo: "cambio_stato",
      testo: `Spostato in "${stageLabel}"`,
      autore: "Tu",
      createdAt: new Date().toISOString(),
    };
    updateLead(id, {
      pipeline_stato: newStato,
      attivita: [...lead.attivita, activity],
      stato: newStato === "contratto_firmato" ? "approvata" : newStato === "perso" ? "rifiutata" : "pending",
    });
    toast.success(`Lead spostato in "${stageLabel}"`);
  };

  const addActivity = () => {
    if (!selected || !activityText.trim()) return;
    const newAct: Activity = {
      id: `act-${Date.now()}`,
      tipo: activityType,
      testo: activityText.trim(),
      autore: "Tu",
      createdAt: new Date().toISOString(),
    };
    updateLead(selected.id, { attivita: [...selected.attivita, newAct] });
    setActivityText("");
    toast.success("Attività aggiunta");
  };

  const markAsLost = () => {
    if (!selected || !lostReason.trim()) return;
    const lead = selected;
    const newAct: Activity = {
      id: `act-${Date.now()}`,
      tipo: "cambio_stato",
      testo: `Marcato come perso: ${lostReason.trim()}`,
      autore: "Tu",
      createdAt: new Date().toISOString(),
    };
    updateLead(lead.id, {
      pipeline_stato: "perso",
      stato: "rifiutata",
      motivo_perdita: lostReason.trim(),
      attivita: [...lead.attivita, newAct],
    });
    setLostReason("");
    setLostDialogOpen(false);
    toast.success("Lead marcato come perso");
  };

  const nextStage = (current: LeadStato): LeadStato | null => {
    const idx = STAGES.findIndex(s => s.id === current);
    if (idx < 0 || idx >= STAGES.length - 2) return null; // skip "perso"
    return STAGES[idx + 1].id;
  };

  const filteredActivities = useMemo(() => {
    if (!selected) return [];
    const sorted = [...selected.attivita].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (activityFilter === "all") return sorted;
    return sorted.filter(a => a.tipo === activityFilter);
  }, [selected, activityFilter]);

  const FiltersContent = () => (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Fonte</label>
        <Select value={filterFonte} onValueChange={setFilterFonte}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutte le fonti</SelectItem>
            <SelectItem value="sito">Sito web</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="google">Google</SelectItem>
            <SelectItem value="passaparola">Passaparola</SelectItem>
            <SelectItem value="fiera">Fiera</SelectItem>
            <SelectItem value="altro">Altro</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Operatore</label>
        <Select value={filterOperatore} onValueChange={setFilterOperatore}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutti gli operatori</SelectItem>
            {mockOperatori.map(op => <SelectItem key={op} value={op}>{op}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Priorità</label>
        <Select value={filterPriorita} onValueChange={setFilterPriorita}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutte le priorità</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="media">Media</SelectItem>
            <SelectItem value="bassa">Bassa</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {(filterFonte !== "all" || filterOperatore !== "all" || filterPriorita !== "all") && (
        <Button variant="ghost" size="sm" className="w-full" onClick={() => {
          setFilterFonte("all"); setFilterOperatore("all"); setFilterPriorita("all");
        }}>
          <X className="h-4 w-4 mr-1" /> Reset filtri
        </Button>
      )}
    </div>
  );

  return (
    <PageTransition className="p-4 md:p-6 space-y-4 md:space-y-6">
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold">CRM Richieste</h1>
            <p className="text-sm text-muted-foreground">Pipeline di vendita e gestione lead</p>
          </div>
          <Button onClick={() => setNewLeadOpen(true)} className="gap-1.5">
            <Plus className="h-4 w-4" /> Nuovo lead
          </Button>
        </div>
      </FadeIn>

      {/* KPIs */}
      <FadeIn delay={0.05}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><Users className="h-3.5 w-3.5"/>Lead totali</div>
            <p className="text-2xl font-bold">{kpis.total}</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><Flame className="h-3.5 w-3.5"/>Nuovi 7gg</div>
            <p className="text-2xl font-bold">{kpis.newThisWeek}</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><TrendingUp className="h-3.5 w-3.5"/>Conversione</div>
            <p className="text-2xl font-bold">{kpis.conversion}%</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><Euro className="h-3.5 w-3.5"/>Valore pipeline</div>
            <p className="text-2xl font-bold">€{(kpis.pipelineValue / 1000).toFixed(1)}k</p>
          </Card>
        </div>
      </FadeIn>

      {/* Toolbar */}
      <FadeIn delay={0.1}>
        <Card className="p-3 md:p-4">
          <div className="flex flex-col md:flex-row gap-2 md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca per nome, email, telefono..." className="pl-9" />
            </div>

            {/* Desktop filters */}
            <div className="hidden md:flex gap-2">
              <Select value={filterFonte} onValueChange={setFilterFonte}>
                <SelectTrigger className="w-[140px]"><SelectValue placeholder="Fonte"/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutte fonti</SelectItem>
                  <SelectItem value="sito">Sito</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="passaparola">Passaparola</SelectItem>
                  <SelectItem value="fiera">Fiera</SelectItem>
                  <SelectItem value="altro">Altro</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterOperatore} onValueChange={setFilterOperatore}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Operatore"/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti operatori</SelectItem>
                  {mockOperatori.map(op => <SelectItem key={op} value={op}>{op}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterPriorita} onValueChange={setFilterPriorita}>
                <SelectTrigger className="w-[130px]"><SelectValue placeholder="Priorità"/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutte priorità</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="bassa">Bassa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mobile filters in sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden gap-1.5">
                  <Filter className="h-4 w-4"/> Filtri
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[60vh]">
                <SheetHeader><SheetTitle>Filtri</SheetTitle></SheetHeader>
                <div className="mt-4"><FiltersContent /></div>
              </SheetContent>
            </Sheet>

            <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as "pipeline" | "list")} className="border rounded-md">
              <ToggleGroupItem value="pipeline" size="sm" aria-label="Pipeline"><LayoutGrid className="h-4 w-4"/></ToggleGroupItem>
              <ToggleGroupItem value="list" size="sm" aria-label="Lista"><ListIcon className="h-4 w-4"/></ToggleGroupItem>
            </ToggleGroup>
          </div>
        </Card>
      </FadeIn>

      {/* Pipeline view */}
      {view === "pipeline" && (
        <FadeIn delay={0.15}>
          <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0 snap-x snap-mandatory md:snap-none">
            <div className="flex gap-3 md:gap-4 min-w-min pb-2">
              {STAGES.map(stage => {
                const items = filtered.filter(l => l.pipeline_stato === stage.id);
                const stageValue = items.reduce((s, l) => s + (l.budget_max || 0), 0);
                return (
                  <div
                    key={stage.id}
                    className="w-[280px] md:w-[300px] flex-shrink-0 snap-start"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => { if (draggedId) moveStato(draggedId, stage.id); setDraggedId(null); }}
                  >
                    <div className="flex items-center justify-between mb-2 px-1">
                      <div className="flex items-center gap-2">
                        <div className={cn("h-2 w-2 rounded-full", stage.color)} />
                        <h3 className="font-semibold text-sm">{stage.label}</h3>
                        <Badge variant="secondary" className="text-xs h-5">{items.length}</Badge>
                      </div>
                      <span className="text-[10px] text-muted-foreground">€{stageValue}/m</span>
                    </div>
                    <div className="bg-muted/40 rounded-lg p-2 min-h-[200px] space-y-2">
                      {items.length === 0 && (
                        <div className="text-xs text-muted-foreground text-center py-8">Nessun lead</div>
                      )}
                      {items.map(lead => {
                        const Fonte = FONTE_ICON[lead.fonte];
                        const days = differenceInDays(new Date(), new Date(lead.created_at));
                        return (
                          <div
                            key={lead.id}
                            draggable
                            onDragStart={() => setDraggedId(lead.id)}
                            onDragEnd={() => setDraggedId(null)}
                            onClick={() => setSelected(lead)}
                            className={cn(
                              "bg-card border rounded-md p-3 cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden",
                              draggedId === lead.id && "opacity-50"
                            )}
                          >
                            <div className={cn("absolute left-0 top-0 bottom-0 w-1", PRIORITA_COLOR[lead.priorita])} />
                            <div className="pl-1.5 space-y-2">
                              <div className="flex items-start gap-2">
                                <Avatar className="h-7 w-7">
                                  <AvatarFallback className="text-[10px]">{initials(lead.student_nome)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm truncate">{lead.student_nome}</p>
                                  <p className="text-[11px] text-muted-foreground truncate">{lead.camera_nome}</p>
                                </div>
                                <Fonte className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                                <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3"/>{days}g in pipeline</span>
                                {lead.budget_max && <span>€{lead.budget_max}/m</span>}
                              </div>
                              {lead.operatore_assegnato && (
                                <div className="flex items-center gap-1.5">
                                  <Avatar className="h-4 w-4"><AvatarFallback className="text-[8px]">{initials(lead.operatore_assegnato)}</AvatarFallback></Avatar>
                                  <span className="text-[10px] text-muted-foreground truncate">{lead.operatore_assegnato}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeIn>
      )}

      {/* List view */}
      {view === "list" && (
        <FadeIn delay={0.15}>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="p-3 font-medium">Nome</th>
                    <th className="p-3 font-medium hidden md:table-cell">Contatto</th>
                    <th className="p-3 font-medium hidden lg:table-cell">Camera</th>
                    <th className="p-3 font-medium">Stato</th>
                    <th className="p-3 font-medium hidden md:table-cell">Operatore</th>
                    <th className="p-3 font-medium">Priorità</th>
                    <th className="p-3 font-medium hidden lg:table-cell">Ultima attività</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">Nessun lead</td></tr>
                  )}
                  {filtered.map(lead => {
                    const stage = STAGES.find(s => s.id === lead.pipeline_stato)!;
                    const lastAct = lead.attivita[lead.attivita.length - 1];
                    return (
                      <tr key={lead.id} className="border-t hover:bg-muted/30 cursor-pointer" onClick={() => setSelected(lead)}>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7"><AvatarFallback className="text-[10px]">{initials(lead.student_nome)}</AvatarFallback></Avatar>
                            <span className="font-medium">{lead.student_nome}</span>
                          </div>
                        </td>
                        <td className="p-3 hidden md:table-cell text-xs text-muted-foreground">
                          <div>{lead.email}</div>
                          <div>{lead.telefono}</div>
                        </td>
                        <td className="p-3 hidden lg:table-cell text-xs text-muted-foreground">{lead.camera_nome}</td>
                        <td className="p-3"><Badge variant="secondary" className="text-xs"><span className={cn("h-1.5 w-1.5 rounded-full mr-1.5", stage.color)}/>{stage.label}</Badge></td>
                        <td className="p-3 hidden md:table-cell text-xs">{lead.operatore_assegnato || <span className="text-muted-foreground">—</span>}</td>
                        <td className="p-3"><Badge className={cn("text-xs", PRIORITA_BADGE[lead.priorita])}>{lead.priorita}</Badge></td>
                        <td className="p-3 hidden lg:table-cell text-xs text-muted-foreground">
                          {lastAct ? formatDistanceToNow(new Date(lastAct.createdAt), { addSuffix: true, locale: it }) : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </FadeIn>
      )}

      {/* Lead detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-5xl max-h-[95vh] p-0 overflow-hidden">
          {selected && (() => {
            const stage = STAGES.find(s => s.id === selected.pipeline_stato)!;
            const Fonte = FONTE_ICON[selected.fonte];
            const next = nextStage(selected.pipeline_stato);
            return (
              <div className="flex flex-col lg:flex-row max-h-[95vh]">
                {/* LEFT: contact info */}
                <div className="lg:w-[380px] lg:border-r overflow-y-auto p-5 space-y-4 bg-muted/20">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback>{initials(selected.student_nome)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h2 className="font-heading text-xl font-bold">{selected.student_nome}</h2>
                      <Badge variant="secondary" className="mt-1 text-xs"><span className={cn("h-1.5 w-1.5 rounded-full mr-1.5", stage.color)}/>{stage.label}</Badge>
                    </div>
                  </div>

                  {/* Quick contact */}
                  <div className="grid grid-cols-3 gap-2">
                    <Button size="sm" variant="outline" asChild><a href={`tel:${selected.telefono}`}><Phone className="h-3.5 w-3.5"/></a></Button>
                    <Button size="sm" variant="outline" asChild><a href={`mailto:${selected.email}`}><Mail className="h-3.5 w-3.5"/></a></Button>
                    <Button size="sm" variant="outline" asChild><a href={`https://wa.me/${selected.telefono.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"><MessageCircle className="h-3.5 w-3.5"/></a></Button>
                  </div>

                  {/* Contact details */}
                  <div className="space-y-2 text-sm">
                    <Row icon={Phone} label="Telefono">{selected.telefono}</Row>
                    <Row icon={Mail} label="Email">{selected.email}</Row>
                    {selected.eta && <Row icon={UserIcon} label="Età">{selected.eta} anni</Row>}
                    {selected.corso_universita && <Row icon={GraduationCap} label="Corso">{selected.corso_universita}</Row>}
                    {selected.citta_provenienza && <Row icon={MapPin} label="Da">{selected.citta_provenienza}</Row>}
                    <Row icon={Fonte} label="Fonte"><span className="capitalize">{selected.fonte}</span></Row>
                    {selected.budget_max && <Row icon={Euro} label="Budget max">€{selected.budget_max}/mese</Row>}
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground">Camera richiesta</h4>
                    <p className="text-sm font-medium">{selected.camera_nome}</p>
                    <p className="text-xs text-muted-foreground">{selected.data_inizio} → {selected.data_fine}</p>
                    {selected.note && (
                      <div className="bg-muted/50 rounded p-2 text-xs italic">"{selected.note}"</div>
                    )}
                  </div>

                  {/* Management */}
                  <div className="border-t pt-4 space-y-3">
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground">Gestione</h4>

                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Operatore</label>
                      <Select value={selected.operatore_assegnato || "none"} onValueChange={(v) => updateLead(selected.id, { operatore_assegnato: v === "none" ? undefined : v })}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue/></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Non assegnato</SelectItem>
                          {mockOperatori.map(op => <SelectItem key={op} value={op}>{op}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Priorità</label>
                      <Select value={selected.priorita} onValueChange={(v) => updateLead(selected.id, { priorita: v as LeadPriorita })}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue/></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alta">Alta</SelectItem>
                          <SelectItem value="media">Media</SelectItem>
                          <SelectItem value="bassa">Bassa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Prossimo follow-up</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full justify-start font-normal text-xs h-8">
                            <CalendarIcon className="h-3.5 w-3.5 mr-1.5"/>
                            {selected.prossimo_followup ? format(new Date(selected.prossimo_followup), "d MMM yyyy", { locale: it }) : "Seleziona data"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selected.prossimo_followup ? new Date(selected.prossimo_followup) : undefined}
                            onSelect={(d) => updateLead(selected.id, { prossimo_followup: d?.toISOString() })}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {selected.motivo_perdita && (
                    <div className="border-t pt-4">
                      <h4 className="text-xs font-semibold uppercase text-rose-700 mb-1">Motivo perdita</h4>
                      <p className="text-sm">{selected.motivo_perdita}</p>
                    </div>
                  )}
                </div>

                {/* RIGHT: timeline + composer */}
                <div className="flex-1 flex flex-col min-h-0">
                  <DialogHeader className="p-5 pb-3 border-b">
                    <DialogTitle>Storico attività</DialogTitle>
                    <DialogDescription className="text-xs">{selected.attivita.length} attività registrate</DialogDescription>
                  </DialogHeader>

                  <Tabs value={activityFilter} onValueChange={setActivityFilter} className="px-5 pt-2">
                    <TabsList className="h-8">
                      <TabsTrigger value="all" className="text-xs h-6">Tutte</TabsTrigger>
                      <TabsTrigger value="nota" className="text-xs h-6">Note</TabsTrigger>
                      <TabsTrigger value="chiamata" className="text-xs h-6">Chiamate</TabsTrigger>
                      <TabsTrigger value="email" className="text-xs h-6">Email</TabsTrigger>
                      <TabsTrigger value="cambio_stato" className="text-xs h-6">Stati</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <div className="flex-1 overflow-y-auto p-5 space-y-3">
                    {filteredActivities.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-8">Nessuna attività</p>
                    )}
                    {filteredActivities.map(act => {
                      const Icon = ACTIVITY_ICON[act.tipo];
                      return (
                        <div key={act.id} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                              <Icon className="h-3.5 w-3.5"/>
                            </div>
                            <div className="w-px flex-1 bg-border mt-1" />
                          </div>
                          <div className="flex-1 pb-3">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="font-medium">{act.autore}</span>
                              <span className="text-muted-foreground">·</span>
                              <span className="text-muted-foreground capitalize">{act.tipo.replace("_", " ")}</span>
                              <span className="text-muted-foreground">·</span>
                              <span className="text-muted-foreground">{formatDistanceToNow(new Date(act.createdAt), { addSuffix: true, locale: it })}</span>
                            </div>
                            <p className="text-sm mt-0.5">{act.testo}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Composer */}
                  <div className="border-t p-4 space-y-2 bg-muted/20">
                    <ToggleGroup type="single" value={activityType} onValueChange={(v) => v && setActivityType(v as Activity["tipo"])} className="justify-start">
                      <ToggleGroupItem value="nota" size="sm" className="text-xs gap-1"><StickyNote className="h-3 w-3"/>Nota</ToggleGroupItem>
                      <ToggleGroupItem value="chiamata" size="sm" className="text-xs gap-1"><PhoneCall className="h-3 w-3"/>Chiamata</ToggleGroupItem>
                      <ToggleGroupItem value="email" size="sm" className="text-xs gap-1"><Mail className="h-3 w-3"/>Email</ToggleGroupItem>
                      <ToggleGroupItem value="visita" size="sm" className="text-xs gap-1"><CalendarCheck2 className="h-3 w-3"/>Visita</ToggleGroupItem>
                    </ToggleGroup>
                    <div className="flex gap-2">
                      <Textarea
                        value={activityText}
                        onChange={e => setActivityText(e.target.value)}
                        placeholder="Aggiungi un'attività..."
                        className="min-h-[60px] text-sm"
                      />
                      <Button onClick={addActivity} disabled={!activityText.trim()} size="icon" className="h-auto"><Send className="h-4 w-4"/></Button>
                    </div>
                  </div>

                  <DialogFooter className="p-4 border-t flex-row gap-2 sm:justify-between">
                    <Button variant="outline" size="sm" onClick={() => setLostDialogOpen(true)} className="text-rose-600 hover:text-rose-700">
                      <X className="h-4 w-4 mr-1"/>Marca come perso
                    </Button>
                    {next && (
                      <Button size="sm" onClick={() => moveStato(selected.id, next)}>
                        Sposta in "{STAGES.find(s => s.id === next)?.label}" <ArrowRight className="h-4 w-4 ml-1"/>
                      </Button>
                    )}
                  </DialogFooter>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Lost dialog */}
      <Dialog open={lostDialogOpen} onOpenChange={setLostDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Marca lead come perso</DialogTitle>
            <DialogDescription>Indica il motivo per migliorare le statistiche.</DialogDescription>
          </DialogHeader>
          <Textarea value={lostReason} onChange={e => setLostReason(e.target.value)} placeholder="Es. budget non compatibile, ha scelto altra struttura..." />
          <DialogFooter>
            <Button variant="outline" onClick={() => setLostDialogOpen(false)}>Annulla</Button>
            <Button onClick={markAsLost} disabled={!lostReason.trim()} variant="destructive">Conferma</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New lead dialog */}
      <NewLeadDialog open={newLeadOpen} onOpenChange={setNewLeadOpen} onCreate={(lead) => {
        setLeads(prev => [lead, ...prev]);
        toast.success("Lead creato");
      }} />
    </PageTransition>
  );
}

function Row({ icon: Icon, label, children }: { icon: typeof Phone; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase text-muted-foreground">{label}</div>
        <div className="text-sm truncate">{children}</div>
      </div>
    </div>
  );
}

function NewLeadDialog({ open, onOpenChange, onCreate }: { open: boolean; onOpenChange: (v: boolean) => void; onCreate: (l: RichiestaAffitto) => void }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [camera, setCamera] = useState("");
  const [fonte, setFonte] = useState<LeadFonte>("sito");
  const [budget, setBudget] = useState("");
  const [note, setNote] = useState("");

  const reset = () => { setNome(""); setEmail(""); setTelefono(""); setCamera(""); setFonte("sito"); setBudget(""); setNote(""); };

  const handleCreate = () => {
    if (!nome.trim() || !email.trim() || !telefono.trim()) {
      toast.error("Nome, email e telefono sono obbligatori");
      return;
    }
    const lead: RichiestaAffitto = {
      id: `lead-${Date.now()}`,
      camera_id: "n/a",
      camera_nome: camera || "Da assegnare",
      student_id: `s-${Date.now()}`,
      student_nome: nome.trim(),
      data_inizio: "",
      data_fine: "",
      stato: "pending",
      pipeline_stato: "nuovo",
      created_at: new Date().toISOString(),
      telefono: telefono.trim(),
      email: email.trim(),
      fonte,
      budget_max: budget ? Number(budget) : undefined,
      priorita: "media",
      note: note.trim() || undefined,
      attivita: [{
        id: `act-${Date.now()}`,
        tipo: "cambio_stato",
        testo: "Lead creato manualmente",
        autore: "Tu",
        createdAt: new Date().toISOString(),
      }],
    };
    onCreate(lead);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Nuovo lead</DialogTitle></DialogHeader>
        <div className="grid gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block">Nome completo *</label>
              <Input value={nome} onChange={e => setNome(e.target.value)} placeholder="Mario Rossi"/>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Telefono *</label>
              <Input value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="+39 333..."/>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Email *</label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com"/>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block">Camera interesse</label>
              <Input value={camera} onChange={e => setCamera(e.target.value)} placeholder="Es. Singola 101"/>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Budget mensile (€)</label>
              <Input type="number" value={budget} onChange={e => setBudget(e.target.value)} placeholder="500"/>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Fonte</label>
            <Select value={fonte} onValueChange={(v) => setFonte(v as LeadFonte)}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="sito">Sito web</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="passaparola">Passaparola</SelectItem>
                <SelectItem value="fiera">Fiera</SelectItem>
                <SelectItem value="altro">Altro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Note</label>
            <Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Note iniziali..." className="min-h-[60px]"/>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annulla</Button>
          <Button onClick={handleCreate}>Crea lead</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
