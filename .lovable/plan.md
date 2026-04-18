

## Obiettivo
Aggiungere micro-divider SVG (onde) tra le sezioni della home per rendere fluidi i passaggi tra background colorati diversi.

## Analisi
Già esiste `WaveDivider` in `src/components/motion/MotionWrappers.tsx` — perfetto, lo riuso. Accetta `fill` (colore) e `flip` (orientamento).

Logica: ogni divider riempie con il colore della sezione **successiva**, posizionato in fondo alla sezione **precedente**. Così la sezione che arriva "emerge" con un'onda dal background della precedente.

## Mappa transizioni (Index.tsx)

```
Hero (bianco/gradient)
 ↓ wave fill: red/5    → ProblemSection (red/5)
ProblemSection
 ↓ wave fill: blue/5   → ServicesSection (blue/5)
ServicesSection
 ↓ wave fill: white    → RoomsPreview (bianco)
RoomsPreview
 ↓ wave fill: yellow/7 → HowItWorksSection (yellow/[0.07])
HowItWorks
 ↓ wave fill: green/8  → GuaranteeSection
Guarantee
 ↓ wave fill: muted/30 → TestimonialsSection
Testimonials
 ↓ wave gradient blue→red → CommunitySection
Community
 ↓ wave fill: red (pieno) → UrgencySection (red gradient)
Urgency
 ↓ wave fill: muted/30 → AboutSection
About
 ↓ wave fill: white   → MapSection
```

## Implementazione

**1 solo file modificato**: `src/pages/Index.tsx`

Tra ogni coppia di sezioni inserisco un `<WaveDivider>` con:
- `fill` = colore di sfondo della sezione successiva (in formato `hsl(var(--token) / 0.05)`)
- Un wrapper `div` con `-mt-12 md:-mt-20` e `relative z-10` per sovrapporre l'onda al fondo della sezione precedente senza creare gap
- `aria-hidden` sul wrapper

Per rendere i divider più "vivi", alterno:
- onde normali (fill solido tinta sezione successiva)
- onde flippate (fill = sezione precedente, attaccato all'inizio della successiva) → 2-3 punti chiave dove voglio enfasi

Esempio markup:
```tsx
<HeroSection />
<WaveDivider fill="hsl(var(--google-red) / 0.05)" className="-mt-1" />
<ProblemSection />
<WaveDivider fill="hsl(var(--google-blue) / 0.05)" className="-mt-1" />
<ServicesSection />
...
```

## Note tecniche
- `WaveDivider` esiste già → no nuovi file, no nuove dipendenze
- Solo token HSL (no hex hardcoded) come da memoria progetto
- I divider sono `aria-hidden` (decorativi) → no impatto a11y
- Altezza wave: `h-12 md:h-20` (già definita nel componente) → micro, non invasiva
- Z-index gestito perché alcune sezioni hanno blob decorativi: il wave sta sopra il bordo della sezione precedente, sotto il contenuto della successiva

## File modificato
- `src/pages/Index.tsx` (aggiunta 11 `WaveDivider` tra le sezioni)

