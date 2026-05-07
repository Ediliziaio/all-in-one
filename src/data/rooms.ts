import cameraMatrimonialeRossa from "@/assets/camera-matrimoniale-rossa.jpg";
import cameraDoppiaTurchese from "@/assets/camera-doppia-turchese.jpg";
import cameraMansardaTravi from "@/assets/camera-mansarda-travi.jpg";

export interface Room {
  id: string;
  name: string;
  type: "singola" | "doppia";
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
    availableFrom: "2026-09-01",
    description: "Camera singola luminosa con scrivania ampia, armadio a muro e bagno privato. Ideale per chi cerca tranquillità e concentrazione.",
    features: ["Bagno privato", "Scrivania", "Armadio", "WiFi", "Aria condizionata"],
    images: [cameraMatrimonialeRossa, cameraMansardaTravi, cameraDoppiaTurchese],
  },
  {
    id: "singola-205",
    name: "Singola Standard 205",
    type: "singola",
    price: 480,
    floor: 2,
    sqm: 15,
    available: true,
    availableFrom: "2026-09-01",
    description: "Camera singola al secondo piano con vista sul cortile interno. Ambiente sereno, perfetto per lo studio.",
    features: ["Bagno privato", "Scrivania", "Armadio", "WiFi", "Vista cortile"],
    images: [cameraMatrimonialeRossa, cameraDoppiaTurchese, cameraMansardaTravi],
  },
  {
    id: "doppia-103",
    name: "Doppia 103",
    type: "doppia",
    price: 390,
    floor: 1,
    sqm: 24,
    available: true,
    availableFrom: "2026-09-01",
    description: "Camera doppia spaziosa con due letti singoli, due scrivanie e bagno condiviso. Perfetta per chi ama la compagnia.",
    features: ["Bagno condiviso", "2 Scrivanie", "2 Armadi", "WiFi", "Aria condizionata"],
    images: [cameraDoppiaTurchese, cameraMatrimonialeRossa, cameraMansardaTravi],
  },
  {
    id: "doppia-204",
    name: "Doppia 204",
    type: "doppia",
    price: 390,
    floor: 2,
    sqm: 26,
    available: true,
    availableFrom: "2026-10-01",
    description: "Camera doppia al secondo piano, ampia e luminosa con finestre su due lati. Arredata con gusto moderno.",
    features: ["Bagno condiviso", "2 Scrivanie", "2 Armadi", "WiFi", "Vista giardino"],
    images: [cameraDoppiaTurchese, cameraMansardaTravi, cameraMatrimonialeRossa],
  },
];

export const getRoomById = (id: string) => rooms.find((r) => r.id === id);

export const getRoomTypeLabel = (type: Room["type"]) => {
  switch (type) {
    case "singola": return "Singola";
    case "doppia": return "Posto letto in Doppia";
  }
};
