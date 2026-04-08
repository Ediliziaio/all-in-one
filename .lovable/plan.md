

# Revisione UX + Copy Strategico — Target: Studenti + Genitori

## Analisi dei problemi attuali

### Copy: troppo generico, non benefit-driven
- I testi descrivono *cosa c'è* ma non *perché ti cambia la vita*
- Nessun messaggio dedicato ai genitori (sicurezza, affidabilità, valore)
- CTA tutti uguali e poco urgenti ("Scopri le camere" x5)
- "Richiedi info" punta a `/camere` invece che a `/contatti`
- Comparison table nella pagina Vantaggi: 8 righe tutte "noi sì, affitto no" — perde credibilità
- FAQ troppo formali, non parlano come uno studente

### UX: manca il journey per due target diversi
- Zero contenuto per i genitori (chi spesso paga)
- Nessun "Come funziona" (3 step) per ridurre la friction
- Testimonial carousel 1 alla volta = bassa densità di social proof
- Stats nella hero poco significative (45 camere non è un vantaggio)
- Nessun floating WhatsApp button per contatto rapido
- Nessun pricing hint nella homepage

---

## Piano di intervento

### 1. HeroSection — Copy che parla a DUE target
**File**: `src/components/home/HeroSection.tsx`

- **Headline**: "Studia a Padova, vivi senza pensieri" → più emotivo, parla sia allo studente che al genitore
- **Subtitle**: riscrivere benefit-first: "Camera arredata, bollette incluse, WiFi fibra e una community di studenti — tutto in un canone. A 5 minuti dall'università."
- **Badge**: cambiare "Ultime 8 camere" → "Iscrizioni A.A. 2025/2026 aperte — posti limitati"
- **CTA primario**: "Vedi camere e prezzi" (trasparenza = fiducia per genitori)
- **CTA secondario**: "Richiedi info" → linkare a `/contatti` (attualmente va a `/camere`)
- **Stats**: cambiare in numeri che contano: "4.9★ su Google" / "98% rinnova il contratto" / "5 min dall'università"
- **Trust badge sotto urgency**: aggiungere riga con micro-badge: "✓ Contratto regolare" "✓ Assistenza 24/7" "✓ Tutto incluso"

### 2. ServicesSection (homepage) — Benefici, non feature
**File**: `src/components/home/ServicesSection.tsx`

Riscrivere i testi delle 6 card in ottica beneficio:
- "WiFi Fibra" → "WiFi che non ti lascia mai" + "Lezioni online, Netflix, videochiamate: tutto senza lag."
- "Lavanderia Smart" → "Lava quando vuoi" + "Lavatrici e asciugatrici 24/7, prenotabili dall'app."
- "Cucina Comune" → "Cucina come a casa" + "Piani induzione, forno, frigo: cucinati i tuoi piatti preferiti."
- "Palestra" → "Allenati sotto casa" + "Cardio e pesi liberi inclusi nel canone, dalle 6 alle 23."
- "Sicurezza 24/7" → "I tuoi genitori saranno tranquilli" + "Badge, telecamere, portineria. Sempre al sicuro." ← parla ai genitori!
- "Studio Rooms" → "Sessione d'esame? Ci pensiamo noi" + "Sale silenziose prenotabili con prese e luce perfetta."

### 3. Nuova sezione "Come funziona" (homepage)
**File**: nuovo `src/components/home/HowItWorksSection.tsx`

3 step con icone numerate + illustrazione:
1. **Scegli la tua camera** — "Sfoglia il catalogo, filtra per prezzo e servizi."
2. **Invia la richiesta** — "Compila il form, ti rispondiamo entro 24 ore."
3. **Trasferisciti** — "Firma il contratto, prendi le chiavi, inizia la tua avventura."

Posizionare tra ServicesSection e RoomsPreview. Riduce ansia decisionale.

### 4. RoomsPreview (homepage) — Pricing trasparente
**File**: `src/components/home/RoomsPreview.tsx`

- Aggiungere sotto il prezzo: "tutto incluso" in verde
- Cambiare sottotitolo: "Scegli la soluzione perfetta per te" → "Prezzi chiari, tutto incluso. Confronta e scegli."

### 5. TestimonialsSection — Più social proof + voce genitori
**File**: `src/components/home/TestimonialsSection.tsx`

- Mostrare 3 testimonial alla volta su desktop (griglia) invece del carousel 1-alla-volta
- Aggiungere 1-2 testimonial da genitori: "Come mamma, mi sento tranquilla sapendo che mia figlia è in un ambiente sicuro e organizzato." — Genitore target!
- Mantenere carousel su mobile

### 6. AboutSection — Copy più umano
**File**: `src/components/home/AboutSection.tsx`

- Riscrivere intro: meno corporate, più storytelling
- "Siamo partiti nel 2018 con una convinzione semplice: gli studenti meritano di meglio. Meglio di appartamenti fatiscenti, coinquilini a caso e bollette impreviste."

### 7. Pagina Servizi — Testi benefit-first
**File**: `src/pages/Servizi.tsx`

- Hero subtitle: "Servizi pensati per semplificarti la vita" → "Tutto quello che serve, niente di superfluo. Un canone, zero sorprese."
- Sezione "Perché scegliere noi" → riscrivere con copy diretto
- Aggiungere sezione "Per i genitori" con 3 punti trust: contratto regolare, assistenza, sicurezza

### 8. Pagina Vantaggi — Comparison credibile
**File**: `src/pages/Vantaggi.tsx`

- Tabella confronto: dare QUALCHE vantaggio all'affitto tradizionale (es. "Libertà di scelta zona" = sì) per sembrare onesti
- Riscrivere testimonial con tono più naturale/giovane
- CTA: "Convinto? Inizia da qui" → "Pronto? Il tuo posto ti aspetta"

### 9. Pagina Contatti — Copy più caldo
**File**: `src/pages/Contatti.tsx`

- Hero: "Hai domande sulle camere o sulla prenotazione?" → "Scrivici — rispondiamo davvero entro 24 ore (sì, anche su WhatsApp)"
- Aggiungere link WhatsApp diretto nel form sidebar

### 10. Floating WhatsApp Button
**File**: nuovo `src/components/WhatsAppButton.tsx` + aggiungere in `Layout.tsx`

Bottone fisso bottom-right con icona WhatsApp verde, tooltip "Scrivici su WhatsApp". Link a `wa.me/390491234567`. Presente su tutte le pagine pubbliche.

### 11. Navbar — "Richiedi info" visibile
**File**: `src/components/Navbar.tsx`

- CTA "Prenota Ora" → "Richiedi info" (meno impegnativo, meno friction)
- Colore accent mantenuto

---

## File coinvolti (riepilogo)
- **Modifica**: `HeroSection.tsx`, `ServicesSection.tsx`, `RoomsPreview.tsx`, `TestimonialsSection.tsx`, `AboutSection.tsx`, `Servizi.tsx`, `Vantaggi.tsx`, `Contatti.tsx`, `Navbar.tsx`, `Layout.tsx`
- **Nuovo**: `HowItWorksSection.tsx`, `WhatsAppButton.tsx`
- **Modifica**: `Index.tsx` (aggiungere HowItWorksSection)

