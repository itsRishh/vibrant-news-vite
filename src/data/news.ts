import cricket from "@/assets/images/rewa.jpg";
import redcarpet from "@/assets/images/agniverma.jpg";
// import tech from "@/assets/images/tirangapaint.jpeg";
import i18n from "@/i18n";
import en from "@/locales/en.json";
import hi from "@/locales/hi.json";
import { findFeedItem } from "./feeds";

const t = i18n.t.bind(i18n);

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
  subHead: string;
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
  next: { slug: string; section?: string; category: string; title: string; summary: string; image: string };
};

type ArticleSeed = {
  title?: string;
  category?: string;
  subHead?: string;
  summary?: string;
  body?: string[];
  keyPoints?: string[];
  image?: string;
  tags?: string[];
};

const DEFAULT_BODY = [
  "Body is not being fetched.",
];

const DEFAULT_KEY_POINTS = [
  "बंदूक की नली से निकले सुर",
  "1921 से चली मैहर बैंड की परंपरा",
  "नाल तरंग की विरासत आज भी जारी, ज्योति चौधरी और सौरभ चौरसिया जैसे कलाकार",
  "परंप्रा के सामने नई चुनौती, 106 साल पुरानी विरासत के कमजोर पड़ने की चिंता",
];

export function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u0900-\u097F\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function normalizeSectionKey(value: string) {
  return (value || "general")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "general";
}

export function buildSectionArticleSlug(section: string, title: string) {
  return `${normalizeSectionKey(section)}/${slugify(title)}`;
}

