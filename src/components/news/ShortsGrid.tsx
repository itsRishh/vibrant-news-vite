import { useEffect, useRef, useState, useCallback } from "react";

export type Short = {
  id: string;
  src: string;
  poster?: string; // optional thumbnail image; falls back to first video frame
  alt?: string;
};

/** Play (triangle) icon */
function PlayIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M7 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 7 5.5z" />
    </svg>
  );
}

/** Close (X) icon */
function CloseIcon({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

/** Single thumbnail tile in the grid, with a centered play button overlay. */
function ShortThumb({
  short,
  onPlay,
}: {
  short: Short;
  onPlay: (short: Short) => void;
}) {
  return (
    <button
      onClick={() => onPlay(short)}
      aria-label={`Play ${short.alt || "short video"}`}
      className="relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-neutral-900
        group focus:outline-none focus:ring-2 focus:ring-white/70"
    >
      {short.poster ? (
        <img
          src={short.poster}
          alt={short.alt || ""}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <video
          src={short.src}
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      )}

      {/* Darken slightly on hover so the play icon stays legible */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

      {/* Centered play button */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <div
          className="w-12 h-12 rounded-full bg-white/90 text-black flex items-center justify-center
            shadow-lg transition-transform duration-200 group-hover:scale-110 group-active:scale-95"
        >
          <PlayIcon size={20} />
        </div>
      </div>
    </button>
  );
}

/** Fullscreen player shown when a short is selected. */
function ShortsPlayer({
  short,
  onClose,
}: {
  short: Short;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Autoplay on open — this is a deliberate user action (they clicked play),
  // so unmuted autoplay is allowed by the browser here.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.play().catch(() => {
      // If unmuted autoplay is still rejected for some reason, fall back to muted.
      el.muted = true;
      el.play().catch(() => {});
    });
  }, [short.id]);

  // Close on Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // Lock body scroll while the player is open
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      role="dialog"
      aria-modal="true"
      aria-label={short.alt || "Video player"}
      onClick={onClose} // click on the backdrop closes
    >
      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close video"
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20
          text-white flex items-center justify-center transition-colors"
      >
        <CloseIcon />
      </button>

      {/* Video, stopPropagation so clicking it doesn't close via the backdrop handler */}
      <video
        ref={videoRef}
        src={short.src}
        controls
        playsInline
        autoPlay
        loop
        className="h-full max-h-screen w-auto max-w-full sm:h-[92vh] sm:rounded-xl sm:w-auto object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

/**
 * Grid of shorts-style vertical video thumbnails. Clicking a thumbnail's
 * play button opens that video fullscreen with playback controls; closing
 * returns to the grid.
 */
export default function ShortsGrid({
  shorts,
  className = "",
}: {
  shorts: Short[];
  className?: string;
}) {
  const [activeShort, setActiveShort] = useState<Short | null>(null);

  const handlePlay = useCallback((short: Short) => setActiveShort(short), []);
  const handleClose = useCallback(() => setActiveShort(null), []);

  return (
    <>
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 ${className}`}
      >
        {shorts.map((short) => (
          <ShortThumb key={short.id} short={short} onPlay={handlePlay} />
        ))}
      </div>

      {activeShort && <ShortsPlayer short={activeShort} onClose={handleClose} />}
    </>
  );
}