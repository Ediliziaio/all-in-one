

## Obiettivo
Aggiungere 2 nuove varianti di divider SVG (triangoli/zigzag e diagonali) e alternarle con le onde esistenti tra le sezioni della home per dare più ritmo visivo.

## Esplorazione fatta
- `WaveDivider` esiste in `src/components/motion/MotionWrappers.tsx` → SVG `viewBox="0 0 1440 80"`, accetta `fill` + `flip`
- `Index.tsx` ha 11 divider, tutti `WaveDivider` con `fill` = colore sezione successiva → diventa monotono

## Soluzione

### 1. Estendo `MotionWrappers.tsx` con 2 nuovi componenti

**`ZigzagDivider`** — onde a triangoli (sharp peaks):
```tsx
<path d="M0,40 L120,8 L240,40 L360,8 L480,40 L600,8 L720,40 L840,8 L960,40 L1080,8 L1200,40 L1320,8 L1440,40 L1440,80 L0,80 Z" />
```
Stesso `viewBox`, stesso `h-12 md:h-20`, stesse props (`fill`, `flip`, `className`).

**`DiagonalDivider`** — taglio diagonale netto:
```tsx
<path d="M0,80 L1440,0 L1440,80 Z" />
```
Variante elegante, minimale. Accetta anche `direction: "left" | "right"` per invertire la pendenza (right = `M0,0 L1440,80 L1440,80 L0,80 Z`).

Tutti e 3 i componenti hanno API identica → drop-in interchangeable.

### 2. Aggiorno `Index.tsx`

Sostituisco l'helper `Divider` con uno che accetta `variant: "wave" | "zigzag" | "diagonal"` e alterno le 11 transizioni così (pattern ritmico, non casuale):

```
Hero → ProblemSection           → wave (red/5)
Problem → Services              → diagonal (blue/5)
Services → RoomsPreview         → wave (white)
Rooms → HowItWorks              → zigzag (yellow/7)   ← ritmo
HowItWorks → Guarantee          → wave flip (green/8)
Guarantee → Testimonials        → diagonal (muted/30)
Testimonials → Community        → wave (blue/8)
Community → Urgency             → zigzag (red pieno)  ← enfasi prima del rosso forte
Urgency → About                 → wave flip (muted/30)
About → MapSection              → diagonal (muted/50)
```

Pattern: `wave → diagonal → wave → zigzag → wave → diagonal → wave → zigzag → wave → diagonal`. Le onde restano la maggioranza (5/10), zigzag e diagonal entrano come accenti ritmici.

## Note tecniche
- Solo `fill` via token HSL (no hex)
- `aria-hidden` mantenuto, decorativi
- Stesso `h-12 md:h-20` per coerenza altezza
- No nuove dipendenze, no nuovi file

## File modificati (2)
- `src/components/motion/MotionWrappers.tsx` → +2 componenti (`ZigzagDivider`, `DiagonalDivider`)
- `src/pages/Index.tsx` → helper `Divider` accetta `variant`, alternanza nelle 11 transizioni

