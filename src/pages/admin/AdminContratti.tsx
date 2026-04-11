import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { mockContratti, type Contratto } from "@/data/mockData";
import { toast } from "sonner";
import { PageTransition, FadeIn } from "@/components/motion/MotionWrappers";

const statoBadge: Record<string, string> = {
  attivo: "bg-green-100 text-green-700",
  in_scadenza: "bg-yellow-100 text-yellow-700",
  scaduto: "bg-red-100 text-red-700",
  disdetto: "bg-muted text-muted-foreground",
};

const statoLabel: Record<string, string> = {
  attivo: "Attivo",
  in_scadenza: "In Scadenza",
  scaduto: "Scaduto",
  disdetto: "Disdetto",
};

export default function AdminContratti() {
  const [selected, setSelected] = useState<Contratto | null>(null);

  const renderTable = (items: Contratto[]) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-muted-foreground">
            <th className="text-left py-3 px-4 font-medium">Studente</th>
            <th className="text-left py-3 px-4 font-medium">Camera</th>
            <th className="text-left py-3 px-4 font-medium">Periodo</th>
            <th className="text-left py-3 px-4 font-medium">Canone</th>
            <th className="text-left py-3 px-4 font-medium">Stato</th>
            <th className="text-left py-3 px-4 font-medium">Azioni</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c, i) => (
            <FadeIn key={c.id} delay={i * 0.05}>
              <tr className="border-b hover:bg-muted/50 transition-colors">
                <td className="py-3 px-4 font-medium">{c.student_nome}</td>
                <td className="py-3 px-4">{c.camera_nome}</td>
                <td className="py-3 px-4">{c.data_inizio} → {c.data_fine}</td>
                <td className="py-3 px-4">€{c.canone_mensile}/mese</td>
                <td className="py-3 px-4">
                  <Badge className={statoBadge[c.stato]}>{statoLabel[c.stato]}</Badge>
                </td>
                <td className="py-3 px-4">
                  <Button size="sm" variant="ghost" onClick={() => setSelected(c)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            </FadeIn>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={6} className="py-8 text-center text-muted-foreground">
                Nessun contratto in questa categoria
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <PageTransition>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Contratti di Affitto</h1>
          <p className="text-muted-foreground">Gestisci i contratti firmati dagli studenti</p>
        </div>

        <Tabs defaultValue="tutti">
          <TabsList>
            <TabsTrigger value="tutti">Tutti ({mockContratti.length})</TabsTrigger>
            <TabsTrigger value="attivo">Attivi ({mockContratti.filter(c => c.stato === "attivo").length})</TabsTrigger>
            <TabsTrigger value="in_scadenza">In Scadenza ({mockContratti.filter(c => c.stato === "in_scadenza").length})</TabsTrigger>
            <TabsTrigger value="scaduto">Scaduti ({mockContratti.filter(c => c.stato === "scaduto").length})</TabsTrigger>
            <TabsTrigger value="disdetto">Disdetti ({mockContratti.filter(c => c.stato === "disdetto").length})</TabsTrigger>
          </TabsList>

          <TabsContent value="tutti">
            <Card>{renderTable(mockContratti)}</Card>
          </TabsContent>
          <TabsContent value="attivo">
            <Card>{renderTable(mockContratti.filter(c => c.stato === "attivo"))}</Card>
          </TabsContent>
          <TabsContent value="in_scadenza">
            <Card>{renderTable(mockContratti.filter(c => c.stato === "in_scadenza"))}</Card>
          </TabsContent>
          <TabsContent value="scaduto">
            <Card>{renderTable(mockContratti.filter(c => c.stato === "scaduto"))}</Card>
          </TabsContent>
          <TabsContent value="disdetto">
            <Card>{renderTable(mockContratti.filter(c => c.stato === "disdetto"))}</Card>
          </TabsContent>
        </Tabs>

        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dettaglio Contratto</DialogTitle>
            </DialogHeader>
            {selected && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Studente</p>
                    <p className="font-medium">{selected.student_nome}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Camera</p>
                    <p className="font-medium">{selected.camera_nome}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Inizio Contratto</p>
                    <p className="font-medium">{selected.data_inizio}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Fine Contratto</p>
                    <p className="font-medium">{selected.data_fine}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Canone Mensile</p>
                    <p className="font-medium">€{selected.canone_mensile}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Stato</p>
                    <Badge className={statoBadge[selected.stato]}>{statoLabel[selected.stato]}</Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Data Firma</p>
                    <p className="font-medium">{selected.data_firma}</p>
                  </div>
                </div>
                <Button className="w-full" onClick={() => toast.success("Download avviato (demo)")}>
                  <Download className="h-4 w-4 mr-2" />
                  Scarica Contratto
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}
