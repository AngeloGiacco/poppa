# Growth Engineering Audit

> Rigorous audit by Principal Growth Engineer | January 2026

---

## Executive Summary

**Product**: Poppa - Voice-only AI language tutoring using the Socratic Method
**Stage**: Early growth - strong product foundation, zero growth infrastructure
**Critical Finding**: Flying blind with no analytics, leaving significant revenue on the table

### Current State Score: 2/10

| Pillar | Score | Status |
|--------|-------|--------|
| Analytics & Measurement | 0/10 | Non-existent |
| Acquisition (SEO/Content) | 2/10 | Basic landing page only |
| Activation (Onboarding) | 3/10 | High-friction signup |
| Retention (Engagement) | 2/10 | Credit system only |
| Referral (Viral) | 0/10 | Non-existent |
| Revenue (Monetization) | 6/10 | Stripe working well |

---

## Critical Gaps Analysis

### 1. ANALYTICS: Zero Visibility (BLOCKER)

**Current State**: No analytics platform installed. Zero event tracking. No ability to measure:
- Conversion rates at any stage
- User behavior patterns
- Feature adoption
- Churn prediction
- CAC/LTV calculations

**Business Impact**: Cannot make data-driven decisions. All growth experiments are unmeasurable.

**Evidence**:
- No `posthog`, `mixpanel`, `amplitude`, `segment`, `gtag` in package.json
- No analytics-related environment variables
- No tracking code in any components

---

### 2. ACQUISITION: Minimal SEO & No Content Strategy

**Current State**:
- Single landing page with basic meta tags
- No sitemap.xml or robots.txt
- No structured data/schema markup
- No language-specific landing pages (50+ languages, 0 dedicated pages)
- No blog or content marketing infrastructure
- No Open Graph tags for social sharing

**Business Impact**: Missing organic traffic from 50+ high-intent keyword opportunities (e.g., "learn Spanish online", "AI language tutor").

**Evidence**:
- `src/app/[locale]/layout.tsx` has minimal metadata
- No `/learn/[language]` routes exist
- No `/blog` directory

---

### 3. ACTIVATION: High-Friction Signup

**Current State**:
- 7 required fields at signup (industry standard: 2-3)
- Date of birth collection with no clear purpose
- No social auth (Google, Apple, GitHub)
- Manual login required after signup (no auto-redirect)
- No onboarding flow or tutorial
- No first-lesson preview

**Business Impact**: Estimated 40-60% signup abandonment due to form friction.

**Evidence**:
- `src/components/SignupForm.tsx`: firstName, lastName, email, password, confirmPassword, nativeLanguage, dateOfBirth
- No OAuth providers in auth flow
- `/signup-success` redirects to login page, not dashboard

---

### 4. RETENTION: No Engagement Loops

**Current State**:
- Credit/minute tracking exists (usage table)
- Lesson history saved (conversation_transcripts table)
- No streak tracking
- No achievements/gamification
- No email engagement sequences
- No push notifications
- No progress visualization
- No learning goals/milestones

**Business Impact**: Users complete lessons but have no incentive to return. Missing habit-forming mechanics.

**Evidence**:
- No `user_stats` table for streaks
- No `user_achievements` table
- No email service provider (Resend/SendGrid) in dependencies
- No `web-push` package for notifications

---

### 5. REFERRAL: Zero Viral Mechanics

**Current State**:
- No referral system
- No referral codes on user profiles
- No share buttons anywhere
- No invite links
- No social sharing of progress

**Business Impact**: Missing k-factor improvement. Viral coefficient is 0.

**Evidence**:
- No `referrals` table in migrations
- No referral_code column on users table
- No share components in `/components`

---

## High-Level Strategy

### Phase 1: Foundation (Weeks 1-2) - MUST DO FIRST
**Goal**: Achieve visibility into user behavior

1. Implement PostHog analytics
2. Add core event tracking (signup, lesson start/complete, upgrade)
3. Set up conversion funnels
4. Create user identification

