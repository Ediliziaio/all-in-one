---
name: Design tokens
description: Color palette, fonts, and visual style for Studentato Napoleone Padova
type: design
---

## Brand
- Name: Studentato Napoleone Padova
- Logo: `src/assets/logo-napoleone.png` (use `<img>` import, never recreate as text)

## Colors (HSL, semantic tokens in src/index.css)
- `--primary`: 212 56% 24% (navy #1B3A5F) — dark mode 212 60% 55%
- `--accent`: 132 50% 47% (green #3DB55A) — dark mode 132 55% 52%
- `--success`: 132 50% 42% — coerente col verde brand
- `--google-*`: blu/giallo/rosso/verde — riservati a highlight specifici (i 4 quadratini del logo)

## Tipografia
- Headings: Plus Jakarta Sans
- Body: Inter

## Regole
- Mai colori hardcoded nei componenti, solo token semantici
- Footer su navy: logo va dentro wrapper bianco arrotondato per leggibilità
