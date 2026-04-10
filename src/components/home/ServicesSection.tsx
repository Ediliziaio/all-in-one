import { motion } from "framer-motion";
import { Wifi, WashingMachine, UtensilsCrossed, Dumbbell, Zap, BookOpen } from "lucide-react";

const services = [
  { icon: Wifi, title: "WiFi Fibra 1Gbps", desc: "Lezioni online, Netflix, videochiamate: tutto senza lag. In ogni stanza.", value: 30 },
  { icon: Dumbbell, title: "Palestra 24/7", desc: "Cardio e pesi liberi inclusi, dalle 6 alle 23. Niente abbonamenti extra.", value: 40 },
  { icon: WashingMachine, title: "Lavanderia illimitata", desc: "Lavatrici e asciugatrici prenotabili dall'app. Zero code, zero attese.", value: 25 },
  { icon: BookOpen, title: "Sale studio prenotabili", desc: "Silenziose, con prese e luce perfetta. Prenotabili dall'app in 10 secondi.", value: 20 },
  { icon: Zap, title: "Utenze (luce, gas, acqua)", desc: "Incluse nel canone. D'inverno non cambierà niente. Mai.", value: 80 },
  { icon: UtensilsCrossed, title: "Cucina attrezzata", desc: "Piani induzione, forno, frigo: cucinati i tuoi piatti preferiti, su ogni piano.", value: 15 },
];

const totalValue = services.reduce((sum, s) => sum + s.value, 0);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export function ServicesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Ecco Cosa Ottieni<br />
            <span className="text-primary">(e Quanto Risparmi)</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Un canone. Tutto dentro. Nessuna sorpresa a fine mese. Ecco il valore reale di quello che ricevi.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="rounded-xl border bg-card p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <s.icon className="h-6 w-6 text-accent" />
                </div>
                <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                  Valore: €{s.value}/mese
                </span>
              </div>
              <h3 className="font-heading font-semibold text-lg text-card-foreground">{s.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Value Stack Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 rounded-2xl border-2 border-primary/30 bg-primary/5 p-8 text-center"
        >
          <p className="text-muted-foreground text-lg mb-2">Valore totale di tutto quello che è incluso:</p>
          <p className="text-4xl font-bold text-muted-foreground line-through mb-1">€{totalValue}/mese</p>
          <p className="text-5xl font-extrabold text-primary">da €480/mese</p>
          <p className="text-sm text-muted-foreground mt-3">
            Risparmi fino a <strong className="text-foreground">€{totalValue - 480}/mese</strong> rispetto a pagare tutto separatamente.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
