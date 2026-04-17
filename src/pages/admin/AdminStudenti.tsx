import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  mockPagamenti,
  type Profile,
} from "@/data/mockData";
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
} from "lucide-react";
import { toast } from "sonner";

type ViewMode = "grid" | "list";
type FilterMode = "all" | "assigned" | "unassigned";
type SortMode = "name" | "anno" | "recent";

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

const csvEscape = (v: unknown) => {
  const s = v == null ? "" : String(v);
  if (/[",\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

function exportStudentsCSV(
  rows: {
    profile: Profile;
    room?: { name: string; floor: number };
    richiesta?: { telefono?: string };
    payments: { stato: string }[];
    overdue: boolean;
  }[],
) {
  const header = [
    "Nome",
    "Cognome",
    "Email",
    "Corso",
    "Anno",
    "Camera",
    "Piano",
    "Telefono",
    "Stato pagamento",
  ];
  const body = rows.map((r) => {
    const stato =
      r.payments.length === 0
        ? "Nessun pagamento"
        : r.overdue
          ? "In ritardo"
          : "Regolare";
    return [
      r.profile.nome,
      r.profile.cognome,
      r.profile.email,
      r.profile.corso,
      `${r.profile.anno}`,
      r.room?.name || "",
      r.room ? `${r.room.floor}` : "",
      r.richiesta?.telefono || "",
      stato,
    ]
      .map(csvEscape)
      .join(",");
  });
  const csv = "\uFEFF" + [header.join(","), ...body].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const today = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `studenti-${today}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast.success(`Esportati ${rows.length} studenti`);
}

export default function AdminStudenti() {
  const students = useMemo(() => mockProfiles.filter((p) => p.role === "student"), []);

  const [selected, setSelected] = useState<Profile | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [view, setView] = useState<ViewMode>("grid");
  const [sort, setSort] = useState<SortMode>("name");

  // Per-student derivations
  const enriched = useMemo(() => {
    return students.map((s) => {
      const richiesta = mockRichieste.find(
        (r) => r.student_id === s.id && r.stato === "approvata",
      );
      const tickets = mockTickets.filter((t) => t.student_id === s.id);
      const openTickets = tickets.filter((t) => t.stato !== "risolto");
      const room = s.camera_id ? mockRooms.find((r) => r.id === s.camera_id) : undefined;
      // Mock: assume p1 owns these payments; for others, distribute simulated state
      const payments = s.id === "p1" ? mockPagamenti : [];
      const overdue = payments.some((p) => p.stato === "scaduto");
      return { profile: s, richiesta, tickets, openTickets, room, payments, overdue };
    });
  }, [students]);

  // KPI
  const kpis = useMemo(() => {
    const assigned = enriched.filter((e) => !!e.profile.camera_id).length;
    const unassigned = enriched.length - assigned;
    const openTickets = enriched.reduce((acc, e) => acc + e.openTickets.length, 0);
    return { total: enriched.length, assigned, unassigned, openTickets };
  }, [enriched]);

  // Filter + search + sort
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = enriched.filter((e) => {
      if (filter === "assigned" && !e.profile.camera_id) return false;
      if (filter === "unassigned" && e.profile.camera_id) return false;
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
  }, [enriched, filter, search, sort]);

  const selectedData = selected ? enriched.find((e) => e.profile.id === selected.id) : null;

  return (
    <PageTransition className="p-6 space-y-6">
      <FadeIn>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-heading text-2xl font-bold">Studenti</h1>
            <p className="text-sm text-muted-foreground">
              Gestione completa di profili, contratti, pagamenti e ticket
            </p>
          </div>
        </div>
      </FadeIn>

      {/* KPI */}
      <FadeIn delay={0.05}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard icon={Users} label="Totale studenti" value={kpis.total} tone="primary" />
          <KpiCard icon={Home} label="Con camera" value={kpis.assigned} tone="success" />
          <KpiCard
            icon={AlertCircle}
            label="Senza assegnazione"
            value={kpis.unassigned}
            tone="muted"
          />
          <KpiCard
            icon={Headphones}
            label="Ticket aperti"
            value={kpis.openTickets}
            tone="warning"
          />
        </div>
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportStudentsCSV(filtered)}
              className="gap-1.5"
              title="Esporta CSV"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Esporta CSV</span>
            </Button>
          </div>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterMode)}>
            <TabsList>
              <TabsTrigger value="all">Tutti ({kpis.total})</TabsTrigger>
              <TabsTrigger value="assigned">Assegnati ({kpis.assigned})</TabsTrigger>
              <TabsTrigger value="unassigned">Senza camera ({kpis.unassigned})</TabsTrigger>
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
            <p className="text-sm text-muted-foreground">Prova a modificare i filtri o la ricerca</p>
          </Card>
        ) : view === "grid" ? (
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((e) => (
              <StaggerItem key={e.profile.id}>
                <StudentGridCard data={e} onOpen={() => setSelected(e.profile)} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <Card>
            <StaggerContainer className="divide-y">
              {filtered.map((e) => (
                <StaggerItem key={e.profile.id}>
                  <StudentListRow data={e} onOpen={() => setSelected(e.profile)} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </Card>
        )}
      </FadeIn>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="sr-only">Dettaglio studente</DialogTitle>
          </DialogHeader>
          {selectedData && <StudentDetail data={selectedData} />}
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}

/* --------------------------- KPI Card --------------------------- */
function KpiCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Users;
  label: string;
  value: number;
  tone: "primary" | "success" | "muted" | "warning";
}) {
  const toneClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-green-100 text-green-700",
    muted: "bg-muted text-muted-foreground",
    warning: "bg-orange-100 text-orange-700",
  }[tone];
  return (
    <Card className="p-4 flex items-center gap-3">
      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${toneClasses}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
      </div>
    </Card>
  );
}

/* --------------------------- Grid Card --------------------------- */
type Enriched = ReturnType<typeof useEnrichedType>;
// helper so TS keeps inference; not actually called
function useEnrichedType() {
  return [{} as ReturnType<typeof buildEnriched>][0];
}
function buildEnriched() {
  return {
    profile: mockProfiles[0],
    richiesta: mockRichieste[0] as typeof mockRichieste[number] | undefined,
    tickets: [] as typeof mockTickets,
    openTickets: [] as typeof mockTickets,
    room: undefined as ReturnType<typeof mockRooms.find>,
    payments: [] as typeof mockPagamenti,
    overdue: false,
  };
}

function StudentGridCard({ data, onOpen }: { data: Enriched; onOpen: () => void }) {
  const { profile: s, room, openTickets, overdue, richiesta } = data;
  return (
    <Card
      onClick={onOpen}
      className="p-4 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all group"
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
        {s.camera_id ? (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Assegnato</Badge>
        ) : (
          <Badge variant="outline">Libero</Badge>
        )}
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
        {richiesta?.telefono && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-3.5 w-3.5" />
            <span className="truncate">{richiesta.telefono}</span>
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
              In ritardo
            </Badge>
          )}
        </div>
      )}
    </Card>
  );
}

/* --------------------------- List Row --------------------------- */
function StudentListRow({ data, onOpen }: { data: Enriched; onOpen: () => void }) {
  const { profile: s, room, openTickets, overdue } = data;
  return (
    <div
      onClick={onOpen}
      className="flex items-center gap-4 p-4 hover:bg-muted/30 cursor-pointer transition-colors"
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
      <Badge variant="outline" className="hidden sm:inline-flex">
        {s.anno}° anno
      </Badge>
      {room && (
        <span className="text-xs text-muted-foreground hidden lg:flex items-center gap-1">
          <BedDouble className="h-3 w-3" />
          {room.name}
        </span>
      )}
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
      {s.camera_id ? (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Assegnato</Badge>
      ) : (
        <Badge variant="outline">Libero</Badge>
      )}
    </div>
  );
}

/* --------------------------- Detail --------------------------- */
function StudentDetail({ data }: { data: Enriched }) {
  const { profile: s, richiesta, tickets, openTickets, room, payments, overdue } = data;
  const incassato = payments
    .filter((p) => p.stato === "pagato")
    .reduce((sum, p) => sum + p.importo, 0);

  return (
    <div className="flex flex-col min-h-0 flex-1">
      {/* Header */}
      <div className="flex items-start gap-4 pb-4 border-b">
        <Avatar className="h-16 w-16">
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
            {s.camera_id ? (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Assegnato</Badge>
            ) : (
              <Badge variant="outline">Senza camera</Badge>
            )}
            {openTickets.length > 0 && (
              <Badge variant="outline" className="gap-1">
                <Headphones className="h-3 w-3" />
                {openTickets.length} ticket aperti
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {s.corso} · {s.anno}° anno
          </p>
          <div className="flex items-center gap-3 mt-2 flex-wrap text-xs">
            {richiesta?.telefono && (
              <a
                href={`tel:${richiesta.telefono}`}
                className="flex items-center gap-1 text-primary hover:underline"
              >
                <Phone className="h-3 w-3" /> {richiesta.telefono}
              </a>
            )}
            <a
              href={`mailto:${s.email}`}
              className="flex items-center gap-1 text-primary hover:underline"
            >
              <Mail className="h-3 w-3" /> {s.email}
            </a>
            {s.instagram && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Instagram className="h-3 w-3" /> {s.instagram}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {openTickets.length > 0 ? (
            <Button asChild size="sm" variant="outline">
              <Link to="/admin/supporto">
                <Headphones className="h-3 w-3 mr-1" /> Vai ai ticket
              </Link>
            </Button>
          ) : (
            <Button asChild size="sm" variant="outline">
              <Link to="/admin/supporto">
                <Headphones className="h-3 w-3 mr-1" /> Crea ticket
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="anagrafica" className="flex-1 min-h-0 flex flex-col mt-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="anagrafica">Anagrafica</TabsTrigger>
          <TabsTrigger value="camera">Camera</TabsTrigger>
          <TabsTrigger value="pagamenti">
            Pagamenti{payments.length > 0 && ` (${payments.length})`}
          </TabsTrigger>
          <TabsTrigger value="ticket">
            Ticket{tickets.length > 0 && ` (${tickets.length})`}
          </TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 mt-3 pr-3">
          {/* Anagrafica */}
          <TabsContent value="anagrafica" className="space-y-4 mt-0">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Info label="Corso" value={s.corso} />
              <Info label="Anno" value={`${s.anno}°`} />
              <Info label="Età" value={richiesta?.eta ? `${richiesta.eta} anni` : "—"} />
              <Info
                label="Provenienza"
                value={richiesta?.citta_provenienza || "—"}
                icon={MapPin}
              />
              <Info label="Instagram" value={s.instagram || "—"} />
              <Info label="Fonte" value={richiesta?.fonte || "—"} />
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
          </TabsContent>

          {/* Camera & Contratto */}
          <TabsContent value="camera" className="space-y-4 mt-0">
            {room ? (
              <Card className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <BedDouble className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{room.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Piano {room.floor} · {room.sqm} m² · €{room.price}/mese
                    </p>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/admin/camere">
                      <ExternalLink className="h-3 w-3 mr-1" /> Camera
                    </Link>
                  </Button>
                </div>
                {richiesta && (
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {formatDate(richiesta.data_inizio)} → {formatDate(richiesta.data_fine)}
                      </span>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Attivo
                      </Badge>
                    </div>
                    <Button asChild size="sm" variant="outline" className="w-full">
                      <Link to="/admin/contratti">
                        <FileText className="h-3 w-3 mr-1" /> Vedi contratto
                      </Link>
                    </Button>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="p-8 text-center">
                <BedDouble className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="font-medium text-sm">Nessuna camera assegnata</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Lo studente non ha ancora un contratto attivo
                </p>
                <Button asChild size="sm" variant="outline" className="mt-3">
                  <Link to="/admin/camere">Assegna camera</Link>
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* Pagamenti */}
          <TabsContent value="pagamenti" className="space-y-3 mt-0">
            {payments.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Card className="p-3">
                    <p className="text-xs text-muted-foreground">Totale incassato</p>
                    <p className="font-bold text-lg">€{incassato}</p>
                  </Card>
                  <Card className="p-3">
                    <p className="text-xs text-muted-foreground">Stato</p>
                    <p
                      className={`font-bold text-lg ${overdue ? "text-orange-700" : "text-green-700"}`}
                    >
                      {overdue ? "In ritardo" : "Regolare"}
                    </p>
                  </Card>
                </div>
                <div className="space-y-1.5">
                  {payments.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-2.5 rounded-md border text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{p.mese}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">€{p.importo}</span>
                        <PaymentBadge stato={p.stato} />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <Card className="p-8 text-center">
                <CreditCard className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Nessun pagamento registrato</p>
              </Card>
            )}
          </TabsContent>

          {/* Ticket */}
          <TabsContent value="ticket" className="space-y-2 mt-0">
            {tickets.length > 0 ? (
              tickets.map((t) => (
                <Link
                  key={t.id}
                  to="/admin/supporto"
                  className="block p-3 rounded-md border hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{t.titolo}</p>
                      <p className="text-xs text-muted-foreground truncate">{t.descrizione}</p>
                    </div>
                    <TicketStatoBadge stato={t.stato} />
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-[10px]">
                      {t.categoria}
                    </Badge>
                    <span>·</span>
                    <span>{formatDate(t.created_at)}</span>
                    {t.assignedTo && (
                      <>
                        <span>·</span>
                        <span>{t.assignedTo}</span>
                      </>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <Card className="p-8 text-center">
                <Headphones className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Nessun ticket aperto</p>
              </Card>
            )}
          </TabsContent>

          {/* Timeline */}
          <TabsContent value="timeline" className="mt-0">
            <StudentTimeline data={data} />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}

function Info({
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
      <p className="font-medium flex items-center gap-1.5">
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
        {value}
      </p>
    </div>
  );
}

function PaymentBadge({ stato }: { stato: "pagato" | "in_scadenza" | "scaduto" }) {
  if (stato === "pagato")
    return (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
        <CheckCircle2 className="h-3 w-3" /> Pagato
      </Badge>
    );
  if (stato === "in_scadenza")
    return (
      <Badge variant="outline" className="gap-1 text-orange-700 border-orange-300">
        <Clock className="h-3 w-3" /> In scadenza
      </Badge>
    );
  return (
    <Badge variant="outline" className="gap-1 text-red-700 border-red-300">
      <XCircle className="h-3 w-3" /> Scaduto
    </Badge>
  );
}

function TicketStatoBadge({ stato }: { stato: string }) {
  const map: Record<string, string> = {
    aperto: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    in_corso: "bg-orange-100 text-orange-700 hover:bg-orange-100",
    attesa_studente: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
    risolto: "bg-green-100 text-green-700 hover:bg-green-100",
  };
  return <Badge className={`text-[10px] ${map[stato] || ""}`}>{stato.replace("_", " ")}</Badge>;
}
