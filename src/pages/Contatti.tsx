import { useState, useMemo } from "react";
import { addLead } from "@/data/leadsStore";
import { motion } from "framer-motion";
import { z } from "zod";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { Schema } from "@/components/Schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import {
  Mail, Phone, Clock,
  Send, MessageCircle, CheckCircle2, ExternalLink, Calendar, Sparkles,
} from "lucide-react";


const orari = [
  { giorno: "Lunedì – Venerdì", ore: "9:00 – 17:00" },
  { giorno: "Sabato – Domenica", ore: "Chiuso" },
];

const faqs = [
  { q: "Come posso prenotare una camera?", a: "Sfoglia le camere disponibili nella sezione Camere e clicca su 'Richiedi Prenotazione'. Verrai ricontattato entro 24 ore." },
  { q: "Quali sono i termini di pagamento?", a: "Il canone si paga entro il 5 di ogni mese tramite bonifico. La cauzione è pari a 2 mensilità ed è rimborsata a fine contratto." },
  { q: "Posso visitare lo studentato prima di prenotare?", a: "Certo! Organizziamo visite dal lunedì al venerdì, 9:00–17:00. Contattaci su WhatsApp o per email per fissare un appuntamento." },
  { q: "Quanto tempo per avere conferma della prenotazione?", a: "Rispondiamo entro 24 ore lavorative. La conferma definitiva arriva dopo la firma del contratto e il versamento della cauzione." },
];

const fade = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const contactSchema = z.object({
  nome: z.string().trim().min(1, "Il nome è obbligatorio").max(100, "Massimo 100 caratteri"),
  email: z.string().trim().min(1, "L'email è obbligatoria").email("Email non valida").max(255),
  telefono: z.string().trim().max(20).regex(/^[+]?[\d\s()-]*$/, "Telefono non valido").optional().or(z.literal("")),
  oggetto: z.string().min(1, "Seleziona un oggetto"),
  messaggio: z.string().trim().min(1, "Il messaggio è obbligatorio").max(1000, "Massimo 1000 caratteri"),
  privacy: z.literal(true, { errorMap: () => ({ message: "Devi accettare la privacy policy" }) }),
});

const WHATSAPP = "393923634188";
const TEL = "+39 392 3634188";
const EMAIL_ADDR = "studentatonapoleone@gmail.com";

function isOpenNow() {
  const now = new Date();
  const day = now.getDay(); // 0=dom, 6=sab
  const h = now.getHours() + now.getMinutes() / 60;
  if (day === 0 || day === 6) return false;
  return h >= 9 && h < 17;
}

