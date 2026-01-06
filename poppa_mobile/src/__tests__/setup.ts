import "@testing-library/jest-native/extend-expect";

jest.mock("@elevenlabs/react-native", () => ({
  ElevenLabsProvider: ({ children }: { children: React.ReactNode }) => children,
  useConversation: () => ({
    status: "disconnected",
    isSpeaking: false,
    startSession: jest.fn(),
    endSession: jest.fn(),
  }),
}));

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("react-native-permissions", () => ({
  check: jest.fn(),
  request: jest.fn(),
  PERMISSIONS: {
    IOS: { MICROPHONE: "ios.permission.MICROPHONE" },
    ANDROID: { RECORD_AUDIO: "android.permission.RECORD_AUDIO" },
  },
  RESULTS: {
    GRANTED: "granted",
    DENIED: "denied",
    BLOCKED: "blocked",
  },
}));

jest.mock("expo-localization", () => ({
  getLocales: () => [{ languageCode: "en" }],
}));

jest.mock("@livekit/react-native", () => ({
  registerGlobals: jest.fn(),
}));
