import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Clock, ChevronRight } from "lucide-react";
import { Header } from "@/components/news/Header";
import { Newsletter, Footer } from "@/components/news/Footer";
import { Badge } from "@/components/news/Sections";
import { getFeed, FEED_LIST, type Feed } from "@/data/feeds";

export const Route = createFileRoute("/category/$category")({
  loader: ({ params }) => {
    const feed = getFeed(params.category);
    if (!feed) throw notFound();
    return feed;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Section unavailable — Zero Tolerance India" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${loaderData.name} News — Zero Tolerance India`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.description },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CategoryFeed,
  notFoundComponent: () => (
    <div className="mx-auto max-w-[1200px] px-4 py-20 text-sm">Section not found.</div>
  ),
});

function CategoryFeed() {
  const feed = Route.useLoaderData() as Feed;
  const [lead, ...rest] = feed.items;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-[1200px] px-4 py-6">
        <nav className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-primary uppercase">{feed.name}</span>
        </nav>

        <div className="section-rule mt-4 mb-6">
          <h1 className="text-2xl font-black tracking-tight uppercase sm:text-3xl">
            {feed.name} <span className="text-primary">News</span>
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">{feed.tagline}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            {lead && (
              <Link
                to="/news/$slug"
                params={{ slug: lead.slug }}
                className="group block border border-border transition-colors hover:border-primary"
              >
                <img src={lead.image} alt={lead.title} className="h-56 w-full object-cover sm:h-80" />
                <div className="p-4">
                  <Badge>{feed.name}</Badge>
                  <h2 className="mt-2 text-xl font-black leading-tight group-hover:text-primary sm:text-2xl">
                    {lead.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">{lead.dek}</p>
                  <p className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3" /> {lead.time}
                  </p>
                </div>
              </Link>
            )}

            <div className="my-8 grid h-24 place-items-center border border-dashed border-border bg-tint">
              <span className="text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase">
                Advertisement
              </span>
            </div>

            <ul className="divide-y divide-border border border-border">
              {rest.map((item) => (
                <li key={item.slug}>
                  <Link
                    to="/news/$slug"
                    params={{ slug: item.slug }}
                    className="group grid gap-4 p-3 sm:grid-cols-[180px_minmax(0,1fr)]"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-32 w-full object-cover sm:h-full"
                    />
                    <div className="min-w-0">
                      <h3 className="text-base font-black leading-snug group-hover:text-primary">
                        {item.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.dek}</p>
                      <p className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="h-3 w-3" /> {item.time}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <aside className="min-w-0 space-y-6">
            <div className="border border-border">
              <h2 className="bg-primary px-3 py-2 text-[11px] font-bold tracking-wider text-primary-foreground uppercase">
                Other Sections
              </h2>
              <ul className="divide-y divide-border">
                {FEED_LIST.filter((f) => f.slug !== feed.slug).map((f) => (
                  <li key={f.slug}>
                    <Link
                      to="/category/$category"
                      params={{ category: f.slug }}
                      className="block p-3 text-xs font-semibold hover:text-primary"
                    >
                      {f.name}
                      <span className="mt-0.5 block font-normal text-muted-foreground">
                        {f.tagline}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid h-64 place-items-center border border-dashed border-border bg-tint">
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
