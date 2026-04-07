import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { mockProfiles } from "@/data/mockData";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem, HoverCard } from "@/components/motion/MotionWrappers";

export default function Profili() {
  const students = mockProfiles.filter((p) => p.role === "student");

  return (
    <PageTransition className="p-6 space-y-6">
      <FadeIn><h1 className="font-heading text-2xl font-bold">Conosci i tuoi coinquilini</h1></FadeIn>

      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((s) => (
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
                    <p className="text-sm text-muted-foreground">{s.corso} · {s.anno}° anno</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {s.interessi.map((i) => (
                      <Badge key={i} variant="outline" className="text-xs">{i}</Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/studente/community/profilo/${s.id}`}>Vedi Profilo</Link>
                  </Button>
                </CardContent>
              </Card>
            </HoverCard>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </PageTransition>
  );
}
