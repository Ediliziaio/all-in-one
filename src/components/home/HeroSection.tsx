import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Users, MapPin, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const floatingVariants = {
  animate: {
    y: [0, -8, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const },
  },
};

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-muted via-background to-muted">
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
              <span className="inline-flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-1.5 text-sm font-bold text-destructive">
                <AlertTriangle className="h-3.5 w-3.5" /> Solo 7 posti rimasti per Settembre 2025
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-heading text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl text-foreground"
            >
              Smetti di Buttare Soldi in Affitti Che Ti{" "}
              <span className="text-primary">Rovinano l'Università.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="max-w-lg text-lg text-muted-foreground"
            >
              Camera privata, bollette incluse, palestra, WiFi fibra, sale studio e una community vera — 
              <strong className="text-foreground"> da €480/mese</strong>. A 5 minuti dall'aula.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="text-base">
                <Link to="/camere">
                  Blocca il Tuo Posto <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link to="/contatti">Prenota una visita gratuita</Link>
              </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-8 pt-6 border-t border-border"
            >
              {[
                { icon: <Star className="h-5 w-5 text-[hsl(var(--google-yellow))]" />, value: "4.9★", label: "127 recensioni Google" },
                { icon: <Users className="h-5 w-5 text-[hsl(var(--google-blue))]" />, value: "98%", label: "rinnova (non è un caso)" },
                { icon: <MapPin className="h-5 w-5 text-[hsl(var(--google-red))]" />, value: "€0", label: "costi nascosti" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  {stat.icon}
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Trust badges */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-2">
              {[
                { icon: <CheckCircle className="h-4 w-4 text-success" />, text: "Contratto regolare" },
                { icon: <Clock className="h-4 w-4 text-primary" />, text: "Assistenza 24/7" },
                { icon: <CheckCircle className="h-4 w-4 text-success" />, text: "Tutto incluso, per sempre" },
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

            <motion.div variants={imageVariants} className="relative z-10 overflow-hidden rounded-2xl shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=500&fit=crop"
                alt="Camera studentato moderna"
                className="h-64 w-full object-cover"
              />
            </motion.div>

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
