import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import logoNapoleone from "@/assets/logo-napoleone.png";

const navLinks = [
  { label: "Camere", href: "/camere" },
  { label: "Servizi", href: "/servizi" },
  { label: "Vantaggi", href: "/vantaggi" },
  { label: "Community", href: "/community" },
  { label: "Contatti", href: "/contatti" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="container flex h-16 md:h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src={logoNapoleone}
            alt="Studentato Napoleone Padova"
            className="h-10 md:h-14 w-auto"
          />
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-8 relative">
          {navLinks.map((l) => {
            const isActive = location.pathname === l.href;
            return (
              <Link
                key={l.href}
                to={l.href}
                className={cn(
                  "relative text-sm font-medium transition-colors hover:text-primary py-1",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {l.label}
                {isActive && (
                  <motion.div
                    layoutId="navbar-underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild><Link to="/login">Accedi</Link></Button>
          <Button size="sm" asChild><Link to="/contatti">Richiedi info</Link></Button>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-1 md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden p-2 -mr-2" aria-label="Menu">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 pt-12">
              <nav className="flex flex-col gap-4">
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    to={l.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "text-base font-medium py-2 border-b border-border transition-colors",
                      location.pathname === l.href ? "text-primary" : "text-foreground"
                    )}
                  >
                    {l.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-2 pt-4">
                  <Button variant="outline" asChild onClick={() => setOpen(false)}>
                    <Link to="/login">Accedi</Link>
                  </Button>
                  <Button asChild onClick={() => setOpen(false)}>
                    <Link to="/contatti">Richiedi info</Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
