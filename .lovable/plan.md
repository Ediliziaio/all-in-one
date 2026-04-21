

## Obiettivo
Integrare le 6 foto reali dello Studentato Napoleone per sostituire le immagini stock (Unsplash) attualmente sparse nel sito, dando autenticità visiva al brand.

## Foto disponibili e contenuto
1. **Esterno** — Facciata gialla con archi caratteristici (segno distintivo del palazzo)
2. **Corridoio porte colorate** — Porte stile Google (blu, verde, bianco, giallo, rosso) — molto iconico
3. **Sala lounge rustica** — Camino in pietra, poltrone verdi, ambiente accogliente
4. **Sala comune + cucina secondaria** — Tavoli rotondi, sedie, kitchenette
5. **Cucina principale** — Doppia cucina condivisa, ampio spazio comune
6. **Terrazzo** — Vista cielo, parete gialla, decorazioni piante

## Dove integrare ogni foto

### 1. HeroSection (`HeroSection.tsx`)
Sostituire le 4 immagini Unsplash con foto reali:
- **Mobile hero image** → foto **esterno con archi** (impatto immediato, riconoscibilità)
- **Desktop main image (collage centrale)** → foto **corridoio porte colorate** (unico, memorabile, on-brand con palette Google)
- **Floating left** → foto **sala lounge** (vibe community)
- **Floating right** → foto **cucina principale** (spazi condivisi)
- **Floating top-right** → foto **terrazzo** (outdoor)

### 2. AboutSection (`AboutSection.tsx`)
Sostituire `padova-twilight.jpg` (generica) con la foto **esterno facciata** — è LA foto identitaria dello Studentato Napoleone, perfetta per "La nostra storia". Mantenere badge "Dal 2018" sovrapposto.

### 3. LoginPage (`LoginPage.tsx`)
Pannello brand a sinistra: sostituire `padova-twilight.jpg` con foto **corridoio porte colorate** o **esterno** — molto più on-brand del generico "Padova al tramonto". Mantenere overlay navy.

## Strategia asset
- Copiare tutte e 6 le foto in `src/assets/` con nomi semantici:
  - `studentato-esterno.jpg`
  - `studentato-corridoio.jpg`
  - `studentato-lounge.jpg`
  - `studentato-sala-comune.jpg`
  - `studentato-cucina.jpg`
  - `studentato-terrazzo.jpg`
- Importare via ES6 (`import esterno from "@/assets/studentato-esterno.jpg"`) per ottimizzazione Vite

## File modificati (3)
1. **`src/components/home/HeroSection.tsx`** → rimpiazzo 4 src Unsplash con import asset reali, alt text aggiornati ("Studentato Napoleone — corridoio camere", ecc.)
2. **`src/components/home/AboutSection.tsx`** → cambio src immagine da `padova-twilight.jpg` a `studentato-esterno.jpg` + aggiorno caption "Padova · Centro" → "Studentato Napoleone · Facciata storica"
3. **`src/pages/auth/LoginPage.tsx`** → cambio src brand panel da `padova-twilight.jpg` a `studentato-corridoio.jpg` (più memorabile) + alt text aggiornato

## Note tecniche
- Nessuna modifica a layout/styling — solo swap immagini + alt text
- Tutte le foto già ottimizzate dal lato utente, Vite gestisce hashing/lazy loading
- `padova-twilight.jpg` resta nel progetto (può servire per altre sezioni future)
- Performance: invariata o migliore (asset locali vs CDN Unsplash esterno)

