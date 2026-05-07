import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Users, MapPin, CheckCircle, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountUp, KenBurns, GradientMesh } from "@/components/motion/MotionWrappers";
import padovaBg from "@/assets/padova-twilight.jpg";
import cameraMansardaTravi from "@/assets/camera-mansarda-travi.jpg";
import cameraDoppiaTurchese from "@/assets/camera-doppia-turchese.jpg";
import cameraMatrimonialeRossa from "@/assets/camera-matrimoniale-rossa.jpg";
import corridoioImg from "@/assets/studentato-corridoio.jpg";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.18 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const floatingVariants = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const },
  },
};

// Anno dinamico: se siamo dopo settembre, mostra l'anno successivo
const now = new Date();
const displayYear = now.getMonth() > 8 ? now.getFullYear() + 1 : now.getFullYear();

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Background image — Padova sfumata che si fonde con la navbar glass */}
      <img
        src={padovaBg}
        alt=""
        aria-hidden
        loading="eager"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25"
        style={{
          maskImage: "linear-gradient(to bottom, hsl(0 0% 0% / 1) 0%, hsl(0 0% 0% / 0.8) 40%, hsl(0 0% 0% / 0.4) 80%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, hsl(0 0% 0% / 1) 0%, hsl(0 0% 0% / 0.8) 40%, hsl(0 0% 0% / 0.4) 80%, transparent 100%)",
        }}
      />
      {/* Bottom fade — transizione verso la sezione successiva */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      {/* Side fade desktop — riduce distrazione laterale dietro al testo */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-background/70 to-transparent lg:block" />

      <GradientMesh className="opacity-60" />
      {/* Decorative blob behind text on desktop */}
      <div aria-hidden className="pointer-events-none absolute left-0 top-1/3 hidden h-96 w-96 rounded-full bg-primary/5 blur-3xl lg:block" />

      <div className="container relative z-10 pt-28 pb-12 md:pt-32 md:pb-20 lg:pt-36 lg:pb-28">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12"
        >
          {/* Mobile/Tablet hero image (hidden on desktop) */}
          <motion.div
            variants={itemVariants}
            className="relative lg:hidden"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <KenBurns
                src={cameraMansardaTravi}
                alt="Studentato Napoleone — camera mansarda con travi a vista"
                className="h-56 w-full object-cover sm:h-72"
              />
              {/* Bottom gradient overlay for badge readability */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
              {/* Floating rating badge */}
              <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-background/85 px-3 py-1.5 text-sm font-semibold text-foreground shadow-lg backdrop-blur-md">
                <Star className="h-4 w-4 fill-[hsl(var(--google-yellow))] text-[hsl(var(--google-yellow))]" />
                <span>4.9</span>
                <span className="text-xs font-normal text-muted-foreground">· 127 recensioni</span>
              </div>
              {/* Floating "Posti limitati" badge */}
              <div className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-primary/95 px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-lg backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-foreground" />
                </span>
                Settembre {displayYear}
              </div>
            </div>
          </motion.div>

          {/* Left Column: Content */}
          <div className="space-y-6 text-center lg:text-left">
            {/* Posti limitati badge — desktop only (mobile shows it on the image) */}
            <motion.div variants={itemVariants} className="hidden lg:flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <Info className="h-3.5 w-3.5" /> Camere disponibili a Padova · A.A. {displayYear}/{displayYear + 1}
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-heading text-3xl sm:text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl text-foreground"
            >
              Alloggio Studenti a Padova,{" "}
              <span className="text-primary">Tutto Incluso.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mx-auto max-w-lg text-base sm:text-lg text-muted-foreground lg:mx-0"
            >
              Camera singola o posto letto in doppia — WiFi fibra, utenze e cucina incluse —
              <strong className="text-foreground"> da €390/mese</strong>. A 5 minuti dall'Università di Padova.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:justify-center lg:justify-start flex-wrap gap-3">
              <Button asChild size="lg" className="text-base w-full sm:w-auto">
                <Link to="/camere">
                  Scopri le Camere <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base w-full sm:w-auto">
                <Link to="/contatti">Prenota una visita gratuita</Link>
              </Button>
            </motion.div>

            {/* Stats grid — card layout for better breathing room */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-2 sm:gap-3 pt-6 border-t border-border"
            >
              <div className="flex flex-col items-center lg:items-start gap-1 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 p-3 sm:p-4">
                <Star className="h-5 w-5 text-[hsl(var(--google-yellow))]" />
                <p className="text-xl sm:text-2xl font-bold text-foreground leading-none">
                  <CountUp to={4.9} decimals={1} suffix="★" />
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight text-center lg:text-left">127 recensioni</p>
              </div>
              <div className="flex flex-col items-center lg:items-start gap-1 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 p-3 sm:p-4">
                <Users className="h-5 w-5 text-[hsl(var(--google-blue))]" />
                <p className="text-xl sm:text-2xl font-bold text-foreground leading-none">
                  <CountUp to={98} suffix="%" />
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight text-center lg:text-left">rinnova contratto</p>
              </div>
              <div className="flex flex-col items-center lg:items-start gap-1 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 p-3 sm:p-4">
                <MapPin className="h-5 w-5 text-[hsl(var(--google-red))]" />
                <p className="text-xl sm:text-2xl font-bold text-foreground leading-none">
                  <CountUp to={0} prefix="€" />
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight text-center lg:text-left">costi nascosti</p>
              </div>
            </motion.div>

            {/* Trust badges — pill style */}
            <motion.div variants={itemVariants} className="flex flex-wrap justify-center lg:justify-start gap-2 pt-1">
              {[
                { icon: <CheckCircle className="h-3.5 w-3.5 text-success" />, text: "Contratto regolare" },
                { icon: <Clock className="h-3.5 w-3.5 text-primary" />, text: "Vicino a UniPD" },
                { icon: <CheckCircle className="h-3.5 w-3.5 text-success" />, text: "Tutto incluso" },
              ].map((badge) => (
                <span
                  key={badge.text}
                  className="inline-flex items-center gap-1.5 rounded-full bg-muted/70 border border-border/60 px-3 py-1 text-xs font-medium text-foreground"
                >
                  {badge.icon} {badge.text}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Image Collage (desktop only) */}
          <motion.div variants={itemVariants} className="relative hidden lg:block">
            <div className="absolute -right-4 -top-4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-4 -left-4 h-48 w-48 rounded-full bg-[hsl(var(--google-green))]/10 blur-2xl" />

            <div className="relative z-10 overflow-hidden rounded-2xl shadow-2xl">
              <KenBurns
                src={cameraMansardaTravi}
                alt="Studentato Napoleone — camera mansarda con travi a vista"
                className="h-64 w-full object-cover"
              />
            </div>

            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="absolute -left-6 top-1/2 z-20 overflow-hidden rounded-xl shadow-xl"
            >
              <img
                src={cameraDoppiaTurchese}
                alt="Studentato Napoleone — camera doppia con testiere turchesi"
                loading="lazy"
                className="h-40 w-56 object-cover"
              />
            </motion.div>

            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="absolute -right-2 bottom-0 z-20 overflow-hidden rounded-xl shadow-xl"
              style={{ animationDelay: "1s" }}
            >
              <img
                src={cameraMatrimonialeRossa}
                alt="Studentato Napoleone — camera matrimoniale con copriletto rosso"
                loading="lazy"
                className="h-36 w-48 object-cover"
              />
            </motion.div>

            {/* Third floating photo — top right for balance */}
            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="absolute -right-4 -top-6 z-20 overflow-hidden rounded-xl shadow-xl border-4 border-background"
              style={{ animationDelay: "2s" }}
            >
              <img
                src={corridoioImg}
                alt="Studentato Napoleone — corridoio con porte colorate"
                loading="lazy"
                className="h-28 w-28 object-cover"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
