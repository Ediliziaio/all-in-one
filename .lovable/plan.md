

## Problema attuale (mobile)
- Il collage immagini è `hidden lg:block` → su mobile NESSUNA foto, solo testo
- Hero su mobile = muro di testo statico, perde impatto
- Stats e trust badges affollati, poco respiro
- Badge "Settembre 2025" hardcoded (anche se siamo nel 2026)

## Obiettivo
Rendere la HeroSection mobile visivamente ricca quanto desktop, con foto, gerarchia chiara e migliore respiro. Migliorare anche la versione desktop con qualche dettaglio.

## Soluzione

### 1. Hero immagine mobile (NUOVO)
Su mobile/tablet aggiungo un'immagine **sopra** il contenuto testuale con effetto Ken Burns:
- Visibile solo `<lg`, nascosta su desktop (dove c'è già il collage a destra)
- Layout: immagine full-width con altezza `h-56 sm:h-72`, rounded-2xl, ombra
- Sopra l'immagine: badge floating "4.9★ 127 recensioni" (chip glassmorphism) per credibilità immediata
- Sotto-overlay gradient dal basso per leggibilità badge

### 2. Riorganizzazione contenuto mobile
- Badge "Posti limitati" → centrato su mobile, allineato a sx su desktop
- H1 → centrato su mobile (`text-center lg:text-left`)
- Paragrafo → centrato su mobile
- CTA → full-width verticali su mobile (già fatto, ok)
- Stats: invece di 3 in fila stretti, **grid 3 colonne** con card piccole (bg-card/50, rounded-xl, padding) → più respiro e leggibilità
- Trust badges: chip pill con bg leggero invece di solo testo+icona, più visibili

### 3. Fix dinamico badge "Settembre 2025"
Calcolo dinamico: se siamo dopo settembre dell'anno corrente, mostra anno+1. Stesso pattern di `UrgencySection`.

### 4. Miglioramenti desktop (bonus)
- Aggiungo terza foto floating piccola in alto a destra per equilibrare il collage
- Padding hero aumentato (`py-16 md:py-28`) per più presenza
- Gradient mesh sfondo già c'è, aggiungo un blob colorato decorativo dietro al testo

### 5. Performance
- `loading="eager"` solo sull'immagine LCP mobile (la prima visibile), `loading="lazy"` su tutte le altre
- Aggiungo `width`/`height` per evitare CLS

## Layout mobile finale (ASCII)
```text
┌─────────────────────┐
│  [IMG hero KenBurns]│  ← NUOVO
│   ★4.9 chip overlay │
├─────────────────────┤
│   • Posti limitati  │  ← centered
│                     │
│   La Tua Casa a     │
│   Padova, Senza...  │  ← centered
│                     │
│   Camera privata... │
│                     │
│  [Scopri Camere ▶]  │  ← full width
│  [Prenota visita]   │
│                     │
│  ┌───┬───┬───┐      │
│  │4.9│98%│€0 │      │  ← grid card stats
│  └───┴───┴───┘      │
│                     │
│ ✓Contratto ⏱24/7    │  ← chip pills
│ ✓Tutto incluso      │
└─────────────────────┘
```

## File modificati (1)
- `src/components/home/HeroSection.tsx` → aggiungo immagine hero mobile, riorganizzo allineamenti, ridisegno stats come grid card, trust badges come pill, anno dinamico, +1 foto floating desktop

Nessun nuovo file, nessuna nuova dipendenza.

