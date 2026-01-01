"use client"

import Image from "next/image";
import { Link } from '@/i18n/routing';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer"
import { Card, CardContent } from "@/components/ui/card";
import { learnable_languages } from '@/lib/supportedLanguages';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Mic, Sparkles, Target, Gift, ArrowRight, Play } from 'lucide-react';

export default function Home() {
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const t = useTranslations('HomePage');
  const tCommon = useTranslations('common');

  const featuredLanguages = learnable_languages.slice(0, 12);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0]">
      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 px-4 sm:px-6 py-4 backdrop-blur-md bg-[#FFF8E1]/80 z-50 border-b border-[#8B4513]/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Image
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl"
                src="/logo.svg"
                alt="Poppa logo"
                width={40}
                height={40}
                priority
              />
              <span className="text-xl font-bold text-[#8B4513]">{t('hero.brandName')}</span>
            </Link>
            <nav className="hidden sm:flex space-x-1">
              <Button asChild variant="ghost" className="text-sm text-[#5D4037] hover:bg-[#8B4513]/10 hover:text-[#8B4513] transition-colors duration-300">
                <Link href="/pricing">{t('navigation.pricing')}</Link>
              </Button>
              <Button asChild variant="ghost" className="text-sm text-[#5D4037] hover:bg-[#8B4513]/10 hover:text-[#8B4513] transition-colors duration-300">
                <Link href="/how-it-works">{t('navigation.howItWorks')}</Link>
              </Button>
            </nav>
          </div>

          <nav className="flex items-center space-x-2 sm:space-x-3">
            <LanguageSelector />
            <Button asChild variant="ghost" className="text-sm text-[#5D4037] hover:bg-[#8B4513]/10 hover:text-[#8B4513]">
              <Link href="/login">{t('navigation.login')}</Link>
            </Button>
            <Button asChild className="text-sm bg-[#8B4513] text-white hover:bg-[#6D3611] rounded-full px-5 shadow-md hover:shadow-lg transition-all duration-300">
              <Link href="/signup">{t('navigation.getStarted')}</Link>
            </Button>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <motion.div
        className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 pt-32 sm:pt-36 pb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <header className="text-center max-w-4xl mx-auto mb-16 sm:mb-20">
          {showAnnouncement && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/founder-message"
                className="inline-flex items-center gap-2 bg-[#8B4513]/10 text-[#8B4513] px-4 py-2 rounded-full text-sm hover:bg-[#8B4513]/15 transition-colors duration-300 group">
                <span className="text-base">✨</span>
                <span>{t('announcement.live')}</span>
                <span className="font-medium group-hover:underline">{t('announcement.founderMessage')}</span>
              </Link>
            </motion.div>
          )}

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#8B4513] tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {t('hero.title')}
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-[#5D4037]/80 leading-relaxed max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Button asChild className="bg-[#8B4513] hover:bg-[#6D3611] text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group">
              <Link href="/signup">
                <Mic className="w-5 h-5 mr-2" />
                {t('whyPoppa.tryButton')}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="text-[#8B4513] border-[#8B4513]/30 hover:bg-[#8B4513]/10 rounded-full px-8 py-6 text-lg transition-all duration-300">
              <Link href="/how-it-works">
                <Play className="w-5 h-5 mr-2" />
                See how it works
              </Link>
            </Button>
          </motion.div>
        </header>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Card className="bg-white/60 backdrop-blur-sm shadow-sm border-0 rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-[#8B4513]/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-[#8B4513]" />
              </div>
              <h3 className="font-semibold text-[#8B4513] text-lg mb-2">{t('whyPoppa.features.tutoring.title')}</h3>
              <p className="text-[#5D4037]/70 text-sm leading-relaxed">{t('whyPoppa.features.tutoring.description')}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm shadow-sm border-0 rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-[#8B4513]/10 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-[#8B4513]" />
              </div>
              <h3 className="font-semibold text-[#8B4513] text-lg mb-2">{t('whyPoppa.features.personalized.title')}</h3>
              <p className="text-[#5D4037]/70 text-sm leading-relaxed">{t('whyPoppa.features.personalized.description')}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm shadow-sm border-0 rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-[#8B4513]/10 flex items-center justify-center mb-4">
                <Gift className="w-6 h-6 text-[#8B4513]" />
              </div>
              <h3 className="font-semibold text-[#8B4513] text-lg mb-2">{t('whyPoppa.features.freeStart.title')}</h3>
              <p className="text-[#5D4037]/70 text-sm leading-relaxed">{t('whyPoppa.features.freeStart.description')}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Languages Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <Card className="bg-white/60 backdrop-blur-sm shadow-sm border-0 rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#8B4513] mb-2">{t('languagesSection.title')}</h2>
                <p className="text-[#5D4037]/70">50+ languages to explore</p>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {featuredLanguages.map((lang) => {
                  const FlagIcon = lang.icon;
                  return (
                    <div
                      key={lang.name}
                      className="flex flex-col items-center p-3 rounded-xl hover:bg-[#8B4513]/5 transition-colors duration-300 group cursor-pointer"
                    >
                      <FlagIcon className="w-8 h-6 mb-2 transition-transform duration-300 group-hover:scale-110" />
                      <span className="text-sm text-[#5D4037]/80 group-hover:text-[#8B4513] transition-colors duration-300 text-center">
                        {tCommon(`languages.${lang.iso639}`)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="text-center mt-8">
                <Button asChild variant="outline" className="text-[#8B4513] border-[#8B4513]/30 hover:bg-[#8B4513]/10 rounded-full px-6">
                  <Link href="/signup">
                    View all 50+ languages
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          className="text-center mt-16 py-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-[#8B4513] mb-4">Ready to start learning?</h2>
          <p className="text-[#5D4037]/70 mb-8 max-w-xl mx-auto">
            Join thousands of learners discovering the joy of conversational language learning.
          </p>
          <Button asChild className="bg-[#8B4513] hover:bg-[#6D3611] text-white rounded-full px-10 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <Link href="/signup">
              Get started for free
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      <Footer />
    </div>
  );
}
