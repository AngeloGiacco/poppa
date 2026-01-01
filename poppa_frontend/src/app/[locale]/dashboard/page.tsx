"use client";

import type React from "react";
import { useEffect, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { BookOpen, ChevronRight, Coins, LogOut, Mic, Plus, Settings, User } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@/i18n/routing";
import { supabaseBrowserClient } from "@/lib/supabase-browser";
import { learnable_languages } from "@/lib/supportedLanguages";

interface UserLanguage {
  code: string;
  name: string;
  nativeName: string;
  icon: React.ComponentType<{ className?: string }>;
  lessonCount: number;
}

interface UserProfile {
  first_name: string | null;
  credits: number;
}

const DashboardPage = () => {
  const { user, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const t = useTranslations("DashboardPage");

  const [userLanguages, setUserLanguages] = useState<UserLanguage[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddLanguageDialog, setShowAddLanguageDialog] = useState(false);
  const [selectedNewLanguage, setSelectedNewLanguage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        if (!authLoading) {
          router.push("/login");
        }
        return;
      }

      setIsLoading(true);

      try {
        const { data: profile } = await supabaseBrowserClient
          .from("users")
          .select("first_name, credits")
          .eq("id", user.id)
          .single();

        setUserProfile(profile as UserProfile);

        const { data: userLearns } = await supabaseBrowserClient
          .from("user_learns")
          .select("language_id, languages(code, name)")
          .eq("user_id", user.id);

        const { data: transcripts } = await supabaseBrowserClient
          .from("conversation_transcripts")
          .select("target_language")
          .eq("user_id", user.id);

        const lessonCounts: Record<string, number> = {};
        transcripts?.forEach((transcript) => {
          if (transcript.target_language) {
            lessonCounts[transcript.target_language] =
              (lessonCounts[transcript.target_language] || 0) + 1;
          }
        });

        const languages: UserLanguage[] = [];
        userLearns?.forEach((ul) => {
          const langData = ul.languages as { code: string; name: string } | null;
          if (langData) {
            const learnableLang = learnable_languages.find(
              (l) => l.code === langData.code || l.name === langData.name
            );
            if (learnableLang) {
              languages.push({
                code: learnableLang.code,
                name: learnableLang.name,
                nativeName: learnableLang.native_name,
                icon: learnableLang.icon,
                lessonCount:
                  lessonCounts[learnableLang.code] || lessonCounts[learnableLang.name] || 0,
              });
            }
          }
        });

        languages.sort((a, b) => b.lessonCount - a.lessonCount);
        setUserLanguages(languages);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      fetchData();
    }
  }, [user, authLoading, router]);

  const handleAddLanguage = async () => {
    if (!selectedNewLanguage || !user) {
      return;
    }

    try {
      const { data: langData } = await supabaseBrowserClient
        .from("languages")
        .select("id")
        .eq("code", selectedNewLanguage)
        .single();

      if (langData) {
        await supabaseBrowserClient.from("user_learns").insert({
          id: crypto.randomUUID(),
          user_id: user.id,
          language_id: langData.id,
        });

        const lang = learnable_languages.find((l) => l.code === selectedNewLanguage);
        if (lang) {
          setUserLanguages((prev) => [
            ...prev,
            {
              code: lang.code,
              name: lang.name,
              nativeName: lang.native_name,
              icon: lang.icon,
              lessonCount: 0,
            },
          ]);
        }
      }

      setShowAddLanguageDialog(false);
      setSelectedNewLanguage(null);
    } catch (err) {
      console.error("Error adding language:", err);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const availableLanguages = learnable_languages.filter(
    (lang) => !userLanguages.some((ul) => ul.code === lang.code)
  );

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0]">
        <div className="flex animate-pulse flex-col items-center gap-4">
          <Image src="/logo.svg" alt="Logo" width={64} height={64} className="rounded-2xl" />
          <span className="text-[#8B4513]">{t("loading")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0]">
      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 flex h-screen w-72 flex-col border-r border-[#8B4513]/10 bg-white/80 backdrop-blur-sm">
          {/* Logo */}
          <div className="border-b border-[#8B4513]/10 p-6">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.svg" alt="Poppa" width={40} height={40} className="rounded-xl" />
              <span className="text-xl font-bold text-[#8B4513]">poppa</span>
            </Link>
          </div>

          {/* User Info */}
          <div className="border-b border-[#8B4513]/10 p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8B4513]/10">
                <User className="h-5 w-5 text-[#8B4513]" />
              </div>
              <div>
                <p className="font-medium text-[#8B4513]">{userProfile?.first_name || "Learner"}</p>
                <div className="flex items-center gap-1 text-sm text-[#5D4037]/70">
                  <Coins className="h-4 w-4" />
                  <span>{userProfile?.credits || 0} credits</span>
                </div>
              </div>
            </div>
          </div>

          {/* Languages List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[#5D4037]/70">
                {t("languages.title")}
              </h3>
              <button
                onClick={() => setShowAddLanguageDialog(true)}
                className="rounded-lg p-1.5 text-[#8B4513] transition-colors hover:bg-[#8B4513]/10"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {userLanguages.length === 0 ? (
              <div className="py-8 text-center">
                <BookOpen className="mx-auto mb-3 h-12 w-12 text-[#8B4513]/30" />
                <p className="mb-4 text-sm text-[#5D4037]/70">No languages yet</p>
                <Button
                  onClick={() => setShowAddLanguageDialog(true)}
                  variant="outline"
                  className="border-[#8B4513]/30 text-[#8B4513] hover:bg-[#8B4513]/10"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t("languages.addLanguage")}
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {userLanguages.map((lang) => {
                  const FlagIcon = lang.icon;
                  return (
                    <Link
                      key={lang.code}
                      href={`/lesson/${lang.code.toLowerCase()}`}
                      className="group flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-[#8B4513]/10"
                    >
                      <FlagIcon className="h-4 w-6 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-[#8B4513]">{lang.name}</p>
                        <p className="text-xs text-[#5D4037]/60">
                          {lang.lessonCount} {lang.lessonCount === 1 ? "lesson" : "lessons"}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[#8B4513]/40 transition-colors group-hover:text-[#8B4513]" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="space-y-2 border-t border-[#8B4513]/10 p-4">
            <Link
              href="/profile"
              className="flex items-center gap-3 rounded-xl p-3 text-[#5D4037] transition-colors hover:bg-[#8B4513]/10"
            >
              <Settings className="h-5 w-5" />
              <span className="text-sm font-medium">Settings</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl p-3 text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">{t("navigation.logout")}</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-72 flex-1 p-8">
          <div className="max-w-4xl">
            {/* Welcome Header */}
            <div className="mb-8">
              <h1 className="mb-2 text-3xl font-bold text-[#8B4513]">
                Welcome back{userProfile?.first_name ? `, ${userProfile.first_name}` : ""}!
              </h1>
              <p className="text-[#5D4037]/70">Ready to continue your language journey?</p>
            </div>

            {/* Quick Start CTA */}
            <Card className="relative mb-8 overflow-hidden border-0 bg-gradient-to-br from-[#8B4513] to-[#6D3611] text-white shadow-xl">
              <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/5" />
              <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-1/2 translate-y-1/2 rounded-full bg-white/5" />
              <CardContent className="relative p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="mb-2 text-2xl font-bold">Start a Lesson</h2>
                    <p className="mb-6 max-w-md text-white/80">
                      Jump into a voice conversation with your AI tutor and learn naturally through
                      dialogue.
                    </p>
                    {userLanguages.length > 0 ? (
                      <Button
                        asChild
                        className="rounded-full bg-white px-8 py-6 text-lg font-semibold text-[#8B4513] shadow-lg hover:bg-white/90"
                      >
                        <Link href={`/lesson/${userLanguages[0].code.toLowerCase()}`}>
                          <Mic className="mr-2 h-5 w-5" />
                          Continue {userLanguages[0].name}
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setShowAddLanguageDialog(true)}
                        className="rounded-full bg-white px-8 py-6 text-lg font-semibold text-[#8B4513] shadow-lg hover:bg-white/90"
                      >
                        <Plus className="mr-2 h-5 w-5" />
                        Choose a Language
                      </Button>
                    )}
                  </div>
                  <div className="hidden lg:block">
                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white/10">
                      <Mic className="h-16 w-16 text-white/80" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Languages Grid */}
            {userLanguages.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-4 text-xl font-bold text-[#8B4513]">Your Languages</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {userLanguages.slice(0, 6).map((lang) => {
                    const FlagIcon = lang.icon;
                    return (
                      <Card
                        key={lang.code}
                        className="group cursor-pointer border-0 bg-white/80 shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
                      >
                        <Link href={`/lesson/${lang.code.toLowerCase()}`}>
                          <CardContent className="p-5">
                            <div className="mb-4 flex items-center gap-4">
                              <FlagIcon className="h-5 w-8 flex-shrink-0" />
                              <div>
                                <h3 className="font-semibold text-[#8B4513]">{lang.name}</h3>
                                <p className="text-sm text-[#5D4037]/60">{lang.nativeName}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-[#5D4037]/70">
                                {lang.lessonCount} {lang.lessonCount === 1 ? "lesson" : "lessons"}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-[#8B4513] group-hover:bg-[#8B4513]/10"
                              >
                                <Mic className="mr-1 h-4 w-4" />
                                Start
                              </Button>
                            </div>
                          </CardContent>
                        </Link>
                      </Card>
                    );
                  })}

                  {/* Add Language Card */}
                  <Card
                    onClick={() => setShowAddLanguageDialog(true)}
                    className="cursor-pointer border-2 border-dashed border-[#8B4513]/30 bg-white/50 shadow-none backdrop-blur-sm transition-all duration-300 hover:border-[#8B4513] hover:shadow-md"
                  >
                    <CardContent className="flex h-full min-h-[120px] items-center justify-center p-5">
                      <div className="text-center">
                        <Plus className="mx-auto mb-2 h-8 w-8 text-[#8B4513]/50" />
                        <span className="text-sm font-medium text-[#8B4513]/70">
                          {t("languages.addLanguage")}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Credits Info */}
            <Card className="border-0 bg-white/80 shadow-md backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg text-[#8B4513]">
                  <Coins className="h-5 w-5" />
                  Your Credits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-[#8B4513]">{userProfile?.credits || 0}</p>
                    <p className="text-sm text-[#5D4037]/70">minutes remaining</p>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    className="border-[#8B4513]/30 text-[#8B4513] hover:bg-[#8B4513]/10"
                  >
                    <Link href="/pricing">{t("navigation.buyCredits")}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Add Language Dialog */}
      <Dialog open={showAddLanguageDialog} onOpenChange={setShowAddLanguageDialog}>
        <DialogContent className="bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#8B4513]">{t("languages.dialog.title")}</DialogTitle>
            <DialogDescription className="text-[#5D4037]/70">
              {t("languages.dialog.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[300px] overflow-y-auto py-4">
            <div className="grid grid-cols-2 gap-2">
              {availableLanguages.map((lang) => {
                const FlagIcon = lang.icon;
                return (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedNewLanguage(lang.code)}
                    className={`flex items-center gap-3 rounded-xl p-3 text-left transition-colors ${
                      selectedNewLanguage === lang.code
                        ? "bg-[#8B4513] text-white"
                        : "text-[#5D4037] hover:bg-[#8B4513]/10"
                    }`}
                  >
                    <FlagIcon className="h-4 w-6 flex-shrink-0" />
                    <span className="truncate text-sm font-medium">{lang.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddLanguageDialog(false)}
              className="text-[#5D4037]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddLanguage}
              disabled={!selectedNewLanguage}
              className="bg-[#8B4513] text-white hover:bg-[#6D3611]"
            >
              Add Language
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardPage;
