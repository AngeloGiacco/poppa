"use client"

import { Inter } from 'next/font/google';
import { motion } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';
import SignupForm from '@/components/SignupForm';

const inter = Inter({ subsets: ['latin'] });

export default function SignUp() {
  return (
    <div className={`min-h-screen bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0] ${inter.className} relative`}>
      {/* Refined navigation */}
      <div className="absolute top-0 left-0 right-0 px-6 py-4 backdrop-blur-sm bg-[#FFF8E1]/50">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="text-[#8B4513] hover:text-[#6D3611] transition-colors duration-300 flex items-center gap-2">
            <span>←</span> Back to Home
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
              alt="Poppa logo"
              width={64}
              height={64}
              priority
            />
            <span className="text-3xl font-bold text-[#8B4513]">poppa</span>
          </div>
          <p className="text-lg text-[#5D4037]/80">Start your language learning journey today!</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-8">
            <SignupForm />
          </div>
        </motion.div>
      </div>

      {/* Matching footer */}
      <motion.footer className="border-t border-[#8B4513]/10 bg-white/50 backdrop-blur-sm absolute bottom-0 w-full">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-[#5D4037]/60">
          <p className="text-sm">© {new Date().getFullYear()} Poppa. Crafted with care by Naxos Labs.</p>
        </div>
      </motion.footer>
    </div>
  );
}
