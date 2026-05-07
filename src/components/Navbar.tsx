import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { APP_URL } from "@/lib/domain";
import {
  Menu,
  Phone,
  Mail,
  ArrowRight,
  User,
  Bed,
  Sparkles,
  Heart,
  MessageSquare,
  MessageCircle,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import logoNapoleone from "@/assets/logo-napoleone.png";

const navLinks = [
  { label: "Camere", href: "/camere", icon: Bed },
  { label: "Servizi", href: "/servizi", icon: Sparkles },
  { label: "Vantaggi", href: "/vantaggi", icon: Heart },
  { label: "Blog", href: "/blog", icon: BookOpen },
  { label: "Contatti", href: "/contatti", icon: MessageSquare },
];

const PHONE = "+39 392 3634188";
const PHONE_HREF = "tel:+393923634188";
const EMAIL = "studentatonapoleone@gmail.com";
const EMAIL_HREF = "mailto:studentatonapoleone@gmail.com";
const WHATSAPP_HREF = "https://wa.me/393923634188";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur-lg shadow-md"
          : "bg-background border-b border-border"
      )}
    >
      {/* Top utility bar — desktop only, fades out on scroll */}
      <AnimatePresence initial={false}>
        {!scrolled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="hidden md:block overflow-hidden bg-primary text-primary-foreground"
          >
            <div className="container flex h-9 items-center justify-between text-xs">
              <div className="flex items-center gap-5">
                <a
                  href={PHONE_HREF}
                  className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>{PHONE}</span>
                </a>
                <span className="opacity-40">·</span>
                <a
                  href={EMAIL_HREF}
                  className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>{EMAIL}</span>
                </a>
              </div>
              <div className="flex items-center gap-4 opacity-90">
                <span>Lun–Ven 9:00–17:00</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main navbar row */}
      <div className="container flex h-16 md:h-20 items-center justify-between gap-4">
        {/* Logo + wordmark */}
        <Link
          to="/"
          className="flex items-center gap-3 shrink-0 group transition-transform hover:scale-[1.02]"
        >
          <img
            src={logoNapoleone}
            alt="Studentato Napoleone Padova"
            className="h-10 md:h-14 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 relative">
          {navLinks.map((l) => {
            const isActive = location.pathname === l.href;
            return (
              <Link
                key={l.href}
                to={l.href}
                className={cn(
                  "relative text-sm font-medium px-3 py-2 rounded-full transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                {l.label}
                {isActive && (
                  <motion.div
                    layoutId="navbar-underline"
                    className="absolute -bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <a href={`${APP_URL}/login`}>
              <User className="h-4 w-4" />
              Accedi
            </a>
          </Button>
          <Button
            size="sm"
            asChild
            className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md hover:shadow-lg hover:shadow-accent/20 transition-all group"
          >
            <Link to="/contatti">
              Richiedi info
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>

        {/* Mobile trigger */}
        <div className="flex items-center gap-1 md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className="p-2 rounded-lg border border-border bg-background text-foreground"
                aria-label="Apri menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[88vw] max-w-sm p-0 flex flex-col"
            >
              {/* Mobile sheet header */}
              <div className="bg-primary text-primary-foreground px-6 pt-12 pb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-white rounded-lg p-1.5 shadow-sm">
                    <img
                      src={logoNapoleone}
                      alt="Studentato Napoleone"
                      className="h-10 w-auto"
                    />
                  </div>
                  <div className="leading-tight">
                    <div className="font-display font-bold text-lg">
                      Napoleone
                    </div>
                    <div className="text-xs opacity-80">
                      La tua stanza a Padova
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile nav links */}
              <nav className="flex-1 overflow-y-auto px-3 py-4">
                {navLinks.map((l) => {
                  const Icon = l.icon;
                  const isActive = location.pathname === l.href;
                  return (
                    <Link
                      key={l.href}
                      to={l.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {l.label}
                    </Link>
                  );
                })}

                {/* Direct contact section */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Contatti diretti
                  </div>
                  <a
                    href={PHONE_HREF}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <Phone className="h-4 w-4 text-primary" />
                    {PHONE}
                  </a>
                  <a
                    href={WHATSAPP_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 text-accent" />
                    WhatsApp
                  </a>
                  <a
                    href={EMAIL_HREF}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <Mail className="h-4 w-4 text-primary" />
                    {EMAIL}
                  </a>
                </div>
              </nav>

              {/* Sticky CTAs */}
              <div className="border-t border-border p-4 space-y-2 bg-background">
                <Button
                  variant="outline"
                  className="w-full"
                  asChild
                  onClick={() => setOpen(false)}
                >
                  <a href={`${APP_URL}/login`}>
                    <User className="h-4 w-4" />
                    Accedi
                  </a>
                </Button>
                <Button
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-md"
                  asChild
                  onClick={() => setOpen(false)}
                >
                  <Link to="/contatti">
                    Richiedi info
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
