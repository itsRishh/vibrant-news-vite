import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Badge } from "@/utils/Badge";
import { SectionHead } from "@/utils/SectionHead";
import { Stamp } from "@/utils/Stamp";
import ThumbVideo from "@/utils/ThumbVideo";

export default function IndiaTest() {
  const articles = useQuery(api.latestNews.list);

  if (!articles) {
    return <section className="px-4 py-6 text-sm text-muted-foreground">Loading India news...</section>;
  }

  if (articles.length === 0) {
    return <section className="px-4 py-6 text-sm text-muted-foreground">No India news published yet.</section>;
  }

  const byPosition = new Map(articles.map((article) => [article.position, article]));
  const hero = byPosition.get(1) ?? articles[0];
  const leftCards = [2, 3, 4, 5]
    .map((position) => byPosition.get(position))
    .filter((article): article is (typeof articles)[number] => article !== undefined);
  const rightCards = [6, 7, 8, 9]
    .map((position) => byPosition.get(position))
    .filter((article): article is (typeof articles)[number] => article !== undefined);

  return (
    <section className="lg:max-w-[1250px] max-w-[100vw] sm:px-4 px-4 lg:px-0 pt-6">
      <SectionHead title="India News" subtitle="National headlines, developments, and leading stories from across the country." />

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_1.8fr_1.1fr]">
        <div className="grid gap-3">
          {leftCards.slice(0, 4).map((card) => (
            <article key={card._id} className="border border-border bg-background p-3 transition-colors hover:border-primary">
              <h3 className="text-sm font-black leading-snug">{card.title}</h3>
              <p className="mt-1 line-clamp-3 text-[11px] text-muted-foreground">{card.excerpt}</p>
              <div className="mt-2"><Stamp time={new Date(card.publishedAt).toLocaleString()} /></div>
            </article>
          ))}
        </div>

        <article className="group relative min-h-[360px] overflow-hidden bg-ink">
          <ThumbVideo
            src={hero.imageUrl ?? ""}
            alt={hero.title}
            mediaType={hero.mediaType}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink via-ink/80 to-transparent p-5">
            <Badge>{hero.category}</Badge>
            <h3 className="mt-2 text-xl font-black text-background sm:text-2xl">{hero.title}</h3>
            <p className="mt-2 line-clamp-3 text-xs text-background/75">{hero.excerpt}</p>
            <div className="mt-3"><Stamp time={new Date(hero.publishedAt).toLocaleString()} /></div>
          </div>
        </article>

        <div className="grid gap-3">
          {rightCards.slice(0, 4).map((card) => (
            <article key={card._id} className="border border-border bg-background p-3 transition-colors hover:border-primary">
              <div className="mb-2 flex items-center justify-between gap-2">
                <Badge tone="soft">{card.category}</Badge>
                {card.badge && <span className="text-[9px] font-bold uppercase text-muted-foreground">{card.badge}</span>}
              </div>
              <h3 className="text-sm font-black leading-snug">{card.title}</h3>
              <p className="mt-1 line-clamp-3 text-[11px] text-muted-foreground">{card.excerpt}</p>
              <div className="mt-2"><Stamp time={new Date(card.publishedAt).toLocaleString()} /></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
