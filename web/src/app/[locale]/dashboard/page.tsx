"use client"

import { useState, useCallback } from 'react';
import { motion } from "framer-motion";
import { Link } from '@/i18n/routing';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GB, ES, FR, DE, IT, PT, RU, KE, CN, JP, KR, NL, PL, SE, TR, SA, IN, TH, VN, GR, RO, HU, CZ, DK, FI, NO, HR, BG, SK } from 'country-flag-icons/react/3x2';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/i18n/routing';
import { useEffect } from 'react';
import { languages as availableLanguages } from '@/lib/supportedLanguages';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import CreditsBanner from '@/components/CreditsBanner';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useTranslations } from 'next-intl';
import { type Tables } from '@/types/database.types';

// Updated mock data for user's languages
const userLanguages = [
  { code: 'KE', name: 'Swahili', icon: KE },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const t = useTranslations('DashboardPage');
  const tCommon = useTranslations('common');

  // State declarations
  const [selectedCredits, setSelectedCredits] = useState(1);
  const [isLanguageSelectOpen, setIsLanguageSelectOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false);
  const [userData, setUserData] = useState<Tables<'users'> | null>(null);
  const [customTopics, setCustomTopics] = useState(
    Object.fromEntries(userLanguages.map(lang => [lang.code, '']))
  );
  const [openCustomLessons, setOpenCustomLessons] = useState(
    Object.fromEntries(userLanguages.map(lang => [lang.code, false]))
  );

  // Define fetchUserData first
  const fetchUserData = useCallback(async () => {
    if (user) {
      const { data, error } = await supabaseBrowserClient
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
      } else {
        setUserData(data);
      }
    }
  }, [user]);

  // Now we can use fetchUserData in addLanguageToProfile
  const addLanguageToProfile = useCallback(async (startLesson: boolean) => {
    if (!user || !selectedLanguage) return;
    
    try {
      const response = await fetch('/api/language/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          languageCode: selectedLanguage,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add language');
      }

      await fetchUserData();

      if (startLesson) {
        router.push(`/lesson/${selectedLanguage.toLowerCase()}`);
      }
    } catch (error) {
      console.error('Error adding language:', error);
    }
  }, [user, selectedLanguage, router, fetchUserData]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const toggleCustomLesson = (langCode: string) => {
    setOpenCustomLessons(prev => ({
      ...prev,
      [langCode]: !prev[langCode]
    }));
  };

  const updateCustomTopic = (langCode: string, topic: string) => {
    setCustomTopics(prev => ({
      ...prev,
      [langCode]: topic
    }));
  };

  const handleLanguageSelection = async (selectedLang: string) => {
    setSelectedLanguage(selectedLang);
    setIsLanguageDialogOpen(false);
  };

  const handleAlertDialogAction = async (startLesson: boolean) => {
    if (!selectedLanguage) return;
    
    await addLanguageToProfile(startLesson);
    setSelectedLanguage(""); // Clear the selected language to close the dialog
  };

  const handleBuyCredits = () => {
    // Logic to initiate Stripe checkout session
    console.log("Initiate Stripe checkout session");
  };

  const startCustomLesson = (langCode: string) => {
    const topic = customTopics[langCode];
    if (!topic) return;
    
    // TODO: Navigate to lesson page with custom topic
    console.log(`Starting custom lesson for ${langCode} about: ${topic}`);
    setOpenCustomLessons(prev => ({
      ...prev,
      [langCode]: false
    }));
  };

  const handleAddLanguage = () => {
    setIsLanguageDialogOpen(true);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0]`}>
      {/* Floating Navigation Bar */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-5xl">
        <div className="backdrop-blur-md rounded-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Image
                  className="rounded-xl"
                  src="/logo.svg"
                  alt="Poppa logo"
                  width={80}
                  height={80}
                  priority
                />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#8B4513] to-[#6D3611] bg-clip-text text-transparent">
                poppa
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CreditsBanner userData={userData} />
              </motion.div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-[#8B4513] to-[#6D3611] text-white hover:opacity-90 shadow-md hover:shadow-lg transition-all duration-300">
                    {t('navigation.buyCredits')}
                  </Button>
                </DialogTrigger>
                {/* ... dialog content ... */}
              </Dialog>
              
              <div className="flex items-center gap-2">
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="text-[#8B4513] hover:bg-[#8B4513]/5">
                    {t('navigation.profile')}
                  </Button>
                </Link>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-[#8B4513] hover:bg-[#8B4513]/5"
                  onClick={handleLogout}
                >
                  {t('navigation.logout')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 px-6 pb-24 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Language Progress */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-[#8B4513]">{t('languages.title')}</h2>
              <Button
                onClick={handleAddLanguage}
                className="bg-[#8B4513] text-white hover:bg-[#6D3611]"
              >
                {t('languages.addLanguage')}
              </Button>
            </div>

            <Dialog open={isLanguageDialogOpen} onOpenChange={setIsLanguageDialogOpen}>
              <DialogContent className="dialog-content">
                <DialogHeader className="dialog-header">
                  <DialogTitle className="dialog-title">{t('languages.dialog.title')}</DialogTitle>
                  <DialogDescription className="dialog-description">
                    {t('languages.dialog.description')}
                  </DialogDescription>
                </DialogHeader>
                <Select onValueChange={handleLanguageSelection}>
                  <SelectTrigger className="w-full bg-white/70 border-[#8B4513]/20 text-[#8B4513] hover:border-[#8B4513]/40 focus:ring-[#8B4513]/20">
                    <SelectValue placeholder={t('languages.dialog.selectPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 border-[#8B4513]/20 shadow-lg">
                    {availableLanguages
                      .filter(lang => !userLanguages.some(userLang => userLang.code === lang.code))
                      .map((lang) => (
                        <SelectItem 
                          key={lang.code} 
                          value={lang.code}
                          className="cursor-pointer hover:bg-[#8B4513]/5 text-[#8B4513] focus:bg-[#8B4513]/10 focus:text-[#8B4513]"
                        >
                          <div className="flex items-center">
                            <lang.icon className="w-5 h-5 mr-2" />
                            {tCommon(`languages.${lang.code}`)}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </DialogContent>
            </Dialog>

            <AlertDialog open={!!selectedLanguage}>
              <AlertDialogContent className="bg-white/95 border border-[#8B4513]/20 shadow-lg">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-[#8B4513] text-xl">
                    {t('languages.startLearning.title')}
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-[#8B4513]/70">
                    {t('languages.startLearning.description', {
                      language: availableLanguages.find(lang => lang.code === selectedLanguage)?.name
                    })}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel 
                    onClick={() => handleAlertDialogAction(false)}
                    className="border-[#8B4513]/20 text-[#8B4513] hover:bg-[#8B4513]/5 hover:border-[#8B4513]/30">
                    {t('languages.startLearning.later')}
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => handleAlertDialogAction(true)}
                    className="bg-[#8B4513] text-white hover:bg-[#6D3611]">
                    {t('languages.startLearning.startNow')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {userLanguages.map((lang) => (
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  key={lang.code}
                >
                  <Card className="bg-white/70 backdrop-blur-sm shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#8B4513]/5 rounded-xl">
                            <lang.icon className="w-8 h-8" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-[#8B4513]">{lang.name}</h3>
                            <p className="text-sm text-[#8B4513]/70">{t('languages.card.level')}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#8B4513] hover:bg-[#8B4513]/5"
                        >
                          {t('languages.card.viewHistory')}
                        </Button>
                      </div>

                      <div className="flex gap-3">
                        <Link href={`/lesson/${lang.code.toLowerCase()}`}>
                          <Button className="flex-1 bg-[#8B4513] text-white hover:bg-[#6D3611]">
                            {t('languages.card.continueButton')}
                          </Button>
                        </Link>
                        <Dialog open={openCustomLessons[lang.code]} onOpenChange={(open) => toggleCustomLesson(lang.code)}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex-1 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513]/5"
                            >
                              {t('languages.card.customButton')}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px] bg-white">
                            <DialogHeader>
                              <DialogTitle>
                                {t('languages.customLesson.title', { language: lang.name })}
                              </DialogTitle>
                              <DialogDescription>
                                {t('languages.customLesson.description', { language: lang.name })}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <Input
                                placeholder={t('languages.customLesson.placeholder')}
                                value={customTopics[lang.code]}
                                onChange={(e) => updateCustomTopic(lang.code, e.target.value)}
                              />
                              <Button 
                                onClick={() => startCustomLesson(lang.code)}
                                disabled={!customTopics[lang.code]}
                                className="bg-[#8B4513] text-white hover:bg-[#6D3611]"
                              >
                                {t('languages.customLesson.startButton')}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  );
}
