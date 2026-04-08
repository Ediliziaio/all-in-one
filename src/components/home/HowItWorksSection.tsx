import { motion } from "framer-motion";
import { Search, FileText, Key } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "1",
    title: "Scegli la tua camera",
    desc: "Sfoglia il catalogo, filtra per prezzo e servizi. Trova la soluzione perfetta per te.",
  },
  {
    icon: FileText,
    number: "2",
    title: "Invia la richiesta",
    desc: "Compila il form in 2 minuti. Ti rispondiamo entro 24 ore con tutti i dettagli.",
  },
  {
    icon: Key,
    number: "3",
    title: "Trasferisciti",
    desc: "Firma il contratto, prendi le chiavi e inizia la tua avventura a Padova.",
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
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Come funziona</h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            Tre passi e sei a casa. Semplice, veloce, senza burocrazia.
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
              {/* Connector line */}
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
