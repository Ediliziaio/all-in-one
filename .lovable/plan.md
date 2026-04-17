

L'utente vuole due cose:
1. **Rimuovere il dark mode** ovunque (toggle dal menu, ThemeProvider, classi `dark:`, ecc.)
2. **Ottimizzare tutto il sito per mobile**

Esploro per capire dove sta il dark mode e quali pagine hanno problemi mobile evidenti.
<lov-tool-use id="toolu_vrtx_016xCyEj7swrP2iu2vrezDW5" name="code--view" integration-id="code" data="{\"file_path\": \"src/components/ThemeToggle.tsx\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01N8PSxHekQWX4KRV6ifVj1o" name="code--view" integration-id="code" data="{\"file_path\": \"src/App.tsx\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01WTwuL8rmqvUaNc9TSbyFCZ" name="code--search_files" integration-id="code" data="{\"query\": \"dark:\", \"include_patterns\": \"*.tsx,*.ts,*.css\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01HbhpcwBqJ2baQNWEoQRmzn" name="code--search_files" integration-id="code" data="{\"query\": \"ThemeToggle|ThemeProvider|next-themes|useTheme\", \"include_patterns\": \"*.tsx,*.ts\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01D3UaX1YszvqbHze6yjbvaU" name="code--view" integration-id="code" data="{\"file_path\": \"src/components/ThemeToggle.tsx\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01MzT37FQuvWaiZca4q7E23e" name="code--view" integration-id="code" data="{\"file_path\": \"src/App.tsx\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01U6QLLeCSKngv8kiUqnNsGG" name="code--search_files" integration-id="code" data="{\"query\": \"ThemeProvider|next-themes|useTheme|ThemeToggle\", \"include_patterns\": \"*.tsx,*.ts\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_019TyuueMNLaGocTBz2JZs95" name="code--search_files" integration-id="code" data="{\"query\": \"\\\\.dark\\\\s*\\\\{|^\\\\s*dark:\", \"include_patterns\": \"*.css\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01JNhskiwZJHQMVoqbxpMk2H" name="code--view" integration-id="code" data="{\"file_path\": \"src/index.css\", \"lines\": \"40-100\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_011Kf8N58oAQMtPeVjXmQaze" name="code--view" integration-id="code" data="{\"file_path\": \"src/components/DashboardHeader.tsx\"}">
</lov-tool-use>
<lov-plan>

# Rimozione tema scuro + ottimizzazione mobile

## 1. Rimuovere il tema scuro ovunque

**File da modificare:**

- **`src/components/Navbar.tsx`** — rimuovo import e usi di `ThemeToggle` (sia desktop che mobile)
- **`src/components/DashboardHeader.tsx`** — rimuovo import e uso di `ThemeToggle`
- **`src/components/ThemeToggle.tsx`** — elimino il file
- **`src/index.css`** — elimino il blocco `.dark { ... }` (righe 55-100)
- Lascio `next-themes` in `sonner.tsx` (default light, nessun toggle)

Verifico che non ci siano residui `dark:` nelle classi Tailwind (search ha trovato 0 match in tsx/ts) e che nessun componente forzi `.dark` sul `<html>`.

## 2. Ottimizzazione mobile completa

Il sito ha breakpoint corretti ma alcune sezioni soffrono su mobile. Sistemo i punti critici trovati nei file principali:

**a. Navbar (`Navbar.tsx`)**
- Logo `h-14` → `h-10 md:h-14` (occupa meno header su mobile)
- Header `h-20` → `h-16 md:h-20`
- Tasto hamburger con padding tap-target ≥44px

**b. Hero sezioni** (`HeroSection`, `Vantaggi`, `Servizi`, `Community`)
- Titoli `text-4xl md:text-6xl lg:text-7xl` → ridotti a `text-3xl sm:text-4xl md:text-6xl` per evitare overflow
- Padding hero `py-20` → `py-12 md:py-20`
- Mini-stat grid: passa da 3 colonne fisse a `grid-cols-3 gap-2` con font ridotti su mobile (i counter `text-3xl md:text-4xl` → `text-2xl sm:text-3xl md:text-4xl`)
- Bottoni CTA: `w-full sm:w-auto` su mobile per tap-target più ampio

**c. Container/spacing globale**
- `container` ha già padding ma alcune sezioni usano `py-20` → standardizzo a `py-12 md:py-20`
- Sezioni con `gap-8` su grid → `gap-4 md:gap-8`

**d. Tabelle (Vantaggi comparison, AdminCamere)**
- Wrapper `overflow-x-auto` sulla tabella confronto in `Vantaggi.tsx`
- Card admin: griglia da 1 colonna su mobile, evito hover-only actions (mostro azioni sempre visibili sotto le card su mobile)

**e. Galleria masonry (`Community.tsx`)**
- Auto-rows `140px` su mobile è OK; verifico che `grid-cols-2` non sfori

**f. Form/Dialog (`AdminCamere.tsx`)**
- Dialog `max-w-3xl` → su mobile usa `w-[95vw]` e tabs con icona sola
- Tabs interne: testi corti su mobile (icona + label nascosta `<span className="hidden sm:inline">`)

**g. Footer + WhatsApp button**
- Verifico WhatsApp button non copra contenuti mobile (z-index e position OK)

**h. Sezioni home** (`ProblemSection`, `ServicesSection`, `RoomsPreview`, `HowItWorksSection`, `GuaranteeSection`, `TestimonialsSection`, `CommunitySection`, `UrgencySection`, `AboutSection`, `MapSection`)
- Pass mirato: ridurre `text-4xl md:text-5xl` a `text-3xl sm:text-4xl md:text-5xl` su tutti gli h2
- Spacing verticale ridotto su mobile
- Card grids con `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` (alcuni hanno `md:` invece di `sm:`)

## File modificati

1. `src/components/ThemeToggle.tsx` — **eliminato** (svuotato/rimosso)
2. `src/components/Navbar.tsx` — rimuovo ThemeToggle, ottimizzo mobile
3. `src/components/DashboardHeader.tsx` — rimuovo ThemeToggle
4. `src/index.css` — rimuovo blocco `.dark`
5. `src/components/home/HeroSection.tsx` — mobile tuning
6. `src/components/home/ProblemSection.tsx` — mobile tuning
7. `src/components/home/ServicesSection.tsx` — mobile tuning
8. `src/components/home/RoomsPreview.tsx` — mobile tuning
9. `src/components/home/HowItWorksSection.tsx` — mobile tuning
10. `src/components/home/GuaranteeSection.tsx` — mobile tuning
11. `src/components/home/TestimonialsSection.tsx` — mobile tuning
12. `src/components/home/CommunitySection.tsx` — mobile tuning
13. `src/components/home/UrgencySection.tsx` — mobile tuning
14. `src/components/home/AboutSection.tsx` — mobile tuning
15. `src/components/home/MapSection.tsx` — mobile tuning
16. `src/pages/Vantaggi.tsx` — hero/stat/tabella mobile
17. `src/pages/Servizi.tsx` — hero/highlights bar mobile
18. `src/pages/Community.tsx` — hero/galleria mobile
19. `src/pages/Camere.tsx` — grid/filtri mobile
20. `src/pages/CameraDettaglio.tsx` — tabs/galleria mobile
21. `src/pages/Contatti.tsx` — form mobile
22. `src/pages/admin/AdminCamere.tsx` — dialog mobile, card actions sempre visibili

Niente nuove dipendenze. Tocco solo classi Tailwind e rimozione codice tema.

