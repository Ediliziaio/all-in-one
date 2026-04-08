import { motion } from "framer-motion";
import { Users, Award, Eye } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/MotionWrappers";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { value: "7+", label: "Anni di esperienza" },
  { value: "500+", label: "Studenti ospitati" },
  { value: "98%", label: "Soddisfazione" },
];

const team = [
  { name: "Marco Donati", role: "Fondatore", bio: "Visionario e imprenditore, appassionato di educazione.", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face" },
  { name: "Elena Ferraro", role: "Responsabile Operativa", bio: "Garantisce che tutto funzioni alla perfezione, ogni giorno.", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face" },
  { name: "Luca Martinelli", role: "Community Manager", bio: "Crea connessioni e organizza eventi per gli studenti.", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face" },
  { name: "Giuseppe Rossi", role: "Resp. Manutenzione", bio: "Si occupa di mantenere la struttura sempre al top.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face" },
];

const values = [
  { icon: Users, title: "Comunità", description: "Crediamo che vivere insieme significhi crescere insieme. Ogni studente è parte di una famiglia." },
  { icon: Award, title: "Qualità", description: "Standard elevati in ogni dettaglio: dalla pulizia ai servizi, dalla manutenzione all'assistenza." },
  { icon: Eye, title: "Trasparenza", description: "Prezzi chiari, contratti semplici, comunicazione aperta. Nessuna sorpresa, solo fiducia." },
];

export function AboutSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        {/* Storia */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <FadeIn direction="left">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">Chi Siamo</h2>
            <p className="text-muted-foreground mb-4">
              Fondato nel 2018, StudentatoPD nasce dalla passione di offrire agli studenti universitari di Padova
              un'esperienza abitativa di qualità superiore. Da una gestione familiare con poche camere, siamo cresciuti
              fino a diventare un punto di riferimento per chi cerca comfort, comunità e vicinanza all'università.
            </p>
            <p className="text-muted-foreground mb-8">
              La nostra missione è semplice: creare un ambiente dove ogni studente possa sentirsi a casa,
              concentrarsi sullo studio e costruire amicizie che dureranno per sempre.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-accent">{s.value}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn direction="right">
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=450&fit=crop"
              alt="Studenti nel campus di Padova"
              className="rounded-xl w-full object-cover aspect-[4/3] shadow-lg"
            />
          </FadeIn>
        </div>

        {/* Team */}
        <FadeIn className="text-center mb-10">
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Il Nostro Team</h3>
          <p className="text-muted-foreground mt-2">Le persone che rendono tutto possibile.</p>
        </FadeIn>
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {team.map((m) => (
            <StaggerItem key={m.name}>
              <motion.div
                whileHover={{ scale: 1.04, y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="text-center p-6 h-full">
                  <CardContent className="p-0 flex flex-col items-center gap-3">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={m.avatar} alt={m.name} />
                      <AvatarFallback>{m.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{m.name}</p>
                      <p className="text-sm text-accent font-medium">{m.role}</p>
                      <p className="text-xs text-muted-foreground mt-1">{m.bio}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Valori */}
        <FadeIn className="text-center mb-10">
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground">I Nostri Valori</h3>
        </FadeIn>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v) => (
            <StaggerItem key={v.title}>
              <Card className="text-center p-6 h-full">
                <CardContent className="p-0 flex flex-col items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <v.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h4 className="font-heading text-lg font-semibold text-foreground">{v.title}</h4>
                  <p className="text-sm text-muted-foreground">{v.description}</p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
