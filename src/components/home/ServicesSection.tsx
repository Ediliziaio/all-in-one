import { motion } from "framer-motion";
import { Wifi, WashingMachine, UtensilsCrossed, Dumbbell, ShieldCheck, BookOpen } from "lucide-react";

const services = [
  { icon: Wifi, title: "WiFi Fibra", desc: "Connessione ultraveloce in ogni stanza per studio e streaming." },
  { icon: WashingMachine, title: "Lavanderia Smart", desc: "Lavatrici e asciugatrici moderne con prenotazione via app." },
  { icon: UtensilsCrossed, title: "Cucina Comune", desc: "Cucine attrezzate su ogni piano, sempre pulite e accessibili." },
  { icon: Dumbbell, title: "Palestra", desc: "Sala fitness con attrezzi cardio e pesi liberi, inclusa nel prezzo." },
  { icon: ShieldCheck, title: "Sicurezza 24/7", desc: "Accesso con badge elettronico e videosorveglianza attiva." },
  { icon: BookOpen, title: "Studio Rooms", desc: "Sale studio silenziose prenotabili per sessioni concentrate." },
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
            Ogni servizio è pensato per rendere la tua vita da studente più semplice.
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
