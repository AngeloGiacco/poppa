import PostHog from "posthog-react-native";

const posthogApiKey = process.env.EXPO_PUBLIC_POSTHOG_API_KEY;
const posthogHost = process.env.EXPO_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

export const posthog = posthogApiKey
  ? new PostHog(posthogApiKey, {
      host: posthogHost,
    })
  : null;

export const Analytics = {
  identify: (userId: string, properties?: Record<string, unknown>) => {
    posthog?.identify(userId, properties);
  },

  track: (event: string, properties?: Record<string, unknown>) => {
    posthog?.capture(event, properties);
  },

  lessonStarted: (properties: { language: string }) => {
    posthog?.capture("lesson_started", properties);
  },

  lessonCompleted: (properties: { language: string; durationMinutes: number }) => {
    posthog?.capture("lesson_completed", properties);
  },

  reset: () => {
    posthog?.reset();
  },
};
