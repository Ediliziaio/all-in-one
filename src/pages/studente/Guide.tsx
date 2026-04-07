import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, FileText, BookOpen, Smartphone, PiggyBank, Bike } from "lucide-react";
import { mockGuide, type Guida } from "@/data/mockData";

const iconMap: Record<string, React.ElementType> = {
  FileText, BookOpen, Smartphone, PiggyBank, Bike,
};

const categories = ["Tutte", "Burocrazia", "Università", "Vita in Città", "Risparmio", "Trasporti"];

export default function Guide() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("Tutte");
  const [selected, setSelected] = useState<Guida | null>(null);

  const filtered = mockGuide.filter((g) =>
    g.attiva &&
    (cat === "Tutte" || g.categoria === cat) &&
    g.titolo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Le tue guide essenziali</h1>
        <p className="text-sm text-muted-foreground">Tutto quello che devi sapere per sopravvivere a Padova</p>
      </div>

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
              className={`cursor-pointer ${cat === c ? "bg-primary text-primary-foreground" : ""}`}
              onClick={() => setCat(c)}
            >
              {c}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">Nessuna guida trovata</div>
        ) : filtered.map((g) => {
          const Icon = iconMap[g.icona] || FileText;
          return (
            <Card key={g.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelected(g)}>
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
          );
        })}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{selected?.titolo}</DialogTitle></DialogHeader>
          <Badge variant="outline" className="w-fit">{selected?.categoria}</Badge>
          <p className="text-sm leading-relaxed">{selected?.contenuto}</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
