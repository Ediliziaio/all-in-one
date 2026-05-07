// Mock data for admin & student areas (no backend)

export type StudenteStato =
  | "attivo"        // in residence attiva
  | "in_uscita"     // contratto in scadenza entro 60gg
  | "ex_studente"   // ha lasciato lo studentato
  | "sospeso";      // sospeso temporaneamente

export type MotivoUscita =
  | "laurea"
  | "trasferimento"
  | "fine_anno"
  | "disdetta_anticipata"
  | "mancato_pagamento"
  | "altro";

export interface Profile {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  corso: string;
  anno: number;
  avatar: string;
  bio: string;
  interessi: string[];
  instagram?: string;
  role: "student" | "admin";
  piano?: number;
  camera_id?: string;
  student_stato?: StudenteStato;
  data_ingresso?: string;    // ISO date
  data_uscita?: string;      // ISO date (quando ha lasciato)
  motivo_uscita?: MotivoUscita;
  note_interne?: string;
  telefono?: string;
}

export type LeadStato =
  | "nuovo"
  | "contattato"
  | "visita_programmata"
  | "proposta_inviata"
  | "contratto_firmato"
  | "perso";

export type LeadFonte = "sito" | "instagram" | "passaparola" | "google" | "fiera" | "altro";
export type LeadPriorita = "bassa" | "media" | "alta";

export interface Activity {
  id: string;
  tipo: "nota" | "chiamata" | "email" | "visita" | "cambio_stato";
  testo: string;
  autore: string;
  createdAt: string;
}

export interface RichiestaAffitto {
  id: string;
  camera_id: string;
  camera_nome: string;
  student_id: string;
  student_nome: string;
  data_inizio: string;
  data_fine: string;
  // Legacy stato (kept for compat with other pages)
  stato: "pending" | "approvata" | "rifiutata" | "conclusa";
  // CRM pipeline stato
  pipeline_stato: LeadStato;
  note?: string;
  created_at: string;
  // Contatto
  telefono: string;
  email: string;
  eta?: number;
  corso_universita?: string;
  citta_provenienza?: string;
  // Lead
  fonte: LeadFonte;
  budget_max?: number;
  data_visita?: string;
  // Gestione
  operatore_assegnato?: string;
  priorita: LeadPriorita;
  prossimo_followup?: string;
  motivo_perdita?: string;
  // Storico
  attivita: Activity[];
}

// Backward-compatible alias
export type Prenotazione = RichiestaAffitto;

export interface TicketMessage {
  id: string;
  author: "studente" | "admin";
  authorName: string;
  text: string;
  createdAt: string;
}

export interface TicketActivity {
  id: string;
  tipo: "creazione" | "cambio_stato" | "assegnazione" | "cambio_priorita" | "chiusura";
  testo: string;
  autore: string;
  createdAt: string;
  meta?: { from?: string; to?: string };
}

export interface SupportTicket {
  id: string;
  student_id: string;
  student_nome: string;
  titolo: string;
  descrizione: string;
  categoria: "manutenzione" | "wifi" | "pulizie" | "altro";
  priorita: "bassa" | "normale" | "alta" | "urgente";
  stato: "aperto" | "in_corso" | "attesa_studente" | "risolto";
  risposta_admin?: string;
  created_at: string;
  messages: TicketMessage[];
  activity?: TicketActivity[];
  assignedTo?: string;
  unreadForAdmin?: boolean;
  unreadForStudent?: boolean;
  rating?: number;
  closedAt?: string;
  updatedAt?: string;
}

export interface CommunityPost {
  id: string;
  author: Profile;
  titolo?: string;
  contenuto: string;
  tipo: "post" | "evento" | "annuncio" | "cercasi";
  likes: number;
  created_at: string;
  data_evento?: string;
}

export interface Guida {
  id: string;
  titolo: string;
  contenuto: string;
  categoria: "Burocrazia" | "Università" | "Vita in Città" | "Risparmio" | "Trasporti";
  icona: string;
  attiva: boolean;
}

export interface Buono {
  id: string;
  codice: string;
  nome_esercizio: string;
  descrizione: string;
  sconto: string;
  categoria: "Cibo" | "Sport" | "Libri" | "Divertimento" | "Servizi";
  logo_url: string;
  scadenza: string;
  attivo: boolean;
  nuovo?: boolean;
}

export interface Notification {
  id: string;
  titolo: string;
  messaggio: string;
  tipo: "richiesta" | "supporto" | "buono" | "sistema";
  letta: boolean;
  created_at: string;
}

export interface Documento {
  id: string;
  nome: string;
  tipo: "contratto" | "ricevuta" | "documento";
  data: string;
  dimensione: string;
  url: string;
}

export interface Pagamento {
  id: string;
  contratto_id?: string;
  mese: string;
  importo: number;
  stato: "pagato" | "in_scadenza" | "scaduto";
  data_scadenza: string;
  data_pagamento?: string;
  metodo?: string;
}

// --- PROFILES ---
export const mockProfiles: Profile[] = [
  {
    id: "p1",
    nome: "Marco",
    cognome: "Rossi",
    email: "marco.rossi@studenti.unipd.it",
    corso: "Ingegneria Informatica",
    anno: 2,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    bio: "Appassionato di coding e basket. Cerco sempre nuovi amici per studiare insieme!",
    interessi: ["Coding", "Basket", "Viaggi"],
    instagram: "@marco.rossi",
    role: "student",
    piano: 1,
    camera_id: "singola-101",
    student_stato: "attivo",
    data_ingresso: "2025-09-01",
    telefono: "+39 333 1234567",
  },
  {
    id: "p2",
    nome: "Sara",
    cognome: "Bianchi",
    email: "sara.bianchi@studenti.unipd.it",
    corso: "Medicina",
    anno: 3,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    bio: "Futura dottoressa 🩺 Amo il caffè e le passeggiate al Prato della Valle.",
    interessi: ["Medicina", "Yoga", "Caffè"],
    instagram: "@sara.bian",
    role: "student",
    piano: 2,
    camera_id: "singola-205",
    student_stato: "attivo",
    data_ingresso: "2025-09-01",
    telefono: "+39 347 9876543",
  },
  {
    id: "p3",
    nome: "Luca",
    cognome: "Verdi",
    email: "luca.verdi@studenti.unipd.it",
    corso: "Economia",
    anno: 1,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    bio: "Primo anno a Padova, vengo da Milano. Cerco gente per serate e sport!",
    interessi: ["Calcio", "Musica", "Cinema"],
    role: "student",
    piano: 1,
    camera_id: "doppia-103",
    student_stato: "in_uscita",
    data_ingresso: "2025-09-01",
    telefono: "+39 380 5551234",
  },
  {
    id: "p4",
    nome: "Giulia",
    cognome: "Ferrari",
    email: "giulia.ferrari@studenti.unipd.it",
    corso: "Giurisprudenza",
    anno: 4,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    bio: "Ultimo anno di legge! Amo leggere, correre e organizzare eventi.",
    interessi: ["Lettura", "Running", "Diritto"],
    role: "student",
    piano: 3,
    camera_id: "singola-plus-301",
    student_stato: "attivo",
    data_ingresso: "2024-10-01",
    telefono: "+39 333 7778899",
  },
  {
    id: "admin1",
    nome: "Admin",
    cognome: "StudentatoPD",
    email: "admin@studentatopd.it",
    corso: "",
    anno: 0,
    avatar: "",
    bio: "",
    interessi: [],
    role: "admin",
  },
  {
    id: "p5",
    nome: "Alessandro",
    cognome: "Martini",
    email: "ale.martini@studenti.unipd.it",
    corso: "Fisica",
    anno: 3,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    bio: "",
    interessi: ["Fisica", "Musica"],
    role: "student" as const,
    student_stato: "ex_studente" as const,
    data_ingresso: "2024-09-01",
    data_uscita: "2025-07-31",
    motivo_uscita: "laurea" as const,
    note_interne: "Studente modello, pagamenti sempre puntuali. Ha lasciato per laurea triennale.",
  },
  {
    id: "p6",
    nome: "Chiara",
    cognome: "Romano",
    email: "chiara.romano@studenti.unipd.it",
    corso: "Psicologia",
    anno: 2,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
    bio: "",
    interessi: ["Psicologia", "Arte"],
    role: "student" as const,
    student_stato: "ex_studente" as const,
    data_ingresso: "2025-01-15",
    data_uscita: "2025-06-30",
    motivo_uscita: "trasferimento" as const,
    note_interne: "Si è trasferita a Bologna per il corso magistrale.",
  },
];

