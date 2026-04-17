import { motion } from "framer-motion";
import { Wifi, WashingMachine, UtensilsCrossed, Dumbbell, Zap, BookOpen } from "lucide-react";

const services = [
  { icon: Wifi, title: "WiFi Fibra 1Gbps", desc: "Lezioni online, streaming, videochiamate: tutto fluido, in ogni stanza." },
  { icon: Dumbbell, title: "Palestra 24/7", desc: "Cardio e pesi liberi inclusi nel canone. Nessun abbonamento extra." },
  { icon: WashingMachine, title: "Lavanderia", desc: "Lavatrici e asciugatrici prenotabili comodamente dall'app." },
  { icon: BookOpen, title: "Sale studio", desc: "Ambienti silenziosi con prese e luce perfetta, prenotabili dall'app." },
  { icon: Zap, title: "Utenze incluse", desc: "Luce, gas e acqua sono nel canone. D'inverno come d'estate, il prezzo non cambia." },
  { icon: UtensilsCrossed, title: "Cucina attrezzata", desc: "Piani induzione, forno e frigo su ogni piano per i tuoi piatti preferiti." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
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
            Tutto Incluso<br />
            <span className="text-primary">nel Canone</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Un canone mensile, nessuna sorpresa. Ecco cosa è compreso nella tua camera.
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
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative rounded-xl border bg-card p-6 hover:shadow-xl hover:border-accent/40 transition-[box-shadow,border-color] group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative mb-4">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors"
                >
                  <s.icon className="h-6 w-6 text-accent" />
                </motion.div>
              </div>
              <h3 className="relative font-heading font-semibold text-lg text-card-foreground">{s.title}</h3>
              <p className="relative text-sm text-muted-foreground mt-1">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 rounded-2xl border bg-muted/50 p-8 text-center"
        >
          <p className="text-muted-foreground text-lg mb-2">Tutto questo è già incluso nel canone mensile</p>
          <p className="text-4xl font-extrabold text-primary">da €480/mese</p>
          <p className="text-sm text-muted-foreground mt-3">
            Nessun costo aggiuntivo per bollette, WiFi, palestra o lavanderia.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
