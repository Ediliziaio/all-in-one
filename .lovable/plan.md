

# Ottimizzazione pagine Vantaggi, Servizi e Community

## Diagnosi attuale

**Vantaggi**: hero piatta, grid di 6 card identiche, comparison table OK ma fredda, testimonial stesso pattern visto altrove. Manca gerarchia e numeri/dati che convincano.

**Servizi**: hero simile, 6 card servizi con foto generiche, "Per i genitori" buona idea ma sezione troppo piccola. Manca un "highlights bar" rapido e una sezione che mostri i servizi in azione.

**Community**: esiste solo come *sezione* della home (`CommunitySection.tsx`). Non c'è una pagina pubblica `/community`. La sezione è discreta ma corta: 3 card + collage 5 foto + CTA.

## Cosa cambio

### 1. `Vantaggi.tsx` — più impatto e numeri

- **Hero ridisegnato**: badge "Vantaggi reali", titolo più grande, sotto-titolo + 3 mini-stat in bar (€100/mese risparmiati, 5 min uni, 0 bollette extra)
- **Sezione "Quanto risparmi davvero"**: calcolatore visivo statico — affianca colonna "Affitto tradizionale" (€350 + €150 bollette + €40 wifi + €60 palestra = €600) vs "Studentato Napoleone" (€480 tutto incluso) con la differenza evidenziata in verde
- **Vantaggi grid**: card più ricche con bordo accent al hover, numero/icona grande in alto, micro-stat sotto la descrizione (es. "5 min a piedi", "1Gbps", "100+ studenti")
- **Comparison table**: aggiungo colonna "Cosa significa" con descrizione breve sotto al check, sticky header su mobile
- **Sezione nuova "Storie reali"**: 3 testimonial con foto avatar, badge corso/anno, virgolette decorative grandi, layout asimmetrico (non grid uniforme)
- **CTA finale rafforzata** con countdown posti

### 2. `Servizi.tsx` — più visivo e tangibile

- **Hero**: come Vantaggi, badge "Tutto incluso" + 3 mini-stat (12 servizi inclusi, 24/7, €0 extra)
- **Bar "highlights" subito sotto hero**: 6 mini-icone in linea (Wifi, Palestra, Lavanderia, Cucina, Sale studio, Sicurezza) con label, sticky-feel
- **Services grid**: card più editoriali — immagine grande, overlay gradient con titolo sopra, descrizione sotto con bullet "Cosa include" (3 punti per servizio)
- **Sezione nuova "Una giornata tipo"**: timeline orizzontale che mostra come uno studente usa i servizi durante la giornata (07:00 palestra → 09:00 sala studio → 13:00 cucina → 18:00 lavanderia → 21:00 area lounge)
- **"Per i genitori" potenziata**: aggiungo 4° punto, layout split con immagine genitore-figlio
- **FAQ rapida** (4 domande): "Posso disdire?", "Posso ricevere ospiti?", "Cosa succede se si rompe qualcosa?", "Sono coperto da assicurazione?"

### 3. Nuova pagina pubblica `/community` 

(Attualmente `/studente/community` è interna. Creo `src/pages/Community.tsx` pubblica.)

- **Hero immersivo**: foto gruppo studenti + titolo "La tua nuova famiglia a Padova"
- **Manifesto community**: 3 paragrafi grandi con icona — "Vivere insieme", "Crescere insieme", "Divertirsi insieme"
- **Eventi del mese** mock: 4-6 card eventi con data/orario/descrizione (Aperitivo benvenuto, Cena internazionale, Torneo calcetto, Serata cinema, Workshop CV, Brunch domenica)
- **Tipi di attività**: 6 categorie con icona (Sport, Studio, Cultura, Cucina, Volontariato, Viaggi)
- **Galleria momenti**: collage più ricco (8-10 foto) con masonry layout
- **Storie community**: 2-3 testimonianze lunghe con foto, focus su amicizie nate
- **"Come funziona"**: 3 step — entri → conosci → partecipi
- **CTA**: "Vieni a trovarci a un evento" + link camere

Aggiungo route in `App.tsx` e link in navbar (`Navbar.tsx`).

## Tecnica

- Riuso `MotionWrappers` (FadeIn, StaggerContainer, HoverCard, Parallax)
- Niente nuove dipendenze
- Token semantici brand (primary navy, accent verde) — niente hardcoded
- Foto Unsplash via URL diretti

## File modificati/creati (5)

1. `src/pages/Vantaggi.tsx` — ridisegno completo
2. `src/pages/Servizi.tsx` — ridisegno completo  
3. `src/pages/Community.tsx` — **nuovo file** (pagina pubblica)
4. `src/App.tsx` — aggiungo route `/community`
5. `src/components/Navbar.tsx` — aggiungo link "Community" nel menu

