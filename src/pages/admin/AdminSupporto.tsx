import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Search, Send, MessageSquare, Inbox, Clock, CheckCircle2, Timer, MoreVertical, Zap, X, List, Kanban } from "lucide-react";
import { mockTickets as initialTickets, mockProfiles, type SupportTicket, type TicketMessage } from "@/data/mockData";
import { toast } from "sonner";
import { PageTransition, FadeIn } from "@/components/motion/MotionWrappers";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

const prioritaColors: Record<string, string> = {
  urgente: "bg-red-100 text-red-700 border-red-200",
  alta: "bg-orange-100 text-orange-700 border-orange-200",
  normale: "bg-yellow-100 text-yellow-700 border-yellow-200",
  bassa: "bg-muted text-muted-foreground border-border",
};

const prioritaBar: Record<string, string> = {
  urgente: "bg-red-500",
  alta: "bg-orange-500",
  normale: "bg-yellow-500",
  bassa: "bg-muted-foreground/40",
};

const statoColors: Record<string, string> = {
  aperto: "bg-blue-100 text-blue-700 border-blue-200",
  in_corso: "bg-yellow-100 text-yellow-700 border-yellow-200",
  attesa_studente: "bg-violet-100 text-violet-700 border-violet-200",
  risolto: "bg-green-100 text-green-700 border-green-200",
};

const statoLabel: Record<string, string> = {
  aperto: "Aperto",
  in_corso: "In corso",
  attesa_studente: "Attesa studente",
  risolto: "Risolto",
};

const pipelineStages: { key: SupportTicket["stato"]; label: string; dot: string; bg: string }[] = [
  { key: "aperto", label: "Nuovo", dot: "bg-blue-500", bg: "bg-blue-50/60" },
  { key: "in_corso", label: "In lavorazione", dot: "bg-yellow-500", bg: "bg-yellow-50/60" },
  { key: "attesa_studente", label: "Attesa studente", dot: "bg-violet-500", bg: "bg-violet-50/60" },
  { key: "risolto", label: "Risolto", dot: "bg-green-500", bg: "bg-green-50/60" },
];

const quickReplies = [
  "Ciao, abbiamo ricevuto la tua segnalazione e la stiamo verificando. Ti aggiorniamo a breve.",
  "Abbiamo programmato l'intervento del tecnico. Ti contatteremo per concordare l'orario.",
  "Il problema è stato risolto. Fammi sapere se va tutto bene.",
  "Ci servono ulteriori informazioni: puoi inviarci una foto del problema?",
  "Ci scusiamo per il disagio. Ce ne occupiamo subito con priorità.",
];

function relTime(iso: string) {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: it });
  } catch {
    return iso;
  }
}

type SortKey = "recenti" | "vecchi" | "priorita";

const priorityOrder: Record<string, number> = { urgente: 0, alta: 1, normale: 2, bassa: 3 };

