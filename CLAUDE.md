# CLAUDE.md

> This file provides guidance to Claude Code (claude.ai/code) when working with this codebase.

---

## Project Overview

**Poppa** is a conversational AI language tutoring platform inspired by the [Language Transfer](https://www.languagetransfer.org/) project and its "Thinking Method." Built on ElevenLabs Conversational AI, Poppa teaches 50+ languages through real-time voice conversations using the Socratic method—guiding students to discover language patterns through thinking rather than memorization. Live at [trypoppa.com](https://trypoppa.com).

---

## Core Philosophy: The Thinking Method

Poppa is built on the pedagogical approach pioneered by Mihalis Eleftheriou's Language Transfer project. This is not traditional language learning—it's a fundamentally different way to acquire language through guided discovery.

### What is The Thinking Method?

The Thinking Method (also called Language Transfer) teaches languages by leading students through carefully sequenced questions that help them discover patterns on their own. Key principles:

- **No Memorization**: Students don't memorize vocabulary lists or grammar tables. Instead, they discover patterns that make the language logical and predictable.
- **No Writing**: All learning happens through listening and speaking. Writing comes later, naturally.
- **Thinking Over Repetition**: Instead of drilling phrases, students learn to construct language by understanding the thoughts behind it.
- **Building on What You Know**: Lessons leverage the student's native language to reveal hidden connections and cognates.
- **One Thought at a Time**: Complex concepts are broken into small, digestible pieces that build on each other.

### The Socratic Teaching Pattern

```
1. Present a small piece of language
2. Ask questions that lead students to notice patterns
3. Help students deduce how and why patterns work
4. Build gradually on what students discover
5. Use errors as discovery opportunities
```

### What This Means for Development

When building features for Poppa, always remember:

- **Voice is primary**: Every feature should work through spoken interaction
- **Guide, don't tell**: The AI should ask questions, not give answers
- **Respect the method**: Never add features that encourage memorization or drilling
- **Keep it simple**: The interface should fade away—the conversation is everything

---

## Voice-Only Architecture

**Core Principle**: Poppa is a voice-only application. Learning happens through spoken dialogue, not text-based exercises.

### Why Voice-Only?

1. **Natural Language Immersion**: Speaking activates deeper language processing than reading/writing
2. **No Crutches**: Students can't rely on text to "figure out" what to say
3. **Real Conversation Skills**: Students develop actual speaking ability from day one
4. **Accessibility**: Works for learners who may struggle with text-based learning
5. **True to Method**: Language Transfer's original audio courses are purely voice-based

### Design Implications

| DO | DON'T |
|----|-------|
| Audio visualizers showing conversation state | Text input fields for responses |
| Voice-activated controls | Written exercises or quizzes |
| Spoken feedback and corrections | On-screen vocabulary lists |
| Audio-only lesson content | Reading comprehension features |
| Minimal UI that stays out of the way | Complex text-heavy interfaces |

### The Conversation Flow

```
User clicks "Connect"
    ↓
Microphone permission requested
    ↓
WebSocket connection to ElevenLabs
    ↓
Real-time voice conversation begins
    ↓
Tutor guides through Socratic questioning
    ↓
Student responds verbally
    ↓
Session ends → transcript saved
```

---

## ElevenLabs Conversational AI Infrastructure

Poppa uses [ElevenLabs Conversational AI](https://elevenlabs.io/docs/conversational-ai/overview) as the voice conversation backbone. This enables real-time, natural voice interactions with an AI tutor.

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend                                 │
│  ┌─────────────────┐    ┌─────────────────┐                     │
│  │  Chat.tsx       │    │  @elevenlabs/   │                     │
│  │  (Voice UI)     │◄──►│  react SDK      │                     │
│  └────────┬────────┘    └────────┬────────┘                     │
│           │                      │                               │
└───────────┼──────────────────────┼──────────────────────────────┘
            │                      │
            │ Transcriptions       │ WebSocket
            ▼                      ▼
┌─────────────────────┐    ┌─────────────────────┐
│    Supabase         │    │   ElevenLabs        │
│  - lesson history   │    │   Agent             │
│  - transcripts      │◄───│  - Voice synthesis  │
│  - user credits     │    │  - Speech-to-text   │
└─────────────────────┘    │  - Conversation AI  │
                           └──────────┬──────────┘
                                      │
                                      │ Dynamic Variables
                                      │ & System Prompt
                                      ▼
                           ┌─────────────────────┐
                           │   Claude API        │
                           │  (Lesson Generation)│
                           └─────────────────────┘
```

### React SDK Integration

The `@elevenlabs/react` package provides the `useConversation` hook for voice interactions:

```typescript
"use client";

import { useConversation } from "@elevenlabs/react";

export function Chat() {
  const conversation = useConversation({
    onConnect: () => {
      // Session started - show visualizer
    },
    onDisconnect: () => {
      // Session ended - save transcript
    },
    onMessage: (message) => {
      // Real-time transcription: message.source ("user" | "agent")
    },
    onError: (error) => {
      // Handle connection/session errors
    },
  });

  const handleConnect = async () => {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    await conversation.startSession({
      agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID,
      connectionType: "websocket",
    });
  };

  return (
    <div>
      <p>Status: {conversation.status}</p>
      <p>Agent Speaking: {conversation.isSpeaking}</p>
    </div>
  );
}
```

### Client Tools (Future Enhancement)

ElevenLabs supports [client tools](https://elevenlabs.io/docs/conversational-ai/customization/tools/client-tools) that allow the agent to trigger actions in the browser during conversation. Potential use cases for Poppa:

```typescript
// Example: Client tool for vocabulary tracking
const conversation = useConversation({
  clientTools: {
    markVocabularyLearned: async ({ word, translation }) => {
      // Save vocabulary to user's progress
      await saveVocabulary(userId, word, translation);
      return "Vocabulary saved";
    },
    adjustDifficulty: async ({ level }) => {
      // Agent detects student struggling/excelling
      setLessonDifficulty(level);
      return `Difficulty set to ${level}`;
    },
    requestHint: async ({ topic }) => {
      // Student asks for help
      const hint = await generateHint(topic);
      return hint;
    },
  },
});
```

Client tools enable the voice agent to:
- Track vocabulary mastery in real-time
- Adjust lesson difficulty dynamically
- Log student progress without breaking conversation flow
- Trigger visual feedback (though minimal, per voice-only philosophy)

### Webhook Integration

ElevenLabs sends webhooks after calls for server-side processing:

```typescript
// POST /api/elevenlabs-webhook
// Receives: post_call_transcription events
// Actions:
//   1. Verify webhook signature (HMAC-SHA256)
//   2. Extract user_id from dynamic_variables
//   3. Save full transcript to conversation_transcripts table
//   4. Update user usage credits
```

### Lesson Generation Pipeline

1. **User starts lesson** → Frontend calls `/api/generate-lesson`
2. **Claude generates transcript** → Based on Socratic method + lesson history
3. **ElevenLabs receives instructions** → System prompt with generated transcript
4. **Voice conversation begins** → Agent guides student through the lesson
5. **Session ends** → Transcript saved, credits deducted

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS, shadcn/ui (Radix primitives) |
| Voice | ElevenLabs Conversational AI (@elevenlabs/react) |
| AI | Anthropic Claude (lesson generation), ElevenLabs (voice conversations) |
| Database | Supabase (PostgreSQL + Auth) |
| Payments | Stripe |
| i18n | next-intl (40+ locales) |
| Package Manager | pnpm 9.6.0 |
| Testing | Jest + ts-jest |

---

## Critical Rules

### 1. USE CLIENT DIRECTIVE

All components using hooks, context, or browser APIs must have `"use client"` at the top:

```typescript
// ✅ Correct - client component with hooks
"use client"

import { useState, useEffect } from "react";

export function Chat() {
  const [state, setState] = useState(null);
  // ...
}

// ❌ Wrong - missing directive with hooks
import { useState } from "react";

export function Chat() {
  const [state, setState] = useState(null); // Will fail
}
```

### 2. PATH ALIAS IMPORTS

Always use the `@/*` path alias for imports. Never use relative imports:

```typescript
// ✅ Correct - path alias
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import supabaseClient from "@/lib/supabase";

// ❌ Wrong - relative imports
import { Button } from "../../components/ui/button";
import { useAuth } from "../context/AuthContext";
```

### 3. SEPARATE SERVER/BROWSER SUPABASE CLIENTS

Use the correct Supabase client based on context:

```typescript
// ✅ Server-side (API routes, server components)
import supabaseClient from "@/lib/supabase";

// ✅ Client-side (browser, client components)
import { supabaseBrowserClient } from "@/lib/supabase-browser";

// ❌ Wrong - using server client in browser
"use client"
import supabaseClient from "@/lib/supabase"; // Will throw error
```

### 4. TYPED DATABASE QUERIES

Always use the generated Database types for type-safe Supabase queries:

```typescript
// ✅ Correct - typed queries
import { Database } from "@/types/database.types";
import { Tables } from "@/types/database.types";

type UserProfile = Database['public']['Tables']['users']['Row'];
type Lesson = Tables<'lesson'>;

const { data } = await supabaseClient
  .from('lesson')
  .select('*')
  .eq('user', userId);

// ❌ Wrong - untyped queries
const { data } = await supabaseClient
  .from('lesson')
  .select('*'); // No type inference
```

### 5. CONTEXT PATTERN FOR GLOBAL STATE

Use React Context with custom hooks for shared state:

```typescript
// ✅ Correct - context with typed hook
const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ❌ Wrong - context without null check
export const useAuth = () => {
  return useContext(AuthContext); // Can return null
};
```

### 6. API ROUTE PATTERN

Use Next.js App Router API conventions with proper error handling:

```typescript
// ✅ Correct - App Router API route
export async function POST(req: Request) {
  try {
    const { data } = await req.json();

    // Business logic here

    return Response.json({ result });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: 'Failed' }, { status: 500 });
  }
}

// ❌ Wrong - Pages Router style
export default async function handler(req, res) {
  res.json({ data });
}
```

### 7. INTERNATIONALIZATION

Use `next-intl` for all user-facing text:

```typescript
// ✅ Correct - using translations
import { useTranslations } from "next-intl";

export function Chat() {
  const t = useTranslations("Chat");

  return <p>{t("errors.sessionSave.title")}</p>;
}

// ❌ Wrong - hardcoded strings
export function Chat() {
  return <p>Session save failed</p>;
}
```

### 8. NO AI SLOP COMMENTS

Never add redundant, obvious, or boilerplate comments:

```typescript
// ✅ Correct - code is self-documenting
interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

// ❌ Wrong - AI slop comments
interface AuthContextType {
  user: User | null; // The current user
  userProfile: UserProfile | null; // The user's profile data
  isLoading: boolean; // Loading state
  logout: () => Promise<void>; // Function to log out
}
```

Only add comments when:
- Explaining **why** something non-obvious is done
- Documenting complex business logic (like transcription merging)
- Adding TODO/FIXME for known issues

### 9. VOICE-ONLY DESIGN

Never add features that bypass voice interaction:

```typescript
// ❌ Wrong - text input for language learning
<Input
  placeholder="Type your response..."
  onChange={handleTextInput}
/>

// ❌ Wrong - written vocabulary quiz
<Quiz questions={vocabularyQuestions} />

// ✅ Correct - voice-only interface
<ConnectButton onConnect={handleVoiceConnect} />
<AudioVisualizer isActive={conversation.isSpeaking} />
```

---

## Project Structure

```
poppa/
├── poppa_frontend/           # Main Next.js application
│   ├── src/
│   │   ├── app/              # Next.js App Router
│   │   │   ├── [locale]/     # i18n dynamic routes
│   │   │   │   ├── page.tsx              # Landing page
│   │   │   │   ├── lesson/[language]/    # Lesson interface
│   │   │   │   ├── dashboard/            # User dashboard
│   │   │   │   ├── login/                # Authentication
│   │   │   │   ├── signup/
│   │   │   │   ├── profile/
│   │   │   │   └── pricing/
│   │   │   └── api/          # API routes
│   │   │       ├── auth/signup/
│   │   │       ├── generate-lesson/      # Claude lesson generation
│   │   │       ├── elevenlabs-webhook/   # Post-call processing
│   │   │       └── language/add/
│   │   │
│   │   ├── components/       # React components
│   │   │   ├── ui/           # shadcn/ui primitives
│   │   │   ├── Chat.tsx      # Main voice UI (ElevenLabs conversation)
│   │   │   ├── session-controls.tsx      # Disconnect button
│   │   │   ├── connect-button.tsx        # Start lesson button
│   │   │   └── ProtectedRoute.tsx
│   │   │
│   │   ├── context/          # React Context providers
│   │   │   └── AuthContext.tsx
│   │   │
│   │   ├── hooks/            # Custom React hooks
│   │   │   ├── useLesson.tsx
│   │   │   └── use-toast.ts
│   │   │
│   │   ├── lib/              # Utilities
│   │   │   ├── supabase.ts             # Server-side client
│   │   │   ├── supabase-browser.ts     # Browser client
│   │   │   ├── lesson-utils.ts         # Socratic method prompts
│   │   │   ├── supportedLanguages.ts   # Language definitions
│   │   │   ├── curriculum/             # Structured lesson curricula
│   │   │   │   ├── curriculum-framework.ts
│   │   │   │   ├── context-injection.ts
│   │   │   │   └── languages/          # Spanish, French, German, Italian
│   │   │   └── utils.ts                # cn() helper
│   │   │
│   │   ├── types/            # TypeScript definitions
│   │   │   ├── database.types.ts       # Supabase generated
│   │   │   └── curriculum.types.ts     # Lesson structures
│   │   │
│   │   ├── i18n/             # Internationalization
│   │   │   └── routing.ts
│   │   │
│   │   └── middleware.ts     # i18n routing middleware
│   │
│   ├── messages/             # Translation JSON files (40+ locales)
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.ts
│
└── supabase/
    └── migrations/           # Database migrations
```

---

## Lesson System

### The Thinking Method Prompt

The core Socratic teaching instructions are defined in `src/lib/lesson-utils.ts`:

```typescript
// Core principles injected into every lesson
const principles = `
• Never directly explain grammar rules
• Never ask students to memorize anything
• Always break concepts into discoverable pieces
• Guide through questions rather than statements
• Use students' native language to build understanding
• Treat errors as discovery opportunities
• Keep explanations minimal—focus on understanding over practice
`;
```

### Curriculum System

Structured curricula exist for Spanish, French, German, and Italian in `src/lib/curriculum/`. Each lesson includes:

```typescript
interface Lesson {
  id: number;
  title: string;
  level: "beginner" | "intermediate" | "advanced";
  focus: string;
  grammar: GrammarPoint[];      // What patterns to discover
  vocabulary: VocabularyItem[]; // Words introduced in context
  conversationPrompt: string;   // Teaching instructions
}
```

### Lesson Generation Flow

```
User selects language
        ↓
Check for structured curriculum
        ↓
    ┌───┴───┐
    ▼       ▼
Curriculum   No curriculum
exists       → Claude generates
    ↓          lesson based on
Use pre-      history
defined       ↓
lesson    Generate transcript
    ↓         ↓
    └────┬────┘
         ↓
Inject Socratic method instructions
         ↓
Send to ElevenLabs agent
         ↓
Voice conversation begins
```

---

## Common Commands

```bash
# Navigate to frontend
cd poppa_frontend

# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Linting
pnpm lint
pnpm lint:fix

# Formatting
pnpm format:check
pnpm format:write

# Testing
npm test
```

---

## Database Schema

### Tables

| Table | Purpose |
|-------|---------|
| `users` | Extended user profiles (linked to auth.users) |
| `subscriptions` | Stripe subscription tracking |
| `usage` | Per-user credit/usage tracking |
| `lesson` | Lesson history and transcripts |
| `languages` | Supported language reference |
| `conversation_transcripts` | ElevenLabs conversation logs |

### Row Level Security

All tables have RLS enabled:
- Users can only SELECT their own data
- Server operations use service role key
- Webhooks bypass RLS via service role

---

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...        # Browser client
SUPABASE_KEY=eyJ...                          # Server service role

# AI
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=...
ELEVENLABS_WEBHOOK_SECRET=...

# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRICE_ID_HOBBY=price_...
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_...

# App
NEXT_PUBLIC_APP_URL=https://trypoppa.com
```

---

## Supported Languages

Poppa supports 50+ languages for learning, including:

**Major Languages**: English, Chinese, Spanish, Hindi, Portuguese, French, German, Japanese, Arabic, Russian, Korean, Indonesian, Italian, Dutch, Turkish, Polish, Swedish

**Regional Languages**: Tamil, Bengali, Gujarati, Malayalam, Marathi, Kannada, Telugu, Punjabi, Urdu

**European**: Ukrainian, Greek, Czech, Danish, Finnish, Bulgarian, Croatian, Slovak, Hungarian, Norwegian, Romanian

**Others**: Vietnamese, Filipino, Swahili, Thai, Hebrew, Persian, and more

See `src/lib/supportedLanguages.ts` for the complete list with ISO 639 codes and flag mappings.

---

## Common Mistakes to Avoid

### 1. Missing "use client"

```typescript
// ❌ Wrong - hooks in server component
import { useState } from "react";
export function Form() {
  const [value, setValue] = useState(""); // Error!
}

// ✅ Correct
"use client"
import { useState } from "react";
export function Form() {
  const [value, setValue] = useState("");
}
```

### 2. Wrong Supabase Client

```typescript
// ❌ Wrong - server client in client component
"use client"
import supabaseClient from "@/lib/supabase"; // Throws error!

// ✅ Correct
"use client"
import { supabaseBrowserClient } from "@/lib/supabase-browser";
```

### 3. Breaking Voice-Only Philosophy

```typescript
// ❌ Wrong - adding text-based learning features
<FlashcardDeck vocabulary={lessonVocabulary} />
<WritingExercise prompt="Write a sentence using..." />
<MultipleChoiceQuiz questions={grammarQuestions} />

// ✅ Correct - keep it voice-only
<VoiceConversation onConnect={startLesson} />
```

### 4. Not Using Translations

```typescript
// ❌ Wrong - hardcoded text
<Button>Start Lesson</Button>

// ✅ Correct
const t = useTranslations("Dashboard");
<Button>{t("startLesson")}</Button>
```

### 5. Not Handling Auth State

```typescript
// ❌ Wrong - no loading state
const { user } = useAuth();
return <Dashboard user={user} />; // Can be null!

// ✅ Correct
const { user, isLoading } = useAuth();
if (isLoading) return <Loading />;
if (!user) return <Redirect to="/login" />;
return <Dashboard user={user} />;
```

---

## Quality Checklist

Before committing, ensure:

- [ ] All imports use `@/*` path alias
- [ ] Client components have `"use client"` directive
- [ ] Correct Supabase client used (browser vs server)
- [ ] User-facing text uses `next-intl` translations
- [ ] Auth state properly handled (loading, null checks)
- [ ] API routes have try/catch error handling
- [ ] No hardcoded strings in UI
- [ ] No redundant comments (AI slop)
- [ ] Types imported from `@/types/database.types`
- [ ] **Voice-only principle respected** (no text-based learning features)
- [ ] Linting passes: `pnpm lint`
- [ ] Formatting passes: `pnpm format:check`

---

## Resources

- [Language Transfer](https://www.languagetransfer.org/) - The original Thinking Method courses
- [ElevenLabs Conversational AI Docs](https://elevenlabs.io/docs/conversational-ai/overview)
- [ElevenLabs React SDK](https://elevenlabs.io/docs/conversational-ai/libraries/react)
- [ElevenLabs Client Tools](https://elevenlabs.io/docs/conversational-ai/customization/tools/client-tools)
