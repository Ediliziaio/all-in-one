import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getRoomById, getRoomTypeLabel, rooms } from "@/data/rooms";
import { PageTransition, FadeIn, HoverCard as MotionHoverCard } from "@/components/motion/MotionWrappers";
import {
  ArrowLeft, ArrowRight, Check, Calendar, Ruler, Layers, X,
  Wifi, Bath, Wind, ChevronLeft, Clock, Grid2x2, Images
} from "lucide-react";

const CameraDettaglio = () => {
  const { id } = useParams<{ id: string }>();
  const room = getRoomById(id || "");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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

  return (
    <Layout>
      <PageTransition>
        <section className="py-6 md:py-8">
          <div className="container">
            {/* Breadcrumb */}
            <Link to="/camere" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors mb-5">
              <ChevronLeft className="h-4 w-4" /> Torna alle camere
            </Link>

            {/* Galleria Airbnb */}
            <FadeIn>
              {/* Desktop: 1 grande + 4 piccole */}
              <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden h-[420px] mb-8">
                <button
                  onClick={() => openLightbox(0)}
                  className="col-span-2 row-span-2 relative group cursor-pointer overflow-hidden"
                >
                  <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
                </button>
                {room.images.slice(1, 5).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => openLightbox(i + 1)}
                    className="relative group cursor-pointer overflow-hidden"
                  >
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

              {/* Mobile: solo immagine principale */}
              <div className="md:hidden relative rounded-xl overflow-hidden mb-6">
                <img src={room.images[0]} alt={room.name} className="w-full h-64 object-cover" />
                <button
                  onClick={() => openLightbox(0)}
                  className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-sm text-foreground text-xs font-medium px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-md"
                >
                  <Grid2x2 className="h-3.5 w-3.5" /> Vedi tutte le foto
                </button>
              </div>
            </FadeIn>

            {/* Content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
              {/* Info principale */}
              <FadeIn delay={0.1}>
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{room.name}</h1>
                  <Badge className={room.available ? "bg-success/15 text-success border-success/30" : "bg-destructive/15 text-destructive border-destructive/30"} variant="outline">
                    {room.available ? "Disponibile" : "Occupata"}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-5">{getRoomTypeLabel(room.type)}</p>

                <div className="flex flex-wrap gap-5 mb-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Ruler className="h-4 w-4 text-accent" /> {room.sqm} m²
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Layers className="h-4 w-4 text-accent" /> Piano {room.floor}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 text-accent" /> Da {room.availableFrom}
                  </div>
                </div>

                <Separator className="mb-6" />

                <p className="text-foreground leading-relaxed mb-8">{room.description}</p>

                <Separator className="mb-6" />

                <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Servizi inclusi</h2>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {room.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5 text-sm text-foreground">
                      <div className="h-6 w-6 rounded-full bg-success/15 flex items-center justify-center shrink-0">
                        <Check className="h-3.5 w-3.5 text-success" />
                      </div>
                      {f}
                    </div>
                  ))}
                </div>

                {/* Camere simili */}
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
                                <p className="text-accent font-bold mt-1">€{r.price}<span className="text-sm text-muted-foreground font-normal">/mese</span></p>
                              </div>
                            </div>
                          </Link>
                        </MotionHoverCard>
                      ))}
                    </div>
                  </>
                )}
              </FadeIn>

              {/* Sidebar sticky */}
              <FadeIn delay={0.2}>
                <div className="lg:sticky lg:top-24 h-fit">
                  <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-5">
                    <div>
                      <span className="text-3xl font-bold text-accent">€{room.price}</span>
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
                      <Calendar className="h-4 w-4 text-accent" />
                      Disponibile dal <span className="font-medium text-foreground">{room.availableFrom}</span>
                    </div>

                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-base font-semibold" size="lg">
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

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-transparent shadow-none [&>button]:hidden">
          <div className="relative flex items-center justify-center w-full h-[90vh]">
            {/* Close */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm rounded-full p-2 hover:bg-background transition-colors"
            >
              <X className="h-5 w-5 text-foreground" />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium text-foreground">
              {lightboxIndex + 1} / {room.images.length}
            </div>

            {/* Prev */}
            <button
              onClick={() => navigateLightbox(-1)}
              className="absolute left-4 z-10 bg-background/80 backdrop-blur-sm rounded-full p-2 hover:bg-background transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.img
                key={lightboxIndex}
                src={room.images[lightboxIndex]}
                alt={`${room.name} ${lightboxIndex + 1}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
              />
            </AnimatePresence>

            {/* Next */}
            <button
              onClick={() => navigateLightbox(1)}
              className="absolute right-4 z-10 bg-background/80 backdrop-blur-sm rounded-full p-2 hover:bg-background transition-colors"
            >
              <ArrowRight className="h-5 w-5 text-foreground" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default CameraDettaglio;
