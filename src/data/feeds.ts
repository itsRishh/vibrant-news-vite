import cricket from "@/assets/cricket.jpg";
import redcarpet from "@/assets/redcarpet.jpg";
import parliament from "@/assets/parliament.jpg";
import tech from "@/assets/tech.jpg";
import { slugify } from "./news";

export type FeedItem = {
  slug: string;
  title: string;
  subHead: string;
  image: string;
  time: string;
};

export type Feed = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  items: FeedItem[];
};

type RawItem = { title: string; dek: string; time: string };

function build(
  slug: string,
  name: string,
  tagline: string,
  description: string,
  image: string,
  raw: RawItem[],
): Feed {
  return {
    slug,
    name,
    tagline,
    description,
    items: raw.map((r) => ({ ...r, slug: slugify(r.title), image })),
  };
}

const FEEDS: Feed[] = [
  build(
    "politics",
    "Politics",
    "Parliament, parties and policy",
    "Live coverage of Parliament, state assemblies, party politics and the policy decisions shaping India.",
    parliament,
    [
      {
        title: "Monsoon Session: Key Bills to Watch This Week",
        dek: "Seven crucial bills, including the Digital India Act, head to the floor as the government pushes a compressed legislative calendar.",
        time: "18 min ago",
      },
      {
        title: "Opposition Bloc Finalises Seat-Sharing Formula for Three States",
        dek: "Talks that stretched past midnight ended with an agreement on 118 of 141 contested seats, leaders said.",
        time: "1 hour ago",
      },
      {
        title: "Cabinet Clears ₹1.2 Lakh Crore Urban Infrastructure Mission",
        dek: "Funds will flow to 200 cities over five years, with a third earmarked for water and sanitation networks.",
        time: "2 hours ago",
      },
      {
        title: "Election Commission Announces Poll Dates for Two States",
        dek: "Voting will be held in three phases, with counting scheduled for the first week of next month.",
        time: "4 hours ago",
      },
      {
        title: "Governor Returns State Land Bill for Reconsideration",
        dek: "The move sets up a fresh confrontation between the Raj Bhavan and the state government.",
        time: "6 hours ago",
      },
      {
        title: "Standing Committee Summons Officials Over Highway Delays",
        dek: "Members flagged cost escalation on 42 stalled stretches across six states.",
        time: "9 hours ago",
      },
    ],
  ),
  build(
    "sports",
    "Sports",
    "Cricket, football and everything in between",
    "Match reports, squad news, transfer buzz and analysis across cricket, football, athletics and more.",
    cricket,
    [
      {
        title: "India vs Australia: T20 Series Kicks Off Tonight",
        dek: "Jasprit Bumrah leads a full-strength pace attack as India open a five-match series at the Wankhede Stadium.",
        time: "25 min ago",
      },
      {
        title: "IPL 2026 Auction: Record ₹25 Crore Bid for Young Pacer",
        dek: "The 21-year-old becomes the most expensive uncapped player in the tournament's history.",
        time: "1 hour ago",
      },
      {
        title: "Indian Women's Team Seals Series With Clinical Chase",
        dek: "An unbeaten 88 anchored a seven-wicket win with 14 balls to spare in Guwahati.",
        time: "3 hours ago",
      },
      {
        title: "ISL: Bengaluru Edge Mumbai in Six-Goal Thriller",
        dek: "A stoppage-time header decided a match that swung three times in the second half.",
        time: "5 hours ago",
      },
      {
        title: "Neeraj Chopra Confirms Return for Diamond League Finale",
        dek: "The javelin star said his adductor niggle has fully settled after four weeks of rehab.",
        time: "8 hours ago",
      },
      {
        title: "Chess: Indian Teen Grabs Lead at Grand Swiss",
        dek: "Three straight wins with black have put the 17-year-old half a point clear of the field.",
        time: "11 hours ago",
      },
    ],
  ),
  build(
    "entertainment",
    "Entertainment",
    "Bollywood, streaming and the box office",
    "Film announcements, box office numbers, streaming releases and the business behind the screen.",
    redcarpet,
    [
      {
        title: "Shah Rukh Khan Announces New Production House",
        dek: "Red Chillies International launches with a ten-film slate built around co-productions and streaming-first releases.",
        time: "40 min ago",
      },
      {
        title: "Weekend Box Office: Thriller Crosses ₹100 Crore in Six Days",
        dek: "Strong single-screen numbers in the north drove the film past the mark ahead of projections.",
        time: "2 hours ago",
      },
      {
        title: "Streaming Platform Orders Second Season of Crime Drama",
        dek: "The renewal came within a fortnight of release, unusually fast for the platform.",
        time: "4 hours ago",
      },
      {
        title: "Filmfare Nominations Announced, Indie Titles Dominate",
        dek: "Two low-budget features picked up nine nominations between them.",
        time: "7 hours ago",
      },
      {
        title: "Music Label Signs Three Independent Artists in One Week",
        dek: "The deals point to a wider industry pivot toward non-film music catalogues.",
        time: "10 hours ago",
      },
      {
        title: "Period Epic Begins Shooting at Restored Palace Set",
        dek: "The production has taken over a 40-acre lot for a six-month schedule.",
        time: "13 hours ago",
      },
    ],
  ),
  build(
    "business",
    "Business",
    "Markets, companies and the economy",
    "Markets, earnings, policy and the numbers that move Indian business.",
    tech,
    [
      {
        title: "Sensex Hits Record High as Nifty Crosses 25,000",
        dek: "Banking and IT counters led a broad rally, with foreign inflows turning positive for the month.",
        time: "30 min ago",
      },
      {
        title: "RBI Holds Repo Rate Steady Despite Global Headwinds",
        dek: "The committee voted 4-2 to keep rates unchanged, citing a softer food inflation trajectory.",
        time: "2 hours ago",
      },
      {
        title: "Tata Motors Launches Cheapest EV at ₹7.99 Lakh",
        dek: "The compact hatchback claims a 315 km range and undercuts every rival in the segment.",
        time: "4 hours ago",
      },
      {
        title: "GST Collections Cross ₹1.9 Lakh Crore in July",
        dek: "Receipts rose 9% year-on-year, the fourth straight month of high single-digit growth.",
        time: "6 hours ago",
      },
      {
        title: "Two Startups Raise Combined $340 Million in Late-Stage Rounds",
        dek: "Both deals were led by sovereign funds, signalling renewed appetite for growth capital.",
        time: "9 hours ago",
      },
      {
        title: "Textile Exporters Flag Freight Costs Ahead of Festive Season",
        dek: "Container rates on western routes have nearly doubled since April, industry bodies said.",
        time: "12 hours ago",
      },
    ],
  ),
  build(
    "tech",
    "Tech",
    "Products, platforms and policy",
    "Launches, funding, AI, telecom and the regulation shaping India's technology sector.",
    tech,
    [
      {
        title: "Jio AirFiber 2.0 Launches in 500 Cities",
        dek: "Reliance Jio expands next-generation fixed wireless broadband to tier-2 towns with plans starting under ₹600 a month.",
        time: "15 min ago",
      },
      {
        title: "Homegrown AI Model Released Under Open Licence",
        dek: "The 12-billion parameter model was trained on eleven Indian languages and is free for commercial use.",
        time: "1 hour ago",
      },
      {
        title: "Data Protection Rules Enter Final Consultation Round",
        dek: "Industry has until the end of the month to file comments on breach-notification timelines.",
        time: "3 hours ago",
      },
      {
        title: "Semiconductor Fab Breaks Ground in Gujarat",
        dek: "First-phase output is targeted for late 2028, with an initial capacity of 50,000 wafers a month.",
        time: "5 hours ago",
      },
      {
        title: "UPI Adds Offline Payments for Feature Phones",
        dek: "The rollout extends low-value transfers to users without a stable data connection.",
        time: "8 hours ago",
      },
      {
        title: "Smartphone Shipments Grow 7% on Mid-Range Demand",
        dek: "Devices priced between ₹15,000 and ₹25,000 accounted for nearly half of all units sold.",
        time: "11 hours ago",
      },
    ],
  ),
  build(
    "world",
    "World",
    "Global news that matters to India",
    "Diplomacy, conflict, trade and global developments with an Indian lens.",
    parliament,
    [
      {
        title: "India and EU Conclude Eleventh Round of Trade Talks",
        dek: "Negotiators closed three chapters, with tariffs on automobiles still unresolved.",
        time: "35 min ago",
      },
      {
        title: "Oil Prices Slip as Supply Concerns Ease",
        dek: "Brent fell below $78 a barrel after producers signalled higher output next quarter.",
        time: "2 hours ago",
      },
      {
        title: "UN Assembly Debates Reform of Security Council Seats",
        dek: "India renewed its case for permanent representation during the opening session.",
        time: "5 hours ago",
      },
      {
        title: "Neighbouring Nations Sign Cross-Border Power Grid Pact",
        dek: "The agreement allows electricity trading across three countries from next year.",
        time: "7 hours ago",
      },
      {
        title: "Global Shipping Rerouting Adds Ten Days to Europe Runs",
        dek: "Exporters warn of delivery delays through the festive shipping window.",
        time: "10 hours ago",
      },
      {
        title: "Climate Summit Agenda Puts Adaptation Finance First",
        dek: "Developing economies are pressing for a firm annual funding floor.",
        time: "14 hours ago",
      },
    ],
  ),
];

export const FEED_LIST = FEEDS;

export function getFeed(slug: string): Feed | undefined {
  return FEEDS.find((f) => f.slug === slug);
}

export function findFeedItem(
  articleSlug: string,
): { feed: Feed; item: FeedItem } | undefined {
  for (const feed of FEEDS) {
    const item = feed.items.find((i) => i.slug === articleSlug);
    if (item) return { feed, item };
  }
  return undefined;
}
