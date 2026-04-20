
## Obiettivo
Eliminare davvero lo stacco tra header e prima sezione: in cima alla home la navbar deve stare sopra la hero come overlay trasparente, e diventare bianca/opaca appena si scrolla.

## Causa reale del problema
Il problema non è solo il colore della navbar. La `Navbar` è ancora dentro il flusso layout come `sticky`, quindi occupa fisicamente altezza sopra la hero. Risultato: resta una fascia bianca separata prima che inizi l’immagine della prima sezione.

## Soluzione

### 1. Navbar overlay sulla home
Aggiornare `Navbar.tsx` per distinguere due casi:

- **Home + top pagina (`/` e `scrollY <= 50`)**
  - navbar in overlay: `absolute top-0 inset-x-0 z-50`
  - background trasparente
  - nessuna ombra
- **Home dopo scroll**
  - navbar torna `sticky top-0`
  - `bg-background/90 backdrop-blur-lg shadow-sm`
- **Tutte le altre pagine**
  - navbar sempre bianca/sticky come ora

Così l’header non crea più una banda separata sopra la hero.

### 2. Compensare l’altezza header dentro la Hero
Dato che la navbar sulla home diventa overlay, il contenuto hero va abbassato con padding top dedicato:
- mobile: più spazio sopra
- tablet/desktop: ancora più spazio
- obiettivo: il logo/menu restano sopra l’immagine, ma titolo e CTA non finiscono sotto l’header

In pratica la spaziatura superiore della hero diventa parte della sezione, non un blocco separato.

### 3. Rendere la fusione visiva più pulita
In `HeroSection.tsx` rifinire la parte alta:
- mantenere l’immagine di Padova ben visibile anche sotto la navbar
- evitare qualsiasi overlay chiaro pieno nella fascia superiore
- se serve, alleggerire il fade laterale/top per non “lavare” troppo l’immagine proprio sotto il menu

### 4. Migliorare leggibilità navbar quando è trasparente
Quando la navbar è sopra l’immagine:
- link/logo/menu con contrasto più deciso
- eventuale leggerissimo text shadow o colore più scuro sui link non attivi
- nessun fondo bianco in top state

Quando scrolli:
- torna la versione bianca standard per leggibilità sulle sezioni successive

## Comportamento finale
```text
HOME - top pagina
[ navbar overlay trasparente ]
[ stessa immagine hero continua dietro ]
[ titolo / CTA più in basso ]
=> nessuno stacco

HOME - dopo scroll
[ navbar bianca sticky ]
[ contenuto pagina sotto ]
=> separazione voluta per leggibilità

ALTRE PAGINE
[ navbar bianca sticky da subito ]
=> comportamento classico
```

## File da modificare
1. `src/components/Navbar.tsx`
   - usare `useLocation()` già presente per rilevare homepage
   - combinare `isHome` + `scrolled`
   - passare da `sticky sempre` a `absolute in top-state home` / `sticky negli altri casi`

2. `src/components/home/HeroSection.tsx`
   - aumentare `padding-top` del container hero per compensare l’overlay header
   - rifinire eventuali overlay/fade superiori per mostrare bene l’immagine sotto la navbar

## Note tecniche
- Non serve toccare `Layout.tsx`: il fix può restare localizzato tra navbar e hero
- La transizione resta fluida con `transition-all duration-300`
- Mobile incluso: anche lì la prima sezione sarà unita all’header invece di iniziare sotto una fascia bianca
