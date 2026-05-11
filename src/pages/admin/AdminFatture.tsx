import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  mockFatture,
  mockProfiles,
  FATTURE_KEY,
  type Fattura,
  type FatturaStato,
  type SollecitoPagamento,
} from "@/data/mockData";
import { PageTransition, FadeIn } from "@/components/motion/MotionWrappers";
import {
  Receipt,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  Send,
  MailOpen,
  Eye,
  LayoutList,
  Columns,
  ChevronDown,
  Euro,
} from "lucide-react";
import { toast } from "sonner";
import { formatEUR, downloadCSV, todayStamp } from "@/lib/csv";

type TabFilter = "all" | "pagata" | "attesa" | "scaduta";
type ViewMode = "tabella" | "pipeline";

// ─── Pipeline columns definition ───────────────────────────────────────────
const PIPELINE_COLUMNS: {
  id: FatturaStato | "inviata";
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "inviata",
    label: "Da Pagare",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: <Clock className="h-4 w-4 text-blue-600" />,
  },
  {
    id: "in_ritardo",
    label: "In Ritardo",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
    icon: <AlertTriangle className="h-4 w-4 text-orange-600" />,
  },
  {
    id: "scaduta",
    label: "Scaduta",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
  },
  {
    id: "pagata",
    label: "Pagata",
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    icon: <CheckCircle2 className="h-4 w-4 text-green-600" />,
  },
];

const SOLLECITO_TEMPLATES: { numero: number; oggetto: string; testo: string }[] = [
  { numero: 1, oggetto: "Promemoria gentile - pagamento in attesa", testo: "Gentile studente, ti ricordiamo che la fattura del mese corrente è ancora in attesa di pagamento." },
  { numero: 2, oggetto: "Secondo sollecito - pagamento non ricevuto", testo: "Gentile studente, non abbiamo ancora ricevuto il pagamento della fattura." },
  { numero: 3, oggetto: "Terzo sollecito - pagamento urgente", testo: "Gentile studente, questo è il terzo sollecito. Chiediamo di provvedere entro 7 giorni." },
  { numero: 4, oggetto: "Sollecito urgente - azione richiesta", testo: "Gentile studente, il pagamento risulta scaduto da oltre 21 giorni. È necessario regolarizzare immediatamente." },
  { numero: 5, oggetto: "Ultimatum - pagamento entro 48 ore", testo: "Gentile studente, questo è l'ultimatum: il pagamento deve essere effettuato entro 48 ore." },
  { numero: 6, oggetto: "Avviso legale - procedura di recupero crediti", testo: "In mancanza di pagamento entro 5 giorni, avvieremo la procedura di recupero crediti tramite studio legale." },
];

const formatDate = (iso?: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "2-digit" });
};

function getStudentEmail(studentId: string): string {
  return mockProfiles.find((p) => p.id === studentId)?.email ?? `${studentId}@studentato.it`;
}

