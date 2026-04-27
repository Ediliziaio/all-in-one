-- ============================================================
-- Studentato Napoleone — Schema Supabase
-- Eseguire nel SQL Editor: https://supabase.com/dashboard/project/tlunzjhnucmcgjyutcnx/sql
-- ============================================================

-- Abilita UUID
create extension if not exists "pgcrypto";

-- ============================================================
-- 1. PROFILES (estende auth.users)
-- ============================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  nome        text not null default '',
  cognome     text not null default '',
  email       text not null default '',
  corso       text,
  anno        integer,
  avatar      text,
  bio         text,
  interessi   text[] default '{}',
  instagram   text,
  role        text not null default 'student' check (role in ('student', 'admin')),
  piano       integer,
  camera_id   text,
  created_at  timestamptz not null default now()
);

-- Trigger: crea il profilo automaticamente ad ogni signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, nome, cognome, email, corso, anno, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', ''),
    coalesce(new.raw_user_meta_data->>'cognome', ''),
    new.email,
    new.raw_user_meta_data->>'corso',
    (new.raw_user_meta_data->>'anno')::integer,
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 2. ROOMS (camere)
-- ============================================================
create table if not exists public.rooms (
  id             text primary key,
  name           text not null,
  type           text not null check (type in ('singola', 'singola-plus', 'doppia')),
  price          integer not null,
  floor          integer not null,
  sqm            integer not null,
  available      boolean not null default true,
  available_from date not null,
  description    text not null default '',
  features       text[] default '{}',
  images         text[] default '{}',
  created_at     timestamptz not null default now()
);

-- Dati iniziali camere (da rooms.ts)
insert into public.rooms (id, name, type, price, floor, sqm, available, available_from, description, features)
values
  ('singola-101',  'Singola Standard 101', 'singola',      480, 1, 14, true,  '2025-09-01', 'Camera singola luminosa con scrivania ampia, armadio a muro e bagno privato.', array['Bagno privato','Scrivania','Armadio','WiFi Fibra','Aria condizionata']),
  ('singola-205',  'Singola Standard 205', 'singola',      480, 2, 15, true,  '2025-09-01', 'Camera singola al secondo piano con vista sul cortile interno.',                array['Bagno privato','Scrivania','Armadio','WiFi Fibra','Vista cortile']),
  ('singola-plus-102', 'Singola Plus 102', 'singola-plus', 580, 1, 20, true,  '2025-09-01', 'Camera singola premium con zona living separata e bagno privato.',             array['Bagno privato','Angolo cottura','Zona living','WiFi Fibra','Smart TV','Aria condizionata']),
  ('singola-plus-301', 'Singola Plus 301', 'singola-plus', 580, 3, 22, false, '2026-01-01', 'La nostra camera più spaziosa al terzo piano. Vista panoramica.',              array['Bagno privato','Angolo cottura','Zona studio','WiFi Fibra','Smart TV','Balcone']),
  ('doppia-103',   'Doppia 103',          'doppia',        380, 1, 24, true,  '2025-09-01', 'Camera doppia con due letti singoli e bagno condiviso.',                       array['Bagno condiviso','2 Scrivanie','2 Armadi','WiFi Fibra','Aria condizionata']),
  ('doppia-204',   'Doppia 204',          'doppia',        380, 2, 26, true,  '2025-10-01', 'Camera doppia al secondo piano, ampia e luminosa.',                            array['Bagno condiviso','2 Scrivanie','2 Armadi','WiFi Fibra','Vista giardino'])
on conflict (id) do nothing;

-- ============================================================
-- 3. RICHIESTE AFFITTO (CRM pipeline)
-- ============================================================
create table if not exists public.richieste_affitto (
  id                  uuid primary key default gen_random_uuid(),
  camera_id           text references public.rooms(id),
  camera_nome         text not null default '',
  student_id          uuid references public.profiles(id),
  student_nome        text not null default '',
  data_inizio         date not null,
  data_fine           date not null,
  stato               text not null default 'pending' check (stato in ('pending','approvata','rifiutata','conclusa')),
  pipeline_stato      text not null default 'nuovo' check (pipeline_stato in ('nuovo','contattato','visita_programmata','proposta_inviata','contratto_firmato','perso')),
  note                text,
  telefono            text not null default '',
  email               text not null default '',
  eta                 integer,
  corso_universita    text,
  citta_provenienza   text,
  fonte               text not null default 'sito' check (fonte in ('sito','instagram','passaparola','google','fiera','altro')),
  budget_max          integer,
  data_visita         date,
  operatore_assegnato text,
  priorita            text not null default 'media' check (priorita in ('bassa','media','alta')),
  prossimo_followup   date,
  motivo_perdita      text,
  attivita            jsonb not null default '[]',
  created_at          timestamptz not null default now()
);

