import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Tag } from "lucide-react";
import { mockBuoni } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const categories = ["Tutte", "Cibo", "Sport", "Libri", "Divertimento", "Servizi"];

export default function Buoni() {
  const [cat, setCat] = useState("Tutte");
  const { toast } = useToast();

  const filtered = mockBuoni.filter((b) => b.attivo && (cat === "Tutte" || b.categoria === cat));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">I tuoi vantaggi esclusivi</h1>
        <p className="text-sm text-muted-foreground">Sconti e offerte per gli studenti dello studentato</p>
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

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Nessun buono in questa categoria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b) => (
            <Card key={b.id} className="hover:shadow-lg transition-shadow">
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
          ))}
        </div>
      )}
    </div>
  );
}
