import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Eye } from "lucide-react";
import { mockTickets, currentUser, type SupportTicket } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/MotionWrappers";

const statoColors: Record<string, string> = {
  aperto: "bg-blue-100 text-blue-700",
  in_corso: "bg-yellow-100 text-yellow-700",
  risolto: "bg-green-100 text-green-700",
};

export default function Supporto() {
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<SupportTicket | null>(null);
  const { toast } = useToast();
  const myTickets = mockTickets.filter((t) => t.student_id === currentUser.id);

  return (
    <PageTransition className="p-6 space-y-6">
      <FadeIn>
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold">Supporto</h1>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" /> Nuova richiesta
          </Button>
        </div>
      </FadeIn>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="p-5 space-y-4">
                <h2 className="font-heading font-semibold">Nuovo Ticket</h2>
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Seleziona categoria" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manutenzione">Manutenzione</SelectItem>
                      <SelectItem value="wifi">Wi-Fi</SelectItem>
                      <SelectItem value="pulizie">Pulizie</SelectItem>
                      <SelectItem value="altro">Altro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Titolo</Label><Input placeholder="Descrivi brevemente il problema" /></div>
                <div className="space-y-2"><Label>Descrizione</Label><Textarea placeholder="Descrivi il problema nel dettaglio (min. 30 caratteri)" rows={4} /></div>
                <div className="space-y-2">
                  <Label>Priorità</Label>
                  <RadioGroup defaultValue="normale" className="flex gap-4">
                    <div className="flex items-center gap-1.5"><RadioGroupItem value="normale" id="norm" /><Label htmlFor="norm" className="text-sm">Normale</Label></div>
                    <div className="flex items-center gap-1.5"><RadioGroupItem value="alta" id="alta" /><Label htmlFor="alta" className="text-sm">Alta</Label></div>
                    <div className="flex items-center gap-1.5"><RadioGroupItem value="urgente" id="urg" /><Label htmlFor="urg" className="text-sm">Urgente</Label></div>
                  </RadioGroup>
                </div>
                <div className="flex gap-2">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => { setShowForm(false); toast({ title: "Ticket inviato!" }); }}>Invia Richiesta</Button>
                  <Button variant="ghost" onClick={() => setShowForm(false)}>Annulla</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <FadeIn delay={0.1}>
        <h2 className="font-heading font-semibold mb-3">I miei ticket</h2>
        {myTickets.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">Non hai ticket aperti</Card>
        ) : (
          <StaggerContainer className="space-y-3">
            {myTickets.map((t) => (
              <StaggerItem key={t.id}>
                <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="flex-1">
                        <p className="font-medium">{t.titolo}</p>
                        <p className="text-xs text-muted-foreground">{t.categoria} · {t.created_at}</p>
                      </div>
                      <Badge className={statoColors[t.stato]}>{t.stato.replace("_", " ")}</Badge>
                      <Button variant="outline" size="sm" onClick={() => setSelected(t)}><Eye className="h-4 w-4" /></Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </FadeIn>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{selected?.titolo}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <p><span className="text-muted-foreground">Categoria:</span> {selected.categoria}</p>
              <p><span className="text-muted-foreground">Priorità:</span> {selected.priorita}</p>
              <p><span className="text-muted-foreground">Stato:</span> <Badge className={statoColors[selected.stato]}>{selected.stato.replace("_", " ")}</Badge></p>
              <p>{selected.descrizione}</p>
              {selected.risposta_admin && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs font-medium text-green-700 mb-1">Risposta dello staff</p>
                  <p>{selected.risposta_admin}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
