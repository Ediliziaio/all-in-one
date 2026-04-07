import { motion } from "framer-motion";
import { MapPin, GraduationCap, Train, ShoppingBag, TreePine } from "lucide-react";

const distances = [
  { icon: GraduationCap, label: "Università di Padova (Bo)", distance: "5 min a piedi" },
  { icon: Train, label: "Stazione FS Padova", distance: "12 min in bus" },
  { icon: ShoppingBag, label: "Centro storico", distance: "3 min a piedi" },
  { icon: TreePine, label: "Prato della Valle", distance: "8 min in bici" },
];

export function MapSection() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Posizione strategica</h2>
          <p className="text-muted-foreground mt-3">Nel cuore di Padova, a due passi da tutto.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Distances */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {distances.map((d) => (
              <div key={d.label} className="flex items-center gap-4 rounded-xl border bg-card p-4">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <d.icon className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-card-foreground">{d.label}</p>
                  <p className="text-sm text-muted-foreground">{d.distance}</p>
                </div>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-xl overflow-hidden border aspect-square lg:aspect-[4/3]"
          >
            <iframe
              title="Posizione StudentatoPD"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2845.!2d11.8768!3d45.4064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zPadova!5e0!3m2!1sit!2sit!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
