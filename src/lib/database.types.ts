export type LeadStato = "nuovo" | "contattato" | "visita_programmata" | "proposta_inviata" | "contratto_firmato" | "perso";
export type LeadFonte = "sito" | "instagram" | "passaparola" | "google" | "fiera" | "altro";
export type LeadPriorita = "bassa" | "media" | "alta";
export type RoomType = "singola" | "singola-plus" | "doppia";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nome: string;
          cognome: string;
          email: string;
          corso: string | null;
          anno: number | null;
          avatar: string | null;
          bio: string | null;
          interessi: string[];
          instagram: string | null;
          role: "student" | "admin";
          piano: number | null;
          camera_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      rooms: {
        Row: {
          id: string;
          name: string;
          type: RoomType;
          price: number;
          floor: number;
          sqm: number;
          available: boolean;
          available_from: string;
          description: string;
          features: string[];
          images: string[];
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["rooms"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["rooms"]["Insert"]>;
      };
      richieste_affitto: {
        Row: {
          id: string;
          camera_id: string;
          camera_nome: string;
          student_id: string | null;
          student_nome: string;
          data_inizio: string;
          data_fine: string;
          stato: "pending" | "approvata" | "rifiutata" | "conclusa";
          pipeline_stato: LeadStato;
          note: string | null;
          telefono: string;
          email: string;
          eta: number | null;
          corso_universita: string | null;
          citta_provenienza: string | null;
          fonte: LeadFonte;
          budget_max: number | null;
          data_visita: string | null;
          operatore_assegnato: string | null;
          priorita: LeadPriorita;
          prossimo_followup: string | null;
          motivo_perdita: string | null;
          attivita: ActivityRow[];
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["richieste_affitto"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["richieste_affitto"]["Insert"]>;
      };
      support_tickets: {
        Row: {
          id: string;
          student_id: string;
          student_nome: string;
          titolo: string;
          descrizione: string;
          categoria: "manutenzione" | "wifi" | "pulizie" | "altro";
          priorita: "bassa" | "normale" | "alta" | "urgente";
          stato: "aperto" | "in_corso" | "attesa_studente" | "risolto";
          risposta_admin: string | null;
          messages: TicketMessageRow[];
          activity: TicketActivityRow[];
          assigned_to: string | null;
          unread_for_admin: boolean;
          unread_for_student: boolean;
          rating: number | null;
          closed_at: string | null;
          updated_at: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["support_tickets"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["support_tickets"]["Insert"]>;
      };
      community_posts: {
        Row: {
          id: string;
          author_id: string;
          titolo: string | null;
          contenuto: string;
          tipo: "post" | "evento" | "annuncio" | "cercasi";
          likes: number;
          data_evento: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["community_posts"]["Row"], "id" | "created_at" | "likes">;
        Update: Partial<Database["public"]["Tables"]["community_posts"]["Insert"]>;
      };
      guide: {
        Row: {
          id: string;
          titolo: string;
          contenuto: string;
          categoria: "Burocrazia" | "Università" | "Vita in Città" | "Risparmio" | "Trasporti";
          icona: string;
          attiva: boolean;
          ordine: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["guide"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["guide"]["Insert"]>;
      };
      buoni: {
        Row: {
          id: string;
          codice: string;
          nome_esercizio: string;
          descrizione: string;
          sconto: string;
          categoria: "Cibo" | "Sport" | "Libri" | "Divertimento" | "Servizi";
          logo_url: string;
          scadenza: string;
          attivo: boolean;
          nuovo: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["buoni"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["buoni"]["Insert"]>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          titolo: string;
          messaggio: string;
          tipo: "richiesta" | "supporto" | "buono" | "sistema";
          letta: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["notifications"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };
      documenti: {
        Row: {
          id: string;
          student_id: string;
          nome: string;
          tipo: "contratto" | "ricevuta" | "documento";
          data: string;
          dimensione: string;
          url: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["documenti"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["documenti"]["Insert"]>;
      };
      pagamenti: {
        Row: {
          id: string;
          student_id: string;
          mese: string;
          importo: number;
          stato: "pagato" | "in_scadenza" | "scaduto";
          data_scadenza: string;
          data_pagamento: string | null;
          metodo: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["pagamenti"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["pagamenti"]["Insert"]>;
      };
      contratti: {
        Row: {
          id: string;
          richiesta_id: string | null;
          student_id: string;
          student_nome: string;
          camera_nome: string;
          data_inizio: string;
          data_fine: string;
          canone_mensile: number;
          stato: "attivo" | "in_scadenza" | "scaduto" | "disdetto";
          data_firma: string;
          documento_url: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["contratti"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["contratti"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export interface ActivityRow {
  id: string;
  tipo: "nota" | "chiamata" | "email" | "visita" | "cambio_stato";
  testo: string;
  autore: string;
  createdAt: string;
}

export interface TicketMessageRow {
  id: string;
  author: "studente" | "admin";
  authorName: string;
  text: string;
  createdAt: string;
}

export interface TicketActivityRow {
  id: string;
  tipo: "creazione" | "cambio_stato" | "assegnazione" | "cambio_priorita" | "chiusura";
  testo: string;
  autore: string;
  createdAt: string;
  meta?: { from?: string; to?: string };
}

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type RoomRow = Database["public"]["Tables"]["rooms"]["Row"];
export type RichiestaRow = Database["public"]["Tables"]["richieste_affitto"]["Row"];
export type SupportTicketRow = Database["public"]["Tables"]["support_tickets"]["Row"];
export type CommunityPostRow = Database["public"]["Tables"]["community_posts"]["Row"];
export type GuidaRow = Database["public"]["Tables"]["guide"]["Row"];
export type BuonoRow = Database["public"]["Tables"]["buoni"]["Row"];
export type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];
export type DocumentoRow = Database["public"]["Tables"]["documenti"]["Row"];
export type PagamentoRow = Database["public"]["Tables"]["pagamenti"]["Row"];
export type ContrattoRow = Database["public"]["Tables"]["contratti"]["Row"];
