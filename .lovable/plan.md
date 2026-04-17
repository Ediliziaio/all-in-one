

# UrgencySection redesign + nuova CommunitySection

## 1. UrgencySection — sfondo più caldo e visivo

Sostituisco il grigio piatto (`bg-foreground`) con:
- **Background image** di Padova/studenti (uso un'immagine già presente nel progetto o Unsplash via URL diretto: studenti/città universitaria di sera)
- **Overlay gradient** navy → verde brand semi-trasparente (`from-primary/95 via-primary/90 to-accent/80`) per leggibilità + coerenza col brand Napoleone
- **Noise/grain sottile** opzionale per profondità
- Le card countdown e progress bar restano ma con `bg-background/10 backdrop-blur-md` rinforzato per staccare dall'immagine

Risultato: sezione che "respira", calda, on-brand (navy + verde) invece del grigio neutro.

## 2. Nuova CommunitySection

Inserita tra `TestimonialsSection` e `UrgencySection` in `Index.tsx`.

**Contenuto**:
- Titolo: "Più di una camera. Una **community**."
- Sottotitolo: "Eventi, aperitivi, gruppi studio. A Studentato Napoleone non sei mai solo."
- **3 card visive** con icona + foto:
  1. **Eventi mensili** — aperitivi, cene, serate film
  2. **Gruppi studio** — incontra coinquilini del tuo corso
  3. **Bacheca community** — scambia libri, organizza viaggi, trova compagni
- **Mini-galleria** stile collage: 4-5 foto piccole di momenti community (ridenti, gruppo, studio insieme) con leggero hover-zoom
- **CTA** "Scopri l'area community" → link a `/studente/community` (o `/vantaggi`)

**Stile**: 
- Background `bg-muted/40` con accenti verde brand
- Card con `HoverCard` + StaggerContainer (riuso `MotionWrappers` esistenti)
- Foto da Unsplash (URL diretti, niente download)

## File modificati (3)

1. **`src/components/home/UrgencySection.tsx`** — background image + overlay brand
2. **`src/components/home/CommunitySection.tsx`** — nuovo file
3. **`src/pages/Index.tsx`** — import e inserimento `<CommunitySection />` dopo `<TestimonialsSection />`

