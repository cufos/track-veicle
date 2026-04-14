import { I18n } from "i18n-js";
import es from "./locales/es";
import en from "./locales/en";
import it from "./locales/it";

const i18n = new I18n({
  es,
  en,
  it,
});

i18n.enableFallback = true;
i18n.defaultLocale = "es";
i18n.locale = "es";

function loadLocale(locale: "es" | "en" | "it") {
  i18n.locale = locale;
}

export { loadLocale };
export default i18n;
