import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Search, FileText, Key, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Search,
    number: "1",
    title: "Scegli la camera",
    desc: "Sfoglia il catalogo, confronta le opzioni e trova quella giusta per te.",
  },
  {
    icon: FileText,
    number: "2",
    title: "Ricevi conferma",
    desc: "Ti rispondiamo rapidamente con tutti i dettagli e le informazioni necessarie.",
  },
  {
    icon: Key,
    number: "3",
    title: "Firma e trasferisciti",
    desc: "Contratto chiaro e trasparente. Prendi le chiavi e sei a casa.",
  },
];

export function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 60%"],
  });
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="py-12 md:py-20 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Come{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-[gradient_4s_linear_infinite]">
              Funziona
            </span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            Tre semplici passi per trovare la tua nuova casa.
          </p>
        </motion.div>

        <div ref={containerRef} className="relative grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Animated connector line (desktop) */}
          <div className="hidden md:block absolute top-10 left-[16.66%] right-[16.66%] h-0.5 bg-border overflow-hidden rounded-full">
            <motion.div style={{ width: lineWidth }} className="h-full bg-gradient-to-r from-primary to-accent" />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="text-center relative"
            >
              <motion.div
                whileHover={{ scale: 1.08, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative mx-auto mb-4 h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center"
              >
                <step.icon className="h-8 w-8 text-accent" />
                <span className="absolute -top-1 -right-1 h-7 w-7 rounded-full bg-accent text-accent-foreground text-sm font-bold flex items-center justify-center shadow-md">
                  {step.number}
                </span>
              </motion.div>
              <h3 className="font-heading font-semibold text-lg text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-10"
        >
          <p className="text-muted-foreground mb-4">Vuoi vedere gli spazi di persona?</p>
          <Button asChild variant="outline" size="lg">
            <Link to="/contatti">
              <Eye className="mr-2 h-4 w-4" /> Prenota una visita gratuita
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
