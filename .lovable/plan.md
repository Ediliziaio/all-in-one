

## Obiettivo
Sostituire il rosso dominante della sezione Urgency con una palette più sobria basata sui colori brand (navy/primary), mantenendo l'immagine di sfondo come elemento visivo forte.

## Analisi
La sezione attuale usa `bg-gradient-to-tr from-google-red via-destructive to-primary` → troppo aggressivo. L'utente vuole comunque urgenza ma senza il rosso saturo. L'immagine `padova-twilight.jpg` è già lì ma con `opacity-30` → coperta dal gradient rosso.

## Soluzione

### 1. Background ridisegnato
- **Immagine in primo piano**: porto `padova-twilight.jpg` a `opacity-60` (più visibile, atmosfera serale Padova = perfetta per "ultimi posti")
- **Overlay scuro elegante**: sostituisco il gradient rosso con `bg-gradient-to-br from-primary/95 via-primary/85 to-[hsl(var(--google-blue))]/80` → navy profondo brand → blu Google. Sobrio, premium.
- **Vignette**: aggiungo `bg-gradient-to-t from-primary/60 to-transparent` in basso per leggibilità CTA
- Blob decorativi: cambio da `bg-white/5` + `google-yellow/10` a `bg-[hsl(var(--google-blue))]/15` + `bg-[hsl(var(--google-yellow))]/8` (giallo resta come accento caldo che spicca su navy)

### 2. Accenti caldi mantenuti (urgenza senza rosso)
- Badge "Disponibilità limitata" → da rosso a **giallo Google** (`bg-[hsl(var(--google-yellow))]/20 border-yellow`)
- Pallino animato ping → resta giallo
- Icona `AlertTriangle` → giallo
- Badge "Ultimi posti" sulle card → resta giallo Google (perfetto contrasto su navy)
- Numeri countdown e remaining: bianchi puri con drop-shadow

### 3. CTA aggiornata
- Bottone primario "Blocca il Tuo Posto": da `bg-white text-google-red` a **`bg-[hsl(var(--google-yellow))] text-primary hover:bg-yellow/90`** → giallo brand su navy = massimo contrasto + warm urgency senza rosso
- Bottone WhatsApp: resta outline bianco trasparente

### 4. Divider sopra
In `Index.tsx`: il divider Community→Urgency oggi è `wave fill: hsl(var(--google-red))`. Lo cambio a **`wave fill: hsl(var(--primary))`** così matcha il nuovo navy della sezione.

### 5. Progress bar
Gradient da `background → google-yellow` → invariato (funziona benissimo su navy, anzi meglio che su rosso).

## File modificati (2)
- `src/components/home/UrgencySection.tsx` → background navy/blue + immagine più visibile, accenti gialli, CTA gialla
- `src/pages/Index.tsx` → divider Community→Urgency da red a primary

Nessuna nuova dipendenza, solo token HSL esistenti.