### Phase 2: Reduce Friction (Weeks 2-3)
**Goal**: Increase signup-to-first-lesson rate by 50%

1. Simplify signup form (email + password only)
2. Add Google OAuth
3. Auto-login after signup
4. Add pre-lesson briefing

### Phase 3: Growth Loops (Weeks 3-5)
**Goal**: Achieve k > 0.3 viral coefficient

1. Implement referral system with credit incentives
2. Add social sharing for milestones
3. Create achievement system

### Phase 4: Retention (Weeks 5-7)
**Goal**: Increase 7-day retention by 40%

1. Implement streak tracking
2. Add push notification reminders
3. Set up re-engagement email sequences
4. Create weekly progress reports

### Phase 5: Scale (Weeks 7-10)
**Goal**: Increase organic acquisition by 100%

1. Create language-specific landing pages
2. Add testimonials and social proof
3. Implement blog infrastructure
4. SEO optimization (sitemap, schema)

---

## Prioritized Task List

### P0: Critical Path (Do Immediately)

#### [ ] 1. Install PostHog Analytics
**Impact**: Unlocks all growth measurement
**Effort**: 4 hours
**Files to create/modify**:
- Install: `pnpm add posthog-js posthog-node`
- Create: `src/lib/analytics/posthog.ts`
- Create: `src/components/providers/AnalyticsProvider.tsx`
- Modify: `src/app/[locale]/layout.tsx` (wrap with provider)
- Add env vars: `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`

#### [ ] 2. Implement Core Event Tracking
**Impact**: Enables funnel analysis
**Effort**: 6 hours
**Events to track**:
- `user_signed_up` - after successful signup
- `user_logged_in` - after login
- `lesson_started` - on conversation connect
- `lesson_completed` - on conversation end
- `checkout_started` - on pricing CTA click
- `subscription_created` - in Stripe webhook
- `credits_depleted` - when credits hit 0

#### [ ] 3. Reduce Signup Form Fields
**Impact**: +30-50% signup completion
**Effort**: 2 hours
**Changes**:
- Remove: dateOfBirth field
- Remove: confirmPassword (validate on password field)
- Make optional: firstName, lastName (collect post-signup)
- Result: email + password only at signup

#### [ ] 4. Add Google OAuth
**Impact**: +15-25% signup rate from mobile users
**Effort**: 4 hours
**Steps**:
- Configure Supabase OAuth provider
- Add Google sign-in button to login/signup forms
- Handle OAuth callback

#### [ ] 5. Auto-Login After Signup
**Impact**: Eliminates unnecessary friction
**Effort**: 1 hour
**Change**:
- Modify signup API to return session
- Redirect to dashboard instead of login page

---

### P1: High Impact (Week 1-2)

