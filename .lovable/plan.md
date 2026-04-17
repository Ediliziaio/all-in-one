

L'utente vuole due cose:
1. Migliorare l'area descrizione/contenuto della pagina dettaglio camera (`/camere/:id`) — il blocco con descrizione, servizi, info
2. Soprattutto migliorare l'area admin dove si caricano foto e descrizioni delle camere (`AdminCamere.tsx`)

Guardo lo stato attuale: in `CameraDettaglio.tsx` la descrizione è un singolo paragrafo seguito da una griglia di feature flat. In `AdminCamere.tsx` il dialog "Aggiungi Camera" è basico (3 input + textarea), niente upload foto reale, niente preview, niente gestione galleria, nessun campo per features/tipo dettagliato.

# Migliorie pagina camera + admin upload foto/descrizioni

## 1. Pagina dettaglio camera (`CameraDettaglio.tsx`) — blocco contenuti più ricco

Sostituisco il blocco "descrizione + servizi" piatto con una struttura editoriale a sezioni:

**a. Descrizione potenziata**
- Prima riga "highlight" grande (drop-cap o frase d'apertura in `text-lg font-medium`)
- Resto del testo in colonna leggibile (max-width prosa, line-height generoso)
- Icona quote decorativa sottile

**b. Tabs informativi** (Tabs shadcn già disponibili)
- **Panoramica** — descrizione + highlight
- **Servizi & Dotazioni** — griglia features esistente, ma raggruppata per categoria (icone diverse: Wifi/Bagno/Clima/Studio)
- **Cosa è incluso** — lista chiara: utenze, pulizie, internet, manutenzione (mock)
- **Regole della casa** — orari, ospiti, animali, fumo (mock con icone)

**c. Mini "info card" sopra la descrizione**
- 3-4 mini-stat con icona: "Ideale per", "Esposizione", "Arredamento", "Bagno" — visual quick-scan

**d. Sezione "La posizione" (mini-mappa mock)**
- Card con immagine statica/placeholder mappa + indirizzo + "5 min da Università" + lista punti di interesse

## 2. Admin — upload foto e gestione camera (priorità alta)

Riscrivo il dialog "Nuova Camera" (e il dialog "Modifica") con un'esperienza completa:

**a. Layout dialog più grande** — `max-w-3xl`, con tabs interne:
- **Info Base** — nome, tipo, prezzo, piano, mq, descrizione (textarea grande)
- **Foto** — uploader drag-and-drop + galleria preview
- **Servizi** — checkbox grid con tutte le features standard (Wifi, Aria condizionata, Riscaldamento, Bagno privato, Scrivania, Armadio, Balcone, Cucina condivisa, Lavanderia, ecc.)
- **Disponibilità** — switch disponibile/occupata, data disponibilità (date picker), prezzo

**b. Uploader foto realistico** (mock, no backend)
- Drop-zone con bordo tratteggiato + icona Upload + testo "Trascina foto qui o clicca per sfogliare"
- Accetta file via `<input type="file" multiple accept="image/*">`
- Genera preview tramite `URL.createObjectURL()` e le mostra in griglia
- Ogni preview ha: thumbnail, badge "Copertina" sulla prima, X per rimuovere, drag-handle per riordinare (uso semplice up/down arrows o `react-beautiful` no — uso swap con frecce per non aggiungere dipendenze)
- Counter "X/10 foto"

**c. Editor descrizione migliorato**
- Textarea con char counter (es. 500 caratteri max consigliati)
- Suggerimento sotto: "Descrivi atmosfera, luminosità, vista, arredamento. Evita info già presenti nei servizi."

**d. Card admin più informative nella griglia**
- Aggiungo overlay hover sulle immagini con bottoni rapidi (Modifica / Foto / Disponibilità) invece dei 3 button sotto
- Badge "X foto" sopra l'immagine
- Indicatore "Descrizione mancante" se vuota
- Quick stats: prezzo + tipo + mq in linea pulita

**e. Drawer/Dialog riordino foto separato** quando si clicca "Foto"
- Mostra galleria full-size con drag-to-reorder (semplice swap con frecce)
- Set copertina con click

## File modificati (3)

1. **`src/pages/CameraDettaglio.tsx`** — Tabs descrizione/servizi/incluso/regole, mini-stat card, sezione posizione
2. **`src/pages/admin/AdminCamere.tsx`** — Dialog ricco con tabs interne, uploader drag-and-drop con preview, checkbox features, char counter; card griglia con overlay hover
3. **`src/components/ui/textarea.tsx`** — già OK, nessuna modifica

Nessuna nuova dipendenza: uso `Tabs`, `Checkbox`, `Switch`, `Calendar/Popover` già presenti in shadcn.

