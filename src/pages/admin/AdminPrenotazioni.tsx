import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { mockRichieste, type RichiestaAffitto } from "@/data/mockData";
import { toast } from "sonner";
import { PageTransition, FadeIn } from "@/components/motion/MotionWrappers";

const statoBadge: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approvata: "bg-green-100 text-green-700",
  rifiutata: "bg-red-100 text-red-700",
  conclusa: "bg-muted text-muted-foreground",
};

export default function AdminPrenotazioni() {
  const [richieste, setRichieste] = useState(mockRichieste);
  const [selected, setSelected] = useState<RichiestaAffitto | null>(null);

  const updateStato = (id: string, newStato: RichiestaAffitto["stato"]) => {
    setRichieste((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stato: newStato } : p))
    );
    toast.success(newStato === "approvata" ? "Richiesta approvata!" : "Richiesta rifiutata");
  };

  const renderTable = (items: RichiestaAffitto[]) => (
    <div className="divide-y">
      {items.length === 0 ? (
        <p className="p-6 text-center text-muted-foreground">Nessuna richiesta</p>
      ) : items.map((p) => (
        <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
          <div className="flex-1">
            <p className="font-medium">{p.student_nome}</p>
            <p className="text-xs text-muted-foreground">{p.camera_nome}</p>
          </div>
          <p className="text-sm text-muted-foreground hidden sm:block">{p.data_inizio} → {p.data_fine}</p>
          <Badge className={statoBadge[p.stato]}>{p.stato}</Badge>
          <div className="flex gap-1">
            {p.stato === "pending" && (
              <>
                <Button size="sm" variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => updateStato(p.id, "approvata")}><Check className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => updateStato(p.id, "rifiutata")}><X className="h-4 w-4" /></Button>
              </>
            )}
            <Button size="sm" variant="outline" onClick={() => setSelected(p)}><Eye className="h-4 w-4" /></Button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <PageTransition className="p-6 space-y-6">
      <FadeIn><h1 className="font-heading text-2xl font-bold">Richieste di Affitto</h1></FadeIn>

      <FadeIn delay={0.1}>
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">In Attesa <Badge variant="secondary" className="ml-1.5 text-xs">{richieste.filter(p => p.stato === "pending").length}</Badge></TabsTrigger>
            <TabsTrigger value="approvata">Approvate</TabsTrigger>
            <TabsTrigger value="conclusa">Concluse</TabsTrigger>
            <TabsTrigger value="rifiutata">Rifiutate</TabsTrigger>
          </TabsList>
          {["pending", "approvata", "conclusa", "rifiutata"].map((stato) => (
            <TabsContent key={stato} value={stato}>
              <Card>{renderTable(richieste.filter(p => p.stato === stato))}</Card>
            </TabsContent>
          ))}
        </Tabs>
      </FadeIn>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Dettaglio Richiesta</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-muted-foreground">Studente:</span> <span className="font-medium">{selected.student_nome}</span></div>
                <div><span className="text-muted-foreground">Camera:</span> <span className="font-medium">{selected.camera_nome}</span></div>
                <div><span className="text-muted-foreground">Inizio contratto:</span> {selected.data_inizio}</div>
                <div><span className="text-muted-foreground">Fine contratto:</span> {selected.data_fine}</div>
                <div><span className="text-muted-foreground">Stato:</span> <Badge className={statoBadge[selected.stato]}>{selected.stato}</Badge></div>
                <div><span className="text-muted-foreground">Richiesta:</span> {selected.created_at}</div>
              </div>
              {selected.note && <div><span className="text-muted-foreground">Note:</span> {selected.note}</div>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
