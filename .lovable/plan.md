

# Restyling Colori e Stile Google

## Concetto
Via il blu scuro e l'arancione. Il sito adotta la palette Google: sfondo bianco pulito, colori primari Google usati come accenti (Blu #4285F4 primario, Rosso #EA4335 per urgenza, Giallo #FBBC04 per highlight, Verde #34A853 per successo/disponibilità). Stile Material-like: ombre morbide, bordi arrotondati, tipografia pulita.

## Palette Google (HSL)
- **Primary (Blu Google)**: `217 89% 61%` (#4285F4) — CTA, link, header
- **Accent (Giallo Google)**: `43 96% 50%` (#FBBC04) — badge, highlight
- **Success (Verde Google)**: `142 53% 43%` (#34A853) — disponibilità, conferme
- **Destructive (Rosso Google)**: `7 81% 56%` (#EA4335) — errori, urgenza
- **Background**: bianco puro `0 0% 100%`, foreground grigio scuro `220 9% 25%`
- **Muted**: grigi chiarissimi Google-style `220 14% 96%`

## Modifiche

### 1. CSS Variables (`src/index.css`)
Riscrivere tutte le variabili `:root` e `.dark` con la palette Google. Background bianchissimo, primary = blu Google, accent = giallo Google.

### 2. HeroSection (`src/components/home/HeroSection.tsx`)
- Sfondo da blu scuro → sfondo bianco con gradient morbido grigio chiaro, oppure blu Google leggero
- Testo scuro su sfondo chiaro (stile Google homepage)
- Badge e stats con i 4 colori Google distribuiti
- CTA primario blu Google, secondario outline

### 3. Navbar (`src/components/Navbar.tsx`)
- Logo "SP" con i 4 colori Google (come la G di Google)
- Underline attivo in blu Google
- CTA "Richiedi info" in blu Google

### 4. Tutti i componenti con `bg-accent` / `text-accent`
Cambiano automaticamente grazie alle CSS variables — giallo Google al posto dell'arancione. Alcuni punti dove l'arancione è hardcoded (classi `bg-accent`) verranno aggiornati di conseguenza.

### 5. WhatsAppButton, HowItWorksSection, ServicesSection, cards
I colori accent/primary si aggiornano via variabili. Verifico e correggo eventuali colori hardcoded.

### 6. Memory update
Aggiornare `mem://design/tokens` e `mem://index.md` con la nuova palette.

## File coinvolti
- **Modifica**: `src/index.css` (variabili colore), `src/components/home/HeroSection.tsx` (sfondo/stile), `src/components/Navbar.tsx` (logo multicolore)
- **Modifica**: `mem://design/tokens`, `mem://index.md`
- Tutti gli altri componenti si aggiornano automaticamente via CSS variables

