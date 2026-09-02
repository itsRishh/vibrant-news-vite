import {
  ChevronRight,
  Clock,
  Play,
  Flame,
  Eye,
  X,
  ShoppingBag,
  Ticket,
  Tag,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
} from "lucide-react";
import ShortsGrid, { Short } from "./ShortsGrid";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
// import cricket from "@/assets/cricket.jpg";
import tech from "@/assets/images/ajgar.jpeg";
import adNalanda from "@/assets/images/ad-nalanda.jpg";
// import parliament from "@/assets/parliament.jpg";
import pandey from "@/assets/Videos/shorts/pandey.mp4";
import parliament from "@/assets/images/tiranga.png";
import mohan from "@/assets/images/baad.jpeg";
import racket from "@/assets/images/racket.jpeg";
import paani from "@/assets/images/paani.jpeg";
import redcarpet from "@/assets/images/profile.jpeg";
import bannerAd from "@/assets/images/ads/bannerad.jpeg";
import yatra from "@/assets/images/yatra.jpg";
import raid from "@/assets/images/raid.jpeg";
import tirangapaint from "@/assets/images/tirangapaint.jpeg";
import mohanpooja from "@/assets/images/mohanpooja.jpg";
import mohanflag from "@/assets/images/mohanflag.jpeg";
import dog from "@/assets/images/dog.jpeg";
import school from "@/assets/images/school.jpeg";
import medal from "@/assets/images/medal.jpeg";
import petrol from "@/assets/images/petrol.jpeg";
import hospAd from "@/assets/images/hospAd.jpeg";
import hospAdv from "@/assets/Videos/hospAd.mp4";
import vn1 from "@/assets/Videos/vnews/madam.mp4";
import vn2 from "@/assets/Videos/vnews/dharmendra.mp4";
import vn3 from "@/assets/Videos/wishes/WhatsApp Video 2026-08-15 at 00.23.44.mp4";
import s1 from "@/assets/Videos/shorts/hamla.mp4";
import s2 from "@/assets/Videos/shorts/paani.mp4";
import s3 from "@/assets/Videos/shorts/petrolchori.mp4";
import s4 from "@/assets/Videos/shorts/female.mp4";
import stall from "@/assets/images/stall.jpeg";
import safar2 from "@/assets/images/safar2.jpg";
import ztinews from "@/assets/images/ZTInews.png";


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

function SectionHead({
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

function Stamp({ time }: { time: string }) {
  return (
    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
      <Clock className="h-3 w-3" /> {time}
    </span>
  );
}

function Thumb({
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
      return () => listeners.delete(listener);
    },
  };
})();

let idCounter = 0;

