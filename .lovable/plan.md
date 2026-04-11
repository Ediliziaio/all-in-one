

# Da "Prenotazioni" a "Richieste di Affitto"

## Il problema
L'intero flusso usa il termine "prenotazione" come se fosse un hotel. In realtà si tratta di **affitti annuali**: lo studente fa una **richiesta di affitto** per una camera, l'admin la approva, e si firma un contratto.

## Cosa cambia

### Terminologia
| Vecchio | Nuovo |
|---------|-------|
| Prenotazione | Richiesta di affitto |
| Prenotazioni | Richieste |
| Prenota una Camera | Richiedi una Camera |
| Check-in / Check-out | Inizio contratto / Fine contratto |
| Conferma prenotazione | Invia richiesta |
| Prenotazione confermata | Richiesta approvata |
| Prenotazione inviata | Richiesta inviata |

### Flusso studente (PrenotaCamera.tsx)
- Titolo: "Richiedi una Camera"
- Step finale: "Richiesta inviata! Ti contatteremo per il contratto."
- CTA: "Invia Richiesta" invece di "Conferma Prenotazione"
- Date: "Inizio contratto" / "Fine contratto" (default sett 2025 → lug 2026)

### Admin (AdminPrenotazioni.tsx)
- Titolo pagina: "Richieste di Affitto"
- Tab: "In Attesa", "Approvate", "Rifiutate", "Concluse"
- Dialog: "Dettaglio Richiesta"
- Stati: pending → approvata (non "confermata")

### Sidebar e navigazione
- AdminLayout: "Prenotazioni" → "Richieste"
- StudenteLayout: link "Prenota" → "Richiedi Camera"

### Mock data (mockData.ts)
- Tipo `Prenotazione` → `RichiestaAffitto`
- `mockPrenotazioni` → `mockRichieste`
- Stato "confermata" → "approvata"
- Campi `data_inizio`/`data_fine` restano (sono date contratto)

### Dashboard e notifiche
- AdminDashboard: "Prenotazioni in attesa" → "Richieste in attesa"
- StudenteHome: card "Prenotazione" → "La tua richiesta"
- NotificationBell: tipo "prenotazione" → "richiesta"

## File modificati (8)
1. `src/data/mockData.ts` — rinomina tipo e array, stato "approvata"
2. `src/pages/admin/AdminPrenotazioni.tsx` — tutta la terminologia
3. `src/pages/studente/PrenotaCamera.tsx` — titoli, CTA, step labels
4. `src/layouts/AdminLayout.tsx` — label sidebar
5. `src/layouts/StudenteLayout.tsx` — label navigazione
6. `src/pages/admin/AdminDashboard.tsx` — KPI e card
7. `src/pages/studente/StudenteHome.tsx` — card richiesta
8. `src/components/NotificationBell.tsx` — tipo notifica

