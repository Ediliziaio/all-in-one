import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Copy } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { mockBuoni } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

export default function AdminBuoni() {
  const { toast } = useToast();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Buoni Sconto</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90"><Plus className="h-4 w-4 mr-2" />Aggiungi Buono</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nuovo Buono Sconto</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-2"><Label>Nome esercizio</Label><Input placeholder="Pizzeria da Mario" /></div>
              <div className="space-y-2"><Label>Descrizione</Label><Textarea placeholder="Descrizione dell'offerta..." /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Codice sconto</Label><Input placeholder="STUD15" /></div>
                <div className="space-y-2"><Label>Sconto</Label><Input placeholder="15%" /></div>
              </div>
              <div className="space-y-2"><Label>Scadenza</Label><Input type="date" /></div>
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => toast({ title: "Buono aggiunto!" })}>Salva</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockBuoni.map((b) => (
          <Card key={b.id} className="overflow-hidden">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <img src={b.logo_url} alt={b.nome_esercizio} className="h-12 w-12 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-heading font-semibold">{b.nome_esercizio}</p>
                  <Badge variant="outline">{b.categoria}</Badge>
                </div>
                {b.nuovo && <Badge className="bg-accent text-accent-foreground">NUOVO</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">{b.descrizione}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary text-primary-foreground text-lg px-3">{b.sconto}</Badge>
                  <button onClick={() => { navigator.clipboard.writeText(b.codice); toast({ title: "Codice copiato!" }); }} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                    <Copy className="h-3 w-3" />{b.codice}
                  </button>
                </div>
                <Switch defaultChecked={b.attivo} />
              </div>
              <p className="text-xs text-muted-foreground">Scade: {b.scadenza}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
