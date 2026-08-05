import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, MapPin, MessageSquare, Share2, Bookmark, ChevronRight } from "lucide-react";
import { Header } from "@/components/news/Header";
import { Newsletter, Footer } from "@/components/news/Footer";
import { Badge } from "@/components/news/Sections";
import { getArticle, type Article } from "@/data/news";

export const Route = createFileRoute("/news/$slug")({
  loader: ({ params }) => getArticle(params.slug),
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Story unavailable — Zero Tolerance India" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.title} — Zero Tolerance India`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.dek },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.dek },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: NewsArticle,
  errorComponent: ({ error }) => (
    <div role="alert" className="mx-auto max-w-[1200px] px-4 py-20 text-sm">
      {error.message}
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-[1200px] px-4 py-20 text-sm">Story not found.</div>
  ),
});

function AdSlot({ label = "Advertisement" }: { label?: string }) {
  return (
    <div className="my-8 grid h-24 place-items-center border border-dashed border-border bg-tint sm:h-28">
      <span className="text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase">
        {label}
      </span>
    </div>
  );
}

function NewsArticle() {
  const a = Route.useLoaderData() as Article;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-[1200px] px-4 py-6">
        <nav className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-primary uppercase">{a.category}</span>
        </nav>

        <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* ---------- main story ---------- */}
          <article className="min-w-0">
            <Badge>{a.category}</Badge>
            <h1 className="mt-3 text-2xl leading-tight font-black tracking-tight sm:text-4xl">
              {a.title}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">{a.dek}</p>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-border py-3 text-[11px] text-muted-foreground">
              <span className="font-bold text-foreground">{a.author}</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {a.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {a.published}
              </span>
              <span>{a.readTime}</span>
              <span className="ml-auto flex items-center gap-2">
                <button className="flex items-center gap-1 border border-border px-2 py-1 transition-colors hover:border-primary hover:text-primary">
                  <Share2 className="h-3 w-3" /> Share
                </button>
                <button className="flex items-center gap-1 border border-border px-2 py-1 transition-colors hover:border-primary hover:text-primary">
                  <Bookmark className="h-3 w-3" /> Save
                </button>
              </span>
            </div>

            <figure className="mt-5">
              <img
                src={a.image}
                alt={a.title}
                className="h-56 w-full object-cover sm:h-96"
              />
              <figcaption className="mt-2 text-[11px] text-muted-foreground">
                {a.imageCaption}
              </figcaption>
            </figure>

            <AdSlot />

            <div className="space-y-4 text-[15px] leading-relaxed">
              {a.body.slice(0, 2).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            {/* insight / key points */}
            <section className="my-8 border-l-4 border-primary bg-tint p-5">
              <h2 className="text-xs font-black tracking-wider text-primary uppercase">
                The Insight — Why It Matters
              </h2>
              <ul className="mt-3 space-y-2">
                {a.keyPoints.map((k) => (
                  <li key={k} className="grid grid-cols-[auto_minmax(0,1fr)] gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-primary" />
                    <span>{k}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="space-y-4 text-[15px] leading-relaxed">
              {a.body.slice(2).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {a.tags.map((t) => (
                <span
                  key={t}
                  className="border border-border px-2 py-1 text-[10px] font-bold tracking-wide uppercase transition-colors hover:border-primary hover:text-primary"
                >
                  #{t}
                </span>
              ))}
            </div>

            <AdSlot label="Sponsored" />

            {/* ---------- comments ---------- */}
            <section id="comments">
              <div className="section-rule mb-4">
                <h2 className="flex items-center gap-2 text-lg font-black tracking-tight uppercase">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Reader Comments
                  <span className="text-xs font-bold text-muted-foreground">
                    ({a.comments.length})
                  </span>
                </h2>
              </div>

              <form
                onSubmit={(e) => e.preventDefault()}
                className="grid gap-2 border border-border bg-tint p-3 sm:grid-cols-[minmax(0,1fr)_auto]"
              >
                <input
                  required
                  placeholder="Share your view on this story…"
                  className="min-w-0 border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <button className="shrink-0 bg-primary px-5 py-2 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90">
                  Post Comment
                </button>
              </form>

              <ul className="mt-4 divide-y divide-border border border-border">
                {a.comments.map((c) => (
                  <li key={c.name} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 p-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center bg-primary text-[11px] font-black text-primary-foreground">
                      {c.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-2 text-xs font-bold">
                        {c.name}
                        <span className="font-normal text-muted-foreground">{c.time}</span>
                      </p>
                      <p className="mt-1 text-sm text-foreground/90">{c.text}</p>
                      <p className="mt-2 flex gap-4 text-[11px] text-muted-foreground">
                        <button className="hover:text-primary">▲ {c.likes}</button>
                        <button className="hover:text-primary">Reply</button>
                        <button className="hover:text-primary">Report</button>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <AdSlot />

            {/* ---------- next story ---------- */}
            <section>
              <div className="section-rule mb-4">
                <h2 className="text-lg font-black tracking-tight uppercase">Next Story</h2>
              </div>
              <Link
                to="/news/$slug"
                params={{ slug: a.next.slug }}
                className="group grid gap-4 border border-border p-3 transition-colors hover:border-primary sm:grid-cols-[220px_minmax(0,1fr)]"
              >
                <img
                  src={a.next.image}
                  alt={a.next.title}
                  className="h-36 w-full object-cover sm:h-full"
                />
                <div className="min-w-0">
                  <Badge>{a.next.category}</Badge>
                  <h3 className="mt-2 text-base font-black group-hover:text-primary">
                    {a.next.title}
                  </h3>
                  <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">
                    {a.next.summary}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-primary uppercase">
                    Read Full Story <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            </section>
          </article>

          {/* ---------- sidebar ---------- */}
          <aside className="min-w-0 space-y-6">
            <AdSlot label="Advertisement" />
            <div className="border border-border">
              <h2 className="bg-primary px-3 py-2 text-[11px] font-bold tracking-wider text-primary-foreground uppercase">
                Most Read Today
              </h2>
              <ol className="divide-y divide-border">
                {[
                  "Sensex Hits Record High: Nifty Crosses 25,000",
                  "Delhi AQI Drops to Best Level in 5 Years After Rain",
                  "IPL 2026 Auction: Record ₹25 Crore Bid for Young Pacer",
                  "Tata Motors Launches Cheapest EV at ₹7.99 Lakh",
                  "Kerala Wins Best Tourism State Award for 5th Year",
                ].map((t, i) => (
                  <li key={t} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 p-3">
                    <span className="text-base font-black text-primary">{i + 1}</span>
                    <span className="text-xs font-semibold">{t}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="h-64 grid place-items-center border border-dashed border-border bg-tint">
              <span className="text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase">
                Advertisement
              </span>
            </div>
          </aside>
        </div>
      </main>

      <Newsletter />
      <Footer />
    </div>
  );
}
