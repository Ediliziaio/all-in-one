

## Obiettivo
1. Animare i numeri "remaining" delle 3 card disponibilità con count-up da 0 al valore finale al primo entering in viewport.
2. Aggiungere vignettatura laterale scura sull'immagine di Padova per profondità cinematografica.

## Analisi
- `CountUp` esiste già in `src/components/motion/MotionWrappers.tsx` → supporta modalità numerica con `to`, `from`, `duration`, `decimals`. Trigger via `useInView({ once: true })`. Drop-in perfetto.
- Sezione Urgency oggi ha solo overlay top-bottom (vignette inferiore + gradient). Mancano i bordi laterali scuri.

## Soluzione

### 1. Count-up sui numeri rimanenti
In `UrgencySection.tsx`, dentro il `.map(availability)`, sostituisco:
```tsx
<p className="text-5xl md:text-6xl font-black ...">{item.remaining}</p>
```
con:
```tsx
<CountUp to={item.remaining} duration={1.4} className="text-5xl md:text-6xl font-black drop-shadow-md leading-none block" />
```
- Import `CountUp` da `@/components/motion/MotionWrappers`
- `to` = valore finale, parte da 0 (default `from`)
- `duration={1.4}` coerente con altre animazioni della sezione (progress bar usa 1.4)
- `block` per mantenere layout (era `<p>`, ora `<span>` da CountUp)

Faccio lo stesso anche per il numero "takenSpots" della progress bar globale: sostituisco `<strong>{takenSpots}</strong>` con `<CountUp to={takenSpots} duration={1.6} className="font-bold" />` e `{Math.round(fillPct)}%` con `<CountUp to={Math.round(fillPct)} duration={1.6} suffix="%" className="font-bold" />`. Bonus coerenza.

### 2. Vignettatura laterale cinematografica
Aggiungo un nuovo overlay `aria-hidden` subito dopo gli overlay esistenti:
```tsx
<div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_hsl(var(--primary)/0.7)_100%)]" />
```
- Radial gradient ellittico: trasparente al centro (mostra l'immagine), navy scuro ai bordi (vignettatura).
- Usa `--primary` (navy brand) per coerenza con il resto della sezione.
- Posizionato sopra l'immagine ma sotto il container `container max-w-4xl relative` (che è già `relative` quindi passa sopra).

Z-index gestito dall'ordine DOM: img → gradient diagonale → vignette top → blob → **vignette radiale (NEW)** → container content.

## File modificato (1)
- `src/components/home/UrgencySection.tsx` → import `CountUp`, animazione 3 numeri card + 2 numeri progress bar, +1 div radial vignette

Nessuna nuova dipendenza, nessun nuovo file.

