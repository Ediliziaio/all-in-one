import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-accent-foreground font-heading font-bold text-sm">SP</span>
              </div>
              <span className="font-heading font-bold text-xl">StudentatoPD</span>
            </div>
            <p className="text-sm text-primary-foreground/70">
              La tua casa a Padova. Alloggi moderni per studenti universitari.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading font-semibold mb-3">Navigazione</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link to="/camere" className="hover:text-accent transition-colors">Camere</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-3">Servizi</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>WiFi Fibra</li>
              <li>Lavanderia</li>
              <li>Cucina Comune</li>
              <li>Palestra</li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-3">Contatti</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>Via Esempio 42, 35121 Padova</li>
              <li>info@studentatopd.it</li>
              <li>+39 049 123 4567</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-sm text-primary-foreground/50">
          © {new Date().getFullYear()} StudentatoPD. Tutti i diritti riservati.
        </div>
      </div>
    </footer>
  );
}