-- ============================================================
-- 4. SUPPORT TICKETS
-- ============================================================
create table if not exists public.support_tickets (
  id                  uuid primary key default gen_random_uuid(),
  student_id          uuid not null references public.profiles(id),
  student_nome        text not null default '',
  titolo              text not null,
  descrizione         text not null default '',
  categoria           text not null default 'altro' check (categoria in ('manutenzione','wifi','pulizie','altro')),
  priorita            text not null default 'normale' check (priorita in ('bassa','normale','alta','urgente')),
  stato               text not null default 'aperto' check (stato in ('aperto','in_corso','attesa_studente','risolto')),
  risposta_admin      text,
  messages            jsonb not null default '[]',
  activity            jsonb not null default '[]',
  assigned_to         text,
  unread_for_admin    boolean not null default true,
  unread_for_student  boolean not null default false,
  rating              integer,
  closed_at           timestamptz,
  updated_at          timestamptz not null default now(),
  created_at          timestamptz not null default now()
);

-- ============================================================
-- 5. COMMUNITY POSTS
-- ============================================================
create table if not exists public.community_posts (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid not null references public.profiles(id) on delete cascade,
  titolo      text,
  contenuto   text not null,
  tipo        text not null default 'post' check (tipo in ('post','evento','annuncio','cercasi')),
  likes       integer not null default 0,
  data_evento date,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- 6. GUIDE
-- ============================================================
create table if not exists public.guide (
  id         uuid primary key default gen_random_uuid(),
  titolo     text not null,
  contenuto  text not null default '',
  categoria  text not null check (categoria in ('Burocrazia','Università','Vita in Città','Risparmio','Trasporti')),
  icona      text not null default '📄',
  attiva     boolean not null default true,
  ordine     integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 7. BUONI SCONTO
-- ============================================================
create table if not exists public.buoni (
  id             uuid primary key default gen_random_uuid(),
  codice         text not null,
  nome_esercizio text not null,
  descrizione    text not null default '',
  sconto         text not null,
  categoria      text not null check (categoria in ('Cibo','Sport','Libri','Divertimento','Servizi')),
  logo_url       text not null default '',
  scadenza       date not null,
  attivo         boolean not null default true,
  nuovo          boolean not null default false,
  created_at     timestamptz not null default now()
);

-- ============================================================
-- 8. NOTIFICATIONS
-- ============================================================
create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  titolo     text not null,
  messaggio  text not null,
  tipo       text not null default 'sistema' check (tipo in ('richiesta','supporto','buono','sistema')),
  letta      boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 9. DOCUMENTI
-- ============================================================
create table if not exists public.documenti (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references public.profiles(id) on delete cascade,
  nome        text not null,
  tipo        text not null check (tipo in ('contratto','ricevuta','documento')),
  data        date not null,
  dimensione  text not null default '',
  url         text not null default '',
  created_at  timestamptz not null default now()
);

-- ============================================================
-- 10. PAGAMENTI
-- ============================================================
create table if not exists public.pagamenti (
  id              uuid primary key default gen_random_uuid(),
  student_id      uuid not null references public.profiles(id) on delete cascade,
  mese            text not null,
  importo         integer not null,
  stato           text not null check (stato in ('pagato','in_scadenza','scaduto')),
  data_scadenza   date not null,
  data_pagamento  date,
  metodo          text,
  created_at      timestamptz not null default now()
);

-- ============================================================
-- 11. CONTRATTI
-- ============================================================
create table if not exists public.contratti (
  id              uuid primary key default gen_random_uuid(),
  richiesta_id    uuid references public.richieste_affitto(id),
  student_id      uuid not null references public.profiles(id),
  student_nome    text not null default '',
  camera_nome     text not null default '',
  data_inizio     date not null,
  data_fine       date not null,
  canone_mensile  integer not null,
  stato           text not null check (stato in ('attivo','in_scadenza','scaduto','disdetto')),
  data_firma      date not null,
  documento_url   text not null default '',
  created_at      timestamptz not null default now()
);

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================

-- Abilita RLS su tutte le tabelle
alter table public.profiles          enable row level security;
alter table public.rooms             enable row level security;
alter table public.richieste_affitto enable row level security;
alter table public.support_tickets   enable row level security;
alter table public.community_posts   enable row level security;
alter table public.guide             enable row level security;
alter table public.buoni             enable row level security;
alter table public.notifications     enable row level security;
alter table public.documenti         enable row level security;
alter table public.pagamenti         enable row level security;
alter table public.contratti         enable row level security;

-- Helper: controlla se l'utente è admin
create or replace function public.is_admin()
returns boolean language sql security definer as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- PROFILES
create policy "Utente vede il proprio profilo"      on public.profiles for select using (id = auth.uid());
create policy "Utente aggiorna il proprio profilo"  on public.profiles for update using (id = auth.uid());
create policy "Admin vede tutti i profili"          on public.profiles for select using (public.is_admin());
create policy "Admin aggiorna tutti i profili"      on public.profiles for update using (public.is_admin());

-- ROOMS (pubbliche in lettura)
create policy "Tutti leggono le camere"             on public.rooms for select using (true);
create policy "Solo admin modifica le camere"       on public.rooms for all using (public.is_admin());

-- RICHIESTE AFFITTO
create policy "Studente vede le proprie richieste"  on public.richieste_affitto for select using (student_id = auth.uid());
create policy "Studente crea richieste"             on public.richieste_affitto for insert with check (student_id = auth.uid());
create policy "Admin gestisce tutte le richieste"   on public.richieste_affitto for all using (public.is_admin());

-- SUPPORT TICKETS
create policy "Studente vede i propri ticket"       on public.support_tickets for select using (student_id = auth.uid());
create policy "Studente crea ticket"                on public.support_tickets for insert with check (student_id = auth.uid());
create policy "Studente aggiorna i propri ticket"   on public.support_tickets for update using (student_id = auth.uid());
create policy "Admin gestisce tutti i ticket"       on public.support_tickets for all using (public.is_admin());

-- COMMUNITY POSTS (visibili a tutti gli autenticati)
create policy "Autenticati leggono i post"          on public.community_posts for select using (auth.uid() is not null);
create policy "Autenticati creano post"             on public.community_posts for insert with check (author_id = auth.uid());
create policy "Autore aggiorna il proprio post"     on public.community_posts for update using (author_id = auth.uid());
create policy "Admin gestisce i post"               on public.community_posts for all using (public.is_admin());

-- GUIDE (visibili a tutti gli autenticati)
create policy "Autenticati leggono le guide"        on public.guide for select using (auth.uid() is not null);
create policy "Admin gestisce le guide"             on public.guide for all using (public.is_admin());

-- BUONI (visibili a tutti gli autenticati)
create policy "Autenticati leggono i buoni"         on public.buoni for select using (auth.uid() is not null);
create policy "Admin gestisce i buoni"              on public.buoni for all using (public.is_admin());

-- NOTIFICATIONS
create policy "Utente vede le proprie notifiche"    on public.notifications for select using (user_id = auth.uid());
create policy "Utente aggiorna le proprie notifiche" on public.notifications for update using (user_id = auth.uid());
create policy "Admin crea notifiche"                on public.notifications for insert with check (public.is_admin());
create policy "Admin vede tutte le notifiche"       on public.notifications for select using (public.is_admin());

-- DOCUMENTI
create policy "Studente vede i propri documenti"    on public.documenti for select using (student_id = auth.uid());
create policy "Admin gestisce i documenti"          on public.documenti for all using (public.is_admin());

-- PAGAMENTI
create policy "Studente vede i propri pagamenti"    on public.pagamenti for select using (student_id = auth.uid());
create policy "Admin gestisce i pagamenti"          on public.pagamenti for all using (public.is_admin());

-- CONTRATTI
create policy "Studente vede i propri contratti"    on public.contratti for select using (student_id = auth.uid());
create policy "Admin gestisce i contratti"          on public.contratti for all using (public.is_admin());
