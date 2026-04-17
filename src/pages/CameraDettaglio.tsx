import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getRoomById, getRoomTypeLabel, rooms } from "@/data/rooms";
import { PageTransition, FadeIn, HoverCard as MotionHoverCard } from "@/components/motion/MotionWrappers";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ArrowLeft, ArrowRight, Check, Calendar, Ruler, Layers, X,
  Wifi, Bath, Wind, ChevronLeft, Clock, Grid2x2, Images, Quote,
  Sun, BedDouble, Sparkles, MapPin, GraduationCap, ShoppingBag, Coffee,
  Zap, Droplets, Shield, Cigarette, PawPrint, Users, Moon
} from "lucide-react";

const featureIcon = (f: string) => {
  const k = f.toLowerCase();
  if (k.includes("wifi")) return Wifi;
  if (k.includes("bagno")) return Bath;
  if (k.includes("aria") || k.includes("clima")) return Wind;
  if (k.includes("scrivania") || k.includes("studio")) return BedDouble;
  if (k.includes("tv")) return Sparkles;
  if (k.includes("balcone") || k.includes("vista")) return Sun;
  return Check;
};

const CameraDettaglio = () => {
  const { id } = useParams<{ id: string }>();
  const room = getRoomById(id || "");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({ nome: "", email: "", dataInizio: "", dataFine: "", messaggio: "" });

  const navigateLightbox = useCallback((dir: 1 | -1) => {
    if (!room) return;
    setLightboxIndex((i) => (i + dir + room.images.length) % room.images.length);
  }, [room]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "ArrowRight") navigateLightbox(1);
      if (e.key === "ArrowLeft") navigateLightbox(-1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, navigateLightbox]);

  if (!room) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground">Camera non trovata</h1>
          <Button asChild className="mt-4">
            <Link to="/camere">Torna alle camere</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const similar = rooms.filter((r) => r.id !== room.id && r.type === room.type).slice(0, 2);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleBookingSubmit = () => {
    if (!bookingForm.nome || !bookingForm.email) {
      toast.error("Compila nome e email");
      return;
    }
    toast.success("Richiesta di prenotazione inviata! Ti contatteremo entro 24 ore.");
    setBookingOpen(false);
    setBookingForm({ nome: "", email: "", dataInizio: "", dataFine: "", messaggio: "" });
  };

  return (
    <Layout>
      <PageTransition>
        <section className="py-6 md:py-8">
          <div className="container">
            <Link to="/camere" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-5">
              <ChevronLeft className="h-4 w-4" /> Torna alle camere
            </Link>

            <FadeIn>
              <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden h-[420px] mb-8">
                <button onClick={() => openLightbox(0)} className="col-span-2 row-span-2 relative group cursor-pointer overflow-hidden">
                  <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
                </button>
                {room.images.slice(1, 5).map((img, i) => (
                  <button key={i} onClick={() => openLightbox(i + 1)} className="relative group cursor-pointer overflow-hidden">
                    <img src={img} alt={`${room.name} ${i + 2}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
                    {i === 3 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-foreground/30 group-hover:bg-foreground/40 transition-colors">
                        <span className="flex items-center gap-2 text-background font-medium text-sm">
                          <Images className="h-4 w-4" /> Mostra tutte le foto
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="md:hidden relative rounded-xl overflow-hidden mb-6">
                <img src={room.images[0]} alt={room.name} className="w-full h-64 object-cover" />
                <button onClick={() => openLightbox(0)} className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-sm text-foreground text-xs font-medium px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-md">
                  <Grid2x2 className="h-3.5 w-3.5" /> Vedi tutte le foto
                </button>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
              <FadeIn delay={0.1}>
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{room.name}</h1>
                  <Badge className={room.available ? "bg-success/15 text-success border-success/30" : "bg-destructive/15 text-destructive border-destructive/30"} variant="outline">
                    {room.available ? "Disponibile" : "Occupata"}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-5">{getRoomTypeLabel(room.type)}</p>

                <div className="flex flex-wrap gap-5 mb-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Ruler className="h-4 w-4 text-primary" /> {room.sqm} m²</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Layers className="h-4 w-4 text-primary" /> Piano {room.floor}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="h-4 w-4 text-primary" /> Da {room.availableFrom}</div>
                </div>

                <Separator className="mb-6" />

                {/* Mini info cards quick-scan */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                  {[
                    { icon: Users, label: "Ideale per", value: room.type === "doppia" ? "2 studenti" : "1 studente" },
                    { icon: Sun, label: "Esposizione", value: room.floor >= 2 ? "Luminosa" : "Cortile" },
                    { icon: BedDouble, label: "Arredamento", value: "Moderno" },
                    { icon: Bath, label: "Bagno", value: room.features.some(f => f.toLowerCase().includes("privato")) ? "Privato" : "Condiviso" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl border bg-card/50 p-3">
                      <s.icon className="h-4 w-4 text-primary mb-1.5" />
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{s.label}</p>
                      <p className="text-sm font-medium text-foreground mt-0.5">{s.value}</p>
                    </div>
                  ))}
                </div>

                <Tabs defaultValue="overview" className="mb-8">
                  <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto">
                    <TabsTrigger value="overview">Panoramica</TabsTrigger>
                    <TabsTrigger value="services">Servizi</TabsTrigger>
                    <TabsTrigger value="included">Incluso</TabsTrigger>
                    <TabsTrigger value="rules">Regole</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="pt-6">
                    <div className="relative max-w-prose">
                      <Quote className="absolute -left-2 -top-2 h-8 w-8 text-primary/15" />
                      <p className="text-lg font-medium text-foreground leading-relaxed mb-3 pl-6">
                        {room.description.split(".")[0]}.
                      </p>
                      <p className="text-foreground/80 leading-relaxed pl-6">
                        {room.description.split(".").slice(1).join(".").trim() || "Pensata per offrirti il massimo comfort durante il tuo percorso universitario, in un ambiente curato nei minimi dettagli."}
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="services" className="pt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {room.features.map((f) => {
                        const Icon = featureIcon(f);
                        return (
                          <div key={f} className="flex items-center gap-3 p-3 rounded-lg border bg-card/40">
                            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm font-medium text-foreground">{f}</span>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>

                  <TabsContent value="included" className="pt-6">
                    <ul className="space-y-3">
                      {[
                        { icon: Zap, label: "Utenze", desc: "Luce, gas, acqua sempre incluse" },
                        { icon: Wifi, label: "Internet Fibra", desc: "1 Gbps in tutta la struttura" },
                        { icon: Droplets, label: "Pulizie aree comuni", desc: "Bisettimanali" },
                        { icon: Shield, label: "Manutenzione", desc: "Interventi entro 48 ore" },
                      ].map((item) => (
                        <li key={item.label} className="flex items-start gap-3 p-3 rounded-lg border bg-card/40">
                          <div className="h-9 w-9 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                            <item.icon className="h-4 w-4 text-success" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-sm">{item.label}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>

                  <TabsContent value="rules" className="pt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { icon: Moon, label: "Silenzio dalle 22:00", ok: true },
                        { icon: Users, label: "Ospiti consentiti (max 1 notte)", ok: true },
                        { icon: Cigarette, label: "Vietato fumare", ok: false },
                        { icon: PawPrint, label: "Animali non ammessi", ok: false },
                      ].map((r) => (
                        <div key={r.label} className="flex items-center gap-3 p-3 rounded-lg border bg-card/40">
                          <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${r.ok ? "bg-success/10" : "bg-destructive/10"}`}>
                            <r.icon className={`h-4 w-4 ${r.ok ? "text-success" : "text-destructive"}`} />
                          </div>
                          <span className="text-sm text-foreground">{r.label}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>

                <Separator className="mb-6" />

                <h2 className="font-heading text-xl font-semibold text-foreground mb-4">La posizione</h2>
                <div className="rounded-2xl overflow-hidden border bg-card mb-8">
                  <div className="relative h-48 bg-muted">
                    <img
                      src="https://images.unsplash.com/photo-1524813686514-a57563d77965?w=1200&h=400&fit=crop"
                      alt="Mappa posizione studentato"
                      className="w-full h-full object-cover opacity-90"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-background/95 backdrop-blur-sm rounded-full p-3 shadow-lg">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <div>
                      <p className="font-semibold text-foreground">Via Napoleone, Padova</p>
                      <p className="text-sm text-muted-foreground">Quartiere universitario · 35100</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { icon: GraduationCap, label: "Università", time: "5 min a piedi" },
                        { icon: ShoppingBag, label: "Supermercato", time: "3 min" },
                        { icon: Coffee, label: "Bar & Ristoranti", time: "2 min" },
                      ].map((p) => (
                        <div key={p.label} className="flex items-center gap-2 p-2 rounded-lg bg-muted/40">
                          <p.icon className="h-4 w-4 text-primary shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-foreground truncate">{p.label}</p>
                            <p className="text-[11px] text-muted-foreground">{p.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {similar.length > 0 && (
                  <>
                    <Separator className="mb-6" />
                    <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Camere simili</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {similar.map((r) => (
                        <MotionHoverCard key={r.id}>
                          <Link to={`/camere/${r.id}`} className="block">
                            <div className="rounded-xl overflow-hidden border bg-card transition-shadow">
                              <img src={r.images[0]} alt={r.name} className="w-full h-40 object-cover" loading="lazy" />
                              <div className="p-4">
                                <h3 className="font-heading font-semibold text-card-foreground">{r.name}</h3>
                                <p className="text-primary font-bold mt-1">€{r.price}<span className="text-sm text-muted-foreground font-normal">/mese</span></p>
                              </div>
                            </div>
                          </Link>
                        </MotionHoverCard>
                      ))}
                    </div>
                  </>
                )}
              </FadeIn>

              <FadeIn delay={0.2}>
                <div className="lg:sticky lg:top-24 h-fit">
                  <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-5">
                    <div>
                      <span className="text-3xl font-bold text-primary">€{room.price}</span>
                      <span className="text-muted-foreground text-lg">/mese</span>
                    </div>

                    <div className="flex items-center gap-3 text-muted-foreground text-sm">
                      <Wifi className="h-4 w-4" />
                      <Bath className="h-4 w-4" />
                      <Wind className="h-4 w-4" />
                      <span className="text-xs">+ {Math.max(0, room.features.length - 3)} altri</span>
                    </div>

                    <Separator />

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 text-primary" />
                      Disponibile dal <span className="font-medium text-foreground">{room.availableFrom}</span>
                    </div>

                    <Button className="w-full text-base font-semibold" size="lg" onClick={() => setBookingOpen(true)}>
                      Richiedi Prenotazione
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      Prenota una visita
                    </Button>

                    <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      Risposta entro 24 ore lavorative
                    </div>

                    <p className="text-xs text-muted-foreground text-center">Tutti i servizi inclusi. Nessun costo nascosto.</p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
      </PageTransition>

      {/* Booking Dialog */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Richiedi Prenotazione — {room.name}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Nome completo *</Label>
                <Input placeholder="Mario Rossi" value={bookingForm.nome} onChange={(e) => setBookingForm({ ...bookingForm, nome: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input type="email" placeholder="mario@email.com" value={bookingForm.email} onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Data inizio</Label>
                <Input type="date" value={bookingForm.dataInizio} onChange={(e) => setBookingForm({ ...bookingForm, dataInizio: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Data fine</Label>
                <Input type="date" value={bookingForm.dataFine} onChange={(e) => setBookingForm({ ...bookingForm, dataFine: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Messaggio</Label>
              <Textarea placeholder="Raccontaci le tue esigenze..." value={bookingForm.messaggio} onChange={(e) => setBookingForm({ ...bookingForm, messaggio: e.target.value })} />
            </div>
            <Button className="w-full" onClick={handleBookingSubmit}>Invia Richiesta</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-transparent shadow-none [&>button]:hidden">
          <div className="relative flex items-center justify-center w-full h-[90vh]">
            <button onClick={() => setLightboxOpen(false)} className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm rounded-full p-2 hover:bg-background transition-colors">
              <X className="h-5 w-5 text-foreground" />
            </button>
            <div className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium text-foreground">
              {lightboxIndex + 1} / {room.images.length}
            </div>
            <button onClick={() => navigateLightbox(-1)} className="absolute left-4 z-10 bg-background/80 backdrop-blur-sm rounded-full p-2 hover:bg-background transition-colors">
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <AnimatePresence mode="wait">
              <motion.img key={lightboxIndex} src={room.images[lightboxIndex]} alt={`${room.name} ${lightboxIndex + 1}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg" />
            </AnimatePresence>
            <button onClick={() => navigateLightbox(1)} className="absolute right-4 z-10 bg-background/80 backdrop-blur-sm rounded-full p-2 hover:bg-background transition-colors">
              <ArrowRight className="h-5 w-5 text-foreground" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default CameraDettaglio;
