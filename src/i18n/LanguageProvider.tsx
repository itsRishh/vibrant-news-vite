import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { useTranslation } from "react-i18next";

import "@/i18n";
import {
  DEFAULT_LANGUAGE,
  getLanguage,
  PROMPT_SEEN_KEY,
  STORAGE_KEY,
  type LanguageCode,
} from "./languages";

type PromptPhase = "hidden" | "open" | "closing" | "closed";

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  promptPhase: PromptPhase;
  showLanguagePrompt: () => void;
  closePromptWithSelection: (code: LanguageCode) => void;
  finishPromptAnimation: () => void;
  navbarTargetRef: RefObject<HTMLButtonElement | null>;
  highlightNavbar: boolean;
  pickerOpen: boolean;
  setPickerOpen: (open: boolean) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readStoredLanguage(): LanguageCode | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "en" || stored === "hi" ? stored : null;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const navbarTargetRef = useRef<HTMLButtonElement>(null);

  const [language, setLanguageState] = useState<LanguageCode>(
    () => readStoredLanguage() ?? DEFAULT_LANGUAGE,
  );
  const [promptPhase, setPromptPhase] = useState<PromptPhase>("hidden");
  const [highlightNavbar, setHighlightNavbar] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStoredLanguage();
    const seen = localStorage.getItem(PROMPT_SEEN_KEY) === "1";

    if (stored) {
      setLanguageState(stored);
      void i18n.changeLanguage(stored);
    }

    if (!seen) {
      setPromptPhase("open");
    } else {
      setPromptPhase("closed");
    }

    setHydrated(true);
  }, [i18n]);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.lang = language;
  }, [language, hydrated]);

  const setLanguage = useCallback(
    (code: LanguageCode) => {
      setLanguageState(code);
      localStorage.setItem(STORAGE_KEY, code);
      void i18n.changeLanguage(code);
      document.documentElement.lang = code;
    },
    [i18n],
  );

  const showLanguagePrompt = useCallback(() => {
    setPickerOpen(true);
  }, []);

  const closePromptWithSelection = useCallback(
    (code: LanguageCode) => {
      setLanguage(code);
      localStorage.setItem(PROMPT_SEEN_KEY, "1");
      setPromptPhase("closing");
    },
    [setLanguage],
  );

  const finishPromptAnimation = useCallback(() => {
    setPromptPhase("closed");
    setHighlightNavbar(true);
    window.setTimeout(() => setHighlightNavbar(false), 2200);
  }, []);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      promptPhase,
      showLanguagePrompt,
      closePromptWithSelection,
      finishPromptAnimation,
      navbarTargetRef,
      highlightNavbar,
      pickerOpen,
      setPickerOpen,
    }),
    [
      language,
      setLanguage,
      promptPhase,
      showLanguagePrompt,
      closePromptWithSelection,
      finishPromptAnimation,
      highlightNavbar,
      pickerOpen,
    ],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export function useCategoryLabel(category: string) {
  const { t } = useTranslation();
  return t(`categories.${category}`, { defaultValue: category });
}

export { getLanguage, LANGUAGES } from "./languages";
export type { LanguageCode };
