

Analizzo la home attuale: ha già `framer-motion` su Hero, ma le altre sezioni (`ProblemSection`, `ServicesSection`, `RoomsPreview`, ecc.) sono statiche. Il flusso visivo è una sequenza piatta di blocchi simili, senza ritmo né momenti "wow".

# Rendere la Home più viva e dinamica

## Diagnosi
- **Hero** ha animazioni, ma le immagini fluttuanti sono solo decorative
- **Tutte le sezioni successive** appaiono insieme allo scroll senza gerarchia
- **Nessun parallax, counter animati, hover ricchi, o transizioni tra sezioni**
- **Background uniforme** (alternanza muted/background) → monotono
- **CTA finale debole**, manca tensione narrativa

## Cosa cambio

### 1. Hero più immersivo
- **Ken Burns** lento sull'immagine principale (zoom 1.0 → 1.08 in 20s, loop)
- **Badge "Posti limitati"** con pulse sottile sul pallino
- **Counter animati** sui numeri (4.9★, 98%, €0) che partono da 0 quando entrano in viewport
- **Gradient mesh animato** dietro al testo (blob che si muovono lentamente)

### 2. Scroll storytelling
- **Reveal scaglionati** su ogni sezione: titolo → sottotitolo → cards (stagger 100ms)
- **Parallax leggero** sulle immagini di sezione (`y: [-20, 20]` su scroll)
- **Sticky section headers** opzionale per `HowItWorks` (numeri step che restano visibili)

### 3. Sezione Problem → soluzione (drammatizzazione)
- Card "problema" con bordo rosso sottile + icona shake all'hover
- Frecce animate che collegano problema → soluzione (Studentato Napoleone)

### 4. RoomsPreview dinamica
- **Carousel auto-play** con immagini camere + indicatori
- **Hover 3D tilt** sulle card camera (rotazione lieve su mouse move)
- **Badge "Solo 3 disponibili"** animato

### 5. HowItWorks più visivo
- **Timeline verticale** con linea che si "disegna" allo scroll
- Numeri step grandi con effetto **gradient text** che si muove

### 6. Testimonials carousel auto-rotante
- Sostituisco grid statica con carousel infinito (3 visibili, swipe automatico ogni 5s)
- Stelle che appaiono una alla volta

### 7. UrgencySection con countdown
- **Countdown live** "Settembre 2025 - X giorni rimasti"
- **Barra "12 posti su 50"** che si riempie animata

### 8. Sezione di transizione divisori
- Tra una sezione e l'altra: **wave SVG** o **gradient blend** invece di stacchi netti
- Background leggermente diverso per ogni sezione (warm/cool alternato)

### 9. Floating CTA mobile
- Pulsante WhatsApp già esiste → aggiungo **mini-CTA "Prenota visita"** che appare dopo 30% scroll

### 10. Micro-interazioni
- Cursore custom su elementi interattivi (opzionale)
- Ripple effect sui bottoni primari
- Smooth scroll tra sezioni con anchor links nella navbar

## Approccio tecnico
Uso `framer-motion` (già installato): `useScroll`, `useTransform`, `motion.div` con `whileInView`. Niente nuove dipendenze pesanti. Counter via `useMotionValue` + `animate`. Carousel sfrutto `embla-carousel-react` (già in `components/ui/carousel.tsx`).

## File modificati (~9)
1. `src/components/home/HeroSection.tsx` — Ken Burns, counter, mesh
2. `src/components/home/ProblemSection.tsx` — drammatizzazione, frecce
3. `src/components/home/RoomsPreview.tsx` — carousel + tilt
4. `src/components/home/HowItWorksSection.tsx` — timeline animata
5. `src/components/home/TestimonialsSection.tsx` — carousel auto
6. `src/components/home/UrgencySection.tsx` — countdown + progress bar
7. `src/components/home/ServicesSection.tsx` — stagger + hover ricco
8. `src/pages/Index.tsx` — divisori SVG tra sezioni
9. `src/components/motion/MotionWrappers.tsx` — nuovi wrapper (Counter, Parallax, KenBurns)

## Priorità (se vuoi step incrementali)
**Alta**: Hero (Ken Burns + counter), RoomsPreview carousel, Testimonials carousel, UrgencySection countdown
**Media**: ProblemSection frecce, HowItWorks timeline, divisori SVG
**Bassa**: cursor custom, ripple, floating CTA mobile

Dimmi se vuoi tutto in un colpo o partiamo dalla **priorità alta** (4 sezioni, impatto massimo, modifiche contenute).

