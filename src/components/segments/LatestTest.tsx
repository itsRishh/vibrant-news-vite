import { useQuery } from "convex/react";
import { Flame } from "lucide-react";
import { useTranslation } from "react-i18next";
import { api } from "../../../convex/_generated/api";
import { Badge } from "@/utils/Badge";
import { Stamp } from "@/utils/Stamp";
import ThumbVideo from "@/utils/ThumbVideo";
import mohan from "@/assets/images/baad.jpeg";
import racket from "@/assets/images/racket.jpeg";
import paani from "@/assets/images/paani.jpeg";
import redcarpet from "@/assets/images/profile.jpeg";

export default function LatestTest() {
    const { t } = useTranslation();
    const articles = useQuery(api.latestNews.list);
    const fallbackHero = t("sections.latestNews.hero", { returnObjects: true }) as {
        title: string;
        subHead: string;
        category: string;
        badge: string;
    };
    const fallbackCards = t("sections.latestNews.cards", { returnObjects: true }) as Array<{
        title: string;
        subHead: string;
        category: string;
        badge?: string;
        time?: string;
    }>;
    const fallbackShortCards = t("sections.latestNews.smallCards", { returnObjects: true }) as Array<{
        title: string;
        tag: string;
        time?: string;
    }>;
    const fallbackImages = [paani, racket, undefined, redcarpet];

    if (!articles) {
        return <section className="px-4 py-6 text-sm text-muted-foreground">Loading latest news...</section>;
    }

    const byPosition = new Map(articles.map((article) => [article.position, article]));
    const hero = byPosition.get(1);
    const cards = [2, 3, 4, 5]
        .map((position) => byPosition.get(position))
        .filter((article): article is (typeof articles)[number] => article !== undefined);
    const shortNews = [6, 7, 8, 9, 10, 11]
        .map((position) => byPosition.get(position))
        .filter((article): article is (typeof articles)[number] => article !== undefined);

    return (
        <section className="lg:max-w-[1250px] max-w-[100vw] px-4 pt-6 lg:px-0">
            <div className="mb-3 flex items-center justify-between">
                <div className="section-rule">
                    <h2 className="text-lg font-black tracking-tight uppercase">{t("sections.latestNews.title")}</h2>
                </div>
                <span className="flex items-center gap-1 bg-primary px-2 py-0.5 text-[9px] font-bold text-primary-foreground uppercase">
                    <Flame className="h-3 w-3" /> {t("sections.live")}
                </span>
            </div>

            <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr]">
                <article data-article-slug={hero?.slug} className="group relative min-h-[320px] overflow-hidden bg-ink lg:row-span-2">
                        <ThumbVideo
                        src={hero?.imageUrl ?? mohan}
                        {...(hero?.mediaType ? { mediaType: hero.mediaType } : {})}
                        alt={hero?.title ?? fallbackHero.title}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                        <Badge>{hero?.category ?? fallbackHero.category}</Badge>
                        <Badge tone="ink">{hero?.badge ?? fallbackHero.badge}</Badge>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink via-ink/80 to-transparent p-5">
                        <h3 className="text-xl font-black text-background sm:text-2xl">{hero?.title ?? fallbackHero.title}</h3>
                        <p className="mt-2 line-clamp-2 text-xs text-background/75">{hero?.excerpt ?? fallbackHero.subHead}</p>
                    </div>
                </article>

                {(cards.length ? cards : fallbackCards.slice(0, 4)).map((article, index) => {
                    const isPublishedArticle = "_id" in article;
                    return (
                            <article data-article-slug={isPublishedArticle ? article.slug : undefined} key={isPublishedArticle ? article._id : article.title} className="group overflow-hidden border border-border">
                            <div className="relative h-32 overflow-hidden">
                                <ThumbVideo
                                    {...(isPublishedArticle
                                        ? article.imageUrl
                                            ? { src: article.imageUrl }
                                            : {}
                                        : fallbackImages[index]
                                          ? { src: fallbackImages[index] }
                                          : {})}
                                    {...(isPublishedArticle && article.mediaType ? { mediaType: article.mediaType } : {})}
                                    alt={article.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <span className="absolute top-2 left-2"><Badge>{article.category}</Badge></span>
                                {article.badge && <span className="absolute top-2 right-2 bg-ink px-2 py-0.5 text-[9px] font-bold text-background">{article.badge}</span>}
                            </div>
                            <div className="p-3">
                                <h3 className="text-sm font-bold">{article.title}</h3>
                                <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{"excerpt" in article ? article.excerpt : article.subHead}</p>
                                {"time" in article && <div className="mt-2"><Stamp time={article.time ?? ""} /></div>}
                            </div>
                        </article>
                    );
                })}

            </div>
            {/* short news */}

            <div className="w-full mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(shortNews.length ? shortNews : fallbackShortCards.slice(0, 6)).map((article) => {
                    const isPublishedArticle = "_id" in article;
                    return <article data-article-slug={isPublishedArticle ? article.slug : undefined} key={isPublishedArticle ? article._id : article.title} className="group overflow-hidden border border-border">
                        <div className="px-2 py-1">
                            <Badge tone="soft">{isPublishedArticle ? article.category : article.tag}</Badge>
                            <h3 className="mt-1.5 text-xs font-bold group-hover:text-primary">{article.title}</h3>
                            {"publishedAt" in article ? <div className="mt-2"><Stamp time={new Date(article.publishedAt).toLocaleString()} /></div> : <div className="mt-2"><Stamp time={article.time ?? ""} /></div>}
                        </div>
                    </article>;
                })}
            </div>
        </section>
    );
}
