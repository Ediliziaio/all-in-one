import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Users, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-10" />
      <div className="container relative py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl space-y-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-accent">
            🔥 Ultime 8 camere disponibili per settembre
          </span>

          <h1 className="font-heading text-4xl md:text-6xl font-extrabold leading-tight">
            La tua casa a Padova.{" "}
            <span className="text-accent">Senza stress.</span>
          </h1>

          <p className="text-lg text-primary-foreground/80 max-w-lg">
            Camere moderne, servizi all-inclusive e una community di studenti a pochi passi dall'università.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base">
              <Link to="/camere">
                Scopri le camere <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base">
              <Link to="/camere">Richiedi info</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 pt-6 border-t border-primary-foreground/20">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-accent" />
              <div>
                <p className="text-2xl font-bold">45</p>
                <p className="text-xs text-primary-foreground/60">Camere</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              <div>
                <p className="text-2xl font-bold">200+</p>
                <p className="text-xs text-primary-foreground/60">Studenti ospitati</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-accent" />
              <div>
                <p className="text-2xl font-bold">4.9</p>
                <p className="text-xs text-primary-foreground/60">Rating medio</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
