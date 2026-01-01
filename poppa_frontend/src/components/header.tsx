"use client";

import { useTranslations } from "next-intl";

interface HeaderProps {
  language?: string;
}

export function Header({ language = "Language" }: HeaderProps) {
  const t = useTranslations("common.header");

  return (
    <div className="flex flex-shrink-0 flex-col border-b border-[#8B4513]/10 bg-white/50 p-6 backdrop-blur-sm lg:flex-row">
      <div className="flex flex-col lg:flex-grow lg:flex-row lg:items-center lg:justify-between">
        <div className="mb-2 flex flex-col lg:mb-0">
          <div className="flex flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-[#8B4513]">
                {t("lessonTitle", { language })}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
