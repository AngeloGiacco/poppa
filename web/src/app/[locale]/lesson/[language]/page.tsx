import "./style.css";
import { Header } from "@/components/header";
import { RoomComponent } from "@/components/room-component";
import Heart from "@/assets/heart.svg";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { Link } from '@/i18n/routing';
import { languages } from "@/lib/supportedLanguages";
import { notFound } from "next/navigation";

// Add type for page props
interface LessonPageProps {
  params: {
    language: string;
  }
}

export default function LessonPage({ params }: LessonPageProps) {
  const language = languages.find(lang => lang.code.toLowerCase() === params.language.toLowerCase());
  
  if (!language) {
    notFound();
  }

  return (
    <div className="lesson-container">
      <header className="flex flex-shrink-0 h-12 items-center justify-between px-4 w-full md:mx-auto">
        <div className="flex items-center gap-3">
          <Image
            className="w-8 h-8 rounded-2xl shadow-lg"
            src="/logo.svg"
            alt="Poppa logo"
            width={32}
            height={32}
          />
          <span className="text-xl font-bold text-[#8B4513]">poppa</span>
        </div>
        <Link href="/dashboard" className="text-sm text-[#8B4513] hover:text-[#6D3611] hover:underline">
          Back to Dashboard
        </Link>
      </header>
      <main className="flex flex-col flex-grow overflow-hidden p-0 md:p-2 md:pt-0 w-full md:mx-auto">
        <Header language={language.name} />
        <RoomComponent />
      </main>
      <footer className="hidden md:flex md:items-center md:gap-2 md:justify-end font-mono uppercase text-right pt-1 pb-2 px-8 text-xs text-gray-600 w-full md:mx-auto">
        Built with
        <Heart />
        by
        <Link
          href="https://www.linkedin.com/in/angelogiacco"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Naxos Labs
        </Link>{" "}
        •
        <Link
          href="/github"
          target="_blank"
          rel="noopener noreferrer"
          className="underline inline-flex items-center gap-1"
        >
          <GitHubLogoIcon className="h-4 w-4" />
          View source on GitHub
        </Link>
        • © 2024 Poppa
      </footer>
    </div>
  );
}
