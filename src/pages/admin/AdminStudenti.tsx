import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  mockProfiles,
  mockRichieste,
  mockTickets,
  mockContratti,
  mockFatture,
  FATTURE_KEY,
  type Profile,
  type Fattura,
  type FatturaStato,
  type SollecitoPagamento,
  type Contratto,
  type StudenteStato,
  type MotivoUscita,
  type RichiestaAffitto,
  type SupportTicket,
} from "@/data/mockData";
import { loadLeads } from "@/data/leadsStore";
import { loadAllTickets } from "@/data/ticketsStore";
import { rooms as mockRooms } from "@/data/rooms";
import {
  PageTransition,
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion/MotionWrappers";
import {
  Search,
  Users,
  Home,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  BedDouble,
  FileText,
  Headphones,
  LayoutGrid,
  List as ListIcon,
  ExternalLink,
  Instagram,
  MapPin,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Sparkles,
  UserPlus,
  Activity,
  Euro,
  Upload,
  Receipt,
  AlertTriangle,
  Send,
  Plus,
  MailOpen,
  BarChart2,
  ChevronDown,
  ChevronUp,
  Star,
  LogOut,
  RotateCcw,
  NotebookPen,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { formatEUR } from "@/lib/csv";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ViewMode = "grid" | "list";
type FilterMode = "all" | "assigned" | "unassigned";
type LifecycleFilter = "all" | "attivo" | "in_uscita" | "ex_studente";
type SortMode = "name" | "anno" | "recent";

const MESI_2026 = [
  "Gennaio 2026","Febbraio 2026","Marzo 2026","Aprile 2026","Maggio 2026","Giugno 2026",
  "Luglio 2026","Agosto 2026","Settembre 2026","Ottobre 2026","Novembre 2026","Dicembre 2026",
];

const SOLLECITO_TEMPLATES: { numero: number; oggetto: string; testo: string }[] = [
  { numero: 1, oggetto: "Promemoria gentile - pagamento in attesa", testo: "Gentile studente, ti ricordiamo che la fattura del mese corrente è ancora in attesa di pagamento. Ti invitiamo a procedere entro i prossimi giorni." },
  { numero: 2, oggetto: "Secondo sollecito - pagamento non ricevuto", testo: "Gentile studente, non abbiamo ancora ricevuto il pagamento della fattura. Ti invitiamo a regolarizzare la situazione al più presto." },
  { numero: 3, oggetto: "Terzo sollecito - pagamento urgente", testo: "Gentile studente, questo è il terzo sollecito per il pagamento in sospeso. Chiediamo di provvedere entro 7 giorni per evitare ulteriori misure." },
  { numero: 4, oggetto: "Sollecito urgente - azione richiesta", testo: "Gentile studente, il pagamento risulta scaduto da oltre 21 giorni. È necessario regolarizzare immediatamente la situazione." },
  { numero: 5, oggetto: "Ultimatum - pagamento entro 48 ore", testo: "Gentile studente, questo è l'ultimatum: il pagamento deve essere effettuato entro 48 ore o saremo costretti a prendere ulteriori provvedimenti." },
  { numero: 6, oggetto: "Avviso legale - procedura di recupero crediti", testo: "Gentile studente, in mancanza di pagamento entro 5 giorni, ci vedremo costretti ad avviare la procedura di recupero crediti tramite studio legale." },
];

const MOTIVO_USCITA_OPTIONS: { value: MotivoUscita; label: string }[] = [
  { value: "laurea", label: "Laurea" },
  { value: "trasferimento", label: "Trasferimento" },
  { value: "fine_anno", label: "Fine anno accademico" },
  { value: "disdetta_anticipata", label: "Disdetta anticipata" },
  { value: "mancato_pagamento", label: "Mancato pagamento" },
  { value: "altro", label: "Altro" },
];

const formatDate = (iso?: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const relTime = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "ora";
  if (m < 60) return `${m} min fa`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h fa`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d} g fa`;
  const mo = Math.round(d / 30);
  if (mo < 12) return `${mo} mesi fa`;
  return `${Math.round(mo / 12)} anni fa`;
};

// Derived type helpers
type EnrichedStudent = {
  profile: Profile;
  richiesta: RichiestaAffitto | undefined;
  tickets: SupportTicket[];
  openTickets: SupportTicket[];
  room: ReturnType<typeof mockRooms.find>;
  contratto: (typeof mockContratti)[number] | undefined;
  overdue: boolean;
  lastFattura: Fattura | undefined;
};

// ─────────────────────────────────────────────────────────────
//  Stato badge helper
// ─────────────────────────────────────────────────────────────
function StudenteStatoBadge({ stato, small }: { stato?: StudenteStato; small?: boolean }) {
  if (!stato) return null;
  const cls = small ? "text-[10px]" : "text-xs";
  const map: Record<StudenteStato, string> = {
    attivo: "bg-green-100 text-green-700 hover:bg-green-100",
    in_uscita: "bg-orange-100 text-orange-700 hover:bg-orange-100",
    ex_studente: "bg-gray-100 text-gray-600 hover:bg-gray-100",
    sospeso: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  };
  const labels: Record<StudenteStato, string> = {
    attivo: "Attivo",
    in_uscita: "In Uscita",
    ex_studente: "Ex Studente",
    sospeso: "Sospeso",
  };
  return (
    <Badge className={`${cls} shrink-0 ${map[stato]}`}>
      {labels[stato]}
    </Badge>
  );
}

// ─────────────────────────────────────────────────────────────
//  Mock bar chart data (ingressi ultimi 8 mesi)
// ─────────────────────────────────────────────────────────────
const INGRESSI_MOCK = [
  { mese: "Ott '24", ingressi: 3 },
  { mese: "Nov '24", ingressi: 1 },
  { mese: "Dic '24", ingressi: 0 },
  { mese: "Gen '25", ingressi: 2 },
  { mese: "Feb '25", ingressi: 1 },
  { mese: "Mar '25", ingressi: 2 },
  { mese: "Set '25", ingressi: 4 },
  { mese: "Ott '25", ingressi: 1 },
];

// ─────────────────────────────────────────────────────────────
//  Main component
// ─────────────────────────────────────────────────────────────
export default function AdminStudenti() {
  const [profilesState, setProfilesState] = useState<Profile[]>(mockProfiles);
  const [contrattiState, setContrattiState] = useState<Contratto[]>(mockContratti);

  const students = useMemo(
    () => profilesState.filter((p) => p.role === "student"),
    [profilesState],
  );

  const [selected, setSelected] = useState<Profile | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [lifecycleFilter, setLifecycleFilter] = useState<LifecycleFilter>("all");
  const [view, setView] = useState<ViewMode>("grid");
  const [sort, setSort] = useState<SortMode>("name");
  const [showNuovoStudente, setShowNuovoStudente] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Fatture — persisted to localStorage so edits survive page refresh
  const [fattureState, setFattureState] = useState<Fattura[]>(() => {
    try {
      const saved = localStorage.getItem(FATTURE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return mockFatture;
  });
  useEffect(() => {
    try { localStorage.setItem(FATTURE_KEY, JSON.stringify(fattureState)); } catch {}
  }, [fattureState]);

  const enriched = useMemo<EnrichedStudent[]>(() => {
    const liveLeads = loadLeads();
    const liveTickets = loadAllTickets();
    return students.map((s) => {
      const richiesta = liveLeads.find(
        (r) => r.student_id === s.id && r.stato === "approvata",
      );
      const tickets = liveTickets.filter((t) => t.student_id === s.id);
      const openTickets = tickets.filter((t) => t.stato !== "risolto");
      const room = s.camera_id ? mockRooms.find((r) => r.id === s.camera_id) : undefined;
      const contratto = contrattiState.find(
        (c) => c.student_nome === `${s.nome} ${s.cognome}`,
      );
      const studentFatture = fattureState.filter((f) => f.student_id === s.id);
      const overdue = studentFatture.some((f) => f.stato === "scaduta" || f.stato === "in_ritardo");
      const lastFattura = studentFatture.sort((a, b) =>
        b.data_emissione.localeCompare(a.data_emissione),
      )[0];
      return { profile: s, richiesta, tickets, openTickets, room, contratto, overdue, lastFattura };
    });
  }, [students, fattureState, contrattiState]);

  // KPI
  const kpis = useMemo(() => {
    const attivi = enriched.filter((e) => !!e.profile.camera_id).length;
    const mrr = contrattiState
      .filter((c) => c.stato === "attivo")
      .reduce((sum, c) => sum + c.canone_mensile, 0);
    const fattureAperte = fattureState.filter((f) => f.stato !== "pagata").length;
    const oggi = new Date();
    const tra60 = new Date(oggi.getTime() + 60 * 24 * 60 * 60 * 1000);
    const inScadenza = contrattiState.filter((c) => {
      const d = new Date(c.data_fine);
      return d >= oggi && d <= tra60;
    }).length;
    return { attivi, mrr, fattureAperte, inScadenza };
  }, [enriched, fattureState, contrattiState]);

  // Lifecycle counts
  const lifecycleCounts = useMemo(() => {
    const all = students.length;
    const attivi = students.filter((s) => s.student_stato === "attivo").length;
    const in_uscita = students.filter((s) => s.student_stato === "in_uscita").length;
    const ex_studente = students.filter((s) => s.student_stato === "ex_studente").length;
    return { all, attivi, in_uscita, ex_studente };
  }, [students]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = enriched.filter((e) => {
      if (filter === "assigned" && !e.profile.camera_id) return false;
      if (filter === "unassigned" && e.profile.camera_id) return false;
      if (lifecycleFilter !== "all" && e.profile.student_stato !== lifecycleFilter) return false;
      if (!q) return true;
      const hay = `${e.profile.nome} ${e.profile.cognome} ${e.profile.email} ${e.profile.corso}`.toLowerCase();
      return hay.includes(q);
    });
    list = [...list].sort((a, b) => {
      if (sort === "name")
        return `${a.profile.cognome} ${a.profile.nome}`.localeCompare(
          `${b.profile.cognome} ${b.profile.nome}`,
        );
      if (sort === "anno") return a.profile.anno - b.profile.anno;
      if (sort === "recent") {
        const ad = a.richiesta?.created_at || "";
        const bd = b.richiesta?.created_at || "";
        return bd.localeCompare(ad);
      }
      return 0;
    });
    return list;
  }, [enriched, filter, lifecycleFilter, search, sort]);

  const selectedData = selected
    ? enriched.find((e) => e.profile.id === selected.id) ?? null
    : null;

  const updateFattura = (id: string, patch: Partial<Fattura>) => {
    setFattureState((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  };

  const addFattura = (f: Fattura) => {
    setFattureState((prev) => [...prev, f]);
  };

  const updateProfile = (id: string, patch: Partial<Profile>) => {
    setProfilesState((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    );
    // Keep selected in sync
    setSelected((prev) =>
      prev?.id === id ? { ...prev, ...patch } : prev,
    );
  };

  const addProfile = (p: Profile) => {
    setProfilesState((prev) => [...prev, p]);
  };

  const addContratto = (c: Contratto) => {
    setContrattiState((prev) => [...prev, c]);
  };

  // Stats data
  const statsData = useMemo(() => {
    const allStudents = students;
    const totalStorico = allStudents.length;
    const exStudenti = allStudents.filter((s) => s.student_stato === "ex_studente");
    const exCount = exStudenti.length;

    const today = new Date();
    const permanenzaGiorni = allStudents
      .filter((s) => s.data_ingresso)
      .map((s) => {
        const inizio = new Date(s.data_ingresso!);
        const fine = s.data_uscita ? new Date(s.data_uscita) : today;
        return Math.max(0, (fine.getTime() - inizio.getTime()) / (1000 * 60 * 60 * 24));
      });
    const permanenzaMedia =
      permanenzaGiorni.length > 0
        ? Math.round(permanenzaGiorni.reduce((a, b) => a + b, 0) / permanenzaGiorni.length)
        : 0;

    // Motivo più comune tra ex studenti
    const motiviCount: Partial<Record<MotivoUscita, number>> = {};
    exStudenti.forEach((s) => {
      if (s.motivo_uscita) {
        motiviCount[s.motivo_uscita] = (motiviCount[s.motivo_uscita] ?? 0) + 1;
      }
    });
    let motivoPiuComune = "—";
    let maxCount = 0;
    (Object.entries(motiviCount) as [MotivoUscita, number][]).forEach(([k, v]) => {
      if (v > maxCount) { maxCount = v; motivoPiuComune = k; }
    });
    const motivoLabel = MOTIVO_USCITA_OPTIONS.find((o) => o.value === motivoPiuComune)?.label ?? motivoPiuComune;

    return { totalStorico, exCount, permanenzaMedia, motivoLabel };
  }, [students]);

  return (
    <PageTransition className="p-4 md:p-6 space-y-4 md:space-y-6">
      <FadeIn>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-2xl font-bold">Studenti & Contratti</h1>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                {kpis.attivi} attivi
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Gestione completa di profili, contratti, fatture e comunicazioni
            </p>
          </div>
          <Button onClick={() => setShowNuovoStudente(true)} className="gap-2">
            <UserPlus className="h-4 w-4" /> Nuovo Studente
          </Button>
        </div>
      </FadeIn>

      {/* KPI bar */}
      <FadeIn delay={0.05}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard icon={Users} label="Studenti Attivi" value={kpis.attivi} tone="primary" />
          <KpiCard
            icon={Euro}
            label="MRR Totale"
            value={kpis.mrr}
            tone="success"
            formatFn={formatEUR}
          />
          <KpiCard
            icon={Receipt}
            label="Fatture da Pagare"
            value={kpis.fattureAperte}
            tone="warning"
          />
          <KpiCard
            icon={AlertCircle}
            label="In Scadenza (60gg)"
            value={kpis.inScadenza}
            tone="muted"
          />
        </div>
      </FadeIn>

      {/* Statistiche storiche toggle */}
      <FadeIn delay={0.07}>
        <Card className="overflow-hidden">
          <button
            onClick={() => setShowStats((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
              Statistiche Storiche
            </div>
            {showStats ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          {showStats && (
            <div className="border-t px-4 pb-4 pt-3 space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Card className="p-3 text-center">
                  <p className="text-2xl font-bold">{statsData.totalStorico}</p>
                  <p className="text-xs text-muted-foreground mt-1">Studenti Totali (storico)</p>
                </Card>
                <Card className="p-3 text-center">
                  <p className="text-2xl font-bold">{statsData.permanenzaMedia}gg</p>
                  <p className="text-xs text-muted-foreground mt-1">Permanenza Media</p>
                </Card>
                <Card className="p-3 text-center">
                  <p className="text-2xl font-bold text-green-700">78%</p>
                  <p className="text-xs text-muted-foreground mt-1">Tasso di Rinnovo</p>
                </Card>
                <Card className="p-3 text-center">
                  <p className="text-2xl font-bold">{statsData.exCount}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ex Studenti · {statsData.motivoLabel}
                  </p>
                </Card>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                  Ingressi per mese (ultimi 8 mesi)
                </p>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={INGRESSI_MOCK} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="mese" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ fontSize: 12 }}
                        formatter={(v: number) => [`${v} ingressi`, ""]}
                      />
                      <Bar dataKey="ingressi" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </Card>
      </FadeIn>

      {/* Toolbar */}
      <FadeIn delay={0.1}>
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cerca per nome, email o corso…"
                className="pl-9"
              />
            </div>
            <Select value={sort} onValueChange={(v) => setSort(v as SortMode)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nome A-Z</SelectItem>
                <SelectItem value="anno">Anno di corso</SelectItem>
                <SelectItem value="recent">Più recenti</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1 border rounded-md p-0.5">
              <Button
                variant={view === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("grid")}
                className="h-8 w-8 p-0"
                title="Vista griglia"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={view === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("list")}
                className="h-8 w-8 p-0"
                title="Vista lista"
              >
                <ListIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Lifecycle filter tabs */}
          <Tabs
            value={lifecycleFilter}
            onValueChange={(v) => setLifecycleFilter(v as LifecycleFilter)}
          >
            <TabsList>
              <TabsTrigger value="all">Tutti ({lifecycleCounts.all})</TabsTrigger>
              <TabsTrigger value="attivo">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
                  Attivi ({lifecycleCounts.attivi})
                </span>
              </TabsTrigger>
              <TabsTrigger value="in_uscita">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-orange-400 inline-block" />
                  In Uscita ({lifecycleCounts.in_uscita})
                </span>
              </TabsTrigger>
              <TabsTrigger value="ex_studente">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-gray-400 inline-block" />
                  Ex Studenti ({lifecycleCounts.ex_studente})
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Camera filter */}
          <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterMode)}>
            <TabsList>
              <TabsTrigger value="all">Tutti ({enriched.length})</TabsTrigger>
              <TabsTrigger value="assigned">Assegnati ({kpis.attivi})</TabsTrigger>
              <TabsTrigger value="unassigned">
                Senza camera ({enriched.length - kpis.attivi})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </Card>
      </FadeIn>

      {/* Lista */}
      <FadeIn delay={0.15}>
        {filtered.length === 0 ? (
          <Card className="p-12 text-center">
            <Search className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium">Nessun risultato</p>
            <p className="text-sm text-muted-foreground">Prova a modificare i filtri</p>
          </Card>
        ) : view === "grid" ? (
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((e) => (
              <StaggerItem key={e.profile.id}>
                <StudentGridCard
                  data={e}
                  fatture={fattureState.filter((f) => f.student_id === e.profile.id)}
                  onOpen={() => setSelected(e.profile)}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <Card>
            <StaggerContainer className="divide-y">
              {filtered.map((e) => (
                <StaggerItem key={e.profile.id}>
                  <StudentListRow
                    data={e}
                    onOpen={() => setSelected(e.profile)}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </Card>
        )}
      </FadeIn>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Dettaglio studente</DialogTitle>
          </DialogHeader>
          {selectedData && (
            <StudentDetail
              data={selectedData}
              fatture={fattureState.filter((f) => f.student_id === selectedData.profile.id)}
              onUpdateFattura={updateFattura}
              onAddFattura={addFattura}
              onUpdateProfile={updateProfile}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Nuovo studente dialog */}
      <NuovoStudenteDialog
        open={showNuovoStudente}
        onClose={() => setShowNuovoStudente(false)}
        onAdd={(profile, contratto) => {
          addProfile(profile);
          if (contratto) addContratto(contratto);
        }}
      />
    </PageTransition>
  );
}

// ─────────────────────────────────────────────────────────────
//  Nuovo Studente Dialog
// ─────────────────────────────────────────────────────────────
function NuovoStudenteDialog({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (profile: Profile, contratto?: Contratto) => void;
}) {
  const empty = {
    nome: "", cognome: "", email: "", telefono: "",
    corso: "", anno: "1", camera: "",
    dataIngresso: "", canone: "", dataFine: "",
    noteInterne: "", sendEmail: true,
  };
  const [form, setForm] = useState(empty);

  const set = (k: keyof typeof empty, v: string | boolean) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = () => {
    if (!form.nome.trim() || !form.cognome.trim() || !form.email.trim() || !form.corso.trim()) {
      toast.error("Nome, cognome, email e corso sono obbligatori");
      return;
    }

    const newId = `p-${Date.now()}`;
    const newProfile: Profile = {
      id: newId,
      nome: form.nome.trim(),
      cognome: form.cognome.trim(),
      email: form.email.trim(),
      telefono: form.telefono.trim() || undefined,
      corso: form.corso.trim(),
      anno: parseInt(form.anno) || 1,
      avatar: "",
      bio: "",
      interessi: [],
      role: "student",
      camera_id: form.camera || undefined,
      student_stato: "attivo",
      data_ingresso: form.dataIngresso || new Date().toISOString().slice(0, 10),
      note_interne: form.noteInterne.trim() || undefined,
    };

    let newContratto: Contratto | undefined;
    if (form.camera && form.dataIngresso) {
      const room = mockRooms.find((r) => r.id === form.camera);
      newContratto = {
        id: `c-${Date.now()}`,
        richiesta_id: "",
        student_nome: `${form.nome.trim()} ${form.cognome.trim()}`,
        camera_nome: room?.name ?? form.camera,
        data_inizio: form.dataIngresso,
        data_fine: form.dataFine || "2026-07-31",
        canone_mensile: parseFloat(form.canone) || room?.price || 480,
        stato: "attivo",
        data_firma: new Date().toISOString().slice(0, 10),
        documento_url: "#",
      };
    }

    onAdd(newProfile, newContratto);

    if (form.sendEmail) {
      toast.success(`📧 Email di benvenuto inviata a ${form.email}`);
    }
    toast.success(`✅ ${form.nome} ${form.cognome} aggiunto come studente attivo`);
    setForm(empty);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" /> Crea Nuovo Studente
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Nome *</Label>
              <Input value={form.nome} onChange={(e) => set("nome", e.target.value)} placeholder="Marco" />
            </div>
            <div className="space-y-1.5">
              <Label>Cognome *</Label>
              <Input value={form.cognome} onChange={(e) => set("cognome", e.target.value)} placeholder="Rossi" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Email *</Label>
              <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="marco@unipd.it" />
            </div>
            <div className="space-y-1.5">
              <Label>Telefono</Label>
              <Input value={form.telefono} onChange={(e) => set("telefono", e.target.value)} placeholder="+39 333 0000000" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Corso *</Label>
              <Input value={form.corso} onChange={(e) => set("corso", e.target.value)} placeholder="Ingegneria Informatica" />
            </div>
            <div className="space-y-1.5">
              <Label>Anno di corso</Label>
              <Select value={form.anno} onValueChange={(v) => set("anno", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n}° anno</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Camera</Label>
              <Select value={form.camera} onValueChange={(v) => set("camera", v)}>
                <SelectTrigger><SelectValue placeholder="Nessuna assegnazione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nessuna assegnazione</SelectItem>
                  {mockRooms.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Canone mensile (€)</Label>
              <Input
                type="number"
                value={form.canone}
                onChange={(e) => set("canone", e.target.value)}
                placeholder="480"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Data ingresso</Label>
              <Input type="date" value={form.dataIngresso} onChange={(e) => set("dataIngresso", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Data fine contratto</Label>
              <Input type="date" value={form.dataFine} onChange={(e) => set("dataFine", e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Note interne</Label>
            <Textarea
              value={form.noteInterne}
              onChange={(e) => set("noteInterne", e.target.value)}
              placeholder="Note interne sullo studente..."
              rows={2}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="sendEmailNuovo"
              checked={Boolean(form.sendEmail)}
              onCheckedChange={(v) => set("sendEmail", Boolean(v))}
            />
            <Label htmlFor="sendEmailNuovo" className="text-sm cursor-pointer">
              Invia email di benvenuto allo studente
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annulla</Button>
          <Button onClick={handleSubmit}>
            <UserPlus className="h-4 w-4 mr-1.5" /> Crea Studente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────
//  KPI Card
// ─────────────────────────────────────────────────────────────
function KpiCard({
  icon: Icon,
  label,
  value,
  tone,
  formatFn,
}: {
  icon: typeof Users;
  label: string;
  value: number;
  tone: "primary" | "success" | "muted" | "warning";
  formatFn?: (n: number) => string;
}) {
  const toneClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-green-100 text-green-700",
    muted: "bg-muted text-muted-foreground",
    warning: "bg-orange-100 text-orange-700",
  }[tone];
  return (
    <Card className="p-4 flex items-center gap-3">
      <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${toneClasses}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold leading-none">{formatFn ? formatFn(value) : value}</p>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
//  Grid Card
// ─────────────────────────────────────────────────────────────
function StudentGridCard({
  data,
  fatture,
  onOpen,
}: {
  data: EnrichedStudent;
  fatture: Fattura[];
  onOpen: () => void;
}) {
  const { profile: s, room, openTickets, overdue, contratto, lastFattura } = data;
  const isEx = s.student_stato === "ex_studente";

  return (
    <Card
      onClick={onOpen}
      className={`p-4 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all group ${isEx ? "opacity-60" : ""}`}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={s.avatar} alt={s.nome} />
          <AvatarFallback>
            {s.nome[0]}
            {s.cognome[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate group-hover:text-primary transition-colors">
            {s.nome} {s.cognome}
          </p>
          <p className="text-xs text-muted-foreground truncate">{s.corso}</p>
          <p className="text-xs text-muted-foreground">{s.anno}° anno</p>
        </div>
        <div className="flex flex-col gap-1 items-end">
          {s.student_stato && <StudenteStatoBadge stato={s.student_stato} small />}
          {contratto ? (
            <ContrattoStatoBadge stato={contratto.stato} />
          ) : (
            !isEx && <Badge variant="outline" className="text-xs">Nessun contratto</Badge>
          )}
        </div>
      </div>

      <div className="mt-3 space-y-1.5 text-xs">
        {room && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <BedDouble className="h-3.5 w-3.5" />
            <span className="truncate">
              {room.name} · Piano {room.floor}
            </span>
          </div>
        )}
        {contratto && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Euro className="h-3.5 w-3.5" />
            <span>{formatEUR(contratto.canone_mensile)}/mese</span>
          </div>
        )}
        {lastFattura && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Receipt className="h-3.5 w-3.5" />
            <span>{lastFattura.mese}</span>
            <FatturaStatoBadge stato={lastFattura.stato} small />
          </div>
        )}
        {isEx && s.data_uscita && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <LogOut className="h-3.5 w-3.5" />
            <span>Uscito: {formatDate(s.data_uscita)}</span>
          </div>
        )}
      </div>

      {(openTickets.length > 0 || overdue) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {openTickets.length > 0 && (
            <Badge variant="outline" className="text-xs gap-1">
              <Headphones className="h-3 w-3" />
              {openTickets.length} ticket
            </Badge>
          )}
          {overdue && (
            <Badge variant="outline" className="text-xs gap-1 text-orange-700 border-orange-300">
              <AlertCircle className="h-3 w-3" />
              Fattura in ritardo
            </Badge>
          )}
        </div>
      )}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
//  List Row
// ─────────────────────────────────────────────────────────────
function StudentListRow({ data, onOpen }: { data: EnrichedStudent; onOpen: () => void }) {
  const { profile: s, room, openTickets, overdue, contratto } = data;
  const isEx = s.student_stato === "ex_studente";
  return (
    <div
      onClick={onOpen}
      className={`flex items-center gap-4 p-4 hover:bg-muted/30 cursor-pointer transition-colors ${isEx ? "opacity-60" : ""}`}
    >
      <Avatar>
        <AvatarImage src={s.avatar} alt={s.nome} />
        <AvatarFallback>
          {s.nome[0]}
          {s.cognome[0]}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">
          {s.nome} {s.cognome}
        </p>
        <p className="text-xs text-muted-foreground truncate">{s.email}</p>
      </div>
      <p className="text-sm text-muted-foreground hidden md:block truncate max-w-[180px]">
        {s.corso}
      </p>
      {s.student_stato && <StudenteStatoBadge stato={s.student_stato} small />}
      {contratto && (
        <span className="hidden sm:block text-xs text-muted-foreground">
          {formatEUR(contratto.canone_mensile)}/mese
        </span>
      )}
      {room && (
        <span className="text-xs text-muted-foreground hidden lg:flex items-center gap-1">
          <BedDouble className="h-3 w-3" />
          {room.name}
        </span>
      )}
      {contratto && <ContrattoStatoBadge stato={contratto.stato} />}
      {openTickets.length > 0 && (
        <Badge variant="outline" className="gap-1 text-xs">
          <Headphones className="h-3 w-3" />
          {openTickets.length}
        </Badge>
      )}
      {overdue && (
        <Badge variant="outline" className="text-xs text-orange-700 border-orange-300">
          <AlertCircle className="h-3 w-3" />
        </Badge>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Detail panel (inside Dialog)
// ─────────────────────────────────────────────────────────────
function StudentDetail({
  data,
  fatture,
  onUpdateFattura,
  onAddFattura,
  onUpdateProfile,
}: {
  data: EnrichedStudent;
  fatture: Fattura[];
  onUpdateFattura: (id: string, patch: Partial<Fattura>) => void;
  onAddFattura: (f: Fattura) => void;
  onUpdateProfile: (id: string, patch: Partial<Profile>) => void;
}) {
  const { profile: s, richiesta, tickets, room, contratto } = data;

  return (
    <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-4 px-6 py-4 border-b shrink-0">
        <Avatar className="h-14 w-14">
          <AvatarImage src={s.avatar} />
          <AvatarFallback className="text-lg">
            {s.nome[0]}
            {s.cognome[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-heading font-bold text-xl">
              {s.nome} {s.cognome}
            </h2>
            {s.student_stato && <StudenteStatoBadge stato={s.student_stato} />}
            {contratto ? (
              <ContrattoStatoBadge stato={contratto.stato} />
            ) : (
              <Badge variant="outline">Nessun contratto</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {s.corso} · {s.anno}° anno
          </p>
          <div className="flex items-center gap-3 mt-1 flex-wrap text-xs">
            <a
              href={`mailto:${s.email}`}
              className="flex items-center gap-1 text-primary hover:underline"
            >
              <Mail className="h-3 w-3" /> {s.email}
            </a>
            {(s.telefono || richiesta?.telefono) && (
              <a
                href={`tel:${s.telefono ?? richiesta?.telefono}`}
                className="flex items-center gap-1 text-primary hover:underline"
              >
                <Phone className="h-3 w-3" /> {s.telefono ?? richiesta?.telefono}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profilo" className="flex-1 min-h-0 flex flex-col">
        <TabsList className="mx-3 mt-3 flex overflow-x-auto shrink-0 h-9 gap-0.5 w-auto">
          <TabsTrigger value="profilo">Profilo</TabsTrigger>
          <TabsTrigger value="contratto">Contratto</TabsTrigger>
          <TabsTrigger value="fatture">
            Fatture{fatture.length > 0 && ` (${fatture.length})`}
          </TabsTrigger>
          <TabsTrigger value="storico">Storico</TabsTrigger>
          <TabsTrigger value="gestione">Gestione</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 px-6 pb-4">
          {/* ── Profilo ── */}
          <TabsContent value="profilo" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <InfoRow label="Nome" value={`${s.nome} ${s.cognome}`} />
              <InfoRow label="Email" value={s.email} />
              <InfoRow label="Telefono" value={s.telefono ?? richiesta?.telefono ?? "—"} />
              <InfoRow label="Corso" value={s.corso} />
              <InfoRow label="Anno" value={`${s.anno}°`} />
              <InfoRow label="Camera" value={room?.name || "—"} icon={BedDouble} />
              <InfoRow
                label="Provenienza"
                value={richiesta?.citta_provenienza || "—"}
                icon={MapPin}
              />
              {s.data_ingresso && (
                <InfoRow label="Data ingresso" value={formatDate(s.data_ingresso)} icon={Calendar} />
              )}
              {s.instagram && (
                <InfoRow label="Instagram" value={s.instagram} icon={Instagram} />
              )}
            </div>
            {s.bio && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Bio</p>
                <p className="text-sm">{s.bio}</p>
              </div>
            )}
            {s.interessi.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Interessi</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.interessi.map((i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {i}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.info(`Email aperta per ${s.email}`)}
              >
                <Mail className="h-3.5 w-3.5 mr-1.5" /> Invia Email
              </Button>
              {(s.telefono || richiesta?.telefono) && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.info(`Chiamata a ${s.telefono ?? richiesta?.telefono}`)}
                >
                  <Phone className="h-3.5 w-3.5 mr-1.5" /> Chiama
                </Button>
              )}
            </div>
          </TabsContent>

          {/* ── Contratto ── */}
          <TabsContent value="contratto" className="space-y-4 mt-4">
            {contratto ? (
              <>
                <Card className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <BedDouble className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{contratto.camera_nome}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(contratto.data_inizio)} → {formatDate(contratto.data_fine)}
                      </p>
                    </div>
                    <ContrattoStatoBadge stato={contratto.stato} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm border-t pt-3">
                    <InfoRow label="Canone mensile" value={formatEUR(contratto.canone_mensile)} />
                    <InfoRow label="Data firma" value={formatDate(contratto.data_firma)} />
                  </div>
                </Card>

                {/* Riepilogo finanziario */}
                <Card className="p-4">
                  <p className="text-xs font-semibold uppercase text-muted-foreground mb-3">
                    Riepilogo finanziario
                  </p>
                  {(() => {
                    const mesiTotali = (() => {
                      const start = new Date(contratto.data_inizio);
                      const end = new Date(contratto.data_fine);
                      return Math.max(1, (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()));
                    })();
                    const totale = contratto.canone_mensile * mesiTotali;
                    const incassato = fatture
                      .filter((f) => f.stato === "pagata")
                      .reduce((sum, f) => sum + f.importo, 0);
                    const residuo = totale - incassato;
                    return (
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                          <p className="text-lg font-bold">{formatEUR(totale)}</p>
                          <p className="text-xs text-muted-foreground">Totale contratto</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-green-700">{formatEUR(incassato)}</p>
                          <p className="text-xs text-muted-foreground">Incassato</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-orange-700">{formatEUR(residuo)}</p>
                          <p className="text-xs text-muted-foreground">Residuo</p>
                        </div>
                      </div>
                    );
                  })()}
                </Card>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.info("Rinnovo contratto avviato")}
                  >
                    <Calendar className="h-3.5 w-3.5 mr-1.5" /> Rinnova
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.info("Download PDF contratto")}
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" /> Scarica PDF
                  </Button>
                </div>
              </>
            ) : (
              <Card className="p-8 text-center">
                <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="font-medium text-sm">Nessun contratto attivo</p>
                <Button asChild size="sm" variant="outline" className="mt-3">
                  <Link to="/admin/camere">Assegna camera</Link>
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* ── Fatture ── */}
          <TabsContent value="fatture" className="space-y-4 mt-4">
            <NuovaFatturaDialog
              studentProfile={s}
              contratto={contratto}
              onAdd={onAddFattura}
            />

            {fatture.length === 0 ? (
              <Card className="p-8 text-center">
                <Receipt className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Nessuna fattura</p>
              </Card>
            ) : (
              <div className="space-y-2">
                {[...fatture]
                  .sort((a, b) => b.data_emissione.localeCompare(a.data_emissione))
                  .map((f) => (
                    <FatturaRow
                      key={f.id}
                      fattura={f}
                      studentEmail={s.email}
                      onUpdate={(patch) => onUpdateFattura(f.id, patch)}
                    />
                  ))}
              </div>
            )}
          </TabsContent>

          {/* ── Storico ── */}
          <TabsContent value="storico" className="mt-4">
            <StudentTimeline data={data} fatture={fatture} />
          </TabsContent>

          {/* ── Gestione ── */}
          <TabsContent value="gestione" className="space-y-4 mt-4">
            <GestioneTab
              profile={s}
              onUpdateProfile={onUpdateProfile}
            />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Gestione Tab
// ─────────────────────────────────────────────────────────────
function GestioneTab({
  profile,
  onUpdateProfile,
}: {
  profile: Profile;
  onUpdateProfile: (id: string, patch: Partial<Profile>) => void;
}) {
  const [showInUscitaForm, setShowInUscitaForm] = useState(false);
  const [showArchiviaForm, setShowArchiviaForm] = useState(false);

  const [inUscitaForm, setInUscitaForm] = useState({
    dataUscita: "",
    motivo: "" as MotivoUscita | "",
    note: "",
  });

  const [archiviaForm, setArchiviaForm] = useState({
    dataUscita: new Date().toISOString().slice(0, 10),
    motivo: "" as MotivoUscita | "",
    note: "",
    valutazione: 0,
  });

  const [noteInterne, setNoteInterne] = useState(profile.note_interne ?? "");

  const handleSegnInUscita = () => {
    onUpdateProfile(profile.id, {
      student_stato: "in_uscita",
      data_uscita: inUscitaForm.dataUscita || undefined,
      motivo_uscita: (inUscitaForm.motivo as MotivoUscita) || undefined,
      note_interne: inUscitaForm.note || profile.note_interne,
    });
    toast.success("Studente segnato come in uscita");
    setShowInUscitaForm(false);
  };

  const handleArchivia = () => {
    onUpdateProfile(profile.id, {
      student_stato: "ex_studente",
      data_uscita: archiviaForm.dataUscita,
      motivo_uscita: (archiviaForm.motivo as MotivoUscita) || undefined,
      note_interne: archiviaForm.note || profile.note_interne,
      camera_id: undefined,
    });
    toast.success("Studente archiviato correttamente");
    setShowArchiviaForm(false);
  };

  const handleRiattiva = () => {
    onUpdateProfile(profile.id, {
      student_stato: "attivo",
      data_uscita: undefined,
      motivo_uscita: undefined,
    });
    toast.success("Studente riattivato — assegna una camera");
  };

  const handleSalvaNoteInterne = () => {
    onUpdateProfile(profile.id, { note_interne: noteInterne });
    toast.success("Note interne salvate");
  };

  return (
    <div className="space-y-4">
      {/* Stato corrente */}
      <Card className="p-4 space-y-3">
        <p className="text-xs font-semibold uppercase text-muted-foreground">Stato Studente</p>
        <div className="flex items-center gap-2">
          <span className="text-sm">Stato attuale:</span>
          <StudenteStatoBadge stato={profile.student_stato} />
        </div>

        {profile.data_ingresso && (
          <p className="text-xs text-muted-foreground">
            Data ingresso: {formatDate(profile.data_ingresso)}
          </p>
        )}
        {profile.data_uscita && (
          <p className="text-xs text-muted-foreground">
            Data uscita: {formatDate(profile.data_uscita)}
            {profile.motivo_uscita && (
              <span> · {MOTIVO_USCITA_OPTIONS.find((o) => o.value === profile.motivo_uscita)?.label ?? profile.motivo_uscita}</span>
            )}
          </p>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          {/* Segna In Uscita */}
          {profile.student_stato === "attivo" && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-orange-700 border-orange-300 hover:bg-orange-50"
              onClick={() => setShowInUscitaForm((v) => !v)}
            >
              <LogOut className="h-3.5 w-3.5" /> Segna In Uscita
            </Button>
          )}

          {/* Archivia */}
          {(profile.student_stato === "attivo" || profile.student_stato === "in_uscita") && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-gray-600 border-gray-300 hover:bg-gray-50"
              onClick={() => setShowArchiviaForm((v) => !v)}
            >
              <XCircle className="h-3.5 w-3.5" /> Archivia come Ex Studente
            </Button>
          )}

          {/* Riattiva */}
          {profile.student_stato === "ex_studente" && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-green-700 border-green-300 hover:bg-green-50"
              onClick={handleRiattiva}
            >
              <RotateCcw className="h-3.5 w-3.5" /> Riattiva
            </Button>
          )}
        </div>

        {/* Form In Uscita */}
        {showInUscitaForm && (
          <Card className="p-3 space-y-3 bg-orange-50 border-orange-200">
            <p className="text-xs font-semibold text-orange-700">Segna In Uscita</p>
            <div className="space-y-1.5">
              <Label className="text-xs">Data prevista uscita</Label>
              <Input
                type="date"
                value={inUscitaForm.dataUscita}
                onChange={(e) => setInUscitaForm((p) => ({ ...p, dataUscita: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Motivo</Label>
              <Select
                value={inUscitaForm.motivo}
                onValueChange={(v) => setInUscitaForm((p) => ({ ...p, motivo: v as MotivoUscita }))}
              >
                <SelectTrigger><SelectValue placeholder="Seleziona motivo" /></SelectTrigger>
                <SelectContent>
                  {MOTIVO_USCITA_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Note</Label>
              <Textarea
                rows={2}
                value={inUscitaForm.note}
                onChange={(e) => setInUscitaForm((p) => ({ ...p, note: e.target.value }))}
                placeholder="Note aggiuntive..."
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSegnInUscita} className="bg-orange-600 hover:bg-orange-700 text-white">
                Conferma
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowInUscitaForm(false)}>
                Annulla
              </Button>
            </div>
          </Card>
        )}

        {/* Form Archivia */}
        {showArchiviaForm && (
          <ArchiviaDialog
            form={archiviaForm}
            onChange={(patch) => setArchiviaForm((p) => ({ ...p, ...patch }))}
            onConfirm={handleArchivia}
            onCancel={() => setShowArchiviaForm(false)}
          />
        )}
      </Card>

      {/* Note Interne */}
      <Card className="p-4 space-y-3">
        <p className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
          <NotebookPen className="h-3.5 w-3.5" /> Note Interne
        </p>
        <Textarea
          rows={4}
          value={noteInterne}
          onChange={(e) => setNoteInterne(e.target.value)}
          placeholder="Note riservate sullo studente (non visibili allo studente)..."
        />
        <Button size="sm" onClick={handleSalvaNoteInterne} className="gap-1.5">
          <Save className="h-3.5 w-3.5" /> Salva Note
        </Button>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Archivia sub-form
// ─────────────────────────────────────────────────────────────
function ArchiviaDialog({
  form,
  onChange,
  onConfirm,
  onCancel,
}: {
  form: { dataUscita: string; motivo: MotivoUscita | ""; note: string; valutazione: number };
  onChange: (patch: Partial<typeof form>) => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Card className="p-3 space-y-3 bg-gray-50 border-gray-200">
      <p className="text-xs font-semibold text-gray-700">Archivia come Ex Studente</p>
      <div className="space-y-1.5">
        <Label className="text-xs">Data uscita</Label>
        <Input
          type="date"
          value={form.dataUscita}
          onChange={(e) => onChange({ dataUscita: e.target.value })}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Motivo uscita</Label>
        <Select
          value={form.motivo}
          onValueChange={(v) => onChange({ motivo: v as MotivoUscita })}
        >
          <SelectTrigger><SelectValue placeholder="Seleziona motivo" /></SelectTrigger>
          <SelectContent>
            {MOTIVO_USCITA_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Note finali</Label>
        <Textarea
          rows={2}
          value={form.note}
          onChange={(e) => onChange({ note: e.target.value })}
          placeholder="Note finali sullo studente..."
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Valutazione studente</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => onChange({ valutazione: n })}
              className="focus:outline-none"
            >
              <Star
                className={`h-5 w-5 ${n <= form.valutazione ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={onConfirm} className="bg-gray-700 hover:bg-gray-800 text-white">
          Archivia
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          Annulla
        </Button>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
//  Nuova Fattura Dialog
// ─────────────────────────────────────────────────────────────
function NuovaFatturaDialog({
  studentProfile,
  contratto,
  onAdd,
}: {
  studentProfile: Profile;
  contratto: (typeof mockContratti)[number] | undefined;
  onAdd: (f: Fattura) => void;
}) {
  const [open, setOpen] = useState(false);
  const [mese, setMese] = useState("");
  const [importo, setImporto] = useState(String(contratto?.canone_mensile ?? "480"));
  const [scadenza, setScadenza] = useState("");
  const [pdfNome, setPdfNome] = useState<string | undefined>(undefined);
  const [pdfData, setPdfData] = useState<string | undefined>(undefined);
  const [note, setNote] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!mese) {
      toast.error("Seleziona il mese");
      return;
    }
    const imp = parseFloat(importo) || 0;
    const nuova: Fattura = {
      id: `f-${Date.now()}`,
      contratto_id: contratto?.id ?? "c-unknown",
      student_id: studentProfile.id,
      student_nome: `${studentProfile.nome} ${studentProfile.cognome}`,
      mese,
      importo: imp,
      data_emissione: new Date().toISOString().slice(0, 10),
      data_scadenza: scadenza || new Date().toISOString().slice(0, 10),
      stato: "inviata",
      pdf_nome: pdfNome,
      pdf_data: pdfData,
      note: note || undefined,
      email_inviata: sendEmail,
      solleciti: [],
    };
    onAdd(nuova);
    if (sendEmail) {
      toast.success(`Email inviata a ${studentProfile.email}: "Fattura ${mese} - ${formatEUR(imp)}"`);
    }
    toast.success("Fattura caricata con successo");
    setOpen(false);
    setMese("");
    setImporto(String(contratto?.canone_mensile ?? "480"));
    setScadenza("");
    setPdfNome(undefined);
    setPdfData(undefined);
    setNote("");
    setSendEmail(true);
  };

  return (
    <>
      <Button className="w-full gap-2" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> Carica Nuova Fattura
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nuova Fattura</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Mese</Label>
              <Select value={mese} onValueChange={setMese}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona mese" />
                </SelectTrigger>
                <SelectContent>
                  {MESI_2026.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Importo (€)</Label>
              <Input
                type="number"
                value={importo}
                onChange={(e) => setImporto(e.target.value)}
                placeholder="480"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Data scadenza</Label>
              <Input
                type="date"
                value={scadenza}
                onChange={(e) => setScadenza(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Carica PDF</Label>
              <div
                className="border-2 border-dashed rounded-lg p-3 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                {pdfNome ? (
                  <p className="text-sm font-medium text-primary">{pdfNome}</p>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-muted-foreground">
                    <Upload className="h-5 w-5" />
                    <p className="text-xs">Clicca per selezionare un PDF</p>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    if (f.size > 5 * 1024 * 1024) {
                      toast.error("File troppo grande (max 5 MB)");
                      return;
                    }
                    setPdfNome(f.name);
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      if (ev.target?.result) setPdfData(String(ev.target.result));
                    };
                    reader.readAsDataURL(f);
                  }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Note (opzionale)</Label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Aggiungi note..."
                rows={2}
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="sendEmail"
                checked={sendEmail}
                onCheckedChange={(v) => setSendEmail(Boolean(v))}
              />
              <Label htmlFor="sendEmail" className="text-sm cursor-pointer">
                Invia email di notifica allo studente
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annulla
            </Button>
            <Button onClick={handleSubmit}>
              <Upload className="h-4 w-4 mr-1.5" /> Carica Fattura
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
//  Fattura Row (inside detail)
// ─────────────────────────────────────────────────────────────
function FatturaRow({
  fattura,
  studentEmail,
  onUpdate,
}: {
  fattura: Fattura;
  studentEmail: string;
  onUpdate: (patch: Partial<Fattura>) => void;
}) {
  const [sollecPopover, setSollecPopover] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(0);

  const handleSegnaPagata = () => {
    onUpdate({
      stato: "pagata",
      data_pagamento: new Date().toISOString().slice(0, 10),
    });
    toast.success(`Pagamento di ${formatEUR(fattura.importo)} registrato per ${fattura.mese}`);
  };

  const handleInviaSollecito = () => {
    const template = SOLLECITO_TEMPLATES[selectedTemplate];
    const nuovoSollecito: SollecitoPagamento = {
      id: `sol-${Date.now()}`,
      numero: fattura.solleciti.length + 1,
      data_invio: new Date().toISOString().slice(0, 10),
      tipo: "manuale",
      oggetto: template.oggetto,
    };
    onUpdate({ solleciti: [...fattura.solleciti, nuovoSollecito] });
    toast.success(
      `Sollecito #${nuovoSollecito.numero} inviato a ${studentEmail}: "${template.oggetto}"`,
    );
    setSollecPopover(false);
  };

  return (
    <Card className="p-3">
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{fattura.mese}</span>
            {fattura.pdf_nome && !fattura.pdf_data && (
              <Badge variant="outline" className="text-[10px] gap-1">
                <FileText className="h-2.5 w-2.5" /> PDF
              </Badge>
            )}
            {fattura.pdf_data && fattura.pdf_nome && (
              <a
                href={fattura.pdf_data}
                download={fattura.pdf_nome}
                onClick={(e) => e.stopPropagation()}
              >
                <Badge
                  variant="outline"
                  className="text-[10px] gap-1 cursor-pointer hover:bg-primary/10 transition-colors"
                >
                  <Download className="h-2.5 w-2.5" /> Scarica PDF
                </Badge>
              </a>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Emessa: {formatDate(fattura.data_emissione)} · Scade: {formatDate(fattura.data_scadenza)}
          </p>
          {fattura.solleciti.length > 0 && (
            <p className="text-xs text-orange-600">
              {fattura.solleciti.length} sollecit{fattura.solleciti.length === 1 ? "o" : "i"} inviato{fattura.solleciti.length > 1 ? "i" : ""}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold">{formatEUR(fattura.importo)}</span>
          <FatturaStatoBadge stato={fattura.stato} />
        </div>
      </div>

      {fattura.stato !== "pagata" && (
        <div className="flex items-center gap-2 mt-2 pt-2 border-t flex-wrap">
          <Button
            size="sm"
            variant="default"
            className="h-7 text-xs gap-1 bg-green-600 hover:bg-green-700"
            onClick={handleSegnaPagata}
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Segna Pagata
          </Button>

          <Popover open={sollecPopover} onOpenChange={setSollecPopover}>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                <Send className="h-3.5 w-3.5" /> Invia Sollecito
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-3">
                <p className="text-sm font-semibold">Seleziona template sollecito</p>
                <div className="space-y-1.5">
                  {SOLLECITO_TEMPLATES.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedTemplate(i)}
                      className={`w-full text-left p-2 rounded text-xs transition-colors ${
                        selectedTemplate === i
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <span className="font-medium">#{t.numero}</span> — {t.oggetto}
                    </button>
                  ))}
                </div>
                <div className="border rounded p-2 text-xs text-muted-foreground bg-muted/40">
                  {SOLLECITO_TEMPLATES[selectedTemplate].testo}
                </div>
                <Button size="sm" className="w-full gap-1.5" onClick={handleInviaSollecito}>
                  <MailOpen className="h-3.5 w-3.5" /> Invia Email
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
//  Timeline
// ─────────────────────────────────────────────────────────────
type TimelineEvent = {
  id: string;
  date: string;
  type: "payment" | "ticket" | "room" | "crm" | "profile" | "fattura" | "sollecito";
  title: string;
  description?: string;
  badge?: { label: string; tone: "success" | "warning" | "danger" | "muted" | "info" };
};

function buildTimeline(data: EnrichedStudent, fatture: Fattura[]): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  const { profile: s, richiesta, tickets, room } = data;

  const profileDate = (s as { created_at?: string }).created_at || richiesta?.created_at;
  if (profileDate) {
    events.push({
      id: `profile-${s.id}`,
      date: profileDate,
      type: "profile",
      title: "Profilo creato",
      description: `${s.nome} ${s.cognome} registrato sulla piattaforma`,
    });
  }

  if (richiesta) {
    events.push({
      id: `crm-${richiesta.id}`,
      date: richiesta.created_at,
      type: "crm",
      title: "Richiesta inviata",
      description: `Fonte: ${richiesta.fonte || "—"}`,
    });
    if (richiesta.stato === "approvata" && room) {
      events.push({
        id: `room-${richiesta.id}`,
        date: richiesta.data_inizio || richiesta.created_at,
        type: "room",
        title: `Assegnata camera ${room.name}`,
        description: `Piano ${room.floor} · ${formatDate(richiesta.data_inizio)} → ${formatDate(richiesta.data_fine)}`,
        badge: { label: "Attivo", tone: "success" },
      });
    }
  }

  tickets.forEach((t) => {
    events.push({
      id: `tk-${t.id}`,
      date: t.created_at,
      type: "ticket",
      title: `Ticket: ${t.titolo}`,
      description: t.descrizione,
      badge: { label: t.categoria, tone: "info" },
    });
  });

  fatture.forEach((f) => {
    events.push({
      id: `fat-${f.id}`,
      date: f.data_emissione,
      type: "fattura",
      title: `Fattura ${f.mese} inviata`,
      description: `${formatEUR(f.importo)} · Scadenza: ${formatDate(f.data_scadenza)}`,
      badge: {
        label: f.stato === "pagata" ? "Pagata" : f.stato === "inviata" ? "Inviata" : f.stato === "scaduta" ? "Scaduta" : "In ritardo",
        tone: f.stato === "pagata" ? "success" : f.stato === "inviata" ? "info" : "danger",
      },
    });
    if (f.data_pagamento) {
      events.push({
        id: `pay-${f.id}`,
        date: f.data_pagamento,
        type: "payment",
        title: `Pagamento ricevuto — ${f.mese}`,
        description: `${formatEUR(f.importo)} · ${f.metodo_pagamento || "—"}`,
        badge: { label: "Pagato", tone: "success" },
      });
    }
    f.solleciti.forEach((sol) => {
      events.push({
        id: `sol-${sol.id}`,
        date: sol.data_invio,
        type: "sollecito",
        title: `Sollecito #${sol.numero} inviato`,
        description: sol.oggetto,
        badge: { label: sol.tipo, tone: "warning" },
      });
    });
  });

  return events.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

const TYPE_META: Record<
  TimelineEvent["type"],
  { icon: typeof Users; color: string; bg: string }
> = {
  payment: { icon: CreditCard, color: "text-blue-700", bg: "bg-blue-100" },
  ticket: { icon: Headphones, color: "text-orange-700", bg: "bg-orange-100" },
  room: { icon: BedDouble, color: "text-purple-700", bg: "bg-purple-100" },
  crm: { icon: Sparkles, color: "text-green-700", bg: "bg-green-100" },
  profile: { icon: UserPlus, color: "text-muted-foreground", bg: "bg-muted" },
  fattura: { icon: Receipt, color: "text-blue-700", bg: "bg-blue-100" },
  sollecito: { icon: Send, color: "text-orange-700", bg: "bg-orange-100" },
};

function StudentTimeline({ data, fatture }: { data: EnrichedStudent; fatture: Fattura[] }) {
  const events = useMemo(() => buildTimeline(data, fatture), [data, fatture]);

  if (events.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Nessuna attività registrata</p>
      </Card>
    );
  }

  return (
    <div className="relative pl-6 space-y-3 pb-4">
      <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />
      {events.map((ev) => {
        const meta = TYPE_META[ev.type];
        const Icon = meta.icon;
        return (
          <div key={ev.id} className="relative">
            <div
              className={`absolute -left-6 top-2 h-6 w-6 rounded-full flex items-center justify-center ring-4 ring-background ${meta.bg}`}
            >
              <Icon className={`h-3 w-3 ${meta.color}`} />
            </div>
            <Card className="p-3 bg-muted/30 border-muted">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm">{ev.title}</p>
                  {ev.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{ev.description}</p>
                  )}
                </div>
                {ev.badge && <TimelineBadge {...ev.badge} />}
              </div>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{formatDateTime(ev.date)}</span>
                <span>·</span>
                <span>{relTime(ev.date)}</span>
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Small helpers / badges
// ─────────────────────────────────────────────────────────────
function InfoRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: typeof Users;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium flex items-center gap-1.5 text-sm">
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
        {value}
      </p>
    </div>
  );
}

function ContrattoStatoBadge({ stato }: { stato: string }) {
  const map: Record<string, string> = {
    attivo: "bg-green-100 text-green-700 hover:bg-green-100",
    in_scadenza: "bg-orange-100 text-orange-700 hover:bg-orange-100",
    scaduto: "bg-red-100 text-red-700 hover:bg-red-100",
    disdetto: "bg-muted text-muted-foreground hover:bg-muted",
  };
  const labels: Record<string, string> = {
    attivo: "Attivo",
    in_scadenza: "In Scadenza",
    scaduto: "Scaduto",
    disdetto: "Disdetto",
  };
  return (
    <Badge className={`text-xs shrink-0 ${map[stato] || "bg-muted text-muted-foreground"}`}>
      {labels[stato] || stato}
    </Badge>
  );
}

export function FatturaStatoBadge({
  stato,
  small,
}: {
  stato: FatturaStato;
  small?: boolean;
}) {
  const cls = small ? "text-[10px]" : "text-xs";
  if (stato === "pagata")
    return (
      <Badge className={`bg-green-100 text-green-700 hover:bg-green-100 gap-1 ${cls}`}>
        <CheckCircle2 className="h-3 w-3" /> Pagata
      </Badge>
    );
  if (stato === "inviata")
    return (
      <Badge className={`bg-blue-100 text-blue-700 hover:bg-blue-100 gap-1 ${cls}`}>
        <Mail className="h-3 w-3" /> Inviata
      </Badge>
    );
  if (stato === "scaduta")
    return (
      <Badge className={`bg-red-100 text-red-700 hover:bg-red-100 gap-1 ${cls}`}>
        <AlertTriangle className="h-3 w-3" /> Scaduta
      </Badge>
    );
  return (
    <Badge className={`bg-orange-100 text-orange-700 hover:bg-orange-100 gap-1 ${cls}`}>
      <Clock className="h-3 w-3" /> In Ritardo
    </Badge>
  );
}

function TimelineBadge({
  label,
  tone,
}: {
  label: string;
  tone: "success" | "warning" | "danger" | "muted" | "info";
}) {
  const map = {
    success: "bg-green-100 text-green-700 hover:bg-green-100",
    warning: "bg-orange-100 text-orange-700 hover:bg-orange-100",
    danger: "bg-red-100 text-red-700 hover:bg-red-100",
    info: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    muted: "bg-muted text-muted-foreground hover:bg-muted",
  };
  return <Badge className={`text-[10px] shrink-0 ${map[tone]}`}>{label}</Badge>;
}
