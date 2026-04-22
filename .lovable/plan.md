

## Obiettivo
Migliorare l'header (Navbar) per renderlo più premium, leggibile e moderno — coerente con il brand Studentato Napoleone.

## Problemi attuali
- In modalità overlay (homepage in cima) testi grigi su immagine = scarsa leggibilità
- CTA "Richiedi info" è un button standard senza enfasi
- Manca un'indicazione visiva di **telefono/contatto rapido** nell'header (decisione d'acquisto immediata)
- Logo isolato senza wordmark/tagline
- Nessun hover state ricco sui link nav
- Mobile: trigger menu spoglio, manca CTA visibile

## Migliorie proposte

### 1. Top utility bar (sopra navbar principale)
Sottile barra scura con info di contatto rapido — visibile solo desktop, scompare on scroll:
- 📞 telefono cliccabile + 📧 email + 📍 "Padova centro"
- Aumenta fiducia e dà un canale di contatto immediato (best practice hotel/student housing)

### 2. Navbar principale rifinita
- **Overlay mode (home top)**: aggiungere `bg-background/40 backdrop-blur-md` leggero invece di trasparente puro → leggibilità garantita ma effetto glass elegante
- **Scrolled mode**: ombra più morbida + bordo bottom sottile
- **Link nav**: hover con background pill (`hover:bg-muted/60 rounded-full px-3 py-1.5`) + underline animato resta solo sull'attivo
- **CTA primaria**: button "Richiedi info" con icona freccia + leggero glow/shadow al hover
- **CTA secondaria**: "Accedi" con icona user piccola

### 3. Mobile improvements
- Trigger button: aggiungere bordo + bg sottile per visibilità su immagini
- Menu sheet: header con logo grande + tagline "La tua casa a Padova"
- CTA principale "Richiedi info" sticky in fondo al sheet
- Aggiungere icone accanto a ogni voce di menu (Bed, Sparkles, Heart, Users, MessageSquare)
- Sezione contatti diretti in fondo (telefono + WhatsApp + email)

### 4. Logo + wordmark
Affiancare al logo immagine un piccolo wordmark testuale "Napoleone" + microtagline "Studentato · Padova" (visibile da md in su) per rafforzare il brand.

## Layout finale (desktop scrolled)

```text
┌─────────────────────────────────────────────────────────────────┐
│ [LOGO] Napoleone        Camere  Servizi  Vantaggi  Community    │
│        Studentato·PD                              [Accedi][CTA→]│
└─────────────────────────────────────────────────────────────────┘
```

Top utility bar (visibile solo top di pagina, fade out on scroll):

```text
┌─────────────────────────────────────────────────────────────────┐
│ 📞 049 123 4567  ·  ✉ info@napoleonepd.it  ·  📍 Padova centro │
└─────────────────────────────────────────────────────────────────┘
```

## File modificati (1)
- **`src/components/Navbar.tsx`** → riscrittura con:
  - Top utility bar condizionale (visibile solo desktop, hidden on scroll)
  - Wordmark accanto al logo
  - Hover pill sui link nav + underline solo su attivo
  - CTA con icona ArrowRight + shadow
  - Overlay mode con backdrop-blur leggero per leggibilità
  - Mobile sheet ridisegnato: header brandizzato, voci con icone, sezione contatti in fondo, CTA sticky

## Note tecniche
- Nessuna modifica a Layout.tsx (stesso entry point)
- Nessun nuovo dependency (icone già in lucide-react)
- Animazioni con framer-motion già importato
- Mantengo l'underline animato `layoutId="navbar-underline"` esistente
- Top bar: numero telefono e email placeholder — il vero contatto verrà aggiornato dal cliente

