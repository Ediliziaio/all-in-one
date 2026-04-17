import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Users,
  Heart,
  PartyPopper,
  Trophy,
  Film,
  GraduationCap,
  Coffee,
  Globe,
  BookOpen,
  Palette,
  UtensilsCrossed,
  HandHeart,
  Plane,
  Calendar,
  ArrowRight,
  Quote,
  UserPlus,
  Handshake,
  Smile,
} from "lucide-react";
import {
  PageTransition,
  FadeIn,
  StaggerContainer,
  StaggerItem,
  CountUp,
  KenBurns,
} from "@/components/motion/MotionWrappers";

const manifesto = [
  {
    icon: Users,
    title: "Vivere insieme",
    text: "Condividere spazi, abitudini, momenti. Imparare a stare con gli altri è parte dell'università tanto quanto i libri.",
  },
  {
    icon: GraduationCap,
    title: "Crescere insieme",
    text: "Gruppi studio, scambio di appunti, motivazione reciproca. Qui non studi mai davvero da solo.",
  },
  {
    icon: PartyPopper,
    title: "Divertirsi insieme",
    text: "Aperitivi, serate cinema, tornei, viaggi. Le sere libere diventano ricordi che resteranno.",
  },
];

const events = [
  {
    date: "VEN 18",
    time: "19:30",
    title: "Aperitivo di Benvenuto",
    desc: "Conosci i nuovi arrivati con un drink in terrazza.",
    icon: Coffee,
    color: "text-accent",
  },
  {
    date: "SAB 19",
    time: "20:00",
    title: "Cena Internazionale",
    desc: "Ogni studente porta un piatto del suo paese.",
    icon: Globe,
    color: "text-accent",
  },
  {
    date: "MAR 22",
    time: "18:00",
    title: "Torneo di Calcetto",
    desc: "4 squadre, una coppa, tante risate.",
    icon: Trophy,
    color: "text-accent",
  },
  {
    date: "GIO 24",
    time: "21:00",
    title: "Serata Cinema",
    desc: "Proiezione in sala comune. Popcorn inclusi.",
    icon: Film,
    color: "text-accent",
  },
  {
    date: "VEN 25",
    time: "17:00",
    title: "Workshop CV & LinkedIn",
    desc: "Prepara la tua candidatura con un career coach.",
    icon: BookOpen,
    color: "text-accent",
  },
  {
    date: "DOM 27",
    time: "11:00",
    title: "Brunch della Domenica",
    desc: "Pancake, uova, caffè. Il modo giusto di iniziare.",
    icon: UtensilsCrossed,
    color: "text-accent",
  },
];

const activityCategories = [
  { icon: Trophy, label: "Sport", desc: "Tornei e attività sportive ogni settimana" },
  { icon: BookOpen, label: "Studio", desc: "Gruppi studio, ripetizioni, sessioni di gruppo" },
  { icon: Palette, label: "Cultura", desc: "Mostre, concerti, visite ai musei della città" },
  { icon: UtensilsCrossed, label: "Cucina", desc: "Cene a tema e workshop culinari condivisi" },
  { icon: HandHeart, label: "Volontariato", desc: "Iniziative locali per restituire alla città" },
  { icon: Plane, label: "Viaggi", desc: "Weekend di gruppo a Venezia, Verona, Dolomiti" },
];

