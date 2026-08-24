import { ChevronRight } from "lucide-react";

export function SectionHead({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: string;
}) {
  return (
    <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
      <div className="section-rule min-w-0">
        <h2 className="truncate text-lg font-black tracking-tight uppercase sm:text-xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {action ? (
        <a
          href="#"
          className="flex shrink-0 items-center gap-1 text-[11px] font-bold text-primary uppercase"
        >
          {action} <ChevronRight className="h-3 w-3" />
        </a>
      ) : (
        <span />
      )}
    </div>
  );
}