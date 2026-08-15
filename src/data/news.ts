import cricket from "@/assets/images/rewa.jpg";
import redcarpet from "@/assets/images/profile.jpeg";
// import parliament from "@/assets/videos/tiranga.mp4";
import tech from "@/assets/images/ajgar.jpeg";
import i18n from "@/i18n";
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

const IMAGES = [cricket, redcarpet, tech];

const CURATED_SLUGS = [
  "monsoon-session-key-bills-to-watch-this-week",
  "india-vs-australia-t20-series-kicks-off-tonight",
  "shah-rukh-khan-announces-new-production-house",
  "jio-airfiber-2-0-launches-in-500-cities",
];

const CURATED_IMAGES: Record<string, string> = {
  // "monsoon-session-key-bills-to-watch-this-week": parliament,
  "india-vs-australia-t20-series-kicks-off-tonight": cricket,
  "shah-rukh-khan-announces-new-production-house": redcarpet,
  "jio-airfiber-2-0-launches-in-500-cities": tech,
};

const ORDER = CURATED_SLUGS;

const CURATED: Record<string, Partial<ArticleSeed>> = {
  "monsoon-session-key-bills-to-watch-this-week": {
    title: "Monsoon Session: Key Bills to Watch This Week",
    category: "India",
    dek: "Parliament set to debate key legislative priorities",
    body: [],
    keyPoints: [],
  },
  "india-vs-australia-t20-series-kicks-off-tonight": {
    title: "India vs Australia T20 Series Kicks Off Tonight",
    category: "Sports",
    dek: "T20 cricket series begins with high expectations",
    body: [],
    keyPoints: [],
  },
  "shah-rukh-khan-announces-new-production-house": {
    title: "Shah Rukh Khan Announces New Production House",
    category: "Bollywood",
    dek: "Bollywood star launches new venture in entertainment",
    body: [],
    keyPoints: [],
  },
  "jio-airfiber-2-0-launches-in-500-cities": {
    title: "Jio Airfiber 2.0 Launches in 500 Cities",
    category: "Tech",
    dek: "New broadband service expands to major markets",
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

type ArticleSeed = {
  title?: string;
  category?: string;
  dek?: string;
  body?: string[];
  keyPoints?: string[];
  image?: string;
};

export function getArticle(slug: string): Article {
  const found = findFeedItem(slug);
  const seed: Partial<Article> = {
    ...(found
      ? { category: found.feed.name, dek: found.item.dek, image: found.item.image }
      : {}),
    ...(CURATED[slug] ?? {}),
  };
  const title = found?.item.title ?? (seed as { title?: string }).title ?? titleFromSlug(slug);
  const idx = Math.abs(
    [...slug].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7),
  );
  const image = CURATED_IMAGES[slug] ?? IMAGES[idx % IMAGES.length]!;
  const category = seed?.category ?? t("categories.India", { defaultValue: "India" });

  let next: Article["next"];
  if (found) {
    const items = found.feed.items;
    const i = items.findIndex((it) => it.slug === slug);
    const n = items[(i + 1) % items.length]!;
    next = {
      slug: n.slug,
      category: found.feed.name,
      title: n.title,
      summary: n.dek,
      image: n.image,
    };
  } else {
    const nextSlug = ORDER[(ORDER.indexOf(slug) + 1 + ORDER.length) % ORDER.length]!;
    const nextSeed = CURATED[nextSlug]!;
    next = {
      slug: nextSlug,
      category: nextSeed.category!,
      title: titleFromSlug(nextSlug),
      summary: nextSeed.dek!,
      image: nextSeed.image!,
    };
  }

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
    imageCaption: `${title} — file photo. (Zero Tolerance India)`,
    body:
      seed.body ?? [
        `${title}. The development came late on Tuesday and was confirmed by two officials with direct knowledge of the matter, both of whom asked not to be named because they were not authorised to speak publicly.`,
        "Early assessments suggest the immediate impact will be concentrated in a handful of states, though officials cautioned that a fuller picture will only emerge once the formal notification is issued later this week.",
        "Stakeholders reacted cautiously. Industry bodies welcomed the clarity but flagged the compressed timeline for compliance, while opposition representatives said the process had skipped consultation.",
        "A detailed review has been ordered and the findings are expected to be placed in the public domain within the month. Zero Tolerance India will continue to track the story as it develops.",
      ],
    keyPoints:
      seed.keyPoints ?? [
        "Development confirmed by two officials with direct knowledge",
        "Immediate impact concentrated in a handful of states",
        "Industry welcomes clarity but flags compliance timeline",
        "Formal notification expected later this week",
      ],
    tags: [category, "India", "Zero Tolerance", "Explained"],
    comments: BASE_COMMENTS,
    next,
  };
}
