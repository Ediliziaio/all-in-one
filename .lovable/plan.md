

# Ottimizzazione completa Area Studente

## Diagnosi

**Bene**: pagine già funzionanti, motion wrappers, layout sidebar+header.

**Problemi mobile**:
- Tutte le pagine usano `p-6` fisso → troppo padding su mobile, contenuto stretto
- `MiaCamera`: galleria `h-64`/`h-32` non si adatta, storico pagamenti rompe layout (3 elementi flex senza gap)
- `Pagamenti`: lista usa `flex` con 4 elementi → scadenza+importo+badge si schiacciano su mobile
- `Documenti`: stessa cosa, badge+button finiscono fuori
- `Supporto`: ticket row ha 4 elementi flex senza wrap mobile
- `Community`: composer textarea+avatar non funziona su mobile, sidebar nascosta ok ma "prossimi eventi" persa
- `PrenotaCamera`: stepper scrolla orizzontale ok ma `grid-cols-2` per date/dati su mobile è stretto
- `StudenteLayout` mobile bottom nav: 5 voci ma le pagine importanti come Pagamenti/Documenti/Supporto non sono raggiungibili rapidamente; manca avatar/menu mobile
- `DashboardHeader`: search occupa tutto su mobile, no toggle sidebar

**Cose mancanti**:
- **Notifiche reali**: NotificationBell esiste ma non c'è una pagina/centro
- **Stato manutenzione/scadenze in evidenza** sulla home (es. "rata in scadenza tra 5 giorni")
- **Quick actions sulla home**: pagare/aprire ticket/prenotare in 1 tap
- **Mancanza menu "Altro" su mobile** per accedere alle voci non in bottom nav
- **MiaCamera**: manca link rapido per aprire ticket dalla camera, manca data scadenza contratto
- **Pagamenti**: manca CTA "Paga ora" su rate in scadenza, manca metodo di pagamento salvato
- **Documenti**: manca upload documenti da parte studente (carta identità, codice fiscale)
- **Supporto**: manca chat/timeline con risposte multiple, manca FAQ in cima

**Cose superflue da rimuovere**:
- `MiaCamera`: storico pagamenti duplicato (esiste già pagina Pagamenti) → sostituire con info contratto
- `Community`: bottoni "Post/Evento/Annuncio/Cercasi" come badge non cliccabili veri → renderli funzionali o ridurli
- `StudenteHome`: greeting con emoji 👋 e "Ticket aperti" come grossa card se sono 0
- `PrenotaCamera`: step "Dati personali" mostra solo dati readonly → fonderlo nel riepilogo

## Cosa faccio

### A. Layout & navigazione mobile
1. **`StudenteLayout.tsx`**:
   - Padding container responsive: `p-4 md:p-6`
   - Bottom nav: 4 voci principali (Home, Camera, Community, Profilo) + 5° voce "Altro" che apre Sheet con il resto
   - Sheet "Altro" mobile: lista compatta di Pagamenti, Documenti, Supporto, Buoni, Guide, Prenota, Esci
   - Avatar header tap → apre menu profilo
2. **`DashboardHeader.tsx`**:
   - Su mobile: nascondi search, mostra solo logo/titolo pagina + notifiche + avatar
   - Search compare con icona-toggle se serve

### B. Home studente (`StudenteHome.tsx`)
- **Quick actions row** in cima: 4 bottoni icona+label (Apri ticket / Paga rata / Prenota / Buoni)
- **Alert banner** condizionale se rata in scadenza < 7 giorni (warning con CTA "Paga ora")
- **Card "La mia camera"** + **"Prossima scadenza"** + **"Ticket attivi"** in grid 1/2/3
- Rimuovo emoji greeting, rendo più sobrio
- **Eventi prossimi** dalla community sotto i post

### C. MiaCamera
- Galleria responsive: su mobile prima foto full-width, le altre `grid-cols-3`
- Sostituisco "storico pagamenti" con **card "Contratto"**: data inizio/fine, scadenza, link a documento
- **CTA "Apri ticket per questa camera"** con prefill categoria
- Compagni di piano: avatar list orizzontale scrollabile su mobile

### D. Pagamenti
- Lista responsive: su mobile **stack verticale** (mese sopra, importo+stato sotto)
- **Bottone "Paga ora"** verde su rate `in_scadenza`/`scaduto`
- Card "Metodo di pagamento" in cima con IBAN/carta salvata + bottone "Modifica"
- Filtro tabs: Tutti / Da pagare / Pagati

### E. Documenti
- Lista responsive: stack su mobile
- **Sezione "I miei documenti"** (caricati da studente): carta identità, codice fiscale con stato (caricato/mancante)
- Bottone "Carica documento" che apre dialog upload (mock)
- Sezione "Documenti dallo studentato" (contratti, ricevute) come ora

### F. Supporto
- **FAQ accordion** in cima (5 domande comuni: wifi, riscaldamento, pulizie, chiavi, pagamenti)
- Form: ticket row su mobile con stack verticale, badge inline
- Detail dialog: timeline messaggi (richiesta studente → risposta admin → eventuali repliche)
- CTA WhatsApp diretto in fondo

### G. Community
- Composer responsive: avatar piccolo, textarea full-width sotto su mobile
- Tipo post come **toggle group** vero (selezionabile uno alla volta) con stato attivo
- Sidebar destra: appare anche su mobile come **collapse "Eventi" sopra** ai post

### H. PrenotaCamera
- Stepper: 4 step invece di 5 (unisco "Dati" nel "Riepilogo")
- Date input: `grid-cols-1 sm:grid-cols-2`
- Nav buttons: full-width su mobile

### I. MioProfilo
- Già OK, solo mobile padding e avatar+button stack su mobile
- Aggiungo sezione **"Notifiche"** con switch (email, push, eventi community)

### J. Buoni & Guide
- Già responsive bene, solo: `p-4 md:p-6`, ridurre padding card su mobile

## File modificati (12)

1. `src/layouts/StudenteLayout.tsx` — bottom nav 4+1, Sheet "Altro"
2. `src/components/DashboardHeader.tsx` — mobile compatto, toggle search
3. `src/pages/studente/StudenteHome.tsx` — quick actions, alert scadenza, layout pulito
4. `src/pages/studente/MiaCamera.tsx` — contratto al posto di pagamenti, CTA ticket, mobile gallery
5. `src/pages/studente/Pagamenti.tsx` — paga ora, metodo pagamento, filtri, mobile stack
6. `src/pages/studente/Documenti.tsx` — sezione upload documenti studente, mobile stack
7. `src/pages/studente/Supporto.tsx` — FAQ accordion, timeline, mobile stack, WA CTA
8. `src/pages/studente/Community.tsx` — composer mobile, toggle group, eventi mobile
9. `src/pages/studente/PrenotaCamera.tsx` — 4 step, mobile date stack, nav full-width
10. `src/pages/studente/MioProfilo.tsx` — sezione notifiche, mobile padding
11. `src/pages/studente/Buoni.tsx` — padding mobile
12. `src/pages/studente/Guide.tsx` — padding mobile

Nessuna nuova dipendenza. Solo classi Tailwind, riuso shadcn (Sheet, Accordion, ToggleGroup, Tabs, Dialog).

