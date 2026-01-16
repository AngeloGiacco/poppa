"use client";

import {
  ArrowDownRight,
  BookOpen,
  Github,
  Globe,
  HelpCircle,
  MessageCircle,
  Mic,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";

interface QuickLink {
  icon: React.ComponentType<{ className?: string }>;
  labelKey: string;
  href: string;
  external?: boolean;
}

const leftLinks: QuickLink[] = [
  { icon: Mic, labelKey: "startLearning", href: "/signup" },
  { icon: Globe, labelKey: "allLanguages", href: "/signup" },
  { icon: BookOpen, labelKey: "howItWorks", href: "/how-it-works" },
];

const rightLinks: QuickLink[] = [
  {
    icon: Github,
    labelKey: "github",
    href: "https://github.com/AngeloGiacco/poppa",
    external: true,
  },
  { icon: HelpCircle, labelKey: "faq", href: "/how-it-works" },
  { icon: MessageCircle, labelKey: "contact", href: "mailto:hello@trypoppa.com", external: true },
];

export function QuickLinks() {
  const t = useTranslations("HomePage.quickLinks");

  return (
    <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-12">
      <div className="flex flex-col gap-3">
        {leftLinks.map((link) => (
          <QuickLinkItem key={link.labelKey} link={link} label={t(link.labelKey)} />
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {rightLinks.map((link) => (
          <QuickLinkItem key={link.labelKey} link={link} label={t(link.labelKey)} />
        ))}
      </div>
    </div>
  );
}

function QuickLinkItem({ link, label }: { link: QuickLink; label: string }) {
  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-2 text-sm text-olive-600 transition-colors duration-200 hover:text-olive-800"
      >
        <ArrowDownRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
        <span>{label}</span>
      </a>
    );
  }

  return (
    <Link
      href={link.href}
      className="group inline-flex items-center gap-2 text-sm text-olive-600 transition-colors duration-200 hover:text-olive-800"
    >
      <ArrowDownRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
      <span>{label}</span>
    </Link>
  );
}
