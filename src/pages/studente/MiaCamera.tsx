import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Check } from "lucide-react";
import { currentUser, mockProfiles } from "@/data/mockData";
import { getRoomById } from "@/data/rooms";

export default function MiaCamera() {
  const room = currentUser.camera_id ? getRoomById(currentUser.camera_id) : null;

  if (!room) return <div className="p-6 text-center text-muted-foreground">Nessuna camera assegnata</div>;

  const neighbors = mockProfiles.filter((p) => p.role === "student" && p.piano === currentUser.piano && p.id !== currentUser.id);

  return (
    <div className="p-6 space-y-6">
      <h1 className="font-heading text-2xl font-bold">La Mia Camera</h1>

      {/* Galleria */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {room.images.slice(0, 4).map((img, i) => (
          <img key={i} src={img} alt={`Foto ${i + 1}`} className={`rounded-xl object-cover w-full ${i === 0 ? "col-span-2 row-span-2 h-64" : "h-32"}`} />
        ))}
      </div>

      {/* Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h2 className="font-heading text-xl font-bold">{room.name}</h2>
            <p className="text-muted-foreground">Piano {room.floor} · {room.sqm}mq · {room.price}€/mese</p>
          </div>
          <p className="text-sm">{room.description}</p>
          <div className="space-y-2">
            <h3 className="font-heading font-semibold">Servizi inclusi</h3>
            <div className="flex flex-wrap gap-2">
              {room.features.map((f) => (
                <Badge key={f} variant="outline" className="gap-1"><Check className="h-3 w-3 text-green-500" />{f}</Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Compagni di piano */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="font-heading font-semibold">Compagni di piano</h3>
              {neighbors.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nessun altro studente nel tuo piano</p>
              ) : neighbors.map((n) => (
                <div key={n.id} className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={n.avatar} />
                    <AvatarFallback>{n.nome[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{n.nome} {n.cognome}</p>
                    <p className="text-xs text-muted-foreground">{n.corso}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Storico pagamenti mock */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="font-heading font-semibold">Storico pagamenti</h3>
              {["Giugno 2025", "Maggio 2025", "Aprile 2025"].map((m, i) => (
                <div key={m} className="flex items-center justify-between text-sm">
                  <span>{m}</span>
                  <span className="font-medium">{room.price}€</span>
                  <Badge className="bg-green-100 text-green-700">Pagato</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
