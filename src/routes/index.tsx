import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/news/Header";
import {
  PreAds,
  QuickLatest,
  BannerAd,
} from "@/components/news/Sections";

import BreakingTest from "@/components/segments/BreakingTest";
import LatestTest from "@/components/segments/LatestTest";
import LocalTest from "@/components/segments/LocalTest";
import IndiaTest from "@/components/segments/IndiaTest";
import RegionalTest from "@/components/segments/RegionalTest";
import VideoTest from "@/components/segments/VideoTest";
import { Newsletter, Footer } from "@/components/news/Footer";
import { NewsClickArea } from "@/components/news/NewsClickArea";
import { QuickNewsRail } from "@/components/news/QuickNewsRail";

const title = "Zero Tolerance India — Breaking News, Politics, Sports & Entertainment";
const description =
  "Live breaking news from India: politics, business, cricket, Bollywood, tech and regional headlines updated every minute by Zero Tolerance India.";
const shareImage = "https://www.dainikzti.com/link-share/thumbnail.png";
const shareUrl = "https://www.dainikzti.com/";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:image", content: shareImage },
      { property: "og:image:secure_url", content: shareImage },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: title },
      { property: "og:url", content: shareUrl },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: shareImage },
      { name: "twitter:image:alt", content: title },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <div className="mx-auto grid max-w-[1250px] grid-cols-1 gap-2 lg:grid-cols-[minmax(0,1fr)_300px]">
          <NewsClickArea>
            {/* <Live /> */}
            <PreAds />
            <div id="breaking">
              <BreakingTest />
            </div>

            <div id="latest" className="scroll-mt-32">
              <LatestTest />
            </div>

            <div className="scroll-mt-32">
              <QuickLatest />
            </div>

            <div id="local" className="scroll-mt-32">
              <LocalTest />
            </div>

            <BannerAd />

            <div id="regional" className="scroll-mt-32">
              <RegionalTest />
            </div>

            {/* <div id="state" className="scroll-mt-32">
              <StateNews />
            </div> */}

            <VideoTest />
            
            <div id="india" className="scroll-mt-32">
              <IndiaTest />
            </div>


            {/* <div id="international" className="scroll-mt-32">
              <International />
            </div> */}
            {/* <QuickReads /> */}
            {/* <Blogs /> */}
          </NewsClickArea>
          <div className="hidden lg:block">
            <QuickNewsRail />
          </div>
        </div>
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
