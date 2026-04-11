

# Login Demo — Credenziali preimpostate

## Cosa aggiungo

Sotto il form di login, inserisco una sezione "Account Demo" con due pulsanti rapidi che compilano automaticamente email e password:

1. **Studente**: `studente@demo.it` / `demo1234` → porta a `/studente`
2. **Admin**: `admin@demo.it` / `demo1234` → porta a `/admin`

Cliccando su uno dei due, i campi si compilano automaticamente. L'utente deve solo premere "Accedi".

Aggiungo anche la validazione: se email/password non corrispondono a nessun account demo, mostra un toast di errore.

## File modificati (1)

- `src/pages/auth/LoginPage.tsx` — sezione "Account Demo" con 2 bottoni quick-fill + validazione credenziali mock

