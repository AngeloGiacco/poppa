"use client"

import './globals.css';
import { Inter } from 'next/font/google';
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import * as CountryFlags from 'country-flag-icons/react/3x2'
import {languages} from '@/lib/supportedLanguages';
import { useState } from 'react';
import { X } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  return (
    // Replace the outer div with a more refined background
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0]">
      {/* Refined navigation */}
      <div className="absolute top-0 left-0 right-0 px-6 py-4 backdrop-blur-sm bg-[#FFF8E1]/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.nav className="flex space-x-6">
            <Button variant="ghost" asChild className="text-[#8B4513] hover:bg-transparent hover:text-[#6D3611] transition-colors duration-300">
              <Link href="/pricing">Pricing</Link>
            </Button>
            <Button variant="ghost" asChild className="text-[#8B4513] hover:bg-transparent hover:text-[#6D3611] transition-colors duration-300">
              <Link href="/how-it-works">How it works</Link>
            </Button>
          </motion.nav>
          
          <motion.nav className="flex space-x-4">
            <Button variant="ghost" asChild className="text-[#8B4513] hover:bg-transparent hover:text-[#6D3611]">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild className="bg-[#8B4513] text-white hover:bg-[#6D3611] rounded-full px-6">
              <Link href="/signup">Get started</Link>
            </Button>
          </motion.nav>
        </div>
      </div>

      {/* Main content */}
      <motion.div className="max-w-7xl mx-auto px-6 pt-32 pb-16">
        <motion.header className="text-center max-w-3xl mx-auto mb-20">
          {showAnnouncement && (
            <motion.div className="mb-8">
              <Link href="/founder-message" 
                className="inline-flex items-center space-x-2 bg-[#8B4513]/10 text-[#8B4513] px-4 py-2 rounded-full text-sm hover:bg-[#8B4513]/15 transition-colors duration-300">
                <span>✨ We're live!</span>
                <span className="font-medium">Read our founder's message →</span>
              </Link>
            </motion.div>
          )}
          
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
          <h1 className="text-5xl sm:tsext-6xl font-bold text-[#8B4513] tracking-tight mb-6">
            Learn languages naturally
          </h1>
          <p className="text-xl text-[#5D4037]/80 leading-relaxed">
            poppa guides you step by step through learning a new language with voice-only tutoring
          </p>
        </motion.header>

        {/* Refined cards layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div className="space-y-6">
            <Card className="bg-white/50 backdrop-blur-sm shadow-sm border-0 rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold text-[#8B4513] mb-4">Languages we speak</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {languages.map((lang) => {
                    const FlagIcon = CountryFlags[lang.code as keyof typeof CountryFlags];
                    return (
                      <div key={lang.code} className="flex items-center space-x-3 group">
                        <FlagIcon className="w-6 h-4 transition-transform duration-300 group-hover:scale-110" />
                        <span className="text-[#5D4037]/80 group-hover:text-[#8B4513] transition-colors duration-300">
                          {lang.name}
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
                  <h2 className="text-2xl font-semibold text-[#8B4513] mb-6">Why Poppa?</h2>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-full bg-[#8B4513]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[#8B4513]">🎓</span>
                      </div>
                      <div>
                          <h3 className="font-medium text-[#8B4513] mb-1 group-hover:underline">Tutoring from zero</h3>
                          <p className="text-[#5D4037]/80">This isn't just roleplays, we teach you in your native language how to think in any new language. <Link href="/how-it-works" className="text-[#8B4513] hover:underline">Learn more →</Link></p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-full bg-[#8B4513]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[#8B4513]">🎯</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-[#8B4513] mb-1">Personalized Learning</h3>
                        <p className="text-[#5D4037]/80">We match your pace and interests to help you improve over time.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-full bg-[#8B4513]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[#8B4513]">🎁</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-[#8B4513] mb-1">Start for Free</h3>
                        <p className="text-[#5D4037]/80">Get 20 minutes of free credits to try Poppa. No credit card required to begin your language learning journey.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <Button asChild size="lg" 
                      className="w-full bg-[#8B4513] hover:bg-[#6D3611] text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                      <Link href="/signup">Try 20 minutes free</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Refined footer */}
      <motion.footer className="border-t border-[#8B4513]/10 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-[#5D4037]/60">
          <p className="text-sm">© {new Date().getFullYear()} Poppa. Crafted with care by Naxos Labs.</p>
        </div>
      </motion.footer>
    </div>
  );
}
