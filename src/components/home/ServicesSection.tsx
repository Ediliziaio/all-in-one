import { motion } from "framer-motion";
import { Wifi, WashingMachine, UtensilsCrossed, Zap, BookOpen, Sparkles } from "lucide-react";

const services = [
  { icon: Wifi, title: "WiFi incluso", desc: "Lezioni online, streaming, videochiamate: tutto fluido, in ogni stanza." },
  { icon: WashingMachine, title: "Lavanderia", desc: "2 lavatrici + 2 asciugatrici con detersivo fornito. Servizio a pagamento." },
  { icon: UtensilsCrossed, title: "Cucina attrezzata", desc: "3 cucine comuni con frigo condiviso. Ogni stanza ha anche il proprio frigo privato." },
  { icon: BookOpen, title: "Sala studio", desc: "1 sala studio silenziosa accessibile 24/7 con prese e luce perfetta." },
  { icon: Zap, title: "Utenze incluse", desc: "Luce, gas e acqua sono nel canone. D'inverno come d'estate, il prezzo non cambia." },
  { icon: Sparkles, title: "Pulizia parti comuni", desc: "Le aree comuni vengono pulite regolarmente. Pensiamo noi alla manutenzione." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const iconColors = [
  { bg: "bg-[hsl(var(--google-blue))]/10 group-hover:bg-[hsl(var(--google-blue))]/20", text: "text-[hsl(var(--google-blue))]" },
  { bg: "bg-[hsl(var(--google-red))]/10 group-hover:bg-[hsl(var(--google-red))]/20", text: "text-[hsl(var(--google-red))]" },
  { bg: "bg-[hsl(var(--google-yellow))]/15 group-hover:bg-[hsl(var(--google-yellow))]/25", text: "text-[hsl(var(--google-yellow))]" },
  { bg: "bg-[hsl(var(--google-green))]/10 group-hover:bg-[hsl(var(--google-green))]/20", text: "text-[hsl(var(--google-green))]" },
];

export function ServicesSection() {
  return (
    <section className="py-12 md:py-20 bg-[hsl(var(--google-blue))]/5">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            WiFi, Utenze e Cucina<br />
            <span className="text-primary">già nel Canone</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Un prezzo fisso ogni mese. Luce, gas, acqua, internet e pulizie: già dentro. Zero bollette da pagare, zero sorprese.
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
                  className={`h-12 w-12 rounded-lg flex items-center justify-center transition-colors ${iconColors[i % 4].bg}`}
                >
                  <s.icon className={`h-6 w-6 ${iconColors[i % 4].text}`} />
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
          <p className="text-muted-foreground text-lg mb-2">Tutto questo — WiFi, utenze, cucina, sala studio — è già incluso</p>
          <p className="text-4xl font-extrabold text-primary">da €390/mese</p>
          <p className="text-sm text-muted-foreground mt-3">
            Luce, gas, acqua e WiFi sempre inclusi. Lavanderia disponibile a pagamento.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
