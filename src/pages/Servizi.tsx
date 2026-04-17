import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Wifi,
  WashingMachine,
  UtensilsCrossed,
  Dumbbell,
  Shield,
  BookOpen,
  CheckCircle,
  ShieldCheck,
  Clock,
  FileText,
  CalendarHeart,
  Sparkles,
  Sun,
  Coffee,
  Moon,
  HelpCircle,
  Heart,
} from "lucide-react";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem, CountUp } from "@/components/motion/MotionWrappers";

const heroStats = [
  { value: 12, suffix: "+", label: "servizi inclusi" },
  { value: 24, suffix: "/7", label: "sempre disponibili" },
  { value: 0, prefix: "€", label: "costi extra" },
];

const highlights = [
  { icon: Wifi, label: "WiFi 1Gbps" },
  { icon: Dumbbell, label: "Palestra" },
  { icon: WashingMachine, label: "Lavanderia" },
  { icon: UtensilsCrossed, label: "Cucina" },
  { icon: BookOpen, label: "Sale studio" },
  { icon: Shield, label: "Sicurezza" },
];

const services = [
  {
    icon: Wifi,
    title: "WiFi che non ti lascia mai",
    description: "Lezioni online, Netflix, videochiamate: tutto senza lag.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop",
    bullets: ["Fibra 1Gbps in ogni camera", "Copertura totale aree comuni", "Rete protetta WPA3"],
  },
  {
    icon: WashingMachine,
    title: "Lava quando vuoi",
    description: "Lavatrici e asciugatrici 24/7, prenotabili dall'app.",
    image: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=800&h=500&fit=crop",
    bullets: ["6 lavatrici + 4 asciugatrici", "Prenotazione via app", "Detersivo eco fornito"],
  },
  {
    icon: UtensilsCrossed,
    title: "Cucina come a casa",
    description: "Piani induzione, forno, microonde e frigo su ogni piano.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=500&fit=crop",
    bullets: ["Cucina attrezzata per piano", "Frigo personale per studente", "Pulizia quotidiana inclusa"],
  },
  {
    icon: Dumbbell,
    title: "Allenati sotto casa",
    description: "Cardio e pesi liberi inclusi nel canone, dalle 6 alle 23.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=500&fit=crop",
    bullets: ["Tapis, ellittiche, manubri", "Aperta 6:00 - 23:00", "Spogliatoi con docce"],
  },
  {
    icon: Shield,
    title: "Sicurezza totale",
    description: "Badge elettronico, telecamere e portineria. Sempre al sicuro.",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=500&fit=crop",
    bullets: ["Accesso solo con badge", "Videosorveglianza H24", "Portineria diurna"],
  },
  {
    icon: BookOpen,
    title: "Sessione d'esame? Ci pensiamo noi",
    description: "Sale silenziose prenotabili con prese, luce perfetta e ergonomia.",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=500&fit=crop",
    bullets: ["3 sale studio prenotabili", "Wi-Fi dedicato", "Aperte fino a mezzanotte"],
  },
];

const dayInLife = [
  { time: "07:00", icon: Dumbbell, label: "Palestra", desc: "Risveglio attivo prima delle lezioni" },
  { time: "09:00", icon: BookOpen, label: "Sala studio", desc: "Sessione concentrata pre-esame" },
  { time: "13:00", icon: UtensilsCrossed, label: "Cucina", desc: "Pranzo veloce con i coinquilini" },
  { time: "18:00", icon: WashingMachine, label: "Lavanderia", desc: "Lavatrice mentre studi" },
  { time: "21:00", icon: Coffee, label: "Lounge", desc: "Aperitivo in area comune" },
];

const parentTrust = [
  { icon: ShieldCheck, title: "Contratto regolare", desc: "Locazione registrata, conforme alla normativa." },
  { icon: Clock, title: "Assistenza sempre disponibile", desc: "Reperibilità per emergenze, anche nei weekend." },
  { icon: FileText, title: "Trasparenza totale", desc: "Prezzo chiaro all'ingresso. Quello che vedi è quello che paghi." },
  { icon: Heart, title: "Cura quotidiana", desc: "Pulizia aree comuni, manutenzione e supporto inclusi." },
];

const faqs = [
  {
    q: "Posso disdire il contratto in anticipo?",
    a: "Sì. Basta dare 30 giorni di preavviso. Nessuna penale, nessun trucco.",
  },
  {
    q: "Posso ricevere ospiti?",
    a: "Certo. Gli amici sono benvenuti negli orari diurni e con registrazione in portineria. Per il pernottamento basta avvisarci.",
  },
  {
    q: "Cosa succede se si rompe qualcosa?",
    a: "Scrivi su WhatsApp e interveniamo entro 24h. La manutenzione ordinaria è inclusa nel canone.",
  },
  {
    q: "Sono coperto da assicurazione?",
    a: "Sì. La struttura è coperta da polizza RC e i tuoi effetti personali da assicurazione base inclusa.",
  },
];

