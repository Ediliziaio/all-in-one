

## Obiettivo
Effetto parallax leggero sull'immagine `padova-twilight.jpg` di sfondo nella sezione Urgency: l'immagine si muove più lentamente dello scroll del contenuto → percezione di profondità.

## Analisi
- `Parallax` esiste già in `src/components/motion/MotionWrappers.tsx` → usa `useScroll` + `useTransform` su `y`. Default `offset=40px`.
- L'immagine attuale è `<img>` con `absolute inset-0 h-full w-full object-cover opacity-60`. Wrappata in `<section relative overflow-hidden>`.
- Problema: `Parallax` applica `transform: translateY` al wrapper. Se wrappo solo l'`<img>`, il wrapper deve mantenere `absolute inset-0`. Devo anche dare un'altezza extra all'immagine (es. `h-[120%] -top-[10%]`) così il movimento parallax non rivela bordi vuoti.

## Soluzione

In `src/components/home/UrgencySection.tsx`:

1. **Import** `Parallax` da `@/components/motion/MotionWrappers`.

2. **Wrappo l'immagine** con `Parallax`:
```tsx
<Parallax offset={60} className="absolute inset-0">
  <img
    src={padovaBg}
    alt=""
    aria-hidden="true"
    loading="lazy"
    width={1920}
    height={1080}
    className="absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover opacity-60"
  />
</Parallax>
```

- `offset={60}` = movimento totale ±60px (leggero, non aggressivo)
- `h-[120%] -top-[10%]` = immagine 20% più alta della sezione, centrata verticalmente → copre i bordi durante lo scroll
- Wrapper `absolute inset-0` mantiene il posizionamento originale

3. **Z-index check**: Parallax (img) → gradient diagonale → vignette top → blob → vignette radiale → container. Ordine DOM invariato, funziona.

4. **Performance**: `useScroll` con `target` su ref locale → calcolo solo quando la sezione è in viewport. `Parallax` esistente usa già questo pattern correttamente.

## File modificato (1)
- `src/components/home/UrgencySection.tsx` → import `Parallax`, wrap dell'`<img>` di sfondo, classi immagine adattate per evitare bordi vuoti

Nessuna nuova dipendenza, nessun nuovo file.

