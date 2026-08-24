export function Thumb({
  src,
  alt,
  className = "",
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  if (!src) return <div className={`img-placeholder ${className}`} aria-hidden />;
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`w-[100%] h-[100%] ${className}`}
    />
  );
}