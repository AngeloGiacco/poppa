"use client"

import { Inter } from 'next/font/google';
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const inter = Inter({ subsets: ['latin'] });

export default function FounderMessage() {
  return (
    // Replace basic background with gradient
    <div className={`min-h-screen bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0] ${inter.className}`}>
      {/* Refined navigation with backdrop blur */}
      <div className="absolute top-0 left-0 right-0 px-6 py-4 backdrop-blur-sm bg-[#FFF8E1]/50">
        <Button variant="ghost" asChild className="text-[#8B4513] hover:bg-transparent hover:text-[#6D3611] transition-colors duration-300">
          <Link href="/">← Back to Home</Link>
        </Button>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto px-6 pt-32 pb-16"
      >
        {/* Refined header */}
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
            A message from the founder
          </p>
        </motion.header>

        {/* Refined card with subtle rotation and gradient */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#8B4513]/5 to-[#8B4513]/10 rounded-3xl transform rotate-1"></div>
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 rounded-2xl relative">
            <CardContent className="p-8 space-y-6 text-[#5D4037] text-lg">
              <h2 className="text-2xl font-semibold text-[#8B4513]">Hi 👋</h2>
              <p>Welcome to Poppa. We want to make 1-on-1 language tutoring accessible to everyone.</p>
              <p>I was immensely lucky that my circumstances (living in Budapest, and then going to a great school in the UK) allowed me to get 1-1 language tutoring in Chinese and Russian. Learning these languages has in many ways changed the trajectory of my life.</p>
              <p>Language learning should be affordable and flexible, which is why we've implemented a credit-based system that lets you learn at your own pace and budget. Whether you have 5 minutes or 5 hours, Poppa is here to support your language learning journey.</p>
              <p>We don't make you write out words, or memorise useless grammar rules or phrases. We'll help you to think in another language. Please try it out. I think you'll like it and the first lesson is on us anyway.</p>
              <p>I learnt Mandarin because my grandfather, who I called poppa, worked in Beijing for many years and he made me promise him that I'd learn it. That's had a huge impact on my life and I hope poppa can have an impact on you too :)</p>
              <p className="font-semibold">Happy learning!</p>
              <p className="font-semibold">Angelo</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Refined footer */}
        <motion.footer 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-8 text-center text-[#5D4037]/60"
        >
          <p className="text-sm">© {new Date().getFullYear()} Poppa. Crafted with care by Naxos Labs.</p>
        </motion.footer>
      </motion.div>
    </div>
  );
}
