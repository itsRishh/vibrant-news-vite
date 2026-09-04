import { useQuery } from "convex/react";
import { Eye, Flame, Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import { api } from "../../../convex/_generated/api";
import { Badge } from "@/utils/Badge";
import vn1 from "@/assets/Videos/vnews/madam.mp4";
import vn2 from "@/assets/Videos/vnews/dharmendra.mp4";
import vn3 from "@/assets/Videos/wishes/WhatsApp Video 2026-08-15 at 00.23.44.mp4";
import s1 from "@/assets/Videos/shorts/hamla.mp4";
import s2 from "@/assets/Videos/shorts/paani.mp4";
import s3 from "@/assets/Videos/shorts/petrolchori.mp4";
import s4 from "@/assets/Videos/shorts/female.mp4";
import MediaThemeNotflix from 'player.style/notflix/react';

const fallbackFull = [vn1, vn2, vn3];
const fallbackShorts = [s1, s2, s3, s4];

type FallbackVideo = { title: string; views: string };

export default function VideoTest() {
    const { t } = useTranslation();
    const videos = useQuery(api.videos.list);
    const fullFallback = t("sections.video.full", { returnObjects: true }) as FallbackVideo[];
    const shortFallback = t("sections.video.shortItems", { returnObjects: true }) as FallbackVideo[];
    const fullVideos = videos?.filter((video) => video.kind === "full").sort((a, b) => (a.slot ?? 0) - (b.slot ?? 0));
    const shorts = videos?.filter((video) => video.kind === "short");

    return (
        <section className="lg:max-w-[1250px] max-w-[100vw] overflow-hidden px-4 pt-6 lg:px-0">
            <div className="mb-4 flex items-center justify-between">
                <div className="section-rule">
                    <h2 className="text-lg font-black tracking-tight uppercase">{t("sections.video.title")}</h2>
                </div>
                <span className="flex items-center gap-1 bg-primary px-2 py-0.5 text-[9px] font-bold text-primary-foreground uppercase">
                    <Flame className="h-3 w-3" /> {t("sections.live")}
                </span>
            </div>

            <p className="mb-3 text-[11px] font-bold tracking-wider text-primary uppercase">{t("sections.video.fullStories")}</p>
            <div className="grid gap-4 md:grid-cols-3">
                {(fullVideos?.length ? fullVideos : fullFallback.map((video, index) => ({ ...video, src: fallbackFull[index] }))).slice(0, 3).map((video, index) => {
                    const isUploaded = "imageUrl" in video;
                    const src = isUploaded ? video.imageUrl : video.src;
                    return (
                        <div key={isUploaded ? video._id : video.title} className="group">
                            <div className="relative h-48 overflow-hidden bg-ink">
                                <video slot="media" src={src ?? undefined} autoPlay controls playsInline crossOrigin="anonymous" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <span className="absolute top-2 left-2">
                                    <Badge>{isUploaded ? "VIDEO" : "LATEST"}</Badge>
                                </span>
                            </div>
                            <h3 className="mt-2 text-xs font-bold">{video.title}</h3>
                            <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">{"description" in video ? video.description : video.views}</p>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 mb-3 flex items-center justify-between">
                <h3 className="text-lg font-black tracking-tight uppercase">{t("SHORTS")}</h3>
            </div>
            <div className="flex w-full gap-4 overflow-x-auto pb-2">
                {(shorts?.length ? shorts : shortFallback.map((video, index) => ({ ...video, src: fallbackShorts[index] }))).map((video) => {
                    const isUploaded = "imageUrl" in video;
                    return (
                        <div key={isUploaded ? video._id : video.title} className="group w-38 shrink-0">
                            <div className="relative aspect-[9/16] overflow-hidden bg-ink">
                                <video src={isUploaded ? video.imageUrl ?? undefined : video.src} autoPlay controls playsInline className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <span className="absolute top-2 left-2"><Badge tone="ink">SHORT</Badge></span>
                            </div>
                            <h3 className="mt-2 line-clamp-2 text-[11px] font-bold">{video.title}</h3>
                            <p className="text-[10px] text-muted-foreground">{"description" in video ? video.description : video.views}</p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
