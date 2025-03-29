"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { motion } from "framer-motion"
import { Check as LucideCheck } from "lucide-react"

export default function SignupSuccess() {
  const t = useTranslations('SignupSuccess')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-md w-full bg-white/50 backdrop-blur-sm shadow-lg border-0">
          <CardContent className="p-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <LucideCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-[#8B4513] mb-4">
              {t('title')}
            </h1>
            
            <p className="text-[#5D4037]/80 mb-8">
              {t('description')}
            </p>

            <Button
              asChild
              className="w-full bg-[#8B4513] hover:bg-[#6D3611] text-white"
            >
              <Link href="/login">
                {t('backToLogin')}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
