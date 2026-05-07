/**
 * Shared localStorage store for support tickets.
 * Both AdminSupporto (admin) and Supporto (student) read/write from this.
 * Key must match AdminSupporto's STORAGE_KEY = "sn_tickets_v1"
 */
import { mockTickets, type SupportTicket } from "./mockData";

const STORAGE_KEY = "sn_tickets_v1";

export function loadAllTickets(): SupportTicket[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return JSON.parse(stored) as SupportTicket[];
  } catch {}
  return mockTickets;
}

export function saveAllTickets(tickets: SupportTicket[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  } catch {}
}

/** Get tickets for a specific student */
export function getStudentTickets(studentId: string): SupportTicket[] {
  return loadAllTickets().filter((t) => t.student_id === studentId);
}

/** Insert or update a single ticket in the shared store */
export function upsertTicket(ticket: SupportTicket): void {
  const all = loadAllTickets();
  const idx = all.findIndex((t) => t.id === ticket.id);
  if (idx >= 0) {
    all[idx] = ticket;
  } else {
    all.unshift(ticket);
  }
  saveAllTickets(all);
}
