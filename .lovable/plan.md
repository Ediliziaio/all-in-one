

# Completamento Piattaforma StudentatoPD — Piano Completo

## Stato attuale
Ho analizzato tutti i file del progetto. La struttura è solida con 3 aree (pubblica, admin, studente), ma mancano diversi pezzi per renderlo funzionante al 100%.

---

## Cosa manca e cosa aggiungo

### 1. Pagina Admin Impostazioni (rotta morta)
La sidebar admin ha "Impostazioni" ma la pagina non esiste. Creo `AdminImpostazioni.tsx` con: nome struttura, email, telefono, orari apertura, gestione notifiche email, pulsante salva.

### 2. Sistema Notifiche
Nessuna notifica in tutto il sito. Creo `NotificationBell.tsx` — campanella con badge contatore e dropdown notifiche mock (nuova prenotazione, risposta ticket, nuovo buono). Lo integro negli header Admin e Studente.

### 3. Header Dashboard consistente
Admin e Studente non hanno un header top. Creo `DashboardHeader.tsx` con: titolo pagina, barra ricerca, campanella notifiche, avatar utente. Lo integro in entrambi i layout.

### 4. Form Prenotazione funzionante
Il bottone "Richiedi Prenotazione" in CameraDettaglio non fa nulla. Aggiungo Dialog con form: nome, email, date, messaggio + toast conferma.

### 5. Wizard Prenotazione Studente
Creo `PrenotaCamera.tsx` — wizard a step: Scegli camera → Date → Dati → Riepilogo → Conferma. Rotta `/studente/prenota`.

### 6. Pagina Documenti Studente (mancante)
Creo `Documenti.tsx` — contratto attivo, ricevute pagamento, documenti caricati. Lista mock con icone PDF e download simulato.

### 7. Pagina Pagamenti Studente (mancante)
Creo `Pagamenti.tsx` — storico completo con stato (Pagato/In scadenza/Scaduto), prossima scadenza evidenziata, totale speso.

### 8. Azioni Admin funzionanti
- **AdminPrenotazioni**: Conferma/Rifiuta aggiornano lo stato con useState locale
- **AdminStudenti**: bottone "Vedi dettaglio" con Dialog info complete
- **AdminCamere**: "Modifica" apre Dialog pre-compilato, "Foto" simula upload
- **AdminSupporto**: risposta si aggiunge visivamente al ticket

### 9. Dark Mode Toggle
Aggiungo toggle dark/light nella Navbar pubblica e negli header dashboard. Il CSS ha già le variabili `.dark`.

### 10. Mock Data aggiuntivi
Aggiungo in `mockData.ts`: interfaccia + array `mockNotifications`, `mockDocumenti`, `mockPagamenti`.

---

## File coinvolti

**Nuovi (8 file)**:
- `src/pages/admin/AdminImpostazioni.tsx`
- `src/pages/studente/PrenotaCamera.tsx`
- `src/pages/studente/Documenti.tsx`
- `src/pages/studente/Pagamenti.tsx`
- `src/components/NotificationBell.tsx`
- `src/components/DashboardHeader.tsx`
- `src/components/ThemeToggle.tsx`

**Modificati (9 file)**:
- `src/App.tsx` — nuove routes
- `src/layouts/AdminLayout.tsx` — header con notifiche, ricerca, dark mode
- `src/layouts/StudenteLayout.tsx` — menu + header aggiornati
- `src/pages/CameraDettaglio.tsx` — form prenotazione
- `src/pages/admin/AdminStudenti.tsx` — dialog dettaglio
- `src/pages/admin/AdminPrenotazioni.tsx` — azioni con state
- `src/pages/admin/AdminCamere.tsx` — modifica funzionante
- `src/data/mockData.ts` — nuovi dati mock
- `src/components/Navbar.tsx` — dark mode toggle

