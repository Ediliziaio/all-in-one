import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle, FileText, Clock, Coins } from "lucide-react";

const guarantees = [
  { icon: FileText, text: "Locazione registrata all'Agenzia delle Entrate — tutto in regola" },
  { icon: Coins, text: "Il canone mensile è fisso — luce, gas, acqua e WiFi già inclusi" },
  { icon: CheckCircle, text: "Cauzione restituita integralmente a fine contratto se la camera è in ordine" },
];

export function GuaranteeSection() {
  return (
    <section className="py-12 md:py-20 bg-[hsl(var(--google-green))]/[0.07]">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[hsl(var(--google-green))]/15 mb-4">
            <ShieldCheck className="h-8 w-8 text-[hsl(var(--google-green))]" />
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Contratto Registrato,<br /><span className="text-[hsl(var(--google-green))]">Prezzo Fisso</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            Nessuna zona grigia, nessun costo nascosto. Il canone che vedi include tutto: luce, gas, acqua e WiFi.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {guarantees.map((g, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="flex items-start gap-3 rounded-xl border bg-card p-5"
            >
              <div className="h-10 w-10 rounded-full bg-[hsl(var(--google-green))]/10 flex items-center justify-center shrink-0">
                <g.icon className="h-5 w-5 text-[hsl(var(--google-green))]" />
              </div>
              <p className="text-foreground font-medium pt-1.5">{g.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 text-sm text-muted-foreground"
        >
          Oltre 500 studenti ospitati. Il 98% ha rinnovato il contratto l'anno successivo.
        </motion.p>
      </div>
    </section>
  );
}
