import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { MapPin, Mail, Phone, Clock, GraduationCap, Train, ShoppingBag, TreePine, Send, MessageCircle } from "lucide-react";

const distances = [
  { icon: GraduationCap, label: "Università di Padova (Bo)", distance: "5 min a piedi" },
  { icon: Train, label: "Stazione FS Padova", distance: "12 min in bus" },
  { icon: ShoppingBag, label: "Centro storico", distance: "3 min a piedi" },
  { icon: TreePine, label: "Prato della Valle", distance: "8 min in bici" },
];

const faqs = [
  { q: "Come posso prenotare una camera?", a: "Puoi sfogliare le camere disponibili nella sezione Camere e cliccare su 'Richiedi Prenotazione'. Verrai ricontattato entro 24 ore per confermare la disponibilità." },
  { q: "Quali sono i termini di pagamento?", a: "Il canone mensile si paga entro il 5 di ogni mese tramite bonifico bancario. La cauzione è pari a 2 mensilità e viene restituita al termine del contratto." },
  { q: "Posso visitare lo studentato prima di prenotare?", a: "Certo! Organizziamo visite guidate dal lunedì al venerdì, dalle 10:00 alle 17:00. Contattaci per fissare un appuntamento." },
  { q: "È possibile disdire il contratto anticipatamente?", a: "Sì, con un preavviso di 3 mesi. In caso di rinuncia anticipata senza preavviso, la cauzione non verrà restituita." },
];

const fade = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function Contatti() {
  const [form, setForm] = useState({ nome: "", email: "", telefono: "", oggetto: "", messaggio: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nome.trim()) e.nome = "Il nome è obbligatorio";
    if (!form.email.trim()) e.email = "L'email è obbligatoria";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email non valida";
    if (!form.oggetto) e.oggetto = "Seleziona un oggetto";
    if (!form.messaggio.trim()) e.messaggio = "Il messaggio è obbligatorio";
    else if (form.messaggio.length > 1000) e.messaggio = "Massimo 1000 caratteri";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Messaggio inviato!", { description: "Ti risponderemo entro 24 ore." });
      setForm({ nome: "", email: "", telefono: "", oggetto: "", messaggio: "" });
      setErrors({});
    }, 1200);
  };

  const set = (key: string, val: string) => {
    setForm((p) => ({ ...p, [key]: val }));
    if (errors[key]) setErrors((p) => { const n = { ...p }; delete n[key]; return n; });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fade} transition={{ duration: 0.6 }} className="text-center max-w-2xl mx-auto">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">Contattaci</h1>
            <p className="text-muted-foreground mt-4 text-lg">Scrivici — rispondiamo davvero entro 24 ore (sì, anche su WhatsApp).</p>
          </motion.div>
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} transition={{ duration: 0.5 }}>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Inviaci un messaggio</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="nome">Nome *</Label>
                    <Input id="nome" placeholder="Il tuo nome" value={form.nome} onChange={(e) => set("nome", e.target.value)} className={errors.nome ? "border-destructive" : ""} />
                    {errors.nome && <p className="text-xs text-destructive">{errors.nome}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" placeholder="nome@email.com" value={form.email} onChange={(e) => set("email", e.target.value)} className={errors.email ? "border-destructive" : ""} />
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="telefono">Telefono</Label>
                    <Input id="telefono" placeholder="+39 ..." value={form.telefono} onChange={(e) => set("telefono", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Oggetto *</Label>
                    <Select value={form.oggetto} onValueChange={(v) => set("oggetto", v)}>
                      <SelectTrigger className={errors.oggetto ? "border-destructive" : ""}><SelectValue placeholder="Seleziona..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info camere</SelectItem>
                        <SelectItem value="prenotazione">Prenotazione</SelectItem>
                        <SelectItem value="supporto">Supporto</SelectItem>
                        <SelectItem value="altro">Altro</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.oggetto && <p className="text-xs text-destructive">{errors.oggetto}</p>}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="messaggio">Messaggio *</Label>
                  <Textarea id="messaggio" rows={5} placeholder="Scrivi il tuo messaggio..." value={form.messaggio} onChange={(e) => set("messaggio", e.target.value)} className={errors.messaggio ? "border-destructive" : ""} />
                  {errors.messaggio && <p className="text-xs text-destructive">{errors.messaggio}</p>}
                </div>
                <Button type="submit" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto" disabled={sending}>
                  {sending ? "Invio in corso..." : <><Send className="h-4 w-4 mr-2" /> Invia messaggio</>}
                </Button>
              </form>
            </motion.div>

            {/* Info + Mappa */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} transition={{ duration: 0.5, delay: 0.15 }} className="space-y-6">
              <h2 className="font-heading text-2xl font-bold text-foreground">Informazioni</h2>

              <div className="rounded-xl border bg-card p-6 space-y-4">
                {[
                  { icon: MapPin, label: "Via Esempio 42, 35121 Padova" },
                  { icon: Mail, label: "info@studentatopd.it", href: "mailto:info@studentatopd.it" },
                  { icon: Phone, label: "+39 049 123 4567", href: "tel:+390491234567" },
                  { icon: Clock, label: "Lun–Ven: 9:00–18:00" },
                  { icon: MessageCircle, label: "WhatsApp: +39 049 123 4567", href: "https://wa.me/390491234567" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <item.icon className="h-4 w-4 text-accent" />
                    </div>
                    {item.href ? (
                      <a href={item.href} className="text-sm text-card-foreground hover:text-accent transition-colors">{item.label}</a>
                    ) : (
                      <span className="text-sm text-card-foreground">{item.label}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Mappa */}
              <div className="rounded-xl overflow-hidden border aspect-video">
                <iframe
                  title="Posizione StudentatoPD"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2845.!2d11.8768!3d45.4064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zPadova!5e0!3m2!1sit!2sit!4v1"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Distanze */}
              <div className="space-y-3">
                {distances.map((d) => (
                  <div key={d.label} className="flex items-center gap-3 rounded-lg border bg-card p-3">
                    <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <d.icon className="h-4 w-4 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-card-foreground">{d.label}</p>
                      <p className="text-xs text-muted-foreground">{d.distance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-muted/50">
        <div className="container max-w-3xl">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
            Domande frequenti
          </motion.h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} transition={{ delay: 0.1 }}>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border rounded-xl bg-card px-5">
                  <AccordionTrigger className="text-left font-medium text-card-foreground">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}