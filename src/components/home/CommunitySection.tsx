import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, BookOpen, MessageSquare, ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn, StaggerContainer, StaggerItem, HoverCard } from "@/components/motion/MotionWrappers";

const features = [
  {
    icon: Calendar,
    title: "Eventi mensili",
    description: "Aperitivi, cene condivise, serate film e tornei. Ogni mese qualcosa di nuovo.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: BookOpen,
    title: "Gruppi studio",
    description: "Incontra coinquilini del tuo corso. Sessioni di studio insieme, prima degli esami.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: MessageSquare,
    title: "Bacheca community",
    description: "Scambia libri, organizza viaggi, trova compagni di palestra o per un caffè.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
];

const galleryImages = [
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80",
];

export function CommunitySection() {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-[hsl(var(--google-blue))]/[0.08] to-[hsl(var(--google-red))]/[0.08] relative overflow-hidden">
      {/* Decorative blob */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="container relative">
        <FadeIn className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-1.5 text-sm font-semibold text-accent mb-4">
            <Users className="h-4 w-4" /> Community
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Più di una camera.<br />
            Una <span className="text-accent">community</span>.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Eventi, aperitivi, gruppi studio. A Studentato Napoleone non sei mai solo.
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {features.map((f) => (
            <StaggerItem key={f.title}>
              <HoverCard className="h-full rounded-2xl border bg-card p-6 shadow-sm">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${f.bg} mb-4`}>
                  <f.icon className={`h-6 w-6 ${f.color}`} />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground">{f.description}</p>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Gallery collage */}
        <FadeIn className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {galleryImages.map((src, i) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                whileHover={{ scale: 1.04 }}
                className={`relative overflow-hidden rounded-xl ${
                  i === 0 ? "md:col-span-2 md:row-span-2 aspect-square md:aspect-auto" : "aspect-square"
                }`}
              >
                <img
                  src={src}
                  alt={`Momento community studenti ${i + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </FadeIn>

        <FadeIn className="text-center">
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/vantaggi">
              Scopri l'area community <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
