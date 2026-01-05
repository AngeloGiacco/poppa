import { routing } from "@/i18n/routing";

import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://trypoppa.com";

const TOP_LANGUAGES = [
  "spanish",
  "french",
  "german",
  "italian",
  "japanese",
  "chinese",
  "korean",
  "portuguese",
  "arabic",
  "russian",
  "hindi",
  "dutch",
  "swedish",
  "greek",
  "turkish",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/pricing",
    "/how-it-works",
    "/founder-message",
    "/login",
    "/signup",
    "/compare",
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const page of staticPages) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "daily" : "weekly",
        priority: page === "" ? 1 : 0.8,
      });
    }

    for (const language of TOP_LANGUAGES) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}/learn/${language}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      });
    }
  }

  return sitemapEntries;
}
