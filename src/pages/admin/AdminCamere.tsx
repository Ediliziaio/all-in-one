import { useState, useRef, useCallback } from "react";
import {
  Plus, LayoutGrid, List, Pencil, Image as ImageIcon, Eye,
  Upload, X, Star, ArrowLeft, ArrowRight, AlertCircle, Camera
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { rooms as initialRooms, getRoomTypeLabel, type Room } from "@/data/rooms";
import { toast } from "sonner";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem, HoverCard } from "@/components/motion/MotionWrappers";

const ALL_FEATURES = [
  "WiFi Fibra", "Aria condizionata", "Riscaldamento", "Bagno privato",
  "Bagno condiviso", "Scrivania", "Armadio", "Balcone", "Smart TV",
  "Angolo cottura", "Zona living", "Zona studio", "Vista cortile",
  "Vista giardino", "Cucina condivisa", "Lavanderia",
];

const DESC_MAX = 500;

interface RoomFormState {
  name: string;
  type: Room["type"];
  price: string;
  floor: string;
  sqm: string;
  description: string;
  features: string[];
  available: boolean;
  availableFrom: string;
  images: string[];
}

const emptyForm: RoomFormState = {
  name: "", type: "singola", price: "", floor: "", sqm: "",
  description: "", features: [], available: true, availableFrom: "",
  images: [],
};

