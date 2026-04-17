import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NotificationBell } from "@/components/NotificationBell";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface DashboardHeaderProps {
  userName: string;
  userAvatar?: string;
  userInitials: string;
}

export function DashboardHeader({ userName, userAvatar, userInitials }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cerca..." className="pl-9 h-9 bg-muted/50 border-none" />
        </div>
        <div className="flex items-center gap-1">
          <NotificationBell />
          <div className="flex items-center gap-2 ml-2">
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