// --- RICHIESTE DI AFFITTO ---
export const mockRichieste: RichiestaAffitto[] = [
  {
    id: "pren1",
    camera_id: "singola-101",
    camera_nome: "Singola Standard 101",
    student_id: "p1",
    student_nome: "Marco Rossi",
    data_inizio: "2025-09-01",
    data_fine: "2026-07-31",
    stato: "approvata",
    pipeline_stato: "contratto_firmato",
    created_at: "2025-05-15",
    telefono: "+39 333 1234567",
    email: "marco.rossi@studenti.unipd.it",
    eta: 21,
    corso_universita: "Ingegneria Informatica",
    citta_provenienza: "Verona",
    fonte: "sito",
    budget_max: 550,
    operatore_assegnato: "Giulia Marchetti",
    priorita: "alta",
    attivita: [
      { id: "a1", tipo: "cambio_stato", testo: "Lead creato dal sito", autore: "Sistema", createdAt: "2025-05-15T09:00:00" },
      { id: "a2", tipo: "chiamata", testo: "Prima chiamata: molto interessato, lavora già a Padova", autore: "Giulia Marchetti", createdAt: "2025-05-16T11:30:00" },
      { id: "a3", tipo: "visita", testo: "Visita effettuata, gli è piaciuta la 101", autore: "Giulia Marchetti", createdAt: "2025-05-22T15:00:00" },
      { id: "a4", tipo: "cambio_stato", testo: "Contratto firmato 🎉", autore: "Giulia Marchetti", createdAt: "2025-07-15T10:00:00" },
    ],
  },
  {
    id: "pren2",
    camera_id: "singola-205",
    camera_nome: "Singola Standard 205",
    student_id: "p2",
    student_nome: "Sara Bianchi",
    data_inizio: "2025-09-01",
    data_fine: "2026-07-31",
    stato: "approvata",
    pipeline_stato: "contratto_firmato",
    created_at: "2025-05-20",
    telefono: "+39 347 9876543",
    email: "sara.bianchi@studenti.unipd.it",
    eta: 23,
    corso_universita: "Medicina",
    citta_provenienza: "Bologna",
    fonte: "instagram",
    budget_max: 520,
    operatore_assegnato: "Federico Bianchi",
    priorita: "media",
    attivita: [
      { id: "a5", tipo: "cambio_stato", testo: "Lead da campagna Instagram", autore: "Sistema", createdAt: "2025-05-20T14:00:00" },
      { id: "a6", tipo: "email", testo: "Inviato listino e foto camere", autore: "Federico Bianchi", createdAt: "2025-05-21T09:15:00" },
      { id: "a7", tipo: "cambio_stato", testo: "Contratto firmato", autore: "Federico Bianchi", createdAt: "2025-07-20T16:00:00" },
    ],
  },
  {
    id: "pren3",
    camera_id: "doppia-103",
    camera_nome: "Doppia 103",
    student_id: "p3",
    student_nome: "Luca Verdi",
    data_inizio: "2025-09-01",
    data_fine: "2026-07-31",
    stato: "pending",
    pipeline_stato: "proposta_inviata",
    note: "Vorrei la camera con il mio amico Andrea",
    created_at: "2025-06-01",
    telefono: "+39 320 5551234",
    email: "luca.verdi@studenti.unipd.it",
    eta: 19,
    corso_universita: "Economia",
    citta_provenienza: "Milano",
    fonte: "passaparola",
    budget_max: 400,
    operatore_assegnato: "Sara Lombardi",
    priorita: "alta",
    prossimo_followup: "2025-06-18",
    attivita: [
      { id: "a8", tipo: "cambio_stato", testo: "Lead da passaparola (referral di Marco Rossi)", autore: "Sistema", createdAt: "2025-06-01T10:00:00" },
      { id: "a9", tipo: "chiamata", testo: "Chiamata fatta, vuole condividere doppia con amico", autore: "Sara Lombardi", createdAt: "2025-06-02T11:00:00" },
      { id: "a10", tipo: "email", testo: "Inviata proposta per Doppia 103 a 380€/mese cad.", autore: "Sara Lombardi", createdAt: "2025-06-05T14:30:00" },
    ],
  },
  {
    id: "pren4",
    camera_id: "singola-plus-102",
    camera_nome: "Singola Plus 102",
    student_id: "p4",
    student_nome: "Giulia Ferrari",
    data_inizio: "2025-10-01",
    data_fine: "2026-07-31",
    stato: "pending",
    pipeline_stato: "visita_programmata",
    created_at: "2025-06-10",
    telefono: "+39 388 1112233",
    email: "giulia.ferrari@studenti.unipd.it",
    eta: 24,
    corso_universita: "Giurisprudenza",
    citta_provenienza: "Trieste",
    fonte: "google",
    budget_max: 600,
    operatore_assegnato: "Giulia Marchetti",
    priorita: "media",
    data_visita: "2025-06-20",
    prossimo_followup: "2025-06-20",
    attivita: [
      { id: "a11", tipo: "cambio_stato", testo: "Lead da Google Ads", autore: "Sistema", createdAt: "2025-06-10T08:30:00" },
      { id: "a12", tipo: "chiamata", testo: "Molto interessata alla Plus, vuole vedere la stanza", autore: "Giulia Marchetti", createdAt: "2025-06-11T10:00:00" },
      { id: "a13", tipo: "nota", testo: "Visita programmata per il 20 giugno alle 16:00", autore: "Giulia Marchetti", createdAt: "2025-06-12T09:00:00" },
    ],
  },
  {
    id: "pren5",
    camera_id: "singola-204",
    camera_nome: "Singola Standard 204",
    student_id: "p5",
    student_nome: "Elena Conti",
    data_inizio: "2025-09-15",
    data_fine: "2026-07-31",
    stato: "pending",
    pipeline_stato: "contattato",
    created_at: "2025-06-12",
    telefono: "+39 333 4445566",
    email: "elena.conti@gmail.com",
    eta: 20,
    corso_universita: "Lettere",
    citta_provenienza: "Pescara",
    fonte: "instagram",
    budget_max: 480,
    operatore_assegnato: "Federico Bianchi",
    priorita: "media",
    prossimo_followup: "2025-06-19",
    attivita: [
      { id: "a14", tipo: "cambio_stato", testo: "Lead da Instagram DM", autore: "Sistema", createdAt: "2025-06-12T19:00:00" },
      { id: "a15", tipo: "chiamata", testo: "Risponde, sta ancora valutando altre opzioni", autore: "Federico Bianchi", createdAt: "2025-06-13T15:00:00" },
    ],
  },
  {
    id: "pren6",
    camera_id: "doppia-201",
    camera_nome: "Doppia 201",
    student_id: "p6",
    student_nome: "Tommaso Greco",
    data_inizio: "2025-09-01",
    data_fine: "2026-07-31",
    stato: "pending",
    pipeline_stato: "nuovo",
    created_at: "2025-06-14",
    telefono: "+39 340 7778899",
    email: "tommaso.greco@gmail.com",
    eta: 19,
    corso_universita: "Scienze Politiche",
    citta_provenienza: "Bari",
    fonte: "sito",
    budget_max: 400,
    priorita: "media",
    attivita: [
      { id: "a16", tipo: "cambio_stato", testo: "Nuova richiesta dal sito", autore: "Sistema", createdAt: "2025-06-14T22:00:00" },
    ],
  },
  {
    id: "pren7",
    camera_id: "singola-plus-301",
    camera_nome: "Singola Plus 301",
    student_id: "p7",
    student_nome: "Chiara Esposito",
    data_inizio: "2025-09-01",
    data_fine: "2026-07-31",
    stato: "pending",
    pipeline_stato: "nuovo",
    created_at: "2025-06-15",
    telefono: "+39 366 1234500",
    email: "chiara.esposito@gmail.com",
    eta: 22,
    corso_universita: "Architettura",
    citta_provenienza: "Napoli",
    fonte: "fiera",
    budget_max: 620,
    priorita: "alta",
    attivita: [
      { id: "a17", tipo: "cambio_stato", testo: "Lead raccolto a Salone dello Studente Padova", autore: "Sistema", createdAt: "2025-06-15T11:00:00" },
    ],
  },
  {
    id: "pren8",
    camera_id: "singola-103",
    camera_nome: "Singola Standard 103",
    student_id: "p8",
    student_nome: "Davide Russo",
    data_inizio: "2025-09-01",
    data_fine: "2026-07-31",
    stato: "rifiutata",
    pipeline_stato: "perso",
    created_at: "2025-05-25",
    telefono: "+39 351 9990001",
    email: "davide.russo@gmail.com",
    eta: 25,
    corso_universita: "Ingegneria Civile",
    citta_provenienza: "Catania",
    fonte: "google",
    budget_max: 350,
    operatore_assegnato: "Matteo Rinaldi",
    priorita: "bassa",
    motivo_perdita: "Budget non compatibile",
    attivita: [
      { id: "a18", tipo: "cambio_stato", testo: "Lead da Google", autore: "Sistema", createdAt: "2025-05-25T10:00:00" },
      { id: "a19", tipo: "chiamata", testo: "Cercava sotto 350€, fuori range", autore: "Matteo Rinaldi", createdAt: "2025-05-26T14:00:00" },
      { id: "a20", tipo: "cambio_stato", testo: "Marcato come perso: budget non compatibile", autore: "Matteo Rinaldi", createdAt: "2025-05-27T09:00:00" },
    ],
  },
];

