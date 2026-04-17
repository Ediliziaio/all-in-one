

# Pipeline Supporto: SLA, Operatori e Filtro "I miei ticket"

## Diagnosi
La pipeline funziona già (drag & drop + click per aprire). Da aggiungere:
1. **Indicatori SLA** sulle card (verde <2h, giallo <24h, rosso >24h) con alert per urgenti senza risposta
2. **Assegnazione operatore** dal menu della card (avatar visibile)
3. **Filtro "I miei ticket"** nella toolbar
4. Verifica end-to-end (drag, click, mobile)

Riuso `mockOperatori` già esistente nel codebase e `assignedTo` già nel tipo `SupportTicket`.

## Cambiamenti

### 1. `src/data/mockData.ts` (modifiche minori)
- Popolo `assignedTo` di alcuni ticket usando i nomi reali da `mockOperatori` (Giulia Marchetti, Federico Bianchi, Sara Lombardi, Matteo Rinaldi) invece del generico "Admin StudentatoPD"
- Aggiungo 1-2 ticket urgenti senza risposta admin per testare l'alert SLA

### 2. `src/pages/admin/AdminSupporto.tsx`

**Costante "operatore corrente" (mock)**:
```ts
const CURRENT_OPERATOR = "Giulia Marchetti";
```

**Helper SLA** (nuova funzione):
```ts
function getSLA(ticket): { color: 'green'|'yellow'|'red', label: string, urgent: boolean }
```
- Calcola ore dall'ultima attività studente senza risposta admin
- <2h verde, 2-24h giallo, >24h rosso
- `urgent = priorita === 'urgente' && lastMsg.author === 'studente' && hoursElapsed > 2`

**Toolbar - nuovo filtro**:
- Toggle "I miei ticket" (button outline con icona User) accanto al toggle vista
- Filtra `tickets` dove `assignedTo === CURRENT_OPERATOR`

**Card pipeline (`TicketCardContent`)**:
- Aggiungo riga con: avatar mini operatore assegnato (o icona "Non assegnato") + badge SLA colorato con tempo
- Se `urgent`: bordo rosso pulsante + icona AlertTriangle in alto a dx

**Card lista**: stesse aggiunte (SLA badge, avatar operatore)

**Menu della card pipeline**:
- Aggiungo `DropdownMenu` con icona `MoreVertical` (top-right card)
- Sezione "Assegna a": lista `mockOperatori` + opzione "Non assegnato"
- Click bottone non triggera apertura ticket (stopPropagation + non draggable area)

**Pannello dettaglio - operatore**:
- Aggiungo riga "Assegnato a" sotto i badge con avatar + dropdown cambio operatore

**Header pagina**:
- Sotto i KPI esistenti, badge "Ticket urgenti senza risposta: N" se >0, cliccabile per filtrare

### 3. UI/UX dettagli
- SLA badge: `bg-green-100/yellow-100/red-100` con icona Clock
- Operatore non assegnato: avatar grigio con "?" + testo "Assegna"
- Animazione pulse sui ticket urgenti scaduti (`animate-pulse` su bordo)
- Persistenza filtro "I miei" in `localStorage` (`admin_supporto_my`)

## File modificati (2)
1. `src/data/mockData.ts` — popola `assignedTo` con nomi reali, aggiungi 1-2 ticket urgenti
2. `src/pages/admin/AdminSupporto.tsx` — helper SLA, filtro "I miei", menu assegnazione operatore, badge SLA su card lista+pipeline, alert urgenti

## Tecnica
- Nessuna nuova dipendenza
- Riuso `mockOperatori`, `Avatar`, `DropdownMenu`, `Badge`, `lucide-react` (User, AlertTriangle, Clock)
- Click su menu card: wrapper `<div onPointerDown={(e) => e.stopPropagation()}>` per non interferire con dnd-kit
- SLA si ricalcola al render (nessuno state extra)

