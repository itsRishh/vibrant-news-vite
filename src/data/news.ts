import cricket from "@/assets/cricket.jpg";
import redcarpet from "@/assets/redcarpet.jpg";
import parliament from "@/assets/parliament.jpg";
import tech from "@/assets/tech.jpg";
import { findFeedItem } from "./feeds";

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

const BASE_COMMENTS: Comment[] = [
  {
    name: "Ananya Sharma",
    initials: "AS",
    time: "22 min ago",
    text: "Finally some reporting that explains the context instead of just the headline. Would love a follow-up on how this plays out over the next quarter.",
    likes: 128,
  },
  {
    name: "Rohit Verma",
    initials: "RV",
    time: "1 hour ago",
    text: "Good coverage, but the numbers quoted here differ slightly from the official release. Can the desk clarify the source?",
    likes: 64,
  },
  {
    name: "Meera Nair",
    initials: "MN",
    time: "2 hours ago",
    text: "This will directly affect small businesses in tier-2 cities. Hope the ground impact is tracked properly.",
    likes: 41,
  },
  {
    name: "Imran Qureshi",
    initials: "IQ",
    time: "3 hours ago",
    text: "Sharing this with my team. Balanced piece with actual data — rare these days.",
    likes: 27,
  },
];

const CURATED: Record<string, Partial<Article>> = {
  "monsoon-session-key-bills-to-watch-this-week": {
    category: "Politics",
    image: parliament,
    dek: "Seven crucial bills, including the Digital India Act and the Data Protection Amendment, head to the floor as the government pushes for a compressed legislative calendar.",
    body: [
      "Parliament's monsoon session opened on Monday with the government listing seven bills for consideration and passage, setting up what floor managers on both sides expect to be the most contested three weeks of the year.",
      "At the centre of the agenda is the Digital India Act, a long-pending replacement for the two-decade-old IT framework. Officials familiar with the draft say it introduces a tiered compliance regime for platforms based on user base, along with a statutory grievance appellate body.",
      "The Data Protection Amendment Bill, tabled alongside it, narrows several government exemptions that industry bodies had flagged during consultations. A senior official said the changes were made after \"extensive feedback from both civil society and industry\", though the exemption for national security purposes remains intact.",
      "Opposition floor leaders have demanded a full day of debate on inflation before any legislative business is taken up, and have signalled they will push for the digital bills to be referred to a select committee rather than passed in the current session.",
      "The infrastructure bill, which restructures how central funds flow to state road and rail projects, is the least contested of the seven and is expected to clear both houses without division.",
    ],
    keyPoints: [
      "Seven bills listed for consideration and passage this session",
      "Digital India Act introduces tiered compliance based on platform size",
      "Data Protection Amendment narrows several government exemptions",
      "Opposition wants digital bills sent to a select committee",
    ],
  },
  "india-vs-australia-t20-series-kicks-off-tonight": {
    category: "Sports",
    image: cricket,
    dek: "Jasprit Bumrah leads a full-strength pace attack as India open a five-match series at the Wankhede Stadium under lights.",
    body: [
      "India begin their five-match T20 series against Australia at the Wankhede Stadium tonight, with the hosts naming an unchanged pace battery led by Jasprit Bumrah.",
      "The team management has signalled a clear plan: attack with the new ball in the first six overs and hold back a spinner for the middle phase, a template that worked in the last home series.",
      "Australia arrive without two frontline batters, both rested ahead of a longer red-ball tour, and will hand a debut to their 21-year-old left-arm quick in the opening fixture.",
      "Conditions are expected to favour the chasing side, with dew forecast after the 15th over. Both captains have said they would bowl first if they win the toss.",
    ],
    keyPoints: [
      "Five-match series opens at Wankhede Stadium, 7:30 PM IST",
      "Bumrah leads an unchanged Indian pace attack",
      "Australia rest two frontline batters, hand out one debut",
      "Dew expected to favour the side chasing",
    ],
  },
  "shah-rukh-khan-announces-new-production-house": {
    category: "Bollywood",
    image: redcarpet,
    dek: "Red Chillies International launches with a ten-film slate built around international co-productions and streaming-first releases.",
    body: [
      "Shah Rukh Khan announced a new production banner on Tuesday, positioning it as an international arm of his existing studio with a slate of ten films over four years.",
      "Three of the ten titles are co-productions with overseas studios, and at least two are planned as streaming-first releases, a shift from the banner's theatrical-only history.",
      "Industry executives read the move as a response to the widening gap between theatrical footfalls and streaming spend, which has pushed several large Indian studios toward hybrid release calendars.",
      "The first film under the banner goes on floors early next year, with casting announcements expected within the month.",
    ],
    keyPoints: [
      "Ten-film slate planned across four years",
      "Three titles are international co-productions",
      "Two films planned as streaming-first releases",
      "First production begins shooting early next year",
    ],
  },
  "jio-airfiber-2-0-launches-in-500-cities": {
    category: "Tech",
    image: tech,
    dek: "Reliance Jio expands next-generation fixed wireless broadband to tier-2 towns with plans starting under ₹600 a month.",
    body: [
      "Reliance Jio has extended its AirFiber service to 500 cities, taking fixed wireless broadband to a set of tier-2 and tier-3 towns where laying fibre has been slow and expensive.",
      "The company says peak speeds reach 1Gbps on the highest tier, though typical delivered speeds in early rollout markets have been in the 200-300Mbps range.",
      "Entry plans start below ₹600 a month bundled with streaming subscriptions, undercutting incumbent wired providers in most of the new markets.",
      "Analysts expect the expansion to add meaningful subscriber numbers over the next two quarters, with the bigger question being how quickly rivals respond on price.",
    ],
    keyPoints: [
      "Service live in 500 cities, mostly tier-2 and tier-3",
      "Peak speeds up to 1Gbps on the top tier",
      "Entry plans start under ₹600 a month",
      "Pressure builds on incumbent wired broadband pricing",
    ],
  },
};

const ORDER = Object.keys(CURATED);

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
  const image = seed.image ?? IMAGES[idx % IMAGES.length]!;
  const category = seed.category ?? "India";

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
    dek:
      seed.dek ??
      `Our reporters break down what happened, who it affects and what to expect next in this developing ${category.toLowerCase()} story.`,
    author: "Zero Tolerance Desk",
    location: "New Delhi",
    published: "Aug 5, 2026, 11:42 IST",
    readTime: "4 min read",
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
