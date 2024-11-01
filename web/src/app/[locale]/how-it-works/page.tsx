"use client"

import { Link } from '@/i18n/routing';
import { Footer } from '@/components/Footer';
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from 'next-intl';

export default function HowItWorks() {
  const t = useTranslations('HowItWorksPage');
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0]">
      {/* Navigation */}
      <div className="absolute top-0 left-0 right-0 px-6 py-4 backdrop-blur-sm bg-[#FFF8E1]/50 z-50">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" asChild className="text-[#8B4513] hover:bg-transparent hover:text-[#6D3611] transition-colors duration-300">
            <Link href="/">{t('navigation.backToHome')}</Link>
          </Button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex-grow max-w-7xl mx-auto px-6 pt-32 pb-16"
      >
        {/* Header */}
        <motion.header className="text-center max-w-3xl mx-auto mb-20">
          <motion.div className="mb-8">
            <Link href="https://github.com/AngeloGiacco/poppa" 
              className="inline-flex items-center space-x-2 bg-[#8B4513]/10 text-[#8B4513] px-4 py-2 rounded-full text-sm hover:bg-[#8B4513]/15 transition-colors duration-300">
              <span>{t('header.openSource.badge')}</span>
              <span className="font-medium">{t('header.openSource.link')}</span>
            </Link>
          </motion.div>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Image
                className="w-16 h-16 rounded-2xl shadow-lg"
                src="/logo.svg"
                alt="Poppa logo"
                width={64}
                height={64}
                priority
              />
              <span className="text-3xl font-bold text-[#8B4513]">poppa</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-6xl font-bold text-[#8B4513] tracking-tight mb-6">
            {t('header.title')}
          </h1>
        </motion.header>

        {/* Cards */}
        <div className="space-y-12">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 rounded-2xl hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#8B4513]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🧠</span>
                </div>
                <h2 className="text-2xl font-semibold text-[#8B4513]">{t('sections.thinkingMethod.title')}</h2>
              </div>
              <p className="text-[#5D4037] mb-4">{t('sections.thinkingMethod.description1')}</p>
              <p className="text-[#5D4037]">{t('sections.thinkingMethod.description2')}</p>
            </CardContent>
          </Card>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#8B4513]/5 to-[#8B4513]/10 rounded-3xl transform rotate-2"></div>
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 rounded-2xl relative hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#8B4513]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h2 className="text-2xl font-semibold text-[#8B4513]">{t('sections.tech.title')}</h2>
                </div>
                <p className="text-[#5D4037] mb-4">{t('sections.tech.description1')}</p>
                <p className="text-[#5D4037]">{t('sections.tech.description2')}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 rounded-2xl hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#8B4513]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎯</span>
                </div>
                <h2 className="text-2xl font-semibold text-[#8B4513]">{t('sections.personalizedLearning.title')}</h2>
              </div>
              <p className="text-[#5D4037] mb-4">{t('sections.personalizedLearning.description1')}</p>
              <ul className="list-disc list-inside text-[#5D4037] mb-4">
                <li>{t('sections.personalizedLearning.benefits.0')}</li>
                <li>{t('sections.personalizedLearning.benefits.1')}</li>
                <li>{t('sections.personalizedLearning.benefits.2')}</li>
              </ul>
              <p className="text-[#5D4037]">{t('sections.personalizedLearning.description2')}</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}
