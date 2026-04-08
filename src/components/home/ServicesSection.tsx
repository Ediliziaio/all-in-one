import { motion } from "framer-motion";
import { Wifi, WashingMachine, UtensilsCrossed, Dumbbell, ShieldCheck, BookOpen } from "lucide-react";

const services = [
  { icon: Wifi, title: "WiFi che non ti lascia mai", desc: "Lezioni online, Netflix, videochiamate: tutto senza lag. Fibra 1Gbps in ogni stanza." },
  { icon: WashingMachine, title: "Lava quando vuoi", desc: "Lavatrici e asciugatrici 24/7, prenotabili dall'app. Zero code, zero attese." },
  { icon: UtensilsCrossed, title: "Cucina come a casa", desc: "Piani induzione, forno, frigo: cucinati i tuoi piatti preferiti, su ogni piano." },
  { icon: Dumbbell, title: "Allenati sotto casa", desc: "Cardio e pesi liberi inclusi nel canone, dalle 6 alle 23. Niente abbonamenti extra." },
  { icon: ShieldCheck, title: "I tuoi genitori saranno tranquilli", desc: "Badge elettronico, telecamere, portineria. Sempre al sicuro, giorno e notte." },
  { icon: BookOpen, title: "Sessione d'esame? Ci pensiamo noi", desc: "Sale silenziose prenotabili con prese e luce perfetta per concentrarti al massimo." },
];

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
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Tutto incluso, zero pensieri</h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            Un canone, tutto dentro. Niente sorprese a fine mese.
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
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <s.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-card-foreground">{s.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
