

# Cronologia attività nel popup ticket

## Cosa aggiungo
Una sezione **"Cronologia attività"** dentro il popup del ticket (sopra la chat o in un tab dedicato) con timeline verticale che mostra in ordine cronologico inverso:
- **Creazione ticket** (da `created_at`)
- **Cambi stato** (es. "Spostato in In lavorazione")
- **Riassegnazioni operatore** (es. "Assegnato a Giulia Marchetti")
- **Cambi priorità**
- **Risposte** (admin e studente, da `messages`)
- **Chiusura** (da `closedAt`)

## Modifiche

### 1. `src/data/mockData.ts`
- Aggiungo a `SupportTicket` un campo opzionale:
  ```ts
  activity?: TicketActivity[];
  ```
- Nuovo tipo:
  ```ts
  interface TicketActivity {
    id: string;
    tipo: "creazione" | "cambio_stato" | "assegnazione" | "cambio_priorita" | "chiusura";
    testo: string;
    autore: string;
    createdAt: string;
    meta?: { from?: string; to?: string };
  }
  ```
- Popolo 2-3 ticket mock con qualche attività di esempio per dimostrare la timeline.

### 2. `src/pages/admin/AdminSupporto.tsx`

**Helper `addActivity(ticketId, activity)`** — push nell'array `activity` del ticket.

**Aggancio agli handler esistenti** (registrano automaticamente):
- `handleSend` → no (i messaggi sono già nella chat, ma li **mergio nella timeline** via derivazione)
- `handleChangeStato` → push attività `cambio_stato` con from/to
- `handleChangePrio` → push `cambio_priorita`
- `handleAssign` → push `assegnazione`
- `handleDragEnd` → push `cambio_stato`

**Timeline derivata** (memo): unisce `activity[]` + `messages[]` + evento sintetico "creazione" + "chiusura" → ordina per `createdAt` desc.

**UI nel popup** (`detailPanel`):
- Sostituisco la chat-only con un layout a **2 tab** (`Tabs` shadcn):
  - **Tab "Conversazione"** — chat attuale (default)
  - **Tab "Cronologia"** — timeline verticale con icone colorate per tipo evento (Plus, ArrowRight, UserCheck, Flag, MessageCircle, Lock), testo evento, autore, tempo relativo
- Composer in fondo resta visibile in entrambi i tab

**Stile timeline**:
- Linea verticale grigia a sinistra, pallino colorato per evento (verde creazione, blu cambio stato, viola assegnazione, arancio priorità, primary risposta, grigio chiusura)
- Card compatte con `bg-muted/30`, padding ridotto
- Vuoto: messaggio "Nessuna attività ancora"

## File modificati (2)
1. `src/data/mockData.ts` — tipo `TicketActivity`, campo `activity` su `SupportTicket`, popolamento mock
2. `src/pages/admin/AdminSupporto.tsx` — helper `addActivity`, aggancio agli handler, tab Cronologia nel popup, componente Timeline interno

## Tecnica
- Nessuna nuova dipendenza
- Riuso `Tabs`, `Avatar`, `Badge`, `lucide-react` (Plus, ArrowRight, UserCheck, Flag, Lock, MessageCircle), `relTime` esistente
- Timeline è una funzione pura che merge `activity + messages + eventi sintetici`, quindi funziona anche per ticket senza `activity` storica

