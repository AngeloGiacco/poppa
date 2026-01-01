'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { learnable_languages } from '@/lib/supportedLanguages';
import {
  Mic,
  Plus,
  LogOut,
  User,
  Coins,
  ChevronRight,
  BookOpen,
  Settings
} from 'lucide-react';
import Image from 'next/image';

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
  const t = useTranslations('DashboardPage');

  const [userLanguages, setUserLanguages] = useState<UserLanguage[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddLanguageDialog, setShowAddLanguageDialog] = useState(false);
  const [selectedNewLanguage, setSelectedNewLanguage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        if (!authLoading) {
          router.push('/login');
        }
        return;
      }

      setIsLoading(true);

      try {
        const { data: profile } = await supabaseBrowserClient
          .from('users')
          .select('first_name, credits')
          .eq('id', user.id)
          .single();

        setUserProfile(profile as UserProfile);

        const { data: userLearns } = await supabaseBrowserClient
          .from('user_learns')
          .select('language_id, languages(code, name)')
          .eq('user_id', user.id);

        const { data: transcripts } = await supabaseBrowserClient
          .from('conversation_transcripts')
          .select('target_language')
          .eq('user_id', user.id);

        const lessonCounts: Record<string, number> = {};
        transcripts?.forEach((t) => {
          if (t.target_language) {
            lessonCounts[t.target_language] = (lessonCounts[t.target_language] || 0) + 1;
          }
        });

        const languages: UserLanguage[] = [];
        userLearns?.forEach((ul) => {
          const langData = ul.languages as { code: string; name: string } | null;
          if (langData) {
            const learnableLang = learnable_languages.find(
              l => l.code === langData.code || l.name === langData.name
            );
            if (learnableLang) {
              languages.push({
                code: learnableLang.code,
                name: learnableLang.name,
                nativeName: learnableLang.native_name,
                icon: learnableLang.icon,
                lessonCount: lessonCounts[learnableLang.code] || lessonCounts[learnableLang.name] || 0,
              });
            }
          }
        });

        languages.sort((a, b) => b.lessonCount - a.lessonCount);
        setUserLanguages(languages);

      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      fetchData();
    }
  }, [user, authLoading, router]);

  const handleAddLanguage = async () => {
    if (!selectedNewLanguage || !user) return;

    try {
      const { data: langData } = await supabaseBrowserClient
        .from('languages')
        .select('id')
        .eq('code', selectedNewLanguage)
        .single();

      if (langData) {
        await supabaseBrowserClient
          .from('user_learns')
          .insert({
            id: crypto.randomUUID(),
            user_id: user.id,
            language_id: langData.id,
          });

        const lang = learnable_languages.find(l => l.code === selectedNewLanguage);
        if (lang) {
          setUserLanguages(prev => [...prev, {
            code: lang.code,
            name: lang.name,
            nativeName: lang.native_name,
            icon: lang.icon,
            lessonCount: 0,
          }]);
        }
      }

      setShowAddLanguageDialog(false);
      setSelectedNewLanguage(null);
    } catch (err) {
      console.error('Error adding language:', err);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const availableLanguages = learnable_languages.filter(
    lang => !userLanguages.some(ul => ul.code === lang.code)
  );

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Image src="/logo.svg" alt="Logo" width={64} height={64} className="rounded-2xl" />
          <span className="text-[#8B4513]">{t('loading')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0]">
      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-screen w-72 bg-white/80 backdrop-blur-sm border-r border-[#8B4513]/10 flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-[#8B4513]/10">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.svg" alt="Poppa" width={40} height={40} className="rounded-xl" />
              <span className="text-xl font-bold text-[#8B4513]">poppa</span>
            </Link>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-[#8B4513]/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#8B4513]/10 flex items-center justify-center">
                <User className="w-5 h-5 text-[#8B4513]" />
              </div>
              <div>
                <p className="font-medium text-[#8B4513]">
                  {userProfile?.first_name || 'Learner'}
                </p>
                <div className="flex items-center gap-1 text-sm text-[#5D4037]/70">
                  <Coins className="w-4 h-4" />
                  <span>{userProfile?.credits || 0} credits</span>
                </div>
              </div>
            </div>
          </div>

          {/* Languages List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#5D4037]/70 uppercase tracking-wide">
                {t('languages.title')}
              </h3>
              <button
                onClick={() => setShowAddLanguageDialog(true)}
                className="p-1.5 rounded-lg hover:bg-[#8B4513]/10 text-[#8B4513] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {userLanguages.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-[#8B4513]/30 mx-auto mb-3" />
                <p className="text-sm text-[#5D4037]/70 mb-4">No languages yet</p>
                <Button
                  onClick={() => setShowAddLanguageDialog(true)}
                  variant="outline"
                  className="text-[#8B4513] border-[#8B4513]/30 hover:bg-[#8B4513]/10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('languages.addLanguage')}
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
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#8B4513]/10 transition-colors group"
                    >
                      <FlagIcon className="w-6 h-4 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#8B4513] truncate">{lang.name}</p>
                        <p className="text-xs text-[#5D4037]/60">
                          {lang.lessonCount} {lang.lessonCount === 1 ? 'lesson' : 'lessons'}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#8B4513]/40 group-hover:text-[#8B4513] transition-colors" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-[#8B4513]/10 space-y-2">
            <Link
              href="/profile"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#8B4513]/10 transition-colors text-[#5D4037]"
            >
              <Settings className="w-5 h-5" />
              <span className="text-sm font-medium">Settings</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-colors text-red-600 w-full"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">{t('navigation.logout')}</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-72 flex-1 p-8">
          <div className="max-w-4xl">
            {/* Welcome Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#8B4513] mb-2">
                Welcome back{userProfile?.first_name ? `, ${userProfile.first_name}` : ''}!
              </h1>
              <p className="text-[#5D4037]/70">Ready to continue your language journey?</p>
            </div>

            {/* Quick Start CTA */}
            <Card className="bg-gradient-to-br from-[#8B4513] to-[#6D3611] text-white border-0 shadow-xl mb-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <CardContent className="p-8 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Start a Lesson</h2>
                    <p className="text-white/80 mb-6 max-w-md">
                      Jump into a voice conversation with your AI tutor and learn naturally through dialogue.
                    </p>
                    {userLanguages.length > 0 ? (
                      <Button
                        asChild
                        className="bg-white text-[#8B4513] hover:bg-white/90 rounded-full px-8 py-6 text-lg font-semibold shadow-lg"
                      >
                        <Link href={`/lesson/${userLanguages[0].code.toLowerCase()}`}>
                          <Mic className="w-5 h-5 mr-2" />
                          Continue {userLanguages[0].name}
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setShowAddLanguageDialog(true)}
                        className="bg-white text-[#8B4513] hover:bg-white/90 rounded-full px-8 py-6 text-lg font-semibold shadow-lg"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Choose a Language
                      </Button>
                    )}
                  </div>
                  <div className="hidden lg:block">
                    <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                      <Mic className="w-16 h-16 text-white/80" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Languages Grid */}
            {userLanguages.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-[#8B4513] mb-4">Your Languages</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userLanguages.slice(0, 6).map((lang) => {
                    const FlagIcon = lang.icon;
                    return (
                      <Card
                        key={lang.code}
                        className="bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
                      >
                        <Link href={`/lesson/${lang.code.toLowerCase()}`}>
                          <CardContent className="p-5">
                            <div className="flex items-center gap-4 mb-4">
                              <FlagIcon className="w-8 h-5 flex-shrink-0" />
                              <div>
                                <h3 className="font-semibold text-[#8B4513]">{lang.name}</h3>
                                <p className="text-sm text-[#5D4037]/60">{lang.nativeName}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-[#5D4037]/70">
                                {lang.lessonCount} {lang.lessonCount === 1 ? 'lesson' : 'lessons'}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-[#8B4513] group-hover:bg-[#8B4513]/10"
                              >
                                <Mic className="w-4 h-4 mr-1" />
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
                    className="bg-white/50 backdrop-blur-sm border-2 border-dashed border-[#8B4513]/30 hover:border-[#8B4513] shadow-none hover:shadow-md transition-all duration-300 cursor-pointer"
                  >
                    <CardContent className="p-5 flex items-center justify-center h-full min-h-[120px]">
                      <div className="text-center">
                        <Plus className="w-8 h-8 text-[#8B4513]/50 mx-auto mb-2" />
                        <span className="text-sm font-medium text-[#8B4513]/70">
                          {t('languages.addLanguage')}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Credits Info */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-[#8B4513] flex items-center gap-2">
                  <Coins className="w-5 h-5" />
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
                    className="text-[#8B4513] border-[#8B4513]/30 hover:bg-[#8B4513]/10"
                  >
                    <Link href="/pricing">{t('navigation.buyCredits')}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Add Language Dialog */}
      <Dialog open={showAddLanguageDialog} onOpenChange={setShowAddLanguageDialog}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#8B4513]">{t('languages.dialog.title')}</DialogTitle>
            <DialogDescription className="text-[#5D4037]/70">
              {t('languages.dialog.description')}
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
                    className={`flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                      selectedNewLanguage === lang.code
                        ? 'bg-[#8B4513] text-white'
                        : 'hover:bg-[#8B4513]/10 text-[#5D4037]'
                    }`}
                  >
                    <FlagIcon className="w-6 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium truncate">{lang.name}</span>
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
              className="bg-[#8B4513] hover:bg-[#6D3611] text-white"
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
