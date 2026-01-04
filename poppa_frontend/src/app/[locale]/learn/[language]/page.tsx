import { notFound } from "next/navigation";

import { LanguageLandingPage } from "@/components/marketing/LanguageLandingPage";
import { learnable_languages } from "@/lib/supportedLanguages";

import type { Metadata } from "next";

interface Props {
  params: Promise<{
    locale: string;
    language: string;
  }>;
}

const TOP_LANGUAGES = [
  "spanish",
  "french",
  "german",
  "italian",
  "japanese",
  "chinese",
  "korean",
  "portuguese",
  "arabic",
  "russian",
  "hindi",
  "dutch",
  "swedish",
  "greek",
  "turkish",
];

function getLanguageBySlug(slug: string) {
  return learnable_languages.find(
    (lang) => lang.name.toLowerCase() === slug.toLowerCase() || lang.iso639 === slug.toLowerCase()
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const language = getLanguageBySlug(resolvedParams.language);

  if (!language) {
    return {
      title: "Language Not Found - Poppa",
    };
  }

  const languageName = language.name;

  return {
    title: `Learn ${languageName} with AI Voice Lessons - Poppa`,
    description: `Master ${languageName} through real voice conversations with an AI tutor. The Thinking Method helps you discover ${languageName} naturally without memorization. Start speaking from day one.`,
    keywords: [
      `learn ${languageName}`,
      `${languageName} lessons`,
      `${languageName} tutor`,
      `AI ${languageName} teacher`,
      `speak ${languageName}`,
      `${languageName} conversation practice`,
      "language learning",
      "voice lessons",
    ],
    openGraph: {
      title: `Learn ${languageName} with AI Voice Lessons - Poppa`,
      description: `Start speaking ${languageName} from day one with Poppa's AI tutor using the Thinking Method.`,
      type: "website",
      siteName: "Poppa",
    },
    twitter: {
      card: "summary_large_image",
      title: `Learn ${languageName} with AI - Poppa`,
      description: `Master ${languageName} through voice conversations with an AI tutor.`,
    },
    alternates: {
      canonical: `https://trypoppa.com/learn/${resolvedParams.language}`,
    },
  };
}

export default async function LearnLanguagePage({ params }: Props) {
  const resolvedParams = await params;
  const language = getLanguageBySlug(resolvedParams.language);

  if (!language) {
    notFound();
  }

  return <LanguageLandingPage language={language} />;
}

export function generateStaticParams() {
  return TOP_LANGUAGES.map((language) => ({
    language,
  }));
}
