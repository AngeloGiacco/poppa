"use client";

import { useState, useEffect } from "react";

import { useSearchParams } from "next/navigation";

import { formatDistance } from "date-fns";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import { LoadingSpinner } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@/i18n/routing";
import { supabaseBrowserClient } from "@/lib/supabase-browser";
import { learnable_languages } from "@/lib/supportedLanguages";
import type { Database } from "@/types/database.types";

type Lesson = Database["public"]["Tables"]["lesson"]["Row"] & {
  languages: Pick<Database["public"]["Tables"]["languages"]["Row"], "name" | "code"> | null;
};

export default function HistoryPage() {
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedTranscript, setSelectedTranscript] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const searchParams = useSearchParams();
  const languageCode = searchParams?.get("language") ?? null;
  const selectedLanguage = learnable_languages.find((lang) => lang.code === languageCode);
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;

    async function fetchLessons() {
      try {
        if (!user) {
          if (mounted) {
            setLessons([]);
            setIsLoading(false);
          }
          return;
        }

        const query = supabaseBrowserClient
          .from("lesson")
          .select(
            `
            id,
            created_at,
            transcript,
            subject,
            languages!inner (
              name,
              code
            )
          `
          )
          .eq("user", user.id)
          .order("created_at", { ascending: false });

        if (languageCode) {
          query.eq("languages.code", languageCode);
        }

        const { data } = await query;

        if (mounted) {
          setLessons(data as Lesson[]);
          setIsLoading(false);
          setIsMounted(true);
        }
      } catch (error) {
        console.error("Error fetching lessons:", error);
        if (mounted) {
          setIsLoading(false);
          setIsMounted(true);
        }
      }
    }

    setIsLoading(true);
    fetchLessons();

    return () => {
      mounted = false;
    };
  }, [languageCode, user]);

  if (isLoading || !isMounted) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0]">
      {/* Fixed Navigation Bar */}
      <nav className="fixed left-1/2 top-6 z-50 w-[95%] max-w-5xl -translate-x-1/2 transform">
        <div className="rounded-full bg-white/70 px-6 py-3 shadow-md backdrop-blur-sm">
          <Link
            href="/dashboard"
            className="flex items-center text-sm text-[#8B4513] transition-colors duration-300 hover:text-[#6D3611]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-16 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-8 flex items-center justify-center gap-3 text-center text-4xl font-bold text-[#8B4513]">
            {selectedLanguage ? (
              <>
                <selectedLanguage.icon className="h-8 w-8" />
                {`${selectedLanguage.name} lessons`}
              </>
            ) : (
              "Lesson History"
            )}
          </h1>

          <div className="mx-auto grid max-w-3xl gap-4">
            {lessons?.map((lesson: Lesson, index: number) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className="cursor-pointer bg-white/70 shadow-md backdrop-blur-sm transition-shadow duration-300 hover:shadow-lg"
                  onClick={() => {
                    setSelectedTranscript(lesson.transcript);
                    setIsDialogOpen(true);
                  }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="mb-1 text-xl font-semibold text-[#8B4513]">
                          {lesson.languages?.name} Lesson {lessons.length - index}
                        </h3>
                        <p className="text-sm text-[#8B4513]/70">
                          {formatDistance(new Date(lesson.created_at), new Date(), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        className="text-[#8B4513] hover:bg-[#8B4513]/5"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          setSelectedTranscript(lesson.transcript);
                          setIsDialogOpen(true);
                        }}
                      >
                        View Transcript
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

            {lessons?.length === 0 && (
              <div className="py-8 text-center text-[#8B4513]/70">
                No lessons found. Start learning to see your history!
              </div>
            )}
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-h-[80vh] overflow-y-auto border-[#8B4513]/20 bg-white/95 shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-xl text-[#8B4513]">Lesson Transcript</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <div className="whitespace-pre-wrap text-[#8B4513]/70">{selectedTranscript}</div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      </main>
    </div>
  );
}