// ─────────────────────────────────────────────────────────────
//  Main Page
// ─────────────────────────────────────────────────────────────
export default function AdminFatture() {
  const [fatture, setFatture] = useState<Fattura[]>(() => {
    try {
      const saved = localStorage.getItem(FATTURE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return mockFatture;
  });

  useEffect(() => {
    try { localStorage.setItem(FATTURE_KEY, JSON.stringify(fatture)); } catch {}
  }, [fatture]);

  const [tab, setTab] = useState<TabFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("tabella");

  const kpis = useMemo(() => {
    const pagate = fatture.filter((f) => f.stato === "pagata");
    const attesa = fatture.filter((f) => f.stato === "inviata");
    const scadute = fatture.filter((f) => f.stato === "scaduta" || f.stato === "in_ritardo");
    return {
      totale: fatture.length,
      pagate: { count: pagate.length, sum: pagate.reduce((s, f) => s + f.importo, 0) },
      attesa: { count: attesa.length, sum: attesa.reduce((s, f) => s + f.importo, 0) },
      scadute: { count: scadute.length, sum: scadute.reduce((s, f) => s + f.importo, 0) },
    };
  }, [fatture]);

  const filtered = useMemo(() => {
    if (tab === "all") return fatture;
    if (tab === "pagata") return fatture.filter((f) => f.stato === "pagata");
    if (tab === "attesa") return fatture.filter((f) => f.stato === "inviata");
    if (tab === "scaduta") return fatture.filter((f) => f.stato === "scaduta" || f.stato === "in_ritardo");
    return fatture;
  }, [fatture, tab]);

  const updateFattura = (id: string, patch: Partial<Fattura>) => {
    setFatture((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  };

  const handleExportCSV = () => {
    downloadCSV(`fatture-${todayStamp()}.csv`, [
      "Studente", "Mese", "Importo", "Data emissione", "Data scadenza", "Stato", "Solleciti",
    ], filtered.map((f) => [
      f.student_nome, f.mese, f.importo, f.data_emissione, f.data_scadenza, f.stato, f.solleciti.length,
    ]));
    toast.success(`Esportate ${filtered.length} fatture`);
  };

  return (
    <PageTransition className="p-4 md:p-6 space-y-4 md:space-y-6">
      <FadeIn>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-heading text-2xl font-bold">Fatture & Pagamenti</h1>
            <p className="text-sm text-muted-foreground">
              Gestione centralizzata di fatture, incassi e solleciti
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Toggle vista */}
            <div className="flex items-center rounded-lg border bg-muted p-0.5 gap-0.5">
              <Button
                size="sm"
                variant={viewMode === "tabella" ? "default" : "ghost"}
                className="h-7 px-2.5 gap-1.5 text-xs"
                onClick={() => setViewMode("tabella")}
              >
                <LayoutList className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Tabella</span>
              </Button>
              <Button
                size="sm"
                variant={viewMode === "pipeline" ? "default" : "ghost"}
                className="h-7 px-2.5 gap-1.5 text-xs"
                onClick={() => setViewMode("pipeline")}
              >
                <Columns className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Pipeline</span>
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-1.5">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Esporta CSV</span>
            </Button>
          </div>
        </div>
      </FadeIn>

      {/* KPI */}
      <FadeIn delay={0.05}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{kpis.totale}</p>
              <p className="text-xs text-muted-foreground">Totale Fatture</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 text-green-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{kpis.pagate.count}</p>
              <p className="text-xs text-muted-foreground">Pagate · {formatEUR(kpis.pagate.sum)}</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{kpis.attesa.count}</p>
              <p className="text-xs text-muted-foreground">In Attesa · {formatEUR(kpis.attesa.sum)}</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-700">{kpis.scadute.count}</p>
              <p className="text-xs text-muted-foreground">Scadute · {formatEUR(kpis.scadute.sum)}</p>
            </div>
          </Card>
        </div>
      </FadeIn>

      {/* ── VISTA TABELLA ────────────────────────────────────────── */}
      {viewMode === "tabella" && (
        <FadeIn delay={0.1}>
          <Card>
            <div className="p-4 border-b">
              <Tabs value={tab} onValueChange={(v) => setTab(v as TabFilter)}>
                <TabsList>
                  <TabsTrigger value="all">Tutte ({kpis.totale})</TabsTrigger>
                  <TabsTrigger value="pagata">Pagate ({kpis.pagate.count})</TabsTrigger>
                  <TabsTrigger value="attesa">In Attesa ({kpis.attesa.count})</TabsTrigger>
                  <TabsTrigger value="scaduta">Scadute ({kpis.scadute.count})</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Studente</TableHead>
                    <TableHead className="hidden sm:table-cell">Mese</TableHead>
                    <TableHead>Importo</TableHead>
                    <TableHead className="hidden md:table-cell">Scadenza</TableHead>
                    <TableHead>Stato</TableHead>
                    <TableHead className="hidden sm:table-cell">Solleciti</TableHead>
                    <TableHead className="text-right">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Nessuna fattura in questa categoria
                      </TableCell>
                    </TableRow>
                  )}
                  {filtered.map((f) => (
                    <FatturaTableRow
                      key={f.id}
                      fattura={f}
                      studentEmail={getStudentEmail(f.student_id)}
                      onUpdate={(patch) => updateFattura(f.id, patch)}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </FadeIn>
      )}

      {/* ── VISTA PIPELINE ───────────────────────────────────────── */}
      {viewMode === "pipeline" && (
        <FadeIn delay={0.1}>
          <div className="overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex gap-3 min-w-max md:min-w-0 md:grid md:grid-cols-4">
              {PIPELINE_COLUMNS.map((col) => {
                const colFatture = fatture.filter((f) => f.stato === col.id);
                const colTotal = colFatture.reduce((s, f) => s + f.importo, 0);
                return (
                  <div key={col.id} className="w-64 md:w-auto flex flex-col gap-2">
                    {/* Column header */}
                    <div className={`flex items-center justify-between px-3 py-2 rounded-lg border ${col.bg} ${col.border}`}>
                      <div className="flex items-center gap-2">
                        {col.icon}
                        <span className={`text-sm font-semibold ${col.color}`}>{col.label}</span>
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${col.bg} ${col.color} border ${col.border}`}>
                          {colFatture.length}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Euro className="h-3 w-3" />
                        <span className="font-medium">{formatEUR(colTotal).replace("€", "")}</span>
                      </div>
                    </div>

                    {/* Cards */}
                    <div className="flex flex-col gap-2 min-h-[200px]">
                      {colFatture.length === 0 && (
                        <div className="flex items-center justify-center h-20 rounded-lg border-2 border-dashed border-muted text-xs text-muted-foreground">
                          Nessuna fattura
                        </div>
                      )}
                      {colFatture.map((f) => (
                        <PipelineCard
                          key={f.id}
                          fattura={f}
                          studentEmail={getStudentEmail(f.student_id)}
                          onUpdate={(patch) => updateFattura(f.id, patch)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeIn>
      )}
    </PageTransition>
  );
}

// ─────────────────────────────────────────────────────────────
//  Pipeline Card
// ─────────────────────────────────────────────────────────────
function PipelineCard({
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

  const studentProfile = mockProfiles.find((p) => p.id === fattura.student_id);
  const initials = fattura.student_nome.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const today = new Date();
  const scadenza = fattura.data_scadenza ? new Date(fattura.data_scadenza) : null;
  const daysOverdue = scadenza ? Math.floor((today.getTime() - scadenza.getTime()) / 86400000) : 0;

  const handleSegnaPagata = () => {
    onUpdate({ stato: "pagata", data_pagamento: new Date().toISOString().slice(0, 10) });
    toast.success(`Pagamento ${fattura.mese} — ${fattura.student_nome} registrato`);
  };

  const handleMoveStatus = (nuovoStato: FatturaStato) => {
    onUpdate({ stato: nuovoStato });
    toast.success(`${fattura.student_nome} spostato in "${PIPELINE_COLUMNS.find(c => c.id === nuovoStato)?.label}"`);
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
    toast.success(`Sollecito #${nuovoSollecito.numero} inviato a ${studentEmail}`);
    setSollecPopover(false);
  };

  return (
    <Card className="p-3 space-y-2.5 hover:shadow-md transition-shadow">
      {/* Header studente */}
      <div className="flex items-center gap-2.5">
        <Avatar className="h-8 w-8 shrink-0">
          {studentProfile?.avatar && <img src={studentProfile.avatar} alt={fattura.student_nome} />}
          <AvatarFallback className="text-[10px] font-bold">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{fattura.student_nome}</p>
          <p className="text-xs text-muted-foreground truncate">{fattura.mese}</p>
        </div>
        {fattura.pdf_data && fattura.pdf_nome && (
          <a href={fattura.pdf_data} download={fattura.pdf_nome} onClick={(e) => e.stopPropagation()}>
            <Badge variant="outline" className="text-[10px] gap-1 py-0 cursor-pointer hover:bg-primary/10">
              <Download className="h-2.5 w-2.5" /> PDF
            </Badge>
          </a>
        )}
      </div>

      {/* Importo */}
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold">{formatEUR(fattura.importo)}</span>
        {fattura.stato !== "pagata" && scadenza && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            daysOverdue > 0
              ? "bg-red-100 text-red-700"
              : daysOverdue > -7
              ? "bg-orange-100 text-orange-700"
              : "bg-blue-100 text-blue-700"
          }`}>
            {daysOverdue > 0 ? `+${daysOverdue}gg` : `${Math.abs(daysOverdue)}gg`}
          </span>
        )}
        {fattura.stato === "pagata" && fattura.data_pagamento && (
          <span className="text-xs text-muted-foreground">
            Pag. {formatDate(fattura.data_pagamento)}
          </span>
        )}
      </div>

      {/* Scadenza + solleciti */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Scad. {formatDate(fattura.data_scadenza)}</span>
        {fattura.solleciti.length > 0 && (
          <Badge variant="outline" className="text-[10px] gap-1 text-orange-700 border-orange-300 py-0">
            <Send className="h-2.5 w-2.5" /> {fattura.solleciti.length} sol.
          </Badge>
        )}
      </div>

      {/* Azioni */}
      {fattura.stato !== "pagata" && (
        <div className="flex gap-1.5 pt-1 border-t">
          <Button
            size="sm"
            className="flex-1 h-7 text-xs gap-1 bg-green-600 hover:bg-green-700"
            onClick={handleSegnaPagata}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Pagata
          </Button>

          <Popover open={sollecPopover} onOpenChange={setSollecPopover}>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline" className="h-7 px-2">
                <Send className="h-3.5 w-3.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end" side="top">
              <div className="space-y-3">
                <p className="text-sm font-semibold">Template sollecito</p>
                <div className="space-y-1">
                  {SOLLECITO_TEMPLATES.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedTemplate(i)}
                      className={`w-full text-left p-2 rounded text-xs transition-colors ${
                        selectedTemplate === i ? "bg-primary text-primary-foreground" : "hover:bg-muted"
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

          {/* Sposta colonna */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="h-7 px-2">
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <p className="text-xs text-muted-foreground px-2 py-1">Sposta in</p>
              {PIPELINE_COLUMNS.filter((c) => c.id !== fattura.stato).map((c) => (
                <DropdownMenuItem
                  key={c.id}
                  className="text-xs gap-2"
                  onClick={() => handleMoveStatus(c.id as FatturaStato)}
                >
                  {c.icon} {c.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {fattura.stato === "pagata" && (
        <div className="pt-1 border-t">
          <Button
            size="sm"
            variant="ghost"
            className="w-full h-7 text-xs gap-1 text-muted-foreground"
            onClick={() => toast.info(`${fattura.student_nome} — ${fattura.mese} — ${formatEUR(fattura.importo)}`)}
          >
            <Eye className="h-3.5 w-3.5" /> Dettagli
          </Button>
        </div>
      )}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
//  Table Row
// ─────────────────────────────────────────────────────────────
function FatturaTableRow({
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
    onUpdate({ stato: "pagata", data_pagamento: new Date().toISOString().slice(0, 10) });
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
    toast.success(`Sollecito #${nuovoSollecito.numero} inviato a ${studentEmail}: "${template.oggetto}"`);
    setSollecPopover(false);
  };

  const studentProfile = mockProfiles.find((p) => p.id === fattura.student_id);
  const isEx = studentProfile?.student_stato === "ex_studente";

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            {studentProfile?.avatar && <img src={studentProfile.avatar} alt={fattura.student_nome} />}
            <AvatarFallback className="text-[10px]">
              {fattura.student_nome.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm">{fattura.student_nome}</span>
          {isEx && (
            <Badge className="text-[10px] bg-gray-100 text-gray-600 hover:bg-gray-100">Ex</Badge>
          )}
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{fattura.mese}</span>
          {fattura.pdf_data && fattura.pdf_nome ? (
            <a href={fattura.pdf_data} download={fattura.pdf_nome} onClick={(e) => e.stopPropagation()}>
              <Badge variant="outline" className="text-[10px] gap-1 py-0 cursor-pointer hover:bg-primary/10 transition-colors">
                <Download className="h-2.5 w-2.5" /> PDF
              </Badge>
            </a>
          ) : null}
        </div>
      </TableCell>
      <TableCell>
        <span className="font-medium">{formatEUR(fattura.importo)}</span>
      </TableCell>
      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
        {formatDate(fattura.data_scadenza)}
      </TableCell>
      <TableCell>
        <FatturaStatoBadge stato={fattura.stato} />
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        {fattura.solleciti.length > 0 ? (
          <Badge variant="outline" className="text-xs gap-1 text-orange-700 border-orange-300">
            <Send className="h-3 w-3" /> {fattura.solleciti.length}
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1.5 flex-wrap">
          {fattura.stato === "pagata" ? (
            <Button size="sm" variant="ghost" className="h-7 text-xs gap-1"
              onClick={() => toast.info(`${fattura.mese} — ${fattura.student_nome}`)}>
              <Eye className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Vedi</span>
            </Button>
          ) : (
            <>
              <Button size="sm" variant="default"
                className="h-7 text-xs gap-1 bg-green-600 hover:bg-green-700"
                onClick={handleSegnaPagata}>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Pagata</span>
              </Button>
              <Popover open={sollecPopover} onOpenChange={setSollecPopover}>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                    <Send className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Sollecita</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold">Template sollecito</p>
                    <div className="space-y-1">
                      {SOLLECITO_TEMPLATES.map((t, i) => (
                        <button key={i} onClick={() => setSelectedTemplate(i)}
                          className={`w-full text-left p-2 rounded text-xs transition-colors ${
                            selectedTemplate === i ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                          }`}>
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
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

// ─────────────────────────────────────────────────────────────
//  Stato Badge
// ─────────────────────────────────────────────────────────────
function FatturaStatoBadge({ stato }: { stato: FatturaStato }) {
  if (stato === "pagata")
    return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1 text-xs"><CheckCircle2 className="h-3 w-3" /> Pagata</Badge>;
  if (stato === "inviata")
    return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 gap-1 text-xs"><Clock className="h-3 w-3" /> Inviata</Badge>;
  if (stato === "scaduta")
    return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 gap-1 text-xs"><AlertTriangle className="h-3 w-3" /> Scaduta</Badge>;
  return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 gap-1 text-xs"><Clock className="h-3 w-3" /> In Ritardo</Badge>;
}
