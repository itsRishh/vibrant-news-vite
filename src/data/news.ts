import cricket from "@/assets/cricket.jpg";
import redcarpet from "@/assets/redcarpet.jpg";
import parliament from "@/assets/parliament.jpg";
import tech from "@/assets/tech.jpg";
import i18n from "@/i18n";

export type Comment = {
  name: string;
  initials: string;
  time: string;
  text: string;
  likes: number;
};

export type Article = {
  slug: string;
  category: string;
  title: string;
  dek: string;
  author: string;
  location: string;
  published: string;
  readTime: string;
  image: string;
  imageCaption: string;
  body: string[];
  keyPoints: string[];
  tags: string[];
  comments: Comment[];
  next: { slug: string; category: string; title: string; summary: string; image: string };
};

export function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

const LOWER = new Set(["a", "an", "and", "as", "at", "for", "in", "of", "on", "or", "the", "to", "vs", "with"]);

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((w, i) =>
      i > 0 && LOWER.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1),
    )
    .join(" ");
}

const IMAGES = [parliament, cricket, redcarpet, tech];

const CURATED_SLUGS = [
  "monsoon-session-key-bills-to-watch-this-week",
  "india-vs-australia-t20-series-kicks-off-tonight",
  "shah-rukh-khan-announces-new-production-house",
  "jio-airfiber-2-0-launches-in-500-cities",
];

const CURATED_IMAGES: Record<string, string> = {
  "monsoon-session-key-bills-to-watch-this-week": parliament,
  "india-vs-australia-t20-series-kicks-off-tonight": cricket,
  "shah-rukh-khan-announces-new-production-house": redcarpet,
  "jio-airfiber-2-0-launches-in-500-cities": tech,
};

type ArticleSeed = {
  title: string;
  category: string;
  dek: string;
  body: string[];
  keyPoints: string[];
};

type CommentSeed = { name: string; time: string; text: string };

export function getArticle(slug: string, lang = i18n.language): Article {
  const t = i18n.getFixedT(lang);

  const seedVal = t(`articles.${slug}`, { returnObjects: true });
  const seed =
    seedVal && typeof seedVal === "object" && "title" in seedVal
      ? (seedVal as ArticleSeed)
      : null;

  const title = seed?.title ?? titleFromSlug(slug);
  const idx = Math.abs(
    [...slug].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7),
  );
  const image = CURATED_IMAGES[slug] ?? IMAGES[idx % IMAGES.length]!;
  const category = seed?.category ?? t("categories.India", { defaultValue: "India" });

  const nextSlug = CURATED_SLUGS[(CURATED_SLUGS.indexOf(slug) + 1 + CURATED_SLUGS.length) % CURATED_SLUGS.length]!;
  const nextSeedVal = t(`articles.${nextSlug}`, { returnObjects: true });
  const nextSeed =
    nextSeedVal && typeof nextSeedVal === "object" && "title" in nextSeedVal
      ? (nextSeedVal as ArticleSeed)
      : null;

  const defaultBodyRaw = t("article.defaultBody", { returnObjects: true });
  const defaultBody = (Array.isArray(defaultBodyRaw) ? defaultBodyRaw : []).map((p: string) =>
    p.replace(/\{\{title\}\}/g, title).replace(/\{\{category\}\}/g, category.toLowerCase()),
  );

  const defaultKeyPointsRaw = t("article.defaultKeyPoints", { returnObjects: true });
  const defaultKeyPoints = Array.isArray(defaultKeyPointsRaw) ? defaultKeyPointsRaw : [];

  const tagsRaw = t("article.tags", { returnObjects: true });
  const tags = Array.isArray(tagsRaw) ? tagsRaw : [];

  const commentsRaw = t("article.comments", { returnObjects: true }) as CommentSeed[];
  const comments: Comment[] = Array.isArray(commentsRaw)
    ? commentsRaw.map((c, i) => ({
        name: c.name,
        initials: c.name
          .split(" ")
          .map((p) => p[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        time: c.time,
        text: c.text,
        likes: [128, 64, 41, 27][i] ?? 10,
      }))
    : [];

  return {
    slug,
    category,
    title,
    dek: seed?.dek ?? t("article.defaultDek", { category: category.toLowerCase() }),
    author: t("article.author"),
    location: t("article.location"),
    published: t("article.published"),
    readTime: t("article.readTime"),
    image,
    imageCaption: `${title} — ${t("article.imageCaptionSuffix")}`,
    body: seed?.body ?? defaultBody,
    keyPoints: seed?.keyPoints ?? defaultKeyPoints,
    tags: [category, ...tags],
    comments,
    next: {
      slug: nextSlug,
      category: nextSeed?.category ?? t("categories.India"),
      title: nextSeed?.title ?? titleFromSlug(nextSlug),
      summary: nextSeed?.dek ?? t("article.defaultDek", { category: category.toLowerCase() }),
      image: CURATED_IMAGES[nextSlug] ?? parliament,
    },
  };
}
