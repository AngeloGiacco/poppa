'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Footer } from '@/components/Footer';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Check, Mic, Clock, Sparkles, TrendingUp, MessageCircle, BookOpen } from 'lucide-react';

const PricingPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const t = useTranslations('PricingPage');

  const handleSubscribe = async (priceId?: string) => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (!priceId) {
      console.error('Stripe Price ID is not defined for this plan.');
      alert(t('error.missingPriceId'));
      return;
    }

    try {
      const response = await fetch('/api/stripe/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price_id: priceId, user_id: user.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('error.checkoutFailed'));
      }

      const { url } = await response.json();
      if (url) {
        router.push(url);
      } else {
        throw new Error(t('error.checkoutUrlMissing'));
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert((error as Error).message);
    }
  };

  const features = [
    { icon: Mic, label: t('features.aiTutor') },
    { icon: Clock, label: t('features.availability') },
    { icon: Sparkles, label: t('features.adaptiveLearning') },
    { icon: TrendingUp, label: t('features.progressTracking') },
    { icon: MessageCircle, label: t('features.conversation') },
    { icon: BookOpen, label: t('features.exercises') },
  ];

  const plans = [
    {
      id: 'hobby',
      name: 'Hobby',
      price: '$9',
      period: '/month',
      credits: '60',
      description: 'Perfect for casual learners',
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_HOBBY,
      popular: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$29',
      period: '/month',
      credits: '240',
      description: 'For dedicated language enthusiasts',
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO,
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0]">
      {/* Navigation */}
      <div className="absolute top-0 left-0 right-0 px-4 sm:px-6 py-4 backdrop-blur-sm bg-[#FFF8E1]/50 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <nav className="flex space-x-4 sm:space-x-6">
            <Button asChild variant="ghost" className="text-sm sm:text-base text-[#8B4513] hover:bg-transparent hover:text-[#6D3611] transition-colors duration-300">
              <Link href="/">{t('navigation.home')}</Link>
            </Button>
            <Button asChild variant="ghost" className="text-sm sm:text-base text-[#8B4513] hover:bg-transparent hover:text-[#6D3611] transition-colors duration-300">
              <Link href="/how-it-works">{t('navigation.howItWorks')}</Link>
            </Button>
          </nav>

          <nav className="flex items-center space-x-2 sm:space-x-4">
            <LanguageSelector />
            <Button asChild variant="ghost" className="text-sm sm:text-base text-[#8B4513] hover:bg-transparent hover:text-[#6D3611]">
              <Link href="/login">{t('navigation.login')}</Link>
            </Button>
            <Button asChild className="text-sm sm:text-base bg-[#8B4513] text-white hover:bg-[#6D3611] rounded-full px-4 sm:px-6">
              <Link href="/signup">{t('navigation.getStarted')}</Link>
            </Button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 pt-32 sm:pt-28 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#8B4513] tracking-tight mb-4">
            {t('hero.title')}
          </h1>
          <p className="text-lg sm:text-xl text-[#5D4037]/80 max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16 max-w-3xl mx-auto">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="flex items-center gap-3 p-3 bg-white/50 rounded-xl backdrop-blur-sm">
                <div className="w-10 h-10 rounded-full bg-[#8B4513]/10 flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-5 h-5 text-[#8B4513]" />
                </div>
                <span className="text-sm text-[#5D4037] font-medium">{feature.label}</span>
              </div>
            );
          })}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl ${
                plan.popular ? 'ring-2 ring-[#8B4513]' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-4 right-4">
                  <span className="bg-[#8B4513] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-[#8B4513]">{plan.name}</CardTitle>
                <p className="text-[#5D4037]/70 text-sm">{plan.description}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-[#8B4513]">{plan.price}</span>
                  <span className="text-[#5D4037]/70">{plan.period}</span>
                </div>

                <div className="bg-[#8B4513]/5 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#8B4513]" />
                    <span className="text-[#5D4037] font-medium">{plan.credits} minutes of tutoring</span>
                  </div>
                </div>

                <ul className="space-y-3">
                  {features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-[#5D4037]">
                      <Check className="w-5 h-5 text-[#8B4513] flex-shrink-0" />
                      <span className="text-sm">{feature.label}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSubscribe(plan.stripePriceId)}
                  disabled={!plan.stripePriceId}
                  className={`w-full rounded-full py-6 text-lg font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-[#8B4513] hover:bg-[#6D3611] text-white shadow-lg hover:shadow-xl'
                      : 'bg-[#8B4513]/10 hover:bg-[#8B4513]/20 text-[#8B4513]'
                  }`}
                >
                  Get Started
                </Button>

                {!plan.stripePriceId && (
                  <p className="text-xs text-red-500 text-center">
                    Plan not available
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Free Trial CTA */}
        <div className="text-center bg-white/50 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-[#8B4513] mb-2">{t('cta.startFree')}</h3>
          <p className="text-[#5D4037]/70 mb-6">{t('cta.noCard')}</p>
          <Button asChild className="bg-[#8B4513] hover:bg-[#6D3611] text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <Link href="/signup">Start Learning Now</Link>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PricingPage;
