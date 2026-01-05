import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import en from "./locales/en.json";

const resources = {
  en: { translation: en },
};

const getDeviceLanguage = (): string => {
  try {
    const locale = Localization.getLocales()[0];
    if (locale?.languageCode) {
      return locale.languageCode;
    }
  } catch {
    // Fallback to English
  }
  return "en";
};

void i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
