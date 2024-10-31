"use client"

import { motion } from "framer-motion";
import dynamic from 'next/dynamic';
import { Link } from '@/i18n/routing';
import { Footer } from "@/components/Footer";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/i18n/routing';

const LoginForm = dynamic(() => import('@/components/LoginForm'), { ssr: false });

export default function Login() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const t = useTranslations('LoginPage');

  useEffect(() => {
    if (user && !isLoading) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>; // Replace with your loading component
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0] relative`}>
      <div className="absolute top-0 left-0 right-0 px-6 py-4 backdrop-blur-sm bg-[#FFF8E1]/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-[#8B4513] hover:text-[#6D3611] transition-colors duration-300 flex items-center gap-2">
            <span>←</span> {t('navigation.backToHome')}
          </Link>
          <Link href="/signup" className="text-[#8B4513] hover:text-[#6D3611] transition-colors duration-300 font-medium">
            {t('navigation.signup')}
          </Link>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Image
              className="w-16 h-16 rounded-2xl shadow-lg"
              src="/logo.svg"
              alt={t('logo.alt')}
              width={64}
              height={64}
              priority
            />
            <span className="text-3xl font-bold text-[#8B4513]">poppa</span>
          </div>
          <h1 className="text-4xl font-bold text-[#8B4513] mb-2">{t('title')}</h1>
          <p className="text-lg text-[#5D4037]/80">{t('subtitle')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-8">
            <LoginForm />
          </div>
        </motion.div>
      </div>

      <Footer className="absolute bottom-0 w-full" />
    </div>
  );
}
