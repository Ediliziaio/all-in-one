

# Studentato Padova — Fase 1: Fondamenta + Sito Pubblico

## Panoramica
Piattaforma digitale per studentato privato a Padova con sito pubblico, portale admin e area studente. Questa prima fase copre il design system, i layout globali e tutto il sito pubblico.

## Design System
- Palette colori: Blu scuro (#1E3A5F), Arancione (#F97316), Verde (#10B981), sfondi chiari
- Font: Plus Jakarta Sans (titoli) + Inter (body) da Google Fonts
- Rounded corners 12-20px, glassmorphism su navbar, shadows su hover, gradients su hero/CTA
- Animazioni fade-up con Framer Motion su ogni sezione

## Dipendenze da installare
- framer-motion, zustand, recharts, date-fns, lucide-react

## Componenti Layout Globali
- **Navbar**: sticky glassmorphism, logo "StudentatoPD", link navigazione, CTA "Accedi"/"Prenota Ora", hamburger mobile
- **Footer**: logo + tagline, 3 colonne link, social icons, copyright

## Sito Pubblico — HomePage (/)
- **Hero Section**: titolo "La tua casa a Padova. Senza stress.", sottotitolo, 2 CTA, stats (45 camere, 200+ studenti, 4.9 rating), badge urgenza
- **Sezione Servizi**: 6 card (WiFi Fibra, Lavanderia Smart, Cucina Comune, Palestra, Sicurezza 24/7, Studio Rooms)
- **Anteprima Camere**: 3 card (Singola 480€, Singola Plus 580€, Doppia 380€) con tabs tipo camera
- **Testimonianze**: carosello 5 recensioni con avatar, nome, corso, stelle
- **Mappa e Posizione**: layout 2 colonne con punti distanza + iframe Google Maps
- CTA "Vedi tutte le camere disponibili"

## Pagina Camere (/camere)
- **Catalogo** con sidebar filtri (tipo, prezzo slider, disponibilità, piano, servizi)
- **CameraCard**: immagine 16:9, badge stato, prezzo, info, hover overlay
- 6 camere seed con dati realistici (hardcoded per ora)

## Pagina Dettaglio Camera (/camere/:id)
- Galleria foto stile Airbnb (1 grande + 4 piccole)
- Info complete: nome, prezzo, piano, mq, servizi con icone
- Sidebar sticky con CTA "Richiedi Prenotazione"
- Sezione camere simili

## Routing
- `/` → HomePage
- `/camere` → CamereCatalogo  
- `/camere/:id` → CameraDettaglio

## UX
- Tutte le immagini da Unsplash (camere, studenti, Padova)
- Testo realistico in italiano (no lorem ipsum)
- Loading skeleton, empty states, toast notifications
- Responsive: mobile-first con breakpoint tablet/desktop

