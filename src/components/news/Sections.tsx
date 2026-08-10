import {
  ChevronRight,
  Clock,
  Play,
  Flame,
  Eye,
  ShoppingBag,
  Ticket,
  Tag,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import cricket from "@/assets/cricket.jpg";
import redcarpet from "@/assets/redcarpet.jpg";
import parliament from "@/assets/parliament.jpg";
import tech from "@/assets/tech.jpg";

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
      className={`object-cover ${className}`}
    />
  );
}

type CardItem = {
  city?: string;
  category?: string;
  badge?: string;
  tag?: string;
  title: string;
  summary?: string;
  time?: string;
};

export function HotRightNow() {
  const { t } = useTranslation();
  const hero = t("sections.hotRightNow.hero", { returnObjects: true }) as CardItem;
  const cards = t("sections.hotRightNow.cards", { returnObjects: true }) as CardItem[];
  const smallCards = t("sections.hotRightNow.smallCards", { returnObjects: true }) as CardItem[];
  const cardImages = [cricket, tech, undefined, redcarpet];

  return (
    <section className="mx-auto max-w-[1200px] px-4 pt-6">
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

      <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 bg-tint p-3 sm:p-4">
        <div className="flex min-w-0 items-center gap-3">
          <Thumb src={tech} alt="" className="hidden h-14 w-20 shrink-0 sm:block" />
          <div className="min-w-0">
            <Badge>{t("sections.hotRightNow.promoBadge")}</Badge>
            <h3 className="mt-1 truncate text-sm font-bold">
              {t("sections.hotRightNow.promoTitle")}
            </h3>
            <p className="truncate text-[11px] text-muted-foreground">
              {t("sections.hotRightNow.promoDesc")}
            </p>
          </div>
        </div>
        <a
          href="#"
          className="shrink-0 bg-primary px-4 py-2 text-[11px] font-bold text-primary-foreground"
        >
          {t("sections.hotRightNow.shopNow")}
        </a>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr_1fr]">
        <article className="group relative min-h-[320px] overflow-hidden bg-ink lg:row-span-2">
          <Thumb
            src={parliament}
            alt={hero.title}
            className="absolute inset-0 h-full w-full opacity-80 transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge>{hero.category}</Badge>
            <Badge tone="ink">{hero.badge}</Badge>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink via-ink/80 to-transparent p-5">
            <h3 className="text-xl font-black text-background sm:text-2xl">{hero.title}</h3>
            <p className="mt-2 line-clamp-2 text-xs text-background/75">{hero.summary}</p>
            <div className="mt-3 flex items-center gap-1 text-[10px] text-background/60">
              <Clock className="h-3 w-3" /> {hero.time}
            </div>
          </div>
        </article>

        {cards.slice(0, 2).map((c, i) => (
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
              <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{c.summary}</p>
              <div className="mt-2">
                <Stamp time={c.time ?? ""} />
              </div>
            </div>
          </article>
        ))}

        <article className="border border-border bg-tint p-4">
          <Badge>{cards[2]?.category}</Badge>
          <h3 className="mt-2 text-sm font-bold">{cards[2]?.title}</h3>
          <p className="mt-1 line-clamp-3 text-[11px] text-muted-foreground">{cards[2]?.summary}</p>
          <div className="mt-3">
            <Stamp time={cards[2]?.time ?? ""} />
          </div>
        </article>

        <article className="group relative overflow-hidden">
          <Thumb src={redcarpet} alt={cards[3]?.title ?? ""} className="h-full min-h-[150px] w-full" />
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink to-transparent p-3">
            <Badge>{cards[3]?.category}</Badge>
            <h3 className="mt-1 text-sm font-bold text-background">{cards[3]?.title}</h3>
            <p className="line-clamp-2 text-[10px] text-background/70">{cards[3]?.summary}</p>
          </div>
        </article>
      </div>

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

export function Regional() {
  const { t } = useTranslation();
  const items = t("sections.regional.items", { returnObjects: true }) as CardItem[];

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-8">
      <SectionHead
        title={t("sections.regional.title")}
        subtitle={t("sections.regional.subtitle")}
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

export function Sports() {
  const { t } = useTranslation();
  const items = t("sections.sports.items", { returnObjects: true }) as CardItem[];

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-8">
      <SectionHead title={t("sections.sports.title")} subtitle={t("sections.sports.subtitle")} />

      <article className="group relative overflow-hidden">
        <Thumb src={cricket} alt={t("sections.sports.heroTitle")} className="h-64 w-full sm:h-80" />
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink via-ink/70 to-transparent p-5">
          <Badge>{t("sections.sports.featured")}</Badge>
          <h3 className="mt-2 text-lg font-black text-background sm:text-2xl">
            {t("sections.sports.heroTitle")}
          </h3>
          <p className="mt-1 text-[11px] text-background/70">{t("sections.sports.heroDesc")}</p>
        </div>
      </article>

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

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-8">
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

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-8">
      <SectionHead
        title={t("sections.video.title")}
        subtitle={t("sections.video.subtitle")}
        action={t("sections.seeAll")}
      />

      <p className="mb-3 text-[11px] font-bold tracking-wider text-primary uppercase">
        ▸ {t("sections.video.fullStories")}
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {full.map((v) => (
          <article key={v.title} className="group">
            <div className="img-placeholder relative grid h-40 place-items-center">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:scale-110">
                <Play className="h-4 w-4 fill-current" />
              </span>
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
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {shorts.map((s) => (
          <article key={s.title} className="group">
            <div className="img-placeholder relative grid aspect-[9/16] place-items-center">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:scale-110">
                <Play className="h-4 w-4 fill-current" />
              </span>
            </div>
            <h3 className="mt-2 text-[11px] font-bold">{s.title}</h3>
            <p className="text-[10px] text-muted-foreground">
              {s.views} {t("sections.video.views")}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function QuickReads() {
  const { t } = useTranslation();
  const topics = t("sections.quickReads.topics", { returnObjects: true }) as string[];

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-8">
      <SectionHead
        title={t("sections.quickReads.title")}
        subtitle={t("sections.quickReads.subtitle")}
        action=""
      />
      <div className="flex gap-4 overflow-x-auto pb-2">
        {topics.map((q) => (
          <a key={q} href="#" className="w-16 shrink-0 text-center">
            <span className="img-placeholder grid h-16 w-16 place-items-center border-2 border-primary bg-ink" />
            <span className="mt-1.5 block text-[9px] leading-tight font-semibold">{q}</span>
          </a>
        ))}
      </div>

      <div className="mt-6 grid gap-4 border border-border bg-tint p-4 md:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0">
          <Badge>{t("sections.sports.featured")}</Badge>
          <h3 className="mt-2 text-lg font-black">{t("sections.quickReads.featuredTitle")}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{t("sections.quickReads.featuredDesc")}</p>
          <a href="#" className="mt-3 inline-block text-[11px] font-bold text-primary uppercase">
            {t("sections.quickReads.readFullStory")}
          </a>
        </div>
        <Thumb src={parliament} alt={t("sections.quickReads.featuredTitle")} className="h-32 w-full md:h-full" />
      </div>
    </section>
  );
}

export function MoreNews() {
  const { t } = useTranslation();
  const items = t("sections.moreNews.items", { returnObjects: true }) as CardItem[];

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-8">
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
