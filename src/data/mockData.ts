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

export interface Prenotazione {
  id: string;
  camera_id: string;
  camera_nome: string;
  student_id: string;
  student_nome: string;
  data_inizio: string;
  data_fine: string;
  stato: "pending" | "confermata" | "rifiutata" | "conclusa";
  note?: string;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  student_id: string;
  student_nome: string;
  titolo: string;
  descrizione: string;
  categoria: "manutenzione" | "wifi" | "pulizie" | "altro";
  priorita: "bassa" | "normale" | "alta" | "urgente";
  stato: "aperto" | "in_corso" | "risolto";
  risposta_admin?: string;
  created_at: string;
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
  tipo: "prenotazione" | "supporto" | "buono" | "sistema";
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

// --- PRENOTAZIONI ---
export const mockPrenotazioni: Prenotazione[] = [
  {
    id: "pren1",
    camera_id: "singola-101",
    camera_nome: "Singola Standard 101",
    student_id: "p1",
    student_nome: "Marco Rossi",
    data_inizio: "2025-09-01",
    data_fine: "2026-07-31",
    stato: "confermata",
    created_at: "2025-05-15",
  },
  {
    id: "pren2",
    camera_id: "singola-205",
    camera_nome: "Singola Standard 205",
    student_id: "p2",
    student_nome: "Sara Bianchi",
    data_inizio: "2025-09-01",
    data_fine: "2026-07-31",
    stato: "confermata",
    created_at: "2025-05-20",
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
    note: "Vorrei la camera con il mio amico Andrea",
    created_at: "2025-06-01",
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
    created_at: "2025-06-10",
  },
];

// --- SUPPORT TICKETS ---
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
    created_at: "2025-06-05",
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
    created_at: "2025-06-03",
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
    created_at: "2025-05-28",
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
    titolo: "Nuova prenotazione",
    messaggio: "Luca Verdi ha richiesto la Doppia 103",
    tipo: "prenotazione",
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

// Current mock user (simulates logged-in student)
export const currentUser = mockProfiles[0];
