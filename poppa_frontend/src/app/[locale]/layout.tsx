import "./globals.css";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import { AnalyticsProvider } from "@/components/providers/AnalyticsProvider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { routing } from "@/i18n/routing";

import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Poppa - Learn Languages Naturally with AI Voice Tutoring",
  description:
    "Poppa uses the Socratic method to teach you any of 50+ languages through natural voice conversations. Start learning for free with your personal AI language tutor.",
  keywords: [
    "language learning",
    "AI tutor",
    "voice learning",
    "Socratic method",
    "learn Spanish",
    "learn French",
    "learn German",
    "language transfer",
  ],
  authors: [{ name: "Naxos Labs" }],
  creator: "Naxos Labs",
  publisher: "Poppa",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://trypoppa.com",
    siteName: "Poppa",
    title: "Poppa - Learn Languages Naturally with AI Voice Tutoring",
    description:
      "Learn 50+ languages through natural voice conversations with your personal AI tutor using the Socratic method. Start free today.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Poppa - AI Language Tutor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Poppa - Learn Languages Naturally with AI Voice Tutoring",
    description:
      "Learn 50+ languages through natural voice conversations with your personal AI tutor.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <AuthProvider>
          <AnalyticsProvider>
            <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
          </AnalyticsProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
