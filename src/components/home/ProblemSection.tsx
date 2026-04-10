import { motion } from "framer-motion";
import { AlertTriangle, Thermometer, PhoneOff, Users, WifiOff, FileWarning } from "lucide-react";

const problems = [
  { icon: Thermometer, text: "Bollette che raddoppiano d'inverno — e nessuno ti avvisa" },
  { icon: PhoneOff, text: "Proprietari irraggiungibili quando si rompe qualcosa" },
  { icon: Users, text: "Coinquilini trovati su Facebook che non puliscono mai" },
  { icon: WifiOff, text: "WiFi che muore durante le videolezioni (proprio durante l'esame)" },
  { icon: FileWarning, text: "Contratti con clausole trappola che scopri solo quando è tardi" },
];

export function ProblemSection() {
  return (
    <section className="py-20 bg-destructive/5">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-1.5 text-sm font-semibold text-destructive mb-4">
            <AlertTriangle className="h-4 w-4" /> La verità che nessuno ti dice
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            L'affitto tradizionale a Padova<br />
            <span className="text-destructive">è un incubo.</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            Ogni anno centinaia di studenti firmano contratti alla cieca, pagano troppo e vivono male. 
            Ti suona familiare?
          </p>
        </motion.div>

        <div className="space-y-4">
          {problems.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="flex items-center gap-4 rounded-xl border border-destructive/20 bg-card p-5"
            >
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <p.icon className="h-5 w-5 text-destructive" />
              </div>
              <p className="text-foreground font-medium">{p.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-10 text-xl font-bold text-foreground"
        >
          Noi abbiamo eliminato <span className="text-primary">ognuno</span> di questi problemi.
        </motion.p>
      </div>
    </section>
  );
}
