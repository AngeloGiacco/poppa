"use client"

import Image from "next/image";
import { Link } from '@/i18n/routing';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from 'next-intl';
import { Footer } from '@/components/Footer';


export default function FounderMessage() {
  const t = useTranslations('FounderMessagePage');

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0]`}>
      {/* Navigation */}
      <div className="absolute top-0 left-0 right-0 px-6 py-4 backdrop-blur-sm bg-[#FFF8E1]/50">
        <Button variant="ghost" asChild className="text-[#8B4513] hover:bg-transparent hover:text-[#6D3611] transition-colors duration-300">
          <Link href="/">{t('navigation.backToHome')}</Link>
        </Button>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex-grow max-w-4xl mx-auto px-6 pt-32 pb-16"
      >
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <Image
              className="w-16 h-16 rounded-2xl shadow-lg"
              src="/logo.svg"
              alt="Poppa logo"
              width={64}
              height={64}
              priority
            />
            <h1 className="text-3xl sm:text-5xl font-bold text-[#8B4513]">
              poppa
            </h1>
          </div>
          <p className="text-xl text-[#5D4037]/80">
            {t('header.subtitle')}
          </p>
        </motion.header>

        {/* Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#8B4513]/5 to-[#8B4513]/10 rounded-3xl transform rotate-1"></div>
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 rounded-2xl relative">
            <CardContent className="p-8 space-y-6 text-[#5D4037] text-lg">
              <h2 className="text-2xl font-semibold text-[#8B4513]">{t('content.greeting')}</h2>
              <p>{t('content.welcome')}</p>
              <p>{t('content.background')}</p>
              <p>{t('content.philosophy')}</p>
              <p>{t('content.approach')}</p>
              <p>{t('content.story')}</p>
              <p className="font-semibold">{t('content.closing')}</p>
              <p className="font-semibold">{t('content.signature')}</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <Footer className="mt-8" />
    </div>
  );
}
