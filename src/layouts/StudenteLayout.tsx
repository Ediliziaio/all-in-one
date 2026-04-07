import { Link, Outlet, useLocation } from "react-router-dom";
import { Home, BedDouble, Users, BookOpen, Gift, Headphones, UserCircle, LogOut } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { currentUser } from "@/data/mockData";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "Home", href: "/studente", icon: Home },
  { label: "La Mia Camera", href: "/studente/camera", icon: BedDouble },
  { label: "Community", href: "/studente/community", icon: Users },
  { label: "Guide", href: "/studente/guide", icon: BookOpen },
  { label: "Buoni", href: "/studente/buoni", icon: Gift },
  { label: "Supporto", href: "/studente/supporto", icon: Headphones },
  { label: "Profilo", href: "/studente/profilo", icon: UserCircle },
];

export default function StudenteLayout() {
  const location = useLocation();

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
            <div>
              <p className="font-heading font-semibold text-sm">{currentUser.nome} {currentUser.cognome}</p>
              <p className="text-xs text-muted-foreground">{currentUser.corso}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => {
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
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
            <LogOut className="h-4 w-4" /> Esci
          </Link>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t flex justify-around py-2">
        {menuItems.slice(0, 5).map((item) => {
          const active = location.pathname === item.href;
          return (
            <Link key={item.href} to={item.href} className={cn("flex flex-col items-center gap-1 px-2 py-1 text-xs", active ? "text-primary" : "text-muted-foreground")}>
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
}
