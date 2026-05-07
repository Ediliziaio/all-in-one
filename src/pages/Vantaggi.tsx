import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { Schema } from "@/components/Schema";
import { Button } from "@/components/ui/button";
import {
  Banknote,
  Users,
  HeadphonesIcon,
  FileText,
  CalendarHeart,
  Check,
  X as XIcon,
  Sparkles,
  TrendingDown,
  Quote,
  ArrowRight,
} from "lucide-react";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem, CountUp } from "@/components/motion/MotionWrappers";

const heroStats = [
  { value: 390, prefix: "€", suffix: "", label: "prezzo di partenza/mese" },
  { value: 100, prefix: "€", suffix: "+", label: "risparmiati al mese" },
  { value: 0, suffix: "", label: "bollette extra" },
];

const vantaggi = [
  { icon: Banknote, title: "Un prezzo, tutto dentro", desc: "Canone unico con utenze, WiFi, pulizia e manutenzione. Zero sorprese.", stat: "da €390/mese" },
  { icon: Users, title: "Community vera", desc: "Vivi con altri studenti, partecipa a eventi e gruppi studio. Le amicizie nascono da sole.", stat: "Comunità attiva" },
  { icon: HeadphonesIcon, title: "Supporto vero", desc: "Si è rotto qualcosa? Scrivi su WhatsApp e interveniamo. Lun–Ven 9–17.", stat: "Lun–Ven 9–17" },
  { icon: FileText, title: "Contratto regolare", desc: "Locazione registrata, conforme alla normativa. Nessuna zona grigia.", stat: "Tutto in regola" },
];

const costBreakdown = {
  traditional: [
    { label: "Affitto posto letto", value: 300 },
    { label: "Bollette (luce, gas, acqua)", value: 150 },
    { label: "Internet WiFi", value: 40 },
  ],
  us: [{ label: "Canone tutto incluso", value: 390 }],
};
const tradTotal = costBreakdown.traditional.reduce((s, i) => s + i.value, 0);
const usTotal = costBreakdown.us.reduce((s, i) => s + i.value, 0);
const saving = tradTotal - usTotal;

const comparison = [
  { feature: "Costo mensile medio", usText: "da €390 tutto incluso", tradText: "€300 + ~€150 bollette", note: "Niente sorprese a fine mese" },
  { feature: "Utenze incluse", us: true, trad: false, note: "Luce, gas, acqua già nel canone" },
  { feature: "WiFi incluso", us: true, trad: false, note: "Lezioni online senza lag" },
  { feature: "Manutenzione inclusa", us: true, trad: false, note: "Interveniamo entro 24h" },
  { feature: "Community e eventi", us: true, trad: false, note: "Aperitivi, gruppi studio, tornei" },
  { feature: "Contratto registrato", us: true, trad: false, note: "Locazione regolare, nessuna zona grigia" },
  { feature: "Cucina comune e sala studio", us: true, trad: false, note: "Cucine attrezzate e sala studio 24/7" },
  { feature: "Libertà di scelta zona", us: false, trad: true, note: "Noi siamo solo in centro" },
  { feature: "Nessuna regola condominiale", us: false, trad: true, note: "Qui ci sono regole di convivenza" },
];

const testimonials = [
  {
    name: "Giulia R.",
    course: "Medicina, 3° anno",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    text: "Prima pagavo €350 di affitto più €130 di bollette, e dovevo rincorrere il proprietario per ogni problema. Qui con €480 ho tutto incluso e risparmio almeno €100 al mese.",
  },
  {
    name: "Marco T.",
    course: "Ingegneria, 2° anno",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    text: "Nel mio vecchio appartamento spendevo €40/mese solo di WiFi lento e dovevo cucinare ogni giorno da solo. Qui ho WiFi, cucina attrezzata e pulizia inclusi. Il confronto non regge.",
  },
  {
    name: "Sofia L.",
    course: "Psicologia, 1° anno",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    text: "Sono arrivata a Padova senza conoscere nessuno. Dopo una settimana di eventi e gruppi studio, avevo già un gruppo di amici. La community fa davvero la differenza.",
  },
];

