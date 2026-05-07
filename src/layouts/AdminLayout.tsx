import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, BedDouble, CalendarCheck, Users, Headphones, Gift,
  BookOpen, Settings, LogOut, Newspaper, Receipt, MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import logoNapoleone from "@/assets/logo-napoleone.png";

type MenuItem = { label: string; href: string; icon: typeof LayoutDashboard };

const menuGroups: { category: string; items: MenuItem[] }[] = [
  {
    category: "OPERATIVO",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Richieste & Lead", href: "/admin/richieste", icon: CalendarCheck },
    ],
  },
  {
    category: "STUDENTI",
    items: [
      { label: "Studenti & Contratti", href: "/admin/studenti", icon: Users },
      { label: "Fatture", href: "/admin/fatture", icon: Receipt },
    ],
  },
  {
    category: "PROPRIETÀ",
    items: [
      { label: "Camere", href: "/admin/camere", icon: BedDouble },
    ],
  },
  {
    category: "COMUNITÀ",
    items: [
      { label: "Supporto", href: "/admin/supporto", icon: Headphones },
      { label: "Buoni", href: "/admin/buoni", icon: Gift },
      { label: "Guide", href: "/admin/guide", icon: BookOpen },
    ],
  },
  {
    category: "CONTENUTI",
    items: [
      { label: "Blog & SEO", href: "/admin/blog", icon: Newspaper },
    ],
  },
  {
    category: "SISTEMA",
    items: [
      { label: "Impostazioni", href: "/admin/impostazioni", icon: Settings },
    ],
  },
];

// Primary bottom-nav (4 most used)
const primaryNav: MenuItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Richieste", href: "/admin/richieste", icon: CalendarCheck },
  { label: "Studenti", href: "/admin/studenti", icon: Users },
  { label: "Fatture", href: "/admin/fatture", icon: Receipt },
];

// Secondary items shown inside the "Altro" sheet
const secondaryNav: MenuItem[] = [
  { label: "Supporto", href: "/admin/supporto", icon: Headphones },
  { label: "Camere", href: "/admin/camere", icon: BedDouble },
  { label: "Buoni", href: "/admin/buoni", icon: Gift },
  { label: "Guide", href: "/admin/guide", icon: BookOpen },
  { label: "Blog & SEO", href: "/admin/blog", icon: Newspaper },
  { label: "Impostazioni", href: "/admin/impostazioni", icon: Settings },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [moreOpen, setMoreOpen] = useState(false);

  const handleLogout = async () => {
    try { await signOut(); } catch (_) {}
    navigate("/");
  };

  const isActive = (href: string) =>
    href === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(href);

  // "Altro" button is active if current page is in secondaryNav
  const moreActive = secondaryNav.some((item) => isActive(item.href));

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* ── Sidebar desktop ─────────────────────────────────── */}
      <aside className="hidden md:flex w-64 flex-col bg-card border-r shrink-0">
        <div className="p-4 border-b">
          <Link to="/admin" className="flex items-center gap-2.5">
            <img src={logoNapoleone} alt="Studentato Napoleone" className="h-8 w-8 rounded-lg object-cover" />
            <div>
              <p className="font-heading font-bold text-sm leading-tight">Studentato</p>
              <p className="font-heading font-bold text-sm leading-tight text-primary">Napoleone</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {menuGroups.map((group) => (
            <div key={group.category}>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-3 mb-1">
                {group.category}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="p-3 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Esci
          </button>
        </div>
      </aside>

      {/* ── Mobile bottom nav ───────────────────────────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t flex justify-around pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {primaryNav.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-2 text-[10px] font-medium flex-1 min-w-0",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}

        {/* "Altro" sheet slot */}
        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetTrigger asChild>
            <button
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-2 text-[10px] font-medium flex-1 min-w-0",
                moreActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <MoreHorizontal className="h-5 w-5" />
              <span>Altro</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl max-h-[80vh]">
            <SheetHeader className="text-left pb-2">
              <SheetTitle>Menu admin</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-3 gap-3 py-3">
              {secondaryNav.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMoreOpen(false)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-xl text-center transition-colors",
                      active ? "bg-primary/10 text-primary" : "bg-muted/50 hover:bg-muted text-foreground",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-xs font-medium leading-tight">{item.label}</span>
                  </Link>
                );
              })}
            </div>
            <button
              onClick={() => { setMoreOpen(false); handleLogout(); }}
              className="flex items-center justify-center gap-2 w-full p-3 rounded-xl border text-sm font-medium text-muted-foreground hover:bg-muted mt-1"
            >
              <LogOut className="h-4 w-4" /> Esci
            </button>
          </SheetContent>
        </Sheet>
      </div>

      {/* ── Main content ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-auto min-w-0">
        <DashboardHeader userName="Admin" userInitials="AD" />
        <main className="flex-1 pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
