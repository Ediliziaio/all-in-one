import { Link } from "react-router-dom";
import { BedDouble, CalendarCheck, Headphones, Gift, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { currentUser, mockRichieste, mockTickets, mockPosts, mockBuoni } from "@/data/mockData";
import { getRoomById } from "@/data/rooms";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem, HoverCard } from "@/components/motion/MotionWrappers";

export default function StudenteHome() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Buongiorno" : hour < 18 ? "Buon pomeriggio" : "Buonasera";
  const myRoom = currentUser.camera_id ? getRoomById(currentUser.camera_id) : null;
  const myBooking = mockRichieste.find((p) => p.student_id === currentUser.id);
  const myTickets = mockTickets.filter((t) => t.student_id === currentUser.id && t.stato !== "risolto");
  const latestBuono = mockBuoni[0];

  return (
    <PageTransition className="p-6 space-y-6">
      <FadeIn>
        <h1 className="font-heading text-2xl font-bold">{greeting} {currentUser.nome}! 👋</h1>
        <p className="text-sm text-muted-foreground">Ecco un riepilogo del tuo studentato</p>
      </FadeIn>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myRoom && (
          <StaggerItem>
            <HoverCard>
              <Card className="overflow-hidden">
                <img src={myRoom.images[0]} alt={myRoom.name} className="w-full h-32 object-cover transition-transform duration-300 hover:scale-105" />
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BedDouble className="h-4 w-4 text-accent" />
                    <span className="font-heading font-semibold">{myRoom.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Piano {myRoom.floor} · {myRoom.sqm}mq</p>
                  <Link to="/studente/camera" className="text-sm text-accent hover:underline mt-2 inline-flex items-center gap-1">
                    Vedi dettaglio <ArrowRight className="h-3 w-3" />
                  </Link>
                </CardContent>
              </Card>
            </HoverCard>
          </StaggerItem>
        )}

        {myBooking && (
          <StaggerItem>
            <HoverCard>
              <Card>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="h-4 w-4 text-accent" />
                    <span className="font-heading font-semibold">La tua richiesta</span>
                  </div>
                  <p className="text-sm">{myBooking.camera_nome}</p>
                  <p className="text-xs text-muted-foreground">{myBooking.data_inizio} → {myBooking.data_fine}</p>
                  <Badge className={myBooking.stato === "approvata" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                    {myBooking.stato}
                  </Badge>
                </CardContent>
              </Card>
            </HoverCard>
          </StaggerItem>
        )}

        <StaggerItem>
          <HoverCard>
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Headphones className="h-4 w-4 text-accent" />
                  <span className="font-heading font-semibold">Ticket aperti</span>
                </div>
                <p className="text-3xl font-bold">{myTickets.length}</p>
                <Link to="/studente/supporto" className="text-sm text-accent hover:underline inline-flex items-center gap-1">
                  Vedi ticket <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          </HoverCard>
        </StaggerItem>
      </StaggerContainer>

      {/* Post recenti community */}
      <FadeIn delay={0.2}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-semibold text-lg">Post recenti dalla community</h2>
          <Link to="/studente/community" className="text-sm text-accent hover:underline">Vedi tutti</Link>
        </div>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {mockPosts.slice(0, 3).map((post) => (
            <StaggerItem key={post.id}>
              <HoverCard>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <img src={post.author.avatar} className="h-6 w-6 rounded-full object-cover" alt={post.author.nome} />
                      <span className="text-sm font-medium">{post.author.nome}</span>
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

      {/* Buono del giorno */}
      <FadeIn delay={0.3}>
        <HoverCard scale={1.01}>
          <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-4 flex items-center gap-4">
              <Gift className="h-8 w-8 text-accent" />
              <div className="flex-1">
                <p className="text-xs text-accent font-medium">Buono del giorno</p>
                <p className="font-heading font-semibold">{latestBuono.nome_esercizio} — {latestBuono.sconto}</p>
                <p className="text-sm text-muted-foreground">{latestBuono.descrizione}</p>
              </div>
              <Link to="/studente/buoni" className="text-accent hover:underline text-sm">Scopri</Link>
            </CardContent>
          </Card>
        </HoverCard>
      </FadeIn>
    </PageTransition>
  );
}
