

# Editor markdown + Grafici KPI + Bulk actions

## 1. Editor markdown reale (`/admin/guide`)

Sostituisco la `Textarea` del dialog con un mini-editor custom (no nuove dipendenze):

**Toolbar** sopra la textarea con bottoni:
- **B** Bold (`**testo**`)
- **I** Italic (`*testo*`)
- **H2** Heading (`## `)
- **• List** Lista puntata (`- `)
- **1. List** Lista numerata (`1. `)
- **🔗 Link** (`[testo](url)`) — prompt per URL
- **`<>`** Inline code
- **"** Quote (`> `)

Ogni bottone wrappa la selezione corrente nella textarea (uso `selectionStart/End` + `setRangeText`). Shortcut tastiera: Ctrl+B, Ctrl+I, Ctrl+K (link).

**Preview a destra**: parser markdown leggero (~40 righe regex) che rende: `**bold**`, `*italic*`, `## H2`, `### H3`, liste `-`/`1.`, `[link](url)`, ``code``, `> quote`, paragrafi. Output via `dangerouslySetInnerHTML` con escape HTML iniziale per sicurezza. Stile prose-like con classi Tailwind.

## 2. Grafici KPI (4 pagine)

Uso `ChartContainer` + `recharts` (già nel progetto). Tutti i dati derivano deterministicamente dai mock esistenti (no nuove dipendenze, no modifiche a `mockData.ts`).

- **`/admin/contratti`** — Card "Trend MRR (6 mesi)" sotto la riga KPI: `AreaChart` con MRR mese per mese (calcolato simulando crescita: ultimo mese = MRR attuale, mesi precedenti scalati al 80%–95% via seed).
- **`/admin/camere`** — Card "Occupazione storica (6 mesi)": `LineChart` % occupazione mese per mese (scala leggermente l'attuale `kpi.tasso`).
- **`/admin/buoni`** — Card "Top 5 buoni più utilizzati": `BarChart` orizzontale con top 5 by `usiCount(id)` decrescente.
- **`/admin/guide`** — Card "Top 5 guide più lette": `BarChart` orizzontale con top 5 by `letture(id)` decrescente.

Ogni grafico vive in un `Card` separato sotto la griglia KPI, height ~200px, responsive.

## 3. Bulk actions

### `/admin/buoni` & `/admin/guide`
- `Checkbox` in alto a sinistra di ogni card/riga
- Stato `selected: Set<string>` per pagina
- Quando `selected.size > 0`, **barra azioni sticky** sopra la lista:
  - "X selezionati" + bottone "Deseleziona tutti"
  - **Disattiva selezionati** (set `attivo/attiva = false`)
  - **Elimina selezionati** (con `AlertDialog` di conferma)
- Checkbox "Seleziona tutti i visibili" nella toolbar

### `/admin/contratti`
- `Checkbox` come prima colonna nella tabella
- Quando selezionati > 0, barra azioni:
  - **Invia promemoria scadenza** → toast `Promemoria inviato a N studenti`
  - "Deseleziona tutti"

## 4. Test E2E — note

Dopo l'implementazione richiamerò la pagina via browser per smoke-test rapido, ma le verifiche manuali (esporta CSV scaricato, dialog 4 tab Contratti, preview live) restano a carico utente — i tool browser non possono ispezionare file scaricati né fare interazioni profonde affidabili in dialog complessi.

## File modificati (4)
- `src/pages/admin/AdminGuide.tsx` — editor MD + toolbar + parser preview + bulk + grafico top letture
- `src/pages/admin/AdminBuoni.tsx` — bulk + grafico top usi
- `src/pages/admin/AdminContratti.tsx` — bulk reminder + grafico MRR trend
- `src/pages/admin/AdminCamere.tsx` — grafico occupazione storica

## Tecnica
- **No nuove dipendenze**: editor MD in ~80 righe, parser MD ~40 righe regex
- Riuso `ChartContainer` (`@/components/ui/chart`), `Checkbox`, `AlertDialog`, icone lucide (`Bold`, `Italic`, `Heading2`, `List`, `ListOrdered`, `Link2`, `Code`, `Quote`, `BellRing`, `Trash2`, `EyeOff`)
- `useRef<HTMLTextAreaElement>` per manipolare selezione
- Helper `parseMarkdown(s: string): string` puro testabile, escape HTML prima di applicare regex
- Stato selezione locale (`Set<string>`) per ogni pagina, reset su filter change

