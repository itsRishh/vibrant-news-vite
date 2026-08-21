import { useTranslation } from "react-i18next";
import logo from "@/assets/logo/logo.png";

const SOCIALS = ["FB", "X", "IG", "YT", "IN"];

const COLUMN_KEYS = ["news", "sports", "entertainment", "business", "lifestyle"] as const;

export function Newsletter() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-[1300px] px-4 py-10">
      <div className="relative overflow-hidden bg-primary px-6 py-10 text-primary-foreground sm:px-10">
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, currentColor 0 2px, transparent 2px 12px)",
          }}
        />
        <div className="relative grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div className="min-w-0">
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              {t("footer.newsletterTitle")}
            </h2>
            <p className="mt-2 max-w-xl text-sm opacity-90">{t("footer.newsletterDesc")}</p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full gap-2 md:w-auto"
          >
            <input
              type="email"
              required
              placeholder={t("footer.emailPlaceholder")}
              className="min-w-0 flex-1 bg-background px-4 py-3 text-sm text-foreground outline-none md:w-64"
            />
            <button className="shrink-0 bg-ink px-5 py-3 text-sm font-bold text-background transition-opacity hover:opacity-90">
              {t("footer.subscribe")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border bg-secondary">
      <div className="mx-auto grid max-w-[1300px] gap-8 px-4 py-12 md:grid-cols-[1.4fr_repeat(5,1fr)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center bg-primary font-black text-primary-foreground">
              <img src={logo} alt="Logo" className="h-full w-full" />
            </span>
            <span className="text-sm leading-tight font-black">
              ZERO TOLERANCE
              <br />
              <span className="text-primary">INDIA</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-xs text-muted-foreground">{t("footer.description")}</p>
          <div className="mt-4 flex gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s}
                href="#"
                className="grid h-7 w-7 place-items-center bg-primary text-[10px] font-bold text-primary-foreground transition-colors hover:bg-primary-dark"
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {COLUMN_KEYS.map((key) => {
          const col = t(`footer.columns.${key}`, { returnObjects: true }) as {
            title: string;
            links: string[];
          };
          return (
            <div key={key}>
              <h3 className="text-[11px] font-bold tracking-wider text-primary uppercase">
                {col.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-xs text-muted-foreground transition-colors hover:text-primary"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="border-t border-border">
        <div className="mx-auto grid max-w-[1200px] gap-2 px-4 py-4 text-[11px] text-muted-foreground sm:grid-cols-2">
          <p>{t("footer.copyright")}</p>
          <p className="sm:text-right">
            <a href="#" className="hover:text-primary">
              {t("footer.privacy")}
            </a>
            <span className="px-2">·</span>
            <a href="#" className="hover:text-primary">
              {t("footer.terms")}
            </a>
            <span className="px-2">·</span>
            <a href="#" className="hover:text-primary">
              {t("footer.contact")}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
