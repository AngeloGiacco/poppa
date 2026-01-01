import "./globals.css";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { routing } from "@/i18n/routing";

import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Poppa",
  description:
    "Poppa uses the socratic method to teach you any language, just through voice interactions",
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
          <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
