import { motion } from "framer-motion";
import { Shield, Users, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { FadeIn } from "@/components/motion/MotionWrappers";
import { Button } from "@/components/ui/button";
import esternoImg from "@/assets/studentato-esterno.jpg";

const values = [
  {
    icon: Shield,
    title: "Trasparenza",
    desc: "Contratti regolari registrati, nessuna sorpresa nascosta.",
    color: "text-[hsl(var(--google-blue))]",
    bg: "bg-[hsl(var(--google-blue))]/10",
  },
  {
    icon: Users,
    title: "Community",
    desc: "Eventi, aperitivi e supporto tra studenti tutto l'anno.",
    color: "text-[hsl(var(--google-green))]",
    bg: "bg-[hsl(var(--google-green))]/10",
  },
  {
    icon: Zap,
    title: "Risposta rapida",
    desc: "Scrivi su WhatsApp: rispondiamo in orario di ufficio, Lun–Ven 9–17.",
    color: "text-[hsl(var(--google-yellow))]",
    bg: "bg-[hsl(var(--google-yellow))]/10",
  },
];

const stats = [
  { value: "500+", label: "Studenti ospitati", color: "text-[hsl(var(--google-red))]" },
  { value: "98%", label: "Rinnovi contratto", color: "text-[hsl(var(--google-yellow))]" },
  { value: "4.9★", label: "Google Reviews", color: "text-[hsl(var(--google-green))]" },
];

export function AboutSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-muted/40 via-background to-muted/20">
      <div className="container max-w-6xl">
        <FadeIn className="text-center mb-12 md:mb-16">
          <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-accent mb-3">
            Il tuo punto di riferimento a Padova
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
            Studentato Napoleone Padova
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mt-3">
            Alloggi per studenti universitari dal cuore di Padova
          </p>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16">
          {/* Image */}
          <FadeIn direction="right">
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/5] md:aspect-[5/6]">
                <img
                  src={esternoImg}
                  alt="Studentato Napoleone — facciata storica con archi"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs uppercase tracking-wider opacity-90">Studentato Napoleone</p>
                  <p className="font-heading text-lg font-semibold">Facciata storica · Padova</p>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Content */}
          <FadeIn direction="left" delay={0.1}>
            <div className="space-y-6">
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                <span className="text-foreground font-semibold">Studentato Napoleone</span> è la soluzione di alloggio pensata per chi studia all'Università di Padova. Camere singole e doppie, tutto incluso nel canone, a pochi passi dal centro. Non un'agenzia immobiliare: contratti chiari, spazi curati, persone vere che ti accompagnano dal primo giorno.
              </p>

              <div className="space-y-4 pt-2">
                {values.map((v, i) => {
                  const Icon = v.icon;
                  return (
                    <motion.div
                      key={v.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className={`shrink-0 ${v.bg} ${v.color} rounded-xl h-11 w-11 flex items-center justify-center`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{v.title}</p>
                        <p className="text-sm text-muted-foreground">{v.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="pt-2">
                <Button asChild size="lg" className="group">
                  <Link to="/vantaggi">
                    Scopri i vantaggi
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Stats strip */}
        <FadeIn>
          <div className="rounded-2xl border bg-card/50 backdrop-blur-sm py-8 px-4">
            <div className="grid grid-cols-3 divide-x divide-border">
              {stats.map((s) => (
                <div key={s.label} className="text-center px-4 py-4 md:py-2">
                  <p className={`font-heading text-3xl md:text-4xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1 uppercase tracking-wide">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
