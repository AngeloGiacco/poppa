"use client"

import { Inter } from 'next/font/google';
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const inter = Inter({ subsets: ['latin'] });

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0]">
      {/* Enhanced navigation with max-width container */}
      <div className="absolute top-0 left-0 right-0 px-6 py-4 backdrop-blur-sm bg-[#FFF8E1]/50 z-50">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" asChild className="text-[#8B4513] hover:bg-transparent hover:text-[#6D3611] transition-colors duration-300">
            <Link href="/">← Back to Home</Link>
          </Button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-6 pt-32 pb-16"
      >
        {/* Enhanced header with announcement banner */}
        <motion.header className="text-center max-w-3xl mx-auto mb-20">
          <motion.div className="mb-8">
            <Link href="/github" 
              className="inline-flex items-center space-x-2 bg-[#8B4513]/10 text-[#8B4513] px-4 py-2 rounded-full text-sm hover:bg-[#8B4513]/15 transition-colors duration-300">
              <span>🌟 We're open source!</span>
              <span className="font-medium">Check us out on GitHub →</span>
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
          <h1 className="text-3xl sm:text-6xl font-bold text-[#8B4513] tracking-tight mb-6">How poppa works</h1>
        </motion.header>

        {/* Enhanced cards with icons and better spacing */}
        <div className="space-y-12">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 rounded-2xl hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#8B4513]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🧠</span>
                </div>
                <h2 className="text-2xl font-semibold text-[#8B4513]">The Thinking Method</h2>
              </div>
              <p className="text-[#5D4037] mb-4">
                Poppa uses a unique approach called the "Thinking Method" to help you learn languages naturally and effectively. Instead of memorizing vocabulary lists or grammar rules, you'll learn to think in your target language from the very beginning.
              </p>
              <p className="text-[#5D4037]">
                This method focuses on understanding the structure of the language, making connections, and building your ability to construct sentences intuitively. It's a gentle yet powerful approach that mimics how we naturally acquire languages.
              </p>
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
                  <h2 className="text-2xl font-semibold text-[#8B4513]">The Tech</h2>
                </div>
                <p className="text-[#5D4037] mb-4">
                  To help you practice conversations with an AI tutor that responds to your voice in real-time, we use OpenAI's models to understand and respond to what you say, store complete conversation histories in the cloud, and have servers distributed globally to offer low latency communication with our product.
                </p>
                <p className="text-[#5D4037]">
                  🌟 We believe in open source. Poppa is fully open source so if you don't want to pay us a cent you don't have to. If instead, you don't want to have the hassle of managing servers for low-latency voice communications, we do offer a paid service through this website. Check us out on github. {/* TODO: Add github link */}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 rounded-2xl hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#8B4513]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎯</span>
                </div>
                <h2 className="text-2xl font-semibold text-[#8B4513]">The End Result: Personalized Learning</h2>
              </div>
              <p className="text-[#5D4037] mb-4">
                Every lesson you take with Poppa is transcribed and stored, creating a comprehensive record of your learning journey. This allows us to:
              </p>
              <ul className="list-disc list-inside text-[#5D4037] mb-4">
                <li>Track your progress and tailor future lessons to your needs</li>
                <li>Implement spaced repetition to reinforce what you've learned</li>
                <li>Provide you with a step-by-step path to language mastery</li>
              </ul>
              <p className="text-[#5D4037]">
                Your personalized learning path evolves with you, ensuring that you're always challenged at the right level and revisiting important concepts at optimal intervals for retention.
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Footer remains the same */}
      <motion.footer className="border-t border-[#8B4513]/10 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-[#5D4037]/60">
          <p className="text-sm">© {new Date().getFullYear()} Poppa. Crafted with care by Naxos Labs.</p>
        </div>
      </motion.footer>
    </div>
  );
}
