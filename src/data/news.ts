import cricket from "@/assets/images/rewa.jpg";
import redcarpet from "@/assets/images/agniverma.jpg";
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
      "मां शारदा और मां सरस्वती की इस पावन धरती मैहर ने भारतीय शास्त्रीय संगीत को वह नगीना दिया, जिसने हथियार की नली से भी सुर निकाल दिखाया। ",
      "उस्ताद अलाउद्दीन खान, जिन्हें संगीत जगत में 'बाबा' के नाम से जाना जाता है, का जन्म 1881 में हुआ था और उन्होंने अपना संपूर्ण जीवन मैहर में गीत-संगीत को समर्पित कर दिया, ऐसा बताया जाता है। ",
      "मैहर घराने और मैहर संगीत शैली के पुनरोत्थान का श्रेय उन्हीं को दिया जाता है।",
      "बाबा अलाउद्दीन खान दरबारी संगीतकार होने के बावजूद आमजनों तक संगीत पहुंचाने के लिए हमेशा प्रयासरत रहते थे। उन्होंने सितार और सरोद के मेल से बैंजो सितार और बंदूक की नलियों से नाल तरंग जैसे मौलिक वाद्ययंत्रों का आविष्कार किया।", 
      "कैसे बनी नाल तरंग, कैसे शुरू हुआ मैहर बैंड",
      "जानकारी के अनुसार, मैहर के तत्कालीन महाराजा बृजनाथ सिंह विदेश दौरे पर एक भोज के दौरान विदेशी ब्रास बैंड से प्रभावित हुए थे। इसी प्रेरणा से बाबा अलाउद्दीन खान ने महाराजा की इच्छा पर एक स्ट्रिंग बैंड तैयार किया। बाबा ने महाराज से लगभग 50 बंदूकें मांगी और अपने बंगले पर ले जाकर नाल तरंग का निर्माण किया, ऐसा बताया गया है। लगभग 1921 में नाल तरंग को मैहर बैंड में शामिल किया गया, और मैहर राजा ने बाबा को 'संगीत नायक' की उपाधि से सम्मानित किया।",
      "बाबा ने इस वाद्य को लेकर एक बेहद मार्मिक बात कही थी — 'अब इन नालों से गोली नहीं, सुर निकलेंगे।' यही संदेश आज भी इस बात का प्रतीक है कि खतरनाक हथियार भी सृजन का माध्यम बन सकता है, विनाश का नहीं।",
      "कुछ रिपोर्टों में यह भी बताया गया है कि 1930 के दशक में महामारी पीड़ितों की सहायता के लिए भी मैहर बैंड की स्थापना का उल्लेख मिलता है, हालांकि मूल कहानी महाराजा बृजनाथ सिंह की प्रेरणा से जुड़ी बताई जाती है।",
      "दुनिया भर में मशहूर हुआ मैहर वाद्यवृंद90 साल से ज्यादा पुराना यह मैहर बैंड आज 'वाद्य-वृंद' के नाम से जाना जाता है, जिसमें हारमोनियम, वायलिन, सितार, तबला, नाल तरंग और इसराज जैसे वाद्ययंत्र शामिल हैं। सन 1962 में पचमढ़ी में बाबा के कार्यक्रम से तत्कालीन प्रधानमंत्री इंदिरा गांधी बेहद प्रभावित हुई थीं और उन्होंने कलाकारों से मिलकर नाल तरंग की जानकारी ली थी। 1964 में प्रसिद्ध अभिनेता पृथ्वीराज कपूर भी मुंबई से मैहर पहुंचे थे, ऐसा बताया जाता है।",
      "उस्ताद अलाउद्दीन खान की शिष्य परंपरा — दुनिया को दिए कई दिग्गज",
      "मैहर घराना आज दुनिया भर में इसलिए भी जाना जाता है क्योंकि बाबा अलाउद्दीन खान के शिष्यों और वारिसों ने भारतीय शास्त्रीय संगीत को अंतरराष्ट्रीय पहचान दिलाई। इनमें उनके बेटे सरोद वादक अली अकबर खान, उनकी बेटी अन्नपूर्णा देवी, और उनके परम शिष्य विश्वविख्यात सितार वादक पंडित रविशंकर प्रमुख हैं। इसके अलावा निखिल बनर्जी, वसंत राय, पन्नालाल घोष, बहादुर खान, शरन रानी जैसे कई महान संगीतज्ञ भी उन्हीं की शिष्य परंपरा से निकले, ऐसा बताया जाता है।",
      
      "नाल तरंग की आज की विरासत — ज्योति चौधरी और नई पीढ़ी"

,
      ],
    keyPoints:
      seed.keyPoints ?? [
        "बंदूक की नली से निकले सुर",
        "1921 से चली मैहर बैंड की परंपरा",
        "नाल तरंग की विरासत आज भी जारी, ज्योति चौधरी और सौरभ चौरसिया जैसे कलाकार",
        "परंपरा के सामने नई चुनौती, 106 साल पुरानी विरासत के कमजोर पड़ने की चिंता",
      ],
    tags: [category, "India", "Zero Tolerance", "Explained"],
    comments: BASE_COMMENTS,
    next,
  };
}
