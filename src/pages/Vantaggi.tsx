import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { MapPin, Banknote, Users, HeadphonesIcon, FileText, CalendarHeart, Check, X as XIcon } from "lucide-react";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/MotionWrappers";

const vantaggi = [
  { icon: MapPin, title: "A 5 minuti dall'uni", desc: "Esci di casa e sei in aula. Niente bus affollati, niente sveglie alle 6. Più sonno, più studio." },
  { icon: Banknote, title: "Un prezzo, tutto dentro", desc: "Canone unico con utenze, WiFi, pulizia, manutenzione e accesso a tutti i servizi. Zero sorprese a fine mese." },
  { icon: Users, title: "Community, non coinquilini a caso", desc: "Vivi con altri studenti, partecipa a eventi, gruppi studio e attività. Qui le amicizie nascono da sole." },
  { icon: HeadphonesIcon, title: "Supporto vero", desc: "Si è rotto qualcosa? Scrivi su WhatsApp e interveniamo. Niente attese, niente rincorrere il proprietario." },
  { icon: FileText, title: "Contratti senza trappole", desc: "Durata semestrale o annuale, disdici con un mese di preavviso. Tutto registrato e regolare." },
  { icon: CalendarHeart, title: "Eventi ogni settimana", desc: "Serate cinema, tornei, aperitivi, workshop. La tua esperienza universitaria non è solo lezioni." },
];

const comparison = [
  { feature: "Costo mensile medio", usText: "da €480 tutto incluso", tradText: "€350 + ~€150 bollette" },
  { feature: "Utenze incluse", us: true, trad: false },
  { feature: "WiFi Fibra 1Gbps", us: true, trad: false },
  { feature: "Manutenzione inclusa", us: true, trad: false },
  { feature: "Community e eventi", us: true, trad: false },
  { feature: "Contratto flessibile", us: true, trad: false },
  { feature: "Palestra e sale studio", us: true, trad: false },
  { feature: "Libertà di scelta zona", us: false, trad: true },
  { feature: "Nessuna regola condominiale", us: false, trad: true },
];

const testimonials = [
  { name: "Giulia R.", course: "Medicina, 3° anno", text: "Prima pagavo €350 di affitto più €130 di bollette, e dovevo rincorrere il proprietario per ogni problema. Qui con €480 ho tutto incluso e risparmio almeno €100 al mese." },
  { name: "Marco T.", course: "Ingegneria, 2° anno", text: "Nel mio vecchio appartamento spendevo €40/mese solo di WiFi lento. Qui ho fibra 1Gbps, palestra e pulizia inclusi. Il confronto non regge." },
  { name: "Sofia L.", course: "Psicologia, 1° anno", text: "Sono arrivata a Padova senza conoscere nessuno. Dopo una settimana di eventi e gruppi studio, avevo già un gruppo di amici. La community fa davvero la differenza." },
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
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground max-w-xl">Perché scegliere StudentatoPD</h1>
            <p className="text-muted-foreground mt-3 text-lg max-w-lg">
              Non è solo un posto letto. È la base da cui parte la tua vita universitaria.
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
            <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-3">StudentatoPD vs Affitto tradizionale</h2>
            <p className="text-muted-foreground text-center mb-10 text-sm">Un confronto onesto. Ogni soluzione ha i suoi pro.</p>
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
                  {"usText" in row ? (
                    <>
                      <span className="font-semibold text-accent">{row.usText}</span>
                      <span className="text-muted-foreground">{row.tradText}</span>
                    </>
                  ) : (
                    <>
                      <span>{row.us ? <Check className="h-5 w-5 text-success mx-auto" /> : <XIcon className="h-5 w-5 text-destructive mx-auto" />}</span>
                      <span>{row.trad ? <Check className="h-5 w-5 text-success mx-auto" /> : <XIcon className="h-5 w-5 text-destructive mx-auto" />}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">Il confronto si basa su dati medi del mercato immobiliare studentesco a Padova.</p>
          </FadeIn>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container">
          <FadeIn>
            <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-10">Parola di chi ci vive</h2>
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
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Pronto? Il tuo posto ti aspetta</h2>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">I posti per Settembre 2025 stanno finendo. Esplora le camere e richiedi il tuo.</p>
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
              <CalendarHeart className="h-4 w-4" />
              Solo 12 posti ancora disponibili
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                <Link to="/camere">Scopri le camere</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contatti">Scrivici</Link>
              </Button>
            </div>
          </div>
        </section>
      </FadeIn>
    </PageTransition>
  </Layout>
);

export default Vantaggi;
