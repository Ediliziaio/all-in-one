

## Obiettivo
1. Eliminare lo stacco visibile tra navbar e hero (visibile nello screenshot come linea netta tra il bianco dell'header e l'immagine di Padova)
2. Far diventare la navbar bianca/opaca quando l'utente scrolla oltre la hero

## Causa dello stacco (dallo screenshot)
La navbar ha `bg-background/60` → **bianco al 60% sempre**, anche in cima. Questo crea una "barra bianca" netta sopra l'immagine di Padova invece di lasciarla trasparire. Il `backdrop-blur-lg` da solo non basta perché sotto la navbar la maschera dell'immagine ha già opacità alta → la differenza tra "bianco 60% + blur" e "immagine pura" crea il taglio orizzontale.

## Soluzione

### 1. Navbar trasparente in cima, opaca dopo scroll
Aggiungo state `scrolled` in `Navbar.tsx` con `useEffect` su `window.scroll`:
- **Soglia**: `window.scrollY > 50px`
- **Top (scrolled=false)**: `bg-transparent` → l'immagine di Padova si vede integralmente attraverso, ZERO stacco
- **Scrolled (scrolled=true)**: `bg-background/85 backdrop-blur-lg shadow-sm` → bianca, leggibile sopra qualsiasi sezione, con leggera ombra che la stacca dal contenuto sottostante (questo è desiderato dopo lo scroll)

Transizione fluida: `transition-all duration-300`.

### 2. Rimuovere il top-fade residuo nella Hero
Verifico HeroSection: la maschera attuale parte da `opacity 1 at 0%` → l'immagine è già piena in cima, perfetto per fondersi con navbar trasparente. Nessuna modifica necessaria qui.

### 3. Aggiustare contrasto link navbar quando trasparente
Quando navbar è trasparente sopra l'immagine di Padova (cielo chiaro/rosato), i link grigi (`text-muted-foreground`) potrebbero perdere leggibilità. Soluzione: aggiungo un sottile `drop-shadow` ai link/logo quando `!scrolled`, oppure mantengo il colore attuale dato che il cielo della foto è chiaro abbastanza (verifico visivamente in fase di implementazione).

### 4. Logo coerente
Il logo PNG ha già sfondo trasparente e si vede bene sia su bianco che sull'immagine → nessuna modifica.

## Diagramma comportamento
```text
SCROLL = 0 (in cima)              SCROLL > 50px
┌───────────────────────┐         ┌───────────────────────┐
│ NAVBAR trasparente    │         │ NAVBAR bianca + ombra │ ← visibile,
│  ↓ Padova si vede     │         │═══════════════════════│   stacco voluto
│  ↓ ZERO stacco        │         │ [contenuto sezione]   │   per leggibilità
│                       │         │                       │
│ [Padova foto]         │         │                       │
└───────────────────────┘         └───────────────────────┘
```

## File modificati (1)
- **`src/components/Navbar.tsx`** → aggiungo `useState` + `useEffect` per detect scroll, applico classi condizionali (`bg-transparent` → `bg-background/85 backdrop-blur-lg shadow-sm`) con transizione fluida

Nessuna modifica a `HeroSection` o `index.css`. Soluzione pulita e localizzata.