// Backward-compatible alias
export const mockPrenotazioni = mockRichieste;

// --- SUPPORT TICKETS ---
// Helper: timestamps relative to "now" so SLA badges stay realistic
const _now = Date.now();
const _hAgo = (h: number) => new Date(_now - h * 3600 * 1000).toISOString();

export const mockTickets: SupportTicket[] = [
  {
    id: "t1",
    student_id: "p1",
    student_nome: "Marco Rossi",
    titolo: "WiFi lento nella stanza 101",
    descrizione: "Da due giorni il WiFi nella mia stanza è molto lento, soprattutto la sera. Non riesco a seguire le lezioni online.",
    categoria: "wifi",
    priorita: "alta",
    stato: "aperto",
    created_at: _hAgo(30),
    updatedAt: _hAgo(30),
    assignedTo: "Giulia Marchetti",
    unreadForAdmin: true,
    messages: [
      {
        id: "m1",
        author: "studente",
        authorName: "Marco Rossi",
        text: "Da due giorni il WiFi nella mia stanza è molto lento, soprattutto la sera. Non riesco a seguire le lezioni online.",
        createdAt: _hAgo(30),
      },
    ],
  },
  {
    id: "t2",
    student_id: "p2",
    student_nome: "Sara Bianchi",
    titolo: "Rubinetto che gocciola",
    descrizione: "Il rubinetto del bagno gocciola continuamente. Oltre al rumore è anche uno spreco d'acqua.",
    categoria: "manutenzione",
    priorita: "normale",
    stato: "in_corso",
    risposta_admin: "Abbiamo programmato l'intervento del tecnico per giovedì mattina.",
    created_at: _hAgo(48),
    updatedAt: _hAgo(1),
    assignedTo: "Federico Bianchi",
    unreadForStudent: true,
    activity: [
      { id: "a2-1", tipo: "assegnazione", testo: "Assegnato a Federico Bianchi", autore: "Sistema", createdAt: _hAgo(40), meta: { to: "Federico Bianchi" } },
      { id: "a2-2", tipo: "cambio_stato", testo: "Stato cambiato in In corso", autore: "Federico Bianchi", createdAt: _hAgo(36), meta: { from: "aperto", to: "in_corso" } },
      { id: "a2-3", tipo: "cambio_priorita", testo: "Priorità cambiata in Normale", autore: "Federico Bianchi", createdAt: _hAgo(36), meta: { from: "bassa", to: "normale" } },
    ],
    messages: [
      {
        id: "m2a",
        author: "studente",
        authorName: "Sara Bianchi",
        text: "Il rubinetto del bagno gocciola continuamente. Oltre al rumore è anche uno spreco d'acqua.",
        createdAt: _hAgo(48),
      },
      {
        id: "m2b",
        author: "admin",
        authorName: "Federico Bianchi",
        text: "Ciao Sara, abbiamo programmato l'intervento del tecnico per giovedì mattina. Ti aggiorniamo appena finito.",
        createdAt: _hAgo(1),
      },
    ],
  },
  {
    id: "t3",
    student_id: "p3",
    student_nome: "Luca Verdi",
    titolo: "Pulizia scale piano terra",
    descrizione: "Le scale del piano terra non vengono pulite da una settimana.",
    categoria: "pulizie",
    priorita: "bassa",
    stato: "risolto",
    risposta_admin: "Ci scusiamo, abbiamo ripristinato il servizio di pulizia regolare.",
    created_at: _hAgo(240),
    updatedAt: _hAgo(192),
    closedAt: _hAgo(192),
    assignedTo: "Sara Lombardi",
    rating: 5,
    activity: [
      { id: "a3-1", tipo: "assegnazione", testo: "Assegnato a Sara Lombardi", autore: "Sistema", createdAt: _hAgo(230), meta: { to: "Sara Lombardi" } },
      { id: "a3-2", tipo: "cambio_stato", testo: "Stato cambiato in In corso", autore: "Sara Lombardi", createdAt: _hAgo(220), meta: { from: "aperto", to: "in_corso" } },
      { id: "a3-3", tipo: "chiusura", testo: "Ticket chiuso come Risolto", autore: "Sara Lombardi", createdAt: _hAgo(192), meta: { from: "in_corso", to: "risolto" } },
    ],
    messages: [
      {
        id: "m3a",
        author: "studente",
        authorName: "Luca Verdi",
        text: "Le scale del piano terra non vengono pulite da una settimana.",
        createdAt: _hAgo(240),
      },
      {
        id: "m3b",
        author: "admin",
        authorName: "Sara Lombardi",
        text: "Ciao Luca, ci scusiamo per il disagio. Abbiamo ripristinato il servizio di pulizia regolare a partire da oggi.",
        createdAt: _hAgo(192),
      },
    ],
  },
  {
    id: "t4",
    student_id: "p2",
    student_nome: "Sara Bianchi",
    titolo: "Richiesta cambio lampadina cucina",
    descrizione: "La lampadina della cucina comune è bruciata.",
    categoria: "manutenzione",
    priorita: "bassa",
    stato: "attesa_studente",
    created_at: _hAgo(20),
    updatedAt: _hAgo(8),
    assignedTo: "Matteo Rinaldi",
    messages: [
      {
        id: "m4a",
        author: "studente",
        authorName: "Sara Bianchi",
        text: "La lampadina della cucina comune al primo piano è bruciata da ieri.",
        createdAt: _hAgo(20),
      },
      {
        id: "m4b",
        author: "admin",
        authorName: "Matteo Rinaldi",
        text: "Ciao Sara, abbiamo sostituito la lampadina. Puoi confermare che ora funzioni correttamente?",
        createdAt: _hAgo(8),
      },
    ],
  },
  {
    id: "t5",
    student_id: "p1",
    student_nome: "Marco Rossi",
    titolo: "Riscaldamento non funziona",
    descrizione: "Il termosifone della stanza non si accende.",
    categoria: "manutenzione",
    priorita: "urgente",
    stato: "aperto",
    created_at: _hAgo(6),
    updatedAt: _hAgo(6),
    unreadForAdmin: true,
    messages: [
      {
        id: "m5a",
        author: "studente",
        authorName: "Marco Rossi",
        text: "Il termosifone della mia stanza non si accende, fa molto freddo.",
        createdAt: _hAgo(6),
      },
    ],
  },
  {
    id: "t6",
    student_id: "p3",
    student_nome: "Luca Verdi",
    titolo: "Perdita acqua sotto al lavandino",
    descrizione: "C'è una perdita importante sotto al lavandino, sta allagando il bagno.",
    categoria: "manutenzione",
    priorita: "urgente",
    stato: "in_corso",
    created_at: _hAgo(36),
    updatedAt: _hAgo(28),
    assignedTo: "Giulia Marchetti",
    unreadForAdmin: true,
    messages: [
      {
        id: "m6a",
        author: "studente",
        authorName: "Luca Verdi",
        text: "C'è una perdita importante sotto al lavandino, sta allagando il bagno!",
        createdAt: _hAgo(36),
      },
      {
        id: "m6b",
        author: "admin",
        authorName: "Giulia Marchetti",
        text: "Mando subito il tecnico, intanto chiudi il rubinetto centrale.",
        createdAt: _hAgo(34),
      },
      {
        id: "m6c",
        author: "studente",
        authorName: "Luca Verdi",
        text: "Fatto, ma il tecnico non è ancora arrivato. Aggiornamenti?",
        createdAt: _hAgo(28),
      },
    ],
  },
];

