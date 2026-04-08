import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, Gift } from "lucide-react";
import { mockBuoni } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem, HoverCard } from "@/components/motion/MotionWrappers";

const categories = ["Tutte", "Cibo", "Sport", "Libri", "Divertimento", "Servizi"];

export default function Buoni() {
  const [cat, setCat] = useState("Tutte");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const filtered = mockBuoni.filter((b) => b.attivo && (cat === "Tutte" || b.categoria === cat));

  return (
    <PageTransition className="p-6 space-y-6">
      <FadeIn>
        <h1 className="font-heading text-2xl font-bold">I tuoi vantaggi esclusivi</h1>
        <p className="text-sm text-muted-foreground">Sconti e offerte per gli studenti dello studentato</p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Badge
              key={c}
              variant={cat === c ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${cat === c ? "bg-primary text-primary-foreground" : ""}`}
              onClick={() => setCat(c)}
            >
              {c}
            </Badge>
          ))}
        </div>
      </FadeIn>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-14 w-14 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-16 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-20 rounded-full" />
                  <Skeleton className="h-8 w-28 rounded-lg" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <FadeIn>
          <div className="text-center py-12">
            <Gift className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
            <p className="font-heading font-semibold text-foreground">Nessun buono in questa categoria</p>
            <p className="text-sm text-muted-foreground mt-1">Prova a selezionare un'altra categoria per scoprire nuove offerte.</p>
          </div>
        </FadeIn>
      ) : (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b) => (
            <StaggerItem key={b.id}>
              <HoverCard>
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={b.logo_url} alt={b.nome_esercizio} className="h-14 w-14 rounded-xl object-cover" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-heading font-semibold">{b.nome_esercizio}</p>
                          {b.nuovo && <Badge className="bg-accent text-accent-foreground text-xs">NUOVO</Badge>}
                        </div>
                        <Badge variant="outline" className="text-xs">{b.categoria}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{b.descrizione}</p>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-primary text-primary-foreground text-lg px-4 py-1">{b.sconto}</Badge>
                      <button
                        onClick={() => { navigator.clipboard.writeText(b.codice); toast({ title: "Codice copiato!", description: b.codice }); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm hover:bg-muted transition-colors"
                      >
                        <Copy className="h-3 w-3" /> {b.codice}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">Valido fino al {b.scadenza}</p>
                  </CardContent>
                </Card>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </PageTransition>
  );
}
