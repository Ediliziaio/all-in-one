import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Users, Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const floatingVariants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
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
              <span className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-accent">
                🎓 Disponibile per A.A. 2025/2026
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-1.5 text-sm font-medium text-primary-foreground/90">
                🔥 Ultime 8 camere disponibili
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-heading text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl"
            >
              La tua casa a Padova.{" "}
              <span className="text-accent">Senza stress.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="max-w-lg text-lg text-primary-foreground/80"
            >
              Camere moderne, servizi all-inclusive e una community di studenti
              a pochi passi dall'università.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 text-base"
              >
                <Link to="/camere">
                  Scopri le camere <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base"
              >
                <Link to="/camere">Richiedi info</Link>
              </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-8 pt-6 border-t border-primary-foreground/20"
            >
              {[
                { icon: <Home className="h-5 w-5 text-accent" />, value: "45", label: "Camere" },
                { icon: <Users className="h-5 w-5 text-accent" />, value: "200+", label: "Studenti ospitati" },
                { icon: <Star className="h-5 w-5 text-accent" />, value: "4.9", label: "Rating medio" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  {stat.icon}
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-primary-foreground/60">{stat.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Urgency banner */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3 bg-accent/15 border border-accent/30 rounded-xl px-4 py-3"
            >
              <AlertTriangle className="h-5 w-5 text-accent shrink-0" />
              <p className="text-sm font-medium text-primary-foreground/90">
                <span className="text-accent font-bold">Posti limitati</span> — Solo 8 camere rimaste per settembre 2025. Prenota subito!
              </p>
            </motion.div>
          </div>

          {/* Right Column: Image Collage */}
          <motion.div
            variants={itemVariants}
            className="relative hidden lg:block"
          >
            <div className="absolute -right-4 -top-4 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute -bottom-4 -left-4 h-48 w-48 rounded-full bg-primary-foreground/5 blur-2xl" />

            <motion.div
              variants={imageVariants}
              className="relative z-10 overflow-hidden rounded-2xl shadow-2xl"
            >
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