// --- COMMUNITY POSTS ---
export const mockPosts: CommunityPost[] = [
  {
    id: "post1",
    author: mockProfiles[0],
    titolo: "Qualcuno per studiare insieme?",
    contenuto: "Ciao a tutti! Domani pomeriggio vado in biblioteca Bo. Qualcuno si aggiunge? Porto i biscotti 🍪",
    tipo: "post",
    likes: 12,
    created_at: "2025-06-10T14:30:00",
  },
  {
    id: "post2",
    author: mockProfiles[1],
    contenuto: "Reminder: domani sera pizza in cucina comune! Portate i vostri ingredienti preferiti 🍕",
    tipo: "evento",
    likes: 24,
    created_at: "2025-06-09T18:00:00",
    data_evento: "2025-06-11T20:00:00",
  },
  {
    id: "post3",
    author: mockProfiles[3],
    titolo: "Cercasi compagno/a per doppia 103",
    contenuto: "Il mio coinquilino si trasferisce a luglio. Cerco qualcuno per prendere il suo posto nella doppia al piano terra. Camera spaziosa con cucina privata!",
    tipo: "cercasi",
    likes: 8,
    created_at: "2025-06-08T10:15:00",
  },
  {
    id: "post4",
    author: mockProfiles[2],
    titolo: "Torneo di calcetto",
    contenuto: "Organizziamo un torneo di calcetto questo weekend! Servono almeno 4 squadre da 5. Chi si iscrive? 🏆⚽",
    tipo: "annuncio",
    likes: 31,
    created_at: "2025-06-07T09:00:00",
    data_evento: "2025-06-14T15:00:00",
  },
];

// --- GUIDE ---
export const mockGuide: Guida[] = [
  {
    id: "g1",
    titolo: "Come richiedere il certificato di residenza a Padova",
    contenuto: "Per richiedere la residenza a Padova devi recarti all'Ufficio Anagrafe del Comune con documento d'identità, codice fiscale e contratto di affitto. La pratica richiede circa 15 giorni lavorativi. È importante farlo entro 20 giorni dall'arrivo per non incorrere in sanzioni.",
    categoria: "Burocrazia",
    icona: "FileText",
    attiva: true,
  },
  {
    id: "g2",
    titolo: "Le migliori biblioteche dove studiare gratis",
    contenuto: "Padova offre diverse biblioteche universitarie eccellenti: la Biblioteca del Bo (centrale), la Biblioteca di Scienze (via Marzolo), la Biblioteca Pinali (Medicina). Tutte aperte dal lunedì al venerdì 8:30-19:30. La Sala Studio di via Belzoni è aperta anche il sabato.",
    categoria: "Università",
    icona: "BookOpen",
    attiva: true,
  },
  {
    id: "g3",
    titolo: "App indispensabili per studenti universitari",
    contenuto: "Le app che ogni studente a Padova dovrebbe avere: UniPD app (orari e esami), BusItalia Veneto (trasporti), Too Good To Go (cibo scontato), Satispay (pagamenti), Google Calendar (organizzazione).",
    categoria: "Vita in Città",
    icona: "Smartphone",
    attiva: true,
  },
  {
    id: "g4",
    titolo: "Come risparmiare con la mensa universitaria",
    contenuto: "Con l'ISEE universitario puoi accedere alla mensa ESU con tariffe da 2,50€ a 5€ a pasto. Le mense principali sono in via San Francesco e in Piovego. Scarica l'app ESU Padova per prenotare e pagare direttamente dal telefono.",
    categoria: "Risparmio",
    icona: "PiggyBank",
    attiva: true,
  },
  {
    id: "g5",
    titolo: "Muoversi a Padova: bus, bici e monopattini",
    contenuto: "La soluzione migliore è la bici: Padova è piatta e piena di piste ciclabili. Per i bus, l'abbonamento studenti APS costa 220€/anno. I monopattini Tier e Lime costano circa 0,25€/min. Il tram collega la stazione a Pontevigodarzere.",
    categoria: "Trasporti",
    icona: "Bike",
    attiva: true,
  },
];

