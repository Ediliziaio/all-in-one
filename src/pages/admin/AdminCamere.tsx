import { useState, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus, LayoutGrid, List, Pencil, Image as ImageIcon, Eye,
  Upload, X, Star, ArrowLeft, ArrowRight, AlertCircle, Camera,
  Search, Download, Home, TrendingUp, BedDouble, Users, ExternalLink,
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
import { mockProfiles } from "@/data/mockData";
import { toast } from "sonner";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem, HoverCard } from "@/components/motion/MotionWrappers";
import { downloadCSV, formatEUR, todayStamp } from "@/lib/csv";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

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

  // filters
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("tutti");
  const [filterAvail, setFilterAvail] = useState<string>("tutte");
  const [filterFloor, setFilterFloor] = useState<string>("tutti");
  const [sort, setSort] = useState<"prezzo" | "piano" | "foto">("prezzo");

  // Occupant map: room_id -> profile
  const occupantMap = useMemo(() => {
    const m = new Map<string, typeof mockProfiles[number]>();
    mockProfiles.forEach(p => {
      if (p.camera_id) m.set(p.camera_id, p);
    });
    return m;
  }, []);

  const floors = useMemo(() => {
    const set = new Set(roomList.map(r => r.floor));
    return Array.from(set).sort((a, b) => a - b);
  }, [roomList]);

  const kpi = useMemo(() => {
    const total = roomList.length;
    const occupate = roomList.filter(r => !r.available).length;
    const disponibili = total - occupate;
    const tasso = total ? Math.round((occupate / total) * 100) : 0;
    const avgPrice = total ? Math.round(roomList.reduce((a, r) => a + r.price, 0) / total) : 0;
    return { total, occupate, disponibili, tasso, avgPrice };
  }, [roomList]);

  const filtered = useMemo(() => {
    let list = roomList.slice();
    if (filterType !== "tutti") list = list.filter(r => r.type === filterType);
    if (filterAvail === "disponibili") list = list.filter(r => r.available);
    if (filterAvail === "occupate") list = list.filter(r => !r.available);
    if (filterFloor !== "tutti") list = list.filter(r => String(r.floor) === filterFloor);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q),
      );
    }
    list.sort((a, b) => {
      if (sort === "piano") return a.floor - b.floor;
      if (sort === "foto") return b.images.length - a.images.length;
      return a.price - b.price;
    });
    return list;
  }, [roomList, filterType, filterAvail, filterFloor, search, sort]);

  const openCreate = () => { setForm(emptyForm); setCreateOpen(true); };

  const openEdit = (room: Room) => {
    setEditRoom(room);
    setForm({
      name: room.name, type: room.type, price: String(room.price),
      floor: String(room.floor), sqm: String(room.sqm),
      description: room.description, features: [...room.features],
      available: room.available, availableFrom: room.availableFrom,
      images: [...room.images],
    });
  };

  const closeAll = () => { setCreateOpen(false); setEditRoom(null); };

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = 10 - form.images.length;
    if (remaining <= 0) { toast.error("Massimo 10 foto per camera"); return; }
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
    if (!form.name || !form.price) { toast.error("Nome e prezzo sono obbligatori"); return; }
    if (editRoom) {
      setRoomList(prev => prev.map(r => r.id === editRoom.id ? {
        ...r,
        name: form.name, type: form.type, price: Number(form.price),
        floor: Number(form.floor) || r.floor, sqm: Number(form.sqm) || r.sqm,
        description: form.description, features: form.features,
        available: form.available, availableFrom: form.availableFrom || r.availableFrom,
        images: form.images.length ? form.images : r.images,
      } : r));
      toast.success("Camera aggiornata!");
    } else {
      const newRoom: Room = {
        id: `room-${Date.now()}`,
        name: form.name, type: form.type, price: Number(form.price),
        floor: Number(form.floor) || 1, sqm: Number(form.sqm) || 14,
        available: form.available, availableFrom: form.availableFrom || "2025-09-01",
        description: form.description, features: form.features,
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

  const handleExport = () => {
    downloadCSV(
      `camere-${todayStamp()}.csv`,
      ["Nome", "Tipo", "Prezzo", "Piano", "Mq", "Disponibile", "Servizi", "Occupante"],
      filtered.map(r => {
        const occ = occupantMap.get(r.id);
        return [
          r.name, getRoomTypeLabel(r.type), r.price, r.floor, r.sqm,
          r.available ? "Sì" : "No",
          r.features.length,
          occ ? `${occ.nome} ${occ.cognome}` : "",
        ];
      }),
    );
    toast.success(`Esportate ${filtered.length} camere`);
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

          <TabsContent value="info" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Nome camera *</Label>
              <Input placeholder="es. Singola Standard 101" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
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
              <Textarea rows={5} placeholder="Descrivi atmosfera, luminosità, vista, arredamento..."
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </TabsContent>

          <TabsContent value="photos" className="space-y-4 pt-4">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
              }`}
            >
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="font-medium text-foreground">Trascina foto qui o clicca per sfogliare</p>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG · max 10 foto · {form.images.length}/10 caricate</p>
              <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden"
                onChange={(e) => handleFiles(e.target.files)} />
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

          <TabsContent value="services" className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">Seleziona i servizi disponibili in questa camera</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ALL_FEATURES.map((f) => {
                const active = form.features.includes(f);
                return (
                  <label key={f} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                    active ? "border-primary bg-primary/5" : "border-border hover:bg-muted/30"
                  }`}>
                    <Checkbox checked={active} onCheckedChange={() => toggleFeature(f)} />
                    <span className="text-sm">{f}</span>
                  </label>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">{form.features.length} servizi selezionati</p>
          </TabsContent>

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
            <p className="text-xs sm:text-sm text-muted-foreground">{roomList.length} camere totali · {kpi.disponibili} disponibili</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border rounded-md">
              <button onClick={() => setView("grid")} className={`p-2 px-3 ${view === "grid" ? "bg-muted" : ""}`}><LayoutGrid className="h-4 w-4" /></button>
              <button onClick={() => setView("list")} className={`p-2 px-3 ${view === "list" ? "bg-muted" : ""}`}><List className="h-4 w-4" /></button>
            </div>
            <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" /><span className="hidden sm:inline">Aggiungi Camera</span><span className="sm:hidden">Aggiungi</span></Button>
          </div>
        </div>
      </FadeIn>

      {/* KPIs */}
      <FadeIn delay={0.05}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card><CardContent className="p-4">
            <div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">Totale Camere</p><Home className="h-4 w-4 text-muted-foreground" /></div>
            <p className="text-2xl font-bold mt-1">{kpi.total}</p>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">Disponibili</p><BedDouble className="h-4 w-4 text-success" /></div>
            <p className="text-2xl font-bold mt-1 text-success">{kpi.disponibili}</p>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">Tasso occupazione</p><TrendingUp className="h-4 w-4 text-primary" /></div>
            <p className="text-2xl font-bold mt-1 text-primary">{kpi.tasso}%</p>
            <p className="text-[11px] text-muted-foreground">{kpi.occupate} occupate</p>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">Canone medio</p><Users className="h-4 w-4 text-muted-foreground" /></div>
            <p className="text-2xl font-bold mt-1">{formatEUR(kpi.avgPrice)}</p>
          </CardContent></Card>
        </div>
      </FadeIn>

      {/* Occupancy historical chart */}
      <FadeIn delay={0.07}>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium">Occupazione storica (ultimi 6 mesi)</p>
            </div>
            <ChartContainer config={{ tasso: { label: "Occupazione %", color: "hsl(var(--primary))" } }} className="h-[180px] w-full">
              <LineChart
                data={["Nov", "Dic", "Gen", "Feb", "Mar", "Apr"].map((m, i) => ({
                  mese: m,
                  tasso: Math.max(0, Math.min(100, Math.round(kpi.tasso * [0.82, 0.86, 0.9, 0.93, 0.97, 1][i]))),
                }))}
                margin={{ left: 0, right: 12, top: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mese" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent formatter={(v) => `${v}%`} />} />
                <Line type="monotone" dataKey="tasso" stroke="var(--color-tasso)" strokeWidth={2} dot={{ fill: "var(--color-tasso)", r: 3 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </FadeIn>


      <FadeIn delay={0.1}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cerca per nome..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Tipo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tutti">Tutti i tipi</SelectItem>
              <SelectItem value="singola">Singola</SelectItem>
              <SelectItem value="singola-plus">Singola Plus</SelectItem>
              <SelectItem value="doppia">Doppia</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterAvail} onValueChange={setFilterAvail}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tutte">Tutte</SelectItem>
              <SelectItem value="disponibili">Disponibili</SelectItem>
              <SelectItem value="occupate">Occupate</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterFloor} onValueChange={setFilterFloor}>
            <SelectTrigger className="w-full sm:w-32"><SelectValue placeholder="Piano" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tutti">Tutti i piani</SelectItem>
              {floors.map(f => <SelectItem key={f} value={String(f)}>Piano {f}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
            <SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="prezzo">Prezzo</SelectItem>
              <SelectItem value="piano">Piano</SelectItem>
              <SelectItem value="foto">Foto count</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport}><Download className="h-4 w-4 mr-2" />CSV</Button>
        </div>
      </FadeIn>

      {filtered.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">
          <Home className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p>Nessuna camera corrisponde ai filtri</p>
        </CardContent></Card>
      ) : view === "grid" ? (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((room) => {
            const occ = occupantMap.get(room.id);
            const noPhotos = room.images.length === 0;
            const noDesc = !room.description;
            return (
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
                      {occ && (
                        <Link to="/admin/studenti" className="absolute bottom-2 left-2 right-2">
                          <Badge className="w-full bg-background/90 text-foreground backdrop-blur-sm justify-start hover:bg-background transition-colors cursor-pointer">
                            <Users className="h-3 w-3 mr-1.5" />
                            <span className="truncate flex-1 text-left">{occ.nome} {occ.cognome}</span>
                            <ExternalLink className="h-3 w-3 ml-1 opacity-60" />
                          </Badge>
                        </Link>
                      )}
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/60 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <Button size="sm" variant="secondary" onClick={() => openEdit(room)}><Pencil className="h-3 w-3 mr-1" /> Modifica</Button>
                        <Button size="sm" variant="secondary" onClick={() => setPhotoRoom(room)}><ImageIcon className="h-3 w-3 mr-1" /> Foto</Button>
                        <Button size="sm" variant="secondary" onClick={() => toggleAvailability(room.id)}><Eye className="h-3 w-3" /></Button>
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
                      {(noDesc || noPhotos) && (
                        <div className="flex items-center gap-1.5 text-xs text-destructive bg-destructive/10 px-2 py-1 rounded">
                          <AlertCircle className="h-3 w-3" />
                          {noPhotos ? "Nessuna foto" : "Descrizione mancante"}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </HoverCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      ) : (
        <FadeIn>
          <Card>
            <div className="divide-y">
              {filtered.map((room) => {
                const occ = occupantMap.get(room.id);
                return (
                  <div key={room.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                    <img src={room.images[0]} alt={room.name} className="h-12 w-16 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{room.name}</p>
                      <p className="text-xs text-muted-foreground">{getRoomTypeLabel(room.type)} · {room.sqm}mq · {room.images.length} foto · {room.features.length} servizi</p>
                    </div>
                    <div className="hidden md:block min-w-[140px]">
                      {occ ? (
                        <Link to="/admin/studenti" className="text-xs text-primary hover:underline flex items-center gap-1">
                          <Users className="h-3 w-3" />{occ.nome} {occ.cognome}
                        </Link>
                      ) : <span className="text-xs text-muted-foreground">—</span>}
                    </div>
                    <p className="font-bold text-primary">{room.price}€</p>
                    <Badge className={room.available ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}>
                      {room.available ? "Disponibile" : "Occupata"}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => setPhotoRoom(room)}><ImageIcon className="h-3 w-3" /></Button>
                    <Button variant="outline" size="sm" onClick={() => openEdit(room)}><Pencil className="h-3 w-3" /></Button>
                  </div>
                );
              })}
            </div>
          </Card>
        </FadeIn>
      )}

      {renderRoomDialog()}

      <Dialog open={!!photoRoom} onOpenChange={(o) => !o && setPhotoRoom(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Galleria foto — {photoRoom?.name}</DialogTitle>
          </DialogHeader>
          {photoRoom && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Riordina le foto con le frecce o imposta una copertina con la stella.</p>
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
                      <Button size="icon" variant="secondary" className="h-7 w-7" onClick={() => updatePhotoOrder(idx, -1)} disabled={idx === 0}><ArrowLeft className="h-3 w-3" /></Button>
                      {idx !== 0 && (
                        <Button size="icon" variant="secondary" className="h-7 w-7" onClick={() => setPhotoCover(idx)}><Star className="h-3 w-3" /></Button>
                      )}
                      <Button size="icon" variant="secondary" className="h-7 w-7" onClick={() => updatePhotoOrder(idx, 1)} disabled={idx === photoRoom.images.length - 1}><ArrowRight className="h-3 w-3" /></Button>
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
