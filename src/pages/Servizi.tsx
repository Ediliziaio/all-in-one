import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Wifi, WashingMachine, UtensilsCrossed, Dumbbell, Shield, BookOpen, CheckCircle } from "lucide-react";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/MotionWrappers";

const services = [
  {
    icon: Wifi,
    title: "WiFi Fibra 1Gbps",
    description: "Connessione ultraveloce in ogni camera e nelle aree comuni. Streaming, videochiamate e download senza limiti, perfetta per studio e svago.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
  },
  {
    icon: WashingMachine,
    title: "Lavanderia Smart",
    description: "Lavatrici e asciugatrici di ultima generazione disponibili 24/7. Controlla la disponibilità e paga direttamente dall'app.",
    image: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=600&h=400&fit=crop",
  },
  {
    icon: UtensilsCrossed,
    title: "Cucina Comune Attrezzata",
    description: "Cucine moderne condivise su ogni piano con piano cottura a induzione, forno, microonde e frigorifero. Perfette per cucinare i tuoi piatti preferiti.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
  },
  {
    icon: Dumbbell,
    title: "Palestra & Fitness",
    description: "Area fitness attrezzata con cardio e pesi liberi, aperta dalle 6 alle 23. Mantieniti in forma senza uscire dalla residenza.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop",
  },
  {
    icon: Shield,
    title: "Sicurezza 24/7",
    description: "Accesso con badge elettronico, videosorveglianza nelle aree comuni e portineria attiva. La tua sicurezza è la nostra priorità.",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&h=400&fit=crop",
  },
  {
    icon: BookOpen,
    title: "Sale Studio Silenziose",
    description: "Spazi dedicati allo studio individuale e di gruppo, con postazioni ergonomiche, prese elettriche e illuminazione ottimale per la concentrazione.",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=400&fit=crop",
  },
];

const whyUs = [
  { title: "Tutto incluso", desc: "Utenze, WiFi, pulizia aree comuni e manutenzione: un unico canone mensile senza sorprese." },
  { title: "Community attiva", desc: "Eventi settimanali, gruppi studio e attività sociali per sentirti sempre a casa." },
  { title: "Posizione strategica", desc: "A pochi minuti dall'Università di Padova, vicino a trasporti, negozi e vita notturna." },
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
              Tutto ciò di cui hai bisogno per vivere, studiare e crescere. Servizi pensati per semplificarti la vita universitaria.
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

      {/* CTA */}
      <FadeIn>
        <section className="py-16">
          <div className="container text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Pronto a trasferirti?</h2>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">Scopri le camere disponibili e prenota il tuo posto.</p>
            <Button size="lg" className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link to="/camere">Prenota la tua camera</Link>
            </Button>
          </div>
        </section>
      </FadeIn>
    </PageTransition>
  </Layout>
);

export default Servizi;
