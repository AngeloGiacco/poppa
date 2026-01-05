export interface Language {
  code: string;
  name: string;
  native_name: string;
  iso639?: string;
  locale?: string;
}

export const interface_locales: Language[] = [
  { code: "US", name: "English", native_name: "English", locale: "en" },
  { code: "CN", name: "Chinese", native_name: "中文", locale: "zh" },
  { code: "ES", name: "Spanish", native_name: "Español", locale: "es" },
  { code: "IN", name: "Hindi", native_name: "हिन्दी", locale: "hi" },
  { code: "PT", name: "Portuguese (Portugal)", native_name: "Português (Portugal)", locale: "pt" },
  { code: "BR", name: "Portuguese (Brazil)", native_name: "Português (Brasil)", locale: "pt-br" },
  { code: "FR", name: "French", native_name: "Français", locale: "fr" },
  { code: "DE", name: "German", native_name: "Deutsch", locale: "de" },
  { code: "JP", name: "Japanese", native_name: "日本語", locale: "ja" },
  { code: "AE", name: "Arabic", native_name: "العربية", locale: "ar" },
  { code: "RU", name: "Russian", native_name: "Русский", locale: "ru" },
  { code: "KR", name: "Korean", native_name: "한국어", locale: "ko" },
  { code: "ID", name: "Indonesian", native_name: "Bahasa Indonesia", locale: "id" },
  { code: "IT", name: "Italian", native_name: "Italiano", locale: "it" },
  { code: "NL", name: "Dutch", native_name: "Nederlands", locale: "nl" },
  { code: "TR", name: "Turkish", native_name: "Türkçe", locale: "tr" },
  { code: "PL", name: "Polish", native_name: "Polski", locale: "pl" },
  { code: "SE", name: "Swedish", native_name: "Svenska", locale: "sv" },
];

export const learnable_languages: Language[] = [
  { code: "US", name: "English", native_name: "English", iso639: "eng" },
  { code: "CN", name: "Chinese", native_name: "中文", iso639: "zho" },
  { code: "ES", name: "Spanish", native_name: "Español", iso639: "spa" },
  { code: "IN", name: "Hindi", native_name: "हिन्दी", iso639: "hin" },
  { code: "PT", name: "Portuguese (Portugal)", native_name: "Português (Portugal)", iso639: "por" },
  {
    code: "BR",
    name: "Portuguese (Brazil)",
    native_name: "Português (Brasil)",
    iso639: "por-br",
  },
  { code: "FR", name: "French", native_name: "Français", iso639: "fra" },
  { code: "DE", name: "German", native_name: "Deutsch", iso639: "deu" },
  { code: "JP", name: "Japanese", native_name: "日本語", iso639: "jpn" },
  { code: "AE", name: "Arabic", native_name: "العربية", iso639: "ara" },
  { code: "RU", name: "Russian", native_name: "Русский", iso639: "rus" },
  { code: "KR", name: "Korean", native_name: "한국어", iso639: "kor" },
  { code: "ID", name: "Indonesian", native_name: "Bahasa Indonesia", iso639: "ind" },
  { code: "IT", name: "Italian", native_name: "Italiano", iso639: "ita" },
  { code: "NL", name: "Dutch", native_name: "Nederlands", iso639: "nld" },
  { code: "TR", name: "Turkish", native_name: "Türkçe", iso639: "tur" },
  { code: "PL", name: "Polish", native_name: "Polski", iso639: "pol" },
  { code: "SE", name: "Swedish", native_name: "Svenska", iso639: "swe" },
  { code: "MY", name: "Malay", native_name: "Bahasa Melayu", iso639: "msa" },
  { code: "RO", name: "Romanian", native_name: "Română", iso639: "ron" },
  { code: "UA", name: "Ukrainian", native_name: "Українська", iso639: "ukr" },
  { code: "GR", name: "Greek", native_name: "Ελληνικά", iso639: "ell" },
  { code: "CZ", name: "Czech", native_name: "Čeština", iso639: "ces" },
  { code: "DK", name: "Danish", native_name: "Dansk", iso639: "dan" },
  { code: "FI", name: "Finnish", native_name: "Suomi", iso639: "fin" },
  { code: "BG", name: "Bulgarian", native_name: "Български", iso639: "bul" },
  { code: "HR", name: "Croatian", native_name: "Hrvatski", iso639: "hrv" },
  { code: "SK", name: "Slovak", native_name: "Slovenčina", iso639: "slk" },
  { code: "IN", name: "Tamil", native_name: "தமிழ்", iso639: "tam" },
  { code: "HU", name: "Hungarian", native_name: "Magyar", iso639: "hun" },
  { code: "NO", name: "Norwegian", native_name: "Norsk", iso639: "nor" },
  { code: "VN", name: "Vietnamese", native_name: "Tiếng Việt", iso639: "vie" },
  { code: "PH", name: "Filipino", native_name: "Filipino", iso639: "fil" },
  { code: "TH", name: "Thai", native_name: "ไทย", iso639: "tha" },
  { code: "IL", name: "Hebrew", native_name: "עברית", iso639: "heb" },
  { code: "IR", name: "Persian", native_name: "فارسی", iso639: "fas" },
  { code: "KE", name: "Swahili", native_name: "Kiswahili", iso639: "swa" },
];

export const getLanguageByCode = (code: string): Language | undefined => {
  return learnable_languages.find((lang) => lang.code === code);
};

export const getLanguageByName = (name: string): Language | undefined => {
  return learnable_languages.find((lang) => lang.name === name);
};
