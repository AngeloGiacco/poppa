# CLAUDE.md

> This file provides guidance to Claude Code (claude.ai/code) when working with this codebase.

---

## Project Overview

**Poppa** is a conversational AI language tutoring platform that uses the Socratic method to teach languages through voice interactions. Built on ElevenLabs Conversational AI and LiveKit, it enables students to learn any of 50+ languages through natural spoken dialogue rather than traditional text-based methods. Live at [trypoppa.com](https://trypoppa.com).

### Philosophy

- **Socratic Method**: Learning through guided questioning and discovery, not rote memorization
- **Voice-First**: Natural language immersion via real-time voice conversations
- **Global Accessibility**: Full UI in 40+ languages, teaching 50+ languages
- **AI-Powered Personalization**: Claude generates lessons based on student history

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS, shadcn/ui (Radix primitives) |
| Voice/Video | LiveKit Client & Server SDK |
| AI | Anthropic Claude (lesson generation), ElevenLabs (conversational AI) |
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
│   │   │       ├── generate-lesson/
│   │   │       ├── elevenlabs-webhook/
│   │   │       ├── language/add/
│   │   │       └── token/
│   │   │
│   │   ├── components/       # React components
│   │   │   ├── ui/           # shadcn/ui primitives
│   │   │   ├── Chat.tsx      # Main lesson UI
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   ├── LanguageSelector.tsx
│   │   │   ├── session-controls.tsx
│   │   │   ├── connect-button.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   │
│   │   ├── context/          # React Context providers
│   │   │   └── AuthContext.tsx
│   │   │
│   │   ├── hooks/            # Custom React hooks
│   │   │   ├── use-agent.tsx           # LiveKit agent state
│   │   │   ├── use-connection.tsx      # WebSocket connection
│   │   │   ├── use-playground-state.tsx
│   │   │   └── use-toast.ts
│   │   │
│   │   ├── lib/              # Utilities
│   │   │   ├── supabase.ts             # Server-side client
│   │   │   ├── supabase-browser.ts     # Browser client
│   │   │   ├── supportedLanguages.ts   # Language definitions
│   │   │   ├── lesson-utils.ts
│   │   │   └── utils.ts                # cn() helper
│   │   │
│   │   ├── types/            # TypeScript definitions
│   │   │   └── database.types.ts       # Supabase generated
│   │   │
│   │   ├── i18n/             # Internationalization
│   │   │   └── routing.ts
│   │   │
│   │   └── middleware.ts     # i18n routing middleware
│   │
│   ├── messages/             # Translation JSON files (40+ locales)
│   │   ├── en.json
│   │   ├── es.json
│   │   ├── fr.json
│   │   └── ...
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── next.config.mjs
│   └── jest.config.js
│
└── supabase/
    └── migrations/           # Database migrations
        ├── 20240729000000_create_subscriptions_table.sql
        ├── 20240729000001_create_usage_table.sql
        ├── 20240729000002_create_increment_user_usage_rpc.sql
        └── 20240729000003_create_conversation_transcripts_table.sql
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

## Code Patterns

### Component with LiveKit Voice

```typescript
"use client";

import { useVoiceAssistant, BarVisualizer } from "@livekit/components-react";
import { useAgent } from "@/hooks/use-agent";
import { useConnection } from "@/hooks/use-connection";

export function LessonComponent() {
  const { audioTrack, state } = useVoiceAssistant();
  const { agent, displayTranscriptions } = useAgent();
  const { disconnect } = useConnection();

  return (
    <div>
      <BarVisualizer state={state} trackRef={audioTrack} barCount={5} />
      {displayTranscriptions.map((t) => (
        <p key={t.segment.id}>{t.segment.text}</p>
      ))}
    </div>
  );
}
```

### Protected Route Pattern

```typescript
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) return <Loading />;
  if (!user) return null;

  return <>{children}</>;
}
```

### API Route with Claude

```typescript
import { Anthropic } from "@anthropic-ai/sdk";
import supabaseClient from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { languageCode, nativeLanguage } = await req.json();

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 4000,
      messages: [{ role: "user", content: instruction }],
    });

    const contentBlock = response.content[0];
    if (contentBlock.type !== "text") {
      throw new Error("Unexpected response type");
    }

    return Response.json({ instruction: contentBlock.text });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
```

### Custom Hook with Context

```typescript
import { createContext, useContext, useState, useEffect } from "react";

interface AgentContextType {
  displayTranscriptions: Transcription[];
  agent?: RemoteParticipant;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const [displayTranscriptions, setDisplayTranscriptions] = useState<Transcription[]>([]);

  // LiveKit room event handling
  useEffect(() => {
    // Subscribe to transcription events
  }, []);

  return (
    <AgentContext.Provider value={{ displayTranscriptions, agent }}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error("useAgent must be used within an AgentProvider");
  }
  return context;
}
```

### Supabase Query with RLS

```typescript
// Client-side - user can only read their own data (RLS enforced)
const { data: profile } = await supabaseBrowserClient
  .from("users")
  .select("*")
  .eq("id", session.user.id)
  .single();

// Server-side with service role - bypass RLS for webhooks
const { data, error } = await supabaseClient
  .from("subscriptions")
  .upsert({
    user_id: userId,
    stripe_subscription_id: subscriptionId,
    status: "active",
  });
```

---

## Testing Patterns

### Test Setup

```typescript
// jest.setup.js mocks:
// - next/navigation (useRouter, usePathname, etc.)
// - @supabase/supabase-js
// - stripe
// - next-intl
```

### API Route Test

```typescript
import { POST } from "@/app/api/stripe/webhooks/route";

describe("Stripe Webhooks", () => {
  it("handles subscription created event", async () => {
    const mockEvent = {
      type: "customer.subscription.created",
      data: { object: { customer: "cus_xxx" } },
    };

    const req = new Request("http://test", {
      method: "POST",
      body: JSON.stringify(mockEvent),
    });

    const response = await POST(req);
    expect(response.status).toBe(200);
  });
});
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

```sql
-- Example: users can only read their own subscriptions
CREATE POLICY "Allow users to select their own subscription"
ON subscriptions FOR SELECT
USING (auth.uid() = user_id);
```

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

### 3. Not Using Translations

```typescript
// ❌ Wrong - hardcoded text
<Button>Start Lesson</Button>

// ✅ Correct
const t = useTranslations("Dashboard");
<Button>{t("startLesson")}</Button>
```

### 4. Relative Imports

```typescript
// ❌ Wrong
import { Chat } from "../../components/Chat";

// ✅ Correct
import { Chat } from "@/components/Chat";
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

### 6. Forgetting Error Boundaries in API Routes

```typescript
// ❌ Wrong - unhandled errors
export async function POST(req: Request) {
  const data = await req.json();
  const result = await riskyOperation(data);
  return Response.json(result);
}

// ✅ Correct
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const result = await riskyOperation(data);
    return Response.json(result);
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ error: "Operation failed" }, { status: 500 });
  }
}
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
- [ ] Linting passes: `pnpm lint`
- [ ] Formatting passes: `pnpm format:check`
