import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/news/Header";
import {
  HotRightNow,
  Regional,
  Sports,
  Bollywood,
  VideoNews,
  QuickReads,
  MoreNews,
} from "@/components/news/Sections";
import { Newsletter, Footer } from "@/components/news/Footer";
import { NewsClickArea } from "@/components/news/NewsClickArea";

const title = "Zero Tolerance India — Breaking News, Politics, Sports & Entertainment";
const description =
  "Live breaking news from India: politics, business, cricket, Bollywood, tech and regional headlines updated every minute by Zero Tolerance India.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <div className="mx-auto grid max-w-[1280px] gap-2 lg:grid-cols-[minmax(0,1fr)_340px]">
          <NewsClickArea>
            <HotRightNow />
            <Regional />
            <Sports />
            <Bollywood />
            <VideoNews />
            <QuickReads />
            <MoreNews />
          </NewsClickArea>
          <QuickNewsRail />
        </div>
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
