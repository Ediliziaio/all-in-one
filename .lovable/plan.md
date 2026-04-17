

L'utente vuole migliorare l'area ticket sia lato studente (`/studente/supporto`) che lato admin (`/admin/supporto`).

Stato attuale:
- **Studente**: ha già FAQ, form nuovo ticket, lista ticket, dialog dettaglio con timeline base, CTA WhatsApp. Manca: ricerca/filtro ticket, allegati, stato visivo migliore, conteggio risposte, tempo di risposta atteso, possibilità di riaprire ticket chiuso, valutazione del supporto ricevuto.
- **Admin**: lista semplice + pannello dettaglio. Manca: filtri per stato/priorità/categoria, ricerca, statistiche in cima (aperti/in corso/risolti/tempo medio), assegnazione a operatore, cambio priorità, cronologia conversazione (non solo "una risposta admin"), risposta rapida con template, ordinamento, conteggio non letti.

Mancano anche cose comuni: persistenza messaggi multipli (oggi `risposta_admin` è singola stringa), notifiche, badge "nuovo messaggio".

Estendo il modello dati `SupportTicket` per supportare un array di messaggi.

# Migliorare area Ticket (Studente + Admin)

## Modello dati
Estendo `SupportTicket` in `mockData.ts`:
- aggiungo `messages: TicketMessage[]` con `{ id, author: 'studente'|'admin', authorName, text, createdAt }`
- aggiungo `assignedTo?: string`, `unreadForAdmin: boolean`, `unreadForStudent: boolean`, `rating?: 1-5`, `closedAt?`
- mantengo `risposta_admin` per compat ma migro alla timeline messaggi

## Lato Studente (`Supporto.tsx`)
1. **Stats header compatto**: 3 card mini (Aperti / In corso / Risolti) con conteggi miei
2. **Search + filtro stato** (tabs: Tutti / Aperti / Risolti) sopra lista
3. **Ticket card migliorata**: badge non letti (pallino), preview ultima risposta, "tempo dall'ultima attività"
4. **Form nuovo ticket** dentro `Dialog` invece di accordion (più pulito su mobile) + campo allegato (mock)
5. **Detail dialog** trasformato in **chat-like timeline**: messaggi alternati left/right, input testo + invio sotto fisso, ogni nuovo invio aggiunge a `messages[]`
6. **Riapri ticket** se chiuso (button dedicato)
7. **Rating** dopo chiusura: 5 stelle "Come è stato il supporto?"
8. **FAQ** resta ma collapsed di default su mobile

## Lato Admin (`AdminSupporto.tsx`)
1. **Stats bar in cima**: 4 card (Aperti, In corso, Risolti oggi, Tempo medio risposta)
2. **Toolbar filtri**: ricerca per testo/studente, select stato, select priorità, select categoria, ordinamento (Più recenti / Priorità / Più vecchi)
3. **Lista ticket** con: badge non letti, preview ultimo messaggio, info studente con avatar, indicatore priorità a sinistra (barra colorata)
4. **Pannello destro come chat completa**:
   - header con info studente, badge stato/priorità, dropdown "Cambia stato" e "Cambia priorità"
   - timeline messaggi scrollable
   - composer in basso con: textarea, **template risposte rapide** (dropdown con 4-5 risposte predefinite), bottone Invia, bottone "Chiudi ticket"
5. **Mobile**: lista full-width, click apre dialog full-screen con la chat

## File modificati (3)
1. **`src/data/mockData.ts`** — estendi tipo `SupportTicket` con `messages[]`, aggiungi `TicketMessage`, popola messaggi mock
2. **`src/pages/studente/Supporto.tsx`** — stats, search/filter, dialog nuovo ticket, chat timeline, rating, riapertura
3. **`src/pages/admin/AdminSupporto.tsx`** — stats bar, toolbar filtri, chat completa con template, cambio stato/priorità, mobile dialog

## Tecnica
- Nessuna nuova dipendenza
- Riuso shadcn: `Dialog`, `Tabs`, `Select`, `DropdownMenu`, `Textarea`, `Avatar`, `Badge`, `Card`
- `date-fns` (già nel progetto) per "2 ore fa" formato relativo
- Mobile-first: lista admin diventa full-width sotto `lg`, dettaglio in `Dialog` invece di pannello laterale

