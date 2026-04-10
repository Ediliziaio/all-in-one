import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  { name: "Marco Rossi", course: "Ingegneria Informatica", rating: 5, text: "Ho risparmiato €180/mese rispetto al mio vecchio affitto. WiFi che funziona davvero, bollette incluse, zero sorprese. Non torno più indietro.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" },
  { name: "Giulia Bianchi", course: "Medicina", rating: 5, text: "In 3 anni non ho mai avuto un problema irrisolto per più di 24 ore. L'assistenza è reale, non un numero che non risponde mai.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face" },
  { name: "Ahmed El Fassi", course: "Economia", rating: 5, text: "Il 98% rinnova il contratto. Io l'ho rinnovato 3 volte. La community, la palestra, la posizione — non trovi niente di simile a Padova.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face" },
  { name: "Sofia Chen", course: "Architettura", rating: 5, text: "Camera spaziosa, luminosa, perfetta per i miei progetti. A 5 minuti dall'università ho guadagnato 2 ore al giorno di vita.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" },
  { name: "Luca Moretti", course: "Giurisprudenza", rating: 5, text: "Prima pagavo €650 tra affitto e bollette per un buco. Ora pago meno, vivo meglio, e non devo litigare con il proprietario.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" },
  { name: "Maria T.", course: "Genitore", rating: 5, text: "Come mamma, finalmente dormo tranquilla. So che mia figlia è al sicuro, il contratto è regolare, e se ha un problema lo risolvono subito.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? "text-accent fill-accent" : "text-muted"}`} />
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div className="rounded-xl border bg-card p-6 h-full flex flex-col">
      <div className="mb-3">
        <Quote className="h-6 w-6 text-accent/30" />
      </div>
      <p className="text-foreground text-sm leading-relaxed flex-1">"{t.text}"</p>
      <div className="flex items-center gap-3 mt-4 pt-4 border-t">
        <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
        <div>
          <p className="font-semibold text-sm text-card-foreground">{t.name}</p>
          <p className="text-xs text-muted-foreground">{t.course}</p>
        </div>
        <div className="ml-auto">
          <StarRating rating={t.rating} />
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const [idx, setIdx] = useState(0);

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Cosa Dicono<br />
            <span className="text-primary">i Nostri Studenti</span>
          </h2>
          <p className="text-muted-foreground mt-3">
            <strong className="text-foreground">127 recensioni Google — media 4.9★</strong>
          </p>
        </motion.div>

        {/* Desktop: grid 3 columns */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {testimonials.slice(0, 6).map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <TestimonialCard t={t} />
            </motion.div>
          ))}
        </div>

        {/* Mobile: carousel */}
        <div className="md:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <TestimonialCard t={testimonials[idx]} />
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-3 mt-6">
            <Button variant="outline" size="icon" onClick={() => setIdx((idx - 1 + testimonials.length) % testimonials.length)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="flex items-center text-sm text-muted-foreground">{idx + 1}/{testimonials.length}</span>
            <Button variant="outline" size="icon" onClick={() => setIdx((idx + 1) % testimonials.length)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