export default function AdminSupporto() {
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [search, setSearch] = useState("");
  const [fStato, setFStato] = useState<string>("all");
  const [fPrio, setFPrio] = useState<string>("all");
  const [fCat, setFCat] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("recenti");
  const [view, setView] = useState<"lista" | "pipeline">(() => {
    if (typeof window === "undefined") return "lista";
    return (localStorage.getItem("admin_supporto_view") as "lista" | "pipeline") || "lista";
  });
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
  );

  useEffect(() => {
    localStorage.setItem("admin_supporto_view", view);
  }, [view]);

  const selected = tickets.find((t) => t.id === selectedId) || null;

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    return {
      aperti: tickets.filter((t) => t.stato === "aperto").length,
      in_corso: tickets.filter((t) => t.stato === "in_corso").length,
      risolti_oggi: tickets.filter((t) => t.stato === "risolto" && t.closedAt && new Date(t.closedAt).toDateString() === today).length,
      tempo_medio: "2h 30m",
    };
  }, [tickets]);

  const filtered = useMemo(() => {
    let list = tickets.filter((t) => {
      if (fStato !== "all" && t.stato !== fStato) return false;
      if (fPrio !== "all" && t.priorita !== fPrio) return false;
      if (fCat !== "all" && t.categoria !== fCat) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!t.titolo.toLowerCase().includes(q) && !t.student_nome.toLowerCase().includes(q) && !t.descrizione.toLowerCase().includes(q)) return false;
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === "priorita") return priorityOrder[a.priorita] - priorityOrder[b.priorita];
      const aT = a.updatedAt || a.created_at;
      const bT = b.updatedAt || b.created_at;
      return sort === "recenti" ? bT.localeCompare(aT) : aT.localeCompare(bT);
    });
    return list;
  }, [tickets, fStato, fPrio, fCat, search, sort]);

  useEffect(() => {
    if (selected && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [selected?.messages.length, selectedId]);

  // mark read for admin on open
  useEffect(() => {
    if (!selectedId) return;
    setTickets((prev) => prev.map((t) => (t.id === selectedId ? { ...t, unreadForAdmin: false } : t)));
  }, [selectedId]);

  const handleSend = () => {
    if (!selected || !reply.trim()) return;
    const now = new Date().toISOString();
    const msg: TicketMessage = {
      id: `m${Date.now()}`,
      author: "admin",
      authorName: "Staff",
      text: reply.trim(),
      createdAt: now,
    };
    setTickets((prev) =>
      prev.map((t) =>
        t.id === selected.id
          ? { ...t, messages: [...t.messages, msg], updatedAt: now, stato: t.stato === "aperto" ? "in_corso" : t.stato, unreadForStudent: true, risposta_admin: reply.trim() }
          : t
      )
    );
    setReply("");
    toast.success("Risposta inviata");
  };

  const handleChangeStato = (stato: SupportTicket["stato"]) => {
    if (!selected) return;
    setTickets((prev) =>
      prev.map((t) =>
        t.id === selected.id
          ? { ...t, stato, closedAt: stato === "risolto" ? new Date().toISOString() : undefined, updatedAt: new Date().toISOString() }
          : t
      )
    );
    toast.success(`Stato cambiato in ${statoLabel[stato]}`);
  };

  const handleChangePrio = (priorita: SupportTicket["priorita"]) => {
    if (!selected) return;
    setTickets((prev) => prev.map((t) => (t.id === selected.id ? { ...t, priorita } : t)));
    toast.success(`Priorità cambiata in ${priorita}`);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setDraggingId(null);
    const ticketId = e.active.id as string;
    const newStato = e.over?.id as SupportTicket["stato"] | undefined;
    if (!newStato) return;
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket || ticket.stato === newStato) return;
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, stato: newStato, closedAt: newStato === "risolto" ? new Date().toISOString() : t.closedAt, updatedAt: new Date().toISOString() }
          : t,
      ),
    );
    toast.success(`Ticket spostato in ${statoLabel[newStato]}`);
  };

  const draggingTicket = draggingId ? tickets.find((t) => t.id === draggingId) || null : null;

  const studentProfile = selected ? mockProfiles.find((p) => p.id === selected.student_id) : null;

  const detailPanel = selected && (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b p-4 shrink-0 space-y-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            {studentProfile?.avatar && <AvatarImage src={studentProfile.avatar} alt={selected.student_nome} />}
            <AvatarFallback>{selected.student_nome[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{selected.titolo}</h3>
            <p className="text-xs text-muted-foreground truncate">{selected.student_nome} · {studentProfile?.camera_id || "—"}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0"><MoreVertical className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Cambia stato</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleChangeStato("aperto")}>Aperto</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleChangeStato("in_corso")}>In corso</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleChangeStato("risolto")}>Risolto</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Cambia priorità</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleChangePrio("urgente")}>Urgente</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleChangePrio("alta")}>Alta</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleChangePrio("normale")}>Normale</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleChangePrio("bassa")}>Bassa</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {isMobile && (
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => setSelectedId(null)}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline" className={cn("text-xs", statoColors[selected.stato])}>{statoLabel[selected.stato]}</Badge>
          <Badge variant="outline" className={cn("text-xs capitalize", prioritaColors[selected.priorita])}>Priorità {selected.priorita}</Badge>
          <Badge variant="outline" className="text-xs capitalize">{selected.categoria}</Badge>
          {selected.rating && (
            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">★ {selected.rating}/5</Badge>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20">
        <AnimatePresence initial={false}>
          {selected.messages.map((m) => {
            const mine = m.author === "admin";
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("flex gap-2", mine ? "justify-end" : "justify-start")}
              >
                {!mine && (
                  <Avatar className="h-7 w-7 shrink-0">
                    {studentProfile?.avatar && <AvatarImage src={studentProfile.avatar} alt={m.authorName} />}
                    <AvatarFallback className="text-[10px]">{m.authorName[0]}</AvatarFallback>
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
                    <AvatarFallback className="text-[10px] bg-green-100 text-green-700">S</AvatarFallback>
                  </Avatar>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <div className="border-t p-3 shrink-0 bg-background space-y-2">
        <div className="flex items-center justify-between gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                <Zap className="h-3.5 w-3.5 mr-1" /> Risposte rapide
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="max-w-xs">
              {quickReplies.map((q, i) => (
                <DropdownMenuItem key={i} onClick={() => setReply(q)} className="text-xs whitespace-normal cursor-pointer">
                  {q}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {selected.stato !== "risolto" && (
            <Button variant="outline" size="sm" className="text-xs" onClick={() => handleChangeStato("risolto")}>
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Chiudi
            </Button>
          )}
        </div>
        <div className="flex gap-2 items-end">
          <Textarea
            placeholder="Scrivi una risposta..."
            rows={1}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            className="min-h-[40px] max-h-32 resize-none"
          />
          <Button size="icon" onClick={handleSend} disabled={!reply.trim()} className="shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <PageTransition className="p-4 md:p-6 space-y-4 md:space-y-6">
      <FadeIn>
        <div>
          <h1 className="font-heading text-xl md:text-2xl font-bold">Supporto</h1>
          <p className="text-sm text-muted-foreground">Gestisci i ticket degli studenti</p>
        </div>
      </FadeIn>

      {/* Stats */}
      <FadeIn delay={0.05}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
          <StatCard icon={<Inbox className="h-4 w-4" />} label="Aperti" value={stats.aperti} tone="blue" />
          <StatCard icon={<Clock className="h-4 w-4" />} label="In corso" value={stats.in_corso} tone="yellow" />
          <StatCard icon={<CheckCircle2 className="h-4 w-4" />} label="Risolti oggi" value={stats.risolti_oggi} tone="green" />
          <StatCard icon={<Timer className="h-4 w-4" />} label="Tempo medio" value={stats.tempo_medio} tone="muted" />
        </div>
      </FadeIn>

      {/* Toolbar */}
      <FadeIn delay={0.08}>
        <Card>
          <CardContent className="p-3 flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cerca ticket o studente..." className="pl-9 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className={cn("grid gap-2", view === "pipeline" ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-4")}>
              {view === "lista" && (
                <Select value={fStato} onValueChange={setFStato}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Stato" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutti gli stati</SelectItem>
                    <SelectItem value="aperto">Aperto</SelectItem>
                    <SelectItem value="in_corso">In corso</SelectItem>
                    <SelectItem value="attesa_studente">Attesa studente</SelectItem>
                    <SelectItem value="risolto">Risolto</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <Select value={fPrio} onValueChange={setFPrio}>
                <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Priorità" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutte priorità</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="normale">Normale</SelectItem>
                  <SelectItem value="bassa">Bassa</SelectItem>
                </SelectContent>
              </Select>
              <Select value={fCat} onValueChange={setFCat}>
                <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Categoria" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutte categorie</SelectItem>
                  <SelectItem value="manutenzione">Manutenzione</SelectItem>
                  <SelectItem value="wifi">Wi-Fi</SelectItem>
                  <SelectItem value="pulizie">Pulizie</SelectItem>
                  <SelectItem value="altro">Altro</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="recenti">Più recenti</SelectItem>
                  <SelectItem value="vecchi">Più vecchi</SelectItem>
                  <SelectItem value="priorita">Per priorità</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1 rounded-md border bg-background p-0.5 lg:ml-auto">
              <Button
                variant={view === "lista" ? "default" : "ghost"}
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => setView("lista")}
              >
                <List className="h-3.5 w-3.5 mr-1" /> Lista
              </Button>
              <Button
                variant={view === "pipeline" ? "default" : "ghost"}
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => setView("pipeline")}
              >
                <Kanban className="h-3.5 w-3.5 mr-1" /> Pipeline
              </Button>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {view === "pipeline" ? (
        <FadeIn delay={0.1}>
          <DndContext
            sensors={sensors}
            onDragStart={(e: DragStartEvent) => setDraggingId(e.active.id as string)}
            onDragCancel={() => setDraggingId(null)}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
              {pipelineStages.map((stage) => {
                const items = filtered.filter((t) => t.stato === stage.key);
                return (
                  <PipelineColumn key={stage.key} stage={stage} count={items.length}>
                    {items.length === 0 ? (
                      <div className="text-center text-xs text-muted-foreground py-8 border border-dashed rounded-md">
                        Nessun ticket
                      </div>
                    ) : (
                      items.map((t) => (
                        <DraggableTicketCard
                          key={t.id}
                          ticket={t}
                          profile={mockProfiles.find((p) => p.id === t.student_id)}
                          onClick={() => setSelectedId(t.id)}
                          isDragging={draggingId === t.id}
                        />
                      ))
                    )}
                  </PipelineColumn>
                );
              })}
            </div>
            <DragOverlay dropAnimation={null}>
              {draggingTicket && (
                <div className="rotate-2 opacity-95">
                  <TicketCardContent
                    ticket={draggingTicket}
                    profile={mockProfiles.find((p) => p.id === draggingTicket.student_id)}
                  />
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </FadeIn>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* List */}
        <div className="lg:col-span-2 space-y-2">
          {filtered.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              <Inbox className="h-8 w-8 mx-auto mb-2 opacity-50" />
              Nessun ticket trovato
            </Card>
          ) : (
            filtered.map((t) => {
              const last = t.messages[t.messages.length - 1];
              const profile = mockProfiles.find((p) => p.id === t.student_id);
              return (
                <motion.div key={t.id} whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.995 }}>
                  <Card
                    className={cn(
                      "cursor-pointer transition-all overflow-hidden",
                      selectedId === t.id && !isMobile ? "ring-2 ring-primary" : "hover:bg-muted/30",
                      t.unreadForAdmin && "border-primary/40"
                    )}
                    onClick={() => setSelectedId(t.id)}
                  >
                    <div className="flex">
                      <div className={cn("w-1 shrink-0", prioritaBar[t.priorita])} />
                      <CardContent className="p-3 flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <Avatar className="h-8 w-8 shrink-0">
                            {profile?.avatar && <AvatarImage src={profile.avatar} alt={t.student_nome} />}
                            <AvatarFallback className="text-xs">{t.student_nome[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={cn("text-sm truncate", t.unreadForAdmin ? "font-semibold" : "font-medium")}>{t.titolo}</p>
                              {t.unreadForAdmin && <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{t.student_nome}</p>
                            {last && (
                              <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                                <span className="font-medium">{last.author === "admin" ? "Tu" : "Studente"}:</span> {last.text}
                              </p>
                            )}
                            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                              <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", statoColors[t.stato])}>{statoLabel[t.stato]}</Badge>
                              <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 capitalize", prioritaColors[t.priorita])}>{t.priorita}</Badge>
                              <span className="text-[10px] text-muted-foreground ml-auto">{relTime(t.updatedAt || t.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Detail desktop */}
        {!isMobile && (
          <div className="lg:col-span-3">
            <Card className="sticky top-6 h-[calc(100vh-10rem)] overflow-hidden">
              {selected ? detailPanel : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                  <MessageSquare className="h-12 w-12 mb-3 opacity-30" />
                  <p className="text-sm">Seleziona un ticket per vedere la conversazione</p>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
      )}
      {isMobile && (
        <Dialog open={!!selected} onOpenChange={(o) => !o && setSelectedId(null)}>
          <DialogContent className="max-w-none w-screen h-[100dvh] p-0 gap-0 rounded-none sm:rounded-none">
            {detailPanel}
          </DialogContent>
        </Dialog>
      )}
    </PageTransition>
  );
}

function StatCard({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: number | string; tone: "blue" | "yellow" | "green" | "muted" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-100",
    green: "bg-green-50 text-green-700 border-green-100",
    muted: "bg-muted/50 text-foreground border-border",
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

type PipelineStage = { key: SupportTicket["stato"]; label: string; dot: string; bg: string };

function PipelineColumn({ stage, count, children }: { stage: PipelineStage; count: number; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.key });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "shrink-0 w-[280px] sm:w-[300px] snap-start rounded-lg border flex flex-col max-h-[calc(100vh-16rem)]",
        stage.bg,
        isOver && "ring-2 ring-primary ring-offset-2",
      )}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b bg-background/60 rounded-t-lg sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full", stage.dot)} />
          <span className="text-xs font-semibold">{stage.label}</span>
        </div>
        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">{count}</Badge>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">{children}</div>
    </div>
  );
}

function DraggableTicketCard({
  ticket,
  profile,
  onClick,
  isDragging,
}: {
  ticket: SupportTicket;
  profile?: { avatar?: string };
  onClick: () => void;
  isDragging: boolean;
}) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: ticket.id });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn("touch-none", isDragging && "opacity-30")}
    >
      <TicketCardContent ticket={ticket} profile={profile} />
    </div>
  );
}

function TicketCardContent({
  ticket,
  profile,
}: {
  ticket: SupportTicket;
  profile?: { avatar?: string };
}) {
  const last = ticket.messages[ticket.messages.length - 1];
  return (
    <Card className={cn("cursor-pointer hover:shadow-md transition-shadow overflow-hidden", ticket.unreadForAdmin && "border-primary/40")}>
      <div className="flex">
        <div className={cn("w-1 shrink-0", prioritaBar[ticket.priorita])} />
        <CardContent className="p-2.5 flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <Avatar className="h-7 w-7 shrink-0">
              {profile?.avatar && <AvatarImage src={profile.avatar} alt={ticket.student_nome} />}
              <AvatarFallback className="text-[10px]">{ticket.student_nome[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-1">
                <p className={cn("text-xs truncate", ticket.unreadForAdmin ? "font-semibold" : "font-medium")}>{ticket.titolo}</p>
                {ticket.unreadForAdmin && <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
              </div>
              <p className="text-[10px] text-muted-foreground truncate">{ticket.student_nome}</p>
              {last && (
                <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                  <span className="font-medium">{last.author === "admin" ? "Tu" : "Studente"}:</span> {last.text}
                </p>
              )}
              <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                <Badge variant="outline" className={cn("text-[9px] px-1 py-0 capitalize h-4", prioritaColors[ticket.priorita])}>{ticket.priorita}</Badge>
                <Badge variant="outline" className="text-[9px] px-1 py-0 capitalize h-4">{ticket.categoria}</Badge>
                <span className="text-[9px] text-muted-foreground ml-auto">{relTime(ticket.updatedAt || ticket.created_at)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
