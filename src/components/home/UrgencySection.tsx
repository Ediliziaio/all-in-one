import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, MessageCircle, AlertTriangle, Clock, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountUp, Parallax } from "@/components/motion/MotionWrappers";
import padovaBg from "@/assets/padova-twilight.jpg";

const availability = [
  { type: "Camere Singole", remaining: 7, total: 24 },
  { type: "Singole Plus", remaining: 3, total: 12 },
  { type: "Camere Doppie", remaining: 2, total: 8 },
];

function getNextSeptemberFirst() {
  const now = new Date();
  const year = now.getFullYear();
  const sep = new Date(year, 8, 1, 0, 0, 0);
  return now.getTime() > sep.getTime() ? new Date(year + 1, 8, 1, 0, 0, 0) : sep;
}

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
    <div className="flex flex-col items-center min-w-[72px] md:min-w-[88px]">
      <motion.div
        key={value}
        initial={{ y: -6, opacity: 0.6 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="rounded-2xl bg-background/10 backdrop-blur-md border border-background/25 px-4 py-3 md:px-5 md:py-4 text-4xl md:text-5xl font-black tabular-nums shadow-lg shadow-black/20 w-full text-center"
      >
        {String(value).padStart(2, "0")}
      </motion.div>
      <span className="text-[10px] uppercase tracking-[0.2em] opacity-70 mt-2 font-semibold">{label}</span>
    </div>
  );
}

export function UrgencySection() {
  const target = useMemo(() => getNextSeptemberFirst(), []);
  const targetYear = target.getFullYear();
  const { days, hours, minutes, seconds } = useCountdown(target);

  const totalSpots = availability.reduce((s, a) => s + a.total, 0);
  const takenSpots = availability.reduce((s, a) => s + (a.total - a.remaining), 0);
  const fillPct = (takenSpots / totalSpots) * 100;

  return (
    <section className="relative py-16 md:py-24 text-background overflow-hidden">
      <Parallax offset={60} className="absolute inset-0">
        <img
          src={padovaBg}
          alt=""
          aria-hidden="true"
          loading="lazy"
          width={1920}
          height={1080}
          className="absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover opacity-60"
        />
      </Parallax>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/85 to-[hsl(var(--google-blue))]/80" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary/60 to-transparent" />

      {/* Cinematic radial vignette */}
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_hsl(var(--primary)/0.75)_100%)]" />

      {/* Decorative blobs */}
      <div aria-hidden className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[hsl(var(--google-blue))]/15 blur-3xl" />
      <div aria-hidden className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-[hsl(var(--google-yellow))]/10 blur-3xl" />

      <div className="container max-w-4xl relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--google-yellow))]/20 backdrop-blur-md border border-[hsl(var(--google-yellow))]/40 px-4 py-1.5 text-sm font-bold mb-5 text-[hsl(var(--google-yellow))]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--google-yellow))] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(var(--google-yellow))]" />
            </span>
            <AlertTriangle className="h-4 w-4" /> Disponibilità limitata
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold leading-tight">
            I Posti Per Settembre {targetYear}<br />Stanno Finendo
          </h2>
          <p className="mt-5 text-lg opacity-85 max-w-2xl mx-auto">
            Ogni settimana riceviamo <strong className="text-[hsl(var(--google-yellow))]">40+ richieste</strong>. Non aspettare l'ultimo giorno.
          </p>
        </motion.div>

        {/* Live countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 text-xs md:text-sm uppercase tracking-widest opacity-80 mb-4 font-semibold">
            <Clock className="h-4 w-4" /> Tempo rimasto a Settembre {targetYear}
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <CountdownBox value={days} label="giorni" />
            <span className="text-3xl md:text-4xl font-black opacity-40 -mt-6">:</span>
            <CountdownBox value={hours} label="ore" />
            <span className="text-3xl md:text-4xl font-black opacity-40 -mt-6">:</span>
            <CountdownBox value={minutes} label="min" />
            <span className="text-3xl md:text-4xl font-black opacity-40 -mt-6">:</span>
            <CountdownBox value={seconds} label="sec" />
          </div>
        </motion.div>

        {/* Global progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 max-w-xl mx-auto"
        >
          <div className="flex items-center justify-between text-sm mb-2 opacity-90">
            <span><CountUp to={takenSpots} duration={1.6} className="font-bold" /> posti su {totalSpots} già assegnati</span>
            <CountUp to={Math.round(fillPct)} duration={1.6} suffix="%" className="font-bold" />
          </div>
          <div className="h-3 rounded-full bg-background/15 overflow-hidden border border-background/20">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${fillPct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-background to-[hsl(var(--google-yellow))]"
            />
          </div>
          <div className="mt-2 flex items-center justify-center gap-1.5 text-xs opacity-70">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--google-yellow))] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[hsl(var(--google-yellow))]" />
            </span>
            Aggiornato oggi
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          {availability.map((item, i) => {
            const isLast = item.remaining <= 3;
            const takenPct = ((item.total - item.remaining) / item.total) * 100;
            return (
              <motion.div
                key={item.type}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative rounded-2xl border border-background/25 bg-background/10 p-6 text-center backdrop-blur-md shadow-xl shadow-black/10"
              >
                {isLast && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-[hsl(var(--google-yellow))] px-3 py-0.5 text-[11px] font-bold text-foreground shadow-lg">
                    <Flame className="h-3 w-3" /> Ultimi posti
                  </span>
                )}
                <p className="text-sm font-medium opacity-80 mb-2">{item.type}</p>
                <CountUp to={item.remaining} duration={1.4} className="text-5xl md:text-6xl font-black drop-shadow-md leading-none block" />
                <p className="text-xs opacity-70 mt-2">rimaste su {item.total}</p>
                <div className="mt-4 h-1.5 rounded-full bg-background/20 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${takenPct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                    className="h-full rounded-full bg-background/80"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button asChild size="lg" className="text-base bg-[hsl(var(--google-yellow))] text-primary hover:bg-[hsl(var(--google-yellow))]/90 shadow-xl shadow-black/20 font-bold">
            <Link to="/camere">
              Blocca il Tuo Posto <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-base border-background/40 bg-background/5 text-background hover:bg-background/15 hover:text-background backdrop-blur-md">
            <a href="https://wa.me/390000000000" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-4 w-4 text-[hsl(var(--google-green))]" /> Scrivici su WhatsApp
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
