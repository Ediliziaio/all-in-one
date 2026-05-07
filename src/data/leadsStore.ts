/**
 * Shared localStorage store for rental leads/requests.
 * Both AdminPrenotazioni (admin) and public forms (Contatti, PrenotaCamera)
 * write here. Key must match AdminPrenotazioni's STORAGE_KEY = "crm_richieste_v1"
 */
import { mockRichieste, type RichiestaAffitto } from "./mockData";

const STORAGE_KEY = "crm_richieste_v1";

export function loadLeads(): RichiestaAffitto[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return JSON.parse(stored) as RichiestaAffitto[];
  } catch {}
  return mockRichieste;
}

export function addLead(lead: RichiestaAffitto): void {
  const all = loadLeads();
  all.unshift(lead);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {}
}
