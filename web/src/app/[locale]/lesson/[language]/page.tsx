"use client"

import "./style.css";
import { Header } from "@/components/header";
import { RoomComponent } from "@/components/room-component";
import Image from "next/image";
import { Link } from '@/i18n/routing';
import { learnable_languages } from "@/lib/supportedLanguages";
import { useTranslations } from 'next-intl';
import { useState, useEffect, use } from 'react';
import { useRouter } from '@/i18n/routing';
import { LoadingSpinner } from "@/components/loading";
import { default_instruction } from '@/app/api/generate-lesson/route';
import { useSearchParams } from 'next/navigation';

interface LessonPageProps {
  params: Promise<{
    language: string;
  }>;
}

export default function LessonPage({ params }: LessonPageProps) {
  const t = useTranslations();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  
  const unwrappedParams = use(params);
  
  const language = learnable_languages.find(
    lang => lang.code.toLowerCase() === unwrappedParams.language.toLowerCase()
  );

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (!language || isLoading) {
    return <LoadingSpinner />;
  }

  const customTopic = searchParams.get('topic');

  const instruction = default_instruction + 
    `\n\nThe student is learning Swahili and speaks English. You should talk to them in English and introduce vocab and phrases in Swahili.` +
    (customTopic ? `\n\nThe student has requested to learn about: ${customTopic}` : '') +
    `\n\nThe student has previously learned:
    - Verbs start with ku- (like kulala - to sleep, kula - to eat, kucheka - to laugh, kutaka - to want)
    - Present tense formation with ni- (I) + na- (present) + verb stem
    - Examples: ninalala (I sleep), ninacheka (I laugh), ninataka (I want)
    - Word sasa (now)
    - Can combine verbs like ninataka kulala (I want to sleep)`;

  console.log('Instruction:', instruction);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0]">
      {/* Fixed Navigation Bar */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-5xl">
        <div className="bg-white/70 rounded-full shadow-md">
          <div className="flex justify-between items-center px-6 py-3">
            <div className="flex items-center gap-3">
              <Image
                className="w-10 h-10 rounded-full"
                src="/logo.svg"
                alt={t('LoginPage.logo.alt')}
                width={40}
                height={40}
              />
              <span className="text-xl font-semibold text-[#8B4513]">
                {t('HomePage.hero.brandName')}
              </span>
            </div>
            <Link 
              href="/dashboard"
              className="text-sm bg-[#8B4513] text-white px-4 py-2 rounded-full hover:bg-[#6D3611] transition-colors duration-300"
            >
              {t('LessonPage.backToDashboard')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 px-6 pb-24 max-w-7xl mx-auto">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-md overflow-hidden">
          <Header language={language.name} />
          <RoomComponent instruction={instruction} />
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-end gap-4 text-sm text-[#8B4513]/70">
            <Link
              href="https://www.linkedin.com/in/angelogiacco"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#8B4513] transition-colors duration-300"
            >
              {t('LessonPage.footer.builtWith')}
            </Link>
            <span>•</span>
            <Link
              href="/github"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-[#8B4513] transition-colors duration-300"
            >
              {t('LessonPage.footer.viewSource')}
            </Link>
            <span>•</span>
            <span>© 2024 Naxos Labs</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
