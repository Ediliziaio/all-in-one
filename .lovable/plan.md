

# Pannello info studente nel popup ticket

## Cosa aggiungo
Dentro il popup del ticket aggiungo un **pannello compatto "Info studente"** posizionato sopra i Tabs (Conversazione/Cronologia), collassabile, con:
- Avatar + nome + corso/anno
- **Camera** assegnata (link cliccabile alla camera)
- **Contratto attivo** (data inizio → fine, stato) con link a documenti
- **Telefono** (con `tel:` per chiamare)
- **Email** (con `mailto:` per scrivere)
- Bottone **"Vedi profilo completo"** → link a `/admin/studenti` (la pagina admin esistente)

## Modifiche

### `src/pages/admin/AdminSupporto.tsx` (1 file)

**Import nuovi**:
- `Link` da `react-router-dom`
- `mockRichieste` da `@/data/mockData`
- icone: `Phone`, `Mail`, `BedDouble`, `FileText`, `ChevronDown`, `ExternalLink`, `Calendar`

**Derivazioni** (sotto `studentProfile`):
```ts
const studentContract = selected
  ? mockRichieste.find(r => r.student_id === selected.student_id && r.stato === "approvata")
  : null;
```

**Nuovo blocco UI** dentro `detailPanel`, inserito dopo l'header (riga ~401) e prima dei Tabs (riga ~404):

Una `Collapsible` (shadcn) **aperta di default su desktop, chiusa su mobile**:
- Trigger: riga compatta con icona utente + "Info studente" + chevron + avatar mini
- Content: card con grid 2 colonne (1 su mobile):
  - **Camera**: icona BedDouble + numero camera + piano (es. "Singola 101 · Piano 1")
  - **Contratto**: icona Calendar + "01/09/25 → 31/07/26" + badge "Attivo" verde, link "Documenti" → `/admin/contratti`
  - **Telefono**: icona Phone + numero come `<a href="tel:...">` cliccabile
  - **Email**: icona Mail + email come `<a href="mailto:...">` cliccabile (truncate)
- Footer card: bottone outline "Vedi profilo completo" → link a `/admin/studenti` con `<ExternalLink>`

**Stili**: bg `bg-muted/30`, padding compatto, testo `text-xs`/`text-sm`, icone `h-3.5 w-3.5 text-muted-foreground`. Se dato mancante mostro "—".

**Telefono mock**: prendo da `mockRichieste` (campo `telefono`) collegato allo studente; se non esiste, fallback "—".

### Nessuna modifica a `mockData.ts`
Tutti i dati esistono già: `mockProfiles` (camera, piano, email, corso, avatar) + `mockRichieste` (telefono, contratto date, stato).

## Tecnica
- Riuso `Collapsible` shadcn (già nel progetto: `src/components/ui/collapsible.tsx`)
- Nessuna nuova dipendenza
- Nessun cambio dati: tutto deriva da mock già esistenti
- Pannello non rompe la timeline — è un blocco statico tra header e tabs

