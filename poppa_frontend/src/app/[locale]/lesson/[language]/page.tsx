"use client"

import "./style.css";
import { Header } from "@/components/header";
import { Chat } from "@/components/Chat";
import Image from "next/image";
import { Link } from '@/i18n/routing';
import { learnable_languages } from "@/lib/supportedLanguages";
import { useTranslations } from 'next-intl';
import { useState, useEffect, use } from 'react';
import { useRouter } from '@/i18n/routing';
import { LoadingSpinner } from "@/components/Loading";
import { useSearchParams } from 'next/navigation';
import { useLesson } from '@/hooks/useLesson';
import { InsufficientCredits } from "@/components/lesson/InsufficientCredits";

interface LessonPageProps {
  params: Promise<{
    language: string;
  }>;
}

export default function LessonPage({ params }: LessonPageProps) {
  const t = useTranslations();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [instruction, setInstruction] = useState<string>('');
  const [isGeneratingLesson, setIsGeneratingLesson] = useState(true);
  const searchParams = useSearchParams();
  
  const unwrappedParams = use(params);
  
  const language = learnable_languages.find(
    lang => lang.code.toLowerCase() === unwrappedParams.language.toLowerCase()
  );

  const { isLoading: lessonLoading, hasInsufficientCredits } = useLesson();

  useEffect(() => {
    const generateLesson = async () => {
      if (!language) return;
      
      try {
        const customTopic = searchParams.get('topic');
        const response = await fetch('/api/generate-lesson', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            languageCode: language.code,
            nativeLanguage: 'English',
            customTopic
          }),
        });

        const data = await response.json();
        setInstruction(data.instruction);
      } catch (error) {
        console.error('Error generating lesson:', error);
      } finally {
        setIsGeneratingLesson(false);
      }
    };

    generateLesson();
    setIsLoading(false);
  }, [language, searchParams]);

  if (!language) {
    router.push('/dashboard');
    return null;
  }

  if (lessonLoading || isLoading) {
    return <LoadingSpinner />;
  }

  if (hasInsufficientCredits) {
    return <InsufficientCredits />;
  }

  if (isGeneratingLesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0]">
        <div className="animate-bounce">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={120}
            height={120}
            className="animate-pulse"
          />
        </div>
        <h2 className="mt-6 text-xl font-semibold text-[#8B4513]">
          {t('LessonPage.generatingLesson')}
        </h2>
      </div>
    );
  }

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
          <Chat
            lessonInstruction={instruction}
            targetLanguage={language.name}
            nativeLanguage="English"
          />
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
