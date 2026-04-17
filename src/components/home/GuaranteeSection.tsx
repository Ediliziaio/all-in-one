import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle, FileText, Clock, Coins } from "lucide-react";

const guarantees = [
  { icon: FileText, text: "Contratto regolare e registrato — nessuna zona grigia" },
  { icon: Coins, text: "Zero costi nascosti — il prezzo che vedi è quello che paghi" },
  { icon: Clock, text: "Disdetta con 1 mese di preavviso — nessun vincolo capestro" },
  { icon: CheckCircle, text: "Cauzione restituita al 100% se la camera è in ordine" },
];

export function GuaranteeSection() {
  return (
    <section className="py-12 md:py-20 bg-primary/5">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            La Nostra Promessa:<br />
            <span className="text-primary">Se Non Sei Soddisfatto</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            Se nelle prime 2 settimane non ti trovi bene, ti aiutiamo a trovare una soluzione. 
            Nessuna penale, nessun vincolo nascosto. Il rischio è tutto nostro.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {guarantees.map((g, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="flex items-start gap-3 rounded-xl border bg-card p-5"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <g.icon className="h-5 w-5 text-primary" />
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
          Più di 500 studenti si sono già fidati. Il 98% ha rinnovato il contratto.
        </motion.p>
      </div>
    </section>
  );
}
