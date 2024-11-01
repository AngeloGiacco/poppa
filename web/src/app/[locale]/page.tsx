"use client"

import './globals.css';
import Image from "next/image";
import { Link } from '@/i18n/routing';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer"
import { Card, CardContent } from "@/components/ui/card";
import * as CountryFlags from 'country-flag-icons/react/3x2'
import {languages} from '@/lib/supportedLanguages';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { LanguageSelector } from '@/components/LanguageSelector';

export default function Home() {
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const t = useTranslations('HomePage');
  const tCommon = useTranslations('common');

  const year = 2024;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0]">
      {/* Navigation - Mobile improvements */}
      <div className="absolute top-0 left-0 right-0 px-4 sm:px-6 py-4 backdrop-blur-sm bg-[#FFF8E1]/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <motion.nav className="flex space-x-4 sm:space-x-6">
            <Button variant="ghost" asChild className="text-sm sm:text-base text-[#8B4513] hover:bg-transparent hover:text-[#6D3611] transition-colors duration-300">
              <Link href="/pricing">{t('navigation.pricing')}</Link>
            </Button>
            <Button variant="ghost" asChild className="text-sm sm:text-base text-[#8B4513] hover:bg-transparent hover:text-[#6D3611] transition-colors duration-300">
              <Link href="/how-it-works">{t('navigation.howItWorks')}</Link>
            </Button>
          </motion.nav>
          
          <motion.nav className="flex items-center space-x-2 sm:space-x-4">
            <LanguageSelector />
            <Button variant="ghost" asChild className="text-sm sm:text-base text-[#8B4513] hover:bg-transparent hover:text-[#6D3611]">
              <Link href="/login">{t('navigation.login')}</Link>
            </Button>
            <Button asChild className="text-sm sm:text-base bg-[#8B4513] text-white hover:bg-[#6D3611] rounded-full px-4 sm:px-6">
              <Link href="/signup">{t('navigation.getStarted')}</Link>
            </Button>
          </motion.nav>
        </div>
      </div>

      {/* Main content - Mobile improvements */}
      <motion.div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 pt-40 sm:pt-32 pb-16">
        <motion.header className="text-center max-w-3xl mx-auto mb-12 sm:mb-20">
          {showAnnouncement && (
            <motion.div className="mb-8">
              <Link href="/founder-message" 
                className="inline-flex items-center space-x-2 bg-[#8B4513]/10 text-[#8B4513] px-4 py-2 rounded-full text-sm hover:bg-[#8B4513]/15 transition-colors duration-300">
                <span>{t('announcement.live')}</span>
                <span className="font-medium">{t('announcement.founderMessage')}</span>
              </Link>
            </motion.div>
          )}
          
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <Image
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl shadow-lg"
                src="/logo.svg"
                alt="Poppa logo"
                width={64}
                height={64}
                priority
              />
              <span className="text-2xl sm:text-3xl font-bold text-[#8B4513]">{t('hero.brandName')}</span>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#8B4513] tracking-tight mb-4 sm:mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-lg sm:text-xl text-[#5D4037]/80 leading-relaxed px-4 sm:px-0">
            {t('hero.subtitle')}
          </p>
        </motion.header>

        {/* Cards layout - Mobile improvements */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-start">
          <motion.div className="space-y-6">
            <Card className="bg-white/50 backdrop-blur-sm shadow-sm border-0 rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold text-[#8B4513] mb-4">{t('languagesSection.title')}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {languages.map((lang) => {
                    const FlagIcon = CountryFlags[lang.code as keyof typeof CountryFlags];
                    return (
                      <div key={lang.code} className="flex items-center space-x-3 group">
                        <FlagIcon className="w-6 h-4 transition-transform duration-300 group-hover:scale-110" />
                        <span className="text-[#5D4037]/80 group-hover:text-[#8B4513] transition-colors duration-300">
                          {tCommon(`languages.${lang.code}`)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div className="lg:mt-12">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#8B4513]/5 to-[#8B4513]/10 rounded-3xl transform rotate-3"></div>
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 rounded-2xl relative">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-semibold text-[#8B4513] mb-6">{t('whyPoppa.title')}</h2>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-full bg-[#8B4513]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[#8B4513]">🎓</span>
                      </div>
                      <div>
                          <h3 className="font-medium text-[#8B4513] mb-1 group-hover:underline">{t('whyPoppa.features.tutoring.title')}</h3>
                          <p className="text-[#5D4037]/80">{t('whyPoppa.features.tutoring.description')} <Link href="/how-it-works" className="text-[#8B4513] hover:underline">{t('whyPoppa.features.tutoring.learnMore')}</Link></p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-full bg-[#8B4513]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[#8B4513]">🎯</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-[#8B4513] mb-1">{t('whyPoppa.features.personalized.title')}</h3>
                        <p className="text-[#5D4037]/80">{t('whyPoppa.features.personalized.description')}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-full bg-[#8B4513]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[#8B4513]">🎁</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-[#8B4513] mb-1">{t('whyPoppa.features.freeStart.title')}</h3>
                        <p className="text-[#5D4037]/80">{t('whyPoppa.features.freeStart.description')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <Button asChild size="lg" 
                      className="w-full bg-[#8B4513] hover:bg-[#6D3611] text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                      <Link href="/signup">{t('whyPoppa.tryButton')}</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}
