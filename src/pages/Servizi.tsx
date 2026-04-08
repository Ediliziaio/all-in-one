import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Wifi, WashingMachine, UtensilsCrossed, Dumbbell, Shield, BookOpen, CheckCircle, ShieldCheck, Clock, FileText } from "lucide-react";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/MotionWrappers";

const services = [
  {
    icon: Wifi,
    title: "WiFi che non ti lascia mai",
    description: "Lezioni online, Netflix, videochiamate: tutto senza lag. Fibra 1Gbps in ogni camera e nelle aree comuni.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
  },
  {
    icon: WashingMachine,
    title: "Lava quando vuoi",
    description: "Lavatrici e asciugatrici 24/7, prenotabili dall'app. Zero code, zero attese, zero monete.",
    image: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=600&h=400&fit=crop",
  },
  {
    icon: UtensilsCrossed,
    title: "Cucina come a casa",
    description: "Piani induzione, forno, microonde e frigo su ogni piano. Cucinati i tuoi piatti preferiti quando vuoi.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
  },
  {
    icon: Dumbbell,
    title: "Allenati sotto casa",
    description: "Cardio e pesi liberi inclusi nel canone, dalle 6 alle 23. Niente abbonamenti extra, niente spostamenti.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop",
  },
  {
    icon: Shield,
    title: "I tuoi genitori saranno tranquilli",
    description: "Badge elettronico, telecamere nelle aree comuni e portineria. Sempre al sicuro, giorno e notte.",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&h=400&fit=crop",
  },
  {
    icon: BookOpen,
    title: "Sessione d'esame? Ci pensiamo noi",
    description: "Sale silenziose prenotabili con prese, luce perfetta e postazioni ergonomiche. Concentrati, al resto pensiamo noi.",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=400&fit=crop",
  },
];

const whyUs = [
  { title: "Un canone, zero sorprese", desc: "Utenze, WiFi, pulizia aree comuni e manutenzione: tutto dentro. Niente bollette extra." },
  { title: "Community vera", desc: "Eventi settimanali, gruppi studio e attività sociali. Non sei solo un inquilino, sei parte di qualcosa." },
  { title: "A 5 minuti dall'uni", desc: "Posizione strategica nel cuore di Padova, vicino a trasporti, negozi e tutto ciò che serve." },
];

const parentTrust = [
  { icon: ShieldCheck, title: "Contratto regolare", desc: "Contratto di locazione registrato, conforme alla normativa. Nessuna zona grigia." },
  { icon: Clock, title: "Assistenza sempre disponibile", desc: "Team di supporto reperibile per emergenze e manutenzione, anche nei weekend." },
  { icon: FileText, title: "Trasparenza totale", desc: "Prezzo chiaro all'ingresso, nessun costo nascosto. Quello che vedi è quello che paghi." },
];

const Servizi = () => (
  <Layout>
    <PageTransition>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&h=500&fit=crop"
            alt="Servizi dello studentato"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
        </div>
        <div className="container relative z-10">
          <FadeIn>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground max-w-xl">I nostri servizi</h1>
            <p className="text-muted-foreground mt-3 text-lg max-w-lg">
              Tutto quello che serve, niente di superfluo. Un canone, zero sorprese.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s) => (
              <StaggerItem key={s.title}>
                <div className="rounded-xl overflow-hidden border bg-card group hover:shadow-lg transition-shadow">
                  <div className="aspect-video overflow-hidden">
                    <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <s.icon className="h-5 w-5 text-accent" />
                      </div>
                      <h3 className="font-heading font-semibold text-lg text-card-foreground">{s.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{s.description}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <FadeIn>
            <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-12">Perché scegliere noi</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {whyUs.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 text-success mx-auto mb-3" />
                  <h3 className="font-heading font-semibold text-lg text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mt-2">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Per i genitori */}
      <section className="py-16">
        <div className="container">
          <FadeIn>
            <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-4">Per i genitori</h2>
            <p className="text-muted-foreground text-center max-w-lg mx-auto mb-12">
              Sappiamo che spesso siete voi a cercare e a preoccuparvi. Ecco perché potete stare tranquilli.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {parentTrust.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <div className="rounded-xl border bg-card p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-card-foreground">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mt-2">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <FadeIn>
        <section className="py-16 bg-muted/50">
          <div className="container text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Pronto a trasferirti?</h2>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">Scopri le camere disponibili e richiedi il tuo posto.</p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                <Link to="/camere">Vedi camere e prezzi</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contatti">Richiedi info</Link>
              </Button>
            </div>
          </div>
        </section>
      </FadeIn>
    </PageTransition>
  </Layout>
);

export default Servizi;
