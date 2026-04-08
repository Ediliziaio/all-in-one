

# Elementi Mancanti dal Masterprompt — Senza Cloud/Backend

## Analisi Gap

Confrontando il masterprompt con il codice attuale, mancano i seguenti elementi:

### 1. Navbar — Link mancanti
Il masterprompt specifica: **Home, Camere, Servizi, Community, Contatti**. Attualmente ci sono: Camere, Servizi, Vantaggi. 
- Aggiungere "Community" (link a `/studente/community` o sezione ancora pubblica)
- Aggiungere "Contatti" (scroll a footer o sezione contatti)
- "Vantaggi" resta perché già creata, ma non è nel masterprompt originale — la teniamo come voce extra
- Mobile: sostituire il div menu con **Sheet** di shadcn (slide da destra) come richiesto

### 2. Footer — Miglioramenti
- Struttura 3 colonne come da spec: **Studentato** (Home, Camere, Servizi) / **Per Studenti** (Area Riservata, Community, FAQ) / **Contatti**
- Aggiungere **icone social**: Instagram, TikTok, WhatsApp (lucide-react)
- Aggiungere **P.IVA** e link **Privacy Policy** nel bottom bar

### 3. Navbar — Indicatore attivo animato
- Aggiungere underline animato con `framer-motion layout` sul link attivo (attualmente solo cambio colore)

### 4. Hero Section — "Disponibile per A.A. 2025/2026"
- Il masterprompt indica un badge "Disponibile per A.A. 2025/2026" — attualmente c'è "Ultime 8 camere disponibili". Aggiungere anche il badge A.A.
- Aggiungere "Posti limitati — Solo 8 rimasti" come urgency banner sotto le stats

### 5. Pagina Camere — Filtri mancanti
Il masterprompt specifica filtri aggiuntivi:
- **Prezzo max**: slider da 200€ a 800€
- **Disponibilità**: date picker per check-in
- **Servizi inclusi**: checkbox Bagno privato / Balcone / TV / Aria condizionata
- Button "Applica filtri" + "Reset"
- Attualmente c'è solo filtro per tipo e piano

### 6. Skeleton/Loading States
- Il masterprompt richiede skeleton shimmer su tutte le liste — attualmente nessuna pagina ha loading skeleton
- Aggiungere `Skeleton` shadcn su pagine chiave: Camere, Community, Guide, Buoni

### 7. Empty States
- Il masterprompt richiede empty state con illustrazione + testo + CTA su ogni lista vuota
- Aggiungere empty states su: filtri camere senza risultati, ticket vuoti, buoni vuoti per categoria

### 8. Pagina Contatti (opzionale)
- Il masterprompt mette "Contatti" nella navbar ma non definisce una pagina dedicata — probabilmente scroll al footer. Implementiamo come smooth scroll al footer.

## File coinvolti
- **Modifica**: `src/components/Navbar.tsx` — link Community e Contatti, Sheet mobile, underline animato
- **Modifica**: `src/components/Footer.tsx` — 3 colonne, social icons, P.IVA, Privacy
- **Modifica**: `src/components/home/HeroSection.tsx` — badge A.A., urgency banner
- **Modifica**: `src/pages/Camere.tsx` — filtri aggiuntivi (prezzo slider, servizi, date picker, reset)
- **Modifica**: `src/pages/studente/Community.tsx` — skeleton loading
- **Modifica**: `src/pages/studente/Guide.tsx` — skeleton + empty state
- **Modifica**: `src/pages/studente/Buoni.tsx` — empty state per categoria vuota

## Cose GIÀ implementate (nessun intervento)
- Design system (colori, font) ✓
- Routing completo ✓
- Layout Admin con sidebar + mobile bottom nav ✓
- Layout Studente con sidebar + mobile bottom nav ✓
- Tutte le pagine admin (Dashboard, Camere, Prenotazioni, Studenti, Supporto, Buoni, Guide) ✓
- Tutte le pagine studente ✓
- Auth pages (Login, Register) ✓
- Framer Motion animations ✓
- Galleria Airbnb su CameraDettaglio ✓
- Pagine Servizi e Vantaggi ✓
- Mock data completi ✓

