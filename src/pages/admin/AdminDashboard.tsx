import { useMemo } from "react";
import { BedDouble, CalendarCheck, Headphones, TrendingUp, ArrowUpRight, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockFatture, FATTURE_KEY, type Fattura } from "@/data/mockData";
import { loadRooms } from "@/data/roomsStore";
import { loadLeads } from "@/data/leadsStore";
import { loadAllTickets } from "@/data/ticketsStore";
import { formatEUR } from "@/lib/csv";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem, HoverCard, CountUp } from "@/components/motion/MotionWrappers";

function loadFatture(): Fattura[] {
  try {
    const s = localStorage.getItem(FATTURE_KEY);
    if (s) return JSON.parse(s) as Fattura[];
  } catch {}
  return mockFatture;
}

const occupancy = [
  { month: "Gen", value: 85 }, { month: "Feb", value: 88 }, { month: "Mar", value: 90 },
  { month: "Apr", value: 92 }, { month: "Mag", value: 95 }, { month: "Giu", value: 78 },
];

export default function AdminDashboard() {
  // Read live state from localStorage stores on every mount
  const rooms = useMemo(() => loadRooms(), []);
  const leads = useMemo(() => loadLeads(), []);
  const allTickets = useMemo(() => loadAllTickets(), []);
  const fatture = useMemo(() => loadFatture(), []);

  const kpis = useMemo(() => [
    { label: "Camere disponibili", value: `${rooms.filter(r => r.available).length}/${rooms.length}`, icon: BedDouble, color: "text-accent" },
    { label: "Richieste in attesa", value: leads.filter(p => p.stato === "pending").length.toString(), icon: CalendarCheck, color: "text-yellow-500" },
    { label: "Ticket aperti", value: allTickets.filter(t => t.stato !== "risolto").length.toString(), icon: Headphones, color: "text-red-500" },
    { label: "Fatture scadute", value: fatture.filter(f => f.stato === "scaduta" || f.stato === "in_ritardo").length.toString(), icon: AlertTriangle, color: "text-orange-500" },
  ], [leads, allTickets, rooms, fatture]);

  return (
    <PageTransition className="p-4 md:p-6 space-y-4 md:space-y-6">
      <FadeIn>
        <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Panoramica generale dello studentato</p>
      </FadeIn>

      {/* KPI cards */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <StaggerItem key={kpi.label}>
            <HoverCard>
              <Card>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-muted ${kpi.color}`}>
                    <kpi.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CountUp value={kpi.value} className="text-2xl font-bold" />
                    <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  </div>
                </CardContent>
              </Card>
            </HoverCard>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Charts */}
      <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StaggerItem>
          <HoverCard scale={1.01}>
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4" />Occupazione per mese</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-end gap-3 h-40">
                  {occupancy.map((m) => (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-primary/80 rounded-t-md transition-all" style={{ height: `${m.value}%` }} />
                      <span className="text-xs text-muted-foreground">{m.month}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </HoverCard>
        </StaggerItem>

        <StaggerItem>
          <HoverCard scale={1.01}>
            <Card>
              <CardHeader><CardTitle className="text-base">Distribuzione camere</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { label: "Singole",      count: rooms.filter(r => r.type === "singola").length,       pct: Math.round(rooms.filter(r => r.type === "singola").length / rooms.length * 100) },
                    { label: "Singole Plus", count: rooms.filter(r => r.type === "singola-plus").length,  pct: Math.round(rooms.filter(r => r.type === "singola-plus").length / rooms.length * 100) },
                    { label: "Doppie",       count: rooms.filter(r => r.type === "doppia").length,        pct: Math.round(rooms.filter(r => r.type === "doppia").length / rooms.length * 100) },
                  ].map((t) => (
                    <div key={t.label} className="space-y-1">
                      <div className="flex justify-between text-sm"><span>{t.label}</span><span className="font-medium">{t.count}</span></div>
                      <div className="h-2 bg-muted rounded-full"><div className="h-full bg-accent rounded-full" style={{ width: `${t.pct}%` }} /></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </HoverCard>
        </StaggerItem>
      </StaggerContainer>

      {/* Quick access tables */}
      <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StaggerItem>
          <FadeIn delay={0.1}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Ultime richieste</CardTitle>
                <Button variant="ghost" size="sm" asChild><Link to="/admin/richieste">Vedi tutte <ArrowUpRight className="h-3 w-3 ml-1" /></Link></Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leads.slice(0, 4).map((p) => (
                    <div key={p.id} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium">{p.student_nome}</p>
                        <p className="text-xs text-muted-foreground">{p.camera_nome}</p>
                      </div>
                      <Badge variant={p.stato === "pending" ? "secondary" : "default"} className={p.stato === "approvata" ? "bg-green-100 text-green-700" : ""}>
                        {p.stato}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </StaggerItem>

        <StaggerItem>
          <FadeIn delay={0.2}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Ticket recenti</CardTitle>
                <Button variant="ghost" size="sm" asChild><Link to="/admin/supporto">Vedi tutti <ArrowUpRight className="h-3 w-3 ml-1" /></Link></Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allTickets.slice(0, 5).map((t) => (
                    <div key={t.id} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium">{t.titolo}</p>
                        <p className="text-xs text-muted-foreground">{t.student_nome}</p>
                      </div>
                      <Badge variant="outline" className={t.priorita === "alta" || t.priorita === "urgente" ? "border-red-300 text-red-600" : ""}>
                        {t.priorita}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </StaggerItem>
      </StaggerContainer>
    </PageTransition>
  );
}
