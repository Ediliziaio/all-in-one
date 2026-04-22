

## Problema reale
L'header attuale in modalità **overlay** (home in cima) è rotto:
- Wordmark "Napoleone" **bianco su sfondo bianco** → invisibile
- Link nav (Camere, Servizi…) **non si vedono** → testo bianco/80 su sfondo chiaro
- Bottone "Accedi" invisibile
- Logo riquadro bianco si confonde col background della pagina (sfumature chiare)
- La top utility bar è blu scuro ma resto è completamente trasparente → mismatch totale
- Risultato: sembra che manchi metà header

**Causa**: la home ha un background chiaro (non un'immagine scura), quindi `overlayMode` con testi bianchi non ha senso — è un pattern da hero scuro/foto, non da hero su gradient chiaro.

## Soluzione: header solido sempre, premium e leggibile

Abbandoniamo l'overlay-mode "trasparente con testi bianchi" e adottiamo un **header solido sempre**, ma con due rifiniture diverse a seconda dello scroll. Più semplice, più leggibile, più professionale.

### Layout finale

**Top utility bar** (sempre visibile in cima, sparisce on scroll, desktop only):
- Sfondo navy primary (come ora) con telefono / email / location

**Main navbar** (sempre solido, mai trasparente):
- **Top di pagina**: `bg-white` puro + bordo bottom sottile → pulito, definito
- **Scrolled**: `bg-white/95 backdrop-blur-lg` + ombra morbida `shadow-md` → effetto floating

### Cosa cambia visivamente
1. **Logo**: rimuovo il "riquadro bianco con padding" (inutile su sfondo bianco) → logo nudo pulito
2. **Wordmark "Napoleone"**: sempre **navy primary** (#1E3A5F), tagline grigia → leggibile sempre
3. **Link nav**: sempre grigio scuro, hover con pill `bg-muted/60`, attivo con underline arancione (accent)
4. **CTA "Richiedi info"**: arancione (accent) con freccia → resta com'è (funziona)
5. **CTA "Accedi"**: outline ghost grigio scuro → visibile sempre
6. **Mobile trigger**: bordo definito, mai trasparente

### Mobile
Lo sheet mobile resta com'è (già funziona bene). Solo il trigger button → bordo solido grigio + sfondo bianco sempre.

### Bonus: micro-interazioni
- Logo + wordmark con hover scale leggero (1.02)
- CTA "Richiedi info" con shadow glow arancione al hover (già c'è, lo mantengo)
- Top bar fade-out smooth on scroll (già c'è)

## File modificati (1)
**`src/components/Navbar.tsx`** → rimozione completa della logica `overlayMode` (variant trasparente), header sempre solido bianco con due stati (top vs scrolled). Meno codice, più affidabile.

## Note
- Nessuna modifica a Layout.tsx o pagine
- Logo mostrato senza riquadro bianco (era utile solo su foto scure)
- Wordmark + tagline sempre con colori brand → massima riconoscibilità
- Approccio "always-solid header" è lo standard per piattaforme di booking (Booking.com, Airbnb desktop, Idealista)

