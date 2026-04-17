import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Check, FileText, Headphones, Calendar, MapPin } from "lucide-react";
import { currentUser, mockProfiles, mockRichieste } from "@/data/mockData";
import { getRoomById } from "@/data/rooms";
import { PageTransition, FadeIn } from "@/components/motion/MotionWrappers";

export default function MiaCamera() {
  const room = currentUser.camera_id ? getRoomById(currentUser.camera_id) : null;
  if (!room) return <div className="p-6 text-center text-muted-foreground">Nessuna camera assegnata</div>;

  const neighbors = mockProfiles.filter((p) => p.role === "student" && p.piano === currentUser.piano && p.id !== currentUser.id);
  const contratto = mockRichieste.find((r) => r.student_id === currentUser.id && r.stato === "approvata");

  return (
    <PageTransition className="p-4 md:p-6 space-y-5 md:space-y-6">
      <FadeIn>
        <h1 className="font-heading text-xl md:text-2xl font-bold">La Mia Camera</h1>
      </FadeIn>

      {/* Galleria - mobile: hero + 3 thumb / desktop: 1 grande + 3 piccole */}
      <FadeIn delay={0.1}>
        <div className="space-y-2">
          <img
            src={room.images[0]}
            alt={room.name}
            className="rounded-xl object-cover w-full h-56 md:h-72 transition-transform duration-300 hover:scale-[1.01]"
          />
          {room.images.length > 1 && (
            <div className="grid grid-cols-3 gap-2">
              {room.images.slice(1, 4).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Foto ${i + 2}`}
                  className="rounded-lg object-cover w-full h-20 md:h-28"
                />
              ))}
            </div>
          )}
        </div>
      </FadeIn>

      {/* Info principali */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <FadeIn delay={0.2} className="lg:col-span-2">
          <div className="space-y-4">
            <div>
              <h2 className="font-heading text-lg md:text-xl font-bold">{room.name}</h2>
              <p className="text-sm text-muted-foreground">Piano {room.floor} · {room.sqm}mq · {room.price}€/mese</p>
            </div>
            <p className="text-sm leading-relaxed">{room.description}</p>

            <div className="space-y-2">
              <h3 className="font-heading font-semibold text-sm">Servizi inclusi</h3>
              <div className="flex flex-wrap gap-2">
                {room.features.map((f) => (
                  <Badge key={f} variant="outline" className="gap-1">
                    <Check className="h-3 w-3 text-green-500" />{f}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button asChild className="flex-1">
                <Link to="/studente/supporto">
                  <Headphones className="h-4 w-4 mr-2" /> Apri ticket per questa camera
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to="/studente/documenti">
                  <FileText className="h-4 w-4 mr-2" /> Documenti
                </Link>
              </Button>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.3} direction="right">
          <div className="space-y-4">
            {/* Contratto */}
            {contratto && (
              <Card>
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-heading font-semibold text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" /> Contratto
                  </h3>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Inizio</span>
                      <span className="font-medium">{contratto.data_inizio}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fine</span>
                      <span className="font-medium">{contratto.data_fine}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stato</span>
                      <Badge className="bg-green-100 text-green-700">Attivo</Badge>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to="/studente/documenti">Scarica contratto</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Compagni di piano */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="font-heading font-semibold text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent" /> Compagni di piano
                </h3>
                {neighbors.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nessun altro studente nel tuo piano</p>
                ) : (
                  <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible -mx-1 px-1">
                    {neighbors.map((n) => (
                      <Link
                        key={n.id}
                        to={`/studente/community/profilo/${n.id}`}
                        className="flex items-center gap-3 shrink-0 md:w-full hover:bg-muted rounded-lg p-1.5 transition-colors"
                      >
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={n.avatar} />
                          <AvatarFallback>{n.nome[0]}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{n.nome} {n.cognome}</p>
                          <p className="text-xs text-muted-foreground truncate">{n.corso}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
}