export function parseSectionArticleSlug(value: string) {
  const raw = (value || "").replace(/^\/+|\/+$/g, "");
  const parts = raw.split("/").filter(Boolean);

  if (parts.length >= 2) {
    return { section: parts[0], slug: parts.slice(1).join("/") };
  }

  return { section: "general", slug: parts[0] ?? "" };
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

const IMAGES = [cricket, redcarpet];

const CURATED_SLUGS = [
  "monsoon-session-key-bills-to-watch-this-week",
  "india-vs-australia-t20-series-kicks-off-tonight",
  "shah-rukh-khan-announces-new-production-house",
  "jio-airfiber-2-0-launches-in-500-cities",
];

const CURATED_IMAGES: Record<string, string> = {
  "india-vs-australia-t20-series-kicks-off-tonight": cricket,
  "shah-rukh-khan-announces-new-production-house": redcarpet,
  // "jio-airfiber-2-0-launches-in-500-cities": tech,
};

const ORDER = CURATED_SLUGS;

const CURATED: Record<string, Partial<ArticleSeed>> = {
  "monsoon-session-key-bills-to-watch-this-week": {
    title: "Monsoon Session: Key Bills to Watch This Week",
    category: "India",
    subHead: "Parliament set to debate key legislative priorities",
    body: [],
    keyPoints: [],
  },
  "india-vs-australia-t20-series-kicks-off-tonight": {
    title: "India vs Australia T20 Series Kicks Off Tonight",
    category: "Sports",
    subHead: "T20 cricket series begins with high expectations",
    body: [],
    keyPoints: [],
  },
  "shah-rukh-khan-announces-new-production-house": {
    title: "Shah Rukh Khan Announces New Production House",
    category: "Bollywood",
    subHead: "Bollywood star launches new venture in entertainment",
    body: [],
    keyPoints: [],
  },
  "jio-airfiber-2-0-launches-in-500-cities": {
    title: "Jio Airfiber 2.0 Launches in 500 Cities",
    category: "Tech",
    subHead: "New broadband service expands to major markets",
    body: [],
    keyPoints: [],
  },
};

const BASE_COMMENTS: Comment[] = [
  {
    name: "Rajesh Kumar",
    initials: "RK",
    time: "2 hours ago",
    text: "This is an important development. Looking forward to more updates on this story.",
    likes: 45,
  },
  {
    name: "Priya Sharma",
    initials: "PS",
    time: "1 hour ago",
    text: "Great reporting on this issue. The coverage is comprehensive and well-researched.",
    likes: 32,
  },
  {
    name: "Amit Patel",
    initials: "AP",
    time: "45 minutes ago",
    text: "Very insightful article. Raises some important questions we need to address.",
    likes: 28,
  },
];

function filterStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.filter((entry): entry is string => typeof entry === "string");
  return items.length ? items : undefined;
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function buildSectionArticleIndex(locale: Record<string, any>): Record<string, ArticleSeed> {
  const result: Record<string, ArticleSeed> = {};

  const registerArticle = (sectionName: string, item: Record<string, unknown>) => {
    const title = readString(item["title"])?.trim();
    if (!title) return;

    const normalizedSection = normalizeSectionKey(sectionName || "general");
    const key = `${normalizedSection}/${slugify(title)}`;
    const body = filterStringArray(item["body"]);
    const keyPoints = filterStringArray(item["keyPoints"]);
    const image = readString(item["image"]) ?? readString(item["vidsrc"]);
    const category = readString(item["category"]) ?? sectionName;
    const subHead =
      readString(item["subHead"]) ??
      readString(item["summary"]) ??
      readString(item["dek"]);
    const summary = readString(item["summary"]) ?? subHead;
    const article: ArticleSeed = {
      title,
      category,
      ...(subHead ? { subHead } : {}),
      ...(summary ? { summary } : {}),
      ...(body ? { body } : {}),
      ...(keyPoints ? { keyPoints } : {}),
      ...(image ? { image } : {}),
      ...(filterStringArray(item["tags"]) ? { tags: filterStringArray(item["tags"]) } : {}),
    };

    result[key] = { ...result[key], ...article };
    result[slugify(title)] = { ...result[slugify(title)], ...article };
  };

  const walkNode = (node: unknown, sectionName: string) => {
    if (!node || typeof node !== "object") return;

    if (Array.isArray(node)) {
      node.forEach((entry) => {
        if (entry && typeof entry === "object" && typeof (entry as Record<string, unknown>)["title"] === "string") {
          registerArticle(sectionName, entry as Record<string, unknown>);
        }
      });
      return;
    }

    Object.entries(node).forEach(([key, value]) => {
      if (!value || typeof value !== "object") return;

      const typedValue = value as Record<string, unknown>;
      const nextSection = typeof typedValue["title"] === "string" ? sectionName : key;

      if (typeof typedValue["title"] === "string") {
        registerArticle(sectionName, typedValue);
      }

      walkNode(value, nextSection);
    });
  };

  if (locale["sections"] && typeof locale["sections"] === "object") {
    Object.entries(locale["sections"]).forEach(([sectionName, sectionValue]) => {
      walkNode(sectionValue, sectionName);
    });
  }

  Object.entries(locale["articles"] ?? {}).forEach(([key, value]) => {
    if (!value || typeof value !== "object") return;
    const record = value as Record<string, unknown>;
    const title = readString(record["title"])?.trim();
    if (!title) return;
    const section = readString(record["category"]) ?? "general";
    registerArticle(section, record);
    const entryKey = `${normalizeSectionKey(section)}/${slugify(title)}`;
    result[entryKey] = { ...result[entryKey], title, category: section, ...(readString(record["subHead"]) ? { subHead: readString(record["subHead"]) } : {}), ...(readString(record["summary"]) ? { summary: readString(record["summary"]) } : {}) };
    result[key] = { ...result[key], title, category: section, ...(readString(record["subHead"]) ? { subHead: readString(record["subHead"]) } : {}), ...(readString(record["summary"]) ? { summary: readString(record["summary"]) } : {}) };
  });

  return result;
}

const SECTION_ARTICLE_INDEX = {
  ...buildSectionArticleIndex(en as Record<string, any>),
  ...buildSectionArticleIndex(hi as Record<string, any>),
};

export function getArticleByTitle(title: string) {
  const text = title.trim();
  if (!text) return null;

  const directKey = Object.keys(SECTION_ARTICLE_INDEX).find((key) => {
    const item = SECTION_ARTICLE_INDEX[key];
    return item?.title === text;
  });

  if (directKey) {
    const parsed = parseSectionArticleSlug(directKey);
    return { section: parsed.section, slug: parsed.slug || slugify(text) };
  }

  return { section: "general", slug: slugify(text) };
}

export function getArticle(sectionOrSlug: string, maybeSlug?: string): Article {
  const parsed = maybeSlug ? { section: sectionOrSlug, slug: maybeSlug } : parseSectionArticleSlug(sectionOrSlug);
  const section = parsed.section || "general";
  const slug = (parsed.slug || "").trim();
  const normalizedSection = normalizeSectionKey(section);
  const targetSlug = slugify(slug || "");
  const localeKey = `${normalizedSection}/${targetSlug}`;
  const localeArticle =
    SECTION_ARTICLE_INDEX[localeKey] ??
    SECTION_ARTICLE_INDEX[targetSlug] ??
    SECTION_ARTICLE_INDEX[slug];

  const found = findFeedItem(slug);
  const seed: Partial<Article> = {
    ...(found ? { category: found.feed.name, subHead: found.item.subHead, image: found.item.image } : {}),
    ...(CURATED[slug] ?? {}),
    ...(localeArticle ?? {}),
  };

  const title = localeArticle?.title ?? found?.item.title ?? (seed as { title?: string }).title ?? titleFromSlug(slug);
  const idx = Math.abs(
    [...slug].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7),
  );
  // const imgpath = normalizedSection;
  const image = localeArticle?.image;
  const category = localeArticle?.category ?? seed?.category ?? t("categories.India", { defaultValue: "India" });

  let next: Article["next"];
  if (found) {
    const items = found.feed.items;
    const i = items.findIndex((it) => it.slug === slug);
    const n = items[(i + 1) % items.length]!;
    next = { slug: n.slug, section: normalizedSection, category: found.feed.name, title: n.title, summary: n.subHead, image: n.image };
  } else {
    const nextSlug = ORDER[(ORDER.indexOf(slug) + 1 + ORDER.length) % ORDER.length]!;
    const nextSeed = CURATED[nextSlug]!;
    next = { slug: nextSlug, section: normalizedSection, category: nextSeed.category!, title: titleFromSlug(nextSlug), summary: nextSeed.subHead!, image: nextSeed.image! };
  }

  return {
    slug: localeKey || slug,
    category,
    title,
    subHead: localeArticle?.subHead ?? seed.subHead ?? t("article.defaultSubHead", { defaultValue: "Breaking news and analysis from India and around the world." }),
    author: t("article.author"),
    location: t("article.location"),
    published: t("article.published"),
    readTime: t("article.readTime"),
    image,
    imageCaption: `${title} — file photo. (Zero Tolerance India)`,
    body: localeArticle?.body?.length ? localeArticle.body : seed.body ?? DEFAULT_BODY,
    keyPoints: localeArticle?.keyPoints?.length ? localeArticle.keyPoints : seed.keyPoints ?? DEFAULT_KEY_POINTS,
    tags: localeArticle?.tags?.length ? localeArticle.tags : [category, "India", "Zero Tolerance", "Explained"],
    comments: BASE_COMMENTS,
    next,
  };
}
