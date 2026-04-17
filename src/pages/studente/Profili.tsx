import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { mockProfiles, currentUser } from "@/data/mockData";
import { usePrivacySettings, DEFAULT_PRIVACY, type PrivacySettings } from "@/hooks/usePrivacySettings";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem, HoverCard } from "@/components/motion/MotionWrappers";

export default function Profili() {
  const { settings: mySettings } = usePrivacySettings();

  // Filtro: nascondo i profili che hanno disattivato la visibilità
  const students = mockProfiles.filter((p) => {
    if (p.role !== "student") return false;
    const isMe = p.id === currentUser.id;
    const privacy: PrivacySettings = isMe ? mySettings : DEFAULT_PRIVACY;
    return privacy.visibleInCommunity;
  });

  return (
    <PageTransition className="p-4 md:p-6 space-y-5 md:space-y-6">
      <FadeIn>
        <h1 className="font-heading text-xl md:text-2xl font-bold">Conosci i tuoi coinquilini</h1>
        <p className="text-sm text-muted-foreground">{students.length} profili visibili</p>
      </FadeIn>

      {students.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center text-sm text-muted-foreground">
            Nessun profilo visibile al momento.
          </CardContent>
        </Card>
      ) : (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((s) => {
            const isMe = s.id === currentUser.id;
            const privacy: PrivacySettings = isMe ? mySettings : DEFAULT_PRIVACY;
            return (
              <StaggerItem key={s.id}>
                <HoverCard>
                  <Card>
                    <CardContent className="p-5 text-center space-y-3">
                      <Avatar className="h-20 w-20 mx-auto">
                        <AvatarImage src={s.avatar} />
                        <AvatarFallback className="text-xl">{s.nome[0]}{s.cognome[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-heading font-bold">{s.nome} {s.cognome}</p>
                        {(privacy.showCorso || privacy.showAnno) && (
                          <p className="text-sm text-muted-foreground">
                            {privacy.showCorso && s.corso}
                            {privacy.showCorso && privacy.showAnno && " · "}
                            {privacy.showAnno && `${s.anno}° anno`}
                          </p>
                        )}
                      </div>
                      {privacy.showInteressi && s.interessi.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-1.5">
                          {s.interessi.slice(0, 3).map((i) => (
                            <Badge key={i} variant="outline" className="text-xs">{i}</Badge>
                          ))}
                        </div>
                      )}
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/studente/community/profilo/${s.id}`}>Vedi Profilo</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </HoverCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      )}
    </PageTransition>
  );
}
