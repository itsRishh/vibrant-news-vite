import { useEffect, useRef, useState } from "react";

function isVideoSrc(src: string) {
  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(src);
}

/**
 * Shared singleton that tracks all in-view ThumbVideo instances and decides
 * which single one should have audio enabled (the most visible one).
 */
type Listener = (activeId: string | null) => void;

const activeVideoManager = (() => {
  const ratios = new Map<string, number>(); // id -> intersection ratio
  const listeners = new Set<Listener>();
  let activeId: string | null = null;

  function recompute() {
    let winner: string | null = null;
    let best = 0;
    for (const [id, ratio] of ratios) {
      if (ratio > best) {
        best = ratio;
        winner = id;
      }
    }
    // Require a minimum visibility before granting audio to anyone
    if (best < 0.6) winner = null;

    if (winner !== activeId) {
      activeId = winner;
      listeners.forEach((l) => l(activeId));
    }
  }

  return {
    report(id: string, ratio: number) {
      if (ratio <= 0) {
        ratios.delete(id);
      } else {
        ratios.set(id, ratio);
      }
      recompute();
    },
    unregister(id: string) {
      ratios.delete(id);
      recompute();
    },
    subscribe(listener: Listener) {
      listeners.add(listener);
      listener(activeId); // sync immediately on subscribe
        return () => {
          listeners.delete(listener);
        };
    },
  };
})();

let idCounter = 0;

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
  const idRef = useRef(`thumb-video-${++idCounter}`);
  const [isActive, setIsActive] = useState(false);

  const isVideo = !!src && (mediaType === "video" || isVideoSrc(src));

  // Report visibility ratio to the shared manager
  useEffect(() => {
    if (!isVideo || !videoRef.current) return;
    const el = videoRef.current;
    const id = idRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) activeVideoManager.report(id, entry.intersectionRatio);
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      activeVideoManager.unregister(id);
    };
  }, [isVideo]);

  // Subscribe to "who is the active video" changes
  useEffect(() => {
    if (!isVideo) return;
    const id = idRef.current;
    return activeVideoManager.subscribe((activeId) => {
      setIsActive(activeId === id);
    });
  }, [isVideo]);

  // Apply mute/unmute + play based on active state
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !isVideo) return;

    if (isActive) {
      el.muted = false;
      el.play().catch(() => {
        el.muted = true;
        el.play().catch(() => {});
      });
    } else {
      el.muted = true;
    }
  }, [isActive, isVideo]);

  if (!src) return <div className={`img-placeholder ${className}`} aria-hidden />;

  if (isVideo) {
    return (
      <video
        ref={videoRef}
        src={src}
        loop
        playsInline
        autoPlay
        muted
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