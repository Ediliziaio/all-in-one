import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import {
  Wifi,
  WashingMachine,
  UtensilsCrossed,
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
import { Schema } from "@/components/Schema";

const heroStats = [
  { value: 5, suffix: "", label: "servizi inclusi" },
  { value: 1, suffix: "", label: "sala studio 24/7" },
  { value: 0, prefix: "€", label: "costi extra" },
];

const highlights = [
  { icon: Wifi, label: "WiFi incluso" },
  { icon: WashingMachine, label: "Lavanderia" },
  { icon: UtensilsCrossed, label: "Cucina comune" },
  { icon: BookOpen, label: "Sala studio" },
  { icon: Shield, label: "Videosorveglianza" },
];

const services = [
  {
    icon: Wifi,
    title: "WiFi che non ti lascia mai",
    description: "Lezioni online, videochiamate e streaming in ogni stanza e nelle aree comuni.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop",
    bullets: ["WiFi incluso in ogni camera", "Copertura totale aree comuni", "Rete protetta con password"],
  },
  {
    icon: WashingMachine,
    title: "Lavanderia disponibile",
    description: "2 lavatrici + 2 asciugatrici con detersivo fornito. Servizio a pagamento.",
    image: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=800&h=500&fit=crop",
    bullets: ["2 lavatrici + 2 asciugatrici", "Detersivo fornito", "Servizio a pagamento"],
  },
  {
    icon: UtensilsCrossed,
    title: "Cucine comuni attrezzate",
    description: "3 cucine comuni attrezzate. Frigo privato in ogni stanza.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=500&fit=crop",
    bullets: ["3 cucine comuni con attrezzatura completa", "Frigorifero privato in ogni stanza", "Pulizia delle parti comuni inclusa"],
  },
  {
    icon: Shield,
    title: "Sicurezza garantita",
    description: "Videosorveglianza attiva per la tua tranquillità e quella dei tuoi genitori.",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=500&fit=crop",
    bullets: ["Videosorveglianza delle aree comuni"],
  },
  {
    icon: BookOpen,
    title: "Sala studio 24/7",
    description: "Uno spazio silenzioso accessibile in qualsiasi momento, anche di notte.",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=500&fit=crop",
    bullets: ["1 sala studio accessibile 24/7", "WiFi dedicato", "Prese e illuminazione ottimale"],
  },
];

const dayInLife = [
  { time: "08:00", icon: UtensilsCrossed, label: "Cucina", desc: "Colazione in cucina comune prima delle lezioni" },
  { time: "09:00", icon: BookOpen, label: "Sala studio", desc: "Sessione concentrata pre-esame" },
  { time: "13:00", icon: UtensilsCrossed, label: "Cucina", desc: "Pranzo veloce con i coinquilini" },
  { time: "18:00", icon: WashingMachine, label: "Lavanderia", desc: "Lavatrice mentre studi" },
  { time: "21:00", icon: Coffee, label: "Lounge", desc: "Relax in area comune" },
];

const parentTrust = [
  { icon: ShieldCheck, title: "Contratto regolare", desc: "Locazione registrata, conforme alla normativa." },
  { icon: Clock, title: "Supporto via WhatsApp", desc: "Rispondiamo su WhatsApp, Lun–Ven 9:00–17:00." },
  { icon: FileText, title: "Trasparenza totale", desc: "Prezzo chiaro all'ingresso. Quello che vedi è quello che paghi." },
  { icon: Heart, title: "Cura quotidiana", desc: "Pulizia aree comuni, manutenzione e supporto inclusi." },
];

const faqs = [
  {
    q: "Posso ricevere ospiti?",
    a: "Sì, durante il giorno. Il pernottamento di ospiti non è consentito.",
  },
  {
    q: "Cosa succede se si rompe qualcosa?",
    a: "Scrivi su WhatsApp e interveniamo entro 24h. La manutenzione ordinaria è inclusa nel canone.",
  },
  {
    q: "Sono coperto da assicurazione?",
    a: "La struttura è coperta da polizza RC. Per la copertura dei tuoi effetti personali ti consigliamo di stipulare una polizza individuale.",
  },
];

const Servizi = () => (
  <Layout>
    <Seo
      title="Servizi Inclusi Studentato Padova — WiFi, Cucina, Sala Studio 24/7"
      description="Allo Studentato Napoleone di Padova trovi WiFi fibra, 3 cucine comuni, sala studio 24/7, lavanderia, videosorveglianza e pulizie incluse nel canone. Un prezzo, zero bollette extra. Scopri tutto."
      canonical="/servizi"
      keywords="servizi studentato Padova, WiFi incluso affitto Padova, utenze incluse affitto studenti, sala studio 24 ore Padova, cucina comune studentato Padova"
    />
    <Schema data={{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    }} />
    <PageTransition>
      {/* Hero */}
      <section className="relative py-12 md:py-24 overflow-hidden">
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
            <h1 className="font-heading text-3xl sm:text-4xl md:text-6xl font-bold text-foreground max-w-2xl leading-tight">
              Tutto Incluso nel Canone.<br />
              <span className="text-accent">Zero</span> Bollette Extra.
            </h1>
            <p className="text-muted-foreground mt-4 text-base md:text-lg max-w-xl">
              WiFi fibra, cucina comune, sala studio 24/7, lavanderia e pulizie. Un solo prezzo mensile, nessuna sorpresa.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mt-8 md:mt-10 grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl">
              {heroStats.map((s) => (
                <div key={s.label} className="rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm p-3 sm:p-4">
                  <div className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-accent">
                    <CountUp to={s.value} prefix={s.prefix ?? ""} suffix={s.suffix} />
                  </div>
                  <div className="text-[11px] sm:text-xs md:text-sm text-muted-foreground mt-1 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Highlights bar */}
      <section className="py-4 md:py-6 border-y border-border bg-card sticky top-16 md:top-20 z-30 backdrop-blur-md bg-card/90">
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
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Cosa include il canone</h2>
              <p className="text-muted-foreground mt-3">Ogni servizio è incluso nel canone mensile, senza costi aggiuntivi.</p>
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
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Una giornata tipo allo Studentato Napoleone</h2>
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
                  Per i genitori che cercano il meglio
                </h2>
                <p className="text-muted-foreground mt-3 mb-8">
                  Sappiamo che spesso siete voi a scegliere l'alloggio. Ecco perché vi diciamo esattamente cosa aspettarvi.
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
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Domande frequenti sullo studentato</h2>
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
            <h2 className="font-heading text-3xl md:text-4xl font-bold">Pronto a trasferirti a Padova?</h2>
            <p className="opacity-80 mt-3 max-w-md mx-auto">Guarda le camere disponibili e invia la tua richiesta. Ti rispondiamo entro 24 ore.</p>
            <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full bg-accent/90 text-accent-foreground text-sm font-medium">
              <CalendarHeart className="h-4 w-4" />
              Posti limitati per Settembre {new Date().getFullYear() + (new Date().getMonth() >= 8 ? 1 : 0)}
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                <Link to="/camere">Scopri le camere</Link>
              </Button>
              <Button
                size="lg"
                className="bg-transparent border border-primary-foreground/60 text-primary-foreground hover:bg-primary-foreground/15"
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
