import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { mockNotifications } from "@/data/mockData";
import { cn } from "@/lib/utils";

const tipoIcon: Record<string, string> = {
  richiesta: "🏠",
  supporto: "🎧",
  buono: "🎁",
  sistema: "⚙️",
};

export function NotificationBell() {
  const [notifications, setNotifications] = useLocalStorage("sn_notifications_v1", mockNotifications);
  const unread = notifications.filter((n) => !n.letta).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, letta: true })));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b">
          <span className="font-heading font-semibold text-sm">Notifiche</span>
          {unread > 0 && (
            <button onClick={markAllRead} className="text-xs text-primary hover:underline">
              Segna tutte lette
            </button>
          )}
        </div>
        <div className="max-h-72 overflow-y-auto divide-y">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={cn(
                "flex items-start gap-3 p-3 text-sm transition-colors",
                !n.letta && "bg-primary/5"
              )}
            >
              <span className="text-base mt-0.5">{tipoIcon[n.tipo]}</span>
              <div className="flex-1 min-w-0">
                <p className={cn("font-medium", !n.letta && "text-foreground")}>{n.titolo}</p>
                <p className="text-muted-foreground text-xs truncate">{n.messaggio}</p>
              </div>
              {!n.letta && <span className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
