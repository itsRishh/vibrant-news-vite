import { Search, Bell, Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import { FaFacebook, FaInstagram } from "react-icons/fa";
import { Link } from "@tanstack/react-router";

import tiranga from "@/assets/images/tiranga.gif";

const NAV: { label: string; to: string; params?: { category: string } }[] = [
  { label: "Home", to: "/" },
  { label: "Latest", to: "/", params: { category: "politics" } },
  { label: "Breaking", to: "/", params: { category: "sports" } },
  { label: "Local", to: "/", params: { category: "sports" } },
  { label: "Regional", to: "/", params: { category: "entertainment" } },
  { label: "India", to: "/", params: { category: "business" } },
  { label: "International", to: "/", params: { category: "tech" } },
  { label: "Blog", to: "/", params: { category: "world" } },
  { label: "Contact Us", to: "/", params: { category: "world" } },
];

import { LanguageSwitcher } from "@/components/language/LanguageSwitcher";
import { QuickNewsRail } from "@/components/news/QuickNewsRail";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MARKET_VALUES = [
  { key: "nifty", value: "25,102.40", change: "+0.62%", up: true },
  { key: "reliance", value: "₹2,912.05", change: "+1.18%", up: true },
  { key: "tcs", value: "₹3,860.90", change: "-0.34%", up: false },
  { key: "hdfc", value: "₹1,634.80", change: "+0.44%", up: true },
  { key: "infy", value: "₹1,466.10", change: "-0.12%", up: false },
  { key: "nifty", value: "25,102.40", change: "+0.62%", up: true },
  { key: "reliance", value: "₹2,912.05", change: "+1.18%", up: true },
  { key: "tcs", value: "₹3,860.90", change: "-0.34%", up: false },
  { key: "hdfc", value: "₹1,634.80", change: "+0.44%", up: true },
  { key: "infy", value: "₹1,466.10", change: "-0.12%", up: false }
] as const;

const NAV_KEYS = ["home", "politics", "sports", "entertainment", "business", "tech", "world"] as const;

export function Header() {
  const { t } = useTranslation();
  const ticker = t("header.ticker", { returnObjects: true }) as string[];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background">
      <div className="border-b border-border">
        <div className="mx-auto grid max-w-[1250px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 lg:px-0 px-4 py-3 lg:flex lg:justify-between">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center font-black text-primary-foreground">
              {/* ZT */}
              <img src={tiranga} alt="" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base leading-none font-black tracking-tight">
                ZERO TOLERANCE <span className="text-primary">INDIA</span>
              </span>
              <span className="mt-1 block text-[9px] text-justify text-muted-foreground uppercase">
                {t("meta.brandTagline")}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-[13px] font-semibold lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                params={item.params as never}
                className="transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop - All Items Visible */}
          <div className="hidden lg:flex items-center gap-2">
            {/* <LanguageSwitcher /> */}
            <button className="grid h-8 w-8 place-items-center rounded-full border border-border hover:bg-secondary transition-colors">
              <a
                href="https://www.instagram.com/dainik.zti?igsh=MWpoeHAxaHMyd2t1cA==&igsi=MWpoeHAxaHMyd2t1cA=="
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex flex-1 items-center justify-center rounded border border-border transition-colors hover:bg-secondary"
              >
                <FaInstagram className="h-4 w-4" />
              </a>

            </button>
            <button className="grid h-8 w-8 place-items-center rounded-full border border-border hover:bg-secondary transition-colors">
              <a
                href="https://www.facebook.com/share/r/19DsEHUXcc/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex flex-1 items-center justify-center rounded border border-border transition-colors hover:bg-secondary"
              >
                <FaFacebook className="h-4 w-4" />
              </a>
            </button>
            <button className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary hover:bg-secondary">
              <Search className="h-3.5 w-3.5" /> {t("header.search")}
            </button>
            <button className="relative grid h-8 w-8 place-items-center rounded-full border border-border text-foreground hover:bg-secondary transition-colors">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                3
              </span>
            </button>
          </div>

          {/* Mobile - Right-side menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                className="flex lg:hidden h-8 w-8 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary"
              >
                <Menu className="h-4 w-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(92vw,400px)] overflow-y-auto px-5">
              <SheetHeader className="border-b border-border pb-4 pr-8 text-left">
                <SheetTitle className="text-base font-black uppercase">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-3 pt-4">
                  {/* Language Switcher */}
                  {/* <div className="pb-3 border-b border-border">
                    <LanguageSwitcher />
                  </div> */}

                  {/* Social Icons */}
                  <div className="flex gap-2 items-center justify-center">
                    <button className="w-full">
                      <a
                        href="https://www.instagram.com/dainik.zti?igsh=MWpoeHAxaHMyd2t1cA==&igsi=MWpoeHAxaHMyd2t1cA=="
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Instagram"
                        className="p-3 flex flex-1 items-center justify-center rounded border border-border transition-colors hover:bg-secondary"
                      >
                        <FaInstagram className="h-4 w-4" />
                      </a>
                    </button>
                    <button className="w-full">
                      <a
                        href="https://www.facebook.com/share/r/19DsEHUXcc/"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Facebook"
                        className="p-3 flex flex-1 items-center justify-center rounded border border-border transition-colors hover:bg-secondary"
                      >
                        <FaFacebook className="h-4 w-4" />
                      </a>
                    </button>
                  </div>

                  {/* Search Button */}
                  <button className="flex items-center justify-center gap-2 rounded border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary hover:bg-secondary w-full">
                    <Search className="h-3.5 w-3.5" /> {t("header.search")}
                  </button>

                  {/* Notification Bell */}
                  <button className="relative flex h-9 w-full items-center justify-center rounded border border-border text-foreground transition-colors hover:bg-secondary">
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-2 -right-2 grid h-4 w-4 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                      3
                    </span>
                  </button>
              </div>
              <div className="mt-5 border-t border-border pt-2">
                <QuickNewsRail />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="bg-ink text-background">
        <div className="mx-auto grid max-w-[1250px] grid-cols-[auto_minmax(0,1fr)] items-center gap-3 lg:px-0 px-4 py-1.5 text-[11px]">
          <span className="shrink-0 bg-primary px-2 py-0.5 font-bold tracking-wide uppercase">
            {t("header.breaking")}
          </span>
          <p className="min-w-0 lg:text-[16px] text-[8px] truncate opacity-90">
            {t("header.breakingUpdate")}
          </p>
        </div>
      </div>
      {/* <div className="overflow-hidden border-b border-border bg-secondary">
        <div className="mx-auto flex max-w-[1250px] lg:px-0 px-4 items-center justify-center">
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
      </div> */}

      {/* <div className="border-b border-border">
        <div className="mx-auto flex max-w-[1250px] lg:px-0 px-4 gap-5 overflow-x-auto py-1.5 text-[11px] scrollbar-none">
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
      </div> */}
    </header>
  );
}
