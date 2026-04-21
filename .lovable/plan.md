

## Obiettivo
Trasformare la sezione "Chi Siamo" in una vera presentazione di **Studentato Napoleone**: storia, identità, valori e numeri — con layout più ricco, immagine reale e gerarchia visiva forte.

## Problemi attuali
- Testo generico "Non siamo un'agenzia" → non comunica il brand **Napoleone**
- Layout tutto centrato e piatto: titolo + paragrafo + 4 card, zero immagine, zero personalità
- Anno "Dal 2018" incoerente con "7+ anni di esperienza" (siamo nel 2026 → 8 anni)
- Nessun riferimento al nome "Napoleone", alla location specifica, al perché del nome
- Card stats identiche a quelle dell'Hero → ridondanza

## Soluzione

### 1. Nuovo layout split (immagine + contenuto)
Due colonne su desktop, stack su mobile:
- **Sinistra**: foto (esterno palazzo / interno studentato / studenti insieme) con badge sovrapposto "Dal 2018" e piccola firma "Studentato Napoleone · Padova"
- **Destra**: contenuto testuale strutturato

### 2. Contenuto testuale potenziato
- **Eyebrow**: "La nostra storia" (small caps, accent color)
- **Titolo**: "Studentato Napoleone" + sottotitolo "La casa degli studenti a Padova"
- **Paragrafo principale**: storia del brand — chi siamo, da dove veniamo, cosa ci differenzia. Esempio:
  > "Studentato Napoleone nasce nel 2018 dall'idea di chi ha vissuto in prima persona la difficoltà di trovare casa a Padova. Non un'agenzia, ma una community: contratti chiari, spazi curati, persone vere che ti accompagnano dal primo giorno."
- **3 valori chiave** con icone (lista verticale, non card):
  - 🏛 Trasparenza · contratti regolari, zero sorprese
  - 🤝 Community · eventi, supporto tra studenti
  - ⚡ Risposta rapida · assistenza 24/7

### 3. Stats riprogettati come strip orizzontale
Sotto il blocco split, una **strip pulita** (no card pesanti) con i 4 numeri separati da divider verticali sottili — diversa dall'Hero per evitare ridondanza:
- 8+ Anni di attività · 500+ Studenti ospitati · 98% Rinnovi contratto · 4.9★ Google Reviews
- Stile: numeri grandi colorati Google palette, label sotto piccola, separatori `border-l` tra colonne

### 4. CTA finale
Riga conclusiva con pulsante "Scopri la nostra storia" → link a pagina Vantaggi (o stessa pagina ancorata)

### 5. Background più caratterizzato
Da `bg-muted/30` flat a un background con leggero pattern/gradient sottile (es. `bg-gradient-to-br from-muted/40 via-background to-muted/20`) per dare profondità senza distrarre.

## Diagramma layout desktop
```text
┌─────────────────────────────────────────────────────┐
│           LA NOSTRA STORIA                          │
│                                                     │
│ ┌──────────────┐  ┌──────────────────────────────┐ │
│ │              │  │ Studentato Napoleone         │ │
│ │   [FOTO]     │  │ La casa degli studenti       │ │
│ │              │  │                              │ │
│ │ Dal 2018 ●   │  │ Studentato Napoleone nasce…  │ │
│ │              │  │                              │ │
│ └──────────────┘  │ 🏛 Trasparenza · …           │ │
│                   │ 🤝 Community · …             │ │
│                   │ ⚡ Risposta rapida · …       │ │
│                   │                              │ │
│                   │ [Scopri di più →]            │ │
│                   └──────────────────────────────┘ │
│                                                     │
│ ─────────────────────────────────────────────────── │
│   8+      │   500+     │   98%      │   4.9★       │
│   Anni    │   Studenti │   Rinnovi  │   Reviews    │
└─────────────────────────────────────────────────────┘
```

## File modificati (1)
- **`src/components/home/AboutSection.tsx`** → riscrittura completa con layout split, copy Studentato Napoleone, valori con icone (Lucide: `Shield`, `Users`, `Zap`), stats strip, CTA. Uso immagine esistente `padova-twilight.jpg` o placeholder Unsplash temporaneo per la foto.

Nessun nuovo asset richiesto. Nessuna nuova dipendenza.

