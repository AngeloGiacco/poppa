import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function InsufficientCredits() {
  const t = useTranslations('DashboardPage.credits.insufficient');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0] p-4">
      <div className="text-center max-w-md">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={80}
          height={80}
          className="mx-auto mb-6"
        />
        <h1 className="text-2xl font-bold text-[#8B4513] mb-4">
          {t('title')}
        </h1>
        <p className="text-[#8B4513]/70 mb-8">
          {t('description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-[#8B4513]/20 text-[#8B4513] hover:bg-[#8B4513]/5"
            >
              {t('backToDashboard')}
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              className="w-full sm:w-auto bg-[#8B4513] text-white hover:bg-[#6D3611]"
            >
              {t('buyCredits')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 