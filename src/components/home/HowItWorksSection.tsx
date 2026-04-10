import { motion } from "framer-motion";
import { Search, FileText, Key, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Search,
    number: "1",
    title: "Scegli la camera",
    desc: "Sfoglia il catalogo, confronta prezzi e servizi. Ci vogliono 2 minuti.",
    time: "2 min",
  },
  {
    icon: FileText,
    number: "2",
    title: "Ti confermiamo in 24h",
    desc: "Niente settimane di attesa. Ti rispondiamo entro un giorno lavorativo con tutti i dettagli.",
    time: "24 ore",
  },
  {
    icon: Key,
    number: "3",
    title: "Firma e trasferisciti",
    desc: "Contratto chiaro, 2 pagine, zero clausole nascoste. Prendi le chiavi e sei a casa.",
    time: "72 ore",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Dalla Richiesta alle Chiavi<br />
            <span className="text-primary">in 72 Ore</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            Niente burocrazia infinita. Tre passi e sei a casa.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="text-center relative"
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-border" />
              )}
              
              <div className="relative mx-auto mb-4 h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center">
                <step.icon className="h-8 w-8 text-accent" />
                <span className="absolute -top-1 -right-1 h-7 w-7 rounded-full bg-accent text-accent-foreground text-sm font-bold flex items-center justify-center">
                  {step.number}
                </span>
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">{step.desc}</p>
              <span className="inline-block mt-3 text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                ⏱ {step.time}
              </span>
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
          <p className="text-muted-foreground mb-4">Non sei convinto? Nessun problema.</p>
          <Button asChild variant="outline" size="lg">
            <Link to="/contatti">
              <Eye className="mr-2 h-4 w-4" /> Prenota una visita gratuita (senza impegno)
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
