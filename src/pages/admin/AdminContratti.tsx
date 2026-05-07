import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Eye, Download, Search, FileText, TrendingUp, Users, Calendar,
  AlertCircle, RefreshCw, Home, ExternalLink, CheckCircle2, Clock, BellRing,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { mockContratti, mockProfiles, mockPagamenti, type Contratto } from "@/data/mockData";
import { toast } from "sonner";
import { PageTransition, FadeIn } from "@/components/motion/MotionWrappers";
import { downloadCSV, daysUntil, formatEUR, todayStamp } from "@/lib/csv";
import { BulkActionsBar } from "@/components/admin/BulkActionsBar";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const statoBadge: Record<string, string> = {
  attivo: "bg-success/15 text-success border-success/20",
  in_scadenza: "bg-orange-100 text-orange-700 border-orange-200",
  scaduto: "bg-destructive/15 text-destructive border-destructive/20",
  disdetto: "bg-muted text-muted-foreground border-border",
};

const statoLabel: Record<string, string> = {
  attivo: "Attivo",
  in_scadenza: "In Scadenza",
  scaduto: "Scaduto",
  disdetto: "Disdetto",
};

function findStudentByName(name: string) {
  return mockProfiles.find(p => `${p.nome} ${p.cognome}` === name);
}

function monthsBetween(start: string, end: string) {
  const s = new Date(start), e = new Date(end);
  return Math.max(1, (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth()));
}