#### [ ] 6. Create user_stats Table
**Impact**: Enables streak tracking
**Effort**: 2 hours
**Migration**:
```sql
CREATE TABLE user_stats (
  user_id UUID REFERENCES users(id) PRIMARY KEY,
  total_lessons INT DEFAULT 0,
  total_minutes INT DEFAULT 0,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_lesson_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### [ ] 7. Implement Streak Tracking
**Impact**: +20% daily retention
**Effort**: 4 hours
**Components**:
- Create: `src/lib/streak.ts` (streak calculation logic)
- Modify: lesson completion webhook to update streaks
- Create: `src/components/dashboard/StreakDisplay.tsx`

#### [ ] 8. Create Referral System Database Schema
**Impact**: Enables viral growth
**Effort**: 3 hours
**Tables**:
- `referrals` table with code, referrer_id, referred_id, status
- Add `referral_code` column to users table
- Add `referred_by` column to users table

#### [ ] 9. Build Referral Card Component
**Impact**: Makes referrals discoverable
**Effort**: 4 hours
**Files**:
- Create: `src/components/referral/ReferralCard.tsx`
- Add to dashboard sidebar
- Include copy link, share buttons

#### [ ] 10. Add Pre-Lesson Briefing
**Impact**: Reduces lesson abandonment
**Effort**: 3 hours
**Component**:
- Create: `src/components/lesson/PreLessonBriefing.tsx`
- Show before first lesson only
- Explain Socratic method, set expectations

---

### P2: Medium Impact (Week 3-4)

#### [ ] 11. Implement Referral Processing API
**Impact**: Completes referral loop
**Effort**: 4 hours
**Route**: `src/app/api/referral/process/route.ts`
- Validate referral code
- Credit both users (10 minutes each)
- Update referral status

#### [ ] 12. Add Social Sharing Component
**Impact**: Increases organic reach
**Effort**: 3 hours
**Component**: `src/components/share/ShareProgress.tsx`
- Twitter, LinkedIn, Facebook share links
- Copy link button
- Share milestone achievements

#### [ ] 13. Create Achievement System
**Impact**: Increases engagement
**Effort**: 8 hours
**Components**:
- Create: `src/lib/achievements.ts` (definitions)
- Create: `user_achievements` table
- Create: `src/components/achievements/AchievementBadge.tsx`
- Create: `src/components/achievements/AchievementUnlock.tsx` (toast)

#### [ ] 14. Add Email Service Provider
**Impact**: Enables engagement sequences
**Effort**: 4 hours
**Steps**:
- Install: `pnpm add resend` or `pnpm add @sendgrid/mail`
- Create: `src/lib/email/client.ts`
- Create: `src/lib/email/templates/welcome.tsx`
- Configure env vars

#### [ ] 15. Create Welcome Email Sequence
**Impact**: Activates new users
**Effort**: 4 hours
**Emails**:
- Welcome (immediate)
- First lesson reminder (24 hours if no lesson)
- Week 1 check-in (7 days)

---

### P3: Long-term (Week 5+)

#### [ ] 16. Create Language-Specific Landing Pages
**Impact**: SEO traffic for high-intent keywords
**Effort**: 8 hours
**Route**: `src/app/[locale]/learn/[language]/page.tsx`
- Dynamic metadata per language
- Language-specific benefits
- Generate static params for top 10 languages

#### [ ] 17. Add Testimonials Section
**Impact**: Increases trust/conversion
**Effort**: 4 hours
**Component**: `src/components/marketing/Testimonials.tsx`
- Carousel of user testimonials
- Include ratings, lesson counts
- Add to landing page

#### [ ] 18. Implement sitemap.xml
**Impact**: Better search indexing
**Effort**: 2 hours
**File**: `src/app/sitemap.ts`
- Include all static pages
- Include language landing pages
- Include blog posts (future)

#### [ ] 19. Add Push Notifications
**Impact**: Streak reminders
**Effort**: 8 hours
**Dependencies**: `web-push` package
**Components**:
- Push subscription table
- Service worker setup
- Reminder cron job

#### [ ] 20. Create Comparison Page
**Impact**: SEO + conversion
**Effort**: 4 hours
**Route**: `src/app/[locale]/compare/page.tsx`
- Compare vs Duolingo, Babbel, Rosetta Stone
- Highlight Thinking Method advantages

#### [ ] 21. Build Blog Infrastructure
**Impact**: Content marketing
**Effort**: 12 hours
**Components**:
- MDX blog setup
- Blog index page
- Individual post pages
- SEO optimization

#### [ ] 22. Implement Weekly Progress Reports
**Impact**: Re-engagement
**Effort**: 6 hours
**Components**:
- Progress calculation logic
- Email template
- Cron job scheduling

---

## Quick Wins (< 2 hours each)

| Task | Impact | Effort |
|------|--------|--------|
| Remove dateOfBirth from signup | High | 30 min |
| Auto-login after signup | High | 1 hour |
| Add Open Graph meta tags | Medium | 1 hour |
| Create robots.txt | Low | 15 min |
| Add "Most Popular" badge to Pro plan | Low | 30 min |
| Show lesson duration estimate | Medium | 1 hour |
| Add microphone permission explainer | Medium | 1 hour |

---

## Technical Debt to Address

1. **No error tracking**: Add Sentry for error monitoring
2. **No performance monitoring**: Add Vercel Analytics or similar
3. **No A/B testing framework**: PostHog has this built-in
4. **No feature flags**: PostHog has this built-in
5. **Webhook reliability**: Add retry logic for Stripe/ElevenLabs webhooks

---

## KPIs to Track

### North Star Metrics
- **Weekly Active Learners**: Users completing 1+ lesson/week
- **Lessons per User per Week**: Engagement depth
- **Free-to-Paid Conversion Rate**: Revenue efficiency

### Funnel Metrics
| Stage | Metric | Current | Target |
|-------|--------|---------|--------|
| Acquisition | Landing → Signup | Unknown | 5% |
| Activation | Signup → First Lesson | Unknown | 60% |
| Retention | 7-day retention | Unknown | 30% |
| Revenue | Free → Paid | Unknown | 8% |
| Referral | K-factor | 0 | 0.3 |

### Leading Indicators
- Signup form completion rate
- Time to first lesson
- Lesson completion rate
- Streak maintenance rate
- Referral send rate

---

## Dependencies & Risks

### External Dependencies
| Service | Purpose | Risk Mitigation |
|---------|---------|-----------------|
| PostHog | Analytics | Self-host option available |
| Resend/SendGrid | Email | Both have 99.9% SLA |
| ElevenLabs | Voice AI | No alternative, core product |
| Supabase | Database | Standard PostgreSQL, portable |
| Stripe | Payments | Industry standard, stable |

### Implementation Risks
1. **Analytics implementation may reveal low conversion rates** - Expected, provides baseline
2. **Signup simplification may reduce data quality** - Collect data post-activation
3. **Referral abuse** - Implement rate limiting and fraud detection
4. **Email deliverability** - Use dedicated IP, warm up properly

---

## Resource Requirements

### Phase 1-2 (Foundation + Friction Reduction)
- **Engineering**: 40 hours
- **Design**: 8 hours (signup redesign, dashboard updates)
- **Cost**: ~$0 (PostHog free tier, existing Supabase)

### Phase 3-4 (Growth Loops + Retention)
- **Engineering**: 60 hours
- **Design**: 16 hours (referral UI, achievement badges)
- **Cost**: ~$20/month (email provider)

### Phase 5 (Scale)
- **Engineering**: 80 hours
- **Design**: 24 hours (landing pages, blog)
- **Content**: 40 hours (testimonials, blog posts)
- **Cost**: ~$50/month (additional services)

---

## Success Criteria

### 30 Days
- [ ] Analytics live and tracking core events
- [ ] Signup form reduced to 3 fields or less
- [ ] Google OAuth working
- [ ] Streak tracking implemented
- [ ] Baseline metrics established

### 60 Days
- [ ] Referral system live
- [ ] Welcome email sequence active
- [ ] Achievement system launched
- [ ] 5+ testimonials on landing page
- [ ] Conversion rate improved by 25%

### 90 Days
- [ ] Language-specific landing pages (top 10)
- [ ] Push notifications live
- [ ] Weekly progress reports sending
- [ ] 7-day retention improved by 40%
- [ ] Referral k-factor > 0.2

---

## Conclusion

Poppa has exceptional product-market fit potential with its unique Socratic voice-learning approach. The immediate priority is **instrumenting analytics** to establish baselines, followed by **reducing signup friction** to improve activation rates.

The referral system and retention mechanics should be implemented in parallel to create viral loops and engagement habits. SEO and content marketing provide long-term sustainable growth but require the foundation to be in place first.

**Recommended immediate action**: Install PostHog and remove the date of birth field from signup. These two changes take less than 2 hours combined and provide the highest immediate impact.

---

*Audit completed January 2026 | Principal Growth Engineer*
