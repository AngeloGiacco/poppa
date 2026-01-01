import Image from "next/image";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export function InsufficientCredits() {
  const t = useTranslations("DashboardPage.credits.insufficient");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0] p-4">
      <div className="max-w-md text-center">
        <Image src="/logo.svg" alt="Logo" width={80} height={80} className="mx-auto mb-6" />
        <h1 className="mb-4 text-2xl font-bold text-[#8B4513]">{t("title")}</h1>
        <p className="mb-8 text-[#8B4513]/70">{t("description")}</p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="w-full border-[#8B4513]/20 text-[#8B4513] hover:bg-[#8B4513]/5 sm:w-auto"
            >
              {t("backToDashboard")}
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="w-full bg-[#8B4513] text-white hover:bg-[#6D3611] sm:w-auto">
              {t("buyCredits")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
