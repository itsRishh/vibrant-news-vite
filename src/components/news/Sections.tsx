import {
  ChevronRight,
  Clock,
  Play,
  Flame,
  Eye,
  ShoppingBag,
  Ticket,
  Tag,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useRef } from "react";
// import cricket from "@/assets/cricket.jpg";
import cricket from "@/assets/images/rewa.jpg";
import tech from "@/assets/images/ajgar.jpeg";
import adNalanda from "@/assets/images/ad-nalanda.jpg";
// import parliament from "@/assets/parliament.jpg";
import parliament from "@/assets/images/tiranga.png";
import mohan from "@/assets/images/mohan-yadav.jpeg";
import racket from "@/assets/images/racket.jpeg";
import paani from "@/assets/images/paani.jpeg";
import redcarpet from "@/assets/images/profile.jpeg";
import bannerAd from "@/assets/images/ads/bannerad.jpeg";
import tirangapaint from "@/assets/images/tirangapaint.jpeg";
import dog from "@/assets/images/dog.jpeg";
import school from "@/assets/images/school.jpeg";
import medal from "@/assets/images/medal.jpeg";
import petrol from "@/assets/images/petrol.jpeg";
import col1 from "@/assets/images/madam.png";
import col2 from "@/assets/images/1.png";
import col3 from "@/assets/images/tiranga.png";
import vn2 from "@/assets/images/tiranga.png";
import vn3 from "@/assets/images/marpeet.png";
import s1 from "@/assets/images/hamla.png";
import s2 from "@/assets/images/paani.png";
import s3 from "@/assets/images/petrolchori.png";


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

function CustomVideoPlayer({
  src,
  alt = "",
  className = "",
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
        setShowControls(false);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowControls(true);
      }
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen().catch(() => {});
      }
    }
  };

  const handleMouseEnter = () => {
    setShowControls(true);
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-black overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        playsInline
      />

      {/* Center Play Button */}
      <button
        onClick={handlePlayPause}
        className={`absolute inset-0 flex items-center justify-center hover:bg-black/20 transition-all duration-200 z-10 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="bg-primary hover:bg-primary/90 p-4 rounded-full transition-colors shadow-lg">
          {isPlaying ? (
            <Pause className="h-4 w-4 text-primary-foreground fill-primary-foreground" />
          ) : (
            <Play className="h-4 w-4 text-primary-foreground fill-primary-foreground" />
          )}
        </span>
      </button>

      {/* Bottom Right Controls */}
      <div
        className={`absolute bottom-4 right-4 flex gap-2 z-20 transition-all duration-200 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Mute Button */}
        <button
          onClick={handleMute}
          className="bg-black/70 hover:bg-black/90 p-2 rounded-full transition-colors backdrop-blur-sm shadow-lg"
          title="Toggle Mute"
        >
          {isMuted ? (
            <VolumeX className="h-3 w-3 text-white" />
          ) : (
            <Volume2 className="h-3 w-3 text-white" />
          )}
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={handleFullscreen}
          className="bg-black/70 hover:bg-black/90 p-2 rounded-full transition-colors backdrop-blur-sm shadow-lg"
          title="Toggle Fullscreen"
        >
          <Maximize className="h-3 w-3 text-white" />
        </button>
      </div>
    </div>
  );
}

