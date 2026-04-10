import { motion } from "framer-motion";
import { FadeIn } from "@/components/motion/MotionWrappers";

const stats = [
  { value: "7+", label: "Anni di esperienza" },
  { value: "500+", label: "Studenti ospitati" },
  { value: "98%", label: "Rinnova il contratto" },
  { value: "4.9★", label: "Media Google Reviews" },
];

export function AboutSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container max-w-4xl">
        <FadeIn className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Chi Siamo
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Non siamo un'agenzia. Siamo persone che hanno vissuto gli stessi problemi 
            degli studenti a Padova — e li hanno risolti. Dal 2018, punto di riferimento 
            per chi vuole vivere l'università senza stress.
          </p>
        </FadeIn>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center rounded-xl border bg-card p-6"
            >
              <p className="text-3xl md:text-4xl font-bold text-accent">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
