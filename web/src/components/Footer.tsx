"use client"

import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const t = useTranslations('common');
  const year = 2024;

  return (
    <motion.footer className={`border-t border-[#8B4513]/10 bg-white/50 backdrop-blur-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 text-center text-[#5D4037]/60">
        <p className="text-sm">
          {t('footer.copyright', { year })}
        </p>
      </div>
    </motion.footer>
  );
} 