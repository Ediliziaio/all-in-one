

# Export CSV + Timeline studente

## 1. Export CSV (toolbar)

**Bottone "Esporta CSV"** accanto al toggle vista nella toolbar. Esporta la lista **filtrata corrente** (rispetta ricerca, filtro tabs, ordinamento).

**Colonne**: Nome, Cognome, Email, Corso, Anno, Camera, Piano, Telefono, Stato pagamento (Regolare / In ritardo / Nessun pagamento).

**Implementazione**:
- Funzione `exportCSV(rows)` che costruisce stringa CSV (header + righe), escape virgolette/virgole, `Blob` + `URL.createObjectURL` + link `download="studenti-YYYY-MM-DD.csv"`.
- Toast di conferma con `useToast`.
- Icona `Download` da lucide.

## 2. Tab "Timeline" nel popup

**Quinto tab** `Timeline` nel `Tabs` del `StudentDetail` (dopo Ticket).

**Eventi unificati** (ordinati per data desc):
- **Pagamenti** → `CreditCard` blu, "Pagamento {mese} — €{importo}" + badge stato
- **Ticket** → `Headphones` arancio, "Ticket: {titolo}" + badge categoria
- **Cambio camera / contratto** → `BedDouble` viola, "Assegnata camera {nome}" (da `richiesta.created_at` con stato approvata)
- **CRM / richiesta iniziale** → `Sparkles` verde, "Richiesta inviata via {fonte}" (da `richiesta.created_at`)
- **Registrazione profilo** → `UserPlus` grigio, "Profilo creato" (da `s.created_at` se esiste, fallback `richiesta.created_at`)

**Layout timeline**:
- Linea verticale grigia a sinistra, pallino colorato per tipo
- Card compatta `bg-muted/30` con titolo, descrizione, data formattata + tempo relativo
- Empty state se nessun evento

**Helper**: funzione `buildTimeline(data)` pura che ritorna `Event[]` ordinati. Nessuna nuova dipendenza, nessuna modifica a `mockData.ts`.

## File modificato (1)
`src/pages/admin/AdminStudenti.tsx` — bottone export in toolbar, funzione CSV, nuovo tab Timeline + componente `StudentTimeline`.

## Tecnica
- Riuso `Button`, `Tabs`, `Card`, `Badge`, icone lucide (`Download`, `Sparkles`, `UserPlus`, già: `CreditCard`, `Headphones`, `BedDouble`)
- `useToast` da `@/hooks/use-toast`
- CSV BOM `\uFEFF` iniziale per compat Excel italiano
- Tempo relativo: helper inline (es. "3 giorni fa")

