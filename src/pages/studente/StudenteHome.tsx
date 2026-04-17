import { Link } from "react-router-dom";
import { BedDouble, Headphones, Gift, ArrowRight, AlertTriangle, CreditCard, CalendarPlus, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { currentUser, mockTickets, mockPosts, mockBuoni, mockPagamenti } from "@/data/mockData";
import { getRoomById } from "@/data/rooms";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem, HoverCard } from "@/components/motion/MotionWrappers";

const quickActions = [
  { label: "Paga rata", href: "/studente/pagamenti", icon: CreditCard, color: "text-primary", bg: "bg-primary/10" },
  { label: "Apri ticket", href: "/studente/supporto", icon: Headphones, color: "text-accent", bg: "bg-accent/10" },
  { label: "Prenota", href: "/studente/prenota", icon: CalendarPlus, color: "text-green-600", bg: "bg-green-100" },
  { label: "Buoni", href: "/studente/buoni", icon: Gift, color: "text-purple-600", bg: "bg-purple-100" },
];

export default function StudenteHome() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Buongiorno" : hour < 18 ? "Buon pomeriggio" : "Buonasera";
  const myRoom = currentUser.camera_id ? getRoomById(currentUser.camera_id) : null;
  const myTickets = mockTickets.filter((t) => t.student_id === currentUser.id && t.stato !== "risolto");
  const latestBuono = mockBuoni[0];

  // Prossima rata da pagare
  const prossimaRata = mockPagamenti.find((p) => p.stato === "in_scadenza" || p.stato === "scaduto");
  const showAlertScadenza = !!prossimaRata;

  // Eventi prossimi
  const eventi = mockPosts.filter((p) => p.data_evento).slice(0, 2);

  return (
    <PageTransition className="p-4 md:p-6 space-y-5 md:space-y-6">
      <FadeIn>
        <h1 className="font-heading text-xl md:text-2xl font-bold">{greeting}, {currentUser.nome}</h1>
        <p className="text-sm text-muted-foreground">Ecco un riepilogo del tuo studentato</p>
      </FadeIn>

      {/* Alert scadenza */}
      {showAlertScadenza && (
        <FadeIn delay={0.05}>
          <Card className={prossimaRata.stato === "scaduto" ? "border-destructive bg-destructive/5" : "border-yellow-300 bg-yellow-50"}>
            <CardContent className="p-4 flex items-center gap-3">
              <AlertTriangle className={`h-5 w-5 shrink-0 ${prossimaRata.stato === "scaduto" ? "text-destructive" : "text-yellow-700"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">
                  {prossimaRata.stato === "scaduto" ? "Rata scaduta" : "Rata in scadenza"} — {prossimaRata.mese}
                </p>
                <p className="text-xs text-muted-foreground">{prossimaRata.importo}€ entro il {prossimaRata.data_scadenza}</p>
              </div>
              <Button asChild size="sm" className="shrink-0">
                <Link to="/studente/pagamenti">Paga ora</Link>
              </Button>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* Quick actions */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-4 gap-2 md:gap-3">
          {quickActions.map((a) => (
            <Link
              key={a.href}
              to={a.href}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border hover:shadow-sm transition-all text-center"
            >
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${a.bg}`}>
                <a.icon className={`h-5 w-5 ${a.color}`} />
              </div>
              <span className="text-[11px] md:text-xs font-medium leading-tight">{a.label}</span>
            </Link>
          ))}
        </div>
      </FadeIn>

      {/* Cards principali */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {myRoom && (
          <StaggerItem>
            <HoverCard>
              <Card className="overflow-hidden h-full">
                <img src={myRoom.images[0]} alt={myRoom.name} className="w-full h-32 object-cover" />
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <BedDouble className="h-4 w-4 text-accent" />
                    <span className="font-heading font-semibold text-sm">{myRoom.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Piano {myRoom.floor} · {myRoom.sqm}mq</p>
                  <Link to="/studente/camera" className="text-sm text-accent hover:underline mt-2 inline-flex items-center gap-1">
                    Vedi dettaglio <ArrowRight className="h-3 w-3" />
                  </Link>
                </CardContent>
              </Card>
            </HoverCard>
          </StaggerItem>
        )}

        <StaggerItem>
          <HoverCard>
            <Card className="h-full">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <span className="font-heading font-semibold text-sm">Prossima scadenza</span>
                </div>
                {prossimaRata ? (
                  <>
                    <p className="text-2xl font-bold">{prossimaRata.importo}€</p>
                    <p className="text-xs text-muted-foreground">{prossimaRata.mese} · entro {prossimaRata.data_scadenza}</p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Nessuna rata in scadenza</p>
                )}
                <Link to="/studente/pagamenti" className="text-sm text-accent hover:underline inline-flex items-center gap-1">
                  Storico <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          </HoverCard>
        </StaggerItem>

        {myTickets.length > 0 && (
          <StaggerItem>
            <HoverCard>
              <Card className="h-full">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Headphones className="h-4 w-4 text-accent" />
                    <span className="font-heading font-semibold text-sm">Ticket attivi</span>
                  </div>
                  <p className="text-2xl font-bold">{myTickets.length}</p>
                  <Link to="/studente/supporto" className="text-sm text-accent hover:underline inline-flex items-center gap-1">
                    Vedi ticket <ArrowRight className="h-3 w-3" />
                  </Link>
                </CardContent>
              </Card>
            </HoverCard>
          </StaggerItem>
        )}
      </StaggerContainer>

      {/* Post recenti community */}
      <FadeIn delay={0.2}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-semibold text-base md:text-lg">Dalla community</h2>
          <Link to="/studente/community" className="text-sm text-accent hover:underline">Vedi tutti</Link>
        </div>
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {mockPosts.slice(0, 3).map((post) => (
            <StaggerItem key={post.id}>
              <HoverCard>
                <Card className="h-full">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <img src={post.author.avatar} className="h-6 w-6 rounded-full object-cover" alt={post.author.nome} />
                      <span className="text-sm font-medium truncate">{post.author.nome}</span>
                      <Badge variant="outline" className="text-xs">{post.tipo}</Badge>
                    </div>
                    <p className="text-sm line-clamp-2">{post.contenuto}</p>
                  </CardContent>
                </Card>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </FadeIn>

      {/* Eventi prossimi */}
      {eventi.length > 0 && (
        <FadeIn delay={0.25}>
          <h2 className="font-heading font-semibold text-base md:text-lg mb-3">Prossimi eventi</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {eventi.map((e) => (
              <Card key={e.id}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                    <Calendar className="h-5 w-5 text-purple-700" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{e.titolo || e.contenuto.slice(0, 40)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(e.data_evento!).toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </FadeIn>
      )}

      {/* Buono del giorno */}
      <FadeIn delay={0.3}>
        <HoverCard scale={1.01}>
          <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-4 flex items-center gap-3 md:gap-4">
              <Gift className="h-7 w-7 md:h-8 md:w-8 text-accent shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-accent font-medium">Buono del giorno</p>
                <p className="font-heading font-semibold text-sm md:text-base truncate">{latestBuono.nome_esercizio} — {latestBuono.sconto}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{latestBuono.descrizione}</p>
              </div>
              <Link to="/studente/buoni" className="text-accent hover:underline text-sm shrink-0">Scopri</Link>
            </CardContent>
          </Card>
        </HoverCard>
      </FadeIn>
    </PageTransition>
  );
}
