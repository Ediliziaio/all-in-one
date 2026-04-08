

# Pagina Contatti Dedicata

## Cosa viene creato

Una nuova pagina `/contatti` con:

### 1. Hero section
- Titolo "Contattaci" con sottotitolo e animazione fade-up

### 2. Layout a 2 colonne (mobile: stacked)
**Colonna sinistra — Form di contatto:**
- Campi: Nome, Email, Telefono (opzionale), Oggetto (select: Info camere / Prenotazione / Supporto / Altro), Messaggio (textarea)
- Validazione client-side con feedback errori inline
- Submit mostra toast di conferma (mock, no backend)
- Animazioni Framer Motion

**Colonna destra — Info + Mappa:**
- Card con info contatto (indirizzo, email, telefono, orari ufficio)
- Mappa Google Maps embed (riuso stile MapSection esistente)
- Card distanze dai punti di interesse (riuso dati da MapSection)

### 3. Sezione FAQ rapida
- 3-4 domande frequenti con Accordion di shadcn sotto il form

## Modifiche al routing e navigazione
- Aggiungere rotta `/contatti` in `App.tsx`
- Aggiornare "Contatti" nella Navbar: da smooth-scroll a link `/contatti`
- Aggiungere link nel Footer

## File coinvolti
- **Nuovo**: `src/pages/Contatti.tsx`
- **Modifica**: `src/App.tsx` (rotta)
- **Modifica**: `src/components/Navbar.tsx` (link diretto invece di scroll)
- **Modifica**: `src/components/Footer.tsx` (link a /contatti)

