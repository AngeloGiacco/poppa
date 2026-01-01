"use client";

import "./style.css";
import { useState, useEffect, use } from "react";

import Image from "next/image";
import { useSearchParams } from "next/navigation";

import { useTranslations } from "next-intl";

import { Chat } from "@/components/Chat";
import { Header } from "@/components/header";
import { InsufficientCredits } from "@/components/lesson/InsufficientCredits";
import { LoadingSpinner } from "@/components/Loading";
import { useLesson } from "@/hooks/useLesson";
import { Link, useRouter } from "@/i18n/routing";
import { learnable_languages } from "@/lib/supportedLanguages";

interface LessonPageProps {
  params: Promise<{
    language: string;
  }>;
}

export default function LessonPage({ params }: LessonPageProps) {
  const t = useTranslations();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [_instruction, setInstruction] = useState<string>("");
  const [isGeneratingLesson, setIsGeneratingLesson] = useState(true);
  const searchParams = useSearchParams();

  const unwrappedParams = use(params);

  const language = learnable_languages.find(
    (lang) => lang.code.toLowerCase() === unwrappedParams.language.toLowerCase()
  );

  const { isLoading: lessonLoading, hasInsufficientCredits } = useLesson();

  useEffect(() => {
    const generateLesson = async () => {
      if (!language) {
        return;
      }

      try {
        const customTopic = searchParams.get("topic");
        const response = await fetch("/api/generate-lesson", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            languageCode: language.code,
            nativeLanguage: "English",
            customTopic,
          }),
        });

        const data = await response.json();
        setInstruction(data.instruction);
      } catch (error) {
        console.error("Error generating lesson:", error);
      } finally {
        setIsGeneratingLesson(false);
      }
    };

    generateLesson();
    setIsLoading(false);
  }, [language, searchParams]);

  if (!language) {
    router.push("/dashboard");
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0]">
        <div className="animate-bounce">
          <Image src="/logo.svg" alt="Logo" width={120} height={120} className="animate-pulse" />
        </div>
        <h2 className="mt-6 text-xl font-semibold text-[#8B4513]">
          {t("LessonPage.generatingLesson")}
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0]">
      {/* Fixed Navigation Bar */}
      <nav className="fixed left-1/2 top-6 z-50 w-[90%] max-w-5xl -translate-x-1/2 transform">
        <div className="rounded-full bg-white/70 shadow-md">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              <Image
                className="h-10 w-10 rounded-full"
                src="/logo.svg"
                alt={t("LoginPage.logo.alt")}
                width={40}
                height={40}
              />
              <span className="text-xl font-semibold text-[#8B4513]">
                {t("HomePage.hero.brandName")}
              </span>
            </div>
            <Link
              href="/dashboard"
              className="rounded-full bg-[#8B4513] px-4 py-2 text-sm text-white transition-colors duration-300 hover:bg-[#6D3611]"
            >
              {t("LessonPage.backToDashboard")}
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
        <div className="overflow-hidden rounded-2xl bg-white/70 shadow-md backdrop-blur-sm">
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
        <div className="mx-auto max-w-7xl px-6 py-3">
          <div className="flex items-center justify-end gap-4 text-sm text-[#8B4513]/70">
            <Link
              href="https://www.linkedin.com/in/angelogiacco"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-300 hover:text-[#8B4513]"
            >
              {t("LessonPage.footer.builtWith")}
            </Link>
            <span>•</span>
            <Link
              href="/github"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 transition-colors duration-300 hover:text-[#8B4513]"
            >
              {t("LessonPage.footer.viewSource")}
            </Link>
            <span>•</span>
            <span>© 2024 Naxos Labs</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