const vantaggiFaqs = [
  {
    q: "Quanto costa uno studentato a Padova rispetto a un appartamento?",
    a: "Uno studentato a Padova come il Napoleone parte da €390/mese tutto incluso (WiFi, utenze, pulizie). Un appartamento privato in media costa €300 solo di affitto più €150–€200 di bollette, quindi almeno €490–€500 al mese. Con noi risparmi fino a €100 al mese.",
  },
  {
    q: "Cosa include il canone dello studentato?",
    a: "Il canone mensile include: WiFi fibra, utenze (luce, gas, acqua), pulizia delle parti comuni, manutenzione ordinaria, uso della cucina comune, sala studio 24/7 e lavanderia. Nessun costo nascosto.",
  },
  {
    q: "Il contratto di affitto è regolare?",
    a: "Sì. Tutti i contratti sono locazioni registrate, conformi alla normativa italiana. Non ci sono zone grigie: ricevi un contratto ufficiale firmato prima dell'ingresso.",
  },
  {
    q: "Posso trovare una stanza singola a Padova a meno di €500 al mese con utenze incluse?",
    a: "Sì. Le nostre camere singole partono da €480/mese con WiFi, luce, gas, acqua e pulizie già incluse. È una delle soluzioni più convenienti per studenti a Padova con tutte le spese coperte.",
  },
  {
    q: "Lo studentato è vicino all'Università di Padova?",
    a: "Sì, la struttura si trova in zona centrale a Padova, a pochi minuti dalle principali facoltà dell'Università di Padova, dai trasporti pubblici e dai servizi essenziali.",
  },
];