// --- BUONI SCONTO ---
export const mockBuoni: Buono[] = [
  {
    id: "b1",
    codice: "STUD15",
    nome_esercizio: "Pizzeria da Mario",
    descrizione: "Sconto del 15% su tutti i menu della pizzeria. Valido a pranzo e cena, anche per delivery.",
    sconto: "15%",
    categoria: "Cibo",
    logo_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop",
    scadenza: "2026-12-31",
    attivo: true,
    nuovo: true,
  },
  {
    id: "b2",
    codice: "LIBRI10",
    nome_esercizio: "Libreria Einaudi Padova",
    descrizione: "10% di sconto su tutti i libri universitari e narrativa. Presenta il codice in cassa.",
    sconto: "10%",
    categoria: "Libri",
    logo_url: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=100&h=100&fit=crop",
    scadenza: "2026-12-31",
    attivo: true,
  },
  {
    id: "b3",
    codice: "FITGRATIS",
    nome_esercizio: "Palestra FitPadova",
    descrizione: "Prima settimana di prova completamente gratuita. Include accesso a sala pesi, corsi e piscina.",
    sconto: "Gratis 1 sett.",
    categoria: "Sport",
    logo_url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=100&fit=crop",
    scadenza: "2026-09-30",
    attivo: true,
    nuovo: true,
  },
  {
    id: "b4",
    codice: "CINESTU",
    nome_esercizio: "Cinema PortAstra",
    descrizione: "Biglietto ridotto a soli 5€ per tutte le proiezioni, tutti i giorni. Valido con tessera studente.",
    sconto: "5€",
    categoria: "Divertimento",
    logo_url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=100&h=100&fit=crop",
    scadenza: "2026-12-31",
    attivo: true,
  },
];

// --- NOTIFICATIONS ---
export const mockNotifications: Notification[] = [
  {
    id: "n1",
    titolo: "Nuova richiesta di affitto",
    messaggio: "Luca Verdi ha richiesto la Doppia 103",
    tipo: "richiesta",
    letta: false,
    created_at: "2025-06-10T10:30:00",
  },
  {
    id: "n2",
    titolo: "Ticket supporto",
    messaggio: "Marco Rossi ha aperto un ticket per il WiFi",
    tipo: "supporto",
    letta: false,
    created_at: "2025-06-09T16:00:00",
  },
  {
    id: "n3",
    titolo: "Nuovo buono disponibile",
    messaggio: "Palestra FitPadova offre una settimana gratis!",
    tipo: "buono",
    letta: true,
    created_at: "2025-06-08T09:00:00",
  },
  {
    id: "n4",
    titolo: "Pagamento in scadenza",
    messaggio: "La rata di luglio scade tra 5 giorni",
    tipo: "sistema",
    letta: false,
    created_at: "2025-06-07T08:00:00",
  },
];

// --- DOCUMENTI ---
export const mockDocumenti: Documento[] = [
  {
    id: "d1",
    nome: "Contratto di locazione 2025-2026",
    tipo: "contratto",
    data: "2025-08-01",
    dimensione: "2.4 MB",
    url: "#",
  },
  {
    id: "d2",
    nome: "Ricevuta Settembre 2025",
    tipo: "ricevuta",
    data: "2025-09-01",
    dimensione: "340 KB",
    url: "#",
  },
  {
    id: "d3",
    nome: "Ricevuta Ottobre 2025",
    tipo: "ricevuta",
    data: "2025-10-01",
    dimensione: "338 KB",
    url: "#",
  },
  {
    id: "d4",
    nome: "Regolamento interno",
    tipo: "documento",
    data: "2025-08-01",
    dimensione: "1.1 MB",
    url: "#",
  },
  {
    id: "d5",
    nome: "Ricevuta Novembre 2025",
    tipo: "ricevuta",
    data: "2025-11-01",
    dimensione: "342 KB",
    url: "#",
  },
];

// --- PAGAMENTI ---
export const mockPagamenti: Pagamento[] = [
  // Marco Rossi — contratto c1
  {
    id: "pay1",
    contratto_id: "c1",
    mese: "Settembre 2025",
    importo: 480,
    stato: "pagato",
    data_scadenza: "2025-09-05",
    data_pagamento: "2025-09-03",
    metodo: "Bonifico bancario",
  },
  {
    id: "pay2",
    contratto_id: "c1",
    mese: "Gennaio 2026",
    importo: 480,
    stato: "pagato",
    data_scadenza: "2026-01-05",
    data_pagamento: "2026-01-04",
    metodo: "Bonifico bancario",
  },
  {
    id: "pay3",
    contratto_id: "c1",
    mese: "Febbraio 2026",
    importo: 480,
    stato: "pagato",
    data_scadenza: "2026-02-05",
    data_pagamento: "2026-02-03",
    metodo: "Carta di credito",
  },
  {
    id: "pay4",
    contratto_id: "c1",
    mese: "Aprile 2026",
    importo: 480,
    stato: "pagato",
    data_scadenza: "2026-04-05",
    data_pagamento: "2026-04-04",
    metodo: "Bonifico bancario",
  },
  {
    id: "pay5",
    contratto_id: "c1",
    mese: "Maggio 2026",
    importo: 480,
    stato: "in_scadenza",
    data_scadenza: "2026-05-10",
  },
  // Sara Bianchi — contratto c2
  {
    id: "pay6",
    contratto_id: "c2",
    mese: "Settembre 2025",
    importo: 480,
    stato: "pagato",
    data_scadenza: "2025-09-05",
    data_pagamento: "2025-09-05",
    metodo: "Bonifico bancario",
  },
  {
    id: "pay7",
    contratto_id: "c2",
    mese: "Marzo 2026",
    importo: 480,
    stato: "pagato",
    data_scadenza: "2026-03-05",
    data_pagamento: "2026-03-04",
    metodo: "Bonifico bancario",
  },
  {
    id: "pay8",
    contratto_id: "c2",
    mese: "Maggio 2026",
    importo: 480,
    stato: "scaduto",
    data_scadenza: "2026-05-05",
  },
];

// --- CONTRATTI ---
export interface Contratto {
  id: string;
  richiesta_id: string;
  student_nome: string;
  camera_nome: string;
  data_inizio: string;
  data_fine: string;
  canone_mensile: number;
  stato: "attivo" | "in_scadenza" | "scaduto" | "disdetto";
  data_firma: string;
  documento_url: string;
}

export const mockContratti: Contratto[] = [
  {
    id: "c1",
    richiesta_id: "pren1",
    student_nome: "Marco Rossi",
    camera_nome: "Singola Standard 101",
    data_inizio: "2025-09-01",
    data_fine: "2026-07-31",
    canone_mensile: 480,
    stato: "attivo",
    data_firma: "2025-07-15",
    documento_url: "#",
  },
  {
    id: "c2",
    richiesta_id: "pren2",
    student_nome: "Sara Bianchi",
    camera_nome: "Singola Standard 205",
    data_inizio: "2025-09-01",
    data_fine: "2026-07-31",
    canone_mensile: 480,
    stato: "attivo",
    data_firma: "2025-07-20",
    documento_url: "#",
  },
  {
    id: "c3",
    richiesta_id: "pren0",
    student_nome: "Andrea Neri",
    camera_nome: "Doppia 201",
    data_inizio: "2024-09-01",
    data_fine: "2025-07-31",
    canone_mensile: 380,
    stato: "in_scadenza",
    data_firma: "2024-07-10",
    documento_url: "#",
  },
  {
    id: "c4",
    richiesta_id: "pren00",
    student_nome: "Elena Conti",
    camera_nome: "Singola Plus 302",
    data_inizio: "2023-09-01",
    data_fine: "2024-07-31",
    canone_mensile: 520,
    stato: "scaduto",
    data_firma: "2023-07-05",
    documento_url: "#",
  },
];

