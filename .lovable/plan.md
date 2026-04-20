

## Obiettivo
Aggiungere un'immagine di background (Padova o studenti) sfumata e trasparente alla HeroSection, in modo che si fonda visivamente con la navbar in alto, eliminando lo stacco netto tra header e hero.

## Analisi stato attuale
- `Navbar` è `sticky top-0` con classe `glass` (background semi-trasparente con blur) → già pronta a "vedere attraverso"
- `HeroSection` ha sfondo `bg-gradient-to-br from-muted via-background to-muted` + `GradientMesh` con blob animati → sfondo chiaro/neutro
- L'immagine di Padova esiste già: `padova-twilight.jpg` usata in `UrgencySection`
- Nessuna immagine di background nella hero, solo gradient + blob

## Soluzione

### 1. Immagine background full-section nella Hero
Aggiungo un layer immagine `absolute inset-0` come primo figlio della `<section>`, **dietro** al `GradientMesh` e al contenuto:
- Sorgente: `padova-twilight.jpg` (riuso esistente, no nuovo asset)
- `object-cover`, `w-full h-full`
- Opacità bassa: `opacity-20` (sfumata, non invasiva)
- `loading="eager"` perché LCP

### 2. Sfumature per fondersi con navbar e contenuto sotto
Tre overlay gradient sopra l'immagine:
- **Top fade** (fonde con navbar): `bg-gradient-to-b from-background via-background/80 to-transparent` alto `h-32` → la navbar `glass` si appoggia su questo, transizione invisibile
- **Bottom fade** (fonde con sezione successiva): `bg-gradient-to-t from-background to-transparent` alto `h-40`
- **Side fade desktop**: gradient laterale leggero per non distrarre dal testo

### 3. Aggiustamento background sezione
- Cambio `bg-gradient-to-br from-muted via-background to-muted` → `bg-background` (l'immagine fa il lavoro visivo)
- Mantengo `GradientMesh` ma con opacità ridotta (`opacity-60`) per non competere con la foto
- Mantengo blob decorativo dietro testo

### 4. Leggibilità testo
Su desktop il testo è a sinistra → l'immagine sfumata al 20% non disturba.
Su mobile l'immagine hero esistente (KenBurns) resta intatta e separata; l'immagine background si vede principalmente nello spazio sopra/sotto.

### 5. Z-index layering (dal basso verso l'alto)
1. `<img>` background (opacity-20)
2. Top fade gradient (fonde con navbar)
3. Bottom fade gradient
4. `GradientMesh` (blob colorati, opacity ridotta)
5. Blob decorativo dietro testo
6. `container` con contenuto (testo + collage)

## Esempio struttura
```text
<section relative overflow-hidden bg-background>
  <img padova absolute inset-0 opacity-20 />
  <div top-fade bg-gradient-to-b from-bg to-transparent h-32 />
  <div bottom-fade bg-gradient-to-t from-bg to-transparent h-40 />
  <GradientMesh opacity-60 />
  <div blob-text />
  <div container relative z-10>
    {contenuto esistente}
  </div>
</section>
```

## File modificati (1)
- `src/components/home/HeroSection.tsx` → import `padovaBg` da `@/assets/padova-twilight.jpg`, aggiungo layer immagine + 2 overlay gradient, riduco opacità GradientMesh, cambio background sezione a `bg-background`

Nessun nuovo asset, nessuna nuova dipendenza.

