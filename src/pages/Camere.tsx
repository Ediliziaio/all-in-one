import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { rooms, getRoomTypeLabel, type Room } from "@/data/rooms";
import { SlidersHorizontal, X } from "lucide-react";

type RoomType = Room["type"];

const Camere = () => {
  const [priceRange, setPriceRange] = useState([300, 650]);
  const [types, setTypes] = useState<RoomType[]>([]);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const toggleType = (t: RoomType) =>
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const filtered = useMemo(() => {
    return rooms.filter((r) => {
      if (r.price < priceRange[0] || r.price > priceRange[1]) return false;
      if (types.length > 0 && !types.includes(r.type)) return false;
      if (onlyAvailable && !r.available) return false;
      return true;
    });
  }, [priceRange, types, onlyAvailable]);

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading font-semibold mb-3 text-foreground">Tipo camera</h3>
        <div className="space-y-2">
          {(["singola", "singola-plus", "doppia"] as RoomType[]).map((t) => (
            <label key={t} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={types.includes(t)} onCheckedChange={() => toggleType(t)} />
              <span className="text-foreground">{getRoomTypeLabel(t)}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-heading font-semibold mb-3 text-foreground">Prezzo mensile</h3>
        <Slider
          min={300}
          max={650}
          step={10}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>€{priceRange[0]}</span>
          <span>€{priceRange[1]}</span>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <Checkbox checked={onlyAvailable} onCheckedChange={(v) => setOnlyAvailable(!!v)} />
        <span className="text-foreground">Solo disponibili</span>
      </label>
    </div>
  );

  return (
    <Layout>
      <section className="py-12">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Le nostre camere</h1>
              <p className="text-muted-foreground mt-1">{filtered.length} camere trovate</p>
            </div>
            <Button variant="outline" className="md:hidden" onClick={() => setShowFilters(!showFilters)}>
              {showFilters ? <X className="h-4 w-4 mr-2" /> : <SlidersHorizontal className="h-4 w-4 mr-2" />}
              Filtri
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
            {/* Sidebar filters - desktop always, mobile toggle */}
            <aside className={`${showFilters ? "block" : "hidden"} md:block rounded-xl border bg-card p-5`}>
              <FilterPanel />
            </aside>

            {/* Room grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filtered.map((room, i) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link to={`/camere/${room.id}`} className="block group">
                    <div className="rounded-xl overflow-hidden border bg-card hover:shadow-lg transition-shadow">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={room.images[0]}
                          alt={room.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <Badge className={`absolute top-3 left-3 ${room.available ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}`}>
                          {room.available ? "Disponibile" : "Occupata"}
                        </Badge>
                        <Badge variant="secondary" className="absolute top-3 right-3">
                          {getRoomTypeLabel(room.type)}
                        </Badge>
                      </div>
                      <div className="p-5">
                        <h3 className="font-heading font-semibold text-card-foreground">{room.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{room.sqm} m² · Piano {room.floor}</p>
                        <div className="flex items-end justify-between mt-3">
                          <div>
                            <span className="text-2xl font-bold text-accent">€{room.price}</span>
                            <span className="text-sm text-muted-foreground">/mese</span>
                          </div>
                          <span className="text-sm text-accent font-medium group-hover:underline">Dettagli →</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}

              {filtered.length === 0 && (
                <div className="col-span-full text-center py-16 text-muted-foreground">
                  <p className="text-lg font-medium">Nessuna camera trovata</p>
                  <p className="text-sm mt-1">Prova a modificare i filtri.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Camere;
