import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, BedDouble, BookOpen, Gift, Headphones, UserCircle, FileText, CreditCard, CalendarPlus, LogOut, MoreHorizontal, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { currentUser } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { DashboardHeader } from "@/components/DashboardHeader";

const sidebarItems = [
  { label: "Home", href: "/studente", icon: Home },
  { label: "La Mia Camera", href: "/studente/camera", icon: BedDouble },
  { label: "Richiedi Camera", href: "/studente/prenota", icon: CalendarPlus },
  { label: "Guide", href: "/studente/guide", icon: BookOpen },
  { label: "Buoni", href: "/studente/buoni", icon: Gift },
  { label: "Pagamenti", href: "/studente/pagamenti", icon: CreditCard },
  { label: "Documenti", href: "/studente/documenti", icon: FileText },
  { label: "Supporto", href: "/studente/supporto", icon: Headphones },
  { label: "Profilo", href: "/studente/profilo", icon: UserCircle },
];

const bottomNavItems = [
  { label: "Home",       href: "/studente",           icon: Home },
  { label: "Pagamenti",  href: "/studente/pagamenti",  icon: CreditCard },
  { label: "Supporto",   href: "/studente/supporto",   icon: Headphones },
  { label: "Profilo",    href: "/studente/profilo",    icon: UserCircle },
];

const moreMenuItems = [
  { label: "La Mia Camera",  href: "/studente/camera",    icon: BedDouble },
  { label: "Richiedi Camera",href: "/studente/prenota",   icon: CalendarPlus },
  { label: "Documenti",      href: "/studente/documenti", icon: FileText },
  { label: "Buoni",          href: "/studente/buoni",     icon: Gift },
  { label: "Guide",          href: "/studente/guide",     icon: BookOpen },
  { label: "Community",      href: "/studente/community", icon: Users },
];

export default function StudenteLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [moreOpen, setMoreOpen] = useState(false);

  const handleLogout = async () => {
    try { await signOut(); } catch (_) {}
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-60 flex-col bg-card border-r">
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback>{currentUser.nome[0]}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-heading font-semibold text-sm truncate">{currentUser.nome} {currentUser.cognome}</p>
              <p className="text-xs text-muted-foreground truncate">{currentUser.corso}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const active = location.pathname === item.href || (item.href !== "/studente" && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
            <LogOut className="h-4 w-4" /> Esci
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t flex justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {bottomNavItems.map((item) => {
          const active = location.pathname === item.href || (item.href !== "/studente" && location.pathname.startsWith(item.href));
          return (
            <Link key={item.href} to={item.href} className={cn("flex flex-col items-center gap-1 px-2 py-1 text-[11px] min-w-0 flex-1", active ? "text-primary" : "text-muted-foreground")}>
              <item.icon className="h-5 w-5" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center gap-1 px-2 py-1 text-[11px] text-muted-foreground flex-1">
              <MoreHorizontal className="h-5 w-5" />
              <span>Altro</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl max-h-[80vh]">
            <SheetHeader className="text-left">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-3 gap-3 py-4">
              {moreMenuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMoreOpen(false)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-muted/50 hover:bg-muted text-center"
                >
                  <item.icon className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
            <button
              onClick={() => { setMoreOpen(false); handleLogout(); }}
              className="flex items-center justify-center gap-2 w-full p-3 rounded-xl border text-sm font-medium text-muted-foreground hover:bg-muted"
            >
              <LogOut className="h-4 w-4" /> Esci
            </button>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex-1 flex flex-col overflow-auto min-w-0">
        <DashboardHeader
          userName={`${currentUser.nome} ${currentUser.cognome}`}
          userAvatar={currentUser.avatar}
          userInitials={`${currentUser.nome[0]}${currentUser.cognome[0]}`}
        />
        <main className="flex-1 pb-24 md:pb-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
