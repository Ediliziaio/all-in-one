import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, MessageSquare, Phone, Search, Send, Paperclip, Star, RotateCcw, CheckCircle2, Clock, Inbox } from "lucide-react";
import { currentUser, type SupportTicket, type TicketMessage } from "@/data/mockData";
import { loadAllTickets, saveAllTickets } from "@/data/ticketsStore";
import { useToast } from "@/hooks/use-toast";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/MotionWrappers";
import { cn } from "@/lib/utils";

const statoColors: Record<string, string> = {
  aperto: "bg-blue-100 text-blue-700 border-blue-200",
  in_corso: "bg-yellow-100 text-yellow-700 border-yellow-200",
  attesa_studente: "bg-orange-100 text-orange-700 border-orange-200",
  risolto: "bg-green-100 text-green-700 border-green-200",
};

const statoLabel: Record<string, string> = {
  aperto: "Aperto",
  in_corso: "In corso",
  attesa_studente: "In attesa tua",
  risolto: "Risolto",
};

const faqs = [
  { q: "Come connettermi al WiFi?", a: "Rete: 'Studentato-PD', password fornita al check-in. Se non funziona, riavvia il dispositivo o apri un ticket WiFi." },
  { q: "Il riscaldamento non funziona, cosa faccio?", a: "Controlla che il termostato in stanza sia attivo. Se il problema persiste, apri un ticket di Manutenzione con priorità alta." },
  { q: "Quando vengono fatte le pulizie?", a: "Aree comuni: lunedì, mercoledì e venerdì mattina. Per la tua stanza sei tu responsabile della pulizia." },
  { q: "Ho perso le chiavi della stanza, cosa faccio?", a: "Contatta subito lo staff via WhatsApp. La sostituzione costa 30€ e viene addebitata in fattura." },
  { q: "Quando devo pagare la rata?", a: "Entro il 5 di ogni mese tramite bonifico SEPA. Trovi tutti i dettagli nella sezione Pagamenti." },
];

function relTime(iso: string) {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: it });
  } catch {
    return iso;
  }
}

