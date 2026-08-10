import { Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { LANGUAGES, useLanguage, type LanguageCode } from "@/i18n/LanguageProvider";

export function LanguagePrompt() {
  const { t } = useTranslation();
  const {
    promptPhase,
    closePromptWithSelection,
    finishPromptAnimation,
    navbarTargetRef,
    language,
  } = useLanguage();

  const [selected, setSelected] = useState<LanguageCode>(language);
  const [animStyle, setAnimStyle] = useState<React.CSSProperties>({});
  const cardRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (promptPhase === "open") {
      setSelected(language);
      setAnimStyle({});
    }
  }, [promptPhase, language]);

  useEffect(() => {
    if (promptPhase !== "closing") return;

    const card = cardRef.current;
    const target = navbarTargetRef.current;
    if (!card || !target) {
      finishPromptAnimation();
      return;
    }

    const cardRect = card.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const cardCx = cardRect.left + cardRect.width / 2;
    const cardCy = cardRect.top + cardRect.height / 2;
    const targetCx = targetRect.left + targetRect.width / 2;
    const targetCy = targetRect.top + targetRect.height / 2;

    const dx = targetCx - cardCx;
    const dy = targetCy - cardCy;
    const scale = Math.min(
      targetRect.width / cardRect.width,
      targetRect.height / cardRect.height,
      0.12,
    );

    requestAnimationFrame(() => {
      setAnimStyle({
        transform: `translate(${dx}px, ${dy}px) scale(${scale})`,
        opacity: 0,
        borderRadius: "9999px",
      });
      if (backdropRef.current) {
        backdropRef.current.style.opacity = "0";
      }
    });

    const timer = window.setTimeout(finishPromptAnimation, 720);
    return () => window.clearTimeout(timer);
  }, [promptPhase, finishPromptAnimation, navbarTargetRef]);

  if (promptPhase === "hidden" || promptPhase === "closed") return null;

  const isClosing = promptPhase === "closing";

  return (
    <div
      ref={backdropRef}
      className={`lang-prompt-backdrop fixed inset-0 z-[100] grid place-items-center bg-ink/60 px-4 backdrop-blur-[2px] ${
        isClosing ? "lang-prompt-backdrop-out" : ""
      }`}
      aria-hidden={isClosing}
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lang-prompt-title"
        style={animStyle}
        className={`lang-prompt-card w-full max-w-md overflow-hidden border border-border bg-background shadow-2xl ${
          isClosing ? "lang-prompt-card-flying" : ""
        }`}
      >
        <div className="border-b border-border bg-tint px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
              <Globe className="h-5 w-5" />
            </span>
            <div>
              <h2 id="lang-prompt-title" className="text-lg font-black tracking-tight">
                {t("language.promptTitle")}
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {t("language.promptSubtitle")}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2 p-6">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              disabled={isClosing}
              onClick={() => setSelected(lang.code)}
              className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition-all ${
                selected === lang.code
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:border-primary/50 hover:bg-tint"
              }`}
            >
              <span className="font-semibold">{lang.nativeLabel}</span>
              <span
                className={`grid h-5 w-5 place-items-center rounded-full border-2 ${
                  selected === lang.code
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/30"
                }`}
              >
                {selected === lang.code && (
                  <span className="h-2 w-2 rounded-full bg-primary-foreground" />
                )}
              </span>
            </button>
          ))}
        </div>

        <div className="border-t border-border px-6 py-4">
          <button
            type="button"
            disabled={isClosing}
            onClick={() => closePromptWithSelection(selected)}
            className="w-full bg-primary py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-70"
          >
            {t("language.continue")}
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[10px] text-muted-foreground">
            <Globe className="h-3 w-3 shrink-0 text-primary" />
            {t("language.promptHint")}
          </p>
        </div>
      </div>
    </div>
  );
}
