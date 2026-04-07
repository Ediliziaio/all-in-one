import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { MapPin, Banknote, Users, HeadphonesIcon, FileText, CalendarHeart, Check, X as XIcon } from "lucide-react";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/MotionWrappers";

const vantaggi = [
  { icon: MapPin, title: "Posizione strategica", desc: "A 5 minuti a piedi dall'Università di Padova, vicino a Prato della Valle, trasporti e vita cittadina." },
  { icon: Banknote, title: "Tutto incluso nel prezzo", desc: "Canone unico con utenze, WiFi, pulizia aree comuni, manutenzione e accesso a tutti i servizi." },
  { icon: Users, title: "Community studentesca", desc: "Vivi con altri studenti, partecipa a eventi sociali, gruppi studio e attività organizzate ogni settimana." },
  { icon: HeadphonesIcon, title: "Supporto dedicato", desc: "Team di assistenza disponibile per manutenzione, problemi tecnici e qualsiasi necessità quotidiana." },
  { icon: FileText, title: "Contratti flessibili", desc: "Durata semestrale o annuale, senza vincoli complessi. Disdici con preavviso di un mese." },
  { icon: CalendarHeart, title: "Eventi e networking", desc: "Serate cinema, tornei sportivi, aperitivi e workshop professionali per arricchire la tua esperienza." },
];

const comparison = [
  { feature: "Utenze incluse", us: true, trad: false },
  { feature: "WiFi Fibra 1Gbps", us: true, trad: false },
  { feature: "Manutenzione inclusa", us: true, trad: false },
  { feature: "Pulizia aree comuni", us: true, trad: false },
  { feature: "Community e eventi", us: true, trad: false },
  { feature: "Contratto flessibile", us: true, trad: false },
  { feature: "Nessun deposito cauzionale", us: true, trad: false },
  { feature: "Palestra e sale studio", us: true, trad: false },
];

const testimonials = [
  { name: "Giulia R.", course: "Medicina, 3° anno", text: "Vivere allo studentato è stata la scelta migliore. Ho trovato compagni di studio e amici per la vita." },
  { name: "Marco T.", course: "Ingegneria, 2° anno", text: "Il rapporto qualità-prezzo è imbattibile. WiFi veloce, camera pulita e zero pensieri per le bollette." },
  { name: "Sofia L.", course: "Psicologia, 1° anno", text: "Mi sono ambientata subito grazie agli eventi della community. Mi sento davvero a casa!" },
];

const Vantaggi = () => (
  <Layout>
    <PageTransition>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1400&h=500&fit=crop"
            alt="Vantaggi dello studentato"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
        </div>
        <div className="container relative z-10">
          <FadeIn>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground max-w-xl">I vantaggi di vivere con noi</h1>
            <p className="text-muted-foreground mt-3 text-lg max-w-lg">
              Molto più di un posto letto. Un'esperienza completa pensata per il tuo percorso universitario.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Vantaggi Grid */}
      <section className="py-16">
        <div className="container">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vantaggi.map((v) => (
              <StaggerItem key={v.title}>
                <div className="rounded-xl border bg-card p-6 hover:shadow-lg transition-shadow h-full">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <v.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-card-foreground">{v.title}</h3>
                  <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{v.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16 bg-muted/50">
        <div className="container max-w-2xl">
          <FadeIn>
            <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-10">StudentatoPD vs Affitto tradizionale</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="rounded-xl border bg-card overflow-hidden">
              <div className="grid grid-cols-3 text-center font-heading font-semibold text-sm p-4 border-b bg-muted/30">
                <span className="text-left text-foreground">Caratteristica</span>
                <span className="text-accent">StudentatoPD</span>
                <span className="text-muted-foreground">Affitto</span>
              </div>
              {comparison.map((row, i) => (
                <div key={row.feature} className={`grid grid-cols-3 text-center text-sm p-4 ${i < comparison.length - 1 ? "border-b" : ""}`}>
                  <span className="text-left text-foreground">{row.feature}</span>
                  <span>{row.us ? <Check className="h-5 w-5 text-success mx-auto" /> : <XIcon className="h-5 w-5 text-destructive mx-auto" />}</span>
                  <span>{row.trad ? <Check className="h-5 w-5 text-success mx-auto" /> : <XIcon className="h-5 w-5 text-destructive mx-auto" />}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container">
          <FadeIn>
            <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-10">Cosa dicono i nostri studenti</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {testimonials.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.1}>
                <div className="rounded-xl border bg-card p-6">
                  <p className="text-muted-foreground text-sm italic leading-relaxed">"{t.text}"</p>
                  <div className="mt-4 pt-4 border-t">
                    <p className="font-heading font-semibold text-card-foreground text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.course}</p>
                  </div>
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
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Convinto? Inizia da qui</h2>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">Esplora le camere disponibili e prenota il tuo posto allo StudentatoPD.</p>
            <Button size="lg" className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link to="/camere">Vedi le camere</Link>
            </Button>
          </div>
        </section>
      </FadeIn>
    </PageTransition>
  </Layout>
);

export default Vantaggi;
