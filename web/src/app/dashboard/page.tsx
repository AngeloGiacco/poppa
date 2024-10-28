"use client"

import { useState } from 'react';
import { Inter } from 'next/font/google';
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GB, ES, FR, DE, IT, PT, RU, KE, CN, JP, KR, NL, PL, SE, TR, SA, IN, TH, VN, GR, RO, HU, CZ, DK, FI, NO, HR, BG, SK } from 'country-flag-icons/react/3x2';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
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
import { Slider } from "@/components/ui/slider";
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

const inter = Inter({ subsets: ['latin'] });

// Updated mock data for user's languages
const userLanguages = [
  { code: 'KE', name: 'Swahili', icon: KE },
];

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  // Move all useState declarations to the top
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

  const fetchUserData = async () => {
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
  };

  if (!user || !userData) return null; // or a loading spinner

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

    // Show confirmation dialog
    const selectedLangDetails = availableLanguages.find(lang => lang.code === selectedLang);
    if (!selectedLangDetails) return;

    // TODO: Add API call to save new language to user's profile
    const addLanguageToProfile = async (startLesson: boolean) => {
      try {
        // Add language to user's profile in database
        console.log(`Adding ${selectedLang} to user's profile`);
        
        if (startLesson) {
          router.push(`/lesson/${selectedLang}/introduction`);
        }
        // Refresh dashboard data
        await fetchUserData();
      } catch (error) {
        console.error('Error adding language:', error);
      }
    };
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

  return (
    <div className={`min-h-screen bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0] ${inter.className}`}>
      {/* Floating Navigation Bar */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-5xl">
        <div className="backdrop-blur-md bg-white/70 rounded-2xl shadow-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <Image
                  className="rounded-xl shadow-md"
                  src="/logo.svg"
                  alt="Poppa logo"
                  width={40}
                  height={40}
                  priority
                />
              </motion.div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#8B4513] to-[#6D3611] bg-clip-text text-transparent">
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
                  <Button className="bg-gradient-to-r from-[#8B4513] to-[#6D3611] text-white hover:opacity-90 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                    Buy Credits
                  </Button>
                </DialogTrigger>
                {/* ... dialog content ... */}
              </Dialog>
              
              <div className="flex items-center gap-2 bg-white/50 rounded-xl p-1">
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="text-[#8B4513] hover:bg-[#8B4513]/5 rounded-lg">
                    Profile
                  </Button>
                </Link>
                <Button size="sm" variant="ghost" className="text-[#8B4513] hover:bg-[#8B4513]/5 rounded-lg">
                  Log Out
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
              <h2 className="text-2xl font-bold text-[#8B4513]">Your Languages</h2>
              <Button
                onClick={handleAddLanguage}
                className="bg-[#8B4513] text-white hover:bg-[#6D3611]"
              >
                Add Language
              </Button>

              <Dialog open={isLanguageDialogOpen} onOpenChange={setIsLanguageDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add a New Language</DialogTitle>
                    <DialogDescription>
                      Choose a language you'd like to learn
                    </DialogDescription>
                  </DialogHeader>
                  <Select onValueChange={handleLanguageSelection}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableLanguages
                        .filter(lang => !userLanguages.some(userLang => userLang.code === lang.code))
                        .map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            <div className="flex items-center">
                              <lang.icon className="w-5 h-5 mr-2" />
                              {lang.name}
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </DialogContent>
              </Dialog>

              <AlertDialog open={!!selectedLanguage}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Start Learning Now?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Would you like to start your first lesson in {availableLanguages.find(lang => lang.code === selectedLanguage)?.name} now?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => {
                      addLanguageToProfile(false);
                      setSelectedLanguage("");
                    }}>
                      Later
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                      addLanguageToProfile(true);
                      setSelectedLanguage("");
                    }}>
                      Start Now
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

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
                            <p className="text-sm text-[#8B4513]/70">Intermediate Level</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#8B4513] hover:bg-[#8B4513]/5"
                        >
                          View History
                        </Button>
                      </div>

                      <div className="flex gap-3">
                        <Link href={`/lesson/${lang.code.toLowerCase()}`}>
                          <Button className="flex-1 bg-[#8B4513] text-white hover:bg-[#6D3611]">
                            Continue Learning
                          </Button>
                        </Link>
                        <Dialog open={openCustomLessons[lang.code]} onOpenChange={(open) => toggleCustomLesson(lang.code)}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex-1 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513]/5"
                            >
                              Custom Lesson
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Custom Lesson - {lang.name}</DialogTitle>
                              <DialogDescription>
                                Enter what you'd like to learn about in {lang.name}.
                                <br />We'll make sure the lesson fits your level.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <Input
                                placeholder="e.g., ordering food at a restaurant"
                                value={customTopics[lang.code]}
                                onChange={(e) => updateCustomTopic(lang.code, e.target.value)}
                              />
                              <Button 
                                onClick={() => startCustomLesson(lang.code)}
                                disabled={!customTopics[lang.code]}
                                className="bg-[#8B4513] text-white hover:bg-[#6D3611]"
                              >
                                Start Lesson
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
