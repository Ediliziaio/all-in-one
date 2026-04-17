import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Props {
  count: number;
  onClear: () => void;
  children: React.ReactNode;
}

export function BulkActionsBar({ count, onClear, children }: Props) {
  if (count === 0) return null;
  return (
    <div className="sticky top-2 z-20 flex items-center justify-between gap-3 rounded-lg border bg-primary text-primary-foreground shadow-lg px-4 py-2.5 animate-in slide-in-from-top-2">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/10" onClick={onClear}>
          <X className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">{count} selezionat{count === 1 ? "o" : "i"}</span>
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}
