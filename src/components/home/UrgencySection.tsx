import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const availability = [
  { type: "Camere Singole", remaining: 7, total: 24, color: "bg-accent" },
  { type: "Singole Plus", remaining: 3, total: 12, color: "bg-primary" },
  { type: "Camere Doppie", remaining: 2, total: 8, color: "bg-destructive" },
];

export function UrgencySection() {
  return (
    <section className="py-20 bg-foreground text-background">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-destructive px-4 py-1.5 text-sm font-bold text-destructive-foreground mb-4">
            <AlertTriangle className="h-4 w-4" /> Disponibilità limitata
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold">
            I Posti Per Settembre 2025<br />Stanno Finendo
          </h2>
          <p className="mt-4 text-lg opacity-80">
            Ogni settimana riceviamo <strong>40+ richieste</strong>. Non aspettare l'ultimo giorno.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {availability.map((item, i) => (
            <motion.div
              key={item.type}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="rounded-xl border border-background/20 bg-background/10 p-6 text-center backdrop-blur-sm"
            >
              <p className="text-sm font-medium opacity-70 mb-2">{item.type}</p>
              <p className="text-4xl font-bold">{item.remaining}</p>
              <p className="text-sm opacity-60 mt-1">rimaste su {item.total}</p>
              <div className="mt-3 h-2 rounded-full bg-background/20 overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color} transition-all`}
                  style={{ width: `${((item.total - item.remaining) / item.total) * 100}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button asChild size="lg" className="text-base bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/camere">
              Blocca il Tuo Posto <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-base border-background/30 text-background hover:bg-background/10">
            <a href="https://wa.me/390000000000" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" /> Scrivici su WhatsApp
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
