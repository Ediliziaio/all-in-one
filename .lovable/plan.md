

L'utente vuole una vista pipeline (kanban) anche nella gestione Supporto admin, simile a quella appena creata per le richieste affitto.

Stati ticket attuali: `aperto` | `in_corso` | `risolto`. Per una pipeline utile aggiungo step intermedio così diventano 4 colonne sensate: **Nuovo (aperto) → In lavorazione (in_corso) → In attesa risposta studente → Risolto**.

Riuso pattern già adottato in AdminPrenotazioni: `@dnd-kit/core` (già installato), toggle vista in toolbar, stessa estetica delle colonne.

# Pipeline Supporto Admin

## Cambiamenti

### 1. Modello dati (`src/data/mockData.ts`)
- Aggiungo nuovo stato `attesa_studente` al tipo `SupportTicket.stato` → `"aperto" | "in_corso" | "attesa_studente" | "risolto"`
- Aggiorno qualche ticket mock per popolare la nuova colonna

### 2. Pagina admin (`src/pages/admin/AdminSupporto.tsx`)

**Toggle vista in toolbar**: bottoni `Lista` ↔ `Pipeline` (icona kanban) accanto al sort.

**Vista Pipeline** (nuovo componente `TicketPipelineView` interno al file):
- 4 colonne kanban scrollabili orizzontalmente: `Nuovo` · `In lavorazione` · `Attesa studente` · `Risolto`
- Header colonna con: nome stato, conteggio ticket, pallino colorato
- Card ticket compatta: barra priorità sx, avatar+nome studente, titolo (1 riga), badge categoria, ultima attività relativa, pallino non letto
- Drag & drop con `@dnd-kit/core` (`DndContext`, `useDraggable`, `useDroppable`) — riuso pattern di `AdminPrenotazioni`
- Click sulla card → apre lo stesso pannello dettaglio chat già esistente (su mobile `Dialog` full-screen, su desktop pannello laterale che sostituisce la lista)

**Filtro stato**: nascosto in vista pipeline (le colonne sono già lo stato), gli altri filtri (priorità, categoria, search) restano attivi.

**Mobile**: scroll orizzontale snap, 1 colonna alla volta. Tap card → dialog full-screen.

**Aggiornamento stato**: drop su colonna chiama `handleChangeStato(nuovoStato)` esistente, mostra toast.

### 3. UI/UX
- Colori colonne coerenti con `statoColors` esistente:
  - Nuovo → blu
  - In lavorazione → giallo
  - Attesa studente → viola/indaco (nuovo)
  - Risolto → verde
- Aggiungo `attesa_studente` a `statoColors` e `statoLabel`
- Drag overlay (ghost card) come in CRM per feedback visivo

## File modificati (2)
1. `src/data/mockData.ts` — aggiungi stato `attesa_studente`, aggiorna 1-2 ticket mock
2. `src/pages/admin/AdminSupporto.tsx` — aggiungi toggle vista, componente `TicketPipelineView` con kanban dnd-kit, mappa nuovo stato in label/colori, gestione drop

## Tecnica
- Nessuna nuova dipendenza (`@dnd-kit/core` già nel progetto dopo CRM richieste)
- Riuso `prioritaBar`, `prioritaColors`, `statoColors`, `relTime`, `detailPanel` esistenti
- State `view: "lista" | "pipeline"` con default `lista`
- Persistenza scelta vista in `localStorage` (`admin_supporto_view`)

