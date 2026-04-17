

# Migliorare la pagina Contatti

## Diagnosi
Pagina funzionale ma piatta: hero generico, form e info su due colonne uguali, mappa con URL embed rotto (coordinate vuote), nessuna scelta rapida del canale di contatto, FAQ in fondo isolata.

## Cosa cambio

### 1. Hero più caldo e diretto
- Badge "Rispondiamo in 24h" sopra il titolo
- Titolo + sottotitolo, e subito sotto **3 "quick contact card"** orizzontali (WhatsApp, Telefono, Email) cliccabili — l'utente che vuole un contatto rapido non deve scrollare al form

### 2. Layout form rivisto
- Layout 5/7 invece di 50/50: form più grande a sinistra (lg:col-span-3), info compatte a destra (lg:col-span-2)
- **Card form** con bordo, ombra leggera e padding generoso (non form "nudo")
- **Counter caratteri** nel textarea (es. `145 / 1000`) live
- **Privacy checkbox** obbligatoria con link a privacy policy
- Pulsante invio full-width, sticky-feel con icona
- Stato success inline (oltre al toast): card verde con check + messaggio + bottone "Invia un altro messaggio"

### 3. Sidebar info ridisegnata
- Card "Contatti diretti" con divider tra ogni voce, hover state più visibile
- **Card orari** separata e più grafica: tabella giorni/orari + badge "Aperto ora" verde se nell'orario
- **Card "Vieni a trovarci"** con CTA "Prenota una visita" → apre il form pre-compilato

### 4. Mappa funzionante + distanze
- Sostituisco l'URL Google Maps rotto con un embed valido per Padova (coordinate corrette)
- Sotto la mappa, le 4 distanze diventano una **bar orizzontale compatta** (4 colonne con icona + km/min) invece di lista verticale lunga
- Bottone "Apri in Google Maps" sopra la mappa

### 5. FAQ migliorata
- Aggiungo 2 FAQ (totale 6): "Posso pagare con carta?", "Quanto tempo per la conferma?"
- Sotto la FAQ aggiungo banda CTA "Non hai trovato risposta? Scrivici su WhatsApp" con bottone

### 6. Validazione + sicurezza
- Aggiungo **zod** per validazione (già nel progetto come dep di shadcn)
- Limiti char espliciti: nome 100, email 255, telefono regex italiano, messaggio 1000
- `encodeURIComponent` se in futuro si manda al WhatsApp link

## Tecnica
- Nessuna nuova dipendenza (zod, sonner, lucide, shadcn già presenti)
- Riuso `Card`, `Badge`, `Checkbox` di shadcn
- Token semantici brand (primary, accent, success)
- Mobile-first: card stack verticali su `<lg`, quick-contact a 1 colonna su mobile poi 3 da `sm:`

## File modificati (1)

1. **`src/pages/Contatti.tsx`** — redesign completo (hero + quick contact, form card con counter+privacy+success state, sidebar info+orari+mappa funzionante, FAQ estesa + CTA WhatsApp)

