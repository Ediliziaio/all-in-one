import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { rooms } from "@/data/rooms";

const previewRooms = [
  rooms.find((r) => r.type === "singola")!,
  rooms.find((r) => r.type === "singola-plus")!,
  rooms.find((r) => r.type === "doppia")!,
];

export function RoomsPreview() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Le nostre camere</h2>
          <p className="text-muted-foreground mt-3">Scegli la soluzione perfetta per te.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {previewRooms.map((room, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
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
                    <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
                      {room.available ? "Disponibile" : "Occupata"}
                    </Badge>
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-semibold text-lg text-card-foreground">{room.name}</h3>
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
        </div>

        <div className="text-center mt-10">
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/camere">
              Vedi tutte le camere disponibili <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
