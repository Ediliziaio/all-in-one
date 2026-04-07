export interface Room {
  id: string;
  name: string;
  type: "singola" | "singola-plus" | "doppia";
  price: number;
  floor: number;
  sqm: number;
  available: boolean;
  availableFrom: string;
  description: string;
  features: string[];
  images: string[];
}

export const rooms: Room[] = [
  {
    id: "singola-101",
    name: "Singola Standard 101",
    type: "singola",
    price: 480,
    floor: 1,
    sqm: 14,
    available: true,
    availableFrom: "2025-09-01",
    description: "Camera singola luminosa con scrivania ampia, armadio a muro e bagno privato. Ideale per chi cerca tranquillità e concentrazione.",
    features: ["Bagno privato", "Scrivania", "Armadio", "WiFi Fibra", "Aria condizionata"],
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&h=600&fit=crop",
    ],
  },
  {
    id: "singola-205",
    name: "Singola Standard 205",
    type: "singola",
    price: 480,
    floor: 2,
    sqm: 15,
    available: true,
    availableFrom: "2025-09-01",
    description: "Camera singola al secondo piano con vista sul cortile interno. Ambiente sereno, perfetto per lo studio.",
    features: ["Bagno privato", "Scrivania", "Armadio", "WiFi Fibra", "Vista cortile"],
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&h=600&fit=crop",
    ],
  },
  {
    id: "singola-plus-102",
    name: "Singola Plus 102",
    type: "singola-plus",
    price: 580,
    floor: 1,
    sqm: 20,
    available: true,
    availableFrom: "2025-09-01",
    description: "Camera singola premium con zona living separata, angolo cottura e bagno privato con doccia a pioggia.",
    features: ["Bagno privato", "Angolo cottura", "Zona living", "WiFi Fibra", "Smart TV", "Aria condizionata"],
    images: [
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&h=600&fit=crop",
    ],
  },
  {
    id: "singola-plus-301",
    name: "Singola Plus 301",
    type: "singola-plus",
    price: 580,
    floor: 3,
    sqm: 22,
    available: false,
    availableFrom: "2026-01-01",
    description: "La nostra camera più spaziosa al terzo piano. Vista panoramica, zona studio dedicata e tutti i comfort.",
    features: ["Bagno privato", "Angolo cottura", "Zona studio", "WiFi Fibra", "Smart TV", "Balcone"],
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&h=600&fit=crop",
    ],
  },
  {
    id: "doppia-103",
    name: "Doppia 103",
    type: "doppia",
    price: 380,
    floor: 1,
    sqm: 24,
    available: true,
    availableFrom: "2025-09-01",
    description: "Camera doppia spaziosa con due letti singoli, due scrivanie e bagno condiviso. Perfetta per chi ama la compagnia.",
    features: ["Bagno condiviso", "2 Scrivanie", "2 Armadi", "WiFi Fibra", "Aria condizionata"],
    images: [
      "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&h=600&fit=crop",
    ],
  },
  {
    id: "doppia-204",
    name: "Doppia 204",
    type: "doppia",
    price: 380,
    floor: 2,
    sqm: 26,
    available: true,
    availableFrom: "2025-10-01",
    description: "Camera doppia al secondo piano, ampia e luminosa con finestre su due lati. Arredata con gusto moderno.",
    features: ["Bagno condiviso", "2 Scrivanie", "2 Armadi", "WiFi Fibra", "Vista giardino"],
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&h=600&fit=crop",
    ],
  },
];

export const getRoomById = (id: string) => rooms.find((r) => r.id === id);

export const getRoomTypeLabel = (type: Room["type"]) => {
  switch (type) {
    case "singola": return "Singola";
    case "singola-plus": return "Singola Plus";
    case "doppia": return "Doppia";
  }
};
