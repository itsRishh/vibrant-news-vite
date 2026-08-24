import { useQuery } from "convex/react";
import ThumbVideo from "@/utils/ThumbVideo";
import { useTranslation } from "react-i18next";
import { SectionHead } from "@/utils/SectionHead";
import { Badge } from "@/utils/Badge";
import { Thumb } from "@/utils/Thumb";
import { Stamp } from "@/utils/Stamp";
import { api } from "../../../convex/_generated/api";

export default function BreakingTest() {
  const { t } = useTranslation();
  const articles = useQuery(api.breakingNews.list);

  if (!articles) {
    return <section className="px-4 py-6 text-sm text-muted-foreground">Loading breaking news...</section>;
  }

  if (articles.length === 0) {
    return <section className="px-4 py-6 text-sm text-muted-foreground">No breaking news published yet.</section>;
  }

  const byPosition = new Map(articles.map((article) => [article.position, article]));
  const heroOne = byPosition.get(1);
  const heroTwo = byPosition.get(2);
  const cards = [3, 4, 5, 6]
    .map((position) => byPosition.get(position))
    .filter((article): article is (typeof articles)[number] => article !== undefined);

  if (!heroOne && !heroTwo && cards.length === 0) return null;

  return (
    <section className="lg:max-w-[1250px] max-w-[100vw] sm:px-4 px-4 lg:px-0 pt-6">
      <SectionHead title={t("sections.breaking.title")} />

      <div className="flex w-full grid gap-4 lg:grid-cols-[1fr_1fr_1fr_1fr]">
        <article className="group relative w-full overflow-hidden lg:col-span-2 bg-ink lg:h-full h-80">
          <ThumbVideo src={heroOne?.imageUrl ?? ""} {...(heroOne?.mediaType ? { mediaType: heroOne.mediaType } : {})} alt={heroOne?.title ?? ""} className="absolute top-0 left-0 w-full sm:h-80 lg:h-80 object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink via-ink/40 to-transparent p-5">
            <Badge>{heroOne?.category ?? "BREAKING"}</Badge>
            <h3 className="mt-2 text-sm font-black text-background sm:text-2xl">
              {heroOne?.title ?? "Hero 1 is empty"}
            </h3>
            <p className="mt-1 text-[11px] text-background/70">{heroOne?.excerpt}</p>
          </div>
        </article>

        <article className="group relative w-full overflow-hidden bg-ink lg:col-span-2">
            <ThumbVideo src={heroTwo?.imageUrl ?? ""} {...(heroTwo?.mediaType ? { mediaType: heroTwo.mediaType } : {})} alt={heroTwo?.title ?? ""} className="h-70 w-full sm:h-80 lg:h-100" />
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink via-ink/40 to-transparent p-5">
            <h3 className="mt-2 text-sm font-black text-background sm:text-2xl">{heroTwo?.title ?? "Hero 2 is empty"}</h3>
            <Badge>{heroTwo?.category ?? "BREAKING"}</Badge>
          </div>
        </article>

        {cards.map((card) => (
        <article key={card._id} className="group overflow-hidden border border-border">
            <div className="relative lg:h-24 h-48 overflow-hidden">
              <ThumbVideo
                src={card.imageUrl ?? ""}
                {...(card.mediaType ? { mediaType: card.mediaType } : {})}
                alt={card.title}
                className="h-32 transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-2 left-2">
                <Badge>{card.category}</Badge>
              </span>
              {card.badge && (
                <span className="absolute top-2 right-2 bg-ink px-2 py-0.5 text-[9px] font-bold text-background">
                  {card.badge}
                </span>
              )}
            </div>
            <div className="p-3">
              <h3 className="text-sm font-bold">{card.title}</h3>
              <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{card.excerpt}</p>
              <div className="mt-2">
                <Stamp time={new Date(card.publishedAt).toLocaleString()} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
