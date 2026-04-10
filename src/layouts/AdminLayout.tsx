import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, BedDouble, CalendarCheck, Users, Headphones, Gift, BookOpen, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardHeader } from "@/components/DashboardHeader";

const menuItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Camere", href: "/admin/camere", icon: BedDouble },
  { label: "Prenotazioni", href: "/admin/prenotazioni", icon: CalendarCheck },
  { label: "Studenti", href: "/admin/studenti", icon: Users },
  { label: "Supporto", href: "/admin/supporto", icon: Headphones },
  { label: "Buoni", href: "/admin/buoni", icon: Gift },
  { label: "Guide", href: "/admin/guide", icon: BookOpen },
  { label: "Impostazioni", href: "/admin/impostazioni", icon: Settings },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-60 flex-col bg-card border-r">
        <div className="p-4 border-b">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-heading font-bold text-sm">SP</span>
            </div>
            <span className="font-heading font-bold text-lg">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => {
            const active = location.pathname === item.href || (item.href !== "/admin" && location.pathname.startsWith(item.href));
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
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Esci
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

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-auto">
        <DashboardHeader userName="Admin" userInitials="AD" />
        <main className="flex-1 pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