function ThumbVideo({
  src,
  alt = "",
  className = "",
}: {
  src?: string;
  alt?: string;
  className?: string;
}) {
  if (!src) return <div className={`img-placeholder ${className}`} aria-hidden />;

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


export function IndependenceWishes() {
  const { t } = useTranslation();
  const wish = t("sections.wishes.full", { returnObjects: true }) as { title: string; views: string }[];
  const vidsrc = [col1, col2, col3]
  return (
    <section className="lg:max-w-[1250px] max-w-[100vw] sm:px-4 px-4 lg:px-0 pt-6">
      <SectionHead
        title={t("sections.wishes.title")}
        subtitle={t("sections.wishes.subtitle")}
        action={t("sections.seeAll")}
      />

      <div className="grid gap-4 md:grid-cols-3">
        {wish.map((w, index) => (
          <article key={w.title} className="group">
            <div className="img-placeholder relative grid h-48 place-items-center">
              <ThumbVideo
                src={vidsrc[index]}
                alt={w.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
              </ThumbVideo>
            </div>
            <h3 className="mt-2 text-xs font-bold">{w.title}</h3>
            <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
              <Eye className="h-3 w-3" /> {w.views}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}


export function HotRightNow() {
  const { t } = useTranslation();
  const hero = t("sections.hotRightNow.hero", { returnObjects: true }) as CardItem;
  const cards = t("sections.hotRightNow.cards", { returnObjects: true }) as CardItem[];
  const smallCards = t("sections.hotRightNow.smallCards", { returnObjects: true }) as CardItem[];
  const cardImages = [paani, racket, undefined, redcarpet];

  return (
    <section className="lg:max-w-[1250px] max-w-[100vw] sm:px-4 px-4 lg:px-0  pt-6">
      {/* title */}
      <div className="mb-3 flex items-center justify-between">
        <div className="section-rule">
          <h2 className="text-lg font-black tracking-tight uppercase">
            {t("sections.hotRightNow.title")}
          </h2>
        </div>
        <span className="flex items-center gap-1 bg-primary px-2 py-0.5 text-[9px] font-bold text-primary-foreground uppercase">
          <Flame className="h-3 w-3" /> {t("sections.live")}
        </span>
      </div>

      {/* main news */}

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr]"> 
        <article className="group relative lg:min-h-[320px] min-h-[520px] overflow-hidden bg-ink lg:row-span-2">
          <ThumbVideo
            src={mohan}
            className="absolute inset-0 opacity-100 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge>{hero.category}</Badge>
            <Badge tone="ink">{hero.badge}</Badge>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink via-ink/80 to-transparent p-5">
            <h3 className="text-md font-black text-background sm:text-2xl">{hero.title}</h3>
            <p className="mt-2 line-clamp-2 text-xs text-background/75">{hero.subHead}</p>
            <div className="mt-3 flex items-center gap-1 text-[10px] text-background/60">
            </div>
          </div>
        </article>

        {cards.slice(0, 2).map((c, i) => (
          <article key={c.title} className="group overflow-hidden border border-border">
            <div className="relative lg:h-32 h-48 overflow-hidden">
              <Thumb
                src={cardImages[i]}
                alt={c.title}
                className="transition-transform duration-500 group-hover:scale-105"
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

        {/* <article className="border border-border bg-tint p-4">
          <Thumb
            src={cardImages[2]}
            className="h-full w-full transition-transform duration-500 group-hover:scale-105"
          />
          <Badge>{cards[2]?.category}</Badge>
          <h3 className="mt-2 text-sm font-bold">{cards[2]?.title}</h3>
          <p className="mt-1 line-clamp-3 text-[11px] text-muted-foreground">{cards[2]?.subHead}</p>
          <div className="mt-3">
            <Stamp time={cards[2]?.time ?? ""} />
          </div>
        </article> */}

        <article className="group relative overflow-hidden border border-border">
          <div className=" from-ink to-transparent p-3">
            <Badge>{cards[2]?.category}</Badge>
          </div>
          <Thumb src={adNalanda} alt={cards[3]?.title ?? ""} className="w-[100%]" />
        </article>

        <article className="group relative overflow-hidden">
          <Thumb src={redcarpet} alt={cards[3]?.title ?? ""} className="h-full min-h-[150px] w-full" />
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink to-transparent p-3">
            <Badge>{cards[3]?.category}</Badge>
            <h3 className="mt-1 text-sm font-bold text-background">{cards[3]?.title}</h3>
            <p className="line-clamp-2 text-[10px] text-background/70">{cards[3]?.subHead}</p>
          </div>
        </article>
      </div>


        {/* no image news */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
        {smallCards.map((c) => (
          <article key={c.title} className="group overflow-hidden border border-border">
            <div className="px-2 py-1">
              <Badge tone="soft">{c.tag}</Badge>
              <h3 className="mt-1.5 text-xs font-bold group-hover:text-primary">{c.title}</h3>
              <div className="mt-2">
                <Stamp time={c.time ?? ""} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function LatestNews() {
  const { t } = useTranslation();
  const hero = t("sections.latestNews.hero", { returnObjects: true }) as CardItem;
  const cards = t("sections.latestNews.cards", { returnObjects: true }) as CardItem[];
  const smallCards = t("sections.latestNews.smallCards", { returnObjects: true }) as CardItem[];
  const cardImages = [cricket, tech, undefined, redcarpet];

  return (
    <section className="lg:max-w-[1250px] max-w-[100vw] sm:px-4 px-4 lg:px-0  pt-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="section-rule">
          <h2 className="text-lg font-black tracking-tight uppercase">
            {t("sections.regional.title")}
          </h2>
        </div>
        <span className="flex items-center gap-1 bg-primary px-2 py-0.5 text-[9px] font-bold text-primary-foreground uppercase">
          <Flame className="h-3 w-3" /> {t("sections.live")}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr]">
        <article className="group relative min-h-[320px] overflow-hidden bg-ink lg:row-span-2">
          <ThumbVideo
            src={parliament}
            className="absolute inset-0 w-full opacity-100 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge>{hero.category}</Badge>
            <Badge tone="ink">{hero.badge}</Badge>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink via-ink/80 to-transparent p-5">
            <h3 className="text-xl font-black text-background sm:text-2xl">मैहर में हर घर तिरंगा अभियान के तहत भव्य तिरंगा यात्रा निकाली गई। सुबह 11 बजे खेल मैदान से शुरू हुई यात्रा</h3>
            <p className="mt-2 line-clamp-2 text-xs text-background/75">देशभक्ति नारों और गीतों के साथ अलाउद्दीन तिराहे होते हुए घंटाघर पहुंची, जहां इसका समापन हुआ। यात्रा में विधायक श्रीकांत चतुर्वेदी, कलेक्टर बिदिशा मुखर्जी, एसपी अवधेश प्रताप सिंह सहित अधिकारी, छात्र-छात्राएं और गणमान्य नागरिक शामिल हुए।</p>
            <div className="mt-3 flex items-center gap-1 text-[10px] text-background/60">
              <Clock className="h-3 w-3" /> {hero.time}
            </div>
          </div>
        </article>


        {cards.slice(4, 6).map((c, i) => (
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

        {/* ad */}
        <article className="border border-border bg-tint p-4">
          <Badge>{cards[7]?.category}</Badge>
          <h3 className="mt-2 text-sm font-bold">{cards[7]?.title}</h3>
          <p className="mt-1 line-clamp-3 text-[11px] text-muted-foreground">{cards[7]?.subHead}</p>
          <div className="mt-3">
            <Stamp time={cards[7]?.time ?? ""} />
          </div>
        </article>

        <article className="group relative overflow-hidden">
          <Thumb src={redcarpet} alt={cards[7]?.title ?? ""} className="h-full min-h-[150px] w-full" />
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink to-transparent p-3">
            <Badge>{cards[7]?.category}</Badge>
            <h3 className="mt-1 text-sm font-bold text-background">{cards[7]?.title}</h3>
            <p className="line-clamp-2 text-[10px] text-background/70">{cards[7]?.subHead}</p>
          </div>
        </article>
      </div>
    </section>
  );
}

export function Breaking() {
  const { t } = useTranslation();
  const items = t("sections.regionals.items", { returnObjects: true }) as CardItem[];

  return (
    <section className="lg:max-w-[1250px] max-w-[100vw] sm:px-4 px-4 lg:px-0 pt-6 my-4">
      <SectionHead
        title={t("sections.regionals.title")}
        subtitle={t("sections.regionals.subtitle")}
      />
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

export function Regional() {
  const { t } = useTranslation();
  const items = t("sections.sports.items", { returnObjects: true }) as CardItem[];
  const cards = t("sections.sports.cards", { returnObjects: true }) as CardItem[];
  const cardImages = [medal, petrol, dog, school];

  return (
    <section className="lg:max-w-[1250px] max-w-[100vw] sm:px-4 px-4 lg:px-0 pt-6">
      <SectionHead title={t("sections.sports.title")} subtitle={t("sections.sports.subtitle")} />

      <article className="group relative overflow-hidden">
        <Thumb src={tirangapaint} alt={t("sections.sports.heroTitle")} className="h-64 w-full sm:h-80" />
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink via-ink/70 to-transparent p-5">
          <Badge>{t("sections.sports.featured")}</Badge>
          <h3 className="mt-2 text-lg font-black text-background sm:text-2xl">
            {t("sections.sports.heroTitle")}
          </h3>
          <p className="mt-1 text-[11px] text-background/70">{t("sections.sports.heroDesc")}</p>
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

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border border-border bg-tint p-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center bg-primary text-primary-foreground">
            <ShoppingBag className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <Badge tone="soft">{t("sections.sports.adBadge")}</Badge>
            <p className="truncate text-xs font-bold">{t("sections.sports.adTitle")}</p>
          </div>
        </div>
        <a href="#" className="shrink-0 bg-primary px-4 py-2 text-[11px] font-bold text-primary-foreground">
          {t("sections.sports.shopSports")}
        </a>
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

export function Bollywood() {
  const { t } = useTranslation();
  const list = t("sections.bollywood.list", { returnObjects: true }) as (CardItem & { tag?: string })[];
  const cards = t("sections.hotRightNow.cards", { returnObjects: true }) as CardItem[];
  const cardImages = [medal, petrol, dog, school];


  return (
    <section className="lg:max-w-[1250px] max-w-[100vw] sm:px-4 px-4 lg:px-0 pt-6 my-4">
      <SectionHead
        title={t("sections.bollywood.title")}
        subtitle={t("sections.bollywood.subtitle")}
      />

      <article className="group relative overflow-hidden">
        <Thumb src={redcarpet} alt={t("sections.bollywood.heroTitle")} className="h-64 w-full sm:h-96" />
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink via-ink/70 to-transparent p-5">
          <Badge>{t("sections.bollywood.exclusive")}</Badge>
          <h3 className="mt-2 text-lg font-black text-background sm:text-2xl">
            {t("sections.bollywood.heroTitle")}
          </h3>
          <p className="mt-1 text-[11px] text-background/70">{t("sections.bollywood.heroDesc")}</p>
        </div>
      </article>

      <div className="wrapper grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border border-border bg-tint p-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center bg-primary text-primary-foreground">
              <Ticket className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <Badge tone="soft">{t("sections.bollywood.adBadge")}</Badge>
              <p className="truncate text-xs font-bold">{t("sections.bollywood.adTitle")}</p>
            </div>
          </div>
          <a href="#" className="shrink-0 bg-primary px-4 py-2 text-[11px] font-bold text-primary-foreground">
            {t("sections.bollywood.bookNow")}
          </a>
        </div>

        {cards.slice(4, 6).map((c, i) => (
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

      <ol className="mt-4 divide-y divide-border border border-border">
        {list.map((row, i) => (
          <li
            key={row.title}
            className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-3 transition-colors hover:bg-tint"
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center bg-primary text-[10px] font-black text-primary-foreground">
              {i + 1}
            </span>
            <span className="min-w-0 truncate text-xs font-semibold">{row.title}</span>
            <span className="flex shrink-0 items-center gap-2">
              {row.tag && <Badge tone="ink">{row.tag}</Badge>}
              <Stamp time={row.time ?? ""} />
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function VideoNews() {
  const { t } = useTranslation();
  const full = t("sections.video.full", { returnObjects: true }) as { title: string; views: string }[];
  const shorts = t("sections.video.shortItems", { returnObjects: true }) as { title: string; views: string }[];
  const vidsrc = [col1, vn2, vn3]
  const vshorts = [s1, s2, s3]
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
              <ThumbVideo
                src={vidsrc[index]}
                alt={v.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
              </ThumbVideo>
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

      <p className="mt-8 mb-3 text-[11px] font-bold tracking-wider text-primary uppercase">
        ▸ {t("sections.video.shorts")}
      </p>
      <div className="flex gap-4 overflow-x-auto pb-2 w-full">
        {shorts.map((s, index) => (
          <article key={s.title} className="group shrink-0 w-38">
            <div className="img-placeholder relative grid aspect-[9/16] place-items-center">
              <ThumbVideo
                src={vshorts[index]}
                alt={s.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
              </ThumbVideo>
            </div>
            <h3 className="mt-2 text-[11px] font-bold line-clamp-2">{s.title}</h3>
            <p className="text-[10px] text-muted-foreground">
              {s.views} {t("sections.video.views")}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

// export function QuickReads() {
//   const { t } = useTranslation();
//   const topics = t("sections.quickReads.topics", { returnObjects: true }) as string[];

//   return (
//     <section className="lg:max-w-[1250px] max-w-[100vw] sm:px-4 px-4 lg:px-0 pt-6">
//       <SectionHead
//         title={t("sections.quickReads.title")}
//         subtitle={t("sections.quickReads.subtitle")}
//         action=""
//       />
//       <div className="flex gap-4 overflow-x-auto pb-2">
//         {topics.map((q) => (
//           <a key={q} href="#" className="w-16 shrink-0 text-center">
//             <span className="img-placeholder grid h-16 w-16 place-items-center border-2 border-primary bg-ink" />
//             <span className="mt-1.5 block text-[9px] leading-tight font-semibold">{q}</span>
//           </a>
//         ))}
//       </div>

//       <div className="mt-6 grid gap-4 border border-border bg-tint p-4 md:grid-cols-[minmax(0,1fr)_260px]">
//         <div className="min-w-0">
//           <Badge>{t("sections.sports.featured")}</Badge>
//           <h3 className="mt-2 text-lg font-black">{t("sections.quickReads.featuredTitle")}</h3>
//           <p className="mt-1 text-xs text-muted-foreground">{t("sections.quickReads.featuredDesc")}</p>
//           <a href="#" className="mt-3 inline-block text-[11px] font-bold text-primary uppercase">
//             {t("sections.quickReads.readFullStory")}
//           </a>
//         </div>
//         {/* <Thumb src={parliament} alt={t("sections.quickReads.featuredTitle")} className="h-32 w-full md:h-full" /> */}
//       </div>
//     </section>
//   );
// }

export function MoreNews() {
  const { t } = useTranslation();
  const items = t("sections.moreNews.items", { returnObjects: true }) as CardItem[];

  return (
    <section className="lg:max-w-[1250px] max-w-[100vw] sm:px-4 px-4 lg:px-0 pt-6">
      <SectionHead title={t("sections.moreNews.title")} subtitle={t("sections.moreNews.subtitle")} />
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {items.map((m) => (
          <article key={m.title} className="border border-border p-3 transition-colors hover:border-primary">
            <Badge tone="soft">{m.tag}</Badge>
            <h3 className="mt-1.5 text-xs font-bold">{m.title}</h3>
          </article>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border border-border bg-tint p-3">
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
      </div>
    </section>
  );
}
