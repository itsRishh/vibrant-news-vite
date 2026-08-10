export type LanguageCode = "en" | "hi";

export type Language = {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  dir: "ltr" | "rtl";
};

export const LANGUAGES: Language[] = [
  { code: "en", label: "English", nativeLabel: "English", dir: "ltr" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी", dir: "ltr" },
];

export const DEFAULT_LANGUAGE: LanguageCode = "en";
export const STORAGE_KEY = "zti-language";
export const PROMPT_SEEN_KEY = "zti-language-prompt-seen";

export function getLanguage(code: string): Language {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0]!;
}
