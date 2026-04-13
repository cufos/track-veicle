import { I18n } from "i18n-js";
import * as Localization from "expo-localization";

const i18n = new I18n();

async function loadLocale(locale: "es" | "en" | "it") {
  let messages;

  switch (locale) {
    case "es":
      messages = await import("./locales/es");
      break;
    case "en":
      messages = await import("./locales/en");
      break;
    case "it":
      messages = await import("./locales/it");
      break;
    default:
      messages = await import("./locales/es");
  }

  i18n.translations = {
    ...i18n.translations,
    [locale]: messages.default,
  };

  i18n.locale = locale;
}

i18n.enableFallback = true;
i18n.defaultLocale = "es";
const deviceLocale =
  (Localization.getLocales()[0]?.languageCode as "es" | "en" | "it") ?? "es";

loadLocale(deviceLocale);

export { loadLocale };
export default i18n;
