# Architecture

This document describes the technical architecture of Poppa, the voice-based language tutoring platform.

## Table of Contents

- [System Overview](#system-overview)
- [Frontend Architecture](#frontend-architecture)
- [Voice Conversation Flow](#voice-conversation-flow)
- [Lesson Generation Pipeline](#lesson-generation-pipeline)
- [Data Flow](#data-flow)
- [Database Schema](#database-schema)
- [API Routes](#api-routes)
- [Third-Party Integrations](#third-party-integrations)
- [Security Considerations](#security-considerations)

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT                                      │
│  ┌──────────────────┐    ┌──────────────────┐    ┌─────────────────┐   │
│  │   Next.js App    │    │  @elevenlabs/    │    │    Supabase     │   │
│  │   (React 18)     │◄──►│  react SDK       │    │  Browser Client │   │
│  └────────┬─────────┘    └────────┬─────────┘    └────────┬────────┘   │
└───────────┼──────────────────────┼─────────────────────────┼───────────┘
            │                      │                         │
            │ API Routes           │ WebSocket               │ RLS
            ▼                      ▼                         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              SERVER                                      │
│  ┌──────────────────┐    ┌──────────────────┐    ┌─────────────────┐   │
│  │  Next.js API     │    │   ElevenLabs     │    │    Supabase     │   │
│  │  Routes          │    │   Conversational │    │    PostgreSQL   │   │
│  │  - /api/generate │    │   AI Platform    │    │    + Auth       │   │
│  │  - /api/webhooks │    │                  │    │                 │   │
│  └────────┬─────────┘    └────────┬─────────┘    └────────┬────────┘   │
│           │                       │                        │            │
│           ▼                       ▼                        │            │
│  ┌──────────────────┐    ┌──────────────────┐              │            │
│  │   Claude API     │    │   Stripe API     │◄─────────────┘            │
│  │   (Anthropic)    │    │   (Payments)     │                           │
│  └──────────────────┘    └──────────────────┘                           │
└─────────────────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Directory Structure

```
poppa_frontend/src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # i18n dynamic routes
│   │   ├── page.tsx       # Landing page
│   │   ├── lesson/        # Lesson interface
│   │   ├── dashboard/     # User dashboard
│   │   └── ...
│   └── api/               # App Router API routes
│
├── components/            # React components
│   ├── ui/               # shadcn/ui primitives
│   ├── Chat.tsx          # Main voice conversation UI
│   └── ...
│
├── context/              # React Context providers
│   └── AuthContext.tsx   # Authentication state
│
├── hooks/                # Custom React hooks
│   └── useLesson.tsx     # Lesson state management
│
├── lib/                  # Utilities
│   ├── supabase.ts       # Server Supabase client
│   ├── supabase-browser.ts  # Browser client
│   ├── lesson-utils.ts   # Socratic method prompts
│   └── curriculum/       # Structured lesson content
│
└── types/                # TypeScript definitions
```

### Client/Server Boundary

```
                    ┌─────────────────────────────────────┐
                    │          Server Components          │
                    │   (No hooks, direct data fetching)  │
                    │                                     │
                    │   • Layout components               │
                    │   • Static content                  │
                    │   • SEO metadata                    │
                    └─────────────┬───────────────────────┘
                                  │
                                  │ Props / Children
                                  ▼
                    ┌─────────────────────────────────────┐
                    │         Client Components           │
                    │      ("use client" directive)       │
                    │                                     │
                    │   • Chat.tsx (voice UI)             │
                    │   • Form components                 │
                    │   • Interactive elements            │
                    │   • Hooks (useState, useEffect)     │
                    └─────────────────────────────────────┘
```

### State Management

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         State Architecture                               │
├───────────────────────────┬─────────────────────────────────────────────┤
│         Layer             │              Purpose                         │
├───────────────────────────┼─────────────────────────────────────────────┤
│   AuthContext             │  User authentication, profile, session      │
│   useLesson hook          │  Current lesson, language, history          │
│   useConversation (11L)   │  Voice session state, transcripts           │
│   Component State         │  UI-specific state (modals, forms)          │
│   Server State (Supabase) │  Persistent data (lessons, usage)           │
└───────────────────────────┴─────────────────────────────────────────────┘
```

## Voice Conversation Flow

### Session Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      Voice Session Lifecycle                             │
└─────────────────────────────────────────────────────────────────────────┘

1. INITIALIZATION
   User clicks "Start Lesson"
           │
           ▼
   ┌───────────────────────┐
   │ Request microphone    │
   │ permission            │
   └───────────┬───────────┘
               │
               ▼
   ┌───────────────────────┐
   │ Call /api/generate    │───────► Claude generates lesson
   │ -lesson               │         instructions based on
   └───────────┬───────────┘         history + curriculum
               │
               ▼
2. CONNECTION
   ┌───────────────────────┐
   │ conversation.start    │
   │ Session({             │
   │   agentId,            │
   │   dynamicVariables    │
   │ })                    │
   └───────────┬───────────┘
               │
               ▼
   ┌───────────────────────┐
   │ WebSocket established │
   │ to ElevenLabs         │
   └───────────┬───────────┘
               │
               ▼
3. ACTIVE CONVERSATION
   ┌───────────────────────────────────────────────────────────────┐
   │                                                               │
   │   ┌─────────┐    Audio    ┌─────────────┐    Audio    ┌────┐ │
   │   │  User   │ ──────────► │ ElevenLabs  │ ──────────► │ AI │ │
   │   │  Mic    │             │   Agent     │             │    │ │
   │   └─────────┘             └─────────────┘             └────┘ │
   │        ▲                         │                           │
   │        │                         │ onMessage callbacks       │
   │        │                         ▼                           │
   │   ┌─────────────────────────────────────────────────────┐   │
   │   │  Real-time transcription (message.source)           │   │
   │   │  - "user": Student speech                           │   │
   │   │  - "agent": Tutor response                          │   │
   │   └─────────────────────────────────────────────────────┘   │
   │                                                               │
   └───────────────────────────────────────────────────────────────┘
               │
               ▼
4. SESSION END
   ┌───────────────────────┐
   │ User clicks Disconnect│
   │ or session timeout    │
   └───────────┬───────────┘
               │
               ▼
   ┌───────────────────────┐
   │ onDisconnect callback │───────► Save transcript locally
   └───────────┬───────────┘
               │
               ▼
   ┌───────────────────────┐
   │ ElevenLabs Webhook    │───────► /api/elevenlabs/webhooks
   │ (post_call)           │         - Verify signature
   └───────────────────────┘         - Increment usage
                                     - Store full transcript
```

### ElevenLabs SDK Usage

```typescript
const conversation = useConversation({
  onConnect: () => {
    // Session active - show audio visualizer
  },
  onDisconnect: () => {
    // Session ended - save local transcript
  },
  onMessage: (message) => {
    // Real-time transcription
    // message.source: "user" | "agent"
    // message.message: string
  },
  onError: (error) => {
    // Handle connection/session errors
  },
});

// Start session with dynamic variables
await conversation.startSession({
  agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID,
  dynamicVariables: {
    user_id: user.id,
    lesson_instructions: generatedInstructions,
  },
});
```

## Lesson Generation Pipeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     Lesson Generation Pipeline                           │
└─────────────────────────────────────────────────────────────────────────┘

1. User selects language
          │
          ▼
2. ┌──────────────────────────────────────────────────────────────────────┐
   │  Check for structured curriculum                                      │
   │  (src/lib/curriculum/languages/)                                      │
   └─────────────────────────────┬────────────────────────────────────────┘
                                 │
           ┌─────────────────────┼─────────────────────┐
           │                     │                     │
           ▼                     ▼                     ▼
   ┌───────────────┐    ┌───────────────┐    ┌───────────────┐
   │   Spanish     │    │    French     │    │  No Curriculum│
   │   German      │    │   Italian     │    │   (others)    │
   │   Curriculum  │    │   Curriculum  │    │               │
   └───────┬───────┘    └───────┬───────┘    └───────┬───────┘
           │                     │                     │
           ▼                     ▼                     ▼
   ┌───────────────────────────────────────────────────────────────────┐
   │  3. Fetch lesson history from Supabase                            │
   │     - Previous lessons completed                                   │
   │     - Vocabulary introduced                                        │
   │     - Areas of difficulty                                          │
   └───────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
   ┌───────────────────────────────────────────────────────────────────┐
   │  4. Generate lesson with Claude API                               │
   │                                                                   │
   │  System prompt includes:                                          │
   │  - Socratic teaching method principles                            │
   │  - Curriculum context (if available)                              │
   │  - Student's lesson history                                       │
   │  - Target language + native language                              │
   └───────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
   ┌───────────────────────────────────────────────────────────────────┐
   │  5. Inject into ElevenLabs agent via dynamic_variables            │
   └───────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Authentication Flow

```
┌─────────┐     ┌──────────────┐     ┌──────────────┐     ┌───────────┐
│  User   │────►│   Supabase   │────►│    Auth      │────►│  Session  │
│  Login  │     │   Auth UI    │     │   Provider   │     │   JWT     │
└─────────┘     └──────────────┘     └──────────────┘     └─────┬─────┘
                                                                 │
                      ┌──────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  AuthContext                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  onAuthStateChange listener                                        │ │
│  │    │                                                               │ │
│  │    ├──► Update user state                                          │ │
│  │    ├──► Fetch user profile from 'users' table                      │ │
│  │    └──► Set isLoading = false                                      │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### Payment Flow

```
┌─────────┐     ┌──────────────┐     ┌──────────────┐     ┌───────────┐
│  User   │────►│   Checkout   │────►│   Stripe     │────►│  Webhook  │
│  Click  │     │   Session    │     │   Checkout   │     │ Delivery  │
└─────────┘     └──────────────┘     └──────────────┘     └─────┬─────┘
                                                                 │
                      ┌──────────────────────────────────────────┘
                      ▼
              ┌───────────────────┐
              │ /api/stripe/      │
              │ webhooks          │
              │                   │
              │ 1. Verify sig     │
              │ 2. Parse event    │
              │ 3. Update DB      │
              └───────────────────┘
                      │
                      ▼
    ┌─────────────────────────────────────────────────────────┐
    │  Event: checkout.session.completed                       │
    │    → Create/update subscription record                   │
    │    → Initialize usage limits                             │
    │                                                          │
    │  Event: customer.subscription.updated                    │
    │    → Update subscription status                          │
    │    → Adjust usage limits                                 │
    │                                                          │
    │  Event: customer.subscription.deleted                    │
    │    → Mark subscription inactive                          │
    └─────────────────────────────────────────────────────────┘
```

## Database Schema

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Database Schema                                 │
└─────────────────────────────────────────────────────────────────────────┘

┌───────────────────┐       ┌───────────────────┐       ┌─────────────────┐
│      users        │       │   subscriptions   │       │      usage      │
├───────────────────┤       ├───────────────────┤       ├─────────────────┤
│ id (PK, FK auth)  │───┐   │ id (PK)           │   ┌───│ id (PK)         │
│ email             │   │   │ user_id (FK)──────┼───┤   │ user_id (FK)────┼───┐
│ native_language   │   │   │ stripe_customer_id│   │   │ usage_count     │   │
│ learning_language │   └──►│ stripe_sub_id     │   │   │ usage_limit     │   │
│ created_at        │       │ status            │   │   │ period_start    │   │
│ updated_at        │       │ price_id          │   │   │ period_end      │   │
└───────────────────┘       │ current_period_end│   │   └─────────────────┘   │
                            └───────────────────┘   │                          │
                                                    │                          │
┌───────────────────┐       ┌───────────────────────┴──────────────────────────┘
│      lesson       │       │
├───────────────────┤       │
│ id (PK)           │       │
│ user (FK)─────────┼───────┘
│ language          │
│ lesson_number     │
│ transcript        │
│ created_at        │
└───────────────────┘

┌───────────────────────────┐
│ conversation_transcripts  │
├───────────────────────────┤
│ id (PK)                   │
│ user_id (FK)              │
│ call_id                   │
│ transcript                │
│ duration                  │
│ created_at                │
└───────────────────────────┘
```

### Row Level Security

All tables have RLS enabled:

```sql
-- Users can only read their own data
CREATE POLICY "Users read own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can only read their own lessons
CREATE POLICY "Users read own lessons" ON lesson
  FOR SELECT USING (auth.uid() = user);
```

## API Routes

### App Router (/app/api/)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/generate-lesson` | POST | Generate lesson instructions via Claude |
| `/api/language/add` | POST | Add new language for user |
| `/api/auth/signup` | POST | User registration |

### Pages Router (/pages/api/)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/stripe/checkout-session` | POST | Create Stripe checkout |
| `/api/stripe/customer-portal` | POST | Stripe customer portal |
| `/api/stripe/webhooks` | POST | Handle Stripe events |
| `/api/elevenlabs/webhooks` | POST | Handle call events |

## Third-Party Integrations

### ElevenLabs Conversational AI

- **Purpose**: Real-time voice conversations
- **SDK**: `@elevenlabs/react`
- **Connection**: WebSocket
- **Webhooks**: Post-call transcription events

### Anthropic Claude

- **Purpose**: Lesson content generation
- **SDK**: `@anthropic-ai/sdk`
- **Model**: Claude (conversation generation)

### Stripe

- **Purpose**: Subscription payments
- **SDK**: `stripe`
- **Webhooks**: Payment and subscription events

### Supabase

- **Purpose**: Database + Authentication
- **SDK**: `@supabase/supabase-js`
- **Features**: PostgreSQL, Row Level Security, Auth

## Security Considerations

### Webhook Verification

All webhook endpoints verify signatures:

```typescript
// ElevenLabs webhook signature verification
const signature = req.headers['elevenlabs-signature'];
const expectedSig = crypto
  .createHmac('sha256', process.env.ELEVENLABS_WEBHOOK_SECRET)
  .update(rawBody)
  .digest('hex');

if (signature !== expectedSig) {
  return res.status(400).json({ error: 'Invalid signature' });
}
```

### Environment Variable Security

- Server-side secrets never exposed to client
- `NEXT_PUBLIC_` prefix only for public values
- Service role key used only in API routes

### Client vs Server Supabase

```typescript
// WRONG - service key in browser
"use client"
import supabaseClient from "@/lib/supabase"; // ❌

// CORRECT - anon key in browser
"use client"
import { supabaseBrowserClient } from "@/lib/supabase-browser"; // ✅
```

### Input Validation

- Validate all API inputs
- Sanitize user-provided content
- Use typed schemas (Zod) where applicable
