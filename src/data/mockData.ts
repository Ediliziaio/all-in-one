// Mock data for admin & student areas (no backend)

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

export const mockOperatori: string[] = [
  "Giulia Marchetti",
  "Federico Bianchi",
  "Sara Lombardi",
  "Matteo Rinaldi",
];

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
    scadenza: "2025-12-31",
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
    scadenza: "2025-12-31",
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
    scadenza: "2025-09-30",
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
    scadenza: "2026-06-30",
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
  {
    id: "pay1",
    mese: "Settembre 2025",
    importo: 480,
    stato: "pagato",
    data_scadenza: "2025-09-05",
    data_pagamento: "2025-09-03",
    metodo: "Bonifico bancario",
  },
  {
    id: "pay2",
    mese: "Ottobre 2025",
    importo: 480,
    stato: "pagato",
    data_scadenza: "2025-10-05",
    data_pagamento: "2025-10-04",
    metodo: "Bonifico bancario",
  },
  {
    id: "pay3",
    mese: "Novembre 2025",
    importo: 480,
    stato: "pagato",
    data_scadenza: "2025-11-05",
    data_pagamento: "2025-11-02",
    metodo: "Carta di credito",
  },
  {
    id: "pay4",
    mese: "Dicembre 2025",
    importo: 480,
    stato: "in_scadenza",
    data_scadenza: "2025-12-05",
  },
  {
    id: "pay5",
    mese: "Gennaio 2026",
    importo: 480,
    stato: "scaduto",
    data_scadenza: "2026-01-05",
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