// Current mock user (simulates logged-in student)
export const currentUser = mockProfiles[0];

// ============ FATTURE ============
export type FatturaStato = "inviata" | "pagata" | "scaduta" | "in_ritardo";

export interface SollecitoPagamento {
  id: string;
  numero: number;        // 1-6
  data_invio: string;    // ISO date
  tipo: "automatico" | "manuale";
  oggetto: string;       // email subject
}

export interface Fattura {
  id: string;
  contratto_id: string;
  student_id: string;
  student_nome: string;
  mese: string;          // "Maggio 2026"
  importo: number;
  data_emissione: string;
  data_scadenza: string;
  stato: FatturaStato;
  pdf_nome?: string;     // filename
  pdf_data?: string;     // base64 content (data:application/pdf;base64,...)
  note?: string;
  data_pagamento?: string;
  metodo_pagamento?: string;
  email_inviata: boolean;
  solleciti: SollecitoPagamento[];
}

export const FATTURE_KEY = "fatture_v1";

export const mockFatture: Fattura[] = [
  // Marco Rossi — contratto c1, student p1
  {
    id: "f1",
    contratto_id: "c1",
    student_id: "p1",
    student_nome: "Marco Rossi",
    mese: "Febbraio 2026",
    importo: 480,
    data_emissione: "2026-02-01",
    data_scadenza: "2026-02-05",
    stato: "pagata",
    pdf_nome: "fattura-marco-feb2026.pdf",
    data_pagamento: "2026-02-04",
    metodo_pagamento: "Bonifico bancario",
    email_inviata: true,
    solleciti: [],
  },
  {
    id: "f2",
    contratto_id: "c1",
    student_id: "p1",
    student_nome: "Marco Rossi",
    mese: "Marzo 2026",
    importo: 480,
    data_emissione: "2026-03-01",
    data_scadenza: "2026-03-05",
    stato: "pagata",
    pdf_nome: "fattura-marco-mar2026.pdf",
    data_pagamento: "2026-03-03",
    metodo_pagamento: "Carta di credito",
    email_inviata: true,
    solleciti: [],
  },
  {
    id: "f3",
    contratto_id: "c1",
    student_id: "p1",
    student_nome: "Marco Rossi",
    mese: "Aprile 2026",
    importo: 480,
    data_emissione: "2026-04-01",
    data_scadenza: "2026-04-05",
    stato: "in_ritardo",
    pdf_nome: "fattura-marco-apr2026.pdf",
    email_inviata: true,
    solleciti: [
      {
        id: "sol1",
        numero: 1,
        data_invio: "2026-04-06",
        tipo: "automatico",
        oggetto: "Promemoria gentile - Fattura Aprile 2026",
      },
      {
        id: "sol2",
        numero: 2,
        data_invio: "2026-04-13",
        tipo: "automatico",
        oggetto: "Secondo sollecito - Fattura Aprile 2026",
      },
    ],
  },
  // Sara Bianchi — contratto c2, student p2
  {
    id: "f4",
    contratto_id: "c2",
    student_id: "p2",
    student_nome: "Sara Bianchi",
    mese: "Febbraio 2026",
    importo: 480,
    data_emissione: "2026-02-01",
    data_scadenza: "2026-02-05",
    stato: "pagata",
    pdf_nome: "fattura-sara-feb2026.pdf",
    data_pagamento: "2026-02-05",
    metodo_pagamento: "Bonifico bancario",
    email_inviata: true,
    solleciti: [],
  },
  {
    id: "f5",
    contratto_id: "c2",
    student_id: "p2",
    student_nome: "Sara Bianchi",
    mese: "Marzo 2026",
    importo: 480,
    data_emissione: "2026-03-01",
    data_scadenza: "2026-03-05",
    stato: "inviata",
    pdf_nome: "fattura-sara-mar2026.pdf",
    email_inviata: true,
    solleciti: [],
  },
  {
    id: "f6",
    contratto_id: "c2",
    student_id: "p2",
    student_nome: "Sara Bianchi",
    mese: "Aprile 2026",
    importo: 480,
    data_emissione: "2026-04-01",
    data_scadenza: "2026-04-05",
    stato: "scaduta",
    pdf_nome: "fattura-sara-apr2026.pdf",
    email_inviata: true,
    solleciti: [
      {
        id: "sol3",
        numero: 1,
        data_invio: "2026-04-08",
        tipo: "automatico",
        oggetto: "Promemoria gentile - Fattura Aprile 2026",
      },
    ],
  },
];

// ─── ADMIN UTENTI ────────────────────────────────────────────────────────────

export type AdminRuolo = "superadmin" | "operatore" | "lettore";

export interface AdminUtente {
  id: string;
  nome: string;
  email: string;
  ruolo: AdminRuolo;
  attivo: boolean;
  colore: string;
  createdAt: string;
}

