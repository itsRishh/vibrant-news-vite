import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Badge } from "@/utils/Badge";
import { SectionHead } from "@/utils/SectionHead";
import { Stamp } from "@/utils/Stamp";
import ThumbVideo from "@/utils/ThumbVideo";

export default function RegionalTest() {
  const articles = useQuery(api.regionalNews.list);

  if (!articles) {
    return <section className="px-4 py-6 text-sm text-muted-foreground">Loading regional news...</section>;
  }

  if (articles.length === 0) {
    return <section className="px-4 py-6 text-sm text-muted-foreground">No regional news published yet.</section>;
  }

  const byPosition = new Map(articles.map((article) => [article.position, article]));
  const hero = byPosition.get(1);
  const cards = [2, 3, 4, 5]
    .map((position) => byPosition.get(position))
    .filter((article): article is (typeof articles)[number] => article !== undefined);
  const ad = byPosition.get(6);
  const textSlots = [7, 8, 9, 10, 11]
    .map((position) => byPosition.get(position))
    .filter((article): article is (typeof articles)[number] => article !== undefined);

  return (
    <section className="lg:max-w-[1250px] max-w-[100vw] sm:px-4 px-4 lg:px-0 pt-6">
      <SectionHead title="Regional News" subtitle="District and regional leads from across the state." />

      <div className="mt-4 grid gap-4 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
        <article className="group relative min-h-[330px] overflow-hidden bg-ink lg:col-span-2">
          {hero ? (
            <>
              <ThumbVideo
                src={hero.imageUrl ?? ""}
                alt={hero.title}
                mediaType={hero.mediaType}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink via-ink/80 to-transparent p-5">
                <Badge>{hero.category}</Badge>
                <h3 className="mt-2 text-xl font-black text-background sm:text-2xl">{hero.title}</h3>
                <p className="mt-2 line-clamp-2 text-xs text-background/75">{hero.excerpt}</p>
                <div className="mt-3">
                  <Stamp time={new Date(hero.publishedAt).toLocaleString()} />
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center bg-muted text-sm text-muted-foreground">Regional hero is empty</div>
          )}
        </article>

        {cards.map((card) => (
          <article key={card._id} className="group overflow-hidden border border-border">
            <div className="relative h-32 overflow-hidden">
              <ThumbVideo
                src={card.imageUrl ?? ""}
                alt={card.title}
                mediaType={card.mediaType}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-2 left-2"><Badge>{card.category}</Badge></span>
              {card.badge && (
                <span className="absolute top-2 right-2 bg-ink px-2 py-0.5 text-[9px] font-bold text-background">{card.badge}</span>
              )}
            </div>
            <div className="p-3">
              <h3 className="text-sm font-bold">{card.title}</h3>
              <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{card.excerpt}</p>
              <div className="mt-2"><Stamp time={new Date(card.publishedAt).toLocaleString()} /></div>
            </div>
          </article>
        ))}
      </div>

      {ad ? (
        <div className="mt-4 overflow-hidden border border-border bg-muted/30">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <Badge>Ad</Badge>
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Sponsored</span>
          </div>
          {ad.imageUrl ? (
            <ThumbVideo src={ad.imageUrl} alt={ad.title} mediaType={ad.mediaType} className="h-40 w-full object-cover" />
          ) : (
            <div className="flex h-40 items-center justify-center text-xs text-muted-foreground">Ad slot</div>
          )}
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {textSlots.map((item) => (
          <article key={item._id} className="border border-border p-3 transition-colors hover:border-primary">
            <Badge tone="soft">{item.category}</Badge>
            <h3 className="mt-1.5 text-xs font-bold">{item.title}</h3>
            <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{item.excerpt}</p>
            <div className="mt-2"><Stamp time={new Date(item.publishedAt).toLocaleString()} /></div>
          </article>
        ))}
      </div>
    </section>
  );
}
