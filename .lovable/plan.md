

## Obiettivo
Verificare nel preview che il parallax sull'immagine di sfondo della sezione Urgency funzioni correttamente.

## Piano di verifica
1. `navigate_to_sandbox` su `/` → carica home
2. `screenshot` iniziale prima dello scroll
3. Scroll fino alla sezione Urgency con `act` (scroll into view del countdown)
4. `screenshot` posizione 1 sulla sezione
5. Scroll ulteriore di ~300px dentro la sezione
6. `screenshot` posizione 2
7. Confronto: l'immagine di Padova deve essersi spostata MENO del contenuto (countdown, card). Se il contenuto sale di X px, l'immagine deve salire di meno (effetto parallax con `offset={60}` → ±60px totali su tutta la durata di scroll).

## Cosa cerco
- Immagine visibile e ben posizionata in entrambi gli screenshot (no bordi vuoti grazie a `h-[120%] -top-[10%]`)
- Differenza di velocità tra immagine e contenuto percepibile
- Nessun glitch o flash durante lo scroll

## Output
Riporto i risultati con screenshot e conferma se l'effetto è visibile o se serve aumentare `offset`.

