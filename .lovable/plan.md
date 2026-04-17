

# Migliora area /admin/studenti

## Stato attuale
Lista piatta con avatar, nome, email, corso, anno, badge "Assegnato" e dialog dettaglio basico (corso, anno, piano, camera, bio, interessi). Non c'è ricerca, filtri, contesto contratto/pagamenti/ticket, né azioni rapide.

## Cosa miglioro

### 1. Header con KPI
4 card statistiche in alto:
- Totale studenti
- Con camera assegnata
- Senza assegnazione
- Ticket aperti collegati a studenti

### 2. Toolbar
- **Ricerca** per nome, cognome, email, corso (input con icona Search)
- **Filtri**: tutti / assegnati / non assegnati (Tabs)
- **Vista**: griglia card vs lista compatta (toggle icone)
- **Ordinamento**: nome A-Z, anno, data assegnazione

### 3. Lista/griglia migliorata
Card studente con:
- Avatar grande, nome, corso/anno
- Badge stato camera (Assegnato verde / Non assegnato grigio)
- Riga info compatta: camera + piano (se assegnato), telefono (da `mockRichieste`)
- Mini-badge: ticket aperti ("2 ticket"), pagamenti scaduti ("⚠ in ritardo")
- Click ovunque sulla card → apre popup dettaglio (più cliccabile della tabella attuale)

### 4. Popup dettaglio arricchito (Dialog più grande)
Layout a 2 colonne con tabs:
- **Header**: avatar grande, nome, contatti cliccabili (`tel:`, `mailto:`), badge stato, bottone "Vai al ticket" / "Crea ticket"
- **Tab Anagrafica**: corso, anno, città provenienza, età, instagram, bio, interessi (dati esistenti + da `mockRichieste`)
- **Tab Camera & Contratto**: camera assegnata + piano, date contratto inizio→fine, badge stato, link a `/admin/contratti`
- **Tab Pagamenti**: ultimi pagamenti (mock condiviso), badge pagato/scaduto, totale incassato
- **Tab Ticket**: ticket di supporto dello studente (filtra `mockTickets` per `student_id`), click → link a `/admin/supporto`

### 5. Microinterazioni
- Hover card: leggero shadow + scale
- Empty state per ricerca senza risultati
- Stagger animation conservato

## File modificati
**Solo** `src/pages/admin/AdminStudenti.tsx` (1 file).
Tutti i dati esistono già: `mockProfiles`, `mockRichieste`, `mockTickets`, `mockPagamenti`, `mockRooms` (per nome camera). Nessuna modifica a `mockData.ts`.

## Tecnica
- Riuso `Card`, `Tabs`, `Dialog`, `Badge`, `Input`, `Button`, `Avatar`, `ScrollArea`
- Icone `lucide-react`: Search, Users, Home, AlertCircle, Phone, Mail, Calendar, BedDouble, FileText, Headphones, Grid, List, ExternalLink
- Derivazioni memoizzate: per ogni studente calcolo ticket aperti, contratto attivo, telefono, pagamenti
- Link da popup verso `/admin/contratti`, `/admin/supporto`, `/admin/camere` per navigazione cross-area
- Nessuna nuova dipendenza

