# Poppa Growth Strategy Plan

> Principal Growth Engineer's comprehensive plan for analytics, self-serve growth, onboarding improvements, and marketing website enhancements.

---

## Executive Summary

Poppa has a **strong product foundation** (Socratic voice-based language learning) but lacks growth infrastructure. The current model is purely conversion-focused (Landing → Signup → Free Trial → Stripe Checkout) with:

- ❌ Zero analytics/tracking infrastructure
- ❌ Zero viral/referral growth loops
- ❌ No email or community engagement systems
- ❌ No user retention mechanics beyond credit metering
- ❌ Basic onboarding without personalization
- ❌ Static marketing website without social proof

This plan addresses all gaps with prioritized, actionable implementations.

---

## Table of Contents

1. [Analytics & Tracking Infrastructure](#1-analytics--tracking-infrastructure)
2. [Self-Serve Growth Improvements](#2-self-serve-growth-improvements)
3. [Improved Onboarding](#3-improved-onboarding)
4. [Better Marketing Website](#4-better-marketing-website)
5. [Retention & Engagement Systems](#5-retention--engagement-systems)
6. [Implementation Priorities](#6-implementation-priorities)
7. [Database Schema Changes](#7-database-schema-changes)
8. [Success Metrics](#8-success-metrics)

---

## 1. Analytics & Tracking Infrastructure

### 1.1 Core Analytics Platform

**Recommendation: PostHog (Self-Hosted or Cloud)**

PostHog is ideal because:
- Open-source with generous free tier
- Product analytics + session replay + feature flags
- Privacy-friendly (can self-host)
- Easy Next.js integration

**Implementation:**

#### A. Install PostHog

```typescript
// src/lib/analytics/posthog.ts
import posthog from 'posthog-js';

export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
    });
  }
};

export { posthog };
```

#### B. Create Analytics Provider

```typescript
// src/components/providers/AnalyticsProvider.tsx
"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initPostHog, posthog } from '@/lib/analytics/posthog';
import { useAuth } from '@/context/AuthContext';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, userProfile } = useAuth();

  useEffect(() => {
    initPostHog();
  }, []);

  // Identify user when logged in
  useEffect(() => {
    if (user && userProfile) {
      posthog.identify(user.id, {
        email: user.email,
        name: `${userProfile.first_name} ${userProfile.last_name}`,
        native_language: userProfile.native_language,
        credits: userProfile.credits,
        created_at: userProfile.created_at,
      });
    }
  }, [user, userProfile]);

  // Track page views
  useEffect(() => {
    if (pathname) {
      posthog.capture('$pageview', {
        path: pathname,
        search: searchParams?.toString(),
      });
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
}
```

### 1.2 Event Tracking Schema

Define a comprehensive event taxonomy:

#### User Lifecycle Events

| Event | Properties | Trigger |
|-------|------------|---------|
| `user_signed_up` | `native_language`, `signup_source` | After successful signup |
| `user_logged_in` | `method` | After successful login |
| `user_logged_out` | - | After logout |
| `profile_updated` | `fields_changed[]` | After profile update |

#### Lesson Events

| Event | Properties | Trigger |
|-------|------------|---------|
| `lesson_started` | `language`, `lesson_number`, `is_first_lesson` | Conversation connected |
| `lesson_completed` | `language`, `duration_seconds`, `credits_used`, `transcript_length` | Conversation ended |
| `lesson_abandoned` | `language`, `duration_seconds`, `reason` | User disconnects early |
| `lesson_error` | `language`, `error_type`, `error_message` | ElevenLabs/connection error |

#### Conversion Events

| Event | Properties | Trigger |
|-------|------------|---------|
| `pricing_page_viewed` | `from_page`, `credits_remaining` | Pricing page load |
| `checkout_started` | `plan`, `price`, `credits_remaining` | Checkout button clicked |
| `subscription_created` | `plan`, `price`, `credits_granted` | Stripe webhook |
| `subscription_cancelled` | `plan`, `reason` | Stripe webhook |

#### Engagement Events

| Event | Properties | Trigger |
|-------|------------|---------|
| `language_added` | `language`, `total_languages` | User adds new language |
| `language_removed` | `language`, `lessons_completed` | User removes language |
| `credits_depleted` | `last_language`, `total_lessons` | Credits hit 0 |
| `share_clicked` | `platform`, `content_type` | Share button clicked |
| `referral_sent` | `method` | Referral link shared |

### 1.3 Analytics Dashboard Integration

Create an internal analytics hook:

```typescript
// src/hooks/useAnalytics.ts
"use client";

import { useCallback } from 'react';
import { posthog } from '@/lib/analytics/posthog';
import { useAuth } from '@/context/AuthContext';

export function useAnalytics() {
  const { user, userProfile } = useAuth();

  const track = useCallback((event: string, properties?: Record<string, unknown>) => {
    posthog.capture(event, {
      ...properties,
      user_id: user?.id,
      native_language: userProfile?.native_language,
      credits: userProfile?.credits,
      timestamp: new Date().toISOString(),
    });
  }, [user, userProfile]);

  const trackLessonStart = useCallback((language: string, lessonNumber: number) => {
    track('lesson_started', {
      language,
      lesson_number: lessonNumber,
      is_first_lesson: lessonNumber === 1,
    });
  }, [track]);

  const trackLessonComplete = useCallback((
    language: string,
    durationSeconds: number,
    creditsUsed: number
  ) => {
    track('lesson_completed', {
      language,
      duration_seconds: durationSeconds,
      credits_used: creditsUsed,
    });
  }, [track]);

  const trackConversion = useCallback((plan: string, price: number) => {
    track('checkout_started', { plan, price });
  }, [track]);

  return {
    track,
    trackLessonStart,
    trackLessonComplete,
    trackConversion,
  };
}
```

### 1.4 Server-Side Analytics

Track server-side events via PostHog Node client:

```typescript
// src/lib/analytics/posthog-server.ts
import { PostHog } from 'posthog-node';

const posthogServer = new PostHog(
  process.env.POSTHOG_API_KEY!,
  { host: process.env.POSTHOG_HOST }
);

export const serverTrack = (
  userId: string,
  event: string,
  properties?: Record<string, unknown>
) => {
  posthogServer.capture({
    distinctId: userId,
    event,
    properties,
  });
};

export { posthogServer };
```

Use in webhooks:

```typescript
// In Stripe webhook handler
serverTrack(userId, 'subscription_created', {
  plan: priceId === hobbyPriceId ? 'hobby' : 'pro',
  price: priceId === hobbyPriceId ? 9 : 29,
  stripe_subscription_id: subscriptionId,
});
```

### 1.5 Revenue Analytics

Track MRR and revenue metrics:

```typescript
// src/lib/analytics/revenue.ts
export const PLAN_PRICES = {
  hobby: 9,
  pro: 29,
} as const;

export const trackRevenue = (
  userId: string,
  plan: 'hobby' | 'pro',
  event: 'subscription_created' | 'subscription_renewed' | 'subscription_cancelled'
) => {
  const price = PLAN_PRICES[plan];

  serverTrack(userId, event, {
    plan,
    price,
    currency: 'USD',
    mrr_impact: event === 'subscription_cancelled' ? -price : price,
  });
};
```

---

## 2. Self-Serve Growth Improvements

### 2.1 Referral System

**Goal**: Users invite friends → both get bonus credits

#### Database Schema

```sql
-- Migration: create_referrals_table.sql
CREATE TABLE referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES users(id) NOT NULL,
  referred_id UUID REFERENCES users(id),
  referral_code VARCHAR(12) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, completed, credited
  credits_awarded_referrer INT DEFAULT 0,
  credits_awarded_referred INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Add referral_code to users table
ALTER TABLE users ADD COLUMN referral_code VARCHAR(12) UNIQUE;
ALTER TABLE users ADD COLUMN referred_by UUID REFERENCES users(id);

-- Index for fast lookups
CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_code ON referrals(referral_code);
```

#### Referral Code Generation

```typescript
// src/lib/referral.ts
import { customAlphabet } from 'nanoid';

const generateCode = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 8);

export const createReferralCode = (firstName: string): string => {
  const prefix = firstName.slice(0, 3).toUpperCase();
  const suffix = generateCode().slice(0, 5);
  return `${prefix}-${suffix}`;
};
```

#### Referral Dashboard Component

```typescript
// src/components/referral/ReferralCard.tsx
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Share2, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTranslations } from 'next-intl';

export function ReferralCard() {
  const t = useTranslations('Referral');
  const { userProfile } = useAuth();
  const [copied, setCopied] = useState(false);

  const referralLink = `${process.env.NEXT_PUBLIC_APP_URL}/signup?ref=${userProfile?.referral_code}`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareNative = async () => {
    if (navigator.share) {
      await navigator.share({
        title: t('shareTitle'),
        text: t('shareText'),
        url: referralLink,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          {t('title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {t('description', { credits: 10 })}
        </p>

        <div className="flex items-center gap-2">
          <code className="flex-1 rounded bg-muted px-3 py-2 text-sm">
            {userProfile?.referral_code}
          </code>
          <Button variant="outline" size="icon" onClick={copyToClipboard}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex gap-2">
          <Button onClick={copyToClipboard} className="flex-1">
            {t('copyLink')}
          </Button>
          {typeof navigator !== 'undefined' && navigator.share && (
            <Button variant="outline" onClick={shareNative}>
              <Share2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          {t('referralCount', { count: userProfile?.referral_count || 0 })}
        </p>
      </CardContent>
    </Card>
  );
}
```

#### Referral Processing API

```typescript
// src/app/api/referral/process/route.ts
import { NextRequest, NextResponse } from 'next/server';
import supabaseClient from '@/lib/supabase';
import { serverTrack } from '@/lib/analytics/posthog-server';

const REFERRAL_CREDITS = 10; // 10 minutes bonus for both

export async function POST(req: NextRequest) {
  const { referralCode, newUserId } = await req.json();

  // Find referrer
  const { data: referrer } = await supabaseClient
    .from('users')
    .select('id, credits')
    .eq('referral_code', referralCode)
    .single();

  if (!referrer) {
    return NextResponse.json({ error: 'Invalid referral code' }, { status: 400 });
  }

  // Update referral record
  const { error: referralError } = await supabaseClient
    .from('referrals')
    .update({
      referred_id: newUserId,
      status: 'completed',
      credits_awarded_referrer: REFERRAL_CREDITS,
      credits_awarded_referred: REFERRAL_CREDITS,
      completed_at: new Date().toISOString(),
    })
    .eq('referral_code', referralCode)
    .eq('status', 'pending');

  if (referralError) {
    return NextResponse.json({ error: 'Referral processing failed' }, { status: 500 });
  }

  // Credit both users
  await Promise.all([
    supabaseClient.rpc('increment_credits', {
      increment_amount: REFERRAL_CREDITS,
      user_id: referrer.id
    }),
    supabaseClient.rpc('increment_credits', {
      increment_amount: REFERRAL_CREDITS,
      user_id: newUserId
    }),
  ]);

  // Track referral completion
  serverTrack(referrer.id, 'referral_completed', {
    referred_user_id: newUserId,
    credits_awarded: REFERRAL_CREDITS,
  });

  return NextResponse.json({ success: true, creditsAwarded: REFERRAL_CREDITS });
}
```

### 2.2 Social Sharing

#### Share Lesson Progress

```typescript
// src/components/share/ShareProgress.tsx
"use client";

import { Button } from '@/components/ui/button';
import { Twitter, Linkedin, Facebook, Link } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ShareProgressProps {
  language: string;
  lessonsCompleted: number;
  minutesPracticed: number;
}

export function ShareProgress({ language, lessonsCompleted, minutesPracticed }: ShareProgressProps) {
  const t = useTranslations('Share');

  const shareText = t('progressText', {
    lessons: lessonsCompleted,
    language,
    minutes: minutesPracticed
  });
  const shareUrl = 'https://trypoppa.com';

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="icon" asChild>
        <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
          <Twitter className="h-4 w-4" />
        </a>
      </Button>
      <Button variant="outline" size="icon" asChild>
        <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer">
          <Linkedin className="h-4 w-4" />
        </a>
      </Button>
      <Button variant="outline" size="icon" asChild>
        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
          <Facebook className="h-4 w-4" />
        </a>
      </Button>
      <Button variant="outline" size="icon" onClick={copyLink}>
        <Link className="h-4 w-4" />
      </Button>
    </div>
  );
}
```

### 2.3 Achievement System

#### Achievement Definitions

```typescript
// src/lib/achievements.ts
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: UserStats) => boolean;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export const ACHIEVEMENTS: Achievement[] = [
  // Lesson milestones
  {
    id: 'first_lesson',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    tier: 'bronze',
    condition: (stats) => stats.totalLessons >= 1,
  },
  {
    id: 'ten_lessons',
    title: 'Getting Started',
    description: 'Complete 10 lessons',
    icon: '📚',
    tier: 'silver',
    condition: (stats) => stats.totalLessons >= 10,
  },
  {
    id: 'fifty_lessons',
    title: 'Dedicated Learner',
    description: 'Complete 50 lessons',
    icon: '🎓',
    tier: 'gold',
    condition: (stats) => stats.totalLessons >= 50,
  },
  {
    id: 'hundred_lessons',
    title: 'Language Master',
    description: 'Complete 100 lessons',
    icon: '👑',
    tier: 'platinum',
    condition: (stats) => stats.totalLessons >= 100,
  },

  // Time-based
  {
    id: 'one_hour',
    title: 'Hour of Power',
    description: 'Practice for 60 minutes total',
    icon: '⏱️',
    tier: 'bronze',
    condition: (stats) => stats.totalMinutes >= 60,
  },
  {
    id: 'ten_hours',
    title: 'Time Investor',
    description: 'Practice for 10 hours total',
    icon: '⏰',
    tier: 'gold',
    condition: (stats) => stats.totalMinutes >= 600,
  },

  // Streak-based
  {
    id: 'three_day_streak',
    title: 'Building Momentum',
    description: 'Practice 3 days in a row',
    icon: '🔥',
    tier: 'bronze',
    condition: (stats) => stats.currentStreak >= 3,
  },
  {
    id: 'seven_day_streak',
    title: 'Week Warrior',
    description: 'Practice 7 days in a row',
    icon: '💪',
    tier: 'silver',
    condition: (stats) => stats.currentStreak >= 7,
  },
  {
    id: 'thirty_day_streak',
    title: 'Monthly Master',
    description: 'Practice 30 days in a row',
    icon: '🏆',
    tier: 'platinum',
    condition: (stats) => stats.currentStreak >= 30,
  },

  // Language diversity
  {
    id: 'polyglot_starter',
    title: 'Polyglot Starter',
    description: 'Start learning 3 languages',
    icon: '🌍',
    tier: 'silver',
    condition: (stats) => stats.languagesStarted >= 3,
  },
  {
    id: 'polyglot_master',
    title: 'Polyglot Master',
    description: 'Complete 10+ lessons in 5 languages',
    icon: '🌐',
    tier: 'platinum',
    condition: (stats) => stats.languagesWithTenLessons >= 5,
  },

  // Social
  {
    id: 'first_referral',
    title: 'Ambassador',
    description: 'Refer your first friend',
    icon: '🤝',
    tier: 'silver',
    condition: (stats) => stats.referralsCompleted >= 1,
  },
  {
    id: 'five_referrals',
    title: 'Super Ambassador',
    description: 'Refer 5 friends',
    icon: '🌟',
    tier: 'gold',
    condition: (stats) => stats.referralsCompleted >= 5,
  },
];
```

#### Database Schema for Achievements

```sql
-- Migration: create_achievements_table.sql
CREATE TABLE user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  achievement_id VARCHAR(50) NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notified BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, achievement_id)
);

CREATE TABLE user_stats (
  user_id UUID REFERENCES users(id) PRIMARY KEY,
  total_lessons INT DEFAULT 0,
  total_minutes INT DEFAULT 0,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_lesson_date DATE,
  languages_started INT DEFAULT 0,
  referrals_completed INT DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2.4 Credit Gifting

Allow users to gift credits to friends:

```typescript
// src/app/api/credits/gift/route.ts
export async function POST(req: NextRequest) {
  const { recipientEmail, credits, message } = await req.json();
  const { userId } = await getAuthUser(req);

  // Verify sender has enough credits
  const { data: sender } = await supabaseClient
    .from('users')
    .select('credits')
    .eq('id', userId)
    .single();

  if (sender.credits < credits) {
    return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 });
  }

  // Create gift record
  const { data: gift } = await supabaseClient
    .from('credit_gifts')
    .insert({
      sender_id: userId,
      recipient_email: recipientEmail,
      credits,
      message,
      status: 'pending',
    })
    .select()
    .single();

  // Deduct from sender immediately
  await supabaseClient.rpc('increment_credits', {
    increment_amount: -credits,
    user_id: userId,
  });

  // Send email notification to recipient
  await sendGiftEmail(recipientEmail, gift.id, credits, message);

  return NextResponse.json({ success: true, giftId: gift.id });
}
```

---

## 3. Improved Onboarding

### 3.1 Personalized Onboarding Flow

Transform the current basic signup into a multi-step personalized experience:

```
Step 1: Account Creation (existing)
    ↓
Step 2: Learning Goals (NEW)
    - Why are you learning? (Travel, Work, Family, Culture, Fun)
    - What's your target? (Casual, Conversational, Fluent)
    ↓
Step 3: Experience Level (NEW)
    - Have you studied this language before?
    - How much can you understand now?
    ↓
Step 4: Schedule Preference (NEW)
    - How often do you want to practice?
    - Best time of day?
    ↓
Step 5: First Lesson Preview (NEW)
    - Quick 2-minute voice intro
    - Sets expectations for Socratic method
```

#### Onboarding State Management

```typescript
// src/types/onboarding.ts
export interface OnboardingState {
  step: number;
  totalSteps: number;
  completed: boolean;
  data: {
    learningGoal?: 'travel' | 'work' | 'family' | 'culture' | 'fun';
    targetLevel?: 'casual' | 'conversational' | 'fluent';
    experienceLevel?: 'none' | 'beginner' | 'intermediate' | 'advanced';
    practiceFrequency?: 'daily' | 'few_times_week' | 'weekly' | 'flexible';
    preferredTime?: 'morning' | 'afternoon' | 'evening' | 'flexible';
    selectedLanguage?: string;
  };
}
```

#### Onboarding Step Components

```typescript
// src/components/onboarding/LearningGoalsStep.tsx
"use client";

import { Card } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import {
  Plane, Briefcase, Users, Palette, Sparkles
} from 'lucide-react';

const goals = [
  { id: 'travel', icon: Plane, color: 'bg-blue-500' },
  { id: 'work', icon: Briefcase, color: 'bg-green-500' },
  { id: 'family', icon: Users, color: 'bg-pink-500' },
  { id: 'culture', icon: Palette, color: 'bg-purple-500' },
  { id: 'fun', icon: Sparkles, color: 'bg-yellow-500' },
];

interface LearningGoalsStepProps {
  selected?: string;
  onSelect: (goal: string) => void;
}

export function LearningGoalsStep({ selected, onSelect }: LearningGoalsStepProps) {
  const t = useTranslations('Onboarding.goals');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{t('title')}</h2>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {goals.map(({ id, icon: Icon, color }) => (
          <Card
            key={id}
            className={`p-4 cursor-pointer transition-all hover:scale-105 ${
              selected === id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onSelect(id)}
          >
            <div className={`${color} w-12 h-12 rounded-full flex items-center justify-center mb-3`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold">{t(`${id}.title`)}</h3>
            <p className="text-sm text-muted-foreground">{t(`${id}.description`)}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### 3.2 First Lesson Optimization

#### Pre-Lesson Briefing

```typescript
// src/components/lesson/PreLessonBriefing.tsx
"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mic, MessageCircle, Brain } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function PreLessonBriefing({ onContinue }: { onContinue: () => void }) {
  const t = useTranslations('Lesson.briefing');
  const [acknowledged, setAcknowledged] = useState(false);

  const tips = [
    { icon: Mic, key: 'speakNaturally' },
    { icon: MessageCircle, key: 'dontWorryErrors' },
    { icon: Brain, key: 'thinkingMethod' },
  ];

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">{t('title')}</h2>

      <div className="space-y-4 mb-6">
        {tips.map(({ icon: Icon, key }) => (
          <div key={key} className="flex items-start gap-3">
            <Icon className="h-5 w-5 text-primary mt-0.5" />
            <p className="text-sm">{t(key)}</p>
          </div>
        ))}
      </div>

      <label className="flex items-center gap-2 mb-4 cursor-pointer">
        <input
          type="checkbox"
          checked={acknowledged}
          onChange={(e) => setAcknowledged(e.target.checked)}
          className="rounded"
        />
        <span className="text-sm">{t('acknowledgement')}</span>
      </label>

      <Button
        onClick={onContinue}
        disabled={!acknowledged}
        className="w-full"
      >
        {t('startLesson')}
      </Button>
    </Card>
  );
}
```

### 3.3 Progress Indicators

#### Lesson Progress Ring

```typescript
// src/components/dashboard/ProgressRing.tsx
"use client";

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-muted"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-primary transition-all duration-500"
      />
    </svg>
  );
}
```

### 3.4 Welcome Email Sequence

Set up transactional emails via Resend or SendGrid:

```typescript
// src/lib/email/templates.ts
export const EMAIL_TEMPLATES = {
  welcome: {
    subject: 'Welcome to Poppa! Your language journey begins',
    delay: 0,
  },
  firstLessonReminder: {
    subject: "Ready for your first lesson? Here's what to expect",
    delay: 24 * 60 * 60 * 1000, // 24 hours
  },
  weekOneCheckin: {
    subject: 'How is your first week going?',
    delay: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
  streakEncouragement: {
    subject: 'Keep your streak alive! 🔥',
    delay: 0, // Triggered by streak detection
  },
};
```

---

## 4. Better Marketing Website

### 4.1 Social Proof Section

#### Testimonials Component

```typescript
// src/components/marketing/Testimonials.tsx
"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah M.',
    avatar: '/testimonials/sarah.jpg',
    language: 'Spanish',
    rating: 5,
    text: "After years of failed apps and courses, Poppa's Thinking Method finally made Spanish click. I'm having real conversations after just 3 weeks!",
    lessonsCompleted: 24,
  },
  {
    id: 2,
    name: 'Michael T.',
    avatar: '/testimonials/michael.jpg',
    language: 'Japanese',
    rating: 5,
    text: "The AI tutor adapts perfectly to my pace. It's like having a patient, brilliant teacher available 24/7.",
    lessonsCompleted: 47,
  },
  // ... more testimonials
];

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Loved by Language Learners Worldwide
        </h2>

        <div className="max-w-2xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className={`p-6 transition-all duration-500 ${
                index === activeIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <Avatar>
                  <AvatarImage src={testimonial.avatar} />
                  <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Learning {testimonial.language} • {testimonial.lessonsCompleted} lessons
                  </p>
                </div>
                <div className="ml-auto flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-lg italic">"{testimonial.text}"</p>
            </Card>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === activeIndex ? 'bg-primary w-6' : 'bg-muted-foreground'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
```

### 4.2 Live Stats Counter

```typescript
// src/components/marketing/LiveStats.tsx
"use client";

import { useEffect, useState } from 'react';
import { Users, MessageCircle, Globe, Clock } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalLessons: number;
  languagesSupported: number;
  totalMinutes: number;
}

export function LiveStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/public/stats')
      .then(res => res.json())
      .then(setStats);
  }, []);

  const statItems = [
    { icon: Users, label: 'Active Learners', value: stats?.totalUsers || 0 },
    { icon: MessageCircle, label: 'Lessons Completed', value: stats?.totalLessons || 0 },
    { icon: Globe, label: 'Languages', value: stats?.languagesSupported || 50 },
    { icon: Clock, label: 'Hours of Practice', value: Math.round((stats?.totalMinutes || 0) / 60) },
  ];

  return (
    <section className="py-12 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statItems.map(({ icon: Icon, label, value }) => (
            <div key={label} className="text-center">
              <Icon className="h-8 w-8 mx-auto mb-2 opacity-80" />
              <p className="text-3xl font-bold">
                {value.toLocaleString()}+
              </p>
              <p className="text-sm opacity-80">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### 4.3 Interactive Demo

Allow visitors to experience a sample lesson without signing up:

```typescript
// src/components/marketing/InteractiveDemo.tsx
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Volume2 } from 'lucide-react';

const demoExchanges = [
  {
    tutor: "Let's discover something interesting about Spanish. In English, we say 'I am happy'. How do you think we might say 'happy' in Spanish?",
    student: "Um... feliz?",
    tutorResponse: "Excellent intuition! 'Feliz' is exactly right. Now, what word do we use in English to say 'I am' doing something?",
  },
  // More exchanges...
];

export function InteractiveDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentExchange, setCurrentExchange] = useState(0);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-4">
          Experience the Thinking Method
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          Listen to a real lesson exchange and see how guided discovery works
        </p>

        <Card className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sample Lesson: Spanish Basics</span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Volume2 className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>

          <div className="space-y-4">
            <div className="bg-primary/10 rounded-lg p-4">
              <p className="text-sm font-medium text-primary mb-1">Poppa</p>
              <p>{demoExchanges[currentExchange].tutor}</p>
            </div>

            <div className="bg-muted rounded-lg p-4 ml-8">
              <p className="text-sm font-medium text-muted-foreground mb-1">Student</p>
              <p>{demoExchanges[currentExchange].student}</p>
            </div>

            <div className="bg-primary/10 rounded-lg p-4">
              <p className="text-sm font-medium text-primary mb-1">Poppa</p>
              <p>{demoExchanges[currentExchange].tutorResponse}</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Button size="lg">
              Try Your First Real Lesson Free
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
```

### 4.4 SEO Improvements

#### Language-Specific Landing Pages

Create dedicated pages for each language:

```
/learn/spanish - Spanish-specific landing page
/learn/french - French-specific landing page
/learn/japanese - Japanese-specific landing page
...
```

```typescript
// src/app/[locale]/learn/[language]/page.tsx
import { Metadata } from 'next';
import { getLanguageByCode } from '@/lib/supportedLanguages';
import { LanguageLandingPage } from '@/components/marketing/LanguageLandingPage';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const language = getLanguageByCode(params.language);

  return {
    title: `Learn ${language.name} with AI - Poppa`,
    description: `Master ${language.name} through voice conversations with an AI tutor. The Thinking Method helps you discover ${language.name} naturally without memorization.`,
    openGraph: {
      title: `Learn ${language.name} with AI Voice Lessons`,
      description: `Start speaking ${language.name} from day one with Poppa's AI tutor.`,
      images: [`/og/${params.language}.png`],
    },
  };
}

export default async function Page({ params }: Props) {
  const language = getLanguageByCode(params.language);
  return <LanguageLandingPage language={language} />;
}

export async function generateStaticParams() {
  const languages = ['spanish', 'french', 'german', 'italian', 'japanese', 'chinese', 'korean', 'portuguese', 'arabic', 'russian'];
  return languages.map((language) => ({ language }));
}
```

### 4.5 Comparison Page

```typescript
// src/app/[locale]/compare/page.tsx
// Compare Poppa vs Duolingo, Babbel, Rosetta Stone

export default function ComparePage() {
  const comparisons = [
    {
      feature: 'Teaching Method',
      poppa: 'Socratic questioning - discover patterns yourself',
      competitors: 'Gamified memorization and drilling',
    },
    {
      feature: 'Voice Interaction',
      poppa: 'Real-time voice conversations with AI',
      competitors: 'Limited to pronunciation exercises',
    },
    {
      feature: 'Personalization',
      poppa: 'Lessons adapt to your exact level in real-time',
      competitors: 'Pre-set lesson paths',
    },
    // ... more comparisons
  ];

  return (
    <div className="container mx-auto py-16">
      <h1 className="text-4xl font-bold text-center mb-4">
        Why Poppa is Different
      </h1>
      <p className="text-center text-muted-foreground mb-12">
        See how the Thinking Method compares to traditional language apps
      </p>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left p-4">Feature</th>
              <th className="text-left p-4 bg-primary/10">Poppa</th>
              <th className="text-left p-4">Other Apps</th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((row) => (
              <tr key={row.feature} className="border-t">
                <td className="p-4 font-medium">{row.feature}</td>
                <td className="p-4 bg-primary/5">{row.poppa}</td>
                <td className="p-4 text-muted-foreground">{row.competitors}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### 4.6 Blog/Content Marketing

```
/blog - Main blog index
/blog/thinking-method-explained - SEO content
/blog/best-way-to-learn-spanish - Language-specific SEO
/blog/language-learning-tips - General education content
```

---

## 5. Retention & Engagement Systems

### 5.1 Streak System

```typescript
// src/lib/streak.ts
export async function updateStreak(userId: string): Promise<{
  currentStreak: number;
  isNewRecord: boolean;
}> {
  const { data: stats } = await supabaseClient
    .from('user_stats')
    .select('current_streak, longest_streak, last_lesson_date')
    .eq('user_id', userId)
    .single();

  const today = new Date().toISOString().split('T')[0];
  const lastLesson = stats?.last_lesson_date;

  let newStreak = 1;

  if (lastLesson) {
    const daysSince = Math.floor(
      (new Date(today).getTime() - new Date(lastLesson).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSince === 0) {
      // Already practiced today
      newStreak = stats.current_streak;
    } else if (daysSince === 1) {
      // Consecutive day
      newStreak = stats.current_streak + 1;
    }
    // daysSince > 1 means streak broken, start fresh at 1
  }

  const isNewRecord = newStreak > (stats?.longest_streak || 0);

  await supabaseClient
    .from('user_stats')
    .upsert({
      user_id: userId,
      current_streak: newStreak,
      longest_streak: isNewRecord ? newStreak : stats?.longest_streak || newStreak,
      last_lesson_date: today,
      updated_at: new Date().toISOString(),
    });

  return { currentStreak: newStreak, isNewRecord };
}
```

### 5.2 Push Notifications (via Web Push)

```typescript
// src/lib/notifications.ts
import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:support@trypoppa.com',
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function sendStreakReminder(userId: string) {
  const { data: subscription } = await supabaseClient
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth')
    .eq('user_id', userId)
    .single();

  if (!subscription) return;

  await webpush.sendNotification(
    {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth,
      },
    },
    JSON.stringify({
      title: 'Keep your streak alive! 🔥',
      body: 'A quick 5-minute lesson will maintain your progress.',
      icon: '/icons/poppa-icon.png',
      data: { url: '/dashboard' },
    })
  );
}
```

### 5.3 Re-engagement Emails

Schedule emails for inactive users:

```typescript
// src/jobs/reengagement.ts (run via cron)
export async function checkInactiveUsers() {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const { data: inactiveUsers } = await supabaseClient
    .from('user_stats')
    .select('user_id, current_streak, last_lesson_date')
    .lt('last_lesson_date', threeDaysAgo.toISOString())
    .gt('current_streak', 0); // Had a streak

  for (const user of inactiveUsers || []) {
    await sendReengagementEmail(user.user_id, {
      type: 'streak_at_risk',
      previousStreak: user.current_streak,
    });
  }
}
```

### 5.4 Weekly Progress Reports

```typescript
// src/lib/email/weekly-report.ts
export async function generateWeeklyReport(userId: string) {
  const { data: lessons } = await supabaseClient
    .from('conversation_transcripts')
    .select('target_language, created_at')
    .eq('user_id', userId)
    .gte('created_at', oneWeekAgo().toISOString());

  const { data: stats } = await supabaseClient
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  return {
    lessonsThisWeek: lessons?.length || 0,
    minutesThisWeek: calculateMinutes(lessons),
    currentStreak: stats?.current_streak || 0,
    languagesStudied: [...new Set(lessons?.map(l => l.target_language))],
    improvement: calculateImprovement(userId), // Compare to previous week
  };
}
```

---

## 6. Implementation Priorities

### Phase 1: Foundation (Weeks 1-2)

| Priority | Task | Impact | Effort |
|----------|------|--------|--------|
| P0 | Set up PostHog analytics | High | Low |
| P0 | Implement core event tracking | High | Medium |
| P1 | Add user stats table | High | Low |
| P1 | Implement streak tracking | High | Medium |
| P1 | Create referral system database schema | High | Low |

### Phase 2: Growth Loops (Weeks 3-4)

| Priority | Task | Impact | Effort |
|----------|------|--------|--------|
| P0 | Build referral system UI | High | Medium |
| P0 | Implement referral processing | High | Medium |
| P1 | Add social sharing buttons | Medium | Low |
| P1 | Create achievement system | Medium | High |
| P2 | Build credit gifting feature | Medium | Medium |

### Phase 3: Onboarding (Weeks 5-6)

| Priority | Task | Impact | Effort |
|----------|------|--------|--------|
| P0 | Multi-step onboarding flow | High | High |
| P0 | Pre-lesson briefing component | High | Medium |
| P1 | Welcome email sequence setup | Medium | Medium |
| P1 | Progress indicators on dashboard | Medium | Low |
| P2 | Personalized lesson recommendations | Medium | High |

### Phase 4: Marketing (Weeks 7-8)

| Priority | Task | Impact | Effort |
|----------|------|--------|--------|
| P0 | Add testimonials section | High | Low |
| P0 | Create live stats counter | Medium | Low |
| P1 | Build interactive demo | High | High |
| P1 | Language-specific landing pages | High | Medium |
| P2 | Comparison page | Medium | Medium |
| P2 | Blog infrastructure | Medium | High |

### Phase 5: Retention (Weeks 9-10)

| Priority | Task | Impact | Effort |
|----------|------|--------|--------|
| P0 | Streak UI components | High | Medium |
| P1 | Push notification setup | Medium | High |
| P1 | Re-engagement email automation | Medium | Medium |
| P2 | Weekly progress reports | Medium | Medium |

---

## 7. Database Schema Changes

### New Tables Required

```sql
-- 1. Referrals
CREATE TABLE referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES users(id) NOT NULL,
  referred_id UUID REFERENCES users(id),
  referral_code VARCHAR(12) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  credits_awarded_referrer INT DEFAULT 0,
  credits_awarded_referred INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 2. User Stats (for streaks, achievements)
CREATE TABLE user_stats (
  user_id UUID REFERENCES users(id) PRIMARY KEY,
  total_lessons INT DEFAULT 0,
  total_minutes INT DEFAULT 0,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_lesson_date DATE,
  languages_started INT DEFAULT 0,
  referrals_completed INT DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Achievements
CREATE TABLE user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  achievement_id VARCHAR(50) NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notified BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, achievement_id)
);

-- 4. Credit Gifts
CREATE TABLE credit_gifts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES users(id) NOT NULL,
  recipient_email VARCHAR(255) NOT NULL,
  recipient_id UUID REFERENCES users(id),
  credits INT NOT NULL,
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  claimed_at TIMESTAMP WITH TIME ZONE
);

-- 5. Push Subscriptions
CREATE TABLE push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);

-- 6. Onboarding Data
CREATE TABLE onboarding_data (
  user_id UUID REFERENCES users(id) PRIMARY KEY,
  learning_goal VARCHAR(50),
  target_level VARCHAR(50),
  experience_level VARCHAR(50),
  practice_frequency VARCHAR(50),
  preferred_time VARCHAR(50),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Email Preferences
CREATE TABLE email_preferences (
  user_id UUID REFERENCES users(id) PRIMARY KEY,
  weekly_report BOOLEAN DEFAULT TRUE,
  streak_reminders BOOLEAN DEFAULT TRUE,
  product_updates BOOLEAN DEFAULT TRUE,
  marketing BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add referral_code to users table
ALTER TABLE users ADD COLUMN referral_code VARCHAR(12) UNIQUE;
ALTER TABLE users ADD COLUMN referred_by UUID REFERENCES users(id);
```

### Indexes

```sql
CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_code ON referrals(referral_code);
CREATE INDEX idx_user_stats_streak ON user_stats(current_streak DESC);
CREATE INDEX idx_user_stats_last_lesson ON user_stats(last_lesson_date);
CREATE INDEX idx_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_credit_gifts_recipient ON credit_gifts(recipient_email);
```

---

## 8. Success Metrics

### North Star Metrics

| Metric | Current | Target (3 months) | Target (6 months) |
|--------|---------|-------------------|-------------------|
| Weekly Active Users | Unknown | Track baseline | +50% |
| Lessons per User per Week | Unknown | Track baseline | +30% |
| Free-to-Paid Conversion | Unknown | Track baseline | +25% |
| 7-Day Retention | Unknown | Track baseline | +40% |

### Growth Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| Referral Rate | % of users who refer at least 1 person | 15% |
| Viral Coefficient | Average referrals per user | 0.5 |
| Email Open Rate | Welcome sequence opens | 45% |
| Streak Retention | % of users with 7+ day streaks | 20% |

### Engagement Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| Average Session Length | Minutes per lesson | 8+ min |
| Sessions per Week | Lessons completed weekly | 3+ |
| Feature Adoption | % using referrals, sharing | 25% |
| Achievement Unlock Rate | % unlocking first achievement | 80% |

### Conversion Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| Signup Rate | Visitors → Signups | 5% |
| Activation Rate | Signups → First Lesson | 60% |
| Trial Conversion | Free users → Paid | 8% |
| Upgrade Rate | Hobby → Pro | 15% |

---

## Appendix A: Third-Party Services

| Service | Purpose | Cost Estimate |
|---------|---------|---------------|
| PostHog | Analytics | Free tier (1M events/mo) |
| Resend | Transactional email | $20/mo (50k emails) |
| Web Push | Push notifications | Free (self-hosted) |
| Vercel Cron | Scheduled jobs | Included |

---

## Appendix B: Translation Keys

Add to `messages/en.json`:

```json
{
  "Referral": {
    "title": "Invite Friends",
    "description": "Give friends 10 free minutes. Get 10 minutes when they sign up!",
    "copyLink": "Copy Invite Link",
    "shareTitle": "Learn languages with Poppa",
    "shareText": "I'm learning languages with an AI tutor! Join me on Poppa.",
    "referralCount": "{count} friends joined"
  },
  "Onboarding": {
    "goals": {
      "title": "What's your motivation?",
      "subtitle": "This helps us personalize your experience",
      "travel": {
        "title": "Travel",
        "description": "Navigate foreign countries with confidence"
      },
      "work": {
        "title": "Career",
        "description": "Expand professional opportunities"
      }
    }
  },
  "Share": {
    "progressText": "I just completed {lessons} {language} lessons on Poppa! That's {minutes} minutes of voice practice."
  }
}
```

---

*This plan was created by the Principal Growth Engineer based on comprehensive codebase analysis. Implementation should follow the phased approach outlined in Section 6.*
