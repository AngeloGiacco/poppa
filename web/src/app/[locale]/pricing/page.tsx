"use client"

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from '@/i18n/routing';
import { Footer } from "@/components/Footer"

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function Pricing() {
  const t = useTranslations('PricingPage');
  const [hoursPerMonth, setHoursPerMonth] = useState(10);
  const [currentYear, setCurrentYear] = useState(2024);
  const poppaPrice = 15;
  const humanTutorPrice = 50;

  const features = [
    t('features.aiTutor'),
    t('features.availability'),
    t('features.adaptiveLearning'),
    t('features.progressTracking'),
    t('features.conversation'),
    t('features.exercises'),
  ];

  const springTransition = {
    type: "spring",
    stiffness: 100,
    damping: 15
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0]`}>
      {/* Navigation */}
      <div className="absolute top-0 left-0 right-0 px-6 py-4 backdrop-blur-sm bg-[#FFF8E1]/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.nav className="flex space-x-6">
            <Button variant="ghost" asChild className="text-[#8B4513] hover:bg-transparent hover:text-[#6D3611] transition-colors duration-300">
              <Link href="/">{t('navigation.home')}</Link>
            </Button>
            <Button variant="ghost" asChild className="text-[#8B4513] hover:bg-transparent hover:text-[#6D3611] transition-colors duration-300">
              <Link href="/how-it-works">{t('navigation.howItWorks')}</Link>
            </Button>
          </motion.nav>
          
          <motion.nav className="flex space-x-4">
            <Button variant="ghost" asChild className="text-[#8B4513] hover:bg-transparent hover:text-[#6D3611]">
              <Link href="/login">{t('navigation.login')}</Link>
            </Button>
            <Button asChild className="bg-[#8B4513] text-white hover:bg-[#6D3611] rounded-full px-6">
              <Link href="/signup">{t('navigation.getStarted')}</Link>
            </Button>
          </motion.nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-16">
        {/* Header */}
        <motion.header className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl font-bold text-[#8B4513] tracking-tight mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-xl text-[#5D4037]/80">
            {t('hero.subtitle')}
          </p>
        </motion.header>

        {/* Simplified pricing card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto mb-20"
        >
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0 rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-[#8B4513]">$15</h2>
                <p className="text-[#5D4037]/80 mt-2">{t('pricing.perHour')}</p>
              </div>

              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-[#8B4513]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-[#5D4037]">{feature}</span>
                  </div>
                ))}
              </div>

              <Button asChild className="w-full bg-[#8B4513] hover:bg-[#6D3611] text-white text-lg py-6 rounded-full">
                <Link href="/signup">{t('cta.startFree')}</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Simplified calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 rounded-2xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-[#8B4513] mb-6">{t('calculator.title')}</h2>
              
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-[#5D4037]">{t('calculator.hoursPerMonth')}</p>
                  <p className="text-xl font-semibold text-[#8B4513]">{hoursPerMonth}h</p>
                </div>
                
                <input
                  type="range"
                  min="0.5"
                  max="20"
                  step="0.5"
                  value={hoursPerMonth}
                  onChange={(e) => setHoursPerMonth(parseFloat(e.target.value))}
                  className="w-full h-2 bg-[#8B4513] rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 rounded-xl bg-[#8B4513]/5">
                  <p className="text-[#8B4513] mb-2">{t('calculator.poppaAI')}</p>
                  <p className="text-3xl font-bold text-[#8B4513]">${(poppaPrice * hoursPerMonth).toFixed(2)}</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-[#8B4513]/5">
                  <p className="text-[#8B4513] mb-2">{t('calculator.traditionalTutor')}</p>
                  <p className="text-3xl font-bold text-[#8B4513]">${humanTutorPrice * hoursPerMonth}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <Button asChild className="mt-3 bg-[#8B4513] hover:bg-[#6D3611] text-white text-xl px-10 py-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl">
            <Link href="/signup">{t('cta.startFree')}</Link>
          </Button>
          <p className="mt-8 text-lg text-[#5D4037]/80">
            {t('cta.noCard')}
          </p>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
