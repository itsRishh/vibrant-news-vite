export function Badge({
  children,
  tone = "primary",
}: {
  children: React.ReactNode;
  tone?: "primary" | "ink" | "soft";
}) {
  const tones = {
    primary: "bg-primary text-primary-foreground",
    ink: "bg-ink text-background",
    soft: "bg-tint text-primary",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase ${tones[tone]}`}
    >
      {children}
    </span>
  );
}