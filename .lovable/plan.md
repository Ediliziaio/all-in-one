

## Obiettivo
Trasformare la pagina `/login` da un form anonimo su sfondo blu in un'esperienza brandizzata **Studentato Napoleone**, con layout split moderno, branding riconoscibile e UX ottimizzata.

## Problemi attuali
- Layout single-card su sfondo gradient blu generico → zero brand identity
- Logo placeholder "SP" testuale invece del vero logo Napoleone
- Copy generico ("StudentatoPD", "Accedi") senza personalità
- Demo accounts visivamente pesanti, occupano metà card
- Nessuna gerarchia visiva: tutti i blocchi hanno stesso peso
- Mancano: "Password dimenticata?", indicatore caps lock, validazione email inline, "Ricordami"
- Nessun valore comunicato → l'utente non sa cosa lo aspetta dopo il login

## Soluzione

### 1. Layout split desktop (50/50), single column mobile
```text
┌──────────────────────┬──────────────────────┐
│                      │                      │
│  PANNELLO BRAND      │  PANNELLO LOGIN      │
│  (immagine Padova    │  (form pulito        │
│   + overlay navy     │   su sfondo bianco)  │
│   + logo + claim     │                      │
│   + 3 benefit)       │  Bentornato 👋       │
│                      │  [Email] [Password]  │
│  Studentato          │  [Ricordami] [Pwd?]  │
│  Napoleone           │  [Accedi]            │
│                      │  ─── oppure ───      │
│  La tua casa a       │  [Google]            │
│  Padova              │                      │
│                      │  Demo: 👤 Studente   │
│  ✓ Camere curate     │        🛡 Admin       │
│  ✓ Community attiva  │                      │
│  ✓ Supporto 24/7     │  Non hai account?    │
│                      │  Registrati          │
└──────────────────────┴──────────────────────┘
```
Su mobile: solo pannello login, brand collassa in header compatto con logo + nome.

### 2. Pannello brand (sinistra desktop)
- Background: foto `padova-twilight.jpg` con overlay `bg-primary/85` (navy brand)
- Logo Napoleone in alto (PNG da `src/assets/logo-napoleone.png` se esiste, fallback testuale Plus Jakarta)
- Headline grande: "Bentornato a casa." + sottotitolo "Studentato Napoleone · Padova"
- Lista 3 benefit con icone Lucide (Home, Users, Headphones) — colore bianco
- Footer piccolo: "Dal 2018 · 500+ studenti"

### 3. Pannello login (destra)
- Sfondo `bg-background` pulito
- Heading "Accedi al tuo account" + sub "Inserisci le tue credenziali"
- Form con micro-miglioramenti UX:
  - **Email**: validazione visiva inline (border verde su email valida)
  - **Password**: indicatore caps lock attivo (badge sopra il campo se rilevato)
  - Toggle show/hide password (già presente, mantenuto)
  - **Riga utility**: checkbox "Ricordami" a sinistra + link "Password dimenticata?" a destra
- Pulsante "Accedi" full-width, accent green, con loader spinner inline (non solo testo)
- Divider "oppure continua con" più discreto
- Pulsante Google secondario, outline

### 4. Demo accounts riprogettati (compatti)
Da blocco prominente → **chip compatti** sotto il form:
- Riga grigia muted: "Demo: " + 2 chip cliccabili `[👤 Studente]` `[🛡 Admin]`
- Click compila E ESEGUE auto-login (one-click demo) → riduce friction
- Tooltip al hover con credenziali per chi vuole vederle

### 5. Micro-interazioni
- Animazione entry: pannello brand slide-in da sx, pannello form fade-in con delay 100ms
- Focus ring brand (accent) sui campi
- Pulsante Accedi: hover scale 1.01, active scale 0.99
- Spinner SVG nel pulsante quando `loading`

### 6. Nuove feature funzionali
- **Caps Lock detection**: `onKeyUp` su password rileva `getModifierState("CapsLock")`, mostra badge "⚠ Caps Lock attivo"
- **Ricordami**: checkbox cosmetica (state locale, no persistenza per ora)
- **Password dimenticata**: link a `/forgot-password` (route placeholder, toast "prossimamente" se non esiste)
- **One-click demo**: i chip demo accounts compilano + submit automatico
- **Validazione email**: regex semplice, classe border verde se valida

### 7. Allineamento brand
- Font: Plus Jakarta su titoli pannello brand, Inter su form
- Colori: solo token semantici (`primary`, `accent`, `muted-foreground`) — niente hardcoded
- Logo: usare `/src/assets/logo-napoleone.png` se esiste, altrimenti placeholder con iniziali "SN" (Studentato Napoleone, non "SP")

## Note tecniche
- **File modificato**: `src/pages/auth/LoginPage.tsx` (riscrittura layout, logica auth invariata)
- **Nessuna nuova dipendenza**: framer-motion, lucide, shadcn/ui già presenti
- **Asset**: verifico esistenza `logo-napoleone.png` (citato in memoria); se non c'è uso fallback testuale "SN"
- **Background image**: riuso `padova-twilight.jpg` già nel progetto
- **Responsive**: `lg:grid-cols-2` per split, `grid-cols-1` mobile con brand header compatto in alto
- **Accessibilità**: label associate, focus visibile, aria-live su caps lock warning, contrasto AA garantito sul pannello navy

## File modificati (1)
- `src/pages/auth/LoginPage.tsx` → riscrittura completa con layout split brandizzato, micro-UX (caps lock, ricordami, forgot pwd, one-click demo), logo Napoleone, copy on-brand

