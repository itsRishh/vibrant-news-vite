import raid from "@/assets/images/raid.jpeg";
import tirangapaint from "@/assets/images/tirangapaint.jpeg";
import mohanpooja from "@/assets/images/mohanpooja.jpg";
import mohanflag from "@/assets/images/mohanflag.jpeg";

import ThumbVideo from "@/utils/ThumbVideo";
import { useTranslation } from "react-i18next";
import { SectionHead } from "@/utils/SectionHead";
import { Badge } from "@/utils/Badge";
import { Thumb } from "@/utils/Thumb";
import { Stamp } from "@/utils/Stamp";
import stall from "@/assets/images/stall.jpeg";
import pandey from "@/assets/videos/shorts/pandey.mp4";

type CardItem = {
  city?: string;
  category?: string;
  badge?: string;
  tag?: string;
  title: string;
  subHead?: string;
  time?: string;
};

export default function BreakingTest() {
  const { t } = useTranslation();
  const cards = t("sections.breaking.cards", { returnObjects: true }) as CardItem[];
  const cardImages = [raid, mohanpooja, tirangapaint, mohanflag];
  return (
    <section className="lg:max-w-[1250px] max-w-[100vw] sm:px-4 px-4 lg:px-0 pt-6">
      <SectionHead
        title={t("sections.wishes.title Test")}
      />

      <div className="flex w-full grid gap-4 lg:grid-cols-[1fr_1fr_1fr_1fr]">
        <article className="group relative w-full overflow-hidden lg:col-span-2 bg-ink lg:h-full h-80">
          <Thumb src={t("sections.breaking.hero.src")} alt={t("ZTI-NEWS")} className="absolute top-0 left-0 w-full sm:h-80 lg:h-80 object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink via-ink/40 to-transparent p-5">
            <Badge>{t("sections.breaking.hero.category")}</Badge>
            <h3 className="mt-2 text-sm font-black text-background sm:text-2xl">
              {t("sections.breaking.hero.title")}
            </h3>
            <p className="mt-1 text-[11px] text-background/70">{t("sections.breaking.hero.subHead")}</p>
          </div>
        </article>

        <article className="group relative w-full overflow-hidden bg-ink lg:col-span-2">
          <ThumbVideo src={pandey} alt={t("ZTI-NEWS")} className="h-70 w-full sm:h-80 lg:h-100" />
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink via-ink/40 to-transparent p-5">
            <h3 className="mt-2 text-sm font-black text-background sm:text-2xl">
              {t("sections.breaking.hero.title")}
            </h3>
            <Badge>{t("sections.breaking.hero.category")}</Badge>
          </div>
        </article>

        {cards.slice(0, 4).map((c, i) => (
        <article key={c.title} className="group overflow-hidden border border-border">
            <div className="relative lg:h-24 h-48 overflow-hidden">
              <Thumb
                src={cardImages[i] ?? ""}
                alt={c.title}
                className="h-32 transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-2 left-2">
                <Badge>{c.category}</Badge>
              </span>
              {c.badge && (
                <span className="absolute top-2 right-2 bg-ink px-2 py-0.5 text-[9px] font-bold text-background">
                  {c.badge}
                </span>
              )}
            </div>
            <div className="p-3">
              <h3 className="text-sm font-bold">{c.title}</h3>
              <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{c.subHead}</p>
              <div className="mt-2">
                <Stamp time={c.time ?? ""} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
