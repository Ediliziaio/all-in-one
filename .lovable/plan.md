

# Miglioramenti Pagina Camere

## Analisi attuale
La pagina ha già filtri funzionanti (tipo, piano, prezzo, servizi, data, disponibilità). Ecco cosa manca o si può migliorare:

## Miglioramenti proposti

### 1. Quick filter bar sopra i risultati
Barra orizzontale con chip/toggle rapidi per tipo camera (Singola, Singola Plus, Doppia) — alternativa veloce al pannello laterale. Più immediato per l'utente che sa già cosa cerca.

### 2. Ordinamento risultati
Select dropdown "Ordina per": Prezzo crescente, Prezzo decrescente, Metratura, Piano. Attualmente non c'è alcun ordinamento.

### 3. Toggle vista griglia/lista
Due icone per switchare tra vista card (attuale) e vista lista compatta con più info visibili. Utile su desktop per confrontare velocemente.

### 4. Card migliorate
- Aggiungere **"tutto incluso"** in verde sotto il prezzo (coerenza con RoomsPreview)
- Mostrare la **data disponibilità** sulla card ("Da settembre 2025")
- Descrizione troncata a 1 riga sotto il titolo per dare più contesto

### 5. Contatore filtri attivi nel bottone mobile
Badge numerico sul bottone "Filtri" che mostra quanti filtri sono attivi (es. "Filtri (3)").

### 6. Sticky filter bar su mobile
Su mobile, quando i filtri sono chiusi, mostrare una barra sticky in alto con i chip dei filtri attivi che si possono rimuovere con X.

### 7. CTA bottom migliorata
Cambiare CTA da "Scopri i nostri servizi" → "Scrivici — ti aiutiamo a scegliere" con link a `/contatti`. Più orientato alla conversione.

## File coinvolti
- **Modifica**: `src/pages/Camere.tsx` (tutti i miglioramenti)