export default function Supporto() {
  // Load ALL tickets from shared localStorage store, display only current student's
  const [tickets, setTickets] = useState<SupportTicket[]>(() =>
    loadAllTickets().filter((t) => t.student_id === currentUser.id)
  );
  const [showForm, setShowForm] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"tutti" | "attivi" | "risolti">("tutti");
  const [reply, setReply] = useState("");

  // form state
  const [fCat, setFCat] = useState<SupportTicket["categoria"] | "">("");
  const [fTitolo, setFTitolo] = useState("");
  const [fDesc, setFDesc] = useState("");
  const [fPrio, setFPrio] = useState<SupportTicket["priorita"]>("normale");
  const [fAllegato, setFAllegato] = useState<string | null>(null);

  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selected = tickets.find((t) => t.id === selectedId) || null;

  const stats = useMemo(() => ({
    aperti: tickets.filter((t) => t.stato === "aperto").length,
    in_corso: tickets.filter((t) => t.stato === "in_corso").length,
    risolti: tickets.filter((t) => t.stato === "risolto").length,
  }), [tickets]);

  const filtered = useMemo(() => {
    return tickets
      .filter((t) => {
        if (filter === "attivi") return t.stato !== "risolto";
        if (filter === "risolti") return t.stato === "risolto";
        return true;
      })
      .filter((t) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return t.titolo.toLowerCase().includes(q) || t.descrizione.toLowerCase().includes(q);
      })
      .sort((a, b) => (b.updatedAt || b.created_at).localeCompare(a.updatedAt || a.created_at));
  }, [tickets, filter, search]);

  // Sync student tickets back into the shared store on every change
  // so AdminSupporto sees new tickets and replies in real time (next page load)
  useEffect(() => {
    const all = loadAllTickets();
    const others = all.filter((t) => t.student_id !== currentUser.id);
    saveAllTickets([...tickets, ...others]);
  }, [tickets]);

  useEffect(() => {
    if (selected && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [selected?.messages.length, selectedId]);

  // mark as read when opening
  useEffect(() => {
    if (!selectedId) return;
    setTickets((prev) => prev.map((t) => (t.id === selectedId ? { ...t, unreadForStudent: false } : t)));
  }, [selectedId]);

  const resetForm = () => {
    setFCat(""); setFTitolo(""); setFDesc(""); setFPrio("normale"); setFAllegato(null);
  };

  const handleCreate = () => {
    if (!fCat || !fTitolo.trim() || fDesc.trim().length < 30) {
      toast({ title: "Compila tutti i campi", description: "La descrizione deve essere di almeno 30 caratteri.", variant: "destructive" });
      return;
    }
    const now = new Date().toISOString();
    const newTicket: SupportTicket = {
      id: `t${Date.now()}`,
      student_id: currentUser.id,
      student_nome: `${currentUser.nome} ${currentUser.cognome}`,
      titolo: fTitolo.trim(),
      descrizione: fDesc.trim(),
      categoria: fCat,
      priorita: fPrio,
      stato: "aperto",
      created_at: now,
      updatedAt: now,
      unreadForAdmin: true,
      messages: [{
        id: `m${Date.now()}`,
        author: "studente",
        authorName: `${currentUser.nome} ${currentUser.cognome}`,
        text: fDesc.trim() + (fAllegato ? `\n📎 ${fAllegato}` : ""),
        createdAt: now,
      }],
    };
    setTickets((prev) => [newTicket, ...prev]);
    setShowForm(false);
    resetForm();
    toast({ title: "Ticket inviato!", description: "Riceverai una risposta entro 24 ore lavorative (Lun–Ven 9–17)." });
  };

  const handleSendReply = () => {
    if (!selected || !reply.trim()) return;
    const now = new Date().toISOString();
    const msg: TicketMessage = {
      id: `m${Date.now()}`,
      author: "studente",
      authorName: `${currentUser.nome} ${currentUser.cognome}`,
      text: reply.trim(),
      createdAt: now,
    };
    setTickets((prev) =>
      prev.map((t) =>
        t.id === selected.id
          ? { ...t, messages: [...t.messages, msg], updatedAt: now, unreadForAdmin: true, stato: t.stato === "risolto" ? "in_corso" : t.stato }
          : t
      )
    );
    setReply("");
  };

  const handleReopen = () => {
    if (!selected) return;
    setTickets((prev) => prev.map((t) => (t.id === selected.id ? { ...t, stato: "aperto", closedAt: undefined } : t)));
    toast({ title: "Ticket riaperto" });
  };

  const handleRate = (rating: number) => {
    if (!selected) return;
    setTickets((prev) => prev.map((t) => (t.id === selected.id ? { ...t, rating } : t)));
    toast({ title: "Grazie per la tua valutazione!" });
  };

  return (
    <PageTransition className="p-4 md:p-6 space-y-5 md:space-y-6">
      <FadeIn>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="font-heading text-xl md:text-2xl font-bold">Supporto</h1>
            <p className="text-sm text-muted-foreground">Apri un ticket o trova risposte rapide</p>
          </div>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" /> Nuovo ticket
          </Button>
        </div>
      </FadeIn>

      {/* Stats */}
      <FadeIn delay={0.05}>
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          <StatCard icon={<Inbox className="h-4 w-4" />} label="Aperti" value={stats.aperti} tone="blue" />
          <StatCard icon={<Clock className="h-4 w-4" />} label="In corso" value={stats.in_corso} tone="yellow" />
          <StatCard icon={<CheckCircle2 className="h-4 w-4" />} label="Risolti" value={stats.risolti} tone="green" />
        </div>
      </FadeIn>

      {/* FAQ */}
      <FadeIn delay={0.08}>
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

      {/* Search + filter */}
      <FadeIn delay={0.1}>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cerca nei tuoi ticket..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <TabsList className="grid grid-cols-3 w-full sm:w-auto">
              <TabsTrigger value="tutti">Tutti</TabsTrigger>
              <TabsTrigger value="attivi">Attivi</TabsTrigger>
              <TabsTrigger value="risolti">Risolti</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </FadeIn>

      {/* Lista ticket */}
      <FadeIn delay={0.12}>
        {filtered.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            <Inbox className="h-8 w-8 mx-auto mb-2 opacity-50" />
            {tickets.length === 0 ? "Non hai ancora aperto ticket" : "Nessun ticket trovato"}
          </Card>
        ) : (
          <StaggerContainer className="space-y-3">
            {filtered.map((t) => {
              const last = t.messages[t.messages.length - 1];
              const hasUnread = t.unreadForStudent;
              return (
                <StaggerItem key={t.id}>
                  <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Card className={cn("cursor-pointer transition-colors hover:bg-muted/30", hasUnread && "border-primary/40")} onClick={() => setSelectedId(t.id)}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          {hasUnread && <span className="mt-2 h-2 w-2 rounded-full bg-primary shrink-0" aria-label="Non letto" />}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <p className={cn("text-sm truncate", hasUnread ? "font-semibold" : "font-medium")}>{t.titolo}</p>
                              <Badge variant="outline" className={cn("shrink-0 text-xs", statoColors[t.stato])}>{statoLabel[t.stato]}</Badge>
                            </div>
                            {last && (
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                <span className="font-medium">{last.author === "studente" ? "Tu" : "Staff"}:</span> {last.text}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                              <span className="capitalize">{t.categoria}</span>
                              <span>·</span>
                              <span>{relTime(t.updatedAt || t.created_at)}</span>
                              {t.messages.length > 1 && (
                                <>
                                  <span>·</span>
                                  <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{t.messages.length}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </StaggerItem>
              );
            })}
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
              <p className="text-xs text-muted-foreground">Scrivici su WhatsApp — disponibili Lun–Ven 9:00–17:00</p>
            </div>
            <Button asChild className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
              <a href="https://wa.me/393923634188" target="_blank" rel="noopener noreferrer">
                <Phone className="h-4 w-4 mr-2" /> WhatsApp
              </a>
            </Button>
          </CardContent>
        </Card>
      </FadeIn>

      {/* New ticket dialog */}
      <Dialog open={showForm} onOpenChange={(o) => { setShowForm(o); if (!o) resetForm(); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Nuovo ticket</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Categoria *</Label>
              <Select value={fCat} onValueChange={(v) => setFCat(v as SupportTicket["categoria"])}>
                <SelectTrigger><SelectValue placeholder="Seleziona categoria" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="manutenzione">Manutenzione</SelectItem>
                  <SelectItem value="wifi">Wi-Fi</SelectItem>
                  <SelectItem value="pulizie">Pulizie</SelectItem>
                  <SelectItem value="altro">Altro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Titolo *</Label>
              <Input placeholder="Descrivi brevemente il problema" value={fTitolo} onChange={(e) => setFTitolo(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Descrizione * <span className="text-xs text-muted-foreground">({fDesc.length}/30 min)</span></Label>
              <Textarea placeholder="Descrivi il problema nel dettaglio..." rows={4} value={fDesc} onChange={(e) => setFDesc(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Priorità</Label>
              <RadioGroup value={fPrio} onValueChange={(v) => setFPrio(v as SupportTicket["priorita"])} className="flex flex-wrap gap-4">
                <div className="flex items-center gap-1.5"><RadioGroupItem value="normale" id="np" /><Label htmlFor="np" className="text-sm cursor-pointer">Normale</Label></div>
                <div className="flex items-center gap-1.5"><RadioGroupItem value="alta" id="ap" /><Label htmlFor="ap" className="text-sm cursor-pointer">Alta</Label></div>
                <div className="flex items-center gap-1.5"><RadioGroupItem value="urgente" id="up" /><Label htmlFor="up" className="text-sm cursor-pointer">Urgente</Label></div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label>Allegato (opzionale)</Label>
              <label className="flex items-center gap-2 px-3 py-2 border border-dashed rounded-md cursor-pointer hover:bg-muted/50 text-sm">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground truncate">{fAllegato || "Aggiungi una foto o un documento"}</span>
                <input type="file" className="hidden" onChange={(e) => setFAllegato(e.target.files?.[0]?.name || null)} />
              </label>
            </div>
          </div>
          <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <Button variant="ghost" onClick={() => { setShowForm(false); resetForm(); }}>Annulla</Button>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleCreate}>Invia richiesta</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail / chat dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelectedId(null)}>
        <DialogContent className="max-w-2xl p-0 gap-0 h-[90vh] sm:h-[80vh] flex flex-col">
          {selected && (
            <>
              <DialogHeader className="p-4 sm:p-5 border-b shrink-0">
                <DialogTitle className="text-base sm:text-lg pr-6">{selected.titolo}</DialogTitle>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="outline" className="capitalize text-xs">{selected.categoria}</Badge>
                  <Badge variant="outline" className="capitalize text-xs">Priorità: {selected.priorita}</Badge>
                  <Badge className={cn("text-xs", statoColors[selected.stato])}>{statoLabel[selected.stato]}</Badge>
                </div>
              </DialogHeader>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-muted/20">
                <AnimatePresence initial={false}>
                  {selected.messages.map((m) => {
                    const mine = m.author === "studente";
                    return (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn("flex gap-2", mine ? "justify-end" : "justify-start")}
                      >
                        {!mine && (
                          <Avatar className="h-7 w-7 shrink-0">
                            <AvatarFallback className="text-[10px] bg-green-100 text-green-700">S</AvatarFallback>
                          </Avatar>
                        )}
                        <div className={cn("max-w-[80%] rounded-2xl px-3 py-2 text-sm",
                          mine ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-background border rounded-bl-sm")}>
                          <p className="whitespace-pre-wrap break-words">{m.text}</p>
                          <p className={cn("text-[10px] mt-1", mine ? "text-primary-foreground/70" : "text-muted-foreground")}>
                            {m.authorName} · {relTime(m.createdAt)}
                          </p>
                        </div>
                        {mine && (
                          <Avatar className="h-7 w-7 shrink-0">
                            <AvatarFallback className="text-[10px]">{currentUser.nome[0]}</AvatarFallback>
                          </Avatar>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {selected.stato === "risolto" && (
                  <div className="pt-4 text-center space-y-2">
                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> Ticket chiuso
                    </p>
                    <div>
                      <p className="text-sm font-medium mb-2">Come è stato il supporto?</p>
                      <div className="flex justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button key={n} onClick={() => handleRate(n)} aria-label={`${n} stelle`}>
                            <Star className={cn("h-6 w-6 transition", (selected.rating || 0) >= n ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/40 hover:text-yellow-400")} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Composer */}
              <div className="border-t p-3 sm:p-4 shrink-0 bg-background">
                {selected.stato !== "risolto" ? (
                  <div className="flex gap-2 items-end">
                    <Textarea
                      placeholder="Scrivi un messaggio..."
                      rows={1}
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendReply(); } }}
                      className="min-h-[40px] max-h-32 resize-none"
                    />
                    <Button size="icon" onClick={handleSendReply} disabled={!reply.trim()} className="shrink-0">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full" onClick={handleReopen}>
                    <RotateCcw className="h-4 w-4 mr-2" /> Riapri ticket
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}

function StatCard({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: number; tone: "blue" | "yellow" | "green" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-100",
    green: "bg-green-50 text-green-700 border-green-100",
  };
  return (
    <Card className={cn("border", tones[tone])}>
      <CardContent className="p-3 md:p-4">
        <div className="flex items-center gap-2 text-xs md:text-sm font-medium">{icon}<span>{label}</span></div>
        <p className="text-xl md:text-2xl font-bold mt-1">{value}</p>
      </CardContent>
    </Card>
  );
}
