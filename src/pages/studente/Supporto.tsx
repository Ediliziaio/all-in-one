import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Eye, MessageSquare, Phone } from "lucide-react";
import { mockTickets, currentUser, type SupportTicket } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/MotionWrappers";

const statoColors: Record<string, string> = {
  aperto: "bg-blue-100 text-blue-700",
  in_corso: "bg-yellow-100 text-yellow-700",
  risolto: "bg-green-100 text-green-700",
};

const faqs = [
  { q: "Come connettermi al WiFi?", a: "Rete: 'Studentato-PD', password fornita al check-in. Se non funziona, riavvia il dispositivo o apri un ticket WiFi." },
  { q: "Il riscaldamento non funziona, cosa faccio?", a: "Controlla che il termostato in stanza sia attivo. Se il problema persiste, apri un ticket di Manutenzione con priorità alta." },
  { q: "Quando vengono fatte le pulizie?", a: "Aree comuni: lunedì, mercoledì e venerdì mattina. Bagni privati: ogni due settimane su prenotazione." },
  { q: "Ho perso le chiavi della stanza, cosa faccio?", a: "Contatta subito la reception via WhatsApp. La sostituzione costa 30€ e viene addebitata in fattura." },
  { q: "Quando devo pagare la rata?", a: "Entro il 5 di ogni mese tramite bonifico SEPA. Trovi tutti i dettagli nella sezione Pagamenti." },
];

export default function Supporto() {
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<SupportTicket | null>(null);
  const { toast } = useToast();
  const myTickets = mockTickets.filter((t) => t.student_id === currentUser.id);

  return (
    <PageTransition className="p-4 md:p-6 space-y-5 md:space-y-6">
      <FadeIn>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="font-heading text-xl md:text-2xl font-bold">Supporto</h1>
            <p className="text-sm text-muted-foreground">Trova risposte rapide o apri un ticket</p>
          </div>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" /> Nuova richiesta
          </Button>
        </div>
      </FadeIn>

      {/* FAQ */}
      <FadeIn delay={0.05}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg">Domande frequenti</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-sm text-left">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Form ticket */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="p-4 md:p-5 space-y-4">
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
                  <RadioGroup defaultValue="normale" className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-1.5"><RadioGroupItem value="normale" id="norm" /><Label htmlFor="norm" className="text-sm">Normale</Label></div>
                    <div className="flex items-center gap-1.5"><RadioGroupItem value="alta" id="alta" /><Label htmlFor="alta" className="text-sm">Alta</Label></div>
                    <div className="flex items-center gap-1.5"><RadioGroupItem value="urgente" id="urg" /><Label htmlFor="urg" className="text-sm">Urgente</Label></div>
                  </RadioGroup>
                </div>
                <div className="flex flex-col-reverse sm:flex-row gap-2">
                  <Button variant="ghost" onClick={() => setShowForm(false)} className="sm:w-auto">Annulla</Button>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 sm:flex-1" onClick={() => { setShowForm(false); toast({ title: "Ticket inviato!" }); }}>Invia Richiesta</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista ticket */}
      <FadeIn delay={0.1}>
        <h2 className="font-heading font-semibold mb-3">I miei ticket</h2>
        {myTickets.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">Non hai ticket aperti</Card>
        ) : (
          <StaggerContainer className="space-y-3">
            {myTickets.map((t) => (
              <StaggerItem key={t.id}>
                <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className="cursor-pointer" onClick={() => setSelected(t)}>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{t.titolo}</p>
                          <p className="text-xs text-muted-foreground capitalize">{t.categoria} · {t.created_at}</p>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-2">
                          <Badge className={statoColors[t.stato]}>{t.stato.replace("_", " ")}</Badge>
                          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setSelected(t); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </FadeIn>

      {/* WhatsApp CTA */}
      <FadeIn delay={0.2}>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center shrink-0">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">Hai bisogno subito di aiuto?</p>
              <p className="text-xs text-muted-foreground">Scrivici su WhatsApp, rispondiamo entro 30 minuti</p>
            </div>
            <Button asChild className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
              <a href="https://wa.me/393331234567" target="_blank" rel="noopener noreferrer">
                <Phone className="h-4 w-4 mr-2" /> WhatsApp
              </a>
            </Button>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Detail dialog con timeline */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{selected?.titolo}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="capitalize">{selected.categoria}</Badge>
                <Badge variant="outline" className="capitalize">Priorità: {selected.priorita}</Badge>
                <Badge className={statoColors[selected.stato]}>{selected.stato.replace("_", " ")}</Badge>
              </div>

              {/* Timeline */}
              <div className="space-y-3 border-l-2 border-muted pl-4 ml-2">
                {/* Studente msg */}
                <div className="relative">
                  <div className="absolute -left-[1.4rem] top-1 h-3 w-3 rounded-full bg-primary border-2 border-background" />
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px]">{currentUser.nome[0]}</AvatarFallback></Avatar>
                    <span className="text-xs font-medium">Tu</span>
                    <span className="text-xs text-muted-foreground">· {selected.created_at}</span>
                  </div>
                  <p className="bg-muted/60 rounded-lg p-3">{selected.descrizione}</p>
                </div>

                {/* Admin reply */}
                {selected.risposta_admin && (
                  <div className="relative">
                    <div className="absolute -left-[1.4rem] top-1 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px] bg-green-100 text-green-700">S</AvatarFallback></Avatar>
                      <span className="text-xs font-medium">Staff</span>
                    </div>
                    <p className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-900">{selected.risposta_admin}</p>
                  </div>
                )}
              </div>

              {/* Replica */}
              {selected.stato !== "risolto" && (
                <div className="space-y-2 pt-2 border-t">
                  <Textarea placeholder="Aggiungi un messaggio..." rows={2} />
                  <Button size="sm" className="w-full sm:w-auto" onClick={() => { toast({ title: "Risposta inviata" }); setSelected(null); }}>Invia risposta</Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
