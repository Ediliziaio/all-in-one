import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, FileText, BookOpen, Smartphone, PiggyBank, Bike, BookX } from "lucide-react";
import { mockGuide, type Guida } from "@/data/mockData";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem, HoverCard } from "@/components/motion/MotionWrappers";

const iconMap: Record<string, React.ElementType> = { FileText, BookOpen, Smartphone, PiggyBank, Bike };
const categories = ["Tutte", "Burocrazia", "Università", "Vita in Città", "Risparmio", "Trasporti"];

export default function Guide() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("Tutte");
  const [selected, setSelected] = useState<Guida | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const filtered = mockGuide.filter((g) =>
    g.attiva && (cat === "Tutte" || g.categoria === cat) && g.titolo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageTransition className="p-6 space-y-6">
      <FadeIn>
        <h1 className="font-heading text-2xl font-bold">Le tue guide essenziali</h1>
        <p className="text-sm text-muted-foreground">Tutto quello che devi sapere per sopravvivere a Padova</p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cerca guida..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
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
        </div>
      </FadeIn>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-5 space-y-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <BookX className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
              <p className="font-heading font-semibold text-foreground">Nessuna guida trovata</p>
              <p className="text-sm text-muted-foreground mt-1">Prova a cercare con termini diversi o cambia categoria.</p>
            </div>
          ) : filtered.map((g) => {
            const Icon = iconMap[g.icona] || FileText;
            return (
              <StaggerItem key={g.id}>
                <HoverCard>
                  <Card className="cursor-pointer" onClick={() => setSelected(g)}>
                    <CardContent className="p-5 space-y-3">
                      <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-heading font-semibold">{g.titolo}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{g.contenuto}</p>
                      </div>
                      <Badge variant="outline">{g.categoria}</Badge>
                    </CardContent>
                  </Card>
                </HoverCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      )}

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{selected?.titolo}</DialogTitle></DialogHeader>
          <Badge variant="outline" className="w-fit">{selected?.categoria}</Badge>
          <p className="text-sm leading-relaxed">{selected?.contenuto}</p>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
