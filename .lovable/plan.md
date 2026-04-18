

## Problemi identificati nella sezione Urgency

Dallo screenshot:
1. **Zigzag bianco sopra** crea un "effetto denti" troppo aggressivo sul rosso pieno → sembra rotto
2. **Countdown a 00:00:00:00** perché la data target è `2025-09-01` (passata) → sembra bug
3. **Background rosso piatto** troppo saturo, le card si confondono
4. **Card disponibilità** poco contrastate, il dato (7, 3, 2) non spicca
5. **Progress bar gradient** verde→blu→rosso visivamente caotico su sfondo rosso
6. **Nessuna gerarchia visiva** chiara: countdown, %, card competono tutti

## Soluzione

### 1. Fix data target (bug)
Calcolo dinamico del prossimo settembre: se oggi > 1 settembre dell'anno corrente → target 1 settembre prossimo anno. Così il countdown ha sempre numeri reali.

### 2. Sostituisco il divider zigzag prima di Urgency
In `Index.tsx` cambio il divider `Community → Urgency` da `zigzag fill: red pieno` a **`wave fill: red pieno`** → transizione fluida invece che "denti".

### 3. Ridisegno background sezione
- Da `gradient red 95→90→primary 85` (piatto) a **gradient più ricco**: `from-[hsl(var(--google-red))] via-[hsl(var(--destructive))]/90 to-primary` con angolo diverso (`bg-gradient-to-tr`)
- Aggiungo **noise/blob decorativi** soft (2 blob bianchi sfocati `bg-white/5 blur-3xl`) per rompere la piattezza
- Riduco opacity immagine sfondo per vederla meglio (`opacity-30` sull'img)

### 4. Migliorie countdown
- Box più grandi e "premium": `bg-white/15 → bg-white/10 border-white/25`, `rounded-2xl`, padding maggiore
- Numeri `text-4xl md:text-5xl font-black` (oggi 2xl/3xl, troppo piccoli)
- Separatori `:` tra i box su desktop
- Etichette `text-[10px]` più discrete

### 5. Card disponibilità più leggibili
- Sfondo card `bg-white/15 backdrop-blur-md` (più opaco)
- Numero principale `text-5xl font-black text-white` con drop-shadow leggera
- Aggiungo **badge "ultimi posti"** in giallo Google quando `remaining <= 3` per attirare l'occhio
- Progress bar interna mono-colore bianca (no più rosso/blu/verde caotico)

### 6. Progress bar globale
- Sostituisco gradient caotico `accent→primary→destructive` con **gradient pulito bianco → giallo Google** (più leggibile su rosso)
- Aggiungo `animate-pulse` sottile sull'ultimo 10%

### 7. CTA finale rinforzato
- Bottone primario `bg-white text-[hsl(var(--google-red))] hover:bg-white/90` invece di accent verde (più contrasto, più "click me")
- Bottone WhatsApp resta outline ma con icona verde Google

### 8. Micro-elementi
- Badge "Disponibilità limitata" con `animate-pulse` sottile sul punto rosso
- Aggiungo riga "🔴 Aggiornato oggi" sotto progress bar per credibilità

## File modificati (2)
- `src/components/home/UrgencySection.tsx` → fix countdown, ridesign visivo completo
- `src/pages/Index.tsx` → cambio divider Community→Urgency da zigzag a wave

Nessuna nuova dipendenza, solo token HSL esistenti.