export default function AdminContratti() {
  const [selected, setSelected] = useState<Contratto | null>(null);
  const [tab, setTab] = useState("tutti");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"recenti" | "scadenza" | "canone">("recenti");
  const [bulkSelected, setBulkSelected] = useState<Set<string>>(new Set());

  // MRR trend (mock 6 months)
  const mrrTrend = useMemo(() => {
    const months = ["Nov", "Dic", "Gen", "Feb", "Mar", "Apr"];
    const factors = [0.78, 0.83, 0.87, 0.91, 0.95, 1];
    const baseMrr = mockContratti.filter(c => c.stato === "attivo" || c.stato === "in_scadenza")
      .reduce((acc, c) => acc + c.canone_mensile, 0);
    return months.map((m, i) => ({ mese: m, mrr: Math.round(baseMrr * factors[i]) }));
  }, []);

  // KPIs
  const kpi = useMemo(() => {
    const total = mockContratti.length;
    const attivi = mockContratti.filter(c => c.stato === "attivo").length;
    const inScadenza = mockContratti.filter(c => c.stato === "in_scadenza" || (c.stato === "attivo" && daysUntil(c.data_fine) < 60)).length;
    const mrr = mockContratti.filter(c => c.stato === "attivo" || c.stato === "in_scadenza")
      .reduce((acc, c) => acc + c.canone_mensile, 0);
    return { total, attivi, inScadenza, mrr };
  }, []);

  const filtered = useMemo(() => {
    let list = mockContratti.slice();
    if (tab !== "tutti") list = list.filter(c => c.stato === tab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.student_nome.toLowerCase().includes(q) ||
        c.camera_nome.toLowerCase().includes(q),
      );
    }
    list.sort((a, b) => {
      if (sort === "scadenza") return new Date(a.data_fine).getTime() - new Date(b.data_fine).getTime();
      if (sort === "canone") return b.canone_mensile - a.canone_mensile;
      return new Date(b.data_firma).getTime() - new Date(a.data_firma).getTime();
    });
    return list;
  }, [tab, search, sort]);

  const handleExport = () => {
    downloadCSV(
      `contratti-${todayStamp()}.csv`,
      ["Studente", "Camera", "Inizio", "Fine", "Canone mensile", "Stato", "Data firma"],
      filtered.map(c => [
        c.student_nome, c.camera_nome, c.data_inizio, c.data_fine,
        c.canone_mensile, statoLabel[c.stato], c.data_firma,
      ]),
    );
    toast.success(`Esportati ${filtered.length} contratti`);
  };

  const renderRow = (c: Contratto, i: number) => {
    const student = findStudentByName(c.student_nome);
    const initials = c.student_nome.split(" ").map(n => n[0]).join("").slice(0, 2);
    const giorni = daysUntil(c.data_fine);
    const showCountdown = c.stato === "attivo" || c.stato === "in_scadenza";
    return (
      <FadeIn key={c.id} delay={i * 0.03}>
        <tr className="border-b hover:bg-muted/50 transition-colors group">
          <td className="py-3 px-2 w-8">
            <Checkbox
              checked={bulkSelected.has(c.id)}
              onCheckedChange={() => {
                setBulkSelected(prev => {
                  const n = new Set(prev);
                  if (n.has(c.id)) n.delete(c.id); else n.add(c.id);
                  return n;
                });
              }}
            />
          </td>
          <td className="py-3 px-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                {student?.avatar && <AvatarImage src={student.avatar} alt={c.student_nome} />}
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-medium truncate">{c.student_nome}</p>
                {student?.corso && <p className="text-xs text-muted-foreground truncate">{student.corso}</p>}
              </div>
            </div>
          </td>
          <td className="py-3 px-4">
            <div className="flex items-center gap-1.5">
              <Home className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{c.camera_nome}</span>
            </div>
          </td>
          <td className="py-3 px-4">
            <p className="text-sm">{c.data_inizio} → {c.data_fine}</p>
            {showCountdown && giorni > 0 && giorni < 60 && (
              <Badge className="mt-1 bg-orange-100 text-orange-700 border-orange-200 text-[10px]">
                Scade in {giorni}gg
              </Badge>
            )}
            {showCountdown && giorni < 0 && (
              <Badge className="mt-1 bg-destructive/15 text-destructive text-[10px]">Scaduto</Badge>
            )}
          </td>
          <td className="py-3 px-4 font-medium">{formatEUR(c.canone_mensile)}<span className="text-xs text-muted-foreground">/mese</span></td>
          <td className="py-3 px-4">
            <Badge className={statoBadge[c.stato]}>{statoLabel[c.stato]}</Badge>
          </td>
          <td className="py-3 px-4">
            <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setSelected(c)}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8"
                onClick={() => toast.success("Download avviato (demo)")}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </td>
        </tr>
      </FadeIn>
    );
  };

  // selected detail derivations
  const detail = useMemo(() => {
    if (!selected) return null;
    const months = monthsBetween(selected.data_inizio, selected.data_fine);
    const totale = months * selected.canone_mensile;
    const pagamenti = mockPagamenti.filter((p) => p.contratto_id === selected.id);
    const incassato = pagamenti.filter(p => p.stato === "pagato").reduce((a, p) => a + p.importo, 0);
    const residuo = Math.max(0, totale - incassato);
    const student = findStudentByName(selected.student_nome);
    return { months, totale, pagamenti, incassato, residuo, student };
  }, [selected]);

  return (
    <PageTransition>
      <div className="p-4 sm:p-6 space-y-6">
        <FadeIn>
          <div>
            <h1 className="text-xl sm:text-2xl font-heading font-bold">Contratti di Affitto</h1>
            <p className="text-sm text-muted-foreground">Gestisci i contratti firmati dagli studenti</p>
          </div>
        </FadeIn>

        {/* KPI cards */}
        <FadeIn delay={0.05}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Totale Contratti</p>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold mt-1">{kpi.total}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Attivi</p>
                  <CheckCircle2 className="h-4 w-4 text-success" />
                </div>
                <p className="text-2xl font-bold mt-1 text-success">{kpi.attivi}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">In Scadenza (&lt;60gg)</p>
                  <AlertCircle className="h-4 w-4 text-orange-700" />
                </div>
                <p className="text-2xl font-bold mt-1 text-orange-700">{kpi.inScadenza}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">MRR</p>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <p className="text-2xl font-bold mt-1 text-primary">{formatEUR(kpi.mrr)}</p>
              </CardContent>
            </Card>
          </div>
        </FadeIn>

        {/* MRR trend chart */}
        <FadeIn delay={0.07}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">Trend MRR (ultimi 6 mesi)</p>
              </div>
              <ChartContainer config={{ mrr: { label: "MRR", color: "hsl(var(--primary))" } }} className="h-[180px] w-full">
                <AreaChart data={mrrTrend} margin={{ left: 12, right: 12, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="mese" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <ChartTooltip content={<ChartTooltipContent formatter={(v) => formatEUR(Number(v))} />} />
                  <defs>
                    <linearGradient id="mrrFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-mrr)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--color-mrr)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="mrr" stroke="var(--color-mrr)" fill="url(#mrrFill)" strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca studente o camera..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
              <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="recenti">Più recenti</SelectItem>
                <SelectItem value="scadenza">Per scadenza</SelectItem>
                <SelectItem value="canone">Canone (alto→basso)</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />Esporta CSV
            </Button>
          </div>
        </FadeIn>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex flex-wrap h-auto">
            <TabsTrigger value="tutti">Tutti ({mockContratti.length})</TabsTrigger>
            <TabsTrigger value="attivo">Attivi ({mockContratti.filter(c => c.stato === "attivo").length})</TabsTrigger>
            <TabsTrigger value="in_scadenza">In Scadenza ({mockContratti.filter(c => c.stato === "in_scadenza").length})</TabsTrigger>
            <TabsTrigger value="scaduto">Scaduti ({mockContratti.filter(c => c.stato === "scaduto").length})</TabsTrigger>
            <TabsTrigger value="disdetto">Disdetti ({mockContratti.filter(c => c.stato === "disdetto").length})</TabsTrigger>
          </TabsList>

          <TabsContent value={tab} className="mt-4">
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground bg-muted/30">
                      <th className="py-3 px-2 w-8" />
                      <th className="text-left py-3 px-4 font-medium">Studente</th>
                      <th className="text-left py-3 px-4 font-medium">Camera</th>
                      <th className="text-left py-3 px-4 font-medium">Periodo</th>
                      <th className="text-left py-3 px-4 font-medium">Canone</th>
                      <th className="text-left py-3 px-4 font-medium">Stato</th>
                      <th className="text-left py-3 px-4 font-medium">Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(renderRow)}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-muted-foreground">
                          <FileText className="h-10 w-10 mx-auto mb-2 opacity-30" />
                          <p>Nessun contratto trovato</p>
                          {search && <p className="text-xs mt-1">Prova a modificare la ricerca</p>}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Detail dialog */}
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Contratto · {selected?.student_nome}</DialogTitle>
            </DialogHeader>
            {selected && detail && (
              <div className="space-y-4">
                {/* Quick actions */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/admin/studenti"><Users className="h-3.5 w-3.5 mr-1.5" />Vedi studente<ExternalLink className="h-3 w-3 ml-1" /></Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/admin/camere"><Home className="h-3.5 w-3.5 mr-1.5" />Vedi camera<ExternalLink className="h-3 w-3 ml-1" /></Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toast.success("Rinnovo avviato (demo)")}>
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" />Rinnova
                  </Button>
                </div>

                <Tabs defaultValue="riepilogo">
                  <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full h-auto gap-1 p-1">
                    <TabsTrigger value="riepilogo">Riepilogo</TabsTrigger>
                    <TabsTrigger value="pagamenti">Pagamenti</TabsTrigger>
                    <TabsTrigger value="documento">Documento</TabsTrigger>
                    <TabsTrigger value="storico">Storico</TabsTrigger>
                  </TabsList>

                  <TabsContent value="riepilogo" className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><p className="text-muted-foreground">Studente</p><p className="font-medium">{selected.student_nome}</p></div>
                      <div><p className="text-muted-foreground">Camera</p><p className="font-medium">{selected.camera_nome}</p></div>
                      <div><p className="text-muted-foreground">Inizio</p><p className="font-medium">{selected.data_inizio}</p></div>
                      <div><p className="text-muted-foreground">Fine</p><p className="font-medium">{selected.data_fine}</p></div>
                      <div><p className="text-muted-foreground">Canone</p><p className="font-medium">{formatEUR(selected.canone_mensile)}/mese</p></div>
                      <div><p className="text-muted-foreground">Stato</p><Badge className={statoBadge[selected.stato]}>{statoLabel[selected.stato]}</Badge></div>
                      <div><p className="text-muted-foreground">Data Firma</p><p className="font-medium">{selected.data_firma}</p></div>
                      <div><p className="text-muted-foreground">Durata</p><p className="font-medium">{detail.months} mesi</p></div>
                    </div>
                    <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                      <p className="text-sm font-medium flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" />Riepilogo finanziario</p>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                          <p className="text-xs text-muted-foreground">Totale contratto</p>
                          <p className="font-bold text-lg">{formatEUR(detail.totale)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Già incassato</p>
                          <p className="font-bold text-lg text-success">{formatEUR(detail.incassato)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Residuo</p>
                          <p className="font-bold text-lg text-orange-700">{formatEUR(detail.residuo)}</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="pagamenti" className="pt-4">
                    {detail.pagamenti.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Calendar className="h-10 w-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Nessun pagamento registrato</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {detail.pagamenti.map(p => (
                          <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                            <div className="flex items-center gap-3">
                              {p.stato === "pagato" ? <CheckCircle2 className="h-5 w-5 text-success" /> :
                               p.stato === "in_scadenza" ? <Clock className="h-5 w-5 text-orange-700" /> :
                               <AlertCircle className="h-5 w-5 text-destructive" />}
                              <div>
                                <p className="font-medium text-sm">{p.mese}</p>
                                <p className="text-xs text-muted-foreground">Scad. {p.data_scadenza}{p.metodo ? ` · ${p.metodo}` : ""}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{formatEUR(p.importo)}</p>
                              <Badge variant="outline" className="text-[10px]">{p.stato === "in_scadenza" ? "In scadenza" : p.stato}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="documento" className="pt-4 space-y-4">
                    <div className="rounded-lg border-2 border-dashed bg-muted/30 p-8 text-center">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                      <p className="font-medium">Anteprima contratto</p>
                      <p className="text-xs text-muted-foreground mt-1">Documento PDF firmato il {selected.data_firma}</p>
                    </div>
                    <Button className="w-full" onClick={() => toast.success("Download avviato (demo)")}>
                      <Download className="h-4 w-4 mr-2" />Scarica Contratto PDF
                    </Button>
                  </TabsContent>

                  <TabsContent value="storico" className="pt-4">
                    <div className="space-y-3">
                      {[
                        { label: "Contratto firmato", date: selected.data_firma, icon: CheckCircle2, color: "text-success" },
                        { label: "Contratto attivo", date: selected.data_inizio, icon: Clock, color: "text-primary" },
                        { label: "Scadenza prevista", date: selected.data_fine, icon: AlertCircle, color: "text-orange-700" },
                      ].map((e, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                          <e.icon className={`h-4 w-4 mt-0.5 ${e.color}`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{e.label}</p>
                            <p className="text-xs text-muted-foreground">{e.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}
