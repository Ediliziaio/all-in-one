import { Link } from "react-router-dom";
import { Instagram, MessageCircle, Phone } from "lucide-react";
import logoNapoleone from "@/assets/logo-napoleone.png";

export function Footer() {
  return (
    <footer id="footer" className="bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="inline-flex items-center bg-white rounded-lg p-2">
              <img
                src={logoNapoleone}
                alt="Studentato Napoleone Padova"
                className="h-16 w-auto"
              />
            </div>
            <p className="text-sm text-primary-foreground/70">
              La tua stanza a Padova. Alloggi moderni per studenti universitari.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.88-2.88 2.89 2.89 0 012.88-2.88c.28 0 .56.04.82.11v-3.49a6.37 6.37 0 00-.82-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52V6.8a4.84 4.84 0 01-1-.11z"/></svg>
              </a>
              <a href="https://wa.me/393923634188" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Studentato */}
          <div>
            <h4 className="font-heading font-semibold mb-3">Studentato</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link to="/camere" className="hover:text-accent transition-colors">Camere</Link></li>
              <li><Link to="/servizi" className="hover:text-accent transition-colors">Servizi</Link></li>
              <li><Link to="/vantaggi" className="hover:text-accent transition-colors">Vantaggi</Link></li>
              <li><Link to="/contatti" className="hover:text-accent transition-colors">Contatti</Link></li>
            </ul>
          </div>

          {/* Per Studenti */}
          <div>
            <h4 className="font-heading font-semibold mb-3">Per Studenti</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/login" className="hover:text-accent transition-colors">Area Riservata</Link></li>
              <li><Link to="/blog" className="hover:text-accent transition-colors">Blog & Guide</Link></li>
              <li><Link to="/vantaggi" className="hover:text-accent transition-colors">Vantaggi</Link></li>
              <li><Link to="/contatti" className="hover:text-accent transition-colors">Contatti</Link></li>
            </ul>
          </div>

          {/* Contatti */}
          <div>
            <h4 className="font-heading font-semibold mb-3">Contatti</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <a href="mailto:studentatonapoleone@gmail.com" className="hover:text-accent transition-colors">
                  studentatonapoleone@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                <a href="tel:+393923634188" className="hover:text-accent transition-colors">
                  +39 392 3634188
                </a>
              </li>
              <li className="text-primary-foreground/50 text-xs">Lun–Ven 9:00–17:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-primary-foreground/50">
          <p>© {new Date().getFullYear()} Studentato Napoleone Padova. Tutti i diritti riservati.</p>
          <div className="flex gap-4">
            <a href="mailto:studentatonapoleone@gmail.com?subject=Privacy" className="hover:text-primary-foreground transition-colors">Privacy Policy</a>
            <a href="mailto:studentatonapoleone@gmail.com?subject=Cookie" className="hover:text-primary-foreground transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
