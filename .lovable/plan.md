

## Problema
Nella sezione "Chi Siamo" appare l'interno della cucina/sala comune invece della facciata esterna dell'immobile. Il codice importa correttamente `studentato-esterno.jpg`, ma il file salvato in `src/assets/studentato-esterno.jpg` contiene la foto sbagliata (interno invece dell'esterno).

## Causa
Quando ho salvato le 6 foto caricate in precedenza, ho associato male i contenuti ai nomi file: la foto della **facciata gialla con archi** (esterno) è finita su un altro filename, mentre `studentato-esterno.jpg` ha ricevuto la foto della sala comune.

## Soluzione
Risalvare i 6 asset con l'associazione corretta foto → nome semantico:

| Filename | Contenuto corretto |
|---|---|
| `studentato-esterno.jpg` | **Facciata gialla con archi** (esterno palazzo) ← FIX PRINCIPALE |
| `studentato-corridoio.jpg` | Corridoio porte colorate Google |
| `studentato-lounge.jpg` | Sala lounge con camino |
| `studentato-sala-comune.jpg` | Sala comune con tavoli rotondi (la foto attualmente sbagliata in About) |
| `studentato-cucina.jpg` | Cucina principale |
| `studentato-terrazzo.jpg` | Terrazzo |

## File modificati
- **`src/assets/studentato-esterno.jpg`** → sostituito con la foto reale della facciata esterna
- Eventuale rishuffle degli altri 5 asset se anche loro sono mappati male (verifica visiva durante il fix)

## Risultato atteso
- **AboutSection** mostrerà la facciata gialla con archi sotto il badge "Dal 2018" → coerente con caption "Facciata storica · Padova"
- **LoginPage** continuerà a mostrare il corridoio porte colorate (già corretto)
- **HeroSection** continuerà a mostrare il collage corretto

Nessuna modifica al codice TSX — solo swap dei file binari in `src/assets/`.