const Vantaggi = () => (
  <Layout>
    <Seo
      title="Studentato vs Appartamento Padova — Risparmia Fino a €100 al Mese"
      description="Perché scegliere lo Studentato Napoleone di Padova? Prezzo all-inclusive da €390/mese, utenze incluse, contratto regolare. Confronto reale con affitto tradizionale: scopri quanto risparmi."
      canonical="/vantaggi"
      keywords="perché scegliere studentato Padova, vantaggi studentato vs appartamento, affitto tutto incluso studenti Padova, risparmio studentato Padova"
    />
    <Schema data={{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: vantaggiFaqs.map((f) => ({
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
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&h=700&fit=crop"
            alt="Vantaggi dello studentato"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        </div>
        <div className="container relative z-10">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              Vantaggi reali, numeri reali
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-6xl font-bold text-foreground max-w-2xl leading-tight">
              Studentato o Appartamento?<br />
              <span className="text-accent">Ecco</span> la risposta onesta.
            </h1>
            <p className="text-muted-foreground mt-4 text-base md:text-lg max-w-xl">
              Confronto reale tra lo Studentato Napoleone e un appartamento privato a Padova. Costi, servizi, contratti: tutto a nudo.
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

      {/* Quanto risparmi davvero */}
      <section className="py-20 bg-muted/40">
        <div className="container max-w-5xl">
          <FadeIn>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-semibold mb-3">
                <TrendingDown className="h-3.5 w-3.5" />
                Calcolo onesto
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Studentato vs Appartamento: quanto spendi davvero</h2>
              <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
                Confronto basato sui prezzi medi di un posto letto in appartamento privato a Padova nel 2026.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FadeIn direction="left">
              <div className="rounded-2xl border-2 border-border bg-card p-6 h-full">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-heading font-semibold text-lg text-card-foreground">Affitto tradizionale</h3>
                  <span className="text-xs text-muted-foreground">/mese</span>
                </div>
                <ul className="space-y-3">
                  {costBreakdown.traditional.map((item) => (
                    <li key={item.label} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-mono text-foreground">€{item.value}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 pt-5 border-t border-border flex items-center justify-between">
                  <span className="font-heading font-semibold text-foreground">Totale</span>
                  <span className="font-heading text-2xl font-bold text-foreground">€{tradTotal}</span>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right">
              <div className="relative rounded-2xl border-2 border-accent bg-card p-6 h-full shadow-lg shadow-accent/10">
                <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                  Studentato Napoleone
                </div>
                <div className="flex items-center justify-between mb-5 mt-2">
                  <h3 className="font-heading font-semibold text-lg text-card-foreground">Tutto incluso</h3>
                  <span className="text-xs text-muted-foreground">/mese</span>
                </div>
                <ul className="space-y-3">
                  {costBreakdown.us.map((item) => (
                    <li key={item.label} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-mono text-foreground">€{item.value}</span>
                    </li>
                  ))}
                  {["Utenze (luce/gas/acqua)", "WiFi", "Cucina comune + frigo privato", "Pulizia comuni", "Manutenzione"].map((extra) => (
                    <li key={extra} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-success" /> {extra}
                      </span>
                      <span className="font-mono text-success">incluso</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 pt-5 border-t border-border flex items-center justify-between">
                  <span className="font-heading font-semibold text-foreground">Totale</span>
                  <span className="font-heading text-2xl font-bold text-accent">€{usTotal}</span>
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.2}>
            <div className="mt-8 rounded-2xl bg-success/10 border border-success/30 p-6 text-center">
              <p className="text-sm text-muted-foreground">Risparmio mensile</p>
              <p className="font-heading text-4xl md:text-5xl font-bold text-success mt-1">
                <CountUp to={saving} prefix="€" />
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Sono <span className="font-semibold text-foreground">€{saving * 12} all'anno</span> che restano nelle tue tasche.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Vantaggi Grid */}
      <section className="py-20">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Perché scegliere lo Studentato Napoleone</h2>
              <p className="text-muted-foreground mt-3">I vantaggi concreti che fanno la differenza quando studi lontano da casa.</p>
            </div>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vantaggi.map((v, i) => (
              <StaggerItem key={v.title}>
                <div className="group relative rounded-2xl border-2 border-border bg-card p-6 h-full transition-all hover:border-accent hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <v.icon className="h-6 w-6 text-accent" />
                    </div>
                    <span className="font-heading text-3xl font-bold text-muted-foreground/30">0{i + 1}</span>
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-card-foreground">{v.title}</h3>
                  <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{v.desc}</p>
                  <div className="mt-4 pt-4 border-t border-border">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent">
                      <Check className="h-3.5 w-3.5" />
                      {v.stat}
                    </span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 bg-muted/40">
        <div className="container max-w-4xl">
          <FadeIn>
            <div className="text-center mb-10">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Studentato vs Affitto tradizionale</h2>
              <p className="text-muted-foreground mt-3 text-sm">Un confronto onesto. Ogni soluzione ha i suoi pro.</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="rounded-2xl border-2 border-border bg-card overflow-x-auto">
              <div className="grid grid-cols-12 text-sm font-heading font-semibold p-4 border-b bg-muted/40">
                <span className="col-span-5 text-foreground">Caratteristica</span>
                <span className="col-span-3 text-center text-accent">Napoleone</span>
                <span className="col-span-2 text-center text-muted-foreground">Affitto</span>
                <span className="col-span-2 text-right text-muted-foreground hidden md:block">Significato</span>
              </div>
              {comparison.map((row, i) => (
                <div
                  key={row.feature}
                  className={`grid grid-cols-12 items-center text-sm p-4 ${i < comparison.length - 1 ? "border-b border-border" : ""} hover:bg-muted/30 transition-colors`}
                >
                  <span className="col-span-5 text-foreground font-medium">{row.feature}</span>
                  <span className="col-span-3 text-center">
                    {"usText" in row ? (
                      <span className="font-semibold text-accent text-xs">{row.usText}</span>
                    ) : row.us ? (
                      <Check className="h-5 w-5 text-success mx-auto" />
                    ) : (
                      <XIcon className="h-5 w-5 text-destructive/70 mx-auto" />
                    )}
                  </span>
                  <span className="col-span-2 text-center">
                    {"tradText" in row ? (
                      <span className="text-muted-foreground text-xs">{row.tradText}</span>
                    ) : row.trad ? (
                      <Check className="h-5 w-5 text-success mx-auto" />
                    ) : (
                      <XIcon className="h-5 w-5 text-destructive/70 mx-auto" />
                    )}
                  </span>
                  <span className="col-span-12 md:col-span-2 text-xs text-muted-foreground text-right hidden md:block italic">
                    {row.note}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Confronto basato su dati medi del mercato immobiliare studentesco a Padova.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Testimonials — layout asimmetrico */}
      <section className="py-20">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Cosa dicono gli studenti che vivono qui</h2>
              <p className="text-muted-foreground mt-3">Recensioni reali di studenti dell'Università di Padova che hanno scelto il Napoleone.</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto">
            {testimonials.map((t, i) => (
              <FadeIn
                key={t.name}
                delay={i * 0.1}
                className={
                  i === 0 ? "md:col-span-7" : i === 1 ? "md:col-span-5" : "md:col-span-12 md:max-w-2xl md:mx-auto"
                }
              >
                <div className="relative rounded-2xl border-2 border-border bg-card p-8 h-full hover:border-accent/50 transition-colors">
                  <Quote className="absolute top-6 right-6 h-10 w-10 text-accent/15" />
                  <p className="text-foreground leading-relaxed text-base relative">"{t.text}"</p>
                  <div className="mt-6 pt-6 border-t border-border flex items-center gap-3">
                    <img src={t.avatar} alt={t.name} className="h-12 w-12 rounded-full object-cover" loading="lazy" />
                    <div>
                      <p className="font-heading font-semibold text-card-foreground text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.course}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA finale */}
      <FadeIn>
        <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <div className="container text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent-foreground bg-accent/90 text-sm font-medium mb-4">
              <CalendarHeart className="h-4 w-4" />
              Posti limitati — scrivici per verificare disponibilità
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">Hai scelto. La tua camera a Padova ti aspetta.</h2>
            <p className="opacity-80 mt-3 max-w-md mx-auto">
              Vedi le camere disponibili e richiedi una visita. Ti rispondiamo entro 24 ore lavorative.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                <Link to="/camere">
                  Scopri le camere <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link to="/contatti">Scrivici ora</Link>
              </Button>
            </div>
          </div>
        </section>
      </FadeIn>
    </PageTransition>
  </Layout>
);

export default Vantaggi;
