"use client"

import { motion } from "framer-motion";
import dynamic from 'next/dynamic';
import { Link } from '@/i18n/routing';
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
    // Replace basic background with gradient
    <div className={`min-h-screen bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0]`}>
      <div className="max-w-md mx-auto px-4 py-16 relative">
        {/* Enhanced back button */}
        <Button
          variant="ghost"
          asChild
          className="absolute top-4 left-4 text-[#8B4513] hover:bg-transparent hover:text-[#6D3611] transition-colors duration-300"
        >
          <Link href="/">{t('navigation.backToHome')}</Link>
        </Button>
        {/* Enhanced sign up button */}
        <Button
          asChild
          className="absolute top-4 right-4 bg-[#8B4513] text-white hover:bg-[#6D3611] rounded-full px-6 transition-all duration-300"
        >
          <Link href="/signup">{t('navigation.signup')}</Link>
        </Button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          {/* Enhanced logo container */}
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
          <h1 className="text-5xl font-bold text-[#8B4513] tracking-tight mb-4">{t('title')}</h1>
          <p className="text-xl text-[#5D4037]/80 leading-relaxed">
            {t('subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <LoginForm />
        </motion.div>
      </div>
    </div>
  );
}
