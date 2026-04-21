

## Obiettivo
Inserire le 3 foto reali delle **camere** (mansarda travi rosso, doppia turchese, mansarda quadro astratto) nella **prima sezione** della home (HeroSection), sostituendo alcune delle foto degli spazi comuni attualmente nel collage.

## Situazione attuale HeroSection
Il collage hero mostra 5 foto di spazi comuni:
- Mobile hero → esterno
- Desktop main (centrale grande) → corridoio porte colorate
- Floating left → lounge
- Floating right → cucina
- Floating top-right → terrazzo

Le **camere** (il prodotto vero che si vende) non compaiono nell'hero — solo più in basso in "Scegli la tua camera".

## Nuova mappatura HeroSection
Sostituire 3 foto del collage con le camere, mantenendo varietà (1 esterno + 1 spazio comune + 3 camere):

| Slot | Prima | Dopo |
|---|---|---|
| Mobile hero | esterno | **camera-mansarda-travi** (più calda, vendibile) |
| Desktop main centrale | corridoio | **camera-mansarda-travi** (foto-eroe del prodotto) |
| Floating left | lounge | **camera-doppia-turchese** (mostra varietà tipologia) |
| Floating right | cucina | **camera-matrimoniale-rossa** (terza camera) |
| Floating top-right | terrazzo | **studentato-corridoio** (mantiene 1 spazio comune iconico) |

Risultato: hero centrato sulle **camere reali** (3 su 4 slot visibili) + 1 spazio comune iconico (corridoio Google).

## File modificati (1)
- **`src/components/home/HeroSection.tsx`** → swap 4 import asset (rimpiazzo `studentato-esterno`, `studentato-corridoio` come main, `studentato-lounge`, `studentato-cucina`, `studentato-terrazzo` con i 3 import camere + corridoio in posizione secondaria), aggiornamento alt text ("Camera mansarda con travi a vista", "Camera doppia turchese", "Camera matrimoniale", "Corridoio porte colorate")

## Note
- Nessuna modifica al layout/animazioni del collage
- Le foto camere sono già presenti in `src/assets/` (caricate negli step precedenti)
- Le foto spazi comuni rimosse dall'hero (lounge, cucina, terrazzo, esterno) restano disponibili e usate altrove (AboutSection per esterno; le altre possono servire in futuro per pagine dedicate "Spazi comuni")

