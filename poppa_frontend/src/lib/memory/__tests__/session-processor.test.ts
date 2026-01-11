/**
 * Tests for Session Processor
 */

import supabaseClient from "@/lib/supabase";

import { createMockSession } from "../__mocks__/test-helpers";
import { createLessonSession, endLessonSession } from "../session-processor";

// Mock the supabase client
jest.mock("@/lib/supabase", () => ({
  __esModule: true,
  default: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      upsert: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
    rpc: jest.fn().mockResolvedValue({ data: null, error: null }),
  },
}));

// Mock Anthropic
jest.mock("@anthropic-ai/sdk", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    messages: {
      create: jest.fn().mockResolvedValue({
        content: [
          {
            type: "text",
            text: JSON.stringify({
              vocabularyEvents: [
                {
                  term: "hola",
                  translation: "hello",
                  event_type: "introduced",
                  category: "greetings",
                },
                {
                  term: "adiós",
                  translation: "goodbye",
                  event_type: "correct",
                  category: "greetings",
                },
              ],
              grammarEvents: [],
              performanceMetrics: {
                overall_score: 0.85,
                fluency_score: 0.8,
                accuracy_score: 0.9,
              },
              highlights: [
                {
                  type: "milestone",
                  description: "First successful conversation!",
                },
              ],
              summary: "Student learned basic greetings and practiced them successfully.",
              recommendations: {
                review_concepts: [],
                introduce_next: ["present_tense"],
                suggested_focus: "Continue with basic introductions",
              },
            }),
          },
        ],
      }),
    },
  })),
}));

describe("session-processor", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createLessonSession", () => {
    it("should create a new lesson session", async () => {
      const mockSession = createMockSession();

      const mockChain = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockSession, error: null }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      const result = await createLessonSession({
        userId: "user-1",
        languageCode: "spa",
      });

      expect(supabaseClient.from).toHaveBeenCalledWith("lesson_sessions");
      expect(mockChain.insert).toHaveBeenCalled();
      expect(result.id).toBe(mockSession.id);
    });

    it("should include optional parameters when provided", async () => {
      const mockSession = createMockSession({
        curriculum_lesson_id: 5,
        lesson_title: "At the Restaurant",
        lesson_level: "beginner",
        custom_topic: "ordering food",
      });

      const mockChain = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockSession, error: null }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      await createLessonSession({
        userId: "user-1",
        languageCode: "spa",
        sessionType: "lesson",
        curriculumLessonId: 5,
        lessonTitle: "At the Restaurant",
        lessonLevel: "beginner",
        customTopic: "ordering food",
      });

      expect(mockChain.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          curriculum_lesson_id: 5,
          lesson_title: "At the Restaurant",
        })
      );
    });

    it("should throw error when insert fails", async () => {
      const mockChain = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: new Error("Insert failed"),
        }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      await expect(
        createLessonSession({
          userId: "user-1",
          languageCode: "spa",
        })
      ).rejects.toThrow();
    });
  });

  describe("endLessonSession", () => {
    it("should update session with end time and duration", async () => {
      const mockChain = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: null, error: null }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      await endLessonSession("session-1", 300);

      expect(supabaseClient.from).toHaveBeenCalledWith("lesson_sessions");
      expect(mockChain.update).toHaveBeenCalledWith(
        expect.objectContaining({
          duration_seconds: 300,
        })
      );
    });

    it("should set ended_at timestamp", async () => {
      const mockChain = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: null, error: null }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      await endLessonSession("session-1", 300);

      expect(mockChain.update).toHaveBeenCalledWith(
        expect.objectContaining({
          ended_at: expect.any(String),
        })
      );
    });
  });

  // Note: processSessionTranscript tests require complex mocking
  // of both Anthropic and Supabase, typically done in integration tests
});
