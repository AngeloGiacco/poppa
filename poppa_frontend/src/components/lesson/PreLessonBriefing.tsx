"use client";

import { useState, useEffect } from "react";

import { Mic, MessageCircle, Lightbulb, ArrowRight, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { supabaseBrowserClient } from "@/lib/supabase-browser";

interface PreLessonBriefingProps {
  language: string;
  onContinue: () => void;
  onSkip: () => void;
}

export function PreLessonBriefing({ language, onContinue, onSkip }: PreLessonBriefingProps) {
  const t = useTranslations("PreLessonBriefing");
  const { user } = useAuth();
  const [isFirstLesson, setIsFirstLesson] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLessonHistory = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { count } = await supabaseBrowserClient
          .from("conversation_transcripts")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        setIsFirstLesson((count || 0) === 0);
      } catch {
        setIsFirstLesson(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkLessonHistory();
  }, [user]);

  if (isLoading) {
    return null;
  }

  if (!isFirstLesson) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <Card className="relative w-full max-w-lg border-0 bg-white shadow-2xl">
        <button
          onClick={onSkip}
          className="absolute right-4 top-4 rounded-full p-1 text-[#5D4037]/50 transition-colors hover:bg-[#8B4513]/10 hover:text-[#8B4513]"
        >
          <X className="h-5 w-5" />
        </button>

        <CardContent className="p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#8B4513]/10">
              <Lightbulb className="h-8 w-8 text-[#8B4513]" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-[#8B4513]">{t("title", { language })}</h2>
            <p className="text-[#5D4037]/70">{t("subtitle")}</p>
          </div>

          <div className="mb-6 space-y-4">
            <div className="flex gap-4 rounded-lg bg-[#FFF8E1] p-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#8B4513]/10">
                <Mic className="h-5 w-5 text-[#8B4513]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#8B4513]">{t("tip1.title")}</h3>
                <p className="text-sm text-[#5D4037]/70">{t("tip1.description")}</p>
              </div>
            </div>

            <div className="flex gap-4 rounded-lg bg-[#FFF8E1] p-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#8B4513]/10">
                <MessageCircle className="h-5 w-5 text-[#8B4513]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#8B4513]">{t("tip2.title")}</h3>
                <p className="text-sm text-[#5D4037]/70">{t("tip2.description")}</p>
              </div>
            </div>

            <div className="flex gap-4 rounded-lg bg-[#FFF8E1] p-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#8B4513]/10">
                <Lightbulb className="h-5 w-5 text-[#8B4513]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#8B4513]">{t("tip3.title")}</h3>
                <p className="text-sm text-[#5D4037]/70">{t("tip3.description")}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={onContinue}
              className="w-full bg-[#8B4513] py-6 text-lg text-white hover:bg-[#6D3611]"
            >
              {t("startButton")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <button
              onClick={onSkip}
              className="w-full text-center text-sm text-[#5D4037]/60 transition-colors hover:text-[#8B4513]"
            >
              {t("skipButton")}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
