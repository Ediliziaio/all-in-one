

## Obiettivo
Sostituire le foto stock Unsplash delle camere con le 3 foto reali delle camere dello Studentato Napoleone, e aggiornare la foto del corridoio con la versione migliorata.

## Foto caricate
1. **Camera matrimoniale con quadro astratto** (parete bianca, letto rosso, parquet, terrazzo giallo) → camera tipo Singola Plus / matrimoniale
2. **Camera doppia con testiere turchesi** (2 letti singoli, quadri colorati, accesso terrazzo) → camera tipo Doppia
3. **Camera matrimoniale con travi a vista** (soffitto in legno, tappeto rigato, terrazzo) → camera tipo Singola Plus mansarda
4. **Corridoio porte colorate (versione 2 angolazioni)** → upgrade del corridoio esistente

## Mappatura asset

| Filename in `src/assets/` | Contenuto |
|---|---|
| `camera-matrimoniale-rossa.jpg` | NUOVO — camera con copriletto rosso e quadro astratto |
| `camera-doppia-turchese.jpg` | NUOVO — doppia con testiere blu turchese |
| `camera-mansarda-travi.jpg` | NUOVO — matrimoniale con travi a vista in legno |
| `studentato-corridoio.jpg` | SOSTITUITO — versione migliore con 2 angolazioni del corridoio Google |

## Dove integrare le foto

### 1. `src/data/rooms.ts` — sostituzione immagini camere
Trasformare gli array `images` da URL Unsplash a import locali:
- **Singole** (`singola-101`, `singola-205`) → prima foto: `camera-matrimoniale-rossa.jpg` (la più calda e accogliente)
- **Singole Plus** (`singola-plus-102`, `singola-plus-301`) → prima foto: `camera-mansarda-travi.jpg` (travi a vista = premium feel)
- **Doppie** (`doppia-103`, `doppia-204`) → prima foto: `camera-doppia-turchese.jpg` (mostra chiaramente i 2 letti)
- Le altre slide della galleria mescolano le 3 foto camere disponibili (rotazione tra le reali, rimuovendo gli Unsplash residui)

### 2. `src/assets/studentato-corridoio.jpg` — upgrade
Sostituire il file binario con la nuova versione che mostra il corridoio da 2 angolazioni → migliora HeroSection e LoginPage automaticamente (nessuna modifica codice).

### 3. Nessuna modifica a `RoomsPreview.tsx`
Il componente legge già `room.images[0]` da `rooms.ts` → cambiando i dati, la sezione "Scegli la tua camera" sulla home mostrerà subito le foto reali. Stessa cosa per `/camere` e `/camere/:id`.

## File modificati (4 asset + 1 dati)
1. **`src/assets/camera-matrimoniale-rossa.jpg`** (NUOVO)
2. **`src/assets/camera-doppia-turchese.jpg`** (NUOVO)
3. **`src/assets/camera-mansarda-travi.jpg`** (NUOVO)
4. **`src/assets/studentato-corridoio.jpg`** (SOSTITUITO con versione migliorata)
5. **`src/data/rooms.ts`** → import dei 3 nuovi asset + sostituzione array `images` di tutte e 6 le camere con le foto reali

## Risultato atteso
- **Home → "Scegli la tua camera"**: 3 card mostrano camera rossa, mansarda travi, doppia turchese
- **Pagina `/camere`**: griglia camere con foto reali e riconoscibili
- **Dettaglio camera**: galleria con foto reali multiple
- **Hero + Login**: corridoio in versione migliorata
- Nessuna foto Unsplash residua nelle camere

