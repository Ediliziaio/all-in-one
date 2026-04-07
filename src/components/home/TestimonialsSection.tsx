import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  { name: "Marco Rossi", course: "Ingegneria Informatica", rating: 5, text: "Ambiente perfetto per studiare. La fibra è velocissima e le sale studio sono sempre disponibili.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" },
  { name: "Giulia Bianchi", course: "Medicina", rating: 5, text: "Vivere qui è comodissimo: tutto è incluso e l'università è a 5 minuti a piedi. Lo consiglio!", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face" },
  { name: "Ahmed El Fassi", course: "Economia", rating: 5, text: "Ho trovato subito una community fantastica. La palestra e la cucina comune sono un plus incredibile.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face" },
  { name: "Sofia Chen", course: "Architettura", rating: 4, text: "Camera spaziosa e luminosa, perfetta per i miei progetti. La posizione è strategica.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" },
  { name: "Luca Moretti", course: "Giurisprudenza", rating: 5, text: "Dopo 2 anni qui non cambierei per niente al mondo. Staff disponibile e struttura impeccabile.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" },
];

export function TestimonialsSection() {
  const [idx, setIdx] = useState(0);
  const t = testimonials[idx];

  return (
    <section className="py-20 bg-background">
      <div className="container max-w-2xl text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-10">Cosa dicono i nostri studenti</h2>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <img src={t.avatar} alt={t.name} className="h-16 w-16 rounded-full mx-auto object-cover" />
            <div className="flex justify-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < t.rating ? "text-accent fill-accent" : "text-muted"}`} />
              ))}
            </div>
            <p className="text-lg text-foreground italic">"{t.text}"</p>
            <div>
              <p className="font-semibold text-foreground">{t.name}</p>
              <p className="text-sm text-muted-foreground">{t.course}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-3 mt-8">
          <Button variant="outline" size="icon" onClick={() => setIdx((idx - 1 + testimonials.length) % testimonials.length)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setIdx((idx + 1) % testimonials.length)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
