

# Pagina Admin Contratti

## Cosa aggiungo

Una nuova pagina **"Contratti"** nell'area admin per gestire i contratti di affitto firmati dopo l'approvazione delle richieste.

## Dati mock

Nuovo tipo `Contratto` in `mockData.ts` con campi: id, richiesta_id, student_nome, camera_nome, data_inizio, data_fine, canone_mensile, stato (`attivo` | `in_scadenza` | `scaduto` | `disdetto`), data_firma, documento_url. Aggiungo 3-4 contratti mock collegati alle richieste approvate.

## Pagina AdminContratti.tsx

- Header "Contratti di Affitto"
- Tab: Attivi, In Scadenza, Scaduti, Disdetti
- Tabella con: studente, camera, periodo, canone, stato (badge colorato), azioni
- Dialog dettaglio contratto con tutti i campi + pulsante "Scarica Contratto" (mock)
- Stile identico a AdminPrenotazioni (Card, Badge, PageTransition/FadeIn)

## Navigazione

- `AdminLayout.tsx`: nuova voce "Contratti" con icona `FileSignature` tra "Richieste" e "Studenti"
- `App.tsx`: nuova route `/admin/contratti` → `AdminContratti`

## File modificati (4)
1. `src/data/mockData.ts` — tipo `Contratto` + `mockContratti`
2. `src/pages/admin/AdminContratti.tsx` — nuova pagina
3. `src/layouts/AdminLayout.tsx` — voce menu
4. `src/App.tsx` — route

