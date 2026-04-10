

# Ammorbidire il Copy — Push Solo su Urgenza e Offerte

## Problema
Il tono attuale è troppo aggressivo/push ovunque: headline con "Smetti di Buttare Soldi", ProblemSection con "è un incubo", testimonial con "Non Fidarti di Noi". Va bene per urgenza/offerte, ma il tono generale deve essere accogliente e professionale.

## Filosofia
- **Sezioni informative** (Hero, Servizi, Come Funziona, About, Testimonial): tono caldo, rassicurante, professionale. Niente paura, niente pressione.
- **Sezioni push** (ProblemSection, UrgencySection, RoomsPreview badges, GuaranteeSection): qui si mantiene scarcity, urgenza, price anchoring. Sono i punti dove il push è appropriato.

---

## Modifiche per sezione

### 1. HeroSection — Da aggressivo a accogliente
- **Headline**: "Smetti di Buttare Soldi..." → "La Tua Casa a Padova, Senza Pensieri."
- **Sub**: meno pressione, più beneficio → "Camera privata con tutto incluso — WiFi, palestra, bollette — a partire da €480/mese. A pochi minuti dall'università."
- **Badge urgenza**: si mantiene ma più soft → "Posti limitati per Settembre 2025" (senza AlertTriangle e "Solo 7")
- **CTA**: "Blocca il Tuo Posto" → "Scopri le Camere" / "Prenota una visita"
- **Stats**: si mantengono (sono dati, non push)
- **Trust badges**: restano invariati

### 2. ProblemSection — Mantiene il push (è il suo ruolo)
- Titolo leggermente ammorbidito: "è un incubo" → "può essere complicato"
- Badge: "La verità che nessuno ti dice" → "Lo sappiamo bene"
- Sottotitolo meno aggressivo
- I pain points restano (sono il motivo per cui la sezione esiste)
- Si mantiene il tono push ma meno drammatico

### 3. ServicesSection — Tono informativo
- **Headline**: "Ecco Cosa Ottieni (e Quanto Risparmi)" → "Tutto Incluso nel Canone"
- Rimuovere i badge "Valore: €XX/mese" da ogni card (troppo push)
- Mantenere il value stack summary in fondo ma con tono più sobrio: "Valore complessivo stimato" anziché il prezzo barrato gigante
- Descrizioni dei servizi: togliere toni forzati

### 4. RoomsPreview — Push sulle offerte (si mantiene)
- Headline resta push: "Prima Che Lo Faccia Qualcun Altro" è appropriato qui
- Badge scarcity e "tutto incluso" restano — è la sezione offerta

### 5. HowItWorksSection — Tono semplice
- Headline: "Dalla Richiesta alle Chiavi in 72 Ore" → "Come Funziona"
- Rimuovere badge "⏱ 2 min / 24 ore / 72 ore" (troppo push)
- Descrizioni più naturali, meno pressione sul tempo

### 6. TestimonialsSection — Tono autentico
- Headline: "Non Fidarti di Noi. Fidati di Loro." → "Cosa Dicono i Nostri Studenti"
- Rimuovere badge "highlight" dalle card (es. "Risparmiati €180/mese")
- Testimonial restano con risultati specifici (è social proof, non push)

### 7. UrgencySection — Mantiene il push (è il suo ruolo)
- Resta invariata. Scarcity, contatori, doppio CTA. È la sezione dedicata.

### 8. GuaranteeSection — Mantiene il push moderato
- Resta invariata. Risk reversal è appropriato.

### 9. AboutSection — Resta invariata
- Già in tono sobrio e professionale.

---

## File modificati (6)

- `src/components/home/HeroSection.tsx` — headline, sub, badge, CTA ammorbiditi
- `src/components/home/ProblemSection.tsx` — titolo e intro leggermente più soft
- `src/components/home/ServicesSection.tsx` — rimuovere value badges, tono sobrio
- `src/components/home/HowItWorksSection.tsx` — headline semplice, no time badges
- `src/components/home/TestimonialsSection.tsx` — headline e rimuovere highlight badges
- `src/components/home/RoomsPreview.tsx` — nessuna modifica (push appropriato qui)

