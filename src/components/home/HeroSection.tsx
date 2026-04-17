import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Users, MapPin, CheckCircle, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountUp, KenBurns, GradientMesh } from "@/components/motion/MotionWrappers";

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

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-muted via-background to-muted">
      <GradientMesh />
      <div className="container relative py-16 md:py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid items-center gap-12 lg:grid-cols-2"
        >
          {/* Left Column */}
          <div className="space-y-6">
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <Info className="h-3.5 w-3.5" /> Posti limitati per Settembre 2025
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-heading text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl text-foreground"
            >
              La Tua Casa a Padova,{" "}
              <span className="text-primary">Senza Pensieri.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="max-w-lg text-lg text-muted-foreground"
            >
              Camera privata con tutto incluso — WiFi, palestra, bollette —
              <strong className="text-foreground"> a partire da €480/mese</strong>. A pochi minuti dall'università.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="text-base">
                <Link to="/camere">
                  Scopri le Camere <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link to="/contatti">Prenota una visita</Link>
              </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-8 pt-6 border-t border-border"
            >
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-[hsl(var(--google-yellow))]" />
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    <CountUp to={4.9} decimals={1} suffix="★" />
                  </p>
                  <p className="text-xs text-muted-foreground">127 recensioni Google</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[hsl(var(--google-blue))]" />
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    <CountUp to={98} suffix="%" />
                  </p>
                  <p className="text-xs text-muted-foreground">rinnova il contratto</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[hsl(var(--google-red))]" />
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    <CountUp to={0} prefix="€" />
                  </p>
                  <p className="text-xs text-muted-foreground">costi nascosti</p>
                </div>
              </div>
            </motion.div>

            {/* Trust badges */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-2">
              {[
                { icon: <CheckCircle className="h-4 w-4 text-success" />, text: "Contratto regolare" },
                { icon: <Clock className="h-4 w-4 text-primary" />, text: "Assistenza 24/7" },
                { icon: <CheckCircle className="h-4 w-4 text-success" />, text: "Tutto incluso" },
              ].map((badge) => (
                <span key={badge.text} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  {badge.icon} {badge.text}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Image Collage */}
          <motion.div variants={itemVariants} className="relative hidden lg:block">
            <div className="absolute -right-4 -top-4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-4 -left-4 h-48 w-48 rounded-full bg-[hsl(var(--google-green))]/10 blur-2xl" />

            <div className="relative z-10 overflow-hidden rounded-2xl shadow-2xl">
              <KenBurns
                src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=500&fit=crop"
                alt="Camera studentato moderna"
                className="h-64 w-full object-cover"
              />
            </div>

            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="absolute -left-6 top-1/2 z-20 overflow-hidden rounded-xl shadow-xl"
            >
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop"
                alt="Studenti in comune"
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
                src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&h=300&fit=crop"
                alt="Community studentesca"
                className="h-36 w-48 object-cover"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
