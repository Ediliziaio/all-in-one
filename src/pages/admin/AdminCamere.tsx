import { useState } from "react";
import { Plus, LayoutGrid, List, Pencil, Image, ToggleLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { rooms as initialRooms, getRoomTypeLabel, type Room } from "@/data/rooms";
import { toast } from "sonner";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem, HoverCard } from "@/components/motion/MotionWrappers";

export default function AdminCamere() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [roomList, setRoomList] = useState(initialRooms);
  const [editRoom, setEditRoom] = useState<Room | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const openEdit = (room: Room) => {
    setEditRoom(room);
    setEditName(room.name);
    setEditPrice(String(room.price));
    setEditDesc(room.description);
  };

  const saveEdit = () => {
    if (!editRoom) return;
    setRoomList((prev) =>
      prev.map((r) =>
        r.id === editRoom.id
          ? { ...r, name: editName, price: Number(editPrice), description: editDesc }
          : r
      )
    );
    setEditRoom(null);
    toast.success("Camera aggiornata!");
  };

  const toggleAvailability = (id: string) => {
    setRoomList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, available: !r.available } : r))
    );
    toast.success("Disponibilità aggiornata!");
  };

  return (
    <PageTransition className="p-6 space-y-6">
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold">Gestione Camere</h1>
            <p className="text-sm text-muted-foreground">{roomList.length} camere totali</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border rounded-lg">
              <button onClick={() => setView("grid")} className={`p-2 ${view === "grid" ? "bg-muted" : ""}`}><LayoutGrid className="h-4 w-4" /></button>
              <button onClick={() => setView("list")} className={`p-2 ${view === "list" ? "bg-muted" : ""}`}><List className="h-4 w-4" /></button>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Aggiungi Camera
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle>Nuova Camera</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2"><Label>Nome camera</Label><Input placeholder="Camera 101" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <Select><SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
                        <SelectContent><SelectItem value="singola">Singola</SelectItem><SelectItem value="singola-plus">Singola Plus</SelectItem><SelectItem value="doppia">Doppia</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label>Prezzo/mese (€)</Label><Input type="number" placeholder="480" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2"><Label>Piano</Label><Input type="number" placeholder="1" /></div>
                    <div className="space-y-2"><Label>Mq</Label><Input type="number" placeholder="14" /></div>
                  </div>
                  <div className="space-y-2"><Label>Descrizione</Label><Textarea placeholder="Descrizione della camera..." /></div>
                  <Button className="w-full" onClick={() => toast.success("Camera aggiunta!")}>Salva Camera</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </FadeIn>

      {view === "grid" ? (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roomList.map((room) => (
            <StaggerItem key={room.id}>
              <HoverCard>
                <Card className="overflow-hidden">
                  <img src={room.images[0]} alt={room.name} className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105" />
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-heading font-semibold">{room.name}</p>
                        <p className="text-sm text-muted-foreground">{getRoomTypeLabel(room.type)} · {room.sqm}mq · Piano {room.floor}</p>
                      </div>
                      <Badge className={room.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                        {room.available ? "Disponibile" : "Occupata"}
                      </Badge>
                    </div>
                    <p className="text-lg font-bold text-primary">{room.price}€<span className="text-sm font-normal text-muted-foreground">/mese</span></p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(room)}><Pencil className="h-3 w-3 mr-1" />Modifica</Button>
                      <Button variant="outline" size="sm" onClick={() => toast.success("Upload foto simulato!")}><Image className="h-3 w-3 mr-1" />Foto</Button>
                      <Button variant="ghost" size="sm" onClick={() => toggleAvailability(room.id)}><ToggleLeft className="h-3 w-3" /></Button>
                    </div>
                  </CardContent>
                </Card>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      ) : (
        <FadeIn>
          <Card>
            <div className="divide-y">
              {roomList.map((room) => (
                <div key={room.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                  <img src={room.images[0]} alt={room.name} className="h-12 w-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-medium">{room.name}</p>
                    <p className="text-xs text-muted-foreground">{getRoomTypeLabel(room.type)} · {room.sqm}mq</p>
                  </div>
                  <p className="font-bold text-primary">{room.price}€</p>
                  <Badge className={room.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                    {room.available ? "Disponibile" : "Occupata"}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => openEdit(room)}><Pencil className="h-3 w-3" /></Button>
                </div>
              ))}
            </div>
          </Card>
        </FadeIn>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editRoom} onOpenChange={() => setEditRoom(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Modifica Camera</DialogTitle></DialogHeader>
          {editRoom && (
            <div className="space-y-4">
              <div className="space-y-2"><Label>Nome</Label><Input value={editName} onChange={(e) => setEditName(e.target.value)} /></div>
              <div className="space-y-2"><Label>Prezzo (€/mese)</Label><Input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} /></div>
              <div className="space-y-2"><Label>Descrizione</Label><Textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} /></div>
              <Button className="w-full" onClick={saveEdit}>Salva Modifiche</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
