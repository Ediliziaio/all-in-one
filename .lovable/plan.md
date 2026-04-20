

## Obiettivo
Eliminare completamente lo stacco visivo tra navbar e HeroSection: header e prima sezione devono apparire come un unico blocco continuo, senza linee di separazione.

## Problema attuale
- La `Navbar` ha classe `glass` che applica un background semi-trasparente con blur + probabilmente un `border-b` o un'ombra che crea una linea netta sotto l'header
- La HeroSection ha già un top-fade gradient (`h-32 from-background`) che però copre/sbiadisce l'immagine di Padova proprio nella zona della navbar → l'effetto "fusione" non si vede perché sotto la navbar c'è solo background piatto invece dell'immagine
- Risultato: la navbar sembra "appiccicata sopra" alla hero invece che integrarsi

## Soluzione

### 1. Rimuovere il bordo/ombra della navbar
Verifico la classe `glass` in `src/index.css`. Se contiene `border-b` o `box-shadow`, lo rimuovo (o creo variante `glass-seamless` senza bordo) → la navbar non avrà più la linea di separazione visibile.

### 2. Rimuovere il top-fade scuro della Hero
Il gradient `from-background via-background/80 to-transparent h-32` attualmente NASCONDE l'immagine di Padova proprio sotto la navbar. Lo elimino (o lo rendo molto più leggero, tipo `from-background/30 to-transparent h-16`) → l'immagine di Padova si vedrà ANCHE dietro la navbar glass, creando continuità visiva.

### 3. Aumentare leggermente l'opacità immagine vicino alla navbar
L'immagine background passerà da `opacity-20` uniforme a un mask gradient verticale che parte da `opacity-30` in alto (zona navbar) e scende a `opacity-15` a metà section → l'effetto "città dietro la navbar trasparente" diventa protagonista nella parte superiore.

### 4. Navbar trasparente sopra l'immagine
La navbar `glass` (background `bg-white/60 backdrop-blur-md` o simile) ora si appoggerà direttamente sull'immagine di Padova → effetto "vetro smerigliato" autentico, come Apple/iOS. La transizione navbar→hero diventa invisibile.

### 5. Z-index e layering
Ordine finale dal basso verso l'alto nella section Hero:
1. `<img>` Padova (opacity variabile via mask)
2. Bottom fade verso sezione successiva (resta invariato)
3. `GradientMesh` (opacity 60)
4. Contenuto

La navbar `sticky top-0 z-50` continua a stare sopra tutto, ma ora il suo background semi-trasparente lascia VEDERE l'immagine sottostante invece di un colore piatto.

## Diagramma fusione
```text
Prima:                          Dopo:
┌─────────────────────┐        ┌─────────────────────┐
│ NAVBAR (glass)      │        │ NAVBAR (glass)      │ ← vede Padova
│─────────────────────│ ← LINEA│   ↓ Padova visibile │   sotto
│ [bg piatto]         │        │   ↓ stesso layer    │
│                     │        │                     │
│  [Padova opacity 20]│        │  [Padova opacity 20]│
│                     │        │                     │
└─────────────────────┘        └─────────────────────┘
```

## File modificati (2)
1. **`src/index.css`** → modifico la classe `.glass` rimuovendo eventuale `border-b`/shadow, oppure aggiungo `.glass-seamless` se voglio mantenere la variante originale per altri usi
2. **`src/components/home/HeroSection.tsx`** → rimuovo (o riduco drasticamente) il top-fade gradient `h-32`, applico mask-gradient sull'immagine per opacità variabile dall'alto al basso

## Note tecniche
- La navbar resta `sticky` e funzionale (cliccabile, accessibile) — cambia solo l'aspetto visivo del bordo
- Su mobile l'immagine background si vede comunque dietro la navbar → effetto coerente
- Performance invariata: nessun nuovo asset, solo CSS/Tailwind

