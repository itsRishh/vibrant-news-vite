import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Badge } from "@/utils/Badge";
import ThumbVideo from "@/utils/ThumbVideo";
import { Stamp } from "@/utils/Stamp";
import { Flame } from "lucide-react";

export default function LocalTest() {
  const articles = useQuery(api.localNews.list);
  console.log("LocalTest articles:", articles);

  if (!articles) {
    return <section className="px-4 py-6 text-sm text-muted-foreground">Loading local news...</section>;
  }

  const byPosition = new Map(articles.map((article) => [article.position, article]));
  const hero = byPosition.get(1);
  const cards = [2, 3, 4]
    .map((position) => byPosition.get(position))
    .filter((article): article is (typeof articles)[number] => article !== undefined);
  const ad = byPosition.get(5);

  return (
    <section className="lg:max-w-[1250px] max-w-[100vw] px-4 pt-6 lg:px-0">
      <div className="mb-3 flex items-center justify-between">
        <div className="section-rule">
          <h2 className="text-lg font-black tracking-tight uppercase">Local News</h2>
        </div>
        <span className="flex items-center gap-1 bg-primary px-2 py-0.5 text-[9px] font-bold text-primary-foreground uppercase">
          <Flame className="h-3 w-3" /> Live
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr]">
        <article className="group relative min-h-[320px] overflow-hidden bg-ink lg:row-span-2">
          {hero ? (
            <>
              <ThumbVideo
                src={hero.imageUrl}
                alt={hero.title}
                mediaType={hero.mediaType}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge>{hero.category}</Badge>
                <Badge tone="ink">{hero.badge}</Badge>
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink via-ink/80 to-transparent p-5">
                <h3 className="text-xl font-black text-background sm:text-2xl">{hero.title}</h3>
                <p className="mt-2 line-clamp-2 text-xs text-background/75">{hero.excerpt}</p>
                <div className="mt-3">
                  <Stamp time={new Date(hero.publishedAt).toLocaleString()} />
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center bg-muted text-sm text-muted-foreground">
              No local hero published yet
            </div>
          )}
        </article>

        {cards.map((article) => (
          <article key={article._id} className="group overflow-hidden border border-border">
            <div className="relative h-32 overflow-hidden">
              <ThumbVideo
                src={article.imageUrl}
                alt={article.title}
                mediaType={article.mediaType}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-2 left-2"><Badge>{article.category}</Badge></span>
              {article.badge && (
                <span className="absolute top-2 right-2 bg-ink px-2 py-0.5 text-[9px] font-bold text-background">{article.badge}</span>
              )}
            </div>
            <div className="p-3">
              <h3 className="text-sm font-bold">{article.title}</h3>
              <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{article.excerpt}</p>
              <div className="mt-2">
                <Stamp time={new Date(article.publishedAt).toLocaleString()} />
              </div>
            </div>
          </article>
        ))}

        {ad ? (
          <article className="group relative overflow-hidden border border-border">
            <div className="p-3">
              <Badge>Ad</Badge>
            </div>
            {ad.imageUrl ? (
              <ThumbVideo
                src={ad.imageUrl}
                alt={ad.title}
                mediaType={ad.mediaType}
                className="h-48 w-full object-cover"
              />
            ) : (
              <div className="flex h-48 items-center justify-center bg-muted text-xs text-muted-foreground">Ad slot</div>
            )}
          </article>
        ) : (
          <article className="group relative overflow-hidden border border-border">
            <div className="p-3">
              <Badge>Ad</Badge>
            </div>
            <div className="flex h-48 items-center justify-center bg-muted text-xs text-muted-foreground">Ad slot</div>
          </article>
        )}
      </div>
    </section>
  );
}
