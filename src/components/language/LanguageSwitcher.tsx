import { Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { LANGUAGES, useLanguage, type LanguageCode } from "@/i18n/LanguageProvider";

export function LanguageSwitcher() {
  const {
    language,
    setLanguage,
    navbarTargetRef,
    highlightNavbar,
    pickerOpen,
    setPickerOpen,
    showLanguagePrompt,
    promptPhase,
  } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pickerOpen) return;

    function onPointerDown(e: MouseEvent) {
      const target = e.target as Node;
      if (
        dropdownRef.current?.contains(target) ||
        navbarTargetRef.current?.contains(target)
      ) {
        return;
      }
      setPickerOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [pickerOpen, setPickerOpen, navbarTargetRef]);

  function pick(code: LanguageCode) {
    setLanguage(code);
    localStorage.setItem("zti-language-prompt-seen", "1");
    setPickerOpen(false);
  }

  const current = LANGUAGES.find((l) => l.code === language)!;

  return (
    <div ref={dropdownRef} className="relative">
      <button
        ref={navbarTargetRef}
        type="button"
        aria-label="Change language"
        aria-expanded={pickerOpen}
        onClick={() => (pickerOpen ? setPickerOpen(false) : showLanguagePrompt())}
        className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-semibold transition-all ${
          highlightNavbar
            ? "lang-navbar-highlight border-primary bg-primary/10 text-primary"
            : promptPhase === "open"
              ? "border-primary/60 bg-primary/5 text-primary ring-2 ring-primary/30"
              : "border-border text-foreground hover:border-primary hover:text-primary"
        }`}
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="uppercase">{current.code}</span>
      </button>

      {pickerOpen && (
        <div className="absolute top-full right-0 z-[60] mt-2 min-w-[160px] overflow-hidden rounded-lg border border-border bg-background shadow-lg">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => pick(lang.code)}
              className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-tint ${
                language === lang.code ? "bg-tint font-semibold text-primary" : ""
              }`}
            >
              <span>{lang.nativeLabel}</span>
              <span className="text-[10px] tracking-wider text-muted-foreground uppercase">
                {lang.code}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
