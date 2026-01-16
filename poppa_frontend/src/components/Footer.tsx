"use client";

import { Github, Heart, Twitter } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const t = useTranslations("common");
  const year = new Date().getFullYear();

  return (
    <footer className={`border-t border-cream-200 bg-cream-50/80 ${className}`}>
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-olive-500">
            <Link href="/pricing" className="transition-colors duration-200 hover:text-olive-700">
              {t("footer.pricing")}
            </Link>
            <Link
              href="/how-it-works"
              className="transition-colors duration-200 hover:text-olive-700"
            >
              {t("footer.howItWorks")}
            </Link>
            <a
              href="https://github.com/AngeloGiacco/poppa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-olive-700"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
            <a
              href="https://twitter.com/trypoppa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-olive-700"
            >
              <Twitter className="h-4 w-4" />
              <span>Twitter</span>
            </a>
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-1.5 text-sm text-olive-500">
            <span>{t("footer.copyright", { year })}</span>
            <Heart className="h-3.5 w-3.5 text-warm-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
