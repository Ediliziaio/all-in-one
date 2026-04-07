import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, LayoutGrid, List, Pencil, Image, ToggleLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { rooms, getRoomTypeLabel } from "@/data/rooms";
import { useToast } from "@/hooks/use-toast";

export default function AdminCamere() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const { toast } = useToast();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Gestione Camere</h1>
          <p className="text-sm text-muted-foreground">{rooms.length} camere totali</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-lg">
            <button onClick={() => setView("grid")} className={`p-2 ${view === "grid" ? "bg-muted" : ""}`}><LayoutGrid className="h-4 w-4" /></button>
            <button onClick={() => setView("list")} className={`p-2 ${view === "list" ? "bg-muted" : ""}`}><List className="h-4 w-4" /></button>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
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
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => toast({ title: "Camera aggiunta!" })}>Salva Camera</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room, i) => (
            <motion.div key={room.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="overflow-hidden">
                <img src={room.images[0]} alt={room.name} className="w-full h-40 object-cover" />
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
                  <p className="text-lg font-bold text-accent">{room.price}€<span className="text-sm font-normal text-muted-foreground">/mese</span></p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm"><Pencil className="h-3 w-3 mr-1" />Modifica</Button>
                    <Button variant="outline" size="sm"><Image className="h-3 w-3 mr-1" />Foto</Button>
                    <Button variant="ghost" size="sm"><ToggleLeft className="h-3 w-3" /></Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <div className="divide-y">
            {rooms.map((room) => (
              <div key={room.id} className="flex items-center gap-4 p-4">
                <img src={room.images[0]} alt={room.name} className="h-12 w-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-medium">{room.name}</p>
                  <p className="text-xs text-muted-foreground">{getRoomTypeLabel(room.type)} · {room.sqm}mq</p>
                </div>
                <p className="font-bold text-accent">{room.price}€</p>
                <Badge className={room.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                  {room.available ? "Disponibile" : "Occupata"}
                </Badge>
                <Button variant="outline" size="sm"><Pencil className="h-3 w-3" /></Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
