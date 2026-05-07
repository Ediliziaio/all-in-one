import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/NotificationBell";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface DashboardHeaderProps {
  userName: string;
  userAvatar?: string;
  userInitials: string;
}

const PAGE_TITLES: Record<string, string> = {
  "/admin":                 "Dashboard",
  "/admin/richieste":       "Richieste & Lead",
  "/admin/studenti":        "Studenti",
  "/admin/fatture":         "Fatture",
  "/admin/supporto":        "Supporto",
  "/admin/camere":          "Camere",
  "/admin/buoni":           "Buoni",
  "/admin/guide":           "Guide",
  "/admin/blog":            "Blog & SEO",
  "/admin/impostazioni":    "Impostazioni",
  "/studente":              "Home",
  "/studente/camera":       "La Mia Camera",
  "/studente/prenota":      "Richiedi Camera",
  "/studente/pagamenti":    "Pagamenti",
  "/studente/documenti":    "Documenti",
  "/studente/supporto":     "Supporto",
  "/studente/community":    "Community",
  "/studente/guide":        "Guide",
  "/studente/buoni":        "Buoni",
  "/studente/profilo":      "Il Mio Profilo",
  "/studente/community/profili": "Profili",
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  // Fallback: match prefix for nested routes
  const match = Object.keys(PAGE_TITLES)
    .filter((k) => k !== "/admin" && k !== "/studente")
    .sort((a, b) => b.length - a.length)
    .find((k) => pathname.startsWith(k));
  return match ? PAGE_TITLES[match] : "Napoleone";
}

export function DashboardHeader({ userName, userAvatar, userInitials }: DashboardHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b px-4 md:px-6 py-3">
      <div className="flex items-center justify-between gap-3">
        {/* Desktop search */}
        <div className="relative flex-1 max-w-sm hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cerca..." className="pl-9 h-9 bg-muted/50 border-none" />
        </div>

        {/* Mobile: page title + search toggle */}
        <div className="md:hidden flex items-center gap-2 flex-1 min-w-0">
          {searchOpen ? (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input autoFocus placeholder="Cerca..." className="pl-9 pr-9 h-9 bg-muted/50 border-none" />
              <button onClick={() => setSearchOpen(false)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <span className="font-heading font-bold text-base truncate">{pageTitle}</span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {!searchOpen && (
            <Button variant="ghost" size="icon" className="md:hidden h-9 w-9" onClick={() => setSearchOpen(true)}>
              <Search className="h-4 w-4" />
            </Button>
          )}
          <NotificationBell />
          <div className="flex items-center gap-2 ml-1">
            <Avatar className="h-8 w-8">
              {userAvatar && <AvatarImage src={userAvatar} />}
              <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
            </Avatar>
            <span className="hidden lg:block text-sm font-medium">{userName}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