export const mockAdminUtenti: AdminUtente[] = [
  {
    id: "au1",
    nome: "Florian Andriciuc",
    email: "studentatonapoleone@gmail.com",
    ruolo: "superadmin",
    attivo: true,
    colore: "#1e3a5f",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
];

export const ADMIN_UTENTI_KEY = "admin_utenti_v1";

// ─── EMAIL TEMPLATE BLOCKS ───────────────────────────────────────────────────

export type TemplateBlockTipo = "header" | "testo" | "bottone" | "separatore" | "footer" | "immagine" | "spaziatore";

export interface TemplateBlock {
  id: string;
  tipo: TemplateBlockTipo;
  // header
  header_titolo?: string;
  header_sottotitolo?: string;
  header_bg?: string;
  header_mostra_logo?: boolean;
  header_logo_src?: string;   // custom logo base64/URL
  header_text_color?: string;
  header_font_family?: string;
  // testo  (stores HTML for rich formatting, plain text also works)
  testo_corpo?: string;
  testo_allineamento?: "sinistra" | "centro" | "destra";
  testo_font_family?: string;
  testo_font_size?: number;
  testo_colore?: string;
  testo_bg?: string;
  // bottone
  btn_label?: string;
  btn_url?: string;
  btn_colore?: string;
  btn_text_color?: string;
  btn_border_radius?: number;
  btn_full_width?: boolean;
  // immagine
  img_src?: string;           // base64 or URL
  img_alt?: string;
  img_link?: string;
  img_width_pct?: number;     // 20–100
  img_allineamento?: "sinistra" | "centro" | "destra";
  img_border_radius?: number;
  img_bg?: string;
  // spaziatore
  spacer_height?: number;     // px 10–100
  spacer_bg?: string;
  // separatore
  sep_color?: string;
  sep_thickness?: number;
  sep_style?: "solid" | "dashed" | "dotted";
  // footer
  footer_testo?: string;
  footer_bg?: string;
  footer_text_color?: string;
  footer_font_size?: number;
}

export type EmailTemplateTipo =
  | "fattura_emessa"
  | "sollecito_1" | "sollecito_2" | "sollecito_3" | "sollecito_4" | "sollecito_5" | "sollecito_6"
  | "account_creato"
  | "recupera_password";

export interface EmailTemplate {
  id: string;
  nome: string;
  tipo: EmailTemplateTipo;
  oggetto: string;
  blocks: TemplateBlock[];
}

export const TEMPLATE_VARIABILI: { var: string; desc: string }[] = [
  { var: "{{nome_studente}}", desc: "Nome e cognome dello studente" },
  { var: "{{email_studente}}", desc: "Email dello studente" },
  { var: "{{mese}}", desc: "Mese della fattura (es. Maggio 2026)" },
  { var: "{{importo}}", desc: "Importo in euro" },
  { var: "{{data_scadenza}}", desc: "Data scadenza pagamento" },
  { var: "{{link_fattura}}", desc: "Link per scaricare il PDF" },
  { var: "{{numero_sollecito}}", desc: "Numero del sollecito (1–6)" },
  { var: "{{giorni_ritardo}}", desc: "Giorni di ritardo nel pagamento" },
  { var: "{{link_accesso}}", desc: "Link di accesso al portale studenti" },
  { var: "{{link_reset_password}}", desc: "Link per reimpostare la password" },
  { var: "{{nome_struttura}}", desc: "Nome della struttura" },
];

export const EMAIL_TEMPLATES_KEY = "email_templates_v1";

export const defaultEmailTemplates: EmailTemplate[] = [
  {
    id: "tpl_fattura",
    nome: "📄 Fattura Emessa",
    tipo: "fattura_emessa",
    oggetto: "📄 Fattura {{mese}} – Studentato Napoleone",
    blocks: [
      { id: "b_f1", tipo: "header", header_titolo: "Studentato Napoleone", header_sottotitolo: "La tua fattura mensile è pronta", header_bg: "#1e3a5f", header_mostra_logo: true },
      { id: "b_f2", tipo: "testo", testo_corpo: "Ciao {{nome_studente}},\n\nla fattura per il mese di {{mese}} è stata emessa. Trovi il PDF allegato a questa email.\n\n💰  Importo: €{{importo}}\n📅  Scadenza pagamento: {{data_scadenza}}\n\nPuoi pagare tramite bonifico bancario alle coordinate che trovi nel contratto. Per qualsiasi dubbio siamo qui!", testo_allineamento: "sinistra" },
      { id: "b_f3", tipo: "bottone", btn_label: "Scarica Fattura PDF", btn_url: "{{link_fattura}}", btn_colore: "#1e3a5f" },
      { id: "b_f4", tipo: "separatore" },
      { id: "b_f5", tipo: "footer", footer_testo: "Studentato Napoleone Padova  ·  studentatonapoleone@gmail.com  ·  +39 392 3634188\nPer non ricevere più queste email contattaci direttamente." },
    ],
  },
  {
    id: "tpl_sol1",
    nome: "🔔 Sollecito 1 — Promemoria",
    tipo: "sollecito_1",
    oggetto: "🔔 Promemoria pagamento – {{mese}}",
    blocks: [
      { id: "b_s1_1", tipo: "header", header_titolo: "Studentato Napoleone", header_sottotitolo: "Promemoria di pagamento", header_bg: "#1e3a5f", header_mostra_logo: true },
      { id: "b_s1_2", tipo: "testo", testo_corpo: "Ciao {{nome_studente}},\n\nvolevo ricordarti che la fattura di {{mese}} (€{{importo}}) risulta ancora da pagare.\n\nNessun problema, può capitare! Se hai già effettuato il bonifico ignora questa email. 😊\n\nPer qualsiasi domanda siamo disponibili.", testo_allineamento: "sinistra" },
      { id: "b_s1_3", tipo: "bottone", btn_label: "Visualizza Fattura", btn_url: "{{link_fattura}}", btn_colore: "#2563eb" },
      { id: "b_s1_4", tipo: "footer", footer_testo: "Studentato Napoleone Padova  ·  studentatonapoleone@gmail.com  ·  +39 392 3634188" },
    ],
  },
  {
    id: "tpl_sol2",
    nome: "📌 Sollecito 2 — Secondo avviso",
    tipo: "sollecito_2",
    oggetto: "📌 Secondo avviso pagamento – {{mese}}",
    blocks: [
      { id: "b_s2_1", tipo: "header", header_titolo: "Studentato Napoleone", header_sottotitolo: "Secondo avviso di pagamento", header_bg: "#1d4ed8", header_mostra_logo: true },
      { id: "b_s2_2", tipo: "testo", testo_corpo: "Ciao {{nome_studente}},\n\nti contatto nuovamente per la fattura di {{mese}} (€{{importo}}) non ancora saldata ({{giorni_ritardo}} giorni di ritardo).\n\nTi chiediamo di provvedere il prima possibile. Se hai problemi economici temporanei, scrivici e troviamo una soluzione insieme.", testo_allineamento: "sinistra" },
      { id: "b_s2_3", tipo: "bottone", btn_label: "Contattaci", btn_url: "mailto:studentatonapoleone@gmail.com", btn_colore: "#2563eb" },
      { id: "b_s2_4", tipo: "footer", footer_testo: "Studentato Napoleone Padova  ·  studentatonapoleone@gmail.com  ·  +39 392 3634188" },
    ],
  },
  {
    id: "tpl_sol3",
    nome: "⚠️ Sollecito 3 — Urgente",
    tipo: "sollecito_3",
    oggetto: "⚠️ Pagamento in ritardo – {{mese}} – Azione richiesta",
    blocks: [
      { id: "b_s3_1", tipo: "header", header_titolo: "Studentato Napoleone", header_sottotitolo: "Pagamento urgente richiesto", header_bg: "#d97706", header_mostra_logo: true },
      { id: "b_s3_2", tipo: "testo", testo_corpo: "Gentile {{nome_studente}},\n\nla fattura di {{mese}} (€{{importo}}) è ora in ritardo di {{giorni_ritardo}} giorni.\n\nTi chiediamo di regolarizzare la posizione entro i prossimi 5 giorni per evitare la sospensione dei servizi accessori (lavanderia, sala studio, WiFi).\n\nSe hai già pagato, invia la ricevuta bancaria rispondendo a questa email.", testo_allineamento: "sinistra" },
      { id: "b_s3_3", tipo: "bottone", btn_label: "Invia ricevuta di pagamento", btn_url: "mailto:studentatonapoleone@gmail.com?subject=Ricevuta pagamento {{mese}}", btn_colore: "#d97706" },
      { id: "b_s3_4", tipo: "footer", footer_testo: "Studentato Napoleone Padova  ·  studentatonapoleone@gmail.com  ·  +39 392 3634188" },
    ],
  },
  {
    id: "tpl_sol4",
    nome: "🚨 Sollecito 4 — Formale",
    tipo: "sollecito_4",
    oggetto: "🚨 URGENTE: Pagamento {{mese}} in grave ritardo",
    blocks: [
      { id: "b_s4_1", tipo: "header", header_titolo: "Studentato Napoleone", header_sottotitolo: "Comunicazione formale di mora", header_bg: "#dc2626", header_mostra_logo: true },
      { id: "b_s4_2", tipo: "testo", testo_corpo: "Gentile {{nome_studente}},\n\nnonostante i precedenti avvisi, la fattura di {{mese}} (€{{importo}}) risulta ancora impagata con un ritardo di {{giorni_ritardo}} giorni.\n\nCon la presente comunichiamo formalmente che, in assenza di pagamento entro 48 ore, procederemo con la sospensione dei servizi prevista dall'art. 8 del contratto di locazione.\n\nInvitiamo a contattarci immediatamente.", testo_allineamento: "sinistra" },
      { id: "b_s4_3", tipo: "bottone", btn_label: "Chiama ora: +39 392 3634188", btn_url: "tel:+393923634188", btn_colore: "#dc2626" },
      { id: "b_s4_4", tipo: "footer", footer_testo: "Studentato Napoleone Padova  ·  studentatonapoleone@gmail.com  ·  +39 392 3634188" },
    ],
  },
  {
    id: "tpl_sol5",
    nome: "❌ Sollecito 5 — Sospensione",
    tipo: "sollecito_5",
    oggetto: "❌ Sospensione servizi – Fattura {{mese}} non pagata",
    blocks: [
      { id: "b_s5_1", tipo: "header", header_titolo: "Studentato Napoleone", header_sottotitolo: "Sospensione servizi in corso", header_bg: "#7f1d1d", header_mostra_logo: true },
      { id: "b_s5_2", tipo: "testo", testo_corpo: "Gentile {{nome_studente}},\n\na causa del mancato pagamento della fattura di {{mese}} (€{{importo}}, ritardo: {{giorni_ritardo}} giorni), abbiamo proceduto con la sospensione dei servizi accessori come previsto contrattualmente.\n\nPer il ripristino immediato è necessario saldare l'importo dovuto più gli interessi di mora. Contattaci entro oggi.", testo_allineamento: "sinistra" },
      { id: "b_s5_3", tipo: "separatore" },
      { id: "b_s5_4", tipo: "footer", footer_testo: "Studentato Napoleone Padova  ·  studentatonapoleone@gmail.com  ·  +39 392 3634188" },
    ],
  },
  {
    id: "tpl_sol6",
    nome: "⛔ Sollecito 6 — Ultimo avviso",
    tipo: "sollecito_6",
    oggetto: "⛔ ULTIMO AVVISO prima di procedere legalmente – {{mese}}",
    blocks: [
      { id: "b_s6_1", tipo: "header", header_titolo: "Studentato Napoleone", header_sottotitolo: "Ultimo avviso prima di azione legale", header_bg: "#450a0a", header_mostra_logo: true },
      { id: "b_s6_2", tipo: "testo", testo_corpo: "Gentile {{nome_studente}},\n\nquesto è l'ultimo avviso prima di procedere per vie legali per il recupero del credito relativo alla fattura di {{mese}} (€{{importo}}, ritardo: {{giorni_ritardo}} giorni).\n\nSe entro 72 ore non riceviamo il pagamento o un accordo scritto, l'incarico sarà affidato al nostro legale con addebito delle spese legali a Vs. carico, come da art. 12 del contratto.\n\nÈ ancora possibile evitare questa situazione contattandoci immediatamente.", testo_allineamento: "sinistra" },
      { id: "b_s6_3", tipo: "bottone", btn_label: "Contatta subito la direzione", btn_url: "mailto:studentatonapoleone@gmail.com?subject=Urgente - Pagamento {{mese}}", btn_colore: "#450a0a" },
      { id: "b_s6_4", tipo: "footer", footer_testo: "Studentato Napoleone Padova  ·  studentatonapoleone@gmail.com  ·  +39 392 3634188" },
    ],
  },
  {
    id: "tpl_account",
    nome: "👋 Account Creato",
    tipo: "account_creato",
    oggetto: "👋 Benvenuto/a {{nome_studente}}! Il tuo account è pronto",
    blocks: [
      { id: "b_ac1", tipo: "header", header_titolo: "Benvenuto/a al Studentato!", header_sottotitolo: "Il tuo account è stato creato con successo", header_bg: "#1e3a5f", header_mostra_logo: true },
      { id: "b_ac2", tipo: "testo", testo_corpo: "Ciao <strong>{{nome_studente}}</strong>,\n\nsiamo felici di darti il benvenuto al Studentato Napoleone Padova! 🎉\n\nIl tuo account è stato creato. Usa il link qui sotto per accedere al portale studenti dove puoi:\n• Visualizzare il tuo contratto e le fatture\n• Aprire ticket di supporto\n• Connetterti con la comunità\n\n📧 Email: {{email_studente}}", testo_allineamento: "sinistra" },
      { id: "b_ac3", tipo: "bottone", btn_label: "Accedi al portale studenti →", btn_url: "{{link_accesso}}", btn_colore: "#1e3a5f", btn_border_radius: 8 },
      { id: "b_ac4", tipo: "separatore" },
      { id: "b_ac5", tipo: "testo", testo_corpo: "Hai domande? Scrivici a studentatonapoleone@gmail.com o chiamaci al +39 392 3634188. Siamo qui per aiutarti! 😊", testo_font_size: 14, testo_colore: "#6b7280", testo_allineamento: "centro" },
      { id: "b_ac6", tipo: "footer", footer_testo: "Studentato Napoleone Padova  ·  studentatonapoleone@gmail.com  ·  +39 392 3634188" },
    ],
  },
  {
    id: "tpl_password",
    nome: "🔑 Recupera Password",
    tipo: "recupera_password",
    oggetto: "🔑 Reimposta la tua password – Studentato Napoleone",
    blocks: [
      { id: "b_pw1", tipo: "header", header_titolo: "Studentato Napoleone", header_sottotitolo: "Reimpostazione password", header_bg: "#374151", header_mostra_logo: true },
      { id: "b_pw2", tipo: "testo", testo_corpo: "Ciao <strong>{{nome_studente}}</strong>,\n\nhai richiesto di reimpostare la password del tuo account. Clicca sul pulsante qui sotto per crearne una nuova.\n\n⏳ Il link è valido per <strong>24 ore</strong>.\n\nSe non hai richiesto questa email, puoi ignorarla tranquillamente — il tuo account è al sicuro.", testo_allineamento: "sinistra" },
      { id: "b_pw3", tipo: "bottone", btn_label: "Reimposta password", btn_url: "{{link_reset_password}}", btn_colore: "#374151", btn_border_radius: 6 },
      { id: "b_pw4", tipo: "separatore" },
      { id: "b_pw5", tipo: "footer", footer_testo: "Studentato Napoleone Padova  ·  studentatonapoleone@gmail.com\nSe non hai richiesto questa email, ignora questo messaggio. Nessuna azione è richiesta." },
    ],
  },
];

// ─── EMAIL CAMPAIGNS ─────────────────────────────────────────────────────────

export type CampagnaStato = "bozza" | "programmata" | "inviata";
export type CampagnaDestinatari = "tutti" | "attivi" | "in_uscita" | "ex_studenti";

export interface EmailCampaign {
  id: string;
  nome: string;
  oggetto: string;
  preview_text?: string;
  blocks: TemplateBlock[];
  destinatari: CampagnaDestinatari;
  stato: CampagnaStato;
  created_at: string;
  scheduled_at?: string;
  sent_at?: string;
  inviati_count?: number;
}

export const EMAIL_CAMPAIGNS_KEY = "email_campaigns_v1";