export default function AdminCamere() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [roomList, setRoomList] = useState(initialRooms);
  const [createOpen, setCreateOpen] = useState(false);
  const [editRoom, setEditRoom] = useState<Room | null>(null);
  const [photoRoom, setPhotoRoom] = useState<Room | null>(null);
  const [form, setForm] = useState<RoomFormState>(emptyForm);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const openCreate = () => {
    setForm(emptyForm);
    setCreateOpen(true);
  };

  const openEdit = (room: Room) => {
    setEditRoom(room);
    setForm({
      name: room.name,
      type: room.type,
      price: String(room.price),
      floor: String(room.floor),
      sqm: String(room.sqm),
      description: room.description,
      features: [...room.features],
      available: room.available,
      availableFrom: room.availableFrom,
      images: [...room.images],
    });
  };

  const closeAll = () => {
    setCreateOpen(false);
    setEditRoom(null);
  };

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = 10 - form.images.length;
    if (remaining <= 0) {
      toast.error("Massimo 10 foto per camera");
      return;
    }
    const valid = Array.from(files).filter(f => f.type.startsWith("image/")).slice(0, remaining);
    const urls = valid.map(f => URL.createObjectURL(f));
    setForm(p => ({ ...p, images: [...p.images, ...urls] }));
    toast.success(`${valid.length} foto aggiunte`);
  }, [form.images.length]);

  const removeImage = (idx: number) => {
    setForm(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));
  };

  const moveImage = (idx: number, dir: -1 | 1) => {
    setForm(p => {
      const next = [...p.images];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return p;
      [next[idx], next[target]] = [next[target], next[idx]];
      return { ...p, images: next };
    });
  };

  const setCover = (idx: number) => {
    setForm(p => {
      if (idx === 0) return p;
      const next = [...p.images];
      const [pick] = next.splice(idx, 1);
      next.unshift(pick);
      return { ...p, images: next };
    });
    toast.success("Copertina impostata");
  };

  const toggleFeature = (f: string) => {
    setForm(p => ({
      ...p,
      features: p.features.includes(f) ? p.features.filter(x => x !== f) : [...p.features, f],
    }));
  };

  const saveRoom = () => {
    if (!form.name || !form.price) {
      toast.error("Nome e prezzo sono obbligatori");
      return;
    }
    if (editRoom) {
      setRoomList(prev => prev.map(r => r.id === editRoom.id ? {
        ...r,
        name: form.name,
        type: form.type,
        price: Number(form.price),
        floor: Number(form.floor) || r.floor,
        sqm: Number(form.sqm) || r.sqm,
        description: form.description,
        features: form.features,
        available: form.available,
        availableFrom: form.availableFrom || r.availableFrom,
        images: form.images.length ? form.images : r.images,
      } : r));
      toast.success("Camera aggiornata!");
    } else {
      const newRoom: Room = {
        id: `room-${Date.now()}`,
        name: form.name,
        type: form.type,
        price: Number(form.price),
        floor: Number(form.floor) || 1,
        sqm: Number(form.sqm) || 14,
        available: form.available,
        availableFrom: form.availableFrom || "2025-09-01",
        description: form.description,
        features: form.features,
        images: form.images.length ? form.images : ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop"],
      };
      setRoomList(prev => [newRoom, ...prev]);
      toast.success("Camera creata!");
    }
    closeAll();
  };

  const toggleAvailability = (id: string) => {
    setRoomList(prev => prev.map(r => r.id === id ? { ...r, available: !r.available } : r));
    toast.success("Disponibilità aggiornata");
  };

  const updatePhotoOrder = (idx: number, dir: -1 | 1) => {
    if (!photoRoom) return;
    const next = [...photoRoom.images];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setPhotoRoom({ ...photoRoom, images: next });
    setRoomList(prev => prev.map(r => r.id === photoRoom.id ? { ...r, images: next } : r));
  };

  const setPhotoCover = (idx: number) => {
    if (!photoRoom || idx === 0) return;
    const next = [...photoRoom.images];
    const [pick] = next.splice(idx, 1);
    next.unshift(pick);
    setPhotoRoom({ ...photoRoom, images: next });
    setRoomList(prev => prev.map(r => r.id === photoRoom.id ? { ...r, images: next } : r));
    toast.success("Copertina aggiornata");
  };

  const isEditing = !!editRoom;
  const dialogOpen = createOpen || isEditing;

  const renderRoomDialog = () => (
    <Dialog open={dialogOpen} onOpenChange={(o) => !o && closeAll()}>
      <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? `Modifica ${editRoom?.name}` : "Nuova Camera"}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="mt-2">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="info" className="text-xs sm:text-sm px-1 sm:px-3">Info</TabsTrigger>
            <TabsTrigger value="photos" className="text-xs sm:text-sm px-1 sm:px-3">
              Foto {form.images.length > 0 && <Badge variant="secondary" className="ml-1 sm:ml-2 h-5">{form.images.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="services" className="text-xs sm:text-sm px-1 sm:px-3">Servizi</TabsTrigger>
            <TabsTrigger value="availability" className="text-xs sm:text-sm px-1 sm:px-3"><span className="hidden sm:inline">Disponibilità</span><span className="sm:hidden">Disp.</span></TabsTrigger>
          </TabsList>

          {/* INFO */}
          <TabsContent value="info" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Nome camera *</Label>
              <Input
                placeholder="es. Singola Standard 101"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Tipo *</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Room["type"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="singola">Singola</SelectItem>
                    <SelectItem value="singola-plus">Singola Plus</SelectItem>
                    <SelectItem value="doppia">Doppia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Prezzo / mese (€) *</Label>
                <Input type="number" placeholder="480" value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Piano</Label>
                <Input type="number" placeholder="1" value={form.floor}
                  onChange={(e) => setForm({ ...form, floor: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Metri quadri</Label>
                <Input type="number" placeholder="14" value={form.sqm}
                  onChange={(e) => setForm({ ...form, sqm: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Descrizione</Label>
                <span className={`text-xs ${form.description.length > DESC_MAX ? "text-destructive" : "text-muted-foreground"}`}>
                  {form.description.length} / {DESC_MAX}
                </span>
              </div>
              <Textarea
                rows={5}
                placeholder="Descrivi atmosfera, luminosità, vista, arredamento..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                💡 Suggerimento: descrivi atmosfera e dettagli unici. Evita info già nei servizi.
              </p>
            </div>
          </TabsContent>

          {/* PHOTOS */}
          <TabsContent value="photos" className="space-y-4 pt-4">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFiles(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
              }`}
            >
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="font-medium text-foreground">Trascina foto qui o clicca per sfogliare</p>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG · max 10 foto · {form.images.length}/10 caricate</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>

            {form.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {form.images.map((img, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden border bg-muted aspect-[4/3]">
                    <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                        <Star className="h-3 w-3 mr-1 fill-current" /> Copertina
                      </Badge>
                    )}
                    <div className="absolute inset-0 bg-foreground/0 sm:group-hover:bg-foreground/60 transition-colors flex items-center justify-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                      <Button size="icon" variant="secondary" className="h-7 w-7"
                        onClick={(e) => { e.stopPropagation(); moveImage(idx, -1); }} disabled={idx === 0}>
                        <ArrowLeft className="h-3 w-3" />
                      </Button>
                      {idx !== 0 && (
                        <Button size="icon" variant="secondary" className="h-7 w-7"
                          onClick={(e) => { e.stopPropagation(); setCover(idx); }}>
                          <Star className="h-3 w-3" />
                        </Button>
                      )}
                      <Button size="icon" variant="secondary" className="h-7 w-7"
                        onClick={(e) => { e.stopPropagation(); moveImage(idx, 1); }} disabled={idx === form.images.length - 1}>
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                      <Button size="icon" variant="destructive" className="h-7 w-7"
                        onClick={(e) => { e.stopPropagation(); removeImage(idx); }}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* SERVICES */}
          <TabsContent value="services" className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">Seleziona i servizi disponibili in questa camera</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ALL_FEATURES.map((f) => {
                const active = form.features.includes(f);
                return (
                  <label
                    key={f}
                    className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                      active ? "border-primary bg-primary/5" : "border-border hover:bg-muted/30"
                    }`}
                  >
                    <Checkbox checked={active} onCheckedChange={() => toggleFeature(f)} />
                    <span className="text-sm">{f}</span>
                  </label>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">{form.features.length} servizi selezionati</p>
          </TabsContent>

          {/* AVAILABILITY */}
          <TabsContent value="availability" className="space-y-4 pt-4">
            <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
              <div>
                <p className="font-medium">Camera disponibile</p>
                <p className="text-xs text-muted-foreground">Visibile per nuove prenotazioni</p>
              </div>
              <Switch checked={form.available} onCheckedChange={(v) => setForm({ ...form, available: v })} />
            </div>
            <div className="space-y-2">
              <Label>Disponibile a partire da</Label>
              <Input type="date" value={form.availableFrom}
                onChange={(e) => setForm({ ...form, availableFrom: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Prezzo / mese (€)</Label>
              <Input type="number" value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2 mt-2">
          <Button variant="outline" onClick={closeAll}>Annulla</Button>
          <Button onClick={saveRoom}>{isEditing ? "Salva modifiche" : "Crea camera"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <PageTransition className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold">Gestione Camere</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">{roomList.length} camere totali · {roomList.filter(r => r.available).length} disponibili</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border rounded-lg">
              <button onClick={() => setView("grid")} className={`p-2 ${view === "grid" ? "bg-muted" : ""}`}><LayoutGrid className="h-4 w-4" /></button>
              <button onClick={() => setView("list")} className={`p-2 ${view === "list" ? "bg-muted" : ""}`}><List className="h-4 w-4" /></button>
            </div>
            <Button onClick={openCreate} className="flex-1 sm:flex-initial">
              <Plus className="h-4 w-4 mr-2" /> <span className="hidden sm:inline">Aggiungi Camera</span><span className="sm:hidden">Aggiungi</span>
            </Button>
          </div>
        </div>
      </FadeIn>

      {view === "grid" ? (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roomList.map((room) => (
            <StaggerItem key={room.id}>
              <HoverCard>
                <Card className="overflow-hidden group">
                  <div className="relative">
                    <img src={room.images[0]} alt={room.name} className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105" />
                    <Badge className="absolute top-2 left-2 bg-background/90 text-foreground backdrop-blur-sm">
                      <Camera className="h-3 w-3 mr-1" /> {room.images.length} foto
                    </Badge>
                    <Badge className={`absolute top-2 right-2 backdrop-blur-sm ${room.available ? "bg-success/90 text-success-foreground" : "bg-destructive/90 text-destructive-foreground"}`}>
                      {room.available ? "Disponibile" : "Occupata"}
                    </Badge>
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/60 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <Button size="sm" variant="secondary" onClick={() => openEdit(room)}>
                        <Pencil className="h-3 w-3 mr-1" /> Modifica
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => setPhotoRoom(room)}>
                        <ImageIcon className="h-3 w-3 mr-1" /> Foto
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => toggleAvailability(room.id)}>
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-heading font-semibold truncate">{room.name}</p>
                        <p className="text-xs text-muted-foreground">{getRoomTypeLabel(room.type)} · {room.sqm}mq · Piano {room.floor}</p>
                      </div>
                      <p className="text-lg font-bold text-primary shrink-0">{room.price}€</p>
                    </div>
                    {!room.description && (
                      <div className="flex items-center gap-1.5 text-xs text-destructive bg-destructive/10 px-2 py-1 rounded">
                        <AlertCircle className="h-3 w-3" /> Descrizione mancante
                      </div>
                    )}
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
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{room.name}</p>
                    <p className="text-xs text-muted-foreground">{getRoomTypeLabel(room.type)} · {room.sqm}mq · {room.images.length} foto</p>
                  </div>
                  <p className="font-bold text-primary">{room.price}€</p>
                  <Badge className={room.available ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}>
                    {room.available ? "Disponibile" : "Occupata"}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => setPhotoRoom(room)}><ImageIcon className="h-3 w-3" /></Button>
                  <Button variant="outline" size="sm" onClick={() => openEdit(room)}><Pencil className="h-3 w-3" /></Button>
                </div>
              ))}
            </div>
          </Card>
        </FadeIn>
      )}

      {renderRoomDialog()}

      {/* Photo manager dialog */}
      <Dialog open={!!photoRoom} onOpenChange={(o) => !o && setPhotoRoom(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Galleria foto — {photoRoom?.name}</DialogTitle>
          </DialogHeader>
          {photoRoom && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Riordina le foto con le frecce o imposta una copertina con la stella.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photoRoom.images.map((img, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden border bg-muted aspect-[4/3]">
                    <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                        <Star className="h-3 w-3 mr-1 fill-current" /> Copertina
                      </Badge>
                    )}
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/60 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                      <Button size="icon" variant="secondary" className="h-7 w-7"
                        onClick={() => updatePhotoOrder(idx, -1)} disabled={idx === 0}>
                        <ArrowLeft className="h-3 w-3" />
                      </Button>
                      {idx !== 0 && (
                        <Button size="icon" variant="secondary" className="h-7 w-7" onClick={() => setPhotoCover(idx)}>
                          <Star className="h-3 w-3" />
                        </Button>
                      )}
                      <Button size="icon" variant="secondary" className="h-7 w-7"
                        onClick={() => updatePhotoOrder(idx, 1)} disabled={idx === photoRoom.images.length - 1}>
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
