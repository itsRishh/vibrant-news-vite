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
import cricket from "@/assets/cricket.jpg";
import redcarpet from "@/assets/redcarpet.jpg";
import parliament from "@/assets/parliament.jpg";
import tech from "@/assets/tech.jpg";

/* ---------- shared bits ---------- */

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
  action = "See All",
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
      <a
        href="#"
        className="flex shrink-0 items-center gap-1 text-[11px] font-bold text-primary uppercase"
      >
        {action} <ChevronRight className="h-3 w-3" />
      </a>
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

/* ---------- hot right now ---------- */

export function HotRightNow() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 pt-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="section-rule">
          <h2 className="text-lg font-black tracking-tight uppercase">Hot Right Now</h2>
        </div>
        <span className="flex items-center gap-1 bg-primary px-2 py-0.5 text-[9px] font-bold text-primary-foreground uppercase">
          <Flame className="h-3 w-3" /> Live
        </span>
      </div>

      <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 bg-tint p-3 sm:p-4">
        <div className="flex min-w-0 items-center gap-3">
          <Thumb src={tech} alt="Smartwatch promo" className="hidden h-14 w-20 shrink-0 sm:block" />
          <div className="min-w-0">
            <Badge>Presented by Flipk</Badge>
            <h3 className="mt-1 truncate text-sm font-bold">
              Titan Smart Ultra — India's Premium Smartwatch
            </h3>
            <p className="truncate text-[11px] text-muted-foreground">
              Launch Price ₹4,999 · Free Delivery on Pre-Order
            </p>
          </div>
        </div>
        <a
          href="#"
          className="shrink-0 bg-primary px-4 py-2 text-[11px] font-bold text-primary-foreground"
        >
          Shop Now
        </a>
      </div>

      {/* hero mosaic */}
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr_1fr]">
        <article className="group relative min-h-[320px] overflow-hidden bg-ink lg:row-span-2">
          <Thumb
            src={parliament}
            alt="Parliament monsoon session"
            className="absolute inset-0 h-full w-full opacity-80 transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge>Politics</Badge>
            <Badge tone="ink">Exclusive</Badge>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink via-ink/80 to-transparent p-5">
            <h3 className="text-xl font-black text-background sm:text-2xl">
              Monsoon Session: Key Bills to Watch This Week
            </h3>
            <p className="mt-2 line-clamp-2 text-xs text-background/75">
              Seven crucial bills including the Digital India Act, Data Protection Amendment
              and Infrastructure Bill are scheduled for debate in Parliament this session.
            </p>
            <div className="mt-3 flex items-center gap-1 text-[10px] text-background/60">
              <Clock className="h-3 w-3" /> 2 hours ago
            </div>
          </div>
        </article>

        <article className="group overflow-hidden border border-border">
          <div className="relative h-32 overflow-hidden">
            <Thumb
              src={cricket}
              alt="India vs Australia T20"
              className="h-full w-full transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute top-2 left-2">
              <Badge>Sports</Badge>
            </span>
            <span className="absolute top-2 right-2 bg-ink px-2 py-0.5 text-[9px] font-bold text-background">
              LIVE
            </span>
          </div>
          <div className="p-3">
            <h3 className="text-sm font-bold">India vs Australia: T20 Series Kicks Off Tonight</h3>
            <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">
              Jasprit Bumrah leads the pace attack as India looks to dominate the 5-match
              series at Wankhede Stadium.
            </p>
            <div className="mt-2">
              <Stamp time="1 hour ago" />
            </div>
          </div>
        </article>

        <article className="group overflow-hidden border border-border">
          <div className="relative h-32 overflow-hidden">
            <Thumb src={tech} alt="Jio AirFiber launch" className="h-full w-full" />
            <span className="absolute top-2 left-2">
              <Badge tone="ink">Tech</Badge>
            </span>
          </div>
          <div className="p-3">
            <h3 className="text-sm font-bold">Jio AirFiber 2.0 Launches in 500 Cities</h3>
            <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">
              Reliance Jio rolls out next-gen wireless broadband with speeds up to 1Gbps
              across tier-2 towns.
            </p>
            <div className="mt-2">
              <Stamp time="3 hours ago" />
            </div>
          </div>
        </article>

        <article className="border border-border bg-tint p-4">
          <Badge>Business</Badge>
          <h3 className="mt-2 text-sm font-bold">
            Sensex Hits Record High: Nifty Crosses 25,000
          </h3>
          <p className="mt-1 line-clamp-3 text-[11px] text-muted-foreground">
            Bull run continues as foreign investors pour in record ₹1.4 lakh crore this
            quarter, driven by IT and banking stocks.
          </p>
          <div className="mt-3">
            <Stamp time="45 min ago" />
          </div>
        </article>

        <article className="group relative overflow-hidden">
          <Thumb src={redcarpet} alt="Red carpet" className="h-full min-h-[150px] w-full" />
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink to-transparent p-3">
            <Badge>Bollywood</Badge>
            <h3 className="mt-1 text-sm font-bold text-background">
              Shah Rukh Khan Announces New Production House
            </h3>
            <p className="line-clamp-2 text-[10px] text-background/70">
              SRK launches Red Chillies International with a 10-film slate focusing on
              Hollywood collaborations.
            </p>
          </div>
        </article>
      </div>

      {/* four small cards */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            tag: "Environment",
            title: "Delhi AQI Drops to Best Level in 5 Years After Rain",
            src: undefined,
          },
          { tag: "Health", title: "New Study Links Sleep Quality to Heart Disease Prevention" },
          { tag: "Education", title: "IIT Bombay Unveils AI-Powered Campus for Rural Students" },
          { tag: "Auto", title: "Tata Motors Launches Cheapest EV at ₹7.99 Lakh" },
        ].map((c) => (
          <article key={c.title} className="group overflow-hidden border border-border">
            <div className="img-placeholder h-24 w-full" />
            <div className="p-3">
              <Badge tone="soft">{c.tag}</Badge>
              <h3 className="mt-1.5 text-xs font-bold group-hover:text-primary">{c.title}</h3>
              <div className="mt-2">
                <Stamp time="5 hours ago" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- regional ---------- */

const REGIONAL = [
  { city: "Maharashtra", title: "Mumbai Metro Line 3 Opens: 10 Lakh Daily Riders Expected", time: "2h ago" },
  { city: "Tamil Nadu", title: "Chennai Water Crisis: New Desalination Plant Operational", time: "3h ago" },
  { city: "Delhi", title: "Yamuna River Cleanup Project Enters Phase 3", time: "4h ago" },
  { city: "Kerala", title: "Kerala Wins Best Tourism State Award for 5th Year Running", time: "6h ago" },
  { city: "Gujarat", title: "Ahmedabad Smart City Project Receives Global Recognition", time: "11h ago" },
  { city: "West Bengal", title: "Kolkata Underground Metro Extension Complete", time: "1d ago" },
];

export function Regional() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-8">
      <SectionHead title="Regional News" subtitle="Stories from every corner of India" />
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {REGIONAL.map((r) => (
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
                <Stamp time={r.time} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- sports ---------- */

export function Sports() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-8">
      <SectionHead title="Sports" subtitle="Cricket, football, tennis & more" />

      <article className="group relative overflow-hidden">
        <Thumb src={cricket} alt="Cricket nights" className="h-64 w-full sm:h-80" />
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink via-ink/70 to-transparent p-5">
          <Badge>Featured</Badge>
          <h3 className="mt-2 text-lg font-black text-background sm:text-2xl">
            India vs Australia T20 Series: Complete Schedule & Where to Watch
          </h3>
          <p className="mt-1 text-[11px] text-background/70">
            Live on Star Sports & JioCinema · Starting 7:30 PM IST
          </p>
        </div>
      </article>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border border-border bg-tint p-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center bg-primary text-primary-foreground">
            <ShoppingBag className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <Badge tone="soft">Nike India</Badge>
            <p className="truncate text-xs font-bold">Just Do It — New Air Max Collection</p>
          </div>
        </div>
        <a href="#" className="shrink-0 bg-primary px-4 py-2 text-[11px] font-bold text-primary-foreground">
          Shop Sports
        </a>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {[
          { tag: "Cricket", title: "IPL 2026 Auction: Record ₹25 Crore Bid for Young Pacer", time: "2h ago" },
          { tag: "Football", title: "ISL Final: Mohun Bagan vs Mumbai City — Who Will Lift the Trophy?", time: "5h ago" },
          { tag: "Tennis", title: "Sumit Nagal Reaches Australian Open Quarterfinals", time: "7h ago" },
          { tag: "Hockey", title: "India Women's Hockey Team Qualifies for Para Olympics", time: "9h ago" },
          { tag: "Badminton", title: "PV Sindhu Announces Comeback After Injury Break", time: "12h ago" },
        ].map((s) => (
          <article key={s.title} className="border border-border p-3 transition-colors hover:border-primary">
            <Badge tone="soft">{s.tag}</Badge>
            <h3 className="mt-1.5 text-xs font-bold">{s.title}</h3>
            <div className="mt-2">
              <Stamp time={s.time} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- bollywood ---------- */

export function Bollywood() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-8">
      <SectionHead title="Bollywood & Entertainment" subtitle="Movies, celebrities & OTT" />

      <article className="group relative overflow-hidden">
        <Thumb src={redcarpet} alt="Red carpet fever" className="h-64 w-full sm:h-96" />
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink via-ink/70 to-transparent p-5">
          <Badge>Exclusive</Badge>
          <h3 className="mt-2 text-lg font-black text-background sm:text-2xl">
            Pushpa 3 Officially Announced — Allu Arjun Returns
          </h3>
          <p className="mt-1 text-[11px] text-background/70">
            Sukumar confirms third instalment with bigger budget and a pan-India release
          </p>
        </div>
      </article>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border border-border bg-tint p-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center bg-primary text-primary-foreground">
            <Ticket className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <Badge tone="soft">BookMyShow</Badge>
            <p className="truncate text-xs font-bold">
              Book Movie Tickets — Flat 50% Off This Weekend
            </p>
          </div>
        </div>
        <a href="#" className="shrink-0 bg-primary px-4 py-2 text-[11px] font-bold text-primary-foreground">
          Book Now
        </a>
      </div>

      <ol className="mt-4 divide-y divide-border border border-border">
        {[
          { t: "Pushpa 3: Allu Arjun Confirms Sequel with Sukumar", tag: "Trending", time: "1h ago" },
          { t: "Deepika Padukone Signs Hollywood Blockbuster with Christopher Nolan", tag: "Breaking", time: "3h ago" },
          { t: "Animal 2: Ranbir Kapoor's Action Sequel Goes on Floors", time: "6h ago" },
          { t: "Alia Bhatt's New Film Breaks Opening Day Records", time: "8h ago" },
          { t: "Salman Khan's Eid Release Postponed to Diwali", time: "10h ago" },
        ].map((row, i) => (
          <li
            key={row.t}
            className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-3 transition-colors hover:bg-tint"
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center bg-primary text-[10px] font-black text-primary-foreground">
              {i + 1}
            </span>
            <span className="min-w-0 truncate text-xs font-semibold">{row.t}</span>
            <span className="flex shrink-0 items-center gap-2">
              {row.tag && <Badge tone="ink">{row.tag}</Badge>}
              <Stamp time={row.time} />
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ---------- video ---------- */

export function VideoNews() {
  const full = [
    { t: "Inside the Parliament: How the Digital India Bill Was Passed", v: "2.4M views" },
    { t: "IPL Auction Highlights: Top 10 Bids That Shocked Everyone", v: "1.8M views" },
    { t: "Mumbai Floods: Ground Report from Worst-Hit Areas", v: "946K views" },
  ];
  const shorts = [
    { t: "60-Second News: Today's Top Stories", v: "512K" },
    { t: "Quick Take: Sensex Hits Record High", v: "318K" },
    { t: "60-Second Update: IND vs AUS", v: "274K" },
  ];
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-8">
      <SectionHead title="Video News" subtitle="Watch the story unfold" action="See All" />

      <p className="mb-3 text-[11px] font-bold tracking-wider text-primary uppercase">
        ▸ Full Stories
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {full.map((v) => (
          <article key={v.t} className="group">
            <div className="img-placeholder relative grid h-40 place-items-center">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:scale-110">
                <Play className="h-4 w-4 fill-current" />
              </span>
              <span className="absolute right-2 bottom-2 bg-ink px-1.5 py-0.5 text-[9px] font-bold text-background">
                08:24
              </span>
            </div>
            <h3 className="mt-2 text-xs font-bold">{v.t}</h3>
            <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
              <Eye className="h-3 w-3" /> {v.v}
            </p>
          </article>
        ))}
      </div>

      <p className="mt-8 mb-3 text-[11px] font-bold tracking-wider text-primary uppercase">
        ▸ Shorts
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {shorts.map((s) => (
          <article key={s.t} className="group">
            <div className="img-placeholder relative grid aspect-[9/16] place-items-center">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:scale-110">
                <Play className="h-4 w-4 fill-current" />
              </span>
            </div>
            <h3 className="mt-2 text-[11px] font-bold">{s.t}</h3>
            <p className="text-[10px] text-muted-foreground">{s.v} views</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- quick reads + more news ---------- */

const QUICK = [
  "Budget 2026",
  "IPL Mega Auction",
  "Bollywood Buzz",
  "Tech Daily",
  "World Headlines",
  "Health Tips",
  "Auto & EV",
  "Education",
];

export function QuickReads() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-8">
      <SectionHead title="Quick Reads" subtitle="Binge through today's top stories" action="" />
      <div className="flex gap-4 overflow-x-auto pb-2">
        {QUICK.map((q) => (
          <a key={q} href="#" className="w-16 shrink-0 text-center">
            <span className="img-placeholder grid h-16 w-16 place-items-center border-2 border-primary bg-ink" />
            <span className="mt-1.5 block text-[9px] leading-tight font-semibold">{q}</span>
          </a>
        ))}
      </div>

      <div className="mt-6 grid gap-4 border border-border bg-tint p-4 md:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0">
          <Badge>Featured</Badge>
          <h3 className="mt-2 text-lg font-black">
            Budget 2026: Complete Breakdown of New Tax Slabs & Benefits
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Finance Minister announces major relief for middle class — New regime now
            mandatory with higher standard deduction and revised capital gains rules.
          </p>
          <a href="#" className="mt-3 inline-block text-[11px] font-bold text-primary uppercase">
            Read Full Story →
          </a>
        </div>
        <Thumb src={parliament} alt="Budget 2026" className="h-32 w-full md:h-full" />
      </div>
    </section>
  );
}

const MORE = [
  { tag: "Weather", title: "Weather Alert: Heavy Rainfall Expected in 12 States" },
  { tag: "Transport", title: "New Train Routes: Vande Bharat Expands to 100 Routes" },
  { tag: "Education", title: "UPSC Results 2026: Top Rankers Share Their Strategy" },
  { tag: "Culture", title: "Festival Season: Dates and Celebrations Across India" },
  { tag: "Markets", title: "Stock Market Weekly: Best and Worst Performers" },
  { tag: "Health", title: "New COVID Variant: What We Know So Far" },
];

export function MoreNews() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-8">
      <SectionHead title="More News" subtitle="Weather, transport, education & beyond" />
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {MORE.map((m) => (
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
            <Badge tone="soft">Flipkart</Badge>
            <p className="truncate text-xs font-bold">
              Big Billion Days — Electronics Starting ₹499
            </p>
          </div>
        </div>
        <a href="#" className="shrink-0 bg-primary px-4 py-2 text-[11px] font-bold text-primary-foreground">
          Explore Deals
        </a>
      </div>
    </section>
  );
}
