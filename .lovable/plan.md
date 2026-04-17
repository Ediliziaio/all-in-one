

# Logo Napoleone + Rebrand colori

## Brand identity

Sostituisco il branding placeholder "StudentatoPD" con **Studentato Napoleone Padova**, usando il logo caricato e ricalibrando la palette.

### Nuova palette estratta dal logo
- **Primary (navy)**: `#1B3A5F` → `hsl(212 56% 24%)` — il blu profondo del tetto/Napoleone
- **Accent (verde)**: `#3DB55A` → `hsl(132 50% 47%)` — il verde dell'arco e di STUDENDATO
- **Secondary highlights**: i 4 quadratini (blu/giallo/rosso/giallo) restano mappati su `--google-*` (già presenti)
- **Success**: allineato al verde del logo
- **Dark mode**: navy schiarito + verde leggermente più luminoso per contrasto

## Cosa cambio

### 1. Logo asset
- Copio `user-uploads://Napoleone.png` → `src/assets/logo-napoleone.png`
- Creo anche una versione "mark only" usando lo stesso file (verrà ridimensionato via CSS per usi compatti)

### 2. Tokens (`src/index.css`)
- Aggiorno `--primary` a navy del logo (light + dark)
- Aggiorno `--accent` a verde del logo
- Aggiorno `--success` per coerenza con il verde brand
- Aggiorno `--ring`, `--sidebar-primary` di conseguenza

### 3. Navbar (`src/components/Navbar.tsx`)
- Rimuovo il quadratino "SP" + scritta colorata Google
- Inserisco `<img src={logo} alt="Studentato Napoleone Padova" className="h-10 w-auto" />`

### 4. Footer (`src/components/Footer.tsx`)
- Rimuovo "SP" + "StudentatoPD"
- Inserisco logo (versione su sfondo scuro: aggiungo wrapper bianco arrotondato così il logo resta leggibile sul navy)
- Aggiorno copyright: "© Studentato Napoleone Padova"

### 5. Naming testuale (find & replace mirato)
Sostituisco "StudentatoPD" → "Studentato Napoleone" in:
- `src/pages/Contatti.tsx` (title iframe)
- `src/pages/Vantaggi.tsx` (h1)
- `src/pages/admin/AdminImpostazioni.tsx` (default `nomeStruttura`)
- `index.html` (title + meta)

Le email `info@studentatopd.it` restano (placeholder dominio) — non le tocco salvo richiesta esplicita.

### 6. Memory update
Aggiorno `mem://design/tokens` e `mem://index.md` con nuovi colori brand.

## File modificati (6)
1. `src/assets/logo-napoleone.png` — nuovo asset
2. `src/index.css` — tokens primary/accent/success
3. `src/components/Navbar.tsx` — logo immagine
4. `src/components/Footer.tsx` — logo + nome
5. `src/pages/Vantaggi.tsx`, `src/pages/Contatti.tsx`, `src/pages/admin/AdminImpostazioni.tsx`, `index.html` — naming
6. `mem://design/tokens` + `mem://index.md` — aggiornamento memoria brand

