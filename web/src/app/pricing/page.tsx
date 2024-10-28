"use client"

import { Inter } from 'next/font/google';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const inter = Inter({ subsets: ['latin'] });

export default function Pricing() {
  const [hoursPerMonth, setHoursPerMonth] = useState(10);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const poppaPrice = 15;
  const humanTutorPrice = 50;

  const plans = {
    monthly: { credits: 100, price: 25, savings: 0 },
    quarterly: { credits: 350, price: 80, savings: 7.5 },
    yearly: { credits: 1500, price: 300, savings: 25 },
  };

  const features = [
    "Personalized AI language tutor",
    "24/7 availability",
    "Adaptive learning technology",
    "Progress tracking",
    "Conversation practice",
    "Grammar and vocabulary exercises",
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0] ${inter.className}`}>
      {/* Refined navigation */}
      <div className="absolute top-0 left-0 right-0 px-6 py-4 backdrop-blur-sm bg-[#FFF8E1]/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.nav className="flex space-x-6">
            <Button variant="ghost" asChild className="text-[#8B4513] hover:bg-transparent hover:text-[#6D3611] transition-colors duration-300">
              <Link href="/">Home</Link>
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

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-16">
        {/* Header section */}
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
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
          <h1 className="text-5xl sm:text-6xl font-bold text-[#8B4513] tracking-tight mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-[#5D4037]/80 leading-relaxed">
            Start with 20 free minutes. Then choose the plan that works best for you.
          </p>
        </motion.header>

        {/* Plans section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <h2 className="text-3xl font-semibold text-[#8B4513] mb-6">Choose Your Plan</h2>
                <Tabs defaultValue="monthly" onValueChange={(value: string) => setSelectedPlan(value)}>
                  <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
                    <TabsTrigger value="yearly">Yearly</TabsTrigger>
                  </TabsList>
                  {Object.entries(plans).map(([key, plan]) => (
                    <TabsContent key={key} value={key} className="mt-0">
                      <div className="bg-[#F5E6D3] text-[#8B4513] p-6 rounded-lg mb-8">
                        <h3 className="text-2xl font-semibold mb-2">{key.charAt(0).toUpperCase() + key.slice(1)} Plan</h3>
                        <p className="text-4xl font-bold mb-2">${plan.price}</p>
                        <p className="text-lg opacity-80">{plan.credits} credits ({plan.credits / 60} hours)</p>
                        {plan.savings > 0 && (
                          <p className="text-lg text-[#4CAF50] font-semibold mt-2">Save {plan.savings}%</p>
                        )}
                      </div>
                      <Button className="w-full bg-[#8B4513] hover:bg-[#6D3611] text-white text-lg py-3 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
                        Get Started
                      </Button>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#8B4513]/5 to-[#8B4513]/10 rounded-3xl transform rotate-3"></div>
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 rounded-2xl relative">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-semibold text-[#8B4513] mb-6">Features</h2>
                  <ul className="space-y-4">
                    {features.map((feature, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-center space-x-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#8B4513]/10 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-[#8B4513]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-[#5D4037]">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Calculator section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 rounded-2xl overflow-hidden mb-20">
            <CardContent className="p-8">
              <h2 className="text-3xl font-semibold text-[#8B4513] mb-6">Calculate Your Savings</h2>
              <p className="text-[#5D4037] mb-4">Slide to select your expected learning hours per month:</p>
              <Slider
                min={1}
                max={50}
                step={1}
                value={[hoursPerMonth]}
                onValueChange={(value) => setHoursPerMonth(value[0])}
                className="mb-6"
              />
              <p className="text-lg text-[#5D4037] mb-4">You plan to learn for <span className="font-bold text-[#8B4513]">{hoursPerMonth} hours</span> per month</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-[#E6F7FF] border-0">
                  <CardContent className="p-4">
                    <h4 className="text-xl font-semibold text-[#0077B6] mb-2">With Poppa</h4>
                    <p className="text-3xl font-bold text-[#0077B6]">${poppaPrice * hoursPerMonth}</p>
                    <p className="text-[#5D4037]">per month</p>
                  </CardContent>
                </Card>
                <Card className="bg-[#FFF0F0] border-0">
                  <CardContent className="p-4">
                    <h4 className="text-xl font-semibold text-[#D32F2F] mb-2">With a Human Tutor</h4>
                    <p className="text-3xl font-bold text-[#D32F2F]">${humanTutorPrice * hoursPerMonth}</p>
                    <p className="text-[#5D4037]">per month</p>
                  </CardContent>
                </Card>
                <Card className="bg-[#E8F5E9] border-0">
                  <CardContent className="p-4">
                    <h4 className="text-xl font-semibold text-[#4CAF50] mb-2">Your Savings</h4>
                    <p className="text-3xl font-bold text-[#4CAF50]">${(humanTutorPrice - poppaPrice) * hoursPerMonth}</p>
                    <p className="text-[#5D4037]">per month</p>
                  </CardContent>
                </Card>
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
          <Button asChild className="bg-[#8B4513] hover:bg-[#6D3611] text-white text-xl px-10 py-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl">
            <Link href="/signup">Start with 20 free minutes</Link>
          </Button>
          <p className="mt-8 text-lg text-[#5D4037]/80">
            No credit card required. Cancel anytime.
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer className="border-t border-[#8B4513]/10 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-[#5D4037]/60">
          <p className="text-sm">© {new Date().getFullYear()} Poppa. Crafted with care by Naxos Labs.</p>
        </div>
      </motion.footer>
    </div>
  );
}
