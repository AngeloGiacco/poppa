"use client";

interface HeaderProps {
  language?: string;
}

export function Header({ language = "Language" }: HeaderProps) {
  return (
    <div className="flex flex-shrink-0 flex-col lg:flex-row p-6 bg-white/50 backdrop-blur-sm border-b border-[#8B4513]/10">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:flex-grow">
        <div className="flex flex-col mb-2 lg:mb-0">
          <div className="flex flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-[#8B4513]">{language} lesson</h2>
              <p className="text-[#5D4037]/80 text-lg">
                Try learning a language from your browser
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