function ThumbVideo({
  src,
  alt = "",
  className = "",
}: {
  src?: string;
  alt?: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const idRef = useRef(`thumb-video-${++idCounter}`);
  const [isActive, setIsActive] = useState(false);

  const isVideo = !!src && isVideoSrc(src);

  // Report visibility ratio to the shared manager
  useEffect(() => {
    if (!isVideo || !videoRef.current) return;
    const el = videoRef.current;
    const id = idRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => activeVideoManager.report(id, entry.intersectionRatio),
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

type CardItem = {
  city?: string;
  category?: string;
  badge?: string;
  tag?: string;
  title: string;
  subHead?: string;
  time?: string;
};

type ActiveVideo = { src: string; title: string } | null;

/** Fullscreen overlay player — opened when a thumbnail's play button is clicked. */
function VideoLightbox({ video, onClose }: { video: NonNullable<ActiveVideo>; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Genuine user click opened this, so unmuted autoplay is allowed.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.play().catch(() => {
      el.muted = true;
      el.play().catch(() => {});
    });
  }, [video.src]);

  // Close on Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // Lock body scroll while open
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 px-4"
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
      onClick={onClose} // backdrop click closes
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close video"
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20
          text-white flex items-center justify-center transition-colors"
      >
        <X className="h-5 w-5" />
      </button>

      <video
        ref={videoRef}
        src={video.src}
        controls
        playsInline
        autoPlay
        muted={true}
        loop
        className="h-full max-h-screen w-auto max-w-full sm:h-[92vh] sm:rounded-xl object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

/** Circular play button overlaid on a thumbnail. */
function PlayButton({ onClick, size = "md" }: { onClick: (e: React.MouseEvent) => void; size?: "sm" | "md" }) {
  const dims = size === "sm" ? "w-9 h-9" : "w-12 h-12";
  const iconDims = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <button
      onClick={onClick}
      aria-label="Play video"
      className={`absolute inset-0 m-auto ${dims} rounded-full bg-white/90 text-black flex items-center justify-center
        shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95 z-[1]`}
    >
      <Play className={iconDims} fill="currentColor" />
    </button>
  );
}

export function PreAds () {
   return(
    <div className="mx-auto max-w-[1250px] sm:px-4 px-4 lg:px-0 mt-3 border border-border">
      <div className="p-3">
            <Badge>Ad</Badge>
          </div>
      <div className="container grid gap-3 lg:grid-cols-4">
        <div className="grid gap-3 col-span-3">
        <article className="group relative overflow-hidden border border-border lg:h-76">
          <video autoPlay src={hospAdv} />
        </article>
      </div>
      <div className="col-span-1 hidden lg:block">
        <article className="group relative overflow-hidden border border-border">
          <img className="w-full h-full" src={hospAd} alt="" />
        </article>
      </div>
      </div>
    </div>
   )
}

export function Live() {
  const { t } = useTranslation();

  return (
    <section className="w-full py-4 sm:px-0">
      <SectionHead
        title={t("BREAKING LIVE")}
      />
      <div className="mx-auto aspect-video w-full max-w-4xl overflow-hidden">
        <iframe
          className="h-full w-full"
          src="https://www.youtube.com/embed/UyvUsjcTtxE?si=bxVU0YgUuDa3HSL9"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </section>
  );
}

const STATE_TABS = ["उत्तर प्रदेश", "बिहार", "दिल्ली", "उत्तराखंड", "मध्य प्रदेश", "राजस्थान", "बंगाल", "छत्तीसगढ़", "झारखंड", "महाराष्ट्र"];

// latest


// quick news below latest
export function QuickLatest() {
  const { t } = useTranslation();
  const items = t("sections.quickLatest.items", { returnObjects: true }) as CardItem[];

  return (
    <section className="lg:max-w-[1250px] max-w-[100vw] sm:px-4 px-4 lg:px-0 pt-6 my-4">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {items.map((r) => (
          <article
            key={r.title}
            className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 border border-border p-3 transition-colors hover:border-primary"
          >
            <span className="h-fit shrink-0">
              <Badge tone="soft">{r.city}</Badge>
            </span>
            <div className="min-w-0">
              <h3 className="text-xs font-bold">{r.title}</h3>
              <div className="mt-1.5">
                <Stamp time={r.time ?? ""} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// local

// ad after local 
export function BannerAd() {
  const { t } = useTranslation();

  return (
    <section className="lg:max-w-[1250px] max-w-[100vw] sm:px-4 px-4 lg:px-0 border border-border bg-tint">
      <div className="p-3">
            <Badge>Ad</Badge>
          </div>
      <div className="grid gap-3">
        <article className="group relative overflow-hidden border border-border">
          <img src={bannerAd} alt="" />
        </article>
      </div>
    </section>
  );
}

// regional
export function Regional() {
  const { t } = useTranslation();
  const items = t("sections.regional.items", { returnObjects: true }) as CardItem[];
  const cards = t("sections.regional.cards", { returnObjects: true }) as CardItem[];
  const cardImages = [medal, petrol, dog, school];

  return (
    <section className="lg:max-w-[1250px] max-w-[100vw] sm:px-4 px-4 lg:px-0 pt-6">
      <SectionHead title={t("sections.regional.title")} subtitle={t("sections.regional.subtitle")} />

      <article className="group relative overflow-hidden">
        <Thumb src={yatra} alt={t("sections.regional.heroTitle")} className="h-64 w-full sm:h-80" />
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink via-ink/70 to-transparent p-5">
          <Badge>{t("sections.regional.featured")}</Badge>
          <h3 className="mt-2 text-lg font-black text-background sm:text-2xl">
            {t("sections.regional.heroTitle")}
          </h3>
          <p className="hidden lg:block mt-1 text-[11px] text-background/70">{t("sections.regional.heroDesc")}</p>
        </div>
      </article>

      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {cards.slice(0, 4).map((c, i) => (
            <article key={c.title} className="group overflow-hidden border border-border">
              <div className="relative h-32 overflow-hidden">
                <Thumb
                  src={cardImages[i]}
                  alt={c.title}
                  className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-2 left-2">
                  <Badge>{c.category}</Badge>
                </span>
                {c.badge && (
                  <span className="absolute top-2 right-2 bg-ink px-2 py-0.5 text-[9px] font-bold text-background">
                    {c.badge}
                  </span>
                )}
              </div>
              <div className="p-3">
                <h3 className="text-sm font-bold">{c.title}</h3>
                <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{c.subHead}</p>
                <div className="mt-2">
                  <Stamp time={c.time ?? ""} />
                </div>
              </div>
            </article>
          ))}
        </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => (
          <article key={s.title} className="border border-border p-3 transition-colors hover:border-primary">
            <Badge tone="soft">{s.tag}</Badge>
            <h3 className="mt-1.5 text-xs font-bold">{s.title}</h3>
            <div className="mt-2">
              <Stamp time={s.time ?? ""} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}


export function StateNews() {
  const { t } = useTranslation();
  const [activeState, setActiveState] = useState(STATE_TABS[0]);
  const breakingHero = t("sections.breaking.hero", { returnObjects: true }) as CardItem;
  const breakingCards = t("sections.breaking.cards", { returnObjects: true }) as CardItem[];
  const hotCards = t("sections.hotRightNow.cards", { returnObjects: true }) as CardItem[];
  const regionalCards = t("sections.regionals.items", { returnObjects: true }) as CardItem[];
  const sportsCards = t("sections.sports.cards", { returnObjects: true }) as CardItem[];
  const contentSets = [breakingCards, hotCards, regionalCards, sportsCards];
  const activeIndex = STATE_TABS.indexOf(activeState);
  const selectedCards = contentSets[activeIndex % contentSets.length] ?? breakingCards;
  const hero = activeIndex === 0
    ? breakingHero
    : selectedCards[0] ?? breakingHero;
  const cards = activeIndex === 0
    ? breakingCards
    : [...selectedCards.slice(1), ...selectedCards.slice(0, 1)];
  const images = [mohanpooja, mohanflag, stall, tirangapaint];

  return (
    <section className="w-full overflow-hidden bg-background py-5 sm:py-7">
      <div className="mx-auto w-full max-w-[1250px] px-4 lg:px-0">
        <SectionHead
          title={t("sections.stateNews.title")}
          action={t("sections.seeAll")}
        />

        <nav className="flex overflow-x-auto bg-[#000] text-sm font-bold text-white scrollbar-none sm:text-base">
          {STATE_TABS.map((state) => (
            <button
              key={state}
              type="button"
              onClick={() => setActiveState(state)}
              aria-selected={activeState === state}
              className={`shrink-0 px-5 py-2.5 transition-colors hover:bg-primary ${activeState === state ? "bg-primary" : ""}`}
            >
              {state}
            </button>
          ))}
        </nav>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          <article className="group grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
            <div className="relative min-h-56 overflow-hidden bg-tint sm:min-h-72">
              <Thumb src={mohan} alt={hero.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="min-w-0 self-center">
              <Badge>{activeState}</Badge>
              <h3 className="mt-2 text-xl leading-tight font-black sm:text-2xl">{hero.title}</h3>
              <p className="mt-4 line-clamp-5 text-sm leading-7 text-muted-foreground">{hero.subHead}</p>
            </div>
          </article>

          <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
            {cards.slice(0, 4).map((card, index) => (
              <article key={card.title} className="group grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] gap-3">
                <div className="h-24 overflow-hidden bg-tint sm:h-28">
                  <Thumb src={images[index]} alt={card.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="min-w-0">
                  <h3 className="line-clamp-3 text-sm leading-6 font-black">{card.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{card.subHead}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function VideoNews() {
  const { t } = useTranslation();
  const full = t("sections.video.full", { returnObjects: true }) as { title: string; views: string }[];
  const shorts = t("sections.video.shortItems", { returnObjects: true }) as { title: string; views: string }[];
  const vidsrc = [vn1, vn2, vn3];
  const vshorts = [s1, s2, s3, s4];

  const [activeVideo, setActiveVideo] = useState<ActiveVideo>(null);

  const openVideo = useCallback((src: string, title: string) => setActiveVideo({ src, title }), []);
  const closeVideo = useCallback(() => setActiveVideo(null), []);

  return (
    <section className="lg:max-w-[1250px] max-w-[100vw] sm:px-4 px-4 lg:px-0 pt-6 overflow-hidden">
      <SectionHead
        title={t("sections.video.title")}
        subtitle={t("sections.video.subtitle")}
        action={t("sections.seeAll")}
      />

      <p className="mb-3 text-[11px] font-bold tracking-wider text-primary uppercase">
        ▸ {t("sections.video.fullStories")}
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {full.map((v, index) => (
          <article key={v.title} className="group">
            <div className="img-placeholder relative grid h-48 place-items-center">
              <video
                src={vidsrc[index]}
                alt={v.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <PlayButton onClick={() => openVideo(vidsrc[index], v.title)} />
              <span className="absolute right-2 bottom-2 bg-ink px-1.5 py-0.5 text-[9px] font-bold text-background">
                08:24
              </span>
            </div>
            <h3 className="mt-2 text-xs font-bold">{v.title}</h3>
            <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
              <Eye className="h-3 w-3" /> {v.views}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-6">
        <SectionHead
          title={t("SHORTS")}
          action={t("sections.seeAll")}
        />
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 w-full">
        {shorts.map((s, index) => (
          <article key={s.title} className="group shrink-0 w-38">
            <div className="img-placeholder relative grid aspect-[9/16] place-items-center">
              <video
                src={vshorts[index]}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <PlayButton onClick={() => openVideo(vshorts[index], s.title)} size="sm" />
            </div>
            <h3 className="mt-2 text-[11px] font-bold line-clamp-2">{s.title}</h3>
            <p className="text-[10px] text-muted-foreground">
              {s.views} {t("sections.video.views")}
            </p>
          </article>
        ))}
      </div>

      {activeVideo && <VideoLightbox video={activeVideo} onClose={closeVideo} />}
    </section>
  );
}

export function India() {
  const { t } = useTranslation();
  const items = t("sections.indiaNews.items", { returnObjects: true }) as CardItem[];
  const cards = t("sections.indiaNews.cards", { returnObjects: true }) as CardItem[];
  const cardImages = [medal, petrol, dog, school];

  return (
    <section className="lg:max-w-[1250px] max-w-[100vw] sm:px-4 px-4 lg:px-0 pt-6">
      <SectionHead title={t("INDIA NEWS")} subtitle={t("sections.indiaNews.subtitle")} />

      <article className="group relative overflow-hidden">
        <Thumb src={yatra} alt={t("sections.indiaNews.heroTitle")} className="h-64 w-full sm:h-80" />
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink via-ink/70 to-transparent p-5">
          <Badge>{t("sections.indiaNews.featured")}</Badge>
          <h3 className="mt-2 text-lg font-black text-background sm:text-2xl">
            {t("sections.indiaNews.heroTitle")}
          </h3>
          <p className="hidden lg:block mt-1 text-[11px] text-background/70">{t("sections.indiaNews.heroDesc")}</p>
        </div>
      </article>

      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {cards.slice(0, 4).map((c, i) => (
            <article key={c.title} className="group overflow-hidden border border-border">
              <div className="relative h-32 overflow-hidden">
                <Thumb
                  src={cardImages[i]}
                  alt={c.title}
                  className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-2 left-2">
                  <Badge>{c.category}</Badge>
                </span>
                {c.badge && (
                  <span className="absolute top-2 right-2 bg-ink px-2 py-0.5 text-[9px] font-bold text-background">
                    {c.badge}
                  </span>
                )}
              </div>
              <div className="p-3">
                <h3 className="text-sm font-bold">{c.title}</h3>
                <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{c.subHead}</p>
                <div className="mt-2">
                  <Stamp time={c.time ?? ""} />
                </div>
              </div>
            </article>
          ))}
        </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => (
          <article key={s.title} className="border border-border p-3 transition-colors hover:border-primary">
            <Badge tone="soft">{s.tag}</Badge>
            <h3 className="mt-1.5 text-xs font-bold">{s.title}</h3>
            <div className="mt-2">
              <Stamp time={s.time ?? ""} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function International() {
  const { t } = useTranslation();
  const items = t("sections.international.items", { returnObjects: true }) as CardItem[];
  const cards = t("sections.international.cards", { returnObjects: true }) as CardItem[];
  const cardImages = [medal, petrol, dog, school];

  return (
    <section className="lg:max-w-[1250px] max-w-[100vw] sm:px-4 px-4 lg:px-0 pt-6">
      <SectionHead title={t("International News")} subtitle={t("sections.international.subtitle")} />

      <article className="group relative overflow-hidden">
        <Thumb src={yatra} alt={t("sections.international.heroTitle")} className="h-64 w-full sm:h-80" />
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink via-ink/70 to-transparent p-5">
          <Badge>{t("sections.international.featured")}</Badge>
          <h3 className="mt-2 text-lg font-black text-background sm:text-2xl">
            {t("sections.international.heroTitle")}
          </h3>
          <p className="hidden lg:block mt-1 text-[11px] text-background/70">{t("sections.international.heroDesc")}</p>
        </div>
      </article>

      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {cards.slice(0, 4).map((c, i) => (
            <article key={c.title} className="group overflow-hidden border border-border">
              <div className="relative h-32 overflow-hidden">
                <Thumb
                  src={cardImages[i]}
                  alt={c.title}
                  className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-2 left-2">
                  <Badge>{c.category}</Badge>
                </span>
                {c.badge && (
                  <span className="absolute top-2 right-2 bg-ink px-2 py-0.5 text-[9px] font-bold text-background">
                    {c.badge}
                  </span>
                )}
              </div>
              <div className="p-3">
                <h3 className="text-sm font-bold">{c.title}</h3>
                <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{c.subHead}</p>
                <div className="mt-2">
                  <Stamp time={c.time ?? ""} />
                </div>
              </div>
            </article>
          ))}
        </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => (
          <article key={s.title} className="border border-border p-3 transition-colors hover:border-primary">
            <Badge tone="soft">{s.tag}</Badge>
            <h3 className="mt-1.5 text-xs font-bold">{s.title}</h3>
            <div className="mt-2">
              <Stamp time={s.time ?? ""} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}


export function Blogs() {
  const { t } = useTranslation();
  const items = t("sections.blogs.items", { returnObjects: true }) as CardItem[];

  return (
    <section className="lg:max-w-[1250px] max-w-[100vw] sm:px-4 px-4 lg:px-0 pt-6">
      <SectionHead title={t("sections.blogs.title")} subtitle={t("sections.blogs.subtitle")} />
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {items.map((m) => (
          <article key={m.title} className="border border-border p-3 transition-colors hover:border-primary">
            <Badge tone="soft">{m.tag}</Badge>
            <h3 className="mt-1.5 text-xs font-bold">{m.title}</h3>
          </article>
        ))}
      </div>

      {/* <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border border-border bg-tint p-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center bg-primary text-primary-foreground">
            <Tag className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <Badge tone="soft">{t("sections.moreNews.adBadge")}</Badge>
            <p className="truncate text-xs font-bold">{t("sections.moreNews.adTitle")}</p>
          </div>
        </div>
        <a href="#" className="shrink-0 bg-primary px-4 py-2 text-[11px] font-bold text-primary-foreground">
          {t("sections.moreNews.exploreDeals")}
        </a>
      </div> */}
    </section>
  );
}
