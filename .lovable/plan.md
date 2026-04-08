

# Sezione "Chi Siamo" nella Home Page

## Cosa viene creato

Nuovo componente `src/components/home/AboutSection.tsx` inserito nella home tra `TestimonialsSection` e `MapSection`.

### Struttura della sezione

**Parte 1 — Storia dello studentato**
- Layout split-screen: testo a sinistra, immagine Unsplash (edificio/studenti a Padova) a destra
- Titolo "Chi Siamo", sottotitolo e 2-3 paragrafi sulla missione e storia (fondato nel 2018, gestione familiare, comunità)
- 3 mini-stats inline: "7+ anni di esperienza", "500+ studenti ospitati", "98% soddisfazione"
- Animazioni fade-up on scroll

**Parte 2 — Il Team**
- Griglia 4 colonne (2 su mobile) con 4 membri del team
- Ogni card: Avatar circolare (Unsplash), nome, ruolo, breve bio 1 riga
- Ruoli: Fondatore, Responsabile Operativa, Community Manager, Manutenzione
- Hover effect con scale e shadow

**Parte 3 — I nostri valori**
- 3 card con icona, titolo e descrizione (Comunità, Qualità, Trasparenza)
- Layout a 3 colonne con animazioni staggered

### Stile
- Sfondo alternato (grigio chiaro `bg-muted/30`) per contrasto con sezioni adiacenti
- Font heading + body coerenti col design system
- Framer Motion: fade-up, stagger sulle card team e valori

## File coinvolti
- **Nuovo**: `src/components/home/AboutSection.tsx`
- **Modifica**: `src/pages/Index.tsx` (import + inserimento tra Testimonials e Map)

