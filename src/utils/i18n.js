import en from "../locales/en.js";
import ar from "../locales/ar.js";

const locales = { en, ar };

export function t(key, lang = "en") {
  return locales[lang]?.[key] || locales["en"][key] || key;
}
