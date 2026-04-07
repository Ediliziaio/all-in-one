

# Aggiornamenti Sito Pubblico: Navbar, Camere, Servizi, Vantaggi

## Cosa cambia

### 1. Navbar -- rimuovere "Home", aggiungere nuove voci
- Rimuovere la voce "Home" dai link di navigazione
- Aggiungere: **Camere**, **Servizi**, **Vantaggi**
- Il logo "StudentatoPD" porta comunque alla home cliccandoci

### 2. Pagina Camere (`/camere`) -- miglioramento
- Aggiungere hero banner in cima con titolo, sottotitolo e immagine di sfondo
- Aggiungere filtro per **piano** nella sidebar
- Aggiungere sezione CTA in fondo ("Non trovi la camera giusta? Contattaci")
- Animazioni Framer Motion coerenti con il resto del sito (PageTransition, FadeIn, HoverCard)
- Migliorare le card con icone per i servizi principali e badge prezzo più visibile

### 3. Nuova pagina Servizi (`/servizi`)
- Hero section con titolo "I nostri servizi" e sottotitolo
- Griglia di 6+ servizi dettagliati (WiFi Fibra, Lavanderia Smart, Cucina Comune, Palestra, Sicurezza 24/7, Studio Rooms) -- espansione di quelli in homepage con descrizioni lunghe, immagini Unsplash e icone
- Sezione "Perche scegliere noi" con 3 punti chiave
- CTA finale "Prenota la tua camera"
- Animazioni fade-up e stagger

### 4. Nuova pagina Vantaggi (`/vantaggi`)
- Hero section con titolo "I vantaggi di vivere con noi"
- Sezione con card per ogni vantaggio: Posizione strategica, Tutto incluso nel prezzo, Community studentesca, Supporto dedicato, Contratti flessibili, Eventi e networking
- Sezione comparativa (tabella o card) "StudentatoPD vs Affitto tradizionale"
- Testimonianze degli studenti (riuso componente)
- CTA finale
- Animazioni coerenti

### 5. Routing
- Aggiungere in `App.tsx` le rotte `/servizi` e `/vantaggi`

## File coinvolti
- **Modifica**: `src/components/Navbar.tsx` (link aggiornati)
- **Modifica**: `src/pages/Camere.tsx` (miglioramenti UI)
- **Modifica**: `src/App.tsx` (nuove rotte)
- **Nuovo**: `src/pages/Servizi.tsx`
- **Nuovo**: `src/pages/Vantaggi.tsx`

