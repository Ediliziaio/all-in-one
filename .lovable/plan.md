

## Obiettivo
Dare più colore ad alcune sezioni della home prendendo ispirazione dai 4 colori del logo Google-style già definiti come token: `--google-blue`, `--google-red`, `--google-yellow`, `--google-green` (oltre al navy primary e al verde accent del brand).

## Esplorazione fatta
Ho controllato:
- `src/index.css` → token `--google-*` già pronti (blu/rosso/giallo/verde) + `--primary` navy + `--accent` verde
- `src/pages/Index.tsx` → ordine sezioni home
- Sezioni attuali: la maggior parte sono bianche o `bg-muted/30`, molto neutre. Solo `Hero` e `Urgency` hanno carattere cromatico.

## Cosa cambio (sezione per sezione)

Alterno background colorati in modo armonico, evitando muri di colore: uso tinte morbide del logo + accenti pieni dove serve enfasi.

1. **ProblemSection** → background `bg-[hsl(var(--google-red))]/5` con bordo/icone in rosso Google. Comunica "problema/dolore".
2. **ServicesSection** → background `bg-[hsl(var(--google-blue))]/5`, icone servizi colorate ciclicamente con i 4 colori del logo (blu, rosso, giallo, verde) per richiamare il branding.
3. **RoomsPreview** → resta bianca (le foto camere parlano da sole), ma badge prezzo/CTA in `--google-blue`.
4. **HowItWorksSection** → background `bg-[hsl(var(--google-yellow))]/8` con i numeri step colorati a rotazione (blu→rosso→giallo→verde).
5. **GuaranteeSection** → background `bg-[hsl(var(--google-green))]/8` (verde = fiducia/garanzia), icone scudo in verde Google.
6. **TestimonialsSection** → resta neutra `bg-muted/30`, ma stelle in `--google-yellow` piene e avatar con bordo colorato a rotazione.
7. **CommunitySection** → gradient morbido `from-[hsl(var(--google-blue))]/8 to-[hsl(var(--google-red))]/8` per dare energia "social".
8. **UrgencySection** → mantengo enfasi forte ma sposto verso `--google-red` pieno con testo bianco (oggi è generica).
9. **AboutSection** → numeri stat colorati a rotazione coi 4 colori del logo invece che tutti accent.
10. **MapSection** → resta pulita, header con underline `--google-blue`.

**Hero, ProblemSection (struttura), Footer** → invariati nella struttura.

## Regole
- Uso SOLO token semantici/hsl var (no hex hardcoded), come da memoria progetto.
- Tinte sfondo sempre `/5` `/8` `/10` per restare leggibili.
- Niente testo colorato su sfondo colorato della stessa famiglia (contrasto AA).
- Dark mode: i token sono già definiti, restano coerenti.

## File modificati
- `src/components/home/ProblemSection.tsx`
- `src/components/home/ServicesSection.tsx`
- `src/components/home/HowItWorksSection.tsx`
- `src/components/home/GuaranteeSection.tsx`
- `src/components/home/TestimonialsSection.tsx`
- `src/components/home/CommunitySection.tsx`
- `src/components/home/UrgencySection.tsx`
- `src/components/home/AboutSection.tsx`
- `src/components/home/MapSection.tsx`
- `src/components/home/RoomsPreview.tsx`

Nessuna modifica a `index.css` (token già pronti), nessuna nuova dipendenza.

