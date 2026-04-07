import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { mockProfiles } from "@/data/mockData";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/MotionWrappers";

export default function AdminStudenti() {
  const students = mockProfiles.filter((p) => p.role === "student");

  return (
    <PageTransition className="p-6 space-y-6">
      <FadeIn>
        <h1 className="font-heading text-2xl font-bold">Studenti</h1>
        <p className="text-sm text-muted-foreground">{students.length} studenti registrati</p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Card>
          <StaggerContainer className="divide-y">
            {students.map((s) => (
              <StaggerItem key={s.id}>
                <div className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
                  <Avatar>
                    <AvatarImage src={s.avatar} alt={s.nome} />
                    <AvatarFallback>{s.nome[0]}{s.cognome[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{s.nome} {s.cognome}</p>
                    <p className="text-xs text-muted-foreground">{s.email}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{s.corso}</p>
                  <Badge variant="outline">{s.anno}° anno</Badge>
                  {s.camera_id && <Badge className="bg-green-100 text-green-700">Assegnato</Badge>}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Card>
      </FadeIn>
    </PageTransition>
  );
}
