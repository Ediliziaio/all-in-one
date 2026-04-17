

L'utente è sulla pagina `/admin/richieste` (AdminPrenotazioni.tsx) e vuole trasformarla in un mini-CRM con pipeline tipo Kanban, dettagli contatto completi, e gestione del lead/richiesta come un vero processo di vendita.

Stato attuale: tabella semplice con tabs per stato (pending/approvata/conclusa/rifiutata), dialog dettaglio minimale. Manca pipeline visuale, dati contatto (telefono, provenienza, note interne), storico attività, attribuzione operatore, follow-up.

# CRM Richieste di Affitto

## Diagnosi
La pagina attuale è una lista a tabs: utile ma piatta. Manca tutto il processo che c'è dietro una richiesta: contatto, qualifica, visita, proposta, contratto. Niente note interne, niente storico interazioni, niente operatore assegnato, niente fonte del lead.

## Modello dati esteso (`mockData.ts`)

Estendo `RichiestaAffitto` con campi CRM:
- **Contatto**: `telefono`, `email`, `eta`, `corso_universita`, `citta_provenienza`
- **Lead**: `fonte` ('sito' | 'instagram' | 'passaparola' | 'google' | 'fiera' | 'altro'), `budget_max`, `data_visita?`
- **Pipeline**: nuovo enum stato → `nuovo` | `contattato` | `visita_programmata` | `proposta_inviata` | `contratto_firmato` | `perso`
- **Gestione**: `operatore_assegnato?`, `priorita` ('bassa'|'media'|'alta'), `prossimo_followup?`, `motivo_perdita?`
- **Storico**: `attivita: Activity[]` con `{ id, tipo: 'nota'|'chiamata'|'email'|'visita'|'cambio_stato', testo, autore, createdAt }`

Mantengo i vecchi stati come compat e mappo. Aggiungo `mockOperatori` (3-4 nomi staff).

## UI nuova pagina (`AdminPrenotazioni.tsx` → diventa CRM)

### 1. Header con KPI
4 mini-card: **Lead totali / Nuovi questa settimana / Tasso conversione / Valore pipeline (€)**

### 2. Toolbar
- Search per nome/email/telefono
- Filtri: fonte, operatore assegnato, priorità, range data
- Toggle vista: **Pipeline (Kanban)** ↔ **Lista**
- Bottone "+ Nuovo lead" (dialog manuale)

### 3. Vista Pipeline (default)
6 colonne kanban scrollabili orizzontalmente:
`Nuovo → Contattato → Visita programmata → Proposta inviata → Contratto firmato → Perso`

Ogni card lead mostra: nome+avatar, camera richiesta, badge priorità (barra colorata sx), giorni in pipeline, operatore assegnato (avatar piccolo), icona fonte.

Drag & drop per spostare tra colonne (uso `@dnd-kit/core` se presente, altrimenti bottoni "Sposta a →" nel menu della card per evitare nuove dipendenze).

### 4. Vista Lista
Tabella con colonne: Nome, Contatto, Camera, Stato, Operatore, Priorità, Ultima attività, Azioni.

### 5. Dialog dettaglio lead (full-screen su mobile)
Layout 2 colonne (stack su mobile):

**Colonna sinistra - Info contatto**:
- Avatar + nome grande, badge stato pipeline
- Pulsanti rapidi: chiama, email, WhatsApp
- Dati: età, corso, città provenienza, budget, fonte
- Camera richiesta + date contratto
- Operatore assegnato (dropdown cambio)
- Priorità (dropdown)
- Prossimo follow-up (date picker)

**Colonna destra - Timeline attività + composer**:
- Tabs: "Tutte / Note / Chiamate / Email / Cambi stato"
- Timeline cronologica con icone per tipo
- Composer in fondo: textarea + tipo attività (toggle: nota/chiamata/email/visita) + bottone Aggiungi
- Bottoni in fondo: "Sposta a [stato successivo]", "Marca come Perso" (apre sub-dialog per motivo)

### 6. Mobile
- KPI: 2x2 grid
- Kanban: scroll orizzontale con snap, 1 colonna visibile a tempo
- Toolbar: filtri in Sheet
- Dialog dettaglio: full-screen

## File modificati (2)

1. **`src/data/mockData.ts`** — estendi tipo `RichiestaAffitto` (campi contatto, lead, pipeline, attività), aggiungi `Activity`, `mockOperatori`, popola 6-8 lead di esempio distribuiti nelle nuove colonne pipeline
2. **`src/pages/admin/AdminPrenotazioni.tsx`** — riscrittura: KPI, toolbar, vista Pipeline kanban + vista Lista, dialog CRM completo con timeline, gestione assegnazione/priorità/follow-up

## Tecnica
- Nessuna nuova dipendenza: drag&drop con HTML5 nativo (`draggable`, `onDragStart`, `onDrop`) per evitare di installare libs
- Riuso shadcn: `Card`, `Tabs`, `Dialog`, `Sheet`, `Select`, `DropdownMenu`, `Popover`+`Calendar`, `Badge`, `Avatar`, `Textarea`, `ToggleGroup`
- `date-fns` (già nel progetto) per "3 giorni fa", giorni in pipeline
- State locale con `useState`, persistenza in `localStorage` per non perdere modifiche al refresh
- Responsive mobile-first