const Servizi = () => (
  <Layout>
    <PageTransition>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&h=700&fit=crop"
            alt="Servizi dello studentato"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        </div>
        <div className="container relative z-10">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              Tutto incluso, sempre
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground max-w-2xl leading-tight">
              I servizi che servono.<br />
              <span className="text-accent">Niente</span> di superfluo.
            </h1>
            <p className="text-muted-foreground mt-4 text-lg max-w-xl">
              12+ servizi pensati per la vita universitaria. Un canone, zero sorprese.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-2xl">
              {heroStats.map((s) => (
                <div key={s.label} className="rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm p-4">
                  <div className="font-heading text-2xl md:text-3xl font-bold text-accent">
                    <CountUp to={s.value} prefix={s.prefix ?? ""} suffix={s.suffix} />
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Highlights bar */}
      <section className="py-6 border-y border-border bg-card sticky top-20 z-30 backdrop-blur-md bg-card/90">
        <div className="container">
          <div className="flex items-center gap-6 md:gap-10 overflow-x-auto scrollbar-none justify-start md:justify-center">
            {highlights.map((h) => (
              <div key={h.label} className="flex items-center gap-2 shrink-0 text-sm">
                <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <h.icon className="h-4 w-4 text-accent" />
                </div>
                <span className="font-medium text-foreground">{h.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid — editorial cards */}
      <section className="py-20">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Cosa trovi qui</h2>
              <p className="text-muted-foreground mt-3">Servizi reali, non un brochure di promesse.</p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <StaggerItem key={s.title}>
                <div className="group rounded-2xl overflow-hidden border-2 border-border bg-card h-full transition-all hover:border-accent hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4 h-10 w-10 rounded-xl bg-card/95 backdrop-blur flex items-center justify-center">
                      <s.icon className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="absolute bottom-4 left-4 right-4 font-heading font-bold text-lg text-white">
                      {s.title}
                    </h3>
                  </div>
                  <div className="p-6">
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{s.description}</p>
                    <ul className="space-y-2">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm text-foreground">
                          <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Una giornata tipo */}
      <section className="py-20 bg-muted/40">
        <div className="container max-w-6xl">
          <FadeIn>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-3">
                <Sun className="h-3.5 w-3.5" />
                Una giornata tipo
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Come usi i servizi durante la giornata</h2>
              <p className="text-muted-foreground mt-3">Dalla sveglia alla buonanotte, tutto quello che serve è qui.</p>
            </div>
          </FadeIn>

          <div className="relative">
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {dayInLife.map((step, i) => (
                <StaggerItem key={step.time}>
                  <div className="text-center">
                    <div className="relative inline-flex">
                      <div className="h-24 w-24 rounded-2xl bg-card border-2 border-accent/30 flex items-center justify-center mx-auto group hover:border-accent transition-colors">
                        <step.icon className="h-10 w-10 text-accent" />
                      </div>
                      <span className="absolute -top-2 -right-2 px-2 py-1 rounded-full bg-accent text-accent-foreground text-xs font-mono font-bold">
                        {step.time}
                      </span>
                    </div>
                    <h3 className="font-heading font-semibold text-foreground mt-4">{step.label}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Per i genitori — split layout */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <FadeIn direction="left">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&h=1000&fit=crop"
                  alt="Genitori e figli tranquilli"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
              </div>
            </FadeIn>

            <FadeIn direction="right">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-3">
                  <Heart className="h-3.5 w-3.5" />
                  Per i genitori
                </div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                  Sappiamo che spesso siete voi a cercare
                </h2>
                <p className="text-muted-foreground mt-3 mb-8">
                  Vostro figlio è la priorità. La nostra è farvi stare tranquilli.
                </p>
                <StaggerContainer className="space-y-4">
                  {parentTrust.map((item) => (
                    <StaggerItem key={item.title}>
                      <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 hover:border-accent/40 transition-colors">
                        <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                          <item.icon className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold text-card-foreground text-sm">{item.title}</h3>
                          <p className="text-muted-foreground text-sm mt-1">{item.desc}</p>
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-muted/40">
        <div className="container max-w-3xl">
          <FadeIn>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-3">
                <HelpCircle className="h-3.5 w-3.5" />
                Le domande più frequenti
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Risposte chiare, niente sorprese</h2>
            </div>
          </FadeIn>
          <StaggerContainer className="space-y-3">
            {faqs.map((f) => (
              <StaggerItem key={f.q}>
                <details className="group rounded-xl border border-border bg-card p-5 hover:border-accent/40 transition-colors">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <span className="font-heading font-semibold text-card-foreground pr-4">{f.q}</span>
                    <span className="h-7 w-7 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0 group-open:rotate-45 transition-transform text-lg leading-none">
                      +
                    </span>
                  </summary>
                  <p className="text-muted-foreground text-sm mt-3 leading-relaxed">{f.a}</p>
                </details>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <FadeIn>
        <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <div className="container text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold">Pronto a trasferirti?</h2>
            <p className="opacity-80 mt-3 max-w-md mx-auto">Scopri le camere disponibili e richiedi il tuo posto.</p>
            <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full bg-accent/90 text-accent-foreground text-sm font-medium">
              <CalendarHeart className="h-4 w-4" />
              Posti limitati per Settembre 2025
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                <Link to="/camere">Scopri le camere</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
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
