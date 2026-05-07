/**
 * Shared localStorage store for rooms.
 * AdminCamere writes to "sn_camere_v1" via useLocalStorage.
 * All other pages (public listing, student booking, detail) must read from here
 * so that admin changes to availability are reflected everywhere.
 */
import { rooms as initialRooms, type Room } from "./rooms";

const STORAGE_KEY = "sn_camere_v1";

export function loadRooms(): Room[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return JSON.parse(stored) as Room[];
  } catch {}
  return initialRooms;
}

export function getRoomByIdLive(id: string): Room | undefined {
  return loadRooms().find((r) => r.id === id);
}
