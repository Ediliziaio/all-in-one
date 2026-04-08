

# Miglioramento CameraDettaglio — Galleria Airbnb + Sidebar Sticky

## Cosa cambia

### 1. Galleria foto stile Airbnb
- Layout **1 grande + 4 piccole** (griglia 2 colonne: immagine principale occupa metà sinistra a tutta altezza, 4 thumbnail in griglia 2x2 a destra)
- Ogni camera ha già 5 immagini nel data — perfetto per questo layout
- Click su qualsiasi immagine apre un **lightbox fullscreen** con navigazione frecce e contatore (es. "2/5")
- Pulsante "Mostra tutte le foto" sovrapposto all'ultima immagine
- Angoli arrotondati sulla griglia, hover overlay scuro sulle immagini
- Su mobile: solo immagine principale + pulsante "Vedi tutte le foto"

### 2. Sidebar sticky migliorata
- Card con bordo e ombra leggera, `sticky top-24`
- Prezzo grande con "/mese" in grigio
- Lista rapida servizi top (3-4 icone inline: WiFi, Bagno, AC...)
- Divider
- CTA primario "Richiedi Prenotazione" (arancione, pieno)
- CTA secondario "Prenota una visita" (outline)
- Badge "Risposta entro 24h" con icona
- Info "Disponibile dal..." con icona calendario
- Animazione entrada con Framer Motion

### 3. Sezione info principale migliorata
- Breadcrumb più raffinato
- Titolo + badge disponibilità + tipo camera su una riga
- Separatore visivo tra sezioni (descrizione, servizi, camere simili)
- Card camere simili con HoverCard animation

### 4. Lightbox component
- Nuovo componente Dialog-based per la galleria fullscreen
- Navigazione con frecce tastiera (ArrowLeft/Right) e click
- Overlay scuro, immagine centrata, contatore slide

## File coinvolti
- **Modifica**: `src/pages/CameraDettaglio.tsx` (riscrittura completa)
- **Nessun nuovo file** — il lightbox sarà inline con Dialog di shadcn

