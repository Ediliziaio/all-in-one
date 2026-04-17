import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { rooms } from "@/data/rooms";

const previewRooms = [
  { room: rooms.find((r) => r.type === "singola")!, remaining: 7, badge: null as string | null },
  { room: rooms.find((r) => r.type === "singola-plus")!, remaining: 3, badge: "Più richiesta" },
  { room: rooms.find((r) => r.type === "doppia")!, remaining: 2, badge: null },
];

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rX = useSpring(useTransform(y, [-50, 50], [6, -6]), { stiffness: 200, damping: 20 });
  const rY = useSpring(useTransform(x, [-50, 50], [-6, 6]), { stiffness: 200, damping: 20 });

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rX, rotateY: rY, transformPerspective: 800 }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
}

export function RoomsPreview() {
  return (
    <section className="py-12 md:py-20 bg-muted/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Scegli la Tua Camera<br />
            <span className="text-primary">(Prima Che Lo Faccia Qualcun Altro)</span>
          </h2>
          <p className="text-muted-foreground mt-3">Prezzi chiari. Tutto incluso. €0 extra, mai.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {previewRooms.map(({ room, remaining, badge }, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
            >
              <TiltCard>
                <Link to={`/camere/${room.id}`} className="block group">
                  <div className="rounded-xl overflow-hidden border bg-card hover:shadow-2xl transition-shadow">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={room.images[0]}
                        alt={room.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                      {badge && (
                        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground shadow-md">
                          ⭐ {badge}
                        </Badge>
                      )}
                      <motion.div
                        animate={{ scale: [1, 1.06, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-3 right-3"
                      >
                        <Badge className="bg-destructive text-destructive-foreground text-xs shadow-md">
                          Solo {remaining} rimaste
                        </Badge>
                      </motion.div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading font-semibold text-lg text-card-foreground">{room.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{room.sqm} m² · Piano {room.floor}</p>
                      <div className="flex items-end justify-between mt-3">
                        <div>
                          <span className="text-2xl font-bold text-accent">€{room.price}</span>
                          <span className="text-sm text-muted-foreground">/mese</span>
                          <p className="text-xs text-success font-bold">tutto incluso — €0 extra, mai</p>
                        </div>
                        <span className="text-sm text-accent font-medium group-hover:underline">Dettagli →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </TiltCard>
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
