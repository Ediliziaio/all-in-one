import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { mockTickets, type SupportTicket } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const prioritaColors: Record<string, string> = {
  urgente: "bg-red-100 text-red-700 border-red-300",
  alta: "bg-orange-100 text-orange-700 border-orange-300",
  normale: "bg-yellow-100 text-yellow-700 border-yellow-300",
  bassa: "bg-muted text-muted-foreground",
};

const statoColors: Record<string, string> = {
  aperto: "bg-blue-100 text-blue-700",
  in_corso: "bg-yellow-100 text-yellow-700",
  risolto: "bg-green-100 text-green-700",
};

export default function AdminSupporto() {
  const [selected, setSelected] = useState<SupportTicket | null>(null);
  const { toast } = useToast();

  return (
    <div className="p-6 space-y-6">
      <h1 className="font-heading text-2xl font-bold">Supporto</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          {mockTickets.map((t) => (
            <Card
              key={t.id}
              className={`cursor-pointer transition-colors ${selected?.id === t.id ? "ring-2 ring-primary" : "hover:bg-muted/50"}`}
              onClick={() => setSelected(t)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-medium">{t.titolo}</p>
                  <p className="text-xs text-muted-foreground">{t.student_nome} · {t.created_at}</p>
                </div>
                <Badge variant="outline" className={prioritaColors[t.priorita]}>{t.priorita}</Badge>
                <Badge className={statoColors[t.stato]}>{t.stato.replace("_", " ")}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          {selected ? (
            <Card className="sticky top-6">
              <CardHeader><CardTitle className="text-base">{selected.titolo}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-2">
                  <p><span className="text-muted-foreground">Studente:</span> {selected.student_nome}</p>
                  <p><span className="text-muted-foreground">Categoria:</span> {selected.categoria}</p>
                  <p><span className="text-muted-foreground">Descrizione:</span> {selected.descrizione}</p>
                  {selected.risposta_admin && (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-xs font-medium text-green-700 mb-1">Risposta admin</p>
                      <p className="text-sm">{selected.risposta_admin}</p>
                    </div>
                  )}
                </div>
                <Textarea placeholder="Scrivi una risposta..." />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => toast({ title: "Risposta inviata!" })}>Rispondi</Button>
                  <Button size="sm" variant="outline" onClick={() => toast({ title: "Ticket chiuso" })}>Chiudi ticket</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="p-6 text-center text-muted-foreground">Seleziona un ticket per vedere i dettagli</Card>
          )}
        </div>
      </div>
    </div>
  );
}
