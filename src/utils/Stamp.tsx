import { Clock } from "lucide-react";

export function Stamp({ time }: { time: string }) {
  return (
    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
      <Clock className="h-3 w-3" /> {time}
    </span>
  );
}