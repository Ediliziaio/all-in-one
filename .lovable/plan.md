

# Migliora 4 aree admin: Contratti, Camere, Buoni, Guide

Oggi le 4 pagine sono basiche (lista + dialog semplice). Le porto a livello pro come ho fatto per Studenti.

---

## 1. `/admin/contratti` — Da tabella piatta a gestione contratti completa

**Header KPI** (4 card): totale contratti, attivi, in scadenza (<60gg), incasso mensile ricorrente totale (€).

**Toolbar**: ricerca per studente/camera, filtri tabs (esistenti) + filtro periodo (anno corrente / scaduti), ordinamento (data fine, canone, recenti), bottone **"Esporta CSV"**.

**Tabella migliorata**: avatar studente + nome, camera con piano, periodo con **giorni rimanenti** ("scade tra 45gg" badge giallo se <60), canone con totale residuo, stato, azioni (occhio + scarica PDF inline).

**Popup dettaglio arricchito** (Dialog 2 colonne, tabs):
- **Tab Riepilogo**: dati attuali + box "Riepilogo finanziario" (totale contratto, già incassato, residuo)
- **Tab Pagamenti**: timeline pagamenti collegati (da `mockPagamenti`), badge stato
- **Tab Documento**: anteprima placeholder + bottone scarica
- **Tab Storico**: eventi (firma, modifiche, rinnovi)
- Header con bottoni rapidi: "Vedi studente" → `/admin/studenti`, "Vedi camera" → `/admin/camere`, "Rinnova" (toast)

**Empty state** + microinterazioni hover.

---

## 2. `/admin/camere` — Già evoluto, aggiungo livello strategico

**Header KPI** (4 card): totale camere, disponibili, occupate, **tasso occupazione %** + canone medio.

**Toolbar**: ricerca per nome, **filtro tipo** (singola/plus/doppia), **filtro disponibilità** (tutte/disponibili/occupate), **filtro piano**, ordinamento (prezzo, piano, foto count).

**Card camera arricchita**: aggiungo overlay con badge "Studente assegnato" (deriva da `mockProfiles.camera_id`) cliccabile → apre profilo studente; warning rosso se 0 foto o descrizione mancante; mini-stat foto.

**Bottone "Esporta CSV"** lista camere (nome, tipo, prezzo, piano, mq, disponibilità, occupante).

**Vista lista**: aggiungo colonna "Occupante" e "Servizi" count.

**Empty state** ricerca senza risultati.

---

## 3. `/admin/buoni` — Da griglia statica a gestione partner

**Header KPI** (4 card): totale buoni, attivi, in scadenza (<30gg), categorie totali.

**Toolbar**: ricerca esercizio, **filtro categoria** (Cibo/Sport/Libri/Divertimento/Servizi) tabs, filtro stato (attivi/disattivi/scaduti), ordinamento (recenti, scadenza, A-Z).

**Card buono migliorata**: badge "Scade tra Xgg" giallo se <30, badge "SCADUTO" rosso, contatore mock "utilizzato N volte", bottone modifica (matita) accanto a switch.

**Popup dettaglio + modifica** (oltre a "Aggiungi"): click sulla card apre dialog modifica con tutti i campi prefilled, anteprima preview live della card a destra.

**Bottone "Esporta CSV"** + microinterazioni.

---

## 4. `/admin/guide` — Da lista piatta a CMS guide

**Header KPI** (4 card): totale guide, attive, disattive, categorie coperte.

**Toolbar**: ricerca titolo/contenuto, **filtro categoria** tabs (Burocrazia/Università/Vita in Città/Risparmio/Trasporti), ordinamento (A-Z, recenti, categoria), toggle **vista lista vs griglia card**.

**Card/riga guida migliorata**: badge categoria colorato per categoria, contatore mock "letta N volte", icona modifica + elimina (oltre allo switch attiva/disattiva esistente).

**Popup modifica** (oltre a "Nuova"): click sulla riga apre dialog edit con campi prefilled + **preview markdown-like** del contenuto a destra (split view), contatore caratteri.

**Bottone "Esporta CSV"** lista guide + empty state.

---

## File modificati (4)
- `src/pages/admin/AdminContratti.tsx` — refactor completo
- `src/pages/admin/AdminCamere.tsx` — aggiunte KPI/filtri/CSV/occupante (mantengo dialog esistente)
- `src/pages/admin/AdminBuoni.tsx` — refactor
- `src/pages/admin/AdminGuide.tsx` — refactor

**Nessuna modifica a `mockData.ts`** — tutto deriva dai mock esistenti (`mockContratti`, `mockBuoni`, `mockGuide`, `mockPagamenti`, `mockProfiles`, `rooms`).

## Tecnica
- Riuso `Card`, `Tabs`, `Dialog`, `Badge`, `Input`, `Switch`, `Button`, `Avatar` (shadcn)
- Icone lucide: Search, Download, TrendingUp, Calendar, Home, BedDouble, Tag, Gift, BookOpen, AlertCircle, Pencil, Trash2, Eye, FileText, Users
- Funzione `exportCSV` riusata (BOM Excel)
- Helpers: `daysUntil(date)`, `formatEUR()`, calcolo occupazione/incasso memoizzati
- Cross-link verso `/admin/studenti`, `/admin/camere`, `/admin/contratti`
- Nessuna nuova dipendenza, nessuna route nuova

