import { routing } from "@/i18n/routing";

import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://trypoppa.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/pricing", "/how-it-works", "/founder-message", "/login", "/signup"];

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
  }

  return sitemapEntries;
}
