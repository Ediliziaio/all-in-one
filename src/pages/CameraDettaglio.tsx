import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getRoomById, getRoomTypeLabel, rooms } from "@/data/rooms";
import { ArrowLeft, Check, Calendar, Ruler, Layers } from "lucide-react";

const CameraDettaglio = () => {
  const { id } = useParams<{ id: string }>();
  const room = getRoomById(id || "");

  if (!room) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground">Camera non trovata</h1>
          <Button asChild className="mt-4">
            <Link to="/camere">Torna alle camere</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const similar = rooms.filter((r) => r.id !== room.id && r.type === room.type).slice(0, 2);

  return (
    <Layout>
      <section className="py-8">
        <div className="container">
          {/* Breadcrumb */}
          <Link to="/camere" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent mb-6">
            <ArrowLeft className="h-4 w-4" /> Torna alle camere
          </Link>

          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-2 rounded-xl overflow-hidden mb-8"
          >
            <img
              src={room.images[0]}
              alt={room.name}
              className="w-full h-64 md:h-[400px] object-cover"
            />
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
              {room.images.slice(1, 3).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${room.name} ${i + 2}`}
                  className="w-full h-32 md:h-[196px] object-cover"
                  loading="lazy"
                />
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
            {/* Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{room.name}</h1>
                <Badge className={room.available ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}>
                  {room.available ? "Disponibile" : "Occupata"}
                </Badge>
              </div>
              <p className="text-muted-foreground mb-6">{getRoomTypeLabel(room.type)}</p>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Ruler className="h-4 w-4" /> {room.sqm} m²
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Layers className="h-4 w-4" /> Piano {room.floor}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" /> Da {room.availableFrom}
                </div>
              </div>

              <p className="text-foreground leading-relaxed mb-8">{room.description}</p>

              <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Servizi inclusi</h2>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {room.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="h-4 w-4 text-success shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              {/* Similar rooms */}
              {similar.length > 0 && (
                <>
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Camere simili</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {similar.map((r) => (
                      <Link key={r.id} to={`/camere/${r.id}`} className="block group">
                        <div className="rounded-xl overflow-hidden border bg-card hover:shadow-md transition-shadow">
                          <img src={r.images[0]} alt={r.name} className="w-full h-40 object-cover" loading="lazy" />
                          <div className="p-4">
                            <h3 className="font-heading font-semibold text-card-foreground">{r.name}</h3>
                            <p className="text-accent font-bold mt-1">€{r.price}<span className="text-sm text-muted-foreground font-normal">/mese</span></p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:sticky lg:top-24 h-fit"
            >
              <div className="rounded-xl border bg-card p-6 space-y-4">
                <div>
                  <span className="text-3xl font-bold text-accent">€{room.price}</span>
                  <span className="text-muted-foreground">/mese</span>
                </div>
                <p className="text-sm text-muted-foreground">Tutti i servizi inclusi. Nessun costo nascosto.</p>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-base" size="lg">
                  Richiedi Prenotazione
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  Prenota una visita
                </Button>
                <p className="text-xs text-muted-foreground text-center">Risposta entro 24 ore lavorative</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CameraDettaglio;
