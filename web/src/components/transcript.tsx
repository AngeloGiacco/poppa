import { cn } from "@/lib/utils";
import { useAgent } from "@/hooks/use-agent";
import { useEffect, useRef, RefObject, useState, useCallback } from "react";
import { useTranslations } from "next-intl";

export function Transcript({
  scrollContainerRef,
  scrollButtonRef,
}: {
  scrollContainerRef: RefObject<HTMLElement>;
  scrollButtonRef: RefObject<HTMLButtonElement>;
}) {
  const { displayTranscriptions } = useAgent();
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const calculateDistanceFromBottom = useCallback((container: HTMLElement) => {
    const { scrollHeight, scrollTop, clientHeight } = container;
    return scrollHeight - scrollTop - clientHeight;
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const scrollButton = scrollButtonRef.current;
    if (container && scrollButton) {
      const handleScrollVisibility = (
        container: HTMLElement,
        scrollButton: HTMLButtonElement,
      ) => {
        const distanceFromBottom = calculateDistanceFromBottom(container);
        const shouldShowButton = distanceFromBottom > 100;
        setShowScrollButton(shouldShowButton);
        scrollButton.style.display = shouldShowButton ? "flex" : "none";
      };

      const handleScroll = () => handleScrollVisibility(container, scrollButton);

      handleScroll(); // Check initial state
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [scrollContainerRef, scrollButtonRef, displayTranscriptions, calculateDistanceFromBottom]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const distanceFromBottom = calculateDistanceFromBottom(container);
      const isNearBottom = distanceFromBottom < 100;

      if (isNearBottom) {
        transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [displayTranscriptions, scrollContainerRef, transcriptEndRef, calculateDistanceFromBottom]);

  const scrollToBottom = () => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const scrollButton = scrollButtonRef.current;
    if (scrollButton) {
      scrollButton.addEventListener("click", scrollToBottom);
      return () => scrollButton.removeEventListener("click", scrollToBottom);
    }
  }, [scrollButtonRef]);

  const t = useTranslations("Chat.Transcript");

  return (
    <>
      <div className="sticky top-0 z-10 left-0 right-0 bg-[#FFF8E1]/50 backdrop-blur-sm w-full p-4 text-[#8B4513] border-b border-[#8B4513]/10">
        <div className="text-xs font-semibold uppercase tracking-widest">
          {t("title")}
        </div>
      </div>
      <div className="p-4 relative">
        {displayTranscriptions.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-[#5D4037]/60 text-sm">
            {t("emptyState")}
          </div>
        ) : (
          <div className="space-y-4">
            {displayTranscriptions.map(
              ({ segment, participant, publication }) =>
                segment.text.trim() !== "" && (
                  <div
                    key={segment.id}
                    className={cn(
                      "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                      participant?.isAgent
                        ? "bg-[#8B4513]/10 text-[#5D4037] backdrop-blur-sm"
                        : "ml-auto bg-white/80 border border-[#8B4513]/20 text-[#5D4037] shadow-sm",
                    )}
                  >
                    {participant?.isAgent ? (
                      segment.text.trim()
                    ) : (
                      <>👤</>
                    )}
                  </div>
                ),
            )}
            <div ref={transcriptEndRef} />
          </div>
        )}
      </div>
    </>
  );
}
