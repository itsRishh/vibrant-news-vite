import { Play, Clock, Radio } from "lucide-react";
import { Badge } from "./Sections";
import cricket from "@/assets/cricket.jpg";
import redcarpet from "@/assets/redcarpet.jpg";
import parliament from "@/assets/images/mataji.jpeg";
import tech from "@/assets/tech.jpg";
import safarAd from "@/assets/images/safar-ad.jpeg";

const QUICK_NEWS = [
  { title: "Cabinet Clears New Semiconductor Policy Worth ₹76,000 Crore", tag: "Politics", time: "12 min ago", src: parliament },
  { title: "Bumrah Ruled Out of Second T20 With Minor Niggle", tag: "Sports", time: "38 min ago", src: cricket },
  { title: "Alia Bhatt's Next Locks Republic Day 2027 Release", tag: "Bollywood", time: "1h ago", src: redcarpet },
  { title: "Made-in-India Chips to Roll Out From Gujarat Fab", tag: "Tech", time: "2h ago", src: tech },
  { title: "Rupee Firms Up as Crude Slips Below $70 a Barrel", tag: "Business", time: "3h ago", src: parliament },
  { title: "Monsoon Advances Over Central India, IMD Issues Alert", tag: "Weather", time: "4h ago", src: cricket },
];

export function QuickNewsRail() {
  return (
    <aside className="w-full px-2 pt-7 lg:sticky lg:top-24 lg:self-start">
      {/* live video */}
      <div className="section-rule mb-3">
        <h2 className="flex items-center gap-2 text-lg font-black tracking-tight uppercase">
          Daily Darshan
          <span className="flex items-center gap-1 bg-primary px-2 py-0.5 text-[9px] font-bold text-primary-foreground uppercase">
            <Radio className="h-3 w-3" /> On Air
          </span>
        </h2>
      </div>

      <article className="group relative mb-6 overflow-hidden border border-border">
        <img
          src={parliament}
          alt="Zero Tolerance India live newsroom stream"
          loading="lazy"
          className="h-80 w-full object-cover opacity-100 transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink to-transparent p-3">
          <p className="text-xs font-bold text-background">
            त्रिकूट पर विराजी त्रिपुर सुंदरी माई शारदा के आज दिन गुरुवार के प्रातःकालीन दिव्य दर्शन।
          </p>
        </div>
      </article>

      <article className="group relative mb-6 overflow-hidden border border-border">
        <div className=" from-ink to-transparent p-3">
            <Badge>Ad</Badge>
        </div>
        <a href="https://play.google.com/store/apps/details?id=com.safartaxi.user" target="_blank" rel="noopener noreferrer">
          <img
            src={safarAd}
            alt="Zero Tolerance India live newsroom stream"
            loading="lazy"
            className="w-full object-cover opacity-100 transition-transform duration-500 group-hover:scale-105"
          /></a>
      </article>

      {/* quick news */}
      <div className="section-rule mb-3">
        <h2 className="text-lg font-black tracking-tight uppercase">Quick News</h2>
        <p className="mt-0.5 text-[11px] text-muted-foreground">Short updates, fast reads</p>
      </div>

      <ul className="divide-y divide-border border border-border">
        {QUICK_NEWS.map((n) => (
          <li key={n.title}>
            <article className="grid cursor-pointer grid-cols-[72px_minmax(0,1fr)] gap-3 p-3 transition-colors hover:bg-tint">
              <img
                src={n.src}
                alt={n.title}
                loading="lazy"
                className="h-14 w-[72px] object-cover"
              />
              <div className="min-w-0">
                <Badge tone="soft">{n.tag}</Badge>
                <h3 className="mt-1 text-[11px] leading-snug font-bold">{n.title}</h3>
                <span className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" /> {n.time}
                </span>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </aside>
  );
}
