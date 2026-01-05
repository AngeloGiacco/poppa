# React Native Deployment Plan for Poppa

This document outlines the strategy for deploying Poppa as a native mobile application using React Native and the ElevenLabs React Native SDK.

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [ElevenLabs SDK Comparison](#elevenlabs-sdk-comparison)
3. [Architecture Decision: Expo vs Bare React Native](#architecture-decision-expo-vs-bare-react-native)
4. [Dependencies & Installation](#dependencies--installation)
5. [Project Structure](#project-structure)
6. [Component Migration Strategy](#component-migration-strategy)
7. [Authentication Flow](#authentication-flow)
8. [API Integration](#api-integration)
9. [Platform-Specific Considerations](#platform-specific-considerations)
10. [UI/UX Adaptation](#uiux-adaptation)
11. [Testing Strategy](#testing-strategy)
12. [App Store Deployment](#app-store-deployment)
13. [Phased Implementation Roadmap](#phased-implementation-roadmap)
14. [Risk Assessment](#risk-assessment)
15. [Resources](#resources)

---

## Executive Summary

Poppa's voice-first architecture aligns well with a native mobile deployment. The ElevenLabs React Native SDK (`@elevenlabs/react-native`) provides first-class support for conversational AI agents on iOS and Android, using WebRTC via LiveKit for real-time audio streaming.

### Key Findings

| Aspect | Assessment |
|--------|------------|
| **ElevenLabs RN SDK** | Official SDK available with Expo support |
| **API Compatibility** | Web SDK and RN SDK share similar `useConversation` API |
| **Backend Changes** | None required - existing API routes work as-is |
| **Primary Challenge** | UI component library replacement (Radix → RN equivalents) |
| **Recommended Approach** | Expo managed workflow with development builds |

---

## ElevenLabs SDK Comparison

### Web SDK (`@elevenlabs/react`)

Current implementation in `poppa_frontend/src/components/Chat.tsx`:

```typescript
import { useConversation } from "@elevenlabs/react";

const conversation = useConversation({
  onConnect: () => { /* ... */ },
  onDisconnect: () => { /* ... */ },
  onMessage: (message) => { /* ... */ },
  onError: (error) => { /* ... */ },
});

await conversation.startSession({
  agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID,
  connectionType: "websocket",
  overrides: { agent: { prompt, language, firstMessage } },
  dynamicVariables: { user_id, target_language },
});
```

### React Native SDK (`@elevenlabs/react-native`)

The RN SDK provides a nearly identical API:

```typescript
import { ElevenLabsProvider, useConversation } from "@elevenlabs/react-native";

// Wrap app with provider
<ElevenLabsProvider>
  <App />
</ElevenLabsProvider>

// Hook usage is similar
const conversation = useConversation({
  onConnect: ({ conversationId }) => { /* ... */ },
  onDisconnect: () => { /* ... */ },
  onMessage: (message) => { /* ... */ },
  onError: (error) => { /* ... */ },
});

await conversation.startSession({
  agentId: "your-agent-id",
  // overrides and dynamicVariables supported
});
```

### API Differences

| Feature | Web SDK | React Native SDK |
|---------|---------|------------------|
| Provider | Not required | `ElevenLabsProvider` required |
| Connection | WebSocket | WebRTC via LiveKit |
| Audio Handling | Browser APIs | Native audio via LiveKit |
| `connectionType` | `"websocket"` | Not needed (WebRTC default) |
| Additional Methods | — | `sendUserMessage()`, `sendContextualUpdate()`, `setMicMuted()` |
| Audio Mixing | — | `allowMixingWithOthers` option |

### Migration Effort: Low

The hook API is largely compatible. Main changes:
1. Add `ElevenLabsProvider` wrapper
2. Remove `connectionType: "websocket"` from session config
3. Replace `navigator.mediaDevices.getUserMedia()` with RN permissions

---

## Architecture Decision: Expo vs Bare React Native

### Recommendation: Expo Managed Workflow

The ElevenLabs React Native SDK is designed for Expo and includes first-class support.

| Factor | Expo Managed | Bare React Native |
|--------|--------------|-------------------|
| ElevenLabs SDK Support | ✅ Official | ⚠️ Requires native bridging |
| LiveKit Integration | ✅ Built-in plugin | ❌ Manual setup |
| OTA Updates | ✅ expo-updates | ❌ CodePush or manual |
| Build Pipeline | ✅ EAS Build | ❌ Xcode/Android Studio |
| Supabase Auth | ✅ Supported | ✅ Supported |
| Deep Linking | ✅ expo-linking | ✅ React Navigation |
| Development Speed | Fast | Slower |

### Important Constraints

- **Expo Go Not Supported**: Native modules require development builds
- **Development Build Required**: Use `eas build --profile development`

---

## Dependencies & Installation

### Core Dependencies

```bash
# React Native / Expo
npx create-expo-app@latest poppa-mobile --template blank-typescript

# ElevenLabs + LiveKit
npm install @elevenlabs/react-native
npm install @livekit/react-native @livekit/react-native-webrtc livekit-client
npm install @livekit/react-native-expo-plugin @config-plugins/react-native-webrtc

# Supabase
npm install @supabase/supabase-js
npm install @react-native-async-storage/async-storage

# Navigation
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context

# UI & Styling
npm install nativewind tailwindcss
npm install react-native-reanimated react-native-gesture-handler

# Internationalization
npm install react-i18next i18next

# Utilities
npm install react-hook-form zod @hookform/resolvers
npm install date-fns
npm install posthog-react-native

# Platform Features
npm install react-native-permissions
npm install @react-native-clipboard/clipboard
npm install react-native-share
npm install expo-linking
```

### app.json / app.config.js Configuration

```json
{
  "expo": {
    "plugins": [
      "@livekit/react-native-expo-plugin",
      [
        "@config-plugins/react-native-webrtc",
        {
          "cameraPermission": false,
          "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone for voice lessons"
        }
      ],
      [
        "expo-build-properties",
        {
          "ios": {
            "useFrameworks": "static"
          }
        }
      ]
    ],
    "ios": {
      "infoPlist": {
        "NSMicrophoneUsageDescription": "Poppa needs microphone access for voice-based language lessons",
        "UIBackgroundModes": ["audio"]
      }
    },
    "android": {
      "permissions": [
        "android.permission.RECORD_AUDIO",
        "android.permission.INTERNET",
        "android.permission.MODIFY_AUDIO_SETTINGS"
      ]
    }
  }
}
```

### index.js Setup

```javascript
import { registerGlobals } from "@livekit/react-native";

// Initialize LiveKit WebRTC globals
registerGlobals();

// Rest of app initialization
```

---

## Project Structure

```
poppa-mobile/
├── app.json                    # Expo configuration
├── App.tsx                     # Root component with providers
├── index.js                    # Entry point with LiveKit globals
├── src/
│   ├── app/                    # Screen components
│   │   ├── (auth)/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── SignupScreen.tsx
│   │   ├── (main)/
│   │   │   ├── DashboardScreen.tsx
│   │   │   ├── LessonScreen.tsx
│   │   │   └── ProfileScreen.tsx
│   │   └── (onboarding)/
│   │       └── LanguageSelectScreen.tsx
│   │
│   ├── components/
│   │   ├── Chat.tsx            # Voice conversation UI (migrated)
│   │   ├── ConnectButton.tsx
│   │   ├── SessionControls.tsx
│   │   ├── AudioVisualizer.tsx
│   │   └── ui/                 # RN component library
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── ...
│   │
│   ├── context/
│   │   └── AuthContext.tsx     # Supabase auth (migrated)
│   │
│   ├── hooks/
│   │   ├── useLesson.ts        # Lesson logic (portable)
│   │   └── useToast.ts
│   │
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client (adapted)
│   │   ├── analytics.ts        # PostHog RN
│   │   ├── lesson-utils.ts     # Portable
│   │   └── supportedLanguages.ts
│   │
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── MainNavigator.tsx
│   │
│   ├── i18n/
│   │   ├── index.ts            # i18next config
│   │   └── locales/            # Translation JSON files
│   │
│   └── types/
│       └── database.types.ts   # Portable from web
│
├── assets/
│   ├── fonts/
│   └── images/
│
└── tailwind.config.js          # NativeWind config
```

---

## Component Migration Strategy

### Component Migration Matrix

| Component | Web | React Native | Effort |
|-----------|-----|--------------|--------|
| **Chat.tsx** | `@elevenlabs/react` | `@elevenlabs/react-native` | Low |
| **AuthContext** | Supabase + localStorage | Supabase + AsyncStorage | Low |
| **LoginForm** | Radix + OAuth redirect | RN + expo-auth-session | Medium |
| **SignupForm** | Radix + react-hook-form | RN + react-hook-form | Medium |
| **Dashboard** | Next.js page | React Navigation screen | Medium |
| **LessonPage** | Next.js dynamic route | Stack screen with params | Medium |
| **UI Components** | shadcn/ui (Radix) | Custom RN or UI library | High |
| **Animations** | framer-motion | react-native-reanimated | Medium |
| **i18n** | next-intl | react-i18next | Low |

### Chat.tsx Migration

The core voice component migration is straightforward due to API similarity:

**Current (Web):**
```typescript
import { useConversation } from "@elevenlabs/react";

await navigator.mediaDevices.getUserMedia({ audio: true });
await conversation.startSession({
  agentId,
  connectionType: "websocket",
  overrides: { ... },
  dynamicVariables: { ... },
});
```

**Target (React Native):**
```typescript
import { useConversation } from "@elevenlabs/react-native";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";

// Request permissions
const permission = Platform.OS === "ios"
  ? PERMISSIONS.IOS.MICROPHONE
  : PERMISSIONS.ANDROID.RECORD_AUDIO;
const result = await request(permission);

if (result === RESULTS.GRANTED) {
  await conversation.startSession({
    agentId,
    overrides: { ... },
    dynamicVariables: { ... },
  });
}
```

### Browser API Replacements

| Browser API | React Native Equivalent |
|-------------|------------------------|
| `navigator.mediaDevices.getUserMedia()` | `react-native-permissions` + SDK handles audio |
| `document.visibilityState` | `AppState` from `react-native` |
| `navigator.clipboard.writeText()` | `@react-native-clipboard/clipboard` |
| `navigator.share()` | `react-native-share` |
| `localStorage` | `@react-native-async-storage/async-storage` |
| `window.location.origin` | Deep linking via `expo-linking` |

---

## Authentication Flow

### Current Web Flow

1. User enters credentials or clicks Google OAuth
2. Supabase handles OAuth redirect to `/auth/callback`
3. Session stored in browser storage
4. `AuthContext` manages state with `onAuthStateChange`

### React Native Flow

**Email/Password Authentication** (minimal changes):
```typescript
// Works identically
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
```

**OAuth Authentication** (requires deep linking):
```typescript
import * as AuthSession from "expo-auth-session";
import * as Linking from "expo-linking";

const redirectUri = AuthSession.makeRedirectUri({
  scheme: "poppa",
  path: "auth/callback",
});

const { data, error } = await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: redirectUri,
    skipBrowserRedirect: true,
  },
});

// Open auth URL in browser
if (data?.url) {
  await Linking.openURL(data.url);
}
```

### Deep Linking Configuration

**app.json:**
```json
{
  "expo": {
    "scheme": "poppa",
    "ios": {
      "associatedDomains": ["applinks:trypoppa.com"]
    },
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [{ "scheme": "poppa" }],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

### Supabase Client Adaptation

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false, // Disabled for RN
    },
  }
);
```

---

## API Integration

### Existing Backend Routes (No Changes Required)

All API routes can be called from React Native without modification:

| Endpoint | Purpose | Mobile Compatibility |
|----------|---------|---------------------|
| `POST /api/generate-lesson` | Claude lesson generation | ✅ Direct fetch |
| `POST /api/elevenlabs-webhook` | Post-call transcript save | ✅ No change (server-to-server) |
| `POST /api/auth/signup` | Email verification | ✅ Direct fetch |
| `POST /api/language/add` | Add learning language | ✅ Direct fetch |

### API Base URL Configuration

```typescript
// lib/api.ts
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://trypoppa.com";

export async function generateLesson(params: LessonParams) {
  const response = await fetch(`${API_BASE_URL}/api/generate-lesson`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  return response.json();
}
```

### Supabase RPC Calls (Portable)

```typescript
// These work identically in React Native
await supabase.rpc("increment_credits", { increment_amount: -minutes });
await supabase.rpc("update_user_streak", { p_user_id: id, p_minutes: minutes });
```

---

## Platform-Specific Considerations

### iOS

**Info.plist Requirements:**
- `NSMicrophoneUsageDescription` - Required for audio recording
- `UIBackgroundModes: ["audio"]` - Keep audio active when backgrounded

**App Transport Security:**
- Already configured for HTTPS (trypoppa.com uses SSL)

**Audio Session:**
```typescript
// For concurrent audio (notifications during lesson)
<ElevenLabsProvider options={{ allowMixingWithOthers: true }}>
```

### Android

**AndroidManifest.xml Permissions:**
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
```

**Audio Focus:**
- SDK handles `AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK` when `allowMixingWithOthers: true`

### Background Audio Handling

```typescript
import { AppState, AppStateStatus } from "react-native";

useEffect(() => {
  const subscription = AppState.addEventListener(
    "change",
    (nextState: AppStateStatus) => {
      if (nextState === "background" && conversation.status === "connected") {
        // Optionally pause or continue lesson
        // ElevenLabs SDK maintains WebRTC connection
      }
    }
  );
  return () => subscription.remove();
}, []);
```

---

## UI/UX Adaptation

### Styling Strategy: NativeWind

NativeWind allows reuse of Tailwind class names in React Native:

```typescript
// Web (current)
<div className="flex h-full min-h-[400px] flex-col p-4">

// React Native (with NativeWind)
<View className="flex-1 min-h-[400px] flex-col p-4">
```

### Component Library Options

| Option | Pros | Cons |
|--------|------|------|
| **Custom Components** | Full control, matches web design | More development time |
| **React Native Paper** | Material Design, well-maintained | Different aesthetic |
| **Tamagui** | Cross-platform, Tailwind-like | Learning curve |
| **Gluestack UI** | Modern, accessible | Newer ecosystem |

**Recommendation:** Custom components with NativeWind for design consistency with web app.

### Audio Visualizer Adaptation

```typescript
// Web (framer-motion)
<motion.div animate={{ height: isSpeaking ? random : 20 }} />

// React Native (react-native-reanimated)
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";

const animatedStyle = useAnimatedStyle(() => ({
  height: withSpring(isSpeaking ? 40 + Math.random() * 60 : 20),
}));

<Animated.View style={[styles.bar, animatedStyle]} />
```

### Navigation Structure

```typescript
// navigation/RootNavigator.tsx
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <SplashScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

---

## Testing Strategy

### Unit Tests

```bash
npm install --save-dev jest @testing-library/react-native
```

Portable test logic from web app; update component queries for RN.

### E2E Testing

```bash
npm install --save-dev detox
```

**Key Test Scenarios:**
1. User signup/login flow
2. Lesson start → voice connection established
3. Lesson end → transcript saved, credits deducted
4. OAuth deep link handling
5. Background/foreground audio continuity

### ElevenLabs Mock for Testing

```typescript
jest.mock("@elevenlabs/react-native", () => ({
  ElevenLabsProvider: ({ children }) => children,
  useConversation: () => ({
    status: "disconnected",
    isSpeaking: false,
    startSession: jest.fn(),
    endSession: jest.fn(),
  }),
}));
```

---

## App Store Deployment

### iOS App Store

**Requirements:**
- Apple Developer Program ($99/year)
- App Store Connect account
- Privacy Policy URL (already have)
- App Review Guidelines compliance

**Voice/AI Considerations:**
- Disclose AI-generated content in app description
- Microphone permission must have clear purpose string

**EAS Build:**
```bash
eas build --platform ios --profile production
eas submit --platform ios
```

### Google Play Store

**Requirements:**
- Google Play Console ($25 one-time)
- Privacy Policy URL
- Content rating questionnaire

**Permissions Disclosure:**
- Microphone usage must be justified
- Data safety section required

**EAS Build:**
```bash
eas build --platform android --profile production
eas submit --platform android
```

### Over-the-Air Updates

```bash
npm install expo-updates
```

Configure for non-native code updates without app store review.

---

## Phased Implementation Roadmap

### Phase 1: Project Setup & Core Infrastructure

**Tasks:**
- Initialize Expo project with TypeScript
- Configure ElevenLabs SDK with LiveKit dependencies
- Set up Supabase client with AsyncStorage
- Implement navigation structure
- Configure NativeWind for styling
- Set up i18next with existing translation files

**Deliverables:**
- Running development build on iOS/Android simulators
- Basic navigation between placeholder screens
- Supabase connection verified

---

### Phase 2: Authentication

**Tasks:**
- Port AuthContext with AsyncStorage
- Implement email/password login
- Implement email/password signup
- Configure OAuth deep linking for Google
- Add protected route logic

**Deliverables:**
- Complete auth flow on both platforms
- Session persistence across app restarts
- Google OAuth working via deep links

---

### Phase 3: Voice Conversation Core

**Tasks:**
- Port Chat.tsx to React Native SDK
- Implement microphone permission flow
- Build audio visualizer with Reanimated
- Implement session start/end handlers
- Port transcript saving logic
- Connect to existing ElevenLabs agent

**Deliverables:**
- Voice lessons functional on iOS and Android
- Transcripts saved to Supabase
- Credits deducted after lessons

---

### Phase 4: UI Components & Screens

**Tasks:**
- Build RN equivalents of shadcn/ui components
- Port Dashboard screen
- Port Lesson selection/briefing screens
- Port Profile screen
- Implement toast notifications
- Port language selection UI

**Deliverables:**
- Feature parity with web UI
- Consistent design language

---

### Phase 5: Polish & Platform Features

**Tasks:**
- Add PostHog analytics
- Implement share functionality
- Add clipboard support
- Handle background audio properly
- Performance optimization
- Accessibility review (VoiceOver, TalkBack)

**Deliverables:**
- Analytics tracking lesson starts/completions
- Native share sheets working
- Smooth performance on mid-range devices

---

### Phase 6: Testing & Launch

**Tasks:**
- Write unit tests for business logic
- E2E tests with Detox
- TestFlight beta testing
- Google Play internal testing
- App Store metadata and screenshots
- Submit for review

**Deliverables:**
- Apps live on App Store and Play Store

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| ElevenLabs SDK bugs | Medium | High | Use stable version, have fallback error states |
| OAuth deep link failures | Medium | Medium | Thorough testing, fallback to email auth |
| Audio quality issues on Android | Medium | High | Test across device range, audio focus handling |
| App Store rejection (AI disclosure) | Low | High | Clear app description, privacy policy |
| LiveKit WebRTC connection issues | Low | High | Retry logic, user-friendly error messages |
| Performance on low-end devices | Medium | Medium | Profile and optimize, set minimum OS versions |

---

## Resources

### Official Documentation

- [ElevenLabs React Native SDK](https://elevenlabs.io/docs/agents-platform/libraries/react-native)
- [Cross-platform Voice Agents with Expo](https://elevenlabs.io/docs/agents-platform/guides/integrations/expo-react-native)
- [ElevenLabs SDK GitHub](https://github.com/elevenlabs/packages/tree/main/packages/react-native)
- [LiveKit React Native](https://docs.livekit.io/home/quickstarts/expo/)

### React Native

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [NativeWind](https://www.nativewind.dev/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

### Supabase

- [Supabase React Native Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- [Supabase Auth with React Native](https://supabase.com/docs/guides/auth/native-mobile-deep-linking)

### Community Resources

- [Building Conversational AI in React Native with ElevenLabs (Medium)](https://medium.com/@pelumiogundipe905/how-i-bridged-elevenlabs-new-kotlin-sdk-into-react-native-to-build-a-real-time-conversational-ai-5d6fff104142)
- [ElevenLabs Examples Repository](https://github.com/elevenlabs/elevenlabs-examples)

---

## Summary

Deploying Poppa as a React Native app is highly feasible due to:

1. **Official ElevenLabs React Native SDK** with API nearly identical to the web SDK
2. **Expo support** with LiveKit WebRTC integration
3. **Backend compatibility** - all existing API routes work without modification
4. **Supabase RN support** - authentication and database queries are portable

The primary development effort will be:
- UI component migration from Radix/Tailwind to React Native equivalents
- OAuth deep linking configuration
- Platform-specific permission handling

The voice-first nature of Poppa is well-suited to mobile, where users can have immersive language lessons on the go with their phone's microphone and speakers.
