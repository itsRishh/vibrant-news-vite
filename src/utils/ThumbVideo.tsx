import { useRef } from "react";

function isVideoSrc(src: string) {
  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(src);
}

export default function ThumbVideo({
  src,
  alt = "",
  className = "",
  mediaType,
}: {
  src?: string;
  alt?: string;
  className?: string;
  mediaType?: "image" | "video";
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const isVideo = !!src && (mediaType === "video" || isVideoSrc(src));

  if (!src) return <div className={`img-placeholder ${className}`} aria-hidden />;

  if (isVideo) {
    return (
      <video
        ref={videoRef}
        src={src}
        loop
        playsInline
        controls
        preload="metadata"
        aria-label={alt}
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`w-full h-full object-cover ${className}`}
    />
  );
}