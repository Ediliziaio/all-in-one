import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { mockProfiles } from "@/data/mockData";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/MotionWrappers";
import { Eye } from "lucide-react";
import type { Profile } from "@/data/mockData";

export default function AdminStudenti() {
  const students = mockProfiles.filter((p) => p.role === "student");
  const [selected, setSelected] = useState<Profile | null>(null);

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
                  <p className="text-sm text-muted-foreground hidden sm:block">{s.corso}</p>
                  <Badge variant="outline">{s.anno}° anno</Badge>
                  {s.camera_id && <Badge className="bg-green-100 text-green-700">Assegnato</Badge>}
                  <Button variant="outline" size="sm" onClick={() => setSelected(s)}>
                    <Eye className="h-3 w-3 mr-1" /> Dettaglio
                  </Button>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Card>
      </FadeIn>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Dettaglio Studente</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selected.avatar} />
                  <AvatarFallback className="text-lg">{selected.nome[0]}{selected.cognome[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-heading font-bold text-lg">{selected.nome} {selected.cognome}</p>
                  <p className="text-sm text-muted-foreground">{selected.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Corso:</span> <span className="font-medium">{selected.corso}</span></div>
                <div><span className="text-muted-foreground">Anno:</span> <span className="font-medium">{selected.anno}°</span></div>
                <div><span className="text-muted-foreground">Piano:</span> <span className="font-medium">{selected.piano || "N/A"}</span></div>
                <div><span className="text-muted-foreground">Camera:</span> <span className="font-medium">{selected.camera_id || "Non assegnata"}</span></div>
              </div>
              {selected.bio && <p className="text-sm">{selected.bio}</p>}
              {selected.interessi.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selected.interessi.map((i) => <Badge key={i} variant="secondary" className="text-xs">{i}</Badge>)}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
