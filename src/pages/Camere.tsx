import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { rooms, getRoomTypeLabel, type Room } from "@/data/rooms";
import {
  SlidersHorizontal, X, Wifi, Snowflake, Bath, Tv, CalendarIcon,
  RotateCcw, SearchX, LayoutGrid, List, CheckCircle2
} from "lucide-react";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem, HoverCard } from "@/components/motion/MotionWrappers";
import { cn } from "@/lib/utils";

type RoomType = Room["type"];
type SortOption = "price-asc" | "price-desc" | "sqm" | "floor";

const featureIcons: Record<string, React.ReactNode> = {
  "WiFi Fibra": <Wifi className="h-3.5 w-3.5" />,
  "Aria condizionata": <Snowflake className="h-3.5 w-3.5" />,
  "Bagno privato": <Bath className="h-3.5 w-3.5" />,
  "Smart TV": <Tv className="h-3.5 w-3.5" />,
};

const serviceFilters = ["Bagno privato", "Aria condizionata", "Smart TV", "Balcone"];
const roomTypes: RoomType[] = ["singola", "singola-plus", "doppia"];

const Camere = () => {
  const [priceRange, setPriceRange] = useState([200, 800]);
  const [types, setTypes] = useState<RoomType[]>([]);
  const [floors, setFloors] = useState<number[]>([]);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [checkInDate, setCheckInDate] = useState<Date | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("price-asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const toggleType = (t: RoomType) =>
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  const toggleFloor = (f: number) =>
    setFloors((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  const toggleService = (s: string) =>
    setSelectedServices((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const allFloors = useMemo(() => [...new Set(rooms.map((r) => r.floor))].sort(), []);

  const resetFilters = () => {
    setPriceRange([200, 800]);
    setTypes([]);
    setFloors([]);
    setOnlyAvailable(false);
    setSelectedServices([]);
    setCheckInDate(undefined);
  };

  const hasActiveFilters = types.length > 0 || floors.length > 0 || onlyAvailable || selectedServices.length > 0 || checkInDate || priceRange[0] !== 200 || priceRange[1] !== 800;

  const activeFilterCount = [
    types.length > 0,
    floors.length > 0,
    onlyAvailable,
    selectedServices.length > 0,
    checkInDate !== undefined,
    priceRange[0] !== 200 || priceRange[1] !== 800,
  ].filter(Boolean).length;

  const filtered = useMemo(() => {
    let result = rooms.filter((r) => {
      if (r.price < priceRange[0] || r.price > priceRange[1]) return false;
      if (types.length > 0 && !types.includes(r.type)) return false;
      if (floors.length > 0 && !floors.includes(r.floor)) return false;
      if (onlyAvailable && !r.available) return false;
      if (selectedServices.length > 0 && !selectedServices.every((s) => r.features.includes(s))) return false;
      return true;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "sqm": return b.sqm - a.sqm;
        case "floor": return a.floor - b.floor;
        default: return 0;
      }
    });

    return result;
  }, [priceRange, types, floors, onlyAvailable, selectedServices, sortBy]);

  const formatAvailableDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, "MMMM yyyy", { locale: it });
  };

  // Active filter chips for mobile sticky bar
  const activeChips: { label: string; onRemove: () => void }[] = [];
  types.forEach(t => activeChips.push({ label: getRoomTypeLabel(t), onRemove: () => toggleType(t) }));
  floors.forEach(f => activeChips.push({ label: `Piano ${f}`, onRemove: () => toggleFloor(f) }));
  selectedServices.forEach(s => activeChips.push({ label: s, onRemove: () => toggleService(s) }));
  if (onlyAvailable) activeChips.push({ label: "Solo disponibili", onRemove: () => setOnlyAvailable(false) });
  if (priceRange[0] !== 200 || priceRange[1] !== 800) activeChips.push({ label: `€${priceRange[0]}–€${priceRange[1]}`, onRemove: () => setPriceRange([200, 800]) });

  return (
    <Layout>
      <PageTransition>
        {/* Hero */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1400&h=500&fit=crop" alt="Camere dello studentato" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
          </div>
          <div className="container relative z-10">
            <FadeIn>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground max-w-xl">Trova la tua camera ideale</h1>
              <p className="text-muted-foreground mt-3 text-lg max-w-lg">
                Esplora le nostre camere singole, plus e doppie. Tutte arredate, con servizi inclusi e a pochi passi dall'università.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Catalog */}
        <section className="py-12">
          <div className="container">
            {/* Quick filter chips + Sort + View toggle */}
            <div className="flex flex-col gap-4 mb-8">
              {/* Top bar: count + sort + view + mobile filter btn */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <p className="text-muted-foreground text-sm">
                  {filtered.length} camere trovate
                  {hasActiveFilters && <span className="text-accent ml-1">({activeFilterCount} filtri)</span>}
                </p>

                <div className="flex items-center gap-2">
                  {/* Sort */}
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                    <SelectTrigger className="w-[180px] h-9 text-sm">
                      <SelectValue placeholder="Ordina per" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price-asc">Prezzo crescente</SelectItem>
                      <SelectItem value="price-desc">Prezzo decrescente</SelectItem>
                      <SelectItem value="sqm">Metratura</SelectItem>
                      <SelectItem value="floor">Piano</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View toggle - desktop only */}
                  <div className="hidden md:flex items-center border rounded-md">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={cn("p-2 transition-colors", viewMode === "grid" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground")}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={cn("p-2 transition-colors", viewMode === "list" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground")}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Mobile filter button with counter */}
                  <Button variant="outline" className="md:hidden h-9" onClick={() => setShowFilters(!showFilters)}>
                    {showFilters ? <X className="h-4 w-4 mr-1.5" /> : <SlidersHorizontal className="h-4 w-4 mr-1.5" />}
                    Filtri
                    {activeFilterCount > 0 && (
                      <span className="ml-1.5 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </div>
              </div>

              {/* Quick type chips */}
              <div className="flex gap-2 flex-wrap">
                {roomTypes.map((t) => (
                  <button
                    key={t}
                    onClick={() => toggleType(t)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-sm font-medium border transition-all",
                      types.includes(t)
                        ? "bg-accent text-accent-foreground border-accent"
                        : "bg-card text-muted-foreground border-border hover:border-accent/50"
                    )}
                  >
                    {getRoomTypeLabel(t)}
                  </button>
                ))}
                <button
                  onClick={() => setOnlyAvailable(!onlyAvailable)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium border transition-all flex items-center gap-1.5",
                    onlyAvailable
                      ? "bg-success/10 text-success border-success/30"
                      : "bg-card text-muted-foreground border-border hover:border-success/50"
                  )}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Disponibili
                </button>
              </div>

              {/* Mobile sticky active filter chips */}
              {!showFilters && activeChips.length > 0 && (
                <div className="flex gap-2 flex-wrap md:hidden">
                  {activeChips.map((chip, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-xs bg-accent/10 text-accent px-2.5 py-1 rounded-full">
                      {chip.label}
                      <button onClick={chip.onRemove}><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                  <button onClick={resetFilters} className="text-xs text-muted-foreground underline">Reset</button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
              {/* Sidebar filters */}
              <aside className={`${showFilters ? "block" : "hidden"} md:block rounded-xl border bg-card p-5`}>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-semibold text-foreground">Filtri</h3>
                    {hasActiveFilters && (
                      <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs text-muted-foreground hover:text-foreground">
                        <RotateCcw className="h-3 w-3 mr-1" /> Reset
                      </Button>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-3 text-foreground">Tipo camera</h4>
                    <div className="space-y-2">
                      {roomTypes.map((t) => (
                        <label key={t} className="flex items-center gap-2 text-sm cursor-pointer">
                          <Checkbox checked={types.includes(t)} onCheckedChange={() => toggleType(t)} />
                          <span className="text-foreground">{getRoomTypeLabel(t)}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-3 text-foreground">Piano</h4>
                    <div className="space-y-2">
                      {allFloors.map((f) => (
                        <label key={f} className="flex items-center gap-2 text-sm cursor-pointer">
                          <Checkbox checked={floors.includes(f)} onCheckedChange={() => toggleFloor(f)} />
                          <span className="text-foreground">Piano {f}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-3 text-foreground">Prezzo mensile</h4>
                    <Slider min={200} max={800} step={10} value={priceRange} onValueChange={setPriceRange} className="mb-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>€{priceRange[0]}</span><span>€{priceRange[1]}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-3 text-foreground">Servizi inclusi</h4>
                    <div className="space-y-2">
                      {serviceFilters.map((s) => (
                        <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                          <Checkbox checked={selectedServices.includes(s)} onCheckedChange={() => toggleService(s)} />
                          <span className="text-foreground">{s}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-3 text-foreground">Disponibilità da</h4>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !checkInDate && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkInDate ? format(checkInDate, "d MMMM yyyy", { locale: it }) : "Seleziona data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={checkInDate} onSelect={setCheckInDate} initialFocus className="p-3 pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox checked={onlyAvailable} onCheckedChange={(v) => setOnlyAvailable(!!v)} />
                    <span className="text-foreground">Solo disponibili</span>
                  </label>
                </div>
              </aside>

              {/* Results */}
              {viewMode === "grid" ? (
                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filtered.map((room) => (
                    <StaggerItem key={room.id}>
                      <HoverCard>
                        <Link to={`/camere/${room.id}`} className="block group">
                          <div className="rounded-xl overflow-hidden border bg-card">
                            <div className="relative aspect-video overflow-hidden">
                              <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                              <Badge className={`absolute top-3 left-3 ${room.available ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}`}>
                                {room.available ? "Disponibile" : "Occupata"}
                              </Badge>
                              <Badge variant="secondary" className="absolute top-3 right-3">{getRoomTypeLabel(room.type)}</Badge>
                            </div>
                            <div className="p-5">
                              <h3 className="font-heading font-semibold text-card-foreground">{room.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{room.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">{room.sqm} m² · Piano {room.floor} · Da {formatAvailableDate(room.availableFrom)}</p>
                              <div className="flex gap-2 mt-2 flex-wrap">
                                {room.features.slice(0, 4).map((f) => (
                                  <span key={f} className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                    {featureIcons[f] || null} {f}
                                  </span>
                                ))}
                              </div>
                              <div className="flex items-end justify-between mt-4">
                                <div>
                                  <span className="text-2xl font-bold text-accent">€{room.price}</span>
                                  <span className="text-sm text-muted-foreground">/mese</span>
                                  <p className="text-xs text-success font-medium">tutto incluso</p>
                                </div>
                                <span className="text-sm text-accent font-medium group-hover:underline">Dettagli →</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </HoverCard>
                    </StaggerItem>
                  ))}
                  {filtered.length === 0 && <EmptyState onReset={resetFilters} />}
                </StaggerContainer>
              ) : (
                <div className="space-y-4">
                  {filtered.map((room) => (
                    <HoverCard key={room.id}>
                      <Link to={`/camere/${room.id}`} className="block group">
                        <div className="rounded-xl overflow-hidden border bg-card flex flex-col sm:flex-row">
                          <div className="relative w-full sm:w-64 h-48 sm:h-auto overflow-hidden flex-shrink-0">
                            <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                            <Badge className={`absolute top-3 left-3 ${room.available ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}`}>
                              {room.available ? "Disponibile" : "Occupata"}
                            </Badge>
                          </div>
                          <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-heading font-semibold text-card-foreground">{room.name}</h3>
                                <Badge variant="secondary" className="text-xs">{getRoomTypeLabel(room.type)}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">{room.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">{room.sqm} m² · Piano {room.floor} · Da {formatAvailableDate(room.availableFrom)}</p>
                              <div className="flex gap-2 mt-2 flex-wrap">
                                {room.features.slice(0, 5).map((f) => (
                                  <span key={f} className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                    {featureIcons[f] || null} {f}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-end justify-between mt-3">
                              <div>
                                <span className="text-2xl font-bold text-accent">€{room.price}</span>
                                <span className="text-sm text-muted-foreground">/mese</span>
                                <p className="text-xs text-success font-medium">tutto incluso</p>
                              </div>
                              <span className="text-sm text-accent font-medium group-hover:underline">Dettagli →</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </HoverCard>
                  ))}
                  {filtered.length === 0 && <EmptyState onReset={resetFilters} />}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA */}
        <FadeIn>
          <section className="py-16 bg-muted/50">
            <div className="container text-center">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Non trovi la camera giusta?</h2>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Scrivici e ti aiuteremo a trovare la soluzione perfetta per le tue esigenze.
              </p>
              <Button size="lg" className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                <Link to="/contatti">Scrivici — ti aiutiamo a scegliere</Link>
              </Button>
            </div>
          </section>
        </FadeIn>
      </PageTransition>
    </Layout>
  );
};

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="col-span-full text-center py-16">
      <SearchX className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
      <p className="text-lg font-heading font-semibold text-foreground">Nessuna camera trovata</p>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
        I filtri selezionati non corrispondono a nessuna camera. Prova a modificarli o resettali.
      </p>
      <Button variant="outline" size="sm" className="mt-4" onClick={onReset}>
        <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Resetta filtri
      </Button>
    </div>
  );
}

export default Camere;
