import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, MessageCircle, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import padovaBg from "@/assets/padova-twilight.jpg";

const availability = [
  { type: "Camere Singole", remaining: 7, total: 24, color: "bg-accent" },
  { type: "Singole Plus", remaining: 3, total: 12, color: "bg-primary" },
  { type: "Camere Doppie", remaining: 2, total: 8, color: "bg-destructive" },
];

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[64px]">
      <motion.div
        key={value}
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="rounded-lg bg-background/15 backdrop-blur-sm border border-background/20 px-3 py-2 text-2xl md:text-3xl font-bold tabular-nums"
      >
        {String(value).padStart(2, "0")}
      </motion.div>
      <span className="text-xs uppercase tracking-wider opacity-70 mt-1">{label}</span>
    </div>
  );
}

export function UrgencySection() {
  const target = new Date("2025-09-01T00:00:00");
  const { days, hours, minutes, seconds } = useCountdown(target);

  const totalSpots = availability.reduce((s, a) => s + a.total, 0);
  const takenSpots = availability.reduce((s, a) => s + (a.total - a.remaining), 0);
  const fillPct = (takenSpots / totalSpots) * 100;

  return (
    <section className="py-20 bg-foreground text-background">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
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

        {/* Live countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-10 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 text-sm opacity-70 mb-3">
            <Clock className="h-4 w-4" /> Tempo rimasto a Settembre 2025
          </div>
          <div className="flex gap-3 md:gap-4">
            <CountdownBox value={days} label="giorni" />
            <CountdownBox value={hours} label="ore" />
            <CountdownBox value={minutes} label="min" />
            <CountdownBox value={seconds} label="sec" />
          </div>
        </motion.div>

        {/* Global progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 max-w-xl mx-auto"
        >
          <div className="flex items-center justify-between text-sm mb-2 opacity-80">
            <span>{takenSpots} posti su {totalSpots} già assegnati</span>
            <span className="font-bold">{Math.round(fillPct)}%</span>
          </div>
          <div className="h-3 rounded-full bg-background/15 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${fillPct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-accent via-primary to-destructive"
            />
          </div>
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
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${((item.total - item.remaining) / item.total) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                  className={`h-full rounded-full ${item.color}`}
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
          <Button asChild size="lg" variant="outline" className="text-base border-background/30 text-background hover:bg-background/10 hover:text-background">
            <a href="https://wa.me/390000000000" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" /> Scrivici su WhatsApp
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
