import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Camere", href: "/camere" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-heading font-bold text-sm">SP</span>
          </div>
          <span className="font-heading font-bold text-xl text-foreground">StudentatoPD</span>
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-accent",
                location.pathname === l.href ? "text-accent" : "text-muted-foreground"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild><Link to="/login">Accedi</Link></Button>
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild><Link to="/camere">Prenota Ora</Link></Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-background px-4 pb-4 pt-2 space-y-3">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block py-2 text-sm font-medium",
                location.pathname === l.href ? "text-accent" : "text-muted-foreground"
              )}
            >
              {l.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" size="sm" className="flex-1">Accedi</Button>
            <Button size="sm" className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">Prenota Ora</Button>
          </div>
        </div>
      )}
    </header>
  );
}
