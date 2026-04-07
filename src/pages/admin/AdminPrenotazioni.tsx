import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { mockPrenotazioni, type Prenotazione } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const statoBadge: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confermata: "bg-green-100 text-green-700",
  rifiutata: "bg-red-100 text-red-700",
  conclusa: "bg-muted text-muted-foreground",
};

export default function AdminPrenotazioni() {
  const [selected, setSelected] = useState<Prenotazione | null>(null);
  const { toast } = useToast();

  const renderTable = (items: Prenotazione[]) => (
    <div className="divide-y">
      {items.length === 0 ? (
        <p className="p-6 text-center text-muted-foreground">Nessuna prenotazione</p>
      ) : items.map((p) => (
        <div key={p.id} className="flex items-center gap-4 p-4">
          <div className="flex-1">
            <p className="font-medium">{p.student_nome}</p>
            <p className="text-xs text-muted-foreground">{p.camera_nome}</p>
          </div>
          <p className="text-sm text-muted-foreground">{p.data_inizio} → {p.data_fine}</p>
          <Badge className={statoBadge[p.stato]}>{p.stato}</Badge>
          <div className="flex gap-1">
            {p.stato === "pending" && (
              <>
                <Button size="sm" variant="ghost" className="text-green-600" onClick={() => toast({ title: "Prenotazione confermata!" })}><Check className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" className="text-red-600" onClick={() => toast({ title: "Prenotazione rifiutata" })}><X className="h-4 w-4" /></Button>
              </>
            )}
            <Button size="sm" variant="outline" onClick={() => setSelected(p)}><Eye className="h-4 w-4" /></Button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="font-heading text-2xl font-bold">Prenotazioni</h1>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">In Attesa <Badge variant="secondary" className="ml-1.5 text-xs">{mockPrenotazioni.filter(p => p.stato === "pending").length}</Badge></TabsTrigger>
          <TabsTrigger value="confermata">Confermate</TabsTrigger>
          <TabsTrigger value="conclusa">Concluse</TabsTrigger>
          <TabsTrigger value="rifiutata">Rifiutate</TabsTrigger>
        </TabsList>
        {["pending", "confermata", "conclusa", "rifiutata"].map((stato) => (
          <TabsContent key={stato} value={stato}>
            <Card>{renderTable(mockPrenotazioni.filter(p => p.stato === stato))}</Card>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Dettaglio Prenotazione</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-muted-foreground">Studente:</span> <span className="font-medium">{selected.student_nome}</span></div>
                <div><span className="text-muted-foreground">Camera:</span> <span className="font-medium">{selected.camera_nome}</span></div>
                <div><span className="text-muted-foreground">Check-in:</span> {selected.data_inizio}</div>
                <div><span className="text-muted-foreground">Check-out:</span> {selected.data_fine}</div>
                <div><span className="text-muted-foreground">Stato:</span> <Badge className={statoBadge[selected.stato]}>{selected.stato}</Badge></div>
                <div><span className="text-muted-foreground">Richiesta:</span> {selected.created_at}</div>
              </div>
              {selected.note && <div><span className="text-muted-foreground">Note:</span> {selected.note}</div>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