export default function Contatti() {
  const [form, setForm] = useState({ nome: "", email: "", telefono: "", oggetto: "", messaggio: "", privacy: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const open = useMemo(() => isOpenNow(), []);

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSuccess(true);
      // Write lead to CRM so it appears in Admin → Richieste
      const now = new Date().toISOString();
      const [nome, ...rest] = form.nome.trim().split(" ");
      addLead({
        id: `lead_${Date.now()}`,
        student_id: `pub_${Date.now()}`,
        student_nome: form.nome.trim(),
        camera_id: "",
        camera_nome: "–",
        data_inizio: "",
        data_fine: "",
        stato: "pending",
        pipeline_stato: "nuovo_lead",
        email: form.email,
        telefono: form.telefono || "",
        note: `[${form.oggetto.toUpperCase()}] ${form.messaggio}`,
        fonte: "sito",
        priorita: "media",
        attivita: [{
          id: `a_${Date.now()}`,
          tipo: "nota",
          testo: `Messaggio dal form contatti (${form.oggetto}): ${form.messaggio}`,
          autore: "Sistema",
          created_at: now,
        }],
        created_at: now,
      });
      toast.success("Messaggio inviato!", { description: "Ti risponderemo entro 24 ore." });
    }, 1200);
  };

  const reset = () => {
    setForm({ nome: "", email: "", telefono: "", oggetto: "", messaggio: "", privacy: false });
    setErrors({});
    setSuccess(false);
  };

  const set = (key: string, val: string | boolean) => {
    setForm((p) => ({ ...p, [key]: val }));
    if (errors[key]) setErrors((p) => { const n = { ...p }; delete n[key]; return n; });
  };

  const prefillVisit = () => {
    setForm((p) => ({
      ...p,
      oggetto: "info",
      messaggio: "Ciao! Vorrei prenotare una visita allo studentato. La mia disponibilità è ...",
    }));
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const quickContacts = [
    { icon: MessageCircle, label: "WhatsApp", value: "Lun–Ven 9:00–17:00", href: `https://wa.me/${WHATSAPP}`, color: "bg-[#25D366]/10 text-[#25D366]" },
    { icon: Phone, label: "Telefono", value: TEL, href: `tel:${TEL}`, color: "bg-primary/10 text-primary" },
    { icon: Mail, label: "Email", value: EMAIL_ADDR, href: `mailto:${EMAIL_ADDR}`, color: "bg-accent/10 text-accent" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Contatta lo Studentato Napoleone Padova — Camere Disponibili per Studenti"
        description="Scrivi allo Studentato Napoleone di Padova per info su camere disponibili, prezzi e visite. Risposta entro 24 ore. Contatti: WhatsApp, email o form. Camere singole e doppie per studenti UniPD."
        canonical="/contatti"
        keywords="contatti studentato Padova, info camere studenti Padova, visita studentato Padova, prenotazione stanza Padova, studentato Napoleone telefono email"
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
      <Schema data={{
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": "https://studentatonapoleone.com/#localbusiness",
        "name": "Studentato Napoleone Padova",
        "description": "Studentato a Padova con camere singole e doppie per studenti universitari. WiFi, utenze e pulizie incluse nel canone mensile.",
        "url": "https://studentatonapoleone.com",
        "telephone": "+39 392 3634188",
        "email": "studentatonapoleone@gmail.com",
        "image": "https://studentatonapoleone.com/logo-napoleone.png",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Padova centro storico",
          "addressLocality": "Padova",
          "addressRegion": "PD",
          "postalCode": "35122",
          "addressCountry": "IT",
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 45.4064,
          "longitude": 11.8768,
        },
        "hasMap": "https://www.google.com/maps/search/Studentato+Napoleone+Padova",
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
          "opens": "09:00",
          "closes": "17:00",
        },
        "priceRange": "€390–€580/mese",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "47",
          "bestRating": "5",
          "worstRating": "1",
        },
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "telephone": "+39 392 3634188",
            "email": "studentatonapoleone@gmail.com",
            "availableLanguage": "Italian",
            "contactOption": "TollFree",
          },
          {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "url": "https://wa.me/393923634188",
            "contactOption": "HearingImpairedSupported",
            "availableLanguage": "Italian",
          },
        ],
      }} />
      <Navbar />

      {/* Hero */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fade} transition={{ duration: 0.6 }} className="text-center max-w-2xl mx-auto">
            <Badge variant="secondary" className="mb-4 gap-1.5">
              <Sparkles className="h-3 w-3" /> Rispondiamo davvero in 24h
            </Badge>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">Parliamone.</h1>
            <p className="text-muted-foreground mt-4 text-base md:text-lg">
              Scrivici, chiamaci o scrivi su WhatsApp. Scegli il canale che preferisci — siamo persone vere dall'altra parte.
            </p>
          </motion.div>

          {/* Quick contact cards */}
          <motion.div
            initial="hidden" animate="visible" variants={fade} transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 max-w-3xl mx-auto"
          >
            {quickContacts.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group rounded-xl border bg-card p-4 flex items-center gap-3 hover:border-accent hover:shadow-md transition-all"
              >
                <div className={`h-11 w-11 rounded-lg flex items-center justify-center shrink-0 ${c.color}`}>
                  <c.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-card-foreground">{c.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{c.value}</p>
                </div>
              </a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
            {/* Form — 3/5 */}
            <motion.div
              id="contact-form"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} transition={{ duration: 0.5 }}
              className="lg:col-span-3"
            >
              <Card className="p-6 md:p-8 shadow-sm">
                {success ? (
                  <div className="text-center py-8">
                    <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Messaggio inviato!</h2>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Grazie {form.nome.split(" ")[0]}, ti risponderemo entro 24 ore all'indirizzo <strong>{form.email}</strong>.
                    </p>
                    <Button onClick={reset} variant="outline">Invia un altro messaggio</Button>
                  </div>
                ) : (
                  <>
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-1">Inviaci un messaggio</h2>
                    <p className="text-sm text-muted-foreground mb-6">Compila il form, ti rispondiamo entro 24 ore.</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="nome">Nome *</Label>
                          <Input id="nome" placeholder="Il tuo nome" value={form.nome} maxLength={100}
                            onChange={(e) => set("nome", e.target.value)} className={errors.nome ? "border-destructive" : ""} />
                          {errors.nome && <p className="text-xs text-destructive">{errors.nome}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="email">Email *</Label>
                          <Input id="email" type="email" placeholder="nome@email.com" value={form.email} maxLength={255}
                            onChange={(e) => set("email", e.target.value)} className={errors.email ? "border-destructive" : ""} />
                          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="telefono">Telefono</Label>
                          <Input id="telefono" placeholder="+39 ..." value={form.telefono} maxLength={20}
                            onChange={(e) => set("telefono", e.target.value)} className={errors.telefono ? "border-destructive" : ""} />
                          {errors.telefono && <p className="text-xs text-destructive">{errors.telefono}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <Label>Oggetto *</Label>
                          <Select value={form.oggetto} onValueChange={(v) => set("oggetto", v)}>
                            <SelectTrigger className={errors.oggetto ? "border-destructive" : ""}>
                              <SelectValue placeholder="Seleziona..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="info">Info camere</SelectItem>
                              <SelectItem value="prenotazione">Prenotazione</SelectItem>
                              <SelectItem value="visita">Prenota visita</SelectItem>
                              <SelectItem value="supporto">Supporto</SelectItem>
                              <SelectItem value="altro">Altro</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.oggetto && <p className="text-xs text-destructive">{errors.oggetto}</p>}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="messaggio">Messaggio *</Label>
                          <span className={`text-xs ${form.messaggio.length > 900 ? "text-destructive" : "text-muted-foreground"}`}>
                            {form.messaggio.length} / 1000
                          </span>
                        </div>
                        <Textarea id="messaggio" rows={5} placeholder="Scrivi il tuo messaggio..." value={form.messaggio}
                          maxLength={1000} onChange={(e) => set("messaggio", e.target.value)}
                          className={errors.messaggio ? "border-destructive" : ""} />
                        {errors.messaggio && <p className="text-xs text-destructive">{errors.messaggio}</p>}
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Checkbox id="privacy" checked={form.privacy}
                          onCheckedChange={(v) => set("privacy", v === true)}
                          className={errors.privacy ? "border-destructive" : "mt-0.5"} />
                        <div className="flex-1">
                          <label htmlFor="privacy" className="text-sm text-muted-foreground cursor-pointer">
                            Ho letto e accetto la <a href="/privacy" className="text-accent underline underline-offset-2 hover:text-accent/80">privacy policy</a> *
                          </label>
                          {errors.privacy && <p className="text-xs text-destructive mt-1">{errors.privacy}</p>}
                        </div>
                      </div>

                      <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={sending}>
                        {sending ? "Invio in corso..." : <><Send className="h-4 w-4 mr-2" /> Invia messaggio</>}
                      </Button>
                    </form>
                  </>
                )}
              </Card>
            </motion.div>

            {/* Sidebar — 2/5 */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} transition={{ duration: 0.5, delay: 0.15 }}
              className="lg:col-span-2 space-y-5"
            >
              {/* Contatti diretti */}
              <Card className="p-5">
                <h3 className="font-heading font-bold text-card-foreground mb-4 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-accent" /> Contatti diretti
                </h3>
                <div className="divide-y">
                  {[
                    { icon: Mail, label: "Email", value: EMAIL_ADDR, href: `mailto:${EMAIL_ADDR}` },
                    { icon: Phone, label: "Telefono", value: TEL, href: `tel:${TEL.replace(/\s/g, "")}` },
                    { icon: MessageCircle, label: "WhatsApp", value: TEL, href: `https://wa.me/${WHATSAPP}` },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <item.icon className="h-4 w-4 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-sm font-medium text-card-foreground hover:text-accent transition-colors block truncate">{item.value}</a>
                        ) : (
                          <p className="text-sm font-medium text-card-foreground truncate">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Orari */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-card-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4 text-accent" /> Orari
                  </h3>
                  <Badge className={open ? "bg-green-500/15 text-green-700 hover:bg-green-500/15 border-green-500/30" : "bg-muted text-muted-foreground border"}>
                    <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${open ? "bg-green-600" : "bg-muted-foreground"}`} />
                    {open ? "Aperto ora" : "Chiuso ora"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {orari.map((o) => (
                    <div key={o.giorno} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{o.giorno}</span>
                      <span className="font-medium text-card-foreground">{o.ore}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Vieni a trovarci CTA */}
              <Card className="p-5 bg-gradient-to-br from-accent/10 to-primary/5 border-accent/20">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                    <Calendar className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-card-foreground">Vieni a trovarci</h3>
                    <p className="text-sm text-muted-foreground mt-1">Visita guidata gratuita, su appuntamento.</p>
                  </div>
                </div>
                <Button onClick={prefillVisit} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Prenota una visita
                </Button>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mappa + Distanze */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Dove siamo</h2>
            <Button asChild variant="outline" size="sm">
              <a href="https://www.google.com/maps/search/?api=1&query=Padova" target="_blank" rel="noopener noreferrer">
                Apri in Google Maps <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
              </a>
            </Button>
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}
            className="rounded-xl overflow-hidden border aspect-[16/9] md:aspect-[21/9] bg-card">
            <iframe
              title="Posizione Studentato Padova"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2807.6!2d11.8767!3d45.4064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x477eda5d5cc73967%3A0x90b04b6fa12f3cf!2sPadova%20PD!5e0!3m2!1sit!2sit!4v1700000000000"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>

        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-16">
        <div className="container max-w-3xl">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}
            className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center mb-2">
            Domande frequenti
          </motion.h2>
          <p className="text-muted-foreground text-center mb-8">Le risposte alle domande più comuni che riceviamo.</p>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} transition={{ delay: 0.1 }}>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border rounded-xl bg-card px-5">
                  <AccordionTrigger className="text-left font-medium text-card-foreground hover:no-underline">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* CTA WhatsApp */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} transition={{ delay: 0.2 }}
            className="mt-10 rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-6 md:p-8 text-center">
            <h3 className="font-heading text-xl md:text-2xl font-bold text-primary-foreground mb-2">Non hai trovato risposta?</h3>
            <p className="text-primary-foreground/80 mb-5 max-w-lg mx-auto">Scrivici su WhatsApp — rispondiamo Lun–Ven 9:00–17:00.</p>
            <Button asChild size="lg" className="bg-[#25D366] text-white hover:bg-[#25D366]/90">
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4 mr-2" /> Scrivici su WhatsApp
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