const galleryImages = [
  { src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=800&fit=crop", alt: "Gruppo studenti", h: "tall" },
  { src: "https://images.unsplash.com/photo-1543269664-7eef42226a21?w=600&h=400&fit=crop", alt: "Aperitivo", h: "short" },
  { src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=600&fit=crop", alt: "Studio", h: "medium" },
  { src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=800&fit=crop", alt: "Festa", h: "tall" },
  { src: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=400&fit=crop", alt: "Pranzo insieme", h: "short" },
  { src: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600&h=600&fit=crop", alt: "Concerto", h: "medium" },
  { src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&h=800&fit=crop", alt: "Sport", h: "tall" },
  { src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&h=400&fit=crop", alt: "Brunch", h: "short" },
];

const stories = [
  {
    name: "Elena & Camilla",
    role: "Conosciute a un aperitivo di benvenuto",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop",
    quote:
      "Ci siamo conosciute la prima sera all'aperitivo di benvenuto. Ora siamo migliori amiche e abbiamo persino fatto un viaggio insieme in Croazia. Senza la community, non sarebbe successo.",
  },
  {
    name: "Lorenzo & gli amici di Ingegneria",
    role: "Gruppo studio nato per Analisi 2",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    quote:
      "Eravamo 5 persone che si studiavano Analisi 2 da soli. Ci siamo trovati nella sala studio e ora siamo un gruppo fisso. Esami passati e amicizie vere.",
  },
];

const howItWorks = [
  { icon: UserPlus, step: "01", title: "Entri", desc: "Ti diamo il benvenuto con un tour della struttura e una serata di presentazione." },
  { icon: Handshake, step: "02", title: "Conosci", desc: "Eventi settimanali, gruppi studio, attività organizzate. Il primo amico è dietro l'angolo." },
  { icon: Smile, step: "03", title: "Partecipi", desc: "Proponi le tue idee, organizza eventi, costruisci la tua esperienza." },
];

const heightClass: Record<string, string> = {
  tall: "row-span-2 aspect-[3/4]",
  medium: "aspect-square",
  short: "aspect-[3/2]",
};

const Community = () => (
  <Layout>
    <PageTransition>
      {/* Hero immersivo */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <KenBurns
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1800&h=1000&fit=crop"
            alt="Community studenti Padova"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/70 to-primary/40" />
        </div>
        <div className="container relative z-10 py-12 md:py-20">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent-foreground bg-accent text-xs font-semibold mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              Community
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground max-w-3xl leading-tight">
              La tua nuova<br />
              <span className="text-accent">famiglia</span> a Padova.
            </h1>
            <p className="text-primary-foreground/80 mt-4 md:mt-6 text-base md:text-xl max-w-xl">
              Vivere qui non significa avere una camera. Significa avere persone con cui crescere, ridere, studiare, viaggiare.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mt-8 md:mt-10 grid grid-cols-3 gap-2 sm:gap-4 max-w-xl">
              {[
                { v: 100, s: "+", l: "studenti" },
                { v: 4, s: "/mese", l: "eventi" },
                { v: 25, s: "+", l: "nazionalità" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-accent">
                    <CountUp to={s.v} suffix={s.s} />
                  </div>
                  <div className="text-[11px] sm:text-xs md:text-sm text-primary-foreground/70 mt-1 leading-tight">{s.l}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Manifesto */}
      <section className="py-20">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-3">
                <Heart className="h-3.5 w-3.5" />
                Il nostro manifesto
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                Tre cose in cui crediamo
              </h2>
            </div>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {manifesto.map((m) => (
              <StaggerItem key={m.title}>
                <div className="text-center p-6">
                  <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
                    <m.icon className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground">{m.title}</h3>
                  <p className="text-muted-foreground mt-3 leading-relaxed">{m.text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Eventi del mese */}
      <section className="py-20 bg-muted/40">
        <div className="container">
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-3">
                  <Calendar className="h-3.5 w-3.5" />
                  Eventi del mese
                </div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Cosa succede a casa</h2>
                <p className="text-muted-foreground mt-2">Ogni settimana qualcosa di nuovo. Scegli cosa ti piace.</p>
              </div>
            </div>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((e) => (
              <StaggerItem key={e.title}>
                <div className="group rounded-2xl border-2 border-border bg-card p-5 h-full hover:border-accent hover:-translate-y-1 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 text-center">
                      <div className="px-3 py-2 rounded-xl bg-primary text-primary-foreground">
                        <div className="font-heading font-bold text-sm leading-tight">{e.date}</div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1.5 font-mono">{e.time}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <e.icon className={`h-4 w-4 ${e.color}`} />
                        <h3 className="font-heading font-semibold text-card-foreground">{e.title}</h3>
                      </div>
                      <p className="text-muted-foreground text-sm">{e.desc}</p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Tipi di attività */}
      <section className="py-20">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">C'è qualcosa per ognuno</h2>
              <p className="text-muted-foreground mt-3">Sei sportivo? Curioso? Creativo? Trovi il tuo posto.</p>
            </div>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {activityCategories.map((c) => (
              <StaggerItem key={c.label}>
                <div className="group rounded-2xl border border-border bg-card p-5 h-full text-center hover:border-accent hover:bg-accent/5 transition-colors">
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-accent/20 transition-colors">
                    <c.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-heading font-semibold text-sm text-card-foreground">{c.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{c.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Galleria masonry */}
      <section className="py-20 bg-muted/40">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Momenti veri</h2>
              <p className="text-muted-foreground mt-3">Niente foto stock. Solo vita di tutti i giorni.</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[140px] md:auto-rows-[180px]">
            {galleryImages.map((img, i) => (
              <FadeIn key={i} delay={i * 0.05} className={heightClass[img.h]}>
                <div className="relative w-full h-full rounded-xl overflow-hidden group">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Storie community */}
      <section className="py-20">
        <div className="container max-w-5xl">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Amicizie nate qui</h2>
              <p className="text-muted-foreground mt-3">Storie vere di chi ha trovato più di una camera.</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stories.map((s, i) => (
              <FadeIn key={s.name} delay={i * 0.1}>
                <div className="relative rounded-2xl border-2 border-border bg-card p-8 h-full hover:border-accent/50 transition-colors">
                  <Quote className="absolute top-6 right-6 h-12 w-12 text-accent/15" />
                  <p className="text-foreground leading-relaxed text-base relative">"{s.quote}"</p>
                  <div className="mt-6 pt-6 border-t border-border flex items-center gap-3">
                    <img src={s.avatar} alt={s.name} className="h-12 w-12 rounded-full object-cover" loading="lazy" />
                    <div>
                      <p className="font-heading font-semibold text-card-foreground text-sm">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.role}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Come funziona */}
      <section className="py-20 bg-muted/40">
        <div className="container max-w-5xl">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Come funziona</h2>
              <p className="text-muted-foreground mt-3">Tre passi per essere parte della community.</p>
            </div>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howItWorks.map((h) => (
              <StaggerItem key={h.step}>
                <div className="relative rounded-2xl border-2 border-border bg-card p-6 h-full">
                  <span className="absolute top-4 right-5 font-heading text-5xl font-bold text-muted-foreground/15">
                    {h.step}
                  </span>
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <h.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-card-foreground">{h.title}</h3>
                  <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{h.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <FadeIn>
        <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <div className="container text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold">Vieni a trovarci a un evento</h2>
            <p className="opacity-80 mt-3 max-w-md mx-auto">
              Prenota una visita e partecipa al prossimo aperitivo. Conosci chi vive qui prima di scegliere.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                <Link to="/contatti">
                  Prenota una visita <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link to="/camere">Scopri le camere</Link>
              </Button>
            </div>
          </div>
        </section>
      </FadeIn>
    </PageTransition>
  </Layout>
);

export default Community;
