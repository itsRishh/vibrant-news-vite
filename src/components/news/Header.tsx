import { Search, Bell, Menu } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FaFacebook, FaInstagram } from "react-icons/fa";

import { LanguageSwitcher } from "@/components/language/LanguageSwitcher";

const MARKET_VALUES = [
  { key: "nifty", value: "25,102.40", change: "+0.62%", up: true },
  { key: "reliance", value: "₹2,912.05", change: "+1.18%", up: true },
  { key: "tcs", value: "₹3,860.90", change: "-0.34%", up: false },
  { key: "hdfc", value: "₹1,634.80", change: "+0.44%", up: true },
  { key: "infy", value: "₹1,466.10", change: "-0.12%", up: false },
] as const;

const NAV_KEYS = ["home", "politics", "sports", "entertainment", "business", "tech", "world"] as const;

export function Header() {
  const { t } = useTranslation();
  const ticker = t("header.ticker", { returnObjects: true }) as string[];

  return (
    <header className="sticky top-0 z-50 bg-background">
      <div className="bg-ink text-background">
        <div className="mx-auto grid max-w-[1200px] grid-cols-[auto_minmax(0,1fr)] items-center gap-3 px-4 py-1.5 text-[11px]">
          <span className="shrink-0 bg-primary px-2 py-0.5 font-bold tracking-wide uppercase">
            {t("header.breaking")}
          </span>
          <p className="min-w-0 truncate opacity-90">{t("header.breakingUpdate")}</p>
        </div>
      </div>

      <div className="border-b border-border">
        <div className="mx-auto grid max-w-[1200px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 lg:flex lg:justify-between">
          <a href="/" className="flex min-w-0 items-center gap-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center bg-primary text-sm font-black text-primary-foreground">
              ZT
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base leading-none font-black tracking-tight">
                ZERO TOLERANCE <span className="text-primary">INDIA</span>
              </span>
              <span className="mt-1 block text-[9px] text-justify text-muted-foreground uppercase">
                {t("meta.brandTagline")}
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-6 text-[13px] font-semibold lg:flex">
            {NAV_KEYS.map((key, i) => (
              <a
                key={key}
                href="#"
                className={`transition-colors hover:text-primary ${i === 1 ? "text-primary" : "text-foreground"}`}
              >
                {t(`header.nav.${key}`)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button className="grid h-8 w-8 place-items-center rounded-full border border-border">
              <FaInstagram className="h-4 w-4" />
            </button>
            <button className="grid h-8 w-8 place-items-center rounded-full border border-border">
              <FaFacebook className="h-4 w-4" />
            </button>
            <button className="hidden items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary sm:flex">
              <Search className="h-3.5 w-3.5" /> {t("header.search")}
            </button>
            <button className="relative grid h-8 w-8 place-items-center rounded-full border border-border text-foreground">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                3
              </span>
            </button>
            <button className="grid h-8 w-8 place-items-center rounded-full border border-border lg:hidden">
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden border-b border-border bg-secondary">
        <div className="mx-auto flex max-w-[1200px] px-4 items-center justify-center">
          <span className="shrink-0 bg-primary px-3 py-1.5 text-[10px] font-bold tracking-wider text-primary-foreground uppercase">
            {t("header.trending")}
          </span>
          <div className="min-w-0 overflow-hidden">
            <div className="ticker-track py-1.5">
              {[0, 1].map((dup) => (
                <span key={dup} className="flex">
                  {Array.isArray(ticker) &&
                    ticker.map((item) => (
                      <span key={`${dup}-${item}`} className="px-6 text-[11px] text-muted-foreground">
                        {item}
                      </span>
                    ))}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-border">
        <div className="mx-auto flex max-w-[1200px] gap-5 overflow-x-auto px-4 py-1.5 text-[11px]">
          {MARKET_VALUES.map((m) => (
            <div key={m.key} className="flex shrink-0 items-center gap-1.5">
              <span className="font-bold">{t(`header.markets.${m.key}`)}</span>
              <span className="text-muted-foreground">{m.value}</span>
              <span
                className={m.up ? "font-semibold text-success" : "font-semibold text-primary"}
              >
                {m.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
